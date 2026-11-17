#!/usr/bin/env python3
"""Developer-only check: actual PS-generated frames parsed by local WSL sh; no router."""
from pathlib import Path
import argparse,hashlib,importlib.util,json,re,subprocess,tempfile
ROOT=Path(__file__).resolve().parents[4]
spec=importlib.util.spec_from_file_location('ps_dump_tests',Path(__file__).with_name('test_powershell_telnet_dump.py'));tests=importlib.util.module_from_spec(spec);spec.loader.exec_module(tests)
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--powershell',action='append',required=True);ap.add_argument('--output',required=True);args=ap.parse_args();rows=[]
 private=ROOT/'config-private/powershell-dump-validation-20261105';private.mkdir(exist_ok=True)
 for exe in args.powershell:
  frames=[];original=tests.Router.respond
  def record(self,command):frames.append(command);return original(self,command)
  tests.Router.respond=record
  try:
   with tempfile.TemporaryDirectory(prefix='shell-frames-',dir=private) as tmp:
    target=Path(tmp).resolve();assert target.is_relative_to(private.resolve());tests.test_case(exe,'firmware',target)
  finally:tests.Router.respond=original
  parsed=subprocess.run(['wsl.exe','--exec','sh','-n'],input='\n'.join(frames)+'\n',capture_output=True,text=True,encoding='utf-8',timeout=20);assert parsed.returncode==0,parsed.stderr
  first=frames[0];inner=re.search(r"'; \{ (.*); \}; g6_ps_rc=\$\?;",first).group(1)
  begin=re.search(r"'(__G6PS_BEGIN_[0-9a-f]{32}__)'",first)[1];end=re.search(r"'(__G6PS_END_[0-9a-f]{32}__)'",first)[1]
  needle='{ '+inner+'; }';assert first.count(needle)==1
  safe=first.replace(needle,"{ printf '%s\\n' 'fixture-only-payload'; }")
  # This child executes only fixed printf statements and a shell variable assignment, never the original device command.
  executed=subprocess.run(['wsl.exe','--exec','sh'],input=safe+'\n',capture_output=True,text=True,encoding='utf-8',timeout=20);assert executed.returncode==0 and executed.stdout=='\n'+begin+'\nfixture-only-payload\n\n'+end+':0\n',executed.stdout
  rows.append({'runtime':Path(exe).name,'actual_frame_count':len(frames),'all_frames_POSIX_syntax_valid':True,'safe_printf_only_framing_execution':'passed','actual_frames':frames})
 result={'date':'2026-11-05','result':'passed','scope':'Two additional loopback-only captures; sh -n parses actual emitted frames; fixed-printf-only child checks framing semantics. No original device command executed by sh, no real router access. WSL is a developer-test dependency only.','script_sha256':hashlib.sha256(tests.SCRIPT.read_bytes()).hexdigest(),'tests':rows}
 Path(args.output).write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8');print(json.dumps({'result':'passed','runtimes':len(rows),'actual_frames_syntax_checked':sum(x['actual_frame_count'] for x in rows),'printf_framing_checks':len(rows)}))
if __name__=='__main__':main()
