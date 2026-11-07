#!/usr/bin/env python3
"""Offline SDK-prefix Tcl registration catalogue; no binary execution."""
import argparse,hashlib,io,json,re,struct
from pathlib import Path
from elftools.elf.elffile import ELFFile

def catalog(path):
    b=path.read_bytes();e=ELFFile(io.BytesIO(b));ss=list(e.iter_sections());ds=e.get_section_by_name('.data');raw=ds.data();code=[s for s in ss if s['sh_flags']&4];ro=[(s['sh_addr'],s.data()) for s in ss if s.name in ('.rodata','.data.rel.ro')];rows=[]
    def string(va):
        for base,data in ro:
            if base<=va<base+len(data):
                z=data[va-base:].split(b'\0',1)[0]
                if len(z)<180:
                    try:return z.decode('ascii')
                    except UnicodeDecodeError:return None
    for off in range(0,len(raw)-23,8):
        np,fn,cd=struct.unpack_from('<QQQ',raw,off)
        if not any(s['sh_addr']<=fn<s['sh_addr']+s['sh_size'] for s in code):continue
        name=string(np)
        if name and re.fullmatch(r'(?:ca|aal|cap|tcl)_[A-Za-z0-9_]+',name):rows.append(dict(name=name,registration_va=hex(ds['sh_addr']+off),name_va=hex(np),wrapper_va=hex(fn),client_data=hex(cd)))
    return dict(scope='Static SDK-prefix name/wrapper/client-data tuples, not every Tcl builtin. No command execution.',source='private-source://PROFILE-G6-HJL/usr/bin/ca-iros',sha256=hashlib.sha256(b).hexdigest(),commands=rows)
def main():
    p=argparse.ArgumentParser();p.add_argument('binary',type=Path);p.add_argument('--out',required=True,type=Path);a=p.parse_args();x=catalog(a.binary);a.out.write_text(json.dumps(x,indent=2)+'\n');print(json.dumps(dict(commands=len(x['commands']))))
if __name__=='__main__':main()
