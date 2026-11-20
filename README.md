# Nokia HomeOS 24.xx firmware research

This repository is a guide to how Nokia’s residential gateways and fibre ONTs work on stock firmware. It started with the Beacon G6 and expanded to the XS-2426X-A, so the research can compare what two HomeOS 24.xx products share and what depends on their hardware, firmware build, or operator configuration.

A lot of the useful behavior is hidden behind a short label in the WebUI. A factory reset decides which files to clear and which provisioning data to preserve. A firmware upgrade can affect more than the Linux image. A change to network mode can move the management address. The project follows those decisions through the shipped software and tests them where suitable hardware is available.

The repository gives you three ways in. **Use a tutorial to do something, read a writeup to understand what happens, or open a knowledgebase to pick up the investigation with an LLM.** Each serves a different reader and carries a different level of detail.

## Contents

- [What you’ll find here](#what-youll-find-here)
- [Tutorials for working on a device](#tutorials-for-working-on-a-device)
- [Writeups for understanding the firmware](#writeups-for-understanding-the-firmware)
- [Knowledgebases for continuing the research](#knowledgebases-for-continuing-the-research)
- [Devices and firmware under study](#devices-and-firmware-under-study)
- [Tools, evidence and ongoing work](#tools-evidence-and-ongoing-work)

## What you’ll find here

| Where                                         | When to start there                                                               | What it contains                                                                                                                                                                                     |
|-----------------------------------------------|-----------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`tutorials/`](tutorials/README.md)           | You have a router and a specific task.                                            | Procedures tied to particular models and builds, with prerequisites, commands, and verification or recovery steps.                                                                                   |
| [`writeups/`](writeups/README.md)             | You want to understand a feature, an unexpected result, or a firmware difference. | Reader-facing explanations with diagrams or tables where useful. The index has task links and Simple, Intermediate, and Advanced sections.                                                           |
| [`knowledgebases/`](knowledgebases/README.md) | You want an LLM to continue research on an existing subject.                      | Dense technical records with exact paths, call sites, hashes, fixtures, negative results, scope limits, and links to the underlying evidence. This directory belongs to the local research checkout. |

## Tutorials for working on a device

The tutorials concentrate on operating the stock firmware. Read the scope at the top of the guide and check your own build and work mode before running its commands. The Beacon G6 has the most hands-on coverage.

### Set up and manage a Beacon

- [Set a stock Beacon G6 to AP mode](tutorials/set-ap-mode/README.md). Covers management address discovery, the working LAN uplink, and returning to router mode.
- [Understand router, WAN Bridge and AP modes](writeups/router-workmodes/README.md), including how their management addresses differ.
- [Recover WebUI access after changing a WAN service to Bridge](tutorials/set-ap-mode/recovery.md#recover-from-a-wan-service-set-to-bridge). Start here if clients obtain an upstream lease while the Beacon’s own page disappears.
- [Download an offered firmware image without installing it](tutorials/download-firmware-without-installing/README.md). Follow the availability reply and download the offered file from a workstation.
- [Disable firmware updates on the stock G6](tutorials/disable-firmware-upgrades/README.md). The guide identifies the covered update paths and records the offline validation limits.

### Capture firmware or recover access

- [Dump firmware over SSH or Telnet](tutorials/dump-firmware/README.MD). Use the [capture checklist](writeups/firmware-versions-and-builds/new-capture-checklist.md) to record the build, bank, and capture context alongside the files.
- [Recover a UART shell through the stock U-Boot](tutorials/recover-uart-root-shell-from-uboot/README.md). Requires access to the full U-Boot prompt and explains which stock-image recovery path was tested.
- [Keep a startup script across the known G6 banks](tutorials/setup-startup-across-firmware-banks/README.md). Describes the common caller and the storage conditions it depends on.

## Writeups for understanding the firmware

Start with [firmware architecture](writeups/firmware-architecture/README.md) for the relationship between the WebUI, the configuration model, and the services that apply settings. From there, [boot and console](writeups/boot-and-console/README.md) and [storage and flash](writeups/storage-and-flash/README.md) explain what runs at each boot stage and how firmware banks and writable configuration are stored.

The [writeup index](writeups/README.md) gives a fuller reading path. For a particular question, these pairs are useful:

- **Configuration and provisioning.** Read the [provisioning pipeline](writeups/provisioning-pipeline/README.md) to see how factory material and operator recipes become settings, then [configuration import and export](writeups/configuration-import-export/README.md) for the settings a WebUI backup can carry.
- **Updates and recovery.** Read [firmware validation and flashing](writeups/firmware-upgrade-path/README.md) alongside [slot rollback](writeups/firmware-slot-rollback/README.md). They explain what goes into an upgrade and what selecting an already-installed bank can recover.
- **Networks and applications.** Start with [uplink, VLANs and firewall ownership](writeups/uplink-vlan-firewall/README.md) for packet forwarding or [EasyMesh management](writeups/easymesh-management/README.md) for the Wi-Fi control path. [Telemetry](writeups/telemetry/README.md) and [application management](writeups/application-container-management/README.md) cover two other parts of the platform.
- **Differences across devices.** [Comparing G6 units](writeups/comparing-other-g6-routers/README.md) holds the model steady so build and factory differences are easier to see. The [XS-2426X-A comparison](writeups/xs2426xa-24-03-comparison/README.md) follows the same software into a different product.

For example, if you’re setting up an AP, start with the tutorial. If the Beacon gets no management address, the uplink writeup explains why DHCP can fail even when the physical WAN link is up. Its packet traces also show why adding the WAN-facing interface to the bridge was insufficient to make it a working extra LAN port.

## Knowledgebases for continuing the research

The knowledgebases are technical handoffs for LLMs. A subject keeps the details needed to reproduce or continue the work, including exact build and file identities, disassembly notes, test inputs and outputs, and what a failed attempt ruled out. The corresponding writeup gives the readable explanation. Its `resources/` directory usually holds the evidence files or helpers it cites.

For a new LLM session:

1. Open the [knowledgebase index](knowledgebases/README.md) and give the model the entry for the subject you want to continue.
2. Include the associated writeup for orientation and the [source-record index](knowledgebases/source-record-index.json) if the model needs to locate evidence. The [research state](knowledgebases/research-state.json) records corrections that matter when reading older material.
3. Tell the model the device, build, and question you’re working on. Ask it to distinguish firmware inspection, offline tests, and live observations before extending a conclusion or planning a new test.

A public clone can be read through the tutorials and writeups. The knowledgebases and original captures may be absent because they live in the local research checkout. Public evidence uses device aliases. Paths beginning with `private-source://` refer to material held locally and resolved through the private alias registry.

## Devices and firmware under study

| Device         | Captured release families and builds                | What it contributes                                                                                                                                           |
|----------------|-----------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Beacon G6**  | R24.02 `IJL.J03p01` and R24.04 `HJL.L91p01`         | The primary platform for firmware tracing and live checks. Six units provide examples of shared firmware, different bootloaders, and per-device provisioning. |
| **XS-2426X-A** | R24.03 `JJL.K24p02`, `JJL.K67p02`, and `KJL.K50p01` | Two Vodafone ONTs provide a cross-product comparison and several maintenance builds within the same release family.                                           |
| **Beacon 9**   | R25.03 `JJM.K44p01`                                 | A comparison from outside the 24.xx scope. It also changes hardware platform, so the evidence cannot assign every difference to the software release.         |

A release label such as R24.03 is different from the date a maintenance image was built. The [firmware inventory](writeups/firmware-versions-and-builds/README.md) explains the product image ID, software version, HomeOS version, and bank labels. The [companion Beacon 9 repository](https://github.com/Rajdave69/Nokia-Beacon-9) follows HomeOS 25.03 in more detail.

## Tools, evidence and ongoing work

The [network-services directory](network-services/README.md) brings together the WebUI research, the TCP 8099 notification client, and the TCP 37591 mesh messaging package. Start with the [external probing writeup](writeups/probing-from-outside/README.md) for the observed listeners and the evidence behind their identification.
