# Following operator IDs through the Beacon G6's provisioning and accounts

## The same operator, different Linux accounts

The G6 and the newer Beacon 9 both reported `BOQA`, yet the G6 created a Linux ONTUSER account and the Beacon 9 did not. At first, operator-specific configuration looked like a possible explanation. Once we followed the account writers, that particular difference turned out to be compiled into the firmware. But the investigation left another question: which operator IDs do these images know about, and what changes when a different branch is selected?

I compared the G6's original ROM tree with the Beacon 9's extracted stock filesystem. The useful result was not just a list of four-letter codes. The firmware has several overlapping operator tables, and they control different things. Some IDs share a WebUI policy while choosing different provisioning rules; some rules keep factory credentials even though a password-generator name appears beside them.

The [operator change and rollback investigation](../changing-operator-id/README.md) traces the stock Linux setter guard and provisioning reset path.

## One field, several consumers

The first source was `/etc/configs/rbac/MapOpid.json`. It contains separate **Beacon** and **ONT** maps. Each maps an input ID to a WebUI role-policy directory. The WebUI's `web_customization_web_app.cgi` reads this file and chooses the hardware-family object using model/mode information, including `ETHMODE` and `PONMODE`. This is a permissions and customization lookup, not the password-generation dispatch table.

The second source was `/etc/preconfiguration_global.xml`. Despite the extension, neither copy was readable XML on disk. I decoded each with its firmware's security-engine library and `key3`, then decompressed the payload. The encrypted-payload CRC32 and the decompressed byte count both matched the container headers. That gave us a second, independent list of operator sections, aliases, and generation rules.

Finally, I followed selected comparisons in `dbgen_bin`, `libdbgen.so`, `cfgmgr`, `cfgcli`, and `/etc/init.d/opid_op`. These explain what actually consumes the selected policy. A directory, an XML rule, and a working account writer are three different pieces of evidence.

This comparison covers the G6 **`3FE49996HJLL91` / HJL.L91p01** image in `dumped-firmware/router-flash-G6-A/old/rom/rom` and the Beacon 9 **`3TN01100JJMK44` / JJM.K44p01** image extracted from the supplied p23 dump. It is a comparison of those builds, not a claim about every release or every unit sold under either model name. I have preserved the firmware's literal IDs rather than guessing a carrier name for each one.

## How many IDs did we actually find?

| Source                                                               | Beacon G6 | Beacon 9 |
|----------------------------------------------------------------------|----------:|---------:|
| Keys in the Beacon WebUI map                                         |       160 |      172 |
| Keys in the ONT WebUI map                                            |       161 |      173 |
| Distinct keys across those two maps                                  |   **162** |  **174** |
| Operator sections in decoded preconfiguration, excluding `GENERIC`   |       157 |      172 |
| Distinct comma-separated XML selector spellings, excluding `GENERIC` |   **181** |  **195** |
| Distinct ID spellings across the maps and XML                        |   **198** |  **213** |
| AdminUser policy directories                                         |        40 |       58 |
| NormalUser policy directories                                        |        39 |       57 |

These counts describe strings in different namespaces. They are not counts of distinct companies. For example, `SINGSG` is an XML alias in the G6, while the WebUI map contains `SINGG`. The XML also has longer aliases such as `AXTEMX`, `DUXXAE`, and `VZXXUS`; shortening every entry to four characters would lose evidence.

The [complete inventory](resources/operator-id-inventory.csv) records every literal selector, its XML section or sections, both WebUI targets, and whether an identically named role directory exists. It also lists the XML `fri` functions within each listed section, before inheritance or conditional filtering. Blank cells mean that the examined source has no explicit entry with that spelling; they do not establish that the firmware rejects that value.

There are **197 spellings common to both images** across the named maps and XML:

