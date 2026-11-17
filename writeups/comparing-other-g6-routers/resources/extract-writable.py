#!/usr/bin/env python3
"""Extract the supplied G6 writable UBI stores privately, never execute their files."""
import argparse,hashlib,json,os,subprocess,sys
from pathlib import Path

def main():
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--capture',required=True,type=Path);ap.add_argument('--private-output',required=True,type=Path);ap.add_argument('--tool-path',required=True);ap.add_argument('--report',required=True,type=Path);a=ap.parse_args()
 if a.report.exists():raise FileExistsError('Use a new report path')
 a.private_output.mkdir(parents=True,exist_ok=True,mode=0o700)
 env=dict(os.environ,PYTHONPATH=a.tool_path);results=[];inventory=[]
 for name in ('mtd05_rootfs_data0','mtd06_rootfs_data1','mtd07_cfg','mtd08_log','mtd11_user_data'):
  dest=a.private_output/('ubifs-'+name);log=a.private_output/(name+'-ubifs-extract.log')
  if dest.exists() or log.exists():raise FileExistsError('Use unused extraction paths')
  with log.open('xb') as f:
   result=subprocess.run([sys.executable,'-m','ubireader.scripts.ubireader_extract_files','-o',str(dest),str(a.capture/(name+'.bin'))],stdout=f,stderr=subprocess.STDOUT,env=env,check=False)
  files=[p for p in dest.rglob('*') if p.is_file() and not p.is_symlink()] if dest.exists() else []
  for p in files:
   b=p.read_bytes();inventory.append({'partition':name,'source':str(p),'relative_path':str(p.relative_to(dest)),'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()})
  results.append({'partition':name,'exit_code':result.returncode,'private_output':str(dest),'private_log':str(log),'files':len(files),'extracted_bytes':sum(p.stat().st_size for p in files)})
 inv=a.private_output/'private-file-inventory.json';inv.write_text(json.dumps(inventory,indent=2)+'\n')
 report={'scope':'Offline UBI Reader indexed extraction; no journal replay or file execution. Extraction failure or stale nodes are not diagnoses of flash damage. Sensitive outputs remain private.','tool_path':a.tool_path,'results':results,'private_inventory':{'source':str(inv),'bytes':inv.stat().st_size,'sha256':hashlib.sha256(inv.read_bytes()).hexdigest()}}
 a.report.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
if __name__=='__main__':main()
