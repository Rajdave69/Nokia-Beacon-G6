#!/usr/bin/env python3
"""Inspect shipped Tcl definitions in a SAFE host interpreter. No SDK loaded.
Requires Python tkinter (no GUI is created). Does not execute any wca procedure.
"""
import argparse,hashlib,json,re,tkinter
from pathlib import Path

def catalog(path):
    data=path.read_bytes(); t=tkinter.Tcl()
    t.call('interp','create','-safe','doc')
    # The source renames this native command to wrap memory release. An inert
    # definition allows registration only; no firmware helper is invoked.
    t.call('interp','eval','doc','proc ca_data_free {args} {error "inert documentation stub"}')
    t.call('interp','eval','doc',data.decode())
    run=lambda code:t.call('interp','eval','doc',code)
    names=sorted(t.splitlist(run('info procs ::gw::*')))
    procs=[]
    for name in names:
        body=str(run(('info','body',name)))
        procs.append(dict(name=name,args=list(t.splitlist(run(('info','args',name)))),
            body_sha256=hashlib.sha256(body.encode()).hexdigest(),
            required_key_declarations=re.findall(r'set m_key_l\s+\{([^}]+)\}',body),
            optional_key_declarations=re.findall(r'set (?:v_key_l|v_o_key_l|o_key_l|v_out_key_l)\s+\{([^}]+)\}',body),
            declared_defaults=re.findall(r'set aIn\(-([^)]+)\)\s+([^\n]+)',body),
            struct_probes=re.findall(r'helper_probe_struct_members[^\n]+',body),
            native_names=sorted(set(re.findall(r'\b(?:ca|aal)_[a-zA-Z0-9_]+',body))),
            exec_lines=[x.strip() for x in body.splitlines() if re.search(r'\bexec\s',x)]))
    arrays={}
    for name in sorted(t.splitlist(run('info vars ::gw::*'))):
        if int(run(('array','exists',name))):
            flat=t.splitlist(run(('array','get',name)))
            arrays[name]=dict(sorted((str(flat[i]),str(flat[i+1])) for i in range(0,len(flat),2)))
    return dict(schema_version=1,scope='Host safe Tcl interpreter; definitions only, no WCA procedure executed and no native SDK present.',
        source='private-source://PROFILE-G6-HJL/etc/cortina/iros/qa/wca/SC_COMMAND_LIB.tcl',
        source_bytes=len(data),source_sha256=hashlib.sha256(data).hexdigest(),
        host_tcl=str(t.call('info','patchlevel')),procedures=procs,arrays=arrays,
        status_names=dict(re.findall(r'(0x[0-9a-f]+)\s+(CA_E_[A-Z_]+)',str(run(('info','body','::gw::helper_print_status_enum_name'))))))

def main():
    p=argparse.ArgumentParser();p.add_argument('--rom',required=True,type=Path);p.add_argument('--out',required=True,type=Path);a=p.parse_args()
    report=catalog(a.rom/'etc/cortina/iros/qa/wca/SC_COMMAND_LIB.tcl')
    a.out.write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(dict(procedures=len(report['procedures']),wca_procedures=sum('::wca_' in p['name'] for p in report['procedures']),arrays=len(report['arrays']),source_sha256=report['source_sha256'])))
if __name__=='__main__':main()
