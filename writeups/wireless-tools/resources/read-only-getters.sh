cd /tmp
printf '=== hostapd 5GHz status ===\n'
hostapd_cli -p /var/run/hostapd-wifi0 -i ath0 status
printf 'hostapd_5_status=%s\n' "$?"
printf '=== hostapd 2GHz status ===\n'
hostapd_cli -p /var/run/hostapd-wifi1 -i ath1 status
printf 'hostapd_2_status=%s\n' "$?"
printf '=== USSA channel getters ===\n'
if command -v timeout >/dev/null 2>&1; then
 timeout 8 ussa_cli -g channel -b 0
 printf 'ussa_band0_status=%s\n' "$?"
 timeout 8 ussa_cli -g channel -b 3
 printf 'ussa_band3_status=%s\n' "$?"
else
 printf 'timeout unavailable; USSA getters skipped\n'
fi
printf '=== complete ===\n'
