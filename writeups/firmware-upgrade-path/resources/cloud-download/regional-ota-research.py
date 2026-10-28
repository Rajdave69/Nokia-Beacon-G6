#!/usr/bin/env python3
"""Bounded region/operator metadata scenarios using saved owner identities only."""
import argparse,csv,hashlib,importlib.util,json,sys,time
from pathlib import Path
sys.dont_write_bytecode=True
G6=Path(__file__).resolve().parents[4];B9=G6.parent/'Nokia-Beacon-9'
spec=importlib.util.spec_from_file_location('ota_client',G6/'scripts/ota-firmware-download.py');client=importlib.util.module_from_spec(spec);spec.loader.exec_module(client)
def main():
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--execute',action='store_true');args=ap.parse_args()
 if not args.execute:ap.error('Requires --execute; sends saved owner identities/key to approved normal Nokia endpoint')
 paths={'g6':G6/'config-private/ota-cloud-analysis/g6-ota-profile.json','b9':B9/'config-private/ota-cloud-analysis/b9-ota-profile.json'}
 originals={k:p.read_bytes() for k,p in paths.items()};profiles={k:json.loads(v) for k,v in originals.items()}
 assert all(v['operatorcode']=='BOQA' and v['url'].rstrip('/')=='https://swupd.wifi.nokia.com' for v in profiles.values())
 countries=['fi','dk','se','sg','au','ca','de','gb','jp','kr','ae','sa','br','mx','za','id','th','ph','my','np','eg','vn','nz','fr']
 b9countries=['sg','au','us','gb','de','in','ca','jp','br','za','np','eg']
 operators=[('ALCL','eu'),('NKBB','eu'),('SING','sg'),('WLNP','np'),('EGEB','eg'),('BNZL','nz'),('DFNL','nl'),('TRUE','th')]
 inventory=B9/'writeups/operator-id-inventory.csv';rows={r['id']:r for r in csv.DictReader(inventory.open(encoding='utf-8'))}
 for code,country in operators:assert rows[code]['g6_preconfiguration_sections'] and rows[code]['b9_preconfiguration_sections'],code
 cases=[('g6','BOQA','eu','3FE49996IJLJ03','baseline'),('b9','BOQA','qa','3TN01100JJMK31','baseline')]
 cases += [('g6','BOQA',country,'3FE49996IJLJ03','country') for country in countries]
 cases += [('b9','BOQA',country,'3TN01100JJMK31','country') for country in b9countries]
 for code,country in operators:
  cases += [('g6',code,country,v,'operator-country') for v in ['3FE49996IJLJ03','3FE49996HJLL91']]
  cases += [('b9',code,country,'3TN01100JJMK31','operator-country')]
 assert len(cases)==62
 cache=G6/'config-private/regional-ota-research-20261026';cache.mkdir(parents=True,exist_ok=False,mode=0o700)
 report={'date':'2026-10-26 Asia/Riyadh','scope':'62 two-second-spaced discovery scenarios. Actual saved owner serial/MAC/model/key held fixed; BOQA country grid plus8 operator-header codes present in both shipped profile inventories. Codes/countries are hypothetical query inputs, not actual device provisioning or verified country/operator pairings. Native isopctl=N. No router, enrollment/status PUT/install operation.',
  'authorization':'Owner explicitly requested more OTA research across world regions and firmware acquisition. Same approved destination/key and owned device identities; no fabricated serial/MAC or login-bypass attempt.',
  'operator_inventory':{'source':str(inventory),'sha256':hashlib.sha256(inventory.read_bytes()).hexdigest()},'cases_planned':len(cases),'queries':[],'downloads':[],'private_artifacts':[],'complete':False,'stop_reason':None}
 known={'fc87c474793286273df44dafcc3b605f'};downloaded=set()
 for number,(device,operator,country,version,group) in enumerate(cases,1):
  original=profiles[device];profile=dict(original,operatorcode=operator);out=cache/f'{number:03d}-{device}-{operator}-{country}-{version}'
  row={'number':number,'device':device,'scenario':group,'operatorcode':operator,'countrycode':country,'reported_version':version,'actual_profile_operator':'BOQA','actual_profile_country':original['countrycode'],'actual_profile_version':original['curswversion']}
  try:
   result=client.query(profile,out,version,country);row.update({k:result.get(k) for k in ['queried_at_utc','http_status','responseCode']})
   row['offers']=[{k:item.get(k) for k in ['model','currentVersion','nxtMSVersion','checksum','has_download_url','download_host','download_path']} for item in result['offers']]
   raw=json.loads((out/'offer.json').read_bytes())
   for index,item in enumerate(raw.get('versions',[])):
    if not item.get('fileServerURL'):continue
    checksum=item.get('checksum');identity=(item.get('nxtMSVersion'),checksum)
    if checksum and checksum.lower() in known:row['download_disposition']='Already captured checksum; skipped duplicate transfer';continue
    if identity in downloaded:continue
    if len(report['downloads'])>=8:raise ValueError('Eight-image download cap reached')
    name=str(item.get('nxtMSVersion') or 'unnamed')
    if not all(c.isalnum() or c in '._-' for c in name):raise ValueError('Unexpected version filename')
    root=G6 if device=='g6' else B9;target=root/'config-private/downloaded-firmware'/(name+'-'+operator+'-regional-research.bin')
    download=client.download(raw,target,index);download['request_operator_scenario']=operator;download['compatibility']='Research bytes only; no assertion of BOQA compatibility';report['downloads'].append(download);downloaded.add(identity)
    if checksum:known.add(checksum.lower())
  except Exception as exc:row['error_type']=type(exc).__name__;report['stop_reason']='First request/download error; stopped without retry'
  report['queries'].append(row)
  for f in sorted(out.glob('*')):
   if f.is_file():data=f.read_bytes();report['private_artifacts'].append({'source':str(f),'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()})
  report['profiles_unchanged']=all(paths[k].read_bytes()==v for k,v in originals.items());assert report['profiles_unchanged']
  Path(__file__).with_name('regional-ota-matrix.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
  print(json.dumps({k:row.get(k) for k in ['number','device','operatorcode','countrycode','reported_version','http_status','responseCode','offers','error_type']}),flush=True)
  if report['stop_reason']:break
  time.sleep(2)
 report['complete']=len(report['queries'])==len(cases) and report['stop_reason'] is None
 Path(__file__).with_name('regional-ota-matrix.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8');print(json.dumps({'complete':report['complete'],'queries':len(report['queries']),'downloads':len(report['downloads']),'stop_reason':report['stop_reason']}),flush=True)
if __name__=='__main__':main()
