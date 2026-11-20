#!/usr/bin/env python3
"""Compare fourth-G6 saved databases, service keys and log metadata offline."""
import argparse,collections,hashlib,importlib.util,io,json,re,sqlite3,struct,tarfile,urllib.parse
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
def load(path,name):
 spec=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
def fp(path):
 data=path.read_bytes();return {'source':str(path),'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()}
def main():
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--private-root',required=True,type=Path);ap.add_argument('--initial-report',required=True,type=Path);ap.add_argument('--report',required=True,type=Path);a=ap.parse_args()
 if a.report.exists():raise FileExistsError('Use a new report')
 inventory=json.loads((a.private_root/'private-file-inventory.json').read_text());initial=json.loads(a.initial_report.read_text());identity=initial['factory']['identity']
 roots={}
 for tag in ('mtd06_rootfs_data1','mtd07_cfg','mtd11_user_data','mtd08_log'):
  for item in inventory:
   if item['partition']==tag:
    p=Path(item['source']);relative=Path(item['relative_path']);root=p
    for _ in relative.parts[2:]:root=root.parent
    roots[tag]=root;break
 decoder=load(ROOT/'writeups/stored-configuration-database/resources/decrypt-stored-config.py','decoder');key=decoder.derive_key10(identity['G984Serial'].encode(),identity['ProgDate'].encode())
 dbs=[]
 for p in sorted(a.private_root.glob('ubifs-*/**/dmdb_encryption.cfg*')):
  data=p.read_bytes();raw,meta=decoder.decrypt_stored(data,key)
  target=a.private_root/('decoded-'+hashlib.sha256(data).hexdigest()+'.bin')
  if not target.exists():
   with target.open('xb') as f:f.write(raw)
   target.chmod(0o600)
  else:assert target.read_bytes()==raw
  dbs.append({'input':fp(p),'decoded':fp(target),'metadata':meta})
 assert len(dbs)==6
 negatives=[]
 primary=Path(next(x['input']['source'] for x in dbs if 'mtd06_' in x['input']['source'] and x['input']['source'].endswith('.cfg')))
 for name,serial,date,source5 in [('uppercased_serial',identity['G984Serial'].upper().encode(),identity['ProgDate'].encode(),b'invalid_key_src5_str'),('wrong_programming_date',identity['G984Serial'].encode(),b'241022',b'invalid_key_src5_str'),('wrong_source5',identity['G984Serial'].encode(),identity['ProgDate'].encode(),b'wrong-source5')]:
  try:decoder.decrypt_stored(primary.read_bytes(),decoder.derive_key10(serial,date,source5))
  except ValueError as exc:negatives.append({'case':name,'rejected':True,'error':str(exc)})
  else:raise AssertionError('Wrong derivation accepted')
 data1=roots['mtd06_rootfs_data1'];backup=roots['mtd11_user_data']/'.backup/configs';cfg=roots['mtd07_cfg'];logs=roots['mtd08_log']
 comparisons=[]
 for rel in ('dmdb_encryption.cfg','dmdb_encryption.cfg.bak','cfg_update_remote_encryption.kv','overlay/etc/config/network','overlay/etc/config/wireless','overlay/etc/dropbear/dropbear_rsa_host_key','overlay/etc/dropbear/dropbear_ed25519_host_key'):
  x=data1/rel;y=backup/rel;comparisons.append({'name':rel,'data1_present':x.is_file(),'backup_present':y.is_file(),'equal':x.read_bytes()==y.read_bytes() if x.is_file() and y.is_file() else None})
 from cryptography.hazmat.primitives import serialization
 private=serialization.load_pem_private_key((data1/'http_privkey.pem').read_bytes(),password=None);public=serialization.load_pem_public_key((data1/'http_pubkey.pem').read_bytes())
 encode=lambda k:k.public_bytes(serialization.Encoding.DER,serialization.PublicFormat.SubjectPublicKeyInfo)
 canonical=hashlib.sha256(encode(public)).hexdigest();assert encode(private.public_key())==encode(public)
 prior=json.loads((ROOT/'writeups/security-keys/resources/persistent-host-key-inventory.json').read_text())
 services={'HTTP':{'private':fp(data1/'http_privkey.pem'),'public':fp(data1/'http_pubkey.pem'),'canonical_public_SPKI_sha256':canonical,'RSA_bits':public.key_size,'pair_matches':True,'differs_from_each_previous_G6':all(canonical!=x['canonical_public_SPKI_sha256'] for x in prior['sources'] if x.get('canonical_public_SPKI_sha256'))},'Dropbear':[]}
 for rel in ('overlay/etc/dropbear/dropbear_rsa_host_key','overlay/etc/dropbear/dropbear_ed25519_host_key'):
  item=fp(data1/rel);item['differs_from_each_previous_saved_private_file']=all(item['sha256']!=x['sha256'] for x in prior['sources'] if x['relative_source']==rel);services['Dropbear'].append(item)
 loginputs=[];nested=[];version_counter=collections.Counter();urlleads=[];versionfiles={};logkeywords={}
 def inspect(label,data):
  ids=collections.Counter(x.decode() for x in re.findall(rb'3(?:FE|TN)[0-9]{5}[A-Z0-9]{6}',data));version_counter.update(ids)
  if ids:versionfiles[label]=dict(ids)
  for match in re.finditer(rb'https?://[\x21-\x7e]{5,4096}',data):
   rawurl=match.group().decode().rstrip('"\',;)}]')
   try:u=urllib.parse.urlsplit(rawurl);host=u.hostname
   except ValueError:continue
   if host not in ('swupd.wifi.nokia.com','ota.console.wifi.nokia.com'):continue
   urlleads.append({'log':label,'host':host,'firmware_path':u.path if host=='ota.console.wifi.nokia.com' and re.search(r'3(?:FE|TN)[0-9]{5}[A-Z0-9]{6}',u.path) else None,'has_query':bool(u.query),'private_URL_sha256':hashlib.sha256(rawurl.encode()).hexdigest()})
  logkeywords[label]={k:len(re.findall(re.escape(k.encode()),data,re.I)) for k in ('download','upgrade','activate','rollback','panic','swug','EXT_KEY_FW','key18','Password2')}
 for p in sorted(logs.rglob('*')):
  if not p.is_file():continue
  data=p.read_bytes();loginputs.append(fp(p));inspect(str(p.relative_to(logs)),data)
  if p.name.endswith('.tar.bz2'):
   with tarfile.open(fileobj=io.BytesIO(data),mode='r:*') as tar:
    total=0
    for member in tar.getmembers():
     if not member.isfile():continue
     total+=member.size
     if member.size>16*1024*1024 or total>32*1024*1024:raise ValueError('Nested archive bound')
     content=tar.extractfile(member).read(member.size+1);assert len(content)==member.size
     target=a.private_root/('log-member-'+hashlib.sha256(content).hexdigest()+'.bin')
     if not target.exists():target.write_bytes(content)
     nested.append({'archive':fp(p),'archive_magic_hex':data[:4].hex(),'suffix_is_compression_authority':False,'member_name':member.name,'content':fp(target)});inspect(p.name+':'+member.name,content)
 usp=data1/'usp.db';con=sqlite3.connect('file:'+str(usp)+'?mode=ro',uri=True)
 tables=[x[0] for x in con.execute("select name from sqlite_master where type='table'")];con.close()
 report={'schema_version':1,'verified_on':'2026-10-26','scope':'Offline saved-file analysis; no live security-engine query, native firmware execution, import, router operation or network request.','identity_inputs':{'serial_source':identity['G984Serial'],'ProgDate_source':identity['ProgDate'],'source5':'invalid_key_src5_str'},'stored_databases':dbs,'negative_key10_cases':negatives,'backup_comparisons':comparisons,'service_keys':services,'stock_persistence_payloads':{name:any(p.name==name for p in a.private_root.glob('ubifs-*/**/*')) for name in ('replace_with_test.sh','pre_app_boot.sh','per_app_boot.sh','per_mount_boot.sh','sec_cli_password2_overlay','password2.txt')},'operator_provisioning_filenames':sorted({p.name for p in a.private_root.glob('ubifs-*/**/ENC_CFG*')}),'old_config_version_source':'3TN00121LJJJ37' if '3TN00121LJJJ37' in (cfg/'se.conf').read_text() else None,'SQLite_USP':{'source':fp(usp),'table_names':tables,'limit':'Database presence is not a live enabled/reachability measurement.'},'logs':{'inputs':loginputs,'nested_members':nested,'image_ID_occurrences':dict(version_counter),'image_ID_occurrences_by_file':versionfiles,'sanitized_Nokia_URL_leads':urlleads,'keyword_counts':logkeywords,'limit':'Saved timestamps/log statements are historical evidence, not independently verified wall-clock time, server availability or current daemon state. Old/rotated/kernel-pstore material is not a new complete installed firmware.'},'limits':['CBC CRC/padding/zlib/schema checks are not MAC/AEAD authentication.','No fourth WebUI export, live shadow or SE key18 status supplied.','Canonical Dropbear public-key equality was not tested; measured file bytes only.','Extraction reflects indexed committed tree as interpreted by this tool, not live-state or atomicity proof.']}
 a.report.write_text(json.dumps(report,indent=2)+'\n')
 print(json.dumps({'stored_files_decoded':len(dbs),'database_metadata':[x['metadata'] for x in dbs],'HTTP_key_bits':public.key_size,'HTTP_key_new':services['HTTP']['differs_from_each_previous_G6'],'operator_files':report['operator_provisioning_filenames'],'versions_in_saved_logs':dict(version_counter),'Nokia_URL_leads':len(urlleads),'nested_log_members':len(nested),'persistence_payload_presence':report['stock_persistence_payloads']},indent=2))
if __name__=='__main__':main()
