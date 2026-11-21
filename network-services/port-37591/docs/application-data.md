# Application data and direction

The transport and all six record kinds are byte-verified against the original IJL and HJL codecs. The application dispatcher analysis in this document is **HJL-specific**. The firmware contains additional hardware/model branches; matching transport bytes is not proof that every older/newer device implements the same action or RF schema.

## Envelope

A request or reply commonly contains a UTF-8 JSON object like this, followed by one NUL:

```json
{"type":"AI","sequence":1,"mac":"00:00:00:00:00:00","version":"1.0.0","ai-meshmsg-data":{"request_type":5}}
```

| Key | Type | Meaning established here |
| --- | --- | --- |
| `type` | string | Native application prefix uses `AI`. |
| `sequence` | integer | Native prefix uses 1. Independent of transport/heartbeat counters. |
| `mac` | MAC string | Outer application metadata, not a cryptographic credential. |
| `version` | string | Native prefix uses `1.0.0`. |
| `ai-meshmsg-data` | JSON object | Inner controller report or agent instruction. |

The native actor locates the inner key and removes its outer wrapper. `Envelope` uses a real JSON parser, checks duplicate keys/nonfinite values, and preserves extra outer and inner fields. Encoding supports `AI/1.0.0`; decoding preserves other string-valued type/version metadata for inspection without claiming firmware support. JSON nesting is bounded to 100 by the package. MAC validation preserves case rather than rewriting identities.

## Agent → controller reports

| `request_type` | HJL destination | What is established |
| ---: | --- | --- |
| 0, 7 | `add_sensing_tri` at 0x46258 | Node/radio sensing data enters the optimizer's database. |
| 6 | Handler at 0xdbdc | Scan-result report processing. |
| 10 | Handler at 0xdbdc plus state updates | Firmware names this `AIR_IQ_DATA`. |
| 5 | Branch at 0x5563c | Logs the supplied JSON. No explicit application reply was established. |
| 1–4, 8–9, other | Branch at 0x55670 | Unrecognized path in this dispatcher. |

`send_report()` checks a recognized report type and valid finite JSON. **It does not certify a complete RF report schema.** Use actual, device-appropriate complete data for types 0/6/7/10. It does not fabricate telemetry or fill missing fields with zero.

### Sensing fields actually traced

For types 0/7, the root parser checks presence of `ts`, `mac_addr`, `ip_addr`, `bh_type`, `is_ext`, `chipset`, `band_24`, `band_5_high`, and `buddies`. It also branches on `band_5_low` and `band_6`. `request_type` selects the outer report path. These presence checks are not complete validation of every value.

| Field/group | Observed use | What remains unresolved |
| --- | --- | --- |
| `ts` | Sample header and retransmission/sample ordering path | Exact unit/range and all timestamp branches |
| `mac_addr`, `ip_addr` | Identify the node and populate node records | All membership/IP/MAC binding checks |
| `bh_type` | Backhaul state | Complete enum/value interpretation |
| `is_ext` | Extender-related state | Every role/model branch |
| `chipset` | Chipset/capability state | Complete enum |
| `band_24`, `band_5_high`, optional `band_5_low`, `band_6` | Per-band radio/interface data | Complete nested schemas and capability-dependent requirements |
| `buddies` | Neighbor/buddy information | Complete nested entry schema |
| `vhtmode`, `available_channel`, `channels`, `ch_survey` | Further fields used in per-band/channel branches | Every nested path, unit and conditional |

Source: HJL controller 0x45290..0x46558 and the [retained field trace](../../../writeups/mesh-messaging/resources/controller-telemetry-fields.txt). The `ts` literal was resolved directly from ELF VA0x6c881. There is no guessed full sensing-report example in this package: an incomplete example could imply firmware validity that has not been established. Reports 6/10 are transmitted/received transparently; their full nested schemas are likewise not claimed complete.

A software client connected to the controller usually receives controller instructions, not the reports sent by every other agent. No read-all-nodes RPC or retained-history query was established on this endpoint.

