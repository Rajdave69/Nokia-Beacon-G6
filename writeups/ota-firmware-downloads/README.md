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

## Following the documented G6 BBDR2503 release further

The next investigation confirmed a G6/G6_2 BBD25.03 product-guide entry in
[Nokia's public documentation listing](https://documentation.nokia.com/pybin/doc_ctr.py?product_id=833-044763&release=BBD+R25.03).
Its document ID is `3FE-49949-AAAA-TCZZA-15`. The 25.03 compatibility matrix is
`3TN-01670-BAAA-TQZZA-01`. The metadata is public, while the documents themselves
are marked as requiring entitlement. Nokia's fixed G6 release is documented;
our missing binary should not be confused with a nonexistent release.

I also made seven more normal availability requests. Four compared native
`isopctl=N` with a request-only `Y` value. The N control still offered the
captured HJL package from IJL; Y returned the reported version without a URL.
Three mixed-model requests used the actual saved G6 and Beacon 9 identities as
a hypothetical gateway/peer pair. None offered another file.

With Beacon 9 as gateway, a G6 result even carried the gateway's
`3TN01100JJMK44` target with no URL/checksum. That is not a G6 firmware image ID
or a cross-model upgrade offer. It shows why a target string alone cannot serve
as a firmware catalogue.

At that stage the research comprised40 OTA metadata POSTs and the original
one CDN GET. This follow-up made no additional download or router operation.
The next useful source is the entitled compatibility/package mapping, a Nokia
or ISP-provided file/link, or the owner's operator firmware catalogue. The
[version catalogue](../firmware-versions-and-builds/README.md) records the exact
public document leads separately from the five captured builds, including the
ONT's two 24.03 maintenance images.

## Repeating the download separately from installation

From the G6 project directory, create a new private profile and ask for an offer:

```sh
python scripts/ota-firmware-download.py profile --config-json config-private/config_beacon_g6.json --country eu --out config-private/g6-writeup-profile.json
python scripts/ota-firmware-download.py query --profile config-private/g6-writeup-profile.json --reported-version 3FE49996IJLJ03 --out config-private/g6-writeup-offer
python scripts/ota-firmware-download.py inspect --offer config-private/g6-writeup-offer/offer.json
```

If it offers a file, download that exact object to a new destination:

```sh
python scripts/ota-firmware-download.py download --offer config-private/g6-writeup-offer/offer.json --out config-private/downloaded-firmware/g6-writeup-copy.bin
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

## Broader regional requests and the public release index

The subsequent 62-request experiment tested 24 more country values on the G6,
12 Beacon 9 country scenarios, two controls and eight shipped operator-code
values. The actual saved device identities stayed fixed. All replies were 200;
BOQA G6 scenarios still offered the captured HJL checksum, and the alternate
operator scenarios had no offer. No new image was downloaded. All requests
originated from this workstation, so country-header scenarios are not actual
measurements from those countries or proof of enrollment in another rollout.
That regional phase ended at 102 availability POSTs and the original one CDN GET;
the ONT follow-up below adds two POSTs.

The [public model-specific release list](../firmware-versions-and-builds/documented-releases.md)
now records newer G6 documentation through 26.03 and Beacon 9 documentation
through 26.01a. This is stronger information about documented releases than the
current assigned offer, but still supplies no product image ID/download URL for
the newer packages. The [25.03 account comparison](../firmware-versions-and-builds/25.03-account-comparison.md)
keeps shared release labels separate from compiled ONTUSER behavior.

## Vodafone ONT availability check, 27 October 2026

I traced the Vodafone XS-2426X-A's own `swmgnt` and `libnal` code, then read
its saved scalar settings with the stock `libdmdb` parser under QEMU. The model
is `XS-2426X-A`, not a Beacon model string. Empty OperatorUniqueID selects the
factory `VDQA` fallback. The high-priority WLAN-region setting selects `qa`.
Its saved cloud-OTA enable flag is false; the workstation query does not alter it.

The saved API-key field is a 76-byte individually wrapped string. The queries
used the ONT's own 41-byte packaged GENERIC default, which matches the earlier
G6/Beacon 9 key. That is an explicit profile-source limitation: the saved wrapped
value was not independently decrypted and equated with the packaged default.
Serial and LAN MAC came from the saved getters and agree with redundant RI.

After separate explicit approvals, I made these two normal metadata requests:

| Reported ONT image | HTTP / responseCode | Next version | File URL / checksum |
| --- | --- | --- | --- |
| Captured current `3FE49940KJLK50` | 200 / 200 | null | absent |
| Actual inactive `3FE49940JJLK67`, request override only | 200 / 200 | null | absent |

Neither reply offered a file, so no ONT download was possible. The result does
not identify the latest firmware globally or exclude Vodafone delivery through
ACS, OMCI or another operator channel. No router, updater daemon, status PUT,
bank switch, install or reboot was involved. The cumulative device availability
count is now 104 POSTs; the one earlier G6 firmware CDN GET remains the only
firmware download. Public documentation metadata requests are counted separately.

[Source traces, parser scope and sanitized replies](../xs2426xa-24-03-comparison/resources/ota-research.json).

## Repeated ONT availability request, 28 October 2026

The owner requested another simulated router availability query. The existing
client sent one completed POST to `https://swupd.wifi.nokia.com` with model
`XS-2426X-A`, current/gateway version `3FE49940KJLK50`, `VDQA`, `qa`, `isopctl=N`,
the unchanged owned ONT serial/MAC and the same packaged API default used
previously. No model, country, operator or version override was applied.

Nokia returned HTTP 200 / responseCode 200 and “Request processed successfully”,
with null next-version, checksum and download URL. The 240-byte raw reply is
exactly equal to the prior current-version reply. No firmware was downloaded.
The later owner-supplied v2 getter result confirms the effective API key and
URL match this profile. This run alone reproduced the traced fields; complete
native wire equality is separate.
HTTP success does not establish enrollment, an assigned firmware image or a
global newest release.

The first WSL attempt exited with URLError without an HTTP response or saved
result. Separate probes resolved the hostname in both runtimes; WSL timed out
during TLS handshake, while Windows verified TLSv1.3. The unchanged query then
completed using Windows Python. The probes sent no HTTP request or credentials.
The failed first attempt is not another no-offer reply; its exact failure stage
was not saved by the CLI. Certificate verification stayed enabled.

Current totals: 105 completed device availability POSTs, one additional failed
transport attempt in this run, one previous firmware CDN GET and no new GET.
The 77 public documentation metadata POSTs remain separate. Earlier reports
showing 104 completed requests are historical snapshots. Router services,
configuration, firmware banks and flash were not touched.

Exact request shape with identifiers/credential withheld, private raw-response
and reconstructed-request provenance, timestamps, failure details and limits
are in the XS comparison resource `ota-native-format-retry-20261028.json`.

## Native request equivalence review, 28 October 2026

The previous query was not an exact native reproduction. The original ONT
`swmgnt` payload/header functions were executed offline with a deliberately
injected copy of the saved current profile. Original daemon main, configuration
IPC, command execution and network I/O were not run. Stock function output
confirms equal JSON values but different bytes: 102-byte compact workstation
body versus 120-byte formatted native body, with corresponding content-length
102 versus120. Seven explicit header values match given the injected inputs.
The injected API key is not an independent credential verification.

A separate native cJSON probe agrees with the native function body exactly.
The native producer returns strlen+1; its caller recomputes strlen, so the
transmitted native read callback excludes NUL. Offline Windows fake-socket
reconstruction additionally identifies urllib User-Agent/Accept-Encoding/
Connection headers. It is not an original packet capture, and the builder
harness does not reproduce libcurl automatic headers or TLS negotiation.
Native source-port options47791/range16 and four reply-accept iptables calls
were also traced; all commands were intercepted in the harness. None of these
observed differences has been established as the no-offer cause.

At this stage the credential check was pending; the successful v2 live result
below now confirms the effective API key and URL.
`check-ont-ota-request.c` uses cfg_getObj(oid599,size0x8c5,flags0x1000), the same
call used by nal_getSwAutoUpgradeInfo, and reports only key length, key/URL
match flags, return status and enable flag. A 72-byte private comparison file
contains lengths and SHA256 digests. Stock output is suppressed; AF_UNIX for
local cfgmgr IPC is allowed; exported Internet socket/process functions are
blocked. The helper requires only GLIBC_2.17. Six synthetic cases pass but no
live output has yet been received. This verifies equality of the getter's
returned bytes, without assuming they are already decrypted.

The native packaged INI parser independently agrees with Python's 64-byte
key7. Twelve raw NAND scans found no HTTP API-key header/plain key7 assignment;
a working-file-name scan found se.conf but no sedb.conf name. These limited
negative scans do not establish missing material or exclude compressed/journal
recovery. Runtime peer entries can also change the native payload; zero peers
were injected for this controlled comparison, not measured on the live ONT.

Full sources, offsets, fixture/interception scope, positive/negative results,
loader/getter failures and private provenance are in the XS resources
`ota-request-equivalence-20261028.json` and `ota-request-equivalence-README.md`.
No new external availability query was sent; totals remain105 completed POSTs
and one earlier firmware CDN GET. The later v2 live helper comparison below confirms the key and URL.

## Effective ONT OTA credential verified live, 28 October 2026

The owner ran `check-ont-ota-request-v2` on the actual XS-2426X-A and reported:

```json
{"cfg_getObj_status":0,"key_bytes":41,"key_matches_requested_default":true,"url_matches_requested_profile":true,"OTA_enabled":false}
```

The helper exited0. This independently confirms that the stock getter's
effective41-byte API key equals the packaged default used in all three
completed ONT availability queries. Its effective polling URL also matches.
The helper uses the exact oid599/size0x8c5/flags0x1000 call used by
nal_getSwAutoUpgradeInfo. The expected72-byte file contains lengths and
SHA256 digests, and its bytes reproduce from the unchanged private profile.
Only status, length and match booleans were printed. No live credential bytes
were sent back to the workstation. Earlier statements that effective credential
equality was unverified or pending are superseded by this owner result.

The first helper's silent exit127 was a build error. A reproduction with the
ONT's original glibc2.27 showed that v1 incorrectly expected dlopen/dlsym in
libc.so.6 because the modern build host merges libdl into libc. The ONT supplies
them through separate libdl.so.2. stderr had already been redirected when lazy
resolution failed, hiding the message. v2 explicitly links the target libdl,
keeps GLIBC_2.17 requirements with correct provider attribution, binds symbols
before output suppression and adds a15-second stage-specific timeout. Eight
synthetic cases pass with the exact stock loader/libc/libdl/crypto; an additional
real-library test without router cfgmgr returns an explicit getter error rather
than disappearing. The owner's successful run is separate live evidence.

This resolves the effective-key input question. It does not independently
decrypt the saved76-byte ealgo=sab/ckn=key7 blob or establish how cfgmgr obtained
its current effective value; those remain distinct reverse-engineering work.
The prior request remains non-identical at the byte/transport level because
of compact102-byte versus native formatted120-byte JSON and client headers.
Its JSON values agree with the native fixture, and credential substitution is
no longer an unresolved caveat for that profile. The native mesh-cache state
and entire historical TLS session were not captured.

OTA_enabled=false is a confirmed live setting, but the enable flag is absent
from the external availability request. It is not established as the direct
cause of a no-offer response. The no-offer is for the tested VDQA/qa profile
with a now-verified effective key/URL; it is not proof of global firmware
availability or the operator's delivery policy. No new cloud request was made.
Totals remain105 completed device availability POSTs and one earlier CDN GET.

Exact owner output, v1/v2 binaries and sources, runtime provenance, failure
reproduction and validation scope are retained in the XS resources
`ota-request-comparator-owner-live-result-20261028.json` and
`ota-request-comparator-v2-fix.json`. The active helper source and instructions
are `check-ont-ota-request-v2.c` and `ota-request-equivalence-README.md`.
