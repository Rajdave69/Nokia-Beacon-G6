#!/usr/bin/env python3
"""Compare G6 static keys and factory metadata; never print secret values.

Needs Python cryptography. Example firmware labels may be repeated:
  --rom first=PATH --rom second=PATH --rom older=PATH
Factory inputs use --dumps first=DIR --dumps second=DIR.
The output is JSON containing equality, lengths, names, hashes and identity.
"""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import re
import sys


def load_prepare():
    path = Path(__file__).resolve().parents[3] / "network-services/webui/scripts/prepare-config-keys.py"
    spec = importlib.util.spec_from_file_location("prepare_config_keys", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def labelled(value):
    label, separator, path = value.partition("=")
    if not label or not separator or not path:
        raise argparse.ArgumentTypeError("expected LABEL=PATH")
    return label, Path(path)


def factory_records(data):
    results, values = [], None
    for match in re.finditer(rb"KV[0-9]{8}EXT_OPID", data):
        start = match.start()
        record = data[start:start + 8192]
        pos, fields, current = 0, [], {}
        while pos < len(record) and record[pos]:
            header = record[pos:pos + 10]
            if len(header) != 10 or header[:2] != b"KV" or not header[2:].isdigit():
                raise ValueError("malformed factory KV header")
            flag, name_size, value_size = int(header[3:4]), int(header[4:6]), int(header[6:10])
            if not name_size or pos + 10 + name_size + value_size > len(record):
                raise ValueError("malformed factory KV length")
            name = record[pos + 10:pos + 10 + name_size].decode("ascii")
            value = record[pos + 10 + name_size:pos + 10 + name_size + value_size]
            fields.append(dict(name=name, flag=flag, stored_value_bytes=value_size))
            current[name] = (flag, value)
            pos += 10 + name_size + value_size
        if not fields or pos >= len(record):
            raise ValueError("missing factory record terminator")
        if values is not None and values != current:
            raise ValueError("factory copies disagree; do not infer an active record")
        values = current
        results.append(dict(offset=hex(start), record_end=hex(pos),
                            sha256=hashlib.sha256(record).hexdigest(), fields=fields))
    if not results:
        raise ValueError("no supported SECURITY records found")
    return results, values


def identity(data):
    result = {}
    for name in ["G984Serial", "ProgDate", "Mnemonic", "OperatorID", "HardwareVersion", "PartNumber"]:
        marker = name.encode("ascii")
        copies = []
        for block in range(0, len(data), 0x40000):
            for pos in range(block, min(block + 0x2000, len(data)), 128):
                if data[pos:pos + 64].split(b"\0", 1)[0] == marker:
                    copies.append(data[pos + 64:pos + 128].split(b"\0", 1)[0].decode("ascii"))
        if not copies or len(set(copies)) != 1:
            raise ValueError(f"missing or inconsistent RI {name}")
        result[name] = copies[0]
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--rom", action="append", type=labelled, required=True)
    parser.add_argument("--dumps", action="append", type=labelled, default=[])
    parser.add_argument("--output", type=Path, help="new metadata JSON; never overwritten")
    args = parser.parse_args()
    prepare = load_prepare()
    config = prepare.backup_module()
    keys, report = {}, dict(schema_version=1, static_stores={}, factory_stores={})
    for label, root in args.rom:
        if label in keys:
            parser.error("duplicate ROM label")
        keys[label] = dict(prepare.static_keys(root, config))
        version = prepare.ini((root / "usr/etc/se.conf").read_bytes())["keys"]
        report["static_stores"][label] = dict(
            integrity_passed=True,
            version_sources={k:version[k] for k in ["keysrc0", "versrc0"] if k in version},
            sec_key_sha256=hashlib.sha256((root / "usr/etc/sec.key").read_bytes()).hexdigest(),
            key18_present="key18" in keys[label])
    report["static_key_comparison"] = [dict(
        name=name,
        stored_string_bytes={label:len(store[name].encode("ascii")) if name in store else None
                             for label,store in keys.items()},
        all_equal=len({store.get(name) for store in keys.values()}) == 1)
        for name in sorted(set().union(*(set(store) for store in keys.values())))]
    factory = {}
    for label, directory in args.dumps:
        if label in factory:
            parser.error("duplicate factory label")
        data = (directory / "mtd09_extfs.bin").read_bytes()
        records, values = factory_records(data)
        factory[label] = values
        report["factory_stores"][label] = dict(
            extfs_sha256=hashlib.sha256(data).hexdigest(),
            identity=identity((directory / "mtd02_RI.bin").read_bytes()),
            copies=records,
            EXT_KEY_FW_present="EXT_KEY_FW" in values,
            EXT_DBG_PWD_present="EXT_DBG_PWD" in values)
    if factory:
        report["factory_field_comparison"] = [dict(name=name,
            stored_representation_equal=len({v.get(name) for v in factory.values()}) == 1)
            for name in sorted(set().union(*(set(v) for v in factory.values())))]
    output = (json.dumps(report, indent=2) + "\n").encode()
    if args.output:
        with args.output.open("xb") as handle:
            handle.write(output)
        print(f"Wrote metadata to {args.output}; no secret values were printed.")
    else:
        sys.stdout.buffer.write(output)


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError, KeyError) as error:
        raise SystemExit(f"error: {error}")
