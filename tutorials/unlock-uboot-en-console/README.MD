# Setting your own U-Boot `en` password


## Introduction

With UART enabled, interrupting the Nokia Beacon G6 boot process does not take you directly to 
the full U-Boot command line. Nokia places a small authentication layer in front of it.

The first prompt looks like this:

```text
>>>> this command line is only used to get G984Serial before login Uboot command line <<<<
>>>> please type "?" to get more info <<<<
>>>> system will reset if no any command for over 10s <<<<
NOKIA >
```

This restricted prompt understands only a small set of commands. The important one is `en`. Running 
it asks for a password, and only a successful check releases the real `VENUS#` U-Boot shell.

That means there are two separate questions:

1. How do we expose the UART?
   That is controlled by the U-Boot environment variable `console` and is covered [here](../enable-uart-console/README.MD).

2. What does the `en` command accept as a password?  
   That is controlled by a different mechanism inside BL33/U-Boot and is the subject of this tutorial.

   
On the firmware analyzed for this project, the active `en` path reads a field named 
`EXT_BOOT_PWD` from the logical `SECURITY` object stored in the `extfs` flash partition. 
Despite the name, `EXT_BOOT_PWD` is not the plaintext password.

The bootloader takes the text you type, computes SHA-256, Base64-encodes the 32-byte 
digest, keeps the first 12 Base64 characters, and compares that result with `EXT_BOOT_PWD`.

In compact form:

```text
typed 12-character password
        |
        v
SHA-256
        |
        v
standard Base64
        |
        v
first 12 characters
        |
        v
compare with EXT_BOOT_PWD
```

For the original analyzed unit, the stored verifier was `+i65eN5i/yIs`. Knowing that 
verifier did not reveal the original factory plaintext, because it quite literally is a 
hash. The only way to find the plaintext would be some form of bruteforce. The useful approach
is therefore not to recover Nokia's old password, but to replace the verifier with one 
generated from a new 12-character password that you choose.

This tutorial uses the supplied `set_ext_boot_pwd` helper. The helper does not write raw 
offsets into NAND. Instead, it calls Nokia's own `libextfs.so` API to read and write the 
logical `SECURITY` record, verifies that exactly one `EXT_BOOT_PWD` field is present, 
backs up the complete 8192-byte object, changes only the 12 verifier bytes, and reads 
the object back for comparison. Source code for the same has been provided too.



### What you will do

You will confirm the `extfs` partition, back it up, read the current verifier, choose a new 
12-character plaintext, calculate its verifier, update the logical `SECURITY` object through 
`libextfs`, and then reboot and use your new password at the `NOKIA > en` prompt.

### What you need

- You need an existing privileged Linux shell
- UART access
- The included `./set_ext_boot_pwd` AArch64 helper 
- The router's stock `/usr/lib/libextfs.so` 
- Python3 on a trusted computer for calculating the verifier (hash).

> [!caution]
> Do not use `secboot=1` as part of this process. On this Beacon G6 bootloader, that value 
reaches an OTP/hash-key provisioning path. Leave `secboot` at its existing provisioned value; on 
the analyzed unit it is `2`.

---

## Steps

### 1. Confirm the `extfs` partition

The verifier is stored inside the logical `SECURITY` object managed by the router's 
`extfs` subsystem. On the analyzed unit, the backing MTD partition is:

```text
mtd9: 00500000 00040000 "extfs"
```

Check your own partition table with `grep '"extfs"' /proc/mtd`. If your firmware reports a 
different MTD number, use what your router reports rather than copying `mtd9` blindly from this document.

This distinction matters because the raw backup in the next step must come from the correct partition.

### 2. Check the console and `secboot` state

Read the U-Boot environment with:

```shell
fw_printenv console
fw_printenv secboot
```

If UART is already enabled, `console` should be `1`. If it is not, follow 
[this](../enable-uart-console/README.MD) before continuing.

Record the existing `secboot` value and leave it alone. `console=1` exposes serial I/O; 
`secboot=1` is a different path entirely and is not required to change the `en` credential.

