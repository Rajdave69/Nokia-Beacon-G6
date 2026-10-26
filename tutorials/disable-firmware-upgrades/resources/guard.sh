#!/bin/sh
# G6 firmware-update lock v1; only the two inspected stock software versions.
# No flash, bank-selection, firewall-rule, service-kill or network commands.
set -eu
PATH=/usr/sbin:/usr/bin:/sbin:/bin
export PATH
base=/configs/firmware-update-lock
run=/tmp/g6-fw-lock
mode=${1:-status}
[ "$(id -u)" = 0 ] || { echo 'Root is required.' >&2; exit 1; }
[ -d "$base" ] && [ ! -L "$base" ] || { echo 'Lock directory absent or symlinked.' >&2; exit 1; }
umask 077
fail() { printf '%s\n' "$*" >&2; exit 1; }
mounted() { awk -v p="$1" '$2 == p {found=1} END {exit !found}' /proc/mounts; }
check_stock() {
    grep -Eq '^SOFTWAREVERSION=(HJL[.]L91p01|IJL[.]J03p01)$' /rom/etc/buildinfo || fail 'Unreviewed firmware; update lock not applied.'
    [ -f "$base/blocked.sh" ] && [ ! -L "$base/blocked.sh" ] || fail 'Blocker is absent or symlinked.'
}
# Required files in BOTH inspected builds. Leave swug diagnostics and the
# image_commit helper available. swug writes/activation reach blocked backends.
targets() {
    printf '%s\n' /usr/exe/image_activate.sh /sbin/sysupgrade \
      /usr/sbin/imageTool /sbin/upgraded /usr/bin/ca.upgrade \
      /webs/upgrade_web_app.cgi /webs/otasw_upgrade_app.cgi \
      /usr/bin/swmgnt /usr/sbin/batch_upgrade
}
check_target() {
    [ -f "$1" ] && [ ! -L "$1" ] || fail "Missing/nonregular/symlinked target: $1"
}
check_bind() {
    mounted "$2" && cmp -s "$1" "$2"
}
bind_one() {
    check_target "$2"
    if mounted "$2"; then
        cmp -s "$1" "$2" || fail "Existing foreign/different file mount: $2"
    else
        mount -o bind "$1" "$2" || fail "Bind failed: $2"
    fi
    check_bind "$1" "$2" || fail "Bind verification failed: $2"
    printf 'bound %s\n' "$2" >> "$run/log"
}
make_pcd() {
    source=/rom/etc/pcd/swmgnt.pcd
    [ -f "$source" ] && [ ! -L "$source" ] || fail 'Stock swmgnt PCD rule absent.'
    [ "$(awk '/^ACTIVE[ \t]*=/ {n++} END {print n+0}' "$source")" = 1 ] || fail 'Unexpected PCD ACTIVE layout.'
    [ "$(awk '/^FAILURE_ACTION[ \t]*=/ {n++} END {print n+0}' "$source")" = 1 ] || fail 'Unexpected PCD failure-action layout.'
    temp=$(mktemp "$run/swmgnt.pcd.XXXXXX")
    sed -e 's/^ACTIVE[ \t]*=.*/ACTIVE = NO/' \
      -e 's/^FAILURE_ACTION[ \t]*=.*/FAILURE_ACTION = NONE/' \
      -e 's/^FAILURE_ACTION2[ \t]*=.*/FAILURE_ACTION2 = NONE/' \
      -e 's/^FAILURE_ACTION_NEXT[ \t]*=.*/FAILURE_ACTION_NEXT = NONE/' \
      "$source" > "$temp"
    chmod 600 "$temp"
    if [ -f "$run/swmgnt.pcd" ] && cmp -s "$temp" "$run/swmgnt.pcd"; then
        rm -f "$temp"
    else
        mv "$temp" "$run/swmgnt.pcd"
    fi
}
verify() {
    [ -f "$base/enabled" ] || fail 'Update lock is disabled.'
    check_stock
    for p in $(targets); do
        check_bind "$base/blocked.sh" "$p" || fail "NOT BLOCKED: $p"
    done
    [ -f "$run/swmgnt.pcd" ] || fail 'No generated swmgnt PCD rule.'
    check_bind "$run/swmgnt.pcd" /etc/pcd/swmgnt.pcd || fail 'swmgnt PCD mount absent/different.'
    grep -q '^ACTIVE = NO$' /etc/pcd/swmgnt.pcd || fail 'swmgnt PCD still active.'
    grep -q '^FAILURE_ACTION = NONE$' /etc/pcd/swmgnt.pcd || fail 'swmgnt PCD still restarts failures.'
}
case "$mode" in
 apply)
    [ -f "$base/enabled" ] || exit 0
    check_stock
    [ ! -L "$run" ] || fail 'Runtime directory is a symlink.'
    mkdir -p "$run"
    chmod 700 "$run"
    # Avoid a hotplug/reload racing another apply. Do not declare ready on contention.
    mkdir "$run/apply.lock" 2>/dev/null || fail 'Another apply is running; retry status shortly.'
    trap 'rmdir "$run/apply.lock" 2>/dev/null || :' 0
    trap 'exit 1' 1 2 15
    rm -f "$run/ready"
    for p in $(targets); do check_target "$p"; done
    check_target /etc/pcd/swmgnt.pcd
    # Guard selection first: this also stops a previously downloaded image's
    # normal Linux activation path. No existing environment flags are changed.
    for p in $(targets); do bind_one "$base/blocked.sh" "$p"; done
    make_pcd
    bind_one "$run/swmgnt.pcd" /etc/pcd/swmgnt.pcd
    verify
    printf '%s\n' 'All configured file guards verified.' > "$run/ready"
    printf '%s\n' 'G6 firmware-update file guards applied.'
    ;;
 status)
    verify
    [ -f "$run/ready" ] || fail 'No completed apply marker.'
    printf '%s\n' 'All 9 executable guards and swmgnt PCD guard are active.'
    printf '%s\n' 'This checks file guards; it does not prove absence of an old mapped/running updater.'
    ;;
 remove)
    # The caller removes the persistent include/enabled flag first. Only remove
    # mounts with our exact source bytes. Never unmount another owner's overlay.
    [ ! -f "$base/enabled" ] || fail 'Remove the enabled flag before removing runtime guards.'
    failed=0
    for p in /etc/pcd/swmgnt.pcd $(targets); do
        if [ "$p" = /etc/pcd/swmgnt.pcd ]; then src="$run/swmgnt.pcd"; else src="$base/blocked.sh"; fi
        if mounted "$p"; then
            if [ -f "$src" ] && cmp -s "$src" "$p"; then
                umount "$p" || failed=1
            else
                printf 'Refusing to unmount an unrecognized overlay: %s\n' "$p" >&2
                failed=1
            fi
        fi
    done
    rm -f "$run/ready"
    [ "$failed" = 0 ] || fail 'Some mounts could not be removed; inspect them before reboot.'
    printf '%s\n' 'Runtime guards removed. Already-running PCD retains its parsed rules until reboot.'
    ;;
 *) fail 'Usage: guard.sh apply|status|remove' ;;
esac
