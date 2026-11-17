# Reproduction and execution scope, 27 October 2026

The owner reports no modifications to ONT-A and identifies it as Vodafone. RI separately records VDQA/qa. Owner provenance is not a guarantee of factory-fresh history.

## Read-only extraction and verification

- Hash all12 physical main-area `.bin` files against supplied SHA256SUMS.txt.
- ZIP CRC validation and partition-member SHA256 comparisons cover the same12 files. Logical mtd12+ are mapped UBI children, not additional physical NAND regions. No OOB supplied.
- Reuse `writeups/storage-and-flash/resources/recover-g6-rootfs.py` functions `recover_image`/`compatible_copy`. Recover UBI volume1 using highest VID sequence per LEB and contiguous-map check. Retain original used SquashFS separately. For unsquashfs only, clear COMP_OPT in a temporary copy when compressor4/stored0x800c match the known vendor XZ extension. No source image overwritten.
- `unsquashfs -no-progress -d PRIVATE_ROOT EXTRACT_ONLY_IMAGE etc usr lib sbin webs root bin` extracts research directories only; no device nodes or firmware execution.
- Reuse `writeups/comparing-other-g6-routers/resources/extract-writable.py` with `--capture NEW_CAPTURE --private-output PRIVATE_ROOT --tool-path /tmp/beacon-g6-third-ubi-packages-20261026 --report resources/writable-extraction.json`. This uses UBI Reader0.8.16's indexed tree, not journal replay. mtd05 fails layout-block discovery; record failure without diagnosing physical damage. Other four writable volumes extract.
- Both rootfs UBI volumes also checked with `writeups/comparing-other-g6-routers/resources/compare-volumes.py:volumes`, including EC/VID CRC, static payload CRC, contiguous LEB and used-payload hash. FIT signatures not verified by this helper.
- Both U-Boot environment records checked at0/0x100000, size0x20000, stored CRC32 of bytes5:end and redundancy flag byte4. Kernel cmdline and active_part establish selected bank1; generic img_active/img_commit/img_executed0 fields do not override that observation.

## Factory parser native probe

`factory-parser-probe.c` loads the ONT's original libsec_engine.so under QEMU and calls only SecBlockInit, SecSetSerializedStr, SecGetData for the ten ordered names, then SecBlockFree. `dlopen` runs normal library constructors. No SE database initialization or full firmware entrypoint is invoked.

Command/network imports `system`, `_system`, `popen`, socket, connect and execve abort with exit90. The incompatible unused crypt dependency is supplied by `factory-parser-crypt-deny.c`, aborting with exit91 if crypt is called. Successful status0 means none of these aborting paths was reached. This is not a crypt(3) or password-login test. Ordinary file access is not globally sandbox-intercepted by the probe; its explicit input is one private8192byte serialized record and its explicit output is private JSON created O_EXCL mode0600. No extfs_get/storage driver is invoked.

Compilation:

```text
aarch64-linux-gnu-gcc -O2 -Wall -Wextra -Wno-unused-parameter -Wl,--export-dynamic -o PRIVATE/factory-parser-probe resources/factory-parser-probe.c -ldl
aarch64-linux-gnu-gcc -shared -fPIC -Wl,-soname,libcrypt.so.1 -Wl,--version-script=resources/factory-parser-crypt-deny.map -o PRIVATE/native-probe-compat/libcrypt.so.1 resources/factory-parser-crypt-deny.c
qemu-aarch64 -L /usr/aarch64-linux-gnu -E LD_LIBRARY_PATH=PRIVATE/bank1-root/usr/lib:PRIVATE/native-probe-compat PRIVATE/factory-parser-probe PRIVATE/bank1-root/usr/lib/libsec_engine.so PRIVATE/factory-SECURITY-record.bin PRIVATE/factory-decoded-native.json
```

Initial cross-sysroot attempts failed: libcrypt.so.1 absent, then stockglibc2.27 libcrypt required GLIBC_PRIVATE __snprintf absent from the newer cross libc. The explicit aborting shim avoids pretending to test crypt or selecting an incompatible libc. Final success reads8ONT fields; same parser reads9from supplied Beacon9 factory record.

