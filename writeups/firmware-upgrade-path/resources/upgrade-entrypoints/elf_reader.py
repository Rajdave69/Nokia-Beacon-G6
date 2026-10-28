import struct, pathlib, re, subprocess
from capstone import *
from capstone.arm64 import *
class Elf:
 def __init__(self,path):
  self.path=pathlib.Path(path);self.d=self.path.read_bytes();self.bits=self.d[4]
  if self.bits==2:
   e=struct.unpack_from('<16sHHIQQQIHHHHHH',self.d); self.entry=e[4];self.ph=[struct.unpack_from('<IIQQQQQQ',self.d,e[5]+i*e[9]) for i in range(e[10])];self.sh=[struct.unpack_from('<IIQQQQIIQQ',self.d,e[6]+i*e[11]) for i in range(e[12])]
  else:
   e=struct.unpack_from('<16sHHIIIIIHHHHHH',self.d);self.entry=e[4];self.ph=[];self.sh=[]
   for i in range(e[10]):
    p=struct.unpack_from('<IIIIIIII',self.d,e[5]+i*e[9]);self.ph.append((p[0],p[6],p[1],p[2],p[3],p[4],p[5],p[7]))
  self.syms={};self.reloc={};self.plt={};self.sections={}
  if self.sh:
   names=self.sh[e[13]];st=self.d[names[4]:names[4]+names[5]]
   for s in self.sh:
    self.sections[st[s[0]:].split(b'\0')[0].decode()]=s
    if s[1] in (2,11):
     names=self.sh[s[6]];ss=self.d[names[4]:names[4]+names[5]];lst=[]
     for p in range(s[4],s[4]+s[5],s[9] or 24):
      a=struct.unpack_from('<IBBHQQ',self.d,p);n=ss[a[0]:].split(b'\0')[0].decode();lst.append((n,a[4],a[5]));self.syms[n]=(a[4],a[5])
     if s[1]==11:self.dyn=lst
   for s in self.sh:
    if s[1]==4:
     for p in range(s[4],s[4]+s[5],s[9] or 24):
      va,info,add=struct.unpack_from('<QQq',self.d,p);typ=info&0xffffffff;idx=info>>32
      self.reloc[va]=(self.dyn[idx][0],add,typ)
   if '.rela.plt' in self.sections:
    s=self.sections['.rela.plt'];a=self.sections['.plt'][3]+32
    for p in range(s[4],s[4]+s[5],24):
     va,info,add=struct.unpack_from('<QQq',self.d,p);self.plt[a]=self.dyn[info>>32][0];a+=16
 def off(self,va):
  for p in self.ph:
   if p[0]==1 and p[3]<=va<p[3]+p[5]:return p[2]+va-p[3]
  raise ValueError(hex(va))
 def read(self,va,n):
  o=self.off(va);return self.d[o:o+n]
 def cstr(self,va):
  try:
   b=self.read(va,250).split(b'\0')[0]
   return b.decode() if b and all(32<=x<127 or x in (9,10,13) for x in b) else ''
  except:return ''
 def name(self,va):
  if va in self.plt:return self.plt[va]+'@plt'
  for n,(a,z) in self.syms.items():
   if va==a and a:return n
  return ''
 def dis(self,start,end):
  md=Cs(CS_ARCH_ARM64,CS_MODE_LITTLE_ENDIAN);md.detail=True
  return md.disasm(self.read(start,end-start),start)
 def annotate(self,start,end):
  regs={}
  for i in self.dis(start,end):
   op=i.operands;comment=[];dest=op[0].reg if op and op[0].type==ARM64_OP_REG else None;val=None
   if i.mnemonic in ('adrp','adr'):val=op[1].imm
   elif i.mnemonic=='add' and len(op)==3 and op[1].type==ARM64_OP_REG and op[2].type==ARM64_OP_IMM:
    if op[1].reg in regs:val=regs[op[1].reg]+op[2].imm
   elif i.mnemonic=='mov' and len(op)>1:
    if op[1].type==ARM64_OP_IMM:val=op[1].imm
    elif op[1].type==ARM64_OP_REG:val=regs.get(op[1].reg)
   elif i.mnemonic=='ldr' and len(op)>1 and op[1].type==ARM64_OP_MEM:
    m=op[1].mem
    if m.base in regs and not m.index:
     a=regs[m.base]+m.disp
     if a in self.reloc:
      n,add,t=self.reloc[a];comment.append('GOT '+(n or hex(add)))
      if t==1027:val=add
     else:
      try:val=int.from_bytes(self.read(a,8),'little')
      except:pass
   if val is not None:
    regs[dest]=val
    if i.mnemonic in ('adr','add','ldr'):
     s=self.cstr(val)
     if s:comment.append(repr(s))
   elif dest is not None and i.mnemonic not in ('cmp','tst','str','stp','cbz','cbnz','tbz','tbnz'):regs.pop(dest,None)
   if i.mnemonic in ('bl','b') and op and op[0].type==ARM64_OP_IMM:
    n=self.name(op[0].imm)
    if n:comment.append(n)
   if i.mnemonic=='blr' and op[0].reg in regs:comment.append(self.name(regs[op[0].reg]) or hex(regs[op[0].reg]))
   yield f'{i.address:08x}: {i.mnemonic:8} {i.op_str:38} '+(' ; '+' | '.join(comment) if comment else '')
   if i.mnemonic in ('bl','blr'):
    for r in range(ARM64_REG_X0,ARM64_REG_X18+1):regs.pop(r,None)
 def xrefs(self,targets):
  for n,s in self.sections.items():
   if n!='.text':continue
   regs={}
   for i in self.dis(s[3],s[3]+s[5]):
    o=i.operands;val=None
    if i.mnemonic in ('adrp','adr'):val=o[1].imm
    elif i.mnemonic=='add' and len(o)==3 and o[1].type==ARM64_OP_REG and o[2].type==ARM64_OP_IMM and o[1].reg in regs:val=regs[o[1].reg]+o[2].imm
    if val is not None:
     regs[o[0].reg]=val
     if val in targets:print(hex(i.address),hex(val),repr(self.cstr(val)))
    elif i.mnemonic in ('bl','blr'):
     for r in range(ARM64_REG_X0,ARM64_REG_X18+1):regs.pop(r,None)
if __name__=='__main__':
 import sys
 e=Elf(sys.argv[1]);mode=sys.argv[2]
 if mode=='dis':
  for line in e.annotate(int(sys.argv[3],0),int(sys.argv[4],0)):print(line)
 elif mode=='xref':
  targets=[]
  for needle in sys.argv[3:]:
   b=needle.encode();pos=0
   while (pos:=e.d.find(b,pos))>=0:
    for p in e.ph:
     if p[0]==1 and p[2]<=pos<p[2]+p[5]:targets.append(p[3]+pos-p[2])
    pos+=1
  e.xrefs(set(targets))
