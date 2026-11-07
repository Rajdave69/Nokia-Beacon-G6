#!/usr/bin/env python3
"""Build/run offline original-SDK ABI tests. Never run this through a router shell.
Requires cross GCC, qemu-aarch64, the privately retained stock runtime and SDK.
All original SDK device operations are intercepted by capture_sdk.c.
"""
import argparse,hashlib,json,subprocess,tempfile
from pathlib import Path

def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def main():
    p=argparse.ArgumentParser();p.add_argument('--rom',type=Path,required=True);p.add_argument('--sdk',type=Path);p.add_argument('--out',type=Path,required=True);a=p.parse_args();sdk=a.sdk or a.rom/'usr/lib/libca-sdk.so';src=Path(__file__).with_name('capture_sdk.c')
    with tempfile.TemporaryDirectory(prefix='cortina-sdk-fixture-') as tmp:
        exe=Path(tmp)/'capture-sdk';cmd=['aarch64-linux-gnu-gcc','-O2','-Wl,--wrap=__libc_start_main','-Wl,--export-dynamic','-Wl,--allow-shlib-undefined','-Wl,--no-as-needed','-o',str(exe),str(src),str(a.rom/'lib/libdl.so.2')]
        subprocess.run(cmd,check=True)
        z=subprocess.run(['qemu-aarch64','-L',str(a.rom),'-E',f'LD_LIBRARY_PATH={a.rom}/lib:{a.rom}/usr/lib',str(exe),str(sdk)],capture_output=True,text=True,timeout=60)
        rows=[json.loads(l) for l in z.stdout.splitlines() if l.startswith('{')]
        result=dict(scope='Offline qemu-user original SDK; ca_sdk_ioctl capture stub and original transport with open/ioctl/close stubs. No router/device/network access.',exit_status=z.returncode,source_sha256=sha(src),fixture_sha256=sha(exe),sdk_sha256=sha(sdk),records=rows,diagnostics=[l for l in z.stdout.splitlines() if not l.startswith('{')],stderr=z.stderr)
        a.out.write_text(json.dumps(result,indent=2)+'\n')
        print(json.dumps(dict(exit_status=z.returncode,getter_cases=sum(x['kind']=='getter' for x in rows),transport_cases=sum(x['kind']=='transport' for x in rows))))
        if z.returncode:raise SystemExit(z.returncode)
if __name__=='__main__':main()
