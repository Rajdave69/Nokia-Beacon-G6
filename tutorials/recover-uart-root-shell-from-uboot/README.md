# Recover a UART root shell using the stock G6 U-Boot

## Introduction

The Nokia Beacon G6's ordinary UART route goes through Nokia's Linux CLI and its `Password2` check. A rootfs change can remove a custom `Password2` overlay or its startup hook. If you can still access the **full stock U-Boot** prompt, there is a separate recovery route that does not depend on those Linux files.

The existing bootloader can load a stock, signed FIT from the installed firmware bank, while passing `init=/bin/sh` as a **temporary** Linux boot argument. On 24 October 2026 this worked with the captured **current rootfs0** kernel: the resulting shell reported UID 0 and PID 1, before normal Nokia services or `Password2` started. The bootloader reported successful FIT signature/hash verification; this method does not disable secure boot, patch the kernel or write a replacement image.

The older `IJL.J03` bank and the subsequent configuration-restore stage have **not** been live-tested. A delayed reset was also reported after the initial working session; watchdog expiry is plausible, but not confirmed. The optional watchdog-stop prefix in this guide has not yet been validated by a long-running session.

### What you will do

1. Enter the full `VENUS#` U-Boot console and confirm the selected bank.
2. Set the partition map in **RAM** so that U-Boot can locate the stock FIT.
3. Boot the selected known rootfs0 FIT with `/bin/sh` as PID 1.
4. Verify the recovery shell, then, if necessary, inspect persistent configuration before restoring a normal login route.

### What you need

- A working 115200-baud UART adapter and access to the stock `VENUS#` prompt via [UART console](../enable-uart-console/README.MD) and [`en` authentication](../unlock-uboot-en-console/README.MD).
- A G6 with the **validated partition layout** and a bootable current stock `rootfs0` bank.
- The supplied command reference [`resources/recover-bank0.cmd`](resources/recover-bank0.cmd).
- For optional configuration recovery, the included [`resources/mount-configs-readonly.sh`](resources/mount-configs-readonly.sh) and a confirmed `cfg_partition` backing volume.

> [!caution]
> Work only with your own device and check the partition layout first. Do **not** run `bn0`, `bn1`, `nand erase`, `ubiformat` or a vendor reset script here. The stock `bn1` path can erase `rootfs_data1`, which was the configuration store on the tested setup. Do not use `saveenv` for these recovery arguments.

### Why the partition-map step matters

An early attempt at `ubi part rootfs0` failed because U-Boot had not initialized `mtdparts`, despite having `mtdids`. Running the standalone `mtdparts` listing in that unset state caused a synchronous abort and reset. Nokia's normal `bootcortina` supplies both variables before reading UBI; the recovery sequence reproduces them with unsaved `setenv` commands. The MTD numbers reported by U-Boot can differ from Linux's `/proc/mtd` numbers, so use the verified *partition names*.

### 1. Enter U-Boot and confirm the bank

Interrupt autoboot, pass `NOKIA > en`, and reach the full `VENUS#` prompt. Check the saved selection by typing `printenv active_part cfg_partition bootcmd`.

The verified run had `active_part=0`, `cfg_partition=rootfs_data1`, and `bootcmd=bootcortina`. The commands below target **rootfs0**. If your router reports a different layout or boot bank, stop rather than pasting the rootfs0 commands unchanged. Manually booting another bank is not a replacement for the stock activation/commit mechanism.

### 2. Prepare the watchdog and partition map

Enter commands **one at a time** and stop if anything fails:

```text
wdt dev watchdog@0xf432901c
wdt stop
setenv mtdids 'nand0=ca_nand_flash'
setenv mtdparts 'mtdparts=ca_nand_flash:4M@0x0(ssb),2M(uboot-env),1M(RI),80M(rootfs0),80M(rootfs1),30M(rootfs_data0),30M(rootfs_data1),8M(cfg),15M(log),5M(extfs),1M(0:ART),256M(user_data)'
```

The `wdt` prefix is intended to prevent an armed watchdog from resetting Linux while normal startup is bypassed. **The cause of the reported delayed reset and the effectiveness of this prefix remain unverified.** If `wdt dev` or `wdt stop` fails, do not silently assume the watchdog was disabled. The partition map comes from both examined G6 bootloaders, not a universal Nokia layout.

