# Tutorials for Nokia HomeOS research

These guides explain how to carry out specific tasks on the devices and firmware studied in this project. Most hands-on procedures target the Beacon G6; each guide states its own prerequisites, build coverage and test limits. For explanations of how the firmware works, start with the [writeup index](../writeups/README.md).

## Jailbreaking checklist

Use this sequence as a navigation checklist for the documented Beacon G6 access and persistence work. Read each guide before starting: the steps have different prerequisites, and the first firmware dump requires an existing privileged shell over SSH or the documented Telnet route. If you do not yet have one, establish an authorized access path first; the checklist alone does not provide an initial entry method.

1. [Dump the firmware and flash partitions](dump-firmware/README.MD). Keep the capture and its metadata privately; the default dump omits some physical regions, and neither scope includes NAND OOB data.
2. [Enable the UART console](enable-uart-console/README.MD). The procedure changes the console setting and checks the existing secure-boot setting.
3. [Set your own U-Boot `en` password](unlock-uboot-en-console/README.MD). This is the separate gate for the full bootloader prompt.
4. [Set up persistent unauthenticated Telnet](setup-persistent-unauthenticated-telnet/README.md). This creates a root shell **without a login prompt**, intended for a controlled network. Its startup hook depends on the firmware build.
5. [Unlock a UART root shell](unlock-uart-root-shell/README.MD). This addresses the Linux `Password2` path, separately from U-Boot's `en` gate.
6. [Disable firmware upgrades](disable-firmware-upgrades/README.md). The documented lock covers specified stock G6 update paths and has offline validation; live boot and update behavior remain unverified.
7. [Set the WebUI superadmin password](set-webui-superadmin-password/README.MD). This changes the WebUI credential, not automatically the Linux account or bootloader credentials.

The [credential map](../writeups/credential-map/README.md) explains which prompt each credential protects. For the two captured G6 firmware banks, the [cross-bank startup guide](setup-startup-across-firmware-banks/README.md) explains the common hook and its limits. Keep off-device backups and a recovery path appropriate to the device before changing startup or boot settings.

## Networking and recovery

- [Set a Beacon G6 to AP mode](set-ap-mode/README.md), including the tested LAN-uplink arrangement.
- [Recover access after WAN Bridge or AP changes](set-ap-mode/recovery.md).
- [Recover a UART root shell through stock U-Boot](recover-uart-root-shell-from-uboot/README.md). Requires the full bootloader prompt; the documented shell boot and read-only configuration inspection have separate limits.
- [Keep a startup script across the known G6 banks](setup-startup-across-firmware-banks/README.md).
- [Use stock startup phase hooks](use-stock-phase-hooks/README.md).

## Firmware and WebUI

- [Download an offered firmware image without installing it](download-firmware-without-installing/README.md).
- [Expose additional WebUI options](more-webui-options/README.MD).
- [Capture checklist for a new firmware dump](../writeups/firmware-versions-and-builds/new-capture-checklist.md).
