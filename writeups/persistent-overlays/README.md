# Hidden in the init scripts: Nokia's persistent startup hooks

## The problem: our changes vanished, but our configuration survived

When experimenting with the Beacon G6's security utilities, I sometimes needed a replacement executable or an alternate public key to appear at a normal filesystem path. It worked while Linux was running. After reboot, the replacement disappeared, and the stock file was back. Meanwhile, changes stored under `/configs` remained intact.

That suggested an approach different from building a new signed firmware image for every experiment: store the desired files and a small startup script on persistent flash, and have stock Linux run the script again on each boot. The question was whether Nokia had already provided a suitable call site.

Nokia supplies two callers with different timing. HJL’s Wi-Fi initialization can call an executable script before wireless setup completes. The `commit_image` script on HJL and IJL can call a script later in startup. The image-commit command in that file is commented out; the script still runs its separate startup-hook branch.

Comparing these paths is more informative than calling both “a boot hook.” They use different shell conditions and execution styles, and their positions in boot do not, by themselves, reveal the moment at which every dependent service becomes ready.

This is an explanation of the discovered mechanisms and the evidence for them. It does not require modifying a device merely to read the relevant scripts.


## First establish the filesystem boundary

The stock root filesystem on the examined G6 was read-only squashfs, visible under `/rom`. The active `/` was a writable runtime overlay; changes to it could disappear at reboot. By contrast, `/configs` was mounted from persistent UBIFS. This is the storage fact that made the hooks useful: the boot-time script can survive even if its changes to runtime executables do not.

We confirmed this from the live mount table rather than assuming every OpenWrt-derived router mounts its upper layer in the same way. In the subsequent capture, the router specifically reported `/dev/ubi6_0 on /configs type ubifs (rw,relatime,ubi=6,vol=0)`, establishing that the directory was a mounted, writable UBIFS volume on that running unit:

```sh
mount | grep -E ' /rom | on / | /configs '
ls -ld /rom /configs /configs/debug 2>/dev/null
```

The difference matters for recovery too. Rebooting might undo a temporary file replacement, but it does not necessarily undo a persistent script that will promptly replace the file again. The location of the *instructions* is as important as the location of the changed program.

## The early Wi-Fi mount hook on HJL

Our first useful lead was the vendor's `wifi_fw_mount` init script. In the examined Beacon G6 HJL.L91 firmware, it checked for an executable `/configs/debug/replace_with_test.sh` and ran it. The path was not one we invented: it was embedded in Nokia's own boot script.

To see the call site in the original read-only firmware rather than a potentially modified runtime file:

```sh
grep -n -B 5 -A 12 'replace_with_test.sh' /rom/etc/init.d/wifi_fw_mount 2>/dev/null
```

The fresh capture exposed the relevant part of `wifi_fw_mount` around lines 383–389:

```sh
if [ -e "/configs/debug/replace_with_test.sh" ]; then
    echo "======/configs/debug/replace_with_test.sh exist======" > /dev/console 2>&1
    if [ -x "/configs/debug/replace_with_test.sh" ]; then
        echo "======/configs/debug/replace_with_test.sh executed======" > /dev/console 2>&1
        /configs/debug/replace_with_test.sh
    fi
fi
```

This establishes the core chain more precisely than a filename alone. The first test checks whether the file exists, the second checks whether it is executable, and only then does the script run. The console messages are potentially useful markers in a captured serial log; they are not independent proof that the hook completed successfully.

Unlike the other hook described below, the visible invocation of `replace_with_test.sh` has no trailing `&`. It runs in the foreground relative to the `wifi_fw_mount` function that calls it. That matters if the custom script takes a long time or does not return. However, this code excerpt does not show whether some *outer* startup caller runs `wifi_fw_mount` asynchronously, so it would be a mistake to claim from these lines alone that the script blocks the entire system boot.

The file's development-sounding name hints at its original purpose, but a name is not proof of intended usage or authorization policy.

