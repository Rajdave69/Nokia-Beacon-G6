# Persistent unauthenticated `uid=0,gid=0` Telnet using the startup hook

## Introduction

During the Beacon G6 reverse-engineering work, one particularly useful discovery was that the stock firmware already contains a development-style startup hook. If the file `/configs/debug/replace_with_test.sh` exists and is executable, Nokia's normal boot scripts run it during startup.

This early hook is present in the examined `HJL.L91` firmware, but **absent from older `IJL.J03`**. If your router runs the older bank, use the [common late-hook migration](../setup-startup-across-firmware-banks/README.md) after installing the payload, as explained in the persistence section.

That hook is useful because `/configs` is persistent UBIFS storage while the normal root filesystem is a read-only squashfs with a RAM-backed writable overlay. A file placed only under `/usr` or `/etc` at runtime can disappear after reboot, but a script kept in `/configs` survives and can re-apply development changes every time Linux starts.

This tutorial uses that existing hook to launch BusyBox `telnetd` on TCP port `2323` with `/bin/sh` as its login program.

There is deliberately **no username or password prompt**. The listener is intended as a development convenience on a controlled LAN.

The goal is also more specific than simply “get a root shell.” The existing `ONTUSER` account on the analyzed firmware has UID 0 but does not use the root group as its primary group; it reports `uid=0(root) gid=102(wheel)`. A process launched normally from that shell therefore inherits GID 102.

The startup hook runs much earlier and can use BusyBox `start-stop-daemon -c 0:0` to request both UID 0 and GID 0 for `telnetd`. A shell reached through the listener consequently reports:

```text
uid=0(root) gid=0(root)
```

A small terminology correction is useful here: this is sometimes described as wanting “uid=0 pid=0.” PID 0 is the kernel's idle/scheduler context and is not a normal userspace process. The relevant userspace identity is **UID 0, GID 0**.

### What you will do

You will confirm that the vendor hook exists, verify that `/configs` is persistent, check that BusyBox can launch a process under UID/GID `0:0`, install the supplied hook script, reboot, connect to TCP/2323 from your development machine, and confirm that the shell is running as `uid=0,gid=0`.

### What you need

You need an existing privileged shell, a trusted development LAN, and the included `replace_with_test.sh`.

> [!caution]
> This configuration intentionally exposes an unauthenticated root shell. Any host that can reach TCP/2323 can execute commands as root. Do not expose it through WAN, guest, or other untrusted networks.

---

## 1. Confirm that the firmware really has the hook

The hook is invoked by Nokia's stock `wifi_fw_mount` init script. Inspect the relevant section with:

```shell
grep -n -A12 -B3 \
    'test.sh' \
    /rom/etc/init.d/wifi_fw_mount
```

> [!NOTE]
> Newer firmware on newer Nokia Beacon models (Beacon 9) uses `wifi_test.sh` instead. Please verify with the above command
> Older firmware on the Beacon G6 doesn't have this early startup hook at all. 

You should see code that checks for `/configs/debug/replace_with_test.sh` and executes it when the file is present and executable.

This matters because the persistence technique is **not** an added init-system modification. We are using a call site that already exists in the vendor firmware.

For a deeper explanation of how the startup hooks and persistent storage work, see the [startup persistence knowledgebase](../../knowledgebases/startup-persistence.md).

## 2. Confirm why `/configs` survives reboot

Run `mount | grep ' /configs '`. On the analyzed unit, `/configs` is a UBIFS volume, for example:

```text
/dev/ubi6_0 on /configs type ubifs
```

Now compare that with the root filesystem using `mount | grep -E ' on /rom | on / type overlay'`.

The important layout is:

```text
/rom      read-only stock squashfs
/         writable runtime overlay
/configs  persistent UBIFS
```

The hook script belongs in `/configs` because that is the part of this arrangement intended to survive a reboot.

## 3. Confirm the two programs the hook relies on

The script uses BusyBox `start-stop-daemon` to choose the process credentials and BusyBox/Nokia `telnetd` to provide the network shell.

First check that this build of `start-stop-daemon` supports `-c USER[:GRP]`:

