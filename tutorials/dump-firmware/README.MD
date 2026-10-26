# Dump the Nokia Beacon G6 firmware and flash partitions

## Introduction

The Nokia Beacon G6 stores its firmware, bootloader, boot environment, factory records and writable data on NAND flash. The two provided scripts capture the router's exposed Linux `/dev/mtdN` partitions **over a network connection** and save them as files on your computer. They perform reads, not `nandwrite`, firmware uploads or flash erases.

The default `firmware` scope captures the relevant **physical regions** `mtd0`–`mtd7`, `mtd9` and `mtd10`, including the shared `ssb` bootloader, redundant `uboot-env`, `RI`, both Linux firmware banks, both `rootfs_data` partitions, `cfg`, `extfs` and radio calibration. It deliberately omits the writable `log` and `user_data` regions. The optional `full` scope includes all twelve physical partitions (`mtd0`–`mtd11`) and is the better choice if you specifically need a main-area image of *every* physical NAND region.

The scripts use the two available routes: **SSH** for direct binary streaming (preferred) and **Telnet on TCP/2323** for environments where only a shell-oriented session is available. The Telnet script Base64-encodes each remote partition before transferring it, to prevent Telnet's terminal protocol from corrupting arbitrary binary bytes. Both produce metadata, per-file SHA-256 checksums and a ZIP archive.

These are **not complete NAND programmer images**: `/dev/mtdN` reads capture the main data area without OOB/spare bytes. Capturing live writable partitions also does not guarantee an atomic, consistent snapshot. Treat these files as critical research/back-up evidence rather than a tested one-command restore image.

### What you will do

1. Confirm the router's storage layout and prepare enough disk space on your computer.
2. Choose SSH or the TCP/2323 Telnet shell and the desired capture scope.
3. Run the corresponding included script **on your computer**, not on the router.
4. Check all expected partition sizes, the saved manifest and the ZIP contents.
5. Store the result securely off the router, alongside the identity of the unit and firmware version.

### What you need

- Your own Nokia Beacon G6 and a working, privileged SSH or Telnet shell.
- A trusted Linux computer (or WSL with suitable connectivity) with Bash, `sha256sum`, `file`, `zip` and `stat`.
- **For SSH:** `ssh`, a working router account and the included `beacon-g6-dump-ssh.sh`.
- **For Telnet:** `expect`, `telnet`, `base64` and the included `beacon-g6-dump-telnet-2323.sh`.
- Enough free local storage. The captured G6 NAND main area is **512 MiB** across all physical partitions, before ZIP/temp-file overhead. Allow substantially more free space for the Telnet script's temporary Base64 files and archive.

> [!caution]
> Dumps can contain router identity and calibration material, passwords or password hashes, private keys, account configuration, network details and user data. Do not publish them or restore one device's `RI`/`ART`/`extfs`/data to a different device. Telnet is unencrypted and the discussed TCP/2323 development service is unauthenticated; use it only on an isolated, trusted management network. SSH is preferable.

### What is being captured?

On the two inspected G6 units, Linux reports this physical map (check yours before running the scripts):

| Linux MTD       | Region                          |        Size | Included by default? |
|-----------------|---------------------------------|------------:|----------------------|
| `mtd0`          | `ssb` (bootloader/FIP)          |       4 MiB | Yes                  |
| `mtd1`          | `uboot-env`                     |       2 MiB | Yes                  |
| `mtd2`          | `RI`                            |       1 MiB | Yes                  |
| `mtd3` / `mtd4` | `rootfs0` / `rootfs1`           | 80 MiB each | Yes                  |
| `mtd5` / `mtd6` | `rootfs_data0` / `rootfs_data1` | 30 MiB each | Yes                  |
| `mtd7`          | `cfg`                           |       8 MiB | Yes                  |
| `mtd8`          | `log`                           |      15 MiB | Only with `full`     |
| `mtd9`          | `extfs`                         |       5 MiB | Yes                  |
| `mtd10`         | `0:ART`                         |       1 MiB | Yes                  |
| `mtd11`         | `user_data`                     |     256 MiB | Only with `full`     |

This is **physical-partition scope**, not a logical UBI-volume export. Additional Linux `mtd12`–`mtd17` entries on the inspected units are `gluebi` views of volumes already inside physical partitions; including them would double-count data and can produce empty or incomplete reads. Both firmware banks are included as physical `mtd3` and `mtd4`; skipping the logical views does not omit the alternate firmware. Logical-volume dumps can be extracted separately for analysis, but do not add physical NAND coverage. The older scripts attempted those logical views and did not capture raw `mtd8` or `mtd11`, so older archives should **not** be mistaken for a complete 512 MiB NAND dump. Their documented coverage and missing regions are explained in the [storage knowledgebase](../../knowledgebases/storage-and-flash.md).

