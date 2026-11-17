#!/usr/bin/env python3
"""Verify documentation consolidation, without crypto reruns or router access."""
import ast,hashlib,json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
B9=ROOT.parent/'Nokia-Beacon-9'
NEW='comparing-other-g6-routers'
ARCHIVE=ROOT/'config-private/g6-comparison-consolidation-20261105'
ledger=json.loads((ARCHIVE/'manifest.json').read_text())
OLD=ledger['old_subjects']
script=ast.parse((ARCHIVE/'consolidate-attempt.py').read_text())
fn=next(x for x in script.body if isinstance(x,ast.FunctionDef) and x.name=='rewrite')
ns={'OLD':OLD,'NEW':NEW};exec(compile(ast.Module(body=[fn],type_ignores=[]),'retained-rewrite','exec'),ns)
rewrite=ns['rewrite']
lookup={v['archive']:k for k,v in ledger['archived_originals'].items()}
def norm(value):
 if isinstance(value,dict):return {rewrite(k):norm(v) for k,v in value.items()}
 if isinstance(value,list):return [norm(x) for x in value]
 if isinstance(value,str):
  value=lookup.get(value,value)
  value=rewrite(value)
  if re.match(r'^[A-Za-z]:[\\/]',value):value='/mnt/'+value[0].lower()+'/'+value[3:].replace('\\','/')
  return value
 return value
for original,entry in ledger['archived_originals'].items():
 data=Path(entry['archive']).read_bytes()
 assert len(data)==entry['bytes'] and hashlib.sha256(data).hexdigest()==entry['sha256'],original
merged=json.loads((ROOT/'knowledgebases'/f'{NEW}-evidence.json').read_text())
for old,key in ledger['evidence_record_keys'].items():
 original=ARCHIVE/'originals'/ROOT.name/'knowledgebases'/f'{old}-evidence.json'
 assert norm(json.loads(original.read_text()))==norm(merged[key]),key
 assert hashlib.sha256(original.read_bytes()).hexdigest()==merged['original_records'][key]['original_sha256']
 assert Path(merged['original_records'][key]['archive']).is_file()
for row in ledger['moved_resources']:
 assert not (ROOT/row['from']).exists()
 assert (ROOT/row['to']).is_file()
for old in OLD:
 assert not (ROOT/'writeups'/old).exists()
 assert not (ROOT/'knowledgebases'/f'{old}.md').exists()
 assert not (ROOT/'knowledgebases'/f'{old}-evidence.json').exists()
 assert not (ROOT/'knowledgebases/source-records'/f'{old}.json').exists()
for project in [ROOT,B9]:
 spec=json.loads((project/'knowledgebases/subject-source-map.json').read_text())
 for name,subject in spec['subjects'].items():
  assert (project/'knowledgebases'/subject['primary']).is_file(),(project,name)
  for pattern in subject['source_patterns']:
   assert any(p.is_file() and not p.is_symlink() for p in project.glob(pattern)),(project,name,pattern)
 if project==ROOT:assert all(n not in spec['subjects'] for n in OLD) and NEW in spec['subjects']
resources=ROOT/'writeups'/NEW/'resources'
for p in list(resources.glob('*.py'))+[ROOT/'writeups/firmware-versions-and-builds/resources/collect-version-metadata.py']:
 ast.parse(p.read_text());assert p.resolve().is_relative_to(ROOT.resolve())
for p in resources.glob('*.py'):
 if 'parents[3]' in p.read_text():assert p.resolve().parents[3]==ROOT
# Confirm actual nested selections used by the relocated consumers.
assert merged['second_device_and_builds']['rootfs_payloads']
assert merged['third_device']['capture']['partition_files']['mtd00_ssb.bin']
assert merged['fourth_device']['reports']['writable_comparison']['stored_databases']
# Only current edited/new Markdown; historical captured source snapshots excluded.
docs={ROOT/'writeups'/NEW/'README.md',ROOT/'knowledgebases'/f'{NEW}.md',resources/'README.md',ROOT/'README.md',ROOT/'writeups/README.md'}
for original in ledger['reference_files_rewritten']:
 p=Path(original)
 if p.suffix.lower()=='.md' and p.exists() and p.name!='README.private.md':docs.add(p)
links=0;missing=[]
for p in docs:
 for target in re.findall(r'\]\(([^)]+)\)',p.read_text()):
  if target.startswith(('#','/tmp/','<')) or '://' in target or target.startswith('mailto:'):continue
  q=p.parent/target.split('#')[0]
  if not q.exists():
   if q.parent.is_dir() and q.name.lower() in {x.name.lower() for x in q.parent.iterdir()}:continue
   missing.append([str(p),target])
  links+=1
assert not missing,json.dumps(missing,indent=2)
print(json.dumps({'all_passed':True,'archived_originals':len(ledger['archived_originals']),'original_evidence_records_preserved':3,'moved_resources':len(ledger['moved_resources']),'markdown_links_checked':links,'retired_subjects':len(OLD),'new_subject':NEW,'scope':'No cryptographic/firmware/boot/network reruns; documentation/schema/path/hash/AST validation only'},indent=2))
