Page: Maintenance/Diagnostics

# POST `diag_web_app.cgi?ping`

This operation is quite unique. To get each line of its output, make requests to `command_web_app.cgi?cat+<pid>.cmd
`

Headers:
```
POST http://192.168.18.1/diag_web_app.cgi?ping HTTP/1.1
host: 192.168.18.1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:154.0) Gecko/20100101 Firefox/154.0
Accept: application/json, text/plain, */*
Accept-Language: en-US,en;q=0.9
Referer: https://192.168.18.1/
Content-Type: application/x-www-form-urlencoded
Content-Length: 362
Origin: https://192.168.18.1
Connection: keep-alive
Cookie: lang=en; lsid={LSID}; sid={SID}
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Priority: u=0
```

Body (encrypted):
```
ipversion: ipv4 or ipv6
iface: Stands for interface. Always empty afaik.
ipaddr: The target IP address or domain
checkall: The desired operation. can be `ping`, `trace`, or `ping,trace`
pingcount
packetlength
tracehops
csrf_token
```

Response:
```json
{
  "result": 0,
  "pid": <pid>
}
```

Plaintext: `ipversion=ipv4&iface=&ipaddr={ip_addr}&checkall=ping&pingcount=4&packetlength=64&tracehops=30&csrf_token={CSRF_TOKEN}`