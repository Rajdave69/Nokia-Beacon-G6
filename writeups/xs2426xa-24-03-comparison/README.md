# What the Vodafone XS-2426X-A adds to the firmware investigation

This dump gives us two actual **BBD R24.03** images, a different operator, and a useful answer to the extra-key-source question left open by the Beacon 9. The XS-2426X-A uses much of the same Nokia/Cortina software, but its provisioned operator is **Vodafone `VDQA`**, not the Ooredoo `BOQA` of our Beacon captures.

The owner reports **nothing was changed** before dumping and separately identified it as a Vodafone ONT. RI agrees on `OperatorID=VDQA` and `CountryID=qa`. That is provenance from the owner and saved factory data, not a claim that the unit has never been provisioned, updated or reset.

The work below was completed on **27 October 2026** using the supplied flash files. No router or server was contacted, and no reset, account-creation routine, firmware boot or upgrade was run. A bounded QEMU probe did execute the original factory-value deserializer against private copies of the saved SECURITY records; that execution is described explicitly below.

## The two installed builds on ONT-A

|                   | Bank 0              | Bank 1, running in the capture |
|-------------------|---------------------|--------------------------------|
| Image version     | `3FE49940JJLK67`    | `3FE49940KJLK50`               |
| Software version  | `JJL.K67p02`        | `KJL.K50p01`                   |
| Build date        | 25 February 2025    | 4 September 2025               |
| Dot-digit version | `1.2403.567`        | `1.2403.650`                   |
| Repository        | `BBDR2403OpenWrtBA` | `BBDR2403OpenWrtBA`            |
| HomeOS            | `24.03.01`          | `24.03.01`                     |
| Packaged controls | 597                 | 597                            |

Both images identify `ca82xx/xs2426xa`, OpenWrt `19.07.3 r11063-85e04e9f46`, AArch64 Cortex-A53 userspace and Cortina SDK `cortina_venus.R1.1.1.6`. Their metadata declares `SIGN=y` and `ENCRYPT=n`. Those are the image's declarations; this investigation did not validate a complete upgrade package or its vendor signature.

This is also a useful reminder about the release labels. An R24.03 maintenance image can have a 2025 build date, while our G6 R24.04 image was built in December 2024. The release branch and the date an individual product was rebuilt are different facts. These two ONT images do not establish a newly recovered G6 build.

The extracted FIT selects `conf@xs2426xa.dtb`. Its device tree describes a **Cortina Access Venus REF Board**, compatible with `cortina,venus` and `cortina,ca8289`. The reference-board name is firmware metadata, not a new inspection of the PCB or silicon marking.

## A second ONT preserved an earlier R24.03 build

The November 2026 dump from `ONT-B` adds **JJL.K24p02** (image `3FE49940JJLK24`, built 15 November 2024) in bank 0. Its saved boot arguments and both U-Boot environment records select bank 1. That bank matches the existing KJL.K50p01 across the used kernel container, root filesystem and Wi-Fi payload. The whole SSB bootloader partition also matches ONT-A. Both devices have `OperatorID=VDQA`. ONT-B records `CountryID=eu` and ONT-A records `qa`.

The three builds share the same kernel package ID and device tree. Their decompressed kernel hashes differ. The clearest K24-to-K67 changes are in Wi-Fi. EasyMesh goes from 1.15.25a to 1.15.25d, local radio resource management goes from 2.0.30i to 2.0.30u, and the separate Wi-Fi filesystem gains two `qcn9000/bdwlan.*_qa` board-data files. All 38 regular files already in K24's Wi-Fi filesystem match K67. Both units carry the later Wi-Fi payload in their active bank. Runtime board-data selection remains untested.

The `sec_extfs` helper, its startup script, the phase dispatcher binary and the Password2 public key are byte-identical across all three builds. This dates the helper and dispatcher to at least November 2024 on the ONT. The stock security table changes only `key3` and `key4` from K24 to either later build. `cfgmgr` differs across all three despite reporting package version 1.2.0. The comparison used saved stock files. Runtime account creation remains untested on K24.

The new archive contains ten physical partition files. Their manifest hashes and archive copies match. The log and user-data partitions appear in its partition map but are absent from the archive. [Bank hashes, package changes and comparison results](resources/ont-b-k24-comparison.json).

## The flash layout really is close to the G6

