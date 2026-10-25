#!/usr/bin/env bash
set -euo pipefail

ROUTER_IP="${ROUTER_IP:-192.168.18.1}"
TELNET_PORT="${TELNET_PORT:-2323}"
DUMP_SCOPE="${DUMP_SCOPE:-firmware}"
case "$DUMP_SCOPE" in
    firmware) PARTS=(0 1 2 3 4 5 6 7 9 10) ;;
    full)     PARTS=(0 1 2 3 4 5 6 7 8 9 10 11) ;;
    *) echo "DUMP_SCOPE must be firmware or full" >&2; exit 2 ;;
esac

for tool in expect telnet base64 sha256sum zip file; do
    command -v "$tool" >/dev/null || { echo "Missing local tool: $tool" >&2; exit 1; }
done

OUT="${OUT:-$HOME/beacon-g6-clean-dumps-$(date +%Y%m%d-%H%M%S)}"
mkdir -p "$OUT"
cd "$OUT"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

cat > "$TMP/capture.exp" <<'EXPECT'
#!/usr/bin/expect -f
set host  [lindex $argv 0]
set port  [lindex $argv 1]
set cmd   [lindex $argv 2]
set raw   [lindex $argv 3]
set begin [lindex $argv 4]
set end   [lindex $argv 5]

log_user 0
set timeout 30
spawn -noecho telnet $host $port
expect {
    -re {(?i)login:\s*$} {
        send -- "root\r"
        exp_continue
    }
    -re {(?i)password:\s*$} {
        if {![info exists env(TELNET_PASSWORD)] || $env(TELNET_PASSWORD) eq ""} {
            puts stderr "Router requires a password. Set TELNET_PASSWORD first."
            exit 2
        }
        send -- "$env(TELNET_PASSWORD)\r"
        exp_continue
    }
    -re {[#>$] ?$} { }
    timeout { puts stderr "Timed out waiting for router shell"; exit 2 }
    eof     { puts stderr "Telnet disconnected before shell was ready"; exit 2 }
}

# Stop shell command echo from entering the captured output.
send -- "stty -echo\r"
expect {
    -re {[#>$] ?$} { }
    timeout { puts stderr "Could not initialize remote shell"; exit 2 }
    eof     { puts stderr "Telnet disconnected"; exit 2 }
}

# -a is essential here: keep logging even when log_user is disabled.
log_file -a -noappend $raw
send -- "printf '\\n%s\\n' '$begin'\r"
expect {
    -ex $begin { }
    timeout { puts stderr "Timed out waiting for start marker"; exit 2 }
    eof     { puts stderr "Telnet disconnected"; exit 2 }
}

send -- "$cmd\r"
send -- "printf '\\n%s\\n' '$end'\r"
set timeout 7200
expect {
    -ex $end { }
    timeout { puts stderr "Timed out while receiving dump"; exit 2 }
    eof     { puts stderr "Telnet disconnected during capture"; exit 2 }
}
log_file
catch { send -- "exit\r" }
EXPECT

capture() {
    local cmd="$1" destination="$2"
    local begin="__G6_BEGIN_${$}__" end="__G6_END_${$}__"
    local raw="$TMP/telnet-raw.txt"

    expect "$TMP/capture.exp" "$ROUTER_IP" "$TELNET_PORT" \
        "$cmd" "$raw" "$begin" "$end"

    awk -v begin="$begin" -v end="$end" '
        { gsub(/\r/, "") }
        $0 == begin { started = 1; next }
        $0 == end   { finished = 1; exit }
        started     { print }
        END { if (!started || !finished) exit 1 }
    ' "$raw" > "$destination"
    rm -f "$raw"
}

META_CMD="$(cat <<'EOS' | tr '\n' ' '
echo '===== uname ====='; uname -a;
echo; echo '===== OpenWrt ====='; cat /etc/openwrt_release 2>/dev/null || true;
echo; echo '===== /proc/mtd ====='; cat /proc/mtd;
echo; echo '===== kernel cmdline ====='; cat /proc/cmdline;
echo; echo '===== mounts ====='; cat /proc/mounts;
echo; echo '===== UBI ====='; ubinfo -a 2>&1 || true;
echo; echo '===== MTD geometry =====';
for d in /sys/class/mtd/mtd*; do
  echo "--- $d ---";
  for f in name size erasesize writesize oobsize; do
    if [ -f "$d/$f" ]; then printf '%s=' "$f"; cat "$d/$f"; fi;
  done;
done;
echo; echo '===== NAND / UBI boot log =====';
dmesg | grep -Ei 'nand|mtd|ubi|ubifs|squashfs|fit' || true;
EOS
)"

echo "Collecting metadata from $ROUTER_IP:$TELNET_PORT ..."
capture "$META_CMD" router-metadata.txt
capture 'cat /proc/mtd' proc-mtd.txt

for n in "${PARTS[@]}"; do
    echo "==== Dumping mtd$n ===="
    line="$(grep -m1 -E "^mtd${n}:[[:space:]]" proc-mtd.txt || true)"
    if [[ -z "$line" ]]; then
        echo "ERROR: expected physical mtd$n not present; check /proc/mtd" >&2
        exit 1
    fi

    hex_size="$(awk -v part="mtd$n:" '$1 == part { print $2; exit }' proc-mtd.txt)"
    size=$((16#$hex_size))
    name="${line#*\"}"
    name="${name%%\"*}"
    name="$(printf '%s' "$name" | tr -cs '[:alnum:]_.-' '_')"
    [[ -n "$name" ]] || name=unknown

    printf -v filename 'mtd%02d_%s.bin' "$n" "$name"
    echo "Name: $name | Expected: $size bytes | File: $filename"

    capture "if command -v base64 >/dev/null 2>&1; then base64 /dev/mtd$n; else busybox base64 /dev/mtd$n; fi" "$TMP/mtd.b64"
    base64 -d "$TMP/mtd.b64" > "$filename"
    rm -f "$TMP/mtd.b64"

    actual="$(stat -c '%s' "$filename")"
    echo "Received: $actual bytes"
    if [[ "$actual" -ne "$size" ]]; then
        echo "ERROR: mtd$n expected $size bytes, got $actual. Aborting." >&2
        exit 1
    fi
    echo "Size check: OK"
done

shopt -s nullglob
files=(mtd*.bin)
((${#files[@]})) || { echo "No partitions were dumped" >&2; exit 1; }
sha256sum "${files[@]}" > SHA256SUMS.txt
file "${files[@]}" > FILE-TYPES.txt
zip -6 beacon-g6-clean-dumps.zip \
    router-metadata.txt proc-mtd.txt SHA256SUMS.txt FILE-TYPES.txt "${files[@]}"
echo "Completed: $OUT/beacon-g6-clean-dumps.zip"
