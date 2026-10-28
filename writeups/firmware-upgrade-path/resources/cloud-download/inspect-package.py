#!/usr/bin/env python3
"""Offline G6 Nokia-container/UBI inspection. Writes new files only; never flashes.
This reader is specific to the downloaded G6 format and NAND geometry, not B9.
"""
import argparse,hashlib,json,os,re,struct
from pathlib import Path

def write_new(p,data):
 fd=os.open(p,os.O_WRONLY|os.O_CREAT|os.O_EXCL,0o600)
 with os.fdopen(fd,'wb') as f:f.write(data)
def ident(data):return {'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()}
def used(data):
 if data[:4]==b'hsqs':n=struct.unpack_from('<Q',data,40)[0]
 elif data[:4]==b'\xd0\x0d\xfe\xed':n=struct.unpack_from('>I',data,4)[0]
 else:return data
 if n<40 or n>len(data):raise ValueError('Invalid filesystem/FIT used size')
 return data[:n]
def inspect(source,out,baseline=None):
 out=Path(out);out.mkdir(parents=True,exist_ok=False,mode=0o700);whole=Path(source).read_bytes();report={'source':str(source),'source_identity':ident(whole),'scope':'Offline pure-Python extraction/hash comparison; no firmware process or hardware access','outer_directory':[],'components':{},'volumes':{}}
 firmware=whole
 if whole[-4:]==b'3RDP':
  n=struct.unpack_from('>I',whole,len(whole)-8)[0]
  if n%12 or n>len(whole)-8:raise ValueError('Invalid outer directory')
  for off in range(len(whole)-8-n,len(whole)-8,12):
   typ,start,size=struct.unpack_from('>III',whole,off)
   if start+size>len(whole)-8-n:raise ValueError('Outer segment out of bounds')
   report['outer_directory'].append({'type':typ,'offset':start,'bytes':size})
   if typ==1:firmware=whole[start:start+size]
 pos=0;parts={}
 while pos<len(firmware):
  if firmware[pos:pos+5]!=b'NOKIA' or pos+77>len(firmware):raise ValueError('Invalid inner subimage header')
  tag=firmware[pos+5:pos+37].split(b'\0',1)[0].decode('ascii');expected=firmware[pos+37:pos+69].decode('ascii');size,start=struct.unpack_from('<II',firmware,pos+69)
  if not re.fullmatch('[A-Za-z0-9_.-]{1,32}',tag) or start!=pos+77 or start+size>len(firmware):raise ValueError('Invalid inner subimage extent')
  content=firmware[start:start+size];digest=hashlib.md5(content).hexdigest()
  if digest!=expected:raise ValueError('Subimage MD5 mismatch: '+tag)
  write_new(out/(tag+'.bin'),content);parts[tag]=content
  report['components'][tag]={**ident(content),'header_offset':pos,'data_offset':start,'md5':digest,'subimage_md5_matches':True};pos=start+size
 report['contains_boot_tag']='boot' in parts
 if 'imginfo' in parts:report['image_info']=parts['imginfo'].split(b'\xff',1)[0].decode('ascii').strip()
 if 'rootfs' in parts:
  data=parts['rootfs'];peb=262144;vols={}
  if len(data)%peb:raise ValueError('Rootfs is not aligned to G6 PEB size')
  for off in range(0,len(data),peb):
   block=data[off:off+peb]
   if block[:4]!=b'UBI#':continue
   vid,dataoff=struct.unpack_from('>II',block,16);header=block[vid:vid+64]
   if header[:4]!=b'UBI!':continue
   vol,lnum=struct.unpack_from('>II',header,8)
   if vol>=0x7fffefff:continue
   size=struct.unpack_from('>I',header,20)[0];seq=struct.unpack_from('>Q',header,40)[0];body=block[dataoff:]
   if header[5]==2:body=body[:size]
   current=vols.setdefault(vol,{})
   if lnum not in current or seq>current[lnum][0]:current[lnum]=(seq,body)
  for vol,blocks in sorted(vols.items()):
   if sorted(blocks)!=list(range(max(blocks)+1)):raise ValueError('Non-contiguous UBI volume LEBs')
   body=b''.join(blocks[n][1] for n in range(max(blocks)+1));content=used(body);write_new(out/('volume-'+str(vol)+'.bin'),content)
   info={**ident(content),'LEBs':len(blocks),'magic':content[:4].hex()}
   original={0:'mtd12_fit.bin',1:'mtd13_rootfs.bin',3:'mtd14_wifi_fw.bin'}.get(vol)
   if baseline and original and (Path(baseline)/original).is_file():
    ref=used((Path(baseline)/original).read_bytes());info.update(baseline_file=original,baseline_used_identity=ident(ref),matches_baseline=ref==content)
   report['volumes'][str(vol)]=info
 write_new(out/'inspection.json',json.dumps(report,indent=2).encode());return report
if __name__=='__main__':
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--image',required=True);p.add_argument('--out',required=True);p.add_argument('--baseline');a=p.parse_args();print(json.dumps(inspect(a.image,a.out,a.baseline),indent=2))
