#!/usr/bin/env python3
# Hermetic Linux integration test. Requires Python 3 and gcc; opens no sockets.
# Only fixture paths, command interception and the polling interval are changed.
import json
import os
from pathlib import Path
import signal
import subprocess
import tempfile
import time
PROJECT=Path(__file__).resolve().parents[4]
SOURCE=PROJECT/'tutorials/setup-persistent-unauthenticated-telnet/replace_with_test.sh'
RESULTS=Path(__file__).with_name('results.json')
checks=[]
def check(name, condition):
    print(name, bool(condition), flush=True)
    assert condition, name
    checks.append({'name':name,'passed':True})
def eventually(predicate, timeout=9):
    until=time.monotonic()+timeout
    while time.monotonic()<until:
        if predicate(): return True
        time.sleep(.05)
    return False
with tempfile.TemporaryDirectory(prefix='telnet-watchdog-test-') as directory:
    root=Path(directory)
    binpath=root/'bin'
    binpath.mkdir()
    env=dict(os.environ,TEST_ROOT=str(root))
    def write(name,text):
        path=binpath/name
        path.write_text(text)
        path.chmod(0o700)
    c=root/'daemon.c'
    c.write_text('#include <stdio.h>\n#include <stdlib.h>\n#include <unistd.h>\nint main(void){char p[1024];snprintf(p,sizeof(p),"%s/fail",getenv("TEST_ROOT"));if(access(p,F_OK)==0)return 17;snprintf(p,sizeof(p),"%s/actual",getenv("TEST_ROOT"));FILE*f=fopen(p,"w");fprintf(f,"%ld",(long)getpid());fclose(f);for(;;)pause();}\n')
    subprocess.run(['gcc','-O2',str(c),'-o',str(binpath/'telnetd')],check=True)
    write('id', '#!/bin/sh\nif [ \"$1\" = -u ]; then echo 0; else /usr/bin/id \"$@\"; fi\n')
    write('iptables','''#!/bin/sh
case "$1" in
-C) test -f "$TEST_ROOT/firewall" ;;
-I) touch "$TEST_ROOT/firewall" ;;
-D) if test -f "$TEST_ROOT/firewall"; then rm "$TEST_ROOT/firewall"; else exit 1; fi ;;
*) exit 2 ;;
esac
''')
    write('netstat','''#!/usr/bin/env python3
import os
from pathlib import Path
r=Path(os.environ['TEST_ROOT'])
alive=False
try:
 p=(r/'actual').read_text().strip()
 alive=Path('/proc/'+p+'/stat').read_text().split()[2]!='Z'
except (OSError,IndexError): pass
if (alive and not (r/'no-listener').exists()) or (r/'foreign').exists():
 print('tcp 0 0 0.0.0.0:2323 0.0.0.0:* LISTEN')
''')
    write('start-stop-daemon','''#!/usr/bin/env python3
import os, subprocess, sys
assert sys.argv[sys.argv.index('-p')+1] == '/dev/null'
assert '-m' not in sys.argv
args=sys.argv[sys.argv.index('--')+1:]
subprocess.Popen(['/bin/sh']+args, env=os.environ, start_new_session=True,
 stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
''')
    script=root/'hook.sh'
    text=SOURCE.read_text().replace('PATH=/usr/sbin:/usr/bin:/sbin:/bin',f'PATH={binpath}:/usr/sbin:/usr/bin:/sbin:/bin')
    text=text.replace('/configs/debug',str(root/'configs')).replace('/tmp/root-telnet',str(root/'root-telnet'))
    text=text.replace('TELNETD=/usr/sbin/telnetd',f'TELNETD={binpath}/telnetd').replace('/sbin/start-stop-daemon',str(binpath/'start-stop-daemon'))
    script.write_text(text.replace('INTERVAL=5','INTERVAL=1'))
    subprocess.run(['/bin/sh','-n',str(script)],check=True)
    def invoke(*args): return subprocess.run(['/bin/sh',str(script),*args],env=env,check=True,timeout=6)
    def pid(name):
        try: return int((root/name).read_text().strip())
        except (OSError,ValueError): return 0
    def alive(p):
        try: return p>1 and Path(f'/proc/{p}/stat').read_text().split()[2]!='Z'
        except (OSError,IndexError): return False
    def managed():
        p=pid('root-telnetd.pid')
        return p if alive(p) and pid('actual')==p else 0
    def stop():
        invoke('--stop')
        assert eventually(lambda:not (root/'root-telnet-watchdog.pid').exists())
    unrelated=None
    try:
        launches=[subprocess.Popen(['/bin/sh',str(script)],env=env) for _ in range(5)]
        for process in launches: assert process.wait(timeout=6)==0
        check('concurrent launch establishes managed listener',eventually(managed))
        watch=pid('root-telnet-watchdog.pid')
        time.sleep(2.3)
        matching=[]
        for proc in Path('/proc').glob('[0-9]*/cmdline'):
            try: argv=proc.read_bytes().split(b'\0')
            except OSError: continue
            if str(script).encode() in argv and b'--root-telnet-watchdog' in argv: matching.append(proc.parent.name)
        check('exactly one detached watchdog',matching==[str(watch)])
        first=managed()
        assert first>1
        os.kill(first,signal.SIGTERM)
        check('TERM-killed daemon is replaced',eventually(lambda:(current:=managed()) and current!=first))
        (root/'firewall').unlink()
        check('removed firewall rule is restored',eventually(lambda:(root/'firewall').exists()))
        first=managed()
        assert first>1
        os.kill(first,signal.SIGKILL)
        check('KILL-killed daemon is replaced',eventually(lambda:(current:=managed()) and current!=first))
        unrelated=subprocess.Popen(['sleep','60'])
        first=managed()
        (root/'root-telnetd.pid').write_text(str(unrelated.pid))
        assert first>1
        os.kill(first,signal.SIGTERM)
        check('unrelated stale PID does not block recovery',eventually(lambda:(current:=managed()) and current!=first))
        check('unrelated stale-PID process is not killed',unrelated.poll() is None)
        first=managed()
        (root/'no-listener').touch()
        check('managed process without listener is restarted',eventually(lambda:(current:=managed()) and current!=first))
        (root/'no-listener').unlink()
        stop()
        check('stop removes supervisor daemon and firewall',not alive(pid('actual')) and not (root/'firewall').exists())
        (root/'root-telnet-watchdog.lock').mkdir()
        (root/'root-telnet-watchdog.pid').write_text(str(unrelated.pid))
        invoke()
        check('stale supervisor PID and lock recover',eventually(managed))
        check('stale supervisor PID owner survives',unrelated.poll() is None)
        stop()
        (root/'foreign').touch()
        (root/'actual').unlink(missing_ok=True)
        invoke()
        time.sleep(2)
        check('occupied port does not start duplicate daemon',not managed() and not (root/'actual').exists())
        stop()
        (root/'foreign').unlink()
        (root/'fail').touch()
        invoke()
        check('launch failure is reported as not listening',eventually(lambda:'not listening; will retry' in (root/'root-telnet-watchdog.log').read_text()))
        (root/'fail').unlink()
        check('failed daemon launch is retried successfully',eventually(managed))
        stop()
        time.sleep(1.4)
        check('explicit stop remains stopped',not managed() and not (root/'root-telnet-watchdog.pid').exists())
    finally:
        try: stop()
        except Exception: pass
        if unrelated is not None:
            unrelated.terminate()
            unrelated.wait(timeout=3)
RESULTS.write_text(json.dumps({'scope':'Linux host shell; fake daemon/listener/firewall/launcher; no sockets, router contact or router writes','production_poll_seconds':5,'test_poll_seconds':1,'checks':checks},indent=2)+'\n')
print(json.dumps({'passed':len(checks),'results':str(RESULTS)}))
