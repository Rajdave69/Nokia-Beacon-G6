# How the Beacon G6 offloads packets and applies QoS

Offload moves eligible packet processing out of the normal Linux forwarding path. QoS decides how to mark, queue, rate-limit or drop traffic. Both can touch the Cortina datapath, but they enter it through different parts of HomeOS. On the Beacon G6, the quickest way to get confused is to take a loaded offload module or a successful QoS call as proof of what happened to a packet.

## Three things named offload

| Component | What the firmware shows |
| --- | --- |
| Linux flow table | `xt_FLOWOFFLOAD` uses the kernel flow table, with IPv4 and IPv6 hooks and a hardware-add entry point. The module and its flow-table dependencies were loaded on the checked G6. No FLOWOFFLOAD rule was printed by either filter-table query. |
| Cortina kernel hooks | `ca-ne-gpl.ko` registers its own operations, including TCP and UDP flow handling. The handlers can program Cortina entries through `ca-ne.ko`. This path exists independently of an iptables FLOWOFFLOAD rule. |
| Nokia `koffload.ko` | The inspected functions set up Wi-Fi-side receive callbacks and netlink handling, including DHCP snooping and trapping. Its module name alone tells us little about routed-flow acceleration. |

The two stock G6 builds have the same Linux FLOWOFFLOAD target module and hardware flow-table companion bytes. Their Cortina modules differ, but both have the vendor hook initialization, packet-count check and TCP and UDP paths. Two empty files named `offload_firmware` also ship in the images. The working hooks are in the driver, so those empty files do not tell us whether it is active. [Stock source hashes and disassemblies](resources/static-evidence.json).

## What the stock G6 actually reported

| Read on HJL.L91p01 | Result |
| --- | --- |
| Conntrack accounting | Enabled |
| Cortina `offload_after_n_pkts` | **15** |
| Cortina `udp_offload_occasion` | **0** |
| Cortina `qos_mode` | **0**, described by the driver as tail drop |

The native packet-count callback reads the conntrack accounting data when available and compares a sum against the configured threshold. That explains why a flow can first appear on the CPU path even when acceleration is available. The 15 is a setting, and actual table admission still depends on the protocol and other driver checks.

The UDP setting has a separate purpose. The driver describes mode 0 as creating the forward and reverse hash entries at different points as traffic arrives in each direction. Its mode 1 description waits for conntrack to become `ASSURED`. The first description is the policy shown on this G6. The owner's later snapshot counted 69 conntrack entries with zero `[OFFLOAD]` and zero `[HW_OFFLOAD]` markers. The saved HJL kernel contains the first marker and has no literal for the second. Cortina also has a separate driver path. A matching hardware flow-table entry or counter is needed to confirm that a particular flow reached Cortina. [Read-only router snapshot](resources/owner-runtime.json) · [Kernel and conntrack evidence](resources/classification-and-conntrack-evidence.json).

## From a QoS setting to a packet

The WebUI reads and writes configuration objects for classifiers, queues, policers, DSCP and 802.1p. The G6 library also contains Linux rule builders for mangle chains, DSCP marking and traffic-class assignment. Those operations deal with how to identify a packet or label it. A hardware queue, shaper or policer is a separate step.

The more surprising finding is that **both G6 builds ship ten `hal_hgu_qos_*` functions that return zero immediately**, including their overall rate-limit, queue-rate, classifier, flow and policer functions. The higher-level `sal_hgu_qos_config_overall_ratelimit` also returns zero without applying the supplied rate. A successful return from those specific functions therefore gives no evidence of shaping.

One HJL classification path goes from the config object's create callback through NDK to `config_class`. An enabled rule can reach `hal_create_qmgmt_flow`, which can call the Cortina classifier API. The NDK wrapper discards the HAL result. The separate queue-rate handler reaches the return-zero queue-rate stub.

