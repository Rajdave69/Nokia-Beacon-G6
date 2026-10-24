# From power-on to a shell: investigating the Beacon G6 boot chain

## The first surprise: UART output isn't the same as a UART console

When I first connected to the Beacon G6's UART, I expected a familiar experience: boot messages, an opportunity to interrupt U-Boot, and eventually a Linux login prompt. Instead, the router printed some early messages and then effectively stopped talking. It was easy to suspect a wiring problem or a UART that supported output but not input.

The boot log pointed somewhere else. Among the messages were `serial_enable = 0`, `>>>>>>>> Serial console Disabled <<<<<<<<`, and a kernel message containing `serial_is_dis=1`. Those are software decisions, not evidence that the UART pins have disappeared. The next question was **which component made that decision, and whether the decision could be changed without replacing signed firmware**.

This document follows that investigation through the different prompts exposed by the router. It is an explanation of *why* the related tutorials work, not a set of instructions to bypass every protection in the boot chain. The observations concern the examined Beacon G6 firmware; a Beacon 1 or G6.2 may be different.

## What is actually booting?

The G6 is an embedded ARM64 system. Power-on code initializes enough hardware to load further firmware stages; the observed chain includes components identified as BL1, BL2, BL31, and BL33/U-Boot. Broadly, early stages initialize hardware and trusted execution, U-Boot chooses and boots an image, Linux initializes the platform, and Nokia's services provide networking and management. These are different programs, even though they can all print through the same UART connector.

A *bootloader prompt* belongs to firmware before Linux; a *routing CLI* can be a program running after Linux has booted; and `/bin/sh` is the operating system's command interpreter. The prompts that turned out to matter here were `NOKIA >`, `VENUS#`, `Cortina#`, and an ordinary shell. Recognizing which stage owns a prompt saved a great deal of confusion later.

## Finding what disables the serial console

I compared the boot messages with the U-Boot environment and the command line eventually passed to the kernel. Two similarly named variables stood out: `console` and `secboot`. It would be a serious mistake to treat them as interchangeable.

The stock bootloader consults the `console` environment variable when deciding how to configure serial interaction. That does not require a pre-existing saved entry: both examined compiled default environments omit console, and `fw_setenv console 1` creates or updates it. An absent `fw_printenv` result is a valid unset state, not evidence that the variable is unsupported. On the examined build, enabling `console` also made Linux receive `serial_is_dis=0` instead of `serial_is_dis=1`. This explains why the UART was alive during early boot but stopped being useful later: the hardware worked, but the boot policy disabled the interactive path.

From an already authorized privileged shell, the relevant read-only observations can be collected with:

```sh
fw_printenv console
fw_printenv secboot
cat /proc/cmdline
cat /etc/fw_env.config
```

The environment itself was not stored in a random file under `/etc`. `/etc/fw_env.config` described two redundant copies in the NAND partition named `uboot-env` (observed as `mtd1`), at offsets `0x000000` and `0x100000`. The Linux utility `fw_setenv` knows that layout and its CRC rules; changing bytes in NAND by hand would be a different and much riskier operation.

On this unit `secboot=2` was the existing provisioned setting. Inspecting the bootloader also showed a distinct `secboot=1` path which reaches OTP/hash-key provisioning and prints a warning about writing a hash key to OTP. **That is not a UART setting.** The [UART tutorial](../../tutorials/enable-uart-console/README.MD) therefore changes only `console`, checks the pre-existing `secboot` value before and after, and leaves secure-boot provisioning alone.