The timing is significant. `wifi_fw_mount` participates in early Wi-Fi/firmware setup. An early hook may be suitable for preparing resources required by services that start later, but it may run before every service, interface, or mount that a custom script expects is ready. The exact readiness of those dependencies must be verified on the running build.

The inactive IJL.J03 bank lacks the `replace_with_test.sh` call. Both stock builds ship an identical `commit_image` with `pre_app_boot.sh`. An owner-installed payload seen under the active HJL build says nothing about whether IJL calls it. [Build comparison](../comparing-other-g6-routers/README.md).

## The Beacon 9 variant has a different early hook name

The newer Beacon 9 firmware revealed a related early hook named `/configs/debug/wifi_test.sh`. It is tempting to describe this as “Nokia's hook” and use the filenames interchangeably, but that would create a misleading cross-model tutorial.

The distinction established by the examined versions is:

| Product/firmware context  | Observed early executable script      | What should be checked                                          |
|---------------------------|---------------------------------------|-----------------------------------------------------------------|
| Beacon G6, HJL.L91        | `/configs/debug/replace_with_test.sh` | `wifi_fw_mount` call site in that build                         |
| Beacon 9, newer firmware  | `/configs/debug/wifi_test.sh`         | The corresponding early startup call site in the Beacon 9 build |

Nothing in this comparison proves that every G6 release understands `wifi_test.sh`, or that every Beacon 9 still recognizes `replace_with_test.sh`. A newer filename could represent a renamed development path, a different invocation rule, or other firmware changes. The only defensible way to document another version is to read that version's actual script and identify the exact test and execution command.

This difference is also a reminder that the hardware is not interchangeable. The G6 is a Cortina/CA8289 platform with NAND; the analyzed Beacon 9 is built around a different Qualcomm platform and eMMC layout. Similar-looking management conventions do not imply identical boot processes.

## The shared late hook in commit_image

A different investigation of the init scripts found `/configs/pre_app_boot.sh` referenced from `/etc/init.d/commit_image`. At first, the script's name suggested that this hook might run *after* an image-commit job. That sounded plausible, but the newer capture provided the decisive detail: this particular `commit_image` script no longer performs an image commit during boot.

The `ls` output confirms that `/etc/rc.d/S99commit_image` exists and links to `../init.d/commit_image`. The inspected script reports `START=99`, and the active portion of its `boot()` function is:

```sh
START=99

boot()
{
    # no commit in bootup script anymore
    # sleep 30 && /sbin/image_commit.sh && echo " commit image " > /dev/console 2>&1 &
    [ -x /configs/pre_app_boot.sh ] && sh /configs/pre_app_boot.sh &
}
```

The hook appears on line 10 of the version captured here.

A later [rollback investigation](../firmware-slot-rollback/README.md) found automatic commitment in another component: cfgmgr runs bootfinish.sh and consumes /configs/swdl/auto_commit_flag through swdl_commit. The inactive line above therefore describes this init script, not the absence of commitment throughout the firmware.


The active line  warrants close reading:

- `[ -x /configs/pre_app_boot.sh ]` requires that the file exist and pass the executable test.
- `&&` makes running the script conditional on that test succeeding.
- `sh /configs/pre_app_boot.sh` explicitly invokes a shell interpreter. The file's executable bit is checked as a condition, even though `sh` is what reads it.
- The final `&` backgrounds the conditional shell list, so `boot()` does not wait for this hook to finish.

This differs from the visible G6 `replace_with_test.sh` invocation: the earlier hook is a foreground call inside its containing function, while the later hook is explicitly asynchronous. Neither code fragment, by itself, supplies a measured boot-time offset.

## Why `S99` does not mean “everything is ready”

OpenWrt-style startup uses numbered `/etc/rc.d/S*` entries to determine when init scripts are invoked. The captured symlink confirms that the `commit_image` boot function is configured for the `S99` stage. The same listing also includes other `S99` services, such as `cthulhu`, `robust_test`, and `urandom_seed`, so `S99commit_image` should not be described as “the final script” or as a guarantee that every application is ready.

