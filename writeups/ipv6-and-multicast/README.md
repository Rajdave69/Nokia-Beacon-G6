# Following IPv6 and multicast through the stock Beacon G6

A G6 can have an IPv6 address on its WAN while clients still lack a delegated prefix, default route or DNS. Those are separate pieces of state. In the stock HJL firmware, a DHCPv6 client, a router-advertisement monitor and the LAN configuration code each own a different part of the process. [DHCPv6 prefix delegation](https://www.rfc-editor.org/info/rfc8415/) · [Router advertisements](https://www.rfc-editor.org/info/rfc4861/) · [DNS in router advertisements](https://www.rfc-editor.org/info/rfc8106/).

## How the WAN gets IPv6

The WAN manager uses Nokia's `ndk_dhcpv6` netifd protocol. Its shell wrapper builds a client configuration for `ndk_dhcp6c`. IA_NA asks for an address, IA_PD asks for a prefix, and the DNS option request is separate. In automatic mode, when either router-advertisement flag is still missing, the wrapper starts the DHCPv6 client in stub mode. Once both flags are present, the script uses M for IA_NA and O for the DNS/search option request. The IA_PD setting is evaluated independently.

`ndk_ramond` handles upstream router-advertisement information. Its stock callback reports the gateway, address, prefix and DHCPv6 start/flag information as separate ubus events. The DHCPv6 client callback reports addresses and prefixes with their preferred and valid lifetimes, plus DNS, search domains and optional AFTR information. The WAN manager has paths for both TR-098 and TR-181 state. The netifd publishing helper also has separate fields for lease addresses, RA addresses, and prefixes. Its example default-route calls are commented out, so that helper alone cannot explain how the upstream default route was installed.

Four offline fixtures exercised the stock client configuration generator. They reproduced the automatic-mode stub, an M=0/O=1 case that still requests a delegated prefix, an explicit address request, and an information-only request. They verify what gets written to the config file. The tests used synthetic data and launched no DHCPv6 client. [Stock scripts, build comparison and fixture results](resources/evidence.json).

## What the Beacon sends to LAN clients

The saved LAN model exposes separate options for DHCPv6, router advertisements, DNS and prefix sources. The HJL `cfgmgr` writes `/etc/radvd.conf`, with branches that emit prefix lifetimes, M/O flags, RDNSS and DNSSL. It can start `ndk_radvd` or reload it with SIGHUP. There are separate `ndk_dhcp6s` launch paths using `/etc/dhcp6s.conf`. A LAN client can therefore learn its router, address and DNS information from different messages.

The stock firmware also has a management-side DHCPv6 client path on `br-lan` using the `N_EXT` interface configuration. Its generated config requests an address and DNS. The interface template has default-route installation disabled. Its existence is evidence of a separate management path. Which AP or extender roles actually take it and how those roles handle IPv6 still need to be checked on a running unit. See the [AP-mode tutorial](../../tutorials/set-ap-mode/README.md) for the separately traced bridge transition.

## Snooping and proxying have different jobs

| Path | What the stock firmware shows |
| --- | --- |
| IGMP and MLD snooping | LAN configuration objects expose enable and mode. Nokia's `kigmp` module has IGMP and MLD snooping code alongside Linux bridge snooping support. The active forwarding path and hardware port behavior need a runtime check. |
| Routed IPv4 multicast | `cfgmgr` has separate generators for `/configs/igmprt.conf` and `/configs/igmpproxy.conf`. PCD starts `igmpd` with the first file after `/tmp/igmp_boot` appears. A WAN-aware branch can launch `igmpproxy` with the second file. |
| Routed IPv6 multicast | `cfgmgr` writes `/configs/mldproxy.conf` and has branches that start `mld`. The daemon contains IPv6 multicast-router setup and interface handling. |

Snooping keeps track of group membership within the bridge. A proxy can carry membership between an upstream and a downstream interface. Discovery on one bridged LAN and IPTV across routed interfaces therefore need separate tests. [Snooping behavior](https://www.rfc-editor.org/info/rfc4541/) · [IGMP/MLD proxying](https://www.rfc-editor.org/info/rfc4605/).

The next packet test should record the upstream RA, DHCPv6 delegation, LAN RA and one client's route and DNS state through renewal, uplink reconnect and AP mode. Test bridged discovery and routed group membership separately. The four netifd scripts and the two examined PCD rules are byte-identical between IJL and HJL. Several of the native daemons differ, and native call sites here are from HJL. [Technical record](../../knowledgebases/ipv6-and-multicast.md).
