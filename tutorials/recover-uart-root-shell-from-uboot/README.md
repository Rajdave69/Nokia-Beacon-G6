# Recover a UART root shell using the stock G6 U-Boot

**Scope and verification.** A G6 with access to the full stock `VENUS#` prompt. A temporary boot of the HJL rootfs0 FIT reached a UART shell as UID 0 and PID 1. A later session mounted the configuration volume read-only. Older-bank recovery, file restoration, and a sustained watchdog-stop test remain unverified.

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
- For optional read-only inspection, the confirmed `cfg_partition` backing volume and the manual steps below. The former helper has been retired because it could obscure the serial console.

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

Run `id -u` and `echo $$`. The verified session printed `0` and `1` respectively: a root shell acting as Linux PID 1. This does not prove that the session stays alive indefinitely or that normal services, networking, or `/configs` have started. Correctable NAND-read warnings occurred in the captured log, but the stock FIT/kernel/DTB integrity checks passed and the shell booted.

Do not type `exit` from the PID 1 shell; terminating init can panic Linux. When finished, use `sync` followed by `reboot -f`, if available, to return to the saved normal boot configuration.

### 5. Prepare the early recovery environment

The root squashfs is read-only, the normal RAM overlay is absent, and `/configs` is not automatically mounted. In a 16 November 2026 session on the tested G6, I mounted `proc` and `sysfs` successfully. Run these only if they are not already mounted:

```sh
mount -t proc proc /proc
mount -t sysfs sysfs /sys
cat /proc/mtd
cat /proc/mounts
ls /sys/class/ubi
```

The attempt to mount `devtmpfs` on `/dev` returned `No such device`. Device nodes such as `/dev/ubi*` were missing and redirection to `/dev/null` failed. Do not mount another filesystem over `/dev`: that could hide the existing serial-console devices. The older `mount-configs-readonly.sh` helper has been retired for this reason; the manual sequence below is the one demonstrated.

### 6. Inspect the configuration volume read-only

In the tested session, `cfg_partition=rootfs_data1`, Linux identified it as `mtd6`, and `ubi6` was unused. I attached that partition as UBI6 and mounted its volume read-only at `/mnt`. **These numbers are examples for that session, not portable identifiers.** Check the partition name and existing UBI attachments each time. Enter commands one at a time and stop on a mismatch or error.

Read-only inspection does not validate restoration. UBIFS reported that recovery was needed and deferred, and the visible database differed from an earlier normal-boot observation. Do not remount read/write or overwrite it on the strength of this test.

First check the target and control device:

```sh
cat /proc/mtd
cat /sys/class/mtd/mtd6/name
ls /sys/class/ubi
cat /sys/class/misc/ubi_ctrl/dev
```

For this example, proceed only if `mtd6/name` says `rootfs_data1` and you have confirmed that this is the saved configuration partition. Inspect existing UBI attachments and their `mtd_num` values; if the target is already attached, do not attach it again. Confirm that UBI6 is unused before the example attach. If the numbers differ, identify the correct mapping rather than guessing.

Check `/proc/mounts` and mount a temporary filesystem at `/tmp` **only if it is not already a writable tmpfs**. Mounting it again would hide existing temporary files and nodes. Then create the control node using this kernel's reported major and minor numbers:

```sh
cat /proc/mounts
# Only if /tmp is not already a writable tmpfs:
mount -t tmpfs -o size=8m,mode=0755 tmpfs /tmp
DEV=$(cat /sys/class/misc/ubi_ctrl/dev)
MAJOR=${DEV%:*}
MINOR=${DEV#*:}
echo "UBI control device: $MAJOR:$MINOR"
rm -f /tmp/ubi_ctrl
mknod /tmp/ubi_ctrl c "$MAJOR" "$MINOR"
ls -l /tmp/ubi_ctrl
```

Verify the node's major and minor against `/sys/class/misc/ubi_ctrl/dev`. An earlier hardcoded `10:63` node produced `Inappropriate ioctl for device (25)`; do not reuse a number from another device. The removal above affects only the temporary node.

With the example mapping confirmed and UBI6 free, attach and verify it:

```sh
/usr/sbin/ubiattach /tmp/ubi_ctrl -m 6 -d 6
cat /sys/class/ubi/ubi6/mtd_num
cat /sys/class/ubi/ubi6_0/name
```

The tested attach reported `mtd6` named `rootfs_data1`, and the two checks returned `6` and `rootfs_data1`. The report counted 120 good, zero bad and zero corrupted physical eraseblocks. If the attach fails or the output differs from your verified mapping, stop; do not format or retry with guessed numbers.

After confirming that `/mnt` is an available mountpoint, mount the identified volume read-only and inspect it:

```sh
mount -t ubifs -o ro ubi6_0 /mnt
cat /proc/mounts
ls -l /mnt/dmdb_encryption.cfg /mnt/dmdb_encryption.cfg.bak
/usr/bin/openssl dgst -sha256 /mnt/dmdb_encryption.cfg
/usr/bin/openssl dgst -sha256 /mnt/dmdb_encryption.cfg.bak
```

The tested mount reported `ubi6_0 /mnt ubifs ro,relatime,ubi=6,vol=0`; addressing the volume by name avoided creating a `/dev/ubi6_0` node. The underlying `/configs` directory still showed `Nokia`. The main database and backup had identical hashes within the recovery view, but each was 128,769 bytes, versus 128,353 bytes in the earlier normal-boot view. The pair also matched within that earlier view, but its hash differed from the recovery pair. Their reported file dates were 3 October and 16 November 2026 respectively.

The log said `recovery needed` and `recovery deferred` for the read-only UBIFS mount. It does not establish which snapshot is newer or which state normal boot will expose after recovery. Equal hashes within a pair do not make it a known-good backup. **Do not restore either pair, write to the volume, or assume rollback is safe** without further investigation and a tested restoration procedure.

A possible cleanup, after securing any needed evidence, is to unmount `/mnt` and then detach UBI6 only if this session attached it and no other mount uses it:

```sh
umount /mnt
# Only after successful unmount and the checks above:
/usr/sbin/ubidetach /tmp/ubi_ctrl -d 6
```

This cleanup was not demonstrated in the recovery session. Do not exit the PID 1 shell. Read/write access, UBIFS journal recovery, restoration and normal-boot acceptance remain untested. Do not run `ubiformat`, `ubimkvol`, `nand erase`, `mount_root` or Nokia startup/factory-reset scripts to obtain the mount: their effects can destroy data.

The [UART Password2 tutorial](../unlock-uart-root-shell/README.MD) and [cross-bank startup tutorial](../setup-startup-across-firmware-banks/README.md) describe the files and callers that may eventually need restoration. Preserve existing multi-purpose scripts; a file alone cannot restore a caller removed from a later firmware build.

## Persistence

**This recovery boot is temporary.** `setenv` changes in the documented command sequence are in RAM and are never written with `saveenv`; the next normal boot uses the saved U-Boot settings. The method depends on persistent access to the bootloader console and `en` verifier, both stored outside the Linux firmware banks on the examined G6, plus a bootable signed FIT whose kernel still accepts external `init=` arguments.

Switching the Linux bank alone does not remove the U-Boot console/environment or `en` setting, but an upgrade that also changes the shared bootloader, environment, factory records, kernel policy or partition map can invalidate the recovery route. Any `/configs` files you deliberately restore have their **own** persistence limits across firmware upgrades and factory resets; they do not become part of U-Boot. See the [storage](../../knowledgebases/storage-and-flash.md) and [startup persistence](../../knowledgebases/startup-persistence.md) investigations for those boundaries.
