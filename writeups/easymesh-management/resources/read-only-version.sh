cd /tmp
printf 'GET:ECD_VERSION\n'
curl --noproxy '*' --connect-timeout 2 --max-time 5 -sS -i http://127.0.0.1:18090/1/version
printf '\nCURL_EXIT=%s\n' "$?"