All twelve physical main-area files are present, totaling **512 MiB**. Their SHA256SUMS entries match. The archive passes CRC checks and contains matching copies of all twelve partitions. The dump has 256 KiB eraseblocks, 4096-byte NAND pages and a reported 256-byte OOB size; the supplied files are main-area captures, not OOB dumps.

The layout is the familiar SSB, U-Boot environment, RI, two 80 MiB firmware banks, two 30 MiB configuration volumes, legacy `cfg`, logs, EXTFS, ART and 256 MiB user data. The higher-numbered MTD entries are UBI children of those physical regions. They are not additional flash missing from the dump.

The captured kernel command line boots `rootfs1`. Both redundant environment records have valid CRCs and report `active_part=1`, `cfg_partition=rootfs_data1`, and `sb_flag=114` (`0x72`). The generic `img_active`, `img_commit` and `img_executed` fields still say zero, illustrating why they cannot simply replace the platform's bank-selection evidence. `console` is absent and the captured command line has `serial_is_dis=1`.

The saved `mount_opt_fail=1` is an observation of a flag, not proof that the current flash is defective. Writable extraction recovered 88 files from `rootfs_data1`, 35 from legacy `cfg`, 33 from logs and four from user data. UBI Reader could not recover `rootfs_data0` through its layout-block path. That failure is retained without labelling the volume damaged or inventing a missing tree.

The whole SSB differs from the known G6 bootloader groups. Its saved `EXT_BOOT_PWD` also differs from all five previously retained pre-override verifier fields: four G6s and the Beacon 9. The first G6 comparison uses the pinned original verifier, not the owner's later password change. The ONT's bootloader authentication implementation itself has not been newly traced or boot-tested here.

## The two 24.03 builds changed more in userspace and policy than in the kernel

The complete extracted-tree comparison found **13 added entries, 14 removed, 286 changed and 4,941 unchanged**. These counts include regular files and symlinks in the selected research trees. They are not counts of vulnerabilities or source commits.

Package inventories add `libsmi` and remove the separately packaged `uspCfgUpdate`; the USP daemons remain present. Twenty-four common packages change version strings, including the Qualcomm Wi-Fi components, EasyMesh `1.15.25d` to `1.15.25dh`, local RRM `2.0.30u` to `2.0.30uo`, and USSA `4.3.33` to `4.3.45`. Fifty other common control files differ while retaining the same version string. In total, 76 package names have changed control metadata or membership.

The separate Wi-Fi firmware SquashFS and the embedded device tree are byte-identical across the two banks. The compressed kernels have different hashes, but decompression narrows the difference to just **24 bytes**: two build-host strings and the 20-byte GNU build ID. After replacing only those metadata bytes in a comparison copy, the remaining kernel bytes match exactly. Both kernels report `4.14.275`; the fixed 2020 date in their banner is not the build date of these 2025 root filesystems.

The security-engine library, `libcfg.so`, Zeroman library, startup phase dispatcher, Password2 public key, and the examined SNTP and USB CGIs are unchanged between these two ONT builds. `cfgmgr`, `libdbgen.so`, the preconfiguration file, schema and reset script do change. In particular, the SNTP CGI is byte-identical to the recovered G6 IJL copy. That is a concrete comparison lead, not a new claim that an endpoint is reachable or a vulnerability has been validated on this ONT.

## Vodafone's policy changed between the banks

Each decoded global preconfiguration contains **156 top-level sections and 180 literal aliases**. The old file contains 23,832 `dburi` rows; the new one contains 23,860. These include object references and relative paths, not just unique independent settings.

The files are packaged containers rather than readable XML: a 20-byte big-endian header with magic `0x123124`, followed by an encrypted/compressed payload. Each own-build `key3`, the existing CBC format and ten KDF rounds decode them successfully. Payload CRC and decompressed length pass. One final NUL byte is removed only for XML parsing; the original decrypted bytes remain unchanged and private.

The VDQA account rules remain consistent across the two images. The normal account uses `genpwd_longpasswd` with `%10p`; WebAccount is enabled with username `AdminGPON` and `genpwd_sha256_customized` with `%16p`. WLAN password rules use `genpwd_longpasswd` and `%10p`. These are selected callback rules, not proof that the current live password is the callback's generic output: factory-preservation and rule conditions still matter.

The policy changes include:

| VDQA rule | JJL.K67p02 | KJL.K50p01 |
| --- | --- | --- |
| TR-069 periodic inform interval | 86,400 seconds | 60 seconds |
| `EnableMesh` | false | true |
| `DynamicbSTA` | No explicit assignment | true |
| WAN PPP `Tr69Trusted` | true | false |
| Main WLAN `BeaconType` | `11iandWPA3` | `WPAand11i` |
| Main WLAN `WPAEncryptionModes` | `AESEncryption` | `TKIPandAESEncryption` |

There are also added DHCPv6 prefix-delegation rules and changes to the Wi-Fi channel restrictions. The schema adds exactly one named parameter, `InternetGatewayDevice.X_ALU-COM_Wifi.DynamicbSTA`: 5,414 schema rows become 5,415, with no other name/flag delta in this inventory.

The saved wireless overlay independently contains eight `mixed-psk+tkip+ccmp` entries and two `psk2+ccmp` entries. These are saved configuration sections, not a measurement of ten enabled or broadcasting networks. The packaged policy can describe multiple WLANs and conditions, and the current router was not queried.

No `ENC_CFG`/`ENC_PRE` package, saved remote XML/KV payload or `usp.db` was recovered in the selected writable trees. Zeroman's version file and directory scaffolding exist, and the USP software is packaged. Capability, saved state and a live controller connection remain separate observations. The saved logs mention the Nokia update hostname four times, but no OTA request or download was performed in this task.

## ONTUSER still has a working creator in both builds

The ROM account templates contain root, daemon, ftp, network, nobody, mosquitto, lldp, appService and superadmin. Root and superadmin have SHA-256-crypt templates; those templates match the corresponding G6 HJL templates. ONTUSER is added by runtime account initialization, rather than appearing in that ROM passwd file.

Both ONT `cfgmgr` images retain a substantial creator: `0x84614..0x84860` in JJL and `0x849ec..0x84c38` in KJL. They generate the debug password, recreate ONTUSER, then test the debug-override argument. The boot caller reads the service-management object and passes the flag, or false on lookup failure. This has the G6 behavior, rather than the Beacon 9 JJM updater's no-op.

The library's deprecated index-2 selector resolves to the same 32-byte key used by the G6 ONTUSER calculation. `dmUtl_GenDebugUserMutativeStaticPass` and `dmUtl_GetReleaseVersionFromBuildinfo` remain at `libdm_utility.so:0x8008` and `0x7e5c` in both ONT builds. The relevant `3FE` substring is `IMAGEVERSION[9:12]`, which is **`JLK` for both full version strings**. Consequently this particular version-based calculation has the same inputs across the two ONT builds even though their full build names differ. No generated plaintext is published here and no live shadow comparison was supplied.

The saved overlay contains an ONTUSER home history file, providing additional evidence that the account has been used. It is not a live passwd or login measurement. `DebugRnPassEnable` remains in the schema and NBNX is the only global operator section explicitly setting it true. As on the G6, that flag selects an attempted factory-hash override after creation. The ONT factory record has no `EXT_DBG_PWD`.

## What the factory credentials actually show

The SECURITY object has ten fields and no `EXT_KEY_FW`. It contains boot, ordinary WebUI and management verifiers, four auxiliary variables, and the two WLAN password fields. The native factory parser decodes the WLAN values to ten bytes and each auxiliary variable to twenty bytes. Their names do not by themselves make those twenty-byte strings complete MD5 or SHA-256 digests.

The ordinary WebUI verifier matches this unit's own RI LabelCode. Both decoded WLAN passwords also equal that LabelCode. The management verifier does **not** match LabelCode. These relationships were checked privately; raw passwords and hashes are not reproduced. They do not establish a universal password for Vodafone devices.

The packaged Password2 ECC public key is byte-identical across the ONT's two banks, both recovered G6 builds and Beacon 9. That identifies the same verification key, not a recovered signing private key or one universal Password2 response.

The HTTP private/public pair recovered from writable storage matches and uses a 1024-bit RSA key. Dropbear host-key files are also present in the overlay. None of these service keys is the factory boot verifier, configuration key7_2, firmware key18 or vendor firmware-signing authority.

## The important extra source: sec_extfs explains key10

