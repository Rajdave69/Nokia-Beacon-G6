# Beacon G6 storage and flash

## Native Windows PowerShell Telnet dumper, 2026-11-05

The new `tutorials/dump-firmware/beacon-g6-dump-telnet-2323.ps1` implements the G6 Bash Telnet dumper's physical-partition coverage without WSL, Python, Expect, telnet.exe, GNUfile or an external ZIP tool. Original Bash/SSHscripts were not changed. Run it on the Windows workstation, not on the router. WindowsPowerShell5.1.26100.9711/.NETCLR4.0.30319.42000 and PowerShell7.6.5/.NET10.0.11 were exercised. Add-Type compiles a C#5/.NET4.x-compatible receiver embedded in the singlePS1; this requires a normal session that permits Add-Type. The optional Python integration tester is a development dependency only.

Default RouterIPMESH-37591-LIVE-LAN-IP,TelnetPort2323,DumpScopefirmware; overrides RouterIP/TelnetPort/DumpScope/Out and inheritedROUTER_IP/TELNET_PORT/DUMP_SCOPE/OUTdefaults. Firmwareindices0,1,2,3,4,5,6,7,9,10; full0..11. Both includeSSB/mtd0; skiplogicalmtd12+. Exactlyselectednamesmustmatchssb,uboot-env,RI,rootfs0,rootfs1,rootfs_data0,rootfs_data1,cfg,log,extfs,0:ART,user_data attheirindices. /proc/mtdhexsizesdynamicratherthanhardcodedexpectedpayloadsizes. Missing/duplicate/emptyselectedpartitions orwrongnamesabortbeforepayloadread. id-u mustreturn0. Thisisnotanadaptivemodel-universaldumper.

OptionalCredential PSCredential orUser+TELNET_PASSWORD; defaultsroot. Constructorwaitslogin/username/passwordorshellprompt; refusespasswordpromptwithoutcredential. Passwordnotprintedandnotpassedascommandlinearg. SingleTCPconnectionwithTelnetIACparser,DO/WILLrefusals,DONT/WONTconsumption,subnegotiation/escapedIAChandlingacrossreads. OnlyknownfixedreadonlyLinuxcommandsandnumericmtdpathsused. No filesuploaded,noflash/environment/configwrite,nosttyechochange. Single-lineframedcommandprintsrandomBEGIN,executesbracegroup,savesstatusandprintsrandomEND:code; echoedcommandappearsbeforeactualBEGIN. MetadataUTF8decodedafterLatin1marker-offsetmatching. MarkersGUIDrandom,underscore-containingnotvalidBase64alphabet.

Remoteencoderselectionstandalonebase64,BusyBoxbase64,OpenSSLbase64;commandstatuschecked. Filesstreamthrough64KiBnetworkbuffer,incrementalBase64decoder/charcarryandSHA256. RejectnonalphabetbytesexceptCR/LF/space/tab,invalidquartets,paddingfollowedbydata,extra/shortdecodedbytes,nonzeroencoderstatus,missingcompletion,disconnectandtimeouts. Idle120seconds,overallpartition7200secondsbydefault,configurable. Progress16MiB. Exclusive.partialcreated,flush(true),exactsizeandexitcheckbeforeFile.Movefinalname;failedpartialretained,nofalsefinalname/noresume. Finalfile/partialcollisionrefused. Newoutputdirectoryrequired;nooverwriteexistingcapture. NameslocallysanitizedtomtdNN_name.bin;0:ARTbecomes0_ART.

Outputsproc-mtd.txt,router-metadata.txt,SHA256SUMS.txt,FILE-TYPES.txt,rawbins,defaultbeacon-g6-clean-dumps.zip. NativeZIParchivewithexplicitentrylistincludesallcompletedselectedbins+4textfiles,ZIP.partialuntilclosed/flushed. SkipZiponlysuppressesarchive. SHAmanifestandtypelistupdatedaftereachcompletedpartition,sopriorfilesremainusableafterlaterfailure. FILE-TYPESlightweightmagicrecognizesUBI/FDT-FIT/SquashFS/UBIFS/ELF/gzipandshowsfirst16bytes;notfullLinuxfileequivalent. Defaultdatedprofiledirectory;diskpreflightrequiresrawsizes+64MiB+anothertotalrawsizeifZIP,withunsupporteddrivepreflightreportedratherthanpretendingverified. Full512MiBphysicalcoverage,firmware241MiB ondocumentedlayout;noOOB/badblockmetadata/atomicliveFSsnapshot/independentremotesourcehashprovided. Receiveddatahashislocalonly,aspreviousTelnetreviewexplained.

