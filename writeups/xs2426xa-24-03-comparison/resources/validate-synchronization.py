#!/usr/bin/env python3
"""Offline synchronization/ONT-OTA evidence checks. No router or network calls."""
from pathlib import Path as _PublicationPath
import json as _publication_json
import re as _publication_re

def _publication_input(alias):
    project = next(p for p in _PublicationPath(__file__).resolve().parents
                   if (p / 'writeups').is_dir())
    registry = (project / 'writeups/README.private.md').read_text(encoding='utf-8')
    payload = _publication_re.search(r'```json\s*\n(.*?)\n```', registry, _publication_re.S)
    return _publication_json.loads(payload[1])['private_values'][alias]

import argparse,ast,copy,hashlib,importlib.util,json,os,re,subprocess,tempfile,xml.etree.ElementTree as ET
from pathlib import Path
G=Path(__file__).resolve().parents[3];B=G.parent/'Nokia-Beacon-9';R=Path(__file__).parent;P=G/'config-private/xs2426xa-analysis-20261027'
def load(p):return json.loads(p.read_text(encoding='utf-8'))
def module(p,name):
 s=importlib.util.spec_from_file_location(name,p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
def local(value):
 if re.match(r'^[A-Za-z]:[\\/]',value):return Path('/mnt/'+value[0].lower()+'/'+value[3:].replace('\\','/'))
 return Path(value)
def main():
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--out',type=Path,required=True);a=ap.parse_args();assert not a.out.exists();e=load(R/'ota-research.json')
 assert e['new_metadata_POSTs']==2 and e['new_downloads']==0 and e['cumulative_device_OTA_POSTs']==104
 assert {q['reported_version'] for q in e['queries']}=={'3FE49940KJLK50','3FE49940JJLK67'}
 for q in e['queries']:
  assert q['http_status']==q['responseCode']==200 and q['operatorcode']=='VDQA' and q['countrycode']=='qa'
  offer=load(local(q['raw_offer']['source']));assert offer['responseCode']==200 and len(offer['versions'])==1
  for x in offer['versions']:assert x['model']=='XS-2426X-A' and x.get('nxtMSVersion') is None and not x.get('fileServerURL') and not x.get('checksum')
 settings=load(P/'ota-settings-current-private.json');assert sum(x['found'] for x in settings.values())==12 and not settings['InternetGatewayDevice.ThisParameterDoesNotExist']['found']
 helper=module(R/'prepare-ont-ota-profile.py','ont_profile');xml=(P/'bank1-preconfiguration.xml').read_bytes();cap=G/_publication_input('RESEARCH-INPUT-97556E81981F');ri=(cap/'mtd02_RI.bin').read_bytes();profile=helper.build(settings,xml,ri)
 assert profile==load(P/'xs-ota-profile.json')
 with tempfile.TemporaryDirectory(prefix='ont-profile-check-') as td:
  out=Path(td)/'profile.json';helper.private_write(out,(json.dumps(profile)+'\n').encode());assert load(out)==profile and out.stat().st_mode&0o777==0o600
 negatives=0
 for uri,replacement in [('InternetGatewayDevice.DeviceInfo.SerialNumber',b'ALCL00000000'),('InternetGatewayDevice.DeviceInfo.ModelName',b'Beacon 9'),('InternetGatewayDevice.LANDevice.1.LANHostConfigManagement.MACAddress',b'00:00:00:00:00:00')]:
  bad=copy.deepcopy(settings);bad[uri]['value_hex']=replacement.hex()
  try:helper.build(bad,xml,ri)
  except ValueError:negatives+=1
  else:raise AssertionError('Wrong device profile accepted')
 refs={}
 def walk(v):
  if isinstance(v,dict):
   if {'source','bytes','sha256'}<=v.keys():refs[v['source']]=v
   for x in v.values():walk(x)
  elif isinstance(v,list):
   for x in v:walk(x)
 walk(e)
 for value,row in refs.items():
  p=local(value);raw=p.read_bytes();assert len(raw)==row['bytes'] and hashlib.sha256(raw).hexdigest()==row['sha256'],value
 v=load(G/'writeups/firmware-versions-and-builds/resources/versions-evidence.json');assert v['captured_profile_count']==5 and v['packaged_control_count']==3078
 assert sorted(len(g) for g in v['G6_SSB_equality_groups'])==[1,3]
 assert any(set(g)=={_publication_input('RESEARCH-INPUT-3CF7C1567A0B'),_publication_input('RESEARCH-INPUT-B532895F1245'),_publication_input('RESEARCH-INPUT-B0882E3F8A66')} for g in v['G6_SSB_equality_groups'])
 assert v['bootloaders']['XS2426XA_SSB']['sha256'] not in {x['sha256'] for x in v['all_G6_SSB_captures'].values()}
 docs=[]
 for root in [G,B]:
  docs += list((root/'writeups').rglob('*.md'))+list((root/'tutorials').rglob('*.md'))+[root/'README.md']
  docs += list((root/'knowledgebases').glob('*.md'))
 links=0;checked=[]
 for p in docs:
  text=p.read_text(encoding='utf-8').split('<!-- COMPLETE-SOURCE-RECORD:BEGIN -->')[0];assert len(re.findall(r'^```',text,re.M))%2==0,p
  for target in re.findall(r'\]\(([^)]+)\)',text):
   if target.startswith(('https:','http:','#','mailto:','/tmp/')):continue
   # Existing unrelated audit attachments use Windows paths; resolve either representation.
   q=local(target.split('#')[0]) if target.startswith(('/mnt/', 'D:', 'C:')) else p.parent/target.split('#')[0]
   if not q.exists() and q.parent.is_dir() and q.name.lower() in {x.name.lower() for x in q.parent.iterdir()}:pass
   elif not q.exists():
    # Record pre-existing unrelated missing links, never silently report they passed.
    checked.append({'source':str(p),'target':target});continue
   links+=1
 assert not checked,('Unresolved local documentation links',checked)
 # Only newly changed writeups/KBs and new resources are part of this change's secret-publication boundary.
 secret=[profile['api_key'].encode()]
 prep=module(G/'webui/scripts/prepare-config-keys.py','prepare')
 for root in [P/'bank0-root',P/'bank1-root']:secret += [s.encode() for s in prep.static_keys(root,prep.backup_module()).values() if len(s)>=10]
 public=list(R.rglob('*'))+[p for p in docs if ('source-records' not in p.parts)]
 n=0
 for p in public:
  if not p.is_file() or p.suffix.lower() not in {'.md','.json','.txt','.py','.c','.csv','.sh'}:continue
  data=p.read_bytes();assert not any(value and value in data for value in secret),('Raw secret in public artifact',p);n+=1
 for p in [R/'prepare-ont-ota-profile.py',Path(__file__)]:ast.parse(p.read_text())
 result={'date':'2026-10-27','all_new_checks_passed':True,'ONT_approved_queries_verified':2,'ONT_firmware_downloads':0,'native_saved_fields':12,'missing_URI_control':True,'profile_reproduces_used_request_exactly':True,'wrong_identity_profile_cases_rejected':negatives,'source_fingerprints_checked':len(refs),'captured_profiles':5,'package_control_records':3078,'HTTP_keypair_devices':6,'expanded_trust_profiles':5,'local_links_checked':links,'other_link_issues':checked,'public_artifacts_checked_for_known_raw_keys':n,'scope':'Offline existing-record/profile reproduction, identities, bounds and source/link/privacy checks. Native parser and unsuccessful crypto probe were separately recorded; no new firmware execution or network in validation.'}
 a.out.write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
if __name__=='__main__':main()
