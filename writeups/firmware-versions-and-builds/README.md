# Sorting out the firmware versions and builds

This writeup is like a little database for the firmware dumps I have on hand, and a little bit
about what changes between them. For the entire list of firmware versions, you can look at 
[documented-releases.md](documented-releases.md)

The second Beacon G6 looked like a chance to find an older firmware. It was manufactured in December
2023, yet its WebUI reported the same version as the first G6: `3FE49996HJLL91`. Its running Linux 
files told the same story. The older build turned up when we read the other firmware bank in the 
NAND dump.

That gave us two different G6 builds to compare on the same model. A Beacon 9 and two VDQA
XS-2426X-A fibre ONTs added four more builds from related Nokia software releases. The device 
names below follow the [project's capture aliases](../README.md#device-aliases).

## How to read a Nokia firmware version

The same G6 firmware appears under several names. For the build running on all six captured G6s, 
these are the useful ones.

| Where it appears                                              | Example            | What it identifies                                                            |
|---------------------------------------------------------------|--------------------|-------------------------------------------------------------------------------|
| WebUI software version and `IMAGEVERSION` in `/etc/buildinfo` | `3FE49996HJLL91`   | The product image ID. Nokia's update service also uses this identifier.       |
| `SOFTWAREVERSION` in `/etc/buildinfo`                         | `HJL.L91p01`       | The dotted software label, including the `p01` suffix.                        |
| `HOMEOSVERSION` in `/etc/buildinfo`                           | `24.04.00`         | The broader software version. HomeOS is the field name used by the firmware.  |
| Package build paths                                           | `BBDR2404OpenWrtB` | The build branch, which ties this image to Nokia's BBD R24.04 release family. |
| `BUILDDATE` in `/etc/buildinfo`                               | `20241227`         | The day this particular image was built.                                      |

Nokia's documentation uses family labels such as **BBD R25.03**. Its security advisory spells the same family **BBDR2503**. A family can span multiple products and maintenance builds. The three ONT images below belong to R24.03, with build dates from November 2024 through September 2025.

The G6's `REPO` field says `master`, so we traced its BBDR labels through `/usr/lib/opkg/info/web.control`. The saved build path names `pullme_BBDR2402OpenWrtB` on the older image and `pullme_BBDR2404OpenWrtB` on the newer one. The [metadata catalogue](resources/versions-evidence.json) retains the original fields and package records.

## The firmware we recovered

A **firmware bank** is a slot in flash that holds a bootable image. The WebUI reports the running image. Reading both slots can reveal a previous build that is still on the device.

| Device | Product image ID | Software version | BBD release | Build date |
| --- | --- | --- | --- | --- |
| Beacon G6 | `3FE49996IJLJ03` | `IJL.J03p01` | R24.02 | 2024-07-02 |
| Beacon G6 | `3FE49996HJLL91` | `HJL.L91p01` | R24.04 | 2024-12-27 |
| XS-2426X-A | `3FE49940JJLK24` | `JJL.K24p02` | R24.03 | 2024-11-15 |
| XS-2426X-A | `3FE49940JJLK67` | `JJL.K67p02` | R24.03 | 2025-02-25 |
| XS-2426X-A | `3FE49940KJLK50` | `KJL.K50p01` | R24.03 | 2025-09-04 |
| Beacon 9 | `3TN01100JJMK44` | `JJM.K44p01` | R25.03 | 2025-11-13 |

All six G6s were running HJL.L91p01 when captured. G6-B, G6-D and G6-F retained IJL.J03p01 in bank 0. Both raw banks of G6-F match G6-B and G6-D byte for byte. G6-A, G6-C and G6-E had HJL in both banks. [Sixth capture evidence](resources/g6-f-capture.json). The HJL download from Nokia matched the saved kernel container, root filesystem and Wi-Fi firmware payloads, so it adds another source for the same build. The July 2024 date of the inactive image leaves G6-B's original shipping version unknown. [G6 capture comparison](../comparing-other-g6-routers/README.md) · [Nokia OTA downloads](../ota-firmware-downloads/README.md).

Both ONTs were running KJL.K50p01. ONT-A kept JJL.K67p02 in its other bank, while ONT-B preserved the earlier JJL.K24p02. Both Beacon 9 banks held the same compressed root filesystem. These comparisons cover the saved firmware bytes. Each unit also has its own factory data and writable configuration. [ONT comparison](../xs2426xa-24-03-comparison/README.md).

## What changed between builds

On the G6, R24.02 and R24.04 both report OpenWrt 19.07.3 and Linux 4.14.275. The full kernel package IDs differ, and several packages changed while those headline numbers stayed the same. EasyMesh went from 1.14.22 to 1.16.15, and the container runtime went from LXC 3.2.1 to 5.0.1. The bootloader has its own version history too. G6-A and G6-B run the same HJL image and show the same U-Boot banner, yet their U-Boot binaries differ. The G6 stores that bootloader outside the two Linux banks.

G6-B's differences show up in the boot code that passes console settings to Linux and in the LED definitions built into U-Boot. The other five G6 captures share one complete bootloader partition. Both ONTs share its executable code and device-tree settings, with 2 KiB less zero padding at the end of the device tree. The Beacon 9 uses a separate Qualcomm bootloader build. [Bootloader comparison](../secure-boot/README.md#comparing-the-saved-bootloader-variants).

The Beacon 9 sample changes both the release family and the hardware platform. It uses Qualcomm's SDK and Linux 5.4.213, while the G6 and ONT use Cortina's SDK. The normal `ONTUSER` creation routine is inactive in the captured Beacon 9 build and implemented in the earlier G6 and ONT-A builds. To find out whether the G6 changed in the same way, we would need a G6 image from the newer family. The ONT already shows that some mechanisms first noticed on Beacon 9 were present in R24.03. [Release and account comparison](25.03-account-comparison.md).

## What we know about a G6 on R25.03

Nokia lists the Beacon G6 in its CVE-2025-9974 advisory and says the fix shipped in BBDR2503 and later. Nokia's documentation also lists a G6 guide for R25.03. We have the guide's public listing, but we still lack the exact G6 image ID and a firmware file to inspect. The OTA queries in this project returned no newer downloadable G6 image for the tested profiles. The Beacon 9 capture belongs to the same release family, and the advisory does not list that model. [Nokia security advisory](https://www.nokia.com/we-are-nokia/security/product-security-advisory/cve-2025-9974/) · [Documented G6 and Beacon 9 releases](documented-releases.md) · [OTA query results](../ota-firmware-downloads/README.md).

If you're identifying another capture, start with the full `IMAGEVERSION` and `SOFTWAREVERSION`, then record which bank supplied them. The [capture checklist](new-capture-checklist.md) covers what else to save. Exact build fields, package versions, payload hashes, bootloader comparisons and tentative version leads are in the [research knowledgebase](../../knowledgebases/firmware-versions-and-builds.md).
