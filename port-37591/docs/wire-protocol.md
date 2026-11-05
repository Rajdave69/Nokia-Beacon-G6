# Wire protocol

This is the canonical format recovered from the supplied G6 IJL.J03p01 and HJL.L91p01 `libmeshmsg.so` files. The fixtures in [tests/fixtures](../tests/fixtures) were built and parsed by the original libraries. The current package uses standard IPv4 TCP; the URL inside a record is a peer identity, not an instruction to open another connection.

## TCP framing

All offsets are bytes. A TCP segment is not a record boundary. Buffer incomplete headers/bodies and split coalesced frames using the length.

| Offset | Length | Meaning |
| --- | ---: | --- |
| 0 | 14 | ASCII `TCP_WATER_MARK` |
| 14 | 1 | NUL terminating that C string |
| 15 | 17 | Unused watermark-field padding; native output may contain nonzero bytes |
| 32 | 4 | Unsigned big-endian length of the following complete record |
| 36 | declared length | Record bytes |

The Python encoder zeros bytes 15–31. The decoder accepts other padding while requiring the terminated marker. The native oracle verified that zero padding is accepted by the original receiver. Native uninitialized padding is not copied into published fixtures.

The decoder rejects zero/oversized lengths and incomplete EOF. The default bound is 65,536 record bytes, the common IJL/HJL sender capacity. `profile="hjl"` selects 131,072. These implementation bounds are not a negotiated protocol version or a live-firmware detection mechanism.

## Record grammar

```text
<signed decimal transport sequence> LF
nokia_memsmsg_<kind> LF
<peer URL>
 LF nokia_memsmsg_payload LF
<exact payload bytes>
```

The apparent extra line in the display represents the delimiter beginning with LF. Written as concatenation:

```python
record = (
    str(sequence).encode("ascii") + b"\n"
    + b"nokia_memsmsg_" + kind.encode("ascii") + b"\n"
    + url.encode("ascii")
    + b"\nnokia_memsmsg_payload\n"
    + payload
)
```

There is exactly one newline after the URL field, with no additional separator line. An empty URL field therefore appears as an empty line; this was observed in a live server request. The spelling is **memsmsg**, as in the binary; substituting `meshmsg` fails compatibility.

The emitted transport sequence is a signed 32-bit decimal integer. It is independent of the application envelope's `sequence` and the heartbeat payload's `sequence`. The native packer advances its channel counter after each packed record. The Python session uses its own nonnegative counter and wraps to zero at its maximum; raw `Message` represents any signed-32-bit value.

Nonempty firmware URL identities use `tcp://<IPv4>:<port>`. The channel reserves 65 bytes for the terminated identity. The package accepts at most 64 printable ASCII URL bytes without whitespace/NUL. **An ordinary live controller request can have an empty record URL.** Raw `Message` decoding/encoding preserves that empty metadata; connection/local identities and login payloads still require a nonempty URL. Later received records in the verified session used the advertised client identity, so this field is not a trustworthy authenticated sender address. Client connection targets are supplied separately to `connect_controller()` and resolved as IPv4. The package never follows a peer-provided URL.

## Six kinds

| Native type | Kind / marker suffix | Payload |
| ---: | --- | --- |
| 0 | `login` | Peer's advertised URL plus NUL |
| 1 | `logout` | Peer's advertised URL plus NUL |
| 2 | `request` | Typically an AI JSON envelope plus NUL; raw bytes are supported by the low-level codec |
| 3 | `reply` | Typically an AI JSON envelope plus NUL; raw bytes are supported by the low-level codec |
| 4 | `heartbeat` | Firmware heartbeat text below, plus NUL |
| 5 | `heartbeatack` | Firmware acknowledgement text below, plus NUL |

The native library's type value 6 means unrecognized; it is not a seventh valid record kind. The decoder rejects unsupported markers. Native parsers use permissive C-string searches; the Python codec deliberately validates canonical record lines.

Login repeats the advertised URL in both the record header and payload. In the traced vendor server it registers channel identity and can replace an earlier channel with that identity. There is no recovered login acknowledgement message, password exchange, TLS negotiation or version negotiation. A successful `connect_controller()` confirms the TCP connection and local login send, not remote application acceptance.