An archived HJL ruleset shows the installed Linux path as well. Both IPv4 and IPv6 include a `CLASSIFY` rule assigning class `0010:0001` on the Ethernet WAN interface. The software rule worker has a branch that flushes conntrack when the queue is empty, more than nine operations were counted and the flush flag is set. That can interrupt existing flows. The timing of hardware entry removal under those conditions still needs a measurement.

The Cortina SDK has separate port and queue shaper functions. The HJL driver splits the supplied rate into a quotient and remainder with base 1000 for the port shaper and 500 for the queue shaper. Both paths narrow those values and the burst value to 16 bits before AAL programming. This recovers the driver packing. A timed packet test is needed to verify the wire rate. [Classification and shaper evidence](resources/classification-and-conntrack-evidence.json). [Cortina hardware controls](../cortina-hardware-controls/README.md#qos-shaping-and-counters) · [NDK management paths](../uplink-vlan-firewall/README.md).

The router reported tail drop as its current kernel-hook QoS mode. That mode describes what to do when a queue fills. It says nothing about the queue's bandwidth, scheduler weight, or whether a shaper is configured.

## How to tell whether a flow reached Cortina

The stock SDK has a tuple lookup and an iterator. On HJL, both inspect the driver's NAT records and consult the hardware hash age. Both also have a branch that unlinks and frees stale driver records. Repeated lookups can affect what the next lookup sees. A returned entry is evidence of a tracked flow, and a matching hardware observation plus packets received by the far endpoint is stronger evidence that the flow used the datapath. An entry disappearing after a lookup does not establish that an unobserved entry would have vanished at the same time.

The queue reader returns eight 32-bit values for forwarded, tail-dropped, marked-dropped and unmarked-dropped traffic, each in packets and bytes. Some port branches combine L2 and L3 contributions. The WCA wrapper defaults to read-and-clear. An explicit `read_clear=0` preserves counters during the read, but the implementation still writes the read-clear control bit before fetching the queue counters. Treat this as a diagnostic operation for an isolated test. Treat the counters as totals for the selected queue and port mapping. They can include unrelated traffic. [Verified stock getter and delete paths](resources/measurement-evidence.json).

| Test | Evidence to keep |
| --- | --- |
| Flow admission | Confirm the route and egress port first. Record a quiet baseline, then a small transfer and a sustained transfer between two isolated endpoints. Preserve the pre- and post-NAT tuples, endpoint packet counts, lookup status and age, and Linux interface/rule counters. Keep IPv4 TCP, IPv4 UDP and IPv6 as separate runs. |
| Queue selection and shaping | Check background deltas across queues 0–7. Send one controlled stream and repeat with one stock QoS setting changed. Compare candidate queue deltas with timed receiver throughput. A queue delta shows activity on the mapped queue. A repeatable rate change is the evidence needed to claim shaping. |
| Entry removal | In a separate run, timestamp the policy change and the Linux and Cortina state observations. Compare with a run where the Cortina lookup happens only once, at the end. The session delete hook can reach the hardware hash delete routine, but its presence gives no elapsed time or proof that a particular policy update invoked it. |

None of these packet measurements were made in this pass. The saved module exposes a path to collect the evidence, and the stock queue-rate stub still has no verified rate-setting effect.

## What this means for a port

For an OpenWrt port, Linux flow offload, Cortina flow programming and hardware QoS need their own checks. A useful packet experiment would keep the route and QoS configuration fixed, compare a new flow with the same flow after it warms up, and correlate Linux counters with a hardware flow or queue counter. The existing WCA statistics commands default to clearing counters, so a passive comparison needs the explicit non-clearing mode. The Beacon 9 ships Qualcomm ECM/PPE/SFE and a separate QoS integration, so it needs its own test.

The remaining lab check is to correlate a known flow with a Cortina table entry and its queue counters. A timed run can establish the programmed rate and a rule-change run can measure how quickly the old hardware entry goes away. The available runtime evidence comes from existing settings and rules. No traffic or hardware state was changed for this follow-up. [Technical record](../../knowledgebases/cortina-offload-and-qos.md).
