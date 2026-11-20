#!/usr/bin/env python3
"""Offline diagnostics/recovery inventory; no firmware program execution."""
import argparse,hashlib,io,json,re,sys,base64
from pathlib import Path
from elftools.elf.elffile import ELFFile
ROOT=Path(__file__).resolve().parents[3]
sys.path.insert(0,str(ROOT/'writeups/security-keys/resources'))
from publication_aliases import source_path
BINS=['usr/bin/diagnosis','usr/bin/wanlived','usr/bin/pcd','usr/lib/libpcd.so','usr/bin/crashcapture','usr/sbin/registerReboot','sbin/procd','usr/bin/fonendoscope','usr/sbin/watchquagga','sbin/sec_monitor','usr/lib/libdm_utility.so','usr/lib/libipc.so','lib/libcs_util.so','lib/liberrhandling.so','usr/bin/guestdev']
TEXT=['etc/init.d/pcd','etc/inittab','etc/config/fonendoscope','etc/config/system','usr/exe/post_reboot.sh','usr/exe/pre_reboot.sh','usr/exe/shutdown_wtd.sh','usr/exe/data_guardian.sh','usr/exe/restore.sh','usr/exe/varset.sh','usr/exe/HomeAgent.sh','usr/bin/system_init.sh','usr/bin/preinit.sh','etc/HB_Config.json','etc/init.d/done','etc/init.d/boot','etc/init.d/system','etc/rc.button/reset','etc/rc.button/reboot','usr/exe/diag_script.sh','usr/bin/start_obuspa.sh','etc/init.d/diag_socket_app','etc/init.d/cnss_diag','usr/bin/qdss_setup.sh','etc/sysctl.conf','etc/init.d/sysctl','lib/functions/procd.sh','usr/sbin/pcd','etc/init.d/network','etc/buildinfo']
PKGS=['pcd','pcd_config','diagnosis','wanlived','crashcapture','fonendoscope','procd','quagga-watchquagga']

def sha(b):return hashlib.sha256(b).hexdigest()
def dwarf(e):
    out={'types':[],'functions':[]}
    if not e.get_section_by_name('.debug_info'):return out
    dw=e.get_dwarf_info()
    for cu in dw.iter_CUs():
        for di in cu.iter_DIEs():
            if di.tag not in ['DW_TAG_structure_type','DW_TAG_union_type','DW_TAG_enumeration_type','DW_TAG_typedef','DW_TAG_subprogram']:continue
            def attrs(d):
                result={}
                for k,v in d.attributes.items():
                    if k in ['DW_AT_name','DW_AT_byte_size','DW_AT_type','DW_AT_const_value','DW_AT_data_member_location','DW_AT_low_pc','DW_AT_high_pc','DW_AT_external','DW_AT_declaration','DW_AT_encoding']:
                        val=v.value
                        if isinstance(val,bytes):val=val.decode(errors='replace')
                        elif isinstance(val,list):val={'expression_hex':bytes(val).hex()}
                        if k=='DW_AT_type':val=hex(d.cu.cu_offset+v.value) if v.form.startswith('DW_FORM_ref') and v.form!='DW_FORM_ref_addr' else hex(v.value)
                        result[k[6:]]=val
                return result
            row=dict(offset=hex(di.offset),tag=di.tag,attributes=attrs(di),children=[dict(offset=hex(c.offset),tag=c.tag,attributes=attrs(c)) for c in di.iter_children() if c.tag in ['DW_TAG_member','DW_TAG_enumerator','DW_TAG_formal_parameter']])
            out['functions' if di.tag=='DW_TAG_subprogram' else 'types'].append(row)
    return out

def elf(b):
    e=ELFFile(io.BytesIO(b));st=e.get_section_by_name('.symtab') or e.get_section_by_name('.dynsym');symbols=[]
    if st:
        for s in st.iter_symbols():
            if s.name and (s['st_info']['type'] in ('STT_FUNC','STT_OBJECT') or s['st_shndx']=='SHN_UNDEF'):
                symbols.append(dict(name=s.name,type=s['st_info']['type'],section=e.get_section(s['st_shndx']).name if isinstance(s['st_shndx'],int) else s['st_shndx'],va=hex(s['st_value']),bytes=s['st_size']))
    dy=e.get_section_by_name('.dynamic');needed=[t.needed for t in dy.iter_tags() if t.entry.d_tag=='DT_NEEDED'] if dy else []
    strings=[x.decode() for x in re.findall(rb'[\x20-\x7e]{4,}',b)]
    return dict(elf_type=e['e_type'],needed=needed,symbols=symbols,literals=[x for x in strings if re.search(r'(diagn|pcd|reboot|restart|watchdog|crash|core_|wanalive|wanlive|nokia\.|/tmp/|/logs/|SIG|set_cmd|FAILURE|ALIVE|TIMEOUT|respawn)',x,re.I)],dwarf=dwarf(e))

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--out',required=True,type=Path);a=ap.parse_args();a.out.mkdir(parents=True,exist_ok=True);profiles={}
    for profile in ['PROFILE-G6-HJL','PROFILE-G6-IJL','PROFILE-B9-JJM']:
        root=source_path('private-source://'+profile);selected=set(BINS+TEXT)
        selected.update(p.relative_to(root).as_posix() for p in (root/'etc/sysctl.d').glob('*') if p.is_file())
        selected.update(p.relative_to(root).as_posix() for p in (root/'etc/pcd').glob('*') if p.is_file())
        for pkg in PKGS:
            for suffix in ['control','list','conffiles']:selected.add('usr/lib/opkg/info/'+pkg+'.'+suffix)
        for p in (root/'usr/exe').glob('*'):
            if p.is_file() and re.search(r'reboot|watch|crash|diag|recover',p.name,re.I):selected.add(p.relative_to(root).as_posix())
        files={};rules=[]
        for rel in sorted(selected):
            p=root/rel;uri='private-source://'+profile+'/'+rel
            if not p.is_file():files[rel]=dict(source=uri,present=False);continue
            b=p.read_bytes();row=dict(source=uri,present=True,bytes=len(b),sha256=sha(b))
            if b.startswith(b'\x7fELF'):row['elf']=elf(b)
            elif b'\0' not in b:
                try:s=b.decode('utf-8');row['encoding']='UTF-8'
                except UnicodeDecodeError:s=b.decode('latin1');row['encoding']='Latin1 reversible byte view'
                row['text']=s
                if rel.startswith('etc/pcd/'):
                    fields=[]
                    for i,l in enumerate(s.splitlines(),1):
                        l=l.strip()
                        if not l or l.startswith('#'):continue
                        m=re.match(r'([A-Z_0-9]+)\s*=\s*(.*)',l)
                        if m:fields.append(dict(line=i,key=m[1],value=m[2]))
                    rules.append(dict(path=rel,fields=fields))
            files[rel]=row
        profiles[profile]=dict(files=files,rules=rules)
    report=dict(schema_version=1,verified_on='2026-11-10',scope='Offline original file/ELF/DWARF inspection only. No router connection or service/control execution.',profiles=profiles)
    (a.out/'inventory.json').write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps({k:dict(files=sum(x['present'] for x in v['files'].values()),rules=len(v['rules'])) for k,v in profiles.items()}))
if __name__=='__main__':main()
