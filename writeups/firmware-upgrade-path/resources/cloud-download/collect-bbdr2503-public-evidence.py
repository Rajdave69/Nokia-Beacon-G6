#!/usr/bin/env python3
"""Offline extraction of public metadata and saved research provenance; no network."""
import hashlib,html,json,re
from pathlib import Path
G6=Path(__file__).resolve().parents[4]
def identify(path):
 data=path.read_bytes();return {'source':str(path),'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()}
def main():
 cache=G6/'config-private/bbdr2503-research-20261026';out=Path(__file__).with_name('bbdr2503-public-doc-evidence.json')
 if out.exists():raise FileExistsError(out)
 wanted={'3FE-49949-AAAA-TCZZA-15':'G6/G6_2 product guide for25.03','3TN-01670-BAAA-TQZZA-01':'ONT25.03 software compatibility matrix','3TN-01670-BAAA-FMZZA-02':'ONT25.03 customer release notes','3TN-01671-BAAA-FMZZA-02':'WiFi25.03 customer release notes'}
 report={'date':'2026-10-26 Asia/Riyadh','method':'Normal anonymous documentation pages, page-advertised JavaScript and the public filter_docs.py/list_docs.py requests used by that UI. No authentication cookies, login, API keys/device identities or protected-document content used in documentation requests.',
  'advisory':{'url':'https://www.nokia.com/we-are-nokia/security/product-security-advisory/cve-2025-9974/','conclusion':'Nokia documents the G6 among affected products and a delivered fix at BBDR2503+. This confirms documented fixed-release support, independently of BOQA offers. Actual G6 image ID/file still not obtained.'},
  'documentation_products':{},'relevant_documents':[],'public_requests':{'saved_html_GETs':3,'page_script_GETs':2,'filter_POSTs':2,'list_POSTs':2},'private_artifacts':[],
  'access_result':'All four relevant document entries are padlocked and advertise the authenticated /aces/ view. Only public metadata was read. No gated PDF, compatibility matrix body, firmware download catalogue, entitlement bypass or account login attempted.',
  'limits':['Nokia platform release list is not a G6-specific list for every release.','Exact G6 guide title establishes25.03 support, but public metadata gives no3FE image ID.','Corteca presentation shows a G6 BBDR2503 campaign; adjacent UMJ28 demo label was not proven to be that campaign payload.','Normal OTA offers for these owned profiles do not define all available vendor/operator packages.'],
  'failed_presentation_attempt':'First ONT listing request succeeded and its raw response was saved; printing the padlock under native cp1252 raised UnicodeEncodeError before Beacon request. Output was corrected to UTF8; saved ONT was read without repeating its network request.',
  'browser_tool_limit':'web open/click reported cache misses for25.03 URLs; direct ordinary HTTPSGET of those exact public links succeeded. No access control was bypassed.'}
 for label,product in [('ont','833-011113'),('beacon','833-044763')]:
  filters=json.loads((cache/f'{label}-filters.json').read_bytes());listing=json.loads((cache/f'{label}-25-03-docs.json').read_bytes())
  report['documentation_products'][label]={'product_id':product,'url':'https://documentation.nokia.com/pybin/doc_ctr.py?product_id='+product+'&release=BBD+R25.03','reported_document_count':listing['num_docs'],'relevant_release_labels':[x for x in filters['release'] if '25.03' in str(x) or '26.03' in str(x)]}
  for block in re.findall(r"<div class='result-p'>(.*?)</div>",listing['results'],re.S):
   fields=[html.unescape(re.sub('<[^>]*>','',x)) for x in re.findall(r"<span class='result-filt-data'>(.*?)</span>",block,re.S)]
   if len(fields)<3 or fields[2] not in wanted:continue
   doc=fields[2];report['relevant_documents'].append({'document_id':doc,'role':wanted[doc],'issue_date':fields[0],'issue':fields[1],'locked':'fa-lock' in block,'public_listing_product':product,'advertised_link':html.unescape(re.search(r"href='([^']+)'",block).group(1))})
 assert {r['document_id'] for r in report['relevant_documents']}==set(wanted)
 assert all(r['locked'] for r in report['relevant_documents'])
 for f in sorted(cache.rglob('*')):
  if f.is_file():report['private_artifacts'].append(identify(f))
 report['private_artifact_policy']='Full raw HTML/JS/listing metadata and OTA request/response data remain at protected original paths. Public record retains concise facts/identifiers and hashes, not full copyrighted pages, keys or signed URLs.'
 out.write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
 print(json.dumps({'documents':report['relevant_documents'],'metadata_only':True,'private_artifact_count':len(report['private_artifacts'])},indent=2))
if __name__=='__main__':main()
