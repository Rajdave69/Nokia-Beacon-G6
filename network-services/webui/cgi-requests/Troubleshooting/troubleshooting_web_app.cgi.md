Page: Troubleshooting/Troubleshooting counters

# troubleshooting_web_app.cgi

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
Content-type: text/html;charset=UTF-8
Cache-Control: private,max-age=0;
```

Body: (empty)

Response:
```json
{
  "wan_conns": [
    {
      "_oid": 1,
      "WANIPConnectionNumberOfEntries": 1,
      "WANPPPConnectionNumberOfEntries": 0,
      "xponLinkCfg": {
        "Enable": 0,
        "Mode": 0,
        "VLANIDMark": 0,
        "P_802_1pMark": 0
      },
      "ipConns": [
        {
          "_type": "ip",
          "Enable": 1,
          "ConnectionStatus": "Connected",
          "PossibleConnectionTypes": "Unconfigured,IP_Routed",
          "ConnectionType": "IP_Routed",
          "Name": "1_TR069_INTERNET_OTHER_R_VID_0",
          "Uptime": 5,
          "ConnectionTrigger": "AlwaysOn",
          "LastConnectionError": "ERROR_NONE",
          "NATEnabled": 1,
          "X_ASB_COM_FullconeNATEnabled": 0,
          "AddressingType": "DHCP",
          "ExternalIPAddress": "192.168.100.2",
          "SubnetMask": "255.255.255.0",
          "DefaultGateway": "192.168.100.1",
          "X_ASB_COM_FirewallEnabled": 0,
          "X_ASB_COM_IGMPEnabled": 0,
          "DNSEnabled": 1,
          "DNSOverrideAllowed": 0,
          "DNSServers": "8.8.8.8,1.1.1.1",
          "MaxMTUSize": 1500,
          "MACAddress": "40:48:6e:a3:8d:54",
          "MACAddressOverride": 0,
          "X_ASB_COM_IfName": "ewan_u_0_1",
          "X_ASB_COM_ConnectionId": 10101,
          "ShapingRate": -1,
          "ShapingBurstSize": 0,
          "PortMappingNumberOfEntries": 0,
          "X_ASB_COM_IPv6Enabled": 0,
          "X_ASB_COM_IPv4Enabled": 1,
          "X_ASB_COM_IPv6ConnStatus": "Unconfigured",
          "X_ASB_COM_IPv6AddressingType": "DHCP",
          "X_ASB_COM_Dhcp6cForAddress": 0,
          "X_ASB_COM_ExternalIPv6Address": "",
          "X_ASB_COM_IPv6PrefixDelegationEnabled": 0,
          "X_ASB_COM_IPv6SitePrefix": "",
          "X_ASB_COM_IPv6SitePrefixPltime": 0,
          "X_ASB_COM_IPv6SitePrefixVltime": 0,
          "X_ASB_COM_Dhcp6cPid": 0,
          "X_ASB_COM_MLDEnabled": 0,
          "X_CT_COM_IPv6Enable": 0,
          "X_ASB_COM_LastConnected": 0,
          "X_CT_COM_LanInterface": "",
          "X_CT_COM_ServiceList": "TR069,INTERNET,OTHER",
          "X_CT_COM_LanInterface_DHCPEnable": 1,
          "X_CT_COM_MulticastVlan": -1,
          "InterfaceMtu": 1500,
          "X_CT_COM_IPMode": 1,
          "X_CT_COM_IPv6ConnStatus": "Unconfigured",
          "X_CT_COM_IPv6IPAddress": "",
          "X_CT_COM_IPv6IPAddressAlias": "",
          "X_CT_COM_IPv6IPAddressOrigin": "AutoConfigured",
          "X_CT_COM_IPv6DNSServers": "",
          "X_CT_COM_IPv6PrefixDelegationEnabled": 1,
          "X_CT_COM_IPv6PrefixAlias": "",
          "X_CT_COM_IPv6PrefixOrigin": "PrefixDelegation",
          "X_CT_COM_IPv6Prefix": "",
          "X_CT_COM_IPv6PrefixPltime": 86400,
          "X_CT_COM_IPv6PrefixVltime": 86400,
          "X_CT_COM_DefaultIPv6Gateway": "",
          "X_CT_COM_IPv6DomainName": "",
          "X_CT_COM_Dslite_Enable": 0,
          "X_CT_COM_AftrMode": 0,
          "X_CT_COM_Aftr": "",
          "X_ALU_COM_isFixedWAN": 0,
          "status": {
            "EthernetBytesSent": 7475669,
            "EthernetBytesReceived": 5326,
            "EthernetPacketsSent": 20956,
            "EthernetPacketsReceived": 36,
            "X_ASB_COM_RxDrops": 0,
            "X_ASB_COM_TxDrops": 0,
            "X_ASB_COM_RxErrors": 0,
            "X_ASB_COM_TxErrors": 0
          }
        }
      ],
      "pppConns": []
    }
  ],
  "rg_counters_status": {
    "DSThroughputCounter": "WAN Link Down",
    "USThroughputCounter": "WAN Link Down",
    "DSPacketLossCounter": "0",
    "USPacketLossCounter": "0",
    "Latency": "Service is Down",
    "DNSResponseTime": "DNS Response Failed",
    "DomainName": "google.com"
  },
  "lan_ether": [
    {
      "Enable": 1,
      "X_ASB_COM_PhyType": 3,
      "Status": "NoLink",
      "MACAddress": "46:48:6e:a3:8d:52"
    },
    {
      "Enable": 1,
      "X_ASB_COM_PhyType": 3,
      "Status": "NoLink",
      "MACAddress": "46:48:6e:a3:8d:53"
    },
    {
      "Enable": 1,
      "X_ASB_COM_PhyType": 3,
      "Status": "Up",
      "MACAddress": "46:48:6e:a3:8d:54"
    }
  ],
  "port_info": [
  ]
}
```



# troubleshooting_web_app.cgi?ping

Headers:
```
POST http://192.168.18.1/troubleshooting_web_app.cgi?ping HTTP/1.1
host: 192.168.18.1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:154.0) Gecko/20100101 Firefox/154.0
Accept: application/json, text/plain, */*
Accept-Language: en-US,en;q=0.9
Referer: https://192.168.18.1/
Content-Type: application/x-www-form-urlencoded
Content-Length: 426
Origin: https://192.168.18.1
Connection: keep-alive
Cookie: lang=en; lsid={LSID}; sid={SID}
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Priority: u=0
```

Body (Encrypted):

```
wan_conlist: OID of the selected WAN connection.
ipaddress: the user-entered IP address or domain (latency textbox).
direction: tx (upstream), rx (downstream), or bi (bi‑directional).
status: always enable.
domain: the user-entered domain for DNS response test (included even for latency/throughput).
wan_port: always WAN.
waninterfacename: interface name of the selected WAN.
portstatus: connection status (e.g., Connected).
lan_port: selected LAN port (e.g., LAN1).
```

Plaintext: `wan_conlist=1&ipaddress=1.1.1.1&direction=rx&status=enable&domain=&wan_port=WAN&waninterfacename=ewan_u_0_1&portstatus=Connected&lan_port=LAN3&csrf_token={CSRF_TOKEN}`


Most of the variables were extracted from this script: (running it in the same page, then clicking one of the throughout test options)
```js
(function() {
    const el = document.querySelector('app-troubleshooting-counters');
    if (!el || typeof window.ng === 'undefined') {
        console.error("Make sure you are on the troubleshooting page and Angular debug tools are available.");
        return;
    }
    
    const comp = window.ng.getComponent(el);
    if (!comp) {
        console.error("Could not retrieve the Angular component instance.");
        return;
    }

    const t = comp.wanConnList.value;
    const i = comp.selectedWan[comp.wanConnectionList.indexOf(comp.wanConnList.value)];
    const filterNullStr = (val) => "null" !== val && val != null ? val : "";

    const params = {
        wan_conlist: i?._oid,
        ipaddress: filterNullStr(comp.latencyTest.value),
        direction: 0 !== comp.directionList.length ? comp.directionList[0].value : "",
        status: "enable",
        domain: filterNullStr(comp.dnsResponseTime.value),
        wan_port: "WAN",
        waninterfacename: t?.X_ASB_COM_IfName,
        portstatus: t?.ConnectionStatus,
        lan_port: filterNullStr(comp.tblDestPort.value)
    };

    const queryString = Object.entries(params)
        .map(([key, val]) => `${key}=${encodeURIComponent(val !== undefined ? val : '')}`)
        .join('&');

    console.log("--- Extracted Parameters Object ---");
    console.table(params);
    console.log("--- Fully Formatted Query String ---");
    console.log(queryString);
})();
```

Response: 
```json
{"result":0,"reason":0}
```


# troubleshooting_web_app.cgi?dsthroughputtest

Headers: (same as ?ping)

Body: (same as ?ping)

Response: 
```json 
{"dsthroughputval":"12.12 Kbps","uspktloss":"0","dspktloss":"0"}
```


# troubleshooting_web_app.cgi?usthroughputtest

Headers: (same as ?ping)

Body: (same as ?ping)

Response: 
```json 
{"usthroughputval":"5.99 Mbps","uspktloss":"0","dspktloss":"4"}
```

# troubleshooting_web_app.cgi?latencytest

Headers: (same as ?ping)

Body: 
```
csrf_token
```

Response:
```json
 { "latencyval":"3.043 msec" } 
```