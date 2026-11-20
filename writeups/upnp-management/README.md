# UPnP and the Internet Gateway Device service

The G6's UPnP service is a LAN control interface for gateway functions, especially NAT port mappings. It also has WAN connection/timer operations and IPv6 firewall-pinhole handlers. It is separate from WebUI authentication and from the telemetry interfaces already examined.

This investigation compares G6 IJL.J03, G6 HJL.L91 and Beacon 9 JJM.K44. On G6-A, discovery, service descriptions and five SOAP status actions worked without a WebUI cookie or password. Mapping index 0 returned UPnP error 713, and the final UPnP NAT chain was empty. No mapping, pinhole, connection or configuration was changed.

The [resources](resources/README.md) retain complete sources, protocol captures, XML schemas and native traces. The [knowledgebase](../../knowledgebases/upnp-management.md) includes the complete continuation context.

## Which implementation is running?

The live G6 runs `/sbin/ndk_upnpd`, started by `ndk_appsd`. Five freshly read hashes matched the saved HJL firmware: the daemon, its UPnP/XML libraries, `ndk_appsd` and `cfgmgr`. It loads `/lib/libupnp.so.6`; its HTTP header reports Portable SDK for UPnP devices **1.6.20**.

The separately packaged `libupnp` version is 1.8.7 and provides `/usr/lib/libupnp.so.13`. That package metadata does not identify the library loaded by this daemon. Neither a header nor package number alone establishes vendor backports or vulnerability status.

The daemon stayed at PID14957, UID/GID1100, through the checks. Its final effective/permitted capabilities were zero; `NoNewPrivs` and seccomp were also zero. Running under `appService` does not make the service read-only: its mapping code uses the separate firewall manager.

## Discovery and control URLs

SSDP discovery uses UDP1900. One unicast `M-SEARCH` to the router returned its IGD2 advertisement and description location. The checked HTTP listener was on the router's LAN address at TCP49152. `listenport=0` selects a port dynamically, starting at49152, so clients should use discovery or verify the listener instead of assuming this port on every unit.

The live description referenced these services:

| Service                      | Control URL                    | Purpose                                                  |
|------------------------------|--------------------------------|----------------------------------------------------------|
| `WANCommonInterfaceConfig:1` | `/upnp/control/WANCommonIFC1`  | Link properties and counters.                            |
| `WANIPConnection:2`          | `/upnp/control/WANIPConn1`     | IPv4 mappings, connection state and connection controls. |
| `WANPPPConnection:1`         | `/upnp/control/WANPPPConn1`    | PPP-oriented connection/mapping interface.               |
| `WANIPv6FirewallControl:1`   | `/upnp/control/WANIPv6FwCtrl1` | IPv6 firewall status and pinholes.                       |
| `LANHostConfigManagement:1`  | `/upnp/control/LANHostConfig1` | Advertised DHCP/address/router/domain/DNS getters.       |

A dummy service was also listed. Description, SCPD, SOAP control and event-subscription URLs are distinct. Some shipped XML files describe other services but are not referenced by this live description.

The listener inventory additionally showed a TCP listener on an IPv6 link-local address at1900, UDP1900 on IPv4/IPv6 and a loopback UDP60002 socket, all owned by this process. The purpose/protocol of that extra TCP listener was not probed. The IPv6 configuration flags being zero did not mean every IPv6 socket was absent.

## What can it do?

The native dispatcher contains the same42 action selectors in all three saved daemon builds. The complete [XML catalogue](resources/xml-catalog.json) records arguments, variable types, ranges and allowed values; the [native selector catalogue](resources/action-dispatch.json) separates recognition from advertised XML and successful execution.

For IPv4 mappings, the supported action names include `AddPortMapping`, `AddAnyPortMapping`, `DeletePortMapping`, `DeletePortMappingRange`, `GetGenericPortMappingEntry`, `GetSpecificPortMappingEntry` and `GetListOfPortMappings`. Mapping inputs describe remote host, external port, TCP/UDP, internal client/port, enable flag, description and lease duration. The add-any variant can select an available external port. Conflicts and validation have their own failure paths; no successful mutation was tested here.

Connection controls include request/termination, connection type and disconnect timers. Some timer/termination selectors exist in native dispatch even though the default SCPD does not advertise them. They are active operations, not harmless status queries.

IPv6 handlers cover add/update/delete pinholes, packet counts and pinhole-working checks. The saved add handler checks a lease range of1..86400 seconds and contains address/protocol/port validation. A pinhole is an inbound firewall allowance, not IPv4 NAT. Actual enforcement and reachability were not tested.

The default LAN-host interface exposes seven getters. Although the executable retains DNS/DHCP setter routines, those setters are absent from the examined action dispatcher. Their presence in strings is not a usable DNS-configuration API. Similarly, a shipped DeviceProtection or friendly-name XML file does not establish an active service.

## How a mapping reaches the firewall

