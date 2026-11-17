#!/usr/bin/env python3
"""OFFLINE: build a private ONT OTA profile from allowlisted saved-getter output.
Uses this firmware's packaged GENERIC API-key default. Does not claim to unwrap
its individually encrypted saved key or obtain a current live profile. No network.
"""
import argparse,hashlib,json,os,re,xml.etree.ElementTree as ET
from pathlib import Path
PREFIX='InternetGatewayDevice.X_ALU-COM_Wifi.X_ALU-COM_SwMgnt.'
def private_write(p,raw):
 fd=os.open(p,os.O_WRONLY|os.O_CREAT|os.O_EXCL,0o600)
 with os.fdopen(fd,'wb') as f:f.write(raw)
def build(settings,xml,ri):
 def get(uri):
  row=settings[uri]
  if not row['found'] or row['read_status']!=1:raise ValueError('Missing saved field: '+uri)
  return bytes.fromhex(row['value_hex']).decode('utf-8')
 fields={}
 for block in range(0,len(ri),0x40000):
  for off in range(block,min(block+0x2000,len(ri)),128):
   key=ri[off:off+64].split(b'\0',1)[0];value=ri[off+64:off+128].split(b'\0',1)[0]
   if key in (b'OperatorID',b'G984Serial',b'MACAddress',b'CountryID'):
    name=key.decode();value=value.decode('ascii')
    if name in fields and fields[name]!=value:raise ValueError('Redundant RI copies disagree: '+name)
    fields[name]=value
 tree=ET.fromstring(xml.removesuffix(b'\0'));generic=[s for s in tree if s.attrib.get('n')=='GENERIC']
 if len(generic)!=1:raise ValueError('Expected one GENERIC section')
 keys=[e.attrib['v'] for e in generic[0].iter() if e.attrib.get('dburi')==PREFIX+'X_ALU-COM_Client_Auth_Key']
 if len(keys)!=1 or not keys[0]:raise ValueError('Expected one nonempty packaged API-key default')
 serial=get('InternetGatewayDevice.DeviceInfo.SerialNumber');mac=get('InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.MACAddress')
 if serial!='ALCL'+fields['G984Serial'].upper():raise ValueError('Saved serial differs from RI')
 if mac.replace(':','').lower()!=fields['MACAddress'].replace(':','').lower():raise ValueError('Saved MAC differs from RI')
 country=get('InternetGatewayDevice.X_ASB_COM_PreConfig.X_ASB_COM_WlanRegion') if get('InternetGatewayDevice.X_ASB_COM_PreConfig.X_ASB_COM_WlanRegionWithHighPriority')=='true' else fields['CountryID']
 profile={'url':get(PREFIX+'X_ALU-COM_Polling_URL'),'api_key':keys[0],'operatorcode':get('InternetGatewayDevice.X_ALU-COM_Wifi.OperatorUniqueID') or fields['OperatorID'],'countrycode':country,'isopctl':'N','model':get('InternetGatewayDevice.DeviceInfo.ModelName'),'curswversion':get('InternetGatewayDevice.DeviceInfo.SoftwareVersion'),'mac':mac,'sn':serial}
 if profile['url']!='https://swupd.wifi.nokia.com' or profile['model']!='XS-2426X-A':raise ValueError('Unknown ONT endpoint/model; inspect matching code first')
 if not re.fullmatch('[A-Za-z]{2}',country) or not re.fullmatch('(?:[0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}',mac):raise ValueError('Malformed country/MAC')
 return profile
def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--settings',type=Path,required=True);p.add_argument('--preconfig',type=Path,required=True);p.add_argument('--ri',type=Path,required=True);p.add_argument('--out',type=Path,required=True);a=p.parse_args()
 result=build(json.loads(a.settings.read_text()),a.preconfig.read_bytes(),a.ri.read_bytes());private_write(a.out,(json.dumps(result,indent=2)+'\n').encode())
 print('Private profile written using the packaged API-key default; no network operation.')
if __name__=='__main__':main()