```text
0000 AHPC ALCL ALCO ANUY ARCL ATEB ATGF AXTE AXTEMX AXTEX BAGS
BAIS BATL BCAF BCXX BCXXA BCXXCA BGGL BIBT BMAG BNZL BNZS BOLT
BOQA BPPL BRAZ BRDS BRTI BRZL BSGS BSTL BSTO BTAM BTGF BTHA
BTUA BTXX BVES BVTR BWDS BWLN CHRA CHRB CHTX COCL DFNL DUXX
DUXXAE DUXXE EEAR EEEE EEER EENA EERG EGAM EGDU EGEA EGEB EGNZ
EHOC ENPC ENTB ENTBCO ENTBO EPRG EPRS EPST ETIS EZPC GDPC GDSL
GMAT GOMT GSHO GSPC GWDS GXPC HGEN HGXX HGXXHK HGXXK HKBN HKXX
HLPC HNPC IMSO ITAX ITPC ITPCIQ IUSA IUSAMX IUSAX JLPC JPDX JPNF
JPNT JPNX JPRF JPXS JXPC KAZA KAZAKZ KDIF KSFU LAOS LATT LEBG
LTRW MEGA MSNA MT2X MXXT MXXTMX MXXTX MXXV NBNF NBNX NKBB NKBC
NKBU NKNA NLEC NOKL NOKO NVGR NXLK OCIT OFIT ORFR ORGS PHCV
PHGL PHRA PNEC PRCL PSFU PTXX PTXXID PXSF SAIB SAKE SAXX SCPC
SHPC SHXX SIGH SING SINGG SLTM SRBJ STVE STXX STXXA STXXSA TEST
TIGO TKRG TKRGTR TKXX TKXXR TKXXTR TLAR TLKM TLPY TLSF TLXXMX TLXXX
TMMY TMTP TMUO TRCL TRUE TSAF UNGP VCSA VDQA VFGP VFNB VFSP
VFTK VFXX VIET VIVA VNPT VNQT VZXX VZXXS VZXXUS WLNP X000 XDSL
XXPA XXPC XXXX YNPC ZAIN
```

The G6 additionally has **`SINGSG`**, in the `SING` XML section's `n` attribute. That literal alias is absent from the newer XML; the four-character `SING` section and the WebUI key `SINGG` remain.

The Beacon 9 additionally has these **16 spellings** across the same sources:

```text
BACT BGMT BHRI BUKK BUUK BVQA FCIT FTXX
IGAR IGLC JPSN JPXX LDXX TLMU XXHE XXXI
```

Of those, **12 are new WebUI-map keys**: `BACT`, `BGMT`, `BHRI`, `BUKK`, `BVQA`, `FCIT`, `FTXX`, `IGAR`, `IGLC`, `JPSN`, `JPXX`, and `TLMU`. No G6 map key was removed. The newer XML adds 15 selector spellings, removes `SINGSG`, and adds 15 operator sections; a section moving within the XML is not a new ID.

There is a particularly useful mismatch: **`BUKK` appears in the Beacon 9 WebUI map and role directories, whereas the preconfiguration section is named `BUUK` and has `n="BUUK"`.** I found no explicit `BUKK` XML section or `BUUK` WebUI-map key. The inventory keeps them separate. Treating them as interchangeable would hide a possible integration inconsistency that this static comparison does not resolve.

Two other tokens deserve separate treatment. `GENERIC` is a provisioning baseline, not a carrier ID. `9999` is an additional sentinel compared by the legacy `cfgcli` reset path, not an entry in either map or XML. The CSV includes both with explicit kinds, giving **216 rows** in total rather than misreporting them as 216 operators. The directory scan adds no further spellings. Both builds lack a `NormalUser/PHGL` directory even though their ONT maps target `PHGL`; that mismatch is preserved too.

## A WebUI alias does not select the credential algorithm

The examined units use `BOQA`. In both maps, its Beacon entry selects the dedicated `BOQA` policy, while its ONT entry selects `ALCL`. By contrast, an ID such as `STXX` maps to `NKBB` in the Beacon table and `ALCL` in the ONT table, despite having its own provisioning section and a special account branch in `cfgmgr`.

The map therefore cannot be used to say that every ID resolving to `NKBB` has the same password or Linux accounts. The original operator ID is still available to the other consumers.

The existing keys whose mappings changed are:

| Input ID | G6 Beacon → Beacon 9 Beacon | G6 ONT → Beacon 9 ONT |
| --- | --- | --- |
| `BSTO` | `NKBB` → `BSTO` | `ALCL` → `ALCL` |
| `SIGH` | `NKBB` → `SIGH` | `ALCL` → `SIGH` |
| `SING` | `NKBB` → `SING` | `ALCL` → `SING` |
| `WLNP` | `NKBB` → `WLNP` | `ALCL` → `WLNP` |
| `LATT` | `NKBB` → `NKBB` | `ALCL` → `LATT` |
| `SRBJ` | `NKBB` → `NKBB` | `ALCL` → `SRBJ` |
| `TLAR` | `NKBB` → `NKBB` | `ALCL` → `TLAR` |

There are real permission differences behind these names. For example, the Beacon 9's `AdminUser/SING/Adminuser.json` omits authorization entries such as `upgrade_web_app.cgi` and `tr69_web_app.cgi?set_glb` that its `AdminUser/NKBB/Adminuser.json` includes. The `BSTO` profile adds entries for storage, port mirroring, and newer wireless controls relative to that same NKBB profile. Those are differences in shipped policy; they do not prove that every listed CGI or hardware feature works on a Beacon 9.

## The provisioning selector has another layer of conditions

`dbgen_bin` loads a generic baseline and then the requested operator policy. Its special `0000` path selects `X000` instead. The operator-section search reads the XML `n` attribute and uses a substring match; it is not a strict comparison against a four-character registry. Consequently, a missing literal alias in our inventory is not by itself proof of a missing runtime match.

After choosing a section, preprocessing can still filter individual rules. The XML contains conditions such as `onu="G-240G-E"`, `onu="G-240W-C"`, `meshONU="NokiaWiFiSeries_EasyMesh"`, and `oui="E03005"`. The code also reads `CountryID` into its preconfiguration context. An operator's section can describe several products and environments, so every rule under that section must not be assumed to run on the particular Beacon being examined.

This was especially visible in `STXX`. Both XML files contain a general `genpwd_longpasswd` WebAccount rule, but also `%8p` `genpwd_sha256_customized` overrides for specified ONU/mesh conditions. Its normal Account rules likewise include conditional `genpwd_wlanpasswd` variants. “STXX uses algorithm X” would discard those conditions.

The accompanying [account-policy extract](resources/operator-account-policy.csv) contains **2,323 rows across the two images**. It preserves the account-field rules, service enable flags, label-preservation setting, debug-override setting, XML paths, raw `dburi` attributes, and ancestor/field selector attributes. Some nested objects supply their URI through their parent, so an empty per-field `dburi` cell is not evidence of an unused field. Literal passwords are omitted. It is a static policy extract, not a dump of either router's current configuration or a complete export of networking defaults.

## The same password-rule name can keep a factory value

The most important shared branch was not a new cryptographic primitive. It was a decision about **which source to trust**.

Both libraries map recognized password fields to factory SECURITY entries:

| Recognized XML field | Factory source |
| --- | --- |
| `AccountPwd` | `EXT_WEB_PWD` |
| `WebAccountPwd` | `EXT_WEB_MGNT_PWD` |
| WLAN `PreSharedKey` | Band-dependent `EXT_SSID1_PWD`, `EXT_SSID5_PWD`, or `EXT_SSID9_PWD` |
| `ManagementServerPassword` | `EXT_ACS_PWD` |

The Beacon 9 additionally recognizes the field name `X_ALU_COM_SAEPassphrase` in this dispatch table and routes it to the WLAN class. That is a newer wireless-field consumer, not another Linux account.

Within this factory-selection helper, assuming the SECURITY record, operator fields, rule, and destination are usable, the source decision is:

```python
if current_operator_id == security_EXT_OPID:
    use_the_destination_specific_factory_value()
elif KeepLablePassword_is_true:
    use_the_destination_specific_factory_value()
else:
    use_the_rule_specific_factory_variable()
```

That last branch is easy to overlook. `genpwd_longpasswd` selects `EXT_MD5_VAR`, `genpwd_wlanpasswd` selects `EXT_SHA256_VAR`, and `genpwd_sha256_customized` selects `EXT_SHA256CUS_VAR`. The helper takes the requested prefix of the variable, then hashes it for the two management-account classes; the non-account classes use the selected text directly. These names identify stored inputs. They are not proof that this helper computes a bare MD5 or SHA-256 of the serial number.

