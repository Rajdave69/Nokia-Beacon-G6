# One router, several passwords: mapping the Beacon G6 authentication paths

## How the confusion started

The router had an `admin` login in the browser, a `superadmin` login, a Linux account also called `superadmin`, another Linux account called `ONTUSER`, a password prompt at `NOKIA > en`, and a `Password2` prompt after `Cortina# shell`. It would be tempting to look for a master password that controls all of these. Our tests showed why that assumption breaks down.

The most revealing experiment was simple: after changing the **WebUI** `superadmin` password, the browser accepted the new plaintext, but the **Linux** `superadmin` account did not. We traced the values and discovered that the mutable WebUI hash had changed while the factory preset hash and the Linux shadow hash still agreed. This document starts with that observation and shows how the other credential paths fit around it.

Before continuing, remember that the router passes through several separate environments. U-Boot is firmware running before Linux; `Cortina#` is a user-space routing CLI after Linux boots; `/bin/sh` is a Linux shell; and the WebUI is an application client of the configuration system. Sharing a username or serial cable does not make their authentication mechanisms identical.

## The account map we established

| Interface                         | Account or prompt              | Verifier on the examined firmware                                         | Consequence of successful authentication         |
|-----------------------------------|--------------------------------|---------------------------------------------------------------------------|--------------------------------------------------|
| Browser WebUI                     | `admin`                        | Current `X_Authentication.Account.Password` data-model hash               | Normal management interface                      |
| Browser WebUI                     | `superadmin`                   | Mutable `X_Authentication.WebAccount.Password` hash                       | Privileged WebUI interface                       |
| Linux login                       | `ONTUSER`                      | SHA-256-crypt entry in `/etc/shadow`                                      | UID 0 account configured for `/bin/sh`           |
| Linux login                       | `superadmin`                   | Factory/preset SHA-256-crypt entry in `/etc/shadow`                       | UID 0 account configured for `/usr/bin/vtysh`    |
| Bootloader, before Linux          | `NOKIA > en`                   | `EXT_BOOT_PWD` verifier from `extfs` `SECURITY`                           | Full `VENUS#` U-Boot prompt                      |
| UART after Linux starts           | `Cortina# shell` / `Password2` | ECC signature checked by `sec_cli`                                        | Authorized launch of a Linux shell               |
| Optional custom development setup | TCP/2323 Telnet                | No login verifier *if the author deliberately installs that modification* | Direct development shell; **not stock behavior** |

The precise service configuration matters: a Linux account existing with UID 0 does not imply that SSH is enabled or allows that account to log in. A valid password and a reachable login service are separate requirements.

## The experiment that separated the two `superadmin` accounts

First, we extracted the factory `SECURITY` record through `libextfs.so`. The field `EXT_WEB_MGNT_PWD` held a SHA-256-crypt hash. That exact hash appeared in the Linux `superadmin` shadow entry. In the data model it also appeared at `InternetGatewayDevice.X_Authentication.WebAccount.PresetPassword`.

Next we changed the WebUI `superadmin` password and read the stored values again. The normal `cfgcli` display masked password fields, so the comparison required a read-only diagnostic using `cfg_GetParamValueByUri()` in `libcfg.so`. It showed that `WebAccount.Password` now held a different hash while `PresetPassword` and the Linux shadow value remained unchanged. The new plaintext verified against the first but not the others.

That is why the [WebUI password tutorial](../../tutorials/set-webui-superadmin-password/README.MD) changes only the mutable `WebAccount.Password` field. It neither promises nor attempts to rotate Linux's factory `superadmin` credential.

## Why `ONTUSER` was a different discovery

`ONTUSER` looked like another factory account. The installed `/etc/passwd` entry had UID 0, GID 102, and `/bin/sh`. Its shadow entry used SHA-256-crypt like the Linux `superadmin` account, but the *source* of its plaintext was different.

We first reconstructed the generic `gen_varlen_ontupw()` function using security-database key material and a serial-based seed. The reconstructed output matched a genuine call to the ARM64 function but failed against the installed ONTUSER hash. Searching for the code that **wrote the account** then led us to `cfgmgr` and its version-derived debug-user routine. It combined an `IMAGEVERSION` release code with built-in deprecated `key2` material from `libsec_engine.so`. The resulting candidate matched the shadow hash exactly.

