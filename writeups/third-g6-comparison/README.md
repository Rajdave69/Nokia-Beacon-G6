# What the third Beacon G6 added to the investigation

The third router, `ALCLFDE30B70`, did not bring another Linux firmware build.
Both of its banks contain the HJL.L91 image we already had. It did bring a more
complete flash capture, another original boot-password sample, and enough
persistent data to settle a separate question: how the router encrypts its
stored configuration database.

The owner reports changing only the LAN IP to `192.168.28.1` before this dump.
There are no reported owner changes to the firmware, boot password, UART,
Linux accounts or startup hooks. That makes it a useful comparison with the
first two routers, whose later captures include deliberate access changes.
It does not make every saved setting a factory default; normal operation and
operator provisioning leave their own history.

## Both banks are the existing HJL.L91 build

| Item                                   | Third G6 finding                          |
|----------------------------------------|-------------------------------------------|
| Selected Linux bank                    | `rootfs0`                                 |
| Active/committed/executed image fields | All `0` in both saved environment records |
| Selected configuration store           | `rootfs_data1`                            |
| Both rootfs images                     | `3FE49996HJLL91` / `HJL.L91p01`           |
| Build date                             | 27 December 2024                          |
| HomeOS train                           | `24.04.00`                                |
| Signing/encryption flags               | `SIGN=y`, `ENCRYPT=n`                     |
| Used SquashFS bytes                    | 39,269,512 in each bank                   |

The complete used SquashFS image in each bank has SHA-256
`3b168d9f0c478d53a3097c5009dd434caa99fe5462b41f36a277fb010dd8fc00`.
That is the same immutable image as the first two G6s' current build. The FIT
and Wi-Fi volume payloads also agree between this unit's banks. Different raw
partition hashes therefore do not identify different Linux builds.

The account creator, password generator, startup hooks and upgrade handlers
inside that rootfs are the existing HJL implementations. This does not supply
a G6 25.03 image or resolve whether a newer G6 removes the ONTUSER creator.
The same version-derived generator predicts the same HJL default ONTUSER
password, subject to the normal account/override path. No third live shadow
snapshot was supplied, so that prediction is not a new password comparison.

## The first and third bootloaders are exactly the same

The entire 4 MiB `ssb` partition is byte-identical to the first G6, with SHA-256
`87624a2f7e60c35bdd40b07a2541734e152753dae53396ddbbcb935fae4af177`.
It differs from the second G6's SSB. The third unit therefore fits the first
unit's bootloader branch; this is stronger than merely matching a U-Boot banner.

Its environment has no `console` variable, and the captured normal kernel
command line has `serial_is_dis=1`. Both environment records have valid CRCs.
This gives us another example of the stock disabled-console state before the
owner's UART-enabling changes.

Nevertheless, this third unit's twelve-byte `EXT_BOOT_PWD` differs from the
recorded original values of both earlier G6s and the Beacon 9. The first G6
comparison uses its saved pre-override value. Identical bootloader code does
not imply an identical provisioned verifier.

The first and third units share RI programming date `250424`, BOQA operator,
`eu` country, `3FE49949CCAA` hardware version and `3FE49740AAAA` part number.
Their factory records still differ. I verified that the third factory admin
hash matches its own label code; its management hash does not. Different
management hashes and salts do not by themselves prove different plaintexts.

## This capture includes the writable regions we were missing

The directory contains all twelve physical MTD partitions, totaling
536,870,912 bytes. Every raw file matches `SHA256SUMS.txt`. The ZIP's partition
payloads match that manifest too, and its member CRCs pass. These remain
main-area captures without NAND spare/OOB bytes or a proven atomic snapshot.

Offline UBI Reader extraction recovered 84 regular files from `rootfs_data1`,
23 from `cfg`, and 67 from `user_data`. The latter contains
`/opt/.backup/configs`, including copies of the configuration database,
network/wireless configuration and SSH host keys. Several measured copies
match the current saved configuration store. These are sensitive backups,
not another firmware bank.

The unused `rootfs_data0` readout did not provide the two layout blocks the
tool needs. The log partition's normal indexed extraction also failed. Neither
failure establishes damaged NAND: this was a live capture, and journal or tool
compatibility issues remain possible. Raw originals were left unchanged.

## The older configuration store has its own history

