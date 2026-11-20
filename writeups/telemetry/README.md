# What the G6 collects, displays and may report

Does a Wi-Fi statistic visible on a router stay on the device, go to a local app, or leave for an operator's collector? All three are possible in the examined firmware, but they are different paths. A field's existence does not show that it was transmitted, and an empty URL for one service does not disable every reporting mechanism.

This article follows the saved Beacon G6 HomeOS 24.04 `HJL.L91p01` firmware and its 24.02 `IJL.J03p01` comparison. Findings are mainly static traces and saved configuration; no new upload, router connection or packet capture was performed for this investigation. An earlier live 24.04 G6 observation found the two HomeAgent server URLs empty. It did not measure the live Bulk Data configuration or all outbound traffic. [Research record](../../knowledgebases/telemetry.md).

## From a measurement to a recipient

A router first gathers or constructs information, then some other component may present or send it. In the examined 24.04 build, the main paths are:

| Component | Local role | Possible destination or consumer |
| --- | --- | --- |
| `dataelement` | Builds `Device.WiFi.DataElements` from local platform information | Local data model; another consumer must select and send a field. |
| DDM | Builds device, mesh and WAN events | Local consumers, including the authenticated LAN WebSocket; WAN events are also published on local ubus. |
| `bdemgr` | Builds reports from configured Bulk Data model references | HTTP POST to an enabled profile's configured URL. |
| `diagnosis` | Collects system, process and recovery information | Local logs and archives; uploads use separate request and transport paths. |

The [WebSocket investigation](../app-websocket-notifications/README.md) covers the LAN notification channel. The [HomeAgent investigation](../homeagent-and-fonendoscope/README.md) explains the separately provisioned cloud components.

## Local Wi-Fi and mesh information

The 24.04 `dataelement` path fetches EasyMesh information through the local platform API and exposes objects for radios, access points, BSSs, stations, backhaul, scans and connection events. Those names describe possible data-model inputs; they do not mean every object is populated or sent to the Internet. Shared schema names, including newer Wi-Fi capabilities, do not prove the G6 hardware supports every named feature.

DDM constructs device presence, association, signal, link-rate and topology events. One traced path passes events to the local WebSocket service, which can deliver notifications to an authenticated LAN client on TCP 8099. This is a local recipient, with its own reporting window, not proof of a cloud upload.

## WAN statistics and the optional HomeAgent path

The 24.04 DDM code builds a WAN report with the router's MAC, a timestamp, a 900-second duration field and timestamped transmit/receive byte counts. It publishes `wan.event` and, conditionally, `iptv.wan.event` on local ubus. The 900 seconds is a field in the report, not a measured transmission cadence.

The shipped HomeAgent L1 MQTT configuration subscribes to those events. That identifies a possible next consumer if L1 is running and provisioned; it is not a capture of a report sent to a broker. In the earlier live 24.04 observation, both HomeAgent server URLs were empty, putting those cloud groups in their idle branch. That observation does not settle the independent Bulk Data path.

## Bulk Data: a configurable report to an HTTP destination

Bulk Data is another reporting workflow. A profile selects data-model parameters, a destination URL and timing and retry options. In the examined 24.04 firmware, `cfgmgr` creates the `/tmp/bde_enabled` marker when its Bulk Data enable check succeeds; PCD uses that marker when starting `bdemgr`. A running daemon, an enabled profile and a usable destination are separate conditions.

The sender has paths for interface counters, SSIDs, hosts, latency, radio and backhaul statistics, neighboring AP scans and station information. This is a catalogue of supported inputs, not a list of what a particular router sends. The shipped TR-181 template defaults to disabled, an empty URL, no retries and no persistent report queue; operator provisioning can change those defaults. The sender supports JSON HTTP POST and optional gzip. The [Broadband Forum model](https://cwmp-data-models.broadband-forum.org/tr-181-2-15-1-cwmp-diffs.html) describes the standardized parameters.

## Local diagnostics and retention

Diagnostics collects information for troubleshooting and recovery rather than serving as a synonym for Bulk Data. The examined 24.04 paths include system and process information, memory and disk usage, logs and output from selected commands. Some commands, including `ritool dump`, can include device identifiers. The firmware can create archives and prune files under log pressure; local files can contain sensitive data even if no cloud reporting occurred. [Diagnostics and recovery](../diagnostics-and-recovery/README.md).

The 24.04 Bulk Data code can retain queued reports under `/opt/bdemgr`; other working or debug reports have paths under `/tmp` and `/logs`. A path in a binary does not prove a file was created or establish its lifetime on a particular unit. [G6 storage layout](../storage-and-flash/README.md).

## What would prove an external report?

First inspect the effective profile, destination and service state on the target build; do not infer them from a schema default. A passive capture on a provisioned test unit can establish destinations and timing, while endpoint-side evidence is needed to confirm the contents of encrypted traffic. The saved traces establish local event construction and possible sending paths, not that every path ran or delivered a report.
