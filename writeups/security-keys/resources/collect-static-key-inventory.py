#!/usr/bin/env python3
"""Offline lengths/representations/equality of static keys; no secret values printed."""
import argparse,hashlib,importlib.util,json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
from publication_aliases import public_record
def main():
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--root',action='append',required=True,help='LABEL=EXTRACTED_ROOT');ap.add_argument('--out',type=Path,required=True);a=ap.parse_args()
 if a.out.exists():raise FileExistsError(a.out)
 spec=importlib.util.spec_from_file_location('prepare',ROOT/'webui/scripts/prepare-config-keys.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);stores={};sources={}
 for argument in a.root:
  label,sep,path=argument.partition('=')
  if not sep or not label or label in stores:raise ValueError('unique LABEL=PATH required')
  root=Path(path);stores[label]=dict(m.static_keys(root,m.backup_module()));sources[label]={}
  for name in ('usr/etc/se.conf','usr/etc/sec.key'):
   p=root/name;sources[label][name]={'source':str(p),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
 rows=[]
 for name in sorted(set().union(*(set(x) for x in stores.values()))):
  profiles={}
  for label,store in stores.items():
   value=store.get(name)
   if value is None:profiles[label]={'present':False};continue
   form='opaque ASCII string'
   if re.fullmatch(r'(?:[0-9a-fA-F]{2}[: ])+[0-9a-fA-F]{2}',value):form='two-digit hexadecimal bytes separated by '+('colons' if ':' in value else 'spaces')
   elif re.fullmatch(r'[0-9A-Fa-f]+',value) and len(value)%2==0:form='hexadecimal characters'
   profiles[label]={'present':True,'stored_string_bytes':len(value.encode()),'representation':form}
  rows.append({'name':name,'profiles':profiles,'all_equal':len({s.get(name) for s in stores.values()})==1,'equality_groups':[[label for label in stores if stores[label].get(name)==value] for value in dict.fromkeys(store.get(name) for store in stores.values())]})
 output={'scope':'Offline static-container decode/integrity checks; values withheld. Equal packaged entries are not universal/live-state claims.','all_integrity_checks_passed':True,'sources':sources,'entries':rows}
 output=public_record(output)
 with a.out.open('x',encoding='utf-8') as f:f.write(json.dumps(output,indent=2)+'\n')
 print('Verified',len(stores),'static containers;',len(rows),'named entries; wrote metadata only.')
if __name__=='__main__':main()