Both ONT images have eleven integrity-checked static key-store entries. `key0`, `key1`, `key2`, `key7`, `key12`, `key13`, `key14` and `key17` match the previously examined Beacon values. `key3` and `key4` change between the ONT builds. The ONT's `key7_2` is shared across its own banks but differs from the G6 and Beacon 9. That is an observed model/build comparison, not a formula deriving key7_2 from the model name.

The startup script here is byte-identical to the Beacon 9's `/etc/init.d/secInit`. Unlike the examined G6 package set, it can actually run:

```sh
sec_extfs -t all -o /tmp/.secHashStr
```

`sec_extfs:genSecHashFile`, at `0x402010`, obtains decoded values through `SecGetData` in this exact order:

```text
EXT_WEB_PWD
EXT_WEB_MGNT_PWD
EXT_SSID1_PWD
EXT_SSID5_PWD
EXT_SSID9_PWD
EXT_ACS_PWD
EXT_MD5_VAR
EXT_SHA256_VAR
EXT_SHA256CUS_VAR
EXT_RANDOM_VAR
```

Missing entries, empty strings and strings longer than 63 bytes are skipped. Accepted C-string bytes are concatenated **without separators**, hashed with SHA-256, then encoded with ordinary Base64. The resulting source5 is 44 bytes with no final newline.

```text
source5 = Base64(SHA256(accepted decoded field bytes, in order))
D(password, salt) = Base64(PBKDF2-HMAC-SHA256(password, salt, 100, 64 raw bytes))[:64]
key10 = D(exact RI G984Serial + exact RI ProgDate + source5, "key10")
```

Eight ONT fields qualify. The factory WEB hashes are 63 bytes, two WLAN values are ten bytes, and the four auxiliary variables are twenty bytes. The raw flag-1 Base64 strings in EXTFS are not substituted for the deserialized values.

This explains the failed first attempt: using the G6's `invalid_key_src5_str` fallback was wrong on a unit where sec_extfs successfully creates the file. The manufacturer secrets in the factory record are additional inputs beyond public serial and programming date. `EXT_BOOT_PWD`, `EXT_OPID`, `EXT_DBG_PWD` and `EXT_KEY_FW` are not in this particular hash list.

A small QEMU probe loaded the original ONT library and invoked only its factory parser, with command/network calls blocked and the unused crypt import replaced by an aborting stub. It did not initialize the security database, run `sec_extfs` as a program, or create a router account. The Python source5 reconstruction then decoded actual saved databases:

| ONT saved file(s) | Result |
| --- | --- |
| Current main database | Full-file checks pass; 368,473 decoded bytes, 662 objects |
| Two legacy `cfg` copies | Full-file checks pass; same 326,437-byte state, 634 objects |
| Two `/opt/.backup` copies | Each has 64 trailing bytes; the exact declared prefix validates and decodes to a third 367,246-byte state, 662 objects |
| Current `.bak` | 32 bytes shorter than its own declared length; remains unrecovered |

The supplied originals were not patched, trimmed or repaired. Prefix recovery is reported separately from full-file validation and is not a live import-acceptance test. Checks include CRC, CBC padding, zlib end/checksum/length and database bounds; this format has no newly verified MAC or AEAD authentication.

## The Beacon 9 stored-database blocker is now resolved too

Using its **own** factory record and RI inputs, the same mechanism decodes all four saved Beacon 9 database copies: p28 main/bak and p29 backup main/bak. They yield two states, 428,960 and 425,259 bytes, each with 684 objects. The Beacon 9's exact field-table order was independently recovered through its sectionless ELF's dynamic relocations. No native Beacon 9 executable was run.

This supersedes the earlier unresolved source5 result. It does not supersede the earlier failed missing-source5 test: that test was correctly rejected, and now has an explanation. It also does not make public identifiers alone sufficient or change the WebUI-export key18 requirements. Stored databases, packaged preconfiguration, local Zeroman files and WebUI exports remain separate formats and consumers. See the [Beacon 9 source5 follow-up](../../../Nokia-Beacon-9/writeups/sec-extfs-source5/README.md).

## Startup and reset boundaries remain familiar

Both ONT builds ship `/configs/debug/replace_with_test.sh` and `/configs/pre_app_boot.sh` callers, plus the same `post_script.sh` phase dispatcher found in G6 HJL and Beacon 9. The saved configuration trees contain none of those optional payload scripts. A caller's presence is not evidence of an installed custom service.