### 3. Make a raw backup of `extfs`

If your router confirmed that `extfs` is `/dev/mtd9`, back up the complete partition:

```shell
dd if=/dev/mtd9 \
   of=/configs/mtd9-before-uboot-password-change.bin \
   bs=1M

sync

sha256sum /configs/mtd9-before-uboot-password-change.bin
```

Copy this backup off the router when practical.

The raw image is your broad recovery copy. The helper will also create a much smaller backup 
of the logical 8192-byte `SECURITY` object immediately before it changes the verifier. 
Keeping both is useful: the former protects the entire partition, while the latter is convenient for 
a clean logical rollback.

### 4. Copy the guarded helper to the router

Transfer `./set_ext_boot_pwd` to `/tmp/set_ext_boot_pwd`, make it executable, and inspect it.

```shell
chmod 755 /tmp/set_ext_boot_pwd

ls -la set_ext_boot_pwd
```

It should identify as an AArch64 executable. The helper uses the router's existing API found in
`/usr/lib/libextfs.so`; it is not a raw NAND patcher.

### 5. Read the current `EXT_BOOT_PWD`

Run:

```shell
/tmp/set_ext_boot_pwd --show
```

On the original analyzed unit, this reported `EXT_BOOT_PWD=+i65eN5i/yIs`. If the router has 
already been modified, you may see a different 12-character value, or perhaps it might differ
based on region too.

Record exactly what `--show` returns. The helper deliberately requires you to supply the 
expected old verifier before it will write the new one. This guard is there to stop an 
accidental write when the router is not in the state the tutorial expects.

For example, if your actual current verifier is the factory value, you might later 
set `OLD='+i65eN5i/yIs'`.

### 6. Choose a new 12-character plaintext password

The analyzed checker expects the entered plaintext to be exactly 12 characters long. 
Choose your own value and count it before generating the verifier.

For example, `BootOpenWrt!` is 12 characters. You can verify the length on a trusted computer 
with Python:

```python
password = "BootOpenWrt!"
print(len(password))
```

The output must be `12`.

The password itself is what you will type at the U-Boot prompt. The router does not
store this string in `EXT_BOOT_PWD`.

### 7. Generate the verifier

The stored value is the first 12 characters of standard Base64 applied to the SHA-256 
digest of the plaintext.

Calculate it on a trusted computer with Python:

```python
import base64
import hashlib

password = "BootOpenWrt!"
assert len(password) == 12

digest = hashlib.sha256(password.encode()).digest()
verifier = base64.b64encode(digest).decode()[:12]

print(verifier)
```

For `BootOpenWrt!`, the verifier is `YyXRAjb7Fisz`.

An earlier development password used during this project, `OpenWrt2026!`, produces `6llQGq4EkAj+`.

This is why the value stored in `EXT_BOOT_PWD` should be thought of as a verifier, not as 
an encrypted password. The bootloader can test a candidate by repeating the same one-way 
transformation, but the 12-character verifier does not directly contain the original plaintext.

### 8. Write the new verifier

Back on the router, set shell variables to the exact value you read in step 5 and the verifier 
you just calculated. For the example:

```shell
OLD='+i65eN5i/yIs'
NEW='YyXRAjb7Fisz'
```

Then run:

```shell
/tmp/set_ext_boot_pwd "$OLD" "$NEW"
```

The helper performs several checks before reporting success. It reads the complete logical 
`SECURITY` object with `extfs_get()`, confirms there is exactly one `EXT_BOOT_PWD` field, 
confirms that its current 12 bytes equal your `OLD` value, and saves the original object as 
`/configs/security-before-uboot-password-change.bin`.

Only then does it replace the 12 verifier bytes in memory and write the full object back 
with `extfs_set()`. It reads the object again afterward and requires byte-for-byte equality 
with the intended result.

A successful run ends with:

```text
SUCCESS: only the 12-byte EXT_BOOT_PWD verifier changed and full readback matched.
```