---

## Steps

### 1. Verify the router and the partition table

In your existing router shell, run `cat /proc/mtd`, then check `cat /proc/cmdline`. Confirm the partition **names, sizes and physical partition numbers** against the table above. Do not reuse this script unchanged if a different firmware reports another layout. Also check `mount | grep /configs` if your work depends on preserving the selected configuration partition.

The scripts will save `/proc/mtd` again as `proc-mtd.txt`, alongside other boot, mount, UBI and MTD geometry information in `router-metadata.txt`. A dump made from a live system may contain changing data; for the most reliable evidence, avoid making configuration changes or initiating an upgrade while it runs.

### 2. Choose the capture method

**SSH (recommended):** Open a terminal on your computer in the directory containing `beacon-g6-dump-ssh.sh`. Set the router login address with the `ROUTER` environment variable:

```sh
ROUTER='ONTUSER@192.168.19.1' bash ./beacon-g6-dump-ssh.sh
```

The address is an example; substitute your router's address and authorized shell account. SSH uses `-T` to avoid allocating a pseudo-terminal, so the binary stream is not altered by terminal echo or line handling. If the account's startup scripts print a login banner to standard output even for a noninteractive command, a resulting size mismatch may indicate contamination; correct that before trusting the dump.

**TCP/2323 Telnet:** If you already have a controlled development listener on port 2323, use the alternative from your computer:

```sh
ROUTER_IP='192.168.18.1' TELNET_PORT=2323 bash ./beacon-g6-dump-telnet-2323.sh
```

This does **not** create or enable Telnet on the router. The [persistent Telnet tutorial](../setup-persistent-unauthenticated-telnet/README.md) describes that *separate* development setup. The script expects a shell prompt, suppresses echo, wraps Base64 output in unique markers, decodes it locally and checks exact lengths. If your Telnet service requires authentication, the script can read its password from the `TELNET_PASSWORD` environment variable; be mindful of your shell history and local process environment. If prompt detection fails, stop and inspect the capture rather than accepting a corrupted binary.

### 3. Choose `firmware` or `full`

Both scripts default to `DUMP_SCOPE=firmware` and read `mtd0`–`mtd7`, `mtd9` and `mtd10`. To capture all twelve physical partitions, prefix either command with `DUMP_SCOPE=full`, for example:

```sh
DUMP_SCOPE=full ROUTER='ONTUSER@192.168.19.1' bash ./beacon-g6-dump-ssh.sh
```

The full option includes `log` and the 256 MiB `user_data` region. It takes more local storage and can collect substantially more sensitive content. Use the SSH route for full capture when possible. The scripts stop on missing expected partitions or short reads rather than silently declaring an incomplete archive successful.

You may also set `OUT=/path/to/output-directory` to choose an output directory. Without it, each script creates a dated `~/beacon-g6-clean-dumps-YYYYMMDD-HHMMSS` directory on your computer.

### 4. Verify the results

On success, the output directory contains the raw `mtdNN_name.bin` files, `proc-mtd.txt`, `router-metadata.txt`, `SHA256SUMS.txt`, `FILE-TYPES.txt`, and `beacon-g6-clean-dumps.zip`.

From that output directory, verify the checksums and archive contents:

```sh
sha256sum -c SHA256SUMS.txt
unzip -t beacon-g6-clean-dumps.zip
unzip -Z1 beacon-g6-clean-dumps.zip
```

The scripts already compare each dump's byte length with the size reported by `/proc/mtd`. The SHA-256 manifest lets you detect **subsequent changes to the saved files**; it is not a remote, independent confirmation that a live, changing MTD device had a consistent read. Check that `mtd00_ssb.bin` is actually inside the ZIP: a historical capture accidentally omitted it from its initial ZIP.

Keep both the original files and the manifest. Record your router model, firmware image version, capture date, capture scope, and whether the active bank was `rootfs0` or `rootfs1`. A label alone is insufficient: two devices can run the same firmware but contain different device-specific calibration and secrets.

---

### Persistence

**The dumping process does not modify persistent router settings.** It writes files on the computer and performs read operations on the router's exposed MTD devices. Those off-device files survive a router reboot, bank switch or upgrade as long as you retain your own copies. They are snapshots of the particular captured state, **not** live backups that automatically update after a firmware change.

Neither an ordinary bank switch nor an upgrade recreates a missed partition in an old dump. If you plan to change U-Boot environment, `extfs`, firmware banks or persistent startup hooks later, preserve a baseline *before* those changes. Raw MTD dumps are not proven safe for blind flashing or cross-device restoration, and they omit NAND OOB/bad-block metadata. For the underlying storage and firmware-upgrade erasure boundaries, consult the [storage knowledgebase](../../knowledgebases/storage-and-flash.md).
