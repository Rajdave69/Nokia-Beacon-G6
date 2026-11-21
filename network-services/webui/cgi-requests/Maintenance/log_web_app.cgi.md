Page: Maintenance/Log

# POST log_web_app.cgi?set_log_glb


Headers:
```
POST http://192.168.18.1/log_web_app.cgi?set_log_glb HTTP/1.1
host: 192.168.18.1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:154.0) Gecko/20100101 Firefox/154.0
Accept: application/json, text/plain, */*
Accept-Language: en-US,en;q=0.9
Referer: https://192.168.18.1/
Content-Type: application/x-www-form-urlencoded
Content-Length: 277
Origin: https://192.168.18.1
Connection: keep-alive
Cookie: lang=en; lsid=ANEMDMCXTDReCAyq; sid=qyNJkdFYlguXYAgc
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Priority: u=0
```

Body (encrypted):
```
logLevel: 'Writing Level' probably the log level written to file. 1 -> Emergency; 7 -> Debug
logDispLevel: The log level to retrieve from the file. Textual: eg Informational, Debug.
csrf_token
```

Plaintext: `logLevel=6&logDispLevel=Informational&csrf_token={CSRF_TOKEN}`

Response:
```json
{"result":0,"reason":0}
```

Page: Maintenance/Syslog

# also POST log_web_app.cgi?set_log_glb

THIS WORKS! Even though the user doesn't have permissions to see this page and set this config, it does work!

Headers:
```
POST http://192.168.18.1/log_web_app.cgi?set_log_glb HTTP/1.1
host: 192.168.18.1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:154.0) Gecko/20100101 Firefox/154.0
Accept: application/json, text/plain, */*
Accept-Language: en-US,en;q=0.9
Referer: https://192.168.18.1/
Content-Type: application/x-www-form-urlencoded
content-length: 342
Origin: https://192.168.18.1
Connection: keep-alive
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Priority: u=0
Cookie: lang=en; lsid={LSID}; sid={SID}
```


Body (encrypted):
```
Status: Determines whether the custom syslog settings are applied to the running service. true or false
ServerIPAddress: 0.0.0.0
ServerPortNumber: 514
RemoteLogLevel: Notice
csrf_token
```
Option -> localbuffer, localfileandremote, 
Protocol (name/capitalization not confirmed)
LocalFile (name/capitalization not confirmed)
RemoteFile (name/capitalization not confirmed)


Plaintext: `Status=true&RemoteLogLevel=7&ServerIPAddress=1.1.1.1&ServerPortNumber=514&csrf_token=AjGmhJcGBvTNeIAH`

It responds with `error set SyslogCfgObject` if an invalid IP or port is passed in.

