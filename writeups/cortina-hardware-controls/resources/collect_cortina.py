#!/usr/bin/env python3
"""Offline Cortina artifact/API/symbol inventory. Never loads a firmware binary.
Requires pyelftools and capstone. Private paths are supplied as arguments; output
uses profile aliases. Symbols are evidence of code, not a live hardware promise.
"""
import argparse,bisect,collections,hashlib,io,json,re
from pathlib import Path
from elftools.elf.elffile import ELFFile
from capstone import Cs,CS_ARCH_ARM64,CS_MODE_LITTLE_ENDIAN

def digest(b):return hashlib.sha256(b).hexdigest()
def dump(path,obj):path.write_text(json.dumps(obj,indent=2)+'\n',encoding='utf-8')
def elf_catalog(data):
    e=ELFFile(io.BytesIO(data)); tab=e.get_section_by_name('.symtab') or e.get_section_by_name('.dynsym')
    symbols=list(tab.iter_symbols()); funcs=[]; objects=[]
    for s in symbols:
        if not isinstance(s['st_shndx'],int) or not s.name:continue
        dest=funcs if s['st_info']['type']=='STT_FUNC' else objects if s['st_info']['type']=='STT_OBJECT' else None
        if dest is not None:
            dest.append(dict(name=s.name,section=e.get_section(s['st_shndx']).name,offset=hex(s['st_value']),bytes=s['st_size'],binding=s['st_info']['bind']))
    needed=[]
    dy=e.get_section_by_name('.dynamic')
    if dy:needed=[t.needed for t in dy.iter_tags() if t.entry.d_tag=='DT_NEEDED']
    mod=e.get_section_by_name('.modinfo');info=mod.data().decode(errors='replace').strip('\0').split('\0') if mod else []
    strings=[x.decode() for x in re.findall(rb'[\x20-\x7e]{4,}',data)]
    signatures=sorted(set(x for x in strings if re.match(r'^[a-z]*:(?:ca|aal)_[A-Za-z0-9_]+(?: |$)',x)))
    nodes=sorted(set(x for x in strings if re.match(r'^/(?:dev|proc|sys)/',x) and len(x)<240))
    return dict(elf_type=e['e_type'],machine=e['e_machine'],needed=needed,modinfo=info,
        functions=sorted(funcs,key=lambda x:(x['section'],int(x['offset'],16),x['name'])),
        objects=sorted(objects,key=lambda x:(x['section'],int(x['offset'],16),x['name'])),
        native_tcl_signatures=signatures,path_literals=nodes)

def module_edges(data):
    e=ELFFile(io.BytesIO(data));edges=[];refs=[];functions=collections.defaultdict(list)
    sy=e.get_section_by_name('.symtab')
    for s in sy.iter_symbols():
        if s['st_info']['type']=='STT_FUNC' and isinstance(s['st_shndx'],int) and s['st_size']:
            functions[s['st_shndx']].append((s['st_value'],s['st_value']+s['st_size'],s.name))
    for k in functions:functions[k].sort()
    for sec in e.iter_sections():
        if sec['sh_type']!='SHT_RELA':continue
        table=e.get_section(sec['sh_link']);idx=sec['sh_info'];lst=functions[idx];starts=[x[0] for x in lst]
        for r in sec.iter_relocations():
            symbol=table.get_symbol(r['r_info_sym']);off=r['r_offset'];i=bisect.bisect_right(starts,off)-1
            source=lst[i][2] if i>=0 and off<lst[i][1] else None
            if r['r_info_type'] in (282,283):
                edges.append(dict(section=e.get_section(idx).name,offset=hex(off),caller=source,target=symbol.name,addend=r['r_addend'],relocation_type=r['r_info_type']))
            elif symbol.name and re.search(r'(sdk_handler_table|fops|netdev_ops|ethtool|ca_sdk_kern|cli_k|ca_pal|ne_get|ne_set)',symbol.name):
                refs.append(dict(section=e.get_section(idx).name,offset=hex(off),caller=source,target=symbol.name,addend=r['r_addend'],relocation_type=r['r_info_type']))
    return dict(calls=edges,selected_data_references=refs)

