# Getting to know the Nokia Beacon 9

The Beacon 9 combines a Qualcomm IPQ5332 platform, three Wi-Fi bands and eMMC storage. It belongs to the same Nokia software family as the Beacon G6, but its board and driver stack are substantially different. The useful comparison is between the roles of the components, rather than assuming that a G6 register, boot command or driver will work on it.

The captured unit is `B9-A`, running `3TN01100JJMK44` / `JJM.K44p01`, HomeOS 25.03. The evidence includes saved root-shell diagnostics, its eMMC dump, an original kernel-embedded board description and the owner's read-only RAM/clock measurements. Published specifications describe the product design; those captures establish what this particular device reported. Physical chip markings and header wiring have not been inspected.

## The hardware inventory

| Component | What is established | Evidence |
| --- | --- | --- |
| Platform | Qualcomm IPQ5332, reference-board compatible `qcom,ipq5332-ap-mi01.6` | Running device-tree identification and matching kernel DTB |
| CPU | Four AArch64 processors; packaged CPU nodes say `arm,cortex-a53` | Live cpuinfo and original board tree |
| CPU frequency range | CPU0 reports **1.1–1.5 GHz**; sampled current frequency 1.1 GHz | Owner's cpufreq snapshot |
| Declared live RAM | **1 GiB**, starting at `0x40000000` | Live `/memory/reg`, decoded using two address and two size cells |
| Linux usable RAM | **821,428 KiB**, about 802.18 MiB | Owner's `/proc/meminfo` snapshot |
| Storage | `M04A11` eMMC, 3,909,091,328-byte user area; two additional 4 MiB boot areas | Saved block-device/sysfs capture |
| Wireless | Three operating PHYs, 2.4/5/6 GHz, EHT capabilities | Saved `iw` output |
| Ethernet | APPE and MHT switches, NSS datapath driver, four QCA808X-labelled MDIO devices | Saved switch, driver and MDIO enumeration |
| Console | `ttyMSM0`, 115200 8N1; UART input can be disabled by firmware policy | Captured command line and owner observation |

The package target is `ipq53xx/generic`, with an `aarch64_cortex-a53_neon-vfpv4` package architecture. Here there is also a board-tree CPU declaration; the architecture label alone would not identify the silicon. The live CPU implementer/part values are `0x51`/`0x801`, and should be retained as observations rather than decoded as an ordinary ARM implementer part number.

## Ports, enclosure and the meaning of the speed rating

