cd /tmp
id -u
grep -E '^(IMAGEVERSION|SOFTWAREVERSION|HOMEOSVERSION|BUILDDATE)=' /etc/buildinfo
sha256sum /usr/bin/ecd /usr/bin/apcloud /usr/lib/libnilecd.so /usr/lib/libecdrpc.so
ps w | grep -E '[e]cd|[a]pcloud|[n]va|[u]busd'
printf 'TCP_LISTENERS_ECD_APCLOUD\n'
netstat -lntp 2>/dev/null | grep -E 'ecd|apcloud'
for f in /configs/easymesh/rest_listen_address /configs/easymesh/rest_listen_port; do
  if [ -r "$f" ]; then printf 'PRESENT:%s\n' "$f"; cat "$f"; else printf 'MISSING:%s\n' "$f"; fi
done
printf 'DEFAULT_BUS_MESH\n'
ubus -v list 'mesh*'
printf 'SESSION_BUS_MESH\n'
ubus -s /var/run/ubus-session/ubus.sock -v list 'mesh*'
printf 'DEFAULT_BUS_CLOUD\n'
ubus -v list '*cloud*'
