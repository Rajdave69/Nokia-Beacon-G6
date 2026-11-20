# Recover access after changing bridge or AP settings

This guide helps you locate a Beacon G6 after a **WAN service** was set to Bridge or the device's **work mode** was changed to AP. Those are different changes and can leave management on different networks. The procedures below cover the observed G6 setup; operator profiles and other hardware may differ. Keep UART available if you have it, and avoid a factory reset while a known management route remains available.

## Recover from a WAN service set to Bridge

I have live-tested that the bridge-configured G6 can remain at its old management IP on the other subnet. The supplied confirmation does not specify the exact build, address, interface or recovery sequence, so it does not establish a universal recovery address. A client receiving an upstream lease does not mean the Beacon itself moved to the upstream subnet.

1. Find the Beacon's **previous management IP and subnet mask** in your records, browser history, saved configuration or a former client gateway. Use the address actually configured on your device.
2. Disconnect the G6 WAN cable. Connect one computer directly to a G6 LAN jack and temporarily disconnect its other network interfaces. This isolates the management test from the ONT and other DHCP servers.
3. Give the computer an unused static IPv4 address in the old subnet, with the same mask. For example, if the Beacon used `192.168.1.1/24`, a free `192.168.1.2` with mask `255.255.255.0` is suitable; leave gateway and DNS blank. These are examples, not a default for every unit.
4. Open the Beacon's old WebUI address, trying the previously used HTTP or HTTPS URL. On Windows, `arp -a` after a connection attempt can help distinguish an address-resolution response from a WebUI problem. Ping alone is inconclusive. If needed, try another LAN jack or the known main Wi-Fi while keeping the WAN disconnected.
5. Once authenticated, restore the WAN service's recorded routed configuration, including its connection type, addressing, VLAN and port bindings. Check LAN DHCP separately. Return the computer to automatic IPv4 and reconnect the upstream cable only when appropriate.

If the old address is unknown or the interfaces do not answer, try an already-authorized management path such as UART or SSH and inspect the saved configuration. No universal reset-free rescue address has been established. The AP rewind timer does not undo a WAN service edit. [Why management can remain on a different subnet](../../writeups/router-workmodes/README.md#bridge-forwarding-a-wan-service).

## AP mode: find the new address

AP mode makes the G6 management bridge a DHCP client in the traced HJL path. Connect the upstream router's LAN to one G6 **LAN** jack using a single cable, then look for the G6 in the upstream DHCP lease list. A lease for a separate client is not the Beacon's management address. If the address is found, open it and verify the mode and client connectivity as described in the [AP tutorial](README.md#5-find-the-new-management-address-and-verify).

## AP mode: the Beacon has no management address

An empty `ip -4 addr show dev br-lan` means the Beacon has no IPv4 management address on that bridge yet. A route to `239.255.255.250` is for SSDP multicast. It gives the Beacon neither a management address nor a default route.

1. Check the upstream port first. Temporarily move the same cable from the Beacon to a laptop set to automatic IPv4. Confirm that the laptop gets a lease on the intended network. The upstream router's own management address can be reachable on a port even if that port offers no DHCP lease. Reconnect the cable to the Beacon after testing.
2. From UART, check the saved interface list, the running bridge, link state and the actual DHCP client.

   ```sh
   uci -q get network.lan.ifname
   brctl show
   ip link show
   ubus -t 5 call network.interface.lan status '{}'
   ps w | grep '[n]dk_udhcpc'
   cfgcli -g 'InternetGatewayDevice.X_ALU-COM_Wifi.WorkRole'
   ls -l /configs/rewindToRgwFlag
   ```

   Stock code looks up the uplink name before adding it to the bridge, with an `eth0` fallback if the lookup returns an empty name. Compare UCI to the running bridge. On the checked G6, UCI listed `ewan_u_0_0`, but the interface did not exist. The physical WAN interface `wan0_eth` had link and was outside the bridge. The DHCP client was running on `br-lan`, and netifd reported `0.0.0.0` with a zero-second lease. Neither that entry nor `"up": true` is evidence of a usable management address.

   If you see that same missing uplink, try moving the **single** upstream cable to a G6 LAN jack while keeping UART connected. The LAN interfaces were already members of `br-lan` in the observed case. Check the Beacon's bridge address, then check that a client on its main Wi-Fi receives a lease from the upstream network. In the live test, moving the cable to a LAN jack produced a DHCP ACK from the ONT. The console later logged a return to `0.0.0.0`, so recheck the address after the link settles and confirm Wi-Fi client forwarding before relying on this cabling. This test verifies DHCP reachability through a LAN jack. The WAN-jack path still requires a working WAN service interface.
3. If the laptop obtained a lease and the Beacon still has no address, capture the DHCP exchange from UART. Wait for a retry and stop the capture with Ctrl+C.

   ```sh
   tcpdump -p -ni br-lan -vv 'udp and (port 67 or port 68)'
   ```

   Match the exchange to the Beacon's bridge MAC locally, since other clients can appear in the capture. Discover without Offer on the bridge calls for checking the uplink and upstream DHCP path. An ACK for the Beacon with no address installed calls for checking the Nokia client and netifd handoff. If no DHCP packets are visible, compare the client process and actual bridge member before concluding where they were lost.

Leave the rewind marker in place until both management access and client forwarding are verified. If the firmware returns to RGW before you can complete these checks, record the post-revert mode and diagnose the upstream port before retrying.

### Why not use the WAN jack as another LAN port

Keep the ONT on the LAN jack that works. A direct `brctl addif br-lan veip0` briefly added the interface in a live G6 test, but the laptop never had reliable connectivity. It showed an address once, could not reach the Beacon, and later received no address. The removal command failed until the interface was added again. Use an Ethernet switch on the working LAN if you need more ports.

The stock WAN path manages Cortina VLAN forwarding as well as Linux bridge membership. Saving `veip0` in UCI or repeatedly adding it to the bridge does not resolve the data path. The exact event that detached it was not captured. [WAN interface notes](../../writeups/uplink-vlan-firewall/README.md#why-adding-veip0-did-not-convert-the-wan-jack) · [Wired AP roaming](../../writeups/wired-ap-roaming/README.md).

For a lab test with UART, see the [netifd-managed WAN-jack procedure](../../writeups/uplink-vlan-firewall/resources/ap-mode/wan-jack-follow-up.md). It uses runtime bridge membership and includes rollback and tests for actual forwarding.


## AP mode: return to RGW

Disconnect the LAN-to-LAN uplink before switching back so the two DHCP servers stay separate. Use UART to keep access to the Beacon while returning to RGW. From its root shell, run:

```sh
cfgcli --save-flash-now -s 'InternetGatewayDevice.X_ALU-COM_Wifi.WorkMode' 'RGW'
```

Allow the normal callback and possible reboot to complete. The management address may move again; use the address recorded before the switch and the current upstream lease information to locate it.

Verify that both `cfgcli` and the work-mode status response report `RGW`. Reconnect the upstream cable to the original WAN jack. Recheck WAN connectivity, LAN addressing and DHCP before relying on the router again. Returning to `RGW` does not promise to reconstruct WAN profiles you separately edited or deleted in the WebUI; restore those recorded settings or the saved configuration if needed.


The exact AP-to-RGW round trip has not been recorded in the cited live test. A work-mode change does not automatically restore WAN profiles edited separately; use the settings recorded before the change.
