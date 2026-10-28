#!/usr/bin/env python3
"""Read-only authenticated decode of captured Zeroman ENC_ files (G6 profile).

Distinct from WebUI export/header and stored dmdb/CBC. Decoded settings are
sensitive; choose a private output. No firmware execution or router/network I/O.
"""
import argparse,hashlib,importlib.util,json,os
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
AAD=bytes.fromhex('d92ae1d30dd96d2be8de7318c6fd18fc4b9faa645678acf6427c2ac98ab84078')
MAX_SIZE=32*1024*1024

def derive(serial,date,source5=b'invalid_key_src5_str'):
 spec=importlib.util.spec_from_file_location('stored',ROOT/'webui/scripts/decrypt-stored-config.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
 return m.derive_key10(serial,date,source5)

def decrypt_zeroman(raw,key10):
 from cryptography.hazmat.primitives.ciphers.aead import AESGCM
 from cryptography.exceptions import InvalidTag
 if not 20<len(raw)<=MAX_SIZE or len(key10)!=64:raise ValueError('Invalid file/key bounds')
 derived=hashlib.pbkdf2_hmac('sha256',key10,raw[:4],10,44)
 try:return AESGCM(derived[:32]).decrypt(derived[32:],raw[20:]+raw[4:20],AAD)
 except InvalidTag as e:raise ValueError('GCM authentication failed: wrong sources or altered file') from e

def main():
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('input',type=Path);ap.add_argument('output',type=Path);ap.add_argument('--serial-source',required=True);ap.add_argument('--programming-date',required=True);ap.add_argument('--source5-file',type=Path)
 a=ap.parse_args()
 source5=a.source5_file.read_bytes() if a.source5_file else b'invalid_key_src5_str';raw=a.input.read_bytes();plain=decrypt_zeroman(raw,derive(a.serial_source.encode('ascii'),a.programming_date.encode('ascii'),source5))
 fd=os.open(a.output,os.O_WRONLY|os.O_CREAT|os.O_EXCL,0o600)
 with os.fdopen(fd,'wb') as f:f.write(plain)
 print(json.dumps({'input_bytes':len(raw),'output_bytes':len(plain),'plaintext_sha256':hashlib.sha256(plain).hexdigest(),'GCM_authenticated':True,'output':str(a.output)},indent=2))
if __name__=='__main__':main()
