# Disabling firmware upgrades on the stock Beacon G6

Turning off TR-069 and TR-369 does not turn off Nokia's own OTA service. The G6
also has swmgnt, which polls Nokia's software service and coordinates downloads
and activation through the cloud, mobile app, portal and mesh. Its SwMgnt enable
field defaults to 1 in the inspected schema. Whether a particular router can
actually obtain a release still depends on its configuration and enrollment.

I wanted a way to hold the installed firmware while keeping the stock kernel
and drivers. This procedure disables the remaining OTA setting and installs a
reversible lock over the known Linux update paths. It covers the two builds we
have inspected: HJL.L91p01 and IJL.J03p01.

**This has been tested offline, not on a live router.** The scripts passed 18
isolated integration cases across the two builds. The original UCI executables
also accepted the configuration in temporary test directories. A real offline
boot, mount check and service check are still required before reconnecting it.

## What is being disabled

| Path                                                    | What stops it                                                                                                                            |
|---------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| Nokia cloud polling, app/portal and mesh-triggered OTA  | Disable SwMgnt; mask swmgnt and make its next-boot PCD rule inactive with no failure restart.                                            |
| TR-069/TR-369 firmware requests                         | Keep their management controls disabled; the common Linux write and activation backends are also masked.                                 |
| WebUI firmware upload and OTA trigger                   | Mask upgrade_web_app.cgi and otasw_upgrade_app.cgi.                                                                                      |
| Local swug firmware installation and local RPC upgrades | Mask sysupgrade, imageTool, upgraded and the activation helper they reach. swug itself remains available for diagnostics and commitment. |
| Vendor batch provisioning                               | Mask batch_upgrade, including its cfgmgr launcher path.                                                                                  |
| Retained ca.upgrade utility                             | Mask the executable.                                                                                                                     |
| Activation of a previously downloaded image             | Mask image_activate.sh. An already-written boot selection is a separate prerequisite below.                                              |

The files in the stock SquashFS are not rewritten. A small script that returns
126 is bind-mounted over nine executable paths. The original files remain under
/rom, and removal unmounts the guards. No MTD partition is erased or written.
The normal image_commit helper is left available.

This stops the identified stock Linux update mechanisms. It is not a hardware
write lock: an administrator with root can undo it or use raw MTD/UBI tools,
and U-Boot recovery remains available. Factory reset, lost /configs, a removed
firewall include or a different firmware can remove the protection. It does not
promise that a router already compromised as root cannot alter its firmware.

---

## Steps

### 1. Disconnect uplinks and check for an existing update

Use a local root shell. Disconnect Internet and mesh/backhaul uplinks before
installing; keep only your isolated management connection. The installer flag
below records that you have done this, rather than detecting physical isolation.
Do not interrupt an upgrade that is already writing flash or rebooting.

Inspect the current state:

```sh
cat /etc/buildinfo
cat /proc/cmdline
swug -d
fw_printenv -n active_part
fw_printenv -n sb_flag
fw_printenv -n cfg_partition
ps w
```

Check the actual running bank as well as Next Active. The stock Active label
can be inferred from commitment rather than the running kernel. If an update
has already selected a different bank for the next boot, resolve that using the
[bank-selection writeup](../../writeups/firmware-slot-rollback/README.md) before
continuing. This lock deliberately does not rewrite boot-selection metadata;
blocking future activation cannot undo an activation that has already happened.

The installer refuses known burning markers and running flash-helper names.
A stale marker needs investigation too; do not delete it just to get past the
check. An empty process search is not proof that no pending update exists.

This tutorial requires root. There is no verified WebUI-only master switch
that disables every path in the table.

### 2. Disable the management settings, especially SwMgnt

The independent OTA enable field used by the stock swmgnt launcher is:

```text
InternetGatewayDevice.X_ALU-COM_Wifi.X_ALU-COM_SwMgnt.X_ALU-COM_Enable
```

