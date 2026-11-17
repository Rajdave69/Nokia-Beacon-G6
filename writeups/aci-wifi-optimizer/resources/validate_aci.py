#!/usr/bin/env python3
"""Validate retained ACI evidence offline; no network connection or router command."""
import argparse,ast,hashlib,importlib.util,json,re,struct,subprocess
from pathlib import Path
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[2]

def load(name):return json.loads((HERE/name).read_text(encoding='utf-8'))
def sha(data):return hashlib.sha256(data).hexdigest()
def output(record):
    text=record['normalized_json']['stdout'].replace('\r\r\n','\n').replace('\r\n','\n')
    ends=list(re.finditer(r'^> ACI_SCRIPT_[0-9a-f]+\s*$',text,re.M))
    if ends:text=text[ends[-1].end():]
    return text.split('/lib/firmware # _aci_rc=',1)[0]

def validate(private=False):
    evidence=load('evidence.json');catalog=load('command-catalog.json');parser=load('parser-validation.json');trace=load('trace-index.json')
    assert parser['passed'] and len(parser['cases'])==28 and all(x['passed'] for x in parser['cases'])
    cases={x['name']:x for x in parser['cases']}
    assert cases['auto24-help-set-skipped']['mock_calls']==[]
    assert cases['dump-stub']['mock_calls']==[]
    assert 'optimize_wifi' in cases['get-optimize-is-action']['mock_calls'][0]
    assert 'ETSI' in cases['get-domain-error-mislabel']['stdout']
    assert cases['get-align']['exit_status']==35
    assert cases['get-action']['mock_calls']==['MOCK ai_engine_getActionInfo 1 108 5 3']
    assert len(catalog['D_Bus']['methods'])==27 and len(catalog['commands'])==28
    assert len(trace['ranges'])==15 and sum(x['instructions'] for x in trace['ranges'])==12881
    for item in trace['ranges']:
        text=(HERE/item['trace']).read_bytes();assert sha(text)==item['trace_sha256']
        instructions=re.findall(rb'^([0-9a-f]{8}): ([0-9a-f]{8})  ',text,re.M)
        assert len(instructions)==item['instructions']
        assert [int(a,16) for a,b in instructions]==list(range(int(item['start'],16),int(item['stop_exclusive'],16),4))
        assert sha(b''.join(bytes.fromhex(b.decode()) for a,b in instructions))==item['range_bytes_sha256']
    records=load('live-captures.json')['records'];by_name={x['source'].rsplit('/',1)[-1]:x for x in records}
    assert len(records)==18
    baseline=output(by_name['baseline-result.json']);basic=output(by_name['read-only-basic-result.json']);final=output(by_name['read-only-final-result.json'])
    assert 'Version : 2.1.19' in basic and 'DUMP_CONFIG_EXIT=0' in basic
    assert 'band: 24' in final and 'band: 5' in final and 'band_width: 160' in final
    assert evidence['live']['config_sha256_before_after_and_stock'] in final
    assert evidence['live']['config_sha256_before_after_and_stock'] in output(by_name['read-only-node-result.json'])
    assert 'base64: not found' in output(by_name['read-only-runtime-parameters-result.json'])
    assert by_name['read-only-runtime-parameters-result.json']['normalized_json']['exit_status']==127
    assert '-list: applet not found' in output(by_name['read-only-applet-check-result.json'])
    assert 'NO_BR0_MAC_SOURCE' in output(by_name['read-only-node-result.json'])
    details=output(by_name['read-only-details-result.json'])
    assert details.count('Get radio info failed : -1')==2
    assert evidence['live']['score5_rows']==evidence['live']['align5_rows']==69
    params=load('runtime-parameters.json')['values']
    for name,value in params.items():
        assert struct.unpack('<f' if name.endswith('_float') else '<I',bytes.fromhex(value['bytes_hex']))[0]==value['value']
    for item in records:
        if item['source'].endswith('.sh'):
            for line in item['normalized_text'].splitlines():
                stripped=line.strip()
                if stripped.startswith('aci'):
                    assert stripped in {'aci','aci -h','aci dump_config'} or stripped.startswith('aci -g ')
                    assert 'optimize_wifi' not in stripped and 'all_actions' not in stripped and 'blocked_channels' not in stripped
                assert not re.search(r'^dd\b.*\bof=',stripped)
    for p in HERE.glob('*.py'):ast.parse(p.read_text(encoding='utf-8'),filename=p.name)
    subprocess.run(['sh','-n',str(HERE/'inspect-aci.sh')],check=True)
    sources_checked=0;private_files_checked=0
    if private:
        helper=ROOT/'writeups/security-keys/resources/publication_aliases.py'
        if not helper.is_file():helper=ROOT.parent/'Nokia-Beacon-G6/writeups/security-keys/resources/publication_aliases.py'
        spec=importlib.util.spec_from_file_location('aliases',helper);aliases=importlib.util.module_from_spec(spec);spec.loader.exec_module(aliases)
        spec=importlib.util.spec_from_file_location('native',HERE/'native_trace.py');native=importlib.util.module_from_spec(spec);spec.loader.exec_module(native);cache={}
        for profile in load('profile-comparison.json')['profiles'].values():
            for item in profile['files'].values():
                data=aliases.source_path(item['source']).read_bytes();assert len(data)==item['bytes'] and sha(data)==item['sha256'];sources_checked+=1
                if 'complete_text' in item:assert item['complete_text'].encode()==data
        for item in trace['ranges']:
            if item['source'] not in cache:cache[item['source']]=native.ELF(aliases.source_path(item['source']))
            elf=cache[item['source']];assert sha(elf.data)==item['source_sha256'];start=int(item['start'],16);stop=int(item['stop_exclusive'],16)
            assert sha(elf.read(start,stop-start))==item['range_bytes_sha256']
        hjl=next(e for uri,e in cache.items() if uri=='private-source://PROFILE-G6-HJL/usr/bin/ai_controller')
        for item in load('controller-callback-map.json')['callbacks']:assert hjl.pointer(int(item['registration_GOT_slot'],16))==int(item['callback'],16)
        for item in load('retained-evidence.json')['files']:
            raw=aliases.source_path(item['source']).read_bytes();assert len(raw)==item['bytes'] and sha(raw)==aliases.private_value(item['sha256_alias']);private_files_checked+=1
        for item in records:
            raw=aliases.source_path(item['source']).read_bytes()
            if 'normalized_json' in item:
                value=json.loads(raw)
                if 'raw_stdout_hex' in value:value.pop('raw_stdout_hex');value['raw_stdout_hex_retained_privately']=True
                assert aliases.public_record(value)==item['normalized_json']
            else:assert aliases.public_record(raw.decode())==item['normalized_text']
        raw=json.loads(aliases.source_path('private-source://ACI-ANALYSIS/read-only-runtime-raw-result.json').read_text());buf=bytes.fromhex(raw['raw_stdout_hex'])
        for name,info in params.items():
            match=re.search((r'(?m)^RAW_BEGIN:'+name+r'[\r\n]+(.*?)[\r\n]+RAW_END:'+name+r':dd_exit=0').encode(),buf,re.S)
            assert match and match[1].hex()==info['bytes_hex']
        corpus='\n'.join(p.read_text(encoding='utf-8') for p in HERE.parent.rglob('*') if p.is_file() and p.suffix in {'.md','.json','.py','.c','.sh','.txt'})
        secrets=[v['serial'] for v in aliases.registry()['devices'].values() if isinstance(v,dict) and v.get('serial')]
        secrets += [v for k,v in aliases.registry()['private_values'].items() if k.startswith(('ACI-LIVE-MAC-','TIME-ACI-'))]
        assert not any(v in corpus for v in secrets)
        assert not re.search(r'(?<![\d.])192\.168\.18\.[12](?!\d)',corpus)
    return {'schema_version':1,'date':'2026-10-29','scope':'Offline evidence/source integrity and getter-only command-scope validation; no new target execution or network operation','passed':True,'native_ranges':15,'native_instructions':12881,'mock_parser_cases':28,'catalog_commands':28,'D_Bus_method_tests':27,'normalized_live_records':18,'stock_source_fingerprints_checked':sources_checked,'private_originals_checked':private_files_checked,'normalization_roundtrips_checked':private,'runtime_parameter_bytes_checked':private,'live_setters_or_file_transfers':0}

if __name__=='__main__':
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--private-sources',action='store_true');ap.add_argument('--out',type=Path);a=ap.parse_args();result=validate(a.private_sources);text=json.dumps(result,indent=2)+'\n'
    if a.out:a.out.write_text(text,encoding='utf-8')
    print(text,end='')
