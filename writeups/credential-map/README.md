# Which credential opens which part of HomeOS?

A password that works in the WebUI may fail at a Linux login or the UART console. That can be surprising when both prompts say `superadmin`, or when the same serial cable exposes several prompts during a boot. The useful question is **which program is asking, and what does it check?**

This article is a map for identifying a prompt and understanding the effect of changing its credential. It does not publish device passwords or assume that privileged access to one interface unlocks the others. The main account observations are from Beacon G6 HomeOS 24.04 `HJL.L91p01`; comparisons with G6 HomeOS 24.02 `IJL.J03p01` and Beacon 9 HomeOS 25.03 `JJM.K44p01` are identified where relevant. Provisioning and account state can also differ between units.

## Start with the interface, not the username

| Where the prompt appears | Who checks it in the examined G6 24.04 firmware | What successful authentication provides |
| --- | --- | --- |
| WebUI `admin` | Web management authentication using the current Account data-model credential | The normal WebUI, subject to its role policy |
| WebUI `superadmin` | Web management authentication using the current WebAccount credential | The privileged WebUI, subject to its role policy |
| Linux account login | Linux authentication using the relevant account's verifier in `/etc/shadow` | That account's configured UID, groups and login shell, if the service permits login |
| `NOKIA > en` | The pre-Linux U-Boot gate, using `EXT_BOOT_PWD` when populated or a fallback path | The full `VENUS#` bootloader prompt |
| `Cortina# shell` / `Password2` | Nokia's Linux `sec_cli` signature verifier | An authorized Linux shell through that CLI path |

A reachable service and permission to use an account are additional conditions. An account with UID 0 does not prove that SSH is enabled, that remote login is allowed or that its password will pass another prompt. The [stock access-control writeup](../stock-access-controls/README.md) covers the service side.

## Why two accounts can share a name but not a password

I changed the G6 HomeOS 24.04 WebUI `superadmin` password and compared the stored values. The new password verified against the mutable WebUI `WebAccount.Password` field. The WebUI preset and Linux `superadmin` shadow entry remained equal to the factory `EXT_WEB_MGNT_PWD` verifier.

That result explains why a successful browser password change did not also change the Linux login. A factory verifier can initially be copied into multiple destinations; later, the current WebUI field and the Linux account can change independently. This is the observed path and state on the examined unit, not a promise about every password-changing mechanism. [Factory data and provisioning](../configuration-and-provisioning/README.md).

The ordinary `cfgcli` display masks password fields. A masked result is not the stored hash or proof that two hidden fields match. Keep any raw verifier, exported configuration or credential private.

## UART can present two different checks

The UART is a communication channel, not an account. During boot it can present the restricted `NOKIA >` prompt; after Linux starts it can present the `Cortina#` CLI. These belong to different programs.

At `NOKIA >`, the examined G6 bootloader compares a transformed candidate with the stored `EXT_BOOT_PWD` verifier when that field is present. Its fallback is a separate branch; reconstructing a fallback candidate does not mean that branch was used on a device with a stored verifier. Successful `en` authentication reaches U-Boot, before Linux.

At `Cortina#`, `shell` invokes the Linux `sec_cli` path and requests `Password2`. In the examined G6 24.04 build, this is an ECC signature check over the local `keysrc1` message, using a public key in the firmware. It is not a Linux shadow-password check. The stock private signing key was not recovered. The [boot and console investigation](../boot-and-console/README.md) follows both gates and their test limits.

There is also a [stock U-Boot recovery route](../uart-recovery-from-uboot/README.md): with full U-Boot access, the tested G6 24.04 stock image was booted into a PID 1 shell. That route changes the initial Linux process; it does not change the normal `Password2` verifier.

## Linux privilege is not the same as interface access

On the examined G6 24.04 unit, Linux `ONTUSER` and `superadmin` both had UID 0, but their configured login shells differed: `/bin/sh` and `/usr/bin/vtysh`, respectively. UID identifies the process's Linux user privilege; the account name, primary group, login shell and service policy are separate properties.

For a basic inventory on a device you already administer, account metadata can be inspected without printing password hashes:

```sh
grep -E '^(ONTUSER|superadmin):' /etc/passwd
id
```

The existence of a Linux account does not establish its credential on another build. The G6 HomeOS 24.04 and Beacon 9 HomeOS 25.03 account-writer paths differ, despite some shared schema names. The [credential investigation](../credential-reverse-engineering/README.md) records the build-specific evidence and provisioning limits.

A custom development Telnet service can be configured differently from stock, including without a login check. Its presence or absence describes that installation; it is not evidence of a default stock backdoor.

## What a change actually changes

| Action | Direct target | Do not infer |
| --- | --- | --- |
| Change the WebUI `superadmin` password through its normal setter | Current WebUI management credential | That Linux shadow, the factory preset or U-Boot verifier also changed |
| Change a Linux account password | That account's Linux verifier | That WebUI authentication or `Password2` changed |
| Change `EXT_BOOT_PWD` through the supported record workflow | The bootloader's stored `en` verifier | That Linux or the WebUI changed |
| Replace a runtime `Password2` verification component on a development unit | The selected Linux CLI verification path | That Nokia's private signing key was recovered or the bootloader was replaced |

Changing a verifier and changing the underlying service's access policy are different operations. A credential can be valid while the interface is disabled or blocked, and a setting can persist differently across reboot, reset or a bank change. The [WebUI password tutorial](../../tutorials/set-webui-superadmin-password/README.MD), [U-Boot tutorial](../../tutorials/unlock-uboot-en-console/README.MD) and [UART shell tutorial](../../tutorials/unlock-uart-root-shell/README.MD) describe their respective tested scopes.

The [research knowledgebase](../../knowledgebases/password-reverse-engineering.md) retains the source traces and negative results; the [security-key inventory](../security-keys/README.md) explains security materials used by individual consumers.