Read it first:

```sh
cfgcli -g 'InternetGatewayDevice.X_ALU-COM_Wifi.X_ALU-COM_SwMgnt.X_ALU-COM_Enable'
```

If it resolves on your firmware, set and read it again:

```sh
cfgcli -s 'InternetGatewayDevice.X_ALU-COM_Wifi.X_ALU-COM_SwMgnt.X_ALU-COM_Enable' false
cfgcli -g 'InternetGatewayDevice.X_ALU-COM_Wifi.X_ALU-COM_SwMgnt.X_ALU-COM_Enable'
```

Keep the following controls disabled as well. Query each URI before setting it;
if it is absent, record that rather than guessing a replacement path.

| Control                                           | URI                                                                |
|---------------------------------------------------|--------------------------------------------------------------------|
| Main CWMP client                                  | InternetGatewayDevice.ManagementServer.EnableCWMP                  |
| USP agent                                         | InternetGatewayDevice.ManagementServer.X_ASB_COM_TR369Agent_Enable |
| Separate SaaS CWMP setting retained in the schema | InternetGatewayDevice.X_ALU-COM_SaaSManagementServer.EnableCWMP    |

For a control that exists and is enabled, the syntax is:

```sh
cfgcli -s 'InternetGatewayDevice.ManagementServer.EnableCWMP' false
cfgcli -s 'InternetGatewayDevice.ManagementServer.X_ASB_COM_TR369Agent_Enable' false
cfgcli -s 'InternetGatewayDevice.X_ALU-COM_SaaSManagementServer.EnableCWMP' false
```

Run these individually and inspect the result. Read the values again after
reboot: a successful CLI exit alone is not proof of a persisted setting. The
file guards below work beneath these controls and do not depend on an enable
flag remaining false.

ManagementServer.UpgradesManaged is not a universal firmware-update disable
switch. Blocking only swupd.wifi.nokia.com in DNS is insufficient too: the cloud
URL is configurable, the binary has a China endpoint, and other mechanisms do
not use that hostname.

### 3. Install the persistent file guards

Download [g6-fw-update-lock.tar.gz](resources/g6-fw-update-lock.tar.gz), or copy
[install.sh](resources/install.sh), [guard.sh](resources/guard.sh),
[blocked.sh](resources/blocked.sh), [firewall-include.sh](resources/firewall-include.sh)
and [remove.sh](resources/remove.sh) using your existing trusted transfer method.
The scripts must keep LF line endings.

With the archive copied to /tmp/g6-fw-update-lock.tar.gz on the router:

```sh
mkdir -p /tmp/g6-fw-lock-install
tar -xzf /tmp/g6-fw-update-lock.tar.gz -C /tmp/g6-fw-lock-install
cd /tmp/g6-fw-lock-install
sha256sum -c SHA256SUMS
sh install.sh --uplinks-disconnected
```

Stop if any command fails. Do not reconnect an uplink after a partial install.
The installer requires writable UBIFS at /configs, the inspected persistent
/etc/config link, a recognized software version and no pending firewall edits.
It refuses to overwrite an existing lock directory or named include.

It saves /etc/config/firewall as /configs/firmware-update-lock/firewall.before,
keeps the guard and removal scripts there, and adds this named UCI section:

```text
config include 'g6_firmware_lock'
        option type 'script'
        option path '/configs/firmware-update-lock/firewall-include.sh'
        option enabled '1'
        option reload '1'
```

It does not replace your firewall rules, restart the firewall, stop PCD or kill
an update process. It also leaves your existing pre_app_boot.sh and UART/shell
payloads untouched. Keep an off-device copy of the backup and guard directory.

The persistent include runs through S19firewall before S98pcd in both inspected
builds. /etc/config is linked to /configs/overlay/etc/config. This is earlier
than the common S99 pre_app hook, which would leave a window after the updater
services start. fw3 sources its include, so the wrapper calls the guard in a
separate shell. It does not exit the firewall's include shell.

