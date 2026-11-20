#!/usr/bin/env python3
"""Offline native .text trace capture; no program execution. Failures retained."""
from pathlib import Path
import json,sys,io,hashlib
from elftools.elf.elffile import ELFFile
from native_trace import ELF
ROOT=Path(__file__).resolve().parents[3]
sys.path.insert(0,str(ROOT/'writeups/security-keys/resources'))
from publication_aliases import source_path

def main():
    out=Path(__file__).resolve().parent;tr=out/'traces';tr.mkdir(exist_ok=True);records=[];failures=[];shared_traces={}
    for profile in ['PROFILE-G6-HJL','PROFILE-G6-IJL','PROFILE-B9-JJM']:
        root=source_path('private-source://'+profile)
        for rel in ['usr/bin/diagnosis','usr/bin/pcd','usr/lib/libpcd.so','usr/lib/libipc.so','usr/bin/wanlived','usr/bin/crashcapture','sbin/procd','usr/sbin/registerReboot','usr/bin/fonendoscope']:
            p=root/rel
            if not p.is_file() or not p.stat().st_size:continue
            b=p.read_bytes()
            if not b.startswith(b'\x7fELF'):continue
            ee=ELFFile(io.BytesIO(b));sec=ee.get_section_by_name('.text')
            if sec is None:failures.append(dict(profile=profile,binary=rel,reason='No .text section in original file; full text boundary not established.'));continue
            e=ELF(p);sy=ee.get_section_by_name('.symtab')
            if sy:e.names.update({s['st_value']:s.name for s in sy.iter_symbols() if s.name and s['st_info']['type']=='STT_FUNC' and isinstance(s['st_shndx'],int) and s['st_value']})
            start=sec['sh_addr'];end=start+sec['sh_size']
            try:txt,calls=e.trace(start,end)
            except Exception as ex:failures.append(dict(profile=profile,binary=rel,reason=str(ex)));continue
            trace_sha256=hashlib.sha256(txt.encode()).hexdigest()
            trace_key=(Path(rel).name,trace_sha256)
            dest=shared_traces.get(trace_key)
            if dest is None:
                dest=tr/(profile.replace('PROFILE-','')+'--'+Path(rel).name+'.txt')
                dest.write_text(txt,encoding='utf-8',newline='\n')
                shared_traces[trace_key]=dest
            records.append(dict(profile=profile,binary=rel,source='private-source://'+profile+'/'+rel,source_sha256=hashlib.sha256(b).hexdigest(),section='.text',start=hex(start),end=hex(end),trace='traces/'+dest.name,trace_sha256=trace_sha256,calls=calls))
    (out/'native-calls.json').write_text(json.dumps(dict(scope='Offline exact full .text decoding; linear constant/call annotations heuristic. No program execution.',records=records,failures=failures),indent=2)+'\n')
    print(json.dumps(dict(records=len(records),failures=failures)))
if __name__=='__main__':main()
