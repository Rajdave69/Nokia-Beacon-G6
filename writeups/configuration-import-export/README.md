# What is inside the Beacon's WebUI configuration backup?

The Beacon's WebUI has a configuration export feature: use it and the browser downloads a `config.cfg` backup of the router's settings. I wanted to know what that file contained, which settings it could restore, and whether it could be read or edited outside the WebUI.

Opening the downloaded file as text does not reveal a list of settings. It produces a garbled mixture of characters, because the file is a binary container carrying compressed and encrypted data. Renaming it or opening it in a different text editor will not turn it into a readable configuration. To understand it, I followed the export request through the firmware and reconstructed how the file is produced.

The result is a stream of named configuration records: Wi-Fi, WAN, LAN and other management settings can appear in it, along with sensitive values. It is **not a complete image of the router**. It does not include every file, factory record or firmware component, and an authenticated backup is not a guarantee that every setting will be accepted on import. Keep both the original export and any decoded copy private.

The main evidence is the Beacon G6 **HomeOS 24.04, `HJL.L91p01`** firmware and a supplied WebUI export. I compared it with a Beacon 9 **HomeOS 25.03, `JJM.K44p01`** image and export. Both real files were authenticated and decoded offline; no edited backup was imported and no router was rebooted for this comparison. The router also keeps a [stored binary configuration database](../stored-configuration-database/README.md), which has a different format and key path. The similar purpose does not make that file the WebUI export.

## From a browser download to configuration records

The WebUI export collects records from the management database, compresses them, then encrypts and authenticates the compressed data. A small header carries format and length information. During import, the firmware checks and decrypts the container, decompresses its contents and processes the records as configuration changes.

```mermaid
flowchart LR
    A[Management settings] --> B[Export records]
    B --> C[Compress]
    C --> D[Encrypt and authenticate]
    D --> E[Downloaded config.cfg]
    E --> F[Import: check and decrypt]
    F --> G[Decompress and apply records]
```

This diagram describes the traced paths. The actual import of an edited file has not been tested here, so it is not evidence that every possible edit succeeds. The sections below follow the browser request, the inputs needed to decode the file, the records inside it, and what the restore path can and cannot establish.

## Following the download through the firmware

The browser uses `usb_web_app.cgi?export` for the download. In the examined G6 HomeOS 24.04 `HJL.L91p01` build, the request reaches `cfg_copyConfigFile("/tmp/config.cfg.backup", 4)` through the CGI. The configuration library passes it to `cfgmgr`, where `cfgXML_doc2ExportFile()` exports key-value records, compresses them with zlib and calls the security library's `SE_aesGcmEn()`. The CGI returns the resulting temporary file as `config.cfg`.

The name `usb_web_app.cgi` is misleading in this context. The same CGI has other USB-related branches, but the browser download does not need a USB drive. It also handles browser imports:

```text
GET  usb_web_app.cgi?export
POST usb_web_app.cgi?import
POST usb_web_app.cgi?v=import&sl_num=<source-serial>
```

The upload uses a multipart form with a CSRF token and file field. The CGI checks the session, and after a successful restore response the browser separately requests a reboot. Finding these endpoints does not establish an unauthenticated interface.

Tracing the request explains why the downloaded bytes are not readable text. To recover the records, the next questions are how to recognize the container and which input the firmware uses to decrypt it.

## Recognizing the export container

The downloaded file begins with a 40-byte header: five little-endian 64-bit values. The encrypted payload follows it.

| Offset | Field |
| --- | --- |
| `0x00` | Magic `0x123123`, identifying this export format |
| `0x08` | Encrypted payload length |
| `0x10` | CRC32 of the encrypted payload |
| `0x18` | Expected length after decompression |
| `0x20` | Version `0x00000000fffffffe` |
| `0x28` | Four-byte salt, 16-byte GCM authentication tag, then ciphertext |

The CRC helps detect a changed or damaged payload, but it does not replace the cryptographic authentication check. Changing the ciphertext and updating only the CRC does not produce a valid GCM tag.