Note that setting `secboot=1` could cause an irreversible operation: blowing an e-Fuse, as it's documented [here on someone's Nokia Beacon 3.1](https://github.com/warber0x/NokiaBeacon3.1_Nand_Patcher/issues/1).

The conclusion is narrow but useful: the console can be exposed through an existing configuration switch. This does **not** prove that secure boot has been defeated or that unsigned firmware will boot.

## The `NOKIA >` prompt was another gate, not a broken U-Boot

With the serial path enabled and autoboot interrupted, the next surprise was a restricted prompt labeled `NOKIA >`. Typing commands normally associated with U-Boot did not work. Running `?` showed only a small set of options, including `show`, `exit`, and `en`. The `en` command asked for a password; successful authentication led to a different prompt, `VENUS#`, which was the full U-Boot command interpreter.

This distinction matters: if `help`, `booti`, or another U-Boot command is unavailable at `NOKIA >`, it doesn't mean the full bootloader lacks that command. The request hasn't passed the bootloader's own authentication gate.

That raised a more interesting question: what does the `en` prompt actually verify? Simply finding a function named after a bootloader password was not sufficient. There were multiple potential sources of password material in the firmware, and one was a serial-derived fallback.

## Tracking the `en` verifier into `extfs`

Investigation of the bootloader's verifier and the factory `SECURITY` record found that the active path on this unit reads a field named `EXT_BOOT_PWD` through the vendor `extfs` storage system. This field is a short verifier, not the plaintext that a user types.

The relevant computation is SHA-256 of the candidate plaintext, standard Base64 of the 32-byte digest, and the **first twelve characters** of that encoded result. The bootloader compares the twelve-character result with `EXT_BOOT_PWD`. That also explains why reading the record did not reveal the original plaintext: a verifier is not reversible encryption.

The firmware additionally contains a BLDR-key-based fallback derived using security configuration and an identity seed. I reproduced a fallback candidate during the investigation, but it did not pass the active `en` gate. The reason was not a failed hash reconstruction: on the examined unit the factory `EXT_BOOT_PWD` existed and took precedence. This is a recurring pattern in this router—**a valid implementation of a fallback algorithm does not necessarily describe the path actually used**.

To inspect the storage backing the active field, first identify the partition by name instead of assuming its number:

```sh
grep '"extfs"' /proc/mtd
```

On the examined NAND layout it was `mtd9`, but the verifier was a *logical record* within that partition, not a reliable raw flash offset. We used the API in `/usr/lib/libextfs.so` to read the `SECURITY` object and later built a guarded helper to change the verifier while backing up the whole record and checking the readback. See [setting the U-Boot `en` password](../../tutorials/unlock-uboot-en-console/README.MD) and [configuration and provisioning](../configuration-and-provisioning/README.md).

## Linux boots, and the UART changes owners again

After U-Boot starts Linux, the UART still does not necessarily lead to a normal login shell. On the analyzed firmware the visible post-boot CLI was `Cortina#`, a Quagga/vtysh-style environment providing selected networking and diagnostic commands. This is **not** the same U-Boot interface: Linux is running, and a user-space application now handles the command line.

The CLI exposes a `shell` command. Invoking it launches Nokia's `sec_cli`/`secmulti` security path and requests `Password2`. The name initially suggests a second stored password, but examining the verifier revealed a different design entirely.

The stock path reads `keysrc1` from `/tmp/secKeySrc.conf`, uses that exact string as the authorization message, and verifies the supplied Base64 token against the public key at `/usr/etc/ecc_pub.pem`. The public key in the examined image used the binary-field elliptic curve `sect131r2`, and the verifier hashed the message with SHA-256. The corresponding *private* signing key was not found in the runtime firmware; that absence is consistent with a support-token system in which the signing authority is held elsewhere.

There was another format trap: the token's decoded representation was **not** the ordinary ASN.1 DER encoding emitted by OpenSSL. The reverse-engineered representation begins with a one-byte length for the ECDSA `R` value, followed by the `R` and `S` magnitudes, and is then Base64-encoded. The [UART root-shell tutorial](../../tutorials/unlock-uart-root-shell/README.MD) documents how a development unit can retain that verification design with a user-owned key pair, or replace the runtime handler for local experimentation. Those modifications should not be confused with discovering Nokia's private signing key.

For a read-only check of the message source on a router you already administer:

```sh
cat /tmp/secKeySrc.conf
ls -l /usr/etc/ecc_pub.pem
command -v sec_cli
```

## What about `ONTUSER` and `superadmin`?

The Linux password database contains additional accounts. On the examined unit, both `ONTUSER` and `superadmin` had **UID 0**, although they had different home directories and login shells: `/bin/sh` for `ONTUSER`, `/usr/bin/vtysh` for `superadmin`. Their authentication hashes were ordinary Linux SHA-256-crypt entries in `/etc/shadow`, not `Password2` signature tokens or bootloader verifiers.

This is why one apparently successful password change might have no effect at another prompt. A WebUI `superadmin` password, a Linux `superadmin` password, the U-Boot `en` verifier, and UART `Password2` belong to separate verification paths. The [credential map](../credential-map/README.md) and [credential investigation](../credential-reverse-engineering/README.md) show where their values came from and how we checked that they were distinct.

Inspect the account *metadata* without exposing the hashes:

```sh
grep -E '^(ONTUSER|superadmin):' /etc/passwd
id
```

## Does enabling UART bypass secure boot?

No conclusion of that kind follows from this work. `console=1` affects the serial interface. Changing `EXT_BOOT_PWD` affects authentication at a U-Boot command gate. Modifying Linux account hashes affects Linux login. None of these operations, by itself, changes the image signature accepted by the bootloader.

Full U-Boot on the development device can be used to load and start a custom Linux kernel through TFTP, but that observation is not a claim that every signed-stock-image verification rule was bypassed, or that persistent unsigned replacement images are accepted by the stock boot path. Those are separate questions requiring their own evidence.

## How I would document a different firmware version

I would start with the complete serial log, including the pre-kernel messages, then capture `/proc/cmdline`, `/etc/fw_env.config`, the named flash partitions, and the exact prompts reached. For a claim about authentication I would inspect the *verifier used by that prompt*, not just a similarly named function found elsewhere in a library. A second unit could retain the same prompt labels while changing the source of its credentials.

The central lesson of this investigation is that the cable, the prompt, and the credential are three different things. **UART is a communications channel; `NOKIA >` is a pre-U-Boot gate; `VENUS#` is full U-Boot; `Cortina#` is a post-Linux CLI; and a Linux shell is yet another environment.** Once each owner is identified, the apparently contradictory behavior of the router starts to make sense.

## Checking a second G6

The [two-G6 follow-up](../two-g6-key-comparison/README.md) confirms the same Password2 public key and ordinary keysrc1 verifier in IJL.J03/HJL.L91, with different normal per-device messages. The second live ECC public key and secmulti hashes match stock HJL.L91. Both factory boot verifiers differ.

The owner has now supplemented both dump directories with MTD0. Their BL2 and BL31 payloads are identical, while BL33/U-Boot and its certificate contents differ. The corresponding certificate public keys are unchanged. The two actual `en` verifiers retain the same factory-hash and serial-fallback paths;36 offline native cases pass with synthetic factory records and intercepted storage/SHA calls. This extends the first-unit trace to the supplied second bootloader, without a live gate login.

The first router's `console=1` is my manual change following the UART tutorial. It lives in MTD1, not MTD0. Both first-unit environment copies have console1; both second-unit copies omit it; all four have valid CRCs and secboot2. The first U-Boot implements the console/serial_is_dis switch described above. Both compiled default environments omit console; that is separate from the code that may consume it. The second kernel-argument builder uses a plain earlycon/console string without the same serial_is_dis selection. That measured code difference does not prove console is unsupported elsewhere or predict the second router's complete UART behavior. The [SSB evidence](../../knowledgebases/g6-ssb-comparison-evidence.json) records the code addresses, component hashes and scope. No second live UART trace was collected. Both dump scripts now include MTD0 for future captures.

## A fourth route: select the initial Linux process

On 24 October 2026, the owner tested the [U-Boot recovery procedure](../../tutorials/recover-uart-root-shell-from-uboot/README.md): initialize the partition map in RAM, load the existing stock FIT from rootfs0, and boot it with init=/bin/sh. The supplied shell reported UID0/PID1. U-Boot reported successful RSA/SHA checks on the stock images. This reaches a shell before normal init/Quagga/Password2 rather than changing that verifier. It does not establish acceptance of a modified bootloader or an unsigned kernel.

The [writeup](../uart-recovery-from-uboot/README.md) separates the live root result from untested older-bank and file-restore steps. The manual sequence must set mtdparts before using named UBI partitions; the unset-state listing command itself crashed during diagnosis. A new rootfs can still change the kernel policy or layout, so the successful known-image recovery is not a promise about arbitrary future firmware.
