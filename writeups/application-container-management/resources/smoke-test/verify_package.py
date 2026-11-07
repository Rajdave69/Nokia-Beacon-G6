#!/usr/bin/env python3
"""Validate this research fixture offline; never connects to or controls a router."""
import argparse
import gzip
import hashlib
import io
import json
import re
import struct
import tarfile
from pathlib import Path, PurePosixPath


def sha(data):
    return hashlib.sha256(data).hexdigest()


def verify(package):
    """Check digest/size/architecture/tar/runtime consistency, not installability."""
    layout = package / 'oci'
    report = json.loads((package / 'package.json').read_text(encoding='utf-8'))
    assert json.loads((layout / 'oci-layout').read_text()) == {'imageLayoutVersion': '1.0.0'}
    index = json.loads((layout / 'index.json').read_text())
    assert index['schemaVersion'] == 2 and len(index['manifests']) == 1
    checked = []

    def blob(descriptor):
        digest = descriptor['digest']
        assert re.fullmatch(r'sha256:[0-9a-f]{64}', digest)
        path = layout / 'blobs/sha256' / digest.split(':')[1]
        assert not path.is_symlink()
        data = path.read_bytes()
        assert sha(data) == digest.split(':')[1]
        assert len(data) == descriptor['size']
        checked.append({'digest': digest, 'bytes': len(data), 'mediaType': descriptor['mediaType']})
        return data

    manifest_bytes = blob(index['manifests'][0])
    assert manifest_bytes == (package / 'manifest.json').read_bytes()
    manifest = json.loads(manifest_bytes)
    assert manifest['schemaVersion'] == 2
    config_bytes = blob(manifest['config'])
    assert config_bytes == (package / 'image-config.json').read_bytes()
    config = json.loads(config_bytes)
    assert (config['os'], config['architecture']) == ('linux', 'arm64')
    assert index['manifests'][0]['platform'] == {'os': 'linux', 'architecture': 'arm64'}
    runtime_digest = manifest['annotations']['com.nokia.runtime.config']
    assert runtime_digest in [x['digest'] for x in manifest['layers']]
    assert config['rootfs']['type'] == 'layers'
    assert len(manifest['layers']) == len(config['rootfs']['diff_ids']) == 2
    files = {}; layers = []; runtime_bytes = None
    for descriptor, diff_id in zip(manifest['layers'], config['rootfs']['diff_ids']):
        compressed = blob(descriptor)
        assert descriptor['mediaType'] == 'application/vnd.oci.image.layer.v1.tar+gzip'
        uncompressed = gzip.decompress(compressed)
        assert diff_id == 'sha256:' + sha(uncompressed)
        members = []
        with tarfile.open(fileobj=io.BytesIO(uncompressed), mode='r:') as archive:
            names = set()
            for entry in archive:
                name = entry.name
                path = PurePosixPath(name)
                assert name and not path.is_absolute() and '..' not in path.parts and '\\' not in name
                assert name not in names and (entry.isdir() or entry.isfile())
                names.add(name)
                data = archive.extractfile(entry).read() if entry.isfile() else None
                members.append({'path': name, 'mode': oct(entry.mode), 'bytes': entry.size,
                                'type': 'file' if data is not None else 'directory'})
                files[name] = data
                if descriptor['digest'] == runtime_digest and name == 'config.json':
                    runtime_bytes = data
        layers.append({'digest': descriptor['digest'], 'diff_id': diff_id, 'members': members})
    assert runtime_bytes == (package / 'runtime.json').read_bytes()
    runtime = json.loads(runtime_bytes)
    assert runtime['process']['args'] == ['/lcm-smoke']
    assert runtime['root']['readonly'] is True and not runtime.get('hooks')
    elf = files['lcm-smoke']
    assert elf == (package / 'lcm-smoke').read_bytes()
    assert elf[:6] == b'\x7fELF\x02\x01' and struct.unpack_from('<H', elf, 18)[0] == 183
    phoff = struct.unpack_from('<Q', elf, 32)[0]
    phentsize, phnum = struct.unpack_from('<HH', elf, 54)
    assert not any(struct.unpack_from('<I', elf, phoff+i*phentsize)[0] == 3 for i in range(phnum)), 'PT_INTERP in purported static ELF'
    assert report['ELF_sha256'] == sha(elf) and report['ELF_bytes'] == len(elf)
    assert report['manifest_digest'] == 'sha256:' + sha(manifest_bytes)
    assert report['layers'] == manifest['layers']
    tag = index['manifests'][0]['annotations']['org.opencontainers.image.ref.name']
    version = manifest['annotations']['org.opencontainers.image.version']
    assert tag == report['tag'] == version == report['version'], 'Tag/version mismatch: failed first attempt used smoke-v1'
    expected_dirs = {'tmp','run','proc','sys','sys/fs/cgroup','dev/pts','dev/shm','etc','persistent-data','temporary-data'}
    assert expected_dirs <= {p for p,data in files.items() if data is None}
    assert runtime['mounts'] == [], 'Successful fixture relies on stock mount defaults'
    return {'schema_version': 1, 'scope': 'Offline validation of the successful fixture format; no registry connection, router operation or publisher-signature validation',
            'passed': True, 'blob_count': len(checked), 'blobs': checked, 'layers': layers,
            'ELF_bytes': len(elf), 'ELF_sha256': sha(elf), 'ELF_machine': 'AArch64', 'ELF_has_PT_INTERP': False,
            'manifest_digest': report['manifest_digest'], 'tag': tag, 'version': version,
            'application_UUID': report['application_UUID'], 'runtime': runtime}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--package', required=True, type=Path)
    parser.add_argument('--out', type=Path)
    args = parser.parse_args()
    result = verify(args.package)
    text = json.dumps(result, indent=2) + '\n'
    if args.out:
        args.out.write_text(text, encoding='utf-8')
    else:
        print(text, end='')


if __name__ == '__main__':
    main()
