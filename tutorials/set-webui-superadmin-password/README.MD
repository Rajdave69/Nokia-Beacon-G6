# Setting the WebUI's superadmin password


## Introduction

The Nokia Beacon G6 (and likely other Beacon routers') firmware has a privileged WebUI account named
`superadmin` (may differ based on operator code; VOQA ONTs use `AdminGPON`). The same user also exists 
as a Linux account on the router. On the firmware analyzed for this repository, they are not the same credential.

The WebUI authentication database contains a mutable password field for `superadmin`. The linux account, 
meanwhile, remains tied to a separate factory/preset password hash. Changing one does not automatically
change the other.

Initially, both passwords use the same factory verifier on the examined firmware. We have not found a
working generator for its original plaintext. You can read the stored verifier through the raw API,
but that does not reveal the password you would type. To choose a known password, set a new one.

This tutorial shows how to change only the **WebUI** superadmin password by replacing the hash
stored in the configuration database. It does not modify `/etc/shadow`, the factory preset credential, 
or the Linux superadmin password.

In the configuration database, the mutable WebUI password lives at:
```
InternetGatewayDevice.X_Authentication.WebAccount.Password
```

The factory provisioned hash lives at:
```
InternetGatewayDevice.X_Authentication.WebAccount.PresetPassword
```

We will be modifying only the former.


### What you will do:
1. Choose a new WebUI password that meets the current policy
2. Give the plaintext to `cfgcli`, which runs the stock password callback
3. Verify a fresh WebUI login and save the change
4. Optionally restore the preset verifier using the undo section below

### What you need:
1. An existing privileged UART/shell session on your router


## Steps

### 1. Confirm the command syntax

```sh
cfgcli -h
```

The examined HJL.L91p01 build supports `-s PATH VALUE`, `-f` and
`--save-flash-now`. Put the flags before the path and value. `-f` forces a
parameter write; it does not skip the account's password-policy callback.

## 2. Choose a password that satisfies the current policy

In our saved BOQA G6 configuration, the password must contain 8–24 characters,
use at least two character classes, and start with a letter or digit. The
allowed characters are letters, digits and:

```text
!#+,-./:=@_
```

The dollar sign is not allowed. These are captured configuration values, not a
promise that every operator or future firmware uses the same policy. You can
read the current rule object without reading an account password:

```sh
cfgcli -g 'InternetGatewayDevice.DeviceInfo.X_CT-COM_ServiceManage.PasswordRule.Enable'
cfgcli -g 'InternetGatewayDevice.DeviceInfo.X_CT-COM_ServiceManage.PasswordRule.MiniLenRule'
cfgcli -g 'InternetGatewayDevice.DeviceInfo.X_CT-COM_ServiceManage.PasswordRule.MaxLenRule'
cfgcli -g 'InternetGatewayDevice.DeviceInfo.X_CT-COM_ServiceManage.PasswordRule.IllegalCharRule'
```

The saved rules describe rejected patterns: `^.{0,7}$` rejects short passwords,
`^.{25,}$` rejects long passwords, and `[^a-zA-Z0-9!#+,-./:=@_]+` rejects characters
outside the allowed set.

## 3. Set the plaintext password

Replace the example below with your own new plaintext password:

```sh
cfgcli --save-flash-now -f -s 'InternetGatewayDevice.X_Authentication.WebAccount.Password' 'YourNewPass42!'
```

Single quotes preserve the value exactly. The intended value is the password
you will type into the WebUI, not a string beginning with `$5$`.

The setter should report success. The stock WebAccount callback checks the
password rules and then calls `sec_update_pwd()` to produce the stored verifier.
This route is established by tracing the saved HJL firmware. The owner reported
the failed hash commands; a successful execution of the corrected plaintext
command on the owner's router has not yet been reported.

## 4. Save and verify

`--save-flash-now` requests an immediate configuration save as part of the
setter operation. `sync` only flushes pending filesystem writes; it cannot make
a rejected setter succeed or independently commit cfgmgr's in-memory database.

Keep your shell session open while testing a fresh WebUI login as `superadmin`
with the new plaintext password. Once login works and the save has completed,
a later reboot can verify persistence. Do not reboot to try to fix a command
which still reports `failed`.



## Undoing the change: restore the preset password

The original factory/preset verifier is still stored in:

```text
InternetGatewayDevice.X_Authentication.WebAccount.PresetPassword
```

Undoing the WebUI change means copying that actual verifier back to `WebAccount.Password`. It does not 
require knowing its plaintext. However, logging in afterward requires the original password; restoring 
its hash does not reveal it.

`cfgcli -g` masks the preset, so copying its displayed output would copy the mask instead of the credential.
Also, sending a hash through the normal setter can fail the plaintext password rules described above.

The included [restore-webui-superadmin](restore-webui-superadmin) helper reads the unmasked value through 
stock `libcfg.so`'s `cfg_GetParamValueByUri()` API. It accepts only the compact `$5$` or `$1$` verifier 
forms supported here, restores only the mutable `Password` field, and checks that the live value matches 
afterward. It does not modify `PresetPassword`, factory SECURITY, or `/etc/shadow`.

### 1. Copy and check the helper

Transfer `restore-webui-superadmin` to `/tmp/restore-webui-superadmin` on the G6, then run:

```sh
chmod 700 /tmp/restore-webui-superadmin
LD_LIBRARY_PATH=/usr/lib:/lib /tmp/restore-webui-superadmin --check
```

`--check` only reads the account fields. It reports whether a supported preset is available and whether the
current WebUI verifier already matches. It does not print either hash. Running the helper without an option 
also performs this read-only check.

### 2. Restore the preset verifier

Keep the existing root shell open and run:

```sh
LD_LIBRARY_PATH=/usr/lib:/lib /tmp/restore-webui-superadmin --restore
```

For this specific restoration, the helper invokes `cfgcli` with `--no-rts`, `--save-flash-now`, `-f`, and the 
actual preset verifier as the value of `WebAccount.Password`. `--no-rts` skips the normal account callback, so
an already formed verifier is copied directly instead of being checked as a new plaintext password. This is 
an exception for restoring an existing hash; keep using the normal plaintext setter when choosing a new password.

The helper requests an immediate flash save and then reads both fields again. Success means the current WebUI 
verifier matches the preset and the preset itself has not changed. A command failure or readback mismatch is 
reported as failure; do not assume that a failed readback proves nothing changed.

### 3. Verify the restored login

Test a fresh WebUI login as `superadmin` with the original password. Keep the root shell open until this succeeds. 
A later reboot and login can confirm persistence; live readback alone does not prove that a reboot will retain it.

This setter's [source](restore-webui-superadmin.c), build instructions and local verification 
scope are retained with the [credential writeup resources](../../writeups/credential-reverse-engineering/resources/webui-password-restore/README.md).

--- 

### Why `cfgcli -g` may not show the hash

If you run:
```shell
cfgcli -g 'InternetGatewayDevice.X_Authentication.WebAccount.Password'
```

It will likely give you a masked value such as `******`

This is presentation-layer masking and does not mean the write failed. During the reverse-engineering work, 
the underlying raw value was confirmed through `libcfg.so`'s `cfg_GetParamValueByUri()` API.

--- 

### What _not_ to modify

- Do not write to `InternetGatewayDevice.X_Authentication.WebAccount.PresetPassword`
- Also, Don't modify the factory SECURITY field `EXT_WEB_MGNT_PWD`

On the firmware analyzed here, those values are part of the factory credential path and are also 
related to the Linux superadmin account.

---