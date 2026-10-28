# Setting your own UART root shell

## Introduction

When you boot into Linux, the Nokia Beacon G6 does not directly present a conventional root shell 
on UART. Instead, the serial session lands in a restricted Quagga/vytsh command line:

```
Cortina#
```

It includes basic commands like ping, traceroute, etc. To access true root shell, you have to 
run the command `shell`. After doing so, vytsh launches Nokia's `sec_cli` utility, which asks for 
a second credential called `Password2`

On the firmware analyzed for this project, Password2 is not a normal stored password, and neither is 
it a verifier (like the password used to access U-boot). It is an ECC signature token tied to the
router's `keysrc1` value, which is the 8-character G984 serial on the examined unit.


The stock path is:
```text
Cortina# shell
        |
        v
sec_cli startshell <parent-name>
        |
        v
read /tmp/secKeySrc.conf -> keysrc1
        |
        v
Password2 token
        |
        v
SE_verifyEccSignStr(
    message = keysrc1,
    token   = Password2,
    pubkey  = /usr/etc/ecc_pub.pem
)
        |
        +---- valid ----> /bin/sh
        |
        +---- invalid --> failure
```


The stock public key uses the binary-field curve `sect131r2` and the verification path hashes the 
message with SHA-256. The token is transported as Base64.


The router contains the **public** verification key, but the corresponding Nokia private signing 
key was not found in the examined firmware. This tutorial therefore shows two ways to take control 
of Password2 on your own router. There are two methods:

1. Normal method: replace the verification public key with your own key and generate valid ECC 
tokens.  
   This preserves the stock authentication architecture.
2. Overlay-binary method — replace only the runtime `sec_cli` path with a small development wrapper 
that checks a plaintext Password2 stored under `/configs`.  
   This is simpler for development, but deliberately removes the cryptographic-token design. 

The overlay method is convenient for development, but the public-key method retains the original signature-based authentication. The persistence instructions below use the `HJL.L91` early startup hook; older `IJL.J03` does **not** have that caller. For cross-bank use, follow the [late-hook migration](../setup-startup-across-firmware-banks/README.md) after setting up your chosen method.


### What you will do:

For the normal method:

1. Read the router's `keysrc1`
2. Generate your own `sect131r2` key pair
3. Sign `keysrc1`
4. Convert the normal DER ECDSA signature into Nokia's Password2 format
5. Test it with stock `sec_cli`
6. Replace `/usr/etc/ecc_pub.pem`
7. Use the persistent startup hook so the replacement survives reboot

For the overlay method:

1. Choose a plaintext Password2
2. Store it in `/configs/debug/password2.txt`
3. Install the supplied AArch64 `sec_cli_password2_overlay`
4. Verify that non-`startshell` commands still delegate to `/sbin/secmulti`
5. Make the overlay persistent through the startup hook


### What you need:

1. Enabled UART console ([if not](../enable-uart-console/README.MD))
2. An existing privileged Linux shell on the router
3. A trusted computer with OpenSSL and Python3
4. A way to transfer files to `/tmp` on the router (ncat perhaps)
5. The included helper:
   `./password2_token_from_der.py`
6. For the overlay method, the included binary:
   `./sec_cli_password2_overlay`

> [!note]
> The two methods are alternatives. You do not need both. The ECC-key method is closer to 
the stock design; the overlay method is more convenient.

## Method A: keep the normal ECC Password2 mechanism


### 1. Read `keysrc1`

On the router:

```shell
cat /tmp/secKeySrc.conf
```

The analyzed unit contained:

```text
keysrc1 = fde2f68c
keysrc2 = 250424
```

Extract just `keysrc1`:

```shell
KEYSRC1="$(sed -n 's/^[[:space:]]*keysrc1[[:space:]]*=[[:space:]]*//p' /tmp/secKeySrc.conf | head -n1)"
printf 'keysrc1=<%s>\n' "$KEYSRC1"
printf 'length=%s\n' "${#KEYSRC1}"
```