We also discovered that the account-update code recognizes an optional `EXT_DBG_PWD` factory override, selected through `InternetGatewayDevice.DeviceInfo.X_CT-COM_ServiceManage.DebugRnPassEnable`. The G6 creates ONTUSER with the generated password first, then tests the flag before attempting the override. A false flag therefore leaves the generated credential in place; it does not disable account creation. We did not observe `EXT_DBG_PWD` on the examined unit. A different configuration could enable the flag and supply a usable factory hash, so the version algorithm does not guarantee universal login.

A comparison with the newer Beacon 9 firmware made that limit more concrete. Its version-derived generator and selected key2 bytes remained, but the normal boot and settings-change callers reached a no-op instead of the working G6 account creator. Both images retained the same defaults for `DebugRnPassEnable` and `LimitAccount_ONTUSER`. The difference was established by following the account writer, not by either setting's name or the presence of the generator.

The full sequence, including the failed hypothesis, is documented in [the credential investigation](../credential-reverse-engineering/README.md).

## Why `Password2` is not another Linux password

At `Cortina#`, the `shell` command passes to the `sec_cli` security utility and requests `Password2`. Inspecting that path showed that the stock firmware verifies a Base64-encoded ECC signature over the router's `keysrc1` string, with SHA-256 and a public key in `/usr/etc/ecc_pub.pem`. The original private signing key was not present in the examined runtime filesystem.

An ordinary Linux password hash answers whether a typed plaintext matches a saved verifier. The UART signature check instead answers whether an appropriate private signing key authorized a particular device-specific message. No amount of reading `/etc/shadow` explains `Password2`, and replacing the ECC public key does not change a Linux user's password. The [boot and console writeup](../boot-and-console/README.md) follows the discovery of this mechanism.

## U-Boot's `en` gate uses a short verifier in flash

The pre-Linux `NOKIA >` interpreter accepts an `en` command. In the active branch we traced, U-Boot retrieves `EXT_BOOT_PWD` from the `SECURITY` record and compares it with the first twelve Base64 characters of the SHA-256 digest of the typed candidate. This is a different transformation and storage location from the Linux `$5$` hashes.

We also recovered a BLDR-derived fallback routine, but its candidate did not unlock the examined router because the factory `EXT_BOOT_PWD` value was present. That experiment is useful precisely because it prevents treating the fallback as the default. Changing this verifier affects the U-Boot gate, not `ONTUSER`, `Password2`, or the browser accounts.

## A short key glossary, with evidence

The firmware uses similarly named values that have different jobs. `key14` was recovered by decrypting the static and runtime security databases; it consisted of six 32-byte slots used by generic password generators. `key2` was a separate 32-byte constant compiled into `libsec_engine.so`; the actual Linux `ONTUSER` routine selects it because its call to `CS_getSha256Str()` supplies a null optional key. `EXT_DBG_PWD` is a potential provisioned password-hash override, not an embedded key. `EXT_WEB_MGNT_PWD` is the factory management hash that matched the Linux `superadmin` and WebUI preset verifiers.

The names are unfortunate, but the role of each value is established by the code that consumes it. This distinction prevented an entire branch of incorrect password derivations.

## Privilege level is not a prompt name

A Linux process's **UID** and **GID** are independent. Both `ONTUSER` and Linux `superadmin` had UID 0 on the examined unit, even though neither was literally named `root`. `ONTUSER` used GID 102 (`wheel`) as its primary group. This distinction explains why the author's optional development Telnet setup explicitly requested UID **and** GID 0. It does not mean that setting GID 0 is required for every privileged Linux operation.

For basic account inventory, without disclosing password hashes:

```sh
grep -E '^(ONTUSER|superadmin):' /etc/passwd
id
```

For configuration-path inspection, without assuming the output will reveal a hash:

```sh
cfgcli -h
```

## Putting the findings together

The unifying lesson is that the G6 has multiple **sources** of credentials and multiple **verifiers**. A factory field can be copied into Linux and into a WebUI preset; a current WebUI field can subsequently change; a debug user can use a version-derived password; U-Boot can check its own truncated digest; and a support shell can demand a signature.

Before changing or generating any credential, ask two questions: which program accepts this login, and where does it obtain the value it checks? The other writeups answer those questions step by step instead of treating every privileged prompt as a route to the same password.

## Second-unit comparison

The [two-G6 comparison](../two-g6-key-comparison/README.md) separates unit-specific factory records and Password2 messages from shared current-build ONTUSER calculations, root templates and configuration key7_2. It also traces the older IJL.J03 slot. A shared key or account name still does not merge these credential paths.
