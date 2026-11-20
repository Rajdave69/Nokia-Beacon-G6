# Diagnostics and recovery research resources

These are offline research tools and evidence, not router installation instructions. Do not copy the supervisor/diagnostic programs or fixture to a router to “try the API”. The native binaries can spawn processes, change networking, remove logs or reboot.

## Records

- `inventory.json`: complete selected original text, exact bytes/hash/source references, all packaged PCD fields, ELF imports/literals/symbols and available DWARF structures/signatures. Latin1 views are reversible when original comments are not UTF-8. Guessed absent paths are explicitly recorded as absent.
- `monitor-references.json`: exact monitor-record literals and source hashes from eighteen binary/profile records; references alone do not prove writers or activation.
- `comparisons.json`: all rules, exact between-profile field changes, executable-section hashes, twelve-command tables and the G6 Fonendoscope ubus method/policy table.
- [pcd-policy-matrix.md](pcd-policy-matrix.md): generated 148-row policy index across the three profiles. ACTIVE is packaged state, not a live observation.
- `native-calls.json`, `traces/`: 24 complete native `.text` decodings plus selected function windows. Instruction addresses/bytes are exact; linear propagated values and call annotations are heuristic, especially across branches and indirect calls. Two sectionless Beacon 9 files are explicit omissions.
- `selected-functions.json`: twenty named original G6 PCD/libpcd functions, including dependency, parser, failure and control paths. The separate `PCD_api_find_process_id` trace resolves the `/proc` name matching used by reboot fallback.
- `diagnosis-data-literals.json`, `procd-data-literals.json`: original static pointer/literal anchors.
- `parser-probe.json`: initial successful synthetic parser/dependency probe, retained as research history.
- `parser-test-results.json`: eight original-parser cases, complete fixtures/stdout/diagnostics/results, including 51 HJL and 45 IJL rules. The initial false assumption about comment-range rejection is retained as a correction.
- `verification.json`: independent source/text/byte/ABI/provenance/link/publication checks; see its exact scope and exceptions.

## Reproduction

Run on the research workstation under Linux/WSL, with the private source aliases resolvable, Python `pyelftools`/`capstone`, `qemu-aarch64` and `aarch64-linux-gnu-gcc`. Paths in the following commands are relative to the G6 project root:

```sh
python3 writeups/diagnostics-and-recovery/resources/collect.py --out writeups/diagnostics-and-recovery/resources
python3 writeups/diagnostics-and-recovery/resources/build_native.py
python3 writeups/diagnostics-and-recovery/resources/enrich.py
python3 writeups/diagnostics-and-recovery/resources/test_parser.py
python3 writeups/diagnostics-and-recovery/resources/verify.py
```

`collect.py`, `build_native.py`, `enrich.py` and `verify.py` only inspect saved files. The parser test compiles `parser_only.c` as a preload library and runs the original HJL PCD ELF in qemu-user with its original main replaced. It calls the parser, rule getters and one dependency predicate; it never enters the supervisor loop. The fixture blocks system/fork/vfork/exec/reboot/kill/socket paths, substitutes root-only account lookup, and deletes its host temporary directory on completion. It does not initialize PCD IPC. Original recovery handlers and timers are not executed.

The HJL and IJL PCD `.text` hashes match, but the native test process uses the HJL executable/runtime in both stock-configuration cases. This is not an independent live test of the IJL system or its surrounding libraries.

`native_trace.py` is the exact-instruction tracer adapted from the Cortina research, with optional PLT handling for binaries that instead use GOT-indirect calls. Selected-function and pointer snapshots were initially captured directly; the verification utility checks them against the private originals even though they have no separate generator command.

Source URI resolution and the device alias mapping remain private. No raw firmware ELF, saved configuration database, crash dump, live log or captured identity is republished here. Full subject continuation and original-versus-inferred distinctions are in [the knowledgebase](../../../knowledgebases/diagnostics-and-recovery.md).


The [native trace manifest](native-calls.json) preserves a record per firmware profile and binary. Identical HJL/IJL disassembly for seven binaries shares one trace file. The profile record retains its original binary hash, source and decoding range, including cases where the complete ELF files differ. The generator names the shared file after the first profile processed.
