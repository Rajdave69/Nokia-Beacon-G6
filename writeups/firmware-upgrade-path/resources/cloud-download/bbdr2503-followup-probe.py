#!/usr/bin/env python3
"""Four explicitly invoked G6 discovery cases; no router or updater operation."""
import argparse,hashlib,importlib.util,json,sys,time
from pathlib import Path
sys.dont_write_bytecode=True
G6=Path(__file__).resolve().parents[4]
spec=importlib.util.spec_from_file_location('ota_client',G6/'scripts/ota-firmware-download.py');client=importlib.util.module_from_spec(spec);spec.loader.exec_module(client)
def main():
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--execute',action='store_true');args=ap.parse_args()
 if not args.execute:ap.error('Requires --execute; sends saved owner key/identity to approved normal Nokia endpoint')
 source=G6/'config-private/ota-cloud-analysis/g6-ota-profile.json';before=source.read_bytes();profile=json.loads(before)
 assert profile['url'].rstrip('/')=='https://swupd.wifi.nokia.com' and profile['operatorcode']=='BOQA' and profile['countrycode']=='eu'
 base=G6/'config-private/bbdr2503-research-20261026/ota-operator-control';base.mkdir(parents=True,exist_ok=False,mode=0o700)
 report={'date':'2026-10-26 Asia/Riyadh','authorization':'Owner requested continued investigation and acquisition of the G6 BBDR2503 firmware; prior authority covers parameter research/download using the same saved key/identity/endpoint.',
  'scope':'At most4 two-second-spaced normal discovery POSTs, no retries; same G6 serial/MAC/model/API key/BOQA/eu. N control then Y header scenarios. Native firmware normally sends N; backend meaning of Y is not established. No other operator or fabricated identity, status PUT, install or router contact.',
  'queries':[],'downloads':[],'private_artifacts':[],'stop_reason':None,'profile_sha256_before':hashlib.sha256(before).hexdigest()}
 known={'fc87c474793286273df44dafcc3b605f'}
 cases=[('N','3FE49996IJLJ03'),('Y','3FE49996HJLL91'),('Y','3FE49996IJLJ03'),('Y','3FE49996UMJ28')]
 for i,(flag,version) in enumerate(cases,1):
  out=base/f'{i:02d}-{flag}-{version}';row={'isopctl':flag,'gateway_and_device_version':version,'countrycode':'eu'}
  query_profile=dict(profile,isopctl=flag)
  req=client.metadata_request(query_profile,version);assert req.get_header('Isopctl')==flag
  try:
   result=client.query(query_profile,out,version);row.update({k:result.get(k) for k in ['queried_at_utc','http_status','responseCode']})
   row['offers']=[{k:item.get(k) for k in ['model','currentVersion','nxtMSVersion','checksum','has_download_url','download_host','download_path']} for item in result['offers']]
   raw=json.loads((out/'offer.json').read_bytes())
   for index,item in enumerate(raw.get('versions',[])):
    if not item.get('fileServerURL'):continue
    checksum=item.get('checksum')
    if checksum and checksum.lower() in known:row['download_disposition']='Captured identical cloud checksum; no duplicate GET';continue
    name=str(item.get('nxtMSVersion') or 'unnamed')
    if not all(c.isalnum() or c in '._-' for c in name):raise ValueError('Unexpected version filename')
    result=client.download(raw,G6/'config-private/downloaded-firmware'/(name+'-2503-research.bin'),index);report['downloads'].append(result)
    if checksum:known.add(checksum.lower())
  except Exception as exc:
   row['error_type']=type(exc).__name__;report['stop_reason']='Stopped on first error; no retries'
  report['queries'].append(row)
  for f in sorted(out.glob('*')):
   if f.is_file():data=f.read_bytes();report['private_artifacts'].append({'source':str(f),'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()})
  report['profile_unchanged']=source.read_bytes()==before;assert report['profile_unchanged']
  Path(__file__).with_name('bbdr2503-followup-matrix.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
  print(json.dumps(row),flush=True)
  if report['stop_reason']:break
  time.sleep(2)
 print(json.dumps({'queries':len(report['queries']),'downloads':len(report['downloads']),'stop_reason':report['stop_reason'],'profile_unchanged':report['profile_unchanged']}),flush=True)
if __name__=='__main__':main()
