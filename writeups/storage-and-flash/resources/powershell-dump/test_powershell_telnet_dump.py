#!/usr/bin/env python3
"""Exercise the native PowerShell dumper against a loopback-only fake Telnet router."""
import argparse,base64,hashlib,json,os,re,socket,subprocess,tempfile,threading,time,zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[4];SCRIPT=ROOT/'tutorials/dump-firmware/beacon-g6-dump-telnet-2323.ps1'
NAMES=['ssb','uboot-env','RI','rootfs0','rootfs1','rootfs_data0','rootfs_data1','cfg','log','extfs','0:ART','user_data']
FIRMWARE=[0,1,2,3,4,5,6,7,9,10]
PAYLOADS={n:(bytes(range(256))*((131073 if n==0 else 4097+n)//256+1))[:131073 if n==0 else 4097+n] for n in range(12)}
class Router:
 def __init__(self,case):
  self.case=case;self.commands=[];self.dumps=[];self.errors=[];self.stop=threading.Event();self.connection=None
  self.listener=socket.socket();self.listener.bind(('127.0.0.1',0));self.listener.listen(1);self.listener.settimeout(.2);self.port=self.listener.getsockname()[1]
  self.thread=threading.Thread(target=self.serve,daemon=True);self.thread.start()
 def send(self,data,fragment=False):
  # Network write fragmentation is deliberate; TCP may coalesce adjacent writes.
  if fragment:
   for i in range(0,len(data),3):self.connection.sendall(data[i:i+3])
  else:self.connection.sendall(data)
 def lines(self):
  line=bytearray();state=0
  while not self.stop.is_set():
   try:b=self.connection.recv(65536)
   except socket.timeout:continue
   if not b:return
   for ch in b:
    if state==0:
     if ch==255:state=1
     elif ch==10:
      text=line.decode('utf-8').rstrip('\r');line.clear()
      if text:yield text
     else:line.append(ch)
    elif state==1:
     if ch==255:line.append(ch);state=0
     elif ch in [251,252,253,254]:state=2
     elif ch==250:state=3
     else:state=0
    elif state==2:state=0
    elif state==3:
     if ch==255:state=4
    elif state==4:state=0 if ch==240 else 3
 def table(self):
  lines=['dev: size erasesize name']
  for n in range(12):
   if self.case=='missing-partition' and n==9:continue
   name='logical-kernel-view' if self.case=='wrong-layout' and n==3 else NAMES[n]
   lines.append(f'mtd{n}: {len(PAYLOADS[n]):08x} 00040000 "{name}"')
  lines.append('mtd12: 00001000 00001000 "logical-volume-view"')
  return '\n'.join(lines).encode()
 def respond(self,command):
  start=re.search(r"'(__G6PS_BEGIN_[0-9a-f]{32}__)'",command);end=re.search(r"'(__G6PS_END_[0-9a-f]{32}__)'",command)
  assert start and end,command
  remote=re.search(r"'; \{ (.*); \}; g6_ps_rc=\$\?;",command).group(1);self.commands.append(remote)
  data='fixture metadata Ω'.encode();status=0
  if remote=='id -u':data=b'1000' if self.case=='not-root' else b'0'
  elif remote=='cat /proc/mtd':data=self.table()
  elif remote.startswith('if command -v base64'):
   encoder={'busybox':'busybox','openssl':'openssl','no-encoder':'none'}.get(self.case,'base64');data=('G6ENC:'+encoder).encode()
  else:
   match=re.fullmatch(r'(base64 |busybox base64 |openssl base64 -in )/dev/mtd(\d+)',remote)
   if match:
    n=int(match[2]);assert n in range(12);self.dumps.append(n);payload=PAYLOADS[n]
    if n==3 and self.case=='short-read':payload=payload[:-3]
    if n==3 and self.case=='overlong-read':payload+=b'extra'
    data=base64.b64encode(payload);width=64 if match[1].startswith('openssl') else 76;data=b'\r\n'.join(data[i:i+width] for i in range(0,len(data),width))
    if n==3 and self.case=='bad-base64':data=data[:20]+b'!'+data[20:]
    if n==3 and self.case=='encoder-error':status=1
    if n==3 and self.case=='incomplete-quartet':data=data[:-1]
    if n==3 and self.case=='data-after-padding':data+=b'AAAA'
    # Valid protocol negotiations/subnegotiation inside the framed Base64 output.
    data=data[:5]+b'\xff\xfb\x01\xff\xfd\x03\xff\xfa\x18\x00VT100\xff\xffx\xff\xf0'+data[5:]
  self.send(command.encode()+b'\r\n'+start[1].encode()+b'\r\n',True)
  if self.case=='idle-timeout' and remote=='base64 /dev/mtd3':
   self.stop.wait(4);return
  if self.case=='missing-end' and remote=='base64 /dev/mtd3':
   self.send(data);self.stop.wait(4);return
  if self.case=='disconnect' and remote=='base64 /dev/mtd3':
   self.send(data[:100]);self.connection.shutdown(socket.SHUT_RDWR);return
  self.send(data)
  self.send(b'\r\n'+end[1].encode()+b':'+str(status).encode()+b'\r\nroot@Cortina:/# ',True)
 def serve(self):
  try:
   while not self.stop.is_set():
    try:self.connection,_=self.listener.accept();break
    except socket.timeout:continue
   if self.connection is None:return
   self.connection.settimeout(.2);self.connection.setsockopt(socket.IPPROTO_TCP,socket.TCP_NODELAY,1)
   self.send(b'\xff\xfb\x01\xff\xfd\x03',True)
   lines=self.lines()
   if self.case in ['password-login','credential-login']:
    self.send(b'login: ',True);assert next(lines)=='root';self.send(b'Password: ',True);assert next(lines)=='fixture-only-password'
   self.send(b'root@Cortina:/# ',True)
   for command in lines:
    self.respond(command)
    if self.case=='disconnect' and self.dumps and self.dumps[-1]==3:break
  except (BrokenPipeError,ConnectionResetError,ConnectionAbortedError,OSError):pass
  except Exception as error:self.errors.append(type(error).__name__+': '+str(error))
  finally:
   if self.connection:self.connection.close()
 def close(self):
  self.stop.set();self.listener.close()
  if self.connection:
   try:self.connection.shutdown(socket.SHUT_RDWR)
   except OSError:pass
  self.thread.join(timeout=5)

def test_case(exe,case,folder):
 router=Router(case);out=folder/'capture [fixture] with spaces';scope='full' if case=='full' else 'firmware'
 cmd=[exe,'-NoProfile','-NonInteractive','-ExecutionPolicy','Bypass','-File',str(SCRIPT),'-RouterIP','127.0.0.1','-TelnetPort',str(router.port),'-DumpScope',scope,'-Out',str(out),'-IdleTimeoutSeconds','1','-PartitionTimeoutSeconds','20']
 if case=='skip-zip':cmd+=['-SkipZip']
 env=os.environ.copy()
 for key in ['ROUTER_IP','TELNET_PORT','DUMP_SCOPE','OUT','TELNET_PASSWORD','PSModulePath']:env.pop(key,None)
 if case=='password-login':env['TELNET_PASSWORD']='fixture-only-password'
 if case=='credential-login':
  def quote(value):return "'"+str(value).replace("'","''")+"'"
  command="$fixtureSecure=[Security.SecureString]::new(); foreach($fixtureChar in 'fixture-only-password'.ToCharArray()){ $fixtureSecure.AppendChar($fixtureChar) }; & "+quote(SCRIPT)+' -RouterIP 127.0.0.1 -TelnetPort '+str(router.port)+' -Out '+quote(out)+" -Credential ([PSCredential]::new('root',$fixtureSecure))"
  cmd=[exe,'-NoProfile','-NonInteractive','-ExecutionPolicy','Bypass','-Command',command]
 if case=='existing-output':out.mkdir();(out/'sentinel').write_bytes(b'unchanged')
 start=time.monotonic()
 try:process=subprocess.run(cmd,capture_output=True,text=True,encoding='utf-8',errors='replace',env=env,timeout=55)
 finally:router.close()
 assert not router.errors,router.errors
 expected_success=case in ['firmware','full','busybox','openssl','skip-zip','password-login','credential-login']
 if expected_success:
  assert process.returncode==0,process.stdout+'\n'+process.stderr
  expected=list(range(12)) if scope=='full' else FIRMWARE;assert router.dumps==expected,router.dumps
  files={}
  for n in expected:
   name=f'mtd{n:02d}_{NAMES[n].replace(":","_")}.bin';data=(out/name).read_bytes();assert data==PAYLOADS[n];files[name]=data
  sums=(out/'SHA256SUMS.txt').read_text(encoding='utf-8');assert len(sums.splitlines())==len(expected)
  for line in sums.splitlines():
   digest,name=line.split('  ',1);assert hashlib.sha256(files[name]).hexdigest()==digest
  assert not list(out.glob('*.partial'));assert 'Ω' in (out/'router-metadata.txt').read_text(encoding='utf-8')
  archive=out/'beacon-g6-clean-dumps.zip'
  if case=='skip-zip':assert not archive.exists()
  else:
   with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None;assert set(z.namelist())==set(files)|{'router-metadata.txt','proc-mtd.txt','SHA256SUMS.txt','FILE-TYPES.txt'}
    for name,data in files.items():assert z.read(name)==data
  assert 'mtd12' not in [f'mtd{x}' for x in router.dumps]
 else:
  assert process.returncode!=0,'Failure case succeeded: '+case
  assert not (out/'beacon-g6-clean-dumps.zip').exists()
  if case=='existing-output':assert (out/'sentinel').read_bytes()==b'unchanged' and router.dumps==[]
  if case in ['missing-partition','wrong-layout','not-root','no-encoder']:assert router.dumps==[]
  if case in ['bad-base64','short-read','overlong-read','encoder-error','incomplete-quartet','data-after-padding','missing-end','disconnect','idle-timeout']:
   assert (out/'mtd03_rootfs0.bin.partial').exists() and not (out/'mtd03_rootfs0.bin').exists()
   assert router.dumps==[0,1,2,3]
 return {'runtime':Path(exe).name,'case':case,'result':'passed','expected_success':expected_success,'process_exit':process.returncode,'dumped_physical_partitions':router.dumps,'seconds':round(time.monotonic()-start,3),'remote_commands':router.commands}

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--powershell',action='append',required=True);ap.add_argument('--output');args=ap.parse_args();rows=[]
 cases=['firmware','full','busybox','openssl','skip-zip','password-login','credential-login','bad-base64','short-read','overlong-read','encoder-error','incomplete-quartet','data-after-padding','missing-end','disconnect','idle-timeout','missing-partition','wrong-layout','not-root','no-encoder','existing-output']
 private=ROOT/'config-private/powershell-dump-validation-20261105';private.mkdir(exist_ok=True)
 with tempfile.TemporaryDirectory(prefix='mock-',dir=private) as tmp:
  temp=Path(tmp).resolve();assert temp.is_relative_to(private.resolve())
  for exe in args.powershell:
   for n,case in enumerate(cases):
    folder=temp/(Path(exe).name+'-'+str(n));folder.mkdir()
    row=test_case(exe,case,folder);rows.append(row);print(Path(exe).name,case,'passed',flush=True)
 result={'date':'2026-11-05','result':'passed','scope':'Real Windows PowerShell runtimes and native receiver against loopback-only fake Telnet router; no actual router/flash access','script_sha256':hashlib.sha256(SCRIPT.read_bytes()).hexdigest(),'cases':len(rows),'fixture_sizes':{str(n):len(b) for n,b in PAYLOADS.items()},'tests':rows,'limits':['Synthetic MTD names/size table and data; no live G6 boot/PTY/MTD read','TCP writes fragmented deliberately; TCP may coalesce writes','No physical NAND/OOB/read-error or live filesystem snapshot validation','No independent source-device SHA256 added']}
 if args.output:Path(args.output).write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
 print(json.dumps({k:v for k,v in result.items() if k!='tests'},indent=2))
if __name__=='__main__':main()
