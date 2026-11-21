Page: Advanced settings/UPnP and DLNA

# POST upnp_web_app.cgi?config_glb

Headers:
```
POST http://192.168.18.1/upnp_web_app.cgi?config_glb HTTP/1.1
host: 192.168.18.1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:154.0) Gecko/20100101 Firefox/154.0
Accept: application/json, text/plain, */*
Accept-Language: en-US,en;q=0.9
Referer: https://192.168.18.1/
Content-Type: application/x-www-form-urlencoded
Content-Length: 234
Origin: https://192.168.18.1
Connection: keep-alive
Cookie: lang=en; lsid={LSID}; sid={SID}
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Priority: u=0
```

Body:
```
csrf_token
```

Response: 
```json
{"result":0,"reason":0}
```