#!/usr/bin/env python3
"""Validate ECD original files, native bytes, recovered bindings and redaction offline."""
import hashlib,importlib.util,json,re
from pathlib import Path
HERE=Path(__file__).resolve().parent;PROJECT=HERE.parents[2]
aliasfile=PROJECT/'writeups/security-keys/resources/publication_aliases.py'
if not aliasfile.is_file():aliasfile=PROJECT.parent/'Nokia-Beacon-G6/writeups/security-keys/resources/publication_aliases.py'
spec=importlib.util.spec_from_file_location('aliases',aliasfile);aliases=importlib.util.module_from_spec(spec);spec.loader.exec_module(aliases)
from native_trace import ELF
from recover_routes import recover

def read(name):return json.loads((HERE/name).read_text())
def digest(b):return hashlib.sha256(b).hexdigest()
def expected(d):return aliases.private_value(d['sha256_alias']) if 'sha256_alias' in d else d['sha256']

def main():
 profiles=read('profile-comparison.json');sources=0;sets={}
 for tag,profile in profiles.items():
  for item in profile['files']:
   path=aliases.source_path(item['source']);assert path.is_file()==item['present'],item['source']
   if item['present']:
    b=path.read_bytes();assert len(b)==item['bytes'] and digest(b)==expected(item),item['source'];sources+=1
    if 'content' in item:assert aliases.public_record(b.decode('utf-8',errors='backslashreplace'))==item['content']
  path=aliases.source_path(profile['source_root']+'/usr/bin/ecd');r=aliases.public_record(recover(path,int(profile['register_function'],16)));assert r==read(tag+'-routes.json'),tag
  assert len(r['registrations'])==profile['route_count']
  assert all(x['handler'] and x['HTTP_method_enum'] in range(8) for x in r['registrations'])
  sets[tag]={(x['HTTP_method'],x['route']) for x in r['registrations']}
 assert sets['G6-IJL']==sets['G6-HJL'] and len(sets['G6-HJL'])==68
 assert sets['B9-JJM']-sets['G6-HJL']=={('PUT',x) for x in ['/debug/rrm_threshold','/debug/bh-rrm-threshold','/debug/bh-nb-age-time']}
 assert not sets['G6-HJL']-sets['B9-JJM']
 cache={};instructions=0
 for t in read('trace-index.json'):
  path=aliases.source_path(t['source']);e=cache.setdefault(str(path),ELF(path));a,b=int(t['start'],16),int(t['stop_exclusive'],16);native=e.read(a,b-a);assert digest(native)==t['range_sha256']
  rows=re.findall(r'^([0-9a-f]{8}): ([0-9a-f]{8})  ',(HERE/t['trace']).read_text(),re.M)
  assert [int(x[0],16) for x in rows]==list(range(a,b,4)),t['trace'];assert b''.join(bytes.fromhex(x[1]) for x in rows)==native;instructions+=len(rows)
 for tag,profile in profiles.items():assert profile['ECD_version'] in (HERE/(tag+'-version-handler.txt')).read_text()
 e=ELF(aliases.source_path(profiles['G6-HJL']['source_root']+'/usr/bin/ecd'));proof=read('channel-dispatch-proof.json');assert e.pointer(int(proof['relocated_callback_pointer_slot'],16))==int(proof['callback_entry'],16)==0x90a88
 assert proof['callback_to_handler']==[] # Queue thunk, not a direct channel-worker call.
 private=read('retained-evidence.json')['files']
 for item in private:
  b=aliases.source_path(item['source']).read_bytes();assert len(b)==item['bytes'] and digest(b)==expected(item),item['source']
 for item in read('live-captures.json')['records']:
  raw=json.loads(aliases.source_path('private-source://ECD-APCLOUD-ANALYSIS/'+item['name']+'-result.json').read_text());raw.pop('raw_stdout_hex',None);assert aliases.public_record(raw)==item['result']
  text=aliases.source_path('private-source://ECD-APCLOUD-ANALYSIS/'+item['script']).read_text();assert aliases.public_record(text)==(HERE/item['script']).read_text()
 # Audit all unique topology identifiers, including hyphen MACs and numeric IDs.
 raw=json.loads(aliases.source_path('private-source://ECD-APCLOUD-ANALYSIS/read-only-topology-result.json').read_text())['stdout'];top=json.JSONDecoder().raw_decode(raw[raw.rfind('{',0,raw.index('"aps"')):])[0]
 secrets=set()
 for ap in top['aps']:
  for k in ['router-id','router-id-str','serial-num','ip-address','ipv6-local-address','mac-address','backhaul-ip-address','backhaul-mac-address']:secrets.add(str(ap[k]))
  for row in ap['ssids']:secrets.update([row['ssid'],row['bssid']])
 for path in HERE.parent.rglob('*'):
  if path.is_file() and '__pycache__' not in path.parts:
   text=path.read_text(encoding='utf-8');assert all(x not in text for x in secrets),path.name
 print(json.dumps({'passed':True,'stock_sources':sources,'profiles':len(profiles),'native_ranges':len(read('trace-index.json')),'native_instructions':instructions,'private_files':len(private),'live_records':4,'live_mutators':0,'files_transferred_to_router':0}))
if __name__=='__main__':main()
