#!/usr/bin/env python3
"""Decode original FIT-embedded G6 board resources offline, retaining full properties.
No device probing. Optional analysis DTB comparison finds owner/tool modifications.
"""
import argparse,hashlib,json,struct
from pathlib import Path

def tree(b):
    head=struct.unpack_from('>10I',b);assert head[0]==0xd00dfeed
    off=head[2];strings=b[head[3]:head[3]+head[8]];stack=[];nodes={}
    while True:
        typ=struct.unpack_from('>I',b,off)[0];off+=4
        if typ==1:
            end=b.index(b'\0',off);name=b[off:end].decode();off=(end+4)&~3;stack.append(name);nodes['/'+('/'.join(stack).lstrip('/'))]={}
        elif typ==2:stack.pop()
        elif typ==3:
            n,no=struct.unpack_from('>II',b,off);off+=8;name=strings[no:].split(b'\0',1)[0].decode();nodes['/'+('/'.join(stack).lstrip('/'))][name]=b[off:off+n];off=(off+n+3)&~3
        elif typ==4:pass
        elif typ==9:break
        else:raise ValueError(f'Bad FDT token {typ}')
    return nodes

def scalar(b,default):return int.from_bytes(b,'big') if b is not None else default

def describe(t):
    out={}
    for path,props in t.items():
        row={}
        for k,b in props.items():
            item={'hex':b.hex()}
            if b and any(b) and b.endswith(b'\0') and all(x in (0,9,10,13) or 32<=x<127 for x in b):item['strings']=[x.decode() for x in b.rstrip(b'\0').split(b'\0')]
            elif len(b)%4==0:item['cells']=list(struct.unpack('>'+str(len(b)//4)+'I',b))
            row[k]=item
        out[path]=row
    return out

def resources(t):
    out=[]
    for path,p in t.items():
        if 'reg' not in p:continue
        parent=path.rsplit('/',1)[0] or '/';anc=t.get(parent,{});ac=scalar(anc.get('#address-cells'),2);sc=scalar(anc.get('#size-cells'),1);width=(ac+sc)*4;b=p['reg'];names=p.get('reg-names',b'').rstrip(b'\0').split(b'\0');rows=[]
        if not width or len(b)%width:
            out.append(dict(path=path,address_cells=ac,size_cells=sc,raw_reg_hex=b.hex(),error='reg length incompatible with immediate parent cell counts; preserved without guessing'));continue
        for i in range(0,len(b),width):
            a=int.from_bytes(b[i:i+ac*4],'big');size=int.from_bytes(b[i+ac*4:i+width],'big');j=i//width;rows.append(dict(name=names[j].decode() if j<len(names) and names[j] else None,address=hex(a),size=hex(size)))
        out.append(dict(path=path,address_cells=ac,size_cells=sc,resources=rows))
    return out

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--fit',required=True,type=Path);ap.add_argument('--analysis-dtb',type=Path);ap.add_argument('--source',required=True);ap.add_argument('--out',required=True,type=Path);a=ap.parse_args();fit=a.fit.read_bytes();dtb=tree(fit)['/images/fdt@beacon_g6.dtb']['data'];t=tree(dtb)
    result=dict(scope='Original FIT board DTB, full property bytes, no execution. DT declarations are not physical-board probes.',source=a.source,fit_sha256=hashlib.sha256(fit).hexdigest(),dtb_bytes=len(dtb),dtb_sha256=hashlib.sha256(dtb).hexdigest(),nodes=describe(t),resources=resources(t))
    if a.analysis_dtb:
        bb=a.analysis_dtb.read_bytes();other=tree(bb);diff=[]
        for n in sorted(set(t)|set(other)):
            for k in sorted(set(t.get(n,{}))|set(other.get(n,{}))):
                x=t.get(n,{}).get(k);y=other.get(n,{}).get(k)
                if x!=y:diff.append(dict(node=n,property=k,original_hex=x.hex() if x is not None else None,analysis_hex=y.hex() if y is not None else None))
        result['analysis_copy_comparison']=dict(sha256=hashlib.sha256(bb).hexdigest(),differences=diff)
    a.out.write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(dict(nodes=len(t),dtb_sha256=result['dtb_sha256'],analysis_differences=[(x['node'],x['property']) for x in result.get('analysis_copy_comparison',{}).get('differences',[])])))
if __name__=='__main__':main()