### 3. Load and boot the stock FIT

```text
ubi part rootfs0
ubi read 0x10000000 fit
setenv bootargs 'cnss2.bdf_pci0=0xa0 cnss2.bdf_pci1=0xa1 earlycon=serial,0xf4329188 serial_is_dis=0 console=ttyS0,115200 ubi.mtd=rootfs0 ubi.block=0,1 root=/dev/ubiblock0_1 rootfstype=squashfs rootwait ro init=/bin/sh'
setenv bootargs ${bootargs} ${mtdparts}
bootm 0x10000000
```

Here, `ubi read` loads the bank's **existing** `fit` volume into RAM; `bootm` boots that loaded image. `serial_is_dis=0` keeps UART exposed on the examined current kernel and `init=/bin/sh` starts the recovery shell instead of the ordinary Nokia init chain. **Do not** substitute `boot`, `bootd` or `bootcortina`: the vendor boot path reconstructs `bootargs` and discards the recovery override.

The command file is a copy/paste reference, not a compiled U-Boot script image; do not pass it directly to U-Boot's `source` command. Bank1 would require corresponding changes to both `ubi part` and `ubi.mtd`, but that route has not been live-tested.

### 4. Confirm the root shell

Run `id -u` and `echo $$`. The verified session printed `0` and `1` respectively: a root shell acting as Linux PID 1. This is **not** proof that the session stays alive indefinitely or that normal services, networking, or `/configs` have started. Correctable NAND-read warnings occurred in the captured log, but the stock FIT/kernel/DTB integrity checks passed and the shell booted.

Do not type `exit` from the PID 1 shell; terminating init can panic Linux. When finished, use `sync` followed by `reboot -f`, if available, to return to the saved normal boot configuration.

### 5. Inspect and optionally restore persistent files

The recovery shell starts before normal mount setup. The squashfs root is read-only, the RAM overlay is not established, and `/configs` is not automatically mounted. Copying to `/usr` or `/etc` at this point will not repair a normal boot.

The included `mount-configs-readonly.sh` is an *optional*, conservatively guarded helper for the observed `cfg_partition=rootfs_data1` environment. It prepares the necessary proc/sysfs/device access, resolves the backing Linux MTD **by name**, attaches an available UBI device and mounts its volume read-only. Before use, review the script and confirm `cfg_partition`; the mount/restore flow has been syntax-checked but **not live-tested**. Run a copied script as a **child** with `sh /tmp/mount-configs-readonly.sh`, not by sourcing it into PID 1.

Inspect the mounted files and make a backup before any write. If you intentionally need to restore the saved public key or custom `sec_cli` overlay and its startup script, only then remount the established `/configs` read/write (`mount -o remount,rw /configs`). The [UART Password2 tutorial](../unlock-uart-root-shell/README.MD) explains the relevant payloads. Merge changes into existing multi-purpose hooks instead of overwriting them. A new rootfs that no longer calls a hook will not run it merely because the file is present; the [cross-bank startup tutorial](../setup-startup-across-firmware-banks/README.md) describes the known late-hook option.

Do not invoke Nokia's ordinary startup or factory-default scripts just to mount `/configs`: their error paths may format data. After deliberate changes, sync, unmount the data volume safely and reboot normally. Test the normal authentication route separately.

## Persistence

**This recovery boot is temporary.** `setenv` changes in the documented command sequence are in RAM and are never written with `saveenv`; the next normal boot uses the saved U-Boot settings. The method depends on persistent access to the bootloader console and `en` verifier, both stored outside the Linux firmware banks on the examined G6, plus a bootable signed FIT whose kernel still accepts external `init=` arguments.

Switching the Linux bank alone does not remove the U-Boot console/environment or `en` setting, but an upgrade that also changes the shared bootloader, environment, factory records, kernel policy or partition map can invalidate the recovery route. Any `/configs` files you deliberately restore have their **own** persistence limits across firmware upgrades and factory resets; they do not become part of U-Boot. See the [storage](../../knowledgebases/storage-and-flash.md) and [startup persistence](../../knowledgebases/startup-persistence.md) investigations for those boundaries.
