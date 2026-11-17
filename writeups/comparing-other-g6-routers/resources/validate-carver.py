#!/usr/bin/env python3
"""Synthetic UBIFS-node parsing/bounds/redaction checks; no firmware is executed."""
import argparse,hashlib,json,struct,subprocess,sys,tempfile,zlib
from pathlib import Path

def node(kind,body,sequence):
 blob=struct.pack('<IIQIBB2s',0x06101831,0,sequence,24+len(body),kind,0,b'\0\0')+body
 crc=(~zlib.crc32(blob[8:]))&0xffffffff
 return blob[:4]+struct.pack('<I',crc)+blob[8:]
def main():
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--tool-path',required=True);ap.add_argument('--out',type=Path,required=True);args=ap.parse_args();carver=Path(__file__).with_name('carve-ubifs-leads.py');sentinel=b'SYNTHETIC_PRIVATE_URL_TOKEN'
 payload=b'https://ota.console.wifi.nokia.com/BOQA/3FE49996HJLL91?Policy='+sentinel
 key=struct.pack('<II',42,1<<29)+b'\0'*8;good=node(1,struct.pack('<16sIHH',key,len(payload),0,0)+payload,10)
 bad=bytearray(good);bad[-1]^=1
 oversized=node(1,struct.pack('<16sIHH',key,4097,0,0)+payload,11)
 name=b'otaSwAgent.log';dentkey=struct.pack('<II',1,2<<29)+b'\0'*8;dent=node(2,struct.pack('<16sQBBHI',dentkey,42,0,0,len(name),0)+name+b'\0',9)
 raw=b''
 for blob in (dent,good,bytes(bad),oversized):raw+=b'\xff'*((-len(raw))%8)+blob
 with tempfile.TemporaryDirectory(prefix='g6-third-carver-check-') as temp:
  root=Path(temp);source=root/'synthetic.bin';source.write_bytes(raw);private=root/'private';report=root/'report.json';cmd=[sys.executable,str(carver),str(source),'--tool-path',args.tool_path,'--private-output',str(private),'--report',str(report)];run=subprocess.run(cmd,capture_output=True,text=True);assert run.returncode==0,run.stderr
  result=json.loads(report.read_text());assert result['data_blocks_recovered']==1 and result['node_counts']['CRC_rejected']==1 and result['node_counts']['invalid_data_bound']==1
  assert result['named_log_files_with_carved_blocks']==['otaSwAgent.log'];assert result['sanitized_firmware_URL_leads'][0]['image_path_on_normal_Nokia_host']=='/BOQA/3FE49996HJLL91';assert sentinel.decode() not in report.read_text()
  idx=json.loads((private/'node-index.json').read_text());assert idx['directory_name_candidates']['42']==['otaSwAgent.log'];assert sentinel in Path(idx['data_blocks'][0]['private_source']).read_bytes()
  before=hashlib.sha256(report.read_bytes()).hexdigest();again=subprocess.run(cmd,capture_output=True,text=True);assert again.returncode!=0 and hashlib.sha256(report.read_bytes()).hexdigest()==before
 result={'date':'2026-10-26','all_passed':True,'scope':'Synthetic complete-node/CRC/bound/name/redaction/no-overwrite checks only; not a live filesystem or journal replay.','checks':['raw_name decoded for standalone directory node','CRC-invalid data node rejected','data output above4096 rejected','only complete valid data node retained','URL query token absent from public report/present only private payload','existing outputs refused unchanged'],'carver_sha256':hashlib.sha256(carver.read_bytes()).hexdigest()}
 with args.out.open('x',encoding='utf-8') as f:f.write(json.dumps(result,indent=2)+'\n')
 print(json.dumps(result,indent=2))
if __name__=='__main__':main()
