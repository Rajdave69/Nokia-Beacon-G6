# Beacon 9 storage: eMMC and GPT

What survives a firmware-bank switch on the Beacon 9, and how does its layout differ from the G6's NAND? The captured Beacon 9 `B9-A` runs HomeOS 25.03 `JJM.K44p01` on a Qualcomm platform with eMMC. Its storage uses a GPT partition table and ext4 data filesystems, rather than the G6's NAND/UBI layout. This page describes the captured device and build, not every Beacon 9 or a controlled same-hardware release comparison.

## The layers

The eMMC user area holds named GPT partitions. Separate eMMC boot areas are not GPT partitions; both reported kernel `force_ro=1` in the capture. Linux exposed no populated `/proc/mtd` or `/dev/mtd*` in that session. The two 128 MiB rootfs partitions contain SquashFS images; the captured p23 and p24 SquashFS payloads matched. Identical payloads do not identify the active boot slot by themselves.

The capture also contains separate bootloader, kernel, Wi-Fi firmware and data partitions. A suffix such as `_1` denotes a named counterpart; it does not by itself establish which copy was active or that the whole device rolls back atomically.

## Partition map

The captured GPT has 32 entries. Sizes below derive from 512-byte sectors. Descriptions marked likely or inferred are not independently proven roles.

| Partition | Name | Size | Captured role or interpretation |
| --- | --- | ---: | --- |
| p1 / p2 | `0:SBL1` / `0:SBL1_1` | 1 MiB each | Early boot and counterpart |
| p3 / p4 | `0:BOOTCONFIG` / `0:BOOTCONFIG1` | 256 KiB each | Boot configuration copies |
| p5 / p6 | `0:QSEE` / `0:QSEE_1` | 1.75 MiB each | Trusted environment images |
| p7 / p8 | `0:DEVCFG` / `0:DEVCFG_1` | 256 KiB each | Device configuration |
| p9 / p10 | `0:TME` / `0:TME_1` | 512 KiB each | Trusted-management role inferred |
| p11 / p12 | `0:CDT` / `0:CDT_1` | 256 KiB each | Configuration data table, likely |
| p13 / p30 | `0:APPSBLENV` / `0:APPSBLENV_1` | 256 KiB each | Bootloader environment and counterpart, role inferred |
| p14 / p15 | `0:APPSBL` / `0:APPSBL_1` | 2 MiB each | Application bootloader copies |
| p16 | `0:ETHPHYFW` | 512 KiB | Ethernet PHY firmware |
| p17 | `0:ART` | 1 MiB | Likely radio calibration / board data |
| p18 | `0:LICENSE` | 256 KiB | Vendor licensing data |
| p19 / p20 | `0:WIFIFW` / `0:WIFIFW_1` | 12 MiB each | Wi-Fi firmware; p19 was mounted |
| p21 / p22 | `0:HLOS` / `0:HLOS_1` | 10 MiB each | Likely Linux kernel images |
| p23 / p24 | `rootfs` / `rootfs_1` | 128 MiB each | Root filesystem slots |
| p25 | `RI` | 1 MiB | Role unconfirmed in the initial partition inventory |
| p26 | `EXTFS` | 6 MiB | Vendor data; role not established by the initial inventory |
| p27 | `log` | 64 MiB | `/logs` backing partition |
| p28 | `cfg` | 64 MiB | `/configs` backing partition |
| p29 | `cfg_1` | 64 MiB | `/backup` in this capture |
| p31 | `opt` | 504 MiB | `/opt` backing partition |
| p32 | `mft_data` | 8 MiB + 4 KiB | Data filesystem, mounted read-only |

The last listed GPT partition ends before the end of the eMMC user area. The remaining space was not examined and should not be assumed free for reuse. Boot, factory and calibration regions can be essential or device-specific; keep captures private.

## What was mounted

The captured normal-boot mount table showed:

| Path | Backing source | Filesystem |
| --- | --- | --- |
| `/rom` | `/dev/root` | Read-only SquashFS |
| `/` | Overlay over `/tmp/root` | RAM-backed writable overlay |
| Wi-Fi firmware | p19 | Read-only SquashFS |
| `/configs` | loop device over p28 | ext4, read-write |
| `/logs` | loop device over p27 | ext4, read-write |
| `/backup` | loop device over p29 | ext4, read-write |
| `/opt` | loop device over p31 | ext4, read-write |
| `/mft_data` | loop device over p32 | ext4, read-only |

The writable root overlay is in RAM; an ordinary change in that layer can disappear at reboot. Persistent data uses separate filesystems, but a persistent location is not a guarantee that reset or upgrade policy preserves every file. The [factory-reset comparison](../factory-reset/README.md) discusses the separately traced policies.

The p28 configuration filesystem was extracted read-only and contained management state including the stored database and `usp.db`. The p29 backup contained stored database copies. The snapshots are not an atomic history, and their presence does not prove a successful restoration or a live management connection. [Provisioning comparison](../provisioning-pipeline/README.md).

For the corresponding G6 NAND map, see [Beacon G6 storage](beacon-g6.md). The [Beacon 9 companion repository](https://github.com/Rajdave69/Nokia-Beacon-9) contains the wider model-specific firmware investigation.