## Controller → connected agent instructions

These instructions target the agent side of an established connection. `connect_controller()` creates the opposite side: it sends reports to the router's listener. Its typed `send_action()` therefore rejects that role.

### Action 0: scan configuration

The seven required data keys are:

| Key | Encoding accepted by the helper | Established behavior |
| --- | --- | --- |
| `neighbor_scan_24` | nonnegative signed-32-bit integer | Copied into 2.4 GHz neighbor-scan configuration |
| `channel_survey_24` | same | 2.4 GHz survey configuration |
| `neighbor_scan_5` | same | 5 GHz neighbor-scan configuration |
| `channel_survey_5` | same | 5 GHz survey configuration |
| `buddies_discover` | same | Buddy-discovery configuration |
| `channels` | string, at most 49 UTF-8 bytes, no NUL | Opaque firmware filter/configuration string |
| `ssids` | string, at most 499 UTF-8 bytes, no NUL | Opaque firmware filter/configuration string |

The helper also preserves optional `neighbor_scan_6` and `channel_survey_6` integer values. The common code's 6 GHz fields do not create 6 GHz hardware on the G6.

The numeric values are read as cJSON integer fields. This investigation does not assign an unsupported unit such as seconds or a full enum to each one. The channel/SSID string grammar and empty-string semantics are not fully established. Use values from the intended firmware/configuration, rather than assuming that every comma-separated list or an empty string means the same thing.

The 49/499 byte helper limits avoid truncation in the observed native 50/500 byte terminated buffers. They are package preflight policies grounded in the copy sizes, not a full firmware schema. `ScanConfiguration(...).to_data()` builds this inner object; `send_action()` validates it before transmission.

### Action 12: scan enable

```json
{"action_type":12,"enable":0}
```

`enable=1` enables the observed scan configuration flag; `enable=0` disables it. The handler resets associated information when its state changes. `scan_enabled(False/True)` constructs this object. This is not a demonstrated switch for physically powering radios off/on.

### Action 13: sensing-state flag

```json
{"action_type":13}
```

The handler sets a byte used later by the sensing/full-scan state machine. `arm_scan_state()` constructs it. Complete scheduling semantics, whether a scan is immediate, and every role condition remain unresolved; the API name deliberately avoids promising an immediate full rescan.

The controller contains an action-11/buddies-info string constructor, but action 11 is not accepted by the inspected agent dispatcher. There is consequently no action-11 helper. Low-level `Message`/`send_envelope` still allow preservation of records from other protocol variants without asserting what the peer will do.

## What receiving does

The Python package decodes and returns data. It does not execute shell strings, write router settings, invoke radio APIs, apply incoming scan instructions to the host, or automatically retransmit measurements. Unknown JSON fields remain data. `ControllerServer` can expose reports to your Python code and send explicit instructions, but contains no Nokia RRM decision algorithm.

The traced firmware login path registers a URL/address; it does not check WebUI or Linux credentials. That does not prove that every arbitrary report passes all later topology/role checks. Neither native codec tests nor Python loopback tests establish successful unaffiliated-node registration or an actual radio change.

## What was received from the live G6

The authorized 45-second control session received action 12 with `enable=1`, followed by action 0 containing all seven documented fields. The five numeric scan/survey/discovery values were 0. Both filter fields were nonempty two-byte strings; their exact contents remain in the private capture rather than being published as operational configuration. No inference about those strings' grammar, an immediate scan, or radio behavior follows from receiving them. The Python client did not execute either instruction or transmit an application report.

The first action-12 request had an empty record URL, a compatibility case added in 0.1.1. Later records carried the client-advertised identity. Login and ordinary instructions/heartbeats were exchanged without supplying WebUI/Linux credentials; acceptance of arbitrary sensing/scan reports, persistent mesh membership, action13 and radio changes were not tested. See [aliased live results](../research/live-validation.json).