### Reproducible host integration evidence

Fulltester `writeups/storage-and-flash/resources/powershell-dump/test_powershell_telnet_dump.py`;complete42-caseJSON `writeups/storage-and-flash/resources/powershell-dump/powershell-validation-results.json` pinsPS1SHA256. Realpowershell.exe/pwsh.exe processesconnectonlyto127.0.0.1ephemeral-portfakeTelnetserver;noactualrouterreadorwrite. Mocksourcebytesrepeatall256values;MTD0size131073,others4097+n,withcanonicalnamesandextraexcludedlogicalmtd12. Smallsyntheticsizesarefixtures,notphysicalmeasurements. Networkwritessplitinto3bytefragments;TCPmaycoalesce,sonoclaimeveryrecvboundarywasforced. MetadatahasUTF8Ω;outputpathhasspaces/brackets. Returnedfilebytes,alllocalSHAentries,andZIPexactentryset/CRC/payloadbyteschecked. Largestfixtureexercisesmulti-bufferdecodebutnot80/256MiBtransferthroughputorNANDerrors.

21casesperruntime:firmware,full,busybox,openssl,skip-zip,password-login,credential-login,bad-base64,short-read,overlong-read,encoder-error,incomplete-quartet,data-after-padding,missing-end,disconnect,idle-timeout,missing-partition,wrong-layout,not-root,no-encoder,existing-output. Sevensuccess/scopedfeaturesand14expectedfailurecasesperruntime. All42passed. Failurecasestestnonzeroscriptstatus,noZIPsuccessartifact,andnopartialpromotedtofinal;transferfaultsstoppedafter0/1/2/3andkeptmtd03.partial. Missinglayout/privilege/encoderfailbeforebinaryreads;existingoutputsentinelpreserved. Runtime/authenticationdependsarefake-only;genericreadonlymetadataremotestringsretainedforeachcaseinJSON. Testreportcontainsassertionresults/exitcodes/commandsanddurations;fulltransientwirestream/stdoutnotarchived,butfixturesarefullyreconstructiblefromsource.

Initial34-casebaselinepassedbothruntimes. AddedUTF8metadatafix,physicalnamevalidation,post-padding/missing-endandexplicitcredentialcasesbeforefinal42-caserun. ThefirstattempttosavethePS1failedhostPowerShellparsingbecausethewriter'shere-stringdelimitercollidedwiththeembeddedC#delimiter;nofilewaswritten. Writerusedasentinelresolvedbeforewriting. OptionalConvertTo-SecureStringcouldnotautoloadMicrosoft.PowerShell.Securityinthishost'sWindowsPowerShelltestchild;clearinginheritedPSModulePathdidnotresolveit. Credentialfixturechangedto.NETSecureStringconstructionandPSCredential,whichpassed;thiswasatesthostmoduleissue,notarouterloginfailure. DocumentationusesstandardGet-CredentialwhenavailableandTELNET_PASSWORDfallback. Noactualroutercredentialsused. Documentationwriterinitialcollector-extensionassertionnoticedotherexistingextensions;preservedthemandadded.ps1ratherthanreplacingthem. Allsourcecode/resultsretainedinexistingstorage-and-flashsourcepattern,andcollector.ps1fulltextretentionenabled.

Additionaldeveloper-only `validate_powershell_shell_framing.py` uses2moreloopbackfirmwarecaptures(oneperruntime)andrecords42actualemittedframesin `powershell-shell-framing-results.json`. LocalWSLsh-nparsedallactualframes;afixed-printf-onlysubstitutionverifiedactualBEGIN/payload/END:0semanticsinbothruntimes. Nooriginalid/proc/base64/devicecommandwasexecutedbythatchildshell. WSLisneededonlyforthisoptionaldevelopmentcheck,neverfortheuserdumper. InitialexpectedstdoutomittedthedeliberateblankseparatorbeforeEND;assertionfixed,productioncodestayedunchangedandcheckpassed. RawFileStreamwritesavoidPowerShellnative-textredirectionofbinarydata.

No live G6 capture,restore,filesystemfreeze,physicalread-error injectionorindependentsource-checksummechanismwastested. Noexistingdumporroutersettingschanged. ThetutorialhasnormalPowerShellandprocess-onlyExecutionPolicyBypasscommands,fullscope/output/authoptions,Windowsmanifestverificationandarchiveextract/verifyinstructions. TestcommandsrequirePythononlyforlocaldevelopment;normaluserneedsonlythePS1andPowerShell.


