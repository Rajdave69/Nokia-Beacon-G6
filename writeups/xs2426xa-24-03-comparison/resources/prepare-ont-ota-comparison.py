#!/usr/bin/env python3
"""OFFLINE: prepare hash-only inputs for check-ont-ota-request. No network."""
import argparse,hashlib,json,os,struct
from pathlib import Path

def comparison(profile):
 values=[]
 for name in ('api_key','url'):
  value=profile[name]
  if not isinstance(value,str):raise ValueError('Expected string: '+name)
  raw=value.encode('ascii')
  if not raw or len(raw)>1024 or any(x<32 or x>126 for x in raw):raise ValueError('Expected nonempty bounded printable ASCII: '+name)
  values.append(struct.pack('<I',len(raw))+hashlib.sha256(raw).digest())
 return b''.join(values)

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--profile',required=True,type=Path);p.add_argument('--out',required=True,type=Path);a=p.parse_args()
 raw=comparison(json.loads(a.profile.read_text()))
 fd=os.open(a.out,os.O_WRONLY|os.O_CREAT|os.O_EXCL|os.O_NOFOLLOW,0o600)
 with os.fdopen(fd,'wb') as f:f.write(raw)
 print('Wrote 72 private comparison bytes; no credentials printed or network request made.')
if __name__=='__main__':main()
