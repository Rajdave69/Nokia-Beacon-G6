#!/usr/bin/env python3
"""Read-only fourth-G6 capture comparison. Secret values are never emitted."""
from pathlib import Path as _PublicationPath
import json as _publication_json
import re as _publication_re

def _publication_input(alias):
    project = next(p for p in _PublicationPath(__file__).resolve().parents
                   if (p / 'writeups').is_dir())
    registry = (project / 'writeups/README.private.md').read_text(encoding='utf-8')
    payload = _publication_re.search(r'```json\s*\n(.*?)\n```', registry, _publication_re.S)
    return _publication_json.loads(payload[1])['private_values'][alias]

import argparse,ctypes,ctypes.util,hashlib,importlib.util,json,re,struct,zipfile,zlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
def load(path,name):
 spec=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
def fp(p):
 data=p.read_bytes();return {'source':str(p),'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()}
def ri_field(data,name):
 out=[]
 for block in range(0,len(data),0x40000):
  for pos in range(block,min(block+0x2000,len(data)),128):
   if data[pos:pos+64].split(b'\0',1)[0]==name.encode():out.append(data[pos+64:pos+128].split(b'\0',1)[0])
 if out and len(set(out))!=1:raise ValueError('inconsistent RI '+name)
 return out[0] if out else None

def main():
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--capture',type=Path,required=True);ap.add_argument('--private-output',type=Path,required=True);ap.add_argument('--report',type=Path,required=True);a=ap.parse_args()
 if a.report.exists():raise FileExistsError('Use a new report path')
 a.private_output.mkdir(parents=True,mode=0o700,exist_ok=True)
 recover=load(ROOT/'writeups/storage-and-flash/resources/recover-g6-rootfs.py','recover');factory=load(ROOT/'writeups/comparing-other-g6-routers/resources/compare-g6-key-material.py','factory')
 out={'schema_version':1,'verified_on':'2026-10-26','scope':'Offline file inspection only; no router/network contact, native firmware execution, imports or flash writes.','owner_statement':'I did not change anything.','capture':{},'firmware':{},'bootloader':{}}
 manifest={name:digest for digest,name in (line.split(None,1) for line in (a.capture/'SHA256SUMS.txt').read_text().splitlines() if line.strip())}
 parts={}
 for p in sorted(a.capture.glob('mtd*.bin')):
  x=fp(p);x['manifest_match']=x['sha256']==manifest.get(p.name);assert x['manifest_match'];parts[p.name]=x
 out['capture']={'directory':str(a.capture),'partitions':parts,'physical_main_area_bytes':sum(x['bytes'] for x in parts.values()),'manifest_all_match':True,'metadata':fp(a.capture/'router-metadata.txt')}
 archive=a.capture/'beacon-g6-clean-dumps.zip'
 with zipfile.ZipFile(archive) as z:
  assert z.testzip() is None
  checked=[]
  for info in z.infolist():
   name=Path(info.filename).name
   if name in parts:
    digest=hashlib.sha256(z.read(info)).hexdigest();assert digest==parts[name]['sha256'];checked.append(name)
  assert set(checked)==set(parts)
  out['capture']['ZIP']={**fp(archive),'member_CRC_all_pass':True,'partition_members_SHA256_match':len(checked),'entries':len(z.infolist())}
 baseline=json.loads((ROOT/'knowledgebases/comparing-other-g6-routers-evidence.json').read_text())['second_device_and_builds']['rootfs_payloads']
 for name in ('mtd03_rootfs0.bin','mtd04_rootfs1.bin'):
  data=(a.capture/name).read_bytes();image=recover.recover_image(data);digest=hashlib.sha256(image).hexdigest()
  profile=next((k for k,v in baseline.items() if v['sha256']==digest),None)
  target=a.private_output/(name+'.squashfs');
  if target.exists():assert target.read_bytes()==image,'Existing derived image differs; refusing overwrite'
  else:
   with target.open('xb') as f:f.write(image)
  out['firmware'][name]={'used_squashfs':fp(target),'matches_existing_profile':profile,'used_bytes':len(image),'squashfs_created_epoch':struct.unpack_from('<I',image,8)[0]}
  headers={};bad=0
  for off in range(0,len(data),0x40000):
   if data[off:off+4]!=b'UBI#':continue
   vid_off=struct.unpack_from('>I',data,off+16)[0];vid=data[off+vid_off:off+vid_off+64]
   if vid[:4]!=b'UBI!':continue
   for h in (data[off:off+64],vid):bad+=((zlib.crc32(h[:60])^0xffffffff)!=struct.unpack_from('>I',h,60)[0])
   vol,lnum=struct.unpack_from('>II',vid,8);headers.setdefault(str(vol),[]).append(lnum)
  out['firmware'][name]['UBI_headers']={'CRC_failures':bad,'logical_blocks_by_volume':{k:len(set(v)) for k,v in headers.items()}};assert bad==0
 envdata=(a.capture/'mtd01_uboot-env.bin').read_bytes();envs=[]
 whitelist={'active_part','standby_part','img_active','img_commit','img_executed','img_version0','img_version1','cfg_partition','bootcmd','boot_fail_count','factory_reset_flag','bootfail0','bootfail1','secboot','sb_flag','mount_configs_fail','mount_logs_fail','mount_opt_fail','console'}
 for off in (0,0x100000):
  buf=envdata[off:off+0x20000];valid=zlib.crc32(buf[5:])==struct.unpack_from('<I',buf)[0];assert valid
  text=buf[5:].split(b'\0\0',1)[0];env=dict(v.split(b'=',1) for v in text.split(b'\0') if b'=' in v)
  envs.append({'offset':hex(off),'CRC_valid':valid,'record_bytes':len(buf),'redundancy_flag':buf[4],'safe_fields':{k.decode():v.decode() for k,v in env.items() if k.decode() in whitelist},'environment_names':sorted(k.decode() for k in env),'console_present':b'console' in env})
 out['bootloader']['environment_records']=envs
 refs={'first':ROOT/_publication_input('RESEARCH-INPUT-D8C073BA3F6B'),'second':ROOT/_publication_input('RESEARCH-INPUT-2367D399A560'),'third':ROOT/_publication_input('RESEARCH-INPUT-F75B7175E325')}
 # First unit's bootloader also has a manual extra dump in its saved capture; use the pinned evidence hash.
 prior=json.loads((ROOT/'knowledgebases/comparing-other-g6-routers-evidence.json').read_text())['third_device']
 out['bootloader']['whole_SSB_sha256']=parts['mtd00_ssb.bin']['sha256']
 out['bootloader']['whole_SSB_equals_first_and_third']=parts['mtd00_ssb.bin']['sha256']==prior['capture']['partition_files']['mtd00_ssb.bin']['sha256']
 secondssb=refs['second']/'mtd00_ssb.bin';out['bootloader']['whole_SSB_equals_second']=secondssb.exists() and fp(secondssb)['sha256']==parts['mtd00_ssb.bin']['sha256']
 ridata=(a.capture/'mtd02_RI.bin').read_bytes();identity=factory.identity(ridata)
 for name in ('CountryID',):
  value=ri_field(ridata,name)
  if value is not None:identity[name]=value.decode()
 records,values=factory.factory_records((a.capture/'mtd09_extfs.bin').read_bytes())
 out['factory']={'identity':identity,'SECURITY_copies':records,'EXT_KEY_FW_present':'EXT_KEY_FW' in values,'EXT_DBG_PWD_present':'EXT_DBG_PWD' in values,'field_count':len(values)}
 originals={'first':ROOT/_publication_input('RESEARCH-INPUT-6245B125BD53'),'second':refs['second']/'mtd09_extfs.bin','third':refs['third']/'mtd09_extfs.bin','Beacon9':ROOT.parent/'Nokia-Beacon-9/stock-firmware/router-emmc-20261014-033951/partitions/mmcblk0p26.img'}
 comparisons=[]
 for label,path in originals.items():
  if label=='first':
   matches=re.findall(r'KV00120012EXT_BOOT_PWD([\x20-\x7e]{12})',path.read_bytes().decode('utf-16'))
   assert len(matches)==2 and len(set(matches))==1
   other={'EXT_BOOT_PWD':(0,matches[0].encode('ascii'))}
   assert hashlib.sha256(other['EXT_BOOT_PWD'][1]).hexdigest()=='b7c5942d8524113482955e423d14096630736fb33c52f8b39be129d8ee4d5071'
  else:_,other=factory.factory_records(path.read_bytes())
  comparisons.append({'label':label,'source':fp(path),'fourth_boot_verifier_equal':other.get('EXT_BOOT_PWD')==values.get('EXT_BOOT_PWD'),'fourth_security_fields_equal':{k:values.get(k)==other.get(k) for k in sorted(other if label=='first' else set(values)|set(other))}})
 out['factory']['comparison_to_pre_override_originals']=comparisons
 cryptlib=ctypes.CDLL(ctypes.util.find_library('crypt'));cryptlib.crypt.argtypes=[ctypes.c_char_p,ctypes.c_char_p];cryptlib.crypt.restype=ctypes.c_char_p
 label=ri_field(ridata,'LabelCode')
 out['factory']['admin_hash_matches_own_label']=cryptlib.crypt(label,values['EXT_WEB_PWD'][1])==values['EXT_WEB_PWD'][1]
 out['factory']['management_hash_matches_own_label']=cryptlib.crypt(label,values['EXT_WEB_MGNT_PWD'][1])==values['EXT_WEB_MGNT_PWD'][1]
 out['factory']['boot_verifier_bytes']=len(values['EXT_BOOT_PWD'][1])
 out['limits']=['First-unit pre-override comparison is ASCII-record recovery after decoding a UTF-16 text capture; not a lossless NAND reconstruction. Only its boot verifier is compared.','Owner reports no modifications; this is not proof of factory-fresh provisioning/history.','Used SquashFS identity binds immutable files, not runtime account state or effective security-engine results.','Environment records are saved redundant records; image bookkeeping fields need comparison with the actual captured kernel command line.','Main-area dump lacks NAND OOB; checks do not prove atomic capture or a working restore.']
 a.report.write_text(json.dumps(out,indent=2)+'\n');print(json.dumps({'capture_bytes':out['capture']['physical_main_area_bytes'],'ZIP_partitions':len(parts),'bank_profiles':{k:v['matches_existing_profile'] for k,v in out['firmware'].items()},'identity':identity,'env':[x['safe_fields'] for x in envs],'SSB_equals_first_third':out['bootloader']['whole_SSB_equals_first_and_third'],'factory_key18_field':out['factory']['EXT_KEY_FW_present'],'factory_debug_override':out['factory']['EXT_DBG_PWD_present']},indent=2))
if __name__=='__main__':main()
