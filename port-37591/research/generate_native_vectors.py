#!/usr/bin/env python3
"""Reproduce synthetic fixtures with supplied firmware, no router connection.

Requires host aarch64-linux-gnu-gcc/readelf and qemu-aarch64. A private build
folder is required; no Nokia libraries or compiled harness are published.
"""
import argparse,hashlib,json,subprocess
from pathlib import Path

KNOWN = {"hjl": ("3FE49996HJLL91", "71cd97fbbe8c89e2c8f3a957753ffb2ab5dd76ecb1de3bc5ccac450dc3e9c8ed", 131072),
         "ijl": ("3FE49996IJLJ03", "7fea4fcba98358e62ac47123715901954d461f9afcca6b47631712f9dd8f21f4", 65536)}

def digest(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--hjl-root",required=True,type=Path)
    ap.add_argument("--ijl-root",required=True,type=Path)
    ap.add_argument("--build-dir",required=True,type=Path)
    ap.add_argument("--output-dir",required=True,type=Path)
    a=ap.parse_args()
    roots={"hjl":a.hjl_root.resolve(),"ijl":a.ijl_root.resolve()}
    source=Path(__file__).with_name("native_vectors.c")
    for profile,root in roots.items():
        expected,sha,capacity=KNOWN[profile]
        fields=dict(x.split("=",1) for x in (root/"etc/buildinfo").read_text().splitlines() if "=" in x)
        if fields.get("IMAGEVERSION")!=expected or digest(root/"usr/lib/libmeshmsg.so")!=sha:
            raise ValueError("Oracle struct layout is pinned to the two documented original libraries")
        if (a.output_dir/(profile+"-native-vectors.json")).exists():
            raise FileExistsError("Use an empty output directory; fixtures are not silently overwritten")
    a.build_dir.mkdir(parents=True,exist_ok=True)
    a.output_dir.mkdir(parents=True,exist_ok=True)
    binary=a.build_dir/"native-vectors"
    command=["aarch64-linux-gnu-gcc","-O2","-Wall","-Wextra","-fno-stack-protector","-nostartfiles","-no-pie","-Wl,-z,now","-Wl,-E","-Wl,--allow-shlib-undefined","-Wl,--dynamic-linker=/lib/ld-linux-aarch64.so.1",str(source),str(roots['hjl']/"lib/libdl.so.2"),"-o",str(binary)]
    subprocess.run(command,check=True)
    for profile,root in roots.items():
        expected,sha,capacity=KNOWN[profile]
        result=subprocess.run(["qemu-aarch64","-L",str(root),"-E","LD_LIBRARY_PATH=/usr/lib:/lib",str(binary),str(capacity)],check=True,capture_output=True,text=True,timeout=20)
        rows=[json.loads(line) for line in result.stdout.splitlines()]
        if len(rows)!=7 or len({x['name'] for x in rows})!=7 or {x['kind'] for x in rows}!={0,1,2,3,4,5}:
            raise ValueError("Native oracle did not produce all expected vector kinds")
        value={"profile":profile.upper(),"image_version":expected,"library_sha256":sha,"oracle_source_sha256":digest(source),"native_record_capacity":capacity,"source":"Original libmeshmsg.so codec routines under QEMU, synthetic inputs, AF_UNIX framing only","padding_policy":"Original bytes15..31 zeroed before publication; watermark terminator and length untouched","vectors":rows}
        (a.output_dir/(profile+"-native-vectors.json")).write_text(json.dumps(value,indent=2)+"\n")
        print(profile,len(rows),"vectors; no router or Internet socket opened")

if __name__=="__main__":main()
