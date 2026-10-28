# Switching back to the other Beacon G6 firmware slot

## The other slot is already an installed image

The second G6 has version `HJL.L91` (built December 2024) in the selected rootfs1 and older `IJL.J03` (2024) in rootfs0. Its two CRC-valid environment records agree: active_part1, sb_flag114 (0x72), and the corresponding image-version strings. The first G6 has HJL.L91 in both captured slots. Switching that first unit would therefore not recover an older release from these captures.

This led to a narrower question than uploading firmware: could the stock software select the image that was already in the other bank? It can. The built-in interface is `/usr/exe/swug`, with separate status, activation and commit operations. This procedure was traced offline; no router was switched or rebooted during the investigation.

## The stock command and its backend

First read the running router's state:

```sh
/usr/exe/swug -d
fw_printenv active_part
fw_printenv sb_flag
fw_printenv img_version0
fw_printenv img_version1
```

`swug -d` displays Active, Committed, Next Active and the two image versions. The saved metadata describes the time of the capture; the current output must be checked before acting.

### What Active, Committed and Next Active actually mean

I initially read these as ordinary bank labels. Looking at the status routine exposed a complication: this command derives all three values from `sb_flag`. It does not use `active_part` to print Active. The HJL.L91 routine at `0x125c` and IJL.J03 routine at `0x126c` implement the same calculation.

| Displayed field | What this G6 implementation prints                                       | How to interpret it                                                                                                                                                                   |
|-----------------|--------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Active          | Bank0 if bank0's committed bit is set; otherwise bank1                   | A bank inferred from commitment metadata. It usually agrees with the running bank after successful commitment, but is not a reliable running-bank measurement during boot or a trial. |
| Committed       | 1 if either bank has both its active and committed bits set; otherwise 0 | A yes/no status, **not a bank number**. An activation request clears this status until the selected bank is committed.                                                                |
| Next Active     | Bank0 if bank0's active bit is set; otherwise bank1                      | The requested selection for the next boot. U-Boot can still choose differently because of validity, pending-upgrade or failure handling.                                              |

These are the actual expressions, with bank0 in the low nibble and bank1 in the high nibble:

```python
active = 0 if sb_flag & 0x04 else 1
committed = int((sb_flag & 0x05) == 0x05 or
                (sb_flag & 0x50) == 0x50)
next_active = 0 if sb_flag & 0x01 else 1
```

The asymmetry is real. Active tests only bank0's commit bit: if neither bank is committed, it still prints1. Next Active likewise defaults to1 if bank0's active bit is clear; these expressions do not independently validate bank1.

For the second router's captured state, the sequence illustrates why that matters:

| Point in the sequence | sb_flag | Actual running bank | Active | Committed | Next Active |
| --- | --- | --- | --- | --- | --- |
| Captured, successfully committed HJL.L91 | 0x72 | 1 | 1 | 1 | 1 |
| After requesting slot0, before reboot | 0x63 | 1 | 1 | 0 | 0 |
| First trial boot of slot0, before commit | 0xa3 | 0 | **1** | 0 | 0 |
| After successfully committing slot0 | 0x27 | 0 | 0 | 1 | 0 |
| Another ordinary slot0 boot, before re-commit | 0x23 | 0 | **1** | 0 | 0 |

The post-request and post-boot rows are traced state transitions, not a report of a live rollback. To identify the running bank, cross-check the kernel command line and the environment value U-Boot writes during selection:

```sh
cat /proc/cmdline
fw_printenv -n active_part
```

The captured command lines contain `ubi.mtd=rootfs0` or `ubi.mtd=rootfs1`. If these sources disagree, investigate the discrepancy before changing slots. Committed records the stock boot-success protocol; it does not certify custom scripts, SSH reachability or every service's health.

The firmware's command for selecting the alternate bank is:

```sh
/usr/exe/swug -s all
/usr/exe/swug -d
```

