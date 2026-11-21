"use strict";
(self.webpackChunknokiawifi = self.webpackChunknokiawifi || []).push([[611], {
    8611: ($, h, A) => {
        A.d(h, {k: () => Z});
        let c = (() => {
            class u {
                static #t = this.API_ENDPOINT = "https://192.168.18.1";
                static #e = this.DEFAULT_IPADDRESS = "0.0.0.0";
                static #r = this.CLASSD_SUBNETMASK = "255.255.255.255"
            }

            return u
        })();
        var g = A(3802), z = A.n(g), p = A(4438), S = A(4493);
        let Z = (() => {
            class u {
                constructor(t) {
                    this.constants = t
                }

                maskIPAddressValidation(t) {
                    const e = t.trim();
                    if (!e || !/^(\d{1,3}\.){3}\d{1,3}$/.test(e)) return !1;
                    const r = e.split(".");
                    for (const a in r) if (r[a] < 0 || r[a] > 255) return !1;
                    const s = a => (parseInt(a, 10) + 256).toString(2).substring(1),
                        l = s(r[0]) + s(r[1]) + s(r[2]) + s(r[3]);
                    return -1 === l.indexOf("01") && l.indexOf("0") + 256
                }

                convertIpToInt(t) {
                    const e = t.split(".");
                    for (const s in e) e[s] = parseInt(e[s]) < 16 ? `0${parseInt(e[s]).toString(16)}` : parseInt(e[s]).toString(16);
                    return parseInt(`0x${e[0]}${e[1]}${e[2]}${e[3]}`)
                }

                macAddressValidation(t) {
                    return t = t.trim(), !(!/^([0-9A-Fa-f]{1,2}:){5}[0-9A-Fa-f]{1,2}$/.test(t) || 17 !== t.length)
                }

                ipv6PrefixValidation(t) {
                    if (!t || -1 === t.search("::/64") || t.match(new RegExp("::/64", "g")).length > 1 || !/.*::\/64$/.test(t)) return !1;
                    if ("" === t.split("::/64")[0]) return !0;
                    const e = t.split("::/64")[0].split(":");
                    if (e.length > 4) return !1;
                    for (let r = 0; r < e.length; r++) if (!/^[0-9A-Fa-f]{1,4}$/.test(e[r])) return !1;
                    return !0
                }

                ipv6ValidationTypeShort(t) {
                    if (!t) return !1;
                    const e = t.split("/");
                    if (!/^\s*((([0-9A-Fa-f]{1,4}:){3}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){2}((:[0-9A-Fa-f]{1,4})|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,2})|:))|(:(((:[0-9A-Fa-f]{1,4}){1,3})|:)))(%.+)?\s*$/.test(e[0])) return !1;
                    const s = e[1];
                    return !s || !!(s.match(/^\d+$/) && +s >= 0 && +s <= 128)
                }

                ipv6Validation(t) {
                    if (!t) return !1;
                    const e = t.split("/");
                    if (!/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/.test(e[0])) return !1;
                    const s = e[1];
                    return !s || !!(s.match(/^\d+$/) && +s >= 0 && +s <= 128)
                }

                ipv6ValidationWithoutSlash(t) {
                    if (!t) return !1;
                    const e = t.split("/");
                    if (e.length > 1) return !1;
                    if (!/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/.test(e[0])) return !1;
                    const s = e[1];
                    return !s || !!(s.match(/^\d+$/) && +s >= 0 && +s <= 128)
                }

                Ipv4AddressValidation(t) {
                    const e = t.split("/");
                    if (e.length > 2) return !1;
                    if (2 === e.length) {
                        const i = +e[1];
                        if (i <= 0 || i > 32) return !1
                    }
                    if (e[0] === c.DEFAULT_IPADDRESS || e[0] === c.CLASSD_SUBNETMASK) return !1;
                    const r = e[0].split(".");
                    if (4 !== r.length || "0" === r[0]) return !1;
                    for (let i = 0; i < 4; i++) {
                        if (isNaN(r[i]) || "" === r[i]) return !1;
                        const d = +r[i];
                        if (isNaN(d) || /\s/.test(r[i]) || d < 0 || d > 255) return !1
                    }
                    const s = +r[0], l = +r[1], a = +r[2], n = +r[3];
                    if (s >= 1 && s <= 223 && !e[1] && (127 === s || 255 === n || 0 === n)) return !1;
                    if (s >= 1 && s <= 127) {
                        if (127 === s || 255 === l && 255 === a && 255 === n || 0 === l && 0 === a && 0 === n) return !1
                    } else if (s >= 128 && s <= 191) {
                        if (255 === a && 255 === n || 0 === a && 0 === n) return !1
                    } else {
                        if (!(s >= 192 && s <= 223)) return !1;
                        if (255 === n || 0 === n) return !1
                    }
                    if (2 === e.length) {
                        const i = 32 - +e[1], d = s << 24 | l << 16 | a << 8 | n;
                        let f = 1;
                        for (let F = 0; F < i; F++) f *= 2;
                        f--;
                        const o = (d && f).toString(2), I = f.toString(2);
                        if ("0" === o) return !1;
                        if (o.length === I.length && o.indexOf("01") < 0 && o.indexOf("10") < 0) return !1
                    }
                    return !0
                }

                domainNameValidator(t) {
                    return !!t && !!/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(t)
                }

                ipAddressRangeValidation(t, e) {
                    const s = "255.255.0.0".split("."), l = t.split("."), a = e.split("."), n = [], i = [];
                    let d = !0;
                    for (let f = 0, o = l.length; f < o; f += 1) if (n.push(+l[f] & +s[f]), i.push(+a[f] & +s[f]), d) {
                        if (+l[f] > +a[f]) return !1;
                        +l[f] < +a[f] && (d = !1)
                    }
                    return n.join(".") === i.join(".")
                }

                isValidHexKey(t, e) {
                    if (t.length === e) {
                        let r = 0;
                        for (r = 0; r < t.length && !1 !== this.isHexaDigit(t.charAt(r)); r++) ;
                        if (r === t.length) return !0
                    }
                    return !1
                }

                isHexaDigit(t) {
                    const e = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "a", "b", "c", "d", "e", "f"];
                    for (const r of e) if (t === r) return !0;
                    return !1
                }

                isValidString(t) {
                    return /^[\u0020-\u007e\u00a0-\u00ff]*$/.test(t)
                }

                isValidIpFormat(t) {
                    return t === c.DEFAULT_IPADDRESS || this.Ipv4AddressValidation(t)
                }

                isValidPortNum(t) {
                    if ("" === t || !/^\d{1,5}$/.test(t)) return !1;
                    const e = +t;
                    return e <= 65535 && e >= 1
                }

                isQosDscpValidRange(t) {
                    if ("" === t || !/^\d{1,5}$/.test(t)) return !1;
                    const e = +t;
                    return e <= 65535 && e >= 0
                }

                ipFilterValidPort(t) {
                    if ("" === t || !/^\d{1,5}$/.test(t)) return !1;
                    const e = +t;
                    return e <= 65535 && e >= 1
                }

                isValidForwardingPolicy(t) {
                    if (!t || !/^\d{1,5}$/.test(t)) return !1;
                    const e = +t;
                    return e <= 7 && e >= 1
                }

                isValidm8021p(t) {
                    const e = t.trim();
                    if (!e || !/^\d{1,5}$/.test(e)) return !1;
                    const r = +e;
                    return r <= 7 && r >= 0
                }

                isValidSubnet(t) {
                    if (!t || t === c.DEFAULT_IPADDRESS || t === c.CLASSD_SUBNETMASK) return !1;
                    const e = t.split(".");
                    if (4 !== e.length || "0" === e[0]) return !1;
                    for (let n = 0; n < 4; n++) {
                        if (isNaN(e[n]) || "" === e[n]) return !1;
                        const i = +e[n];
                        if (i < 0 || i > 255) return !1
                    }
                    const r = +e[0], l = +e[2], a = +e[3];
                    if (r >= 1 && r <= 127) {
                        if (127 === r || 255 == +e[1] && 255 === l && 255 === a) return !1
                    } else if (r >= 128 && r <= 191) {
                        if (255 === l && 255 === a) return !1
                    } else {
                        if (!(r >= 192 && r <= 223)) return !1;
                        if (255 === a) return !1
                    }
                    return !0
                }

                trimIpAddress(t) {
                    const e = t.split(".");
                    let r = "";
                    for (let s = 0; s < e.length; s++) r += +e[s].toString(), s < 3 && (r += ".");
                    return r
                }

                isSameSubnetValidation(t, e, r) {
                    const s = t.split("."), l = e.split("."), a = r.split("."), n = new Array, i = new Array,
                        d = new Array;
                    let f = 0;
                    for (f = 0; f < 4; f++) n[f] = +s[f], i[f] = +l[f], d[f] = +a[f];
                    return (n[0] & d[0]) == (i[0] & d[0]) && (n[1] & d[1]) == (i[1] & d[1]) && (n[2] & d[2]) == (i[2] & d[2]) && (n[3] & d[3]) == (i[3] & d[3])
                }

                checkDomain(t) {
                    return !(!t || t.length > 255 || !/^(([a-zA-Z0-9]{1,2})|([a-zA-Z0-9]([a-zA-Z0-9-]){1,61}[a-zA-Z0-9]))(\.(([a-zA-Z0-9]{1,2})|([a-zA-Z0-9]([a-zA-Z0-9-]){1,61}[a-zA-Z0-9]))){1,}$/.test(t))
                }

                macFilterAddressValidation(t) {
                    return !(!/^([0-9a-f]{2}([:]|$)){6}$|([0-9a-f]{4}([.]|$)){3}$/i.test(t) || 17 !== t.length)
                }

                maxLengthValidation(t, e) {
                    return t.length <= e
                }

                isValidUrl(t) {
                    return !/^(.*:.*){2,}$/.test(t)
                }

                urlAddressValidationMsg(t) {
                    const e = t.split(":");
                    return "https" === e[0] ? this.constants.URL_HTTPS_INVALID_ERROR : "http" !== e[0] && "ftp" !== e[0] && "file" !== e[0] && "MMS" !== e[0] && "ed2k" !== e[0] && "Flashget" !== e[0] && "thunder" !== e[0] || /:\/\//.test(t) ? "" : this.constants.URL_NOT_RIGHT_MSG
                }

                urlAddressValidation(t) {
                    if (/[#\\\'+\," ]/.test(t) || !/[A-Za-z0-9]/.test(t) || !/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(t)) return !1;
                    const e = t.split(":");
                    return !("https" === e[0] || ("http" === e[0] || "ftp" === e[0] || "file" === e[0] || "MMS" === e[0] || "ed2k" === e[0] || "Flashget" === e[0] || "thunder" === e[0]) && !/:\/\//.test(t))
                }

                isValidPortForwardingPortNum(t) {
                    if (!t || !/^\d{1,5}$/.test(t)) return !1;
                    const e = +t;
                    return e <= 65535 && e >= 1
                }

                isValidTime(t) {
                    if (!t || !/^\d{1,6}$/.test(t)) return !1;
                    const e = +t;
                    return e <= 999999 && e >= 1
                }

                IpValidationWithoutMask(t) {
                    return !(t.split("/").length > 1) && this.Ipv4AddressValidation(t)
                }

                isValidName(t) {
                    for (let e = 0; e < t.length; e++) if (!0 === this.isNameUnsafe(t.charAt(e))) return !1;
                    return !0
                }

                isNameUnsafe(t) {
                    return !(-1 === "\"<>\\^`+\\,'&\t".indexOf(t) && t.charCodeAt(0) > 31 && t.charCodeAt(0) < 123)
                }

                checkForCommunityWiFi(t, e) {
                    return !(!e || t !== e.SSIDInterface && t !== e.SSID5Interface && t !== e.EAPSSIDInterface && t !== e.EAPSSID5Interface)
                }

                checkForBaliTowerSSID(t) {
                    return !(!t || 4 !== t && 8 !== t)
                }

                ipv6AddressCompare(t, e) {
                    t = this.transitV6Ip(t), e = this.transitV6Ip(e);
                    const r = t.split("/"), s = e.split("/"), l = r[0].split(":"), a = s[0].split(":"), n = l.length;
                    for (let i = 0; i < n; i++) {
                        const d = parseInt(l[i], 16), f = parseInt(a[i], 16);
                        if (d < f) return 2;
                        if (f < d) return 1
                    }
                    return 0
                }

                transitV6Ip(t) {
                    if (!t) return;
                    let r = t.split("/")[0].split(":"), s = ["0000", "000", "00", "0", ""];
                    for (let a = 0; a < r.length; a++) r[a] = s[r[a].length ? r[a].length : 0] + r[a];
                    if (r.length < 8) {
                        let a = 0;
                        for (let n = 0; n < r.length; n++) if ("0000" == r[n]) {
                            if (1 == a) {
                                r[n] = this.addZeroForIpv6Addr(4);
                                continue
                            }
                            r[n] = this.addZeroForIpv6Addr(4 * (9 - r.length)), a++
                        } else r[n] += ":"
                    } else if (8 == r.length) for (let a = 0; a < 8; a++) r[a] += ":";
                    let l = "";
                    for (let a = 0; a < r.length; a++) l += r[a];
                    return ":" == l.charAt(l.length - 1) && (l = l.substr(0, l.length - 1)), l
                }

                addZeroForIpv6Addr(t) {
                    let e = "";
                    for (let r = 1; r < t + 1; r++) e += "0", r % 4 == 0 && (e += ":");
                    return e
                }

                checkDdnsUsername(t) {
                    return /(^[a-zA-Z0-9]{1}([\w!*_\/'\.+\-]*)@((?![-.])(?!.*[-.]{2})[a-zA-Z0-9.-]+?\.[a-zA-Z]{2,})$)|(^(?=[a-zA-Z0-9])([A-Za-z0-9._-]*)+$)|(^(?![-.])(?!.*[-.]{2})[a-zA-Z0-9.-]{0,64}?\.[a-zA-Z]{1,}$)/gim.test(t)
                }

                checkDdnsPassword(t) {
                    return !new RegExp("[^A-Za-z0-9!#+,-./:=@_]").test(t)
                }

                isDangerous(t) {
                    return !new RegExp("[`]").test(t)
                }

                fqdnUrlValidation(t) {
                    return z().isURL(t, {protocols: ["http"], require_protocol: !0})
                }

                domainNameWithHypenValidator(t) {
                    return !!t && !!/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]+$/.test(t)
                }

                ipv6SubnetMask(t) {
                    return !(isNaN(t) || t <= -1 || t >= 129)
                }

                sourceMacMaskValidationForCortina(t) {
                    return !!/^(?:00:00:00:00:00:00|F(?:0:00:00:00:00:00|F:(?:00:00:00:00:00|F(?:0:00:00:00:00|F:(?:00:00:00:00|F(?:0:00:00:00|F:(?:00:00:00|F(?:0:00:00|F:(?:00:00|F(?:0:00|F:(?:00|F[0F])))))))))))$/.test(t)
                }

                isValidDomainSuffix(t) {
                    return !(!t || t.length > 255) && !!(/^(([a-zA-Z0-9]{1,2})|([a-zA-Z0-9.]([a-zA-Z0-9]){1,})|([a-zA-Z0-9.]([a-zA-Z0-9]){1,}([a-zA-Z0-9-]){1,}[a-zA-Z0-9])|([a-zA-Z0-9]([a-zA-Z0-9-]){1,61}[a-zA-Z0-9]))(\.(([a-zA-Z0-9]{1,2})|([a-zA-Z0-9]([a-zA-Z0-9-]){1,61}[a-zA-Z0-9]))){1,}$/.test(t) || /^(\.)(([a-zA-Z0-9]{1,2})|([a-zA-Z0-9]([a-zA-Z0-9-]){1,61}[a-zA-Z0-9])){1,}$/.test(t) || /^([a-zA-Z0-9]){1,}$/.test(t))
                }

                isValidDomainPrefix(t) {
                    return !(!t || t.length > 255) && !!(/^(([a-zA-Z0-9]{1,2})|([a-zA-Z0-9]([a-zA-Z0-9-]){1,61}[a-zA-Z0-9]))(\.(([a-zA-Z0-9]{1,2})|(([a-zA-Z0-9]){1,}[a-zA-Z0-9.])|([a-zA-Z0-9]([a-zA-Z0-9-]){1,}([a-zA-Z0-9]){1,}[a-zA-Z0-9.])|([a-zA-Z0-9]([a-zA-Z0-9-]){1,61}[a-zA-Z0-9]))){1,}$/.test(t) || /^(([a-zA-Z0-9]{1,2})|([a-zA-Z0-9]([a-zA-Z0-9-]){1,61}[a-zA-Z0-9]))(\.)$/.test(t) || /^([a-zA-Z0-9]){1,}$/.test(t))
                }

                validateIPv6Address(t) {
                    return /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/.test(t)
                }

                validateDomainName(t) {
                    return /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/.test(t)
                }

                validateInputSymbols(t) {
                    return /[`$&();|<>]/.test(t)
                }

                static #t = this.\u0275fac = function (e) {
                    return new (e || u)(p.KVO(S.YM))
                };
                static #e = this.\u0275prov = p.jDH({token: u, factory: u.\u0275fac, providedIn: "root"})
            }

            return u
        })()
    }
}]);