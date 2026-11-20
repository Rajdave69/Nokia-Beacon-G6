# Set up and measure roaming on two wired G6s

The read-only HJL.L91p01 sample was in `AP_Bridge`, role `Controller`. `EnhancedRoaming=false` and `SteeringEnable=true`. The main `ath0` and `ath1` BSSs reported WPA2-PSK/CCMP without an FT AKM, while `iwpriv ... get_rrm` reported `1` on both. Across ten generated hostapd files, none had an FT AKM or the inspected `mobility_domain`, `rrm_neighbor_report`, `rrm_beacon_report` or `bss_transition` settings. The control socket exposed `set_neighbor`, `show_neighbor`, `remove_neighbor` and `bss_tm_req`. The sampled `show_neighbor` calls returned `FAIL`. Neighbor advertisements and BSS transitions were not checked over the air.

## 1. Establish a baseline on both APs

Wire the APs to the same broadcast domain through working LAN ports, use one DHCP server and keep their management addresses distinct. Start with one WPA2-Personal/CCMP SSID with the same passphrase on both APs and two different BSSIDs. For a clean comparison use one band first. The example uses `ath1` on `wifi1` (2.4 GHz on the sampled G6). Repeat later for another band only after confirming its actual BSS and radio.

On both APs:

```sh
iw dev ath1 info
uci -q get wireless.ath1.ifname
uci -q get wireless.ath1.device
uci -q get wireless.ath1.mode
iwpriv ath1 get_rrm
hostapd_cli -p /var/run/hostapd-wifi1 -i ath1 get_config \
  | grep -E '^(wpa|key_mgmt|rsn_pairwise_cipher)='
grep -E '^(interface|bss|wpa_key_mgmt|mobility_domain|ft_over_ds|ft_psk_generate_local|rrm_neighbor_report|rrm_beacon_report|bss_transition)=' \
  /var/run/hostapd-ath1.conf
```

Use a test client with FT support. On Linux, replace `wlan0` with its interface and set `HOST` to a wired host on the same LAN. Run these in separate terminals:

```sh
ping -D -i 0.2 "$HOST"
```

```sh
IF=wlan0
while :; do
  date +%T
  wpa_cli -i "$IF" status | grep -E '^(bssid|freq|key_mgmt|wpa_state|ip_address)='
  sleep 1
done
```

Walk from A to B and back without toggling Wi-Fi. Record the BSSID, client address, AKM and packet loss. A BSSID change with the same IP establishes ordinary roaming on this LAN. If the client never changes BSSID, start close to A with B farther away and then reverse the signal conditions. Ensure the client isn't pinned to a specific BSSID.

## 2. Try FT-PSK on the lab pair

This is a reversible stock-HJL test derived from `/lib/wifi/hostapd.sh`. It has yet to be run on two units. Use UART or a wired session. A radio reload briefly disconnects every BSS on that radio. Stock radio setup contains conditional UCI commits when it reconciles radio or VAP MACs, so keep a protected backup even if you stage changes without an explicit commit.

On each AP, verify `uci -q changes wireless` prints nothing before proceeding. Keep the shell open and record the private backup directory. The saved file can contain Wi-Fi credentials.

```sh
umask 077
FT_BACKUP=$(mktemp -d /tmp/g6-ft.XXXXXX) || exit 1
cp -p /etc/config/wireless "$FT_BACKUP/wireless" || exit 1
printf 'Wireless backup: %s\n' "$FT_BACKUP"
```

On the workstation generate one lab peer key with `openssl rand -hex 16`. Keep it private and use the same value on the pair. Set `SELF` and `PEER` to the colon-delimited `addr` from `iw dev ath1 info` on the local and other AP respectively. On A set `LOCAL_ID=g6-a-24` and `PEER_ID=g6-b-24`. On B swap both MACs and both IDs. Keep the example mobility domain `4f57` identical across the pair, or choose a different common four-digit hex value for a separate AP group. With those four variables set, run the key prompt by itself on each router. Enter the key when prompted. Then paste the separate staging block.

```sh
printf 'Lab peer key: '
stty -echo
read -r KH_KEY
stty echo
printf '\n'
```

```sh
VAP=ath1
RADIO=wifi1
stage_ft() {
  mac_pattern='^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$'
  printf '%s\n' "$SELF" | grep -Eq "$mac_pattern" || return 1
  printf '%s\n' "$PEER" | grep -Eq "$mac_pattern" || return 1
  [ "$SELF" != "$PEER" ] && [ "$LOCAL_ID" != "$PEER_ID" ] || return 1
  [ -n "$LOCAL_ID" ] && [ -n "$PEER_ID" ] || return 1
  printf '%s\n' "$KH_KEY" | grep -Eq '^[0-9A-Fa-f]{32}$' || return 1
  [ "$(uci -q get wireless.$VAP.ifname)" = "$VAP" ] || return 1
  [ "$(uci -q get wireless.$VAP.device)" = "$RADIO" ] || return 1
  [ "$(uci -q get wireless.$VAP.mode)" = ap ] || return 1
  [ -z "$(uci -q get wireless.$VAP.wpa_key_mgmt)" ] || return 1
  SELF_HEX=$(printf '%s' "$SELF" | tr -d :)
  uci -q batch <<EOF
set wireless.$VAP.ieee80211r=1
set wireless.$VAP.mobility_domain=4f57
set wireless.$VAP.ft_over_ds=0
set wireless.$VAP.ft_psk_generate_local=1
set wireless.$VAP.pmk_r1_push=0
set wireless.$VAP.nasid=$LOCAL_ID
set wireless.$VAP.nasid2=$PEER_ID
set wireless.$VAP.r1_key_holder=$SELF_HEX
set wireless.$VAP.ap_macaddr=$SELF
set wireless.$VAP.ap2_macaddr=$PEER
set wireless.$VAP.ap2_r1_key_holder=$PEER
set wireless.$VAP.kh_key_hex=$KH_KEY
EOF
}
if stage_ft; then
  unset KH_KEY
  /sbin/wifi reload_legacy "$RADIO"
else
  unset KH_KEY
  echo 'FT inputs or UCI staging failed. Check values and revert before trying again.'
fi
```