The swmgnt PCD copy is made from the current bank's /rom file on each boot,
with ACTIVE=NO and failure actions changed to NONE. The executable guard remains
as a second check against an explicit launcher. It avoids relying on killall,
which would otherwise leave a supervisor free to restart the daemon.

### 4. Reboot offline and verify before reconnecting

A bind mount does not stop a daemon that already mapped its original executable.
After checking that no update is in progress and no alternate boot is pending,
reboot while the uplinks are still disconnected:

```sh
sync
reboot
```

Then run from the root shell:

```sh
sh /configs/firmware-update-lock/guard.sh status
uci -q get firewall.g6_firmware_lock.path
cat /tmp/g6-fw-lock/ready
cat /tmp/g6-fw-lock/log
ps w | grep -E '[s]wmgnt|[b]atch_upgrade|[s]ysupgrade|[i]mageTool|[c]a.upgrade|[u]pgraded'
```

Status must report all nine executable guards and the PCD guard active. The
include path must match the installed wrapper. swmgnt and batch_upgrade should
not remain running after startup. The status command checks mounted files;
it does not claim that an old process has stopped or that a service is enabled
or disabled based only on its executable's presence.

A harmless check of the masked shell entry is:

```sh
sh /sbin/sysupgrade --help
echo $?
```

Expect the owner-lock message and status 126. Do not upload a real firmware file
or exercise a flash command as a verification test. Re-query the management
flags from step 2 and check the firmware version/actual bank. If anything is
missing or unexpected, keep the uplinks disconnected and investigate.

fw3 can log an include error and continue booting: this is not an automatic
network isolation mechanism. Reconnect only after the offline verification.
If firewall/configuration changes are later made, repeat the status check.
If you deliberately boot the other known bank, remove the activation guard
before selecting it, then verify that /configs and the include survived there.
Do not assume an arbitrary future image has the same startup ordering.

---

### Undo the lock before an intentional update

Disconnect uplinks again. The removal helper is kept on persistent storage:

```sh
sh /configs/firmware-update-lock/remove.sh
```

It removes only the named UCI include, deletes the enabled flag and unmounts
only file guards whose bytes still match its sources. It refuses unrelated or
changed overlays. Other firewall configuration is kept; the whole saved firewall
file is not copied over newer edits. Files and the backup directory remain.

Reboot offline so PCD reloads the original rule. Management flags stay disabled;
turn them back on only if you want that particular management service. A manual
WebUI/vendor update does not require re-enabling all cloud management.

For reinstalling, first verify that no guard mounts or named include remain,
then archive/rename the disabled /configs/firmware-update-lock directory so a
fresh install will not overwrite its backup. Keep the independent
[UART recovery route](../recover-uart-root-shell-from-uboot/README.md) available.

--- 

### Scope and evidence

This freezes the identified normal Linux write and activation paths while its
persistent configuration remains in place. U-Boot/raw writes, a previously
selected alternate bank, factory reset and erased configuration are separate
boundaries. Bank rollback alone does not revert a shared SSB bootloader update.
No signing keys, bootloader passwords, password hashes or firmware partitions
are changed by these scripts.

The [knowledgebase](../../knowledgebases/firmware-upgrade-disable.md) retains the
full source reasoning, default values, startup ordering, tests and limitations.
[Stock evidence](resources/stock-control-evidence.json) includes both builds'
scripts, hashes and isolated original-UCI transcripts.
[HJL](resources/test-results-hjl.json) and [IJL](resources/test-results-ijl.json)
results cover installation, sourced include, repeated apply, simulated reboot,
rollback, active-write markers, unknown builds, pending firewall edits, failed
binds, symlink targets and foreign overlays. Mount/UCI/process operations were
mocked in those integration tests. A live reboot and real bind-mount behavior
have not been validated by the owner yet.