The ordinary generation handlers and their initial/default values still exist around this helper. Missing SECURITY data or an unrecognized field can make the factory-selection attempt fail, so this pseudocode is not a replacement for every caller's fallback behavior. In particular, **false `KeepLablePassword` does not automatically mean “regenerate from the serial”**: the matching-operator branch comes first.

Both `BOQA` and `NKBC` explicitly enable `KeepLablePassword` in both XML files. The G6's `SING` section also enables it for the `G-240G-E` condition; that explicit rule is absent from the Beacon 9's revised SING section. On the examined BOQA devices, the factory `EXT_WEB_MGNT_PWD` hash matched Linux `superadmin` and the WebUI preset. Finding another operator's generator in the binary does not explain or recover that factory plaintext.

## What genpwd_longpasswd actually starts with

The many references to `genpwd_longpasswd` raised a reasonable question: was the factory superadmin password being generated locally after all? Following the initial value before the SECURITY override revealed a distinction between two similarly named mechanisms.

**The XML rule `genpwd_longpasswd` is not the library API `gen_varlen_mgntpw()`.** In the examined paths, the XML handler first takes the cached legacy management value from `gPreCfgInfo + 0xe0`. Initialization can fill that value from RI `LabelCode`. If a usable label code is present rather than the `00000000` sentinel, the OUI-processing step preserves it.

Otherwise, the `oui` preprocessing step calls `libdm_utility.so`'s `gen_mgntlongpw_and_wanpw()`. Its inputs are the selected XML `oui` value and an uppercase ASCII copy of RI `G984Serial`. Both BOQA sections explicitly supply `oui="D0542D"`; this value comes from the operator policy, rather than being read as the current unit's MAC address.

For an eight-hex-digit serial, the management fallback calculation is equivalent to:

```python
S = G984Serial.upper()                   # ASCII hex, for example "12345678"
O = operator_xml_oui                     # BOQA: "D0542D"
serial_decimal = str(int(S, 16))
digest = MD5((O + "-01" + serial_decimal).encode("ascii"))
value = int.from_bytes(digest[8:16], "big") % 10**10
legacy_management_password = f"{value:010d}"
```

There is no firmware-version string, programming date, PartNumber, `key2`, or `key14` in this calculation. The label-code path simply reuses a provisioned value; it does not recover how the label was originally chosen. The handler then makes the separate factory-selection attempt described above, which can replace either initial value with `EXT_WEB_PWD` or `EXT_WEB_MGNT_PWD`.

The same legacy helper also returns a WAN-password candidate. It computes a second MD5 digest over `O + "-ALCL" + S`, joins that digest to the first three bytes of the digest shown above, and Base32-encodes the 19 bytes using `ABCDEFGHIJKLMNOPQRSTUVWXYZ234567`. The observed wrapper copies the first 30 characters to its WAN output. The cached WAN value is used by `genpwd_wanpasswd`; both XML files select that rule for PPP-password fields in sections including `MXXT`, `TKRG`, `TRUE`, `MXXV`, and `EERG`. This establishes a local-generation path, not the credentials accepted by an external ISP's PPP server.

I checked an independent implementation against the original G6 and Beacon 9 ARM64 `libdm_utility.so` functions with four synthetic OUI/serial pairs on each build. Both the management and WAN outputs matched in all eight calls. No live accounts or factory values were changed.

The separate variable-length generation paths use other inputs: the raw-case ASCII `G984Serial`, security-database `key14` material, requested output length, and, for customized generation, the configured character set. Their callers also pass PartNumber as a context argument. Those API paths should not be substituted for the legacy formula merely because their names also contain “mgnt.” The G6's working Linux ONTUSER generator is different again: it uses `IMAGEVERSION` and embedded `key2`.

For the examined BOQA Beacon 9, these local-generation capabilities do not change the established live sources: root retains the ROM shadow hash, Linux superadmin matches the factory `EXT_WEB_MGNT_PWD` hash, and the changed current WebUI superadmin password remains separate from the factory preset. The many XML references show reuse of a policy rule; the final override and account writer determine the installed credential.

## Existing IDs whose account rules changed

Comparing the decoded account rules exposed changes that the WebUI map alone could not explain:

| Section | G6 rule or configuration | Beacon 9 rule or configuration |
| --- | --- | --- |
| `EGEB` | WebAccount password and preset use `genpwd_longpasswd`, `%12p` | Both select `genpwd_sha256_customized`, `%12p` |
| `WLNP` | Literal WebAccount password; preset uses `genpwd_longpasswd` | WebAccount password uses `genpwd_sha256_customized`, `%10p`; normal Account keeps `genpwd_longpasswd`, `%10p` |
| `BSTO` | WebAccount password and preset use `genpwd_longpasswd` | WebAccount password selects `genpwd_sha256_customized`, `%10p`; normal Account keeps `genpwd_longpasswd`, `%10p` |
| `BWLN` | Normal Account uses `genpwd_longpasswd`; WebAccount has a literal password | Adds a generated WebAccount password through `genpwd_sha256_customized`, `%10p` |
| `SRBJ` | Literal WebAccount password; preset uses `genpwd_longpasswd` | WebAccount password selects `genpwd_sha256_customized`, `%20p` |
| `SING` | Mix of manufacturing/RI lookups and model/OUI-specific reverse/SIGH rules | Disabled normal Account, enabled WebAccount named `adminadmin` with a literal password, and enabled `support` Telnet/SSH account using `SIGH_sn6telnetsshpwd` |

The SING Telnet/SSH rule is no longer restricted by the G6 XML's `onu="G-240G-E"` attribute. That is a meaningful policy change, although a configured account still needs an enabled service and a functioning account writer before it becomes a reachable login.

There are shared special algorithms too. `SIGH` retains separate reverse-password, SIGH account-password, and Telnet/SSH-password rules in both files. Both `libdbgen.so` implementations also special-case **`JPDX`** inside the customized SHA-256 generator, substituting an embedded 47-character alphabet for the ordinary configured character set. An operator can therefore change the generation path even when the XML function name is identical.

The 15 newly added Beacon 9 XML sections illustrate the range of policies rather than one universal new algorithm:

| New section(s) | Account-policy distinction in the newer XML |
| --- | --- |
| `BVQA` | Account and WebAccount both select `genpwd_longpasswd`, `%10p` |
| `BACT` | Account uses `genpwd_longpasswd`; WebAccount uses a `genssidfmt` template containing `%4M` |
| `BHRI` | Account and WebAccount use `genuserfmt` templates containing `%fs` |
| `FTXX` | WebAccount uses `genpwd_wlanpasswd`, `%16p` |
| `BGMT` | WebAccount uses customized SHA-256, `%12p` |
| `TLMU`, `XXHE` | WebAccount uses customized SHA-256, `%16p` |
| `BUUK` | WebAccount uses customized SHA-256, `%10p`; spelling differs from RBAC's `BUKK` |
| `JPSN`, `JPXX` | Include `genpwd_longpasswd` account rules with `%13p` |
| `IGAR`, `IGLC` | Normal Account uses `genpwd_longpasswd`; WebAccount has a literal password |
| `FCIT`, `LDXX`, `XXXI` | Their account password fields use literal/empty values rather than a `fri` password generator |

Here `%10p`, `%16p`, and `%20p` are the firmware's format strings, not promises about the length or plaintext of a final factory hash. The factory-selection branch, rule conditions, and later account copying still matter. The CSV retains the exact per-field context, including unusual field names, rather than silently repairing them.

Across the complete preconfiguration files, all **31** G6 `fri` names survive in the Beacon 9. The newer XML introduces **`default_wifi_pwd`** and **`mac_addr_hyphen_fmt`**, bringing its total to 33. They appear in the `GENERIC`, `BATL`, and new `BHRI` sections for MQTT/USP credentials, topics, and client identity fields. This extends provisioning behavior; it does not identify a new root-password generator. The inventory's function columns include wireless, WAN, voice, and TR-069 rules as well as account rules, so those consumers remain visible without treating every `fri` function as a Linux password algorithm.

## The operator branches that reach Linux account setup

The selected operator still matters after the database has been generated. Both `cfgmgr` boot routines contain recognizable comparisons against the following IDs:

| ID or group | Observed branch in both builds |
| --- | --- |
| `0000` | Returns before this normal account-setup sequence, including the dedicated debug-account call |
| `VIET` | Own WebAccount branch, using the current password member rather than the usual preset-password member |
| `TLSF` | Separate WebAccount/Account handling, including an explicit deletion of the WebAccount username after its setup attempt |
| `BTGF`, `PXSF`, `GDSL`, `XDSL`, `ATGF` | Grouped WebAccount setup using the preset-password member when the relevant account is enabled; BTGF additionally has an embedded fallback when the preset is empty |
| `ITAX` | Deletes the configured WebAccount and normal Account Linux users when the objects can be read |
| `STXX` | Can delete the Linux `root` account before installing the configured management user, when the WebAccount branch is enabled |
| Other IDs, including `BOQA` | Continue through the remaining account-enable and current/preset handling; no separate BOQA root-plaintext generator was identified |

These are conditional branches, not a guarantee that all accounts are installed on every boot. Object-read failures, account enable flags, and the separate Telnet/SSH-account object also affect the path. The `STXX` deletion is particularly good evidence that changing an operator ID can affect Linux access without computing a new root password.

The exact string in the management-account comparison is **`ITAX`**. It should not be rewritten as `ITXA`, or confused with separate code that tests selected character positions in an ID.

There are two small factory/reset paths outside that table. The identical `/etc/init.d/opid_op` scripts define `OP_0000()`, which touches `/tmp/en_telnet`, and `OP_NKBB()`, which prints its name. They construct `OP_${OperatorID}` dynamically but define no handler for every ID in the inventory. The marker alone is not proof that a Telnet daemon is listening. Separately, both `cfgcli` binaries compare `0000` and `9999` in a legacy reset path that invokes `/usr/exe/add_mgnt_user.sh` for ONTUSER; that script is absent from both examined ROM trees.

## NBNX explains the flag; it does not explain the missing Beacon 9 account

The decoded XML finally gave us an explicit operator-specific setting for the flag discussed in the earlier credential investigation: **`NBNX` sets `DebugRnPassEnable=true` in both images.** It is the only top-level operator section in either decoded file containing an explicit rule for that field. The similarly named `LimitAccount_ONTUSER` is much more common: 57 G6 sections and 64 Beacon 9 sections explicitly set it, always to true. BSTO loses its explicit assignment in the newer file, but the shared schema default remains true. The account-policy CSV records those assignments; none is evidence that the newer no-op will create ONTUSER.

Both schemas default `DebugRnPassEnable` to false and `LimitAccount_ONTUSER` to true. On the G6, the working debug-account routine first creates ONTUSER from `IMAGEVERSION` and deprecated `key2`, then uses the DebugRnPassEnable argument to decide whether to attempt an `EXT_DBG_PWD` factory-hash override. Thus an NBNX policy can select a different ONTUSER verifier source if it is applied and usable factory data exists. It does not select a different embedded key2 or turn account creation on for the first time.

On the examined Beacon 9, the corresponding normal updater is a 64-byte no-op. Its boot and settings-change callers survive, as do the schema, NBNX XML rule, version-derived generator, and factory field support. Passing a different operator ID or setting the debug flag does not restore the missing body of that routine.

That distinction prevents us from blaming the observed ONTUSER difference on BOQA policy: the examined G6 and Beacon 9 both use BOQA, and the decisive difference is the build's account-writer implementation. We have not established why Nokia removed that implementation from this build, or what other releases do.

## Operator policy across IJL and HJL

The [G6 policy comparison](../comparing-other-g6-routers/README.md) covers decoded IJL.J03 and HJL.L91. BOQA, EGEB, WLNP, JPDX and GENERIC subtrees are unchanged; five top-level operator sections are added and NBNX keeps its debug-override flag. Password-generation packaging moves from integrated cfgmgr code to standalone provisioning components, while native generic and legacy calculations agree. The [older/current role-map CSV](../../knowledgebases/g6-operator-role-comparison.csv) separately records changed role targets and removal of the old Gateway map.

## Vodafone policy across ONT builds

The Vodafone ONT uses factory `VDQA` and region `qa`. The examined Beacons use BOQA. Both ONT XMLs contain 156 sections and 180 literal
aliases. VDQA selects `genpwd_longpasswd%10p` for normalAccount and WLAN, and
`genpwd_sha256_customized%16p` for enabled WebAccount username `AdminGPON`.
Those are selected callback rules, not a demonstration of current plaintexts
or every later factory override. Both normal ONTUSER creators are implemented;
`DebugRnPassEnable` is evaluated after creation, and the factory debug field
is absent. NBNX remains the only section explicitly enabling that flag.

