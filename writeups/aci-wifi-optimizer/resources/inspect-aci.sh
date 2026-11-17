#!/bin/sh
# Getter-only collector for the exact G6 HJL ACI build examined here.
# Run from an existing authorized shell. If copied to a router, use /tmp.
# Output can contain private node identifiers; retain it privately.
set -u
cd /tmp || exit 1
check_hash() {
    actual=$(sha256sum "$1") || return 1
    case "$actual" in "$2 "*) return 0;; *) return 1;; esac
}
check_hash /usr/bin/aci 876a66e3563d234711a24487a62b58b6f010611d1cf868061e30a6c32f65d132 || exit 90
check_hash /usr/bin/ai_controller 8e5903569e24c9ed7dcddf6e24036a03d7abf2748e5a20ccac61eefe9047aa25 || exit 90
check_hash /usr/lib/libnillocalRRM.so 39c2b3c068d0ce8f23bed53edf263e55f7c239ddcf5ca9e40b9886b839a37ad9 || exit 90
check_hash /usr/lib/libnilnva.so 35c4937eeda589bfcb0987443f8cc8de1d2837cd5e73fe05ae6c508d7c6da107 || exit 90
check_hash /usr/lib/libndbus.so c419145f65d29afb6696647c8ad26439dacdd82b0fca36c79b31b906acdce29d || exit 90
case "$#" in 0|1) ;; *) printf 'Usage: sh /tmp/inspect-aci.sh [node-MAC]\n' >&2; exit 2;; esac
node=${1:-}
if [ -z "$node" ] && [ -r /sys/class/net/br-lan/address ]; then
    node=$(cat /sys/class/net/br-lan/address)
fi
printf '=== build ===\n'
grep -E '^(IMAGEVERSION|SOFTWAREVERSION|HOMEOSVERSION|BUILDDATE)=' /etc/buildinfo
printf '=== controller version ===\n'
aci
printf '=== automatic-channel status ===\n'
aci -g auto -b 24
aci -g auto -b 5
printf '=== allowed channels ===\n'
aci -g channel_list -b 24
aci -g channel_list -b 5
if [ -n "$node" ]; then
    printf '%s\n' "$node" | grep -E '^([[:xdigit:]]{2}:){5}[[:xdigit:]]{2}$' >/dev/null || exit 2
    printf '=== cached node and scores ===\n'
    aci -g node -m "$node"
    aci -g score -m "$node" -b 24
    aci -g score -m "$node" -b 5
    aci -g align_score -m "$node" -b 5
fi
