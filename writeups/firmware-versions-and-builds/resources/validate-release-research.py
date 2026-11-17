#!/usr/bin/env python3
"""Offline checks of the saved public-documentation and bounded OTA experiments."""
import argparse, ast, collections, hashlib, html, json, re, urllib.parse
from pathlib import Path
G6=Path(__file__).resolve().parents[3];B9=G6.parent/'Nokia-Beacon-9'
import sys
sys.path.insert(0,str(G6/'writeups/security-keys/resources'))
from publication_aliases import private_record,public_record,source_path
def load(p):return private_record(json.loads(p.read_text(encoding='utf-8')))
def fingerprint(p):return {'source':str(p),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
def main():
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--out',required=True);args=ap.parse_args()
 resource=Path(__file__).resolve().parent;cloud=G6/'writeups/firmware-upgrade-path/resources/cloud-download'
 index=load(resource/'documentation-release-index.json');matrix=load(cloud/'regional-ota-matrix.json')
 assert index['complete'] and matrix['complete'] and matrix['profiles_unchanged']
 assert len(index['release_labels'])==len(index['release_results'])==76
 assert len(index['private_artifacts'])==77 and len(matrix['private_artifacts'])==124
 for item in index['private_artifacts']+matrix['private_artifacts']:
  p=source_path(item['source']);assert fingerprint(p)==dict(item,source=str(p))
 assert load(Path(index['private_artifacts'][0]['source']))['release']==index['release_labels']
 associations=collections.Counter();unique={'G6':{},'Beacon9':{}}
 for row,private in zip(index['release_results'],index['private_artifacts'][1:]):
  raw=load(Path(private['source']));assert urllib.parse.parse_qs(raw['qs'])['release']==[row['release']]
  assert raw['num_docs']==row['listed_document_count']
  found={'G6':[],'Beacon9':[]}
  for block in raw['results'].split("<div class='result-p'>")[1:]:
   title_match=re.search(r"<a[^>]*>(.*?)</a>",block,re.S)
   if not title_match:continue
   title=html.unescape(re.sub('<[^>]+>','',title_match.group(1))).strip()
   values=re.findall(r"<span class='result-filt-data'>(.*?)</span>",block,re.S)
   train=re.search(r'BBD\s+(?:Release\s+)?R?(\d{2}\.\d{2}[a-z]*)',title,re.I)
   models=[]
   if re.search(r'\bG6(?![._]2)\b',title,re.I):models.append('G6')
   if re.search(r'Beacon\s*9\b',title,re.I):models.append('Beacon9')
   for model in models:
    assert len(values)>=3 and train
    found[model].append((values[2],values[0],values[1],'fa-lock' in block,train.group(1)))
  for model in found:
   expected=[(x['document_id'],x['issue_date'],x['issue'],x['locked'],x['release_in_title']) for x in row['model_documents'][model]]
   assert sorted(expected)==sorted(found[model]),(row['release'],model)
   if expected:associations[model]+=1
   for item in expected:
    unique[model].setdefault(item,[]).append(row['release'])
 for model,count in [('G6',18),('Beacon9',5)]:
  summary=index['model_summary'][model];assert len(unique[model])==summary['distinct_guide_entries']==count
  assert associations[model]==summary['release_filter_associations']
  for entry in summary['entries']:
   key=(entry['document_id'],entry['issue_date'],entry['issue'],entry['locked'],entry['release'])
   assert sorted(unique[model][key])==sorted(entry['listing_filters'])
 assert associations=={'G6':21,'Beacon9':5}
 rows=matrix['queries'];assert len(rows)==matrix['cases_planned']==62 and not matrix['downloads']
 assert collections.Counter(x['device'] for x in rows)=={'g6':41,'b9':21}
 outcomes=collections.Counter()
 for row in rows:
  assert row['http_status']==row['responseCode']==200
  if row['device']=='g6' and row['operatorcode']=='BOQA':
   assert len(row['offers'])==1
   offer=row['offers'][0];assert offer['nxtMSVersion']=='3FE49996HJLL91'
   assert offer['checksum']=='fc87c474793286273df44dafcc3b605f' and offer['has_download_url']
   assert offer['download_host']=='ota.console.wifi.nokia.com' and offer['download_path']=='/BOQA/3FE49996HJLL91'
   outcomes['G6_known_offer']+=1
  else:
   for offer in row['offers']:
    assert offer['nxtMSVersion'] is None and offer['checksum'] is None and not offer['has_download_url']
   outcomes['G6_no_offer' if row['device']=='g6' else 'Beacon9_no_offer']+=1
 assert outcomes=={'G6_known_offer':25,'G6_no_offer':16,'Beacon9_no_offer':21}
 files=[resource/'documentation-release-index.json',cloud/'regional-ota-matrix.json',cloud/'evidence.json']
 links=0
 for root in (G6,B9):
  for name in ('documented-releases.md','25.03-account-comparison.md','new-capture-checklist.md'):
   path=root/'writeups/firmware-versions-and-builds'/name;files.append(path);text=path.read_text(encoding='utf-8')
   assert len(re.findall(r'^```',text,re.M))%2==0
   for target in re.findall(r'\]\(([^)]+)\)',text):
    if target.startswith(('https:','http:','#','mailto:')):continue
    assert (path.parent/target.split('#')[0]).exists(),(path,target);links+=1
 secrets=[load(root/f'config-private/ota-cloud-analysis/{label}-ota-profile.json')['api_key'] for root,label in ((G6,'g6'),(B9,'b9'))]
 for p in files:
  text=p.read_text(encoding='utf-8');assert not any(s in text for s in secrets),p
  assert not re.search(r'https://[^\s"<>]+[?&](?:Policy|Signature|Key-Pair-Id)=',text),p
 for p in (resource/'collect-documentation-release-index.py',cloud/'regional-ota-research.py',Path(__file__)):
  ast.parse(p.read_text(encoding='utf-8'))
 result={'date':'2026-10-28','all_passed':True,'scope':'Offline source reparse/hash/identity/link/privacy checks; no additional network calls or router execution.','documentation_labels':76,'private_original_hashes_checked':201,'model_guide_entries':{'G6':18,'Beacon9':5},'model_filter_associations':dict(associations),'OTA_queries_checked':62,'OTA_outcomes':dict(outcomes),'new_downloads':0,'local_links_checked':links,'checked_sources':[fingerprint(resource/'documentation-release-index.json'),fingerprint(cloud/'regional-ota-matrix.json')],'validator':fingerprint(Path(__file__))}
 result=public_record(result)
 with Path(args.out).open('x',encoding='utf-8',newline='\n') as f:f.write(json.dumps(result,indent=2)+'\n')
 print(json.dumps(result,indent=2))
if __name__=='__main__':main()
