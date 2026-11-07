#!/usr/bin/env python3
"""Build a deterministic OCI smoke image; no registry push or router connection."""
import argparse,gzip,hashlib,io,json,subprocess,tarfile,uuid
from pathlib import Path

def sha(data): return hashlib.sha256(data).hexdigest()
def js(obj): return (json.dumps(obj,sort_keys=True,separators=(',',':'))+'\n').encode()
def archive(entries):
    stream=io.BytesIO()
    with tarfile.open(fileobj=stream,mode='w',format=tarfile.USTAR_FORMAT) as tf:
        for name,data,mode in entries:
            t=tarfile.TarInfo(name);t.uid=t.gid=0;t.uname=t.gname='';t.mtime=0;t.mode=mode
            if data is None:t.type=tarfile.DIRTYPE;tf.addfile(t)
            else:t.size=len(data);tf.addfile(t,io.BytesIO(data))
    return stream.getvalue()
def build(out,cc,strip):
    out.mkdir(parents=True,exist_ok=True);here=Path(__file__).resolve().parent
    binary=out/'lcm-smoke'
    subprocess.run([cc,'-Os','-static','-fno-ident','-Wl,--build-id=none','-o',str(binary),str(here/'smoke.c')],check=True)
    subprocess.run([strip,'--strip-all',str(binary)],check=True)
    elf=binary.read_bytes()
    if elf[:6]!=b'\x7fELF\x02\x01' or int.from_bytes(elf[18:20],'little')!=183:
        raise ValueError('Expected little-endian AArch64 ELF64')
    app_uuid=str(uuid.uuid5(uuid.NAMESPACE_DNS,'beacon-lcm-smoke.example'))
    root_tar=archive([('tmp',None,0o1777),('run',None,0o755),('proc',None,0o555),('sys',None,0o555),('sys/fs',None,0o755),('sys/fs/cgroup',None,0o755),('dev',None,0o755),('dev/pts',None,0o755),('dev/shm',None,0o1777),('etc',None,0o755),('persistent-data',None,0o755),('temporary-data',None,0o755),('lcm-smoke',elf,0o755)])
    runtime={'ociVersion':'1.0.2','hostname':'beacon-lcm-smoke','root':{'path':'rootfs','readonly':True},
      'process':{'terminal':False,'user':{'uid':0,'gid':0},'args':['/lcm-smoke'],'env':['PATH=/usr/bin:/bin'],'cwd':'/',
        'noNewPrivileges':True,'capabilities':{'bounding':[],'effective':[],'inheritable':[],'permitted':[],'ambient':[]}},
      'mounts':[],
      'linux':{'resources':{'memory':{'limit':16777216},'cpu':{'period':100000,'quota':10000}},
        'namespaces':[{'type':x} for x in ['pid','mount','uts','ipc','network']]}}
    runtime_tar=archive([('config.json',js(runtime),0o644)])
    root_layer=gzip.compress(root_tar,mtime=0);runtime_layer=gzip.compress(runtime_tar,mtime=0)
    annotations={'org.opencontainers.image.title':'beacon-lcm-smoke','org.opencontainers.image.version':'0.0.1',
      'org.opencontainers.image.vendor':'Owner research','org.opencontainers.image.description':'Writes a container-local marker and sleeps; no network activity or host hooks.'}
    config={'created':'2026-10-28T00:00:00Z','architecture':'arm64','os':'linux',
      'config':{'User':'0:0','Env':['PATH=/usr/bin:/bin'],'Entrypoint':['/lcm-smoke'],'WorkingDir':'/','Labels':annotations},
      'rootfs':{'type':'layers','diff_ids':['sha256:'+sha(root_tar),'sha256:'+sha(runtime_tar)]},
      'history':[{'created':'2026-10-28T00:00:00Z','created_by':'owner smoke rootfs'},{'created':'2026-10-28T00:00:00Z','created_by':'owner smoke runtime layer'}]}
    image_config=js(config)
    def desc(data,kind):return {'mediaType':kind,'size':len(data),'digest':'sha256:'+sha(data)}
    manifest={'schemaVersion':2,'mediaType':'application/vnd.oci.image.manifest.v1+json',
      'config':desc(image_config,'application/vnd.oci.image.config.v1+json'),
      'layers':[desc(root_layer,'application/vnd.oci.image.layer.v1.tar+gzip'),desc(runtime_layer,'application/vnd.oci.image.layer.v1.tar+gzip')],
      'annotations':dict(annotations,**{'com.nokia.runtime.config':'sha256:'+sha(runtime_layer)})}
    manifest_bytes=js(manifest);md=desc(manifest_bytes,'application/vnd.oci.image.manifest.v1+json');md['platform']={'os':'linux','architecture':'arm64'};md['annotations']={'org.opencontainers.image.ref.name':'0.0.1'}
    index={'schemaVersion':2,'manifests':[md]};blobs=out/'oci/blobs/sha256';blobs.mkdir(parents=True,exist_ok=True)
    for data in [root_layer,runtime_layer,image_config,manifest_bytes]:(blobs/sha(data)).write_bytes(data)
    (out/'oci/oci-layout').write_bytes(js({'imageLayoutVersion':'1.0.0'}));(out/'oci/index.json').write_bytes(js(index))
    for name,data in [('runtime.json',js(runtime)),('image-config.json',image_config),('manifest.json',manifest_bytes),('rootfs.tar.gz',root_layer),('runtime.tar.gz',runtime_layer)]: (out/name).write_bytes(data)
    report={'name':'beacon-lcm-smoke','version':'0.0.1','tag':'0.0.1','repository':'beacon-lcm-smoke','application_UUID':app_uuid,
      'architecture':'arm64','ELF_bytes':len(elf),'ELF_sha256':sha(elf),'manifest_digest':'sha256:'+sha(manifest_bytes),
      'layers':[desc(root_layer,'application/vnd.oci.image.layer.v1.tar+gzip'),desc(runtime_layer,'application/vnd.oci.image.layer.v1.tar+gzip')],
      'safety_scope':'No network listeners/connections, requested host-directory mounts, lifecycle hooks or autostart; stock adapter injects data and host-tmp mappings. Writes two marker files only under container /tmp; stop handles TERM/INT/PWR.',
      'runtime_memory_bytes':16777216,'runtime_CPU_quota':10000,'runtime_CPU_period':100000,'container_tmpfs':'stock default; no additional mount request',
      'compatibility':'This fixture format ran on G6 HJL.L91p01 on 2026-10-28; this generated output has only been built offline until separately deployed. Beacon 9 remains untested.'}
    (out/'package.json').write_bytes(js(report));print(json.dumps(report))
if __name__=='__main__':
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--out',required=True,type=Path);ap.add_argument('--cc',default='aarch64-linux-gnu-gcc');ap.add_argument('--strip',default='aarch64-linux-gnu-strip');a=ap.parse_args();build(a.out,a.cc,a.strip)
