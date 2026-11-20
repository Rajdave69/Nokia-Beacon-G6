# Reproducing the two-G6 comparison

See [the narrative](../../../writeups/comparing-other-g6-routers/README.md) and [evidence](../../../knowledgebases/comparing-other-g6-routers-evidence.json) for conclusions and limits. These tools operate on local copies. They do not contact a router, import configuration or flash firmware.

Set G6_A_SERIAL and G6_B_SERIAL to their actual full serials from the ignored local alias registry before running the examples. File labels such as ssb-G6-B.bin use the public aliases.

Use WSL/Linux, Python3 with cryptography, unsquashfs, qemu-aarch64 and an AArch64 compiler for native probes. Run from the G6 project root. The recovered analysis directory must be new:

```sh
python3 writeups/storage-and-flash/resources/recover-g6-rootfs.py \
  "dumped-firmware/router-flash-$G6_B_SERIAL/beacon-g6-clean-dumps-20261022-192444/mtd03_rootfs0.bin" \
  analysis/another-recovered-second-rootfs0

python3 writeups/comparing-other-g6-routers/resources/compare-g6-key-material.py \
  --rom first="dumped-firmware/router-flash-$G6_A_SERIAL/old/rom/rom" \
  --rom second="dumped-firmware/router-flash-$G6_B_SERIAL/rom" \
  --rom older=analysis/another-recovered-second-rootfs0 \
  --dumps first="dumped-firmware/router-flash-$G6_A_SERIAL/beacon-g6-clean-dumps-20260929-200712" \
  --dumps second="dumped-firmware/router-flash-$G6_B_SERIAL/beacon-g6-clean-dumps-20261022-192444" \
  --output analysis/new-key-comparison-metadata.json
```

The recovery tool preserves the original dump, reconstructs volume1 by logical eraseblock and highest sequence, and clears the vendor COMP_OPT hint only in a temporary copy. It does not repair missing/corrupt UBI blocks or validate every UBI CRC. Source hashes and subsequent container-integrity/native tests establish the examined artifacts. It extracts selected research trees, not a complete bootable filesystem.

The key-comparison tool reports names, lengths, equality and factory metadata, not values. A changed SHA256-crypt hash with a changed salt does not prove a changed password.

To independently check the old static key against the first real backup, use a new private output filename:

```sh
python3 network-services/webui/scripts/prepare-config-keys.py config-private/new-old-build-profile.json \
  --firmware-root analysis/another-recovered-second-rootfs0 \
  --backup config-private/config_beacon_g6.cfg \
  --serial "$G6_A_SERIAL" --operator BOQA --mnemonic 'Beacon G6'
```

The tool must authenticate the backup before writing that file. This is not a restore test on the second router.

## Native code probes

The mapped-function probes pin the original ELF SHA256 before calling a known address. They are research harnesses for the inspected trusted files, not hardened loaders for arbitrary hostile ELF input. They do not run mapped ELF main/init entrypoints. The original security library is loaded for its crypto functions; no SE_Init or sedb generation is called. Command/flash/network imports reachable through the mapped code are intercepted.

| Source | Checks / arguments after executable |
| --- | --- |
| `g6-export-kdf-probe.c` | `LIBSEC CFGMGR KEY7_STRING_FILE current\|older SERIAL absent\|SYNTHETIC_KEY18 OUTPUT_DIGEST` |
| `g6-gcm-compat-probe.c` | `LIBSEC en\|de PASSWORD64_FILE PAYLOAD_FILE OUTPUT_FILE`; original crypto library only |
| `g6-ontuser-generator-probe.c` | `LIBSEC LIBDM current\|older IMAGEVERSION EXPECTED_PASSWORD_FILE` |
| `g6-generic-password-probe.c` | `LIBSEC LIBSEC KEY14_HEX_STRING_FILE current\|older lowercase_serial ontuser\|management OUTPUT_LENGTH OUTPUT_PRIVATE_FILE` |
| `g6-older-legacy-generator-probe.c` | `LIBSEC CFGMGR OUI UPPERCASE_SERIAL EXPECTED_COLON_SEPARATED_VALUES_FILE OUTPUT_PRIVATE_FILE`; older build only |

