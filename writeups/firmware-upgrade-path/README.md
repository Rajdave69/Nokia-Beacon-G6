# Following the Beacon G6's firmware upgrade path

The G6's buildinfo says `ENCRYPT=n`, so its firmware body does not need the
Beacon 9's decryption key to be readable. It was tempting to take that as a way
to add an installer for AdGuard Home to a stock image and upload it through the
existing superadmin page. The adjacent `SIGN=y` flag made that an assumption
worth checking: readable firmware and firmware accepted by the updater are
different properties.

I followed the original G6 HJL.L91p01 validator and compared it with the Beacon
9's JJM.K44p01 implementation. The ordinary G6 path still checks signatures,
but both builds also retain an encrypted handler with a different condition.

## From the browser to the image handlers

The WebUI uploads multipart data to `upgrade_web_app.cgi`. It checks the session
and privilege, stages the upload through `swdl_start_upgrading` and
`swdl_transmit_image_segment`, and finishes with `swdl_end_upgrading_write_image`.
The actual image work is in `/usr/lib/libupgrade.so`.

```text
upgrade_web_app.cgi
  -> libupgrade.so: staged upload and image handlers
  -> swdl_burn_image_to_flash: version and platform policy
  -> libupgradeimpl.so: Qualcomm or Cortina backend
  -> /sbin/sysupgrade
  -> /lib/upgrade/platform.sh
```

Normal firmware uploads have a Nokia outer wrapper ending with `3RDP`. Just
before that is a directory length and a list of type/offset/length entries.
The entries select plain firmware, signature data, encrypted firmware, a hash,
and some other vendor payload types. An installed rootfs partition dump is not
the same thing as this complete upload file.

## Other ways into the updater

The browser is only one entry point. I checked the complete IJL.J03 and HJL.L91
root filesystems from the second G6 to see what else can install an image. The Linux entry points below are retained in both builds; U-Boot recovery is a
separate bootloader path:

| Entry point | What it does |
| --- | --- |
| WebUI upload | upgrade_web_app.cgi stages an uploaded firmware file through libupgrade. |
| TR-069 | tr069client handles an ACS firmware download and feeds the staged writer. |
| TR-369 / USP | nuspd implements FirmwareImage Download() and Activate(), including AutoActivate. Agents and the management setting must be enabled. |
| Nokia cloud, mesh, app and portal | swmgnt and libotaSwAgent download and coordinate updates. otasw_upgrade_app.cgi triggers OTA rather than accepting another file upload. |
| Vendor batch provisioning | batch_upgrade receives signed discovery/response messages over raw Ethernet, downloads via HTTP and calls the staged writer. Live listener state was not checked. |
| Local vendor command | `swug -u <image-file>` writes through libupgrade, activates the other bank and reboots on success. |
| Lower-level Linux tools and RPC | sysupgrade and imageTool perform the platform update; local rpc-sys methods wrap sysupgrade using /tmp/firmware.bin. MTD/UBI tools are installed too. |
| U-Boot | bn can flash firmware banks and other targets over the network; nand and ubi provide lower-level recovery writes. |

The cloud route is particularly easy to overlook. libotaSwAgent's upgrade
function calls nal_writePassiveImage in libnal, which calls swdl_write_image.
The extra cloud, app and mesh triggers therefore still meet the vendor image
validator. TR-069, USP, batch provisioning and swug also feed that layer.
Another delivery method does not make the ordinary G6 signature check disappear.

There is a similar trap in the startup configuration. nuspd's PCD rule is
inactive by default, but cfgmgr can start it explicitly and then start obuspa
when TR-369 is enabled. The schema defaults that enable setting to false.
These facts establish conditional support; they do not tell us whether either
live G6 has a USP controller. The batch client's commented init-script line is
also incomplete evidence: cfgmgr retains a separate cfg_bootBatchUpgrade
callback that launches it.

Already having Linux root changes which layer is available. Calling sysupgrade
or imageTool directly reaches the platform's inner-image path rather than the
browser's outer wrapper. That still requires correct vendor packaging, hardware
metadata and boot compatibility. The standard NAND package lists boot, rootfs
and imginfo; boot targets shared SSB, while rootfs targets the other bank.
It is not a one-file application installer.

The local rpc-sys wrapper provides upgrade_test, upgrade_start and upgrade_clean
around /tmp/firmware.bin; keep selects whether sysupgrade receives -n. Its
socket configuration and appService ACL are present, but an externally reachable
RPC endpoint and live permissions were not established.

The retained ca.upgrade utility had no normal caller in an exact-string search,
so it remains a legacy-tool lead rather than another confirmed active service.
The bundled Qualcomm wlanfw-upgrade.sh selects IPQ model strings and updates
Wi-Fi firmware, not the Cortina G6 rootfs.

