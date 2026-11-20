# How the Beacon G6 accelerates traffic and applies QoS

When a router forwards traffic, does every packet take the same route through Linux? And if the WebUI accepts a bandwidth setting, does that mean the hardware enforces it? The examined G6 firmware has several acceleration and quality-of-service paths, but their presence does not prove that a particular flow used them or that a requested rate was applied.

This investigation traces the Beacon G6 HomeOS 24.02 `IJL.J03p01` and 24.04 `HJL.L91p01` firmware. The runtime settings below are read-only observations from a G6 running 24.04. The Beacon 9 HomeOS 25.03 `JJM.K44p01` uses a different Qualcomm platform and is a component comparison, not a live Cortina test. Firmware inspection and runtime settings are separate from a packet-level measurement.

## What is packet offload?

A router normally receives a packet, identifies its connection, applies the relevant routing and policy, and transmits it through another interface. That work can involve the Linux networking stack and CPU. **Offload** moves some of that work to a faster path once a flow meets its conditions. For example, a hardware engine may use a programmed flow entry to handle later packets without repeating every CPU-side operation. This can reduce CPU work, but eligibility, hardware capabilities and the point at which rules are enforced all matter.

A flow is a set of related packets, often identified by addresses, ports and protocol. The first packets may still traverse the ordinary path so the router can establish state. Offload is not automatically enabled for every connection, and a loaded module is not proof that a particular packet bypassed a particular Linux rule. To establish that, match a controlled flow to the relevant hardware entry or counters and verify delivery.

**Quality of service (QoS)** is a different question: how traffic is classified, marked, queued, scheduled, limited or dropped when capacity is constrained. An offloaded flow may interact with hardware queues, but the mere existence of an accelerator does not prove that a QoS setting configures those queues. Conversely, a Linux classifier can exist without demonstrating hardware shaping.

## Which firmware runs the packet engine?

The G6 runs Linux on its main processor and **Zephyr RTOS on the auxiliary Cortina Wi-Fi packet engine**. Early Linux startup loads `/taroko/wfo-qca-nss-pe0.bin` through `rboot -z`. The payload identifies itself as `zephyr-v1.13.0-155-g89629ff620`; the [preserved initial UART log](../probing-from-outside/initial-uart.txt) shows the matching `wfo-qca` application and Zephyr banner starting on the PE0-labelled IPC path. This establishes a historical boot of that image, not its current runtime state.

The loader is a Linux program that copies the payload into packet-engine memory and controls the engine. The WFO image contains host communication and Wi-Fi datapath identifiers. It runs in a separate execution environment, not as a Linux process: the host is AArch64, while the examined WFO entry decodes as MIPS32. UART output from the two environments can be interleaved. The traced loader invocation changes engine state and is not a read-only status command.

The WFO payload is byte-identical in both G6 24.02/24.04 builds and all three examined XS-2426X-A 24.03 builds. Older XS-2426G-B R21/R23 images ship earlier 1.13-based revisions. Separate IPsec, MAP-T and throughput-test payloads contain 1.9-based Zephyr banners; their presence does not show they ran during normal boot. The empty files named `offload_firmware` are placeholders, not the WFO image.

Identifying the RTOS does not establish that a particular flow used it, or that every acceleration or QoS path runs there. Beacon 9 uses a different Qualcomm stack; its capture does not establish whether a future Cortina HomeOS 25.xx build retains this component. The [Zephyr packet-engine knowledgebase](../../knowledgebases/zephyr-packet-engines.md) preserves the cross-version hashes, startup path and UART evidence.

## Three different paths called offload

| Component | What the firmware shows |
| --- | --- |
| Linux flow table | `xt_FLOWOFFLOAD` uses the kernel flow table, with IPv4 and IPv6 hooks and a hardware-add entry point. The module and its flow-table dependencies were loaded on the checked G6. No FLOWOFFLOAD rule was printed by either filter-table query. |
| Cortina kernel hooks | `ca-ne-gpl.ko` registers its own operations, including TCP and UDP flow handling. The handlers can program Cortina entries through `ca-ne.ko`. This path exists independently of an iptables FLOWOFFLOAD rule. |
| Nokia `koffload.ko` | The inspected functions set up Wi-Fi-side receive callbacks and netlink handling, including DHCP snooping and trapping. Its module name alone tells us little about routed-flow acceleration. |

The G6 24.02 `IJL.J03p01` and 24.04 `HJL.L91p01` builds have the same Linux FLOWOFFLOAD target module and hardware flow-table companion bytes. Their Cortina modules differ, but both have the vendor hook initialization, packet-count check and TCP and UDP paths. These compiled paths and the separately identified Zephyr Wi-Fi payload do not establish how every routed flow is handled or whether a particular flow is accelerated. [Stock source hashes and disassemblies](resources/static-evidence.json).

## What the live G6 24.04 reported

| Read on HJL.L91p01 | Result |
| --- | --- |
| Conntrack accounting | Enabled |
| Cortina `offload_after_n_pkts` | **15** |
| Cortina `udp_offload_occasion` | **0** |
| Cortina `qos_mode` | **0**, described by the driver as tail drop |

The native packet-count callback reads the conntrack accounting data when available and compares a sum against the configured threshold. That explains why a flow can first appear on the CPU path even when acceleration is available. The 15 is a setting, and actual table admission still depends on the protocol and other driver checks.

The UDP setting has a separate purpose. The driver describes mode 0 as creating the forward and reverse hash entries at different points as traffic arrives in each direction. Its mode 1 description waits for conntrack to become `ASSURED`. The first description is the policy shown on this G6. My later snapshot counted 69 conntrack entries with zero `[OFFLOAD]` and zero `[HW_OFFLOAD]` markers. The saved HJL kernel contains the first marker and has no literal for the second. Cortina also has a separate driver path. A matching hardware flow-table entry or counter is needed to confirm that a particular flow reached Cortina. [Read-only router snapshot](resources/owner-runtime.json) · [Kernel and conntrack evidence](resources/classification-and-conntrack-evidence.json).

## Following a QoS setting toward a packet

Consider a request to cap an uplink at a chosen rate. The UI can save the number, and a classifier can mark a packet as belonging to a class, but neither step proves a scheduler or shaper enforces that rate. The traces below distinguish those stages in the G6 24.02 and 24.04 images.

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

For an OpenWrt port, Linux flow offload, Cortina flow programming and hardware QoS need their own checks. A useful packet experiment would keep the route and QoS configuration fixed, compare a new flow with the same flow after it warms up, and correlate Linux counters with a hardware flow or queue counter. The existing WCA statistics commands default to clearing counters, so a passive comparison needs the explicit non-clearing mode. The examined Beacon 9 25.03 `JJM.K44p01` image ships Qualcomm ECM/PPE/SFE and a separate QoS integration, so it needs its own test.

Retaining the G6's Zephyr WFO payload in a replacement Linux system would also require compatible loader and packet-engine control, reserved-memory configuration, host IPC and ring handling, Cortina datapath support and Wi-Fi integration. Copying the binary alone does not provide those interfaces; this is an integration requirement inferred from the stock path, not a validated port.

The remaining lab check is to correlate a known flow with a Cortina table entry and its queue counters. A timed run can establish the programmed rate and a rule-change run can measure how quickly the old hardware entry goes away. The available runtime evidence comes from existing settings and rules. No traffic or hardware state was changed for this follow-up. [Technical record](../../knowledgebases/cortina-offload-and-qos.md).
