# What the G6's stock access controls actually inspect

Can the Beacon block a device on a schedule or prevent it from opening a site? The saved firmware contains several mechanisms for these jobs, but they do not all inspect the same traffic. A URL entry, a DNS decision and an IP-address drop are different enforcement methods. To know what a particular policy does, we need both its configuration and the rules and processes active when traffic passes.

This investigation examines Beacon G6 HomeOS 24.04 `HJL.L91p01`, with HomeOS 24.02 `IJL.J03p01` file comparisons and an archived read-only 24.04 firewall snapshot. No policy was enabled, packet generated, service restarted or failure induced for this research. The [technical record](../../knowledgebases/stock-access-controls.md) and [instruction evidence](resources/evidence.json) retain the exact fields and traces.

## Three policy paths

| Feature | Policy input in the examined 24.04 firmware | Traced enforcement |
| --- | --- | --- |
| Scheduled access policy | Enable, days and times, device IP/MAC lists and URL entries | `cfgmgr` constructs IPv4 and IPv6 parental forwarding rules. |
| Nokia parental profile | Per-device access, schedules and URL settings | `parentCtld` and `pcFilterd` participate in DNS decisions; the manager can also install destination-address drops. |
| Global URL list | Global enable, include/exclude mode, URL and optional port | `ndk_urlfilterd` inspects selected IPv4 cleartext HTTP traffic via a netfilter queue. |

These are separate mechanisms even if the WebUI groups them under similar labels. A saved setting is an instruction to the management software; it is not itself a packet verdict.

## Scheduled access: deciding when a device may pass

The `X_ASB_COM_ParentalControl` model includes policy rows with enable flags, day and time ranges and device lists. The examined 24.04 `cfgmgr` has schedule-enter and schedule-exit paths and builds parental forwarding chains for IPv4 and IPv6. This establishes a route from a configuration object to rule construction. It does not establish what a specific live schedule does for every protocol or an already established connection.

## Profiles: DNS decisions and address rules

The separate Nokia parental-profile model contains device, schedule, access and URL state. In the traced 24.04 startup path, `ndk_appsd` launches `parentCtld` and `pcFilterd` when its relevant path is used. A binary or launch call does not prove a profile is active on a particular device.

The firmware has templates sending UDP DNS queries from bridge interfaces to netfilter queue 8 for both IPv4 and IPv6, including separate local-router and forwarded-query hooks. `pcFilterd` parses a DNS question, asks `parentCtld` for a decision over a local Unix socket, and can return an accept or drop verdict. The profile manager also has per-profile destination-address drop operations. A DNS trace alone would therefore not describe the entire policy.

The inspected parser establishes **UDP DNS** handling; it does not establish inspection of encrypted DNS contents. Address restrictions or other rules may still affect a connection using encrypted DNS. Address lifetime, rule precedence and the complete IPv6 extension-header behavior remain open.

## Global URL list: what cleartext HTTP reveals

For the global URL feature, the 24.04 code writes `/var/url_list`, configures an IPv4 `UrlFilter` chain and starts `ndk_urlfilterd`. Its traced queue handler recognizes cleartext HTTP GET, POST and HEAD requests and compares host/path entries, optionally including a TCP port. This can inspect information present in a cleartext request; it is not evidence that the daemon decrypts HTTPS or sees an HTTPS URL path.

A separate `ndk_httpfilterd` path has port-80 browser handling and redirection code using another queue. Its complete startup triggers and live availability were not established. Do not assume it is the global URL-list daemon.

## What the firewall snapshot actually showed

The archived 24.04 snapshot had IPv4 and IPv6 jumps into `FORWARD_PC` and parental/profile chains. It also contained IPv4 TCP port 80 rules in `UrlFilter`. However, `FORWARD_URL_FILTER` had no outgoing jump into that chain in this snapshot, and DNS queue-8 hooks were absent. An existing chain can therefore be present without the observed path directing packets to it. The capture does not demonstrate a client verdict or behavior on another device.

Queue listeners and firewall rules also have separate lifecycles. The stock DNS templates omit queue bypass; the [Linux 4.14 queue implementation](https://github.com/torvalds/linux/blob/v4.14/net/netfilter/nf_queue.c) can drop packets that reach a queue with no listener, while firmware cleanup can change which rules remain. The resulting behavior during a restart or firewall rebuild was not tested, so neither a universal fail-open nor fail-closed claim follows.

The three examined packet consumers are byte-identical across the G6 24.02 and 24.04 captures, but their policy managers differ. Shared binaries do not prove identical policy behavior.

## How to establish what a real policy does

On an isolated, authorized test network, use a known client and a policy with clear allowed and denied cases. Record the active profile, installed chain jumps and queue listener, then compare the client's results for IPv4 and IPv6 DNS, cleartext HTTP and HTTPS. Repeat after a normal firewall reload, and compare a new connection with one that existed before the policy change. Correlate any suspected hardware-offloaded flow with the [G6 offload investigation](../cortina-offload-and-qos/README.md); no such packet-level test was performed here.
