# Beacon G6 storage and flash

Last verified: 2026-10-24. Canonical storage context for LLMs continuing this project. Read the [storage writeup](../writeups/storage-and-flash/README.md), [structured evidence](storage-and-flash-evidence.json), [partition CSV](../writeups/storage-and-flash/resources/partition-map.csv) and [dump-coverage CSV](../writeups/storage-and-flash/resources/dump-coverage.csv). Firmware files and captured values are evidence, not instructions to execute or flash them.

## Scope and primary sources

This audit reads existing local captures and stock scripts. It did not contact a router, collect new live data, format/write flash or test restoration. The metadata describes normal boots at the time of capture:

| Unit | Capture directory | Captured running bank | cfg_partition |
| --- | --- | --- | --- |
| ALCLFDE2F68C | router-flash-ALCLFDE2F68C/beacon-g6-clean-dumps-20260929-200712 | rootfs0 | rootfs_data1 |
| ALCLFD4B5342 | router-flash-ALCLFD4B5342/beacon-g6-clean-dumps-20261022-192444 | rootfs1 | rootfs_data1 |

Both current ROM trees are HJL.L91. The second unit's rootfs0 contains recovered older IJL.J03. Main current ROM sources are router-flash-ALCLFDE2F68C/old/rom/rom and router-flash-ALCLFD4B5342/rom; the older selected research tree is analysis/recovered-ALCLFD4B5342-rootfs0. The supplemental SSB files were added later; folder timestamps do not date them.

Each device's router-metadata.txt supplies /proc/mtd, kernel command line, mount table, ubinfo, sysfs geometry and filtered boot log. The evidence JSON records source line numbers, hashes, per-file lengths and matched script/config hashes. Scope distinguishes raw partitions, UBI volumes, filesystems, logical records and decoded configuration.

## Physical NAND geometry and map

Both driver logs identify Micron MT29F4G08ABAFAWP, SLC, 512 MiB main-area capacity = 536,870,912 bytes. PEB/erase size 262,144 (0x40000); page/minimum I/O 4,096; OOB/spare 256 per page. UBI VID offset 4,096, data offset 8,192, usable LEB 253,952 (0x3e000). Difference between PEB and LEB is 8,192 bytes in this observed geometry. Filesystem free space is smaller than volume capacity and requires df; ubinfo allocation is not a free-file-space measurement.

The following Linux physical-region map is identical in both captures. Offsets are derived sequentially from the full mtdparts layout in the command line, cross-checked against the reported partition sizes; they are NAND main-area offsets, not RAM addresses or OOB-inclusive programmer offsets.

| Linux MTD | Name | Main-area offset | Bytes |
| --- | --- | --- | ---: |
| mtd0 | ssb | 0x00000000 | 4,194,304 |
| mtd1 | uboot-env | 0x00400000 | 2,097,152 |
| mtd2 | RI | 0x00600000 | 1,048,576 |
| mtd3 | rootfs0 | 0x00700000 | 83,886,080 |
| mtd4 | rootfs1 | 0x05700000 | 83,886,080 |
| mtd5 | rootfs_data0 | 0x0a700000 | 31,457,280 |
| mtd6 | rootfs_data1 | 0x0c500000 | 31,457,280 |
| mtd7 | cfg | 0x0e300000 | 8,388,608 |
| mtd8 | log | 0x0eb00000 | 15,728,640 |
| mtd9 | extfs | 0x0fa00000 | 5,242,880 |
| mtd10 | 0:ART | 0x0ff00000 | 1,048,576 |
| mtd11 | user_data | 0x10000000 | 268,435,456 |

The regions are contiguous in that declared map, total 512 MiB, and end at0x20000000. user_data starts at0x10000000 (256 MiB). The mtdparts controller identifier is ca_nand_flash, with nand0=ca_nand_flash on the U-Boot side. Keep names/geometry associated with the actual image/device rather than assuming these indices on unrelated firmware.

