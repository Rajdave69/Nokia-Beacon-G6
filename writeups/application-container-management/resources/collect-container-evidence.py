#!/usr/bin/env python3
"""Verify a saved container-management profile using file reads only."""
from pathlib import Path
import argparse,hashlib,json

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--profile',required=True,choices=['G6-IJL','G6-HJL','B9-JJM','ONT-JJL','ONT-KJL'])
    ap.add_argument('--root',required=True,type=Path)
    ap.add_argument('--out',required=True,type=Path)
    args=ap.parse_args()
    spec=json.loads(Path(__file__).with_name('profile-comparison.json').read_text())['%s' % args.profile]
    checked=[]
    for rel,expected in spec['files'].items():
        f=args.root/rel
        if f.is_file()!=expected['present']:raise ValueError('Presence mismatch: '+rel)
        if not expected['present']:continue
        data=f.read_bytes()
        if len(data)!=expected['bytes'] or hashlib.sha256(data).hexdigest()!=expected['sha256']:
            raise ValueError('Source fingerprint mismatch: '+rel)
        if 'symlink_target' in expected and (not f.is_symlink() or str(f.readlink())!=expected['symlink_target']):
            raise ValueError('Symlink mismatch: '+rel)
        checked.append(rel)
    report={'profile':args.profile,'scope':'offline file presence, byte counts, hashes and selected symlinks only; no firmware execution/network/runtime claim',
            'verified_present':len(checked),'verified_absent':sum(not x['present'] for x in spec['files'].values()),'files':checked}
    args.out.parent.mkdir(parents=True,exist_ok=True)
    args.out.write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps({k:v for k,v in report.items() if k!='files'}))

if __name__=='__main__':main()