Nokia specifies a 2.5GbE WAN connection, a 2.5GbE LAN connection and a 1GbE LAN connection. Its enclosure dimensions are **173.5 × 140 × 71.5 mm**, in height/width/depth order. These are published values, not measurements of B9-A. [Nokia's product specifications](https://www.nokia.com/broadband-access/in-home-connectivity/home-wi-fi/wi-fi-beacon-9/).

The captured APPE switch output includes a port reporting a 10 Gbit/s link. That is a switch-side observation, not evidence of an external 10GbE jack. The external connector inventory and the internal switch interconnect are different parts of the design. Likewise, four MDIO devices do not imply four user-accessible Ethernet sockets.

The saved diagnostics do not map every printed socket label to an SSDK port and PHY address. Establishing that requires controlled link-state observations while moving one cable at a time. The existing capture does establish a working 2500 Mb/s full-duplex link on `eth0`, using PHY address 4 and the `nss-dp` driver.

No verified adapter-current rating or DRAM-chip designation is available in the captured evidence. A label photograph would be more useful for those details than interpreting a generic regulator or memory node. USB-related driver or device-tree support is also insufficient to add a physical connector to this inventory.

## The board description inside the kernel image

The saved `0:HLOS` partition is an ELF-wrapped boot image containing a FIT and several board DTBs. It is not sufficient to extract the first device tree and call it the Nokia board. The image contains eight IPQ5332 board descriptions, including AP-MI01.2, AP-MI01.9 and AP-MI01.6 variants.

The tree whose model and compatibles match the live capture is **57,329 bytes**, at offset `0x382b18` inside the saved kernel partition. Its model is `Qualcomm Technologies, Inc. IPQ5332/AP-MI01.6`. This ties the analysis to the reported board family, while allowing for boot-time changes to the tree.

Some useful platform declarations are:

| Resource | Packaged matching-tree declaration |
| --- | --- |
| CPU startup | PSCI, secure-monitor calls (`smc`) |
| Interrupt controller | `qcom,msm-qgic2`, beginning at `0x0b000000` |
| GPIO/pin controller | `qcom,ipq5332-pinctrl`, `0x01000000` |
| Console UART | `serial0` → `/soc/serial@78af000`, span `0x200` |
| Second UART | `0x078b0000`, declared disabled |
| Watchdog | `0x0b017000`, span `0x1000` |
| eMMC controller | SDHCI at `0x07804000`, with command-queue registers at `0x07805000` |
| MDIO | `0x00090000`, with an additional control resource at `0x0009b780` |
| Host datapaths | `dp1` at `0x3a504000`, `dp2` at `0x3a500000` |

The SDHCI node declares a non-removable device, a four-bit bus and a 100 MHz maximum frequency. Those are controller settings in the packaged tree, not a readback of the currently negotiated eMMC mode. The datapath address for `dp1` agrees with the saved `ethtool` bus information for `eth0`, giving useful corroboration between the tree and a running driver.

## RAM capacity, usable memory and reservations

The owner's live memory property contains these big-endian values:

```text
address: 0x0000000040000000
size:    0x0000000040000000
```

With the reported cell counts, that describes **1 GiB** over `0x40000000`–`0x7fffffff`. Linux's `MemTotal` is smaller because not all declared DRAM is available to its allocator. Hardware buffers, coprocessor firmware, secure-world allocations and kernel bookkeeping can all consume or exclude memory. The G6 custom-rootfs investigation has the same distinction: software-available RAM must not be substituted for installed capacity.

Boot-time carve-outs can reduce `MemTotal`. Ordinary driver allocations from memory already managed by Linux instead consume free/available memory without changing that total.

`MemAvailable` is another quantity again. It estimates memory available to workloads at the time of the query, so applications, caches and containers can change it without changing the board's RAM. The supplied snapshot reports no swap. No `CmaTotal` line was returned; that does not mean all hardware reservations are absent.

There is a second, separate discrepancy. The packaged matching DTB declares only **512 MiB** at the same base. The two saved HLOS kernel partitions are byte-identical, so the other captured bank does not supply a different tree. The running tree declares twice that amount. This demonstrates that the packaged memory property is not the final running description. Boot-time adjustment is a plausible explanation, but the exact code responsible has not been traced. Reserved memory explains a usable-memory reduction; it does not explain that change of declared size by itself.

The packaged reserved-memory map shows why a single total is insufficient:

| Selected packaged region | Start | Size |
| --- | --- | ---: |
| `tzapp` | `0x49b00000` | 6 MiB |
| `uboot` | `0x4a100000` | 4 MiB |
| `wcnss` | `0x4a900000` | 35 MiB |
| Q6 calibration database | `0x4ce00000` | 5 MiB |
| MLO global memory | `0x4db00000` | 17 MiB |
| `qcn9224_pcie0` | `0x4ec00000` | 50 MiB |
| `qcn9224_pcie1` | `0x51e00000` | 50 MiB |
| `ramoops` | `0x55900000` | 2 MiB |

This is a selection from the packaged tree, not a fresh dump of every runtime reservation. It must not be subtracted mechanically from `MemTotal`, which already excludes unavailable regions. A reserved region named for a second radio also does not establish that a second physical endpoint is populated.

## Wi-Fi: three PHYs do not mean three identical chips

The saved radio output shows three operating PHYs. At capture time they used 2.4 GHz at 20 MHz width, 5 GHz at 80 MHz, and 6 GHz at **320 MHz**. Each reported configured transmit/receive antenna masks of `0x3`/`0x3`. EHT capability structures were present on all three.

Nokia describes this as a **BE9400**, tri-band **2×2** product, with 320 MHz support on 6 GHz and MLO capability. The aggregate PHY class is not a measured client transfer rate or routed throughput. [Published wireless capabilities](https://www.nokia.com/broadband-access/in-home-connectivity/home-wi-fi/wi-fi-beacon-9/).

The packaged board tree enables an integrated `qcom,cnss-qca5332` Wi-Fi node and a `qcom,cnss-qcn9224` node, while other QCN9224/QCN9160 alternatives are disabled. The live PCI capture sees a Qualcomm `17cb:1109` endpoint at `0001:01:00.0`, bound to `cnss_pci`. This supports a mixed integrated/external radio design, but does not assign every PHY to a particular die or certify chip markings.

The software stack includes `wifi_3_0`, `umac`, `qca_ol`, `qdf`, `ipq_cnss2`, spectral and telemetry components. Radio startup depends on firmware, calibration, reserved memory and the vendor integration, rather than merely loading a generic wireless driver.

The captured logs also say non-MLO operation is permitted by the INI configuration, and the shown MLD addresses were zero. MLO capability is established; an active multi-link client session is not. Generic EHT stream tables must not be read as eight physical spatial streams in this two-chain product.

## Ethernet and hardware acceleration

The two reported switches are `QCA APPE` and `QCA MHT`. The first is associated with the main packet-processing path; the second adds another switch domain. The captured LAN uses `eth1.1` and `eth1.2` bridge members, while `eth0` carries the WAN side. Those are software roles in that capture, not immutable socket assignments.

The APPE/MHT topology is accompanied by `qca_ssdk`, NSS datapath, PPE, SFE and ECM modules. VLAN, bridge, PPPoE and Wi-Fi integration components are present. A module list establishes available software and loaded components, not the acceleration state of each flow. A successful link also does not establish VLAN membership, bridge reachability or hardware firewall behavior.

This differs from the G6's Cortina drivers and Taroko packet-engine loader. No equivalent Cortina Zephyr payload was identified in the Beacon 9 capture. That is a platform comparison, not proof that every HomeOS 25.xx product changed its auxiliary OS. [Packet-engine comparison](../../knowledgebases/zephyr-packet-engines.md).

## eMMC, firmware banks and persistent state

The eMMC user area is about **3.64 GiB**, with 32 GPT partitions. Its two 4 MiB hardware boot areas are separate block devices; they are not two of those GPT entries. Both reported read-only protection enabled in the saved capture.

The partition names include paired early boot, trusted firmware, bootloader, Wi-Fi firmware, Linux kernel and rootfs regions. Other partitions hold radio/manufacturing material, configuration, logs and application storage. That is a multi-component update layout, not two interchangeable rootfs files. [Beacon 9 storage map](../storage-and-flash/beacon-9.md).

The running root uses read-only SquashFS with a RAM-backed overlay. Configuration, logs and application data have separate persistent ext4 backing. A successful edit under `/etc` therefore need not survive reboot, while a change written through a persistent vendor configuration path can. Hardware calibration and boot metadata must remain distinct from an ordinary configuration export.

The saved filesystem mount for Wi-Fi firmware comes from its own GPT partition. Reconstructing a working system requires that component and its board data as well as the Linux rootfs. Space outside listed partitions is not automatically disposable; a complete user-area dump and the two hardware boot-area dumps answer different backup questions.

## Buttons, indicators, UART and recovery

The matching board tree declares reset on GPIO48 and an SoC WPS button on GPIO49. It also retains a separate root-level WPS declaration on GPIO35. The LED descriptions include blue/white GPIO outputs and PWM green/red outputs, labelled `MESH_B`, `MESH_W`, `MESH_G` and `MESH_R`.

These are useful driver-porting clues, not a measured pad map. The duplicate WPS declarations in particular should be checked against the actual runtime binding and button events before selecting one for another OS. No GPIO was driven during this investigation.

The serial alias points to the first UART above, and the kernel uses `ttyMSM0` at 115200 8N1. The owner reports that `serial_is_dis=1` disables console input. Seeing Linux output or a console argument does not establish an interactive bootloader or a recovery shell. The electrical header pinout and voltage remain unmeasured in this record.

Root access under Linux does not establish that secure boot is disabled. The dump provides boot components to inspect, but this hardware writeup does not claim a verified unsigned-boot, EDL or UART recovery procedure. GPIOs, watchdog controls and G6 U-Boot commands cannot be transferred to this Qualcomm board by analogy.

## What the evidence is useful for

A future independent-system port has specific hardware dependencies: the correct IPQ5332 board variant, the final memory map, radio reservations/calibration, eMMC layout, switch topology and matching vendor datapath. The current evidence is much stronger than a product-name guess, while still leaving physical PHY-to-jack mapping, memory-chip markings, power-label details and recovery behavior open.

The [original board evidence](resources/beacon-9-board-evidence.json), [owner's RAM/clock observations](resources/beacon-9-owner-hardware.json) and [complete hardware knowledgebase](../../knowledgebases/hardware-beacon-9.md) retain the source distinctions and exact values. Device-specific serials, MAC addresses and eMMC CID are excluded.
