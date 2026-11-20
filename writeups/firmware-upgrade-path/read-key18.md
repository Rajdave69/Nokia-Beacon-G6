# Reading key18 from an already-rooted G6

The existing `read-config-key.c` helper calls the same
`SE_getKeyByName("key18", ...)` API used by the firmware decryptor. It writes the
full returned string, hex-encoded as `key18_hex`, into a new private JSON file.
The helper queries the stock libraries and RI; it does not regenerate security
material or change router configuration. Its only explicit file write is the
requested output file.

From the G6 project root, use
[`network-services/webui/scripts/read-config-key.c`](../../network-services/webui/scripts/read-config-key.c). Build in
WSL against the G6's extracted runtime libraries so a newer workstation glibc
does not introduce symbols unavailable on the router:

```sh
mkdir -p config-private
aarch64-linux-gnu-gcc -Wall -Wextra -Werror -Os \
  -Wl,--dynamic-linker=/lib/ld-linux-aarch64.so.1 \
  -o config-private/read-config-key-g6 network-services/webui/scripts/read-config-key.c \
  dumped-firmware/router-flash-G6-A/old/rom/rom/lib/libdl.so.2 \
  dumped-firmware/router-flash-G6-A/old/rom/rom/lib/libc.so.6
```

This command was checked with the local cross compiler: the resulting reader
requires GLIBC_2.17 symbols and starts under the stock G6 glibc 2.27 loader in
QEMU. That verifies startup compatibility, not a live key lookup. The Beacon 9
musl-loader binary is a different build.

Copy the matching binary to the router as `/tmp/read-config-key`. In its root
shell, run:

```sh
chmod 700 /tmp/read-config-key
LD_LIBRARY_PATH=/usr/lib:/lib /tmp/read-config-key /tmp/live-config-keys.json
```

The output path must not already exist. The helper creates it with mode 0600
and prints no secrets. It reports an unavailable key on stderr and records an
empty string when the lookup fails. A successful JSON write alone does not mean
that key18 was present.

Copy `/tmp/live-config-keys.json` back to
`config-private/live-config-keys.json` on the workstation. To extract the full
key into a separate new private file, run from the project root:

```sh
python3 - <<'PYKEY'
import json
import os
from pathlib import Path

inputs = json.loads(Path("config-private/live-config-keys.json").read_text())
key = bytes.fromhex(inputs["key18_hex"])
if not key:
    raise SystemExit("key18 unavailable or empty; no key file written.")
fd = os.open("config-private/key18.bin", os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
with os.fdopen(fd, "wb") as stream:
    stream.write(key)
print(f"Saved full key18 ({len(key)} bytes) to config-private/key18.bin")
PYKEY
```

`key18.bin` contains the original string bytes, without a trailing NUL or
newline. The JSON's hexadecimal text is an encoding of those bytes, not the
value to pass directly as the firmware password. Keep the entire decoded value;
firmware decryption does not use the configuration export's sixteen-byte slice.

The Beacon 9 owner previously ran this reader and obtained a nonempty key18.
On 2026-10-19 the owner also supplied the live G6 reader output. Its key18_hex
is empty. All five fields match the profile recovered from the older G6 files,
and the live inputs authenticate the existing G6 backup with 13,209 records.
The result is therefore consistent with the earlier captures, rather than an
assumption based only on an old file.

The original helper conflates unavailable/null keys with successful empty-string
lookups. The later metadata diagnostic resolves this case: key18 returns status
608, key17 is available, and the current logical SECURITY record parses with ten
fields and no EXT_KEY_FW. The normal input file is absent and sec_extfs is
unavailable through PATH. This identifies a failed lookup and missing input on
this unit. The original firmware crypto also rejects a zero-length password;
an empty field is not a usable encryption profile.

A real G6 key is not needed to continue disassembling the validator, reconstruct
packaging, or test control flow with synthetic fixtures. It is needed to prepare
an encrypted payload for that actual router and evaluate this route beyond the
synthetic-key result. For the next static investigation, reporting whether the
lookup is available and its byte length is sufficient; sharing the secret is
not required.

The [key18 provenance follow-up](../security-keys/README.md#following-the-missing-firmware-key-input) checks the G6's
actual NAND record and the retained loader. The saved SECURITY copies lack
EXT_KEY_FW, and the captured ROM lacks its extractor. Synthetic native tests
confirm the loader works with valid input and that an empty firmware password
is rejected. The owner also supplied the metadata diagnostic's live result:
no EXT_KEY_FW in the successfully parsed current record, no firmware-key file,
and lookup status 608. The follow-up records those observations and their scope.
