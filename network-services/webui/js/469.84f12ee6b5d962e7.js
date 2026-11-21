"use strict";
(self.webpackChunknokiawifi = self.webpackChunknokiawifi || []).push([[469], {
    1774: (_e, Y, E) => {
        E.d(Y, {q: () => vt});
        var e = E(4438), b = E(6261), c = E(9417), k = E(8934), T = E(4493), P = E(765), U = E(8882), R = E(1989),
            $ = E(6279), p = E(6452), W = E(6425), X = E(2960), L = E(7365), A = E(7410), D = E(177), j = E(9197);
        const F = (i, l) => ({isBackdropClickClose: !1, title: i, caption: l, width: "426px"});

        function H(i, l) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-form-field", 4)(1, "label"), e.nrm(2, "pv-text", 5), e.k0s(), e.j41(3, "pv-button", 6), e.bIt("click", function () {
                    e.eBV(t);
                    const n = e.XpG(3);
                    return e.Njj(n.simLockMgmt())
                }), e.k0s()()
            }
            if (2 & i) {
                const t = e.XpG(3);
                e.Y8G("labelAlign", "top")("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.PIN_TITLE), e.R7$(), e.Y8G("title", t.constants.ENTER_PIN)("isDisabled", t.api.device_capability.getVal("simLock", "enterPIN").isDisabled)
            }
        }

        function q(i, l) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-form-field", 4)(1, "label"), e.nrm(2, "pv-text", 5), e.k0s(), e.j41(3, "pv-button", 7), e.bIt("click", function () {
                    e.eBV(t);
                    const n = e.XpG(3);
                    return e.Njj(n.simLockMgmt())
                }), e.k0s()()
            }
            if (2 & i) {
                const t = e.XpG(3);
                e.Y8G("labelAlign", "top")("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.PUK_TITLE), e.R7$(), e.Y8G("title", t.constants.ENTER_PUK)("isDisabled", t.api.device_capability.getVal("simLock", "enterPUK").isDisabled)
            }
        }

        function K(i, l) {
            if (1 & i && (e.j41(0, "pv-form-field", 4)(1, "label"), e.nrm(2, "pv-text", 8), e.k0s()()), 2 & i) {
                const t = e.XpG(3);
                e.Y8G("labelAlign", "top")("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.CONTACT_OPERATOR)
            }
        }

        function z(i, l) {
            if (1 & i && (e.qex(0), e.DNE(1, H, 4, 6, "pv-form-field", 3)(2, q, 4, 6, "pv-form-field", 3)(3, K, 3, 4, "pv-form-field", 3), e.bVm()), 2 & i) {
                const t = e.XpG(2);
                e.R7$(), e.Y8G("ngIf", "Available" === t.api.get_sim_status.SIMStatus), e.R7$(), e.Y8G("ngIf", "Blocked" === t.api.get_sim_status.SIMStatus), e.R7$(), e.Y8G("ngIf", "Error" === t.api.get_sim_status.SIMStatus)
            }
        }

        function J(i, l) {
            if (1 & i && (e.qex(0), e.nrm(1, "hr", 2), e.DNE(2, z, 4, 3, "ng-container", 0), e.bVm()), 2 & i) {
                const t = e.XpG();
                e.R7$(2), e.Y8G("ngIf", t.api.get_sim_status.PINLockFeature)
            }
        }

        function Q(i, l) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "form", 12)(1, "pv-form-field", 13)(2, "label"), e.nrm(3, "pv-text", 14), e.k0s(), e.nrm(4, "pv-inputbox", 15), e.j41(5, "label"), e.nrm(6, "pv-text", 16)(7, "pv-text", 17), e.k0s()(), e.j41(8, "pv-card", 18), e.nrm(9, "pv-vector", 19)(10, "pv-text", 20), e.k0s(), e.j41(11, "pv-button", 21), e.bIt("click", function () {
                    e.eBV(t);
                    const n = e.XpG(2);
                    return e.Njj(n.closePINLock())
                }), e.k0s(), e.j41(12, "pv-button", 22), e.bIt("click", function () {
                    e.eBV(t);
                    const n = e.XpG(2);
                    return e.Njj(n.submitPin())
                }), e.k0s()()
            }
            if (2 & i) {
                const t = e.XpG(2);
                e.Y8G("formGroup", t.simPinForm), e.R7$(), e.Y8G("hasBorder", !1)("rowLayout", !1), e.R7$(2), e.Y8G("title", t.constants.PIN_LABEL), e.R7$(), e.Y8G("onlyNumber", !0)("placeholder", t.constants.ENTER_PIN)("isValidated", !0), e.R7$(2), e.Y8G("title", t.errorMsg), e.R7$(), e.Y8G("title", t.api.get_sim_status.RemainingPINRetryTimes + " " + t.constants.REMAINING_ATTEMPTS), e.R7$(3), e.Y8G("title", t.constants.PIN_NOTICE), e.R7$(), e.Y8G("title", t.constants.CANCEL), e.R7$(), e.Y8G("webSave", t.showSaveIcon)("title", t.constants.ENTER_PIN)("isDisabled", !t.simPinForm.valid)
            }
        }

        function Z(i, l) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "form", 12)(1, "pv-form-field", 13)(2, "label"), e.nrm(3, "pv-text", 23), e.k0s(), e.nrm(4, "pv-inputbox", 24)(5, "pv-text", 25)(6, "pv-text", 26), e.k0s(), e.j41(7, "pv-form-field", 13)(8, "label"), e.nrm(9, "pv-text", 27), e.k0s(), e.nrm(10, "pv-inputbox", 28), e.k0s(), e.j41(11, "pv-form-field", 13)(12, "label"), e.nrm(13, "pv-text", 29), e.k0s(), e.nrm(14, "pv-inputbox", 30), e.k0s(), e.j41(15, "pv-card", 18), e.nrm(16, "pv-vector", 19)(17, "pv-text", 20), e.k0s(), e.j41(18, "pv-button", 21), e.bIt("click", function () {
                    e.eBV(t);
                    const n = e.XpG(2);
                    return e.Njj(n.closePINLock())
                }), e.k0s(), e.j41(19, "pv-button", 31), e.bIt("click", function () {
                    e.eBV(t);
                    const n = e.XpG(2);
                    return e.Njj(n.submitPuk())
                }), e.k0s()()
            }
            if (2 & i) {
                const t = e.XpG(2);
                e.Y8G("formGroup", t.simPukForm), e.R7$(), e.Y8G("hasBorder", !1)("rowLayout", !1), e.R7$(2), e.Y8G("title", t.constants.PUK_LABEL), e.R7$(), e.Y8G("onlyNumber", !0)("placeholder", t.constants.ENTER_PUK)("isValidated", !0), e.R7$(), e.Y8G("title", t.errorMsg), e.R7$(), e.Y8G("title", t.api.get_sim_status.RemainingPUKRetryTimes + " " + t.constants.REMAINING_ATTEMPTS), e.R7$(), e.Y8G("hasBorder", !1)("rowLayout", !1), e.R7$(2), e.Y8G("title", t.constants.NEW_PIN), e.R7$(), e.Y8G("onlyNumber", !0)("placeholder", t.constants.ENTER_PIN)("isValidated", !0), e.R7$(), e.Y8G("hasBorder", !1)("rowLayout", !1), e.R7$(2), e.Y8G("title", t.constants.CONFIRM_NEW_PIN), e.R7$(), e.Y8G("onlyNumber", !0)("placeholder", t.constants.CONFIRM_NEW_PIN)("isValidated", !0), e.R7$(3), e.Y8G("title", t.constants.PUK_NOTICE), e.R7$(), e.Y8G("title", t.constants.CANCEL), e.R7$(), e.Y8G("webSave", t.showSaveIcon)("title", t.constants.ENTER_PUK)("isDisabled", !t.simPukForm.valid)
            }
        }

        function ee(i, l) {
            if (1 & i) {
                const t = e.RV6();
                e.qex(0), e.j41(1, "pv-form-field", 13)(2, "label"), e.nrm(3, "pv-text", 32), e.k0s()(), e.j41(4, "pv-button", 33), e.bIt("click", function () {
                    e.eBV(t);
                    const n = e.XpG(2);
                    return e.Njj(n.showPINLock = !1)
                }), e.k0s(), e.bVm()
            }
            if (2 & i) {
                const t = e.XpG(2);
                e.R7$(), e.Y8G("hasBorder", !1)("rowLayout", !1), e.R7$(2), e.Y8G("title", t.constants.CONTACT_OPERATOR), e.R7$(), e.Y8G("title", t.constants.CLOSE)
            }
        }

        function te(i, l) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-dialog", 9), e.bIt("closeDialog", function () {
                    e.eBV(t);
                    const n = e.XpG();
                    return e.Njj(n.closePINLock())
                }), e.qex(1, 10), e.DNE(2, Q, 13, 14, "form", 11)(3, Z, 20, 26, "form", 11)(4, ee, 5, 4, "ng-container", 0), e.bVm(), e.k0s()
            }
            if (2 & i) {
                const t = e.XpG();
                e.Y8G("dialogConfig", e.l_i(4, F, t.simDialogTitle, t.simDialogCaption)), e.R7$(2), e.Y8G("ngIf", "Available" === t.api.get_sim_status.SIMStatus), e.R7$(), e.Y8G("ngIf", "Blocked" === t.api.get_sim_status.SIMStatus), e.R7$(), e.Y8G("ngIf", "Error" === t.api.get_sim_status.SIMStatus)
            }
        }

        function ie(i, l) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-dialog", 9), e.bIt("closeDialog", function () {
                    e.eBV(t);
                    const n = e.XpG();
                    return e.Njj(n.closePINAlert())
                }), e.eu8(1, 10), e.k0s()
            }
            if (2 & i) {
                const t = e.XpG();
                e.Y8G("dialogConfig", e.l_i(1, F, t.constants.OPID_CHANGED, t.constants.RESTART))
            }
        }

        let se = (() => {
            class i {
                constructor(t, o, n, d, f, N, g, v) {
                    this.api = t, this.constants = o, this.pureViewSnackbarService = n, this.alertUtil = d, this.utils = f, this.webSocket = N, this.formBuilder = g, this.prodcfg = v, this.hideOrig = !0, this.hide = !0, this.loader = !1, this.errorMsg = "", this.pinPat = "[0-9]+", this.simStatus = "", this.rebootAlert = !1, this.handleSimInfo = {
                        onSuccess: w => {
                            0 == w.data.result ? this.api.get_sim_status = w.data.FunctionResult : console.error("Error:", w.data.reason)
                        }, onError: w => {
                            this.api.requestTimeoutSnackbar(), console.error("Error:", w)
                        }
                    }, this.handlePinCheck = {
                        onSuccess: w => {
                            if (this.alertUtil.hideModalLoader(), 0 == w.data.result) this.showSaveIcon = !0, window.setTimeout(() => {
                                this.showSaveIcon = !1
                            }, 1600), this.api.requestSuccessSnackbar(this.constants.PIN_SUCCESS_MESSAGE, 7e3), this.api.get_sim_status.SIMStatus = w.data.FunctionResult.SIMStatus; else switch (w.data.FunctionResult.SIMStatus) {
                                case"Available":
                                    this.api.get_sim_status.RemainingPINRetryTimes = w.data.FunctionResult.RemainingPINRetryTimes, this.simPinForm.reset(), this.errorMsg = this.constants.WRONG_PIN, this.showPINLock = !0;
                                    break;
                                case"Blocked":
                                    this.api.get_sim_status.SIMStatus = w.data.FunctionResult.SIMStatus, this.errorMsg = this.constants.WRONG_PIN_BLOCK, this.simDialogTitle = this.constants.PUK_TITLE, this.showPINLock = !0;
                                    break;
                                default:
                                    this.api.unknownErrorSnackbar()
                            }
                        }, onError: w => {
                            this.alertUtil.hideModalLoader(), this.api.requestTimeoutSnackbar(), console.error("Error:", w)
                        }
                    }, this.handlePukCheck = {
                        onSuccess: w => {
                            if (this.alertUtil.hideModalLoader(), 0 == w.data.result) this.showSaveIcon = !0, window.setTimeout(() => {
                                this.showSaveIcon = !1, this.showPINLock = !1, this.api.requestSuccessSnackbar(this.constants.PUK_SUCCESS_MESSAGE, 7e3)
                            }, 1600), this.api.get_sim_status.SIMStatus = w.data.FunctionResult.SIMStatus; else switch (w.data.FunctionResult.SIMStatus) {
                                case"Blocked":
                                    this.api.get_sim_status.RemainingPUKRetryTimes = w.data.FunctionResult.RemainingPUKRetryTimes, this.simPukForm.reset(), this.errorMsg = this.constants.WRONG_PUK, this.showPINLock = !0;
                                    break;
                                case"Error":
                                    this.api.get_sim_status.SIMStatus = "Error", this.simDialogTitle = this.constants.SIM_ERROR, this.showPINLock = !0;
                                    break;
                                default:
                                    this.api.unknownErrorSnackbar()
                            }
                        }, onError: w => {
                            this.alertUtil.hideModalLoader(), this.api.requestTimeoutSnackbar(), console.error("Error:", w)
                        }
                    }, this.simPinForm = this.formBuilder.nonNullable.group({SIMPINCode: ["", [c.k0.required, c.k0.minLength(4), c.k0.maxLength(4), c.k0.pattern(this.pinPat)]]}), this.simPukForm = this.formBuilder.nonNullable.group({
                        SIMPUKCode: ["", [c.k0.required, c.k0.minLength(8), c.k0.maxLength(8), c.k0.pattern(this.pinPat)]],
                        SIMPINCode: ["", [c.k0.required, c.k0.minLength(4), c.k0.maxLength(4), c.k0.pattern(this.pinPat)]],
                        confirmPin: ["", c.k0.required]
                    }, {validators: this.utils.mustMatch("SIMPINCode", "confirmPin")})
                }

                ngOnInit() {
                    this.checkSiminfo()
                }

                get pinForm() {
                    return this.simPinForm.controls
                }

                get pukForm() {
                    return this.simPukForm.controls
                }

                simLockMgmt() {
                    this.showPINLock = !0, "Available" == this.api.get_sim_status.SIMStatus && (this.simDialogTitle = this.constants.PIN_TITLE), "Blocked" == this.api.get_sim_status.SIMStatus && (this.simDialogTitle = this.constants.PUK_TITLE), "Error" == this.api.get_sim_status.SIMStatus && (this.simDialogTitle = this.constants.CONTACT_OPERATOR), this.simDialogCaption = "", this.webSocket.listentToWebsocketEvent([4]).subscribe(t => {
                        4 == t.eventid && "Web" != t.payload[0].Originator && ("RebootSystem" === t.payload[0].Action || "Level2FactoryReset" === t.payload[0].Action) && (this.rebootAlert = !0, this.webSocket.closeConnection())
                    })
                }

                checkSiminfo() {
                    this.api.createBody("GetSIMInfo"), this.api.request(this.handleSimInfo, "callUBUS")
                }

                submitPin() {
                    if (this.showSaveIcon) return;
                    const t = "[" + JSON.stringify(this.simPinForm.value) + "]";
                    this.api.createBody("PINCheck", t), this.api.request(this.handlePinCheck, "callUBUS"), this.alertUtil.showModalLoader(), this.closePINLock()
                }

                submitPuk() {
                    if (this.errorMsg = "", this.showSaveIcon) return;
                    const t = "[" + JSON.stringify(this.simPukForm.value) + "]";
                    this.api.createBody("PINUnlock", t), this.api.request(this.handlePukCheck, "callUBUS"), this.alertUtil.showModalLoader(), this.closePINLock()
                }

                closePINLock() {
                    this.showPINLock = !1
                }

                closePINAlert() {
                    this.rebootAlert = !1
                }

                static #e = this.\u0275fac = function (o) {
                    return new (o || i)(e.rXU(k.G), e.rXU(T.YM), e.rXU(p.gd), e.rXU(R.l), e.rXU(P.V), e.rXU(j.m), e.rXU(c.ok), e.rXU(A.Z))
                };
                static #t = this.\u0275cmp = e.VBU({
                    type: i,
                    selectors: [["app-sim-lock-management"]],
                    decls: 3,
                    vars: 3,
                    consts: [[4, "ngIf"], [3, "dialogConfig", "closeDialog", 4, "ngIf"], [1, "hr-separator"], ["mb-4", "", 3, "labelAlign", "hasBorder", "rowLayout", 4, "ngIf"], ["mb-4", "", 3, "labelAlign", "hasBorder", "rowLayout"], ["body1-bold", "", 3, "title"], ["outline", "button-lightBlue", "id", "sim-pin", "size", "medium", 3, "click", "title", "isDisabled"], ["outline", "button-lightBlue", "id", "sim-puk", "size", "medium", 3, "click", "title", "isDisabled"], ["id", "sim-block", "body1-bold", "", 3, "title"], [3, "closeDialog", "dialogConfig"], ["pvModelContent", ""], ["autocomplete", "off", 3, "formGroup", 4, "ngIf"], ["autocomplete", "off", 3, "formGroup"], [3, "hasBorder", "rowLayout"], ["id", "lblSimPin", 3, "title"], ["password", "", "required", "", "size", "MEDIUM", "formControlName", "SIMPINCode", "id", "textSimPin", "maxlength", "4", 3, "onlyNumber", "placeholder", "isValidated"], ["id", "simPINErrorMsg", 1, "error-msg", 3, "title"], ["id", "simPINAttempts", 1, "error-msg", 3, "title"], ["mb-6", "", 1, "flex-row", "flex-row__start-center", "text-highlight"], ["name", "error_small_blue"], ["mr-2", "", "subtext1-regular", "", 1, "note", 3, "title"], ["outline", "primary", "size", "large", 3, "click", "title"], ["id", "btnSimPin", "mt-2", "", "type", "submit", 3, "click", "webSave", "title", "isDisabled"], ["id", "lblSimPuk", 3, "title"], ["password", "", "required", "", "size", "MEDIUM", "formControlName", "SIMPUKCode", "id", "textSimPuk", "maxlength", "8", 3, "onlyNumber", "placeholder", "isValidated"], ["id", "simPUKErrorMsg", 1, "error-msg", 3, "title"], ["id", "simPUKAttempts", 1, "error-msg", 3, "title"], ["id", "lblNewPin", 3, "title"], ["password", "", "required", "", "size", "MEDIUM", "formControlName", "SIMPINCode", "id", "textNewPin", "maxlength", "4", 3, "onlyNumber", "placeholder", "isValidated"], ["id", "lblConfirmPin", 3, "title"], ["password", "", "required", "", "size", "MEDIUM", "formControlName", "confirmPin", "id", "textConfirmPin", "maxlength", "4", 3, "onlyNumber", "placeholder", "isValidated"], ["id", "btnSimPuk", "mt-2", "", "type", "submit", 3, "click", "webSave", "title", "isDisabled"], ["id", "simErrorMsg", 3, "title"], ["id", "btnSimBlock", "size", "small", 3, "click", "title"]],
                    template: function (o, n) {
                        1 & o && e.DNE(0, J, 3, 1, "ng-container", 0)(1, te, 5, 7, "pv-dialog", 1)(2, ie, 2, 4, "pv-dialog", 1), 2 & o && (e.Y8G("ngIf", n.prodcfg.supportsFWADevice && n.api.device_capability.getVal("simLock", "visibility").isOn && n.api.get_sim_status.PINLockFeature && "Valid" !== n.api.get_sim_status.SIMStatus), e.R7$(), e.Y8G("ngIf", n.showPINLock), e.R7$(), e.Y8G("ngIf", n.rebootAlert))
                    },
                    dependencies: [D.bT, c.qT, c.BC, c.cb, c.YS, c.tU, p.xJ, p.Sp, p.XL, p.v9, p.oN, p.X, p.H9, c.j4, c.JD],
                    styles: [".error-msg[_ngcontent-%COMP%]{color:var(--pure-color-red-600)}"]
                })
            }

            return i
        })();
        const ne = (i, l) => ({isBackdropClickClose: !1, title: i, caption: l, width: "426px"});

        function oe(i, l) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-button", 8), e.bIt("click", function () {
                    e.eBV(t);
                    const n = e.XpG(2);
                    return e.Njj(n.showWanAccessMode = !0)
                }), e.k0s()
            }
            if (2 & i) {
                const t = e.XpG(2);
                e.Y8G("title", t.constants.CHANGE_LABEL)("isDisabled", t.api.device_capability.getVal("wifi", "networkMap", "deviceInfoDetails", "wanAccessMode", "wanAccessChangeButton").isDisabled)
            }
        }

        function ae(i, l) {
            if (1 & i && (e.qex(0), e.nrm(1, "hr", 3), e.j41(2, "pv-form-field", 4)(3, "label"), e.nrm(4, "pv-text", 5)(5, "pv-text", 6), e.k0s(), e.DNE(6, oe, 1, 2, "pv-button", 7), e.k0s(), e.bVm()), 2 & i) {
                const t = e.XpG();
                e.R7$(2), e.Y8G("labelAlign", "top")("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.WAN_ACCESS_MODE), e.R7$(), e.Y8G("title", t.wanMode), e.R7$(), e.Y8G("ngIf", t.api.device_capability.getVal("wifi", "networkMap", "deviceInfoDetails", "wanAccessMode", "wanAccessChangeButton").isOn)
            }
        }

        function h(i, l) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "form", 12, 0), e.qex(2), e.j41(3, "pv-card", 13), e.nrm(4, "pv-vector", 14)(5, "pv-text", 15), e.k0s(), e.j41(6, "pv-radio", 16), e.bIt("onSelect", function (n) {
                    e.eBV(t);
                    const d = e.XpG(2);
                    return e.Njj(d.selFromListMode(n))
                }), e.k0s(), e.bVm(), e.j41(7, "pv-button", 17), e.bIt("click", function () {
                    e.eBV(t);
                    const n = e.XpG(2);
                    return e.Njj(n.saveWanAccessMode())
                }), e.k0s()()
            }
            if (2 & i) {
                const t = e.XpG(2);
                e.Y8G("formGroup", t.wanAccessform), e.R7$(5), e.Y8G("title", t.constants.REBOOT_NEEDED), e.R7$(), e.Y8G("isBordered", !0)("radioData", t.wanAccessModeList)("selectedValue", t.wanAccessMode.value), e.R7$(), e.Y8G("webSave", t.showSaveIcon)("title", t.constants.SAVE)
            }
        }

        function C(i, l) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-dialog", 9), e.bIt("closeDialog", function () {
                    e.eBV(t);
                    const n = e.XpG();
                    return e.Njj(n.closeWanAccessMode())
                }), e.qex(1, 10), e.DNE(2, h, 8, 7, "form", 11), e.bVm(), e.k0s()
            }
            if (2 & i) {
                const t = e.XpG();
                e.Y8G("dialogConfig", e.l_i(2, ne, t.constants.SELECT_AN_OPTION, t.constants.SELECT_MODE)), e.R7$(2), e.Y8G("ngIf", t.prodcfg.supportsFWALanWan)
            }
        }

        let s = (() => {
            class i {
                constructor(t, o, n, d, f, N, g) {
                    this.api = t, this.constants = o, this.alertUtil = n, this.pureViewSnackbarService = d, this.for
                    mBuilder = f, this.pubSubService = N, this.prodcfg = g, this.disableSaveButton = !1, this.showSaveIcon = !1, this.showWanAccessMode = !1, this.wanMode = "", this.wanAccessModeList = [{
                        title: this.constants.CELLULAR,
                        value: "CellularOnly",
                        disabled: !1
                    }, {
                        title: this.constants.CELLULAR_PREFERRED,
                        value: "ActiveStandbyWithCellularHigh",
                        disabled: !1
                    }, {
                        title: this.constants.ETHERNET_PREFERRED,
                        value: "ActiveStandbyWithEthernetHigh",
                        disabled: !1
                    }], this.handleWANAccessMode = {
                        onSuccess: v => {
                            0 == v.data.result ? (this.wanAccessMode.setValue(v.data.FunctionResult.WANAccessMode), this.showWanAccessModeValue()) : console.error("Error:", v.data.reason)
                        }, onError: v => {
                            console.error("Error:", v)
                        }
                    }, this.handleSaveWANAccessMode = {
                        onSuccess: v => {
                            this.alertUtil.hideModalLoader(), 0 == v.data.result ? (this.showSaveIcon = !0, window.setTimeout(() => {
                                this.showSaveIcon = !1, this.showWanAccessMode = !1, this.showWanAccessModeValue(), this.api.requestSuccessSnackbar(this.constants.WAN_ACCESS_SAVE_SUCCESS, 7e3)
                            }, 1600)) : (this.disableSaveButton = !1, this.api.unknownErrorSnackbar())
                        }, onError: v => {
                            this.api.requestTimeoutSnackbar(), console.error("Error:", v)
                        }
                    }, this.wanAccessform = this.formBuilder.nonNullable.group({WANAccessMode: [""]})
                }

                ngOnInit() {
                    this.prodcfg.supportsFWALanWan && this.getWanAccessMode(), this.onLanguageChanges()
                }

                ngOnDestroy() {
                    this.langChangeSub.unsubscribe()
                }

                closeWanAccessMode() {
                    this.showWanAccessMode = !1
                }

                selFromListMode(t) {
                    this.wanAccessMode.setValue(t)
                }

                get wanAccessMode() {
                    return this.wanAccessform.get("WANAccessMode")
                }

                getWanAccessMode() {
                    this.api.createBody("GetWANAccessMode"), this.api.request(this.handleWANAccessMode, "callUBUS")
                }

                saveWanAccessMode() {
                    if (this.showSaveIcon) return;
                    const t = "[" + JSON.stringify(this.wanAccessform.value) + "]";
                    this.api.createBody("SetWANAccessMode", t), this.api.request(this.handleSaveWANAccessMode, "callUBUS"), this.alertUtil.showModalLoader()
                }

                showWanAccessModeValue() {
                    const t = this.wanAccessModeList.find(o => o.value === this.wanAccessMode.value);
                    this.wanMode = t.title
                }

                onLanguageChanges() {
                    this.langChangeSub = this.pubSubService.subscribe(b.VR.LANGUAGE_CHANGE, t => {
                        this.wanAccessModeList = [{
                            title: this.constants.CELLULAR,
                            value: "CellularOnly",
                            disabled: !1
                        }, {
                            title: this.constants.CELLULAR_PREFERRED,
                            value: "ActiveStandbyWithCellularHigh",
                            disabled: !1
                        }, {
                            title: this.constants.ETHERNET_PREFERRED,
                            value: "ActiveStandbyWithEthernetHigh",
                            disabled: !1
                        }]
                    })
                }

                static #e = this.\u0275fac = function (o) {
                    return new (o || i)(e.rXU(k.G), e.rXU(T.YM), e.rXU(R.l), e.rXU(p.gd), e.rXU(c.ok), e.rXU(U.Q), e.rXU(A.Z))
                };
                static #t = this.\u0275cmp = e.VBU({
                    type: i,
                    selectors: [["app-wan-access-mode"]],
                    decls: 2,
                    vars: 2,
                    consts: [["formRef", ""], [4, "ngIf"], [3, "dialogConfig", "closeDialog", 4, "ngIf"], [1, "hr-separator"], ["mb-4", "", 3, "labelAlign", "hasBorder", "rowLayout"], ["id", "wanAccessMode-lbl", "body1-bold", "", 3, "title"], ["id", "wanAccessMode-value", "mt-4", "", "subtext2-regular-800", "", 3, "title"], ["id", "wanAccessMode-btn", "outline", "button-lightBlue", "size", "medium", 3, "title", "isDisabled", "click", 4, "ngIf"], ["id", "wanAccessMode-btn", "outline", "button-lightBlue", "size", "medium", 3, "click", "title", "isDisabled"], [3, "closeDialog", "dialogConfig"], ["pvModelContent", ""], [3, "formGroup", 4, "ngIf"], [3, "formGroup"], ["mb-6", "", 1, "flex-row", "flex-row__start-center", "text-highlight"], ["name", "error_small_blue"], ["id", "wanAccessform-msg", "mr-2", "", "subtext1-regular", "", 1, "note", 3, "title"], ["id", "wanAccessform-value", "isTitleTextBold", "true", 2, "cursor", "pointer", 3, "onSelect", "isBordered", "radioData", "selectedValue"], ["id", "wanAccessform-save", "mt-4", "", "buttonType", "submit", 3, "click", "webSave", "title"]],
                    template: function (o, n) {
                        1 & o && e.DNE(0, ae, 7, 6, "ng-container", 1)(1, C, 3, 5, "pv-dialog", 2), 2 & o && (e.Y8G("ngIf", n.prodcfg.supportsFWADevice && n.prodcfg.supportsFWALanWan && n.api.device_capability.getVal("wifi", "networkMap", "deviceInfoDetails", "wanAccessMode", "visibility").isOn), e.R7$(), e.Y8G("ngIf", n.showWanAccessMode))
                    },
                    dependencies: [D.bT, c.qT, c.cb, p.xJ, p.XL, p.Ux, p.v9, p.oN, p.X, p.H9, c.j4]
                })
            }

            return i
        })();

        function a(i, l) {
            if (1 & i) {
                const t = e.RV6();
                e.qex(0), e.nrm(1, "hr", 1), e.j41(2, "form", 2)(3, "pv-form-field", 3)(4, "label"), e.nrm(5, "pv-text", 4), e.k0s(), e.j41(6, "pv-toggle", 5), e.bIt("onCheck", function () {
                    e.eBV(t);
                    const n = e.XpG();
                    return e.Njj(n.setTrafficForwardingInfo())
                }), e.k0s()()(), e.bVm()
            }
            if (2 & i) {
                const t = e.XpG();
                e.R7$(2), e.Y8G("formGroup", t.trafficControlForm), e.R7$(), e.Y8G("hasBorder", !0)("rowLayout", !0)("labelAlign", "top"), e.R7$(2), e.Y8G("title", t.api.constants.ENABLE_DATA_FORWARDING), e.R7$(), e.Y8G("isChecked", t.blockTrafficForwarding.value)("disabled", t.api.device_capability.getVal("wifi", "networkMap", "deviceInfoDetails", "dataForwarding", "visibility").isDisabled)
            }
        }

        let r = (() => {
            class i {
                constructor(t, o, n) {
                    this.api = t, this.constants = o, this.formBuilder = n, this.handleTrafficBlockStatus = {
                        onSuccess: d => {
                            0 == d.data.result ? this.blockTrafficForwarding.setValue("false" === d.data.FunctionResult.Value || 0 === d.data.FunctionResult.Value) : console.error("Error:", d.data.reason)
                        }, onError: d => {
                            this.api.requestTimeoutSnackbar(), console.error("Error:", d)
                        }
                    }, this.handleBlockTraffic = {
                        onSuccess: d => {
                            0 == d.data.result ? this.api.requestSuccessSnackbar() : (this.api.unknownErrorSnackbar(), this.blockTrafficForwarding.setValue(!this.blockTrafficForwarding.value)), this.blockTrafficForwarding.enable()
                        }, onError: d => {
                            this.api.requestTimeoutSnackbar(), this.blockTrafficForwarding.enable(), this.blockTrafficForwarding.setValue(!this.blockTrafficForwarding.value), console.error("Error:", d)
                        }
                    }, this.trafficControlForm = this.formBuilder.nonNullable.group({blockTrafficForwarding: [!1]})
                }

                ngOnInit() {
                    this.getTrafficForwardingInfo()
                }

                get blockTrafficForwarding() {
                    return this.trafficControlForm.get("blockTrafficForwarding")
                }

                getTrafficForwardingInfo() {
                    this.api.createBody("GetTrafficBlockStatus"), this.api.request(this.handleTrafficBlockStatus, "callUBUS")
                }

                setTrafficForwardingInfo() {
                    this.api.createBody(this.blockTrafficForwarding.value ? "BlockTraffic" : "UnblockTraffic"), this.api.request(this.handleBlockTraffic, "callUBUS"), this.blockTrafficForwarding.disable()
                }

                static #e = this.\u0275fac = function (o) {
                    return new (o || i)(e.rXU(k.G), e.rXU(T.YM), e.rXU(c.ok))
                };
                static #t = this.\u0275cmp = e.VBU({
                    type: i,
                    selectors: [["app-block-data-traffic"]],
                    decls: 1,
                    vars: 1,
                    consts: [[4, "ngIf"], [1, "hr-separator"], [3, "formGroup"], ["mb-4", "", 3, "hasBorder", "rowLayout", "labelAlign"], ["id", "data_forwarding", "body1-bold", "", 3, "title"], ["formControlName", "blockTrafficForwarding", "id", "blockDataTraffic", 3, "onCheck", "isChecked", "disabled"]],
                    template: function (o, n) {
                        1 & o && e.DNE(0, a, 7, 7, "ng-container", 0), 2 & o && e.Y8G("ngIf", n.api.device_capability.getVal("wifi", "networkMap", "deviceInfoDetails", "dataForwarding", "visibility").isOn)
                    },
                    dependencies: [D.bT, c.qT, c.BC, c.cb, p.hO, p.v9, p.X, c.j4, c.JD]
                })
            }

            return i
        })();
        const _ = (i, l) => ({isBackdropClickClose: !1, title: i, caption: l, width: "426px"});

        function u(i, l) {
            if (1 & i) {
                const t = e.RV6();
                e.qex(0), e.nrm(1, "hr", 2), e.j41(2, "form", 3)(3, "pv-form-field", 4)(4, "label"), e.nrm(5, "pv-text", 5), e.k0s(), e.j41(6, "pv-toggle", 6), e.bIt("onCheck", function () {
                    e.eBV(t);
                    const n = e.XpG();
                    return e.Njj(n.showUSIMAdminStateDialog = !0)
                }), e.k0s()()(), e.bVm()
            }
            if (2 & i) {
                const t = e.XpG();
                e.R7$(2), e.Y8G("formGroup", t.uSimControlForm), e.R7$(), e.Y8G("hasBorder", !0)("rowLayout", !0)("labelAlign", "top"), e.R7$(2), e.Y8G("title", t.api.constants.ENABLE_USIM), e.R7$(), e.Y8G("isChecked", t.configureUsim.value)("disabled", t.api.device_capability.getVal("wifi", "networkMap", "deviceInfoDetails", "uSIMEnable", "visibility").isDisabled)
            }
        }

        function m(i, l) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-dialog", 7), e.bIt("closeDialog", function () {
                    e.eBV(t);
                    const n = e.XpG();
                    return e.Njj(n.closeUSIMAdminStateDialog())
                }), e.qex(1, 8), e.j41(2, "div", 9)(3, "pv-button", 10), e.bIt("click", function () {
                    e.eBV(t);
                    const n = e.XpG();
                    return e.Njj(n.closeUSIMAdminStateDialog())
                }), e.k0s(), e.j41(4, "pv-button", 11), e.bIt("click", function () {
                    e.eBV(t);
                    const n = e.XpG();
                    return e.Njj(n.setUSIMAdminState())
                }), e.k0s()(), e.bVm(), e.k0s()
            }
            if (2 & i) {
                const t = e.XpG();
                e.Y8G("dialogConfig", e.l_i(4, _, t.constants.USIM_TITLE, t.constants.USIM_CONFIRM_CHANGE)), e.R7$(3), e.Y8G("title", t.constants.CANCEL), e.R7$(), e.Y8G("webSave", t.showSaveIcon)("title", t.constants.OK)
            }
        }

        let S = (() => {
            class i {
                constructor(t, o, n, d, f, N) {
                    this.api = t, this.constants = o, this.alertUtil = n, this.pureViewSnackbarService = d, this.formBuilder = f, this.prodcfg = N, this.showUSIMAdminStateDialog = !1, this.handleGetSIMSelectionPolicy = {
                        onSuccess: g => {
                            0 == g.data.result ? "Adaptive" === g.data.FunctionResult.SIMconfiguration && "ZAIN" === g.data.FunctionResult.OPID && this.getUSIMAdminState() : console.error("Error:", g.data.reason)
                        }, onError: g => {
                            this.api.requestTimeoutSnackbar(), console.error("Error:", g)
                        }
                    }, this.handleGetUSIMAdminState = {
                        onSuccess: g => {
                            0 == g.data.result ? this.configureUsim.setValue(g.data.FunctionResult.Value) : console.error("Error:", g.data.reason)
                        }, onError: g => {
                            this.api.requestTimeoutSnackbar(), console.error("Error:", g)
                        }
                    }, this.handleSetUSIMAdminState = {
                        onSuccess: g => {
                            this.alertUtil.hideModalLoader(), 0 == g.data.result ? this.api.requestSuccessSnackbar() : (this.api.unknownErrorSnackbar(), this.configureUsim.setValue(!this.configureUsim.value)), this.configureUsim.enable()
                        }, onError: g => {
                            this.alertUtil.hideModalLoader(), this.api.requestTimeoutSnackbar(), this.configureUsim.enable(), console.error("Error:", g), this.configureUsim.setValue(!this.configureUsim.value)
                        }
                    }, this.uSimControlForm = this.formBuilder.nonNullable.group({USIMAdminState: [!1]})
                }

                ngOnInit() {
                    this.getSIMSelectionPolicy()
                }

                get configureUsim() {
                    return this.uSimControlForm.get("USIMAdminState")
                }

                getSIMSelectionPolicy() {
                    this.api.createBody("GetSIMSelectionPolicy"), this.api.request(this.handleGetSIMSelectionPolicy, "callUBUS")
                }

                getUSIMAdminState() {
                    this.api.createBody("GetUSIMAdminState"), this.api.request(this.handleGetUSIMAdminState, "callUBUS")
                }

                setUSIMAdminState() {
                    const t = "[" + JSON.stringify(this.uSimControlForm.value) + "]";
                    this.api.createBody("SetUSIMAdminState", t), this.api.request(this.handleSetUSIMAdminState, "callUBUS"), this.configureUsim.disable(), this.alertUtil.showModalLoader(), this.showUSIMAdminStateDialog = !1
                }

                closeUSIMAdminStateDialog() {
                    this.showUSIMAdminStateDialog = !1, this.configureUsim.setValue(!this.configureUsim.value)
                }

                static #e = this.\u0275fac = function (o) {
                    return new (o || i)(e.rXU(k.G), e.rXU(T.YM), e.rXU(R.l), e.rXU(p.gd), e.rXU(c.ok), e.rXU(A.Z))
                };
                static #t = this.\u0275cmp = e.VBU({
                    type: i,
                    selectors: [["app-usim-enable"]],
                    decls: 2,
                    vars: 2,
                    consts: [[4, "ngIf"], [3, "dialogConfig", "closeDialog", 4, "ngIf"], [1, "hr-separator"], [3, "formGroup"], ["mb-4", "", 3, "hasBorder", "rowLayout", "labelAlign"], ["id", "uSIM_control", "body1-bold", "", 3, "title"], ["formControlName", "USIMAdminState", "id", "controlUsim", 3, "onCheck", "isChecked", "disabled"], [3, "closeDialog", "dialogConfig"], ["pvModelContent", ""], ["pt-4", "", 1, "flex-row", "flex-row__end-center"], ["outline", "primary", "size", "small", "mr-2", "", 3, "click", "title"], ["id", "btnSimPin", "type", "submit", "size", "small", 3, "click", "webSave", "title"]],
                    template: function (o, n) {
                        1 & o && e.DNE(0, u, 7, 7, "ng-container", 0)(1, m, 5, 7, "pv-dialog", 1), 2 & o && (e.Y8G("ngIf", n.prodcfg.supportsFWADevice && n.api.device_capability.getVal("wifi", "networkMap", "deviceInfoDetails", "uSIMEnable", "visibility").isOn), e.R7$(), e.Y8G("ngIf", n.showUSIMAdminStateDialog))
                    },
                    dependencies: [D.bT, c.qT, c.BC, c.cb, p.XL, p.hO, p.v9, p.X, p.H9, c.j4, c.JD]
                })
            }

            return i
        })(), M = (() => {
            class i {
                constructor(t, o, n) {
                    this.api = t, this.constants = o, this.formBuilder = n, this.handleGetBluetoothStatus = {
                        onSuccess: d => {
                            d.data && this.configureBluetooth.setValue(!0 === d.data.bluetooth.Enable || 1 === d.data.bluetooth.Enable)
                        }
                    }, this.handleSetBluetoothStatus = {
                        onSuccess: d => {
                            0 == d.data.result ? this.api.requestSuccessSnackbar() : this.api.unknownErrorSnackbar(), this.configureBluetooth.enable(), this.getBluetoothStatus()
                        }, onError: d => {
                            this.api.requestTimeoutSnackbar(), console.error("Error:", d), this.configureBluetooth.enable(), this.getBluetoothStatus()
                        }
                    }
                }

                ngOnInit() {
                    this.BluetoothControlForm = this.formBuilder.nonNullable.group({configureBluetooth: [!1]}), this.getBluetoothStatus()
                }

                get configureBluetooth() {
                    return this.BluetoothControlForm.get("configureBluetooth")
                }

                getBluetoothStatus() {
                    this.api.request(this.handleGetBluetoothStatus, "getBluetoothStatus")
                }

                configureBluetoothStatus() {
                    let t;
                    t = this.configureBluetooth.value ? "Enable=1" : "Enable=0", this.api.request(this.handleSetBluetoothStatus, "setBluetoothStatus", t), this.configureBluetooth.disable()
                }

                static #e = this.\u0275fac = function (o) {
                    return new (o || i)(e.rXU(k.G), e.rXU(T.YM), e.rXU(c.ok))
                };
                static #t = this.\u0275cmp = e.VBU({
                    type: i,
                    selectors: [["app-bluetooth"]],
                    decls: 7,
                    vars: 6,
                    consts: [[1, "hr-separator"], [3, "formGroup"], ["mb-4", "", 3, "hasBorder", "rowLayout", "labelAlign"], ["id", "bluetooth_control", "body1-bold", "", 3, "title"], ["formControlName", "configureBluetooth", "id", "controlBluetooth", 3, "onCheck", "isChecked"]],
                    template: function (o, n) {
                        1 & o && (e.qex(0), e.nrm(1, "hr", 0), e.j41(2, "form", 1)(3, "pv-form-field", 2)(4, "label"), e.nrm(5, "pv-text", 3), e.k0s(), e.j41(6, "pv-toggle", 4), e.bIt("onCheck", function () {
                            return n.configureBluetoothStatus()
                        }), e.k0s()()(), e.bVm()), 2 & o && (e.R7$(2), e.Y8G("formGroup", n.BluetoothControlForm), e.R7$(), e.Y8G("hasBorder", !0)("rowLayout", !0)("labelAlign", "top"), e.R7$(2), e.Y8G("title", n.api.constants.ENABLE_BLUETOOTH), e.R7$(), e.Y8G("isChecked", !!n.configureBluetooth.value))
                    },
                    dependencies: [c.qT, c.BC, c.cb, p.hO, p.v9, p.X, c.j4, c.JD]
                })
            }

            return i
        })();

        function G(i, l) {
            if (1 & i) {
                const t = e.RV6();
                e.qex(0), e.nrm(1, "hr", 1), e.j41(2, "form", 2)(3, "pv-form-field", 3)(4, "label"), e.nrm(5, "pv-text", 4), e.k0s(), e.j41(6, "pv-toggle", 5), e.bIt("onCheck", function () {
                    e.eBV(t);
                    const n = e.XpG();
                    return e.Njj(n.setDeviceSIMPINLockState())
                }), e.k0s()()(), e.bVm()
            }
            if (2 & i) {
                const t = e.XpG();
                e.R7$(2), e.Y8G("formGroup", t.deviceSIMPINLockControlForm), e.R7$(), e.Y8G("hasBorder", !0)("rowLayout", !0)("labelAlign", "top"), e.R7$(2), e.Y8G("title", t.api.constants.DEVICESIMPIN_LOCK), e.R7$(), e.Y8G("isChecked", t.deviceSIMPINLock.value)("disabled", t.api.device_capability.getVal("wifi", "networkMap", "deviceInfoDetails", "deviceSIMPINLock", "visibility").isDisabled)
            }
        }

        let x = (() => {
            class i {
                constructor(t, o, n, d, f, N) {
                    this.api = t, this.constants = o, this.alertUtil = n, this.pureViewSnackbarService = d, this.formBuilder = f, this.prodcfg = N, this.handleGetDeviceSIMPINLockState = {
                        onSuccess: g => {
                            0 == g.data.result ? this.deviceSIMPINLock.setValue("STC_Enable" === g.data.FunctionResult.DeviceSIMPINLock) : console.error("Error:", g.data.reason)
                        }, onError: g => {
                            this.api.requestTimeoutSnackbar(), console.error("Error:", g)
                        }
                    }, this.handleSetDeviceSIMPINLock = {
                        onSuccess: g => {
                            0 == g.data.result ? this.api.requestSuccessSnackbar() : (this.api.unknownErrorSnackbar(), this.deviceSIMPINLock.setValue(!this.deviceSIMPINLock.value)), this.deviceSIMPINLock.enable()
                        }, onError: g => {
                            this.api.requestTimeoutSnackbar(), this.deviceSIMPINLock.enable(), this.deviceSIMPINLock.setValue(!this.deviceSIMPINLock.value), console.error("Error:", g)
                        }
                    }, this.deviceSIMPINLockControlForm = this.formBuilder.nonNullable.group({DeviceSIMPINLock: [!1]})
                }

                ngOnInit() {
                    this.getDeviceSIMPINLockState()
                }

                get deviceSIMPINLock() {
                    return this.deviceSIMPINLockControlForm.get("DeviceSIMPINLock")
                }

                getDeviceSIMPINLockState() {
                    this.api.createBody("GetDeviceSIMPINLock"), this.api.request(this.handleGetDeviceSIMPINLockState, "callUBUS")
                }

                setDeviceSIMPINLockState() {
                    let t = "OFF";
                    this.deviceSIMPINLock.v
                    alue && (t = "STC_Enable");
                    const n = JSON.stringify([{DeviceSIMPINLock: t}]);
                    this.api.createBody("SetDeviceSIMPINLock", n), this.api.request(this.handleSetDeviceSIMPINLock, "callUBUS"), this.deviceSIMPINLock.disable()
                }

                static #e = this.\u0275fac = function (o) {
                    return new (o || i)(e.rXU(k.G), e.rXU(T.YM), e.rXU(R.l), e.rXU(p.gd), e.rXU(c.ok), e.rXU(A.Z))
                };
                static #t = this.\u0275cmp = e.VBU({
                    type: i,
                    selectors: [["app-stc-sim-management"]],
                    decls: 1,
                    vars: 1,
                    consts: [[4, "ngIf"], [1, "hr-separator"], [3, "formGroup"], ["mb-4", "", 3, "hasBorder", "rowLayout", "labelAlign"], ["id", "deviceSIMPINLock_label", "body1-bold", "", 3, "title"], ["formControlName", "DeviceSIMPINLock", "id", "deviceSIMPINLock_toggle", 3, "onCheck", "isChecked", "disabled"]],
                    template: function (o, n) {
                        1 & o && e.DNE(0, G, 7, 7, "ng-container", 0), 2 & o && e.Y8G("ngIf", n.prodcfg.supportsFWADevice && n.api.device_capability.getVal("wifi", "networkMap", "deviceInfoDetails", "deviceSIMPINLock", "visibility").isOn)
                    },
                    dependencies: [D.bT, c.qT, c.BC, c.cb, p.hO, p.v9, p.X, c.j4, c.JD]
                })
            }

            return i
        })();

        function y(i, l) {
            if (1 & i) {
                const t = e.RV6();
                e.qex(0), e.nrm(1, "hr", 1), e.j41(2, "form", 2)(3, "pv-form-field", 3)(4, "label"), e.nrm(5, "pv-text", 4), e.k0s(), e.j41(6, "pv-toggle", 5), e.bIt("onCheck", function () {
                    e.eBV(t);
                    const n = e.XpG();
                    return e.Njj(n.setOperatorLockState())
                }), e.k0s()()(), e.bVm()
            }
            if (2 & i) {
                const t = e.XpG();
                e.R7$(2), e.Y8G("formGroup", t.operatorLockControlForm), e.R7$(), e.Y8G("hasBorder", !0)("rowLayout", !0)("labelAlign", "top"), e.R7$(2), e.Y8G("title", t.api.constants.OPERATOR_LOCK), e.R7$(), e.Y8G("isChecked", t.operatorLock.value)("disabled", t.api.device_capability.getVal("wifi", "networkMap", "deviceInfoDetails", "operatorLock", "visibility").isDisabled)
            }
        }

        let re = (() => {
            class i {
                constructor(t, o, n, d, f, N) {
                    this.api = t, this.constants = o, this.alertUtil = n, this.pureViewSnackbarService = d, this.formBuilder = f, this.prodcfg = N, this.handleGetOperatorLockState = {
                        onSuccess: g => {
                            0 == g.data.result ? this.operatorLock.setValue(g.data.FunctionResult.OperatorLock) : console.error("Error:", g.data.reason)
                        }, onError: g => {
                            this.api.requestTimeoutSnackbar(), console.error("Error:", g)
                        }
                    }, this.handleSetOperatorLock = {
                        onSuccess: g => {
                            0 == g.data.result ? this.api.requestSuccessSnackbar() : (this.api.unknownErrorSnackbar(), this.operatorLock.setValue(!this.operatorLock.value)), this.operatorLock.enable()
                        }, onError: g => {
                            this.api.requestTimeoutSnackbar(), this.operatorLock.enable(), this.operatorLock.setValue(!this.operatorLock.value), console.error("Error:", g)
                        }
                    }, this.operatorLockControlForm = this.formBuilder.nonNullable.group({OperatorLock: [!1]})
                }

                ngOnInit() {
                    this.getOperatorLockState()
                }

                get operatorLock() {
                    return this.operatorLockControlForm.get("OperatorLock")
                }

                getOperatorLockState() {
                    this.api.createBody("GetOperatorLockConfig"), this.api.request(this.handleGetOperatorLockState, "callUBUS")
                }

                setOperatorLockState() {
                    const t = "[" + JSON.stringify(this.operatorLockControlForm.value) + "]";
                    this.api.createBody("SetOperatorLockConfig", t), this.api.request(this.handleSetOperatorLock, "callUBUS"), this.operatorLock.disable()
                }

                static #e = this.\u0275fac = function (o) {
                    return new (o || i)(e.rXU(k.G), e.rXU(T.YM), e.rXU(R.l), e.rXU(p.gd), e.rXU(c.ok), e.rXU(A.Z))
                };
                static #t = this.\u0275cmp = e.VBU({
                    type: i,
                    selectors: [["app-operator-lock"]],
                    decls: 2,
                    vars: 3,
                    consts: [[4, "ngIf"], [1, "hr-separator"], [3, "formGroup"], ["mb-4", "", 3, "hasBorder", "rowLayout", "labelAlign"], ["id", "operatorLock_label", "body1-bold", "", 3, "title"], ["formControlName", "OperatorLock", "id", "operatorLock_toggle", 3, "onCheck", "isChecked", "disabled"]],
                    template: function (o, n) {
                        1 & o && (e.DNE(0, y, 7, 7, "ng-container", 0), e.nI1(1, "async")), 2 & o && e.Y8G("ngIf", n.prodcfg.supportsFWADevice && e.bMT(1, 1, n.api.isOpidMatching("STCA")) && n.api.device_capability.getVal("wifi", "networkMap", "deviceInfoDetails", "operatorLock", "visibility").isOn)
                    },
                    dependencies: [D.bT, c.qT, c.BC, c.cb, p.hO, p.v9, p.X, c.j4, c.JD, D.Jj]
                })
            }

            return i
        })();
        var V = E(1471);
        const I = i => ({isBackdropClickClose: !1, title: i, width: "426px"});

        function le(i, l) {
            if (1 & i) {
                const t = e.RV6();
                e.qex(0), e.nrm(1, "hr", 2), e.qex(2), e.j41(3, "pv-form-field", 3)(4, "label"), e.nrm(5, "pv-text", 4), e.k0s(), e.j41(6, "pv-button", 5), e.bIt("click", function () {
                    e.eBV(t);
                    const n = e.XpG();
                    return e.Njj(n.UnLockCodeMgmt())
                }), e.k0s()(), e.bVm()()
            }
            if (2 & i) {
                const t = e.XpG();
                e.R7$(3), e.Y8G("labelAlign", "top")("hasBorder", !0)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.ENTER_UNLOCK_CODE), e.R7$(), e.Y8G("title", t.constants.LOCKED)("isDisabled", t.api.device_capability.getVal("wifi", "networkMap", "deviceInfoDetails", "unlockCpe", "enterCode").isDisabled)
            }
        }

        function O(i, l) {
            if (1 & i && e.nrm(0, "pv-text", 17), 2 & i) {
                const t = e.XpG(3);
                e.Y8G("title", t.RemainingAttempts + " " + t.constants.REMAINING_ATTEMPTS)
            }
        }

        function ce(i, l) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "form", 9)(1, "pv-form-field", 10)(2, "label"), e.nrm(3, "pv-text", 11), e.k0s(), e.nrm(4, "pv-inputbox", 12), e.j41(5, "label"), e.nrm(6, "pv-text", 13), e.DNE(7, O, 1, 1, "pv-text", 14), e.k0s()(), e.j41(8, "pv-button", 15), e.bIt("click", function () {
                    e.eBV(t);
                    const n = e.XpG(2);
                    return e.Njj(n.closeUnlockCode())
                }), e.k0s(), e.j41(9, "pv-button", 16), e.bIt("click", function () {
                    e.eBV(t);
                    const n = e.XpG(2);
                    return e.Njj(n.UnlockDevice())
                }), e.k0s()()
            }
            if (2 & i) {
                const t = e.XpG(2);
                e.Y8G("formGroup", t.UnlockDeviceForm), e.R7$(), e.Y8G("hasBorder", !1)("rowLayout", !1), e.R7$(2), e.Y8G("title", t.constants.UNLOCK_CODE), e.R7$(), e.Y8G("placeholder", t.constants.ENTER_CODE)("isValidated", !0), e.R7$(2), e.Y8G("title", t.errorMsg), e.R7$(), e.Y8G("ngIf", t.RemainingAttempts < 5), e.R7$(), e.Y8G("title", t.constants.CANCEL), e.R7$(), e.Y8G("webSave", t.showSaveIcon)("title", t.constants.ENTER_CODE)("isDisabled", !t.UnlockDeviceForm.valid)("showButtonLoader", t.UnlockInProgress)
            }
        }

        function B(i, l) {
            if (1 & i) {
                const t = e.RV6();
                e.qex(0), e.j41(1, "pv-form-field", 10)(2, "label"), e.nrm(3, "pv-text", 18), e.k0s()(), e.j41(4, "pv-button", 19), e.bIt("click", function () {
                    e.eBV(t);
                    const n = e.XpG(2);
                    return e.Njj(n.showUnlockCode = !1)
                }), e.k0s(), e.bVm()
            }
            if (2 & i) {
                const t = e.XpG(2);
                e.R7$(), e.Y8G("hasBorder", !1)("rowLayout", !1), e.R7$(2), e.Y8G("title", t.constants.UNLOCK_ERROR + " " + t.WaitTimerInMinutes + " " + t.constants.MINUTES), e.R7$(), e.Y8G("title", t.constants.CLOSE)
            }
        }

        function de(i, l) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-dialog", 6), e.bIt("closeDialog", function () {
                    e.eBV(t);
                    const n = e.XpG();
                    return e.Njj(n.closeUnlockCode())
                }), e.qex(1, 7), e.DNE(2, ce, 10, 13, "form", 8)(3, B, 5, 4, "ng-container", 0), e.bVm(), e.k0s()
            }
            if (2 & i) {
                const t = e.XpG();
                e.Y8G("dialogConfig", e.eq3(3, I, t.constants.ENTER_UNLOCK_CODE)), e.R7$(2), e.Y8G("ngIf", t.ConsecutiveWrongCodeInputCounter < 5), e.R7$(), e.Y8G("ngIf", 5 == t.ConsecutiveWrongCodeInputCounter)
            }
        }

        let pe = (() => {
            class i {
                constructor(t, o, n, d, f, N, g) {
                    this.api = t, this.constants = o, this.pureViewSnackbarService = n, this.alertUtil = d, this.pubSubService = f, this.formBuilder = N, this.prodcfg = g, this.UnlockInProgress = !1, this.EnableDeviceUnlock = !1, this.UnlockStatus = "Locked", this.errorMsg = "", this.InputUnlockCodeHash = "", this.ConsecutiveWrongCodeInputCounter = 0, this.WaitTimerOnNextUnlockTry = 0, this.handleGetLockStatus = {
                        onSuccess: v => {
                            0 == v.data.result ? (this.EnableDeviceUnlock = v.data.FunctionResult.EnableDeviceUnlock, this.UnlockStatus = v.data.FunctionResult.UnlockStatus, this.ConsecutiveWrongCodeInputCounter = v.data.FunctionResult.ConsecutiveWrongCodeInputCounter, this.RemainingAttempts = 5 - this.ConsecutiveWrongCodeInputCounter, this.WaitTimerOnNextUnlockTry = v.data.FunctionResult.WaitTimerOnNextUnlockTry, this.WaitTimerInMinutes = Math.round(this.WaitTimerOnNextUnlockTry / 60)) : console.error("Error:", v.data.reason)
                        }, onError: v => {
                            this.api.requestTimeoutSnackbar(), console.error("Error:", v)
                        }
                    }, this.handleUnlockDevice = {
                        onSuccess: v => {
                            this.UnlockInProgress = !1, 0 == v.data.result ? (window.setTimeout(() => {
                                this.api.requestSuccessSnackbar()
                            }, 1600), this.showSaveIcon = !0, this.closeUnlockCode()) : 5 == this.ConsecutiveWrongCodeInputCounter ? (this.UnlockDialogTitle = this.constants.UNLOCK_ERROR, this.showUnlockCode = !0) : (this.showUnlockCode = !0, this.showSaveIcon = !1, this.UnlockDeviceForm.reset(), this.errorMsg = this.constants.WRONG_CODE, this.api.unknownErrorSnackbar()), this.getLockStatus()
                        }, onError: v => {
                            this.showUnlockCode = !0, this.showSaveIcon = !1, this.api.requestTimeoutSnackbar(), console.error("Error:", v), this.getLockStatus()
                        }
                    }, this.UnlockDeviceForm = this.formBuilder.nonNullable.group({UnlockCode: ["", [c.k0.required]]})
                }

                ngOnInit() {
                    this.getLockStatus()
                }

                ngOnDestroy() {
                    this.pureViewSnackbarService.hideMessageSnackbar()
                }

                get UnlockForm() {
                    return this.UnlockDeviceForm.controls
                }

                UnLockCodeMgmt() {
                    this.getLockStatus(), this.UnlockDeviceForm.reset(), this.showUnlockCode = !0
                }

                getLockStatus() {
                    this.api.createBody("GetLockStatus"), this.api.request(this.handleGetLockStatus, "callUBUS")
                }

                UnlockDevice() {
                    this.showSaveIcon || (this.showSaveIcon = !0, this.InputUnlockCodeHash = V.SHA256(this.UnlockDeviceForm.get("UnlockCode").value.trim()).toString(V.enc.Hex), this.api.createBody("UnlockDevice", `[{"InputUnlockCodeHash":"${this.InputUnlockCodeHash}"}]`), this.api.request(this.handleUnlockDevice, "callUBUS"), this.UnlockInProgress = !0)
                }

                closeUnlockCode() {
                    this.errorMsg = "", this.UnlockDeviceForm.reset(), this.showUnlockCode = !1
                }

                static #e = this.\u0275fac = function (o) {
                    return new (o || i)(e.rXU(k.G), e.rXU(T.YM), e.rXU(p.gd), e.rXU(R.l), e.rXU(U.Q), e.rXU(c.ok), e.rXU(A.Z))
                };
                static #t = this.\u0275cmp = e.VBU({
                    type: i,
                    selectors: [["app-unlock-cpe"]],
                    decls: 2,
                    vars: 2,
                    consts: [[4, "ngIf"], [3, "dialogConfig", "closeDialog", 4, "ngIf"], [1, "hr-separator"], ["mb-4", "", 3, "labelAlign", "hasBorder", "rowLayout"], ["body1-bold", "", 3, "title"], ["outline", "button-lightBlue", "id", "unlock-code", "size", "medium", 3, "click", "title", "isDisabled"], [3, "closeDialog", "dialogConfig"], ["pvModelContent", ""], ["autocomplete", "off", 3, "formGroup", 4, "ngIf"], ["autocomplete", "off", 3, "formGroup"], [3, "hasBorder", "rowLayout"], ["id", "lblUnlockCode", 3, "title"], ["password", "", "required", "", "size", "MEDIUM", "formControlName", "UnlockCode", "id", "textUnlockCode", 3, "placeholder", "isValidated"], ["id", "UnlockCodeErrorMsg", 1, "error-msg", 3, "title"], ["class", "error-msg", "id", "UnlockCodeAttempts", 3, "title", 4, "ngIf"], ["outline", "primary", "size", "large", 3, "click", "title"], ["id", "btnUnlockCode", "mt-2", "", "type", "submit", 3, "click", "webSave", "title", "isDisabled", "showButtonLoader"], ["id", "UnlockCodeAttempts", 1, "error-msg", 3, "title"], ["id", "UnlockErrorMsg", 3, "title"], ["id", "btnUnlockBlock", "size", "small", 3, "click", "title"]],
                    template: function (o, n) {
                        1 & o && e.DNE(0, le, 7, 6, "ng-container", 0)(1, de, 4, 5, "pv-dialog", 1), 2 & o && (e.Y8G("ngIf", n.prodcfg.supportsFWADevice && n.api.device_capability.getVal("wifi", "networkMap", "deviceInfoDetails", "unlockCpe", "visibility").isOn && n.EnableDeviceUnlock && "Locked" === n.UnlockStatus), e.R7$(), e.Y8G("ngIf", n.showUnlockCode))
                    },
                    dependencies: [D.bT, c.qT, c.BC, c.cb, c.YS, p.Sp, p.XL, p.v9, p.X, p.H9, c.j4, c.JD],
                    styles: [".error-msg[_ngcontent-%COMP%]{color:var(--pure-color-red-600)}"]
                })
            }

            return i
        })();
        const he = ["bridgeModeToggle"],
            ue = (i, l) => ({isBackdropClickClose: !1, title: i, caption: l, width: "426px"});

        function ge(i, l) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-vector", 19), e.bIt("click", function () {
                    e.eBV(t);
                    const n = e.XpG();
                    return e.Njj(n.editFriendlyNameClick(n.selectedExtender))
                }), e.k0s()
            }
        }

        function me(i, l) {
            if (1 & i && e.nrm(0, "pv-text", 24), 2 & i) {
                const t = e.XpG(2);
                e.Y8G("title", t.getNodeText(null == t.selectedExtender ? null : t.selectedExtender.nodeSubText))
            }
        }

        function fe(i, l) {
            if (1 & i && (e.j41(0, "pv-card", 20), e.nrm(1, "pv-vector", 21), e.j41(2, "span"), e.nrm(3, "pv-text", 22), e.DNE(4, me, 1, 1, "pv-text", 23), e.k0s()()), 2 & i) {
                const t = e.XpG();
                e.R7$(), e.Y8G("name", t.isOnline && t.isConnectionOK ? t.deviceModel.includes("yellow") ? "signal_indicators_circle_poor" : "signal_indicators_circle_good" : "signal_indicators_circle_bad"), e.R7$(2), e.Y8G("title", t.isOnline && t.isConnectionOK ? t.constants.CONNECTED_LABEL : t.constants.NOT_CONNECTED_LABEL), e.R7$(), e.Y8G("ngIf", (null == t.selectedExtender ? null : t.selectedExtender.nodeSubText) && t.isOnline)
            }
        }

        function ve(i, l) {
            if (1 & i && (e.j41(0, "pv-card"), e.nrm(1, "pv-list", 25)(2, "pv-list", 26), e.k0s()), 2 & i) {
                const t = e.XpG();
                e.R7$(), e.Y8G("subtext", t.constants.CONNECTED_TO)("captionBold1", t.deviceDetails.connectedTo), e.R7$(), e.Y8G("subtext", t.constants.CONNECTION)("captionBold1", t.constants.WIRELESS_2_4GHZ)
            }
        }

        function be(i, l) {
            if (1 & i && e.nrm(0, "pv-text", 30), 2 & i) {
                const t = e.XpG(2);
                e.Y8G("title", t.constants.CONNECTION)
            }
        }

        function Ee(i, l) {
            if (1 & i && e.nrm(0, "pv-list", 34), 2 & i) {
                const t = e.XpG(2).$implicit, o = e.XpG(2);
                e.Y8G("isTitleBody1Bold", !0)("title", o.getBandName(t))
            }
        }

        function ke(i, l) {
            if (1 & i && (e.j41(0, "div", 32), e.DNE(1, Ee, 1, 2, "pv-list", 33), e.k0s()), 2 & i) {
                const t = e.XpG().$implicit;
                e.R7$(), e.Y8G("ngIf", t)
            }
        }

        function Se(i, l) {
            if (1 & i && (e.qex(0), e.DNE(1, ke, 2, 1, "div", 31), e.bVm()), 2 & i) {
                const t = e.XpG(2);
                e.R7$(), e.Y8G("ngIf", t.selectedExtender.connectedBand.length)
            }
        }

        function Ne(i, l) {
            if (1 & i && (e.j41(0, "pv-card", 27), e.nrm(1, "pv-list", 25), e.DNE(2, be, 1, 1, "pv-text", 28)(3, Se, 2, 1, "ng-container", 29), e.k0s()), 2 & i) {
                const t = e.XpG();
                e.R7$(), e.Y8G("subtext", t.constants.CONNECTED_TO)("captionBold1", null == t.selectedExtender ? null : t.selectedExtender.connectedtofriendlyName), e.R7$(), e.Y8G("ngIf", t.selectedExtender.connectedBand.length), e.R7$(), e.Y8G("ngForOf", t.selectedExtender.connectedBand)
            }
        }

        function Ce(i, l) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-form-field", 38)(1, "label"), e.nrm(2, "pv-text", 22)(3, "pv-text", 39), e.k0s(), e.j41(4, "pv-toggle", 40), e.bIt("onCheck", function () {
                    e.eBV(t);
                    const n = e.XpG(2);
                    return e.Njj(n.onToggleClick(null == n.selectedExtender ? null : n.selectedExtender.MACAddress, "status"))
                }), e.k0s()()
            }
            if (2 & i) {
                const t = e.XpG(2);
                e.Y8G("hasBorder", !0)("rowLayout", !0)("labelAlign", "top"), e.R7$(2), e.Y8G("title", t.showSignalLed ? t.constants.STATUS_LED_LIGHT : t.constants.LED_LIGHT), e.R7$(), e.Y8G("title", t.constants.CONTROL_LED_DESC), e.R7$(), e.Y8G("isChecked", !!t.statusledOnOff.value)("disabled", t.api.device_capability.getVal("wifi", "networkMap", "deviceInfoDetails", "ledStatus").isDisabled)
            }
        }

        function we(i, l) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-form-field", 38)(1, "label"), e.nrm(2, "pv-text", 22)(3, "pv-text", 39), e.k0s(), e.j41(4, "pv-toggle", 41), e.bIt("onCheck", function () {
                    e.eBV(t);
                    const n = e.XpG(2);
                    return e.Njj(n.onToggleClick(null == n.selectedExtender ? null : n.selectedExtender.MACAddress, "signal"))
                }), e.k0s()()
            }
            if (2 & i) {
                const t = e.XpG(2);
                e.Y8G("hasBorder", !0)("rowLayout", !0)("labelAlign", "top"), e.R7$(2), e.Y8G("title", t.constants.SIGNAL_LED_LIGHT), e.R7$(), e.Y8G("title", t.constants.CONTROL_SIGNAL_LED_DESC), e.R7$(), e.Y8G("isChecked", !!t.signalledOnOff.value)("disabled", t.api.device_capability.getVal("wifi", "networkMap", "deviceInfoDetails", "signalLedStatus").isDisabled)
            }
        }

        function Me(i, l) {
            1 & i && e.nrm(0, "div", 48)
        }

        function De(i, l) {
            1 & i && e.nrm(0, "div", 49)
        }

        function Te(i, l) {
            if (1 & i) {
                const t = e.RV6();
                e.qex(0), e.j41(1, "pv-form-field", 42)(2, "label"), e.nrm(3, "pv-text", 43), e.k0s(), e.j41(4, "pv-toggle", 44, 1), e.bIt("onCheck", function () {
                    e.eBV(t);
                    const n = e.XpG(2);
                    return e.Njj(n.onEnableBridgeMode())
                }), e.k0s()(), e.nrm(6, "pv-text", 45), e.DNE(7, Me, 1, 0, "div", 46)(8, De, 1, 0, "div", 47), e.bVm()
            }
            if (2 & i) {
                const t = e.XpG(2);
                e.R7$(), e.Y8G("hasBorder", !1)("rowLayout", !0), e.R7$(2), e.Y8G("title", t.constants.ENABLE_BRIDGE_MODE), e.R7$(), e.Y8G("isChecked", !!t.bridgeMode.value)("disabled", t.api.device_capability.getVal("wifi", "networkMap", "deviceInfoDetails", "enableBridgeMode").isDisabled), e.R7$(2), e.Y8G("title", t.constants.ENABLING_BRIDGE_MODE), e.R7$(), e.Y8G("ngIf
                ",t.showEnableRRM),e.R7$(),e.Y8G("
                ngIf
                ",t.showEnableRRM)}}function Ie(i,l){if(1&i){const t=e.RV6();e.qex(0),e.j41(1,"
                pv - form - field
                ",42)(2,"
                label
                "),e.nrm(3,"
                pv - text
                ",43),e.k0s(),e.j41(4,"
                pv - toggle
                ",50),e.bIt("
                onCheck
                ",function(){e.eBV(t);const n=e.XpG(2);return e.Njj(n.onRRMToggleClick(n.enableRRM.value))}),e.k0s()(),e.bVm()}if(2&i){const t=e.XpG(2);e.R7$(),e.Y8G("
                hasBorder
                ",!0)("
                rowLayout
                ",!0),e.R7$(2),e.Y8G("
                title
                ",t.constants.ENABLE_ENHANCED_ROAMING),e.R7$(),e.Y8G("
                isChecked
                ",!!t.enableRRM.value)}}function Ge(i,l){if(1&i){const t=e.RV6();e.qex(0),e.j41(1,"
                pv - form - field
                ",51)(2,"
                label
                "),e.nrm(3,"
                pv - text
                ",43),e.k0s(),e.j41(4,"
                pv - toggle
                ",52),e.bIt("
                onCheck
                ",function(){e.eBV(t);const n=e.XpG(2);return e.Njj(n.onPOEToggleClick(n.enablePOE.value))}),e.k0s()(),e.bVm()}if(2&i){const t=e.XpG(2);e.R7$(),e.Y8G("
                hasBorder
                ",!0)("
                rowLayout
                ",!0),e.R7$(2),e.Y8G("
                title
                ",t.constants.ENABLE_POE),e.R7$(),e.Y8G("
                isChecked
                ",!!t.enablePOE.value)("
                isDisabled
                ",t.api.device_capability.getVal("
                wifi
                ","
                networkMap
                ","
                deviceInfoDetails
                ","
                poeStatus
                ").isDisabled)}}function Re(i,l){1&i&&e.nrm(0,"
                app - bluetooth
                ")}function Ae(i,l){1&i&&e.nrm(0,"
                app - usim - enable
                ")}function Oe(i,l){1&i&&e.nrm(0,"
                app - operator - lock
                ")}function Be(i,l){1&i&&e.nrm(0,"
                app - stc - sim - management
                ")}function Le(i,l){1&i&&e.nrm(0,"
                app - unlock - cpe
                ")}function xe(i,l){if(1&i&&(e.qex(0),e.nrm(1,"
                app - wan - access - mode
                ")(2,"
                app - sim - lock - management
                "),e.DNE(3,Re,1,0,"
                app - bluetooth
                ",14),e.nrm(4,"
                app - block - data - traffic
                "),e.DNE(5,Ae,1,0,"
                app - usim - enable
                ",14),e.nI1(6,"
                async
                "),e.DNE(7,Oe,1,0,"
                app - operator - lock
                ",14),e.nI1(8,"
                async
                "),e.DNE(9,Be,1,0,"
                app - stc - sim - management
                ",14),e.nI1(10,"
                async
                "),e.DNE(11,Le,1,0,"
                app - unlock - cpe
                ",14),e.nI1(12,"
                async
                "),e.bVm()),2&i){const t=e.XpG(2);e.R7$(3),e.Y8G("
                ngIf
                ",t.prodcfg.isFWAReceiver),e.R7$(2),e.Y8G("
                ngIf
                ",e.bMT(6,5,t.api.isOpidMatching("
                ZAIN
                "))),e.R7$(2),e.Y8G("
                ngIf
                ",e.bMT(8,7,t.api.isOpidMatching("
                STCA
                "))),e.R7$(2),e.Y8G("
                ngIf
                ",e.bMT(10,9,t.api.isOpidMatching("
                STCA
                "))),e.R7$(2),e.Y8G("
                ngIf
                ",e.bMT(12,11,t.api.isOpidMatching("
                ZAIN
                ")))}}function ye(i,l){if(1&i&&(e.j41(0,"
                pv - card
                ")(1,"
                form
                ",35,0),e.nrm(3,"
                pv - text
                ",36),e.qex(4),e.DNE(5,Ce,5,7,"
                pv - form - field
                ",37),e.bVm(),e.qex(6),e.DNE(7,we,5,7,"
                pv - form - field
                ",37),e.bVm(),e.DNE(8,Te,9,8,"
                ng - container
                ",14)(9,Ie,5,4,"
                ng - container
                ",14)(10,Ge,5,5,"
                ng - container
                ",14),e.k0s(),e.DNE(11,xe,13,13,"
                ng - container
                ",14),e.k0s()),2&i){const t=e.XpG();e.R7$(),e.Y8G("
                formGroup
                ",t.deviceDetailsForm),e.R7$(2),e.Y8G("
                title
                ",t.constants.ADVANCED_SETTINGS),e.R7$(2),e.Y8G("
                ngIf
                ",(!t.prodcfg.supportsFWADevice&&((null==t.selectedExtender||null==t.selectedExtender.MACAddress?null:t.selectedExtender.MACAddress.length)||t.ledAvailable)&&t.isOnline||t.prodcfg.supportsFWADevice&&t.isRoot)&&t.api.device_capability.getVal("
                wifi
                ","
                networkMap
                ","
                deviceInfoDetails
                ","
                ledStatus
                ").isOn),e.R7$(2),e.Y8G("
                ngIf
                ",t.showSignalLed&&t.isRoot&&t.api.device_capability.getVal("
                wifi
                ","
                networkMap
                ","
                deviceInfoDetails
                ","
                signalLedStatus
                ").isOn),e.R7$(),e.Y8G("
                ngIf
                ",t.showBridgeModeCard&&!t.prodcfg.supportsFWADevice&&t.isRoot),e.R7$(),e.Y8G("
                ngIf
                ",t.showEnableRRM&&t.isRoot),e.R7$(),e.Y8G("
                ngIf
                ",t.isPOESupported&&t.api.device_capability.getVal("
                wifi
                ","
                networkMap
                ","
                deviceInfoDetails
                ","
                poeStatus
                ").isOn),e.R7$(),e.Y8G("
                ngIf
                ",t.prodcfg.supportsFWADevice)}}function Ue(i,l){if(1&i){const t=e.RV6();e.j41(0,"
                pv - form - field
                ",54)(1,"
                label
                "),e.nrm(2,"
                pv - text
                ",22)(3,"
                pv - text
                ",55),e.k0s(),e.j41(4,"
                pv - button
                ",56),e.bIt("
                click
                ",function(){e.eBV(t);const n=e.XpG(2);return e.Njj(n.reboot())}),e.k0s()()}if(2&i){const t=e.XpG(2);e.Y8G("
                labelAlign
                ","
                top
                ")("
                hasBorder
                ",!0)("
                rowLayout
                ",!0),e.R7$(2),e.Y8G("
                title
                ",t.constants.REBOOT),e.R7$(),e.Y8G("
                title
                ",t.constants.REBOOT_DESC),e.R7$(),e.Y8G("
                title
                ",t.constants.REBOOT)("
                isDisabled
                ",t.isCFGMode||t.api.device_capability.getVal("
                wifi
                ","
                networkMap
                ","
                deviceInfoDetails
                ","
                rebootButton
                ").isDisabled)}}function Pe(i,l){if(1&i){const t=e.RV6();e.j41(0,"
                pv - form - field
                ",54)(1,"
                label
                "),e.nrm(2,"
                pv - text
                ",22)(3,"
                pv - text
                ",55),e.k0s(),e.j41(4,"
                pv - button
                ",57),e.bIt("
                click
                ",function(){e.eBV(t);const n=e.XpG(2);return e.Njj(n.doFactoryDefault())}),e.k0s()()}if(2&i){const t=e.XpG(2);e.Y8G("
                labelAlign
                ","
                top
                ")("
                hasBorder
                ",!0)("
                rowLayout
                ",!0),e.R7$(2),e.Y8G("
                title
                ",t.constants.FACTORY_DEFAULT),e.R7$(),e.Y8G("
                title
                ",t.constants.FACTORY_DEFAULT_DESC),e.R7$(),e.Y8G("
                title
                ",t.constants.RESET)("
                isDisabled
                ",t.isBtnDisabled||t.api.device_capability.getVal("
                wifi
                ","
                networkMap
                ","
                deviceInfoDetails
                ","
                factoryDefaultButton
                ").isDisabled)}}function Fe(i,l){if(1&i){const t=e.RV6();e.j41(0,"
                pv - form - field
                ",54)(1,"
                label
                "),e.nrm(2,"
                pv - text
                ",22)(3,"
                pv - text
                ",55),e.k0s(),e.j41(4,"
                pv - button
                ",57),e.bIt("
                click
                ",function(){e.eBV(t);const n=e.XpG(2);return e.Njj(n.doDeepFactoryReset())}),e.k0s()()}if(2&i){const t=e.XpG(2);e.Y8G("
                labelAlign
                ","
                top
                ")("
                hasBorder
                ",!0)("
                rowLayout
                ",!0),e.R7$(2),e.Y8G("
                title
                ",t.constants.DEEP_FACTORY_RESET),e.R7$(),e.Y8G("
                title
                ",t.constants.DEEP_FACTORY_RESET_DESC),e.R7$(),e.Y8G("
                title
                ",t.constants.RESET)("
                isDisabled
                ",t.isBtnDisabled||t.api.device_capability.getVal("
                wifi
                ","
                networkMap
                ","
                deviceInfoDetails
                ","
                deepFactoryReset
                ").isDisabled)}}function Ve(i,l){if(1&i&&(e.j41(0,"
                form
                ",35,0)(2,"
                pv - card
                "),e.nrm(3,"
                pv - text
                ",36),e.DNE(4,Ue,5,7,"
                pv - form - field
                ",53)(5,Pe,5,7,"
                pv - form - field
                ",53)(6,Fe,5,7,"
                pv - form - field
                ",53),e.k0s()()),2&i){const t=e.XpG();e.Y8G("
                formGroup
                ",t.deviceDetailsForm),e.R7$(3),e.Y8G("
                title
                ",t.constants.MAINTENANCE),e.R7$(),e.Y8G("
                ngIf
                ",t.isRoot&&t.api.device_capability.getVal("
                wifi
                ","
                networkMap
                ","
                deviceInfoDetails
                ","
                rebootButton
                ").isOn),e.R7$(),e.Y8G("
                ngIf
                ",t.isRoot&&t.api.device_capability.getVal("
                wifi
                ","
                networkMap
                ","
                deviceInfoDetails
                ","
                factoryDefaultButton
                ").isOn),e.R7$(),e.Y8G("
                ngIf
                ",t.isRoot&&!t.deepFacNotSupported&&t.api.device_capability.getVal("
                wifi
                ","
                networkMap
                ","
                deviceInfoDetails
                ","
                deepFactoryReset
                ").isOn)}}function Ye(i,l){if(1&i){const t=e.RV6();e.j41(0,"
                pv - button
                ",59),e.bIt("
                click
                ",function(){e.eBV(t);const n=e.XpG(2);return e.Njj("
                0
                "==n.isOnline?n.confirmRemoveAP():n.removeAP())}),e.k0s()}if(2&i){const t=e.XpG(2);e.Y8G("
                bgColor
                ","
                caution
                ")("
                outline
                ",!1)("
                title
                ",t.constants.REMOVE)("
                isDisabled
                ",t.api.device_capability.getVal("
                wifi
                ","
                networkMap
                ","
                deviceInfoDetails
                ","
                removeAPButton
                ").isDisabled)}}function $e(i,l){if(1&i&&(e.j41(0,"
                pv - card
                ")(1,"
                pv - form - field
                ",42)(2,"
                label
                "),e.nrm(3,"
                pv - text
                ",22),e.k0s(),e.DNE(4,Ye,1,4,"
                pv - button
                ",58),e.k0s(),e.nrm(5,"
                pv - text
                ",45),e.k0s()),2&i){const t=e.XpG();e.R7$(),e.Y8G("
                hasBorder
                ",!1)("
                rowLayout
                ",!0),e.R7$(2),e.Y8G("
                title
                ",t.constants.REMOVE),e.R7$(),e.Y8G("
                ngIf
                ",t.api.device_capability.getVal("
                wifi
                ","
                networkMap
                ","
                deviceInfoDetails
                ","
                removeAPButton
                ").isOn),e.R7$(),e.Y8G("
                title
                ",t.constants.REMOVE_AP_TEXT)}}function We(i,l){if(1&i&&(e.j41(0,"
                pv - card
                "),e.nrm(1,"
                pv - list
                ",60)(2,"
                pv - list
                ",60),e.k0s()),2&i){const t=e.XpG();e.R7$(),e.Y8G("
                isToggleEnable
                ",!0)("
                toggleDisable
                ",!t.deviceDetails.enableBridgeMode)("
                caption
                ",t.constants.ENABLE_BRIDGE_MODE),e.R7$(),e.Y8G("
                isToggleEnable
                ",!0)("
                toggleDisable
                ",!t.deviceDetails.enableBridgeMode)("
                caption
                ",t.constants.ENABLE_ENHANCED_ROAMING)}}function Xe(i,l){if(1&i&&e.nrm(0,"
                pv - list
                ",63),2&i){const t=e.XpG(2);e.Y8G("
                isTitleBody1Bold
                ",!0)("
                title
                ",t.api.get_device_info.ModelName)("
                subtextUp
                ",t.constants.DEVICE_NAME)}}function je(i,l){if(1&i&&e.nrm(0,"
                pv - list
                ",63),2&i){const t=e.XpG(2);e.Y8G("
                isTitleBody1Bold
                ",!0)("
                title
                ",t.api.get_device_info.SerialNumber)("
                subtextUp
                ",t.constants.SERIAL_NUMBER)}}function He(i,l){if(1&i&&e.nrm(0,"
                pv - list
                ",63),2&i){const t=e.XpG(3);e.Y8G("
                isTitleBody1Bold
                ",!0)("
                title
                ",t.prodcfg.nonWifiBoards?null==t.selectedExtender?null:t.selectedExtender.MACAddress:t.api.network_tpl_status.ntwtopo_cfg[0].MACAddress)("
                subtextUp
                ",t.constants.MAC_ADDRESS)}}function qe(i,l){if(1&i&&e.nrm(0,"
                pv - list
                ",63),2&i){const t=e.XpG(3);e.Y8G("
                isTitleBody1Bold
                ",!0)("
                title
                ",t.api.network_tpl_status.ntwtopo_cfg[0].IPAddress)("
                subtextUp
                ",t.constants.IP_ADDRESS)}}function Ke(i,l){if(1&i&&(e.qex(0),e.DNE(1,He,1,3,"
                pv - list
                ",62)(2,qe,1,3,"
                pv - list
                ",62),e.bVm()),2&i){const t=e.XpG(2);e.R7$(),e.Y8G("
                ngIf
                ",((null==t.api.network_tpl_status.ntwtopo_cfg[0]?null:t.api.network_tpl_status.ntwtopo_cfg[0].MACAddress)||(null==t.selectedExtender?null:t.selectedExtender.MACAddress))&&t.api.device_capability.getVal("
                wifi
                ","
                networkMap
                ","
                deviceInfoDetails
                ","
                macAddress
                ").isOn),e.R7$(),e.Y8G("
                ngIf
                ",(null==t.api.network_tpl_status.ntwtopo_cfg[0]?null:t.api.network_tpl_status.ntwtopo_cfg[0].IPAddress)&&t.api.device_capability.getVal("
                wifi
                ","
                networkMap
                ","
                deviceInfoDetails
                ","
                ipAddress
                ").isOn)}}function ze(i,l){if(1&i&&e.nrm(0,"
                pv - list
                ",63),2&i){const t=e.XpG(3);e.Y8G("
                isTitleBody1Bold
                ",!0)("
                title
                ",t.api.get_device_info.RootMacAddress)("
                subtextUp
                ",t.constants.MAC_ADDRESS)}}function Je(i,l){if(1&i&&e.nrm(0,"
                pv - list
                ",63),2&i){const t=e.XpG(3);e.Y8G("
                isTitleBody1Bold
                ",!0)("
                title
                ",t.api.get_device_info.IPAddress)("
                subtextUp
                ",t.constants.IP_ADDRESS)}}function Qe(i,l){if(1&i&&(e.qex(0),e.DNE(1,ze,1,3,"
                pv - list
                ",62)(2,Je,1,3,"
                pv - list
                ",62),e.bVm()),2&i){const t=e.XpG(2);e.R7$(),e.Y8G("
                ngIf
                ",t.api.device_capability.getVal("
                wifi
                ","
                networkMap
                ","
                deviceInfoDetails
                ","
                macAddress
                ").isOn&&t.api.get_device_info.RootMacAddress),e.R7$(),e.Y8G("
                ngIf
                ",t.api.device_capability.getVal("
                wifi
                ","
                networkMap
                ","
                deviceInfoDetails
                ","
                ipAddress
                ").isOn&&t.api.get_device_info.IPAddress)}}function Ze(i,l){if(1&i&&e.nrm(0,"
                pv - list
                ",63),2&i){const t=e.XpG(2);e.Y8G("
                isTitleBody1Bold
                ",!0)("
                title
                ",t.softwareVersion)("
                subtextUp
                ",t.constants.SOFTWARE_VERSION)}}function et(i,l){if(1&i&&e.nrm(0,"
                pv - list
                ",63),2&i){const t=e.XpG(2);e.Y8G("
                isTitleBody1Bold
                ",!0)("
                title
                ",t.api.get_device_info.HardwareVersion)("
                subtextUp
                ",t.constants.HARDWARE_VERSION)}}function tt(i,l){if(1&i&&e.nrm(0,"
                pv - list
                ",63),2&i){const t=e.XpG(2);e.Y8G("
                isTitleBody1Bold
                ",!0)("
                title
                ",t.api.get_device_info.AdditionalSoftwareVersion)("
                subtextUp
                ",t.constants.BOOT_VERSION)}}function it(i,l){if(1&i&&e.nrm(0,"
                pv - list
                ",63),2&i){const t=e.XpG(2);e.Y8G("
                isTitleBody1Bold
                ",!0)("
                title
                ",t.runTime)("
                subtextUp
                ",t.constants.RUNNING_TIME)}}function st(i,l){if(1&i&&e.nrm(0,"
                pv - list
                ",63),2&i){const t=e.XpG(2);e.Y8G("
                isTitleBody1Bold
                ",!0)("
                title
                ",t.api.get_device_info.X_ASB_COM_Chipset)("
                subtextUp
                ",t.constants.CHIPSET)}}function nt(i,l){if(1&i&&e.nrm(0,"
                pv - list
                ",63),2&i){const t=e.XpG(2);e.Y8G("
                isTitleBody1Bold
                ",!0)("
                title
                ",t.cpuUsage)("
                subtextUp
                ",t.constants.CPU_USAGE)}}function ot(i,l){if(1&i&&e.nrm(0,"
                pv - list
                ",63),2&i){const t=e.XpG(2);e.Y8G("
                isTitleBody1Bold
                ",!0)("
                title
                ",t.memoryUsage)("
                subtextUp
                ",t.constants.MEMORY_USAGE)}}function at(i,l){if(1&i&&e.nrm(0,"
                pv - list
                ",63),2&i){const t=e.XpG(2);e.Y8G("
                isTitleBody1Bold
                ",!0)("
                title
                ",t.api.get_device_info.Vendor)("
                subtextUp
                ",t.constants.VENDOR)}}function rt(i,l){if(1&i&&(e.j41(0,"
                pv - card
                "),e.nrm(1,"
                pv - text
                ",61),e.DNE(2,Xe,1,3,"
                pv - list
                ",62)(3,je,1,3,"
                pv - list
                ",62)(4,Ke,3,2,"
                ng - container
                ",14)(5,Qe,3,2,"
                ng - container
                ",14)(6,Ze,1,3,"
                pv - list
                ",62)(7,et,1,3,"
                pv - list
                ",62)(8,tt,1,3,"
                pv - list
                ",62)(9,it,1,3,"
                pv - list
                ",62)(10,st,1,3,"
                pv - list
                ",62)(11,nt,1,3,"
                pv - list
                ",62)(12,ot,1,3,"
                pv - list
                ",62)(13,at,1,3,"
                pv - list
                ",62),e.k0s()),2&i){const t=e.XpG();e.R7$(),e.Y8G("
                title
                ",("
                1
                "==t.selectedExtender.isRoot&&!t.api.isSFUDevice&&t.extenderConnected?t.constants.ROOT_LABEL+" - ":"
                ")+t.getRootName()+"
                "+t.constants.DETAILS_SMALL),e.R7$(),e.Y8G("
                ngIf
                ",t.api.device_capability.getVal("
                wifi
                ","
                networkMap
                ","
                deviceInfoDetails
                ","
                deviceName
                ").isOn),e.R7$(),e.Y8G("
                ngIf
                ",t.api.device_capability.getVal("
                wifi
                ","
                networkMap
                ","
                deviceInfoDetails
                ","
                serialNumber
                ").isOn),e.R7$(),e.Y8G("
                ngIf
                ",!t.prodcfg.supportsFWADevice),e.R7$(),e.Y8G("
                ngIf
                ",t.prodcfg.supportsFWADevice),e.R7$(),e.Y8G("
                ngIf
                ",t.api.device_capability.getVal("
                wifi
                ","
                networkMap
                ","
                deviceInfoDetails
                ","
                softwareVersion
                ").isOn),e.R7$(),e.Y8G("
                ngIf
                ",t.api.device_capability.getVal("
                wifi
                ","
                networkMap
                ","
                deviceInfoDetails
                ","
                hardwareVersion
                ").isOn),e.R7$(),e.Y8G("
                ngIf
                ",t.api.device_capability.getVal("
                wifi
                ","
                networkMap
                ","
                deviceInfoDetails
                ","
                bootVersion
                ").isOn),e.R7$(),e.Y8G("
                ngIf
                ",t.api.device_capability.getVal("
                wifi
                ","
                networkMap
                ","
                deviceInfoDetails
                ","
                runningTime
                ").isOn),e.R7$(),e.Y8G("
                ngIf
                ",t.api.device_capability.getVal("
                wifi
                ","
                networkMap
                ","
                deviceInfoDetails
                ","
                chipset
                ").isOn),e.R7$(),e.Y8G("
                ngIf
                ",t.api.device_capability.getVal("
                wifi
                ","
                networkMap
                ","
                deviceInfoDetails
                ","
                cpuUsage
                ").isOn),e.R7$(),e.Y8G("
                ngIf
                ",t.api.device_capability.getVal("
                wifi
                ","
                networkMap
                ","
                deviceInfoDetails
                ","
                memoryUsage
                ").isOn),e.R7$(),e.Y8G("
                ngIf
                ",t.api.device_capability.getVal("
                wifi
                ","
                networkMap
                ","
                deviceInfoDetails
                ","
                vendor
                ").isOn)}}function lt(i,l){if(1&i&&e.nrm(0,"
                pv - list
                ",63),2&i){const t=e.XpG(2);e.Y8G("
                isTitleBody1Bold
                ",!0)("
                title
                ",t.selectedExtender.HostName)("
                subtextUp
                ",t.constants.DEVICE_NAME)}}function ct(i,l){if(1&i&&e.nrm(0,"
                pv - list
                ",63),2&i){const t=e.XpG(2);e.Y8G("
                isTitleBody1Bold
                ",!0)("
                title
                ",null==t.selectedExtender?null:t.selectedExtender.SerialNumber)("
                subtextUp
                ",t.constants.SERIAL_NUMBER)}}function _t(i,l){if(1&i&&e.nrm(0,"
                pv - list
                ",63),2&i){const t=e.XpG(2);e.Y8G("
                isTitleBody1Bold
                ",!0)("
                title
                ",t.getOnboardStatusName(null==t.selectedExtender?null:t.selectedExtender.OnboardStatus))("
                subtextUp
                ",t.constants.ONBOARDING_STATUS)}}function dt(i,l){if(1&i&&e.nrm(0,"
                pv - list
                ",63),2&i){const t=e.XpG(2);e.Y8G("
                isTitleBody1Bold
                ",!0)("
                title
                ",t.getBackhualstatusName((null==t.selectedExtender||null==t.selectedExtender.BackhaulStatus?null:t.selectedExtender.BackhaulStatus.charAt(0).toUpperCase())+(null==t.selectedExtender||null==t.selectedExtender.BackhaulStatus?null:t.selectedExtender.BackhaulStatus.substr(1).toLowerCase())))("
                subtextUp
                ",t.constants.BACKHAUL_STATUS)}}function pt(i,l){if(1&i&&e.nrm(0,"
                pv - list
                ",63),2&i){const t=e.XpG(2);e.Y8G("
                isTitleBody1Bold
                ",!0)("
                title
                ",null==t.selectedExtender?null:t.selectedExtender.MACAddress)("
                subtextUp
                ",t.constants.MAC_ADDRESS)}}function ht(i,l){if(1&i&&e.nrm(0,"
                pv - list
                ",63),2&i){const t=e.XpG(2);e.Y8G("
                isTitleBody1Bold
                ",!0)("
                title
                ",null==t.selectedExtender?null:t.selectedExtender.IPAddress)("
                subtextUp
                ",t.constants.IP_ADDRESS)}}function ut(i,l){if(1&i&&(e.j41(0,"
                pv - card
                "),e.nrm(1,"
                pv - text
                ",61),e.DNE(2,lt,1,3,"
                pv - list
                ",62)(3,ct,1,3,"
                pv - list
                ",62)(4,_t,1,3,"
                pv - list
                ",62)(5,dt,1,3,"
                pv - list
                ",62)(6,pt,1,3,"
                pv - list
                ",62)(7,ht,1,3,"
                pv - list
                ",62),e.k0s()),2&i){const t=e.XpG();e.R7$(),e.Y8G("
                title
                ",t.getAvailableName()?(null!=t.selectedExtender&&t.selectedExtender.HostName.includes("
                ALCL
                ")?"
                Beacon
                ":t.getAvailableName())+"
                "+t.constants.DETAILS_SMALL:"
                Beacon0
                "+t.constants.DETAILS_SMALL),e.R7$(),e.Y8G("
                ngIf
                ",t.api.device_capability.getVal("
                wifi
                ","
                networkMap
                ","
                deviceInfoDetails
                ","
                deviceName
                ").isOn&&(null==t.selectedExtender?null:t.selectedExtender.HostName)),e.R7$(),e.Y8G("
                ngIf
                ",t.api.device_capability.getVal("
                wifi
                ","
                networkMap
                ","
                deviceInfoDetails
                ","
                serialNumber
                ").isOn),e.R7$(),e.Y8G("
                ngIf
                ",t.api.device_capability.getVal("
                wifi
                ","
                networkMap
                ","
                deviceInfoDetails
                ","
                onboardingStatus
                ").isOn),e.R7$(),e.Y8G("
                ngIf
                ",t.api.device_capability.getVal("
                wifi
                ","
                networkMap
                ","
                deviceInfoDetails
                ","
                backhaulStatus
                ").isOn),e.R7$(),e.Y8G("
                ngIf
                ",t.api.device_capability.getVal("
                wifi
                ","
                networkMap
                ","
                deviceInfoDetails
                ","
                macAddress
                ").isOn&&(null==t.selectedExtender?null:t.selectedExtender.MACAddress
            )),
                e.R7$(), e.Y8G("ngIf", t.api.device_capability.getVal("wifi", "networkMap", "deviceInfoDetails", "ipAddress").isOn && (null == t.selectedExtender ? null : t.selectedExtender.IPAddress))
            }
        }

        function gt(i, l) {
            if (1 & i && e.nrm(0, "pv-select-option", 70), 2 & i) {
                const t = l.$implicit;
                e.Y8G("label", t.label)("value", t.value)
            }
        }

        function mt(i, l) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "div"), e.nrm(1, "pv-text", 71), e.j41(2, "pv-inputbox", 72), e.bIt("onModelChange", function (n) {
                    e.eBV(t);
                    const d = e.XpG(2);
                    return e.Njj(d.onFriendlyNameCustomChange(n))
                }), e.k0s(), e.nrm(3, "pv-text", 73), e.k0s()
            }
            if (2 & i) {
                const t = e.XpG(2);
                e.R7$(), e.Y8G("title", t.constants.CUSTOM_NAME), e.R7$(), e.Y8G("isValidated", t.friendlyNameValidated)("errorMessage", t.friendlyNameErrorMessage)("isAutoFocus", !0)("hideErrorIcon", !0)("maxlength", t.constants.WIFI_POINT_FRIENDLY_NAME_MAX_CHAR), e.R7$(), e.Y8G("title", t.constants.MAX_LENGTH_CHAR_TEXT)
            }
        }

        function ft(i, l) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-dialog", 64), e.bIt("closeDialog", function () {
                    e.eBV(t);
                    const n = e.XpG();
                    return e.Njj(n.closeDialog())
                }), e.qex(1, 65), e.j41(2, "form", 35), e.qex(3), e.j41(4, "pv-form-field", 42)(5, "span", 66)(6, "pv-select", 67, 2), e.DNE(8, gt, 1, 2, "pv-select-option", 68), e.k0s()()(), e.DNE(9, mt, 4, 7, "div", 14), e.bVm(), e.j41(10, "pv-button", 69), e.bIt("click", function () {
                    e.eBV(t);
                    const n = e.XpG();
                    return e.Njj(n.saveFriendlyName())
                }), e.k0s()(), e.bVm(), e.k0s()
            }
            if (2 & i) {
                const t = e.XpG();
                e.Y8G("dialogConfig", e.l_i(7, ue, t.constants.CHANGE_WIFI_POINT_NAME, t.constants.PICK_NAME_SELECT)), e.R7$(2), e.Y8G("formGroup", t.editFriendlyForm), e.R7$(2), e.Y8G("hasBorder", !1)("rowLayout", !0), e.R7$(4), e.Y8G("ngForOf", t.friendlyNameList), e.R7$(), e.Y8G("ngIf", "Custom" === t.friendlyname.value), e.R7$(), e.Y8G("title", t.constants.SAVE)
            }
        }

        let vt = (() => {
            class i {
                constructor(t, o, n, d, f, N, g, v, w, bt, Et, kt) {
                    this.api = t, this.constants = o, this.websocket = n, this.pubSubService = d, this.alertUtil = f, this.logger = N, this.message = g, this.pureViewSnackbarService = v, this.route = w, this.gconfig = bt, this.utility = Et, this.prodcfg = kt, this.navigateBack = new e.bkB, this.connectedData = !1, this.toggleData = !1, this.runTime = "", this.deviceModel = "", this.selectedExtender = [], this.isRoot = !1, this.isOnline = !1, this.timeRunner = 0, this.startTimer = !0, this.isCFGMode = !1, this.showBridgeModeCard = !1, this.weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], this.defaultBridgeModeValue = !1, this.isLoading = !1, this.showEnableRRM = !1, this.deepFacNotSupported = !1, this.networkMapList = [], this.deviceMapDetected = "", this.showEditWifiPtFlow = !1, this.friendlyNameValidated = !0, this.friendlyNameErrorMessage = "", this.tempFriendlyName = "", this.signalLedState = !1, this.isConnectionOK = !0, this.showSignalLed = !1, this.isPOESupported = !1, this.extenderConnected = !1, this.ledAvailable = !1, this.checkForLedMac = !1, this.showLEDforMTK = !1, this.editFriendlyForm = new c.gE({
                        friendlyname: new c.MJ(""),
                        customname: new c.MJ("")
                    }), this.friendlyNameList = [{
                        label: this.constants.FRIENDLY_BEDROOM,
                        value: "Bedroom"
                    }, {
                        label: this.constants.FRIENDLY_DINING_ROOM,
                        value: "Dining Room"
                    }, {
                        label: this.constants.FRIENDLY_KITCHEN,
                        value: "Kitchen"
                    }, {
                        label: this.constants.FRIENDLY_LIVING_ROOM,
                        value: "Living Room"
                    }, {label: this.constants.FRIENDLY_STUDY, value: "Study"}, {
                        label: this.constants.FRIENDLY_CUSTOM,
                        value: "Custom"
                    }], this.isBATL = !1, "" !== this.api.router_info.gwmodel ? this.loadRouterInfo(this.api) : this.api.request(this, "getRouterInfo"), this.showLEDforMTK = ["Beacon 2", "Beacon 1.1", "G-1425G-E", "G-1425G-H", "XS-140X-A"].includes(this.api.router_info.gwmodel)
                }

                get bridgeMode() {
                    return this.deviceDetailsForm.get("bridgeMode")
                }

                get statusledOnOff() {
                    return this.deviceDetailsForm.get("statusledOnOff")
                }

                get enableRRM() {
                    return this.deviceDetailsForm.get("enableRRM")
                }

                get friendlyname() {
                    return this.editFriendlyForm?.get("friendlyname")
                }

                get customname() {
                    return this.editFriendlyForm?.get("customname")
                }

                get signalledOnOff() {
                    return this.deviceDetailsForm.get("signalledOnOff")
                }

                get enablePOE() {
                    return this.deviceDetailsForm.get("enablePOE")
                }

                loadRouterInfo(t) {
                    this.selectedExtender = t.selectedExtender;
                    const o = this.selectedExtender?.friendlyName, n = this.selectedExtender?.modelName,
                        d = this.selectedExtender?.isConnectionOk;
                    this.deepFacNotSupported = this.prodcfg.MTKBoard;
                    var f = this.selectedExtender?.nodeSubText;
                    const N = this.api.selectedExtender.MACAddress;
                    this.isRoot = "0" != this.selectedExtender.isRoot, this.isOnline = "1" == this.selectedExtender.isOnline || "2" == this.selectedExtender.isOnline, this.isCFGMode = -1 === t.brEnable, this.showBridgeModeCard = this.prodcfg.allowAllBridgeMode, this.showEnableRRM = this.prodcfg.supportRRM, this.showSignalLed = this.prodcfg.supportSignalLed, this.isPOESupported = this.prodcfg.supportsPOE, this.isBATL = "BATL" === this.api.g_opId, this.isCFGMode && ("BWDS" === this.api.g_opId || "BATL" === this.api.g_opId && this.api.device_capability.getVal("overview", "networkMap", "addWifiButton", "showAddSerialNumberModal").isOn ? this.showWarning(this.constants.CFG_WARNING_BWDS) : this.showWarning(this.constants.CFG_WARNING));
                    for (let v = 0; v < this.api.network_tpl_status.ntwtopo_cfg.length; v++) this.selectedExtender.SerialNumber == this.api.network_tpl_status.ntwtopo_cfg[v].SerialNumber && (this.selectedExtender = this.api.network_tpl_status.ntwtopo_cfg[v]);
                    this.selectedExtender.HostName = n || (this.selectedExtender?.HostName ? this.selectedExtender?.HostName : ""), this.selectedExtender.nodeSubText = f, this.selectedExtender.friendlyName = o, this.selectedExtender.MACAddress = N, this.isConnectionOK = d, this.friendlyname.setValue("Custom"), this.customname.setValue(o)
                }

                ngOnInit() {
                    this.api.isSFUDevice || (this.constants.SHOW_BACK_BUTTON = !0), this.isBtnDisabled = !1, this.initForm(), this.getSoftwareVersion(), this.api.get_device_info.UpTime > 0 && (this.runTime = "", this.showUpTime(this.api.get_device_info.UpTime)), this.api.get_mesh_info.beacon_detail.length > 0 && this.syncMeshData(this.api.get_mesh_info), this.api.get_device_info?.cpu_usageinfo && (this.cpuUsage = this.api.get_device_info.cpu_usageinfo?.CPUUsage + "%"), this.api.get_device_info?.mem_info && (this.memoryUsage = this.getMemoryInfo(this.api.get_device_info?.mem_info?.Total, this.api.get_device_info?.mem_info?.Free)), this.getDeviceDetails(), this.api.get_glbl_led_status?.isDataAvailable && this.setLedStatus(this.api.get_glbl_led_status), this.getLedDetails(), this.getBridgeMode(), this.onChanges(), this.isPOESupported && this.getPOEStatus(), this.messageConfigHideSub = this.message.hideMessage$.subscribe(t => {
                        if (this.logger.console(t), t?.proceed) {
                            const o = this;
                            setTimeout(() => {
                                "0" == o.selectedExtender?.isOnline ? this.confirmRemoveAP() : (this.pubSubService.publish(b.VR.HEADER_REFRESH_CLICKED), this.removeAP())
                            }, 10)
                        } else if (t?.confirm) {
                            this.isLoading = !0, this.alertUtil.showContentModalLoader(), this.alertUtil.showModalBackDrop();
                            const o = `MacAddr=${this.selectedExtender?.MACAddress}&SerialNumber=${this.selectedExtender?.SerialNumber}`;
                            this.logger.console("REMOVE AP:" + o), this.api.request(this, "deleteMeshInfo", o)
                        }
                    }), this.checkIfExtenderConnected()
                }

                getSoftwareVersion() {
                    if (this.api.get_device_info.SoftwareVersion) {
                        let t = "";
                        this.isBATL ? (t = this.api.get_device_info.SoftwareVersion.split("(")[0], this.softwareVersion = t, this.softwareVersion = "" !== t ? t : this.api.get_device_info.SoftwareVersion) : this.softwareVersion = this.api.get_device_info.SoftwareVersion
                    }
                }

                checkIfNonNokia(t) {
                    return "BATL" == this.api.g_opId ? t.replace("Nokia ", "") : t
                }

                onChanges() {
                    this.friendlyname.valueChanges.subscribe(t => {
                        "Custom" !== this.friendlyname.value && (this.friendlyNameValidated = !0, this.friendlyNameErrorMessage = "")
                    })
                }

                removeAP() {
                    this.showWarningSteps(this.constants.TURNOFF_POWER_MSG, this.constants.TURNOFF_POWER, this.constants.CANCEL_LABEL, this.constants.POWER_OFF_BTN, {proceed: !0})
                }

                confirmRemoveAP() {
                    this.showWarningSteps(this.constants.CONFIRM_REMOVE_AP_MSG, this.constants.CONFIRM_REMOVE_AP_TEXT, this.constants.CANCEL_LABEL, this.constants.REMOVE, {confirm: !0})
                }

                refreshPage() {
                    this.pageRefreshSub = this.pubSubService.subscribe(b.VR.HEADER_REFRESH_CLICKED, t => {
                        this.getDeviceDetails(), this.getLedDetails()
                    })
                }

                getRootName() {
                    let t = "";
                    return t = this.prodcfg.supportsFWADevice ? this.api.get_device_info.X_ASB_COM_FriendlyName ? this.api.get_device_info.X_ASB_COM_FriendlyName : this.api.get_device_info.ModelName : this.api.get_device_info.getRootFriendlyNameIfAvailable_(this.api.get_device_info.ModelName, this.api.get_device_info.X_ASB_COM_FriendlyName, this.api.get_home_ntw_topo.getRootMacAddress()), t
                }

                checkIfExtenderConnected() {
                    const t = this.utility.formatNetworkMapData(this.api.get_home_ntw_topo);
                    let o = [];
                    o = null != t?.aps && t?.aps?.length ? t?.aps : [], this.extenderConnected = o.length > 1, console.log(t)
                }

                setDeviceModel(t, o) {
                    const n = this.getDeviceNameIfLong(t);
                    let d = this.getNodeImageGreen(n);
                    if (o && !this.prodcfg.nonWifiBoards) {
                        const N = this.utility.formatNetworkMapData(this.api.get_home_ntw_topo).aps.find(v => v?.macaddress === o);
                        if (N?.["isbackhaul-connected"] && "online" === N?.status && this.isConnectionOK) {
                            const v = N?.backhaulQuality ? N?.backhaulQuality.toUpperCase() : "";
                            d = "GOOD" === v || "NORMAL" === v || "root" === N?.role ? this.getNodeImageGreen(n) : this.getNodeImageYellow(n)
                        } else d = "1" == this.selectedExtender.isRoot && this.isConnectionOK ? this.getNodeImageGreen(n) : this.getNodeImageRed(n)
                    } else d = this.isConnectionOK ? this.getNodeImageGreen(n) : this.getNodeImageRed(n);
                    return this.deviceModel = d, this.deviceModel
                }

                getBandName(t) {
                    switch (t) {
                        case"wifi-24":
                            return this.constants.WIRELESS_2_4GHZ;
                        case"wifi-5":
                            return this.constants.WIRELESS_5GHZ;
                        case"wifi-5L":
                        case"wifi-5low":
                            return this.constants.WIRELESS_5GHZl;
                        case"wifi-5H":
                        case"wifi-5high":
                            return this.constants.WIRELESS_5GHZh;
                        case"wifi-6":
                            return this.constants.WIRELESS_6GHZ;
                        case"ethernet":
                            return this.constants.ETHERNET_LABEL
                    }
                }

                getDeviceNameIfLong(t) {
                    const o = t?.toUpperCase();
                    return this.deviceMapDetected = o.includes("BEACON 1.1") ? "Beacon 1.1" : o.includes("BEACON 19") ? "Beacon 19" : o.includes("BEACON 10") ? "Beacon 10" : o.includes("BEACON 2") && !o.includes("BEACON 24") ? "Beacon 2" : o.includes("BEACON 24") ? "Beacon 24" : o.includes("BEACON 3.1") ? "Beacon 3.1" : o.includes("AAP321NK") || o.includes("BEACON 3.2") ? "Beacon 3.2" : o.includes("BEACON 3") ? "Beacon 3" : o.includes("BEACON 6") ? "Beacon 6" : o.includes("BEACON G6.2") ? "Beacon G6.2" : o.includes("BEACON G6") ? "Beacon G6" : o.includes("BEACON 1") ? "Beacon 1" : o.includes("5G15-12W-A") || o.includes("5G16-12W-A") || o.includes("5G13-12W-A") ? "Gateway 3.2" : o.includes("5G19-01W-A") || o.includes("5G18-01W-A") || o.includes("5G19-02W-A") || o.includes("5G19-12W-A") ? "Gateway 2" : o.includes("5G30-03W-A") || o.includes("5G30-13W-A") ? "Gateway 6" : o.includes("5G30-03W-B") ? "Gateway 7" : o.includes("5G26-03W-A") ? "Gateway 7.1" : o.includes("5G31-03W-B") ? "Gateway 12" : o.includes("5G14-B") ? "Reciever 5G14-B" : o.includes("5G19-A") || o.includes("5G26-A") ? "Reciever 5G19-A" : o.includes("5G16-A") ? "Reciever 5G16-A" : o.includes("5G16-B") ? "Reciever 5G16-B" : o.includes("5G32-A") ? "Reciever 5G32-A" : o.includes("5GMM28-B") ? "FastMile 5G Receiver 5Gmm28-B" : o.includes("5GMM29-B") ? "FastMile 5G Receiver 5Gmm29-B" : o.includes("5GMM01-A") ? "Nokia FM 5Gmm Receiver 5Gmm01-A" : t, this.deviceMapDetected
                }

                getNodeImageGreen(t) {
                    switch (t) {
                        case"Beacon 1.1":
                            this.deviceModel = "green_big_b_1_1";
                            break;
                        case"Beacon 1":
                            this.deviceModel = "green_big_b_1";
                            break;
                        case"Beacon 2":
                            this.deviceModel = "green_big_b_2";
                            break;
                        case"Beacon 24":
                            this.deviceModel = "green_big_b_24";
                            break;
                        case"Beacon 19":
                            this.deviceModel = "green_big_b_19";
                            break;
                        case"Beacon 3":
                            this.deviceModel = "green_big_b_3";
                            break;
                        case"Beacon 3.1":
                            this.deviceModel = "green_big_b_3_1";
                            break;
                        case"Beacon 3.2":
                        case"AAP321NK":
                            this.deviceModel = "green_big_b_3_2";
                            break;
                        case"Beacon 6":
                            this.deviceModel = "green_big_b_6";
                            break;
                        case"Gateway 3.2":
                            this.deviceModel = "green_big_g_3_2";
                            break;
                        case"Gateway 6":
                        case"Gateway 7":
                        case"Gateway 7.1":
                        case"Gateway 12":
                            this.deviceModel = "green_big_g_6_7_12";
                            break;
                        case"Gateway 2":
                            this.deviceModel = "green_big_g_2";
                            break;
                        case"Reciever 5G14-B":
                            this.deviceModel = "green_big_rcvr_14_b";
                            break;
                        case"Reciever 5G19-A":
                            this.deviceModel = "green_big_rcvr_19_a_26_b";
                            break;
                        case"Reciever 5G16-A":
                            this.deviceModel = "green_big_rcvr_16_a";
                            break;
                        case"Reciever 5G16-B":
                            this.deviceModel = "green_big_rcvr_16_b";
                            break;
                        case"Reciever 5G32-A":
                            this.deviceModel = "green_big_rcvr_32_a";
                            break;
                        case"FastMile 5G Receiver 5Gmm28-B":
                        case"FastMile 5G Receiver 5Gmm29-B":
                        case"Nokia FM 5Gmm Receiver 5Gmm01-A":
                            this.deviceModel = "receiver_mm_28_29_b_green_big";
                            break;
                        case"Beacon G6":
                        case"Beacon G6.2":
                        case"Beacon 10":
                            this.deviceModel = "green_big_b_10";
                            break;
                        default:
                            this.deviceModel = "big_aont_green"
                    }
                    return this.deviceModel
                }

                getNodeImageRed(t) {
                    switch (t) {
                        case"Beacon 1.1":
                            this.deviceModel = "red_big_b_1_1";
                            break;
                        case"Beacon 1":
                            this.deviceModel = "red_big_b_1";
                            break;
                        case"Beacon 2":
                            this.deviceModel = "red_big_b_2";
                            break;
                        case"Beacon 24":
                            this.deviceModel = "red_big_b_24";
                            break;
                        case"Beacon 19":
                            this.deviceModel = "red_big_b_19";
                            break;
                        case"Beacon 3":
                            this.deviceModel = "red_big_b_3";
                            break;
                        case"Beacon 3.1":
                            this.deviceModel = "red_big_b_3_1";
                            break;
                        case"Beacon 3.2":
                        case"AAP321NK":
                            this.deviceModel = "red_big_b_3_2";
                            break;
                        case"Beacon 6":
                            this.deviceModel = "red_big_b_6";
                            break;
                        case"Gateway 3.2":
                            this.deviceModel = "red_big_g_3_2";
                            break;
                        case"Gateway 6":
                        case"Gateway 7":
                        case"Gateway 7.1":
                        case"Gateway 12":
                            this.deviceModel = "red_big_g_6_7_12";
                            break;
                        case"Gateway 2":
                            this.deviceModel = "red_big_g_2";
                            break;
                        case"Reciever 5G14-B":
                            this.deviceModel = "red_big_rcvr_14_b";
                            break;
                        case"Reciever 5G19-A":
                            this.deviceModel = "red_big_rcvr_19_a_26_b";
                            break;
                        case"Reciever 5G16-A":
                            this.deviceModel = "red_big_rcvr_16_a";
                            break;
                        case"Reciever 5G16-B":
                            this.deviceModel = "red_big_rcvr_16_b";
                            break;
                        case"Reciever 5G32-A":
                            this.deviceModel = "red_big_rcvr_32_a";
                            break;
                        case"FastMile 5G Receiver 5Gmm28-B":
                        case"FastMile 5G Receiver 5Gmm29-B":
                        case"Nokia FM 5Gmm Receiver 5Gmm01-A":
                            this.deviceModel = "receiver_mm_28_29_b_red_big";
                            break;
                        case"Beacon G6":
                        case"Beacon G6.2":
                        case"Beacon 10":
                            this.deviceModel = "red_big_b_10";
                            break;
                        default:
                            this.deviceModel = "big_aont_red"
                    }
                    return this.deviceModel
                }

                getNodeImageYellow(t) {
                    switch (t) {
                        case"Beacon 1.1":
                            this.deviceModel = "yellow_big_b_1_1";
                            break;
                        case"Beacon 1":
                            this.deviceModel = "yellow_big_b_1";
                            break;
                        case"Beacon 2":
                        case"Gateway":
                            this.deviceModel = "yellow_big_b_2";
                            break;
                        case"Beacon 24":
                            this.deviceModel = "yellow_big_b_24";
                            break;
                        case"Beacon 19":
                            this.deviceModel = "yellow_big_b_19";
                            break;
                        case"Beacon 3":
                            this.deviceModel = "yellow_big_b_3";
                            break;
                        case"Beacon 3.1":
                            this.deviceModel = "yellow_big_b_3_1";
                            break;
                        case"Beacon 3.2":
                        case"AAP321NK":
                            this.deviceModel = "yellow_big_b_3_2";
                            break;
                        case"Beacon 6":
                            this.deviceModel = "yellow_big_b_6";
                            break;
                        case"Gateway 3.2":
                            this.deviceModel = "yellow_big_g_3_2";
                            break;
                        case"Gateway 6":
                        case"Gateway 7":
                        case"Gateway 7.1":
                        case"Gateway 12":
                            this.deviceModel = "yellow_big_g_6_7_12";
                            break;
                        case"Gateway 2":
                            this.deviceModel = "yellow_big_g_2";
                            break;
                        case"Reciever 5G14-B":
                            this.deviceModel = "yellow_big_rcvr_14_b";
                            break;
                        case"Reciever 5G19-A":
                            this.deviceModel = "yellow_big_rcvr_19_a_26_b";
                            break;
                        case"Reciever 5G16-A":
                            this.deviceModel = "yellow_big_rcvr_16_a";
                            break;
                        case"Reciever 5G16-B":
                            this.deviceModel = "yellow_big_rcvr_16_b";
                            break;
                        case"Reciever 5G32-A":
                            this.deviceModel = "yellow_big_rcvr_32_a";
                            break;
                        case"FastMile 5G Receiver 5Gmm28-B":
                        case"FastMile 5G Receiver 5Gmm29-B":
                        case"Nokia FM 5Gmm Receiver 5Gmm01-A":
                            this.deviceModel = "receiver_mm_28_29_b_yellow_big";
                            break;
                        case"Beacon G6":
                        case"Beacon G
                            6.2
                            ":case"
                            Beacon
                            10
                            ":this.deviceModel="
                            yellow_big_b_10
                            ";break;default:this.deviceModel="
                            big_aont_yellow
                            "}return this.deviceModel}catch(t){this.logger.console("
                            Error
                            getting
                            device
                            Modal
                            ",t)}setConnectedStatus(t){t.ntwtopo_cfg.filter(o=>{o.SerialNumber===this.selectedExtender.SerialNumber&&(this.isOnline="
                            1
                            "===o.isOnline)})}setLedStatus(t){if(this.prodcfg.supportsFWADevice){const o=t?.LEDGlobalSts?.X_ALU_COM_StatusLED_Enable;if(this.statusledOnOff.setValue(!!o),this.showSignalLed){const n=t?.LEDGlobalSts?.X_ALU_COM_SignalLED_Enable;this.signalledOnOff.setValue(!!n),this.signalLedState=this.signalledOnOff.value,this.statusledOnOff.value?(this.signalledOnOff.setValue(this.signalLedState),this.signalledOnOff.enable()):(this.signalledOnOff.setValue(!1),this.signalledOnOff.disable())}}else this.prodcfg.nonWifiBoards?t.LEDGlobalSts?.length&&!this.api.get_mesh_info.isDataAvailable&&(this.ledAvailable=!0,this.selectedExtender.MACAddress=t.LEDGlobalSts[0]?.NodeID,this.statusledOnOff.setValue("
                            0
                            "===t.LEDGlobalSts[0].Enable.toString())):t.LEDGlobalSts.filter(o=>{o.NodeID===this.selectedExtender.MACAddress&&this.statusledOnOff.setValue("
                            0
                            "===o.Enable.toString())})}showUpTime(t){this.timeRunner=t,this.devicetime=this.websocket.convertTimeInDHMSFormat(this.timeRunner),this.runTime="
                            ",this.showDeviceTime(this.devicetime),this.startTimer&&(this.startTimer=!1,this.timerInterval=window.setInterval(()=>{this.timeRunner++,this.devicetime=this.websocket.convertTimeInDHMSFormat(this.timeRunner),this.runTime="
                            ",this.showDeviceTime(this.devicetime)},1e3))}showDeviceTime(t){t.days&&(this.runTime=t.days+` ${this.constants.DAYS} `),t.hrs&&(this.runTime+=t.hrs+` ${this.constants.HOURS} `),t.mnts&&(this.runTime+=t.mnts+` ${this.constants.MINUTES} `),t.sec&&(this.runTime+=t.sec+` ${this.constants.SECONDS} `)}getDeviceDetails(){this.api.request(this,"
                            getDeviceInfo
                            "),this.api.request(this,"
                            getNetworkTplStatus
                            "),this.api.request(this,"
                            getMeshInfo
                            ")}getLedDetails(){this.api.request(this,"
                            getGlblLedStatus
                            ")}getBridgeMode(){this.api.request(this,"
                            getBridgeModeInfo
                            ")}getPOEStatus(){this.api.request(this,"
                            getpoeStatus
                            ")}onEnableBridgeMode(t){const o=this.bridgeMode.value;if(this.defaultBridgeModeValue!==o){const n="
                            act = setWorkMode & brEnable = "+(!0===o?1:0);window.confirm(this.constants.WARNING_ENABLE_BRIDGE_MODE)?this.api.request(this,"
                            setBridgemodeinfo
                            ",n):(this.logger.console(this.bridgeModeToggle),this.bridgeMode.setValue(this.defaultBridgeModeValue),this.bridgeModeToggle.isChecked=!1,this.bridgeModeToggle.onChange(!1),window.setTimeout(()=>{this.bridgeMode.setValue(this.defaultBridgeModeValue)},500)),this.logger.console(n)}}onToggleClick(t,o){if(this.logger.console(t),this.showSignalLed){this.statusledOnOff.value?"
                            signal
                            "!=o&&(this.signalledOnOff.setValue(this.signalLedState),this.signalledOnOff.enable()):(this.signalledOnOff.setValue(!1),this.signalledOnOff.disable());var n=this.signalledOnOff.value}const d=this.statusledOnOff.value;let f="
                            ";this.prodcfg.supportsFWADevice?(f=d?"
                            EnableGbl = on
                            ":"
                            EnableGbl = off
                            ",f+=this.showSignalLed?n?" & EnableSigGbl = on
                            ":" & EnableSigGbl = off
                            ":d?" & EnableSigGbl = on
                            ":" & EnableSigGbl = off
                            "):(f=d?"
                            EnableGbl = off
                            ":"
                            EnableGbl = on
                            ",f+=`&MacAddr=${t}`),this.logger.console(f),this.api.request(this,"
                            setGlblLedInfo
                            ",f)}onRRMToggleClick(t){this.logger.console(t),t?this.alertUtil.showAlert({title:this.constants.WARNING,SHOW_DEFAULT_BUTTON:!1,SHOW_HEADER_CLOSE_BUTTON:!1,CALLBACK_1_TITLE:this.constants.CANCEL,CALLBACK_2_TITLE:this.constants.ENABLE_LABEL,message:this.constants.ENHANCED_ROAMING_DESC},()=>{this.logger.console("
                            Callback
                            1 - Cancel
                            "),this.enableRRM.setValue(!this.enableRRM.value)},()=>{this.logger.console("
                            Callback
                            2 - Enable
                            "),this.setEnhancedRoaming(!0)}):this.setEnhancedRoaming(!1)}onPOEToggleClick(t){console.log(t),t?this.api.request({onSuccess:o=>{3==o?.data?.reason?this.showErrorSnackbar():this.getPOEStatus()},onError:o=>{this.logger.console("
                            POE
                            SET
                            FAILED - Enable
                            ")}},"
                            setpoeEnable
                            "):this.api.request({onSuccess:o=>{3==o?.data?.reason?this.showErrorSnackbar():this.getPOEStatus()},onError:o=>{this.logger.console("
                            POE
                            SET
                            FAILED - Disable
                            ")}},"
                            setpoeDisable
                            ")}setEnhancedRoaming(t){const o=t?1:0;this.alertUtil.showModalLoader(),this.logger.console(o),this.api.request({onSuccess:n=>{this.api.request(this,"
                            getMeshInfo
                            "),this.alertUtil.hideModalLoader()},onError:n=>{this.api.request(this,"
                            getMeshInfo
                            "),this.alertUtil.hideModalLoader()}},"
                            setRRM
                            ",o)}showErrorSnackbar(){this.pureViewSnackbarService.showMessageSnackbar({show:!0,width:"
                            300
                            px
                            ",description:this.constants.ERR_SAVING_CHANGES,iconAfter:"
                            close_mini
                            ",iconBefore:"
                            error_icon_black
                            "})}showWarning(t){this.message.showMessage({show:!0,title:this.constants.WARNING,width:"
                            400
                            px
                            ",description:t,buttonText:this.constants.OKAY_LABEL})}showWarningSteps(t,o,n,d,f,N){this.removeAPModal=this.message.showMessage({show:!0,title:o,width:"
                            400
                            px
                            ",description:t,cancelBtn:n||"
                            ",deleteBtn:d||this.constants.OKAY_LABEL,data:f,buttonDisabled:N})}reboot(){if(!this.isCFGMode&&!this.api?.device_capability?.getVal("
                            wifi
                            ","
                            networkMap
                            ","
                            deviceInfoDetails
                            ","
                            rebootButton
                            ").isDisabled){if(!window.confirm(this.constants.CONFIRM_REBOOT))return!1;this.api.request(this,"
                            rebootSystem
                            "),localStorage.getItem("
                            optimizingTime
                            ")&&localStorage.removeItem("
                            optimizingTime
                            ")}}doFactoryDefault(){if(!this.isBtnDisabled&&!this.api?.device_capability?.getVal("
                            wifi
                            ","
                            networkMap
                            ","
                            deviceInfoDetails
                            ","
                            factoryDefaultButton
                            ").isDisabled){if(!window.confirm(this.constants.SYSTEM_CONFIG_RESET))return this.isBtnDisabled=!1,!1;this.isBtnDisabled=!0,this.api.request(this,"
                            doFactoryDefault
                            ","
                            data = "),localStorage.getItem("
                            optimizingTime
                            ")&&localStorage.removeItem("
                            optimizingTime
                            ")}}doDeepFactoryReset(){if(!this.isBtnDisabled&&!this.api?.device_capability?.getVal("
                            wifi
                            ","
                            networkMap
                            ","
                            deviceInfoDetails
                            ","
                            factoryDefaultButton
                            ").isDisabled){if(!window.confirm(this.constants.SYSTEM_CONFIG_RESET))return this.isBtnDisabled=!1,!1;this.isBtnDisabled=!0,localStorage.getItem("
                            optimizingTime
                            ")&&localStorage.removeItem("
                            optimizingTime
                            "),this.api.request(this,"
                            doDeepFactoryReset
                            ","
                            data = ")}}setBridgeMode(t){this.defaultBridgeModeValue="
                            AP_Bridge
                            "===t.workMode,this.bridgeMode.setValue(this.defaultBridgeModeValue)}syncMeshData(t){this.showEnableRRM&&this.enableRRM.setValue(t.rrm_enable)}getAvailableName(){return this.selectedExtender?.friendlyName?this.selectedExtender.friendlyName:this.selectedExtender.apsName?this.selectedExtender.apsName:this.selectedExtender.SerialNumber?this.selectedExtender.SerialNumber:"
                            Beacon
                            "}editFriendlyNameClick(t){this.logger.console(t),this.showEditWifiPtFlow=!0,this.friendlyNameValidated=!0,this.isCustomName()}closeDialog(){this.showEditWifiPtFlow=!1}onFriendlyNameCustomChange(t,o){this.tempFriendlyName=t?t.trim():"
                            ",this.friendlyNameValidated=!0,this.friendlyNameErrorMessage="
                            ",this.validateForm()}validateForm(){this.tempFriendlyName?new RegExp(" ^ [\\u0080 -\\uFFFFa - zA - Z0 - 9.
                        @#
                            '\ufffd_ \\-]+$").test(this.tempFriendlyName)?(this.friendlyNameValidated=!0,this.friendlyNameErrorMessage=""):(this.friendlyNameValidated=!1,this.friendlyNameErrorMessage=this.constants.FRIENDLY_NAME_INVALID_CHAR):(this.friendlyNameValidated=!1,this.friendlyNameErrorMessage=this.constants.REQUIRED_FIELD_LABEL)}saveFriendlyName(){if(this.friendlyNameValidated){const t="Custom"==this.friendlyname.value?this.customname.value:this.friendlyname.value;"1"==this.selectedExtender.isRoot?this.saveRootFriendlyName(t):this.saveExtenderFriendlyName(t)}}saveRootFriendlyName(t){const o=`hostalias=${encodeURIComponent(t)}`;this.logger.console(o),this.alertUtil.showModalLoader(),this.api.request({onSuccess:n=>{this.api.request({onSuccess:d=>{const f=this.getRootName();"1"==this.selectedExtender.isRoot&&(this.constants.PAGE_TITLE=f,this.api.selectedExtender.friendlyName=f),this.alertUtil.hideModalLoader(),this.closeDialog(),this.api.get_device_info.dataMapper(d?.data),this.api.overview_status.device_info[0]=this.api.get_device_info,this.pubSubService.publish(b.VR.HEADER_REFRESH_CLICKED)},onError:d=>{this.alertUtil.hideModalLoader(),this.closeDialog(),console.error("SET_ROOT_FNAME API Failed - Error"),console.error(d)}},"getDeviceInfo")},onError:n=>{this.alertUtil.hideModalLoader(),this.closeDialog(),console.error("SET_ROOT_FNAME API Failed - Error"),console.error(n)}},"setRootFriendlyName",o)}saveExtenderFriendlyName(t){const o=this.selectedExtender?.MACAddress,n=`hostalias=${encodeURIComponent(t)}&macaddress=${o}`;this.logger.console(n),this.alertUtil.showModalLoader(),this.api.request({onSuccess:d=>{this.api.request({onSuccess:f=>{this.api.overview_status.alias_cfg=this.api.home_ntw_status.alias_cfg;const N=this.api.home_ntw_status.alias_cfg.find(g=>g.MACAddress===o);N?(this.selectedExtender.friendlyName=N.HostAlias,this.constants.PAGE_TITLE=N.HostAlias):(this.selectedExtender.friendlyName=this.getAvailableName(),this.constants.PAGE_TITLE=this.getAvailableName()),this.closeDialog(),this.alertUtil.hideModalLoader(),this.pubSubService.publish(b.VR.HEADER_REFRESH_CLICKED)},onError:f=>{this.alertUtil.hideModalLoader(),this.closeDialog(),console.error("SET_ROOT_FNAME API Failed - Error"),console.error(f)}},"getHomeNetworkStatus",{loaderTimeout:this.constants.TIMEOUT_1_MINUTE})},onError:d=>{this.alertUtil.hideModalLoader(),this.closeDialog(),console.error("SET_DEVICE_FNAME_CATEGORY API Failed - Error"),console.error(d)}},"setDeviceFriendlyName",n)}isCustomName(){let t;t=this.friendlyNameList.find((o,n)=>o?.value===this.customname.value),this.logger.console(t),t?.value&&(this.friendlyname.setValue(t?.value),this.customname.setValue(""))}onSuccess(t){const o=t.data;switch(t.action){case b.En.GET_ROUTER_INFO:this.loadRouterInfo(this.api);break;case b.En.GET_DEVICE_INFO:this.showUpTime(o.UpTime),this.getSoftwareVersion(),this.api.get_device_info.cpu_usageinfo&&(this.cpuUsage=this.api.get_device_info.cpu_usageinfo?.CPUUsage+"%"),this.api.get_device_info.mem_info&&(this.memoryUsage=this.getMemoryInfo(this.api.get_device_info.mem_info?.Total,this.api.get_device_info.mem_info?.Free));break;case b.En.SET_GLBL_LED_INFO:this.logger.console("data",o),0==o.result?this.getLedDetails():(this.statusledOnOff.setValue(!this.statusledOnOff.value),this.showSignalLed&&this.signalledOnOff.setValue(!this.signalledOnOff.value));break;case b.En.GET_NTW_TP_STATUS:this.setConnectedStatus(o);break;case b.En.GET_GLBL_LED_STATUS:this.setLedStatus(o);break;case b.En.REBOOT_SYSTEM:this.logger.console("Reboot Device : Reboot done successfully !");break;case b.En.START_FACTORY_DEFAULT:this.logger.console("Factory Default Successfull !");break;case b.En.START_DEEP_FACTORY_RESET:this.logger.console("Deep Factory Default Successfull !");break;case b.En.SET_BRIDGEMODE_INFO:this.getBridgeMode();break;case b.En.GET_BRIDGEMODE_INFO:this.setBridgeMode(o);break;case b.En.DELETE_MESH_AP_INFO:this.alertUtil.hideContentModalLoader(),this.alertUtil.hideModalBackDrop(),this.pureViewSnackbarService.showMessageSnackbar({show:!0,width:"350px",description:`${this.constants.REMOVE_AP_WIFI_POINT}   ${this.selectedExtender?.HostName}    ${this.constants.REMOVE_AP_REMOVED_TEXT}`,buttonText:null,iconBefore:"circle_tick_white"}),setTimeout(()=>{this.navigateBack.emit(this.route.url)},100);break;case b.En.GET_MESH_INFO:this.syncMeshData(o);break;case b.En.GET_POE_STATUS:o&&o.status&&this.enablePOE.setValue("ENABLED"==o.status.toUpperCase())}}initForm(){this.deviceDetailsForm=new c.gE({statusledOnOff:new c.MJ({value:"",disabled:this.api.device_capability.getVal("wifi","networkMap","deviceInfoDetails","ledStatus").isDisabled}),bridgeMode:new c.MJ({value:"",disabled:this.api.device_capability.getVal("wifi","networkMap","deviceInfoDetails","enableBridgeMode").isDisabled}),enableRRM:new c.MJ({value:!1,disabled:!1}),enablePOE:new c.MJ({value:!1,disabled:!1}),signalledOnOff:new c.MJ("")})}onError(t){switch(t.action){case b.En.GET_DEVICE_INFO:console.error("GET_DEVICE_INFO Failed - Error"),console.error(t);break;case b.En.SET_GLBL_LED_INFO:this.logger.error({msg:"Error while saving LED status",error:t}),this.statusledOnOff.setValue(!this.statusledOnOff.value),this.signalledOnOff.setValue(!this.signalledOnOff.value);break;case b.En.GET_NTW_TP_STATUS:console.error("NetworkTopology API Failed - Error"),console.error(t);break;case b.En.GET_GLBL_LED_STATUS:console.error("GET_GLBL_LED_STATUS API Failed - Error"),console.error(t);break;case b.En.REBOOT_SYSTEM:console.error("rebootSystem API Failed - Error"),console.error(t);break;case b.En.START_FACTORY_DEFAULT:200!==t.status&&(this.isBtnDisabled=!1),console.error("START_FACTORY_DEFAULT API Failed - Error"),console.error(t);break;case b.En.START_DEEP_FACTORY_RESET:200!==t.status&&(this.isBtnDisabled=!1),console.error("START_DEEP_FACTORY_RESET API Failed - Error"),console.error(t);break;case b.En.SET_BRIDGEMODE_INFO:console.error("SET_BRIDGEMODE_INFO Failed - Error");break;case b.En.GET_BRIDGEMODE_INFO:console.error("GET_BRIDGEMODE_INFO Failed - Error");break;case b.En.DELETE_MESH_AP_INFO:this.alertUtil.hideContentModalLoader(),this.alertUtil.hideModalBackDrop(),this.pureViewSnackbarService.showMessageSnackbar({show:!0,width:"350px",description:this.constants.REMOVE_AP_FAILURE,buttonText:null,iconBefore:"circle_error_white"}),setTimeout(()=>{this.navigateBack.emit(this.route.url)},100);break;case b.En.GET_MESH_INFO:console.error("GET_MESH_INFO Failed - Error"),console.error(t);break;case b.En.GET_POE_STATUS:console.error("GET_POE_INFO Failed - Error"),console.error(t)}}ngOnDestroy(){this.message.hideMessage({show:!1}),this.pageRefreshSub?.unsubscribe(),this.messageConfigHideSub.unsubscribe(),this.alertUtil.hideContentModalLoader()}getOnboardStatusName(t){return"NotDetected"==t?this.constants.NOT_DETECTED:"ConfigurationSucceeded"==t?this.constants.CONFIGURATION_SUCCEEDED:t}getBackhualstatusName(t){return"Not_connected"==t?this.constants.NOT_CONNECTED_LABEL:t}getMemoryInfo(t,o){return t&&o?Math.round((t-o)/t*100)+"%":"0%"}getNodeText(t){let o="";switch(t){case"wanPortUp":o=this.constants.WAN_PORT_UP;break;case"wanPortDown":o=this.constants.WAN_PORT_DOWN;break;case"linkUp5G":o=this.constants.LINK_UP_5G;break;case"linkUp4G":o=this.constants.LINK_UP_4G;break;case"ethWanPortUp":o=this.constants.ETHERNET_LABEL+" "+this.constants.WAN_PORT_UP;break;case"linkDown5G":o=this.constants.LINK_DOWN_5G;break;case"ethWanPortDown":o=this.constants.ETHERNET_LABEL+" "+this.constants.WAN_PORT_DOWN;break;case"ponPortUp":o=this.constants.PON_PORT_UP;break;case"ponPortDown":o=this.constants.PON_PORT_DOWN;break;case"strongSignal":o=this.constants.SIGNAL_STRENGTH_GOOD;break;case"normalSignal":o=this.constants.SIGNAL_STRENGTH_NORMAL;break;case"poorSignal":o=this.constants.SIGNAL_STRENGTH_POOR;break;case"notConnected":o=this.constants.NOT_CONNECTED_LABEL;break;default:o=""}return o}static#e=this.\u0275fac=function(o){return new(o||i)(e.rXU(k.G),e.rXU(T.YM),e.rXU(P.V),e.rXU(U.Q),e.rXU(R.l),e.rXU($.V),e.rXU(p.m4),e.rXU(p.gd),e.rXU(W.Ix),e.rXU(X.u),e.rXU(L.n),e.rXU(A.Z))};static#t=this.\u0275cmp=e.VBU({type:i,selectors:[["app
                            - device - details
                            "]],viewQuery:function(o,n){if(1&o&&e.GBs(he,5),2&o){let d;e.mGM(d=e.lsd())&&(n.bridgeModeToggle=d.first)}},outputs:{navigateBack:"
                            navigateBack
                            "},decls:23,vars:14,consts:[["
                            formRef
                            ","
                            "],["
                            bridgeModeToggle
                            ","
                            "],["
                            wanConnection
                            ","
                            "],[1,"
                            flex - row
                            ","
                            flex - row__spacebetween - start
                            ","
                            grid - gap - 24
                            ","
                            device - details
                            "],[1,"
                            flex - column
                            ","
                            flex100
                            ","
                            grid - gap - 24
                            "],[1,"
                            flex - row
                            ","
                            flex - row__spacebetween
                            "],[1,"
                            device - edit
                            "],[3,"
                            name
                            "],["
                            ml - 2
                            ","
                            ",3,"
                            ngClass
                            "],["
                            h1 - bold
                            ","
                            ",1,"
                            flex - row
                            ","
                            flex - row__center
                            ",3,"
                            title
                            "],[1,"
                            category - card
                            "],["
                            py - 0 - 3
                            ","
                            "],["

                        class

                            ","
                            pencil - edit
                            ","
                            name
                            ","
                            pencil_icon
                            ",3,"
                            click
                            ",4,"
                            ngIf
                            "],["

                        class

                            ","
                            flex - row
                            flex - row__start - center
                            ",4,"
                            ngIf
                            "],[4,"
                            ngIf
                            "],["

                        class

                            ","
                            extender_link
                            ",4,"
                            ngIf
                            "],[3,"
                            formGroup
                            ",4,"
                            ngIf
                            "],[1,"
                            flex - column
                            ","
                            flex100
                            "],[3,"
                            dialogConfig
                            ","
                            closeDialog
                            ",4,"
                            ngIf
                            "],["
                            name
                            ","
                            pencil_icon
                            ",1,"
                            pencil - edit
                            ",3,"
                            click
                            "],[1,"
                            flex - row
                            ","
                            flex - row__start - center
                            "],["
                            mr - 2
                            ","
                            ",3,"
                            name
                            "],["
                            body1 - bold
                            ","
                            ",3,"
                            title
                            "],["
                            subtext1 - regular
                            ","
                            ",3,"
                            title
                            ",4,"
                            ngIf
                            "],["
                            subtext1 - regular
                            ","
                            ",3,"
                            title
                            "],[3,"
                            subtext
                            ","
                            captionBold1
                            "],["
                            iconEnd
                            ","
                            signal_strength_5
                            ",3,"
                            subtext
                            ","
                            captionBold1
                            "],[1,"
                            extender_link
                            "],["
                            subtext1 - regular
                            ","
                            ","
                            pl - 3
                            ","
                            ","
                            pt - 5
                            ","
                            ",3,"
                            title
                            ",4,"
                            ngIf
                            "],[4,"
                            ngFor
                            ","
                            ngForOf
                            "],["
                            subtext1 - regular
                            ","
                            ","
                            pl - 3
                            ","
                            ","
                            pt - 5
                            ","
                            ",3,"
                            title
                            "],["

                        class

                            ","
                            extender_link - list
                            ",4,"
                            ngIf
                            "],[1,"
                            extender_link - list
                            "],[3,"
                            isTitleBody1Bold
                            ","
                            title
                            ","
                            subtextUp
                            ",4,"
                            ngIf
                            "],[3,"
                            isTitleBody1Bold
                            ","
                            title
                            ","
                            subtextUp
                            "],[3,"
                            formGroup
                            "],["
                            mb - 4
                            ","
                            ","
                            h2 - bold
                            ","
                            ",3,"
                            title
                            "],["
                            mb - 4
                            ","
                            ",3,"
                            hasBorder
                            ","
                            rowLayout
                            ","
                            labelAlign
                            ",4,"
                            ngIf
                            "],["
                            mb - 4
                            ","
                            ",3,"
                            hasBorder
                            ","
                            rowLayout
                            ","
                            labelAlign
                            "],["
                            mt - 3
                            ","
                            ","
                            subtext2 - regular - 800
                            ","
                            ",3,"
                            title
                            "],["
                            formControlName
                            ","
                            statusledOnOff
                            ",3,"
                            onCheck
                            ","
                            isChecked
                            ","
                            disabled
                            "],["
                            formControlName
                            ","
                            signalledOnOff
                            ",3,"
                            onCheck
                            ","
                            isChecked
                            ","
                            disabled
                            "],[3,"
                            hasBorder
                            ","
                            rowLayout
                            "],["
                            body1 - regular
                            ","
                            ",3,"
                            title
                            "],["
                            formControlName
                            ","
                            bridgeMode
                            ",3,"
                            onCheck
                            ","
                            isChecked
                            ","
                            disabled
                            "],["
                            subtext2 - regular - 800
                            ","
                            ",3,"
                            title
                            "],["
                            pt - 4
                            ","
                            ","

                        class

                            ","
                            separate_dash
                            ",4,"
                            ngIf
                            "],["
                            pb - 4
                            ","
                            ",4,"
                            ngIf
                            "],["
                            pt - 4
                            ","
                            ",1,"
                            separate_dash
                            "],["
                            pb - 4
                            ","
                            "],["
                            formControlName
                            ","
                            enableRRM
                            ",3,"
                            onCheck
                            ","
                            isChecked
                            "],["
                            pt - 4
                            ","
                            ",3,"
                            hasBorder
                            ","
                            rowLayout
                            "],["
                            formControlName
                            ","
                            enablePOE
                            ",3,"
                            onCheck
                            ","
                            isChecked
                            ","
                            isDisabled
                            "],["
                            mb - 4
                            ","
                            ",3,"
                            labelAlign
                            ","
                            hasBorder
                            ","
                            rowLayout
                            ",4,"
                            ngIf
                            "],["
                            mb - 4
                            ","
                            ",3,"
                            labelAlign
                            ","
                            hasBorder
                            ","
                            rowLayout
                            "],["
                            mt - 4
                            ","
                            ","
                            subtext2 - regular - 800
                            ","
                            ",3,"
                            title
                            "],["
                            outline
                            ","
                            button - lightBlue
                            ","
                            size
                            ","
                            medium
                            ",3,"
                            click
                            ","
                            title
                            ","
                            isDisabled
                            "],["
                            ml - 2
                            ","
                            ","
                            outline
                            ","
                            button - lightRed
                            ","
                            size
                            ","
                            medium
                            ",3,"
                            click
                            ","
                            title
                            ","
                            isDisabled
                            "],["
                            size
                            ","
                            small
                            ","
                            outline
                            ","
                            primary
                            ",3,"
                            bgColor
                            ","
                            outline
                            ","
                            title
                            ","
                            isDisabled
                            ","
                            click
                            ",4,"
                            ngIf
                            "],["
                            size
                            ","
                            small
                            ","
                            outline
                            ","
                            primary
                            ",3,"
                            click
                            ","
                            bgColor
                            ","
                            outline
                            ","
                            title
                            ","
                            isDisabled
                            "],[3,"
                            isToggleEnable
                            ","
                            toggleDisable
                            ","
                            caption
                            "],["
                            mb - 3
                            ","
                            ","
                            h2 - bold
                            ","
                            ",3,"
                            title
                            "],["

                        class

                            ","
                            simple - list
                            ",3,"
                            isTitleBody1Bold
                            ","
                            title
                            ","
                            subtextUp
                            ",4,"
                            ngIf
                            "],[1,"
                            simple - list
                            ",3,"
                            isTitleBody1Bold
                            ","
                            title
                            ","
                            subtextUp
                            "],[3,"
                            closeDialog
                            ","
                            dialogConfig
                            "],["
                            pvModelContent
                            ","
                            "],[1,"
                            device__form - control
                            "],["
                            formControlName
                            ","
                            friendlyname
                            ","
                            size
                            ","
                            LARGE
                            "],[3,"
                            label
                            ","
                            value
                            ",4,"
                            ngFor
                            ","
                            ngForOf
                            "],["
                            mt - 4
                            ","
                            ",3,"
                            click
                            ","
                            title
                            "],[3,"
                            label
                            ","
                            value
                            "],["
                            mb - 2
                            ","
                            ","
                            text - bold - medium3
                            ","
                            ",3,"
                            title
                            "],["
                            formControlName
                            ","
                            customname
                            ",3,"
                            onModelChange
                            ","
                            isValidated
                            ","
                            errorMessage
                            ","
                            isAutoFocus
                            ","
                            hideErrorIcon
                            ","
                            maxlength
                            "],["
                            mb - 4
                            ","
                            ","
                            subtext1 - regular
                            ","
                            ",2,"
                            position
                            ","
                            relative
                            ","
                            top
                            "," - 12
                            px
                            ",3,"
                            title
                            "]],template:function(o,n){1&o&&(e.j41(0,"
                            div
                            ",3)(1,"
                            div
                            ",4)(2,"
                            pv - card
                            ")(3,"
                            div
                            ",5)(4,"
                            div
                            ",6)(5,"
                            div
                            "),e.nrm(6,"
                            pv - vector
                            ",7),e.k0s(),e.j41(7,"
                            div
                            ",8),e.nrm(8,"
                            pv - text
                            ",9),e.k0s()(),e.j41(9,"
                            div
                            ",10)(10,"
                            div
                            ",11),e.DNE(11,ge,1,0,"
                            pv - vector
                            ",12),e.k0s()()()(),e.DNE(12,fe,5,3,"
                            pv - card
                            ",13)(13,ve,3,4,"
                            pv - card
                            ",14)(14,Ne,4,4,"
                            pv - card
                            ",15)(15,ye,12,8,"
                            pv - card
                            ",14)(16,Ve,7,5,"
                            form
                            ",16)(17,$e,6,5,"
                            pv - card
                            ",14)(18,We,3,6,"
                            pv - card
                            ",14),e.k0s(),e.j41(19,"
                            div
                            ",17),e.DNE(20,rt,14,13,"
                            pv - card
                            ",14)(21,ut,8,7,"
                            pv - card
                            ",14),e.k0s(),e.DNE(22,ft,11,10,"
                            pv - dialog
                            ",18),e.k0s()),2&o&&(e.R7$(6),e.Y8G("
                            name
                            ",n.setDeviceModel("
                            0
                            "==n.selectedExtender.isRoot?n.selectedExtender.HostName:n.api.type,null!=n.selectedExtender&&n.selectedExtender.MACAddress?null==n.selectedExtender?null:n.selectedExtender.MACAddress:"
                            ")),e.R7$(),e.Y8G("
                            ngClass
                            ",n.api.device_capability.getVal("
                            wifi
                            ","
                            networkMap
                            ","
                            deviceInfoDetails
                            ","
                            editButton
                            ").isOn?"
                            device - edit
                            ":"
                            "),e.R7$(),e.Y8G("
                            title
                            ","
                            0
                            "==(null==n.selectedExtender?null:n.selectedExtender.isRoot)?n.getAvailableName():"
                            1
                            "!=(null==n.selectedExtender?null:n.selectedExtender.isRoot)||n.api.isSFUDevice?n.getRootName():(n.extenderConnected?n.constants.ROOT_LABEL+" - ":"
                            ")+n.getRootName()),e.R7$(3),e.Y8G("
                            ngIf
                            ",n.api.device_capability.getVal("
                            wifi
                            ","
                            networkMap
                            ","
                            deviceInfoDetails
                            ","
                            editButton
                            ").isOn&&!(null!=n.selectedExtender&&n.selectedExtender.HostName.includes("
                            ALCL
                            "))),e.R7$(),e.Y8G("
                            ngIf
                            ",n.api.device_capability.getVal("
                            wifi
                            ","
                            networkMap
                            ","
                            deviceInfoDetails
                            ","
                            connectionSignal
                            ").isOn),e.R7$(),e.Y8G("
                            ngIf
                            ",n.connectedData),e.R7$(),e.Y8G("
                            ngIf
                            ",n.api.device_capability.getVal("
                            wifi
                            ","
                            networkMap
                            ","
                            deviceInfoDetails
                            ","
                            extenderConnection
                            ").isOn&&!n.isRoot&&(null==n.selectedExtender?null:n.selectedExtender.connectedtofriendlyName)),e.R7$(),e.Y8G("
                            ngIf
                            ",(n.showLEDforMTK||n.isRoot&&n.prodcfg.supportsFWADevice||n.isRoot&&n.showSignalLed||n.showBridgeModeCard||n.showEnableRRM||n.isPOESupported||!n.prodcfg.supportsFWADevice&&!n.isRoot&&(null==n.selectedExtender||null==n.selectedExtender.MACAddress?null:n.selectedExtender.MACAddress.length)&&n.isOnline)&&!n.api.isSFUDevice),e.R7$(),e.Y8G("
                            ngIf
                            ",n.isRoot),e.R7$(),e.Y8G("
                            ngIf
                            ","
                            0
                            "==(null==n.selectedExtender?null:n.selectedExtender.isRoot)&&n.api.device_capability.getVal("
                            wifi
                            ","
                            networkMap
                            ","
                            deviceInfoDetails
                            ","
                            removeAPButton
                            ").isOn),e.R7$(),e.Y8G("
                            ngIf
                            ",n.toggleData),e.R7$(2),e.Y8G("
                            ngIf
                            ",n.isRoot),e.R7$(),e.Y8G("
                            ngIf
                            ",!n.isRoot),e.R7$(),e.Y8G("
                            ngIf
                            ",n.showEditWifiPtFlow))},dependencies:[D.YU,D.Sq,D.bT,c.qT,c.BC,c.cb,c.tU,p.Ns,p.xJ,p.Sp,p.XL,p.hO,p.v9,p.oN,p.X,p.H9,p.RA,p.Od,c.j4,c.JD,se,s,r,S,M,x,re,pe,D.Jj],styles:['form[_ngcontent-%COMP%]   hr[_ngcontent-%COMP%]{border:0;border-top:1px solid var(--pure-color-neutral-30)}.separate_dash[_ngcontent-%COMP%]{content:"
                            ";border-bottom:1px solid var(--pure-color-neutral-30);width:100%;display:flex;margin:auto}.device-edit[_ngcontent-%COMP%]{display:flex}.pencil-edit[_ngcontent-%COMP%]{position:relative}.device__form-control[_ngcontent-%COMP%]{width:378px}']})}return i})()},1580:(_e,Y,E)=>{E.d(Y,{X:()=>ae});var e=E(4438),b=E(7365),c=E(9417),k=E(6261),T=E(8934),P=E(4493),U=E(8882),R=E(8100),$=E(6425),p=E(6452),W=E(1989),X=E(6279),L=E(177);const A=h=>({height:h}),D=h=>({linear:h});function j(h,C){if(1&h){const s=e.RV6();e.qex(0),e.j41(1,"
                            li
                            ",17)(2,"
                            a
                            ",18)(3,"
                            div
                            ",12),e.bIt("
                            click
                            ",function(){const r=e.eBV(s).$implicit,_=e.XpG(15);return e.Njj(_.onMapClick(r))}),e.nrm(4,"
                            pv - vector
                            ",13)(5,"
                            pv - text
                            ",7)(6,"
                            pv - text
                            ",8),e.k0s()()(),e.bVm()}if(2&h){const s=C.$implicit,a=e.XpG(15);e.R7$(),e.BMQ("
                            no - lines
                            ",1==s.childSubElements.length||null),e.R7$(3),e.Y8G("
                            name
                            ",s.signalIndicator),e.R7$(),e.Y8G("
                            title
                            ",s.name),e.R7$(),e.Y8G("
                            title
                            ",a.getNodeText(s.nodeSubText))}}function F(h,C){if(1&h&&(e.qex(0),e.j41(1,"
                            ul
                            ",19),e.DNE(2,j,7,4,"
                            ng - container
                            ",16),e.k0s(),e.bVm()),2&h){const s=e.XpG().$implicit;e.R7$(),e.BMQ("
                            single - node
                            ",1==s.childSubElements.length||null),e.R7$(),e.Y8G("
                            ngForOf
                            ",s.childSubElements)}}function H(h,C){if(1&h){const s=e.RV6();e.qex(0),e.j41(1,"
                            li
                            ",17)(2,"
                            a
                            ",18)(3,"
                            div
                            ",12),e.bIt("
                            click
                            ",function(){const r=e.eBV(s).$implicit,_=e.XpG(13);return e.Njj(_.onMapClick(r))}),e.nrm(4,"
                            pv - vector
                            ",13)(5,"
                            pv - text
                            ",7)(6,"
                            pv - text
                            ",8),e.k0s()(),e.DNE(7,F,3,2,"
                            ng - container
                            ",14),e.k0s(),e.bVm()}if(2&h){const s=C.$implicit,a=e.XpG(13);e.R7$(),e.BMQ("
                            no - lines
                            ",1==s.childSubElements.length||null),e.R7$(3),e.Y8G("
                            name
                            ",s.signalIndicator),e.R7$(),e.Y8G("
                            title
                            ",s.name),e.R7$(),e.Y8G("
                            title
                            ",a.getNodeText(s.nodeSubText)),e.R7$(),e.Y8G("
                            ngIf
                            ",s.childSubElements&&s.childSubElements.length)}}function q(h,C){if(1&h&&(e.qex(0),e.j41(1,"
                            ul
                            ",19),e.DNE(2,H,8,5,"
                            ng - container
                            ",16),e.k0s(),e.bVm()),2&h){const s=e.XpG().$implicit;e.R7$(),e.BMQ("
                            single - node
                            ",1==s.childSubElements.length||null),e.R7$(),e.Y8G("
                            ngForOf
                            ",s.childSubElements)}}function K(h,C){if(1&h){const s=e.RV6();e.qex(0),e.j41(1,"
                            li
                            ",17)(2,"
                            a
                            ",18)(3,"
                            div
                            ",12),e.bIt("
                            click
                            ",function(){const r=e.eBV(s).$implicit,_=e.XpG(11);return e.Njj(_.onMapClick(r))}),e.nrm(4,"
                            pv - vector
                            ",13)(5,"
                            pv - text
                            ",7)(6,"
                            pv - text
                            ",8),e.k0s()(),e.DNE(7,q,3,2,"
                            ng - container
                            ",14),e.k0s(),e.bVm()}if(2&h){const s=C.$implicit,a=e.XpG(11);e.R7$(),e.BMQ("
                            no - lines
                            ",1==s.childSubElements.length||null),e.R7$(3),e.Y8G("
                            name
                            ",s.signalIndicator),e.R7$(),e.Y8G("
                            title
                            ",s.name),e.R7$(),e.Y8G("
                            title
                            ",a.getNodeText(s.nodeSubText)),e.R7$(),e.Y8G("
                            ngIf
                            ",s.childSubElements&&s.childSubElements.length)}}function z(h,C){if(1&h&&(e.qex(0),e.j41(1,"
                            ul
                            ",19),e.DNE(2,K,8,5,"
                            ng - container
                            ",16),e.k0s(),e.bVm()),2&h){const s=e.XpG().$implicit;e.R7$(),e.BMQ("
                            single - node
                            ",1==s.childSubElements.length||null),e.R7$(),e.Y8G("
                            ngForOf
                            ",s.childSubElements)}}function J(h,C){if(1&h){const s=e.RV6();e.qex(0),e.j41(1,"
                            li
                            ",17)(2,"
                            a
                            ",18)(3,"
                            div
                            ",12),e.bIt("
                            click
                            ",function(){const r=e.eBV(s).$implicit,_=e.XpG(9);return e.Njj(_.onMapClick(r))}),e.nrm(4,"
                            pv - vector
                            ",13)(5,"
                            pv - text
                            ",7)(6,"
                            pv - text
                            ",8),e.k0s()(),e.DNE(7,z,3,2,"
                            ng - container
                            ",14),e.k0s(),e.bVm()}if(2&h){const s=C.$implicit,a=e.XpG(9);e.R7$(),e.BMQ("
                            no - lines
                            ",1==s.childSubElements.length||null),e.R7$(3),e.Y8G("
                            name
                            ",s.signalIndicator),e.R7$(),e.Y8G("
                            title
                            ",s.name),e.R7$(),e.Y8G("
                            title
                            ",a.getNodeText(s.nodeSubText)),e.R7$(),e.Y8G("
                            ngIf
                            ",s.childSubElements&&s.childSubElements.length)}}function Q(h,C){if(1&h&&(e.qex(0),e.j41(1,"
                            ul
                            ",19),e.DNE(2,J,8,5,"
                            ng - container
                            ",16),e.k0s(),e.bVm()),2&h){const s=e.XpG().$implicit;e.R7$(),e.BMQ("
                            single - node
                            ",1==s.childSubElements.length||null),e.R7$(),e.Y8G("
                            ngForOf
                            ",s.childSubElements)}}function Z(h,C){if(1&h){const s=e.RV6();e.qex(0),e.j41(1,"
                            li
                            ",17)(2,"
                            a
                            ",18)(3,"
                            div
                            ",12),e.bIt("
                            click
                            ",function(){const r=e.eBV(s).$implicit,_=e.XpG(7);return e.Njj(_.onMapClick(r))}),e.nrm(4,"
                            pv - vector
                            ",13)(5,"
                            pv - text
                            ",7)(6,"
                            pv - text
                            ",8),e.k0s()(),e.DNE(7,Q,3,2,"
                            ng - container
                            ",14),e.k0s(),e.bVm()}if(2&h){const s=C.$implicit,a=e.XpG(7);e.R7$(),e.BMQ("
                            no - lines
                            ",1==s.childSubElements.length||null),e.R7$(3),e.Y8G("
                            name
                            ",s.signalIndicator),e.R7$(),e.Y8G("
                            title
                            ",s.name),e.R7$(),e.Y8G("
                            title
                            ",a.getNodeText(s.nodeSubText)),e.R7$(),e.Y8G("
                            ngIf
                            ",s.childSubElements&&s.childSubElements.length)}}function ee(h,C){if(1&h&&(e.qex(0),e.j41(1,"
                            ul
                            ",19),e.DNE(2,Z,8,5,"
                            ng - container
                            ",16),e.k0s(),e.bVm()),2&h){const s=e.XpG().$implicit;e.R7$(),e.BMQ("
                            single - node
                            ",1==s.childSubElements.length||null),e.R7$(),e.Y8G("
                            ngForOf
                            ",s.childSubElements)}}function te(h,C){if(1&h){const s=e.RV6();e.qex(0),e.j41(1,"
                            li
                            ",17)(2,"
                            a
                            ",18)(3,"
                            div
                            ",12),e.bIt("
                            click
                            ",function(){const r=e.eBV(s).$implicit,_=e.XpG(5);return e.Njj(_.onMapClick(r))}),e.nrm(4,"
                            pv - vector
                            ",13)(5,"
                            pv - text
                            ",7)(6,"
                            pv - text
                            ",8),e.k0s()(),e.DNE(7,ee,3,2,"
                            ng - container
                            ",14),e.k0s(),e.bVm()}if(2&h){const s=C.$implicit,a=e.XpG(2).$implicit,r=e.XpG(3);e.R7$(),e.BMQ("
                            no - lines
                            ",1==a.childSubElements.length||null),e.R7$(3),e.Y8G("
                            name
                            ",s.signalIndicator),e.R7$(),e.Y8G("
                            title
                            ",s.name),e.R7$(),e.Y8G("
                            title
                            ",r.getNodeText(s.nodeSubText)),e.R7$(),e.Y8G("
                            ngIf
                            ",s.childSubElements&&s.childSubElements.length)}}function ie(h,C){if(1&h&&(e.qex(0),e.j41(1,"
                            ul
                            ",19),e.DNE(2,te,8,5,"
                            ng - container
                            ",16),e.k0s(),e.bVm()),2&h){const s=e.XpG().$implicit;e.R7$(),e.BMQ("
                            single - node
                            ",1==s.childSubElements.length||null),e.R7$(),e.Y8G("
                            ngForOf
                            ",s.childSubElements)}}function se(h,C){if(1&h){const s=e.RV6();e.qex(0),e.j41(1,"
                            li
                            ",17)(2,"
                            a
                            ",18)(3,"
                            div
                            ",12),e.bIt("
                            click
                            ",function(){const r=e.eBV(s).$implicit,_=e.XpG(3);return e.Njj(_.onMapClick(r))}),e.nrm(4,"
                            pv - vector
                            ",13)(5,"
                            pv - text
                            ",7)(6,"
                            pv - text
                            ",8),e.k0s()(),e.DNE(7,ie,3,2,"
                            ng - container
                            ",14),e.k0s(),e.bVm()}if(2&h){const s=C.$implicit,a=e.XpG(3);e.R7$(4),e.Y8G("
                            name
                            ",s.signalIndicator),e.R7$(),e.Y8G("
                            title
                            ",s.name),e.R7$(),e.Y8G("
                            title
                            ",a.getNodeText(s.nodeSubText)),e.R7$(),e.Y8G("
                            ngIf
                            ",s.childSubElements&&s.childSubElements.length)}}function ne(h,C){if(1&h&&(e.qex(0),e.j41(1,"
                            ul
                            ",15),e.DNE(2,se,8,4,"
                            ng - container
                            ",16),e.k0s(),e.bVm()),2&h){const s=e.XpG(2);e.R7$(),e.Y8G("
                            ngClass
                            ",e.eq3(2,D,1==s.beaconData.meshTreeData.rootChildElements.length)),e.R7$(),e.Y8G("
                            ngForOf
                            ",s.beaconData.meshTreeData.rootChildElements)}}function oe(h,C){if(1&h){const s=e.RV6();e.j41(0,"
                            div
                            ",1),e.bIt("
                            click
                            ",function(){e.eBV(s);const r=e.XpG();return e.Njj(!r.wifiSupport&&"
                            "!==r.pageName&&r.api.device_capability.getVal("
                            wifi
                            ","
                            visibility
                            ").isOn&&r.api.device_capability.getVal("
                            wifi
                            ","
                            networkMap
                            ","
                            visibility
                            ").isOn?r.gotoNetworkMap():"
                            ")}),e.j41(1,"
                            pinch - zoom
                            ")(2,"
                            ul
                            ",2)(3,"
                            li
                            ",3)(4,"
                            a
                            ",4),e.nrm(5,"
                            pv - vector
                            ",5)(6,"
                            pv - vector
                            ",6)(7,"
                            pv - text
                            ",7)(8,"
                            pv - text
                            ",8),e.k0s(),e.j41(9,"
                            ul
                            ",9)(10,"
                            li
                            ",10)(11,"
                            a
                            ",11)(12,"
                            div
                            ",12),e.bIt("
                            click
                            ",function(){e.eBV(s);const r=e.XpG();return e.Njj(r.onMapClick(r.beaconData.meshTreeData))}),e.nrm(13,"
                            pv - vector
                            ",13)(14,"
                            pv - text
                            ",7)(15,"
                            pv - text
                            ",8),e.k0s()()(),e.DNE(16,ne,3,4,"
                            ng - container
                            ",14),e.k0s()()()()()}if(2&h){const s=e.XpG();e.Y8G("
                            ngStyle
                            ",e.eq3(8,A,s.networkMapChildCount>2?"
                            100 % ":"
                            inherit
                            ")),e.R7$(6),e.Y8G("
                            name
                            ",s.deviceInternetStatusGlobal?"
                            green_circle
                            ":"
                            red_circle
                            "),e.R7$(),e.Y8G("
                            title
                            ",s.constants.INTERNET),e.R7$(),e.Y8G("
                            title
                            ",s.deviceInternetStatusGlobal?s.constants.ONLINE_LABEL:s.constants.OFFLINE_LABEL),e.R7$(5),e.Y8G("
                            name
                            ",s.beaconData.meshTreeData.signalIndicator),e.R7$(),e.Y8G("
                            title
                            ",s.beaconData.meshTreeData.name),e.R7$(),e.Y8G("
                            title
                            ",s.getNodeText(s.beaconData.meshTreeData.nodeSubText)),e.R7$(),e.Y8G("
                            ngIf
                            ",s.beaconData.meshTreeData.rootChildElements&&s.beaconData.meshTreeData.rootChildElements.length)}}let ae=(()=>{class h{constructor(s,a,r,_,u,m,S,M,G){this.api=s,this.constants=a,this.pubSubService=r,this.portalService=_,this.route=u,this.pureViewSnackbarService=m,this.alertUtil=S,this.utility=M,this.logger=G,this.openDetails=new e.bkB,this.fetchNetworkData=!1,this.pageName="
                            ",this.wifiSupport=!1,this.isChildComponent=!1,this.stopLoader=new e.bkB,this.meshdataLoaded=new e.bkB,this.beaconData={},this.notDetectedMesh=[],this.beaconDetailList=[],this.wifiPointsList=[],this.dashboardMeshNetworkInfo={aps:[]},this.networkMapChildCount=0,this.deviceInternetStatusGlobal=!1,this.ponStatus=!1,this.ConnectionStatus5G=!1,this.ConnectionStatus4G=!1,this.connectionStatus=!1,this.showCellularOrEthernet="
                            ",this.isSerialNumValidated=!0,this.SerialErrorMessage="
                            ",this.serialNumber="
                            ",this.rgwSerialNoList=[],this.beaconEntriesList=[],this.ntwTopoList=[],this.countApiSuccess=0,this.countApiFailure=0,this.wanIPAddress="
                            ",this.wanIPv6Address="
                            ",this.showDetails=!1,this.tempNetworkDetailsData=null,this.isLoading=!1,this.addNewWifiPointModalShow=!1,this.addNewWifiPoint=!1,this.showModalCloseBtn=!1,this.dialogConfig={width:"
                            400
                            px
                            ",isBackdropClickClose:!1,title:this.constants.ADD_WIFI_POINT}}gotoNetworkMap(){this.route.navigateByUrl(" / wifi / network - map
                            ")}ngOnChanges(s){s.fetchNetworkData&&s.fetchNetworkData
                                .currentValue && this.loadNetworkMap(!0)
                    }
                    ngOnInit()
                    {
                        console.log("Page NAme", this.pageName), this.showLoader(), this.ntwTopoList = [], this.initForm(), !this.api.router_info?.gwmodel.includes("Beacon") && !this.api.router_info.gwmodel.includes("AAP321NK") && !this.api.isFWADevice && ("" == this.api.get_optical_status?.Status ? this.api.request(this, "getOpticalStatus") : (this.ponStatus = "" !== this.api.get_optical_status?.Status && "UP" == this.api.get_optical_status?.Status?.toUpperCase(), setTimeout(() => {
                            this.api.request(this, "getOpticalStatus")
                        }, 1e3))), this.wanIPAddress = this.api.hardware_status.wan_ip_status[0].ExternalIPAddress, this.wanIPv6Address = this.api.hardware_status.wan_ip_status[0].ExternalIPv6Address, this.api.hardware_status.wan_ip_status.length && this.wanStatus(this.api.hardware_status), this.api.get_home_ntw_topo?.aps.length && this.setBackhaulNodes(this.api.get_home_ntw_topo), this.api.device_status?.device_cfg.length || this.getFriendlyNameDeviceName(), this.api.isFWADevice && this.api.get_radio_access_status_fwa_gw.cell_5G_stats_cfg.length && this.setFWAGW(this.api.get_radio_access_status_fwa_gw), this.loadNetworkMap(!this.isChildComponent), this.refreshPage(), this.onLanguageChanges()
                    }
                    hideLoader()
                    {
                        this.isLoading = !1, this.alertUtil.hideContentModalLoader(), this.stopLoader.emit(!0)
                    }
                    showLoader()
                    {
                        this.isLoading = !0, this.alertUtil.showContentModalLoader()
                    }
                    onLanguageChanges()
                    {
                        this.langChangeSub = this.pubSubService.subscribe(k.VR.LANGUAGE_CHANGE, s => {
                            this.loadNetworkMap(!1), this.dialogConfig = {
                                width: "400px",
                                isBackdropClickClose: !0,
                                showHeaderClose: !0,
                                title: this.constants.ADD_WIFI_POINT
                            }, this.api.get_home_ntw_topo?.aps.length && this.setBackhaulNodes(this.api.get_home_ntw_topo)
                        })
                    }
                    getFriendlyNameDeviceName()
                    {
                        this.api.get_home_ntw_topo?.aps.length && this.setBackhaulNodes(this.api.get_home_ntw_topo)
                    }
                    refreshPage()
                    {
                        this.pageRefreshSub = this.pubSubService.subscribe(k.VR.HEADER_REFRESH_CLICKED, s => {
                            this.pageName || (this.isLoading = !0, this.alertUtil.showContentModalLoader(), this.loadNetworkMap(!0))
                        })
                    }
                    reloadDeviceDetails()
                    {
                        this.tempNetworkDetailsData && (this.isLoading = !0, this.alertUtil.showContentModalLoader(), this.countApiSuccess + this.countApiFailure == 3 && (this.onMapClick(this.tempNetworkDetailsData), setTimeout(() => {
                            this.alertUtil.hideContentModalLoader(), this.isLoading = !1
                        }, 300)))
                    }
                    onMapClick(s)
                    {
                        this.tempNetworkDetailsData = s, this.logger.console(s), this.ntwTopoList = this.api.network_tpl_status.ntwtopo_cfg.sort((_, u) => u.isRoot - _.isRoot);
                        const a = this.ntwTopoList.filter(_ => s.macAddress === _.MACAddress || s.MACAddress === _.MACAddress);
                        let r;
                        if (this.api.selectedExtender = a[0], this.ntwTopoList.length > 0 && "0" == this.ntwTopoList[0]?.isRoot && a[0]?.SerialNumber == this.ntwTopoList[0]?.SerialNumber && (this.api.selectedExtender.isRoot = 2), s?.OnboardStatus && "NotDetected" == s?.OnboardStatus && s?.isOnline && "0" == s?.isOnline && (s.isRoot = 0, s.HostName = s?.name ? s?.name : s?.SerialNumber, s.name = s.HostName, a.push(s), this.api.selectedExtender = a[0]), r = this.api.isFWADevice ? this.api.get_device_info.X_ASB_COM_FriendlyName ? this.api.get_device_info.X_ASB_COM_FriendlyName : this.api.get_device_info.ModelName : this.api.get_device_info.getRootFriendlyNameIfAvailable_(this.api.get_device_info.ModelName, this.api.get_device_info.X_ASB_COM_FriendlyName, this.api.get_home_ntw_topo.getRootMacAddress()), a.length > 0) {
                            const u = this.utility.formatNetworkMapData(this.api.get_home_ntw_topo)?.aps.find((S, M) => S?.macaddress === this.api.selectedExtender?.MACAddress);
                            let m = "";
                            if (u) {
                                const S = this.api.network_tpl_status.getDeviceNameIfLong(u?.modelName);
                                m = this.api.network_tpl_status.getBeaconFriendlyName(this.api.home_ntw_status.alias_cfg, this.api.selectedExtender.MACAddress, S), ("BEACON 3.2" == S.toUpperCase() || "BEACON3.2" == S.toUpperCase()) && (m = m.replace(S, u?.modelName))
                            }
                            this.showDetails = !0, this.openDetails.emit(!0), this.constants.SHOW_BACK_BUTTON = !0, this.constants.PAGE_TITLE_PARENT = this.constants.SERVICE_OVERVIEW_WIFI + " / " + this.constants.NETWORK_MAP, this.constants.PAGE_TITLE = 1 == this.api.selectedExtender.isRoot ? r : m || s?.name, this.api.selectedExtender.friendlyName = 1 == this.api.selectedExtender.isRoot ? r : m || s?.name, this.api.selectedExtender.connectedtofriendlyName = s?.connectedToNode, this.api.selectedExtender.connectedBand = s?.connectedBand, this.api.selectedExtender.MACAddress = s?.macAddress ? s?.macAddress : s?.MACAddress ? s?.MACAddress : ""
                        } else "root" == s.role && (this.api.selectedExtender = {
                            isRoot: 1,
                            isOnline: 1
                        }, this.showDetails = !0, this.openDetails.emit(!0), this.constants.SHOW_BACK_BUTTON = !0, this.constants.PAGE_TITLE_PARENT = this.constants.SERVICE_OVERVIEW_WIFI + " / " + this.constants.NETWORK_MAP, this.constants.PAGE_TITLE = r, this.api.selectedExtender.friendlyName = r || this.api.selectedExtender?.MACAddress, this.api.selectedExtender.MACAddress = this.ntwTopoList[0]?.MACAddress ? this.ntwTopoList[0]?.MACAddress : "");
                        this.api.selectedExtender.nodeSubText = s?.nodeSubText, this.api.selectedExtender.apsName = s?.apsName, this.api.selectedExtender.modelName = s?.modelName, this.api.selectedExtender.isConnectionOk = "root" !== s.role || this.deviceInternetStatusGlobal || this.ponStatus || this.api.isFWADevice && (this.ConnectionStatus5G || this.ConnectionStatus4G), this.logger.console(this.api.selectedExtender)
                    }
                    loadNetworkMap(s)
                    {
                        this.countApiSuccess = 0, this.countApiFailure = 0, s ? (this.api.request(this, "getRadioAccessStatusFWAGW"), this.api.request(this, "getHomeNtwTopo"), this.api.request(this, "getNetworkTplStatus"), this.api.request(this, "getHardwareStatus"), this.api.request(this, "getMeshInfo"), this.api.request(this, "getDeviceInfo"), this.api.request(this, "getHomeNetworkStatus", {loaderTimeout: this.constants.TIMEOUT_1_MINUTE})) : (this.api.get_home_ntw_topo?.aps.length && this.setBackhaulNodes(this.api.get_home_ntw_topo), this.api.hardware_status.wan_ip_status.length && this.wanStatus(this.api.hardware_status), "" !== this.api.get_optical_status.Status && this.syncPonStatus(this.api.get_optical_status), this.api?.get_device_info?.SerialNumber && this.getFriendlyNameDeviceName(), this.api.network_tpl_status.ntwtopo_cfg.length && this.syncNtwTopoData(this.api.network_tpl_status), this.api?.get_mesh_info.beacon_detail.length && this.api.get_mesh_info.beaconEntries.length && this.syncMeshData(this.api?.get_mesh_info), this.api.isFWADevice && this.api.get_radio_access_status_fwa_gw.cell_5G_stats_cfg.length && this.setFWAGW(this.api.get_radio_access_status_fwa_gw))
                    }
                    setFWAGW(s)
                    {
                        const r = s?.cell_5G_stats_cfg[0]?.stat?.RSRPCurrent,
                            _ = s?.cell_LTE_stats_cfg[0]?.stat?.RSRPCurrent,
                            m = -32768 !== _ ? this.constants.CONNECTED_LABEL : this.constants.NOT_CONNECTED_LABEL;
                        this.ConnectionStatus5G = (-32768 !== r ? this.constants.CONNECTED_LABEL : this.constants.NOT_CONNECTED_LABEL) == this.constants.CONNECTED_LABEL, this.ConnectionStatus4G = m == this.constants.CONNECTED_LABEL;
                        const S = s?.WAN[0].Mode, M = s?.WAN[0].ActiveWAN;
                        this.showCellularOrEthernet = M, "" == M && (this.showCellularOrEthernet = "CellularOnly" == S || "ActiveStandbyWithCellularHigh" == S ? "Cellular" : "EthernetOnly" == S || "ActiveStandbyWithEthernetHigh" == S ? "Ethernet" : "Cellular")
                    }
                    initForm()
                    {
                        this.addWifiPointForm = new c.gE({serialNumber1: new c.MJ("", c.k0.required)})
                    }
                    get
                    serialNumber1()
                    {
                        return this.addWifiPointForm.get("serialNumber1")
                    }
                    onUsernameModelChange(s, a)
                    {
                        this.serialNumber = s ? s.trim() : ""
                    }
                    openAddWifiPointModal()
                    {
                        this.addNewWifiPointModalShow = !0, ("BWDS" === this.api.g_opId || "BATL" === this.api.g_opId && this.api.device_capability.getVal("wifi", "networkMap", "showAddSerialNumberModal").isOn) && (this.addNewWifiPoint = !0, this.serialNumber1.reset())
                    }
                    closeDialog()
                    {
                        this.addNewWifiPointModalShow = !1, this.addNewWifiPoint = !1, this.showModalCloseBtn = !1, this.serialNumber1.reset()
                    }
                    continueWithWebGui()
                    {
                        this.addNewWifiPoint = !0, this.showModalCloseBtn = !0
                    }
                    addNewWifiPointDetails()
                    {
                        this.isSerialNumValidated = !0, this.SerialErrorMessage = "", this.validateSerialNumber() && this.api.request(this, "setMeshInfo", `SerialNumber=${this.serialNumber}`)
                    }
                    validateSerialNumber()
                    {
                        let r = 0, _ = 0, u = 0;
                        return this.serialNumber.length < 12 || this.serialNumber.length > 32 ? (this.isSerialNumValidated = !1, this.SerialErrorMessage = this.constants.ERR_LEN_SERIAL_NUM, !1) : /^[A-Za-z0-9]+$/.test(this.serialNumber.slice(4)) ? (this.rgwSerialNoList.forEach(m => {
                            m.SerialNumber.toLowerCase() !== this.serialNumber.toLowerCase() || (_ = 1)
                        }), 1 === _ ? (this.isSerialNumValidated = !1, this.SerialErrorMessage = this.constants.ERR_SERIAL_SAME_RGW, !1) : (this.beaconDetailList.forEach(m => {
                            m.SerialNumber.toLowerCase() !== this.serialNumber.toLowerCase() || (r = 1)
                        }), 1 === r ? (this.isSerialNumValidated = !1, this.SerialErrorMessage = this.constants.ERR_SERIAL_EXIST, !1) : (this.beaconEntriesList.forEach(m => {
                            +m.BeaconNumberofEntries >= +m.MaxNumberOfBeacons && (u = 1)
                        }), 1 !== u || (this.isSerialNumValidated = !1, this.SerialErrorMessage = this.constants.ERR_MAX_ENTRIES, !1)))) : (this.isSerialNumValidated = !1, this.SerialErrorMessage = this.constants.ERR_SERIAL_SPL_CHAR, !1)
                    }
                    syncNtwTopoData(s)
                    {
                        if (this.ntwTopoList = [], s && s.ntwtopo_cfg) for (const _ of s.ntwtopo_cfg) this.ntwTopoList.push(_);
                        const a = this.ntwTopoList[0],
                            r = this.ntwTopoList.slice(1).sort((_, u) => u.HostName < _.HostName ? 1 : -1);
                        null != a && null != r ? this.ntwTopoList = [a, ...r] : null != a ? this.ntwTopoList = [a] : null != r && (this.ntwTopoList = [...r]), this.logger.console(this.ntwTopoList)
                    }
                    syncMeshData(s)
                    {
                        this.notDetectedMesh = [], this.beaconDetailList = [], this.wifiPointsList = s?.wifipoint_list ? s?.wifipoint_list : [];
                        const a = s?.beacon_detail || [];
                        let r = "";
                        null != s.root_info && s.root_info.length > 0 && (r = s.root_info[0].RootMacAddress);
                        for (const _ of a) console.log("1", _.MACAddress), (r != _.MACAddress && "" != r && this.ifPresentBeaconInfo(_.SerialNumber, 0) || "" == r) && (console.log("2", _.MACAddress), this.beaconDetailList.push(_));
                        for (let _ = 0; _ < this.beaconDetailList.length; _++) {
                            this.beaconDetailList[_].name = "";
                            let u = !1;
                            this.beaconData?.meshTreeData?.rootChildElements?.forEach(m => {
                                this.beaconDetailList[_].MACAddress.toUpperCase() == m.macAddress.toUpperCase() && (this.beaconDetailList[_].name = m.name || "", this.beaconDetailList[_].modelName = m?.modelName ? this.api.network_tpl_status.getDeviceNameIfLong(m?.modelName) : "", "online" == m.connectionStatus && (u = !0))
                            }), u || this.notDetectedMesh.push(this.beaconDetailList[_])
                        }
                        this.api.setNetworkMapData(this.beaconData, this.notDetectedMesh), this.meshdataLoaded.emit(this.api.getNetworkMapData()), this.logger.console(this.notDetectedMesh)
                    }
                    ifPresentBeaconInfo(s, a)
                    {
                        return !this.wifiPointsList.length || (a ? !!this.wifiPointsList?.find((_, u) => _?.MACAddress === s)?.MACAddress : !!this.wifiPointsList?.find((_, u) => _?.SerialNumber === s)?.SerialNumber)
                    }
                    setBackhaulNodes(s)
                    {
                        const a = this.utility.formatNetworkMapData(s);
                        this.hideLoader();
                        const r = a;
                        for (var _ = 0; _ < r?.aps.length; _++) {
                            r.aps[_].meshbackhaulnodes = [], r.aps[_].connetedTo = [];
                            const u = r?.aps.filter(m => "root" !== m.role && m.backhaulmac === r?.aps[_].macaddress);
                            for (const m of u) "root" !== r?.aps[_]?.role && r?.aps[_]?.connetedTo.push(m.backhaulmac), r?.aps[_].meshbackhaulnodes.push(m.id)
                        }
                        this.dashboardMeshNetworkInfo = r, this.beaconData = this.getNetworkDevices()
                    }
                    getNetworkDevices()
                    {
                        this.networkMapChildCount = 0;
                        const s = {meshTreeData: {}, notConnectedDevices: [], averageDevices: [], connectedDevices: []};
                        let a = {};
                        const r = this.dashboardMeshNetworkInfo, _ = r?.aps.filter(u => "root" === u.role);
                        if (r?.aps.map(u => {
                            if ("Beacon" == u.modelName && (u.modelName = "Beacon 1"), "root" != u.role && ("bad" === this.getBeaconQuality(u) || "offline" === this.getBeaconQuality(u)) && _ && _.length && _[0].meshbackhaulnodes.indexOf(u.id) < 0 && _[0].meshbackhaulnodes.push(u.id), _ && _.length) {
                                a = this.getMeshTopoInfo(_[0]), a.role = "root", a.apsLength = r?.aps.length, a.rootChildElements = [];
                                for (let m = 0; m < a.apsLength; m++) {
                                    const S = r?.aps[m];
                                    for (let M = 0; M < S.meshbackhaulnodes.length; M++) {
                                        const G = r?.aps.filter(x => x.id === S.meshbackhaulnodes[M]);
                                        G && G.length && "root" === S.role && a.rootChildElements.push(this.getChildInfo(r?.aps, G[0]))
                                    }
                                }
                            }
                        }), null == a.apsLength) {
                            const u = this.api.network_tpl_status.getDeviceNameIfLong(this.api.get_device_info.ModelName),
                                S = this.deviceInternetStatusGlobal || this.ponStatus || this.api.isFWADevice && (this.ConnectionStatus5G || this.ConnectionStatus4G) ? this.api.network_tpl_status.getNodeImageGreen(u) : this.api.network_tpl_status.getNodeImageRed(u),
                                M = !(!this.api.router_info.gwmodel.includes("Beacon") && !this.api.router_info.gwmodel.includes("AAP321NK"));
                            s.meshTreeData = {
                                name: this.api.get_device_info.getRootFriendlyNameIfAvailable(u, this.api.get_device_info.X_ASB_COM_FriendlyName),
                                nodeSubText: this.getNodeStatus(M, this.ponStatus),
                                role: "root",
                                signalIndicator: S
                            }
                        } else s.meshTreeData = a;
                        return s.meshTreeData.rootChildElements && s.meshTreeData.rootChildElements.length && (this.networkMapChildCount = this.utility.getDepth(s.meshTreeData.rootChildElements), this.logger.console("NETWORK MAP CHILD", this.networkMapChildCount)), s
                    }
                    getChildInfo(s, a)
                    {
                        const r = this.getMeshTopoInfo(a);
                        r.childSubElements = [];
                        for (let _ = 0; _ < a.meshbackhaulnodes.length; _++) {
                            const u = s.filter(m => m.id === a.meshbackhaulnodes[_]);
                            u && u.length && "root" !== u[0].role && "online" === u[0].status && r.childSubElements.push(this.getChildInfo(s, u[0]))
                        }
                        return r
                    }
                    getBeaconQuality(s)
                    {
                        if (s["isbackhaul-connected"] && "online" === s.status) {
                            const r = s.backhaulQuality ? s.backhaulQuality.toUpperCase() : "";
                            return "GOOD" === r ? "good" : "NORMAL" === r ? "normal" : "poor"
                        }
                        return "offline" === s.status ? "offline" : "bad"
                    }
                    getMeshTopoInfo(s)
                    {
                        const a = this.api.network_tpl_status.getDeviceNameIfLong(s.modelName);
                        let r = "";
                        if ("root" === s.role) {
                            if (this.api.isFWADevice) var _ = this.api.get_device_info.X_ASB_COM_FriendlyName ? this.api.get_device_info.X_ASB_COM_FriendlyName : s?.modelName; else _ = this.api.get_device_info.getRootFriendlyNameIfAvailable_(this.api.get_device_info.ModelName, this.api.get_device_info.X_ASB_COM_FriendlyName, this.api.get_home_ntw_topo.getRootMacAddress());
                            r = _
                        } else {
                            const I = this.api.network_tpl_status.getDeviceNameIfLong(s?.modelName);
                            r = this.api.network_tpl_status.getBeaconFriendlyName(this.api.home_ntw_status.alias_cfg, s.macaddress, I), ("BEACON 3.2" == I.toUpperCase() || "BEACON3.2" == I.toUpperCase()) && (r = r.replace(I, s?.modelName))
                        }
                        let u, S, M, G, x = [];
                        const y = !(!this.api.router_info.gwmodel.includes("Beacon") && !this.api.router_info.gwmodel.includes("AAP321NK"));
                        if (s["isbackhaul-connected"] && "online" === s.status && (this.deviceInternetStatusGlobal || this.ponStatus || this.api.isFWADevice && (this.ConnectionStatus5G || this.ConnectionStatus4G) || "root" !== s.role)) {
                            const I = s.backhaulQuality ? s.backhaulQuality.toUpperCase() : "";
                            "GOOD" === I ? (u = this.api.network_tpl_status.getNodeImageGreen(a), S = "root" === s.role ? this.getNodeStatus(y, this.ponStatus) : "strongSignal") : "NORMAL" === I ? (u = this.api.network_tpl_status.getNodeImageGreen(a), S = "root" === s.role ? this.getNodeStatus(y, this.ponStatus) : "normalSignal") : (u = "root" === s.role ? this.api.network_tpl_status.getNodeImageGreen(a) : this.api.network_tpl_status.getNodeImageYellow(a), S = "root" === s.role ? this.getNodeStatus(y, this.ponStatus) : "poorSignal"), M = s.status
                        } else u = this.api.network_tpl_status.getNodeImageRed(a), S = "root" === s.role ? this.getNodeStatus(y, this.ponStatus) : "notConnected", M = s.status;
                        if ("root" != s.role) {
                            const I = this.api.network_tpl_status.ntwtopo_cfg.find(B => B.MACAddress == s.backhaulmac && "1" == B.isRoot),
                                le = this.api.network_tpl_status.getDeviceNameIfLong(s.modelName);
                            let O = this.api.network_tpl_status.getBeaconFriendlyName(this.api.home_ntw_status.alias_cfg, s.backhaulmac, le);
                            if (O.toUpperCase().includes
                            ("BEACON 3.2") || O.toUpperCase().includes("BEACON3.2")) {
                                const B = O.toUpperCase().split("BEACON 3.2");
                                B[0] = s.modelName, O = B.join("")
                            }
                            const ce = this.api.get_device_info.getRootFriendlyNameIfAvailable_(this.api.get_device_info.ModelName, this.api.get_device_info.X_ASB_COM_FriendlyName, this.api.get_home_ntw_topo.getRootMacAddress());
                            O = I ? ce : O || b.n.convertMac(s.backhaulmac), G = O, x = [...s.mediumList]
                        }
                        return {
                            name: r || b.n.convertMac(s.macaddress) || s.name,
                            apsName: s?.name,
                            modelName: s?.modelName,
                            macAddress: s?.macaddress,
                            nodeSubText: S,
                            signalIndicator: u,
                            globeIndicator: void 0,
                            connectionStatus: M,
                            connectedToNode: G,
                            connectedBand: x
                        }
                    }
                    getNodeText(s)
                    {
                        let a = "";
                        switch (s) {
                            case"wanPortUp":
                                a = this.constants.WAN_PORT_UP;
                                break;
                            case"wanPortDown":
                                a = this.constants.WAN_PORT_DOWN;
                                break;
                            case"linkUp5G":
                                a = this.constants.LINK_UP_5G;
                                break;
                            case"linkUp4G":
                                a = this.constants.LINK_UP_4G;
                                break;
                            case"ethWanPortUp":
                                a = this.constants.ETHERNET_LABEL + " " + this.constants.WAN_PORT_UP;
                                break;
                            case"linkDown5G":
                                a = this.constants.LINK_DOWN_5G;
                                break;
                            case"ethWanPortDown":
                                a = this.constants.ETHERNET_LABEL + " " + this.constants.WAN_PORT_DOWN;
                                break;
                            case"ponPortUp":
                                a = this.constants.PON_PORT_UP;
                                break;
                            case"ponPortDown":
                                a = this.constants.PON_PORT_DOWN;
                                break;
                            case"strongSignal":
                                a = this.constants.SIGNAL_STRENGTH_GOOD;
                                break;
                            case"normalSignal":
                                a = this.constants.SIGNAL_STRENGTH_NORMAL;
                                break;
                            case"poorSignal":
                                a = this.constants.SIGNAL_STRENGTH_POOR;
                                break;
                            case"notConnected":
                                a = this.constants.NOT_CONNECTED_LABEL;
                                break;
                            default:
                                a = ""
                        }
                        return a
                    }
                    getNodeStatus(s, a)
                    {
                        let r = "";
                        return r = s ? "Up" == this.api.hardware_status.wan_port_status[0]?.Status ? "wanPortUp" : "wanPortDown" : this.deviceInternetStatusGlobal ? this.api.isFWADevice ? this.ConnectionStatus5G && "Ethernet" !== this.showCellularOrEthernet ? "linkUp5G" : this.ConnectionStatus4G && "Ethernet" !== this.showCellularOrEthernet ? "linkUp4G" : "ethWanPortUp" : a ? "ponPortUp" : "ponPortDown" : s ? "wanPortDown" : this.api.isFWADevice ? this.ConnectionStatus5G && "Ethernet" !== this.showCellularOrEthernet ? "linkUp5G" : this.ConnectionStatus4G && "Ethernet" !== this.showCellularOrEthernet ? "linkUp4G" : "Ethernet" !== this.showCellularOrEthernet ? "linkDown5G" : "ethWanPortDown" : a ? "ponPortUp" : "ponPortDown", r
                    }
                    syncPonStatus(s)
                    {
                        this.ponStatus = "" !== s?.Status && "UP" == s?.Status?.toUpperCase(), this.setBackhaulNodes(this.api.get_home_ntw_topo)
                    }
                    wanStatus(s)
                    {
                        s?.wan_ip_status && (this.wanIPAddress = s?.wan_ip_status[0]?.ExternalIPAddress, this.wanIPv6Address = s?.wan_ip_status[0]?.ExternalIPv6Address);
                        let a = !1;
                        a = 1 === this.api.brEnable ? !!this.api.hardware_status.lan_status[0].IPInterfaceIPAddress : (this.api.hardware_status.wan_ip_status[0]?.ExternalIPAddress || this.api.hardware_status.wan_ip_status[0]?.ExternalIPv6Address) && !!this.api.hardware_status.wan_ip_status[0].gwwanup, this.deviceInternetStatusGlobal = a, this.api.get_home_ntw_topo?.aps.length && this.setBackhaulNodes(this.api.get_home_ntw_topo)
                    }
                    onSuccess(s)
                    {
                        const a = s.data;
                        switch (this.setBackhaulNodes(this.api.get_home_ntw_topo), s.action) {
                            case k.En.GET_ROUTER_INFO:
                                break;
                            case k.En.GET_MESH_INFO:
                                this.syncMeshData(a), this.rgwSerialNoList = this.api.get_mesh_info.is_rgwSerialNo, this.beaconDetailList = this.api.get_mesh_info.beacon_detail, this.beaconEntriesList = this.api.get_mesh_info.beaconEntries;
                                break;
                            case k.En.SET_MESH_INFO:
                                this.logger.console("Set Mesh Info CGI success "), this.addNewWifiPointModalShow = !1, this.api.request(this, "getMeshInfo");
                                break;
                            case k.En.GET_HOME_NTW_TOPO:
                                this.setBackhaulNodes(a), this.api.overview_status.network_map.aps = this.api.get_home_ntw_topo?.aps, this.countApiSuccess += 1;
                                break;
                            case k.En.GET_NTW_TP_STATUS:
                                this.syncNtwTopoData(a), this.api.overview_status.ntwtopo_cfg = this.api.network_tpl_status.ntwtopo_cfg, this.countApiSuccess += 1;
                                break;
                            case k.En.GET_OVERVIEW_STATUS:
                                this.wanStatus(a), this.countApiSuccess += 1;
                                break;
                            case k.En.GET_OPTICAL_STATUS:
                                this.syncPonStatus(a);
                                break;
                            case k.En.GET_DEVICE_INFO:
                                break;
                            case k.En.GET_HOME_NTW_STATUS:
                                this.api.get_home_ntw_topo?.aps.length && this.setBackhaulNodes(this.api.get_home_ntw_topo);
                                break;
                            case k.En.GET_RADIO_ACCESS_STATUS_FWA_GW:
                                this.setFWAGW(this.api.get_radio_access_status_fwa_gw)
                        }
                        this.reloadDeviceDetails()
                    }
                    onError(s)
                    {
                        switch (s.action) {
                            case k.En.GET_MESH_INFO:
                                console.error("GET_MESH_INFO Failed - Error"), console.error(s);
                                break;
                            case k.En.SET_MESH_INFO:
                                this.addNewWifiPointModalShow = !1, console.error("SET_MESH_INFO API Failed - Error"), console.error(s);
                                break;
                            case k.En.GET_HOME_NTW_TOPO:
                                console.error("GET_HOME_NTW_TOPO Failed - Error"), console.error(s), this.setBackhaulNodes(this.api.get_home_ntw_topo), this.countApiFailure += 1;
                                break;
                            case k.En.GET_NTW_TP_STATUS:
                                console.error("GET_NTW_TP_STATUS Failed - Error"), console.error(s), this.countApiFailure += 1;
                                break;
                            case k.En.GET_OVERVIEW_STATUS:
                                this.countApiFailure += 1;
                                break;
                            case k.En.GET_OPTICAL_STATUS:
                                console.error("GET_OPTICAL_STATUS API Failed - Error"), console.error(s);
                                break;
                            case k.En.GET_DEVICE_INFO:
                                console.error("GET_DEVICE_INFO API Failed - Error"), console.error(s);
                                break;
                            case k.En.GET_HOME_NTW_STATUS:
                                console.error("GET_HOME_NTW_STATUS API Failed - Error"), console.error(s)
                        }
                        this.reloadDeviceDetails()
                    }
                    ngOnDestroy()
                    {
                        this.pureViewSnackbarService.hideMessageSnackbar(), this.alertUtil.hideContentModalLoader(), this.tempNetworkDetailsData = null, this.constants.SHOW_BACK_BUTTON = !1, this.pageRefreshSub?.unsubscribe(), this.langChangeSub?.unsubscribe()
                    }
                    static
                    #e = this.\u0275fac = function (a) {
                        return new (a || h)(e.rXU(T.G), e.rXU(P.YM), e.rXU(U.Q), e.rXU(R._), e.rXU($.Ix), e.rXU(p.gd), e.rXU(W.l), e.rXU(b.n), e.rXU(X.V))
                    };
                    static
                    #t = this.\u0275cmp = e.VBU({
                        type: h,
                        selectors: [["app-network-topology"]],
                        inputs: {
                            fetchNetworkData: "fetchNetworkData",
                            pageName: "pageName",
                            wifiSupport: "wifiSupport",
                            isChildComponent: "isChildComponent"
                        },
                        outputs: {
                            openDetails: "openDetails",
                            stopLoader: "stopLoader",
                            meshdataLoaded: "meshdataLoaded"
                        },
                        features: [e.OA$],
                        decls: 1,
                        vars: 1,
                        consts: [["mt-2", "", "class", "networkmap__network-map overviewscroll", 3, "ngStyle", "click", 4, "ngIf"], ["mt-2", "", 1, "networkmap__network-map", "overviewscroll", 3, "click", "ngStyle"], ["p-7", "", "m-0", "", 1, "tree"], ["no-lines", ""], [1, "globe"], ["width", "32", "height", "32", "name", "globe"], ["width", "16", "height", "16", 3, "name"], ["pt-2", "", "color", "gray-900", "subtext2-bold", "", 3, "title"], ["pt-0-2", "", "color", "gray-700", "caption2-regular", "", 3, "title"], ["p-0", "", "pt-4", ""], [1, "align-center"], ["pt-9", "", "pb-4", ""], [1, "mapClickArea", 3, "click"], ["width", "36", "height", "36", 3, "name"], [4, "ngIf"], ["p-0", "", "pt-4", "", 1, "align-inline", 3, "ngClass"], [4, "ngFor", "ngForOf"], ["px-1", ""], ["pt-7", "", "pb-4", ""], ["p-0", "", "pt-4", "", 1, "parent-to-child-center-align"]],
                        template: function (a, r) {
                            1 & a && e.DNE(0, oe, 17, 10, "div", 0), 2 & a && e.Y8G("ngIf", r.beaconData.meshTreeData)
                        },
                        dependencies: [L.YU, L.Sq, L.bT, L.B3, p.v9, p.oN],
                        styles: [".networkmap__network-map[_ngcontent-%COMP%]{max-height:640px;width:100%;display:flex;justify-content:center;align-items:center}.networkmap__vertically-center[_ngcontent-%COMP%]{overflow:auto;flex:1 1 100%;display:flex;align-items:center}.networkmap__full-height[_ngcontent-%COMP%]{height:640px}.networkmap__zoom[_ngcontent-%COMP%]{width:73px;height:32px;display:flex;background-color:var(--pure-color-gray-200);border-radius:var(--pure-dimension-2);align-items:center;align-self:flex-end}.overviewscroll[_ngcontent-%COMP%]::-webkit-scrollbar{width:4px;height:4px}.overviewscroll[_ngcontent-%COMP%]::-webkit-scrollbar-track{background:transparent}.overviewscroll[_ngcontent-%COMP%]::-webkit-scrollbar-thumb{background:var(--pure-color-gray-400);border-radius:2px}.mapClickArea[_ngcontent-%COMP%]{cursor:pointer}.height-auto[_ngcontent-%COMP%]{height:100%}"]
                    })
                }

                return
                h
            }

        )
            ()
        }
    }]);