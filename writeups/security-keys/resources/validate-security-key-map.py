#!/usr/bin/env python3
"""Offline key-inventory/provenance/link/privacy validation; no router calls."""
import argparse,ast,hashlib,importlib.util,json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3];B9=ROOT.parent/'Nokia-Beacon-9'
from publication_aliases import private_record,public_record,source_path

def load(p):return private_record(json.loads(p.read_text(encoding='utf-8')))
def main():
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--out',type=Path,required=True);args=ap.parse_args();res=Path(__file__).resolve().parent
 inv=load(res/'static-key-inventory.json');rep=load(res/'static-key-inventory-reproduction.json');e=load(ROOT/'knowledgebases/security-keys-evidence.json')
 expected={'key0':191,'key1':191,'key2':191,'key3':64,'key4':64,'key7':64,'key7_2':64,'key12':10,'key13':32,'key14':384,'key17':64};original={x['name']:x for x in inv['entries']};reproduced={x['name']:x for x in rep['entries']}
 assert set(original)==set(reproduced)==set(expected);assert inv['all_static_container_integrity_checks_passed'] and rep['all_integrity_checks_passed']
 for name,size in expected.items():
  assert original[name]['profiles']==reproduced[name]['profiles']
  for row in original[name]['profiles'].values():assert row['present'] and row['stored_string_bytes']==size
  assert original[name]['G6_old_equals_current']==(name not in ('key3','key4'))
  assert original[name]['G6_current_equals_Beacon9']==(name not in ('key3','key4','key7_2'))
 assert inv['no_key18_in_any_static_store'] and inv['no_key15_key16_key18_in_any_static_store']
 assert len(inv['sources'])==5 and set(inv['sources'])==set(rep['sources'])
 for name in expected:
  assert original[name]['equality_groups']==reproduced[name]['equality_groups']
  assert original[name]['all_equal']==(name not in ('key3','key4','key7_2'))
  if name in ('key3','key4'):assert all(len(group)==1 for group in original[name]['equality_groups'])
 assert len(original['key7_2']['equality_groups'])==3
 assert 'key15' in e['named_key_roles'] and 'key16' in e['named_key_roles']
 assert e['schema_version']==2 and len(e['static_inventory']['sources'])==5
 files=[];hashes=0
 for profile,rows in inv['sources'].items():
  for row in rows.values():
   p=source_path(row['source']);assert p.stat().st_size==row['bytes'] and hashlib.sha256(p.read_bytes()).hexdigest()==row['sha256'];hashes+=1
 trust=load(res/'trust-key-inventory.json');hosts=load(res/'persistent-host-key-inventory.json');selector=load(res/'stored-key-selector-evidence.json')
 for rel,size in [('usr/etc/ecc_pub.pem',134),('root/rootca.pem',1192)]:
  rows=[x for x in trust['sources'] if x['relative_source']==rel];assert len(rows)==5 and len({x['sha256'] for x in rows})==1;assert all(x['bytes']==size and x['openssl_exit']==0 for x in rows)
 assert hosts['HTTP_public_key_checks']['each_saved_private_key_matches_its_saved_public_key'] and hosts['HTTP_public_key_checks']['all_three_canonical_public_keys_pairwise_distinct']
 assert all(x['all_three_pairwise_distinct'] for x in hosts['comparison'])
 assert hosts['current_device_count']==6 and hosts['HTTP_public_key_checks']['all_six_canonical_public_keys_pairwise_distinct']
 assert all(x['present_count']==6 and x['pairwise_byte_distinct_among_present'] for x in hosts['current_comparison']);assert selector['selection']=={'0x124125':'key9','0x124126':'key10'}
 for row in trust['sources']+hosts['sources']+selector['sources']+e['evidence_sources']:
  if not row.get('present',True):continue
  p=source_path(row['source']);assert p.stat().st_size==row['bytes'] and hashlib.sha256(p.read_bytes()).hexdigest()==row['sha256'];hashes+=1
 for root in (ROOT,B9):files += [root/'writeups/security-keys/README.md',root/'knowledgebases/security-keys.md',root/'README.md']
 links=0
 for p in files:
  text=p.read_text(encoding='utf-8');assert len(re.findall(r'^```',text,re.M))%2==0
  for target in re.findall(r'\]\(([^)]+)\)',text):
   if target.startswith(('http:','https:','#','mailto:')):continue
   if target.startswith('/tmp/'):continue
   q=p.parent/target.split('#')[0]
   if q.exists():links+=1;continue
   # Existing project README links sometimes use uppercase .MD spelling on NTFS.
   parent=q.parent;assert parent.is_dir() and q.name.lower() in {x.name.lower() for x in parent.iterdir()},(p,target);links+=1
 spec=importlib.util.spec_from_file_location('prepare',ROOT/'webui/scripts/prepare-config-keys.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);secrets=[]
 for root in (Path('/tmp/g6-old-slot-review-20261025-by5iaikl/old'),Path('/tmp/g6-old-slot-review-20261025-by5iaikl/new'),Path('/tmp/beacon9-stock-root'),ROOT/'config-private/xs2426xa-analysis-20261027/bank0-root',ROOT/'config-private/xs2426xa-analysis-20261027/bank1-root'):secrets += [x.encode() for x in m.static_keys(root,m.backup_module()).values() if len(x)>=10]
 for root in (ROOT,B9):
  for filename in ('keys.json','live-config-keys-20261019.json'):
   p=root/'config-private'/filename
   if p.is_file():
    for name,value in load(p).items():
     if name in ('key7_2_hex','key18_hex') and value:secrets.append(bytes.fromhex(value))
  label='g6' if root==ROOT else 'b9';p=root/f'config-private/ota-cloud-analysis/{label}-ota-profile.json'
  if p.is_file():secrets.append(load(p)['api_key'].encode())
 public=[ROOT/'knowledgebases/security-keys-evidence.json']+[p for p in res.iterdir() if p.is_file()]+[p for p in files if p.name!='README.md' or p.parent.name=='security-keys']
 for p in public:
  data=p.read_bytes();assert not any(s and s in data for s in secrets),p
 for p in (res/'collect-static-key-inventory.py',Path(__file__)):ast.parse(p.read_text(encoding='utf-8'))
 output={'date':'2026-10-28','all_passed':True,'scope':'Offline static inventory reproduction, exact source fingerprints, public/service-key metadata, reader-selector record, links/fences and known-secret exclusion. No new router/firmware execution, encryption/import acceptance or network test.','static_profiles':5,'static_named_entries':11,'source_fingerprints_checked':hashes,'local_links_checked':links,'new_public_artifacts_privacy_checked':len(public),'unknown_consumer_roles_preserved':True,'source_evidence':{'source':str(ROOT/'knowledgebases/security-keys-evidence.json'),'sha256':hashlib.sha256((ROOT/'knowledgebases/security-keys-evidence.json').read_bytes()).hexdigest()},'validator_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest()}
 output=public_record(output)
 with args.out.open('x',encoding='utf-8') as f:f.write(json.dumps(output,indent=2)+'\n')
 print(json.dumps(output,indent=2))
if __name__=='__main__':main()
