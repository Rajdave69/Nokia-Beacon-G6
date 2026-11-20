cd /tmp || exit 124
printf '\n=== build ===\n'
grep -E '^(IMAGEVERSION|SOFTWAREVERSION|BUILDDATE|HOMEOSVERSION)=' /etc/buildinfo
printf '\n=== frontend service listeners ===\n'
netstat -lntp 2>/dev/null | grep -E ':(80|443|8099|60980)[[:space:]]'
printf '\n=== default event objects ===\n'
ubus -v list 'Nokia.*'
printf 'default_bus_exit=%s\n' "$?"
printf '\n=== session event objects ===\n'
ubus -s /var/run/ubus-session/ubus.sock -v list 'Nokia.*'
printf 'session_bus_exit=%s\n' "$?"
printf '\n=== backend path metadata ===\n'
for _we_f in /webs/service_function_web_app.cgi /www/service_function_web_app.cgi; do
  if [ -e "$_we_f" ] || [ -L "$_we_f" ]; then ls -ld "$_we_f"; else printf 'not_present=%s\n' "$_we_f"; fi
done
printf '\n=== candidate service processes ===\n'
for _we_p in /proc/[0-9]*; do
  [ -r "$_we_p/comm" ] || continue
  read -r _we_comm < "$_we_p/comm"
  case "$_we_comm" in websocket|raccess|httpd|mini_httpd|thttpd|lighttpd|webs|boa|uhttpd)
    printf '%s %s ' "${_we_p##*/}" "$_we_comm"
    grep '^Uid:' "$_we_p/status"
    readlink "$_we_p/exe"
  ;; esac
done
printf '\n=== complete ===\n'
