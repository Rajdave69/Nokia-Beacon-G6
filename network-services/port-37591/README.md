# Beacon G6 mesh messaging on TCP 37591

`beacon-mesh37591` is a dependency-free Python package for encoding, decoding, transmitting and receiving the Beacon G6's `libmeshmsg` traffic. It includes an agent-side client, a small controller-side server, typed known scan actions, heartbeat handling and a command-line tool.

The original HJL and IJL libraries generated the checked-in test vectors under QEMU. All six record kinds match those native codec functions. Version **0.1.1** also completed a 45-second live G6 control session: login, two ordinary controller requests, bidirectional heartbeat/acknowledgement and a locally sent logout. No application report or scan action was sent; report ingestion and radio effects remain untested. See [live results](research/live-validation.json).

The wire protocol is documented completely for the recovered canonical record formats. Application documentation distinguishes verified HJL commands and report fields from unresolved nested RF schemas. This package preserves unknown JSON fields; it does not invent measurements or implement Nokia's channel-selection algorithm.

## Install

Requires Python 3.10 or later. From this directory:

```sh
python -m pip install -e .
mesh37591 --help
```

The installed package has no third-party runtime dependencies. A normal pip build uses setuptools. To run directly from the checkout without installation:

```sh
PYTHONPATH=src python -m beacon_mesh37591 --help
```

In PowerShell, the equivalent is `$env:PYTHONPATH = (Resolve-Path .\src)` followed by `python -m beacon_mesh37591 --help`.

## Understand the two sides

| Side                                                          | Sends                                                      | Receives                                            |
|---------------------------------------------------------------|------------------------------------------------------------|-----------------------------------------------------|
| Agent/client connecting to the router's `ai_controller:37591` | Login, reports, heartbeats/acks, logout                    | Controller scan instructions and transport messages |
| Controller/server accepting an agent                          | Scan instructions, heartbeats/acks, optional reply records | Agent login, reports and transport messages         |

Connecting as a client does not subscribe to every other node's telemetry. The recovered controller endpoint is principally an ingestion endpoint, not an inventory-query API. There is no implemented scan-all-nodes, firmware-upload, account-change or shell-command API.

`ControllerServer` is a protocol peer for a lab or your own application. It does not discover or redirect existing mesh agents, impersonate a running controller, apply radio settings locally, or reproduce the RRM optimizer. Existing agents will not automatically connect to it.

## Connect and receive

```python
from beacon_mesh37591 import connect_controller, ReceiveTimeout

with connect_controller("router.example", profile="common") as peer:
    while True:
        try:
            message = peer.receive(timeout=5)
        except ReceiveTimeout:
            continue
        print(message.kind, message.sequence, message.url, message.payload)
```

The explicit call opens IPv4 TCP and sends a login. The default advertised URL uses this connection's actual local IP and ephemeral source port. It does not reuse the router's own `:37592` identity. `receive()` services heartbeats and sends acknowledgements when enabled; there is no background thread. Continue receiving to maintain the session.

CLI equivalent:

```sh
mesh37591 watch router.example --count 10
```

`watch` is an active protocol participant, not a passive packet capture: it sends login and heartbeat traffic. It does not send fake sensing data or alter scan settings. There may be few application messages while the optimizer is idle.

## Transmit a report

```python
from beacon_mesh37591 import connect_controller

with connect_controller("router.example") as peer:
    sent = peer.send_report({"request_type": 5, "note": "application logging example"})
    print(sent.sequence)
```

Type 5 is the HJL controller's JSON debug-log branch. A completed TCP send is not confirmation that the firmware processed a report. Real type 0/7 sensing and type 6/10 scan reports need complete, device-appropriate data from a valid source. The library validates direction and JSON, but does not fill in or fully validate those RF schemas.

```sh
mesh37591 send-report router.example --json examples/debug-report.json
```

## Receive reports and send an agent instruction

```python
from beacon_mesh37591 import ControllerServer, Kind, scan_enabled

with ControllerServer("127.0.0.1", 37591) as server:
    with server.accept() as peer:
        login = peer.receive()
        if login.kind == Kind.LOGIN:
            peer.send_action(scan_enabled(False))
        while True:
            message = peer.receive()
            print(message.kind, message.payload)
```

The example action disables the connected agent's scan activity. It is intended for an agent explicitly connected to this server. It is not sent by connecting to the router's controller-side report port. A self-contained local demonstration is available at [examples/loopback.py](examples/loopback.py).

CLI server, with an optional explicit action file:

```sh
mesh37591 serve --bind 127.0.0.1 --port 37591
mesh37591 serve --bind 127.0.0.1 --port 37591 --action examples/scan-disabled.json
```

## Work offline

```sh
mesh37591 encode --kind heartbeat --url tcp://192.0.2.10:37592 \
  --sequence 47 --heartbeat-sequence 9 --interval 12000 --missed-count 4 \
  --output heartbeat.bin
mesh37591 decode heartbeat.bin
```

`decode` reads a concatenated/reassembled TCP byte stream, not Ethernet/IP packets or a pcap file. The lower-level `FrameDecoder` can consume arbitrary chunks; `Message` preserves raw payload bytes including any NUL.

## Documentation

- [Wire protocol: every field and all six message kinds](docs/wire-protocol.md)
- [Application data: directions, commands, reports and schema limits](docs/application-data.md)
- [Python API, CLI and session behavior](docs/api.md)
- [Native interoperability evidence and reproducible validation](docs/validation.md)
- [Firmware investigation](../../writeups/mesh-messaging/README.md)

## Compatibility and limits

| Profile | Canonical native send-record capacity |
| --- | ---: |
| `common` (default) | 65,536 bytes |
| `ijl` / IJL.J03p01 | 65,536 bytes |
| `hjl` / HJL.L91p01 | 131,072 bytes |

A record includes its sequence, kind, peer URL, delimiter and payload. The 36-byte TCP header is additional. These are native outgoing buffer capacities, not proof of a firmware receive-side rejection limit. The Python decoder independently enforces its selected bound before accepting a body.

Peer login is address registration in the traced firmware, not a password/certificate exchange. The package uses the existing plaintext protocol and does not add authentication the router cannot understand. An advertised URL is metadata; receiving it never causes the package to connect to that URL. Live server requests can contain an empty record-URL field, which version 0.1.1 preserves; connection/login identities remain nonempty. Reusing an existing real node's advertised identity can replace a vendor channel, so the default uses the actual new socket endpoint.

Examples and native fixtures use synthetic RFC 5737 addresses and dummy MACs. Real captures can contain node addresses, SSIDs and operational data; keep them in the parent project's `config-private` directory. No Nokia firmware libraries are bundled.

## Test

```sh
PYTHONPATH=src python -m unittest discover -s tests -v
```

All **30 tests** pass under WSL and against an installed Windows wheel. Tests cover both native fixture sets, bytewise fragmentation, coalescing, size limits, malformed local fixtures, JSON validation, role separation, timeout recovery, heartbeat acknowledgement/expiry, concurrent sends, and local client/server exchange. The unit tests do not contact a router. The separately authorized live control test is documented in [validation](docs/validation.md#live-g6-control-session).
