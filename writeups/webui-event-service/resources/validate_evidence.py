#!/usr/bin/env python3
"""Verify exact frontend sources and replay isolated methods; no router access or native firmware execution."""
import argparse,functools,hashlib,json,re,shutil,subprocess,sys,tempfile
from pathlib import Path
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[2]
sys.path.insert(0,str(ROOT/'writeups/security-keys/resources'))
import publication_aliases as aliases

def load(name):return json.loads((HERE/name).read_text(encoding='utf-8'))
def sha(data):return hashlib.sha256(data).hexdigest()
def original_hash(value):return aliases.private_value(value) if value.startswith('DIGEST-') else value

def fingerprint(row):return original_hash(row.get('sha256_alias',row.get('sha256')))
@functools.lru_cache(maxsize=None)
def resolve(uri):
 path=aliases.source_path(uri)
 # Windows validation can read the existing local WSL image roots through their local distro share.
 if sys.platform=='win32' and path.as_posix().startswith('/tmp/'):
  result=subprocess.run(['wsl.exe','--exec','wslpath','-w',path.as_posix()],capture_output=True,text=True,timeout=10,check=True)
  return Path(result.stdout.strip())
 return path

def main():
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--node',default=shutil.which('node'));args=ap.parse_args()
 if not args.node:ap.error('Provide an existing Node executable with --node; no package download is performed')
 counts={};manifest=load('profile-sources.json');assert len(manifest)==42
 for row in manifest:
  path=resolve(row['source'])/row['path'];present=row.get('exists',True);assert path.is_file()==present,row['path']
  if not present:continue
  data=path.read_bytes();assert len(data)==row['bytes'] and sha(data)==fingerprint(row),row['path']
  if 'text' in row:assert aliases.public_record(data.decode('utf-8',errors='surrogateescape'))==row['text']
 counts['source_records']=42
 private=resolve('private-source://WEBUI-60980-ANALYSIS');originals=load('private-artifact-index.json');assert len(originals)==130
 for row in originals:
  data=resolve(row['source']).read_bytes();assert len(data)==row['bytes'] and sha(data)==fingerprint(row)
 counts['protected_originals']=130
 frames=load('fragment-index.json');assert len(frames)==84;raw_frames={}
 for row in frames:
  data=(resolve(row['source'])/row['path']).read_bytes();assert sha(data)==original_hash(row['source_sha256'])
  raw=data[row['start_byte']:row['end_byte']];assert len(raw)==row['bytes'] and sha(raw)==fingerprint(row)
  assert (HERE/'fragments'/row['file']).read_text(encoding='utf-8')==aliases.public_record(raw.decode())
  raw_frames[(row['profile'],row['label'])]=raw
 counts['exact_fragments']=84
 old=load('previous-8099-frontend-reference.json');assert sha(raw_frames[('G6-HJL','websocket-service')])==fingerprint(old)
 counts['earlier_frontend_slice_matches']=1
 for row in load('string-search.json'):
  data=(resolve(row['source'])/row['path']).read_bytes();assert sha(data)==fingerprint(row)
  for term,positions in row['matches'].items():assert [m.start() for m in re.finditer(re.escape(term.encode()),data)]==positions
 counts['positive_string_sources']=11
 literals=load('generic-function-literals.json');assert len(literals)==115
 for row in literals:
  data=(resolve(row['source'])/row['path']).read_bytes();prefix=row['exact_call_prefix'].encode();offset=row['byte_offset_utf8'];assert data[offset:offset+len(prefix)]==prefix
  assert row['function_literal'] in row['exact_call_prefix']
 counts['generic_literal_sites']=115
 for row in load('serialization-defaults.json'):
  data=(resolve(row['source'])/row['path']).read_bytes();assert aliases.public_record(data[row['start_byte']:row['end_byte']].decode())==row['text']
 counts['serialization_windows']=9
 shell=load('shell-captures.json');assert len(shell)==2;raw_shell=[]
 for row in shell:
  data=resolve(row['original']).read_bytes();assert sha(data)==original_hash(row['original_sha256']);raw=json.loads(data);assert raw['exit_status']==row['exit_status']==0
  assert bytes.fromhex(raw['raw_stdout_hex']).decode(errors='backslashreplace')==raw['stdout']
  assert row['stdout']==aliases.public_record(raw['stdout']);parts=re.split(r'^=== (.+?) ===\n',raw['stdout'].replace('\r',''),flags=re.M);sections=dict(zip(parts[1::2],parts[2::2]));assert row['sections']==aliases.public_record(sections);raw_shell.append(sections)
 assert '60980' not in raw_shell[0]['frontend service listeners'] and '60980' not in raw_shell[1]['final listeners']
 assert 'default_bus_exit=4' in raw_shell[0]['default event objects'] and 'session_bus_exit=4' in raw_shell[0]['session event objects']
 assert raw_shell[0]['backend path metadata'].count('not_present=')==2
 matched=0
 for line in raw_shell[1]['live source hashes'].splitlines():
  m=re.match(r'^([0-9a-f]{64})\s+/(.+)$',line)
  if not m:continue
  expected=next(x for x in manifest if x['profile']=='G6-HJL' and x['path']==m[2]);assert m[1]==fingerprint(expected);matched+=1
 assert matched==5;counts['live_hash_matches']=5;counts['complete_shell_receipts']=2
 http=load('http-static-captures.json');assert len(http)==3
 for row in http:
  data=resolve(row['body_original']).read_bytes();assert len(data)==row['bytes'] and sha(data)==original_hash(row['body_sha256']) and row['status']==200
  relative='webs/web_whw/index.html' if row['path']=='/web_whw/' else 'webs'+row['path'];source=next(x for x in manifest if x['profile']=='G6-HJL' and x['path']==relative);assert sha(data)==fingerprint(source)
  assert row['sent_authentication'] is False and row['redirects_followed'] is False
  assert all(k.lower()!='set-cookie' for k,v in row['response_headers'])
 counts['served_static_assets_match']=3
 # Stage full original input metadata and exact extracted fragments. All tool output stays in the fresh directory.
 with tempfile.TemporaryDirectory(prefix='validate-',dir=private) as tmp:
  stage=Path(tmp);assert stage.resolve().is_relative_to(private.resolve());(stage/'fragments').mkdir()
  (stage/'copied-bundles.json').write_bytes((private/'copied-bundles.json').read_bytes())
  def nodearg(path):
   value=str(path)
   if args.node.lower().endswith('.exe') and value.startswith('/mnt/'):
    m=re.match(r'^/mnt/([a-z])/(.*)',value);return m[1].upper()+':/'+m[2] if m else value
   return value
  for tool,flags in [('extract_frontend.cjs',['--experimental-vm-modules']),('replay_frontend.cjs',[]),('check_model_gates.cjs',[])]:
   result=subprocess.run([args.node]+flags+[nodearg(HERE/tool),nodearg(stage)],capture_output=True,text=True,encoding='utf-8',timeout=30)
   assert result.returncode==0,(tool,result.stderr[-800:])
  extracted=json.loads((stage/'fragment-index.json').read_text(encoding='utf-8'));assert aliases.public_record(extracted)==frames
  for row in extracted:assert (stage/'fragments'/row['file']).read_bytes()==raw_frames[(row['profile'],row['label'])]
  replay=json.loads((stage/'offline-frontend-results.json').read_text(encoding='utf-8'));assert aliases.public_record(replay)==load('offline-frontend-results.json');assert replay['result']=='passed' and replay['router_requests']==0 and replay['cases']==36
  gates=json.loads((stage/'model-gates.json').read_text(encoding='utf-8'));assert aliases.public_record(gates)==load('model-gates.json')
 counts['compile_checked_fragments']=84;counts['offline_profile_replays']=3;counts['grouped_mock_cases']=36;counts['model_gate_profiles']=3
 # Identify published files without exposing any known real serial or the router's private address literals.
 for file in list(HERE.rglob('*'))+[HERE.parent/'README.md',ROOT/'knowledgebases/webui-event-service.md']:
  if not file.is_file() or '__pycache__' in file.parts or file.suffix not in ['.md','.json','.txt','.cjs','.sh','.py']:continue
  text=file.read_text(encoding='utf-8')
  for device in aliases.registry()['devices'].values():assert device['serial'] not in text,file.name
 other=ROOT.parent/('Nokia-Beacon-9' if ROOT.name.lower()=='nokia-beacon-g6' else 'Nokia-Beacon-G6');m=re.search(r'```json\s*\n(.*?)\n```',(other/'writeups/README.private.md').read_text(encoding='utf-8'),re.S);assert json.loads(m[1])==aliases.registry()
 print(json.dumps({'result':'passed','scope':'Original source/capture checks plus isolated frontend-method/declarative-model replays; no router access, server/native firmware execution or whole frontend-module evaluation','checks':counts},indent=2))
if __name__=='__main__':main()
