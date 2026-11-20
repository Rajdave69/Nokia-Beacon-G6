# Following the Beacon's wireless tools to the radio state

The G6 ships several different wireless interfaces: Linux `iw`, hostapd control sockets, Nokia's USSA abstraction and Qualcomm's vendor tools. Their outputs describe different layers of state. Using them together is more useful than assuming any one utility is the router's authoritative configuration interface.

We closed two practical gaps in the [ubus investigation](../internal-ubus-management/README.md) before this pass: the USSA channel blob's main layout and the Nokia JSON request envelope. The remaining per-method semantics and live write behavior are recorded as open work. Wireless testing here used read-only queries on the owner's HJL.L91p01 G6. No channel change, scan, WPS operation, reset, service restart or router file transfer was performed.

## What the live router reports

| Source | 2.4 GHz | 5 GHz |
| --- | --- | --- |
| `iw dev` | `phy#1`, `wifi1`, `ath1` and additional VAPs; channel11,2462MHz,20MHz width. | `phy#0`, `wifi0`, `ath0` and additional VAPs; channel108,5540MHz,160MHz width,center5570MHz. |
| hostapd `STATUS` | `ath1` reports `ENABLED`,channel11,frequency2462. | `ath0` reports `ENABLED`,channel108,frequency5540. |

The interface numbers are worth noticing: on this unit, `wifi0` is the5GHz radio and `wifi1` is2.4GHz. Do not infer the band from an interface suffix. Several VAPs share each physical radio's channel.

The following commands worked inside the existing router shell:

```sh
iw dev
iw reg get
hostapd_cli -p /var/run/hostapd-wifi0 -i ath0 status
hostapd_cli -p /var/run/hostapd-wifi1 -i ath1 status
```

The control directories were discovered first. They contain root-controlled Unix sockets, including the AP interface names. These are local APIs; no network listener was enabled. The normalized [captures](resources/live-captures.json) preserve the complete output with MAC/SSID aliases. Configuration/credential files were listed by name but their contents were not read.

These observations corroborate the earlier ACI cache's channel108/160MHz context, while adding direct driver-facing and AP-daemon readings. They do not constitute an over-the-air measurement. The ACI cache's empty2.4GHz score table did not mean that no2.4GHz AP existed: hostapd reports that AP enabled here.

## The reported layers disagree in places

`iw` reports160MHz for the5GHz interfaces, while hostapd exposes `vht_oper_chwidth=1` and centre-segment index106. Their width fields should be retained separately until the runtime/configuration synchronization is traced.

Power values also differ: the driver-facing listing reports50.00dBm for the2.4GHz VAPs and26.00dBm for5GHz; hostapd reports `max_txpower=20` on both. These are reported fields, not calibrated transmit-power measurements or verified EIRP.

The global regulatory query reports `country 00: DFS-UNSET`, with individual frequency ranges carrying flags includingDFS. That global view is not a complete account of the vendor driver's regulatory decisions. We did not change country, power, DFS or channel settings.

## Which tool does what

| Tool | Role found in the shipped files | Live scope here |
| --- | --- | --- |
| `iw` | Linux nl80211 interface, channel, PHY and regulatory queries/control. | Interface and regulatory reads. |
| `hostapd_cli` | AP-daemon status, station/control operations and channel-switch command support. | Two explicit `status` requests only. |
| `wpa_cli` | Supplicant control; a separate global control socket is present. | No supplicant command. |
| `ussa_cli` | Nokia radio/client data and controls over ubus. | Getters were planned but skipped because the router lacks the `timeout` utility used by the bounded collector. |
| `cfg80211tool` / `.1` | Shell wrapper and compiled Qualcomm vendor-command executor driven by XML definitions. | Selected XML filenames read from sysfs; no vendor command invoked. |
| `acfg_tool` | Qualcomm configuration API tools, including channel/power/interface/ACL operations. | Static inventory only. |
| `wlanconfig` | VAP creation/destruction, station/repeater and WDS operations. | Static inventory only. |
| `iwconfig`, `iwpriv`, `iwlist` | Legacy Wireless Extensions tools. The three saved files have identical bytes; invocation name still matters. | Not invoked. |
| `wifitool` | Vendor diagnostics and management operations. | Not invoked. |
| `athstats`, `80211stats` | Driver/802.11 statistics tools with their own options. | Not invoked; no counter reset. |
| `spectraltool`, `radartool` | Spectral/DFS diagnostics and control. | No capture, scan or test mode started. |
| `wlancli` | Nokia WPS state machine, PIN/PBC operations and daemon/LED bookkeeping. | Not invoked. |

