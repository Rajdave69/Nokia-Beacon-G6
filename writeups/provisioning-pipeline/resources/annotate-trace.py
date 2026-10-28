#!/usr/bin/env python3
"""Retain bounded GNU disassembly with heuristic GOT/string annotations.

Annotations resolve literal addresses, not full control/data flow. Raw instructions
remain authoritative. No target firmware code is executed.
"""
import argparse,re,struct,subprocess
from pathlib import Path

def main():
 ap=argparse.ArgumentParser();ap.add_argument('binary',type=Path);ap.add_argument('--start',required=True);ap.add_argument('--stop',required=True);ap.add_argument('--out',type=Path,required=True);a=ap.parse_args()
 if a.out.exists():raise FileExistsError('Use a new trace output')
 data=a.binary.read_bytes();assert data[:6]==b'\x7fELF\x02\x01'
 phoff=struct.unpack_from('<Q',data,32)[0];phsize,phnum=struct.unpack_from('<HH',data,54);segments=[]
 for n in range(phnum):
  typ,flags,off,va,pa,sz,mem,align=struct.unpack_from('<IIQQQQQQ',data,phoff+phsize*n)
  if typ==1:segments.append((va,va+sz,off))
 def string(va):
  for lo,hi,off in segments:
   if lo<=va<hi:
    b=data[off+va-lo:off+va-lo+220].split(b'\0',1)[0]
    if 3<=len(b)<220 and all(31<c<127 or c in (9,10,13) for c in b):return repr(b.decode())
  return None
 rel=subprocess.run(['aarch64-linux-gnu-readelf','-rW',str(a.binary)],capture_output=True,text=True,check=True).stdout;got={}
 for line in rel.splitlines():
  fields=line.split()
  if len(fields)>=5 and re.fullmatch('[0-9a-fA-F]+',fields[0]) and fields[2] in ('R_AARCH64_GLOB_DAT','R_AARCH64_JUMP_SLOT'):got[int(fields[0],16)]=fields[4]
 raw=subprocess.run(['aarch64-linux-gnu-objdump','-d','--start-address='+a.start,'--stop-address='+a.stop,str(a.binary)],capture_output=True,text=True,check=True).stdout
 regs={};lines=['Heuristic literal/GOT annotations only; not a complete data-flow analysis.']
 for line in raw.splitlines():
  notes=[]
  if m:=re.search(r'\badrp\s+(x\d+),\s*([0-9a-f]+)',line):regs[m[1]]=int(m[2],16)
  elif m:=re.search(r'\badd\s+(x\d+),\s*(x\d+),\s*#0x([0-9a-f]+)',line):
   if m[2] in regs:
    regs[m[1]]=regs[m[2]]+int(m[3],16)
    if val:=string(regs[m[1]]):notes.append(val)
  elif m:=re.search(r'\bldr\s+(x\d+),\s*\[(x\d+)(?:,\s*#([0-9]+))?\]',line):
   addr=regs.get(m[2],-10**9)+int(m[3] or 0)
   if addr in got:notes.append('GOT '+got[addr])
   regs.pop(m[1],None)
  elif m:=re.search(r'\bmov\s+(x\d+),\s*(x\d+)',line):
   if m[2] in regs:regs[m[1]]=regs[m[2]]
   else:regs.pop(m[1],None)
  lines.append(line+('  ; '+ '; '.join(notes) if notes else ''))
 a.out.write_text('\n'.join(lines)+'\n');print(a.out.name,'lines',len(lines))
if __name__=='__main__':main()