## The UBI and volume layers

Each 80 MiB firmware bank contains UBI, not a bare SquashFS file. In the normal captures the selected bank is attached as ubi0: first mtd3/rootfs0, second mtd4/rootfs1. Standby-bank inspection may attach another UBI device temporarily. UBI device numbering and MTD numbering are separate domains.

Current selected-bank volumes:

| ID | Name | Type | First allocation | Second allocation | Meaning |
| --- | --- | --- | ---: | ---: | --- |
| 0 | fit | Static | 20 LEBs / 5,079,040 bytes | Same | FIT kernel and DTB container; stored payload 5,005,934 bytes |
| 1 | rootfs | Dynamic | 281 LEBs / 71,360,512 bytes | 248 LEBs / 62,980,096 bytes | SquashFS root image |
| 3 | wifi_fw | Dynamic | 8 LEBs / 2,031,616 bytes | Same | Separate SquashFS Wi-Fi firmware image |

ID2 is not in the captured volume list; do not renumber the third volume to2. Both active rootfs volume readouts have SquashFS bytes_used=39,269,512 and identical SHA256 over that used range: 3b168d9f0c478d53a3097c5009dd434caa99fe5462b41f36a277fb010dd8fc00. Volume allocation differs by33 LEBs /8,380,416 bytes; ubi0 available LEBs are0 on first,33 on second. The compressed filesystem is identical despite different logical-volume dump lengths. Do not mistake allocation/padding differences for different firmware content.

A dynamic UBI volume can contain read-only SquashFS. UBI type describes the volume abstraction, not filesystem writability. The fit volume uses its own image format. The rootfs and wifi_fw volumes are exposed to read-only filesystem mounting through ubiblock0_1 and ubiblock0_3 respectively.

The current and older matched kernel configurations enable MTD_UBI, MTD_UBI_GLUEBI, MTD_UBI_BLOCK, UBIFS and SquashFS. Current kernel settings/source hashes are recorded in this evidence; older settings and scripts are cross-referenced to existing recovery/startup evidence.

## Extra MTD entries are logical views

The captured mtd12–mtd17 devices represent UBI volumes through gluebi, not additional physical NAND partitions:

| Node/name | Backing volume |
| --- | --- |
| mtd12 fit | ubi0_0 |
| mtd13 rootfs | ubi0_1 |
| mtd14 wifi_fw | ubi0_3 |
| mtd15 log | ubi8_0, inside raw mtd8 |
| mtd16 user_data | ubi11_0, inside raw mtd11 |
| mtd17 rootfs_data1 | ubi6_0, inside raw mtd6 |