The Nokia mapping path constructs DNAT and forwarding rules, then formats a `ubus send ndk.xipt` command. That feeds the `ndk_xiptmgr` rule machinery covered in the [networking writeup](../uplink-vlan-firewall/README.md).

The effective G6 file selected `PREROUTING_UPNP` for NAT and `FORWARD` for forwarding, with forwarding-rule creation enabled. Its default duration setting was86400 seconds. The final NAT snapshot showed the UPnP chain and its parent jump but no mapping entries.

The daemon has an in-memory mapping list and timer code. This pass did not establish persistent storage of mappings or behavior after an abrupt exit, firewall reconstruction, reboot, reset or bank change. UPnP-created mappings must not be assumed equivalent to the configuration manager's saved static port forwards.

## Authorization needs more than reading error messages

Ordinary LAN requests reached the tested getters without WebUI authentication. This is an observed property of those requests; guest, WAN and mutating-action access were not tested.

The saved code has an additional limitation: the helper identifiable as `AuthorizeControlPoint` returns zero, meaning authorized, without inspecting the request or its arguments. This occurs in G6 IJL, G6 HJL and B9 JJM. The [upstream IGD2 implementation](https://github.com/Orange-OpenSource/igd2-for-linux/blob/3544a8868158bb7edb32dd5663974dde5bf37447/linuxigd2/src/gatedevice.c#L2790) contains the same stub and defines that return value as authorized. The source comparison identifies the helper; it is not a claim that the whole Nokia binary matches upstream.

Consequently, the presence of “Action not authorized” diagnostics or `control_point_authorized=1` in the configuration does not demonstrate an effective authentication check. Other validation, ownership/manage branches, interface binding and firewall policy still matter. No foreign-client mapping, low-port mapping, pinhole write or authorization-bypass experiment was performed.

## Some status replies are placeholders

| Getter | Live result | Interpretation |
| --- | --- | --- |
| `GetCommonLinkProperties` | Cable,512000bit/s each direction,Up | Cable/Up are constants in this handler; rates come from configuration defaults. This is not a link-speed measurement. |
| `GetStatusInfo` | Connected,ERROR_NONE,uptime | Daemon-reported connection state; not an Internet reachability test. |
| `GetNATRSIPStatus` | RSIP0,NAT1 | Both values are constants in the response code. |
| `GetExternalIPAddress` | HTTP200/address field | Handler attempts to read the selected external interface; complete aliased value retained. |
| `GetFirewallStatus` | FirewallEnabled1,InboundPinholeAllowed1 | Reported flags; not proof of end-to-end IPv6 pinhole behavior. |
| `GetGenericPortMappingEntry`, index0 | HTTP500,UPnP713 | A structured “SpecifiedArrayIndexInvalid” fault, not a failed HTTP connection. |

## Beacon 9 also ships a second UPnP stack

The B9 image retains Nokia's daemon and additionally ships MiniUPnPd2.2.1-3 with init/hotplug/LuCI integration. Its packaged UCI setting is `enabled=0`. The same file has `enable_upnp=1`, `enable_natpmp=1`, `secure_mode=1`, port5000, high-port allow rules and a final deny rule. These describe its packaged configuration, not a measured live B9 service.

Do not transfer MiniUPnPd's settings or policy assumptions to Nokia's daemon. No MiniUPnPd process was seen on the checked G6, and no UDP5351 listener appeared in the final listing.

All19 shipped XML files and `/etc/upnpd.conf` are identical across the three inspected profiles. Two certificate-description XML files are malformed in every profile; they were retained with parse errors rather than silently repaired. The HTTP descriptions used in the live checks parsed successfully.

The internal NDK `rgw_setUpnp` request also changed: its `upnpInfo` blob is97bytes on both G6 builds and104bytes on B9. `rgw_updateUpnpWhenWanChanged` takes a WAN-interface string. These are separate internal APIs; the blob layout has not been fully decoded. We still lack G6 25.xx firmware, so platform and release effects cannot all be separated.

## Using it for automation

UPnP is useful for discovering gateways, reading their status and requesting application-specific port mappings where policy permits. It is not a general shell, application installer, VLAN manager or Wi-Fi controller. It does not provide a demonstrated way to install AdGuard or change DNS through this default LAN-host service.

A small standard-library [reader](resources/upnp_readonly.py) is included:

```text
python resources/upnp_readonly.py --host ROUTER_LAN_IP --action GetStatusInfo
python resources/upnp_readonly.py --host ROUTER_LAN_IP --action GetGenericPortMappingEntry --index 0
```

Run it from this writeup's directory, substituting the router's IP and verified HTTP port if different. It permits only the six reviewed getters, makes bounded requests, follows no redirects and requires no root shell. Its request bytes and response handling were checked offline against the actual captures; the reusable reader itself was not separately run against the router.

Remaining work includes one reversible mapping/lease test with a verified cleanup path, caller/guest/WAN policy, IPv6 pinholes, events and restart/persistence behavior. None is implied by a successful getter.
