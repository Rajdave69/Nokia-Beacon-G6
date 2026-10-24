# A UART root shell without waiting for Password2

## The third gate belongs to normal Linux startup

The earlier UART work left three apparent requirements: enable the console, pass Nokia's U-Boot en prompt, and pass Password2 after Linux starts. We could change the first two in shared bootloader environment and extfs. The Password2 replacement was different: it lived on persistent data and needed a Linux boot script to reinstall a runtime override.

That arrangement was useful for ordinary startup, but it did not answer the recovery question. If an upgrade erased the files or removed their caller, how could I get a shell to put them back?

The answer turned out to be in the boot sequence rather than in the Password2 verifier. Full U-Boot can load the existing stock FIT and give its kernel a different initial userspace program. On 24 October 2026, the owner tested init=/bin/sh on rootfs0. The resulting UART shell reported UID0 and PID1. Nokia's normal init sequence and routing CLI had not started, so there was no Password2 check to pass.

## First reproduce the partition setup, not just the boot arguments

My first manual sequence started too late in Nokia's boot routine. ubi part rootfs0 failed because the named partition had not been registered in the current U-Boot session. Trying image0 did not help. The standalone mtdparts listing, while its environment variable was absent, then triggered a Synchronous Abort and CPU reset. A command intended only to inspect state can still hit a firmware bug.

Tracing bootcortina exposed the missing preparation. Both captured BL33s build the same complete partition string and set mtdparts and mtdids before calling UBI. The first routine is at0x40032d0; the second is at0x40032a0. They select rootfs[active_part], read its fit volume into0x10000000, build the normal kernel arguments, then run bootm at that address.

The successful recovery reproduced the two partition assignments first, loaded the stock FIT, and supplied serial_is_dis=0 plus init=/bin/sh. It then used bootm directly. Calling bootcortina at that point would rebuild bootargs and discard the recovery choice.

The [tutorial](../../tutorials/recover-uart-root-shell-from-uboot/README.md) retains the exact successful command sequence and the missing-variable pitfall. It uses environment changes in RAM, without saveenv, and contains no explicit flash write or erase. That does not promise that UBI attachment or all bootloader state handling performs zero metadata writes.

## What the live result establishes

The owner supplied:

```text
/ # id -u
0
/ # echo $$
1
```

U-Boot also reported successful sha256,rsa2048 verification of the stock FIT configuration, and matching SHA256 checks for the kernel and DTB. The loaded FIT was5,005,934 bytes; the supplied kernel digest agrees with both captured current HJL.L91 images. The response did not explicitly identify which physical G6 was used, so I have not assigned it a serial number from the selected bank alone.

This is a live root-shell result, not just a command found in a binary. It is also narrower than an unsigned-firmware or bootloader replacement result: the existing authenticated kernel booted with owner-controlled startup arguments. The [U-Boot bootm documentation](https://docs.u-boot.org/en/latest/usage/cmd/bootm.html) describes that RAM-image launch interface; our trace and live output establish the G6-specific path.

The corrected attach reported rootfs0 as mtd5 in U-Boot. Linux's captured physical map calls it mtd3. These numbers belong to different registration contexts; the established partition name is what connected the operations. The NAND messages described correctable errors, followed by completed reads, passing image checks and a successful shell. They are not evidence that the image needed erasing or that signature validation failed.

## The temporary shell also needs to remain alive

After the successful UID0/PID1 boot, the owner reported that the router resets after a while. Watchdog expiry is a plausible explanation while normal startup is bypassed, but the reset cause and elapsed time have not been established. The owner supplied these U-Boot commands:

```text
wdt dev watchdog@0xf432901c
wdt stop
```

The tutorial and pasteable command file now place them before the partition setup and Linux boot. They select and stop that watchdog for the recovery session; they do not install a persistent fix. The original live test establishes root entry. It does not yet establish that the watchdog-prefixed sequence eliminates the delayed reset over a sustained session.

## This recovers the persistent overlay instead of depending on it

The distinction is useful after a rootfs update. The normal UART route still uses the Password2 override once the stock startup hook has run. The recovery route reaches a root shell before that hook, and can restore the stored helper, password/key and caller for the next ordinary boot.

The root shell does not automatically mean the normal writable overlay or /configs has been mounted. Normal services, generated accounts and device setup may also be absent. The tutorial includes an optional helper that resolves the captured configs backing store by its Linux name, prepares volatile device nodes and mounts it read-only. That helper is separately marked as not live-tested; the confirmed result is the PID1 shell, not a completed configuration restore.

After inspecting and backing up the correct data, it can be mounted writable to restore the [existing Password2 arrangement](../../tutorials/unlock-uart-root-shell/README.MD). If using the public-key method, the required public PEM and boot script can be recreated as text over UART; the signing private key stays on the owner's computer. The [common late hook](../../tutorials/setup-startup-across-firmware-banks/README.md) supplies a caller in both inspected builds. Existing multi-purpose scripts must be merged rather than overwritten.

A file inside squashfs cannot simply be copied over from U-Boot. A RAM overlay also does not exist until Linux creates it. The early root shell provides the environment in which to prepare runtime mounts or restore persistent instructions; it does not itself patch the stored rootfs.

## U-Boot can write the banks, but bn has an important side effect

Both actual command tables contain85 records, including NAND read/write, UBI read/write, bootm, booti and TFTP. They contain UBIFS load/list/mount commands but no ubifswrite entry. The owner's live help confirms the expected interfaces and Nokia's bn image0/image1 targets.

The bn handler is at0x400c710 in the first BL33 and0x400c6b0 in the second. It downloads the supplied file into RAM at0x05000000. For target0 or1, it first calls erase_rootfs_data for the corresponding bank number, then writes the named rootfs0/rootfs1 partition through image_write. The file-writing helper erases/writes partition data; it is not a configuration importer or a way to edit one file in UBIFS.

That matters here: cfg_partition=rootfs_data1 means the bn image1 route can erase the entire store holding /configs before writing image1. This differs from the Linux updater's opposite-bank rootfs_data formatting path. Neither should be used as a casual single-script restore tool.

Writing a prepared UBI volume or repacked stock filesystem is technically within the exposed interfaces, but it is a separate operation needing a verified image, correct volume/partition geometry and backups. The fit volume and squashfs rootfs volume are different objects. A bare squashfs file is not interchangeable with a complete rootfs-bank UBI image, and later upgrades can overwrite a modified bank again. No bn, NAND-write or UBI-write command was executed in this recovery test.

## What remains dependent on the next firmware

For the tested setup, root UART recovery no longer depends on retaining our Password2 files: full U-Boot and a stock-kernel recovery boot are sufficient. Keep the command sequence and verified backups off the router. There is no need to install a custom bootloader to reproduce this result.

The older IJL.J03 bank remains a separate live test. Offline, its config module also shows an empty built-in command line, no CMDLINE_FORCE, and support for UBI, UBIFS and squashfs. Those settings support the method but do not replace an actual boot result.

Future firmware may replace the bootloader, alter console/authentication policy, force a kernel command line or change the storage layout. A separately tested rescue kernel/initramfs kept off-device would reduce dependence on either installed bank; that route was not validated in this follow-up. The result is a concrete recovery method for the known setup, not an unconditional promise through every future update.

The [knowledgebase](../../knowledgebases/uart-recovery-from-uboot.md), [evidence](../../knowledgebases/uart-recovery-from-uboot-evidence.json) and [command-inventory source](../../webui/scripts/research/g6-uboot-command-inventory.py) retain the exact boundaries.