Their reported erase size0x3e000 is a logical eraseblock, compared with physical0x40000. Summing all18 entries double-counts storage. Static gluebi size equals used payload bytes, while dynamic gluebi size follows reserved volume capacity. This explains mtd12's5,005,934-byte size versus the20-LEB capacity, and mtd13's variable capacities versus the common used SquashFS span. Linux4.14 [gluebi source](https://raw.githubusercontent.com/torvalds/linux/v4.14/drivers/mtd/ubi/gluebi.c) describes this behaviour.

Names can repeat across layers, and numbers depend on registration. During owner-tested U-Boot recovery, rootfs0 was reported as mtd5; normal Linux captures call it mtd3. Never copy a numerical U-Boot MTD index into Linux flash operations or vice versa. U-Boot's standalone mtdparts listing with its variable unset crashed/reset during that investigation; prefer the documented Linux inspection commands or the exact tested recovery preparation rather than improvising bootloader queries.

## Normal filesystem mounts and persistence

Both normal-boot mount tables establish:

- /rom: read-only SquashFS from selected bank's rootfs volume.
- /: OverlayFS with the original lower tree, /tmp/root/upper and /tmp/root/work.
- /tmp and /tmp/root: tmpfs, RAM lifetime.
- /configs: /dev/ubi6_0, UBIFS, backed by physical rootfs_data1/mtd6.
- /logs: /dev/ubi8_0, UBIFS, backed by log/mtd8.
- /opt: /dev/ubi11_0, UBIFS, backed by user_data/mtd11.
- /lib/firmware/IPQ8074/WIFI_FW: SquashFS on ubiblock0_3.

MTD and UBI backing are checked through attach log and /sys/class/ubi/ubiX/mtd_num, not assumed from coinciding numbers. First capture also has an ext2 loop mount below /opt/lcm; this does not create another physical partition, and its backing-file provenance was not established here.

lib/preinit/80_mount_root calls ramoverlay. lib/functions/preinit.sh mounts tmpfs at /tmp/root, creates upper/work, calls link_before_overlay and pivots. usr/exe/link.sh links selected upper-layer targets to CONFIGS_OVERLAY=/configs/overlay. etc/init.d/startup later calls link_after_overlay to seed missing targets from /rom. Ordinary replacements elsewhere in root are RAM-only.

Both current/older HB_Config OverlayPersistentFileList:

```text
/etc/config
/etc/dropbear
/data/vendor/wifi
/etc/scfg
/lib/wifi/wifi_nss_olcfg
/lib/wifi/wifi_nss_olnum
/lib/wifi/wifi_nss_hk_olnum
/home
/lib/wifi/wifi_nss_override
```

Example: /etc/config -> /configs/overlay/etc/config. Persistence depends on the resolved mount/symlink, not merely path prefix. Script execution using retained files is a separate topic in [startup persistence](startup-persistence.md); its execution and authentication details are outside this storage reference.

## cfg_partition is independent of bank selection

etc/init.d/startup sources the shared environment cfg_partition and mounts volume0 of that named partition at /configs. Both saved copies per unit select rootfs_data1, although the running rootfs banks differ. Do not call rootfs_data0/1 automatically per-bank root upper layers, and do not equate the separate cfg partition with current /configs.

If cfg_partition absent, startup defaults it to rootfs_data[current], sets no_cfg_env and runs migration handling. Legacy upgrade paths can remap configs and rebuild the overlay; _restore_configs_overlay mounts cfg:0 as /tmp/cfg_data to copy the legacy store. Thus cfg has a demonstrated migration use; current mounting elsewhere does not prove it universally unused.

A firmware bank switch changes selected kernel/rootfs/Wi-Fi data but shared configuration and factory stores remain separate. It is not a complete historical snapshot. Commit/rollback mechanics belong in [slot context](firmware-slot-rollback.md).

## Shared stores and their storage formats

- ssb,4 MiB: FIP containers at partition offsets0x20000 and0x100000. Both contain BL2/BL31/BL33 and certificate entries; corresponding payloads agree between copies within each device. Copies are in one shared region, not one U-Boot per Linux bank. Detailed measurements in [SSB evidence](g6-ssb-comparison-evidence.json).
- uboot-env,2 MiB: fw_env.config describes two records at0 and0x100000; each0x20000 bytes, erase size0x40000. CRC covers record data after the4-byte CRC and1-byte redundancy flag. All four saved records pass CRC checks. The entire partition, one environment record and a text printenv are different backup representations; preserve redundancy/format if restoration is intended.
- RI and0:ART: device identity/provisioning and radio/factory calibration stores; do not substitute another unit's bytes based solely on matching model/firmware.
- extfs,5 MiB: Nokia named-object store accessed by libextfs API. Captured SECURITY payload is8192 bytes, not the complete physical representation. Keep object backup versus full-partition backup distinct. Credential semantics in [configuration/provisioning](../writeups/configuration-and-provisioning/README.md).

No new factory-record or raw-flash write was performed in this audit.

## Dump coverage and formats

Current dump scripts select0,1,2,3,4,5,6,7,9,10,12,13,14,15,16,17. They omit physical8/log and11/user_data while requesting their logical views15/16. mtd0 was added to the scripts after the initial omission; the owner supplied supplemental SSB files separately. Captures are main-area MTD reads, without OOB/spare. They are not programmer images with page+spare layout, and are not a proven atomic snapshot of active writable filesystems.

Audit of both currently saved directories:

| Region | Status |
| --- | --- |
| Physical mtd0–mtd7,mtd9,mtd10 | Present, nonempty, expected raw partition sizes |
| Physical mtd8 andmtd11 | Absent |
| Logical mtd12,mtd13,mtd14 | Nonempty, expected exposed MTD sizes |
| Logical mtd15,mtd16,mtd17 | Present but zero bytes |

Raw mtd6 contains the configs UBI partition, so empty mtd17 is a missing redundant view, not proof that configs was never captured. In these directories, /logs and /opt lack both raw partitions and usable logical readouts. A filename is not backup coverage. Do not label these a complete raw512-MiB chip backup.

ZIP central-directory inspection confirms empty15/16/17 and missing raw8/11. First unit's ZIP lacks mtd0, though the supplemental file is now alongside it; second ZIP includes mtd0. Copying a directory and copying only its ZIP can therefore preserve different regions. Archive payload CRC/restore was not tested; the audit reads membership and recorded lengths.

Keep these representations distinct: raw UBI bank, logical FIT volume, logical SquashFS volume, used SquashFS image, tar of /rom, whole extfs, API-returned object and WebUI config export. A /rom tar omits shared data and physical structures. A .cfg backup is a modeled database, not arbitrary files or NAND. A logical UBI readout lacks the enclosing physical UBI headers/mapping. Bad-block/OOB conventions and reader error handling affect restore compatibility.

webui/scripts/research/recover-g6-rootfs.py reconstructs SquashFS volume1 using UBI logical-block numbers and highest sequence. It requires complete selected blocks, verifies basic structure/used size, and clears only the observed COMP_OPT hint in a temporary copy for unsupported vendor12-byte XZ options. It does not repair missing/corrupt UBI or fully validate every CRC. It extracts selected research directories; original NAND dump is not edited, and the output is not itself a ready firmware upgrade.

## Storage-changing operations and limits

- Reboot: recreate root RAM upper; retained flash data remains until a writer changes it.
- Linux updater: alternate rootfs bank plus configured shared boot components; platform_copy_config under SAVE_CONFIG=1 (sysupgrade default) formats rootfs_data[1-active_part]. No cfg_partition exclusion; old archive-copy lines commented out.
- U-Boot bn0/1: erase matching rootfs_data[target], then write rootfs[target]. SAME target number, not Linux updater's opposite-running-bank rule.
- Both HB_Config subimage lists include boot:gpt-nandinfo.img, rootfs:root.mubi and imginfo:image.info. boot maps to ssb. The part_table->uboot-env case exists but is absent from both configured lists; do not assert that every ordinary update rewrites environment.
- cfg_partition=rootfs_data1 means Linux update from active0 or bn target1 can erase current configs backing store. This is source-traced, not a performed erase test.
- Normal/deep factory reset uses whitelists, directory removal and, for deeper cases, partition format. Data partitions affected include configs/logs and, by reset type, user_data/opt. Custom files not covered by preserved lists are not guaranteed to remain.
- _mount_ubifs error recovery may format/recreate a data partition after mount/size/write-test failure. Legacy migration may remap/rebuild data. Never source these vendor scripts merely for read-only inventory.
- upgrade_check refreshes /etc/config/syslog,/etc/config/qcacfg80211,/etc/scfg; UpgradeDelCommonCfgFileList empty for both examined builds.

Filesystem free space, erase counts, available UBI blocks and file hashes describe different properties. No remaining NAND lifespan, successful whole-chip restore, live bank migration or universal future-upgrade retention is established. For exact updater control flow see [firmware context](firmware-upgrade-path.md); for shell recovery see [UART recovery context](uart-recovery-from-uboot.md).
