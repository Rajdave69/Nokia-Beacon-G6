# Beacon G6 research writeups

The writeups follow the firmware and explain what was verified, what was inferred and what remains unknown. The device alias scheme below is shared with the companion Beacon 9 project.

## Device aliases

These labels identify physical devices throughout the publication. They are arbitrary labels, not truncated serial numbers, MAC addresses or values derived from them. Aliases stay attached to the same unit when its firmware, bank or configuration changes. Firmware profile names such as `G6_HJL.L91` identify software, not another device.

| Alias | Device examined | Operator | Captured software | Capture context |
| --- | --- | --- | --- | --- |
| `G6-A` | First Beacon G6 | Ooredoo, `BOQA` | `3FE49996HJLL91` / `HJL.L91p01` | Owner modified console/boot access and startup persistence; captures are not all factory pristine. |
| `G6-B` | Second Beacon G6 | Ooredoo, `BOQA` | Active HJL.L91; inactive `3FE49996IJLJ03` / `IJL.J03p01` | Owner installed a persistence script. Manufacture date alone does not establish the origin of the inactive image. |
| `G6-C` | Third Beacon G6 | Ooredoo, `BOQA` | HJL.L91 in both captured banks | Owner reports changing only the LAN IP before the dump. |
| `G6-D` | Fourth Beacon G6 | Ooredoo, `BOQA` | Active HJL.L91; inactive IJL.J03 | Owner reports no changes before the dump. |
| `B9-A` | Beacon 9 | Ooredoo, `BOQA` | `3TN01100JJMK44` / `JJM.K44p01`, HomeOS 25.03 | eMMC capture and live diagnostics; owner changed mutable settings, including the WebUI superadmin password. |
| `ONT-A` | XS-2426X-A ONT | Vodafone, `VDQA` | Bank 0 `3FE49940JJLK67` / `JJL.K67p02`; active bank 1 `3FE49940KJLK50` / `KJL.K50p01`; HomeOS 24.03.01 | Owner reports no changes before the dump; later read-only live diagnostics supplied separately. |

“First”, “second”, “third” and “fourth G6” in the research mean `G6-A` through `G6-D`, respectively. Static dump evidence, owner-reported history and later live tests are separate observations. A shared result across these six samples is not proof for every unit or firmware release. No G6 25.xx image has been obtained in this collection.

## Reading the evidence

- `private-source://SOURCE-…/filename` identifies a source retained locally. Named profile/capture references such as `private-source://PROFILE-G6-HJL/usr/lib/opkg/info/example.control` retain relative filenames under a privately mapped root. It is an opaque reference, not a download URL or the literal pathname on the research workstation.
- `G6-A:RI-G984Serial` and equivalent labels identify a unit's RI serial input. `PROGDATE-A` and similar tokens identify programming-date inputs; equal tokens mean equal original values. Neither is a usable input to a key derivation function.
- `DIGEST-…` labels replace device-specific service-key fingerprints and selected private-capture digests. Equal labels preserve equality comparisons. JSON names ending in `_alias` explicitly distinguish these labels from actual SHA-256 values or serial/date inputs. SSH file-byte comparisons remain distinct from canonical public-key comparisons.
- Model and part numbers, firmware releases/builds, operator codes, binary offsets, generic networking constants and shared stock-firmware/trust-key hashes are retained where they explain a finding.

Actual serials, exact RI inputs, source paths and withheld digests belong in the local `README.private.md`, which is ignored by Git. Original source verification requires that mapping and the private captures. The key-inventory validator resolves aliases locally; copying an alias into a router command will not recover the original input. Example decode commands use shell variables for the owner's own RI values.

This publication pass covers the hardware, security-keys, provisioning-pipeline, firmware-versions-and-builds, factory-reset and OTA-download writeups and their selected resources. Other local research files, captures, logs, knowledgebase snapshots and Git history require their own review before publication. The private mapping is also excluded from knowledgebase source collection.

## Writeup index
