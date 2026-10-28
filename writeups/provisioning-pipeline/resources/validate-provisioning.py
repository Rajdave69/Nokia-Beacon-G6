#!/usr/bin/env python3
"""Offline validation of real provisioning decode, differences and source bindings."""
import argparse,ast,hashlib,importlib.util,json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3];B9=ROOT.parent/'Nokia-Beacon-9'
import sys
sys.path.insert(0,str(ROOT/'writeups/security-keys/resources'))
from publication_aliases import original_source_path
def local(s):
 if re.match(r'^[A-Za-z]:[\\/]',s):return Path('/mnt/'+s[0].lower()+'/'+s[3:].replace('\\','/'))
 return Path(s)
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--out',required=True,type=Path);a=ap.parse_args()
 if a.out.exists():raise FileExistsError('Use new report')
 res=Path(__file__).resolve().parent;e=json.loads((ROOT/'knowledgebases/provisioning-pipeline-evidence.json').read_text());spec=importlib.util.spec_from_file_location('decoder',res/'decode-provisioning.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
 rows=e['decoded_Zeroman']['files'];assert len(rows)==7 and len({x['output']['sha256'] for x in rows})==2
 negatives=[];secrets=[]
 for row in rows:
  key=m.derive(row['serial_source'].encode(),row['ProgDate_source'].encode());secrets.append(key);raw=local(row['input']['source']).read_bytes();plain=m.decrypt_zeroman(raw,key);assert plain==local(row['output']['source']).read_bytes()
  for case,blob,k in [('wrong_key',raw,b'X'*64),('altered_tag',raw[:4]+bytes([raw[4]^1])+raw[5:],key)]:
   try:m.decrypt_zeroman(blob,k)
   except ValueError:negatives.append(case)
   else:raise AssertionError('Negative case authenticated')
 assert e['original_crypto_validation']['native_matches_python'] and e['original_crypto_validation']['exit']==0
 d=e['112_vs_114'];assert d['assignment_counts']=={'112':97,'114':99} and len(d['added'])==8 and len(d['removed'])==6 and len(d['changed'])==10
 assert len(e['saved_remote_KV_relationship'])==6 and all(x['all_99_original_assignments_match_114_exactly'] for x in e['saved_remote_KV_relationship'])
 assert e['Beacon9']['selected_zeroman_content_file_count']==0 and e['Beacon9']['G6_key10_profile_test']['result']=='failed'
 assert [x['contains_operator_broker'] for x in e['USP_SQLite_witnesses']]==[False,True,True,True,True]
 refs={}
 def walk(v):
  if isinstance(v,dict):
   if {'source','bytes','sha256'}<=v.keys():refs[v['source']]=v
   for x in v.values():walk(x)
  elif isinstance(v,list):
   for x in v:walk(x)
 walk(e)
 pre_publication_sources=0
 for name,item in refs.items():
  path=original_source_path(name,item['sha256']);pre_publication_sources+=path!=local(name)
  raw=path.read_bytes();assert len(raw)==item['bytes'] and hashlib.sha256(raw).hexdigest()==item['sha256'],name
 for profile in e['operator_profiles'].values():
  for key,value in profile['fields'].items():
   if re.search(r'password|username|secret|auth.?key',key,re.I):assert value['semantic'] in ('','%U','%P')
 docs=[]
 for root in (ROOT,B9):docs += [root/'writeups/provisioning-pipeline/README.md',root/'knowledgebases/provisioning-pipeline.md',root/'README.md',root/'writeups/security-keys/README.md']
 links=0
 for p in docs:
  text=p.read_text(encoding='utf-8');assert '\ufffd' not in text and len(re.findall(r'^```',text,re.M))%2==0
  for target in re.findall(r'\]\(([^)]+)\)',text):
   if target.startswith(('http:','https:','#','mailto:','/tmp/')):continue
   q=p.parent/target.split('#')[0];assert q.exists() or q.parent.is_dir() and q.name.lower() in {x.name.lower() for x in q.parent.iterdir()},(p,target);links+=1
 public=list(res.rglob('*.py'))+list(res.rglob('*.json'))+list(res.rglob('*.txt'))+[ROOT/'knowledgebases/provisioning-pipeline-evidence.json']+[p for p in docs if p.name!='README.md' or p.parent.name=='provisioning-pipeline']
 for p in public:assert not any(v and v in p.read_bytes() for v in secrets),('Raw key10 in public output',p)
 for p in res.glob('*.py'):ast.parse(p.read_text(encoding='utf-8'))
 out={'date':'2026-10-28','all_passed':True,'real_GCM_files_rechecked':len(rows),'negative_tag_key_cases':len(negatives),'source_fingerprints_checked':len(refs),'pre_publication_source_snapshots_checked':pre_publication_sources,'profile_diff':{'added':8,'removed':6,'changed':10},'saved_remote_KV_assignment_matches':6,'local_links_checked':links,'public_artifacts_checked_for_raw_key10':len(public),'native_original_G6_crypto_agrees':True,'scope':'Offline file/source checks and original cryptographic API only under QEMU. No provisioning callback, router/server contact, import, activation, daemon start, reset, firmware boot or flash write. No live MQTT authentication. B9source5 reconstruction is later independently evidenced, not performed by this validator.','validator_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest()}
 a.out.write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2))
if __name__=='__main__':main()