For the examined router the expected length is 8.

> [!caution]
> Sign the exact `keysrc1` string. Do not add the `ALCL` GPON vendor prefix and do not append a newline.



### 2. Back up Nokia's original public key

On the router:

```shell
mkdir -p /configs/debug

cp -L /usr/etc/ecc_pub.pem /configs/debug/ecc_pub.nokia-original.pem

sha256sum \
    /usr/etc/ecc_pub.pem \
    /configs/debug/ecc_pub.nokia-original.pem

sync
```

Keep this backup. It is your easiest way to return to the original Password2 verifier.


### 3. Generate your own ECC key pair

On your trusted computer:

```shell
openssl ecparam \
    -name sect131r2 \
    -genkey \
    -noout \
    -out password2_private.pem

openssl ec \
    -in password2_private.pem \
    -pubout \
    -out password2_public.pem

chmod 600 password2_private.pem
```

Inspect the key:

```shell
openssl ec -in password2_private.pem -text -noout
```

You should see:

```text
ASN1 OID: sect131r2
```

> [!caution]
> `password2_private.pem` is now the signing authority for your custom Password2 setup. 
Do not copy it to the router. Keep it on your trusted computer.



### 4. Sign the router's `keysrc1`

Set the same value you read from the router:

```shell
KEYSRC1='fde2f68c'
```

Create a normal OpenSSL ECDSA/SHA-256 signature:

```shell
printf '%s' "$KEYSRC1" |
    openssl dgst \
        -sha256 \
        -sign password2_private.pem \
        -out password2.der
```

OpenSSL writes a normal ASN.1/DER ECDSA signature. Nokia's verifier expects a different binary 
layout, so it cannot be Base64-encoded directly.

### 5. Convert the DER signature into Nokia's token format

The reconstructed decoded Password2 format is:

```text
1 byte       R length
R length     R magnitude bytes
remaining    S magnitude bytes
```

Then the entire byte string is encoded with normal Base64.

Use the included converter:

```shell
python3 resources/password2_token_from_der.py password2.der \
    > password2_token.txt

cat password2_token.txt
```

A valid token is normally around the size of:

```text
EQLuKJNJ6oa6d9WzCCcR5T7UAi1esXlA6gpZXCrX8Qvu+k4=
```

The exact output does not have to match this example. ECDSA signatures can differ 
between signing operations while still being valid.

### 6. Copy the public key and token to the router

Transfer (perhaps with ncat):

```text
password2_public.pem
password2_token.txt
```

to `/tmp` on the router.

Then:

```shell
chmod 644 /tmp/password2_public.pem

TOKEN="$(cat /tmp/password2_token.txt)"
KEYSRC1="$(sed -n 's/^[[:space:]]*keysrc1[[:space:]]*=[[:space:]]*//p' /tmp/secKeySrc.conf | head -n1)"

printf 'Testing token for keysrc1=%s\n' "$KEYSRC1"
```

### 7. Test your token before replacing the live public key

The stock `sec_cli` exposes an ECC-password verification subcommand.

Run:

```shell
sec_cli eccpwd \
    -s "$KEYSRC1" \
    -d "$TOKEN" \
    -c /tmp/password2_public.pem

echo "rc=$?"
```

A return code of `0` means your public key/token pair is accepted by the stock verifier.

Do not continue until this test succeeds.

### 8. Temporarily replace the live public key

On this firmware, `/` is a RAM-backed overlay over the read-only stock squashfs. 
Therefore, this copy is temporary until reboot:

```shell
cp /tmp/password2_public.pem /usr/etc/ecc_pub.pem
chmod 644 /usr/etc/ecc_pub.pem
```

Now return to the Quagga UART prompt and run:

```text
Cortina# shell
Password2:
```

Paste the Base64 token from `password2_token.txt`.

A successful token should enter the Linux shell.