The button and reset scheduling scripts match the G6 pattern: ten-second hold requests normal reset, rapid double-click requests deep reset. In the newer ONT `backdefault.sh`, one concrete change is an added `link_after_overlay` call after the cleanup branch and before reset-flag clearing. It is source evidence of changed overlay handling, not a tested reset-persistence guarantee.

The exact reset policies, source scripts, package/schema inventories, file deltas and static account/hash traces are retained in [the evidence directory](resources/). The [methods record](resources/methods.md) includes command scope, failed attempts, ABI dependency workaround, length-boundary handling and the distinction between static traces, bounded native parsing and real router behavior. Private factory values, derived keys, database plaintexts and raw firmware stay under `config-private` or the supplied dump directory.

## Checking the ONT cloud updater

I traced the Vodafone XS-2426X-A's own `swmgnt` and `libnal` code, then read
its saved scalar settings with the stock `libdmdb` parser under QEMU. The model
is `XS-2426X-A`, not a Beacon model string. Empty OperatorUniqueID selects the
factory `VDQA` fallback. The high-priority WLAN-region setting selects `qa`.
Its saved cloud-OTA enable flag is false; the workstation query does not alter it.

The saved API-key field is a 76-byte individually wrapped string. The queries
used the ONT's own 41-byte packaged GENERIC default, which matches the earlier
G6/Beacon 9 key. That is an explicit profile-source limitation: the saved wrapped
value was not independently decrypted and equated with the packaged default.
Serial and LAN MAC came from the saved getters and agree with redundant RI.

After separate explicit approvals, I made these two normal metadata requests:

| Reported ONT image | HTTP / responseCode | Next version | File URL / checksum |
| --- | --- | --- | --- |
| Captured current `3FE49940KJLK50` | 200 / 200 | null | absent |
| Actual inactive `3FE49940JJLK67`, request override only | 200 / 200 | null | absent |

Neither reply offered a file, so no ONT download was possible. The result does
not identify the latest firmware globally or exclude Vodafone delivery through
ACS, OMCI or another operator channel. No router, updater daemon, status PUT,
bank switch, install or reboot was involved. The cumulative device availability
count is now 104 POSTs; the one earlier G6 firmware CDN GET remains the only
firmware download. Public documentation metadata requests are counted separately.

[Complete request and execution evidence](resources/ota-research.json).

## Why the older image can also have no offer

The inactive image is genuinely older: JJL.K67p02 was built on 25 February
2025, while KJL.K50p01 was built on 4 September 2025. That does not by itself
establish an upgrade assignment at this endpoint. In the earlier G6 experiment,
the same older IJL.J03 request context received HJL.L91 with BOQA and no offer
with ALCL; the identity, key, model and country stayed fixed. The client format
is therefore not enough to treat the endpoint as a global version catalogue.

The request used the packaged API-key default. Its effective live equality
was unresolved at this stage; the later v2 owner result below confirms it. Reproducing our saved constructed profile is
an offline consistency check, not native-request equivalence. HTTP 200 and
“Request processed successfully” do not establish a matching OTA assignment.
The saved enable=false flag is not transmitted in this request, so it is not
a direct explanation for the external server reply.

The measured result remains no offer for the tested VDQA profile. The first
useful next check is the effective stock credential/request profile, before
concluding either that the request is correct or that no newer firmware exists.
No new network query was made for this review. Twenty-eight additional bounded
local static-key/CBC hypotheses failed padding and recovered no credential.

[Control cases and exact interpretation limits](resources/ota-offer-interpretation-review.json).

## Saved OTA credential: field-specific decoding review, 28 October 2026

The outer stored database was decoded; that did not decrypt every sensitive
parameter inside it. The earlier `dm_node_get_value` probe read the stored raw
API value without the configuration database's field-decryption callback. A
new bounded native metadata probe finds `ealgo=sab` and `ckn=key7` on
`InternetGatewayDevice.X_ALU-COM_Wifi.X_ALU-COM_SwMgnt.X_ALU-COM_Client_Auth_Key`.
The selected name is `key7`, separate from export `key7_2` and whole-file `key10`.

