#!/bin/sh
# Read-only lifecycle inventory. No install/start/stop/set/daemon commands.
printf '%s\n' '=== build ==='
grep -E '^(IMAGEVERSION|SOFTWAREVERSION|HOMEOSVERSION|BUILDDATE)=' /etc/buildinfo 2>/dev/null
printf '%s\n' '=== existing processes ==='
ps w | grep -E '[t]imingila|[c]thulhu|[r]lyeh|[l]cm-adapter|[a]mxrt'
printf '%s\n' '=== CLI inventory ==='
lcm list
for object in SoftwareModules Cthulhu Rlyeh; do
    printf '=== default-bus %s objects ===\n' "$object"
    ubus list "$object*"
done
for object in SoftwareModules.ExecEnv.1 Timingila Rlyeh Cthulhu.Config; do
    printf '=== %s settings ===\n' "$object"
    ubus call "$object" _get '{"depth":0}'
done
