#!/usr/bin/env python3
"""Reconstruct sec_extfs source5 from private SecGetData probe output.

Input is JSON mapping factory names to hexadecimal DECODED C-string bytes,
not the raw flag1/flag2 stored representations. Output is secret material.
No router/native function, SE initialization, network or config import is run.
"""
import argparse,base64,hashlib,json,os
from pathlib import Path
NAMES=('EXT_WEB_PWD','EXT_WEB_MGNT_PWD','EXT_SSID1_PWD','EXT_SSID5_PWD',
       'EXT_SSID9_PWD','EXT_ACS_PWD','EXT_MD5_VAR','EXT_SHA256_VAR',
       'EXT_SHA256CUS_VAR','EXT_RANDOM_VAR')
def reconstruct(decoded):
    selected=[]
    for name in NAMES:
        if name not in decoded:continue
        value=bytes.fromhex(decoded[name]).split(b'\0',1)[0]
        if 1<=len(value)<=63:selected.append((name,value))
    if not selected:raise ValueError('No accepted factory data; native sec_extfs would fail rather than hash an empty selection')
    return base64.b64encode(hashlib.sha256(b''.join(v for _,v in selected)).digest()),selected
def main():
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('decoded_fields_json',type=Path);ap.add_argument('output',type=Path);a=ap.parse_args()
    if a.decoded_fields_json.stat().st_size>65536:raise ValueError('Input exceeds bound')
    result,selected=reconstruct(json.loads(a.decoded_fields_json.read_text(encoding='utf-8')))
    fd=os.open(a.output,os.O_WRONLY|os.O_CREAT|os.O_EXCL,0o600)
    with os.fdopen(fd,'wb') as f:f.write(result)
    print(json.dumps({'output':str(a.output),'bytes':len(result),'accepted_fields':[{'name':n,'decoded_bytes':len(v)} for n,v in selected],'scope':'Source bytes written privately; no key values printed.'},indent=2))
if __name__=='__main__':main()
