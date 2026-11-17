cd /tmp || exit 124
printf '\n=== build ===\n'
grep -E '^(IMAGEVERSION|SOFTWAREVERSION|BUILDDATE|HOMEOSVERSION)=' /etc/buildinfo
printf '\n=== UPnP processes ===\n'
for _up_p in /proc/[0-9]*; do
  [ -r "$_up_p/comm" ] || continue
  read -r _up_comm < "$_up_p/comm"
  case "$_up_comm" in ndk_upnpd|miniupnpd)
    printf '%s %s ' "${_up_p##*/}" "$_up_comm"
    grep '^Uid:' "$_up_p/status"
    printf 'loaded libraries:\n'
    awk '$NF ~ /libupnp|libthreadutil|libssl|libcrypto/ {print $NF}' "$_up_p/maps" | sort -u
  ;; esac
done
printf '\n=== listeners ===\n'
netstat -lnptu 2>/dev/null | grep -E 'ndk_upnpd|miniupnpd|:1900[[:space:]]|:49152[[:space:]]'
printf '\n=== effective file settings ===\n'
grep -E \
  -e '^(debug_mode|create_forward_rules|forward_rules_append|forward_chain_name|prerouting_chain_name|duration)[[:space:]]*=' \
  -e '^(description_document_name|lower_description_document|xml_document_path|listenport|event_update_interval|advertisement_interval)[[:space:]]*=' \
  -e '^(ipv6firewall_enabled|ipv6inbound_pinhole_allowed|control_point_authorized|ipv6forward_chain_name|ipv6_ula_gua_enabled|ipv6_linklocal_enabled)[[:space:]]*=' \
  -e '^(ipv4_enabled)[[:space:]]*=' \
  /etc/upnpd.conf
printf '\n=== runtime file metadata ===\n'
ls -ld /tmp/upnpd /tmp/daemon/upnpd.dm /tmp/upnpdlanhost.conf /configs/upnp_igdv1 2>/dev/null
printf '\n=== code hashes ===\n'
sha256sum /sbin/ndk_upnpd /lib/libupnp.so.6 /lib/libupnp_ixml.so.2 /sbin/ndk_appsd /usr/bin/cfgmgr
printf '\n=== complete ===\n'