Even a late-numbered script can start work in the background. Its return allows startup processing to continue without waiting for that work to complete. Conversely, the direct `replace_with_test.sh` call can hold up its own calling function until it returns. The distinction we can substantiate is foreground versus asynchronous invocation at the immediate call sites, not a stopwatch measurement of which hook starts or finishes first.

The new `ps w` capture gives a useful snapshot of the system when the inventory was collected. At that point `netifd`, `hostapd`, `cnssdaemon`, `ndbd`, `cfgmgr`, `dropbear`, and various Nokia management services were running. It also showed both a Telnet listener using `/bin/login` on port 23 and the author's separate development Telnet listener on port 2323. These processes tell us what was alive at that moment. They do not establish which of them was alive when either hook first executed; a short-lived startup hook would not necessarily still appear in `ps`.

Notably, the snapshot also contained a shell command line for `/etc/rc.d/S00startup boot`. That is a reason to be especially cautious about turning one process listing into a completed-boot timeline. We have evidence of registered scripts, their shell syntax, and current services, but no per-hook timestamp trace.

To inspect the same facts on another build without executing or changing either hook:

```sh
ls -l /etc/rc.d/S99commit_image /etc/init.d/commit_image 2>/dev/null
grep -n -B 8 -A 8 'pre_app_boot.sh' /etc/init.d/commit_image 2>/dev/null
sed -n '1,80p' /etc/init.d/commit_image 2>/dev/null
ls -l /configs/pre_app_boot.sh 2>/dev/null
```

An init-script call is evidence that the firmware can invoke the hook. To establish execution, check that the expected file exists, meets the caller’s mode check, and ran on that boot. The stock baseline had neither hook payload and no `/configs/debug` directory. G6-A and G6-B had owner-installed payloads on their active HJL banks. That confirms file placement and ownership history; the reported diagnostic did not trace invocation.

The persistent firewall configuration provides an earlier caller in both G6 builds. `S19firewall` runs before `S98pcd` and fw3 sources its configured script includes. The [firmware update lock](../../tutorials/disable-firmware-upgrades/README.md) starts its payload in a separate shell from an include. This depends on retained configs and firewall startup. Verification used isolated tests; a live boot with the include remains unverified.

## What each hook is good for and the failure modes to expect

The architectural distinction suggests different uses, without making either hook universally safe:

| Question                                                          | Early `wifi_fw_mount`-related hook                                                                        | Later `commit_image`-related hook                                                                      |
|-------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| When is it reached?                                               | In the `wifi_fw_mount` startup path on the examined HJL.L91 G6; exact offset not measured                     | During the enabled `S99commit_image` boot invocation on the examined G6; exact offset not measured     |
| Persistent script location                                        | `/configs/debug/replace_with_test.sh` (G6 HJL.L91) or `/configs/debug/wifi_test.sh` (newer Beacon 9)          | `/configs/pre_app_boot.sh`                                                                             |
| Does its presence alone prove the file ran or services are ready? | No                                                                                                        | No                                                                                                     |
| Does the visible invocation wait for the hook to return?          | Yes, within the containing function on this G6 (`&` absent); outer caller behavior still needs inspection | No: the conditional invocation ends with `&`                                                           |
| Is an image-commit job active in the captured script?             | Not part of this call site                                                                                | No: the `sleep 30 && /sbin/image_commit.sh ... &` line is commented out                                |
| Main risk                                                         | Long-running hook delays its immediate caller; resources may not be ready                                 | Async execution and races with other startup services; incorrectly assuming `S99` means full readiness |

Because the hook filenames and implementations are version-specific, a public repository should include a small compatibility statement for each verified device and image. A pathname found in one firmware is not a device-independent API.

A successful launch can still leave no listener later in boot. The ONT development script started Telnet when invoked manually, but the boot-launched port 2323 instance disappeared after an initial listening check. The stock authenticated port 23 server remained. The hook already set PATH and used the absolute daemon path.

