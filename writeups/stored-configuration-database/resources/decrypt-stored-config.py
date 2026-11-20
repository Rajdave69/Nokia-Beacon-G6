#!/usr/bin/env python3
"""Offline decode of captured G6 stored dmdb files, distinct from WebUI exports.

Verified against both G6-C saved stores. No router/network operations.
Inputs preserve exact source text/case. Missing source5 is the stock literal.
Decoded binary databases contain secrets: use a private output location.
"""
import argparse,base64,hashlib,json,os,re,struct,zlib
from pathlib import Path
HEADER=struct.Struct('<5Q');MAX_SIZE=32*1024*1024

def derive_key10(serial,programming_date,source5=b'invalid_key_src5_str'):
 if not re.fullmatch(rb'[0-9A-Fa-f]{8}',serial):raise ValueError('expected exact eight-character RI G984Serial source, preserving case')
 if not re.fullmatch(rb'[0-9]{6}',programming_date):raise ValueError('expected exact six-character RI ProgDate source')
 if not source5 or len(source5)>4096 or b'\0' in source5:raise ValueError('source5 must be the nonempty effective source bytes, without NUL')
 return base64.b64encode(hashlib.pbkdf2_hmac('sha256',serial+programming_date+source5,b'key10',100,dklen=64))[:64]

def decrypt_stored(data,key10):
 if len(data)<HEADER.size:raise ValueError('truncated stored database header')
 magic,size,crc,expected,version=HEADER.unpack_from(data)
 if magic!=0x124126:raise ValueError('expected stored dmdb magic0x124126, not a WebUI export')
 blob=data[HEADER.size:]
 if size!=len(blob) or size>MAX_SIZE or expected>MAX_SIZE:raise ValueError('stored database length/bound mismatch')
 if zlib.crc32(blob)!=crc:raise ValueError('encrypted payload CRC32 mismatch')
 if len(blob)<25 or blob[0]!=255 or (len(blob)-9)%16:raise ValueError('unsupported CBC container format')
 if len(key10)!=64:raise ValueError('expected64 returned key10 string bytes')
 from cryptography.hazmat.primitives.ciphers import Cipher,algorithms,modes
 from cryptography.hazmat.primitives.padding import PKCS7
 material=hashlib.pbkdf2_hmac('sha256',key10,blob[1:9],10,dklen=48)
 dec=Cipher(algorithms.AES(material[:32]),modes.CBC(material[32:])).decryptor();padded=dec.update(blob[9:])+dec.finalize()
 try:
  unpad=PKCS7(128).unpadder();compressed=unpad.update(padded)+unpad.finalize()
  inflater=zlib.decompressobj();raw=inflater.decompress(compressed,expected+1)
 except (ValueError,zlib.error) as exc:raise ValueError('CBC padding/zlib validation failed: wrong sources or altered data') from exc
 if len(raw)!=expected or not inflater.eof or inflater.unused_data or inflater.unconsumed_tail:raise ValueError('zlib length/end validation failed')
 if len(raw)<48:raise ValueError('truncated binary database')
 fields=struct.unpack_from('<12I',raw)
 if fields[0]!=0x1008efab or not 0<fields[2]<=10000 or fields[3]+4*fields[2]>len(raw) or max(fields[4],fields[7])>=len(raw):raise ValueError('unsupported binary database header')
 return raw,{'magic':hex(magic),'encrypted_bytes':size,'decompressed_bytes':len(raw),'header_version':hex(version),'database_object_count':fields[2],'plaintext_sha256':hashlib.sha256(raw).hexdigest(),'validation':'CRC32, PKCS7, zlib checksum/end/length and binary schema bounds; CBC format has no verified MAC/AEAD authentication.'}

def main():
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('input',type=Path);ap.add_argument('output',type=Path);ap.add_argument('--serial-source',required=True);ap.add_argument('--programming-date',required=True);ap.add_argument('--source5-file',type=Path,help='Exact effective source5 bytes, only if independently known; no whitespace trimming.')
 args=ap.parse_args()
 try:
  if args.output.exists():raise ValueError('output already exists')
  if args.input.stat().st_size>MAX_SIZE+HEADER.size:raise ValueError('input exceeds bound')
  source5=args.source5_file.read_bytes() if args.source5_file else b'invalid_key_src5_str'
  raw,meta=decrypt_stored(args.input.read_bytes(),derive_key10(args.serial_source.encode('ascii'),args.programming_date.encode('ascii'),source5))
  descriptor=os.open(args.output,os.O_WRONLY|os.O_CREAT|os.O_EXCL,0o600)
  with os.fdopen(descriptor,'wb') as out:out.write(raw)
  print(json.dumps({'output':str(args.output),**meta},indent=2));return 0
 except (OSError,ValueError,ImportError,UnicodeError) as exc:
  print('error: '+str(exc),file=__import__('sys').stderr);return 1
if __name__=='__main__':raise SystemExit(main())
