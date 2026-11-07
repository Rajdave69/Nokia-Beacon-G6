#!/usr/bin/env python3
"""Offline ET_REL-aware AArch64 traces and SDK callback table extraction.
Module offsets are SECTION-relative, never runtime addresses. Exact bytes and
relocations are preserved; string annotations are derived from relocation targets.
"""
import argparse,hashlib,io,json,re
from pathlib import Path
from elftools.elf.elffile import ELFFile
from capstone import Cs,CS_ARCH_ARM64,CS_MODE_LITTLE_ENDIAN

class Module:
    def __init__(self,path):
        self.data=path.read_bytes();self.elf=ELFFile(io.BytesIO(self.data));self.syms=list(self.elf.get_section_by_name('.symtab').iter_symbols());self.reloc={}
        for sec in self.elf.iter_sections():
            if sec['sh_type']!='SHT_RELA':continue
            table=list(self.elf.get_section(sec['sh_link']).iter_symbols())
            for r in sec.iter_relocations():self.reloc[sec['sh_info'],r['r_offset']]=(table[r['r_info_sym']],r['r_addend'],r['r_info_type'])
    def symbol(self,name):return next(s for s in self.syms if s.name==name and isinstance(s['st_shndx'],int))
    def describe(self,s,add):
        sec=self.elf.get_section(s['st_shndx']) if isinstance(s['st_shndx'],int) else None
        name=s.name or (sec.name if sec else '')
        result=f'{name}{add:+#x}'
        if sec and ('str' in sec.name or sec.name=='.rodata'):
            b=sec.data()[s['st_value']+add:];b=b.split(b'\0',1)[0]
            if 0<len(b)<=240 and all(c in (9,10,13) or 32<=c<=126 for c in b):result+=' '+repr(b.decode())
        return result
    def trace(self,name=None,section=None,start=None,end=None):
        if name:
            s=self.symbol(name);idx=s['st_shndx'];start=s['st_value'];end=start+s['st_size']
        else:idx=next(i for i,s in enumerate(self.elf.iter_sections()) if s.name==section)
        sec=self.elf.get_section(idx);raw=sec.data()[start:end];lines=[f'{name or "unnamed handler"}: {sec.name}+{start:#x}, {end-start} bytes; sha256 {hashlib.sha256(raw).hexdigest()}']
        ins=list(Cs(CS_ARCH_ARM64,CS_MODE_LITTLE_ENDIAN).disasm(raw,start))
        if b''.join(i.bytes for i in ins)!=raw:raise ValueError('incomplete native decoding')
        for i in ins:
            rel=self.reloc.get((idx,i.address));annotation=(' ; reloc '+self.describe(rel[0],rel[1])+f' type={rel[2]}') if rel else ''
            lines.append(f'{i.address:08x}: {i.bytes.hex()}  {i.mnemonic} {i.op_str}{annotation}')
        return '\n'.join(lines)+'\n'
    def table(self,name):
        s=self.symbol(name);idx=s['st_shndx'];base=s['st_value'];rows=[]
        for off in range(0,s['st_size'],8):
            r=self.reloc.get((idx,base+off));rows.append(dict(index=off//8,byte_offset=hex(off),target=r[0].name if r else None,addend=r[1] if r else None))
        return dict(section=self.elf.get_section(idx).name,offset=hex(base),bytes=s['st_size'],entries=rows)

def main():
    p=argparse.ArgumentParser();p.add_argument('binary',type=Path);p.add_argument('--function');p.add_argument('--section');p.add_argument('--start',type=lambda x:int(x,0));p.add_argument('--end',type=lambda x:int(x,0));p.add_argument('--table');a=p.parse_args();m=Module(a.binary)
    if a.table:print(json.dumps(m.table(a.table),indent=2))
    else:print(m.trace(a.function,a.section,a.start,a.end),end='')
if __name__=='__main__':main()
