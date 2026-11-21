Page: Maintenance/Log

# GET log_status_web_app.cgi?info

Headers:
```
HTTP/1.0 200 OK
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: no-referrer
Content-Security-Policy: default-src 'self' *.NokiaWifi.com ws://www.webgui.nokiawifi.com:8099 'unsafe-inline' 'unsafe-eval';img-src * data: 'unsafe-inline'
Strict-Transport-Security: max-age=2592000; includeSubdomains
Access-Control-Allow-Origin: http://localhost:8080
Access-Control-Allow-Credentials: true
Content-type: text/html;charset=UTF-8;
```

Body: (none)

Response:
```json
{
  "syslog_cfg": {
    "Status": "Disabled",
    "Option": "localbuffer",
    "LocalDisplayLevel": "Debug",
    "LocalLogLevel": "Debug",
    "RemoteLogLevel": "Notice",
    "ServerIPAddress": "0.0.0.0",
    "ServerPortNumber": 514
  },
  "ct_syslog_cfg": {
    "Enable": 1,
    "Level": 7
  },
  "device_info": {
    "Manufacturer": "ALCL",
    "ManufacturerOUI": "2874F5",
    "ModelName": "Nokia WiFi Beacon G6",
    "Description": "",
    "ProductClass": "Beacon G6",
    "SerialNumber": "<srno>",
    "HardwareVersion": "3FE49949CCAA",
    "SoftwareVersion": "3FE49996HJLL91",
    "ModemFirmwareVersion": "",
    "EnabledOptions": "",
    "AdditionalHardwareVersion": "",
    "AdditionalSoftwareVersion": "May-16-2020.18:32:20 ",
    "SpecVersion": "1.0",
    "ProvisioningCode": "BOQA",
    "UpTime": 92519,
    "FirstUseDate": "2026-08-27T22:38:53Z",
    "X_ASB_COM_NumberOfCpuThreads": 1,
    "X_ASB_COM_SwBuildTimestamp": "",
    "X_ASB_COM_DslPhyDrvVersion": "",
    "X_ASB_COM_VoiceServiceVersion": ""
  },
  "lan_ip": {
    "IPInterfaceIPAddress": "192.168.18.1",
    "IPInterfaceSubnetMask": "255.255.255.0"
  }
}
```


# POST log_status_web_app.cgi?vlog_glb

Headers:
```
POST http://192.168.18.1/log_status_web_app.cgi?vlog_glb HTTP/1.1
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
```

Body (encrypted):
```
csrf_token
```

Response:
```
Manufacturer:ALCL
ProductClass:Beacon G6
SerialNumber:<srno>
HWVer:3FE49949CCAA
SWVer:3FE49996HJLL91
IP:192.168.18.1

(rest of log)
```