### 9. Make your key persistent

Store the custom public key in persistent `/configs`:

```shell
mkdir -p /configs/debug

cp /tmp/password2_public.pem \
   /configs/debug/ecc_pub.password2.pem

chmod 644 /configs/debug/ecc_pub.password2.pem
sync
```

The stock boot sequence already contains a vendor hook that executes 
`/configs/debug/replace_with_test.sh` when that file exists and is executable.

Create or merge the following into the hook:

```shell
#!/bin/sh

if [ -s /configs/debug/ecc_pub.password2.pem ]; then
    cp /configs/debug/ecc_pub.password2.pem \
       /usr/etc/ecc_pub.pem

    chmod 644 /usr/etc/ecc_pub.pem
fi

exit 0
```

Then:

```shell
chmod 700 /configs/debug/replace_with_test.sh
sync
```

After reboot, verify:

```shell
sha256sum \
    /usr/etc/ecc_pub.pem \
    /configs/debug/ecc_pub.password2.pem
```

The hashes should match.

### 10. Generate a new token whenever needed

You do not need to generate a new key pair every time.

Keep:

```text
password2_private.pem
password2_public.pem
```

and sign the current `keysrc1`:

```shell
KEYSRC1='YOUR_CURRENT_KEYSRC1'

printf '%s' "$KEYSRC1" |
    openssl dgst \
        -sha256 \
        -sign password2_private.pem \
        -out password2.der

python3 resources/password2_token_from_der.py password2.der
```

If `keysrc1` changes, the old token will no longer verify, but the same custom key 
pair can be used to sign the new value.

---

---

## Restoring Nokia's original Password2 key

If you kept the backup:

```shell
cp /configs/debug/ecc_pub.nokia-original.pem \
   /usr/etc/ecc_pub.pem

chmod 644 /usr/etc/ecc_pub.pem
```

For a permanent restore, remove the custom-key block from:

```text
/configs/debug/replace_with_test.sh
```

or remove the custom public key:

```shell
rm -f /configs/debug/ecc_pub.password2.pem
sync
reboot
```

The stock squashfs copy will be visible again after reboot when nothing overlays it.

---

## Method B: use a  `sec_cli` overlay binary

### Why this method exists

The normal Password2 system is designed around a support-token model:

```text
private signing key -> token -> public-key verification on router
```

For a development router, generating a new ECDSA token whenever `keysrc1` changes 
can be unnecessary overhead.

The supplied `/sec_cli_password2_overlay` changes only the `startshell` behavior.

It does this:

```text
sec_cli startshell ...
        |
        v
read /configs/debug/password2.txt
        |
        v
Password2:
        |
        +-- matches --> exec /bin/sh as "-sh"
        |
        +-- mismatch -> Password2 invalid!
```

For every other invocation, it delegates unchanged to `/sbin/secmulti`.

This is important because the stock `sec_cli` is part of a multicall security utility 
and has commands other than `startshell`.

### 1. Choose your plaintext Password2

On the router:

```shell
mkdir -p /configs/debug

printf '%s\n' 'MyDevelopmentPassword' > /configs/debug/password2.txt

chmod 600 /configs/debug/password2.txt
sync
```

Use whatever development password you want.

> [!note]
> The supplied overlay reads the first line of `/configs/debug/password2.txt`, so changing 
Password2 later does not require rebuilding the binary.

### 2. Copy the overlay binary to the router

Transfer `/sec_cli_password2_overlay` to `/tmp/sec_cli_password2_overlay`, perhaps with ncat.

Then, run

```shell
chmod 755 /tmp/sec_cli_password2_overlay

ls -la /tmp/sec_cli_password2_overlay
```


### 3. Find the live `sec_cli` path

Run:

```shell
SEC_CLI="$(command -v sec_cli)"

printf 'sec_cli=%s\n' "$SEC_CLI"
ls -l "$SEC_CLI"
readlink -f "$SEC_CLI"
```

