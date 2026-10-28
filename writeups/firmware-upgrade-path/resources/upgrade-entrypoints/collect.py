#!/usr/bin/env python3
"""Collect static firmware-update evidence; never execute firmware or write its roots.
Requires Python 3, capstone, readelf and rg on the analyst host.
The ELF annotation is a linear reference aid, not path-sensitive execution proof.
"""
import argparse, contextlib, hashlib, io, json, re, subprocess
from pathlib import Path
import sys
sys.dont_write_bytecode = True
from elf_reader import Elf

BINARY_PATHS = [
 'webs/upgrade_web_app.cgi', 'webs/otasw_upgrade_app.cgi',
 'usr/bin/tr069client', 'sbin/nuspd', 'sbin/obuspa',
 'usr/bin/swmgnt', 'usr/lib/libotaSwAgent.so', 'lib/libnal.so',
 'usr/exe/swug', 'usr/lib/libupgrade.so', 'usr/lib/libupgradeimpl.so',
 'usr/lib/rpcd/rpcsys.so', 'usr/sbin/batch_upgrade', 'usr/bin/cfgmgr',
 'usr/bin/ca.upgrade', 'usr/sbin/imageTool', 'sbin/mtd',
 'usr/sbin/ubiformat','usr/sbin/ubiupdatevol','usr/sbin/nandwrite','usr/sbin/flash_erase']
TEXT_PATHS = [
 'sbin/sysupgrade','lib/upgrade/platform.sh','lib/upgrade/common.sh',
 'etc/HB_Config.json','etc/config/rpcd','usr/share/acl.d/rpcd_ubus_acl.json',
 'etc/pcd/swmgnt.pcd','etc/pcd/tr069.pcd','etc/pcd/nuspd.pcd',
 'etc/pcd/obuspa.pcd','etc/pcd/rpcd.pcd','etc/pcd/rlyeh.pcd',
 'etc/init.d/platform','usr/exe/batchupgrade_interface.sh',
 'usr/exe/upgrade_check.sh','usr/bin/ca.upgrade.sb',
 'usr/sbin/wlanfw-upgrade.sh','etc/buildinfo']
PATTERN=re.compile(r'(?i)(swdl_|swug|sysupgrade|imageTool|upgrade|firmware|'
 r'nal_(writePassiveImage|activatePassiveImage)|ota.*(image|download)|'
 r'AutoActivate|DownloadURL|TargetFileName|SHBRSWUG|NBNX|G-010G-D|U-040X-A|https?://|'
 r'triggerDownloadFromPortal|activateFirmwareFromPortal|mobileAppRGWUpgrade)')
SOURCE_ROOTS={
 'old':'router-flash-ALCLFD4B5342/beacon-g6-clean-dumps-20261022-192444 (inactive rootfs0 IJL.J03)',
 'new':'router-flash-ALCLFD4B5342/beacon-g6-clean-dumps-20261022-192444 (active rootfs1 HJL.L91)'}

def identity(p):
 d=p.read_bytes()
 return {'bytes':len(d),'sha256':hashlib.sha256(d).hexdigest()}

def refs(e, terms):
 targets={}
 for term in terms:
  pos=0
  while (pos:=e.d.find(term.encode(),pos))>=0:
   for ph in e.ph:
    if ph[0]==1 and ph[2]<=pos<ph[2]+ph[5]:targets[ph[3]+pos-ph[2]]=term
   pos+=1
 buf=io.StringIO()
 with contextlib.redirect_stdout(buf):e.xrefs(set(targets))
 return {'string_addresses':{hex(a):t for a,t in targets.items()},'linear_references':buf.getvalue().splitlines()}

