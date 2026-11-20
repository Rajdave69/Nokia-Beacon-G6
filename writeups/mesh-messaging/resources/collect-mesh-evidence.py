#!/usr/bin/env python3
"""Offline identity, port and API evidence; never runs firmware or opens sockets."""
import argparse,hashlib,json,re,struct,subprocess,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
sys.path.insert(0,str(ROOT/'writeups/security-keys/resources'))
from publication_aliases import public_record

def run(*args):
    return subprocess.check_output(list(args),text=True,errors='strict')

def fingerprint(p):
    data=p.read_bytes()
    return {'source':str(p),'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()}

def buildinfo(root):
    return dict(x.split('=',1) for x in (root/'etc/buildinfo').read_text().splitlines() if '=' in x)

def at_va(data,address,size):
    off=struct.unpack_from('<Q',data,32)[0]
    stride,count=struct.unpack_from('<HH',data,54)
    for i in range(count):
        typ,flags,fo,va,pa,n,mem,align=struct.unpack_from('<IIQQQQQQ',data,off+i*stride)
        if typ==1 and va<=address and address+size<=va+n:
            return data[fo+address-va:fo+address-va+size]
    raise ValueError('Address outside file-backed ELF segments')

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--hjl-root',required=True,type=Path)
    ap.add_argument('--ijl-root',required=True,type=Path)
    ap.add_argument('--out',required=True,type=Path)
    a=ap.parse_args()
    if a.out.exists():raise FileExistsError('Choose a new report')
    expected={'HJL':'3FE49996HJLL91','IJL':'3FE49996IJLJ03'}
    profiles={}
    for name,root in [('HJL',a.hjl_root),('IJL',a.ijl_root)]:
        info=buildinfo(root);assert info['IMAGEVERSION']==expected[name]
        files={rel:dict(fingerprint(root/rel),present=True) if (root/rel).is_file() else {'source':str(root/rel),'present':False} for rel in ['usr/bin/ai_controller','usr/bin/ai-agent','usr/lib/libmeshmsg.so','usr/bin/cfgmgr','etc/buildinfo','etc/pcd/ai_controller.pcd','etc/pcd/ai_agent.pcd','usr/bin/run_aicontroller.sh','usr/bin/run_aiagent.sh']}
        constants={}
        for rel in ['usr/bin/ai_controller','usr/bin/ai-agent']:
            asm=run('aarch64-linux-gnu-objdump','-d',str(root/rel))
            hits=[line.strip() for line in asm.splitlines() if re.search(r'\bmov\s+w[01], #0xffff92d7\b',line)]
            assert len(hits)==1
            constants[rel]={'instruction':hits[0],'unsigned_low16_port':0x92d7,'signed_promoted_value':-27945}
        lib=root/'usr/lib/libmeshmsg.so'
        dynamic=run('aarch64-linux-gnu-readelf','-d',str(lib))
        needed=re.findall(r'Shared library: \[([^\]]+)\]',dynamic)
        assert needed and not any('ssl' in x.lower() or 'crypto' in x.lower() for x in needed)
        exported=run('aarch64-linux-gnu-nm','-D','--defined-only',str(lib))
        required=['mm_start_service_server','mm_create_client_channel','mm_register_actor','login_msg_received','tcp_impl_receive_with_timeout','tcp_impl_send_with_timeout']
        assert all(x in exported for x in required)
        raw=(root/'usr/bin/cfgmgr').read_bytes();template=b'-I %s -i br+ -p tcp --dport 37591 -j ACCEPT'
        assert template in raw
        profiles[name]={'buildinfo':info,'files':files,'port_constants':constants,'libmeshmsg_needed':needed,'required_transport_symbols':required,'cfgmgr_firewall_template':{'file_offset':hex(raw.index(template)),'template':template.decode(),'limit':'Packaged rule template, not proof of live installation or every operator/build branch.'}}
    data=(a.hjl_root/'usr/bin/ai_controller').read_bytes()
    table={str(i):hex(0x554cc+struct.unpack('b',bytes([n]))[0]*4) for i,n in enumerate(at_va(data,0x70d00,11))}
    assert table=={'0':'0x55538','1':'0x55670','2':'0x55670','3':'0x55670','4':'0x55670','5':'0x5563c','6':'0x55580','7':'0x55538','8':'0x55670','9':'0x55670','10':'0x555bc'}
    report={'date':'2026-10-28','scope':'Offline stock-file inspection and host readelf/nm/objdump only. No native firmware execution, QEMU, network socket, protocol traffic, reset or configuration change. Owner live observation retained separately.','profiles':profiles,'HJL_request_type_jump_table':{'table_va':'0x70d00','signed_byte_base_va':'0x554cc','scale':4,'targets':table},'HJL_reviewed_callbacks':{'controller_start':'0x54b24','server_port_argument':'0x54c30','mm_start_service_server_call':'0x54c3c','controller_actor':'0x545c0','controller_business_callback':'0x553ec','controller_callback_install':'0x5631c..0x56324','agent_start':'0x146b8','agent_actor':'0x13f10','agent_business_callback':'0xc200','agent_callback_install':'0xcec0..0xcecc','agent_scan_config':'0xb5ec','agent_scan_enable':'0x97b4','agent_scan_enable_wrapper':'0xc1ac'},'transport_symbol_addresses_compared':False,'different_binary_hashes':{rel:profiles['HJL']['files'][rel]['sha256']!=profiles['IJL']['files'][rel]['sha256'] for rel in ['usr/bin/ai_controller','usr/bin/ai-agent','usr/lib/libmeshmsg.so']},'limits':['Jump-table/callback addresses above are for HJL only.','Import absence alone does not prove authentication absence; the manual login/actor/application-path review is documented separately.','No assumption that every agent action is accepted by the inbound controller endpoint.','No live firmware version, physical G6 alias, on-wire packet trace or successful third-party protocol session supplied.']}
    report=public_record(report)
    a.out.write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'profiles_checked':len(profiles),'source_files_hashed':sum(v['present'] for x in profiles.values() for v in x['files'].values()),'reference_file_absences':sum(not v['present'] for x in profiles.values() for v in x['files'].values()),'port_constants_verified':4,'HJL_jump_table_entries':len(table),'firmware_executed':False,'network_requests':0}))

if __name__=='__main__':main()
