#!/usr/bin/env python3
"""Check saved experiment documentation offline. Does not open network sockets."""
import argparse
import ast
import hashlib
import importlib.util
import json
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[3]


def read(name):
    return json.loads((HERE / name).read_text(encoding='utf-8'))


def output(record):
    text = record.get('normalized_text', record.get('normalized_json', {}).get('stdout', ''))
    text = text.replace('\r\r\n', '\n').replace('\r\n', '\n')
    endings = list(re.finditer(r'^> LCM_SCRIPT_[0-9a-f]+\s*$', text, re.M))
    if endings:
        text = text[endings[-1].end():]
    return text.split('/lib/firmware # _lcm_smoke_rc=', 1)[0]


def models(text):
    decoder = json.JSONDecoder(); result = {}
    for match in re.finditer(r'^\s*\{', text, re.M):
        try:
            obj, _ = decoder.raw_decode(text[match.end()-1:])
        except ValueError:
            continue
        if isinstance(obj, dict):
            result.update({k:v for k,v in obj.items() if k.startswith(('SoftwareModules.', 'Cthulhu.', 'Rlyeh.'))})
    return result


def validate(private=False):
    evidence = read('evidence.json')
    captures = read('normalized-captures.json')['records']
    inventory = read('retained-evidence.json')['files']
    by_name = {x['source'].rsplit('/',1)[-1]:x for x in captures}
    active_text = output(by_name['active-details-timeout-output.bin'])
    active = models(active_text)
    eu = [v for k,v in active.items() if k.startswith('SoftwareModules.ExecutionUnit.') and v.get('EUID')]
    containers = [v for k,v in active.items() if k.startswith('Cthulhu.Container.Instances.') and v.get('ContainerId')]
    assert len(eu) == len(containers) == 1
    assert eu[0]['Status'] == 'Active' and eu[0]['AutoStart'] is False
    assert containers[0]['Status'] == 'Running'
    assert eu[0]['EUID'] == evidence['application']['observed_DUID_EUID_ContainerId']
    assert containers[0]['LinkedUUID'] == evidence['application']['UUID']
    assert eu[0]['AllocatedMemory'] == 16384 and eu[0]['AllocatedCPUPercent'] == 10
    assert active_text.count('net:[4026531945]') == 2
    assert '\n40000\n100000\n16777216\n' in active_text
    assert 'beacon-lcm-smoke self-test ok' in active_text
    running = output(by_name['verify-running-v3-result.json'])
    assert re.search(r'^State:\s+RUNNING$', running, re.M)
    assert 'beacon-lcm-smoke 0.0.1 started' in running
    assert re.search(r'^CapEff:\s+0000003fffffffff$', running, re.M)
    assert re.search(r'^NoNewPrivs:\s+0$', running, re.M)
    stopped = output(by_name['remove-final-result.json'])
    assert re.search(r'^State:\s+STOPPED$', stopped, re.M)
    assert '"RetainData":false' in stopped
    final = models(output(by_name['verify-cleanup-result.json']))
    assert not any(v.get('EUID') or v.get('UUID') or v.get('ContainerId') for v in final.values())
    assert final['SoftwareModules.ExecEnv.1.']['Status'] == 'Up'
    assert final['SoftwareModules.ExecEnv.1.']['AvailableDiskSpace'] == 985
    assert final['Rlyeh.']['CertificateVerification'] is False
    assert final['Rlyeh.']['SignatureVerification'] is False
    sandbox = models(output(by_name['inspect-sandboxes-result.json']))
    actual = [v for v in sandbox.values() if v.get('SandboxId')]
    assert len(actual) == 1 and actual[0]['SandboxId'] == 'generic' and actual[0]['Status'] == 'Up'
    cleanup = output(by_name['cleanup-empty-data-result.json'])
    assert 'HOST_TMP_MARKER_ABSENT' in cleanup and 'CACHED:' not in cleanup
    offline = read('offline-validation.json')
    assert offline['retained_package_validation']['passed'] is True
    assert all(x['qemu_exit'] == 0 for x in offline['rebuilds']) and len(offline['rebuilds']) == 2
    assert offline['original_payload_byte_comparison']['passed'] is True
    assert offline['retained_package_validation']['manifest_digest'] == evidence['application']['final_manifest_digest']
    for p in HERE.glob('*.py'):
        ast.parse(p.read_text(encoding='utf-8'), filename=p.name)
    withheld_checked = 0
    if private:
        helper = ROOT/'writeups/security-keys/resources/publication_aliases.py'
        if not helper.is_file():
            helper = ROOT.parent/'Nokia-Beacon-G6/writeups/security-keys/resources/publication_aliases.py'
        spec = importlib.util.spec_from_file_location('publication_aliases', helper)
        aliases = importlib.util.module_from_spec(spec); spec.loader.exec_module(aliases)
        for item in inventory:
            data = aliases.source_path(item['source']).read_bytes()
            assert len(data) == item['bytes']
            assert hashlib.sha256(data).hexdigest() == aliases.private_value(item['sha256_alias'])
            withheld_checked += 1
        for item in captures:
            raw = aliases.source_path(item['source']).read_bytes().decode('utf-8')
            if 'normalized_json' in item:
                assert aliases.public_record(json.loads(raw)) == item['normalized_json']
            elif 'normalized_json_lines' in item:
                assert [aliases.public_record(json.loads(line)) for line in raw.splitlines() if line] == item['normalized_json_lines']
            else:
                assert aliases.public_record(raw) == item['normalized_text']
        corpus = '\n'.join(x.read_text(encoding='utf-8') for x in HERE.iterdir() if x.is_file() and x.suffix in {'.md','.json','.py','.c'})
        forbidden = [v['serial'] for v in aliases.registry()['devices'].values() if isinstance(v,dict) and v.get('serial')]
        forbidden += [aliases.private_value(k) for k in aliases.registry()['private_values'] if k.startswith('TIME-LCM-')]
        assert not any(s in corpus for s in forbidden)
        assert not re.search(r'(?<![\d.])192\.168\.18\.[12](?!\d)', corpus)
        assert not re.search(r'-----BEGIN (?:RSA |EC )?PRIVATE KEY-----\s+[A-Za-z0-9+/=]{20}', corpus)
    return {'schema_version':1, 'date':'2026-10-29', 'scope':'Offline saved-evidence and documentation checks only; no router or registry contacted',
            'passed':True, 'complete_normalized_captures':len(captures), 'retained_private_files':len(inventory),
            'private_original_fingerprints_checked':withheld_checked, 'fixture_attempts':len(read('fixtures.json')['fixtures']),
            'active_stopped_removed_proof_checked':True, 'effective_limits_and_isolation_checked':True,
            'cleanup_and_unchanged_verification_flags_checked':True, 'private_public_normalization_roundtrips_checked':private,
            'private_identifiers_and_TLS_key_absent_from_smoke_test_publication':private, 'offline_rebuilds_match_original':2}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--private-sources', action='store_true', help='Requires ignored mapping and protected original captures')
    parser.add_argument('--out', type=Path)
    args = parser.parse_args()
    result = validate(args.private_sources)
    text = json.dumps(result, indent=2) + '\n'
    if args.out:
        args.out.write_text(text, encoding='utf-8')
    print(text, end='')


if __name__ == '__main__':
    main()
