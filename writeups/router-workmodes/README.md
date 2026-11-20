# Router, WAN Bridge and AP modes

How does a Nokia HomeOS device connect your network to an upstream router or ONT? Three terms appear in the settings: **RGW**, **Bridge**, and **AP mode**. They describe different jobs. On the examined Beacon G6, RGW and AP are whole-device work modes; Bridge can instead be a setting on an individual WAN service. Changing a WAN service to Bridge does not by itself switch the device to AP mode.

This explanation uses the captured Beacon G6 `HJL.L91p01` HomeOS 24.04 firmware and the observations below. The XS-2426X-A ONT also uses HomeOS, but its WAN services, operator configuration and hardware differ. Do not assume the G6's ports, interface names or mode transitions apply unchanged to the ONT. See the [ONT comparison](../xs2426xa-24-03-comparison/README.md) for its measured scope.

| Setting | What it is for | Where clients get network configuration | How to find management |
| --- | --- | --- | --- |
| **RGW** (residential gateway) | The device acts as a router between its WAN and LAN. It is the default work mode in the saved standalone G6 configuration. | Normally from the gateway's LAN DHCP service, if enabled and configured. | Use the device's configured LAN address. |
| **WAN service Bridge** | A selected WAN service forwards traffic between its WAN side and bound LAN ports instead of using that service as a routed connection. | In the observed G6 setup, a client obtained a lease from the upstream ONT. Actual service type, bindings and operator settings matter. | The G6 can retain its previous LAN management address on a different subnet. |
| **AP mode** (`AP_Bridge`) | The whole G6 acts as an access point behind an upstream router, extending its LAN over Ethernet and Wi-Fi. | The intended setup uses the upstream router's DHCP service. Verify both wired and wireless clients. | The G6 requests a management address from upstream in the traced AP path. |

These descriptions separate the device's management address from the traffic it forwards for clients. A client receiving an upstream address does not prove the G6 itself received one, and a mode name alone does not prove forwarding works.

## RGW: the device as a router

A residential gateway normally connects an upstream WAN to its own LAN. LAN clients use the gateway as their default route; the gateway manages forwarding between the networks and may provide DHCP and other services. The exact WAN profile, firewall, addressing and operator provisioning decide the actual behavior.

In the saved G6 configuration, `InternetGatewayDevice.X_ALU-COM_Wifi.WorkMode` is `RGW` and `WorkRole` is `Controller`. Work mode and mesh role are different settings. That observed configuration is not proof that every operator's device ships with identical WAN or LAN settings. The [firmware architecture](../firmware-architecture/README.md) and [uplink and firewall investigation](../uplink-vlan-firewall/README.md) explain how the configuration is applied.

## Bridge: forwarding a WAN service

Imagine an ONT, a G6 and a laptop. In the observed **WAN Bridge** example, the ONT connects to the G6's WAN jack and a selected WAN service forwards traffic to a bound LAN port. The laptop obtains an ONT lease. The G6 itself can retain its old management address on a different subnet.

A WAN service configured as Bridge can pass a client's traffic towards the upstream network. In the observed G6 setup, a client attached to a LAN port received an upstream ONT lease when the WAN cable was connected. That does not identify every WAN object, VLAN or port binding involved.

The G6's own LAN management address is a separate setting. I have live-tested that the bridge-configured router can remain reachable at its old address on the other subnet. If a client has obtained an address on the upstream subnet, it may not have a route to that old management address even though the bridge is forwarding traffic. The result is specific to the tested setup; the supplied observation does not establish a universal management address or behavior for every bridge profile.

A bridge can forward the laptop's frames without requesting its own upstream lease. The ONT's lease or neighbor list may therefore include the laptop but omit the G6. Checking only addresses on the upstream subnet can miss the G6's old management address.

In the examined G6 HomeOS 24.04 `HJL.L91p01` firmware, LAN management address and DHCP settings are separate from WAN connection type. A conditional `PPPoE_Bridged` path clears a per-WAN LAN DHCP flag; that is not evidence that every bridge configuration disables the entire LAN DHCP server. The live observation did not identify the exact WAN object, VLAN or bindings. [Firmware evidence](resources/wan-bridge-evidence.json).

For practical steps to reach the old address and restore the WAN service, use the [recovery guide](../../tutorials/set-ap-mode/recovery.md#recover-from-a-wan-service-set-to-bridge).

## AP mode: extend an existing LAN

In the tested **AP-mode** arrangement, the ONT remains the router and DHCP server, while its LAN connects to a G6 **LAN** jack. The G6's whole-device work mode changes to `AP_Bridge`, and the G6 itself requests an upstream management address. Both setups can give the laptop an upstream address, but they configure different parts of the G6.

```text
WAN service Bridge:  ONT LAN → G6 WAN → bridged service → bound LAN → laptop
                      G6 management can remain on its old subnet

Whole-device AP:     ONT LAN → G6 LAN → AP bridge → LAN / Wi-Fi → laptop
                      G6 management requests an upstream DHCP lease
```

These are the examined G6 arrangements, not universal port maps. Bridge changes one WAN service; AP changes `WorkMode` and triggers the device's networking transition.

In AP mode, an upstream router remains responsible for routing and typically DHCP. The Beacon supplies access to the same network through its LAN and Wi-Fi. Its management interface also needs an address on that network. This is different from merely selecting Bridge on one WAN service.

The G6 HJL WebUI and configuration handler use `AP_Bridge` for this work mode. The traced transition changes networking, sets the LAN management interface to Nokia's DHCP-client protocol and schedules a reboot when switching from RGW. The management address can therefore change. It also includes a conditional 15-minute fallback to RGW; the marker's presence or absence alone does not prove that management and client traffic work. [AP-mode traces and tests](../uplink-vlan-firewall/resources/ap-mode/README.md).

On the live G6, the management bridge initially had no IPv4 address with the upstream connected to the dedicated WAN jack. Moving the single upstream cable to a **G6 LAN jack** produced a DHCP ACK; stable operation in that topology was reported. The dedicated WAN jack has not been established as a usable extra LAN port in this setup. A manual bridge-member change did not provide reliable connectivity. Use a LAN port for the uplink and an Ethernet switch if more ports are needed. The [uplink investigation](../uplink-vlan-firewall/README.md) explains the interface and hardware-forwarding findings.

Use the [AP-mode tutorial](../../tutorials/set-ap-mode/README.md) for prerequisites, commands and checks, and its [recovery guide](../../tutorials/set-ap-mode/recovery.md) if the new address is missing or you need to return to RGW. A complete recorded RGW → AP → RGW round trip, AP reboot, and separate wired and Wi-Fi client checks remain unverified for that live setup. AP mode does not itself prove that mesh, remote management, guest isolation, VLANs or IPv6 are disabled or working; check each feature you rely on separately.
