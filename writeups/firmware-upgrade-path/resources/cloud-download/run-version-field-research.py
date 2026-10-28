#!/usr/bin/env python3
"""Explicitly invoked four-case gateway/device version comparison; no install."""
import argparse,hashlib,importlib.util,json,sys,time
from pathlib import Path
sys.dont_write_bytecode=True
ROOT=Path(__file__).resolve().parents[4]
spec=importlib.util.spec_from_file_location('ota_client',ROOT/'scripts/ota-firmware-download.py');client=importlib.util.module_from_spec(spec);spec.loader.exec_module(client)
def main():
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--execute',action='store_true');args=ap.parse_args()
 if not args.execute:ap.error('Requires --execute: sends saved owner device key and identity to normal Nokia endpoint')
 profile=json.loads((ROOT/'config-private/ota-cloud-analysis/g6-ota-profile.json').read_text(encoding='utf-8'))
 assert profile['operatorcode']=='BOQA' and profile['countrycode']=='eu'
 base=ROOT/'config-private/ota-version-fields-research-20261026';base.mkdir(parents=True,exist_ok=False,mode=0o700)
 cases=[('3FE49996UMJ28','3FE49996HJLL91'),('3FE49996UMJ28','3FE49996IJLJ03'),('3FE49996HJLL91','3FE49996UMJ28'),('3FE49996IJLJ03','3FE49996UMJ28')]
 report={'date':'2026-10-26 Asia/Riyadh','scope':'Four two-second-spaced normal metadata queries with separate gateway header/device JSON version; same G6 owner identity/key/BOQA/eu/model. No router contact/status PUT/activation/install. No retries.',
  'authorization':'Owner requested parameter modifications and download of available firmware; this separates the two native version inputs, without changing identity/operator.',
  'queries':[],'downloads':[],'private_artifacts':[],'stop_reason':None}
 known={'fc87c474793286273df44dafcc3b605f'}
 for i,(gateway,device) in enumerate(cases,1):
  out=base/f'{i:02d}';row={'gateway_version':gateway,'device_version':device,'countrycode':'eu','private_directory':str(out)}
  try:
   result=client.query(profile,out,device,None,gateway);row.update({k:result.get(k) for k in ['queried_at_utc','http_status','responseCode']})
   row['offers']=[{k:item.get(k) for k in ['model','currentVersion','nxtMSVersion','checksum','has_download_url','download_host','download_path']} for item in result['offers']]
   raw=json.loads((out/'offer.json').read_bytes())
   for index,item in enumerate(raw.get('versions',[])):
    if not item.get('fileServerURL'):continue
    checksum=item.get('checksum')
    if checksum and checksum.lower() in known:row['download_disposition']='Identical already captured cloud checksum; skipped duplicate';continue
    name=str(item.get('nxtMSVersion') or 'unnamed')
    if not all(c.isalnum() or c in '._-' for c in name):raise ValueError('Unexpected version filename')
    result=client.download(raw,ROOT/'config-private/downloaded-firmware'/(name+'-version-fields.bin'),index)
    report['downloads'].append(result)
    if checksum:known.add(checksum.lower())
  except Exception as exc:
   row['error_type']=type(exc).__name__;report['stop_reason']='Stopped at first error; no retries'
  report['queries'].append(row)
  for f in sorted(out.glob('*')):
   if f.is_file():data=f.read_bytes();report['private_artifacts'].append({'source':str(f),'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()})
  Path(__file__).with_name('version-field-matrix.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
  print(json.dumps({k:v for k,v in row.items() if k!='private_directory'}),flush=True)
  if report['stop_reason']:break
  time.sleep(2)
 print(json.dumps({'queries':len(report['queries']),'downloads':len(report['downloads']),'stop_reason':report['stop_reason']}),flush=True)
if __name__=='__main__':main()
