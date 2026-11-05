# Native-library interoperability oracle

`native_vectors.c` loads the supplied router's original `libmeshmsg.so` under QEMU. It calls only the message builders/getters and the framing functions, with synthetic addresses and payloads. TCP framing is exercised on an AF_UNIX socket pair. No mesh daemon is started and no router/Internet connection is made.

The harness exports guards for Internet socket creation/connect/bind/listen and process-launch functions. This is a narrow reviewed harness, not a claim of a universal QEMU sandbox. No untrusted protocol input or malformed router request is involved.

## Reference binaries

| Build | `libmeshmsg.so` SHA-256 | Record buffer |
| --- | --- | ---: |
| HJL.L91p01 | `71cd97fbbe8c89e2c8f3a957753ffb2ab5dd76ecb1de3bc5ccac450dc3e9c8ed` | 131072 |
| IJL.J03p01 | `7fea4fcba98358e62ac47123715901954d461f9afcca6b47631712f9dd8f21f4` | 65536 |

These are stock library fingerprints, not per-device credential fingerprints. The source files remain in the owner's private extracted roots. No firmware library is bundled in this package.

## Reproduce

Use supplied roots with their original loader/libc/libdl dependencies. The generator checks the exact image and library hashes because the harness's internal struct offsets are version-specific.

```sh
python3 research/generate_native_vectors.py \
  --hjl-root "$HJL_ROOT" --ijl-root "$IJL_ROOT" \
  --build-dir ../config-private/mesh-oracle-build \
  --output-dir ../config-private/mesh-oracle-fixtures
```

Host requirements: `aarch64-linux-gnu-gcc`, `qemu-aarch64` and the complete original runtimes. The generator refuses to overwrite fixtures. Normal Python package use requires none of these tools or firmware files.

The separate target `libdl.so.2` is linked explicitly with GLIBC_2.17 symbol versions and a compatible `_start`, avoiding the modern glibc merged-libdl issue. `--allow-shlib-undefined` allows target GLIBC_PRIVATE references to be resolved by the original guest loader at runtime. The code avoids modern `strtoul` redirects requiring GLIBC_2.38.

## What was checked

Each of the two libraries produced seven vectors: login, logout, request, reply, a request without a final NUL, heartbeat and heartbeat acknowledgement. Builders/getters establish sequence, kind, URL, payload and length. Native TCP send creates the header on a Unix socket pair. Bytes15–31 are zeroed, then the original receive function parses that canonical frame and its body is compared exactly. Published fixtures contain this canonical padding; arbitrary native stack padding is not published.

Heartbeat builders return no meaningful length: the harness obtains the produced C-string length including NUL. Request/reply builders return record lengths. The sequence and heartbeat fields lie after a 0x10000 buffer in IJL and 0x20000 in HJL. These corrected offsets are confined to this research harness; the Python protocol implementation never accesses native structs.

The Python tests decode native-produced frames and compare its encoded output byte-for-byte with them. They also test nonzero padding separately. These tests establish codec compatibility for these fixtures and builds. They do not establish a live mesh membership, successful report acceptance, radio changes or a working full RRM controller.

## Timer excerpts

The five bounded disassembly files in this directory preserve the HJL call chain and arithmetic behind the millisecond heartbeat unit; [the wire documentation](../docs/wire-protocol.md#timer-unit-evidence) explains the addresses. They are read-only host disassembly results, with private root paths replaced by `private-source://PROFILE-G6-HJL`. GNU nearest-symbol labels inside stripped libraries are not inferred true internal function names. These traces do not measure a running router's scheduler.

## Separate authorized live check

[live_smoke.py](live_smoke.py) is an explicit, bounded control-only router test. Unlike the native oracle above, it connects to the supplied IPv4 host and sends login/heartbeats/acks/logout, while receiving ordinary controller requests. It sends no application reports/actions and applies no incoming instruction. Output directories are private captures; native padding and operational identifiers must not be published. [live-validation.json](live-validation.json) records the completed session and the empty-record-URL compatibility correction in version0.1.1. The native oracle's synthetic fixtures remain unchanged.
