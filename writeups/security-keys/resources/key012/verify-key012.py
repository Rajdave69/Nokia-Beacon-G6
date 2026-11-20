#!/usr/bin/env python3
"""Validate default/explicit crypto and deprecated lookups in an extracted modern firmware.

Host-only Linux/WSL: requires qemu-aarch64, aarch64-linux-gnu-gcc, cryptography,
and the matching original glibc/libdl runtime. Never runs a router command.
Only supports the modern embedded-key branch; older store-backed code needs init.
"""
import argparse,base64,hashlib,importlib.util,json,subprocess,tempfile
from pathlib import Path
from cryptography.hazmat.primitives.ciphers import Cipher,algorithms,modes
from cryptography.hazmat.primitives.padding import PKCS7
ROOT=Path(__file__).resolve().parents[4]
def module(path):
    spec=importlib.util.spec_from_file_location("prepare",path)
    mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod);return mod
def run(root):
    root=Path(root).resolve();library=root/"usr/lib/libsec_engine.so"
    prepare=module(ROOT/"network-services/webui/scripts/prepare-config-keys.py")
    keys=prepare.static_keys(root,prepare.backup_module())
    raw={name:bytes.fromhex(keys[name].replace(":","")) for name in ("key0","key1","key2")}
    data=library.read_bytes()
    if not all(value in data for value in raw.values()):
        raise ValueError("Expected embedded modern key slots; do not run this probe against the old store-backed branch")
    plain=b"key-role-probe"
    pad=PKCS7(128).padder();padded=pad.update(plain)+pad.finalize()
    def encrypt(key,iv):
        ctx=Cipher(algorithms.AES(key),modes.CBC(iv)).encryptor()
        return ctx.update(padded)+ctx.finalize()
    expected=(encrypt(raw["key0"][:32],raw["key1"][:16])+
              encrypt(b"\x11"*32,b"\x22"*16)+
              base64.b64encode(hashlib.sha256(plain+raw["key2"][:32]).digest())+
              base64.b64encode(hashlib.sha256(plain+b"extra").digest()))
    with tempfile.TemporaryDirectory(prefix="key012-native-") as tmp:
        tmp=Path(tmp);(tmp/"expected.bin").write_bytes(expected)
        source=Path(__file__).with_name("native-probe.c")
        if (root/"lib/libdl.so.2").exists():
            command=["aarch64-linux-gnu-gcc","-O2","-fno-stack-protector","-nostartfiles","-no-pie",
                "-Wl,-export-dynamic,--allow-shlib-undefined",str(source),
                "-Wl,--no-as-needed",str(root/"lib/libdl.so.2"),"-Wl,--as-needed","-o",str(tmp/"probe")]
            runtime="original glibc/libdl"
        elif (root/"lib/ld-musl-aarch64.so.1").exists():
            # GNU ld cannot link the saved sectionless musl ELF. A link-only
            # symbol stub gives DT_NEEDED libc.so; QEMU loads the ORIGINAL libc.
            link=subprocess.run(["aarch64-linux-gnu-gcc","-fno-builtin","-nostdlib","-shared",
                "-Wl,-soname,libc.so",str(Path(__file__).with_name("musl-link-stub.c")),"-o",str(tmp/"libc-link.so")],
                capture_output=True,text=True,timeout=60)
            if link.returncode:raise RuntimeError("Link-only musl stub compilation failed")
            command=["aarch64-linux-gnu-gcc","-O2","-fno-stack-protector","-DKEYPROBE_MUSL","-nostdlib","-no-pie",
                "-Wl,-export-dynamic,-dynamic-linker,/lib/ld-musl-aarch64.so.1",str(source),str(tmp/"libc-link.so"),"-o",str(tmp/"probe")]
            runtime="original musl; symbol stub used only during linking"
        else:raise ValueError("Missing matching original runtime")
        build=subprocess.run(command,capture_output=True,text=True,timeout=60)
        if build.returncode:raise RuntimeError("Native probe compilation failed")
        test=subprocess.run(["qemu-aarch64","-L",str(root),"-E","LD_LIBRARY_PATH="+str(root/"usr/lib")+":"+str(root/"lib"),
            str(tmp/"probe"),str(library),str(tmp/"expected.bin")],capture_output=True,text=True,timeout=30)
        if test.returncode:raise RuntimeError("Native probe failed: exit "+str(test.returncode))
        result=json.loads(test.stdout)
    checks=["cbc_matches_key0_key1","hash_matches_key2_suffix","explicit_cbc_matches","explicit_hash_matches"]
    assert all(result[x] is True for x in checks),result
    assert all(result["key%d_lookup_status"%i]==7 for i in range(3)),result
    result.update({"library_sha256":hashlib.sha256(data).hexdigest(),"scope":"Original library under host QEMU; synthetic inputs; no SE init, router access or settings changes","runtime":runtime,"all_checks_passed":True})
    return result
if __name__=="__main__":
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument("--root",required=True,type=Path);ap.add_argument("--out",required=True,type=Path);args=ap.parse_args()
    result=run(args.root);args.out.write_text(json.dumps(result,indent=2)+"\n");print(json.dumps(result))
