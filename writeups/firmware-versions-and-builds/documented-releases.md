# Beacon G6: releases named in Nokia's documentation

I checked every one of the **76 release filters** returned by Nokia's public
WiFi Beacon documentation page on 26 October 2026. A family-wide release label
was assigned to this model only when the returned metadata contained a document
explicitly naming it.

This produced **18 distinct model-guide entries** under **21 release-filter
associations**. The table records documentary release names, document IDs and
issue dates. These are not downloaded firmware packages, build dates, or a
complete list of product image IDs. The listed model guides are locked in the
anonymous view; their contents were not downloaded.

| Release in model guide                                                                               | Document ID               | Issue | Document issue date |
|------------------------------------------------------------------------------------------------------|---------------------------|-------|---------------------|
| [26.03](https://documentation.nokia.com/pybin/doc_ctr.py?product_id=833-044763&release=BBD+R26.03)   | `3FE-49949-AAAA-TCZZA-18` | 1     | 2026-09-30          |
| [26.01](https://documentation.nokia.com/pybin/doc_ctr.py?product_id=833-044763&release=BBD+R26.01)   | `3FE-49949-AAAA-TCZZA-17` | 1     | 2026-04-02          |
| [25.04](https://documentation.nokia.com/pybin/doc_ctr.py?product_id=833-044763&release=BBD+R25.04)   | `3FE-49949-AAAA-TCZZA-16` | 1     | 2025-12-30          |
| [25.03](https://documentation.nokia.com/pybin/doc_ctr.py?product_id=833-044763&release=BBD+R25.03)   | `3FE-49949-AAAA-TCZZA-15` | 1     | 2025-10-10          |
| [25.02b](https://documentation.nokia.com/pybin/doc_ctr.py?product_id=833-044763&release=BBD+R25.02b) | `3FE-49949-AAAA-TCZZA-14` | 1     | 2025-07-29          |
| [25.01](https://documentation.nokia.com/pybin/doc_ctr.py?product_id=833-044763&release=BBD+R25.01)   | `3FE-49949-AAAA-TCZZA-13` | 1     | 2025-04-02          |
| [24.04](https://documentation.nokia.com/pybin/doc_ctr.py?product_id=833-044763&release=BBD+R24.04)   | `3FE-49949-AAAA-TCZZA-12` | 1     | 2024-12-31          |
| [24.03](https://documentation.nokia.com/pybin/doc_ctr.py?product_id=833-044763&release=BBD+R24.03)   | `3FE-49949-AAAA-TCZZA-11` | 1     | 2024-09-30          |
| [24.02](https://documentation.nokia.com/pybin/doc_ctr.py?product_id=833-044763&release=BBD+R24.02)   | `3FE-49949-AAAA-TCZZA-10` | 1     | 2024-06-28          |
| [24.01](https://documentation.nokia.com/pybin/doc_ctr.py?product_id=833-044763&release=BBD+R24.01)   | `3FE-49949-AAAA-TCZZA-09` | 1     | 2024-03-28          |
| [23.04](https://documentation.nokia.com/pybin/doc_ctr.py?product_id=833-044763&release=BBD+R23.04)   | `3FE-49949-AAAA-TCZZA-08` | 1     | 2023-12-29          |
| [23.03](https://documentation.nokia.com/pybin/doc_ctr.py?product_id=833-044763&release=BBD+R23.03)   | `3FE-49949-AAAA-TCZZA-07` | 1     | 2023-09-28          |
| [23.02](https://documentation.nokia.com/pybin/doc_ctr.py?product_id=833-044763&release=BBD+R23.02)   | `3FE-49949-AAAA-TCZZA-06` | 1     | 2023-07-05          |
| [23.01](https://documentation.nokia.com/pybin/doc_ctr.py?product_id=833-044763&release=BBD+R23.01)   | `3FE-49949-AAAA-TCZZA-05` | 1     | 2023-04-06          |
| [22.04](https://documentation.nokia.com/pybin/doc_ctr.py?product_id=833-044763&release=BBD+R22.04)   | `3FE-49949-AAAA-TCZZA-04` | 1     | 2022-12-30          |
| [22.03](https://documentation.nokia.com/pybin/doc_ctr.py?product_id=833-044763&release=BBD+R22.03)   | `3FE-49949-AAAA-TCZZA-03` | 1     | 2022-09-30          |
| [22.02a](https://documentation.nokia.com/pybin/doc_ctr.py?product_id=833-044763&release=BBD+R22.02a) | `3FE-49949-AAAA-TCZZA-02` | 1     | 2022-08-18          |
| [22.02](https://documentation.nokia.com/pybin/doc_ctr.py?product_id=833-044763&release=BBD+R22.02)   | `3FE-49949-AAAA-TCZZA-01` | 1     | 2022-07-04          |

## Reused guides and source spellings

The same guide can appear under several filters. These extra associations are
retained exactly as returned by the website; they are not additional binaries:

| Website filter | Release in the guide title | Shared guide ID |
| --- | --- | --- |
| `BBR R26.01z` | 26.01 | `3FE-49949-AAAA-TCZZA-17` |
| `BBD R24.03z` | 24.03 | `3FE-49949-AAAA-TCZZA-11` |
| `BBD R24.03a` | 24.03 | `3FE-49949-AAAA-TCZZA-11` |

The `BBR` spelling above is from Nokia's filter response. Its guide title says
26.01; I have not silently converted it into a separately verified firmware.

## Relating the list to our G6 dumps

Our captured IJL.J03p01 and HJL.L91p01 images identify the 24.02 and 24.04
platform trains. The 25.03, 25.04, 26.01 and 26.03 guide entries establish later
G6 documentation, but give no corresponding `3FE49996...` image IDs or package
hashes in the public metadata. The latest model guide found here is 26.03;
that is not a claim that we downloaded Nokia's newest G6 firmware.

Filters 24.03a/24.03z reuse the 24.03 guide. Other family filters with no explicit
G6 document are not asserted as G6 releases, and their absence is not proof
that Nokia has no corresponding package.

The [captured-build catalogue](README.md) keeps actual image IDs, hashes and
build metadata separately. The [account comparison](25.03-account-comparison.md)
explains why a shared release family does not prove identical ONTUSER behavior.
The [Beacon 9 companion repository](https://github.com/Rajdave69/Nokia-Beacon-9) (`writeups/firmware-versions-and-builds/documented-releases.md` in the research checkout) uses the same selection rule.

The [complete metadata index](resources/documentation-release-index.json) preserves all 76 filters, including
those without a model match, every selected document association and hashes of
all 77 protected raw responses. No locked PDF, software catalogue or firmware
package was obtained by this metadata scan. Document dates and release-filter
associations must not be substituted for actual firmware build provenance.

## Which documented releases have a captured image

The [captured-image list](README.md#the-firmware-we-recovered) includes the two G6 builds, the Beacon 9 build, and the JJL.K24p02, JJL.K67p02 and KJL.K50p01 ONT builds. The ONT captures supply 24.03 evidence for that model. The collection still has no captured G6 24.03 or 25.03 image. The portal associations above describe the original metadata snapshot.
