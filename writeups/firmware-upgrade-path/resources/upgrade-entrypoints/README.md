# G6 firmware-update entry-point evidence

Collected offline beginning 2026-10-25; integrated 2026-10-26. Sources are ALCLFD4B5342's recovered inactive IJL.J03 rootfs0 and active HJL.L91 rootfs1. No firmware executable, updater, router command or network operation was run.

- [collected-static-evidence.json](collected-static-evidence.json): hashes and availability for 21 binary/tool paths per build; symbols and strings; 17 old/18 new complete source snapshots; selected schema lines; whole-tree exact-literal caller searches; RPC handler/argv records. Old lacks optional lib/upgrade/common.sh.
- [static-traces.txt](static-traces.txt): complete .text for swug, rpcsys, batch_upgrade and ca.upgrade in both builds; selected named OTA/NAL/CWMP functions in both builds; current cfgmgr/USP control regions. These are code analysis artifacts, not command execution logs.
- [collect.py](collect.py) and [elf_reader.py](elf_reader.py): reproduction source. Python 3, Capstone, readelf and rg are host prerequisites. The collector reads firmware and writes its output directory; it never executes firmware. Linear annotations are heuristic and must be interpreted with branches and GOT symbols.
- [Conclusions and limitations](../../../../knowledgebases/firmware-upgrade-entrypoints-evidence.json).

Roots were extracted from complete SquashFS images in the clean NAND capture, with only the vendor COMP_OPT flag cleared in temporary extraction copies. These are the older-slot review's complete roots, rather than assumptions based on the tar/scp ROM tree. Image hashes and dump paths are retained in the conclusions evidence and older-slot record.

To regenerate against extracted roots in WSL:

```sh
python3 writeups/firmware-upgrade-path/resources/upgrade-entrypoints/collect.py \
  --old-root /path/to/recovered-IJL-J03 \
  --new-root /path/to/recovered-HJL-L91
```

Default output is this resource directory. Use --out for a separate directory. No router flashing command is part of reproduction. Captured scripts contain firmware commands as evidence; that does not authorize or recommend running them.

Literal searches cover both complete roots. Dynamic command construction, private external provisioning software, other firmware and bootloader-only modes are not excluded by a negative file-string search. Earlier native signature-handler tests were documented separately; this collection does not repeat or broaden those claims.

CWMP detail: dev_download_firmware_upgrade is a diagnostic callback that prints a message and returns zero. The actual transfer/completion code is elsewhere: HJL lib_download_complete calls swdl_end_upgrading_write_image at 0x472050 and swdl_active at 0x472064. Both-build transfer/completion function bodies are retained; a logging-only callback is not being offered as the image writer.
