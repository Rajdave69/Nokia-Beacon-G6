#!/usr/bin/env python3
"""Recheck pinned G6 HJL files/constants without executing firmware or networking."""
from pathlib import Path
import argparse, hashlib, json, struct

def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--root", type=Path, required=True, help="complete HJL extracted rootfs")
    ap.add_argument("--out", type=Path, required=True)
    args = ap.parse_args()
    expected = json.loads(Path(__file__).with_name("evidence.json").read_text())
    rows = {}
    for rel, info in expected["profiles"]["HJL"]["files"].items():
        data = (args.root/rel).read_bytes()
        digest = hashlib.sha256(data).hexdigest()
        if len(data) != info["bytes"] or digest != info["sha256"]:
            raise ValueError("Source profile/hash mismatch: " + rel)
        rows[rel] = {"source": "private-source://PROFILE-G6-HJL/"+rel,
                     "bytes": len(data), "sha256": digest}
    # These instruction offsets are pinned to the exact hashes above.
    def movz_u16(rel, offset):
        word = struct.unpack_from("<I", (args.root/rel).read_bytes(), offset)[0]
        if word & 0x7f800000 != 0x52800000:
            raise ValueError("Expected AArch64 MOVZ instruction")
        return (word >> 5) & 0xffff
    constants = {
        "TCP_port": movz_u16("usr/lib/libwebsocket.so", 0xb10c),
        "Unix_socket_mode_decimal": movz_u16("usr/bin/websocket", 0x2e54),
        "Analytics_object_header_id": movz_u16("webs/websoc_session_web_app.cgi", 0xc14),
        "Analytics_buffer_bytes": movz_u16("webs/websoc_session_web_app.cgi", 0xbf8),
    }
    assert constants == {"TCP_port":8099, "Unix_socket_mode_decimal":416,
                         "Analytics_object_header_id":625, "Analytics_buffer_bytes":547}
    result = {"scope":"offline fingerprints and four instruction constants only; no router request, process launch or runtime/API claim",
              "source_count":len(rows), "files":rows, "constants":constants}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(result, indent=2)+"\n")
    print(json.dumps({"source_count":len(rows), "constants":constants}))

if __name__ == "__main__":
    main()
