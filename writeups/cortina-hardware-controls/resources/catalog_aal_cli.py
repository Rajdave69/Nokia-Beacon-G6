#!/usr/bin/env python3
"""Offline generated AAL user grammar/help and kernel command descriptors.
Grammar is relative to its CLI node; registration hierarchy is not inferred.
"""
import argparse,hashlib,io,json,struct
from pathlib import Path
from elftools.elf.elffile import ELFFile

def parse(path,kernel=False):
    b=path.read_bytes();e=ELFFile(io.BytesIO(b));sy=list((e.get_section_by_name('.symtab') or e.get_section_by_name('.dynsym')).iter_symbols());rel={}
    for sec in e.iter_sections():
        if sec['sh_type']!='SHT_RELA':continue
        tab=list(e.get_section(sec['sh_link']).iter_symbols())
        for rr in sec.iter_relocations():rel[(sec['sh_info'] if kernel else 0,rr['r_offset'])]=(tab[rr['r_info_sym']],rr['r_addend'])
    strings=[(s['sh_addr'],s.data()) for s in e.iter_sections() if s.name in ('.rodata','.data.rel.ro')]
    def string(va):
        for base,buf in strings:
            if base<=va<base+len(buf):
                start=va-base;end=buf.find(b'\0',start);raw=buf[start:end if end>=0 else len(buf)]
                if len(raw)<8192:
                    try:return raw.decode('utf-8')
                    except UnicodeDecodeError:return None
    rows=[]
    for s in sy:
        if s['st_info']['type']!='STT_OBJECT' or not s.name.endswith('_cmd') or not isinstance(s['st_shndx'],int):continue
        if s['st_size']!=(136 if kernel else 24):continue
        sec=e.get_section(s['st_shndx']);start=s['st_value'] if kernel else s['st_value']-sec['sh_addr'];raw=sec.data()[start:start+s['st_size']];rr=rel.get((s['st_shndx'] if kernel else 0,s['st_value']+(128 if kernel else 0)))
        row=dict(symbol=s.name,section=sec.name,offset=hex(s['st_value']),bytes=s['st_size'],callback_symbol=rr[0].name if rr else None,callback_addend=rr[1] if rr else None)
        if kernel:row['dispatch_name']=raw[:128].split(b'\0',1)[0].decode()
        else:
            fn,cmd,help=struct.unpack('<QQQ',raw);row.update(callback_pointer=hex(fn),grammar=string(cmd),help=string(help))
        rows.append(row)
    return dict(source_sha256=hashlib.sha256(b).hexdigest(),commands=sorted(rows,key=lambda x:x['symbol']),nonmatching_object_sizes=[dict(symbol=s.name,bytes=s['st_size']) for s in sy if s['st_info']['type']=='STT_OBJECT' and s.name.endswith('_cmd') and isinstance(s['st_shndx'],int) and s['st_size']!=(136 if kernel else 24)])

def main():
    p=argparse.ArgumentParser();p.add_argument('--rom',type=Path,required=True);p.add_argument('--out',type=Path,required=True);a=p.parse_args();u='usr/lib/libca-cli.so';k='lib/modules/4.14.275/cli-drv.ko';x=dict(scope='Offline native descriptor bytes/relocations, not executed commands. User grammar is relative to node; full prompt hierarchy not inferred.',user=parse(a.rom/u),kernel=parse(a.rom/k,True));x['user']['source']='private-source://PROFILE-G6-HJL/'+u;x['kernel']['source']='private-source://PROFILE-G6-HJL/'+k
    a.out.write_text(json.dumps(x,indent=2)+'\n');print(json.dumps(dict(user_commands=len(x['user']['commands']),kernel_commands=len(x['kernel']['commands']))))
if __name__=='__main__':main()