The separate `cfg` store retains `se.conf` with
`keysrc0 = 3TN00121LJJJ37`, a 634-object binary schema, and local-RRM notes
referring to a commit dated 12 April 2022. The selected `rootfs_data1` store
uses `versrc0 = 3FE49996HJLL91`, a 669-object schema, and newer RRM notes.

This is older configuration/security metadata. It is not a recovered
`3TN00121LJJJ37` firmware image, proof of that version being installed on this
G6, or an established mapping to a model/release family. Both actual banks
still contain HJL.L91. Component-note dates must also be kept separate from
complete image build dates.

## Reading the stored database with its device key

The new files are `dmdb_encryption.cfg`, with magic `0x124126`. They are a
different format from the WebUI export with magic `0x123123`.

For these two real stored snapshots, the existing runtime key formula worked:

```python
key10 = Base64(PBKDF2_HMAC_SHA256(
    G984Serial_source + ProgDate_source + b"invalid_key_src5_str",
    salt=b"key10", iterations=100, length=64
))[:64]
```

The exact sources were lowercase `fde30b70` and the six bytes `250424`.
The last input is the firmware's missing-source5 literal. Preserve the source
text and case; the programming date is not reformatted. A device with another
effective source5 needs that actual input.

After the five little-endian 64-bit header fields, the encrypted body is:

```text
ff | 8-byte salt | AES-256-CBC ciphertext
```

Derive 48 bytes using PBKDF2-HMAC-SHA256 with the 64 returned key10 string
bytes, that salt, and **10 iterations**. Split them into a 32-byte AES key and
16-byte IV, remove PKCS7 padding, then decompress the zlib stream. This branch
has no static-key-file SHA-256 prefix. Its CRC32 and zlib checks are not an
AEAD or signature authentication mechanism.

This decoded the current 399,490-byte database and the older 323,370-byte one.
Their `.bak` copies are identical. The decompressed files start with binary
datamodel magic `0x1008efab`; they are not the export's NUL-separated records.
A complete interpretation of their current per-instance account values remains
separate work.

The [offline decoder](../../webui/scripts/decrypt-stored-config.py) does not need
a live key reader or firmware file once the stored blob and exact source inputs
are available. Obtaining the stored blob is still separate from decrypting it.
It passed checks against both real files and incorrect serial/date/source5,
altered ciphertext and the existing export parser's format boundary. No file
was imported or written back to the router.

The static `key7_2`, `key14` and `key17` material remains the known HJL material.
Neither static key18 nor factory `EXT_KEY_FW`/`EXT_DBG_PWD` is present. That is
not a new measurement of the third router's live key18 lookup. The successful
stored-DB result concerns key10, not the WebUI export's key7_2/key18 profile.

## The logs describe more than the gateway

CRC-checked carving recovered 8,336 data nodes from the log partition, including
obsolete or uncommitted versions. Nested archive review decoded 19 members.
The extra label `3FE49062KJLK50` appears in a
`nal_getExtenderInfo` “Read Extender Info” software-version field for another
mesh device. It must not be added as this G6's installed firmware.

The recovered material also contains the known HJL.L91 identifier and Nokia
update-service URL leads, but no new firmware-image download URL was found.
No query was sent using this unit's or its mesh peer's identity. Carving does
not replay the journal or prove current filesystem state, so these results
remain bounded to the recovered nodes and archives.

The [complete evidence](../../knowledgebases/third-g6-comparison-evidence.json)
retains source fingerprints, extraction failures, corrected hypotheses and
validation results. Decrypted databases, raw logs, private keys and candidate
key material remain under `config-private/third-g6-analysis-20261026`.

## Follow-up: does this work without rooting the target?

The offline decoder also passed the first two G6s' saved stores. That is twelve successful file checks across all three routers: six primary databases and their six identical backups. These were already supplied flash captures, not a live test against an unrooted router.

Root status is not a derivation input. A matching router's file can therefore be decoded offline when its exact source inputs are known. However, we still need the stored file and exact RI programming date; we have not established an unprivileged retrieval method, a universal profile for every G6, or an edited-file installation route. The current helper only decrypts. Re-encryption uses a reproducible symmetric format, but acceptance of an edited database by stock firmware remains untested.

The normal WebUI export is separate. Its existing key7_2-based pack/unpack tools already support offline processing without rooting each matching target once the profile, device inputs and exported file are available. The new key10 result must not be substituted for that export key. The [cross-device validation](resources/stored-db-cross-device-validation.json) records the exact scope.