USB, TFTP and serial loading at U-Boot can put an image in RAM; bootm alone does
not install it. Switching to a populated alternate bank also does not rewrite
firmware. Keep those operations separate from flash writes, especially when
considering what survives an upgrade.

The [complete inventory](../../knowledgebases/firmware-upgrade-path.md#g6-firmware-and-rootfs-update-entry-point-inventory-2026-10-26)
retains conditions, addresses, data effects and untested branches. Its
[evidence](../../knowledgebases/firmware-upgrade-entrypoints-evidence.json) and
[static sources](resources/upgrade-entrypoints/README.md) cover both builds.
This follow-up was offline; it adds no successful flash or boot claim.

## Signing and encryption are separate paths

The examined builds report:

| Build               | SIGN | ENCRYPT | SIGNER |
|---------------------|------|---------|--------|
| Beacon 9 JJM.K44p01 | y    | y       | NCG    |
| G6 HJL.L91p01       | y    | n       | NCG    |

The plain firmware handler rejects an unsigned image when the running build
requires signing. The signature handler uses `CS_verifyDataSign`, a public CA
at `/root/rootca.pem`, and signer-attribute checks. Both ROMs have the same
Nokia DHBU root certificate. That certificate is not a signing private key.

There is a more interesting distinction in the encrypted handler. It asks for
runtime `key18`, decrypts the payload, checks a separate SHA-256 value and calls
the burn entry. It does not perform the plain handler's signature-seen check.
Configuration export's serial/key7_2 formula is not used here, and there is no
sl_num equivalent in this decryption path.

I tested that distinction under QEMU using the original image-dispatch code and
stock encryption library. The input was 19,600 bytes of synthetic nonbootable
data. The key lookup supplied a synthetic known key18, and the burn function
was replaced with a read-only comparison stub.

In both builds, an encrypted package with the matching hash reached that stub
without a signature entry or signature-verifier call. The decrypted bytes
matched the original. Missing key18, a wrong hash, raw input and unsigned plain
firmware were rejected. A signature entry whose verification returned failure
also stopped processing.

This is evidence of a userland validation-path exception. **It is not a tested
flash or boot bypass.** The stub was at the entry to swdl_burn_image_to_flash,
before version policy, inner-image checks, target selection and platform writes.
The signature API was intercepted to count calls and fail if called; no genuine
Nokia-signed image was used as a positive signature test.

## Reading key18 from an already-rooted router

The existing `read-config-key.c` helper calls the same
`SE_getKeyByName("key18", ...)` API used by the firmware decryptor. It writes the
full returned string, hex-encoded as `key18_hex`, into a new private JSON file.
The helper queries the stock libraries and RI; it does not regenerate security
material or change router configuration. Its only explicit file write is the
requested output file.

From the G6 project root, use
[`webui/scripts/read-config-key.c`](../../webui/scripts/read-config-key.c). Build in
WSL against the G6's extracted runtime libraries so a newer workstation glibc
does not introduce symbols unavailable on the router:

```sh
mkdir -p config-private
aarch64-linux-gnu-gcc -Wall -Wextra -Werror -Os \
  -Wl,--dynamic-linker=/lib/ld-linux-aarch64.so.1 \
  -o config-private/read-config-key-g6 webui/scripts/read-config-key.c \
  router-flash-ALCLFDE2F68C/old/rom/rom/lib/libdl.so.2 \
  router-flash-ALCLFDE2F68C/old/rom/rom/lib/libc.so.6
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

The [key18 provenance follow-up](../firmware-key18-provenance/README.md) checks the G6's
actual NAND record and the retained loader. The saved SECURITY copies lack
EXT_KEY_FW, and the captured ROM lacks its extractor. Synthetic native tests
confirm the loader works with valid input and that an empty firmware password
is rejected. The owner also supplied the metadata diagnostic's live result:
no EXT_KEY_FW in the successfully parsed current record, no firmware-key file,
and lookup status 608. The follow-up records those observations and their scope.

## What would happen after validation

The Qualcomm backend on Beacon 9 invokes the vendor sysupgrade path. It expects
a suitable FIT image, extracts imageInfo, checks hardware part-number metadata,
and maps the included sections to partitions. Boot-selection changes use the
boot-info interface, sb_flag and switch_partition.sh.

The G6 backend also invokes sysupgrade, but its Cortina platform script uses
imageTool and imginfo. Its normal rootfs target is the other rootfs bank relative
to active_part. Activation and commitment use the image_activate/image_commit
helpers and ca.sb. Images can contain other partition components as well.

On Beacon 9, the late boot script schedules `swug -c` after sixty seconds and
separately runs the executable `/configs/pre_app_boot.sh` hook. The examined G6
boot script runs the hook but has no equivalent enabled delayed commit command.
The [slot-rollback follow-up](../firmware-slot-rollback/README.md) now traces the stock swug -s all interface and cfgmgr auto-commit in both G6 builds. Twenty isolated native tests confirm both captured U-Boot selectors' activation, missing-commit fallback and retry behavior. A live downgrade and hardware recovery remain untested. The commented init-script command does not remove cfgmgr's separate automatic commit path.

## What this means for an AdGuard installer

A reusable modified-stock upgrade is a possible research direction. It would
still need a compatible inner image, hardware/version metadata, a usable
validation path and a successful boot. Keeping the original vendor kernel and
drivers avoids an upstream port, but does not make those checks disappear.

The encrypted route also requires key18. We have the owner's Beacon 9 value;
we do not know whether other units share it. The older G6 security captures and
the owner's new live reader output provide no nonempty key18. Its positive
encrypted-path test required injecting an available synthetic key. The live
result does not supply the prerequisite for using that route on this G6.

There is consequently no completed firmware-based bulk installer yet. That missing artifact was later obtained: the [cloud-download follow-up](../../knowledgebases/cloud-firmware-downloads.md) downloaded the genuine G6 HJL.L91 package, parsed its inner format and compared its payloads with the dumps. Custom-image acceptance and boot remain untested. The configuration-based account bootstrap is a separate route
and currently has a known G6 key profile.

The [service-provisioning procedure](../service-provisioning-from-superadmin/README.md)
documents the configuration route, the ordinary signed-but-unencrypted G6
upgrade, and the conditional encrypted-image route separately. In particular,
ENCRYPT=n does not make a modified G6 image acceptable under SIGN=y.

The [knowledgebase](../../knowledgebases/firmware-upgrade-path.md) records the exact
format, entry points and limitations. Its [evidence file](../../knowledgebases/firmware-upgrade-evidence.json)
retains sanitized results from the twelve offline validator cases.

## The earlier IJL.J03 build retains the same key18 limitation

The [second-G6 comparison](../two-g6-key-comparison/README.md) checks the older validator with six synthetic cases and intercepted flash/command entry points. Its conditional encrypted handler behaves the same way, while its normal SIGN=y policy and common root CA remain. Both G6 factory captures lack EXT_KEY_FW; shared key17 does not provide that absent firmware-key input.

## G6 persistent-data formatting follow-up, 2026-10-23

Both inspected G6 platform_copy_config bodies format rootfs_data[1-active_part] when SAVE_CONFIG=1 (sysupgrade's default), without excluding cfg_partition. Both devices' saved cfg_partition is rootfs_data1. From active_part0, that is the same partition mounted at /configs; from active_part1 the formatter targets rootfs_data0. Archive-copy lines in that function are commented out. This is a reachable source-level persistence risk, not a measured live erasure. See the [startup-persistence context](../../knowledgebases/startup-persistence.md) and migration tutorial for the distinction between known-bank caller compatibility and upgrade survival. No live updater flag change, flash or bank switch was performed.

## The bootloader has its own upgrade target

The G6 platform script explicitly has an SSB write path. Both inspected HB_Config.json files configure these subimages:

```text
boot:gpt-nandinfo.img
rootfs:root.mubi
imginfo:image.info
```

platform_do_upgrade iterates that configured list. Its target mapping includes:

```sh
boot)       do_flash_mtd $tag $1 "ssb" ;;
part_table) do_flash_mtd $tag $1 "uboot-env" ;;
rootfs)     do_flash_mtd $tag $1 "rootfs$((1-$(get_boot_index)))" ;;
```

The boot tag therefore targets the partition named ssb, mtd0 in the captures, through imageTool. The part_table case exists in the script but is **not in either inspected build's configured SubImageInfo list**. Its presence alone does not establish that a normal upgrade rewrites uboot-env. Actual package contents, tag handling and the selected updater configuration must be checked; no real upgrade package was flashed in this investigation.

SSB contains the BL2/BL31/BL33 boot chain and certificates. BL33 is U-Boot. Both supplied SSBs contain two matching FIP payload copies inside the same shared partition. Those copies are not a separate U-Boot assigned to rootfs0 and another assigned to rootfs1. The captured A/B activation/rollback code changes Linux-bank selection; selecting the previous rootfs does not restore bytes overwritten in shared SSB.

This explains why bank rollback and bootloader rollback must be treated separately. The two G6 routers run identical current Linux builds but have different BL33 binaries, different console-policy paths and different certificate validity starts. That proves a Linux version label does not identify the installed bootloader. It does not reveal when either SSB was installed or prove that a particular historic OTA updated it. The common U-Boot banner is not sufficient to distinguish them; retain the [SSB component comparison](../two-g6-key-comparison/README.md) and hashes.

A bootloader update can change whether the saved console setting is honored or how the en verifier is evaluated even if uboot-env and extfs bytes are retained. Password2 remains a Linux-side verifier: the existing sec_cli overlay still requires its files and Linux startup caller after such an update. No bootloader flashing or bootloader-persistence patch was attempted here.

## Recovery without another firmware write

The [UART recovery follow-up](../uart-recovery-from-uboot/README.md) now establishes owner-verified root entry through the existing stock FIT and init=/bin/sh. It can recover a shell when a rootfs update removes the Password2 startup arrangement, provided the existing bootloader entry and compatible boot image remain available. No custom bootloader or rootfs rewrite was needed for the successful test.

The same investigation traced U-Boot's bn command. Unlike Linux platform_copy_config's opposite-running-bank formatter, bn target0/1 first erases rootfs_data with the **same target number**, then writes rootfs0/rootfs1. Thus bn image1 can erase /configs when cfg_partition=rootfs_data1. Its partition-write interface must not be confused with a one-file installer. No bn/NAND/UBI write was tested; see the [source-scoped evidence](../../knowledgebases/uart-recovery-from-uboot-evidence.json).

## Obtaining the actual package without starting an updater

On26October2026 I reproduced the metadata POST from a workstation using the
owner-approved OTA profile. Advertising current HJL.L91 returned that same target
without a URL; advertising the archived IJL.J03 version returned a signed URL.
The48,500,632-byte HJL package downloaded successfully and matched the cloud MD5.
It was not installed.

Parsing the package gave two Nokia subimages, rootfs and imginfo, with matching
MD5 records. The FIT, rootfs SquashFS and Wi-Fi SquashFS then matched the current
dump byte for byte. There is no boot subimage in this file. The May2025 CDN date
is upload metadata; the underlying software is the December2024 HJL baseline.

The Beacon9 query succeeded but offered no target or URL. The service result is
scoped to the queried profile; it does not establish the newest Nokia release
globally or expose an arbitrary historical-version selector. See the
[repeatable download-only procedure](../../tutorials/download-firmware-without-installing/README.md)
and [full evidence](resources/cloud-download/evidence.json) for the exact request,
one-hour object-specific URL policy, complete container format and limitations.

## Country changes and BBDR release names

I also queried the cloud with eu, qa, us, in, EU and QA as the country header,
keeping the device identity and BOQA operator unchanged. For the G6, the older
IJL version still led to the same HJL.L91 package; the current version had no
URL. The Beacon 9 had no offer under either tested version. An additional
UMJ28 request and four separate gateway/device version cases returned no new
download URL. The full 29-query experiment is in the cloud knowledgebase; no
additional firmware was obtained.

There is a separate release name inside these images. The old G6 slot's web
package was built under BBDR2402OpenWrtB; the current G6 uses BBDR2404OpenWrtB.
Their HOMEOSVERSION fields are24.02.00 and24.04.00. The Beacon 9 explicitly
names BBDR2503OpenWrtBA, with HOMEOSVERSION25.03.00, and its release notes also
mention BBDR2503a for a B9/BOQA WLAN-panic fix. On the G6, look at
/usr/lib/opkg/info/web.control because buildinfo's REPO field only says master.

[Nokia's CVE-2025-9974 advisory](https://www.nokia.com/we-are-nokia/security/product-security-advisory/cve-2025-9974/)
uses BBDR2503 as the fixed baseline. It does not supply the corresponding G6
image ID. The Beacon 9's matching branch label does not verify the actual patch,
and the advisory does not explicitly list that model. The release train and
the product image ID describe different layers; neither a branch label nor a
returned target without a URL is evidence of an available firmware file.

The [dedicated OTA download writeup](../ota-firmware-downloads/README.md) follows the metadata request
and manual transfer separately. The [version and build catalogue](../firmware-versions-and-builds/README.md)
records the captured releases, package versions and bootloader provenance.

## The ONT is a separate upgrade target

The XS-2426X-A adds two recovered 24.03 rootfs profiles with `SIGN=y` and
`ENCRYPT=n` declarations and its own distinct SSB. Those declarations do not
independently verify a complete distributable, firmware signature or hardware
boot-chain policy. The cloud client uses the same request shape, but its native
model is `XS-2426X-A`, operator fallback VDQA and selected country qa. Neither
approved query, current KJLK50 or actual inactive JJLK67, offered an image.
There is therefore no newly downloaded ONT package to inspect or flash. G6
upgrade exceptions and recovery commands have not been ported or live-tested
on this ONT. [Exact OTA results](../xs2426xa-24-03-comparison/resources/ota-research.json).