Keep all password/key input and output files under ignored config-private/ or analysis/. KDF output is sensitive even though the probe prints only status/counters. Expected legacy values are `management:wan` without a newline. The generic key14 input is its384-character returned hex string, not192 decoded bytes.

Example compilation against the G6's old glibc symbols:

```sh
g6_root="dumped-firmware/router-flash-$G6_A_SERIAL/old/rom/rom"
aarch64-linux-gnu-gcc -Wall -Wextra -Werror -O1 \
  -Wl,--dynamic-linker=/lib/ld-linux-aarch64.so.1 \
  -Wl,--allow-shlib-undefined \
  -o analysis/g6-export-kdf-probe network-services/webui/scripts/research/g6-export-kdf-probe.c \
  "$g6_root/lib/libdl.so.2" "$g6_root/lib/libc.so.6"

qemu-aarch64 -L "$g6_root" \
  -E "LD_LIBRARY_PATH=$g6_root/lib:$g6_root/usr/lib" \
  analysis/g6-export-kdf-probe \
  "$g6_root/usr/lib/libsec_engine.so" "$g6_root/usr/bin/cfgmgr" \
  config-private/key7-string-bytes current FD4B5342 absent \
  config-private/new-second-serial-digest.bin
```

The KEY7 file must contain exactly64 original ASCII bytes with no final newline. Swap in the older root and `older` profile for its pinned address. The GCM probe consumes only the payload after the40-byte backup header, not a complete config.cfg. Keep positive and wrong-key/serial tests separate; a valid decrypt is not a successful import.

## Read-only live comparison

Source: `compare-g6-runtime.c`. A prebuilt target binary is available locally at `config-private/compare-g6-runtime`. It compares to the first device's previously integrity-checked runtime capture. It prints no passwords, keys or password hashes.

```sh
aarch64-linux-gnu-gcc -Wall -Wextra -Werror -Os \
  -Wl,--dynamic-linker=/lib/ld-linux-aarch64.so.1 \
  -Wl,--allow-shlib-undefined \
  -o config-private/compare-g6-runtime \
  writeups/comparing-other-g6-routers/resources/compare-g6-runtime.c \
  "$g6_root/lib/libdl.so.2" "$g6_root/lib/libc.so.6"
```

On the second router after copying the binary to `/tmp/compare-g6-runtime`:

```sh
chmod 700 /tmp/compare-g6-runtime
LD_LIBRARY_PATH=/usr/lib:/lib /tmp/compare-g6-runtime
sha256sum /dev/mtd0 /usr/etc/ecc_pub.pem /sbin/secmulti
```

Optional contemporaneous output from the first router checks whether key9/key10 changed since the historical capture. Their deterministic input paths are now traced and reproduce that capture, but exact second calculated-key equality is not measured by this helper. This helper checks current state; it does not regenerate a security database or install a generated account password.

## Owner-supplied results and remaining comparisons

The second-unit output received on 2026-10-22 is retained verbatim as sanitized JSON under `runtime_diagnostic.second_unit_live_result` in the evidence. key7_2/key14/key17 match the first historical capture, key9/key10 differ, and key18 lookup returns608/0 bytes. Root matches its ROM, Linux superadmin matches its factory hash, and ONTUSER matches the current-build generator. Live ecc_pub.pem/secmulti hashes match stock HJL.L91; MTD0 differs from the first saved SSB. Both active G6s have owner-added replace_with_test.sh scripts; this does not alter the stock older/current hook comparison.

