#!/usr/bin/env bash
# Read-only NAND MTD captures over SSH; main data areas only (no OOB).
set -euo pipefail

ROUTER="${ROUTER:-ONTUSER@192.168.19.1}"
DUMP_SCOPE="${DUMP_SCOPE:-firmware}"
case "$DUMP_SCOPE" in
    firmware) PARTS=(0 1 2 3 4 5 6 7 9 10) ;;
    full)     PARTS=(0 1 2 3 4 5 6 7 8 9 10 11) ;;
    *) echo "DUMP_SCOPE must be firmware or full" >&2; exit 2 ;;
esac

for tool in ssh sha256sum zip file stat awk tr; do
    command -v "$tool" >/dev/null || { echo "Missing local tool: $tool" >&2; exit 1; }
done

OUT="${OUT:-$HOME/beacon-g6-clean-dumps-$(date +%Y%m%d-%H%M%S)}"
mkdir -p "$OUT"
cd "$OUT"

# -T ensures no pseudo-terminal interferes with binary reads.
ssh -T "$ROUTER" '
echo "===== uname ====="; uname -a
echo; echo "===== OpenWrt ====="; cat /etc/openwrt_release 2>/dev/null || true
echo; echo "===== /proc/mtd ====="; cat /proc/mtd
echo; echo "===== kernel cmdline ====="; cat /proc/cmdline
echo; echo "===== mounts ====="; cat /proc/mounts
echo; echo "===== UBI ====="; ubinfo -a 2>&1 || true
echo; echo "===== MTD geometry ====="
for d in /sys/class/mtd/mtd*; do
    echo "--- $d ---"
    for f in name size erasesize writesize oobsize; do
        if [ -f "$d/$f" ]; then printf "%s=" "$f"; cat "$d/$f"; fi
    done
done
echo; echo "===== NAND / UBI boot log ====="
dmesg | grep -Ei "nand|mtd|ubi|ubifs|squashfs|fit" || true
' > router-metadata.txt
ssh -T "$ROUTER" 'cat /proc/mtd' > proc-mtd.txt

for n in "${PARTS[@]}"; do
    line="$(awk -v part="mtd$n:" '$1 == part {print; exit}' proc-mtd.txt)"
    if [[ -z "$line" ]]; then
        echo "ERROR: expected physical mtd$n not present; check /proc/mtd" >&2
        exit 1
    fi
    hex_size="$(awk -v part="mtd$n:" '$1 == part {print $2; exit}' proc-mtd.txt)"
    expected=$((16#$hex_size))
    name="${line#*\"}"
    name="${name%%\"*}"
    name="$(printf '%s' "$name" | tr -cs '[:alnum:]_.-' '_')"
    [[ -n "$name" ]] || name=unknown
    printf -v filename 'mtd%02d_%s.bin' "$n" "$name"

    echo "Capturing mtd$n ($name, $expected bytes) -> $filename"
    if ! ssh -T "$ROUTER" "cat /dev/mtd$n" > "$filename"; then
        rm -f "$filename"
        echo "ERROR: SSH read failed on mtd$n" >&2
        exit 1
    fi
    actual="$(stat -c '%s' "$filename")"
    if [[ "$actual" -ne "$expected" ]]; then
        echo "ERROR: mtd$n expected $expected bytes, received $actual" >&2
        exit 1
    fi
done

shopt -s nullglob
files=(mtd*.bin)
((${#files[@]} == ${#PARTS[@]})) || { echo "ERROR: incomplete dump set" >&2; exit 1; }
sha256sum "${files[@]}" > SHA256SUMS.txt
file "${files[@]}" > FILE-TYPES.txt
zip -6 beacon-g6-clean-dumps.zip \
    router-metadata.txt proc-mtd.txt SHA256SUMS.txt FILE-TYPES.txt "${files[@]}"
echo "Completed: $OUT/beacon-g6-clean-dumps.zip"
