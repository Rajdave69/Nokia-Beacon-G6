#!/usr/bin/env python3
"""Validate wireless/tool/XML and ubus-handoff evidence offline, without radio access."""
from pathlib import Path
import hashlib,importlib.util,json,re,struct,sys,xml.etree.ElementTree as ET
R=Path(__file__).resolve().parent;ROOT=R.parents[2];F=ROOT/'writeups/internal-ubus-management/resources/wireless-followup'
p=ROOT/'writeups/security-keys/resources/publication_aliases.py'
if not p.is_file():p=ROOT.parent/'Nokia-Beacon-G6/writeups/security-keys/resources/publication_aliases.py'
s=importlib.util.spec_from_file_location('aliases',p);A=importlib.util.module_from_spec(s);s.loader.exec_module(A)
sys.path.insert(0,str(ROOT/'writeups/internal-ubus-management/resources'));from native_trace import ELF
sha=lambda b:hashlib.sha256(b).hexdigest();read=lambda p:json.loads(p.read_text())
def expected(d):return A.private_value(d['sha256_alias']) if 'sha256_alias' in d else d['sha256']
def main():
 tools=0;xmls=0;profiles=read(R/'profile-comparison.json');hjl={}
 for tag,data in profiles.items():
  for d in data['tools']:
   f=A.source_path(d['source']);assert f.is_file()==d['present']
   if not d['present']:continue
   b=f.read_bytes();assert len(b)==d['bytes'] and sha(b)==expected(d);tools+=1
   if 'content' in d:assert A.public_record(b.decode())==d['content']
   if tag=='G6-HJL':hjl['/'+d['path']]=d
  for d in data['XML']:
   b=A.source_path(d['source']).read_bytes();assert len(b)==d['bytes'] and sha(b)==expected(d);assert A.public_record(b.decode())==d['content'];tree=ET.fromstring(b);cmds=[]
   for elem in tree.findall('VendorCmd'):cmds.append({'attributes':elem.attrib,'request_attributes':[a.attrib for a in elem.findall('Attribute')],'responses':[{'attributes':x.attrib,'fields':[a.attrib for a in x.findall('Attribute')]} for x in elem.findall('VendorRsp')]})
   assert cmds==d['commands'];xmls+=1
 assert [sum(len(x['commands']) for x in profiles[t]['XML']) for t in ['G6-IJL','G6-HJL','B9-JJM']]==[233,233,276]
 rawtexts=[];matches=0
 for rec in read(R/'live-captures.json')['records']:
  d=read(A.source_path('private-source://WIRELESS-TOOLS/'+rec['name']+'-result.json'));rawtexts.append(d['stdout'].replace('\r',''));d.pop('raw_stdout_hex',None);assert A.public_record(d)==rec['result'];script=A.source_path('private-source://WIRELESS-TOOLS/'+rec['name']+'.sh').read_text();assert A.public_record(script)==(R/(rec['name']+'.sh')).read_text()
  for h,path in re.findall(r'^([0-9a-f]{64})  (/[^\n]+)$',rawtexts[-1],re.M):assert h==expected(hjl[path]);matches+=1
 assert matches==8
 assert 'timeout unavailable; USSA getters skipped' in rawtexts[1] and 'hostapd_5_status=0' in rawtexts[1] and 'hostapd_2_status=0' in rawtexts[1]
 assert 'channel 108 (5540 MHz), width: 160 MHz' in rawtexts[0] and 'channel 11 (2462 MHz), width: 20 MHz' in rawtexts[0]
 native=0;elfs={}
 for d in read(F/'sources.json'):
  b=A.source_path(d['source']).read_bytes();assert len(b)==d['bytes'] and sha(b)==expected(d);elfs[d['source']]=ELF(A.source_path(d['source']))
 for d in read(F/'trace-index.json'):
  a,b=int(d['start'],16),int(d['stop_exclusive'],16);e=elfs[d['source']];blob=e.read(a,b-a);assert sha(blob)==d['range_sha256'];rows=re.findall(r'^([0-9a-f]{8}): ([0-9a-f]{8})  ',(F/d['trace']).read_text(),re.M);assert [int(x[0],16) for x in rows]==list(range(a,b,4));assert b''.join(bytes.fromhex(x[1]) for x in rows)==blob;native+=len(rows)
 e=elfs['private-source://PROFILE-G6-HJL/usr/bin/ussa_cli'];layout=read(F/'channel-layout.json');assert list(struct.unpack('<7h',e.read(0xd3b8,14)))==layout['width_enum_table']==[20,40,80,160,-1,320,320]
 for row in layout['bands']:assert 0x7644+struct.unpack('<b',e.read(0xd3a0+row['index'],1))[0]*4==int(row['branch_target'],16)
 assert (F/'cli-channel-constructor.txt').read_text().count('strb w1, [x29, #0x20]')==1
 # The vendor wrapper bug is preserved as shipped, rather than silently repaired.
 wrapper=next(x for x in profiles['G6-HJL']['tools'] if x['path']=='usr/sbin/cfg80211tool')['content'];assert '--value7 $10' in wrapper and '${10}' not in wrapper
 for directory in [R,F]:
  for d in read(directory/'retained-evidence.json')['files']:
   b=A.source_path(d['source']).read_bytes();assert len(b)==d['bytes'] and sha(b)==expected(d)
 # Audit serials and new MAC/SSID values over both publication trees.
 secrets=set(re.findall(r'\b[0-9a-fA-F]{2}(?::[0-9a-fA-F]{2}){5}\b','\n'.join(rawtexts)))
 for s in rawtexts:secrets.update(re.findall(r'^\s*ssid (.+)$',s,re.M));secrets.update(re.findall(r'^ssid\[\d+\]=(.*)$',s,re.M))
 secrets.update(v['serial'] for v in A.registry()['devices'].values())
 for directory in [R.parent,F]:
  for f in directory.rglob('*'):
   if f.is_file() and '__pycache__' not in f.parts:
    s=f.read_text();assert all(x not in s for x in secrets if x),f.name
 print(json.dumps({'passed':True,'profiles':3,'tool_files':tools,'XML_files':xmls,'XML_entries':[233,233,276],'live_code_hash_matches':matches,'native_windows':len(read(F/'trace-index.json')),'native_instructions':native,'private_wireless_files':len(read(R/'retained-evidence.json')['files']),'private_followup_files':len(read(F/'retained-evidence.json')['files']),'live_captures':2,'USSA_getters_skipped':True,'setters':0,'scans':0,'router_file_transfers':0}))
if __name__=='__main__':main()
