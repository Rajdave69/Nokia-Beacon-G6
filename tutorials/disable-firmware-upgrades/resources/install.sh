#!/bin/sh
# Install from a directory containing guard.sh, blocked.sh and firewall-include.sh.
# Root only. This changes /configs and one named firewall INCLUDE, not packet rules.
set -eu
PATH=/usr/sbin:/usr/bin:/sbin:/bin
export PATH
base=/configs/firmware-update-lock
[ "$(id -u)" = 0 ] || { echo 'Root is required.' >&2; exit 1; }
fail() { echo "$*" >&2; exit 1; }
[ "$#" = 1 ] && [ "$1" = --uplinks-disconnected ] || fail 'Disconnect Internet and mesh uplinks, then use --uplinks-disconnected.'
awk '$2 == "/configs" && $3 == "ubifs" && $4 ~ /(^|,)rw(,|$)/ {ok=1} END {exit !ok}' /proc/mounts || fail '/configs must be writable UBIFS.'
[ "$(readlink -f /etc/config)" = /configs/overlay/etc/config ] || fail '/etc/config is not the inspected persistent configuration link.'
grep -Eq '^SOFTWAREVERSION=(HJL[.]L91p01|IJL[.]J03p01)$' /rom/etc/buildinfo || fail 'Unreviewed stock firmware version.'
[ ! -e "$base" ] && [ ! -L "$base" ] || fail 'Lock directory already exists; inspect it instead of overwriting it.'
if uci -q get firewall.g6_firmware_lock >/dev/null 2>&1; then fail 'Named firewall section already exists.'; fi
[ -z "$(uci changes firewall)" ] || fail 'Uncommitted firewall edits exist; resolve those first.'
for p in /tmp/.upgrade.burning /tmp/sysupgrade /tmp/upgrade_pid; do
    [ ! -e "$p" ] || fail "Possible in-progress upgrade marker: $p. Do not interrupt a flash."
done
for p in /proc/[0-9]*/comm; do
    [ -r "$p" ] || continue
    name=$(cat "$p" 2>/dev/null || :)
    case "$name" in sysupgrade|imageTool|upgraded|ca.upgrade) fail "Possible running flash helper: $name. Do not interrupt it." ;; esac
done
source=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
for f in guard.sh blocked.sh firewall-include.sh remove.sh; do
    [ -f "$source/$f" ] && [ ! -L "$source/$f" ] || fail "Missing/unsafe installation file: $f"
    sh -n "$source/$f"
done
umask 077
mkdir "$base"
cp -p /etc/config/firewall "$base/firewall.before"
for f in guard.sh blocked.sh firewall-include.sh remove.sh; do cp "$source/$f" "$base/$f"; done
chmod 700 "$base" "$base/guard.sh" "$base/firewall-include.sh" "$base/remove.sh"
chmod 755 "$base/blocked.sh"
printf '%s\n' 'G6 firmware-update lock v1' > "$base/owner"
: > "$base/enabled"
# Persist the early caller before applying. A partial apply reports failure and
# leaves the include installed for inspection/retry, never a false success.
uci set firewall.g6_firmware_lock=include
uci set firewall.g6_firmware_lock.type=script
uci set firewall.g6_firmware_lock.path=/configs/firmware-update-lock/firewall-include.sh
uci set firewall.g6_firmware_lock.enabled=1
uci set firewall.g6_firmware_lock.reload=1
uci commit firewall
sh "$base/guard.sh" apply
printf '%s\n' 'Installed. Do not reconnect uplinks yet: reboot offline, then verify status and processes.'