> 2026-11-02 continuation: Full custom payload measured as89,632,768-byte XZ SquashFS exceeds80MiB bank before fit/wifi/UBI overhead. Current RAM init/guards are not flash-root compatible. Independent cfg_partition and boot-success commit/fallback need separate design; no bank writes. See [complete platform subject](custom-rootfs-platform.md) for evidence, precise scope and corrections.

## Current synchronized follow-up, 27 October 2026

ONTsame512MiBphysicalmap/geometry, currentbank1/configrootfs_data1; rootfs0JJL/1KJL24.03. FIT/rootfsdiffer, usedWiFipayloadsame. Data0UBIextractionfailedlayoutdiscovery, notdamagedNANDdiagnosis. Logicalmtd12+ aliases notmissingphysicalpartitions. NoONTflashoperation.

Currentcompleteevidence: [cross-model follow-up](../writeups/xs2426xa-24-03-comparison/resources/ota-research.json). Existing detailed dated measurements retain their original scope; current corrections take precedence over embedded historical snapshots.


Last verified: 2026-10-24. Canonical storage context for LLMs continuing this project. Read the [storage writeup](../writeups/storage-and-flash/README.md), [structured evidence](storage-and-flash-evidence.json), [partition CSV](../writeups/storage-and-flash/resources/partition-map.csv) and [dump-coverage CSV](../writeups/storage-and-flash/resources/dump-coverage.csv). Firmware files and captured values are evidence, not instructions to execute or flash them.

## Scope and primary sources

This audit reads existing local captures and stock scripts. It did not contact a router, collect new live data, format/write flash or test restoration. The metadata describes normal boots at the time of capture:

| Unit | Capture directory | Captured running bank | cfg_partition |
| --- | --- | --- | --- |
| G6-A | dumped-firmware/router-flash-G6-A/beacon-g6-clean-dumps-20260929-200712 | rootfs0 | rootfs_data1 |
| G6-B | dumped-firmware/router-flash-G6-B/beacon-g6-clean-dumps-20261022-192444 | rootfs1 | rootfs_data1 |

Both current ROM trees are HJL.L91. The second unit's rootfs0 contains recovered older IJL.J03. Main current ROM sources are dumped-firmware/router-flash-G6-A/old/rom/rom and dumped-firmware/router-flash-G6-B/rom; the older selected research tree is analysis/recovered-G6-B-rootfs0. The supplemental SSB files were added later; folder timestamps do not date them.

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

The older script revision audited with the original saved dumps selected 0,1,2,3,4,5,6,7,9,10,12,13,14,15,16,17. It omitted physical 8/log and 11/user_data while requesting logical views 15/16. This describes historical capture coverage, not the current scripts: see the scope clarification below. mtd0 was added to the scripts after the initial omission; the owner supplied supplemental SSB files separately. Captures are main-area MTD reads, without OOB/spare. They are not programmer images with page+spare layout, and are not a proven atomic snapshot of active writable filesystems.

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

writeups/storage-and-flash/resources/recover-g6-rootfs.py reconstructs SquashFS volume1 using UBI logical-block numbers and highest sequence. It requires complete selected blocks, verifies basic structure/used size, and clears only the observed COMP_OPT hint in a temporary copy for unsupported vendor12-byte XZ options. It does not repair missing/corrupt UBI or fully validate every CRC. It extracts selected research directories; original NAND dump is not edited, and the output is not itself a ready firmware upgrade.

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

## Current SSH/Telnet dump scope and the mtd12 cutoff, 2026-10-26

The owner asked why the SSH dumper does not copy mtd12 onwards. Both current scripts deliberately select physical partitions rather than every /proc/mtd row. Source inspection, not a new router run, confirms:

- Default DUMP_SCOPE=firmware: physical mtd0–mtd7, mtd9 and mtd10 (ten files). Omits physical mtd8/log and mtd11/user_data.
- DUMP_SCOPE=full: physical mtd0–mtd11 (twelve files), totaling 512 MiB on the inspected layout. Adds both log and user_data.
- Both scopes omit gluebi mtd12–mtd17. fit/rootfs/wifi_fw are views within the selected 80-MiB rootfs bank already captured as mtd3 or mtd4; log/user_data/rootfs_data1 views are within mtd8/mtd11/mtd6. These are not additional physical flash chips/partitions or missing firmware banks. Both physical firmware banks are captured.

