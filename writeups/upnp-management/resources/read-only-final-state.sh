cd /tmp || exit 124
printf '\n=== UPnP final process and privilege state ===\n'
for _up_p in /proc/[0-9]*; do
  [ -r "$_up_p/comm" ] || continue
  read -r _up_comm < "$_up_p/comm"
  case "$_up_comm" in ndk_upnpd|miniupnpd)
    printf 'pid=%s name=%s\n' "${_up_p##*/}" "$_up_comm"
    grep -E '^(Uid:|Gid:|CapInh:|CapPrm:|CapEff:|CapBnd:|CapAmb:|NoNewPrivs:|Seccomp:)' "$_up_p/status"
  ;; esac
done
printf '\n=== SSDP and NAT-PMP listeners ===\n'
netstat -lnptu 2>/dev/null | grep -E 'ndk_upnpd|miniupnpd|:5351[[:space:]]'
printf '\n=== UPnP NAT rule state ===\n'
iptables-save -t nat | grep -E '^:PREROUTING_UPNP|^-A PREROUTING_UPNP |^-A .* -j PREROUTING_UPNP'
printf '\n=== complete ===\n'
