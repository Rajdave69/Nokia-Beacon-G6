# Probing the Beacon G6 from outside

Before examining the firmware, I wanted to see what the Beacon exposed to another device on its network. The WebUI was the obvious entry point, but several other services were listening on the same address. A physical UART connection gave me another view of the router as it started.

## Scanning the LAN address

I scanned the Beacon from another machine on the LAN:

```sh
nmap -p- -sV -O 192.168.18.1
```

The address was the Beacon’s LAN address in this setup. `-p-` selected TCP ports 1–65535, `-sV` asked Nmap to identify the services, and `-O` requested operating-system detection. The retained excerpt contains these open-port rows. It does not include the OS detection result. [Nmap port selection](https://nmap.org/book/man-port-specification.html), [service detection](https://nmap.org/book/man-version-detection.html), [OS detection](https://nmap.org/book/man-os-detection.html).

| Port      | Nmap service and version              | What I found                                                                                               |
|-----------|---------------------------------------|------------------------------------------------------------------------------------------------------------|
| 22/tcp    | `ssh` - Dropbear sshd, protocol 2.0   | An SSH listener. The banner alone does not identify which accounts can log in.                             |
| 80/tcp    | `http` - thttpd                       | The WebUI over HTTP.                                                                                       |
| 443/tcp   | `ssl/http` - thttpd                   | The WebUI over HTTPS.                                                                                      |
| 8099/tcp  | `http`                                | A WebSocket notification service used by the mobile app. A separate listener check identified `websocket`. |
| 37591/tcp | `unknown`                             | Nokia’s mesh optimizer messaging. A separate listener check identified `ai_controller`.                    |
| 49152/tcp | `upnp` - Portable SDK for UPnP 1.6.20 | A UPnP HTTP listener. A separate G6 check identified `ndk_upnpd`.                                          |

The last column combines the scan with separate process and firmware analysis. Nmap could see something listening on 37591, but its probes did not identify the protocol. Following the service into the firmware showed an optimization agent and controller exchanging measurements and scan instructions. The [mesh messaging writeup](../mesh-messaging/README.md) explains the protocol and the Python package built to work with it.

Port 8099 also needed a closer look. The service uses a WebSocket connection, which starts with an HTTP upgrade. It supplies a live stream of device, Wi-Fi and mesh notifications to authenticated clients. The [WebSocket writeup](../app-websocket-notifications/README.md) follows the connection and the events it can carry.

The UPnP result includes a Linux 4.14.275 string in the service response. In a separate G6 observation, the UPnP service used SSDP discovery on UDP 1900 and advertised an HTTP endpoint on TCP 49152. Its configured listener can select a port dynamically. The [UPnP investigation](../upnp-management/README.md) follows discovery and the available actions.

An `open` result describes what the scanner reached from that LAN client. A guest client, an IPv6 client, and a host on the WAN side can encounter different listeners or firewall rules. This TCP scan leaves UDP services to be checked separately. [Nmap port states](https://nmap.org/book/man-port-scanning-basics.html).

## Following the WebUI requests

Ports 80 and 443 gave me a way to observe the router while using its interface. The browser loads a JavaScript application from the web server. As I moved through the pages, the application made GET and POST requests to `.cgi` endpoints for status and configuration.

An endpoint name made a starting point for following a setting into the firmware. The CGI can read Nokia’s configuration model or hand a change to the service responsible for applying it. On the ordinary protected path, shared CGI code checks the session and the permissions associated with the user’s role and operator profile. The [WebUI and mobile-app authentication writeup](../webui-mobile-app-authentication/README.md) follows those checks.

The browser code also handles encryption. The inspected login bundle contains a nonce-based hash challenge path. Some forms use an application-layer wrapper: the browser encrypts the payload with AES-CBC, then wraps the AES key and IV with the router’s RSA public key. HTTPS protects the connection when the browser uses port 443, while the CGI’s session and role checks decide whether to accept a request.

The [WebUI research directory](../../network-services/webui/README.MD) contains the captured JavaScript bundles, endpoint notes and payload format. The [firmware architecture writeup](../firmware-architecture/README.md) follows a request beyond the CGI into the services that apply it.

## Connecting to UART

The UART connection produced boot messages, so the serial pins were working. The [initial capture](initial-uart.txt) showed why the console did not become interactive:

```text
serial_enable = 0
>>>>>>>> Serial console Disabled <<<<<<<<
```

The kernel command line in that capture included `serial_is_dis=1`. The examined bootloader uses a `console` environment setting to decide whether to expose the serial interface. After I enabled that setting, Linux received `serial_is_dis=0` and I could interact with the boot process.

Interrupting autoboot led to `NOKIA >`, which provided a small command set. Its `en` command requested a password before granting access to the full `VENUS#` U-Boot prompt. After Linux starts, the serial interface can instead reach Nokia’s `Cortina#` CLI, whose shell command has its own `Password2` check.

The [boot and console writeup](../boot-and-console/README.md) follows each stage, the stored U-Boot verifier and the Linux-side Password2 check. It also covers the captured bootloader differences.

The scan excerpt does not identify the exact firmware build, physical G6 alias or mesh role. The linked listener observations and firmware traces identify their own scope.