The stock ONT `/etc/init.d/telnet` has a broader stop action than its start action: it starts port 23, but stops with `killall telnetd`. That can also terminate a development instance on port 2323. It is a plausible explanation for the observed boot interaction, although neither the supplied logs nor `logread` identified the actual terminating component. 

The [Telnet payload](../../tutorials/setup-persistent-unauthenticated-telnet/replace_with_test.sh) uses a separate shell watchdog. It checks every five seconds, validates recorded process identities, recreates a missing firewall rule and restarts a missing listener. The stock daemon and its port are left alone. A daemon restart disconnects existing clients; it restores the ability to connect afterward. `--stop` stops recovery as well as the managed listener. Runtime diagnostics stay in RAM.

This is runtime recovery, not a new persistence boundary. The same hook, filesystem, reset and upgrade limits still apply; killing the supervisor itself prevents recovery until the hook is invoked again. Local intercepted tests and their exact scope are retained in [the watchdog test resources](resources/telnet-watchdog-tests/README.md). A reboot with this revised payload has not yet been verified on the ONT.

## How I used the early hook during development

The original G6 hook became valuable for two separate experiments. One was making a selected `sec_cli` development override reappear after reboot without replacing the underlying stock multicall security program. Another was starting an optional, controlled-lab Telnet listener with explicit Linux process credentials. Both experiments relied on the same property: persistent files under `/configs` could trigger a *new* runtime action each boot.

The `sec_cli` experiment exposed a practical issue. Only one script exists at the exact pathname recognized by the examined HJL.L91 G6. If one tutorial overwrites that entire file, it can silently remove another experimental feature that used it. We therefore needed to treat the hook as shared infrastructure, with each action labeled, checked for prerequisite files, and made idempotent where possible.

The Telnet experiment also showed why a background startup mechanism can have major security effects. Its optional lab setup deliberately exposed an unauthenticated privileged shell on a network port. That is inappropriate on an ordinary production LAN or WAN. The [separate Telnet tutorial](../../tutorials/setup-persistent-unauthenticated-telnet/README.md) documents it as a development modification, not stock behavior or a default recommended configuration.

The newly discovered `pre_app_boot.sh` offers a second execution point on firmware where the call site exists, but it does not eliminate the need to understand when resources are ready. Moving code from an early hook to a later one may resolve some dependencies while introducing races with asynchronous operations.

Ideally, the earlier hook can be used to ensure your router stays jailbroken, by launching an alternate way for you to remote in. The later hook can be used to launch your own services like an AdGuard LXC container. 

## A practical way to investigate timing without assuming it

I collected the requested read-only inventory rather than adding timing code to a privileged boot hook. It resolved several questions immediately. The `/etc/rc.d` listing identified `S99commit_image`; the `wifi_fw_mount` excerpt showed the existence-and-executable checks for the HJL.L91 G6 hook; the `commit_image` excerpt showed the backgrounded late hook and disproved the previous claim of an active delayed image commit on this build; and the mount table confirmed persistent, writable UBIFS at `/configs`.

For another researcher, the same read-only commands are:

```sh
ls -l /etc/rc.d/S* 2>/dev/null | tail -30
grep -E -n -B 4 -A 10 'replace_with_test.sh|wifi_test.sh' \
    /etc/init.d/wifi_fw_mount 2>/dev/null
grep -n -B 8 -A 8 'pre_app_boot.sh' \
    /etc/init.d/commit_image 2>/dev/null
mount | grep ' /configs '
ps w
```

It is worth running these as separate commands or capturing the terminal transcript cleanly. In the supplied paste, the command echo and output overlap around the transition between `ls` and `grep`; fortunately, the actual hook source lines and symlink destinations remain legible. For determining the earlier hook's configured startup number, the full `/etc/rc.d/S*` listing or an exact search for `wifi_fw_mount` would be more useful than `tail -30`, which omits earlier entries.

These checks provide source-level launch behavior and a point-in-time process inventory, not a measured relative execution order. They cannot establish the instant `/configs/pre_app_boot.sh` started, whether that file existed on the captured boot, or whether every dependency was ready when it ran.

