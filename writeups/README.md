# Beacon G6 research writeups

The writeups follow the firmware and explain what was verified, what was inferred and what remains unknown. The device alias scheme below is shared with the companion Beacon 9 project.

## Start with a task

| I want to…                                                           | Start here                                                                                                                                                                                                                                                                               |
|----------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Identify the hardware and the firmware in each bank                  | [G6 hardware](hardware/beacon-g6.md) and [firmware releases and builds](firmware-versions-and-builds/README.md)                                                                                                                                                                          |
| Recover the WebUI after changing a WAN service to Bridge             | [Recover access without UART or a reset](../tutorials/set-ap-mode/recovery.md#recover-from-a-wan-service-set-to-bridge)                                                                                                                                                                  |
| Recover a shell when the normal UART login path is unavailable       | [UART recovery through stock U-Boot](uart-recovery-from-uboot/README.md)                                                                                                                                                                                                                 |
| Use the G6 as a wired access point                                   | [Stock AP-mode tutorial](../tutorials/set-ap-mode/README.md) and [requirements for wired roaming](wired-ap-roaming/README.md)                                                                                                                                                            |
| Save what I need before changing firmware                            | [WebUI backup coverage](configuration-import-export/README.md#what-can-be-changed-and-what-remains-outside-this-backup), [NAND dump coverage](storage-and-flash/beacon-g6.md#what-the-saved-dumps-actually-contain), and [firmware slots and rollback](firmware-slot-rollback/README.md) |
| Understand what the router reports to an app or an outside collector | [Telemetry and reporting](telemetry/README.md) and [WebSocket notifications](app-websocket-notifications/README.md)                                                                                                                                                                      |

## Writeup index

### Simple

Start here to identify the hardware, read a firmware version, or understand what the stock router does.

- [Hardware across the captured devices](hardware/README.md)
- [Boot and console stages](boot-and-console/README.md)
- [Firmware releases and builds](firmware-versions-and-builds/README.md)
- [Publicly documented releases](firmware-versions-and-builds/documented-releases.md)
- [Comparing G6 units](comparing-other-g6-routers/README.md)
- [Factory reset](factory-reset/README.md)
- [Storage and flash layouts](storage-and-flash/README.md)
- [Beacon G6 USB storage and sharing](usb-storage-and-sharing/README.md)
- [Router, WAN Bridge and AP modes](router-workmodes/README.md)
- [Credential and account map](credential-map/README.md)
- [Telemetry and reporting](telemetry/README.md)
- [Probing the Beacon G6 from outside](probing-from-outside/README.md)

### Intermediate

Follow a stock feature, configuration workflow, or recovery path. These assume familiarity with the G6 shell or network settings.

- [WebUI configuration import and export](configuration-import-export/README.md)
- [Reading the stored configuration database](stored-configuration-database/README.md)
- [Firmware slots and rollback](firmware-slot-rollback/README.md)
- [Startup hooks and persistence](persistent-overlays/README.md)
- [Finding and downloading OTA firmware](ota-firmware-downloads/README.md)
- [Firmware architecture](firmware-architecture/README.md)
- [Diagnostics, supervisors and recovery](diagnostics-and-recovery/README.md)
- [Roaming between wired APs](wired-ap-roaming/README.md)
- [Stock access controls](stock-access-controls/README.md)
- [Wireless tools and radio state](wireless-tools/README.md)
- [ACI Wi-Fi optimizer](aci-wifi-optimizer/README.md)
- [EasyMesh management through ECD and apcloud](easymesh-management/README.md)
- [HomeAgent and Fonendoscope](homeagent-and-fonendoscope/README.md)
- [Application and container lifecycle](application-container-management/README.md)
- [UPnP discovery and gateway controls](upnp-management/README.md)
- [WebSocket notifications on TCP 8099](app-websocket-notifications/README.md) · [Python package](../network-services/port-8099/README.md)
- [Research methods and validation](research-methods/README.md)

### Advanced

Read the native firmware paths, security checks, driver behavior, or protocol formats and their test limits.

- [Secure boot verification](secure-boot/README.md)
- [UART recovery through U-Boot](uart-recovery-from-uboot/README.md)
- [Firmware validation and flashing](firmware-upgrade-path/README.md)
- [Factory data and password stores](configuration-and-provisioning/README.md)
- [G6 credential generation](credential-reverse-engineering/README.md)
- [Security key inventory](security-keys/README.md)
- [Provisioning pipeline](provisioning-pipeline/README.md)
- [Operator profiles and credential policy](operator-profiles-and-credential-policy/README.md)
- [Changing the operator ID](changing-operator-id/README.md)
- [WebUI and mobile app authentication](webui-mobile-app-authentication/README.md)
- [Beacon G6 Cortina hardware controls](cortina-hardware-controls/README.md)
- [Beacon G6 hardware offload and QoS](cortina-offload-and-qos/README.md)
- [Uplink, VLAN and firewall ownership](uplink-vlan-firewall/README.md)
- [IPv6 and multicast](ipv6-and-multicast/README.md)
- [Mesh optimizer messaging on TCP 37591](mesh-messaging/README.md) · [Python package](../network-services/port-37591/README.md)
- [Stock service provisioning](service-provisioning-from-superadmin/README.md)
- [Internal ubus management](internal-ubus-management/README.md)
- [The port 60980 WebUI client](webui-event-service/README.md)
- [Vodafone XS-2426X-A comparison](xs2426xa-24-03-comparison/README.md)
- [XS-2426G-B: looking back at R21.04 and R23.03](xs2426gb-21-23-comparison/README.md)

## Device aliases

These labels identify physical devices throughout the publication. They are arbitrary labels, not truncated serial numbers, MAC addresses or values derived from them. Aliases stay attached to the same unit when its firmware, bank or configuration changes. Firmware profile names such as `G6_HJL.L91` identify software, not another device.

| Alias   | Device examined       | Operator                | Captured software                                                                                      | Capture context                                                                                                   |
|---------|-----------------------|-------------------------|--------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| `G6-A`  | First Beacon G6       | Ooredoo, `BOQA`         | `3FE49996HJLL91` / `HJL.L91p01`                                                                        | Owner modified console/boot access and startup persistence; captures are not all factory pristine.                |
| `G6-B`  | Second Beacon G6      | Ooredoo, `BOQA`         | Active HJL.L91; inactive `3FE49996IJLJ03` / `IJL.J03p01`                                               | Owner installed a persistence script. Manufacture date alone does not establish the origin of the inactive image. |
| `G6-C`  | Third Beacon G6       | Ooredoo, `BOQA`         | HJL.L91 in both captured banks                                                                         | Owner reports changing only the LAN IP before the dump.                                                           |
| `G6-D`  | Fourth Beacon G6      | Ooredoo, `BOQA`         | Active HJL.L91; inactive IJL.J03                                                                       | Owner reports no changes before the dump.                                                                         |
| `G6-E`  | Fifth Beacon G6       | `BOQA`                  | HJL.L91 in both banks, running bank 0                                                                  | Whole SSB matches G6-C. The owner separately reported hardware secure boot enabled.                               |
| `G6-F`  | Sixth Beacon G6       | `BOQA`                  | Bank 0 IJL.J03, running bank 1 HJL.L91                                                                 | Both raw firmware banks match G6-B and G6-D.                                                                      |
| `B9-A`  | Beacon 9              | Ooredoo, `BOQA`         | `3TN01100JJMK44` / `JJM.K44p01`, HomeOS 25.03                                                          | eMMC capture and live diagnostics; owner changed mutable settings, including the WebUI superadmin password.       |
| `ONT-A` | XS-2426X-A ONT        | Vodafone, `VDQA`        | Bank 0 `3FE49940JJLK67` / `JJL.K67p02`; active bank 1 `3FE49940KJLK50` / `KJL.K50p01`; HomeOS 24.03.01 | Owner reports no changes before the dump; later read-only live diagnostics supplied separately.                   |
| `ONT-B` | Second XS-2426X-A ONT | `VDQA`, RI country `eu` | Bank 0 `3FE49940JJLK24` / `JJL.K24p02`; active bank 1 `3FE49940KJLK50` / `KJL.K50p01`                  | Offline capture.                                                                                                  |

The first through sixth G6s are `G6-A` through `G6-F`, respectively. Static dump evidence, owner-reported history and later live tests are separate observations. A shared result across these samples is not proof for every unit or firmware release. No G6 25.xx image has been obtained in this collection.

## Reading the evidence

Some links lead to the local research worktree. Git intentionally excludes the knowledgebases, selected WebUI research files, and ONTUSER research tutorial from a standalone public clone. The public writeups retain the main conclusions and cite the supporting paths.

From the project root, run `python3 scripts/check-publication.py` to check local public links, path case, heading anchors, writeup index coverage and common sensitive literals. On the research workstation, add `--private` to verify local research links and look for registered device identifiers. Reports show file and line without echoing the detected value.

- `private-source://SOURCE-…/filename` identifies a source retained locally. Named profile/capture references such as `private-source://PROFILE-G6-HJL/usr/lib/opkg/info/example.control` retain relative filenames under a privately mapped root. It is an opaque reference, not a download URL or the literal pathname on the research workstation.
- `G6-A:RI-G984Serial` and equivalent labels identify a unit's RI serial input. `PROGDATE-A` and similar tokens identify programming-date inputs; equal tokens mean equal original values. Neither is a usable input to a key derivation function.
- `DIGEST-…` labels replace device-specific service-key fingerprints and selected private-capture digests. Equal labels preserve equality comparisons. JSON names ending in `_alias` explicitly distinguish these labels from actual SHA-256 values or serial/date inputs. SSH file-byte comparisons remain distinct from canonical public-key comparisons.
- Model and part numbers, firmware releases/builds, operator codes, binary offsets, generic networking constants and shared stock-firmware/trust-key hashes are retained where they explain a finding.

Actual serials, exact RI inputs, source paths and withheld digests belong in the local `README.private.md`, which is ignored by Git. Original source verification requires that mapping and the private captures. The key-inventory validator resolves aliases locally; copying an alias into a router command will not recover the original input. Example decode commands use shell variables for the owner's own RI values.

Resources use the same alias policy as the articles. Repeated aliases preserve equality across captures. The original inputs and firmware sources stay in the local private registry.