The current ONT `libcfgdb.so` route reads `ckn`, resolves its key through
`SE_getKeyByName`, then calls `SE_encStr2StrEx`. Runtime/working key lookup
precedes the packaged fallback. The matching packaged container decodes and
passes its integrity check, but its `key7` does not decrypt this actual field:
independent 10/100-round attempts fail PKCS7 padding; the stock function also
returns 711 without plaintext. This is an observed failure, not proof that
the effective key is absent, random, hardware-protected or impossible to recover.

The probe was checked using a fixed harmless 41-byte test string. Stock
encryption/decryption round-trips it, and an independent PBKDF2-HMAC-SHA256
10-round/AES-256-CBC decoder agrees after including the terminal NUL encrypted
by the string routine. Boolean-only interposition confirms 64 passphrase bytes,
8 salt bytes, 48 derived bytes and matching cipher key/IV inputs. The first
positive-control comparison omitted that NUL; its apparent mismatch is
superseded. It does not change the real-field padding failures. Eight explicit
identity-derived key7 hypotheses also failed; these are guesses, not recovered
key7 derivation rules.

The metadata helper ignores the string-conversion return. The older raw-parser
`to_string_status` auxiliary integer is not a meaningful conversion status;
`read_status=1` and exact output bytes support the successful reads. Only the
new metadata helper source was corrected; the historical capture is retained.

The unresolved step is reconstructing the field's effective key/configuration
state. A live read is an optional discriminating method, not an established
requirement. No missing input from the owner's dump has been demonstrated.
The saved field decryption remains unresolved, but the later v2 live getter
result below confirms the effective API key equals the default used for the
queries. This does not explain the server's no-offer. No new network request or router operation was performed.

The complete probe sources, native traces, positive and negative results,
private provenance, corrections and remaining work are retained in
`ota-field-credential-review.json` in the XS comparison resources.

## Repeated ONT availability request, 28 October 2026

The owner requested another simulated router availability query. The existing
client sent one completed POST to `https://swupd.wifi.nokia.com` with model
`XS-2426X-A`, current/gateway version `3FE49940KJLK50`, `VDQA`, `qa`, `isopctl=N`,
the unchanged owned ONT serial/MAC and the same packaged API default used
previously. No model, country, operator or version override was applied.

Nokia returned HTTP 200 / responseCode 200 and “Request processed successfully”,
with null next-version, checksum and download URL. The 240-byte raw reply is
exactly equal to the prior current-version reply. No firmware was downloaded.
The later owner-supplied v2 getter result confirms the effective API key and
URL match this profile. This run alone reproduced the traced fields; complete
native wire equality is separate.
HTTP success does not establish enrollment, an assigned firmware image or a
global newest release.

The first WSL attempt exited with URLError without an HTTP response or saved
result. Separate probes resolved the hostname in both runtimes; WSL timed out
during TLS handshake, while Windows verified TLSv1.3. The unchanged query then
completed using Windows Python. The probes sent no HTTP request or credentials.
The failed first attempt is not another no-offer reply; its exact failure stage
was not saved by the CLI. Certificate verification stayed enabled.

Current totals: 105 completed device availability POSTs, one additional failed
transport attempt in this run, one previous firmware CDN GET and no new GET.
The 77 public documentation metadata POSTs remain separate. Earlier reports
showing 104 completed requests are historical snapshots. Router services,
configuration, firmware banks and flash were not touched.

Exact request shape with identifiers/credential withheld, private raw-response
and reconstructed-request provenance, timestamps, failure details and limits
are in the XS comparison resource `ota-native-format-retry-20261028.json`.

## Native request equivalence review, 28 October 2026

The previous query was not an exact native reproduction. The original ONT
`swmgnt` payload/header functions were executed offline with a deliberately
injected copy of the saved current profile. Original daemon main, configuration
IPC, command execution and network I/O were not run. Stock function output
confirms equal JSON values but different bytes: 102-byte compact workstation
body versus 120-byte formatted native body, with corresponding content-length
102 versus120. Seven explicit header values match given the injected inputs.
The injected API key is not an independent credential verification.

A separate native cJSON probe agrees with the native function body exactly.
The native producer returns strlen+1; its caller recomputes strlen, so the
transmitted native read callback excludes NUL. Offline Windows fake-socket
reconstruction additionally identifies urllib User-Agent/Accept-Encoding/
Connection headers. It is not an original packet capture, and the builder
harness does not reproduce libcurl automatic headers or TLS negotiation.
Native source-port options47791/range16 and four reply-accept iptables calls
were also traced; all commands were intercepted in the harness. None of these
observed differences has been established as the no-offer cause.

