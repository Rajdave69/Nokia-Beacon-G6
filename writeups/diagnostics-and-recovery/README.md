# How HomeOS detects failures and attempts recovery

What happens when a router service stops, the WAN stops responding or Linux crashes? The answer is not a single watchdog. In the examined HomeOS builds, different programs watch different things, and their responses range from collecting a log to restarting one process or requesting a board reboot. Following the owner of a failure is the key to understanding what the firmware can actually recover.

This investigation traces saved Beacon G6 HomeOS 24.02 `IJL.J03p01` and 24.04 `HJL.L91p01` firmware, with the Beacon 9 HomeOS 25.03 `JJM.K44p01` as a comparison on different hardware. The original G6 PCD parser was exercised offline under emulation with external effects intercepted. No failure, reboot or watchdog operation was induced in this investigation. A packaged rule or configured default is not proof that the same monitor was active on a live device.

## The firmware examined

| Profile | Image | HomeOS | Build date | Packaged PCD rules |
| --- | --- | --- | --- | --- |
| G6 HJL | `3FE49996HJLL91`, `HJL.L91p01` | 24.04.00 | 2024-12-27 | 51 |
| G6 IJL, older captured slot | `3FE49996IJLJ03`, `IJL.J03p01` | 24.02.00 | 2024-07-02 | 45 |
| Beacon 9 JJM | `3TN01100JJMK44`, `JJM.K44p01` | 25.03.00 | 2025-11-13 | 52 |

These are software profiles, separate from the [device aliases](../README.md). A packaged `ACTIVE = YES` rule does not establish that its gates are satisfied on a running router. This investigation does not attribute every difference to the HomeOS release: the Beacon 9 also uses different hardware.

## Start with the kind of failure

A daemon exiting, a WAN probe failing and a kernel panic are different events. A supervisor can restart a child while Linux continues running; a panic can reset the board before userspace responds; a WAN probe can report loss of connectivity without any process crashing. Start with the event, then follow the responsible path.

| Component | What it watches or collects | What can happen |
| --- | --- | --- |
| `procd` | Its configured service instances, including PCD; Linux watchdog feeding | Respawn a process; maintain or stop the watchdog feeding timer |
| PCD, `/usr/bin/pcd` | Rules in `/etc/pcd`, dependencies, readiness conditions, child state and optional heartbeats | Leave a failed rule stopped, restart it, run another rule, or request a board reboot |
| `/usr/bin/diagnosis` | System information, log-space pressure and separately registered `/tmp/daemon/*.dm` processes | Collect/compress diagnostics, prune logs, run a recovery handler, or reboot after a monitored failure |
| `/usr/bin/wanlived` | WAN connectivity, IPv4/IPv6 probes, WAN status and Internet/IPTV LEDs | Update connectivity state and notify other components; its packaged failure action is `NONE` |
| `fonendoscope` | Configured HomeAgent process group | Expose process inventory and lifecycle operations through local ubus |
| `/usr/bin/crashcapture` | A crashing process's core stream, supplied through the kernel core hook | Store and compress crash evidence, subject to space/size handling |
| Kernel settings | Kernel panic and oops | Packaged settings request panic on oops and reboot three seconds after panic |

These layers can overlap. A PCD child might also have a diagnostics monitor record, and a daemon started elsewhere might never be managed by PCD. Finding a binary or rule is only the first step in establishing ownership.

## If a managed service fails: PCD

PCD is Nokia's process-control daemon. Its rules describe when to launch a service, what it must wait for, and what to do when it fails. `procd` supervises PCD itself, so restarting PCD and restarting one of its children are different events.

`/etc/init.d/pcd` starts at priority 98 under `procd`. It runs:

```text
/usr/bin/pcd -v -f /tmp/all.pcd -e /logs/pcd.logs
```

The init script builds `/tmp/all.pcd` from the files in `/etc/pcd` **only if that aggregate file does not already exist**. Editing a rule and restarting PCD therefore does not necessarily rebuild an existing aggregate. The script rotates `pcd.logs` into `pcd.logs.0` at startup when the former exceeds 51,200 bytes; this is not continuous log rotation.

The empty `procd_set_param respawn` uses `/lib/functions/procd.sh` to supply configured service values or the fallback tuple `3600 5 5`: failure threshold, restart delay and retry limit. These are a different policy from an individual PCD rule's `FAILURE_ACTION`.

A representative rule supplies its name, start condition, command, scheduling, daemon status, end condition, timeout, failure action and active switch. `RULE_COMPLETED` means that every listed dependency must reach PCD's internal completed state. It does not mean that a prerequisite daemon must have exited. A long-running daemon can be ready and completed from the dependency graph's point of view.