```shell
/sbin/start-stop-daemon --help 2>&1 |
    grep -E -- '-c|USER|GRP'
```

The relevant capability is `-c USER[:GRP]`. We will pass `-c 0:0`, which explicitly requests root UID and root GID.

Then locate `telnetd` with `command -v telnetd`. If that prints nothing, check `/usr/sbin/telnetd`, which is the fallback path used by the supplied script.

## 4. Install the persistent hook

Transfer `replace_with_test.sh` to `/tmp/replace_with_test.root-telnet.sh` on the router.

Install it as the filename the stock boot script expects:

```shell
mkdir -p /configs/debug

cp /tmp/replace_with_test.root-telnet.sh \
   /configs/debug/replace_with_test.sh

chmod 700 /configs/debug/replace_with_test.sh
sync
```

If `/configs/debug/replace_with_test.sh` already contains Password2 or another development overlay, do **not** overwrite it. Merge the Telnet section into the existing script instead. The vendor provides only one hook pathname, so multiple development features need to coexist in that one file.

## 5. Understand what the supplied script does

Before rebooting, read it with `cat /configs/debug/replace_with_test.sh`.

The script does not immediately block the early init service while waiting for the rest of networking. It starts its Telnet setup from a background subshell and waits roughly 20 seconds before launching the listener.

The actual daemon is started through `start-stop-daemon` with credentials `0:0`. The important launch is equivalent to:

```sh
/sbin/start-stop-daemon \
    -S -b -m -p "$PIDFILE" \
    -c 0:0 \
    -x "$TELNETD" \
    -- \
    -F \
    -p "$PORT" \
    -l /bin/sh
```

`telnetd -l /bin/sh` tells Telnet to execute the shell directly rather than handing the connection to a login program. That is why there is no authentication prompt.

The script also inserts an INPUT rule for TCP/2323 if an equivalent rule is not already present. It checks with `iptables -C` before using `iptables -I`, so manually re-running the script should not intentionally add the same rule over and over.

## 6. Reboot and let the normal boot hook start the service

Run `sync` and `reboot`.

Allow the router to complete Linux startup. The supplied hook waits before launching Telnet, so do not expect port 2323 to be open the instant the kernel starts.

If you still have another shell path available, inspect `/configs/debug/telnet-root.log`. The log should show the hook starting, the launcher's credentials, the selected `telnetd` path and port, and the return code from `start-stop-daemon`.

You can also confirm the firewall rule with:

```shell
iptables -L INPUT -n --line-numbers | grep 2323
```

and locate the daemon with `ps | grep '[t]elnetd'` or `pidof telnetd`.

## 7. Connect from the trusted development computer

From another machine on the same controlled LAN, connect to the router's LAN address on port 2323:

```shell
telnet ROUTER_IP 2323
```

There should be no username or password request. The connection should open directly into `/bin/sh`.

Run `id`. The significant result is:

```text
uid=0(root) gid=0(root)
```

You can also run `echo $$` to see the shell's process ID. It will be an ordinary positive userspace PID, not PID 0.

At this point you have confirmed all three parts of the mechanism: the persistent vendor hook ran, it started `telnetd`, and `start-stop-daemon -c 0:0` gave the network shell the intended UID/GID.

---

## Starting the hook manually without rebooting

For quick testing, you can execute `/configs/debug/replace_with_test.sh` yourself. The background setup still waits for the delay configured in the script.

A reboot remains the cleaner final test because it proves that the stock `wifi_fw_mount` hook, not your current interactive shell, is what starts the listener.

Be aware that repeatedly launching the script manually can create confusing process state if a previous `telnetd` instance or PID file is still present.

---

## Restricting the listener to a specific LAN

The supplied example adds a general INPUT accept rule for TCP/2323. On a dedicated lab router that may be sufficient, but if you know the exact trusted subnet it is better to restrict the rule.

For example:

```shell
TRUSTED_NET='192.168.1.0/24'

iptables -I INPUT \
    -p tcp \
    -s "$TRUSTED_NET" \
    --dport 2323 \
    -j ACCEPT
```