Given the correct export password, the security library derives 44 bytes with PBKDF2-HMAC-SHA256 using the file's four-byte salt and **10 iterations**. The first 32 bytes become the AES-256 key and the remaining 12 the GCM IV. The examined G6 24.04 `HJL.L91p01` and Beacon 9 25.03 `JJM.K44p01` libraries use the following fixed associated data for the authenticated encryption:

```text
d92ae1d30dd96d2be8de7318c6fd18fc4b9faa645678acf6427c2ac98ab84078
```

After authentication and decryption, zlib decompression exposes the records. This answers the text-editor question: the settings are not simply hidden behind a header; they are inside compressed, authenticated ciphertext.

## Where does the export password come from?

The firmware constructs the export password from device identity and security-engine values, not from the password typed into the WebUI. It first assembles a byte string from the device's selected serial, `key7_2`, an optional portion of `key18`, operator ID and mnemonic. It then hashes that byte string with SHA-512. The resulting 64 bytes are the password input to the separate per-file PBKDF2 step described above; the SHA-512 result is not itself the AES key.

The examined G6 HomeOS 24.04 `HJL.L91p01` and Beacon 9 HomeOS 25.03 `JJM.K44p01` functions use the same sequence:

```python
password64 = SHA512(
    selected_uppercase_RI_serial
    + key7_2_string_bytes
    + selected_key18_fragment
    + OperatorID_string_bytes
    + Mnemonic_string_bytes
).digest()
```

The inputs are concatenated without separators. The result is the 64 raw digest bytes, not a hexadecimal string. Named security-key values contribute their returned string bytes; a value that looks like hex is not automatically converted to a number or decoded again.

The function first tries the RI `SerialNumber` and falls back to `G984Serial` on failure, an empty value or the zero-sentinel comparison. It uppercases the selected serial and retains at most 31 characters. The operator ID, mnemonic and key strings keep their original case.

The `key18` contribution has a less obvious boundary: the code hashes `min(strlen(key18), 16)` bytes starting at `key18 + 1`. For an ordinary long key that corresponds to bytes `[1:17]`; a short nonempty value can include its terminating NUL. Failed or empty key lookups are logged and contribute no bytes. These details matter when reproducing the file format: a plausible-looking derived value still has to authenticate the actual export.

### A worked example with fictional inputs

These values are invented solely to illustrate the calculation; they are not a device identity, a stock key or a usable backup key. Suppose the selected RI serial is `a1b2c3d4`, `key7_2` returns `0123456789abcdef0123456789abcdef`, `key18` returns `xABCDEFGHIJKLMNOPQRST`, the operator is `TEST`, and the mnemonic is `Example Beacon`.

The serial becomes `A1B2C3D4`. The key18 contribution starts **after** the first byte `x` and takes the next 16 bytes, `ABCDEFGHIJKLMNOP`. The key7_2 value is used as the literal 32 ASCII characters shown, not converted from hex to 16 binary bytes. The five byte strings are then joined with no spaces or separators:

```text
A1B2C3D4 + 0123456789abcdef0123456789abcdef + ABCDEFGHIJKLMNOP + TEST + Example Beacon
```

The plus signs above show the boundaries; they are not included in the hash. This standalone Python example reproduces the resulting 64 bytes and displays them as hex for inspection:

```python
import hashlib

serial = b"a1b2c3d4".upper()
key7_2 = b"0123456789abcdef0123456789abcdef"
key18 = b"xABCDEFGHIJKLMNOPQRST"
operator = b"TEST"
mnemonic = b"Example Beacon"
fragment = key18[1:17]  # This example uses a key longer than 16 bytes.
password64 = hashlib.sha512(serial + key7_2 + fragment + operator + mnemonic).digest()
print(password64.hex())
```

The displayed result is `ef196616b8b3ccbe3b8b11e4c99cd7d9bb53e952dac0c68ace06313705a0c004a55771e646156c972e7c680d5712e63bda5dae15d34a0e45d91d88fe952b2be1`. The firmware passes the **64 raw bytes**, not those 128 printable hex characters, to the next derivation. If the key18 lookup returns empty or fails, the fragment contributes no bytes; for a short nonempty value, use the C-string rule above rather than assuming the slice in this long-key example is sufficient.

### Why the two devices needed different inputs

