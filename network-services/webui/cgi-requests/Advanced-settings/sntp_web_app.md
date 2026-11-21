Page: Advanced settings / NTP

# POST /sntp_web_app.cgi?post_glb

Headers:
```
POST http://192.168.18.1/sntp_web_app.cgi?post_glb HTTP/1.1
host: 192.168.18.1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:154.0) Gecko/20100101 Firefox/154.0
Accept: application/json, text/plain, */*
Accept-Language: en-US,en;q=0.9
Referer: https://192.168.18.1/
Content-Type: application/x-www-form-urlencoded
content-length: 598
Origin: https://192.168.18.1
Connection: keep-alive
Cookie: lang=en; lsid={LSID}; sid={SID}
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Priority: u=0
```

Payload:
```
time: URL-encoded date&time in the format `09/01/2026 03:03:08 AM`
ntpServer1: first NTP server from the dropdown; optional
ntpServerOther1: first plaintext NTP server; optional
ntpServer2: second NTP server from the dropdown; optional
ntpServerOther2: second plaintext NTP server; optional
ntpServer3: third NTP server from the dropdown; optional
ntpServerOther3: third plaintext NTP server; optional
interval: time sync interval
timezone: URL-encoded timezone in the format `+03:0 Moscow`
ntpEnabled: on|off
csrf_token
```