On the analyzed firmware `sec_cli` resolves into the Nokia security multicall arrangement.

> [!caution]
> Do not overwrite `/sbin/secmulti`. The overlay intentionally delegates other security commands 
to that stock binary.

### 4. Save a diagnostic copy of the stock binary

```shell
cp -L "$SEC_CLI" /configs/debug/sec_cli.stock.bin
chmod 600 /configs/debug/sec_cli.stock.bin
sync
```

This is not strictly required because the stock squashfs remains intact, but it is useful during 
development.

### 5. Install the overlay temporarily

Because `SEC_CLI` may be a symlink, remove the runtime pathname first:

```shell
rm -f "$SEC_CLI"

cp /tmp/sec_cli_password2_overlay "$SEC_CLI"

chmod 755 "$SEC_CLI"
```

Confirm:

```shell
ls -l "$SEC_CLI"
sha256sum "$SEC_CLI" /tmp/sec_cli_password2_overlay
```

### 6. Check delegation

A non-`startshell` command should still be handled by `/sbin/secmulti`.

For example:

```shell
sec_cli eccpwd 2>&1 | head
```

You should receive the stock `eccpwd` usage/error behavior rather than an error from the overlay.

### 7. Test Password2

If you already have UART, directly test it in the Quagga shell:

```text
Cortina# shell
Password2:
```

Else, if you have only SSH/Telnet access, you can call vtysh manually:

```shell
sec_cli startshell vtysh
```

Enter the exact line stored in `/configs/debug/password2.txt`, you should enter `/bin/sh`.

### 8. Make the overlay persistent

Store the helper:

```shell
cp /tmp/sec_cli_password2_overlay \
   /configs/debug/sec_cli_password2_overlay

chmod 700 /configs/debug/sec_cli_password2_overlay
sync
```

Add this block to `/configs/debug/replace_with_test.sh`:

```shell
SEC_CLI="$(command -v sec_cli 2>/dev/null)"

if [ -z "$SEC_CLI" ]; then
    for p in \
        /usr/bin/sec_cli \
        /usr/sbin/sec_cli \
        /sbin/sec_cli \
        /bin/sec_cli
    do
        if [ -e "$p" ]; then
            SEC_CLI="$p"
            break
        fi
    done
fi

if [ -n "$SEC_CLI" ] &&
   [ -x /configs/debug/sec_cli_password2_overlay ]
then
    rm -f "$SEC_CLI"

    cp /configs/debug/sec_cli_password2_overlay \
       "$SEC_CLI"

    chmod 755 "$SEC_CLI"
fi
```

Then:

```shell
chmod 700 /configs/debug/replace_with_test.sh
sync
reboot
```

After reboot:

```shell
SEC_CLI="$(command -v sec_cli)"

sha256sum \
    "$SEC_CLI" \
    /configs/debug/sec_cli_password2_overlay
```

The hashes should match.

---

### What is persistent in the binary-overlay method?

There are two copies of the helper with different lifetimes:

| File or change                                                                         | Lifetime                                                        |
|----------------------------------------------------------------------------------------|-----------------------------------------------------------------|
| `/configs/debug/sec_cli_password2_overlay`                                             | Stored helper on persistent data, while that volume is retained |
| `/configs/debug/password2.txt`                                                         | Stored password on the same persistent data                     |
| `/configs/debug/replace_with_test.sh` and, after migration, `/configs/pre_app_boot.sh` | Stored instructions that reinstall the runtime helper           |
| The replacement at the path returned by `command -v sec_cli`                           | RAM-overlay change; recreated by the script on each boot        |

The stock rootfs and `/sbin/secmulti` are not permanently patched by this method. Until the script has reapplied the helper after boot, the normal sec_cli path uses Nokia's stock Password2 verifier. This is Linux-side authentication, separate from U-Boot's en password.

