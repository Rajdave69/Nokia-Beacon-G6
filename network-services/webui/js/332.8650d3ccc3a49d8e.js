"use strict";
(self.webpackChunknokiawifi = self.webpackChunknokiawifi || []).push([[332], {
    2332: (q, T, a) => {
        a.r(T), a.d(T, {MainModule: () => $});
        var E = a(177), u = a(6452), I = a(6939), t = a(4438);
        let N = (() => {
            class n {
                static #t = this.\u0275fac = function (s) {
                    return new (s || n)
                };
                static #e = this.\u0275mod = t.$C({type: n});
                static #i = this.\u0275inj = t.G2t({imports: [u.gG, I.jc, E.MD]})
            }

            return n
        })();
        var l = a(6261), C = a(8882), f = a(6425), m = a(8934), b = a(4493);
        let v = (() => {
            class n {
                constructor(e) {
                    this.pubSubService = e
                }

                resolve(e, s) {
                    this.pubSubService.publish(l.VR.SHOW_HEADER_REFRESH_BUTTON, !0)
                }

                static #t = this.\u0275fac = function (s) {
                    return new (s || n)(t.KVO(C.Q))
                };
                static #e = this.\u0275prov = t.jDH({token: n, factory: n.\u0275fac, providedIn: "root"})
            }

            return n
        })(), g = (() => {
            class n {
                constructor(e) {
                    this.route = e
                }

                resolve(e, s) {
                    return new Promise((i, o) => {
                        const r = localStorage.getItem("needPasswordModify");
                        if (r && parseInt(r)) this.route.navigate(["./changePassword"]), o(!0); else {
                            const d = localStorage.getItem("needWifiPwdModify");
                            d && parseInt(d) ? (this.route.navigate(["./changeWifiPassword"]), o(!0)) : i(!0)
                        }
                    })
                }

                static #t = this.\u0275fac = function (s) {
                    return new (s || n)(t.KVO(f.Ix))
                };
                static #e = this.\u0275prov = t.jDH({token: n, factory: n.\u0275fac, providedIn: "root"})
            }

            return n
        })(), p = (() => {
            class n {
                constructor(e, s, i) {
                    this.pubSubService = e, this.api = s, this.constants = i
                }

                resolve(e, s) {
                    if (!this.api.device_capability?.isDataAvailable) {
                        const i = new Promise((r, d) => {
                            this.api.request({
                                onSuccess: c => {
                                    r(c.data)
                                }, onError: c => {
                                    console.error("GET_CAPABILITY API Failed - Error"), console.error(c), d(c)
                                }
                            }, "getDeviceCapability")
                        }), o = new Promise((r, d) => {
                            this.api.request({
                                onSuccess: c => {
                                    r(c.data)
                                }, onError: c => {
                                    console.error("GET_Dashboard_Status API Failed - Error"), console.error(c), d(c)
                                }
                            }, "getHardwareStatus")
                        });
                        return Promise.all([i, o]).then(r => {
                            console.log("COMMON SERVICE:MAIN CGIs are loaded SuccessFully!!!")
                        }).catch(r => {
                            console.log("COMMON SERVICE: FAILED to load the main CGIS Error.")
                        })
                    }
                }

                static #t = this.\u0275fac = function (s) {
                    return new (s || n)(t.KVO(C.Q), t.KVO(m.G), t.KVO(b.YM))
                };
                static #e = this.\u0275prov = t.jDH({token: n, factory: n.\u0275fac, providedIn: "root"})
            }

            return n
        })();
        var L = a(2377);

        class A {
            constructor(h = !0, e = [], s = {label: "English", value: "en"}, i = [], o = "Administrator") {
                this.showAvatar = h, this.langOptions = e, this.selectedLang = s, this.menuList = i, this.role = o
            }
        }

        var S = a(1471), R = a(6279), y = a(4796), O = a(2960), k = a(7365), _ = a(7410);

        function M(n, h) {
            if (1 & n) {
                const e = t.RV6();
                t.j41(0, "pv-vector", 8), t.bIt("click", function () {
                    t.eBV(e);
                    const i = t.XpG();
                    return t.Njj(i.goToDashboard())
                }), t.k0s()
            }
        }

        function D(n, h) {
            if (1 & n) {
                const e = t.RV6();
                t.j41(0, "pv-vector", 9), t.bIt("click", function () {
                    t.eBV(e);
                    const i = t.XpG();
                    return t.Njj(i.goToDashboard())
                }), t.k0s()
            }
        }

        function w(n, h) {
            if (1 & n && (t.j41(0, "div", 10), t.nrm(1, "pv-button", 11), t.k0s()), 2 & n) {
                const e = t.XpG();
                t.R7$(), t.Y8G("customClass", "btn-icon-left cursor-default")("iconStart", "info_outline_red")("title", e.constants.WAN_BRIDGE_MODE)("bgColor", "caution2")
            }
        }

        let G = (() => {
            class n {
                constructor(e, s, i, o, r, d, c, z, Q, J, Z) {
                    this.logger = e, this.api = s, this.route = i, this.authService = o, this.pubSubService = r, this.constants = d, this.gconfig = c, this.language = z, this.utility = Q, this.prodcfg = J, this.document = Z, this.sideNavDetails = new A, this.hideGRETunnel = !1, this.menuList = [], this.isDualBand = !1, this.isTriBand = !1, this.showTR369 = !1, this.LogoError = !1, this.hideUSBPage = !1, this.hideGameModePage = !1, this.hidePagesForBridgeMode = !1, this.showUpnpDlna = !1, this.logoSvgAvailable = !1, this.isBTTE = !1, this.isTMMY = !1, this.showContainerPage = !1, this.isSpeedTestDataCalled = !1, this.iscapabilityLoaded = !1, this.localStorageSideMenuList = [], this.showSpeedTest = !1, this.hideSyslog = !1, this.isRealtekONT = !1, this.isOverviewCGICalled = !1, this.isSupportIPsec = !1, this.isContainerAPPCGILoaded = !1, this.isSupportGuestNetwork = !0, this.isBATL = !1, this.hidePortTriggerPage = !1, this.langVal = localStorage.getItem("lang") ? localStorage.getItem("lang") : "en", this.localStorageSideMenuList = localStorage.getItem("sideMenuList") ? JSON.parse(localStorage.getItem("sideMenuList")) : [], this.localStorageSideMenuList.length ? (this.menuList = [...this.localStorageSideMenuList], this.setNavSelection()) : this.setMenu(), this.isAdminUser = "Admin" === localStorage.getItem("userMode"), "" !== this.api.router_info.gwmodel ? this.loadRouterInfo(this.api) : this.api.request(this, "getRouterInfo")
                }

                ngOnInit() {
                    const e = localStorage.getItem("sideNavLogo") ? localStorage.getItem("sideNavLogo") : "";
                    this.svgElementFromString(e), this.api.request(this, "getSvgColorsData"), this.api.request(this, "getContainerData"), this.getUbusRequest(), this.pubSubService.subscribe(l.VR.LANGUAGE_CHANGE, i => {
                        this.iscapabilityLoaded ? (this.setMenu(), this.sideMenuCapabilityCheck()) : (this.menuList = [...this.localStorageSideMenuList], this.setNavSelection())
                    });
                    const s = localStorage.getItem("color_theme") ? localStorage.getItem("color_theme") : "blue";
                    b.YM.IS_COLOR_THEME_BLUE = "blue" === s
                }

                svgElementFromString(e) {
                    try {
                        if (e) {
                            const s = this.document.getElementById("demo");
                            if (s) return s.innerHTML = e, this.logoSvgAvailable = !0, s.querySelector("svg") || this.document.createElementNS("http://www.w3.org/2000/svg", "path");
                            {
                                const i = document.getElementsByClassName("side-nav__logo")[0],
                                    o = document.getElementsByClassName("side-nav__logo")[1];
                                if (i) {
                                    i.removeChild(o);
                                    const r = document.createElement("p");
                                    r.setAttribute("id", "demo"), r.style.margin = "41px 0 0 15px", r.style.position = "absolute", r.innerHTML = e, i.appendChild(r)
                                }
                            }
                        } else {
                            this.logoSvgAvailable = !1, b.YM.IS_COLOR_FILE_AVAILABLE = !1;
                            const s = document.getElementById("demo");
                            s && s.parentNode.removeChild(s)
                        }
                    } catch (s) {
                        this.logger.console("Error in setting logo", s)
                    }
                }

                decryptUserName(e, s) {
                    const i = S.enc.Utf8.parse(e), o = S.enc.Utf8.parse(e);
                    return S.AES.decrypt(s, i, {
                        keySize: 16,
                        iv: o,
                        mode: S.mode.CBC,
                        padding: S.pad.Pkcs7
                    }).toString(S.enc.Utf8)
                }

                pictureError() {
                    this.LogoError = !0
                }

                goToDashboard() {
                    this.route.navigateByUrl("/overview")
                }

                menuClick(e) {
                    "overview" == e.routerLink ? this.pubSubService.publish(l.VR.OVERVIEW_BACK_EVENT) : "wan/wan-services" == e.routerLink ? this.pubSubService.publish(l.VR.WAN_BACK_EVENT) : "wan/wan-statistics" == e.routerLink ? this.pubSubService.publish(l.VR.WAN_STATISTICS_BACK_EVENT) : "wifi/wifi-networks" == e.routerLink ? this.pubSubService.publish(l.VR.WIFI_BACK_EVENT) : "wifi/network-map" == e.routerLink ? this.pubSubService.publish(l.VR.NETWORK_MAP_BACK_EVENT) : "devices" == e.routerLink ? this.pubSubService.publish(l.VR.CONNECTED_DEVICE_BACK_EVENT) : "security/ip-filter" == e.routerLink ? this.pubSubService.publish(l.VR.IP_FILTER_BACK_EVENT) : "security/family-profiles" == e.routerLink && this.pubSubService.publish(l.VR.PTRL_CTRL_BACK_EVENT), this.route.navigateByUrl("/" + e.routerLink)
                }

                logout(e) {
                    confirm(this.constants.LOGOUT_CONFIRMATION) && this.authService.logout()
                }

                langChange(e, s) {
                    localStorage.setItem("lang", e), this.language.setLang1(!0, e), this.setMenu(), this.setNavSelection()
                }

                setNavSelectionOnLangChange() {
                    const e = this.navEvent;
                    if (this.menuList.forEach(s => {
                        s.selected = !1, s.showSubmenu = !1, s.subMenuList && s.subMenuList.forEach(i => {
                            i.selected = !1, i.showSubmenu = !1
                        })
                    }), e.parentMenu.routerLink) {
                        const s = this.menuList.filter(i => i.routerLink === e.parentMenu.routerLink)[0];
                        s && (s.selected = !0, s.subMenuList && (s.showSubmenu = !0))
                    }
                    if (e.subMenu && e.parentMenu.routerLink) {
                        const s = this.menuList.filter(i => i.routerLink === e.parentMenu.routerLink)[0];
                        s?.subMenuList && (s.showSubmenu = !0), this.menuList.forEach(i => {
                            if (i.subMenuList) {
                                const o = i.subMenuList.filter(r => r.routerLink === e.subMenu.routerLink)[0];
                                o && (o.selected = !0)
                            }
                        })
                    }
                }

                setNavSelection() {
                    this.pubSubService.subscribe(l.VR.NAV_CHANGED, e => {
                        if (this.showcontainermenuLink(), this.api.device_capability.getVal("application", "visibility").isOn && this.api.device_capability.getVal("application", "usb", "visibility").isOn && !this.hideUSBPage && (this.menuList[8].subMenuList[4].visibility = !!this.prodcfg.supportsFWADevice || !!this.api.hardware_status?.usb_support?.enabled), this.navEvent = e, this.menuList.forEach(s => {
                            s.selected = !1, s.showSubmenu = !1, s.subMenuList && s.subMenuList.forEach(i => {
                                i.selected = !1, i.showSubmenu = !1
                            })
                        }), e.parentMenu.routerLink) {
                            const s = this.menuList.filter(i => i.routerLink === e.parentMenu.routerLink)[0];
                            s && (s.selected = !0, s.subMenuList && (s.showSubmenu = !0))
                        }
                        if (e.subMenu && e.parentMenu.routerLink) {
                            const s = this.menuList.filter(i => i.routerLink === e.parentMenu.routerLink)[0];
                            s?.subMenuList && (s.showSubmenu = !0), this.menuList.forEach(i => {
                                if (i.subMenuList) {
                                    const o = i.subMenuList.filter(r => r.routerLink === e.subMenu.routerLink)[0];
                                    o && (o.selected = !0)
                                }
                            })
                        }
                    })
                }

                loadRouterInfo(e) {
                    this.isBTTE = "BTTE" === this.api?.g_opId, this.isTMMY = "TMMY" === this.api?.g_opId, this.isBATL = "BATL" === this.api?.g_opId, this.showTR369 = this.prodcfg.supportsFWADevice || this.api.isSupportTR181, this.hideGRETunnel = this.prodcfg.notSupportGRETunnel, this.hideUSBPage = !this.prodcfg.supportUSB, this.hideMessages = !this.prodcfg.supportsFWADevice, this.hideCellConfiguration = !this.prodcfg.supportsFWADevice, this.hideGameModePage = !this.prodcfg.supportGameMode, this.isRealtekONT = this.prodcfg.isRealtekONT, this.showUpnpDlna = this.prodcfg.supportUpnpDlna, this.isSupportIPsec = this.prodcfg.isSupportIPSec, this.logger.console("F-sec - " + this.api.isFsecureAppActive(this.api.get_container_info)), this.showContainerPage = this.prodcfg.supportContainerManagmnt, this.hidePagesForBridgeMode = this.api.brEnable, this.hidePortTriggerPage = this.prodcfg.hidePortTrigger, this.hideSyslog = this.prodcfg.isSyslogSupport, this.api.device_capability.isDataAvailable ? this._applyConfigurationForMenuSubMenuItems() : this.api.request(this, "getDeviceCapability"), this.api.request(this, "getWanConfigInfo")
                }

                hideForBridgeMode(e) {
                    const s = ["wanServices", "wanStatistics", "staticRouting", "qoSSetting", "ipSecTunnel", "usClassifier", "dhcpIpv4", "dhcpIpv6", "dns", "firewall", "macFilter", "ipFilter", "urlFilter", "parentalControl", "dmzAndAlg", "portForwarding", "portTriggering", "ddns", "upnpAndDlna", "troubleshooting", "diagnostics"];
                    return this.api.brEnable && !this.api.device_capability.getVal("wan", "tr069", "visibility").isOn && s.push("wan"), this.api.brEnable && !this.api.device_capability.getVal("security", "accessControl", "visibility").isOn && s.push("security"), !(!this.hidePagesForBridgeMode || -1 === s.indexOf(e.toString()))
                }

                hideForReceiver(e) {
                    if (!this.prodcfg.isFWAReceiver) return !1;
                    const s = ["wifi", "qoSSetting", "ipSecTunnel", "usClassifier", "dns", "macFilter", "urlFilter", "parentalControl", "portTriggering", "upnpAndDlna", "messages", "voice", "usb"];
                    return ("5Gmm28-B" === this.api.type || "5Gmm29-B" === this.api.type || "5Gmm01-A" === this.api.type) && s.push("ddns"), this.api.get_apn.apnRouteModeExists(this.api.get_apn_list) || s.push("dhcpIpv4", "dhcpIpv6", "firewall", "ipFilter", "dmzAndAlg", "portForwarding", "staticRouting"), -1 !== s.indexOf(e.toString()) || void 0
                }

                getUbusRequest() {
                    this.prodcfg.isFWAReceiver && (this.api.createBody("GetAPN"), this.api.request({
                        onSuccess: e => {
                            this.api.get_apn_list = e.data.FunctionResult.APNList, this._applyConfigurationForMenuSubMenuItems()
                        }, onError: e => {
                        }
                    }, "callUBUS"))
                }

                sideMenuCapabilityCheck() {
                    this.menuList.forEach(e => {
                        const s = this.api.device_capability.getVal(e.key, "visibility");
                        this.hideForBridgeMode(e.key) || this.hideForReceiver(e.key) || this.hideMessages && "messages" == e.key || this.prodcfg.nonWifiBoards && "wifi" == e.key ? (e.visibility = !1, e.isDisabled = !0) : (e.visibility = s.isOn, e.isDisabled = s.isDisabled), e.subMenuList && e.subMenuList.length && e.subMenuList.forEach(i => {
                            const o = this.api.device_capability.getVal(e.key, i.key, "visibility");
                            !this.isSupportIPsec && "ipSecTunnel" == i.key || this.hideForReceiver(i.key) || this.hideGRETunnel && "greTunnel" == i.key || !this.showTR369 && "tr369" == i.key || !this.showContainerPage && "containerManagement" == i.key || this.hideForBridgeMode(i.key) || this.hideUSBPage && "usb" == i.key || !this.hideSyslog && "syslog" == i.key || this.hideGameModePage && "gameMode" == i.key || !this.prodcfg.supportsFWADevice && "cellularStatus" == i.key || this.hideCellConfiguration && "cellularConfiguration" == i.key || !this.showUpnpDlna && "upnpAndDlna" == i.key || !this.api.isParentalCtlModeNew && "parentalControl" == i.key || !this.isSupportGuestNetwork && "guestNetwork" == i.key || this.hidePortTriggerPage && "portTriggering" == i.key ? (i.visibility = !1, i.isDisabled = !0) : (i.visibility = o.isOn, i.isDisabled = o.isDisabled)
                        }), e.visibility && (e.visibility = this.getSubmenuVisibility(e.key), e.routerLink = this.getVisibleRouterLink(e.key))
                    }), this.isSpeedTestDataCalled || this.isAdminUser || !this.api.device_capability.getVal("troubleshooting", "speedTest", "visibility").isOn ? this.configureSpeedTest(this.api.get_speedtest_info) : this.api.request(this, "getSpeedTestData"), ("#/login" !== window.location.hash || !window.location.href.includes("/login")) && localStorage.setItem("sideMenuList", JSON.stringify(this.menuList))
                }

                showcontainermenuLink() {
                    this.api.device_capability.getVal("security", "parentalControl", "visibility").isOn && this.api.isParentalCtlModeNew ? this.showContainerPage ? !this.isContainerAPPCGILoaded || this.hidePagesForBridgeMode || this.api.isFsecureAppActive(this.api.get_container_info) ? this.menuList[7].subMenuList[4].visibility = !1 : (!this.api.get_container_info?.DeploymentUnit.length && !this.api.get_container_info.ExecutionUnit.length || !this.api.isFsecureAppActive(this.api.get_container_info)) && (this.menuList[7].subMenuList[4].visibility = !0) : this.hidePagesForBridgeMode || (this.menuList[7].subMenuList[4].visibility = !0) : this.menuList[7].subMenuList[4].visibility = !1
                }

                _applyConfigurationForMenuSubMenuItems() {
                    this.sideMenuCapabilityCheck(), this.iscapabilityLoaded = !0, this.setNavSelection(), this.logger.console(this.menuList);
                    const e = this.language._langArray;
                    let s = [];
                    if (this.api.device_capability.isDataAvailable) {
                        const i = this.api.device_capability.chooseLanguage.fields;
                        s = i.filter(o => -1 !== o.visibility), this.sideNavDetails.langOptions = null == i[0]?.label ? e : s
                    }
                    this.langVal = localStorage.getItem("lang") ? localStorage.getItem("lang") : "en", this.sideNavDetails.langOptions.forEach(i => {
                        this.langVal == i.value && (this.sideNavDetails.selectedLang = i, this.language.setLang1(!1, i.value))
                    }), this.logger.info({
                        msg: "Side Nav - Menu List after appiled dev cap",
                        devData: this.menuList
                    }), this.logger.info({msg: "Side Nav - Lang picker", devData: s})
                }

                onSuccess(e) {
                    const s = e.data;
                    switch (e.action) {
                        case l.En.GET_ROUTER_INFO:
                            this.loadRouterInfo(this.api);
                            break;
                        case l.En.GET_DEVICE_CAPABILITY:
                            this.getUbusRequest(), this._applyConfigurationForMenuSubMenuItems(), !this.isSpeedTestDataCalled && !this.isAdminUser && this.api.device_capability.getVal("troubleshooting", "speedTest", "visibility").isOn && (this.isSpeedTestDataCalled = !0, this.api.request({
                                onSuccess: i => {
                                    this.configureSpeedTest(i.data)
                                }, onError: i => {
                                    this.configureSpeedTestFailed(i.error)
                                }
                            }, "getSpeedTestData"));
                            break;
                        case l.En.GET_OVERVIEW_STATUS:
                            this._applyConfigurationForMenuSubMenuItems();
                            break;
                        case l.En.GET_SPEEDTEST_INFO:
                            this.isSpeedTestDataCalled = !0, this.logger.console(s), this.configureSpeedTest(s);
                            break;
                        case l.En.GET_SVG_COLORS:
                            this.svgElementFromString(s.logo_side), localStorage.setItem("sideNavLogo", s.logo_side), localStorage.setItem("loginLogo", s.logo_login), localStorage.setItem("colorcss", s.color_css);
                            break;
                        case l.En.GET_WAN_CONFIG_STATUS:
                            this.utility.setCGNATBannerStatus(s), this.pubSubService.publish(l.VR.CGNAT_BANNER_EVENT);
                            break;
                        case l.En.GET_CONTAINER_INFO:
                            this.isContainerAPPCGILoaded = !0, this.showcontainermenuLink()
                    }
                }

                onError(e) {
                    switch (e.action) {
                        case l.En.GET_ROUTER_INFO:
                            console.error("GET_ROUTER_INFO API Failed - Error"), console.error(e);
                            break;
                        case l.En.GET_DEVICE_CAPABILITY:
                            console.error("GET_DEVICE_CAPABILITY API Failed - Error"), console.error(e), this._applyConfigurationForMenuSubMenuItems();
                            break;
                        case l.En.GET_OVERVIEW_STATUS:
                            console.error("GET_OVERVIEW_STATUS API Failed - Error"), console.error(e);
                            break;
                        case l.En.GET_SPEEDTEST_INFO:
                            this.isSpeedTestDataCalled = !1, console.error("GET_SPEED_TEST_INFO API Failed - Error"), console.error(e);
                            break;
                        case l.En.GET_SVG_COLORS:
                            b.YM.IS_COLOR_FILE_AVAILABLE = !1, console.error("GET_SVG_COLORS API Failed - Error"), console.error(e);
                            break;
                        case l.En.GET_WAN_CONFIG_STATUS:
                            console.error("GET_WAN_CONFIG_STATUS API Failed - Error"), console.error(e);
                            break;
                        case l.En.GET_CONTAINER_INFO:
                            this.isContainerAPPCGILoaded = !0, console.error("GET_CONTAINER_STATUS API Failed - Error"), console.error(e)
                    }
                }

                configureSpeedTest(e) {
                    ("" == e?.download_diag[0]?.DownloadURL || "" == e?.upload_diag[0]?.UploadURL || "" == e?.Host_info[0]?.HostList || !e?.upload_diag[0]?.TimeBasedTestDuration && 1 == e?.upload_diag[0]?.X_ALU_COM_TestFileLength) && (this.menuList.forEach(s => {
                        if ("troubleshooting" == s.key && !this.isAdminUser) {
                            let i = !1;
                            s.subMenuList.forEach(o => {
                                "troubleshootingCounters" == o.key && o.visibility && (i = !0), "speedTest" == o.key && (o.visibility = !1, i || (s.visibility = !1))
                            })
                        }
                    }), this.logger.console(this.menuList), ("#/login" !== window.location.hash || !window.location.href.includes("/login")) && localStorage.setItem("sideMenuList", JSON.stringify(this.menuList)))
                }

                configureSpeedTestFailed(e) {
                    this.isSpeedTestDataCalled = !1, console.error("GET_SPEED_TEST_INFO API Failed - Error"), console.error(e)
                }

                getVisibleRouterLink(e) {
                    const s = this.menuList.find(r => r?.key === e);
                    let i, o = "";
                    return s?.subMenuList ? (i = s?.subMenuList.find(r => 1 == r?.visibility), o = i?.routerLink) : o = s.key, o
                }

                getSubmenuVisibility(e) {
                    const s = this.menuList.find(o => o?.key === e);
                    let i = !0;
                    if (s?.subMenuList) {
                        const o = s?.subMenuList.find(r => 1 == r?.visibility);
                        i = !(!o || !o?.routerLink)
                    } else i = !0;
                    return i
                }

                setMenu() {
                    this.menuList = [{
                        name: this.constants.OVERVIEW_LABEL,
                        routerLink: "overview",
                        selected: !0,
                        breadCrumb: this.constants.OVERVIEW_LABEL,
                        visibility: !0,
                        id: 1,
                        key: "overview",
                        icon: "side_nav_overview",
                        iconsel: "side_nav_overview_sel"
                    }, {
                        name: this.constants.MESSAGES_LABEL,
                        routerLink: "messages",
                        selected: null,
                        breadCrumb: this.constants.MESSAGES_LABEL,
                        visibility: !0,
                        key: "messages",
                        icon: "side_nav_messages"
                    }, {
                        name: this.constants.WAN_NETWORK,
                        routerLink: "wan/wan-services",
                        selected: null,
                        showSubmenu: !1,
                        breadCrumb: this.constants.WAN_NETWORK,
                        visibility: !0,
                        id: 2,
                        key: "wan",
                        icon: "side_nav_wan",
                        subMenuList: [{
                            name: this.constants.CELLULAR_STATUS,
                            routerLink: "wan/cellular-status",
                            selected: !1,
                            breadCrumb: this.constants.WAN_NETWORK + "/" + this.constants.CELLULAR_STATUS,
                            visibility: !0,
                            id: 201,
                            key: "cellularStatus"
                        }, {
                            name: this.constants.CELLULAR_CONFIGURATION,
                            routerLink: "wan/cellular-configuration",
                            selected: !1,
                            breadCrumb: this.constants.WAN_NETWORK + "/" + this.constants.CELLULAR_CONFIGURATION,
                            visibility: !0,
                            id: 200,
                            key: "cellularConfiguration"
                        }, {
                            name: this.constants.WAN_SERVICES,
                            routerLink: "wan/wan-services",
                            selected: !1,
                            breadCrumb: this.constants.WAN_NETWORK + "/" + this.constants.WAN_SERVICES,
                            visibility: !0,
                            id: 201,
                            key: "wanServices"
                        }, {
                            name: this.constants.WAN_STATISTICS,
                            routerLink: "wan/wan-statistics",
                            selected: !1,
                            breadCrumb: this.constants.WAN_NETWORK + "/" + this.constants.WAN_STATISTICS,
                            visibility: !0,
                            id: 201,
                            key: "wanStatistics"
                        }, {
                            name: this.constants.TR069,
                            routerLink: "wan/tr069",
                            selected: !1,
                            breadCrumb: this.constants.WAN_NETWORK + "/" + this.constants.TR069,
                            visibility: !0,
                            id: 201,
                            key: "tr069"
                        }, {
                            name: this.constants.TR369,
                            routerLink: "wan/tr369",
                            selected: !1,
                            breadCrumb: this.constants.WAN_NETWORK + "/" + this.constants.TR369,
                            visibility: !0,
                            id: 202,
                            key: "tr369"
                        }, {
                            name: this.constants.STATIC_ROUTING,
                            routerLink: "wan/static-routing",
                            selected: !1,
                            breadCrumb: this.constants.WAN_NETWORK + "/" + this.constants.STATIC_ROUTING,
                            visibility: !0,
                            id: 203,
                            key: "staticRouting"
                        }, {
                            name: this.constants.OPTICAL_MOD_STATUS,
                            routerLink: "wan/optical-module-status",
                            selected: !1,
                            breadCrumb: this.constants.WAN_NETWORK + "/" + this.constants.OPTICAL_MOD_STATUS,
                            visibility: !0,
                            id: 208,
                            key: "opticsModuleStatus"
                        }, {
                            name: this.constants.QOS_CONFIG,
                            routerLink: "wan/qos-config",
                            selected: !1,
                            breadCrumb: this.constants.WAN_NETWORK + "/" + this.constants.QOS_CONFIG,
                            visibility: !0,
                            id: 314,
                            key: "qoSSetting"
                        }, {
                            name: this.constants.IPSEC_TUNNEL,
                            routerLink: "wan/ipsec-tunnel",
                            selected: !1,
                            breadCrumb: this.constants.WAN_NETWORK + "/" + this.constants.IPSEC_TUNNEL,
                            visibility: !0,
                            id: 315,
                            key: "ipSecTunnel"
                        }, {
                            name: this.constants.US_CLASSIFIER,
                            routerLink: "wan/us-classifier",
                            selected: !1,
                            breadCrumb: this.constants.WAN_NETWORK + "/" + this.constants.US_CLASSIFIER,
                            visibility: !0,
                            id: 316,
                            key: "usClassifier"
                        }, {
                            name: this.constants.GRE_TUNNEL,
                            routerLink: "wan/gre-tunnel",
                            selected: !1,
                            breadCrumb: this.constants.WAN_NETWORK + "/" + this.constants.GRE_TUNNEL,
                            visibility: !0,
                            id: 317,
                            key: "greTunnel"
                        }]
                    }, {
                        name: this.constants.LAN,
                        routerLink: "lan/dhcp-ipv4",
                        selected: !1,
                        breadCrumb: this.constants.LAN,
                        showSubmenu: !1,
                        visibility: !0,
                        id: 3,
                        key: "lan",
                        icon: "side_nav_lan",
                        subMenuList: [{
                            name: this.constants.DHCP_IPV4,
                            routerLink: "lan/dhcp-ipv4",
                            selected: !1,
                            breadCrumb: this.constants.LAN + "/" + this.constants.DHCP_IPV4,
                            visibility: !0,
                            id: 301,
                            key: "dhcpIpv4"
                        }, {
                            name: this.constants.DHCP_IPV6,
                            routerLink: "lan/dhcp-ipv6",
                            selected: !1,
                            breadCrumb: this.constants.LAN + "/" + this.constants.DHCP_IPV6,
                            visibility: !0,
                            id: 302,
                            key: "dhcpIpv6"
                        }, {
                            name: this.constants.DNS,
                            routerLink: "lan/dns",
                            selected: !1,
                            breadCrumb: this.constants.LAN + "/" + this.constants.DNS,
                            visibility: !0,
                            id: 311,
                            key: "dns"
                        }, {
                            name: this.constants.LAN_STATISTICS,
                            routerLink: "lan/lan-statistics",
                            selected: !1,
                            breadCrumb: this.constants.LAN + "/" + this.constants.LAN_STATISTICS,
                            visibility: !0,
                            id: 303,
                            key: "lanStatistics"
                        }]
                    }, {
                        name: this.constants.SERVICE_OVERVIEW_WIFI,
                        routerLink: "wifi/wifi-networks",
                        selected: !1,
                        breadCrumb: this.constants.SERVICE_OVERVIEW_WIFI,
                        showSubmenu: !1,
                        visibility: !0,
                        id: 3,
                        key: "wifi",
                        icon: "side_nav_wifi",
                        subMenuList: [{
                            name: this.constants.WIFI_NETWORK_TITLE,
                            routerLink: "wifi/wifi-networks",
                            selected: !1,
                            breadCrumb: this.constants.SERVICE_OVERVIEW_WIFI + "/" + this.constants.WIFI_NETWORK_TITLE,
                            visibility: !0,
                            id: 301,
                            key: "wifiNetworks"
                        }, {
                            name: this.constants.GUEST_NETWORK_TITLE,
                            routerLink: "wifi/guest-networks",
                            selected: !1,
                            breadCrumb: this.constants.SERVICE_OVERVIEW_WIFI + "/" + this.constants.GUEST_NETWORK_TITLE,
                            visibility: !0,
                            id: 301,
                            key: "guestNetwork"
                        }, {
                            name: this.constants.NETWORK_MAP,
                            routerLink: "wifi/network-map",
                            selected: !1,
                            breadCrumb: this.constants.SERVICE_OVERVIEW_WIFI + "/" + this.constants.NETWORK_MAP,
                            visibility: !0,
                            id: 302,
                            key: "networkMap"
                        }, {
                            name: this.constants.ADVANCED_SETTINGS,
                            routerLink: "wifi/radio-settings",
                            selected: !1,
                            breadCrumb: this.constants.SERVICE_OVERVIEW_WIFI + "/" + this.constants.ADVANCED_SETTINGS,
                            visibility: !0,
                            id: 303,
                            key: "advancedSettings"
                        }, {
                            name: this.constants.WIRELESS_SCHEDULE,
                            routerLink: "wifi/wireless-schedule",
                            selected: !1,
                            breadCrumb: this.constants.SERVICE_OVERVIEW_WIFI + "/" + this.constants.WIRELESS_SCHEDULE,
                            visibility: !0,
                            id: 309,
                            key: "wirelessSchedule"
                        }, {
                            name: this.constants.WIFI_STATISTICS,
                            routerLink: "wifi/wifi-statistics",
                            selected: !1,
                            breadCrumb: this.constants.SERVICE_OVERVIEW_WIFI + "/" + this.constants.WIFI_STATISTICS,
                            visibility: !0,
                            id: 303,
                            key: "wifiStatistics"
                        }]
                    }, {
                        name: this.constants.DEVICES_LABEL,
                        routerLink: "devices",
                        selected: !1,
                        breadCrumb: this.constants.DEVICES_LABEL,
                        visibility: !0,
                        id: 5,
                        key: "devices",
                        icon: "side_nav_devices",
                        iconsel: "side_nav_devices_sel"
                    }, {
                        name: this.constants.SERVICE_OVERVIEW_VOICE,
                        routerLink: "voice/voice-information",
                        selected: !1,
                        breadCrumb: this.constants.SERVICE_OVERVIEW_VOICE,
                        showSubmenu: !1,
                        visibility: !0,
                        id: 3,
                        key: "voice",
                        icon: "side_nav_voice",
                        subMenuList: [{
                            name: this.constants.VOICE_STATUS,
                            routerLink: "voice/voice-information",
                            selected: !1,
                            breadCrumb: this.constants.SERVICE_OVERVIEW_VOICE + "/" + this.constants.VOICE_STATUS,
                            visibility: !0,
                            id: 302,
                            key: "voicestatus"
                        }, {
                            name: this.constants.VOICE_SETTING,
                            routerLink: "voice/voice-settings",
                            selected: !1,
                            breadCrumb: this.constants.SERVICE_OVERVIEW_VOICE + "/" + this.constants.VOICE_SETTING,
                            visibility: !0,
                            id: 301,
                            key: "voiceSetting"
                        }]
                    }, {
                        name: this.constants.SECURITY,
                        routerLink: "security/mac-filter",
                        selected: null,
                        showSubmenu: !1,
                        breadCrumb: this.constants.SECURITY + "/" + this.constants.MAC_FILTER,
                        visibility: !0,
                        id: 7,
                        key: "security",
                        icon: "side_nav_security",
                        subMenuList: [{
                            name: this.constants.MAC_FILTER,
                            routerLink: "security/mac-filter",
                            selected: !1,
                            breadCrumb: this.constants.SECURITY + "/" + this.constants.MAC_FILTER,
                            visibility: !0,
                            id: 702,
                            key: "macFilter"
                        }, {
                            name: this.constants.FIREWALL,
                            routerLink: "security/firewall",
                            selected: !1,
                            breadCrumb: this.constants.SECURITY + "/" + this.constants.FIREWALL,
                            visibility: !0,
                            id: 701,
                            key: "firewall"
                        }, {
                            name: this.constants.IP_FILTER,
                            routerLink: "security/ip-filter",
                            selected: !1,
                            breadCrumb: this.constants.SECURITY + "/" + this.constants.IP_FILTER,
                            visibility: !0,
                            id: 703,
                            key: "ipFilter"
                        }, {
                            name: this.constants.URL_FILTER,
                            routerLink: "security/url-filter",
                            selected: !1,
                            breadCrumb: this.constants.SECURITY + "/" + this.constants.URL_FILTER,
                            visibility: !0,
                            id: 704,
                            key: "urlFilter"
                        }, {
                            name: this.constants.FAMILY_PROFILES,
                            routerLink: "security/family-profiles",
                            selected: !1,
                            breadCrumb: this.constants.SECURITY + "/" + this.constants.FAMILY_PROFILES,
                            visibility: !0,
                            id: 706,
                            key: "parentalControl"
                        }, {
                            name: this.constants.DMZ_ALG,
                            routerLink: "security/dmz-alg",
                            selected: !1,
                            breadCrumb: this.constants.SECURITY + "/" + this.constants.DMZ_ALG,
                            visibility: !0,
                            id: 705,
                            key: "dmzAndAlg"
                        }, {
                            name: this.constants.ACCESS_CONTROL,
                            routerLink: "security/access-control",
                            selected: !1,
                            breadCrumb: this.constants.SECURITY + "/" + this.constants.ACCESS_CONTROL,
                            visibility: !0,
                            id: 707,
                            key: "accessControl"
                        }]
                    }, {
                        name: this.constants.ADVANCED_SETTINGS,
                        routerLink: "advanced-setting/port-forwarding",
                        selected: !1,
                        breadCrumb: this.constants.ADVANCED_SETTINGS,
                        visibility: !0,
                        id: 6,
                        key: "application",
                        icon: "side_nav_advsetting",
                        subMenuList: [{
                            name: this.constants.PORT_FORWARDING,
                            routerLink: "advanced-setting/port-forwarding",
                            selected: !1,
                            breadCrumb: this.constants.ADVANCED_SETTINGS + "/" + this.constants.PORT_FORWARDING,
                            visibility: !0,
                            id: 603,
                            key: "portForwarding"
                        }, {
                            name: this.constants.PORT_TRIGGERING,
                            routerLink: "advanced-setting/port-triggering",
                            selected: !1,
                            breadCrumb: this.constants.ADVANCED_SETTINGS + "/" + this.constants.PORT_TRIGGERING,
                            visibility: !0,
                            id: 604,
                            key: "portTriggering"
                        }, {
                            name: this.constants.DDNS,
                            routerLink: "advanced-setting/ddns",
                            selected: !1,
                            breadCrumb: this.constants.ADVANCED_SETTINGS + "/" + this.constants.DDNS,
                            visibility: !0,
                            id: 601,
                            key: "ddns"
                        }, {
                            name: this.constants.NTP,
                            routerLink: "advanced-setting/ntp",
                            selected: !1,
                            breadCrumb: this.constants.ADVANCED_SETTINGS + "/" + this.constants.NTP,
                            visibility: !0,
                            id: 602,
                            key: "ntp"
                        }, {
                            name: this.constants.USB,
                            routerLink: "advanced-setting/usb",
                            selected: !1,
                            breadCrumb: this.constants.ADVANCED_SETTINGS + "/" + this.constants.USB,
                            visibility: !0,
                            id: 605,
                            key: "usb"
                        }, {
                            name: this.constants.UPNP_DLNA,
                            routerLink: "advanced-setting/upnp-dlna",
                            selected: !1,
                            breadCrumb: this.constants.ADVANCED_SETTINGS + "/" + this.constants.UPNP_DLNA,
                            visibility: !0,
                            id: 606,
                            key: "upnpAndDlna"
                        }]
                    }, {
                        name: this.constants.MAINTENANCE,
                        routerLink: "maintenance/password",
                        selected: !1,
                        breadCrumb: this.constants.MAINTENANCE,
                        visibility: !0,
                        id: 4,
                        key: "maintenance",
                        icon: "side_nav_maintenance",
                        subMenuList: [{
                            name: this.constants.CHANGE_PASSWORD,
                            routerLink: "maintenance/password",
                            selected: !1,
                            breadCrumb: this.constants.MAINTENANCE + "/" + this.constants.CHANGE_PASSWORD,
                            visibility: !0,
                            id: 401,
                            key: "password"
                        }, {
                            name: this.constants.GAME_MODE,
                            routerLink: "maintenance/game-mode",
                            selected: !1,
                            breadCrumb: this.constants.MAINTENANCE + "/" + this.constants.GAME_MODE,
                            visibility: !0,
                            id: 404,
                            key: "gameMode"
                        }, {
                            name: this.constants.BACKUP_RESTORE,
                            routerLink: "maintenance/backup-restore",
                            selected: !1,
                            breadCrumb: this.constants.MAINTENANCE + "/" + this.constants.BACKUP_RESTORE,
                            visibility: !0,
                            id: 405,
                            key: "backupAndRestore"
                        }, {
                            name: this.constants.FIRMWARE_UPGRADE,
                            routerLink: "maintenance/firmware-upgrade",
                            selected: !1,
                            breadCrumb: this.constants.MAINTENANCE + "/" + this.constants.FIRMWARE_UPGRADE,
                            visibility: !0,
                            id: 406,
                            key: "firmwareUpgrade"
                        }, {
                            name: this.constants.LOID_CONFIG,
                            routerLink: "maintenance/loid",
                            selected: !1,
                            breadCrumb: this.constants.MAINTENANCE + "/" + this.constants.LOID_CONFIG,
                            visibility: !0,
                            id: 402,
                            key: "loidAuthentication"
                        }, {
                            name: this.constants.SLID_CONFIGURATION,
                            routerLink: "maintenance/slid",
                            selected: !1,
                            breadCrumb: this.constants.MAINTENANCE + "/" + this.constants.SLID_CONFIGURATION,
                            visibility: !0,
                            id: 403,
                            key: "slidConfiguration"
                        }, {
                            name: this.constants.DIAGNOSTICS,
                            routerLink: "maintenance/diagnostics",
                            selected: !1,
                            breadCrumb: this.constants.MAINTENANCE + "/" + this.constants.DIAGNOSTICS,
                            visibility: !0,
                            id: 409,
                            key: "diagnostics"
                        }, {
                            name: this.constants.LOG,
                            routerLink: "maintenance/log",
                            selected: !1,
                            breadCrumb: this.constants.MAINTENANCE + "/" + this.constants.LOG,
                            visibility: !0,
                            id: 410,
                            key: "log"
                        }, {
                            name: this.constants.DELTA_CFG_TOOL,
                            routerLink: "maintenance/deltaCfgTool",
                            selected: !1,
                            breadCrumb: this.constants.MAINTENANCE + "/" + this.constants.DELTA_CFG_TOOL,
                            visibility: !0,
                            id: 411,
                            key: "deltaCfgTool"
                        }, {
                            name: this.constants.CONTAINER_MANAGEMENT,
                            routerLink: "maintenance/container-management",
                            selected: !1,
                            breadCrumb: this.constants.MAINTENANCE + "/" + this.constants.CONTAINER_MANAGEMENT,
                            visibility: !0,
                            id: 411,
                            key: "containerManagement"
                        }, {
                            name: this.constants.SYSLOG,
                            routerLink: "maintenance/syslog-config",
                            selected: !1,
                            breadCrumb: this.constants.MAINTENANCE + "/" + this.constants.SYSLOG,
                            visibility: !0,
                            id: 412,
                            key: "syslog"
                        }]
                    }, {
                        name: this.constants.TROUBLESHOOTING,
                        routerLink: "troubleshooting/troubleshooting-counters",
                        selected: !1,
                        breadCrumb: this.constants.TROUBLESHOOTING,
                        visibility: !0,
                        id: 5,
                        key: "troubleshooting",
                        icon: "side_nav_troubleshooting",
                        subMenuList: [{
                            name: this.constants.TROUBLESHOOTING_COUNTERS,
                            routerLink: "troubleshooting/troubleshooting-counters",
                            selected: !1,
                            breadCrumb: this.constants.TROUBLESHOOTING + "/" + this.constants.TROUBLESHOOTING_COUNTERS,
                            visibility: !0,
                            id: 501,
                            key: "troubleshootingCounters"
                        }, {
                            name: this.constants.SPEED_TEST,
                            routerLink: "troubleshooting/speed-test",
                            selected: !1,
                            breadCrumb: this.constants.TROUBLESHOOTING + "/" + this.constants.SPEED_TEST,
                            visibility: !0,
                            id: 502,
                            key: "speedTest"
                        }]
                    }]
                }

                static #t = this.\u0275fac = function (s) {
                    return new (s || n)(t.rXU(R.V), t.rXU(m.G), t.rXU(f.Ix), t.rXU(y.u), t.rXU(C.Q), t.rXU(b.YM), t.rXU(O.u), t.rXU(L.T), t.rXU(k.n), t.rXU(_.Z), t.rXU(E.qQ, 8))
                };
                static #e = this.\u0275cmp = t.VBU({
                    type: n,
                    selectors: [["app-side-nav"]],
                    decls: 10,
                    vars: 14,
                    consts: [[1, "flex-column", "side-nav", 3, "ngClass"], [1, "side-nav__logo", "cursor-pointer", 3, "click"], ["class", "side-nav__logo cursor-pointer", "name", "airtel_logo_side", 3, "click", 4, "ngIf"], ["class", "side-nav__logo cursor-pointer", "name", "nokia_logo_web", 3, "click", 4, "ngIf"], ["id", "demo"], [3, "menuClickEvent", "navItems", "disableClick"], [3, "langChange", "logout", "showAvatar", "options", "selectedLang", "disableLogout", "showLogout", "disableLangPicker", "showLangPicker", "logoutText"], ["mb-6", "", "class", "flex-row", 4, "ngIf"], ["name", "airtel_logo_side", 1, "side-nav__logo", "cursor-pointer", 3, "click"], ["name", "nokia_logo_web", 1, "side-nav__logo", "cursor-pointer", 3, "click"], ["mb-6", "", 1, "flex-row"], ["buttonType", "button", "size", "small", "ml-6", "", 3, "customClass", "iconStart", "title", "bgColor"]],
                    template: function (s, i) {
                        1 & s && (t.j41(0, "nav", 0)(1, "div")(2, "div", 1), t.bIt("click", function () {
                            return i.goToDashboard()
                        }), t.DNE(3, M, 1, 0, "pv-vector", 2)(4, D, 1, 0, "pv-vector", 3), t.nrm(5, "p", 4), t.k0s(), t.j41(6, "pv-side-nav", 5), t.bIt("menuClickEvent", function (r) {
                            return i.menuClick(r)
                        }), t.k0s()(), t.j41(7, "div")(8, "pv-logout", 6), t.bIt("langChange", function (r) {
                            return i.langChange(r.value, !0)
                        })("logout", function (r) {
                            return i.logout(r)
                        }), t.k0s(), t.DNE(9, w, 2, 4, "div", 7), t.k0s()()), 2 & s && (t.Y8G("ngClass", null != i.api && i.api.brEnable ? "has_bridgemode" : ""), t.R7$(3), t.Y8G("ngIf", !i.logoSvgAvailable && i.isBATL), t.R7$(), t.Y8G("ngIf", !i.logoSvgAvailable && !i.isBATL), t.R7$(2), t.Y8G("navItems", i.menuList)("disableClick", i.constants.BLOCK_PAGE_NAVIGATION), t.R7$(2), t.Y8G("showAvatar", i.sideNavDetails.showAvatar)("options", i.sideNavDetails.langOptions)("selectedLang", i.sideNavDetails.selectedLang)("disableLogout", i.api.device_capability.getVal("homeGateway", "logout").isDisabled)("showLogout", i.api.device_capability.getVal("homeGateway", "logout").isOn)("disableLangPicker", i.api.device_capability.getVal("homeGateway", "chooseLanguage", "visibility").isDisabled)("showLangPicker", i.api.device_capability.getVal("homeGateway", "chooseLanguage", "visibility").isOn)("logoutText", i.constants.SIGN_OUT_TEXT), t.R7$(), t.Y8G("ngIf", 1 === i.api.brEnable))
                    },
                    dependencies: [u.XL, u.oN, u.rJ, u.ZV, E.YU, E.bT],
                    styles: [".side-nav[_ngcontent-%COMP%]{width:var(--side-nav-width);min-height:100%;background-color:var(--pure-color-white);place-content:space-between}.side-nav__logo[_ngcontent-%COMP%]{width:154px;height:96px}.side-nav[_ngcontent-%COMP%]   pv-logout[_ngcontent-%COMP%]{width:var(--side-nav-width);background-color:var(--pure-color-white);position:sticky;bottom:0%}.side-nav[_ngcontent-%COMP%]   .bridgeMode_text[_ngcontent-%COMP%]{width:86px;height:20px;display:flex;align-items:center;text-align:center;letter-spacing:-.154px;color:var(--pure-color-red-70);flex:none;order:1;flex-grow:0}.side-nav[_ngcontent-%COMP%]   .bridgeMode_status[_ngcontent-%COMP%]{display:flex;flex-direction:row;justify-content:center;align-items:center;padding:6px 16px;gap:4px;width:118px;height:32px;background:#fff2f0;border-radius:38px;flex:none;order:0;flex-grow:0}.side-nav[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{margin-top:41px;margin-left:32px}.side-nav[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], .side-nav[_ngcontent-%COMP%]   #demo[_ngcontent-%COMP%]{margin-top:38px;margin-left:15px;position:absolute}.side-nav[_ngcontent-%COMP%]     .sidenav-logout [pl-2]{width:100%}"]
                })
            }

            return n
        })();
        var V = a(1856), P = a(2997);
        const F = (n, h) => ({width: "1040px", isBackdropClickClose: !1, showHeaderClose: !0, title: n, caption: h}),
            U = (n, h) => ({isBackdropClickClose: !1, title: n, caption: h, width: "426px"});

        function B(n, h) {
            if (1 & n) {
                const e = t.RV6();
                t.j41(0, "pv-dialog", 6), t.bIt("closeDialog", function () {
                    t.eBV(e);
                    const i = t.XpG();
                    return t.Njj(i.closeDialog())
                }), t.qex(1, 7), t.j41(2, "div", 8)(3, "div", 9), t.nrm(4, "pv-list", 10), t.k0s(), t.nrm(5, "pv-list", 11), t.k0s(), t.j41(6, "div", 12)(7, "div", 13), t.nrm(8, "pv-list", 14), t.k0s(), t.nrm(9, "pv-list", 15), t.k0s(), t.bVm(), t.k0s()
            }
            if (2 & n) {
                const e = t.XpG();
                t.Y8G("dialogConfig", t.l_i(17, F, e.constants.RECOMMENDED_BROWSERS, e.constants.RECOMMEND_BROWSER_SUB)), t.R7$(4), t.FCK("subtext", "", e.constants.CONTAINER_APP_VERSION, " 126.0.6478.114 ", e.constants.OR_LATER, ""), t.Y8G("title", e.constants.GOOGLE_CHROME_TITLE), t.R7$(), t.FCK("subtext", "", e.constants.CONTAINER_APP_VERSION, " 126.0.2592.81 ", e.constants.OR_LATER, ""), t.Y8G("title", e.constants.MICROSOFT_EDGE_TITLE), t.R7$(3), t.FCK("subtext", "", e.constants.CONTAINER_APP_VERSION, " 17.4 ", e.constants.OR_LATER, ""), t.Y8G("title", e.constants.SAFARI_BROWSER), t.R7$(), t.FCK("subtext", "", e.constants.CONTAINER_APP_VERSION, " 127.0 ", e.constants.OR_LATER, ""), t.Y8G("title", e.constants.FIREFOX_BROWSER)
            }
        }

        function W(n, h) {
            if (1 & n && (t.j41(0, "div", 16)(1, "div", 17), t.nrm(2, "dashboard-spinner")(3, "pv-text", 18), t.k0s()()), 2 & n) {
                const e = t.XpG();
                t.R7$(3), t.Y8G("title", e.constants.LOADING_LABEL)
            }
        }

        function x(n, h) {
            1 & n && t.nrm(0, "div", 19)
        }

        function Y(n, h) {
            if (1 & n) {
                const e = t.RV6();
                t.j41(0, "pv-dialog", 6), t.bIt("closeDialog", function () {
                    t.eBV(e);
                    const i = t.XpG();
                    return t.Njj(i.closeSTCDialog())
                }), t.qex(1, 7), t.j41(2, "div", 20)(3, "pv-button", 21), t.bIt("click", function () {
                    t.eBV(e);
                    const i = t.XpG();
                    return t.Njj(i.closeSTCDialog())
                }), t.k0s()(), t.bVm(), t.k0s()
            }
            if (2 & n) {
                const e = t.XpG();
                t.Y8G("dialogConfig", t.l_i(2, U, e.constants.WARNING, e.constants.SERVICE_BLOCKED)), t.R7$(3), t.Y8G("title", e.constants.OK)
            }
        }

        const K = [{
            path: "",
            component: (() => {
                class n {
                    constructor(e, s, i, o, r) {
                        this.api = e, this.constants = s, this.router = i, this.route = o, this.language = r, this.showRBrowserDialog = !1, this.intervalId = null, this.showSTCDialog = !1, this.handleGetTrafficForwardingStatus = {
                            onSuccess: d => {
                                0 == d.data.result && !d.data.FunctionResult.TrafficForwarding && (this.showSTCDialog = !0, this.stopTimer())
                            }, onError: d => {
                                console.error("Error:", d)
                            }
                        }, o.params.subscribe(d => {
                            const c = location.hash && location.hash.split("#").length ? location.hash.split("#")[1] : "";
                            this.router.navigate(["/overview"], {relativeTo: this.route}), c && this.router.navigate("/security/profiles-details" == c ? ["/security/family-profiles"] : "/status/device-details" == c ? ["/status/device-info"] : [location.hash.split("#")[1]], {relativeTo: this.route})
                        }), this.dialogConfig = {
                            width: "1040px",
                            isBackdropClickClose: !1,
                            showHeaderClose: !0,
                            title: this.constants.RECOMMENDED_BROWSERS,
                            caption: this.constants.RECOMMEND_BROWSER_SUB
                        }
                    }

                    ngOnInit() {
                        const e = localStorage.getItem("lang") ? localStorage.getItem("lang") : "en";
                        this.language.setLang1(!1, e), this.api.performActionIfMatchingOpid("STCA", this.startTimer.bind(this))
                    }

                    closeDialog() {
                        this.showRBrowserDialog = !1
                    }

                    onRBrowsersClick() {
                        this.showRBrowserDialog = !0
                    }

                    getTrafficForwardingStatus() {
                        this.api.createBody("GetTrafficForwardingStatus"), this.api.request(this.handleGetTrafficForwardingStatus, "callUBUS")
                    }

                    closeSTCDialog() {
                        this.showSTCDialog = !1
                    }

                    startTimer() {
                        null === this.intervalId && (this.intervalId = setInterval(() => {
                            this.getTrafficForwardingStatus()
                        }, 2e4))
                    }

                    stopTimer() {
                        null !== this.intervalId && (clearInterval(this.intervalId), this.intervalId = null)
                    }

                    ngOnDestroy() {
                        this.stopTimer()
                    }

                    static #t = this.\u0275fac = function (s) {
                        return new (s || n)(t.rXU(m.G), t.rXU(b.YM), t.rXU(f.Ix), t.rXU(f.nX), t.rXU(L.T))
                    };
                    static #e = this.\u0275cmp = t.VBU({
                        type: n,
                        selectors: [["app-main"]],
                        decls: 14,
                        vars: 12,
                        consts: [[3, "dialogConfig", "closeDialog", 4, "ngIf"], [1, "main", "flex-column", "flex-column__spacebetween-none", "flex100"], ["px-10", ""], ["class", "nokia-pure-modal-loader modal-content-loader", 4, "ngIf"], [3, "rBrowsersClick", "BrowserText", "showCopyright", "disableCopyright", "showRecommendedBrowsers", "disableRecommendedBrowsers", "sidebar"], ["class", "backdrop-overlay", 4, "ngIf"], [3, "closeDialog", "dialogConfig"], ["pvModelContent", ""], ["mt-10", "", 1, "flex-row"], ["mr-8", ""], ["iconStart", "chrome_logo_new", 3, "title", "subtext"], ["iconStart", "edge_logo_new", 3, "title", "subtext"], ["mb-8", "", "mt-8", "", 1, "flex-row"], ["mr-10", ""], ["iconStart", "safari_logo_new", 3, "title", "subtext"], ["iconStart", "firefox_logo_new", 3, "title", "subtext"], [1, "nokia-pure-modal-loader", "modal-content-loader"], [1, "nokia-pure-modal-loader-content-sidenav", "nokia-pure-modal-loader-content-transparent"], ["mt-10", "", "subtext2-regular-800", "", 3, "title"], [1, "backdrop-overlay"], ["pt-4", "", 1, "flex-row", "flex-row__end-center"], ["id", "closeWarningSTC", "size", "small", 3, "click", "title"]],
                        template: function (s, i) {
                            1 & s && (t.nrm(0, "app-side-nav"), t.DNE(1, B, 10, 20, "pv-dialog", 0), t.j41(2, "div", 1)(3, "div", 2), t.nrm(4, "app-header")(5, "router-outlet"), t.k0s(), t.DNE(6, W, 4, 1, "div", 3), t.j41(7, "pv-footer", 4), t.bIt("rBrowsersClick", function () {
                                return i.onRBrowsersClick()
                            }), t.k0s()(), t.DNE(8, x, 1, 0, "div", 5)(9, Y, 4, 5, "pv-dialog", 0), t.nI1(10, "async"), t.nrm(11, "pv-message")(12, "pv-snackbar")(13, "pv-tooltip")), 2 & s && (t.R7$(), t.Y8G("ngIf", i.showRBrowserDialog), t.R7$(5), t.Y8G("ngIf", i.constants.SHOW_CONTENT_MODAL_LOADER), t.R7$(), t.Y8G("BrowserText", i.constants.RECOMMENDED_BROWSERS)("showCopyright", i.api.device_capability.getVal("homeGateway", "copyright").isOn)("disableCopyright", i.api.device_capability.getVal("homeGateway", "copyright").isDisabled)("showRecommendedBrowsers", i.api.device_capability.getVal("homeGateway", "recommendedBrowsers").isOn)("disableRecommendedBrowsers", i.api.device_capability.getVal("homeGateway", "recommendedBrowsers").isDisabled)("sidebar", !0), t.R7$(), t.Y8G("ngIf", i.constants.SHOW_MODAL_BACK_DROP), t.R7$(), t.Y8G("ngIf", i.showSTCDialog && t.bMT(10, 10, i.api.isOpidMatching("STCA"))))
                        },
                        dependencies: [f.n3, G, V.l, E.bT, u.Ns, u.XL, u.v9, u.Os, u.H9, u.sT, u.cV, u.sj, P.G, E.Jj],
                        styles: ["[_nghost-%COMP%]{display:flex;min-width:1440px}[_nghost-%COMP%]   .main[_ngcontent-%COMP%]{padding-bottom:200px;overflow:hidden}.backdrop-overlay[_ngcontent-%COMP%]{position:fixed;top:0;left:0;z-index:1000;width:100%;height:100%;background:#00000080}"]
                    })
                }

                return n
            })(),
            children: [{path: "", redirectTo: "overview", pathMatch: "full"}, {
                path: "overview",
                resolve: [p, g],
                loadChildren: () => Promise.all([a.e(469), a.e(560)]).then(a.bind(a, 560)).then(n => n.OverviewModule)
            }, {
                path: "messages",
                resolve: [v, p, g],
                loadChildren: () => a.e(452).then(a.bind(a, 1452)).then(n => n.MessagesModule)
            }, {
                path: "wan",
                resolve: [v, p, g],
                loadChildren: () => Promise.all([a.e(611), a.e(189), a.e(76), a.e(822)]).then(a.bind(a, 2822)).then(n => n.WanModule)
            }, {
                path: "lan",
                resolve: [v, p, g],
                loadChildren: () => a.e(819).then(a.bind(a, 8819)).then(n => n.LanModule)
            }, {
                path: "wifi",
                resolve: [v, p, g],
                loadChildren: () => Promise.all([a.e(611), a.e(469), a.e(76), a.e(36)]).then(a.bind(a, 5036)).then(n => n.WiFiModule)
            }, {
                path: "devices",
                resolve: [v, p, g],
                loadChildren: () => Promise.all([a.e(611), a.e(402)]).then(a.bind(a, 9402)).then(n => n.DevicesModule)
            }, {
                path: "voice",
                resolve: [v, p, g],
                loadChildren: () => a.e(579).then(a.bind(a, 5579)).then(n => n.VoiceModule)
            }, {
                path: "maintenance",
                resolve: [v, p, g],
                loadChildren: () => Promise.all([a.e(611), a.e(76), a.e(478)]).then(a.bind(a, 5478)).then(n => n.MaintenanceModule)
            }, {
                path: "advanced-setting",
                resolve: [v, p, g],
                loadChildren: () => Promise.all([a.e(611), a.e(189), a.e(25)]).then(a.bind(a, 25)).then(n => n.AdvancedSettingModule)
            }, {
                path: "security",
                resolve: [v, p, g],
                loadChildren: () => Promise.all([a.e(611), a.e(189), a.e(76), a.e(136)]).then(a.bind(a, 5136)).then(n => n.SecurityModule)
            }, {
                path: "troubleshooting",
                resolve: [v, p, g],
                loadChildren: () => Promise.all([a.e(611), a.e(224)]).then(a.bind(a, 5224)).then(n => n.TroubleshootingModule)
            }]
        }];
        let H = (() => {
            class n {
                static #t = this.\u0275fac = function (s) {
                    return new (s || n)
                };
                static #e = this.\u0275mod = t.$C({type: n});
                static #i = this.\u0275inj = t.G2t({imports: [f.iI.forChild(K), f.iI]})
            }

            return n
        })();
        var j = a(2866);
        let X = (() => {
            class n {
                constructor(e) {
                    this.authService = e
                }

                canActivate() {
                    return this.authService.isAdmin
                }

                static #t = this.\u0275fac = function (s) {
                    return new (s || n)(t.KVO(y.u))
                };
                static #e = this.\u0275prov = t.jDH({token: n, factory: n.\u0275fac})
            }

            return n
        })(), $ = (() => {
            class n {
                static #t = this.\u0275fac = function (s) {
                    return new (s || n)
                };
                static #e = this.\u0275mod = t.$C({type: n});
                static #i = this.\u0275inj = t.G2t({providers: [X], imports: [H, N, j.G]})
            }

            return n
        })()
    }
}]);