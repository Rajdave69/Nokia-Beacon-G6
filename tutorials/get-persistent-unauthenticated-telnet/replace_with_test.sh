#!/bin/sh

# Persistent development telnet hook for Nokia Beacon G6.
# Executed by /rom/etc/init.d/wifi_fw_mount when this file is executable.

PATH=/usr/sbin:/usr/bin:/sbin:/bin
export PATH

LOG=/configs/debug/telnet-root.log
TELNET_PID=/tmp/root-telnetd.pid
CHECK_PID=/tmp/root-telnet-check.pid
PORT=2323
TELNETD=/usr/sbin/telnetd

log()
{
    echo "$(date 2>/dev/null) $*" >> "$LOG"
}

open_firewall()
{
    # Keep exactly one ACCEPT rule for this port.
    while iptables -D INPUT -p tcp --dport "$PORT" -j ACCEPT 2>/dev/null; do
        :
    done
    iptables -I INPUT -p tcp --dport "$PORT" -j ACCEPT >> "$LOG" 2>&1
    log "iptables insert rc=$?"
}

start_telnet()
{
    # Remove a stale pidfile if the recorded PID no longer exists.
    if [ -f "$TELNET_PID" ]; then
        P="$(cat "$TELNET_PID" 2>/dev/null)"
        if [ -z "$P" ] || ! kill -0 "$P" 2>/dev/null; then
            rm -f "$TELNET_PID"
        fi
    fi

    # If the pidfile still identifies a live process, leave it alone.
    if [ -f "$TELNET_PID" ]; then
        P="$(cat "$TELNET_PID" 2>/dev/null)"
        if [ -n "$P" ] && kill -0 "$P" 2>/dev/null; then
            log "telnetd already running pid=$P"
            return 0
        fi
    fi

    /sbin/start-stop-daemon \
        -S -b -m -p "$TELNET_PID" \
        -c 0:0 \
        -x "$TELNETD" \
        -- -F -p "$PORT" -l /bin/sh \
        >> "$LOG" 2>&1

    RC=$?
    log "telnet start rc=$RC"
    return "$RC"
}

log "========================================"
log "replace_with_test.sh INVOKED"
log "hook identity: $(id)"

open_firewall
start_telnet

# Schedule one detached late check.  start-stop-daemon, rather than '(...) &',
# owns the detachment so it survives the init script returning.
if [ -f "$CHECK_PID" ]; then
    P="$(cat "$CHECK_PID" 2>/dev/null)"
    if [ -z "$P" ] || ! kill -0 "$P" 2>/dev/null; then
        rm -f "$CHECK_PID"
    fi
fi

if [ ! -f "$CHECK_PID" ]; then
    /sbin/start-stop-daemon \
        -S -b -m -p "$CHECK_PID" \
        -c 0:0 \
        -x /bin/sh \
        -- -c '
            PATH=/usr/sbin:/usr/bin:/sbin:/bin
            export PATH
            LOG=/configs/debug/telnet-root.log
            PORT=2323
            TELNET_PID=/tmp/root-telnetd.pid
            TELNETD=/usr/sbin/telnetd

            sleep 60
            echo "$(date 2>/dev/null) delayed check running: $(id)" >> "$LOG"

            while iptables -D INPUT -p tcp --dport "$PORT" -j ACCEPT 2>/dev/null; do
                :
            done
            iptables -I INPUT -p tcp --dport "$PORT" -j ACCEPT >> "$LOG" 2>&1
            echo "$(date 2>/dev/null) delayed iptables rc=$?" >> "$LOG"

            if ! netstat -lnt 2>/dev/null | grep -q ":$PORT "; then
                rm -f "$TELNET_PID"
                /sbin/start-stop-daemon \
                    -S -b -m -p "$TELNET_PID" \
                    -c 0:0 \
                    -x "$TELNETD" \
                    -- -F -p "$PORT" -l /bin/sh \
                    >> "$LOG" 2>&1
                echo "$(date 2>/dev/null) delayed telnet restart rc=$?" >> "$LOG"
            else
                echo "$(date 2>/dev/null) delayed check: TCP/$PORT already listening" >> "$LOG"
            fi
        ' \
        >> "$LOG" 2>&1

    log "delayed-check launch rc=$?"
else
    log "delayed check already scheduled/running"
fi

exit 0