`wlancli` is particularly easy to misidentify. Its saved code launches hostapd WPS commands, manages temporary WPS markers and can start a daemon. It is not a general channel-status CLI. We did not run it simply to see its default behavior.

Command names also need interpretation. `iwlist scan`, spectral capture and vendor scan commands can request radio work. A tool named “stats” may have options that clear counters. The present record does not classify every option as read-only.

## Qualcomm commands are described in XML

The wrapper reads `/sys/class/net/<interface>/cfg80211_xmlfile` and selects the corresponding file under `/lib/wifi`. The live VAPs selected `qcacommands_vap.xml`; radio interfaces selected their radio definition. A mesh-specific invocation uses `qcacommands_mesh.xml`.

| Saved profile | Mesh entries | Radio entries | VAP entries | Total |
| --- | ---: | ---: | ---: | ---: |
| G6 IJL.J03 |38|78|117|233|
| G6 HJL.L91 |38|78|117|233|
| Beacon9 JJM.K44 |50|110|116|276|

The [complete source and command catalogue](resources/profile-comparison.json) retains names, vendor IDs, request attributes, defaults and response fields, together with the original XML text. [Name differences](resources/xml-name-differences.json) are also retained. Matching command names do not establish identical formats or effects; inclusion in XML does not prove live driver support.

The HJL wrapper has two concrete limitations. If it cannot select XML, its conditional branches can execute nothing and still finish without a useful failure status. Its ten-argument branch also uses `$10`, which shell expansion interprets as `$1` followed by `0`; `${10}` is required for the tenth argument. These are static findings in the shipped wrapper. We did not exercise that branch or patch the router.

## How USSA hands off a channel request

The ubus setter's `data` argument is eight raw bytes:

| Offset | Meaning |
| --- | --- |
|0|One-byte channel number.|
|1–3|Padding zeroed by the stock CLI.|
|4–7|Little-endian32-bit bandwidth enum.|

The CLI converts widths20/40/80/160 to enum0/1/2/3. It also recognizes numeric selectors3201/3202 as enum5/6; those generic cases do not establish320MHz support on the G6. Its numeric getter printer maps enum4 to-1 and both enum5/6 to320.

USSA's band indices0–5 label2.4GHz,5GHz lower,5GHz high,5GHz all,60GHz and6GHz. This index space differs from the frequency bit selectors in ECD's52-byte request. Labels in common software are not proof of corresponding radios.

The getter calls `ussa_getChannel` and prints its initialized result buffer without checking the API result at that point. Its formatted output therefore needs corroboration. The collector deliberately skipped these getters when its external time bound was unavailable; this is not a demonstrated getter failure. No USSA setter was executed.

The [ubus trace](../internal-ubus-management/resources/wireless-followup/README.md) retains the exact constructor, enums, JSON envelope and backend leads. A related NWAL channel function reaches an optional driver callback and can reject missing callbacks; it is not an unconditional success stub. Its full binding to the specific ubus setter, final driver behavior and persistence remain unresolved.

## What this enables now

The verified tools can collect interface/channel state and AP-daemon status across owned routers through existing authorized shell access. They can expose disagreements between configured, cached and driver-reported state before a control change is attempted.

For writes, the missing work is narrower: bind the particular USSA operation through its loaded platform callback, establish its configuration/persistence rules, and test one change with a restore plan. No stable general remote-control client or proven reboot-persistent channel recipe is claimed here.

Both projects contain a complete knowledgebase, original-source references and an [offline validator](resources/README.md). All17 inventoried tool paths exist in each of the three saved profiles; eight freshly measured live tool hashes match the HJL files. Beacon9 observations in this record are static comparisons only.
