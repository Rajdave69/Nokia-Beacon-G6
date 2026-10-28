# Following the physical reset button through the Beacon G6 firmware

Device references use the [shared aliases](../README.md#device-aliases). Source-provenance paths use the same private profile references as the other writeups; retained firmware scripts and disassembly keep their original bytes.

While normal Linux firmware is running, a factory reset rebuilds the working settings on the installed firmware. It does not put an old firmware image back, remove the router's factory identity, or erase every flash partition. There are also two factory-reset modes, with different preservation rules.

This follows the recovered G6 `IJL.J03p01` and `HJL.L91p01` images and compares the Beacon 9 `JJM.K44p01`. Everything below is from offline stock scripts, policy files and bounded static disassembly, checked on **27 October 2026**. No router was reset and no firmware code was executed in this investigation. Final settings after a real reset have not been captured.

## One button, three different actions

The entry point is [`/etc/rc.button/reset`](resources/G6-HJL/etc/rc.button/reset). Its bytes are identical in the two recovered G6 builds.

| Gesture in the shipped handler | G6 IJL and HJL | Beacon 9 JJM |
| --- | --- | --- |
| Ordinary short click | Reboot for BOQA; operator `0000` only logs the very short single-click case | Same basic distinction |
| Hold 1–9 seconds, then release | Reboot | Forced reboot |
| Hold at least 10 seconds | Normal factory reset | Normal factory reset |
| Rapid sequence of subsecond clicks | Double-click requests deep reset | Four clicks request deep reset |

The click detector uses integer-second `SEEN` values and the release-to-press interval. These are code paths, not measured timing/debounce instructions for a live device. In both scripts, the LED worker can synthesize a release after reaching the hold threshold and sleeping three more seconds. The executable test is `>=10`, even though comments describe “more than 10s”.

The Beacon 9's header still says double-click, but the implementation defaults `DEEP_FAC_COUNT` to **4** and logs a quad-click. It sources `/usr/exe/reset_var.sh`; the captured override only changes the LED functions. It does not change the count or hold threshold. `NO_DEEP_FLAG=/configs/NoDeepFactoryReset` is assigned but never tested in this script, so that filename alone does not establish a working deep-reset suppression mechanism.

## The button first schedules a reset

For a normal reset, the button writes a `LocalFactoryReset` origin marker if one does not already exist, runs `cfgcli backupkeyparam`, and invokes `/usr/exe/factory-default-reset`. A deep reset invokes the same script with `all`, without that button-side key-parameter backup call.

The scheduling script sets a shared bootloader-environment variable:

| Request | `factory_reset_flag` |
| --- | --- |
| Normal factory reset | `1` |
| Deep factory reset | `2` |
| Cleanup consumed | `0` |

It retries the environment write and then reboots. In `/etc/init.d/startup`, the mounted data directories are processed by `factory_back_default()` from [`/usr/exe/backdefault.sh`](resources/G6-HJL/usr/exe/backdefault.sh). This is where the main deletion and preservation work happens. The handler finally clears the reset flag.

The G6 scheduling script has its `jffs2reset -y` call commented out. The Beacon 9 actually invokes it. Its precise additional effect on this eMMC board has not been run or measured; that command is not evidence that all storage or either signed firmware image is rewritten.

## Normal reset: rebuild settings while retaining operator provisioning

The reset code uses **both** `FactoryResetDeepWhiteList` and `FactoryResetNormalWhiteList` from `/etc/HB_Config.json` during a normal reset. “Deep” in the first list's name means those entries also survive the stronger reset; it does not exclude them from the ordinary one.

On the G6, the code backs selected configuration entries into `/logs`, removes `/configs/*`, and restores the saved entries. It then temporarily saves selected log entries in `/configs`, removes `/logs/*`, and restores those entries. It removes the extra blacklist afterward. The database is subsequently rebuilt by normal initialization using ROM defaults, factory RI/SECURITY and applicable retained operator configuration.

| Material | Normal factory reset | Deep factory reset |
| --- | --- | --- |
| Working `dmdb_encryption.cfg` and its `.bak` | Removed from `/configs` | Removed |
| Current user LAN/Wi-Fi/WAN/firewall/port-forward settings in that database | Rebuilt from applicable defaults/policy; selected reset exceptions may apply | Rebuilt without the saved normal-reset operator files |
| `/configs/usp.db` | Removed; agent state can be recreated | Removed |
| Remote preconfiguration XML/KV and availability/debug markers | Preserved by the normal whitelist | Removed from the reset configuration volume |
| `/configs/zeroman/` packages and markers | Preserved | Removed from the reset configuration volume |
| `/configs/remote_rtscfg_keyparam` | Preserved | Removed from the reset configuration volume |
| `/configs/certs/`, `/configs/tr069_conf/` | Preserved | Removed from the reset configuration volume |
| WebUI branding/role files: `Adminuser.json`, `Normaluser.json`, CSS, logos | Preserved | Removed |
| `/configs/Nokia/`, and G6 `/configs/bosa/` | Preserved by the deep whitelist | Preserved by the deep whitelist |
| Selected diagnostic logs and reset-origin marker | Preserved by the deep whitelist | Preserved by the deep whitelist |
| `/configs/overlay` persistent settings, including `/etc/dropbear` and `/home` content linked there | Removed | Removed |
| Custom `/configs/debug`, `/configs/pre_app_boot.sh`, mount/app/driver payload files | Not whitelisted; removed | Removed |
| Most files installed under `/opt` | Left in place, except extra blacklist | Cleared with user-data volume |
| G6 `/opt/.backup` | Left in place | Cleared with user-data volume |
| Beacon 9 `/backup`, including `.backup` | Cleared after whitelist restoration | Cleared after whitelist restoration |
| Stock firmware, bootloader, RI identity, EXTFS factory credentials and calibration | Outside the reset cleanup targets | Outside the reset cleanup targets |

The preservation lists refer to paths, not a guarantee that a daemon will use every retained file. Likewise, deleting the working database does not prove every individual setting ends up at a universal value. For example, the common G6 BOQA114 operator recipe sets TR-181 and TR-369 enabled. Retaining and reapplying it can bring operator management settings back even if they were disabled in the old working database. Later external provisioning is another possible source of settings, not an action performed by the button script itself.

`Adminuser.json` and `Normaluser.json` are role/UI policy files. Their whitelist presence does not establish preservation of all changed WebUI login passwords. The actual username/password state belongs to the configuration and credential-source paths documented separately.

## What “default password” means here

A reset normally discards changes held only in the working configuration or a volatile shadow file. It then reuses the existing credential sources:

- Linux `root` starts from the stock ROM shadow template; no new root-password generation formula was found.
- Linux `superadmin` follows the existing factory `EXT_WEB_MGNT_PWD` preset path. A changed WebUI superadmin password is a separate state and is not guaranteed to survive database deletion.
- G6 `ONTUSER` can be recreated according to its feature/operator policy and the existing build/identity generator. A reset does not change the installed build or RI identity, so it is not evidence of a newly randomized account password.
- The examined Beacon 9 build still has its different account policy; resetting does not install the G6's ONTUSER behavior.
- The stored U-Boot `EXT_BOOT_PWD` verifier is outside the cleanup targets. A normal or deep reset does not deliberately restore a previous factory verifier over an owner-written value.
- Password2 still uses the stock verifier in the installed image. A runtime bypass has to be installed again after boot.

These are source-based expectations. Exact post-reset WebUI passwords, account flags and generated hashes were not newly measured. Preserved operator overrides can affect the resulting settings, and a factory reset is not a general credential-rotation operation.

## Why the key-parameter backup is another qualification

`cfgcli backupkeyparam` dispatches to `remote_rtscfg_extract_keyparam` in `libcfg.so`, not directly to a universal export of all user settings. The G6 fixed table has six URI slots: GPON subscription password, HexSLID, PLOAM type, and three configuration-integrity settings. The Beacon 9 adds carrier-locking delay and enable. Non-GPON objects may be absent or irrelevant on these Beacon profiles.

The function also calls `cfg_saveKeyParameters(0)` through configuration-manager IPC. A nearby `cfgRpc_saveKeyParameters` handler logs PHGL-specific text, writes `/configs/keyparam`, includes seven ACS/SIP values, and iterates WANPPP credentials. That table does **not** by itself prove BOQA preserves those credentials: the complete caller/operator dispatch and restoration of this non-whitelisted file are not established. The [exact tables, full relevant IPC traces and static handler excerpt](resources/source-provenance.json) retain that distinction. No reset function was executed to discover live values.

## The G6's normal reset leaves more than its whitelist

Both G6 builds use `rm -rf /$dir/*`. A shell `*` does not include top-level names beginning with a dot. Therefore hidden entries in `/configs` and `/logs` can survive the ordinary cleanup even without a whitelist entry. A visible directory is still recursively deleted along with its hidden descendants. This is a statement about the exact removal command, not a new test of every hidden vendor file.

Most of `/opt` is also not part of the G6 normal reset. HJL explicitly deletes `/opt/lxc` and `/opt/lcm`; IJL deletes only `/opt/lxc`. An AdGuard Home executable under `/opt` may remain, but its startup script under `/configs` and settings under `/configs/overlay` can be lost, so “the binary survived” is not “the service still starts”. `/home` is on the persistent overlay list and must not be assumed to be another independent preserved partition.

The retained `/opt/.backup` is DataGuardian material. Its restore code checks `mount_<root>_fail`; an absent working database alone is not an unconditional request to restore an old database. Normal reset and mount-failure recovery must not be described as the same operation. The scripts contain further migration/mount-recovery paths, and custom scripts can add their own side effects.

## Deep reset and the firmware banks

G6 deep reset retains only the deep whitelist and calls `format_partition` for three mapped targets: the configuration volume named by **`cfg_partition`**, `log`, and `user_data`. It recreates their UBIFS volumes. HJL first clears directory entries as well; IJL proceeds directly to formatting. Both use the same physical-button deep-reset gesture and the same reset-scheduling script.

The loop does not iterate both `rootfs_data0` and `rootfs_data1`, nor does it erase the legacy `cfg` partition. It does not replace `rootfs0`, `rootfs1` or SSB. Data in a different, unselected configuration volume is outside this particular cleanup loop and may still be present. A reset is not a firmware downgrade or an erase of every historical configuration copy.

The Beacon 9 does not call `format_partition` in its reset branches. It stages preserved data at `/backup/.reset_backup`. Normal reset clears `/logs` and `/configs`, restores both lists, clears `/backup`, and deletes the extra blacklist. Deep reset clears `/logs`, `/configs` and `/opt`, restores only the deep list, then clears `/backup`. `clear_directory` uses `find -mindepth 1 -maxdepth 1`, so hidden entries are included. `/backup` is mounted from `cfg_1`; `/configs` from `cfg`. This differs from the G6's `/opt/.backup` and selected `cfg_partition` arrangement.

## What survives of the UART setup

For the G6, the UART `console` setting is in shared U-Boot environment, and `EXT_BOOT_PWD` is in shared EXTFS. The reset code writes the reset flag but does not erase the environment generally or target EXTFS. These two changes are expected to remain across the reset paths examined here.

The Password2 installer and token/helper files in `/configs/debug`, and the later `/configs/pre_app_boot.sh` wrapper, are removed. The RAM overlay disappears at reboot. The stock caller remains in the firmware, but the stored payload that installed the overlay is gone. Thus these tutorials provide reboot persistence, not reset persistence. The separate tested U-Boot recovery route remains useful subject to the installed kernel/bootloader behavior; this investigation did not run another recovery boot.

The same storage distinction applies to Beacon 9 scripts under `/configs`, with its own hook names. There is no demonstrated universal script-only persistence guarantee across normal reset, deep reset, every bank migration or future firmware.

## Exact preservation lists and evidence

The original policy and script text is retained in the [source/evidence record](resources/source-provenance.json), with hashes and exact paths for all three builds. The policy differences are:

- G6 IJL: 20 normal paths, 12 deep paths, one extra deletion.
- G6 HJL: 21 normal paths, 12 deep paths, two extra deletions. It adds `/configs/swdl/` preservation and `/opt/lcm` deletion.
- Beacon 9 JJM: 22 normal paths, nine deep paths, two extra deletions. Compared with G6 HJL it adds normal preservation for `stunnel`, USP vendor configuration/preconfiguration filenames, and `poe_config`, while omitting the G6 `alcatel`, `hgu_slid` and `hgu_loginid` entries. Its deep list omits G6 `bosa`, `oltInfo` and `ont_lock_key`.

All three preserve selected messages/component/kernel/PCD/reboot/fatal logs, `/configs/Nokia/` and the reset-origin marker even during deep reset. This is selective operational cleanup, not a secure erase or a claim that factory secrets, every historical database, diagnostic history or both banks have been sanitized.

For how retained operator files feed the resulting configuration, see [the provisioning pipeline](../provisioning-pipeline/README.md). For the data-volume layout, see [storage and flash](../storage-and-flash/README.md). For the access-persistence distinction, see [persistent overlays](../persistent-overlays/README.md).

## The ONT adds a related reset implementation

The XS-2426X-A button/scheduler code follows the examined G6 pattern: two
rapid clicks schedule deep reset and a hold of at least ten seconds schedules
normal reset. Its newer KJL cleanup adds `link_after_overlay` after cleanup
and before clearing the flag. This is a static ONT comparison, not a live
reset or a claim that every preservation entry, callback or post-reset login
matches the G6. Its stock sources and exact changed file are retained in the
[ONT comparison](../xs2426xa-24-03-comparison/README.md).
