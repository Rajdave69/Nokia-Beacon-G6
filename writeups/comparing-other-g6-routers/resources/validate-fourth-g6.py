#!/usr/bin/env python3
"""Validate fourth-G6 evidence/source identity, real DBs, links and privacy offline."""
from pathlib import Path as _PublicationPath
import json as _publication_json
import re as _publication_re

def _publication_input(alias):
    project = next(p for p in _PublicationPath(__file__).resolve().parents
                   if (p / 'writeups').is_dir())
    registry = (project / 'writeups/README.private.md').read_text(encoding='utf-8')
    payload = _publication_re.search(r'```json\s*\n(.*?)\n```', registry, _publication_re.S)
    return _publication_json.loads(payload[1])['private_values'][alias]

import argparse,ast,hashlib,importlib.util,json,re,struct
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3];B9=ROOT.parent/'Nokia-Beacon-9'
def load(path,name):
 spec=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
def source_path(value):
 if re.match(r'^[A-Za-z]:[\\/]',value):return Path('/mnt/'+value[0].lower()+'/'+value[3:].replace('\\','/'))
 return Path(value)
def main():
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--out',required=True,type=Path);a=ap.parse_args()
 if a.out.exists():raise FileExistsError('Use new validation output')
 res=Path(__file__).resolve().parent;e=json.loads((ROOT/'knowledgebases/comparing-other-g6-routers-evidence.json').read_text())['fourth_device'];reports=e['reports'];cap=reports['capture_comparison'];w=reports['writable_comparison']
 assert len(cap['capture']['partitions'])==12 and cap['capture']['physical_main_area_bytes']==536870912 and cap['capture']['manifest_all_match'] and cap['capture']['ZIP']['member_CRC_all_pass'] and cap['capture']['ZIP']['partition_members_SHA256_match']==12
 assert [cap['firmware'][x]['matches_existing_profile'] for x in ('mtd03_rootfs0.bin','mtd04_rootfs1.bin')]==['older','current']
 assert all(v for row in reports['volume_payloads']['fourth_equals_second_by_bank_and_volume'].values() for v in row.values())
 assert cap['bootloader']['whole_SSB_equals_first_and_third'] and not cap['bootloader']['whole_SSB_equals_second']
 for row in cap['bootloader']['environment_records']:
  assert row['CRC_valid'] and not row['console_present'];fields=row['safe_fields'];assert fields['active_part']=='1' and fields['sb_flag']=='114' and fields['cfg_partition']=='rootfs_data1' and all(fields[k]=='0' for k in ('img_active','img_commit','img_executed'))
 f=cap['factory'];assert f['identity']['G984Serial']==_publication_input('RESEARCH-INPUT-0443ABB2A31F') and f['identity']['ProgDate']=='241021' and f['field_count']==10 and len(f['SECURITY_copies'])==2
 assert not f['EXT_KEY_FW_present'] and not f['EXT_DBG_PWD_present'] and f['admin_hash_matches_own_label'] and not f['management_hash_matches_own_label']
 assert len(f['comparison_to_pre_override_originals'])==4 and all(not x['fourth_boot_verifier_equal'] for x in f['comparison_to_pre_override_originals'])
 assert len(w['stored_databases'])==6 and len({x['decoded']['sha256'] for x in w['stored_databases']})==2 and len(w['negative_key10_cases'])==3 and all(x['rejected'] for x in w['negative_key10_cases'])
 assert w['service_keys']['HTTP']['pair_matches'] and w['service_keys']['HTTP']['RSA_bits']==1024 and w['service_keys']['HTTP']['differs_from_each_previous_G6'] and all(x['differs_from_each_previous_saved_private_file'] for x in w['service_keys']['Dropbear'])
 assert all(not v for v in w['stock_persistence_payloads'].values())
 assert w['logs']['image_ID_occurrences']=={'3FE49996IJLJ03':97,'3FE49996HJLL91':233}
 assert len(w['logs']['sanitized_Nokia_URL_leads'])==44 and all(x['host']=='swupd.wifi.nokia.com' and x['firmware_path'] is None for x in w['logs']['sanitized_Nokia_URL_leads'])
 assert len(w['logs']['nested_members'])==1 and w['logs']['nested_members'][0]['archive_magic_hex']=='1f8b0800'
 refs={}
 def walk(value):
  if isinstance(value,dict):
   if {'source','bytes','sha256'}<=value.keys():refs[value['source']]=value
   for v in value.values():walk(v)
  elif isinstance(value,list):
   for v in value:walk(v)
 walk(e)
 for name,item in refs.items():
  p=source_path(name);raw=p.read_bytes();assert len(raw)==item['bytes'] and hashlib.sha256(raw).hexdigest()==item['sha256'],name
 decoder=load(ROOT/'writeups/stored-configuration-database/resources/decrypt-stored-config.py','decoder');key=decoder.derive_key10(_publication_input('RESEARCH-INPUT-0443ABB2A31F').encode(),b'241021')
 for item in w['stored_databases']:
  raw,meta=decoder.decrypt_stored(source_path(item['input']['source']).read_bytes(),key);assert raw==source_path(item['decoded']['source']).read_bytes() and meta==item['metadata']
 for item in e['operator_package_format_observation']:
  raw=source_path(item['source']).read_bytes();assert not item['has_WebUI_export_magic_0x123123'] and struct.unpack_from('<Q',raw)[0]!=0x123123
 docs=[ROOT/'writeups/comparing-other-g6-routers/README.md',ROOT/'knowledgebases/comparing-other-g6-routers.md',ROOT/'README.md']
 for root in (ROOT,B9):docs += [root/'writeups/security-keys/README.md',root/'writeups/firmware-versions-and-builds/README.md']
 docs += [ROOT/'writeups/firmware-slot-rollback/README.md']
 links=0
 for p in docs:
  text=p.read_text(encoding='utf-8');assert '\ufffd' not in text and len(re.findall(r'^```',text,re.M))%2==0
  for target in re.findall(r'\]\(([^)]+)\)',text):
   if target.startswith(('http:','https:','#','mailto:','/tmp/')):continue
   q=p.parent/target.split('#')[0]
   assert q.exists() or q.parent.is_dir() and q.name.lower() in {x.name.lower() for x in q.parent.iterdir()},(p,target)
   links+=1
 assert '\u2705' in (ROOT/'README.md').read_text(encoding='utf-8')
 factory=load(ROOT/'writeups/comparing-other-g6-routers/resources/compare-g6-key-material.py','factory');inspect=load(res/'inspect-fourth-g6.py','inspect_fourth')
 captured=Path(cap['capture']['directory']);_,values=factory.factory_records((captured/'mtd09_extfs.bin').read_bytes());secrets=[value for name,(_,value) in values.items() if name!='EXT_OPID'];secrets.append(inspect.ri_field((captured/'mtd02_RI.bin').read_bytes(),'LabelCode'))
 prepare=factory.load_prepare()
 for root in (Path(_publication_input('RESEARCH-INPUT-A401F244A177')),Path(_publication_input('RESEARCH-INPUT-03F256D23A59'))):secrets += [x.encode() for x in prepare.static_keys(root,prepare.backup_module()).values() if len(x)>=10]
 for root,label in ((ROOT,'g6'),(B9,'b9')):
  p=root/f'config-private/ota-cloud-analysis/{label}-ota-profile.json'
  if p.is_file():secrets.append(json.loads(p.read_text())['api_key'].encode())
 public=list(res.glob('*.py'))+list(res.glob('*.json'))+docs+[ROOT/'knowledgebases/comparing-other-g6-routers-evidence.json']
 for p in public:
  raw=p.read_bytes();assert not any(x and x in raw for x in secrets),('secret_value_published',str(p))
 for p in res.glob('*.py'):ast.parse(p.read_text(encoding='utf-8'))
 out={'date':'2026-10-26','all_passed':True,'scope':'Offline source identities, six real stored-file decryptions, retained negative cases, links/encoding and known-secret exclusion. No live key query, firmware execution, network/router operation, import or flash/boot test.','physical_partitions_checked':12,'used_bank_payload_equalities':6,'unique_source_fingerprints_checked':len(refs),'real_stored_files_rechecked':6,'retained_wrong_input_cases':3,'local_links_checked':links,'public_artifacts_known_secret_checked':len(public),'validator_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest()}
 a.out.write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2))
if __name__=='__main__':main()
