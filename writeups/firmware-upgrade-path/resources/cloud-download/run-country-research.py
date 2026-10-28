#!/usr/bin/env python3
"""Explicitly invoked, bounded research queries. Reads private owner profiles.
No router contact, operator/identity changes, activation, or installation.
Raw offers stay private; public report excludes API keys and signed URL tokens.
"""
import argparse,datetime,hashlib,importlib.util,json,sys,time,urllib.parse
from pathlib import Path
sys.dont_write_bytecode=True
G6=Path(__file__).resolve().parents[4]
B9=G6.parent/'Nokia-Beacon-9'
spec=importlib.util.spec_from_file_location('ota_client',G6/'scripts/ota-firmware-download.py')
client=importlib.util.module_from_spec(spec);spec.loader.exec_module(client)
def digest(path):
 data=path.read_bytes();return {'source':str(path),'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()}
def main():
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--execute',action='store_true');args=ap.parse_args()
 if not args.execute:ap.error('Requires --execute: this sends saved owner OTA credentials and identifiers to Nokia')
 countries=['eu','qa','us','in','EU','QA']
 report={'date':'2026-10-26 Asia/Riyadh','authorization':'Owner explicitly asked to modify request parameters such as CountryID to discover older/newer firmware and download offered files. Same saved owner identities/operator/API key/destination; no other operator or device identity queried.',
  'country_values':countries,'country_rationale':'eu/qa are examined device values; us/in are hypothetical geographic scenarios; EU/QA test case sensitivity. None writes factory CountryID.',
  'scope':'At most25 normal discovery POSTs, two-second spacing, no automatic retries. Download previously uncaptured checksums only, maximum four distinct images. No router contact/activation/status PUT/install.',
  'held_fixed':['model','serial','MAC','operatorcode BOQA','API key','isopctl N','endpoint'],
  'queries':[],'downloads':[],'private_artifacts':[],'stop_reason':None}
 plans=[('g6',G6,['3FE49996HJLL91','3FE49996IJLJ03']),('b9',B9,['3TN01100JJMK44','3TN01100JJMK31'])]
 known={'fc87c474793286273df44dafcc3b605f'};downloaded=set();stop=False
 for label,root,versions in plans:
  profile_path=root/f'config-private/ota-cloud-analysis/{label}-ota-profile.json'
  profile=json.loads(profile_path.read_text(encoding='utf-8'));assert profile['operatorcode']=='BOQA' and profile['isopctl']=='N'
  base=root/'config-private/ota-country-research-20261026';base.mkdir(exist_ok=False,parents=True,mode=0o700)
  scenarios=[(country,version) for country in countries for version in versions]
  if label=='g6':scenarios.append(('eu','3FE49996UMJ28'))
  for number,(country,version) in enumerate(scenarios,1):
   out=base/f'{number:02d}-{country}-{version}'
   row={'device':label,'countrycode':country,'reported_version':version,'actual_profile_countrycode':profile['countrycode'],'actual_profile_version':profile['curswversion'],'private_directory':str(out)}
   try:
    result=client.query(profile,out,version,country);row.update({k:result.get(k) for k in ['queried_at_utc','http_status','responseCode']})
    raw=json.loads((out/'offer.json').read_bytes())
    row['offers']=[{k:item.get(k) for k in ['model','currentVersion','nxtMSVersion','checksum','has_download_url','download_host','download_path']} for item in result['offers']]
    for index,item in enumerate(raw.get('versions',[])):
     url=item.get('fileServerURL');checksum=item.get('checksum');identity=(urllib.parse.urlsplit(url or '').path,checksum)
     if not url:continue
     if checksum and checksum.lower() in known:row['download_disposition']='Already captured identical cloud checksum; duplicate transfer skipped';continue
     if identity in downloaded:continue
     if len(report['downloads'])>=4:raise ValueError('New image download cap reached')
     image_dir=root/'config-private/downloaded-firmware';name=str(item.get('nxtMSVersion') or 'unnamed')
     if not all(c.isalnum() or c in '._-' for c in name):raise ValueError('Unexpected version filename')
     target=image_dir/(name+'-country-research.bin')
     download=client.download(raw,target,index);report['downloads'].append(download);downloaded.add(identity)
     if checksum:known.add(checksum.lower())
    print(json.dumps({k:row.get(k) for k in ['device','countrycode','reported_version','http_status','responseCode','offers','download_disposition']}),flush=True)
   except Exception as exc:
    row['error_type']=type(exc).__name__;report['stop_reason']='Stopped on first request/download failure; no retries';stop=True
    print(json.dumps({'device':label,'countrycode':country,'reported_version':version,'error_type':type(exc).__name__}),flush=True)
   report['queries'].append(row)
   for f in sorted(out.glob('*')):
    if f.is_file():report['private_artifacts'].append(digest(f))
   public=Path(__file__).with_name('country-matrix.json');public.write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
   if stop:break
   time.sleep(2)
  if stop:break
 print(json.dumps({'queries':len(report['queries']),'downloads':len(report['downloads']),'stop_reason':report['stop_reason']}),flush=True)
if __name__=='__main__':main()
