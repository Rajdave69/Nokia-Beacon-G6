#!/usr/bin/env python3
"""Read-only regular-file/symlink comparison of two extracted roots; never executes them."""
import argparse,hashlib,json,os
from pathlib import Path
def inventory(root):
 out={}
 for base,dirs,files in os.walk(root,followlinks=False):
  base=Path(base)
  for name in dirs+files:
   p=base/name;rel=str(p.relative_to(root))
   if p.is_symlink():out[rel]={'type':'symlink','target':os.readlink(p)}
   elif p.is_file():
    b=p.read_bytes();out[rel]={'type':'file','bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()}
 return out
def main():
 ap=argparse.ArgumentParser();ap.add_argument('old',type=Path);ap.add_argument('new',type=Path);ap.add_argument('output',type=Path);a=ap.parse_args()
 if a.output.exists():raise FileExistsError(a.output)
 old,new=inventory(a.old),inventory(a.new);common=set(old)&set(new);changes=[{'path':p,'old':old.get(p),'new':new.get(p)} for p in sorted(set(old)|set(new)) if old.get(p)!=new.get(p)]
 out={'old_root':str(a.old),'new_root':str(a.new),'counts':{'old_entries':len(old),'new_entries':len(new),'added':len(set(new)-set(old)),'removed':len(set(old)-set(new)),'changed':sum(old[p]!=new[p] for p in common),'unchanged':sum(old[p]==new[p] for p in common)},'changes':changes,'old_inventory':old,'new_inventory':new,'limit':'Extracted research directories; no firmware boot, service or vulnerability test.'}
 a.output.write_text(json.dumps(out,indent=2)+'\n',encoding='utf-8');print(json.dumps(out['counts']))
if __name__=='__main__':main()