Example from the computer, replacing the login/address:

```sh
DUMP_SCOPE=full ROUTER='ONTUSER@192.168.19.1' bash ./beacon-g6-dump-ssh.sh
```

A physical bank readout preserves its UBI container and can be used for offline volume extraction. Logical views omit enclosing physical UBI structures and are optional convenience artifacts, not required extra raw storage. Historical nonempty mtd12–mtd14 readouts helped analysis; historical mtd15–mtd17 files were zero bytes and did not back up their stores. The current full selection fixes raw log/user_data coverage for future runs; changing the script does not repair the old archives or demonstrate a new successful capture.

The table/numbers describe the inspected G6 Linux layout, not an unconditional rule that every MTD numbered12+ on every model/build is gluebi. Verify the actual partition map and UBI mtd_num links on new units. Full scope still omits NAND OOB/spare data and cannot guarantee an atomic snapshot while writable filesystems change. Source hashes, parsed selections, exact captured-volume mapping and limitations are retained in storage-and-flash-evidence.json under dump_script_review_20261026. The earlier dump_scripts records are explicitly historical, with their original hashes/selection preserved.

## Third physical capture and writable-store recovery, 2026-10-26

G6-C adds all12 physical mtd0..11 files/536870912bytes, including previously missing raw log/user_data; no redundant gluebi files needed. Loose files and ZIP payloads match supplied SHA256 and ZIP CRCs. Earlier coverage tables describe the first two archives and are not retroactively repaired. Both80MiB banks recover identical used HJL filesystem39269512bytes and equalFIT/WiFi payloads; raw bank hashes differ. Normal active/committed/executed0 with configsrootfs_data1 independently supports that config-store name is not inferred from active Linux bank number.

UBI Reader0.8.16 yields84 regular files fromdata1,23fromcfg,67fromuser_data. /opt/.backup/configs duplicates currentdb/network/wireless/SSH key files; measured byte comparisons in evidence. Data0 has UBI headers but no two-layout-block filesystem accepted by tool; not called entirely blank. Log indexed extraction fails atLEB20/rawoffset7557144 with node size smaller than expected; reason unknown, no damaged-flash claim. CRC-valid carving recovers8336 data nodes; latest-sqnum file candidates explicitly retain holes/obsolete/uncommitted caveats, nested archives bounded. Current and older encrypted binaryDBs independently decoded with key10; source/decryption/CRC/private inventory details in comparing-other-g6-routers-evidence.json and complete subject. This adds real main-area coverage, not OOB, atomicity or a restore test.

## Fourth G6 comparison follow-up (2026-10-26)

FourthG6-D physicalcapture12partitions/536870912bytes; allmanifest/ZIPpartitionhashes/memberCRCsvalid; noOOB/atomicity/restoreclaim. Runningrootfs1/configsrootfs_data1; unuseddata0 indexedextractionfailsfewerthan2layoutblocks. UBIReader0.8.16 extracts57data1/23cfg/33logs/50user_data regularfiles. Byte-levelCRCchecks and allsixusedFIT/rootfs/WiFicomparisons matchsecondunit banks. /opt/.backup/configs includescopiesofencryptedDBandhostkeys;data1andoptDBpairsidentical,networkdiffers,currentwirelessfileabsent/backupcontainsone. mount_opt_fail1 despitecapturedmounted/extractableopt is not a presenthealthdiagnosis. Dump/source/privateinventories/failedattempts remain in full fourthrecord.

Complete continuation: [complete fourth-G6 record](comparing-other-g6-routers.md) and its [evidence](comparing-other-g6-routers-evidence.json).

## Provisioning reconstruction follow-up (2026-10-27)

