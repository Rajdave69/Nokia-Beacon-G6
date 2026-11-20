#!/usr/bin/env python3
"""Derive policy comparisons and exact static anchors from collected firmware."""
import hashlib,io,json,struct,sys,re
from pathlib import Path
from elftools.elf.elffile import ELFFile
from native_trace import ELF
ROOT=Path(__file__).resolve().parents[3]
sys.path.insert(0,str(ROOT/'writeups/security-keys/resources'))
from publication_aliases import source_path
OUT=Path(__file__).resolve().parent
sha=lambda b:hashlib.sha256(b).hexdigest()
def fields(q):
    return {v['key']:v['value'] for v in q['fields']}
def main():
    inv=json.loads((OUT/'inventory.json').read_text()); profiles=inv['profiles'];policies={};changes=[];sections={};tables={}
    for profile,report in profiles.items():
        policies[profile]=[dict(path=q['path'],**fields(q)) for q in report['rules']]
        root=source_path('private-source://'+profile);sections[profile]={}
        for rel,row in report['files'].items():
            if not row.get('elf'):continue
            e=ELFFile(io.BytesIO((root/rel).read_bytes()));sec=e.get_section_by_name('.text')
            if sec:sections[profile][rel]=dict(start=hex(sec['sh_addr']),bytes=sec['sh_size'],sha256=sha(sec.data()))
        b=(root/'usr/bin/diagnosis').read_bytes();needle=b'\x01ps'+bytes(62)+b'\x02cfgcli dumpwan'
        off=b.find(needle)
        assert off>=0,(profile,'command table not found')
        e=ELFFile(io.BytesIO(b));va=None
        for seg in e.iter_segments():
            if seg['p_type']=='PT_LOAD' and seg['p_offset']<=off<seg['p_offset']+seg['p_filesz']:va=seg['p_vaddr']+off-seg['p_offset']
        tables[profile]=dict(file_offset=hex(off),va=hex(va),stride=65,records=[dict(id=b[off+i*65],command=b[off+i*65+1:off+(i+1)*65].split(b'\0')[0].decode()) for i in range(12)])
    for a,b in [('PROFILE-G6-IJL','PROFILE-G6-HJL'),('PROFILE-G6-HJL','PROFILE-B9-JJM')]:
        aa={v['path']:v for v in policies[a]};bb={v['path']:v for v in policies[b]}
        changes.append(dict(before=a,after=b,added=[bb[k] for k in sorted(bb.keys()-aa.keys())],removed=[aa[k] for k in sorted(aa.keys()-bb.keys())],changed=[dict(path=k,before=aa[k],after=bb[k]) for k in sorted(aa.keys()&bb.keys()) if aa[k]!=bb[k]]))
    root=source_path('private-source://PROFILE-G6-HJL');e=ELF(root/'usr/bin/fonendoscope');methods=[]
    for i in range(5):
        a=0x405e10+48*i;name,handler=struct.unpack('<QQ',e.read(a,16));policy=struct.unpack('<Q',e.read(a+32,8))[0];count=struct.unpack('<I',e.read(a+40,4))[0]
        row=dict(entry_va=hex(a),name=e.literal(name),handler_va=hex(handler),policy_va=hex(policy),policy_count=count)
        if policy:
            row['fields']=[]
            for j in range(count):
                n,typ=struct.unpack('<QI',e.read(policy+16*j,12));row['fields'].append(dict(name=e.literal(n),blobmsg_type=typ))
        methods.append(row)
    ee=ELF(root/'usr/lib/libpcd.so');txt,calls=ee.trace(0x1aa0,0x1bc4);(OUT/'traces/G6-HJL--libpcd.so--PCD_api_find_process_id.txt').write_text(txt)
    result=dict(scope='Static derivation only; no firmware execution, IPC request or live state.',policies=policies,rule_changes=changes,text_sections=sections,diagnosis_command_tables=tables,fonendoscope_ubus=dict(object='fonendoscope',object_va='0x417010',method_table_va='0x405e10',method_stride=48,methods=methods),find_process_id=dict(source='private-source://PROFILE-G6-HJL/usr/lib/libpcd.so',va='0x1aa0',end='0x1bc4',trace='traces/G6-HJL--libpcd.so--PCD_api_find_process_id.txt',calls=calls))
    refs=[]
    for profile in profiles:
        rt=source_path('private-source://'+profile)
        for folder in ['bin','sbin','usr/bin','usr/sbin','usr/lib','lib']:
            for pp in (rt/folder).glob('*'):
                if not pp.is_file() or not any(pp.name==name or pp.name.startswith(name+'.so') for name in ['cfgmgr','bdemgr','ndk_appsd','guestdev','libnal','ddm']):continue
                raw=pp.read_bytes();hits=[v.decode() for v in re.findall(rb'[\x20-\x7e]{4,}',raw) if b'/tmp/daemon' in v]
                if hits:refs.append(dict(source='private-source://'+profile+'/'+pp.relative_to(rt).as_posix(),sha256=sha(raw),bytes=len(raw),exact_literals=hits,scope='Literal references only, not producer/activation proof.'))
    (OUT/'monitor-references.json').write_text(json.dumps(refs,indent=2)+'\n')
    (OUT/'comparisons.json').write_text(json.dumps(result,indent=2)+'\n')
    lines=['# Packaged PCD policy matrix','','Generated from the full source records in `inventory.json`. ACTIVE is the packaged switch; it does not prove that a runtime gate is satisfied or a process is running.','','| Profile | Rule | Active | Start condition | Failure action | Timeout (ms) | Command |','| --- | --- | --- | --- | --- | --- | --- |']
    for prof,rows in policies.items():
        for q in rows:
            vals=[prof.replace('PROFILE-',''),q.get('RULE',''),q.get('ACTIVE',''),q.get('START_COND',''),q.get('FAILURE_ACTION',''),q.get('END_COND_TIMEOUT',''),q.get('COMMAND','')]
            lines.append('| '+' | '.join('`'+str(v).replace('|','&#124;')+'`' for v in vals)+' |')
    (OUT/'pcd-policy-matrix.md').write_text('\n'.join(lines)+'\n')
    print(json.dumps(dict(profiles={k:len(v) for k,v in policies.items()},methods=methods,command_tables={k:v['va'] for k,v in tables.items()})))
if __name__=='__main__':main()