def scfg(data):
    fields=[]
    for ln,line in enumerate(data.decode(errors='replace').splitlines(),1):
        m=re.match(r'\s*([A-Z-]+)\s+(CFG_ID_\w+)\s*=\s*(.*?);(.*)$',line)
        if m:fields.append(dict(line=ln,type=m[1],name=m[2],value=m[3],comment=m[4].strip()))
    return fields

def collect(root,profile):
    selected=set();packages=[]
    for p in sorted((root/'usr/lib/opkg/info').glob('*.control')):
        if p.stem in ('ca-certificates','ca-bundle') or not re.match(r'(?:ca-|kmod-ca-|kmod-hcfg|kmod-libphy)',p.name):continue
        text=p.read_text(errors='replace');lp=p.with_suffix('.list')
        files=lp.read_text(errors='replace').splitlines() if lp.exists() else []
        packages.append(dict(name=p.stem,control=text,files=files))
        selected.update(x.lstrip('/') for x in files if x.startswith('/'))
        selected.update([p.relative_to(root).as_posix(),lp.relative_to(root).as_posix()])
    selected.update(p.relative_to(root).as_posix() for p in (root/'etc/cortina').rglob('*') if p.is_file())
    selected.update(['etc/scfg/scfg.txt','etc/scfg/default_scfg.txt','etc/ca-iros.rc','usr/bin/iros'])
    inventory=[];elfs={};scripts=[];texts={};graphs={};configs={}
    for rel in sorted(selected):
        p=root/rel
        if not p.exists():inventory.append(dict(path=rel,present=False));continue
        if not p.is_file():continue
        b=p.read_bytes();row=dict(path=rel,source=f'private-source://{profile}/{rel}',present=True,bytes=len(b),sha256=digest(b),symlink=p.is_symlink())
        inventory.append(row)
        if b.startswith(b'\x7fELF'):
            elfs[rel]=elf_catalog(b)
            if rel.endswith('.ko'):graphs[rel]=module_edges(b)
        elif rel.startswith(('etc/cortina/','etc/scfg/','etc/modules.d/','etc/init.d/')) or rel in ['etc/ca-iros.rc','usr/bin/iros']:
            if b'\0' not in b:
                text=b.decode(errors='replace');texts[rel]=text
                scripts.append(dict(path=rel,sha256=digest(b),lines=len(text.splitlines()),
                    commands=sorted(set(re.findall(r'\b(?:ca|aal|wca)_[a-zA-Z0-9_]+',text))),
                    operation_lines=[dict(line=i,text=l) for i,l in enumerate(text.splitlines(),1) if re.search(r'\b(devmem|rboot|insmod|modprobe|app-cli|ca-iros|echo .*?>|sysctl|iptables)\b',l)][:200]))
                if rel.startswith('etc/scfg/'):configs[rel]=scfg(b)
    return dict(schema_version=1,profile=profile,scope='offline file/ELF/relocation inspection only; nothing executed on router',packages=packages,files=inventory,elfs=elfs,scripts=scripts,scfg=configs),texts,graphs

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--rom',type=Path,required=True);ap.add_argument('--profile',default='PROFILE-G6-HJL');ap.add_argument('--out',type=Path,required=True);ap.add_argument('--private-text',type=Path);a=ap.parse_args();a.out.mkdir(parents=True,exist_ok=True)
    cat,texts,graphs=collect(a.rom,a.profile);dump(a.out/'artifact-catalog.json',cat);dump(a.out/'module-callgraph.json',graphs)
    if a.private_text:dump(a.private_text,dict(profile=a.profile,scope='full original small text sources; source hashes in artifact catalogue',sources=texts))
    print(json.dumps(dict(files=len(cat['files']),packages=len(cat['packages']),elfs=len(cat['elfs']),scripts=len(cat['scripts']),modules=len(graphs),calls=sum(len(x['calls']) for x in graphs.values()))))
if __name__=='__main__':main()