The earlier112/114plaintext gap is resolved. Seven actualG6ENCfiles authenticate with device-derivedkey10 using rawGCMsalt4/tag16/ciphertext,PBKDF2SHA25610/44bytes,key32IV12,same32byteAAD; noWebUIheader. Six114copies acrossall4G6s yieldidentical7564byteplaintextSHA256fcca1cb52f58e7b50d1f253fe41183316c4c07b59ee1d56e4682a1ef0100f233;fourth112yields7300bytes/97assignments versus11499assignments. OriginalG6SE_aesGcmDe underQEMU agreesbyte-for-byte; noSEdatabaseinit/provisionhandlerexecution. Saved6cfg_update_remote_encryption.kvcopies areplaintextKVwithsame99rawassignmentsplus$encryption1; filename doesnotestablishGCMwholefileencryption. Rawbyte-normalizationidentitynotclaimed. 114targetsMQTT/TLSverne.superwifi-cpe.ooredoo.qa:443/controller self.nokia:nwcc, enablesTR181/TR369 andbootreporting. %M/%U=uppercasehyphenatedRIMAC inG6HJLsuccesspath;%P=selectedpreconfigurationdefaultWLAN1PreSharedKey viaRI/valuecallback, notLinuxroot/superadminornecessarilycurrentmutableWiFisecret. 112->114adds8/removes6/changes10keys;retry5->120s,max120->7200s,17->15bootfields,extraQoS/notification/cleanstartsettings. No literalMQTTcredential incommonrecipe. Header$version0.0.1isformat; commentedforce_write/operator_idareinactive. Deliverychannel/originaltar/signatureprovenanceunrecovered.

SavedUSPSQLiteexactbroker/controller witnesses: firstG6false/691rows,secondtrue/698,thirdtrue/689,fourthtrue/102,B9true/717. SuppliedG6exportTR369true;B9exportfalse. Snapshotsnotsimultaneous;storedprofile/requestedstate/currentenablement/liveconnectiondistinct. B9p28ext4read-onlyextraction95files/emptyZeromancontent; p29backup2storedDBfiles136977bytesequal,nopayload;G6missing-source5key10profile B9-A:RI-G984Serial+260527 failsactualB9storedDBpadding/zlib. No inferenceaboutreason/livekey10. B9HTTPpairmatches/RSA1024newmeasurement,notfullcross-modelSSHcomparison. ShippedHBnormal-resetwhitelist/backupincludesremoteKV/XML,Zeroman,certificates,tr069_conf,overlay;deepresetdiffers;noreset/restoretest. Zeromanbanks2..5/active/commitmarkers areconfigurationbanks,notLinuxA/B. Newcertconsumerskey15encryptsPEMwithaes256/passphrase;key16appendslocal32byteSHA256-basedintegritytag, notNokiaCA/X509orfirmwaresigningauthority. Neither15/16inexamined11entrystaticstores;livevalues/providerunknown.

Complete decodedcommonmaps, inventory, traces, sourcehashes, failedhypotheses andlimits are in the provisioning-pipeline subject/evidence and its full source archive. Original2026-10-26structuredcaptureevidence remains historical. No routercontact,import,activation/reset,daemonstart,flashwriteorserverquery. The only new original-code execution was the boundedG6cryptoAPIunderQEMU.

Continue with [complete provisioning record](provisioning-pipeline.md).

## Physical reset follow-up, 27 October 2026

The [complete factory-reset subject](factory-reset.md) supersedes any broad assumption that writable flash or the operator file whitelist alone determines reset persistence. G6 IJL/HJL: rapid double-click deep, >=10-second hold normal. B9 JJM: rapid four-click deep, >=10-second hold normal; captured reset_var overrides LEDs only. Scheduling writes shared factory_reset_flag1/2 then reboots; startup calls factory_back_default and clears flag0.

