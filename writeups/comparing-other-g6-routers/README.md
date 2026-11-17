# Comparing other Beacon G6 routers

## What changed when there was more than one G6?

The additional routers helped separate three things that a single dump could not: shared firmware, device-specific provisioning, and changes I had made while gaining access. They did not reveal a new G6 firmware release. Across six captured units, we still have the same two Linux builds, but two bootloader packages and several distinct factory credential and configuration states.

The aliases below follow the [shared device list](../README.md#device-aliases). An alias identifies a physical router; a build name identifies software that more than one router can run.

| Device | Captured running bank | Bank 0 / bank 1 | Whole SSB group | Owner changes reported before capture |
| --- | --- | --- | --- | --- |
| `G6-A` | 0 | HJL.L91 / HJL.L91 | A | UART/boot access and later persistence changes; the original boot verifier comes from its earlier capture. |
| `G6-B` | 1 | IJL.J03 / HJL.L91 | B | Persistence script on the active build; original manufacture date does not date the inactive image. |
| `G6-C` | 0 | HJL.L91 / HJL.L91 | A | LAN IP only. |
| `G6-D` | 1 | IJL.J03 / HJL.L91 | A | None reported. This does not mean it had no prior provisioning or use. |
| `G6-E` | 0 | HJL.L91 / HJL.L91 | A | Owner separately reported secure boot enabled. |
| `G6-F` | 1 | IJL.J03 / HJL.L91 | A | No change history supplied. |

All six use the captured BOQA G6 profile. `G6-C` and `G6-D` provide twelve-partition main-area dumps, including writable storage and logs. Those extra regions produced useful results even though their immutable Linux files were already familiar.

## Two Linux builds, two bootloader packages

| Build | Image version | Build date | Used SquashFS bytes |
| --- | --- | --- | ---: |
| IJL.J03p01 | `3FE49996IJLJ03` | 2 July 2024 | 37,633,784 |
| HJL.L91p01 | `3FE49996HJLL91` | 27 December 2024 | 39,269,512 |

The two current ROM captures from `G6-A` and `G6-B` agree on all 4,612 regular files and 491 symlink targets. `G6-C` repeats the HJL image in both banks. `G6-D` matches `G6-B` bank-for-bank, including all six used FIT, rootfs and Wi-Fi payloads. G6-F matches G6-B and G6-D even at the raw 80 MiB bank level. G6-E matches G6-A bank 0 and the HJL bank 1 shared by G6-B, G6-D and G6-F. Raw NAND hashes can differ because padding and UBI metadata differ; comparing the used payloads avoids counting that as another firmware build.

Across IJL and HJL, 3,755 file/symlink entries are identical, with 456 added, 265 removed and 892 changed. The [file inventory](../../knowledgebases/g6-build-file-comparison.csv) retains the exact differences. Older provisioning code lives inside the larger `cfgmgr`; HJL moves it into `libdbgen.so` and `dbgen_bin`. Missing standalone files therefore do not mean their functionality was removed.

The complete 4 MiB SSB is identical on `G6-A` and `G6-C` through `G6-F`, while `G6-B` differs. The first comparison found identical BL2 and BL31 payloads but different BL33/U-Boot payloads and certificate packaging. A shared May-2020 U-Boot banner hides those differences. The certificate validity starts are packaging clues, not compiler dates or proof of what shipped on a router.

This also keeps Linux banks separate from the bootloader: `G6-D` and `G6-F` combine `G6-B`'s bank layout with the other SSB group. Selecting an IJL or HJL bank does not select a corresponding U-Boot revision. There is still no captured G6 25.xx image in this collection.

## Which keys are shared and which are derived?

| Material | What the comparison establishes |
| --- | --- |
| `key7_2` | Same static G6 value in IJL/HJL; the later units repeat those exact rootfs profiles. G6-B's live lookup matches G6-A's earlier capture. |
| `key14`, `key17` | Shared across the examined G6 profiles; G6-B's live values also match. |
| `key3`, `key4` | Change between IJL and HJL. Use each build's own preconfiguration key. |
| `key9`, `key10` | Derived runtime keys. G6-B's live values differ from G6-A's earlier capture. |
| `key18` | Absent from the static stores; factory `EXT_KEY_FW` absent on all four. Live lookup fails with status 608 on the first two; no equivalent live result from G6-C/D. |
| `EXT_DBG_PWD` | Absent from all four captured factory records. |

For the observed short ASCII sources, the runtime derivation is:

```python
def derive(source, salt=b""):
    return Base64(PBKDF2_HMAC_SHA256(source, salt, iterations=100, length=64))[:64]

key10 = derive(serial_source + programming_date_source + source5, b"key10")
```

An existing `key9` is retained. Otherwise its normal branch uses `derive(b"key9" + LabelCode)`; missing source4 selects the serial/programming-date fallback. The captured first-unit key9 matches its label branch, and its key10 matches the missing-source5 literal `invalid_key_src5_str`. Preserve source text and case. The RI date is not reformatted for the calculation, and a different effective source5 changes the result.

The shared static key7_2 does not make these derived keys equal. Conversely, different runtime keys do not change the separately traced WebUI export formula. The [security-key writeup](../security-keys/README.md) documents the individual formats and uses.

## Stored databases and WebUI backups are different formats

`G6-C` supplied the clearest new result: the known key10 calculation decrypted its real current and older stored databases. The same calculation then worked across eighteen saved files from all four G6s, including equal backup copies. These are file checks, not eighteen independent configuration states.

| Container | Key/input profile | Result and boundary |
| --- | --- | --- |
| Internal `dmdb_encryption.cfg`, magic `0x124126` | Device-specific key10 from exact RI serial, programming-date text and effective source5 | AES-CBC outer container and zlib-compressed binary database; decoder works offline on the supplied captures. |
| WebUI export, magic `0x123123` | Selected uppercase serial, shared G6 key7_2, optional key18 contribution, operator and mnemonic | Existing export pack/unpack path; not the stored-database key10 format. |

The original IJL/HJL export functions matched the reconstructed KDF in twelve synthetic cases. Both original security libraries accepted the real first-unit export and a synthetic export for the second identity, while rejecting wrong-serial fixtures. `sl_num` selects the identity used for decryption; it does not rewrite RI or supply a different key profile.

For matching profiles, neither KDF needs root status as an input. That does not provide a way to retrieve an internal database without access, discover an unknown source5, safely edit its binary contents or install an edited file. The stored-file helper currently decrypts only. Actual edited import, account-writer ordering and reboot persistence remain separate checks.

`G6-D` adds six successful stored-file decodes but only two distinct plaintexts: current/backup copies and an older `cfg` state. An old `se.conf` version token and a 634-object schema are configuration history, not an additional installed Linux image. The [configuration writeup](../configuration-import-export/README.md) covers the export path; the [decoder](../../writeups/configuration-import-export/resources/stored-database/decrypt-stored-config.py) handles the distinct stored format.

## Factory credentials differ even when the code is identical

All four captured SECURITY records retain the same ten-field layout. Factory admin hashes accept each router's own label code. The management hashes do not accept that candidate. Their differing salts and hashes do not establish whether their unknown plaintexts differ.

The four original `EXT_BOOT_PWD` verifiers are pairwise different; the Beacon 9 adds another different original sample. For `G6-A`, this comparison uses the archived pre-change record, not the owner's later override. Three identical SSBs therefore coexist with three different provisioned boot verifiers.

The verifier algorithm is unchanged between the two G6 bootloaders: the normal stored-field path compares the first twelve Base64 characters of SHA-256 of the candidate. The serial is used by the missing-field fallback, not that normal factory comparison. Thirty-six intercepted original-code cases passed; none was a physical `en` login or a NAND-driver test. The [boot and console writeup](../boot-and-console/README.md) retains the full mechanism.

The first two live root hashes match the common ROM template. Linux `superadmin` matches its own factory `EXT_WEB_MGNT_PWD`, while the mutable WebUI password remains separate. These comparisons did not recover a factory management-password generator or root plaintext.

ONTUSER is still generated locally on both IJL and HJL. The build-derived release code differs (`JLJ` versus `JLL`), so the normal generated value changes with the selected firmware, not the physical G6. G6-B's live shadow matches its current HJL generator. Equivalent immutable code on G6-C/D is not a live account measurement. `DebugRnPassEnable` controls the later factory override, not whether the account is created.

Password2 uses a common ECC public key but a device-specific message from `keysrc1`; one device's signed token does not become another's token. No stock signing private key was recovered. Separately, saved HTTP keypairs match within each unit and their canonical public keys differ across all four. Dropbear private-file bytes differ too; that is not a completed canonical SSH-public-key comparison.

## Owner changes explain some differences; firmware explains others

`G6-A`'s `console=1` was installed using the UART tutorial. It lives in redundant `uboot-env` records, not in SSB. Neither SSB's compiled default environment includes `console`; an absent variable is a valid unset state, not proof that it is unsupported. The two BL33 branches also have a real difference in how they construct the serial command line, which remains separate from that manual setting.

The HJL early `replace_with_test.sh` caller is absent on IJL. Both builds retain the later `pre_app_boot.sh` caller. The persistence scripts installed on the first two routers do not add that missing early caller to an inactive bank; no corresponding custom payload was found in G6-D's extracted stores. The [cross-bank tutorial](../../tutorials/setup-startup-across-firmware-banks/README.md) covers the common later hook and its reset/upgrade limits.

Normalized BOQA, EGEB, WLNP, JPDX and GENERIC provisioning subtrees are unchanged between IJL and HJL. Other operators and the role maps do change. The [operator comparison](../operator-profiles-and-credential-policy/README.md) and [role matrix](../../knowledgebases/g6-operator-role-comparison.csv) keep permission mappings separate from password algorithms.

## Writable history adds context, not automatically another firmware version

The later captures include sensitive `/opt/.backup/configs` copies, older schemas, service keys, provisioning recipes and logs. G6-C's normal log extraction failed, but CRC-checked carving recovered 8,336 data nodes and nineteen nested members. Those can include obsolete or uncommitted state. A `3FE49062KJLK50` token belongs to a reported mesh extender, not another installed G6 image.

G6-D's indexed extraction recovers 33 log files and a gzip-tar member hidden behind a `.tar.bz2` filename. Its reboot records support earlier IJL and later HJL use, but invalid 2020 clocks cannot date those 2024 builds. Repeated upgrade-status queries and `0x32`/`0x72` flags are not proof of a completed flash. Its 44 Nokia URL references provide no new firmware-image path, and no update query was sent using that capture.

The retained `ENC_CFGBOQA112` and `114.org` files are configuration recipes. Later decoding resolved the original uncertainty: the six captured 114 plaintexts match across all four G6s, while 112 changes retry and boot-reporting policy. They are not additional Linux versions. The [provisioning writeup](../provisioning-pipeline/README.md) owns the full reconstruction.

The fourth capture also records the vendor `generic` sandbox with 1 MiB storage. That is lifecycle-manager history, not proof of an owner-installed service. Likewise, extraction failures, `mount_opt_fail=1`, or an incomplete pstore trace do not by themselves diagnose damaged NAND or a present fault.

## What remains unverified

The comparison still needs a newer G6 firmware image, live account/key reports from G6-C/D, actual additional WebUI export/import checks, and measured post-import or firmware-bank persistence. A fifth G6's owner separately reported secure boot enabled; that is not another supplied serial-mapped flash capture. The [secure-boot investigation](../secure-boot/README.md) distinguishes cryptographic consistency of four saved SSBs from a complete hardware-rooted unlock.

The [single knowledgebase](../../knowledgebases/comparing-other-g6-routers.md), [structured comparison evidence](../../knowledgebases/comparing-other-g6-routers-evidence.json) and [resource index](resources/README.md) retain exact counts, offsets, source hashes, failed hypotheses and validation scopes. Static code, owner-supplied live readings and synthetic original-code tests remain separate evidence.