If you modify the hook this way, make the corresponding `iptables -C` and removal commands include the same source subnet so that the rule remains idempotent.

Do not create a WAN port-forward to this service. There is no authentication and no transport encryption.

---

## Stopping the listener

If the supplied PID file exists, you can stop that instance with:

```shell
PID="$(cat /tmp/root-telnetd.pid 2>/dev/null)"

if [ -n "$PID" ]; then
    kill "$PID"
fi
```

If necessary, `killall telnetd 2>/dev/null` stops all Telnet daemons.

Remove the firewall rule with:

```shell
iptables -D INPUT \
    -p tcp \
    --dport 2323 \
    -j ACCEPT \
    2>/dev/null || true
```

To disable persistence completely, either remove the Telnet section from `/configs/debug/replace_with_test.sh` or make/remove the entire hook if nothing else uses it.

If Telnet is the only feature using the hook, the simplest full disable is:

```shell
chmod -x /configs/debug/replace_with_test.sh
sync
reboot
```

If Password2 or another overlay also uses the same hook, edit only the Telnet block instead.

---

### Disabling it after the common late-hook migration

The chmod-x command above disables the original executable early hook. After migration, the late wrapper deliberately invokes the payload with `sh`, so changing that payload's execute bit no longer disables it. Remove only the Telnet action from a shared payload, or, if the entire payload should be disabled, rename it away from `/configs/debug/replace_with_test.sh` while retaining a backup. This also disables any UART override in the same file. Review the late wrapper and keep another access route before removing it. A process already running must still be stopped separately.

## Why this produces GID 0 when ONTUSER does not

The result comes from process credentials, not from Telnet itself.

The stock `ONTUSER` shell on the analyzed firmware is root by UID but uses the `wheel` group as its primary GID. Starting a child normally from that shell causes the child to inherit that group.

The startup script instead asks `start-stop-daemon` to switch explicitly to `0:0` before executing `telnetd`. `telnetd` then launches `/bin/sh` with those credentials.

That is why the Telnet shell reports both `uid=0` and `gid=0`.

---

## Why the shell comes back after every reboot

`telnetd` is not persistent by itself. Every reboot destroys the process.

What persists is `/configs/debug/replace_with_test.sh`. During the next boot the stock firmware sees that script, executes it, and the script starts a **new** `telnetd`.

The full relationship is:

```text
persistent /configs/debug/replace_with_test.sh
        |
        v
stock wifi_fw_mount init script executes it
        |
        v
start-stop-daemon -c 0:0
        |
        v
telnetd listens on TCP/2323
        |
        v
telnetd launches /bin/sh for each connection
```

Once this distinction is clear, the startup hook becomes useful for more than Telnet: the same persistent script can re-apply runtime overlays such as the custom Password2 public key or `sec_cli` development binary after the read-only stock root filesystem is mounted.


## Persistence across firmware banks and upgrades

The `telnetd` **process** and its firewall rule are ephemeral; the hook must start a new process on each boot. The payload under `/configs/debug/replace_with_test.sh` is on persistent UBIFS storage in the examined setup, but its execution is **firmware-dependent**. The early `wifi_fw_mount` caller exists on current `HJL.L91` and is **absent** from older `IJL.J03`. Both known banks instead contain the later `/configs/pre_app_boot.sh` caller. For operation on either known bank, first finish the original setup, then follow the [shared late-hook migration](../setup-startup-across-firmware-banks/README.md).

That migration runs the existing payload with `sh`, deliberately sets its permissions to mode `600` so the HJL early executable test no longer invokes it, and installs an executable late wrapper. **Do not run `chmod 700 /configs/debug/replace_with_test.sh` after migrating**, and do not assume `chmod -x` will disable it. The actual listener, runtime firewall, and authentication/reachability need separate validation after each boot.

A firmware-bank switch alone need not erase `/configs` on these two devices because their saved `cfg_partition` points to the same `rootfs_data1`, but an upgrade may format that data partition, and reset/migration paths can delete custom files. Even if files survive, the new firmware may not execute their hook. This is **not a guaranteed persistent service** across arbitrary upgrades, nor a safe configuration for any untrusted network.