The native predicate was tested with two synthetic dependencies: one ready dependency was insufficient; both ready returned success; substituting a waiting or failed dependency returned failure. Commas are accepted as delimiters too, explaining the shipped `lcm_adapter.pcd` syntax.

Four rules explicitly use `FAILURE_ACTION = REBOOT` in all three profiles:

- `service_cfgmgr`: configuration manager, with socket readiness at `/tmp/cfgmgr_socket`.
- `service_dbmgr`: encrypted database manager, with `/tmp/ndbd_socket` readiness and a 300,000 ms timeout.
- `service_ndk_appsd`: part of the NDK service chain.
- `service_ndk_wand`: WAN manager, distinct from `wanlived`.

This matters when experimenting with a replacement userspace: breaking a dependency or readiness handshake can reach a reboot policy even if the kernel and Ethernet driver work.

By comparison, `diagnosis.pcd` uses `RESTART`, and the G6 `wanlived.pcd` and `web.pcd` use `NONE`. `NONE` describes that rule's recovery response; it does not protect the process from another supervisor or prove a WebUI cannot return through another path.

The parser supports limited restart counts, `FAILURE_ACTION2`, `FAILURE_ACTION_NEXT`, `FAILURE_INTERVAL`, `FAILURE_RESET_COUNT` and `ALIVE_TIMEOUT`. A bare `RESTART` parses with restart limit `-1`, reset count zero and interval zero; it does not silently mean “reboot after a few tries”. The packaged `obuspa` rule specifies a 75,000 ms alive timeout. The full [policy matrix](resources/pcd-policy-matrix.md) retains every rule and gate.

One parser detail is easy to miss: values `4294968` for the interval and `1194` for the reset window were accepted despite exceeding the ranges documented in comments. Nonnumeric interval input was rejected. These were parser-only tests; they do not establish how overflowing runtime timer arithmetic behaves.

PCD's control API uses local Unix datagram sockets and shared memory, not a demonstrated TCP management port. The G6 library has operations for start, terminate, synchronous terminate, kill, ready, signal, state, network-receive reduction/restoration and ping. Sending a lifecycle request is an action, even when the interface looks like a status/debug API. Socket permissions and effective runtime ownership were not tested here.

The reboot wrapper also deserves care: `PCD_api_reboot` can fall back to `reboot -f`. In the G6 library it searches for `/usr/sbin/pcd`, while the packaged executable is `/usr/bin/pcd`; its search compares the process name from `/proc/<pid>/stat` without basename normalization. The exact live process name was not checked. Calling this wrapper is therefore not a harmless way to test whether PCD is present.

## If a separately monitored process fails: diagnosis

PCD is not the only process monitor. The diagnostics daemon maintains another list with its own checks and escalation rules. Explaining a reboot needs active records and logs, not just a similarly named PCD rule.

`diagnosis` uses the Nokia message-manager interface and maintains its own process-monitoring records in `/tmp/daemon/*.dm`. This is separate from PCD's rule database.

The G6 parser reads six lines from each record: process name, numeric policy, checking command, a numeric field labelled `tc`, handler name and PID. The native record is 112 bytes. The health check first executes `kill -0 <pid>`. If the PID exists and a checking command is present and does not start with `null` (case insensitive), it executes that command. Its elapsed time is measured; the observed two-second comparison logs a slow check, rather than enforcing an execution timeout.

Failed records move through active and inactive lists. A nonzero policy reaches the process-recovery branch, which logs the failure and invokes the configured handler. A zero-policy record is rechecked and can reach the system-reboot branch. Filling the four-entry inactive list also has a system-reboot path. This means the monitoring plane cannot be understood solely by looking for `REBOOT` in PCD files.

Handlers are formatted as `/bin/sh /usr/exe/<handler>`. Before a system reboot, the daemon attempts to wait for crash capture: an initial two-second wait followed by up to fifteen 20-second waits while the crash-capture semaphore reports activity. It then runs `reboot`, waits ten seconds, attempts `reboot(RB_AUTOBOOT)` and finally aborts if that returns. These are native control-flow findings, not a reboot test.

References to monitor records appear in components including `cfgmgr`, `bdemgr`, `ndk_appsd`, `guestdev`, `libnal` and `ddm`; the `obuspa` stop wrapper removes its record. A filename-removal reference does not prove that the same component creates the record. We have not collected the live directory or proved which records currently exist, which handlers are selected or the intended unit/complete use of `tc`.

## What evidence does diagnosis keep?

The daemon has a debug-message command vocabulary for timer/file settings and a command run list. The compiled help gives a timer range of 2–60 minutes, file-size range of 1–1024 KiB and at most five selected command indices. These names are not established as shell command-line arguments.

Its compiled command catalogue is the same in the three examined profiles:

```text
1   ps
2   cfgcli dumpwan
3   wand dump
4   bs /b/e system max_prints:-1
5   bs /b/e gpon max_prints:-1
6   bs /b/e cpu max_prints:-1
7   bs /b/e gem
8   bs /b/e tcont
9   bs /b/e egress_tm  max_prints:-1
10  cat /proc/interrupts
11  cat /proc/softirqs
12  ritool dump
```

The optical/Broadcom command names are shared firmware material. Their inclusion does not demonstrate that those tools work on a Cortina Beacon G6. `ritool dump` can include device identifiers; diagnostic archives should be reviewed before publication.

`/usr/exe/diag_script.sh` adds the date, uptime, memory/slab information, selected process statistics, `top`, filesystem usage and directory sizes to its output file. Referenced working/archive paths include `/tmp/sysinfo.log`, `/configs/sysinfo.tgz`, `/logs/sysinfo.log`, `/logs/sysinfo.tgz` and `/logs/sysinfo1.tgz`. Runtime defaults, selected profile and debug-message caller routing still need a focused live/static follow-up before presenting an operational client.

Log pressure can erase evidence. Native cleanup includes removing archive files, truncating files over 2,200,000 bytes, removing database/fatal-log families, and a further whitelist-based cleanup. The whitelist includes `messages`, `messages_kern`, `messages_component`, `reboot.log`, `customer`, `pcd.logs`, `pcd.logs.0`, `reboot.reason`, `pstore`, `kmsg`, `partition_format.log`, `.default.log` and `.default.bak`. This does not promise unlimited retention or protection in every cleanup phase.

The helper named `check_logs_partition` reads the **total size** field from `df`, classifying totals above 3,071 KiB differently from smaller ones. It is not itself a free-space measurement; separate cleanup logic handles space pressure.

## If the Internet connection fails

`wanlived` starts after `service_cfgmgr`. It owns the `nokia.wanlived` bus name and emits status through `nokia.wanalive`. It receives LAN-host/IPTV LED events and keeps IPv4/IPv6 connectivity, gateway/DNS/probe and service state. The main loop registers a one-second timer.

Its local management endpoint is `/tmp/wand_socket`, a Unix stream socket with listen backlog five. Starting the program also changes `net.ipv4.ping_group_range`, opens network sockets and registers with the message manager; launching another copy is not a read-only diagnostic. The `wand dump` catalogue entry points toward its local status path, but the full command framing and effective permissions have not been verified in this pass.

The observed startup, probe, LED and notification paths do not establish that losing Internet access directly requests a reboot. Conversely, `service_ndk_wand` has an explicit PCD reboot policy. Treating the two WAN-related programs as the same watchdog would obscure that distinction.

## If a process crashes or the kernel panics

The packaged `/etc/sysctl.d/10-default.conf` supplies:

```text
kernel.panic = 3
kernel.panic_on_oops = 1
kernel.core_pattern = |/usr/bin/crashcapture /logs %e %p %s 5000000
kernel.core_pipe_limit = 5
```

`/etc/init.d/sysctl` applies the files in `/etc/sysctl.d` before `/etc/sysctl.conf`. These are packaged defaults, not a readback of the live kernel. Per-process core limits and dump eligibility still determine whether a particular failure yields a core.

The core hook supplies a program name, PID, signal and 5,000,000-byte compression-block parameter. `crashcapture` also obtains the parent PID. It creates evidence under a `core` directory with names containing the program, timestamp, PID, parent PID and signal, and uses `/tmp/crash_capture_lock` plus `/tmp/crash_capture_cache`. `/configs/coredump_max_filesize` controls its size budget; the G6 fallback is 5,242,880 bytes, with a configured minimum of 200,000 bytes. That budget and the compression-block parameter are different values.

There is a special program-name-prefix path for `siege`, labelled JVM/IoT in the binary, which selects `/flash/smarthome` and bypasses the usual compression path. The shared diagnostic code therefore contains branches that need not be used by ordinary Beacon applications.

`/etc/inittab` clears the core pattern on shutdown before the shutdown scripts. `/usr/exe/post_reboot.sh` also clears it, records the reboot reason, saves the configuration database and invokes DataGuardian log backup. Its Ethernet-disable function is defined but is not called by the shown top-level script. The complete caller chain into this vendor shutdown script remains unverified.

`restore.sh`, despite its generic name, sets the factory-reset flag, invokes factory defaults and runs `jffs2reset -y`. It should not be treated as a harmless repair command. The [factory-reset](../factory-reset/README.md) and [storage/flash](../storage-and-flash/README.md) writeups cover those broader state changes.

## Stopping the watchdog feeder is not the same as disabling the watchdog

`post_reboot.sh` calls `shutdown_wtd.sh 20`. That helper sets the procd watchdog timeout and submits `stop: true`. The function name `watchdog_disable` and the script's comment can be misleading.

