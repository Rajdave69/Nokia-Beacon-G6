#!/usr/bin/env python3
"""Validate captured-file results and source5 negatives; no firmware/router execution."""
from pathlib import Path as _PublicationPath
import json as _publication_json
import re as _publication_re

def _publication_input(alias):
    project = next(p for p in _PublicationPath(__file__).resolve().parents
                   if (p / 'writeups').is_dir())
    registry = (project / 'writeups/README.private.md').read_text(encoding='utf-8')
    payload = _publication_re.search(r'```json\s*\n(.*?)\n```', registry, _publication_re.S)
    return _publication_json.loads(payload[1])['private_values'][alias]

from pathlib import Path
import hashlib,importlib.util,json,re,csv
ROOT=Path(__file__).resolve().parents[3]
RES=Path(__file__).resolve().parent
PRIVATE=ROOT/'config-private/xs2426xa-analysis-20261027'
def module(p,n):
 s=importlib.util.spec_from_file_location(n,p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
def main():
 initial=json.loads((RES/'initial-inspection.json').read_text(encoding='utf-8'))
 for item in initial['capture']['partition_files'].values():
  b=Path(item['source']).read_bytes();assert len(b)==item['bytes'] and hashlib.sha256(b).hexdigest()==item['sha256']
 assert initial['capture']['main_area_bytes']==512*1024*1024 and initial['capture']['archive']['partition_hash_matches']==12
 rebuild=module(RES/'reconstruct-source5.py','source5');decoder=module(ROOT/'writeups/configuration-import-export/resources/stored-database/decrypt-stored-config.py','decoder')
 negatives=[]
 for label,fieldsfile,sourcefile,serial,date,inputfile in [
 ('ONT','factory-decoded-native.json','reconstructed-source5.bin',_publication_input('RESEARCH-INPUT-1FB93FBAC8CD').encode(),b'250910',next(PRIVATE.glob('ubifs-mtd06*/**/dmdb_encryption.cfg'))),
 ('B9','B9-factory-decoded-native.json','B9-reconstructed-source5.bin',_publication_input('RESEARCH-INPUT-C54EBC5AC154').encode(),b'260527',ROOT.parent/'Nokia-Beacon-9/config-private/provisioning-analysis-20261027/configs-p28/dmdb_encryption.cfg')]:
  fields=json.loads((PRIVATE/fieldsfile).read_text());source,selected=rebuild.reconstruct(fields);assert source==(PRIVATE/sourcefile).read_bytes() and len(source)==44
  raw,meta=decoder.decrypt_stored(inputfile.read_bytes(),decoder.derive_key10(serial,date,source))
  altered=dict(fields);name='EXT_RANDOM_VAR';v=bytearray.fromhex(altered[name]);v[0]^=1;altered[name]=v.hex();wrong,_=rebuild.reconstruct(altered)
  assert wrong!=source
  try:decoder.decrypt_stored(inputfile.read_bytes(),decoder.derive_key10(serial,date,wrong))
  except ValueError as ex:negatives.append({'device':label,'case':'one decoded factory field altered','rejected':True,'error':str(ex)})
  else:raise AssertionError('wrong source accepted')
 checked=0
 for f in ['stored-db-source5-results.json','stored-db-boundary-checks.json','Beacon9-stored-db-all-captures.json']:
  report=json.loads((RES/f).read_text());rows=report if isinstance(report,list) else report['files']
  for item in rows:
   if not item.get('success'):continue
   data=Path(item.get('decoded_source') or item.get('private_decoded')).read_bytes();meta=item['metadata'];assert hashlib.sha256(data).hexdigest()==meta['plaintext_sha256'] and len(data)==meta['decompressed_bytes'];checked+=1
 for bank in [0,1]:
  d=json.loads((RES/'operator-policy-summary.json').read_text())[str(bank)];rows=list(csv.DictReader((RES/f'bank{bank}-operator-policy.csv').open(encoding='utf-8')));assert len(rows)==d['parameter_rows']
 schema=json.loads((RES/'schema-diff.json').read_text());assert len(schema['added'])==1 and schema['added'][0]['parameter']=='DynamicbSTA' and not schema['removed'] and not schema['changed']
 kernel=json.loads((RES/'kernel-comparison.json').read_text());assert kernel['differing_uncompressed_byte_count']==24 and kernel['difference_classification']['comparison_equal_after_only_host_and_build_ID_normalization']
 full=json.loads((RES/'rootfs-file-comparison.json').read_text());a,b=full['old_inventory'],full['new_inventory'];assert sum(a.get(x)!=b.get(x) for x in set(a)|set(b))==13+14+286
 # Exact secret-value scan over this task's public artifacts, without printing any matches.
 prepare=module(ROOT/'webui/scripts/prepare-config-keys.py','prepare');keys=dict(prepare.static_keys(PRIVATE/'bank1-root',prepare.backup_module()));secrets=[x.encode() for x in keys.values() if len(x)>=10]
 import xml.etree.ElementTree as ET
 xml=ET.fromstring((PRIVATE/'bank1-preconfiguration.xml').read_bytes().removesuffix(b'\0'))
 secrets += [e.attrib['v'].encode() for e in xml.iter() if e.attrib.get('dburi','').endswith('X_ALU-COM_SwMgnt.X_ALU-COM_Client_Auth_Key')]
 for name in ['factory-decoded-native.json','B9-factory-decoded-native.json']:
  secrets += [bytes.fromhex(v) for v in json.loads((PRIVATE/name).read_text()).values() if len(bytes.fromhex(v))>=10]
 secrets += [(PRIVATE/x).read_bytes() for x in ['reconstructed-source5.bin','B9-reconstructed-source5.bin']]
 public=list(RES.rglob('*'))+[RES.parent/'README.md',ROOT.parent/'Nokia-Beacon-9/writeups/sec-extfs-source5/README.md',ROOT/'knowledgebases/xs2426xa-analysis-evidence.json',ROOT/'knowledgebases/xs2426xa-24-03-comparison.md',ROOT.parent/'Nokia-Beacon-9/knowledgebases/sec-extfs-source5.md'];n=0
 for p in public:
  if not p.is_file() or p.name=='validation-results.json':continue
  data=p.read_bytes();assert not any(s in data for s in secrets),('Private material in public artifact',str(p));n+=1
 links=0
 for p in [RES.parent/'README.md',ROOT.parent/'Nokia-Beacon-9/writeups/sec-extfs-source5/README.md']:
  for m in re.finditer(r'\[[^\]]+\]\(([^)]+)\)',p.read_text(encoding='utf-8')):
   t=m[1]
   if t.startswith(('http:','https:','#','/')):continue
   assert (p.parent/t.partition('#')[0]).resolve().exists(),(p,t);links+=1
 result={'date':'2026-10-27','all_passed':True,'physical_partition_fingerprints_checked':12,'decoded_result_references_rechecked':checked,'source5_reconstructions_rechecked':2,'wrong_factory_field_cases':negatives,'public_artifacts_checked_for_private_values':n,'new_writeup_links_checked':links,'kernel_schema_policy_rootfs_comparison_checks':True,'scope':'Offline file/result validation. Original factory parser was separately tested under QEMU; this validator executes no firmware or router operation.'}
 (RES/'validation-results.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8');print(json.dumps(result,indent=2))
if __name__=='__main__':main()
