# Cortina hardware-control research resources

These tools run on the workstation and do not connect to the router. Firmware/runtime dependencies and raw captures remain private. Source references use the existing device/profile alias system.

## Reading the records

| Record | Contents |
| --- | --- |
| `artifact-catalog.json` | Package ownership/dependencies, selected sizes/hashes, ELF functions/objects/paths, native signatures, script references and SCFG fields. |
| `effective-board-config.json` | Default/override precedence and full interface/port/init-tuple mapping. |
| `native-command-table.json` | 6,655 SDK-prefixed Tcl registration tuples and code addresses; excludes ordinary Tcl builtins. |
| `aal-cli-catalog.json` | 7,133 user grammar/help descriptors and 7,130 kernel dispatch descriptors; node-relative syntax, exact callbacks and explicit size exceptions. |
| `wca-catalog.json` | All inspected `gw` procedures; 563 WCA helpers; parameters, defaults, native calls, enums and status names. |
| `module-callgraph.json` | Complete retained CALL26/JUMP26 relocation edges and selected data references. Local direct branches, function pointers and unnamed/static functions limit interpretation as an execution graph. |
| `dispatch-and-traces.json` | Both SDK callback tables, the initial selected traces and explicitly missing guessed names. `trace-manifest.json` indexes all final traces. |
| `cross-build-comparison.json` | IJL/HJL identities, symbol additions, complete changed text diff and operation-number shift. |
| `sdk-consumers.json` | Direct consumers among 678 top-level ELFs; indirect/dynamic/static callers remain possible. |
| `structure-accessors.json` | Exact leaf loads proving VLAN, admission, shaper and policer offsets. |
| `getter-abi.md`, `sdk-fixture-results*.json` | Original getter/transport behavior under mocks: complete messages, sizes, statuses, hashes and diagnostics. |
| `board-resources.json` | Original FIT DTB: 269 full nodes/property bytes, resources and analysis-copy comparison. Raw `hex` is authoritative; string/cell views are conveniences. |
| `raw-image-checks.json` | Two empty offload files and missing SRv6 payload, confirmed against a raw-bank-derived SquashFS. |
| `archived-hardware-evidence.json` | Five earlier archives and member identities, including failed/empty diagnostics. Not a new live observation. |
| `supporting-sources.json` | Startup script text and pinned kernel-configuration facts. |
| `traces/`, `trace-manifest.json` | Exact instructions, section/VA ranges, source hashes and independent byte verification. Module offsets are section-relative. |
| `verification-results.json` | Final consistency/ABI checks, counts and scope. |

Full original small text sources are retained in the local knowledgebase's `cortina-hardware-controls-source-text.json`. The source collector retains complete subject context and related records. No firmware binaries are redistributed here.

## Reproducing

Set `ROM` to an extracted HJL tree, `OLD_ROM` to the retained IJL extraction, `FIT` to the original FIT and `OUT` to a scratch output directory. The ignored private mapping resolves `private-source://PROFILE-G6-HJL`, `PROFILE-G6-IJL` and `SOURCE-066/mtd12_fit.bin`. Do not substitute the modified analysis DTB for the original FIT.

Linux scripts require Python with pyelftools and Capstone. SDK tests additionally need `aarch64-linux-gnu-gcc`, `qemu-aarch64` and the original loader/libc/libdl. The Tcl schema tool uses tkinter's Tcl interpreter without creating a GUI. The recorded host uses Tcl9.0.4, while firmware uses Tcl8.6. Safe-interpreter extraction registers definitions only: no WCA procedure or native SDK runs.

```sh
python3 collect_cortina.py --rom "$ROM" --out "$OUT"
python3 catalog_aal_cli.py --rom "$ROM" --out "$OUT/aal-cli-catalog.json"
python3 native_commands.py "$ROM/usr/bin/ca-iros" --out "$OUT/native-command-table.json"
python3 board_resources.py --fit "$FIT" --source 'private-source://SOURCE-066/mtd12_fit.bin' --out "$OUT/board-resources.json"
python3 trace_cortina.py "$ROM/lib/modules/4.14.275/ca-ne.ko" --function ca_l2_vlan_port_control_get
python3 trace_cortina.py "$ROM/lib/modules/4.14.275/ca-sdk-cb.ko" --table g_sdk_handler_table
python3 run_sdk_fixture.py --rom "$ROM" --out "$OUT/sdk-fixture-results.json"
python3 run_sdk_fixture.py --rom "$ROM" --sdk "$OLD_ROM/usr/lib/libca-sdk.so" --out "$OUT/sdk-fixture-results-ijl.json"
```

With a host Python providing tkinter:

```sh
python catalog_wca.py --rom "$ROM" --out "$OUT/wca-catalog.json"
```

`linked_trace.py` handles linked AArch64 ELFs; use start/stop addresses from registration/function catalogues. `trace_cortina.py` handles relocatable modules and named sections. Exact bytes are evidence; constant/string annotations are heuristic. A relocation's base string followed by a register addition may resolve to a different string than the base annotation.

Verify the existing result set without executing firmware functions:

```sh
python3 verify_cortina.py --rom "$ROM"
```

This checks hashes, every trace's bytes, message layouts/opcodes, callback names, the complete build shift, both status sets, native name uniqueness and original DTB identity. It refreshes the full trace manifest and verification result; it does not regenerate every research catalogue.

## The original-wrapper fixture

`capture_sdk.c` calls 36 getters with synthetic inputs and canary output buffers. The original `ca_sdk_ioctl` reference is interposed: it records the request, supplies marker bytes and returns 0,14 or15. The wrappers decide whether/how much to copy. No callback module, kernel API or hardware function runs.

The original transport is tested separately with mocked `open`, `ioctl`, `close`: `/dev/ca-sdk-dev`, flags2, ioctl0, descriptor closed, null/oversized requests rejected before another open. These operations are all intercepted; this is not a router device-reading helper.

The extra getter `ca_info_get` verifies the shifted range, HJL570/IJL569. Initial checks covered 35 getters before this case was added. An initial cross-link used the current host's merged libc for `dlopen`, causing target-loader status127. Linking target `libdl.so.2` with `--allow-shlib-undefined` corrected the dependency. No firmware patch was involved.

## Scope

A symbol, registration or reference-design example is not a physical feature probe. Some getters clear counters, consume events, trigger diagnostics or return cached state. Setters include link, register, reset, PE and OTP operations; no automatic command enumeration against hardware is appropriate.

Public records retain shared stock hashes/code addresses, not serials, device MACs or factory keys. Earlier archives remain private and are referenced by generic filenames and hashes. No new router connection, hardware setter, flash/OTP write or persistence test occurred.