In the original G6 `procd`, `stop: true` cancels the userspace feeding timer. It writes the watchdog magic-close byte `V` and closes the device only when the separate `magicclose` setting is true and the descriptor is valid. Actual hardware behavior also depends on the driver. A status labelled stopped therefore does not, by itself, prove that the hardware has been disarmed.

This is distinct from my earlier U-Boot recovery procedure, where `wdt dev watchdog@0xf432901c` followed by `wdt stop` was reported to stop the bootloader watchdog. A temporary PID1 shell bypasses normal userspace initialization and may leave an inherited watchdog unfed. See the [boot/console writeup](../boot-and-console/README.md) for the tested recovery route and its scope.

For a future OpenWrt port, preserve the distinction between bootloader watchdog state, Linux watchdog ownership, PCD process health, crash handling and bank rollback. Removing a daemon is not a complete recovery design.

## Other supervisors and misleading names

The G6 `fonendoscope` ubus object has five registered methods: `processes`, `stop`, `start`, `restart` and `action`. The lifecycle methods take a string named `process`; `action` declares `enable` and `processlist`. `/usr/exe/HomeAgent.sh` already calls its lifecycle methods.

The [HomeAgent follow-up](../homeagent-and-fonendoscope/README.md) traces the independent board setup and cloud activation paths. Its native exit callback retries the individual child.

The packaged UCI configuration selects `restart_policy all`, duration 600, retries 100, statistics timeout 10 and user `appService`. This is a separate group supervisor. Its policy and methods are not evidence that it is currently running, reachable remotely or rebooting the whole board. The complete HomeAgent activation graph, authorization and crash-report destination remain a separate investigation.

`watchquagga` is a Quagga routing-daemon monitor with individual/global/phased restart modes. Its existence does not show it owns the UART shell or is active. `sec_monitor` belongs to the security-engine/local-debug lifecycle. `registerReboot` is especially easy to misread: the examined binary uses `libdiag` and CoreSight/QDSS trace configuration, including Qualcomm Wi-Fi paths. Its name is not proof that it is a general reboot-request command. The diagnostic socket init script is gated by `wifi_ftm_mode` in the kernel command line; it is not proof of a default network listener.

## What changed across the captured builds?

The older G6 slot already has the central PCD, diagnosis, WAN-health, core-capture and procd structure. The two G6 PCD executables differ as whole files, but their `.text` sections match; `libpcd` and `libipc` code sections also match. `procd`, `crashcapture` and `fonendoscope` are byte-identical whole files. `diagnosis` and `wanlived` are not identical, so their native branches should be compared rather than assumed interchangeable.

HJL adds eight PCD files and removes the older `container` and `pluginmgr` files. It removes the `/tmp/dhcpsnoop_boot` start gate from `dhcpsnoop`, changes the rpcd invocation and adds console redirection to the Wi-Fi scheduler. The four direct reboot-policy rules remain the same.

On the Beacon 9, `diagnosis` explicitly waits for `service_msgmgr`, the web rule uses an `/etc/httpd.conf` gate and `appService` invocation with `RESTART`, and `rlyeh` moves to a wrapper gated by `/tmp/uspRawAdded`. Its table contains 52 rules, with `nokia-api` and `wifihost` added and `uspCfgUpdate` absent relative to G6 HJL. The complete comparison is retained in [comparisons.json](resources/comparisons.json).

## Verification and remaining work

Eight original-parser cases passed offline, including the 51-rule HJL and 45-rule IJL configurations. The test intercepts process, signal, reboot and socket actions and replaces the original main function, so it verifies parsing/defaults and a dependency predicate, not supervision or recovery on hardware. Native traces cover 24 complete `.text` sections across the three profiles; the Beacon 9's sectionless `procd` and `registerReboot` were explicitly excluded from that coverage.

The next useful checks are read-only live snapshots of PCD's aggregate rules, actual monitor records, watchdog settings, core pattern and existing logs. Diagnostic debug-message framing, every WAN command, effective socket permissions, full timer/escalation behavior and the HomeAgent failure graph remain bounded follow-ups. No failure was induced, no crash/reboot was requested, and no router setting was changed.

[Research resources and reproduction](resources/README.md) retain the sources, exact addresses, policy matrix, fixtures and complete outcomes. The [knowledgebase](../../knowledgebases/diagnostics-and-recovery.md) holds the full continuation context.


## Orderly manual shutdown

On a normally booted G6, use `/sbin/poweroff` without flags. Stock `/etc/inittab` runs `/etc/init.d/rcS K shutdown`, and the stock unmount stop script runs `sync` and `umount -a -d -r`. Wait for shutdown to finish on UART before unplugging. The saved files establish the software path. Board power, LED and watchdog behavior after halt were not tested. [BusyBox applet reference](https://www.busybox.net/BusyBox.html).
