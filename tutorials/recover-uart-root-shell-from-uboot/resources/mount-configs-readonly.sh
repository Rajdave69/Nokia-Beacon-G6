#!/bin/sh
# Optional preparation AFTER the UART PID1 recovery shell is reached.
# Creates volatile mounts/device nodes and attaches the named UBI store.
# Mounts /configs read-only; never formats, erases, detaches or restores files.
# Syntax checked offline; this mount helper has not been live-tested.
set -eu
PATH=/usr/sbin:/usr/bin:/sbin:/bin
export PATH
[ "$(id -u)" = 0 ] || { echo 'Root is required.'; exit 1; }
[ -r /proc/mounts ] || mount -t proc proc /proc
[ -d /sys/class/mtd ] || mount -t sysfs sysfs /sys
if awk '$2 == "/configs" {found=1} END {exit !found}' /proc/mounts; then
    echo '/configs is already mounted; leaving it unchanged.'
    exit 0
fi
[ -d /configs ] || { echo '/configs mount point is absent; review this firmware.'; exit 1; }
mtd_number=$(awk '$4 == "\"rootfs_data1\"" {gsub(/^mtd|:$/, "", $1); print $1; exit}' /proc/mtd)
[ -n "$mtd_number" ] || { echo 'rootfs_data1 not found; refusing another partition.'; exit 1; }
# This target is the owner's captured cfg_partition. Check it before using
# this helper on another unit or after a storage migration.
if ! awk '$2 == "/dev" {found=1} END {exit !found}' /proc/mounts; then
    mount -t tmpfs -o mode=0755 tmpfs /dev
fi
make_char() {
    numbers=$(cat "$1")
    major=${numbers%:*}
    minor=${numbers#*:}
    [ -c "$2" ] || mknod "$2" c "$major" "$minor"
}
[ -c /dev/null ] || mknod /dev/null c 1 3
make_char /sys/class/misc/ubi_ctrl/dev /dev/ubi_ctrl
make_char "/sys/class/mtd/mtd$mtd_number/dev" "/dev/mtd$mtd_number"
if [ -r /sys/class/ubi/ubi6/mtd_num ]; then
    [ "$(cat /sys/class/ubi/ubi6/mtd_num)" = "$mtd_number" ] || {
        echo 'UBI6 is occupied by another partition; stopping without detaching it.'; exit 1;
    }
else
    ubiattach /dev/ubi_ctrl -m "$mtd_number" -d 6
fi
make_char /sys/class/ubi/ubi6_0/dev /dev/ubi6_0
mount -t ubifs -o ro /dev/ubi6_0 /configs
printf 'Mounted rootfs_data1 (Linux mtd%s) at /configs read-only.\n' "$mtd_number"
