# The router's stored configuration database

The WebUI can download a settings backup, but what does the router keep in its own storage between boots? In the examined HomeOS firmware, a file named `dmdb_encryption.cfg` holds a **binary management database** in an encrypted container. It is related to the settings exported by the WebUI, but it is a different file format with a different key path.

That distinction matters when examining a capture. A WebUI `config.cfg` cannot be decoded by simply treating it as `dmdb_encryption.cfg`, and the router's stored file is not automatically a WebUI-importable backup. This article explains how to tell them apart, what was recovered from saved files and what those offline results do, and do not show.

The primary G6 software examined is HomeOS 24.04 `HJL.L91p01`, with saved G6 data also compared against HomeOS 24.02 `IJL.J03p01`. Cross-product results include the XS-2426X-A HomeOS 24.03 builds and the Beacon 9 HomeOS 25.03 `JJM.K44p01`. These are captured files and offline checks, not proof of live restore behavior across those products. Device labels follow the [project aliases](../README.md#device-aliases).

## One set of settings, two representations

The management system uses a data model: a hierarchy of objects and parameters representing settings and state. In the examined G6 24.04 firmware, `ndbd` participates in the management database, while `cfgmgr` handles configuration operations. The stored database is one part of that system's persistent state; it is not a raw copy of every file on the device.

A browser export is generated from management records for a different purpose. It serializes records, compresses them, and encrypts them for download. The stored database instead decrypts to a Nokia binary database with its own internal structure.

|                                    | Stored database                               | WebUI export                                                             |
|------------------------------------|-----------------------------------------------|--------------------------------------------------------------------------|
| Example                            | `/configs/dmdb_encryption.cfg` and its `.bak` | Browser download `config.cfg`                                            |
| Container magic                    | `0x124126`                                    | `0x123123`                                                               |
| Examined encryption path           | key10-derived AES-CBC container               | Export inputs followed by AES-GCM                                        |
| After decryption and decompression | Binary database, magic `0x1008efab`           | NUL-delimited management records                                         |
| Evidence here                      | Saved-file decoding and structural checks     | Two exports authenticated and decoded; original bytes reproduced offline |

Both can contain sensitive settings. Neither should be treated as a complete NAND or filesystem backup. The [WebUI export writeup](../configuration-import-export/README.md) follows the browser format, its record language and import limits; the [storage writeup](../storage-and-flash/README.md) describes the wider flash layout.

## Recognizing a saved database

The current stored-file container begins with a 40-byte header of five little-endian 64-bit values. For the examined `0x124126` files, the fields include the magic, encrypted payload length, CRC32 of that payload, expected decompressed length and a version token. The payload then contains a `0xff` marker, an eight-byte salt and AES-256-CBC ciphertext.

For one specific file from G6-A's old ROM capture, `configs/dmdb_encryption.cfg` was 128,737 bytes and began with bytes `26 41 12 00`—the little-endian representation of `0x124126`. Its header declared a 128,697-byte encrypted container and a 368,961-byte decompressed database. The decoder produced a binary database with 669 objects, and the saved plaintext matches the independently recorded digest. This identifies **that file**, not every file with the same name and not a separate file called `confignew.cfg`. Exact fingerprints are retained in the [knowledgebase](../../knowledgebases/configuration-import-export.md).

## How key10 opens the examined files

The saved `0x124126` format uses key10 on the traced G6 24.04 `HJL.L91p01` path. Key10 is itself derived from device-specific inputs; knowing a model or release is not sufficient to recreate it. For the verified G6 profile, the derivation takes the exact RI serial source and programming-date source, appends an effective value called `source5`, and applies:

```text
key10 = first 64 characters of Base64(
    PBKDF2-HMAC-SHA256(serial + programming date + source5,
                       salt "key10", 100 iterations, 64 bytes)
)
```

The source text and case matter. In the examined G6 captures, the effective missing-source5 fallback was the literal `invalid_key_src5_str`. That is an observed profile, not a promise that source5 is absent on every HomeOS device.

The resulting 64 ASCII bytes are the password input for a **second** derivation, using the individual file's eight-byte salt. That step uses PBKDF2-HMAC-SHA256 with 10 iterations and produces 48 bytes: a 32-byte AES key and 16-byte IV. After CBC decryption and PKCS#7 unpadding, the content is decompressed with zlib into the binary database. The checked path does not have the security-database container's embedded SHA-256 prefix.

The decoder checks the outer length and CRC, padding, zlib stream and expected length, and bounds in the binary database header. These are valuable structural checks, but **they are not a GCM tag, a verified MAC or a digital signature**. They support the reported decoding of the captured files; they do not provide authenticated-encryption guarantees or prove that a database is safe to restore.

Older code also refers to key9. In the examined G6 24.04 and Beacon 9 25.03 reader traces, legacy magic `0x124125` selects key9 while `0x124126` selects key10. No real legacy `0x124125` file was decoded in that comparison. The [security-key map](../security-keys/README.md) distinguishes those consumers from the WebUI export keys.

## What was verified across captures

The key10/CBC reconstruction decoded saved G6 database files from four units, using each capture's own RI source values and the observed missing-source5 fallback. Some primary files matched their saved `.bak` copies; equality within a pair does not by itself establish that either is current or safe to restore. Different saved states and firmware builds must be attributed to their own captures. The [G6 comparison](../comparing-other-g6-routers/README.md#stored-databases-and-webui-backups-are-different-formats) records the source-pinned checks.

The XS-2426X-A HomeOS 24.03 comparison supplied a different effective source5 path. There, the investigated factory parser selects usable decoded factory fields, concatenates their bytes, hashes them with SHA-256 and Base64-encodes the result. The resulting source5, together with that device's RI serial and programming date, derives key10. The reconstruction decoded supplied ONT stored files and the four saved Beacon 9 HomeOS 25.03 `JJM.K44p01` database files using their own factory-derived inputs. An earlier Beacon 9 trial using the G6 missing-source5 literal failed; it remains a useful negative control rather than the current conclusion. [ONT and cross-product evidence](../xs2426xa-24-03-comparison/resources/ota-research.json).

These comparisons change both release and, in the cross-product cases, hardware and factory provisioning. They show which supplied inputs decoded which saved files; they do not by themselves assign every difference to a HomeOS version, model or operator. In particular, stored-file key10 results do not establish the key18 inputs for a WebUI export. No ONT WebUI export or live key18 lookup was supplied for that comparison.

## What can be learned from the decoded database?

The result of decryption is still **binary**, not the WebUI export's record stream or a ready-to-edit text file. Its header and object structures can be checked, and a bounded parser has read a fixed allowlist of saved OTA and identity scalar values, including a nonexistent-URI control. That parser does not establish generic database editing, current account passwords or a successful restore. A saved value is also a snapshot: it does not by itself show that a service is running or that the file is the state currently used on a device.

The distinction matters during recovery. In a G6 24.04 `HJL.L91p01` early-shell session, I mounted the configuration volume read-only and observed a database pair differing from an earlier normal-boot pair. UBIFS reported that recovery was needed and deferred. That observation does not establish which logical state is newer or what a subsequent normal boot will expose. Read/write recovery and restoration have not been validated. [UART recovery investigation](../uart-recovery-from-uboot/README.md).

## Decode a captured G6 file offline

For a matching G6 profile, the [stored-database decoder](resources/decrypt-stored-config.py) can derive key10 and decode a copy without contacting a router. It needs Python 3 and the `cryptography` package. From the G6 repository root, set `DMDB_PATH` to the saved file, `RI_SERIAL` to that device's exact eight-character `G984Serial` source spelling, and `RI_PROGDATE` to its exact six-character `ProgDate`. The default source5 is the missing-source fallback verified in the examined G6 captures.

```sh
python3 writeups/stored-configuration-database/resources/decrypt-stored-config.py "$DMDB_PATH" \
  config-private/dmdb.decoded.bin \
  --serial-source "$RI_SERIAL" \
  --programming-date "$RI_PROGDATE"
```

If the file's originating profile used a different, independently verified effective source5, supply its exact bytes in a private file with `--source5-file`. Do not guess or transfer another device's factory-derived value. The decoder creates a new output and refuses to overwrite an existing file. Its output can contain sensitive settings and credentials; keep it private.

This helper decodes the outer stored container and checks the resulting binary structure. It does not contact a router, edit the database, import it or prove that a restored file would boot. Matching-format files and correct inputs can be processed offline, but that does not provide an unprivileged way to obtain a protected database or its necessary inputs.

For exact fixture identities, negative cases and source traces, use the [configuration research knowledgebase](../../knowledgebases/configuration-import-export.md), [structured evidence](../../knowledgebases/configuration-import-export-evidence.json) and [cross-product evidence](../xs2426xa-24-03-comparison/resources/ota-research.json).
