# Asking Nokia for a firmware file without starting an upgrade

Device references use the [shared aliases](../README.md#device-aliases). Per-device source references, key-input values and service fingerprints in the accompanying resources are aliases; the private mapping is not published.

I wanted a newer stock image to compare with the G6 dumps. The automatic updater
already knew where to ask, but running it on the router would mix the research
with download, activation and reboot policy. Following its request builder gave
us a way to ask the same question from a workstation.

That worked: advertising the older G6 build obtained an official HJL.L91
package. It also established a limit. The downloaded payloads were identical
to our current dump, and country/version experiments exposed no newer image.

## What the stock updater actually does

The cloud route is handled by `swmgnt` and `libotaSwAgent`. It is separate from
TR-069 and TR-369, so disabling those agents does not by itself stop cloud OTA.
The useful discovery was that the updater's work happens in separate stages:

```text
Read the device's OTA profile
  -> POST a firmware-availability request to Nokia
  -> Receive a version, checksum and possibly a signed file URL
  -> Download that file
  -> Hand it to the vendor upgrade library
  -> Validate, write, activate and reboot
```

I reproduced the metadata request and ordinary file download on a workstation.
Neither operation needs to start `swmgnt`, invoke its activation path, contact
the router or select a firmware bank. The existing upgrade-disable controls
can remain in place while the workstation performs this research.

The rest of this writeup concerns the first three arrows. The actual writer,
signature policy and bank handling are covered in the
[firmware upgrade investigation](../firmware-upgrade-path/README.md).

## Building the request from the saved configuration

The endpoint in these captures is `https://swupd.wifi.nokia.com`. The relevant
configuration fields are under:

```text
InternetGatewayDevice.X_ALU-COM_Wifi.X_ALU-COM_SwMgnt.
  X_ALU-COM_Polling_URL
  X_ALU-COM_Client_Auth_Key
```

The latter is the OTA API key. Our two exported profiles contain the same
41-byte value, but that does not establish that every Nokia device shares it.
It is different from configuration-backup `key7_2`, firmware-decryption
`key18`, a WebUI password and the Linux account hashes.

The request body is a JSON array. For the root device, it has this shape:

```json
[
  {
    "model": "Nokia WiFi Beacon G6",
    "curswversion": "3FE49996HJLL91",
    "mac": "DEVICE_LAN_MAC",
    "sn": "DEVICE_SERIAL"
  }
]
```

Alongside `Content-Type: Application/json`, the client sends:

| Header | Where the examined client gets it |
| --- | --- |
| `x-api-key` | SwMgnt `Client_Auth_Key` |
| `operatorcode` | Nonempty OperatorUniqueID, otherwise factory OperatorID |
| `current-rgw-swversion` | Gateway image version |
| `rgw-sn` | Gateway serial number |
| `countrycode` | High-priority WLAN-region setting, otherwise factory CountryID |
| `isopctl` | Literal `N` in both inspected clients |

The body uses `DeviceInfo.ModelName`, `SoftwareVersion` and `SerialNumber`, with
the LAN-host-management MAC. The native version is the `3FE...` or `3TN...`
image ID. Substituting `HJL.L91p01`, `BBDR2503`, or just the product name is not
how the stock request is built.

For the G6 profile, OUID is BOQA and the owner's factory CountryID readout was
`eu`. Its saved high-priority region override is false. On the Beacon 9, OUID
is empty, factory BOQA supplies the fallback, and its enabled WLAN-region
override supplies `qa`. The QA suffix in an operator code is therefore not a
substitute for tracing the actual country getter.

## Reading the offer

The replies were JSON even though their HTTP Content-Type was
`application/octet-stream`. The top level contains `responseCode`,
`responseMsg` and `versions`. Each version entry can contain `model`,
`currentVersion`, `nxtMSVersion`, `fileServerURL`, `checksum`, `sn` and `mac`.

A successful HTTP request does not imply that an image was offered. All of
these were valid replies:

| Profile and advertised version | Result |
| --- | --- |
| G6 reporting its current `3FE49996HJLL91` | Target HJLL91; URL and checksum absent |
| Same G6 reporting the captured `3FE49996IJLJ03` | Target HJLL91, signed URL and MD5 |
| Beacon 9 reporting current `3TN01100JJMK44` | No target, URL or checksum |
| Same Beacon 9 reporting hypothetical `3TN01100JJMK31` | Still no offer |

Reporting the G6's archived version changed only this request. It did not
install IJL, change the router's saved version or request a particular target.
It asked what the cloud would offer from that starting point.

The `versions` array is an offer for the requested devices, rather than a
release-history catalogue. A no-offer response cannot establish the newest
Nokia firmware globally.

## What made an external download possible

The G6 reply supplied a URL for:

```text
https://ota.console.wifi.nokia.com/BOQA/3FE49996HJLL91
```

The real URL also had `Policy`, `Signature` and `Key-Pair-Id` parameters. Those
remain in the private capture. Decoding the policy showed one exact authorized
object, a 3,600-second validity window, and an IPv4 source range of
`0.0.0.0/0`. It was usable from the workstation rather than being tied to the
router's source address.

The CDN GET did not require an OTA API-key header or device-identity headers.
Its authorization was already in that signed URL. HTTPS certificate validation
was enabled, and redirects were refused.

Changing the filename would put the request outside the signed resource.
Keeping yesterday's URL also does not keep it valid. To obtain another release,
we still need an authorized offer or an actual package from Nokia/operator
release records. I found no arbitrary historical-version selector in this API.

## The firmware file we actually obtained

The download produced one genuine G6 distributable:

```text
3FE49996HJLL91.bin
Size:   48,500,632 bytes
MD5:    fc87c474793286273df44dafcc3b605f
SHA256: b15c4ac4ed141f744cca777713e578e652b68c61c1d030555978a788cbdbcac8
```

The MD5 matches the offer. The CDN's Last-Modified date was 2 May 2025, but the
inner metadata identifies the 27 December 2024 HJL.L91 build. Upload time and
firmware build time are different measurements.

The file ends with Nokia's `3RDP` wrapper directory. Its entries contain a
1,630-byte signature block, 116 bytes of customized-version metadata and a
48,498,842-byte plain firmware body. The inner body has `NOKIA` component
headers with tags, MD5s, lengths and offsets. Its components are `rootfs` and
`imginfo`; this particular file has no `boot` component.

The `rootfs` component is a compact UBI image containing the FIT/kernel and
DTBs, root filesystem and Wi-Fi firmware. Reconstructing those volumes and
trimming them to their declared used lengths gave exact byte matches with the
current G6 dump. This was another copy of our existing baseline, rather than
newer kernel, rootfs or Wi-Fi code.

These checks establish the source, transfer checksum and payload identity.
The embedded firmware signature has not been independently verified, and this
package was not flashed. No Beacon 9 distributable was offered or downloaded.
Its nonempty runtime `key18` would be relevant to examining an encrypted image
after obtaining one; it is not needed for an authorized CDN download.

## Trying country and version parameters

The first four requests were followed by 29 additional metadata experiments,
for 33 successful POSTs in the initial two phases. They caused no router operation. Only the
original G6 CDN GET was needed; later offers had the same captured checksum.

I tested `eu`, `qa`, `us`, `in`, `EU` and `QA` with the two G6 versions and the
current/hypothetical older Beacon 9 versions. All six country strings gave the
same result for each version. These are four geographical scenarios plus two
case variations, not six separate countries. The operator, API key, serial,
MAC, model and `isopctl=N` remained unchanged.

The country test was only an HTTP-header override. It did not run `ritool`,
write factory CountryID or change the Wi-Fi regulatory region. Country changes
alone exposed no additional firmware for these profiles; the experiment does
not establish that country is irrelevant to every Nokia deployment.

A further request advertised the G6 `3FE49996UMJ28` label seen in
[Nokia's Corteca presentation](https://nam.gettofastfaster.com/wp-content/uploads/sites/64/2024/08/Managed-Wi-Fi-with-Corteca-GTFF-2025-breakout.pdf#page=21). The service returned UMJ28 as target, but no URL or checksum.
Four more requests separated the gateway header from the device JSON version:

| Gateway version | Device version | Returned target | URL/checksum |
| --- | --- | --- | --- |
| UMJ28 | HJLL91 | UMJ28 | absent |
| UMJ28 | IJLJ03 | UMJ28 | absent |
| HJLL91 | UMJ28 | HJLL91 | absent |
| IJLJ03 | UMJ28 | HJLL91 | absent |

The table abbreviates the common `3FE49996` prefix. The returned target can
follow the gateway context without supplying a file. That could reflect target
selection or fallback behavior; the server implementation is unavailable.
It does not verify that UMJ28 is published, downloadable or appropriate for
these routers. The initial phase held BOQA fixed. Later tests below vary shipped operator
headers with the same owned identities; no serial/MAC fabrication or filename
enumeration was performed.

## What the documentation establishes about G6 BBD R25.03


Nokia's security advisory identifies BBD R25.03 as a fixed baseline for the G6. Nokia's documentation portal also lists the release, with access controls on the release notes and compatibility material. The public record does not map that release to a downloadable G6 image ID. None of the checked OTA profiles offered it. The Beacon 9 capture carries the same release family, but it cannot establish which components or account changes are in the G6 build. [Release inventory](../firmware-versions-and-builds/documented-releases.md), [Account comparison](../firmware-versions-and-builds/25.03-account-comparison.md), [Nokia advisory](https://www.nokia.com/we-are-nokia/security/product-security-advisory/cve-2025-9974/).

## Repeating the download separately from installation

From the G6 project directory, create a new private profile and ask for an offer:

```sh
python scripts/ota-firmware-download.py profile --config-json config-private/config_beacon_g6.json --country eu --out config-private/g6-writeup-profile.json
python scripts/ota-firmware-download.py query --profile config-private/g6-writeup-profile.json --reported-version 3FE49996IJLJ03 --out config-private/g6-writeup-offer
python scripts/ota-firmware-download.py inspect --offer config-private/g6-writeup-offer/offer.json
```

If it offers a file, download that exact object to a new destination:

```sh
python scripts/ota-firmware-download.py download --offer config-private/g6-writeup-offer/offer.json --out dumped-firmware/downloaded-firmware/g6-writeup-copy.bin
```

The helper's input is an already-decrypted flat JSON export. It does not accept
the encrypted `.cfg` directly, recover a missing OTA credential or solve backup
decryption. Once the legitimate profile is available, the HTTP request itself
needs no new root shell on the router.

`profile` and `inspect` work offline. `query` sends the saved API key and device
fields to Nokia. `download` fetches an already-offered URL into a new local
file, with a 256 MiB cap, Content-Length checking and MD5/SHA256 reporting. It
has no install, bank-selection, status-PUT or reboot operation.

The optional `--country-override` and `--gateway-version-override` record the
research inputs separately from the saved profile. `--reported-version` sets
both versions by default. The client refuses unexpected hosts, insecure URLs,
redirects and existing output files. It passed 16 isolated tests using synthetic
profiles and mocked HTTP; the real requests are recorded separately.

Raw offers can contain usable signed links, and profiles contain the OTA key
and device identifiers. Keep them under `config-private`. Unix files are created
with mode 0600; Windows privacy also depends on the directory ACL. A failed
transfer can leave a partial file with a manifest showing `complete=false`.

An ordinary router-side file download is possible in principle if it has a
usable signed URL and enough storage, but I tested the workstation route.
Starting the real updater to obtain a file is unnecessary and can proceed into
installation. Existing router cache leads include
`/logs/download_data_From_clould.txt`, `/logs/activate_data_From_clould.txt`,
`/tmp/ota_agent_data` and `/tmp/ota_acttime`; none was collected live here, and
cached URLs may already have expired.

The [download tutorial](../../tutorials/download-firmware-without-installing/README.md) contains the full command sequence.
The [complete knowledgebase](../../knowledgebases/cloud-firmware-downloads.md)
and [sanitized experiment evidence](../firmware-upgrade-path/resources/cloud-download/evidence.json) retain the exact formats,
all request outcomes, provenance, failures and validation limits. The
[version catalogue](../firmware-versions-and-builds/README.md) separates captured
images from documentary labels and OTA-only scenarios.

A review of the saved G6 writable captures found only HJL.L91 identifiers and
no firmware-URL lead. The raw log partition was not in those captures. The
[read-only cache inspector](../../scripts/inspect-ota-cache.sh) checks the known live cache/staging
files without starting an updater and prints image IDs and known Nokia paths
without URL query tokens. Its synthetic privacy checks passed; live output is
still needed to follow that separate lead.

## Regional offer coverage and public release records


Country, model, operator and installed-version fields help identify a request profile. Varying them in the recorded tests produced no newer G6 file and no Beacon 9 file. A successful empty response applies to that profile. The [request evidence](../../knowledgebases/editorial-evidence/ota-firmware-downloads.md) retains the specific request batches and their results. Nokia's public release records are catalogued separately in the [documentation inventory](../firmware-versions-and-builds/documented-releases.md).

## What the Vodafone ONT queries established

The XS-2426X-A uses the same availability service with its own model, the `VDQA` operator fallback and `qa` selected by its WLAN-region setting. Neither the current KJLK50 nor the inactive JJLK67 version produced an offer. The repeated current-version query gave the same 240-byte response. All three completed with HTTP 200 and responseCode 200, with no target version, checksum or URL. This establishes the result for the tested profile. Vodafone distribution over another management channel remains possible.

The live stock getter independently matched the packaged 41-byte API key used by all three requests and the effective polling URL. It also reported `OTA_enabled=false`. That flag controls device-side behavior and is absent from the workstation request. The supplied evidence does not tie it to the server's no-offer response. Native and reconstructed JSON fields matched under the configured fixture. The native serializer's whitespace and the HTTP client headers differed, and the prior TLS session and live mesh-cache state were unavailable. Equality of the effective key leaves the wrapped field's inner decoding unresolved.

Across the workstation campaign, 105 device-availability POSTs completed and one firmware CDN GET succeeded. The firmware was G6 HJL; the ONT returned no file. The 77 public documentation metadata requests are a separate count. [Request and loader evidence](../../knowledgebases/editorial-evidence/ota-firmware-downloads.md), [ONT profile and response summary](../xs2426xa-24-03-comparison/resources/ota-research.json).
