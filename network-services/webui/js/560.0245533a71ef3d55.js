"use strict";
(self.webpackChunknokiawifi = self.webpackChunknokiawifi || []).push([[560], {
    560: (ti, L, h) => {
        h.r(L), h.d(L, {OverviewModule: () => Zt});
        var C = h(6425), d = h(9417), v = h(6452);

        class $ {
            constructor(o = "Internet speed", t = "", s = null, n = null, a = null, r = "", l = "", _ = "", p = "New speed test", u = "", E = !1, S = !1) {
                this.title = o, this.description = t, this.download = s, this.upload = n, this.time = a, this.downloadText = r, this.uploadText = l, this.historyText = _, this.buttonText = p, this.testMode = u, this.buttonPressed = E, this.showResults = S
            }
        }

        class V extends v.f_ {
            constructor(o = []) {
                super(), this.familyList = o, this.isHeaderSubTitleClickable = !0
            }
        }

        var c = h(6261), R = h(4493), Y = h(4412), N = h(1807), U = h(605), x = h(7365), e = h(4438), j = h(8934),
            X = h(765), H = h(8882), K = h(2960), z = h(6279), J = h(1989), q = h(4796), Q = h(7410), m = h(177),
            Z = h(1774), ee = h(1580), O = h(7476);
        const te = ["*"],
            ie = (i, o, t, s, n) => ({"custom-content": i, circle: o, progress: t, "progress-dark": s, pulse: n});

        function se(i, o) {
            1 & i && e.SdG(0)
        }

        function ne(i, o) {
            if (1 & i && (e.j41(0, "div", 1), e.DNE(1, se, 1, 0), e.k0s()), 2 & i) {
                const t = e.XpG();
                e.Y8G("ngClass", e.s1E(5, ie, "custom-content" === t.appearance, "circle" === t.appearance, "progress" === t.animation, "progress-dark" === t.animation, "pulse" === t.animation))("ngStyle", t.theme), e.BMQ("aria-label", t.ariaLabel)("aria-valuetext", t.loadingText), e.R7$(), e.vxM(1, "custom-content" === t.appearance ? 1 : -1)
            }
        }

        const A = new e.nKC("ngx-skeleton-loader.config");
        let ae = (() => {
            class i {
                constructor(t) {
                    this.config = t;
                    const {
                        appearance: s = "line",
                        animation: n = "progress",
                        theme: a = null,
                        loadingText: r = "Loading...",
                        count: l = 1,
                        ariaLabel: _ = "loading"
                    } = t || {};
                    this.appearance = s, this.animation = n, this.theme = a, this.loadingText = r, this.count = l, this.items = [], this.ariaLabel = _
                }

                ngOnInit() {
                    this.validateInputValues()
                }

                validateInputValues() {
                    /^\d+$/.test(`${this.count}`) || ((0, e.naY)() && console.error("`NgxSkeletonLoaderComponent` need to receive 'count' a numeric value. Forcing default to \"1\"."), this.count = 1), "custom-content" === this.appearance && (0, e.naY)() && 1 !== this.count && (console.error('`NgxSkeletonLoaderComponent` enforces elements with "custom-content" appearance as DOM nodes. Forcing "count" to "1".'), this.count = 1), this.items.length = this.count;
                    const t = ["progress", "progress-dark", "pulse", "false"];
                    -1 === t.indexOf(String(this.animation)) && ((0, e.naY)() && console.error(`\`NgxSkeletonLoaderComponent\` need to receive 'animation' as: ${t.join(", ")}. Forcing default to "progress".`), this.animation = "progress"), -1 === ["circle", "line", "custom-content", ""].indexOf(String(this.appearance)) && ((0, e.naY)() && console.error("`NgxSkeletonLoaderComponent` need to receive 'appearance' as: circle or line or custom-content or empty string. Forcing default to \"''\"."), this.appearance = "");
                    const {theme: s} = this.config || {};
                    s && s.extendsFromRoot && null !== this.theme && (this.theme = {...this.config.theme, ...this.theme})
                }

                ngOnChanges(t) {
                    ["count", "animation", "appearance"].find(s => t[s] && (t[s].isFirstChange() || t[s].previousValue === t[s].currentValue)) || this.validateInputValues()
                }

                static #e = this.\u0275fac = function (s) {
                    return new (s || i)(e.rXU(A, 8))
                };
                static #t = this.\u0275cmp = e.VBU({
                    type: i,
                    selectors: [["ngx-skeleton-loader"]],
                    inputs: {
                        count: "count",
                        loadingText: "loadingText",
                        appearance: "appearance",
                        animation: "animation",
                        ariaLabel: "ariaLabel",
                        theme: "theme"
                    },
                    features: [e.OA$],
                    ngContentSelectors: te,
                    decls: 2,
                    vars: 0,
                    consts: [["aria-busy", "true", "aria-valuemin", "0", "aria-valuemax", "100", "role", "progressbar", "tabindex", "-1", 1, "skeleton-loader"], ["aria-busy", "true", "aria-valuemin", "0", "aria-valuemax", "100", "role", "progressbar", "tabindex", "-1", 1, "skeleton-loader", 3, "ngClass", "ngStyle"]],
                    template: function (s, n) {
                        1 & s && (e.NAR(), e.Z7z(0, ne, 2, 11, "div", 0, e.fX1)), 2 & s && e.Dyx(n.items)
                    },
                    dependencies: [m.YU, m.B3],
                    styles: ['.skeleton-loader[_ngcontent-%COMP%]{box-sizing:border-box;overflow:hidden;position:relative;background:#eff1f6 no-repeat;border-radius:4px;width:100%;height:20px;display:inline-block;margin-bottom:10px;will-change:transform}.skeleton-loader[_ngcontent-%COMP%]:after, .skeleton-loader[_ngcontent-%COMP%]:before{box-sizing:border-box}.skeleton-loader.circle[_ngcontent-%COMP%]{width:40px;height:40px;margin:5px;border-radius:50%}.skeleton-loader.progress[_ngcontent-%COMP%], .skeleton-loader.progress-dark[_ngcontent-%COMP%]{transform:translateZ(0)}.skeleton-loader.progress[_ngcontent-%COMP%]:after, .skeleton-loader.progress[_ngcontent-%COMP%]:before, .skeleton-loader.progress-dark[_ngcontent-%COMP%]:after, .skeleton-loader.progress-dark[_ngcontent-%COMP%]:before{box-sizing:border-box}.skeleton-loader.progress[_ngcontent-%COMP%]:before, .skeleton-loader.progress-dark[_ngcontent-%COMP%]:before{animation:_ngcontent-%COMP%_progress 2s ease-in-out infinite;background-size:200px 100%;position:absolute;z-index:1;top:0;left:0;width:200px;height:100%;content:""}.skeleton-loader.progress[_ngcontent-%COMP%]:before{background-image:linear-gradient(90deg,#fff0,#fff9,#fff0)}.skeleton-loader.progress-dark[_ngcontent-%COMP%]:before{background-image:linear-gradient(90deg,transparent,rgba(0,0,0,.2),transparent)}.skeleton-loader.pulse[_ngcontent-%COMP%]{animation:_ngcontent-%COMP%_pulse 1.5s cubic-bezier(.4,0,.2,1) infinite;animation-delay:.5s}.skeleton-loader.custom-content[_ngcontent-%COMP%]{height:100%;background:none}@media (prefers-reduced-motion: reduce){.skeleton-loader.pulse[_ngcontent-%COMP%], .skeleton-loader.progress-dark[_ngcontent-%COMP%], .skeleton-loader.custom-content[_ngcontent-%COMP%], .skeleton-loader.progress[_ngcontent-%COMP%]:before{animation:none}.skeleton-loader.progress[_ngcontent-%COMP%]:before, .skeleton-loader.progress-dark[_ngcontent-%COMP%], .skeleton-loader.custom-content[_ngcontent-%COMP%]{background-image:none}}@media screen and (min-device-width: 1200px){.skeleton-loader[_ngcontent-%COMP%]{-webkit-user-select:none;user-select:none;cursor:wait}}@keyframes _ngcontent-%COMP%_progress{0%{transform:translate3d(-200px,0,0)}to{transform:translate3d(calc(200px + 100vw),0,0)}}@keyframes _ngcontent-%COMP%_pulse{0%{opacity:1}50%{opacity:.4}to{opacity:1}}'],
                    changeDetection: 0
                })
            }

            return i
        })(), oe = (() => {
            class i {
                static forRoot(t) {
                    return {ngModule: i, providers: [{provide: A, useValue: t}]}
                }

                static #e = this.\u0275fac = function (s) {
                    return new (s || i)
                };
                static #t = this.\u0275mod = e.$C({type: i});
                static #i = this.\u0275inj = e.G2t({imports: [m.MD]})
            }

            return i
        })();
        const D = (i, o) => ({
                headerTitle: i,
                headerSubTitle: o,
                hasDivider: !1,
                isHeaderSubTitleClickable: !0,
                dataAvailable: !0
            }), re = (i, o) => ({overflow: i, display: o}), f = () => ({width: "56px", height: "56px"}),
            k = () => ({width: "150px", height: "20px"}), g = () => ({width: "100%", height: "20px"}),
            w = () => ({width: "60%", height: "10px"}),
            le = i => ({headerTitle: i, headerSubTitle: "", dataAvailable: !0}), ce = (i, o, t, s, n, a, r) => ({
                headerTitle: i,
                headerSubTitle: o,
                onlineCount: t,
                onlineLabel: s,
                onlineTextColor: n,
                offlineCount: a,
                offlineLabel: r,
                offlineTextColor: "blue-80",
                hasDivider: !0,
                isHeaderSubTitleClickable: !0,
                dataAvailable: !0
            }), W = () => ({width: "30px", height: "56px"}), y = () => ({width: "56px", height: "10px"}),
            P = () => ({width: "50%", height: "20px"}), _e = i => ({
                headerTitle: i,
                headerSubTitle: "",
                hasDivider: !1,
                isHeaderSubTitleClickable: !1,
                dataAvailable: !0
            }), F = i => ({
                headerTitle: i,
                headerSubTitle: "",
                hasDivider: !1,
                isHeaderSubTitleClickable: !1,
                dataAvailable: !1
            }), he = i => ({visibility: i}), I = i => ({$implicit: i});

        function pe(i, o) {
            1 & i && e.eu8(0)
        }

        function de(i, o) {
            if (1 & i && (e.j41(0, "div", 16), e.DNE(1, pe, 1, 0, "ng-container", 17), e.k0s()), 2 & i) {
                e.XpG(2);
                const t = e.sdS(2);
                e.R7$(), e.Y8G("ngTemplateOutlet", t)
            }
        }

        function ve(i, o) {
            1 & i && e.eu8(0)
        }

        function fe(i, o) {
            if (1 & i && (e.j41(0, "div", 18), e.DNE(1, ve, 1, 0, "ng-container", 17), e.k0s()), 2 & i) {
                const t = e.XpG(2), s = e.sdS(2);
                e.Y8G("ngClass", t.networkMapLong ? "flex50-gap24" : "flex33-gap24"), e.R7$(), e.Y8G("ngTemplateOutlet", s)
            }
        }

        function ue(i, o) {
            1 & i && e.eu8(0)
        }

        function ge(i, o) {
            if (1 & i && (e.j41(0, "div", 18), e.DNE(1, ue, 1, 0, "ng-container", 17), e.k0s()), 2 & i) {
                const t = e.XpG(2), s = e.sdS(4);
                e.Y8G("ngClass", t.networkMapLong ? "flex50-gap24" : "flex33-gap24"), e.R7$(), e.Y8G("ngTemplateOutlet", s)
            }
        }

        function we(i, o) {
            1 & i && e.eu8(0)
        }

        function me(i, o) {
            if (1 & i && (e.j41(0, "div", 18), e.DNE(1, we, 1, 0, "ng-container", 17), e.k0s()), 2 & i) {
                const t = e.XpG(2), s = e.sdS(6);
                e.Y8G("ngClass", t.networkMapLong ? "flex50-gap24" : "flex33-gap24"), e.R7$(), e.Y8G("ngTemplateOutlet", s)
            }
        }

        function Se(i, o) {
            1 & i && e.eu8(0)
        }

        function be(i, o) {
            if (1 & i && (e.j41(0, "div", 18), e.DNE(1, Se, 1, 0, "ng-container", 17), e.k0s()), 2 & i) {
                const t = e.XpG(2), s = e.sdS(8);
                e.Y8G("ngClass", t.networkMapLong ? "flex50-gap24" : "flex33-gap24"), e.R7$(), e.Y8G("ngTemplateOutlet", s)
            }
        }

        function Ee(i, o) {
            1 & i && e.eu8(0)
        }

        function Ie(i, o) {
            if (1 & i && (e.j41(0, "div", 18), e.DNE(1, Ee, 1, 0, "ng-container", 17), e.k0s()), 2 & i) {
                const t = e.XpG(2), s = e.sdS(10);
                e.Y8G("ngClass", t.networkMapLong ? "flex50-gap24" : "flex33-gap24"), e.R7$(), e.Y8G("ngTemplateOutlet", s)
            }
        }

        function Ce(i, o) {
            1 & i && e.eu8(0)
        }

        function Re(i, o) {
            if (1 & i && (e.j41(0, "div", 18), e.DNE(1, Ce, 1, 0, "ng-container", 17), e.k0s()), 2 & i) {
                const t = e.XpG(2), s = e.sdS(12);
                e.Y8G("ngClass", t.networkMapLong ? "flex50-gap24" : "flex33-gap24"), e.R7$(), e.Y8G("ngTemplateOutlet", s)
            }
        }

        function xe(i, o) {
            1 & i && e.eu8(0)
        }

        function Ge(i, o) {
            if (1 & i && (e.j41(0, "div", 18), e.DNE(1, xe, 1, 0, "ng-container", 17), e.k0s()), 2 & i) {
                const t = e.XpG(2), s = e.sdS(14);
                e.Y8G("ngClass", t.networkMapLong ? "flex50-gap24" : "flex33-gap24"), e.R7$(), e.Y8G("ngTemplateOutlet", s)
            }
        }

        function Te(i, o) {
            1 & i && e.eu8(0)
        }

        function Le(i, o) {
            if (1 & i && (e.j41(0, "div", 21)(1, "div", 22)(2, "div", 23), e.DNE(3, Te, 1, 0, "ng-container", 17), e.k0s()()()), 2 & i) {
                e.XpG(3);
                const t = e.sdS(12);
                e.R7$(3), e.Y8G("ngTemplateOutlet", t)
            }
        }

        function Ne(i, o) {
            1 & i && e.eu8(0)
        }

        function Oe(i, o) {
            if (1 & i && (e.j41(0, "div", 24)(1, "div", 22)(2, "div", 23), e.DNE(3, Ne, 1, 0, "ng-container", 17), e.k0s()()()), 2 & i) {
                e.XpG(3);
                const t = e.sdS(14);
                e.R7$(3), e.Y8G("ngTemplateOutlet", t)
            }
        }

        function Ae(i, o) {
            if (1 & i && (e.qex(0), e.DNE(1, Le, 4, 1, "div", 19)(2, Oe, 4, 1, "div", 20), e.bVm()), 2 & i) {
                const t = e.XpG(2);
                e.R7$(), e.Y8G("ngIf", t.api.device_capability.getVal("overview", "radioAccess", "visibility").isOn && t.showRadioAccessCard), e.R7$(), e.Y8G("ngIf", t.api.device_capability.getVal("overview", "radioAccessFWA", "visibility").isOn && t.prodcfg.supportsFWADevice)
            }
        }

        function De(i, o) {
            if (1 & i && (e.qex(0), e.j41(1, "div", 11), e.DNE(2, de, 2, 1, "div", 12), e.j41(3, "div", 13)(4, "div", 14), e.DNE(5, fe, 2, 2, "div", 15)(6, ge, 2, 2, "div", 15)(7, me, 2, 2, "div", 15)(8, be, 2, 2, "div", 15)(9, Ie, 2, 2, "div", 15)(10, Re, 2, 2, "div", 15)(11, Ge, 2, 2, "div", 15), e.k0s()()(), e.DNE(12, Ae, 3, 2, "ng-container", 9), e.bVm()), 2 & i) {
                const t = e.XpG();
                e.R7$(2), e.Y8G("ngIf", t.networkMapLong && t.api.device_capability.getVal("overview", "networkMap", "visibility").isOn), e.R7$(3), e.Y8G("ngIf", !t.networkMapLong && t.api.device_capability.getVal("overview", "networkMap", "visibility").isOn), e.R7$(), e.Y8G("ngIf", 1 != t.api.brEnable && t.api.device_capability.getVal("overview", "serviceStatus", "visibility").isOn), e.R7$(), e.Y8G("ngIf", t.api.device_capability.getVal("overview", "connectedClients", "visibility").isOn && (!t.prodcfg.isFWAReceiver || t.api.isBhartiReceiver)), e.R7$(), e.Y8G("ngIf", t.api.device_capability.getVal("overview", "wifiNetworks", "visibility").isOn && !t.noWiFiSupport), e.R7$(), e.Y8G("ngIf", t.api.device_capability.getVal("overview", "laninterfaceStatus", "visibility").isOn), e.R7$(), e.Y8G("ngIf", t.api.device_capability.getVal("overview", "radioAccess", "visibility").isOn && (!t.isAllCardsVisible || !t.networkMapLong) && t.showRadioAccessCard), e.R7$(), e.Y8G("ngIf", t.api.device_capability.getVal("overview", "radioAccessFWA", "visibility").isOn && (!t.isAllCardsVisible || !t.networkMapLong) && t.prodcfg.supportsFWADevice), e.R7$(), e.Y8G("ngIf", t.isAllCardsVisible && t.networkMapLong)
            }
        }

        function ke(i, o) {
            1 & i && (e.j41(0, "div", 31)(1, "div", 32), e.nrm(2, "ngx-skeleton-loader", 33), e.j41(3, "span", 34), e.nrm(4, "ngx-skeleton-loader", 35), e.k0s()(), e.nrm(5, "span", 36), e.j41(6, "div", 32)(7, "div", 37), e.nrm(8, "ngx-skeleton-loader", 33), e.j41(9, "span", 34), e.nrm(10, "ngx-skeleton-loader", 35), e.k0s()()()()), 2 & i && (e.R7$(2), e.Y8G("theme", e.lJ4(4, f)), e.R7$(2), e.Y8G("theme", e.lJ4(5, k)), e.R7$(4), e.Y8G("theme", e.lJ4(6, f)), e.R7$(2), e.Y8G("theme", e.lJ4(7, k)))
        }

        function We(i, o) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "app-network-topology", 38), e.bIt("openDetails", function (n) {
                    e.eBV(t);
                    const a = e.XpG(3);
                    return e.Njj(a.showDeviceDetails(n))
                }), e.k0s()
            }
            if (2 & i) {
                const t = e.XpG(3);
                e.Y8G("pageName", "overview")("fetchNetworkData", t.addWifipointFetchdata)("isChildComponent", t.networkMapChildComponent)("wifiSupport", t.noWiFiSupport)
            }
        }

        function ye(i, o) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-card", 26)(1, "pv-devices-card", 27), e.bIt("linkClick", function () {
                    e.eBV(t);
                    const n = e.XpG(2);
                    return e.Njj(n.openAddWifiPointModal())
                }), e.k0s(), e.j41(2, "div", 28), e.DNE(3, ke, 11, 8, "div", 29)(4, We, 1, 4, "app-network-topology", 30), e.k0s()()
            }
            if (2 & i) {
                const t = e.XpG(2);
                e.R7$(), e.Y8G("ngClass", t.api.device_capability.getVal("overview", "networkMap", "addWifiButton", "visibility").isOn ? "" : "hide-wifipoint")("params", e.l_i(5, D, t.constants.NETWORK_MAP, t.networkMapChildComponent ? t.constants.ADD_WIFI_POINT : "")), e.R7$(), e.Y8G("ngStyle", e.l_i(8, re, t.networkMapChildCount > 2 ? "auto" : "none", t.networkMapChildComponent && null != t.api.overview_status && t.api.overview_status.device_info.length ? "flex" : "block")), e.R7$(), e.Y8G("ngIf", !t.networkMapChildComponent || !(null != t.api.overview_status && t.api.overview_status.device_info.length)), e.R7$(), e.Y8G("ngIf", t.networkMapChildComponent && (null == t.api.overview_status ? null : t.api.overview_status.device_info.length))
            }
        }

        function Pe(i, o) {
            if (1 & i && e.DNE(0, ye, 5, 11, "pv-card", 25), 2 & i) {
                const t = e.XpG();
                e.Y8G("ngIf", t.api.device_capability.getVal("overview", "networkMap", "visibility").isOn)
            }
        }

        function Fe(i, o) {
            1 & i && (e.j41(0, "div", 43)(1, "div", 37), e.nrm(2, "ngx-skeleton-loader", 33), e.k0s(), e.j41(3, "div", 44), e.nrm(4, "ngx-skeleton-loader", 35), e.j41(5, "span", 34), e.nrm(6, "ngx-skeleton-loader", 35), e.k0s()()()), 2 & i && (e.R7$(2), e.Y8G("theme", e.lJ4(3, f)), e.R7$(2), e.Y8G("theme", e.lJ4(4, g)), e.R7$(2), e.Y8G("theme", e.lJ4(5, w)))
        }

        function Me(i, o) {
            1 & i && (e.j41(0, "div", 45)(1, "div", 37), e.nrm(2, "ngx-skeleton-loader", 33), e.k0s(), e.j41(3, "div", 44), e.nrm(4, "ngx-skeleton-loader", 35), e.j41(5, "span", 34), e.nrm(6, "ngx-skeleton-loader", 35), e.k0s()()()), 2 & i && (e.R7$(2), e.Y8G("theme", e.lJ4(3, f)), e.R7$(2), e.Y8G("theme", e.lJ4(4, g)), e.R7$(2), e.Y8G("theme", e.lJ4(5, w)))
        }

        function Be(i, o) {
            1 & i && (e.j41(0, "div", 45)(1, "div", 37), e.nrm(2, "ngx-skeleton-loader", 33), e.k0s(), e.j41(3, "div", 44), e.nrm(4, "ngx-skeleton-loader", 35), e.j41(5, "span", 34), e.nrm(6, "ngx-skeleton-loader", 35), e.k0s()()()), 2 & i && (e.R7$(2), e.Y8G("theme", e.lJ4(3, f)), e.R7$(2), e.Y8G("theme", e.lJ4(4, g)), e.R7$(2), e.Y8G("theme", e.lJ4(5, w)))
        }

        function $e(i, o) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-list", 50), e.bIt("click", function () {
                    e.eBV(t);
                    const n = e.XpG(5);
                    return e.Njj(n.showWanIP())
                }), e.k0s()
            }
            if (2 & i) {
                const t = e.XpG().$implicit, s = e.XpG(4);
                e.Y8G("iconStart", t.image)("title", t.name)("subtext", t.status)("forwardIcon", "" !== s.wanIPAddress || "" !== s.wanIPv6Address ? "forward" : "")("value", s.constants.SERVICE_OVERVIEW_WAN_IP)
            }
        }

        function Ve(i, o) {
            if (1 & i && e.nrm(0, "pv-list", 51), 2 & i) {
                const t = e.XpG().$implicit;
                e.Y8G("iconStart", t.image)("title", t.name)("subtext", t.status)
            }
        }

        function Ye(i, o) {
            if (1 & i && (e.qex(0), e.DNE(1, $e, 1, 5, "pv-list", 48)(2, Ve, 1, 3, "pv-list", 49), e.bVm()), 2 & i) {
                const t = o.index;
                e.R7$(), e.Y8G("ngIf", 0 === t), e.R7$(), e.Y8G("ngIf", 0 !== t)
            }
        }

        function Ue(i, o) {
            if (1 & i && (e.j41(0, "div", 46),
                e.DNE(1, Ye, 3, 2, "ng-container", 47), e.k0s()), 2 & i) {
                const t = e.XpG(3);
                e.R7$(), e.Y8G("ngForOf", t.serviceStatusList)
            }
        }

        function je(i, o) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-card", 26), e.qex(1), e.j41(2, "pv-devices-card", 39), e.bIt("linkClick", function () {
                    e.eBV(t);
                    const n = e.XpG(2);
                    return e.Njj(n.api.device_capability.getVal("wan", "visibility").isOn && n.api.device_capability.getVal("wan", "wanServices", "visibility").isOn ? n.gotoWan() : "")
                }), e.k0s(), e.DNE(3, Fe, 7, 6, "div", 40)(4, Me, 7, 6, "div", 41)(5, Be, 7, 6, "div", 41)(6, Ue, 2, 1, "div", 42), e.bVm(), e.k0s()
            }
            if (2 & i) {
                const t = e.XpG(2);
                e.R7$(2), e.Y8G("params", e.l_i(5, D, t.constants.SERVICE_STATUS, null != t.wanData && t.wanData.wan_conns.length && t.api.device_capability.getVal("wan", "visibility").isOn && t.api.device_capability.getVal("wan", "wanServices", "visibility").isOn ? t.constants.VIEW_ALL_LABEL : "")), e.R7$(), e.Y8G("ngIf", !(null != t.wanData && t.wanData.wan_conns.length || t.noCacheCalled)), e.R7$(), e.Y8G("ngIf", !(null != t.wanData && t.wanData.wan_conns.length || t.noCacheCalled)), e.R7$(), e.Y8G("ngIf", !(null != t.wanData && t.wanData.wan_conns.length || t.noCacheCalled)), e.R7$(), e.Y8G("ngIf", (null == t.wanData ? null : t.wanData.wan_conns.length) || t.noCacheCalled)
            }
        }

        function Xe(i, o) {
            if (1 & i && e.DNE(0, je, 7, 8, "pv-card", 25), 2 & i) {
                const t = e.XpG();
                e.Y8G("ngIf", 1 != t.api.brEnable && t.api.device_capability.getVal("overview", "serviceStatus", "visibility").isOn)
            }
        }

        function He(i, o) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-devices-card", 39), e.bIt("linkClick", function (n) {
                    e.eBV(t);
                    const a = e.XpG(3);
                    return e.Njj(a.api.device_capability.getVal("devices", "visibility").isOn ? a.viewAllDevices(n) : "")
                }), e.k0s()
            }
            if (2 & i) {
                const t = e.XpG(3);
                e.Y8G("params", e.eq3(1, le, t.constants.CONNECTED_CLIENTS))
            }
        }

        function Ke(i, o) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-devices-card", 39), e.bIt("linkClick", function (n) {
                    e.eBV(t);
                    const a = e.XpG(3);
                    return e.Njj(a.api.device_capability.getVal("devices", "visibility").isOn ? a.viewAllDevices(n) : "")
                }), e.k0s()
            }
            if (2 & i) {
                const t = e.XpG(3);
                e.Y8G("params", e.sGs(1, ce, t.constants.CONNECTED_CLIENTS, t.api.device_capability.getVal("devices", "visibility").isOn ? t.constants.VIEW_ALL_LABEL : "", t.api.isBhartiReceiver || t.prodcfg.nonWifiBoards ? null : t.wifiCountList.length ? t.wifiCountList.length : "0", t.api.isBhartiReceiver || t.prodcfg.nonWifiBoards ? null : t.constants.SERVICE_OVERVIEW_WIFI, t.api.isBhartiReceiver || t.prodcfg.nonWifiBoards ? null : "primary", t.ethernetCountList.length ? t.ethernetCountList.length : "0", t.constants.ETHERNET_LABEL))
            }
        }

        function ze(i, o) {
            1 & i && (e.j41(0, "div", 45)(1, "div", 55)(2, "div")(3, "span", 56), e.nrm(4, "ngx-skeleton-loader", 35), e.k0s(), e.j41(5, "span", 56), e.nrm(6, "ngx-skeleton-loader", 35), e.k0s()()(), e.j41(7, "div", 55)(8, "div")(9, "span", 56), e.nrm(10, "ngx-skeleton-loader", 35), e.k0s(), e.j41(11, "span", 56), e.nrm(12, "ngx-skeleton-loader", 35), e.k0s()()()()), 2 & i && (e.R7$(4), e.Y8G("theme", e.lJ4(4, W)), e.R7$(2), e.Y8G("theme", e.lJ4(5, y)), e.R7$(4), e.Y8G("theme", e.lJ4(6, W)), e.R7$(2), e.Y8G("theme", e.lJ4(7, y)))
        }

        function Je(i, o) {
            1 & i && (e.j41(0, "div", 45)(1, "div", 55), e.nrm(2, "ngx-skeleton-loader", 33), e.k0s(), e.j41(3, "div", 57), e.nrm(4, "ngx-skeleton-loader", 35), e.j41(5, "span", 34), e.nrm(6, "ngx-skeleton-loader", 35), e.k0s()()()), 2 & i && (e.R7$(2), e.Y8G("theme", e.lJ4(3, f)), e.R7$(2), e.Y8G("theme", e.lJ4(4, P)), e.R7$(2), e.Y8G("theme", e.lJ4(5, P)))
        }

        function qe(i, o) {
            if (1 & i && (e.j41(0, "div", 58), e.nrm(1, "circle-progress", 59), e.j41(2, "div")(3, "div", 60), e.nrm(4, "div", 61)(5, "pv-text", 62), e.k0s(), e.j41(6, "div", 60), e.nrm(7, "div", 63)(8, "pv-text", 62), e.k0s()()()), 2 & i) {
                const t = e.XpG(3);
                e.R7$(), e.Y8G("percent", t.connectedCountPercent)("radius", 40)("showTitle", !0)("title", t.titleFormat())("subtitle", t.constants.TOTAL_LABEL)("showUnits", !1)("showSubtitle", !0)("titleFontSize", 20)("subtitleFontSize", 12)("showBackground", !1)("showInnerStroke", !0)("clockwise", !1)("responsive", !1)("startFromZero", !1)("showZeroOuterStroke", !0)("backgroundGradient", !1)("backgroundOpacity", .7)("outerStrokeColor", "var(--pure-color-primary-60)")("outerStrokeGradientStopColor", "var(--pure-color-primary-80)")("innerStrokeColor", "var(--pure-color-neutral-40)")("titleColor", "var(--pure-color-black)")("subtitleColor", "var(--pure-color-neutral-80)")("titleFontWeight", 400)("subtitleFontWeight", 400)("innerStrokeWidth", 4)("outerStrokeWidth", 4)("space", -4)("outerStrokeLinecap", t.round)("animationDuration", 1e3)("animateTitle", !0), e.R7$(4), e.Y8G("title", (t.connectedCountList.length ? t.connectedCountList.length : "0") + " " + t.constants.CONNECTED_LABEL), e.R7$(3), e.Y8G("title", (t.notConnectedCountList.length ? t.notConnectedCountList.length : "0") + " " + t.constants.NOT_CONNECTED_LABEL)
            }
        }

        function Qe(i, o) {
            if (1 & i && (e.j41(0, "pv-card", 26), e.DNE(1, He, 1, 3, "pv-devices-card", 52)(2, Ke, 1, 9, "pv-devices-card", 52)(3, ze, 13, 8, "div", 41), e.nrm(4, "div", 53), e.DNE(5, Je, 7, 6, "div", 41)(6, qe, 9, 32, "div", 54), e.k0s()), 2 & i) {
                const t = e.XpG(2);
                e.R7$(), e.Y8G("ngIf", !t.hasDeviceList), e.R7$(), e.Y8G("ngIf", t.hasDeviceList), e.R7$(), e.Y8G("ngIf", !t.hasDeviceList), e.R7$(2), e.Y8G("ngIf", !t.hasDeviceList), e.R7$(), e.Y8G("ngIf", t.hasDeviceList)
            }
        }

        function Ze(i, o) {
            if (1 & i && e.DNE(0, Qe, 7, 5, "pv-card", 25), 2 & i) {
                const t = e.XpG();
                e.Y8G("ngIf", t.api.device_capability.getVal("overview", "connectedClients", "visibility").isOn)
            }
        }

        function et(i, o) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-text", 68), e.bIt("click", function () {
                    e.eBV(t);
                    const n = e.XpG(3);
                    return e.Njj(n.gotoWifi())
                }), e.k0s()
            }
            if (2 & i) {
                const t = e.XpG(3);
                e.Y8G("title", t.constants.VIEW_ALL_LABEL)
            }
        }

        function tt(i, o) {
            1 & i && (e.j41(0, "div", 45)(1, "div", 37), e.nrm(2, "ngx-skeleton-loader", 33), e.k0s(), e.j41(3, "div", 44), e.nrm(4, "ngx-skeleton-loader", 35), e.j41(5, "span", 34), e.nrm(6, "ngx-skeleton-loader", 35), e.k0s()()()), 2 & i && (e.R7$(2), e.Y8G("theme", e.lJ4(3, f)), e.R7$(2), e.Y8G("theme", e.lJ4(4, g)), e.R7$(2), e.Y8G("theme", e.lJ4(5, w)))
        }

        function it(i, o) {
            1 & i && (e.j41(0, "div", 45)(1, "div", 37), e.nrm(2, "ngx-skeleton-loader", 33), e.k0s(), e.j41(3, "div", 44), e.nrm(4, "ngx-skeleton-loader", 35), e.j41(5, "span", 34), e.nrm(6, "ngx-skeleton-loader", 35), e.k0s()()()), 2 & i && (e.R7$(2), e.Y8G("theme", e.lJ4(3, f)), e.R7$(2), e.Y8G("theme", e.lJ4(4, g)), e.R7$(2), e.Y8G("theme", e.lJ4(5, w)))
        }

        function st(i, o) {
            1 & i && (e.j41(0, "div", 45)(1, "div", 37), e.nrm(2, "ngx-skeleton-loader", 33), e.k0s(), e.j41(3, "div", 44), e.nrm(4, "ngx-skeleton-loader", 35), e.j41(5, "span", 34), e.nrm(6, "ngx-skeleton-loader", 35), e.k0s()()()), 2 & i && (e.R7$(2), e.Y8G("theme", e.lJ4(3, f)), e.R7$(2), e.Y8G("theme", e.lJ4(4, g)), e.R7$(2), e.Y8G("theme", e.lJ4(5, w)))
        }

        function nt(i, o) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-wifi-card", 73), e.bIt("edit", function () {
                    e.eBV(t);
                    const n = e.XpG(2).$implicit, a = e.XpG(4);
                    return e.Njj(a.editWifi(n))
                }), e.k0s()
            }
            if (2 & i) {
                const t = e.XpG(2).$implicit, s = e.XpG(4);
                e.Y8G("pos", "Bridge")("title", s.constants.BRIDGE_NETWORK + " - " + s.api.evaluateBandType(t.ssidIndex, s.api.type, t.mlo))("wifiTitle", s.sanitizeSSID(t.SSID))
            }
        }

        function at(i, o) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-wifi-card", 74), e.bIt("edit", function () {
                    e.eBV(t);
                    const n = e.XpG(2).$implicit, a = e.XpG(4);
                    return e.Njj(a.editWifi(n))
                }), e.k0s()
            }
            if (2 & i) {
                const t = e.XpG(2).$implicit, s = e.XpG(4);
                e.Y8G("pos", 0 == t.guestId ? "Home" : "Guest")("ngClass", t.guestId > 0 ? "guest-wifi--card" : "home-wifi--card")("title", (t.guestId >= 1 ? s.constants.GUEST_DETAIL_CARD_HEADING : s.constants.HOME_NETWORK_HEADING) + " - " + s.api.evaluateBandType(t.ssidIndex, s.api.type, t.mlo))("wifiTitle", s.sanitizeSSID(t.SSID))
            }
        }

        function ot(i, o) {
            if (1 & i && (e.qex(0), e.DNE(1, nt, 1, 3, "pv-wifi-card", 71)(2, at, 1, 4, "pv-wifi-card", 72), e.bVm()), 2 & i) {
                const t = e.XpG().$implicit;
                e.R7$(), e.Y8G("ngIf", t.isBridgeSSID), e.R7$(), e.Y8G("ngIf", !t.isBridgeSSID)
            }
        }

        function rt(i, o) {
            if (1 & i && (e.qex(0), e.DNE(1, ot, 3, 2, "ng-container", 9), e.bVm()), 2 & i) {
                const t = o.$implicit;
                e.R7$(), e.Y8G("ngIf", !t.hidefromweb)
            }
        }

        function lt(i, o) {
            if (1 & i && (e.j41(0, "div", 69)(1, "div", 70), e.DNE(2, rt, 2, 1, "ng-container", 47), e.k0s()()), 2 & i) {
                const t = e.XpG(3);
                e.R7$(2), e.Y8G("ngForOf", t.wifiOverallStatus)
            }
        }

        function ct(i, o) {
            if (1 & i && (e.j41(0, "pv-card", 26)(1, "div", 64), e.nrm(2, "pv-text", 65), e.DNE(3, et, 1, 1, "pv-text", 66), e.k0s(), e.DNE(4, tt, 7, 6, "div", 41)(5, it, 7, 6, "div", 41)(6, st, 7, 6, "div", 41)(7, lt, 3, 1, "div", 67), e.k0s()), 2 & i) {
                const t = e.XpG(2);
                e.R7$(2), e.Y8G("title", t.constants.WIFI_NETWORK_TITLE), e.R7$(), e.Y8G("ngIf", (t.wifiOverallStatus.length || t.disabledSSIDs.length) && t.api.device_capability.getVal("wifi", "visibility").isOn && t.api.device_capability.getVal("wifi", "wifiNetworks", "visibility").isOn), e.R7$(), e.Y8G("ngIf", !t.wifiOverallStatus.length && !t.disabledSSIDs.length), e.R7$(), e.Y8G("ngIf", !t.wifiOverallStatus.length && !t.disabledSSIDs.length), e.R7$(), e.Y8G("ngIf", !t.wifiOverallStatus.length && !t.disabledSSIDs.length), e.R7$(), e.Y8G("ngIf", t.wifiOverallStatus.length || t.disabledSSIDs.length)
            }
        }

        function _t(i, o) {
            if (1 & i && e.DNE(0, ct, 8, 6, "pv-card", 25), 2 & i) {
                const t = e.XpG();
                e.Y8G("ngIf", t.api.device_capability.getVal("overview", "wifiNetworks", "visibility").isOn)
            }
        }

        function ht(i, o) {
            1 & i && (e.j41(0, "div", 43)(1, "div", 37), e.nrm(2, "ngx-skeleton-loader", 33), e.k0s(), e.j41(3, "div", 44), e.nrm(4, "ngx-skeleton-loader", 35), e.j41(5, "span", 34), e.nrm(6, "ngx-skeleton-loader", 35), e.k0s()()()), 2 & i && (e.R7$(2), e.Y8G("theme", e.lJ4(3, f)), e.R7$(2), e.Y8G("theme", e.lJ4(4, g)), e.R7$(2), e.Y8G("theme", e.lJ4(5, w)))
        }

        function pt(i, o) {
            1 & i && (e.j41(0, "div", 45)(1, "div", 37), e.nrm(2, "ngx-skeleton-loader", 33), e.k0s(), e.j41(3, "div", 44), e.nrm(4, "ngx-skeleton-loader", 35), e.j41(5, "span", 34), e.nrm(6, "ngx-skeleton-loader", 35), e.k0s()()()), 2 & i && (e.R7$(2), e.Y8G("theme", e.lJ4(3, f)), e.R7$(2), e.Y8G("theme", e.lJ4(4, g)), e.R7$(2), e.Y8G("theme", e.lJ4(5, w)))
        }

        function dt(i, o) {
            1 & i && (e.j41(0, "div", 45)(1, "div", 37), e.nrm(2, "ngx-skeleton-loader", 33), e.k0s(), e.j41(3, "div", 44), e.nrm(4, "ngx-skeleton-loader", 35), e.j41(5, "span", 34), e.nrm(6, "ngx-skeleton-loader", 35), e.k0s()()()), 2 & i && (e.R7$(2), e.Y8G("theme", e.lJ4(3, f)), e.R7$(2), e.Y8G("theme", e.lJ4(4, g)), e.R7$(2), e.Y8G("theme", e.lJ4(5, w)))
        }

        function vt(i, o) {
            if (1 & i && (e.qex(0), e.nrm(1, "pv-list", 78), e.bVm()), 2 & i) {
                const t = o.$implicit;
                e.R7$(), e.Y8G("iconStart", t.image)("title", t.name)("subtext", t.connectionStatus)("lightBlueLabel", t.channel)("whiteLabel", t.bandwidth)
            }
        }

        function ft(i, o) {
            if (1 & i && e.nrm(0, "pv-list", 51), 2 & i) {
                const t = e.XpG(4);
                e.Y8G("iconStart", t.bluetoothStatus[0].image)("title", t.bluetoothStatus[0].name)("subtext", t.bluetoothStatus[0].connectionStatus)
            }
        }

        function ut(i, o) {
            if (1 & i && (e.j41(0, "div", 77), e.DNE(1, vt, 2, 5, "ng-container", 47)(2, ft, 1, 3, "pv-list", 49), e.k0s()), 2 & i) {
                const t = e.XpG(3);
                e.R7$(), e.Y8G("ngForOf", t.deviceInterfaceList), e.R7$(), e.Y8G("ngIf", t.prodcfg.isFWAReceiver)
            }
        }

        function gt(i, o) {
            if (1 & i && (e.j41(0, "pv-card", 26), e.nrm(1, "pv-devices-card", 75), e.DNE(2, ht, 7, 6, "div", 40)(3, pt, 7, 6, "div", 41)(4, dt, 7, 6, "div", 41)(5, ut, 3, 2, "div", 76), e.k0s()), 2 & i) {
                const t = e.XpG(2);
                e.R7$(), e.Y8G("params", e.eq3(5, _e, t.constants.LAN_INTERFACE_STATUS)), e.R7$(), e.Y8G("ngIf", !(null != t.api.overview_status && t.api.overview_status.lan_ether.length)), e.R7$(), e.Y8G("ngIf", !t.api.overview_status.lan_ether.length), e.R7$(), e.Y8G("ngIf", !t.api.overview_status.lan_ether.length), e.R7$(), e.Y8G("ngIf", t.api.overview_status.lan_ether.length)
            }
        }

        function wt(i, o) {
            if (1 & i && e.DNE(0, gt, 6, 7, "pv-card", 25), 2 & i) {
                const t = e.XpG();
                e.Y8G("ngIf", t.api.device_capability.getVal("overview", "laninterfaceStatus", "visibility").isOn)
            }
        }

        function mt(i, o) {
            if (1 & i && (e.qex(0), e.nrm(1, "pv-list", 83), e.bVm()), 2 & i) {
                const t = o.$implicit;
                e.XpG(3);
                const s = e.sdS(17);
                e.R7$(), e.Y8G("iconEnd", t.image)("customTemplate", s)("customTemplateData", e.eq3(3, I, t))
            }
        }

        function St(i, o) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-card", 80), e.nrm(1, "pv-devices-card", 75), e.j41(2, "div", 81), e.DNE(3, mt, 2, 5, "ng-container", 47), e.k0s(), e.j41(4, "pv-button", 82), e.bIt("click", function () {
                    e.eBV(t);
                    const n = e.XpG(2);
                    return e.Njj(n.navigateToReceiverWebGUI())
                }), e.k0s()()
            }
            if (2 & i) {
                const t = e.XpG(2);
                e.R7$(), e.Y8G("params", e.eq3(5, F, t.constants.RADIO_ACCESS)), e.R7$(2), e.Y8G("ngForOf", t.radioAccessList), e.R7$(), e.Y8G("title", t.constants.CONFIGURE_5G_RECEIVER)("isDisabled", t.api.device_capability.getVal("overview", "radioAccess", "receiverButton").isDisabled)("ngStyle", e.eq3(7, he, t.api.device_capability.getVal("overview", "radioAccess", "receiverButton").isOn ? "visible" : "hidden"))
            }
        }

        function bt(i, o) {
            if (1 & i && e.DNE(0, St, 5, 9, "pv-card", 79), 2 & i) {
                const t = e.XpG();
                e.Y8G("ngIf", t.api.device_capability.getVal("overview", "radioAccess", "visibility").isOn)
            }
        }

        function Et(i, o) {
            if (1 & i && e.nrm(0, "pv-list", 88), 2 & i) {
                const t = e.XpG(2);
                e.Y8G("iconEnd", t.signalStrengthIcon)("captionBold1", t.api.isFWAmmWaveReceiver ? "mmWave&nbsp" + t.constants.SERVICE_LABEL : t.constants.SERVICE_LABEL)("value", t.signalStrengthStatusText + "&nbsp&nbsp")
            }
        }

        function It(i, o) {
            if (1 & i && e.nrm(0, "pv-list", 89), 2 & i) {
                const t = e.XpG(3);
                e.Y8G("caption", t.constants.RSRP)("value", t.cell5GPSRSRP + " dBm")
            }
        }

        function Ct(i, o) {
            if (1 & i && e.nrm(0, "pv-list", 89), 2 & i) {
                const t = e.XpG(3);
                e.Y8G("caption", t.constants.SNR)("value", t.cell5GPSSNR + " dB")
            }
        }

        function Rt(i, o) {
            if (1 & i && e.nrm(0, "pv-list", 89), 2 & i) {
                const t = e.XpG(3);
                e.Y8G("caption", t.constants.RSRQ)("value", t.cell5GPSRSRQ + " dB")
            }
        }

        function xt(i, o) {
            if (1 & i && (e.qex(0), e.nrm(1, "pv-list", 86), e.DNE(2, It, 1, 2, "pv-list", 87)(3, Ct, 1, 2, "pv-list", 87)(4, Rt, 1, 2, "pv-list", 87), e.bVm()), 2 & i) {
                const t = e.XpG(2), s = e.sdS(19);
                e.R7$(), e.Y8G("iconEnd", t.radioAccessFWAList[2].image)("customTemplate", s)("customTemplateData", e.eq3(6, I, t.radioAccessFWAList[2])), e.R7$(), e.Y8G("ngIf", -32768 !== t.cell5GPSRSRP), e.R7$(), e.Y8G("ngIf", -32768 !== t.cell5GPSRSRP), e.R7$(), e.Y8G("ngIf", -32768 !== t.cell5GPSRSRP)
            }
        }

        function Gt(i, o) {
            if (1 & i && e.nrm(0, "pv-list", 89), 2 & i) {
                const t = e.XpG(2);
                e.Y8G("caption", t.constants.RSRP)("value", t.cell5GRSRP + " dBm")
            }
        }

        function Tt(i, o) {
            if (1 & i && e.nrm(0, "pv-list", 89), 2 & i) {
                const t = e.XpG(2);
                e.Y8G("caption", t.constants.SNR)("value", t.cell5GSNR + " dB")
            }
        }

        function Lt(i, o) {
            if (1 & i && e.nrm(0, "pv-list", 89), 2 & i) {
                const t = e.XpG(2);
                e.Y8G("caption", t.constants.RSRQ)("value", t.cell5GRSRQ + " dB")
            }
        }

        function Nt(i, o) {
            if (1 & i && e.nrm(0, "pv-list", 89), 2 & i) {
                const t = e.XpG(2);
                e.Y8G("caption", t.constants.MIMORANK)("value", t.cell5GMIMORANK)
            }
        }

        function Ot(i, o) {
            if (1 & i && e.nrm(0, "pv-list", 89), 2 & i) {
                const t = e.XpG(2);
                e.Y8G("caption", t.constants.RSRP)("value", t.cellLTERSRP + " dBm")
            }
        }

        function At(i, o) {
            if (1 & i && e.nrm(0, "pv-list", 89), 2 & i) {
                const t = e.XpG(2);
                e.Y8G("caption", t.constants.SNR)("value", t.cellLTESNR + " dB")
            }
        }

        function Dt(i, o) {
            if (1 & i && e.nrm(0, "pv-list", 89), 2 & i) {
                const t = e.XpG(2);
                e.Y8G("caption", t.constants.RSRQ)("value", t.cellLTERSRQ + " dB")
            }
        }

        function kt(i, o) {
            if (1 & i && e.nrm(0, "pv-list", 89), 2 & i) {
                const t = e.XpG(2);
                e.Y8G("caption", t.constants.RSSIfwa)("value", t.cellLTERSSI + " dBm")
            }
        }

        function Wt(i, o) {
            if (1 & i && e.nrm(0, "pv-list", 89), 2 & i) {
                const t = e.XpG(2);
                e.Y8G("caption", t.constants.MIMORANK)("value", t.cellLTEMIMORANK)
            }
        }

        function yt(i, o) {
            if (1 & i && (e.j41(0, "pv-card", 80), e.nrm(1, "pv-devices-card", 75), e.j41(2, "div", 84), e.DNE(3, Et, 1, 3, "pv-list", 85)(4, xt, 5, 8, "ng-container", 9), e.nrm(5, "pv-list", 86), e.DNE(6, Gt, 1, 2, "pv-list", 87)(7, Tt, 1, 2, "pv-list", 87)(8, Lt, 1, 2, "pv-list", 87)(9, Nt, 1, 2, "pv-list", 87), e.nrm(10, "pv-list", 86), e.DNE(11, Ot, 1, 2, "pv-list", 87)(12, At, 1, 2, "pv-list", 87)(13, Dt, 1, 2, "pv-list", 87)(14, kt, 1, 2, "pv-list", 87)(15, Wt, 1, 2, "pv-list", 87), e.k0s()()), 2 & i) {
                const t = e.XpG(), s = e.sdS(19);
                e.R7$(), e.Y8G("params", e.eq3(18, F, t.constants.RADIO_ACCESS)), e.R7$(2), e.Y8G("ngIf", t.prodcfg.isFWAReceiver), e.R7$(), e.Y8G("ngIf", t.api.is
                FWAmmWaveReceiver
            ),
                e.R7$(), e.Y8G("iconEnd", t.radioAccessFWAList[0].image)("customTemplate", s)("customTemplateData", e.eq3(20, I, t.radioAccessFWAList[0])), e.R7$(), e.Y8G("ngIf", -32768 !== t.cell5GRSRP), e.R7$(), e.Y8G("ngIf", -32768 !== t.cell5GRSRP), e.R7$(), e.Y8G("ngIf", -32768 !== t.cell5GRSRP), e.R7$(), e.Y8G("ngIf", t.prodcfg.isFWAReceiver && !t.api.noMimoRank && -32768 !== t.cell5GRSRP && t.api.device_capability.getVal("overview", "radioAccessFWA", "mimorank").isOn), e.R7$(), e.Y8G("iconEnd", t.radioAccessFWAList[1].image)("customTemplate", s)("customTemplateData", e.eq3(22, I, t.radioAccessFWAList[1])), e.R7$(), e.Y8G("ngIf", -32768 !== t.cellLTERSRP), e.R7$(), e.Y8G("ngIf", -32768 !== t.cellLTERSRP), e.R7$(), e.Y8G("ngIf", -32768 !== t.cellLTERSRP), e.R7$(), e.Y8G("ngIf", -32768 !== t.cellLTERSRP), e.R7$(), e.Y8G("ngIf", t.prodcfg.isFWAReceiver && !t.api.noMimoRank && -32768 !== t.cellLTERSRP && t.api.device_capability.getVal("overview", "radioAccessFWA", "mimorank").isOn)
            }
        }

        function Pt(i, o) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "div")(1, "app-device-details", 90), e.bIt("navigateBack", function (n) {
                    e.eBV(t);
                    const a = e.XpG();
                    return e.Njj(a.reloadMap(n))
                }), e.k0s()()
            }
        }

        function Ft(i, o) {
            if (1 & i && (e.j41(0, "div", 91)(1, "div", 92), e.nrm(2, "pv-text", 93)(3, "pv-text", 94), e.k0s(), e.j41(4, "div", 95), e.nrm(5, "pv-vector", 96)(6, "pv-text", 97), e.k0s()()), 2 & i) {
                const t = o.$implicit, s = e.XpG();
                e.R7$(2), e.Y8G("title", t.name), e.R7$(), e.Y8G("title", s.signalText), e.R7$(2), e.Y8G("name", "Connected" !== t.connectionStatus ? "connected_red" : "connected_green"), e.R7$(), e.Y8G("title", t.connectionStatus)
            }
        }

        function Mt(i, o) {
            if (1 & i && (e.j41(0, "div")(1, "div", 98), e.nrm(2, "pv-text", 99), e.k0s(), e.j41(3, "div", 100), e.nrm(4, "pv-vector", 101)(5, "pv-text", 97), e.k0s()()), 2 & i) {
                const t = o.$implicit;
                e.R7$(2), e.Y8G("title", t.name), e.R7$(2), e.Y8G("name", t.connectionBoolean ? "connected_green" : "connected_red"), e.R7$(), e.Y8G("title", t.connectionStatus)
            }
        }

        function Bt(i, o) {
            if (1 & i && e.nrm(0, "pv-text", 108), 2 & i) {
                const t = e.XpG(2);
                e.Y8G("title", t.constants.REQUIRED_FIELD_LABEL)
            }
        }

        function $t(i, o) {
            if (1 & i && e.nrm(0, "pv-text", 111), 2 & i) {
                const t = e.XpG(3);
                e.Y8G("title", t.constants.REQUIRED_FIELD_LABEL)
            }
        }

        function Vt(i, o) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-form-field")(1, "pv-inputbox", 109), e.bIt("onModelChange", function (n) {
                    e.eBV(t);
                    const a = e.XpG(2);
                    return e.Njj(a.onPasswordChange(n))
                })("onPasswordToggle", function (n) {
                    e.eBV(t);
                    const a = e.XpG(2);
                    return e.Njj(a.onPasswordToggleEvent(n))
                }), e.k0s(), e.DNE(2, $t, 1, 1, "pv-text", 110), e.k0s()
            }
            if (2 & i) {
                const t = e.XpG(2);
                e.R7$(), e.Y8G("disabled", t.isSavingInprogress)("data", t.ssidTempPassword)("isValidated", t.isPasswordValidated)("errorMessage", t.passwordErrorMessage)("type", t.passwordShow ? "text" : "password")("showPassword", t.passwordShow)("title", t.constants.PASSWORD_LABEL), e.R7$(), e.Y8G("ngIf", t.password.dirty && (null == t.password.errors ? null : t.password.errors.required))
            }
        }

        function Yt(i, o) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-dialog", 102), e.bIt("closeDialog", function () {
                    e.eBV(t);
                    const n = e.XpG();
                    return e.Njj(n.closeDialog(!0))
                }), e.qex(1, 103), e.j41(2, "form", 104), e.bIt("ngSubmit", function () {
                    e.eBV(t);
                    const n = e.XpG();
                    return e.Njj(n.updateSSID())
                }), e.j41(3, "pv-form-field")(4, "pv-inputbox", 105), e.bIt("onModelChange", function (n) {
                    e.eBV(t);
                    const a = e.XpG();
                    return e.Njj(a.onUsernameModelChange(n))
                }), e.k0s(), e.DNE(5, Bt, 1, 1, "pv-text", 106), e.k0s(), e.DNE(6, Vt, 3, 8, "pv-form-field", 9), e.j41(7, "pv-button", 107), e.bIt("click", function () {
                    e.eBV(t);
                    const n = e.XpG();
                    return e.Njj(n.updateSSID())
                }), e.k0s()(), e.bVm(), e.k0s()
            }
            if (2 & i) {
                const t = e.XpG();
                e.Y8G("dialogConfig", t.dialogConfig), e.R7$(2), e.Y8G("formGroup", t.editSSIDForm), e.R7$(2), e.Y8G("disabled", t.isSavingInprogress)("title", t.constants.NAME)("data", t.ssidTempName)("isValidated", t.isUsernameValidated)("errorMessage", t.ssidErrorMessage), e.R7$(), e.Y8G("ngIf", t.name.dirty && (null == t.name.errors ? null : t.name.errors.required)), e.R7$(), e.Y8G("ngIf", t.showPasswordSection), e.R7$(), e.Y8G("isDisabled", !t.validateSaveButton || t.isSavingInprogress)("title", t.constants.SAVE)
            }
        }

        function Ut(i, o) {
            if (1 & i && (e.qex(0), e.nrm(1, "div", 114), e.j41(2, "div", 60), e.nrm(3, "div", 61)(4, "pv-text", 112), e.k0s(), e.nrm(5, "pv-text", 113), e.bVm()), 2 & i) {
                const t = e.XpG(2);
                e.R7$(4), e.Y8G("title", t.constants.IPV6), e.R7$(), e.Y8G("title", t.wanIPv6Address)
            }
        }

        function jt(i, o) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-dialog", 102), e.bIt("closeDialog", function () {
                    e.eBV(t);
                    const n = e.XpG();
                    return e.Njj(n.closeWanIPDialog())
                }), e.qex(1, 103), e.j41(2, "div", 60), e.nrm(3, "div", 61)(4, "pv-text", 112), e.k0s(), e.nrm(5, "pv-text", 113), e.DNE(6, Ut, 6, 2, "ng-container", 9), e.bVm(), e.k0s()
            }
            if (2 & i) {
                const t = e.XpG();
                e.Y8G("dialogConfig", t.ipDialogConfig), e.R7$(4), e.Y8G("title", t.constants.IPV4), e.R7$(), e.Y8G("title", t.wanIPAddress), e.R7$(), e.Y8G("ngIf", t.wanIPv6Address)
            }
        }

        function Xt(i, o) {
            if (1 & i) {
                const t = e.RV6();
                e.qex(0), e.nrm(1, "pv-text", 115), e.j41(2, "div", 116)(3, "pv-button", 117), e.bIt("click", function () {
                    e.eBV(t);
                    const n = e.XpG(2);
                    return e.Njj(n.closeWifiDialog())
                }), e.k0s(), e.j41(4, "pv-button", 118), e.bIt("click", function () {
                    e.eBV(t);
                    const n = e.XpG(2);
                    return e.Njj(n.continueWithWebGui())
                }), e.k0s()(), e.bVm()
            }
            if (2 & i) {
                const t = e.XpG(2);
                e.R7$(), e.Y8G("title", t.constants.ADD_WIFI_POINT_DESC), e.R7$(2), e.Y8G("title", t.constants.CANCEL), e.R7$(), e.Y8G("title", t.constants.CONTINUE_WITH_WEB_GUI)
            }
        }

        function Ht(i, o) {
            if (1 & i && e.nrm(0, "pv-text", 108), 2 & i) {
                const t = e.XpG(3);
                e.Y8G("title", t.constants.REQUIRED_FIELD_LABEL)
            }
        }

        function Kt(i, o) {
            if (1 & i) {
                const t = e.RV6();
                e.qex(0), e.j41(1, "form", 119)(2, "pv-form-field", 120)(3, "pv-inputbox", 121), e.bIt("onModelChange", function (n) {
                    e.eBV(t);
                    const a = e.XpG(2);
                    return e.Njj(a.onWifiUsernameModelChange(n))
                }), e.k0s(), e.DNE(4, Ht, 1, 1, "pv-text", 106), e.k0s(), e.j41(5, "pv-button", 122), e.bIt("click", function () {
                    e.eBV(t);
                    const n = e.XpG(2);
                    return e.Njj(n.addNewWifiPointDetails())
                }), e.k0s()(), e.bVm()
            }
            if (2 & i) {
                const t = e.XpG(2);
                e.R7$(), e.Y8G("formGroup", t.addWifiPointForm), e.R7$(), e.Y8G("hasBorder", !1), e.R7$(), e.Y8G("isValidated", t.isSerialNumValidated)("data", t.serialNumber)("errorMessage", t.SerialErrorMessage)("title", t.constants.SERIAL_NUMBER)("isAutoFocus", !0), e.R7$(), e.Y8G("ngIf", t.serialNumber1.dirty && (null == t.serialNumber1.errors ? null : t.serialNumber1.errors.required)), e.R7$(), e.Y8G("isDisabled", !t.addWifiPointForm.valid)("title", t.constants.ADD)
            }
        }

        function zt(i, o) {
            if (1 & i) {
                const t = e.RV6();
                e.j41(0, "pv-dialog", 102), e.bIt("closeDialog", function () {
                    e.eBV(t);
                    const n = e.XpG();
                    return e.Njj(n.closeWifiDialog())
                }), e.qex(1, 103), e.DNE(2, Xt, 5, 3, "ng-container", 9)(3, Kt, 6, 10, "ng-container", 9), e.bVm(), e.k0s()
            }
            if (2 & i) {
                const t = e.XpG();
                e.Y8G("dialogConfig", t.addWifiDialogConfig), e.R7$(2), e.Y8G("ngIf", !t.addNewWifiPoint), e.R7$(), e.Y8G("ngIf", t.addNewWifiPoint)
            }
        }

        const Jt = [{
            path: "", component: (() => {
                class i {
                    createDeviceInterface(t, s = "def_wifi_offline", n = this.constants.OFFLINE_LABEL, a = "", r = "") {
                        return {name: t, image: s, connectionStatus: n, channel: a, bandwidth: r}
                    }

                    constructor(t, s, n, a, r, l, _, p, u, E, S, G, b) {
                        this.api = t, this.constants = s, this.route = n, this.websocket = a, this.pubSubService = r, this.gconfig = l, this.logger = _, this.alertUtil = p, this.utility = u, this.auth = E, this.message = S, this.prodcfg = G, this.pureViewSnackbarService = b, this.openWifiNetworkModal = !1, this.openWanIPDialog = !1, this.showPassword = !1, this.wifiOverallStatus = [], this.disabledSSIDs = [], this.ssidTempName = "", this.ssidTempPassword = "", this.ssidTempData = [], this.oldssidName = "", this.oldssidPassword = "", this.isSaveClicked = !1, this.validateSaveButton = !1, this.showPasswordSection = !0, this.passwordShow = !1, this.data2Ghz = [], this.data5Ghz = [], this.isUsernameValidated = !0, this.isPasswordValidated = !0, this.ssidErrorMessage = "", this.passwordErrorMessage = "", this.regexErrorMessage2 = "", this.regexErrorMessage5 = "", this.isQualBoard = !1, this.isFamilyProfileSkipped = 0, this.connectedList = [], this.detectedMesh = [], this.data5Ghz_high = [], this.data6Ghz = [], this.beaconDetailList = [], this.wifiPointList = [], this.detectedMeshCount = 0, this.dashboardFamilyProfileList = [], this.dualCallinProgress = !1, this.sameSsid = !1, this.isLoading = !1, this.isB6high5 = !1, this.counter = 0, this.totalGetCall = 7, this.beaconData = {}, this.modWifi2Data = [], this.modWifi5Data = [], this.modwifi5hData = [], this.completeWifiData = [], this.wifi5TempData = [], this.deviceList = [], this.ntwTopoList = [], this.lanDeviceList = [], this.signalText = this.constants.SIGNAL, this.FWAGWRadioAccessPolling = null, this.bridgedSsids = [], this.isSavingInprogress = !1, this.isIptvEnabledWan = !1, this.editWifiCardSSID = [], this.proceed5GSaveEdit = !1, this.proceed5GHighSaveEdit = !1, this.proceed6GSaveEdit = !1, this.connectionStatus = !1, this.isbandSteeringDualBand = !1, this.isMultibandSSID = !1, this.networkMapLong = !1, this.isAllCardsVisible = !0, this.isScrollBarNeeded = !1, this.networkMapChildComponent = !1, this.addWifipointFetchdata = !1, this.wifiCardEdit = {}, this.wifiGetcallsCount = 0, this.wifiSetcallsCount = 0, this.noCacheCalled = !1, this.overviewCacheErrCount = 0, this.hasDeviceList = !1, this.hasPasswordSetFailure = !1, this.deviceInterfaceList = [this.createDeviceInterface(this.constants.WIFI_24GHZ, "def_wifi_offline"), this.createDeviceInterface(this.constants.WIFI_5GHZ, "def_wifi_offline"), this.createDeviceInterface(this.constants.ETHERNET_LABEL, "def_ethernet_int_offline")], this.serviceStatusList = [{
                            name: this.constants.INTERNET,
                            image: "def_internet_globe_red",
                            status: this.constants.OFFLINE_LABEL
                        }, {
                            name: this.constants.IPTV,
                            image: "def_devices_tv_bad",
                            status: this.constants.OFFLINE_LABEL
                        }], this.radioAccessList = [{
                            name: this.constants.SIGNAL_5G,
                            image: "signal_wifi_0",
                            connectionStatus: this.constants.NOT_CONNECTED_LABEL
                        }, {
                            name: this.constants.SIGNAL_4G,
                            image: "signal_wifi_0",
                            connectionStatus: this.constants.NOT_CONNECTED_LABEL
                        }], this.bluetoothStatus = [{
                            name: this.constants.BLUETOOTH,
                            image: "bluetooth_off",
                            connectionStatus: this.constants.OFF_LABEL,
                            channel: ""
                        }], this.wanIPAddress = "", this.wanIPv6Address = "", this.usbTableData = [], this.dashboardMeshNetworkInfo = {aps: []}, this.isAdmin = !1, this.isopId_BIBT = !1, this.isCFGMode = !1, this.productType = "", this.showVoiceStatusInfo = !1, this.isUSBSupport = !1, this.isSerialNumValidated = !0, this.SerialErrorMessage = "", this.serialNumber = "",this.rgwSerialNoList = [],this.beaconDetailList1 = [],this.beaconEntriesList = [],this.showDetails = !1,this.ethernetCountList = [],this.wifiCountList = [],this.connectedCountList = [],this.notConnectedCountList = [],this.connectedCountPercent = 0,this.showRadioAccessCard = !1,this.hasRadioAccessError = 0,this.deviceInternetStatusGlobal = !1,this.deviceMapDetected = "",this.hasRadioAccessData = !0,this.selectedMapDetails = null,this.editWiFiCount = 0,this.editWiFiRetCount = 0,this.getDataFlow = !1,this.ponStatus = !1,this.refreshClicked = !1,this.isRealtekONT = !1,this.isStarHubDevice = !1,this.saveProgressLength = 0,this.wifiBandCount = [1],this.ConnectionStatus5GPS = !1,this.ConnectionStatus5G = !1,this.ConnectionStatus4G = !1,this.showCellularOrEthernet = "",this.hasBandSteering = !1,this.overviewCgiCount = 0,this.networkMapChildCount = 0,this.pageLoadInitial = !1,this.isFWADeviceSubject = new Y.t(void 0),"" !== this.api.router_info.gwmodel ? this.loadRouterInfo(this.api) : this.api.request(this, "getRouterInfo"),this.internetSpeed = new $,this.familyProfiles = new V,this.addNewWifiPointModalShow = !1,this.addNewWifiPoint = !1,this.showModalCloseBtn = !1,this.dialogConfig = {
                            isBackdropClickClose: !1,
                            title: this.constants.EDIT_WIFI_NTW,
                            width: "400px"
                        },this.ipDialogConfig = {
                            isBackdropClickClose: !1,
                            title: this.constants.SERVICE_OVERVIEW_WAN_IP,
                            width: "450px"
                        },this.addWifiDialogConfig = {
                            width: "400px",
                            isBackdropClickClose: !1,
                            title: this.constants.ADD_WIFI_POINT
                        },this.backEvent = this.pubSubService.subscribe(c.VR.OVERVIEW_BACK_EVENT, M => {
                            this.showDetails && !this.api.isSFUDevice && (this.showDetails = !1, this.selectedMapDetails = null, this.constants.SHOW_BACK_BUTTON = !1, this.constants.PAGE_TITLE = this.constants.OVERVIEW_LABEL)
                        })
                    }

                    ngOnInit() {
                        this.noCacheCalled = !1, this.pageLoadInitial = !0, this.hasPasswordSetFailure = !1, this.wifiOverallStatus = [], this.disabledSSIDs = [], this.ntwTopoList = [], this.initForm(), this.hasRadioAccessData = !0, this.getData(), this.onLanguageChanges(), this.pageRefreshSub = this.pubSubService.subscribe(c.VR.HEADER_REFRESH_CLICKED, t => {
                            this.refreshClicked = !0, this.noCacheCalled = !1, this.getData(), this.getFWARadioAccess()
                        }), this.isFamilyProfileSkipped = localStorage.getItem(c.yZ.HOME_SKIP_FAMILY_PROFILE), this.getFWARadioAccess(), this.editSSIDForm.valueChanges.subscribe(() => {
                            for (const t in this.editSSIDForm.controls) this.editSSIDForm.get(t).dirty && (this.wifiCardEdit[t] = this.editSSIDForm.get(t).value)
                        })
                    }

                    getFWARadioAccess() {
                        this.overviewCgiCount = 0, this.FWAGWRadioAccessPolling?.unsubscribe(), this.FWAGWRadioAccessPolling = null, this.isFWADeviceSubscription?.unsubscribe(), this.isFWADeviceSubscription = this.isFWADeviceSubject.subscribe(t => {
                            t && !this.FWAGWRadioAccessPolling ? (this.createradioAccessFWAList(), this.FWAGWRadioAccessPolling = (0, N.O)(0, R.Ou.TEN_SECONDS).subscribe(() => {
                                this.overviewCgiCount < 3 ? this.api.request(this, "getRadioAccessStatusFWAGW") : (this.FWAGWRadioAccessPolling?.unsubscribe(), this.FWAGWRadioAccessPolling = null)
                            })) : !t && this.FWAGWRadioAccessPolling && (this.FWAGWRadioAccessPolling.unsubscribe(), this.FWAGWRadioAccessPolling = null)
                        })
                    }

                    createradioAccessFWAList() {
                        this.radioAccessFWAList = [], this.radioAccessFWAList.push({
                            name: this.constants.SIGNAL_5G + " " + this.constants.SIGNAL,
                            image: "signal_wifi_0",
                            connectionStatus: this.constants.NOT_CONNECTED_LABEL,
                            connectionBoolean: !1
                        }), this.radioAccessFWAList.push({
                            name: this.constants.SIGNAL_4G + " " + this.constants.SIGNAL,
                            image: "signal_wifi_0",
                            connectionStatus: this.constants.NOT_CONNECTED_LABEL,
                            connectionBoolean: !1
                        }), this.radioAccessFWAList.push({
                            name: "mmWave&nbsp" + this.constants.SIGNAL,
                            image: "signal_wifi_0",
                            connectionStatus: this.constants.NOT_CONNECTED_LABEL,
                            connectionBoolean: !1
                        })
                    }

                    ngAfterViewInit() {
                        setTimeout(() => {
                            this.api?.recEnable && null == window.sessionStorage.getItem("DeltaConfig") && (window.sessionStorage.setItem("DeltaConfig", "recording"), window.alert(this.constants.CFG_STILL_RUNNING))
                        }, 100)
                    }

                    showDeviceDetails(t) {
                        console.log(t), this.showDetails = t
                    }

                    saveLocalDataHolder(t, s, n) {
                        switch (s) {
                            case"name":
                                t.SSID = n;
                                break;
                            case"password":
                                t.psks[0].PreSharedKey = n
                        }
                    }

                    onLanguageChanges() {
                        this.langChangeSub = this.pubSubService.subscribe(c.VR.LANGUAGE_CHANGE, t => {
                            this.isLoading || (this.pageLoadInitial || this.getData(), this.getFWARadioAccess()), this.dialogConfig = {
                                isBackdropClickClose: !1,
                                title: this.constants.EDIT_WIFI_NTW,
                                width: "400px"
                            }, this.ipDialogConfig = {
                                isBackdropClickClose: !0,
                                title: this.constants.SERVICE_OVERVIEW_WAN_IP,
                                width: "450px"
                            }, this.addWifiDialogConfig = {
                                width: "400px",
                                isBackdropClickClose: !0,
                                showHeaderClose: this.showModalCloseBtn,
                                title: this.constants.ADD_WIFI_POINT
                            }
                        })
                    }

                    loadRouterInfo(t) {
                        this.isCFGMode = -1 === t.brEnable, this.isAdmin = this.auth.isAdmin, this.isopId_BIBT = 1 === t.opId_BIBT, this.isUSBSupport = this.prodcfg.supportUSB, this.isRealtekONT = this.prodcfg.isRealtekONT, this.isbandSteeringDualBand = this.prodcfg.isSupportbandSteering, this.noWiFiSupport = this.prodcfg.isFWAReceiver || this.prodcfg.nonWifiBoards, null != t.type && null != t.type && (this.productType = t.type), this.isCFGMode && ("BWDS" === t.g_opId || "BATL" === t.g_opId && this.api.device_capability.getVal("overview", "networkMap", "addWifiButton", "showAddSerialNumberModal").isOn ? this.showWarning(this.constants.CFG_WARNING_BWDS) : this.showWarning(this.constants.CFG_WARNING)), this.isBridgeEna
                        ble = 1 === t.brEnable, this.showVoiceStatusInfo = -1 === this.productType.indexOf("Beacon"), this.isAllCardsVisible = !(!this.api.device_capability.getVal("overview", "connectedClients", "visibility").isOn || this.prodcfg.isFWAReceiver && !this.api.isBhartiReceiver || !this.api.device_capability.getVal("overview", "wifiNetworks", "visibility").isOn || !this.api.device_capability.getVal("overview", "laninterfaceStatus", "visibility").isOn || !this.api.device_capability.getVal("overview", "serviceStatus", "visibility").isOn || 1 == this.api.brEnable), this.isFWADeviceSubject.next(t.isFWADevice)
                    }

                    get serialNumber1() {
                        return this.addWifiPointForm.get("serialNumber1")
                    }

                    onWifiUsernameModelChange(t, s) {
                        this.serialNumber = t ? t.trim() : ""
                    }

                    openAddWifiPointModal() {
                        this.addNewWifiPointModalShow = !0, ("BWDS" === this.api.g_opId || "BATL" === this.api.g_opId && this.api.device_capability.getVal("overview", "networkMap", "addWifiButton", "showAddSerialNumberModal").isOn) && (this.addNewWifiPoint = !0, this.serialNumber1.reset())
                    }

                    sanitizeSSID(t) {
                        return t.replace(/ /g, "\xa0").replace(/</g, "&lt;")
                    }

                    closeWifiDialog() {
                        this.addNewWifiPointModalShow = !1, this.addNewWifiPoint = !1, this.showModalCloseBtn = !1, this.serialNumber1.reset()
                    }

                    continueWithWebGui() {
                        this.addNewWifiPoint = !0, this.showModalCloseBtn = !0, this.isSerialNumValidated = !0, this.SerialErrorMessage = ""
                    }

                    addNewWifiPointDetails() {
                        this.isSerialNumValidated = !0, this.SerialErrorMessage = "", this.validateSerialNumber() && this.api.request(this, "setMeshInfo", `SerialNumber=${this.serialNumber}`)
                    }

                    validateSerialNumber() {
                        let n = 0, a = 0, r = 0;
                        return this.serialNumber.length < 12 || this.serialNumber.length > 32 ? (this.isSerialNumValidated = !1, this.SerialErrorMessage = this.constants.ERR_LEN_SERIAL_NUM, !1) : /^[A-Za-z0-9]+$/.test(this.serialNumber.slice(4)) ? (this.rgwSerialNoList.forEach(l => {
                            l.SerialNumber.toLowerCase() !== this.serialNumber.toLowerCase() || (a = 1)
                        }), 1 === a ? (this.isSerialNumValidated = !1, this.SerialErrorMessage = this.constants.ERR_SERIAL_SAME_RGW, !1) : (this.wifiPointList.forEach(l => {
                            l.SerialNumber.toLowerCase() !== this.serialNumber.toLowerCase() || (n = 1)
                        }), 1 === n ? (this.isSerialNumValidated = !1, this.SerialErrorMessage = this.constants.ERR_SERIAL_EXIST, !1) : (this.beaconEntriesList.forEach(l => {
                            +l.BeaconNumberofEntries >= +l.MaxNumberOfBeacons && (r = 1)
                        }), 1 !== r || (this.isSerialNumValidated = !1, this.SerialErrorMessage = this.constants.ERR_MAX_ENTRIES, !1)))) : (this.isSerialNumValidated = !1, this.SerialErrorMessage = this.constants.ERR_SERIAL_SPL_CHAR, !1)
                    }

                    processOverViewData() {
                        try {
                            let t = !1, s = !1, n = !1;
                            this.ethernetData = this.api.overview_status, this.wanStatusData = this.api.overview_status, this.wireless2Data = this.api.overview_status.wireless2_info, this.wireless5Data = this.api.overview_status.wireless5_info, this.data2Ghz = this.api.overview_status.wireless2_info?.wlan_config_glb, this.data5Ghz = this.api.overview_status.wireless5_info?.wlan_config_glb11ac, this.api.wireless2_info.wlan_config_glb = this.api.overview_status.wireless2_info?.wlan_config_glb, this.api.wireless5_info.wlan_config_glb11ac = this.api.overview_status.wireless5_info.wlan_config_glb11ac, this.api.is6GSupported ? (this.wireless5hdata = this.api.overview_status.wireless6_info, this.data5Ghz_high = this.api.overview_status.wireless6_info?.wlan_config_glb_6g_band, this.api.wireless6_info.wlan_config_glb_6g_band = this.api.overview_status.wireless6_info?.wlan_config_glb_6g_band) : this.api.isQuardBandSupported ? (this.api.wireless6_info.wlan_config_glb_6g_band = this.api.overview_status.wireless6_info?.wlan_config_glb_6g_band, this.wireless6data = this.api.overview_status.wireless6_info, this.data6Ghz = this.api.overview_status.wireless6_info?.wlan_config_glb_6g_band, this.api.wireless5h_info.wlan_config_glb_11ac_highband = this.api.overview_status.wireless5h_info.wlan_config_glb_11ac_highband, this.wireless5hdata = this.api.overview_status.wireless5h_info, this.data5Ghz_high = this.api.overview_status.wireless5h_info?.wlan_config_glb_11ac_highband) : (this.api.wireless5h_info.wlan_config_glb_11ac_highband = this.api.overview_status.wireless5h_info.wlan_config_glb_11ac_highband, this.wireless5hdata = this.api.overview_status.wireless5h_info, this.data5Ghz_high = this.api.overview_status.wireless5h_info?.wlan_config_glb_11ac_highband), this.api.hardware_status.dataMapper(this.api.overview_status?.hardware_status), this.setEthernetStatusObj(), this.getLanDeviceData(this.api.overview_status), this.syncNtwTplData(this.api.overview_status), this.api.overview_status.network_map && !this.api.overview_status.network_map.aps && (this.api.overview_status.network_map.aps = []), this.setBackhaulNodes(this.api.overview_status.network_map), this.rgwSerialNoList = this.api.overview_status.mesh_info.is_rgwSerialNo, this.beaconDetailList1 = this.api.overview_status.mesh_info.beacon_detail, this.beaconEntriesList = this.api.overview_status.mesh_info.beaconEntries, this.api.get_mesh_info.beaconEntries = this.api.overview_status.mesh_info.beaconEntries, this.api.get_mesh_info.beacon_detail = this.api.overview_status.mesh_info.beacon_detail, this.api.get_mesh_info.wifipoint_list = this.api.overview_status.mesh_info.wifipoint_list, this.wifiPointList = this.api.overview_status.mesh_info.wifipoint_list, this.api.get_mesh_info.is_rgwSerialNo = this.api.overview_status.mesh_info.is_rgwSerialNo, this.api.home_ntw_status.device_cfg = this.api.overview_status?.device_cfg, this.api.home_ntw_status.alias_cfg = this.api.overview_status?.alias_cfg, this.api.home_ntw_status.wlan_status_glb = this.api.overview_status?.wlan_status_glb, this.api.home_ntw_status.device_ipv6 = this.api.overview_status?.device_ipv6, this.api.home_ntw_status.DelegateClientList = this.api.overview_status?.DelegateClientList, this.api.home_ntw_status.LanPrefixClientList = this.api.overview_status?.LanPrefixClientList, this.api.home_ntw_status.lan_ifip = this.api.overview_status?.lan_ifip, this.api.overview_status.device_detail && !this.api.overview_status.device_detail.aps && (this.api.overview_status.device_detail.aps = []), this.api.get_connected_devices = this.api.overview_status.device_detail, this.api.get_optical_status.Status = this.api.overview_status.pon_status.Status, this.api.overview_status.network_map && !this.api.overview_status.network_map.aps && (this.api.overview_status.network_map.aps = []), this.api.get_home_ntw_topo.aps = this.api.overview_status.network_map?.aps, this.api.overview_status.device_info.length && this.api.get_device_info.dataMapper(this.api.overview_status.device_info[0]), this.api.network_tpl_status.ntwtopo_cfg = this.api.overview_status.ntwtopo_cfg, this.api.home_ntw_status.device_cfg = this.api.overview_status.device_cfg, this.api.home_ntw_status.alias_cfg = this.api.overview_status.alias_cfg, this.api.get_wan_config_status.wan_conns = this.api.overview_status.wan_conns, this.api.get_ntp_info.time_obj = this.api.overview_status.sntp_status.time_obj ? this.api.overview_status.sntp_status.time_obj : [], this.api.get_ntp_info.is_timezone_support = this.api.overview_status.sntp_status.is_timezone_support ? this.api.overview_status.sntp_status.is_timezone_support : "", this.syncMeshData(this.api.overview_status.mesh_info), this.data2Ghz = this.api.overview_status?.wireless2_info?.wlan_config_glb ? this.api.overview_status?.wireless2_info?.wlan_config_glb : [], this.regexErrorMessage2 = this.constants.WPA_KEY_VALID, this.wireless2Data = this.api.overview_status?.wireless2_info, this.api.wireless2_info.is_whw_one_package_support = this.api.overview_status.wireless2_info?.is_whw_one_package_support, this.data5Ghz = this.api.overview_status?.wireless5_info, this.wireless5Data = this.api.overview_status?.wireless5_info, this.api.wireless2_info.is_whw_one_package_support = this.api.overview_status.wireless2_info?.is_whw_one_package_support, this.setWirelessInterface(this.api.overview_status?.wireless5_info?.wlan_config_glb11ac, 1), this.api.isQuardBandSupported ? (this.wireless6data = this.api.overview_status?.wireless6_info, this.setWirelessInterface(this.api.overview_status?.wireless6_info.wlan_config_glb_6g_band, 3), this.data6Ghz = this.api.overview_status?.wireless6_info.wlan_config_glb_6g_band ? this.api.overview_status?.wireless6_info.wlan_config_glb_6g_band : [], this.wireless5hdata = this.api.overview_status.wireless5h_info, this.data5Ghz_high = this.api?.overview_status?.wireless5h_info.wlan_config_glb_11ac_highband ? this.api?.overview_status.wireless5h_info.wlan_config_glb_11ac_highband : [], this.setWirelessInterface(this.api?.overview_status?.wireless5h_info.wlan_config_glb_11ac_highband, 2)) : !this.api.isQuardBandSupported && this.api.isBeacon6Supported ? (this.wireless5hdata = this.api.overview_status.wireless5h_info, this.data5Ghz_high = this.api?.overview_status?.wireless5h_info.wlan_config_glb_11ac_highband ? this.api?.overview_status.wireless5h_info.wlan_config_glb_11ac_highband : [], this.setWirelessInterface(this.api?.overview_status?.wireless5h_info.wlan_config_glb_11ac_highband, 2)) : (this.wireless5hdata = this.api.overview_status?.wireless6_info, this.setWirelessInterface(this.api.overview_status?.wireless6_info.wlan_config_glb_6g_band, 2), this.data5Ghz_high = this.api.overview_status?.wireless6_info.wlan_config_glb_6g_band ? this.api.overview_status.wireless6_info.wlan_config_glb_6g_band : []), this.SaveSSIDSuccess(), this.api.get_home_ntw_topo.aps = [...this.api.overview_status.network_map.hasOwnProperty("aps") ? this.api.overview_status.network_map?.aps : []], this.api.network_tpl_status.ntwtopo_cfg = [...this.api.overview_status.ntwtopo_cfg], this.logger.info({
                                msg: "Overview Status",
                                devData: this.api.overview_status
                            }), this.serviceOverviewInfo = [{
                                type: "wan",
                                initial: this.constants.SERVICE_OVERVIEW_WAN_IP,
                                title: "",
                                desc: "",
                                vector: "service_overview_wan",
                                enable: this.api.device_capability.getVal("overview", "serviceOveriew", "wanIp").isOn
                            }, {
                                type: "internet",
                                status: "",
                                title: this.constants.INTERNET,
                                desc: "",
                                vector: "service_overview_internet",
                                enable: this.api.device_capability.getVal("overview", "serviceOveriew", "internet").isOn
                            }, {
                                type: "wifi",
                                status: "",
                                title: this.constants.SERVICE_OVERVIEW_WIFI,
                                desc: "",
                                vector: "service_overview_wifi",
                                enable: this.api.device_capability.getVal("overview", "serviceOveriew", "wifi").isOn
                            }, {
                                type: "voice",
                                status: "",
                                title: this.constants.SERVICE_OVERVIEW_VOICE,
                                desc: "",
                                vector: "service_overview_voice",
                                enable: this.api.device_capability.getVal("overview", "serviceOveriew", "voiceInformation").isOn
                            }], 1 === this.api.brEnable && (this.serviceOverviewInfo[0].enable = !1), this.serviceOverviewInfo[0].title = this.api.hardware_status.wan_ip_status[0].ExternalIPAddress, this.serviceOverviewInfo[0].desc = this.api.hardware_status.wan_ip_status[0].ExternalIPv6Address || "", t = 1 === this.api.brEnable ? !!this.api.hardware_status.lan_status[0].IPInterfaceIPAddress : (this.api.hardware_status.wan_ip_status[0]?.ExternalIPAddress || this.api.hardware_status.wan_ip_status[0]?.ExternalIPv6Address) && !!this.api.hardware_status.wan_ip_status[0].gwwanup, this.deviceInternetStatusGlobal = t, this.serviceOverviewInfo[1].status = t ? "online" : "offline", this.serviceOverviewInfo[1].desc = t ? this.constants.ONLINE_LABEL : this.constants.OFFLINE_LABEL, s = !(!this.api.hardware_status.Wan_status || "Enabled" !== this.api.hardware_status.Wan_status["WIFI_2.4GHZ"] && "Enabled" !== this.api.hardware_status.Wan_status.WIFI_5GHZ && !this.api.hardware_status.Wan_status.WIFI_5GHZ_High), this.serviceOverviewInfo[2].status = s ? "online" : "offline", this.serviceOverviewInfo[2].desc = s ? this.constants.ONLINE_LABEL : this.constants.OFFLINE_LABEL, this.showVoiceStatusInfo ? this.api.hardware_status.Voice_status && ("1" === this.api.hardware_status.is_TR069_cfgType ? this.api.hardware_status.Voice_status.lines_config?.length && (n = "Up" === this.api.hardware_status.Voice_status?.lines_config[0]?.Status || "Up" === this.api.hardware_status.Voice_status?.lines_config[1]?.Status) : this.api.hardware_status.Voice_status.voip_config?.length && (n = "Registered" === this.api.hardware_status.Voice_status?.voip_config[0]?.status || "Registered" === this.api.hardware_status.Voice_status?.voip_config[1]?.status)) : this.serviceOverviewInfo[3].enable = !1, this.serviceOverviewInfo[3].status = n ? "online" : "offline", this.serviceOverviewInfo[3].desc = n ? this.constants.ONLINE_LABEL : this.constants.OFFLINE_LABEL, this.setEthernetStatusObj()
                        } catch (t) {
                            console.log("Error in processOverview status CGI data", t)
                        }
                    }

                    getWifiOverallStatus(t) {
                        this.logger.info({msg: "getWifiOverallStatus", devData: t}), this.wifiOverallStatus = t
                    }

                    ngOnDestroy() {
                        this.message.hideMessage({show: !1}), this.alertUtil.hideContentModalLoader(), this.pureViewSnackbarService.hideMessageSnackbar(), this.selectedMapDetails = null, this.langChangeSub.unsubscribe(), this.pageRefreshSub && this.pageRefreshSub.unsubscribe(), this.fiveGReceiverPolling?.unsubscribe(), this.FWAGWRadioAccessPolling?.unsubscribe(), this.isFWADeviceSubscription?.unsubscribe(), this.cachePollingInterval && this.cachePollingInterval.unsubscribe(), this.constants.SHOW_BACK_BUTTON = !1
                    }

                    initForm() {
                        this.editSSIDForm = new d.gE({
                            name: new d.MJ("", d.k0.required),
                            password: new d.MJ("", d.k0.required)
                        }), this.addWifiPointForm = new d.gE({serialNumber1: new d.MJ("", d.k0.required)})
                    }

                    validateForm() {
                        this.validateSaveButton = !(!this.ssidTempName || !this.ssidTempPassword || this.oldssidName === this.ssidTempName && this.oldssidPassword === this.ssidTempPassword)
                    }

                    gotoWan() {
                        this.route.navigateByUrl("wan/wan-services")
                    }

                    gotoWifi() {
                        this.route.navigateByUrl("/wifi/wifi-networks")
                    }

                    gotoNetworkMap() {
                        this.route.navigateByUrl("/wifi/network-map")
                    }

                    gotoDeviceDetail() {
                    }

                    onMapClick(t) {
                        if (this.selectedMapDetails = t, this.api.isSFUDevice) this.showDetails = !0, this.api.selectedExtender.nodeSubText = t?.nodeSubText, this.api.selectedExtender.apsName = t?.apsName, this.api.selectedExtender.modelName = t?.modelName, this.api.selectedExtender.isRoot = 1, this.api.selectedExtender.isOnline = 1, this.api.selectedExtender.isConnectionOk = this.ponStatus, this.constants.SHOW_BACK_BUTTON = !1; else {
                            this.ntwTopoList = this.api.overview_status.ntwtopo_cfg.sort((a, r) => r.isRoot - a.isRoot);
                            const s = this.ntwTopoList.filter(a => t.macAddress === a.MACAddress);
                            let n;
                            if (this.api.selectedExtender = s[0], this.ntwTopoList.length > 0 && "0" == this.ntwTopoList[0]?.isRoot && s[0]?.SerialNumber == this.ntwTopoList[0]?.SerialNumber && (this.api.selectedExtender.isRoot = 2), n = this.prodcfg.supportsFWADevice ? this.api.get_device_info.X_ASB_COM_FriendlyName ? this.api.get_device_info.X_ASB_COM_FriendlyName : this.api.get_device_info.ModelName : this.api.get_device_info.getRootFriendlyNameIfAvailable_(this.api.get_device_info.ModelName, this.api.get_device_info.X_ASB_COM_FriendlyName, this.api.get_home_ntw_topo.getRootMacAddress()), s.length > 0) {
                                const r = this.utility.formatNetworkMapData(this.api.overview_status.network_map).aps.find((_, p) => _?.macaddress === this.api.selectedExtender?.MACAddress);
                                let l = "";
                                if (r) {
                                    const _ = this.api.network_tpl_status.getDeviceNameIfLong(r?.modelName);
                                    l = this.api.network_tpl_status.getBeaconFriendlyName(this.api.overview_status.alias_cfg, this.api.selectedExtender.MACAddress, _)
                                }
                                this.showDetails = !0, this.constants.SHOW_BACK_BUTTON = !0, this.constants.PAGE_TITLE = 1 == this.api.selectedExtender.isRoot ? n : l || t?.name, this.api.selectedExtender.friendlyName = 1 == this.api.selectedExtender.isRoot ? n : l || t?.name, this.api.selectedExtender.connectedtofriendlyName = t?.connectedToNode, this.api.selectedExtender.connectedBand = t.connectedBand, this.api.selectedExtender.MACAddress = t?.macAddre
                                ss ? t?.macAddress : t?.MACAddress ? t?.MACAddress : ""
                            } else "root" == t.role && (this.api.selectedExtender = {
                                isRoot: 1,
                                isOnline: 1
                            }, this.showDetails = !0, this.constants.SHOW_BACK_BUTTON = !0, this.constants.PAGE_TITLE = n, this.api.selectedExtender.friendlyName = n || this.api.selectedExtender?.MACAddress, this.api.selectedExtender.MACAddress = this.ntwTopoList[0]?.MACAddress ? this.ntwTopoList[0]?.MACAddress : "");
                            this.api.selectedExtender.nodeSubText = t?.nodeSubText, this.api.selectedExtender.apsName = t?.apsName, this.api.selectedExtender.modelName = t?.modelName, this.api.selectedExtender.isConnectionOk = "root" !== t.role || this.deviceInternetStatusGlobal || this.ponStatus || this.prodcfg.supportsFWADevice && (this.ConnectionStatus5G || this.ConnectionStatus4G || this.api.isFWAmmWaveReceiver && this.ConnectionStatus5GPS)
                        }
                        this.logger.console(this.api.selectedExtender)
                    }

                    get name() {
                        return this.editSSIDForm.get("name")
                    }

                    get password() {
                        return this.editSSIDForm.get("password")
                    }

                    onPasswordToggleEvent(t) {
                        this.passwordShow = t
                    }

                    isSameCredentialsSaved() {
                        return this.name.value === this.oldssidName && this.password.value === this.oldssidPassword
                    }

                    updateSSID() {
                        this.wifiBandCount = [1], this.wifiGetcallsCount = 0, this.wifiSetcallsCount = 0, this.saveProgressLength = 0;
                        const t = this.ssidTempName, s = this.ssidTempPassword;
                        this.validateSaveButton = !1;
                        const n = this.ssidTempData;
                        if (this.isSameCredentialsSaved()) return this.isUsernameValidated = !1, this.isPasswordValidated = !1, this.passwordErrorMessage = this.constants.DIFF_SSID_PASSWORD, !1;
                        if (!this.websocket.maxLengthValidation(unescape(encodeURIComponent(t)), 32)) return this.isUsernameValidated = !1, this.isPasswordValidated = !0, this.ssidErrorMessage = this.constants.SSID_NAME_MAXLEN, this.passwordErrorMessage = "", !1;
                        if (!new RegExp(this.constants.REGEX_WIFI_PASSWORD).test(s)) return this.isPasswordValidated = !1, this.passwordErrorMessage = this.constants.WPA_KEY_VALID, !1;
                        if (this.prodcfg.supportsFWADevice && (s.includes("^") || s.includes("<") || s.includes(">"))) return this.isPasswordValidated = !1, this.passwordErrorMessage = this.constants.WPA_KEY_VALID, !1;
                        if (t.includes("'") || t.includes('"')) return this.isUsernameValidated = !1, this.ssidErrorMessage = this.constants.SSID_NOT_VALID, !1;
                        if (this.prodcfg.supportsFWADevice && (t.includes("^") || t.includes("<") || t.includes(">"))) return this.isUsernameValidated = !1, this.ssidErrorMessage = this.constants.SSID_NOT_VALID, !1;
                        if (n.isSSidNameExists) {
                            for (let r = 0; r < this.wifiOverallStatus.length; r++) if (t === this.wifiOverallStatus[r].SSID && this.oldssidName !== t) return this.isUsernameValidated = !1, this.isPasswordValidated = !0, this.ssidErrorMessage = this.constants.ERR_IS_NAME_EXIST, this.passwordErrorMessage = "", !1;
                            if (this.disabledSSIDs.length) for (let r = 0; r < this.disabledSSIDs.length; r++) if (t === this.disabledSSIDs[r].SSID && this.oldssidName !== t) return this.isUsernameValidated = !1, this.isPasswordValidated = !0, this.ssidErrorMessage = this.constants.ERR_IS_NAME_EXIST, this.passwordErrorMessage = "", !1
                        } else if (2.4 == n.wifiType) {
                            for (let r = 0; r < this.modWifi2Data.length; r++) if (t === this.modWifi2Data[r].SSID && this.oldssidName !== t) return this.isUsernameValidated = !1, this.isPasswordValidated = !0, this.ssidErrorMessage = this.constants.ERR_IS_NAME_EXIST, this.passwordErrorMessage = "", !1
                        } else if (5 == n.wifiType) {
                            for (let r = 0; r < this.modWifi5Data.length; r++) if (t === this.modWifi5Data[r].SSID && this.oldssidName !== t) return this.isUsernameValidated = !1, this.isPasswordValidated = !0, this.ssidErrorMessage = this.constants.ERR_IS_NAME_EXIST, this.passwordErrorMessage = "", !1
                        } else if (9 == n.wifiType && (this.prodcfg.triBand || this.prodcfg.quadBand)) for (let r = 0; r < this.modwifi5hData.length; r++) if (t === this.modwifi5hData[r].SSID && this.oldssidName !== t) return this.isUsernameValidated = !1, this.isPasswordValidated = !0, this.ssidErrorMessage = this.constants.ERR_IS_NAME_EXIST, this.passwordErrorMessage = "", !1;
                        if (2.4 == n.wifiType) {
                            if (!new RegExp(this.prodcfg.supportsFWADevice ? this.constants.REGEX_FWA_WIFI_PASSWORD : this.constants.REGEX_WIFI_PASSWORD).test(s) && ("Private1" === n.encryptionmode || "Private2" === n.encryptionmode)) return this.isUsernameValidated = !0, this.isPasswordValidated = !1, this.ssidErrorMessage = "", this.passwordErrorMessage = this.regexErrorMessage2, !1
                        } else if (!new RegExp(this.prodcfg.supportsFWADevice ? this.constants.REGEX_FWA_WIFI_PASSWORD : this.constants.REGEX_WIFI_PASSWORD).test(s) && ("Private1" === n.encryptionmode || "Private2" === n.encryptionmode)) return this.isUsernameValidated = !0, this.isPasswordValidated = !1, this.ssidErrorMessage = "", this.passwordErrorMessage = this.regexErrorMessage5, !1;
                        if (this.prodcfg.supportsFWADevice && (s.includes("^") || s.includes("<") || s.includes(">"))) return this.isUsernameValidated = !0, this.isPasswordValidated = !1, this.ssidErrorMessage = "", this.regexErrorMessage5 = this.constants.WPA_KEY_VALID, this.passwordErrorMessage = this.regexErrorMessage5, !1;
                        this.editWiFiCount = 0, this.editWiFiRetCount = 0;
                        const a = this.editWifiCardSSID.length;
                        this.hasPasswordSetFailure = !1;
                        for (let r = 0; r < this.editWifiCardSSID.length; r++) {
                            this.prodcfg.quadBand ? (this.proceed5GSaveEdit = !(2 == a && this.editWifiCardSSID[0] < 5 && this.editWifiCardSSID[1] > 4 && this.editWifiCardSSID[1] < 9 || 3 == a && this.editWifiCardSSID[0] < 5 && this.editWifiCardSSID[1] > 4 && this.editWifiCardSSID[1] < 9 && this.editWifiCardSSID[2] > 8 || 4 == a), this.proceed5GHighSaveEdit = !(2 == a && this.editWifiCardSSID[0] > 4 && this.editWifiCardSSID[0] < 9 && this.editWifiCardSSID[1] > 8 && this.editWifiCardSSID[1] < 13 || 2 == a && this.editWifiCardSSID[0] < 5 && this.editWifiCardSSID[1] > 8 && this.editWifiCardSSID[1] < 13 || 3 == a && this.editWifiCardSSID[0] < 5 && this.editWifiCardSSID[1] > 4 && this.editWifiCardSSID[2] > 8 || 3 == a && this.editWifiCardSSID[0] > 5 && this.editWifiCardSSID[1] > 8 && this.editWifiCardSSID[2] > 12 || 4 == a), this.proceed6GSaveEdit = !(2 == a && this.editWifiCardSSID[0] < 4 && this.editWifiCardSSID[1] > 12 || 2 == a && this.editWifiCardSSID[0] > 4 && this.editWifiCardSSID[1] > 12 || 3 == a && this.editWifiCardSSID[0] < 5 && this.editWifiCardSSID[1] > 4 && this.editWifiCardSSID[2] > 12 || 3 == a && this.editWifiCardSSID[0] > 4 && this.editWifiCardSSID[1] > 8 && this.editWifiCardSSID[2] > 12 || 4 == a)) : (this.proceed5GSaveEdit = !(2 == a && this.editWifiCardSSID[0] < 5 || 3 == a), this.proceed5GHighSaveEdit = 3 != a);
                            const l = parseInt(this.editWifiCardSSID[r]);
                            this.alertUtil.showModalLoader(), this.completeWifiData.forEach((_, p) => {
                                l == _.ssidselect && this.saveSSIDEditDetails(l, _)
                            })
                        }
                    }

                    saveSSIDEditDetails(t, s) {
                        this.hasBandSteering = s.bandSteering, this.getDataFlow = !1, this.isSavingInprogress = !0, this.isStarHubDevice = null != this.api.type && -1 !== this.gconfig.starHubDevices.indexOf(this.api.type.toString()), t > 0 && t < 5 ? this.saveWireless24Info(s) : t > 4 && t < 9 ? this.saveWireless5Info(s) : t > 8 && t < 13 ? this.saveWireless5Infoh(s) : t > 12 && t < 17 && this.saveWireless6Info(s)
                    }

                    hideEditModalLoader() {
                        this.alertUtil.hideModalLoader(), this.closeDialog(!0)
                    }

                    SaveSSIDSuccess() {
                        this.data5Ghz = this.api.overview_status?.wireless5_info?.wlan_config_glb11ac ? this.api.overview_status?.wireless5_info?.wlan_config_glb11ac : [], this.wifiOverallStatus = [];
                        const t = "TRUE" === this.api.overview_status?.wireless2_info?.is_whw_one_package_support,
                            s = "TRUE" === this.api.overview_status?.wireless5_info?.is_whw_one_package_support;
                        let n, a;
                        this.api.is6GSupported ? n = "TRUE" === this.api.overview_status.wireless6_info?.is_whw_one_package_support : this.prodcfg.quadBand ? (n = "TRUE" === this.api.overview_status.wireless5h_info?.is_whw_one_package_support, a = "TRUE" === this.api.overview_status.wireless6_info?.is_whw_one_package_support) : n = "TRUE" === this.api.overview_status.wireless5h_info?.is_whw_one_package_support, this.data2Ghz.length && this.data5Ghz.length && (this.wifiOverallStatus = this.api.getWifiOverallStatus(this.data2Ghz, this.data5Ghz, this.data5Ghz_high, this.api.type, t, s, n, this.data6Ghz, a, this.prodcfg.supportsFWADevice, this.isbandSteeringDualBand, this.api.is6GSupported)), this.disabledSSIDs = this.api.getDisabledSSIDList(), this.syncWanConfigData(), this.modWifi2Data = this.api.wifi2Data, this.modWifi5Data = this.api.wifi5Data, this.modwifi5hData = this.api.wifi5hData, this.completeWifiData = [], this.completeWifiData = this.api.completeWifiData, this.editWiFiCount == this.editWiFiRetCount && this.closeDialog(!1)
                    }

                    getLanDeviceData(t) {
                        this.lanDeviceList = [], this.wifiCountList = [], this.ethernetCountList = [], this.connectedCountList = [], this.notConnectedCountList = [];
                        for (const n of t.device_cfg) (2 == n.X_ALU_COM_IsBeacon || 3 == n.X_ALU_COM_IsBeacon || 0 == n.X_ALU_COM_IsBeacon && this.prodcfg.isFWAReceiver) && (this.lanDeviceList.push(n), 1 == n.Active ? (this.connectedCountList.push(n), "802.11" == n.InterfaceType || "802.11ac" == n.InterfaceType || "802.11radio3" == n.InterfaceType || "802.11ax" == n.InterfaceType ? this.wifiCountList.push(n) : this.ethernetCountList.push(n)) : this.notConnectedCountList.push(n));
                        this.connectedCountPercent = this.connectedCountList.length / (this.connectedCountList.length + this.notConnectedCountList.length) * 100
                    }

                    titleFormat() {
                        return this.lanDeviceList.length
                    }

                    syncNtwTplData(t) {
                        if (this.ntwTopoList = [], t && t.ntwtopo_cfg) for (const a of t.ntwtopo_cfg) this.ntwTopoList.push(a);
                        const s = this.ntwTopoList[0],
                            n = this.ntwTopoList.slice(1).sort((a, r) => r.HostName < a.HostName ? 1 : -1);
                        null != s && null != n ? this.ntwTopoList = [s, ...n] : null != s ? this.ntwTopoList = [s] : null != n && (this.ntwTopoList = [...n])
                    }

                    getEncryptionPersonalOption24(t) {
                        return "Private1" === t || "Private" === t ? "Private" : t
                    }

                    passwordChangeErrorClearInterval() {
                        this.multiBSaveInstance5Edit && (this.proceed5GSaveEdit = !1, window.clearInterval(this.multiBSaveInstance5Edit)), this.multiBSaveInstance6Edit && (this.proceed6GSaveEdit = !1, window.clearInterval(this.multiBSaveInstance6Edit)), this.multiBSaveInstance5HEdit && (this.proceed5GHighSaveEdit = !1, window.clearInterval(this.multiBSaveInstance5HEdit))
                    }

                    saveWireless24Info(t) {
                        const s = this.ssidTempName,
                            n = this.api.device_capability.getVal("wifi", "wifiNetworks", "bandSteering").isOn;
                        let a, r;
                        "ENTERPRISE" === t?.encryptionmode?.toUpperCase() || "ENTERPRISE2" === t?.encryptionmode?.toUpperCase() ? (t.primarypwd = this.ssidTempPassword, a = t?.PreSharedKey) : (r = this.ssidTempPassword, a = encodeURIComponent(r));
                        let l = `wl_mode=${t.mode}&wl_ofdma=${t.X_ASB_COM_OfdmaEnable}&wl_NChannelwidth=${t.bandwidth}&wl_channel=${t.channel}&wl_power=${t.power}&wl_wmm=${t.wmm}&total_max_user=${t.totalmaxusers}&wl_id=${t.ssidselect}&wl_ssid=${encodeURIComponent(s)}&wl_ssidname=${encodeURIComponent(s)}&wl_en=${t.ssidenable}&wl_broad=${t.broadcast}&port_mode=${t.portmode}&isReboot=0&max_user=${t.maxusers}&wl_encryptmode=${this.getEncryptionPersonalOption24(t.encryptionmode)}&wl_weptype=${t.wepencryptionmode}&wepKeyBit=${t.encryptionlevel}&wepKey1=${encodeURIComponent(t.wepkeypwd)}&wpaenc=${t.wpaencryptionValue}&radius_ser=${t.primaryserver}&radius_port=${t.primaryport}&radius_pwd=${t.primarypwd}&radius_ser2=${t.secondaryserver}&radius_port2=${t.secondaryport}&radius_pwd2=${t.secondarypwd}&account_port=${t.accountingserverport}&account_key=${t.accountingserverkey}&account_time=${t.servertimeinterval}&wl_wps=${t.enablewps}&wl_wpsmode=${t.wpsmode}&wl_pin=${t.pincode}&wl_wpaver=${t.wpaversionvalue}`;
                        t.enableWireless && (l += "&wl_enable=on"), ("Private" === t.encryptionmode || "Private1" === t.encryptionmode || "Enterprise" === t.encryptionmode || "Private2" === t.encryptionmode || "Private3" === t.encryptionmode) && (this.wifiCardEdit.hasOwnProperty("password") || "WPA3" == t.wpaversionvalue) && (l += `&wpaKey=${a}`), l += "&dnName=dfault&newDomain=&wanList=-2&nofIP=24";
                        const _ = t.ssidIndex.toString().split(",");
                        if (this.isMultibandSSID = _.length > 1, this.isbandSteeringDualBand && this.isMultibandSSID && n) {
                            const p = t?.bandSteering;
                            l += `&sync_value=${p}`
                        }
                        Object.keys(this.wifiCardEdit).length && Object.keys(this.wifiCardEdit).forEach(p => {
                            this.saveLocalDataHolder(this.api.wireless2_info.wlan_config_glb[t.ssidselect - 1], p, this.wifiCardEdit[p])
                        }), this.logger.console(l), t.ssidIndex && "string" == typeof t.ssidIndex && -1 !== t.ssidIndex.indexOf(",") && (this.wifiBandCount = t.ssidIndex.split(",")), this.api.request(this, "setWireless2Info", l)
                    }

                    saveWireless5Info(t) {
                        const s = this.ssidTempName;
                        let a, r;
                        this.api.device_capability.getVal("wifi", "wifiNetworks", "bandSteering"), "ENTERPRISE" === t?.encryptionmode?.toUpperCase() || "ENTERPRISE2" === t?.encryptionmode?.toUpperCase() ? (t.primarypwd = this.ssidTempPassword, a = t?.PreSharedKey) : (r = this.ssidTempPassword, a = encodeURIComponent(r));
                        let l = `wl_bandwidth=${t.bandwidth}&wl_ofdma=${t.X_ASB_COM_OfdmaEnable}&wl_channel=${t.channel}&wl_power=${t.power}&wl_wmm=${t.wmm}&wl_mimo=${t.enablemumimo}&total_max_user=${t.totalmaxusers}&wl_id=${t.ssidselect}&wl_ssid=${encodeURIComponent(s)}&wl_ssidname=${encodeURIComponent(s)}&wl_en=${t.ssidenable}&wl_broad=${t.broadcast}&port_mode=${t.portmode}&isReboot=0&max_user=${t.maxusers}&wl_encryptmode=${t.encryptionmode}&wl_weptype=${t.wepencryptionmode}&wepKeyBit=${t.encryptionlevel}&wepKey1=${encodeURIComponent(t.wepkeypwd)}&radius_ser=${t.primaryserver}&radius_port=${t.primaryport}&radius_pwd=${t.primarypwd}&radius_ser2=${t.secondaryserver}&radius_port2=${t.secondaryport}&radius_pwd2=${t.secondarypwd}&account_port=${t.accountingserverport}&account_key=${t.accountingserverkey}&account_time=${t.servertimeinterval}&wl_wps=${t.enablewps}&wl_wpsmode=${t.wpsmode}&wl_pin=${t.pincode}&wl_wpaver=${t.wpaversionvalue}&wpaenc=${t.wpaencryptionValue}`;
                        if (t.enableWireless && (l += "&wl_enable=on"), "None" !== t.encryptionmode && (this.wifiCardEdit.hasOwnProperty("password") || "WPA3" == t.wpaversionvalue) && (l += `&wpaKey=${a}`), l += "&dnName=dfault&newDomain=&wanList=-2&nofIP=24", this.isbandSteeringDualBand && this.isMultibandSSID && this.api.device_capability.getVal("wifi", "wifiNetworks", "bandSteering").isOn) {
                            const _ = t?.bandSteering;
                            l += `&sync_value=${_}`
                        }
                        this.logger.console(l), Object.keys(this.wifiCardEdit).length && Object.keys(this.wifiCardEdit).forEach(_ => {
                            this.saveLocalDataHolder(this.api.wireless5_info.wlan_config_glb11ac[t.ssidselect - 5], _, this.wifiCardEdit[_])
                        }), "string" == typeof t.ssidIndex && -1 !== t.ssidIndex.indexOf(",") && (this.wifiBandCount = t.ssidIndex.split(",")), this.hasBandSteering || this.api.request(this, "setWireless5Info", l)
                    }

                    saveWireless5Infoh(t) {
                        const s = this.ssidTempName;
                        let n, a;
                        "ENTERPRISE" === t?.encryptionmode?.toUpperCase() || "ENTERPRISE2" === t?.encryptionmode?.toUpperCase() ? (t.primarypwd = this.ssidTempPassword, n = t?.PreSharedKey) : (a = this.ssidTempPassword, n = encodeURIComponent(a));
                        let r = `wl_bandwidth=${t.bandwidth}&wl_ofdma=${t.X_ASB_COM_OfdmaEnable}&wl_channel=${t.channel}&wl_power=${t.power}&wl_wmm=${t.wmm}&wl_mimo=${t.enablemumimo}&total_max_user=${t.totalmaxusers}&wl_id=${t.ssidselect}&wl_ssid=${encodeURIComponent(s)}&wl_ssidname=${encodeURIComponent(s)}&wl_en=${t.ssidenable}&wl_broad=${t.broadcast}&port_mode=${t.portmode}&isReboot=0&max_user=${t.maxusers}&wl_encryptmode=${t.encryptionmode}&wl_weptype=${t.wepencryptionmode}&wepKeyBit=${t.encryptionlevel}&wepKey1=${encodeURIComponent(t.wepkeypwd)}&radius_ser=${t.primaryserver}&radius_port=${t.primaryport}&radius_pwd=${t.primarypwd}&radius_ser2=${t.secondaryserver}&radius_port2=${t.secondaryport}&radius_pwd2=${t.secondarypwd}&account_port=${t.accountingserverport}&account_key=${t.accountingserverkey}&account_time=${t.servertimeinterval}&wl_wps=${t.enablewps}&wl_wpsmode=${t.wpsmode}&wl_pin=${t.pincode}&wl_wpaver=${t.wpaversionvalue}&wpaenc=${t.wpaencryptionValue}`;
                        t.enableWireless && (r += "&wl_enable=on"), "None" !== t.encryptionmode && (this.wifiCardEdit.h
                        asOwnProperty("password") || "WPA3" == t.wpaversionvalue
                    )&&
                        (r += `&wpaKey=${n}`), r += "&dnName=dfault&newDomain=&wanList=-2&nofIP=24", this.logger.console(r), Object.keys(this.wifiCardEdit).length && Object.keys(this.wifiCardEdit).forEach(l => {
                            this.saveLocalDataHolder(this.api.is6GSupported ? this.api.wireless6_info.wlan_config_glb_6g_band[t.ssidselect - 9] : this.api.wireless5h_info.wlan_config_glb_11ac_highband[t.ssidselect - 9], l, this.wifiCardEdit[l])
                        }), "string" == typeof t.ssidIndex && -1 !== t.ssidIndex.indexOf(",") && (this.wifiBandCount = t.ssidIndex.split(",")), this.api.request(this, this.api.is6GSupported ? "setWireless6Info" : "setWireless5Infoh", r)
                    }

                    saveWireless6Info(t) {
                        const s = this.ssidTempName;
                        let n, a;
                        "ENTERPRISE" === t?.encryptionmode?.toUpperCase() || "ENTERPRISE2" === t?.encryptionmode?.toUpperCase() ? (t.primarypwd = this.ssidTempPassword, n = t?.PreSharedKey) : (a = this.ssidTempPassword, n = encodeURIComponent(a));
                        let r = `wl_bandwidth=${t.bandwidth}&wl_ofdma=${t.X_ASB_COM_OfdmaEnable}&wl_channel=${t.channel}&wl_power=${t.power}&wl_wmm=${t.wmm}&wl_mimo=${t.enablemumimo}&total_max_user=${t.totalmaxusers}&wl_id=${t.ssidselect}&wl_ssid=${encodeURIComponent(s)}&wl_ssidname=${encodeURIComponent(s)}&wl_en=${t.ssidenable}&wl_broad=${t.broadcast}&port_mode=${t.portmode}&isReboot=0&max_user=${t.maxusers}&wl_encryptmode=${t.encryptionmode}&wl_weptype=${t.wepencryptionmode}&wepKeyBit=${t.encryptionlevel}&wepKey1=${encodeURIComponent(t.wepkeypwd)}&radius_ser=${t.primaryserver}&radius_port=${t.primaryport}&radius_pwd=${t.primarypwd}&radius_ser2=${t.secondaryserver}&radius_port2=${t.secondaryport}&radius_pwd2=${t.secondarypwd}&account_port=${t.accountingserverport}&account_key=${t.accountingserverkey}&account_time=${t.servertimeinterval}&wl_wps=${t.enablewps}&wl_wpsmode=${t.wpsmode}&wl_pin=${t.pincode}&wl_wpaver=${t.wpaversionvalue}&wpaenc=${t.wpaencryptionValue}`;
                        t.enableWireless && (r += "&wl_enable=on"), "None" !== t.encryptionmode && this.wifiCardEdit.hasOwnProperty("password") && (r += `&wpaKey=${n}`), r += "&dnName=dfault&newDomain=&wanList=-2&nofIP=24", this.logger.console(r), "string" == typeof t.ssidIndex && -1 !== t.ssidIndex.indexOf(",") && (this.wifiBandCount = t.ssidIndex.split(",")), Object.keys(this.wifiCardEdit).length && Object.keys(this.wifiCardEdit).forEach(l => {
                            this.saveLocalDataHolder(this.api.is6GSupported ? this.api.wireless6_info.wlan_config_glb_6g_band[t.ssidselect - 9] : this.api.wireless6_info.wlan_config_glb_6g_band[t.ssidselect - 13], l, this.wifiCardEdit[l])
                        }), this.api.request(this, "setWireless6Info", r)
                    }

                    getWIFICalls() {
                        const t = this.api.device_capability.getVal("wifi", "wifiNetworks", "bandSteering").isOn;
                        !this.hasPasswordSetFailure && (this.hasBandSteering && t && this.wifiBandCount.length !== this.wifiSetcallsCount || this.wifiBandCount.length == this.wifiSetcallsCount || this.wifiGetcallsCount >= this.wifiBandCount.length) && (this.wifiCardEdit = {}, this.editSSIDForm.markAsPristine(), this.editSSIDForm.markAsUntouched(), this.pureViewSnackbarService.showMessageSnackbar({
                            show: !0,
                            description: this.constants.CONFIGURATION_EARLY_SUCCESS,
                            buttonText: null,
                            iconBefore: "tick_white",
                            autoHideDelayTime: 3
                        }), this.wifiBandCount.length == this.wifiSetcallsCount && (this.wifiSetcallsCount = 0, this.SaveSSIDSuccess()), this.wifiBandCount.length == this.wifiGetcallsCount && (this.wifiGetcallsCount = 0, this.SaveSSIDSuccess()), this.hideEditModalLoader(), this.alertUtil.hideContentModalLoader())
                    }

                    closeDialog(t) {
                        t && (this.openWifiNetworkModal = !1), this.ssidTempName = "", this.ssidTempPassword = "", this.oldssidName = "", this.oldssidPassword = "", this.ssidTempData = [], this.validateSaveButton = !1, this.isSavingInprogress = !1
                    }

                    editWifi(t) {
                        this.wifiCardEdit = {}, this.resetallInputs(), this.showPasswordSection = !0, this.editWifiCardSSID = [], this.editWifiCardSSID = t?.ssidIndex.toString().split(","), this.openWifiNetworkModal = !0, this.ssidTempName = t.SSID, this.ssidTempPassword = "ENTERPRISE" === t?.encryptionmode?.toUpperCase() || "ENTERPRISE2" === t?.encryptionmode?.toUpperCase() ? t.primarypwd : t.PreSharedKey, this.oldssidName = this.ssidTempName, this.oldssidPassword = this.ssidTempPassword, this.ssidTempData = t, this.name.setValue(this.ssidTempName), this.password.setValue(this.ssidTempPassword), this.showPasswordSection = "None" !== t.encryptionmode
                    }

                    resetallInputs() {
                        this.isUsernameValidated = !0, this.isPasswordValidated = !0, this.ssidErrorMessage = "", this.passwordErrorMessage = ""
                    }

                    onPasswordChange(t, s) {
                        this.isPasswordValidated = !0, this.passwordErrorMessage = "", this.ssidTempPassword = t ? t.trim() : "", this.validateForm()
                    }

                    onUsernameModelChange(t, s) {
                        this.isUsernameValidated = !0, this.ssidErrorMessage = "", this.ssidTempName = t ? t.trim() : "", this.validateForm()
                    }

                    viewAllDevices(t) {
                        this.route.navigateByUrl("/devices")
                    }

                    viewAllFamilyProfiles(t) {
                        t && this.route.navigateByUrl("/security/family-profiles")
                    }

                    viewAllWifiPoints(t) {
                        this.route.navigateByUrl("/status/device-info")
                    }

                    showWifiPointDetail(t) {
                        const s = {
                            parentMenu: {
                                name: this.constants.STATUS_LABEL,
                                routerLink: "status/device-info",
                                selected: null,
                                showSubmenu: !1,
                                breadCrumb: this.constants.STATUS_LABEL + "/" + this.constants.DEVICE_INFO,
                                visibility: !0,
                                key: "status"
                            },
                            subMenu: {
                                name: this.constants.DEVICE_INFO,
                                routerLink: "status/device-info",
                                selected: !1,
                                breadCrumb: this.constants.STATUS_LABEL + "/" + this.constants.DEVICE_INFO,
                                visibility: !0,
                                key: "deviceInformation"
                            }
                        };
                        this.api.selectedExtender = t, this.pubSubService.publish(c.VR.DEVICE_DETAILS, t), this.pubSubService.publish(c.VR.NAV_CHANGED, s), "0" == this.ntwTopoList[0].isRoot && t.SerialNumber == this.ntwTopoList[0].SerialNumber && (this.api.selectedExtender.isRoot = 2), this.route.navigateByUrl("/status/device-details")
                    }

                    showHidePassword() {
                        this.showPassword = !this.showPassword
                    }

                    checkDataModelData() {
                        this.regexErrorMessage2 = this.constants.WPA_KEY_VALID, this.regexErrorMessage5 = this.constants.WPA_KEY_VALID, this.wireless2Data = this.api.wireless2_info, this.wireless5Data = this.api.wireless5_info, this.data2Ghz = this.api.wireless2_info?.wlan_config_glb, this.data5Ghz = this.api.wireless5_info?.wlan_config_glb11ac, this.api.is6GSupported ? (this.wireless5hdata = this.api.wireless6_info, this.data5Ghz_high = this.api.wireless6_info?.wlan_config_glb_6g_band) : this.prodcfg.quadBand ? (this.wireless6data = this.api.wireless6_info, this.data6Ghz = this.api.wireless6_info?.wlan_config_glb_6g_band, this.wireless5hdata = this.api.wireless5h_info, this.data5Ghz_high = this.api.wireless5h_info?.wlan_config_glb_11ac_highband) : (this.wireless5hdata = this.api.wireless5h_info, this.data5Ghz_high = this.api.wireless5h_info?.wlan_config_glb_11ac_highband), this.api.overview_status.device_cfg.length && (this.hasDeviceList = !0), this.api.hardware_status.wan_port_status[0].Status ? localStorage.getItem("overviewLoaded") || this.api.isPreLoginSupport ? (this.processOverViewData(), this.setWanIP(this.api.hardware_status), setTimeout(() => {
                            this.api.request(this, "getOverviewStatus", "nocache")
                        }, 1e3)) : this.getOverviewCache() : this.api.request(this, "getHardwareStatus"), this.api.device_capability.getVal("overview", "radioAccess", "visibility").isOn && (this.fiveGReceiverPolling && this.fiveGReceiverPolling.unsubscribe(), this.fiveGReceiverPolling = (0, N.O)(0, R.Ou.FIVE_SECONDS).subscribe(() => {
                            this.hasRadioAccessError ? (this.hasRadioAccessError = 0, this.fiveGReceiverPolling.unsubscribe()) : this.hasRadioAccessData && (this.hasRadioAccessData = !1, this.api.request(this, "getRadioAccessStatus"))
                        }))
                    }

                    checkSFUData() {
                        !this.api.router_info.gwmodel.includes("Beacon") && !this.prodcfg.supportsFWADevice && ("" == this.api.get_optical_status?.Status ? this.api.request({
                            onSuccess: t => {
                                this.ponStatus = "" !== this.api.get_optical_status?.Status && "UP" == this.api.get_optical_status?.Status?.toUpperCase(), this.goToSFUOverview()
                            }, onError: t => {
                            }
                        }, "getOpticalStatus") : (this.ponStatus = "" !== this.api.get_optical_status?.Status && "UP" == this.api.get_optical_status?.Status?.toUpperCase(), this.goToSFUOverview()))
                    }

                    goToSFUOverview() {
                        const t = this.api.network_tpl_status.getDeviceNameIfLong(this.api.type),
                            n = this.ponStatus ? this.api.network_tpl_status.getNodeImageGreen(t) : this.api.network_tpl_status.getNodeImageRed(t),
                            a = !!this.api.router_info.gwmodel.includes("Beacon"), r = {
                                name: this.api.get_device_info.getRootFriendlyNameIfAvailable(t, this.api.get_device_info.X_ASB_COM_FriendlyName),
                                nodeSubText: this.getNodeStatus(a, this.ponStatus),
                                role: "root",
                                signalIndicator: n
                            };
                        this.alertUtil.hideContentModalLoader(), this.onMapClick(r)
                    }

                    getData() {
                        this.getDataFlow = !0, this.api.isSFUDevice ? this.checkSFUData() : this.checkDataModelData()
                    }

                    syncMeshData(t) {
                        this.detectedMesh = [];
                        const s = t.beacon_detail || [];
                        let n = "";
                        null != t.root_info && t.root_info.length > 0 && (n = t.root_info[0].RootMacAddress);
                        for (let a = 0; a < s.length; a++) (n != s[a].MACAddress && "" != n || "" == n) && this.beaconDetailList.push(s[a]);
                        for (let a = 0; a < this.beaconDetailList.length; a++) "NotDetected" !== this.beaconDetailList[a].OnboardStatus && this.detectedMesh.push(this.beaconDetailList[a]);
                        this.detectedMeshCount = this.detectedMesh.length ? this.detectedMesh.length : 0
                    }

                    getChildInfo(t, s) {
                        const n = this.getMeshTopoInfo(s);
                        n.childSubElements = [];
                        for (let a = 0; a < s.meshbackhaulnodes.length; a++) {
                            const r = t.filter(l => l.id === s.meshbackhaulnodes[a]);
                            r && r.length && "root" !== r[0].role && "online" === r[0].status && n.childSubElements.push(this.getChildInfo(t, r[0]))
                        }
                        return n
                    }

                    getMeshTopoInfo(t) {
                        const s = this.api.network_tpl_status.getDeviceNameIfLong(t.modelName);
                        let n = "";
                        if ("root" === t.role) {
                            if (this.prodcfg.supportsFWADevice) var a = this.api.get_device_info.X_ASB_COM_FriendlyName ? this.api.get_device_info.X_ASB_COM_FriendlyName : t?.modelName; else a = this.api.get_device_info.getRootFriendlyNameIfAvailable_(this.api.get_device_info.ModelName, this.api.get_device_info.X_ASB_COM_FriendlyName, this.api.get_home_ntw_topo.getRootMacAddress());
                            n = a
                        } else {
                            const b = this.api.network_tpl_status.getDeviceNameIfLong(t?.modelName);
                            n = this.api.network_tpl_status.getBeaconFriendlyName(this.api.home_ntw_status.alias_cfg, t.macaddress, b)
                        }
                        let r, l, _, p, u = [];
                        const E = t["isbackhaul-connected"],
                            S = !(!this.api.router_info.gwmodel.includes("Beacon") && !this.api.router_info.gwmodel.includes("AAP321NK"));
                        if (l = this.deviceInternetStatusGlobal ? "green_circle" : "red_circle", E && "online" === t.status && (this.deviceInternetStatusGlobal || this.ponStatus || this.prodcfg.supportsFWADevice && (this.ConnectionStatus5G || this.ConnectionStatus4G || this.api.isFWAmmWaveReceiver && this.ConnectionStatus5GPS) || "root" !== t.role)) {
                            const b = t.backhaulQuality ? t.backhaulQuality.toUpperCase() : "";
                            "GOOD" === b ? (r = this.api.network_tpl_status.getNodeImageGreen(s), _ = "root" === t.role ? this.getNodeStatus(S, this.ponStatus) : "strongSignal") : "NORMAL" === b ? (r = this.api.network_tpl_status.getNodeImageGreen(s), _ = "root" === t.role ? this.getNodeStatus(S, this.ponStatus) : "normalSignal") : (r = "root" === t.role ? this.api.network_tpl_status.getNodeImageGreen(s) : this.api.network_tpl_status.getNodeImageYellow(s), _ = "root" === t.role ? this.getNodeStatus(S, this.ponStatus) : "poorSignal")
                        } else r = this.api.network_tpl_status.getNodeImageRed(s), _ = "root" === t.role ? this.getNodeStatus(S, this.ponStatus) : "notConnected";
                        if ("root" != t.role) {
                            const b = this.api.network_tpl_status.ntwtopo_cfg.find(B => B.MACAddress == t.backhaulmac && "1" == B.isRoot),
                                M = this.api.network_tpl_status.getDeviceNameIfLong(t.modelName);
                            let T = this.api.network_tpl_status.getBeaconFriendlyName(this.api.home_ntw_status.alias_cfg, t.backhaulmac, M);
                            const ei = this.api.get_device_info.getRootFriendlyNameIfAvailable_(this.api.get_device_info.ModelName, this.api.get_device_info.X_ASB_COM_FriendlyName, this.api.get_home_ntw_topo.getRootMacAddress());
                            T = b ? ei : T || x.n.convertMac(t.backhaulmac), p = T, u = [...t.mediumList]
                        }
                        return {
                            name: n || x.n.convertMac(t.macaddress) || t.name,
                            apsName: t?.name,
                            modelName: t?.modelName,
                            macAddress: t?.macaddress,
                            nodeSubText: _,
                            signalIndicator: r,
                            globeIndicator: l,
                            connectedToNode: p,
                            connectedBand: u
                        }
                    }

                    getNodeText(t) {
                        let s = "";
                        switch (t) {
                            case"wanPortUp":
                                s = this.constants.WAN_PORT_UP;
                                break;
                            case"wanPortDown":
                                s = this.constants.WAN_PORT_DOWN;
                                break;
                            case"linkUp5G":
                                s = this.constants.LINK_UP_5G;
                                break;
                            case"linkUp4G":
                                s = this.constants.LINK_UP_4G;
                                break;
                            case"ethWanPortUp":
                                s = this.constants.ETHERNET_LABEL + " " + this.constants.WAN_PORT_UP;
                                break;
                            case"linkDown5G":
                                s = this.constants.LINK_DOWN_5G;
                                break;
                            case"ethWanPortDown":
                                s = this.constants.ETHERNET_LABEL + " " + this.constants.WAN_PORT_DOWN;
                                break;
                            case"ponPortUp":
                                s = this.constants.PON_PORT_UP;
                                break;
                            case"ponPortDown":
                                s = this.constants.PON_PORT_DOWN;
                                break;
                            case"strongSignal":
                                s = this.constants.SIGNAL_STRENGTH_GOOD;
                                break;
                            case"normalSignal":
                                s = this.constants.SIGNAL_STRENGTH_NORMAL;
                                break;
                            case"poorSignal":
                                s = this.constants.SIGNAL_STRENGTH_POOR;
                                break;
                            case"notConnected":
                                s = this.constants.NOT_CONNECTED_LABEL;
                                break;
                            case"linkUpMMW":
                                s = this.constants.LINK_UP_MMW;
                                break;
                            case"linkDownMMW":
                                s = this.constants.LINK_DOWN_MMW;
                                break;
                            default:
                                s = ""
                        }
                        return s
                    }

                    getNodeStatus(t, s) {
                        let n = "";
                        return t ? n = "Up" == this.api.hardware_status.wan_port_status[0]?.Status ? "wanPortUp" : "wanPortDown" : this.deviceInternetStatusGlobal ? this.prodcfg.supportsFWADevice ? "Ethernet" !== this.showCellularOrEthernet ? this.api.isFWAmmWaveReceiver && this.ConnectionStatus5GPS ? n = "linkUpMMW" : this.ConnectionStatus5G ? n = "linkUp5G" : this.ConnectionStatus4G && (n = "linkUp4G") : n = "ethWanPortUp" : n = s ? "ponPortUp" : "ponPortDown" : n = t ? "wanPortDown" : this.prodcfg.supportsFWADevice ? "Ethernet" !== this.showCellularOrEthernet ? this.api.isFWAmmWaveReceiver && this.ConnectionStatus5GPS ? "linkUpMMW" : this.ConnectionStatus5G ? "linkUp5G" : this.ConnectionStatus4G ? "linkUp4G" : this.api.isFWAmmWaveReceiver ? "linkDownMMW" : "linkDown5G" : "ethWanPortDown" : s ? "ponPortUp" : "ponPortDown", n
                    }

                    getBeaconQuality(t) {
                        if (t["isbackhaul-connected"] && "online" === t.status) {
                            const n = t.backhaulQuality ? t.backhaulQuality.toUpperCase() : "";
                            return "GOOD" === n ? "good" : "NORMAL" === n ? "normal" : "poor"
                        }
                        return "offline" === t.status ? "offline" : "bad"
                    }

                    getNetworkDevices() {
                        this.networkMapChildCount = 0;
                        const t = {meshTreeData: {}, notConnectedDevices: [], averageDevices: [], connectedDevices: []};
                        let s = {};
                        const n = this.dashboardMeshNetworkInfo, a = n.aps.filter(r => "root" === r.role);
                        if (n.aps.map(r => {
                            if ("Beacon" == r.modelName && (r.modelName = "Beacon 1"), "root" != r.role && ("bad" === this.getBeaconQuality(r) || "offline" === this.getBeaconQuality(r)) && a && a.length && a[0].meshbackhaulnodes.indexOf(r.id) < 0 && a[0].meshbackhaulnodes.push(r.id), a && a.length) {
                                s = this.getMeshTopoInfo(a[0]), s.role = "root", s.apsLength = n.aps.length, s.rootChildElements = [];
                                for (let l = 0; l < s.apsLength; l++) {
                                    const _ = n.aps[l];
                                    for (let p = 0; p < _.meshbackhaulnodes.length; p++) {
                                        const u = n.aps.filter(E => E.id === _.meshbackhaulnodes[p]);
                                        u && u.length && "root" === _.role && s.rootChildElements.push(this.getChildInfo(n.aps, u[0]))
                                    }
                                }
                            }
                        }), null == s.apsLength) {
                            const r = this.api.network_tpl_status.getDeviceNameIfLong(this.api.get_device_info.ModelName ? this.api.get_device_info.ModelName : this.api.router_info.gwmodel),
                                _ = this.deviceInternetStatusGlobal || this.ponStatus || this.prodcfg.supportsFWADevice && (this.ConnectionStatus5G || this.ConnectionStatus4G || this.api.isFWAmmWaveReceiver && this.ConnectionStatus5GPS) ? this.api.network_tpl_status.getNodeImageGreen(r) : this.api.network_tpl_status.getNodeImageRed(r),
                                p = !(!this.api.router_info.gwmodel.includes("Beacon") && !this.api.router_info.gwmodel.includes("AAP321NK"));
                            t.meshTreeData = {
                                name: this.api.get_device_info.getRootFriendlyNameIfAvailable(r, this.api.get_device_info.X_ASB_COM_FriendlyName),
                                nodeSubText: this.getNodeStatus(p, this.ponStatus),
                                role: "root",
                                signalIndicator: _
                            }
                        } else t.meshTreeData = s;
                        return t.meshTreeData.rootChildElements && t.meshTreeData.rootChildElements.length && (this.networkMapChildCount = this.utility.getDepth(t.meshTreeData.rootChildElements), this.logger.console("NETWORK MAP CHILD", this.networkMapChildCount)), t
                    }

                    setBackhaulNodes(t) {
                        this.networkMapChildComponent = !1;
                        const s = this.utility.formatNetworkMapData(t);
                        let n = [];
                        n = null != s?.aps && s?.aps?.length ? s?.aps : [], this.networkMapLong = !!(n.length > 1 && this.api.device_capability.getVal("overview", "networkMap", "visibility").isOn), this.isScrollBarNeeded = n.length > 3;
                        for (var a = 0; a < s.aps.length; a++) {
                            s.aps[a].meshbackhaulnodes = [];
                            const r = s.aps.filter(l => "root" !== l.role && l.backhaulmac === s.aps[a].macaddress);
                            for (const l of r) s.aps[a].meshbackhaulnodes.push(l.id)
                        }
                        this.dashboardMeshNetworkInfo = s, this.beaconData = this.getNetworkDevices(), setTimeout(() => {
                            this.networkMapChildComponent = !0
                        }, 10)
                    }

                    showWanIP() {
                        ("" !== this.wanIPAddress || "" !== this.wanIPv6Address) && (this.openWanIPDialog = !0)
                    }

                    closeWanIPDialog() {
                        this.openWanIPDialog = !1
                    }

                    setWanIP(t) {
                        if (t?.wan_ip_status?.length && (this.wanIPAddress = t?.wan_ip_status[0]?.ExternalIPAddress, this.wanIPv6Address = t?.wan_ip_status[0]?.ExternalIPv6Address), this.serviceStatusList = [{
                            name: this.constants.INTERNET,
                            image: "def_internet_globe_red",
                            status: this.constants.OFFLINE_LABEL
                        }], this.syncWanData(), this.serviceStatusList[0].status = this.deviceInternetStatusGlobal ? this.constants.ONLINE_LABEL : this.constants.OFFLINE_LABEL, this.serviceStatusList[0].image = this.deviceInternetStatusGlobal ? "def_internet_globe_green" : "def_internet_globe_red", this.setBackhaulNodes(this.api.overview_status.network_map), this.api.device_capability.getVal("overview", "serviceStatus", "voiceInformation").isOn) {
                            this.serviceStatusList.push({
                                name: this.constants.SERVICE_OVERVIEW_VOICE,
                                image: "def_voice_red",
                                status: this.constants.OFFLINE_LABEL
                            });
                            const s = this.serviceStatusList.length - 1;
                            "1" === this.api.hardware_status.is_TR069_cfgType ? this.api.hardware_status.Voice_status.lines_config?.length && (this.serviceStatusList[s].status = "Up" === this.api.hardware_status.Voice_status?.lines_config[0]?.Status || "Up" === this.api.hardware_status.Voice_status?.lines_config[1]?.Status ? this.constants.ONLINE_LABEL : this.constants.OFFLINE_LABEL, this.serviceStatusList[s].image = "Up" === this.api.hardware_status.Voice_status?.lines_config[0]?.Status || "Up" === this.api.hardware_status.Voice_status?.lines_config[1]?.Status ? "def_voice_green" : "def_voice_red") : this.api.hardware_status.Voice_status.voip_config?.length && (this.serviceStatusList[s].status = "Registered" === this.api.hardware_status.Voice_status?.voip_config[0]?.status || "Registered" === this.api.hardware_status.Voice_status?.voip_config[1]?.status ? this.constants.ONLINE_LABEL : this.constants.OFFLINE_LABEL, this.serviceStatusList[s].image = "Registered" === this.api.hardware_status.Voice_status?.voip_config[0]?.status || "Registered" === this.api.hardware_status.Voice_status?.voip_config[1]?.status ? "def_voice_green" : "def_voice_red")
                        }
                    }

                    syncWanData() {
                        if (this.wanData = this.api.overview_status, this.wanData?.wan_conns?.length) for (let t = 0; t < this.wanData.wan_conns.length; t++) {
                            const s = this.wanData.wan_conns[t], n = s.ipConns.length ? s.ipConns[0] : s.pppConns[0];
                            n && (n.X_CT_COM_ServiceList?.includes("OTHER") || n.X_CT_COM_ServiceList?.includes("IPTV")) && (this.isIptvEnabledWan = !0, this.serviceStatusList.push({
                                name: this.constants.IPTV,
                                image: "def_devices_tv_bad",
                                status: this.constants.OFFLINE_LABEL
                            }), this.setIPTVStatus(n.Name, s._oid))
                        }
                    }

                    setIPTVStatus(t, s) {
                        if (this.wanStatusData?.wan_conns?.length) for (let n = 0; n < this.wanStatusData.wan_conns.length; n++) {
                            const a = this.wanStatusData.wan_conns[n],
                                r = a.ipConns.length ? a.ipConns[0] : a.pppConns[0];
                            r && r.Name === t && a._oid === s && "Connected" === r.ConnectionStatus && (this.serviceStatusList[1].status = this.constants.ONLINE_LABEL, this.serviceStatusList[1].image = "def_devices_tv_good")
                        }
                    }

                    setDeviceInterfaceStatus() {
                        this.prodcfg.supports5Ghigh ? (this.deviceInterfaceList = [this.createDeviceInterface(this.constants.WIFI_24GHZ, "def_wifi_offline"), this.createDeviceInterface(this.constants.WIFI_5GHZLOW, "def_wifi_offline"), this.createDeviceInterface(this.constants.WIFI_5GHZHIGH, "def_wifi_offline")], this.prodcfg.quadBand && this.deviceInterfaceList.push(this.createDeviceInterface(this.constants.WIFI_6GHZ, "wifi_offline"))) : this.deviceInterfaceList = this.api.is6GSupported ? [this.createDeviceInterface(this.constants.WIFI_24GHZ, "def_wifi_offline"), this.createDeviceInterface(this.constants.WIFI_5GHZ, "def_wifi_offline"), this.createDeviceInterface(this.constants.WIFI_6GHZ, "wifi_offline")] : [this.createDeviceInterface(this.constants.WIFI_24GHZ, "def_wifi_offline"), this.createDeviceInterface(this.constants.WIFI_5GHZ, "def_wifi_offline")], this.wireless2Data?.wlan_config_glb && this.setWirelessInterface(this.wireless2Data?.wlan_config_glb, 0), this.wireless5Data?.wlan_config_glb11ac && this.setWirelessInterface(this.wireless5Data?.wlan_config_glb11ac, 1), this.prodcfg.supports5Ghigh ? (this.wireless5hdata?.wlan_config_glb_11ac_highband && this.setWirelessInterface(this.wireless5hdata?.wlan_config_glb_11ac_highband, 2), this.prodcfg.quadBand && this.wireless6data?.wlan_config_glb_6g_band && this.setWirelessInterface(this.wireless6data?.wlan_config_glb_6g_band, 3)) : this.api.is6GSupported && this.wireless5hdata?.wlan_config_glb_6g_band && this.setWirelessInterface(this.wireless5hdata?.wlan_config_glb_6g_band, 2), this.ethernetData && this.setEthernetStatus(this.ethernetData)
                    }

                    setEthernetStatusObj() {
                        this.deviceInterfaceList = [], this.noWiFiSupport ? this.ethernetData && this.setEthernetStatus(this.ethernetData) : this.setDeviceInterfaceStatus()
                    }

                    setWirelessInterface(t, s) {
                        if (t?.length) for (let a = 0; a < t.length; a++) {
                            if (0 == s) var n = !(!this.api.hardware_status.Wan_status || "Enabled" !== this.api.hardware_status.Wan_status["WIFI_2.4GHZ"]); else n = 2 == s && this.prodcfg.supports5Ghigh ? !(!this.api.hardware_status.Wan_status || "Enabled" !== this.api.hardware_status.Wan_status.WIFI_5GHZ_High) : 2 == s && this.api.is6GSupported || 3 == s && this.prodcfg.quadBand ? !(!this.api.hardware_status.Wan_status || "Enabled" !== this.api.hardware_status.Wan_status.WIFI_6GHZ) : !(!this.api.hardware_status.Wan_status || "Enabled" !== this.api.hardware_status.Wan_status.WIFI_5GHZ);
                            return this.deviceInterfaceList[s].connectionStatus = this.getWifiConnectionStatusString(n, t[a].AutoChannelEnable), this.deviceInterfaceList[s].image = n ? "def_wifi_online" : "def_wifi_offline", this.deviceInterfaceList[s].channel = this.constants.CHANNEL + " " + t[a].Channel, void (this.deviceInterfaceList[s].bandwidth = "BW " + (t[a].X_ASB_COM_CurrentOperatingChannelBandwidth ?? "-"))
                        }
                    }

                    getWifiConnectionStatusString(t, s) {
                        let n = this.constants.DOWN_LABEL;
                        return t && (n = this.constants.UP_LABEL), n += ", ", n += 1 === s ? this.constants.AUTO_LABEL : this.constants.MANUAL_LABEL, n
                    }

                    setEthernetStatus(t) {
                        if (t?.lan_ether?.length) for (let s = 0; s < t.lan_ether.length; s++) {
                            const n = s + 1, a = "Up" == t.lan_ether[s]?.Status,
                                r = "Up" == t.lan_ether[s]?.Status ? this.constants.UP_LABEL : this.constants.DOWN_LABEL,
                                l = "Full" == t.lan_ether[s]?.X_ALU_COM_CurDuplexMode || this.prodcfg.supportsFWADevice && "Full" == t.lan_ether[s]?.DuplexMode ? this.constants.FULL_DUPLEX : this.constants.HALF_DUPLEX;
                            this.deviceInterfaceList.push(this.createDeviceInterface(this.constants.ETHERNET_PORT + " " + n, a ? "def_ethernet_int_online" : "def_ethernet_int_offline", r + ", " + ("Auto" == t.lan_ether[s]?.X_ALU_COM_CurMaxBitRate ? "Auto" : (t.lan_ether[s]?.X_ALU_COM_CurMaxBitRate ? t.lan_ether[s]?.X_ALU_COM_CurMaxBitRate : "0") + " Mbps") + " " + l))
                        } else this.deviceInterfaceList.find(n => "Ethernet" == n.name) || this.deviceInterfaceList.push(this.createDeviceInterface(this.constants.ETHERNET_LABEL, "def_ethernet_int_offline", this.constants.DOWN_LABEL));
                        this.api.device_capability.getVal("application", "usb", "visibility").isOn && this.isUSBSupport && !this.prodcfg.supportsFWADevice && (this.prodcfg.supportsFWADevice || this.api.hardware_status?.usb_support?.enabled) && this.setUsbInterfaceStatus()
                    }

                    setUsbInterfaceStatus() {
                        this.deviceInterfaceList.push(this.api.overview_status?.hardware_status?.usb_status?.status ? this.createDeviceInterface(this.constants.USB, "def_usb_online", this.constants.UP_LABEL) : this.createDeviceInterface(this.constants.USB, "def_usb_offline", this.constants.DOWN_LABEL))
                    }

                    processRadioAccessCard(t) {
                        const n = t?.cell_5G_stats_cfg[0]?.stat?.RSRPCurrent,
                            a = t?.cell_LTE_stats_cfg[0]?.stat?.RSRPCurrent;
                        this.radioAccessList[0].connectionStatus = -32768 !== n ? this.constants.CONNECTED_LABEL : this.constants.NOT_CONNECTED_LABEL, this.radioAccessList[1].connectionStatus = -32768 !== a ? this.constants.CONNECTED_LABEL : this.constants.NOT_CONNECTED_LABEL, this.radioAccessList[0].image = n && -32768 !== n ? "signal_wifi_" + t.cell_5G_stats_cfg[0].stat.RSRPStrengthIndexCurrent : "signal_wifi_0", this.radioAccessList[1].image = a && -32768 !== a ? "signal_wifi_" + t.cell_LTE_stats_cfg[0].stat.RSRPStrengthIndexCurrent : "signal_wifi_0"
                    }

                    processRadioAccessCardFWAGW(t) {
                        const n = t?.cell_5G_stats_cfg[0]?.stat?.RSRPCurrent,
                            a = t?.cell_LTE_stats_cfg[0]?.stat?.RSRPCurrent;
                        if (this.cell5GRSRP = t.cell_5G_stats_cfg[0].stat.RSRPCurrent, this.cell5GRSRQ = t.cell_5G_stats_cfg[0].stat.RSRQCurrent, this.cell5GSNR = t.cell_5G_stats_cfg[0].stat.SNRCurrent, this.cell5GSignalStrengthLevel = t.cell_5G_stats_cfg[0].stat.SignalStrengthLevel, this.cell5GMIMORANK = t.cell_5G_stats_cfg[0].stat.RankIndicator, this.cellLTERSSI = t.cell_LTE_stats_cfg[0].stat.RSSICurrent, this.cellLTERSRP = t.cell_LTE_stats_cfg[0].stat.RSRPCurrent, this.cellLTERSRQ = t.cell_LTE_stats_cfg[0].stat.RSRQCurrent, this.cellLTESNR = t.cell_LTE_stats_cfg[0].stat.SNRCurrent, this.cellLTESignalStrengthLevel = t.cell_LTE_stats_cfg[0].stat.SignalStrengthLevel, this.cellLTEMIMORANK = t.cell_LTE_stats_cfg[0].stat.RankIndicator, this.radioAccessFWAList[0].connectionStatus = -32768 !== n ? this.constants.CONNECTED_LABEL : this.constants.NOT_CONNECTED_LABEL, this.radioAccessFWAList[1].connectionStatus = -32768 !== a ? this.constants.CONNECTED_LABEL : this.constants.NOT_CONNECTED_LABEL, this.ConnectionStatus5G = this.radioAccessFWAList[0].connectionStatus == this.constants.CONNECTED_LABEL, this.ConnectionStatus4G = this.radioAccessFWAList[1].connectionStatus == this.constants.CONNECTED_LABEL, n && -32768 !== n ? (this.radioAccessFWAList[0].image = "signal_wifi_" + t.cell_5G_stats_cfg[0].stat.RSRPStrengthIndexCurrent, this.radioAccessFWAList[0].connectionBoolean = !0) : (this.radioAccessFWAList[0].image = "signal_wifi_0", this.radioAccessFWAList[0].connectionBoolean = !1), a && -32768 !== a ? (this.radioAccessFWAList[1].image = "signal_wifi_" + t.cell_LTE_stats_cfg[0].stat.RSRPStrengthIndexCurrent, this.radioAccessFWAList[1].connectionBoolean = !0) : (this.radioAccessFWAList[1].image = "signal_wifi_0", this.radioAccessFWAList[1].connectionBoolean = !1), t.cell_5G_stats_cfg[0].stat.Display5GPlus && (this.radioAccessFWAList[0].name = this.constants.SIGNAL_5G + "+ " + this.constants.SIGNAL), this.api.isFWAmmWaveReceiver) {
                            const _ = t?.cell_5GPS_stats_cfg[0]?.stat?.RSRPCurrent;
                            this.cell5GPSRSRP = t.cell_5GPS_stats_cfg[0].stat.RSRPCurrent, this.cell5GPSRSRQ = t.cell_5GPS_stats_cfg[0].stat.RSRQCurrent, this.cell5GPSSNR = t.cell_5GPS_stats_cfg[0].stat.SNRCurrent, this.cell5GPSSignalStrengthLevel = t.cell_5GPS_stats_cfg[0].stat.SignalStrengthLevel, this.radioAccessFWAList[2].connectionStatus = -32768 !== _ ? this.constants.CONNECTED_LABEL : this.constants.NOT_CONNECTED_LABEL, this.ConnectionStatus5GPS = this.radioAccessFWAList[2].connectionStatus == this.constants.CONNECTED_LABEL, _ && -32768 !== _ ? (this.radioAccessFWAList[2].image = "signal_wifi_" + t.cell_5GPS_stats_cfg[0].stat.RSRPStrengthIndexCurrent, this.radioAccessFWAList[2].connectionBoolean = !0) : (this.radioAccessFWAList[2].image = "signal_wifi_0", this.radioAccessFWAList[2].connectionBoolean = !1)
                        }
                        const r = t.WAN[0].Mode, l = t.WAN[0].ActiveWAN;
                        this.showCellularOrEthernet = l, "" == l && (this.showCellularOrEthernet = "CellularOnly" == r || "ActiveStandbyWithCellularHigh" == r ? "Cellular" : "EthernetOnly" == r || "ActiveStandbyWithEthernetHigh" == r ? "Ethernet" : "Cellular"), this.bluetoothStatus = "Up" === t.bluetooth_status[0].Status && 1 === t.bluetooth_status[0].Enable ? [{
                            name: this.constants.BLUETOOTH,
                            image: "bluetooth_on",
                            connectionStatus: this.constants.ON_LABEL,
                            channel: ""
                        }] : [{
                            name: this.constants.BLUETOOTH,
                            image: "bluetooth_off",
                            connectionStatus: this.constants.OFF_LABEL,
                            channel: ""
                        }], this.prodcfg.isFWAReceiver && this.selectIcons()
                    }

                    setFWAReceiverServiceStatus() {
                        if (this.api.supports5LevelsOfSignalStrengh) {
                            if (4 === this.cellLTESignalStrengthLevel || 4 === this.cell5GSignalStrengthLevel || 5 === this.cellLTESignalStrengthLevel || 5 === this.cell5GSignalStrengthLevel) return void (this.signalStrengthStatus = "serviceOptimal");
                            if (2 === this.cellLTESignalStrengthLevel || 2 === this.cell5GSignalStrengthLevel || 3 === this.cellLTESignalStrengthLevel || 3 === this.cell5GSignalStrengthLevel) return void (this.signalStrengthStatus = "serviceFair");
                            if (1 === this.cellLTESignalStrengthLevel || 1 === this.cell5GSignalStrengthLevel) return void (this.signalStrengthStatus = "servicePoor")
                        } else {
                            if (3 === this.cellLTESignalStrengthLevel || 3 === this.cell5GSignalStrengthLevel) return void (this.signalStrengthStatus = "serviceOptimal");
                            if (2 === this.cellLTESignalStrengthLevel || 2 === this.cell5GSignalStrengthLevel) return void (this.signalStrengthStatus = "serviceFair");
                            if (1 === this.cellLTESignalStrengthLevel || 1 === this.cell5GSignalStrengthLevel) return void (this.signalStrengthStatus = "servicePoor")
                        }
                        this.signalStrengthStatus = "serviceNotConnected"
                    }

                    setFWAMMWReceiverServiceStatus() {
                        this.signalStrengthStatus = 3 !== this.cell5GPSSignalStrengthLevel ? 2 !== this.cell5GPSSignalStrengthLevel ? 1 !== this.cell5GPSSignalStrengthLevel ? "serviceNotConnected" : "servicePoor" : "serviceFair" : "serviceOptimal"
                    }

                    selectIcons() {
                        switch (this.api.isFWAmmWaveReceiver ? this.setFWAMMWReceiverServiceStatus() : this.setFWAReceiverServiceStatus(), this.signalStrengthStatus) {
                            case"serviceNotConnected":
                                this.signalStrengthIcon = "service_not_connected", this.signalStrengthStatusText = this.constants.NOT_CONNECTED_LABEL;
                                break;
                            case"servicePoor":
                                this.signalStrengthIcon = "service_poor", this.signalStrengthStatusText = this.constants.POOR;
                                break;
                            case"serviceFair":
                                this.signalStrengthIcon = "service_fair", this.signalStrengthStatusText = this.constants.FAIR;
                                break;
                            case"serviceOptimal":
                                this.signalStrengthIcon = "service_optimal", this.signalStrengthStatusText = this.constants.OPTIMAL
                        }
                    }

                    reloadMap(t) {
                        t.includes("overview") && (this.pubSubService.publish(c.VR.OVERVIEW_BACK_EVENT), this.api.request(this, "getHomeNtwTopo"), this.api.request(this, "getNetworkTplStatus"))
                    }

                    syncPonStatus(t) {
                        this.ponStatus = "" !== t?.Status && "UP" == t?.Status?.toUpperCase(), this.setBackhaulNodes(this.api.overview_status.network_map)
                    }

                    passwordSetFailure(t) {
                        if (t?.ret && 1 != t?.ret) {
                            const s = this.alertUtil.onWifiPasswordChange(t.ret);
                            this.showWarning(s), this.hideEditModalLoader(), this.passwordChangeErrorClearInterval(), this.hasPasswordSetFailure = !0
                        } else this.getWIFICalls()
                    }

                    checkAllCardLoaded(t) {
                        let s = 0;
                        t.hasOwnProperty("networkmap_card") && "completed" == t.networkmap_card && s++, t.hasOwnProperty("service_card") && "completed" == t.service_card && s++, t.hasOwnProperty("wifistatus_card") && "completed" == t.wifistatus_card && s++, t.hasOwnProperty("connectedclient_card") && "completed" == t.connectedclient_card && s++, t.hasOwnProperty("lanservice_card") && "completed" == t.lanservice_card && s++, console.log(s), s >= 5 && this.cachePollin
                        gInterval && !this.cachePollingInterval?.closed && (console.log("Overview cache polling stopped"), this.api.overview_status.isAllCardDataLoaded = !0, this.cachePollingInterval.unsubscribe())
                    }

                    getOverviewCache() {
                        this.api.overview_status?.isDataAvailable || this.api.overview_status?.isAllCardDataLoaded || this.api.isPreLoginSupport ? (this.processOverViewData(), this.setWanIP(this.api.hardware_status)) : this.cachePollingInterval = (0, U.Y)(3e3).subscribe(t => {
                            console.log("getOverviewStatus cgi called", t), this.api.request(this, "getOverviewStatus", "cache")
                        })
                    }

                    onSuccess(t) {
                        const s = t.data;
                        switch (this.isQualBoard = this.prodcfg.supportQualcomm, t.action) {
                            case c.En.GET_OVERVIEW_STATUS:
                                this.overviewCacheErrCount = 0, this.api.isPreLoginSupport || this.checkAllCardLoaded(s), this.ponStatus = "" !== s.pon_status?.Status && "UP" == s.pon_status?.Status?.toUpperCase(), this.processOverViewData(), ("completed" == s.connectedclient_card && !this.api.overview_status.device_cfg.length || this.api.overview_status.device_cfg.length) && (this.hasDeviceList = !0), this.setWanIP(this.api.hardware_status), this.pageLoadInitial = !1, !this.api.isPreLoginSupport && this.cachePollingInterval && this.cachePollingInterval.closed && !this.noCacheCalled ? (localStorage.setItem("overviewLoaded", "1"), this.cachePollingInterval = void 0) : this.noCacheCalled = !0;
                                break;
                            case c.En.GET_HARDWARE_STATUS:
                                localStorage.getItem("overviewLoaded") || this.api.isPreLoginSupport ? (this.api.overview_status?.isDataAvailable && (this.processOverViewData(), this.setWanIP(this.api.hardware_status)), setTimeout(() => {
                                    this.api.request(this, "getOverviewStatus", "nocache")
                                }, 1e3)) : this.getOverviewCache();
                                break;
                            case c.En.GET_MESH_INFO:
                                this.addWifipointFetchdata = !0, this.rgwSerialNoList = this.api.get_mesh_info.is_rgwSerialNo, this.beaconDetailList1 = this.api.get_mesh_info.beacon_detail, this.beaconEntriesList = this.api.get_mesh_info.beaconEntries, this.wifiPointList = this.api.get_mesh_info.wifipoint_list;
                                break;
                            case c.En.GET_WIRELESS2_INFO:
                                const n = this.api.device_capability.getVal("wifi", "wifiNetworks", "bandSteering").isOn;
                                this.wifiGetcallsCount += 1, this.api.overview_status.wireless2_info.wlan_config_glb = this.api.wireless2_info.wlan_config_glb, this.data2Ghz = this.api.wireless2_info.wlan_config_glb, this.regexErrorMessage2 = this.constants.WPA_KEY_VALID, this.wireless2Data = s, this.setWirelessInterface(this.wireless2Data?.wlan_config_glb, 0), this.getWIFICalls(), this.hasBandSteering && n && this.api.request(this, "getWireless5Info");
                                break;
                            case c.En.GET_WIRELESS5h_INFO:
                                this.editWiFiRetCount += 1, this.wifiGetcallsCount += 1, this.wireless5hdata = s, this.api.overview_status.wireless5h_info.wlan_config_glb_11ac_highband = this.api.wireless5h_info.wlan_config_glb_11ac_highband, this.setWirelessInterface(this.wireless5hdata?.wlan_config_glb_11ac_highband, 2), this.data5Ghz_high = this.api?.wireless5h_info?.wlan_config_glb_11ac_highband ? this.api.wireless5h_info.wlan_config_glb_11ac_highband : [], this.getWIFICalls();
                                break;
                            case c.En.GET_WIRELESS6_INFO:
                                this.editWiFiRetCount += 1, this.wifiGetcallsCount += 1, this.api.is6GSupported ? (this.wireless5hdata = s, this.api.overview_status.wireless6_info.wlan_config_glb_6g_band = this.api.wireless6_info?.wlan_config_glb_6g_band, this.setWirelessInterface(this.wireless5hdata?.wlan_config_glb_6g_band, 2), this.data5Ghz_high = this.api.wireless6_info?.wlan_config_glb_6g_band ? this.api.wireless6_info?.wlan_config_glb_6g_band : []) : this.api.isQuardBandSupported ? (this.wireless6data = s, this.api.overview_status.wireless6_info.wlan_config_glb_6g_band = this.api.wireless6_info?.wlan_config_glb_6g_band, this.setWirelessInterface(this.wireless6data?.wlan_config_glb_6g_band, 3), this.data6Ghz = this.api.wireless6_info?.wlan_config_glb_6g_band ? this.api.wireless6_info?.wlan_config_glb_6g_band : []) : (this.wireless5hdata = s, this.api.overview_status.wireless6_info.wlan_config_glb_6g_band = this.api.wireless6_info?.wlan_config_glb_6g_band, this.setWirelessInterface(this.wireless5hdata?.wlan_config_glb_6g_band, 2), this.data5Ghz_high = this.api.wireless6_info?.wlan_config_glb_6g_band ? this.api.wireless6_info?.wlan_config_glb_6g_band : []), this.getWIFICalls();
                                break;
                            case c.En.GET_WIRELESS5_INFO:
                                this.wireless5Data = s, this.wifiGetcallsCount += 1, this.api.overview_status.wireless5_info.wlan_config_glb11ac = this.api.wireless5_info?.wlan_config_glb11ac, this.setWirelessInterface(this.wireless5Data?.wlan_config_glb11ac, 1), this.getWIFICalls();
                                break;
                            case c.En.SET_WIRELESS_2INFO:
                                this.wifiSetcallsCount += 1, this.hasBandSteering && this.api.device_capability.getVal("wifi", "wifiNetworks", "bandSteering").isOn && (this.wifiSetcallsCount += 1), this.passwordSetFailure(s);
                                break;
                            case c.En.SET_WIRELESS_5INFO:
                            case c.En.SET_WIRELESS_HIGHT_5INFO:
                            case c.En.SET_WIRELESS_6INFO:
                                this.wifiSetcallsCount += 1, this.passwordSetFailure(s);
                                break;
                            case c.En.GET_ROUTER_INFO:
                                this.loadRouterInfo(this.api);
                                break;
                            case c.En.SET_USB_TABLE_INFO:
                                this.usbTableData = [], s && s[0] && s[0][0] && s[0][1] && s[0][2] && s[0][3] && s[0][4] && (this.usbTableData.push({
                                    HostNumber: s[0][0],
                                    DeviceName: s[0][1],
                                    Format: s[0][2],
                                    TotalSpace: s[0][3],
                                    FreeSpace: s[0][4]
                                }), this.setEthernetStatusObj());
                                break;
                            case c.En.GET_MESH_INFO:
                                this.rgwSerialNoList = this.api.get_mesh_info.is_rgwSerialNo, this.beaconDetailList1 = this.api.get_mesh_info.beacon_detail, this.beaconEntriesList = this.api.get_mesh_info.beaconEntries;
                                break;
                            case c.En.SET_MESH_INFO:
                                this.addNewWifiPointModalShow = !1, this.api.request(this, "getMeshInfo");
                                break;
                            case c.En.GET_RADIO_ACCESS_STATUS:
                                this.hasRadioAccessData = !0, this.showRadioAccessCard = !0, this.processRadioAccessCard(s);
                                break;
                            case c.En.GET_OPTICAL_STATUS:
                                this.syncPonStatus(s);
                                break;
                            case c.En.GET_RADIO_ACCESS_STATUS_FWA_GW:
                                this.overviewCgiCount++, this.processRadioAccessCardFWAGW(s)
                        }
                    }

                    onError(t) {
                        switch (t.action) {
                            case c.En.GET_OVERVIEW_STATUS:
                                this.overviewCacheErrCount++, this.overviewCacheErrCount > 4 && (this.overviewCacheErrCount = 0, console.log("Overview cache polling stopped"), this.api.overview_status.isAllCardDataLoaded = !0, this.cachePollingInterval.unsubscribe(), this.noCacheCalled = !0, this.api.request(this, "getOverviewStatus", "nocache"), localStorage.setItem("overviewLoaded", "1")), console.error("Overview API Failed - Error"), console.error(t), this.processOverViewData();
                                break;
                            case c.En.GET_HARDWARE_STATUS:
                                500 == t.status && "Request Timeout" == t?.error && this.api.request(this, "getHardwareStatus"), console.error("Hardware Status API Failed - Error"), console.error(t);
                                break;
                            case c.En.GET_WIRELESS2_INFO:
                                console.error("GET_WIRELESS2_INFO API Failed - Error"), console.error(t), this.isStarHubDevice && this.saveProgressLength && this.hideEditModalLoader();
                                break;
                            case c.En.GET_WIRELESS5_INFO:
                                this.wifiGetcallsCount += 1, console.error("GET_WIRELESS5_INFO API Failed - Error"), console.error(t);
                                break;
                            case c.En.GET_WIRELESS6_INFO:
                                this.wifiGetcallsCount += 1, console.error("GET_WIRELESS6_INFO API Failed - Error"), console.error(t);
                                break;
                            case c.En.GET_WIRELESS5h_INFO:
                                this.wifiGetcallsCount += 1, console.error("GET_WIRELESS5h_INFO API Failed - Error"), console.error(t);
                                break;
                            case c.En.SET_WIRELESS_2INFO:
                                console.error("EDIT_WIFI_SSID_2.4 API Failed - Error"), console.error(t), this.wifiSetcallsCount += 1, this.hasBandSteering && this.api.device_capability.getVal("wifi", "wifiNetworks", "bandSteering").isOn && (this.wifiSetcallsCount += 1);
                                break;
                            case c.En.SET_WIRELESS_HIGHT_5INFO:
                                console.error("EDIT_WIFI_SSID_5h API Failed - Error"), console.error(t), this.wifiSetcallsCount += 1;
                                break;
                            case c.En.SET_WIRELESS_5INFO:
                                console.error("EDIT_WIFI_SSID_5 API Failed - Error"), console.error(t), this.wifiSetcallsCount += 1;
                                break;
                            case c.En.SET_WIRELESS_6INFO:
                                console.error("EDIT_WIFI_SSID_6 API Failed - Error"), console.error(t), this.wifiSetcallsCount += 1;
                                break;
                            case c.En.GET_ROUTER_INFO:
                                console.error("GET_ROUTER_INFO API Failed - Error"), console.error(t);
                                break;
                            case c.En.SET_USB_TABLE_INFO:
                                console.error("SET_USB_TABLE_INFO API Failed - Error"), console.error(t);
                                break;
                            case c.En.GET_MESH_INFO:
                                console.error("GET_MESH_INFO Failed - Error"), console.error(t);
                                break;
                            case c.En.SET_MESH_INFO:
                                this.addNewWifiPointModalShow = !1, console.error("SET_MESH_INFO API Failed - Error"), console.error(t);
                                break;
                            case c.En.GET_RADIO_ACCESS_STATUS:
                                this.showRadioAccessCard = !1, this.hasRadioAccessError += 1, console.error("GET_RADIO_ACCESS API Failed - Error", t);
                                break;
                            case c.En.GET_OPTICAL_STATUS:
                                console.error("GET_OPTICAL_STATUS API Failed - Error"), console.error(t);
                                break;
                            case c.En.GET_RADIO_ACCESS_STATUS_FWA_GW:
                                this.overviewCgiCount++, console.error("GET_RADIO_ACCESS_STATUS_FWA_GW API Failed - Error"), console.error(t)
                        }
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

                    navigateToReceiverWebGUI() {
                        window.open(this.constants.FIVEG_RECEIVER_URL, "_blank")
                    }

                    syncWanConfigData() {
                        if (this.bridgedSsids = this.api.getBridgedSSIDs(this.api.get_wan_config_status), this.api.get_wan_config_status?.SSID.forEach(t => {
                            t?.X_CT_COM_VLAN && "" !== t?.X_CT_COM_VLAN && this.bridgedSsids.push(t.SSID_num)
                        }), this.bridgedSsids.length) for (let t = 0; t < this.bridgedSsids.length; t++) for (let s = 0; s < this.wifiOverallStatus.length; s++) this.bridgedSsids[t] == this.wifiOverallStatus[s].ssidselect && (this.wifiOverallStatus[s].isBridgeSSID = !0)
                    }

                    static #e = this.\u0275fac = function (s) {
                        return new (s || i)(e.rXU(j.G), e.rXU(R.YM), e.rXU(C.Ix), e.rXU(X.V), e.rXU(H.Q), e.rXU(K.u), e.rXU(z.V), e.rXU(J.l), e.rXU(x.n), e.rXU(q.u), e.rXU(v.m4), e.rXU(Q.Z), e.rXU(v.gd))
                    };
                    static #t = this.\u0275cmp = e.VBU({
                        type: i,
                        selectors: [["app-overview"]],
                        decls: 23,
                        vars: 5,
                        consts: [["networkMap", ""], ["serviceStatus", ""], ["connectedClients", ""], ["wifiNetworks", ""], ["lanInterfaceStatus", ""], ["radioAccess", ""], ["radioAccessFWA", ""], ["customCellTemplate", ""], ["customCellTemplateFWA", ""], [4, "ngIf"], [3, "dialogConfig", "closeDialog", 4, "ngIf"], [1, "flex-row", "grid-gap-24"], ["class", "flexPercent33 overview__comp", "style", "height: 710px", 4, "ngIf"], [1, "flex-column", "overview", 2, "width", "100%"], [1, "flex-row", "grid-gap-24", "flex-flow-wrapped"], ["class", "overview__comp", 3, "ngClass", 4, "ngIf"], [1, "flexPercent33", "overview__comp", 2, "height", "710px"], [4, "ngTemplateOutlet"], [1, "overview__comp", 3, "ngClass"], ["class", "flex-row grid-gap-24", "pt-6", "", 4, "ngIf"], ["class", "flex-row grid-gap-24 overview", "pt-6", "", 4, "ngIf"], ["pt-6", "", 1, "flex-row", "grid-gap-24"], [1, "flex-column", "flexPercent33"], [1, "flex100"], ["pt-6", "", 1, "flex-row", "grid-gap-24", "overview"], ["class", "flex100 flex-column", 4, "ngIf"], [1, "flex100", "flex-column"], [3, "linkClick", "ngClass", "params"], [1, "overview__vertically-center", "overviewscroll", 3, "ngStyle"], ["class", "flex-column", "style", "justify-content: center;", 4, "ngIf"], [3, "pageName", "fetchNetworkData", "isChildComponent", "wifiSupport", "openDetails", 4, "ngIf"], [1, "flex-column", 2, "justify-content", "center"], [1, "flex-row", "flex100", 2, "display", "block", "margin-top", "10px", "text-align", "center"], ["appearance", "circle", 3, "theme"], [2, "display", "block"], [3, "theme"], [2, "width", "2px", "height", "50px", "position", "relative", "margin", "0 auto", "background", "#eff1f6"], [1, "flex33-gap16"], [3, "openDetails", "pageName", "fetchNetworkData", "isChildComponent", "wifiSupport"], [1, "flex100", "flex-column", 3, "linkClick", "params"], ["class", "flex-row", "style", "margin-top: 10px;", 4, "ngIf"], ["class", "flex-row", 4, "ngIf"], ["pt-5", "", 4, "ngIf"], [1, "flex-row", 2, "margin-top", "10px"], [1, "flex66", 2, "display", "block", "margin-top", "10px"], [1, "flex-row"], ["pt-5", ""], [4, "ngFor", "ngForOf"], ["style", "cursor: pointer;", "isTitleBody1Bold", "true", 3, "iconStart", "title", "subtext", "forwardIcon", "value", "click", 4, "ngIf"], ["isTitleBody1Bold", "true", 3, "iconStart", "title", "subtext", 4, "ngIf"], ["isTitleBody1Bold", "true", 2, "cursor", "pointer", 3, "click", "iconStart", "title", "subtext", "forwardIcon", "value"], ["isTitleBody1Bold", "true", 3, "iconStart", "title", "subtext"], ["class", "flex100  flex-column", 3, "params", "linkClick", 4, "ngIf"], [1, "separate_dash"], ["class", "flex-col", "py-6", "", 4, "ngIf"], [1, "flex50", 2, "align-items", "center", "justify-content", "center"], [2, "display", "block", "text-align", "center"], [1, "flex50", 2, "align-items", "center", "display", "block", "margin-top", "34px", "text-align", "center"], ["py-6", "", 1, "flex-col"], [3, "percent", "radius", "showTitle", "title", "subtitle", "showUnits", "showSubtitle", "titleFontSize", "subtitleFontSize", "showBackground", "showInnerStroke", "clockwise", "responsive", "startFromZero", "showZeroOuterStroke", "backgroundGradient", "backgroundOpacity", "outerStrokeColor", "outerStrokeGradientStopColor", "innerStrokeColor", "titleColor", "subtitleColor", "titleFontWeight", "subtitleFontWeight", "innerStrokeWidth", "outerStrokeWidth", "space", "outerStrokeLinecap", "animationDuration", "animateTitle"], [1, "flex-col1"], [1, "blue-box"], ["ml-0-6", "", "caption3-regular", "", 3, "title"], [1, "gray-box"], ["pb-3", "", 2, "display", "flex", "justify-content", "space-between", "align-items", "center"], ["h2-bold", "", 3, "title"], ["class", "custom--link", "style", "color:var(--pure-color-primary-60); font-size: 16px;cursor: pointer;", 3, "title", "click", 4, "ngIf"], ["class", "overview__pv-wifi-card overviewscroll", 4, "ngIf"], [1, "custom--link", 2, "color", "var(--pure-color-primary-60)", "font-size", "16px", "cursor", "pointer", 3, "click", "title"], [1, "overview__pv-wifi-card", "overviewscroll"], [1, "flex100", "flex-flow-wrapped", "grid-gap-10"], ["class", "cursor-pointer", 3, "pos", "title", "wifiTitle", "edit", 4, "ngIf"], ["class", "cursor-pointer", 3, "pos", "ngClass", "title", "wifiTitle", "edit", 4, "ngIf"], [1, "cursor-pointer", 3, "edit", "pos", "title", "wifiTitle"], [1, "cursor-pointer", 3, "edit", "pos", "ngClass", "title", "wifiTitle"], [1, "flex100", "flex-column", 3, "params"], ["pr-2", "", "pt-4", "", "pb-4", "", "class", "overview__lan-interface overviewscroll", 4, "ngIf"], ["pr-2", "", "pt-4", "", "pb-4", "", 1, "overview__lan-interface", "overviewscroll"], ["isTitleBody1Bold", "true", 3, "iconStart", "title", "subtext", "lightBlueLabel", "whiteLabel"], ["class", "flex100 flex-column", "pb-4", "", 4, "ngIf"], ["pb-4", "", 1, "flex100", "flex-column"], [1, "overview__radio-access", "overviewscroll"], [3, "click", "title", "isDisabled", "ngStyle"], ["isTitleBody1Bold", "true", 3, "iconEnd", "customTemplate", "customTemplateData"], ["pr-2", "", "pt-5", "", "pb-4", "", 1, "overview__lan-interface", "overviewscroll"], ["class", "simple-list18", 3, "iconEnd", "captionBold1", "value", 4, "ngIf"], ["pt-3", "", "isTitleBody1Bold", "true", 1, "simple-list18", 3, "iconEnd", "customTemplate", "customTemplateData"], ["class", "simple-list18", 3, "caption", "value", 4, "ngIf"], [1, "simple-list18", 3, "iconEnd", "captionBold1", "value"], [1, "simple-list18", 3, "caption", "value"], [3, "navigateBack"], ["mr-3", "", 1, "profile-avatar-wrapper"], ["mb-2", "", 1, "flex-row", "flex-row__base-line"], ["subtext-large", "", "pr-1", "", 3, "title"], ["subhead-regular", "", 3, "title"], [1, "flex-row", "flex-row__start-center"], ["pr-1", "", 3, "name"], ["button-small", "", 3, "title"], [1, "flex-row", "flex-row__base-line"], ["body1-bold", "", 3, "title"], [1, "flex-row", "flex-row__start-center", 2, "margin-top", "-10px"], ["ml-minus-4", "", "mr-minus-3", "", 3, "name"], [3, "closeDialog", "dialogConfig"], ["pvModelContent", ""], [3, "ngSubmit", "formGroup"], ["formControlName", "name", 3, "onModelChange", "disabled", "title", "data", "isValidated", "errorMessage"], ["pt-1", "", "class", "error-message", 3, "title", 4, "ngIf"], ["mt-4", "", 3, "click", "isDisabled", "title"], ["pt-1", "", 1
                            , "error-message", 3, "title"], ["formControlName", "password", "showEyeIcon", "true", 1, "ltrWithMatchParent", 3, "onModelChange", "onPasswordToggle", "disabled", "data", "isValidated", "errorMessage", "type", "showPassword", "title"], ["pt-1", "", "body1-regular", "", "class", "error-message", 3, "title", 4, "ngIf"], ["pt-1", "", "body1-regular", "", 1, "error-message", 3, "title"], ["ml-0-6", "", "subtext3-regular", "", 3, "title"], ["h1-regular", "", "mt-0-6", "", 3, "title"], ["my-2", "", 1, "gray-line"], [3, "title"], ["pt-4", "", 1, "flex-row", "flex-row__end-center"], ["bgColor", "neutral2", "size", "small", "mr-2", "", 3, "click", "title"], ["size", "small", 3, "click", "title"], [3, "formGroup"], ["pb-7", "", 3, "hasBorder"], ["formControlName", "serialNumber1", 3, "onModelChange", "isValidated", "data", "errorMessage", "title", "isAutoFocus"], ["type", "submit", 3, "click", "isDisabled", "title"]],
                        template: function (s, n) {
                            1 & s && e.DNE(0, De, 13, 9, "ng-container", 9)(1, Pe, 1, 1, "ng-template", null, 0, e.C5r)(3, Xe, 1, 1, "ng-template", null, 1, e.C5r)(5, Ze, 1, 1, "ng-template", null, 2, e.C5r)(7, _t, 1, 1, "ng-template", null, 3, e.C5r)(9, wt, 1, 1, "ng-template", null, 4, e.C5r)(11, bt, 1, 1, "ng-template", null, 5, e.C5r)(13, yt, 16, 24, "ng-template", null, 6, e.C5r)(15, Pt, 2, 0, "div", 9)(16, Ft, 7, 4, "ng-template", null, 7, e.C5r)(18, Mt, 6, 3, "ng-template", null, 8, e.C5r)(20, Yt, 8, 11, "pv-dialog", 10)(21, jt, 7, 4, "pv-dialog", 10)(22, zt, 4, 3, "pv-dialog", 10), 2 & s && (e.Y8G("ngIf", !n.showDetails), e.R7$(15), e.Y8G("ngIf", n.showDetails), e.R7$(5), e.Y8G("ngIf", n.openWifiNetworkModal), e.R7$(), e.Y8G("ngIf", n.openWanIPDialog), e.R7$(), e.Y8G("ngIf", n.addNewWifiPointModalShow))
                        },
                        dependencies: [m.YU, m.Sq, m.bT, m.T3, m.B3, d.qT, d.BC, d.cb, v.Ns, v.xJ, v.Sp, v.XL, v.v9, v.oN, v.yZ, v.X, v.Qj, v.H9, d.j4, d.JD, Z.q, ee.X, O.VE, ae],
                        styles: ['.overview .service_overview_wrapper{display:flex;justify-content:space-around;padding:40px 0;text-align:center}.overview .service_overview_wrapper .service_overview_content{width:116px;min-height:135px}.overview .service_overview_wrapper .service_overview_content pv-text{word-break:break-all}.overview .service_overview_wrapper .service_overview_content pv-text[subhead-semibold]{font-size:14px;line-height:21px;color:var(--pure-color-gray-900);font-weight:600}.overview .service_overview_wrapper .service_overview_content pv-text[subtext1-regular]{font-size:12px;line-height:18px;color:var(--pure-color-gray-800)}.overview .service_overview_wrapper .service_overview_content .service_overview_image_holder{position:relative}.overview .service_overview_wrapper .service_overview_content .service_overview_image_holder .service_overview_initial{position:absolute;inset:0;margin:auto;height:25px;font-size:20px;color:var(--pure-color-primary-60);text-align:center;line-height:25px}.overview .service_overview_wrapper .service_overview_content .service_overview_image_holder .signal_icon{position:absolute;right:18px;top:2px}.overview .service_overview_wrapper .service_overview_content .service_overview_image_holder .signal_icon.offline svg rect{fill:var(--pure-color-red-500)}.overview .flex-container{display:flex;place-content:stretch space-between}.overview .flex-items{width:calc(50% - 8px);border-radius:16px;background-color:var(--pure-color-primary-5);text-align:center;overflow:hidden}.overview__network-map{max-height:640px;width:100%;display:flex;justify-content:center;align-items:center}.overview__vertically-center{flex:1 1 100%;display:flex;align-items:center}.overview .small-card{width:80%;border-radius:16px;background-color:var(--pure-color-white);align-self:center}.overview .multi-line{-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;text-overflow:ellipsis}.overview .flex100.double-size{min-width:690px;min-height:342px;justify-content:space-between}.overview .flex100.full-height{min-height:342px}.overview pv-list:last-child{margin:0}.overview__comp{height:342px}.overview__comp pv-card{height:100%}.overview__comp pv-internet-speed-card pv-card{height:100%}.overview__pv-wifi-card{overflow:auto;height:265px}.overview__pv-wifi-card pv-wifi-card{width:100%}.overview__lan-interface{overflow:auto;height:245px}.overview__wan-ip-box{border:1px solid var(--pure-color-gray-300);border-radius:16px}.overview__family-profile-icon{position:relative}.overview__family-profile-icon-signal{position:absolute;bottom:-25px;right:-23px}.overview__radio-access{overflow:auto;height:237px}.overview__radio-access [py-3].list{padding-top:var(--pure-spacing-21);padding-bottom:var(--pure-spacing-21);padding-right:var(--pure-spacing-0-10);padding-left:var(--pure-spacing-0-10)}.overview__radio-access .profile-avatar-wrapper pv-vector{min-width:var(--pure-dimension-3);min-height:var(--pure-dimension-3)}.overview__radio-access .profile-avatar-wrapper.online{color:var(--pure-color-primary-60)}.overview__radio-access .profile-avatar-wrapper.offline{color:var(--pure-color-primary-90)}.overview__radio-access .profile-avatar-wrapper [button-small]{color:var(--pure-color-gray-900);font-weight:var(--font-weight-regular)}.overview__radio-access .profile-avatar-wrapper [subhead-regular]{line-height:27px!important;font-weight:var(--font-weight-regular)}.overview__radio-access .profile-avatar-wrapper [subtext-large]{font-weight:var(--font-weight-regular)}.overview pv-card pv-list .list{padding:12px 0}.overview pv-card pv-list:last-child .list{padding-bottom:0}.overview pv-card pv-list:after{width:100%}.height-auto{height:100%}.overviewscroll::-webkit-scrollbar{width:4px;height:4px}.overviewscroll::-webkit-scrollbar-track{background:transparent}.overviewscroll::-webkit-scrollbar-thumb{background:var(--pure-color-gray-400);border-radius:2px}.blue-box{box-sizing:border-box;width:8px;height:8px;background:var(--pure-color-primary-60);border:1px solid var(--pure-color-primary-60);border-radius:2px}.gray-box{box-sizing:border-box;width:8px;height:8px;background:var(--pure-color-neutral-40);border:1px solid var(--pure-color-neutral-40);border-radius:2px}.gray-line{width:100%;height:1px;background:var(--pure-color-gray-400)}.flex-col{display:flex;align-items:center;justify-content:space-around}.flex-col1{display:flex;align-items:center}.separate_dash{content:"";border-bottom:1px solid var(--pure-color-neutral-30);width:100%;display:flex;margin:auto}.network-card-small [p-7]{padding:var(--pure-spacing-6)}.wan-icons svg rect{fill:var(--pure-color-red-500)}.mapClickArea{cursor:pointer}.hide-wifipoint [type=link]{display:none}.flex33-gap24{display:flex;max-width:calc(33.33% - 16px);flex:1 1 100%}\n'],
                        encapsulation: 2
                    })
                }

                return i
            })()
        }];
        let qt = (() => {
            class i {
                static #e = this.\u0275fac = function (s) {
                    return new (s || i)
                };
                static #t = this.\u0275mod = e.$C({type: i});
                static #i = this.\u0275inj = e.G2t({imports: [C.iI.forChild(Jt), C.iI]})
            }

            return i
        })();
        var Qt = h(2866);
        let Zt = (() => {
            class i {
                static #e = this.\u0275fac = function (s) {
                    return new (s || i)
                };
                static #t = this.\u0275mod = e.$C({type: i});
                static #i = this.\u0275inj = e.G2t({
                    imports: [Qt.G, qt, O.rz.forRoot({
                        percent: 85,
                        radius: 40,
                        showTitle: !0,
                        showUnits: !1,
                        showSubtitle: !0,
                        showBackground: !1,
                        showInnerStroke: !0,
                        title: "UI",
                        subtitle: "Total",
                        clockwise: !1,
                        responsive: !1,
                        startFromZero: !1,
                        showZeroOuterStroke: !0,
                        backgroundGradient: !1,
                        backgroundOpacity: .7,
                        outerStrokeColor: "#4882c2",
                        outerStrokeGradientStopColor: "#53a9ff",
                        innerStrokeColor: " #c9c9c9",
                        outerStrokeWidth: 10,
                        space: -10,
                        outerStrokeLinecap: "round",
                        animationDuration: 1e3,
                        animateTitle: !0
                    }), oe.forRoot()]
                })
            }

            return i
        })()
    }
}]);