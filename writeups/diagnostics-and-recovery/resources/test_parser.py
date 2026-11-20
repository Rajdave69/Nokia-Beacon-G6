#!/usr/bin/env python3
"""Execute only original PCD parser/dependency predicate under qemu-user.
Original main is replaced. Process/network/recovery entrypoints fail closed.
"""
from pathlib import Path
import hashlib,json,subprocess,tempfile,sys
ROOT=Path(__file__).resolve().parents[3]
sys.path.insert(0,str(ROOT/'writeups/security-keys/resources'))
from publication_aliases import source_path

def rule(name,action='RESTART',extra='',deps='NONE'):
    return f"RULE = test_{name}\nSTART_COND = {deps}\nCOMMAND = /bin/true\nSCHED = NICE 0\nDAEMON = YES\nEND_COND = NONE\nEND_COND_TIMEOUT = -1\nFAILURE_ACTION = {action}\n{extra}ACTIVE = YES\n"
def sha(b):return hashlib.sha256(b).hexdigest()
def main():
    out=Path(__file__).resolve().parent;rom=source_path('private-source://PROFILE-G6-HJL');inventory=json.loads((out/'inventory.json').read_text());rows=[]
    conf=rule('a')+rule('b','RESTART 3','FAILURE_INTERVAL = 10\nFAILURE_RESET_COUNT = 1\nALIVE_TIMEOUT = 75000\n')+rule('c','RESTART','FAILURE_ACTION2 = REBOOT\nFAILURE_ACTION_NEXT = NONE\nFAILURE_RESET_COUNT = 1\n','RULE_COMPLETED test_a test_b')
    cases=[('defaults-limits-and-dependencies',conf,True,0),('direct-reboot-policy',rule('a','REBOOT'),False,0),('comma-dependencies',rule('a')+rule('b')+rule('c',deps='RULE_COMPLETED,test_a,test_b'),False,0),('beyond-comment-interval-range',rule('a',extra='FAILURE_INTERVAL = 4294968\n'),False,0),('beyond-comment-reset-window',rule('a',extra='FAILURE_RESET_COUNT = 1194\n'),False,0)]
    cases.append(('reject-nonnumeric-interval',rule('a',extra='FAILURE_INTERVAL = invalid\n'),False,-1))
    for prof in ['PROFILE-G6-HJL','PROFILE-G6-IJL']:
        parts=[]
        for x in inventory['profiles'][prof]['rules']:
            text=inventory['profiles'][prof]['files'][x['path']]['text'];parts.append(text)
        cases.append(('stock-rules-'+prof,'\n'.join(parts),False,0))
    with tempfile.TemporaryDirectory(prefix='pcd-parser-fixture-') as td:
        td=Path(td);lib=td/'parser-only.so';cmd=['aarch64-linux-gnu-gcc','-shared','-fPIC','-O2','-Wall','-Wl,--allow-shlib-undefined','-Wl,--no-as-needed','-o',str(lib),str(out/'parser_only.c'),str(rom/'lib/libdl.so.2')]
        cc=subprocess.run(cmd,capture_output=True,text=True);assert cc.returncode==0,cc.stderr
        for name,text,pred,expected in cases:
            path=td/(name+'.pcd');path.write_text(text);args=['qemu-aarch64','-L',str(rom),'-E',f'LD_LIBRARY_PATH={rom}/lib:{rom}/usr/lib','-E','LD_PRELOAD='+str(lib),str(rom/'usr/bin/pcd'),str(path)]
            if pred:args.append('predicates')
            z=subprocess.run(args,capture_output=True,text=True,timeout=15);parsed=[json.loads(l) for l in z.stdout.splitlines() if l.startswith('{')];actual=next((v['status'] for v in parsed if v['kind']=='parse'),None)
            passed=z.returncode==0 and actual==expected
            if pred:
                dep=[v['result'] for v in parsed if v['kind']=='dependency'];assert dep==[-1,0,-1,-1],dep
                rr={v['name']:v for v in parsed if v['kind']=='rule'};assert rr['a']['restart_limit']==-1 and rr['a']['failure_reset_count']==0
                assert rr['b']['restart_limit']==3 and rr['b']['alive_period']==75000 and rr['b']['failure_interval']==10
                assert [rr['c'][k] for k in ['action1','action2','action_next']]==[2,1,0]
            if name.startswith('stock-rules-'):
                count=next(v['rules'] for v in parsed if v['kind']=='count');assert count==len(inventory['profiles'][name[len('stock-rules-'):]]['rules'])
            rows.append(dict(name=name,fixture_text=text,fixture_sha256=sha(text.encode()),expected_parser_status=expected,exit_status=z.returncode,parser_status=actual,records=parsed,diagnostics=[l for l in z.stdout.splitlines() if not l.startswith('{')],stderr=z.stderr,passed=passed))
            # Preserve every observed result before evaluating the whole batch.
        result=dict(scope='Original HJL PCD parser and dependency predicate in qemu-user; original main replaced. No supervisor loop, recovery handler, process start, IPC or router command. system/fork/vfork/exec/reboot/kill/socket guarded; root USER lookup mocked. All fixtures in temporary host directory, removed at exit.',binary_source='private-source://PROFILE-G6-HJL/usr/bin/pcd',binary_sha256=sha((rom/'usr/bin/pcd').read_bytes()),fixture_source_sha256=sha((out/'parser_only.c').read_bytes()),fixture_binary_sha256=sha(lib.read_bytes()),compiler_stderr=cc.stderr,cases=rows,passed=all(x['passed'] for x in rows),corrections=['Initial assumption that comment-range overflows are rejected at parse time was false: 4294968 seconds and1194 hours are accepted by the parser; no runtime timer behavior tested.'])
        (out/'parser-test-results.json').write_text(json.dumps(result,indent=2)+'\n')
        print(json.dumps(dict(cases=len(rows),all_passed=result['passed'],statuses={v['name']:v['parser_status'] for v in rows},counts={v['name']:next((q['rules'] for q in v['records'] if q['kind']=='count'),None) for v in rows})))
    if not result['passed']:raise SystemExit(1)
if __name__=='__main__':main()
