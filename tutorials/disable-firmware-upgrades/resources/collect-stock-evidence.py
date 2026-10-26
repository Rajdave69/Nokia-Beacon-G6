#!/usr/bin/env python3
"""Read stock sources and test only UCI against isolated temporary config paths.
Requires Capstone, qemu-aarch64 and the project ELF reader. No router connection,
fw3 startup, kernel mount, real firewall or upgrade operation is performed.
"""
import argparse,hashlib,json,shutil,subprocess,sys,tempfile
from pathlib import Path
sys.dont_write_bytecode=True
PROJECT=Path(__file__).resolve().parents[3]
sys.path.insert(0,str(PROJECT/'writeups/firmware-upgrade-path/resources/upgrade-entrypoints'))
from elf_reader import Elf
SOURCES=['etc/init.d/startup','etc/init.d/firewall','etc/init.d/pcd','etc/init.d/commit_image','etc/init.d/done','etc/config/firewall','usr/exe/link.sh','usr/exe/image_activate.sh','usr/exe/image_commit.sh','etc/HB_Config.json','etc/pcd/swmgnt.pcd','etc/buildinfo','etc/init.d/ndk_rgwstack','sbin/ndk_update_fw3_config.sh','sbin/ndk_merge_fw3_firewall_user.sh','sbin/update_ndk_rgwstack.sh']
def collect(old,new):
 report={'observed_on':'2026-10-26','scope':__doc__,'builds':{}}
 for build,r in [('old',old),('new',new)]:
  entry={'source_root':str(r),'sources':{},'rc_order':[(p.name,str(p.readlink()) if p.is_symlink() else None) for p in sorted((r/'etc/rc.d').iterdir()) if p.name.startswith('S')]}
  for name in SOURCES:
   data=(r/name).read_bytes()
   try:text=data.decode('utf-8');encoding='utf-8'
   except UnicodeDecodeError:text=data.decode('latin-1');encoding='latin-1 lossless'
   entry['sources'][name]={'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'decoding':encoding,'text':text}
  p=r/'usr/etc/tr181.xml';lines=p.read_text().splitlines();indexes=set()
  for i,line in enumerate(lines):
   if any(term in line for term in ['X_ALU-COM_SwMgnt.','TR369Agent_Enable','EnableCWMP','UpgradesManaged']):indexes.update(range(max(0,i-2),min(len(lines),i+9)))
  entry['schema']={'path':str(p),'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'selected_lines':[{'line':i+1,'text':lines[i]} for i in sorted(indexes)]}
  for name in ['sbin/fw3','sbin/uci','usr/bin/cfgcli','usr/lib/libupgradeimpl.so']:
   data=(r/name).read_bytes();entry.setdefault('binaries',{})[name]={'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()}
  e=Elf(r/'sbin/fw3');entry['fw3_script_runner_0x407818_0x4078b8']=list(e.annotate(0x407818,0x4078b8))
  e=Elf(r/'usr/lib/libupgradeimpl.so');sec=e.sections['.text'];entry['backend_command_references']=[line for line in e.annotate(sec[3],sec[3]+sec[5]) if any(x in line for x in ['image_activate.sh','image_commit.sh','/sbin/sysupgrade'])]
  folder=Path(tempfile.mkdtemp(prefix='g6-real-uci-test-'));cfg=folder/'config';saved=folder/'state';cfg.mkdir();saved.mkdir();(cfg/'firewall').write_text('config defaults\n option input ACCEPT\n')
  cmd=['qemu-aarch64','-L',str(r),str(r/'sbin/uci'),'-c',str(cfg),'-P',str(saved)];transcript=[]
  try:
   for args in [['set','firewall.g6_firmware_lock=include'],['set','firewall.g6_firmware_lock.type=script'],['set','firewall.g6_firmware_lock.path=/configs/firmware-update-lock/firewall-include.sh'],['set','firewall.g6_firmware_lock.enabled=1'],['set','firewall.g6_firmware_lock.reload=1'],['commit','firewall'],['get','firewall.g6_firmware_lock'],['get','firewall.g6_firmware_lock.path'],['get','firewall.g6_firmware_lock.reload']]:
    cp=subprocess.run(cmd+args,capture_output=True,text=True);transcript.append({'args':args,'status':cp.returncode,'stdout':cp.stdout,'stderr':cp.stderr})
    if cp.returncode:break
   entry['isolated_original_uci_test']={'all_steps_passed':len(transcript)==9 and all(t['status']==0 for t in transcript),'transcript':transcript,'resulting_config':(cfg/'firewall').read_text()}
  finally:shutil.rmtree(folder)
  report['builds'][build]=entry
 return report
if __name__=='__main__':
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--old-root',type=Path,required=True);ap.add_argument('--new-root',type=Path,required=True);ap.add_argument('--out',type=Path,default=Path(__file__).with_name('stock-control-evidence.json'));a=ap.parse_args()
 result=collect(a.old_root,a.new_root);a.out.write_text(json.dumps(result,indent=2)+'\n')
 print(json.dumps({b:{'original_uci_test_passed':v['isolated_original_uci_test']['all_steps_passed'],'stock_source_count':len(v['sources'])} for b,v in result['builds'].items()}))
