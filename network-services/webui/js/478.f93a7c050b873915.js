"use strict";
(self.webpackChunknokiawifi = self.webpackChunknokiawifi || []).push([[478], {
    2705: (x, L, u) => {
        u.d(L, {N: () => e});
        var T = u(4493), A = u(8611), r = u(7365), w = u(1989);

        class e {
            static #e = this.constants = new T.YM;
            static #t = this.alertUtiliy = new w.l(e.constants);
            static #i = this.utilityService = new r.n(e.constants, e.alertUtiliy);
            static #s = this.validatorsService = new A.k(e.constants);

            static MinMaxValidator(p, n) {
                return g => g.value ? g.value < p || g.value > n ? {minMaxError: !0} : null : void 0
            }

            static MaxLengthValidator(p) {
                return n => n.value ? n.value.length > p ? {maxLengthError: !0} : null : void 0
            }

            static ExceedsNumberValidator(p) {
                return n => n.value ? +n.value > +p ? {maxLengthError: !0} : null : void 0
            }

            static NotExceedsNumberValidator(p) {
                return n => n.value ? +n.value < +p ? {exceedsError: !0} : null : void 0
            }

            static PortValidator(p, n) {
                return g => g.value ? g.value < p || g.value > n ? {portError: !0} : null : void 0
            }

            static WepKeyValidator(p) {
                return n => {
                    if (!n.value) return;
                    let g, f;
                    return "64 bit" === p && (10 !== n.value.length && 5 !== n.value.length && (f = this.constants.VALID_WEP_KEY_LEN, g = !1), 10 === n.value.length && this.validatorsService.isValidHexKey(n.value, 10) && (f = this.constants.WEP_VALID_HEX_VALUES, g = !1), 5 === n.value.length && this.validatorsService.isValidString(n.value) && (f = this.constants.WEP_INVALID_CHAR, g = !1)), "128 bit" === p && (13 !== n.value.length && 26 !== n.value.length && (f = this.constants.VALID_HEX_PWD, g = !1), 26 === n.value.length && this.validatorsService.isValidHexKey(n.value, 26) && (f = this.constants.WEP_VALID_HEX_VALUES, g = !1), 13 === n.value.length && this.validatorsService.isValidString(n.value) && (f = this.constants.WEP_INVALID_CHAR, g = !1)), g ? null : {
                        wepKeyError: !0,
                        message: f
                    }
                }
            }

            static PortValidation() {
                return p => {
                    if (p.value) return this.validatorsService.isValidPortNum(p.value) ? null : {
                        formError: !0,
                        message: this.constants.ERR_RIGHT_PORT
                    }
                }
            }

            static IpFilterPortValidation() {
                return p => {
                    if (p.value) return this.validatorsService.ipFilterValidPort(p.value) ? null : {
                        formError: !0,
                        message: this.constants.ERR_RIGHT_PORT
                    }
                }
            }

            static PortValidationGreater(p, n) {
                return g => {
                    if (!g.value) return null;
                    const f = g.parent.get(p), C = g.parent.get(n);
                    return f.value && C.value ? +f.value > +C.value ? (f.setErrors({
                        formError: !0,
                        message: this.constants.SRC_LESS_THAN_END
                    }), f.updateValueAndValidity(), {
                        formError: !0,
                        message: this.constants.SRC_LESS_THAN_END
                    }) : (f.errors && f.errors.formError && (delete f.errors.formError, delete f.errors.message, f.updateValueAndValidity()), null) : null
                }
            }

            static IpValidation() {
                return p => "" === p.value || this.validatorsService.Ipv4AddressValidation(p.value) || this.validatorsService.ipv6ValidationWithoutSlash(p.value) ? null : {
                    formError: !0,
                    message: "ERROR_ENTER_VALID_IP"
                }
            }

            static IpSubnetMaskValidation() {
                return p => this.validatorsService.maskIPAddressValidation(p.value) && p.value !== T.YM.DEFAULT_IPADDRESS || this.validatorsService.ipv6SubnetMask(p.value) ? null : {
                    formError: !0,
                    message: "ERR_INPUT_SUBNETMASK"
                }
            }

            static hostAddressValidator() {
                return p => {
                    if (p.value) {
                        let n = !1;
                        if (this.validatorsService.isValidIpFormat(p.value)) return null;
                        if (n = !0, p.value.includes(".") && p.value.split(".").length <= 3 && !isNaN(p.value.replaceAll(".", ""))) return {hostIp: !0};
                        if (n) {
                            if (this.validatorsService.domainNameWithHypenValidator(p.value)) return n = !1, null;
                            n = !0
                        }
                        if (n && this.validatorsService.ipv6Validation(p.value)) return null
                    }
                    return {hostIp: !0}
                }
            }

            static hostAddressIPV4Validator() {
                return p => {
                    if (p.value) {
                        let n = !1;
                        if (this.validatorsService.isValidIpFormat(p.value)) return null;
                        if (n = !0, p.value.includes(".") && p.value.split(".").length <= 3 && !isNaN(p.value.replaceAll(".", ""))) return {hostIp: !0};
                        if (n) {
                            if (this.validatorsService.domainNameWithHypenValidator(p.value)) return n = !1, null;
                            n = !0
                        }
                    }
                    return {hostIp: !0}
                }
            }

            static fqdnUrlValidation() {
                return p => {
                    if (p.value) {
                        try {
                            if (p.value.match(/\[.*]/)) {
                                let n = new URL(p.value);
                                if ("http:" === n?.protocol && n?.host.match(/\[.*]/)) return null
                            }
                        } catch (n) {
                            return console.error("Error in IPV6 FQDN Validation", n), {notValidUrl: !0}
                        }
                        return this.validatorsService.fqdnUrlValidation(p.value) ? null : {notValidUrl: !0}
                    }
                }
            }
        }
    }, 5478: (x, L, u) => {
        u.r(L), u.d(L, {MaintenanceModule: () => ut});
        var T = u(2866), A = u(6425), r = u(6261), w = u(1626), e = u(4438), I = u(8934), p = u(4493), n = u(6452),
            g = u(6279), f = u(8882), C = u(7410), b = u(177), G = u(1771);
        const U = (i, c) => ({"upgrade-firmware__onsuccess": i, "upgrade-firmware__onerror": c});

        function P(i, c) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-upload", 8), e.bIt("change", function (s) {
                    e.eBV(t);
                    const o = e.XpG();
                    return e.Njj(o.onFileChange(s))
                }), e.k0s()
            }
            if (2 & i) {
                const t = e.XpG();
                e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "firmwareUpgrade", "selectFile").isDisabled || t.upgradeStarted)("title", t.constants.SELECT_FILE_FIRMWARE)("selectButtonText", t.constants.SELECT)("fileTextNoFile", t.constants.NO_FILE_SELECTED)("fileTextWithFile", t.constants.A_FILE_IS_SELECTED)("isRefresh", t.isRefresh)
            }
        }

        function B(i, c) {
            if (1 & i && (e.nrm(0, "pv-text", 9), e.nI1(1, "textTransform")), 2 & i) {
                const t = e.XpG();
                e.Y8G("ngClass", e.l_i(5, U, !!t.isSuccess || null, !!t.isError || null))("title", e.i5U(1, 2, t.status, "sentenceCase"))
            }
        }

        function Y(i, c) {
            if (1 & i && (e.j41(0, "div", 11), e.nrm(1, "pv-text", 12), e.k0s()), 2 & i) {
                const t = e.XpG().$implicit;
                e.R7$(), e.Y8G("title", t)
            }
        }

        function X(i, c) {
            if (1 & i && (e.qex(0), e.DNE(1, Y, 2, 1, "div", 10), e.bVm()), 2 & i) {
                const t = c.$implicit;
                e.R7$(), e.Y8G("ngIf", t)
            }
        }

        let $ = (() => {
            class i {
                constructor(t, a, s, o, d, h, _) {
                    this.api = t, this.constants = a, this.message = s, this.logger = o, this.pureViewSnackbarService = d, this.pubSubService = h, this.prodcfg = _, this.upgradeStarted = !1, this.uploadStatus = "", this.statusflag = !1, this.isSuccess = !0, this.isError = !1, this.inProgress = !1, this.statusText = "", this.file = null, this.upgradeSuccess = !1, this.showSaveIcon = !1, this.isRefresh = !1, this.upgradeLogs = []
                }

                ngOnInit() {
                    this.resetToDefault(), this.pageRefresh()
                }

                pageRefresh() {
                    this.pageRefreshSub = this.pubSubService.subscribe(r.VR.HEADER_REFRESH_CLICKED, t => {
                        this.upgradeStarted || (this.resetToDefault(), this.fileContent = "", this.isRefresh = !0)
                    })
                }

                ngDestroy() {
                    this.resetToDefault()
                }

                onFileChange(t) {
                    this.isRefresh = !1, this.pureViewSnackbarService.hideMessageSnackbar(), this.resetToDefault();
                    const a = new FileReader;
                    if (t.target.files && t.target.files.length > 0) {
                        const s = t.target.files[0];
                        this.fileName = t.target.files[0].name, this.fileSize = t.target.files[0].size / 1024 / 1024, this.formData = new FormData, this.formData.append("csrf_token", localStorage.getItem("token")), this.formData.append("filename", s);
                        const o = this.fileName.lastIndexOf("."), d = this.fileName.slice(o + 1, this.fileName.length);
                        a.readAsArrayBuffer(s);
                        const h = this.prodcfg.supportsFWADevice ? 300 : 100;
                        if (Math.floor(this.fileSize) > h) return this.fileContent = "", this.status = "File size is too large.. Upload failed", this.uploadStatus = this.constants.NO_FILE_CHOSEN, this.isSuccess = !1, this.isError = !0, !1;
                        if ("txt" === d || "json" === d || "pdf" === d || "cfg" === d || "png" === d) return this.showWarning(this.constants.INVALID_FILE_FORMAT), this.fileContent = "", this.isSuccess = !1, this.isError = !0, !1;
                        a.onload = () => {
                            this.fileContent = a.result
                        }, a.onloadend = () => {
                            2 === a.readyState && (this.uploadStatus = this.fileName, this.status = "Uploading... Done", this.isSuccess = !0, this.isError = !1)
                        }, a.onprogress = _ => {
                            if (_.lengthComputable) {
                                let v = _.loaded / _.total * 100;
                                v = Math.floor(v), 1 === a.readyState && (this.status = `Uploading... ${v}%`)
                            }
                        }
                    }
                }

                onUpgrade() {
                    if (this.logger.console("Upgrade button clicked !"), this.pureViewSnackbarService.hideMessageSnackbar(), !this.fileContent) return this.showWarning(this.constants.INVALID_FILE_FORMAT), !1;
                    this.resetToDefault();
                    const t = {headers: new w.Lr({enctype: "multipart/form-data"}), withCredentials: !0};
                    this.upgradeStarted = !0, this.status = this.constants.MSG_UPGRADING, this.api.request(this, "startFirmwareUpgarde", this.formData, null, t)
                }

                resetToDefault(t) {
                    "upgradeDone" == t ? this.status = "Upgrade Done!" : "upgradeFailed" == t ? (this.status = "Upgrade failed!", this.upgradeStarted = !1, this.isSuccess = !1, this.isError = !0) : (this.status = "", this.isSuccess = !0, this.isError = !1, this.upgradeLogs = []), this.upgradeSuccess = !1, this.onUpgradeInterval && clearTimeout(this.onUpgradeInterval), this.startTimeInterval && clearTimeout(this.startTimeInterval), this.timerRunShellInterval && clearTimeout(this.timerRunShellInterval)
                }

                startUpgrade() {
                    this.api.request(this, "invokeShellExistCommand", this.pId)
                }

                runShellCatCommand() {
                    this.statusflag = !0, this.api.request(this, this.prodcfg.supportsFWADevice ? "invokeShellCatCommandFWA" : "invokeShellCatCommand", this.pId)
                }

                showWarning(t) {
                    this.message.showMessage({
                        show: !0,
                        title: this.constants.ERROR_LABEL,
                        description: t,
                        buttonText: "Okay"
                    })
                }

                ngOnDestroy() {
                    this.message.hideMessage({show: !1}), this.pureViewSnackbarService.hideMessageSnackbar(), this.pageRefreshSub?.unsubscribe()
                }

                onSuccess(t) {
                    const a = t.data;
                    switch (this.logger.info({
                        msg: "Firmware Upgrade - Action: " + t.action + " On Success",
                        devData: t
                    }), t.action) {
                        case r.En.GET_FIRMWARE_UPGRADE_STATUS:
                            if (0 == +a) return this.upgradeStarted = !1, this.upgradeSuccess = !1, this.timerRunShellInterval ? void clearTimeout(this.timerRunShellInterval) : void 0;
                            this.status = "Upgrade Done!", this.isError = !1, this.isSuccess = !0, this.upgradeSuccess = !0;
                            break;
                        case r.En.START_FIRMWARE_UPGRADE:
                            this.log = "", 0 === a.result ? (this.pId = a.pid, this.isError = !1, this.isSuccess = !0, this.startUpgrade(), this.onUpgradeInterval = setTimeout(() => {
                                this.runShellCatCommand()
                            }, 2e3)) : a.msg ? (this.status = a.msg, this.upgradeStarted = !1) : (this.isError = !0, this.isSuccess = !1, this.status = "Upgrade failed!", this.upgradeStarted = !1);
                            break;
                        case r.En.INVOKE_SHELL_EXIST_COMMAND:
                            a.exist ? (this.status = this.constants.MSG_UPGRADING, this.startTimeInterval = setTimeout(() => {
                                this.startUpgrade()
                            }, 5e3)) : this.api.request(this, "getfirmwareUpgradeStatus", {loaderTimeout: this.constants.TIMEOUT_1_MINUTE});
                            break;
                        case r.En.INVOKE_CAT_COMMAND:
                            if (">" === a.substr(0, 1)) if ("" !== a.substr(1)) {
                                const s = /[\b]+|[\t\v\r\f]+/g, o = `${a.substr(1)}`.replace(s, "");
                                this.log += o, -1 == this.upgradeLogs.indexOf(o) && this.upgradeLogs.push(o), o.indexOf("Rebooting...") > 0 ? this.resetToDefault("upgradeDone") : this.timerRunShellInterval = setTimeout(() => {
                                    this.runShellCatCommand()
                                }, 500)
                            } else this.prodcfg.supportsFWADevice && (-1 !== a.indexOf("Rebooting") ? this.resetToDefault("upgradeDone") : this.timerRunShellInterval = setTimeout(() => {
                                this.runShellCatCommand()
                            }, 500)); else if ("<" === a.substr(0, 1) && -1 !== this.log.indexOf("Rebooting...")) return
                    }
                }

                onError(t) {
                    this.logger.error({
                        msg: "Firmware Upgrade - On Error",
                        error: t
                    }), t.action === r.En.START_FIRMWARE_UPGRADE && this.resetToDefault("upgradeFailed")
                }

                static #e = this.\u0275fac = function (a) {
                    return new (a || i)(e.rXU(I.G), e.rXU(p.YM), e.rXU(n.m4), e.rXU(g.V), e.rXU(n.gd), e.rXU(f.Q), e.rXU(C.Z))
                };
                static #t = this.\u0275cmp = e.VBU({
                    type: i,
                    selectors: [["app-firmware-upgrade"]],
                    decls: 10,
                    vars: 7,
                    consts: [[1, "flex-column", "grid-gap-24", "upgrade-firmware"], [3, "disabled", "title", "selectButtonText", "fileTextNoFile", "fileTextWithFile", "isRefresh", "change", 4, "ngIf"], [1, "flex-row"], ["type", "submit", "buttonType", "submit", "size", "small", "mr-2", "", 3, "onClick", "showButtonLoader", "isDisabled", "title"], ["body1-regular", "", "mb-4", "", 3, "title"], ["pb-2", "", "mb-4", "", 1, "upgrade-firmware__status"], [3, "ngClass", "title", 4, "ngIf"], [4, "ngFor", "ngForOf"], [3, "change", "disabled", "title", "selectButtonText", "fileTextNoFile", "fileTextWithFile", "isRefresh"], [3, "ngClass", "title"], ["mt-3", "", "class", "flex-row", 4, "ngIf"], ["mt-3", "", 1, "flex-row"], [3, "title"]],
                    template: function (a, s) {
                        1 & a && (e.j41(0, "div", 0)(1, "pv-card"), e.DNE(2, P, 1, 6, "pv-upload", 1), e.j41(3, "div", 2)(4, "pv-button", 3), e.bIt("onClick", function () {
                            return s.onUpgrade()
                        }), e.k0s()()(), e.j41(5, "pv-card"), e.nrm(6, "pv-text", 4), e.j41(7, "div", 5), e.DNE(8, B, 2, 8, "pv-text", 6), e.k0s(), e.DNE(9, X, 2, 1, "ng-container", 7), e.k0s()()), 2 & a && (e.R7$(2), e.Y8G("ngIf", s.api.device_capability.getVal("maintenance", "firmwareUpgrade", "selectFile").isOn), e.R7$(2), e.Y8G("showButtonLoader", s.upgradeStarted)("isDisabled", s.upgradeStarted || s.api.device_capability.getVal("maintenance", "firmwareUpgrade", "upgradeButton").isDisabled)("title", s.constants.UPGRADE), e.R7$(2), e.Y8G("title", s.constants.UPGRADE_STATUS), e.R7$(2), e.Y8G("ngIf", s.status), e.R7$(), e.Y8G("ngForOf", s.upgradeLogs))
                    },
                    dependencies: [b.YU, b.Sq, b.bT, n.xJ, n.XL, n.v9, n.aR, G.a],
                    styles: [".upgrade-firmware[_ngcontent-%COMP%]{font-size:var(--pure-dimension-19);color:var(--pure-color-gray-800)}.upgrade-firmware__status[_ngcontent-%COMP%]{border-bottom:1px solid var(--pure-color-neutral-30)}.upgrade-firmware__onsuccess[_ngcontent-%COMP%]{color:var(--pure-color-primary-60)}.upgrade-firmware__onerror[_ngcontent-%COMP%]{color:var(--pure-color-bad)}"]
                })
            }

            return i
        })();
        var l = u(9417), V = u(605), D = u(3995), F = u(2960), O = u(765);

        function W(i, c) {
            if (1 & i && e.nrm(0, "pv-select-option", 16), 2 & i) {
                const t = c.$implicit;
                e.Y8G("label", t.label)("value", t.value)
            }
        }

        function j(i, c) {
            if (1 & i && (e.j41(0, "pv-form-field", 11)(1, "label"), e.nrm(2, "pv-text", 12), e.k0s(), e.j41(3, "span", 13)(4, "pv-select", 14), e.DNE(5, W, 1, 2, "pv-select-option", 15), e.k0s()()()), 2 & i) {
                const t = e.XpG();
                e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "diagnostics", "protocol").isDisabled)("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.PROTOCOL), e.R7$(2), e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "diagnostics", "protocol").isDisabled), e.R7$(), e.Y8G("ngForOf", t.prolist)
            }
        }

        function H(i, c) {
            if (1 & i && e.nrm(0, "pv-select-option", 16), 2 & i) {
                const t = c.$implicit;
                e.Y8G("label", t.n)("value", t)
            }
        }

        function z(i, c) {
            if (1 & i && (e.j41(0, "pv-form-field", 11)(1, "label"), e.nrm(2, "pv-text", 12), e.k0s(), e.j41(3, "span", 13)(4, "pv-select", 17), e.DNE(5, H, 1, 2, "pv-select-option", 15), e.k0s()()()), 2 & i) {
                const t = e.XpG();
                e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "diagnostics", "wanConnectionList").isDisabled)("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.WAN_CONNECT_LIST), e.R7$(2), e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "diagnostics", "wanConnectionList").isDisabled), e.R7$(), e.Y8G("ngForOf", t.ifaceList)
            }
        }

        function K(i, c) {
            if (1 & i && (e.j41(0, "pv-form-field", 11)(1, "label"), e.nrm(2, "pv-text", 12), e.k0s(), e.j41(3, "span", 13), e.nrm(4, "pv-inputbox", 18), e.k0s()()), 2 & i) {
                const t = e.XpG();
                e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "diagnostics", "ipOrDomainName").isDisabled)("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.IP_DOMAIN_NAME), e.R7$(2), e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "diagnostics", "ipOrDomainName").isDisabled)("isValidated", t.isIpValid)("errorMessage", t.ipErrorM)("hideErrorIcon", !0)
            }
        }

        function q(i, c) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-form-field", 19)(1, "label"), e.nrm(2, "pv-text", 12), e.k0s(), e.j41(3, "pv-toggle", 20), e.bIt("onCheck", function () {
                    e.eBV(t);
                    const s = e.XpG();
                    return e.Njj(s.enableDisableControls())
                }), e.k0s()()
            }
            if (2 & i) {
                const t = e.XpG();
                e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "diagnostics", "ping").isDisabled)("rowLayout", !0)("hasBorder", !0), e.R7$(2), e.Y8G("title", t.constants.PING), e.R7$(), e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "diagnostics", "ping").isDisabled)("isChecked", t.ping.value)
            }
        }

        function J(i, c) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-form-field", 19)(1, "label"), e.nrm(2, "pv-text", 12), e.k0s(), e.j41(3, "pv-toggle", 21), e.bIt("onCheck", function () {
                    e.eBV(t);
                    const s = e.XpG();
                    return e.Njj(s.enableDisableControls())
                }), e.k0s()()
            }
            if (2 & i) {
                const t = e.XpG();
                e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "diagnostics", "traceRoute").isDisabled)("rowLayout", !0)("hasBorder", !0), e.R7$(2), e.Y8G("title", t.constants.TRACEROUTE), e.R7$(), e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "diagnostics", "traceRoute").isDisabled)("isChecked", t.trace.value)
            }
        }

        function Z(i, c) {
            if (1 & i && (e.j41(0, "pv-form-field", 22)(1, "span")(2, "label"), e.nrm(3, "pv-text", 23), e.k0s(), e.nrm(4, "pv-text", 24), e.k0s(), e.nrm(5, "pv-inputbox", 25), e.k0s()), 2 & i) {
                const t = e.XpG();
                e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "diagnostics", "pingTryTimes").isDisabled)("hasBorder", !0)("rowLayout", !0), e.R7$(3), e.Y8G("title", t.constants.PING_TRY_TIMES), e.R7$(), e.Y8G("title", t.constants.ONE_TO_THOUSAND), e.R7$(), e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "diagnostics", "pingTryTimes").isDisabled)("isValidated", !0)
            }
        }

        function Q(i, c) {
            if (1 & i && (e.j41(0, "pv-form-field", 22)(1, "span")(2, "label"), e.nrm(3, "pv-text", 23), e.k0s(), e.nrm(4, "pv-text", 24), e.k0s(), e.nrm(5, "pv-inputbox", 26), e.k0s()), 2 & i) {
                const t = e.XpG();
                e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "diagnostics", "packetLength").isDisabled)("hasBorder", !0)("rowLayout", !0), e.R7$(3), e.Y8G("title", t.constants.PACKET_LENGTH), e.R7$(), e.Y8G("title", t.constants.SIXTYFOUR_TO_1500), e.R7$(), e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "diagnostics", "packetLength").isDisabled)("isValidated", !0)
            }
        }

        function ee(i, c) {
            if (1 & i && (e.j41(0, "pv-form-field", 22)(1, "span")(2, "label"), e.nrm(3, "pv-text", 23), e.k0s(), e.nrm(4, "pv-text", 24), e.k0s(), e.nrm(5, "pv-inputbox", 26), e.k0s()), 2 & i) {
                const t = e.XpG();
                e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "diagnostics", "packetLength").isDisabled)("hasBorder", !0)("rowLayout", !0), e.R7$(3), e.Y8G("title", t.constants.PACKET_LENGTH), e.R7$(), e.Y8G("title", t.constants.SEVENTY_TO_32768), e.R7$(), e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "diagnostics", "packetLength").isDisabled)("isValidated", !0)
            }
        }

        function te(i, c) {
            if (1 & i && (e.j41(0, "pv-form-field", 22)(1, "span")(2, "label"), e.nrm(3, "pv-text", 23), e.k0s(), e.nrm(4, "pv-text", 24), e.k0s(), e.nrm(5, "pv-inputbox", 27), e.k0s()), 2 & i) {
                const t = e.XpG();
                e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "diagnostics", "maxNoOfTraceHops").isDisabled)("hasBorder", !0)("rowLayout", !0), e.R7$(3), e.Y8G("title", t.constants.MAX_TRACE_HOPS), e.R7$(), e.Y8G("title", t.constants.ONE_TO_255), e.R7$(), e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "diagnostics", "maxNoOfTraceHops").isDisabled)("isValidated", !0)
            }
        }

        function ie(i, c) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-button", 28), e.bIt("onClick", function () {
                    e.eBV(t);
                    const s = e.XpG();
                    return e.Njj(s.doPing())
                }), e.k0s()
            }
            if (2 & i) {
                const t = e.XpG();
                e.Y8G("title", t.constants.START_TEST)("isDisabled", t.isPingStarted || t.isCFGMode || t.api.device_capability.getVal("maintenance", "diagnostics", "startButton").isDisabled)
            }
        }

        function se(i, c) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-button", 29), e.bIt("onClick", function () {
                    e.eBV(t);
                    const s = e.XpG();
                    return e.Njj(s.cancelPing())
                }), e.k0s()
            }
            if (2 & i) {
                const t = e.XpG();
                e.Y8G("isDisabled", t.isCFGMode || t.api.device_capability.getVal("maintenance", "diagnostics", "cancelButton").isDisabled)("title", t.constants.CANCEL)
            }
        }

        let ae = (() => {
            class i {
                constructor(t, a, s, o, d, h, _, v, m) {
                    this.appAccessService = t, this.constants = a, this.api = s, this.gconfig = o, this.message = d, this.validators = h, this.pubSubService = _, this.pureViewSnackbarService = v, this.prodcfg = m, this.startTestDisable = !1, this.ipRegEx = "(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})", this.ifaceList = [], this.ifConnsData = [], this.log = "", this.isPingStarted = !1, this.isCFGMode = !1, this.isIpValid = !0, this.isShowPROTOCOL = !1, this.ipErrorM = "", this.isipv4 = !0, this.showSaveIcon = !1, this.isIpv6Support = !1, this.isSupportTR098 = !1, this.prolist = [{
                        label: "IPv4",
                        value: "ipv4"
                    }, {
                        label: "IPv6",
                        value: "ipv6"
                    }], this.hasError = (E, R) => "required" === R ? this.diagnosticsForm.controls[E].hasError(R) && this.diagnosticsForm.controls[E].touched : !this.diagnosticsForm.controls[E].hasError("required") && this.diagnosticsForm.controls[E].hasError(R) && this.diagnosticsForm.controls[E].touched, "" !== this.api.router_info.gwmodel ? this.loadRouterInfo(this.api) : this.api.request(this, "getRouterInfo")
                }

                loadRouterInfo(t) {
                    this.isShowPROTOCOL = !(!this.prodcfg.MTKBoard && !this.prodcfg.supports5Ghigh), this.isCFGMode = -1 === t.brEnable, this.isSupportTR098 = 0 === t.isSupportTR181, this.isCFGMode && ("BWDS" === this.api.g_opId || "BATL" === this.api.g_opId && this.api.device_capability.getVal("overview", "networkMap", "addWifiButton", "showAddSerialNumberModal").isOn ? this.showWarning(this.constants.CFG_WARNING_BWDS) : this.showWarning(this.constants.CFG_WARNING))
                }

                ngOnInit() {
                    this.initForm(), this.getDiagnostics(), this.enableDisableControls(), this.proipv.setValue(this.prolist[0].value), this.onChanges(), this.pageRefresh()
                }

                pageRefresh() {
                    this.pageRefreshSub = this.pubSubService.subscribe(r.VR.HEADER_REFRESH_CLICKED, t => {
                        this.getDiagnostics(), this.ping.setValue(!1), this.trace.setValue(!1), this.ipAdress.setValue(""), this.enableDisableControls()
                    })
                }

                onChanges() {
                    this.proipv.valueChanges.subscribe(t => {
                        this.changeipvvalue()
                    })
                }

                changeipvvalue() {
                    this.api.get_diagnotics_info.lan_ether.length > 0 && this.syncDiagnosticsData(this.api.get_diagnotics_info)
                }

                initForm() {
                    this.diagnosticsForm = new l.gE({
                        proipv: new l.MJ({
                            value: "ipv4",
                            disabled: this.api.device_capability.getVal("maintenance", "diagnostics", "protocol").isDisabled
                        }),
                        iface: new l.MJ({
                            value: "",
                            disabled: this.api.device_capability.getVal("maintenance", "diagnostics", "wanConnectionList").isDisabled
                        }),
                        maxNumber: new l.MJ({
                            value: "30",
                            disabled: this.api.device_capability.getVal("maintenance", "diagnostics", "maxNoOfTraceHops").isDisabled
                        }),
                        packetlength: new l.MJ({
                            value: "64",
                            disabled: this.api.device_capability.getVal("maintenance", "diagnostics", "packetLength").isDisabled
                        }),
                        pingTimes: new l.MJ({
                            value: "4",
                            disabled: this.api.device_capability.getVal("maintenance", "diagnostics", "pingTryTimes").isDisabled
                        }),
                        trace: new l.MJ({
                            value: "",
                            disabled: this.api.device_capability.getVal("maintenance", "diagnostics", "traceRoute").isDisabled
                        }),
                        ping: new l.MJ({
                            value: "",
                            disabled: this.api.device_capability.getVal("maintenance", "diagnostics", "ping").isDisabled
                        }),
                        ipAdress: new l.MJ({
                            value: "",
                            disabled: this.api.device_capability.getVal("maintenance", "diagnostics", "ipOrDomainName").isDisabled
                        })
                    })
                }

                getDiagnostics() {
                    this.api.request(this, "getDiagnosticsInfo")
                }

                syncDiagnosticsData(t) {
                    if (this.ifaceList = [], this.ifaceList.push({
                        n: this.constants.LAN_WAN_INTERFACE,
                        x: "",
                        o: ""
                    }), this.ifConnsData = t.if_conns_glb, this.ifConnsData.forEach(a => {
                        "ipv6" == this.proipv.value ? (this.isipv4 = !1, this.packetlength.setValue("72"), a.ipConns.forEach(s => {
                            if ("Connected" == s.X_CT_COM_IPv6ConnStatus && "PPPoE_Bridged" !== s.ConnectionType) {
                                const o = Math.floor(s._iid / 1e4), d = Math.floor(s._iid % 1e4 / 100);
                                "3_TR069_R_VID_2501" === s.Name && (s.Name = "3_TR069_R"), this.ifaceList.push({
                                    n: s.Name,
                                    x: s.X_ASB_COM_IfName,
                                    o: `ip,${o},${d},${s._oid}`
                                })
                            }
                        }), a.pppConns.forEach(s => {
                            if ("PPPoE_Bridged" !== s.ConnectionType && "Connected" === s.X_CT_COM_IPv6ConnStatus) {
                                const o = Math.floor(s._iid / 1e4), d = Math.floor(s._iid % 1e4 / 100);
                                this.ifaceList.push({n: s.Name, x: s.X_ASB_COM_IfName, o: `pp,${o},${d},${s._oid}`})
                            }
                        })) : "ipv4" == this.proipv.value && (this.packetlength.setValue("64"), this.isipv4 = !0, a.ipConns.forEach(s => {
                            if ("Connected" == s.ConnectionStatus && "PPPoE_Bridged" !== s.ConnectionType) {
                                const o = Math.floor(s._iid / 1e4), d = Math.floor(s._iid % 1e4 / 100);
                                "3_TR069_R_VID_2501" === s.Name && (s.Name = "3_TR069_R"), this.ifaceList.push({
                                    n: s.Name,
                                    x: s.X_ASB_COM_IfName,
                                    o: `ip,${o},${d},${s._oid}`
                                })
                            }
                        }), a.pppConns.forEach(s => {
                            if ("PPPoE_Bridged" !== s.ConnectionType && "Connected" === s.ConnectionStatus) {
                                const o = Math.floor(s._iid / 1e4), d = Math.floor(s._iid % 1e4 / 100);
                                this.ifaceList.push({n: s.Name, x: s.X_ASB_COM_IfName, o: `pp,${o},${d},${s._oid}`})
                            }
                        }))
                    }), "GOMT" === this.api.g_opId && this.ifaceList.length > 2) {
                        const a = [];
                        this.ifaceList.forEach(s => {
                            s?.n == this.constants.LAN_WAN_INTERFACE && a.push(s), 1 == a.length && s?.n !== this.constants.LAN_WAN_INTERFACE && a.push(s)
                        }), this.ifaceList = [...a]
                    }
                    this.iface.setValue(this.ifaceList[0]), window.setTimeout(() => {
                        this.iface.setValue(this.ifaceList[0])
                    }, 250)
                }

                enableDisableControls() {
                    const t = this.ping.value, a = this.trace.value;
                    t && a ? (this.packetlength.enable(), this.pingTimes.enable(), this.maxNumber.enable()) : t ? (this.packetlength.enable(), this.pingTimes.enable(), this.maxNumber.disable()) : a ? (this.packetlength.enable(), this.pingTimes.disable(), this.maxNumber.enable()) : (this.packetlength.disable(), this.pingTimes.disable(), this.maxNumber.disable())
                }

                ngOnDestroy() {
                    this.message.hideMessage({show: !1}), this.pureViewSnackbarService.hideMessageSnackbar(), this.pageRefreshSub?.unsubscribe(), this.timerInterval && this.timerInterval.unsubscribe()
                }

                doPing() {
                    this.isIpValid = !0, this.ipErrorM = "", this.startTestDisable = !0, this.timerInterval && this.timerInterval.unsubscribe();
                    const t = this.iface.value;
                    let a = 0;
                    for (const v of this.ifConnsData) {
                        for (const m of v.ipConns) if (m.Name === t.n) {
                            a = m.X_ALU_COM_isFixedWAN;
                            break
                        }
                        for (const m of v.pppConns) if (m.Name === t.n) {
                            a = m.X_ALU_COM_isFixedWAN;
                            break
                        }
                    }
                    if (1 === a) return this.showWarning(this.constants.ERR_FIXED_WAN), !1;
                    const s = this.ipAdress.value;
                    if (!s) return this.isIpValid = !1, this.ipErrorM = this.constants.REQUIRED_FIELD_LABEL, !1;
                    if ("ipv4" == this.proipv.value) {
                        if (!this.validators.Ipv4AddressValidation(s) && !this.validators.checkDomain(s)) return this.isIpValid = !1, this.ipErrorM = this.constants.INVALID_IP_DOMAIN_NAME, !1
                    } else {
                        if (!this.checkipv6(s) && !this.checkDomain(s)) return this.isIpValid = !1, this.ipErrorM = this.constants.INVALID_IP_DOMAIN_NAME, !1;
                        if (this.trace.value && this.isV6LocalLinkAddr(s) && !this.iface.value) return this.ipErrorM = this.constants.PLEASE_SELECT_WAN_CONNECT_LIST, !1
                    }
                    const o = this.ping.value, d = this.trace.value;
                    if (!o && !d) return this.showWarning(this.constants.PLEASE_SELECT_PING_OR_TRACE), !1;
                    if (o || d) {
                        if (this.isipv4) {
                            if (!this.checkValidDiagValues(this.packetlength.value, 64, 1500)) return this.showWarning(this.constants.DEFINE_PACKET_SIZE), !1
                        } else if (!this.checkValidDiagValues(this.packetlength.value, 72, 32768)) return this.showWarning(this.constants.DEFINE_PACKET_SIZE6), !1;
                        if (o && !this.checkValidDiagValues(this.pingTimes.value, 1, 1e3)) return this.showWarning(this.constants.DEFINE_ECHO_REQUESTS), !1;
                        if (d && !this.checkValidDiagValues(this.maxNumber.value, 1, 255)) return this.showWarning(this.constants.NUM_TRACEROUTE_HOPS), !1
                    }
                    const h = `${o ? "ping" : ""}${o && d ? "," : ""}${d ? "trace" : ""}`;
                    this.log = "";
                    const _ = `ipversion=${this.proipv.value}&iface=${t.o ? t.o : ""}&ipaddr=${s}&checkall=${h}&pingcount=${this.pingTimes.value}&packetlength=${this.packetlength.value}&tracehops=${this.maxNumber.value}`;
                    this.isPingStarted = !0, console.log("params", _), this.api.request(this, "setDiagnosticsInfo", _)
                }

                runShellCatCommand() {
                    this.api.request(this, "invokeShellCatCommand", this.pId)
                }

                fwaPingResult(t) {
                    this.log = `${t.substr(1)} \n`, -1 !== this.log.indexOf("min/avg/max") && (this.stopPing(), this.cancelPing()), -1 !== this.log.indexOf("100% packet loss") && (this.stopPing(), this.cancelPing()), -1 !== this.log.indexOf("Temporary failure") && (this.stopPing(), this.cancelPing()), -1 !== this.log.indexOf("Name or service") && (this.stopPing(), this.cancelPing()), -1 !== this.log.indexOf("Resume:") && (this.stopPing(), this.cancelPing())
                }

                syncShellCatCommand(t) {
                    const a = this.ping.value, s = this.trace.value;
                    if (">" === t.substr(0, 1)) {
                        if (this.api.isBhartiReceiver) return void this.fwaPingResult(t);
                        this.log += `${t.substr(1)} \n`, !a && s ? -1 !== this.log.indexOf("traceroute job completed!!") && this.stopPing() : -1 !== this.log.indexOf("transmitted") && this.stopPing()
                    } else this.stopPing()
                }

                stopPing() {
                    this.isPingStarted = !1, this.api.request(this, "cancelDiagnosticsInfo"), this.timerInterval && this.timerInterval.unsubscribe()
                }

                cancelPing() {
                    this.startTestDisable = !1, this.api.request(this, "cancelDiagnosticsInfo")
                }

                checkValidDiagValues(t, a, s) {
                    return !(isNaN(+t) || +t !== parseFloat(t) || +t < a || +t > s)
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
                    const a = t.data;
                    switch (t.action) {
                        case r.En.GET_ROUTER_INFO:
                            this.loadRouterInfo(this.api);
                            break;
                        case r.En.GET_DIAGNOSTICS_INFO:
                            this.syncDiagnosticsData(a);
                            break;
                        case r.En.INVOKE_CAT_COMMAND:
                            this.syncShellCatCommand(a);
                            break;
                        case r.En.SET_DIAGNOSTICS_INFO:
                            0 === a.result ? (this.pId = a.pid, this.timerInterval = (0, V.Y)(2e3).subscribe(s => {
                                this.runShellCatCommand()
                            })) : this.isPingStarted = !1;
                            break;
                        case r.En.CANCEL_DIAGNOSTICS_INFO:
                            this.isPingStarted = !1, this.timerInterval && this.timerInterval.unsubscribe()
                    }
                }

                onError(t) {
                    switch (t.action) {
                        case r.En.GET_ROUTER_INFO:
                            console.error("GET_ROUTER_INFO API Failed - Error"), console.error(t);
                            break;
                        case r.En.GET_DIAGNOSTICS_INFO:
                            console.error("GET_DNS_DATA API Failed - Error"), console.error(t);
                            break;
                        case r.En.INVOKE_CAT_COMMAND:
                            console.error("INVOKE_CAT_COMMAND API Failed - Error"), console.error(t);
                            break;
                        case r.En.SET_DIAGNOSTICS_INFO:
                            console.error("SET_DIAGNOSTICS_INFO API Failed - Error"), console.error(t);
                            break;
                        case r.En.CANCEL_DIAGNOSTICS_INFO:
                            console.error("CANCEL_DIAGNOSTICS_INFO API Failed - Error"), console.error(t)
                    }
                }

                get proipv() {
                    return this.diagnosticsForm.get("proipv")
                }

                get iface() {
                    return this.diagnosticsForm.get("iface")
                }

                get maxNumber() {
                    return this.diagnosticsForm.get("maxNumber")
                }

                get trace() {
                    return this.diagnosticsForm.get("trace")
                }

                get ping() {
                    return this.diagnosticsForm.get("ping")
                }

                get pingTimes() {
                    return this.diagnosticsForm.get("pingTimes")
                }

                get packetlength() {
                    return this.diagnosticsForm.get("packetlength")
                }

                get ipAdress() {
                    return this.diagnosticsForm.get("ipAdress")
                }

                checkDomain(t) {
                    return !(t.length > 255 || !/^(([a-zA-Z0-9]{1,2})|([a-zA-Z0-9]([a-zA-Z0-9-]){1,61}[a-zA-Z0-9]))(\.(([a-zA-Z0-9]{1,2})|([a-zA-Z0-9]([a-zA-Z0-9-]){1,61}[a-zA-Z0-9]))){1,}$/.test(t))
                }

                checkipv6(t) {
                    if (null == t.match(/[1-9A-Fa-f]/g) || !t.trim() || -1 != t.indexOf("/")) return !1;
                    const a = t.split("/");
                    if (!/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/.test(a[0])) return !1;
                    const o = a[1];
                    return !o || !!(o.isdd() && parseInt(o) >= 0 && parseInt(o) <= 128)
                }

                isV6LocalLinkAddr(t) {
                    const a = t.substring(0, 4), s = parseInt(a, 16);
                    return s >= 65152 && s <= 65215
                }

                static #e = this.\u0275fac = function (a) {
                    return new (a || i)(e.rXU(D.t), e.rXU(p.YM), e.rXU(I.G), e.rXU(F.u), e.rXU(n.m4), e.rXU(O.V), e.rXU(f.Q), e.rXU(n.gd), e.rXU(C.Z))
                };
                static #t = this.\u0275cmp = e.VBU({
                    type: i,
                    selectors: [["app-diagnostics"]],
                    decls: 19,
                    vars: 14,
                    consts: [["formRef", ""], [3, "formGroup"], ["h2-bold", "", "mb-4", "", 3, "title"], ["pb-4", "", 3, "disabled", "hasBorder", "rowLayout", 4, "ngIf"], ["pb-4", "", 3, "disabled", "rowLayout", "hasBorder", 4, "ngIf"], ["pb-4", "", "labelAlign", "top", 3, "disabled", "hasBorder", "rowLayout", 4, "ngIf"], [1, "flex-row"], ["type", "submit", "buttonType", "submit", "size", "small", "mr-2", "", 3, "title", "isDisabled", "onClick", 4, "ngIf"], ["size", "small", "buttonType", "button", "outline", "primary", 3, "isDisabled", "title", "onClick", 4, "ngIf"], ["mt-4", ""], [3, "ngModelChange", "ngModel"], ["pb-4", "", 3, "disabled", "hasBorder", "rowLayout"], [3, "title"], [1, "diagnostics__form-control"], ["formControlName", "proipv", "size", "MEDIUM", 3, "disabled"], [3, "label", "value", 4, "ngFor", "ngForOf"], [3, "label", "value"], ["formControlName", "iface", "size", "MEDIUM", 3, "disabled"], ["size", "MEDIUM", "formControlName", "ipAdress", 3, "disabled", "isValidated", "errorMessage", "hideErrorIcon"], ["pb-4", "", 3, "disabled", "rowLayout", "hasBorder"], ["formControlName", "ping", 3, "onCheck", "disabled", "isChecked"], ["formControlName", "trace", 3, "onCheck", "disabled", "isChecked"], ["pb-4", "", "labelAlign", "top", 3, "disabled", "hasBorder", "rowLayout"], ["mt-2", "", 3, "title"], ["subtext2-regular-800", "", "mt-4", "", 3, "title"], ["size", "MEDIUM", "formControlName", "pingTimes", 1, "diagnostics__form-control", 3, "disabled", "isValidated"], ["size", "MEDIUM", "formControlName", "packetlength", 1, "diagnostics__form-control", 3, "disabled", "isValidated"], ["size", "MEDIUM", "formControlName", "maxNumber", 1, "diagnostics__form-control", 3, "disabled", "isValidated"], ["type", "submit", "buttonType", "submit", "size", "small", "mr-2", "", 3, "onClick", "title", "isDisabled"], ["size", "small", "buttonType", "button", "outline", "primary", 3, "onClick", "isDisabled", "title"]],
                    template: function (a, s) {
                        if (1 & a) {
                            const o = e.RV6();
                            e.j41(0, "div")(1, "form", 1, 0)(3, "pv-card"), e.nrm(4, "pv-text", 2), e.DNE(5, j, 6, 6, "pv-form-field", 3)(6, z, 6, 6, "pv-form-field", 3)(7, K, 5, 8, "pv-form-field", 3)(8, q, 4, 6, "pv-form-field", 4)(9, J, 4, 6, "pv-form-field", 4)(10, Z, 6, 7, "pv-form-field", 5)(11, Q, 6, 7, "pv-form-field", 5)(12, ee, 6, 7, "pv-form-field", 5)(13, te, 6, 7, "pv-form-field", 5), e.j41(14, "div", 6), e.DNE(15, ie, 1, 2, "pv-button", 7)(16, se, 1, 2, "pv-button", 8), e.k0s()()(), e.j41(17, "pv-card", 9)(18, "pv-textarea", 10), e.mxI("ngModelChange", function (h) {
                                return e.eBV(o), e.DH7(s.log, h) || (s.log = h), e.Njj(h)
                            }), e.k0s()()()
                        }
                        2 & a && (e.R7$(), e.Y8G("formGroup", s.diagnosticsForm), e.R7$(3), e.Y8G("title", s.constants.WAN_NETWORK), e.R7$(), e.Y8G("ngIf", s.api.device_capability.getVal("maintenance", "diagnostics", "protocol").isOn), e.R7$(), e.Y8G("ngIf", s.api.device_capability.getVal("maintenance", "diagnostics", "wanConnectionList").isOn), e.R7$(), e.Y8G("ngIf", s.api.device_capability.getVal("maintenance", "diagnostics", "ipOrDomainName").isOn), e.R7$(), e.Y8G("ngIf", s.api.device_capability.getVal("maintenance", "diagnostics", "ping").isOn), e.R7$(), e.Y8G("ngIf", s.api.device_capability.getVal("maintenance", "diagnostics", "traceRoute").isOn), e.R7$(), e.Y8G("ngIf", s.api.device_capability.getVal("maintenance", "diagnostics", "pingTryTimes").isOn), e.R7$(), e.Y8G("ngIf", s.isipv4 && s.api.device_capability.getVal("maintenance", "diagnostics", "packetLength").isOn), e.R7$(), e.Y8G("ngIf", !s.isipv4 && s.api.device_capability.getVal("maintenance", "diagnostics", "packetLength").isOn), e.R7$(), e.Y8G("ngIf", s.api.device_capability.getVal("maintenance", "diagnostics", "maxNoOfTraceHops").isOn), e.R7$(2), e.Y8G("ngIf", s.api.device_capability.getVal("maintenance", "diagnostics", "startButton").isOn), e.R7$(), e.Y8G("ngIf", s.api.device_capability.getVal("maintenance", "diagnostics", "cancelButton").isOn), e.R7$(2), e.R50("ngModel", s.log))
                    },
                    dependencies: [b.Sq, b.bT, l.qT, l.BC, l.cb, l.vS, n.xJ, n.Sp, n.XL, n.hO, n.v9, n.X, n.RA, n.Od, n.pF, l.j4, l.JD],
                    styles: [".diagnostics__form-control[_ngcontent-%COMP%]{width:300px}"]
                })
            }

            return i
        })();
        var N = u(6939), ne = u(8855), M = u(8100), oe = u(4796);

        function re(i, c) {
            if (1 & i && e.nrm(0, "pv-select-option", 13), 2 & i) {
                const t = c.$implicit, a = c.index, s = e.XpG(2);
                e.Y8G("label", s.prodcfg.supportsFWADevice ? t.label : t)("value", s.prodcfg.supportsFWADevice ? t.value : a)
            }
        }

        function le(i, c) {
            if (1 & i && (e.j41(0, "pv-form-field", 8)(1, "label"), e.nrm(2, "pv-text", 9), e.k0s(), e.j41(3, "span", 10)(4, "pv-select", 11), e.DNE(5, re, 1, 2, "pv-select-option", 12), e.k0s()()()), 2 & i) {
                const t = e.XpG();
                e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "log", "writingLevel").isDisabled)("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.WRITING_LEVEL), e.R7$(2), e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "log", "writingLevel").isDisabled), e.R7$(), e.Y8G("ngForOf", t.writingLevelList)
            }
        }

        function ce(i, c) {
            if (1 & i && e.nrm(0, "pv-select-option", 13), 2 & i) {
                const t = c.$implicit;
                e.Y8G("label", t.label)("value", t.value)
            }
        }

        function de(i, c) {
            if (1 & i && (e.j41(0, "pv-form-field", 8)(1, "label"), e.nrm(2, "pv-text", 9), e.k0s(), e.j41(3, "span", 10)(4, "pv-select", 14), e.DNE(5, ce, 1, 2, "pv-select-option", 12), e.k0s()()()), 2 & i) {
                const t = e.XpG();
                e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "log", "readingLevel").isDisabled)("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.READING_LEVEL), e.R7$(2), e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "log", "readingLevel").isDisabled), e.R7$(), e.Y8G("ngForOf", t.readingLevelList)
            }
        }

        function pe(i, c) {
            if (1 & i && e.nrm(0, "pv-textarea", 15), 2 & i) {
                const t = e.XpG();
                e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "log", "logInfo").isDisabled)
            }
        }

        function he(i, c) {
            if (1 & i && (e.j41(0, "pv-card", 16)(1, "pv-form-field", 17)(2, "label"), e.nrm(3, "pv-text", 18), e.k0s(), e.nrm(4, "pv-toggle", 19), e.k0s(), e.j41(5, "pv-form-field", 20)(6, "label"), e.nrm(7, "pv-text", 21), e.k0s(), e.j41(8, "span", 10), e.nrm(9, "pv-inputbox", 22), e.k0s()()()), 2 & i) {
                const t = e.XpG();
                e.R7$(), e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "log", "rttyLogs").isDisabled || !t.prodcfg.supportsFWADevice)("rowLayout", !0)("hasBorder", !0), e.R7$(2), e.Y8G("title", t.constants.RTTY_LOGS), e.R7$(), e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "log", "rttyLogs").isDisabled || !t.prodcfg.supportsFWADevice)("isChecked", t.rtty.value), e.R7$(), e.Y8G("rowLayout", !0)("hasBorder", !0), e.R7$(2), e.Y8G("title", t.constants.RTTY_URL), e.R7$(2), e.Y8G("isValidated", t.urlValidate)("errorMessage", t.urlErrorMsg)("hideErrorIcon", !0)("disabled", t.api.device_capability.getVal("maintenance", "log", "rttyLogs").isDisabled || !t.prodcfg.supportsFWADevice)
            }
        }

        function ue(i, c) {
            if (1 & i && (e.j41(0, "pv-card", 23)(1, "pv-form-field", 24)(2, "label"), e.nrm(3, "pv-text", 25), e.k0s(), e.nrm(4, "pv-toggle", 26), e.k0s()()), 2 & i) {
                const t = e.XpG();
                e.R7$(), e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "log", "eltLogs").isDisabled || !t.prodcfg.isFWAReceiver)("rowLayout", !0)("hasBorder", !0), e.R7$(2), e.Y8G("title", t.constants.ELT_LOGS), e.R7$(), e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "log", "eltLogs").isDisabled || !t.prodcfg.isFWAReceiver)("isChecked", t.elt.value)
            }
        }

        function fe(i, c) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-button", 30), e.bIt("onClick", function () {
                    e.eBV(t);
                    const s = e.XpG(2);
                    return e.Njj(s.submitForm())
                }), e.k0s()
            }
            if (2 & i) {
                const t = e.XpG(2);
                e.Y8G("isDisabled", t.isCFGMode || t.logForm.invalid || t.api.device_capability.getVal("maintenance", "log", "saveButton").isDisabled)("title", t.constants.SAVE)("webSave", t.showSaveIcon)("showButtonLoader", t.disableSave)
            }
        }

        function ge(i, c) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-button", 31), e.bIt("click", function () {
                    e.eBV(t);
                    const s = e.XpG(2);
                    return e.Njj(s.onExport())
                }), e.k0s()
            }
            if (2 & i) {
                const t = e.XpG(2);
                e.Y8G("isDisabled", t.isCFGMode || t.api.device_capability.getVal("maintenance", "log", "exportLog").isDisabled)("title", t.constants.EXPORT_LOG)
            }
        }

        function _e(i, c) {
            if (1 & i && (e.qex(0), e.j41(1, "div", 27), e.DNE(2, fe, 1, 4, "pv-button", 28), e.k0s(), e.j41(3, "div", 27), e.DNE(4, ge, 1, 2, "pv-button", 29), e.k0s(), e.bVm()), 2 & i) {
                const t = e.XpG();
                e.R7$(2), e.Y8G("ngIf", t.api.device_capability.getVal("maintenance", "log", "saveButton").isOn), e.R7$(2), e.Y8G("ngIf", t.api.device_capability.getVal("maintenance", "log", "exportLog").isOn)
            }
        }

        let me = (() => {
            class i {
                constructor(t, a, s, o, d, h, _, v, m, E, R, y) {
                    this.portalService = t, this.appAccessService = a, this.constants = s, this.api = o, this.gconfig = d, this.message = h, this.validations = _, this.auth = v, this.pubSubService = m, this.pureViewSnackbarService = E, this.logger = R, this.prodcfg = y, this.writingLevelList = [], this.isCFGMode = !1, this.readingLevelList = [], this.exportText = "", this.showSaveIcon = !1, this.disableSave = !1, this.urlErrorMsg = "", this.urlValidate = !0, this.ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, this.ipv6Pattern = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, this.logForm = new l.gE({
                        writingLevel: new l.MJ({
                            value: "",
                            disabled: this.api.device_capability.getVal("maintenance", "log", "writingLevel").isDisabled
                        }),
                        readingLevel: new l.MJ({
                            value: "",
                            disabled: this.api.device_capability.getVal("maintenance", "log", "readingLevel").isDisabled
                        }),
                        logWrite: new l.MJ({
                            value: "",
                            disabled: this.api.device_capability.getVal("maintenance", "log", "logInfo").isDisabled
                        }),
                        eltLogs: new l.MJ({
                            value: "",
                            disabled: this.api.device_capability.getVal("maintenance", "log", "eltLogs").isDisabled
                        }),
                        rttyLogs: new l.MJ({
                            value: !1,
                            disabled: this.api.device_capability.getVal("maintenance", "log", "rttyLogs").isDisabled
                        }),
                        rttyUrl: new l.MJ({
                            value: "",
                            disabled: this.api.device_capability.getVal("maintenance", "log", "rttyLogs").isDisabled
                        }, [l.k0.maxLength(256), l.k0.pattern(`${this.ipv4Pattern.source}|${this.ipv6Pattern.source}`)])
                    }), this.handleRTTYLogsResponse = {
                        onSuccess: S => {
                            0 == S.data.result ? (console.log(S.data), this.api.get_rtty_logs = S.data.FunctionResult, this.rtty.setValue(this.api.get_rtty_logs.Enable), this.rttyUrl.setValue(this.api.get_rtty_logs.DebugServerURL)) : console.error("Error:", S.data.reason)
                        }, onError: S => {
                            this.api.requestTimeoutSnackbar(), console.error("Error:", S)
                        }
                    }, this.handleSetRTTYLogsResponse = {
                        onSuccess: S => {
                            0 == S.data.result ? this.api.requestSuccessSnackbar() : this.api.unknownErrorSnackbar(), this.getRTTYLogs()
                        }, onError: S => {
                            this.api.requestTimeoutSnackbar(), console.error("Error:", S), this.getRTTYLogs()
                        }
                    }, "" !== this.api.router_info.gwmodel ? this.loadRouterInfo(this.api) : this.api.request(this, "getRouterInfo")
                }

                loadRouterInfo(t) {
                    this.isCFGMode = -1 === t.brEnable, this.isCFGMode && ("BWDS" === this.api.g_opId || "BATL" === this.api.g_opId && this.api.device_capability.getVal("overview", "networkMap", "addWifiButton", "showAddSerialNumberModal").isOn ? window.alert(this.constants.CFG_WARNING_BWDS) : window.alert(this.constants.CFG_WARNING))
                }

                ngOnInit() {
                    this.formOptionsList(), this.getLogsInfo(), void 0 !== this.prodcfg.isFWAReceiver || void 0 !== this.prodcfg.supportsFWADevice ? (this.getEltLogsInfo(), this.getRTTYLogs()) : this.startPolling(), this.portalService.passPortal(this.portalContent), setTimeout(() => {
                        this.portalService.passPortal(this.portalContent), this.setValueOnLangChange()
                    }, 1e3), this.refreshPage(), this.onLanguageChanges(), this.logForm.valueChanges.subscribe(() => {
                        this.logForm.invalid ? (this.urlErrorMsg = this.constants.PLEASE_ENTER_VALID_IPV4_IPV6_ADDRESS, this.urlValidate = !1) : (this.urlErrorMsg = "", this.urlValidate = !0)
                    })
                }

                onLanguageChanges() {
                    this.langChangeSub = this.pubSubService.subscribe(r.VR.LANGUAGE_CHANGE, t => {
                        this.setValueOnLangChange(), window.setTimeout(() => {
                            this.setValueOnLangChange()
                        }, 500)
                    })
                }

                setValueOnLangChange() {
                    this.formOptionsList(), this.syncLogsData(this.api.get_log_info, !1)
                }

                formOptionsList() {
                    this.writingLevelList = this.prodcfg.supportsFWADevice ? [{
                        label: this.constants.LOG_EMERGENCY,
                        value: "Emergency"
                    }, {label: this.constants.LOG_ALERT, value: "Alert"}, {
                        label: this.constants.LOG_CRITICAL,
                        value: "Critical"
                    }, {label: this.constants.ERROR_LABEL, value: "Error"}, {
                        label: this.constants.WARNING,
                        value: "Warning"
                    }, {label: this.constants.LOG_NOTICE, value: "Notice"}, {
                        label: this.constants.LOG_INFORMATIONAL,
                        value: "Informational"
                    }, {
                        label: this.constants.LOG_DEBUG,
                        value: "Debug"
                    }] : [this.constants.LOG_EMERGENCY, this.constants.LOG_ALERT, this.constants.LOG_CRITICAL, this.constants.ERROR_LABEL, this.constants.WARNING, this.constants.LOG_NOTICE, this.constants.LOG_INFORMATIONAL, this.constants.LOG_DEBUG], this.readingLevelList = [{
                        label: this.constants.LOG_EMERGENCY,
                        value: "Emergency"
                    }, {label: this.constants.LOG_ALERT, value: "Alert"}, {
                        label: this.constants.LOG_CRITICAL,
                        value: "Critical"
                    }, {label: this.constants.ERROR_LABEL, value: "Error"}, {
                        label: this.constants.WARNING,
                        value: "Warning"
                    }, {label: this.constants.LOG_NOTICE, value: "Notice"}, {
                        label: this.constants.LOG_INFORMATIONAL,
                        value: "Informational"
                    }, {label: this.constants.LOG_DEBUG, value: "Debug"}]
                }

                refreshPage() {
                    this.pageRefreshSub = this.pubSubService.subscribe(r.VR.HEADER_REFRESH_CLICKED, t => {
                        this.getLogsInfo(), this.getEltLogsInfo(), this.getRTTYLogs()
                    })
                }

                getLogsInfo() {
                    this.api.request(this, "getLogsInfo")
                }

                startPolling() {
                    this.pollingSubscription = (0, V.Y)(100).subscribe(() => {
                        (void 0 !== this.prodcfg.isFWAReceiver || void 0 !== this.prodcfg.supportsFWADevice) && (this.pollingSubscription.unsubscribe(), this.getEltLogsInfo(), this.getRTTYLogs())
                    })
                }

                getEltLogsInfo() {
                    this.prodcfg.isFWAReceiver && this.api.device_capability.getVal("maintenance", "log", "eltLogs").isOn && (this.api.createBody("GetModemLogMode"), this.api.request(this, "getModemLogMode"))
                }

                setEltLogsInfo(t) {
                    this.api.createBody("SetModemLogMode", '[{ "Enable" : ' + t + " }]"), this.api.request(this, "setModemLogMode")
                }

                getRTTYLogs() {
                    this.prodcfg.supportsFWADevice && this.api.device_capability.getVal("maintenance", "log", "rttyLogs").isOn && (this.api.createBody("GetDebugServerConfig"), this.api.request(this.handleRTTYLogsResponse, "callUBUS"))
                }

                setRTTYLogs() {
                    const t = new ne.A;
                    t.Enable = this.logForm.get("rttyLogs").value, t.DebugServerURL = this.logForm.get("rttyUrl").value;
                    const a = "[" + JSON.stringify(t) + "]";
                    this.api.createBody("SetDebugServerConfig", a), this.api.request(this.handleSetRTTYLogsResponse, "callUBUS")
                }

                showWarningTitle(t) {
                    this.message.showMessage({
                        show: !0,
                        title: this.constants.WARNING,
                        width: "400px",
                        description: t,
                        buttonText: this.constants.OKAY_LABEL
                    })
                }

                syncLogsData(t, a) {
                    window.setTimeout(() => {
                        this.writingLevel.setValue(this.prodcfg.supportsFWADevice ? t.vendor_log_cfg.X_ALU_COM_LogSeverity : t.ct_syslog_cfg.Level), this.readingLevel.setValue(t.syslog_cfg.LocalDisplayLevel)
                    }, 100), a && this.api.request(this, "getLog")
                }

                findLogLevel() {
                    if (!this.prodcfg.supportsFWADevice) return this.writingLevel.value;
                    for (let t = 0; t < this.writingLevelList.length; t++) if (this.writingLevel.value === this.writingLevelList[t].value) return t
                }

                ngOnDestroy() {
                    this.message.hideMessage({show: !1}), this.pureViewSnackbarService.hideMessageSnackbar(), this.pageRefreshSub?.unsubscribe(), this.langChangeSub.unsubscribe(), this.portalContent?.isAttached && this.portalContent.detach(), this.pollingSubscription && this.pollingSubscription.unsubscribe()
                }

                submitForm() {
                    this.pureViewSnackbarService.hideMessageSnackbar(), this.disableSave = !0;
                    const t = `logLevel=${this.findLogLevel()}&logDispLevel=${this.readingLevel.value}`;
                    this.logger.console(t), this.api.request(this, "setlog", t), this.prodcfg.isFWAReceiver && this.api.device_capability.getVal("maintenance", "log", "eltLogs").isOn && this.setEltLogsInfo(this.elt.value), this.prodcfg.supportsFWADevice && this.api.device_capability.getVal("maintenance", "log", "rttyLogs").isOn && (this.rtty.value && this.showWarningTitle(this.constants.REMEMBER_TO_DISABLE_LOGS), this.setRTTYLogs())
                }

                onExport() {
                    this.pureViewSnackbarService.hideMessageSnackbar(), this.createAndDownloadBlobFile(this.validations.logs, {type: "text/plain;charset=utf-8"}, "onu_info.log")
                }

                createAndDownloadBlobFile(t, a, s) {
                    const o = new Blob([t], a);
                    if (navigator.msSaveBlob) navigator.msSaveBlob(o, s), this.exportText = "Success"; else {
                        const d = document.createElement("a");
                        if (void 0 !== d.download) {
                            const h = URL.createObjectURL(o);
                            d.setAttribute("href", h), d.setAttribute("download", s), d.style.visibility = "hidden", document.body.appendChild(d), d.click(), document.body.removeChild(d), this.exportText = "Success"
                        }
                    }
                }

                onSuccess(t) {
                    const a = t.data;
                    switch (t.action) {
                        case r.En.GET_ROUTER_INFO:
                            this.loadRouterInfo(this.api);
                            break;
                        case r.En.GET_LOG_INFO:
                            this.syncLogsData(a, !0);
                            break;
                        case r.En.GET_LOG:
                            this.logWrite.setValue(a), this.validations.logs = this.logWrite.value;
                            break;
                        case r.En.SET_LOG:
                            this.disableSave = !1, this.getLogsInfo(), this.showSaveIcon = !0, window.setTimeout(() => {
                                this.showSaveIcon = !1
                            }, 1e3);
                            break;
                        case r.En.GET_MODEM_LOG_MODE:
                            0 === a.result && (this.api.get_modem_log_mode = a.FunctionResult, this.elt.setValue(this.api.get_modem_log_mode.Enable))
                    }
                }

                onError(t) {
                    switch (t.action) {
                        case r.En.GET_ROUTER_INFO:
                            console.error("GET_ROUTER_INFO API Failed - Error"), console.error(t);
                            break;
                        case r.En.GET_LOG_INFO:
                            console.error("GET_LOG_INFO API Failed - Error"), console.error(t);
                            break;
                        case r.En.GET_LOG:
                            console.error("GET_LOG API Failed - Error"), console.error(t);
                            break;
                        case r.En.SET_LOG:
                            this.disableSave = !1, console.error("SET_LOG API Failed - Error"), console.error(t);
                            break;
                        case r.En.DEL_DEVICE_MANAGEMENT_INFO:
                            console.error("DEL_DEVICE_MANAGEMENT_INFO API Failed - Error"), console.error(t);
                            break;
                        case r.En.GET_MODEM_LOG_MODE:
                            console.error("GET_MODEM_LOG_MODE API Failed - Error"), console.error(t)
                    }
                }

                get writingLevel() {
                    return this.logForm.get("writingLevel")
                }

                get readingLevel() {
                    return this.logForm.get("readingLevel")
                }

                get logWrite() {
                    return this.logForm.get("logWrite")
                }

                get elt() {
                    return this.logForm.get("eltLogs")
                }

                get rtty() {
                    return this.logForm.get("rttyLogs")
                }

                get rttyUrl() {
                    return this.logForm.get("rttyUrl")
                }

                static #e = this.\u0275fac = function (a) {
                    return new (a || i)(e.rXU(M._), e.rXU(D.t), e.rXU(p.YM), e.rXU(I.G), e.rXU(F.u), e.rXU(n.m4), e.rXU(O.V), e.rXU(oe.u), e.rXU(f.Q), e.rXU(n.gd), e.rXU(g.V), e.rXU(C.Z))
                };
                static #t = this.\u0275cmp = e.VBU({
                    type: i,
                    selectors: [["app-log"]],
                    viewQuery: function (a, s) {
                        if (1 & a && e.GBs(N.bV, 7), 2 & a) {
                            let o;
                            e.mGM(o = e.lsd()) && (s.portalContent = o.first)
                        }
                    },
                    decls: 11,
                    vars: 6,
                    consts: [["formRef", ""], [3, "formGroup"], ["mb-4", ""], ["pb-4", "", 3, "disabled", "hasBorder", "rowLayout", 4, "ngIf"], ["formControlName", "logWrite", 3, "disabled", 4, "ngIf"], ["id", "rtty-logs-card", "mt-4", "", 4, "ngIf"], ["id", "elt-logs-card", "mt-4", "", 4, "ngIf"], [4, "cdkPortal"], ["pb-4", "", 3, "disabled", "hasBorder", "rowLayout"], [3, "title"], [1, "log__form-control"], ["formControlName", "writingLevel", "size", "MEDIUM", 3, "disabled"], [3, "label", "value", 4, "ngFor", "ngForOf"], [3, "label", "value"], ["formControlName", "readingLevel", "size", "MEDIUM", 3, "disabled"], ["formControlName", "logWrite", 3, "disabled"], ["id", "rtty-logs-card", "mt-4", ""], ["id", "rtty-logs-form-field", "pb-4", "", 3, "disabled", "rowLayout", "hasBorder"], ["id", "rtty-logs-label", 3, "title"], ["id", "rtty-logs-toggle", "formControlName", "rttyLogs", 3, "disabled", "isChecked"], ["id", "rtty-logs-url-form-field", "pb-4", "", 3, "rowLayout", "hasBorder"], ["id", "rtty-logs-url-label", 3, "title"], ["size", "MEDIUM", "formControlName", "rttyUrl", "maxlength", "256", 3, "isValidated", "errorMessage", "hideErrorIcon", "disabled"], ["id", "elt-logs-card", "mt-4", ""], ["id", "elt-logs-card-form-field", "pb-4", "", 3, "disabled", "rowLayout", "hasBorder"], ["id", "elt-logs-card-label", 3, "title"], ["id", "elt-logs-card-toggle", "formControlName", "eltLogs", 3, "disabled", "isChecked"], [1, "flex-row", "flex-row__center"], ["buttonType", "submit", "size", "small", "mr-2", "", 3, "isDisabled", "title", "webSave", "showButtonLoader", "onClick", 4, "ngIf"], ["outline", "primary", "size", "small", "type", "button", 3, "isDisabled", "title", "click", 4, "ngIf"], ["buttonType", "submit", "size", "small", "mr-2", "", 3, "onClick", "isDisabled", "title", "webSave", "showButtonLoader"], ["outline", "primary", "size", "small", "type", "button", 3, "click", "isDisabled", "title"]],
                    template: function (a, s) {
                        1 & a && (e.j41(0, "div")(1, "form", 1, 0)(3, "pv-card", 2), e.DNE(4, le, 6, 6, "pv-form-field", 3)(5, de, 6, 6, "pv-form-field", 3), e.k0s(), e.j41(6, "pv-card"), e.DNE(7, pe, 1, 1, "pv-textarea", 4), e.k0s(), e.DNE(8, he, 10, 13, "pv-card", 5)(9, ue, 5, 6, "pv-card", 6)(10, _e, 5, 2, "ng-container", 7), e.k0s()()), 2 & a && (e.R7$(), e.Y8G("formGroup", s.logForm), e.R7$(3), e.Y8G("ngIf", s.api.device_capability.getVal("maintenance", "log", "writingLevel").isOn), e.R7$(), e.Y8G("ngIf", s.api.device_capability.getVal("maintenance", "log", "readingLevel").isOn), e.R7$(2), e.Y8G("ngIf", s.api.device_capability.getVal("maintenance", "log", "logInfo").isOn), e.R7$(), e.Y8G("ngIf", s.api.device_capability.getVal("maintenance", "log", "rttyLogs").isOn && s.prodcfg.supportsFWADevice), e.R7$(), e.Y8G("ngIf", s.api.device_capability.getVal("maintenance", "log", "eltLogs").isOn && s.prodcfg.isFWAReceiver))
                    },
                    dependencies: [b.Sq, b.bT, l.qT, l.BC, l.cb, l.tU, n.xJ, n.Sp, n.XL, n.hO, n.v9, n.X, n.RA, n.Od, n.pF, l.j4, l.JD, N.bV],
                    styles: [".log__form-control[_ngcontent-%COMP%]{width:300px}"]
                })
            }

            return i
        })();
        const be = (i, c) => ({"upgrade-firmware__onsuccess": i, "upgrade-firmware__onerror": c});

        function ve(i, c) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-upload", 5), e.bIt("change", function (s) {
                    e.eBV(t);
                    const o = e.XpG();
                    return e.Njj(o.onFileChange(s))
                }), e.k0s()
            }
            if (2 & i) {
                const t = e.XpG();
                e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "backupAndRestore", "selectFile").isDisabled)("title", t.constants.SELECT_FILE)("selectButtonText", t.constants.SELECT)("fileTextNoFile", t.constants.NO_FILE_SELECTED)("fileTextWithFile", t.constants.A_FILE_IS_SELECTED)("isRefresh", t.isRefresh)
            }
        }

        function Ee(i, c) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-button", 9), e.bIt("click", function () {
                    e.eBV(t);
                    const s = e.XpG(2);
                    return e.Njj(s.onImport())
                }), e.k0s()
            }
            if (2 & i) {
                const t = e.XpG(2);
                e.Y8G("isDisabled", t.restoreStarted || t.isCFGMode || t.api.device_capability.getVal("maintenance", "backupAndRestore", "importButton").isDisabled)("title", t.constants.IMPORT)
            }
        }

        function Se(i, c) {
            if (1 & i && (e.j41(0, "pv-form-field", 6)(1, "label"), e.nrm(2, "pv-text", 7), e.k0s(), e.DNE(3, Ee, 1, 2, "pv-button", 8), e.k0s()), 2 & i) {
                const t = e.XpG();
                e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "backupAndRestore", "importConfigFile").isDisabled)("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.IMPORT_CONFIG_FILE), e.R7$(), e.Y8G("ngIf", t.api.device_capability.getVal("maintenance", "backupAndRestore", "importButton").isOn)
            }
        }

        function Re(i, c) {
            if (1 & i && e.nrm(0, "pv-text", 17), 2 & i) {
                const t = e.XpG(2);
                e.Y8G("title", t.constants.REQUIRED_FIELD_LABEL)
            }
        }

        function Ie(i, c) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-dialog", 10), e.bIt("closeDialog", function () {
                    e.eBV(t);
                    const s = e.XpG();
                    return e.Njj(s.closeDialog())
                }), e.qex(1, 11), e.j41(2, "form", 12)(3, "pv-form-field", 13)(4, "pv-inputbox", 14), e.bIt("onModelChange", function (s) {
                    e.eBV(t);
                    const o = e.XpG();
                    return e.Njj(o.onUsernameModelChange(s))
                }), e.k0s(), e.DNE(5, Re, 1, 1, "pv-text", 15), e.k0s(), e.j41(6, "pv-button", 16), e.bIt("click", function () {
                    e.eBV(t);
                    const s = e.XpG();
                    return e.Njj(s.addNewWifiPointDetails())
                }), e.k0s()(), e.bVm(), e.k0s()
            }
            if (2 & i) {
                const t = e.XpG();
                e.Y8G("dialogConfig", t.dialogConfig), e.R7$(2), e.Y8G("formGroup", t.addWifiPointForm), e.R7$(), e.Y8G("hasBorder", !1), e.R7$(), e.Y8G("isValidated", t.isSerialNumValidated)("data", t.serialNumber)("errorMessage", t.SerialErrorMessage)("title", t.constants.SERIAL_NUMBER)("isAutoFocus", !0), e.R7$(), e.Y8G("ngIf", t.serialNumber1.dirty && (null == t.serialNumber1.errors ? null : t.serialNumber1.errors.required)), e.R7$(), e.Y8G("title", t.constants.IMPORT)
            }
        }

        function Ce(i, c) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-button", 9), e.bIt("click", function () {
                    e.eBV(t);
                    const s = e.XpG(2);
                    return e.Njj(s.onExport())
                }), e.k0s()
            }
            if (2 & i) {
                const t = e.XpG(2);
                e.Y8G("isDisabled", t.isCFGMode || t.api.device_capability.getVal("maintenance", "backupAndRestore", "exportButton").isDisabled)("title", t.constants.EXPORT)
            }
        }

        function Le(i, c) {
            if (1 & i && (e.j41(0, "pv-form-field", 6)(1, "label"), e.nrm(2, "pv-text", 7), e.k0s(), e.DNE(3, Ce, 1, 2, "pv-button", 8), e.k0s()), 2 & i) {
                const t = e.XpG();
                e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "backupAndRestore", "exportConfigFile").isDisabled)("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.EXPORT_CONFIG_FILE), e.R7$(), e.Y8G("ngIf", t.api.device_capability.getVal("maintenance", "backupAndRestore", "exportButton").isOn)
            }
        }

        function Te(i, c) {
            if (1 & i && (e.j41(0, "pv-card"), e.nrm(1, "pv-text", 18), e.j41(2, "div", 19), e.nrm(3, "pv-text", 20), e.nI1(4, "textTransform"), e.k0s()()), 2 & i) {
                const t = e.XpG();
                e.R7$(), e.Y8G("title", t.constants.UPGRADE_STATUS), e.R7$(2), e.Y8G("ngClass", e.l_i(6, be, t.isSuccess, t.isError))("title", e.i5U(4, 3, t.fileName, "sentenceCase"))
            }
        }

        let Ae = (() => {
            class i {
                constructor(t, a, s, o, d, h) {
                    this.api = t, this.constants = a, this.message = s, this.pubSubService = o, this.pureViewSnackbarService = d, this.logger = h, this.fileName = "", this.restoreStarted = !1, this.isCFGMode = !1, this.isSuccess = !0, this.isError = !1, this.fileUploaded = !1, this.importText = "", this.exportText = "", this.isRefresh = !1, this.isSerialNumValidated = !0, this.SerialErrorMessage = "", this.serialNumber = "", this.rgwSerialNoList = [], this.beaconDetailList = [], this.beaconEntriesList = [], this.beaconData = {}, this.addNewWifiPointModalShow = !1, this.dialogConfig = {
                        width: "400px",
                        isBackdropClickClose: !1,
                        title: this.constants.SERIAL_NUMBER
                    }, "" !== this.api.router_info.gwmodel ? this.loadRouterInfo(this.api) : this.api.request(this, "getRouterInfo")
                }

                loadRouterInfo(t) {
                    this.isCFGMode = -1 === t.brEnable, this.isCFGMode && ("BWDS" === this.api.g_opId || "BATL" === this.api.g_opId && this.api.device_capability.getVal("overview", "networkMap", "addWifiButton", "showAddSerialNumberModal").isOn ? window.alert(this.constants.CFG_WARNING_BWDS) : window.alert(this.constants.CFG_WARNING))
                }

                ngOnInit() {
                    this.pageRefresh(), this.initForm()
                }

                initForm() {
                    this.addWifiPointForm = new l.gE({serialNumber1: new l.MJ("", l.k0.required)})
                }

                get serialNumber1() {
                    return this.addWifiPointForm.get("serialNumber1")
                }

                pageRefresh() {
                    this.pageRefreshSub = this.pubSubService.subscribe(r.VR.HEADER_REFRESH_CLICKED, t => {
                        this.importText = "", this.isSuccess = !0, this.isError = !1, this.fileUploaded = !1, this.isRefresh = !0
                    })
                }

                ngOnDestroy() {
                    this.message.hideMessage({show: !1}), this.pureViewSnackbarService.hideMessageSnackbar(), this.pageRefreshSub?.unsubscribe()
                }

                onFileChange(t) {
                    this.importText = "", this.isRefresh = !1;
                    const a = new FileReader;
                    if (t.target.files && t.target.files.length > 0) {
                        this.fileUploaded = !0;
                        const s = t.target.files[0];
                        this.fileName = t.target.files[0].name, this.formData = new FormData, this.formData.append("csrf_token", localStorage.getItem("token")), this.formData.append("filename", s);
                        const o = this.fileName.lastIndexOf("."), d = this.fileName.slice(o + 1, this.fileName.length),
                            h = t.target.files[0].size / 1024 / 1024, _ = this.fileName.slice(0, o),
                            v = /^[0-9A-Za-z_]+$/, m = (_.match(/\./g) || []).length;
                        if ("cfg" !== d) return this.fileName = this.constants.INVALID_FILE_FORMAT, this.fileContent = "", this.isSuccess = !1, this.isError = !0, !1;
                        if (Math.floor(h) > 2) return this.fileContent = "", this.fileName = this.constants.FILE_SIZE_TOO_LARGE_UPLOAD_FAILED, this.isSuccess = !1, this.isError = !0, !1;
                        if (!v.test(_) || m > 1) return this.fileName = this.constants.ILLEGAL_FILENAME, this.isSuccess = !1, this.isError = !0, this.fileContent = "", !1;
                        this.isSuccess = !0, this.isError = !1, a.readAsArrayBuffer(s), a.onload = () => {
                            let E = "";
                            const R = new Uint8Array(a.result), y = R.byteLength;
                            for (let S = 0; S < y; S++) E += String.fromCharCode(R[S]);
                            this.fileContent = E
                        }
                    }
                }

                closeDialog() {
                    this.addNewWifiPointModalShow = !1
                }

                onUsernameModelChange(t, a) {
                    this.serialNumber = t ? t.trim() : ""
                }

                validateSerialNumber() {
                    let s = 0, o = 0, d = 0;
                    return this.serialNumber.length < 12 || this.serialNumber.length > 32 ? (this.isSerialNumValidated = !1, this.SerialErrorMessage = this.constants.ERR_LEN_SERIAL_NUM, !1) : /^[A-Za-z0-9]+$/.test(this.serialNumber.slice(4)) ? (this.rgwSerialNoList.forEach(h => {
                        h.SerialNumber.toLowerCase() !== this.serialNumber.toLowerCase() || (o = 1)
                    }), 1 === o ? (this.isSerialNumValidated = !1, this.SerialErrorMessage = this.constants.ERR_SERIAL_SAME_RGW, !1) : (this.beaconDetailList.forEach(h => {
                        h.SerialNumber.toLowerCase() !== this.serialNumber.toLowerCase() || (s = 1)
                    }), 1 === s ? (this.isSerialNumValidated = !1, this.SerialErrorMessage = this.constants.ERR_SERIAL_EXIST, !1) : (this.beaconEntriesList.forEach(h => {
                        +h.BeaconNumberofEntries >= +h.MaxNumberOfBeacons && (d = 1)
                    }), 1 !== d || (this.isSerialNumValidated = !1, this.SerialErrorMessage = this.constants.ERR_MAX_ENTRIES, !1)))) : (this.isSerialNumValidated = !1, this.SerialErrorMessage = this.constants.ERR_SERIAL_SPL_CHAR, !1)
                }

                importstatus(t) {
                    if (0 == t.result) this.logger.console(t.ret, "inside success 0"), this.api.request(this, "rebootSystem"), this.addNewWifiPointModalShow = !1; else {
                        if (6 != t.ret) return this.logger.console(t.ret, "inside other error"), this.showWarning(this.constants.RESTORE_FAILED), this.addNewWifiPointModalShow = !1, this.restoreStarted = !1, !1;
                        this.logger.console(t.ret, "inside 6"), this.addNewWifiPointModalShow = !0
                    }
                }

                onImport() {
                    this.ifImportSuccess()
                }

                addNewWifiPointDetails() {
                    this.isSerialNumValidated = !0, this.SerialErrorMessage = "", this.validateSerialNumber() && this.ifImportNotSuccess()
                }

                ifImportNotSuccess() {
                    if (this.restoreStarted = !0, !window.confirm(this.constants.CONFIRMATION)) return this.restoreStarted = !1, !1;
                    this.api.request(this, "importBackupRestoreWithSerial", {
                        formdata: this.formData,
                        serialNumber: this.serialNumber
                    }), this.logger.console(this.serialNumber)
                }

                showWarning(t) {
                    this.message.showMessage({
                        show: !0,
                        title: this.constants.ERROR_LABEL,
                        description: t,
                        buttonText: "Okay"
                    })
                }

                ifImportSuccess() {
                    if (!this.fileContent) return this.showWarning(this.constants.PLEASE_SELECT_FILE), !1;
                    if (this.restoreStarted = !0, window.confirm(this.constants.CONFIRMATION)) this.api.request(this, "importBackupRestore", this.formData), this.addNewWifiPointModalShow = !1; else if (6 == this.status) return this.restoreStarted = !1, this.addNewWifiPointModalShow = !0, !1
                }

                onExport() {
                    this.exportText = "", this.api.request(this, "exportBackupRestore")
                }

                createAndDownloadBlobFile(t, a, s) {
                    const o = new Blob([t], a);
                    if (navigator.msSaveBlob) navigator.msSaveBlob(o, s), this.exportText = "Success"; else {
                        const d = document.createElement("a");
                        if (void 0 !== d.download) {
                            const h = URL.createObjectURL(o);
                            d.setAttribute("href", h), d.setAttribute("download", s), d.style.visibility = "hidden", document.body.appendChild(d), d.click(), document.body.removeChild(d), this.exportText = "Success"
                        }
                    }
                }

                onSuccess(t) {
                    const a = t.data;
                    switch (t.action) {
                        case r.En.GET_ROUTER_INFO:
                            this.loadRouterInfo(this.api);
                            break;
                        case r.En.IMPORT_BACKUP_RESTORE:
                            this.importstatus(a);
                            break;
                        case r.En.IMPORT_BACKUP_RESTORE_SERIAL:
                            if (this.status = a.ret, this.successStatus = a.result, 0 !== this.successStatus) return this.addNewWifiPointModalShow = !1, this.restoreStarted = !1, this.showWarning(this.constants.RESTORE_FAILED), !1;
                            this.api.request(this, "rebootSystem"), this.addNewWifiPointModalShow = !1;
                            break;
                        case r.En.REBOOT_SYSTEM:
                            this.importText = "Ok", this.logger.console("Backup Restore Page : Reboot Success !");
                            break;
                        case r.En.EXPORT_BACKUP_RESTORE:
                            this.createAndDownloadBlobFile(a, {type: "application/octet-stream"}, "config.cfg")
                    }
                }

                onError(t) {
                    switch (t.action) {
                        case r.En.GET_ROUTER_INFO:
                            console.error("GET_ROUTER_INFO API Failed - Error"), console.error(t);
                            break;
                        case r.En.IMPORT_BACKUP_RESTORE:
                            console.error("IMPORT_BACKUP_RESTORE API Failed - Error"), console.error(t), this.addNewWifiPointModalShow = !1;
                            break;
                        case r.En.IMPORT_BACKUP_RESTORE_SERIAL:
                            console.error("IMPORT_BACKUP_RESTORE_SERIAL API Failed - Error"), console.error(t), this.addNewWifiPointModalShow = !1, this.showWarning(this.constants.RESTORE_FAILED);
                            break;
                        case r.En.REBOOT_SYSTEM:
                            console.error("REBOOT_SYSTEM API Failed - Error"), console.error(t);
                            break;
                        case r.En.EXPORT_BACKUP_RESTORE:
                            console.error("EXPORT_BACKUP_RESTORE API Failed - Error"), console.error(t)
                    }
                }

                static #e = this.\u0275fac = function (a) {
                    return new (a || i)(e.rXU(I.G), e.rXU(p.YM), e.rXU(n.m4), e.rXU(f.Q), e.rXU(n.gd), e.rXU(g.V))
                };
                static #t = this.\u0275cmp = e.VBU({
                    type: i,
                    selectors: [["app-backup-restore"]],
                    decls: 6,
                    vars: 5,
                    consts: [["mb-6", ""], [3, "disabled", "title", "selectButtonText", "fileTextNoFile", "fileTextWithFile", "isRefresh", "change", 4, "ngIf"], ["pb-4", "", 3, "disabled", "hasBorder", "rowLayout", 4, "ngIf"], [3, "dialogConfig", "closeDialog", 4, "ngIf"], [4, "ngIf"], [3, "change", "disabled", "title", "selectButtonText", "fileTextNoFile", "fileTextWithFile", "isRefresh"], ["pb-4", "", 3, "disabled", "hasBorder", "rowLayout"], [3, "title"], ["outline", "primary", "size", "small", "type", "button", 3, "isDisabled", "title", "click", 4, "ngIf"], ["outline", "primary", "size", "small", "type", "button", 3, "click", "isDisabled", "title"], [3, "closeDialog", "dialogConfig"], ["pvModelContent", ""], [3, "formGroup"], ["pb-7", "", 3, "hasBorder"], ["formControlName", "serialNumber1", 3, "onModelChange", "isValidated", "data", "errorMessage", "title", "isAutoFocus"], ["pt-1", "", "class", "error-message", 3, "title", 4, "ngIf"], ["type", "submit", 3, "click", "title"], ["pt-1", "", 1, "error-message", 3, "title"], ["body1-regular", "", "mb-4", "", 3, "title"], ["pb-2", "", "mb-4", "", 1, "upgrade-firmware__status"], [3, "ngClass", "title"]],
                    template: function (a, s) {
                        1 & a && (e.j41(0, "pv-card", 0), e.DNE(1, ve, 1, 6, "pv-upload", 1)(2, Se, 4, 5, "pv-form-field", 2)(3, Ie, 7, 10, "pv-dialog", 3)(4, Le, 4, 5, "pv-form-field", 2), e.k0s(), e.DNE(5, Te, 5, 9, "pv-card", 4)), 2 & a && (e.R7$(), e.Y8G("ngIf", s.api.device_capability.getVal("maintenance", "backupAndRestore", "selectFile").isOn), e.R7$(), e.Y8G("ngIf", s.api.device_capability.getVal("maintenance", "backupAndRestore", "importConfigFile").isOn), e.R7$(), e.Y8G("ngIf", s.addNewWifiPointModalShow), e.R7$(), e.Y8G("ngIf", s.api.device_capability.getVal("maintenance", "backupAndRestore", "exportConfigFile").isOn), e.R7$(), e.Y8G("ngIf", s.fileUploaded))
                    },
                    dependencies: [b.YU, b.bT, l.qT, l.BC, l.cb, n.xJ, n.Sp, n.XL, n.v9, n.X, n.H9, n.aR, l.j4, l.JD, G.a],
                    styles: [".upgrade-firmware[_ngcontent-%COMP%]{font-size:var(--pure-dimension-19);color:var(--pure-color-gray-800)}.upgrade-firmware__status[_ngcontent-%COMP%]{border-bottom:1px solid var(--pure-color-neutral-30)}.upgrade-firmware__onsuccess[_ngcontent-%COMP%]{color:var(--pure-color-primary-60)}.upgrade-firmware__onerror[_ngcontent-%COMP%]{color:var(--pure-color-bad)}"]
                })
            }

            return i
        })();

        function Ge(i, c) {
            if (1 & i && (e.j41(0, "pv-form-field", 7)(1, "label"), e.nrm(2, "pv-text", 8), e.k0s(), e.j41(3, "span", 9), e.nrm(4, "pv-inputbox", 10), e.k0s()()), 2 & i) {
                const t = e.XpG();
                e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "loidAuthentication", "loid").isDisabled)("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.LOID_LABEL), e.R7$(2), e.Y8G("isValidated", t.loidValid)("errorMessage", t.loidError)("hideErrorIcon", !0)
            }
        }

        function De(i, c) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-form-field", 7)(1, "label"), e.nrm(2, "pv-text", 8), e.k0s(), e.j41(3, "span", 9)(4, "pv-inputbox", 11), e.bIt("onInputFocus", function () {
                    e.eBV(t);
                    const s = e.XpG();
                    return e.Njj(s.onfocusPwd())
                }), e.k0s()()()
            }
            if (2 & i) {
                const t = e.XpG();
                e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "loidAuthentication", "password").isDisabled)("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.PASSWORD_LABEL), e.R7$(2), e.Y8G("isValidated", t.passwordValid)("errorMessage", t.passwordError)("hideErrorIcon", !0)
            }
        }

        function Ne(i, c) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-button", 12), e.bIt("onClick", function () {
                    e.eBV(t);
                    const s = e.XpG();
                    return e.Njj(s.submitForm())
                }), e.k0s()
            }
            if (2 & i) {
                const t = e.XpG();
                e.Y8G("isDisabled", t.isCFGMode || t.api.device_capability.getVal("maintenance", "loidAuthentication", "saveButton").isDisabled)("webSave", t.showSaveIcon)("showButtonLoader", t.disableSave)("title", t.constants.SAVE)
            }
        }

        let we = (() => {
            class i {
                constructor(t, a, s, o, d, h) {
                    this.appAccessService = t, this.constants = a, this.api = s, this.pubSubService = o, this.pureViewSnackbarService = d, this.message = h, this.isCFGMode = !1, this.loidValid = !0, this.passwordValid = !0, this.loidError = "", this.passwordError = "", this.disableSave = !1, this.showSaveIcon = !1, "" !== this.api.router_info.gwmodel ? this.loadRouterInfo(this.api) : this.api.request(this, "getRouterInfo")
                }

                loadRouterInfo(t) {
                    this.isCFGMode = -1 === t.brEnable, this.isCFGMode && ("BWDS" === this.api.g_opId || "BATL" === this.api.g_opId && this.api.device_capability.getVal("overview", "networkMap", "addWifiButton", "showAddSerialNumberModal").isOn ? this.showWarning(this.constants.CFG_WARNING_BWDS) : this.showWarning(this.constants.CFG_WARNING))
                }

                ngOnInit() {
                    this.csswd = "", this.getLoidConfigInfo(), this.pageRefresh(), this.loidConfigForm = new l.gE({
                        loid: new l.MJ({
                            value: "",
                            disabled: this.api.device_capability.getVal("maintenance", "loidAuthentication", "loid").isDisabled
                        }),
                        loidPassword: new l.MJ({
                            value: "",
                            disabled: this.api.device_capability.getVal("maintenance", "loidAuthentication", "password").isDisabled
                        })
                    })
                }

                pageRefresh() {
                    this.pageRefreshSub = this.pubSubService.subscribe(r.VR.HEADER_REFRESH_CLICKED, t => {
                        this.getLoidConfigInfo()
                    })
                }

                get loid() {
                    return this.loidConfigForm.get("loid")
                }

                get loidPassword() {
                    return this.loidConfigForm.get("loidPassword")
                }

                getLoidConfigInfo() {
                    this.api.request(this, "getLoidConfig")
                }

                ngOnDestroy() {
                    this.message.hideMessage({show: !1}), this.pureViewSnackbarService.hideMessageSnackbar(), this.pageRefreshSub?.unsubscribe()
                }

                submitForm() {
                    this.resetValues(), this.pureViewSnackbarService.hideMessageSnackbar();
                    const t = this.loid.value;
                    let a = this.loidPassword.value;
                    if (!t) return this.loidValid = !1, this.loidError = this.constants.REQUIRED_FIELD_LABEL, !1;
                    if (t.length > 24) return this.loidValid = !1, this.loidError = this.constants.ERR_LOID_LEN, !1;
                    if (a || (a = ""), a.length > 12) return this.passwordValid = !1, this.passwordError = this.constants.ERR_PASS_LEN, !1;
                    if (!this.isvalidStr(t)) return this.loidValid = !1, this.loidError = this.constants.LOID_INVALID_CHAR, !1;
                    const s = `csswd=${this.csswd}&loid=${t}&pswd=${a}`;
                    this.disableSave = !0, this.api.request(this, "setLoidConfig", s)
                }

                onfocusPwd() {
                    this.csswd = "1", this.loidPassword.setValue("")
                }

                isvalidStr(t) {
                    let a = 0;
                    for (a = 0; a < t.length; a++) if (this.isValidChar(t.charAt(a))) return !1;
                    return !0
                }

                isValidChar(t) {
                    return !(-1 === "?-=#\"<>\\^[]`+$,'&@.:\t".indexOf(t) && t.charCodeAt(0) > 36 && t.charCodeAt(0) < 123)
                }

                resetValues() {
                    this.passwordValid = !0, this.passwordError = "", this.loidValid = !0, this.loidError = ""
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
                    const a = t.data;
                    switch (t.action) {
                        case r.En.GET_ROUTER_INFO:
                            this.loadRouterInfo(this.api);
                            break;
                        case r.En.GET_LOID_CONFIG:
                            this.loid.setValue(a.uinfo.UserName), this.loidPassword.setValue(a.uinfo.UserId);
                            break;
                        case r.En.SET_LOID_CONFIG:
                            this.disableSave = !1, this.getLoidConfigInfo(), this.showSaveIcon = !0, window.setTimeout(() => {
                                this.showSaveIcon = !1
                            }, 1e3)
                    }
                }

                onError(t) {
                    switch (t.action) {
                        case r.En.GET_ROUTER_INFO:
                            console.error("GET_ROUTER_INFO API Failed - Error"), console.error(t);
                            break;
                        case r.En.GET_LOID_CONFIG:
                            console.error("GET_LOID_CONFIG API Failed - Error"), console.error(t);
                            break;
                        case r.En.SET_LOID_CONFIG:
                            this.disableSave = !1, console.error("SET_LOID_CONFIG API Failed - Error"), console.error(t)
                    }
                }

                static #e = this.\u0275fac = function (a) {
                    return new (a || i)(e.rXU(D.t), e.rXU(p.YM), e.rXU(I.G), e.rXU(f.Q), e.rXU(n.gd), e.rXU(n.m4))
                };
                static #t = this.\u0275cmp = e.VBU({
                    type: i,
                    selectors: [["app-loid"]],
                    decls: 9,
                    vars: 6,
                    consts: [["formRef", ""], [3, "formGroup"], ["h2-bold", "", 3, "title"], ["caption1-regular", "", "mb-4", "", 3, "title"], ["pb-4", "", 3, "disabled", "hasBorder", "rowLayout", 4, "ngIf"], [1, "flex-row"], ["type", "submit", "buttonType", "submit", "size", "small", "mr-2", "", 3, "isDisabled", "webSave", "showButtonLoader", "title", "onClick", 4, "ngIf"], ["pb-4", "", 3, "disabled", "hasBorder", "rowLayout"], [3, "title"], [1, "loid__form-control"], ["size", "MEDIUM", "formControlName", "loid", "maxlength", "24", 3, "isValidated", "errorMessage", "hideErrorIcon"], ["size", "MEDIUM", "formControlName", "loidPassword", "type", "password", "maxlength", "12", 3, "onInputFocus", "isValidated", "errorMessage", "hideErrorIcon"], ["type", "submit", "buttonType", "submit", "size", "small", "mr-2", "", 3, "onClick", "isDisabled", "webSave", "showButtonLoader", "title"]],
                    template: function (a, s) {
                        1 & a && (e.j41(0, "pv-card")(1, "form", 1, 0), e.nrm(3, "pv-text", 2)(4, "pv-text", 3), e.DNE(5, Ge, 5, 7, "pv-form-field", 4)(6, De, 5, 7, "pv-form-field", 4), e.j41(7, "div", 5), e.DNE(8, Ne, 1, 4, "pv-button", 6), e.k0s()()()), 2 & a && (e.R7$(), e.Y8G("formGroup", s.loidConfigForm), e.R7$(2), e.Y8G("title", s.constants.LOID_AUTH), e.R7$(), e.Y8G("title", s.constants.LOID_FIELD_LEN_INSTRUCTION), e.R7$(), e.Y8G("ngIf", s.api.device_capability.getVal("maintenance", "loidAuthentication", "loid").isOn), e.R7$(), e.Y8G("ngIf", s.api.device_capability.getVal("maintenance", "loidAuthentication", "password").isOn), e.R7$(2), e.Y8G("ngIf", s.api.device_capability.getVal("maintenance", "loidAuthentication", "saveButton").isOn))
                    },
                    dependencies: [b.bT, l.qT, l.BC, l.cb, l.tU, n.xJ, n.Sp, n.XL, n.v9, n.X, l.j4, l.JD],
                    styles: [".loid__form-control[_ngcontent-%COMP%]{width:300px}"]
                })
            }

            return i
        })();

        function Oe(i, c) {
            if (1 & i && (e.j41(0, "pv-form-field", 5)(1, "label"), e.nrm(2, "pv-text", 6), e.k0s(), e.nrm(3, "pv-text", 7), e.k0s()), 2 & i) {
                const t = e.XpG();
                e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "slidConfiguration", "currentSlid").isDisabled)("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.CURRENT_SLID), e.R7$(), e.Y8G("title", t.currentSlid)
            }
        }

        function ye(i, c) {
            if (1 & i && (e.j41(0, "pv-form-field", 5)(1, "label"), e.nrm(2, "pv-text", 6), e.k0s(), e.j41(3, "span", 8), e.nrm(4, "pv-inputbox", 9), e.k0s()()), 2 & i) {
                const t = e.XpG();
                e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "slidConfiguration", "enterNewSlid").isDisabled)("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.ENTER_NEW_SLID), e.R7$(2), e.Y8G("isValidated", t.slidValid)("errorMessage", t.slidError)("hideErrorIcon", !0)
            }
        }

        function Ve(i, c) {
            if (1 & i && e.nrm(0, "pv-text", 13), 2 & i) {
                const t = e.XpG(2);
                e.Y8G("title", t.constants.ASCII_MODE_MAX_CHAR)
            }
        }

        function Fe(i, c) {
            if (1 & i && e.nrm(0, "pv-text", 13), 2 & i) {
                const t = e.XpG(2);
                e.Y8G("title", t.constants.HEX_MODE_MAX_CHAR)
            }
        }

        function Me(i, c) {
            if (1 & i && e.nrm(0, "pv-select-option", 14), 2 & i) {
                const t = c.$implicit;
                e.Y8G("label", t.label)("value", t.value)
            }
        }

        function ke(i, c) {
            if (1 & i && (e.j41(0, "pv-form-field", 5)(1, "label"), e.nrm(2, "pv-text", 6), e.DNE(3, Ve, 1, 1, "pv-text", 10)(4, Fe, 1, 1, "pv-text", 10), e.k0s(), e.j41(5, "span", 8)(6, "pv-select", 11), e.DNE(7, Me, 1, 2, "pv-select-option", 12), e.k0s()()()), 2 & i) {
                const t = e.XpG();
                e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "slidConfiguration", "slidMode").isDisabled)("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.SLID_MODE), e.R7$(), e.Y8G("ngIf", 1 === t.slidMode.value), e.R7$(), e.Y8G("ngIf", 0 === t.slidMode.value), e.R7$(3), e.Y8G("ngForOf", t.slidModeList)
            }
        }

        function xe(i, c) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-button", 15), e.bIt("onClick", function () {
                    e.eBV(t);
                    const s = e.XpG();
                    return e.Njj(s.saveSlidConfig())
                }), e.k0s()
            }
            if (2 & i) {
                const t = e.XpG();
                e.Y8G("isDisabled", t.isCFGMode || t.api.device_capability.getVal("maintenance", "slidConfiguration", "saveButton").isDisabled)("webSave", t.showSaveIcon)("showButtonLoader", t.disableSave)("title", t.constants.SAVE)
            }
        }

        let Ue = (() => {
            class i {
                get newSlid() {
                    return this.slidConfigForm.get("newSlid")
                }

                get slidMode() {
                    return this.slidConfigForm.get("slidMode")
                }

                constructor(t, a, s, o, d, h) {
                    this.appAccessService = t, this.constants = a, this.api = s, this.pureViewSnackbarService = o, this.message = d, this.pubSubService = h, this.slidValid = !0, this.slidError = "", this.disableSave = !1, this.showSaveIcon = !1, this.isCFGMode = !1, this.slidModeList = [{
                        label: this.constants.ASCII_MODE,
                        value: 1
                    }, {
                        label: this.constants.HEX_MODE,
                        value: 0
                    }], "" !== this.api.router_info.gwmodel ? this.loadRouterInfo(this.api) : this.api.request(this, "getRouterInfo")
                }

                loadRouterInfo(t) {
                    this.isCFGMode = -1 === t.brEnable, this.isCFGMode && ("BWDS" === this.api.g_opId || "BATL" === this.api.g_opId && this.api.device_capability.getVal("overview", "networkMap", "addWifiButton", "showAddSerialNumberModal").isOn ? this.showWarning(this.constants.CFG_WARNING_BWDS) : this.showWarning(this.constants.CFG_WARNING))
                }

                ngOnInit() {
                    this.slidConfigForm = new l.gE({
                        newSlid: new l.MJ({
                            value: "",
                            disabled: this.api.device_capability.getVal("maintenance", "slidConfiguration", "enterNewSlid").isDisabled
                        }),
                        slidMode: new l.MJ({
                            value: "",
                            disabled: this.api.device_capability.getVal("maintenance", "slidConfiguration", "slidMode").isDisabled
                        })
                    }), this.getSlidConfigInfo(), this.pageRefresh()
                }

                pageRefresh() {
                    this.pageRefreshSub = this.pubSubService.subscribe(r.VR.HEADER_REFRESH_CLICKED, t => {
                        this.getSlidConfigInfo()
                    })
                }

                getSlidConfigInfo() {
                    this.newSlid.setValue(""), this.api.request(this, "getSlidConfig")
                }

                saveSlidConfig() {
                    this.pureViewSnackbarService.hideMessageSnackbar(), this.slidValid = !0, this.slidError = "";
                    let t = this.newSlid.value;
                    const a = this.slidMode.value;
                    if (0 === a) {
                        if (!t.match(/^[0-9a-fA-F]{0,80}$/)) return this.slidValid = !1, this.slidError = this.constants.ERR_HEX_FORMAT, !1;
                        if (0 === t.length) return this.slidValid = !1, this.slidError = this.constants.VALID_SLID_VALUE, !1;
                        if (t.length > 20) return this.slidValid = !1, this.slidError = this.constants.ERR_MAX_20CHAR, !1
                    } else {
                        if (t = t.trim(), !this.isValidAscii(t)) return this.slidValid = !1, this.slidError = this.constants.ERR_ASCII_CHAR, !1;
                        if (0 === t.length || t.indexOf(" ") >= 0) return this.slidValid = !1, this.slidError = this.constants.VALID_SLID_VALUE, !1;
                        if (t.length > 10) return this.slidValid = !1, this.slidError = this.constants.ERR_MAX_10CHAR, !1;
                        if ("WILDCARD" === t) return this.slidValid = !1, this.slidError = `${t} ` + this.constants.IS_SYSTEM_DEFAULT_VALUE, !1
                    }
                    this.disableSave = !0;
                    const s = `pswd_mode=${a}&pswd_new=${t}`;
                    console.log(s), this.api.request(this, "setSlidConfig", s)
                }

                isValidAscii(t) {
                    return /^\w+$/.test(t)
                }

                ngOnDestroy() {
                    this.message.hideMessage({show: !1}), this.pureViewSnackbarService.hideMessageSnackbar(), this.pageRefreshSub?.unsubscribe()
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
                    const a = t.data;
                    switch (t.action) {
                        case r.En.GET_ROUTER_INFO:
                            this.loadRouterInfo(this.api);
                            break;
                        case r.En.GET_SLID_CONFIG:
                            this.slidMode.setValue(a.gpon_info.HexSLID), this.currentSlid = a.gpon_info.Password;
                            break;
                        case r.En.SET_SLID_CONFIG:
                            this.disableSave = !1, this.getSlidConfigInfo(), this.showSaveIcon = !0, window.setTimeout(() => {
                                this.showSaveIcon = !1
                            }, 1e3)
                    }
                }

                onError(t) {
                    switch (t.action) {
                        case r.En.GET_ROUTER_INFO:
                            console.error("GET_ROUTER_INFO API Failed - Error"), console.error(t);
                            break;
                        case r.En.GET_SLID_CONFIG:
                            console.error("GET_SLID_CONFIG API Failed - Error"), console.error(t);
                            break;
                        case r.En.SET_SLID_CONFIG:
                            this.disableSave = !1, console.error("SET_SLID_CONFIG API Failed - Error"), console.error(t)
                    }
                }

                static #e = this.\u0275fac = function (a) {
                    return new (a || i)(e.rXU(D.t), e.rXU(p.YM), e.rXU(I.G), e.rXU(n.gd), e.rXU(n.m4), e.rXU(f.Q))
                };
                static #t = this.\u0275cmp = e.VBU({
                    type: i,
                    selectors: [["app-slid"]],
                    decls: 8,
                    vars: 5,
                    consts: [["formRef", ""], [3, "formGroup"], ["pb-4", "", 3, "disabled", "hasBorder", "rowLayout", 4, "ngIf"], [1, "flex-row"], ["type", "submit", "buttonType", "submit", "size", "small", "mr-2", "", 3, "isDisabled", "webSave", "showButtonLoader", "title", "onClick", 4, "ngIf"], ["pb-4", "", 3, "disabled", "hasBorder", "rowLayout"], [3, "title"], ["subtext3-bold", "", 3, "title"], [1, "slid__form-control"], ["size", "MEDIUM", "formControlName", "newSlid", "maxlength", "80", 3, "isValidated", "errorMessage", "hideErrorIcon"], ["subtext2-regular-800", "", "mt-4", "", 3, "title", 4, "ngIf"], ["formControlName", "slidMode", "size", "MEDIUM"], [3, "label", "value", 4, "ngFor", "ngForOf"], ["subtext2-regular-800", "", "mt-4", "", 3, "title"], [3, "label", "value"], ["type", "submit", "buttonType", "submit", "size", "small", "mr-2", "", 3, "onClick", "isDisabled", "webSave", "showButtonLoader", "title"]],
                    template: function (a, s) {
                        1 & a && (e.j41(0, "pv-card")(1, "form", 1, 0), e.DNE(3, Oe, 4, 5, "pv-form-field", 2)(4, ye, 5, 7, "pv-form-field", 2)(5, ke, 8, 7, "pv-form-field", 2), e.j41(6, "div", 3), e.DNE(7, xe, 1, 4, "pv-button", 4), e.k0s()()()), 2 & a && (e.R7$(), e.Y8G("formGroup", s.slidConfigForm), e.R7$(2), e.Y8G("ngIf", "DEFAULT" !== s.currentSlid.toUpperCase() && s.api.device_capability.getVal("maintenance", "slidConfiguration", "currentSlid").isOn), e.R7$(), e.Y8G("ngIf", s.api.device_capability.getVal("maintenance", "slidConfiguration", "enterNewSlid").isOn), e.R7$(), e.Y8G("ngIf", s.api.device_capability.getVal("maintenance", "slidConfiguration", "slidMode").isOn), e.R7$(2), e.Y8G("ngIf", s.api.device_capability.getVal("maintenance", "slidConfiguration", "saveButton").isOn))
                    },
                    dependencies: [b.Sq, b.bT, l.qT, l.BC, l.cb, l.tU, n.xJ, n.Sp, n.XL, n.v9, n.X, n.RA, n.Od, l.j4, l.JD],
                    styles: [".slid__form-control[_ngcontent-%COMP%]{width:300px}"]
                })
            }

            return i
        })();
        var Pe = u(2321);

        function Be(i, c) {
            if (1 & i && e.nrm(0, "pv-text", 10), 2 & i) {
                const t = e.XpG(2);
                e.Y8G("title", t.constants.NO_FILE_SELECTED)
            }
        }

        function Ye(i, c) {
            if (1 & i && e.nrm(0, "pv-text", 17), 2 & i) {
                const t = e.XpG(2);
                e.Y8G("title", t.fileName)
            }
        }

        function Xe(i, c) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-button", 18), e.bIt("onClick", function () {
                    e.eBV(t);
                    const s = e.XpG(2);
                    return e.Njj(s.onStartRecording())
                }), e.k0s()
            }
            if (2 & i) {
                const t = e.XpG(2);
                e.Y8G("title", t.constants.START_RECORDING)
            }
        }

        function $e(i, c) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-button", 18), e.bIt("onClick", function () {
                    e.eBV(t);
                    const s = e.XpG(2);
                    return e.Njj(s.onStopRecording())
                }), e.k0s()
            }
            if (2 & i) {
                const t = e.XpG(2);
                e.Y8G("title", t.constants.STOP_RECORDING)
            }
        }

        function We(i, c) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-card", 5)(1, "pv-form-field", 6)(2, "label"), e.nrm(3, "pv-text", 7)(4, "pv-text", 9)(5, "pv-text", 10), e.k0s(), e.j41(6, "span", 11), e.DNE(7, Be, 1, 1, "pv-text", 12)(8, Ye, 1, 1, "pv-text", 13), e.j41(9, "input", 14, 0), e.bIt("change", function (s) {
                    e.eBV(t);
                    const o = e.XpG();
                    return e.Njj(o.uploadFile(s))
                }), e.k0s(), e.j41(11, "pv-button", 15), e.bIt("click", function () {
                    e.eBV(t);
                    const s = e.sdS(10);
                    return e.Njj(s.click())
                }), e.k0s(), e.DNE(12, Xe, 1, 1, "pv-button", 16)(13, $e, 1, 1, "pv-button", 16), e.k0s()()()
            }
            if (2 & i) {
                const t = e.XpG();
                e.R7$(), e.Y8G("hasBorder", !1)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.MERGE_DELTA_CFG), e.R7$(), e.Y8G("title", t.constants.DELTA_CFG_DESCRIPTION1), e.R7$(), e.Y8G("title", t.constants.DELTA_CFG_DESCRIPTION2), e.R7$(2), e.Y8G("ngIf", !1 === t.fileUploaded || t.isRefresh), e.R7$(), e.Y8G("ngIf", null !== t.fileName && !t.isRefresh), e.R7$(3), e.Y8G("title", t.constants.SELECT_FILE_FIRMWARE), e.R7$(), e.Y8G("ngIf", !t.recordingStatus), e.R7$(), e.Y8G("ngIf", t.recordingStatus)
            }
        }

        function je(i, c) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-button", 19), e.bIt("click", function () {
                    e.eBV(t);
                    const s = e.XpG();
                    return e.Njj(s.onExport())
                }), e.k0s()
            }
            if (2 & i) {
                const t = e.XpG();
                e.Y8G("title", t.constants.EXPORT)
            }
        }

        let He = (() => {
            class i {
                constructor(t, a, s, o, d, h, _) {
                    this.constants = t, this.api = a, this.pubSubService = s, this.pureViewSnackbarService = o, this.validations = d, this.message = h, this.logger = _, this.fileName = "", this.restoreStarted = !1, this.isCFGMode = !1, this.isSuccess = !0, this.isError = !1, this.fileUploaded = !1, this.importText = "", this.exportText = "", this.isRefresh = !1
                }

                pageRefresh() {
                    this.pageRefreshSub = this.pubSubService.subscribe(r.VR.HEADER_REFRESH_CLICKED, t => {
                        this.api.request(this, "getRouterInfo")
                    })
                }

                uploadFile(t) {
                    this.api.recEnable && this.showWarning(this.constants.STOP_DELTACFG_FIRST), this.importText = "", this.isRefresh = !1, this.logger.console(t.target.files[0]);
                    const a = new FileReader;
                    if (t.target.files && t.target.files.length > 0) {
                        this.fileUploaded = !0, this.file = t.target.files[0], this.fileName = t.target.files[0].name, this.formData = new FormData, this.formData.append("csrf_token", localStorage.getItem("token")), this.formData.append("filename", this.file);
                        const s = this.fileName.lastIndexOf(".");
                        this.filenameType = this.fileName.slice(s + 1, this.fileName.length);
                        const o = t.target.files[0].size / 1024 / 1024, d = this.fileName.slice(0, s),
                            h = /^[0-9A-Za-z_.]+$/, _ = (d.match(/\./g) || []).length;
                        if ("cfg" !== this.filenameType) return this.fileName = this.constants.INVALID_FILE_FORMAT, this.fileContent = "", this.isSuccess = !1, this.isError = !0, !1;
                        if (Math.floor(o) > 2) return this.fileContent = "", this.fileName = this.constants.FILE_SIZE_TOO_LARGE_UPLOAD_FAILED, this.isSuccess = !1, this.isError = !0, !1;
                        if (!h.test(d) || _ > 1) return this.fileName = this.constants.ILLEGAL_FILENAME, this.isSuccess = !1, this.isError = !0, this.fileContent = "", !1;
                        this.isSuccess = !0, this.isError = !1, a.readAsArrayBuffer(this.file), a.onload = () => {
                            let v = "";
                            const m = new Uint8Array(a.result), E = m.byteLength;
                            for (let R = 0; R < E; R++) v += String.fromCharCode(m[R]);
                            this.fileContent = v, this.logger.console(this.fileContent)
                        }
                    }
                }

                onStartRecording() {
                    this.file && "cfg" !== this.filenameType ? this.showWarning(this.constants.CFG_FILE_WARNING) : this.file && this.filenameType ? (this.logger.console(`start_rec= ${this.fileContent}`), this.api.request(this, "startRecDeltaCfg", this.formData), this.logger.console(this.formData)) : this.api.request(this, "startRecDeltaCfg")
                }

                onStopRecording() {
                    this.api.request(this, "startRecDeltaCfg")
                }

                checkRecordStatus(t) {
                    t && (this.recordingStatus = t.is_record_flag_existed)
                }

                onExport() {
                    this.api.deltaCFGfileExists ? this.api.recEnable ? this.showWarning(this.constants.STOP_DELTACFG_FIRST) : (this.exportText = "", this.api.request(this, "exportDeltaCfg")) : this.showWarning(this.constants.CFG_FILENOTEXIST_WARNING)
                }

                createAndDownloadBlobFile(t, a, s) {
                    const o = new Blob([t], a);
                    if (navigator.msSaveBlob) navigator.msSaveBlob(o, s), this.exportText = "Success"; else {
                        const d = document.createElement("a");
                        if (void 0 !== d.download) {
                            const h = URL.createObjectURL(o);
                            d.setAttribute("href", h), d.setAttribute("download", s), d.style.visibility = "hidden", document.body.appendChild(d), d.click(), document.body.removeChild(d), this.exportText = "Success"
                        }
                    }
                }

                ngOnInit() {
                    "" !== this.api.router_info.gwmodel && (this.recordingStatus = this.api.router_info.is_record_flag_existed), this.api.request(this, "getRouterInfo"), this.pageRefresh()
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
                    const a = t.data;
                    switch (t.action) {
                        case r.En.START_REC_DELTA_CFG:
                            console.warn("START_REC_DELTA_CFG API Called"), this.api.request(this, "getRouterInfo");
                            break;
                        case r.En.GET_ROUTER_INFO:
                            this.checkRecordStatus(a), this.logger.console("GET_ROUTER_INFO API called");
                            break;
                        case r.En.EXPORT_DELTA_CFG:
                            this.createAndDownloadBlobFile(a, {type: "application/octet-stream"}, "delta_config_result"), this.logger.console("EXPORT_DELTA_CFG API called")
                    }
                }

                onError(t) {
                    switch (t.action) {
                        case r.En.START_REC_DELTA_CFG:
                            console.warn("START_REC_DELTA_CFG API  Failed - Error");
                            break;
                        case r.En.GET_ROUTER_INFO:
                            this.logger.console("GET_ROUTER_INFO API  Failed - Error");
                            break;
                        case r.En.EXPORT_DELTA_CFG:
                            this.logger.console("EXPORT_DELTA_CFG API  Failed - Error")
                    }
                }

                static #e = this.\u0275fac = function (a) {
                    return new (a || i)(e.rXU(p.YM), e.rXU(I.G), e.rXU(f.Q), e.rXU(n.gd), e.rXU(O.V), e.rXU(n.m4), e.rXU(g.V))
                };
                static #t = this.\u0275cmp = e.VBU({
                    type: i,
                    selectors: [["app-delta-cfg"]],
                    decls: 9,
                    vars: 6,
                    consts: [["uploader", ""], [1, "flex-row", "flex-row__start-center", "text-highlight"], ["name", "error_small_blue"], ["mr-2", "", "subtext1-regular", "", 1, "text-color", 3, "title"], ["mt-5", "", 4, "ngIf"], ["mt-5", ""], [3, "hasBorder", "rowLayout"], ["body1-regular", "", 3, "title"], ["size", "small", "type", "button", 3, "title", "click", 4, "ngIf"], ["mt-3", "", "subtext1-regular", "", 3, "title"], ["subtext1-regular", "", 3, "title"], ["mb-8", "", 1, "flex-row", "flex-row__center"], ["subtext1-regular", "", 3, "title", 4, "ngIf"], ["mr-2", "", "subtext1-regular", "", 3, "title", 4, "ngIf"], ["type", "file", 1, "pv-upload__input-file", 3, "change"], ["mr-2", "", "outline", "button-lightBlue", "size", "small", "type", "button", 3, "click", "title"], ["buttonType", "submit", "size", "small", "type", "button", 3, "title", "onClick", 4, "ngIf"], ["mr-2", "", "subtext1-regular", "", 3, "title"], ["buttonType", "submit", "size", "small", "type", "button", 3, "onClick", "title"], ["size", "small", "type", "button", 3, "click", "title"]],
                    template: function (a, s) {
                        1 & a && (e.j41(0, "pv-card", 1), e.nrm(1, "pv-vector", 2)(2, "pv-text", 3), e.k0s(), e.DNE(3, We, 14, 10, "pv-card", 4), e.j41(4, "pv-card", 5)(5, "pv-form-field", 6)(6, "label"), e.nrm(7, "pv-text", 7), e.k0s(), e.DNE(8, je, 1, 1, "pv-button", 8), e.k0s()()), 2 & a && (e.R7$(2), e.Y8G("title", s.constants.DELTA_CFG_WARNING), e.R7$(), e.Y8G("ngIf", s.api.device_capability.getVal("maintenance", "deltaCfgTool", "mergeDeltaCfgFile").isOn), e.R7$(2), e.Y8G("hasBorder", !1)("rowLayout", !0), e.R7$(2), e.Y8G("title", s.constants.EXPORT_DELTA_CFG), e.R7$(), e.Y8G("ngIf", s.api.device_capability.getVal("maintenance", "deltaCfgTool", "exportDeltaCfgButton").isOn))
                    },
                    dependencies: [b.bT, n.xJ, n.XL, n.v9, n.oN, n.X],
                    styles: [".text-highlight[_ngcontent-%COMP%]{display:flex;flex-direction:row;align-items:center;padding:16px;background:var(--pure-color-primary-10);border-radius:16px}.text-color[_ngcontent-%COMP%]{font-weight:400;font-size:16px;line-height:150%;letter-spacing:-.32px;color:var(--pure-color-primary-70);display:inline-block}"]
                })
            }

            return i
        })();
        var k = u(1989);

        function ze(i, c) {
            if (1 & i && (e.qex(0), e.nrm(1, "pv-table", 1), e.bVm()), 2 & i) {
                const t = e.XpG();
                e.R7$(), e.Y8G("pvTableTitle", t.constants.CONTAINER_APPS_STATUS)("pvDataTable", !0)("pvDataTableColum", t.containerHeader)("pvDataTableArray", t.containerData)
            }
        }

        let Ke = (() => {
            class i {
                constructor(t, a, s, o, d) {
                    this.constants = t, this.api = a, this.pubSubService = s, this.alertUtil = o, this.logger = d, this.isLoading = !1, this.containerHeader = [{
                        label: this.constants.CONTAINER_APP_NAME,
                        value: "appName"
                    }, {
                        label: this.constants.CONTAINER_APP_VERSION,
                        value: "appVersion"
                    }, {label: this.constants.STATUS_LABEL, value: "appStatus"}], this.containerData = []
                }

                ngOnInit() {
                    this.refreshPage(), this.onLanguageChanges(), this.logger.console(this.api.get_container_info), this.isLoading = !0, this.alertUtil.showContentModalLoader(), this.api.get_container_info.DeploymentUnitNumberOfEntries > 0 && this.syncContainerData(this.api.get_container_info), this.getContainerMgmtInfo()
                }

                getContainerMgmtInfo() {
                    this.api.request(this, "getContainerData")
                }

                refreshPage() {
                    this.pageRefreshSub = this.pubSubService.subscribe(r.VR.HEADER_REFRESH_CLICKED, t => {
                        this.getContainerMgmtInfo()
                    })
                }

                onLanguageChanges() {
                    this.langChangeSub = this.pubSubService.subscribe(r.VR.LANGUAGE_CHANGE, t => {
                        this.containerHeader = [{
                            label: this.constants.CONTAINER_APP_NAME,
                            value: "appName"
                        }, {
                            label: this.constants.CONTAINER_APP_VERSION,
                            value: "appVersion"
                        }, {
                            label: this.constants.STATUS_LABEL,
                            value: "appStatus"
                        }], this.syncContainerData(this.api.get_container_info)
                    })
                }

                syncContainerData(t) {
                    if (this.logger.console(this.api.get_container_info), this.isLoading = !1, this.alertUtil.hideContentModalLoader(), this.containerData = [], t.DeploymentUnitNumberOfEntries && t.DeploymentUnit.length) for (let s of t.DeploymentUnit) {
                        var a = {
                            appName: s.Name,
                            appVersion: s.Version,
                            appStatus: "Installed" != s.Status ? this.constants.APP_STATUS_INSTALLED : this.getInstalledAppStatus(s._iid, t.ExecutionUnit)
                        };
                        this.containerData.push(a)
                    }
                }

                getInstalledAppStatus(t, a) {
                    var s = "";
                    return a.forEach(o => {
                        t == o._iid && (s = "Idle" == o.Status ? this.constants.APP_STATUS_IDLE : "Active" == o.Status ? this.constants.ACTIVE : o.Status)
                    }), s
                }

                ngOnDestroy() {
                    this.isLoading = !1, this.pageRefreshSub?.unsubscribe(), this.alertUtil.hideContentModalLoader(), this.langChangeSub.unsubscribe()
                }

                onSuccess(t) {
                    t.action === r.En.GET_CONTAINER_INFO && this.syncContainerData(t.data)
                }

                onError(t) {
                    t.action === r.En.GET_CONTAINER_INFO && (this.isLoading = !1, this.alertUtil.hideContentModalLoader(), console.warn("GET_CONTAINER_INFO API  Failed - Error"))
                }

                static #e = this.\u0275fac = function (a) {
                    return new (a || i)(e.rXU(p.YM), e.rXU(I.G), e.rXU(f.Q), e.rXU(k.l), e.rXU(g.V))
                };
                static #t = this.\u0275cmp = e.VBU({
                    type: i,
                    selectors: [["app-container-management"]],
                    decls: 1,
                    vars: 1,
                    consts: [[4, "ngIf"], ["pb-6", "", 3, "pvTableTitle", "pvDataTable", "pvDataTableColum", "pvDataTableArray"]],
                    template: function (a, s) {
                        1 & a && e.DNE(0, ze, 2, 4, "ng-container", 0), 2 & a && e.Y8G("ngIf", !s.isLoading)
                    },
                    dependencies: [b.bT, n.$r]
                })
            }

            return i
        })();

        function qe(i, c) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-card", 3)(1, "pv-form-field", 4)(2, "span")(3, "label"), e.nrm(4, "pv-text", 5), e.k0s()(), e.j41(5, "span", 6)(6, "pv-toggle", 7), e.bIt("change", function () {
                    e.eBV(t);
                    const s = e.XpG();
                    return e.Njj(s.gameModeChange())
                }), e.k0s()()()()
            }
            if (2 & i) {
                const t = e.XpG();
                e.R7$(), e.Y8G("rowLayout", !0), e.R7$(3), e.Y8G("title", t.constants.ENABLE_LABEL), e.R7$(2), e.Y8G("isChecked", t.enable.value)
            }
        }

        let Je = (() => {
            class i {
                constructor(t, a, s, o, d) {
                    this.alertUtil = t, this.pubSubService = a, this.api = s, this.constants = o, this.message = d
                }

                ngOnInit() {
                    this.gameModeForm = new l.gE({
                        enable: new l.MJ({
                            value: !1,
                            disabled: this.api.device_capability.getVal("maintenance", "gameMode", "enable").isDisabled
                        })
                    }), this.api.request(this, "getGameMode"), this.refreshPage()
                }

                ngOnDestroy() {
                    this.alertUtil.hideModalLoader()
                }

                setGameMode() {
                    this.alertUtil.showModalLoader();
                    const t = `bufferbloat_enable=${this.enable.value ? 1 : 0}&isReboot=1`;
                    console.log("SET GAME MODE :" + t), this.api.request(this, "setGameMode", t)
                }

                refreshPage() {
                    this.pageRefreshSub = this.pubSubService.subscribe(r.VR.HEADER_REFRESH_CLICKED, t => {
                        this.api.request(this, "getGameMode")
                    })
                }

                gameModeChange() {
                    this.alertUtil.showAlert({
                        title: this.constants.REBOOT_DEVICE,
                        SHOW_DEFAULT_BUTTON: !1,
                        SHOW_HEADER_CLOSE_BUTTON: !1,
                        CALLBACK_1_TITLE: this.constants.CANCEL,
                        CALLBACK_2_TITLE: this.constants.CONTINUE,
                        message: this.constants.GAME_MODE_DESC
                    }, () => {
                        this.enable.setValue(!this.enable.value)
                    }, () => {
                        this.setGameMode()
                    })
                }

                showWarning(t, a) {
                    this.message.showMessage({
                        show: !0,
                        title: this.constants.REBOOT_DEVICE,
                        width: "340px",
                        cssClass: "gameMode",
                        description: t,
                        deleteBtn: this.constants.CONTINUE,
                        cancelBtn: this.constants.CANCEL_LABEL,
                        buttonText: null,
                        data: a
                    })
                }

                updateGameModeData(t) {
                    this.enable.setValue(null), setTimeout(() => {
                        this.enable.setValue(!!t.bufferbloat_config.Enable)
                    }, 0)
                }

                onSuccess(t) {
                    const a = t.data;
                    switch (t.action) {
                        case r.En.GET_GAME_MODE:
                            a && a.bufferbloat_config && (this.alertUtil.hideModalLoader(), this.updateGameModeData(a));
                            break;
                        case r.En.SET_GAME_MODE:
                            this.alertUtil.hideModalLoader()
                    }
                }

                onError(t) {
                    switch (t.action) {
                        case r.En.GET_GAME_MODE:
                            console.error("Game mode API Failed - Error"), console.error(t), this.alertUtil.hideModalLoader();
                            break;
                        case r.En.SET_GAME_MODE:
                            this.alertUtil.hideModalLoader(), console.error("Game mode SET API Failed - Error"), console.error(t)
                    }
                }

                get enable() {
                    return this.gameModeForm.get("enable")
                }

                static #e = this.\u0275fac = function (a) {
                    return new (a || i)(e.rXU(k.l), e.rXU(f.Q), e.rXU(I.G), e.rXU(p.YM), e.rXU(n.m4))
                };
                static #t = this.\u0275cmp = e.VBU({
                    type: i,
                    selectors: [["app-game-mode"]],
                    decls: 3,
                    vars: 2,
                    consts: [[1, "flex-column", "grid-gap-24", "password"], [3, "formGroup"], ["mb-20", "", 4, "ngIf"], ["mb-20", ""], ["labelAlign", "top", 3, "rowLayout"], ["mt-2", "", 3, "title"], [1, "password__form-control"], ["formControlName", "enable", 3, "change", "isChecked"]],
                    template: function (a, s) {
                        1 & a && (e.j41(0, "div", 0)(1, "form", 1), e.DNE(2, qe, 7, 3, "pv-card", 2), e.k0s()()), 2 & a && (e.R7$(), e.Y8G("formGroup", s.gameModeForm), e.R7$(), e.Y8G("ngIf", s.api.device_capability.getVal("maintenance", "gameMode", "visibility").isOn))
                    },
                    dependencies: [b.bT, l.qT, l.BC, l.cb, n.xJ, n.hO, n.v9, n.X, l.j4, l.JD]
                })
            }

            return i
        })();
        var Ze = u(2705), Qe = u(8611);

        function et(i, c) {
            if (1 & i && (e.j41(0, "pv-form-field", 5)(1, "label"), e.nrm(2, "pv-text", 6), e.k0s(), e.nrm(3, "pv-toggle", 7), e.k0s()), 2 & i) {
                const t = e.XpG();
                e.Y8G("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.SYSLOG_STATUS), e.R7$(), e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "syslog", "syslogStatus").isDisabled)("isChecked", t.checkSyslogStatus.value)
            }
        }

        function tt(i, c) {
            if (1 & i && e.nrm(0, "pv-select-option", 11), 2 & i) {
                const t = c.$implicit, a = e.XpG(2);
                e.Y8G("disabled", a.api.device_capability.getVal("maintenance", "syslog", "remoteLogLevel").isDisabled)("label", t.label)("value", t.value)
            }
        }

        function it(i, c) {
            if (1 & i && (e.j41(0, "pv-form-field", 5)(1, "label"), e.nrm(2, "pv-text", 6), e.k0s(), e.j41(3, "span", 8)(4, "pv-select", 9), e.DNE(5, tt, 1, 3, "pv-select-option", 10), e.k0s()()()), 2 & i) {
                const t = e.XpG();
                e.Y8G("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.REMOTE_LOG_LEVEL), e.R7$(3), e.Y8G("ngForOf", t.remoteLogLevelList)
            }
        }

        function st(i, c) {
            if (1 & i && e.nrm(0, "pv-text", 14), 2 & i) {
                const t = e.XpG(2);
                e.Y8G("title", t.constants.REQUIRED_FIELD_LABEL)
            }
        }

        function at(i, c) {
            if (1 & i && e.nrm(0, "pv-text", 14), 2 & i) {
                const t = e.XpG(2);
                e.Y8G("title", t.constants.ERROR_ENTER_VALID_IP)
            }
        }

        function nt(i, c) {
            if (1 & i && (e.j41(0, "pv-form-field", 5)(1, "label"), e.nrm(2, "pv-text", 6), e.k0s(), e.j41(3, "span", 8), e.nrm(4, "pv-inputbox", 12), e.DNE(5, st, 1, 1, "pv-text", 13)(6, at, 1, 1, "pv-text", 13), e.k0s()()), 2 & i) {
                const t = e.XpG();
                e.Y8G("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.SERVER_IP_ADDRESS), e.R7$(2), e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "syslog", "serverIpAddress").isDisabled)("isValidated", !0), e.R7$(), e.Y8G("ngIf", t.hasError("serverIPAddress", "required")), e.R7$(), e.Y8G("ngIf", t.hasError("serverIPAddress", "pattern"))
            }
        }

        function ot(i, c) {
            if (1 & i && e.nrm(0, "pv-text", 14), 2 & i) {
                const t = e.XpG(2);
                e.Y8G("title", t.constants.REQUIRED_FIELD_LABEL)
            }
        }

        function rt(i, c) {
            if (1 & i && e.nrm(0, "pv-text", 14), 2 & i) {
                const t = e.XpG(2);
                e.Y8G("title", t.constants.INVALID_PORT)
            }
        }

        function lt(i, c) {
            if (1 & i && (e.j41(0, "pv-form-field", 5)(1, "label"), e.nrm(2, "pv-text", 6), e.k0s(), e.j41(3, "span", 8), e.nrm(4, "pv-inputbox", 15), e.DNE(5, ot, 1, 1, "pv-text", 13)(6, rt, 1, 1, "pv-text", 13), e.k0s()()), 2 & i) {
                const t = e.XpG();
                e.Y8G("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.SERVER_PORT_NUMBER), e.R7$(2), e.Y8G("disabled", t.api.device_capability.getVal("maintenance", "syslog", "serverPortNumber").isDisabled)("isValidated", !0), e.R7$(), e.Y8G("ngIf", t.hasError("serverPortNumber", "required")), e.R7$(), e.Y8G("ngIf", t.hasError("serverPortNumber", "minMaxError"))
            }
        }

        function ct(i, c) {
            if (1 & i) {
                const t = e.RV6();
                e.qex(0), e.j41(1, "div", 16)(2, "pv-button", 17), e.bIt("onClick", function () {
                    e.eBV(t);
                    const s = e.XpG();
                    return e.Njj(s.submitForm())
                }), e.k0s()(), e.bVm()
            }
            if (2 & i) {
                const t = e.XpG();
                e.R7$(2), e.Y8G("title", t.constants.SAVE)("webSave", t.showSaveIcon)("showButtonLoader", t.disableSave)("isDisabled", t.hasErrors())
            }
        }

        const pt = [{path: "", redirectTo: "maintenance", pathMatch: "full"}, {
            path: "password",
            component: Pe.n
        }, {path: "game-mode", component: Je}, {path: "loid", component: we}, {
            path: "slid",
            component: Ue
        }, {path: "backup-restore", component: Ae}, {path: "firmware-upgrade", component: $}, {
            path: "diagnostics",
            component: ae
        }, {path: "log", component: me}, {path: "deltaCfgTool", component: He}, {
            path: "container-management",
            component: Ke
        }, {
            path: "syslog-config", component: (() => {
                class i {
                    constructor(t, a, s, o, d, h, _, v) {
                        this.constants = t, this.portalService = a, this.api = s, this.pubSubService = o, this.pureViewSnackbarService = d, this.logger = h, this.validations = _, this.message = v, this.disableSave = !1, this.showSaveIcon = !1, this.remoteLogLevelList = [], this.logLevelList = [{
                            label: "Emergency",
                            value: "0"
                        }, {label: "Alert", value: "1"}, {label: "Critical", value: "2"}, {
                            label: "Error",
                            value: "3"
                        }, {label: "Warning", value: "4"}, {label: "Notice", value: "5"}, {
                            label: "Informational",
                            value: "6"
                        }, {
                            label: "Debug",
                            value: "7"
                        }], this.hasError = (m, E) => "required" === E ? this.syslogForm.controls[m].hasError(E) && this.syslogForm.controls[m].touched : !this.syslogForm.controls[m].hasError("required") && this.syslogForm.controls[m].hasError(E) && this.syslogForm.controls[m].touched
                    }

                    ngOnInit() {
                        this.initForm(), this.loadDropdownValues(), this.getSysLog(), this.portalService.passPortal(this.portalContent), setTimeout(() => {
                            this.portalService.passPortal(this.portalContent), this.loadDropdownValues()
                        }, 100), this.refreshPage(), this.onLanguageChanges()
                    }

                    initForm() {
                        this.syslogForm = new l.gE({
                            checkSyslogStatus: new l.MJ({
                                value: null,
                                disabled: this.api.device_capability.getVal("maintenance", "syslog", "syslogStatus").isDisabled
                            }),
                            remoteLogLevel: new l.MJ({
                                value: null,
                                disabled: this.api.device_capability.getVal("maintenance", "syslog", "remoteLogLevel").isDisabled
                            }),
                            serverIPAddress: new l.MJ({
                                value: null,
                                disabled: this.api.device_capability.getVal("maintenance", "syslog", "serverIpAddress").isDisabled
                            }, [l.k0.required, l.k0.pattern(this.constants.REGEX_SERVER_IP_VALIDATION)]),
                            serverPortNumber: new l.MJ({
                                value: null,
                                disabled: this.api.device_capability.getVal("maintenance", "syslog", "serverPortNumber").isDisabled
                            }, [l.k0.required, Ze.N.MinMaxValidator(1, 65535)])
                        })
                    }

                    onLanguageChanges() {
                        this.langChangeSub = this.pubSubService.subscribe(r.VR.LANGUAGE_CHANGE, t => {
                            this.loadDropdownValues(), window.setTimeout(() => {
                                this.loadDropdownValues()
                            }, 100), this.getSysLog()
                        })
                    }

                    refreshPage() {
                        this.pageRefreshSub = this.pubSubService.subscribe(r.VR.HEADER_REFRESH_CLICKED, t => {
                            this.getSysLog()
                        })
                    }

                    loadDropdownValues() {
                        this.remoteLogLevelList = [{
                            label: this.constants.LOG_EMERGENCY,
                            value: "0"
                        }, {label: this.constants.LOG_ALERT, value: "1"}, {
                            label: this.constants.LOG_CRITICAL,
                            value: "2"
                        }, {label: this.constants.ERROR_LABEL, value: "3"}, {
                            label: this.constants.WARNING,
                            value: "4"
                        }, {label: this.constants.LOG_NOTICE, value: "5"}, {
                            label: this.constants.LOG_INFORMATIONAL,
                            value: "6"
                        }, {label: this.constants.LOG_DEBUG, value: "7"}]
                    }

                    loadSysLogdata(t) {
                        const a = t.syslog_cfg.RemoteLogLevel,
                            s = this.logLevelList.find(o => o.label.toUpperCase() === a.toUpperCase());
                        if (!s) return !1;
                        this.remoteLogLevel.setValue(s.value), setTimeout(() => {
                            this.remoteLogLevel.setValue(s.value)
                        }, 500), this.checkSyslogStatus.setValue("Disabled" !== t.syslog_cfg.Status), this.serverIPAddress.setValue(t.syslog_cfg.ServerIPAddress), this.serverPortNumber.setValue(t.syslog_cfg.ServerPortNumber)
                    }

                    hasErrors() {
                        return this.syslogForm.invalid
                    }

                    getSysLog() {
                        this.api.request(this, "getLogsInfo")
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

                    ngOnDestroy() {
                        this.message.hideMessage({show: !1}), this.pureViewSnackbarService.hideMessageSnackbar(), this.pageRefreshSub?.unsubscribe(), this.langChangeSub.unsubscribe(), this.portalContent?.isAttached && this.portalContent.detach()
                    }

                    submitForm() {
                        if (this.serverIPAddress && !this.validations.Ipv4AddressValidation(this.serverIPAddress.value) && !this.validations.ipv6ValidationWithoutSlash(this.serverIPAddress.value)) return this.showWarning(this.constants.ERROR_ENTER_VALID_IP), !1;
                        this.disableSave = !0;
                        const t = `Status=${!!this.checkSyslogStatus.value}&RemoteLogLevel=${this.remoteLogLevel.value}&ServerIPAddress=${this.serverIPAddress.value}&ServerPortNumber=${this.serverPortNumber.value}`;
                        this.logger.console(t), this.api.request(this, "setlog", t)
                    }

                    onSuccess(t) {
                        const a = t.data;
                        switch (t.action) {
                            case r.En.GET_LOG_INFO:
                                this.loadSysLogdata(a);
                                break;
                            case r.En.SET_LOG:
                                this.disableSave = !1, this.getSysLog(), this.showSaveIcon = !0, window.setTimeout(() => {
                                    this.showSaveIcon = !1
                                }, 1e3)
                        }
                    }

                    onError(t) {
                        switch (t.action) {
                            case r.En.GET_LOG_INFO:
                                console.error("GET_LOG_INFO API Failed - Error"), console.error(t);
                                break;
                            case r.En.SET_LOG:
                                this.disableSave = !1, console.error("SET_LOG API Failed - Error"), console.error(t)
                        }
                    }

                    get checkSyslogStatus() {
                        return this.syslogForm.get("checkSyslogStatus")
                    }

                    get remoteLogLevel() {
                        return this.syslogForm.get("remoteLogLevel")
                    }

                    get serverIPAddress() {
                        return this.syslogForm.get("serverIPAddress")
                    }

                    get serverPortNumber() {
                        return this.syslogForm.get("serverPortNumber")
                    }

                    static #e = this.\u0275fac = function (a) {
                        return new (a || i)(e.rXU(p.YM), e.rXU(M._), e.rXU(I.G), e.rXU(f.Q), e.rXU(n.gd), e.rXU(g.V), e.rXU(Qe.k), e.rXU(n.m4))
                    };
                    static #t = this.\u0275cmp = e.VBU({
                        type: i,
                        selectors: [["app-syslog-config"]],
                        viewQuery: function (a, s) {
                            if (1 & a && e.GBs(N.bV, 7), 2 & a) {
                                let o;
                                e.mGM(o = e.lsd()) && (s.portalContent = o.first)
                            }
                        },
                        decls: 8,
                        vars: 5,
                        consts: [["formRef", ""], [3, "formGroup"], ["mb-6", ""], ["pb-4", "", 3, "hasBorder", "rowLayout", 4, "ngIf"], [4, "cdkPortal"], ["pb-4", "", 3, "hasBorder", "rowLayout"], [3, "title"], ["formControlName", "checkSyslogStatus", 3, "disabled", "isChecked"], [1, "syslog__form-control"], ["size", "MEDIUM", "formControlName", "remoteLogLevel"], [3, "disabled", "label", "value", 4, "ngFor", "ngForOf"], [3, "disabled", "label", "value"], ["size", "MEDIUM", "formControlName", "serverIPAddress", "maxlength", "32", 3, "disabled", "isValidated"], ["pt-1", "", "body1-regular", "", "class", "error-message", 3, "title", 4, "ngIf"], ["pt-1", "", "body1-regular", "", 1, "error-message", 3, "title"], ["size", "MEDIUM", "formControlName", "serverPortNumber", "type", "number", "maxlength", "5", 3, "disabled", "isValidated"], [1, "flex-row", "flex-row__center"], ["buttonType", "submit", "size", "small", 3, "onClick", "title", "webSave", "showButtonLoader", "isDisabled"]],
                        template: function (a, s) {
                            1 & a && (e.j41(0, "form", 1, 0)(2, "pv-card", 2), e.DNE(3, et, 4, 5, "pv-form-field", 3)(4, it, 6, 4, "pv-form-field", 3)(5, nt, 7, 7, "pv-form-field", 3)(6, lt, 7, 7, "pv-form-field", 3), e.k0s(), e.DNE(7, ct, 3, 4, "ng-container", 4), e.k0s()), 2 & a && (e.Y8G("formGroup", s.syslogForm), e.R7$(3), e.Y8G("ngIf", s.api.device_capability.getVal("maintenance", "syslog", "syslogStatus").isOn), e.R7$(), e.Y8G("ngIf", s.api.device_capability.getVal("maintenance", "syslog", "remoteLogLevel").isOn), e.R7$(), e.Y8G("ngIf", s.api.device_capability.getVal("maintenance", "syslog", "serverIpAddress").isOn), e.R7$(), e.Y8G("ngIf", s.api.device_capability.getVal("maintenance", "syslog", "serverPortNumber").isOn))
                        },
                        dependencies: [b.Sq, b.bT, l.qT, l.BC, l.cb, l.tU, n.xJ, n.Sp, n.XL, n.hO, n.v9, n.X, n.RA, n.Od, l.j4, l.JD, N.bV],
                        styles: [".syslog__form-control[_ngcontent-%COMP%]{width:300px}"]
                    })
                }

                return i
            })()
        }];
        let ht = (() => {
            class i {
                static #e = this.\u0275fac = function (a) {
                    return new (a || i)
                };
                static #t = this.\u0275mod = e.$C({type: i});
                static #i = this.\u0275inj = e.G2t({imports: [A.iI.forChild(pt), A.iI]})
            }

            return i
        })(), ut = (() => {
            class i {
                static #e = this.\u0275fac = function (a) {
                    return new (a || i)
                };
                static #t = this.\u0275mod = e.$C({type: i});
                static #i = this.\u0275inj = e.G2t({imports: [T.G, ht]})
            }

            return i
        })()
    }
}]);