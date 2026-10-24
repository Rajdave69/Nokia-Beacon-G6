# Following the Beacon G6's factory data and password stores

## A password appeared in three places. Which was the original?

The configuration system became interesting when I compared the privileged WebUI `superadmin` account with the Linux `superadmin` account. Both were be called `superadmin`, and both initially appeared to use the same factory credential. After changing the WebUI password, however, the Linux account didn't accept the new value. That suggested the router was not maintaining one single password shared across all interfaces.

The natural approach would be to inspect `/etc/shadow`, but it only tells us what Linux currently verifies. It does not explain from where the factory value originated, whether a different program has copied it, or which branch an operator's preconfiguration rules selected. To answer those questions, we had to map several separate stores.

## Four stores, not four spellings of the same file

The examined firmware exposed device identity through an **RI** interface, factory security information through a logical **`SECURITY` object in `extfs`**, current management settings through a **data-model database**, and Linux login credentials through **`/etc/passwd` and `/etc/shadow`**. These hold overlapping concepts but are not aliases.

| Source                                | What we found there                                                      | Main consumer                                 |
|---------------------------------------|--------------------------------------------------------------------------|-----------------------------------------------|
| RI / device identity                  | `G984Serial`, programming date, operator ID, label code, hardware fields | Provisioning and selected generators          |
| `extfs` → `SECURITY`                  | `EXT_BOOT_PWD`, `EXT_WEB_PWD`, `EXT_WEB_MGNT_PWD`, variable fields       | Bootloader, provisioning, management defaults |
| `InternetGatewayDevice...` data model | Current WebUI password and factory preset password in distinct fields    | WebUI/configuration services like TR-069      |
| `/etc/passwd` and `/etc/shadow`       | Linux account identity and final password hashes                         | Linux login/authentication                    |

A factory hash can be read from the first or second store, copied into the third, and eventually installed into the fourth. If the WebUI later rotates only its current password, the other copies need not change.

## Finding the physical storage without mistaking it for a file

The raw NAND table contained a partition named `RI` and another named `extfs`. The latter was `mtd9` on the unit analyzed. We initially wanted to inspect `EXT_WEB_MGNT_PWD`, but it was not a normal plaintext file named `EXT_WEB_MGNT_PWD` and was not safe to locate by searching for a string and writing to its guessed raw NAND offset.

The crucial finding was `/usr/lib/libextfs.so`, which exported logical record functions such as `extfs_get()` and `extfs_set()`. We wrote a read-only helper against this interface, requested the record named `SECURITY`, and parsed its serialized fields. The retrieved logical object was 8192 bytes. The successful parse showed an operator ID and several password-related fields, including `EXT_WEB_PWD`, `EXT_WEB_MGNT_PWD`, `EXT_BOOT_PWD`, and variables such as `EXT_MD5_VAR` and `EXT_SHA256_VAR`.

Before working with raw flash on a different unit, identify the named partition from that unit's own table:

```sh
cat /proc/mtd
grep '"extfs"' /proc/mtd
```

The existence of a logical API mattered. It meant that experiments could operate at the level of named records, with backups and readback, instead of assuming that an arbitrary MTD file offset was stable across builds.

## Why the field suffix `PWD` was not enough

The values in `SECURITY` did not all mean “a password in plaintext.” On the examined unit `EXT_WEB_PWD` and `EXT_WEB_MGNT_PWD` were Linux-style SHA-256-crypt hashes recognizable by the `$5$` prefix. By contrast, `EXT_BOOT_PWD` was a twelve-character value: U-Boot treated it as the first twelve Base64 characters of a SHA-256 digest of the entered `en` password.

The significance came from comparing the *consumers*, not the labels. The `EXT_WEB_PWD` (WebUI admin account) hash verified against the unit's label code, while `EXT_WEB_MGNT_PWD` matched the Linux `superadmin` shadow entry and the WebUI's **preset** password field. That three-way equality was our first strong evidence that the factory management hash was being copied into multiple destinations.

Another possible field, `EXT_DBG_PWD`, was referenced by the account-update logic as a provisioned debug-password override but was **absent in the captured SECURITY record**. The absence was important later when the firmware-version-derived Linux `ONTUSER` password matched the live shadow hash.

Following that reader further revealed another condition: `InternetGatewayDevice.DeviceInfo.X_CT-COM_ServiceManage.DebugRnPassEnable`. The G6's `cfgUtlAddDebugUser()` first generates the version-derived password and recreates ONTUSER, then checks this flag. When it is false, the generated credential remains. When it is true, the routine attempts to read `EXT_DBG_PWD` and replaces the ONTUSER hash in `/tmp/shadow` if the value is usable. An absent or invalid field leaves the generated entry in place.

The flag therefore controls the factory-override attempt, rather than whether the G6 creates the account. Its schema default is false; the similarly named `LimitAccount_ONTUSER` defaults to true. Both defaults also appear in the examined Beacon 9 image, even though that build's normal debug-account updater is a no-op. A schema field and a provisioned hash are only useful to this credential path if the account writer actually consumes them. The [credential investigation](../credential-reverse-engineering/README.md#the-flag-that-controls-the-factory-override) follows that comparison and its limits.

## The preconfiguration file that seemed to contradict the hashes

The firmware contained `preconfiguration_global.xml`, but it could not be read as ordinary XML directly from its stored representation: the resource was encrypted and compressed. Once decoded, it exposed operator-specific defaults, including an account-generation policy for the BOQA branch.

That branch enabled a setting spelled `KeepLablePassword` in the firmware, mapped through an `AccountKeepLablePwd` option. It also contained descriptions of the WebUI `admin` and `superadmin` accounts and a `genpwd_longpasswd` rule. At first this seemed to imply that the normal generator was the source of the active account hashes. We tested the generic management generator against the real firmware and found that its results did not match those hashes.

