#!/usr/bin/env python3
"""Recover a G6 SquashFS volume from a supplied raw UBI dump, offline.

The original NAND file is never edited. This is a recovery helper for the
observed 256 KiB-PEB G6 layout, not a general UBI repair implementation.
"""
import argparse
import hashlib
from pathlib import Path
import struct
import subprocess
import tempfile


def recover_image(data, volume_id=1, erase_size=0x40000):
    if data[:4] == b"hsqs":
        image = data
    else:
        blocks = {}
        for offset in range(0, len(data), erase_size):
            if data[offset:offset + 4] != b"UBI#":
                continue
            vid_offset, data_offset = struct.unpack_from(">II", data, offset + 16)
            if not 64 <= vid_offset < data_offset < erase_size:
                raise ValueError("unsupported UBI header offsets")
            vid = offset + vid_offset
            if data[vid:vid + 4] != b"UBI!":
                continue
            vol, logical = struct.unpack_from(">II", data, vid + 8)
            if vol != volume_id:
                continue
            padding = struct.unpack_from(">I", data, vid + 28)[0]
            sequence = struct.unpack_from(">Q", data, vid + 40)[0]
            if padding >= erase_size - data_offset:
                raise ValueError("invalid UBI data padding")
            payload = data[offset + data_offset:offset + erase_size - padding]
            if logical not in blocks or sequence > blocks[logical][0]:
                blocks[logical] = (sequence, payload)
        if not blocks or set(blocks) != set(range(max(blocks) + 1)):
            raise ValueError("missing logical eraseblocks; refusing a partial image")
        image = b"".join(blocks[i][1] for i in range(len(blocks)))
    if len(image) < 96 or image[:4] != b"hsqs":
        raise ValueError("selected volume is not SquashFS")
    used = struct.unpack_from("<Q", image, 40)[0]
    if not 96 <= used <= len(image):
        raise ValueError("invalid SquashFS used-byte count")
    return image[:used]


def compatible_copy(image):
    """Ignore the observed vendor's 12-byte XZ options in a temporary copy.

    Stock unsquashfs 4.7.5 rejects these options. XZ blocks carry their own
    decoding parameters; clearing only COMP_OPT leaves all table offsets and
    compressed data unchanged. Reject other extension layouts.
    """
    result = bytearray(image)
    flags = struct.unpack_from("<H", result, 24)[0]
    changed = False
    if flags & 0x400:
        compressor = struct.unpack_from("<H", result, 20)[0]
        stored = struct.unpack_from("<H", result, 96)[0]
        if compressor != 4 or stored != 0x800C:
            raise ValueError("unrecognized compressor-options extension")
        struct.pack_into("<H", result, 24, flags & ~0x400)
        changed = True
    return result, changed


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("dump", type=Path)
    parser.add_argument("destination", type=Path, help="new directory; must not exist")
    parser.add_argument("--volume", type=int, default=1)
    args = parser.parse_args()
    if args.destination.exists():
        parser.error("destination already exists; refusing to merge or overwrite")
    data = args.dump.read_bytes()
    image = recover_image(data, args.volume)
    compatible, changed = compatible_copy(image)
    print(f"Original dump SHA256: {hashlib.sha256(data).hexdigest()}")
    print(f"Original SquashFS: {len(image)} bytes; SHA256 {hashlib.sha256(image).hexdigest()}")
    print(f"Temporary COMP_OPT workaround applied: {changed}")
    with tempfile.TemporaryDirectory(prefix="g6-squashfs-") as temp:
        path = Path(temp) / "rootfs.squashfs"
        path.write_bytes(compatible)
        # Exclude pseudo-filesystems/device nodes by selecting research trees.
        result = subprocess.run(["unsquashfs", "-no-progress", "-d",
                                 str(args.destination), str(path),
                                 "etc", "usr", "lib", "sbin", "webs", "root"], check=False)
        if result.returncode:
            raise SystemExit(result.returncode)
    print("Recovered research directories; no firmware was executed.")


if __name__ == "__main__":
    main()
