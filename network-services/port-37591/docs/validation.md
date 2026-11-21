# Validation and evidence scope

## Original codec comparison

The [native fixtures](../tests/fixtures) come from the original two G6 libraries, not the Python encoder. The [native oracle](../research/README.md) exercises builders, getters and both frame send/receive directions under QEMU using AF_UNIX sockets. There are seven cases per build, covering all six kinds and optional request-payload termination.

Every fixture is compared against the Python record/frame encoder and decoder. All published fixture addresses and MACs are synthetic. Header padding outside the watermark/length fields is normalized before publication; the original receiver accepts the normalized frame.

## Python session tests

Tests use local socket pairs and ephemeral IPv4 loopback listeners only. They cover:

- TCP fragmentation at every split and one byte at a time, multiple frames in one read, length bounds and truncated EOF.
- Lossless payload bytes, independent sequence counters and correct non-JSON heartbeat formatting.
- JSON duplicates, nonfinite numbers, UTF-8 data, reserved envelope keys and helper byte-length limits.
- Direction checks before writes, login/report/action/reply exchange, broadcast to two peers, serialized concurrent sends, preserved partial input on timeout and bounded unacknowledged heartbeats.
- CLI offline behavior and validation before any explicit network command.

Run:

```sh
PYTHONPATH=src python -m unittest discover -s tests -v
```

## What has not been live-verified

The owner previously confirmed that `ai_controller` listens on TCP37591 on a G6 LAN address. The original 0.1.0 offline phase had not established a live Python-to-G6 session. The later 0.1.1 control-session test below supersedes that limitation only for its listed message paths. The tests do not prove unaffiliated-node acceptance, complete RF schema validity, successful scan changes, all timer/state transitions, or compatibility with other models/builds.

The protocol has no recovered credential exchange in the reviewed path. The package therefore has no password/key7_2/key18 option. It also does not add TLS, invent an inventory-query command, redirect agents or run received actions on the host.

## Source references

- [Original investigation and instruction traces](../../../writeups/mesh-messaging/README.md)
- [Controller dispatcher](../../../writeups/mesh-messaging/resources/controller-application.txt)
- [Agent dispatcher](../../../writeups/mesh-messaging/resources/agent-actions.txt)
- [Transport implementation](../../../writeups/mesh-messaging/resources/meshmsg-core.txt)
- [Detailed continuation record](../../../knowledgebases/mesh-messaging.md)

The application map is HJL static analysis. Both reference codec implementations produced the same bytes for the fixture inputs; their internal buffer capacities and addresses differ. Previous static-only investigation statements describe the earlier phase; this package's codec oracle is a separate later offline execution phase.

## Completed package checks (2026-10-28)

The original **29 tests** passed with Python 3.14 under WSL and against an isolated installed wheel on Windows. The Windows wheel built offline with `pip wheel --no-deps --no-build-isolation`, installed with `pip install --no-index --no-deps --target ...`, and passed both module and generated-console-launcher help checks. The local login/report/action example ran successfully using the installed wheel. The declared Python 3.10 minimum follows the language/API features used; a Python 3.10 interpreter was not available for a separate runtime check.

The fixture generator was run again from its published source against both hash-pinned stock libraries. Its seven vectors per build reproduced the previously generated record/payload/frame bytes exactly. Native send and receive functions processed AF_UNIX socket-pair frames with canonicalized zero padding. That offline fixture-generation phase used no native daemon, radio API, external TCP destination or actual router.

The final wheel SHA256 is recorded in [provenance.json](../research/provenance.json). Build products and isolated installations remain private rather than being committed alongside source. The source checkout is sufficient for a normal install.

## Live G6 control session

The owner explicitly authorized testing the selected router. Version 0.1.1 completed a **45.039-second** connection on TCP37591 using the default common profile and a fresh identity based on the actual socket endpoint. It sent one login, three heartbeats, three heartbeat acknowledgements and one logout. It received two request records, three heartbeats and three acknowledgements. Outgoing heartbeat sequences1/2/3 were acknowledged independently of transport sequence numbers. The native server reused heartbeat sequence1 in its three heartbeat payloads.

The two application requests were normal server-initiated action12/enable1 and action0 with the seven documented scan fields. No application report or action was sent, and received instructions were never applied. No WebUI/Linux credential was supplied. Logout was locally sent; no router-side logout acknowledgement or processing confirmation was established.

An initial live parse failure exposed a case the native synthetic fixtures did not cover: an empty record URL in an ordinary first server request. The first attempt's rejected bytes were not captured, so its exact rejected field remains unknown. A later diagnostic attempt captured the empty field and reproduced the strict-validator failure. Version0.1.1 allows/preserves empty raw record metadata while keeping connection/login identities strict. A regression test covers this distinction. The resulting **30 tests** pass on WSL Python3.14 and an isolated installed Windows wheel.

The private raw captures contain actual addresses, MACs, filter values and native unused header padding. Public [live-validation.json](../research/live-validation.json) contains aliased source/digest references, exact counts/timings and redacted field summaries. No physical G6 alias or live firmware build/hash was obtained, so the successful session is not assigned to a particular HJL/IJL image or G6-A/B/C/D. Application report ingestion, action13, radio changes and other firmware builds remain unverified.

For an explicitly authorized repeat, the bounded [live_smoke.py](../research/live_smoke.py) sends control records only and retains raw results in a new private directory:

```sh
python network-services/port-37591/research/live_smoke.py router.example --seconds 45 \
  --output config-private/mesh-live-check
```

Install the package first. The tool refuses to overwrite its output directory and limits duration to1..120seconds. It is active login/heartbeat participation, not a passive capture. Unit tests remain offline.