`reconstruct-source5.py` consumes that private decoded JSON and writes Base64(SHA256(concatenated accepted1..63byte C-string values)) to a new private44byte file, in sec_extfs's exact table order. No NUL/separators/newline in the hash concatenation or output. Original `genSecHashFile` itself was statically traced, not executed.

The existing stored decoder then uses exact RI serial/progdate and this source5. Full files require exact header length, CRC, CBC padding, zlib EOF/checksum/length and binary schema bounds. Current and legacy ONT files pass. Two opt backups contain64trailing bytes: only their exact declared prefix was additionally checked; original files remain untouched. One current bak is32short and remains unrecovered. Full-file rejection is retained separately from successful prefix recovery. These CBC checks are not authenticated encryption.

The same process decodes B9p28 main/bak using its own factory record, serialB9-A:RI-G984Serial andProgDate260527; exact B9sec_extfs table parity was checked separately through PT_DYNAMIC DT_RELA because the musl executable has no section headers. A section-based ELF helper and raw pointer scan failed before handling dynamic relocations and a zero BSS terminator. No B9native executable was run.

## Other decoding, inventories and limits

- Packaged sec.key: existing prepare-config-keys.py checks its internal SHA256 and decodes all11static entries. Report lengths/equality, not raw values.
- Packaged preconfiguration_global.xml: big-endian5I20byte header, magic0x123124; payload FF+salt8+CBC; key3ASCII with PBKDF2-HMAC-SHA25610rounds48bytes -> AES256-CBC key32/IV16, PKCS7, zlib. CRC and exact uncompressed length pass for each own key3.100rounds fails padding. Exactly one terminalNUL is removed only for XML parsing; raw decoded files unchanged/private. Full sanitized operator rows retained asCSV; credential literals withheld.
- `compare-rootfs.py` inventories regular files/symlinks without following symlink directories or executing files.
- Existing extract_beacon_key2.py API resolves CS_getSha256Str selector branch index2 and returns known-key equality only. Do not confuse this deprecated32byte constant with packaged INI key2 or key14.
- All annotated static traces are heuristic GOT/string assistance. Stale register notes across branches can be wrong; raw instructions, exact byte tables and direct relocation targets take precedence. Initial account trace started after prologue; `*-account-creator-full-trace.txt` adds the complete function. Boot caller excerpts are bounded, not complete program flow.
- No live shadow, post-reset state, WebUI export, login, firmware upgrade, cloud metadata query, network connection or native account-creation execution was tested. The user authorized analysis of the supplied dump; captured scripts/log commands were treated as data.
- No whole-device security assurance, new vulnerability claim from binary identity, factory provisioning chronology, or assumption that a captured policy is the currently applied network setting.

The linker map is additionally retained verbatim as `factory-parser-crypt-deny.map.txt` so text-source collectors preserve its complete bytes. `stock-text-snapshots.json` contains complete exact UTF8 stock scripts/policies, including extensionless script paths, rather than relying on extension-based text detection.

## OTA follow-up and saved scalar parser

The later user explicitly requested an ONT update check/download. This is separate
from the initial offline examination above. Two automatic-review rejections
occurred before process creation; each exact request was then explicitly approved
by the owner and retried unchanged. Two real POSTs completed, no offered URL and
no new GET/download. No rejected operation ran. Currentversion3FE49940KJLK50 at
2026-10-27T17:03:35.404397+00:00 and actualinactive3FE49940JJLK67 override at
17:04:46.564539+00:00 bothHTTP200/responseCode200/no target, checksum or URL.

`ota-settings-probe.c` loads stocklibdmdb, calls dm_db_open_memory(raw,size,NULL),
then get_node/get_value/value_to_string for12existingOTA/identityURIs and one
nonexistent control, unsets values, closesDB. Only saved snapshots are read;
there is no cfgmgr/libcfg daemon initialization, hardware accessor, account API
or live-router read. dlopen constructors run. Explicit inputs are one private
368473byte decodedDB and stocklibrary; output is private hex-valuedJSON created
O_EXCL0600. Command/network imports abort90. Ordinaryfileaccess is not globally
intercepted. Missinglibubox was supplied as an exact isolated stockdependency;
stocklibc was not added to LD_LIBRARY_PATH. Initialmissingstring.h fixed before
successful build. All12existingreads status1; nonexistentURI foundfalse/status0.