VDQA also changes between the two 24.03 builds: Inform interval 86400 to 60,
mesh false to true, DynamicbSTA added, TR69 trust true to false, and main WLAN
rules from WPA2/WPA3 AES to WPA/WPA2 TKIP+AES. These are captured recipe changes,
not live radio measurements. The saved OTA OUID is empty, selecting factory
VDQA; its high-priority WLAN-region flag selects qa. [Full policy rows](../xs2426xa-24-03-comparison/resources/operator-policy-summary.json) and [saved OTA scalar evidence](../xs2426xa-24-03-comparison/resources/ota-research.json).

## Where to find the evidence again

The two CSVs are deliberately shared comparison artifacts, so either repository's writeup can be read independently. The inventory is exhaustive for the literal keys/selectors in the named JSON/XML sources and role-directory names, with the additional traced `9999` sentinel. It is not an exhaustive audit of every operator comparison in every networking daemon, nor a manufacturer-issued operator registry.

These virtual addresses identify the inspected binary paths. They apply to the specific files above, not raw flash offsets or relocated process addresses:

| Evidence | G6 | Beacon 9 |
| --- | --- | --- |
| `dbgen_bin`: generic/operator loader | `0x409460` | `0xc2a8` |
| `libdbgen.so`: current OPID versus `EXT_OPID` comparison | `0xdbc4` | `0xfa40` |
| `libdbgen.so`: factory-value versus rule-variable branch | `0xdc34` | `0xfab0` |
| `libdbgen.so`: JPDX alphabet selection | `0x119c0`–`0x119dc` | `0x13a8c`–`0x13aa8` |
| `libdm_utility.so`: legacy management/WAN generator | `0x83b8` | `0x8c7c` |
| `cfgmgr`: `cfg_bootUser` start | `0x452dc` | `0x45754` |
| `cfgmgr`: STXX comparison / root-name argument | `0x45918` / `0x45934` | `0x45d88` / `0x45da4` |
| `cfgmgr`: dedicated debug-account updater | `0x6bb18`, working creator | `0x6d200`, no-op |

The preconfiguration containers provide compact independent checks on the decoded policy:

| Container check | G6 | Beacon 9 |
| --- | --- | --- |
| CRC32 of stored payload after the 20-byte header | `bf75ef96` | `05f7dcf7` |
| Decompressed bytes, including the terminal NUL | 2,610,364 | 2,955,106 |
| Top-level XML sections, including `GENERIC` | 158 | 173 |

For an exact source identity, SHA-256 fingerprints of the original files are:

```text
G6 MapOpid.json
4e7c63aab331cd213b81a88da4bb76b8a5c5559401f89e93558088902c1f3e8b
G6 preconfiguration_global.xml
e02ca619ef72432201eee6497fd77d57f1c2384103bb426112b6b54d50b7095f
G6 libdbgen.so
36fef7a1a243a655db218fdc1b76000b7a289c209ec255e0ff7d3e77fc1721e5
Beacon 9 MapOpid.json
1e9b1692b443cadb9756a370ae376613e743b89bdc1e0f66212a82c60ce18241
Beacon 9 preconfiguration_global.xml
dc4d4a6bf98b2c32bcba582f1afc8a42307c143ed3d813bd2d28212c59de1bc2
Beacon 9 libdbgen.so
a0d95d7b46ace69415681542a824e80c0f5adb796df77ea82ae2c649f556731c
```

The comparison reads firmware and policy files; it does not change either router's operator ID. No new operator profiles were applied to the live routers. Static rule differences explain possible execution paths, while the earlier live hash comparisons establish which credential stores were actually in use on the examined BOQA units.

The [configuration and provisioning investigation](../configuration-and-provisioning/README.md) follows the factory/current/preset stores, while the [credential investigation](../credential-reverse-engineering/README.md#the-flag-that-controls-the-factory-override) explains the G6 ONTUSER creator and debug override. The [credential map](../credential-map/README.md) keeps those Linux accounts separate from U-Boot's `en` verifier and the signed UART `Password2` response. None of the operator differences above establishes a universal root-password generator.
