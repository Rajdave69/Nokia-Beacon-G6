#!/usr/bin/env python3
"""Three normal mixed-model availability queries using only saved owner identities."""
import argparse,hashlib,importlib.util,json,sys,time,urllib.request
from pathlib import Path
sys.dont_write_bytecode=True
G6=Path(__file__).resolve().parents[4];B9=G6.parent/'Nokia-Beacon-9'
spec=importlib.util.spec_from_file_location('ota_client',G6/'scripts/ota-firmware-download.py');client=importlib.util.module_from_spec(spec);spec.loader.exec_module(client)
def node(profile,version):return {'model':profile['model'],'curswversion':version,'mac':profile['mac'],'sn':profile['sn']}
def main():
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--execute',action='store_true');args=ap.parse_args()
 if not args.execute:ap.error('Requires --execute; sends saved owner identities/key to approved normal Nokia endpoint')
 paths={'g6':G6/'config-private/ota-cloud-analysis/g6-ota-profile.json','b9':B9/'config-private/ota-cloud-analysis/b9-ota-profile.json'}
 originals={label:path.read_bytes() for label,path in paths.items()};profiles={label:json.loads(data) for label,data in originals.items()}
 assert profiles['g6']['api_key']==profiles['b9']['api_key']
 assert all(p['operatorcode']=='BOQA' and p['url'].rstrip('/')=='https://swupd.wifi.nokia.com' for p in profiles.values())
 base=G6/'config-private/bbdr2503-research-20261026/mixed-model';base.mkdir(parents=True,exist_ok=False,mode=0o700)
 report={'date':'2026-10-26 Asia/Riyadh','scope':'Three root-plus-peer matrix POSTs at two-second spacing. Only actual saved owner G6/B9 identities, BOQA operator and same approved API key/endpoint. Models remain associated with their own serial/MAC. Hypothetical mesh membership and one archived G6 version scenario; no mesh enrollment/configuration/status PUT/install/router operation.',
  'authorization':'Owner requested further G6 fixed-firmware acquisition; existing explicit approval covers transmitting both saved profiles to this normal Nokia metadata endpoint and offered downloads.',
  'queries':[],'downloads':[],'private_artifacts':[],'stop_reason':None}
 known={'fc87c474793286273df44dafcc3b605f'}
 cases=[('b9','g6',profiles['g6']['curswversion']),('b9','g6','3FE49996IJLJ03'),('g6','b9',profiles['b9']['curswversion'])]
 for number,(gateway_label,peer_label,peer_version) in enumerate(cases,1):
  gateway=profiles[gateway_label];peer=profiles[peer_label];payload=[node(gateway,gateway['curswversion']),node(peer,peer_version)]
  request=client.metadata_request(gateway);request.data=json.dumps(payload,separators=(',',':')).encode()
  assert request.get_header('Rgw-sn')==gateway['sn'] and request.get_header('Current-rgw-swversion')==gateway['curswversion']
  assert json.loads(request.data)[1]['sn']==peer['sn']
  out=base/f'{number:02d}';out.mkdir(mode=0o700);client.private_write(out/'request-body.json',request.data)
  row={'gateway_model':gateway['model'],'gateway_version':gateway['curswversion'],'peer_model':peer['model'],'peer_version':peer_version,'countrycode':gateway['countrycode']}
  try:
   with client.urllib.request.build_opener(client.NoRedirect).open(request,timeout=30) as response:
    raw=response.read(client.MAX_METADATA+1);row['http_status']=response.status
    if len(raw)>client.MAX_METADATA:raise ValueError('Metadata limit')
   client.private_write(out/'offer.json',raw);offer=json.loads(raw);row['responseCode']=offer.get('responseCode')
   summaries=client.summarize(offer);row['offers']=[{k:item.get(k) for k in ['model','currentVersion','nxtMSVersion','checksum','has_download_url','download_host','download_path']} for item in summaries]
   for index,item in enumerate(offer.get('versions',[])):
    if not item.get('fileServerURL'):continue
    checksum=item.get('checksum')
    if checksum and checksum.lower() in known:row['download_disposition']='Already captured checksum; duplicate GET skipped';continue
    name=str(item.get('nxtMSVersion') or 'unnamed')
    if not all(c.isalnum() or c in '._-' for c in name):raise ValueError('Unexpected version filename')
    result=client.download(offer,G6/'config-private/downloaded-firmware'/(name+'-mixed-model.bin'),index);report['downloads'].append(result)
    if checksum:known.add(checksum.lower())
  except Exception as exc:row['error_type']=type(exc).__name__;report['stop_reason']='First error; no retry'
  client.private_write(out/'query-result.json',json.dumps(row,indent=2).encode())
  report['queries'].append(row)
  for f in sorted(out.glob('*')):
   data=f.read_bytes();report['private_artifacts'].append({'source':str(f),'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()})
  report['profiles_unchanged']=all(paths[k].read_bytes()==data for k,data in originals.items());assert report['profiles_unchanged']
  Path(__file__).with_name('mixed-model-followup-matrix.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8');print(json.dumps(row),flush=True)
  if report['stop_reason']:break
  time.sleep(2)
 print(json.dumps({'queries':len(report['queries']),'downloads':len(report['downloads']),'stop_reason':report['stop_reason']}),flush=True)
if __name__=='__main__':main()
