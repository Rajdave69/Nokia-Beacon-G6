# POST tr69_web_app.cgi?set_glb

Headers:
```
POST http://192.168.18.1/tr69_web_app.cgi?set_glb HTTP/1.1
host: 192.168.18.1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:154.0) Gecko/20100101 Firefox/154.0
Accept: application/json, text/plain, */*
Accept-Language: en-US,en;q=0.9
Referer: https://192.168.18.1/
Content-Type: application/x-www-form-urlencoded
Content-Length: 511
Origin: https://192.168.18.1
Connection: keep-alive
Cookie: lang=eng; lsid={LSID}; sid={SID}
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Priority: u=0
```

Body:
```
informInterval: Periodic inform interval(s)
acsURL: URL
acsUser: Username
acsPswd: Password
acsswd: likely boolean "Update the ACS password"; 1|0
connReqUser: Connection request username
connReqPswd: Connection request password
connswd: likely boolean "Update the connection password"; 1|0
connReqURL: ???
inform_enable: on|off
EnableCWMP: on|off
csrf_token
```

Plaintext: `informInterval=180&acsURL=https%3A%2F%2F1.1.1.1&acsUser=potato&acsPswd=123&acsswd=1&connReqUser=potato&connReqPswd=123&connswd=1&connReqURL=http%3A%2F%2F12.34.56.78%3A7547&inform_enable=on&EnableCWMP=on&csrf_token=XvPBmDHUnizkzEPj`