#!/usr/bin/env python3
"""Resolve publication aliases using the ignored writeups/README.private.md.

Public aliases are labels, never serials, KDF inputs or digest values. Local
source validation requires the private mapping and original evidence files.
No private mapping is printed or copied into validation output.
"""
import functools,json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]

@functools.lru_cache(maxsize=1)
def registry():
    p=ROOT/'writeups/README.private.md'
    if not p.is_file():
        raise FileNotFoundError('Original-source verification requires the ignored writeups/README.private.md and private captures.')
    match=re.search(r'```json\s*\n(.*?)\n```',p.read_text(encoding='utf-8'),re.S)
    if not match:raise ValueError('Missing JSON alias registry in private mapping')
    return json.loads(match[1])

def private_value(alias):
    return registry()['private_values'][alias]

def device_serial(alias):
    return registry()['devices'][alias]['serial']

@functools.lru_cache(maxsize=1)
def replacement_pattern():
    return re.compile('|'.join(re.escape(x) for x in sorted(registry()['replacements'],key=len,reverse=True)))

def source_path(value):
    if value.startswith('private-source://'):
        if value in registry()['private_sources']:
            value=registry()['private_sources'][value]
        else:
            for alias,path in sorted(registry().get('private_source_roots',{}).items(),key=lambda x:-len(x[0])):
                if value==alias or value.startswith(alias+'/'):
                    relative=value[len(alias):].lstrip('/')
                    if '..' in Path(relative).parts:raise ValueError('Invalid private-source relative path')
                    value=str(Path(path)/relative);break
            else:raise KeyError('Unknown private-source alias')
    if value.startswith('project://'):
        project,_,relative=value[len('project://'):].replace('\\','/').partition('/')
        if project not in ('Nokia-Beacon-G6','Nokia-Beacon-9'):raise ValueError('Unknown evidence project')
        return ROOT.parent/project/relative
    if re.match(r'^[A-Za-z]:[\\/]',value):
        if Path('/mnt').is_dir():return Path('/mnt/'+value[0].lower()+'/'+value[3:].replace('\\','/'))
    return Path(value)

def private_record(value):
    """Restore exact source/digest/KDF-input fields for local checks only."""
    if isinstance(value,dict):
        return {(k[:-6] if k in ('sha256_alias','canonical_public_SPKI_sha256_alias','SPKI_sha256_alias','serial_source_alias','ProgDate_source_alias') else k):private_record(v) for k,v in value.items()}
    if isinstance(value,list):return [private_record(x) for x in value]
    if isinstance(value,str):
        if value.startswith(('private-source://','project://')):return str(source_path(value))
        if value in registry()['private_values']:return private_value(value)
    return value

def public_record(value):
    """Redact registered identifiers before writing a generated public report.

    Unregistered private source paths fail closed: extend the ignored registry
    rather than accidentally publishing a newly discovered device identity.
    """
    if isinstance(value,dict):
        result={}
        for k,v in value.items():
            if k=='source' and isinstance(v,str) and ('/config-private/' in v or '/router-flash-' in v) and v not in registry()['replacements'] and not any(v==p or v.startswith(p+'/') for p in registry().get('private_source_roots',{}).values()):
                raise ValueError('Register the new private source path before publishing this report')
            p=public_record(v)
            if k=='device':p={'first':'G6-A','second':'G6-B','third':'G6-C','fourth':'G6-D','Beacon9':'B9-A'}.get(p,p)
            if k in ('sha256','canonical_public_SPKI_sha256','SPKI_sha256','serial_source','ProgDate_source') and isinstance(p,str) and p.startswith(('DIGEST-','PROGDATE-','G6-','B9-','ONT-')):k+='_alias'
            if k=='received_G6_serials':k='received_G6_device_aliases'
            result[public_record(k)]=p
        return result
    if isinstance(value,list):return [public_record(x) for x in value]
    if isinstance(value,str):
        replacements=registry()['replacements']
        pattern=replacement_pattern()
        return pattern.sub(lambda m:replacements[m[0]],value)
    return value


def original_source_path(value,expected_sha256):
    """Verify historical tool fingerprints against saved pre-publication bytes.

    Renaming identifiers changes public tools, without invalidating the output
    previously produced by those tools. Only an exact hash-matching local
    snapshot may stand in for the changed tool; no mismatch is ignored.
    """
    import hashlib
    p=source_path(value)
    if p.is_file() and hashlib.sha256(p.read_bytes()).hexdigest()==expected_sha256:return p
    if p.is_relative_to(ROOT):
        previous=ROOT/'config-private/publication-prep-20261028/working'/p.relative_to(ROOT)
        if previous.is_file() and hashlib.sha256(previous.read_bytes()).hexdigest()==expected_sha256:return previous
    raise ValueError('Original evidence fingerprint does not match current source or its private publication snapshot')