On HJL.L91 the original early hook supplies the caller. For IJL.J03, use the [shared late-hook migration](../setup-startup-across-firmware-banks/README.md). That supplies a caller in both inspected banks, but actual older-bank login remains untested. If the selected data volume is erased, the hook is removed, or the CLI no longer invokes the replaced path, the overlay will not provide entry. A bootloader update does not move this helper into U-Boot or make it permanent.


---

### Changing the overlay Password2 later

Simply replace the file:

```shell
printf '%s\n' 'AnotherDevelopmentPassword' \
    > /configs/debug/password2.txt

chmod 600 /configs/debug/password2.txt
sync
```

The next `Cortina# shell` attempt will use the new value.

No binary rebuild is required.

---

### Removing the overlay method

Remove or comment out the `sec_cli_password2_overlay` block in:

```text
/configs/debug/replace_with_test.sh
```

Then remove the persistent development copy:

```shell
rm -f /configs/debug/sec_cli_password2_overlay
rm -f /configs/debug/password2.txt
sync
reboot
```

After reboot the stock `/usr/bin/sec_cli` path comes from the read-only firmware again.

---

### Which method should you use?

The normal method retains the firmware's original design:

```text
device value -> ECC signature token -> public-key verification
```

The overlay method intentionally simplifies it to:

```text
plaintext file -> string comparison -> shell
```

For a reusable research setup, the overlay is convenient. For studying the actual firmware behavior 
or preserving its support-token architecture, replace the ECC public key and generate proper tokens.

> [!warning]
> Both methods give shell access through a path that Nokia originally protected. Keep the private 
signing key, persistent overlay files, and `/configs/debug` permissions appropriate for your own 
development environment.

---

### Recovering when the Password2 overlay is missing

The [U-Boot UART recovery tutorial](../recover-uart-root-shell-from-uboot/README.md) now provides a live-tested alternative for the supplied rootfs0/current-kernel setup. It boots the existing stock FIT with init=/bin/sh, producing UID0/PID1 before Nokia's CLI starts. It requires the existing console/en entry, but does not require the Password2 helper, password file or startup hook to survive. Use that shell to inspect and restore the persistent arrangement for a subsequent normal boot. The partition-map setup in that tutorial is mandatory; do not use the crashing unset-state mtdparts listing. Older-bank boot and actual file restoration remain separately untested.

---

### Persistence across firmware banks and upgrades

**Neither method permanently patches the stock rootfs.** The custom public key (Method A) or helper and password file (Method B) live under persistent `/configs`; the copy at `/usr/etc/ecc_pub.pem` or the runtime `sec_cli` path lives in the RAM overlay and must be reinstalled after every reboot. A retained file does not prove its startup hook executed. The separate UART `console` and U-Boot `en` changes live outside the Linux banks, but are unrelated to the runtime Password2 replacement.

The early `/configs/debug/replace_with_test.sh` hook used in the steps above is available in `HJL.L91` but missing from recovered older `IJL.J03`. Both known banks have a later `/configs/pre_app_boot.sh` caller. To cover both versions, complete one method above **then** use the [cross-bank startup tutorial](../setup-startup-across-firmware-banks/README.md), which sets the original payload to mode `600` and invokes it with `sh` from the late wrapper. Do **not** restore its execute bit after migration, or the newer bank can invoke it twice. For Method B, check helper/stock-binary compatibility before assuming it works on a new firmware. The older-bank login and migration still require live testing.

`/configs` can be erased by upgrade or factory reset. On the captured devices `cfg_partition` selects `rootfs_data1`, and the known Linux updater can format that partition when upgrading from bank0. Loss of the stored payload, its caller, or the expected `sec_cli` entry point prevents automatic restoration. Keep an independent access path and off-router backups. The [U-Boot recovery tutorial](../recover-uart-root-shell-from-uboot/README.md) may provide a temporary root entry when Password2 is unavailable, but has its own documented compatibility limits.