The important property here is that the tutorial is not asking you to calculate an MTD offset
and overwrite NAND manually. It is using the same logical storage layer that the Nokia firmware
itself uses.

### 9. Verify the stored value before rebooting

Run `/tmp/set_ext_boot_pwd --show` again. It should now display the new verifier.

Also confirm that the logical backup exists:

```shell
ls -l /configs/security-before-uboot-password-change.bin
sha256sum /configs/security-before-uboot-password-change.bin
```

Finally run `sync`.

At this stage the password change is already stored. The reboot is only needed so that 
you can test it from the bootloader.

### 10. Enter U-Boot with the new plaintext

Reboot with UART connected and interrupt autoboot until you reach `NOKIA >`.

Run `en`. When `Please input password:` appears, type the **plaintext** you chose in step 6. For 
the example, `BootOpenWrt!`, not `YyXRAjb7Fisz`. Note that you cannot use the backspace or delete keys;
you must type the password correctly in one go.

A successful check releases the full U-Boot prompt:

```text
VENUS#
```

You have now changed the credential used by the stock `en` gate without replacing U-Boot itself.

### 11. Confirm the logical value from U-Boot

The stock bootloader includes `extfstool`. From `VENUS#`, `extfstool get SECURITY` should 
print the SECURITY record and include your new `EXT_BOOT_PWD` value.

The formatting is compact, but the 12-character verifier should match the value produced in step 7.

---

### Restoring the previous SECURITY object

The helper's first successful change creates `/configs/security-before-uboot-password-change.bin`.

To put that entire 8192-byte logical object back, run:

```shell
/tmp/set_ext_boot_pwd --restore
```

Then verify with `/tmp/set_ext_boot_pwd --show`, run `sync`, and reboot.

> [!caution]
> `--restore` restores the whole saved SECURITY object, not just the `EXT_BOOT_PWD` field. 
Use the backup that was created immediately before this password change rather than an old 
SECURITY backup taken before unrelated provisioning changes.

---

### Why the BLDR-derived password is not the active password here

Reverse engineering also uncovered a fallback path that combines the lowercase G984 serial 
with the `BLDR` slot from the security key material. On the examined unit that path reconstructed 
the candidate `FPmZA6bwV5eq`.

That candidate did not unlock the router because the fallback is only used when the bootloader 
cannot obtain the active `EXT_BOOT_PWD` value from SECURITY. When SECURITY is available, 
the verifier mechanism described in this tutorial takes precedence.

This distinction is useful because the presence of BLDR key material can otherwise make it 
look as though the boot password must always be generated from the serial number. On this 
unit, it is not.


### Persistence

The changed `SECURITY.EXT_BOOT_PWD` verifier is a **logical record in shared `extfs`** (`mtd9` on the examined layout), not part of either Linux rootfs. It persists across reboots and **bank-only** switches between `rootfs0` and `rootfs1`; both examined G6 bootloaders retain the verifier path. The separate UART `console=1` switch is in `uboot-env`, not in `extfs`.

A firmware package that updates shared boot components, changes `extfs` or its authentication policy, or a factory/reset path that overwrites the record can affect access. This tutorial cannot promise survival of arbitrary firmware upgrades. Preserve an off-router backup before modifying the verifier, and remember that `VENUS#` access by itself does not provide a Linux root shell.


### What this procedure changes, and what it does not

This tutorial changes one credential verifier inside the existing SECURITY record. It does
not replace BL1, BL2, BL31, or BL33; it does not patch the authenticated U-Boot binary; 
it does not disable FIT signature verification; and it does not require writing OTP or 
setting `secboot=1`.

It also has no effect on Linux `ONTUSER`, Linux or WebUI `superadmin`, or Quagga Password2. 
Those are separate credential systems.

If the number of passwords on this router is becoming confusing, 
[`writeup-credential-map.md`](../../knowledgebases/password-reverse-engineering.md) provides a useful map of which mechanism 
protects which interface.
