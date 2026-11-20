# Following the Beacon G6 security keys through the firmware

Start with the file you are trying to read. A WebUI backup uses the export keys, an internal database uses a stored-file key, and a firmware package can use a separate key. The same router can have all three. The format and the code that consumes it determine which inputs to look for.

Device references use the [shared aliases](../README.md#device-aliases). Per-device source references, key-input values and service fingerprints in the accompanying resources are aliases; the private mapping is not published.

The configuration work kept returning to similarly named keys: key7_2 in a
WebUI export, key10 in a stored database, key17 in the firmware-key loader, and
another “key2” in ONTUSER generation. Treating them as one device key made the
results harder to understand.

I compared five recovered firmware builds across four G6 units, one Beacon 9
and the Vodafone XS-2426X-A ONT. The useful result is that WebUI backups and internal
stored databases can both be processed offline for the verified G6 profiles,
but they require different inputs and have different validation limits. This
writeup maps the keys and keeps their provenance separate.

## First separate the files

The word “configuration” has covered three different files in this investigation.
They do not use one interchangeable key.

| File or operation | Material used | Decoded contents |
| --- | --- | --- |
| `/usr/etc/sec.key` | Password derived from its matching firmware version source | Static security-key INI |
| `/tmp/sedb.conf` | Password derived from effective source1/source2 and literal salt `key6` | Runtime security-key INI |
| WebUI `.cfg` export, magic `0x123123` | Serial, `key7_2`, optional `key18` fragment, operator and mnemonic | NUL-separated settings records |
| Stored `dmdb_encryption.cfg`, magic `0x124126` | Runtime `key10` | Binary configuration database |
| Legacy stored database, magic `0x124125` | Runtime `key9`, selected by the examined reader | Legacy database; no real sample decoded here |

The last distinction is now visible in both products' `libcfgdb.so`: `0x124125`
selects `key9`, while `0x124126` selects `key10`. This is the stored-file reader,
not proof that the browser importer accepts either stored format. The current
G6 save path selects `key10` even though one failure message misleadingly says
`key9`. Following the call matters more than following that log string.

## Where the named keys come from

`SE_getKeyByName()` normally tries the runtime security database first, then the static
one. The current G6, examined XS-2426X-A and Beacon 9 implementations first reject
the exact names `key0`, `key1` and `key2` as deprecated, returning error `7`. Their
remaining consumers use compiled copies instead. For other names, a value packaged
in the rootfs still needs to be distinguished from the value returned at runtime.

For the static database, I used the version source in the matching
`/usr/etc/se.conf`. G6 HJL and Beacon 9 call it `versrc0`; G6 IJL and both
ONT builds call it `keysrc0`. Define:

```python
import base64
import hashlib

def D(password, salt):
    return base64.b64encode(hashlib.pbkdf2_hmac(
        "sha256", password, salt, 100, dklen=64
    ))[:64]

static_container_password = D(version_source_ascii, b"")
```

The password opens `/usr/etc/sec.key`. Its `ff | salt8 | ciphertext` container
uses AES-256-CBC, with key/IV derived by a separate 100-iteration PBKDF2-SHA256
operation producing 48 bytes. After unpadding, the first 32 plaintext bytes
must match SHA-256 of the remaining INI text. All five examined static
containers passed that check.

**The version unlocks a container; it does not calculate every entry inside it.**
Knowing a serial and software version is not enough to reconstruct an unknown
packaged `key7_2` without the matching container or an already established profile.

The runtime container has a separate password:

```python
runtime_container_password = D(effective_source1 + effective_source2, b"key6")
```

In the captured G6 path, those normal sources are RI `G984Serial` and `ProgDate`.
`key6` here is a literal salt/container-password label. It is not an observed
`[keys].key6` entry in the static inventory. Preserve effective source case and
text; the firmware's argument parsing and file trimming precede these formulas.

## The named-key inventory

The inventory covers five integrity-checked static containers: G6 IJL.J03 and
HJL.L91, Beacon 9 JJM.K44, and XS-2426X-A JJL.K67 and KJL.K50. The four G6 units
repeat two used rootfs payloads; that does not make four independent live key
lookups. Equality below describes these samples only.

| Entry | Stored representation | Known use | Measured comparison or status |
| --- | --- | --- | --- |
| `key0` | 191 ASCII characters encoding 64 colon-separated hex bytes | Default AES-256 key (first 32 bytes); default file-integrity and TLS-password helper material | Packaged value equals embedded slot 0 in all five modern profiles |
| `key1` | Same encoding, 64 decoded bytes | Default AES-CBC IV (first 16 bytes) | Packaged value equals embedded slot 1 in all five modern profiles |
| `key2` | Same encoding, 64 decoded bytes | Default SHA-256 suffix (first 32 bytes), including the traced ONTUSER and password-history paths | Packaged value equals embedded slot 2 in all five modern profiles |
| `key3` | 64 string bytes | Encrypted packaged `preconfiguration_global.xml` | Rotates between both G6 builds and both ONT builds; all five profiles differ |
| `key4` | 64 string bytes | Complete consumer mapping unresolved | Rotates between both G6 builds and both ONT builds; all five profiles differ |
| `key7` | 64 string bytes | Complete consumer mapping unresolved | Equal across all five; separate lookup from `key7_2` |
| `key7_2` | 64 string bytes | WebUI export/import password composition | Same across G6 builds; same across ONT builds; G6, ONT and Beacon 9 profiles differ |
| `key9` | Runtime generated/cached string; 64 bytes in captured G6 lookups | Legacy stored-file magic `0x124125` | No real legacy file decoded; not a static entry |
| `key10` | Runtime device-derived 64-byte string | Current stored database CBC; G6 local Zeroman CFG GCM | Actual stored files decoded for four G6s, the ONT and Beacon 9, using their own inputs |
| `key12` | 10 ASCII bytes | Complete consumer mapping unresolved | Equal across all five static profiles |
| `key13` | 32 opaque ASCII bytes | Complete consumer mapping unresolved | Equal across all five static profiles |
| `key14` | 384 hex characters, decoding to six 32-byte slots | Generic variable-length password routines | Equal across all five static profiles |
| `key15` | Consumer reference; actual value/source unresolved | Encrypted private-key PEM protection | Not in any of the five packaged static stores |
| `key16` | Consumer reference; actual value/source unresolved | Local certificate-file integrity tag | Not in any of the five packaged static stores |
| `key17` | 64 string bytes | Unwraps supplied firmware-key material before adding runtime `key18` | Equal across all five static profiles |
| `key18` | Runtime firmware secret | Encrypted firmware branches and a fragment of the WebUI export password | Absent from all five static stores; first two G6 live lookups fail; Beacon 9 helper returns a usable value; ONT live status unknown |

This is the list of observed names and references, not a claim that the numeric
sequence is fully populated. Literal `key6` is a derivation salt/container label,
not an observed `[keys].key6` entry. An unresolved consumer is not an unused key.
Named INI `key2` and embedded deprecated index 2 have different representations
and access paths, but their bytes match: the ONTUSER hash consumes the first 32
bytes of the 64-byte decoded entry. They are not unrelated secrets.

The export uses returned `key7_2` string bytes directly. Decode a helper's outer
JSON hex once; do not decode the resulting bytes again as Base64 or hex.
The generic `key14` callers, in contrast, explicitly decode its slot material.

## The legacy defaults behind key0, key1 and key2

These entries belonged to the security engine's default cryptographic operations.
The older R21.04 and R23.03 XS-2426G-B implementations fetch a named colon-hex
entry and decode it through `SE_hexstr2buf`. Their internal numbered selector
maps `1` to `key0`, `2` to `key1`, and `3` to `key2`.

Both captured G6 builds, both examined XS-2426X-A builds and Beacon 9 instead
retain three compiled 64-byte slots. The engine calls them deprecated keys and
refuses ordinary name-based retrieval. Decrypting each matched `sec.key` and
comparing its decoded entries against the library establishes that the compiled
slots are exact copies of `key0`, `key1` and `key2`. The packaged entries remain,
but changing them alone would not change these compiled default branches.

For the operations below, `K0`, `K1` and `K2` mean the **decoded bytes**, not the
191-character text. This differs from the export's direct use of `key7_2` text.

### The default AES key and IV

The algorithm-1 implementation behind `CS_crypt()` uses AES-256-CBC. If the
request has no key pointer, its initializer supplies `K0[:32]`. Independently,
if there is no IV pointer, it supplies `K1[:16]`. Explicit pointers replace the
corresponding defaults. With the probe's encryption settings, standard PKCS7
padding is applied.

This assigns a role to both entries without making them universal configuration
keys. WebUI exports use their own GCM path, and current stored databases use
`key10`. A caller that supplies its own AES material does not use these defaults.

### The default SHA-256 suffix

With a null optional key, `CS_getSha256Str()` produces:

```python
base64.b64encode(hashlib.sha256(input_bytes + K2[:32]).digest())
```

An explicit suffix and length replace `K2[:32]`. This is concatenation followed
by SHA-256, not HMAC. The existing G6/ONT version-derived ONTUSER calculation
reaches this default branch, explaining where its previously documented
32-byte constant comes from. Beacon 9 retains the calculation and material;
its dedicated account-creation routine remains inactive in the examined build.

The library's password-history code is another caller. Its `genPwdHash()`
helper hashes an eight-character salt prefix plus the supplied password through
this default operation, and stores the prefix with the resulting hash. Saving
history and `SE_isOldPasswd()` reuse it. That is password-history processing;
it does not establish a formula for a factory Linux `root` or `superadmin` password.

### Other key0 consumers

A SHA-256-based file-integrity helper uses the first 32 bytes of `key0` when
no explicit keyword is supplied. Its generation and verification paths share
that fallback. Callers can supply other keywords, so this does not assign
`key0` to every script or protected file.

The TLS context helper has a separate use for the same first 32 bytes. When
no default private-key password has been supplied through
`SE_set_default_key_pwd()`, `SE_tls_ctx_new()` uses them in an
`EVP_BytesToKey` derivation with AES-256-CBC, SHA-256, no salt and one iteration.
It decrypts an embedded 16-byte value and places the resulting fallback
password into the context. `SE_tls_new()` passes that field to OpenSSL's
private-key password callback. This is protection of a fallback password, not
a recovered TLS private key or certificate-authority signing key, and it is
separate from the named `key15` PEM-protection path.

### How the mapping was checked

The older store-backed selectors and the current default branches were traced
in original native code. Exact-byte comparisons covered the five modern
profiles and the three older XS-2426G-B images; the older libraries lack the
modern embedded copies and use the store-backed route instead.

A guarded host-QEMU probe then invoked the original crypto library from each
of the five modern profiles. All passed four comparisons: default AES, explicit
AES key/IV, default SHA-256 suffix, and an explicit suffix. All three name-based
lookups returned `7` in every profile. The original G6/ONT glibc and Beacon 9
musl runtimes were used. These are isolated synthetic-input tests, not live
router tests or proof that every installed service selects the defaults.

The [consumer map](resources/key012/consumer-map.json),
[selected native traces](resources/key012/hjl-default-consumers.trace.txt) and
[reproduction instructions](resources/key012/README.md) retain the call sites,
source hashes, legacy comparison and test boundaries without publishing key bytes.

## What import/export can do without a target shell

The verified WebUI export password is:

```python
fragment = (key18 + b"\0")[1:1 + min(len(key18), 16)]
password64 = SHA512(
    selected_uppercase_serial + key7_2_string_bytes + fragment
    + OperatorID_original_case + Mnemonic_original_case
).digest()
```

These are 64 raw SHA-512 bytes, with no separators between inputs. Empty or
failed key18 lookup contributes no fragment. For a long key18, the fragment is
`[1:17]`; a short nonempty key includes its terminating NUL. The original length
is measured before the pointer advances.

The export then derives an AES-256-GCM key and IV using PBKDF2-SHA256 with a
four-byte file salt, 10 iterations and 44 output bytes, split 32/12. Its fixed
AAD and salt are protocol inputs, not secret named keys. The plaintext is the
compressed NUL-record language documented in the configuration writeup.

For the supplied exports, GCM authentication and original-salt repacking both
passed. Repacking reproduced each original file byte-for-byte. The tools also
support fresh-salt encryption. That establishes offline cryptographic handling;
it is not a successful edited import, account-creation test or restore across
models.

**A matching G6 does not need to be rooted individually to process a WebUI
backup once the shared profile, correct device inputs and exported file are
available.** Its tested export omits key18. The serial/operator/mnemonic still
matter. `ProgDate`, MAC, hardware revision and build version are not additional
direct export-KDF inputs.

The actual backups authenticate with an uppercase eight-character serial
suffix. The local firmware selects its serial through RI lookups. The explicit
source-serial import option, `sl_num`, uppercases its argument and strips the
first four characters when that argument is exactly twelve characters long.
It selects the decryption serial; it does not rewrite RI or supply another
device's keys, operator or mnemonic.

For the Beacon 9, static material alone did not authenticate its real export.
Adding the owner's independently obtained runtime `key18` did. We have not
established a WebUI-only source for an unknown production key18, or whether that
value is shared between different Beacon 9 units. A known value on one router
must not silently become a universal model profile.

Browser authentication, upload checks, schema compatibility and the effect of
restoring edited settings remain separate from producing a valid encrypted file.

## What key9 and key10 add

The G6 runtime code retains an existing working-config `key9`. Otherwise its
normal derivation uses the effective RI label-code source:

```python
key9 = D(b"key9" + effective_LabelCode, b"")
# Missing/invalid label-source branch:
key9 = D(b"key9" + source1 + source2, b"")
key10 = D(source1 + source2 + effective_source5, b"key10")
```

For key10, the relevant normal source5 is the effective contents passed through
`-e`, normally `/tmp/.secHashStr`. Missing input becomes the literal
`invalid_key_src5_str`. This hash-file input is distinct from the firmware-key
file `/tmp/.ext_fwkey` consumed by the key18 loader; similarly numbered source
slots must not be equated.

The initial key10 cross-device check decoded twelve saved files from three G6s:
six primary databases and their six equal backups. It preserves each exact
lowercase RI serial and six-character programming date. The stored CBC wrapper
uses an eight-byte salt and **10** PBKDF2 iterations to derive 32/16 key/IV bytes,
then PKCS7 removal and zlib decompression. Its binary database starts with
`0x1008efab`. It does not have the static-key file's SHA-256 prefix.

These checks validate the missing-source5 profile against real files. They do
not establish every operator's input state or a successful live test on an
unrooted router. The decoder needs the stored file and exact RI inputs; a label's
manufacturing date is not automatically the RI programming date. It currently
only decrypts. No edited stored database has been encrypted and accepted by the
stock router in this work. This differs from the already implemented WebUI
export pack/unpack operations.

The Beacon 9 reader has the same legacy/current selector. Its actual current
databases now decode with its own factory-derived source5, as detailed below.
No real `0x124125` file has been decoded in these comparisons.

Decoding the ONT database exposes a 76-byte wrapped OTA field. The live stock getter independently matched the packaged API key used in the [OTA experiment](../ota-firmware-downloads/README.md#what-the-vodafone-ont-queries-established). The getter result establishes the effective value; the wrapped field’s independent decoding remains open. [Field-format evidence](../../knowledgebases/editorial-evidence/security-keys.md).

The [fourth capture](../comparing-other-g6-routers/README.md) adds another unchanged-owner sample,
with the same complete IJL/HJL payloads as the second unit. Its factory boot
verifier and service keys differ from the prior units. Its six stored database
files also decode with the known key10 profile using exact RI serial
`G6-D:RI-G984Serial`, programming date `PROGDATE-C` and the missing-source5 literal. They
represent two distinct states; the selected data1 and opt-backup copies match.
No fourth WebUI export, live key18 lookup, shadow snapshot or edited import
was supplied. This extends the G6 comparison without changing the Beacon 9
unknown-key18 boundary.

## How source5 enters stored-file keys

The formula is unchanged:

```python
key10 = D(exact_RI_G984Serial + exact_RI_ProgDate + effective_source5, b"key10")
```

The examined G6 images lack the `sec_extfs` helper used by `secInit`, and their
actual stored files verify with literal `invalid_key_src5_str`. The ONT 24.03
and Beacon 9 25.03 supply that helper. They build `/tmp/.secHashStr` from these
factory SECURITY names, in this exact order:

```text
EXT_WEB_PWD, EXT_WEB_MGNT_PWD, EXT_SSID1_PWD, EXT_SSID5_PWD,
EXT_SSID9_PWD, EXT_ACS_PWD, EXT_MD5_VAR, EXT_SHA256_VAR,
EXT_SHA256CUS_VAR, EXT_RANDOM_VAR
```

`SecGetData` first deserializes each field. Missing, empty or decoded C strings
longer than 63 bytes are skipped. Concatenate the accepted strings without
separators, SHA-256 the bytes and standard-Base64 the digest: 44 ASCII bytes,
no trailing newline. The ONT supplies eight accepted fields and Beacon 9 nine.
Boot-password, operator, debug-password and firmware-key fields are not in this
hash list. A factory-field change can therefore change the stored-database key
without changing a model's packaged `key7_2`.

The actual ONT results are three complete files plus two declared-payload prefixes
with trailing data excluded. They represent three database states. One other
backup is 32 bytes short and remains unrecovered. All four Beacon 9 p28/p29
copies now decode, representing two states. These are successful offline stored
CBC results using privately recovered factory material, not public-identifiers-only
derivation, an ONT WebUI-export test, a live restore or a new key18 recovery.

This helper already exists in 24.03. Calling its presence a new 25.xx feature
would contradict the ONT capture.

The new XS-2426X-A comparison adds two real R24.03 builds and validates sec_extfs source5 as Base64(SHA256(ordered decoded accepted factory strings)). Exact RI serial/programming date plus this source derive key10. The earlier G6 missing-source literal remains correct for its verified captures; it is not the right input when sec_extfs succeeds. Actual ONT saved files and all four Beacon 9 p28/p29 copies now decode offline using their own factory material. This is separate from WebUI exports and does not remove their applicable key18 requirement.

The ONT shares the observed static constants 0/1/2/7/12/13/14/17, rotates3/4 between builds, and has a different model-specific7_2 shared across its own banks. No ONT live key18 status was measured.

[Full ONT findings](../xs2426xa-24-03-comparison/README.md).

## key17 unwraps; key18 supplies another secret

The examined initialization chain is:

```text
factory SECURITY.EXT_KEY_FW
  -> security parser / sec_extfs unwrapping
  -> /tmp/.ext_fwkey
  -> procFwKeyFile, using static key17
  -> runtime [keys].key18
```

The Beacon 9 factory field is flag 2 with 172 stored bytes. That wrapped field
is not the final 64-byte runtime string. Knowing the shared key17 does not remove
all preceding wrapping or manufacture an absent input. No serial/build formula
for an unknown production key18 was recovered.

All four captured G6 factory records and the ONT factory record lack
`EXT_KEY_FW` and `EXT_DBG_PWD`. The ONT has not supplied a live key18 diagnostic.
The first two live G6 diagnostics return status 608 and no key18 bytes; that is
a failed lookup, not a successful empty key. The third and fourth have not supplied that
live diagnostic. The loader itself remains in the G6 firmware and succeeds
with valid synthetic material. An absent input is different from removed code
or a proven universal operator suppression rule.

Symmetric content keys and firmware signing keys are separate. Knowing an
export key or firmware decryption input does not provide Nokia's signing private
key. The separately documented firmware-validation exception is a property of
its validation path, not an implication of shared key names.

### Following the missing firmware-key input

On the examined G6 HomeOS 24.04 `HJL.L91p01` capture, two parsed factory `SECURITY` copies contain no `EXT_KEY_FW`. The captured ROM also lacks the `sec_extfs` executable and package even though `secInit` refers to it. A later live metadata check successfully read the current logical record, found no `EXT_KEY_FW` or `/tmp/.ext_fwkey`, and found `sec_extfs` unavailable through PATH. The G6-B 24.04 live diagnostic independently reported the same missing field and failed key18 lookup. These observations do not exhaust every G6 build or device.

The retained `procFwKeyFile()` consumer reads an existing input and uses key17 to decrypt it before adding key18 to the runtime database. It does not reconstruct an absent factory value from key17. An original-code QEMU probe with synthetic values inserted the expected key18 only for a valid wrapped input and matching synthetic key17; missing, empty, malformed and wrong-key inputs did not insert it. A separate native test rejected a zero-length firmware password. Neither test uploaded, flashed or booted firmware. [Probe source](../security-keys/resources/key18/g6-key18-loader-probe.c) · [sanitized evidence](../../knowledgebases/firmware-key18-provenance-evidence.json).

The Beacon 9 HomeOS 25.03 `JJM.K44p01` capture contains a wrapped `EXT_KEY_FW` field and its firmware includes the extractor; the supplied live helper returned a usable runtime key18. The XS-2426X-A HomeOS 24.03 captures include the extractor but their examined factory record lacks the field; no live ONT key18 lookup was performed. The G6 HomeOS 24.02 `IJL.J03p01` capture also retains the consumer but lacks the extractor. This compares specific captures, not proof that hardware, release or operator alone explains the difference.

The [metadata-only diagnostic source](../security-keys/resources/key18/check-key18-state.c) reports lookup status and factory-field presence without printing key values. Its eight mocked API cases and the two supplied live G6 results have separate scopes; a record must be read and parsed successfully before an absent-field result is meaningful. Build commands and traces remain in the [provenance knowledgebase](../../knowledgebases/firmware-key18-provenance.md). For the upgrade handler and rooted key-reading procedure, see [firmware validation and flashing](../firmware-upgrade-path/README.md#reading-key18-from-an-already-rooted-router).

## Password generators use other material again

`key14` serves generic variable-length generation routines. Their selected
context, serial case, requested length and customized alphabet matter; callers
also supply PartNumber context. Those APIs are not interchangeable with the XML
handler named `genpwd_longpasswd`.

The normal G6 Linux ONTUSER path uses `IMAGEVERSION` and the embedded deprecated
index2 material instead. For the examined `3FE...` image versions:

```python
seed = bytes.fromhex("391075") + IMAGEVERSION[9:12].encode("ascii") + b"mp"
password = Base64(SHA256(seed + embedded_index2_first_32_bytes))[:12]
```

The selected embedded bytes match across both G6 builds, both ONT builds and the examined
Beacon 9. The Beacon 9 still retains generator code, but its ordinary dedicated
account creator is a no-op. A retained key/function is not evidence that the
account is installed. On the G6, `DebugRnPassEnable` is checked after initial
creation and controls the optional factory override.

BOQA WebUI factory selection uses `EXT_WEB_PWD` and `EXT_WEB_MGNT_PWD` when
`KeepLablePassword` applies. The shared generic material has not recovered the
factory management plaintext. Changing the mutable WebUI password also does
not automatically rotate the separate Linux superadmin preset credential.

`EXT_BOOT_PWD` is another verifier: the normal bootloader compares the first
12 Base64 characters of SHA-256 of the supplied password. The serial-derived
fallback uses its own embedded BLDR constant when its required record is
unavailable. That constant is separate from the ONTUSER index2 material. The
original stored boot verifiers differ across the four G6s, Beacon 9 and ONT, even
where the first and third G6 bootloader partitions are identical.

## Public trust keys and service keys

The examined `/usr/etc/ecc_pub.pem` is the same 134-byte `sect131r2` public key
across all five examined builds. Password2 verifies a signature over the exact
runtime `keysrc1` message. A shared verification key does not produce the
required signature; the corresponding authority private key has not been
recovered.

The `/root/rootca.pem` firmware trust certificate is byte-identical across
all five profiles, including both ONT builds. It contains a 2048-bit RSA public
key. It remains distinct from CBC/GCM content keys and other FIT/FIP or hardware
trust anchors. No corresponding Nokia signing private key was recovered.

All six saved HTTP private/public pairs match within their own unit and use
1024-bit RSA. Their canonical SPKI public keys are pairwise distinct across
four G6s, Beacon 9 and the ONT. Saved Dropbear RSA and Ed25519 private files
also differ byte-for-byte across all six. Canonical SSH public-key comparison
and live service/authentication verification remain unperformed.

Finally, the OTA client API key is a service credential, not a configuration or
firmware decryption key. Its 41 bytes match in the first G6 and Beacon 9 exports and the ONT's packaged
default; the ONT's saved raw setting is individually wrapped, so the default
was not claimed to be its independently recovered live plaintext. That does
not establish universal sharing. Startup-script checksum seeds belong
to their caller-integrity format and are another separate category.

## Reading an existing live profile

If a root shell already exists, the matching [key-reader source](../../network-services/webui/scripts/read-config-key.c)
can be compiled for that router and copied as `/tmp/read-config-key`. It reads
RI plus the effective `key7_2`/`key18` values, rather than every named entry:

```sh
LD_LIBRARY_PATH=/usr/lib:/lib /tmp/read-config-key /tmp/beacon-config-keys.json
```

Keep that output private. The G6 needs its ARM64 glibc ABI; Beacon 9 needs its
ARM64 musl ABI. A binary linked for one loader is not automatically suitable
for the other. An empty field from this simple reader does not distinguish an
absent lookup from a successful empty string; the separate key18-state helper
reports the lookup status. This command is an optional read method, not a
requirement for processing a matching G6 export with an already known profile.

## What remains open

The remaining gaps are specific: complete consumers of the inventory-only
entries, real legacy-key9 files, distribution of
production key18 across units, full binary-database editing, and actual edited
imports. Those gaps should remain visible rather than being filled by assuming
that a shared value means a shared purpose or credential.

The [Beacon 9 companion repository](https://github.com/Rajdave69/Nokia-Beacon-9) (`writeups/security-keys/README.md` in the research checkout)
puts its nonempty runtime key18 requirement in the foreground. Related G6 work:
[configuration exports](../configuration-import-export/README.md),
[key18 provenance](../security-keys/README.md#following-the-missing-firmware-key-input),
[the three-unit stored-file result](../comparing-other-g6-routers/README.md), and
[operator/account policy](../operator-profiles-and-credential-policy/README.md).

The [static inventory](resources/static-key-inventory.json),
[public trust inventory](resources/trust-key-inventory.json),
[stored-key selector trace](resources/stored-key-selector-trace.txt),
[service-key comparison](resources/persistent-host-key-inventory.json), and
[complete key knowledgebase](../../knowledgebases/security-keys.md) retain the
measurements and exact source provenance. Symmetric/private key values stay in
the protected captures; these records publish roles, sizes, equality and limits.

The [offline validation record](resources/validation-results.json) checks the five-profile inventory, source
fingerprints, links and known-secret exclusion. The ONT comparison retains its
separate factory-parser and actual-database evidence. Neither establishes live
edited import acceptance or cross-unit key18 sharing.

## Provisioning adds another key10 format

The [provisioning follow-up](../provisioning-pipeline/README.md) authenticates
seven actual G6 `ENC_CFG` files using device-derived key10 with a raw AES-GCM
wrapper. This is separate from both stored-database CBC and WebUI export
composition. Six 114 copies contain the same common operator recipe. Its
credential placeholders are expanded locally; the common file is not a shared
plaintext password. The exact G6 missing-source5 profile failed on the actual
saved Beacon 9 database. The subsequent Vodafone ONT comparison resolved the
extra source: factory-derived sec_extfs data now decodes all four saved Beacon 9
database copies. The failed earlier profile remains valid history.

Certificate handlers also reference `key15` for encrypted private-key PEM
protection and `key16` for a local certificate-file integrity tag. Their real
values and source lifecycle were not recovered, and neither appears in the
eleven-entry static inventories. These references do not provide a vendor
X.509/firmware/Password2 signing private key. The new extraction also measured
the Beacon 9 HTTP keypair: internally matching, 1024-bit RSA; broader service-key
comparisons remain separately scoped.

## Boot-chain keys are a separate domain

The [secure-boot follow-up](../secure-boot/README.md) verifies the four G6 SSB certificate/key relationships and their BL2/BL31/BL33 payload digests. U-Boot's embedded FIT RSA key differs from the firmware-upgrader certificate key. Neither configuration-export keys nor Password2 credentials provide those signing private keys. The fifth G6 reports enabled hardware root-key status; complete early-stage unlock remains unproven.
