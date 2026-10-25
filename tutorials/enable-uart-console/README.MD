# Enabling the Nokia Beacon G6 UART safely

## Introduction

The Nokia Beacon G6 has a working UART interface, but the stock firmware intentionally keeps it 
in a restricted state. During a normal boot you can see early Trusted Firmware and U-Boot messages, 
but the serial console is then disabled and the output eventually goes quiet.

On the firmware analyzed for this project, a stock boot includes messages such as:

```text
serial_enable = 0
>>>>>>>> Serial console Disabled <<<<<<<<
...
serial_is_dis_setup[1129]: serial_is_dis=1, it will disable serial console!
```

After the kernel processes `serial_is_dis=1`, normal console interaction disappears. Pressing keys 
during the usual U-Boot autoboot countdown does not give you a useful shell because the serial input 
path is deliberately suppressed.

The important point is that this is **not a hardware limitation**. The UART is present and working; 
the firmware is choosing not to expose it.

On the examined bootloaders, the switch that controls this behavior is the U-Boot environment variable `console`. When `console=1`, 
the bootloader enables the serial console and constructs the Linux command line with 
`serial_is_dis=0` instead of `serial_is_dis=1`. This means we can enable the existing console without 
replacing U-Boot, patching the kernel, or altering the signed boot chain.

Once serial input is enabled, interrupting autoboot does not immediately drop you into the full U-Boot 
shell. Nokia places a small pre-authentication command line in front of it. You will see a prompt 
similar to `NOKIA >`, with only a limited set of commands available. The command `en` starts a second 
authentication step; only after entering the correct `en` password do you reach the real `VENUS#` 
U-Boot prompt.

> [!note]
> This tutorial covers only the UART-console switch. To set your own password for the `en` gate, see the [U-Boot `en` tutorial](../unlock-uboot-en-console/README.MD).

There is another environment variable named `secboot`, and it is important not to confuse the two. On 
the analyzed bootloader, `secboot=1` is connected to a **security-provisioning path**, not to ordinary 
console visibility. That path prints:


```text
Write hash key to OTP to enable secboot...
```

and reaches OTP/hash programming logic.

For this reason, the console change in this tutorial touches only `console`. The existing 
`secboot` value should remain exactly as it was.



### What you will do:

1. Inspect the current U-Boot environment values.
2. Confirm which MTD partition stores the redundant environments.
3. Make a complete backup of that partition.
4. Set only `console=1`.
5. Verify that `secboot` was not changed.
6. Reboot with UART connected and confirm that the pre-authentication prompt is reachable.

### What you need:

1. A privileged Linux shell on the router.
2. A UART adapter connected at 115200 baud.
3. The stock `fw_printenv` and `fw_setenv` utilities.


> [!caution]
> Leave `secboot` at its existing provisioned value. On the analyzed unit that value is `2`. 
Never use `secboot=1` as a console-unlock step.

---

## Steps

### 1. Inspect the variables

Start by reading the two variables that matter to this procedure:

```shell
fw_printenv console
fw_printenv secboot
```

If `console` is absent or reports `0`, that is consistent with the serial-suppressed state on the first examined bootloader. An absent entry is valid: neither supplied G6 bootloader includes `console` in its compiled default environment. It can first appear when `fw_setenv console 1` creates and saves it. A missing `fw_printenv` entry therefore does not establish that the bootloader lacks code to use that variable.

Record the current value of `secboot` as well. We are not going to change it, but writing it down gives you an easy before-and-after check.

On the development unit used for this project, the desired final state is `console=1` 
while `secboot` remains `2`.


### 2. Confirm the environment layout

The Beacon G6 uses redundant U-Boot environments. In other words, the firmware keeps 
two environment copies so that a damaged copy does not necessarily make the device unbootable.

On the analyzed unit both copies live inside the partition named `uboot-env`, which 
is `/dev/mtd1`. The stock `/etc/fw_env.config` describes the two environment locations as:

```text
/dev/mtd1 0x000000 0x20000 0x40000
/dev/mtd1 0x100000 0x20000 0x40000
```

Do not assume the MTD number from this document without checking your own unit. 
Confirm both the configuration and the partition name with:

```shell
cat /etc/fw_env.config
grep '"uboot-env"' /proc/mtd
```

The reason for checking this before doing anything else is simple: `fw_setenv` already understands 
the redundant layout from `/etc/fw_env.config`, while a manual write to the wrong MTD partition 
would be much harder to recover from.


### 3. Back up the environment partition

If `/proc/mtd` confirms that `uboot-env` is `mtd1`, save a raw copy before changing anything:

```shell
dd if=/dev/mtd1 \
   of=/configs/uboot-env-before-console-enable.bin \
   bs=1M

sync

sha256sum \
    /configs/uboot-env-before-console-enable.bin
```


`/configs` is persistent storage on this firmware, so the backup survives a reboot.
It is still a good idea to copy the file off the router later.

This backup is intentionally larger than the individual environment records. It preserves 
the entire partition, including both redundant copies.



### 4. Enable the console

The actual change is deliberately small. This creates `console` if it is absent, or updates its existing value. Run only:

```shell
fw_setenv console 1
```

Then read both variables again:

```shell
fw_printenv console
fw_printenv secboot
```

On the analyzed unit the output is:

```text
console=1
secboot=2
```

Your exact `secboot` value should be whatever was already provisioned on your router. 
The important result is that `console` changed and `secboot` did not.

### 5. Reboot with UART connected

Flush pending writes with `sync`, then reboot:

```shell
sync
reboot
```

Keep the UART terminal open at 115200 baud. During the next boot you should see U-Boot report
that serial is enabled, and Linux should be given `serial_is_dis=0` rather than `serial_is_dis=1`.

If you interrupt autoboot, you should now reach Nokia's restricted pre-authentication command line:

```text
>>>> this command line is only used to get G984Serial before login Uboot command line <<<<
>>>> please type "?" to get more info <<<<
>>>> system will reset if no any command for over 10s <<<<
NOKIA >
```

At this point the UART change has succeeded. The prompt is still intentionally restricted; 
entering the command `en` starts a separate password check before the full U-Boot console is exposed.

> [!note]
> To set your own `en` password, continue with the [U-Boot `en` tutorial](../unlock-uboot-en-console/README.MD).


---

### Why `console=1` does not disable secure boot

It is useful to separate console exposure from boot authentication, because the names 
can otherwise make the mechanism sound more dramatic than it is.

`console=1` changes how the existing stock bootloader exposes serial I/O and how it builds 
the kernel's `serial_is_dis` argument. It does not replace BL1, BL2, BL31, or BL33; it does not 
alter the FIT public key; and it does not make an unsigned stock FIT suddenly pass signature verification.

The separate `secboot` variable is tied to different code. On this bootloader, the value `1` 
reaches a provisioning path that attempts to write security material into OTP. That is why 
`secboot=1` must not be used as a synonym for “enable serial.”

The safe development change is therefore very narrow: set `console=1`, verify that 
`secboot` is unchanged, and leave the rest of the boot-security configuration alone.


### Persistence

The saved `console=1` value is in the shared `uboot-env` flash partition (`mtd1` in the examined 
G6 layout), separate from the `rootfs0` and `rootfs1` Linux banks. It therefore survives an ordinary 
reboot and a bank-only firmware switch; it is not a change to the RAM overlay or either Linux 
rootfs. A generic router update (assuming it is rootfs-only) should not erase it.