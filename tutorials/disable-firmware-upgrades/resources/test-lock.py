#!/usr/bin/env python3
"""Hermetic shell integration. No actual mounts, UCI, network or firmware execution.
Production scripts have no test-root bypass; fixture copies remap paths and PATH.
"""
import argparse,json,os,re,shutil,subprocess,tempfile
from pathlib import Path
HERE=Path(__file__).resolve().parent
TARGETS=['/usr/exe/image_activate.sh','/sbin/sysupgrade','/usr/sbin/imageTool','/sbin/upgraded','/usr/bin/ca.upgrade','/webs/upgrade_web_app.cgi','/webs/otasw_upgrade_app.cgi','/usr/bin/swmgnt','/usr/sbin/batch_upgrade']
MOCK=r"""#!/usr/bin/python3
import os,sys,json,shutil
from pathlib import Path
root=Path(os.environ['FIXTURE']);name=Path(sys.argv[0]).name;args=sys.argv[1:]
if name=='id':print('0');sys.exit(0)
if name=='logger':sys.exit(0)
if name=='uci':
 p=root/'uci.json';j=json.loads(p.read_text());args=[a for a in args if a!='-q'];op=args.pop(0)
 if op=='changes':print(j.get('pending',''));sys.exit(0)
 if op=='get':
  if args[0] not in j:sys.exit(1)
  print(j[args[0]]);sys.exit(0)
 if op=='set':k,v=args[0].split('=',1);j[k]=v
 elif op=='delete':
  for k in list(j):
   if k==args[0] or k.startswith(args[0]+'.'):del j[k]
 elif op=='commit':j['pending']=''
 else:sys.exit(2)
 p.write_text(json.dumps(j));sys.exit(0)
p=root/'proc/mounts';lines=p.read_text().splitlines()
if name=='mount':
 src,dst=args[-2:]
 if os.environ.get('FAIL_TARGET')==dst:sys.exit(1)
 backup=root/'mock-backups'/dst.lstrip('/').replace('/','_');backup.parent.mkdir(exist_ok=True)
 if not backup.exists():shutil.copyfile(dst,backup)
 shutil.copyfile(src,dst);lines.append('mock '+dst+' none rw,bind 0 0');p.write_text('\n'.join(lines)+'\n');sys.exit(0)
if name=='umount':
 dst=args[-1];backup=root/'mock-backups'/dst.lstrip('/').replace('/','_')
 if not backup.exists():sys.exit(1)
 shutil.copyfile(backup,dst);lines=[l for l in lines if l.split()[1]!=dst];p.write_text('\n'.join(lines)+'\n');sys.exit(0)
sys.exit(2)
"""
def fixture(firmware):
 root=Path(tempfile.mkdtemp(prefix='g6-update-lock-test-'))
 for d in ['proc','rom/etc/pcd','configs/overlay/etc/config','etc/pcd','tmp','src','fakebin']:(root/d).mkdir(parents=True,exist_ok=True)
 (root/'etc/config').symlink_to(root/'configs/overlay/etc/config')
 (root/'configs/overlay/etc/config/firewall').write_text('config defaults\n option input ACCEPT\n')
 (root/'rom/etc/buildinfo').write_bytes((firmware/'etc/buildinfo').read_bytes())
 for d in ['etc/pcd','rom/etc/pcd']:(root/d/'swmgnt.pcd').write_bytes((firmware/'etc/pcd/swmgnt.pcd').read_bytes())
 (root/'proc/mounts').write_text('ubi '+str(root/'configs')+' ubifs rw 0 0\n');(root/'uci.json').write_text('{}')
 for t in TARGETS:
  p=root/t.lstrip('/');p.parent.mkdir(parents=True,exist_ok=True);p.write_text('original '+t+'\n');p.chmod(0o755)
 for n in ['mount','umount','id','uci','logger']:
  p=root/'fakebin'/n;p.write_text(MOCK);p.chmod(0o755)
 prefixes=['/proc/mounts','/proc/[0-9]*/comm','/configs','/rom','/etc/config','/etc/pcd','/tmp/g6-fw-lock','/tmp/.upgrade.burning','/tmp/sysupgrade','/tmp/upgrade_pid','/usr/exe','/usr/sbin','/usr/bin','/sbin','/webs']
 match=re.compile(r'(?<![A-Za-z0-9_/.])(?:'+'|'.join(re.escape(x) for x in sorted(prefixes,key=len,reverse=True))+')')
 for n in ['guard.sh','blocked.sh','firewall-include.sh','install.sh','remove.sh']:
  s=(HERE/n).read_text();s=match.sub(lambda m:str(root)+m.group(),s)
  s=re.sub(r'^PATH=.*$', 'PATH='+str(root/'fakebin')+':/usr/bin:/bin',s,flags=re.M)
  p=root/'src'/n;p.write_text(s);p.chmod(0o755)
 return root

def run(root,script,*args,**extra):
 path=root/'src'/script
 if script=='guard-installed':path=root/'configs/firmware-update-lock/guard.sh'
 if script=='remove-installed':path=root/'configs/firmware-update-lock/remove.sh'
 return subprocess.run(['/bin/sh',str(path),*args],env={**os.environ,'FIXTURE':str(root),**extra},text=True,capture_output=True)
