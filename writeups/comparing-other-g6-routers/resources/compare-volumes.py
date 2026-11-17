#!/usr/bin/env python3
"""Compare used UBI payload bytes without executing or modifying firmware."""
from pathlib import Path as _PublicationPath
import json as _publication_json
import re as _publication_re

def _publication_input(alias):
    project = next(p for p in _PublicationPath(__file__).resolve().parents
                   if (p / 'writeups').is_dir())
    registry = (project / 'writeups/README.private.md').read_text(encoding='utf-8')
    payload = _publication_re.search(r'```json\s*\n(.*?)\n```', registry, _publication_re.S)
    return _publication_json.loads(payload[1])['private_values'][alias]

import argparse,hashlib,json,struct,zlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
def volumes(path):
 data=path.read_bytes();maps={}
 for off in range(0,len(data),0x40000):
  if data[off:off+4]!=b'UBI#':continue
  v,d=struct.unpack_from('>II',data,off+16);h=data[off+v:off+v+64]
  if h[:4]!=b'UBI!':continue
  assert zlib.crc32(data[off:off+60])^0xffffffff==struct.unpack_from('>I',data,off+60)[0]
  assert zlib.crc32(h[:60])^0xffffffff==struct.unpack_from('>I',h,60)[0]
  vol,logical=struct.unpack_from('>II',h,8)
  if vol not in (0,1,3):continue
  size,_,pad,crc=struct.unpack_from('>4I',h,20);seq=struct.unpack_from('>Q',h,40)[0]
  block=data[off+d:off+0x40000-pad]
  if h[5]==2:
   block=block[:size];assert zlib.crc32(block)^0xffffffff==crc
  current=maps.setdefault(vol,{})
  if logical not in current or current[logical][0]<seq:current[logical]=(seq,block)
 out={}
 for vol,blocks in maps.items():
  assert set(blocks)==set(range(max(blocks)+1))
  payload=b''.join(blocks[k][1] for k in sorted(blocks))
  if payload[:4]==b'hsqs':used=struct.unpack_from('<Q',payload,40)[0];kind='SquashFS'
  elif payload[:4]==bytes.fromhex('d00dfeed'):used=struct.unpack_from('>I',payload,4)[0];kind='FIT/FDT'
  else:raise ValueError('Unknown expected payload magic')
  assert used<=len(payload);out[str(vol)]={'used_bytes':used,'sha256':hashlib.sha256(payload[:used]).hexdigest(),'format':kind,'logical_blocks':len(blocks)}
 return out

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--report',type=Path,required=True);a=ap.parse_args()
 if a.report.exists():raise FileExistsError('Use a new report')
 profiles={}
 for label,directory in [('second',ROOT/_publication_input('RESEARCH-INPUT-2367D399A560')),('fourth',ROOT/_publication_input('RESEARCH-INPUT-12563C160183'))]:
  for bank in (0,1):
   p=directory/f'mtd0{bank+3}_rootfs{bank}.bin';profiles[label+str(bank)]={'source':str(p),'volumes':volumes(p)}
 equality={str(bank):{str(vol):profiles['second'+str(bank)]['volumes'][str(vol)]==profiles['fourth'+str(bank)]['volumes'][str(vol)] for vol in (0,1,3)} for bank in (0,1)}
 assert all(v for row in equality.values() for v in row.values())
 report={'scope':'EC/VID CRCs, static-data CRCs, contiguous LEB reconstruction and used-byte hashing. No FIT signature verification, firmware execution or boot test.','profiles':profiles,'fourth_equals_second_by_bank_and_volume':equality}
 a.report.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(equality,indent=2))
if __name__=='__main__':main()
