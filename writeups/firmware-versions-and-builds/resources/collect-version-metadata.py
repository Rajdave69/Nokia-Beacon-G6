#!/usr/bin/env python3
"""Offline catalogue of provided stock roots; reads metadata, never runs firmware."""
import argparse,hashlib,json,re,struct
from pathlib import Path
G6=Path(__file__).resolve().parents[3]
import sys
sys.path.insert(0,str(G6/'writeups/security-keys/resources'))
from publication_aliases import public_record,source_path,device_serial
# This resource is under writeups/<topic>/resources, so parents[3] is project root.
B9=G6.parent/'Nokia-Beacon-9'
def identity(path):
 data=path.read_bytes();return {'source':str(path),'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()}
def read_profile(root):
 entry={'root':str(root),'metadata':{},'buildinfo':{},'packages':{}}
 for relative in ['etc/buildinfo','etc/openwrt_release','usr/lib/os-release','usr/etc/ussa/ReleaseNotes','usr/etc/localrrm/ReleaseNotes']:
  f=root/relative
  if f.is_file():
   data=f.read_bytes();entry['metadata'][relative]={**identity(f),'content':data.decode('utf-8')}
   if relative=='etc/buildinfo':entry['buildinfo']=dict(line.split('=',1) for line in data.decode().splitlines() if '=' in line)
 for f in sorted((root/'usr/lib/opkg/info').glob('*.control')):
  data=f.read_bytes();text=data.decode('utf-8');fields=dict(line.split(': ',1) for line in text.splitlines() if ': ' in line and not line.startswith((' ','\t')))
  package=fields.get('Package',f.stem)
  assert package not in entry['packages'],package
  entry['packages'][package]={**identity(f),'Version':fields.get('Version'),'Architecture':fields.get('Architecture'),'Source':fields.get('Source'),'content':text}
 return entry
def main():
 ap=argparse.ArgumentParser(description=__doc__)
 for flag in ['g6-old-root','g6-root','beacon9-root','xs-old-root','xs-root','out']:ap.add_argument('--'+flag,required=True)
 ap.add_argument('--xs-k24-root',type=Path,default=G6/'dumped-firmware/extracted/ont-b-k24',help='Extracted stock root of ONT-B bank 0')
 ap.add_argument('--previous',type=Path,help='Retain dated capture/owner context from an earlier catalogue; regenerated fields take precedence')
 args=ap.parse_args();out=Path(args.out)
 if out.exists():raise FileExistsError(out)
 roots={'g6_ijl_j03':Path(args.g6_old_root),'g6_hjl_l91':Path(args.g6_root),'b9_jjm_k44':Path(args.beacon9_root),'xs_jjl_k67':Path(args.xs_old_root),'xs_kjl_k50':Path(args.xs_root),'xs_jjl_k24':args.xs_k24_root}
 report={'schema_version':2,'verified_on':'2026-11-13','scope':'Offline metadata from already extracted raw-image roots; package control metadata is shipped metadata, not a new live installed-package measurement. No new cloud query/download/router operation.',
  'profiles':{},'cross_project_evidence':{},'captured_banks':{},'bootloaders':{},
  'uncaptured_labels':[
   {'label':'3FE49996UMJ28','model':'G6','provenance':'Nokia-authored2025 Corteca presentation example; normal research query can echo it as target without URL/checksum','captured':False,'build_date':None},
   {'label':'JJMK31','model':'Beacon9','provenance':'Nokia-authored2025 Corteca presentation label; full3TN01100JJMK31 constructed from current family only for a query scenario','captured':False,'full_image_id_verified':False},
  ],
  'limits':['Captured builds are not a complete Nokia release history or global-latest list.','Captured SOFTWAREVERSION suffixes include p01 and p02. Suffixes and build years do not identify a release train.','BBDR2503a is a component release-note label within the captured B9 image, not an additional captured rootfs.','Certificate validity dates and retained boot banners are not proof of manufacture, source compilation or installation time.']}
 for name,root in roots.items():
  entry=read_profile(root)
  report['profiles'][name]=entry
  print(name,entry['buildinfo']['IMAGEVERSION'],'packaged controls',len(entry['packages']))
 for root,filename in [(G6,'comparing-other-g6-routers-evidence.json'),(G6,'g6-ssb-comparison-evidence.json'),(G6,'older-slot-startup-and-services-evidence.json'),(B9,'uboot-verifier-comparison-evidence.json')]:
  f=root/'knowledgebases'/filename;report['cross_project_evidence'][filename]=identity(f)
 two=json.loads((G6/'knowledgebases/comparing-other-g6-routers-evidence.json').read_text())['second_device_and_builds']
 report['G6_slot_capture']=two['devices'];report['G6_rootfs_used_payloads']=two['rootfs_payloads']
 ssb=json.loads((G6/'knowledgebases/g6-ssb-comparison-evidence.json').read_text())
 boot=json.loads((B9/'knowledgebases/uboot-verifier-comparison-evidence.json').read_text())
 for serial,row in ssb['devices'].items():
  f=G6/row['source'];report['bootloaders'][serial]={**identity(f),'uboot_banner':row['uboot_banner'],'BL33':boot['profiles']['G6_'+serial]['bootloader'],'certificate_validity_starts':sorted({item['certificate']['not_before'] for copy in row['fip_copies'] for item in copy['entries'] if 'certificate' in item})}
 for number in [14,15,23,24]:
  f=B9/f'stock-firmware/router-emmc-20261014-033951/partitions/mmcblk0p{number}.img';data=f.read_bytes();item=identity(f)
  if number in [14,15]:
   item['uboot_banners']=[{'offset':m.start(),'value':m.group().decode('ascii')} for m in re.finditer(rb'U-Boot [0-9]{4}\.[0-9]{2}[^\x00\r\n]*',data)]
   report['bootloaders']['Beacon9_p'+str(number)]=item
  else:
   offset=data.find(b'hsqs');assert offset>=0
   used=struct.unpack_from('<Q',data,offset+40)[0];assert used>4096 and offset+used<=len(data)
   payload=data[offset:offset+used];item['squashfs']={'offset':offset,'bytes_used':used,'sha256':hashlib.sha256(payload).hexdigest()}
   report['captured_banks']['Beacon9_p'+str(number)]=item
 downloaded=G6/'dumped-firmware/downloaded-firmware/3FE49996HJLL91.bin'
 report['official_G6_package']=identity(downloaded)
 f=G6/'writeups/firmware-upgrade-path/resources/cloud-download/package-inspection.json';report['official_G6_package']['inspection_source']=identity(f);report['official_G6_package']['inspection']=json.loads(f.read_text())
 followup=G6/'writeups/firmware-upgrade-path/resources/cloud-download/bbdr2503-public-doc-evidence.json'
 if followup.exists():report['documented_uncaptured_release_trains']=[{'model':'G6/G6_2','release':'BBDR2503','status':'Official fixed-release support documented; no binary/image ID captured','documentation_evidence':identity(followup),'relevant_documents':json.loads(followup.read_text())['relevant_documents']}]
 docindex=Path(__file__).with_name('documentation-release-index.json')
 if docindex.exists():report['documentation_release_index']={'source':identity(docindex),'scope':'Model-specific document associations, not captured firmware packages','model_summary':json.loads(docindex.read_text())['model_summary']}
 third=G6/'knowledgebases/comparing-other-g6-routers-evidence.json'
 if third.exists():
  observed=json.loads(third.read_text())['third_device'];report['third_G6_capture']={'device':device_serial('G6-C'),'evidence':identity(third),'both_banks':observed['firmware']['third_bank_payloads'],'build':'3FE49996HJLL91/HJL.L91p01','scope':'Same existing used SquashFS profile; no fourth distinct captured rootfs build.'}
 fourth=G6/'knowledgebases/comparing-other-g6-routers-evidence.json'
 if fourth.exists():report['fourth_G6_capture']={'device':device_serial('G6-D'),'evidence':identity(fourth),'scope':'Unchanged-owner capture; repeats existing IJL/HJL used payloads, no additional distinct build.'}
 xsres=G6/'writeups/xs2426xa-24-03-comparison/resources'
 report['XS2426XA_capture']={'device':device_serial('ONT-A'),'owner_operator':'Vodafone','RI_operator':'VDQA','RI_country':'qa','owner_modifications':'None reported; not a factory-fresh assertion','selected_bank':1,'evidence':identity(xsres/'initial-inspection.json'),'volume_payloads':json.loads((xsres/'volume-payloads.json').read_text())}
 for bank in (0,1):
  f=G6/f'config-private/xs2426xa-analysis-20261027/bank{bank}.squashfs';item=identity(f);v=report['XS2426XA_capture']['volume_payloads'][str(bank)]['1'];assert item['bytes']==v['used_bytes'] and item['sha256']==v['sha256'];report['captured_banks'][f'XS2426XA_rootfs{bank}']=item
 report['ONT_B_capture']=identity(xsres/'ont-b-k24-comparison.json')
 report['captured_profile_count']=len(roots)
 report['packaged_control_count']=sum(len(p['packages']) for p in report['profiles'].values())
 if args.previous:
  previous=json.loads(args.previous.read_text(encoding='utf-8'))
  for key in ('capture_context','owner_requested_cleanup','incoming_G6_captures','third_capture_source_refresh'):
   if key in previous:report[key]=previous[key]
  report['previous_catalogue']={**identity(args.previous),'scope':'Historical three-profile catalogue superseded by regenerated five-profile metadata; dated capture notes preserved.'}
 report['incoming_G6_captures']={'owner_reports_more_devices':True,'received_G6_device_aliases':['G6-A','G6-B','G6-C','G6-D'],'new_captures_received':True,'additional_promised_devices':'No further serials/builds measured','priority':'Same-model G625.xx comparison remains missing.'}
 report.setdefault('capture_context',{}).update(G6_third='G6-C: rootfs0 selected; both HJL; owner changed LAN IP only',G6_fourth='G6-D: rootfs1 HJL selected; rootfs0 IJL; owner reports no modifications',XS2426XA='ONT-A Vodafone VDQA/qa: rootfs0 JJL.K67p02, rootfs1 KJL.K50p01 selected; owner reports no modifications; both HomeOS24.03.01',reconciliation_scope='2026-10-27 consolidated inventory: no new OTA query, documentation crawl, firmware execution or router operation')
 report['G6_slot_capture_scope']='Original two-unit detailed report retained; third/fourth_G6_capture and capture_context extend the inventory to four G6s.'
 if 'third_capture_source_refresh' in report:report['third_capture_source_refresh']['scope']='Historical third-unit source-refresh event, preserved from prior catalogue; its current_sha256 labels describe that event, not a fresh check.'
 # Extend the two-unit original SSB analysis without pretending shared bytes imply identical credentials.
 report['all_G6_SSB_captures']={}
 for serial in (device_serial('G6-A'),device_serial('G6-B'),device_serial('G6-C'),device_serial('G6-D')):
  matches=list((G6/'dumped-firmware'/('router-flash-'+serial)).glob('beacon-g6-clean-dumps-*/mtd00_ssb.bin'));assert len(matches)==1
  f=matches[0];item=identity(f);data=f.read_bytes();item['uboot_banners']=[m.group().decode('ascii') for m in re.finditer(rb'U-Boot [0-9]{4}\.[0-9]{2}[^\x00\r\n]*',data)];report['all_G6_SSB_captures'][serial]=item
 report['G6_SSB_equality_groups']=[[serial for serial,item in report['all_G6_SSB_captures'].items() if item['sha256']==digest] for digest in dict.fromkeys(item['sha256'] for item in report['all_G6_SSB_captures'].values())]
 xs_capture=source_path('private-source://CAPTURE-ONT-A/XS-2426X-A-clean-dumps-20261027-142602/mtd00_ssb.bin');data=xs_capture.read_bytes();report['bootloaders']['XS2426XA_SSB']={**identity(xs_capture),'uboot_banners':[m.group().decode('ascii') for m in re.finditer(rb'U-Boot [0-9]{4}\.[0-9]{2}[^\x00\r\n]*',data)],'limits':'Whole SSB differs from both observed G6 groups; no ONT verifier, native BL33 routine or UART test added.'}
 ota=xsres/'ota-research.json'
 if ota.exists():report['XS_OTA_followup']={'evidence':identity(ota),'queries':2,'downloaded_packages':0,'scope':'Current and actual inactive version gave no offer; no new captured rootfs profile.'}
 report['collector']=identity(Path(__file__))
 report=public_record(report)
 out.parent.mkdir(parents=True,exist_ok=True);out.write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
 print('Captured profiles',report['captured_profile_count'],'packaged controls',report['packaged_control_count'])
if __name__=='__main__':main()