On the examined G6, the switch branch calculates 1-active_part and calls swdl_active with call flag2. The Cortina backend invokes `/usr/exe/image_activate.sh`. That script leaves the currently running bank inactive/valid/committed and makes the other bank active/valid/uncommitted. For the second router's captured state, it selects slot0, IJL.J03. The running kernel remains in slot1 until reboot.

Confirm that Next Active is the intended bank. Then reboot separately:

```sh
sync
reboot
```

This does not upload or rewrite either rootfs image. It changes boot metadata and activation markers. Manually assigning only active_part is not equivalent: U-Boot derives that field from the slot flags while selecting a bank.

The lower-level script exists, but the stock swug path is the more complete interface. libupgrade also creates `/tmp/.swug.activated` and `/configs/swdl/auto_commit_flag`. Those markers participate in the normal activation/commit sequence and are omitted by a direct script invocation.

## Commitment is handled elsewhere than S99commit_image

After the selected firmware boots, inspect its version and slot:

```sh
cat /etc/buildinfo
cat /proc/cmdline
/usr/exe/swug -d
```

The explicit stock command to commit the running bank is `/usr/exe/swug -c`. Run that only after the reboot, if an explicit commit is needed. The activation marker in /tmp deliberately makes swdl_commit skip an attempt in the same boot in which activation was requested.

Normally there is already an automatic path. Current cfgmgr's boot-completion routine at0x3fca8, and the older build's routine at0x61888, invoke `/usr/exe/bootfinish.sh`. They then test auto_commit_flag, call swdl_commit with flag2 and remove the flag after success. bootfinish resets the global/per-bank failure counters and can create that flag itself.

This corrects an easy inference from the init script. The delayed commit line in S99commit_image really is commented out, but that does not mean the firmware no longer auto-commits. cfgmgr is another consumer. Reaching its boot-completion path is not a measured guarantee that every network service or custom application is healthy.

## What U-Boot does if the new selection is not committed

The slot flag has one nibble per bank: active, valid, committed and upgrade bits. An activation from committed slot1 changes 0x72 to0x63. U-Boot's first selection of slot0 produces0xa3. If no successful commit occurs before the next boot, the captured state machine selects slot1 again, producing0xb2. In the other direction,0x27 becomes0x36, the first slot1 boot produces0x3a, and an uncommitted subsequent boot returns to slot0 with0x2b.

There is also an ordinary retry-counter path with a threshold of eight. The two bootloaders differ slightly: the first consults reset-status bit0 at0xf4320114 before deciding whether to increment that counter; the second increments in the corresponding path. Newly activated-image fallback is a separate, faster path. This is not a rule that eight deliberate power cycles are required or sufficient.

One further detail matters: U-Boot clears the committed bits during ordinary boot selection too. Successful Linux boot completion re-commits the running image. Commit is therefore part of the boot-success protocol, not just a once-per-upgrade annotation.

I checked the actual ARM64 selectors under QEMU with in-memory environment get/set/save operations, suppressed console output and a synthetic reset-status page. Both banks' steady state, activation, missing-commit fallback, simulated successful commitment and threshold/reset cases passed:20 cases across both original bootloaders. These tests execute selection code without U-Boot main, physical flash or hardware reset. The [source](../../webui/scripts/research/g6-slot-selection-probe.c) and [evidence](../../knowledgebases/firmware-slot-rollback-evidence.json) retain the exact boundaries.

## What switching banks does not restore

A/B selection is not a complete snapshot restore. Configuration migrations, shared persistent stores, factory identity and the separate SSB/environment regions need their own provenance. Compatibility of the newer configuration with IJL.J03 has not been tested here.

For these particular routers, shell access needs attention too: IJL.J03 lacks the wifi_fw_mount invocation of `/configs/debug/replace_with_test.sh` used on the active builds. Its normal ONTUSER calculation also uses a different release code. Both builds do, however, retain the executable `/configs/pre_app_boot.sh` hook in commit_image. The [startup migration tutorial](../../tutorials/setup-startup-across-firmware-banks/README.md) uses that common caller to run the existing payload later in boot without double-running it on HJL.L91.