## Payload lengths and NUL

The 32-bit length counts every record byte, including any final payload NUL. It does not include the 36-byte TCP header. Login/logout/heartbeat native builders include NUL. The request/reply builder accepts an explicit payload length; the oracle includes vectors both with and without the final NUL.

`Message.payload` and `Message.to_record()` preserve bytes exactly. `Envelope.to_payload()` adds one NUL by default because the firmware's application code uses C-string routines. An embedded NUL is invalid in an encoded JSON envelope. Raw record bytes can still be examined losslessly.

## Heartbeats are not JSON

A native example is:

```text
{sequence:9}, {interval:12000},{count:4}\0
```

An acknowledgement is:

```text
{sequence:9}\0
```

In these examples `\0` represents one zero byte. Field names are unquoted; the spaces and commas shown match the native formatter. `Heartbeat` and `parse_heartbeat_ack()` handle this format. Do not pass it to `json.loads()`.

The `interval` is in milliseconds: the timer library uses a monotonic seconds/millisecond representation, and mesh heartbeat setup passes its interval into that timer API. HJL setup supplies controller 12000 and agent 14000, with count 4. These are code-derived setup values. In the live session the server payload consistently advertised 12000/count4; heartbeat arrival times were approximately 12.087, 26.092 and 40.098 seconds after connection. Traffic-dependent timer rescheduling means this is not a fixed 12-second arrival guarantee. The Python API expresses scheduling intervals in seconds and writes their millisecond equivalent into heartbeat payloads.

An acknowledgement echoes the heartbeat payload sequence. It does not echo the TCP record sequence as a substitute. The Python peer schedules heartbeats while `receive()` is serviced, replies to received heartbeats when enabled, and closes after its configured outstanding-heartbeat limit. That scheduling/expiry policy is package behavior; it is not a full simulation of every vendor timer branch.

## Request/reply semantics

The codec supports both kinds without guessing transaction semantics. `send_message()` returns the locally emitted transport sequence; `receive()` exposes received sequences. `send_envelope(..., kind=Kind.REPLY, sequence=...)` permits explicit replies for a protocol application. No automatic RPC correlation or success acknowledgement is invented.

In particular, the inspected controller report actor normally produces no application reply. Waiting for a reply after every report is not a reliable acceptance test. Heartbeats only confirm a responsive protocol peer, not successful processing of measurements.

## Evidence anchors

HJL: common packer 0x6d28; payload parser 0x7220; kind parser 0x7510; request/reply builders 0x7708/0x7780; login/logout 0x77f8/0x7870; sequence/URL parsers 0x78e8/0x7990; heartbeat/ack builders 0x7bd8/0x7cb8; TCP receive/send 0xf410/0xf960. Internal channel counters are after an outgoing record buffer of 0x20000 in HJL and 0x10000 in IJL. Those offsets are used only by the offline oracle, never by the Python runtime package.

The [native source and reproduction procedure](../research/README.md) describe the ABI and source fingerprints. No firmware libraries are redistributed here.

## Timer-unit evidence

The interval is in milliseconds by code analysis. HJL `libmeshmsg.enable_heartbeat` loads the stored interval and passes it unchanged as argument 0 to `csrv_start_periodic_timer` at 0x593c. The timer library forwards it through 0x194c → 0x130c → 0x114c. Its clock helper calls `clock_gettime` and converts nanoseconds to milliseconds; addition then carries every 1000 milliseconds into the seconds field. See the complete bounded [heartbeat setup](../research/libmeshmsg.so-58b0-59dc.txt), [periodic-timer entry](../research/libcsrv_timer.so-1a54-1bfc.txt), [allocation/interval forwarding](../research/libcsrv_timer.so-194c-1a54.txt), [time initialization](../research/libcsrv_timer.so-130c-13dc.txt), and [clock/addition arithmetic](../research/libcsrv_timer.so-1090-1228.txt). This code analysis resolved the original unit uncertainty; the later [live control capture](../research/live-validation.json) adds packet-arrival observations without claiming to cover every timer/state transition.
