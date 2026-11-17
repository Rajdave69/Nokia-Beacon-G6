#!/usr/bin/env python3
"""Retain only nonsecret log/provisioning context and source fingerprints."""
import argparse,collections,hashlib,json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
def fp(p):return {'source':str(p),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--private-root',required=True,type=Path);ap.add_argument('--report',required=True,type=Path);a=ap.parse_args()
 if a.report.exists():raise FileExistsError('Use new report')
 logs=next(a.private_root.glob('ubifs-mtd08_log/*/log'));reboot=logs/'reboot.log';text=reboot.read_text(errors='replace')
 imagecounts=collections.Counter(re.findall(r'^IMAGEVERSION=(3(?:FE|TN)[0-9]{5}[A-Z0-9]{6})',text,re.M))
 flagfiles=[]
 for name in ('.upgrade.bak','.upgrade.log'):
  p=logs/name;counts=collections.Counter(int(x,16) if x.lower().startswith('0x') else int(x) for x in re.findall(r'sb_flag\s*=\s*(0x[0-9a-fA-F]+|[0-9]+)',p.read_text(errors='replace')))
  flagfiles.append({'input':fp(p),'recorded_flag_counts':{hex(k):v for k,v in counts.items()},'limit':'Saved image-status queries, not by themselves evidence of a firmware download or successful flash.'})
 pstore=logs/'pstore/console-ramoops-0';ps=pstore.read_text(errors='replace');cthulhu=logs/'cthulhu.log';ct=cthulhu.read_text(errors='replace')
 artifact_rows=[]
 for label,private in [('third',ROOT/'config-private/third-g6-analysis-20261026'),('fourth',a.private_root)]:
  for p in private.glob('ubifs-*/**/ENC_CFG*'):artifact_rows.append({'device':label,**fp(p)})
 old_cfg=next(a.private_root.glob('ubifs-mtd07_cfg/*/cfg/se.conf'));cfgversion=re.search(r'keysrc0\s*=\s*([^\s]+)',old_cfg.read_text()).group(1)
 report={'schema_version':1,'scope':'Offline bounded interpretation of retained saved log/settings artifacts; no execution, downloads, server queries, rootfs install or actual time validation.','reboot_history':{'source':fp(reboot),'IMAGEVERSION_buildinfo_counts':dict(imagecounts),'factory_default_reset_all_command_occurrences':text.count('/usr/exe/factory-default-reset all'),'2020_clock_tokens_present':'2020-05-16' in text,'interpretation':'The reboot-history buildinfo records support earlier IJL and later HJL operation on this unit; they do not establish original shipping firmware or reliable event dates. No owner modifications reported; reset commands may predate ownership or come from provisioning.'},'upgrade_status_logs':flagfiles,'pstore':{'source':fp(pstore),'regulatory_init_call_trace_present':'regulatory_init' in ps and 'Call trace' in ps,'continued_boot_lines_after_trace':'hal_kernel_init_mcast' in ps,'corrupted_characters_observed':True,'limit':'No complete intelligible panic diagnosis established. Do not infer current hardware/NAND failure or a reproducible crash from this noisy saved fragment.'},'LCM':{'cthulhu_log':fp(cthulhu),'generic_sandbox_start_recorded':'SB[generic]: Start Sandbox' in ct,'storage_size_1048576_recorded':'size 1048576' in ct,'persisted_generic_image':[fp(p) for p in a.private_root.glob('ubifs-mtd11_user_data/**/data/images/generic')],'limit':'Evidence of vendor lifecycle/sandbox use and retained storage; not evidence of an owner-installed service, active remote control or a newly discovered firmware build.'},'operator_packages':artifact_rows,'operator_package_limits':'112/114 are observed provisioning filenames, not Linux firmware-version identifiers. Different ciphertext hashes do not prove different plaintext. No new decoder/decrypted package comparison was performed.','old_cfg':{'source':fp(old_cfg),'keysrc0':cfgversion,'limit':'Retained configuration/security metadata; no matching complete rootfs recovered and no new product mapping established.'},'environment_crosscheck':{'kernel_mtd':'rootfs1','active_part':'1','cfg_partition':'rootfs_data1','sb_flag_hex':'0x72','swug_status_model':{'Active':1,'Committed':1,'Next_Active':1},'img_active_img_commit_img_executed':'All remain zero; do not use them instead of the traced sb_flag/actual cmdline path.','mount_opt_fail':'Saved value1 despite captured mounted /opt and successful private extraction; not a stand-alone diagnosis of present mount/flash failure.'}}
 a.report.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'reboot_versions':dict(imagecounts),'recorded_upgrade_flags':[x['recorded_flag_counts'] for x in flagfiles],'LCM_generic_start_recorded':report['LCM']['generic_sandbox_start_recorded'],'old_cfg_version':cfgversion},indent=2))
if __name__=='__main__':main()
