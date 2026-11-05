# Python API and command-line behavior

Importing `beacon_mesh37591` performs no network operations. The runtime is Python 3.10+ and uses only the standard library.

## Codecs

```python
from beacon_mesh37591 import Message, Kind, FrameDecoder, Envelope

payload = Envelope({"request_type": 5, "note": "offline example"}).to_payload()
message = Message(44, Kind.REQUEST, "tcp://192.0.2.10:37592", payload)
wire = message.to_frame()

decoder = FrameDecoder()
for record in decoder.feed(wire):
    decoded = Message.from_record(record)
    print(decoded.sequence, decoded.application().data)
decoder.finish()
```

- `Message(sequence, kind, url, payload)`: immutable record with exact `bytes` payload. Empty record URL metadata is preserved, as observed in a normal live server request; `connect_controller` and login identities still require nonempty `tcp://` URLs. `kind` is a `Kind` enum value. `to_record()` and `to_frame()` enforce `max_record_size`, default 65536. `from_record()` decodes one complete unframed record.
- `encode_frame(record, max_record_size=...)`: add the 36-byte TCP header to exact record bytes.
- `FrameDecoder(max_record_size=...)`: `feed(chunk)` returns zero or more complete record byte strings. It accepts arbitrary TCP fragmentation/coalescing. `finish()` detects incomplete EOF; `pending` reports buffered data; `reset()` discards buffered input explicitly.
- `Envelope(data, mac=..., sequence=1, version="1.0.0", type="AI", extra={})`: JSON application wrapper. `to_payload(nul_terminated=True)` serializes compact UTF-8. `from_payload()` decodes with optional single trailing NUL. Unknown object fields are preserved semantically, not byte-for-byte JSON whitespace. `Message.payload` is the lossless byte representation.
- `Heartbeat(sequence, interval, count)`, `heartbeat_ack(sequence)`, `parse_heartbeat_ack(payload)`: native non-JSON control payloads. The heartbeat sequence is a separate counter.
- `record_limit("common"|"ijl"|"hjl")`: 65536, 65536, 131072 respectively.

## Explicit client

```python
peer = connect_controller(
    "router.example", 37591,
    timeout=5.0, profile="common",
    auto_heartbeat=True, heartbeat_interval=14.0, heartbeat_count=4,
)
```

This resolves the supplied host as IPv4, opens TCP, constructs a unique identity from the actual local socket endpoint and sends login. Optional `local_address=(ip, port)` selects the local bind; `advertised_url=` overrides the identity explicitly. Do not reuse a real existing peer identity unintentionally: the vendor server can replace a duplicate identity's channel. The package never follows a URL received from a peer.

A TCP/login send is not an application authentication or success acknowledgement. There is no recovered login-ack message. `peer.role` is `Role.AGENT`.

## Connected peer methods

| Method | Behavior |
| --- | --- |
| `receive(timeout=...)` | Returns the next `Message`, including control records. Partial frames survive receive timeouts. |
| `send_report(data, mac=...)` | Agent side only; wraps a recognized `request_type` object and sends a request. It does not supply or fully validate RF data. |
| `send_action(data, mac=...)` | Controller side only; validates known actions 0/12/13 and sends a request to this connected agent. |
| `send_envelope(envelope, kind=Kind.REQUEST, sequence=None)` | Low-level request/reply send. Explicit `Kind.REPLY` is supported; no automatic RPC matching is guessed. |
| `send_message(kind, payload, sequence=None)` | Low-level exact byte payload send for any of the six record kinds. NUL handling is the caller's responsibility here. |
| `login()` | Send own advertised URL in the native login format. |
| `logout()` | Send own advertised URL as logout, then close. |
| `close()` / context manager | Close the socket; does not implicitly send logout. |
| `fileno()` | Underlying socket descriptor for integration. |

Send methods return the locally emitted `Message`. This confirms local completion of a TCP send, not firmware-side validation, an executed action, or a radio change.

Use one reader per connection. Send operations are serialized so concurrent writers do not interleave frames. Heartbeats are serviced by `receive()`, not a hidden background thread: continue polling after `ReceiveTimeout`. Automatic control writes use the configured send timeout; the receive timeout bounds waiting for input, not a stalled automatic send. A send error closes the connection because partial delivery is ambiguous.

