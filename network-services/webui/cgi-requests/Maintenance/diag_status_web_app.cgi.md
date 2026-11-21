Page: Maintenance/Diagnostics

# GET `diag_status_web_app.cgi

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

Body: (empty)

Response:
```json
{
  "lan_ether": [
    {
      "Enable": 1,
      "Status": "NoLink",
      "MACAddress": "<mac>",
      "MACAddressControlEnabled": 0,
      "MaxBitRate": "Auto",
      "DuplexMode": "Auto",
      "X_ASB_COM_IfName": "",
      "X_ASB_COM_EthernetPriorityMark": -1,
      "X_ASB_COM_dot1qPvid": 1,
      "stat": {
        "BytesSent": 0,
        "BytesReceived": 0,
        "PacketsSent": 0,
        "PacketsReceived": 0,
        "UnicastPacketsSent": 0,
        "UnicastPacketsReceived": 0,
        "MulticastPacketsSent": 0,
        "MulticastPacketsReceived": 0,
        "BroadcastPacketsSent": 0,
        "BroadcastPacketsReceived": 0,
        "ErrorsSent": 0,
        "ErrorsReceived": 0,
        "DiscardPacketsSent": 0,
        "DiscardPacketsReceived": 0,
        "UnknownProtoPacketsReceived": 0
      }
    },
    {
      "Enable": 1,
      "Status": "NoLink",
      "MACAddress": "<mac>",
      "MACAddressControlEnabled": 0,
      "MaxBitRate": "Auto",
      "DuplexMode": "Auto",
      "X_ASB_COM_IfName": "",
      "X_ASB_COM_EthernetPriorityMark": -1,
      "X_ASB_COM_dot1qPvid": 1,
      "stat": {
        "BytesSent": 0,
        "BytesReceived": 0,
        "PacketsSent": 0,
        "PacketsReceived": 0,
        "UnicastPacketsSent": 0,
        "UnicastPacketsReceived": 0,
        "MulticastPacketsSent": 0,
        "MulticastPacketsReceived": 0,
        "BroadcastPacketsSent": 0,
        "BroadcastPacketsReceived": 0,
        "ErrorsSent": 0,
        "ErrorsReceived": 0,
        "DiscardPacketsSent": 0,
        "DiscardPacketsReceived": 0,
        "UnknownProtoPacketsReceived": 0
      }
    },
    {
      "Enable": 1,
      "Status": "Up",
      "MACAddress": "<mac>",
      "MACAddressControlEnabled": 0,
      "MaxBitRate": "Auto",
      "DuplexMode": "Auto",
      "X_ASB_COM_IfName": "",
      "X_ASB_COM_EthernetPriorityMark": -1,
      "X_ASB_COM_dot1qPvid": 1,
      "stat": {
        "BytesSent": 166952,
        "BytesReceived": 50749,
        "PacketsSent": 101948,
        "PacketsReceived": 52616,
        "UnicastPacketsSent": 95192,
        "UnicastPacketsReceived": 46555,
        "MulticastPacketsSent": 6756,
        "MulticastPacketsReceived": 4354,
        "BroadcastPacketsSent": 0,
        "BroadcastPacketsReceived": 1707,
        "ErrorsSent": 0,
        "ErrorsReceived": 0,
        "DiscardPacketsSent": 0,
        "DiscardPacketsReceived": 0,
        "UnknownProtoPacketsReceived": 0
      }
    }
  ],
  "if_conns_glb": [
    {
      "ipConns": [
        {
          "_oid": 1,
          "_iid": 10101,
          "ConnectionStatus": "Disconnected",
          "X_CT_COM_IPv6ConnStatus": "Disconnected",
          "X_ASB_COM_IfName": "ewan_u_0_1",
          "Name": "1_TR069_INTERNET_OTHER_R_VID_0",
          "X_CT_COM_IPMode": 1,
          "X_ALU_COM_isFixedWAN": 0,
          "ConnectionType": "IP_Routed"
        }
      ],
      "pppConns": []
    }
  ],
  "monitor_status": {
    "Enable": 0,
    "ServerUrl": ""
  }
}
```