The missing piece was control flow. The corresponding handler in `libdbgen.so` **bypassed ordinary regeneration when `KeepLablePassword` was true** and instead selected the factory fields from the `SECURITY` object. The XML was not lying, and the generator was not broken: we had initially read a possible rule without checking which runtime branch the operator enabled.

This is the reason the exact operator ID matters. The same compiled binary can contain branches for multiple providers; the branch that exists in a disassembly is not necessarily the one this device executes.

## Proving that the WebUI had a current and a preset value

The important data-model paths were `InternetGatewayDevice.X_Authentication.WebAccount.Password` and `InternetGatewayDevice.X_Authentication.WebAccount.PresetPassword`. The former was mutable; the latter held a factory/preset verifier on the examined build. The ordinary `cfgcli -g` output for password fields was masked, which initially obscured that distinction.

We built a read-only diagnostic calling `cfg_GetParamValueByUri()` from `libcfg.so` rather than relying on `cfgcli`'s displayed string. It showed that the current WebUI hash had changed to a new SHA-256-crypt value after password rotation. The preset remained identical to `EXT_WEB_MGNT_PWD` and Linux `/etc/shadow` for `superadmin`.

Independent verification of the new WebUI plaintext against the mutable hash confirmed that the browser's new password was indeed stored there. Yet the Linux account retained the factory verifier. This was decisive evidence for **two credential paths**, rather than a password change that had somehow failed.

You can inspect the management tool's ordinary read behavior without exposing secrets:

```sh
cfgcli -h
cfgcli -g 'InternetGatewayDevice.X_Authentication.WebAccount.Password'
```

The masked output alone does not tell you the actual hash; it is an intentional presentation-layer limitation.

## The other security database: `sec.key`, `sedb.conf`, and `key14`

The firmware also had *encrypted security-engine configuration*, separate from the logical `extfs` record. Two files mattered: `/usr/etc/sec.key`, the static database, and `/tmp/sedb.conf`, the runtime database. The latter depended on `/tmp/secKeySrc.conf` values called `keysrc1` and `keysrc2`.

Decompilation of the security-engine routines uncovered the file format and derivation path. The examined container used a `0xff` marker, an eight-byte salt, AES-256-CBC ciphertext, and plaintext protected by a SHA-256 integrity check. The code derived decryption material using PBKDF2-HMAC-SHA256 and a short iteration count of 100 in the observed path. The static derivation used a firmware version source from `/usr/etc/se.conf`; the runtime derivation combined the key-source values, using a four-byte salt identified in the implementation as `key6`. The details were validated by successfully decrypting **both** databases and passing their integrity checks.

One particularly useful negative result was that the recovered `key14` material was the same in both decrypted files. We had suspected a mismatch between static and runtime keys might explain why a generic password generator disagreed with `/etc/shadow`. The matching plaintext ruled out that explanation for the examined unit.

`key14` itself contained 192 bytes: six 32-byte slots associated with MGNT, WLAN, OMCI, VTYSH, ONTUSER, and BLDR. Generic generators selected a slot, reversed the order of its eight 4-byte *words* (without reversing the bytes inside each word), combined the transformed data with an input seed, and applied digest/encoding/character rules. We reproduced these functions and then checked them against the real ARM64 library. This taught us how the generic generators worked, but not yet which ones controlled the active Linux accounts.

## Why `key2` is not another name for `key14`

The eventual Linux `ONTUSER` discovery used a different key mechanism. In `cfgmgr`, the debug-user routine constructed a seed from the image version and passed **no optional key** to `CS_getSha256Str()`. The security library then selected *deprecated key index 2*, an embedded 32-byte constant we call `key2`. It is not the ONTUSER slot of decrypted `key14`.

That distinction was central to resolving the original failed hypothesis. Both mechanisms exist in the firmware, and both can generate password-like text, but the account writer selected the second one. The [credential investigation](../credential-reverse-engineering/README.md) gives the complete chronology, including the independently verified `/etc/shadow` result.

## What we know, and what we still don't

We traced the factory `superadmin` **hash-storage and copying chain** through provisioning, SECURITY, the WebUI preset field, and Linux `/etc/shadow`. We did *not* identify runtime code that reconstructs the factory plaintext from the unit's serial number, MAC address, label code, or the tested generic management generator. Manufacturing-time generation is a plausible explanation, not a proven algorithm.

That unresolved step is why this documentation does not promise a factory `superadmin` password generator. The practical WebUI tutorial changes only the mutable data-model field, rather than pretending the factory hash can be reversed.

One interesting observation though was that a Beacon G6 and a Beacon 9, with the same operator codes but vastly different firmware versions had the same `root` user hash. This could suggest either a universal root password, or a per-operator root password. 

The broader conclusion is that the Beacon G6 has several layers of defaults and state, and the direction of copying matters. A precomputed field being read by a daemon is not proof that the daemon originally generated its plaintext. A change to a mutable copy is not a change to the factory source. Understanding these boundaries made the rest of the credentials understandable.

For the physical location of these records see [storage and flash](../storage-and-flash/README.md); for the exact interfaces they protect see [credential map](../credential-map/README.md).

## What the second factory record established

The [second-G6 comparison](../two-g6-key-comparison/README.md) verifies both factory admin hashes against their own label codes and finds different salted factory superadmin hashes. It also confirms the shared root template and shared key7_2/key14/key17 across the two current devices and older IJL.J03 firmware. The new sample supports the same source distinctions; it does not recover a factory superadmin plaintext generator.
