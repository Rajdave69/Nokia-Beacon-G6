#!/bin/sh

# Persistent development Telnet hook for G6 HJL and the examined XS-2426X-A.
# Keep the supervisor separate from telnetd: stock service restarts can killall telnetd.
PATH=/usr/sbin:/usr/bin:/sbin:/bin
export PATH
umask 077

LOG=/configs/debug/telnet-root.log
RUN_LOG=/tmp/root-telnet-watchdog.log
DAEMON_LOG=/tmp/root-telnetd.log
TELNET_PID=/tmp/root-telnetd.pid
WATCH_PID=/tmp/root-telnet-watchdog.pid
LOCK=/tmp/root-telnet-watchdog.lock
DISABLED=/tmp/root-telnet.disabled
PORT=2323
INTERVAL=5
TELNETD=/usr/sbin/telnetd
SELF="$0"
case "$SELF" in /*) ;; *) SELF="$(pwd)/$SELF" ;; esac

log()
{
    # Recurring diagnostics stay in RAM, with bounded file sizes.
    if [ -f "$RUN_LOG" ] && [ "$(wc -c < "$RUN_LOG")" -gt 65536 ]; then
        mv -f "$RUN_LOG" "$RUN_LOG.old"
    fi
    echo "$(date 2>/dev/null) $*" >> "$RUN_LOG"
}

valid_pid()
{
    case "$1" in ''|*[!0-9]*|0|1) return 1 ;; esac
    [ -r "/proc/$1/cmdline" ] && kill -0 "$1" 2>/dev/null
}

is_watchdog()
{
    valid_pid "$1" || return 1
    tr '\000' '\n' < "/proc/$1/cmdline" 2>/dev/null |
        awk -v script="$SELF" '
            $0 == script { script_seen = 1 }
            $0 == "--root-telnet-watchdog" { mode_seen = 1 }
            END { exit !(script_seen && mode_seen) }'
}

is_our_telnet()
{
    valid_pid "$1" || return 1
    tr '\000' '\n' < "/proc/$1/cmdline" 2>/dev/null |
        awk -v port="$PORT" '
            NR == 1 && ($0 ~ /(^|\/)telnetd$/ || $0 ~ /(^|\/)busybox$/) { exe = 1 }
            previous == "-p" && $0 == port { port_seen = 1 }
            previous == "-l" && $0 == "/bin/sh" { shell_seen = 1 }
            { previous = $0 }
            END { exit !(exe && port_seen && shell_seen) }'
}

listening()
{
    netstat -lnt 2>/dev/null |
        awk -v port="$PORT" '$6 == "LISTEN" && $4 ~ (":" port "$") { found = 1 }
                               END { exit !found }'
}

open_firewall()
{
    # Avoid repeatedly deleting/reinserting a healthy rule. Recreate after reloads.
    iptables -C INPUT -p tcp --dport "$PORT" -j ACCEPT 2>/dev/null && return 0
    iptables -I INPUT -p tcp --dport "$PORT" -j ACCEPT >> "$DAEMON_LOG" 2>&1
}

stop_daemon()
{
    P="$(cat "$TELNET_PID" 2>/dev/null)"
    if is_our_telnet "$P"; then
        kill "$P" 2>/dev/null
    fi
    rm -f "$TELNET_PID"
}

cleanup()
{
    trap - EXIT HUP INT TERM
    stop_daemon
    rm -f "$WATCH_PID"
    rmdir "$LOCK" 2>/dev/null
    log "watchdog stopped"
}

watchdog()
{
    # Atomic directory creation excludes duplicate supervisors. A short grace
    # period lets a simultaneously starting supervisor publish its real PID.
    if ! mkdir "$LOCK" 2>/dev/null; then
        sleep 2
        P="$(cat "$WATCH_PID" 2>/dev/null)"
        if is_watchdog "$P"; then
            log "watchdog already running pid=$P"
            return 0
        fi
        rmdir "$LOCK" 2>/dev/null || return 1
        mkdir "$LOCK" 2>/dev/null || return 0
    fi
    echo "$$" > "$WATCH_PID"
    trap cleanup EXIT
    trap 'exit 0' HUP INT TERM
    log "watchdog running pid=$$ identity=$(id) interval=${INTERVAL}s"
    STATE=
    FW_STATE=
    while [ ! -f "$DISABLED" ]; do
        if [ -f "$DAEMON_LOG" ] && [ "$(wc -c < "$DAEMON_LOG")" -gt 65536 ]; then
            : > "$DAEMON_LOG"
        fi
        if open_firewall; then
            FW_NOW=ok
        else
            FW_NOW=failed
        fi
        if [ "$FW_NOW" != "$FW_STATE" ]; then
            log "firewall check: $FW_NOW"
            FW_STATE=$FW_NOW
        fi
        P="$(cat "$TELNET_PID" 2>/dev/null)"
        if ! listening; then
            # After the previous poll/startup grace, a matching but non-listening
            # daemon needs recovery too. Do not touch unrelated processes.
            if is_our_telnet "$P"; then
                log "managed telnet pid=$P has no listener; requesting restart"
                kill "$P" 2>/dev/null
                sleep 1
            fi
            if ! is_our_telnet "$P"; then
                rm -f "$TELNET_PID"
                "$TELNETD" -F -p "$PORT" -l /bin/sh >> "$DAEMON_LOG" 2>&1 &
                P=$!
                echo "$P" > "$TELNET_PID"
                log "telnet launched pid=$P; checking listener"
                sleep 1
            fi
        fi
        if listening; then
            if is_our_telnet "$P"; then
                NOW="listening pid=$P"
            else
                # Respect an existing listener; never kill a port owner by guessing.
                NOW="TCP/$PORT occupied; no matching managed PID (not starting a duplicate)"
            fi
        else
            NOW="TCP/$PORT not listening; will retry"
        fi
        if [ "$NOW" != "$STATE" ]; then
            log "$NOW"
            STATE=$NOW
        fi
        # Reap an exited child when possible, retaining its actual exit status.
        if [ -n "$P" ] && ! is_our_telnet "$P"; then
            wait "$P" 2>/dev/null
            RC=$?
            if [ "$RC" -ne 127 ]; then log "telnet pid=$P exited rc=$RC"; fi
            rm -f "$TELNET_PID"
        fi
        sleep "$INTERVAL"
    done
}

case "${1-}" in
    --root-telnet-watchdog) watchdog; exit $? ;;
    --stop)
        # Prevent recovery before signalling; never use killall telnetd.
        : > "$DISABLED"
        P="$(cat "$WATCH_PID" 2>/dev/null)"
        if is_watchdog "$P"; then kill "$P" 2>/dev/null; fi
        stop_daemon
        while iptables -D INPUT -p tcp --dport "$PORT" -j ACCEPT 2>/dev/null; do :; done
        exit 0 ;;
    '') ;;
    *) echo "Usage: sh $SELF [--stop]" >&2; exit 2 ;;
esac

if [ "$(id -u)" != 0 ]; then
    echo "This hook requires root." >&2
    exit 1
fi
# Use an absolute pathname for detached re-entry, including invocation via sh.
[ -r "$SELF" ] || exit 1
mkdir -p /configs/debug
rm -f "$DISABLED"
echo "$(date 2>/dev/null) hook invoked: $(id); watchdog log=$RUN_LOG" >> "$LOG"
P="$(cat "$WATCH_PID" 2>/dev/null)"
if is_watchdog "$P"; then
    log "hook re-invoked; watchdog already running pid=$P"
    exit 0
fi
# Detach once, then supervise in a shell with explicit root UID/GID. The child
# telnetd stays foreground within this supervisor so its PID is unambiguous.
# An empty PID source prevents start-stop-daemon from matching unrelated sh
# processes. The watchdog lock and WATCH_PID own actual duplicate detection.
# Do not add -m: /dev/null is deliberately read-only as a PID source here.
/sbin/start-stop-daemon -S -b -p /dev/null -c 0:0 -x /bin/sh -- "$SELF" --root-telnet-watchdog
RC=$?
echo "$(date 2>/dev/null) watchdog launcher rc=$RC (readiness is in $RUN_LOG)" >> "$LOG"
exit "$RC"