def run(old,new,out):
 roots={'old':old,'new':new}
 result={'schema_version':1,'observed_on':'2026-10-25',
  'scope':'Offline static analysis only. No firmware process or upgrade was executed. No router/network access.',
  'source_roots':SOURCE_ROOTS,'extraction_roots':{k:str(v) for k,v in roots.items()},
  'binary_inventory':{},'source_snapshots':{},'schema_extracts':{},'api_and_command_callers':{},
  'static_references':{},'trace_artifact':'static-traces.txt',
  'annotation_limits':['Linear register/string annotations are heuristic; confirm branches and resolved GOT names in instructions.',
   'A nearby exported symbol in stripped objdump output need not name the enclosing function.',
   'PCD ACTIVE=NO can be overridden by cfgmgr via PCD_api_start_process; it is not proof of disabled USP.',
   'Presence of tools/schema/defaults does not establish live service enablement, external reachability or successful flashing.']}
 traces=[]
 for build,root in roots.items():
  result['binary_inventory'][build]={};result['source_snapshots'][build]={};result['schema_extracts'][build]={}
  for name in BINARY_PATHS:
   p=root/name
   if not p.is_file():result['binary_inventory'][build][name]={'present':False};continue
   item={'present':True,**identity(p)}
   if p.read_bytes().startswith(b'\x7fELF'):
    syms=subprocess.run(['readelf','--dyn-syms','-W',str(p)],check=True,capture_output=True,text=True).stdout
    item['matching_dynamic_symbols']=[l.strip() for l in syms.splitlines() if PATTERN.search(l)]
    if name not in ['usr/bin/cfgmgr','sbin/obuspa']:
     item['matching_strings']=[x.decode('ascii') for x in re.findall(rb'[ -~]{4,}',p.read_bytes()) if PATTERN.search(x.decode('ascii'))]
   result['binary_inventory'][build][name]=item
  for name in TEXT_PATHS:
   p=root/name
   if not p.is_file():continue
   d=p.read_bytes()
   try:text=d.decode('utf-8');encoding='utf-8'
   except UnicodeDecodeError:text=d.decode('latin-1');encoding='latin-1 (lossless single-byte decoding)'
   result['source_snapshots'][build][name]={**identity(p),'source_decoding':encoding,'text':text}
  for name in ['usr/etc/tr181.xml','usr/etc/tr181_ext.xml']:
   p=root/name;ls=p.read_text().splitlines();indexes=set()
   for i,line in enumerate(ls):
    if 'FirmwareImage' in line or 'TR369Agent_Enable' in line:
     indexes.update(range(max(0,i-2),min(len(ls),i+12)))
   result['schema_extracts'][build][name]={**identity(p),'selected_lines':[{'line':i+1,'text':ls[i]} for i in sorted(indexes)]}
  for name in ['usr/exe/swug','usr/lib/rpcd/rpcsys.so','usr/sbin/batch_upgrade','usr/bin/ca.upgrade']:
   e=Elf(root/name);sec=e.sections['.text']
   traces += ['\n'+build+' '+name+' FULL .text DISASSEMBLY',*e.annotate(sec[3],sec[3]+sec[5])]
  for name,functions in [('lib/libnal.so',['nal_writePassiveImage','nal_activatePassiveImage']),
   ('usr/lib/libotaSwAgent.so',['upgrade','downloadAndUpgrade','otaMobileApp_process_newimage_request','otaSwmgnt_process_newimage_info']),
   ('usr/bin/tr069client',['dev_download_firmware_upgrade','download_upload_process','download_upload_body','lib_download_complete'])]:
   e=Elf(root/name)
   for fn in functions:
    a,z=e.syms.get(fn,(0,0))
    if a and z:traces += ['\n'+build+' '+name+' '+fn,*e.annotate(a,a+z)]
  for name,terms in [('usr/bin/cfgmgr',['/usr/sbin/batch_upgrade &','cfg_bootObuspa']),
   ('sbin/nuspd',['NBNX','Device.DeviceInfo.FirmwareImage.{i}.Download() denied','Device.DeviceInfo.FirmwareImage.{i}.Activate() denied',
    'nusp_downloadComplete ENTRY for Type : FIRMWARE_ACTIVATE','nusp_downloadComplete ENTRY for Type : FIRMWARE_DOWNLOAD_IMAGE'])]:
   result['static_references'][build+'/'+name]=refs(Elf(root/name),terms)
  result['api_and_command_callers'][build]={}
  for term in ['swdl_write_image','swdl_end_upgrading_write_image','/sbin/sysupgrade','imageTool','batch_upgrade','ca.upgrade']:
   cp=subprocess.run(['rg','-l','-a','-F',term,str(root)],capture_output=True,text=True)
   result['api_and_command_callers'][build][term]=sorted(str(Path(x).relative_to(root)) for x in cp.stdout.splitlines())
 # Address-specific current-build branches, verified against the listed HJL binary hashes.
 for name,a,b,label in [('usr/bin/cfgmgr',0x3cf30,0x3cf88,'cfg_bootBatchUpgrade'),
  ('usr/bin/cfgmgr',0x4f8e0,0x4fbe0,'cfg_bootObuspa'),
  ('sbin/nuspd',0x407000,0x4076a0,'FirmwareImage Download/Activate callbacks'),
  ('sbin/nuspd',0x418500,0x418bc0,'download / completion / image-name helpers')]:
  traces += ['\nnew '+name+' '+label,*Elf(new/name).annotate(a,b)]
 # Preserve RPC method/data records and callback-table provenance, rather than only names.
 e=Elf(new/'usr/lib/rpcd/rpcsys.so')
 result['rpc_records']={'method_records':{},'argv_records':{}}
 for name,a in [('upgrade_test',0x12b90),('upgrade_start',0x12bc0),('upgrade_clean',0x12bf0)]:
  result['rpc_records']['method_records'][name]={'record_va':hex(a),'handler_va':hex(int.from_bytes(e.read(a+8,8),'little'))}
 for a in range(0x13008,0x13080,8):
  v=int.from_bytes(e.read(a,8),'little');result['rpc_records']['argv_records'][hex(a)]={'value':hex(v),'string':e.cstr(v)}
 result['same_binary_across_slots']=[n for n in BINARY_PATHS if result['binary_inventory']['old'][n].get('sha256') and result['binary_inventory']['old'][n].get('sha256')==result['binary_inventory']['new'][n].get('sha256')]
 trace='\n'.join(traces)+'\n';(out/'static-traces.txt').write_text(trace)
 result['trace_identity']=identity(out/'static-traces.txt')
 (out/'collected-static-evidence.json').write_text(json.dumps(result,indent=2)+'\n')
 print(json.dumps({'binary_paths_per_build':len(BINARY_PATHS),'text_sources_per_build':len(TEXT_PATHS),'same_binary_across_slots':result['same_binary_across_slots'],'trace_bytes':len(trace.encode())}))

if __name__=='__main__':
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--old-root',type=Path,required=True);ap.add_argument('--new-root',type=Path,required=True);ap.add_argument('--out',type=Path,default=Path(__file__).resolve().parent)
 args=ap.parse_args();args.out.mkdir(parents=True,exist_ok=True);run(args.old_root,args.new_root,args.out)
