# Following HomeAgent and Fonendoscope through HomeOS

The Beacon G6 we checked had three HomeAgent configuration files in `/tmp`, yet no HomeAgent startup log, no Fonendoscope object on the default ubus socket, and no matching processes in the owner's check. That combination makes sense once you follow the two startup paths. A small board helper prepares configuration for other HomeOS services. A separate path starts the optional HomeAgent service groups.

## Where the configuration comes from

PCD runs `/usr/bin/ha_board` after `cfgmgr` completes its startup rule. The helper prepares the product and mobile-app configuration under `/tmp` and builds `nwf-board-param.json` from the board's identity, software versions, Ethernet interfaces and radio information. Its own log is `/tmp/ha_board_log.log`. The separate `nwf-ua-enabled` marker is created if both `ddm` and `raccess` exist in the G6 image. PCD uses that marker to start DDM, which has its own local device and mesh reporting duties.

Two other G6 PCD rules refer to `/usr/bin/homeagent` and `/usr/exe/ha_board.sh`. Neither path exists in the saved G6 images or on the checked unit. The real board helper is `/usr/bin/ha_board`, and the script that starts the service groups is `/usr/exe/HomeAgent.sh`.

## What starts the service groups

On the G6, `cfgmgr` reads the two server objects under `InternetGatewayDevice.X_ALU-COM_NWCC`. The boot code selects L1, L2, both, or neither, then hands off to `HomeAgent.sh` if a group is selected. Separate configuration callbacks can start, stop or restart a group when its settings change. The script itself first checks that the board JSON exists. The first byte of each server URL is the boot selector. A populated L1 URL selects L1, a populated L2 URL selects L2, and blank URLs skip both. All six stock schemas lack an `Enable` field on these two objects. The HJL router returned both URLs empty, which explains why the groups were idle when we checked. [Saved provisioning evidence](../../knowledgebases/provisioning-pipeline.md).

| Group | What the G6 script starts |
| --- | --- |
| Shared setup | Fonendoscope, then requests for `capin` and `meshintf` if absent. It also starts the local claim setup script. |
| L1 | `plasmodium` and supporting monitoring processes. The script requests Wi-Fi monitoring, Nemo, bandwidth tests and log handling, plus Ethernet and DHCP monitors on the EasyMesh Controller. |
| L2 | `apcloud`, backhaul activity detection and a CPU statistics helper. |

At boot, a defaulting helper can fill missing identity and credential fields. A subsequent configuration update checks the full group before starting it. L1 requires `URL`, `ClientID`, `UserName` and `Password`. L2 requires `URL`, `UserName` and `Password`. The script also requires the board JSON and parses the selected URL before handing the host and port to the clients. Starting a process and authenticating to its server are separate steps.

Two XS-2426X-A firmware banks contain operator rules that populate both URLs for BSGS and SHXX, and for BRZL when the selected mesh variant is `NokiaWiFiSeries_EasyMesh`. They explicitly clear both for BOQA, BATL and BRAZ. The effective settings on an individual unit depend on its selected profile and later provisioning. [Stock schemas, operator rules and live getter results](resources/provisioning-and-wire-evidence.json).

The Ethernet and DHCP decision checks `/configs/map_role` first and falls back to `WorkRole` only when the file is absent. That tests EasyMesh Controller status. The L1 script also requests `ustatusd`, but the saved HJL supervisor configuration has no such entry and the two checked executable paths are absent. Some script log lines say a child started immediately after sending the ubus request, so the live process or supervisor inventory is better evidence.

## What Fonendoscope actually supervises

Fonendoscope reads a list of named processes from `/etc/config/fonendoscope`. The script asks it to run as `appService` in the packaged G6 configuration. The daemon has a local ubus object with a process inventory, individual start/stop/restart operations and a separate group enable/disable operation. The stock ACL gives the local `appService` account access to these methods.

The process inventory can report PIDs and resource statistics, including retry count, memory, threads and CPU. On child exit, the traced callback attempts to respawn that child subject to its enabled state and retry budget. The shipped file also says `restart_policy all`, but that field has no matching literal in the binary and the traced configuration reader does not load it. The automatic exit path and an explicit group action are different paths. The comparison found no group-wide restart on ordinary child exit.

If a process has a report log configured, the exit path can include log text and process statistics in a local ubus `crash_report` notification. The shipped G6 process list has no per-child report log configured. There is also a separate `log_agent` with an HTTP upload path. Its presence does not establish that Fonendoscope crash reports automatically go to it or that this G6 uploaded anything.

## What the cloud clients send

L1 is an MQTT path. `plasmodium` uses Mosquitto and has a packaged list of local services for Wi-Fi, DHCP, mesh, WAN statistics, speed tests, and logs. The stock configuration selects MQTT v3. Plasmodium wraps each local service payload in a JSON envelope with `content`, `version`, `uptime`, `event_timestamp`, `session_id` and `fon_version`. Its separate device-status builder supplies `online`, `keepalive`, `timezone` and an optional `reason`. Individual services supply their own content. The binary also has an MQTT v5 publisher with compressed payload support and CBOR handling elsewhere in the v5 path.

L2 is the `apcloud` HTTP path. Its packaged configuration names separate paths for configuration retrieval, AP metrics and fault notifications. The HJL metrics builder sends JSON through libcurl's POST path for the configured endpoint. The stock metrics path is `/NGSCserver/apEntries/schemaLessApMetrics`. The report includes the AP MAC, report period, zone tag, geographic fields, radio and channel information and AP manufacturer. Conditional radio entries can include neighboring APs and stations. A station entry can contain its MAC and IP addresses, hostname, association time, link rates, throughput and packet and byte counts. The stock template selects HTTP notification mode with HTTPS and gzip. An alternate `bus` mode publishes the same report through a local ubus notification. Both L1 and L2 have development destinations in their stock UCI files. HomeAgent replaces host and port from the selected NWCC settings when it starts a group. A stock hostname is therefore insufficient to identify the destination of a provisioned unit. The file uploader streams a selected file with HTTP PUT when given an upload URL. The checked G6 had both cloud groups idle. The fields above come from the native serializers, with no live upload or provider receipt observed. [Native evidence](resources/provisioning-and-wire-evidence.json) · [EasyMesh and apcloud research](../easymesh-management/README.md).

## How the other builds compare

| Build | What ships |
| --- | --- |
| Beacon G6 IJL and HJL | Native `ha_board`, the same HomeAgent shell script, and byte-identical Fonendoscope binaries. Both keep the two unmatched PCD command paths. |
| XS-2426X-A K24, K67 and K50 | Same HomeAgent script as the G6. All three share a Fonendoscope binary whose decoded executable range matches the G6. |
| Beacon 9 JJM | A small `ha_board.sh` copies product and mobile-app JSON from ROM and touches the DDM marker. The selected stock root lacks the old HomeAgent script, Fonendoscope and Plasmodium. Its `cfgmgr` still contains a HomeAgent script reference. |

On the checked HJL G6, the owner confirmed that all three runtime JSON files existed, both unmatched PCD targets were absent and there was no startup log for the shell orchestrator. The process-name check printed no matches and the default bus returned no Fonendoscope object. This is one runtime snapshot. It shows that local board configuration can be present with the older cloud supervisor idle. [Six-build inventory](resources/stock-profile-inventory.json) · [Knowledgebase and native traces](../../knowledgebases/homeagent-and-fonendoscope.md).
