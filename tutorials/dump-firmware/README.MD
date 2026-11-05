# Dump the Nokia Beacon G6 firmware and flash partitions

## Introduction

The Nokia Beacon G6 stores its firmware, bootloader, boot environment, factory records and writable data on NAND flash. The provided scripts capture the router's exposed Linux `/dev/mtdN` partitions **over a network connection** and save them as files on your computer. They perform reads, not `nandwrite`, firmware uploads or flash erases.

The default `firmware` scope captures the relevant **physical regions** `mtd0`–`mtd7`, `mtd9` and `mtd10`, including the shared `ssb` bootloader, redundant `uboot-env`, `RI`, both Linux firmware banks, both `rootfs_data` partitions, `cfg`, `extfs` and radio calibration. It deliberately omits the writable `log` and `user_data` regions. The optional `full` scope includes all twelve physical partitions (`mtd0`–`mtd11`) and is the better choice if you specifically need a main-area image of *every* physical NAND region.

The scripts use the two available routes: **SSH** for direct binary streaming (preferred) and **Telnet on TCP/2323** for environments where only a shell-oriented session is available. Both Telnet versions Base64-encode each remote partition before transferring it, to prevent Telnet's terminal protocol from corrupting arbitrary binary bytes. All versions produce metadata, per-file SHA-256 checksums and a ZIP archive (optional with `-SkipZip` in PowerShell).

These are **not complete NAND programmer images**: `/dev/mtdN` reads capture the main data area without OOB/spare bytes. Capturing live writable partitions also does not guarantee an atomic, consistent snapshot. Treat these files as critical research/back-up evidence rather than a tested one-command restore image.

### What you will do

1. Confirm the router's storage layout and prepare enough disk space on your computer.
2. Choose SSH or the TCP/2323 Telnet shell and the desired capture scope.
3. Run the corresponding included script **on your computer**, not on the router.
4. Check all expected partition sizes, the saved manifest and the ZIP contents.
5. Store the result securely off the router, alongside the identity of the unit and firmware version.

### What you need

- Your own Nokia Beacon G6 and a working, privileged SSH or Telnet shell.
- **For the Bash scripts:** a trusted Linux computer (or WSL with suitable connectivity) with Bash, `sha256sum`, `file`, `zip` and `stat`.
- **For native Windows Telnet:** Windows PowerShell **5.1** or PowerShell **7**, and [beacon-g6-dump-telnet-2323.ps1](beacon-g6-dump-telnet-2323.ps1). It uses .NET directly; WSL, Python, Expect, `telnet.exe`, `file` and an external ZIP tool are not required.
- **For SSH:** `ssh`, a working router account and the included `beacon-g6-dump-ssh.sh`.
- **For Bash Telnet:** `expect`, `telnet`, `base64` and the included `beacon-g6-dump-telnet-2323.sh`. The router needs a working Base64 encoder for either Telnet version.
- Enough free local storage. The captured G6 NAND main area is **512 MiB** across all physical partitions, before ZIP/temp-file overhead. Allow substantially more free space for the Bash Telnet script's temporary Base64 files and archive. The PowerShell version streams decoding directly to disk and allows room for the binary files, a ZIP of up to the same size, and 64 MiB overhead.

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

**TCP/2323 Telnet (Bash):** If you already have a controlled development listener on port 2323, use the alternative from your computer:

```sh
ROUTER_IP='192.168.18.1' TELNET_PORT=2323 bash ./beacon-g6-dump-telnet-2323.sh
```

This does **not** create or enable Telnet on the router. The [persistent Telnet tutorial](../setup-persistent-unauthenticated-telnet/README.md) describes that *separate* development setup. The script expects a shell prompt, suppresses echo, wraps Base64 output in unique markers, decodes it locally and checks exact lengths. If your Telnet service requires authentication, the script can read its password from the `TELNET_PASSWORD` environment variable; be mindful of your shell history and local process environment. If prompt detection fails, stop and inspect the capture rather than accepting a corrupted binary.

**Native Windows PowerShell:** Run the `.ps1` on your Windows computer. The default is the same ten physical firmware partitions, including `mtd0`:

```powershell
.\beacon-g6-dump-telnet-2323.ps1 -RouterIP 192.168.18.1
```

To include all twelve physical partitions and choose a new output directory:

```powershell
.\beacon-g6-dump-telnet-2323.ps1 -RouterIP 192.168.18.1 -DumpScope full -Out 'D:\Backups\G6-full'
```

