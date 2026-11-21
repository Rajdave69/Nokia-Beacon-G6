"use strict";
(self.webpackChunknokiawifi = self.webpackChunknokiawifi || []).push([[224], {
    2705: (w, E, p) => {
        p.d(E, {N: () => g});
        var b = p(4493), S = p(8611), r = p(7365), d = p(1989);

        class g {
            static #e = this.constants = new b.YM;
            static #t = this.alertUtiliy = new d.l(g.constants);
            static #s = this.utilityService = new r.n(g.constants, g.alertUtiliy);
            static #i = this.validatorsService = new S.k(g.constants);

            static MinMaxValidator(n, l) {
                return u => u.value ? u.value < n || u.value > l ? {minMaxError: !0} : null : void 0
            }

            static MaxLengthValidator(n) {
                return l => l.value ? l.value.length > n ? {maxLengthError: !0} : null : void 0
            }

            static ExceedsNumberValidator(n) {
                return l => l.value ? +l.value > +n ? {maxLengthError: !0} : null : void 0
            }

            static NotExceedsNumberValidator(n) {
                return l => l.value ? +l.value < +n ? {exceedsError: !0} : null : void 0
            }

            static PortValidator(n, l) {
                return u => u.value ? u.value < n || u.value > l ? {portError: !0} : null : void 0
            }

            static WepKeyValidator(n) {
                return l => {
                    if (!l.value) return;
                    let u, c;
                    return "64 bit" === n && (10 !== l.value.length && 5 !== l.value.length && (c = this.constants.VALID_WEP_KEY_LEN, u = !1), 10 === l.value.length && this.validatorsService.isValidHexKey(l.value, 10) && (c = this.constants.WEP_VALID_HEX_VALUES, u = !1), 5 === l.value.length && this.validatorsService.isValidString(l.value) && (c = this.constants.WEP_INVALID_CHAR, u = !1)), "128 bit" === n && (13 !== l.value.length && 26 !== l.value.length && (c = this.constants.VALID_HEX_PWD, u = !1), 26 === l.value.length && this.validatorsService.isValidHexKey(l.value, 26) && (c = this.constants.WEP_VALID_HEX_VALUES, u = !1), 13 === l.value.length && this.validatorsService.isValidString(l.value) && (c = this.constants.WEP_INVALID_CHAR, u = !1)), u ? null : {
                        wepKeyError: !0,
                        message: c
                    }
                }
            }

            static PortValidation() {
                return n => {
                    if (n.value) return this.validatorsService.isValidPortNum(n.value) ? null : {
                        formError: !0,
                        message: this.constants.ERR_RIGHT_PORT
                    }
                }
            }

            static IpFilterPortValidation() {
                return n => {
                    if (n.value) return this.validatorsService.ipFilterValidPort(n.value) ? null : {
                        formError: !0,
                        message: this.constants.ERR_RIGHT_PORT
                    }
                }
            }

            static PortValidationGreater(n, l) {
                return u => {
                    if (!u.value) return null;
                    const c = u.parent.get(n), v = u.parent.get(l);
                    return c.value && v.value ? +c.value > +v.value ? (c.setErrors({
                        formError: !0,
                        message: this.constants.SRC_LESS_THAN_END
                    }), c.updateValueAndValidity(), {
                        formError: !0,
                        message: this.constants.SRC_LESS_THAN_END
                    }) : (c.errors && c.errors.formError && (delete c.errors.formError, delete c.errors.message, c.updateValueAndValidity()), null) : null
                }
            }

            static IpValidation() {
                return n => "" === n.value || this.validatorsService.Ipv4AddressValidation(n.value) || this.validatorsService.ipv6ValidationWithoutSlash(n.value) ? null : {
                    formError: !0,
                    message: "ERROR_ENTER_VALID_IP"
                }
            }

            static IpSubnetMaskValidation() {
                return n => this.validatorsService.maskIPAddressValidation(n.value) && n.value !== b.YM.DEFAULT_IPADDRESS || this.validatorsService.ipv6SubnetMask(n.value) ? null : {
                    formError: !0,
                    message: "ERR_INPUT_SUBNETMASK"
                }
            }

            static hostAddressValidator() {
                return n => {
                    if (n.value) {
                        let l = !1;
                        if (this.validatorsService.isValidIpFormat(n.value)) return null;
                        if (l = !0, n.value.includes(".") && n.value.split(".").length <= 3 && !isNaN(n.value.replaceAll(".", ""))) return {hostIp: !0};
                        if (l) {
                            if (this.validatorsService.domainNameWithHypenValidator(n.value)) return l = !1, null;
                            l = !0
                        }
                        if (l && this.validatorsService.ipv6Validation(n.value)) return null
                    }
                    return {hostIp: !0}
                }
            }

            static hostAddressIPV4Validator() {
                return n => {
                    if (n.value) {
                        let l = !1;
                        if (this.validatorsService.isValidIpFormat(n.value)) return null;
                        if (l = !0, n.value.includes(".") && n.value.split(".").length <= 3 && !isNaN(n.value.replaceAll(".", ""))) return {hostIp: !0};
                        if (l) {
                            if (this.validatorsService.domainNameWithHypenValidator(n.value)) return l = !1, null;
                            l = !0
                        }
                    }
                    return {hostIp: !0}
                }
            }

            static fqdnUrlValidation() {
                return n => {
                    if (n.value) {
                        try {
                            if (n.value.match(/\[.*]/)) {
                                let l = new URL(n.value);
                                if ("http:" === l?.protocol && l?.host.match(/\[.*]/)) return null
                            }
                        } catch (l) {
                            return console.error("Error in IPV6 FQDN Validation", l), {notValidUrl: !0}
                        }
                        return this.validatorsService.fqdnUrlValidation(n.value) ? null : {notValidUrl: !0}
                    }
                }
            }
        }
    }, 5224: (w, E, p) => {
        p.r(E), p.d(E, {TroubleshootingModule: () => Xe});
        var b = p(6425), S = p(6939), r = p(9417), d = p(6261), g = p(2705), e = p(4438), n = p(6452), l = p(4493),
            u = p(8100), c = p(765), v = p(8934), R = p(1989), D = p(8882), y = p(7365), V = p(6279), P = p(7410),
            C = p(177);

        function O(s, a) {
            if (1 & s && e.nrm(0, "pv-text", 13), 2 & s) {
                const t = e.XpG(4);
                e.Y8G("title", t.constants.REQUIRED_FIELD_LABEL)
            }
        }

        function x(s, a) {
            if (1 & s && e.nrm(0, "pv-text", 13), 2 & s) {
                const t = e.XpG(4);
                e.Y8G("title", t.constants.PLEASE_ENTER_VALID_URL)
            }
        }

        function N(s, a) {
            if (1 & s && (e.j41(0, "pv-form-field", 8)(1, "label"), e.nrm(2, "pv-text", 9), e.k0s(), e.j41(3, "span", 10), e.nrm(4, "pv-inputbox", 11), e.DNE(5, O, 1, 1, "pv-text", 12)(6, x, 1, 1, "pv-text", 12), e.k0s()()), 2 & s) {
                const t = e.XpG(3);
                e.Y8G("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.UPLOAD_TEST_SERVER_URL), e.R7$(2), e.Y8G("hideErrorIcon", !0)("placeholder", t.constants.UPLOAD_PLACEHOLDER)("disabled", t.api.device_capability.getVal("troubleshooting", "speedTest", "TR-143serverSettings", "uploadTestServerURL").isDisabled)("type", "url")("isValidated", !0), e.R7$(), e.Y8G("ngIf", t.hasError(t.speedTestForm, "uploadServerUrl", "required")), e.R7$(), e.Y8G("ngIf", t.hasError(t.speedTestForm, "uploadServerUrl", "notValidUrl"))
            }
        }

        function A(s, a) {
            if (1 & s && e.nrm(0, "pv-text", 13), 2 & s) {
                const t = e.XpG(4);
                e.Y8G("title", t.constants.REQUIRED_FIELD_LABEL)
            }
        }

        function M(s, a) {
            if (1 & s && e.nrm(0, "pv-text", 13), 2 & s) {
                const t = e.XpG(4);
                e.Y8G("title", t.constants.ERROR_CONNECTION_NUMBERS)
            }
        }

        function U(s, a) {
            if (1 & s && (e.j41(0, "pv-form-field", 8)(1, "label"), e.nrm(2, "pv-text", 9), e.k0s(), e.j41(3, "span", 10), e.nrm(4, "pv-inputbox", 14), e.DNE(5, A, 1, 1, "pv-text", 12)(6, M, 1, 1, "pv-text", 12), e.k0s()()), 2 & s) {
                const t = e.XpG(3);
                e.Y8G("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.NUMBER_OF_UPLOAD_CONNECTION), e.R7$(2), e.Y8G("type", "number")("onlyNumber", !0)("placeholder", t.constants.CONNECTIONS_PLACEHOLDER)("disabled", t.api.device_capability.getVal("troubleshooting", "speedTest", "TR-143serverSettings", "uploadConnections").isDisabled)("hideErrorIcon", !0)("isValidated", !0), e.R7$(), e.Y8G("ngIf", t.hasError(t.speedTestForm, "uploadConnections", "required")), e.R7$(), e.Y8G("ngIf", t.hasError(t.speedTestForm, "uploadConnections", "max") || t.hasError(t.speedTestForm, "uploadConnections", "pattern"))
            }
        }

        function F(s, a) {
            if (1 & s && e.nrm(0, "pv-text", 13), 2 & s) {
                const t = e.XpG(4);
                e.Y8G("title", t.constants.REQUIRED_FIELD_LABEL)
            }
        }

        function k(s, a) {
            if (1 & s && e.nrm(0, "pv-text", 13), 2 & s) {
                const t = e.XpG(4);
                e.Y8G("title", t.constants.PLEASE_ENTER_VALID_URL)
            }
        }

        function Y(s, a) {
            if (1 & s && (e.j41(0, "pv-form-field", 8)(1, "label"), e.nrm(2, "pv-text", 9), e.k0s(), e.j41(3, "span", 10), e.nrm(4, "pv-inputbox", 15), e.DNE(5, F, 1, 1, "pv-text", 12)(6, k, 1, 1, "pv-text", 12), e.k0s()()), 2 & s) {
                const t = e.XpG(3);
                e.Y8G("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.DOWNLOAD_TEST_SERVER_URL), e.R7$(2), e.Y8G("hideErrorIcon", !0)("placeholder", t.constants.DOWNLOAD_PLACEHOLDER)("disabled", t.api.device_capability.getVal("troubleshooting", "speedTest", "TR-143serverSettings", "downloadTestServerURL").isDisabled)("type", "url")("isValidated", !0), e.R7$(), e.Y8G("ngIf", t.hasError(t.speedTestForm, "downloadServerUrl", "required")), e.R7$(), e.Y8G("ngIf", t.hasError(t.speedTestForm, "downloadServerUrl", "notValidUrl"))
            }
        }

        function $(s, a) {
            if (1 & s && e.nrm(0, "pv-text", 13), 2 & s) {
                const t = e.XpG(4);
                e.Y8G("title", t.constants.REQUIRED_FIELD_LABEL)
            }
        }

        function B(s, a) {
            if (1 & s && e.nrm(0, "pv-text", 13), 2 & s) {
                const t = e.XpG(4);
                e.Y8G("title", t.constants.ERROR_CONNECTION_NUMBERS)
            }
        }

        function X(s, a) {
            if (1 & s && (e.j41(0, "pv-form-field", 8)(1, "label"), e.nrm(2, "pv-text", 9), e.k0s(), e.j41(3, "span", 10), e.nrm(4, "pv-inputbox", 16), e.DNE(5, $, 1, 1, "pv-text", 12)(6, B, 1, 1, "pv-text", 12), e.k0s()()), 2 & s) {
                const t = e.XpG(3);
                e.Y8G("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.NUMBER_OF_DOWNLOAD_CONNECTION), e.R7$(2), e.Y8G("type", "number")("onlyNumber", !0)("placeholder", t.constants.CONNECTIONS_PLACEHOLDER)("disabled", t.api.device_capability.getVal("troubleshooting", "speedTest", "TR-143serverSettings", "downloadConnections").isDisabled)("hideErrorIcon", !0)("isValidated", !0), e.R7$(), e.Y8G("ngIf", t.hasError(t.speedTestForm, "downloadConnections", "required")), e.R7$(), e.Y8G("ngIf", t.hasError(t.speedTestForm, "downloadConnections", "max") || t.hasError(t.speedTestForm, "downloadConnections", "pattern"))
            }
        }

        function j(s, a) {
            if (1 & s && e.nrm(0, "pv-text", 13), 2 & s) {
                const t = e.XpG(4);
                e.Y8G("title", t.constants.REQUIRED_FIELD_LABEL)
            }
        }

        function W(s, a) {
            if (1 & s && e.nrm(0, "pv-text", 13), 2 & s) {
                const t = e.XpG(4);
                e.Y8G("title", t.constants.PLEASE_ENTER_VALID_IP_ADDRESS)
            }
        }

        function H(s, a) {
            if (1 & s && (e.j41(0, "pv-form-field", 8)(1, "label"), e.nrm(2, "pv-text", 9), e.k0s(), e.j41(3, "span", 10), e.nrm(4, "pv-inputbox", 17), e.DNE(5, j, 1, 1, "pv-text", 12)(6, W, 1, 1, "pv-text", 12), e.k0s()()), 2 & s) {
                const t = e.XpG(3);
                e.Y8G("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.HOST), e.R7$(2), e.Y8G("placeholder", t.constants.IPADDRESS_PLACEHOLDER)("disabled", t.api.device_capability.getVal("troubleshooting", "speedTest", "TR-143serverSettings", "host").isDisabled)("hideErrorIcon", !0)("isValidated", !0), e.R7$(), e.Y8G("ngIf", t.hasError(t.speedTestForm, "hostIpAddress", "required")), e.R7$(), e.Y8G("ngIf", t.hasError(t.speedTestForm, "hostIpAddress", "hostIp"))
            }
        }

        function z(s, a) {
            if (1 & s && e.nrm(0, "pv-select-option", 20), 2 & s) {
                const t = a.$implicit;
                e.Y8G("label", t.label)("value", t.value)
            }
        }

        function q(s, a) {
            if (1 & s && (e.j41(0, "pv-form-field", 8)(1, "label"), e.nrm(2, "pv-text", 9), e.k0s(), e.j41(3, "span", 10)(4, "pv-select", 18), e.DNE(5, z, 1, 2, "pv-select-option", 19), e.k0s()()()), 2 & s) {
                const t = e.XpG(3);
                e.Y8G("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.TEST_MODE), e.R7$(2), e.Y8G("disabled", t.api.device_capability.getVal("troubleshooting", "speedTest", "TR-143serverSettings", "testMode").isDisabled), e.R7$(), e.Y8G("ngForOf", t.speedTestModeList)
            }
        }

        function J(s, a) {
            if (1 & s && e.nrm(0, "pv-text", 13), 2 & s) {
                const t = e.XpG(4);
                e.Y8G("title", t.constants.REQUIRED_FIELD_LABEL)
            }
        }

        function K(s, a) {
            if (1 & s && e.nrm(0, "pv-text", 13), 2 & s) {
                const t = e.XpG(4);
                e.Y8G("title", t.speedTestErrorLog)
            }
        }

        function Q(s, a) {
            if (1 & s && (e.j41(0, "pv-form-field", 8)(1, "label"), e.nrm(2, "pv-text", 9), e.k0s(), e.j41(3, "span", 10), e.nrm(4, "pv-inputbox", 21), e.DNE(5, J, 1, 1, "pv-text", 12)(6, K, 1, 1, "pv-text", 12), e.k0s()()), 2 & s) {
                const t = e.XpG(3);
                e.Y8G("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.UPLOAD_FILE_SIZE), e.R7$(2), e.Y8G("type", "number")("onlyNumber", !0)("placeholder", t.constants.FILE_SIZE_PLACEHOLDER)("disabled", t.api.device_capability.getVal("troubleshooting", "speedTest", "TR-143serverSettings", "uploadFileSize").isDisabled)("hideErrorIcon", !0)("isValidated", !0), e.R7$(), e.Y8G("ngIf", t.hasError(t.speedTestForm, "uploadFileSize", "required")), e.R7$(), e.Y8G("ngIf", t.hasError(t.speedTestForm, "uploadFileSize", "max") || t.hasError(t.speedTestForm, "uploadFileSize", "pattern"))
            }
        }

        function Z(s, a) {
            if (1 & s && e.nrm(0, "pv-select-option", 20), 2 & s) {
                const t = a.$implicit;
                e.Y8G("label", t.label)("value", t.value)
            }
        }

        function ee(s, a) {
            if (1 & s && (e.j41(0, "pv-form-field", 8)(1, "label"), e.nrm(2, "pv-text", 9), e.k0s(), e.j41(3, "span", 10)(4, "pv-select", 22), e.DNE(5, Z, 1, 2, "pv-select-option", 19), e.k0s()()()), 2 & s) {
                const t = e.XpG(3);
                e.Y8G("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.WAN_CONNECTION_LIST), e.R7$(2), e.Y8G("disabled", t.api.device_capability.getVal("troubleshooting", "speedTest", "TR-143serverSettings", "wanConnectionList").isDisabled), e.R7$(), e.Y8G("ngForOf", t.wanConnectionList)
            }
        }

        function te(s, a) {
            if (1 & s && e.nrm(0, "pv-text", 13), 2 & s) {
                const t = e.XpG(4);
                e.Y8G("title", t.constants.REQUIRED_FIELD_LABEL)
            }
        }

        function se(s, a) {
            if (1 & s && e.nrm(0, "pv-text", 13), 2 & s) {
                const t = e.XpG(4);
                e.Y8G("title", t.constants.PLEASE_ENTER_VALID_TIME_DURATION)
            }
        }

        function ie(s, a) {
            if (1 & s && (e.j41(0, "pv-form-field", 8)(1, "label"), e.nrm(2, "pv-text", 9), e.k0s(), e.j41(3, "span", 10), e.nrm(4, "pv-inputbox", 23), e.DNE(5, te, 1, 1, "pv-text", 12)(6, se, 1, 1, "pv-text", 12), e.k0s()()), 2 & s) {
                const t = e.XpG(3);
                e.Y8G("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.DURATION), e.R7$(2), e.Y8G("type", "number")("onlyNumber", !0)("placeholder", t.constants.DURATION_PLACEHOLDER)("disabled", t.api.device_capability.getVal("troubleshooting", "speedTest", "TR-143serverSettings", "duration").isDisabled)("hideErrorIcon", !0)("isValidated", !0), e.R7$(), e.Y8G("ngIf", t.hasError(t.speedTestForm, "timeDuration", "required")), e.R7$(), e.Y8G("ngIf", t.hasError(t.speedTestForm, "timeDuration", "max") || t.hasError(t.speedTestForm, "timeDuration", "pattern"))
            }
        }

        function oe(s, a) {
            if (1 & s && (e.qex(0), e.j41(1, "form", 5)(2, "pv-card"), e.nrm(3, "pv-text", 6), e.DNE(4, N, 7, 10, "pv-form-field", 7)(5, U, 7, 11, "pv-form-field", 7)(6, Y, 7, 10, "pv-form-field", 7)(7, X, 7, 11, "pv-form-field", 7)(8, H, 7, 9, "pv-form-field", 7)(9, q, 6, 5, "pv-form-field", 7)(10, Q, 7, 11, "pv-form-field", 7)(11, ee, 6, 5, "pv-form-field", 7)(12, ie, 7, 11, "pv-form-field", 7), e.k0s()(), e.bVm()), 2 & s) {
                const t = e.XpG(2);
                e.R7$(), e.Y8G("formGroup", t.speedTestForm), e.R7$(2), e.Y8G("title", t.constants.TR143_SERVER_SETTINGS), e.R7$(), e.Y8G("ngIf", t.api.device_capability.getVal("troubleshooting", "speedTest", "TR-143serverSettings", "uploadTestServerURL").isOn), e.R7$(), e.Y8G("ngIf", t.api.device_capability.getVal("troubleshooting", "speedTest", "TR-143serverSettings", "uploadConnections").isOn), e.R7$(), e.Y8G("ngIf", t.api.device_capability.getVal("troubleshooting", "speedTest", "TR-143serverSettings", "downloadTestServerURL").isOn), e.R7$(), e.Y8G("ngIf", t.api.device_capability.getVal("troubleshooting", "speedTest", "TR-143serverSettings", "downloadConnections").isOn), e.R7$(), e.Y8G("ngIf", t.api.device_capability.getVal("troubleshooting", "speedTest", "TR-143serverSettings", "host").isOn), e.R7$(), e.Y8G("ngIf", t.api.device_capability.getVal("troubleshooting", "speedTest", "TR-143serverSettings", "testMode").isOn), e.R7$(), e.Y8G("ngIf", t.showFileBasedSpeedTest && t.api.device_capability.getVal("troubleshooting", "speedTest", "TR-143serverSettings", "uploadFileSize").isOn), e.R7$(), e.Y8G("ngIf", t.api.supportTR143WanCon && t.api.device_capability.getVal("troubleshooting", "speedTest", "TR-143serverSettings", "wanConnectionList").isOn), e.R7$(), e.Y8G("ngIf", t.showTimeBasedSpeedTest && t.api.device_capability.getVal("troubleshooting", "speedTest", "TR-143serverSettings", "duration").isOn)
            }
        }

        function ne(s, a) {
            if (1 & s && e.nrm(0, "pv-list", 27), 2 & s) {
                const t = e.XpG(3);
                e.Y8G("caption", t.constants.UPLOAD_SPEED)("value", t.uploadSpeed)
            }
        }

        function ae(s, a) {
            if (1 & s && e.nrm(0, "pv-list", 27), 2 & s) {
                const t = e.XpG(3);
                e.Y8G("caption", t.constants.DOWNLOAD_SPEED)("value", t.downloadSpeed)
            }
        }

        function re(s, a) {
            if (1 & s && e.nrm(0, "pv-list", 27), 2 & s) {
                const t = e.XpG(3);
                e.Y8G("caption", t.constants.LATENCY)("value", t.latency)
            }
        }

        function le(s, a) {
            if (1 & s) {
                const t = e.RV6();
                e.j41(0, "div", 28)(1, "pv-button", 29), e.bIt("onClick", function () {
                    e.eBV(t);
                    const o = e.XpG(3);
                    return e.Njj(!o.speedTestInprogress && o.startSpeedTest())
                }), e.k0s()()
            }
            if (2 & s) {
                const t = e.XpG(3);
                e.R7$(), e.Y8G("isDisabled", !t.speedTestForm.valid || t.saveInprogress || t.api.device_capability.getVal("troubleshooting", "speedTest", "results", "startTestButton").isDisabled)("webSave", t.showSpeedTestTriggerIcon)("showButtonLoader", t.speedTestInprogress)("title", t.constants.START_TEST)
            }
        }

        function de(s, a) {
            if (1 & s && (e.j41(0, "pv-card", 24), e.nrm(1, "pv-text", 6), e.DNE(2, ne, 1, 2, "pv-list", 25)(3, ae, 1, 2, "pv-list", 25)(4, re, 1, 2, "pv-list", 25)(5, le, 2, 4, "div", 26), e.k0s()), 2 & s) {
                const t = e.XpG(2);
                e.R7$(), e.Y8G("title", t.constants.RESULTS), e.R7$(), e.Y8G("ngIf", t.api.device_capability.getVal("troubleshooting", "speedTest", "results", "uploadSpeed", "visibility").isOn), e.R7$(), e.Y8G("ngIf", t.api.device_capability.getVal("troubleshooting", "speedTest", "results", "downloadSpeed", "visibility").isOn), e.R7$(), e.Y8G("ngIf", t.api.device_capability.getVal("troubleshooting", "speedTest", "results", "latency", "visibility").isOn), e.R7$(), e.Y8G("ngIf", t.api.device_capability.getVal("troubleshooting", "speedTest", "results", "startTestButton").isOn)
            }
        }

        function pe(s, a) {
            if (1 & s && (e.j41(0, "div", 2), e.DNE(1, oe, 13, 11, "ng-container", 3)(2, de, 6, 5, "pv-card", 4), e.k0s()), 2 & s) {
                const t = e.XpG();
                e.R7$(), e.Y8G("ngIf", t.api.device_capability.getVal("troubleshooting", "speedTest", "TR-143serverSettings", "visibility").isOn), e.R7$(), e.Y8G("ngIf", t.api.device_capability.getVal("troubleshooting", "speedTest", "results", "visibility").isOn)
            }
        }

        function ue(s, a) {
            if (1 & s) {
                const t = e.RV6();
                e.qex(0), e.j41(1, "div", 30)(2, "pv-button", 31), e.bIt("onClick", function () {
                    e.eBV(t);
                    const o = e.XpG(2);
                    return e.Njj(!o.saveInprogress && o.saveSpeedTestDetails())
                }), e.k0s()(), e.bVm()
            }
            if (2 & s) {
                const t = e.XpG(2);
                e.R7$(2), e.Y8G("title", t.constants.SAVE)("webSave", t.showSaveIcon)("showButtonLoader", t.saveInprogress)("isDisabled", t.speedTestInprogress || !t.speedTestForm.valid || t.api.device_capability.getVal("troubleshooting", "speedTest", "saveButton").isDisabled)
            }
        }

        function ce(s, a) {
            if (1 & s && (e.qex(0), e.DNE(1, ue, 3, 4, "ng-container", 3), e.bVm()), 2 & s) {
                const t = e.XpG();
                e.R7$(), e.Y8G("ngIf", t.api.device_capability.getVal("troubleshooting", "speedTest", "saveButton").isOn)
            }
        }

        let he = (() => {
            class s {
                constructor(t, i, o, T, f, _, h, m, L, I, je) {
                    this.message = t, this.constants = i, this.portalService = o, this.validators = T, this.api = f, this.alertUtil = _, this.pubSubService = h, this.utility = m, this.pureViewSnackbarService = L, this.logger = I, this.prodcfg = je, this.speedTestModeList = [{
                        label: this.constants.TIME_BASED,
                        value: "time"
                    }, {
                        label: this.constants.FILE_BASED,
                        value: "file"
                    }], this.uploadSpeed = "-", this.downloadSpeed = "-", this.latency = "-", this.index = 0, this.wanValue = "", this.showFileBasedSpeedTest = !1, this.showTimeBasedSpeedTest = !1, this.showSaveIcon = !1, this.disableSave = !1, this.saveInprogress = !1, this.showSpeedTestTriggerIcon = !1, this.speedTestInprogress = !1, this.isSpeedTestTrigger = !1, this.speedTestStarted = !1, this.isCFGMode = !1, this.isLoading = !0, this.ispageLoaded = !1, this.speedTestPolling = void 0, this.speedTestParams = "", this.speedTestOperationFailed = 0
                }

                ngOnInit() {
                    this.initForm(), this.onChanges(), this.refreshPage(), this.onLanguageChanges(), this.alertUtil.showContentModalLoader(), setTimeout(() => {
                        this.portalService.passPortal(this.portalContent)
                    }, 500), "" !== this.api.router_info.gwmodel ? this.loadRouterInfo(this.api) : this.api.request(this, "getRouterInfo"), this.api.request(this, "getSpeedTestData"), this.api.request(this, "getSpeedTestResultData"), (this.api.get_speedtest_result_info.Upload_Speed || this.api.get_speedtest_result_info.Download_Speed || this.api.get_speedtest_result_info.AverageResponseTime) && this.populateSpeedTestResult(this.api.get_speedtest_result_info)
                }

                loadRouterInfo(t) {
                    this.isCFGMode = -1 === t.brEnable, this.isCFGMode && this.showWarning(this.constants.CFG_WARNING)
                }

                onLanguageChanges() {
                    this.langChangeSub = this.pubSubService.subscribe(d.VR.LANGUAGE_CHANGE, t => {
                        this.speedTestModeList = [{
                            label: this.constants.TIME_BASED,
                            value: "time"
                        }, {label: this.constants.FILE_BASED, value: "file"}], setTimeout(() => {
                            this.testMode.setValue("time" === this.testMode?.value ? "time" : "file")
                        }, 100), this.speedTestErrorLog = this.prodcfg.supportsFWADevice ? this.constants.PLEASE_ENTER_VALID_FILE_SIZE_2 : this.constants.PLEASE_ENTER_VALID_FILE_SIZE
                    })
                }

                refreshPage() {
                    this.pageRefreshSub = this.pubSubService.subscribe(d.VR.HEADER_REFRESH_CLICKED, t => {
                        this.resetFormFields(), this.fetchSpeedTestData(), this.stopSpeedTest(), this.pureViewSnackbarService.hideMessageSnackbar()
                    })
                }

                fetchSpeedTestData() {
                    this.api.request(this, "getSpeedTestData"), this.api.request(this, "getSpeedTestResultData"), this.api.get_speedtest_result_info && this.populateSpeedTestResult(this.api.get_speedtest_result_info[0]), this.isSpeedTestTrigger = !1, this.speedTestInprogress = !1, this.showSpeedTestTriggerIcon = !1
                }

                resetFormFields() {
                    this.speedTestParams = "", this.speedTestForm.reset(), this.speedTestForm.markAsUntouched()
                }

                showWarning(t) {
                    this.message.showMessage({
                        show: !0,
                        title: this.constants.WARNING,
                        width: "400px",
                        description: t,
                        buttonText: this.constants.OKAY_LABEL
                    })
                }

                initForm() {
                    this.speedTestForm = new r.gE({
                        wanConnection: new r.MJ({
                            value: "",
                            disabled: this.api.device_capability.getVal("troubleshooting", "speedTest", "TR-143serverSettings", "wanConnectionList").isDisabled
                        }),
                        uploadServerUrl: new r.MJ({
                            value: "",
                            disabled: this.api.device_capability.getVal("troubleshooting", "speedTest", "TR-143serverSettings", "uploadTestServerURL").isDisabled
                        }, [r.k0.required, g.N.fqdnUrlValidation()]),
                        downloadServerUrl: new r.MJ({
                            value: "",
                            disabled: this.api.device_capability.getVal("troubleshooting", "speedTest", "TR-143serverSettings", "downloadTestServerURL").isDisabled
                        }, [r.k0.required, g.N.fqdnUrlValidation()]),
                        hostIpAddress: new r.MJ({
                            value: "",
                            disabled: this.api.device_capability.getVal("troubleshooting", "speedTest", "TR-143serverSettings", "host").isDisabled
                        }, [r.k0.required, g.N.hostAddressValidator()]),
                        testMode: new r.MJ({
                            value: "",
                            disabled: this.api.device_capability.getVal("troubleshooting", "speedTest", "TR-143serverSettings", "testMode").isDisabled
                        }),
                        timeDuration: new r.MJ({
                            value: "",
                            disabled: this.api.device_capability.getVal("troubleshooting", "speedTest", "TR-143serverSettings", "duration").isDisabled
                        }, [r.k0.required, r.k0.min(1), r.k0.max(999), r.k0.pattern("^[0-9]+$")]),
                        uploadConnections: new r.MJ({
                            value: "",
                            disabled: this.api.device_capability.getVal("troubleshooting", "speedTest", "TR-143serverSettings", "uploadConnections").isDisabled
                        }, [r.k0.required, r.k0.min(1), r.k0.max(10), r.k0.pattern("^[0-9]+$")]),
                        downloadConnections: new r.MJ({
                            value: "",
                            disabled: this.api.device_capability.getVal("troubleshooting", "speedTest", "TR-143serverSettings", "downloadConnections").isDisabled
                        }, [r.k0.required, r.k0.min(1), r.k0.max(10), r.k0.pattern("^[0-9]+$")])
                    }), this.prodcfg.supportsFWADevice ? (this.speedTestForm.addControl("uploadFileSize", new r.MJ({
                        value: "",
                        disabled: this.api.device_capability.getVal("troubleshooting", "speedTest", "TR-143serverSettings", "uploadFileSize").isDisabled
                    }, [r.k0.required, r.k0.min(1), r.k0.max(4294), r.k0.pattern("^[0-9]+$")])), this.speedTestErrorLog = this.constants.PLEASE_ENTER_VALID_FILE_SIZE_2) : (this.speedTestForm.addControl("uploadFileSize", new r.MJ({
                        value: "",
                        disabled: this.api.device_capability.getVal("troubleshooting", "speedTest", "TR-143serverSettings", "uploadFileSize").isDisabled
                    }, [r.k0.required, r.k0.min(1), r.k0.max(17179), r.k0.pattern("^[0-9]+$")])), this.speedTestErrorLog = this.constants.PLEASE_ENTER_VALID_FILE_SIZE)
                }

                ngOnDestroy() {
                    this.speedTestParams = "", this.pureViewSnackbarService.hideMessageSnackbar(), this.pageRefreshSub.unsubscribe(), this.portalContent?.isAttached && this.portalContent.detach(), this.isLoading = !1, this.alertUtil.hideContentModalLoader(), this.stopSpeedTest()
                }

                onChanges() {
                    this.ispageLoaded = !0, this.testMode.valueChanges.subscribe(t => {
                        "file" == t ? (this.showTimeBasedSpeedTest = !1, this.showFileBasedSpeedTest = !0, this.uploadFileSize.enable(), this.timeDuration.disable(), (this.ispageLoaded || this.uploadFileSize?.value) && this.api.get_speedtest_info.upload_diag[0]?.X_ALU_COM_TestFileLength && 1 != this.api.get_speedtest_info.upload_diag[0]?.X_ALU_COM_TestFileLength ? (this.uploadFileSize.markAsUntouched(), this.ispageLoaded = !1) : this.testMode.touched && this.uploadFileSize.markAsTouched()) : "time" == t && (this.showTimeBasedSpeedTest = !0, this.showFileBasedSpeedTest = !1, this.timeDuration.enable(), this.uploadFileSize.disable(), (this.ispageLoaded || this.timeDuration?.value) && this.api.get_speedtest_info.download_diag[0]?.TimeBasedTestDuration ? (this.timeDuration.markAsUntouched(), this.ispageLoaded = !1) : this.timeDuration.markAsTouched())
                    })
                }

                hasError(t, i, o) {
                    if ("required" !== o) {
                        if ("pattern" === o) return !t.controls[i].hasError("required") && t.controls[i].hasError(o) && t.controls[i].touched;
                        if ("max" === o) return !t.controls[i].hasError("required") && ("" == t.controls[i].value || t.controls[i].value < 1 || t.controls[i].hasError(o) && !(parseInt(t.controls[i]?.errors?.max?.actual) <= parseInt(t.controls[i] && t.controls[i]?.errors?.max?.max)));
                        if ("hostIp" === o) return !t.controls[i].hasError("required") && t.controls[i].hasError(o);
                        if ("notValidUrl" === o) return !t.controls[i].hasError("required") && t.controls[i].hasError(o)
                    }
                }

                startSpeedTest() {
                    this.alertUtil.showAlert({
                        title: this.constants.WARNING,
                        SHOW_DEFAULT_BUTTON: !1,
                        SHOW_HEADER_CLOSE_BUTTON: !1,
                        CALLBACK_1_TITLE: this.constants.CANCEL,
                        CALLBACK_2_TITLE: this.constants.START,
                        message: this.constants.SPEED_TEST_CONFIRM_MESSAGE
                    }, () => {
                        this.logger.console("Callback 1 - Cancel")
                    }, () => {
                        this.logger.console("Callback 2 - Enable"), this.pureViewSnackbarService.hideMessageSnackbar(), this.speedTestStarted = !0, this.speedTestInprogress = !0, this.isSpeedTestTrigger = !0, this.saveSpeedTestDetails()
                    })
                }

                saveSpeedTestDetails() {
                    this.speedTestOperationFailed = 0;
                    let t = "";
                    this.speedTestForm.valid ? (this.wanValue = this.wanConnection.value, t = `&upload_interface=${encodeURIComponent(this.wanConnection.value)}&upload_url=${encodeURIComponent(this.uploadServerUrl.value)}&download_interface=${encodeURIComponent(this.wanConnection.value)}&download_url=${encodeURIComponent(this.downloadServerUrl.value)}&host_ip=${encodeURIComponent(this.hostIpAddress.value)}&numberof_upload_connections=${this.uploadConnections.value}&numberof_download_connections=${this.downloadConnections.value}&latency_interface=${encodeURIComponent(this.wanConnection.value)}`, "file" == this.testMode.value ? t += `&upload_file_size=${this.utility.mbToBytes(this.uploadFileSize.value)}` : "time" == this.testMode.value && (t += `&duration=${this.timeDuration.value}`), this.logger.console("Speed Test Form post data:", t), this.speedTestParams = t, this.isSpeedTestTrigger ? this.api.device_capability.getVal("troubleshooting", "speedTest", "saveButton").isOn ? this.api.request({
                        onSuccess: i => {
                            const o = i?.data;
                            -1 == Number(o?.ret) || 9001 == Number(o?.ret) ? this.customMessageDisplay(this.constants.SPEED_TEST_INPROGESS) : this.api.request(this, "setSpeedTestLatency", t)
                        }, onError: i => {
                            this.stopSpeedTest()
                        }
                    }, "setSpeedTestData", t) : this.api.request(this, "setSpeedTestLatency", t) : (this.disableSave = !0, this.saveInprogress = !0, this.api.request(this, "setSpeedTestData", t))) : (this.speedTestForm.markAllAsTouched(), this.speedTestInprogress = !1, this.isSpeedTestTrigger = !1)
                }

                populateSpeedTestForm(t) {
                    if (this.wanConnectionList = [], t) if (this.uploadServerUrl.setValue(t.upload_diag[0].UploadURL), this.uploadConnections.setValue(t.upload_diag[0].NumberOfConnections), this.downloadServerUrl.setValue(t.download_diag[0].DownloadURL), this.downloadConnections.setValue(t.download_diag[0].NumberOfConnections), this.hostIpAddress.setValue(t.Host_info[0].HostList), t.upload_diag[0]?.TimeBasedTestDuration ? (this.timeDuration.setValue(t.upload_diag[0].TimeBasedTestDuration), this.testMode.setValue("time")) : t.upload_diag[0]?.X_ALU_COM_TestFileLength && this.testMode.setValue("file"), this.utility.bytesToMB(t.upload_diag[0].X_ALU_COM_TestFileLength) > 0 && this.uploadFileSize.setValue(this.utility.bytesToMB(t.upload_diag[0].X_ALU_COM_TestFileLength)), t.wan_connection_list.length > 0) if (t.wan_connection_list.forEach(i => {
                        this.wanConnectionList.push({value: i.CandidateWANConnection, label: i.Name})
                    }), t.upload_diag[0].Interface) for (let i = 0; i < t.wan_connection_list.length; i++) t.upload_diag[0].Interface === this.wanConnectionList[i].value && this.wanConnection.setValue(this.wanConnectionList[i].value); else !t.upload_diag[0].Interface && this.wanConnectionList[this.index] && (this.wanConnection.setValue(this.wanConnectionList[this.index].value), window.setTimeout(() => {
                        this.wanConnection.setValue(this.wanConnectionList[this.index].value)
                    }, 100)); else this.wanConnection.setValue(this.wanValue)
                }

                populateSpeedTestResult(t) {
                    const i = o => {
                        const T = o.toUpperCase().split("MBPS")[0];
                        return Number(T) ? parseFloat(T).toFixed(2) + " " + this.constants.MBPS : "-"
                    };
                    t && (this.uploadSpeed = t?.Upload_Speed && "" !== t?.Upload_Speed ? i(t?.Upload_Speed) : "-", this.downloadSpeed = t?.Download_Speed && "" !== t?.Download_Speed ? i(t?.Download_Speed) : "-", this.latency = t?.AverageResponseTime && "" !== t?.AverageResponseTime && t?.AverageResponseTime > 0 ? Math.round(t?.AverageResponseTime / 1e3) + " " + this.constants.MILLI_SECONDS : "0")
                }

                speedTestPollingTimer(t, i, o) {
                    try {
                        if ("REQUESTED" == t?.DiagnosticsState?.toUpperCase()) this.speedTestPolling || (this.speedTestPolling = setInterval(() => {
                            this.api.request(this, i)
                        }, 5e3)); else if ("COMPLETED" == t?.DiagnosticsState.toUpperCase()) clearInterval(this.speedTestPolling), this.speedTestPolling = void 0, o ? this.api.request(this, o, "") : (this.logger.console("Polling done"), this.api.request(this, "getSpeedTestResultData")); else {
                            switch (i) {
                                case"getSpeedTestLatency":
                                    this.customMessageDisplay(this.constants.SPEED_TEST_LATENCY_FAILED), this.api.request(this, o, ""), this.speedTestOperationFailed++;
                                    break;
                                case"getSpeedTestUpload":
                                    this.customMessageDisplay(this.constants.SPEED_TEST_UPLOAD_FAILED), this.api.request(this, o, ""), this.speedTestOperationFailed++;
                                    break;
                                case"getSpeedTestDownload":
                                    this.customMessageDisplay(this.constants.SPEED_TEST_DOWNLOAD_FAILED), this.api.request(this, o, ""), this.logger.console("Polling done"), this.api.request(this, "getSpeedTestResultData"), this.speedTestOperationFailed++
                            }
                            clearInterval(this.speedTestPolling), this.speedTestPolling = void 0
                        }
                    } catch (T) {
                        this.logger.console("Speed Test Polling Failed", T)
                    }
                }

                stopSpeedTest() {
                    this.isSpeedTestTrigger = !1, this.speedTestInprogress = !1, this.showSpeedTestTriggerIcon = !1, this.speedTestStarted = !1, clearInterval(this.speedTestPolling), this.speedTestPolling = void 0
                }

                onSuccess(t) {
                    const i = t.data;
                    switch (t.action) {
                        case d.En.GET_ROUTER_INFO:
                            this.loadRouterInfo(this.api);
                            break;
                        case d.En.GET_SPEEDTEST_RESULT_INFO:
                            this.speedTestStarted && (setTimeout(() => {
                                this.speedTestInprogress = !1, this.showSpeedTestTriggerIcon = !0
                            }, 100), setTimeout(() => {
                                this.isSpeedTestTrigger = !1, this.showSpeedTestTriggerIcon = !1, i?.Upload_Speed && i?.Download_Speed && i?.AverageResponseTime && !this.speedTestOperationFailed && this.customMessageDisplay(this.constants.SPEED_TEST_COMPLETED, "tick_circle_white", "success")
                            }, 500)), this.populateSpeedTestResult(i), this.speedTestStarted = !1, setTimeout(() => {
                                this.isLoading = !1
                            }, 0), this.alertUtil.hideContentModalLoader();
                            break;
                        case d.En.GET_SPEEDTEST_INFO:
                            this.logger.console(i), this.populateSpeedTestForm(i), setTimeout(() => {
                                this.isLoading = !1
                            }, 100), this.alertUtil.hideContentModalLoader();
                            break;
                        case d.En.SET_SPEEDTEST_INFO:
                            this.logger.console(i), (-1 == Number(i?.ret) || 9001 == Number(i?.ret)) && this.customMessageDisplay(this.constants.SPEED_TEST_INPROGESS), setTimeout(() => {
                                this.saveInprogress = !1, this.showSaveIcon = !0
                            }, 200), setTimeout(() => {
                                this.showSaveIcon = !1
                            }, 500), this.speedTestInprogress ? (this.api.request(this, "getSpeedTestData"), this.api.request(this, "getSpeedTestResultData")) : this.api.request(this, "getSpeedTestData");
                            break;
                        case d.En.SET_SPEEDTEST_LATENCY:
                            this.logger.console(i), (-1 == Number(i?.ret) || 9001 == Number(i?.ret)) && (this.stopSpeedTest(), this.customMessageDisplay(this.constants.SPEED_TEST_INPROGESS)), i?.ret || (0 == i?.reason && 0 == i?.result ? this.api.request(this, "getSpeedTestLatency") : (this.stopSpeedTest(), this.customMessageDisplay(this.constants.SPEED_TEST_LATENCY_FAILED))), (-1 == Number(i?.ret) || 9001 == Number(i?.ret)) && this.customMessageDisplay(this.constants.SPEED_TEST_INPROGESS);
                            break;
                        case d.En.SET_SPEEDTEST_UPLOAD:
                            this.logger.console(i), (-1 == Number(i?.ret) || 9001 == Number(i?.ret)) && (this.stopSpeedTest(), this.customMessageDisplay(this.constants.SPEED_TEST_INPROGESS)), i?.ret || (0 == i?.reason && 0 == i?.result ? this.api.request(this, "getSpeedTestUpload") : i?.reason.toUpperCase().includes("") && (this.stopSpeedTest(), this.customMessageDisplay(this.constants.SPEED_TEST_UPLOAD_FAILED)));
                            break;
                        case d.En.SET_SPEEDTEST_DOWNLOAD:
                            this.logger.console(i), (-1 == Number(i?.ret) || 9001 == Number(i?.ret)) && (this.stopSpeedTest(), this.customMessageDisplay(this.constants.SPEED_TEST_INPROGESS)), i?.ret || (0 == i?.reason && 0 == i?.result ? this.api.request(this, "getSpeedTestDownload") : (this.stopSpeedTest(), this.customMessageDisplay(this.constants.SPEED_TEST_DOWNLOAD_FAILED)));
                            break;
                        case d.En.GET_SPEEDTEST_LATENCY:
                            this.logger.console(i), this.speedTestPollingTimer(i, "getSpeedTestLatency", "setSpeedTestUpload");
                            break;
                        case d.En.GET_SPEEDTEST_UPLOAD:
                            this.logger.console(i), this.speedTestPollingTimer(i, "getSpeedTestUpload", "setSpeedTestDownload");
                            break;
                        case d.En.GET_SPEEDTEST_DOWNLOAD:
                            this.logger.console(i), this.speedTestPollingTimer(i, "getSpeedTestDownload", void 0)
                    }
                }

                onError(t) {
                    switch (t.action) {
                        case d.En.GET_ROUTER_INFO:
                            console.error("GET_ROUTER_INFO API Failed - Error"), console.error(t);
                            break;
                        case d.En.GET_SPEEDTEST_RESULT_INFO:
                            this.isLoading = !1, console.error("GET_SPEED_TEST_RESULT API Failed - Error"), console.error(t), this.stopSpeedTest();
                            break;
                        case d.En.GET_SPEEDTEST_INFO:
                            console.error("GET_SPEED_TEST_INFO API Failed - Error"), console.error(t), this.showSaveIcon = !1, this.disableSave = !1, this.isLoading = !1, this.alertUtil.hideContentModalLoader();
                            break;
                        case d.En.SET_SPEEDTEST_INFO:
                            this.showSaveIcon = !1, this.disableSave = !1, this.saveInprogress = !1, console.error("SET_SPEED_TEST API Failed - Error"), console.error(t);
                            break;
                        case d.En.SET_SPEEDTEST_LATENCY:
                        case d.En.SET_SPEEDTEST_UPLOAD:
                        case d.En.SET_SPEEDTEST_DOWNLOAD:
                            console.error("SET_SPEED_TEST API Failed - Error"), console.error(t), this.stopSpeedTest();
                            break;
                        case d.En.GET_SPEEDTEST_LATENCY:
                            console.error("SET_SPEED_TEST API Failed - Error"), console.error(t), t.status && t.status > 499 && t.status < 600 ? this.speedTestPollingTimer({DiagnosticsState: "Requested"}, "getSpeedTestLatency", void 0) : (clearInterval(this.speedTestPolling), this.speedTestPolling = void 0, this.api.request(this, "setSpeedTestUpload"));
                            break;
                        case d.En.GET_SPEEDTEST_UPLOAD:
                            console.error("SET_SPEED_TEST API Failed - Error"), console.error(t), t.status && t.status > 499 && t.status < 600 ? this.speedTestPollingTimer({DiagnosticsState: "Requested"}, "getSpeedTestUpload", void 0) : (clearInterval(this.speedTestPolling), this.speedTestPolling = void 0, this.api.request(this, "setSpeedTestDownload"));
                            break;
                        case d.En.GET_SPEEDTEST_DOWNLOAD:
                            console.error("SET_SPEED_TEST API Failed - Error"), console.error(t), t.status && t.status > 499 && t.status < 600 ? this.speedTestPollingTimer({DiagnosticsState: "Requested"}, "getSpeedTestDownload", void 0) : (clearInterval(this.speedTestPolling), this.speedTestPolling = void 0, this.stopSpeedTest())
                    }
                }

                customMessageDisplay(t, i, o) {
                    this.pureViewSnackbarService.showMessageSnackbar({
                        show: !0,
                        width: "300px",
                        description: t,
                        cssClass: o || "error",
                        iconAfter: "close_mini",
                        iconBefore: i || "error_icon_black"
                    })
                }

                get speedTestFormControl() {
                    return this.speedTestForm.controls
                }

                get testMode() {
                    return this.speedTestForm.get("testMode")
                }

                get wanConnection() {
                    return this.speedTestForm.get("wanConnection")
                }

                get uploadServerUrl() {
                    return this.speedTestForm.get("uploadServerUrl")
                }

                get downloadServerUrl() {
                    return this.speedTestForm.get("downloadServerUrl")
                }

                get hostIpAddress() {
                    return this.speedTestForm.get("hostIpAddress")
                }

                get uploadFileSize() {
                    return this.speedTestForm.get("uploadFileSize")
                }

                get timeDuration() {
                    return this.speedTestForm.get("timeDuration")
                }

                get uploadConnections() {
                    return this.speedTestForm.get("uploadConnections")
                }

                get downloadConnections() {
                    return this.speedTestForm.get("downloadConnections")
                }

                static #e = this.\u0275fac = function (i) {
                    return new (i || s)(e.rXU(n.m4), e.rXU(l.YM), e.rXU(u._), e.rXU(c.V), e.rXU(v.G), e.rXU(R.l), e.rXU(D.Q), e.rXU(y.n), e.rXU(n.gd), e.rXU(V.V), e.rXU(P.Z))
                };
                static #t = this.\u0275cmp = e.VBU({
                    type: s,
                    selectors: [["app-speed-test"]],
                    viewQuery: function (i, o) {
                        if (1 & i && e.GBs(S.bV, 7), 2 & i) {
                            let T;
                            e.mGM(T = e.lsd()) && (o.portalContent = T.first)
                        }
                    },
                    decls: 2,
                    vars: 1,
                    consts: [["class", "flex-column grid-gap-24 speedtest__form", 4, "ngIf"], [4, "cdkPortal"], [1, "flex-column", "grid-gap-24", "speedtest__form"], [4, "ngIf"], ["class", "speedtest__form__results", 4, "ngIf"], [1, "flex-column", "grid-gap-24", 3, "formGroup"], ["h2-bold", "", "mb-6", "", 3, "title"], ["pb-4", "", 3, "hasBorder", "rowLayout", 4, "ngIf"], ["pb-4", "", 3, "hasBorder", "rowLayout"], [3, "title"], [1, "speedtest__form-control"], ["size", "MEDIUM", "formControlName", "uploadServerUrl", 3, "hideErrorIcon", "placeholder", "disabled", "type", "isValidated"], ["pt-1", "", "body1-regular", "", "class", "error-message", 3, "title", 4, "ngIf"], ["pt-1", "", "body1-regular", "", 1, "error-message", 3, "title"], ["size", "MEDIUM", "formControlName", "uploadConnections", 3, "type", "onlyNumber", "placeholder", "disabled", "hideErrorIcon", "isValidated"], ["size", "MEDIUM", "formControlName", "downloadServerUrl", 3, "hideErrorIcon", "placeholder", "disabled", "type", "isValidated"], ["size", "MEDIUM", "formControlName", "downloadConnections", 3, "type", "onlyNumber", "placeholder", "disabled", "hideErrorIcon", "isValidated"], ["size", "MEDIUM", "formControlName", "hostIpAddress", 3, "placeholder", "disabled", "hideErrorIcon", "isValidated"], ["formControlName", "testMode", "size", "MEDIUM", 3, "disabled"], [3, "label", "value", 4, "ngFor", "ngForOf"], [3, "label", "value"], ["size", "MEDIUM", "formControlName", "uploadFileSize", 3, "type", "onlyNumber", "placeholder", "disabled", "hideErrorIcon", "isValidated"], ["formControlName", "wanConnection", "size", "MEDIUM", 1, "ifaceNumbers", 3, "disabled"], ["size", "MEDIUM", "formControlName", "timeDuration", 3, "type", "onlyNumber", "placeholder", "disabled", "hideErrorIcon", "isValidated"], [1, "speedtest__form__results"], ["class", "simple-list", 3, "caption", "value", 4, "ngIf"], ["class", "flex-row flex-row__end-start", 4, "ngIf"], [1, "simple-list", 3, "caption", "value"], [1, "flex-row", "flex-row__end-start"], ["size", "small", "mt-3", "", 3, "onClick", "isDisabled", "webSave", "showButtonLoader", "title"], [1, "flex-row", "flex-row__center"], ["buttonType", "submit", "size", "small", "mr-2", "", 3, "onClick", "title", "webSave", "showButtonLoader", "isDisabled"]],
                    template: function (i, o) {
                        1 & i && e.DNE(0, pe, 3, 2, "div", 0)(1, ce, 2, 1, "ng-container", 1), 2 & i && e.Y8G("ngIf", !o.isLoading)
                    },
                    dependencies: [C.Sq, C.bT, r.qT, r.BC, r.cb, n.Ns, n.xJ, n.Sp, n.XL, n.v9, n.X, n.RA, n.Od, r.j4, r.JD, S.bV],
                    styles: [".speedtest__form[_ngcontent-%COMP%]   .speedtest__form-control[_ngcontent-%COMP%]{width:320px}.speedtest__form__results[_ngcontent-%COMP%]   .simple-list[_ngcontent-%COMP%]{font-size:14px}"]
                })
            }

            return s
        })();
        var G = p(7435), _e = p(3995), Te = p(4796), ge = p(2960);

        function fe(s, a) {
            if (1 & s && e.nrm(0, "pv-select-option", 14), 2 & s) {
                const t = a.$implicit;
                e.Y8G("label", t.Name)("value", t)
            }
        }

        function be(s, a) {
            if (1 & s && (e.j41(0, "pv-form-field", 9)(1, "label"), e.nrm(2, "pv-text", 10), e.k0s(), e.j41(3, "span", 11)(4, "pv-select", 12, 0), e.DNE(6, fe, 1, 2, "pv-select-option", 13), e.k0s()()()), 2 & s) {
                const t = e.XpG();
                e.Y8G("disabled", t.api.device_capability.getVal("troubleshooting", "troubleshootingCounters", "wanConnectionList").isDisabled)("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.WAN_CONNECTION_LIST), e.R7$(2), e.Y8G("disabled", t.api.device_capability.getVal("troubleshooting", "troubleshootingCounters", "wanConnectionList").isDisabled)("placeHolder", t.constants.SELECT_OPTION), e.R7$(2), e.Y8G("ngForOf", t.wanConnectionList)
            }
        }

        function ve(s, a) {
            if (1 & s && (e.j41(0, "pv-form-field", 9)(1, "label"), e.nrm(2, "pv-text", 10), e.k0s(), e.j41(3, "span", 11), e.nrm(4, "pv-inputbox", 15), e.k0s()()), 2 & s) {
                const t = e.XpG();
                e.Y8G("disabled", t.api.device_capability.getVal("troubleshooting", "troubleshootingCounters", "wanStatus").isDisabled)("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.WAN_STATUS), e.R7$(2), e.Y8G("disabled", t.api.device_capability.getVal("troubleshooting", "troubleshootingCounters", "wanStatus").isDisabled)("isValidated", !0)
            }
        }

        function me(s, a) {
            if (1 & s && e.nrm(0, "pv-text", 19), 2 & s) {
                const t = e.XpG(2);
                e.Y8G("title", t.uploadSpeed)
            }
        }

        function Ee(s, a) {
            if (1 & s) {
                const t = e.RV6();
                e.j41(0, "pv-form-field", 9)(1, "label"), e.nrm(2, "pv-text", 10), e.k0s(), e.j41(3, "span", 16), e.DNE(4, me, 1, 1, "pv-text", 17), e.j41(5, "pv-button", 18), e.bIt("onClick", function () {
                    e.eBV(t);
                    const o = e.XpG();
                    return e.Njj(o.uploadSpeedTest())
                }), e.k0s()()()
            }
            if (2 & s) {
                const t = e.XpG();
                e.Y8G("disabled", t.api.device_capability.getVal("troubleshooting", "troubleshootingCounters", "usThroughput").isDisabled)("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.US_THROUGHPUT), e.R7$(2), e.Y8G("ngIf", t.uploadSpeed), e.R7$(), e.Y8G("isDisabled", t.isCFGMode || t.showDSLoader || t.buttonDisable || t.api.device_capability.getVal("troubleshooting", "troubleshootingCounters", "usThroughput").isDisabled)("showButtonLoader", t.showUSLoader)("troubleLoader", !0)("title", t.constants.US_SPEED_TEST)
            }
        }

        function Se(s, a) {
            if (1 & s && e.nrm(0, "pv-text", 19), 2 & s) {
                const t = e.XpG(2);
                e.Y8G("title", t.downloadSpeed)
            }
        }

        function De(s, a) {
            if (1 & s) {
                const t = e.RV6();
                e.j41(0, "pv-form-field", 9)(1, "label"), e.nrm(2, "pv-text", 10), e.k0s(), e.j41(3, "span", 16), e.DNE(4, Se, 1, 1, "pv-text", 17), e.j41(5, "pv-button", 20), e.bIt("onClick", function () {
                    e.eBV(t);
                    const o = e.XpG();
                    return e.Njj(o.downloadSpeedTest())
                }), e.k0s()()()
            }
            if (2 & s) {
                const t = e.XpG();
                e.Y8G("disabled", t.api.device_capability.getVal("troubleshooting", "troubleshootingCounters", "dsThroughput").isDisabled)("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.DS_THROUGHPUT), e.R7$(2), e.Y8G("ngIf", t.downloadSpeed), e.R7$(), e.Y8G("isDisabled", t.isCFGMode || t.showUSLoader || t.buttonDisable || t.api.device_capability.getVal("troubleshooting", "troubleshootingCounters", "dsThroughput").isDisabled)("showButtonLoader", t.showDSLoader)("troubleLoader", !0)("title", t.constants.DS_SPEED_TEST)
            }
        }

        function Ce(s, a) {
            if (1 & s && (e.j41(0, "pv-form-field", 9)(1, "label"), e.nrm(2, "pv-text", 10), e.k0s(), e.j41(3, "span", 11), e.nrm(4, "pv-inputbox", 21), e.k0s()()), 2 & s) {
                const t = e.XpG();
                e.Y8G("disabled", t.api.device_capability.getVal("troubleshooting", "troubleshootingCounters", "usPacketLoss").isDisabled)("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.US_PACKET_LOSS), e.R7$(2), e.Y8G("disabled", t.api.device_capability.getVal("troubleshooting", "troubleshootingCounters", "usPacketLoss").isDisabled)("isValidated", !0)
            }
        }

        function Re(s, a) {
            if (1 & s && (e.j41(0, "pv-form-field", 9)(1, "label"), e.nrm(2, "pv-text", 10), e.k0s(), e.j41(3, "span", 11), e.nrm(4, "pv-inputbox", 22), e.k0s()()), 2 & s) {
                const t = e.XpG();
                e.Y8G("disabled", t.api.device_capability.getVal("troubleshooting", "troubleshootingCounters", "dsPacketLoss").isDisabled)("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.DS_PACKET_LOSS), e.R7$(2), e.Y8G("disabled", t.api.device_capability.getVal("troubleshooting", "troubleshootingCounters", "dsPacketLoss").isDisabled)("isValidated", !0)
            }
        }

        function Le(s, a) {
            if (1 & s && e.nrm(0, "pv-text", 29), 2 & s) {
                const t = e.XpG(2);
                e.Y8G("title", t.latencyTestResult)
            }
        }

        function Ie(s, a) {
            if (1 & s) {
                const t = e.RV6();
                e.j41(0, "pv-form-field", 23)(1, "label"), e.nrm(2, "pv-text", 10), e.k0s(), e.j41(3, "span")(4, "span", 16), e.DNE(5, Le, 1, 1, "pv-text", 24), e.j41(6, "span", 11), e.nrm(7, "pv-inputbox", 25), e.k0s()(), e.j41(8, "div", 26)(9, "label", 27)(10, "pv-button", 28), e.bIt("onClick", function () {
                    e.eBV(t);
                    const o = e.XpG();
                    return e.Njj(o.doLatencyTest())
                }), e.k0s()()()()()
            }
            if (2 & s) {
                const t = e.XpG();
                e.Y8G("disabled", t.api.device_capability.getVal("troubleshooting", "troubleshootingCounters", "latency").isDisabled)("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.LATENCY), e.R7$(3), e.Y8G("ngIf", t.latencyTestResult), e.R7$(2), e.Y8G("disabled", t.api.device_capability.getVal("troubleshooting", "troubleshootingCounters", "latency").isDisabled)("isValidated", !0), e.R7$(3), e.Y8G("isDisabled", t.buttonDisable || t.latencyInProgress || t.api.device_capability.getVal("troubleshooting", "troubleshootingCounters", "latency").isDisabled)("title", t.constants.LATENCY_TEST)
            }
        }

        function Pe(s, a) {
            if (1 & s && e.nrm(0, "pv-text", 29), 2 & s) {
                const t = e.XpG(2);
                e.Y8G("title", t.dnsResponseTimeResult)
            }
        }

        function Ge(s, a) {
            if (1 & s) {
                const t = e.RV6();
                e.j41(0, "pv-form-field", 23)(1, "label"), e.nrm(2, "pv-text", 10), e.k0s(), e.j41(3, "span")(4, "span", 16), e.DNE(5, Pe, 1, 1, "pv-text", 24), e.j41(6, "span", 11), e.nrm(7, "pv-inputbox", 30), e.k0s()(), e.j41(8, "div", 26)(9, "label", 27)(10, "pv-button", 28), e.bIt("onClick", function () {
                    e.eBV(t);
                    const o = e.XpG();
                    return e.Njj(o.doDnsResponseTest())
                }), e.k0s()()()()()
            }
            if (2 & s) {
                const t = e.XpG();
                e.Y8G("disabled", t.api.device_capability.getVal("troubleshooting", "troubleshootingCounters", "dnsResponseTime").isDisabled)("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.DNS_RES_TIME), e.R7$(3), e.Y8G("ngIf", t.dnsResponseTimeResult), e.R7$(2), e.Y8G("disabled", t.api.device_capability.getVal("troubleshooting", "troubleshootingCounters", "dnsResponseTime").isDisabled)("isValidated", !0), e.R7$(3), e.Y8G("isDisabled", t.buttonDisable || t.dnsInProgress || t.api.device_capability.getVal("troubleshooting", "troubleshootingCounters", "dnsResponseTime").isDisabled)("title", t.constants.DNS_RESPONSE_TEST)
            }
        }

        function we(s, a) {
            if (1 & s && e.nrm(0, "pv-select-option", 14), 2 & s) {
                const t = a.$implicit;
                e.Y8G("label", t.label)("value", t.value)
            }
        }

        function ye(s, a) {
            if (1 & s && (e.j41(0, "pv-form-field", 34)(1, "label"), e.nrm(2, "pv-text", 10), e.k0s(), e.j41(3, "span", 11)(4, "pv-select", 35, 0), e.DNE(6, we, 1, 2, "pv-select-option", 13), e.k0s()()()), 2 & s) {
                const t = e.XpG(2);
                e.Y8G("disabled", t.api.device_capability.getVal("troubleshooting", "portMirror", "sourcePort").isDisabled)("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.SOURCE_PORT), e.R7$(2), e.Y8G("disabled", t.api.device_capability.getVal("troubleshooting", "portMirror", "sourcePort").isDisabled), e.R7$(2), e.Y8G("ngForOf", t.WanList)
            }
        }

        function Ve(s, a) {
            if (1 & s && e.nrm(0, "pv-select-option", 14), 2 & s) {
                const t = a.$implicit;
                e.Y8G("label", t)("value", t)
            }
        }

        function Oe(s, a) {
            if (1 & s && (e.j41(0, "pv-form-field", 9)(1, "label"), e.nrm(2, "pv-text", 10), e.k0s(), e.j41(3, "span", 11)(4, "pv-select", 36, 0), e.DNE(6, Ve, 1, 2, "pv-select-option", 13), e.k0s()()()), 2 & s) {
                const t = e.XpG(2);
                e.Y8G("disabled", t.api.device_capability.getVal("troubleshooting", "portMirror", "destinationPort").isDisabled)("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.DEST_PORT), e.R7$(2), e.Y8G("disabled", t.api.device_capability.getVal("troubleshooting", "portMirror", "destinationPort").isDisabled), e.R7$(2), e.Y8G("ngForOf", t.lanPortList)
            }
        }

        function xe(s, a) {
            if (1 & s && e.nrm(0, "pv-select-option", 14), 2 & s) {
                const t = a.$implicit;
                e.Y8G("label", t.label)("value", t.value)
            }
        }

        function Ne(s, a) {
            if (1 & s && (e.j41(0, "pv-form-field", 9)(1, "label"), e.nrm(2, "pv-text", 10), e.k0s(), e.j41(3, "span", 11)(4, "pv-select", 37, 0), e.DNE(6, xe, 1, 2, "pv-select-option", 13), e.k0s()()()), 2 & s) {
                const t = e.XpG(2);
                e.Y8G("disabled", t.api.device_capability.getVal("troubleshooting", "portMirror", "direction").isDisabled)("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.DIRECTION), e.R7$(2), e.Y8G("disabled", t.api.device_capability.getVal("troubleshooting", "portMirror", "direction").isDisabled)("placeHolder", t.constants.SELECT_OPTION), e.R7$(2), e.Y8G("ngForOf", t.directionList)
            }
        }

        function Ae(s, a) {
            if (1 & s && e.nrm(0, "pv-select-option", 14), 2 & s) {
                const t = a.$implicit;
                e.Y8G("label", t.label)("value", t.value)
            }
        }

        function Me(s, a) {
            if (1 & s && (e.j41(0, "pv-form-field", 9)(1, "label"), e.nrm(2, "pv-text", 10), e.k0s(), e.j41(3, "span", 11)(4, "pv-select", 38, 0), e.DNE(6, Ae, 1, 2, "pv-select-option", 13), e.k0s()()()), 2 & s) {
                const t = e.XpG(2);
                e.Y8G("disabled", t.api.device_capability.getVal("troubleshooting", "portMirror", "status").isDisabled)("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.STATUS_LABEL), e.R7$(2), e.Y8G("disabled", t.api.device_capability.getVal("troubleshooting", "portMirror", "status").isDisabled), e.R7$(2), e.Y8G("ngForOf", t.EnableDisableList)
            }
        }

        function Ue(s, a) {
            if (1 & s) {
                const t = e.RV6();
                e.j41(0, "pv-button", 39), e.bIt("onClick", function () {
                    e.eBV(t);
                    const o = e.XpG(2);
                    return e.Njj(o.savePortMirror())
                }), e.k0s()
            }
            if (2 & s) {
                const t = e.XpG(2);
                e.Y8G("isDisabled", t.isCFGMode || 0 === t.directionList.length || t.portMirrorInProgress || t.api.device_capability.getVal("troubleshooting", "portMirror", "saveButton").isDisabled)("title", t.constants.SAVE)
            }
        }

        function Fe(s, a) {
            if (1 & s && (e.j41(0, "pv-card", 3), e.nrm(1, "pv-text", 31), e.DNE(2, ye, 7, 6, "pv-form-field", 32)(3, Oe, 7, 6, "pv-form-field", 4)(4, Ne, 7, 7, "pv-form-field", 4)(5, Me, 7, 6, "pv-form-field", 4), e.j41(6, "div", 16), e.DNE(7, Ue, 1, 2, "pv-button", 33), e.k0s()()), 2 & s) {
                const t = e.XpG();
                e.R7$(), e.Y8G("title", t.constants.PORT_MIRRORS), e.R7$(), e.Y8G("ngIf", t.api.device_capability.getVal("troubleshooting", "portMirror", "sourcePort").isOn), e.R7$(), e.Y8G("ngIf", t.api.device_capability.getVal("troubleshooting", "portMirror", "destinationPort").isOn), e.R7$(), e.Y8G("ngIf", t.api.device_capability.getVal("troubleshooting", "portMirror", "direction").isOn), e.R7$(), e.Y8G("ngIf", t.api.device_capability.getVal("troubleshooting", "portMirror", "status").isOn), e.R7$(2), e.Y8G("ngIf", t.api.device_capability.getVal("troubleshooting", "portMirror", "saveButton").isOn)
            }
        }

        function ke(s, a) {
            if (1 & s) {
                const t = e.RV6();
                e.j41(0, "pv-table", 40), e.bIt("onclickDelete", function (o) {
                    e.eBV(t);
                    const T = e.XpG();
                    return e.Njj(T.deletePortMirror(o))
                }), e.k0s()
            }
            if (2 & s) {
                const t = e.XpG();
                e.Y8G("pvDataTable", !0)("pvDataTableColum", t.deviceTableColumn)("pvDataTableArray", t.tableArray)("isStickyEnd", !0)("buttonText", t.constants.DELETE)
            }
        }

        const Ye = [{path: "", redirectTo: "troubleshooting-counters", pathMatch: "full"}, {
            path: "troubleshooting-counters", component: (() => {
                class s {
                    constructor(t, i, o, T, f, _, h, m, L, I) {
                        this.message = t, this.appAccessService = i, this.api = o, this.constants = T, this.validations = f, this.auth = _, this.pubSubService = h, this.gconfig = m, this.pureViewSnackbarService = L, this.prodcfg = I, this.EnableDisableList = [{
                            label: this.constants.ENABLE_LABEL,
                            value: 1
                        }], this.WanList = [{
                            label: "WAN",
                            value: "WAN"
                        }], this.ipRegEx = "^([0-9]{1,3}).([0-9]{1,3}).([0-9]{1,3}).([0-9]{1,3})$", this.deviceTableColumn = [{
                            label: this.constants.SOURCE_PORT,
                            value: "srcPort"
                        }, {
                            label: this.constants.DESTINATION_PORT,
                            value: "destPort"
                        }, {label: this.constants.DIRECTION, value: "direction"}, {
                            label: this.constants.DELETE,
                            value: "actionDelete",
                            sticky: !0,
                            align: G.C.CENTER
                        }], this.macAddressValidated = !0, this.macAddressErrorM = "", this.showUSLoader = !1, this.showDSLoader = !1, this.uploadInProgress = !1, this.downLoadinProgress = !1, this.latencyInProgress = !1, this.dnsInProgress = !1, this.portMirrorInProgress = !1, this.emptyPing = !1, this.isshow = !1, this.isCFGMode = !1, this.wanConnectionList = [], this.buttonDisable = !1, this.activeStatus = "", this.lanPortList = [], this.directionList = [], this.tableData = [], this.tableArray = [], this.uploadSpeed = "", this.downloadSpeed = "", this.dnsResponseTimeResult = "", this.latencyTestResult = "", this.selectedWan = [], this.disableDeleteBtn = !1, this.disableRefreshBtn = !1, this.showPortMirror = !1, this.pingParams = !1, this.selectedWanList = [], this.uploadParams = "", this.downloadParams = "", this.dnsParams = "", this.isBidirectionalSupport = !1, this.isMTKBoard = !1, this.troubleshootForm = new r.gE({
                            wanConnList: new r.MJ({
                                value: "",
                                disabled: this.api.device_capability.getVal("troubleshooting", "troubleshootingCounters", "wanConnectionList").isDisabled
                            }),
                            wanStatus: new r.MJ({
                                value: "",
                                disabled: this.api.device_capability.getVal("troubleshooting", "troubleshootingCounters", "wanStatus").isDisabled
                            }),
                            wanFailure: new r.MJ({value: "", disabled: !1}),
                            usPacketLoss: new r.MJ({
                                value: "",
                                disabled: this.api.device_capability.getVal("troubleshooting", "troubleshootingCounters", "usPacketLoss").isDisabled
                            }),
                            dsPacketLoss: new r.MJ({
                                value: "",
                                disabled: this.api.device_capability.getVal("troubleshooting", "troubleshootingCounters", "dsPacketLoss").isDisabled
                            }),
                            tsCountersWanStatus: new r.MJ({value: "", disabled: !1}),
                            latencyTest: new r.MJ({
                                value: "",
                                disabled: this.api.device_capability.getVal("troubleshooting", "troubleshootingCounters", "latency").isDisabled
                            }),
                            dnsResponseTime: new r.MJ({
                                value: "",
                                disabled: this.api.device_capability.getVal("troubleshooting", "troubleshootingCounters", "dnsResponseTime").isDisabled
                            }),
                            tblSrcPort: new r.MJ({
                                value: "",
                                disabled: this.api.device_capability.getVal("troubleshooting", "portMirror", "sourcePort").isDisabled
                            }),
                            tblDestPort: new r.MJ({
                                value: "",
                                disabled: this.api.device_capability.getVal("troubleshooting", "portMirror", "destinationPort").isDisabled
                            }),
                            tblDirection: new r.MJ({
                                value: "",
                                disabled: this.api.device_capability.getVal("troubleshooting", "portMirror", "direction").isDisabled
                            }),
                            tblStatus: new r.MJ({
                                value: "",
                                disabled: this.api.device_capability.getVal("troubleshooting", "portMirror", "status").isDisabled
                            })
                        }), this.pubSubService.publish(d.VR.SHOW_HEADER_REFRESH_BUTTON, !0), "" !== this.api.router_info.gwmodel ? this.loadRouterInfo(this.api) : this.api.request(this, "getRouterInfo")
                    }

                    loadRouterInfo(t) {
                        this.isMTKBoard = this.prodcfg.MTKBoard, this.isBidirectionalSupport = this.isMTKBoard || this.prodcfg.isRealtekBoard, this.showPortMirror = this.prodcfg.supportsPortMirror, this.isCFGMode = -1 === t.brEnable, this.isCFGMode && this.showWarning(this.constants.CFG_WARNING), this.api.get_troubleshoot_info.lan_ether.length && this.syncTroubleShootData(this.api.get_troubleshoot_info)
                    }

                    ngOnInit() {
                        this.getTroubleShootInfo(), this.onChanges(), this.pageRefresh(), this.onLanguageChanges()
                    }

                    pageRefresh() {
                        this.pageRefreshSub = this.pubSubService.subscribe(d.VR.HEADER_REFRESH_CLICKED, t => {
                            this.getTroubleShootInfo()
                        })
                    }

                    onLanguageChanges() {
                        this.langChangeSub = this.pubSubService.subscribe(d.VR.LANGUAGE_CHANGE, t => {
                            this.setValueOnLangChange()
                        })
                    }

                    setValueOnLangChange() {
                        this.syncTroubleShootData(this.api.get_troubleshoot_info), this.deviceTableColumn = [{
                            label: this.constants.SOURCE_PORT,
                            value: "srcPort"
                        }, {
                            label: this.constants.DESTINATION_PORT,
                            value: "destPort"
                        }, {label: this.constants.DIRECTION, value: "direction"}, {
                            label: this.constants.DELETE,
                            value: "actionDelete",
                            sticky: !0,
                            align: G.C.CENTER
                        }], this.EnableDisableList = [{
                            label: this.constants.ENABLE_LABEL,
                            value: 1
                        }], setTimeout(() => {
                            this.tblStatus.setValue(1)
                        }, 100)
                    }

                    ngOnDestroy() {
                        this.message.hideMessage({show: !1}), this.pureViewSnackbarService.hideMessageSnackbar(), this.pageRefreshSub?.unsubscribe(), this.langChangeSub.unsubscribe()
                    }

                    loadTroubleShootInfo() {
                        this.wanConnectionList = [], this.lanPortList = [], this.directionList = [], this.selectedWan = [], this.dnsResponseTimeResult = "", this.latencyTestResult = "", this.getPingIp()
                    }

                    getPingIp() {
                        this.emptyPing = !0, this.api.request(this, "pingIp", "")
                    }

                    getTroubleShootInfo() {
                        this.api.request(this, "getTroubleShootInfo")
                    }

                    syncTroubleShootData(t) {
                        this.tblSrcPort.setValue("WAN"), this.tblStatus.setValue(1), this.tableData = [], this.directionList = [], this.lanPortList = [], this.wanConnectionList = [], this.latencyTest.setValue(""), this.dnsResponseTime.setValue(""), t.wan_conns.forEach(_ => {
                            _.ipConns.length > 0 && _.ipConns.map(h => {
                                (1 === h.X_CT_COM_IPMode || 3 === h.X_CT_COM_IPMode) && "PPPoE_Bridged" !== h.ConnectionType && (this.wanConnectionList.push(h), this.selectedWan.push(_))
                            }), _.pppConns.length > 0 && _.pppConns.forEach(h => {
                                "PPPoE_Bridged" !== h.ConnectionType && (1 === h.X_CT_COM_IPMode || 3 === h.X_CT_COM_IPMode) && (this.wanConnectionList.push(h), this.selectedWan.push(_))
                            })
                        }), t.lan_ether.forEach((_, h) => {
                            _ && "Up" === _.Status && (this.lanPortList.push(`LAN${h + 1}`), 4 === _.X_ASB_COM_PhyType && this.lanPortList.push("LAN5"), this.tblDestPort.setValue(this.lanPortList[0]), window.setTimeout(() => {
                                this.tblDestPort.setValue(this.lanPortList[0])
                            }, 100))
                        });
                        let i = !1, o = !1, T = !1, f = "";
                        t.port_info.forEach(_ => {
                            if (1 === _.Enable) {
                                const h = {DestPort: "", Direction: "", oid: ""};
                                h.DestPort = `LAN${_.DestPort}`, 1 === _.Direction ? (h.Direction = "Downstream", f = "Downstream", i = !0) : 0 === _.Direction ? (h.Direction = "Upstream", o = !0, f = "Upstream") : this.isBidirectionalSupport && 2 === _.Direction ? (h.Direction = "Bi-directional", T = !0, f = "Bi-directional") : (T = !0, i = !0, o = !0), h.oid = _._oid, this.tableData.push(h)
                            }
                        }), this.syncTabledata(this.tableData), this.isMTKBoard || (i || this.directionList.push({
                            label: this.constants.DOWNSTREAM_LABEL,
                            value: "rx"
                        }), o || this.directionList.push({
                            label: this.constants.UPSTREAM_LABEL,
                            value: "tx"
                        })), this.isBidirectionalSupport && (T || this.directionList.push({
                            label: this.constants.BI_DIRECTION,
                            value: "bi"
                        })), this.wanConnList.setValue(this.wanConnectionList[0]), this.isBidirectionalSupport && "" !== f && (this.directionList = []), this.tblDirection.setValue(""), this.directionList.length > 0 && !T && this.tblDirection.setValue(this.directionList[0].value), window.setTimeout(() => {
                            this.wanConnList.setValue(this.wanConnectionList[0]), this.directionList.length > 0 && !T && this.tblDirection.setValue(this.directionList[0].value)
                        }, 100)
                    }

                    onChanges() {
                        this.wanConnList.valueChanges.subscribe(t => {
                            let i;
                            this.selectedWanList = t, this.dnsResponseTimeResult = "", this.latencyTestResult = "", this.usPacketLoss.setValue(""), this.dsPacketLoss.setValue(""), this.uploadSpeed = "", this.downloadSpeed = "", this.wanConnectionList && (i = this.selectedWan[this.wanConnectionList.indexOf(this.wanConnList.value)]);
                            const o = `wan_conlist=${i?._oid}&ipaddress=${this.filterNullStr(this.latencyTest.value)}&direction=${0 !== this.directionList.length ? this.directionList[0].value : ""}&status=enable&domain=${this.filterNullStr(this.dnsResponseTime.value)}&wan_port=WAN&waninterfacename=${t?.X_ASB_COM_IfName}&portstatus=${t?.ConnectionStatus}&lan_port=${this.tblDestPort.value}`;
                            this.disableRefreshBtn = !0, this.pingParams = !0, this.selectedWanList && this.api.request(this, "pingIp", o)
                        })
                    }

                    syncPingChanges(t) {
                        t && ("Connected" === t.ConnectionStatus ? this.connectionStatus = this.constants.UP_LABEL : "Connecting" === t.ConnectionStatus ? this.connectionStatus = this.constants.LINKING : "Disconnected" === t.ConnectionStatus ? this.connectionStatus = this.constants.DOWN_LABEL : "Unconfigured" === t.ConnectionStatus && (this.connectionStatus = this.constants.MODE_CHANGED), this.wanStatus.setValue(this.connectionStatus), 1 === t.X_ALU_COM_isFixedWAN ? this.buttonDisable = !0 : 0 === t.X_ALU_COM_isFixedWAN && (this.buttonDisable = !1), this.usPacketLoss.setValue(0), this.dsPacketLoss.setValue(0), this.disableRefreshBtn = !1), this.selectedWanList = []
                    }

                    filterNullStr(t) {
                        return "null" !== t ? t : ""
                    }

                    savePortMirror() {
                        let o;
                        o = `direction=${this.tblDirection.value}&lan_port=${this.tblDestPort.value}&status=enable&wan_port=WAN`, this.portMirrorInProgress = !0, console.log(o), this.api.request(this, "setPortMirrorInfo", o)
                    }

                    uploadSpeedTest() {
                        this.showUSLoader = !0;
                        const t = this.wanConnList.value,
                            i = this.selectedWan[this.wanConnectionList.indexOf(this.wanConnList.value)],
                            o = `direction=${0 !== this.directionList.length ? this.directionList[0].value : ""}&domain=${this.filterNullStr(this.dnsResponseTime.value)}&ipaddress=${this.filterNullStr(this.latencyTest.value)}&lan_port=${this.filterNullStr(this.tblDestPort.value)}&portstatus=${t.ConnectionStatus}&status=enable&wan_port=WAN&wan_conlist=${i._oid}&waninterfacename=${t.X_ASB_COM_IfName}`;
                        this.uploadParams = o, console.log(o), this.api.request(this, "pingIp", o)
                    }

                    downloadSpeedTest() {
                        this.showDSLoader = !0;
                        const t = this.wanConnList.value,
                            i = this.selectedWan[this.wanConnectionList.indexOf(this.wanConnList.value)],
                            o = `direction=${0 !== this.directionList.length ? this.directionList[0].value : ""}&domain=${this.filterNullStr(this.dnsResponseTime.value)}&ipaddress=${this.latencyTest.value}&lan_port=${this.filterNullStr(this.tblDestPort.value)}&portstatus=${t.ConnectionStatus}&status=enable&wan_port=WAN&wan_conlist=${i._oid}&waninterfacename=${t.X_ASB_COM_IfName}`;
                        this.downloadParams = o, this.api.request(this, "pingIp", o)
                    }

                    doLatencyTest() {
                        const t = this.wanConnList.value;
                        if (!this.validations.Ipv4AddressValidation(this.latencyTest.value) && !this.validations.domainNameValidator(this.latencyTest.value)) return this.showWarning(this.constants.INVALID_IP_LATENCY), !1;
                        const i = this.selectedWan[this.wanConnectionList.indexOf(this.wanConnList.value)];
                        this.latencyInProgress = !0;
                        const o = `wan_conlist=${i._oid}&ipaddress=${this.filterNullStr(this.latencyTest.value)}&direction=${0 !== this.directionList.length ? this.directionList[0].value : ""}&status=enable&domain=${this.filterNullStr(this.dnsResponseTime.value)}&wan_port=WAN&waninterfacename=${t.X_ASB_COM_IfName}&portstatus=${t.ConnectionStatus}&lan_port=${this.filterNullStr(this.tblDestPort.value)}`;
                        this.api.request(this, "pingIp", o)
                    }

                    doDnsResponseTest() {
                        const t = this.wanConnList.value,
                            i = this.selectedWan[this.wanConnectionList.indexOf(this.wanConnList.value)];
                        this.dnsInProgress = !0;
                        const o = `direction=${0 !== this.directionList.length ? this.directionList[0].value : ""}&domain=${this.filterNullStr(this.dnsResponseTime.value)}&ipaddress=${this.filterNullStr(this.latencyTest.value)}&lan_port=${this.filterNullStr(this.tblDestPort.value)}&portstatus=${t.ConnectionStatus}&status=enable&wan_port=WAN&wan_conlist=${i._oid}&waninterfacename=${t.X_ASB_COM_IfName}`;
                        this.dnsParams = o, this.api.request(this, "pingIp", o)
                    }

                    deletePortMirror(t) {
                        console.log(t.oid), this.api.request(this, "deletePortMirror", t.oid)
                    }

                    syncTabledata(t) {
                        this.tableArray = [];
                        for (let i = 0; i < t.length; i++) this.tableArray.push({
                            srcPort: this.constants.WAN_NETWORK,
                            destPort: t[i].DestPort,
                            direction: t[i].Direction,
                            oid: t[i].oid,
                            actionDelete: !0
                        })
                    }

                    showWarning(t) {
                        this.message.showMessage({
                            show: !0,
                            title: this.constants.WARNING,
                            width: "400px",
                            description: t,
                            buttonText: this.constants.OKAY_LABEL
                        })
                    }

                    onSuccess(t) {
                        const i = t.data;
                        switch (t.action) {
                            case d.En.GET_ROUTER_INFO:
                                this.loadRouterInfo(this.api);
                                break;
                            case d.En.PING_IP:
                                this.pingParams ? (this.pingParams = !1, this.syncPingChanges(this.selectedWanList)) : this.showUSLoader ? (console.log(this.uploadParams), this.api.request(this, "getUsThroughPutTestInfo", this.uploadParams)) : this.showDSLoader ? (console.log(this.downloadParams), this.api.request(this, "getDsThroughPutTestInfo", this.downloadParams)) : this.latencyInProgress ? this.api.request(this, "getLatencyTestInfo", "") : this.dnsInProgress ? this.api.request(this, "getDnsResponseTest", this.dnsParams) : this.emptyPing && (this.emptyPing = !1, this.disableRefreshBtn = !0, 0 === i.result && this.getTroubleShootInfo());
                                break;
                            case d.En.GET_TROUBLESHOOT_INFO:
                                this.syncTroubleShootData(i);
                                break;
                            case d.En.GET_US_THROUGHPUT_TEST:
                                this.showUSLoader = !1, this.uploadParams = "", this.uploadSpeed = i.usthroughputval, this.usPacketLoss.setValue(i.uspktloss), this.dsPacketLoss.setValue(i.dspktloss);
                                break;
                            case d.En.GET_DS_THROUGHPUT_TEST:
                                this.showDSLoader = !1, this.downloadParams = "", this.downloadSpeed = i.dsthroughputval, this.usPacketLoss.setValue(i.uspktloss), this.dsPacketLoss.setValue(i.dspktloss);
                                break;
                            case d.En.GET_LATENCY_TEST:
                                this.latencyInProgress = !1, this.latencyTestResult = i.latencyval;
                                break;
                            case d.En.GET_DNS_RESPONSE_TEST:
                                this.dnsInProgress = !1, this.dnsResponseTimeResult = i.dnsresval;
                                break;
                            case d.En.SET_PORT_MIRROR:
                                this.portMirrorInProgress = !1, this.loadTroubleShootInfo();
                                break;
                            case d.En.DEL_PORT_MIRROR:
                                this.loadTroubleShootInfo()
                        }
                    }

                    onError(t) {
                        switch (t.action) {
                            case d.En.GET_ROUTER_INFO:
                                console.error("GET_ROUTER_INFO API Failed - Error"), console.error(t);
                                break;
                            case d.En.PING_IP:
                                this.pingParams = !1, this.uploadParams = "", this.downloadParams = "", this.dnsInProgress = !1, this.showUSLoader = !1, this.showDSLoader = !1, this.latencyInProgress = !1, this.emptyPing = !1, this.dnsParams = "", console.error("PING_IP API Failed - Error"), console.error(t);
                                break;
                            case d.En.GET_TROUBLESHOOT_INFO:
                                console.error("GET_TROUBLESHOOT_INFO API Failed - Error"), console.error(t);
                                break;
                            case d.En.GET_US_THROUGHPUT_TEST:
                                this.uploadParams = "", this.showUSLoader = !1, console.error("GET_US_THROUGHPUT_TEST API Failed - Error"), console.error(t);
                                break;
                            case d.En.GET_DS_THROUGHPUT_TEST:
                                this.showDSLoader = !1, this.downloadParams = "", console.error("GET_DS_THROUGHPUT_TEST API Failed - Error"), console.error(t);
                                break;
                            case d.En.GET_LATENCY_TEST:
                                this.latencyInProgress = !1, console.error("GET_LATENCY_TEST API Failed - Error"), console.error(t);
                                break;
                            case d.En.GET_DNS_RESPONSE_TEST:
                                this.dnsInProgress = !1, this.dnsParams = "", console.error("GET_DNS_RESPONSE_TEST API Failed - Error"), console.error(t);
                                break;
                            case d.En.SET_PORT_MIRROR:
                                this.portMirrorInProgress = !1, console.error("GET_DNS_RESPONSE_TEST API Failed - Error"), console.error(t);
                                break;
                            case d.En.DEL_PORT_MIRROR:
                                console.error("DEL_PORT_MIRROR API Failed - Error"), console.error(t)
                        }
                    }

                    get wanConnList() {
                        return this.troubleshootForm.get("wanConnList")
                    }

                    get wanStatus() {
                        return this.troubleshootForm.get("wanStatus")
                    }

                    get wanFailure() {
                        return this.troubleshootForm.get("wanFailure")
                    }

                    get usPacketLoss() {
                        return this.troubleshootForm.get("usPacketLoss")
                    }

                    get dsPacketLoss() {
                        return this.troubleshootForm.get("dsPacketLoss")
                    }

                    get tsCountersWanStatus() {
                        return this.troubleshootForm.get("tsCountersWanStatus")
                    }

                    get latencyTest() {
                        return this.troubleshootForm.get("latencyTest")
                    }

                    get dnsResponseTime() {
                        return this.troubleshootForm.get("dnsResponseTime")
                    }

                    get tblSrcPort() {
                        return this.troubleshootForm.get("tblSrcPort")
                    }

                    get tblDestPort() {
                        return this.troubleshootForm.get("tblDestPort")
                    }

                    get tblDirection() {
                        return this.troubleshootForm.get("tblDirection")
                    }

                    get tblStatus() {
                        return this.troubleshootForm.get("tblStatus")
                    }

                    static #e = this.\u0275fac = function (i) {
                        return new (i || s)(e.rXU(n.m4), e.rXU(_e.t), e.rXU(v.G), e.rXU(l.YM), e.rXU(c.V), e.rXU(Te.u), e.rXU(D.Q), e.rXU(ge.u), e.rXU(n.gd), e.rXU(P.Z))
                    };
                    static #t = this.\u0275cmp = e.VBU({
                        type: s,
                        selectors: [["app-troubleshooting-counters"]],
                        decls: 16,
                        vars: 12,
                        consts: [["port1", ""], [1, "flex-column", "grid-gap-24"], [3, "formGroup"], ["mb-6", ""], ["pb-4", "", 3, "disabled", "hasBorder", "rowLayout", 4, "ngIf"], ["mb-20", "", "h2-bold", "", 3, "title"], ["pb-4", "", "labelAlign", "top", 3, "disabled", "hasBorder", "rowLayout", 4, "ngIf"], ["mb-6", "", 4, "ngIf"], [3, "pvDataTable", "pvDataTableColum", "pvDataTableArray", "isStickyEnd", "buttonText", "onclickDelete", 4, "ngIf"], ["pb-4", "", 3, "disabled", "hasBorder", "rowLayout"], [3, "title"], [1, "trs__form-control"], ["formControlName", "wanConnList", "size", "MEDIUM", 1, "ifaceNumbers", 3, "disabled", "placeHolder"], [3, "label", "value", 4, "ngFor", "ngForOf"], [3, "label", "value"], ["size", "MEDIUM", "formControlName", "wanStatus", "isReadOnly", "true", 3, "disabled", "isValidated"], [1, "flex-row"], ["pt-2", "", "mr-2", "", 3, "title", 4, "ngIf"], ["size", "small", "type", "primary", "type", "submit", 3, "onClick", "isDisabled", "showButtonLoader", "troubleLoader", "title"], ["pt-2", "", "mr-2", "", 3, "title"], ["size", "small", 3, "onClick", "isDisabled", "showButtonLoader", "troubleLoader", "title"], ["size", "MEDIUM", "formControlName", "usPacketLoss", "isReadOnly", "true", "readonly", "", 3, "disabled", "isValidated"], ["size", "MEDIUM", "formControlName", "dsPacketLoss", "isReadOnly", "true", "readonly", "", 3, "disabled", "isValidated"], ["pb-4", "", "labelAlign", "top", 3, "disabled", "hasBorder", "rowLayout"], ["pt-3", "", "mr-2", "", 3, "title", 4, "ngIf"], ["size", "MEDIUM", "formControlName", "latencyTest", 3, "disabled", "isValidated"], [1, "flex-row", 2, "float", "right"], ["mt-2", ""], ["size", "small", 3, "onClick", "isDisabled", "title"], ["pt-3", "", "mr-2", "", 3, "title"], ["size", "MEDIUM", "formControlName", "dnsResponseTime", 3, "disabled", "isValidated"], ["h2-bold", "", 3, "title"], ["mt-20", "", "pb-4", "", 3, "disabled", "hasBorder", "rowLayout", 4, "ngIf"], ["size", "small", "mr-2", "", 3, "isDisabled", "title", "onClick", 4, "ngIf"], ["mt-20", "", "pb-4", "", 3, "disabled", "hasBorder", "rowLayout"], ["formControlName", "tblSrcPort", "size", "MEDIUM", 3, "disabled"], ["formControlName", "tblDestPort", "size", "MEDIUM", 3, "disabled"], ["formControlName", "tblDirection", "size", "MEDIUM", 3, "disabled", "placeHolder"], ["formControlName", "tblStatus", "size", "MEDIUM", 3, "disabled"], ["size", "small", "mr-2", "", 3, "onClick", "isDisabled", "title"], [3, "onclickDelete", "pvDataTable", "pvDataTableColum", "pvDataTableArray", "isStickyEnd", "buttonText"]],
                        template: function (i, o) {
                            1 & i && (e.j41(0, "div", 1)(1, "form", 2)(2, "pv-card", 3), e.DNE(3, be, 7, 7, "pv-form-field", 4)(4, ve, 5, 6, "pv-form-field", 4), e.k0s(), e.j41(5, "pv-card", 3), e.nrm(6, "pv-text", 5), e.DNE(7, Ee, 6, 9, "pv-form-field", 4)(8, De, 6, 9, "pv-form-field", 4)(9, Ce, 5, 6, "pv-form-field", 4)(10, Re, 5, 6, "pv-form-field", 4)(11, Ie, 11, 9, "pv-form-field", 6)(12, Ge, 11, 9, "pv-form-field", 6), e.k0s(), e.j41(13, "div"), e.DNE(14, Fe, 8, 6, "pv-card", 7)(15, ke, 1, 5, "pv-table", 8), e.k0s()()()), 2 & i && (e.R7$(), e.Y8G("formGroup", o.troubleshootForm), e.R7$(2), e.Y8G("ngIf", o.api.device_capability.getVal("troubleshooting", "troubleshootingCounters", "wanConnectionList").isOn), e.R7$(), e.Y8G("ngIf", o.api.device_capability.getVal("troubleshooting", "troubleshootingCounters", "wanStatus").isOn), e.R7$(2), e.Y8G("title", o.constants.TS_COUNTERS), e.R7$(), e.Y8G("ngIf", o.api.device_capability.getVal("troubleshooting", "troubleshootingCounters", "usThroughput").isOn), e.R7$(), e.Y8G("ngIf", o.api.device_capability.getVal("troubleshooting", "troubleshootingCounters", "dsThroughput").isOn), e.R7$(), e.Y8G("ngIf", o.api.device_capability.getVal("troubleshooting", "troubleshootingCounters", "usPacketLoss").isOn), e.R7$(), e.Y8G("ngIf", o.api.device_capability.getVal("troubleshooting", "troubleshootingCounters", "dsPacketLoss").isOn), e.R7$(), e.Y8G("ngIf", o.api.device_capability.getVal("troubleshooting", "troubleshootingCounters", "latency").isOn), e.R7$(), e.Y8G("ngIf", o.api.device_capability.getVal("troubleshooting", "troubleshootingCounters", "dnsResponseTime").isOn), e.R7$(2), e.Y8G("ngIf", o.showPortMirror && o.api.device_capability.getVal("troubleshooting", "portMirror", "visibility").isOn), e.R7$(), e.Y8G("ngIf", o.tableArray.length > 0))
                        },
                        dependencies: [C.Sq, C.bT, r.qT, r.BC, r.cb, n.xJ, n.Sp, n.XL, n.$r, n.v9, n.X, n.RA, n.Od, r.j4, r.JD],
                        styles: [".trs__form-control[_ngcontent-%COMP%]{width:300px}"]
                    })
                }

                return s
            })()
        }, {path: "speed-test", component: he}];
        let $e = (() => {
            class s {
                static #e = this.\u0275fac = function (i) {
                    return new (i || s)
                };
                static #t = this.\u0275mod = e.$C({type: s});
                static #s = this.\u0275inj = e.G2t({imports: [b.iI.forChild(Ye), b.iI]})
            }

            return s
        })();
        var Be = p(2866);
        let Xe = (() => {
            class s {
                static #e = this.\u0275fac = function (i) {
                    return new (i || s)
                };
                static #t = this.\u0275mod = e.$C({type: s});
                static #s = this.\u0275inj = e.G2t({imports: [Be.G, $e]})
            }

            return s
        })()
    }
}]);