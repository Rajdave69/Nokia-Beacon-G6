#!/usr/bin/env python3
"""Bounded UPnP status reader. No mapping writes, connection controls or subscriptions."""
import argparse,http.client,ipaddress,json,xml.etree.ElementTree as ET
ACTIONS={
 'GetCommonLinkProperties':('WANCommonInterfaceConfig:1','/upnp/control/WANCommonIFC1'),
 'GetStatusInfo':('WANIPConnection:2','/upnp/control/WANIPConn1'),
 'GetNATRSIPStatus':('WANIPConnection:2','/upnp/control/WANIPConn1'),
 'GetExternalIPAddress':('WANIPConnection:2','/upnp/control/WANIPConn1'),
 'GetFirewallStatus':('WANIPv6FirewallControl:1','/upnp/control/WANIPv6FwCtrl1'),
 'GetGenericPortMappingEntry':('WANIPConnection:2','/upnp/control/WANIPConn1'),
}
MAX_RESPONSE=524288

def build_request(action,index=0):
 if action not in ACTIONS:raise ValueError('Only the six reviewed getter actions are accepted')
 if not 0<=index<=65535:raise ValueError('Mapping index must be 0..65535')
 short,path=ACTIONS[action];service='urn:schemas-upnp-org:service:'+short
 ns='http://schemas.xmlsoap.org/soap/envelope/'
 envelope=ET.Element('{'+ns+'}Envelope',{'{'+ns+'}encodingStyle':'http://schemas.xmlsoap.org/soap/encoding/'})
 body=ET.SubElement(envelope,'{'+ns+'}Body');call=ET.SubElement(body,'{'+service+'}'+action)
 if action=='GetGenericPortMappingEntry':ET.SubElement(call,'NewPortMappingIndex').text=str(index)
 data=ET.tostring(envelope,encoding='utf-8',xml_declaration=True)
 headers={'Content-Type':'text/xml; charset="utf-8"','SOAPAction':'"'+service+'#'+action+'"','User-Agent':'Nokia-UPnP-Research/1.0','Connection':'close'}
 return path,data,headers

def parse_response(action,status,data):
 root=ET.fromstring(data);fields={n.tag.split('}')[-1]:(n.text or '').strip() for n in root.iter() if not list(n)}
 return {'action':action,'http_status':status,'fault':fields if 'errorCode' in fields else None,'values':{} if 'errorCode' in fields else fields}

def query(host,port,action,index=0,timeout=5):
 ipaddress.ip_address(host)
 if not 1<=port<=65535:raise ValueError('Invalid HTTP port')
 path,data,headers=build_request(action,index);conn=http.client.HTTPConnection(host,port,timeout=timeout)
 try:
  conn.request('POST',path,data,headers);reply=conn.getresponse();payload=reply.read(MAX_RESPONSE+1)
  if len(payload)>MAX_RESPONSE:raise ValueError('Response exceeded size limit')
  # http.client does not follow redirects; descriptions cannot redirect this reader to another host.
  return parse_response(action,reply.status,payload)
 finally:conn.close()

def main():
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--host',required=True,help='Explicit router IP address');ap.add_argument('--port',type=int,default=49152);ap.add_argument('--action',choices=list(ACTIONS),default='GetStatusInfo');ap.add_argument('--index',type=int,default=0);args=ap.parse_args()
 print(json.dumps(query(args.host,args.port,args.action,args.index),indent=2))
if __name__=='__main__':main()
