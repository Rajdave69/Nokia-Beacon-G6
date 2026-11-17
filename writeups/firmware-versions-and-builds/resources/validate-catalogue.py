#!/usr/bin/env python3
"""Offline consistency checks for the version catalogue and its narrative links."""
import argparse,ast,hashlib,json,re
from pathlib import Path
G6=Path(__file__).resolve().parents[3];B9=G6.parent/'Nokia-Beacon-9'
import sys
sys.path.insert(0,str(G6/'writeups/security-keys/resources'))
from publication_aliases import private_record,public_record,original_source_path
def main():
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--out',required=True);args=ap.parse_args()
 resource=Path(__file__).resolve().parent;p=resource/'versions-evidence.json';j=private_record(json.loads(p.read_text(encoding='utf-8')))
 expected={'g6_ijl_j03':('3FE49996IJLJ03','IJL.J03p01',557),'g6_hjl_l91':('3FE49996HJLL91','HJL.L91p01',604),'b9_jjm_k44':('3TN01100JJMK44','JJM.K44p01',723),'xs_jjl_k67':('3FE49940JJLK67','JJL.K67p02',597),'xs_kjl_k50':('3FE49940KJLK50','KJL.K50p01',597),'xs_jjl_k24':('3FE49940JJLK24','JJL.K24p02',597)}
 assert set(j['profiles'])==set(expected) and j['captured_profile_count']==len(expected) and j['packaged_control_count']==sum(x[2] for x in expected.values())
 controls=0
 for name,(image,software,count) in expected.items():
  row=j['profiles'][name];assert row['buildinfo']['IMAGEVERSION']==image and row['buildinfo']['SOFTWAREVERSION']==software;assert len(row['packages'])==count
  for item in list(row['metadata'].values())+list(row['packages'].values()):
   source=Path(item['source']);assert source.is_file() and hashlib.sha256(source.read_bytes()).hexdigest()==item['sha256']
   data=item['content'].encode('utf-8');assert len(data)==item['bytes'];assert hashlib.sha256(data).hexdigest()==item['sha256']
  for package,item in row['packages'].items():
   assert item['Version'];assert 'Package: '+package+'\n' in item['content'];assert 'Version: '+item['Version']+'\n' in item['content'];controls+=1
 assert j['captured_banks']['Beacon9_p23']['squashfs']==j['captured_banks']['Beacon9_p24']['squashfs']
 assert j['bootloaders']['Beacon9_p14']['sha256']==j['bootloaders']['Beacon9_p15']['sha256']
 assert j['official_G6_package']['sha256']=='b15c4ac4ed141f744cca777713e578e652b68c61c1d030555978a788cbdbcac8'
 collector=resource/'collect-version-metadata.py';ast.parse(collector.read_text(encoding='utf-8'));original_collector=original_source_path(j['collector']['source'],j['collector']['sha256']);assert hashlib.sha256(original_collector.read_bytes()).hexdigest()==j['collector']['sha256']
 assert j['XS2426XA_capture']['selected_bank']==1
 for bank in (0,1):
  item=j['captured_banks'][f'XS2426XA_rootfs{bank}'];v=j['XS2426XA_capture']['volume_payloads'][str(bank)]['1'];assert item['bytes']==v['used_bytes'] and item['sha256']==v['sha256']
 lineage=json.loads((resource/'software-lineage-evidence.json').read_text(encoding='utf-8'));assert lineage['captured_profile_count']==5 and lineage['package_control_count']==3078
 files=[]
 for root in [G6,B9]:
  files += [root/'writeups/ota-firmware-downloads/README.md',root/'writeups/firmware-versions-and-builds/README.md',root/'knowledgebases/firmware-versions-and-builds.md',root/'README.md',root/'knowledgebases/README.md',root/'writeups/firmware-versions-and-builds/25.03-account-comparison.md',root/'writeups/firmware-versions-and-builds/documented-releases.md']
 links=0
 for f in files:
  text=f.read_text(encoding='utf-8');assert '@@' not in text;assert len(re.findall(r'^```',text,re.M))%2==0
  for target in re.findall(r'\]\(([^)]+)\)',text):
   if target.startswith(('https:','http:','#','mailto:')):continue
   target=target.split('#')[0]
   if target.startswith('/tmp/'):continue
   dest=Path(target) if target.startswith('/mnt/d/') else f.parent/target
   assert dest.exists(),(str(f),target);links+=1
 secrets=[]
 for root,label in [(G6,'g6'),(B9,'b9')]:
  profile=root/f'config-private/ota-cloud-analysis/{label}-ota-profile.json'
  if profile.exists():secrets.append(json.loads(profile.read_text(encoding='utf-8'))['api_key'])
 for f in files+[p]:assert not any(value in f.read_text(encoding='utf-8') for value in secrets),str(f)
 result={'verified_on':'2026-11-13','scope':'Offline consistency/identity/text/link checks only; no firmware execution, network request, live device test or new firmware-signature verification.',
  'all_passed':True,'captured_builds':len(expected),'full_package_control_records_checked':controls,'local_links_checked':links,'Markdown_fences_balanced':True,'unresolved_template_tokens':False,'available_private_profiles_checked_for_key_leaks':len(secrets),
  'checked_evidence':{'source':str(p),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()},
  'checks':['expected image/software IDs and control counts','full metadata/control text sizes and SHA256','parsed package name/version matches full source','B9 bank used-payload equality','B9 APPSBL equality','official G6 package known fingerprint','collector syntax/hash','hand-authored Markdown links/fences/templates','known OTA key exclusion when local private profiles available']}
 result=public_record(result)
 with Path(args.out).open('x',encoding='utf-8',newline='\n') as f:f.write(json.dumps(result,indent=2)+'\n')
 print(json.dumps(result,indent=2))
if __name__=='__main__':main()