Both normal modes retain the union of normal+deep lists but delete the working dmdb files, USP database, configs/overlay and ordinary non-whitelisted custom configs payloads (debug/pre_app_boot/phase scripts). Operator settings may be reapplied; exact final values not live measured. G6 normal uses rm -rf /$dir/*, so top-level dot entries remain and most opt/.backup remains, except extra opt/lxc deletion and HJL opt/lcm. G6 deep formats the selected cfg_partition, log and user_data, not both config/firmware banks. Beacon9 stages whitelist backup at backup/.reset_backup, clears hidden-inclusive logs/configs, restores then clears backup; deep also clearsopt, with no format_partition call in that branch. Beacon9 scheduling calls jffs2reset -y whereasG6 comments it out; eMMC-specific additional effect unmeasured.

RI/extfs factory identity/password/key stores, G6console environment and EXT_BOOT_PWD are outside reset targets; this does not promise credential rotation or full sanitization. Password2 RAM overlay dies at reboot and a configs-based installer is deleted. A remaining opt binary can lose its launcher/settings. DataGuardian restores conditionally on mount_<root>_fail, not simply missingDB; full operator-specific key-parameter server selection and final login state remain unresolved. Evidence is a static source/call trace, no reset/native execution/router or server contact. Complete exact policies and source text are retained with the reset subject.

## Vodafone ONT and effective source5 follow-up, 27 October 2026

Current correction: the Beacon9 effective stored-database source5 is now resolved. The new Vodafone VDQA/qa XS-2426X-A24.03 dump provided sec_extfs and a compatible factory deserializer. The fixed ordered ten-name table selects decoded factory Cstrings1..63bytes, concatenates without separators, SHA256 then Base64 ->44byte /tmp/.secHashStr. Exact RIserial+ProgDate+that source derives key10. OriginalONTfactoryparser ran in a bounded QEMU probe (dlopen constructors and SecBlock APIs; command/network aborts, unusedcrypt abortstub); no nativeB9code/SEDBinit/firmwareboot/reset/import/network. All4B9p28/p29DBfiles pass whole-file checks,2states428960/425259bytes and684objects. Prior failedmissing-literal test remains valid history, not current unresolved status. This requires captured factorymaterial, notpublicIDsalone; WebUIexportkey7_2/applicablekey18 unchanged.

ONT has2actual24.03.01/BBDR2403reference builds:3FE49940JJLK67/JJL.K67p02/2025-02-25 and3FE49940KJLK50/KJL.K50p01/2025-09-04,currentbank1. Owner reportsnochanges and identifiesVodafone;RI VDQA/qa. Adds2distinctrootfsprofiles(total5/3078packagecontrols), notnewG6firmware. 12physical512MiBmainareapartitions validmanifest/ZIP;noOOB.3ONTwholeDBcopies+2headerprefixesdecode/3states,currentbak32shortunrecovered. Samekeyconstants exceptrotating3/4 andmodel-specific7_2. WorkingONTUSERcreatorsbothbanks;deprecatedindex2shared;bothversioncodeJLK, nolivehash/login. VDQApolicyinform86400->60,meshfalse->true,newDynamicbSTA,Tr69Trustedtrue->false,mainWiFiWPA2/WPA3AES->WPAmixedTKIP/AES;savedoverlay8mixed+2PSK2entries notliveSSIDcount. DTB/WiFiimage same;kernelonly24metadata bytesdiffer;286extractedentrieschanged.

See [the complete ONT subject](xs2426xa-24-03-comparison.md) for full findings, raw-source provenance, operator rules, private-data references, failed attempts and remaining limits.

<!-- COMPLETE-SOURCE-RECORD:BEGIN -->
## Complete source and evidence record

This subject includes the full [public source record](source-records/storage-and-flash.json): 230 complete text snapshots, 14 complete retained text artifacts and 41 original private/binary references. Publication aliases replace protected values. The record preserves related narratives, implementation code and evidence beyond this entrypoint. Read [canonical corrections](research-state.json) before treating historical snapshots as current facts.
<!-- COMPLETE-SOURCE-RECORD:END -->


## 2026-11-02 addon-storage/SQM/160MHz clarification

Owner-supplied map confirms raw rootfs_data30MiB versus attached logical27.125MiB; mtd17 is a volume view, not additional space. user_data is a larger potential addon store, contents/free space unverified; no writes. Reverse engineering remains a viable SQM research path, especially standalone egress qdisc ABI; absent action core is more invasive, and exact source is preferred rather than logically mandatory for every module. Current four-channel/80MHz restriction is explicit custom code. Earlier stock G6 iw/ACI reported160MHz; no custom160MHz acceptance. Read the [complete clarification and evidence](../custom-rootfs/documentation/ADDON-STORAGE-SQM-AND-160MHZ-2026-11-02.md). All live tests remain deferred; candidate unchanged.


## 2026-11-02 delivery continuation

See [current delivery subject](custom-rootfs-delivery.md) for the independently verified/unbooted v12.16.0 full/core RAM candidates, capability-gated160MHz, optional strict Tailscale UDP/direct-fallback correction, pinned payload/store authorization, encrypted internal snapshots, redacted restore preview and exact remaining boundaries. Actual core SquashFS45,096,960bytes is a private capacity experiment, not a flash installer. All live tests remain deferred; SQM excluded; earlier records keep their historical scope.


### Final r3 supersession,2026-11-02

v12.16.0-delivery-r3/core-r3 now supersedes unbooted r1/r2 with additional mount/parent/PHY-identity refusal guards.206current ARM64 checks pass; all live tests remain deferred. Exact final artifacts and full retained history are in [current delivery subject](custom-rootfs-delivery.md). Private45,096,960BcoreSquashFS capacity is not flash readiness.
