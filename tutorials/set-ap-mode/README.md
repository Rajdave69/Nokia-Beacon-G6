# Setting the Beacon G6 to AP mode

**Scope and verification.** Stock G6 `HJL.L91p01`, `Controller`, with an upstream DHCP router. The live Beacon obtained a lease after the single upstream cable moved to a G6 LAN jack, and I reported stable operation in that topology. The dedicated WAN jack is outside the working setup. A recorded RGW → AP → RGW round trip, AP reboot, and separate wired and Wi-Fi client checks are still pending.

## Introduction

The [router work-modes writeup](../../writeups/router-workmodes/README.md) explains the choices. Putting a WAN connection into Bridge mode is different from putting the Beacon itself into AP mode. A bridged WAN is a connection configuration; `RGW` and `AP_Bridge` describe the device's work mode. Changing the former does not automatically change the latter.

The examined G6 `HJL.L91p01` firmware has a separate AP-mode switch. Its WebUI handler writes the Wi-Fi service's `WorkMode` field, and cfgmgr applies the transition. We can use the same configuration setting from a root shell:

```text
InternetGatewayDevice.X_ALU-COM_Wifi.WorkMode
```

This tutorial uses the normal setter so the firmware runs its mode-change callback. It does not build a manual bridge or merely change a status label. A live G6 returned `AP_Bridge` and `ndk_dhcpv4` after reboot. In that first check, the bridge had no IPv4 address. The troubleshooting steps below show how to check the upstream lease and the bridge before accepting the switch.

### What you need

- A privileged shell on the G6, preferably with UART recovery available.
- An upstream router that already provides routing and DHCP.
- A saved configuration backup and a record of the G6's current management address and WAN settings.

The switch changes networking and the traced RGW-to-AP path schedules a reboot after roughly five seconds. Your shell and WebUI session can disconnect, and the G6's management address can change. Arrange access to the upstream router's DHCP lease list before starting.

## 1. Record the current state

Run:

```sh
grep -E '^(IMAGEVERSION|SOFTWAREVERSION)=' /etc/buildinfo
cfgcli -g 'InternetGatewayDevice.X_ALU-COM_Wifi.WorkMode'
cfgcli -g 'InternetGatewayDevice.X_ALU-COM_Wifi.WorkRole'
ip -4 addr show dev br-lan
ip -4 route show
uci -q get network.lan.proto
```

Keep the results locally. The saved G6 configuration starts at `WorkMode=RGW` and `WorkRole=Controller`, which is the standalone-router case covered here. If yours is an `Agent` or has another role, inspect its mesh setup before applying this procedure; do not change the role just to make these instructions fit. The work-mode value should explain the WebUI's `RGW` result.

Use the existing configuration export utility to save a backup as well. The undo section below restores the work mode, rather than restoring every independently changed WAN setting.

## 2. Undo the WAN Bridge change first