When auto-heartbeats are enabled, incoming heartbeats are acknowledged and periodic outgoing heartbeats are scheduled. The API interval is seconds and the wire field is milliseconds. The package's missed-heartbeat window bounds session lifetime if acknowledgements stop. It is a package policy, not a full emulation of vendor scheduler internals. `auto_heartbeat=False` disables automatic heartbeat/ack writes for explicit low-level analysis.

## Controller-side server

```python
with ControllerServer("127.0.0.1", 0, auto_heartbeat=False) as server:
    print(server.address)  # OS-selected loopback port
    peer = server.accept()
```

Constructing the server explicitly binds/listens. Port 0 requests an ephemeral test port. The default address is loopback; there is no automatic interface discovery or firewall change. `accept()` returns a controller-side `MeshConnection`. The caller receives a login before expecting registered-agent messages. The package treats the received login as metadata; it does not authenticate a mesh membership or evict other connections with the same identity.

`broadcast_action(data, mac=...)` sends one validated action to each connected peer. It returns `(peer, Message-or-exception)` pairs so individual failures are visible. It is per-connection broadcast, not Ethernet/IP broadcast or mesh discovery. Server close closes its accepted connections. The caller services each peer's receive loop; no multi-peer worker threads are started automatically.

## Typed known instructions

```python
from beacon_mesh37591 import ScanConfiguration, scan_enabled, arm_scan_state

# Filter strings are opaque values from the intended firmware/configuration.
config = ScanConfiguration(
    neighbor_scan_24=0, channel_survey_24=0,
    neighbor_scan_5=0, channel_survey_5=0,
    buddies_discover=0, channels="", ssids="",
)
data = config.to_data()       # action 0; construction does not transmit
scan_enabled(False)          # action 12, enable=0
arm_scan_state()             # action 13; timing semantics remain partially traced
```

The example shows construction only; it does not assert what empty filters mean in the firmware. `send_action()` requires the controller side. Sending these to the router's report listener is not a supported shortcut to changing the agent's scan settings.

## CLI

Run `mesh37591 --help` or `python -m beacon_mesh37591 --help`.

| Command | Network behavior |
| --- | --- |
| `decode INPUT` | Offline; input is a framed/reassembled TCP byte stream, not pcap. `-` reads stdin. |
| `encode ... --output FILE` | Offline; writes one binary frame. `--output -` writes raw stdout. |
| `watch HOST` | Connect, send login, receive and service heartbeats. `--count 0` runs until closure/Ctrl-C. |
| `send-report HOST --json FILE` | Validate supplied report shape/type, connect, send login and one report, then close. No acceptance is asserted. |
| `serve --bind ADDRESS` | Accept one agent and print incoming messages. Optional `--action FILE` sends once after login. |

`encode` accepts raw exact `--payload-file`, or inner `--application-file` with `--direction report|action`. Login/logout and heartbeat payloads can be built from their explicit flags. `--sequence` selects the transport sequence; `--heartbeat-sequence` selects the independent heartbeat sequence.

Decode output is JSON-lines with kind, native type, sequence, URL, exact payload hex and interpreted application/heartbeat data where available. Packet fields may contain operational identifiers; output is not automatically anonymized. The checked-in fixtures use synthetic data.

Exit codes: 0 for completed command/ordinary peer closure; 2 for invalid input or I/O/protocol failure; 130 for Ctrl-C. No passive packet sniffer, UDP37590 control client, router-role switch, auto-discovery, TLS layer or external service is started.

## Exceptions

- `ProtocolError` / `FrameError`: invalid/unsupported records, watermark, size or truncated framing.
- `ApplicationError`: invalid JSON envelope, typed instruction or heartbeat payload.
- `ReceiveTimeout`: retryable wait timeout; partial bytes remain buffered.
- `ConnectionClosed`: peer/local socket closed or receive failed.
- `HeartbeatTimeout`: outstanding heartbeat window expired; connection is closed.

Known firmware schemas are not a claim of safe acceptance of arbitrary objects. A dedicated malformed-packet or security test against real routers is outside this package's validation.