At this stage the credential check was pending; the successful v2 live result
below now confirms the effective API key and URL.
`check-ont-ota-request.c` uses cfg_getObj(oid599,size0x8c5,flags0x1000), the same
call used by nal_getSwAutoUpgradeInfo, and reports only key length, key/URL
match flags, return status and enable flag. A 72-byte private comparison file
contains lengths and SHA256 digests. Stock output is suppressed; AF_UNIX for
local cfgmgr IPC is allowed; exported Internet socket/process functions are
blocked. The helper requires only GLIBC_2.17. Six synthetic cases pass but no
live output has yet been received. This verifies equality of the getter's
returned bytes, without assuming they are already decrypted.

The native packaged INI parser independently agrees with Python's 64-byte
key7. Twelve raw NAND scans found no HTTP API-key header/plain key7 assignment;
a working-file-name scan found se.conf but no sedb.conf name. These limited
negative scans do not establish missing material or exclude compressed/journal
recovery. Runtime peer entries can also change the native payload; zero peers
were injected for this controlled comparison, not measured on the live ONT.

Full sources, offsets, fixture/interception scope, positive/negative results,
loader/getter failures and private provenance are in the XS resources
`ota-request-equivalence-20261028.json` and `ota-request-equivalence-README.md`.
No new external availability query was sent; totals remain105 completed POSTs
and one earlier firmware CDN GET. The later v2 live helper comparison below confirms the key and URL.

## Effective ONT OTA credential verified live, 28 October 2026

The owner ran `check-ont-ota-request-v2` on the actual XS-2426X-A and reported:

```json
{"cfg_getObj_status":0,"key_bytes":41,"key_matches_requested_default":true,"url_matches_requested_profile":true,"OTA_enabled":false}
```

The helper exited0. This independently confirms that the stock getter's
effective41-byte API key equals the packaged default used in all three
completed ONT availability queries. Its effective polling URL also matches.
The helper uses the exact oid599/size0x8c5/flags0x1000 call used by
nal_getSwAutoUpgradeInfo. The expected72-byte file contains lengths and
SHA256 digests, and its bytes reproduce from the unchanged private profile.
Only status, length and match booleans were printed. No live credential bytes
were sent back to the workstation. Earlier statements that effective credential
equality was unverified or pending are superseded by this owner result.

The first helper's silent exit127 was a build error. A reproduction with the
ONT's original glibc2.27 showed that v1 incorrectly expected dlopen/dlsym in
libc.so.6 because the modern build host merges libdl into libc. The ONT supplies
them through separate libdl.so.2. stderr had already been redirected when lazy
resolution failed, hiding the message. v2 explicitly links the target libdl,
keeps GLIBC_2.17 requirements with correct provider attribution, binds symbols
before output suppression and adds a15-second stage-specific timeout. Eight
synthetic cases pass with the exact stock loader/libc/libdl/crypto; an additional
real-library test without router cfgmgr returns an explicit getter error rather
than disappearing. The owner's successful run is separate live evidence.

This resolves the effective-key input question. It does not independently
decrypt the saved76-byte ealgo=sab/ckn=key7 blob or establish how cfgmgr obtained
its current effective value; those remain distinct reverse-engineering work.
The prior request remains non-identical at the byte/transport level because
of compact102-byte versus native formatted120-byte JSON and client headers.
Its JSON values agree with the native fixture, and credential substitution is
no longer an unresolved caveat for that profile. The native mesh-cache state
and entire historical TLS session were not captured.

OTA_enabled=false is a confirmed live setting, but the enable flag is absent
from the external availability request. It is not established as the direct
cause of a no-offer response. The no-offer is for the tested VDQA/qa profile
with a now-verified effective key/URL; it is not proof of global firmware
availability or the operator's delivery policy. No new cloud request was made.
Totals remain105 completed device availability POSTs and one earlier CDN GET.

Exact owner output, v1/v2 binaries and sources, runtime provenance, failure
reproduction and validation scope are retained in the XS resources
`ota-request-comparator-owner-live-result-20261028.json` and
`ota-request-comparator-v2-fix.json`. The active helper source and instructions
are `check-ont-ota-request-v2.c` and `ota-request-equivalence-README.md`.