If Windows blocks local script execution, launch a separate process with an execution policy that applies only to that process:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\beacon-g6-dump-telnet-2323.ps1 -RouterIP 192.168.18.1
```

This does not change the machine's saved execution policy. PowerShell 7 users can use `pwsh.exe` in that command. A managed environment must permit `Add-Type`, which compiles the embedded .NET receiver.

If the Telnet shell requires authentication, pass a credential object:

```powershell
$routerCredential = Get-Credential -UserName root -Message 'Router Telnet login'
.\beacon-g6-dump-telnet-2323.ps1 -RouterIP 192.168.18.1 -Credential $routerCredential
```

The existing `TELNET_PASSWORD` environment variable also works; `-User` selects the login name when using it. The unauthenticated development listener needs neither option. The script verifies that `id -u` returns `0` before reading flash. It validates the selected partition names against the documented G6 map and refuses an existing output directory. It leaves shell echo unchanged, framing each entire command so its echo precedes the payload marker. No scripts are uploaded to the router.

| PowerShell option | Default / purpose |
| --- | --- |
| `-RouterIP` | `192.168.18.1`; also accepts the `ROUTER_IP` environment default. |
| `-TelnetPort` | `2323`; also accepts `TELNET_PORT`. |
| `-DumpScope firmware` / `full` | Same physical coverage as the Bash script; accepts `DUMP_SCOPE`. |
| `-Out` | New dated directory under the Windows user profile; accepts `OUT`. Existing directories are refused. |
| `-Credential` / `-User` | Optional login credentials / username; username defaults to root. |
| `-SkipZip` | Keep raw files and manifests without creating a ZIP. |
| `-IdleTimeoutSeconds` | 120 seconds without incoming transfer data. |
| `-PartitionTimeoutSeconds` | 7200 seconds per partition transfer. |

Raw image bytes are written with .NET `FileStream`, avoiding PowerShell text-pipeline encoding. PowerShell writes a `.partial` file during each transfer and finalizes it only after strict Base64, encoder-exit and exact-length checks. Interrupted/failed files are retained for diagnosis and are not resumed. Completed partitions and their checksum entries remain available if a later partition fails. Its `FILE-TYPES.txt` uses a small built-in signature recognizer and leading-byte display, rather than the full Linux `file` database. It accepts the router's standalone Base64 encoder, BusyBox encoder or OpenSSL encoder.

Implementation notes and validation records are kept with the [storage writeup](../../writeups/storage-and-flash/resources/powershell-dump/README.md).

### 3. Choose `firmware` or `full`

The Bash scripts default to `DUMP_SCOPE=firmware` and read `mtd0`–`mtd7`, `mtd9` and `mtd10`. For PowerShell, use `-DumpScope full` as above. To capture all twelve physical partitions with Bash, prefix either command with `DUMP_SCOPE=full`, for example:

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

On Windows, verify the local files from the output directory:

```powershell
Get-Content -LiteralPath .\SHA256SUMS.txt | ForEach-Object {
    $expectedHash, $dumpName = $_ -split '  ', 2
    $actualHash = (Get-FileHash -LiteralPath (Join-Path $PWD.Path $dumpName) -Algorithm SHA256).Hash
    if ($actualHash -ine $expectedHash) { throw "Checksum mismatch: $dumpName" }
    "OK: $dumpName"
}
```

Use Explorer or `Expand-Archive` to extract the ZIP to a new directory, then run the same checksum check inside the extracted directory to verify archived payloads. The ZIP also includes `router-metadata.txt`, `proc-mtd.txt`, `FILE-TYPES.txt` and `SHA256SUMS.txt`.

The scripts already compare each dump's byte length with the size reported by `/proc/mtd`. The SHA-256 manifest lets you detect **subsequent changes to the saved files**; it is not a remote, independent confirmation that a live, changing MTD device had a consistent read. Check that `mtd00_ssb.bin` is actually inside the ZIP: a historical capture accidentally omitted it from its initial ZIP.

Keep both the original files and the manifest. Record your router model, firmware image version, capture date, capture scope, and whether the active bank was `rootfs0` or `rootfs1`. A label alone is insufficient: two devices can run the same firmware but contain different device-specific calibration and secrets.

---

### Persistence

**The dumping process does not modify persistent router settings.** It writes files on the computer and performs read operations on the router's exposed MTD devices. Those off-device files survive a router reboot, bank switch or upgrade as long as you retain your own copies. They are snapshots of the particular captured state, **not** live backups that automatically update after a firmware change.

Neither an ordinary bank switch nor an upgrade recreates a missed partition in an old dump. If you plan to change U-Boot environment, `extfs`, firmware banks or persistent startup hooks later, preserve a baseline *before* those changes. Raw MTD dumps are not proven safe for blind flashing or cross-device restoration, and they omit NAND OOB/bad-block metadata. For the underlying storage and firmware-upgrade erasure boundaries, consult the [storage knowledgebase](../../knowledgebases/storage-and-flash.md).
