cd /tmp
printf '=== processes ===\n'
ps w | grep -E '[e]cd|[a]pcloud|[n]va'
printf '=== listeners ===\n'
netstat -lntp 2>/dev/null | grep -E '(:18090|/ecd)'
printf '=== listener overrides ===\n'
for f in /configs/easymesh/rest_listen_address /configs/easymesh/rest_listen_port; do
 if [ -e "$f" ]; then printf '%s present\n' "$f"; else printf '%s missing\n' "$f"; fi
done
printf '=== ECD bus name ===\n'
if command -v dbus-send >/dev/null 2>&1; then
 dbus-send --system --type=method_call --print-reply --reply-timeout=4000 --dest=org.freedesktop.DBus /org/freedesktop/DBus org.freedesktop.DBus.ListNames 2>&1 | grep -E 'nokia.ecd|nokia.ai_engine'
else
 printf 'dbus-send unavailable\n'
fi
printf '=== completion ===\n'
