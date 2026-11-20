#!/usr/bin/env python3
"""Offline command-table inventory for the two captured G6 BL33 binaries.

Reads linked command records, not only strings. Does not execute U-Boot or
contact a router. The layout follows U-Boot v2020.04 cmd_tbl_s on AArch64.
"""
import argparse
import hashlib
import json
from pathlib import Path
import re
import struct

BASE = 0x4000000
KNOWN = {
    "1d7ea6b9285f895acaa8f030375b8184428e400d07ee2925b0c4eea51aa2a190": "G6-A",
    "08e49885442d61a7b3b356421b6fcd9572aec290c15e04c56494d23b191181e1": "G6-B",
}

def inspect(path):
    data = path.read_bytes()
    digest = hashlib.sha256(data).hexdigest()
    if digest not in KNOWN:
        raise ValueError("Unsupported BL33 SHA256; do not assume this layout")
    def text(address, limit=8192):
        offset = address - BASE
        if not 0 <= offset < len(data):
            return None
        value = data[offset:offset + limit].split(b"\0", 1)[0]
        if not value or any(c not in (9, 10, 13) and not 32 <= c < 127 for c in value):
            return None
        return value.decode("ascii")
    entries = []
    for offset in range(0, len(data) - 55, 8):
        nameptr, maxargs, pad, repeat, handler, usage, help_ptr, complete = struct.unpack_from("<QIIQQQQQ", data, offset)
        if not (1 <= maxargs <= 128 and BASE <= handler < BASE + len(data) and BASE <= repeat < BASE + len(data)):
            continue
        if complete and not BASE <= complete < BASE + len(data):
            continue
        name, summary = text(nameptr, 100), text(usage)
        if not name or not re.fullmatch(r"[A-Za-z0-9_?.-]{1,32}", name) or not summary:
            continue
        entries.append({"name": name, "entry": hex(BASE + offset), "handler": hex(handler), "maxargs": maxargs, "usage": summary, "help": text(help_ptr)})
    names = [item["name"] for item in entries]
    if len(names) != len(set(names)) or len(names) != 85:
        raise ValueError("Unexpected command table; inspect manually")
    return {"source": str(path), "sha256": digest, "device_dump": KNOWN[digest], "command_count": len(entries), "commands": entries}

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("bl33", type=Path, nargs="+")
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    result = {"schema_version": 1, "scope": "Offline linked command records only; not command execution or proof of flash/boot success", "layout_source": "https://raw.githubusercontent.com/u-boot/u-boot/v2020.04/include/command.h", "images": [inspect(path) for path in args.bl33]}
    with args.output.open("x", encoding="utf-8") as stream:
        json.dump(result, stream, indent=2)
        stream.write("\n")
    print("Saved command-table inventory; no firmware executed.")

if __name__ == "__main__":
    main()
