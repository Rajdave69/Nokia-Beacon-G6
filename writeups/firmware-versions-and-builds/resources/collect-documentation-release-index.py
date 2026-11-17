#!/usr/bin/env python3
"""Public Nokia metadata index; no login, protected PDF or firmware execution."""
import argparse,datetime,hashlib,html,json,re,time,urllib.parse,urllib.request
from pathlib import Path
G6=Path(__file__).resolve().parents[3]
import sys
sys.path.insert(0,str(G6/'writeups/security-keys/resources'))
from publication_aliases import public_record
class NoRedirect(urllib.request.HTTPRedirectHandler):
 def redirect_request(self,*args):return None
def main():
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--execute',action='store_true');args=ap.parse_args()
 if not args.execute:ap.error('Requires --execute: reads public metadata endpoints')
 private=G6/'config-private/documentation-release-index-20261026';private.mkdir(parents=True,exist_ok=False,mode=0o700)
 output=Path(__file__).with_name('documentation-release-index.json')
 if output.exists():raise FileExistsError(output)
 report={'date':'2026-10-26 Asia/Riyadh','scope':'Anonymous normal Nokia WiFi Beacon documentation metadata only. Enumerates only release labels returned by the public product filter. Model association requires G6/B9 in an actual returned document title, not just a family release label. No login, device identity/key, protected PDF or binary download.',
  'product_id':'833-044763','base_url':'https://documentation.nokia.com/pybin/doc_ctr.py?product_id=833-044763','release_labels':[],'release_results':[],'private_artifacts':[],'complete':False,'stop_reason':None}
 opener=urllib.request.build_opener(NoRedirect)
 def post(endpoint,fields,filename):
  body=urllib.parse.urlencode(fields).encode();req=urllib.request.Request('https://documentation.nokia.com/pybin/'+endpoint,body,{'Content-Type':'application/json; charset=utf-8','User-Agent':'Mozilla/5.0','Referer':report['base_url']},method='POST')
  with opener.open(req,timeout=30) as response:
   data=response.read(4*1024*1024+1);assert response.status==200 and len(data)<=4*1024*1024
  target=private/filename;target.write_bytes(data);report['private_artifacts'].append({'source':str(target),'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()});return json.loads(data)
 filters=post('filter_docs.py',{'srch_str':'','srch_start':'0','exact':'false','prodid':report['product_id']},'filters.json')
 labels=filters['release'];assert isinstance(labels,list) and len(labels)<=100
 report['release_labels']=labels
 for number,release in enumerate(labels,1):
  row={'release':release,'source_url':report['base_url']+'&release='+urllib.parse.quote_plus(release),'model_documents':{'G6':[],'Beacon9':[]}}
  try:
   fields={'prodid':report['product_id'],'release':release,'model':'','model_name':'','category':'','contype':'','format':'','filter':'','from_href_what':'release','from_geturl':'true','shared_url':'true','sortby':''}
   data=post('list_docs.py',fields,f'{number:03d}-'+re.sub('[^A-Za-z0-9._-]','_',release)+'.json');row['listed_document_count']=data['num_docs']
   for block in re.findall(r"<div class='result-p'>(.*?)</div>",data['results'],re.S):
    anchor=re.search(r"<a[^>]*href='([^']+)'[^>]*>(.*?)</a>",block,re.S)
    if not anchor:continue
    title=html.unescape(re.sub('<[^>]*>','',anchor.group(2))).strip()
    models=[]
    if re.search(r'Beacon\s*G6(?![._]2)\b|\bG6(?![._]2)\b',title,re.I):models.append('G6')
    if re.search(r'Beacon\s*9\b',title,re.I):models.append('Beacon9')
    if not models:continue
    values=[html.unescape(re.sub('<[^>]*>','',x)) for x in re.findall(r"<span class='result-filt-data'>(.*?)</span>",block,re.S)]
    assert len(values)>=3
    train=re.search(r'BBD\s+(?:Release\s+)?R?(\d{2}\.\d{2}[a-z]*)',title,re.I)
    item={'document_id':values[2],'issue_date':values[0],'issue':values[1],'locked':'fa-lock' in block,'kind':'product guide' if re.search(r'Product\s+Guide',title,re.I) else 'model-specific document','release_in_title':train.group(1) if train else None,'advertised_link':html.unescape(anchor.group(1)),'full_title_source':'Protected original response; only factual model/release/ID metadata published'}
    for model in models:row['model_documents'][model].append(item)
   report['release_results'].append(row)
  except Exception as exc:
   row['error_type']=type(exc).__name__;report['release_results'].append(row);report['stop_reason']='Stopped on first metadata error; no retries';break
  if number%5==0 or number==len(labels):print(json.dumps({'requests_completed':number,'releases_total':len(labels),'G6_release_associations':sum(bool(x['model_documents']['G6']) for x in report['release_results']),'Beacon9_release_associations':sum(bool(x['model_documents']['Beacon9']) for x in report['release_results'])}),flush=True)
  output.write_text(json.dumps(public_record(report),indent=2)+'\n',encoding='utf-8');time.sleep(2)
 report['complete']=len(report['release_results'])==len(labels) and report['stop_reason'] is None
 report['limits']=['A model-specific documentation association is not proof of a downloadable/binary-distinct firmware package.','Repeated document IDs can cover multiple release/subrelease filters.','Family labels with no model-specific document are not assigned to either router.','Source spellings/irregular labels are retained without silently normalizing them.','No product IMAGEVERSION, package hash or URL is inferred from a BBD label.']
 output.write_text(json.dumps(public_record(report),indent=2)+'\n',encoding='utf-8');print(json.dumps({'complete':report['complete'],'releases':len(report['release_results']),'stop_reason':report['stop_reason']}),flush=True)
if __name__=='__main__':main()
