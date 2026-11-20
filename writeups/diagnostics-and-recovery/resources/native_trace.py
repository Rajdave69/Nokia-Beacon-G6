#!/usr/bin/env python3
"""Host-only AArch64 program-header disassembly, including sectionless ELF files.
Raw instructions/bytes are exact. Linear constant/import annotations are heuristic.
"""
import json,struct,re,subprocess
from pathlib import Path
from capstone import Cs,CS_ARCH_ARM64,CS_MODE_LITTLE_ENDIAN
from capstone.arm64_const import ARM64_OP_IMM,ARM64_OP_REG,ARM64_OP_MEM
class ELF:
 def __init__(self,path):
  self.path=Path(path);self.data=self.path.read_bytes()
  if self.data[:6]!=b'\x7fELF\x02\x01' or struct.unpack_from('<H',self.data,18)[0]!=183:raise ValueError('AArch64 ELF64 little endian required')
  phoff=struct.unpack_from('<Q',self.data,32)[0];size,n=struct.unpack_from('<HH',self.data,54)
  self.ph=[struct.unpack_from('<IIQQQQQQ',self.data,phoff+i*size) for i in range(n)]
  self.loads=[x for x in self.ph if x[0]==1];self.dt={}
  for row in self.ph:
   if row[0]==2:
    for off in range(row[2],row[2]+row[5],16):
     tag,val=struct.unpack_from('<qQ',self.data,off)
     if tag==0:break
     self.dt[tag]=val
  if 4 in self.dt:
   count=struct.unpack('<II',self.read(self.dt[4],8))[1]
  else:
   shoff=struct.unpack_from('<Q',self.data,40)[0];ss,sn=struct.unpack_from('<HH',self.data,58)
   sections=[struct.unpack_from('<IIQQQQIIQQ',self.data,shoff+i*ss) for i in range(sn)]
   dynsym=next(x for x in sections if x[1]==11);count=dynsym[5]//dynsym[9]
  strings=self.read(self.dt[5],self.dt[10]);self.syms=[]
  for i in range(count):
   row=struct.unpack('<IBBHQQ',self.read(self.dt[6]+i*self.dt.get(11,24),24));name=strings[row[0]:].split(b'\0',1)[0].decode(errors='replace')
   self.syms.append({'name':name,'info':row[1],'section':row[3],'va':row[4],'size':row[5]})
  self.relocs={}
  for addr,size in [(self.dt.get(7,0),self.dt.get(8,0)),(self.dt.get(23,0),self.dt.get(2,0))]:
   for pos in range(addr,addr+size,24):
    off,info,add=struct.unpack('<QQq',self.read(pos,24));self.relocs[off]=(info&0xffffffff,self.syms[info>>32]['name'],add)
  self.names={x['va']:x['name'] for x in self.syms if x['va'] and x['name']}
  self.code_start=self.dt.get(12,min(x[3] for x in self.loads if x[1]&1));self.code_end=self.dt.get(13,max(x[3]+x[5] for x in self.loads if x[1]&1))
 def read(self,va,n):
  for row in self.loads:
   if row[3]<=va and va+n<=row[3]+row[5]:return self.data[row[2]+va-row[3]:row[2]+va-row[3]+n]
  return b''
 def pointer(self,va,width=8):
  if va in self.relocs:
   typ,name,add=self.relocs[va]
   if typ==1027:return add
   if name:return '@'+name
  raw=self.read(va,width)
  return int.from_bytes(raw,'little') if len(raw)==width and any(raw) else None
 def literal(self,v):
  if not isinstance(v,int) or v<self.code_end:return None
  buf=self.read(v,1)
  if not buf:return None
  chars=bytearray()
  for i in range(400):
   q=self.read(v+i,1)
   if not q:return None
   if q==b'\0':return chars.decode('ascii') if chars else None
   if q[0] not in (9,10,13) and not 32<=q[0]<127:return None
   chars.extend(q)
  return None
 def instructions(self,start=None,end=None):
  md=Cs(CS_ARCH_ARM64,CS_MODE_LITTLE_ENDIAN);md.detail=True
  start=self.code_start if start is None else start;end=self.code_end if end is None else end
  result=list(md.disasm(self.read(start,end-start),start))
  if b''.join(i.bytes for i in result)!=self.read(start,end-start):raise ValueError('Incomplete decoding of requested range')
  return result
 def trace(self,start=None,end=None):
  insns=self.instructions(start,end);values={};lines=[];calls=[]
  def reg(i,r):
   s=i.reg_name(r);return 'x'+s[1:] if s.startswith('w') else s
  # Name normal PLT targets through their GOT relocation, including stripped code.
  shoff=struct.unpack_from('<Q',self.data,40)[0];ss,sn,si=struct.unpack_from('<HHH',self.data,58)
  sections=[struct.unpack_from('<IIQQQQIIQQ',self.data,shoff+i*ss) for i in range(sn)]
  names=sections[si];strings=self.data[names[4]:names[4]+names[5]]
  plt_section=next((x for x in sections if strings[x[0]:].split(b'\0',1)[0]==b'.plt'),None)
  byaddr={i.address:i for i in self.instructions(plt_section[3],plt_section[3]+plt_section[5])} if plt_section else {};plt={}
  for va,i in byaddr.items():
   if i.mnemonic=='adrp' and i.op_str.startswith('x16,'):
    j=byaddr.get(va+4)
    if j and j.mnemonic=='ldr' and len(j.operands)>1 and j.operands[1].type==ARM64_OP_MEM:
     got=i.operands[1].imm+j.operands[1].mem.disp;r=self.relocs.get(got)
     if r and r[1]:plt[va]=r[1]+'@plt'
  for i in insns:
   if i.mnemonic=='ret' or (i.mnemonic=='stp' and i.op_str.startswith('x29, x30, [sp')):values.clear()
   if i.address in self.names:lines.append('\n'+self.names[i.address]+':')
   op=i.mnemonic;ops=i.operands;note='';writes={reg(i,x) for x in i.regs_access()[1]};new={}
   if op in ('bl','blr'):
    target=self.names.get(ops[0].imm,plt.get(ops[0].imm,hex(ops[0].imm))) if ops[0].type==ARM64_OP_IMM else values.get(reg(i,ops[0].reg),'unknown')
    if isinstance(target,int):target=hex(target)
    args={}
    for n in range(8):
     v=values.get('x'+str(n))
     if v is not None:
      literal=self.literal(v);args['x'+str(n)]=literal if literal is not None else v
    calls.append({'va':hex(i.address),'target':target,'args':args});note=' ; heuristic '+str(target)+' '+json.dumps(args,ensure_ascii=True)
    for n in range(19):values.pop('x'+str(n),None)
   elif ops and ops[0].type==ARM64_OP_REG:
    dst=reg(i,ops[0].reg)
    if op in ('adr','adrp') and ops[1].type==ARM64_OP_IMM:new[dst]=ops[1].imm
    elif op in ('mov','movz','movn') and len(ops)>1:
     if ops[1].type==ARM64_OP_IMM:new[dst]=ops[1].imm
     elif ops[1].type==ARM64_OP_REG and reg(i,ops[1].reg) in values:new[dst]=values[reg(i,ops[1].reg)]
    elif op=='movk' and dst in values and isinstance(values[dst],int):
     shift=ops[1].shift.value;new[dst]=(values[dst]&~(65535<<shift))|(ops[1].imm<<shift)
    elif op in ('add','sub') and len(ops)>2 and ops[1].type==ARM64_OP_REG and ops[2].type==ARM64_OP_IMM:
     base=values.get(reg(i,ops[1].reg))
     if isinstance(base,int):new[dst]=base+(ops[2].imm<<ops[2].shift.value)*(1 if op=='add' else -1)
    elif op=='ldr' and len(ops)>1 and ops[1].type==ARM64_OP_MEM:
     base=values.get(reg(i,ops[1].mem.base))
     if isinstance(base,int) and not ops[1].mem.index:
      v=self.pointer(base+ops[1].mem.disp,4 if i.reg_name(ops[0].reg).startswith('w') else 8)
      if v is not None:new[dst]=v
   for dest in writes:values.pop(dest,None)
   values.update(new)
   lines.append(f'{i.address:08x}: {i.bytes.hex()}  {i.mnemonic} {i.op_str}'+note)
  return '\n'.join(lines)+'\n',calls

if __name__=='__main__':
 import argparse
 ap=argparse.ArgumentParser(description=__doc__)
 ap.add_argument('file',type=Path)
 ap.add_argument('--start',type=lambda x:int(x,0))
 ap.add_argument('--stop',type=lambda x:int(x,0))
 ap.add_argument('--out',required=True,type=Path)
 ap.add_argument('--calls',type=Path)
 args=ap.parse_args();elf=ELF(args.file)
 text,calls=elf.trace(args.start,args.stop);args.out.write_text(text)
 if args.calls:args.calls.write_text(json.dumps(calls,indent=2)+'\n')
 print(json.dumps({'file':args.file.name,'instructions':len(elf.instructions(args.start,args.stop)),'scope':'host-only file decoding; target firmware not executed'}))