For a true timing study, the next evidence would be a serial boot log with timestamps or an explicitly opted-in, reversible timestamp trace at the start and end of each hook. A trace should record the event time and the specific hook name, without installing a privileged listener or replacing unrelated services. I would keep that separate from the static inventory, and would not give either hook a measured elapsed time until such observations exist.

## Persistence is not the same as secure boot, and a hook isn't automatically a vulnerability

These hooks operate inside Linux after the boot image has been selected and started. They do not by themselves change the bootloader's trust anchor, the FIT verification rules, or OTP fuses. They can be powerful because the invoking init process is privileged, but that is a different security boundary from signing and verifying a boot image.

Likewise, finding an executable hook in a vendor init script does not prove a vulnerability. The important unanswered question is who can create or modify the file in `/configs` and under what authentication or access conditions. In the documented development work, creating and maintaining the hook already required an authorized privileged session. A separate exposure would need separate evidence.

A boot-time script can also lock an owner out by changing authentication, networking, or file permissions repeatedly. Recovery planning should include a known-good copy of the script, a way to disable its execution, and confirmation that any changes made by it are truly scoped to the intended runtime paths. The fact that a path is writable says nothing about the safety of arbitrary code stored there.

## From reboot persistence to bank persistence

A persistent payload needs a caller in each bank that will boot. Both inspected builds still call `/configs/pre_app_boot.sh` in commit_image, and both have the S99commit_image startup link. Only HJL.L91 calls replace_with_test.sh in wifi_fw_mount. The [migration tutorial](../../tutorials/setup-startup-across-firmware-banks/README.md) therefore uses the shared late hook to run the existing payload with `sh`, while removing its execute bit to skip the early HJL invocation. The payload's behavior is unchanged, but its timing changes and must be tested.

There is another condition below the hooks: which physical data do they see? In both builds, `/etc/init.d/startup` reads cfg_partition from the shared U-Boot environment and adds `$cfg_partition:0:/configs` to UBI_MAP_LIST. It does not calculate that partition from active_part on every boot. If the variable is missing, it sets a default of rootfs_data[current] and enters migration handling. The legacy-upgrade path can also remap it.

Both CRC-valid environment copies on each captured G6 contain cfg_partition=rootfs_data1. Both live metadata captures mount `/dev/ubi6_0` at `/configs`, with boot logs attaching mtd6, named rootfs_data1. This holds for the first router booting rootfs0 and the second booting rootfs1. The shared selection explains how one stored launcher can serve either inspected bank. The physical partition named cfg, mtd7, is not the backing store for `/configs` in these captures.

The normal root upper layer remains RAM. `/lib/preinit/80_mount_root` calls ramoverlay; `/lib/functions/preinit.sh` calls link_before_overlay before pivoting. `/usr/exe/link.sh` creates selected runtime upper-layer symlinks into `/configs/overlay`, then startup calls link_after_overlay to seed missing targets from `/rom`. Both HB_Config.json files include `/etc/config`, `/etc/dropbear`, `/home`, `/etc/scfg`, Wi-Fi paths and related data in OverlayPersistentFileList. They do not make every file under `/etc` or `/usr` persistent.

### Preserving an authenticated shell route

The stock persistent-path mechanism offers an alternative to replacing a security binary on every boot. `/etc/dropbear` and `/etc/config` are both in the persistent list. The current Dropbear binary references `/etc/dropbear/authorized_keys`; its init script supports RootLogin, PasswordAuth, RootPasswordAuth, Interface and Port. Keeping a root-owned authorized_keys file and appropriate service configuration in those mapped paths is a candidate for ordinary key-authenticated management access without depending on replace_with_test.sh.

That establishes where the files can persist. It does not establish that Nokia's management daemons will leave the listener enabled, that a future image will retain Dropbear, or that the account/host-key/firewall configuration permits a connection. Check the resolved file targets, daemon arguments, key authentication and reachability on each bank. The stock upgrade list also deliberately refreshes `/etc/config/syslog`, `/etc/config/qcacfg80211` and `/etc/scfg`; its delete-common-config list is empty in these two builds. No blanket preservation rule follows for other images.

