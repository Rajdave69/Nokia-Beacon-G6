#!/usr/bin/env python3
"""Verify pinned inputs, original instruction bytes and ABI fixture/dispatch agreement.
Offline only. This is a consistency/ABI check, not packet-forwarding validation.
"""
import argparse,hashlib,io,json,re
from pathlib import Path
from elftools.elf.elffile import ELFFile

def sha(b):return hashlib.sha256(b).hexdigest()
def load(p):return json.loads(p.read_text())
def verify(rom,out,resources):
    cat=load(resources/'artifact-catalog.json');inputs=0;traces=[]
    for row in cat['files']:
        if row.get('present'):
            p=rom/row['path'];assert p.is_file(),row['path'];b=p.read_bytes();assert len(b)==row['bytes'] and sha(b)==row['sha256'],row['path'];inputs+=1
    for row in load(resources/'sdk-consumers.json')['consumers']:
        assert sha((rom/row['path']).read_bytes())==row['sha256'],row['path']
    for p in sorted((resources/'traces').glob('*.txt')):
        ins=[]
        for line in p.read_text().splitlines():
            m=re.match(r'^([0-9a-f]{8}): ([0-9a-f]{8})  ',line)
            if m:ins.append((int(m[1],16),bytes.fromhex(m[2])))
        assert ins,p.name
        prefix=p.name.split('--')[0]
        binary='usr/bin/ca-iros' if prefix=='ca-iros' else 'usr/lib/'+prefix+'.so' if (rom/'usr/lib'/(prefix+'.so')).is_file() else 'lib/modules/4.14.275/'+prefix+'.ko'
        bb=(rom/binary).read_bytes();e=ELFFile(io.BytesIO(bb));section='.init.text' if 'ca_sdk_ioctl_init' in p.name else '.text';ss=e.get_section_by_name(section);base=0 if e['e_type']=='ET_REL' else ss['sh_addr'];raw=ss.data()
        for va,code in ins:assert raw[va-base:va-base+4]==code,(p.name,hex(va))
        assert all(ins[i+1][0]==ins[i][0]+4 for i in range(len(ins)-1)),p.name
        traces.append(dict(trace=p.relative_to(resources).as_posix(),trace_sha256=sha(p.read_bytes()),binary=binary,source='private-source://PROFILE-G6-HJL/'+binary,source_sha256=sha(bb),section=section,start=hex(ins[0][0]),end=hex(ins[-1][0]+4),instructions=len(ins),instruction_bytes_sha256=sha(b''.join(c for _,c in ins))))
    tables=load(resources/'dispatch-and-traces.json');h=tables['handler_table']['entries'];i=tables['old_handler_table']['entries'];assert len(h)==769 and len(i)==768
    assert all(x['target'] for x in h[:-1]) and h[-1]['target'] is None
    assert all(x['target'] for x in i[:-1]) and i[-1]['target'] is None
    assert [x['target'] for x in h[:554]]==[x['target'] for x in i[:554]]
    assert h[554]['target']=='ca_classifier_free_entry_num_get_callback'
    assert [x['target'] for x in h[555:]]==[x['target'] for x in i[554:]]
    cases=0;info_opcodes={}
    for name,table in [('sdk-fixture-results.json',h),('sdk-fixture-results-ijl.json',i)]:
        result=load(resources/name);assert result['exit_status']==0 and not result['stderr']
        assert result.get('source_sha256',sha((resources/'capture_sdk.c').read_bytes()))==sha((resources/'capture_sdk.c').read_bytes())
        groups={}
        for case in result['records']:
            if case['kind']!='getter':continue
            packet=bytes.fromhex(case['request_hex']);assert len(packet)==4+case['payload_bytes']
            assert int.from_bytes(packet[:2],'little')==case['opcode'];assert int.from_bytes(packet[2:4],'little')==case['payload_bytes']
            assert table[case['opcode']]['target']==case['name']+'_callback'
            assert case['output_bytes']>0 if case['status'] in (0,14) else case['output_bytes']==0
            groups.setdefault(case['name'],set()).add(case['status']);cases+=1
            if case['name']=='ca_info_get':info_opcodes[name]=case['opcode']
        assert len(groups)==36 and all(x=={0,14,15} for x in groups.values())
        t=next(x for x in result['records'] if x['kind']=='transport');assert t['ioctl_request']==0 and t['device_path']=='/dev/ca-sdk-dev' and t['opens']==t['closes']==1
    assert info_opcodes['sdk-fixture-results.json']==info_opcodes['sdk-fixture-results-ijl.json']+1
    wc=load(resources/'wca-catalog.json');assert wc['status_names']['0xe']=='CA_E_EXISTS' and wc['status_names']['0xf']=='CA_E_DEV'
    native=load(resources/'native-command-table.json');assert len(native['commands'])==len({x['name'] for x in native['commands']})==6655
    aal=load(resources/'aal-cli-catalog.json');assert len(aal['user']['commands'])==7133 and len(aal['kernel']['commands'])==7130
    for label,binary in [('user','usr/lib/libca-cli.so'),('kernel','lib/modules/4.14.275/cli-drv.ko')]:
        assert aal[label]['source_sha256']==sha((rom/binary).read_bytes())
        assert all(x['callback_symbol'] for x in aal[label]['commands'])
    assert all(x['grammar'] is not None and x['help'] is not None for x in aal['user']['commands'])
    board=load(resources/'board-resources.json');assert board['dtb_sha256']=='965377f706a2d0b5d1f80e99e7ddb97d15aecfcf2179252b5d5a6b4ba9b03362'
    assert {(x['node'],x['property']) for x in board['analysis_copy_comparison']['differences']}=={('/memory','reg'),('/chosen','bootargs')}
    ni=next(x for x in board['resources'] if x['path']=='/ethernet@f4300000');assert ni['resources'][0]['address']=='0x4f4300000'
    report=dict(scope='Offline original-file/instruction-byte/dispatch/fixture checks only; no router IO or hardware effects tested.',pinned_files=inputs,consumer_sources=len(load(resources/'sdk-consumers.json')['consumers']),trace_count=len(traces),trace_instructions=sum(x['instructions'] for x in traces),getter_status_cases=cases,transport_cases=2,ca_info_get_opcodes=info_opcodes,passed=True)
    (resources/'trace-manifest.json').write_text(json.dumps(dict(scope='Exact byte-range and provenance for every saved trace; annotations remain heuristic.',traces=traces),indent=2)+'\n')
    out.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
def main():
    p=argparse.ArgumentParser();p.add_argument('--rom',type=Path,required=True);p.add_argument('--out',type=Path);a=p.parse_args();res=Path(__file__).resolve().parent;verify(a.rom,a.out or res/'verification-results.json',res)
if __name__=='__main__':main()
