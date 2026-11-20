#!/usr/bin/env python3
"""Complete bounded objdump with heuristic constant-string call annotations.

Annotations are local linear tracking, not control-flow/decompiler evidence.
Original instructions are retained; examine branches and calls independently.
"""
import argparse,re,struct,subprocess
from pathlib import Path

def trace(path,start,stop):
    data=path.read_bytes()
    if data[:6] != b"\x7fELF\x02\x01": raise ValueError("ELF64 little endian required")
    phoff=struct.unpack_from("<Q",data,32)[0]; ents,num=struct.unpack_from("<HH",data,54)
    segments=[]
    for n in range(num):
        row=struct.unpack_from("<IIQQQQQQ",data,phoff+n*ents)
        if row[0]==1:segments.append((row[3],row[2],row[5]))
    # Only annotate literals in read-only constant sections. A small integer can
    # happen to point into ELF symbol/string tables; it is not a string argument.
    shoff=struct.unpack_from("<Q",data,40)[0]
    shents,shnum,shstr=struct.unpack_from("<HHH",data,58)
    sections=[struct.unpack_from("<IIQQQQIIQQ",data,shoff+n*shents) for n in range(shnum)]
    names_row=sections[shstr];names=data[names_row[4]:names_row[4]+names_row[5]]
    rodata=[]
    for row in sections:
        name=names[row[0]:].split(b"\0",1)[0]
        if name.startswith(b".rodata"):rodata.append((row[3],row[3]+row[5]))
    def read(va,size):
        for base,off,length in segments:
            if base<=va and va+size<=base+length:return data[off+va-base:off+va-base+size]
        return b""
    def literal(va):
        if not any(a<=va<b for a,b in rodata):return None
        raw=read(va,1)
        if not raw:return None
        chars=bytearray()
        for n in range(250):
            q=read(va+n,1)
            if not q:return None
            if q==b"\0":break
            if q[0] not in (9,10,13) and not 32<=q[0]<127:return None
            chars.extend(q)
        else:return None  # No terminated literal inside the bounded lookup.
        if not chars:return None
        return repr(bytes(chars).decode("ascii"))
    def reg(name):return "x"+name[1:] if name.startswith("w") else name
    text=subprocess.check_output(["aarch64-linux-gnu-objdump","-d",f"--start-address={start}",f"--stop-address={stop}",str(path)],text=True)
    values={};out=[]
    for line in text.splitlines():
        m=re.match(r"\s*([0-9a-f]+):\s+[0-9a-f]+\s+(\S+)\s*(.*)",line)
        note=""
        if m:
            op,oper=m[2],m[3].split("//")[0].strip()
            parts=[x.strip() for x in oper.split(",")]
            dest=reg(parts[0]) if parts else ""
            old=values.get(dest)
            if op in ("adrp","adr") and len(parts)>=2:
                try:values[dest]=int(parts[1].split()[0],16)
                except ValueError:values.pop(dest,None)
            elif op in ("mov","movz","movk") and len(parts)>=2:
                operand=parts[1]
                if operand.startswith("#"):
                    val=int(operand[1:],0);shift=int(parts[2].split("#")[-1],0) if len(parts)>2 else 0
                    if op=="movk" and old is None:values.pop(dest,None)
                    else:values[dest]=((old or 0)&~(0xffff<<shift))|(val<<shift) if op=="movk" else val<<shift
                elif reg(operand) in values:values[dest]=values[reg(operand)]
                else:values.pop(dest,None)
            elif op in ("add","sub") and len(parts)>=3:
                base=values.get(reg(parts[1]));operand=parts[2]
                if base is not None and operand.startswith("#"):
                    value=int(operand[1:],0);shift=int(parts[3].split("#")[-1],0) if len(parts)>3 else 0
                    values[dest]=base+(value<<shift)*(1 if op=="add" else -1)
                else:values.pop(dest,None)
            elif op in ("ldr","ldrsw") and len(parts)>=2:
                q=re.match(r"(?:x|w)\d+,\s*\[(x\d+)(?:,\s*#(0x[0-9a-f]+|[0-9]+))?\]$",oper)
                if q and q[1] in values:
                    size=4 if op=="ldrsw" or parts[0].startswith("w") else 8
                    raw=read(values[q[1]]+int(q[2] or "0",0),size)
                    if len(raw)==size and any(raw):values[dest]=int.from_bytes(raw,"little",signed=op=="ldrsw")
                    else:values.pop(dest,None)
                else:values.pop(dest,None)
            elif op in ("bl","blr"):
                args=[]
                for n in range(8):
                    key=f"x{n}"
                    if key in values:
                        v=values[key];s=literal(v)
                        if s is not None:args.append(key+"="+s)
                        elif 0<=v<65536:args.append(key+"="+str(v))
                if args:note=" ; heuristic args: "+", ".join(args)
                for n in range(19):values.pop(f"x{n}",None)
            elif dest.startswith("x") and dest[1:].isdigit() and not op.startswith(("b","cb","tb","st","cmp","cmn","tst","ret")):
                values.pop(dest,None)
        out.append(line+note)
    return "\n".join(out).replace(str(path),path.name)+"\n"

def main():
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument("file",type=Path);ap.add_argument("start",type=lambda s:int(s,0));ap.add_argument("stop",type=lambda s:int(s,0));ap.add_argument("output",type=Path);a=ap.parse_args()
    a.output.write_text(trace(a.file,a.start,a.stop))
if __name__=="__main__":main()