For production management, use authenticated access restricted to the management network. Reusing the lab's unauthenticated Telnet payload preserves that payload's original exposure; changing its launcher does not change its access control.

### Why this cannot promise every future upgrade

The clearest limit is in the vendor's own updater. Both platform_copy_config functions choose rootfs_data[1-active_part], detach it and invoke ubiformat -y. do_upgrade calls this function when SAVE_CONFIG=1, which is sysupgrade's default. Its commented archive-copy lines do not implement a copy. It has no cfg_partition exclusion. With the first captured state, active_part0 and cfg_partition=rootfs_data1, the formatting destination coincides with `/configs` storage. With the second captured state, active_part1, it chooses rootfs_data0 instead. A later bank change reverses that direction. This is a reachable source-level erasure risk; no live upgrade or format was performed to measure the result.

The reset code is a second limit. backdefault.sh backs up only its reset whitelists, clears the directories, then restores those entries. Neither custom `/configs/debug` nor pre_app_boot.sh is listed. startup also contains a format-and-recreate branch for mount/write failure and legacy configuration migrations. A persistent partition is writable flash, not an immutable recovery medium.

Even surviving data needs a compatible caller. A new firmware image may remove the hook, change the required binary ABI or account policy, and an upgrade package may include boot or partition-table components mapped to ssb and uboot-env. Copying a script into both temporary root overlays, or putting its payload on `/opt` while losing its launcher, does not solve that boundary.

### Which UART changes are already outside the banks?

The [UART enablement tutorial](../../tutorials/enable-uart-console/README.MD) writes console in shared mtd1 uboot-env. The [U-Boot en tutorial](../../tutorials/unlock-uboot-en-console/README.MD) changes logical SECURITY.EXT_BOOT_PWD in shared mtd9 extfs. Their helper programs happen to run under Linux, but those settings are not modifications of the running rootfs. Both captured SSBs retain the factory en verifier. Merely switching a Linux bank does not replace these shared regions.

The [post-Linux UART tutorial](../../tutorials/unlock-uart-root-shell/README.MD) is different: its custom public key or helper is reapplied into the runtime filesystem. It needs the stored files, a working launcher and a compatible verifier. The public-key approach avoids copying a version-specific replacement executable, but still depends on the hook completing before authentication.

I would keep the separately stored UART/en recovery settings, test the common late launcher on each known bank, and retain off-device payload and firmware backups. Before a firmware update, inspect the new rootfs caller, included boot components and data-formatting targets. If an update would erase the launcher storage or remove its caller, arrange a separate tested recovery/install path first. There is no demonstrated script-only guarantee against arbitrary future vendor upgrades, factory resets or flash loss. U-Boot access itself is a recovery foothold, not proof that a particular Linux root-shell procedure will still work.

The [UART recovery procedure](../uart-recovery-from-uboot/README.md) gives an independent route when the overlay launcher disappears. On HJL rootfs0, the stock FIT passed RSA/SHA checks and booted a UID 0, PID 1 shell with `init=/bin/sh`, before normal Nokia startup. It required initializing the partition map in RAM before accessing named UBI partitions. A later session mounted the configuration volume read-only, but reported deferred UBIFS recovery and a database snapshot differing from an earlier normal-boot view. Restoration and older-bank recovery remain untested.

## Related writeups

- [Firmware architecture](../firmware-architecture/README.md) for where these hooks fit among Nokia's startup services and data-model daemons.
- [Storage and flash](../storage-and-flash/README.md) for the temporary root overlay versus persistent UBIFS explanation.
- [Boot and console](../boot-and-console/README.md) for why post-Linux hooks are not U-Boot authentication changes.
- [OpenWrt init scripts](https://openwrt.org/docs/techref/initscripts) for the general `S*` invocation model; the vendor source lines above remain the primary evidence for these particular hooks.
