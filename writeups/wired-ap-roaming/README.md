# Roaming between wired Beacon G6 access points

Two wired G6s on the same upstream LAN can advertise the same SSID and security settings. A client can move between their BSSIDs while keeping the same LAN and IP configuration. The client still decides when to move. Ethernet backhaul carries traffic between the APs and the LAN. It does not by itself coordinate their roaming settings.

## What the stock firmware supports

| Feature | Evidence in stock G6 HJL | What to verify |
| --- | --- | --- |
| **802.11r Fast Transition** | The shipped hostapd supports FT. The Nokia/Qualcomm generator reads per-VAP `ieee80211r` with default 0, emits FT AKMs such as FT-PSK or FT-SAE where applicable, and reads mobility-domain and key-holder settings. The separate Qualcomm driver FT command in the inspected script is gated on station mode. The AP evidence comes from hostapd. | On both APs, inspect the intended BSS for an FT AKM and the same mobility domain. Observe the client actually negotiating FT during a roam. |
| **802.11k radio measurements and neighbor reports** | The Qualcomm script reads `rrm` and, on the cfg80211 path, `rrm_capie`. Hostapd includes `rrm_neighbor_report`, `rrm_beacon_report` and neighbor-table controls. The FT configuration block is separate from these. | Confirm the BSS advertises the capabilities and that a neighbor report actually includes the other wired AP. |
| **802.11v BSS Transition Management** | The stock AP generator consumes per-VAP `bss_transition`. Hostapd implements BSS transition requests. The management model also contains steering settings and ECD contains a BSS transition path. | Verify BSS transition support and whether a controller actually supplies useful candidate BSSIDs. |
| **Nokia EnhancedRoaming** | `InternetGatewayDevice.X_ALU-COM_Wifi.EnhancedRoaming` and `SteeringEnable` exist in HJL. | A model field or successful readback does not establish that standalone APs received matching FT/neighbor configuration. |

An independently configured AP pair and a Nokia EasyMesh controller/agent pair are different setups. Wired uplinks alone do not establish that two standalone APs share a controller, neighbor list or FT domain. [Saved firmware evidence](evidence.json) · [EasyMesh management](../easymesh-management/README.md) · [Hostapd reference configuration](https://android.googlesource.com/platform/external/wpa_supplicant_8/+/master/hostapd/hostapd.conf).

## Check two APs without changing the radios

Use the same SSID, passphrase and compatible security settings on the main Wi-Fi of both APs. Connect each AP to the same upstream LAN using its verified AP uplink. Keep one DHCP server for that LAN and give each AP a distinct management address.

From each AP's existing shell, identify the relevant BSS with `iw dev` and the active hostapd process. The saved generator commonly uses `/var/run/hostapd-<ifname>.conf`. Read only the fields below from the actual active file. The full file can contain passwords and FT key material.

```sh
iw dev
cfgcli -g 'InternetGatewayDevice.X_ALU-COM_Wifi.EnhancedRoaming'
cfgcli -g 'InternetGatewayDevice.X_ALU-COM_Wifi.SteeringEnable'
grep -E '^(interface|bss|wpa_key_mgmt|mobility_domain|ft_over_ds|ft_psk_generate_local|rrm_neighbor_report|rrm_beacon_report|bss_transition)=' \
  /var/run/hostapd-ath0.conf
```

Substitute the active configuration path for the target main BSS. In a multi-BSS file, attribute each field to the correct `interface` or `bss` section. A client-side test can follow the connected BSSID while sending continuous traffic to a wired host, then check the negotiated security or reassociation frames to distinguish ordinary reassociation from FT. A BSSID change alone proves a roam. It does not identify the protocol used.

## What one running G6 reported

The owner read `EnhancedRoaming=false` and `SteeringEnable=true`. The supplied `ath0` hostapd excerpt reported `wpa_key_mgmt=WPA-PSK`, with no FT AKM. FT was therefore not configured on that BSS in the sampled file, even though steering was enabled. The pasted grep expression was split after `ft_over_ds`. Its output is insufficient to rule out 802.11k or 802.11v, and it covers only `ath0`. In the same snapshot the visible main SSID appeared on `ath1` at 2.4 GHz. Check the active configuration for that BSS separately. Run the grep expression as one line or keep the line continuation outside the quoted expression. A client-side capture can confirm what each BSS advertises.

## Lab setup and diagnostics

The HJL test router reported Qualcomm RRM enabled on both main BSSs. The running hostapd reported WPA2-PSK without FT on both. The sampled neighbor-table calls returned `FAIL`. [Two-AP setup, FT configuration, rollback and 11k/v diagnostics](ft-test.md).

## What a stock FT setup still needs

For a standalone WPA2-Personal pair, a controlled configuration needs consistent FT-capable security on both APs, a shared mobility domain and working FT key handling. Check how Nokia's generator builds the active config before enabling FT. Its stock script writes explicit `r0kh` and `r1kh` lines even when peer identifiers were left empty, and it has a fixed fallback key for explicit peer exchange. A generic OpenWrt snippet with only `ieee80211r=1` is insufficient evidence that this stock generator will produce valid, interoperable configuration. Use provisioned matching peer settings or verify a compatible local FT-PSK path on a spare pair before changing a working SSID.

No two-AP FT, neighbor report, BSS transition or persistence test has been completed on stock AP mode. Ordinary roaming is usable independently of those optional mechanisms. [Wireless tools and live hostapd reads](../wireless-tools/README.md).
