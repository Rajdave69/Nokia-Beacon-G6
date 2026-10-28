# Getting to know the Nokia Beacon G6: hardware and what the firmware revealed

Device references use the [shared aliases](../README.md#device-aliases). Per-device source references, key-input values and service fingerprints in the accompanying resources are aliases; the private mapping is not published.

## Starting from the outside

The Beacon G6 is an Ethernet-WAN, dual-band Wi-Fi 6 router built around Cortina's CA8289 platform. The hardware investigation now has more to work with than the original product specifications: two routers' firmware captures, their NAND identification, the stock board device tree, PCIe enumeration, UART logs, and the results of starting an independent kernel.

These sources answer different questions. Nokia's documentation describes the intended board design. A device tree describes what software expects to find. A successful hardware probe or a working connection shows what was actually exercised. I have kept those distinctions throughout this writeup; a controller declared in a shared device tree does not establish that its signals reach an accessible connector.

## The hardware inventory

| Component | What the evidence establishes | Evidence |
| --- | --- | --- |
| Main SoC | Cortina Access CA8289, also called Venus | Stock DT compatibles `cortina,venus` and `cortina,ca8289`; boot banner |
| CPU | Four ARM Cortex-A55 cores, running AArch64 | Four `arm,cortex-a55` CPU nodes; boot CPU ID `0x411fd050`; four-core kernel bring-up |
| CPU frequency | Boot firmware reports **1200 MHz** | Captured BL1 output; this is a reported boot setting, not a frequency-scaling survey |
| DRAM | **1 GiB DDR3**; Nokia depicts two 512 MiB devices | Manufacturer block diagram; U-Boot's RAM inventory |
| DRAM interface | Boot firmware reports **DDR3-1866, 32-bit mode** | Captured early boot output |
| NAND | **Micron MT29F4G08ABAFAWP**, 512 MiB SLC | Kernel identification in both routers' dump metadata |
| Radio hardware | Nokia depicts two **QCN9024** devices; stock Linux enumerates two Qualcomm `17cb:1104` endpoints | Manufacturer block diagram and captured `lspci` |
| Wired interfaces | One 2.5GbE WAN, one 2.5GbE LAN, two 1GbE LAN | Nokia's published port inventory |
| Serial console | Cortina UART at `0xf4329188`, used at **115200 baud** | Stock DT, U-Boot `coninfo`/`bdinfo`, working UART sessions |

The memory and radio component names above come from [Nokia's June 2022 product guide, Figure 5-4](https://device.report/m/89a7e8e644b326c7030274954d16a3452c2f5c2d0792383bb53eae670b3cae78_optim.pdf#page=48). They have firmware corroboration, but I have not independently read the markings on every chip.

There are two particularly misleading names in the filesystem. Both current ROM trees declare `DISTRIB_ARCH='aarch64_cortex-a53'`, but the CPU nodes identify Cortex-A55 cores. The package architecture is a build choice, not a probe of the installed CPU. Similarly, `/lib/firmware/IPQ8074/` belongs to the wireless software packaging; it does not make the router's main processor a Qualcomm IPQ8074.

## Ports, controls and power

The external Ethernet connections are:

| Printed label | Maximum published link rate | Role |
| --- | ---: | --- |
| `WAN` | 2.5 Gbit/s | Ethernet uplink |
| `LAN3` | 2.5 Gbit/s | Faster LAN connection |
| `LAN1`, `LAN2` | 1 Gbit/s each | Other LAN connections |

Nokia's [physical connection table and rear-panel drawing](https://device.report/m/89a7e8e644b326c7030274954d16a3452c2f5c2d0792383bb53eae670b3cae78_optim.pdf#page=44) also identify the power switch, WLAN and WPS buttons, barrel power input, and bottom reset button. The front indicators cover WPS, WLAN, Internet, WAN and power. The published interface list has no external USB or optical WAN connector.

The [Nokia datasheet](https://afren.co.za/wp-content/uploads/2023/05/Nokia_WiFi_Beacon_G6_datasheet_Data_Sheet_EN.pdf#page=2) specifies **12 V DC input**, with minimum/maximum consumption of 9/24 W. Those are published operating figures, not measurements of these two units, and they do not specify the adapter's rated output current.

Nokia's published enclosure dimensions disagree. Nokia's [product page](https://www.nokia.com/broadband-access/in-home-connectivity/home-wi-fi/wi-fi-beacon-g6/) lists **255 × 160 × 85 mm** in height/width/depth order; its [September 2025 quick reference](https://www.nokia.com/asset/f/215110/#page=2) lists a **225 mm height** and 160 mm width. This is a disagreement between documents. Without measuring the two routers or comparing their PCBs, it does not establish a hardware revision change.

## Identifying the CPU and platform interfaces

The G6 board DTB is selected from the FIT as `conf@beacon_g6.dtb`. Its root model is the generic `Cortina Access Venus REF Board`, while its compatibles identify CA8289. That generic reference-board string is less specific than the selected board configuration and should not be read as evidence that the wrong image was installed.

The four CPU nodes have affinity values `0x000`, `0x100`, `0x200` and `0x300`. They use PSCI through the secure monitor (`method = "smc"`). The stock boot log reports PSCI 1.1, and the later independent-kernel logs show the secondary CPUs starting.

Several useful platform details can now be read directly from the stock tree:

| Interface | Stock DT description |
| --- | --- |
| Interrupt controller | `cortina,gic-v3-secured` |
| GIC distributor | `0xf8000000`, size `0x10000` |
| GIC redistributors | `0xf8040000`, size `0x80000` |
| Architectural timer | 25 MHz |
| Console UART | `0xf4329188`, register span `0x30`, SPI 4, level high |
| UART input clock | 125 MHz fixed APB clock |
| Watchdog | `cortina,wdt`, register block beginning at `0xf432901c` |

These are the **stock DT addresses**. The experimental kernel's logs also contain peripheral addresses beginning `0x4f...`, including its GIC and Ethernet mappings. Those belong to that kernel's board description; copying the low-address stock nodes into another kernel without checking its address map is insufficient.

The secured GIC compatible and PSCI calls explain why an ordinary ARM64 kernel configuration alone was not enough for the early bring-up. Interrupt handling, the timer, CPU startup and the UART each needed a usable platform description before a shell could become useful. They do not, by themselves, establish the state of every secure-boot check.

## Where the RAM goes

The advertised 1 GiB is not the amount Linux can freely allocate. U-Boot's captured `bdinfo` reports two DRAM ranges:

| Start | End, inclusive | Size |
| --- | --- | ---: |
| `0x00000000` | `0x0effffff` | 240 MiB |
| `0x10000000` | `0x3fffffff` | 768 MiB |

Together they describe **1008 MiB**, leaving a 16 MiB gap at `0x0f000000`–`0x0fffffff`. The stock tree calls that range `tz_buffer`. These are firmware-visible address ranges, not one range per physical RAM chip.

There is also a difference between the DTB stored in flash and the saved analysis copy. The unmodified G6 DTB inside both current FIT captures declares only the first 240 MiB range. The saved `analysis/beacon-g6-stock.dtb` declares both ranges, agreeing with `bdinfo`. Comparing their parsed properties found changes only to `/memory/reg` and `/chosen/bootargs`. The complete boot-time description therefore matters; the packaged DTB alone understates the available DRAM.

Within the RAM ranges, the stock tree reserves further areas for firmware and device buffers. Some of the larger reservations are:

| Stock reservation | Start | Size | What the name associates it with |
| --- | --- | ---: | --- |
| `taroko0`, `taroko1` | `0x03000000`, `0x04000000` | 16 MiB each | Vendor processing engines |
| `wcnss` | `0x08700000` | 40 MiB | Wireless subsystem |
| `qcn9000_pcie0`, `qcn9000_pcie1` | `0x10000000`, `0x12d00000` | 45 MiB each | The two PCIe radios |
| `dma_pool0`, `dma_pool1` | `0x15a00000`, `0x17200000` | 24 MiB each | Shared DMA pools |
| `pe_ddr_buffer` | `0x19000000` | 48 MiB | Packet-engine buffers |
| `ramoops` | `0x0af00000` | 2 MiB | Persistent crash-log buffer |

This is a selection, not an additional RAM-capacity calculation. Other reservations cover cached/noncached DDR buffers, shared memory and wireless link descriptors. Several carry `no-map`, and their treatment depends on the driver and kernel. The 16 MiB `tz_buffer` is already outside the two DRAM ranges; subtracting it from 1008 MiB again would double-count the gap.

The practical consequence is that a low `MemTotal` is not evidence of a smaller physical RAM device. It also explains why picking an arbitrary RAM address for a downloaded kernel or scratch buffer is unsafe: some apparently unused memory belongs to another component, while U-Boot occupies space near the top of DRAM.

## Ethernet: the connector is only one end of the path

Nokia's [functional block diagram](https://device.report/m/89a7e8e644b326c7030274954d16a3452c2f5c2d0792383bb53eae670b3cae78_optim.pdf#page=48) connects the CA8289's GPHY path to the two gigabit LAN sockets. The 2.5GbE paths use external **RTL8221B** PHYs, with XFI/HSGMII-family interfaces shown between them and the SoC.

A PHY handles the electrical Ethernet link. The MAC, DMA queues and packet-processing engines move frames through the SoC. VLAN selection, switching, routing, NAT and offload add further configuration. A negotiated link therefore answers only part of the hardware question.

The independent-kernel experiments made that distinction visible. The captured October 13 boot log probes internal MDIO addresses 1–4 with ID `0x001cc981`, attaches the experimental NI driver to address 2, and later reports a 1000 Mbit/s full-duplex link. Later command logs show DMA consuming transmit descriptors, while explicitly leaving wire transmission unverified and receive support unimplemented. Those results establish useful pieces of the hardware path, but do not establish working native Ethernet forwarding.

They also do not provide a complete mapping from every MDIO address or NI port number to the four printed socket labels. U-Boot's `active_port`, a PHY address, a Linux interface number and `LAN1` are separate identifiers. In particular, `active_port=0` must not be assumed to mean a connector printed `LAN0`.

The stock driver stack has already operated these interfaces. The unresolved work in an independent kernel concerns initialization and frame movement through the vendor datapath, rather than uncertainty over whether Ethernet hardware exists on the board. The [firmware architecture writeup](../firmware-architecture/README.md) covers the software around that stack.

## Wi-Fi: two PCIe radios

The stock PCIe capture independently confirms two radio endpoints:

| Host controller in the stock DT | Endpoint | PCI ID | Bound driver |
| --- | --- | --- | --- |
| `pcie@f4325000` | `0000:01:00.0` | Qualcomm `17cb:1104` | `cnss_pci` |
| `pcie@f4326000` | `0001:01:00.0` | Qualcomm `17cb:1104` | `cnss_pci` |

Both links report **5 GT/s, width ×2**. The tree declares two lanes for these controllers and disables a third controller at `pcie@f4327000`. A disabled node is not evidence of another populated radio or an expansion socket.

The PCI listing identifies the host bridges as Synopsys `16c3:abcd`, with the database label `DWC_usb3`. Their PCI bridge class and DT paths identify their role here; that label does not turn the two radio connections into USB devices.

Nokia describes 4×4 operation on each of 2.4 and 5 GHz, with 160 MHz channels on 5 GHz and an AX6000 aggregate PHY class. These are radio capabilities, not a measured client transfer rate or routing benchmark. [Nokia's published Wi-Fi specifications](https://www.nokia.com/broadband-access/in-home-connectivity/home-wi-fi/wi-fi-beacon-g6/) provide that context.

The firmware uses `qcn9000` names for radio files and RAM reservations, alongside the guide's QCN9024 component designation. Those software-family names are compatible evidence of the radio stack, rather than a chip-marking inspection. Starting the radios still depends on firmware, board/calibration data, reserved memory and the appropriate driver. A successful CPU or Ethernet test does not exercise those dependencies.

## NAND, debug interfaces and the watchdog

Both routers identify the same **512 MiB SLC NAND**, with **256 KiB eraseblocks, 4096-byte data pages and 256-byte OOB areas**. The physical partition sizes also agree. The two firmware banks, factory stores and persistent filesystems all occupy this NAND; they are not evidence of separate flash chips. The [storage and flash writeup](../storage-and-flash/README.md) contains the partition map, UBI geometry and dump coverage.

UART has been exercised through early boot, U-Boot and Linux. The stock kernel calls the console `ttyS0`; the independent Cortina serial driver uses `ttyCA0`. Those names describe software drivers for the serial path. The electrical header pinout and signal voltage have not been established by the evidence recorded here, so this article is not a wiring guide.

Nokia's block diagram also names JTAG, and the stock tree includes USB PHY nodes. Neither establishes accessible JTAG pads, an unlocked debugger, or a usable USB connector on the examined enclosure. Those remain physical-board questions.

The hardware watchdog matters when normal router services are absent. After the successful temporary stock-kernel boot into a UID-0, PID-1 shell, the router was reported to reset after a while. The owner identified the U-Boot device `watchdog@0xf432901c` and supplied `wdt dev watchdog@0xf432901c` followed by `wdt stop` for the recovery sequence. Watchdog expiry is the suspected cause; no reset-cause register result or sustained-stability test was supplied. The [UART recovery writeup](../uart-recovery-from-uboot/README.md) records the procedure and its verification limits.

## What the second G6 confirms

The two units, `G6-A` and `G6-B`, have matching NAND identification and physical partition maps. Their captured current HJL.L91 FIT files are byte-identical, including the **38,940-byte G6 DTB**. That supports a common current board description. It does not prove that every component or PCB revision is identical.

Their boot packages differ, however. The first router's `console=1` was set manually. Neither examined bootloader's compiled default environment contains that variable; a missing entry is a valid unset state. Binary comparison also found differences in the serial-policy code. An absent `console` variable therefore cannot diagnose a missing UART, and changing Linux firmware banks does not replace the separate bootloader package. The [two-router comparison](../two-g6-key-comparison/README.md) and [boot investigation](../boot-and-console/README.md) contain the detailed evidence.

The second router's inactive bank contains IJL.J03, while its captured active system is HJL.L91. That gives us another software build to compare, not a second CPU or radio inventory. Manufacturing dates, firmware version strings and retained U-Boot banner dates are insufficient to establish a physical board revision.

The remaining hardware questions are specific: PCB/component revision markings, a measured UART pinout and voltage, accessible debug pads, complete connector-to-MAC/PHY mapping, and the clock/reset/calibration dependencies needed to operate each peripheral independently. The [hardware evidence record](resources/hardware-evidence.json) preserves the source hashes, DT properties and distinction between published, observed and still-unverified details.

## Third-unit follow-up

A [third G6](../third-g6-comparison/README.md), G6-C, has the same RI hardware/part identifiers and programming date as the first, plus an identical full SSB. These are dump-derived comparisons; no third board teardown or chip-marking measurement was performed.

## What the ONT comparison does and does not identify

The XS-2426X-A provides another Cortina-platform firmware reference with
512 MiB NAND, 256 KiB eraseblocks, 4 KiB pages and the same twelve-partition
physical layout. Its DTB identifies the Cortina Venus/CA8289 family, while its
product image IDs and optical/board support remain specific to the ONT. This
is firmware and dump evidence, not a PCB/component inspection or proof that
the G6 and ONT have interchangeable boards, radios or power arrangements.
The ONT SSB differs from both G6 SSB groups despite retaining the same 2020.04
banner. [ONT hardware/storage provenance](../xs2426xa-24-03-comparison/README.md).
