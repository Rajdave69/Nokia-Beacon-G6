#!/usr/bin/env python3
"""Offline UPnP source, native-code and captured-protocol verification; no router access."""
import hashlib,json,re,sys,xml.etree.ElementTree as ET
from pathlib import Path
from unittest.mock import patch
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[2]
sys.path.insert(0,str(ROOT/'writeups/security-keys/resources'))
import publication_aliases as aliases
from native_trace_network import ELF
import upnp_readonly as reader

def load(name):return json.loads((HERE/name).read_text(encoding='utf-8'))
def sha(data):return hashlib.sha256(data).hexdigest()
def original_digest(value):return aliases.private_value(value) if value.startswith('DIGEST-') else value

def fingerprint(row):return original_digest(row.get('sha256_alias',row.get('sha256')))
def leaf_fields(text):
 root=ET.fromstring(text);return {n.tag.split('}')[-1]:(n.text or '').strip() for n in root.iter() if not list(n)}
def main():
 counts={};manifest=load('profile-sources.json');assert len(manifest)==151
 for row in manifest:
  path=aliases.source_path(row['source'])/row['path'];data=path.read_bytes()
  assert len(data)==row['bytes'] and sha(data)==fingerprint(row),row['path']
  if 'text' in row:assert aliases.public_record(data.decode('utf-8',errors='surrogateescape'))==row['text']
 counts['source_records']=151
 for name in set(x['path'] for x in manifest if x['path'].endswith('.xml'))|{'etc/upnpd.conf'}:
  group=[x for x in manifest if x['path']==name];assert len(group)==3 and len({fingerprint(x) for x in group})==1,name
 counts['identical_XML_files_across_profiles']=19
 catalog=load('xml-catalog.json');assert len(catalog)==57;failures=0
 for row in catalog:
  data=(aliases.source_path(row['source'])/row['path']).read_bytes()
  try:tree=ET.fromstring(data)
  except ET.ParseError as err:
   assert row.get('parse_error')==str(err);failures+=1;continue
  assert 'parse_error' not in row
  ns={'s':'urn:schemas-upnp-org:service-1-0'}
  names=[x.text for x in tree.findall('s:actionList/s:action/s:name',ns)]
  assert names==[x['name'] for x in row['actions']]
 assert failures==6;counts['retained_XML_parse_errors']=6
 originals=load('private-artifact-index.json');assert len(originals)==60
 for row in originals:
  data=aliases.source_path(row['source']).read_bytes();assert len(data)==row['bytes'] and sha(data)==fingerprint(row)
 counts['private_originals']=len(originals)
 traces=load('native-trace-index.json');assert len(traces)==25
 for row in traces:
  path=aliases.source_path(row['source'])/row['path'];e=ELF(path);assert sha(e.data)==original_digest(row['source_sha256'])
  text,calls=e.trace(int(row['start'],16),int(row['end'],16))
  assert (HERE/row['file']).read_text(encoding='utf-8')==aliases.public_record(text)+'\n'
  assert aliases.public_record(calls)==row['calls']
  if row.get('label')=='authorization-stub':
   ins=e.instructions(int(row['start'],16),int(row['end'],16));ret=next(i for i,x in enumerate(ins) if x.mnemonic=='ret')
   assert ins[ret-2].mnemonic=='mov' and ins[ret-2].op_str=='w0, #0'
 counts['native_windows']=25
 selectors=load('action-dispatch.json');assert len(selectors)==126;byprofile={}
 for profile in ['G6-IJL','G6-HJL','B9-JJM']:
  e=ELF(aliases.source_path('private-source://PROFILE-'+profile)/'sbin/ndk_upnpd');_,calls=e.trace();callmap={x['va']:aliases.public_record(x) for x in calls}
  chosen=[x for x in selectors if x['profile']==profile];assert len(chosen)==42
  assert not any(x.get('unresolved_branch') for x in chosen)
  byprofile[profile]={x['action'] for x in chosen}
  for row in chosen:
   for ins in row['equal_path']:assert e.read(int(ins['va'],16),4).hex()==ins['bytes']
   assert row['first_call']==callmap[row['first_call']['va']]
 assert byprofile['G6-IJL']==byprofile['G6-HJL']==byprofile['B9-JJM'];counts['native_selector_paths']=126
 shell=load('shell-captures.json')
 for row in shell:
  data=aliases.source_path(row['original']).read_bytes();assert sha(data)==original_digest(row['original_sha256']);raw=json.loads(data)
  assert raw['exit_status']==row['exit_status']==0
  assert bytes.fromhex(raw['raw_stdout_hex']).decode(errors='backslashreplace')==raw['stdout']
  assert aliases.public_record(raw['stdout'])==row['stdout']
  parts=re.split(r'^=== (.+?) ===\n',raw['stdout'].replace('\r',''),flags=re.M);assert aliases.public_record(dict(zip(parts[1::2],parts[2::2])))==row['sections']
 counts['shell_receipts']=2
 baseline=json.loads(aliases.source_path(shell[0]['original']).read_bytes());parts=re.split(r'^=== (.+?) ===\n',baseline['stdout'].replace('\r',''),flags=re.M);sections=dict(zip(parts[1::2],parts[2::2]));matched=0
 for line in sections['code hashes'].splitlines():
  match=re.match(r'^([0-9a-f]{64})\s+/(.+)$',line)
  if not match:continue
  row=next(x for x in manifest if x['profile']=='G6-HJL' and x['path']==match[2]);assert match[1]==fingerprint(row);matched+=1
 assert matched==5;counts['matched_live_hashes']=5
 private_root=aliases.source_path('private-source://UPNP-ANALYSIS')
 originals_http=json.loads((private_root/'http-descriptions-result.json').read_bytes());originals_soap=json.loads((private_root/'soap-getters-result.json').read_bytes());public_http=load('http-descriptions.json');public_soap=load('soap-getters.json')
 for originals,public in [(originals_http,public_http),(originals_soap,public_soap)]:
  for raw,pub in zip(originals,public,strict=True):
   payload=bytes.fromhex(raw['body_hex']);assert sha(payload)==raw['body_sha256']
   assert payload.decode('utf-8')==raw['body_text'];expected=dict(raw);expected.pop('body_hex');expected.pop('request_body_hex',None)
   assert aliases.public_record(expected)==pub
   if 'request_body_hex' in raw:assert bytes.fromhex(raw['request_body_hex']).decode()==raw['request_body_text']
 assert [x['status'] for x in originals_http]==[200]*4
 assert [x['status'] for x in originals_soap]==[200]*5+[500]
 assert leaf_fields(originals_soap[-1]['body_text'])['errorCode']=='713'
 counts['HTTP_descriptions']=4;counts['SOAP_getters']=6
 summary=load('summary.json')
 for raw,row in zip(originals_soap,summary['live_soap'],strict=True):assert aliases.public_record(leaf_fields(raw['body_text']))==row['fields']
 # Exact writer bytes and actual captured responses, with HTTP transport replaced by an inert fixture.
 for raw in originals_soap:
  path,data,headers=reader.build_request(raw['action'],0)
  assert path==raw['path'] and data.decode()==raw['request_body_text'] and headers==raw['request_headers']
  expected=reader.parse_response(raw['action'],raw['status'],bytes.fromhex(raw['body_hex']))
  class Response:
   status=raw['status']
   def read(self,n):assert n==reader.MAX_RESPONSE+1;return bytes.fromhex(raw['body_hex'])
  class Connection:
   def __init__(self,host,port,timeout):assert host=='192.0.2.1' and port==49152 and timeout==5
   def request(self,method,request_path,body,request_headers):assert (method,request_path,body,request_headers)==('POST',path,data,headers)
   def getresponse(self):return Response()
   def close(self):pass
  with patch.object(reader.http.client,'HTTPConnection',Connection):assert reader.query('192.0.2.1',49152,raw['action'])==expected
 # Refuse dangerous action names before transport; preserve faults; bound malformed/oversized replies.
 for action in ['AddPortMapping','DeletePortMappingRange','AddPinhole','ForceTermination','SUBSCRIBE']:
  try:reader.build_request(action)
  except ValueError:pass
  else:raise AssertionError('Mutation accepted')
 assert reader.parse_response('GetGenericPortMappingEntry',500,bytes.fromhex(originals_soap[-1]['body_hex']))['fault']['errorCode']=='713'
 class Oversized(Connection):
  def getresponse(self):
   class Huge:
    status=200
    def read(self,n):return b'x'*n
   return Huge()
 # Override request matcher for size guard; never creates a real socket.
 Oversized.request=lambda *args:None
 with patch.object(reader.http.client,'HTTPConnection',Oversized):
  try:reader.query('192.0.2.1',49152,'GetStatusInfo')
  except ValueError as err:assert 'size limit' in str(err)
  else:raise AssertionError('Oversized response accepted')
 counts['offline_request_replays']=6;counts['mutator_rejections']=5;counts['response_size_guard']=1
 ssdp=json.loads((private_root/'ssdp-result.json').read_bytes());assert ssdp['request_text']==bytes.fromhex(ssdp['request_hex']).decode()
 for reply in ssdp['replies']:assert reply['text']==bytes.fromhex(reply['data_hex']).decode()
 ssdp.pop('request_hex')
 for reply in ssdp['replies']:reply.pop('data_hex')
 assert aliases.public_record(ssdp)==load('ssdp-discovery.json');counts['SSDP_exchanges']=1
 # Original official source files, pinned commit and authorization enum/helper are retained privately.
 upstream=load('upstream-source-index.json')
 for row in upstream['files']:
  data=(private_root/row['file']).read_bytes();assert len(data)==row['bytes'] and sha(data)==fingerprint(row)
 assert 'return CONTROL_POINT_AUTHORIZED;' in (private_root/'upstream-gatedevice.c').read_text()
 assert 'CONTROL_POINT_AUTHORIZED,' in (private_root/'upstream-gatedevice.h').read_text()
 counts['upstream_sources']=6
 # Check both mappings parse identically and published subject files contain no known real serials/new UDNs.
 other=ROOT.parent/('Nokia-Beacon-9' if ROOT.name.lower()=='nokia-beacon-g6' else 'Nokia-Beacon-G6');match=re.search(r'```json\s*\n(.*?)\n```',(other/'writeups/README.private.md').read_text(),re.S);assert json.loads(match[1])==aliases.registry()
 for file in list(HERE.glob('*'))+[HERE.parent/'README.md',ROOT/'knowledgebases/upnp-management.md']:
  if not file.is_file() or file.suffix not in ['.md','.json','.txt','.sh','.py']:continue
  text=file.read_text(encoding='utf-8')
  for device in aliases.registry()['devices'].values():assert device['serial'] not in text,file.name
  for label,value in aliases.registry()['private_values'].items():
   if label.startswith('UDN-UPNP-'):assert value not in text,file.name
 print(json.dumps({'result':'passed','scope':'offline only; no firmware execution or router connection','checks':counts},indent=2))
if __name__=='__main__':main()
