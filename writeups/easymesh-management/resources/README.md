# ECD research resources

These are host-side research evidence and a read-only router collector. They are not a general router-control package.

- `profile-comparison.json`: exact source URIs, byte counts/hashes, complete selected startup/config/ACL/package text and missing-file flags for G6 IJL/HJL and Beacon9 JJM.
- `*-routes.json`: all recovered static initializer registrations, exact callbacks, method enums, literals and code-reference provenance. `route-catalog.md` presents the same registrations. Utility routes constructed separately are discussed in the subject.
- `trace-index.json`, `.txt` disassemblies and `*-calls.json`: bounded native byte/instruction evidence. Calls/constant annotations are heuristic. A trace window is not automatically a complete function or call graph.
- `channel-dispatch-proof.json`: original bound callback slot and queue-versus-worker evidence. The [channel-path follow-up](channel-path/README.md) resolves opcode 5 through the queue to the channel worker and its result socket pair. Downstream RF behavior, persistence and live channel switching remain untested.
- `live-captures.json`: complete shell output with registered identity substitutions. The raw hexadecimal duplicate is omitted; private originals are retained without truncation. `topology-sample.json` retains the real schema using opaque identity labels.
- `retained-evidence.json`: exact complete private-original locations, lengths and digest aliases, including full ELF inventories, raw captures, scripts and intermediate/superseded results. Protected originals and ignored private mapping are required for local provenance verification.
- `inspect-ecd.sh`: reads state and calls only the two tested cached-read endpoints at loopback18090. Run from an existing authorized router shell; output contains device/network identifiers. A machine-readable shape does not make all values independently verified measurements.

Offline validation requires Python3, Capstone and the original saved profiles/private mapping. The shared publication-alias helper lives in the companion G6 project; the Beacon9 validator resolves that helper when it is absent locally. From the project root, using the configured WSL environment:

```sh
python3 writeups/easymesh-management/resources/validate-evidence.py
sh -n writeups/easymesh-management/resources/inspect-ecd.sh
```

Registration recovery can be reproduced against a saved HJL binary with `recover_routes.py --binary /path/to/saved/usr/bin/ecd --register-function 0x120a10 --out /tmp/ecd-routes.json`. IJL registration function is0x1191f0; B9 JJM0x1346f0. The callback tracker handles the specific initializer patterns in these three inputs; it is not a general decompiler or automatic safety classifier.

Complete raw capture preservation does not authorize rerunning arbitrary captured commands. No setter, scan, cloud call, service start or temporary control test was executed in this pass. No router files were transferred. The two confirmed GET paths are `/1/version` and `/1/topology`; several other registered GETs initiate actions.