The supplied G6 HomeOS 24.04 `HJL.L91p01` export authenticated with **no key18 contribution**. Adding a synthetic nonempty contribution caused authentication to fail. For the supplied Beacon 9 HomeOS 25.03 `JJM.K44p01` export, the opposite check mattered: omitting its nonempty runtime key18 made authentication fail. The examined images also have different `key7_2` values.

That is why a shared algorithm does not imply a shared password or cross-device restore compatibility. These are results for the supplied files, not proof that every G6 build or unit lacks key18. The examined G6 HomeOS 24.04 `HJL.L91p01` binary retains both a key18 lookup and a `procFwKeyFile()` path that can install it. Its captured ROM lacks the `sec_extfs` file referenced by `secInit`, but the original reason for the missing contribution and the command's full runtime availability were not established.

The sampled HomeOS 24.04 `HJL.L91p01` units and recovered HomeOS 24.02 `IJL.J03p01` slot share `key7_2` and pass the recorded cross-build native KDF/GCM checks. A live G6-B helper on 24.04 returned the same `key7_2` and key18 status 608 with zero bytes; both examined factory records lack `EXT_KEY_FW`. A real G6-B WebUI export and an edited restore were not tested. [Device comparison](../comparing-other-g6-routers/README.md).

## The keys are stored in another pair of containers

The preceding formula names `key7_2` and `key18`, but it does not explain where the security engine gets them. The examined firmware has static and runtime security databases. These are **not** the WebUI backup, and they have their own encryption and inputs.

| Layer | Relevant source on the examined G6 24.04 `HJL.L91p01` | Role |
| --- | --- | --- |
| Static security database | `/usr/etc/sec.key`, with version source from `/usr/etc/se.conf` | Supplies packaged security entries, including `key7_2`. |
| Runtime security database | `/tmp/sedb.conf`, using values from `/tmp/secKeySrc.conf` | Supplies runtime security entries. |
| WebUI export | `config.cfg` | Uses the derived SHA-512 input and the separate GCM container described above. |

I decoded the G6 HomeOS 24.04 `HJL.L91p01` ROM's `sec.key` and the captured runtime `sedb.conf`; both passed their plaintext integrity checks and contained `key7_2`, while neither contained `key18`. The project's `analysis/sec.key` was empty, so the ROM copy was the usable static source.

For the static database, `SE_deriveKeyStr()` derives 64 bytes from the `se.conf` version source with PBKDF2-HMAC-SHA256 and an empty salt, then Base64-encodes and truncates the result to 64 characters. The runtime database uses the captured serial and programming-date source strings with salt `key6`. Those source strings retain their original spelling and case; uppercasing the export serial is a separate step.

The security database containers use a `0xff` marker, eight-byte salt and AES-256-CBC ciphertext. Their key/IV derivation uses PBKDF2-HMAC-SHA256 at 100 iterations. After decryption and unpadding, the stored SHA-256 digest is checked against the following INI text. The [knowledgebase](../../knowledgebases/configuration-import-export.md) retains the complete reconstruction.

