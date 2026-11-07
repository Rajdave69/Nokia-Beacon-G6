#!/bin/sh
# Read existing state and exactly two cached-read endpoints. No service startup.
# Run inside an existing authorized router shell. Output may contain identifiers.
printf '=== build ===\n'
grep -E '^(IMAGEVERSION|SOFTWAREVERSION|BUILDDATE|HOMEOSVERSION)=' /etc/buildinfo
printf '=== processes ===\n'
ps w | grep -E '[e]cd|[a]pcloud|[n]va'
printf '=== ECD listener ===\n'
netstat -lntp 2>/dev/null | grep -E '(:18090|/ecd)'
printf '=== version ===\n'
curl --noproxy '*' --connect-timeout 2 --max-time 5 -sS http://127.0.0.1:18090/1/version
printf '\n=== cached topology ===\n'
curl --noproxy '*' --connect-timeout 2 --max-time 5 -sS http://127.0.0.1:18090/1/topology
printf '\n'