That relies on both firmware banks mounting the same data. Here, `/etc/init.d/startup` reads `cfg_partition` from shared U-Boot environment and mounts that named partition at `/configs`. Both saved environments select `rootfs_data1`, and both live captures show mtd6/ubi6_0 mounted there even though the first router boots rootfs0 and the second boots rootfs1. `/configs` is not necessarily the partition named cfg, and its selection is not automatically tied to the running bank.

### What can survive a bank change, and what can survive an upgrade?

There are three separate requirements: the files must survive, the selected firmware must still call them, and their contents must still work with that firmware. Keeping a script on flash establishes only the first.

| Existing method | Where the persistent change lives | What a bank switch changes |
| --- | --- | --- |
| Startup Telnet or another service | Payload under `/configs/debug`, plus a stock init-script caller | HJL.L91's early caller disappears in IJL.J03. The common late caller can run the payload, subject to timing and service compatibility. |
| UART Password2 custom public key or sec_cli override | Key/helper under `/configs/debug`; boot script reapplies the runtime replacement | Runtime `/usr` changes must be recreated. The custom public-key method uses both builds' compatible verifier; a replacement binary still needs its own ABI check. |
| Enabling U-Boot UART | `console` in shared mtd1 uboot-env | Switching a Linux bank alone does not replace this environment. The two captured SSBs have different console-policy code, so exposure must be checked on each. |
| Setting a U-Boot en password | Logical `SECURITY.EXT_BOOT_PWD` in shared mtd9 extfs | It is already outside the rootfs banks. The retained SSB verifies it before Linux; backups in `/configs` are not the verifier itself. |

The last two tutorials therefore do not depend on a patched current rootfs. They provide a separate recovery layer, although U-Boot access is not automatically a Linux root shell. Recovery commands, image loading and Linux authentication remain separate tasks.

A firmware upgrade has a larger scope than selecting an already installed bank. In both inspected G6 versions, `/sbin/sysupgrade` defaults to SAVE_CONFIG=1, and do_upgrade then calls platform_copy_config. Despite its name, the active body of that function formats `rootfs_data[1-active_part]`; its old archive-copy lines are commented out. It does not check whether that is the partition currently selected by cfg_partition. From bank0 with the saved cfg_partition=rootfs_data1, that formatting target is the same partition holding `/configs`. This is a source-level erasure risk, not a tested observation that an upgrade erased either router. It is enough to rule out treating `/configs` as unconditionally upgrade-safe.

Packages can also contain boot or partition-table components mapped to ssb or uboot-env. Reset handling explicitly deletes unlisted custom files, and startup mount-recovery code can format a damaged data partition. Future firmware may change the hook or its verifier. Consequently, none of these methods guarantees access through **every** upgrade, reset or bank transition.

For the two known builds, the practical procedure is to migrate to the common late hook, retain the separately stored UART/en recovery settings, keep an off-device copy of the payload and device backups, and verify entry after each transition. For an upgrade, inspect the image components and data-formatting path before starting; checking the target rootfs for the hook alone is insufficient. Stock cfgmgr can commit automatically, so the trial mechanism must not be treated as a manual approval window that waits for your shell test. See the [persistence writeup](../persistent-overlays/README.md) for the storage and startup chain.

The confirmed procedure is therefore stock shell activation of an existing valid image, followed by reboot and stock boot-completion/commit handling. This finding does not establish a WebUI rollback endpoint or a successful live downgrade. The [LLM context](../../knowledgebases/firmware-slot-rollback.md) records the same distinction.

The [fourth G6 capture](../fourth-g6-comparison/README.md) independently repeats
the second unit's IJL-bank0/HJL-bank1 payloads and selected bank1/`0x72` state,
while its SSB matches the first and third units. Its generic `img_active`,
`img_commit` and `img_executed` values remain zero; the actual kernel command
line and `sb_flag` path remain the relevant comparison. No new live rollback
or commitment test was performed.
