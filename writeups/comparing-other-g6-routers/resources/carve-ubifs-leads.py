#!/usr/bin/env python3
"""Offline CRC-checked UBIFS data-node leads; does not reconstruct committed state."""
import argparse,collections,hashlib,json,re,struct,sys,urllib.parse,zlib
from pathlib import Path

def main():
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('input',type=Path);ap.add_argument('--tool-path',required=True);ap.add_argument('--private-output',type=Path,required=True);ap.add_argument('--report',type=Path,required=True);args=ap.parse_args()
 if args.private_output.exists() or args.report.exists():raise FileExistsError('Use new output paths')
 args.private_output.mkdir(parents=True,mode=0o700)
 sys.path.insert(0,args.tool_path)
 from ubireader.ubifs import nodes
 from ubireader.ubifs.misc import decompress
 raw=args.input.read_bytes();counts=collections.Counter();versions=collections.Counter();leads=[];files=[];names={};headers=[];offset=0
 image_re=re.compile(rb'(?:3FE49996|3TN01100)[A-Z0-9]{6}')
 while True:
  offset=raw.find(b'\x31\x18\x10\x06',offset)
  if offset<0:break
  pos=offset;offset+=4
  if pos%8 or pos+24>len(raw):continue
  magic,crc,sequence,length,kind,group,pad=struct.unpack_from('<IIQIBB2s',raw,pos)
  if length<24 or length>253952 or pos+length>len(raw) or kind>13:continue
  blob=raw[pos:pos+length]
  if (~zlib.crc32(blob[8:])&0xffffffff)!=crc:counts['CRC_rejected']+=1;continue
  counts['valid_type_'+str(kind)]+=1
  try:
   if kind==0:
    inode=nodes.ino_node(blob[24:]);headers.append({'offset':pos,'sqnum':sequence,'inum':inode.key['ino_num'],'size':inode.size,'mode':inode.mode,'nlink':inode.nlink})
   elif kind==2:
    dent=nodes.dent_node(blob[24:]);names.setdefault(dent.inum,set()).add(dent.raw_name.decode("utf-8"))
   elif kind==1:
    node=nodes.data_node(blob[24:],0)
    if not 0<node.size<=4096:counts['invalid_data_bound']+=1;continue
    data=decompress(node.compr_type,node.size,blob[48:])
    if data is None or len(data)!=node.size:counts['decompression_failure']+=1;continue
    inum=node.key['ino_num'];block=node.key['khash']&0x1fffffff;target=args.private_output/f'inode-{inum}-block-{block}-seq-{sequence}-offset-{pos}.bin';target.write_bytes(data)
    item={'raw_offset':pos,'sqnum':sequence,'inum':inum,'block':block,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'private_source':str(target)};files.append(item)
    for m in image_re.finditer(data):versions[m.group().decode()]+=1
    for m in re.finditer(rb'https?://[\x21-\x7e]{5,4096}',data):
     url=m.group().decode().rstrip('"\',;)}]')
     try:parsed=urllib.parse.urlsplit(url);host=parsed.hostname
     except ValueError:continue
     if not host:continue
     if host not in ('ota.console.wifi.nokia.com','swupd.wifi.nokia.com') and not image_re.search(url.encode()):continue
     safe_path=parsed.path if host=='ota.console.wifi.nokia.com' and image_re.search(parsed.path.encode()) else None
     leads.append({'raw_node_offset':pos,'sqnum':sequence,'inum':inum,'block':block,'host':host,'image_path_on_normal_Nokia_host':safe_path,'has_query':bool(parsed.query),'raw_URL_sha256':hashlib.sha256(url.encode()).hexdigest()})
  except (ValueError,UnicodeError,struct.error) as exc:counts['parse_error_'+type(exc).__name__]+=1
 private={'scope':'CRC-valid carved nodes, including possible obsolete/uncommitted nodes. Not a mounted filesystem/current-state reconstruction.','inodes':headers,'data_blocks':files,'directory_name_candidates':{str(k):sorted(v) for k,v in names.items()}}
 p=args.private_output/'node-index.json';p.write_text(json.dumps(private,indent=2)+'\n')
 report={'scope':'Offline valid-node carving after normal indexed extraction failed. No journal replay, deletion/truncation resolution, committed-state proof, network call, router operation or firmware execution.','input':{'source':str(args.input),'bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest()},'node_counts':dict(counts),'data_blocks_recovered':len(files),'image_ID_occurrences_in_recovered_blocks':dict(versions),'sanitized_firmware_URL_leads':leads,'named_log_files_with_carved_blocks':sorted({name for item in files for name in names.get(item['inum'],[]) if re.search(r'ota|download|activate|selog|upgrade|syslog',name,re.I)}),'private_index':{'source':str(p),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()},'limits':['Matches can come from deleted or obsolete versions and do not establish a currently installed or available firmware.','Only CRC-valid complete data nodes of supported compression and bounded output are decoded; a negative result is limited to those recovered nodes.','URL query/userinfo/content and log payloads remain private; no signed URL or credential is published.']}
 args.report.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'nodes':report['node_counts'],'blocks':len(files),'versions':dict(versions),'URL_leads':len(leads),'named_logs':report['named_log_files_with_carved_blocks']},indent=2))
if __name__=='__main__':main()
