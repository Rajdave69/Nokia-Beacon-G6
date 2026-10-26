#!/bin/sh
# fw3 SOURCES this file. Keep the lock in its own shell.
if ! /bin/sh /configs/firmware-update-lock/guard.sh apply; then
    logger -t g6-fw-lock 'ERROR: update lock incomplete; keep uplinks disconnected' 2>/dev/null || :
    echo 'G6 firmware-update lock failed; inspect /tmp/g6-fw-lock/log.' >&2
fi
