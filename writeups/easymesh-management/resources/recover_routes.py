#!/usr/bin/env python3
"""Recover ECD REST registrations from saved AArch64 code; never runs firmware."""
import argparse,json,re
from pathlib import Path
from capstone import Cs,CS_ARCH_ARM64,CS_MODE_LITTLE_ENDIAN
from capstone.arm64_const import ARM64_OP_REG,ARM64_OP_IMM,ARM64_OP_MEM
from native_trace import ELF
METHODS={0:'DELETE',1:'GET',2:'HEAD',3:'POST',4:'PUT',5:'CONNECT',6:'OPTIONS',7:'TRACE'}

def code_xrefs(elf,targets):
    md=Cs(CS_ARCH_ARM64,CS_MODE_LITTLE_ENDIAN);values={};refs=[];function_start=elf.code_start
    for i in md.disasm(elf.read(elf.code_start,elf.code_end-elf.code_start),elf.code_start):
        op=i.mnemonic;arg=i.op_str
        if op=='stp' and arg.startswith('x29, x30, [sp'):function_start=i.address
        a=re.fullmatch(r'(x\d+), #(0x[0-9a-f]+|[0-9]+)',arg)
        b=re.fullmatch(r'(x\d+), (x\d+), #(0x[0-9a-f]+|[0-9]+)(?:, lsl #([0-9]+))?',arg)
        if op in ['adr','adrp'] and a:values[a[1]]=int(a[2],0)
        elif op=='add' and b:
            source=values.get(b[2]);values.pop(b[1],None)
            if source is not None:
                value=source+(int(b[3],0)<<int(b[4] or 0));values[b[1]]=value
                if value in targets:refs.append({'route':targets[value],'literal_va':hex(value),'code_ref':hex(i.address),'register':b[1],'initializer_start':hex(function_start)})
        elif op in ['bl','blr']:
            for n in range(19):values.pop('x'+str(n),None)
        elif op=='ret' or (op=='stp' and arg.startswith('x29, x30')):values.clear()
        elif op not in ['str','stp','stur','cmp','cmn','tst','cbz','cbnz','tbz','tbnz','b','br'] and not op.startswith('b.'):
            first=arg.split(',',1)[0]
            if re.fullmatch(r'[xw]\d+',first):values.pop('x'+first[1:],None)
    return refs

def register_values(elf,ref,register_address):
    pc=int(ref['code_ref'],16);instructions=elf.instructions(int(ref.get('initializer_start',hex(pc-32)),16),pc+640)
    end=next((i.address for i in instructions if i.mnemonic=='bl' and i.operands[0].imm==register_address and i.address>pc),None)
    if end is None:return None
    vals={'x29':('frame',0),'fp':('frame',0),'sp':('frame',0)};stack={}
    def reg(i,r):
        name=i.reg_name(r)
        return 'x'+name[1:] if name.startswith('w') else name
    for i in instructions:
        op=i.mnemonic;ops=i.operands
        if i.address>end:break
        if op in ['adr','adrp'] and len(ops)==2:vals[reg(i,ops[0].reg)]=ops[1].imm
        elif op in ['mov','movz'] and len(ops)>1:vals[reg(i,ops[0].reg)]=ops[1].imm if ops[1].type==ARM64_OP_IMM else vals.get(reg(i,ops[1].reg))
        elif op in ['add','sub'] and len(ops)>2 and ops[2].type==ARM64_OP_IMM:
            v=vals.get(reg(i,ops[1].reg));delta=(ops[2].imm<<ops[2].shift.value)*(1 if op=='add' else -1)
            vals[reg(i,ops[0].reg)]=v+delta if isinstance(v,int) else ('frame',v[1]+delta) if isinstance(v,tuple) else None
        elif op=='ldr' and len(ops)>1 and ops[1].type==ARM64_OP_MEM:
            base=vals.get(reg(i,ops[1].mem.base));delta=ops[1].mem.disp
            vals[reg(i,ops[0].reg)]=elf.pointer(base+delta) if isinstance(base,int) else stack.get(base[1]+delta) if isinstance(base,tuple) else None
        elif op in ['str','stp']:
            mem=ops[-1]
            if mem.type==ARM64_OP_MEM:
                base=vals.get(reg(i,mem.mem.base))
                if isinstance(base,tuple):
                    for index,o in enumerate(ops[:-1]):
                        if o.type==ARM64_OP_REG:stack[base[1]+mem.mem.disp+index*8]=vals.get(reg(i,o.reg))
        elif op in ['bl','blr']:
            if i.address==end:
                pointer=vals.get('x2');callback=stack.get(pointer[1]) if isinstance(pointer,tuple) else None;enum=vals.get('x0')
                return dict(ref,register_call=hex(end),HTTP_method=METHODS.get(enum,str(enum)),HTTP_method_enum=enum,handler=hex(callback) if isinstance(callback,int) else callback,callback_stack_offset=pointer[1] if isinstance(pointer,tuple) else None)
            for n in range(19):vals.pop('x'+str(n),None)
        else:
            for written in i.regs_access()[1]:
                name=reg(i,written)
                if name not in ['x29','fp']:vals.pop(name,None)
    return None

def recover(binary,register_address):
    elf=ELF(binary);targets={}
    for match in re.finditer(rb'(?<![ -~])(/(?:1|debug)/[ -~]+|/quit)\x00',elf.data):
        off=match.start(1);value=match[1].decode()
        for segment in elf.loads:
            if segment[2]<=off<segment[2]+segment[5]:targets[segment[3]+off-segment[2]]=value;break
    refs=code_xrefs(elf,targets);rows=[r for x in refs if (r:=register_values(elf,x,register_address)) is not None]
    return {'schema_version':1,'scope':'Static initializer registrations recovered by bounded symbolic tracking; exact native registrations must be retained/validated. Not a live API or complete built-in runtime-route guarantee.','register_function':hex(register_address),'route_literals':[{'va':hex(k),'route':v} for k,v in targets.items()],'code_xrefs':refs,'registrations':rows}

if __name__=='__main__':
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--binary',required=True,type=Path);ap.add_argument('--register-function',required=True,type=lambda x:int(x,0));ap.add_argument('--out',required=True,type=Path);a=ap.parse_args();result=recover(a.binary,a.register_function);a.out.write_text(json.dumps(result,indent=2)+'\n');print(json.dumps({'route_literals':len(result['route_literals']),'code_xrefs':len(result['code_xrefs']),'registrations':len(result['registrations']),'unresolved_handlers':sum(not x['handler'] for x in result['registrations'])}))
