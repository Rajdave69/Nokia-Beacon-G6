#!/usr/bin/env python3
"""Offline verification of exact channel queue, request ABI and RAM-store evidence."""
import importlib.util,json,hashlib,re,struct,sys
from pathlib import Path
HERE=Path(__file__).resolve().parent;RES=HERE.parent;PROJECT=RES.parents[2]
sys.path.insert(0,str(RES));from native_trace import ELF
p=PROJECT/'writeups/security-keys/resources/publication_aliases.py'
if not p.is_file():p=PROJECT.parent/'Nokia-Beacon-G6/writeups/security-keys/resources/publication_aliases.py'
spec=importlib.util.spec_from_file_location('aliases',p);aliases=importlib.util.module_from_spec(spec);spec.loader.exec_module(aliases)
read=lambda n:json.loads((HERE/n).read_text());sha=lambda b:hashlib.sha256(b).hexdigest()
def expected(item):return aliases.private_value(item['sha256_alias']) if 'sha256_alias' in item else item['sha256']
def main():
 sources=read('sources.json');elfs={};instructions=0
 for item in sources:
  p=aliases.source_path(item['source']);b=p.read_bytes();assert len(b)==item['bytes'] and sha(b)==expected(item);elfs[item['source']]=ELF(p)
 for item in read('trace-index.json'):
  e=elfs[item['source']];a,b=int(item['start'],16),int(item['stop_exclusive'],16);native=e.read(a,b-a);assert sha(native)==item['range_sha256']
  rows=re.findall(r'^([0-9a-f]{8}): ([0-9a-f]{8})  ',(HERE/item['trace']).read_text(),re.M);assert [int(x[0],16) for x in rows]==list(range(a,b,4));assert b''.join(bytes.fromhex(x[1]) for x in rows)==native;instructions+=len(rows)
 e=elfs['private-source://PROFILE-G6-HJL/usr/bin/ecd'];platform=elfs['private-source://PROFILE-G6-HJL/usr/lib/libplatform_map.so']
 table=read('worker-opcode-table.json')
 for row in table:
  v=struct.unpack('<h',e.read(0x1a8030+2*(row['opcode']-3),2))[0];assert v==row['halfword'] and hex(0x8d430+v*4)==row['target']
 assert table[2]=={'opcode':5,'halfword':102,'target':'0x8d5c8'}
 def ins(pc):i=e.instructions(pc,pc+4)[0];return i.mnemonic,i.op_str
 assert ins(0x98b18)==('bl','#0x8d320')
 assert ins(0x8d5e4)==('bl','#0x824d0') and ins(0x82728)==('bl','#0x26f10')
 assert ins(0x82694)==('ldr','w26, [x21, #0x24]')
 assert ins(0x826d8)==('ldrb','w7, [x21, #0x28]') and ins(0x826e0)==('ldrb','w6, [x21, #0x29]')
 assert ins(0x826e8)==('ldp','w5, w21, [x21, #0x2c]')
 assert ins(0x82738)==('ldp','w27, w21, [x29, #0x70]')
 assert platform.pointer(0x6ee60)=='@g_default_channel_cfg'
 sym=next(s for s in platform.syms if s['name']=='g_default_channel_cfg');assert sym['va']==0xc17b8 and sym['size']==168 and sym['info']&15==1
 d=read('evidence.json');assert d['request_bytes']==52 and d['reply_bytes']==12
 # Inventory retains every original, including the failed import-only empty trace.
 for item in read('private-originals.json')['files']:
  b=aliases.source_path(item['source']).read_bytes();assert len(b)==item['bytes'] and sha(b)==expected(item)
 print(json.dumps({'passed':True,'sources':len(sources),'native_ranges':len(read('trace-index.json')),'native_instructions':instructions,'opcode_table_entries':len(table),'private_files':len(read('private-originals.json')['files']),'live_commands':0}))
if __name__=='__main__':main()
