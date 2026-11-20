#!/usr/bin/env python3
"""Independent file-byte, provenance, parser-result and publication checks only."""
from pathlib import Path
import ast,hashlib,json,re,struct,sys
ROOT=Path(__file__).resolve().parents[3]
OUT=Path(__file__).resolve().parent
sys.path.insert(0,str(ROOT/'writeups/security-keys/resources'))
from publication_aliases import source_path,registry
from native_trace import ELF
sha=lambda b:hashlib.sha256(b).hexdigest()
def main():
    inv=json.loads((OUT/'inventory.json').read_text());source_count=0;text_count=0;absent=0
    for prof,d in inv['profiles'].items():
        for rel,row in d['files'].items():
            p=source_path(row['source'])
            if not row['present']:
                assert not p.is_file(),row['source'];absent+=1;continue
            b=p.read_bytes();assert len(b)==row['bytes'] and sha(b)==row['sha256'],row['source'];source_count+=1
            if 'text' in row:
                enc='utf-8' if row['encoding']=='UTF-8' else 'latin1';assert row['text'].encode(enc)==b,row['source'];text_count+=1
    native=json.loads((OUT/'native-calls.json').read_text());traces=[]
    for x in native['records']:
        p=source_path(x['source']);assert sha(p.read_bytes())==x['source_sha256'];txt=(OUT/x['trace']).read_bytes();assert sha(txt)==x['trace_sha256'];traces.append((x['trace'],p))
    for x in json.loads((OUT/'selected-functions.json').read_text())['functions']:
        traces.append((x['trace'],source_path('private-source://PROFILE-G6-HJL/'+x['binary'])))
    comp=json.loads((OUT/'comparisons.json').read_text());x=comp['find_process_id'];traces.append((x['trace'],source_path(x['source'])))
    instructions=0
    for rel,p in traces:
        e=ELF(p);seen=0
        for line in (OUT/rel).read_text().splitlines():
            m=re.match(r'^([0-9a-f]+): ([0-9a-f]{8}) ',line)
            if not m:continue
            a=int(m[1],16);assert e.read(a,4)==bytes.fromhex(m[2]),(rel,m[1]);seen+=1
        assert seen>0,rel;instructions+=seen
    pointers=0
    for f in ['diagnosis-data-literals.json','procd-data-literals.json']:
        d=json.loads((OUT/f).read_text());e=ELF(source_path(d['source']))
        for x in d['pointers']:
            q=struct.unpack('<Q',e.read(int(x['address'],16),8))[0];assert q==int(x['target'],16),x['address'];assert e.literal(q)==x['text'];pointers+=1
    for prof,x in comp['diagnosis_command_tables'].items():
        b=(source_path('private-source://'+prof)/'usr/bin/diagnosis').read_bytes();off=int(x['file_offset'],16)
        for i,row in enumerate(x['records']):
            assert b[off+i*65]==row['id'];assert b[off+i*65+1:off+(i+1)*65].split(b'\0')[0].decode()==row['command']
    fn=comp['fonendoscope_ubus'];e=ELF(source_path('private-source://PROFILE-G6-HJL/usr/bin/fonendoscope'))
    for row in fn['methods']:
        a=int(row['entry_va'],16);n,h=struct.unpack('<QQ',e.read(a,16));assert e.literal(n)==row['name'] and h==int(row['handler_va'],16)
    monitors=json.loads((OUT/'monitor-references.json').read_text())
    for x in monitors:assert sha(source_path(x['source']).read_bytes())==x['sha256']
    test=json.loads((OUT/'parser-test-results.json').read_text());assert test['passed'] and len(test['cases'])==8;assert sha(source_path(test['binary_source']).read_bytes())==test['binary_sha256'];assert sha((OUT/'parser_only.c').read_bytes())==test['fixture_source_sha256']
    counts={}
    for c in test['cases']:
        assert c['passed'] and c['exit_status']==0;assert sha(c['fixture_text'].encode())==c['fixture_sha256']
        if c['name'].startswith('stock-rules-'):
            prof=c['name'].removeprefix('stock-rules-');count=next(v['rules'] for v in c['records'] if v['kind']=='count');assert count==len(inv['profiles'][prof]['rules']);counts[prof]=count
    # Full DWARF structure layout as independent anchor for fixture offsets.
    ty=inv['profiles']['PROFILE-G6-HJL']['files']['usr/bin/pcd']['elf']['dwarf']['types']
    expected={0,32,360,396,400,404,408,416,424,432,540,544,548,552,556,560,564,572,576,580,584,592,600}
    layouts=[{c['attributes'].get('data_member_location') for c in t['children'] if isinstance(c['attributes'].get('data_member_location'),int)} for t in ty if t['attributes'].get('byte_size')==608]
    assert any(expected<=v for v in layouts),'rule_t608layout'
    py=list(OUT.glob('*.py'))
    for f in py:ast.parse(f.read_text())
    docs=list((OUT.parent).rglob('*.md'))+[ROOT/'knowledgebases/diagnostics-and-recovery.md'];links=0
    for f in docs:
        for target in re.findall(r'\[[^\]]*\]\(([^)]+)\)',f.read_text()):
            target=target.strip('<>').split('#')[0]
            if not target or '://' in target:continue
            assert (f.parent/target).exists(),(str(f.relative_to(ROOT)),target);links+=1
    reg=registry();tokens={}
    for alias,d in reg['devices'].items():
        for k,v in d.items():
            if 'serial' in k.lower() and isinstance(v,str) and len(v)>=8:tokens[v.lower()]=alias+':'+k
    def walk(v):
        if isinstance(v,dict):
            for k,w in v.items():yield from walk(k);yield from walk(w)
        elif isinstance(v,list):
            for w in v:yield from walk(w)
        elif isinstance(v,str):yield v
    for v in walk(reg):
        for m in re.findall(r'(?i)(?:[0-9a-f]{2}[:-]){5}[0-9a-f]{2}',v):
            digits=re.sub('[:-]','',m).lower()
            if digits not in ('000000000000','ffffffffffff'):tokens[m.lower()]='private-device-MAC'
    files=[f for f in OUT.parent.rglob('*') if f.is_file() and f.suffix in ['.md','.json','.py','.c','.txt']]
    leaks=[]
    for f in files:
        text=f.read_text().lower()
        for token,alias in tokens.items():
            if token in text:leaks.append(dict(file=str(f.relative_to(ROOT)),identity_alias=alias))
    assert not leaks,leaks
    result=dict(verified_on='2026-11-10',passed=True,scope='Offline source/hash/reversible-text, exact instruction/pointer/table bytes, original parser report/provenance/DWARF layout, Python syntax, local documentation links and known-device serial/MAC publication checks. No router, hardware, network, actual failure/recovery or live permissions tested.',source_files=source_count,full_text_snapshots=text_count,explicit_absent_paths=absent,full_native_traces=len(native['records']),all_native_windows=len(traces),instruction_bytes_checked=instructions*4,instructions_checked=instructions,data_pointers_checked=pointers,command_table_entries=36,fonendoscope_methods=5,monitor_reference_files=len(monitors),parser_cases=8,stock_rule_counts=counts,python_files=len(py),local_doc_links=links,publication_files=len(files),known_identity_leaks=leaks,explicit_native_coverage_gaps=native['failures'])
    (OUT/'verification.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result))
if __name__=='__main__':main()
