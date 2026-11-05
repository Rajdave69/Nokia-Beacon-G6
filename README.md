# The Nokia Router Firmware -- Version 2024.xx


This project analyzes Nokia firmware of version `2024.xx`.

My research was based on the Beacon G6, but this applies to every Nokia router and ONT running on a 2024 firmware.

Consider this the base of my research. Supplemental work has been done, comparing 2024.xx firmware to 2025.xx firmware,
from my Beacon 9. You can find that on my other repository. 

Devices analyzed: Beacon G6, XS-2426X-A ONT, Beacon 9


Other similar projects: 
- [For the Nokia Beacon 1](https://spaceraccoon.dev/nokia-beacon-router-uart-command-injection/)
- [For the Nokia Beacon G3.1](https://thered0ne.com/?p=351)

In this project, I dive into the WebUI and open ports/services of the Nokia Beacon G6 router, with two aims:
1. (✅) Get superadmin access
2. (✅) Get root shell 

This project is very dear to me. While being my first real experience with offensive cybersecurity, 
I ended up finding an RCE, now CVE-2026-101323, and got my name into the 
[Nokia Hall of Fame](https://www.nokia.com/we-are-nokia/security/products/cvd/hall-of-fame/).



## Table of contents

### Tutorials

- [Access more WebUI Options](tutorials/more-webui-options/README.MD)
- [Setting the WebUI's superadmin password](tutorials/set-webui-superadmin-password/README.MD)
- [Enabling UART input safely](tutorials/enable-uart-console/README.MD)
- [Setting your own U-Boot `en` password](tutorials/unlock-uboot-en-console/README.MD)
- [Setting your own UART root shell password](tutorials/unlock-uart-root-shell/README.MD)
- [Persistent unauthenticated `uid=0,gid=0` Telnet using the early startup hook](tutorials/setup-persistent-unauthenticated-telnet/README.md)
- [Keeping a startup script across the G6 firmware banks](tutorials/setup-startup-across-firmware-banks/README.md)
- [Downloading firmware off-router without installing it](tutorials/download-firmware-without-installing/README.md)
- [Recovering a UART root shell from the stock U-Boot](tutorials/recover-uart-root-shell-from-uboot/README.md)
- [Dump the firmware (SSH and Telnet scripts)](tutorials/dump-firmware/)
- [Disabling automatic and manual firmware updates](tutorials/disable-firmware-upgrades)
## Checklists

### Post-jailbreak

1. [Dump the firmware (SSH and Telnet scripts)](tutorials/dump-firmware/)
2. [Enabling the Nokia Beacon G6 UART safely](tutorials/enable-uart-console/README.MD)
3. [Setting your own U-Boot `en` password](tutorials/unlock-uboot-en-console/README.MD)
4. [Persistent unauthenticated `uid=0,gid=0` Telnet using the startup hook](tutorials/setup-persistent-unauthenticated-telnet/README.md)
5. [Setting your own UART root shell password](tutorials/unlock-uart-root-shell/README.MD)
6. [Disabling automatic and manual firmware updates](tutorials/disable-firmware-upgrades)
7. [Setting the WebUI's superadmin password](tutorials/set-webui-superadmin-password/README.MD)

