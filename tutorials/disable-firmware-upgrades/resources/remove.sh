#!/bin/sh
set -eu
PATH=/usr/sbin:/usr/bin:/sbin:/bin
export PATH
base=/configs/firmware-update-lock
[ "$(id -u)" = 0 ] || { echo 'Root is required.' >&2; exit 1; }
[ -f "$base/owner" ] && grep -q '^G6 firmware-update lock v1$' "$base/owner" || { echo 'Unrecognized lock directory.' >&2; exit 1; }
[ -z "$(uci changes firewall)" ] || { echo 'Resolve pending firewall edits first.' >&2; exit 1; }
path=$(uci -q get firewall.g6_firmware_lock.path || :)
[ "$path" = "$base/firewall-include.sh" ] || { echo 'Named include absent/changed; review before removal.' >&2; exit 1; }
uci delete firewall.g6_firmware_lock
uci commit firewall
rm -f "$base/enabled"
sh "$base/guard.sh" remove
printf '%s\n' 'Persistent include removed; files and original firewall backup retained.'
printf '%s\n' 'OTA management flags were not re-enabled. Reboot offline before deciding whether to restore them.'
