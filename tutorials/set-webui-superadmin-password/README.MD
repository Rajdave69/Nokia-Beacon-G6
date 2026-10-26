# Setting the WebUI's superadmin password

**Second-unit comparison (2026-10-22):** Both devices' factory admin verifiers match their own label codes, while their factory superadmin hashes and salts differ. Their BOQA account policy is unchanged across the two recovered G6 builds. See the [two-G6 comparison](../../writeups/two-g6-key-comparison/README.md).

## Introduction

The Nokia Beacon G6 (and likely other Beacon routers') firmware has a privileged WebUI account named
`superadmin`. The same user also exists as a Linux account on the router. On the firmware analyzed 
for this repository, they are not the same credential.

The WebUI authentication database contains a mutable password field for `superadmin`. The linux account, 
meanwhile, remains tied to a separate factory/preset password hash. Changing one does not automatically
change the other.

Initially, both the passwords are indeed the same. There lies no resolved generator path found in the 
router's files, so all evidence points to the fact that it was factory provisioned. Thus, you can't simply
read or re-generate the existing password; you must set it to something new.

This tutorial shows how to change only the **WebUI** `superadmin` password by replacing the hash
stored in the configuration database. It does not modify `/etc/shadow`, the factory preset credential, 
or the Linux `superadmin` password.

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
1. Choose a new WebUI password
2. Generate a standard SHA-256-crypt hash for it
3. Write that hash to the WebUI password field with `cfgcli`
4. Reboot and log in to the WebUI with the new plaintext password.

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
