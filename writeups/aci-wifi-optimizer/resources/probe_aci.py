#!/usr/bin/env python3
"""Run the hash-pinned G6 ACI parser under host QEMU with inert vendor libraries.
No original vendor library, D-Bus service, router or RF-control operation is used.
"""
import argparse,hashlib,json,shutil,subprocess
from pathlib import Path
HJL_SHA256='876a66e3563d234711a24487a62b58b6f010611d1cf868061e30a6c32f65d132'
MAC='02:00:00:00:00:01'

def main():
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--root',required=True,type=Path);ap.add_argument('--out',required=True,type=Path);a=ap.parse_args()
    binary=a.root/'usr/bin/aci';assert hashlib.sha256(binary.read_bytes()).hexdigest()==HJL_SHA256
    a.out.mkdir(parents=True,exist_ok=True);lib=a.out/'mock-libs';lib.mkdir(exist_ok=True)
    source=Path(__file__).with_name('aci_mock.c')
    subprocess.run(['aarch64-linux-gnu-gcc','-shared','-fPIC','-nostartfiles','-fno-stack-protector','-o',str(lib/'libnillocalRRM.so'),str(source)],check=True)
    empty=a.out/'empty.c';empty.write_text('void aci_mock_placeholder(void) {}\n')
    subprocess.run(['aarch64-linux-gnu-gcc','-shared','-fPIC','-nostdlib','-o',str(lib/'empty.so'),str(empty)],check=True)
    for name in ['libndbus.so','libcsrv_timer.so','libnilnva.so','libnvarpc.so','libstdc++.so.6','libm.so.6','libgcc_s.so.1']:
        shutil.copyfile(lib/'empty.so',lib/name)
    cases=[
      ('help',['-h'],None),('version',[],'ai_engine_get_version_info'),('dump-stub',['dump_config'],None),
      ('global-enable',['enable'],'nwa_local_rrm_contrl 1'),('global-disable',['disable'],'nwa_local_rrm_contrl 0'),
      ('auto24-help-set-skipped',['-s','auto','-b','24','-e','1'],None),
      ('auto5-set',['-s','auto','-b','5','-e','1'],'nwa_local_rrm_enable_radio band=5 enable=1'),
      ('get-auto24',['-g','auto','-b','24'],'ai_engine_getAutoChannelStatus 24'),
      ('get-list24',['-g','channel_list','-b','24'],'ai_engine_getAvaliableChannelList 24'),
      ('get-domain-error-mislabel',['-g','domain'],'ai_engine_getDomainInfo return=-7'),
      ('get-node',['-g','node','-m',MAC],'ai_engine_getNodeInfo '+MAC),
      ('get-radio',['-g','radio','-m',MAC,'-r','ath0'],'ai_engine_getRadioInfo '+MAC+' ath0'),
      ('get-score',['-g','score','-m',MAC,'-b','5'],'ai_engine_getChannelScore '+MAC+' 5'),
      ('get-align',['-g','align_score','-m',MAC,'-b','5'],'ai_engine_getNeighbhorAlignScore '+MAC+' 5'),
      ('get-location',['-g','location','-m',MAC,'-c','108'],'ai_engine_getChannelLocationInfo '+MAC+' 108'),
      ('get-action',['-g','action','-i','1','-b','5','-w','3','-c','108'],'ai_engine_getActionInfo 1 108 5 3'),
      ('get-action6',['-g','action','-i','1','-b','6','-w','3','-c','37'],'ai_engine_getActionInfo6 1 37 6 3'),
      ('all-actions',['-g','all_actions','-i','1'],'ai_engine_getAllActionInfo 1'),
      ('blocked-dump',['-g','blocked_channels'],'ai_engine_logBlockedChannels'),
      ('set-channel',['-s','channel','-i','1','-b','5','-c','108','-w','3'],'ai_engine_setForceChannel 1 5 108 3'),
      ('set-channel-list',['-s','channel_list','-b','24','-v','1,6,11;1,6,11'],'ai_engine_setAvaliableChannelList 24 1,6,11;1,6,11'),
      ('set-utilization',['-s','utilization_threshold','-i','80'],'ai_engine_setUtilizationThreshold 80'),
      ('set-interference',['-s','interference_threshold','-i','60'],'ai_engine_setMinInterferenceThreshold 60'),
      ('set-sensing',['-s','sensing_period','-i','30'],'ai_engine_setSensingPeriod 30'),
      ('set-exploration',['-s','exploration_period','-i','900'],'ai_engine_setExplorationPeriod 900'),
      ('set-log',['-s','log','-o','1','-l','3'],'ai_engine_setLogLevel 1 3'),
      ('get-optimize-is-action',['-g','optimize_wifi'],'nwa_local_rrm_enable_optimize_wifi'),
      ('set-optimize-is-domain-query',['-s','optimize_wifi'],'nwa_retrieve_domain_info_from_localRRM')]
    results=[]
    for name,args,expected in cases:
        run=subprocess.run(['qemu-aarch64','-L',str(a.root),'-E','LD_LIBRARY_PATH='+str(lib.resolve()),str(binary),*args],capture_output=True,text=True,timeout=10)
        observed=[line for line in run.stdout.splitlines() if line.startswith('MOCK ')]
        expected_exit=len('Get neighbour align scores failed \n') if name=='get-align' else 0
        good=run.returncode==expected_exit and ('BLOCKED ' not in run.stderr) and (not observed if expected is None else any(expected in x for x in observed))
        results.append({'name':name,'argv':args,'expected_mock':expected,'mock_calls':observed,'exit_status':run.returncode,'expected_exit_status':expected_exit,'stdout':run.stdout,'stderr':run.stderr,'passed':good})
    report={'schema_version':1,'date':'2026-10-29','scope':'Host QEMU execution of original G6 ACI command parser with all vendor operations replaced by inert mock libraries; no original RRM/controller/network/radio operation. Mock return values are synthetic, not actual router results.','source_sha256':HJL_SHA256,'cases':results,'passed':all(x['passed'] for x in results)}
    (a.out/'parser-validation.json').write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps({'passed':report['passed'],'cases':len(results),'failed':[x for x in results if not x['passed']]},indent=2))
    if not report['passed']:raise SystemExit(1)
if __name__=='__main__':main()
