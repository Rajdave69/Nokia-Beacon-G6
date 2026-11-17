cd /tmp
printf '=== build ===\n'
grep -E '^(IMAGEVERSION|SOFTWAREVERSION|BUILDDATE|HOMEOSVERSION)=' /etc/buildinfo
printf '=== tool hashes ===\n'
sha256sum /usr/bin/ussa_cli /usr/bin/wlancli /usr/sbin/iw /usr/sbin/hostapd_cli /usr/sbin/cfg80211tool /usr/sbin/cfg80211tool.1 /usr/sbin/acfg_tool /usr/sbin/wlanconfig
printf '=== iw interfaces ===\n'
iw dev
printf 'iw_dev_status=%s\n' "$?"
printf '=== regulatory state ===\n'
iw reg get
printf 'iw_reg_status=%s\n' "$?"
printf '=== wireless counters ===\n'
cat /proc/net/wireless
printf '=== control sockets ===\n'
ls -ld /var/run/hostapd* /var/run/wpa_supplicant* 2>/dev/null
for d in /var/run/hostapd-wifi*; do
 if [ -d "$d" ]; then ls -l "$d"; fi
done
printf '=== selected driver XML ===\n'
for f in /sys/class/net/*/cfg80211_xmlfile; do
 if [ -f "$f" ]; then printf '%s: ' "$f"; cat "$f"; fi
done
printf '=== complete ===\n'
