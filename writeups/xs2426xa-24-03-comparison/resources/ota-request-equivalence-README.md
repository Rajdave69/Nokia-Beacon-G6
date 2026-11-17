# Verifying the ONT availability request

Current correction: the owner has now run v2 successfully. The stock getter
returns41 API-key bytes matching the queried default and a matching URL, with
OTA_enabled=false. This resolves effective credential equality; it does not
cryptographically decode the saved76-byte field. v1's silent exit127 was a
libdl-provider linkage bug. Use v2 instructions below; old v1 remains historical.

The completed workstation query was structurally similar to the native request,
but was not an exact reproduction. This review runs the original ONT payload
and header builders offline; it does not start the updater daemon or send a
new cloud request.

## What was measured

- The previous compact JSON body is 102 bytes. The original builder emits a
  120-byte formatted JSON body containing equal values in the same field order.
- With the saved profile deliberately injected, seven explicit application
  header values match: API key, operator, gateway version, serial, country,
  isopctl and content type. This is conditional on the input fixture: the key
  match is not independent evidence of the router's effective credential.
- The native content-length is 120, versus 102 in the old request. The native
  producer returns strlen+1, but its caller recalculates strlen. The captured
  native read callback sends 120 bytes and excludes the terminal NUL.
- Offline Windows urllib reconstruction adds Accept-Encoding: identity,
  User-Agent: Python-urllib/3.14 and Connection: close. This is a reconstruction,
  not a packet capture of the original request. The native harness captures
  explicit builder headers; it does not reproduce libcurl's automatic headers
  or TLS negotiation.
- Stock code sets local TCP port 47791 / range option16 and executes four
  reply-accept iptables commands before curl. The harness intercepts all four
  commands; none were executed. These differences do not establish a cause
  for the no-offer.

## Checking the actual API key without printing it

`check-ont-ota-request-v2.c` calls the same local configuration getter used by
`nal_getSwAutoUpgradeInfo`: object599, size0x8c5, flags0x1000. It compares the
returned key and URL with hash-only expected values and prints status, length
and booleans. It does not assume whether the getter returns plaintext or a
wrapped string. It neither initializes the security database nor starts OTA.

The source suppresses stock-library output and blocks exported Internet socket
and process entrypoints. Local AF_UNIX IPC is allowed for cfgmgr. This is a
read-only getter; its normal local socket/log state may still be created. The
helper has only GLIBC_2.17 requirements and is compiled for the AArch64 ONT.

Build on the workstation:

```text
aarch64-linux-gnu-gcc -O2 -Wall -Wextra -Wno-unused-parameter -Wno-misleading-indentation -nostartfiles -fno-stack-protector -U_FORTIFY_SOURCE -Wl,-e,_start -Wl,--export-dynamic -Wl,-z,now -Wl,--allow-shlib-undefined -o PRIVATE/check-ont-ota-request-v2 resources/check-ont-ota-request-v2.c -Wl,--no-as-needed PRIVATE/bank1-root/lib/libdl.so.2 -Wl,--as-needed
python3 resources/prepare-ont-ota-comparison.py --profile PRIVATE/xs-ota-profile.json --out PRIVATE/ont-ota-expected.bin
```

Copy the binary and 72-byte comparison file to `/tmp/` on the actual ONT:

```sh
chmod 700 /tmp/check-ont-ota-request-v2
LD_LIBRARY_PATH=/usr/lib:/lib /tmp/check-ont-ota-request-v2 /tmp/ont-ota-expected.bin
```

A successful getter plus `key_matches_requested_default: true` establishes
that the API-key bytes returned by this stock getter match the queried default
at that time. A getter error gives null match fields. False means they differ;
it does not by itself identify the alternate key. Neither outcome retrospectively
captures the router's volatile peer inventory or an old TLS session. The owner subsequently supplied a successful v2 result: status0, key_bytes41,
key/URL matchtrue, OTA_enabledfalse, exit0. See the dated live-result JSON.

## Execution scope and reproduction artifacts

`ota-native-json-probe.c` loads only stock libcjson and calls Parse /
PrintPreallocated(format=1). `ota-native-builder-probe.c` loads a private copy
of swmgnt with only DF_1_PIE cleared, determines its exact build base from
main0x41f0 and invokes payload0x8108 / builder0x4e40. Hardcoded offsets belong
to this exact bank1 executable, whose hash is in the JSON report. The daemon
main is never called. Private cache fixture data initializes the node/config
structures, empty OUID and factory VDQA fallback; mesh count is zero. Native
code can append extender entries in other runtime states.

Curl calls and system commands are intercepted; cfg_getObj and real sockets
abort in the builder harness. Its HTTP200 is a synthetic fixture. The initial
loader selected incompatible stock libc when the entire stock /lib was added;
a vendor-library-only compatibility directory corrected that. A later guarded
OID66 read identified the additional operator getter; an explicit operator-only
fixture then completed the native path. All failed logs remain private.

The original six synthetic cases ran with the newer cross-runtime and did not
catch v1 target-provider incompatibility. v2 has eight passing cases under the
exact ONT loader/libc/libdl: the previous six plus process blocking and the
15-second getter timeout. Synthetic results are distinct from the separately
recorded owner live result. See ota-request-comparator-v2-fix.json.

The raw twelve-partition scan found no x-api-key header or plaintext key7
assignment. A separate name scan found se.conf entries but no sedb.conf name.
These are bounded negative raw-byte scans, not complete journal or compressed
log recovery. Stock INI parsing independently returns the same 64-byte
packaged key7 as Python; this does not resolve the inner-field failure.

Complete source hashes, native traces, exact private artifact provenance,
comparisons, synthetic results, failed attempts and unresolved conditions are
in `ota-request-equivalence-20261028.json`. No new cloud request was made; the
completed availability count remains105 and firmware CDN count remains1.
