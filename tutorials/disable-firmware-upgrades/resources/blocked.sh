#!/bin/sh
# G6 firmware-update lock v1. No arguments are logged.
printf '%s\n' 'Firmware updates are disabled by the owner (G6 update lock).' >&2
logger -t g6-fw-lock "blocked $0" 2>/dev/null || :
exit 126