def ok(cp):assert cp.returncode==0,(cp.args,cp.returncode,cp.stdout,cp.stderr)
def bad(cp):assert cp.returncode!=0,(cp.args,cp.stdout)
def main(firmware):
 results=[]
 def case(name,fn):
  root=fixture(firmware)
  try:fn(root);results.append({'case':name,'passed':True})
  finally:shutil.rmtree(root)
 def normal(root):
  originals={t:(root/t.lstrip('/')).read_bytes() for t in TARGETS};origpcd=(root/'etc/pcd/swmgnt.pcd').read_bytes()
  ok(run(root,'install.sh','--uplinks-disconnected'));ok(run(root,'guard-installed','status'))
  first=(root/'proc/mounts').read_text();ok(run(root,'guard-installed','apply'));assert first==(root/'proc/mounts').read_text()
  pcd=(root/'etc/pcd/swmgnt.pcd').read_text(errors='replace');assert 'ACTIVE = NO' in pcd and 'FAILURE_ACTION = NONE' in pcd
  cp=subprocess.run(['/bin/sh',str(root/'sbin/sysupgrade'),'--help'],env={**os.environ,'PATH':str(root/'fakebin')+':/usr/bin:/bin','FIXTURE':str(root)},capture_output=True,text=True);assert cp.returncode==126
  cp=subprocess.run(['/bin/sh','-c','. "$1"; echo wrapper-returned','test',str(root/'src/firewall-include.sh')],env={**os.environ,'FIXTURE':str(root)},capture_output=True,text=True);ok(cp);assert 'wrapper-returned' in cp.stdout
  for t,d in originals.items():(root/t.lstrip('/')).write_bytes(d)
  (root/'etc/pcd/swmgnt.pcd').write_bytes(origpcd);(root/'proc/mounts').write_text('ubi '+str(root/'configs')+' ubifs rw 0 0\n');shutil.rmtree(root/'tmp/g6-fw-lock')
  ok(run(root,'guard-installed','apply'));ok(run(root,'guard-installed','status'));assert (root/'configs/firmware-update-lock/remove.sh').is_file();ok(run(root,'remove-installed'))
  assert 'firewall.g6_firmware_lock' not in (root/'uci.json').read_text()
  for t,d in originals.items():assert (root/t.lstrip('/')).read_bytes()==d
  assert (root/'etc/pcd/swmgnt.pcd').read_bytes()==origpcd;bad(run(root,'guard-installed','status'))
 case('install-repeat-sourced-include-reboot-reapply-uninstall',normal)
 case('explicit-offline-ack-required',lambda r:bad(run(r,'install.sh')))
 def pending(r):
  (r/'uci.json').write_text(json.dumps({'pending':'other-user-edit'}));bad(run(r,'install.sh','--uplinks-disconnected'));assert not (r/'configs/firmware-update-lock').exists()
 case('pending-firewall-edits-preserved',pending)
 def marker(r):
  (r/'tmp/.upgrade.burning').touch();bad(run(r,'install.sh','--uplinks-disconnected'));assert not (r/'configs/firmware-update-lock').exists()
 case('inflight-upgrade-marker-refused',marker)
 def unsupported(r):
  (r/'rom/etc/buildinfo').write_text('SOFTWAREVERSION=unknown\n');bad(run(r,'install.sh','--uplinks-disconnected'))
 case('unknown-build-refused',unsupported)
 def failed_mount(r):
  bad(run(r,'install.sh','--uplinks-disconnected',FAIL_TARGET=str(r/'usr/sbin/imageTool')));assert not (r/'tmp/g6-fw-lock/ready').exists();bad(run(r,'guard-installed','status'))
 case('failed-bind-no-false-ready',failed_mount)
 def foreign(r):
  dst=r/'usr/sbin/imageTool';(r/'proc/mounts').write_text((r/'proc/mounts').read_text()+'foreign '+str(dst)+' none rw 0 0\n');bad(run(r,'install.sh','--uplinks-disconnected'));assert dst.read_text().startswith('original ')
 case('foreign-file-mount-refused',foreign)
 def symlink(r):
  p=r/'sbin/sysupgrade';p.unlink();p.symlink_to(r/'usr/sbin/imageTool');bad(run(r,'install.sh','--uplinks-disconnected'));assert not (r/'tmp/g6-fw-lock/ready').exists()
 case('symlink-target-refused',symlink)
 def undo_foreign(r):
  ok(run(r,'install.sh','--uplinks-disconnected'));p=r/'usr/sbin/imageTool';p.write_text('different mounted source\n');bad(run(r,'remove.sh'));assert p.read_text()=='different mounted source\n'
 case('undo-refuses-changed-overlay',undo_foreign)
 return results
if __name__=='__main__':
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--firmware-root',type=Path,required=True);ap.add_argument('--out',type=Path);a=ap.parse_args();tests=main(a.firmware_root)
 report={'scope':'Hermetic path-mapped shell integration; mount/umount/uci/id/logger mocked. No live firmware/router/kernel mount/firewall operations.','firmware_root':str(a.firmware_root),'tests':tests};out=json.dumps(report,indent=2)+'\n'
 if a.out:a.out.write_text(out)
 print(out)