The examined HomeOS 24.04 `HJL.L91p01` code also has a path from `SECURITY.EXT_KEY_FW` through `sec_extfs`, a temporary file and `procFwKeyFile()` to runtime `key18`, using static `key17` in that process. The examined Beacon 9 HomeOS 25.03 `JJM.K44p01` factory entry uses TrustZone-protected storage; I supplied the usable runtime result through the helper for the export comparison. A wrapped factory record is not automatically the same thing as the unwrapped input consumed later. The [key18 provenance investigation](../security-keys/README.md#following-the-missing-firmware-key-input) follows this distinction.

## Reading the decoded records

After GCM authentication and zlib decompression, the file becomes a stream of **NUL-terminated records**. Despite function names beginning with `cfgXML`, the downloaded format is not an XML document. The records describe operations on Nokia's hierarchical management model.

| Prefix | Meaning in the import parser |
| --- | --- |
| `@` | Select and clean an existing root or subtree |
| `+` | Add an object instance |
| `$` | Select an existing parameter or node |
| `#` | Assign an attribute such as `v=<value>` or `noc=<value>` |

For readability, the following example displays each record on a separate line:

```text
@InternetGatewayDevice.
$InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID
#v=ExampleOnly
```

The actual separator is a NUL byte, with an additional NUL at the end of the stream. Notification attributes can also be represented. The example is illustrative; a real backup can contain passwords, network details and other private settings.

These prefixes matter if a file is edited. A backup is not simply a list of independent `name=value` lines: an `@` record can clean a subtree, and `+` can create an instance. Removing apparently unrelated records from a full backup can therefore change what import does.

## What the two supplied backups contained

The reconstructed format worked on real files from both devices:

| Measurement | G6 24.04 `HJL.L91p01` | Beacon 9 25.03 `JJM.K44p01` |
| --- | ---: | ---: |
| Downloaded file | 50,299 bytes | 72,826 bytes |
| Decompressed record stream | 578,139 bytes | 981,144 bytes |
| Total records | 13,209 | 22,097 |
| Parameter-value records | 6,444 | 10,795 |
| Instance-add records | 310 | 496 |
| Notification attributes | 10 | 10 |

Both snapshots contain management-model settings for Wi-Fi, LAN/DHCP/DNS, WAN IP/PPP, firewall/NAT/QoS, accounts, TR-069, service access and vendor or mesh features. The ordinary Account and WebAccount password fields in these two captures contain SHA-256-crypt verifiers, with different current and preset values. Decrypting the backup therefore did not reveal those plaintext passwords.

Some fields describe configured state rather than a measured running service. For example, both captures have SSH and Telnet service-enable fields set to true and `ManagementServer.EnableCWMP=true`; the modeled TR-369 agent enable differs between the two captures. These are snapshots, not universal defaults or proof that a service is listening, reachable or connected.

### What the schema comparison adds

The G6 HomeOS 24.04 `HJL.L91p01` schema contains **669 object templates and 5,461 parameter definitions**. Its export walker skips object subtrees marked with flag `0x02`: 5,186 definitions are in eligible subtrees and 275 in excluded ones. The [schema inventory](resources/configuration-model-inventory.csv) records the names, paths and flags without device values.

Every parameter-name/template-path pair in the examined G6 24.04 `HJL.L91p01` schema occurs in the examined Beacon 9 25.03 `JJM.K44p01` schema, which adds 109. Shared object flags and export-subtree classifications match. One shared parameter, WLAN `TotalAssociations`, has raw flags `0x80` in the 24.04 build and `0x81` in the 25.03 build; the [comparison CSV](resources/configuration-model-comparison.csv) records the difference without assigning that bit an unverified meaning. These are different hardware platforms as well as releases, so the comparison alone does not isolate the cause of each difference.

A definition is not necessarily an exported value or a usable feature. An instance must exist for its values to appear, several instances can expand one template into many records, and a schema field alone does not prove that a service implements it or accepts writes. The comparison does not cover every default, type or limit.

## What can be changed, and what remains outside this backup?

The record stream can express settings such as SSIDs and wireless security, LAN addressing and DHCP/DNS, WAN/PPP/VLAN/NAT configuration, firewall and forwarding rules, ACS settings and service-access fields. Some may not be exposed on the current WebUI page. Whether an edited value takes effect still depends on the model, driver, service, operator policy and related settings. **An edited restore was not tested in this investigation.**

Account values need their existing encoding or hash semantics respected. Management-model account objects are not copies of `/etc/shadow`, and changing a WebUI password does not automatically change a Linux account password. The [factory data investigation](../configuration-and-provisioning/README.md) and [credential investigation](../credential-reverse-engineering/README.md) explain those separate destinations.

The export is not a full flash backup. It does not archive arbitrary scripts or packages, the persistent overlay, firmware, U-Boot environment, raw RI/`SECURITY` records, Linux `passwd` and `shadow` files, or every file in `/configs`. Separate USP and mesh databases are not bundled as files merely because some related settings appear in the management model. Use the [storage and flash writeup](../storage-and-flash/README.md) when deciding what other captures are needed.

The router's own `/configs/dmdb_encryption.cfg` is another artifact, not an alternate name for the browser download. It has magic `0x124126` and uses the stored-database key10/CBC path rather than this export's GCM wrapper. Several saved databases have since been decoded using their verified profile inputs, including a specific old G6-A ROM capture; that does not make every older snapshot or WebUI export interchangeable. The [stored-database investigation](../stored-configuration-database/README.md) identifies the files and their limits.

## What happens when a backup is imported?

The CGI writes and syncs the uploaded file under `/tmp`, then calls `cfg_configFileToFlash2()`. The traced `cfgmgr` path checks the header and payload CRC, authenticates and decrypts the GCM payload, decompresses it, and passes the record stream to the database importer.

For an ordinary import, the password derivation uses the destination's local RI serial. The source-serial variant supplies `sl_num` instead: the code uppercases it and removes the first four characters if its length is exactly twelve. That changes only the serial input. The destination still uses its own key material, operator and mnemonic, and its configuration model must understand the records. An explicit source serial is therefore not a general cross-device compatibility switch.

The parser can add instances and assign attributes. It can also encounter missing nodes or failed assignments, and some per-record errors allow parsing to continue. Consequently, a valid GCM tag establishes authentication of the file, not that every proposed setting is supported or applied. Nor does a successful upload response, by itself, prove the resulting services work. The G6 CGI also has a `/configs/updtate_precfg_xml` marker branch; the browser's reboot request is separate from the import call.

With the correct inputs, plaintext records can be compressed and encrypted into a new container with a valid tag and header; this format does not require a separate vendor signing private key. That is a format result, not a live restore result. Keep the original backup and an independent recovery path before experimenting with settings that can affect access.

## Inspecting or repacking a backup offline

The project keeps the supplied original export, its decoded records and applicable key inputs under the ignored `config-private/` directory. Those files can contain credentials and device-specific values; they belong in private storage.

The [`beacon-config.py` tool](../../network-services/webui/scripts/beacon-config.py) implements the format used in this comparison. From the repository root, with Python's `cryptography` package and a private key-input file:

```sh
python3 network-services/webui/scripts/beacon-config.py inspect config-private/config_beacon_g6.cfg
python3 network-services/webui/scripts/beacon-config.py unpack config-private/config_beacon_g6.cfg \
  config-private/new-decoded.json --keys config-private/keys.json
```

The unpacked JSON is an array of record strings; JSON escaping preserves embedded newlines. After editing a copy while keeping the record structure, pack it into a **new** file:

```sh
python3 network-services/webui/scripts/beacon-config.py pack config-private/new-decoded.json \
  config-private/edited.cfg --keys config-private/keys.json
```

The tool refuses to overwrite an existing output and does not contact the router, import the file or reboot it. Its `--partial` mode accepts limited select/set operations while forbidding subtree clearing and instance creation; that still does not establish that the target firmware will accept the edit. The [service-provisioning analysis](../service-provisioning-from-superadmin/README.md) covers the source-serial path and its own test limits.

The [`read-config-key.c` helper source](../../network-services/webui/scripts/read-config-key.c) can query the stock APIs for another capture. Build it for the target's environment: the examined G6 24.04 `HJL.L91p01` uses ARM64 **glibc**, while the examined Beacon 9 25.03 `JJM.K44p01` uses musl. My later live G6 24.04 helper result matched the five inputs recovered from the earlier captures, including no nonempty key18 result, and those inputs authenticated the existing export. The helper JSON does not distinguish an empty value from a failed lookup.

## How the reconstruction was checked

Both real supplied exports authenticated and decrypted. Repacking each decoded stream with its original salt reproduced its complete original file byte for byte, checking the serialization, compression, encryption and header together. The original stock security library for each build also decrypted its corresponding export under QEMU; the G6 library authenticated a Python-repacked payload. Thirteen synthetic vector and format tests cover the libraries, corruption, wrong-key and limited partial-update cases.

Those tests validate the format and the examined input combinations. They do not demonstrate an edited import, cross-device restore or the effect of a restored setting. The [security-key map](../security-keys/README.md), [technical knowledgebase](../../knowledgebases/configuration-import-export.md) and [structured evidence](../../knowledgebases/configuration-import-export-evidence.json) retain the detailed derivations, source locations, private-artifact references and test boundaries.
