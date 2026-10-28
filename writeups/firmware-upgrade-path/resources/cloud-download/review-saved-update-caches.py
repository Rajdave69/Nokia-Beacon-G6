#!/usr/bin/env python3
"""Offline ASCII firmware-ID/URL review of saved writable captures; no network."""
import hashlib,json,re,urllib.parse
from pathlib import Path
G6=Path(__file__).resolve().parents[4]
def main():
 out=Path(__file__).with_name('saved-update-cache-review.json')
 if out.exists():raise FileExistsError(out)
 report={'date':'2026-10-26 Asia/Riyadh','scope':'Read only saved writable raw dumps, router metadata and first G6 decrypted export. ASCII string scan only; no decompression/decryption/filesystem reconstruction or live log collection. Matches are leads, not proof of complete image existence.','sources':[],'urls':[],'private_original_urls':[],'limits':['No exhaustive negative claim for compressed/encrypted/unscanned data.','The clean dumps omit physical mtd08/log and provide zero-byte logical log/user_data files; these are not usable cache captures.']}
 version_re=re.compile(rb'(?:3FE49996|3TN01100)[A-Z0-9]{6}')
 inputs=[]
 for device,dump in [('ALCLFDE2F68C','beacon-g6-clean-dumps-20260929-200712'),('ALCLFD4B5342','beacon-g6-clean-dumps-20261022-192444')]:
  folder=G6/f'router-flash-{device}'/dump
  for name in ['mtd05_rootfs_data0.bin','mtd06_rootfs_data1.bin','mtd07_cfg.bin','mtd08_log.bin','mtd15_log.bin','mtd16_user_data.bin','mtd17_rootfs_data1.bin','router-metadata.txt']:inputs.append(folder/name)
 inputs.append(G6/'config-private/config_beacon_g6.json')
 raw_urls=[]
 for f in inputs:
  row={'source':str(f),'exists':f.exists()}
  if not f.is_file():report['sources'].append(row);continue
  data=f.read_bytes();row.update(bytes=len(data),sha256=hashlib.sha256(data).hexdigest());counts={}
  for m in version_re.finditer(data):
   value=m.group().decode();counts[value]=counts.get(value,0)+1
  row['image_id_substring_counts']=counts;row['firmware_URL_leads']=0
  for m in re.finditer(rb'https?://[\x21-\x7e]{5,2048}',data):
   raw=m.group().decode('ascii').rstrip('\"\',;)}]')
   if not version_re.search(raw.encode()) and not re.search(r'ota\.console\.wifi\.nokia\.com',raw,re.I):continue
   try:
    url=urllib.parse.urlsplit(raw);host=url.hostname
   except ValueError:continue
   # Do not publish query tokens/userinfo; only image-ID paths on the normal image host.
   safe_path=url.path if host=='ota.console.wifi.nokia.com' and version_re.search(url.path.encode()) else None
   report['urls'].append({'source':str(f),'offset':m.start(),'host':host,'image_path_on_normal_Nokia_host':safe_path,'has_query':bool(url.query),'url_sha256':hashlib.sha256(raw.encode()).hexdigest()});raw_urls.append({'source':str(f),'offset':m.start(),'url':raw});row['firmware_URL_leads']+=1
  report['sources'].append(row)
 private=G6/'config-private/ota-cache-review-20261026';private.mkdir(parents=True,exist_ok=False,mode=0o700)
 p=private/'firmware-url-leads.json';p.write_text(json.dumps(raw_urls,indent=2)+'\n',encoding='utf-8');report['private_original_urls']={'source':str(p),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
 out.write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
 print(json.dumps({'scanned_nonempty_sources':sum(x.get('bytes',0)>0 for x in report['sources']),'version_sets':[{ 'name':Path(x['source']).name,'versions':x.get('image_id_substring_counts',{})} for x in report['sources'] if x.get('image_id_substring_counts')],'URL_leads':len(report['urls'])},indent=2))
if __name__=='__main__':main()
