# Changing the operator ID on a Beacon G6

On the stock Beacon G6 I examined, OperatorID is factory RI data. It is read during provisioning and by
individual services. An operator change can change how the existing configuration is interpreted, and the 
stock provisioning path can reset settings as part of applying the new profile. Testing here was offline
on HJL.L91p01.

## Where the change happens

The stock Linux tool is /usr/sbin/ritool. Use `ritool get OperatorID` and `ritool get CountryID` to read 
the current values. The tool advertises `ritool set <RI key> <value>`, but the HJL binary checks the
**current** OperatorID before allowing a direct write to that field. On a provisioned BOQA unit, 
`ritool set OperatorID <new-id>` takes the `No permission to set OperatorID` branch. The refusal branch 
can return zero, so a shell exit code alone cannot confirm a write. The exception in this binary is when
the current value is `0000`. That exception would not provide a symmetric rollback after provisioning 
a different code.

There is also a stock provisioning path. The HJL `libdbgen.so` delta handler reaches 
`scfg_set("OperatorID", new_value, strlen(new_value))`, marks `/configs/precfg_opid_restore_flag`, 
and invokes `cfgcli -rnoReboot`. The remote restore parser has a `change_opid` control and compares
the proposed ID to the current one. `cfgmgr` contains a separate preconfiguration-file path referring 
to `new_opid`. Those paths explain how an applicable operator provisioning package can change a 
provisioned unit. This analysis did not establish a complete supported package and reversal procedure
for arbitrary G6 operator pairs.

## What can change

| Area                          | Consequences to check                                                                                                                                                                                                                                                                                                                                                                                                   |
|-------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Management and recovery       | WebUI RBAC maps can give both admin roles different permissions. Rebuilding settings can change LAN addressing, AP/router mode, Wi-Fi names or keys, and management access. A backup is useful only if the recovery path still gives you access.                                                                                                                                                                        |
| Accounts and factory SECURITY | Provisioning compares RI OperatorID with SECURITY EXT_OPID. Changing only RI can switch which factory-versus-profile rules run for WebUI and Wi-Fi credentials. Profile rules can also affect service enablement or account policy. The exact credentials after a change depend on the selected profile, hardware filters and factory fields.                                                                           |
| WAN and LAN                   | Operator defaults and migrations can change WAN profiles, VLAN tagging, DHCP and IPv6 behavior, DNS and policy settings. A different country, hardware family or ONU condition can change which rules apply. Loss of upstream connectivity is possible even when the WebUI remains reachable.                                                                                                                           |
| Remote management             | TR-069/TR-369 and cloud settings can be regenerated or preserved differently according to the provisioning/reset path. If management resumes on a connected device, its selected endpoints may receive device identity and operational data. OTA uses a nonempty OperatorUniqueID ahead of OperatorID in the traced request path. Changing RI alone may leave OTA identity unchanged or alter the offered update track. |
| Flash and configuration       | The official change path writes factory RI and invokes a reset path. The reset can discard writable settings and operator files. A low-level RI write can also damage other device-specific data if applied incorrectly. Switching banks changes the Linux image and does not restore shared RI.                                                                                                                        |

An ID appearing in the WebUI map does not establish that the same spelling is a valid factory rebranding target. The provisioning XML has aliases, a generic baseline, per-model rules and its own selection logic. Exact effects require the old/new IDs, software build and provisioning artifact. [Operator policy inventory](../operator-profiles-and-credential-policy/README.md) · [Factory reset behavior](../factory-reset/README.md) · [OTA identity](../ota-firmware-downloads/README.md).

## Rollback prerequisites

Before an authorized reprovisioning, use a spare unit with the WAN disconnected and verify local recovery
independently of its current IP address and login policy. Preserve private, verified **same-device** 
captures of RI, extfs/SECURITY, U-Boot environment, both writable bank partitions and cfg. Also preserve
the normal configuration export and record the original OperatorID, CountryID, active and configuration
banks, overlay or startup modifications, and the original operator package if available.

A rollback requires a verified means to restore the original RI through the original operator's 
provisioning path or a device-specific service recovery. Restore identity first, then restore matching 
writable configuration where needed. Verify the original ID after a reboot and test LAN, credentials, 
Wi-Fi and remote-management settings before reconnecting WAN. The factory reset button can rebuild defaults
using the changed RI. It does not restore the previous RI. A WebUI export and an alternate firmware bank
are insufficient substitutes for a tested RI restore.

The setter and the reset have been traced statically. There has been no live operator write, migration 
test or restoration on the G6. The project does not yet have a verified round trip suitable for a tutorial.