If the WAN edit left you without WebUI access, see [WAN Bridge recovery](recovery.md#recover-from-a-wan-service-set-to-bridge).

If you changed a WAN connection to Bridge while trying to enable AP mode, restore that connection to its previous configuration through the WebUI. Preserve its original settings rather than deleting unrelated service connections.

The original combined endpoint has an extra guard: it refuses a mode change if it finds a WAN PPP connection with `ConnectionType=PPPoE_Bridged`. Its getter reports a separate `has_bridge_wan` value:

```text
/whw_beacon_mode_app.cgi?getWorkMode
```

Inspect that response using the authenticated browser session you already use. `has_bridge_wan` and `workMode` describe different things. A reported bridge is a reason to review the WAN configuration you changed; it is not an instruction to delete unrelated service connections.

The examined frontend also uses separately compiled WebUI endpoints:

```text
Setter: /whw_beacon_mode_app_web_app.cgi
Status: /whw_beacon_mode_app_status_web_app.cgi?getWorkMode
```

These variants are not identical. The split setter omits the combined endpoint's bridged-WAN guard, and the split status reply has `workMode` but no `has_bridge_wan`. Both setter paths ultimately select the same Wi-Fi service work-mode field. Do not mistake a missing status field for proof that no bridged WAN exists.

## 3. Connect the intended uplink

Start with the upstream router’s LAN connected to the G6’s WAN jack if you need to record the RGW baseline. Then disconnect that uplink and keep UART connected while changing modes. **For AP operation, use a single cable from the upstream LAN to a G6 LAN jack.** Connect it after the device reports `AP_Bridge`. Keep both networks isolated during the test so their DHCP servers do not share a LAN while the G6 is still in RGW. Leave the dedicated G6 WAN jack unused for the AP test.

The dedicated WAN jack cannot currently be relied on as an extra LAN port in this stock G6 setup. Adding its interface to the Linux bridge did not produce reliable client connectivity in the live test. Use an Ethernet switch on the working LAN if you need more ports; the [recovery guide](recovery.md#why-not-use-the-wan-jack-as-another-lan-port) explains the limitation.

The AP transition adds the platform-selected uplink interface to the LAN bridge and changes the G6's management LAN to Nokia's DHCP-client protocol. It is therefore normal for the Beacon itself to request an address from the upstream router. Do not assume the previous static management address remains reachable.

## 4. Set the whole-device work mode

From the G6's root shell, run:

```sh
cfgcli --save-flash-now -s 'InternetGatewayDevice.X_ALU-COM_Wifi.WorkMode' 'AP_Bridge'
```

The spelling and capitalization matter. `AP_Bridge` is the value used by the stock WebUI's AP toggle.

Do not add `--no-rts`. The callback is what performs the networking changes; skipping it can leave the saved value and the running setup inconsistent. Do not edit `/configs/workmode.txt`, `/configs/realworkmode.txt`, or UCI bridge membership by hand as a substitute.

The setter requests an immediate configuration save. The traced mode-change handler also schedules `sleep 5 && sync && reboot` for the RGW-to-AP transition. Allow it to complete rather than immediately issuing another reboot. A disconnected shell by itself does not show whether the setter succeeded; reconnect and verify the resulting state.

If the setter explicitly reports failure and the router remains accessible, stop and inspect the current mode. Rebooting is not a way to repair a rejected setting.

## 5. Find the new management address and verify

Check the upstream router's DHCP lease list for the G6 and reconnect to that address. A DHCP reservation on the upstream router can keep management predictable without replacing the firmware's LAN DHCP-client setup.

On the G6, check:

```sh
cfgcli -g 'InternetGatewayDevice.X_ALU-COM_Wifi.WorkMode'
uci -q get network.lan.proto
ip -4 addr show dev br-lan
ip -4 route show
```

The mode should now be `AP_Bridge`. The inspected AP setup selects `ndk_dhcpv4` for `network.lan.proto`, removes the old static address/netmask, and reloads networking. Verify the actual address rather than relying only on that protocol name.

Refresh the authenticated work-mode status request. Its `workMode` should agree with the configuration value.

Test one client on a spare G6 LAN jack and one on the main Wi-Fi, or move the same client between them. On each connection, confirm that its address, default gateway and DHCP server come from upstream, and that it can reach the Beacon’s WebUI and a host on the intended LAN. Check Internet access separately if the test network offers it. These checks distinguish an operational AP from a changed mode string. Verify IPv6 separately if you use it; the mode readback does not demonstrate working IPv6.

AP mode changes the forwarding role. It does not mean that mesh management, TR-069/TR-369, cloud management or all firewall policies have been disabled. Guest-network and VLAN behavior also needs its own verification.

For missing addresses, DHCP troubleshooting, the WAN-jack limitation and returning to RGW, use the [recovery and troubleshooting guide](recovery.md).

## 6. Check the AP rollback marker

The firmware has a recovery mechanism for this transition. Switching from `RGW` to `AP_Bridge` creates `/configs/rewindToRgwFlag`. When AP initialization finds that marker, it starts a 900,000 ms timer: 15 minutes. If the marker still exists when the timer expires, the callback sets `WorkMode` back to `RGW`.

In the traced controller path, processing the bridge DHCP update removes the marker. This is local DHCP/address handling, not evidence that a successful TR-069 connection is required.

After the G6 has obtained its upstream address and the client checks above pass, inspect the marker:

```sh
ls -l /configs/rewindToRgwFlag 2>/dev/null
```

If the marker remains, the switch can still be rolled back by the firmware. The marker can also be absent with no usable DHCP lease. The HJL Controller callback calls the removal helper before its later comparison with `0.0.0.0`, and the checked G6 had no marker despite the empty address. Verify the bridge address and client forwarding directly. Keep UART available so you can return to RGW manually if needed.

If AP networking has been verified and you deliberately want to accept that working setup despite the marker remaining, the stock cancellation helper's relevant action is simply removing that exact file:

```sh
rm -f /configs/rewindToRgwFlag
sync
```

The timer checks the file again when it fires, so removing the marker cancels this particular reversion even if the timer was already armed. Do this after verifying access, rather than cancelling recovery while the new address is still unknown. Recheck `WorkMode` after the original 15-minute window and after a later reboot to verify that your G6 retains AP mode. These final live checks remain untested in this research session.

## Undoing the change

Disconnect the LAN-to-LAN uplink and follow [return to RGW](recovery.md#ap-mode-return-to-rgw). Keep UART available and restore any WAN service settings that were changed separately.

The [AP-mode research record](../../writeups/uplink-vlan-firewall/resources/ap-mode/README.md) records the CGI and backend tests. Use the [lab worksheet](../../writeups/uplink-vlan-firewall/resources/ap-mode/stock-ap-validation.md) to record the remaining round-trip, client and reboot checks.