The generator appends `r0kh` and `r1kh` entries even with local FT-PSK generation enabled. The explicit IDs keep those lines parseable. The own `r1_key_holder` uses 12 hex digits and the peer ID in the `r1kh` line uses colon-delimited octets. Local generation avoids PMK-R1 push/pull for FT-PSK. A per-VAP `wpa_key_mgmt` override bypasses the generator's computed AKM list, which is why the example checks for one. [Hostapd configuration reference](https://android.googlesource.com/platform/external/wpa_supplicant_8/+/oreo-release/hostapd/hostapd.conf).

After the reload on each AP:

```sh
grep -E '^(interface|bss|wpa_key_mgmt|mobility_domain|ft_over_ds|ft_psk_generate_local|pmk_r1_push)=' \
  /var/run/hostapd-ath1.conf
hostapd_cli -p /var/run/hostapd-wifi1 -i ath1 status | grep -E '^(state|freq)='
hostapd_cli -p /var/run/hostapd-wifi1 -i ath1 get_config \
  | grep -E '^(wpa|key_mgmt|rsn_pairwise_cipher)='
cmp -s "$FT_BACKUP/wireless" /etc/config/wireless || echo 'On-disk wireless changed'
```

Both APs need an enabled BSS with `FT-PSK` and `mobility_domain=4f57`. If the generated file has FT but the active daemon does not, check `logread | grep -Ei 'hostapd|r0kh|r1kh|FT-PSK' | tail -50` locally and roll back. Inspect logs before sharing. Reconnect the test client once and repeat the walk. On a Linux test client, `wpa_cli -i "$IF" roam "$TARGET_BSSID"` can also exercise a transition to a BSSID already in its scan results. Use the walking test to measure the client's normal roaming decision. Check for `key_mgmt=FT-PSK` in client status, a BSSID change and an uninterrupted IP assignment. For conclusive proof of the handoff, use a separate monitor-mode receiver on the target channel and look for an FT Authentication exchange (algorithm 2) and an FT-bearing Reassociation Request/Response. Use two monitor receivers if the APs are on different channels and you need both sides.

To restore, revert staged UCI changes and restore the saved file if the reload wrote to disk. Then reload the same radio:

```sh
if [ -s "$FT_BACKUP/wireless" ]; then
  uci -q revert wireless
  if cmp -s "$FT_BACKUP/wireless" /etc/config/wireless || \
     cp -p "$FT_BACKUP/wireless" /etc/config/wireless; then
    /sbin/wifi reload_legacy "$RADIO"
  fi
fi
```

If the lab passes and you want persistence, `uci commit wireless` makes the staged settings persistent in UCI. Check the generated file and running daemon again after a reboot and after a stock Wi-Fi settings update. The Nokia configuration manager may regenerate UCI, so persistence has its own test.

## 3. Measure 802.11k and 802.11v independently

For **11k**, inspect the target BSS beacon or probe response for the RM Enabled Capabilities IE in a monitor capture. With a Linux supplicant that exposes the command, try `wpa_cli -i wlan0 neighbor_rep_request` while associated and watch the interactive supplicant events or capture a Radio Measurement Neighbor Report Request/Response (category 5, actions 4 and 5). The peer BSSID in the response is the proof that the other AP is being supplied as a candidate. Qualcomm `get_rrm=1` alone gives no information about the neighbor list. The upstream `SHOW_NEIGHBOR` handler returns `FAIL` when the hostapd Neighbor Report capability bit is off, which fits the stock sample. This build's generator did not expose a confirmed persistent `rrm_neighbor_report` setting. [Hostapd neighbor control handlers](https://android.googlesource.com/platform/external/wpa_supplicant_8/+/77d572f14330ddd3d38e2d5233475e1100ad45b1/hostapd/ctrl_iface.c).

For **11v**, start from the restored baseline or take a separate protected backup of the known-good FT settings. On the lab BSS run `uci set wireless.ath1.bss_transition=1` and `/sbin/wifi reload_legacy wifi1`. Use the rollback above afterward. Check for `bss_transition=1` in the generated file and the BSS Transition bit in the beacon's Extended Capabilities. Associate the test station and confirm its actual Wi-Fi MAC with `iw dev wlan0 info` on the client. From the AP serving that client, send an advisory request:

```sh
hostapd_cli -p /var/run/hostapd-wifi1 -i ath1 bss_tm_req "$STA" disassoc_timer=0
```

Set `STA` to the test station's current Wi-Fi MAC. This request contains no forced-disassociation flag or candidate list. An `OK` is the local command's result. Capture the WNM BSS Transition Management Request/Response (category 10, actions 7 and 8) or inspect the client events to establish what the client did. A client can respond without roaming. Autonomous 11v candidate selection and a persistent 11k neighbor list for independently configured G6s remain unverified. [Hostapd BSS transition handler](https://android.googlesource.com/platform/external/wpa_supplicant_8/+/android-8.0.0_r1/hostapd/ctrl_iface.c).