The [runtime-key section](../../../writeups/comparing-other-g6-routers/README.md#which-keys-are-shared-and-which-are-derived) documents the deterministic formulas and first-capture checks. Raw calculated keys are not published.

Run the same helper on the **first G6** for a contemporaneous key9/key10 comparison. It compares with that device's own historic baseline and prints no secret values:

```sh
LD_LIBRARY_PATH=/usr/lib:/lib /tmp/compare-g6-runtime
```

The second MTD0 hash establishes different bytes, not the location or meaning of the differences. To obtain its contents, on the **second G6** save only a local copy of the partition:

```sh
dd if=/dev/mtd0 of=/tmp/ssb-G6-B.bin bs=65536
sha256sum /tmp/ssb-G6-B.bin
```

Transfer that file using the existing SCP method to ignored `analysis/ssb-G6-B.bin` in this project. Check the saved copy against the reported live hash before interpreting code changes. This command reads MTD0 and writes a regular file in /tmp; it does not write flash. The owner subsequently supplied mtd00_ssb.bin in both historical dump directories. Both now match their earlier reported hashes and have been compared; the manual commands above remain a reproduction reference. Treat its contents as device-sensitive and keep it out of public evidence.


## MTD0 capture correction (2026-10-22)

The Telnet and SSH dumping scripts used hardcoded partition lists starting at1. Neither list included0, and there was no documented exclusion reason or code that attempted to read MTD0. Both lists now start at0. On the observed layout this produces `mtd00_ssb.bin`; the Telnet variant applies its existing size verification, SHA256 manifest and ZIP inclusion to it automatically. This changes future captures only. It does not reconstruct missing bytes in old captures. The owner subsequently appended manual mtd00_ssb.bin files to both historical dump directories; those supplemental files have their own provenance and are now inspected. Both modified scripts passed bash syntax checking; neither was run against a router for this edit.


## Native comparison of the supplied SSB verifiers

[SSB evidence](../../../knowledgebases/g6-ssb-comparison-evidence.json) inventories both4MiB files, both FIP copies per device, corresponding component/certificate hashes and four CRC-valid environment records. FIP magic0xaa640001 uses a16-byte header and40-byte entries (UUID16,offset8,size8,flags8). BL33 is entry UUID bytes d6d0eea7fcead54b97829934f234b6e4, relative offset0x23530; first FIP base0x20000 gives partition offset0x43530. Use each entry's own recorded length:703991 first,702424 second. Extracted research copies are retained under ignored analysis/two-g6-comparison-20261022/ssb/bl33-G6-A.bin and bl33-G6-B.bin.

The new g6-boot-en-probe.c pins either BL33 SHA256 and maps only that trusted payload at its linked0x4000000 address. It calls the candidate/serial verifier directly; it does not boot U-Boot. Physical SECURITY reads are replaced with synthetic records, and the SHA call is replaced with stock SHA256. The original parser, length checks, BLDR fallback, Base64/filtering and comparison execute. This is a research harness, not a general-purpose bootloader loader or a hardware-storage test.

Compile against the same old G6 glibc as the other probes, then run under QEMU:

```sh
g6_root="dumped-firmware/router-flash-$G6_A_SERIAL/old/rom/rom"
ssb_work=analysis/two-g6-comparison-20261022/ssb
aarch64-linux-gnu-gcc -Wall -Wextra -Werror -O1 \
  -Wl,--dynamic-linker=/lib/ld-linux-aarch64.so.1 \
  -Wl,--allow-shlib-undefined \
  -o "$ssb_work/g6-boot-en-probe" writeups/secure-boot/resources/g6-boot-en-probe.c \
  "$g6_root/lib/libdl.so.2" "$g6_root/lib/libc.so.6"
qemu-aarch64 -L "$g6_root" \
  -E "LD_LIBRARY_PATH=$g6_root/lib:$g6_root/usr/lib" \
  "$ssb_work/g6-boot-en-probe" "$g6_root/usr/lib/libsec_engine.so" \
  "$ssb_work/bl33-G6-B.bin" "$ssb_work/fixture-G6-B.txt"
```

Private fixture files contain three newline-terminated ASCII lines: the8-character serial; its12-character expected fallback computed independently using the previously reconstructed generator; and First12(Base64(SHA256(b"AuditTest123"))) as a synthetic factory verifier. They do not contain either actual factory boot password. Both serial fixtures and both original verifier payloads pass nine cases each (36 total): factory match/wrong, alternate serial on factory path, short candidate/serial rejection, missing-record fallback match/wrong, factory precedence over fallback, and missing-field fallback. Output prints only case names/statuses/counters. The retained private traces cover en and console-policy paths. No second live UART boot or gate login occurred.


Console follow-up: both embedded default-environment blocks omit console and contain the same five keys (bootargs,bootdelay,baudrate,ipaddr,silent). The first bootloader still has a checked console lookup. The UART tutorial's fw_setenv command creates the saved entry if needed. Therefore saved/default entry absence is not evidence of unsupported variable handling. Keep the distinct kernel serial_is_dis builder finding separate; second full UART behavior remains unmeasured. Default-block offsets/hashes are now recorded in the SSB evidence.


## Stock rollback follow-up (2026-10-23)

See [rollback evidence](../../../knowledgebases/firmware-slot-rollback-evidence.json) and [writeup](../../../writeups/firmware-slot-rollback/README.md). The new g6-slot-selection-probe.c accepts LIBSEC BL33. It pins the same two BL33 hashes, calls each original slot selector and substitutes env_get/env_set/env_save/printf. Address0xf4320114 is backed by anonymous process memory, never real hardware. No U-Boot main or physical NAND driver executes. Ten cases per SSB (20 total) cover both committed banks, first alternate boot, next-boot fallback without commit, simulated successful commitment and threshold/reset differences.

Compile against the same old glibc as the en probe:

```sh
g6_root="dumped-firmware/router-flash-$G6_B_SERIAL/rom"
rollback_work=analysis/slot-rollback-20261023
aarch64-linux-gnu-gcc -Wall -Wextra -Werror -O1 \
  -Wl,--dynamic-linker=/lib/ld-linux-aarch64.so.1 \
  -Wl,--allow-shlib-undefined \
  -o "$rollback_work/g6-slot-selection-probe" writeups/firmware-slot-rollback/resources/g6-slot-selection-probe.c \
  "$g6_root/lib/libdl.so.2" "$g6_root/lib/libc.so.6"
qemu-aarch64 -L "$g6_root" \
  -E "LD_LIBRARY_PATH=$g6_root/lib:$g6_root/usr/lib" \
  "$rollback_work/g6-slot-selection-probe" "$g6_root/usr/lib/libsec_engine.so" \
  analysis/two-g6-comparison-20261022/ssb/bl33-G6-B.bin
```

The anonymous reset page only matters in the first SSB's ordinary retry-counter branch. U-Boot clears commit bits even on ordinary successful selection; Linux boot completion re-commits. These tests simulate commit flag values, not swug execution or a live boot. Original CLI/library/cfgmgr trace windows are retained under ignored analysis/slot-rollback-20261023. The stock swug procedure is documentation only; the research tools never invoke it on a router.

## UART recovery follow-up

The [recovery evidence](../../../knowledgebases/uart-recovery-from-uboot-evidence.json) separates owner-provided live UID0/PID1 results from offline analysis. The linked-command inventory can be reproduced to a new output file:

```sh
python3 writeups/uart-recovery-from-uboot/resources/g6-uboot-command-inventory.py \
  analysis/two-g6-comparison-20261022/ssb/bl33-G6-A.bin \
  analysis/two-g6-comparison-20261022/ssb/bl33-G6-B.bin \
  --output analysis/new-command-inventory.json
```

The inventory pins both BL33 hashes, parses the56-byte cmd_tbl_s records including cmd_rep, checks85 unique commands and refuses to overwrite output. It executes no firmware. analysis/uart-recovery-20261024 retains bootcortina/bn disassembly and FIT/config-module metadata. Config is in configs.ko because IKCONFIG=m; a missing IKCFG marker in kernel Image does not establish missing kernel settings.
