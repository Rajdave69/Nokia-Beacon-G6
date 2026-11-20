cd /tmp || exit 124
printf '\n=== live source hashes ===\n'
sha256sum /webs/thttpd /webs/web_whw/main.2a4163f300c9c8bc.js
sha256sum /webs/web_whw/469.84f12ee6b5d962e7.js
sha256sum /usr/bin/websocket /usr/lib/libwebsocket.so
printf '\n=== root and server metadata ===\n'
readlink /proc/8763/cwd
ls -ld /webs /www /rom/webs 2>/dev/null
printf '\n=== final listeners ===\n'
netstat -lntp 2>/dev/null | grep -E ':(80|443|8099|60980)[[:space:]]'
printf '\n=== complete ===\n'
