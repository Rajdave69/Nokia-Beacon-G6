#!/usr/bin/env python3
"""Collect nonsecret provisioning relationships, actual decoded diffs and witnesses."""
import argparse,collections,hashlib,importlib.util,json,re,sqlite3,subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3];B9=ROOT.parent/'Nokia-Beacon-9';RES=Path(__file__).resolve().parent
import sys
sys.path.insert(0,str(ROOT/'writeups/security-keys/resources'))
from publication_aliases import private_record,public_record,private_value,source_path

def fp(p):
 b=p.read_bytes();return {'source':str(p),'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()}
def module(p,name):
 s=importlib.util.spec_from_file_location(name,p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
def parse(raw):
 out={}
 for line in raw.decode('utf-8').splitlines():
  line=line.strip()
  if not line or line.startswith('#') or '=' not in line:continue
  key,value=line.split('=',1);key=key.strip();value=value.strip();semantic=value
  if value.startswith('"'):
   try:semantic=json.loads(value)
   except json.JSONDecodeError:pass
  if not isinstance(semantic,str):semantic=str(semantic)
  out[key]={'raw':value,'semantic':semantic}
 return out

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--out',required=True,type=Path);a=ap.parse_args()
 if a.out.exists():raise FileExistsError('Use new report')
 decoded=private_record(json.loads((RES/'zeroman-decode-results.json').read_text()));profiles={}
 for row in decoded['files']:
  name=Path(row['input']['source']).name
  profile=parse(Path(row['output']['source']).read_bytes())
  for key,value in profile.items():
   if re.search(r'password|username|secret|auth.?key',key,re.I):assert value['semantic'] in ('','%U','%P'),('Unexpected credential literal; keep private',key)
  if name in profiles:assert profiles[name]['fields']==profile
  else:profiles[name]={'fields':profile,'plaintext':row['output'],'interpretation':'Semantic reporting view only. Raw quoted USP values are retained separately; this tool does not generate imports or execute payloads.'}
 old=profiles['ENC_CFGBOQA112']['fields'];new=profiles['ENC_CFGBOQA114.org']['fields']
 diff={'added':{k:new[k] for k in sorted(new.keys()-old.keys())},'removed':{k:old[k] for k in sorted(old.keys()-new.keys())},'changed':{k:{'112':old[k],'114':new[k]} for k in sorted(old.keys()&new.keys()) if old[k]!=new[k]},'assignment_counts':{'112':len(old),'114':len(new)},'boot_parameter_counts':{name:sum(bool(re.match(r'Device\.LocalAgent\.Controller\.1\.BootParameter\.\d+\.ParameterName$',k)) for k in v['fields']) for name,v in profiles.items()}}
 saved=[]
 private_groups=[ROOT/'config-private/stored-db-cross-device-20261026',ROOT/'config-private/third-g6-analysis-20261026',ROOT/'config-private/fourth-g6-analysis-20261026']
 for group in private_groups:
  for p in sorted(group.rglob('cfg_update_remote_encryption.kv')):
   b=p.read_bytes();fields=parse(b);extra=sorted(fields.keys()-new.keys());changed=[k for k in sorted(new.keys()&fields.keys()) if new[k]['raw']!=fields[k]['raw']]
   assert extra==['$encryption'] and fields['$encryption']['raw']=='1' and not changed
   saved.append({'input':fp(p),'extra_fields':{'$encryption':'1'},'all_99_original_assignments_match_114_exactly':True,'CRLF_count':b.count(b'\r\n'),'scope':'The file is readable key/value text in these captures despite its _encryption name. The encryption metadata is not an AES-GCM whole-file wrapper.'})
 usp=[]
 stores=[('G6-A',source_path('private-source://G6-A/stored-configs')),('G6-B',source_path('private-source://G6-B/stored-configs')),('G6-C',ROOT/'config-private/third-g6-analysis-20261026/ubifs-mtd06_rootfs_data1'),('G6-D',ROOT/'config-private/fourth-g6-analysis-20261026/ubifs-mtd06_rootfs_data1'),('Beacon9',B9/'config-private/provisioning-analysis-20261027/configs-p28')]
 for label,store in stores:
  p=next(store.rglob('usp.db'));c=sqlite3.connect(p.as_uri()+'?mode=ro',uri=True);rows=c.execute('select value from data_model').fetchall();c.close();values=[r[0] for r in rows]
  usp.append({'device':label,'input':fp(p),'rows':len(rows),'contains_operator_broker':any(v=='verne.superwifi-cpe.ooredoo.qa' for v in values),'contains_controller_endpoint':any(v=='self.nokia:nwcc' for v in values),'limit':'Exact value witnesses in saved hashed-key SQLite store, not a live connection, enable flag, successful authentication or complete URI/hash mapping.'})
 exportflags=[]
 for label,p in [('G6-A',ROOT/'config-private/config_beacon_g6.json'),('Beacon9',B9/'config-private/config_beacon_9.json')]:
  records=json.loads(p.read_text());flags={}
  for i,key in enumerate(records[:-1]):
   if key in ('$InternetGatewayDevice.ManagementServer.X_ASB_COM_TR369Agent_Enable','$InternetGatewayDevice.ManagementServer.X_ASB_COM_TR181Enabled','$InternetGatewayDevice.ManagementServer.EnableCWMP'):flags[key[1:]]=records[i+1][3:]
  exportflags.append({'device':label,'input':fp(p),'flags':flags,'limit':'Values in the supplied export capture, not necessarily simultaneous with saved raw flash or current state. The owner changed mutable settings on these devices.'})
 marker=[]
 for group in private_groups:
  for p in group.rglob('cfg_update_remote_file_name'):marker.append({'input':fp(p),'NUL_terminated_filename':p.read_bytes().split(b'\0',1)[0].decode('ascii'),'limit':'A retained filename is bookkeeping, not an atomic timeline or proof which file was most recently applied.'})
 hb=source_path('private-source://SOURCE-085/HB_Config.json');h=json.loads(hb.read_text());policies={'source':fp(hb),'normal_reset_whitelist':h['FactoryResetParams']['FactoryResetNormalWhiteList'],'deep_reset_whitelist':h['FactoryResetParams']['FactoryResetDeepWhiteList'],'dynamic_backup_file_list':h['DataGuardianParams']['DynamicBackupFileList'],'limit':'Shipped preservation/backup policy; no live reset, restore, upgrade or persistence guarantee tested.'}
 inventory=[]
 for group in private_groups:
  for p in sorted(group.rglob('*')):
   if not p.is_file() or p.is_symlink():continue
   if p.name in ('cfg_update_remote_encryption.kv','cfg_update_remote_avalible','cfg_update_remote_file_name','custom.cfg','se.conf','usp.db','tr181.db','tr.conf','tr181.conf','default_scfg.txt','scfg.txt','http_privkey.pem','http_pubkey.pem') or p.name.startswith('ENC_CFG'):inventory.append(fp(p))
 b9root=B9/'config-private/provisioning-analysis-20261027/configs-p28';b9parts=B9/'stock-firmware/router-emmc-20261014-033951/partitions'
 decoder=module(ROOT/'webui/scripts/decrypt-stored-config.py','stored');negative={}
 try:decoder.decrypt_stored((b9root/'dmdb_encryption.cfg').read_bytes(),decoder.derive_key10(private_value('B9-A:RI-G984Serial').encode(),private_value('PROGDATE-D').encode()))
 except ValueError as e:negative={'input':fp(b9root/'dmdb_encryption.cfg'),'serial_source':'B9-A:RI-G984Serial','ProgDate_source':'PROGDATE-D','source5':'invalid_key_src5_str','result':'failed','error':str(e),'limit':'This exact G6 missing-source5 profile failed; no proof of why or a universal B9 decryptability claim.'}
 else:raise AssertionError('Earlier negative result changed')
 from cryptography.hazmat.primitives import serialization
 private=serialization.load_pem_private_key((b9root/'http_privkey.pem').read_bytes(),None);public=serialization.load_pem_public_key((b9root/'http_pubkey.pem').read_bytes());encode=lambda k:k.public_bytes(serialization.Encoding.DER,serialization.PublicFormat.SubjectPublicKeyInfo);assert encode(private.public_key())==encode(public)
 b9keys={'private':fp(b9root/'http_privkey.pem'),'public':fp(b9root/'http_pubkey.pem'),'pair_matches':True,'RSA_bits':public.key_size,'SPKI_sha256':hashlib.sha256(encode(public)).hexdigest()}
 # New direct source bindings are kept separately from earlier immutable records.
 stock=[]
 for label,rom in [('G6_IJL',Path('/tmp/g6-old-slot-review-20261025-by5iaikl/old')),('G6_HJL',Path('/tmp/g6-old-slot-review-20261025-by5iaikl/new')),('Beacon9',Path('/tmp/beacon9-stock-root'))]:
  for rel in ('usr/lib/libzeroman.so','usr/lib/libdbgen.so','usr/lib/libsec_engine.so','usr/lib/libcfg.so','usr/bin/cfgmgr','usr/bin/dbgen_bin','etc/HB_Config.json','etc/preconfiguration_global.xml','usr/bin/system_init.sh'):
   p=rom/rel
   if p.is_file():stock.append({'profile':label,'relative':rel,**fp(p)})
 report={'schema_version':1,'verified_on':'2026-10-27','scope':'Offline supplied-capture analysis. No router contact, import, activation/reset, flash write or OTA/server query. Original crypto API only was separately tested under QEMU.','decoded_Zeroman':decoded,'operator_profiles':profiles,'112_vs_114':diff,'saved_remote_KV_relationship':saved,'saved_remote_filenames':marker,'USP_SQLite_witnesses':usp,'supplied_export_flags':exportflags,'preservation_policy':policies,'captured_G6_provisioning_inventory':inventory,'Beacon9':{'selected_cfg_image':fp(b9parts/'mmcblk0p28.img'),'selected_private_inventory':fp(B9/'config-private/provisioning-analysis-20261027/private-file-inventory.json'),'selected_zeroman_content_file_count':sum(1 for p in (b9root/'zeroman').rglob('*') if p.is_file() and 'content' in p.parts),'alternate_cfg_image':fp(b9parts/'mmcblk0p29.img'),'alternate_backup_inventory':fp(B9/'config-private/provisioning-analysis-20261027/private-p29-backup-inventory.json'),'alternate_reset_backup_empty':True,'opt_backup_path_lookup':'/.backup/configs/zeroman/3/content not found in saved p31; other paths not exhaustively reconstructed.','G6_key10_profile_test':negative,'HTTP_keys':b9keys},'stock_sources':stock,'static_trace_limits':'Annotated disassembly is heuristic literal/GOT assistance, not a full data-flow engine. Raw instructions and explicitly traced register use are authoritative. No provisioning callback was executed.','established_placeholder_path_G6_HJL':{'function':'libdbgen.so restoreRemoteCfg0x516c..0x72d8','identity_setup':'0x60dc..0x6258,0x6690..0x67b4','substitution':'0x67b4..0x69fc','M_and_U':'RI MACAddress parsed, colon separators changed to hyphens, uppercase; same output for both tokens on success path.','P':'get_default_wifi_password0xcf4c -> selected preconfiguration WLAN1 PreSharedKey callback0x96c8, using fri/getFromRI and value attribute; not a literal password in the common package or ordinary current-WiFi getter.','S':'ALCL prefix plus uppercased RI G984Serial.','O':'ManufacturerOUI value when available.','limit':'Static successful-source path, not a new live placeholder/account/login test.'},'local_certificate_key_references':{'key15':'SE_getKeyByName then SE_keyFileEncrypt in Zeroman certificate path. Implementation reads private-key PEM/DER and writes private-key PEM with aes256/passphrase; captured value/provider not established.','key16':'SE_getKeyByName then SE_certSign in Zeroman certificate path. Copies certificate bytes and appends32-byteSHA256-based local integrity tag; this is not X509 issuance or recovery of Nokia vendor signing private key.','static_named_store_presence':'Neither key15 nor key16 occurs in the three examined eleven-entry static stores; caller references do not prove a live value.'},'remaining_unknowns':['Original distribution/archive/signature provenance of the delivered CFGBOQA payloads; numeric filenames do not date shipment.','Exact complete application/migration ordering for every reset/operator/build branch.','Live service enabled/reachable/authenticated state and current values.','Effective B9 key10 sources/format differences after the failed exact G6 profile test.','Complete certificate key15/16 provisioning/source lifecycle; no real key15/16 value supplied.','Complete URI/hash mapping of USP SQLite and unparsed stored binary datamodel values.']}
 follow=ROOT/'writeups/xs2426xa-24-03-comparison/resources/ota-research.json'
 if follow.exists():
  report['current_followup']={'date':'2026-10-27','ONT_OTA_evidence':fp(follow),'source5_evidence':fp(ROOT/'writeups/xs2426xa-24-03-comparison/resources/Beacon9-stored-db-all-captures.json'),'scope':'Correctfactorysource5 resolved B9storedDBs; originalfailedG6profile retained as negativefixture. ONTOTAonly2approvedworkstationPOSTs/nooffer; nativeallowlistedOTAgetter readsnotgenericediting.'}
  report['remaining_unknowns']=[x for x in report['remaining_unknowns'] if not x.startswith('Effective B9 key10 sources/')]
  report['local_certificate_key_references']['static_named_store_presence']='Neitherkey15nor16 occurs in any of five examinedstaticstores; livevalue/lifecycle unresolved.'
 report=public_record(report)
 a.out.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'decoded_files':len(decoded['files']),'distinct_operator_plaintexts':len(profiles),'profile_assignments':diff['assignment_counts'],'added_in114':len(diff['added']),'removed_in114':len(diff['removed']),'changed_in114':len(diff['changed']),'saved_KV_copies_with_same114_assignments':len(saved),'USP_witnesses':[{k:x[k] for k in ('device','rows','contains_operator_broker','contains_controller_endpoint')} for x in usp],'B9_empty_Zeroman_contents':report['Beacon9']['selected_zeroman_content_file_count']==0,'B9_HTTP_RSA_bits':public.key_size},indent=2))
if __name__=='__main__':main()