```text
aarch64-linux-gnu-gcc -O2 -Wall -Wextra -Wno-unused-parameter -Wl,--export-dynamic -o PRIVATE/ota-settings-probe resources/ota-settings-probe.c -ldl
qemu-aarch64 -L /usr/aarch64-linux-gnu -E LD_LIBRARY_PATH=PRIVATE/ota-probe-compat:PRIVATE/bank1-root/usr/lib:PRIVATE/native-probe-compat PRIVATE/ota-settings-probe PRIVATE/bank1-root/usr/lib/libdmdb.so PRIVATE/decoded-09086db521e8276ef42ba21a60c2d6753ce7369554113f4c5f453f878d9fd42e.bin PRIVATE/ota-settings-current-private.json
python3 resources/prepare-ont-ota-profile.py --settings PRIVATE/ota-settings-current-private.json --preconfig PRIVATE/bank1-preconfiguration.xml --ri CAPTURE/mtd02_RI.bin --out PRIVATE/new-xs-ota-profile.json
python3 scripts/ota-firmware-download.py query --profile PRIVATE/xs-ota-profile.json --out PRIVATE/ota-current-offer
python3 scripts/ota-firmware-download.py query --profile PRIVATE/xs-ota-profile.json --reported-version 3FE49940JJLK67 --out PRIVATE/ota-archived-bank-offer
```

Profilepreparationisoffline. The helper validates redundantRI serial/MAC against
saved nativegetters; emptyOUID falls backfactoryVDQA; highpriorityWLANregiontrue
selectsqa. ModelName is exactlyXS-2426X-A. SavedOTAEnable=false. URL is the normal
Nokiahost. Sourcecode affirms literal isopctlN. This did not toggle OTAenable or
contact/upgrade the router. Externalmetadata uses the own packaged GENERIC41byte
APIkeydefault, equal priorBeaconcaptures. Savedrawkeyis76byteBase64, decoding57
bytes startingFF with CBC-compatible extent; its plaintext was not independently
recovered. Do not claim a demonstrated savedcipher/default equality.

Four bounded independent CBC trials (derivedkey9/key10,10/100PBKDFrounds) failed
padding. `ota-credential-probe.c` attempted the mapper's legacyCS_crypt scheme2,
action0; initial and static-lookup-interposed runs returnstatus24/no output.
No SE_getKeyByName interposer call was observed. Error semantics and applicability
of that legacy path to the current savedvalue are unresolved. The failed helper
is not published as a working decoder. No securityDB init or factory regeneration
was used. Triallog/keys/ciphertext stayprivate. One first diagnostic printed the
packagedAPIkey because it redacted attributevalue rather thanv; corrected before
saving public evidence, and public-secret checks include that exact41byte string.

Initial libotaSwAgent4exx traces hitPLT rather than the headerbuilder. Correct
requestbuilder is swmgnt0x4e40, payload0x8108, config0x8c60->nalcall0x8d0c.
Original and corrected traces remain as explicitly qualified bounded excerpts.
`libnal.so` implementations are under/lib, not/usr/lib. elftools unavailable;
existing standard-library ELF reader and installed GNUcrossbinutils were used.
No target binary was executed for disassembly; only the bounded parser and failed
cryptographic probe ran underQEMU. Full-source/response/input fingerprints and
scope are in ota-research.json; actual identities/APIkey/rawoffers remainprivate.

## Derived-resource credential redaction correction

The wider synchronizer additionally scans the exact packaged OTA API-key bytes.
The earlier two operator CSVs and operator-policy summary retained that default
because the original secret scan covered named security/factory/source5 values,
but omitted this separate service credential. Only the credential value is now
replaced with an explicit withheld marker; row counts/URI/rules remain. Exact
unredacted originals are privately retained with before hashes. Six old generated
artifact copies containing the same value were moved to verified private retention
before removing their public copies; current source archives are regenerated from
redacted sources. public-credential-redaction.json retains all9old source paths,
identities, private backup paths and new hashes without the credential itself.
The strengthened original validator and broad synchronization validator both
check the actual41byte default. Firmware/private sources/network originals stay
unchanged. Lossless public snapshots now describe the intentionally sanitized
source, and original secret-bearing versions remain protected references.
