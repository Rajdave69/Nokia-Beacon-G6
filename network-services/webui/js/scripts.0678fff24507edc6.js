"use strict";
var sjcl = {
    cipher: {}, hash: {}, keyexchange: {}, mode: {}, misc: {}, codec: {}, exception: {
        corrupt: function (e) {
            this.toString = function () {
                return "CORRUPT: " + this.message
            }, this.message = e
        }, invalid: function (e) {
            this.toString = function () {
                return "INVALID: " + this.message
            }, this.message = e
        }, bug: function (e) {
            this.toString = function () {
                return "BUG: " + this.message
            }, this.message = e
        }, notReady: function (e) {
            this.toString = function () {
                return "NOT READY: " + this.message
            }, this.message = e
        }
    }
};

function t(e, r, a) {
    if (4 !== r.length) throw new sjcl.exception.invalid("invalid aes block size");
    var s = e.b[a], h = r[0] ^ s[0], n = r[a ? 3 : 1] ^ s[1], m = r[2] ^ s[2];
    r = r[a ? 1 : 3] ^ s[3];
    var T, R, k, W, U = s.length / 4 - 2, S = 4, L = [0, 0, 0, 0];
    e = (T = e.l[a])[0];
    var M = T[1], v = T[2], g = T[3], x = T[4];
    for (W = 0; W < U; W++) T = e[h >>> 24] ^ M[n >> 16 & 255] ^ v[m >> 8 & 255] ^ g[255 & r] ^ s[S], R = e[n >>> 24] ^ M[m >> 16 & 255] ^ v[r >> 8 & 255] ^ g[255 & h] ^ s[S + 1], k = e[m >>> 24] ^ M[r >> 16 & 255] ^ v[h >> 8 & 255] ^ g[255 & n] ^ s[S + 2], r = e[r >>> 24] ^ M[h >> 16 & 255] ^ v[n >> 8 & 255] ^ g[255 & m] ^ s[S + 3], S += 4, h = T, n = R, m = k;
    for (W = 0; 4 > W; W++) L[a ? 3 & -W : W] = x[h >>> 24] << 24 ^ x[n >> 16 & 255] << 16 ^ x[m >> 8 & 255] << 8 ^ x[255 & r] ^ s[S++], T = h, h = n, n = m, m = r, r = T;
    return L
}

function u(e, r) {
    var a, s, h, n = e.u, m = e.b, T = n[0], R = n[1], k = n[2], U = n[3], W = n[4], S = n[5], L = n[6], M = n[7];
    for (a = 0; 64 > a; a++) s = (s = 16 > a ? r[a] : r[15 & a] = ((s = r[a + 1 & 15]) >>> 7 ^ s >>> 18 ^ s >>> 3 ^ s << 25 ^ s << 14) + ((h = r[a + 14 & 15]) >>> 17 ^ h >>> 19 ^ h >>> 10 ^ h << 15 ^ h << 13) + r[15 & a] + r[a + 9 & 15] | 0) + M + (W >>> 6 ^ W >>> 11 ^ W >>> 25 ^ W << 26 ^ W << 21 ^ W << 7) + (L ^ W & (S ^ L)) + m[a], M = L, L = S, S = W, W = U + s | 0, U = k, k = R, T = s + ((R = T) & k ^ U & (R ^ k)) + (R >>> 2 ^ R >>> 13 ^ R >>> 22 ^ R << 30 ^ R << 19 ^ R << 10) | 0;
    n[0] = n[0] + T | 0, n[1] = n[1] + R | 0, n[2] = n[2] + k | 0, n[3] = n[3] + U | 0, n[4] = n[4] + W | 0, n[5] = n[5] + S | 0, n[6] = n[6] + L | 0, n[7] = n[7] + M | 0
}

function A(e, r) {
    var a, s = sjcl.random.B[e], h = [];
    for (a in s) s.hasOwnProperty(a) && h.push(s[a]);
    for (a = 0; a < h.length; a++) h[a](r)
}

function C(e, r) {
    typeof window < "u" && window.performance && "function" == typeof window.performance.now ? e.addEntropy(window.performance.now(), r, "loadtime") : e.addEntropy((new Date).valueOf(), r, "loadtime")
}

function y(e) {
    e.b = z(e).concat(z(e)), e.C = new sjcl.cipher.aes(e.b)
}

function z(e) {
    for (var r = 0; 4 > r && (e.g[r] = e.g[r] + 1 | 0, !e.g[r]); r++) ;
    return e.C.encrypt(e.g)
}

function B(e, r) {
    return function () {
        r.apply(e, arguments)
    }
}

sjcl.cipher.aes = function (e) {
    this.l[0][0][0] || this.G();
    var r, a, s, h, n = this.l[0][4], m = this.l[1], T = 1;
    if (4 !== (r = e.length) && 6 !== r && 8 !== r) throw new sjcl.exception.invalid("invalid aes key size");
    for (this.b = [s = e.slice(0), h = []], e = r; e < 4 * r + 28; e++) a = s[e - 1], (e % r == 0 || 8 === r && e % r == 4) && (a = n[a >>> 24] << 24 ^ n[a >> 16 & 255] << 16 ^ n[a >> 8 & 255] << 8 ^ n[255 & a], e % r == 0 && (a = a << 8 ^ a >>> 24 ^ T << 24, T = T << 1 ^ 283 * (T >> 7))), s[e] = s[e - r] ^ a;
    for (r = 0; e; r++, e--) a = s[3 & r ? e : e - 4], h[r] = 4 >= e || 4 > r ? a : m[0][n[a >>> 24]] ^ m[1][n[a >> 16 & 255]] ^ m[2][n[a >> 8 & 255]] ^ m[3][n[255 & a]]
}, sjcl.cipher.aes.prototype = {
    encrypt: function (e) {
        return t(this, e, 0)
    }, decrypt: function (e) {
        return t(this, e, 1)
    }, l: [[[], [], [], [], []], [[], [], [], [], []]], G: function () {
        var h, n, m, k, U, W, S, e = this.l[0], r = this.l[1], a = e[4], s = r[4], T = [], R = [];
        for (h = 0; 256 > h; h++) R[(T[h] = h << 1 ^ 283 * (h >> 7)) ^ h] = h;
        for (n = m = 0; !a[n]; n ^= k || 1, m = R[m] || 1) for (a[n] = W = (W = m ^ m << 1 ^ m << 2 ^ m << 3 ^ m << 4) >> 8 ^ 255 & W ^ 99, s[W] = n, S = 16843009 * (U = T[h = T[k = T[n]]]) ^ 65537 * h ^ 257 * k ^ 16843008 * n, U = 257 * T[W] ^ 16843008 * W, h = 0; 4 > h; h++) e[h][n] = U = U << 24 ^ U >>> 8, r[h][W] = S = S << 24 ^ S >>> 8;
        for (h = 0; 5 > h; h++) e[h] = e[h].slice(0), r[h] = r[h].slice(0)
    }
}, sjcl.bitArray = {
    bitSlice: function (e, r, a) {
        return e = sjcl.bitArray.N(e.slice(r / 32), 32 - (31 & r)).slice(1), void 0 === a ? e : sjcl.bitArray.clamp(e, a - r)
    }, extract: function (e, r, a) {
        var s = Math.floor(-r - a & 31);
        return (-32 & (r + a - 1 ^ r) ? e[r / 32 | 0] << 32 - s ^ e[r / 32 + 1 | 0] >>> s : e[r / 32 | 0] >>> s) & (1 << a) - 1
    }, concat: function (e, r) {
        if (0 === e.length || 0 === r.length) return e.concat(r);
        var a = e[e.length - 1], s = sjcl.bitArray.getPartial(a);
        return 32 === s ? e.concat(r) : sjcl.bitArray.N(r, s, 0 | a, e.slice(0, e.length - 1))
    }, bitLength: function (e) {
        var r = e.length;
        return 0 === r ? 0 : 32 * (r - 1) + sjcl.bitArray.getPartial(e[r - 1])
    }, clamp: function (e, r) {
        if (32 * e.length < r) return e;
        var a = (e = e.slice(0, Math.ceil(r / 32))).length;
        return r &= 31, 0 < a && r && (e[a - 1] = sjcl.bitArray.partial(r, e[a - 1] & 2147483648 >> r - 1, 1)), e
    }, partial: function (e, r, a) {
        return 32 === e ? r : (a ? 0 | r : r << 32 - e) + 1099511627776 * e
    }, getPartial: function (e) {
        return Math.round(e / 1099511627776) || 32
    }, equal: function (e, r) {
        if (sjcl.bitArray.bitLength(e) !== sjcl.bitArray.bitLength(r)) return !1;
        var s, a = 0;
        for (s = 0; s < e.length; s++) a |= e[s] ^ r[s];
        return 0 === a
    }, N: function (e, r, a, s) {
        var h;
        for (h = 0, void 0 === s && (s = []); 32 <= r; r -= 32) s.push(a), a = 0;
        if (0 === r) return s.concat(e);
        for (h = 0; h < e.length; h++) s.push(a | e[h] >>> r), a = e[h] << 32 - r;
        return e = sjcl.bitArray.getPartial(h = e.length ? e[e.length - 1] : 0), s.push(sjcl.bitArray.partial(r + e & 31, 32 < r + e ? a : s.pop(), 1)), s
    }, O: function (e, r) {
        return [e[0] ^ r[0], e[1] ^ r[1], e[2] ^ r[2], e[3] ^ r[3]]
    }, byteswapM: function (e) {
        var r, a;
        for (r = 0; r < e.length; ++r) e[r] = (a = e[r]) >>> 24 | a >>> 8 & 65280 | (65280 & a) << 8 | a << 24;
        return e
    }
}, sjcl.codec.utf8String = {
    fromBits: function (e) {
        var s, h, r = "", a = sjcl.bitArray.bitLength(e);
        for (s = 0; s < a / 8; s++) !(3 & s) && (h = e[s / 4]), r += String.fromCharCode(h >>> 8 >>> 8 >>> 8), h <<= 8;
        return decodeURIComponent(escape(r))
    }, toBits: function (e) {
        e = unescape(encodeURIComponent(e));
        var a, r = [], s = 0;
        for (a = 0; a < e.length; a++) s = s << 8 | e.charCodeAt(a), !(3 & ~a) && (r.push(s), s = 0);
        return 3 & a && r.push(sjcl.bitArray.partial(8 * (3 & a), s)), r
    }
}, sjcl.codec.hex = {
    fromBits: function (e) {
        var a, r = "";
        for (a = 0; a < e.length; a++) r += (0xf00000000000 + (0 | e[a])).toString(16).substr(4);
        return r.substr(0, sjcl.bitArray.bitLength(e) / 4)
    }, toBits: function (e) {
        var r, s, a = [];
        for (s = (e = e.replace(/\s|0x/g, "")).length, e += "00000000", r = 0; r < e.length; r += 8) a.push(0 ^ parseInt(e.substr(r, 8), 16));
        return sjcl.bitArray.clamp(a, 4 * s)
    }
}, sjcl.codec.base64 = {
    J: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    fromBits: function (e, r, a) {
        var s = "", h = 0, n = sjcl.codec.base64.J, m = 0, T = sjcl.bitArray.bitLength(e);
        for (a && (n = n.substr(0, 62) + "-_"), a = 0; 6 * s.length < T;) s += n.charAt((m ^ e[a] >>> h) >>> 26), 6 > h ? (m = e[a] << 6 - h, h += 26, a++) : (m <<= 6, h -= 6);
        for (; 3 & s.length && !r;) s += "=";
        return s
    },
    toBits: function (e, r) {
        e = e.replace(/\s|=/g, "");
        var s, T, a = [], h = 0, n = sjcl.codec.base64.J, m = 0;
        for (r && (n = n.substr(0, 62) + "-_"), s = 0; s < e.length; s++) {
            if (0 > (T = n.indexOf(e.charAt(s)))) throw new sjcl.exception.invalid("this isn't base64!");
            26 < h ? (a.push(m ^ T >>> (h -= 26)), m = T << 32 - h) : m ^= T << 32 - (h += 6)
        }
        return 56 & h && a.push(sjcl.bitArray.partial(56 & h, m, 1)), a
    }
}, sjcl.codec.base64url = {
    fromBits: function (e) {
        return sjcl.codec.base64.fromBits(e, 1, 1)
    }, toBits: function (e) {
        return sjcl.codec.base64.toBits(e, 1)
    }
}, sjcl.hash.sha256 = function (e) {
    this.b[0] || this.G(), e ? (this.u = e.u.slice(0), this.o = e.o.slice(0), this.h = e.h) : this.reset()
}, sjcl.hash.sha256.hash = function (e) {
    return (new sjcl.hash.sha256).update(e).finalize()
}, sjcl.hash.sha256.prototype = {
    blockSize: 512, reset: function () {
        return this.u = this.L.slice(0), this.o = [], this.h = 0, this
    }, update: function (e) {
        "string" == typeof e && (e = sjcl.codec.utf8String.toBits(e));
        var r, a = this.o = sjcl.bitArray.concat(this.o, e);
        if (9007199254740991 < (e = this.h = (r = this.h) + sjcl.bitArray.bitLength(e))) throw new sjcl.exception.invalid("Cannot hash more than 2^53 - 1 bits");
        if (typeof Uint32Array < "u") {
            var s = new Uint32Array(a), h = 0;
            for (r = 512 + r - (512 + r & 511); r <= e; r += 512) u(this, s.subarray(16 * h, 16 * (h + 1))), h += 1;
            a.splice(0, 16 * h)
        } else for (r = 512 + r - (512 + r & 511); r <= e; r += 512) u(this, a.splice(0, 16));
        return this
    }, finalize: function () {
        var e, a, r = this.u;
        for (e = (a = sjcl.bitArray.concat(a = this.o, [sjcl.bitArray.partial(1, 1)])).length + 2; 15 & e; e++) a.push(0);
        for (a.push(Math.floor(this.h / 4294967296)), a.push(0 | this.h); a.length;) u(this, a.splice(0, 16));
        return this.reset(), r
    }, L: [], b: [], G: function () {
        function e(n) {
            return 4294967296 * (n - Math.floor(n)) | 0
        }

        for (var s, h, r = 0, a = 2; 64 > r; a++) {
            for (h = !0, s = 2; s * s <= a; s++) if (a % s == 0) {
                h = !1;
                break
            }
            h && (8 > r && (this.L[r] = e(Math.pow(a, .5))), this.b[r] = e(Math.pow(a, 1 / 3)), r++)
        }
    }
}, void 0 === sjcl.beware && (sjcl.beware = {}), sjcl.beware["CBC mode is dangerous because it doesn't protect message integrity."] = function () {
    sjcl.mode.cbc = {
        name: "cbc", encrypt: function (e, r, a, s) {
            if (s && s.length) throw new sjcl.exception.invalid("cbc can't authenticate data");
            if (128 !== sjcl.bitArray.bitLength(a)) throw new sjcl.exception.invalid("cbc iv must be 128 bits");
            var h = sjcl.bitArray, n = h.O, m = h.bitLength(r), T = 0, R = [];
            if (7 & m) throw new sjcl.exception.invalid("pkcs#5 padding only works for multiples of a byte");
            for (s = 0; T + 128 <= m; s += 4, T += 128) a = e.encrypt(n(a, r.slice(s, s + 4))), R.splice(s, 0, a[0], a[1], a[2], a[3]);
            return a = e.encrypt(n(a, h.concat(r, [m = 16843009 * (16 - (m >> 3 & 15)), m, m, m]).slice(s, s + 4))), R.splice(s, 0, a[0], a[1], a[2], a[3]), R
        }, decrypt: function (e, r, a, s) {
            if (s && s.length) throw new sjcl.exception.invalid("cbc can't authenticate data");
            if (128 !== sjcl.bitArray.bitLength(a)) throw new sjcl.exception.invalid("cbc iv must be 128 bits");
            if (127 & sjcl.bitArray.bitLength(r) || !r.length) throw new sjcl.exception.corrupt("cbc ciphertext must be a positive multiple of the block size");
            var m, h = sjcl.bitArray, n = h.O, T = [];
            for (s = 0; s < r.length; s += 4) m = r.slice(s, s + 4), a = n(a, e.decrypt(m)), T.splice(s, 0, a[0], a[1], a[2], a[3]), a = m;
            if (0 == (m = 255 & T[s - 1]) || 16 < m) throw new sjcl.exception.corrupt("pkcs#5 padding corrupt");
            if (!h.equal(h.bitSlice([a = 16843009 * m, a, a, a], 0, 8 * m), h.bitSlice(T, 32 * T.length - 8 * m, 32 * T.length))) throw new sjcl.exception.corrupt("pkcs#5 padding corrupt");
            return h.bitSlice(T, 0, 32 * T.length - 8 * m)
        }
    }
}, sjcl.prng = function (e) {
    this.c = [new sjcl.hash.sha256], this.i = [0], this.H = 0, this.v = {}, this.F = 0, this.K = {}, this.M = this.f = this.j = this.V = 0, this.b = [0, 0, 0, 0, 0, 0, 0, 0], this.g = [0, 0, 0, 0], this.C = void 0, this.D = e, this.s = !1, this.B = {
        progress: {},
        seeded: {}
    }, this.m = this.U = 0, this.w = 1, this.A = 2, this.R = 65536, this.I = [0, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024], this.S = 3e4, this.P = 80
}, sjcl.prng.prototype = {
    randomWords: function (e, r) {
        var s, h, a = [];
        if ((s = this.isReady(r)) === this.m) throw new sjcl.exception.notReady("generator isn't seeded");
        if (s & this.A) {
            s = !(s & this.w);
            var m, n = 0;
            for (this.M = (h = [])[0] = (new Date).valueOf() + this.S, m = 0; 16 > m; m++) h.push(4294967296 * Math.random() | 0);
            for (m = 0; m < this.c.length && (h = h.concat(this.c[m].finalize()), n += this.i[m], this.i[m] = 0, s || !(this.H & 1 << m)); m++) ;
            for (this.H >= 1 << this.c.length && (this.c.push(new sjcl.hash.sha256), this.i.push(0)), this.f -= n, n > this.j && (this.j = n), this.H++, this.b = sjcl.hash.sha256.hash(this.b.concat(h)), this.C = new sjcl.cipher.aes(this.b), s = 0; 4 > s && (this.g[s] = this.g[s] + 1 | 0, !this.g[s]); s++) ;
        }
        for (s = 0; s < e; s += 4) (s + 1) % this.R == 0 && y(this), h = z(this), a.push(h[0], h[1], h[2], h[3]);
        return y(this), a.slice(0, e)
    }, setDefaultParanoia: function (e, r) {
        if (0 === e && "Setting paranoia=0 will ruin your security; use it only for testing" !== r) throw new sjcl.exception.invalid("Setting paranoia=0 will ruin your security; use it only for testing");
        this.D = e
    }, addEntropy: function (e, r, a) {
        a = a || "user";
        var s, h, n = (new Date).valueOf(), m = this.v[a], T = this.isReady(), R = 0;
        switch (void 0 === (s = this.K[a]) && (s = this.K[a] = this.V++), void 0 === m && (m = this.v[a] = 0), this.v[a] = (this.v[a] + 1) % this.c.length, typeof e) {
            case"number":
                void 0 === r && (r = 1), this.c[m].update([s, this.F++, 1, r, n, 1, 0 | e]);
                break;
            case"object":
                if ("[object Uint32Array]" === (a = Object.prototype.toString.call(e))) {
                    for (h = [], a = 0; a < e.length; a++) h.push(e[a]);
                    e = h
                } else for ("[object Array]" !== a && (R = 1), a = 0; a < e.length && !R; a++) "number" != typeof e[a] && (R = 1);
                if (!R) {
                    if (void 0 === r) for (a = r = 0; a < e.length; a++) for (h = e[a]; 0 < h;) r++, h >>>= 1;
                    this.c[m].update([s, this.F++, 2, r, n, e.length].concat(e))
                }
                break;
            case"string":
                void 0 === r && (r = e.length), this.c[m].update([s, this.F++, 3, r, n, e.length]), this.c[m].update(e);
                break;
            default:
                R = 1
        }
        if (R) throw new sjcl.exception.bug("random: addEntropy only supports number, array of numbers or string");
        this.i[m] += r, this.f += r, T === this.m && (this.isReady() !== this.m && A("seeded", Math.max(this.j, this.f)), A("progress", this.getProgress()))
    }, isReady: function (e) {
        return e = this.I[void 0 !== e ? e : this.D], this.j && this.j >= e ? this.i[0] > this.P && (new Date).valueOf() > this.M ? this.A | this.w : this.w : this.f >= e ? this.A | this.m : this.m
    }, getProgress: function (e) {
        return this.j >= (e = this.I[e || this.D]) || this.f > e ? 1 : this.f / e
    }, startCollectors: function () {
        if (!this.s) {
            if (this.a = {
                loadTimeCollector: B(this, this.X),
                mouseCollector: B(this, this.Y),
                keyboardCollector: B(this, this.W),
                accelerometerCollector: B(this, this.T),
                touchCollector: B(this, this.Z)
            }, window.addEventListener) window.addEventListener("load", this.a.loadTimeCollector, !1), window.addEventListener("mousemove", this.a.mouseCollector, !1), window.addEventListener("keypress", this.a.keyboardCollector, !1), window.addEventListener("devicemotion", this.a.accelerometerCollector, !1), window.addEventListener("touchmove", this.a.touchCollector, !1); else {
                if (!document.attachEvent) throw new sjcl.exception.bug("can't attach event");
                document.attachEvent("onload", this.a.loadTimeCollector), document.attachEvent("onmousemove", this.a.mouseCollector), document.attachEvent("keypress", this.a.keyboardCollector)
            }
            this.s = !0
        }
    }, stopCollectors: function () {
        this.s && (window.removeEventListener ? (window.removeEventListener("load", this.a.loadTimeCollector, !1), window.removeEventListener("mousemove", this.a.mouseCollector, !1), window.removeEventListener("keypress", this.a.keyboardCollector, !1), window.removeEventListener("devicemotion", this.a.accelerometerCollector, !1), window.removeEventListener("touchmove", this.a.touchCollector, !1)) : document.detachEvent && (document.detachEvent("onload", this.a.loadTimeCollector), document.detachEvent("onmousemove", this.a.mouseCollector), document.detachEvent("keypress", this.a.keyboardCollector)), this.s = !1)
    }, addEventListener: function (e, r) {
        this.B[e][this.U++] = r
    }, removeEventListener: function (e, r) {
        var a, s, h = this.B[e], n = [];
        for (s in h) h.hasOwnProperty(s) && h[s] === r && n.push(s);
        for (a = 0; a < n.length; a++) delete h[s = n[a]]
    }, W: function () {
        C(this, 1)
    }, Y: function (e) {
        var r, a;
        try {
            r = e.x || e.clientX || e.offsetX || 0, a = e.y || e.clientY || e.offsetY || 0
        } catch {
            a = r = 0
        }
        0 != r && 0 != a && this.addEntropy([r, a], 2, "mouse"), C(this, 0)
    }, Z: function (e) {
        this.addEntropy([(e = e.touches[0] || e.changedTouches[0]).pageX || e.clientX, e.pageY || e.clientY], 1, "touch"), C(this, 0)
    }, X: function () {
        C(this, 2)
    }, T: function (e) {
        if (e = e.accelerationIncludingGravity.x || e.accelerationIncludingGravity.y || e.accelerationIncludingGravity.z, window.orientation) {
            var r = window.orientation;
            "number" == typeof r && this.addEntropy(r, 1, "accelerometer")
        }
        e && this.addEntropy(e, 2, "accelerometer"), C(this, 0)
    }
}, sjcl.random = new sjcl.prng(6);
e:try {
    var D, E, F, G;
    if (G = typeof module < "u" && module.exports) {
        var H;
        try {
            H = require("crypto")
        } catch {
            H = null
        }
        G = E = H
    }
    if (G && E.randomBytes) D = E.randomBytes(128), D = new Uint32Array(new Uint8Array(D).buffer), sjcl.random.addEntropy(D, 1024, "crypto['randomBytes']"); else if (typeof window < "u" && typeof Uint32Array < "u") {
        if (F = new Uint32Array(32), window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(F); else {
            if (!window.msCrypto || !window.msCrypto.getRandomValues) break e;
            window.msCrypto.getRandomValues(F)
        }
        sjcl.random.addEntropy(F, 1024, "crypto['getRandomValues']")
    }
} catch (e) {
    typeof window < "u" && window.console && (console.log("There was an error collecting entropy from the browser:"), console.log(e))
}
typeof module < "u" && module.exports && (module.exports = sjcl), "function" == typeof define && define([], function () {
    return sjcl
}), (sjcl.beware && sjcl.beware["CBC mode is dangerous because it doesn't protect message integrity."] || function () {
})();
var crypto_page = function () {
    var e = function (R) {
        for (var k = "", U = 0; U < R.length; U++) {
            var W = R.charAt(U);
            k += "+" == W ? "-" : "/" == W ? "_" : "=" == W ? "." : W
        }
        return k
    }, r = function (R, k) {
        var U = sjcl.random.randomWords(4, 0), W = sjcl.random.randomWords(4, 0), S = sjcl.codec.utf8String.toBits(k),
            L = new sjcl.cipher.aes(U), M = sjcl.mode.cbc.encrypt(L, S, W), v = new JSEncrypt;
        if (0 == v.setPublicKey(R)) return fasle;
        var g = sjcl.codec.base64url, x = sjcl.codec.base64, Q = x.fromBits(U) + " " + x.fromBits(W), t0 = v.encrypt(Q);
        return 0 != t0 && {ct: g.fromBits(M), ck: e(t0)}
    }, h = function (R, k) {
        var U = sjcl.hash.sha256.hash(R + ":" + k);
        return sjcl.codec.base64.fromBits(U)
    }, T = function (k) {
        var U;
        for (U = (k = document.getElementsByTagName(k)).length - 1; U >= 0; U--) k[U].parentNode.removeChild(k[U])
    };
    return {
        encrypt: r, encrypt_post_data: function (R, k) {
            var U = r(R, k);
            return "encrypted=1&ct=" + U.ct + "&ck=" + U.ck
        }, sha256: h, sha256url: function (R, k) {
            return e(h(R, k))
        }, base64url_escape: e, aes_decrypt: function (R) {
            var k = localStorage.getItem("sid"), U = localStorage.getItem(k);
            if (U && R.length > 0) {
                var W = U.split(" "), S = sjcl.codec.base64.toBits(W[0]), L = sjcl.codec.base64.toBits(W[1]),
                    M = sjcl.codec.base64.toBits(R), v = new sjcl.cipher.aes(S);
                try {
                    var g = sjcl.mode.cbc.decrypt(v, M, L);
                    return sjcl.codec.utf8String.fromBits(g)
                } catch {
                }
            }
            return R
        }, clearModalReference: function () {
            document.getElementsByTagName("body")[0].classList.remove("modal-open"), T("ngb-modal-backdrop"), T("ngb-modal-window")
        }
    }
}(), Module;
(function (e, r) {
    "object" == typeof exports && typeof module < "u" ? r(exports) : "function" == typeof define && define.amd ? define(["exports"], r) : r(e.JSEncrypt = {})
})(this, function (e) {
    function a(I) {
        return "0123456789abcdefghijklmnopqrstuvwxyz".charAt(I)
    }

    function s(I, d) {
        return I & d
    }

    function h(I, d) {
        return I | d
    }

    function n(I, d) {
        return I ^ d
    }

    function m(I, d) {
        return I & ~d
    }

    function T(I) {
        if (0 == I) return -1;
        var d = 0;
        return !(65535 & I) && (I >>= 16, d += 16), !(255 & I) && (I >>= 8, d += 8), !(15 & I) && (I >>= 4, d += 4), !(3 & I) && (I >>= 2, d += 2), !(1 & I) && ++d, d
    }

    function R(I) {
        for (var d = 0; 0 != I;) I &= I - 1, ++d;
        return d
    }

    var k = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    function W(I) {
        var d, b, P = "";
        for (d = 0; d + 3 <= I.length; d += 3) b = parseInt(I.substring(d, d + 3), 16), P += k.charAt(b >> 6) + k.charAt(63 & b);
        for (d + 1 == I.length ? (b = parseInt(I.substring(d, d + 1), 16), P += k.charAt(b << 2)) : d + 2 == I.length && (b = parseInt(I.substring(d, d + 2), 16), P += k.charAt(b >> 2) + k.charAt((3 & b) << 4)); (3 & P.length) > 0;) P += "=";
        return P
    }

    var S, M, L = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (I, d) {
            I.__proto__ = d
        } || function (I, d) {
            for (var b in d) d.hasOwnProperty(b) && (I[b] = d[b])
        }, g = {
            decode: function (I) {
                var d;
                if (void 0 === M) {
                    var b = "= \f\n\r\t\xa0\u2028\u2029";
                    for (M = Object.create(null), d = 0; d < 64; ++d) M["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(d)] = d;
                    for (d = 0; d < 9; ++d) M[b.charAt(d)] = -1
                }
                var P = [], V = 0, $ = 0;
                for (d = 0; d < I.length; ++d) {
                    var e0 = I.charAt(d);
                    if ("=" == e0) break;
                    if (-1 != (e0 = M[e0])) {
                        if (void 0 === e0) throw new Error("Illegal character at offset " + d);
                        V |= e0, ++$ >= 4 ? (P[P.length] = V >> 16, P[P.length] = V >> 8 & 255, P[P.length] = 255 & V, V = 0, $ = 0) : V <<= 6
                    }
                }
                switch ($) {
                    case 1:
                        throw new Error("Base64 encoding incomplete: at least 2 bits missing");
                    case 2:
                        P[P.length] = V >> 10;
                        break;
                    case 3:
                        P[P.length] = V >> 16, P[P.length] = V >> 8 & 255
                }
                return P
            },
            re: /-----BEGIN [^-]+-----([A-Za-z0-9+\/=\s]+)-----END [^-]+-----|begin-base64[^\n]+\n([A-Za-z0-9+\/=\s]+)====/,
            unarmor: function (I) {
                var d = g.re.exec(I);
                if (d) if (d[1]) I = d[1]; else {
                    if (!d[2]) throw new Error("RegExp out of sync");
                    I = d[2]
                }
                return g.decode(I)
            }
        }, x = 1e13, Q = function () {
            function I(d) {
                this.buf = [+d || 0]
            }

            return I.prototype.mulAdd = function (d, b) {
                var P, V, $ = this.buf, e0 = $.length;
                for (P = 0; P < e0; ++P) (V = $[P] * d + b) < x ? b = 0 : V -= (b = 0 | V / x) * x, $[P] = V;
                b > 0 && ($[P] = b)
            }, I.prototype.sub = function (d) {
                var b, P, V = this.buf, $ = V.length;
                for (b = 0; b < $; ++b) (P = V[b] - d) < 0 ? (P += x, d = 1) : d = 0, V[b] = P;
                for (; 0 === V[V.length - 1];) V.pop()
            }, I.prototype.toString = function (d) {
                if (10 != (d || 10)) throw new Error("only base 10 is supported");
                for (var b = this.buf, P = b[b.length - 1].toString(), V = b.length - 2; V >= 0; --V) P += (x + b[V]).toString().substring(1);
                return P
            }, I.prototype.valueOf = function () {
                for (var d = this.buf, b = 0, P = d.length - 1; P >= 0; --P) b = b * x + d[P];
                return b
            }, I.prototype.simplify = function () {
                var d = this.buf;
                return 1 == d.length ? d[0] : this
            }, I
        }(),
        s0 = /^(\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/,
        M0 = /^(\d\d\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/;

    function a0(I, d) {
        return I.length > d && (I = I.substring(0, d) + "\u2026"), I
    }

    var d0, A0 = function () {
            function I(d, b) {
                this.hexDigits = "0123456789ABCDEF", d instanceof I ? (this.enc = d.enc, this.pos = d.pos) : (this.enc = d, this.pos = b)
            }

            return I.prototype.get = function (d) {
                if (void 0 === d && (d = this.pos++), d >= this.enc.length) throw new Error("Requesting byte offset " + d + " on a stream of length " + this.enc.length);
                return "string" == typeof this.enc ? this.enc.charCodeAt(d) : this.enc[d]
            }, I.prototype.hexByte = function (d) {
                return this.hexDigits.charAt(d >> 4 & 15) + this.hexDigits.charAt(15 & d)
            }, I.prototype.hexDump = function (d, b, P) {
                for (var V = "", $ = d; $ < b; ++$) if (V += this.hexByte(this.get($)), !0 !== P) switch (15 & $) {
                    case 7:
                        V += "  ";
                        break;
                    case 15:
                        V += "\n";
                        break;
                    default:
                        V += " "
                }
                return V
            }, I.prototype.isASCII = function (d, b) {
                for (var P = d; P < b; ++P) {
                    var V = this.get(P);
                    if (V < 32 || V > 176) return !1
                }
                return !0
            }, I.prototype.parseStringISO = function (d, b) {
                for (var P = "", V = d; V < b; ++V) P += String.fromCharCode(this.get(V));
                return P
            }, I.prototype.parseStringUTF = function (d, b) {
                for (var P = "", V = d; V < b;) {
                    var $ = this.get(V++);
                    P += String.fromCharCode($ < 128 ? $ : $ > 191 && $ < 224 ? (31 & $) << 6 | 63 & this.get(V++) : (15 & $) << 12 | (63 & this.get(V++)) << 6 | 63 & this.get(V++))
                }
                return P
            }, I.prototype.parseStringBMP = function (d, b) {
                for (var P, V, $ = "", e0 = d; e0 < b;) P = this.get(e0++), V = this.get(e0++), $ += String.fromCharCode(P << 8 | V);
                return $
            }, I.prototype.parseTime = function (d, b, P) {
                var V = this.parseStringISO(d, b), $ = (P ? s0 : M0).exec(V);
                return $ ? (P && ($[1] = +$[1], $[1] += +$[1] < 70 ? 2e3 : 1900), V = $[1] + "-" + $[2] + "-" + $[3] + " " + $[4], $[5] && (V += ":" + $[5], $[6] && (V += ":" + $[6], $[7] && (V += "." + $[7]))), $[8] && (V += " UTC", "Z" != $[8] && (V += $[8], $[9] && (V += ":" + $[9]))), V) : "Unrecognized time: " + V
            }, I.prototype.parseInteger = function (d, b) {
                for (var P, V = this.get(d), $ = V > 127, e0 = $ ? 255 : 0, i0 = ""; V == e0 && ++d < b;) V = this.get(d);
                if (0 == (P = b - d)) return $ ? -1 : 0;
                if (P > 4) {
                    for (i0 = V, P <<= 3; !(128 & (+i0 ^ e0));) i0 = +i0 << 1, --P;
                    i0 = "(" + P + " bit)\n"
                }
                $ && (V -= 256);
                for (var f0 = new Q(V), P0 = d + 1; P0 < b; ++P0) f0.mulAdd(256, this.get(P0));
                return i0 + f0.toString()
            }, I.prototype.parseBitString = function (d, b, P) {
                for (var V = this.get(d), $ = "(" + ((b - d - 1 << 3) - V) + " bit)\n", e0 = "", i0 = d + 1; i0 < b; ++i0) {
                    for (var f0 = this.get(i0), P0 = i0 == b - 1 ? V : 0, j0 = 7; j0 >= P0; --j0) e0 += f0 >> j0 & 1 ? "1" : "0";
                    if (e0.length > P) return $ + a0(e0, P)
                }
                return $ + e0
            }, I.prototype.parseOctetString = function (d, b, P) {
                if (this.isASCII(d, b)) return a0(this.parseStringISO(d, b), P);
                var V = b - d, $ = "(" + V + " byte)\n";
                V > (P /= 2) && (b = d + P);
                for (var e0 = d; e0 < b; ++e0) $ += this.hexByte(this.get(e0));
                return V > P && ($ += "\u2026"), $
            }, I.prototype.parseOID = function (d, b, P) {
                for (var V = "", $ = new Q, e0 = 0, i0 = d; i0 < b; ++i0) {
                    var f0 = this.get(i0);
                    if ($.mulAdd(128, 127 & f0), e0 += 7, !(128 & f0)) {
                        if ("" === V) if (($ = $.simplify()) instanceof Q) $.sub(80), V = "2." + $.toString(); else {
                            var P0 = $ < 80 ? $ < 40 ? 0 : 1 : 2;
                            V = P0 + "." + ($ - 40 * P0)
                        } else V += "." + $.toString();
                        if (V.length > P) return a0(V, P);
                        $ = new Q, e0 = 0
                    }
                }
                return e0 > 0 && (V += ".incomplete"), V
            }, I
        }(), E0 = function () {
            function I(d, b, P, V, $) {
                if (!(V instanceof k0)) throw new Error("Invalid tag value.");
                this.stream = d, this.header = b, this.length = P, this.tag = V, this.sub = $
            }

            return I.prototype.typeName = function () {
                switch (this.tag.tagClass) {
                    case 0:
                        switch (this.tag.tagNumber) {
                            case 0:
                                return "EOC";
                            case 1:
                                return "BOOLEAN";
                            case 2:
                                return "INTEGER";
                            case 3:
                                return "BIT_STRING";
                            case 4:
                                return "OCTET_STRING";
                            case 5:
                                return "NULL";
                            case 6:
                                return "OBJECT_IDENTIFIER";
                            case 7:
                                return "ObjectDescriptor";
                            case 8:
                                return "EXTERNAL";
                            case 9:
                                return "REAL";
                            case 10:
                                return "ENUMERATED";
                            case 11:
                                return "EMBEDDED_PDV";
                            case 12:
                                return "UTF8String";
                            case 16:
                                return "SEQUENCE";
                            case 17:
                                return "SET";
                            case 18:
                                return "NumericString";
                            case 19:
                                return "PrintableString";
                            case 20:
                                return "TeletexString";
                            case 21:
                                return "VideotexString";
                            case 22:
                                return "IA5String";
                            case 23:
                                return "UTCTime";
                            case 24:
                                return "GeneralizedTime";
                            case 25:
                                return "GraphicString";
                            case 26:
                                return "VisibleString";
                            case 27:
                                return "GeneralString";
                            case 28:
                                return "UniversalString";
                            case 30:
                                return "BMPString"
                        }
                        return "Universal_" + this.tag.tagNumber.toString();
                    case 1:
                        return "Application_" + this.tag.tagNumber.toString();
                    case 2:
                        return "[" + this.tag.tagNumber.toString() + "]";
                    case 3:
                        return "Private_" + this.tag.tagNumber.toString()
                }
            }, I.prototype.content = function (d) {
                if (void 0 === this.tag) return null;
                void 0 === d && (d = 1 / 0);
                var b = this.posContent(), P = Math.abs(this.length);
                if (!this.tag.isUniversal()) return null !== this.sub ? "(" + this.sub.length + " elem)" : this.stream.parseOctetString(b, b + P, d);
                switch (this.tag.tagNumber) {
                    case 1:
                        return 0 === this.stream.get(b) ? "false" : "true";
                    case 2:
                        return this.stream.parseInteger(b, b + P);
                    case 3:
                        return this.sub ? "(" + this.sub.length + " elem)" : this.stream.parseBitString(b, b + P, d);
                    case 4:
                        return this.sub ? "(" + this.sub.length + " elem)" : this.stream.parseOctetString(b, b + P, d);
                    case 6:
                        return this.stream.parseOID(b, b + P, d);
                    case 16:
                    case 17:
                        return null !== this.sub ? "(" + this.sub.length + " elem)" : "(no elem)";
                    case 12:
                        return a0(this.stream.parseStringUTF(b, b + P), d);
                    case 18:
                    case 19:
                    case 20:
                    case 21:
                    case 22:
                    case 26:
                        return a0(this.stream.parseStringISO(b, b + P), d);
                    case 30:
                        return a0(this.stream.parseStringBMP(b, b + P), d);
                    case 23:
                    case 24:
                        return this.stream.parseTime(b, b + P, 23 == this.tag.tagNumber)
                }
                return null
            }, I.prototype.toString = function () {
                return this.typeName() + "@" + this.stream.pos + "[header:" + this.header + ",length:" + this.length + ",sub:" + (null === this.sub ? "null" : this.sub.length) + "]"
            }, I.prototype.toPrettyString = function (d) {
                void 0 === d && (d = "");
                var b = d + this.typeName() + " @" + this.stream.pos;
                if (this.length >= 0 && (b += "+"), b += this.length, this.tag.tagConstructed ? b += " (constructed)" : !this.tag.isUniversal() || 3 != this.tag.tagNumber && 4 != this.tag.tagNumber || null === this.sub || (b += " (encapsulates)"), b += "\n", null !== this.sub) {
                    d += "  ";
                    for (var P = 0, V = this.sub.length; P < V; ++P) b += this.sub[P].toPrettyString(d)
                }
                return b
            }, I.prototype.posStart = function () {
                return this.stream.pos
            }, I.prototype.posContent = function () {
                return this.stream.pos + this.header
            }, I.prototype.posEnd = function () {
                return this.stream.pos + this.header + Math.abs(this.length)
            }, I.prototype.toHexString = function () {
                return this.stream.hexDump(this.posStart(), this.posEnd(), !0)
            }, I.decodeLength = function (d) {
                var b = d.get(), P = 127 & b;
                if (P == b) return P;
                if (P > 6) throw new Error("Length over 48 bits not supported at position " + (d.pos - 1));
                if (0 === P) return null;
                b = 0;
                for (var V = 0; V < P; ++V) b = 256 * b + d.get();
                return b
            }, I.prototype.getHexStringValue = function () {
                return this.toHexString().substr(2 * this.header, 2 * this.length)
            }, I.decode = function (d) {
                var b;
                b = d instanceof A0 ? d : new A0(d, 0);
                var P = new A0(b), V = new k0(b), $ = I.decodeLength(b), e0 = b.pos, i0 = e0 - P.pos, f0 = null,
                    P0 = function () {
                        var a1 = [];
                        if (null !== $) {
                            for (var f1 = e0 + $; b.pos < f1;) a1[a1.length] = I.decode(b);
                            if (b.pos != f1) throw new Error("Content size is not correct for container starting at offset " + e0)
                        } else try {
                            for (; ;) {
                                var s1 = I.decode(b);
                                if (s1.tag.isEOC()) break;
                                a1[a1.length] = s1
                            }
                            $ = e0 - b.pos
                        } catch (N1) {
                            throw new Error("Exception while decoding undefined length content: " + N1)
                        }
                        return a1
                    };
                if (V.tagConstructed) f0 = P0(); else if (V.isUniversal() && (3 == V.tagNumber || 4 == V.tagNumber)) try {
                    if (3 == V.tagNumber && 0 != b.get()) throw new Error("BIT STRINGs with unused bits cannot encapsulate.");
                    f0 = P0();
                    for (var j0 = 0; j0 < f0.length; ++j0) if (f0[j0].tag.isEOC()) throw new Error("EOC is not supposed to be actual content.")
                } catch {
                    f0 = null
                }
                if (null === f0) {
                    if (null === $) throw new Error("We can't skip over an invalid tag with undefined length at offset " + e0);
                    b.pos = e0 + Math.abs($)
                }
                return new I(P, i0, $, V, f0)
            }, I
        }(), k0 = function () {
            function I(d) {
                var b = d.get();
                if (this.tagClass = b >> 6, this.tagConstructed = !!(32 & b), this.tagNumber = 31 & b, 31 == this.tagNumber) {
                    for (var P = new Q; b = d.get(), P.mulAdd(128, 127 & b), 128 & b;) ;
                    this.tagNumber = P.simplify()
                }
            }

            return I.prototype.isUniversal = function () {
                return 0 === this.tagClass
            }, I.prototype.isEOC = function () {
                return 0 === this.tagClass && 0 === this.tagNumber
            }, I
        }(),
        b0 = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997],
        q0 = (1 << 26) / b0[b0.length - 1], N0 = function () {
            function I(d, b, P) {
                null != d && ("number" == typeof d ? this.fromNumber(d, b, P) : this.fromString(d, null == b && "string" != typeof d ? 256 : b))
            }

            return I.prototype.toString = function (d) {
                if (this.s < 0) return "-" + this.negate().toString(d);
                var b;
                if (16 == d) b = 4; else if (8 == d) b = 3; else if (2 == d) b = 1; else if (32 == d) b = 5; else {
                    if (4 != d) return this.toRadix(d);
                    b = 2
                }
                var P, V = (1 << b) - 1, $ = !1, e0 = "", i0 = this.t, f0 = this.DB - i0 * this.DB % b;
                if (i0-- > 0) for (f0 < this.DB && (P = this[i0] >> f0) > 0 && ($ = !0, e0 = a(P)); i0 >= 0;) f0 < b ? (P = (this[i0] & (1 << f0) - 1) << b - f0, P |= this[--i0] >> (f0 += this.DB - b)) : (P = this[i0] >> (f0 -= b) & V, f0 <= 0 && (f0 += this.DB, --i0)), P > 0 && ($ = !0), $ && (e0 += a(P));
                return $ ? e0 : "0"
            }, I.prototype.negate = function () {
                var d = c0();
                return I.ZERO.subTo(this, d), d
            }, I.prototype.abs = function () {
                return this.s < 0 ? this.negate() : this
            }, I.prototype.compareTo = function (d) {
                var b = this.s - d.s;
                if (0 != b) return b;
                var P = this.t;
                if (0 != (b = P - d.t)) return this.s < 0 ? -b : b;
                for (; --P >= 0;) if (0 != (b = this[P] - d[P])) return b;
                return 0
            }, I.prototype.bitLength = function () {
                return this.t <= 0 ? 0 : this.DB * (this.t - 1) + H0(this[this.t - 1] ^ this.s & this.DM)
            }, I.prototype.mod = function (d) {
                var b = c0();
                return this.abs().divRemTo(d, null, b), this.s < 0 && b.compareTo(I.ZERO) > 0 && d.subTo(b, b), b
            }, I.prototype.modPowInt = function (d, b) {
                var P;
                return P = d < 256 || b.isEven() ? new C0(b) : new J0(b), this.exp(d, P)
            }, I.prototype.clone = function () {
                var d = c0();
                return this.copyTo(d), d
            }, I.prototype.intValue = function () {
                if (this.s < 0) {
                    if (1 == this.t) return this[0] - this.DV;
                    if (0 == this.t) return -1
                } else {
                    if (1 == this.t) return this[0];
                    if (0 == this.t) return 0
                }
                return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0]
            }, I.prototype.byteValue = function () {
                return 0 == this.t ? this.s : this[0] << 24 >> 24
            }, I.prototype.shortValue = function () {
                return 0 == this.t ? this.s : this[0] << 16 >> 16
            }, I.prototype.signum = function () {
                return this.s < 0 ? -1 : this.t <= 0 || 1 == this.t && this[0] <= 0 ? 0 : 1
            }, I.prototype.toByteArray = function () {
                var d = this.t, b = [];
                b[0] = this.s;
                var P, V = this.DB - d * this.DB % 8, $ = 0;
                if (d-- > 0) for (V < this.DB && (P = this[d] >> V) != (this.s & this.DM) >> V && (b[$++] = P | this.s << this.DB - V); d >= 0;) V < 8 ? (P = (this[d] & (1 << V) - 1) << 8 - V, P |= this[--d] >> (V += this.DB - 8)) : (P = this[d] >> (V -= 8) & 255, V <= 0 && (V += this.DB, --d)), 128 & P && (P |= -256), 0 == $ && (128 & this.s) != (128 & P) && ++$, ($ > 0 || P != this.s) && (b[$++] = P);
                return b
            }, I.prototype.equals = function (d) {
                return 0 == this.compareTo(d)
            }, I.prototype.min = function (d) {
                return this.compareTo(d) < 0 ? this : d
            }, I.prototype.max = function (d) {
                return this.compareTo(d) > 0 ? this : d
            }, I.prototype.and = function (d) {
                var b = c0();
                return this.bitwiseTo(d, s, b), b
            }, I.prototype.or = function (d) {
                var b = c0();
                return this.bitwiseTo(d, h, b), b
            }, I.prototype.xor = function (d) {
                var b = c0();
                return this.bitwiseTo(d, n, b), b
            }, I.prototype.andNot = function (d) {
                var b = c0();
                return this.bitwiseTo(d, m, b), b
            }, I.prototype.not = function () {
                for (var d = c0(), b = 0; b < this.t; ++b) d[b] = this.DM & ~this[b];
                return d.t = this.t, d.s = ~this.s, d
            }, I.prototype.shiftLeft = function (d) {
                var b = c0();
                return d < 0 ? this.rShiftTo(-d, b) : this.lShiftTo(d, b), b
            }, I.prototype.shiftRight = function (d) {
                var b = c0();
                return d < 0 ? this.lShiftTo(-d, b) : this.rShiftTo(d, b), b
            }, I.prototype.getLowestSetBit = function () {
                for (var d = 0; d < this.t; ++d) if (0 != this[d]) return d * this.DB + T(this[d]);
                return this.s < 0 ? this.t * this.DB : -1
            }, I.prototype.bitCount = function () {
                for (var d = 0, b = this.s & this.DM, P = 0; P < this.t; ++P) d += R(this[P] ^ b);
                return d
            }, I.prototype.testBit = function (d) {
                var b = Math.floor(d / this.DB);
                return b >= this.t ? 0 != this.s : !!(this[b] & 1 << d % this.DB)
            }, I.prototype.setBit = function (d) {
                return this.changeBit(d, h)
            }, I.prototype.clearBit = function (d) {
                return this.changeBit(d, m)
            }, I.prototype.flipBit = function (d) {
                return this.changeBit(d, n)
            }, I.prototype.add = function (d) {
                var b = c0();
                return this.addTo(d, b), b
            }, I.prototype.subtract = function (d) {
                var b = c0();
                return this.subTo(d, b), b
            }, I.prototype.multiply = function (d) {
                var b = c0();
                return this.multiplyTo(d, b), b
            }, I.prototype.divide = function (d) {
                var b = c0();
                return this.divRemTo(d, b, null), b
            }, I.prototype.remainder = function (d) {
                var b = c0();
                return this.divRemTo(d, null, b), b
            }, I.prototype.divideAndRemainder = function (d) {
                var b = c0(), P = c0();
                return this.divRemTo(d, b, P), [b, P]
            }, I.prototype.modPow = function (d, b) {
                var P, V, $ = d.bitLength(), e0 = _0(1);
                if ($ <= 0) return e0;
                P = $ < 18 ? 1 : $ < 48 ? 3 : $ < 144 ? 4 : $ < 768 ? 5 : 6, V = $ < 8 ? new C0(b) : b.isEven() ? new y0(b) : new J0(b);
                var i0 = [], f0 = 3, P0 = P - 1, j0 = (1 << P) - 1;
                if (i0[1] = V.convert(this), P > 1) {
                    var a1 = c0();
                    for (V.sqrTo(i0[1], a1); f0 <= j0;) i0[f0] = c0(), V.mulTo(a1, i0[f0 - 2], i0[f0]), f0 += 2
                }
                var f1, s1, N1 = d.t - 1, g1 = !0, y1 = c0();
                for ($ = H0(d[N1]) - 1; N1 >= 0;) {
                    for ($ >= P0 ? f1 = d[N1] >> $ - P0 & j0 : (f1 = (d[N1] & (1 << $ + 1) - 1) << P0 - $, N1 > 0 && (f1 |= d[N1 - 1] >> this.DB + $ - P0)), f0 = P; !(1 & f1);) f1 >>= 1, --f0;
                    if (($ -= f0) < 0 && ($ += this.DB, --N1), g1) i0[f1].copyTo(e0), g1 = !1; else {
                        for (; f0 > 1;) V.sqrTo(e0, y1), V.sqrTo(y1, e0), f0 -= 2;
                        f0 > 0 ? V.sqrTo(e0, y1) : (s1 = e0, e0 = y1, y1 = s1), V.mulTo(y1, i0[f1], e0)
                    }
                    for (; N1 >= 0 && !(d[N1] & 1 << $);) V.sqrTo(e0, y1), s1 = e0, e0 = y1, y1 = s1, --$ < 0 && ($ = this.DB - 1, --N1)
                }
                return V.revert(e0)
            }, I.prototype.modInverse = function (d) {
                var b = d.isEven();
                if (this.isEven() && b || 0 == d.signum()) return I.ZERO;
                for (var P = d.clone(), V = this.clone(), $ = _0(1), e0 = _0(0), i0 = _0(0), f0 = _0(1); 0 != P.signum();) {
                    for (; P.isEven();) P.rShiftTo(1, P), b ? ($.isEven() && e0.isEven() || ($.addTo(this, $), e0.subTo(d, e0)), $.rShiftTo(1, $)) : e0.isEven() || e0.subTo(d, e0), e0.rShiftTo(1, e0);
                    for (; V.isEven();) V.rShiftTo(1, V), b ? (i0.isEven() && f0.isEven() || (i0.addTo(this, i0), f0.subTo(d, f0)), i0.rShiftTo(1, i0)) : f0.isEven() || f0.subTo(d, f0), f0.rShiftTo(1, f0);
                    P.compareTo(V) >= 0 ? (P.subTo(V, P), b && $.subTo(i0, $), e0.subTo(f0, e0)) : (V.subTo(P, V), b && i0.subTo($, i0), f0.subTo(e0, f0))
                }
                return 0 != V.compareTo(I.ONE) ? I.ZERO : f0.compareTo(d) >= 0 ? f0.subtract(d) : f0.signum() < 0 ? (f0.addTo(d, f0), f0.signum() < 0 ? f0.add(d) : f0) : f0
            }, I.prototype.pow = function (d) {
                return this.exp(d, new v0)
            }, I.prototype.gcd = function (d) {
                var b = this.s < 0 ? this.negate() : this.clone(), P = d.s < 0 ? d.negate() : d.clone();
                if (b.compareTo(P) < 0) {
                    var V = b;
                    b = P, P = V
                }
                var $ = b.getLowestSetBit(), e0 = P.getLowestSetBit();
                if (e0 < 0) return b;
                for ($ < e0 && (e0 = $), e0 > 0 && (b.rShiftTo(e0, b), P.rShiftTo(e0, P)); b.signum() > 0;) ($ = b.getLowestSetBit()) > 0 && b.rShiftTo($, b), ($ = P.getLowestSetBit()) > 0 && P.rShiftTo($, P), b.compareTo(P) >= 0 ? (b.subTo(P, b), b.rShiftTo(1, b)) : (P.subTo(b, P), P.rShiftTo(1, P));
                return e0 > 0 && P.lShiftTo(e0, P), P
            }, I.prototype.isProbablePrime = function (d) {
                var b, P = this.abs();
                if (1 == P.t && P[0] <= b0[b0.length - 1]) {
                    for (b = 0; b < b0.length; ++b) if (P[0] == b0[b]) return !0;
                    return !1
                }
                if (P.isEven()) return !1;
                for (b = 1; b < b0.length;) {
                    for (var V = b0[b], $ = b + 1; $ < b0.length && V < q0;) V *= b0[$++];
                    for (V = P.modInt(V); b < $;) if (V % b0[b++] == 0) return !1
                }
                return P.millerRabin(d)
            }, I.prototype.copyTo = function (d) {
                for (var b = this.t - 1; b >= 0; --b) d[b] = this[b];
                d.t = this.t, d.s = this.s
            }, I.prototype.fromInt = function (d) {
                this.t = 1, this.s = d < 0 ? -1 : 0, d > 0 ? this[0] = d : d < -1 ? this[0] = d + this.DV : this.t = 0
            }, I.prototype.fromString = function (d, b) {
                var P;
                if (16 == b) P = 4; else if (8 == b) P = 3; else if (256 == b) P = 8; else if (2 == b) P = 1; else if (32 == b) P = 5; else {
                    if (4 != b) return void this.fromRadix(d, b);
                    P = 2
                }
                this.t = 0, this.s = 0;
                for (var V = d.length, $ = !1, e0 = 0; --V >= 0;) {
                    var i0 = 8 == P ? 255 & +d[V] : p0(d, V);
                    i0 < 0 ? "-" == d.charAt(V) && ($ = !0) : ($ = !1, 0 == e0 ? this[this.t++] = i0 : e0 + P > this.DB ? (this[this.t - 1] |= (i0 & (1 << this.DB - e0) - 1) << e0, this[this.t++] = i0 >> this.DB - e0) : this[this.t - 1] |= i0 << e0, (e0 += P) >= this.DB && (e0 -= this.DB))
                }
                8 == P && 128 & +d[0] && (this.s = -1, e0 > 0 && (this[this.t - 1] |= (1 << this.DB - e0) - 1 << e0)), this.clamp(), $ && I.ZERO.subTo(this, this)
            }, I.prototype.clamp = function () {
                for (var d = this.s & this.DM; this.t > 0 && this[this.t - 1] == d;) --this.t
            }, I.prototype.dlShiftTo = function (d, b) {
                var P;
                for (P = this.t - 1; P >= 0; --P) b[P + d] = this[P];
                for (P = d - 1; P >= 0; --P) b[P] = 0;
                b.t = this.t + d, b.s = this.s
            }, I.prototype.drShiftTo = function (d, b) {
                for (var P = d; P < this.t; ++P) b[P - d] = this[P];
                b.t = Math.max(this.t - d, 0), b.s = this.s
            }, I.prototype.lShiftTo = function (d, b) {
                for (var P = d % this.DB, V = this.DB - P, $ = (1 << V) - 1, e0 = Math.floor(d / this.DB), i0 = this.s << P & this.DM, f0 = this.t - 1; f0 >= 0; --f0) b[f0 + e0 + 1] = this[f0] >> V | i0, i0 = (this[f0] & $) << P;
                for (f0 = e0 - 1; f0 >= 0; --f0) b[f0] = 0;
                b[e0] = i0, b.t = this.t + e0 + 1, b.s = this.s, b.clamp()
            }, I.prototype.rShiftTo = function (d, b) {
                b.s = this.s;
                var P = Math.floor(d / this.DB);
                if (P >= this.t) b.t = 0; else {
                    var V = d % this.DB, $ = this.DB - V, e0 = (1 << V) - 1;
                    b[0] = this[P] >> V;
                    for (var i0 = P + 1; i0 < this.t; ++i0) b[i0 - P - 1] |= (this[i0] & e0) << $, b[i0 - P] = this[i0] >> V;
                    V > 0 && (b[this.t - P - 1] |= (this.s & e0) << $), b.t = this.t - P, b.clamp()
                }
            }, I.prototype.subTo = function (d, b) {
                for (var P = 0, V = 0, $ = Math.min(d.t, this.t); P < $;) V += this[P] - d[P], b[P++] = V & this.DM, V >>= this.DB;
                if (d.t < this.t) {
                    for (V -= d.s; P < this.t;) V += this[P], b[P++] = V & this.DM, V >>= this.DB;
                    V += this.s
                } else {
                    for (V += this.s; P < d.t;) V -= d[P], b[P++] = V & this.DM, V >>= this.DB;
                    V -= d.s
                }
                b.s = V < 0 ? -1 : 0, V < -1 ? b[P++] = this.DV + V : V > 0 && (b[P++] = V), b.t = P, b.clamp()
            }, I.prototype.multiplyTo = function (d, b) {
                var P = this.abs(), V = d.abs(), $ = P.t;
                for (b.t = $ + V.t; --$ >= 0;) b[$] = 0;
                for ($ = 0; $ < V.t; ++$) b[$ + P.t] = P.am(0, V[$], b, $, 0, P.t);
                b.s = 0, b.clamp(), this.s != d.s && I.ZERO.subTo(b, b)
            }, I.prototype.squareTo = function (d) {
                for (var b = this.abs(), P = d.t = 2 * b.t; --P >= 0;) d[P] = 0;
                for (P = 0; P < b.t - 1; ++P) {
                    var V = b.am(P, b[P], d, 2 * P, 0, 1);
                    (d[P + b.t] += b.am(P + 1, 2 * b[P], d, 2 * P + 1, V, b.t - P - 1)) >= b.DV && (d[P + b.t] -= b.DV, d[P + b.t + 1] = 1)
                }
                d.t > 0 && (d[d.t - 1] += b.am(P, b[P], d, 2 * P, 0, 1)), d.s = 0, d.clamp()
            }, I.prototype.divRemTo = function (d, b, P) {
                var V = d.abs();
                if (!(V.t <= 0)) {
                    var $ = this.abs();
                    if ($.t < V.t) return b?.fromInt(0), void (null != P && this.copyTo(P));
                    null == P && (P = c0());
                    var e0 = c0(), i0 = this.s, f0 = d.s, P0 = this.DB - H0(V[V.t - 1]);
                    P0 > 0 ? (V.lShiftTo(P0, e0), $.lShiftTo(P0, P)) : (V.copyTo(e0), $.copyTo(P));
                    var j0 = e0.t, a1 = e0[j0 - 1];
                    if (0 != a1) {
                        var f1 = a1 * (1 << this.F1) + (j0 > 1 ? e0[j0 - 2] >> this.F2 : 0), s1 = this.FV / f1,
                            N1 = (1 << this.F1) / f1, g1 = 1 << this.F2, y1 = P.t, i1 = y1 - j0, R1 = b ?? c0();
                        for (e0.dlShiftTo(i1, R1), P.compareTo(R1) >= 0 && (P[P.t++] = 1, P.subTo(R1, P)), I.ONE.dlShiftTo(j0, R1), R1.subTo(e0, e0); e0.t < j0;) e0[e0.t++] = 0;
                        for (; --i1 >= 0;) {
                            var Y1 = P[--y1] == a1 ? this.DM : Math.floor(P[y1] * s1 + (P[y1 - 1] + g1) * N1);
                            if ((P[y1] += e0.am(0, Y1, P, i1, 0, j0)) < Y1) for (e0.dlShiftTo(i1, R1), P.subTo(R1, P); P[y1] < --Y1;) P.subTo(R1, P)
                        }
                        null != b && (P.drShiftTo(j0, b), i0 != f0 && I.ZERO.subTo(b, b)), P.t = j0, P.clamp(), P0 > 0 && P.rShiftTo(P0, P), i0 < 0 && I.ZERO.subTo(P, P)
                    }
                }
            }, I.prototype.invDigit = function () {
                if (this.t < 1) return 0;
                var d = this[0];
                if (!(1 & d)) return 0;
                var b = 3 & d;
                return (b = (b = (b = (b = b * (2 - (15 & d) * b) & 15) * (2 - (255 & d) * b) & 255) * (2 - ((65535 & d) * b & 65535)) & 65535) * (2 - d * b % this.DV) % this.DV) > 0 ? this.DV - b : -b
            }, I.prototype.isEven = function () {
                return 0 == (this.t > 0 ? 1 & this[0] : this.s)
            }, I.prototype.exp = function (d, b) {
                if (d > 4294967295 || d < 1) return I.ONE;
                var P = c0(), V = c0(), $ = b.convert(this), e0 = H0(d) - 1;
                for ($.copyTo(P); --e0 >= 0;) if (b.sqrTo(P, V), (d & 1 << e0) > 0) b.mulTo(V, $, P); else {
                    var i0 = P;
                    P = V, V = i0
                }
                return b.revert(P)
            }, I.prototype.chunkSize = function (d) {
                return Math.floor(Math.LN2 * this.DB / Math.log(d))
            }, I.prototype.toRadix = function (d) {
                if (null == d && (d = 10), 0 == this.signum() || d < 2 || d > 36) return "0";
                var b = this.chunkSize(d), P = Math.pow(d, b), V = _0(P), $ = c0(), e0 = c0(), i0 = "";
                for (this.divRemTo(V, $, e0); $.signum() > 0;) i0 = (P + e0.intValue()).toString(d).substr(1) + i0, $.divRemTo(V, $, e0);
                return e0.intValue().toString(d) + i0
            }, I.prototype.fromRadix = function (d, b) {
                this.fromInt(0), null == b && (b = 10);
                for (var P = this.chunkSize(b), V = Math.pow(b, P), $ = !1, e0 = 0, i0 = 0, f0 = 0; f0 < d.length; ++f0) {
                    var P0 = p0(d, f0);
                    P0 < 0 ? "-" == d.charAt(f0) && 0 == this.signum() && ($ = !0) : (i0 = b * i0 + P0, ++e0 >= P && (this.dMultiply(V), this.dAddOffset(i0, 0), e0 = 0, i0 = 0))
                }
                e0 > 0 && (this.dMultiply(Math.pow(b, e0)), this.dAddOffset(i0, 0)), $ && I.ZERO.subTo(this, this)
            }, I.prototype.fromNumber = function (d, b, P) {
                if ("number" == typeof b) if (d < 2) this.fromInt(1); else for (this.fromNumber(d, P), this.testBit(d - 1) || this.bitwiseTo(I.ONE.shiftLeft(d - 1), h, this), this.isEven() && this.dAddOffset(1, 0); !this.isProbablePrime(b);) this.dAddOffset(2, 0), this.bitLength() > d && this.subTo(I.ONE.shiftLeft(d - 1), this); else {
                    var V = [], $ = 7 & d;
                    V.length = 1 + (d >> 3), b.nextBytes(V), $ > 0 ? V[0] &= (1 << $) - 1 : V[0] = 0, this.fromString(V, 256)
                }
            }, I.prototype.bitwiseTo = function (d, b, P) {
                var V, $, e0 = Math.min(d.t, this.t);
                for (V = 0; V < e0; ++V) P[V] = b(this[V], d[V]);
                if (d.t < this.t) {
                    for ($ = d.s & this.DM, V = e0; V < this.t; ++V) P[V] = b(this[V], $);
                    P.t = this.t
                } else {
                    for ($ = this.s & this.DM, V = e0; V < d.t; ++V) P[V] = b($, d[V]);
                    P.t = d.t
                }
                P.s = b(this.s, d.s), P.clamp()
            }, I.prototype.changeBit = function (d, b) {
                var P = I.ONE.shiftLeft(d);
                return this.bitwiseTo(P, b, P), P
            }, I.prototype.addTo = function (d, b) {
                for (var P = 0, V = 0, $ = Math.min(d.t, this.t); P < $;) V += this[P] + d[P], b[P++] = V & this.DM, V >>= this.DB;
                if (d.t < this.t) {
                    for (V += d.s; P < this.t;) V += this[P], b[P++] = V & this.DM, V >>= this.DB;
                    V += this.s
                } else {
                    for (V += this.s; P < d.t;) V += d[P], b[P++] = V & this.DM, V >>= this.DB;
                    V += d.s
                }
                b.s = V < 0 ? -1 : 0, V > 0 ? b[P++] = V : V < -1 && (b[P++] = this.DV + V), b.t = P, b.clamp()
            }, I.prototype.dMultiply = function (d) {
                this[this.t] = this.am(0, d - 1, this, 0, 0, this.t), ++this.t, this.clamp()
            }, I.prototype.dAddOffset = function (d, b) {
                if (0 != d) {
                    for (; this.t <= b;) this[this.t++] = 0;
                    for (this[b] += d; this[b] >= this.DV;) this[b] -= this.DV, ++b >= this.t && (this[this.t++] = 0), ++this[b]
                }
            }, I.prototype.multiplyLowerTo = function (d, b, P) {
                var V = Math.min(this.t + d.t, b);
                for (P.s = 0, P.t = V; V > 0;) P[--V] = 0;
                for (var $ = P.t - this.t; V < $; ++V) P[V + this.t] = this.am(0, d[V], P, V, 0, this.t);
                for ($ = Math.min(d.t, b); V < $; ++V) this.am(0, d[V], P, V, 0, b - V);
                P.clamp()
            }, I.prototype.multiplyUpperTo = function (d, b, P) {
                --b;
                var V = P.t = this.t + d.t - b;
                for (P.s = 0; --V >= 0;) P[V] = 0;
                for (V = Math.max(b - this.t, 0); V < d.t; ++V) P[this.t + V - b] = this.am(b - V, d[V], P, 0, 0, this.t + V - b);
                P.clamp(), P.drShiftTo(1, P)
            }, I.prototype.modInt = function (d) {
                if (d <= 0) return 0;
                var b = this.DV % d, P = this.s < 0 ? d - 1 : 0;
                if (this.t > 0) if (0 == b) P = this[0] % d; else for (var V = this.t - 1; V >= 0; --V) P = (b * P + this[V]) % d;
                return P
            }, I.prototype.millerRabin = function (d) {
                var b = this.subtract(I.ONE), P = b.getLowestSetBit();
                if (P <= 0) return !1;
                var V = b.shiftRight(P);
                (d = d + 1 >> 1) > b0.length && (d = b0.length);
                for (var $ = c0(), e0 = 0; e0 < d; ++e0) {
                    $.fromInt(b0[Math.floor(Math.random() * b0.length)]);
                    var i0 = $.modPow(V, this);
                    if (0 != i0.compareTo(I.ONE) && 0 != i0.compareTo(b)) {
                        for (var f0 = 1; f0++ < P && 0 != i0.compareTo(b);) if (0 == (i0 = i0.modPowInt(2, this)).compareTo(I.ONE)) return !1;
                        if (0 != i0.compareTo(b)) return !1
                    }
                }
                return !0
            }, I.prototype.square = function () {
                var d = c0();
                return this.squareTo(d), d
            }, I.prototype.gcda = function (d, b) {
                var P = this.s < 0 ? this.negate() : this.clone(), V = d.s < 0 ? d.negate() : d.clone();
                if (P.compareTo(V) < 0) {
                    var $ = P;
                    P = V, V = $
                }
                var e0 = P.getLowestSetBit(), i0 = V.getLowestSetBit();
                if (i0 < 0) b(P); else {
                    e0 < i0 && (i0 = e0), i0 > 0 && (P.rShiftTo(i0, P), V.rShiftTo(i0, V));
                    var f0 = function () {
                        (e0 = P.getLowestSetBit()) > 0 && P.rShiftTo(e0, P), (e0 = V.getLowestSetBit()) > 0 && V.rShiftTo(e0, V), P.compareTo(V) >= 0 ? (P.subTo(V, P), P.rShiftTo(1, P)) : (V.subTo(P, V), V.rShiftTo(1, V)), P.signum() > 0 ? setTimeout(f0, 0) : (i0 > 0 && V.lShiftTo(i0, V), setTimeout(function () {
                            b(V)
                        }, 0))
                    };
                    setTimeout(f0, 10)
                }
            }, I.prototype.fromNumberAsync = function (d, b, P, V) {
                if ("number" == typeof b) if (d < 2) this.fromInt(1); else {
                    this.fromNumber(d, P), this.testBit(d - 1) || this.bitwiseTo(I.ONE.shiftLeft(d - 1), h, this), this.isEven() && this.dAddOffset(1, 0);
                    var $ = this, e0 = function () {
                        $.dAddOffset(2, 0), $.bitLength() > d && $.subTo(I.ONE.shiftLeft(d - 1), $), $.isProbablePrime(b) ? setTimeout(function () {
                            V()
                        }, 0) : setTimeout(e0, 0)
                    };
                    setTimeout(e0, 0)
                } else {
                    var i0 = [], f0 = 7 & d;
                    i0.length = 1 + (d >> 3), b.nextBytes(i0), f0 > 0 ? i0[0] &= (1 << f0) - 1 : i0[0] = 0, this.fromString(i0, 256)
                }
            }, I
        }(), v0 = function () {
            function I() {
            }

            return I.prototype.convert = function (d) {
                return d
            }, I.prototype.revert = function (d) {
                return d
            }, I.prototype.mulTo = function (d, b, P) {
                d.multiplyTo(b, P)
            }, I.prototype.sqrTo = function (d, b) {
                d.squareTo(b)
            }, I
        }(), C0 = function () {
            function I(d) {
                this.m = d
            }

            return I.prototype.convert = function (d) {
                return d.s < 0 || d.compareTo(this.m) >= 0 ? d.mod(this.m) : d
            }, I.prototype.revert = function (d) {
                return d
            }, I.prototype.reduce = function (d) {
                d.divRemTo(this.m, null, d)
            }, I.prototype.mulTo = function (d, b, P) {
                d.multiplyTo(b, P), this.reduce(P)
            }, I.prototype.sqrTo = function (d, b) {
                d.squareTo(b), this.reduce(b)
            }, I
        }(), J0 = function () {
            function I(d) {
                this.m = d, this.mp = d.invDigit(), this.mpl = 32767 & this.mp, this.mph = this.mp >> 15, this.um = (1 << d.DB - 15) - 1, this.mt2 = 2 * d.t
            }

            return I.prototype.convert = function (d) {
                var b = c0();
                return d.abs().dlShiftTo(this.m.t, b), b.divRemTo(this.m, null, b), d.s < 0 && b.compareTo(N0.ZERO) > 0 && this.m.subTo(b, b), b
            }, I.prototype.revert = function (d) {
                var b = c0();
                return d.copyTo(b), this.reduce(b), b
            }, I.prototype.reduce = function (d) {
                for (; d.t <= this.mt2;) d[d.t++] = 0;
                for (var b = 0; b < this.m.t; ++b) {
                    var P = 32767 & d[b],
                        V = P * this.mpl + ((P * this.mph + (d[b] >> 15) * this.mpl & this.um) << 15) & d.DM;
                    for (d[P = b + this.m.t] += this.m.am(0, V, d, b, 0, this.m.t); d[P] >= d.DV;) d[P] -= d.DV, d[++P]++
                }
                d.clamp(), d.drShiftTo(this.m.t, d), d.compareTo(this.m) >= 0 && d.subTo(this.m, d)
            }, I.prototype.mulTo = function (d, b, P) {
                d.multiplyTo(b, P), this.reduce(P)
            }, I.prototype.sqrTo = function (d, b) {
                d.squareTo(b), this.reduce(b)
            }, I
        }(), y0 = function () {
            function I(d) {
                this.m = d, this.r2 = c0(), this.q3 = c0(), N0.ONE.dlShiftTo(2 * d.t, this.r2), this.mu = this.r2.divide(d)
            }

            return I.prototype.convert = function (d) {
                if (d.s < 0 || d.t > 2 * this.m.t) return d.mod(this.m);
                if (d.compareTo(this.m) < 0) return d;
                var b = c0();
                return d.copyTo(b), this.reduce(b), b
            }, I.prototype.revert = function (d) {
                return d
            }, I.prototype.reduce = function (d) {
                for (d.drShiftTo(this.m.t - 1, this.r2), d.t > this.m.t + 1 && (d.t = this.m.t + 1, d.clamp()), this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3), this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2); d.compareTo(this.r2) < 0;) d.dAddOffset(1, this.m.t + 1);
                for (d.subTo(this.r2, d); d.compareTo(this.m) >= 0;) d.subTo(this.m, d)
            }, I.prototype.mulTo = function (d, b, P) {
                d.multiplyTo(b, P), this.reduce(P)
            }, I.prototype.sqrTo = function (d, b) {
                d.squareTo(b), this.reduce(b)
            }, I
        }();

    function c0() {
        return new N0(null)
    }

    function O0(I, d) {
        return new N0(I, d)
    }

    "Microsoft Internet Explorer" == navigator.appName ? (N0.prototype.am = function (I, d, b, P, V, $) {
        for (var e0 = 32767 & d, i0 = d >> 15; --$ >= 0;) {
            var f0 = 32767 & this[I], P0 = this[I++] >> 15, j0 = i0 * f0 + P0 * e0;
            V = ((f0 = e0 * f0 + ((32767 & j0) << 15) + b[P] + (1073741823 & V)) >>> 30) + (j0 >>> 15) + i0 * P0 + (V >>> 30), b[P++] = 1073741823 & f0
        }
        return V
    }, d0 = 30) : "Netscape" != navigator.appName ? (N0.prototype.am = function (I, d, b, P, V, $) {
        for (; --$ >= 0;) {
            var e0 = d * this[I++] + b[P] + V;
            V = Math.floor(e0 / 67108864), b[P++] = 67108863 & e0
        }
        return V
    }, d0 = 26) : (N0.prototype.am = function (I, d, b, P, V, $) {
        for (var e0 = 16383 & d, i0 = d >> 14; --$ >= 0;) {
            var f0 = 16383 & this[I], P0 = this[I++] >> 14, j0 = i0 * f0 + P0 * e0;
            V = ((f0 = e0 * f0 + ((16383 & j0) << 14) + b[P] + V) >> 28) + (j0 >> 14) + i0 * P0, b[P++] = 268435455 & f0
        }
        return V
    }, d0 = 28), N0.prototype.DB = d0, N0.prototype.DM = (1 << d0) - 1, N0.prototype.DV = 1 << d0, N0.prototype.FV = Math.pow(2, 52), N0.prototype.F1 = 52 - d0, N0.prototype.F2 = 2 * d0 - 52;
    var Z, m0, L0 = [];
    for (Z = 48, m0 = 0; m0 <= 9; ++m0) L0[Z++] = m0;
    for (Z = 97, m0 = 10; m0 < 36; ++m0) L0[Z++] = m0;
    for (Z = 65, m0 = 10; m0 < 36; ++m0) L0[Z++] = m0;

    function p0(I, d) {
        return L0[I.charCodeAt(d)] ?? -1
    }

    function _0(I) {
        var d = c0();
        return d.fromInt(I), d
    }

    function H0(I) {
        var d, b = 1;
        return 0 != (d = I >>> 16) && (I = d, b += 16), 0 != (d = I >> 8) && (I = d, b += 8), 0 != (d = I >> 4) && (I = d, b += 4), 0 != (d = I >> 2) && (I = d, b += 2), 0 != (d = I >> 1) && (I = d, b += 1), b
    }

    N0.ZERO = _0(0), N0.ONE = _0(1);
    var X0, V0, K0 = function () {
        function I() {
            this.i = 0, this.j = 0, this.S = []
        }

        return I.prototype.init = function (d) {
            var b, P, V;
            for (b = 0; b < 256; ++b) this.S[b] = b;
            for (P = 0, b = 0; b < 256; ++b) V = this.S[b], this.S[b] = this.S[P = P + this.S[b] + d[b % d.length] & 255], this.S[P] = V;
            this.i = 0, this.j = 0
        }, I.prototype.next = function () {
            var d;
            return this.i = this.i + 1 & 255, this.j = this.j + this.S[this.i] & 255, d = this.S[this.i], this.S[this.i] = this.S[this.j], this.S[this.j] = d, this.S[d + this.S[this.i] & 255]
        }, I
    }(), Y0 = null;
    if (null == Y0) {
        Y0 = [], V0 = 0;
        var Z0 = void 0;
        if (window.crypto && window.crypto.getRandomValues) {
            var m1 = new Uint32Array(256);
            for (window.crypto.getRandomValues(m1), Z0 = 0; Z0 < m1.length; ++Z0) Y0[V0++] = 255 & m1[Z0]
        }
        var R0 = function (I) {
            if (this.count = this.count || 0, this.count >= 256 || V0 >= 256) window.removeEventListener ? window.removeEventListener("mousemove", R0, !1) : window.detachEvent && window.detachEvent("onmousemove", R0); else try {
                Y0[V0++] = 255 & I.x + I.y, this.count += 1
            } catch {
            }
        };
        window.addEventListener ? window.addEventListener("mousemove", R0, !1) : window.attachEvent && window.attachEvent("onmousemove", R0)
    }

    function q1() {
        if (null == X0) {
            for (X0 = new K0; V0 < 256;) {
                var I = Math.floor(65536 * Math.random());
                Y0[V0++] = 255 & I
            }
            for (X0.init(Y0), V0 = 0; V0 < Y0.length; ++V0) Y0[V0] = 0;
            V0 = 0
        }
        return X0.next()
    }

    var D1 = function () {
        function I() {
        }

        return I.prototype.nextBytes = function (d) {
            for (var b = 0; b < d.length; ++b) d[b] = q1()
        }, I
    }(), H1 = function () {
        function I() {
            this.n = null, this.e = 0, this.d = null, this.p = null, this.q = null, this.dmp1 = null, this.dmq1 = null, this.coeff = null
        }

        return I.prototype.doPublic = function (d) {
            return d.modPowInt(this.e, this.n)
        }, I.prototype.doPrivate = function (d) {
            if (null == this.p || null == this.q) return d.modPow(this.d, this.n);
            for (var b = d.mod(this.p).modPow(this.dmp1, this.p), P = d.mod(this.q).modPow(this.dmq1, this.q); b.compareTo(P) < 0;) b = b.add(this.p);
            return b.subtract(P).multiply(this.coeff).mod(this.p).multiply(this.q).add(P)
        }, I.prototype.setPublic = function (d, b) {
            null != d && null != b && d.length > 0 && b.length > 0 ? (this.n = O0(d, 16), this.e = parseInt(b, 16)) : console.error("Invalid RSA public key")
        }, I.prototype.encrypt = function (d) {
            var b = function ($, e0) {
                if (e0 < $.length + 11) return console.error("Message too long for RSA"), null;
                for (var i0 = [], f0 = $.length - 1; f0 >= 0 && e0 > 0;) {
                    var P0 = $.charCodeAt(f0--);
                    P0 < 128 ? i0[--e0] = P0 : P0 > 127 && P0 < 2048 ? (i0[--e0] = 63 & P0 | 128, i0[--e0] = P0 >> 6 | 192) : (i0[--e0] = 63 & P0 | 128, i0[--e0] = P0 >> 6 & 63 | 128, i0[--e0] = P0 >> 12 | 224)
                }
                i0[--e0] = 0;
                for (var j0 = new D1, a1 = []; e0 > 2;) {
                    for (a1[0] = 0; 0 == a1[0];) j0.nextBytes(a1);
                    i0[--e0] = a1[0]
                }
                return i0[--e0] = 2, i0[--e0] = 0, new N0(i0)
            }(d, this.n.bitLength() + 7 >> 3);
            if (null == b) return null;
            var P = this.doPublic(b);
            if (null == P) return null;
            var V = P.toString(16);
            return 1 & V.length ? "0" + V : V
        }, I.prototype.setPrivate = function (d, b, P) {
            null != d && null != b && d.length > 0 && b.length > 0 ? (this.n = O0(d, 16), this.e = parseInt(b, 16), this.d = O0(P, 16)) : console.error("Invalid RSA private key")
        }, I.prototype.setPrivateEx = function (d, b, P, V, $, e0, i0, f0) {
            null != d && null != b && d.length > 0 && b.length > 0 ? (this.n = O0(d, 16), this.e = parseInt(b, 16), this.d = O0(P, 16), this.p = O0(V, 16), this.q = O0($, 16), this.dmp1 = O0(e0, 16), this.dmq1 = O0(i0, 16), this.coeff = O0(f0, 16)) : console.error("Invalid RSA private key")
        }, I.prototype.generate = function (d, b) {
            var P = new D1, V = d >> 1;
            this.e = parseInt(b, 16);
            for (var $ = new N0(b, 16); ;) {
                for (; this.p = new N0(d - V, 1, P), 0 != this.p.subtract(N0.ONE).gcd($).compareTo(N0.ONE) || !this.p.isProbablePrime(10);) ;
                for (; this.q = new N0(V, 1, P), 0 != this.q.subtract(N0.ONE).gcd($).compareTo(N0.ONE) || !this.q.isProbablePrime(10);) ;
                if (this.p.compareTo(this.q) <= 0) {
                    var e0 = this.p;
                    this.p = this.q, this.q = e0
                }
                var i0 = this.p.subtract(N0.ONE), f0 = this.q.subtract(N0.ONE), P0 = i0.multiply(f0);
                if (0 == P0.gcd($).compareTo(N0.ONE)) {
                    this.n = this.p.multiply(this.q), this.d = $.modInverse(P0), this.dmp1 = this.d.mod(i0), this.dmq1 = this.d.mod(f0), this.coeff = this.q.modInverse(this.p);
                    break
                }
            }
        }, I.prototype.decrypt = function (d) {
            var b = O0(d, 16), P = this.doPrivate(b);
            return null == P ? null : function (V, $) {
                for (var e0 = V.toByteArray(), i0 = 0; i0 < e0.length && 0 == e0[i0];) ++i0;
                if (e0.length - i0 != $ - 1 || 2 != e0[i0]) return null;
                for (++i0; 0 != e0[i0];) if (++i0 >= e0.length) return null;
                for (var f0 = ""; ++i0 < e0.length;) {
                    var P0 = 255 & e0[i0];
                    P0 < 128 ? f0 += String.fromCharCode(P0) : P0 > 191 && P0 < 224 ? (f0 += String.fromCharCode((31 & P0) << 6 | 63 & e0[i0 + 1]), ++i0) : (f0 += String.fromCharCode((15 & P0) << 12 | (63 & e0[i0 + 1]) << 6 | 63 & e0[i0 + 2]), i0 += 2)
                }
                return f0
            }(P, this.n.bitLength() + 7 >> 3)
        }, I.prototype.generateAsync = function (d, b, P) {
            var V = new D1, $ = d >> 1;
            this.e = parseInt(b, 16);
            var e0 = new N0(b, 16), i0 = this, f0 = function () {
                var P0 = function () {
                    if (i0.p.compareTo(i0.q) <= 0) {
                        var f1 = i0.p;
                        i0.p = i0.q, i0.q = f1
                    }
                    var s1 = i0.p.subtract(N0.ONE), N1 = i0.q.subtract(N0.ONE), g1 = s1.multiply(N1);
                    0 == g1.gcd(e0).compareTo(N0.ONE) ? (i0.n = i0.p.multiply(i0.q), i0.d = e0.modInverse(g1), i0.dmp1 = i0.d.mod(s1), i0.dmq1 = i0.d.mod(N1), i0.coeff = i0.q.modInverse(i0.p), setTimeout(function () {
                        P()
                    }, 0)) : setTimeout(f0, 0)
                }, j0 = function () {
                    i0.q = c0(), i0.q.fromNumberAsync($, 1, V, function () {
                        i0.q.subtract(N0.ONE).gcda(e0, function (f1) {
                            0 == f1.compareTo(N0.ONE) && i0.q.isProbablePrime(10) ? setTimeout(P0, 0) : setTimeout(j0, 0)
                        })
                    })
                }, a1 = function () {
                    i0.p = c0(), i0.p.fromNumberAsync(d - $, 1, V, function () {
                        i0.p.subtract(N0.ONE).gcda(e0, function (f1) {
                            0 == f1.compareTo(N0.ONE) && i0.p.isProbablePrime(10) ? setTimeout(j0, 0) : setTimeout(a1, 0)
                        })
                    })
                };
                setTimeout(a1, 0)
            };
            setTimeout(f0, 0)
        }, I
    }(), n1 = {};
    n1.lang = {
        extend: function (I, d, b) {
            if (!d || !I) throw new Error("YAHOO.lang.extend failed, please check that all dependencies are included.");
            var P = function () {
            };
            if (P.prototype = d.prototype, I.prototype = new P, I.prototype.constructor = I, I.superclass = d.prototype, d.prototype.constructor == Object.prototype.constructor && (d.prototype.constructor = d), b) {
                var V;
                for (V in b) I.prototype[V] = b[V];
                var $ = function () {
                }, e0 = ["toString", "valueOf"];
                try {
                    /MSIE/.test(navigator.userAgent) && ($ = function (i0, f0) {
                        for (V = 0; V < e0.length; V += 1) {
                            var P0 = e0[V], j0 = f0[P0];
                            "function" == typeof j0 && j0 != Object.prototype[P0] && (i0[P0] = j0)
                        }
                    })
                } catch {
                }
                $(I.prototype, b)
            }
        }
    };
    var g0 = {};
    void 0 !== g0.asn1 && g0.asn1 || (g0.asn1 = {}), g0.asn1.ASN1Util = new function () {
        this.integerToByteHex = function (I) {
            var d = I.toString(16);
            return d.length % 2 == 1 && (d = "0" + d), d
        }, this.bigIntToMinTwosComplementsHex = function (I) {
            var d = I.toString(16);
            if ("-" != d.substr(0, 1)) d.length % 2 == 1 ? d = "0" + d : d.match(/^[0-7]/) || (d = "00" + d); else {
                var b = d.substr(1).length;
                b % 2 == 1 ? b += 1 : d.match(/^[0-7]/) || (b += 2);
                for (var P = "", V = 0; V < b; V++) P += "f";
                d = new N0(P, 16).xor(I).add(N0.ONE).toString(16).replace(/^-/, "")
            }
            return d
        }, this.getPEMStringFromHex = function (I, d) {
            return hextopem(I, d)
        }, this.newObject = function (I) {
            var d = g0.asn1, b = d.DERBoolean, P = d.DERInteger, V = d.DERBitString, $ = d.DEROctetString,
                e0 = d.DERNull, i0 = d.DERObjectIdentifier, f0 = d.DEREnumerated, P0 = d.DERUTF8String,
                j0 = d.DERNumericString, a1 = d.DERPrintableString, f1 = d.DERTeletexString, s1 = d.DERIA5String,
                N1 = d.DERUTCTime, g1 = d.DERGeneralizedTime, y1 = d.DERSequence, i1 = d.DERSet, R1 = d.DERTaggedObject,
                Y1 = d.ASN1Util.newObject, de = Object.keys(I);
            if (1 != de.length) throw "key of param shall be only one.";
            var Q0 = de[0];
            if (-1 == ":bool:int:bitstr:octstr:null:oid:enum:utf8str:numstr:prnstr:telstr:ia5str:utctime:gentime:seq:set:tag:".indexOf(":" + Q0 + ":")) throw "undefined key: " + Q0;
            if ("bool" == Q0) return new b(I[Q0]);
            if ("int" == Q0) return new P(I[Q0]);
            if ("bitstr" == Q0) return new V(I[Q0]);
            if ("octstr" == Q0) return new $(I[Q0]);
            if ("null" == Q0) return new e0(I[Q0]);
            if ("oid" == Q0) return new i0(I[Q0]);
            if ("enum" == Q0) return new f0(I[Q0]);
            if ("utf8str" == Q0) return new P0(I[Q0]);
            if ("numstr" == Q0) return new j0(I[Q0]);
            if ("prnstr" == Q0) return new a1(I[Q0]);
            if ("telstr" == Q0) return new f1(I[Q0]);
            if ("ia5str" == Q0) return new s1(I[Q0]);
            if ("utctime" == Q0) return new N1(I[Q0]);
            if ("gentime" == Q0) return new g1(I[Q0]);
            if ("seq" == Q0) {
                for (var ee = I[Q0], K1 = [], J1 = 0; J1 < ee.length; J1++) {
                    var ve = Y1(ee[J1]);
                    K1.push(ve)
                }
                return new y1({array: K1})
            }
            if ("set" == Q0) {
                for (ee = I[Q0], K1 = [], J1 = 0; J1 < ee.length; J1++) ve = Y1(ee[J1]), K1.push(ve);
                return new i1({array: K1})
            }
            if ("tag" == Q0) {
                var X1 = I[Q0];
                if ("[object Array]" === Object.prototype.toString.call(X1) && 3 == X1.length) {
                    var Te = Y1(X1[2]);
                    return new R1({tag: X1[0], explicit: X1[1], obj: Te})
                }
                var L1 = {};
                if (void 0 !== X1.explicit && (L1.explicit = X1.explicit), void 0 !== X1.tag && (L1.tag = X1.tag), void 0 === X1.obj) throw "obj shall be specified for 'tag'.";
                return L1.obj = Y1(X1.obj), new R1(L1)
            }
        }, this.jsonToASN1HEX = function (I) {
            return this.newObject(I).getEncodedHex()
        }
    }, g0.asn1.ASN1Util.oidHexToInt = function (I) {
        for (var d = "", b = parseInt(I.substr(0, 2), 16), P = (d = Math.floor(b / 40) + "." + b % 40, ""), V = 2; V < I.length; V += 2) {
            var $ = ("00000000" + parseInt(I.substr(V, 2), 16).toString(2)).slice(-8);
            P += $.substr(1, 7), "0" == $.substr(0, 1) && (d = d + "." + new N0(P, 2).toString(10), P = "")
        }
        return d
    }, g0.asn1.ASN1Util.oidIntToHex = function (I) {
        var d = function (i0) {
            var f0 = i0.toString(16);
            return 1 == f0.length && (f0 = "0" + f0), f0
        }, b = function (i0) {
            var f0 = "", P0 = new N0(i0, 10).toString(2), j0 = 7 - P0.length % 7;
            7 == j0 && (j0 = 0);
            for (var a1 = "", f1 = 0; f1 < j0; f1++) a1 += "0";
            for (P0 = a1 + P0, f1 = 0; f1 < P0.length - 1; f1 += 7) {
                var s1 = P0.substr(f1, 7);
                f1 != P0.length - 7 && (s1 = "1" + s1), f0 += d(parseInt(s1, 2))
            }
            return f0
        };
        if (!I.match(/^[0-9.]+$/)) throw "malformed oid string: " + I;
        var P = "", V = I.split("."), $ = 40 * parseInt(V[0]) + parseInt(V[1]);
        P += d($), V.splice(0, 2);
        for (var e0 = 0; e0 < V.length; e0++) P += b(V[e0]);
        return P
    }, g0.asn1.ASN1Object = function () {
        this.getLengthHexFromValue = function () {
            if (void 0 === this.hV || null == this.hV) throw "this.hV is null or undefined.";
            if (this.hV.length % 2 == 1) throw "value hex must be even length: n=0,v=" + this.hV;
            var I = this.hV.length / 2, d = I.toString(16);
            if (d.length % 2 == 1 && (d = "0" + d), I < 128) return d;
            var b = d.length / 2;
            if (b > 15) throw "ASN.1 length too long to represent by 8x: n = " + I.toString(16);
            return (128 + b).toString(16) + d
        }, this.getEncodedHex = function () {
            return (null == this.hTLV || this.isModified) && (this.hV = this.getFreshValueHex(), this.hL = this.getLengthHexFromValue(), this.hTLV = this.hT + this.hL + this.hV, this.isModified = !1), this.hTLV
        }, this.getValueHex = function () {
            return this.getEncodedHex(), this.hV
        }, this.getFreshValueHex = function () {
            return ""
        }
    }, g0.asn1.DERAbstractString = function (I) {
        g0.asn1.DERAbstractString.superclass.constructor.call(this), this.getString = function () {
            return this.s
        }, this.setString = function (d) {
            this.hTLV = null, this.isModified = !0, this.s = d, this.hV = stohex(this.s)
        }, this.setStringHex = function (d) {
            this.hTLV = null, this.isModified = !0, this.s = null, this.hV = d
        }, this.getFreshValueHex = function () {
            return this.hV
        }, void 0 !== I && ("string" == typeof I ? this.setString(I) : void 0 !== I.str ? this.setString(I.str) : void 0 !== I.hex && this.setStringHex(I.hex))
    }, n1.lang.extend(g0.asn1.DERAbstractString, g0.asn1.ASN1Object), g0.asn1.DERAbstractTime = function (I) {
        g0.asn1.DERAbstractTime.superclass.constructor.call(this), this.localDateToUTC = function (d) {
            return utc = d.getTime() + 6e4 * d.getTimezoneOffset(), new Date(utc)
        }, this.formatDate = function (d, b, P) {
            var V = this.zeroPadding, $ = this.localDateToUTC(d), e0 = String($.getFullYear());
            "utc" == b && (e0 = e0.substr(2, 2));
            var i0 = e0 + V(String($.getMonth() + 1), 2) + V(String($.getDate()), 2) + V(String($.getHours()), 2) + V(String($.getMinutes()), 2) + V(String($.getSeconds()), 2);
            if (!0 === P) {
                var f0 = $.getMilliseconds();
                if (0 != f0) {
                    var P0 = V(String(f0), 3);
                    i0 = i0 + "." + (P0 = P0.replace(/[0]+$/, ""))
                }
            }
            return i0 + "Z"
        }, this.zeroPadding = function (d, b) {
            return d.length >= b ? d : new Array(b - d.length + 1).join("0") + d
        }, this.getString = function () {
            return this.s
        }, this.setString = function (d) {
            this.hTLV = null, this.isModified = !0, this.s = d, this.hV = stohex(d)
        }, this.setByDateValue = function (d, b, P, V, $, e0) {
            var i0 = new Date(Date.UTC(d, b - 1, P, V, $, e0, 0));
            this.setByDate(i0)
        }, this.getFreshValueHex = function () {
            return this.hV
        }
    }, n1.lang.extend(g0.asn1.DERAbstractTime, g0.asn1.ASN1Object), g0.asn1.DERAbstractStructured = function (I) {
        g0.asn1.DERAbstractString.superclass.constructor.call(this), this.setByASN1ObjectArray = function (d) {
            this.hTLV = null, this.isModified = !0, this.asn1Array = d
        }, this.appendASN1Object = function (d) {
            this.hTLV = null, this.isModified = !0, this.asn1Array.push(d)
        }, this.asn1Array = new Array, void 0 !== I && void 0 !== I.array && (this.asn1Array = I.array)
    }, n1.lang.extend(g0.asn1.DERAbstractStructured, g0.asn1.ASN1Object), g0.asn1.DERBoolean = function () {
        g0.asn1.DERBoolean.superclass.constructor.call(this), this.hT = "01", this.hTLV = "0101ff"
    }, n1.lang.extend(g0.asn1.DERBoolean, g0.asn1.ASN1Object), g0.asn1.DERInteger = function (I) {
        g0.asn1.DERInteger.superclass.constructor.call(this), this.hT = "02", this.setByBigInteger = function (d) {
            this.hTLV = null, this.isModified = !0, this.hV = g0.asn1.ASN1Util.bigIntToMinTwosComplementsHex(d)
        }, this.setByInteger = function (d) {
            var b = new N0(String(d), 10);
            this.setByBigInteger(b)
        }, this.setValueHex = function (d) {
            this.hV = d
        }, this.getFreshValueHex = function () {
            return this.hV
        }, void 0 !== I && (void 0 !== I.bigint ? this.setByBigInteger(I.bigint) : void 0 !== I.int ? this.setByInteger(I.int) : "number" == typeof I ? this.setByInteger(I) : void 0 !== I.hex && this.setValueHex(I.hex))
    }, n1.lang.extend(g0.asn1.DERInteger, g0.asn1.ASN1Object), g0.asn1.DERBitString = function (I) {
        if (void 0 !== I && void 0 !== I.obj) {
            var d = g0.asn1.ASN1Util.newObject(I.obj);
            I.hex = "00" + d.getEncodedHex()
        }
        g0.asn1.DERBitString.superclass.constructor.call(this), this.hT = "03", this.setHexValueIncludingUnusedBits = function (b) {
            this.hTLV = null, this.isModified = !0, this.hV = b
        }, this.setUnusedBitsAndHexValue = function (b, P) {
            if (b < 0 || 7 < b) throw "unused bits shall be from 0 to 7: u = " + b;
            var V = "0" + b;
            this.hTLV = null, this.isModified = !0, this.hV = V + P
        }, this.setByBinaryString = function (b) {
            var P = 8 - (b = b.replace(/0+$/, "")).length % 8;
            8 == P && (P = 0);
            for (var V = 0; V <= P; V++) b += "0";
            var $ = "";
            for (V = 0; V < b.length - 1; V += 8) {
                var e0 = b.substr(V, 8), i0 = parseInt(e0, 2).toString(16);
                1 == i0.length && (i0 = "0" + i0), $ += i0
            }
            this.hTLV = null, this.isModified = !0, this.hV = "0" + P + $
        }, this.setByBooleanArray = function (b) {
            for (var P = "", V = 0; V < b.length; V++) P += 1 == b[V] ? "1" : "0";
            this.setByBinaryString(P)
        }, this.newFalseArray = function (b) {
            for (var P = new Array(b), V = 0; V < b; V++) P[V] = !1;
            return P
        }, this.getFreshValueHex = function () {
            return this.hV
        }, void 0 !== I && ("string" == typeof I && I.toLowerCase().match(/^[0-9a-f]+$/) ? this.setHexValueIncludingUnusedBits(I) : void 0 !== I.hex ? this.setHexValueIncludingUnusedBits(I.hex) : void 0 !== I.bin ? this.setByBinaryString(I.bin) : void 0 !== I.array && this.setByBooleanArray(I.array))
    }, n1.lang.extend(g0.asn1.DERBitString, g0.asn1.ASN1Object), g0.asn1.DEROctetString = function (I) {
        if (void 0 !== I && void 0 !== I.obj) {
            var d = g0.asn1.ASN1Util.newObject(I.obj);
            I.hex = d.getEncodedHex()
        }
        g0.asn1.DEROctetString.superclass.constructor.call(this, I), this.hT = "04"
    }, n1.lang.extend(g0.asn1.DEROctetString, g0.asn1.DERAbstractString), g0.asn1.DERNull = function () {
        g0.asn1.DERNull.superclass.constructor.call(this), this.hT = "05", this.hTLV = "0500"
    }, n1.lang.extend(g0.asn1.DERNull, g0.asn1.ASN1Object), g0.asn1.DERObjectIdentifier = function (I) {
        var d = function (P) {
            var V = P.toString(16);
            return 1 == V.length && (V = "0" + V), V
        }, b = function (P) {
            var V = "", $ = new N0(P, 10).toString(2), e0 = 7 - $.length % 7;
            7 == e0 && (e0 = 0);
            for (var i0 = "", f0 = 0; f0 < e0; f0++) i0 += "0";
            for ($ = i0 + $, f0 = 0; f0 < $.length - 1; f0 += 7) {
                var P0 = $.substr(f0, 7);
                f0 != $.length - 7 && (P0 = "1" + P0), V += d(parseInt(P0, 2))
            }
            return V
        };
        g0.asn1.DERObjectIdentifier.superclass.constructor.call(this), this.hT = "06", this.setValueHex = function (P) {
            this.hTLV = null, this.isModified = !0, this.s = null, this.hV = P
        }, this.setValueOidString = function (P) {
            if (!P.match(/^[0-9.]+$/)) throw "malformed oid string: " + P;
            var V = "", $ = P.split("."), e0 = 40 * parseInt($[0]) + parseInt($[1]);
            V += d(e0), $.splice(0, 2);
            for (var i0 = 0; i0 < $.length; i0++) V += b($[i0]);
            this.hTLV = null, this.isModified = !0, this.s = null, this.hV = V
        }, this.setValueName = function (P) {
            var V = g0.asn1.x509.OID.name2oid(P);
            if ("" === V) throw "DERObjectIdentifier oidName undefined: " + P;
            this.setValueOidString(V)
        }, this.getFreshValueHex = function () {
            return this.hV
        }, void 0 !== I && ("string" == typeof I ? I.match(/^[0-2].[0-9.]+$/) ? this.setValueOidString(I) : this.setValueName(I) : void 0 !== I.oid ? this.setValueOidString(I.oid) : void 0 !== I.hex ? this.setValueHex(I.hex) : void 0 !== I.name && this.setValueName(I.name))
    }, n1.lang.extend(g0.asn1.DERObjectIdentifier, g0.asn1.ASN1Object), g0.asn1.DEREnumerated = function (I) {
        g0.asn1.DEREnumerated.superclass.constructor.call(this), this.hT = "0a", this.setByBigInteger = function (d) {
            this.hTLV = null, this.isModified = !0, this.hV = g0.asn1.ASN1Util.bigIntToMinTwosComplementsHex(d)
        }, this.setByInteger = function (d) {
            var b = new N0(String(d), 10);
            this.setByBigInteger(b)
        }, this.setValueHex = function (d) {
            this.hV = d
        }, this.getFreshValueHex = function () {
            return this.hV
        }, void 0 !== I && (void 0 !== I.int ? this.setByInteger(I.int) : "number" == typeof I ? this.setByInteger(I) : void 0 !== I.hex && this.setValueHex(I.hex))
    }, n1.lang.extend(g0.asn1.DEREnumerated, g0.asn1.ASN1Object), g0.asn1.DERUTF8String = function (I) {
        g0.asn1.DERUTF8String.superclass.constructor.call(this, I), this.hT = "0c"
    }, n1.lang.extend(g0.asn1.DERUTF8String, g0.asn1.DERAbstractString), g0.asn1.DERNumericString = function (I) {
        g0.asn1.DERNumericString.superclass.constructor.call(this, I), this.hT = "12"
    }, n1.lang.extend(g0.asn1.DERNumericString, g0.asn1.DERAbstractString), g0.asn1.DERPrintableString = function (I) {
        g0.asn1.DERPrintableString.superclass.constructor.call(this, I), this.hT = "13"
    }, n1.lang.extend(g0.asn1.DERPrintableString, g0.asn1.DERAbstractString), g0.asn1.DERTeletexString = function (I) {
        g0.asn1.DERTeletexString.superclass.constructor.call(this, I), this.hT = "14"
    }, n1.lang.extend(g0.asn1.DERTeletexString, g0.asn1.DERAbstractString), g0.asn1.DERIA5String = function (I) {
        g0.asn1.DERIA5String.superclass.constructor.call(this, I), this.hT = "16"
    }, n1.lang.extend(g0.asn1.DERIA5String, g0.asn1.DERAbstractString), g0.asn1.DERUTCTime = function (I) {
        g0.asn1.DERUTCTime.superclass.constructor.call(this, I), this.hT = "17", this.setByDate = function (d) {
            this.hTLV = null, this.isModified = !0, this.date = d, this.s = this.formatDate(this.date, "utc"), this.hV = stohex(this.s)
        }, this.getFreshValueHex = function () {
            return void 0 === this.date && void 0 === this.s && (this.date = new Date, this.s = this.formatDate(this.date, "utc"), this.hV = stohex(this.s)), this.hV
        }, void 0 !== I && (void 0 !== I.str ? this.setString(I.str) : "string" == typeof I && I.match(/^[0-9]{12}Z$/) ? this.setString(I) : void 0 !== I.hex ? this.setStringHex(I.hex) : void 0 !== I.date && this.setByDate(I.date))
    }, n1.lang.extend(g0.asn1.DERUTCTime, g0.asn1.DERAbstractTime), g0.asn1.DERGeneralizedTime = function (I) {
        g0.asn1.DERGeneralizedTime.superclass.constructor.call(this, I), this.hT = "18", this.withMillis = !1, this.setByDate = function (d) {
            this.hTLV = null, this.isModified = !0, this.date = d, this.s = this.formatDate(this.date, "gen", this.withMillis), this.hV = stohex(this.s)
        }, this.getFreshValueHex = function () {
            return void 0 === this.date && void 0 === this.s && (this.date = new Date, this.s = this.formatDate(this.date, "gen", this.withMillis), this.hV = stohex(this.s)), this.hV
        }, void 0 !== I && (void 0 !== I.str ? this.setString(I.str) : "string" == typeof I && I.match(/^[0-9]{14}Z$/) ? this.setString(I) : void 0 !== I.hex ? this.setStringHex(I.hex) : void 0 !== I.date && this.setByDate(I.date), !0 === I.millis && (this.withMillis = !0))
    }, n1.lang.extend(g0.asn1.DERGeneralizedTime, g0.asn1.DERAbstractTime), g0.asn1.DERSequence = function (I) {
        g0.asn1.DERSequence.superclass.constructor.call(this, I), this.hT = "30", this.getFreshValueHex = function () {
            for (var d = "", b = 0; b < this.asn1Array.length; b++) d += this.asn1Array[b].getEncodedHex();
            return this.hV = d, this.hV
        }
    }, n1.lang.extend(g0.asn1.DERSequence, g0.asn1.DERAbstractStructured), g0.asn1.DERSet = function (I) {
        g0.asn1.DERSet.superclass.constructor.call(this, I), this.hT = "31", this.sortFlag = !0, this.getFreshValueHex = function () {
            for (var d = new Array, b = 0; b < this.asn1Array.length; b++) d.push(this.asn1Array[b].getEncodedHex());
            return 1 == this.sortFlag && d.sort(), this.hV = d.join(""), this.hV
        }, void 0 !== I && void 0 !== I.sortflag && 0 == I.sortflag && (this.sortFlag = !1)
    }, n1.lang.extend(g0.asn1.DERSet, g0.asn1.DERAbstractStructured), g0.asn1.DERTaggedObject = function (I) {
        g0.asn1.DERTaggedObject.superclass.constructor.call(this), this.hT = "a0", this.hV = "", this.isExplicit = !0, this.asn1Object = null, this.setASN1Object = function (d, b, P) {
            this.hT = b, this.isExplicit = d, this.asn1Object = P, this.isExplicit ? (this.hV = this.asn1Object.getEncodedHex(), this.hTLV = null, this.isModified = !0) : (this.hV = null, this.hTLV = P.getEncodedHex(), this.hTLV = this.hTLV.replace(/^../, b), this.isModified = !1)
        }, this.getFreshValueHex = function () {
            return this.hV
        }, void 0 !== I && (void 0 !== I.tag && (this.hT = I.tag), void 0 !== I.explicit && (this.isExplicit = I.explicit), void 0 !== I.obj && (this.asn1Object = I.obj, this.setASN1Object(this.isExplicit, this.hT, this.asn1Object)))
    }, n1.lang.extend(g0.asn1.DERTaggedObject, g0.asn1.ASN1Object);
    var p1 = function (I) {
        function d(b) {
            var P = I.call(this) || this;
            return b && ("string" == typeof b ? P.parseKey(b) : (d.hasPrivateKeyProperty(b) || d.hasPublicKeyProperty(b)) && P.parsePropertiesFrom(b)), P
        }

        return function (b, P) {
            function V() {
                this.constructor = b
            }

            L(b, P), b.prototype = null === P ? Object.create(P) : (V.prototype = P.prototype, new V)
        }(d, I), d.prototype.parseKey = function (b) {
            try {
                var P = 0, V = 0, $ = /^\s*(?:[0-9A-Fa-f][0-9A-Fa-f]\s*)+$/.test(b) ? function (I) {
                    var d;
                    if (void 0 === S) {
                        var b = "0123456789ABCDEF", P = " \f\n\r\t\xa0\u2028\u2029";
                        for (S = {}, d = 0; d < 16; ++d) S[b.charAt(d)] = d;
                        for (b = b.toLowerCase(), d = 10; d < 16; ++d) S[b.charAt(d)] = d;
                        for (d = 0; d < 8; ++d) S[P.charAt(d)] = -1
                    }
                    var V = [], $ = 0, e0 = 0;
                    for (d = 0; d < I.length; ++d) {
                        var i0 = I.charAt(d);
                        if ("=" == i0) break;
                        if (-1 != (i0 = S[i0])) {
                            if (void 0 === i0) throw new Error("Illegal character at offset " + d);
                            $ |= i0, ++e0 >= 2 ? (V[V.length] = $, $ = 0, e0 = 0) : $ <<= 4
                        }
                    }
                    if (e0) throw new Error("Hex encoding incomplete: 4 bits missing");
                    return V
                }(b) : g.unarmor(b), e0 = E0.decode($);
                if (3 === e0.sub.length && (e0 = e0.sub[2].sub[0]), 9 === e0.sub.length) {
                    P = e0.sub[1].getHexStringValue(), this.n = O0(P, 16), V = e0.sub[2].getHexStringValue(), this.e = parseInt(V, 16);
                    var i0 = e0.sub[3].getHexStringValue();
                    this.d = O0(i0, 16);
                    var f0 = e0.sub[4].getHexStringValue();
                    this.p = O0(f0, 16);
                    var P0 = e0.sub[5].getHexStringValue();
                    this.q = O0(P0, 16);
                    var j0 = e0.sub[6].getHexStringValue();
                    this.dmp1 = O0(j0, 16);
                    var a1 = e0.sub[7].getHexStringValue();
                    this.dmq1 = O0(a1, 16);
                    var f1 = e0.sub[8].getHexStringValue();
                    this.coeff = O0(f1, 16)
                } else {
                    if (2 !== e0.sub.length) return !1;
                    var s1 = e0.sub[1].sub[0];
                    P = s1.sub[0].getHexStringValue(), this.n = O0(P, 16), V = s1.sub[1].getHexStringValue(), this.e = parseInt(V, 16)
                }
                return !0
            } catch {
                return !1
            }
        }, d.prototype.getPrivateBaseKey = function () {
            var b = {array: [new g0.asn1.DERInteger({int: 0}), new g0.asn1.DERInteger({bigint: this.n}), new g0.asn1.DERInteger({int: this.e}), new g0.asn1.DERInteger({bigint: this.d}), new g0.asn1.DERInteger({bigint: this.p}), new g0.asn1.DERInteger({bigint: this.q}), new g0.asn1.DERInteger({bigint: this.dmp1}), new g0.asn1.DERInteger({bigint: this.dmq1}), new g0.asn1.DERInteger({bigint: this.coeff})]};
            return new g0.asn1.DERSequence(b).getEncodedHex()
        }, d.prototype.getPrivateBaseKeyB64 = function () {
            return W(this.getPrivateBaseKey())
        }, d.prototype.getPublicBaseKey = function () {
            var b = new g0.asn1.DERSequence({array: [new g0.asn1.DERObjectIdentifier({oid: "1.2.840.113549.1.1.1"}), new g0.asn1.DERNull]}),
                P = new g0.asn1.DERSequence({array: [new g0.asn1.DERInteger({bigint: this.n}), new g0.asn1.DERInteger({int: this.e})]}),
                V = new g0.asn1.DERBitString({hex: "00" + P.getEncodedHex()});
            return new g0.asn1.DERSequence({array: [b, V]}).getEncodedHex()
        }, d.prototype.getPublicBaseKeyB64 = function () {
            return W(this.getPublicBaseKey())
        }, d.wordwrap = function (b, P) {
            if (!b) return b;
            var V = "(.{1," + (P = P || 64) + "})( +|$\n?)|(.{1," + P + "})";
            return b.match(RegExp(V, "g")).join("\n")
        }, d.prototype.getPrivateKey = function () {
            var b = "-----BEGIN RSA PRIVATE KEY-----\n";
            return (b += d.wordwrap(this.getPrivateBaseKeyB64()) + "\n") + "-----END RSA PRIVATE KEY-----"
        }, d.prototype.getPublicKey = function () {
            var b = "-----BEGIN PUBLIC KEY-----\n";
            return (b += d.wordwrap(this.getPublicBaseKeyB64()) + "\n") + "-----END PUBLIC KEY-----"
        }, d.hasPublicKeyProperty = function (b) {
            return (b = b || {}).hasOwnProperty("n") && b.hasOwnProperty("e")
        }, d.hasPrivateKeyProperty = function (b) {
            return (b = b || {}).hasOwnProperty("n") && b.hasOwnProperty("e") && b.hasOwnProperty("d") && b.hasOwnProperty("p") && b.hasOwnProperty("q") && b.hasOwnProperty("dmp1") && b.hasOwnProperty("dmq1") && b.hasOwnProperty("coeff")
        }, d.prototype.parsePropertiesFrom = function (b) {
            this.n = b.n, this.e = b.e, b.hasOwnProperty("d") && (this.d = b.d, this.p = b.p, this.q = b.q, this.dmp1 = b.dmp1, this.dmq1 = b.dmq1, this.coeff = b.coeff)
        }, d
    }(H1), e1 = function () {
        function I(d) {
            d = d || {}, this.default_key_size = parseInt(d.default_key_size, 10) || 1024, this.default_public_exponent = d.default_public_exponent || "010001", this.log = d.log || !1, this.key = null
        }

        return I.prototype.setKey = function (d) {
            this.log && this.key && console.warn("A key was already set, overriding existing."), this.key = new p1(d)
        }, I.prototype.setPrivateKey = function (d) {
            this.setKey(d)
        }, I.prototype.setPublicKey = function (d) {
            this.setKey(d)
        }, I.prototype.decrypt = function (d) {
            try {
                return this.getKey().decrypt(function (b) {
                    var P, V = "", $ = 0, e0 = 0;
                    for (P = 0; P < b.length && "=" != b.charAt(P); ++P) {
                        var i0 = k.indexOf(b.charAt(P));
                        i0 < 0 || (0 == $ ? (V += a(i0 >> 2), e0 = 3 & i0, $ = 1) : 1 == $ ? (V += a(e0 << 2 | i0 >> 4), e0 = 15 & i0, $ = 2) : 2 == $ ? (V += a(e0), V += a(i0 >> 2), e0 = 3 & i0, $ = 3) : (V += a(e0 << 2 | i0 >> 4), V += a(15 & i0), $ = 0))
                    }
                    return 1 == $ && (V += a(e0 << 2)), V
                }(d))
            } catch {
                return !1
            }
        }, I.prototype.encrypt = function (d) {
            try {
                return W(this.getKey().encrypt(d))
            } catch {
                return !1
            }
        }, I.prototype.getKey = function (d) {
            if (!this.key) {
                if (this.key = new p1, d && "[object Function]" === {}.toString.call(d)) return void this.key.generateAsync(this.default_key_size, this.default_public_exponent, d);
                this.key.generate(this.default_key_size, this.default_public_exponent)
            }
            return this.key
        }, I.prototype.getPrivateKey = function () {
            return this.getKey().getPrivateKey()
        }, I.prototype.getPrivateKeyB64 = function () {
            return this.getKey().getPrivateBaseKeyB64()
        }, I.prototype.getPublicKey = function () {
            return this.getKey().getPublicKey()
        }, I.prototype.getPublicKeyB64 = function () {
            return this.getKey().getPublicBaseKeyB64()
        }, I.version = "3.0.0-beta.1", I
    }();
    window.JSEncrypt = e1, e.JSEncrypt = e1, e.default = e1, Object.defineProperty(e, "__esModule", {value: !0})
}), typeof navigator < "u" && function (e, r) {
    "function" == typeof define && define.amd ? define(function () {
        return r(e)
    }) : "object" == typeof module && module.exports ? module.exports = r(e) : (e.lottie = r(e), e.bodymovin = e.lottie)
}(window || {}, function (window) {
    var svgNS = "http://www.w3.org/2000/svg", locationHref = "", initialDefaultFrame = -999999, subframeEnabled = !0,
        expressionsPlugin, isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent), cachedColors = {},
        bm_rounder = Math.round, bm_rnd, bm_pow = Math.pow, bm_sqrt = Math.sqrt, bm_abs = Math.abs,
        bm_floor = Math.floor, bm_max = Math.max, bm_min = Math.min, blitter = 10, BMMath = {};

    function ProjectInterface() {
        return {}
    }

    (function () {
        var e,
            r = ["abs", "acos", "acosh", "asin", "asinh", "atan", "atanh", "atan2", "ceil", "cbrt", "expm1", "clz32", "cos", "cosh", "exp", "floor", "fround", "hypot", "imul", "log", "log1p", "log2", "log10", "max", "min", "pow", "random", "round", "sign", "sin", "sinh", "sqrt", "tan", "tanh", "trunc", "E", "LN10", "LN2", "LOG10E", "LOG2E", "PI", "SQRT1_2", "SQRT2"],
            a = r.length;
        for (e = 0; e < a; e += 1) BMMath[r[e]] = Math[r[e]]
    })(), BMMath.random = Math.random, BMMath.abs = function (e) {
        if ("object" == typeof e && e.length) {
            var r, a = createSizedArray(e.length), s = e.length;
            for (r = 0; r < s; r += 1) a[r] = Math.abs(e[r]);
            return a
        }
        return Math.abs(e)
    };
    var defaultCurveSegments = 150, degToRads = Math.PI / 180, roundCorner = .5519;

    function roundValues(e) {
        bm_rnd = e ? Math.round : function (r) {
            return r
        }
    }

    function styleDiv(e) {
        e.style.position = "absolute", e.style.top = 0, e.style.left = 0, e.style.display = "block", e.style.transformOrigin = e.style.webkitTransformOrigin = "0 0", e.style.backfaceVisibility = e.style.webkitBackfaceVisibility = "visible", e.style.transformStyle = e.style.webkitTransformStyle = e.style.mozTransformStyle = "preserve-3d"
    }

    function BMEnterFrameEvent(e, r, a, s) {
        this.type = e, this.currentTime = r, this.totalTime = a, this.direction = s < 0 ? -1 : 1
    }

    function BMCompleteEvent(e, r) {
        this.type = e, this.direction = r < 0 ? -1 : 1
    }

    function BMCompleteLoopEvent(e, r, a, s) {
        this.type = e, this.currentLoop = a, this.totalLoops = r, this.direction = s < 0 ? -1 : 1
    }

    function BMSegmentStartEvent(e, r, a) {
        this.type = e, this.firstFrame = r, this.totalFrames = a
    }

    function BMDestroyEvent(e, r) {
        this.type = e, this.target = r
    }

    function BMRenderFrameErrorEvent(e, r) {
        this.type = "renderFrameError", this.nativeError = e, this.currentTime = r
    }

    function BMConfigErrorEvent(e) {
        this.type = "configError", this.nativeError = e
    }

    function BMAnimationConfigErrorEvent(e, r) {
        this.type = e, this.nativeError = r, this.currentTime = currentTime
    }

    roundValues(!1);
    var createElementID = (G = 0, function () {
        return "__lottie_element_" + ++G
    }), G;

    function HSVtoRGB(e, r, a) {
        var s, h, n, m, T, R, k, U;
        switch (R = a * (1 - r), k = a * (1 - (T = 6 * e - (m = Math.floor(6 * e))) * r), U = a * (1 - (1 - T) * r), m % 6) {
            case 0:
                s = a, h = U, n = R;
                break;
            case 1:
                s = k, h = a, n = R;
                break;
            case 2:
                s = R, h = a, n = U;
                break;
            case 3:
                s = R, h = k, n = a;
                break;
            case 4:
                s = U, h = R, n = a;
                break;
            case 5:
                s = a, h = R, n = k
        }
        return [s, h, n]
    }

    function RGBtoHSV(e, r, a) {
        var s, h = Math.max(e, r, a), n = Math.min(e, r, a), m = h - n, T = 0 === h ? 0 : m / h, R = h / 255;
        switch (h) {
            case n:
                s = 0;
                break;
            case e:
                s = r - a + m * (r < a ? 6 : 0), s /= 6 * m;
                break;
            case r:
                s = a - e + 2 * m, s /= 6 * m;
                break;
            case a:
                s = e - r + 4 * m, s /= 6 * m
        }
        return [s, T, R]
    }

    function addSaturationToRGB(e, r) {
        var a = RGBtoHSV(255 * e[0], 255 * e[1], 255 * e[2]);
        return a[1] += r, 1 < a[1] ? a[1] = 1 : a[1] <= 0 && (a[1] = 0), HSVtoRGB(a[0], a[1], a[2])
    }

    function addBrightnessToRGB(e, r) {
        var a = RGBtoHSV(255 * e[0], 255 * e[1], 255 * e[2]);
        return a[2] += r, 1 < a[2] ? a[2] = 1 : a[2] < 0 && (a[2] = 0), HSVtoRGB(a[0], a[1], a[2])
    }

    function addHueToRGB(e, r) {
        var a = RGBtoHSV(255 * e[0], 255 * e[1], 255 * e[2]);
        return a[0] += r / 360, 1 < a[0] ? a[0] -= 1 : a[0] < 0 && (a[0] += 1), HSVtoRGB(a[0], a[1], a[2])
    }

    var rgbToHex = function () {
        var e, r, a = [];
        for (e = 0; e < 256; e += 1) r = e.toString(16), a[e] = 1 == r.length ? "0" + r : r;
        return function (s, h, n) {
            return s < 0 && (s = 0), h < 0 && (h = 0), n < 0 && (n = 0), "#" + a[s] + a[h] + a[n]
        }
    }();

    function BaseEvent() {
    }

    BaseEvent.prototype = {
        triggerEvent: function (e, r) {
            if (this._cbs[e]) for (var a = this._cbs[e].length, s = 0; s < a; s++) this._cbs[e][s](r)
        }, addEventListener: function (e, r) {
            return this._cbs[e] || (this._cbs[e] = []), this._cbs[e].push(r), function () {
                this.removeEventListener(e, r)
            }.bind(this)
        }, removeEventListener: function (e, r) {
            if (r) {
                if (this._cbs[e]) {
                    for (var a = 0, s = this._cbs[e].length; a < s;) this._cbs[e][a] === r && (this._cbs[e].splice(a, 1), a -= 1, s -= 1), a += 1;
                    this._cbs[e].length || (this._cbs[e] = null)
                }
            } else this._cbs[e] = null
        }
    };
    var createTypedArray = "function" == typeof Uint8ClampedArray && "function" == typeof Float32Array ? function (e, r) {
        return "float32" === e ? new Float32Array(r) : "int16" === e ? new Int16Array(r) : "uint8c" === e ? new Uint8ClampedArray(r) : void 0
    } : function (e, r) {
        var a, s = 0, h = [];
        switch (e) {
            case"int16":
            case"uint8c":
                a = 1;
                break;
            default:
                a = 1.1
        }
        for (s = 0; s < r; s += 1) h.push(a);
        return h
    };

    function createSizedArray(e) {
        return Array.apply(null, {length: e})
    }

    function createNS(e) {
        return document.createElementNS(svgNS, e)
    }

    function createTag(e) {
        return document.createElement(e)
    }

    function DynamicPropertyContainer() {
    }

    DynamicPropertyContainer.prototype = {
        addDynamicProperty: function (e) {
            -1 === this.dynamicProperties.indexOf(e) && (this.dynamicProperties.push(e), this.container.addDynamicProperty(this), this._isAnimated = !0)
        }, iterateDynamicProperties: function () {
            this._mdf = !1;
            var e, r = this.dynamicProperties.length;
            for (e = 0; e < r; e += 1) this.dynamicProperties[e].getValue(), this.dynamicProperties[e]._mdf && (this._mdf = !0)
        }, initDynamicPropertyContainer: function (e) {
            this.container = e, this.dynamicProperties = [], this._mdf = !1, this._isAnimated = !1
        }
    };
    var getBlendMode = (Pa = {
        0: "source-over",
        1: "multiply",
        2: "screen",
        3: "overlay",
        4: "darken",
        5: "lighten",
        6: "color-dodge",
        7: "color-burn",
        8: "hard-light",
        9: "soft-light",
        10: "difference",
        11: "exclusion",
        12: "hue",
        13: "saturation",
        14: "color",
        15: "luminosity"
    }, function (e) {
        return Pa[e] || ""
    }), Pa, Matrix = function () {
        var e = Math.cos, r = Math.sin, a = Math.tan, s = Math.round;

        function h() {
            return this.props[0] = 1, this.props[1] = 0, this.props[2] = 0, this.props[3] = 0, this.props[4] = 0, this.props[5] = 1, this.props[6] = 0, this.props[7] = 0, this.props[8] = 0, this.props[9] = 0, this.props[10] = 1, this.props[11] = 0, this.props[12] = 0, this.props[13] = 0, this.props[14] = 0, this.props[15] = 1, this
        }

        function n(y0) {
            if (0 === y0) return this;
            var c0 = e(y0), O0 = r(y0);
            return this._t(c0, -O0, 0, 0, O0, c0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
        }

        function m(y0) {
            if (0 === y0) return this;
            var c0 = e(y0), O0 = r(y0);
            return this._t(1, 0, 0, 0, 0, c0, -O0, 0, 0, O0, c0, 0, 0, 0, 0, 1)
        }

        function T(y0) {
            if (0 === y0) return this;
            var c0 = e(y0), O0 = r(y0);
            return this._t(c0, 0, O0, 0, 0, 1, 0, 0, -O0, 0, c0, 0, 0, 0, 0, 1)
        }

        function R(y0) {
            if (0 === y0) return this;
            var c0 = e(y0), O0 = r(y0);
            return this._t(c0, -O0, 0, 0, O0, c0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
        }

        function k(y0, c0) {
            return this._t(1, c0, y0, 1, 0, 0)
        }

        function U(y0, c0) {
            return this.shear(a(y0), a(c0))
        }

        function W(y0, c0) {
            var O0 = e(c0), Z = r(c0);
            return this._t(O0, Z, 0, 0, -Z, O0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)._t(1, 0, 0, 0, a(y0), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)._t(O0, -Z, 0, 0, Z, O0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
        }

        function S(y0, c0, O0) {
            return O0 || 0 === O0 || (O0 = 1), 1 === y0 && 1 === c0 && 1 === O0 ? this : this._t(y0, 0, 0, 0, 0, c0, 0, 0, 0, 0, O0, 0, 0, 0, 0, 1)
        }

        function L(y0, c0, O0, Z, m0, L0, p0, _0, H0, K0, X0, V0, b1, Y0, Z0, m1) {
            return this.props[0] = y0, this.props[1] = c0, this.props[2] = O0, this.props[3] = Z, this.props[4] = m0, this.props[5] = L0, this.props[6] = p0, this.props[7] = _0, this.props[8] = H0, this.props[9] = K0, this.props[10] = X0, this.props[11] = V0, this.props[12] = b1, this.props[13] = Y0, this.props[14] = Z0, this.props[15] = m1, this
        }

        function M(y0, c0, O0) {
            return O0 = O0 || 0, 0 !== y0 || 0 !== c0 || 0 !== O0 ? this._t(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, y0, c0, O0, 1) : this
        }

        function v(y0, c0, O0, Z, m0, L0, p0, _0, H0, K0, X0, V0, b1, Y0, Z0, m1) {
            var R0 = this.props;
            if (1 === y0 && 0 === c0 && 0 === O0 && 0 === Z && 0 === m0 && 1 === L0 && 0 === p0 && 0 === _0 && 0 === H0 && 0 === K0 && 1 === X0 && 0 === V0) return R0[12] = R0[12] * y0 + R0[15] * b1, R0[13] = R0[13] * L0 + R0[15] * Y0, R0[14] = R0[14] * X0 + R0[15] * Z0, R0[15] = R0[15] * m1, this._identityCalculated = !1, this;
            var q1 = R0[0], D1 = R0[1], H1 = R0[2], n1 = R0[3], g0 = R0[4], p1 = R0[5], e1 = R0[6], I = R0[7],
                d = R0[8], b = R0[9], P = R0[10], V = R0[11], $ = R0[12], e0 = R0[13], i0 = R0[14], f0 = R0[15];
            return R0[0] = q1 * y0 + D1 * m0 + H1 * H0 + n1 * b1, R0[1] = q1 * c0 + D1 * L0 + H1 * K0 + n1 * Y0, R0[2] = q1 * O0 + D1 * p0 + H1 * X0 + n1 * Z0, R0[3] = q1 * Z + D1 * _0 + H1 * V0 + n1 * m1, R0[4] = g0 * y0 + p1 * m0 + e1 * H0 + I * b1, R0[5] = g0 * c0 + p1 * L0 + e1 * K0 + I * Y0, R0[6] = g0 * O0 + p1 * p0 + e1 * X0 + I * Z0, R0[7] = g0 * Z + p1 * _0 + e1 * V0 + I * m1, R0[8] = d * y0 + b * m0 + P * H0 + V * b1, R0[9] = d * c0 + b * L0 + P * K0 + V * Y0, R0[10] = d * O0 + b * p0 + P * X0 + V * Z0, R0[11] = d * Z + b * _0 + P * V0 + V * m1, R0[12] = $ * y0 + e0 * m0 + i0 * H0 + f0 * b1, R0[13] = $ * c0 + e0 * L0 + i0 * K0 + f0 * Y0, R0[14] = $ * O0 + e0 * p0 + i0 * X0 + f0 * Z0, R0[15] = $ * Z + e0 * _0 + i0 * V0 + f0 * m1, this._identityCalculated = !1, this
        }

        function g() {
            return this._identityCalculated || (this._identity = !(1 !== this.props[0] || 0 !== this.props[1] || 0 !== this.props[2] || 0 !== this.props[3] || 0 !== this.props[4] || 1 !== this.props[5] || 0 !== this.props[6] || 0 !== this.props[7] || 0 !== this.props[8] || 0 !== this.props[9] || 1 !== this.props[10] || 0 !== this.props[11] || 0 !== this.props[12] || 0 !== this.props[13] || 0 !== this.props[14] || 1 !== this.props[15]), this._identityCalculated = !0), this._identity
        }

        function x(y0) {
            for (var c0 = 0; c0 < 16;) {
                if (y0.props[c0] !== this.props[c0]) return !1;
                c0 += 1
            }
            return !0
        }

        function Q(y0) {
            var c0;
            for (c0 = 0; c0 < 16; c0 += 1) y0.props[c0] = this.props[c0]
        }

        function t0(y0) {
            var c0;
            for (c0 = 0; c0 < 16; c0 += 1) this.props[c0] = y0[c0]
        }

        function s0(y0, c0, O0) {
            return {
                x: y0 * this.props[0] + c0 * this.props[4] + O0 * this.props[8] + this.props[12],
                y: y0 * this.props[1] + c0 * this.props[5] + O0 * this.props[9] + this.props[13],
                z: y0 * this.props[2] + c0 * this.props[6] + O0 * this.props[10] + this.props[14]
            }
        }

        function M0(y0, c0, O0) {
            return y0 * this.props[0] + c0 * this.props[4] + O0 * this.props[8] + this.props[12]
        }

        function a0(y0, c0, O0) {
            return y0 * this.props[1] + c0 * this.props[5] + O0 * this.props[9] + this.props[13]
        }

        function d0(y0, c0, O0) {
            return y0 * this.props[2] + c0 * this.props[6] + O0 * this.props[10] + this.props[14]
        }

        function A0() {
            var y0 = this.props[0] * this.props[5] - this.props[1] * this.props[4], c0 = this.props[5] / y0,
                O0 = -this.props[1] / y0, Z = -this.props[4] / y0, m0 = this.props[0] / y0,
                L0 = (this.props[4] * this.props[13] - this.props[5] * this.props[12]) / y0,
                p0 = -(this.props[0] * this.props[13] - this.props[1] * this.props[12]) / y0, _0 = new Matrix;
            return _0.props[0] = c0, _0.props[1] = O0, _0.props[4] = Z, _0.props[5] = m0, _0.props[12] = L0, _0.props[13] = p0, _0
        }

        function E0(y0) {
            return this.getInverseMatrix().applyToPointArray(y0[0], y0[1], y0[2] || 0)
        }

        function k0(y0) {
            var c0, O0 = y0.length, Z = [];
            for (c0 = 0; c0 < O0; c0 += 1) Z[c0] = E0(y0[c0]);
            return Z
        }

        function b0(y0, c0, O0) {
            var Z = createTypedArray("float32", 6);
            if (this.isIdentity()) Z[0] = y0[0], Z[1] = y0[1], Z[2] = c0[0], Z[3] = c0[1], Z[4] = O0[0], Z[5] = O0[1]; else {
                var m0 = this.props[0], L0 = this.props[1], p0 = this.props[4], _0 = this.props[5], H0 = this.props[12],
                    K0 = this.props[13];
                Z[0] = y0[0] * m0 + y0[1] * p0 + H0, Z[1] = y0[0] * L0 + y0[1] * _0 + K0, Z[2] = c0[0] * m0 + c0[1] * p0 + H0, Z[3] = c0[0] * L0 + c0[1] * _0 + K0, Z[4] = O0[0] * m0 + O0[1] * p0 + H0, Z[5] = O0[0] * L0 + O0[1] * _0 + K0
            }
            return Z
        }

        function q0(y0, c0, O0) {
            return this.isIdentity() ? [y0, c0, O0] : [y0 * this.props[0] + c0 * this.props[4] + O0 * this.props[8] + this.props[12], y0 * this.props[1] + c0 * this.props[5] + O0 * this.props[9] + this.props[13], y0 * this.props[2] + c0 * this.props[6] + O0 * this.props[10] + this.props[14]]
        }

        function N0(y0, c0) {
            if (this.isIdentity()) return y0 + "," + c0;
            var O0 = this.props;
            return Math.round(100 * (y0 * O0[0] + c0 * O0[4] + O0[12])) / 100 + "," + Math.round(100 * (y0 * O0[1] + c0 * O0[5] + O0[13])) / 100
        }

        function v0() {
            for (var y0 = 0, c0 = this.props, O0 = "matrix3d("; y0 < 16;) O0 += s(1e4 * c0[y0]) / 1e4, O0 += 15 === y0 ? ")" : ",", y0 += 1;
            return O0
        }

        function C0(y0) {
            return y0 < 1e-6 && 0 < y0 || -1e-6 < y0 && y0 < 0 ? s(1e4 * y0) / 1e4 : y0
        }

        function J0() {
            var y0 = this.props;
            return "matrix(" + C0(y0[0]) + "," + C0(y0[1]) + "," + C0(y0[4]) + "," + C0(y0[5]) + "," + C0(y0[12]) + "," + C0(y0[13]) + ")"
        }

        return function () {
            this.reset = h, this.rotate = n, this.rotateX = m, this.rotateY = T, this.rotateZ = R, this.skew = U, this.skewFromAxis = W, this.shear = k, this.scale = S, this.setTransform = L, this.translate = M, this.transform = v, this.applyToPoint = s0, this.applyToX = M0, this.applyToY = a0, this.applyToZ = d0, this.applyToPointArray = q0, this.applyToTriplePoints = b0, this.applyToPointStringified = N0, this.toCSS = v0, this.to2dCSS = J0, this.clone = Q, this.cloneFromProps = t0, this.equals = x, this.inversePoints = k0, this.inversePoint = E0, this.getInverseMatrix = A0, this._t = this.transform, this.isIdentity = g, this._identity = !0, this._identityCalculated = !1, this.props = createTypedArray("float32", 16), this.reset()
        }
    }();
    !function (e, r) {
        var s = this, h = 256, m = "random", T = r.pow(h, 6), R = r.pow(2, 52), k = 2 * R, U = 255;

        function W(v) {
            var g, x = v.length, Q = this, t0 = 0, s0 = Q.i = Q.j = 0, M0 = Q.S = [];
            for (x || (v = [x++]); t0 < h;) M0[t0] = t0++;
            for (t0 = 0; t0 < h; t0++) M0[t0] = M0[s0 = U & s0 + v[t0 % x] + (g = M0[t0])], M0[s0] = g;
            Q.g = function (a0) {
                for (var d0, A0 = 0, E0 = Q.i, k0 = Q.j, b0 = Q.S; a0--;) d0 = b0[E0 = U & E0 + 1], A0 = A0 * h + b0[U & (b0[E0] = b0[k0 = U & k0 + d0]) + (b0[k0] = d0)];
                return Q.i = E0, Q.j = k0, A0
            }
        }

        function S(v, g) {
            return g.i = v.i, g.j = v.j, g.S = v.S.slice(), g
        }

        function L(v, g) {
            for (var x, Q = v + "", t0 = 0; t0 < Q.length;) g[U & t0] = U & (x ^= 19 * g[U & t0]) + Q.charCodeAt(t0++);
            return M(g)
        }

        function M(v) {
            return String.fromCharCode.apply(0, v)
        }

        r["seed" + m] = function (v, g, x) {
            var Q = [], t0 = L(function a0(d0, A0) {
                var E0, k0 = [], b0 = typeof d0;
                if (A0 && "object" == b0) for (E0 in d0) try {
                    k0.push(a0(d0[E0], A0 - 1))
                } catch {
                }
                return k0.length ? k0 : "string" == b0 ? d0 : d0 + "\0"
            }((g = !0 === g ? {entropy: !0} : g || {}).entropy ? [v, M(e)] : null === v ? function () {
                try {
                    var a0 = new Uint8Array(h);
                    return (s.crypto || s.msCrypto).getRandomValues(a0), M(a0)
                } catch {
                    var d0 = s.navigator, A0 = d0 && d0.plugins;
                    return [+new Date, s, A0, s.screen, M(e)]
                }
            }() : v, 3), Q), s0 = new W(Q), M0 = function () {
                for (var a0 = s0.g(6), d0 = T, A0 = 0; a0 < R;) a0 = (a0 + A0) * h, d0 *= h, A0 = s0.g(1);
                for (; k <= a0;) a0 /= 2, d0 /= 2, A0 >>>= 1;
                return (a0 + A0) / d0
            };
            return M0.int32 = function () {
                return 0 | s0.g(4)
            }, M0.quick = function () {
                return s0.g(4) / 4294967296
            }, M0.double = M0, L(M(s0.S), e), (g.pass || x || function (a0, d0, A0, E0) {
                return E0 && (E0.S && S(E0, s0), a0.state = function () {
                    return S(s0, {})
                }), A0 ? (r[m] = a0, d0) : a0
            })(M0, t0, "global" in g ? g.global : this == r, g.state)
        }, L(r.random(), e)
    }([], BMMath);
    var BezierFactory = function () {
        var e = {
            getBezierEasing: function (W, S, L, M, v) {
                var g = v || ("bez_" + W + "_" + S + "_" + L + "_" + M).replace(/\./g, "p");
                if (r[g]) return r[g];
                var x = new U([W, S, L, M]);
                return r[g] = x
            }
        }, r = {}, a = 11, s = 1 / (a - 1), h = "function" == typeof Float32Array;

        function n(W, S) {
            return 1 - 3 * S + 3 * W
        }

        function m(W, S) {
            return 3 * S - 6 * W
        }

        function T(W) {
            return 3 * W
        }

        function R(W, S, L) {
            return ((n(S, L) * W + m(S, L)) * W + T(S)) * W
        }

        function k(W, S, L) {
            return 3 * n(S, L) * W * W + 2 * m(S, L) * W + T(S)
        }

        function U(W) {
            this._p = W, this._mSampleValues = h ? new Float32Array(a) : new Array(a), this._precomputed = !1, this.get = this.get.bind(this)
        }

        return U.prototype = {
            get: function (W) {
                var S = this._p[0], L = this._p[1], M = this._p[2], v = this._p[3];
                return this._precomputed || this._precompute(), S === L && M === v ? W : 0 === W ? 0 : 1 === W ? 1 : R(this._getTForX(W), L, v)
            }, _precompute: function () {
                var W = this._p[0], S = this._p[1], L = this._p[2], M = this._p[3];
                this._precomputed = !0, W === S && L === M || this._calcSampleValues()
            }, _calcSampleValues: function () {
                for (var W = this._p[0], S = this._p[2], L = 0; L < a; ++L) this._mSampleValues[L] = R(L * s, W, S)
            }, _getTForX: function (W) {
                for (var S = this._p[0], L = this._p[2], M = this._mSampleValues, v = 0, g = 1, x = a - 1; g !== x && M[g] <= W; ++g) v += s;
                var Q = v + (W - M[--g]) / (M[g + 1] - M[g]) * s, t0 = k(Q, S, L);
                return .001 <= t0 ? function (s0, M0, a0, d0) {
                    for (var A0 = 0; A0 < 4; ++A0) {
                        var E0 = k(M0, a0, d0);
                        if (0 === E0) return M0;
                        M0 -= (R(M0, a0, d0) - s0) / E0
                    }
                    return M0
                }(W, Q, S, L) : 0 === t0 ? Q : function (s0, M0, a0, d0, A0) {
                    for (var E0, k0, b0 = 0; 0 < (E0 = R(k0 = M0 + (a0 - M0) / 2, d0, A0) - s0) ? a0 = k0 : M0 = k0, 1e-7 < Math.abs(E0) && ++b0 < 10;) ;
                    return k0
                }(W, v, v + s, S, L)
            }
        }, e
    }();

    function extendPrototype(e, r) {
        var a, s, h = e.length;
        for (a = 0; a < h; a += 1) for (var n in s = e[a].prototype) s.hasOwnProperty(n) && (r.prototype[n] = s[n])
    }

    function getDescriptor(e, r) {
        return Object.getOwnPropertyDescriptor(e, r)
    }

    function createProxyFunction(e) {
        function r() {
        }

        return r.prototype = e, r
    }

    function bezFunction() {
        function e(R, k, U, W, S, L) {
            var M = R * W + k * S + U * L - S * W - L * R - U * k;
            return -.001 < M && M < .001
        }

        var r = function (R, k, U, W) {
            var S, L, M, v, g, x, Q = defaultCurveSegments, t0 = 0, s0 = [], M0 = [],
                a0 = bezier_length_pool.newElement();
            for (M = U.length, S = 0; S < Q; S += 1) {
                for (g = S / (Q - 1), L = x = 0; L < M; L += 1) v = bm_pow(1 - g, 3) * R[L] + 3 * bm_pow(1 - g, 2) * g * U[L] + 3 * (1 - g) * bm_pow(g, 2) * W[L] + bm_pow(g, 3) * k[L], s0[L] = v, null !== M0[L] && (x += bm_pow(s0[L] - M0[L], 2)), M0[L] = s0[L];
                x && (t0 += x = bm_sqrt(x)), a0.percents[S] = g, a0.lengths[S] = t0
            }
            return a0.addedLength = t0, a0
        };

        function a(R) {
            this.segmentLength = 0, this.points = new Array(R)
        }

        function s(R, k) {
            this.partialLength = R, this.point = k
        }

        var h, n = (h = {}, function (R, k, U, W) {
            var S = (R[0] + "_" + R[1] + "_" + k[0] + "_" + k[1] + "_" + U[0] + "_" + U[1] + "_" + W[0] + "_" + W[1]).replace(/\./g, "p");
            if (!h[S]) {
                var L, M, v, g, x, Q, t0, s0 = defaultCurveSegments, M0 = 0, a0 = null;
                2 === R.length && (R[0] != k[0] || R[1] != k[1]) && e(R[0], R[1], k[0], k[1], R[0] + U[0], R[1] + U[1]) && e(R[0], R[1], k[0], k[1], k[0] + W[0], k[1] + W[1]) && (s0 = 2);
                var d0 = new a(s0);
                for (v = U.length, L = 0; L < s0; L += 1) {
                    for (t0 = createSizedArray(v), x = L / (s0 - 1), M = Q = 0; M < v; M += 1) g = bm_pow(1 - x, 3) * R[M] + 3 * bm_pow(1 - x, 2) * x * (R[M] + U[M]) + 3 * (1 - x) * bm_pow(x, 2) * (k[M] + W[M]) + bm_pow(x, 3) * k[M], t0[M] = g, null !== a0 && (Q += bm_pow(t0[M] - a0[M], 2));
                    M0 += Q = bm_sqrt(Q), d0.points[L] = new s(Q, t0), a0 = t0
                }
                d0.segmentLength = M0, h[S] = d0
            }
            return h[S]
        });

        function m(R, k) {
            var U = k.percents, W = k.lengths, S = U.length, L = bm_floor((S - 1) * R), M = R * k.addedLength, v = 0;
            if (L === S - 1 || 0 === L || M === W[L]) return U[L];
            for (var g = W[L] > M ? -1 : 1, x = !0; x;) if (W[L] <= M && W[L + 1] > M ? (v = (M - W[L]) / (W[L + 1] - W[L]), x = !1) : L += g, L < 0 || S - 1 <= L) {
                if (L === S - 1) return U[L];
                x = !1
            }
            return U[L] + (U[L + 1] - U[L]) * v
        }

        var T = createTypedArray("float32", 8);
        return {
            getSegmentsLength: function (R) {
                var k, U = segments_length_pool.newElement(), W = R.c, S = R.v, L = R.o, M = R.i, v = R._length,
                    g = U.lengths, x = 0;
                for (k = 0; k < v - 1; k += 1) g[k] = r(S[k], S[k + 1], L[k], M[k + 1]), x += g[k].addedLength;
                return W && v && (g[k] = r(S[k], S[0], L[k], M[0]), x += g[k].addedLength), U.totalLength = x, U
            }, getNewSegment: function (R, k, U, W, S, L, M) {
                var v, g = m(S = S < 0 ? 0 : 1 < S ? 1 : S, M), x = m(L = 1 < L ? 1 : L, M), Q = R.length, t0 = 1 - g,
                    s0 = 1 - x, M0 = t0 * t0 * t0, a0 = g * t0 * t0 * 3, d0 = g * g * t0 * 3, A0 = g * g * g,
                    E0 = t0 * t0 * s0, k0 = g * t0 * s0 + t0 * g * s0 + t0 * t0 * x,
                    b0 = g * g * s0 + t0 * g * x + g * t0 * x, q0 = g * g * x, N0 = t0 * s0 * s0,
                    v0 = g * s0 * s0 + t0 * x * s0 + t0 * s0 * x, C0 = g * x * s0 + t0 * x * x + g * s0 * x,
                    J0 = g * x * x, y0 = s0 * s0 * s0, c0 = x * s0 * s0 + s0 * x * s0 + s0 * s0 * x,
                    O0 = x * x * s0 + s0 * x * x + x * s0 * x, Z = x * x * x;
                for (v = 0; v < Q; v += 1) T[4 * v] = Math.round(1e3 * (M0 * R[v] + a0 * U[v] + d0 * W[v] + A0 * k[v])) / 1e3, T[4 * v + 1] = Math.round(1e3 * (E0 * R[v] + k0 * U[v] + b0 * W[v] + q0 * k[v])) / 1e3, T[4 * v + 2] = Math.round(1e3 * (N0 * R[v] + v0 * U[v] + C0 * W[v] + J0 * k[v])) / 1e3, T[4 * v + 3] = Math.round(1e3 * (y0 * R[v] + c0 * U[v] + O0 * W[v] + Z * k[v])) / 1e3;
                return T
            }, getPointInSegment: function (R, k, U, W, S, L) {
                var M = m(S, L), v = 1 - M;
                return [Math.round(1e3 * (v * v * v * R[0] + (M * v * v + v * M * v + v * v * M) * U[0] + (M * M * v + v * M * M + M * v * M) * W[0] + M * M * M * k[0])) / 1e3, Math.round(1e3 * (v * v * v * R[1] + (M * v * v + v * M * v + v * v * M) * U[1] + (M * M * v + v * M * M + M * v * M) * W[1] + M * M * M * k[1])) / 1e3]
            }, buildBezierData: n, pointOnLine2D: e, pointOnLine3D: function (R, k, U, W, S, L, M, v, g) {
                if (0 === U && 0 === L && 0 === g) return e(R, k, W, S, M, v);
                var x, Q = Math.sqrt(Math.pow(W - R, 2) + Math.pow(S - k, 2) + Math.pow(L - U, 2)),
                    t0 = Math.sqrt(Math.pow(M - R, 2) + Math.pow(v - k, 2) + Math.pow(g - U, 2)),
                    s0 = Math.sqrt(Math.pow(M - W, 2) + Math.pow(v - S, 2) + Math.pow(g - L, 2));
                return -1e-4 < (x = t0 < Q ? s0 < Q ? Q - t0 - s0 : s0 - t0 - Q : t0 < s0 ? s0 - t0 - Q : t0 - Q - s0) && x < 1e-4
            }
        }
    }

    !function () {
        for (var e = 0, r = ["ms", "moz", "webkit", "o"], a = 0; a < r.length && !window.requestAnimationFrame; ++a) window.requestAnimationFrame = window[r[a] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[r[a] + "CancelAnimationFrame"] || window[r[a] + "CancelRequestAnimationFrame"];
        window.requestAnimationFrame || (window.requestAnimationFrame = function (s, h) {
            var n = (new Date).getTime(), m = Math.max(0, 16 - (n - e)), T = setTimeout(function () {
                s(n + m)
            }, m);
            return e = n + m, T
        }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function (s) {
            clearTimeout(s)
        })
    }();
    var bez = bezFunction();

    function dataFunctionManager() {
        function e(S, L, M) {
            var v, g, x, Q, t0, s0, M0 = S.length;
            for (g = 0; g < M0; g += 1) if ("ks" in (v = S[g]) && !v.completed) {
                if (v.completed = !0, v.tt && (S[g - 1].td = v.tt), v.hasMask) {
                    var a0 = v.masksProperties;
                    for (Q = a0.length, x = 0; x < Q; x += 1) if (a0[x].pt.k.i) s(a0[x].pt.k); else for (s0 = a0[x].pt.k.length, t0 = 0; t0 < s0; t0 += 1) a0[x].pt.k[t0].s && s(a0[x].pt.k[t0].s[0]), a0[x].pt.k[t0].e && s(a0[x].pt.k[t0].e[0])
                }
                0 === v.ty ? (v.layers = r(v.refId, L), e(v.layers, L, M)) : 4 === v.ty ? a(v.shapes) : 5 == v.ty && U(v)
            }
        }

        function r(S, L) {
            for (var M = 0, v = L.length; M < v;) {
                if (L[M].id === S) return L[M].layers.__used ? JSON.parse(JSON.stringify(L[M].layers)) : (L[M].layers.__used = !0, L[M].layers);
                M += 1
            }
        }

        function a(S) {
            var L, M, v;
            for (L = S.length - 1; 0 <= L; L -= 1) if ("sh" == S[L].ty) if (S[L].ks.k.i) s(S[L].ks.k); else for (v = S[L].ks.k.length, M = 0; M < v; M += 1) S[L].ks.k[M].s && s(S[L].ks.k[M].s[0]), S[L].ks.k[M].e && s(S[L].ks.k[M].e[0]); else "gr" == S[L].ty && a(S[L].it)
        }

        function s(S) {
            var L, M = S.i.length;
            for (L = 0; L < M; L += 1) S.i[L][0] += S.v[L][0], S.i[L][1] += S.v[L][1], S.o[L][0] += S.v[L][0], S.o[L][1] += S.v[L][1]
        }

        function h(S, L) {
            var M = L ? L.split(".") : [100, 100, 100];
            return S[0] > M[0] || !(M[0] > S[0]) && (S[1] > M[1] || !(M[1] > S[1]) && (S[2] > M[2] || !(M[2] > S[2]) && void 0))
        }

        var n, m = function () {
            var S = [4, 4, 14];

            function L(M) {
                var v, g, Q = M.length;
                for (v = 0; v < Q; v += 1) 5 === M[v].ty && ((g = M[v]).t.d = {k: [{s: g.t.d, t: 0}]})
            }

            return function (M) {
                if (h(S, M.v) && (L(M.layers), M.assets)) {
                    var v, g = M.assets.length;
                    for (v = 0; v < g; v += 1) M.assets[v].layers && L(M.assets[v].layers)
                }
            }
        }(), T = (n = [4, 7, 99], function (S) {
            if (S.chars && !h(n, S.v)) {
                var L, M, v, g, x, Q = S.chars.length;
                for (L = 0; L < Q; L += 1) if (S.chars[L].data && S.chars[L].data.shapes) for (v = (x = S.chars[L].data.shapes[0].it).length, M = 0; M < v; M += 1) (g = x[M].ks.k).__converted || (s(x[M].ks.k), g.__converted = !0)
            }
        }), R = function () {
            var S = [4, 1, 9];

            function L(v) {
                var g, x, Q, t0 = v.length;
                for (g = 0; g < t0; g += 1) if ("gr" === v[g].ty) L(v[g].it); else if ("fl" === v[g].ty || "st" === v[g].ty) if (v[g].c.k && v[g].c.k[0].i) for (Q = v[g].c.k.length, x = 0; x < Q; x += 1) v[g].c.k[x].s && (v[g].c.k[x].s[0] /= 255, v[g].c.k[x].s[1] /= 255, v[g].c.k[x].s[2] /= 255, v[g].c.k[x].s[3] /= 255), v[g].c.k[x].e && (v[g].c.k[x].e[0] /= 255, v[g].c.k[x].e[1] /= 255, v[g].c.k[x].e[2] /= 255, v[g].c.k[x].e[3] /= 255); else v[g].c.k[0] /= 255, v[g].c.k[1] /= 255, v[g].c.k[2] /= 255, v[g].c.k[3] /= 255
            }

            function M(v) {
                var g, x = v.length;
                for (g = 0; g < x; g += 1) 4 === v[g].ty && L(v[g].shapes)
            }

            return function (v) {
                if (h(S, v.v) && (M(v.layers), v.assets)) {
                    var g, x = v.assets.length;
                    for (g = 0; g < x; g += 1) v.assets[g].layers && M(v.assets[g].layers)
                }
            }
        }(), k = function () {
            var S = [4, 4, 18];

            function L(v) {
                var g, x, Q;
                for (g = v.length - 1; 0 <= g; g -= 1) if ("sh" == v[g].ty) if (v[g].ks.k.i) v[g].ks.k.c = v[g].closed; else for (Q = v[g].ks.k.length, x = 0; x < Q; x += 1) v[g].ks.k[x].s && (v[g].ks.k[x].s[0].c = v[g].closed), v[g].ks.k[x].e && (v[g].ks.k[x].e[0].c = v[g].closed); else "gr" == v[g].ty && L(v[g].it)
            }

            function M(v) {
                var g, x, Q, t0, s0, M0, a0 = v.length;
                for (x = 0; x < a0; x += 1) {
                    if ((g = v[x]).hasMask) {
                        var d0 = g.masksProperties;
                        for (t0 = d0.length, Q = 0; Q < t0; Q += 1) if (d0[Q].pt.k.i) d0[Q].pt.k.c = d0[Q].cl; else for (M0 = d0[Q].pt.k.length, s0 = 0; s0 < M0; s0 += 1) d0[Q].pt.k[s0].s && (d0[Q].pt.k[s0].s[0].c = d0[Q].cl), d0[Q].pt.k[s0].e && (d0[Q].pt.k[s0].e[0].c = d0[Q].cl)
                    }
                    4 === g.ty && L(g.shapes)
                }
            }

            return function (v) {
                if (h(S, v.v) && (M(v.layers), v.assets)) {
                    var g, x = v.assets.length;
                    for (g = 0; g < x; g += 1) v.assets[g].layers && M(v.assets[g].layers)
                }
            }
        }();

        function U(S, L) {
            0 !== S.t.a.length || "m" in S.t.p || (S.singleShape = !0)
        }

        var W = {
            completeData: function (S, L) {
                S.__complete || (R(S), m(S), T(S), k(S), e(S.layers, S.assets, L), S.__complete = !0)
            }
        };
        return W.checkColors = R, W.checkChars = T, W.checkShapes = k, W.completeLayers = e, W
    }

    var dataManager = dataFunctionManager(), FontManager = function () {
        var e = {w: 0, size: 0, shapes: []}, r = [];

        function a(h, n) {
            var m = createTag("span");
            m.style.fontFamily = n;
            var T = createTag("span");
            T.innerHTML = "giItT1WQy@!-/#", m.style.position = "absolute", m.style.left = "-10000px", m.style.top = "-10000px", m.style.fontSize = "300px", m.style.fontVariant = "normal", m.style.fontStyle = "normal", m.style.fontWeight = "normal", m.style.letterSpacing = "0", m.appendChild(T), document.body.appendChild(m);
            var R = T.offsetWidth;
            return T.style.fontFamily = h + ", " + n, {node: T, w: R, parent: m}
        }

        r = r.concat([2304, 2305, 2306, 2307, 2362, 2363, 2364, 2364, 2366, 2367, 2368, 2369, 2370, 2371, 2372, 2373, 2374, 2375, 2376, 2377, 2378, 2379, 2380, 2381, 2382, 2383, 2387, 2388, 2389, 2390, 2391, 2402, 2403]);
        var s = function () {
            this.fonts = [], this.chars = null, this.typekitLoaded = 0, this.isLoaded = !1, this.initTime = Date.now()
        };
        return s.getCombinedCharacterCodes = function () {
            return r
        }, s.prototype.addChars = function (h) {
            if (h) {
                this.chars || (this.chars = []);
                var n, m, T, R = h.length, k = this.chars.length;
                for (n = 0; n < R; n += 1) {
                    for (m = 0, T = !1; m < k;) this.chars[m].style === h[n].style && this.chars[m].fFamily === h[n].fFamily && this.chars[m].ch === h[n].ch && (T = !0), m += 1;
                    T || (this.chars.push(h[n]), k += 1)
                }
            }
        }, s.prototype.addFonts = function (h, n) {
            if (h) {
                if (this.chars) return this.isLoaded = !0, void (this.fonts = h.list);
                var m, T, R, k, U = h.list, W = U.length, S = W;
                for (m = 0; m < W; m += 1) {
                    var L, M, v = !0;
                    if (U[m].loaded = !1, U[m].monoCase = a(U[m].fFamily, "monospace"), U[m].sansCase = a(U[m].fFamily, "sans-serif"), U[m].fPath) {
                        if ("p" === U[m].fOrigin || 3 === U[m].origin) {
                            if (0 < (L = document.querySelectorAll('style[f-forigin="p"][f-family="' + U[m].fFamily + '"], style[f-origin="3"][f-family="' + U[m].fFamily + '"]')).length && (v = !1), v) {
                                var g = createTag("style");
                                g.setAttribute("f-forigin", U[m].fOrigin), g.setAttribute("f-origin", U[m].origin), g.setAttribute("f-family", U[m].fFamily), g.type = "text/css", g.innerHTML = "@font-face {font-family: " + U[m].fFamily + "; font-style: normal; src: url('" + U[m].fPath + "');}", n.appendChild(g)
                            }
                        } else if ("g" === U[m].fOrigin || 1 === U[m].origin) {
                            for (L = document.querySelectorAll('link[f-forigin="g"], link[f-origin="1"]'), M = 0; M < L.length; M++) -1 !== L[M].href.indexOf(U[m].fPath) && (v = !1);
                            if (v) {
                                var x = createTag("link");
                                x.setAttribute("f-forigin", U[m].fOrigin), x.setAttribute("f-origin", U[m].origin), x.type = "text/css", x.rel = "stylesheet", x.href = U[m].fPath, document.body.appendChild(x)
                            }
                        } else if ("t" === U[m].fOrigin || 2 === U[m].origin) {
                            for (L = document.querySelectorAll('script[f-forigin="t"], script[f-origin="2"]'), M = 0; M < L.length; M++) U[m].fPath === L[M].src && (v = !1);
                            if (v) {
                                var Q = createTag("link");
                                Q.setAttribute("f-forigin", U[m].fOrigin), Q.setAttribute("f-origin", U[m].origin), Q.setAttribute("rel", "stylesheet"), Q.setAttribute("href", U[m].fPath), n.appendChild(Q)
                            }
                        }
                    } else U[m].loaded = !0, S -= 1;
                    U[m].helper = (T = n, R = U[m], k = void 0, (k = createNS("text")).style.fontSize = "100px", k.setAttribute("font-family", R.fFamily), k.setAttribute("font-style", R.fStyle), k.setAttribute("font-weight", R.fWeight), k.textContent = "1", R.fClass ? (k.style.fontFamily = "inherit", k.setAttribute("class", R.fClass)) : k.style.fontFamily = R.fFamily, T.appendChild(k), createTag("canvas").getContext("2d").font = R.fWeight + " " + R.fStyle + " 100px " + R.fFamily, k), U[m].cache = {}, this.fonts.push(U[m])
                }
                0 === S ? this.isLoaded = !0 : setTimeout(this.checkLoadedFonts.bind(this), 100)
            } else this.isLoaded = !0
        }, s.prototype.getCharData = function (h, n, m) {
            for (var T = 0, R = this.chars.length; T < R;) {
                if (this.chars[T].ch === h && this.chars[T].style === n && this.chars[T].fFamily === m) return this.chars[T];
                T += 1
            }
            return ("string" == typeof h && 13 !== h.charCodeAt(0) || !h) && console && console.warn && console.warn("Missing character from exported characters list: ", h, n, m), e
        }, s.prototype.getFontByName = function (h) {
            for (var n = 0, m = this.fonts.length; n < m;) {
                if (this.fonts[n].fName === h) return this.fonts[n];
                n += 1
            }
            return this.fonts[0]
        }, s.prototype.measureText = function (h, n, m) {
            var T = this.getFontByName(n), R = h.charCodeAt(0);
            if (!T.cache[R + 1]) {
                var k = T.helper;
                if (" " === h) {
                    k.textContent = "|" + h + "|";
                    var U = k.getComputedTextLength();
                    k.textContent = "||";
                    var W = k.getComputedTextLength();
                    T.cache[R + 1] = (U - W) / 100
                } else k.textContent = h, T.cache[R + 1] = k.getComputedTextLength() / 100
            }
            return T.cache[R + 1] * m
        }, s.prototype.checkLoadedFonts = function () {
            var h, T = this.fonts.length, R = T;
            for (h = 0; h < T; h += 1) this.fonts[h].loaded ? R -= 1 : "n" === this.fonts[h].fOrigin || 0 === this.fonts[h].origin ? this.fonts[h].loaded = !0 : ((this.fonts[h].monoCase.node.offsetWidth !== this.fonts[h].monoCase.w || this.fonts[h].sansCase.node.offsetWidth !== this.fonts[h].sansCase.w) && (R -= 1, this.fonts[h].loaded = !0), this.fonts[h].loaded && (this.fonts[h].sansCase.parent.parentNode.removeChild(this.fonts[h].sansCase.parent), this.fonts[h].monoCase.parent.parentNode.removeChild(this.fonts[h].monoCase.parent)));
            0 !== R && Date.now() - this.initTime < 5e3 ? setTimeout(this.checkLoadedFonts.bind(this), 20) : setTimeout(function () {
                this.isLoaded = !0
            }.bind(this), 0)
        }, s.prototype.loaded = function () {
            return this.isLoaded
        }, s
    }(), PropertyFactory = function () {
        var e = initialDefaultFrame, r = Math.abs;

        function a(S, L) {
            var M, v = this.offsetTime;
            "multidimensional" === this.propType && (M = createTypedArray("float32", this.pv.length));
            for (var g, x, Q, t0, s0, M0, a0, d0, A0 = L.lastIndex, E0 = A0, k0 = this.keyframes.length - 1, b0 = !0; b0;) {
                if (g = this.keyframes[E0], x = this.keyframes[E0 + 1], E0 === k0 - 1 && S >= x.t - v) {
                    g.h && (g = x), A0 = 0;
                    break
                }
                if (x.t - v > S) {
                    A0 = E0;
                    break
                }
                E0 < k0 - 1 ? E0 += 1 : (A0 = 0, b0 = !1)
            }
            var q0, N0, v0, C0, J0, y0, c0, O0, Z, m0, H1, n1, g0, p1, e1, I, d, b, P, V, $, e0, i0, f0, P0, j0, a1,
                L0 = x.t - v, p0 = g.t - v;
            if (g.to) {
                g.bezierData || (g.bezierData = bez.buildBezierData(g.s, x.s || g.e, g.to, g.ti));
                var _0 = g.bezierData;
                if (L0 <= S || S < p0) {
                    var H0 = L0 <= S ? _0.points.length - 1 : 0;
                    for (t0 = _0.points[H0].point.length, Q = 0; Q < t0; Q += 1) M[Q] = _0.points[H0].point[Q]
                } else {
                    g.__fnct ? d0 = g.__fnct : (d0 = BezierFactory.getBezierEasing(g.o.x, g.o.y, g.i.x, g.i.y, g.n).get, g.__fnct = d0), s0 = d0((S - p0) / (L0 - p0));
                    var K0, X0 = _0.segmentLength * s0,
                        V0 = L.lastFrame < S && L._lastKeyframeIndex === E0 ? L._lastAddedLength : 0;
                    for (a0 = L.lastFrame < S && L._lastKeyframeIndex === E0 ? L._lastPoint : 0, b0 = !0, M0 = _0.points.length; b0;) {
                        if (V0 += _0.points[a0].partialLength, 0 === X0 || 0 === s0 || a0 === _0.points.length - 1) {
                            for (t0 = _0.points[a0].point.length, Q = 0; Q < t0; Q += 1) M[Q] = _0.points[a0].point[Q];
                            break
                        }
                        if (V0 <= X0 && X0 < V0 + _0.points[a0 + 1].partialLength) {
                            for (K0 = (X0 - V0) / _0.points[a0 + 1].partialLength, t0 = _0.points[a0].point.length, Q = 0; Q < t0; Q += 1) M[Q] = _0.points[a0].point[Q] + (_0.points[a0 + 1].point[Q] - _0.points[a0].point[Q]) * K0;
                            break
                        }
                        a0 < M0 - 1 ? a0 += 1 : b0 = !1
                    }
                    L._lastPoint = a0, L._lastAddedLength = V0 - _0.points[a0].partialLength, L._lastKeyframeIndex = E0
                }
            } else {
                var R0;
                if (k0 = g.s.length, q0 = x.s || g.e, this.sh && 1 !== g.h) if (L0 <= S) M[0] = q0[0], M[1] = q0[1], M[2] = q0[2]; else if (S <= p0) M[0] = g.s[0], M[1] = g.s[1], M[2] = g.s[2]; else {
                    var q1 = s(g.s), D1 = s(q0);
                    N0 = M, g0 = (S - p0) / (L0 - p0), P = [], (e1 = (V = (H1 = q1)[0]) * (f0 = (n1 = D1)[0]) + ($ = H1[1]) * (P0 = n1[1]) + (e0 = H1[2]) * (j0 = n1[2]) + (i0 = H1[3]) * (a1 = n1[3])) < 0 && (e1 = -e1, f0 = -f0, P0 = -P0, j0 = -j0, a1 = -a1), b = 1e-6 < 1 - e1 ? (p1 = Math.acos(e1), I = Math.sin(p1), d = Math.sin((1 - g0) * p1) / I, Math.sin(g0 * p1) / I) : (d = 1 - g0, g0), P[0] = d * V + b * f0, P[1] = d * $ + b * P0, P[2] = d * e0 + b * j0, P[3] = d * i0 + b * a1, C0 = (v0 = P)[0], J0 = v0[1], y0 = v0[2], c0 = v0[3], O0 = Math.atan2(2 * J0 * c0 - 2 * C0 * y0, 1 - 2 * J0 * J0 - 2 * y0 * y0), Z = Math.asin(2 * C0 * J0 + 2 * y0 * c0), m0 = Math.atan2(2 * C0 * c0 - 2 * J0 * y0, 1 - 2 * C0 * C0 - 2 * y0 * y0), N0[0] = O0 / degToRads, N0[1] = Z / degToRads, N0[2] = m0 / degToRads
                } else for (E0 = 0; E0 < k0; E0 += 1) 1 !== g.h && (s0 = L0 <= S ? 1 : S < p0 ? 0 : (g.o.x.constructor === Array ? (g.__fnct || (g.__fnct = []), g.__fnct[E0] ? d0 = g.__fnct[E0] : (d0 = BezierFactory.getBezierEasing(void 0 === g.o.x[E0] ? g.o.x[0] : g.o.x[E0], void 0 === g.o.y[E0] ? g.o.y[0] : g.o.y[E0], void 0 === g.i.x[E0] ? g.i.x[0] : g.i.x[E0], void 0 === g.i.y[E0] ? g.i.y[0] : g.i.y[E0]).get, g.__fnct[E0] = d0)) : g.__fnct ? d0 = g.__fnct : (d0 = BezierFactory.getBezierEasing(g.o.x, g.o.y, g.i.x, g.i.y).get, g.__fnct = d0), d0((S - p0) / (L0 - p0)))), q0 = x.s || g.e, R0 = 1 === g.h ? g.s[E0] : g.s[E0] + (q0[E0] - g.s[E0]) * s0, "multidimensional" === this.propType ? M[E0] = R0 : M = R0
            }
            return L.lastIndex = A0, M
        }

        function s(S) {
            var L = S[0] * degToRads, M = S[1] * degToRads, v = S[2] * degToRads, g = Math.cos(L / 2),
                x = Math.cos(M / 2), Q = Math.cos(v / 2), t0 = Math.sin(L / 2), s0 = Math.sin(M / 2),
                M0 = Math.sin(v / 2);
            return [t0 * s0 * Q + g * x * M0, t0 * x * Q + g * s0 * M0, g * s0 * Q - t0 * x * M0, g * x * Q - t0 * s0 * M0]
        }

        function h() {
            var S = this.comp.renderedFrame - this.offsetTime, L = this.keyframes[0].t - this.offsetTime,
                M = this.keyframes[this.keyframes.length - 1].t - this.offsetTime;
            if (!(S === this._caching.lastFrame || this._caching.lastFrame !== e && (this._caching.lastFrame >= M && M <= S || this._caching.lastFrame < L && S < L))) {
                this._caching.lastFrame >= S && (this._caching._lastKeyframeIndex = -1, this._caching.lastIndex = 0);
                var v = this.interpolateValue(S, this._caching);
                this.pv = v
            }
            return this._caching.lastFrame = S, this.pv
        }

        function n(S) {
            var L;
            if ("unidimensional" === this.propType) 1e-5 < r(this.v - (L = S * this.mult)) && (this.v = L, this._mdf = !0); else for (var M = 0, v = this.v.length; M < v;) 1e-5 < r(this.v[M] - (L = S[M] * this.mult)) && (this.v[M] = L, this._mdf = !0), M += 1
        }

        function m() {
            if (this.elem.globalData.frameId !== this.frameId && this.effectsSequence.length) if (this.lock) this.setVValue(this.pv); else {
                this.lock = !0, this._mdf = this._isFirstFrame;
                var S, L = this.effectsSequence.length, M = this.kf ? this.pv : this.data.k;
                for (S = 0; S < L; S += 1) M = this.effectsSequence[S](M);
                this.setVValue(M), this._isFirstFrame = !1, this.lock = !1, this.frameId = this.elem.globalData.frameId
            }
        }

        function T(S) {
            this.effectsSequence.push(S), this.container.addDynamicProperty(this)
        }

        function R(S, L, M, v) {
            this.propType = "unidimensional", this.mult = M || 1, this.data = L, this.v = M ? L.k * M : L.k, this.pv = L.k, this._mdf = !1, this.elem = S, this.container = v, this.comp = S.comp, this.k = !1, this.kf = !1, this.vel = 0, this.effectsSequence = [], this._isFirstFrame = !0, this.getValue = m, this.setVValue = n, this.addEffect = T
        }

        function k(S, L, M, v) {
            this.propType = "multidimensional", this.mult = M || 1, this.data = L, this._mdf = !1, this.elem = S, this.container = v, this.comp = S.comp, this.k = !1, this.kf = !1, this.frameId = -1;
            var g, x = L.k.length;
            for (this.v = createTypedArray("float32", x), this.pv = createTypedArray("float32", x), createTypedArray("float32", x), this.vel = createTypedArray("float32", x), g = 0; g < x; g += 1) this.v[g] = L.k[g] * this.mult, this.pv[g] = L.k[g];
            this._isFirstFrame = !0, this.effectsSequence = [], this.getValue = m, this.setVValue = n, this.addEffect = T
        }

        function U(S, L, M, v) {
            this.propType = "unidimensional", this.keyframes = L.k, this.offsetTime = S.data.st, this.frameId = -1, this._caching = {
                lastFrame: e,
                lastIndex: 0,
                value: 0,
                _lastKeyframeIndex: -1
            }, this.k = !0, this.kf = !0, this.data = L, this.mult = M || 1, this.elem = S, this.container = v, this.comp = S.comp, this.v = e, this.pv = e, this._isFirstFrame = !0, this.getValue = m, this.setVValue = n, this.interpolateValue = a, this.effectsSequence = [h.bind(this)], this.addEffect = T
        }

        function W(S, L, M, v) {
            this.propType = "multidimensional";
            var g, x, Q, t0, s0, M0 = L.k.length;
            for (g = 0; g < M0 - 1; g += 1) L.k[g].to && L.k[g].s && L.k[g + 1] && L.k[g + 1].s && (Q = L.k[g + 1].s, t0 = L.k[g].to, s0 = L.k[g].ti, (2 === (x = L.k[g].s).length && (x[0] !== Q[0] || x[1] !== Q[1]) && bez.pointOnLine2D(x[0], x[1], Q[0], Q[1], x[0] + t0[0], x[1] + t0[1]) && bez.pointOnLine2D(x[0], x[1], Q[0], Q[1], Q[0] + s0[0], Q[1] + s0[1]) || 3 === x.length && (x[0] !== Q[0] || x[1] !== Q[1] || x[2] !== Q[2]) && bez.pointOnLine3D(x[0], x[1], x[2], Q[0], Q[1], Q[2], x[0] + t0[0], x[1] + t0[1], x[2] + t0[2]) && bez.pointOnLine3D(x[0], x[1], x[2], Q[0], Q[1], Q[2], Q[0] + s0[0], Q[1] + s0[1], Q[2] + s0[2])) && (L.k[g].to = null, L.k[g].ti = null), x[0] === Q[0] && x[1] === Q[1] && 0 === t0[0] && 0 === t0[1] && 0 === s0[0] && 0 === s0[1] && (2 === x.length || x[2] === Q[2] && 0 === t0[2] && 0 === s0[2]) && (L.k[g].to = null, L.k[g].ti = null));
            this.effectsSequence = [h.bind(this)], this.keyframes = L.k, this.offsetTime = S.data.st, this.k = !0, this.kf = !0, this._isFirstFrame = !0, this.mult = M || 1, this.elem = S, this.container = v, this.comp = S.comp, this.getValue = m, this.setVValue = n, this.interpolateValue = a, this.frameId = -1;
            var a0 = L.k[0].s.length;
            for (this.v = createTypedArray("float32", a0), this.pv = createTypedArray("float32", a0), g = 0; g < a0; g += 1) this.v[g] = e, this.pv[g] = e;
            this._caching = {lastFrame: e, lastIndex: 0, value: createTypedArray("float32", a0)}, this.addEffect = T
        }

        return {
            getProp: function (S, L, M, v, g) {
                var x;
                if (L.k.length) if ("number" == typeof L.k[0]) x = new k(S, L, v, g); else switch (M) {
                    case 0:
                        x = new U(S, L, v, g);
                        break;
                    case 1:
                        x = new W(S, L, v, g)
                } else x = new R(S, L, v, g);
                return x.effectsSequence.length && g.addDynamicProperty(x), x
            }
        }
    }(), TransformPropertyFactory = function () {
        var e = [0, 0];

        function r(a, s, h) {
            if (this.elem = a, this.frameId = -1, this.propType = "transform", this.data = s, this.v = new Matrix, this.pre = new Matrix, this.appliedTransformations = 0, this.initDynamicPropertyContainer(h || a), s.p && s.p.s ? (this.px = PropertyFactory.getProp(a, s.p.x, 0, 0, this), this.py = PropertyFactory.getProp(a, s.p.y, 0, 0, this), s.p.z && (this.pz = PropertyFactory.getProp(a, s.p.z, 0, 0, this))) : this.p = PropertyFactory.getProp(a, s.p || {k: [0, 0, 0]}, 1, 0, this), s.rx) {
                if (this.rx = PropertyFactory.getProp(a, s.rx, 0, degToRads, this), this.ry = PropertyFactory.getProp(a, s.ry, 0, degToRads, this), this.rz = PropertyFactory.getProp(a, s.rz, 0, degToRads, this), s.or.k[0].ti) {
                    var n, m = s.or.k.length;
                    for (n = 0; n < m; n += 1) s.or.k[n].to = s.or.k[n].ti = null
                }
                this.or = PropertyFactory.getProp(a, s.or, 1, degToRads, this), this.or.sh = !0
            } else this.r = PropertyFactory.getProp(a, s.r || {k: 0}, 0, degToRads, this);
            s.sk && (this.sk = PropertyFactory.getProp(a, s.sk, 0, degToRads, this), this.sa = PropertyFactory.getProp(a, s.sa, 0, degToRads, this)), this.a = PropertyFactory.getProp(a, s.a || {k: [0, 0, 0]}, 1, 0, this), this.s = PropertyFactory.getProp(a, s.s || {k: [100, 100, 100]}, 1, .01, this), this.o = s.o ? PropertyFactory.getProp(a, s.o, 0, .01, a) : {
                _mdf: !1,
                v: 1
            }, this._isDirty = !0, this.dynamicProperties.length || this.getValue(!0)
        }

        return r.prototype = {
            applyToMatrix: function (a) {
                var s = this._mdf;
                this.iterateDynamicProperties(), this._mdf = this._mdf || s, this.a && a.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]), this.s && a.scale(this.s.v[0], this.s.v[1], this.s.v[2]), this.sk && a.skewFromAxis(-this.sk.v, this.sa.v), this.r ? a.rotate(-this.r.v) : a.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]), this.data.p.s ? a.translate(this.px.v, this.py.v, this.data.p.z ? -this.pz.v : 0) : a.translate(this.p.v[0], this.p.v[1], -this.p.v[2])
            }, getValue: function (a) {
                if (this.elem.globalData.frameId !== this.frameId) {
                    if (this._isDirty && (this.precalculateMatrix(), this._isDirty = !1), this.iterateDynamicProperties(), this._mdf || a) {
                        if (this.v.cloneFromProps(this.pre.props), this.appliedTransformations < 1 && this.v.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]), this.appliedTransformations < 2 && this.v.scale(this.s.v[0], this.s.v[1], this.s.v[2]), this.sk && this.appliedTransformations < 3 && this.v.skewFromAxis(-this.sk.v, this.sa.v), this.r && this.appliedTransformations < 4 ? this.v.rotate(-this.r.v) : !this.r && this.appliedTransformations < 4 && this.v.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]), this.autoOriented) {
                            var s, h, n = this.elem.globalData.frameRate;
                            if (this.p && this.p.keyframes && this.p.getValueAtTime) h = this.p._caching.lastFrame + this.p.offsetTime <= this.p.keyframes[0].t ? (s = this.p.getValueAtTime((this.p.keyframes[0].t + .01) / n, 0), this.p.getValueAtTime(this.p.keyframes[0].t / n, 0)) : this.p._caching.lastFrame + this.p.offsetTime >= this.p.keyframes[this.p.keyframes.length - 1].t ? (s = this.p.getValueAtTime(this.p.keyframes[this.p.keyframes.length - 1].t / n, 0), this.p.getValueAtTime((this.p.keyframes[this.p.keyframes.length - 1].t - .05) / n, 0)) : (s = this.p.pv, this.p.getValueAtTime((this.p._caching.lastFrame + this.p.offsetTime - .01) / n, this.p.offsetTime)); else if (this.px && this.px.keyframes && this.py.keyframes && this.px.getValueAtTime && this.py.getValueAtTime) {
                                s = [], h = [];
                                var m = this.px, T = this.py;
                                m._caching.lastFrame + m.offsetTime <= m.keyframes[0].t ? (s[0] = m.getValueAtTime((m.keyframes[0].t + .01) / n, 0), s[1] = T.getValueAtTime((T.keyframes[0].t + .01) / n, 0), h[0] = m.getValueAtTime(m.keyframes[0].t / n, 0), h[1] = T.getValueAtTime(T.keyframes[0].t / n, 0)) : m._caching.lastFrame + m.offsetTime >= m.keyframes[m.keyframes.length - 1].t ? (s[0] = m.getValueAtTime(m.keyframes[m.keyframes.length - 1].t / n, 0), s[1] = T.getValueAtTime(T.keyframes[T.keyframes.length - 1].t / n, 0), h[0] = m.getValueAtTime((m.keyframes[m.keyframes.length - 1].t - .01) / n, 0), h[1] = T.getValueAtTime((T.keyframes[T.keyframes.length - 1].t - .01) / n, 0)) : (s = [m.pv, T.pv], h[0] = m.getValueAtTime((m._caching.lastFrame + m.offsetTime - .01) / n, m.offsetTime), h[1] = T.getValueAtTime((T._caching.lastFrame + T.offsetTime - .01) / n, T.offsetTime))
                            } else s = h = e;
                            this.v.rotate(-Math.atan2(s[1] - h[1], s[0] - h[0]))
                        }
                        this.data.p && this.data.p.s ? this.v.translate(this.px.v, this.py.v, this.data.p.z ? -this.pz.v : 0) : this.v.translate(this.p.v[0], this.p.v[1], -this.p.v[2])
                    }
                    this.frameId = this.elem.globalData.frameId
                }
            }, precalculateMatrix: function () {
                if (!this.a.k && (this.pre.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]), this.appliedTransformations = 1, !this.s.effectsSequence.length)) {
                    if (this.pre.scale(this.s.v[0], this.s.v[1], this.s.v[2]), this.appliedTransformations = 2, this.sk) {
                        if (this.sk.effectsSequence.length || this.sa.effectsSequence.length) return;
                        this.pre.skewFromAxis(-this.sk.v, this.sa.v), this.appliedTransformations = 3
                    }
                    if (this.r) {
                        if (this.r.effectsSequence.length) return;
                        this.pre.rotate(-this.r.v), this.appliedTransformations = 4
                    } else this.rz.effectsSequence.length || this.ry.effectsSequence.length || this.rx.effectsSequence.length || this.or.effectsSequence.length || (this.pre.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]), this.appliedTransformations = 4)
                }
            }, autoOrient: function () {
            }
        }, extendPrototype([DynamicPropertyContainer], r), r.prototype.addDynamicProperty = function (a) {
            this._addDynamicProperty(a), this.elem.addDynamicProperty(a), this._isDirty = !0
        }, r.prototype._addDynamicProperty = DynamicPropertyContainer.prototype.addDynamicProperty, {
            getTransformProperty: function (a, s, h) {
                return new r(a, s, h)
            }
        }
    }();

    function ShapePath() {
        this.c = !1, this._length = 0, this._maxLength = 8, this.v = createSizedArray(this._maxLength), this.o = createSizedArray(this._maxLength), this.i = createSizedArray(this._maxLength)
    }

    ShapePath.prototype.setPathData = function (e, r) {
        this.c = e, this.setLength(r);
        for (var a = 0; a < r;) this.v[a] = point_pool.newElement(), this.o[a] = point_pool.newElement(), this.i[a] = point_pool.newElement(), a += 1
    }, ShapePath.prototype.setLength = function (e) {
        for (; this._maxLength < e;) this.doubleArrayLength();
        this._length = e
    }, ShapePath.prototype.doubleArrayLength = function () {
        this.v = this.v.concat(createSizedArray(this._maxLength)), this.i = this.i.concat(createSizedArray(this._maxLength)), this.o = this.o.concat(createSizedArray(this._maxLength)), this._maxLength *= 2
    }, ShapePath.prototype.setXYAt = function (e, r, a, s, h) {
        var n;
        switch (this._length = Math.max(this._length, s + 1), this._length >= this._maxLength && this.doubleArrayLength(), a) {
            case"v":
                n = this.v;
                break;
            case"i":
                n = this.i;
                break;
            case"o":
                n = this.o
        }
        (!n[s] || n[s] && !h) && (n[s] = point_pool.newElement()), n[s][0] = e, n[s][1] = r
    }, ShapePath.prototype.setTripleAt = function (e, r, a, s, h, n, m, T) {
        this.setXYAt(e, r, "v", m, T), this.setXYAt(a, s, "o", m, T), this.setXYAt(h, n, "i", m, T)
    }, ShapePath.prototype.reverse = function () {
        var e = new ShapePath;
        e.setPathData(this.c, this._length);
        var r = this.v, a = this.o, s = this.i, h = 0;
        this.c && (e.setTripleAt(r[0][0], r[0][1], s[0][0], s[0][1], a[0][0], a[0][1], 0, !1), h = 1);
        var n, m = this._length - 1, T = this._length;
        for (n = h; n < T; n += 1) e.setTripleAt(r[m][0], r[m][1], s[m][0], s[m][1], a[m][0], a[m][1], n, !1), m -= 1;
        return e
    };
    var ShapePropertyFactory = function () {
        var e = -999999;

        function r(S, L, M) {
            var v, g, x, Q, t0, s0, M0, a0, A0 = M.lastIndex, E0 = this.keyframes;
            if (S < E0[0].t - this.offsetTime) v = E0[0].s[0], x = !0, A0 = 0; else if (S >= E0[E0.length - 1].t - this.offsetTime) v = E0[E0.length - 1].s ? E0[E0.length - 1].s[0] : E0[E0.length - 2].e[0], x = !0; else {
                for (var k0, b0, q0 = A0, N0 = E0.length - 1, v0 = !0; v0 && (k0 = E0[q0], !((b0 = E0[q0 + 1]).t - this.offsetTime > S));) q0 < N0 - 1 ? q0 += 1 : v0 = !1;
                if (A0 = q0, !(x = 1 === k0.h)) {
                    if (S >= b0.t - this.offsetTime) a0 = 1; else if (S < k0.t - this.offsetTime) a0 = 0; else {
                        var C0;
                        k0.__fnct ? C0 = k0.__fnct : (C0 = BezierFactory.getBezierEasing(k0.o.x, k0.o.y, k0.i.x, k0.i.y).get, k0.__fnct = C0), a0 = C0((S - (k0.t - this.offsetTime)) / (b0.t - this.offsetTime - (k0.t - this.offsetTime)))
                    }
                    g = b0.s ? b0.s[0] : k0.e[0]
                }
                v = k0.s[0]
            }
            for (s0 = L._length, M0 = v.i[0].length, M.lastIndex = A0, Q = 0; Q < s0; Q += 1) for (t0 = 0; t0 < M0; t0 += 1) L.i[Q][t0] = x ? v.i[Q][t0] : v.i[Q][t0] + (g.i[Q][t0] - v.i[Q][t0]) * a0, L.o[Q][t0] = x ? v.o[Q][t0] : v.o[Q][t0] + (g.o[Q][t0] - v.o[Q][t0]) * a0, L.v[Q][t0] = x ? v.v[Q][t0] : v.v[Q][t0] + (g.v[Q][t0] - v.v[Q][t0]) * a0
        }

        function a() {
            this.paths = this.localShapeCollection
        }

        function s(S) {
            (function (L, M) {
                if (L._length !== M._length || L.c !== M.c) return !1;
                var v, g = L._length;
                for (v = 0; v < g; v += 1) if (L.v[v][0] !== M.v[v][0] || L.v[v][1] !== M.v[v][1] || L.o[v][0] !== M.o[v][0] || L.o[v][1] !== M.o[v][1] || L.i[v][0] !== M.i[v][0] || L.i[v][1] !== M.i[v][1]) return !1;
                return !0
            })(this.v, S) || (this.v = shape_pool.clone(S), this.localShapeCollection.releaseShapes(), this.localShapeCollection.addShape(this.v), this._mdf = !0, this.paths = this.localShapeCollection)
        }

        function h() {
            if (this.elem.globalData.frameId !== this.frameId) if (this.effectsSequence.length) if (this.lock) this.setVValue(this.pv); else {
                this.lock = !0, this._mdf = !1;
                var S, L = this.kf ? this.pv : this.data.ks ? this.data.ks.k : this.data.pt.k,
                    M = this.effectsSequence.length;
                for (S = 0; S < M; S += 1) L = this.effectsSequence[S](L);
                this.setVValue(L), this.lock = !1, this.frameId = this.elem.globalData.frameId
            } else this._mdf = !1
        }

        function n(S, L, M) {
            this.propType = "shape", this.comp = S.comp, this.container = S, this.elem = S, this.data = L, this.k = !1, this.kf = !1, this._mdf = !1, this.v = shape_pool.clone(3 === M ? L.pt.k : L.ks.k), this.pv = shape_pool.clone(this.v), this.localShapeCollection = shapeCollection_pool.newShapeCollection(), this.paths = this.localShapeCollection, this.paths.addShape(this.v), this.reset = a, this.effectsSequence = []
        }

        function m(S) {
            this.effectsSequence.push(S), this.container.addDynamicProperty(this)
        }

        function T(S, L, M) {
            this.propType = "shape", this.comp = S.comp, this.elem = S, this.container = S, this.offsetTime = S.data.st, this.keyframes = 3 === M ? L.pt.k : L.ks.k, this.k = !0, this.kf = !0;
            var v = this.keyframes[0].s[0].i.length;
            this.v = shape_pool.newElement(), this.v.setPathData(this.keyframes[0].s[0].c, v), this.pv = shape_pool.clone(this.v), this.localShapeCollection = shapeCollection_pool.newShapeCollection(), this.paths = this.localShapeCollection, this.paths.addShape(this.v), this.lastFrame = e, this.reset = a, this._caching = {
                lastFrame: e,
                lastIndex: 0
            }, this.effectsSequence = [function () {
                var g = this.comp.renderedFrame - this.offsetTime, x = this.keyframes[0].t - this.offsetTime,
                    Q = this.keyframes[this.keyframes.length - 1].t - this.offsetTime, t0 = this._caching.lastFrame;
                return t0 !== e && (t0 < x && g < x || Q < t0 && Q < g) || (this._caching.lastIndex = t0 < g ? this._caching.lastIndex : 0, this.interpolateShape(g, this.pv, this._caching)), this._caching.lastFrame = g, this.pv
            }.bind(this)]
        }

        n.prototype.interpolateShape = r, n.prototype.getValue = h, n.prototype.setVValue = s, n.prototype.addEffect = m, T.prototype.getValue = h, T.prototype.interpolateShape = r, T.prototype.setVValue = s, T.prototype.addEffect = m;
        var R = function () {
            var S = roundCorner;

            function L(M, v) {
                this.v = shape_pool.newElement(), this.v.setPathData(!0, 4), this.localShapeCollection = shapeCollection_pool.newShapeCollection(), this.paths = this.localShapeCollection, this.localShapeCollection.addShape(this.v), this.d = v.d, this.elem = M, this.comp = M.comp, this.frameId = -1, this.initDynamicPropertyContainer(M), this.p = PropertyFactory.getProp(M, v.p, 1, 0, this), this.s = PropertyFactory.getProp(M, v.s, 1, 0, this), this.dynamicProperties.length ? this.k = !0 : (this.k = !1, this.convertEllToPath())
            }

            return L.prototype = {
                reset: a, getValue: function () {
                    this.elem.globalData.frameId !== this.frameId && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties(), this._mdf && this.convertEllToPath())
                }, convertEllToPath: function () {
                    var M = this.p.v[0], v = this.p.v[1], g = this.s.v[0] / 2, x = this.s.v[1] / 2, Q = 3 !== this.d,
                        t0 = this.v;
                    t0.v[0][0] = M, t0.v[0][1] = v - x, t0.v[1][0] = Q ? M + g : M - g, t0.v[1][1] = v, t0.v[2][0] = M, t0.v[2][1] = v + x, t0.v[3][0] = Q ? M - g : M + g, t0.v[3][1] = v, t0.i[0][0] = Q ? M - g * S : M + g * S, t0.i[0][1] = v - x, t0.i[1][0] = Q ? M + g : M - g, t0.i[1][1] = v - x * S, t0.i[2][0] = Q ? M + g * S : M - g * S, t0.i[2][1] = v + x, t0.i[3][0] = Q ? M - g : M + g, t0.i[3][1] = v + x * S, t0.o[0][0] = Q ? M + g * S : M - g * S, t0.o[0][1] = v - x, t0.o[1][0] = Q ? M + g : M - g, t0.o[1][1] = v + x * S, t0.o[2][0] = Q ? M - g * S : M + g * S, t0.o[2][1] = v + x, t0.o[3][0] = Q ? M - g : M + g, t0.o[3][1] = v - x * S
                }
            }, extendPrototype([DynamicPropertyContainer], L), L
        }(), k = function () {
            function S(L, M) {
                this.v = shape_pool.newElement(), this.v.setPathData(!0, 0), this.elem = L, this.comp = L.comp, this.data = M, this.frameId = -1, this.d = M.d, this.initDynamicPropertyContainer(L), 1 === M.sy ? (this.ir = PropertyFactory.getProp(L, M.ir, 0, 0, this), this.is = PropertyFactory.getProp(L, M.is, 0, .01, this), this.convertToPath = this.convertStarToPath) : this.convertToPath = this.convertPolygonToPath, this.pt = PropertyFactory.getProp(L, M.pt, 0, 0, this), this.p = PropertyFactory.getProp(L, M.p, 1, 0, this), this.r = PropertyFactory.getProp(L, M.r, 0, degToRads, this), this.or = PropertyFactory.getProp(L, M.or, 0, 0, this), this.os = PropertyFactory.getProp(L, M.os, 0, .01, this), this.localShapeCollection = shapeCollection_pool.newShapeCollection(), this.localShapeCollection.addShape(this.v), this.paths = this.localShapeCollection, this.dynamicProperties.length ? this.k = !0 : (this.k = !1, this.convertToPath())
            }

            return S.prototype = {
                reset: a, getValue: function () {
                    this.elem.globalData.frameId !== this.frameId && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties(), this._mdf && this.convertToPath())
                }, convertStarToPath: function () {
                    var L, M, v, g, x = 2 * Math.floor(this.pt.v), Q = 2 * Math.PI / x, t0 = !0, s0 = this.or.v,
                        M0 = this.ir.v, a0 = this.os.v, d0 = this.is.v, A0 = 2 * Math.PI * s0 / (2 * x),
                        E0 = 2 * Math.PI * M0 / (2 * x), k0 = -Math.PI / 2;
                    k0 += this.r.v;
                    var b0 = 3 === this.data.d ? -1 : 1;
                    for (L = this.v._length = 0; L < x; L += 1) {
                        v = t0 ? a0 : d0, g = t0 ? A0 : E0;
                        var q0 = (M = t0 ? s0 : M0) * Math.cos(k0), N0 = M * Math.sin(k0),
                            v0 = 0 === q0 && 0 === N0 ? 0 : N0 / Math.sqrt(q0 * q0 + N0 * N0),
                            C0 = 0 === q0 && 0 === N0 ? 0 : -q0 / Math.sqrt(q0 * q0 + N0 * N0);
                        this.v.setTripleAt(q0 += +this.p.v[0], N0 += +this.p.v[1], q0 - v0 * g * v * b0, N0 - C0 * g * v * b0, q0 + v0 * g * v * b0, N0 + C0 * g * v * b0, L, !0), t0 = !t0, k0 += Q * b0
                    }
                }, convertPolygonToPath: function () {
                    var L, M = Math.floor(this.pt.v), v = 2 * Math.PI / M, g = this.or.v, x = this.os.v,
                        Q = 2 * Math.PI * g / (4 * M), t0 = -Math.PI / 2, s0 = 3 === this.data.d ? -1 : 1;
                    for (t0 += this.r.v, L = this.v._length = 0; L < M; L += 1) {
                        var M0 = g * Math.cos(t0), a0 = g * Math.sin(t0),
                            d0 = 0 === M0 && 0 === a0 ? 0 : a0 / Math.sqrt(M0 * M0 + a0 * a0),
                            A0 = 0 === M0 && 0 === a0 ? 0 : -M0 / Math.sqrt(M0 * M0 + a0 * a0);
                        this.v.setTripleAt(M0 += +this.p.v[0], a0 += +this.p.v[1], M0 - d0 * Q * x * s0, a0 - A0 * Q * x * s0, M0 + d0 * Q * x * s0, a0 + A0 * Q * x * s0, L, !0), t0 += v * s0
                    }
                    this.paths.length = 0, this.paths[0] = this.v
                }
            }, extendPrototype([DynamicPropertyContainer], S), S
        }(), U = function () {
            function S(L, M) {
                this.v = shape_pool.newElement(), this.v.c = !0, this.localShapeCollection = shapeCollection_pool.newShapeCollection(), this.localShapeCollection.addShape(this.v), this.paths = this.localShapeCollection, this.elem = L, this.comp = L.comp, this.frameId = -1, this.d = M.d, this.initDynamicPropertyContainer(L), this.p = PropertyFactory.getProp(L, M.p, 1, 0, this), this.s = PropertyFactory.getProp(L, M.s, 1, 0, this), this.r = PropertyFactory.getProp(L, M.r, 0, 0, this), this.dynamicProperties.length ? this.k = !0 : (this.k = !1, this.convertRectToPath())
            }

            return S.prototype = {
                convertRectToPath: function () {
                    var L = this.p.v[0], M = this.p.v[1], v = this.s.v[0] / 2, g = this.s.v[1] / 2,
                        x = bm_min(v, g, this.r.v), Q = x * (1 - roundCorner);
                    this.v._length = 0, 2 === this.d || 1 === this.d ? (this.v.setTripleAt(L + v, M - g + x, L + v, M - g + x, L + v, M - g + Q, 0, !0), this.v.setTripleAt(L + v, M + g - x, L + v, M + g - Q, L + v, M + g - x, 1, !0), 0 !== x ? (this.v.setTripleAt(L + v - x, M + g, L + v - x, M + g, L + v - Q, M + g, 2, !0), this.v.setTripleAt(L - v + x, M + g, L - v + Q, M + g, L - v + x, M + g, 3, !0), this.v.setTripleAt(L - v, M + g - x, L - v, M + g - x, L - v, M + g - Q, 4, !0), this.v.setTripleAt(L - v, M - g + x, L - v, M - g + Q, L - v, M - g + x, 5, !0), this.v.setTripleAt(L - v + x, M - g, L - v + x, M - g, L - v + Q, M - g, 6, !0), this.v.setTripleAt(L + v - x, M - g, L + v - Q, M - g, L + v - x, M - g, 7, !0)) : (this.v.setTripleAt(L - v, M + g, L - v + Q, M + g, L - v, M + g, 2), this.v.setTripleAt(L - v, M - g, L - v, M - g + Q, L - v, M - g, 3))) : (this.v.setTripleAt(L + v, M - g + x, L + v, M - g + Q, L + v, M - g + x, 0, !0), 0 !== x ? (this.v.setTripleAt(L + v - x, M - g, L + v - x, M - g, L + v - Q, M - g, 1, !0), this.v.setTripleAt(L - v + x, M - g, L - v + Q, M - g, L - v + x, M - g, 2, !0), this.v.setTripleAt(L - v, M - g + x, L - v, M - g + x, L - v, M - g + Q, 3, !0), this.v.setTripleAt(L - v, M + g - x, L - v, M + g - Q, L - v, M + g - x, 4, !0), this.v.setTripleAt(L - v + x, M + g, L - v + x, M + g, L - v + Q, M + g, 5, !0), this.v.setTripleAt(L + v - x, M + g, L + v - Q, M + g, L + v - x, M + g, 6, !0), this.v.setTripleAt(L + v, M + g - x, L + v, M + g - x, L + v, M + g - Q, 7, !0)) : (this.v.setTripleAt(L - v, M - g, L - v + Q, M - g, L - v, M - g, 1, !0), this.v.setTripleAt(L - v, M + g, L - v, M + g - Q, L - v, M + g, 2, !0), this.v.setTripleAt(L + v, M + g, L + v - Q, M + g, L + v, M + g, 3, !0)))
                }, getValue: function (L) {
                    this.elem.globalData.frameId !== this.frameId && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties(), this._mdf && this.convertRectToPath())
                }, reset: a
            }, extendPrototype([DynamicPropertyContainer], S), S
        }();
        return {
            getShapeProp: function (S, L, M) {
                var v;
                return 3 === M || 4 === M ? v = (3 === M ? L.pt : L.ks).k.length ? new T(S, L, M) : new n(S, L, M) : 5 === M ? v = new U(S, L) : 6 === M ? v = new R(S, L) : 7 === M && (v = new k(S, L)), v.k && S.addDynamicProperty(v), v
            }, getConstructorFunction: function () {
                return n
            }, getKeyframedConstructorFunction: function () {
                return T
            }
        }
    }(), ShapeModifiers = ($r = {}, _r = {}, $r.registerModifier = function (e, r) {
        _r[e] || (_r[e] = r)
    }, $r.getModifier = function (e, r, a) {
        return new _r[e](r, a)
    }, $r), $r, _r;

    function ShapeModifier() {
    }

    function TrimModifier() {
    }

    function RoundCornersModifier() {
    }

    function RepeaterModifier() {
    }

    function ShapeCollection() {
        this._length = 0, this._maxLength = 4, this.shapes = createSizedArray(this._maxLength)
    }

    function DashProperty(e, r, a, s) {
        this.elem = e, this.frameId = -1, this.dataProps = createSizedArray(r.length), this.renderer = a, this.k = !1, this.dashStr = "", this.dashArray = createTypedArray("float32", r.length ? r.length - 1 : 0), this.dashoffset = createTypedArray("float32", 1), this.initDynamicPropertyContainer(s);
        var h, n, m = r.length || 0;
        for (h = 0; h < m; h += 1) n = PropertyFactory.getProp(e, r[h].v, 0, 0, this), this.k = n.k || this.k, this.dataProps[h] = {
            n: r[h].n,
            p: n
        };
        this.k || this.getValue(!0), this._isAnimated = this.k
    }

    function GradientProperty(e, r, a) {
        this.data = r, this.c = createTypedArray("uint8c", 4 * r.p);
        var s = r.k.k[0].s ? r.k.k[0].s.length - 4 * r.p : r.k.k.length - 4 * r.p;
        this.o = createTypedArray("float32", s), this._cmdf = !1, this._omdf = !1, this._collapsable = this.checkCollapsable(), this._hasOpacity = s, this.initDynamicPropertyContainer(a), this.prop = PropertyFactory.getProp(e, r.k, 1, null, this), this.k = this.prop.k, this.getValue(!0)
    }

    ShapeModifier.prototype.initModifierProperties = function () {
    }, ShapeModifier.prototype.addShapeToModifier = function () {
    }, ShapeModifier.prototype.addShape = function (e) {
        if (!this.closed) {
            e.sh.container.addDynamicProperty(e.sh);
            var r = {shape: e.sh, data: e, localShapeCollection: shapeCollection_pool.newShapeCollection()};
            this.shapes.push(r), this.addShapeToModifier(r), this._isAnimated && e.setAsAnimated()
        }
    }, ShapeModifier.prototype.init = function (e, r) {
        this.shapes = [], this.elem = e, this.initDynamicPropertyContainer(e), this.initModifierProperties(e, r), this.frameId = initialDefaultFrame, this.closed = !1, this.k = !1, this.dynamicProperties.length ? this.k = !0 : this.getValue(!0)
    }, ShapeModifier.prototype.processKeys = function () {
        this.elem.globalData.frameId !== this.frameId && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties())
    }, extendPrototype([DynamicPropertyContainer], ShapeModifier), extendPrototype([ShapeModifier], TrimModifier), TrimModifier.prototype.initModifierProperties = function (e, r) {
        this.s = PropertyFactory.getProp(e, r.s, 0, .01, this), this.e = PropertyFactory.getProp(e, r.e, 0, .01, this), this.o = PropertyFactory.getProp(e, r.o, 0, 0, this), this.sValue = 0, this.eValue = 0, this.getValue = this.processKeys, this.m = r.m, this._isAnimated = !!this.s.effectsSequence.length || !!this.e.effectsSequence.length || !!this.o.effectsSequence.length
    }, TrimModifier.prototype.addShapeToModifier = function (e) {
        e.pathsData = []
    }, TrimModifier.prototype.calculateShapeEdges = function (e, r, a, s, h) {
        var n = [];
        r <= 1 ? n.push({s: e, e: r}) : 1 <= e ? n.push({s: e - 1, e: r - 1}) : (n.push({s: e, e: 1}), n.push({
            s: 0,
            e: r - 1
        }));
        var m, T, R = [], k = n.length;
        for (m = 0; m < k; m += 1) (T = n[m]).e * h < s || T.s * h > s + a || R.push([T.s * h <= s ? 0 : (T.s * h - s) / a, T.e * h >= s + a ? 1 : (T.e * h - s) / a]);
        return R.length || R.push([0, 0]), R
    }, TrimModifier.prototype.releasePathsData = function (e) {
        var r, a = e.length;
        for (r = 0; r < a; r += 1) segments_length_pool.release(e[r]);
        return e.length = 0, e
    }, TrimModifier.prototype.processShapes = function (e) {
        var r, a, s;
        if (this._mdf || e) {
            var h = this.o.v % 360 / 360;
            if (h < 0 && (h += 1), (a = (1 < this.e.v ? 1 : this.e.v < 0 ? 0 : this.e.v) + h) < (r = (1 < this.s.v ? 1 : this.s.v < 0 ? 0 : this.s.v) + h)) {
                var n = r;
                r = a, a = n
            }
            r = 1e-4 * Math.round(1e4 * r), a = 1e-4 * Math.round(1e4 * a), this.sValue = r, this.eValue = a
        } else r = this.sValue, a = this.eValue;
        var m, T, R, k, U, W, S = this.shapes.length, L = 0;
        if (a === r) for (m = 0; m < S; m += 1) this.shapes[m].localShapeCollection.releaseShapes(), this.shapes[m].shape._mdf = !0, this.shapes[m].shape.paths = this.shapes[m].localShapeCollection; else if (1 === a && 0 === r || 0 === a && 1 === r) {
            if (this._mdf) for (m = 0; m < S; m += 1) this.shapes[m].pathsData.length = 0, this.shapes[m].shape._mdf = !0
        } else {
            var M, v, g = [];
            for (m = 0; m < S; m += 1) if ((M = this.shapes[m]).shape._mdf || this._mdf || e || 2 === this.m) {
                if (R = (s = M.shape.paths)._length, W = 0, !M.shape._mdf && M.pathsData.length) W = M.totalShapeLength; else {
                    for (k = this.releasePathsData(M.pathsData), T = 0; T < R; T += 1) U = bez.getSegmentsLength(s.shapes[T]), k.push(U), W += U.totalLength;
                    M.totalShapeLength = W, M.pathsData = k
                }
                L += W, M.shape._mdf = !0
            } else M.shape.paths = M.localShapeCollection;
            var x, Q = r, t0 = a, s0 = 0;
            for (m = S - 1; 0 <= m; m -= 1) if ((M = this.shapes[m]).shape._mdf) {
                for ((v = M.localShapeCollection).releaseShapes(), 2 === this.m && 1 < S ? (x = this.calculateShapeEdges(r, a, M.totalShapeLength, s0, L), s0 += M.totalShapeLength) : x = [[Q, t0]], R = x.length, T = 0; T < R; T += 1) {
                    Q = x[T][0], t0 = x[T][1], g.length = 0, t0 <= 1 ? g.push({
                        s: M.totalShapeLength * Q,
                        e: M.totalShapeLength * t0
                    }) : 1 <= Q ? g.push({
                        s: M.totalShapeLength * (Q - 1),
                        e: M.totalShapeLength * (t0 - 1)
                    }) : (g.push({s: M.totalShapeLength * Q, e: M.totalShapeLength}), g.push({
                        s: 0,
                        e: M.totalShapeLength * (t0 - 1)
                    }));
                    var M0 = this.addShapes(M, g[0]);
                    if (g[0].s !== g[0].e) {
                        if (1 < g.length) if (M.shape.paths.shapes[M.shape.paths._length - 1].c) {
                            var a0 = M0.pop();
                            this.addPaths(M0, v), M0 = this.addShapes(M, g[1], a0)
                        } else this.addPaths(M0, v), M0 = this.addShapes(M, g[1]);
                        this.addPaths(M0, v)
                    }
                }
                M.shape.paths = v
            }
        }
    }, TrimModifier.prototype.addPaths = function (e, r) {
        var a, s = e.length;
        for (a = 0; a < s; a += 1) r.addShape(e[a])
    }, TrimModifier.prototype.addSegment = function (e, r, a, s, h, n, m) {
        h.setXYAt(r[0], r[1], "o", n), h.setXYAt(a[0], a[1], "i", n + 1), m && h.setXYAt(e[0], e[1], "v", n), h.setXYAt(s[0], s[1], "v", n + 1)
    }, TrimModifier.prototype.addSegmentFromArray = function (e, r, a, s) {
        r.setXYAt(e[1], e[5], "o", a), r.setXYAt(e[2], e[6], "i", a + 1), s && r.setXYAt(e[0], e[4], "v", a), r.setXYAt(e[3], e[7], "v", a + 1)
    }, TrimModifier.prototype.addShapes = function (e, r, a) {
        var s, h, n, m, T, R, k, U, W = e.pathsData, S = e.shape.paths.shapes, L = e.shape.paths._length, M = 0, v = [],
            g = !0;
        for (U = a ? (T = a._length, a._length) : (a = shape_pool.newElement(), T = 0), v.push(a), s = 0; s < L; s += 1) {
            for (R = W[s].lengths, a.c = S[s].c, n = S[s].c ? R.length : R.length + 1, h = 1; h < n; h += 1) if (M + (m = R[h - 1]).addedLength < r.s) M += m.addedLength, a.c = !1; else {
                if (M > r.e) {
                    a.c = !1;
                    break
                }
                r.s <= M && r.e >= M + m.addedLength ? (this.addSegment(S[s].v[h - 1], S[s].o[h - 1], S[s].i[h], S[s].v[h], a, T, g), g = !1) : (k = bez.getNewSegment(S[s].v[h - 1], S[s].v[h], S[s].o[h - 1], S[s].i[h], (r.s - M) / m.addedLength, (r.e - M) / m.addedLength, R[h - 1]), this.addSegmentFromArray(k, a, T, g), g = !1, a.c = !1), M += m.addedLength, T += 1
            }
            if (S[s].c && R.length) {
                if (m = R[h - 1], M <= r.e) {
                    var x = R[h - 1].addedLength;
                    r.s <= M && r.e >= M + x ? (this.addSegment(S[s].v[h - 1], S[s].o[h - 1], S[s].i[0], S[s].v[0], a, T, g), g = !1) : (k = bez.getNewSegment(S[s].v[h - 1], S[s].v[0], S[s].o[h - 1], S[s].i[0], (r.s - M) / x, (r.e - M) / x, R[h - 1]), this.addSegmentFromArray(k, a, T, g), g = !1, a.c = !1)
                } else a.c = !1;
                M += m.addedLength, T += 1
            }
            if (a._length && (a.setXYAt(a.v[U][0], a.v[U][1], "i", U), a.setXYAt(a.v[a._length - 1][0], a.v[a._length - 1][1], "o", a._length - 1)), M > r.e) break;
            s < L - 1 && (a = shape_pool.newElement(), g = !0, v.push(a), T = 0)
        }
        return v
    }, ShapeModifiers.registerModifier("tm", TrimModifier), extendPrototype([ShapeModifier], RoundCornersModifier), RoundCornersModifier.prototype.initModifierProperties = function (e, r) {
        this.getValue = this.processKeys, this.rd = PropertyFactory.getProp(e, r.r, 0, null, this), this._isAnimated = !!this.rd.effectsSequence.length
    }, RoundCornersModifier.prototype.processPath = function (e, r) {
        var a = shape_pool.newElement();
        a.c = e.c;
        var s, h, n, m, T, R, k, U, W, S, L, M, v, g = e._length, x = 0;
        for (s = 0; s < g; s += 1) n = e.i[s], (h = e.v[s])[0] === (m = e.o[s])[0] && h[1] === m[1] && h[0] === n[0] && h[1] === n[1] ? 0 !== s && s !== g - 1 || e.c ? (T = 0 === s ? e.v[g - 1] : e.v[s - 1], k = (R = Math.sqrt(Math.pow(h[0] - T[0], 2) + Math.pow(h[1] - T[1], 2))) ? Math.min(R / 2, r) / R : 0, U = M = h[0] + (T[0] - h[0]) * k, W = v = h[1] - (h[1] - T[1]) * k, a.setTripleAt(U, W, U - (U - h[0]) * roundCorner, W - (W - h[1]) * roundCorner, M, v, x), x += 1, T = s === g - 1 ? e.v[0] : e.v[s + 1], k = (R = Math.sqrt(Math.pow(h[0] - T[0], 2) + Math.pow(h[1] - T[1], 2))) ? Math.min(R / 2, r) / R : 0, U = S = h[0] + (T[0] - h[0]) * k, W = L = h[1] + (T[1] - h[1]) * k, a.setTripleAt(U, W, S, L, M = U - (U - h[0]) * roundCorner, v = W - (W - h[1]) * roundCorner, x)) : a.setTripleAt(h[0], h[1], m[0], m[1], n[0], n[1], x) : a.setTripleAt(e.v[s][0], e.v[s][1], e.o[s][0], e.o[s][1], e.i[s][0], e.i[s][1], x), x += 1;
        return a
    }, RoundCornersModifier.prototype.processShapes = function (e) {
        var r, a, s, h, n, m, T = this.shapes.length, R = this.rd.v;
        if (0 !== R) for (a = 0; a < T; a += 1) {
            if (m = (n = this.shapes[a]).localShapeCollection, n.shape._mdf || this._mdf || e) for (m.releaseShapes(), n.shape._mdf = !0, r = n.shape.paths.shapes, h = n.shape.paths._length, s = 0; s < h; s += 1) m.addShape(this.processPath(r[s], R));
            n.shape.paths = n.localShapeCollection
        }
        this.dynamicProperties.length || (this._mdf = !1)
    }, ShapeModifiers.registerModifier("rd", RoundCornersModifier), extendPrototype([ShapeModifier], RepeaterModifier), RepeaterModifier.prototype.initModifierProperties = function (e, r) {
        this.getValue = this.processKeys, this.c = PropertyFactory.getProp(e, r.c, 0, null, this), this.o = PropertyFactory.getProp(e, r.o, 0, null, this), this.tr = TransformPropertyFactory.getTransformProperty(e, r.tr, this), this.so = PropertyFactory.getProp(e, r.tr.so, 0, .01, this), this.eo = PropertyFactory.getProp(e, r.tr.eo, 0, .01, this), this.data = r, this.dynamicProperties.length || this.getValue(!0), this._isAnimated = !!this.dynamicProperties.length, this.pMatrix = new Matrix, this.rMatrix = new Matrix, this.sMatrix = new Matrix, this.tMatrix = new Matrix, this.matrix = new Matrix
    }, RepeaterModifier.prototype.applyTransforms = function (e, r, a, s, h, n) {
        var m = n ? -1 : 1, T = s.s.v[0] + (1 - s.s.v[0]) * (1 - h), R = s.s.v[1] + (1 - s.s.v[1]) * (1 - h);
        e.translate(s.p.v[0] * m * h, s.p.v[1] * m * h, s.p.v[2]), r.translate(-s.a.v[0], -s.a.v[1], s.a.v[2]), r.rotate(-s.r.v * m * h), r.translate(s.a.v[0], s.a.v[1], s.a.v[2]), a.translate(-s.a.v[0], -s.a.v[1], s.a.v[2]), a.scale(n ? 1 / T : T, n ? 1 / R : R), a.translate(s.a.v[0], s.a.v[1], s.a.v[2])
    }, RepeaterModifier.prototype.init = function (e, r, a, s) {
        for (this.elem = e, this.arr = r, this.pos = a, this.elemsData = s, this._currentCopies = 0, this._elements = [], this._groups = [], this.frameId = -1, this.initDynamicPropertyContainer(e), this.initModifierProperties(e, r[a]); 0 < a;) this._elements.unshift(r[a -= 1]);
        this.dynamicProperties.length ? this.k = !0 : this.getValue(!0)
    }, RepeaterModifier.prototype.resetElements = function (e) {
        var r, a = e.length;
        for (r = 0; r < a; r += 1) e[r]._processed = !1, "gr" === e[r].ty && this.resetElements(e[r].it)
    }, RepeaterModifier.prototype.cloneElements = function (e) {
        var r = JSON.parse(JSON.stringify(e));
        return this.resetElements(r), r
    }, RepeaterModifier.prototype.changeGroupRender = function (e, r) {
        var a, s = e.length;
        for (a = 0; a < s; a += 1) e[a]._render = r, "gr" === e[a].ty && this.changeGroupRender(e[a].it, r)
    }, RepeaterModifier.prototype.processShapes = function (e) {
        var r, a, s, h, n;
        if (this._mdf || e) {
            var m, T = Math.ceil(this.c.v);
            if (this._groups.length < T) {
                for (; this._groups.length < T;) {
                    var R = {it: this.cloneElements(this._elements), ty: "gr"};
                    R.it.push({
                        a: {a: 0, ix: 1, k: [0, 0]},
                        nm: "Transform",
                        o: {a: 0, ix: 7, k: 100},
                        p: {a: 0, ix: 2, k: [0, 0]},
                        r: {a: 1, ix: 6, k: [{s: 0, e: 0, t: 0}, {s: 0, e: 0, t: 1}]},
                        s: {a: 0, ix: 3, k: [100, 100]},
                        sa: {a: 0, ix: 5, k: 0},
                        sk: {a: 0, ix: 4, k: 0},
                        ty: "tr"
                    }), this.arr.splice(0, 0, R), this._groups.splice(0, 0, R), this._currentCopies += 1
                }
                this.elem.reloadShapes()
            }
            for (s = n = 0; s <= this._groups.length - 1; s += 1) this._groups[s]._render = m = n < T, this.changeGroupRender(this._groups[s].it, m), n += 1;
            this._currentCopies = T;
            var k = this.o.v, U = k % 1, W = 0 < k ? Math.floor(k) : Math.ceil(k), S = this.pMatrix.props,
                L = this.rMatrix.props, M = this.sMatrix.props;
            this.pMatrix.reset(), this.rMatrix.reset(), this.sMatrix.reset(), this.tMatrix.reset(), this.matrix.reset();
            var v, g, x = 0;
            if (0 < k) {
                for (; x < W;) this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, !1), x += 1;
                U && (this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, U, !1), x += U)
            } else if (k < 0) {
                for (; W < x;) this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, !0), x -= 1;
                U && (this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, -U, !0), x -= U)
            }
            for (s = 1 === this.data.m ? 0 : this._currentCopies - 1, h = 1 === this.data.m ? 1 : -1, n = this._currentCopies; n;) {
                if (g = (a = (r = this.elemsData[s].it)[r.length - 1].transform.mProps.v.props).length, r[r.length - 1].transform.mProps._mdf = !0, r[r.length - 1].transform.op._mdf = !0, r[r.length - 1].transform.op.v = this.so.v + s / (this._currentCopies - 1) * (this.eo.v - this.so.v), 0 !== x) {
                    for ((0 !== s && 1 === h || s !== this._currentCopies - 1 && -1 === h) && this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, !1), this.matrix.transform(L[0], L[1], L[2], L[3], L[4], L[5], L[6], L[7], L[8], L[9], L[10], L[11], L[12], L[13], L[14], L[15]), this.matrix.transform(M[0], M[1], M[2], M[3], M[4], M[5], M[6], M[7], M[8], M[9], M[10], M[11], M[12], M[13], M[14], M[15]), this.matrix.transform(S[0], S[1], S[2], S[3], S[4], S[5], S[6], S[7], S[8], S[9], S[10], S[11], S[12], S[13], S[14], S[15]), v = 0; v < g; v += 1) a[v] = this.matrix.props[v];
                    this.matrix.reset()
                } else for (this.matrix.reset(), v = 0; v < g; v += 1) a[v] = this.matrix.props[v];
                x += 1, n -= 1, s += h
            }
        } else for (n = this._currentCopies, s = 0, h = 1; n;) a = (r = this.elemsData[s].it)[r.length - 1].transform.mProps.v.props, r[r.length - 1].transform.mProps._mdf = !1, r[r.length - 1].transform.op._mdf = !1, n -= 1, s += h
    }, RepeaterModifier.prototype.addShape = function () {
    }, ShapeModifiers.registerModifier("rp", RepeaterModifier), ShapeCollection.prototype.addShape = function (e) {
        this._length === this._maxLength && (this.shapes = this.shapes.concat(createSizedArray(this._maxLength)), this._maxLength *= 2), this.shapes[this._length] = e, this._length += 1
    }, ShapeCollection.prototype.releaseShapes = function () {
        var e;
        for (e = 0; e < this._length; e += 1) shape_pool.release(this.shapes[e]);
        this._length = 0
    }, DashProperty.prototype.getValue = function (e) {
        if ((this.elem.globalData.frameId !== this.frameId || e) && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties(), this._mdf = this._mdf || e, this._mdf)) {
            var r = 0, a = this.dataProps.length;
            for ("svg" === this.renderer && (this.dashStr = ""), r = 0; r < a; r += 1) "o" != this.dataProps[r].n ? "svg" === this.renderer ? this.dashStr += " " + this.dataProps[r].p.v : this.dashArray[r] = this.dataProps[r].p.v : this.dashoffset[0] = this.dataProps[r].p.v
        }
    }, extendPrototype([DynamicPropertyContainer], DashProperty), GradientProperty.prototype.comparePoints = function (e, r) {
        for (var a = 0, s = this.o.length / 2; a < s;) {
            if (.01 < Math.abs(e[4 * a] - e[4 * r + 2 * a])) return !1;
            a += 1
        }
        return !0
    }, GradientProperty.prototype.checkCollapsable = function () {
        if (this.o.length / 2 != this.c.length / 4) return !1;
        if (this.data.k.k[0].s) for (var e = 0, r = this.data.k.k.length; e < r;) {
            if (!this.comparePoints(this.data.k.k[e].s, this.data.p)) return !1;
            e += 1
        } else if (!this.comparePoints(this.data.k.k, this.data.p)) return !1;
        return !0
    }, GradientProperty.prototype.getValue = function (e) {
        if (this.prop.getValue(), this._mdf = !1, this._cmdf = !1, this._omdf = !1, this.prop._mdf || e) {
            var r, a, s, h = 4 * this.data.p;
            for (r = 0; r < h; r += 1) a = r % 4 == 0 ? 100 : 255, s = Math.round(this.prop.v[r] * a), this.c[r] !== s && (this.c[r] = s, this._cmdf = !e);
            if (this.o.length) for (h = this.prop.v.length, r = 4 * this.data.p; r < h; r += 1) a = r % 2 == 0 ? 100 : 1, s = r % 2 == 0 ? Math.round(100 * this.prop.v[r]) : this.prop.v[r], this.o[r - 4 * this.data.p] !== s && (this.o[r - 4 * this.data.p] = s, this._omdf = !e);
            this._mdf = !e
        }
    }, extendPrototype([DynamicPropertyContainer], GradientProperty);
    var buildShapeString = function (e, r, a, s) {
            if (0 === r) return "";
            var h, n = e.o, m = e.i, T = e.v, R = " M" + s.applyToPointStringified(T[0][0], T[0][1]);
            for (h = 1; h < r; h += 1) R += " C" + s.applyToPointStringified(n[h - 1][0], n[h - 1][1]) + " " + s.applyToPointStringified(m[h][0], m[h][1]) + " " + s.applyToPointStringified(T[h][0], T[h][1]);
            return a && r && (R += " C" + s.applyToPointStringified(n[h - 1][0], n[h - 1][1]) + " " + s.applyToPointStringified(m[0][0], m[0][1]) + " " + s.applyToPointStringified(T[0][0], T[0][1]), R += "z"), R
        }, ImagePreloader = function () {
            var e = function () {
                var k = createTag("canvas");
                k.width = 1, k.height = 1;
                var U = k.getContext("2d");
                return U.fillStyle = "rgba(0,0,0,0)", U.fillRect(0, 0, 1, 1), k
            }();

            function r() {
                this.loadedAssets += 1, this.loadedAssets === this.totalImages && this.imagesLoadedCb && this.imagesLoadedCb(null)
            }

            function a(k) {
                var U = function (L, M, v) {
                    var g = "";
                    if (L.e) g = L.p; else if (M) {
                        var x = L.p;
                        -1 !== x.indexOf("images/") && (x = x.split("/")[1]), g = M + x
                    } else g = v, g += L.u ? L.u : "", g += L.p;
                    return g
                }(k, this.assetsPath, this.path), W = createTag("img");
                W.crossOrigin = "anonymous", W.addEventListener("load", this._imageLoaded.bind(this), !1), W.addEventListener("error", function () {
                    S.img = e, this._imageLoaded()
                }.bind(this), !1), W.src = U;
                var S = {img: W, assetData: k};
                return S
            }

            function s(k, U) {
                this.imagesLoadedCb = U;
                var W, S = k.length;
                for (W = 0; W < S; W += 1) k[W].layers || (this.totalImages += 1, this.images.push(this._createImageData(k[W])))
            }

            function h(k) {
                this.path = k || ""
            }

            function n(k) {
                this.assetsPath = k || ""
            }

            function m(k) {
                for (var U = 0, W = this.images.length; U < W;) {
                    if (this.images[U].assetData === k) return this.images[U].img;
                    U += 1
                }
            }

            function T() {
                this.imagesLoadedCb = null, this.images.length = 0
            }

            function R() {
                return this.totalImages === this.loadedAssets
            }

            return function () {
                this.loadAssets = s, this.setAssetsPath = n, this.setPath = h, this.loaded = R, this.destroy = T, this.getImage = m, this._createImageData = a, this._imageLoaded = r, this.assetsPath = "", this.path = "", this.totalImages = 0, this.loadedAssets = 0, this.imagesLoadedCb = null, this.images = []
            }
        }(),
        featureSupport = (sw = {maskType: !0}, (/MSIE 10/i.test(navigator.userAgent) || /MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent) || /Edge\/\d./i.test(navigator.userAgent)) && (sw.maskType = !1), sw),
        sw, filtersFactory = (tw = {}, tw.createFilter = function (e) {
            var r = createNS("filter");
            return r.setAttribute("id", e), r.setAttribute("filterUnits", "objectBoundingBox"), r.setAttribute("x", "0%"), r.setAttribute("y", "0%"), r.setAttribute("width", "100%"), r.setAttribute("height", "100%"), r
        }, tw.createAlphaToLuminanceFilter = function () {
            var e = createNS("feColorMatrix");
            return e.setAttribute("type", "matrix"), e.setAttribute("color-interpolation-filters", "sRGB"), e.setAttribute("values", "0 0 0 1 0  0 0 0 1 0  0 0 0 1 0  0 0 0 1 1"), e
        }, tw), tw, assetLoader = function () {
            function e(r) {
                return r.response && "object" == typeof r.response ? r.response : r.response && "string" == typeof r.response ? JSON.parse(r.response) : r.responseText ? JSON.parse(r.responseText) : void 0
            }

            return {
                load: function (r, a, s) {
                    var h, n = new XMLHttpRequest;
                    n.open("GET", r, !0);
                    try {
                        n.responseType = "json"
                    } catch {
                    }
                    n.send(), n.onreadystatechange = function () {
                        if (4 == n.readyState) if (200 == n.status) h = e(n), a(h); else try {
                            h = e(n), a(h)
                        } catch (m) {
                            s && s(m)
                        }
                    }
                }
            }
        }();

    function TextAnimatorProperty(e, r, a) {
        this._isFirstFrame = !0, this._hasMaskedPath = !1, this._frameId = -1, this._textData = e, this._renderType = r, this._elem = a, this._animatorsData = createSizedArray(this._textData.a.length), this._pathData = {}, this._moreOptions = {alignment: {}}, this.renderedLetters = [], this.lettersChangedFlag = !1, this.initDynamicPropertyContainer(a)
    }

    function TextAnimatorDataProperty(e, r, a) {
        var s = {propType: !1}, h = PropertyFactory.getProp, n = r.a;
        this.a = {
            r: n.r ? h(e, n.r, 0, degToRads, a) : s,
            rx: n.rx ? h(e, n.rx, 0, degToRads, a) : s,
            ry: n.ry ? h(e, n.ry, 0, degToRads, a) : s,
            sk: n.sk ? h(e, n.sk, 0, degToRads, a) : s,
            sa: n.sa ? h(e, n.sa, 0, degToRads, a) : s,
            s: n.s ? h(e, n.s, 1, .01, a) : s,
            a: n.a ? h(e, n.a, 1, 0, a) : s,
            o: n.o ? h(e, n.o, 0, .01, a) : s,
            p: n.p ? h(e, n.p, 1, 0, a) : s,
            sw: n.sw ? h(e, n.sw, 0, 0, a) : s,
            sc: n.sc ? h(e, n.sc, 1, 0, a) : s,
            fc: n.fc ? h(e, n.fc, 1, 0, a) : s,
            fh: n.fh ? h(e, n.fh, 0, 0, a) : s,
            fs: n.fs ? h(e, n.fs, 0, .01, a) : s,
            fb: n.fb ? h(e, n.fb, 0, .01, a) : s,
            t: n.t ? h(e, n.t, 0, 0, a) : s
        }, this.s = TextSelectorProp.getTextSelectorProp(e, r.s, a), this.s.t = r.s.t
    }

    function LetterProps(e, r, a, s, h, n) {
        this.o = e, this.sw = r, this.sc = a, this.fc = s, this.m = h, this.p = n, this._mdf = {
            o: !0,
            sw: !!r,
            sc: !!a,
            fc: !!s,
            m: !0,
            p: !0
        }
    }

    function TextProperty(e, r) {
        this._frameId = initialDefaultFrame, this.pv = "", this.v = "", this.kf = !1, this._isFirstFrame = !0, this._mdf = !1, this.data = r, this.elem = e, this.comp = this.elem.comp, this.keysIndex = 0, this.canResize = !1, this.minimumFontSize = 1, this.effectsSequence = [], this.currentData = {
            ascent: 0,
            boxWidth: this.defaultBoxWidth,
            f: "",
            fStyle: "",
            fWeight: "",
            fc: "",
            j: "",
            justifyOffset: "",
            l: [],
            lh: 0,
            lineWidths: [],
            ls: "",
            of: "",
            s: "",
            sc: "",
            sw: 0,
            t: 0,
            tr: 0,
            sz: 0,
            ps: null,
            fillColorAnim: !1,
            strokeColorAnim: !1,
            strokeWidthAnim: !1,
            yOffset: 0,
            finalSize: 0,
            finalText: [],
            finalLineHeight: 0,
            __complete: !1
        }, this.copyData(this.currentData, this.data.d.k[0].s), this.searchProperty() || this.completeTextData(this.currentData)
    }

    TextAnimatorProperty.prototype.searchProperties = function () {
        var e, a = this._textData.a.length, s = PropertyFactory.getProp;
        for (e = 0; e < a; e += 1) this._animatorsData[e] = new TextAnimatorDataProperty(this._elem, this._textData.a[e], this);
        this._textData.p && "m" in this._textData.p ? (this._pathData = {
            f: s(this._elem, this._textData.p.f, 0, 0, this),
            l: s(this._elem, this._textData.p.l, 0, 0, this),
            r: this._textData.p.r,
            m: this._elem.maskManager.getMaskProperty(this._textData.p.m)
        }, this._hasMaskedPath = !0) : this._hasMaskedPath = !1, this._moreOptions.alignment = s(this._elem, this._textData.m.a, 1, 0, this)
    }, TextAnimatorProperty.prototype.getMeasures = function (e, r) {
        if (this.lettersChangedFlag = r, this._mdf || this._isFirstFrame || r || this._hasMaskedPath && this._pathData.m._mdf) {
            this._isFirstFrame = !1;
            var a, s, h, n, m, T, R, k, U, W, S, L, M, v, g, x, Q, s0, M0 = this._moreOptions.alignment.v,
                a0 = this._animatorsData, d0 = this._textData, A0 = this.mHelper, E0 = this._renderType,
                k0 = this.renderedLetters.length, b0 = e.l;
            if (this._hasMaskedPath) {
                if (s0 = this._pathData.m, !this._pathData.n || this._pathData._mdf) {
                    var q0, N0 = s0.v;
                    for (this._pathData.r && (N0 = N0.reverse()), m = {
                        tLength: 0,
                        segments: []
                    }, n = N0._length - 1, h = x = 0; h < n; h += 1) q0 = bez.buildBezierData(N0.v[h], N0.v[h + 1], [N0.o[h][0] - N0.v[h][0], N0.o[h][1] - N0.v[h][1]], [N0.i[h + 1][0] - N0.v[h + 1][0], N0.i[h + 1][1] - N0.v[h + 1][1]]), m.tLength += q0.segmentLength, m.segments.push(q0), x += q0.segmentLength;
                    h = n, s0.v.c && (q0 = bez.buildBezierData(N0.v[h], N0.v[0], [N0.o[h][0] - N0.v[h][0], N0.o[h][1] - N0.v[h][1]], [N0.i[0][0] - N0.v[0][0], N0.i[0][1] - N0.v[0][1]]), m.tLength += q0.segmentLength, m.segments.push(q0), x += q0.segmentLength), this._pathData.pi = m
                }
                if (W = 1, U = !(k = S = 0), v = (m = this._pathData.pi).segments, (T = this._pathData.f.v) < 0 && s0.v.c) for (m.tLength < Math.abs(T) && (T = -Math.abs(T) % m.tLength), W = (M = v[S = v.length - 1].points).length - 1; T < 0;) T += M[W].partialLength, (W -= 1) < 0 && (W = (M = v[S -= 1].points).length - 1);
                L = (M = v[S].points)[W - 1], g = (R = M[W]).partialLength
            }
            n = b0.length, s = a = 0;
            var v0, C0, J0, y0, c0 = 1.2 * e.finalSize * .714, O0 = !0;
            J0 = a0.length;
            var Z, m0, L0, p0, _0, H0, K0, X0, V0, b1, Y0, Z0, m1, R0 = -1, q1 = T, D1 = S, H1 = W, n1 = -1, g0 = "",
                p1 = this.defaultPropsArray;
            if (2 === e.j || 1 === e.j) {
                var e1 = 0, I = 0, d = 2 === e.j ? -.5 : -1, b = 0, P = !0;
                for (h = 0; h < n; h += 1) if (b0[h].n) {
                    for (e1 && (e1 += I); b < h;) b0[b].animatorJustifyOffset = e1, b += 1;
                    P = !(e1 = 0)
                } else {
                    for (C0 = 0; C0 < J0; C0 += 1) (v0 = a0[C0].a).t.propType && (P && 2 === e.j && (I += v0.t.v * d), (Z = a0[C0].s.getMult(b0[h].anIndexes[C0], d0.a[C0].s.totalChars)).length ? e1 += v0.t.v * Z[0] * d : e1 += v0.t.v * Z * d);
                    P = !1
                }
                for (e1 && (e1 += I); b < h;) b0[b].animatorJustifyOffset = e1, b += 1
            }
            for (h = 0; h < n; h += 1) {
                if (A0.reset(), _0 = 1, b0[h].n) a = 0, s += e.yOffset, s += O0 ? 1 : 0, T = q1, O0 = !1, this._hasMaskedPath && (L = (M = v[S = D1].points)[(W = H1) - 1], g = (R = M[W]).partialLength, k = 0), m1 = b1 = Z0 = g0 = "", p1 = this.defaultPropsArray; else {
                    if (this._hasMaskedPath) {
                        if (n1 !== b0[h].line) {
                            switch (e.j) {
                                case 1:
                                    T += x - e.lineWidths[b0[h].line];
                                    break;
                                case 2:
                                    T += (x - e.lineWidths[b0[h].line]) / 2
                            }
                            n1 = b0[h].line
                        }
                        R0 !== b0[h].ind && (b0[R0] && (T += b0[R0].extra), T += b0[h].an / 2, R0 = b0[h].ind), T += M0[0] * b0[h].an / 200;
                        var V = 0;
                        for (C0 = 0; C0 < J0; C0 += 1) (v0 = a0[C0].a).p.propType && ((Z = a0[C0].s.getMult(b0[h].anIndexes[C0], d0.a[C0].s.totalChars)).length ? V += v0.p.v[0] * Z[0] : V += v0.p.v[0] * Z), v0.a.propType && ((Z = a0[C0].s.getMult(b0[h].anIndexes[C0], d0.a[C0].s.totalChars)).length ? V += v0.a.v[0] * Z[0] : V += v0.a.v[0] * Z);
                        for (U = !0; U;) T + V <= k + g || !M ? (L0 = L.point[0] + (R.point[0] - L.point[0]) * (Q = (T + V - k) / R.partialLength), p0 = L.point[1] + (R.point[1] - L.point[1]) * Q, A0.translate(-M0[0] * b0[h].an / 200, -M0[1] * c0 / 100), U = !1) : M && (k += R.partialLength, (W += 1) >= M.length && (W = 0, M = v[S += 1] ? v[S].points : s0.v.c ? v[S = W = 0].points : (k -= R.partialLength, null)), M && (L = R, g = (R = M[W]).partialLength));
                        A0.translate(-(m0 = b0[h].an / 2 - b0[h].add), 0, 0)
                    } else A0.translate(-(m0 = b0[h].an / 2 - b0[h].add), 0, 0), A0.translate(-M0[0] * b0[h].an / 200, -M0[1] * c0 / 100, 0);
                    for (C0 = 0; C0 < J0; C0 += 1) (v0 = a0[C0].a).t.propType && (Z = a0[C0].s.getMult(b0[h].anIndexes[C0], d0.a[C0].s.totalChars), 0 === a && 0 === e.j || (this._hasMaskedPath ? T += Z.length ? v0.t.v * Z[0] : v0.t.v * Z : a += Z.length ? v0.t.v * Z[0] : v0.t.v * Z));
                    for (e.strokeWidthAnim && (K0 = e.sw || 0), e.strokeColorAnim && (H0 = e.sc ? [e.sc[0], e.sc[1], e.sc[2]] : [0, 0, 0]), e.fillColorAnim && e.fc && (X0 = [e.fc[0], e.fc[1], e.fc[2]]), C0 = 0; C0 < J0; C0 += 1) (v0 = a0[C0].a).a.propType && ((Z = a0[C0].s.getMult(b0[h].anIndexes[C0], d0.a[C0].s.totalChars)).length ? A0.translate(-v0.a.v[0] * Z[0], -v0.a.v[1] * Z[1], v0.a.v[2] * Z[2]) : A0.translate(-v0.a.v[0] * Z, -v0.a.v[1] * Z, v0.a.v[2] * Z));
                    for (C0 = 0; C0 < J0; C0 += 1) (v0 = a0[C0].a).s.propType && ((Z = a0[C0].s.getMult(b0[h].anIndexes[C0], d0.a[C0].s.totalChars)).length ? A0.scale(1 + (v0.s.v[0] - 1) * Z[0], 1 + (v0.s.v[1] - 1) * Z[1], 1) : A0.scale(1 + (v0.s.v[0] - 1) * Z, 1 + (v0.s.v[1] - 1) * Z, 1));
                    for (C0 = 0; C0 < J0; C0 += 1) {
                        if (v0 = a0[C0].a, Z = a0[C0].s.getMult(b0[h].anIndexes[C0], d0.a[C0].s.totalChars), v0.sk.propType && (Z.length ? A0.skewFromAxis(-v0.sk.v * Z[0], v0.sa.v * Z[1]) : A0.skewFromAxis(-v0.sk.v * Z, v0.sa.v * Z)), v0.r.propType && A0.rotateZ(Z.length ? -v0.r.v * Z[2] : -v0.r.v * Z), v0.ry.propType && A0.rotateY(Z.length ? v0.ry.v * Z[1] : v0.ry.v * Z), v0.rx.propType && A0.rotateX(Z.length ? v0.rx.v * Z[0] : v0.rx.v * Z), v0.o.propType && (_0 += Z.length ? (v0.o.v * Z[0] - _0) * Z[0] : (v0.o.v * Z - _0) * Z), e.strokeWidthAnim && v0.sw.propType && (K0 += Z.length ? v0.sw.v * Z[0] : v0.sw.v * Z), e.strokeColorAnim && v0.sc.propType) for (V0 = 0; V0 < 3; V0 += 1) H0[V0] = Z.length ? H0[V0] + (v0.sc.v[V0] - H0[V0]) * Z[0] : H0[V0] + (v0.sc.v[V0] - H0[V0]) * Z;
                        if (e.fillColorAnim && e.fc) {
                            if (v0.fc.propType) for (V0 = 0; V0 < 3; V0 += 1) X0[V0] = Z.length ? X0[V0] + (v0.fc.v[V0] - X0[V0]) * Z[0] : X0[V0] + (v0.fc.v[V0] - X0[V0]) * Z;
                            v0.fh.propType && (X0 = addHueToRGB(X0, Z.length ? v0.fh.v * Z[0] : v0.fh.v * Z)), v0.fs.propType && (X0 = addSaturationToRGB(X0, Z.length ? v0.fs.v * Z[0] : v0.fs.v * Z)), v0.fb.propType && (X0 = addBrightnessToRGB(X0, Z.length ? v0.fb.v * Z[0] : v0.fb.v * Z))
                        }
                    }
                    for (C0 = 0; C0 < J0; C0 += 1) (v0 = a0[C0].a).p.propType && (Z = a0[C0].s.getMult(b0[h].anIndexes[C0], d0.a[C0].s.totalChars), this._hasMaskedPath ? Z.length ? A0.translate(0, v0.p.v[1] * Z[0], -v0.p.v[2] * Z[1]) : A0.translate(0, v0.p.v[1] * Z, -v0.p.v[2] * Z) : Z.length ? A0.translate(v0.p.v[0] * Z[0], v0.p.v[1] * Z[1], -v0.p.v[2] * Z[2]) : A0.translate(v0.p.v[0] * Z, v0.p.v[1] * Z, -v0.p.v[2] * Z));
                    if (e.strokeWidthAnim && (b1 = K0 < 0 ? 0 : K0), e.strokeColorAnim && (Y0 = "rgb(" + Math.round(255 * H0[0]) + "," + Math.round(255 * H0[1]) + "," + Math.round(255 * H0[2]) + ")"), e.fillColorAnim && e.fc && (Z0 = "rgb(" + Math.round(255 * X0[0]) + "," + Math.round(255 * X0[1]) + "," + Math.round(255 * X0[2]) + ")"), this._hasMaskedPath) {
                        if (A0.translate(0, -e.ls), A0.translate(0, M0[1] * c0 / 100 + s, 0), d0.p.p) {
                            var $ = 180 * Math.atan((R.point[1] - L.point[1]) / (R.point[0] - L.point[0])) / Math.PI;
                            R.point[0] < L.point[0] && ($ += 180), A0.rotate(-$ * Math.PI / 180)
                        }
                        A0.translate(L0, p0, 0), T -= M0[0] * b0[h].an / 200, b0[h + 1] && R0 !== b0[h + 1].ind && (T += b0[h].an / 2, T += e.tr / 1e3 * e.finalSize)
                    } else {
                        switch (A0.translate(a, s, 0), e.ps && A0.translate(e.ps[0], e.ps[1] + e.ascent, 0), e.j) {
                            case 1:
                                A0.translate(b0[h].animatorJustifyOffset + e.justifyOffset + (e.boxWidth - e.lineWidths[b0[h].line]), 0, 0);
                                break;
                            case 2:
                                A0.translate(b0[h].animatorJustifyOffset + e.justifyOffset + (e.boxWidth - e.lineWidths[b0[h].line]) / 2, 0, 0)
                        }
                        A0.translate(0, -e.ls), A0.translate(m0, 0, 0), A0.translate(M0[0] * b0[h].an / 200, M0[1] * c0 / 100, 0), a += b0[h].l + e.tr / 1e3 * e.finalSize
                    }
                    "html" === E0 ? g0 = A0.toCSS() : "svg" === E0 ? g0 = A0.to2dCSS() : p1 = [A0.props[0], A0.props[1], A0.props[2], A0.props[3], A0.props[4], A0.props[5], A0.props[6], A0.props[7], A0.props[8], A0.props[9], A0.props[10], A0.props[11], A0.props[12], A0.props[13], A0.props[14], A0.props[15]], m1 = _0
                }
                this.lettersChangedFlag = k0 <= h ? (y0 = new LetterProps(m1, b1, Y0, Z0, g0, p1), this.renderedLetters.push(y0), k0 += 1, !0) : (y0 = this.renderedLetters[h]).update(m1, b1, Y0, Z0, g0, p1) || this.lettersChangedFlag
            }
        }
    }, TextAnimatorProperty.prototype.getValue = function () {
        this._elem.globalData.frameId !== this._frameId && (this._frameId = this._elem.globalData.frameId, this.iterateDynamicProperties())
    }, TextAnimatorProperty.prototype.mHelper = new Matrix, TextAnimatorProperty.prototype.defaultPropsArray = [], extendPrototype([DynamicPropertyContainer], TextAnimatorProperty), LetterProps.prototype.update = function (e, r, a, s, h, n) {
        this._mdf.o = !1, this._mdf.sw = !1, this._mdf.sc = !1, this._mdf.fc = !1, this._mdf.m = !1;
        var m = this._mdf.p = !1;
        return this.o !== e && (this.o = e, m = this._mdf.o = !0), this.sw !== r && (this.sw = r, m = this._mdf.sw = !0), this.sc !== a && (this.sc = a, m = this._mdf.sc = !0), this.fc !== s && (this.fc = s, m = this._mdf.fc = !0), this.m !== h && (this.m = h, m = this._mdf.m = !0), !n.length || this.p[0] === n[0] && this.p[1] === n[1] && this.p[4] === n[4] && this.p[5] === n[5] && this.p[12] === n[12] && this.p[13] === n[13] || (this.p = n, m = this._mdf.p = !0), m
    }, TextProperty.prototype.defaultBoxWidth = [0, 0], TextProperty.prototype.copyData = function (e, r) {
        for (var a in r) r.hasOwnProperty(a) && (e[a] = r[a]);
        return e
    }, TextProperty.prototype.setCurrentData = function (e) {
        e.__complete || this.completeTextData(e), this.currentData = e, this.currentData.boxWidth = this.currentData.boxWidth || this.defaultBoxWidth, this._mdf = !0
    }, TextProperty.prototype.searchProperty = function () {
        return this.searchKeyframes()
    }, TextProperty.prototype.searchKeyframes = function () {
        return this.kf = 1 < this.data.d.k.length, this.kf && this.addEffect(this.getKeyframeValue.bind(this)), this.kf
    }, TextProperty.prototype.addEffect = function (e) {
        this.effectsSequence.push(e), this.elem.addDynamicProperty(this)
    }, TextProperty.prototype.getValue = function (e) {
        if (this.elem.globalData.frameId !== this.frameId && this.effectsSequence.length || e) {
            this.currentData.t = this.data.d.k[this.keysIndex].s.t;
            var r = this.currentData, a = this.keysIndex;
            if (this.lock) this.setCurrentData(this.currentData); else {
                this.lock = !0, this._mdf = !1;
                var s, h = this.effectsSequence.length, n = e || this.data.d.k[this.keysIndex].s;
                for (s = 0; s < h; s += 1) n = this.effectsSequence[s](a !== this.keysIndex ? n : this.currentData, n.t);
                r !== n && this.setCurrentData(n), this.pv = this.v = this.currentData, this.lock = !1, this.frameId = this.elem.globalData.frameId
            }
        }
    }, TextProperty.prototype.getKeyframeValue = function () {
        for (var e = this.data.d.k, r = this.elem.comp.renderedFrame, a = 0, s = e.length; a <= s - 1 && !(a === s - 1 || e[a + 1].t > r);) a += 1;
        return this.keysIndex !== a && (this.keysIndex = a), this.data.d.k[this.keysIndex].s
    }, TextProperty.prototype.buildFinalText = function (e) {
        for (var r, a = FontManager.getCombinedCharacterCodes(), s = [], h = 0, n = e.length; h < n;) r = e.charCodeAt(h), -1 !== a.indexOf(r) ? s[s.length - 1] += e.charAt(h) : 55296 <= r && r <= 56319 && 56320 <= (r = e.charCodeAt(h + 1)) && r <= 57343 ? (s.push(e.substr(h, 2)), ++h) : s.push(e.charAt(h)), h += 1;
        return s
    }, TextProperty.prototype.completeTextData = function (e) {
        e.__complete = !0;
        var r, a, s, h, n, m, T, R = this.elem.globalData.fontManager, k = this.data, U = [], W = 0, S = k.m.g, L = 0,
            M = 0, v = 0, g = [], x = 0, Q = 0, t0 = R.getFontByName(e.f), s0 = 0,
            M0 = t0.fStyle ? t0.fStyle.split(" ") : [], a0 = "normal", d0 = "normal";
        for (a = M0.length, r = 0; r < a; r += 1) switch (M0[r].toLowerCase()) {
            case"italic":
                d0 = "italic";
                break;
            case"bold":
                a0 = "700";
                break;
            case"black":
                a0 = "900";
                break;
            case"medium":
                a0 = "500";
                break;
            case"regular":
            case"normal":
                a0 = "400";
                break;
            case"light":
            case"thin":
                a0 = "200"
        }
        e.fWeight = t0.fWeight || a0, e.fStyle = d0, e.finalSize = e.s, e.finalText = this.buildFinalText(e.t), a = e.finalText.length, e.finalLineHeight = e.lh;
        var A0, E0 = e.tr / 1e3 * e.finalSize;
        if (e.sz) for (var k0, b0, q0 = !0, N0 = e.sz[0], v0 = e.sz[1]; q0;) {
            x = k0 = 0, a = (b0 = this.buildFinalText(e.t)).length, E0 = e.tr / 1e3 * e.finalSize;
            var C0 = -1;
            for (r = 0; r < a; r += 1) A0 = b0[r].charCodeAt(0), s = !1, " " === b0[r] ? C0 = r : 13 !== A0 && 3 !== A0 || (s = !(x = 0), k0 += e.finalLineHeight || 1.2 * e.finalSize), N0 < x + (s0 = R.chars ? (T = R.getCharData(b0[r], t0.fStyle, t0.fFamily), s ? 0 : T.w * e.finalSize / 100) : R.measureText(b0[r], e.f, e.finalSize)) && " " !== b0[r] ? (-1 === C0 ? a += 1 : r = C0, k0 += e.finalLineHeight || 1.2 * e.finalSize, b0.splice(r, C0 === r ? 1 : 0, "\r"), C0 = -1, x = 0) : (x += s0, x += E0);
            k0 += t0.ascent * e.finalSize / 100, this.canResize && e.finalSize > this.minimumFontSize && v0 < k0 ? (e.finalSize -= 1, e.finalLineHeight = e.finalSize * e.lh / e.s) : (e.finalText = b0, a = e.finalText.length, q0 = !1)
        }
        x = -E0;
        var J0, y0 = s0 = 0;
        for (r = 0; r < a; r += 1) if (s = !1, A0 = (J0 = e.finalText[r]).charCodeAt(0), " " === J0 ? h = "\xa0" : 13 === A0 || 3 === A0 ? (y0 = 0, g.push(x), Q = Q < x ? x : Q, x = -2 * E0, s = !(h = ""), v += 1) : h = e.finalText[r], s0 = R.chars ? (T = R.getCharData(J0, t0.fStyle, R.getFontByName(e.f).fFamily), s ? 0 : T.w * e.finalSize / 100) : R.measureText(h, e.f, e.finalSize), " " === J0 ? y0 += s0 + E0 : (x += s0 + E0 + y0, y0 = 0), U.push({
            l: s0,
            an: s0,
            add: L,
            n: s,
            anIndexes: [],
            val: h,
            line: v,
            animatorJustifyOffset: 0
        }), 2 == S) {
            if (L += s0, "" === h || "\xa0" === h || r === a - 1) {
                for ("" !== h && "\xa0" !== h || (L -= s0); M <= r;) U[M].an = L, U[M].ind = W, U[M].extra = s0, M += 1;
                W += 1, L = 0
            }
        } else if (3 == S) {
            if (L += s0, "" === h || r === a - 1) {
                for ("" === h && (L -= s0); M <= r;) U[M].an = L, U[M].ind = W, U[M].extra = s0, M += 1;
                L = 0, W += 1
            }
        } else U[W].ind = W, U[W].extra = 0, W += 1;
        if (e.l = U, Q = Q < x ? x : Q, g.push(x), e.sz) e.boxWidth = e.sz[0], e.justifyOffset = 0; else switch (e.boxWidth = Q, e.j) {
            case 1:
                e.justifyOffset = -e.boxWidth;
                break;
            case 2:
                e.justifyOffset = -e.boxWidth / 2;
                break;
            default:
                e.justifyOffset = 0
        }
        e.lineWidths = g;
        var c0, O0, Z = k.a;
        m = Z.length;
        var m0, L0, p0 = [];
        for (n = 0; n < m; n += 1) {
            for ((c0 = Z[n]).a.sc && (e.strokeColorAnim = !0), c0.a.sw && (e.strokeWidthAnim = !0), (c0.a.fc || c0.a.fh || c0.a.fs || c0.a.fb) && (e.fillColorAnim = !0), L0 = 0, m0 = c0.s.b, r = 0; r < a; r += 1) (O0 = U[r]).anIndexes[n] = L0, (1 == m0 && "" !== O0.val || 2 == m0 && "" !== O0.val && "\xa0" !== O0.val || 3 == m0 && (O0.n || "\xa0" == O0.val || r == a - 1) || 4 == m0 && (O0.n || r == a - 1)) && (1 === c0.s.rn && p0.push(L0), L0 += 1);
            k.a[n].s.totalChars = L0;
            var _0, H0 = -1;
            if (1 === c0.s.rn) for (r = 0; r < a; r += 1) H0 != (O0 = U[r]).anIndexes[n] && (H0 = O0.anIndexes[n], _0 = p0.splice(Math.floor(Math.random() * p0.length), 1)[0]), O0.anIndexes[n] = _0
        }
        e.yOffset = e.finalLineHeight || 1.2 * e.finalSize, e.ls = e.ls || 0, e.ascent = t0.ascent * e.finalSize / 100
    }, TextProperty.prototype.updateDocumentData = function (e, r) {
        var a = this.copyData({}, this.data.d.k[r = void 0 === r ? this.keysIndex : r].s);
        a = this.copyData(a, e), this.data.d.k[r].s = a, this.recalculate(r), this.elem.addDynamicProperty(this)
    }, TextProperty.prototype.recalculate = function (e) {
        var r = this.data.d.k[e].s;
        r.__complete = !1, this.keysIndex = 0, this._isFirstFrame = !0, this.getValue(r)
    }, TextProperty.prototype.canResizeFont = function (e) {
        this.canResize = e, this.recalculate(this.keysIndex), this.elem.addDynamicProperty(this)
    }, TextProperty.prototype.setMinimumFontSize = function (e) {
        this.minimumFontSize = Math.floor(e) || 1, this.recalculate(this.keysIndex), this.elem.addDynamicProperty(this)
    };
    var TextSelectorProp = function () {
            var e = Math.max, r = Math.min, a = Math.floor;

            function s(h, n) {
                this._currentTextLength = -1, this.k = !1, this.data = n, this.elem = h, this.comp = h.comp, this.finalS = 0, this.finalE = 0, this.initDynamicPropertyContainer(h), this.s = PropertyFactory.getProp(h, n.s || {k: 0}, 0, 0, this), this.e = "e" in n ? PropertyFactory.getProp(h, n.e, 0, 0, this) : {v: 100}, this.o = PropertyFactory.getProp(h, n.o || {k: 0}, 0, 0, this), this.xe = PropertyFactory.getProp(h, n.xe || {k: 0}, 0, 0, this), this.ne = PropertyFactory.getProp(h, n.ne || {k: 0}, 0, 0, this), this.a = PropertyFactory.getProp(h, n.a, 0, .01, this), this.dynamicProperties.length || this.getValue()
            }

            return s.prototype = {
                getMult: function (h) {
                    this._currentTextLength !== this.elem.textProperty.currentData.l.length && this.getValue();
                    var n = 0, m = 0, T = 1, R = 1;
                    0 < this.ne.v ? n = this.ne.v / 100 : m = -this.ne.v / 100, 0 < this.xe.v ? T = 1 - this.xe.v / 100 : R = 1 + this.xe.v / 100;
                    var k = BezierFactory.getBezierEasing(n, m, T, R).get, U = 0, W = this.finalS, S = this.finalE,
                        L = this.data.sh;
                    if (2 === L) U = k(U = S === W ? S <= h ? 1 : 0 : e(0, r(.5 / (S - W) + (h - W) / (S - W), 1))); else if (3 === L) U = k(U = S === W ? S <= h ? 0 : 1 : 1 - e(0, r(.5 / (S - W) + (h - W) / (S - W), 1))); else if (4 === L) S === W ? U = 0 : (U = e(0, r(.5 / (S - W) + (h - W) / (S - W), 1))) < .5 ? U *= 2 : U = 1 - 2 * (U - .5), U = k(U); else if (5 === L) {
                        if (S === W) U = 0; else {
                            var M = S - W, v = -M / 2 + (h = r(e(0, h + .5 - W), S - W)), g = M / 2;
                            U = Math.sqrt(1 - v * v / (g * g))
                        }
                        U = k(U)
                    } else U = 6 === L ? k(U = S === W ? 0 : (h = r(e(0, h + .5 - W), S - W), (1 + Math.cos(Math.PI + 2 * Math.PI * h / (S - W))) / 2)) : (h >= a(W) && (U = e(0, r(h - W < 0 ? r(S, 1) - (W - h) : S - h, 1))), k(U));
                    return U * this.a.v
                }, getValue: function (h) {
                    this.iterateDynamicProperties(), this._mdf = h || this._mdf, this._currentTextLength = this.elem.textProperty.currentData.l.length || 0, h && 2 === this.data.r && (this.e.v = this._currentTextLength);
                    var n = 2 === this.data.r ? 1 : 100 / this.data.totalChars, m = this.o.v / n, T = this.s.v / n + m,
                        R = this.e.v / n + m;
                    if (R < T) {
                        var k = T;
                        T = R, R = k
                    }
                    this.finalS = T, this.finalE = R
                }
            }, extendPrototype([DynamicPropertyContainer], s), {
                getTextSelectorProp: function (h, n, m) {
                    return new s(h, n, m)
                }
            }
        }(), pool_factory = function (e, r, a, s) {
            var h = 0, n = e, m = createSizedArray(n);
            return {
                newElement: function T() {
                    return h ? m[h -= 1] : r()
                }, release: function (R) {
                    h === n && (m = pooling.double(m), n *= 2), a && a(R), m[h] = R, h += 1
                }
            }
        }, pooling = {
            double: function (e) {
                return e.concat(createSizedArray(e.length))
            }
        }, point_pool = pool_factory(8, function () {
            return createTypedArray("float32", 2)
        }), shape_pool = (KA = pool_factory(4, function () {
            return new ShapePath
        }, function (e) {
            var r, a = e._length;
            for (r = 0; r < a; r += 1) point_pool.release(e.v[r]), point_pool.release(e.i[r]), point_pool.release(e.o[r]), e.v[r] = null, e.i[r] = null, e.o[r] = null;
            e._length = 0, e.c = !1
        }), KA.clone = function (e) {
            var r, a = KA.newElement(), s = void 0 === e._length ? e.v.length : e._length;
            for (a.setLength(s), a.c = e.c, r = 0; r < s; r += 1) a.setTripleAt(e.v[r][0], e.v[r][1], e.o[r][0], e.o[r][1], e.i[r][0], e.i[r][1], r);
            return a
        }, KA), KA, shapeCollection_pool = (TA = {
            newShapeCollection: function () {
                return UA ? WA[UA -= 1] : new ShapeCollection
            }, release: function (e) {
                var r, a = e._length;
                for (r = 0; r < a; r += 1) shape_pool.release(e.shapes[r]);
                e._length = 0, UA === VA && (WA = pooling.double(WA), VA *= 2), WA[UA] = e, UA += 1
            }
        }, UA = 0, VA = 4, WA = createSizedArray(VA), TA), TA, UA, VA, WA,
        segments_length_pool = pool_factory(8, function () {
            return {lengths: [], totalLength: 0}
        }, function (e) {
            var r, a = e.lengths.length;
            for (r = 0; r < a; r += 1) bezier_length_pool.release(e.lengths[r]);
            e.lengths.length = 0
        }), bezier_length_pool = pool_factory(8, function () {
            return {
                addedLength: 0,
                percents: createTypedArray("float32", defaultCurveSegments),
                lengths: createTypedArray("float32", defaultCurveSegments)
            }
        });

    function BaseRenderer() {
    }

    function SVGRenderer(e, r) {
        this.animationItem = e, this.layers = null, this.renderedFrame = -1, this.svgElement = createNS("svg");
        var a = "";
        if (r && r.title) {
            var s = createNS("title"), h = createElementID();
            s.setAttribute("id", h), s.textContent = r.title, this.svgElement.appendChild(s), a += h
        }
        if (r && r.description) {
            var n = createNS("desc"), m = createElementID();
            n.setAttribute("id", m), n.textContent = r.description, this.svgElement.appendChild(n), a += " " + m
        }
        a && this.svgElement.setAttribute("aria-labelledby", a);
        var T = createNS("defs");
        this.svgElement.appendChild(T);
        var R = createNS("g");
        this.svgElement.appendChild(R), this.layerElement = R, this.renderConfig = {
            preserveAspectRatio: r && r.preserveAspectRatio || "xMidYMid meet",
            imagePreserveAspectRatio: r && r.imagePreserveAspectRatio || "xMidYMid slice",
            progressiveLoad: r && r.progressiveLoad || !1,
            hideOnTransparent: !r || !1 !== r.hideOnTransparent,
            viewBoxOnly: r && r.viewBoxOnly || !1,
            viewBoxSize: r && r.viewBoxSize || !1,
            className: r && r.className || "",
            id: r && r.id || "",
            focusable: r && r.focusable
        }, this.globalData = {
            _mdf: !1,
            frameNum: -1,
            defs: T,
            renderConfig: this.renderConfig
        }, this.elements = [], this.pendingElements = [], this.destroyed = !1, this.rendererType = "svg"
    }

    function CanvasRenderer(e, r) {
        this.animationItem = e, this.renderConfig = {
            clearCanvas: !r || void 0 === r.clearCanvas || r.clearCanvas,
            context: r && r.context || null,
            progressiveLoad: r && r.progressiveLoad || !1,
            preserveAspectRatio: r && r.preserveAspectRatio || "xMidYMid meet",
            imagePreserveAspectRatio: r && r.imagePreserveAspectRatio || "xMidYMid slice",
            className: r && r.className || "",
            id: r && r.id || ""
        }, this.renderConfig.dpr = r && r.dpr || 1, this.animationItem.wrapper && (this.renderConfig.dpr = r && r.dpr || window.devicePixelRatio || 1), this.renderedFrame = -1, this.globalData = {
            frameNum: -1,
            _mdf: !1,
            renderConfig: this.renderConfig,
            currentGlobalAlpha: -1
        }, this.contextData = new CVContextData, this.elements = [], this.pendingElements = [], this.transformMat = new Matrix, this.completeLayers = !1, this.rendererType = "canvas"
    }

    function HybridRenderer(e, r) {
        this.animationItem = e, this.layers = null, this.renderedFrame = -1, this.renderConfig = {
            className: r && r.className || "",
            imagePreserveAspectRatio: r && r.imagePreserveAspectRatio || "xMidYMid slice",
            hideOnTransparent: !r || !1 !== r.hideOnTransparent
        }, this.globalData = {
            _mdf: !1,
            frameNum: -1,
            renderConfig: this.renderConfig
        }, this.pendingElements = [], this.elements = [], this.threeDElements = [], this.destroyed = !1, this.camera = null, this.supports3d = !0, this.rendererType = "html"
    }

    function MaskElement(e, r, a) {
        this.data = e, this.element = r, this.globalData = a, this.storedData = [], this.masksProperties = this.data.masksProperties || [], this.maskElement = null;
        var s, h = this.globalData.defs, n = this.masksProperties ? this.masksProperties.length : 0;
        this.viewData = createSizedArray(n), this.solidPath = "";
        var m, T, R, k, U, W, S, L = this.masksProperties, M = 0, v = [], g = createElementID(), x = "clipPath",
            Q = "clip-path";
        for (s = 0; s < n; s++) if (("a" !== L[s].mode && "n" !== L[s].mode || L[s].inv || 100 !== L[s].o.k || L[s].o.x) && (Q = x = "mask"), "s" != L[s].mode && "i" != L[s].mode || 0 !== M ? k = null : ((k = createNS("rect")).setAttribute("fill", "#ffffff"), k.setAttribute("width", this.element.comp.data.w || 0), k.setAttribute("height", this.element.comp.data.h || 0), v.push(k)), m = createNS("path"), "n" != L[s].mode) {
            var t0;
            if (M += 1, m.setAttribute("fill", "s" === L[s].mode ? "#000000" : "#ffffff"), m.setAttribute("clip-rule", "nonzero"), 0 !== L[s].x.k ? (Q = x = "mask", S = PropertyFactory.getProp(this.element, L[s].x, 0, null, this.element), t0 = createElementID(), (U = createNS("filter")).setAttribute("id", t0), (W = createNS("feMorphology")).setAttribute("operator", "erode"), W.setAttribute("in", "SourceGraphic"), W.setAttribute("radius", "0"), U.appendChild(W), h.appendChild(U), m.setAttribute("stroke", "s" === L[s].mode ? "#000000" : "#ffffff")) : S = W = null, this.storedData[s] = {
                elem: m,
                x: S,
                expan: W,
                lastPath: "",
                lastOperator: "",
                filterId: t0,
                lastRadius: 0
            }, "i" == L[s].mode) {
                R = v.length;
                var s0 = createNS("g");
                for (T = 0; T < R; T += 1) s0.appendChild(v[T]);
                var M0 = createNS("mask");
                M0.setAttribute("mask-type", "alpha"), M0.setAttribute("id", g + "_" + M), M0.appendChild(m), h.appendChild(M0), s0.setAttribute("mask", "url(" + locationHref + "#" + g + "_" + M + ")"), v.length = 0, v.push(s0)
            } else v.push(m);
            L[s].inv && !this.solidPath && (this.solidPath = this.createLayerSolidPath()), this.viewData[s] = {
                elem: m,
                lastPath: "",
                op: PropertyFactory.getProp(this.element, L[s].o, 0, .01, this.element),
                prop: ShapePropertyFactory.getShapeProp(this.element, L[s], 3),
                invRect: k
            }, this.viewData[s].prop.k || this.drawPath(L[s], this.viewData[s].prop.v, this.viewData[s])
        } else this.viewData[s] = {
            op: PropertyFactory.getProp(this.element, L[s].o, 0, .01, this.element),
            prop: ShapePropertyFactory.getShapeProp(this.element, L[s], 3),
            elem: m,
            lastPath: ""
        }, h.appendChild(m);
        for (this.maskElement = createNS(x), n = v.length, s = 0; s < n; s += 1) this.maskElement.appendChild(v[s]);
        0 < M && (this.maskElement.setAttribute("id", g), this.element.maskedElement.setAttribute(Q, "url(" + locationHref + "#" + g + ")"), h.appendChild(this.maskElement)), this.viewData.length && this.element.addRenderableComponent(this)
    }

    function HierarchyElement() {
    }

    function FrameElement() {
    }

    function TransformElement() {
    }

    function RenderableElement() {
    }

    function RenderableDOMElement() {
    }

    function ProcessedElement(e, r) {
        this.elem = e, this.pos = r
    }

    function SVGStyleData(e, r) {
        this.data = e, this.type = e.ty, this.d = "", this.lvl = r, this._mdf = !1, this.closed = !0 === e.hd, this.pElem = createNS("path"), this.msElem = null
    }

    function SVGShapeData(e, r, a) {
        this.caches = [], this.styles = [], this.transformers = e, this.lStr = "", this.sh = a, this.lvl = r, this._isAnimated = !!a.k;
        for (var s = 0, h = e.length; s < h;) {
            if (e[s].mProps.dynamicProperties.length) {
                this._isAnimated = !0;
                break
            }
            s += 1
        }
    }

    function SVGTransformData(e, r, a) {
        this.transform = {
            mProps: e,
            op: r,
            container: a
        }, this.elements = [], this._isAnimated = this.transform.mProps.dynamicProperties.length || this.transform.op.effectsSequence.length
    }

    function SVGStrokeStyleData(e, r, a) {
        this.initDynamicPropertyContainer(e), this.getValue = this.iterateDynamicProperties, this.o = PropertyFactory.getProp(e, r.o, 0, .01, this), this.w = PropertyFactory.getProp(e, r.w, 0, null, this), this.d = new DashProperty(e, r.d || {}, "svg", this), this.c = PropertyFactory.getProp(e, r.c, 1, 255, this), this.style = a, this._isAnimated = !!this._isAnimated
    }

    function SVGFillStyleData(e, r, a) {
        this.initDynamicPropertyContainer(e), this.getValue = this.iterateDynamicProperties, this.o = PropertyFactory.getProp(e, r.o, 0, .01, this), this.c = PropertyFactory.getProp(e, r.c, 1, 255, this), this.style = a
    }

    function SVGGradientFillStyleData(e, r, a) {
        this.initDynamicPropertyContainer(e), this.getValue = this.iterateDynamicProperties, this.initGradientData(e, r, a)
    }

    function SVGGradientStrokeStyleData(e, r, a) {
        this.initDynamicPropertyContainer(e), this.getValue = this.iterateDynamicProperties, this.w = PropertyFactory.getProp(e, r.w, 0, null, this), this.d = new DashProperty(e, r.d || {}, "svg", this), this.initGradientData(e, r, a), this._isAnimated = !!this._isAnimated
    }

    function ShapeGroupData() {
        this.it = [], this.prevViewData = [], this.gr = createNS("g")
    }

    BaseRenderer.prototype.checkLayers = function (e) {
        var r, a, s = this.layers.length;
        for (this.completeLayers = !0, r = s - 1; 0 <= r; r--) this.elements[r] || (a = this.layers[r]).ip - a.st <= e - this.layers[r].st && a.op - a.st > e - this.layers[r].st && this.buildItem(r), this.completeLayers = !!this.elements[r] && this.completeLayers;
        this.checkPendingElements()
    }, BaseRenderer.prototype.createItem = function (e) {
        switch (e.ty) {
            case 2:
                return this.createImage(e);
            case 0:
                return this.createComp(e);
            case 1:
                return this.createSolid(e);
            case 3:
                return this.createNull(e);
            case 4:
                return this.createShape(e);
            case 5:
                return this.createText(e);
            case 13:
                return this.createCamera(e)
        }
        return this.createNull(e)
    }, BaseRenderer.prototype.createCamera = function () {
        throw new Error("You're using a 3d camera. Try the html renderer.")
    }, BaseRenderer.prototype.buildAllItems = function () {
        var e, r = this.layers.length;
        for (e = 0; e < r; e += 1) this.buildItem(e);
        this.checkPendingElements()
    }, BaseRenderer.prototype.includeLayers = function (e) {
        this.completeLayers = !1;
        var r, a, s = e.length, h = this.layers.length;
        for (r = 0; r < s; r += 1) for (a = 0; a < h;) {
            if (this.layers[a].id == e[r].id) {
                this.layers[a] = e[r];
                break
            }
            a += 1
        }
    }, BaseRenderer.prototype.setProjectInterface = function (e) {
        this.globalData.projectInterface = e
    }, BaseRenderer.prototype.initItems = function () {
        this.globalData.progressiveLoad || this.buildAllItems()
    }, BaseRenderer.prototype.buildElementParenting = function (e, r, a) {
        for (var s = this.elements, h = this.layers, n = 0, m = h.length; n < m;) h[n].ind == r && (s[n] && !0 !== s[n] ? (a.push(s[n]), s[n].setAsParent(), void 0 !== h[n].parent ? this.buildElementParenting(e, h[n].parent, a) : e.setHierarchy(a)) : (this.buildItem(n), this.addPendingElement(e))), n += 1
    }, BaseRenderer.prototype.addPendingElement = function (e) {
        this.pendingElements.push(e)
    }, BaseRenderer.prototype.searchExtraCompositions = function (e) {
        var r, a = e.length;
        for (r = 0; r < a; r += 1) if (e[r].xt) {
            var s = this.createComp(e[r]);
            s.initExpressions(), this.globalData.projectInterface.registerComposition(s)
        }
    }, BaseRenderer.prototype.setupGlobalData = function (e, r) {
        this.globalData.fontManager = new FontManager, this.globalData.fontManager.addChars(e.chars), this.globalData.fontManager.addFonts(e.fonts, r), this.globalData.getAssetData = this.animationItem.getAssetData.bind(this.animationItem), this.globalData.getAssetsPath = this.animationItem.getAssetsPath.bind(this.animationItem), this.globalData.imageLoader = this.animationItem.imagePreloader, this.globalData.frameId = 0, this.globalData.frameRate = e.fr, this.globalData.nm = e.nm, this.globalData.compSize = {
            w: e.w,
            h: e.h
        }
    }, extendPrototype([BaseRenderer], SVGRenderer), SVGRenderer.prototype.createNull = function (e) {
        return new NullElement(e, this.globalData, this)
    }, SVGRenderer.prototype.createShape = function (e) {
        return new SVGShapeElement(e, this.globalData, this)
    }, SVGRenderer.prototype.createText = function (e) {
        return new SVGTextElement(e, this.globalData, this)
    }, SVGRenderer.prototype.createImage = function (e) {
        return new IImageElement(e, this.globalData, this)
    }, SVGRenderer.prototype.createComp = function (e) {
        return new SVGCompElement(e, this.globalData, this)
    }, SVGRenderer.prototype.createSolid = function (e) {
        return new ISolidElement(e, this.globalData, this)
    }, SVGRenderer.prototype.configAnimation = function (e) {
        this.svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg"), this.svgElement.setAttribute("viewBox", this.renderConfig.viewBoxSize ? this.renderConfig.viewBoxSize : "0 0 " + e.w + " " + e.h), this.renderConfig.viewBoxOnly || (this.svgElement.setAttribute("width", e.w), this.svgElement.setAttribute("height", e.h), this.svgElement.style.width = "100%", this.svgElement.style.height = "100%", this.svgElement.style.transform = "translate3d(0,0,0)"), this.renderConfig.className && this.svgElement.setAttribute("class", this.renderConfig.className), this.renderConfig.id && this.svgElement.setAttribute("id", this.renderConfig.id), void 0 !== this.renderConfig.focusable && this.svgElement.setAttribute("focusable", this.renderConfig.focusable), this.svgElement.setAttribute("preserveAspectRatio", this.renderConfig.preserveAspectRatio), this.animationItem.wrapper.appendChild(this.svgElement);
        var r = this.globalData.defs;
        this.setupGlobalData(e, r), this.globalData.progressiveLoad = this.renderConfig.progressiveLoad, this.data = e;
        var a = createNS("clipPath"), s = createNS("rect");
        s.setAttribute("width", e.w), s.setAttribute("height", e.h), s.setAttribute("x", 0), s.setAttribute("y", 0);
        var h = createElementID();
        a.setAttribute("id", h), a.appendChild(s), this.layerElement.setAttribute("clip-path", "url(" + locationHref + "#" + h + ")"), r.appendChild(a), this.layers = e.layers, this.elements = createSizedArray(e.layers.length)
    }, SVGRenderer.prototype.destroy = function () {
        this.animationItem.wrapper.innerHTML = "", this.layerElement = null, this.globalData.defs = null;
        var e, r = this.layers ? this.layers.length : 0;
        for (e = 0; e < r; e++) this.elements[e] && this.elements[e].destroy();
        this.elements.length = 0, this.destroyed = !0, this.animationItem = null
    }, SVGRenderer.prototype.updateContainerSize = function () {
    }, SVGRenderer.prototype.buildItem = function (e) {
        var r = this.elements;
        if (!r[e] && 99 != this.layers[e].ty) {
            r[e] = !0;
            var a = this.createItem(this.layers[e]);
            r[e] = a, expressionsPlugin && (0 === this.layers[e].ty && this.globalData.projectInterface.registerComposition(a), a.initExpressions()), this.appendElementInPos(a, e), this.layers[e].tt && (this.elements[e - 1] && !0 !== this.elements[e - 1] ? a.setMatte(r[e - 1].layerId) : (this.buildItem(e - 1), this.addPendingElement(a)))
        }
    }, SVGRenderer.prototype.checkPendingElements = function () {
        for (; this.pendingElements.length;) {
            var e = this.pendingElements.pop();
            if (e.checkParenting(), e.data.tt) for (var r = 0, a = this.elements.length; r < a;) {
                if (this.elements[r] === e) {
                    e.setMatte(this.elements[r - 1].layerId);
                    break
                }
                r += 1
            }
        }
    }, SVGRenderer.prototype.renderFrame = function (e) {
        if (this.renderedFrame !== e && !this.destroyed) {
            null === e ? e = this.renderedFrame : this.renderedFrame = e, this.globalData.frameNum = e, this.globalData.frameId += 1, this.globalData.projectInterface.currentFrame = e, this.globalData._mdf = !1;
            var r, a = this.layers.length;
            for (this.completeLayers || this.checkLayers(e), r = a - 1; 0 <= r; r--) (this.completeLayers || this.elements[r]) && this.elements[r].prepareFrame(e - this.layers[r].st);
            if (this.globalData._mdf) for (r = 0; r < a; r += 1) (this.completeLayers || this.elements[r]) && this.elements[r].renderFrame()
        }
    }, SVGRenderer.prototype.appendElementInPos = function (e, r) {
        var a = e.getBaseElement();
        if (a) {
            for (var s, h = 0; h < r;) this.elements[h] && !0 !== this.elements[h] && this.elements[h].getBaseElement() && (s = this.elements[h].getBaseElement()), h += 1;
            s ? this.layerElement.insertBefore(a, s) : this.layerElement.appendChild(a)
        }
    }, SVGRenderer.prototype.hide = function () {
        this.layerElement.style.display = "none"
    }, SVGRenderer.prototype.show = function () {
        this.layerElement.style.display = "block"
    }, extendPrototype([BaseRenderer], CanvasRenderer), CanvasRenderer.prototype.createShape = function (e) {
        return new CVShapeElement(e, this.globalData, this)
    }, CanvasRenderer.prototype.createText = function (e) {
        return new CVTextElement(e, this.globalData, this)
    }, CanvasRenderer.prototype.createImage = function (e) {
        return new CVImageElement(e, this.globalData, this)
    }, CanvasRenderer.prototype.createComp = function (e) {
        return new CVCompElement(e, this.globalData, this)
    }, CanvasRenderer.prototype.createSolid = function (e) {
        return new CVSolidElement(e, this.globalData, this)
    }, CanvasRenderer.prototype.createNull = SVGRenderer.prototype.createNull, CanvasRenderer.prototype.ctxTransform = function (e) {
        if (1 !== e[0] || 0 !== e[1] || 0 !== e[4] || 1 !== e[5] || 0 !== e[12] || 0 !== e[13]) if (this.renderConfig.clearCanvas) {
            this.transformMat.cloneFromProps(e);
            var r = this.contextData.cTr.props;
            this.transformMat.transform(r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8], r[9], r[10], r[11], r[12], r[13], r[14], r[15]), this.contextData.cTr.cloneFromProps(this.transformMat.props);
            var a = this.contextData.cTr.props;
            this.canvasContext.setTransform(a[0], a[1], a[4], a[5], a[12], a[13])
        } else this.canvasContext.transform(e[0], e[1], e[4], e[5], e[12], e[13])
    }, CanvasRenderer.prototype.ctxOpacity = function (e) {
        if (!this.renderConfig.clearCanvas) return this.canvasContext.globalAlpha *= e < 0 ? 0 : e, void (this.globalData.currentGlobalAlpha = this.contextData.cO);
        this.contextData.cO *= e < 0 ? 0 : e, this.globalData.currentGlobalAlpha !== this.contextData.cO && (this.canvasContext.globalAlpha = this.contextData.cO, this.globalData.currentGlobalAlpha = this.contextData.cO)
    }, CanvasRenderer.prototype.reset = function () {
        this.renderConfig.clearCanvas ? this.contextData.reset() : this.canvasContext.restore()
    }, CanvasRenderer.prototype.save = function (e) {
        if (this.renderConfig.clearCanvas) {
            e && this.canvasContext.save();
            var r = this.contextData.cTr.props;
            this.contextData._length <= this.contextData.cArrPos && this.contextData.duplicate();
            var a, s = this.contextData.saved[this.contextData.cArrPos];
            for (a = 0; a < 16; a += 1) s[a] = r[a];
            this.contextData.savedOp[this.contextData.cArrPos] = this.contextData.cO, this.contextData.cArrPos += 1
        } else this.canvasContext.save()
    }, CanvasRenderer.prototype.restore = function (e) {
        if (this.renderConfig.clearCanvas) {
            e && (this.canvasContext.restore(), this.globalData.blendMode = "source-over"), this.contextData.cArrPos -= 1;
            var r, a = this.contextData.saved[this.contextData.cArrPos], s = this.contextData.cTr.props;
            for (r = 0; r < 16; r += 1) s[r] = a[r];
            this.canvasContext.setTransform(a[0], a[1], a[4], a[5], a[12], a[13]), this.contextData.cO = a = this.contextData.savedOp[this.contextData.cArrPos], this.globalData.currentGlobalAlpha !== a && (this.canvasContext.globalAlpha = a, this.globalData.currentGlobalAlpha = a)
        } else this.canvasContext.restore()
    }, CanvasRenderer.prototype.configAnimation = function (e) {
        this.animationItem.wrapper ? (this.animationItem.container = createTag("canvas"), this.animationItem.container.style.width = "100%", this.animationItem.container.style.height = "100%", this.animationItem.container.style.transformOrigin = this.animationItem.container.style.mozTransformOrigin = this.animationItem.container.style.webkitTransformOrigin = this.animationItem.container.style["-webkit-transform"] = "0px 0px 0px", this.animationItem.wrapper.appendChild(this.animationItem.container), this.canvasContext = this.animationItem.container.getContext("2d"), this.renderConfig.className && this.animationItem.container.setAttribute("class", this.renderConfig.className), this.renderConfig.id && this.animationItem.container.setAttribute("id", this.renderConfig.id)) : this.canvasContext = this.renderConfig.context, this.data = e, this.layers = e.layers, this.transformCanvas = {
            w: e.w,
            h: e.h,
            sx: 0,
            sy: 0,
            tx: 0,
            ty: 0
        }, this.setupGlobalData(e, document.body), this.globalData.canvasContext = this.canvasContext, (this.globalData.renderer = this).globalData.isDashed = !1, this.globalData.progressiveLoad = this.renderConfig.progressiveLoad, this.globalData.transformCanvas = this.transformCanvas, this.elements = createSizedArray(e.layers.length), this.updateContainerSize()
    }, CanvasRenderer.prototype.updateContainerSize = function () {
        var e, r, a, s;
        if (this.reset(), this.animationItem.wrapper && this.animationItem.container ? (r = this.animationItem.wrapper.offsetHeight, this.animationItem.container.setAttribute("width", (e = this.animationItem.wrapper.offsetWidth) * this.renderConfig.dpr), this.animationItem.container.setAttribute("height", r * this.renderConfig.dpr)) : (e = this.canvasContext.canvas.width * this.renderConfig.dpr, r = this.canvasContext.canvas.height * this.renderConfig.dpr), -1 !== this.renderConfig.preserveAspectRatio.indexOf("meet") || -1 !== this.renderConfig.preserveAspectRatio.indexOf("slice")) {
            var h = this.renderConfig.preserveAspectRatio.split(" "), n = h[1] || "meet", m = h[0] || "xMidYMid",
                T = m.substr(0, 4), R = m.substr(4);
            this.transformCanvas.sy = (a = e / r) < (s = this.transformCanvas.w / this.transformCanvas.h) && "meet" === n || s < a && "slice" === n ? (this.transformCanvas.sx = e / (this.transformCanvas.w / this.renderConfig.dpr), e / (this.transformCanvas.w / this.renderConfig.dpr)) : (this.transformCanvas.sx = r / (this.transformCanvas.h / this.renderConfig.dpr), r / (this.transformCanvas.h / this.renderConfig.dpr)), this.transformCanvas.tx = "xMid" === T && (s < a && "meet" === n || a < s && "slice" === n) ? (e - this.transformCanvas.w * (r / this.transformCanvas.h)) / 2 * this.renderConfig.dpr : "xMax" === T && (s < a && "meet" === n || a < s && "slice" === n) ? (e - this.transformCanvas.w * (r / this.transformCanvas.h)) * this.renderConfig.dpr : 0, this.transformCanvas.ty = "YMid" === R && (a < s && "meet" === n || s < a && "slice" === n) ? (r - this.transformCanvas.h * (e / this.transformCanvas.w)) / 2 * this.renderConfig.dpr : "YMax" === R && (a < s && "meet" === n || s < a && "slice" === n) ? (r - this.transformCanvas.h * (e / this.transformCanvas.w)) * this.renderConfig.dpr : 0
        } else "none" == this.renderConfig.preserveAspectRatio ? (this.transformCanvas.sx = e / (this.transformCanvas.w / this.renderConfig.dpr), this.transformCanvas.sy = r / (this.transformCanvas.h / this.renderConfig.dpr)) : (this.transformCanvas.sx = this.renderConfig.dpr, this.transformCanvas.sy = this.renderConfig.dpr), this.transformCanvas.tx = 0, this.transformCanvas.ty = 0;
        this.transformCanvas.props = [this.transformCanvas.sx, 0, 0, 0, 0, this.transformCanvas.sy, 0, 0, 0, 0, 1, 0, this.transformCanvas.tx, this.transformCanvas.ty, 0, 1], this.ctxTransform(this.transformCanvas.props), this.canvasContext.beginPath(), this.canvasContext.rect(0, 0, this.transformCanvas.w, this.transformCanvas.h), this.canvasContext.closePath(), this.canvasContext.clip(), this.renderFrame(this.renderedFrame, !0)
    }, CanvasRenderer.prototype.destroy = function () {
        var e;
        for (this.renderConfig.clearCanvas && (this.animationItem.wrapper.innerHTML = ""), e = (this.layers ? this.layers.length : 0) - 1; 0 <= e; e -= 1) this.elements[e] && this.elements[e].destroy();
        this.elements.length = 0, this.globalData.canvasContext = null, this.animationItem.container = null, this.destroyed = !0
    }, CanvasRenderer.prototype.renderFrame = function (e, r) {
        if ((this.renderedFrame !== e || !0 !== this.renderConfig.clearCanvas || r) && !this.destroyed && -1 !== e) {
            this.renderedFrame = e, this.globalData.frameNum = e - this.animationItem._isFirstFrame, this.globalData.frameId += 1, this.globalData._mdf = !this.renderConfig.clearCanvas || r, this.globalData.projectInterface.currentFrame = e;
            var a, s = this.layers.length;
            for (this.completeLayers || this.checkLayers(e), a = 0; a < s; a++) (this.completeLayers || this.elements[a]) && this.elements[a].prepareFrame(e - this.layers[a].st);
            if (this.globalData._mdf) {
                for (!0 === this.renderConfig.clearCanvas ? this.canvasContext.clearRect(0, 0, this.transformCanvas.w, this.transformCanvas.h) : this.save(), a = s - 1; 0 <= a; a -= 1) (this.completeLayers || this.elements[a]) && this.elements[a].renderFrame();
                !0 !== this.renderConfig.clearCanvas && this.restore()
            }
        }
    }, CanvasRenderer.prototype.buildItem = function (e) {
        var r = this.elements;
        if (!r[e] && 99 != this.layers[e].ty) {
            var a = this.createItem(this.layers[e], this, this.globalData);
            (r[e] = a).initExpressions()
        }
    }, CanvasRenderer.prototype.checkPendingElements = function () {
        for (; this.pendingElements.length;) this.pendingElements.pop().checkParenting()
    }, CanvasRenderer.prototype.hide = function () {
        this.animationItem.container.style.display = "none"
    }, CanvasRenderer.prototype.show = function () {
        this.animationItem.container.style.display = "block"
    }, extendPrototype([BaseRenderer], HybridRenderer), HybridRenderer.prototype.buildItem = SVGRenderer.prototype.buildItem, HybridRenderer.prototype.checkPendingElements = function () {
        for (; this.pendingElements.length;) this.pendingElements.pop().checkParenting()
    }, HybridRenderer.prototype.appendElementInPos = function (e, r) {
        var a = e.getBaseElement();
        if (a) {
            var s = this.layers[r];
            if (s.ddd && this.supports3d) this.addTo3dContainer(a, r); else if (this.threeDElements) this.addTo3dContainer(a, r); else {
                for (var h, n, m = 0; m < r;) this.elements[m] && !0 !== this.elements[m] && this.elements[m].getBaseElement && (n = this.elements[m], h = (this.layers[m].ddd ? this.getThreeDContainerByPos(m) : n.getBaseElement()) || h), m += 1;
                h ? s.ddd && this.supports3d || this.layerElement.insertBefore(a, h) : s.ddd && this.supports3d || this.layerElement.appendChild(a)
            }
        }
    }, HybridRenderer.prototype.createShape = function (e) {
        return this.supports3d ? new HShapeElement(e, this.globalData, this) : new SVGShapeElement(e, this.globalData, this)
    }, HybridRenderer.prototype.createText = function (e) {
        return this.supports3d ? new HTextElement(e, this.globalData, this) : new SVGTextElement(e, this.globalData, this)
    }, HybridRenderer.prototype.createCamera = function (e) {
        return this.camera = new HCameraElement(e, this.globalData, this), this.camera
    }, HybridRenderer.prototype.createImage = function (e) {
        return this.supports3d ? new HImageElement(e, this.globalData, this) : new IImageElement(e, this.globalData, this)
    }, HybridRenderer.prototype.createComp = function (e) {
        return this.supports3d ? new HCompElement(e, this.globalData, this) : new SVGCompElement(e, this.globalData, this)
    }, HybridRenderer.prototype.createSolid = function (e) {
        return this.supports3d ? new HSolidElement(e, this.globalData, this) : new ISolidElement(e, this.globalData, this)
    }, HybridRenderer.prototype.createNull = SVGRenderer.prototype.createNull, HybridRenderer.prototype.getThreeDContainerByPos = function (e) {
        for (var r = 0, a = this.threeDElements.length; r < a;) {
            if (this.threeDElements[r].startPos <= e && this.threeDElements[r].endPos >= e) return this.threeDElements[r].perspectiveElem;
            r += 1
        }
    }, HybridRenderer.prototype.createThreeDContainer = function (e, r) {
        var a = createTag("div");
        styleDiv(a);
        var s = createTag("div");
        styleDiv(s), "3d" === r && (a.style.width = this.globalData.compSize.w + "px", a.style.height = this.globalData.compSize.h + "px", a.style.transformOrigin = a.style.mozTransformOrigin = a.style.webkitTransformOrigin = "50% 50%", s.style.transform = s.style.webkitTransform = "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)"), a.appendChild(s);
        var h = {container: s, perspectiveElem: a, startPos: e, endPos: e, type: r};
        return this.threeDElements.push(h), h
    }, HybridRenderer.prototype.build3dContainers = function () {
        var e, r, a = this.layers.length, s = "";
        for (e = 0; e < a; e += 1) this.layers[e].ddd && 3 !== this.layers[e].ty ? "3d" !== s && (s = "3d", r = this.createThreeDContainer(e, "3d")) : "2d" !== s && (s = "2d", r = this.createThreeDContainer(e, "2d")), r.endPos = Math.max(r.endPos, e);
        for (e = (a = this.threeDElements.length) - 1; 0 <= e; e--) this.resizerElem.appendChild(this.threeDElements[e].perspectiveElem)
    }, HybridRenderer.prototype.addTo3dContainer = function (e, r) {
        for (var a = 0, s = this.threeDElements.length; a < s;) {
            if (r <= this.threeDElements[a].endPos) {
                for (var h, n = this.threeDElements[a].startPos; n < r;) this.elements[n] && this.elements[n].getBaseElement && (h = this.elements[n].getBaseElement()), n += 1;
                h ? this.threeDElements[a].container.insertBefore(e, h) : this.threeDElements[a].container.appendChild(e);
                break
            }
            a += 1
        }
    }, HybridRenderer.prototype.configAnimation = function (e) {
        var r = createTag("div"), a = this.animationItem.wrapper;
        r.style.width = e.w + "px", r.style.height = e.h + "px", styleDiv(this.resizerElem = r), r.style.transformStyle = r.style.webkitTransformStyle = r.style.mozTransformStyle = "flat", this.renderConfig.className && r.setAttribute("class", this.renderConfig.className), a.appendChild(r), r.style.overflow = "hidden";
        var s = createNS("svg");
        s.setAttribute("width", "1"), s.setAttribute("height", "1"), styleDiv(s), this.resizerElem.appendChild(s);
        var h = createNS("defs");
        s.appendChild(h), this.data = e, this.setupGlobalData(e, s), this.globalData.defs = h, this.layers = e.layers, this.layerElement = this.resizerElem, this.build3dContainers(), this.updateContainerSize()
    }, HybridRenderer.prototype.destroy = function () {
        this.animationItem.wrapper.innerHTML = "", this.animationItem.container = null, this.globalData.defs = null;
        var e, r = this.layers ? this.layers.length : 0;
        for (e = 0; e < r; e++) this.elements[e].destroy();
        this.elements.length = 0, this.destroyed = !0, this.animationItem = null
    }, HybridRenderer.prototype.updateContainerSize = function () {
        var e, r, a, s, h = this.animationItem.wrapper.offsetWidth, n = this.animationItem.wrapper.offsetHeight;
        s = h / n < this.globalData.compSize.w / this.globalData.compSize.h ? (e = h / this.globalData.compSize.w, r = h / this.globalData.compSize.w, a = 0, (n - this.globalData.compSize.h * (h / this.globalData.compSize.w)) / 2) : (e = n / this.globalData.compSize.h, r = n / this.globalData.compSize.h, a = (h - this.globalData.compSize.w * (n / this.globalData.compSize.h)) / 2, 0), this.resizerElem.style.transform = this.resizerElem.style.webkitTransform = "matrix3d(" + e + ",0,0,0,0," + r + ",0,0,0,0,1,0," + a + "," + s + ",0,1)"
    }, HybridRenderer.prototype.renderFrame = SVGRenderer.prototype.renderFrame, HybridRenderer.prototype.hide = function () {
        this.resizerElem.style.display = "none"
    }, HybridRenderer.prototype.show = function () {
        this.resizerElem.style.display = "block"
    }, HybridRenderer.prototype.initItems = function () {
        if (this.buildAllItems(), this.camera) this.camera.setup(); else {
            var e, r = this.globalData.compSize.w, a = this.globalData.compSize.h, s = this.threeDElements.length;
            for (e = 0; e < s; e += 1) this.threeDElements[e].perspectiveElem.style.perspective = this.threeDElements[e].perspectiveElem.style.webkitPerspective = Math.sqrt(Math.pow(r, 2) + Math.pow(a, 2)) + "px"
        }
    }, HybridRenderer.prototype.searchExtraCompositions = function (e) {
        var r, a = e.length, s = createTag("div");
        for (r = 0; r < a; r += 1) if (e[r].xt) {
            var h = this.createComp(e[r], s, this.globalData.comp, null);
            h.initExpressions(), this.globalData.projectInterface.registerComposition(h)
        }
    }, MaskElement.prototype.getMaskProperty = function (e) {
        return this.viewData[e].prop
    }, MaskElement.prototype.renderFrame = function (e) {
        var r, a = this.element.finalTransform.mat, s = this.masksProperties.length;
        for (r = 0; r < s; r++) if ((this.viewData[r].prop._mdf || e) && this.drawPath(this.masksProperties[r], this.viewData[r].prop.v, this.viewData[r]), (this.viewData[r].op._mdf || e) && this.viewData[r].elem.setAttribute("fill-opacity", this.viewData[r].op.v), "n" !== this.masksProperties[r].mode && (this.viewData[r].invRect && (this.element.finalTransform.mProp._mdf || e) && this.viewData[r].invRect.setAttribute("transform", a.getInverseMatrix().to2dCSS()), this.storedData[r].x && (this.storedData[r].x._mdf || e))) {
            var h = this.storedData[r].expan;
            this.storedData[r].x.v < 0 ? ("erode" !== this.storedData[r].lastOperator && (this.storedData[r].lastOperator = "erode", this.storedData[r].elem.setAttribute("filter", "url(" + locationHref + "#" + this.storedData[r].filterId + ")")), h.setAttribute("radius", -this.storedData[r].x.v)) : ("dilate" !== this.storedData[r].lastOperator && (this.storedData[r].lastOperator = "dilate", this.storedData[r].elem.setAttribute("filter", null)), this.storedData[r].elem.setAttribute("stroke-width", 2 * this.storedData[r].x.v))
        }
    }, MaskElement.prototype.getMaskelement = function () {
        return this.maskElement
    }, MaskElement.prototype.createLayerSolidPath = function () {
        var e = "M0,0 ";
        return e += " h" + this.globalData.compSize.w, e += " v" + this.globalData.compSize.h, (e += " h-" + this.globalData.compSize.w) + " v-" + this.globalData.compSize.h + " "
    }, MaskElement.prototype.drawPath = function (e, r, a) {
        var s, h, n = " M" + r.v[0][0] + "," + r.v[0][1];
        for (h = r._length, s = 1; s < h; s += 1) n += " C" + r.o[s - 1][0] + "," + r.o[s - 1][1] + " " + r.i[s][0] + "," + r.i[s][1] + " " + r.v[s][0] + "," + r.v[s][1];
        if (r.c && 1 < h && (n += " C" + r.o[s - 1][0] + "," + r.o[s - 1][1] + " " + r.i[0][0] + "," + r.i[0][1] + " " + r.v[0][0] + "," + r.v[0][1]), a.lastPath !== n) {
            var m = "";
            a.elem && (r.c && (m = e.inv ? this.solidPath + n : n), a.elem.setAttribute("d", m)), a.lastPath = n
        }
    }, MaskElement.prototype.destroy = function () {
        this.element = null, this.globalData = null, this.maskElement = null, this.data = null, this.masksProperties = null
    }, HierarchyElement.prototype = {
        initHierarchy: function () {
            this.hierarchy = [], this._isParent = !1, this.checkParenting()
        }, setHierarchy: function (e) {
            this.hierarchy = e
        }, setAsParent: function () {
            this._isParent = !0
        }, checkParenting: function () {
            void 0 !== this.data.parent && this.comp.buildElementParenting(this, this.data.parent, [])
        }
    }, FrameElement.prototype = {
        initFrame: function () {
            this._isFirstFrame = !1, this.dynamicProperties = [], this._mdf = !1
        }, prepareProperties: function (e, r) {
            var a, s = this.dynamicProperties.length;
            for (a = 0; a < s; a += 1) (r || this._isParent && "transform" === this.dynamicProperties[a].propType) && (this.dynamicProperties[a].getValue(), this.dynamicProperties[a]._mdf && (this.globalData._mdf = !0, this._mdf = !0))
        }, addDynamicProperty: function (e) {
            -1 === this.dynamicProperties.indexOf(e) && this.dynamicProperties.push(e)
        }
    }, TransformElement.prototype = {
        initTransform: function () {
            this.finalTransform = {
                mProp: this.data.ks ? TransformPropertyFactory.getTransformProperty(this, this.data.ks, this) : {o: 0},
                _matMdf: !1,
                _opMdf: !1,
                mat: new Matrix
            }, this.data.ao && (this.finalTransform.mProp.autoOriented = !0)
        }, renderTransform: function () {
            if (this.finalTransform._opMdf = this.finalTransform.mProp.o._mdf || this._isFirstFrame, this.finalTransform._matMdf = this.finalTransform.mProp._mdf || this._isFirstFrame, this.hierarchy) {
                var e, r = this.finalTransform.mat, a = 0, s = this.hierarchy.length;
                if (!this.finalTransform._matMdf) for (; a < s;) {
                    if (this.hierarchy[a].finalTransform.mProp._mdf) {
                        this.finalTransform._matMdf = !0;
                        break
                    }
                    a += 1
                }
                if (this.finalTransform._matMdf) for (r.cloneFromProps(e = this.finalTransform.mProp.v.props), a = 0; a < s; a += 1) r.transform((e = this.hierarchy[a].finalTransform.mProp.v.props)[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7], e[8], e[9], e[10], e[11], e[12], e[13], e[14], e[15])
            }
        }, globalToLocal: function (e) {
            var r = [];
            r.push(this.finalTransform);
            for (var a = !0, s = this.comp; a;) s.finalTransform ? (s.data.hasMask && r.splice(0, 0, s.finalTransform), s = s.comp) : a = !1;
            var h, n, m = r.length;
            for (h = 0; h < m; h += 1) n = r[h].mat.applyToPointArray(0, 0, 0), e = [e[0] - n[0], e[1] - n[1], 0];
            return e
        }, mHelper: new Matrix
    }, RenderableElement.prototype = {
        initRenderable: function () {
            this.isInRange = !1, this.hidden = !1, this.isTransparent = !1, this.renderableComponents = []
        }, addRenderableComponent: function (e) {
            -1 === this.renderableComponents.indexOf(e) && this.renderableComponents.push(e)
        }, removeRenderableComponent: function (e) {
            -1 !== this.renderableComponents.indexOf(e) && this.renderableComponents.splice(this.renderableComponents.indexOf(e), 1)
        }, prepareRenderableFrame: function (e) {
            this.checkLayerLimits(e)
        }, checkTransparency: function () {
            this.finalTransform.mProp.o.v <= 0 ? !this.isTransparent && this.globalData.renderConfig.hideOnTransparent && (this.isTransparent = !0, this.hide()) : this.isTransparent && (this.isTransparent = !1, this.show())
        }, checkLayerLimits: function (e) {
            this.data.ip - this.data.st <= e && this.data.op - this.data.st > e ? !0 !== this.isInRange && (this.globalData._mdf = !0, this._mdf = !0, this.isInRange = !0, this.show()) : !1 !== this.isInRange && (this.globalData._mdf = !0, this.isInRange = !1, this.hide())
        }, renderRenderable: function () {
            var e, r = this.renderableComponents.length;
            for (e = 0; e < r; e += 1) this.renderableComponents[e].renderFrame(this._isFirstFrame)
        }, sourceRectAtTime: function () {
            return {top: 0, left: 0, width: 100, height: 100}
        }, getLayerSize: function () {
            return 5 === this.data.ty ? {
                w: this.data.textData.width,
                h: this.data.textData.height
            } : {w: this.data.width, h: this.data.height}
        }
    }, extendPrototype([RenderableElement, createProxyFunction({
        initElement: function (e, r, a) {
            this.initFrame(), this.initBaseData(e, r, a), this.initTransform(e, r, a), this.initHierarchy(), this.initRenderable(), this.initRendererElement(), this.createContainerElements(), this.createRenderableComponents(), this.createContent(), this.hide()
        }, hide: function () {
            this.hidden || this.isInRange && !this.isTransparent || ((this.baseElement || this.layerElement).style.display = "none", this.hidden = !0)
        }, show: function () {
            this.isInRange && !this.isTransparent && (this.data.hd || ((this.baseElement || this.layerElement).style.display = "block"), this.hidden = !1, this._isFirstFrame = !0)
        }, renderFrame: function () {
            this.data.hd || this.hidden || (this.renderTransform(), this.renderRenderable(), this.renderElement(), this.renderInnerContent(), this._isFirstFrame && (this._isFirstFrame = !1))
        }, renderInnerContent: function () {
        }, prepareFrame: function (e) {
            this._mdf = !1, this.prepareRenderableFrame(e), this.prepareProperties(e, this.isInRange), this.checkTransparency()
        }, destroy: function () {
            this.innerElem = null, this.destroyBaseElement()
        }
    })], RenderableDOMElement), SVGStyleData.prototype.reset = function () {
        this.d = "", this._mdf = !1
    }, SVGShapeData.prototype.setAsAnimated = function () {
        this._isAnimated = !0
    }, extendPrototype([DynamicPropertyContainer], SVGStrokeStyleData), extendPrototype([DynamicPropertyContainer], SVGFillStyleData), SVGGradientFillStyleData.prototype.initGradientData = function (e, r, a) {
        this.o = PropertyFactory.getProp(e, r.o, 0, .01, this), this.s = PropertyFactory.getProp(e, r.s, 1, null, this), this.e = PropertyFactory.getProp(e, r.e, 1, null, this), this.h = PropertyFactory.getProp(e, r.h || {k: 0}, 0, .01, this), this.a = PropertyFactory.getProp(e, r.a || {k: 0}, 0, degToRads, this), this.g = new GradientProperty(e, r.g, this), this.style = a, this.stops = [], this.setGradientData(a.pElem, r), this.setGradientOpacity(r, a), this._isAnimated = !!this._isAnimated
    }, SVGGradientFillStyleData.prototype.setGradientData = function (e, r) {
        var a = createElementID(), s = createNS(1 === r.t ? "linearGradient" : "radialGradient");
        s.setAttribute("id", a), s.setAttribute("spreadMethod", "pad"), s.setAttribute("gradientUnits", "userSpaceOnUse");
        var h, n, m, T = [];
        for (m = 4 * r.g.p, n = 0; n < m; n += 4) h = createNS("stop"), s.appendChild(h), T.push(h);
        e.setAttribute("gf" === r.ty ? "fill" : "stroke", "url(" + locationHref + "#" + a + ")"), this.gf = s, this.cst = T
    }, SVGGradientFillStyleData.prototype.setGradientOpacity = function (e, r) {
        if (this.g._hasOpacity && !this.g._collapsable) {
            var a, s, h, n = createNS("mask"), m = createNS("path");
            n.appendChild(m);
            var T = createElementID(), R = createElementID();
            n.setAttribute("id", R);
            var k = createNS(1 === e.t ? "linearGradient" : "radialGradient");
            k.setAttribute("id", T), k.setAttribute("spreadMethod", "pad"), k.setAttribute("gradientUnits", "userSpaceOnUse"), h = e.g.k.k[0].s ? e.g.k.k[0].s.length : e.g.k.k.length;
            var U = this.stops;
            for (s = 4 * e.g.p; s < h; s += 2) (a = createNS("stop")).setAttribute("stop-color", "rgb(255,255,255)"), k.appendChild(a), U.push(a);
            m.setAttribute("gf" === e.ty ? "fill" : "stroke", "url(" + locationHref + "#" + T + ")"), this.of = k, this.ms = n, this.ost = U, this.maskId = R, r.msElem = m
        }
    }, extendPrototype([DynamicPropertyContainer], SVGGradientFillStyleData), extendPrototype([SVGGradientFillStyleData, DynamicPropertyContainer], SVGGradientStrokeStyleData);
    var SVGElementsRenderer = function () {
        var e = new Matrix, r = new Matrix;

        function a(R, k, U) {
            (U || k.transform.op._mdf) && k.transform.container.setAttribute("opacity", k.transform.op.v), (U || k.transform.mProps._mdf) && k.transform.container.setAttribute("transform", k.transform.mProps.v.to2dCSS())
        }

        function s(R, k, U) {
            var W, S, L, M, v, g, x, Q, t0, s0, M0, a0 = k.styles.length, d0 = k.lvl;
            for (g = 0; g < a0; g += 1) {
                if (M = k.sh._mdf || U, k.styles[g].lvl < d0) {
                    for (Q = r.reset(), s0 = d0 - k.styles[g].lvl, M0 = k.transformers.length - 1; !M && 0 < s0;) M = k.transformers[M0].mProps._mdf || M, s0--, M0--;
                    if (M) for (s0 = d0 - k.styles[g].lvl, M0 = k.transformers.length - 1; 0 < s0;) Q.transform((t0 = k.transformers[M0].mProps.v.props)[0], t0[1], t0[2], t0[3], t0[4], t0[5], t0[6], t0[7], t0[8], t0[9], t0[10], t0[11], t0[12], t0[13], t0[14], t0[15]), s0--, M0--
                } else Q = e;
                if (S = (x = k.sh.paths)._length, M) {
                    for (L = "", W = 0; W < S; W += 1) (v = x.shapes[W]) && v._length && (L += buildShapeString(v, v._length, v.c, Q));
                    k.caches[g] = L
                } else L = k.caches[g];
                k.styles[g].d += !0 === R.hd ? "" : L, k.styles[g]._mdf = M || k.styles[g]._mdf
            }
        }

        function h(R, k, U) {
            var W = k.style;
            (k.c._mdf || U) && W.pElem.setAttribute("fill", "rgb(" + bm_floor(k.c.v[0]) + "," + bm_floor(k.c.v[1]) + "," + bm_floor(k.c.v[2]) + ")"), (k.o._mdf || U) && W.pElem.setAttribute("fill-opacity", k.o.v)
        }

        function n(R, k, U) {
            m(R, k, U), T(0, k, U)
        }

        function m(R, k, U) {
            var W, S, L, M, v, g = k.gf, x = k.g._hasOpacity, Q = k.s.v, t0 = k.e.v;
            if ((k.o._mdf || U) && k.style.pElem.setAttribute("gf" === R.ty ? "fill-opacity" : "stroke-opacity", k.o.v), k.s._mdf || U) {
                var M0 = 1 === R.t ? "x1" : "cx", a0 = "x1" === M0 ? "y1" : "cy";
                g.setAttribute(M0, Q[0]), g.setAttribute(a0, Q[1]), x && !k.g._collapsable && (k.of.setAttribute(M0, Q[0]), k.of.setAttribute(a0, Q[1]))
            }
            if (k.g._cmdf || U) {
                var d0 = k.g.c;
                for (L = (W = k.cst).length, S = 0; S < L; S += 1) (M = W[S]).setAttribute("offset", d0[4 * S] + "%"), M.setAttribute("stop-color", "rgb(" + d0[4 * S + 1] + "," + d0[4 * S + 2] + "," + d0[4 * S + 3] + ")")
            }
            if (x && (k.g._omdf || U)) {
                var A0 = k.g.o;
                for (L = (W = k.g._collapsable ? k.cst : k.ost).length, S = 0; S < L; S += 1) M = W[S], k.g._collapsable || M.setAttribute("offset", A0[2 * S] + "%"), M.setAttribute("stop-opacity", A0[2 * S + 1])
            }
            if (1 === R.t) (k.e._mdf || U) && (g.setAttribute("x2", t0[0]), g.setAttribute("y2", t0[1]), x && !k.g._collapsable && (k.of.setAttribute("x2", t0[0]), k.of.setAttribute("y2", t0[1]))); else if ((k.s._mdf || k.e._mdf || U) && (v = Math.sqrt(Math.pow(Q[0] - t0[0], 2) + Math.pow(Q[1] - t0[1], 2)), g.setAttribute("r", v), x && !k.g._collapsable && k.of.setAttribute("r", v)), k.e._mdf || k.h._mdf || k.a._mdf || U) {
                v || (v = Math.sqrt(Math.pow(Q[0] - t0[0], 2) + Math.pow(Q[1] - t0[1], 2)));
                var E0 = Math.atan2(t0[1] - Q[1], t0[0] - Q[0]),
                    k0 = v * (1 <= k.h.v ? .99 : k.h.v <= -1 ? -.99 : k.h.v), b0 = Math.cos(E0 + k.a.v) * k0 + Q[0],
                    q0 = Math.sin(E0 + k.a.v) * k0 + Q[1];
                g.setAttribute("fx", b0), g.setAttribute("fy", q0), x && !k.g._collapsable && (k.of.setAttribute("fx", b0), k.of.setAttribute("fy", q0))
            }
        }

        function T(R, k, U) {
            var W = k.style, S = k.d;
            S && (S._mdf || U) && S.dashStr && (W.pElem.setAttribute("stroke-dasharray", S.dashStr), W.pElem.setAttribute("stroke-dashoffset", S.dashoffset[0])), k.c && (k.c._mdf || U) && W.pElem.setAttribute("stroke", "rgb(" + bm_floor(k.c.v[0]) + "," + bm_floor(k.c.v[1]) + "," + bm_floor(k.c.v[2]) + ")"), (k.o._mdf || U) && W.pElem.setAttribute("stroke-opacity", k.o.v), (k.w._mdf || U) && (W.pElem.setAttribute("stroke-width", k.w.v), W.msElem && W.msElem.setAttribute("stroke-width", k.w.v))
        }

        return {
            createRenderFunction: function (R) {
                switch (R.ty) {
                    case"fl":
                        return h;
                    case"gf":
                        return m;
                    case"gs":
                        return n;
                    case"st":
                        return T;
                    case"sh":
                    case"el":
                    case"rc":
                    case"sr":
                        return s;
                    case"tr":
                        return a
                }
            }
        }
    }();

    function ShapeTransformManager() {
        this.sequences = {}, this.sequenceList = [], this.transform_key_count = 0
    }

    function CVShapeData(e, r, a, s) {
        this.styledShapes = [], this.tr = [0, 0, 0, 0, 0, 0];
        var h = 4;
        "rc" == r.ty ? h = 5 : "el" == r.ty ? h = 6 : "sr" == r.ty && (h = 7), this.sh = ShapePropertyFactory.getShapeProp(e, r, h, e);
        var n, m, T = a.length;
        for (n = 0; n < T; n += 1) a[n].closed || (m = {
            transforms: s.addTransformSequence(a[n].transforms),
            trNodes: []
        }, this.styledShapes.push(m), a[n].elements.push(m))
    }

    function BaseElement() {
    }

    function NullElement(e, r, a) {
        this.initFrame(), this.initBaseData(e, r, a), this.initFrame(), this.initTransform(e, r, a), this.initHierarchy()
    }

    function SVGBaseElement() {
    }

    function IShapeElement() {
    }

    function ITextElement() {
    }

    function ICompElement() {
    }

    function IImageElement(e, r, a) {
        this.assetData = r.getAssetData(e.refId), this.initElement(e, r, a), this.sourceRect = {
            top: 0,
            left: 0,
            width: this.assetData.w,
            height: this.assetData.h
        }
    }

    function ISolidElement(e, r, a) {
        this.initElement(e, r, a)
    }

    function SVGCompElement(e, r, a) {
        this.layers = e.layers, this.supports3d = !0, this.completeLayers = !1, this.pendingElements = [], this.elements = this.layers ? createSizedArray(this.layers.length) : [], this.initElement(e, r, a), this.tm = e.tm ? PropertyFactory.getProp(this, e.tm, 0, r.frameRate, this) : {_placeholder: !0}
    }

    function SVGTextElement(e, r, a) {
        this.textSpans = [], this.renderType = "svg", this.initElement(e, r, a)
    }

    function SVGShapeElement(e, r, a) {
        this.shapes = [], this.shapesData = e.shapes, this.stylesList = [], this.shapeModifiers = [], this.itemsData = [], this.processedElements = [], this.animatedContents = [], this.initElement(e, r, a), this.prevViewData = []
    }

    function SVGTintFilter(e, r) {
        this.filterManager = r;
        var a = createNS("feColorMatrix");
        if (a.setAttribute("type", "matrix"), a.setAttribute("color-interpolation-filters", "linearRGB"), a.setAttribute("values", "0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0"), a.setAttribute("result", "f1"), e.appendChild(a), (a = createNS("feColorMatrix")).setAttribute("type", "matrix"), a.setAttribute("color-interpolation-filters", "sRGB"), a.setAttribute("values", "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"), a.setAttribute("result", "f2"), e.appendChild(a), this.matrixFilter = a, 100 !== r.effectElements[2].p.v || r.effectElements[2].p.k) {
            var s, h = createNS("feMerge");
            e.appendChild(h), (s = createNS("feMergeNode")).setAttribute("in", "SourceGraphic"), h.appendChild(s), (s = createNS("feMergeNode")).setAttribute("in", "f2"), h.appendChild(s)
        }
    }

    function SVGFillFilter(e, r) {
        this.filterManager = r;
        var a = createNS("feColorMatrix");
        a.setAttribute("type", "matrix"), a.setAttribute("color-interpolation-filters", "sRGB"), a.setAttribute("values", "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"), e.appendChild(a), this.matrixFilter = a
    }

    function SVGGaussianBlurEffect(e, r) {
        e.setAttribute("x", "-100%"), e.setAttribute("y", "-100%"), e.setAttribute("width", "300%"), e.setAttribute("height", "300%"), this.filterManager = r;
        var a = createNS("feGaussianBlur");
        e.appendChild(a), this.feGaussianBlur = a
    }

    function SVGStrokeEffect(e, r) {
        this.initialized = !1, this.filterManager = r, this.elem = e, this.paths = []
    }

    function SVGTritoneFilter(e, r) {
        this.filterManager = r;
        var a = createNS("feColorMatrix");
        a.setAttribute("type", "matrix"), a.setAttribute("color-interpolation-filters", "linearRGB"), a.setAttribute("values", "0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0"), a.setAttribute("result", "f1"), e.appendChild(a);
        var s = createNS("feComponentTransfer");
        s.setAttribute("color-interpolation-filters", "sRGB"), e.appendChild(s), this.matrixFilter = s;
        var h = createNS("feFuncR");
        h.setAttribute("type", "table"), s.appendChild(h), this.feFuncR = h;
        var n = createNS("feFuncG");
        n.setAttribute("type", "table"), s.appendChild(n), this.feFuncG = n;
        var m = createNS("feFuncB");
        m.setAttribute("type", "table"), s.appendChild(m), this.feFuncB = m
    }

    function SVGProLevelsFilter(e, r) {
        this.filterManager = r;
        var a = this.filterManager.effectElements, s = createNS("feComponentTransfer");
        (a[10].p.k || 0 !== a[10].p.v || a[11].p.k || 1 !== a[11].p.v || a[12].p.k || 1 !== a[12].p.v || a[13].p.k || 0 !== a[13].p.v || a[14].p.k || 1 !== a[14].p.v) && (this.feFuncR = this.createFeFunc("feFuncR", s)), (a[17].p.k || 0 !== a[17].p.v || a[18].p.k || 1 !== a[18].p.v || a[19].p.k || 1 !== a[19].p.v || a[20].p.k || 0 !== a[20].p.v || a[21].p.k || 1 !== a[21].p.v) && (this.feFuncG = this.createFeFunc("feFuncG", s)), (a[24].p.k || 0 !== a[24].p.v || a[25].p.k || 1 !== a[25].p.v || a[26].p.k || 1 !== a[26].p.v || a[27].p.k || 0 !== a[27].p.v || a[28].p.k || 1 !== a[28].p.v) && (this.feFuncB = this.createFeFunc("feFuncB", s)), (a[31].p.k || 0 !== a[31].p.v || a[32].p.k || 1 !== a[32].p.v || a[33].p.k || 1 !== a[33].p.v || a[34].p.k || 0 !== a[34].p.v || a[35].p.k || 1 !== a[35].p.v) && (this.feFuncA = this.createFeFunc("feFuncA", s)), (this.feFuncR || this.feFuncG || this.feFuncB || this.feFuncA) && (s.setAttribute("color-interpolation-filters", "sRGB"), e.appendChild(s), s = createNS("feComponentTransfer")), (a[3].p.k || 0 !== a[3].p.v || a[4].p.k || 1 !== a[4].p.v || a[5].p.k || 1 !== a[5].p.v || a[6].p.k || 0 !== a[6].p.v || a[7].p.k || 1 !== a[7].p.v) && (s.setAttribute("color-interpolation-filters", "sRGB"), e.appendChild(s), this.feFuncRComposed = this.createFeFunc("feFuncR", s), this.feFuncGComposed = this.createFeFunc("feFuncG", s), this.feFuncBComposed = this.createFeFunc("feFuncB", s))
    }

    function SVGDropShadowEffect(e, r) {
        e.setAttribute("x", "-100%"), e.setAttribute("y", "-100%"), e.setAttribute("width", "400%"), e.setAttribute("height", "400%"), this.filterManager = r;
        var a = createNS("feGaussianBlur");
        a.setAttribute("in", "SourceAlpha"), a.setAttribute("result", "drop_shadow_1"), a.setAttribute("stdDeviation", "0"), this.feGaussianBlur = a, e.appendChild(a);
        var s = createNS("feOffset");
        s.setAttribute("dx", "25"), s.setAttribute("dy", "0"), s.setAttribute("in", "drop_shadow_1"), s.setAttribute("result", "drop_shadow_2"), this.feOffset = s, e.appendChild(s);
        var h = createNS("feFlood");
        h.setAttribute("flood-color", "#00ff00"), h.setAttribute("flood-opacity", "1"), h.setAttribute("result", "drop_shadow_3"), this.feFlood = h, e.appendChild(h);
        var n = createNS("feComposite");
        n.setAttribute("in", "drop_shadow_3"), n.setAttribute("in2", "drop_shadow_2"), n.setAttribute("operator", "in"), n.setAttribute("result", "drop_shadow_4"), e.appendChild(n);
        var m, T = createNS("feMerge");
        e.appendChild(T), m = createNS("feMergeNode"), T.appendChild(m), (m = createNS("feMergeNode")).setAttribute("in", "SourceGraphic"), this.feMergeNode = m, this.feMerge = T, this.originalNodeAdded = !1, T.appendChild(m)
    }

    ShapeTransformManager.prototype = {
        addTransformSequence: function (e) {
            var r, a = e.length, s = "_";
            for (r = 0; r < a; r += 1) s += e[r].transform.key + "_";
            var h = this.sequences[s];
            return h || (h = {
                transforms: [].concat(e),
                finalTransform: new Matrix,
                _mdf: !1
            }, this.sequences[s] = h, this.sequenceList.push(h)), h
        }, processSequence: function (e, r) {
            for (var a, s = 0, h = e.transforms.length, n = r; s < h && !r;) {
                if (e.transforms[s].transform.mProps._mdf) {
                    n = !0;
                    break
                }
                s += 1
            }
            if (n) for (e.finalTransform.reset(), s = h - 1; 0 <= s; s -= 1) e.finalTransform.transform((a = e.transforms[s].transform.mProps.v.props)[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15]);
            e._mdf = n
        }, processSequences: function (e) {
            var r, a = this.sequenceList.length;
            for (r = 0; r < a; r += 1) this.processSequence(this.sequenceList[r], e)
        }, getNewKey: function () {
            return "_" + this.transform_key_count++
        }
    }, CVShapeData.prototype.setAsAnimated = SVGShapeData.prototype.setAsAnimated, BaseElement.prototype = {
        checkMasks: function () {
            if (!this.data.hasMask) return !1;
            for (var e = 0, r = this.data.masksProperties.length; e < r;) {
                if ("n" !== this.data.masksProperties[e].mode && !1 !== this.data.masksProperties[e].cl) return !0;
                e += 1
            }
            return !1
        }, initExpressions: function () {
            this.layerInterface = LayerExpressionInterface(this), this.data.hasMask && this.maskManager && this.layerInterface.registerMaskInterface(this.maskManager);
            var e = EffectsExpressionInterface.createEffectsInterface(this, this.layerInterface);
            this.layerInterface.registerEffectsInterface(e), 0 === this.data.ty || this.data.xt ? this.compInterface = CompExpressionInterface(this) : 4 === this.data.ty ? (this.layerInterface.shapeInterface = ShapeExpressionInterface(this.shapesData, this.itemsData, this.layerInterface), this.layerInterface.content = this.layerInterface.shapeInterface) : 5 === this.data.ty && (this.layerInterface.textInterface = TextExpressionInterface(this), this.layerInterface.text = this.layerInterface.textInterface)
        }, setBlendMode: function () {
            var e = getBlendMode(this.data.bm);
            (this.baseElement || this.layerElement).style["mix-blend-mode"] = e
        }, initBaseData: function (e, r, a) {
            this.globalData = r, this.comp = a, this.data = e, this.layerId = createElementID(), this.data.sr || (this.data.sr = 1), this.effectsManager = new EffectsManager(this.data, this, this.dynamicProperties)
        }, getType: function () {
            return this.type
        }, sourceRectAtTime: function () {
        }
    }, NullElement.prototype.prepareFrame = function (e) {
        this.prepareProperties(e, !0)
    }, NullElement.prototype.renderFrame = function () {
    }, NullElement.prototype.getBaseElement = function () {
        return null
    }, NullElement.prototype.destroy = function () {
    }, NullElement.prototype.sourceRectAtTime = function () {
    }, NullElement.prototype.hide = function () {
    }, extendPrototype([BaseElement, TransformElement, HierarchyElement, FrameElement], NullElement), SVGBaseElement.prototype = {
        initRendererElement: function () {
            this.layerElement = createNS("g")
        }, createContainerElements: function () {
            this.matteElement = createNS("g"), this.transformedElement = this.layerElement, this.maskedElement = this.layerElement, this._sizeChanged = !1;
            var e, r, a, s = null;
            if (this.data.td) {
                if (3 == this.data.td || 1 == this.data.td) {
                    var h = createNS("mask");
                    h.setAttribute("id", this.layerId), h.setAttribute("mask-type", 3 == this.data.td ? "luminance" : "alpha"), h.appendChild(this.layerElement), s = h, this.globalData.defs.appendChild(h), featureSupport.maskType || 1 != this.data.td || (h.setAttribute("mask-type", "luminance"), e = createElementID(), r = filtersFactory.createFilter(e), this.globalData.defs.appendChild(r), r.appendChild(filtersFactory.createAlphaToLuminanceFilter()), (a = createNS("g")).appendChild(this.layerElement), s = a, h.appendChild(a), a.setAttribute("filter", "url(" + locationHref + "#" + e + ")"))
                } else if (2 == this.data.td) {
                    var n = createNS("mask");
                    n.setAttribute("id", this.layerId), n.setAttribute("mask-type", "alpha");
                    var m = createNS("g");
                    n.appendChild(m), e = createElementID(), r = filtersFactory.createFilter(e);
                    var T = createNS("feComponentTransfer");
                    T.setAttribute("in", "SourceGraphic"), r.appendChild(T);
                    var R = createNS("feFuncA");
                    R.setAttribute("type", "table"), R.setAttribute("tableValues", "1.0 0.0"), T.appendChild(R), this.globalData.defs.appendChild(r);
                    var k = createNS("rect");
                    k.setAttribute("width", this.comp.data.w), k.setAttribute("height", this.comp.data.h), k.setAttribute("x", "0"), k.setAttribute("y", "0"), k.setAttribute("fill", "#ffffff"), k.setAttribute("opacity", "0"), m.setAttribute("filter", "url(" + locationHref + "#" + e + ")"), m.appendChild(k), m.appendChild(this.layerElement), s = m, featureSupport.maskType || (n.setAttribute("mask-type", "luminance"), r.appendChild(filtersFactory.createAlphaToLuminanceFilter()), a = createNS("g"), m.appendChild(k), a.appendChild(this.layerElement), s = a, m.appendChild(a)), this.globalData.defs.appendChild(n)
                }
            } else this.data.tt ? (this.matteElement.appendChild(this.layerElement), s = this.matteElement, this.baseElement = this.matteElement) : this.baseElement = this.layerElement;
            if (this.data.ln && this.layerElement.setAttribute("id", this.data.ln), this.data.cl && this.layerElement.setAttribute("class", this.data.cl), 0 === this.data.ty && !this.data.hd) {
                var U = createNS("clipPath"), W = createNS("path");
                W.setAttribute("d", "M0,0 L" + this.data.w + ",0 L" + this.data.w + "," + this.data.h + " L0," + this.data.h + "z");
                var S = createElementID();
                if (U.setAttribute("id", S), U.appendChild(W), this.globalData.defs.appendChild(U), this.checkMasks()) {
                    var L = createNS("g");
                    L.setAttribute("clip-path", "url(" + locationHref + "#" + S + ")"), L.appendChild(this.layerElement), this.transformedElement = L, s ? s.appendChild(this.transformedElement) : this.baseElement = this.transformedElement
                } else this.layerElement.setAttribute("clip-path", "url(" + locationHref + "#" + S + ")")
            }
            0 !== this.data.bm && this.setBlendMode()
        }, renderElement: function () {
            this.finalTransform._matMdf && this.transformedElement.setAttribute("transform", this.finalTransform.mat.to2dCSS()), this.finalTransform._opMdf && this.transformedElement.setAttribute("opacity", this.finalTransform.mProp.o.v)
        }, destroyBaseElement: function () {
            this.layerElement = null, this.matteElement = null, this.maskManager.destroy()
        }, getBaseElement: function () {
            return this.data.hd ? null : this.baseElement
        }, createRenderableComponents: function () {
            this.maskManager = new MaskElement(this.data, this, this.globalData), this.renderableEffectsManager = new SVGEffects(this)
        }, setMatte: function (e) {
            this.matteElement && this.matteElement.setAttribute("mask", "url(" + locationHref + "#" + e + ")")
        }
    }, IShapeElement.prototype = {
        addShapeToModifiers: function (e) {
            var r, a = this.shapeModifiers.length;
            for (r = 0; r < a; r += 1) this.shapeModifiers[r].addShape(e)
        },
        isShapeInAnimatedModifiers: function (e) {
            for (var r = this.shapeModifiers.length; 0 < r;) if (this.shapeModifiers[0].isAnimatedWithShape(e)) return !0;
            return !1
        },
        renderModifiers: function () {
            if (this.shapeModifiers.length) {
                var e, r = this.shapes.length;
                for (e = 0; e < r; e += 1) this.shapes[e].sh.reset();
                for (e = (r = this.shapeModifiers.length) - 1; 0 <= e; e -= 1) this.shapeModifiers[e].processShapes(this._isFirstFrame)
            }
        },
        lcEnum: {1: "butt", 2: "round", 3: "square"},
        ljEnum: {1: "miter", 2: "round", 3: "bevel"},
        searchProcessedElement: function (e) {
            for (var r = this.processedElements, a = 0, s = r.length; a < s;) {
                if (r[a].elem === e) return r[a].pos;
                a += 1
            }
            return 0
        },
        addProcessedElement: function (e, r) {
            for (var a = this.processedElements, s = a.length; s;) if (a[s -= 1].elem === e) return void (a[s].pos = r);
            a.push(new ProcessedElement(e, r))
        },
        prepareFrame: function (e) {
            this.prepareRenderableFrame(e), this.prepareProperties(e, this.isInRange)
        }
    }, ITextElement.prototype.initElement = function (e, r, a) {
        this.lettersChangedFlag = !0, this.initFrame(), this.initBaseData(e, r, a), this.textProperty = new TextProperty(this, e.t, this.dynamicProperties), this.textAnimator = new TextAnimatorProperty(e.t, this.renderType, this), this.initTransform(e, r, a), this.initHierarchy(), this.initRenderable(), this.initRendererElement(), this.createContainerElements(), this.createRenderableComponents(), this.createContent(), this.hide(), this.textAnimator.searchProperties(this.dynamicProperties)
    }, ITextElement.prototype.prepareFrame = function (e) {
        this._mdf = !1, this.prepareRenderableFrame(e), this.prepareProperties(e, this.isInRange), (this.textProperty._mdf || this.textProperty._isFirstFrame) && (this.buildNewText(), this.textProperty._isFirstFrame = !1, this.textProperty._mdf = !1)
    }, ITextElement.prototype.createPathShape = function (e, r) {
        var a, s, h = r.length, n = "";
        for (a = 0; a < h; a += 1) n += buildShapeString(s = r[a].ks.k, s.i.length, !0, e);
        return n
    }, ITextElement.prototype.updateDocumentData = function (e, r) {
        this.textProperty.updateDocumentData(e, r)
    }, ITextElement.prototype.canResizeFont = function (e) {
        this.textProperty.canResizeFont(e)
    }, ITextElement.prototype.setMinimumFontSize = function (e) {
        this.textProperty.setMinimumFontSize(e)
    }, ITextElement.prototype.applyTextPropertiesToMatrix = function (e, r, a, s, h) {
        switch (e.ps && r.translate(e.ps[0], e.ps[1] + e.ascent, 0), r.translate(0, -e.ls, 0), e.j) {
            case 1:
                r.translate(e.justifyOffset + (e.boxWidth - e.lineWidths[a]), 0, 0);
                break;
            case 2:
                r.translate(e.justifyOffset + (e.boxWidth - e.lineWidths[a]) / 2, 0, 0)
        }
        r.translate(s, h, 0)
    }, ITextElement.prototype.buildColor = function (e) {
        return "rgb(" + Math.round(255 * e[0]) + "," + Math.round(255 * e[1]) + "," + Math.round(255 * e[2]) + ")"
    }, ITextElement.prototype.emptyProp = new LetterProps, ITextElement.prototype.destroy = function () {
    }, extendPrototype([BaseElement, TransformElement, HierarchyElement, FrameElement, RenderableDOMElement], ICompElement), ICompElement.prototype.initElement = function (e, r, a) {
        this.initFrame(), this.initBaseData(e, r, a), this.initTransform(e, r, a), this.initRenderable(), this.initHierarchy(), this.initRendererElement(), this.createContainerElements(), this.createRenderableComponents(), !this.data.xt && r.progressiveLoad || this.buildAllItems(), this.hide()
    }, ICompElement.prototype.prepareFrame = function (e) {
        if (this._mdf = !1, this.prepareRenderableFrame(e), this.prepareProperties(e, this.isInRange), this.isInRange || this.data.xt) {
            if (this.tm._placeholder) this.renderedFrame = e / this.data.sr; else {
                var r = this.tm.v;
                r === this.data.op && (r = this.data.op - 1), this.renderedFrame = r
            }
            var a, s = this.elements.length;
            for (this.completeLayers || this.checkLayers(this.renderedFrame), a = s - 1; 0 <= a; a -= 1) (this.completeLayers || this.elements[a]) && (this.elements[a].prepareFrame(this.renderedFrame - this.layers[a].st), this.elements[a]._mdf && (this._mdf = !0))
        }
    }, ICompElement.prototype.renderInnerContent = function () {
        var e, r = this.layers.length;
        for (e = 0; e < r; e += 1) (this.completeLayers || this.elements[e]) && this.elements[e].renderFrame()
    }, ICompElement.prototype.setElements = function (e) {
        this.elements = e
    }, ICompElement.prototype.getElements = function () {
        return this.elements
    }, ICompElement.prototype.destroyElements = function () {
        var e, r = this.layers.length;
        for (e = 0; e < r; e += 1) this.elements[e] && this.elements[e].destroy()
    }, ICompElement.prototype.destroy = function () {
        this.destroyElements(), this.destroyBaseElement()
    }, extendPrototype([BaseElement, TransformElement, SVGBaseElement, HierarchyElement, FrameElement, RenderableDOMElement], IImageElement), IImageElement.prototype.createContent = function () {
        var e = this.globalData.getAssetsPath(this.assetData);
        this.innerElem = createNS("image"), this.innerElem.setAttribute("width", this.assetData.w + "px"), this.innerElem.setAttribute("height", this.assetData.h + "px"), this.innerElem.setAttribute("preserveAspectRatio", this.assetData.pr || this.globalData.renderConfig.imagePreserveAspectRatio), this.innerElem.setAttributeNS("http://www.w3.org/1999/xlink", "href", e), this.layerElement.appendChild(this.innerElem)
    }, IImageElement.prototype.sourceRectAtTime = function () {
        return this.sourceRect
    }, extendPrototype([IImageElement], ISolidElement), ISolidElement.prototype.createContent = function () {
        var e = createNS("rect");
        e.setAttribute("width", this.data.sw), e.setAttribute("height", this.data.sh), e.setAttribute("fill", this.data.sc), this.layerElement.appendChild(e)
    }, extendPrototype([SVGRenderer, ICompElement, SVGBaseElement], SVGCompElement), extendPrototype([BaseElement, TransformElement, SVGBaseElement, HierarchyElement, FrameElement, RenderableDOMElement, ITextElement], SVGTextElement), SVGTextElement.prototype.createContent = function () {
        this.data.singleShape && !this.globalData.fontManager.chars && (this.textContainer = createNS("text"))
    }, SVGTextElement.prototype.buildTextContents = function (e) {
        for (var r = 0, a = e.length, s = [], h = ""; r < a;) "\r" === e[r] || "\x03" === e[r] ? (s.push(h), h = "") : h += e[r], r += 1;
        return s.push(h), s
    }, SVGTextElement.prototype.buildNewText = function () {
        var e, r, a = this.textProperty.currentData;
        this.renderedLetters = createSizedArray(a ? a.l.length : 0), this.layerElement.setAttribute("fill", a.fc ? this.buildColor(a.fc) : "rgba(0,0,0,0)"), a.sc && (this.layerElement.setAttribute("stroke", this.buildColor(a.sc)), this.layerElement.setAttribute("stroke-width", a.sw)), this.layerElement.setAttribute("font-size", a.finalSize);
        var s = this.globalData.fontManager.getFontByName(a.f);
        if (s.fClass) this.layerElement.setAttribute("class", s.fClass); else {
            this.layerElement.setAttribute("font-family", s.fFamily);
            var h = a.fWeight;
            this.layerElement.setAttribute("font-style", a.fStyle), this.layerElement.setAttribute("font-weight", h)
        }
        this.layerElement.setAttribute("aria-label", a.t);
        var m, T = a.l || [], R = !!this.globalData.fontManager.chars;
        r = T.length;
        var k, U = this.mHelper, W = "", S = this.data.singleShape, L = 0, M = 0, v = !0, g = a.tr / 1e3 * a.finalSize;
        if (!S || R || a.sz) {
            var x, Q, t0 = this.textSpans.length;
            for (e = 0; e < r; e += 1) R && S && 0 !== e || (m = e < t0 ? this.textSpans[e] : createNS(R ? "path" : "text"), t0 <= e && (m.setAttribute("stroke-linecap", "butt"), m.setAttribute("stroke-linejoin", "round"), m.setAttribute("stroke-miterlimit", "4"), this.textSpans[e] = m, this.layerElement.appendChild(m)), m.style.display = "inherit"), U.reset(), U.scale(a.finalSize / 100, a.finalSize / 100), S && (T[e].n && (L = -g, M += a.yOffset, M += v ? 1 : 0, v = !1), this.applyTextPropertiesToMatrix(a, U, T[e].line, L, M), L += T[e].l || 0, L += g), R ? (k = (x = (Q = this.globalData.fontManager.getCharData(a.finalText[e], s.fStyle, this.globalData.fontManager.getFontByName(a.f).fFamily)) && Q.data || {}).shapes ? x.shapes[0].it : [], S ? W += this.createPathShape(U, k) : m.setAttribute("d", this.createPathShape(U, k))) : (S && m.setAttribute("transform", "translate(" + U.props[12] + "," + U.props[13] + ")"), m.textContent = T[e].val, m.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", "preserve"));
            S && m && m.setAttribute("d", W)
        } else {
            var s0 = this.textContainer, M0 = "start";
            switch (a.j) {
                case 1:
                    M0 = "end";
                    break;
                case 2:
                    M0 = "middle"
            }
            s0.setAttribute("text-anchor", M0), s0.setAttribute("letter-spacing", g);
            var a0 = this.buildTextContents(a.finalText);
            for (r = a0.length, M = a.ps ? a.ps[1] + a.ascent : 0, e = 0; e < r; e += 1) (m = this.textSpans[e] || createNS("tspan")).textContent = a0[e], m.setAttribute("x", 0), m.setAttribute("y", M), m.style.display = "inherit", s0.appendChild(m), this.textSpans[e] = m, M += a.finalLineHeight;
            this.layerElement.appendChild(s0)
        }
        for (; e < this.textSpans.length;) this.textSpans[e].style.display = "none", e += 1;
        this._sizeChanged = !0
    }, SVGTextElement.prototype.sourceRectAtTime = function (e) {
        if (this.prepareFrame(this.comp.renderedFrame - this.data.st), this.renderInnerContent(), this._sizeChanged) {
            this._sizeChanged = !1;
            var r = this.layerElement.getBBox();
            this.bbox = {top: r.y, left: r.x, width: r.width, height: r.height}
        }
        return this.bbox
    }, SVGTextElement.prototype.renderInnerContent = function () {
        if (!this.data.singleShape && (this.textAnimator.getMeasures(this.textProperty.currentData, this.lettersChangedFlag), this.lettersChangedFlag || this.textAnimator.lettersChangedFlag)) {
            var e, r;
            this._sizeChanged = !0;
            var a, s, h = this.textAnimator.renderedLetters, n = this.textProperty.currentData.l;
            for (r = n.length, e = 0; e < r; e += 1) n[e].n || (s = this.textSpans[e], (a = h[e])._mdf.m && s.setAttribute("transform", a.m), a._mdf.o && s.setAttribute("opacity", a.o), a._mdf.sw && s.setAttribute("stroke-width", a.sw), a._mdf.sc && s.setAttribute("stroke", a.sc), a._mdf.fc && s.setAttribute("fill", a.fc))
        }
    }, extendPrototype([BaseElement, TransformElement, SVGBaseElement, IShapeElement, HierarchyElement, FrameElement, RenderableDOMElement], SVGShapeElement), SVGShapeElement.prototype.initSecondaryElement = function () {
    }, SVGShapeElement.prototype.identityMatrix = new Matrix, SVGShapeElement.prototype.buildExpressionInterface = function () {
    }, SVGShapeElement.prototype.createContent = function () {
        this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, this.layerElement, 0, [], !0), this.filterUniqueShapes()
    }, SVGShapeElement.prototype.filterUniqueShapes = function () {
        var e, r, a, s, h = this.shapes.length, n = this.stylesList.length, m = [], T = !1;
        for (a = 0; a < n; a += 1) {
            for (s = this.stylesList[a], T = !1, e = m.length = 0; e < h; e += 1) -1 !== (r = this.shapes[e]).styles.indexOf(s) && (m.push(r), T = r._isAnimated || T);
            1 < m.length && T && this.setShapesAsAnimated(m)
        }
    }, SVGShapeElement.prototype.setShapesAsAnimated = function (e) {
        var r, a = e.length;
        for (r = 0; r < a; r += 1) e[r].setAsAnimated()
    }, SVGShapeElement.prototype.createStyleElement = function (e, r) {
        var a, s = new SVGStyleData(e, r), h = s.pElem;
        return "st" === e.ty ? a = new SVGStrokeStyleData(this, e, s) : "fl" === e.ty ? a = new SVGFillStyleData(this, e, s) : ("gf" === e.ty || "gs" === e.ty) && (a = new ("gf" === e.ty ? SVGGradientFillStyleData : SVGGradientStrokeStyleData)(this, e, s), this.globalData.defs.appendChild(a.gf), a.maskId && (this.globalData.defs.appendChild(a.ms), this.globalData.defs.appendChild(a.of), h.setAttribute("mask", "url(" + locationHref + "#" + a.maskId + ")"))), "st" !== e.ty && "gs" !== e.ty || (h.setAttribute("stroke-linecap", this.lcEnum[e.lc] || "round"), h.setAttribute("stroke-linejoin", this.ljEnum[e.lj] || "round"), h.setAttribute("fill-opacity", "0"), 1 === e.lj && h.setAttribute("stroke-miterlimit", e.ml)), 2 === e.r && h.setAttribute("fill-rule", "evenodd"), e.ln && h.setAttribute("id", e.ln), e.cl && h.setAttribute("class", e.cl), e.bm && (h.style["mix-blend-mode"] = getBlendMode(e.bm)), this.stylesList.push(s), this.addToAnimatedContents(e, a), a
    }, SVGShapeElement.prototype.createGroupElement = function (e) {
        var r = new ShapeGroupData;
        return e.ln && r.gr.setAttribute("id", e.ln), e.cl && r.gr.setAttribute("class", e.cl), e.bm && (r.gr.style["mix-blend-mode"] = getBlendMode(e.bm)), r
    }, SVGShapeElement.prototype.createTransformElement = function (e, r) {
        var a = TransformPropertyFactory.getTransformProperty(this, e, this), s = new SVGTransformData(a, a.o, r);
        return this.addToAnimatedContents(e, s), s
    }, SVGShapeElement.prototype.createShapeElement = function (e, r, a) {
        var s = 4;
        "rc" === e.ty ? s = 5 : "el" === e.ty ? s = 6 : "sr" === e.ty && (s = 7);
        var h = new SVGShapeData(r, a, ShapePropertyFactory.getShapeProp(this, e, s, this));
        return this.shapes.push(h), this.addShapeToModifiers(h), this.addToAnimatedContents(e, h), h
    }, SVGShapeElement.prototype.addToAnimatedContents = function (e, r) {
        for (var a = 0, s = this.animatedContents.length; a < s;) {
            if (this.animatedContents[a].element === r) return;
            a += 1
        }
        this.animatedContents.push({fn: SVGElementsRenderer.createRenderFunction(e), element: r, data: e})
    }, SVGShapeElement.prototype.setElementStyles = function (e) {
        var r, a = e.styles, s = this.stylesList.length;
        for (r = 0; r < s; r += 1) this.stylesList[r].closed || a.push(this.stylesList[r])
    }, SVGShapeElement.prototype.reloadShapes = function () {
        this._isFirstFrame = !0;
        var e, r = this.itemsData.length;
        for (e = 0; e < r; e += 1) this.prevViewData[e] = this.itemsData[e];
        for (this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, this.layerElement, 0, [], !0), this.filterUniqueShapes(), r = this.dynamicProperties.length, e = 0; e < r; e += 1) this.dynamicProperties[e].getValue();
        this.renderModifiers()
    }, SVGShapeElement.prototype.searchShapes = function (e, r, a, s, h, n, m) {
        var T, R, k, W, S, L = [].concat(n), M = e.length - 1, v = [], g = [];
        for (T = M; 0 <= T; T -= 1) {
            if ((S = this.searchProcessedElement(e[T])) ? r[T] = a[S - 1] : e[T]._render = m, "fl" == e[T].ty || "st" == e[T].ty || "gf" == e[T].ty || "gs" == e[T].ty) S ? r[T].style.closed = !1 : r[T] = this.createStyleElement(e[T], h), e[T]._render && s.appendChild(r[T].style.pElem), v.push(r[T].style); else if ("gr" == e[T].ty) {
                if (S) for (k = r[T].it.length, R = 0; R < k; R += 1) r[T].prevViewData[R] = r[T].it[R]; else r[T] = this.createGroupElement(e[T]);
                this.searchShapes(e[T].it, r[T].it, r[T].prevViewData, r[T].gr, h + 1, L, m), e[T]._render && s.appendChild(r[T].gr)
            } else "tr" == e[T].ty ? (S || (r[T] = this.createTransformElement(e[T], s)), L.push(r[T].transform)) : "sh" == e[T].ty || "rc" == e[T].ty || "el" == e[T].ty || "sr" == e[T].ty ? (S || (r[T] = this.createShapeElement(e[T], L, h)), this.setElementStyles(r[T])) : "tm" == e[T].ty || "rd" == e[T].ty || "ms" == e[T].ty ? (S ? (W = r[T]).closed = !1 : ((W = ShapeModifiers.getModifier(e[T].ty)).init(this, e[T]), r[T] = W, this.shapeModifiers.push(W)), g.push(W)) : "rp" == e[T].ty && (S ? (W = r[T]).closed = !0 : (W = ShapeModifiers.getModifier(e[T].ty), (r[T] = W).init(this, e, T, r), this.shapeModifiers.push(W), m = !1), g.push(W));
            this.addProcessedElement(e[T], T + 1)
        }
        for (M = v.length, T = 0; T < M; T += 1) v[T].closed = !0;
        for (M = g.length, T = 0; T < M; T += 1) g[T].closed = !0
    }, SVGShapeElement.prototype.renderInnerContent = function () {
        this.renderModifiers();
        var e, r = this.stylesList.length;
        for (e = 0; e < r; e += 1) this.stylesList[e].reset();
        for (this.renderShape(), e = 0; e < r; e += 1) (this.stylesList[e]._mdf || this._isFirstFrame) && (this.stylesList[e].msElem && (this.stylesList[e].msElem.setAttribute("d", this.stylesList[e].d), this.stylesList[e].d = "M0 0" + this.stylesList[e].d), this.stylesList[e].pElem.setAttribute("d", this.stylesList[e].d || "M0 0"))
    }, SVGShapeElement.prototype.renderShape = function () {
        var e, r, a = this.animatedContents.length;
        for (e = 0; e < a; e += 1) r = this.animatedContents[e], (this._isFirstFrame || r.element._isAnimated) && !0 !== r.data && r.fn(r.data, r.element, this._isFirstFrame)
    }, SVGShapeElement.prototype.destroy = function () {
        this.destroyBaseElement(), this.shapesData = null, this.itemsData = null
    }, SVGTintFilter.prototype.renderFrame = function (e) {
        if (e || this.filterManager._mdf) {
            var r = this.filterManager.effectElements[0].p.v, a = this.filterManager.effectElements[1].p.v;
            this.matrixFilter.setAttribute("values", a[0] - r[0] + " 0 0 0 " + r[0] + " " + (a[1] - r[1]) + " 0 0 0 " + r[1] + " " + (a[2] - r[2]) + " 0 0 0 " + r[2] + " 0 0 0 " + this.filterManager.effectElements[2].p.v / 100 + " 0")
        }
    }, SVGFillFilter.prototype.renderFrame = function (e) {
        if (e || this.filterManager._mdf) {
            var r = this.filterManager.effectElements[2].p.v;
            this.matrixFilter.setAttribute("values", "0 0 0 0 " + r[0] + " 0 0 0 0 " + r[1] + " 0 0 0 0 " + r[2] + " 0 0 0 " + this.filterManager.effectElements[6].p.v + " 0")
        }
    }, SVGGaussianBlurEffect.prototype.renderFrame = function (e) {
        if (e || this.filterManager._mdf) {
            var r = .3 * this.filterManager.effectElements[0].p.v, a = this.filterManager.effectElements[1].p.v;
            this.feGaussianBlur.setAttribute("stdDeviation", (3 == a ? 0 : r) + " " + (2 == a ? 0 : r)), this.feGaussianBlur.setAttribute("edgeMode", 1 == this.filterManager.effectElements[2].p.v ? "wrap" : "duplicate")
        }
    }, SVGStrokeEffect.prototype.initialize = function () {
        var e, r, a, s, h = this.elem.layerElement.children || this.elem.layerElement.childNodes;
        for (1 === this.filterManager.effectElements[1].p.v ? (s = this.elem.maskManager.masksProperties.length, a = 0) : s = 1 + (a = this.filterManager.effectElements[0].p.v - 1), (r = createNS("g")).setAttribute("fill", "none"), r.setAttribute("stroke-linecap", "round"), r.setAttribute("stroke-dashoffset", 1); a < s; a += 1) e = createNS("path"), r.appendChild(e), this.paths.push({
            p: e,
            m: a
        });
        if (3 === this.filterManager.effectElements[10].p.v) {
            var n = createNS("mask"), m = createElementID();
            n.setAttribute("id", m), n.setAttribute("mask-type", "alpha"), n.appendChild(r), this.elem.globalData.defs.appendChild(n);
            var T = createNS("g");
            for (T.setAttribute("mask", "url(" + locationHref + "#" + m + ")"); h[0];) T.appendChild(h[0]);
            this.elem.layerElement.appendChild(T), this.masker = n, r.setAttribute("stroke", "#fff")
        } else if (1 === this.filterManager.effectElements[10].p.v || 2 === this.filterManager.effectElements[10].p.v) {
            if (2 === this.filterManager.effectElements[10].p.v) for (h = this.elem.layerElement.children || this.elem.layerElement.childNodes; h.length;) this.elem.layerElement.removeChild(h[0]);
            this.elem.layerElement.appendChild(r), this.elem.layerElement.removeAttribute("mask"), r.setAttribute("stroke", "#fff")
        }
        this.initialized = !0, this.pathMasker = r
    }, SVGStrokeEffect.prototype.renderFrame = function (e) {
        this.initialized || this.initialize();
        var r, a, s, h = this.paths.length;
        for (r = 0; r < h; r += 1) if (-1 !== this.paths[r].m && (a = this.elem.maskManager.viewData[this.paths[r].m], s = this.paths[r].p, (e || this.filterManager._mdf || a.prop._mdf) && s.setAttribute("d", a.lastPath), e || this.filterManager.effectElements[9].p._mdf || this.filterManager.effectElements[4].p._mdf || this.filterManager.effectElements[7].p._mdf || this.filterManager.effectElements[8].p._mdf || a.prop._mdf)) {
            var n;
            if (0 !== this.filterManager.effectElements[7].p.v || 100 !== this.filterManager.effectElements[8].p.v) {
                var m = Math.min(this.filterManager.effectElements[7].p.v, this.filterManager.effectElements[8].p.v) / 100,
                    T = Math.max(this.filterManager.effectElements[7].p.v, this.filterManager.effectElements[8].p.v) / 100,
                    R = s.getTotalLength();
                n = "0 0 0 " + R * m + " ";
                var k,
                    S = Math.floor(R * (T - m) / (1 + 2 * this.filterManager.effectElements[4].p.v * this.filterManager.effectElements[9].p.v / 100));
                for (k = 0; k < S; k += 1) n += "1 " + 2 * this.filterManager.effectElements[4].p.v * this.filterManager.effectElements[9].p.v / 100 + " ";
                n += "0 " + 10 * R + " 0 0"
            } else n = "1 " + 2 * this.filterManager.effectElements[4].p.v * this.filterManager.effectElements[9].p.v / 100;
            s.setAttribute("stroke-dasharray", n)
        }
        if ((e || this.filterManager.effectElements[4].p._mdf) && this.pathMasker.setAttribute("stroke-width", 2 * this.filterManager.effectElements[4].p.v), (e || this.filterManager.effectElements[6].p._mdf) && this.pathMasker.setAttribute("opacity", this.filterManager.effectElements[6].p.v), (1 === this.filterManager.effectElements[10].p.v || 2 === this.filterManager.effectElements[10].p.v) && (e || this.filterManager.effectElements[3].p._mdf)) {
            var L = this.filterManager.effectElements[3].p.v;
            this.pathMasker.setAttribute("stroke", "rgb(" + bm_floor(255 * L[0]) + "," + bm_floor(255 * L[1]) + "," + bm_floor(255 * L[2]) + ")")
        }
    }, SVGTritoneFilter.prototype.renderFrame = function (e) {
        if (e || this.filterManager._mdf) {
            var r = this.filterManager.effectElements[0].p.v, a = this.filterManager.effectElements[1].p.v,
                s = this.filterManager.effectElements[2].p.v, n = s[1] + " " + a[1] + " " + r[1],
                m = s[2] + " " + a[2] + " " + r[2];
            this.feFuncR.setAttribute("tableValues", s[0] + " " + a[0] + " " + r[0]), this.feFuncG.setAttribute("tableValues", n), this.feFuncB.setAttribute("tableValues", m)
        }
    }, SVGProLevelsFilter.prototype.createFeFunc = function (e, r) {
        var a = createNS(e);
        return a.setAttribute("type", "table"), r.appendChild(a), a
    }, SVGProLevelsFilter.prototype.getTableValue = function (e, r, a, s, h) {
        for (var n, m, T = 0, R = Math.min(e, r), k = Math.max(e, r), U = Array.call(null, {length: 256}), W = 0, S = h - s, L = r - e; T <= 256;) m = (n = T / 256) <= R ? L < 0 ? h : s : k <= n ? L < 0 ? s : h : s + S * Math.pow((n - e) / L, 1 / a), U[W++] = m, T += 256 / 255;
        return U.join(" ")
    }, SVGProLevelsFilter.prototype.renderFrame = function (e) {
        if (e || this.filterManager._mdf) {
            var r, a = this.filterManager.effectElements;
            this.feFuncRComposed && (e || a[3].p._mdf || a[4].p._mdf || a[5].p._mdf || a[6].p._mdf || a[7].p._mdf) && (r = this.getTableValue(a[3].p.v, a[4].p.v, a[5].p.v, a[6].p.v, a[7].p.v), this.feFuncRComposed.setAttribute("tableValues", r), this.feFuncGComposed.setAttribute("tableValues", r), this.feFuncBComposed.setAttribute("tableValues", r)), this.feFuncR && (e || a[10].p._mdf || a[11].p._mdf || a[12].p._mdf || a[13].p._mdf || a[14].p._mdf) && (r = this.getTableValue(a[10].p.v, a[11].p.v, a[12].p.v, a[13].p.v, a[14].p.v), this.feFuncR.setAttribute("tableValues", r)), this.feFuncG && (e || a[17].p._mdf || a[18].p._mdf || a[19].p._mdf || a[20].p._mdf || a[21].p._mdf) && (r = this.getTableValue(a[17].p.v, a[18].p.v, a[19].p.v, a[20].p.v, a[21].p.v), this.feFuncG.setAttribute("tableValues", r)), this.feFuncB && (e || a[24].p._mdf || a[25].p._mdf || a[26].p._mdf || a[27].p._mdf || a[28].p._mdf) && (r = this.getTableValue(a[24].p.v, a[25].p.v, a[26].p.v, a[27].p.v, a[28].p.v), this.feFuncB.setAttribute("tableValues", r)), this.feFuncA && (e || a[31].p._mdf || a[32].p._mdf || a[33].p._mdf || a[34].p._mdf || a[35].p._mdf) && (r = this.getTableValue(a[31].p.v, a[32].p.v, a[33].p.v, a[34].p.v, a[35].p.v), this.feFuncA.setAttribute("tableValues", r))
        }
    }, SVGDropShadowEffect.prototype.renderFrame = function (e) {
        if (e || this.filterManager._mdf) {
            if ((e || this.filterManager.effectElements[4].p._mdf) && this.feGaussianBlur.setAttribute("stdDeviation", this.filterManager.effectElements[4].p.v / 4), e || this.filterManager.effectElements[0].p._mdf) {
                var r = this.filterManager.effectElements[0].p.v;
                this.feFlood.setAttribute("flood-color", rgbToHex(Math.round(255 * r[0]), Math.round(255 * r[1]), Math.round(255 * r[2])))
            }
            if ((e || this.filterManager.effectElements[1].p._mdf) && this.feFlood.setAttribute("flood-opacity", this.filterManager.effectElements[1].p.v / 255), e || this.filterManager.effectElements[2].p._mdf || this.filterManager.effectElements[3].p._mdf) {
                var a = this.filterManager.effectElements[3].p.v,
                    s = (this.filterManager.effectElements[2].p.v - 90) * degToRads, h = a * Math.cos(s),
                    n = a * Math.sin(s);
                this.feOffset.setAttribute("dx", h), this.feOffset.setAttribute("dy", n)
            }
        }
    };
    var _svgMatteSymbols = [];

    function SVGMatte3Effect(e, r, a) {
        this.initialized = !1, this.filterManager = r, this.filterElem = e, (this.elem = a).matteElement = createNS("g"), a.matteElement.appendChild(a.layerElement), a.matteElement.appendChild(a.transformedElement), a.baseElement = a.matteElement
    }

    function SVGEffects(e) {
        var r, a, s = e.data.ef ? e.data.ef.length : 0, h = createElementID(), n = filtersFactory.createFilter(h),
            m = 0;
        for (this.filters = [], r = 0; r < s; r += 1) a = null, 20 === e.data.ef[r].ty ? (m += 1, a = new SVGTintFilter(n, e.effectsManager.effectElements[r])) : 21 === e.data.ef[r].ty ? (m += 1, a = new SVGFillFilter(n, e.effectsManager.effectElements[r])) : 22 === e.data.ef[r].ty ? a = new SVGStrokeEffect(e, e.effectsManager.effectElements[r]) : 23 === e.data.ef[r].ty ? (m += 1, a = new SVGTritoneFilter(n, e.effectsManager.effectElements[r])) : 24 === e.data.ef[r].ty ? (m += 1, a = new SVGProLevelsFilter(n, e.effectsManager.effectElements[r])) : 25 === e.data.ef[r].ty ? (m += 1, a = new SVGDropShadowEffect(n, e.effectsManager.effectElements[r])) : 28 === e.data.ef[r].ty ? a = new SVGMatte3Effect(n, e.effectsManager.effectElements[r], e) : 29 === e.data.ef[r].ty && (m += 1, a = new SVGGaussianBlurEffect(n, e.effectsManager.effectElements[r])), a && this.filters.push(a);
        m && (e.globalData.defs.appendChild(n), e.layerElement.setAttribute("filter", "url(" + locationHref + "#" + h + ")")), this.filters.length && e.addRenderableComponent(this)
    }

    function CVContextData() {
        var e;
        for (this.saved = [], this.cArrPos = 0, this.cTr = new Matrix, this.cO = 1, this.savedOp = createTypedArray("float32", 15), e = 0; e < 15; e += 1) this.saved[e] = createTypedArray("float32", 16);
        this._length = 15
    }

    function CVBaseElement() {
    }

    function CVImageElement(e, r, a) {
        this.assetData = r.getAssetData(e.refId), this.img = r.imageLoader.getImage(this.assetData), this.initElement(e, r, a)
    }

    function CVCompElement(e, r, a) {
        this.completeLayers = !1, this.layers = e.layers, this.pendingElements = [], this.elements = createSizedArray(this.layers.length), this.initElement(e, r, a), this.tm = e.tm ? PropertyFactory.getProp(this, e.tm, 0, r.frameRate, this) : {_placeholder: !0}
    }

    function CVMaskElement(e, r) {
        this.data = e, this.element = r, this.masksProperties = this.data.masksProperties || [], this.viewData = createSizedArray(this.masksProperties.length);
        var a, s = this.masksProperties.length, h = !1;
        for (a = 0; a < s; a++) "n" !== this.masksProperties[a].mode && (h = !0), this.viewData[a] = ShapePropertyFactory.getShapeProp(this.element, this.masksProperties[a], 3);
        (this.hasMasks = h) && this.element.addRenderableComponent(this)
    }

    function CVShapeElement(e, r, a) {
        this.shapes = [], this.shapesData = e.shapes, this.stylesList = [], this.itemsData = [], this.prevViewData = [], this.shapeModifiers = [], this.processedElements = [], this.transformsManager = new ShapeTransformManager, this.initElement(e, r, a)
    }

    function CVSolidElement(e, r, a) {
        this.initElement(e, r, a)
    }

    function CVTextElement(e, r, a) {
        this.textSpans = [], this.yOffset = 0, this.fillColorAnim = !1, this.strokeColorAnim = !1, this.strokeWidthAnim = !1, this.stroke = !1, this.fill = !1, this.justifyOffset = 0, this.currentRender = null, this.renderType = "canvas", this.values = {
            fill: "rgba(0,0,0,0)",
            stroke: "rgba(0,0,0,0)",
            sWidth: 0,
            fValue: ""
        }, this.initElement(e, r, a)
    }

    function CVEffects() {
    }

    function HBaseElement(e, r, a) {
    }

    function HSolidElement(e, r, a) {
        this.initElement(e, r, a)
    }

    function HCompElement(e, r, a) {
        this.layers = e.layers, this.supports3d = !e.hasMask, this.completeLayers = !1, this.pendingElements = [], this.elements = this.layers ? createSizedArray(this.layers.length) : [], this.initElement(e, r, a), this.tm = e.tm ? PropertyFactory.getProp(this, e.tm, 0, r.frameRate, this) : {_placeholder: !0}
    }

    function HShapeElement(e, r, a) {
        this.shapes = [], this.shapesData = e.shapes, this.stylesList = [], this.shapeModifiers = [], this.itemsData = [], this.processedElements = [], this.animatedContents = [], this.shapesContainer = createNS("g"), this.initElement(e, r, a), this.prevViewData = [], this.currentBBox = {
            x: 999999,
            y: -999999,
            h: 0,
            w: 0
        }
    }

    function HTextElement(e, r, a) {
        this.textSpans = [], this.textPaths = [], this.currentBBox = {
            x: 999999,
            y: -999999,
            h: 0,
            w: 0
        }, this.renderType = "svg", this.isMasked = !1, this.initElement(e, r, a)
    }

    function HImageElement(e, r, a) {
        this.assetData = r.getAssetData(e.refId), this.initElement(e, r, a)
    }

    function HCameraElement(e, r, a) {
        this.initFrame(), this.initBaseData(e, r, a), this.initHierarchy();
        var s = PropertyFactory.getProp;
        if (this.pe = s(this, e.pe, 0, 0, this), e.ks.p.s ? (this.px = s(this, e.ks.p.x, 1, 0, this), this.py = s(this, e.ks.p.y, 1, 0, this), this.pz = s(this, e.ks.p.z, 1, 0, this)) : this.p = s(this, e.ks.p, 1, 0, this), e.ks.a && (this.a = s(this, e.ks.a, 1, 0, this)), e.ks.or.k.length && e.ks.or.k[0].to) {
            var h, n = e.ks.or.k.length;
            for (h = 0; h < n; h += 1) e.ks.or.k[h].to = null, e.ks.or.k[h].ti = null
        }
        this.or = s(this, e.ks.or, 1, degToRads, this), this.or.sh = !0, this.rx = s(this, e.ks.rx, 0, degToRads, this), this.ry = s(this, e.ks.ry, 0, degToRads, this), this.rz = s(this, e.ks.rz, 0, degToRads, this), this.mat = new Matrix, this._prevMat = new Matrix, this._isFirstFrame = !0, this.finalTransform = {mProp: this}
    }

    function HEffects() {
    }

    SVGMatte3Effect.prototype.findSymbol = function (e) {
        for (var r = 0, a = _svgMatteSymbols.length; r < a;) {
            if (_svgMatteSymbols[r] === e) return _svgMatteSymbols[r];
            r += 1
        }
        return null
    }, SVGMatte3Effect.prototype.replaceInParent = function (e, r) {
        var a = e.layerElement.parentNode;
        if (a) {
            for (var s, h = a.children, n = 0, m = h.length; n < m && h[n] !== e.layerElement;) n += 1;
            n <= m - 2 && (s = h[n + 1]);
            var T = createNS("use");
            T.setAttribute("href", "#" + r), s ? a.insertBefore(T, s) : a.appendChild(T)
        }
    }, SVGMatte3Effect.prototype.setElementAsMask = function (e, r) {
        if (!this.findSymbol(r)) {
            var a = createElementID(), s = createNS("mask");
            s.setAttribute("id", r.layerId), s.setAttribute("mask-type", "alpha"), _svgMatteSymbols.push(r);
            var h = e.globalData.defs;
            h.appendChild(s);
            var n = createNS("symbol");
            n.setAttribute("id", a), this.replaceInParent(r, a), n.appendChild(r.layerElement), h.appendChild(n);
            var m = createNS("use");
            m.setAttribute("href", "#" + a), s.appendChild(m), r.data.hd = !1, r.show()
        }
        e.setMatte(r.layerId)
    }, SVGMatte3Effect.prototype.initialize = function () {
        for (var e = this.filterManager.effectElements[0].p.v, r = this.elem.comp.elements, a = 0, s = r.length; a < s;) r[a] && r[a].data.ind === e && this.setElementAsMask(this.elem, r[a]), a += 1;
        this.initialized = !0
    }, SVGMatte3Effect.prototype.renderFrame = function () {
        this.initialized || this.initialize()
    }, SVGEffects.prototype.renderFrame = function (e) {
        var r, a = this.filters.length;
        for (r = 0; r < a; r += 1) this.filters[r].renderFrame(e)
    }, CVContextData.prototype.duplicate = function () {
        var e = 2 * this._length, r = this.savedOp;
        this.savedOp = createTypedArray("float32", e), this.savedOp.set(r);
        var a = 0;
        for (a = this._length; a < e; a += 1) this.saved[a] = createTypedArray("float32", 16);
        this._length = e
    }, CVContextData.prototype.reset = function () {
        this.cArrPos = 0, this.cTr.reset(), this.cO = 1
    }, CVBaseElement.prototype = {
        createElements: function () {
        }, initRendererElement: function () {
        }, createContainerElements: function () {
            this.canvasContext = this.globalData.canvasContext, this.renderableEffectsManager = new CVEffects(this)
        }, createContent: function () {
        }, setBlendMode: function () {
            var e = this.globalData;
            if (e.blendMode !== this.data.bm) {
                e.blendMode = this.data.bm;
                var r = getBlendMode(this.data.bm);
                e.canvasContext.globalCompositeOperation = r
            }
        }, createRenderableComponents: function () {
            this.maskManager = new CVMaskElement(this.data, this)
        }, hideElement: function () {
            this.hidden || this.isInRange && !this.isTransparent || (this.hidden = !0)
        }, showElement: function () {
            this.isInRange && !this.isTransparent && (this.hidden = !1, this._isFirstFrame = !0, this.maskManager._isFirstFrame = !0)
        }, renderFrame: function () {
            if (!this.hidden && !this.data.hd) {
                this.renderTransform(), this.renderRenderable(), this.setBlendMode();
                var e = 0 === this.data.ty;
                this.globalData.renderer.save(e), this.globalData.renderer.ctxTransform(this.finalTransform.mat.props), this.globalData.renderer.ctxOpacity(this.finalTransform.mProp.o.v), this.renderInnerContent(), this.globalData.renderer.restore(e), this.maskManager.hasMasks && this.globalData.renderer.restore(!0), this._isFirstFrame && (this._isFirstFrame = !1)
            }
        }, destroy: function () {
            this.canvasContext = null, this.data = null, this.globalData = null, this.maskManager.destroy()
        }, mHelper: new Matrix
    }, CVBaseElement.prototype.hide = CVBaseElement.prototype.hideElement, CVBaseElement.prototype.show = CVBaseElement.prototype.showElement, extendPrototype([BaseElement, TransformElement, CVBaseElement, HierarchyElement, FrameElement, RenderableElement], CVImageElement), CVImageElement.prototype.initElement = SVGShapeElement.prototype.initElement, CVImageElement.prototype.prepareFrame = IImageElement.prototype.prepareFrame, CVImageElement.prototype.createContent = function () {
        if (this.img.width && (this.assetData.w !== this.img.width || this.assetData.h !== this.img.height)) {
            var e = createTag("canvas");
            e.width = this.assetData.w, e.height = this.assetData.h;
            var r, a, s = e.getContext("2d"), h = this.img.width, n = this.img.height, m = h / n,
                T = this.assetData.w / this.assetData.h,
                R = this.assetData.pr || this.globalData.renderConfig.imagePreserveAspectRatio;
            T < m && "xMidYMid slice" === R || m < T && "xMidYMid slice" !== R ? r = (a = n) * T : a = (r = h) / T, s.drawImage(this.img, (h - r) / 2, (n - a) / 2, r, a, 0, 0, this.assetData.w, this.assetData.h), this.img = e
        }
    }, CVImageElement.prototype.renderInnerContent = function (e) {
        this.canvasContext.drawImage(this.img, 0, 0)
    }, CVImageElement.prototype.destroy = function () {
        this.img = null
    }, extendPrototype([CanvasRenderer, ICompElement, CVBaseElement], CVCompElement), CVCompElement.prototype.renderInnerContent = function () {
        var e, r = this.canvasContext;
        for (r.beginPath(), r.moveTo(0, 0), r.lineTo(this.data.w, 0), r.lineTo(this.data.w, this.data.h), r.lineTo(0, this.data.h), r.lineTo(0, 0), r.clip(), e = this.layers.length - 1; 0 <= e; e -= 1) (this.completeLayers || this.elements[e]) && this.elements[e].renderFrame()
    }, CVCompElement.prototype.destroy = function () {
        var e;
        for (e = this.layers.length - 1; 0 <= e; e -= 1) this.elements[e] && this.elements[e].destroy();
        this.layers = null, this.elements = null
    }, CVMaskElement.prototype.renderFrame = function () {
        if (this.hasMasks) {
            var e, r, a, s, h = this.element.finalTransform.mat, n = this.element.canvasContext,
                m = this.masksProperties.length;
            for (n.beginPath(), e = 0; e < m; e++) if ("n" !== this.masksProperties[e].mode) {
                this.masksProperties[e].inv && (n.moveTo(0, 0), n.lineTo(this.element.globalData.compSize.w, 0), n.lineTo(this.element.globalData.compSize.w, this.element.globalData.compSize.h), n.lineTo(0, this.element.globalData.compSize.h), n.lineTo(0, 0)), r = h.applyToPointArray((s = this.viewData[e].v).v[0][0], s.v[0][1], 0), n.moveTo(r[0], r[1]);
                var T, R = s._length;
                for (T = 1; T < R; T++) a = h.applyToTriplePoints(s.o[T - 1], s.i[T], s.v[T]), n.bezierCurveTo(a[0], a[1], a[2], a[3], a[4], a[5]);
                a = h.applyToTriplePoints(s.o[T - 1], s.i[0], s.v[0]), n.bezierCurveTo(a[0], a[1], a[2], a[3], a[4], a[5])
            }
            this.element.globalData.renderer.save(!0), n.clip()
        }
    }, CVMaskElement.prototype.getMaskProperty = MaskElement.prototype.getMaskProperty, CVMaskElement.prototype.destroy = function () {
        this.element = null
    }, extendPrototype([BaseElement, TransformElement, CVBaseElement, IShapeElement, HierarchyElement, FrameElement, RenderableElement], CVShapeElement), CVShapeElement.prototype.initElement = RenderableDOMElement.prototype.initElement, CVShapeElement.prototype.transformHelper = {
        opacity: 1,
        _opMdf: !1
    }, CVShapeElement.prototype.dashResetter = [], CVShapeElement.prototype.createContent = function () {
        this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, !0, [])
    }, CVShapeElement.prototype.createStyleElement = function (e, r) {
        var a = {
            data: e,
            type: e.ty,
            preTransforms: this.transformsManager.addTransformSequence(r),
            transforms: [],
            elements: [],
            closed: !0 === e.hd
        }, s = {};
        if ("fl" == e.ty || "st" == e.ty ? (s.c = PropertyFactory.getProp(this, e.c, 1, 255, this), s.c.k || (a.co = "rgb(" + bm_floor(s.c.v[0]) + "," + bm_floor(s.c.v[1]) + "," + bm_floor(s.c.v[2]) + ")")) : "gf" !== e.ty && "gs" !== e.ty || (s.s = PropertyFactory.getProp(this, e.s, 1, null, this), s.e = PropertyFactory.getProp(this, e.e, 1, null, this), s.h = PropertyFactory.getProp(this, e.h || {k: 0}, 0, .01, this), s.a = PropertyFactory.getProp(this, e.a || {k: 0}, 0, degToRads, this), s.g = new GradientProperty(this, e.g, this)), s.o = PropertyFactory.getProp(this, e.o, 0, .01, this), "st" == e.ty || "gs" == e.ty) {
            if (a.lc = this.lcEnum[e.lc] || "round", a.lj = this.ljEnum[e.lj] || "round", 1 == e.lj && (a.ml = e.ml), s.w = PropertyFactory.getProp(this, e.w, 0, null, this), s.w.k || (a.wi = s.w.v), e.d) {
                var h = new DashProperty(this, e.d, "canvas", this);
                s.d = h, s.d.k || (a.da = s.d.dashArray, a.do = s.d.dashoffset[0])
            }
        } else a.r = 2 === e.r ? "evenodd" : "nonzero";
        return this.stylesList.push(a), s.style = a, s
    }, CVShapeElement.prototype.createGroupElement = function (e) {
        return {it: [], prevViewData: []}
    }, CVShapeElement.prototype.createTransformElement = function (e) {
        return {
            transform: {
                opacity: 1,
                _opMdf: !1,
                key: this.transformsManager.getNewKey(),
                op: PropertyFactory.getProp(this, e.o, 0, .01, this),
                mProps: TransformPropertyFactory.getTransformProperty(this, e, this)
            }
        }
    }, CVShapeElement.prototype.createShapeElement = function (e) {
        var r = new CVShapeData(this, e, this.stylesList, this.transformsManager);
        return this.shapes.push(r), this.addShapeToModifiers(r), r
    }, CVShapeElement.prototype.reloadShapes = function () {
        this._isFirstFrame = !0;
        var e, r = this.itemsData.length;
        for (e = 0; e < r; e += 1) this.prevViewData[e] = this.itemsData[e];
        for (this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, !0, []), r = this.dynamicProperties.length, e = 0; e < r; e += 1) this.dynamicProperties[e].getValue();
        this.renderModifiers(), this.transformsManager.processSequences(this._isFirstFrame)
    }, CVShapeElement.prototype.addTransformToStyleList = function (e) {
        var r, a = this.stylesList.length;
        for (r = 0; r < a; r += 1) this.stylesList[r].closed || this.stylesList[r].transforms.push(e)
    }, CVShapeElement.prototype.removeTransformFromStyleList = function () {
        var e, r = this.stylesList.length;
        for (e = 0; e < r; e += 1) this.stylesList[e].closed || this.stylesList[e].transforms.pop()
    }, CVShapeElement.prototype.closeStyles = function (e) {
        var r, a = e.length;
        for (r = 0; r < a; r += 1) e[r].closed = !0
    }, CVShapeElement.prototype.searchShapes = function (e, r, a, s, h) {
        var n, m, T, R, k, U, W = e.length - 1, S = [], L = [], M = [].concat(h);
        for (n = W; 0 <= n; n -= 1) {
            if ((R = this.searchProcessedElement(e[n])) ? r[n] = a[R - 1] : e[n]._shouldRender = s, "fl" == e[n].ty || "st" == e[n].ty || "gf" == e[n].ty || "gs" == e[n].ty) R ? r[n].style.closed = !1 : r[n] = this.createStyleElement(e[n], M), S.push(r[n].style); else if ("gr" == e[n].ty) {
                if (R) for (T = r[n].it.length, m = 0; m < T; m += 1) r[n].prevViewData[m] = r[n].it[m]; else r[n] = this.createGroupElement(e[n]);
                this.searchShapes(e[n].it, r[n].it, r[n].prevViewData, s, M)
            } else "tr" == e[n].ty ? (R || (U = this.createTransformElement(e[n]), r[n] = U), M.push(r[n]), this.addTransformToStyleList(r[n])) : "sh" == e[n].ty || "rc" == e[n].ty || "el" == e[n].ty || "sr" == e[n].ty ? R || (r[n] = this.createShapeElement(e[n])) : "tm" == e[n].ty || "rd" == e[n].ty ? (R ? (k = r[n]).closed = !1 : ((k = ShapeModifiers.getModifier(e[n].ty)).init(this, e[n]), r[n] = k, this.shapeModifiers.push(k)), L.push(k)) : "rp" == e[n].ty && (R ? (k = r[n]).closed = !0 : (k = ShapeModifiers.getModifier(e[n].ty), (r[n] = k).init(this, e, n, r), this.shapeModifiers.push(k), s = !1), L.push(k));
            this.addProcessedElement(e[n], n + 1)
        }
        for (this.removeTransformFromStyleList(), this.closeStyles(S), W = L.length, n = 0; n < W; n += 1) L[n].closed = !0
    }, CVShapeElement.prototype.renderInnerContent = function () {
        this.transformHelper.opacity = 1, this.transformHelper._opMdf = !1, this.renderModifiers(), this.transformsManager.processSequences(this._isFirstFrame), this.renderShape(this.transformHelper, this.shapesData, this.itemsData, !0)
    }, CVShapeElement.prototype.renderShapeTransform = function (e, r) {
        (e._opMdf || r.op._mdf || this._isFirstFrame) && (r.opacity = e.opacity, r.opacity *= r.op.v, r._opMdf = !0)
    }, CVShapeElement.prototype.drawLayer = function () {
        var e, r, a, s, h, n, m, T, R, k = this.stylesList.length, U = this.globalData.renderer,
            W = this.globalData.canvasContext;
        for (e = 0; e < k; e += 1) if (("st" !== (T = (R = this.stylesList[e]).type) && "gs" !== T || 0 !== R.wi) && R.data._shouldRender && 0 !== R.coOp && 0 !== this.globalData.currentGlobalAlpha) {
            for (U.save(), n = R.elements, "st" === T || "gs" === T ? (W.strokeStyle = "st" === T ? R.co : R.grd, W.lineWidth = R.wi, W.lineCap = R.lc, W.lineJoin = R.lj, W.miterLimit = R.ml || 0) : W.fillStyle = "fl" === T ? R.co : R.grd, U.ctxOpacity(R.coOp), "st" !== T && "gs" !== T && W.beginPath(), U.ctxTransform(R.preTransforms.finalTransform.props), a = n.length, r = 0; r < a; r += 1) {
                for ("st" !== T && "gs" !== T || (W.beginPath(), R.da && (W.setLineDash(R.da), W.lineDashOffset = R.do)), h = (m = n[r].trNodes).length, s = 0; s < h; s += 1) "m" == m[s].t ? W.moveTo(m[s].p[0], m[s].p[1]) : "c" == m[s].t ? W.bezierCurveTo(m[s].pts[0], m[s].pts[1], m[s].pts[2], m[s].pts[3], m[s].pts[4], m[s].pts[5]) : W.closePath();
                "st" !== T && "gs" !== T || (W.stroke(), R.da && W.setLineDash(this.dashResetter))
            }
            "st" !== T && "gs" !== T && W.fill(R.r), U.restore()
        }
    }, CVShapeElement.prototype.renderShape = function (e, r, a, s) {
        var h, n;
        for (n = e, h = r.length - 1; 0 <= h; h -= 1) "tr" == r[h].ty ? this.renderShapeTransform(e, n = a[h].transform) : "sh" == r[h].ty || "el" == r[h].ty || "rc" == r[h].ty || "sr" == r[h].ty ? this.renderPath(r[h], a[h]) : "fl" == r[h].ty ? this.renderFill(r[h], a[h], n) : "st" == r[h].ty ? this.renderStroke(r[h], a[h], n) : "gf" == r[h].ty || "gs" == r[h].ty ? this.renderGradientFill(r[h], a[h], n) : "gr" == r[h].ty && this.renderShape(n, r[h].it, a[h].it);
        s && this.drawLayer()
    }, CVShapeElement.prototype.renderStyledShape = function (e, r) {
        if (this._isFirstFrame || r._mdf || e.transforms._mdf) {
            var a, s, h, n = e.trNodes, m = r.paths, T = m._length;
            n.length = 0;
            var R = e.transforms.finalTransform;
            for (h = 0; h < T; h += 1) {
                var k = m.shapes[h];
                if (k && k.v) {
                    for (s = k._length, a = 1; a < s; a += 1) 1 === a && n.push({
                        t: "m",
                        p: R.applyToPointArray(k.v[0][0], k.v[0][1], 0)
                    }), n.push({t: "c", pts: R.applyToTriplePoints(k.o[a - 1], k.i[a], k.v[a])});
                    1 === s && n.push({
                        t: "m",
                        p: R.applyToPointArray(k.v[0][0], k.v[0][1], 0)
                    }), k.c && s && (n.push({
                        t: "c",
                        pts: R.applyToTriplePoints(k.o[a - 1], k.i[0], k.v[0])
                    }), n.push({t: "z"}))
                }
            }
            e.trNodes = n
        }
    }, CVShapeElement.prototype.renderPath = function (e, r) {
        if (!0 !== e.hd && e._shouldRender) {
            var a, s = r.styledShapes.length;
            for (a = 0; a < s; a += 1) this.renderStyledShape(r.styledShapes[a], r.sh)
        }
    }, CVShapeElement.prototype.renderFill = function (e, r, a) {
        var s = r.style;
        (r.c._mdf || this._isFirstFrame) && (s.co = "rgb(" + bm_floor(r.c.v[0]) + "," + bm_floor(r.c.v[1]) + "," + bm_floor(r.c.v[2]) + ")"), (r.o._mdf || a._opMdf || this._isFirstFrame) && (s.coOp = r.o.v * a.opacity)
    }, CVShapeElement.prototype.renderGradientFill = function (e, r, a) {
        var s = r.style;
        if (!s.grd || r.g._mdf || r.s._mdf || r.e._mdf || 1 !== e.t && (r.h._mdf || r.a._mdf)) {
            var h = this.globalData.canvasContext, n = r.s.v, m = r.e.v;
            if (1 === e.t) S = h.createLinearGradient(n[0], n[1], m[0], m[1]); else var T = Math.sqrt(Math.pow(n[0] - m[0], 2) + Math.pow(n[1] - m[1], 2)),
                R = Math.atan2(m[1] - n[1], m[0] - n[0]), k = T * (1 <= r.h.v ? .99 : r.h.v <= -1 ? -.99 : r.h.v),
                U = Math.cos(R + r.a.v) * k + n[0], W = Math.sin(R + r.a.v) * k + n[1],
                S = h.createRadialGradient(U, W, 0, n[0], n[1], T);
            var L, M = e.g.p, v = r.g.c, g = 1;
            for (L = 0; L < M; L += 1) r.g._hasOpacity && r.g._collapsable && (g = r.g.o[2 * L + 1]), S.addColorStop(v[4 * L] / 100, "rgba(" + v[4 * L + 1] + "," + v[4 * L + 2] + "," + v[4 * L + 3] + "," + g + ")");
            s.grd = S
        }
        s.coOp = r.o.v * a.opacity
    }, CVShapeElement.prototype.renderStroke = function (e, r, a) {
        var s = r.style, h = r.d;
        h && (h._mdf || this._isFirstFrame) && (s.da = h.dashArray, s.do = h.dashoffset[0]), (r.c._mdf || this._isFirstFrame) && (s.co = "rgb(" + bm_floor(r.c.v[0]) + "," + bm_floor(r.c.v[1]) + "," + bm_floor(r.c.v[2]) + ")"), (r.o._mdf || a._opMdf || this._isFirstFrame) && (s.coOp = r.o.v * a.opacity), (r.w._mdf || this._isFirstFrame) && (s.wi = r.w.v)
    }, CVShapeElement.prototype.destroy = function () {
        this.shapesData = null, this.globalData = null, this.canvasContext = null, this.stylesList.length = 0, this.itemsData.length = 0
    }, extendPrototype([BaseElement, TransformElement, CVBaseElement, HierarchyElement, FrameElement, RenderableElement], CVSolidElement), CVSolidElement.prototype.initElement = SVGShapeElement.prototype.initElement, CVSolidElement.prototype.prepareFrame = IImageElement.prototype.prepareFrame, CVSolidElement.prototype.renderInnerContent = function () {
        var e = this.canvasContext;
        e.fillStyle = this.data.sc, e.fillRect(0, 0, this.data.sw, this.data.sh)
    }, extendPrototype([BaseElement, TransformElement, CVBaseElement, HierarchyElement, FrameElement, RenderableElement, ITextElement], CVTextElement), CVTextElement.prototype.tHelper = createTag("canvas").getContext("2d"), CVTextElement.prototype.buildNewText = function () {
        var e = this.textProperty.currentData;
        this.renderedLetters = createSizedArray(e.l ? e.l.length : 0);
        var r = !1;
        e.fc ? (r = !0, this.values.fill = this.buildColor(e.fc)) : this.values.fill = "rgba(0,0,0,0)", this.fill = r;
        var a = !1;
        e.sc && (a = !0, this.values.stroke = this.buildColor(e.sc), this.values.sWidth = e.sw);
        var s, h, n = this.globalData.fontManager.getFontByName(e.f), m = e.l, T = this.mHelper;
        this.stroke = a, this.values.fValue = e.finalSize + "px " + this.globalData.fontManager.getFontByName(e.f).fFamily, h = e.finalText.length;
        var R, k, U, W, S, L, M, v, g, x, Q = this.data.singleShape, t0 = e.tr / 1e3 * e.finalSize, s0 = 0, M0 = 0,
            a0 = !0, d0 = 0;
        for (s = 0; s < h; s += 1) {
            for (k = (R = this.globalData.fontManager.getCharData(e.finalText[s], n.fStyle, this.globalData.fontManager.getFontByName(e.f).fFamily)) && R.data || {}, T.reset(), Q && m[s].n && (s0 = -t0, M0 += e.yOffset, M0 += a0 ? 1 : 0, a0 = !1), M = (S = k.shapes ? k.shapes[0].it : []).length, T.scale(e.finalSize / 100, e.finalSize / 100), Q && this.applyTextPropertiesToMatrix(e, T, m[s].line, s0, M0), g = createSizedArray(M), L = 0; L < M; L += 1) {
                for (W = S[L].ks.k.i.length, v = S[L].ks.k, x = [], U = 1; U < W; U += 1) 1 == U && x.push(T.applyToX(v.v[0][0], v.v[0][1], 0), T.applyToY(v.v[0][0], v.v[0][1], 0)), x.push(T.applyToX(v.o[U - 1][0], v.o[U - 1][1], 0), T.applyToY(v.o[U - 1][0], v.o[U - 1][1], 0), T.applyToX(v.i[U][0], v.i[U][1], 0), T.applyToY(v.i[U][0], v.i[U][1], 0), T.applyToX(v.v[U][0], v.v[U][1], 0), T.applyToY(v.v[U][0], v.v[U][1], 0));
                x.push(T.applyToX(v.o[U - 1][0], v.o[U - 1][1], 0), T.applyToY(v.o[U - 1][0], v.o[U - 1][1], 0), T.applyToX(v.i[0][0], v.i[0][1], 0), T.applyToY(v.i[0][0], v.i[0][1], 0), T.applyToX(v.v[0][0], v.v[0][1], 0), T.applyToY(v.v[0][0], v.v[0][1], 0)), g[L] = x
            }
            Q && (s0 += m[s].l, s0 += t0), this.textSpans[d0] ? this.textSpans[d0].elem = g : this.textSpans[d0] = {elem: g}, d0 += 1
        }
    }, CVTextElement.prototype.renderInnerContent = function () {
        var e, r, a, s, h, n, m = this.canvasContext;
        m.font = this.values.fValue, m.lineCap = "butt", m.lineJoin = "miter", m.miterLimit = 4, this.data.singleShape || this.textAnimator.getMeasures(this.textProperty.currentData, this.lettersChangedFlag);
        var T, R = this.textAnimator.renderedLetters, k = this.textProperty.currentData.l;
        r = k.length;
        var U, W, S = null, L = null, M = null;
        for (e = 0; e < r; e += 1) if (!k[e].n) {
            if ((T = R[e]) && (this.globalData.renderer.save(), this.globalData.renderer.ctxTransform(T.p), this.globalData.renderer.ctxOpacity(T.o)), this.fill) {
                for (T && T.fc ? S !== T.fc && (S = T.fc, m.fillStyle = T.fc) : S !== this.values.fill && (S = this.values.fill, m.fillStyle = this.values.fill), s = (U = this.textSpans[e].elem).length, this.globalData.canvasContext.beginPath(), a = 0; a < s; a += 1) for (n = (W = U[a]).length, this.globalData.canvasContext.moveTo(W[0], W[1]), h = 2; h < n; h += 6) this.globalData.canvasContext.bezierCurveTo(W[h], W[h + 1], W[h + 2], W[h + 3], W[h + 4], W[h + 5]);
                this.globalData.canvasContext.closePath(), this.globalData.canvasContext.fill()
            }
            if (this.stroke) {
                for (T && T.sw ? M !== T.sw && (M = T.sw, m.lineWidth = T.sw) : M !== this.values.sWidth && (M = this.values.sWidth, m.lineWidth = this.values.sWidth), T && T.sc ? L !== T.sc && (L = T.sc, m.strokeStyle = T.sc) : L !== this.values.stroke && (L = this.values.stroke, m.strokeStyle = this.values.stroke), s = (U = this.textSpans[e].elem).length, this.globalData.canvasContext.beginPath(), a = 0; a < s; a += 1) for (n = (W = U[a]).length, this.globalData.canvasContext.moveTo(W[0], W[1]), h = 2; h < n; h += 6) this.globalData.canvasContext.bezierCurveTo(W[h], W[h + 1], W[h + 2], W[h + 3], W[h + 4], W[h + 5]);
                this.globalData.canvasContext.closePath(), this.globalData.canvasContext.stroke()
            }
            T && this.globalData.renderer.restore()
        }
    }, CVEffects.prototype.renderFrame = function () {
    }, HBaseElement.prototype = {
        checkBlendMode: function () {
        }, initRendererElement: function () {
            this.baseElement = createTag(this.data.tg || "div"), this.data.hasMask ? (this.svgElement = createNS("svg"), this.layerElement = createNS("g"), this.maskedElement = this.layerElement, this.svgElement.appendChild(this.layerElement), this.baseElement.appendChild(this.svgElement)) : this.layerElement = this.baseElement, styleDiv(this.baseElement)
        }, createContainerElements: function () {
            this.renderableEffectsManager = new CVEffects(this), this.transformedElement = this.baseElement, this.maskedElement = this.layerElement, this.data.ln && this.layerElement.setAttribute("id", this.data.ln), this.data.cl && this.layerElement.setAttribute("class", this.data.cl), 0 !== this.data.bm && this.setBlendMode()
        }, renderElement: function () {
            this.finalTransform._matMdf && (this.transformedElement.style.transform = this.transformedElement.style.webkitTransform = this.finalTransform.mat.toCSS()), this.finalTransform._opMdf && (this.transformedElement.style.opacity = this.finalTransform.mProp.o.v)
        }, renderFrame: function () {
            this.data.hd || this.hidden || (this.renderTransform(), this.renderRenderable(), this.renderElement(), this.renderInnerContent(), this._isFirstFrame && (this._isFirstFrame = !1))
        }, destroy: function () {
            this.layerElement = null, this.transformedElement = null, this.matteElement && (this.matteElement = null), this.maskManager && (this.maskManager.destroy(), this.maskManager = null)
        }, createRenderableComponents: function () {
            this.maskManager = new MaskElement(this.data, this, this.globalData)
        }, addEffects: function () {
        }, setMatte: function () {
        }
    }, HBaseElement.prototype.getBaseElement = SVGBaseElement.prototype.getBaseElement, HBaseElement.prototype.destroyBaseElement = HBaseElement.prototype.destroy, HBaseElement.prototype.buildElementParenting = HybridRenderer.prototype.buildElementParenting, extendPrototype([BaseElement, TransformElement, HBaseElement, HierarchyElement, FrameElement, RenderableDOMElement], HSolidElement), HSolidElement.prototype.createContent = function () {
        var e;
        this.data.hasMask ? ((e = createNS("rect")).setAttribute("width", this.data.sw), e.setAttribute("height", this.data.sh), e.setAttribute("fill", this.data.sc), this.svgElement.setAttribute("width", this.data.sw), this.svgElement.setAttribute("height", this.data.sh)) : ((e = createTag("div")).style.width = this.data.sw + "px", e.style.height = this.data.sh + "px", e.style.backgroundColor = this.data.sc), this.layerElement.appendChild(e)
    }, extendPrototype([HybridRenderer, ICompElement, HBaseElement], HCompElement), HCompElement.prototype._createBaseContainerElements = HCompElement.prototype.createContainerElements, HCompElement.prototype.createContainerElements = function () {
        this._createBaseContainerElements(), this.data.hasMask ? (this.svgElement.setAttribute("width", this.data.w), this.svgElement.setAttribute("height", this.data.h), this.transformedElement = this.baseElement) : this.transformedElement = this.layerElement
    }, HCompElement.prototype.addTo3dContainer = function (e, r) {
        for (var a, s = 0; s < r;) this.elements[s] && this.elements[s].getBaseElement && (a = this.elements[s].getBaseElement()), s += 1;
        a ? this.layerElement.insertBefore(e, a) : this.layerElement.appendChild(e)
    }, extendPrototype([BaseElement, TransformElement, HSolidElement, SVGShapeElement, HBaseElement, HierarchyElement, FrameElement, RenderableElement], HShapeElement), HShapeElement.prototype._renderShapeFrame = HShapeElement.prototype.renderInnerContent, HShapeElement.prototype.createContent = function () {
        var e;
        if (this.baseElement.style.fontSize = 0, this.data.hasMask) this.layerElement.appendChild(this.shapesContainer), e = this.svgElement; else {
            e = createNS("svg");
            var r = this.comp.data ? this.comp.data : this.globalData.compSize;
            e.setAttribute("width", r.w), e.setAttribute("height", r.h), e.appendChild(this.shapesContainer), this.layerElement.appendChild(e)
        }
        this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, this.shapesContainer, 0, [], !0), this.filterUniqueShapes(), this.shapeCont = e
    }, HShapeElement.prototype.getTransformedPoint = function (e, r) {
        var a, s = e.length;
        for (a = 0; a < s; a += 1) r = e[a].mProps.v.applyToPointArray(r[0], r[1], 0);
        return r
    }, HShapeElement.prototype.calculateShapeBoundingBox = function (e, r) {
        var a, s, h, n, m, T = e.sh.v, R = e.transformers, k = T._length;
        if (!(k <= 1)) {
            for (a = 0; a < k - 1; a += 1) s = this.getTransformedPoint(R, T.v[a]), h = this.getTransformedPoint(R, T.o[a]), n = this.getTransformedPoint(R, T.i[a + 1]), m = this.getTransformedPoint(R, T.v[a + 1]), this.checkBounds(s, h, n, m, r);
            T.c && (s = this.getTransformedPoint(R, T.v[a]), h = this.getTransformedPoint(R, T.o[a]), n = this.getTransformedPoint(R, T.i[0]), m = this.getTransformedPoint(R, T.v[0]), this.checkBounds(s, h, n, m, r))
        }
    }, HShapeElement.prototype.checkBounds = function (e, r, a, s, h) {
        this.getBoundsOfCurve(e, r, a, s);
        var n = this.shapeBoundingBox;
        h.x = bm_min(n.left, h.x), h.xMax = bm_max(n.right, h.xMax), h.y = bm_min(n.top, h.y), h.yMax = bm_max(n.bottom, h.yMax)
    }, HShapeElement.prototype.shapeBoundingBox = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    }, HShapeElement.prototype.tempBoundingBox = {
        x: 0,
        xMax: 0,
        y: 0,
        yMax: 0,
        width: 0,
        height: 0
    }, HShapeElement.prototype.getBoundsOfCurve = function (e, r, a, s) {
        for (var h, n, m, T, R, k, U, W = [[e[0], s[0]], [e[1], s[1]]], S = 0; S < 2; ++S) if (n = 6 * e[S] - 12 * r[S] + 6 * a[S], h = -3 * e[S] + 9 * r[S] - 9 * a[S] + 3 * s[S], m = 3 * r[S] - 3 * e[S], n |= 0, m |= 0, 0 != (h |= 0)) (R = n * n - 4 * m * h) < 0 || (0 < (k = (-n + bm_sqrt(R)) / (2 * h)) && k < 1 && W[S].push(this.calculateF(k, e, r, a, s, S)), 0 < (U = (-n - bm_sqrt(R)) / (2 * h)) && U < 1 && W[S].push(this.calculateF(U, e, r, a, s, S))); else {
            if (0 === n) continue;
            0 < (T = -m / n) && T < 1 && W[S].push(this.calculateF(T, e, r, a, s, S))
        }
        this.shapeBoundingBox.left = bm_min.apply(null, W[0]), this.shapeBoundingBox.top = bm_min.apply(null, W[1]), this.shapeBoundingBox.right = bm_max.apply(null, W[0]), this.shapeBoundingBox.bottom = bm_max.apply(null, W[1])
    }, HShapeElement.prototype.calculateF = function (e, r, a, s, h, n) {
        return bm_pow(1 - e, 3) * r[n] + 3 * bm_pow(1 - e, 2) * e * a[n] + 3 * (1 - e) * bm_pow(e, 2) * s[n] + bm_pow(e, 3) * h[n]
    }, HShapeElement.prototype.calculateBoundingBox = function (e, r) {
        var a, s = e.length;
        for (a = 0; a < s; a += 1) e[a] && e[a].sh ? this.calculateShapeBoundingBox(e[a], r) : e[a] && e[a].it && this.calculateBoundingBox(e[a].it, r)
    }, HShapeElement.prototype.currentBoxContains = function (e) {
        return this.currentBBox.x <= e.x && this.currentBBox.y <= e.y && this.currentBBox.width + this.currentBBox.x >= e.x + e.width && this.currentBBox.height + this.currentBBox.y >= e.y + e.height
    }, HShapeElement.prototype.renderInnerContent = function () {
        if (this._renderShapeFrame(), !this.hidden && (this._isFirstFrame || this._mdf)) {
            var e = this.tempBoundingBox, r = 999999;
            if (e.x = r, e.xMax = -r, e.y = r, e.yMax = -r, this.calculateBoundingBox(this.itemsData, e), e.width = e.xMax < e.x ? 0 : e.xMax - e.x, e.height = e.yMax < e.y ? 0 : e.yMax - e.y, this.currentBoxContains(e)) return;
            var a = !1;
            this.currentBBox.w !== e.width && (this.currentBBox.w = e.width, this.shapeCont.setAttribute("width", e.width), a = !0), this.currentBBox.h !== e.height && (this.currentBBox.h = e.height, this.shapeCont.setAttribute("height", e.height), a = !0), (a || this.currentBBox.x !== e.x || this.currentBBox.y !== e.y) && (this.currentBBox.w = e.width, this.currentBBox.h = e.height, this.currentBBox.x = e.x, this.currentBBox.y = e.y, this.shapeCont.setAttribute("viewBox", this.currentBBox.x + " " + this.currentBBox.y + " " + this.currentBBox.w + " " + this.currentBBox.h), this.shapeCont.style.transform = this.shapeCont.style.webkitTransform = "translate(" + this.currentBBox.x + "px," + this.currentBBox.y + "px)")
        }
    }, extendPrototype([BaseElement, TransformElement, HBaseElement, HierarchyElement, FrameElement, RenderableDOMElement, ITextElement], HTextElement), HTextElement.prototype.createContent = function () {
        if (this.isMasked = this.checkMasks(), this.isMasked) {
            this.renderType = "svg", this.compW = this.comp.data.w, this.compH = this.comp.data.h, this.svgElement.setAttribute("width", this.compW), this.svgElement.setAttribute("height", this.compH);
            var e = createNS("g");
            this.maskedElement.appendChild(e), this.innerElem = e
        } else this.renderType = "html", this.innerElem = this.layerElement;
        this.checkParenting()
    }, HTextElement.prototype.buildNewText = function () {
        var e = this.textProperty.currentData;
        this.renderedLetters = createSizedArray(e.l ? e.l.length : 0);
        var r = this.innerElem.style;
        r.color = r.fill = e.fc ? this.buildColor(e.fc) : "rgba(0,0,0,0)", e.sc && (r.stroke = this.buildColor(e.sc), r.strokeWidth = e.sw + "px");
        var a, s, h = this.globalData.fontManager.getFontByName(e.f);
        if (!this.globalData.fontManager.chars) if (r.fontSize = e.finalSize + "px", r.lineHeight = e.finalSize + "px", h.fClass) this.innerElem.className = h.fClass; else {
            r.fontFamily = h.fFamily;
            var n = e.fWeight;
            r.fontStyle = e.fStyle, r.fontWeight = n
        }
        var T, R, k, U = e.l;
        s = U.length;
        var W, S = this.mHelper, L = "", M = 0;
        for (a = 0; a < s; a += 1) {
            if (this.globalData.fontManager.chars ? (this.textPaths[M] ? T = this.textPaths[M] : ((T = createNS("path")).setAttribute("stroke-linecap", "butt"), T.setAttribute("stroke-linejoin", "round"), T.setAttribute("stroke-miterlimit", "4")), this.isMasked || (this.textSpans[M] ? k = (R = this.textSpans[M]).children[0] : ((R = createTag("div")).style.lineHeight = 0, (k = createNS("svg")).appendChild(T), styleDiv(R)))) : this.isMasked ? T = this.textPaths[M] ? this.textPaths[M] : createNS("text") : this.textSpans[M] ? (R = this.textSpans[M], T = this.textPaths[M]) : (styleDiv(R = createTag("span")), styleDiv(T = createTag("span")), R.appendChild(T)), this.globalData.fontManager.chars) {
                var v,
                    g = this.globalData.fontManager.getCharData(e.finalText[a], h.fStyle, this.globalData.fontManager.getFontByName(e.f).fFamily);
                if (v = g ? g.data : null, S.reset(), v && v.shapes && (W = v.shapes[0].it, S.scale(e.finalSize / 100, e.finalSize / 100), L = this.createPathShape(S, W), T.setAttribute("d", L)), this.isMasked) this.innerElem.appendChild(T); else {
                    if (this.innerElem.appendChild(R), v && v.shapes) {
                        document.body.appendChild(k);
                        var x = k.getBBox();
                        k.setAttribute("width", x.width + 2), k.setAttribute("height", x.height + 2), k.setAttribute("viewBox", x.x - 1 + " " + (x.y - 1) + " " + (x.width + 2) + " " + (x.height + 2)), k.style.transform = k.style.webkitTransform = "translate(" + (x.x - 1) + "px," + (x.y - 1) + "px)", U[a].yOffset = x.y - 1
                    } else k.setAttribute("width", 1), k.setAttribute("height", 1);
                    R.appendChild(k)
                }
            } else T.textContent = U[a].val, T.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", "preserve"), this.isMasked ? this.innerElem.appendChild(T) : (this.innerElem.appendChild(R), T.style.transform = T.style.webkitTransform = "translate3d(0," + -e.finalSize / 1.2 + "px,0)");
            this.textSpans[M] = this.isMasked ? T : R, this.textSpans[M].style.display = "block", this.textPaths[M] = T, M += 1
        }
        for (; M < this.textSpans.length;) this.textSpans[M].style.display = "none", M += 1
    }, HTextElement.prototype.renderInnerContent = function () {
        if (this.data.singleShape) {
            if (!this._isFirstFrame && !this.lettersChangedFlag) return;
            this.isMasked && this.finalTransform._matMdf && (this.svgElement.setAttribute("viewBox", -this.finalTransform.mProp.p.v[0] + " " + -this.finalTransform.mProp.p.v[1] + " " + this.compW + " " + this.compH), this.svgElement.style.transform = this.svgElement.style.webkitTransform = "translate(" + -this.finalTransform.mProp.p.v[0] + "px," + -this.finalTransform.mProp.p.v[1] + "px)")
        }
        if (this.textAnimator.getMeasures(this.textProperty.currentData, this.lettersChangedFlag), this.lettersChangedFlag || this.textAnimator.lettersChangedFlag) {
            var e, r, a, s, h, n = 0, m = this.textAnimator.renderedLetters, T = this.textProperty.currentData.l;
            for (r = T.length, e = 0; e < r; e += 1) T[e].n ? n += 1 : (s = this.textSpans[e], h = this.textPaths[e], a = m[n], n += 1, a._mdf.m && (this.isMasked ? s.setAttribute("transform", a.m) : s.style.transform = s.style.webkitTransform = a.m), s.style.opacity = a.o, a.sw && a._mdf.sw && h.setAttribute("stroke-width", a.sw), a.sc && a._mdf.sc && h.setAttribute("stroke", a.sc), a.fc && a._mdf.fc && (h.setAttribute("fill", a.fc), h.style.color = a.fc));
            if (this.innerElem.getBBox && !this.hidden && (this._isFirstFrame || this._mdf)) {
                var R = this.innerElem.getBBox();
                this.currentBBox.w !== R.width && (this.currentBBox.w = R.width, this.svgElement.setAttribute("width", R.width)), this.currentBBox.h !== R.height && (this.currentBBox.h = R.height, this.svgElement.setAttribute("height", R.height)), this.currentBBox.w === R.width + 2 && this.currentBBox.h === R.height + 2 && this.currentBBox.x === R.x - 1 && this.currentBBox.y === R.y - 1 || (this.currentBBox.w = R.width + 2, this.currentBBox.h = R.height + 2, this.currentBBox.x = R.x - 1, this.currentBBox.y = R.y - 1, this.svgElement.setAttribute("viewBox", this.currentBBox.x + " " + this.currentBBox.y + " " + this.currentBBox.w + " " + this.currentBBox.h), this.svgElement.style.transform = this.svgElement.style.webkitTransform = "translate(" + this.currentBBox.x + "px," + this.currentBBox.y + "px)")
            }
        }
    }, extendPrototype([BaseElement, TransformElement, HBaseElement, HSolidElement, HierarchyElement, FrameElement, RenderableElement], HImageElement), HImageElement.prototype.createContent = function () {
        var e = this.globalData.getAssetsPath(this.assetData), r = new Image;
        this.data.hasMask ? (this.imageElem = createNS("image"), this.imageElem.setAttribute("width", this.assetData.w + "px"), this.imageElem.setAttribute("height", this.assetData.h + "px"), this.imageElem.setAttributeNS("http://www.w3.org/1999/xlink", "href", e), this.layerElement.appendChild(this.imageElem), this.baseElement.setAttribute("width", this.assetData.w), this.baseElement.setAttribute("height", this.assetData.h)) : this.layerElement.appendChild(r), r.src = e, this.data.ln && this.baseElement.setAttribute("id", this.data.ln)
    }, extendPrototype([BaseElement, FrameElement, HierarchyElement], HCameraElement), HCameraElement.prototype.setup = function () {
        var e, r, a = this.comp.threeDElements.length;
        for (e = 0; e < a; e += 1) "3d" === (r = this.comp.threeDElements[e]).type && (r.perspectiveElem.style.perspective = r.perspectiveElem.style.webkitPerspective = this.pe.v + "px", r.container.style.transformOrigin = r.container.style.mozTransformOrigin = r.container.style.webkitTransformOrigin = "0px 0px 0px", r.perspectiveElem.style.transform = r.perspectiveElem.style.webkitTransform = "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)")
    }, HCameraElement.prototype.createElements = function () {
    }, HCameraElement.prototype.hide = function () {
    }, HCameraElement.prototype.renderFrame = function () {
        var e, r, a = this._isFirstFrame;
        if (this.hierarchy) for (r = this.hierarchy.length, e = 0; e < r; e += 1) a = this.hierarchy[e].finalTransform.mProp._mdf || a;
        if (a || this.pe._mdf || this.p && this.p._mdf || this.px && (this.px._mdf || this.py._mdf || this.pz._mdf) || this.rx._mdf || this.ry._mdf || this.rz._mdf || this.or._mdf || this.a && this.a._mdf) {
            if (this.mat.reset(), this.hierarchy) for (e = r = this.hierarchy.length - 1; 0 <= e; e -= 1) {
                var s = this.hierarchy[e].finalTransform.mProp;
                this.mat.translate(-s.p.v[0], -s.p.v[1], s.p.v[2]), this.mat.rotateX(-s.or.v[0]).rotateY(-s.or.v[1]).rotateZ(s.or.v[2]), this.mat.rotateX(-s.rx.v).rotateY(-s.ry.v).rotateZ(s.rz.v), this.mat.scale(1 / s.s.v[0], 1 / s.s.v[1], 1 / s.s.v[2]), this.mat.translate(s.a.v[0], s.a.v[1], s.a.v[2])
            }
            if (this.p ? this.mat.translate(-this.p.v[0], -this.p.v[1], this.p.v[2]) : this.mat.translate(-this.px.v, -this.py.v, this.pz.v), this.a) {
                var h;
                h = this.p ? [this.p.v[0] - this.a.v[0], this.p.v[1] - this.a.v[1], this.p.v[2] - this.a.v[2]] : [this.px.v - this.a.v[0], this.py.v - this.a.v[1], this.pz.v - this.a.v[2]];
                var n = Math.sqrt(Math.pow(h[0], 2) + Math.pow(h[1], 2) + Math.pow(h[2], 2)),
                    m = [h[0] / n, h[1] / n, h[2] / n], T = Math.sqrt(m[2] * m[2] + m[0] * m[0]),
                    R = Math.atan2(m[1], T), k = Math.atan2(m[0], -m[2]);
                this.mat.rotateY(k).rotateX(-R)
            }
            this.mat.rotateX(-this.rx.v).rotateY(-this.ry.v).rotateZ(this.rz.v), this.mat.rotateX(-this.or.v[0]).rotateY(-this.or.v[1]).rotateZ(this.or.v[2]), this.mat.translate(this.globalData.compSize.w / 2, this.globalData.compSize.h / 2, 0), this.mat.translate(0, 0, this.pe.v);
            var U = !this._prevMat.equals(this.mat);
            if ((U || this.pe._mdf) && this.comp.threeDElements) {
                var W;
                for (r = this.comp.threeDElements.length, e = 0; e < r; e += 1) "3d" === (W = this.comp.threeDElements[e]).type && (U && (W.container.style.transform = W.container.style.webkitTransform = this.mat.toCSS()), this.pe._mdf && (W.perspectiveElem.style.perspective = W.perspectiveElem.style.webkitPerspective = this.pe.v + "px"));
                this.mat.clone(this._prevMat)
            }
        }
        this._isFirstFrame = !1
    }, HCameraElement.prototype.prepareFrame = function (e) {
        this.prepareProperties(e, !0)
    }, HCameraElement.prototype.destroy = function () {
    }, HCameraElement.prototype.getBaseElement = function () {
        return null
    }, HEffects.prototype.renderFrame = function () {
    };
    var animationManager = function () {
        var e = {}, r = [], a = 0, s = 0, h = 0, n = !0, m = !1;

        function T(v) {
            for (var g = 0, x = v.target; g < s;) r[g].animation === x && (r.splice(g, 1), g -= 1, s -= 1, x.isPaused || U()), g += 1
        }

        function R(v, g) {
            if (!v) return null;
            for (var x = 0; x < s;) {
                if (r[x].elem == v && null !== r[x].elem) return r[x].animation;
                x += 1
            }
            var Q = new AnimationItem;
            return W(Q, v), Q.setData(v, g), Q
        }

        function k() {
            h += 1, M()
        }

        function U() {
            h -= 1
        }

        function W(v, g) {
            v.addEventListener("destroy", T), v.addEventListener("_active", k), v.addEventListener("_idle", U), r.push({
                elem: g,
                animation: v
            }), s += 1
        }

        function S(v) {
            var g, x = v - a;
            for (g = 0; g < s; g += 1) r[g].animation.advanceTime(x);
            a = v, h && !m ? window.requestAnimationFrame(S) : n = !0
        }

        function L(v) {
            a = v, window.requestAnimationFrame(S)
        }

        function M() {
            !m && h && n && (window.requestAnimationFrame(L), n = !1)
        }

        return e.registerAnimation = R, e.loadAnimation = function (v) {
            var g = new AnimationItem;
            return W(g, null), g.setParams(v), g
        }, e.setSpeed = function (v, g) {
            var x;
            for (x = 0; x < s; x += 1) r[x].animation.setSpeed(v, g)
        }, e.setDirection = function (v, g) {
            var x;
            for (x = 0; x < s; x += 1) r[x].animation.setDirection(v, g)
        }, e.play = function (v) {
            var g;
            for (g = 0; g < s; g += 1) r[g].animation.play(v)
        }, e.pause = function (v) {
            var g;
            for (g = 0; g < s; g += 1) r[g].animation.pause(v)
        }, e.stop = function (v) {
            var g;
            for (g = 0; g < s; g += 1) r[g].animation.stop(v)
        }, e.togglePause = function (v) {
            var g;
            for (g = 0; g < s; g += 1) r[g].animation.togglePause(v)
        }, e.searchAnimations = function (v, g, x) {
            var Q,
                t0 = [].concat([].slice.call(document.getElementsByClassName("lottie")), [].slice.call(document.getElementsByClassName("bodymovin"))),
                s0 = t0.length;
            for (Q = 0; Q < s0; Q += 1) x && t0[Q].setAttribute("data-bm-type", x), R(t0[Q], v);
            if (g && 0 === s0) {
                x || (x = "svg");
                var M0 = document.getElementsByTagName("body")[0];
                M0.innerHTML = "";
                var a0 = createTag("div");
                a0.style.width = "100%", a0.style.height = "100%", a0.setAttribute("data-bm-type", x), M0.appendChild(a0), R(a0, v)
            }
        }, e.resize = function () {
            var v;
            for (v = 0; v < s; v += 1) r[v].animation.resize()
        }, e.goToAndStop = function (v, g, x) {
            var Q;
            for (Q = 0; Q < s; Q += 1) r[Q].animation.goToAndStop(v, g, x)
        }, e.destroy = function (v) {
            var g;
            for (g = s - 1; 0 <= g; g -= 1) r[g].animation.destroy(v)
        }, e.freeze = function () {
            m = !0
        }, e.unfreeze = function () {
            m = !1, M()
        }, e.getRegisteredAnimations = function () {
            var v, g = r.length, x = [];
            for (v = 0; v < g; v += 1) x.push(r[v].animation);
            return x
        }, e
    }(), AnimationItem = function () {
        this._cbs = [], this.name = "", this.path = "", this.isLoaded = !1, this.currentFrame = 0, this.currentRawFrame = 0, this.firstFrame = 0, this.totalFrames = 0, this.frameRate = 0, this.frameMult = 0, this.playSpeed = 1, this.playDirection = 1, this.playCount = 0, this.animationData = {}, this.assets = [], this.isPaused = !0, this.autoplay = !1, this.loop = !0, this.renderer = null, this.animationID = createElementID(), this.assetsPath = "", this.timeCompleted = 0, this.segmentPos = 0, this.subframeEnabled = subframeEnabled, this.segments = [], this._idle = !0, this._completedLoop = !1, this.projectInterface = ProjectInterface(), this.imagePreloader = new ImagePreloader
    };
    extendPrototype([BaseEvent], AnimationItem), AnimationItem.prototype.setParams = function (e) {
        e.context && (this.context = e.context), (e.wrapper || e.container) && (this.wrapper = e.wrapper || e.container);
        var r = e.animType ? e.animType : e.renderer ? e.renderer : "svg";
        switch (r) {
            case"canvas":
                this.renderer = new CanvasRenderer(this, e.rendererSettings);
                break;
            case"svg":
                this.renderer = new SVGRenderer(this, e.rendererSettings);
                break;
            default:
                this.renderer = new HybridRenderer(this, e.rendererSettings)
        }
        this.renderer.setProjectInterface(this.projectInterface), this.animType = r, "" === e.loop || null === e.loop || (this.loop = !1 !== e.loop && (!0 === e.loop || parseInt(e.loop))), this.autoplay = !("autoplay" in e) || e.autoplay, this.name = e.name ? e.name : "", this.autoloadSegments = !e.hasOwnProperty("autoloadSegments") || e.autoloadSegments, this.assetsPath = e.assetsPath, e.animationData ? this.configAnimation(e.animationData) : e.path && (this.path = -1 !== e.path.lastIndexOf("\\") ? e.path.substr(0, e.path.lastIndexOf("\\") + 1) : e.path.substr(0, e.path.lastIndexOf("/") + 1), this.fileName = e.path.substr(e.path.lastIndexOf("/") + 1), this.fileName = this.fileName.substr(0, this.fileName.lastIndexOf(".json")), assetLoader.load(e.path, this.configAnimation.bind(this), function () {
            this.trigger("data_failed")
        }.bind(this))), this.initialSegment = e.initialSegment
    }, AnimationItem.prototype.setData = function (e, r) {
        var a = {wrapper: e, animationData: r ? "object" == typeof r ? r : JSON.parse(r) : null}, s = e.attributes;
        a.path = s.getNamedItem("data-animation-path") ? s.getNamedItem("data-animation-path").value : s.getNamedItem("data-bm-path") ? s.getNamedItem("data-bm-path").value : s.getNamedItem("bm-path") ? s.getNamedItem("bm-path").value : "", a.animType = s.getNamedItem("data-anim-type") ? s.getNamedItem("data-anim-type").value : s.getNamedItem("data-bm-type") ? s.getNamedItem("data-bm-type").value : s.getNamedItem("bm-type") ? s.getNamedItem("bm-type").value : s.getNamedItem("data-bm-renderer") ? s.getNamedItem("data-bm-renderer").value : s.getNamedItem("bm-renderer") ? s.getNamedItem("bm-renderer").value : "canvas";
        var h = s.getNamedItem("data-anim-loop") ? s.getNamedItem("data-anim-loop").value : s.getNamedItem("data-bm-loop") ? s.getNamedItem("data-bm-loop").value : s.getNamedItem("bm-loop") ? s.getNamedItem("bm-loop").value : "";
        "" === h || (a.loop = "false" !== h && ("true" === h || parseInt(h)));
        var n = s.getNamedItem("data-anim-autoplay") ? s.getNamedItem("data-anim-autoplay").value : s.getNamedItem("data-bm-autoplay") ? s.getNamedItem("data-bm-autoplay").value : !s.getNamedItem("bm-autoplay") || s.getNamedItem("bm-autoplay").value;
        a.autoplay = "false" !== n, a.name = s.getNamedItem("data-name") ? s.getNamedItem("data-name").value : s.getNamedItem("data-bm-name") ? s.getNamedItem("data-bm-name").value : s.getNamedItem("bm-name") ? s.getNamedItem("bm-name").value : "", "false" === (s.getNamedItem("data-anim-prerender") ? s.getNamedItem("data-anim-prerender").value : s.getNamedItem("data-bm-prerender") ? s.getNamedItem("data-bm-prerender").value : s.getNamedItem("bm-prerender") ? s.getNamedItem("bm-prerender").value : "") && (a.prerender = !1), this.setParams(a)
    }, AnimationItem.prototype.includeLayers = function (e) {
        e.op > this.animationData.op && (this.animationData.op = e.op, this.totalFrames = Math.floor(e.op - this.animationData.ip));
        var r, a, s = this.animationData.layers, h = s.length, n = e.layers, m = n.length;
        for (a = 0; a < m; a += 1) for (r = 0; r < h;) {
            if (s[r].id == n[a].id) {
                s[r] = n[a];
                break
            }
            r += 1
        }
        if ((e.chars || e.fonts) && (this.renderer.globalData.fontManager.addChars(e.chars), this.renderer.globalData.fontManager.addFonts(e.fonts, this.renderer.globalData.defs)), e.assets) for (h = e.assets.length, r = 0; r < h; r += 1) this.animationData.assets.push(e.assets[r]);
        this.animationData.__complete = !1, dataManager.completeData(this.animationData, this.renderer.globalData.fontManager), this.renderer.includeLayers(e.layers), expressionsPlugin && expressionsPlugin.initExpressions(this), this.loadNextSegment()
    }, AnimationItem.prototype.loadNextSegment = function () {
        var e = this.animationData.segments;
        if (!e || 0 === e.length || !this.autoloadSegments) return this.trigger("data_ready"), void (this.timeCompleted = this.totalFrames);
        var r = e.shift();
        this.timeCompleted = r.time * this.frameRate;
        var a = this.path + this.fileName + "_" + this.segmentPos + ".json";
        this.segmentPos += 1, assetLoader.load(a, this.includeLayers.bind(this), function () {
            this.trigger("data_failed")
        }.bind(this))
    }, AnimationItem.prototype.loadSegments = function () {
        this.animationData.segments || (this.timeCompleted = this.totalFrames), this.loadNextSegment()
    }, AnimationItem.prototype.imagesLoaded = function () {
        this.trigger("loaded_images"), this.checkLoaded()
    }, AnimationItem.prototype.preloadImages = function () {
        this.imagePreloader.setAssetsPath(this.assetsPath), this.imagePreloader.setPath(this.path), this.imagePreloader.loadAssets(this.animationData.assets, this.imagesLoaded.bind(this))
    }, AnimationItem.prototype.configAnimation = function (e) {
        if (this.renderer) try {
            this.animationData = e, this.initialSegment ? (this.totalFrames = Math.floor(this.initialSegment[1] - this.initialSegment[0]), this.firstFrame = Math.round(this.initialSegment[0])) : (this.totalFrames = Math.floor(this.animationData.op - this.animationData.ip), this.firstFrame = Math.round(this.animationData.ip)), this.renderer.configAnimation(e), e.assets || (e.assets = []), this.assets = this.animationData.assets, this.frameRate = this.animationData.fr, this.frameMult = this.animationData.fr / 1e3, this.renderer.searchExtraCompositions(e.assets), this.trigger("config_ready"), this.preloadImages(), this.loadSegments(), this.updaFrameModifier(), this.waitForFontsLoaded()
        } catch (r) {
            this.triggerConfigError(r)
        }
    }, AnimationItem.prototype.waitForFontsLoaded = function () {
        this.renderer && (this.renderer.globalData.fontManager.loaded() ? this.checkLoaded() : setTimeout(this.waitForFontsLoaded.bind(this), 20))
    }, AnimationItem.prototype.checkLoaded = function () {
        this.isLoaded || !this.renderer.globalData.fontManager.loaded() || !this.imagePreloader.loaded() && "canvas" === this.renderer.rendererType || (this.isLoaded = !0, dataManager.completeData(this.animationData, this.renderer.globalData.fontManager), expressionsPlugin && expressionsPlugin.initExpressions(this), this.renderer.initItems(), setTimeout(function () {
            this.trigger("DOMLoaded")
        }.bind(this), 0), this.gotoFrame(), this.autoplay && this.play())
    }, AnimationItem.prototype.resize = function () {
        this.renderer.updateContainerSize()
    }, AnimationItem.prototype.setSubframe = function (e) {
        this.subframeEnabled = !!e
    }, AnimationItem.prototype.gotoFrame = function () {
        this.currentFrame = this.subframeEnabled ? this.currentRawFrame : ~~this.currentRawFrame, this.timeCompleted !== this.totalFrames && this.currentFrame > this.timeCompleted && (this.currentFrame = this.timeCompleted), this.trigger("enterFrame"), this.renderFrame()
    }, AnimationItem.prototype.renderFrame = function () {
        if (!1 !== this.isLoaded) try {
            this.renderer.renderFrame(this.currentFrame + this.firstFrame)
        } catch (e) {
            this.triggerRenderFrameError(e)
        }
    }, AnimationItem.prototype.play = function (e) {
        e && this.name != e || !0 === this.isPaused && (this.isPaused = !1, this._idle && (this._idle = !1, this.trigger("_active")))
    }, AnimationItem.prototype.pause = function (e) {
        e && this.name != e || !1 === this.isPaused && (this.isPaused = !0, this._idle = !0, this.trigger("_idle"))
    }, AnimationItem.prototype.togglePause = function (e) {
        e && this.name != e || (!0 === this.isPaused ? this.play() : this.pause())
    }, AnimationItem.prototype.stop = function (e) {
        e && this.name != e || (this.pause(), this.playCount = 0, this._completedLoop = !1, this.setCurrentRawFrameValue(0))
    }, AnimationItem.prototype.goToAndStop = function (e, r, a) {
        a && this.name != a || (this.setCurrentRawFrameValue(r ? e : e * this.frameModifier), this.pause())
    }, AnimationItem.prototype.goToAndPlay = function (e, r, a) {
        this.goToAndStop(e, r, a), this.play()
    }, AnimationItem.prototype.advanceTime = function (e) {
        if (!0 !== this.isPaused && !1 !== this.isLoaded) {
            var r = this.currentRawFrame + e * this.frameModifier, a = !1;
            r >= this.totalFrames - 1 && 0 < this.frameModifier ? this.loop && this.playCount !== this.loop ? r >= this.totalFrames ? (this.playCount += 1, this.checkSegments(r % this.totalFrames) || (this.setCurrentRawFrameValue(r % this.totalFrames), this._completedLoop = !0, this.trigger("loopComplete"))) : this.setCurrentRawFrameValue(r) : this.checkSegments(r > this.totalFrames ? r % this.totalFrames : 0) || (a = !0, r = this.totalFrames - 1) : r < 0 ? this.checkSegments(r % this.totalFrames) || (!this.loop || this.playCount-- <= 0 && !0 !== this.loop ? (a = !0, r = 0) : (this.setCurrentRawFrameValue(this.totalFrames + r % this.totalFrames), this._completedLoop ? this.trigger("loopComplete") : this._completedLoop = !0)) : this.setCurrentRawFrameValue(r), a && (this.setCurrentRawFrameValue(r), this.pause(), this.trigger("complete"))
        }
    }, AnimationItem.prototype.adjustSegment = function (e, r) {
        this.playCount = 0, e[1] < e[0] ? (0 < this.frameModifier && (this.playSpeed < 0 ? this.setSpeed(-this.playSpeed) : this.setDirection(-1)), this.timeCompleted = this.totalFrames = e[0] - e[1], this.firstFrame = e[1], this.setCurrentRawFrameValue(this.totalFrames - .001 - r)) : e[1] > e[0] && (this.frameModifier < 0 && (this.playSpeed < 0 ? this.setSpeed(-this.playSpeed) : this.setDirection(1)), this.timeCompleted = this.totalFrames = e[1] - e[0], this.firstFrame = e[0], this.setCurrentRawFrameValue(.001 + r)), this.trigger("segmentStart")
    }, AnimationItem.prototype.setSegment = function (e, r) {
        var a = -1;
        this.isPaused && (this.currentRawFrame + this.firstFrame < e ? a = e : this.currentRawFrame + this.firstFrame > r && (a = r - e)), this.firstFrame = e, this.timeCompleted = this.totalFrames = r - e, -1 !== a && this.goToAndStop(a, !0)
    }, AnimationItem.prototype.playSegments = function (e, r) {
        if (r && (this.segments.length = 0), "object" == typeof e[0]) {
            var a, s = e.length;
            for (a = 0; a < s; a += 1) this.segments.push(e[a])
        } else this.segments.push(e);
        this.segments.length && r && this.adjustSegment(this.segments.shift(), 0), this.isPaused && this.play()
    }, AnimationItem.prototype.resetSegments = function (e) {
        this.segments.length = 0, this.segments.push([this.animationData.ip, this.animationData.op]), e && this.checkSegments(0)
    }, AnimationItem.prototype.checkSegments = function (e) {
        return !!this.segments.length && (this.adjustSegment(this.segments.shift(), e), !0)
    }, AnimationItem.prototype.destroy = function (e) {
        e && this.name != e || !this.renderer || (this.renderer.destroy(), this.imagePreloader.destroy(), this.trigger("destroy"), this._cbs = null, this.onEnterFrame = this.onLoopComplete = this.onComplete = this.onSegmentStart = this.onDestroy = null, this.renderer = null)
    }, AnimationItem.prototype.setCurrentRawFrameValue = function (e) {
        this.currentRawFrame = e, this.gotoFrame()
    }, AnimationItem.prototype.setSpeed = function (e) {
        this.playSpeed = e, this.updaFrameModifier()
    }, AnimationItem.prototype.setDirection = function (e) {
        this.playDirection = e < 0 ? -1 : 1, this.updaFrameModifier()
    }, AnimationItem.prototype.updaFrameModifier = function () {
        this.frameModifier = this.frameMult * this.playSpeed * this.playDirection
    }, AnimationItem.prototype.getPath = function () {
        return this.path
    }, AnimationItem.prototype.getAssetsPath = function (e) {
        var r = "";
        if (e.e) r = e.p; else if (this.assetsPath) {
            var a = e.p;
            -1 !== a.indexOf("images/") && (a = a.split("/")[1]), r = this.assetsPath + a
        } else r = this.path, r += e.u ? e.u : "", r += e.p;
        return r
    }, AnimationItem.prototype.getAssetData = function (e) {
        for (var r = 0, a = this.assets.length; r < a;) {
            if (e == this.assets[r].id) return this.assets[r];
            r += 1
        }
    }, AnimationItem.prototype.hide = function () {
        this.renderer.hide()
    }, AnimationItem.prototype.show = function () {
        this.renderer.show()
    }, AnimationItem.prototype.getDuration = function (e) {
        return e ? this.totalFrames : this.totalFrames / this.frameRate
    }, AnimationItem.prototype.trigger = function (e) {
        if (this._cbs && this._cbs[e]) switch (e) {
            case"enterFrame":
                this.triggerEvent(e, new BMEnterFrameEvent(e, this.currentFrame, this.totalFrames, this.frameModifier));
                break;
            case"loopComplete":
                this.triggerEvent(e, new BMCompleteLoopEvent(e, this.loop, this.playCount, this.frameMult));
                break;
            case"complete":
                this.triggerEvent(e, new BMCompleteEvent(e, this.frameMult));
                break;
            case"segmentStart":
                this.triggerEvent(e, new BMSegmentStartEvent(e, this.firstFrame, this.totalFrames));
                break;
            case"destroy":
                this.triggerEvent(e, new BMDestroyEvent(e, this));
                break;
            default:
                this.triggerEvent(e)
        }
        "enterFrame" === e && this.onEnterFrame && this.onEnterFrame.call(this, new BMEnterFrameEvent(e, this.currentFrame, this.totalFrames, this.frameMult)), "loopComplete" === e && this.onLoopComplete && this.onLoopComplete.call(this, new BMCompleteLoopEvent(e, this.loop, this.playCount, this.frameMult)), "complete" === e && this.onComplete && this.onComplete.call(this, new BMCompleteEvent(e, this.frameMult)), "segmentStart" === e && this.onSegmentStart && this.onSegmentStart.call(this, new BMSegmentStartEvent(e, this.firstFrame, this.totalFrames)), "destroy" === e && this.onDestroy && this.onDestroy.call(this, new BMDestroyEvent(e, this))
    }, AnimationItem.prototype.triggerRenderFrameError = function (e) {
        var r = new BMRenderFrameErrorEvent(e, this.currentFrame);
        this.triggerEvent("error", r), this.onError && this.onError.call(this, r)
    }, AnimationItem.prototype.triggerConfigError = function (e) {
        var r = new BMConfigErrorEvent(e, this.currentFrame);
        this.triggerEvent("error", r), this.onError && this.onError.call(this, r)
    };
    var Expressions = (HW = {}, HW.initExpressions = function (e) {
        var r = 0, a = [];
        e.renderer.compInterface = CompExpressionInterface(e.renderer), e.renderer.globalData.projectInterface.registerComposition(e.renderer), e.renderer.globalData.pushExpression = function () {
            r += 1
        }, e.renderer.globalData.popExpression = function () {
            0 == (r -= 1) && function s() {
                var h, n = a.length;
                for (h = 0; h < n; h += 1) a[h].release();
                a.length = 0
            }()
        }, e.renderer.globalData.registerExpressionProperty = function (h) {
            -1 === a.indexOf(h) && a.push(h)
        }
    }, HW), HW;
    expressionsPlugin = Expressions;
    var ExpressionManager = function () {
        var ob = {}, Math = BMMath, window = null, document = null;

        function $bm_isInstanceOfArray(e) {
            return e.constructor === Array || e.constructor === Float32Array
        }

        function isNumerable(e, r) {
            return "number" === e || "boolean" === e || "string" === e || r instanceof Number
        }

        function $bm_neg(e) {
            var r = typeof e;
            if ("number" === r || "boolean" === r || e instanceof Number) return -e;
            if ($bm_isInstanceOfArray(e)) {
                var a, s = e.length, h = [];
                for (a = 0; a < s; a += 1) h[a] = -e[a];
                return h
            }
            return e.propType ? e.v : void 0
        }

        var easeInBez = BezierFactory.getBezierEasing(.333, 0, .833, .833, "easeIn").get,
            easeOutBez = BezierFactory.getBezierEasing(.167, .167, .667, 1, "easeOut").get,
            easeInOutBez = BezierFactory.getBezierEasing(.33, 0, .667, 1, "easeInOut").get;

        function sum(e, r) {
            var a = typeof e, s = typeof r;
            if ("string" === a || "string" === s || isNumerable(a, e) && isNumerable(s, r)) return e + r;
            if ($bm_isInstanceOfArray(e) && isNumerable(s, r)) return (e = e.slice(0))[0] = e[0] + r, e;
            if (isNumerable(a, e) && $bm_isInstanceOfArray(r)) return (r = r.slice(0))[0] = e + r[0], r;
            if ($bm_isInstanceOfArray(e) && $bm_isInstanceOfArray(r)) {
                for (var h = 0, n = e.length, m = r.length, T = []; h < n || h < m;) T[h] = ("number" == typeof e[h] || e[h] instanceof Number) && ("number" == typeof r[h] || r[h] instanceof Number) ? e[h] + r[h] : void 0 === r[h] ? e[h] : e[h] || r[h], h += 1;
                return T
            }
            return 0
        }

        var add = sum;

        function sub(e, r) {
            var a = typeof e, s = typeof r;
            if (isNumerable(a, e) && isNumerable(s, r)) return "string" === a && (e = parseInt(e)), "string" === s && (r = parseInt(r)), e - r;
            if ($bm_isInstanceOfArray(e) && isNumerable(s, r)) return (e = e.slice(0))[0] = e[0] - r, e;
            if (isNumerable(a, e) && $bm_isInstanceOfArray(r)) return (r = r.slice(0))[0] = e - r[0], r;
            if ($bm_isInstanceOfArray(e) && $bm_isInstanceOfArray(r)) {
                for (var h = 0, n = e.length, m = r.length, T = []; h < n || h < m;) T[h] = ("number" == typeof e[h] || e[h] instanceof Number) && ("number" == typeof r[h] || r[h] instanceof Number) ? e[h] - r[h] : void 0 === r[h] ? e[h] : e[h] || r[h], h += 1;
                return T
            }
            return 0
        }

        function mul(e, r) {
            var a, s, h, n = typeof e, m = typeof r;
            if (isNumerable(n, e) && isNumerable(m, r)) return e * r;
            if ($bm_isInstanceOfArray(e) && isNumerable(m, r)) {
                for (a = createTypedArray("float32", h = e.length), s = 0; s < h; s += 1) a[s] = e[s] * r;
                return a
            }
            if (isNumerable(n, e) && $bm_isInstanceOfArray(r)) {
                for (a = createTypedArray("float32", h = r.length), s = 0; s < h; s += 1) a[s] = e * r[s];
                return a
            }
            return 0
        }

        function div(e, r) {
            var a, s, h, n = typeof e, m = typeof r;
            if (isNumerable(n, e) && isNumerable(m, r)) return e / r;
            if ($bm_isInstanceOfArray(e) && isNumerable(m, r)) {
                for (a = createTypedArray("float32", h = e.length), s = 0; s < h; s += 1) a[s] = e[s] / r;
                return a
            }
            if (isNumerable(n, e) && $bm_isInstanceOfArray(r)) {
                for (a = createTypedArray("float32", h = r.length), s = 0; s < h; s += 1) a[s] = e / r[s];
                return a
            }
            return 0
        }

        function mod(e, r) {
            return "string" == typeof e && (e = parseInt(e)), "string" == typeof r && (r = parseInt(r)), e % r
        }

        var $bm_sum = sum, $bm_sub = sub, $bm_mul = mul, $bm_div = div, $bm_mod = mod;

        function clamp(e, r, a) {
            if (a < r) {
                var s = a;
                a = r, r = s
            }
            return Math.min(Math.max(e, r), a)
        }

        function radiansToDegrees(e) {
            return e / degToRads
        }

        var radians_to_degrees = radiansToDegrees;

        function degreesToRadians(e) {
            return e * degToRads
        }

        var degrees_to_radians = radiansToDegrees, helperLengthArray = [0, 0, 0, 0, 0, 0];

        function length(e, r) {
            if ("number" == typeof e || e instanceof Number) return Math.abs(e - (r = r || 0));
            r || (r = helperLengthArray);
            var a, s = Math.min(e.length, r.length), h = 0;
            for (a = 0; a < s; a += 1) h += Math.pow(r[a] - e[a], 2);
            return Math.sqrt(h)
        }

        function normalize(e) {
            return div(e, length(e))
        }

        function rgbToHsl(e) {
            var r, a, s = e[0], h = e[1], n = e[2], m = Math.max(s, h, n), T = Math.min(s, h, n), R = (m + T) / 2;
            if (m == T) r = a = 0; else {
                var k = m - T;
                switch (a = .5 < R ? k / (2 - m - T) : k / (m + T), m) {
                    case s:
                        r = (h - n) / k + (h < n ? 6 : 0);
                        break;
                    case h:
                        r = (n - s) / k + 2;
                        break;
                    case n:
                        r = (s - h) / k + 4
                }
                r /= 6
            }
            return [r, a, R, e[3]]
        }

        function hue2rgb(e, r, a) {
            return a < 0 && (a += 1), 1 < a && (a -= 1), a < 1 / 6 ? e + 6 * (r - e) * a : a < .5 ? r : a < 2 / 3 ? e + (r - e) * (2 / 3 - a) * 6 : e
        }

        function hslToRgb(e) {
            var r, a, s, h = e[0], n = e[1], m = e[2];
            if (0 === n) r = a = s = m; else {
                var T = m < .5 ? m * (1 + n) : m + n - m * n, R = 2 * m - T;
                r = hue2rgb(R, T, h + 1 / 3), a = hue2rgb(R, T, h), s = hue2rgb(R, T, h - 1 / 3)
            }
            return [r, a, s, e[3]]
        }

        function linear(e, r, a, s, h) {
            if (void 0 !== s && void 0 !== h || (s = r, h = a, r = 0, a = 1), a < r) {
                var n = a;
                a = r, r = n
            }
            if (e <= r) return s;
            if (a <= e) return h;
            var m = a === r ? 0 : (e - r) / (a - r);
            if (!s.length) return s + (h - s) * m;
            var T, R = s.length, k = createTypedArray("float32", R);
            for (T = 0; T < R; T += 1) k[T] = s[T] + (h[T] - s[T]) * m;
            return k
        }

        function random(e, r) {
            if (void 0 === r && (void 0 === e ? (e = 0, r = 1) : (r = e, e = void 0)), r.length) {
                var a, s = r.length;
                e || (e = createTypedArray("float32", s));
                var h = createTypedArray("float32", s), n = BMMath.random();
                for (a = 0; a < s; a += 1) h[a] = e[a] + n * (r[a] - e[a]);
                return h
            }
            return void 0 === e && (e = 0), e + BMMath.random() * (r - e)
        }

        function createPath(e, r, a, s) {
            var h, n = e.length, m = shape_pool.newElement();
            m.setPathData(!!s, n);
            var T, R, k = [0, 0];
            for (h = 0; h < n; h += 1) m.setTripleAt(e[h][0], e[h][1], (R = a && a[h] ? a[h] : k)[0] + e[h][0], R[1] + e[h][1], (T = r && r[h] ? r[h] : k)[0] + e[h][0], T[1] + e[h][1], h, !0);
            return m
        }

        function initiateExpression(elem, data, property) {
            var val = data.x, needsVelocity = /velocity(?![\w\d])/.test(val),
                _needsRandom = -1 !== val.indexOf("random"), elemType = elem.data.ty, transform, $bm_transform, content,
                effect, thisProperty = property;
            thisProperty.valueAtTime = thisProperty.getValueAtTime, Object.defineProperty(thisProperty, "value", {
                get: function () {
                    return thisProperty.v
                }
            }), elem.comp.frameDuration = 1 / elem.comp.globalData.frameRate, elem.comp.displayStartTime = 0;
            var inPoint = elem.data.ip / elem.comp.globalData.frameRate,
                outPoint = elem.data.op / elem.comp.globalData.frameRate, width = elem.data.sw ? elem.data.sw : 0,
                height = elem.data.sh ? elem.data.sh : 0, name = elem.data.nm, loopIn, loop_in, loopOut, loop_out,
                smooth, toWorld, fromWorld, fromComp, toComp, fromCompToSurface, position, rotation, anchorPoint, scale,
                thisLayer, thisComp, mask, valueAtTime, velocityAtTime, __expression_functions = [], scoped_bm_rt;
            if (data.xf) {
                var i, len = data.xf.length;
                for (i = 0; i < len; i += 1) __expression_functions[i] = eval("(function(){ return " + data.xf[i] + "}())")
            }
            var expression_function = eval("[function _expression_function(){" + val + ";scoped_bm_rt=$bm_rt}]")[0],
                numKeys = property.kf ? data.k.length : 0, active = !this.data || !0 !== this.data.hd,
                wiggle = function (e, r) {
                    var a, s, h = this.pv.length ? this.pv.length : 1, n = createTypedArray("float32", h),
                        m = Math.floor(5 * time);
                    for (s = a = 0; a < m;) {
                        for (s = 0; s < h; s += 1) n[s] += -r + 2 * r * BMMath.random();
                        a += 1
                    }
                    var T = 5 * time, R = T - Math.floor(T), k = createTypedArray("float32", h);
                    if (1 < h) {
                        for (s = 0; s < h; s += 1) k[s] = this.pv[s] + n[s] + (-r + 2 * r * BMMath.random()) * R;
                        return k
                    }
                    return this.pv + n[0] + (-r + 2 * r * BMMath.random()) * R
                }.bind(this);

            function loopInDuration(e, r) {
                return loopIn(e, r, !0)
            }

            function loopOutDuration(e, r) {
                return loopOut(e, r, !0)
            }

            thisProperty.loopIn && (loopIn = thisProperty.loopIn.bind(thisProperty), loop_in = loopIn), thisProperty.loopOut && (loopOut = thisProperty.loopOut.bind(thisProperty), loop_out = loopOut), thisProperty.smooth && (smooth = thisProperty.smooth.bind(thisProperty)), this.getValueAtTime && (valueAtTime = this.getValueAtTime.bind(this)), this.getVelocityAtTime && (velocityAtTime = this.getVelocityAtTime.bind(this));
            var comp = elem.comp.globalData.projectInterface.bind(elem.comp.globalData.projectInterface), time,
                velocity, value, text, textIndex, textTotal, selectorValue;

            function lookAt(e, r) {
                var a = [r[0] - e[0], r[1] - e[1], r[2] - e[2]],
                    s = Math.atan2(a[0], Math.sqrt(a[1] * a[1] + a[2] * a[2])) / degToRads;
                return [-Math.atan2(a[1], a[2]) / degToRads, s, 0]
            }

            function easeOut(e, r, a, s, h) {
                return applyEase(easeOutBez, e, r, a, s, h)
            }

            function easeIn(e, r, a, s, h) {
                return applyEase(easeInBez, e, r, a, s, h)
            }

            function ease(e, r, a, s, h) {
                return applyEase(easeInOutBez, e, r, a, s, h)
            }

            function applyEase(e, r, a, s, h, n) {
                void 0 === h ? (h = a, n = s) : r = (r - a) / (s - a);
                var m = e(r = 1 < r ? 1 : r < 0 ? 0 : r);
                if ($bm_isInstanceOfArray(h)) {
                    var T, R = h.length, k = createTypedArray("float32", R);
                    for (T = 0; T < R; T += 1) k[T] = (n[T] - h[T]) * m + h[T];
                    return k
                }
                return (n - h) * m + h
            }

            function nearestKey(e) {
                var r, a, s, h = data.k.length;
                if (data.k.length && "number" != typeof data.k[0]) if (a = -1, (e *= elem.comp.globalData.frameRate) < data.k[0].t) a = 1, s = data.k[0].t; else {
                    for (r = 0; r < h - 1; r += 1) {
                        if (e === data.k[r].t) {
                            a = r + 1, s = data.k[r].t;
                            break
                        }
                        if (e > data.k[r].t && e < data.k[r + 1].t) {
                            s = e - data.k[r].t > data.k[r + 1].t - e ? (a = r + 2, data.k[r + 1].t) : (a = r + 1, data.k[r].t);
                            break
                        }
                    }
                    -1 === a && (a = r + 1, s = data.k[r].t)
                } else s = a = 0;
                var n = {};
                return n.index = a, n.time = s / elem.comp.globalData.frameRate, n
            }

            function key(e) {
                var r, a, s;
                if (!data.k.length || "number" == typeof data.k[0]) throw new Error("The property has no keyframe at index " + e);
                r = {time: data.k[e -= 1].t / elem.comp.globalData.frameRate, value: []};
                var h = data.k[e].hasOwnProperty("s") ? data.k[e].s : data.k[e - 1].e;
                for (s = h.length, a = 0; a < s; a += 1) r[a] = h[a], r.value[a] = h[a];
                return r
            }

            function framesToTime(e, r) {
                return r || (r = elem.comp.globalData.frameRate), e / r
            }

            function timeToFrames(e, r) {
                return e || 0 === e || (e = time), r || (r = elem.comp.globalData.frameRate), e * r
            }

            function seedRandom(e) {
                BMMath.seedrandom(randSeed + e)
            }

            function sourceRectAtTime() {
                return elem.sourceRectAtTime()
            }

            function substring(e, r) {
                return "string" == typeof value ? void 0 === r ? value.substring(e) : value.substring(e, r) : ""
            }

            function substr(e, r) {
                return "string" == typeof value ? void 0 === r ? value.substr(e) : value.substr(e, r) : ""
            }

            function posterizeTime(e) {
                time = 0 === e ? 0 : Math.floor(time * e) / e, value = valueAtTime(time)
            }

            var index = elem.data.ind, hasParent = !(!elem.hierarchy || !elem.hierarchy.length), parent,
                randSeed = Math.floor(1e6 * Math.random()), globalData = elem.globalData;

            function executeExpression(e) {
                return value = e, _needsRandom && seedRandom(randSeed), this.frameExpressionId === elem.globalData.frameId && "textSelector" !== this.propType ? value : ("textSelector" === this.propType && (textIndex = this.textIndex, textTotal = this.textTotal, selectorValue = this.selectorValue), thisLayer || (text = elem.layerInterface.text, thisComp = elem.comp.compInterface, toWorld = (thisLayer = elem.layerInterface).toWorld.bind(thisLayer), fromWorld = thisLayer.fromWorld.bind(thisLayer), fromComp = thisLayer.fromComp.bind(thisLayer), toComp = thisLayer.toComp.bind(thisLayer), mask = thisLayer.mask ? thisLayer.mask.bind(thisLayer) : null, fromCompToSurface = fromComp), transform || (transform = elem.layerInterface("ADBE Transform Group"), ($bm_transform = transform) && (anchorPoint = transform.anchorPoint)), 4 !== elemType || content || (content = thisLayer("ADBE Root Vectors Group")), effect || (effect = thisLayer(4)), (hasParent = !(!elem.hierarchy || !elem.hierarchy.length)) && !parent && (parent = elem.hierarchy[0].layerInterface), time = this.comp.renderedFrame / this.comp.globalData.frameRate, needsVelocity && (velocity = velocityAtTime(time)), expression_function(), this.frameExpressionId = elem.globalData.frameId, "shape" === scoped_bm_rt.propType && (scoped_bm_rt = scoped_bm_rt.v), scoped_bm_rt)
            }

            return executeExpression
        }

        return ob.initiateExpression = initiateExpression, ob
    }(), expressionHelpers = {
        searchExpressions: function (e, r, a) {
            r.x && (a.k = !0, a.x = !0, a.initiateExpression = ExpressionManager.initiateExpression, a.effectsSequence.push(a.initiateExpression(e, r, a).bind(a)))
        }, getSpeedAtTime: function (e) {
            var r = this.getValueAtTime(e), a = this.getValueAtTime(e + -.01), s = 0;
            if (r.length) {
                var h;
                for (h = 0; h < r.length; h += 1) s += Math.pow(a[h] - r[h], 2);
                s = 100 * Math.sqrt(s)
            } else s = 0;
            return s
        }, getVelocityAtTime: function (e) {
            if (void 0 !== this.vel) return this.vel;
            var r, a, s = this.getValueAtTime(e), h = this.getValueAtTime(e + -.001);
            if (s.length) for (r = createTypedArray("float32", s.length), a = 0; a < s.length; a += 1) r[a] = (h[a] - s[a]) / -.001; else r = (h - s) / -.001;
            return r
        }, getValueAtTime: function (e) {
            return e *= this.elem.globalData.frameRate, (e -= this.offsetTime) !== this._cachingAtTime.lastFrame && (this._cachingAtTime.lastIndex = this._cachingAtTime.lastFrame < e ? this._cachingAtTime.lastIndex : 0, this._cachingAtTime.value = this.interpolateValue(e, this._cachingAtTime), this._cachingAtTime.lastFrame = e), this._cachingAtTime.value
        }, getStaticValueAtTime: function () {
            return this.pv
        }, setGroupProperty: function (e) {
            this.propertyGroup = e
        }
    };
    (function () {
        function e(k, U, W) {
            if (!this.k || !this.keyframes) return this.pv;
            k = k ? k.toLowerCase() : "";
            var S, L, M, v, g, x = this.comp.renderedFrame, Q = this.keyframes, t0 = Q[Q.length - 1].t;
            if (x <= t0) return this.pv;
            if (W ? L = t0 - (S = U ? Math.abs(t0 - elem.comp.globalData.frameRate * U) : Math.max(0, t0 - this.elem.data.ip)) : ((!U || U > Q.length - 1) && (U = Q.length - 1), S = t0 - (L = Q[Q.length - 1 - U].t)), "pingpong" === k) {
                if (Math.floor((x - L) / S) % 2 != 0) return this.getValueAtTime((S - (x - L) % S + L) / this.comp.globalData.frameRate, 0)
            } else {
                if ("offset" === k) {
                    var s0 = this.getValueAtTime(L / this.comp.globalData.frameRate, 0),
                        M0 = this.getValueAtTime(t0 / this.comp.globalData.frameRate, 0),
                        a0 = this.getValueAtTime(((x - L) % S + L) / this.comp.globalData.frameRate, 0),
                        d0 = Math.floor((x - L) / S);
                    if (this.pv.length) {
                        for (v = (g = new Array(s0.length)).length, M = 0; M < v; M += 1) g[M] = (M0[M] - s0[M]) * d0 + a0[M];
                        return g
                    }
                    return (M0 - s0) * d0 + a0
                }
                if ("continue" === k) {
                    var A0 = this.getValueAtTime(t0 / this.comp.globalData.frameRate, 0),
                        E0 = this.getValueAtTime((t0 - .001) / this.comp.globalData.frameRate, 0);
                    if (this.pv.length) {
                        for (v = (g = new Array(A0.length)).length, M = 0; M < v; M += 1) g[M] = A0[M] + (x - t0) / this.comp.globalData.frameRate * (A0[M] - E0[M]) / 5e-4;
                        return g
                    }
                    return A0 + (x - t0) / .001 * (A0 - E0)
                }
            }
            return this.getValueAtTime(((x - L) % S + L) / this.comp.globalData.frameRate, 0)
        }

        function r(k, U, W) {
            if (!this.k) return this.pv;
            k = k ? k.toLowerCase() : "";
            var S, L, M, v, g, x = this.comp.renderedFrame, Q = this.keyframes, t0 = Q[0].t;
            if (t0 <= x) return this.pv;
            if (W ? L = t0 + (S = U ? Math.abs(elem.comp.globalData.frameRate * U) : Math.max(0, this.elem.data.op - t0)) : ((!U || U > Q.length - 1) && (U = Q.length - 1), S = (L = Q[U].t) - t0), "pingpong" === k) {
                if (Math.floor((t0 - x) / S) % 2 == 0) return this.getValueAtTime(((t0 - x) % S + t0) / this.comp.globalData.frameRate, 0)
            } else {
                if ("offset" === k) {
                    var s0 = this.getValueAtTime(t0 / this.comp.globalData.frameRate, 0),
                        M0 = this.getValueAtTime(L / this.comp.globalData.frameRate, 0),
                        a0 = this.getValueAtTime((S - (t0 - x) % S + t0) / this.comp.globalData.frameRate, 0),
                        d0 = Math.floor((t0 - x) / S) + 1;
                    if (this.pv.length) {
                        for (v = (g = new Array(s0.length)).length, M = 0; M < v; M += 1) g[M] = a0[M] - (M0[M] - s0[M]) * d0;
                        return g
                    }
                    return a0 - (M0 - s0) * d0
                }
                if ("continue" === k) {
                    var A0 = this.getValueAtTime(t0 / this.comp.globalData.frameRate, 0),
                        E0 = this.getValueAtTime((t0 + .001) / this.comp.globalData.frameRate, 0);
                    if (this.pv.length) {
                        for (v = (g = new Array(A0.length)).length, M = 0; M < v; M += 1) g[M] = A0[M] + (A0[M] - E0[M]) * (t0 - x) / .001;
                        return g
                    }
                    return A0 + (A0 - E0) * (t0 - x) / .001
                }
            }
            return this.getValueAtTime((S - (t0 - x) % S + t0) / this.comp.globalData.frameRate, 0)
        }

        function a(k, U) {
            if (!this.k) return this.pv;
            if (k = .5 * (k || .4), (U = Math.floor(U || 5)) <= 1) return this.pv;
            var W, S, L = this.comp.renderedFrame / this.comp.globalData.frameRate, M = L - k,
                v = 1 < U ? (L + k - M) / (U - 1) : 1, g = 0, x = 0;
            for (W = this.pv.length ? createTypedArray("float32", this.pv.length) : 0; g < U;) {
                if (S = this.getValueAtTime(M + g * v), this.pv.length) for (x = 0; x < this.pv.length; x += 1) W[x] += S[x]; else W += S;
                g += 1
            }
            if (this.pv.length) for (x = 0; x < this.pv.length; x += 1) W[x] /= U; else W /= U;
            return W
        }

        var s = TransformPropertyFactory.getTransformProperty;
        TransformPropertyFactory.getTransformProperty = function (k, U, W) {
            var S = s(k, U, W);
            return S.getValueAtTime = S.dynamicProperties.length ? function (L) {
                console.warn("Transform at time not supported")
            }.bind(S) : function (L) {
            }.bind(S), S.setGroupProperty = expressionHelpers.setGroupProperty, S
        };
        var h = PropertyFactory.getProp;
        PropertyFactory.getProp = function (k, U, W, S, L) {
            var M = h(k, U, W, S, L);
            M.getValueAtTime = M.kf ? expressionHelpers.getValueAtTime.bind(M) : expressionHelpers.getStaticValueAtTime.bind(M), M.setGroupProperty = expressionHelpers.setGroupProperty, M.loopOut = e, M.loopIn = r, M.smooth = a, M.getVelocityAtTime = expressionHelpers.getVelocityAtTime.bind(M), M.getSpeedAtTime = expressionHelpers.getSpeedAtTime.bind(M), M.numKeys = 1 === U.a ? U.k.length : 0, M.propertyIndex = U.ix;
            var v = 0;
            return 0 !== W && (v = createTypedArray("float32", 1 === U.a ? U.k[0].s.length : U.k.length)), M._cachingAtTime = {
                lastFrame: initialDefaultFrame,
                lastIndex: 0,
                value: v
            }, expressionHelpers.searchExpressions(k, U, M), M.k && L.addDynamicProperty(M), M
        };
        var n = ShapePropertyFactory.getConstructorFunction(),
            m = ShapePropertyFactory.getKeyframedConstructorFunction();

        function T() {
        }

        T.prototype = {
            vertices: function (k, U) {
                this.k && this.getValue();
                var W = this.v;
                void 0 !== U && (W = this.getValueAtTime(U, 0));
                var S, L = W._length, M = W[k], v = W.v, g = createSizedArray(L);
                for (S = 0; S < L; S += 1) g[S] = "i" === k || "o" === k ? [M[S][0] - v[S][0], M[S][1] - v[S][1]] : [M[S][0], M[S][1]];
                return g
            },
            points: function (k) {
                return this.vertices("v", k)
            },
            inTangents: function (k) {
                return this.vertices("i", k)
            },
            outTangents: function (k) {
                return this.vertices("o", k)
            },
            isClosed: function () {
                return this.v.c
            },
            pointOnPath: function (k, U) {
                var W = this.v;
                void 0 !== U && (W = this.getValueAtTime(U, 0)), this._segmentsLength || (this._segmentsLength = bez.getSegmentsLength(W));
                for (var S, L = this._segmentsLength, M = L.lengths, v = L.totalLength * k, g = 0, x = M.length, Q = 0; g < x;) {
                    if (Q + M[g].addedLength > v) {
                        var s0 = W.c && g === x - 1 ? 0 : g + 1;
                        S = bez.getPointInSegment(W.v[g], W.v[s0], W.o[g], W.i[s0], (v - Q) / M[g].addedLength, M[g]);
                        break
                    }
                    Q += M[g].addedLength, g += 1
                }
                return S || (S = W.c ? [W.v[0][0], W.v[0][1]] : [W.v[W._length - 1][0], W.v[W._length - 1][1]]), S
            },
            vectorOnPath: function (k, U, W) {
                var S = this.pointOnPath(k = 1 == k ? this.v.c ? 0 : .999 : k, U), L = this.pointOnPath(k + .001, U),
                    M = L[0] - S[0], v = L[1] - S[1], g = Math.sqrt(Math.pow(M, 2) + Math.pow(v, 2));
                return 0 === g ? [0, 0] : "tangent" === W ? [M / g, v / g] : [-v / g, M / g]
            },
            tangentOnPath: function (k, U) {
                return this.vectorOnPath(k, U, "tangent")
            },
            normalOnPath: function (k, U) {
                return this.vectorOnPath(k, U, "normal")
            },
            setGroupProperty: expressionHelpers.setGroupProperty,
            getValueAtTime: expressionHelpers.getStaticValueAtTime
        }, extendPrototype([T], n), extendPrototype([T], m), m.prototype.getValueAtTime = function (k) {
            return this._cachingAtTime || (this._cachingAtTime = {
                shapeValue: shape_pool.clone(this.pv),
                lastIndex: 0,
                lastTime: initialDefaultFrame
            }), k *= this.elem.globalData.frameRate, (k -= this.offsetTime) !== this._cachingAtTime.lastTime && (this._cachingAtTime.lastIndex = this._cachingAtTime.lastTime < k ? this._caching.lastIndex : 0, this._cachingAtTime.lastTime = k, this.interpolateShape(k, this._cachingAtTime.shapeValue, this._cachingAtTime)), this._cachingAtTime.shapeValue
        }, m.prototype.initiateExpression = ExpressionManager.initiateExpression;
        var R = ShapePropertyFactory.getShapeProp;
        ShapePropertyFactory.getShapeProp = function (k, U, W, S, L) {
            var M = R(k, U, W, S, L);
            return M.propertyIndex = U.ix, M.lock = !1, 3 === W ? expressionHelpers.searchExpressions(k, U.pt, M) : 4 === W && expressionHelpers.searchExpressions(k, U.ks, M), M.k && k.addDynamicProperty(M), M
        }
    })(), TextProperty.prototype.getExpressionValue = function (e, r) {
        var a = this.calculateExpression(r);
        if (e.t === a) return e;
        var s = {};
        return this.copyData(s, e), s.t = a.toString(), s.__complete = !1, s
    }, TextProperty.prototype.searchProperty = function () {
        var e = this.searchKeyframes(), r = this.searchExpressions();
        return this.kf = e || r, this.kf
    }, TextProperty.prototype.searchExpressions = function () {
        if (this.data.d.x) return this.calculateExpression = ExpressionManager.initiateExpression.bind(this)(this.elem, this.data.d, this), this.addEffect(this.getExpressionValue.bind(this)), !0
    };
    var ShapeExpressionInterface = function () {
        function e(W, S, L) {
            var M, v = [], g = W ? W.length : 0;
            for (M = 0; M < g; M += 1) "gr" == W[M].ty ? v.push(r(W[M], S[M], L)) : "fl" == W[M].ty ? v.push(a(W[M], S[M], L)) : "st" == W[M].ty ? v.push(s(W[M], S[M], L)) : "tm" == W[M].ty ? v.push(h(W[M], S[M], L)) : "tr" == W[M].ty || ("el" == W[M].ty ? v.push(n(W[M], S[M], L)) : "sr" == W[M].ty ? v.push(m(W[M], S[M], L)) : "sh" == W[M].ty ? v.push(U(W[M], S[M], L)) : "rc" == W[M].ty ? v.push(T(W[M], S[M], L)) : "rd" == W[M].ty ? v.push(R(W[M], S[M], L)) : "rp" == W[M].ty && v.push(k(W[M], S[M], L)));
            return v
        }

        function r(W, S, L) {
            var M = function (a0) {
                switch (a0) {
                    case"ADBE Vectors Group":
                    case"Contents":
                    case 2:
                        return M.content;
                    default:
                        return M.transform
                }
            };
            M.propertyGroup = function (a0) {
                return 1 === a0 ? M : L(a0 - 1)
            };
            var v, g, x, Q, t0, s0 = (v = W, g = S, x = M.propertyGroup, (t0 = function (a0) {
                    for (var d0 = 0, A0 = Q.length; d0 < A0;) {
                        if (Q[d0]._name === a0 || Q[d0].mn === a0 || Q[d0].propertyIndex === a0 || Q[d0].ix === a0 || Q[d0].ind === a0) return Q[d0];
                        d0 += 1
                    }
                    if ("number" == typeof a0) return Q[a0 - 1]
                }).propertyGroup = function (a0) {
                    return 1 === a0 ? t0 : x(a0 - 1)
                }, Q = e(v.it, g.it, t0.propertyGroup), t0.numProperties = Q.length, t0.propertyIndex = v.cix, t0._name = v.nm, t0),
                M0 = function (a0, d0, A0) {
                    function E0(b0) {
                        return 1 == b0 ? k0 : A0(--b0)
                    }

                    function k0(b0) {
                        return a0.a.ix === b0 || "Anchor Point" === b0 ? k0.anchorPoint : a0.o.ix === b0 || "Opacity" === b0 ? k0.opacity : a0.p.ix === b0 || "Position" === b0 ? k0.position : a0.r.ix === b0 || "Rotation" === b0 || "ADBE Vector Rotation" === b0 ? k0.rotation : a0.s.ix === b0 || "Scale" === b0 ? k0.scale : a0.sk && a0.sk.ix === b0 || "Skew" === b0 ? k0.skew : a0.sa && a0.sa.ix === b0 || "Skew Axis" === b0 ? k0.skewAxis : void 0
                    }

                    return d0.transform.mProps.o.setGroupProperty(E0), d0.transform.mProps.p.setGroupProperty(E0), d0.transform.mProps.a.setGroupProperty(E0), d0.transform.mProps.s.setGroupProperty(E0), d0.transform.mProps.r.setGroupProperty(E0), d0.transform.mProps.sk && (d0.transform.mProps.sk.setGroupProperty(E0), d0.transform.mProps.sa.setGroupProperty(E0)), d0.transform.op.setGroupProperty(E0), Object.defineProperties(k0, {
                        opacity: {get: ExpressionPropertyInterface(d0.transform.mProps.o)},
                        position: {get: ExpressionPropertyInterface(d0.transform.mProps.p)},
                        anchorPoint: {get: ExpressionPropertyInterface(d0.transform.mProps.a)},
                        scale: {get: ExpressionPropertyInterface(d0.transform.mProps.s)},
                        rotation: {get: ExpressionPropertyInterface(d0.transform.mProps.r)},
                        skew: {get: ExpressionPropertyInterface(d0.transform.mProps.sk)},
                        skewAxis: {get: ExpressionPropertyInterface(d0.transform.mProps.sa)},
                        _name: {value: a0.nm}
                    }), k0.ty = "tr", k0.mn = a0.mn, k0.propertyGroup = A0, k0
                }(W.it[W.it.length - 1], S.it[S.it.length - 1], M.propertyGroup);
            return M.content = s0, M.transform = M0, Object.defineProperty(M, "_name", {
                get: function () {
                    return W.nm
                }
            }), M.numProperties = W.np, M.propertyIndex = W.ix, M.nm = W.nm, M.mn = W.mn, M
        }

        function a(W, S, L) {
            function M(v) {
                return "Color" === v || "color" === v ? M.color : "Opacity" === v || "opacity" === v ? M.opacity : void 0
            }

            return Object.defineProperties(M, {
                color: {get: ExpressionPropertyInterface(S.c)},
                opacity: {get: ExpressionPropertyInterface(S.o)},
                _name: {value: W.nm},
                mn: {value: W.mn}
            }), S.c.setGroupProperty(L), S.o.setGroupProperty(L), M
        }

        function s(W, S, L) {
            function M(M0) {
                return 1 === M0 ? ob : L(M0 - 1)
            }

            function v(M0) {
                return 1 === M0 ? t0 : M(M0 - 1)
            }

            var g, x, Q = W.d ? W.d.length : 0, t0 = {};
            for (g = 0; g < Q; g += 1) x = g, Object.defineProperty(t0, W.d[x].nm, {get: ExpressionPropertyInterface(S.d.dataProps[x].p)}), S.d.dataProps[g].p.setGroupProperty(v);

            function s0(M0) {
                return "Color" === M0 || "color" === M0 ? s0.color : "Opacity" === M0 || "opacity" === M0 ? s0.opacity : "Stroke Width" === M0 || "stroke width" === M0 ? s0.strokeWidth : void 0
            }

            return Object.defineProperties(s0, {
                color: {get: ExpressionPropertyInterface(S.c)},
                opacity: {get: ExpressionPropertyInterface(S.o)},
                strokeWidth: {get: ExpressionPropertyInterface(S.w)},
                dash: {
                    get: function () {
                        return t0
                    }
                },
                _name: {value: W.nm},
                mn: {value: W.mn}
            }), S.c.setGroupProperty(M), S.o.setGroupProperty(M), S.w.setGroupProperty(M), s0
        }

        function h(W, S, L) {
            function M(g) {
                return 1 == g ? v : L(--g)
            }

            function v(g) {
                return g === W.e.ix || "End" === g || "end" === g ? v.end : g === W.s.ix ? v.start : g === W.o.ix ? v.offset : void 0
            }

            return v.propertyIndex = W.ix, S.s.setGroupProperty(M), S.e.setGroupProperty(M), S.o.setGroupProperty(M), v.propertyIndex = W.ix, v.propertyGroup = L, Object.defineProperties(v, {
                start: {get: ExpressionPropertyInterface(S.s)},
                end: {get: ExpressionPropertyInterface(S.e)},
                offset: {get: ExpressionPropertyInterface(S.o)},
                _name: {value: W.nm}
            }), v.mn = W.mn, v
        }

        function n(W, S, L) {
            function M(x) {
                return 1 == x ? g : L(--x)
            }

            g.propertyIndex = W.ix;
            var v = "tm" === S.sh.ty ? S.sh.prop : S.sh;

            function g(x) {
                return W.p.ix === x ? g.position : W.s.ix === x ? g.size : void 0
            }

            return v.s.setGroupProperty(M), v.p.setGroupProperty(M), Object.defineProperties(g, {
                size: {get: ExpressionPropertyInterface(v.s)},
                position: {get: ExpressionPropertyInterface(v.p)},
                _name: {value: W.nm}
            }), g.mn = W.mn, g
        }

        function m(W, S, L) {
            function M(x) {
                return 1 == x ? g : L(--x)
            }

            var v = "tm" === S.sh.ty ? S.sh.prop : S.sh;

            function g(x) {
                return W.p.ix === x ? g.position : W.r.ix === x ? g.rotation : W.pt.ix === x ? g.points : W.or.ix === x || "ADBE Vector Star Outer Radius" === x ? g.outerRadius : W.os.ix === x ? g.outerRoundness : !W.ir || W.ir.ix !== x && "ADBE Vector Star Inner Radius" !== x ? W.is && W.is.ix === x ? g.innerRoundness : void 0 : g.innerRadius
            }

            return g.propertyIndex = W.ix, v.or.setGroupProperty(M), v.os.setGroupProperty(M), v.pt.setGroupProperty(M), v.p.setGroupProperty(M), v.r.setGroupProperty(M), W.ir && (v.ir.setGroupProperty(M), v.is.setGroupProperty(M)), Object.defineProperties(g, {
                position: {get: ExpressionPropertyInterface(v.p)},
                rotation: {get: ExpressionPropertyInterface(v.r)},
                points: {get: ExpressionPropertyInterface(v.pt)},
                outerRadius: {get: ExpressionPropertyInterface(v.or)},
                outerRoundness: {get: ExpressionPropertyInterface(v.os)},
                innerRadius: {get: ExpressionPropertyInterface(v.ir)},
                innerRoundness: {get: ExpressionPropertyInterface(v.is)},
                _name: {value: W.nm}
            }), g.mn = W.mn, g
        }

        function T(W, S, L) {
            function M(x) {
                return 1 == x ? g : L(--x)
            }

            var v = "tm" === S.sh.ty ? S.sh.prop : S.sh;

            function g(x) {
                return W.p.ix === x ? g.position : W.r.ix === x ? g.roundness : W.s.ix === x || "Size" === x || "ADBE Vector Rect Size" === x ? g.size : void 0
            }

            return g.propertyIndex = W.ix, v.p.setGroupProperty(M), v.s.setGroupProperty(M), v.r.setGroupProperty(M), Object.defineProperties(g, {
                position: {get: ExpressionPropertyInterface(v.p)},
                roundness: {get: ExpressionPropertyInterface(v.r)},
                size: {get: ExpressionPropertyInterface(v.s)},
                _name: {value: W.nm}
            }), g.mn = W.mn, g
        }

        function R(W, S, L) {
            var M = S;

            function v(g) {
                if (W.r.ix === g || "Round Corners 1" === g) return v.radius
            }

            return v.propertyIndex = W.ix, M.rd.setGroupProperty(function (g) {
                return 1 == g ? v : L(--g)
            }), Object.defineProperties(v, {
                radius: {get: ExpressionPropertyInterface(M.rd)},
                _name: {value: W.nm}
            }), v.mn = W.mn, v
        }

        function k(W, S, L) {
            function M(x) {
                return 1 == x ? g : L(--x)
            }

            var v = S;

            function g(x) {
                return W.c.ix === x || "Copies" === x ? g.copies : W.o.ix === x || "Offset" === x ? g.offset : void 0
            }

            return g.propertyIndex = W.ix, v.c.setGroupProperty(M), v.o.setGroupProperty(M), Object.defineProperties(g, {
                copies: {get: ExpressionPropertyInterface(v.c)},
                offset: {get: ExpressionPropertyInterface(v.o)},
                _name: {value: W.nm}
            }), g.mn = W.mn, g
        }

        function U(W, S, L) {
            var M = S.sh;

            function v(g) {
                if ("Shape" === g || "shape" === g || "Path" === g || "path" === g || "ADBE Vector Shape" === g || 2 === g) return v.path
            }

            return M.setGroupProperty(function (g) {
                return 1 == g ? v : L(--g)
            }), Object.defineProperties(v, {
                path: {
                    get: function () {
                        return M.k && M.getValue(), M
                    }
                }, shape: {
                    get: function () {
                        return M.k && M.getValue(), M
                    }
                }, _name: {value: W.nm}, ix: {value: W.ix}, propertyIndex: {value: W.ix}, mn: {value: W.mn}
            }), v
        }

        return function (W, S, L) {
            var M;

            function v(g) {
                if ("number" == typeof g) return M[g - 1];
                for (var x = 0, Q = M.length; x < Q;) {
                    if (M[x]._name === g) return M[x];
                    x += 1
                }
            }

            return v.propertyGroup = L, M = e(W, S, v), v.numProperties = M.length, v
        }
    }(), TextExpressionInterface = function (e) {
        var r;

        function a() {
        }

        return Object.defineProperty(a, "sourceText", {
            get: function () {
                e.textProperty.getValue();
                var s = e.textProperty.currentData.t;
                return void 0 !== s && (e.textProperty.currentData.t = void 0, (r = new String(s)).value = s || new String(s)), r
            }
        }), a
    }, LayerExpressionInterface = function () {
        function e(h, n) {
            var m = new Matrix;
            if (m.reset(), this._elem.finalTransform.mProp.applyToMatrix(m), this._elem.hierarchy && this._elem.hierarchy.length) {
                var T, R = this._elem.hierarchy.length;
                for (T = 0; T < R; T += 1) this._elem.hierarchy[T].finalTransform.mProp.applyToMatrix(m);
                return m.applyToPointArray(h[0], h[1], h[2] || 0)
            }
            return m.applyToPointArray(h[0], h[1], h[2] || 0)
        }

        function r(h, n) {
            var m = new Matrix;
            if (m.reset(), this._elem.finalTransform.mProp.applyToMatrix(m), this._elem.hierarchy && this._elem.hierarchy.length) {
                var T, R = this._elem.hierarchy.length;
                for (T = 0; T < R; T += 1) this._elem.hierarchy[T].finalTransform.mProp.applyToMatrix(m);
                return m.inversePoint(h)
            }
            return m.inversePoint(h)
        }

        function a(h) {
            var n = new Matrix;
            if (n.reset(), this._elem.finalTransform.mProp.applyToMatrix(n), this._elem.hierarchy && this._elem.hierarchy.length) {
                var m, T = this._elem.hierarchy.length;
                for (m = 0; m < T; m += 1) this._elem.hierarchy[m].finalTransform.mProp.applyToMatrix(n);
                return n.inversePoint(h)
            }
            return n.inversePoint(h)
        }

        function s() {
            return [1, 1, 1, 1]
        }

        return function (h) {
            var n;

            function m(R) {
                switch (R) {
                    case"ADBE Root Vectors Group":
                    case"Contents":
                    case 2:
                        return m.shapeInterface;
                    case 1:
                    case 6:
                    case"Transform":
                    case"transform":
                    case"ADBE Transform Group":
                        return n;
                    case 4:
                    case"ADBE Effect Parade":
                    case"effects":
                    case"Effects":
                        return m.effect
                }
            }

            m.toWorld = e, m.fromWorld = r, m.toComp = e, m.fromComp = a, m.sampleImage = s, m.sourceRectAtTime = h.sourceRectAtTime.bind(h);
            var T = getDescriptor(n = TransformExpressionInterface((m._elem = h).finalTransform.mProp), "anchorPoint");
            return Object.defineProperties(m, {
                hasParent: {
                    get: function () {
                        return h.hierarchy.length
                    }
                },
                parent: {
                    get: function () {
                        return h.hierarchy[0].layerInterface
                    }
                },
                rotation: getDescriptor(n, "rotation"),
                scale: getDescriptor(n, "scale"),
                position: getDescriptor(n, "position"),
                opacity: getDescriptor(n, "opacity"),
                anchorPoint: T,
                anchor_point: T,
                transform: {
                    get: function () {
                        return n
                    }
                },
                active: {
                    get: function () {
                        return h.isInRange
                    }
                }
            }), m.startTime = h.data.st, m.index = h.data.ind, m.source = h.data.refId, m.height = 0 === h.data.ty ? h.data.h : 100, m.width = 0 === h.data.ty ? h.data.w : 100, m.inPoint = h.data.ip / h.comp.globalData.frameRate, m.outPoint = h.data.op / h.comp.globalData.frameRate, m._name = h.data.nm, m.registerMaskInterface = function (R) {
                m.mask = new MaskManagerInterface(R, h)
            }, m.registerEffectsInterface = function (R) {
                m.effect = R
            }, m
        }
    }(), CompExpressionInterface = function (e) {
        function r(a) {
            for (var s = 0, h = e.layers.length; s < h;) {
                if (e.layers[s].nm === a || e.layers[s].ind === a) return e.elements[s].layerInterface;
                s += 1
            }
            return null
        }

        return Object.defineProperty(r, "_name", {value: e.data.nm}), (r.layer = r).pixelAspect = 1, r.height = e.data.h || e.globalData.compSize.h, r.width = e.data.w || e.globalData.compSize.w, r.pixelAspect = 1, r.frameDuration = 1 / e.globalData.frameRate, r.displayStartTime = 0, r.numLayers = e.layers.length, r
    }, TransformExpressionInterface = function (e) {
        function r(s) {
            switch (s) {
                case"scale":
                case"Scale":
                case"ADBE Scale":
                case 6:
                    return r.scale;
                case"rotation":
                case"Rotation":
                case"ADBE Rotation":
                case"ADBE Rotate Z":
                case 10:
                    return r.rotation;
                case"ADBE Rotate X":
                    return r.xRotation;
                case"ADBE Rotate Y":
                    return r.yRotation;
                case"position":
                case"Position":
                case"ADBE Position":
                case 2:
                    return r.position;
                case"ADBE Position_0":
                    return r.xPosition;
                case"ADBE Position_1":
                    return r.yPosition;
                case"ADBE Position_2":
                    return r.zPosition;
                case"anchorPoint":
                case"AnchorPoint":
                case"Anchor Point":
                case"ADBE AnchorPoint":
                case 1:
                    return r.anchorPoint;
                case"opacity":
                case"Opacity":
                case 11:
                    return r.opacity
            }
        }

        if (Object.defineProperty(r, "rotation", {get: ExpressionPropertyInterface(e.r || e.rz)}), Object.defineProperty(r, "zRotation", {get: ExpressionPropertyInterface(e.rz || e.r)}), Object.defineProperty(r, "xRotation", {get: ExpressionPropertyInterface(e.rx)}), Object.defineProperty(r, "yRotation", {get: ExpressionPropertyInterface(e.ry)}), Object.defineProperty(r, "scale", {get: ExpressionPropertyInterface(e.s)}), e.p) var a = ExpressionPropertyInterface(e.p);
        return Object.defineProperty(r, "position", {
            get: function () {
                return e.p ? a() : [e.px.v, e.py.v, e.pz ? e.pz.v : 0]
            }
        }), Object.defineProperty(r, "xPosition", {get: ExpressionPropertyInterface(e.px)}), Object.defineProperty(r, "yPosition", {get: ExpressionPropertyInterface(e.py)}), Object.defineProperty(r, "zPosition", {get: ExpressionPropertyInterface(e.pz)}), Object.defineProperty(r, "anchorPoint", {get: ExpressionPropertyInterface(e.a)}), Object.defineProperty(r, "opacity", {get: ExpressionPropertyInterface(e.o)}), Object.defineProperty(r, "skew", {get: ExpressionPropertyInterface(e.sk)}), Object.defineProperty(r, "skewAxis", {get: ExpressionPropertyInterface(e.sa)}), Object.defineProperty(r, "orientation", {get: ExpressionPropertyInterface(e.or)}), r
    }, ProjectInterface = function () {
        function e(r) {
            this.compositions.push(r)
        }

        return function () {
            function r(a) {
                for (var s = 0, h = this.compositions.length; s < h;) {
                    if (this.compositions[s].data && this.compositions[s].data.nm === a) return this.compositions[s].prepareFrame && this.compositions[s].data.xt && this.compositions[s].prepareFrame(this.currentFrame), this.compositions[s].compInterface;
                    s += 1
                }
            }

            return r.compositions = [], r.currentFrame = 0, r.registerComposition = e, r
        }
    }(), EffectsExpressionInterface = function () {
        function e(a, s, h, n) {
            var m, T = [], R = a.ef.length;
            for (m = 0; m < R; m += 1) T.push(5 === a.ef[m].ty ? e(a.ef[m], s.effectElements[m], s.effectElements[m].propertyGroup, n) : r(s.effectElements[m], a.ef[m].ty, n, k));

            function k(W) {
                return 1 === W ? U : h(W - 1)
            }

            var U = function (W) {
                for (var S = a.ef, L = 0, M = S.length; L < M;) {
                    if (W === S[L].nm || W === S[L].mn || W === S[L].ix) return 5 === S[L].ty ? T[L] : T[L]();
                    L += 1
                }
                return T[0]()
            };
            return U.propertyGroup = k, "ADBE Color Control" === a.mn && Object.defineProperty(U, "color", {
                get: function () {
                    return T[0]()
                }
            }), Object.defineProperty(U, "numProperties", {
                get: function () {
                    return a.np
                }
            }), U.active = U.enabled = 0 !== a.en, U
        }

        function r(a, s, h, n) {
            var m = ExpressionPropertyInterface(a.p);
            return a.p.setGroupProperty && a.p.setGroupProperty(n), function () {
                return 10 === s ? h.comp.compInterface(a.p.v) : m()
            }
        }

        return {
            createEffectsInterface: function (a, s) {
                if (a.effectsManager) {
                    var h, n = [], m = a.data.ef, T = a.effectsManager.effectElements.length;
                    for (h = 0; h < T; h += 1) n.push(e(m[h], a.effectsManager.effectElements[h], s, a));
                    return function (R) {
                        for (var k = a.data.ef || [], U = 0, W = k.length; U < W;) {
                            if (R === k[U].nm || R === k[U].mn || R === k[U].ix) return n[U];
                            U += 1
                        }
                    }
                }
            }
        }
    }(), MaskManagerInterface = function () {
        function e(r, a) {
            this._mask = r, this._data = a
        }

        return Object.defineProperty(e.prototype, "maskPath", {
            get: function () {
                return this._mask.prop.k && this._mask.prop.getValue(), this._mask.prop
            }
        }), Object.defineProperty(e.prototype, "maskOpacity", {
            get: function () {
                return this._mask.op.k && this._mask.op.getValue(), 100 * this._mask.op.v
            }
        }), function (r, a) {
            var s, h = createSizedArray(r.viewData.length), n = r.viewData.length;
            for (s = 0; s < n; s += 1) h[s] = new e(r.viewData[s], r.masksProperties[s]);
            return function (m) {
                for (s = 0; s < n;) {
                    if (r.masksProperties[s].nm === m) return h[s];
                    s += 1
                }
            }
        }
    }(), ExpressionPropertyInterface = function () {
        var e = {pv: 0, v: 0, mult: 1}, r = {pv: [0, 0, 0], v: [0, 0, 0], mult: 1};

        function a(h, n, m) {
            Object.defineProperty(h, "velocity", {
                get: function () {
                    return n.getVelocityAtTime(n.comp.currentFrame)
                }
            }), h.numKeys = n.keyframes ? n.keyframes.length : 0, h.key = function (T) {
                if (h.numKeys) {
                    var R;
                    R = "s" in n.keyframes[T - 1] ? n.keyframes[T - 1].s : "e" in n.keyframes[T - 2] ? n.keyframes[T - 2].e : n.keyframes[T - 2].s;
                    var k = "unidimensional" === m ? new Number(R) : Object.assign({}, R);
                    return k.time = n.keyframes[T - 1].t / n.elem.comp.globalData.frameRate, k
                }
                return 0
            }, h.valueAtTime = n.getValueAtTime, h.speedAtTime = n.getSpeedAtTime, h.velocityAtTime = n.getVelocityAtTime, h.propertyGroup = n.propertyGroup
        }

        function s() {
            return e
        }

        return function (h) {
            return h ? "unidimensional" === h.propType ? function (n) {
                n && "pv" in n || (n = e);
                var m = 1 / n.mult, T = n.pv * m, R = new Number(T);
                return R.value = T, a(R, n, "unidimensional"), function () {
                    return n.k && n.getValue(), R.value !== (T = n.v * m) && ((R = new Number(T)).value = T, a(R, n, "unidimensional")), R
                }
            }(h) : function (n) {
                n && "pv" in n || (n = r);
                var m = 1 / n.mult, T = n.pv.length, R = createTypedArray("float32", T),
                    k = createTypedArray("float32", T);
                return R.value = k, a(R, n, "multidimensional"), function () {
                    n.k && n.getValue();
                    for (var U = 0; U < T; U += 1) R[U] = k[U] = n.v[U] * m;
                    return R
                }
            }(h) : s
        }
    }(), q5, r5;

    function SliderEffect(e, r, a) {
        this.p = PropertyFactory.getProp(r, e.v, 0, 0, a)
    }

    function AngleEffect(e, r, a) {
        this.p = PropertyFactory.getProp(r, e.v, 0, 0, a)
    }

    function ColorEffect(e, r, a) {
        this.p = PropertyFactory.getProp(r, e.v, 1, 0, a)
    }

    function PointEffect(e, r, a) {
        this.p = PropertyFactory.getProp(r, e.v, 1, 0, a)
    }

    function LayerIndexEffect(e, r, a) {
        this.p = PropertyFactory.getProp(r, e.v, 0, 0, a)
    }

    function MaskIndexEffect(e, r, a) {
        this.p = PropertyFactory.getProp(r, e.v, 0, 0, a)
    }

    function CheckboxEffect(e, r, a) {
        this.p = PropertyFactory.getProp(r, e.v, 0, 0, a)
    }

    function NoValueEffect() {
        this.p = {}
    }

    function EffectsManager(e, r) {
        var a = e.ef || [];
        this.effectElements = [];
        var s, h, n = a.length;
        for (s = 0; s < n; s++) h = new GroupEffect(a[s], r), this.effectElements.push(h)
    }

    function GroupEffect(e, r) {
        this.init(e, r)
    }

    q5 = function () {
        function e(r, a) {
            return this.textIndex = r + 1, this.textTotal = a, this.v = this.getValue() * this.mult, this.v
        }

        return function (r, a) {
            this.pv = 1, this.comp = r.comp, this.elem = r, this.mult = .01, this.propType = "textSelector", this.textTotal = a.totalChars, this.selectorValue = 100, this.lastValue = [1, 1, 1], this.k = !0, this.x = !0, this.getValue = ExpressionManager.initiateExpression.bind(this)(r, a, this), this.getMult = e, this.getVelocityAtTime = expressionHelpers.getVelocityAtTime, this.getValueAtTime = this.kf ? expressionHelpers.getValueAtTime.bind(this) : expressionHelpers.getStaticValueAtTime.bind(this), this.setGroupProperty = expressionHelpers.setGroupProperty
        }
    }(), r5 = TextSelectorProp.getTextSelectorProp, TextSelectorProp.getTextSelectorProp = function (e, r, a) {
        return 1 === r.t ? new q5(e, r, a) : r5(e, r, a)
    }, extendPrototype([DynamicPropertyContainer], GroupEffect), GroupEffect.prototype.getValue = GroupEffect.prototype.iterateDynamicProperties, GroupEffect.prototype.init = function (e, r) {
        this.data = e, this.effectElements = [], this.initDynamicPropertyContainer(r);
        var a, s, h = this.data.ef.length, n = this.data.ef;
        for (a = 0; a < h; a += 1) {
            switch (s = null, n[a].ty) {
                case 0:
                    s = new SliderEffect(n[a], r, this);
                    break;
                case 1:
                    s = new AngleEffect(n[a], r, this);
                    break;
                case 2:
                    s = new ColorEffect(n[a], r, this);
                    break;
                case 3:
                    s = new PointEffect(n[a], r, this);
                    break;
                case 4:
                case 7:
                    s = new CheckboxEffect(n[a], r, this);
                    break;
                case 10:
                    s = new LayerIndexEffect(n[a], r, this);
                    break;
                case 11:
                    s = new MaskIndexEffect(n[a], r, this);
                    break;
                case 5:
                    s = new EffectsManager(n[a], r, this);
                    break;
                default:
                    s = new NoValueEffect(n[a], r, this)
            }
            s && this.effectElements.push(s)
        }
    };
    var lottie = {}, _isFrozen = !1;

    function setLocationHref(e) {
        locationHref = e
    }

    function searchAnimations() {
        !0 === standalone ? animationManager.searchAnimations(animationData, standalone, renderer) : animationManager.searchAnimations()
    }

    function setSubframeRendering(e) {
        subframeEnabled = e
    }

    function loadAnimation(e) {
        return !0 === standalone && (e.animationData = JSON.parse(animationData)), animationManager.loadAnimation(e)
    }

    function setQuality(e) {
        if ("string" == typeof e) switch (e) {
            case"high":
                defaultCurveSegments = 200;
                break;
            case"medium":
                defaultCurveSegments = 50;
                break;
            case"low":
                defaultCurveSegments = 10
        } else !isNaN(e) && 1 < e && (defaultCurveSegments = e);
        roundValues(!(50 <= defaultCurveSegments))
    }

    function inBrowser() {
        return typeof navigator < "u"
    }

    function installPlugin(e, r) {
        "expressions" === e && (expressionsPlugin = r)
    }

    function getFactory(e) {
        switch (e) {
            case"propertyFactory":
                return PropertyFactory;
            case"shapePropertyFactory":
                return ShapePropertyFactory;
            case"matrix":
                return Matrix
        }
    }

    function checkReady() {
        "complete" === document.readyState && (clearInterval(readyStateCheckInterval), searchAnimations())
    }

    function getQueryVariable(e) {
        for (var r = queryString.split("&"), a = 0; a < r.length; a++) {
            var s = r[a].split("=");
            if (decodeURIComponent(s[0]) == e) return decodeURIComponent(s[1])
        }
    }

    lottie.play = animationManager.play, lottie.pause = animationManager.pause, lottie.setLocationHref = setLocationHref, lottie.togglePause = animationManager.togglePause, lottie.setSpeed = animationManager.setSpeed, lottie.setDirection = animationManager.setDirection, lottie.stop = animationManager.stop, lottie.searchAnimations = searchAnimations, lottie.registerAnimation = animationManager.registerAnimation, lottie.loadAnimation = loadAnimation, lottie.setSubframeRendering = setSubframeRendering, lottie.resize = animationManager.resize, lottie.goToAndStop = animationManager.goToAndStop, lottie.destroy = animationManager.destroy, lottie.setQuality = setQuality, lottie.inBrowser = inBrowser, lottie.installPlugin = installPlugin, lottie.freeze = animationManager.freeze, lottie.unfreeze = animationManager.unfreeze, lottie.getRegisteredAnimations = animationManager.getRegisteredAnimations, lottie.__getFactory = getFactory, lottie.version = "5.6.5";
    var standalone = "__[STANDALONE]__", animationData = "__[ANIMATIONDATA]__", renderer = "";
    if (standalone) {
        var scripts = document.getElementsByTagName("script"), index = scripts.length - 1,
            myScript = scripts[index] || {src: ""}, queryString = myScript.src.replace(/^[^\?]+\??/, "");
        renderer = getQueryVariable("renderer")
    }
    var readyStateCheckInterval = setInterval(checkReady, 100);
    return lottie
}), Module || (Module = (typeof Module < "u" ? Module : null) || {});
var moduleOverrides = {};
for (var key in Module) Module.hasOwnProperty(key) && (moduleOverrides[key] = Module[key]);
var ENVIRONMENT_IS_WEB = !1, ENVIRONMENT_IS_WORKER = !1, ENVIRONMENT_IS_NODE = !1, ENVIRONMENT_IS_SHELL = !1, nodeFS,
    nodePath;
if (Module.ENVIRONMENT) if ("WEB" === Module.ENVIRONMENT) ENVIRONMENT_IS_WEB = !0; else if ("WORKER" === Module.ENVIRONMENT) ENVIRONMENT_IS_WORKER = !0; else if ("NODE" === Module.ENVIRONMENT) ENVIRONMENT_IS_NODE = !0; else {
    if ("SHELL" !== Module.ENVIRONMENT) throw new Error("The provided Module['ENVIRONMENT'] value is not valid. It must be one of: WEB|WORKER|NODE|SHELL.");
    ENVIRONMENT_IS_SHELL = !0
} else ENVIRONMENT_IS_WEB = "object" == typeof window, ENVIRONMENT_IS_WORKER = "function" == typeof importScripts, ENVIRONMENT_IS_NODE = "object" == typeof process && "function" == typeof require && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER, ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
if (ENVIRONMENT_IS_NODE) Module.print || (Module.print = console.log), Module.printErr || (Module.printErr = console.warn), Module.read = function (r, a) {
    nodeFS || (nodeFS = require("fs")), console.log(nodeFS), nodePath || (nodePath = require("path")), r = nodePath.normalize(r);
    var s = nodeFS.readFileSync(r);
    return a ? s : s.toString()
}, Module.readBinary = function (r) {
    var a = Module.read(r, !0);
    return a.buffer || (a = new Uint8Array(a)), assert(a.buffer), a
}, Module.load = function (r) {
    globalEval(read(r))
}, Module.thisProgram || (Module.thisProgram = process.argv.length > 1 ? process.argv[1].replace(/\\/g, "/") : "unknown-program"), Module.arguments = process.argv.slice(2), typeof module < "u" && (module.exports = Module), process.on("uncaughtException", function (e) {
    if (!(e instanceof ExitStatus)) throw e
}), Module.inspect = function () {
    return "[Emscripten Module object]"
}; else if (ENVIRONMENT_IS_SHELL) Module.print || (Module.print = print), typeof printErr < "u" && (Module.printErr = printErr), Module.read = typeof read < "u" ? read : function () {
    throw "no read() available"
}, Module.readBinary = function (r) {
    if ("function" == typeof readbuffer) return new Uint8Array(readbuffer(r));
    var a = read(r, "binary");
    return assert("object" == typeof a), a
}, typeof scriptArgs < "u" ? Module.arguments = scriptArgs : typeof arguments < "u" && (Module.arguments = arguments), "function" == typeof quit && (Module.quit = function (e, r) {
    quit(e)
}); else {
    if (!ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER) throw "Unknown runtime environment. Where are we?";
    if (Module.read = function (r) {
        var a = new XMLHttpRequest;
        return a.open("GET", r, !1), a.send(null), a.responseText
    }, ENVIRONMENT_IS_WORKER && (Module.readBinary = function (r) {
        var a = new XMLHttpRequest;
        return a.open("GET", r, !1), a.responseType = "arraybuffer", a.send(null), new Uint8Array(a.response)
    }), Module.readAsync = function (r, a, s) {
        var h = new XMLHttpRequest;
        h.open("GET", r, !0), h.responseType = "arraybuffer", h.onload = function () {
            200 == h.status || 0 == h.status && h.response ? a(h.response) : s()
        }, h.onerror = s, h.send(null)
    }, typeof arguments < "u" && (Module.arguments = arguments), typeof console < "u") Module.print || (Module.print = function (r) {
        console.log(r)
    }), Module.printErr || (Module.printErr = function (r) {
        console.warn(r)
    }); else {
        var TRY_USE_DUMP = !1;
        Module.print || (Module.print = TRY_USE_DUMP && typeof dump < "u" ? function (e) {
            dump(e)
        } : function (e) {
        })
    }
    ENVIRONMENT_IS_WORKER && (Module.load = importScripts), typeof Module.setWindowTitle > "u" && (Module.setWindowTitle = function (e) {
        document.title = e
    })
}

function globalEval(e) {
    eval.call(null, e)
}

for (var key in !Module.load && Module.read && (Module.load = function (r) {
    globalEval(Module.read(r))
}), Module.print || (Module.print = function () {
}), Module.printErr || (Module.printErr = Module.print), Module.arguments || (Module.arguments = []), Module.thisProgram || (Module.thisProgram = "./this.program"), Module.quit || (Module.quit = function (e, r) {
    throw r
}), Module.print = Module.print, Module.printErr = Module.printErr, Module.preRun = [], Module.postRun = [], moduleOverrides) moduleOverrides.hasOwnProperty(key) && (Module[key] = moduleOverrides[key]);
moduleOverrides = void 0;
var Runtime = {
    setTempRet0: function (e) {
        return tempRet0 = e, e
    }, getTempRet0: function () {
        return tempRet0
    }, stackSave: function () {
        return STACKTOP
    }, stackRestore: function (e) {
        STACKTOP = e
    }, getNativeTypeSize: function (e) {
        switch (e) {
            case"i1":
            case"i8":
                return 1;
            case"i16":
                return 2;
            case"i32":
            case"float":
                return 4;
            case"i64":
            case"double":
                return 8;
            default:
                if ("*" === e[e.length - 1]) return Runtime.QUANTUM_SIZE;
                if ("i" === e[0]) {
                    var r = parseInt(e.substr(1));
                    return assert(r % 8 == 0), r / 8
                }
                return 0
        }
    }, getNativeFieldSize: function (e) {
        return Math.max(Runtime.getNativeTypeSize(e), Runtime.QUANTUM_SIZE)
    }, STACK_ALIGN: 16, prepVararg: function (e, r) {
        return "double" === r || "i64" === r ? 7 & e && (assert(4 == (7 & e)), e += 4) : assert(!(3 & e)), e
    }, getAlignSize: function (e, r, a) {
        return a || "i64" != e && "double" != e ? e ? Math.min(r || (e ? Runtime.getNativeFieldSize(e) : 0), Runtime.QUANTUM_SIZE) : Math.min(r, 8) : 8
    }, dynCall: function (e, r, a) {
        return a && a.length ? Module["dynCall_" + e].apply(null, [r].concat(a)) : Module["dynCall_" + e].call(null, r)
    }, functionPointers: [], addFunction: function (e) {
        for (var r = 0; r < Runtime.functionPointers.length; r++) if (!Runtime.functionPointers[r]) return Runtime.functionPointers[r] = e, 2 * (1 + r);
        throw "Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS."
    }, removeFunction: function (e) {
        Runtime.functionPointers[(e - 2) / 2] = null
    }, warnOnce: function (e) {
        Runtime.warnOnce.shown || (Runtime.warnOnce.shown = {}), Runtime.warnOnce.shown[e] || (Runtime.warnOnce.shown[e] = 1, Module.printErr(e))
    }, funcWrappers: {}, getFuncWrapper: function (e, r) {
        assert(r), Runtime.funcWrappers[r] || (Runtime.funcWrappers[r] = {});
        var a = Runtime.funcWrappers[r];
        return a[e] || (a[e] = 1 === r.length ? function () {
            return Runtime.dynCall(r, e)
        } : 2 === r.length ? function (h) {
            return Runtime.dynCall(r, e, [h])
        } : function () {
            return Runtime.dynCall(r, e, Array.prototype.slice.call(arguments))
        }), a[e]
    }, getCompilerSetting: function (e) {
        throw "You must build with -s RETAIN_COMPILER_SETTINGS=1 for Runtime.getCompilerSetting or emscripten_get_compiler_setting to work"
    }, stackAlloc: function (e) {
        var r = STACKTOP;
        return STACKTOP = 15 + (STACKTOP = STACKTOP + e | 0) & -16, r
    }, staticAlloc: function (e) {
        var r = STATICTOP;
        return STATICTOP = 15 + (STATICTOP = STATICTOP + e | 0) & -16, r
    }, dynamicAlloc: function (e) {
        var r = HEAP32[DYNAMICTOP_PTR >> 2], a = r + e + 15 & -16;
        return HEAP32[DYNAMICTOP_PTR >> 2] = a, a >= TOTAL_MEMORY && !enlargeMemory() ? (HEAP32[DYNAMICTOP_PTR >> 2] = r, 0) : r
    }, alignMemory: function (e, r) {
        return Math.ceil(e / (r || 16)) * (r || 16)
    }, makeBigInt: function (e, r, a) {
        return a ? +(e >>> 0) + 4294967296 * +(r >>> 0) : +(e >>> 0) + 4294967296 * +(0 | r)
    }, GLOBAL_BASE: 8, QUANTUM_SIZE: 4, __dummy__: 0
};
Module.Runtime = Runtime;
var ABORT = 0, EXITSTATUS = 0, cwrap, ccall;

function assert(e, r) {
    e || abort("Assertion failed: " + r)
}

function getCFunc(ident) {
    var func = Module["_" + ident];
    if (!func) try {
        func = eval("_" + ident)
    } catch (e) {
    }
    return assert(func, "Cannot call unknown function " + ident + " (perhaps LLVM optimizations or closure removed it?)"), func
}

function setValue(e, r, a, s) {
    switch ("*" === (a = a || "i8").charAt(a.length - 1) && (a = "i32"), a) {
        case"i1":
        case"i8":
            HEAP8[0 | e] = r;
            break;
        case"i16":
            HEAP16[e >> 1] = r;
            break;
        case"i32":
            HEAP32[e >> 2] = r;
            break;
        case"i64":
            tempI64 = [r >>> 0, (tempDouble = r, +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (0 | Math_min(+Math_floor(tempDouble / 4294967296), 4294967295)) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[e >> 2] = tempI64[0], HEAP32[e + 4 >> 2] = tempI64[1];
            break;
        case"float":
            HEAPF32[e >> 2] = r;
            break;
        case"double":
            HEAPF64[e >> 3] = r;
            break;
        default:
            abort("invalid type for setValue: " + a)
    }
}

function getValue(e, r, a) {
    switch ("*" === (r = r || "i8").charAt(r.length - 1) && (r = "i32"), r) {
        case"i1":
        case"i8":
            return HEAP8[0 | e];
        case"i16":
            return HEAP16[e >> 1];
        case"i32":
        case"i64":
            return HEAP32[e >> 2];
        case"float":
            return HEAPF32[e >> 2];
        case"double":
            return HEAPF64[e >> 3];
        default:
            abort("invalid type for setValue: " + r)
    }
    return null
}

(function () {
    var JSfuncs = {
        stackSave: function () {
            Runtime.stackSave()
        }, stackRestore: function () {
            Runtime.stackRestore()
        }, arrayToC: function (e) {
            var r = Runtime.stackAlloc(e.length);
            return writeArrayToMemory(e, r), r
        }, stringToC: function (e) {
            var r = 0;
            if (null != e && 0 !== e) {
                var a = 1 + (e.length << 2);
                stringToUTF8(e, r = Runtime.stackAlloc(a), a)
            }
            return r
        }
    }, toC = {string: JSfuncs.stringToC, array: JSfuncs.arrayToC};
    ccall = function (r, a, s, h, n) {
        var m = getCFunc(r), T = [], R = 0;
        if (h) for (var k = 0; k < h.length; k++) {
            var U = toC[s[k]];
            U ? (0 === R && (R = Runtime.stackSave()), T[k] = U(h[k])) : T[k] = h[k]
        }
        var W = m.apply(null, T);
        if ("string" === a && (W = Pointer_stringify(W)), 0 !== R) {
            if (n && n.async) return void EmterpreterAsync.asyncFinalizers.push(function () {
                Runtime.stackRestore(R)
            });
            Runtime.stackRestore(R)
        }
        return W
    };
    var sourceRegex = /^function\s*[a-zA-Z$_0-9]*\s*\(([^)]*)\)\s*{\s*([^*]*?)[\s;]*(?:return\s*(.*?)[;\s]*)?}$/;

    function parseJSFunc(e) {
        var r = e.toString().match(sourceRegex).slice(1);
        return {arguments: r[0], body: r[1], returnValue: r[2]}
    }

    var JSsource = null;

    function ensureJSsource() {
        if (!JSsource) for (var e in JSsource = {}, JSfuncs) JSfuncs.hasOwnProperty(e) && (JSsource[e] = parseJSFunc(JSfuncs[e]))
    }

    cwrap = function cwrap(ident, returnType, argTypes) {
        argTypes = argTypes || [];
        var cfunc = getCFunc(ident), numericArgs = argTypes.every(function (e) {
            return "number" === e
        }), numericRet = "string" !== returnType;
        if (numericRet && numericArgs) return cfunc;
        var argNames = argTypes.map(function (e, r) {
            return "$" + r
        }), funcstr = "(function(" + argNames.join(",") + ") {", nargs = argTypes.length;
        if (!numericArgs) {
            ensureJSsource(), funcstr += "var stack = " + JSsource.stackSave.body + ";";
            for (var i = 0; i < nargs; i++) {
                var arg = argNames[i], type = argTypes[i];
                if ("number" !== type) {
                    var convertCode = JSsource[type + "ToC"];
                    funcstr += "var " + convertCode.arguments + " = " + arg + ";", funcstr += convertCode.body + ";", funcstr += arg + "=(" + convertCode.returnValue + ");"
                }
            }
        }
        var cfuncname = parseJSFunc(function () {
            return cfunc
        }).returnValue;
        if (funcstr += "var ret = " + cfuncname + "(" + argNames.join(",") + ");", !numericRet) {
            var strgfy = parseJSFunc(function () {
                return Pointer_stringify
            }).returnValue;
            funcstr += "ret = " + strgfy + "(ret);"
        }
        return numericArgs || (ensureJSsource(), funcstr += JSsource.stackRestore.body.replace("()", "(stack)") + ";"), funcstr += "return ret})", eval(funcstr)
    }
})(), Module.ccall = ccall, Module.cwrap = cwrap, Module.setValue = setValue, Module.getValue = getValue;
var ALLOC_NORMAL = 0, ALLOC_STACK = 1, ALLOC_STATIC = 2, ALLOC_DYNAMIC = 3, ALLOC_NONE = 4;

function allocate(e, r, a, s) {
    var h, n;
    "number" == typeof e ? (h = !0, n = e) : (h = !1, n = e.length);
    var T, m = "string" == typeof r ? r : null;
    if (T = a == ALLOC_NONE ? s : ["function" == typeof _malloc ? _malloc : Runtime.staticAlloc, Runtime.stackAlloc, Runtime.staticAlloc, Runtime.dynamicAlloc][void 0 === a ? ALLOC_STATIC : a](Math.max(n, m ? 1 : r.length)), h) {
        var R;
        for (s = T, assert(!(3 & T)), R = T + (-4 & n); s < R; s += 4) HEAP32[s >> 2] = 0;
        for (R = T + n; s < R;) HEAP8[0 | s++] = 0;
        return T
    }
    if ("i8" === m) return HEAPU8.set(e.subarray || e.slice ? e : new Uint8Array(e), T), T;
    for (var U, W, S, k = 0; k < n;) {
        var L = e[k];
        "function" == typeof L && (L = Runtime.getFunctionIndex(L)), 0 !== (U = m || r[k]) ? ("i64" == U && (U = "i32"), setValue(T + k, L, U), S !== U && (W = Runtime.getNativeTypeSize(U), S = U), k += W) : k++
    }
    return T
}

function getMemory(e) {
    return staticSealed ? runtimeInitialized ? _malloc(e) : Runtime.dynamicAlloc(e) : Runtime.staticAlloc(e)
}

function Pointer_stringify(e, r) {
    if (0 === r || !e) return "";
    for (var s, a = 0, h = 0; a |= s = HEAPU8[e + h | 0], (0 != s || r) && (h++, !r || h != r);) ;
    r || (r = h);
    var n = "";
    if (a < 128) {
        for (var T, m = 1024; r > 0;) T = String.fromCharCode.apply(String, HEAPU8.subarray(e, e + Math.min(r, m))), n = n ? n + T : T, e += m, r -= m;
        return n
    }
    return Module.UTF8ToString(e)
}

function AsciiToString(e) {
    for (var r = ""; ;) {
        var a = HEAP8[0 | e++];
        if (!a) return r;
        r += String.fromCharCode(a)
    }
}

function stringToAscii(e, r) {
    return writeAsciiToMemory(e, r, !1)
}

Module.ALLOC_NORMAL = ALLOC_NORMAL, Module.ALLOC_STACK = ALLOC_STACK, Module.ALLOC_STATIC = ALLOC_STATIC, Module.ALLOC_DYNAMIC = ALLOC_DYNAMIC, Module.ALLOC_NONE = ALLOC_NONE, Module.allocate = allocate, Module.getMemory = getMemory, Module.Pointer_stringify = Pointer_stringify, Module.AsciiToString = AsciiToString, Module.stringToAscii = stringToAscii;
var UTF8Decoder = typeof TextDecoder < "u" ? new TextDecoder("utf8") : void 0;

function UTF8ArrayToString(e, r) {
    for (var a = r; e[a];) ++a;
    if (a - r > 16 && e.subarray && UTF8Decoder) return UTF8Decoder.decode(e.subarray(r, a));
    for (var s, h, n, m, T, k = ""; ;) {
        if (!(s = e[r++])) return k;
        if (128 & s) if (h = 63 & e[r++], 192 != (224 & s)) if (n = 63 & e[r++], 224 == (240 & s) ? s = (15 & s) << 12 | h << 6 | n : (m = 63 & e[r++], 240 == (248 & s) ? s = (7 & s) << 18 | h << 12 | n << 6 | m : (T = 63 & e[r++], s = 248 == (252 & s) ? (3 & s) << 24 | h << 18 | n << 12 | m << 6 | T : (1 & s) << 30 | h << 24 | n << 18 | m << 12 | T << 6 | 63 & e[r++])), s < 65536) k += String.fromCharCode(s); else {
            var U = s - 65536;
            k += String.fromCharCode(55296 | U >> 10, 56320 | 1023 & U)
        } else k += String.fromCharCode((31 & s) << 6 | h); else k += String.fromCharCode(s)
    }
}

function UTF8ToString(e) {
    return UTF8ArrayToString(HEAPU8, e)
}

function stringToUTF8Array(e, r, a, s) {
    if (!(s > 0)) return 0;
    for (var h = a, n = a + s - 1, m = 0; m < e.length; ++m) {
        var T = e.charCodeAt(m);
        if (T >= 55296 && T <= 57343 && (T = 65536 + ((1023 & T) << 10) | 1023 & e.charCodeAt(++m)), T <= 127) {
            if (a >= n) break;
            r[a++] = T
        } else if (T <= 2047) {
            if (a + 1 >= n) break;
            r[a++] = 192 | T >> 6, r[a++] = 128 | 63 & T
        } else if (T <= 65535) {
            if (a + 2 >= n) break;
            r[a++] = 224 | T >> 12, r[a++] = 128 | T >> 6 & 63, r[a++] = 128 | 63 & T
        } else if (T <= 2097151) {
            if (a + 3 >= n) break;
            r[a++] = 240 | T >> 18, r[a++] = 128 | T >> 12 & 63, r[a++] = 128 | T >> 6 & 63, r[a++] = 128 | 63 & T
        } else if (T <= 67108863) {
            if (a + 4 >= n) break;
            r[a++] = 248 | T >> 24, r[a++] = 128 | T >> 18 & 63, r[a++] = 128 | T >> 12 & 63, r[a++] = 128 | T >> 6 & 63, r[a++] = 128 | 63 & T
        } else {
            if (a + 5 >= n) break;
            r[a++] = 252 | T >> 30, r[a++] = 128 | T >> 24 & 63, r[a++] = 128 | T >> 18 & 63, r[a++] = 128 | T >> 12 & 63, r[a++] = 128 | T >> 6 & 63, r[a++] = 128 | 63 & T
        }
    }
    return r[a] = 0, a - h
}

function stringToUTF8(e, r, a) {
    return stringToUTF8Array(e, HEAPU8, r, a)
}

function lengthBytesUTF8(e) {
    for (var r = 0, a = 0; a < e.length; ++a) {
        var s = e.charCodeAt(a);
        s >= 55296 && s <= 57343 && (s = 65536 + ((1023 & s) << 10) | 1023 & e.charCodeAt(++a)), s <= 127 ? ++r : r += s <= 2047 ? 2 : s <= 65535 ? 3 : s <= 2097151 ? 4 : s <= 67108863 ? 5 : 6
    }
    return r
}

Module.UTF8ArrayToString = UTF8ArrayToString, Module.UTF8ToString = UTF8ToString, Module.stringToUTF8Array = stringToUTF8Array, Module.stringToUTF8 = stringToUTF8, Module.lengthBytesUTF8 = lengthBytesUTF8;
var UTF16Decoder = typeof TextDecoder < "u" ? new TextDecoder("utf-16le") : void 0, HEAP, buffer, HEAP8, HEAPU8, HEAP16,
    HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64, STATIC_BASE, STATICTOP, staticSealed, STACK_BASE, STACKTOP, STACK_MAX,
    DYNAMIC_BASE, DYNAMICTOP_PTR;

function demangle(e) {
    var r = Module.___cxa_demangle || Module.__cxa_demangle;
    if (r) {
        try {
            var a = e.substr(1), s = lengthBytesUTF8(a) + 1, h = _malloc(s);
            stringToUTF8(a, h, s);
            var n = _malloc(4), m = r(h, 0, 0, n);
            if (0 === getValue(n, "i32") && m) return Pointer_stringify(m)
        } catch {
        } finally {
            h && _free(h), n && _free(n), m && _free(m)
        }
        return e
    }
    return Runtime.warnOnce("warning: build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling"), e
}

function demangleAll(e) {
    return e.replace(/__Z[\w\d_]+/g, function (a) {
        var s = demangle(a);
        return a === s ? a : a + " [" + s + "]"
    })
}

function jsStackTrace() {
    var e = new Error;
    if (!e.stack) {
        try {
            throw new Error(0)
        } catch (r) {
            e = r
        }
        if (!e.stack) return "(no stack trace available)"
    }
    return e.stack.toString()
}

function stackTrace() {
    var e = jsStackTrace();
    return Module.extraStackTrace && (e += "\n" + Module.extraStackTrace()), demangleAll(e)
}

function updateGlobalBufferViews() {
    Module.HEAP8 = HEAP8 = new Int8Array(buffer), Module.HEAP16 = HEAP16 = new Int16Array(buffer), Module.HEAP32 = HEAP32 = new Int32Array(buffer), Module.HEAPU8 = HEAPU8 = new Uint8Array(buffer), Module.HEAPU16 = HEAPU16 = new Uint16Array(buffer), Module.HEAPU32 = HEAPU32 = new Uint32Array(buffer), Module.HEAPF32 = HEAPF32 = new Float32Array(buffer), Module.HEAPF64 = HEAPF64 = new Float64Array(buffer)
}

function abortOnCannotGrowMemory() {
    abort("Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value " + TOTAL_MEMORY + ", (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime but prevents some optimizations, (3) set Module.TOTAL_MEMORY to a higher value before the program runs, or (4) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ")
}

function enlargeMemory() {
    abortOnCannotGrowMemory()
}

Module.stackTrace = stackTrace, STATIC_BASE = STATICTOP = STACK_BASE = STACKTOP = STACK_MAX = DYNAMIC_BASE = DYNAMICTOP_PTR = 0, staticSealed = !1;
var TOTAL_STACK = Module.TOTAL_STACK || 5242880, TOTAL_MEMORY = Module.TOTAL_MEMORY || 16777216;

function getTotalMemory() {
    return TOTAL_MEMORY
}

if (TOTAL_MEMORY < TOTAL_STACK && Module.printErr("TOTAL_MEMORY should be larger than TOTAL_STACK, was " + TOTAL_MEMORY + "! (TOTAL_STACK=" + TOTAL_STACK + ")"), buffer = Module.buffer ? Module.buffer : new ArrayBuffer(TOTAL_MEMORY), updateGlobalBufferViews(), HEAP32[0] = 1668509029, HEAP16[1] = 25459, 115 !== HEAPU8[2] || 99 !== HEAPU8[3]) throw "Runtime error: expected the system to be little-endian!";

function callRuntimeCallbacks(e) {
    for (; e.length > 0;) {
        var r = e.shift();
        if ("function" != typeof r) {
            var a = r.func;
            "number" == typeof a ? void 0 === r.arg ? Module.dynCall_v(a) : Module.dynCall_vi(a, r.arg) : a(void 0 === r.arg ? null : r.arg)
        } else r()
    }
}

Module.HEAP = HEAP, Module.buffer = buffer, Module.HEAP8 = HEAP8, Module.HEAP16 = HEAP16, Module.HEAP32 = HEAP32, Module.HEAPU8 = HEAPU8, Module.HEAPU16 = HEAPU16, Module.HEAPU32 = HEAPU32, Module.HEAPF32 = HEAPF32, Module.HEAPF64 = HEAPF64;
var __ATPRERUN__ = [], __ATINIT__ = [], __ATMAIN__ = [], __ATEXIT__ = [], __ATPOSTRUN__ = [], runtimeInitialized = !1,
    runtimeExited = !1;

function preRun() {
    if (Module.preRun) for ("function" == typeof Module.preRun && (Module.preRun = [Module.preRun]); Module.preRun.length;) addOnPreRun(Module.preRun.shift());
    callRuntimeCallbacks(__ATPRERUN__)
}

function ensureInitRuntime() {
    runtimeInitialized || (runtimeInitialized = !0, callRuntimeCallbacks(__ATINIT__))
}

function preMain() {
    callRuntimeCallbacks(__ATMAIN__)
}

function exitRuntime() {
    callRuntimeCallbacks(__ATEXIT__), runtimeExited = !0
}

function postRun() {
    if (Module.postRun) for ("function" == typeof Module.postRun && (Module.postRun = [Module.postRun]); Module.postRun.length;) addOnPostRun(Module.postRun.shift());
    callRuntimeCallbacks(__ATPOSTRUN__)
}

function addOnPreRun(e) {
    __ATPRERUN__.unshift(e)
}

function addOnInit(e) {
    __ATINIT__.unshift(e)
}

function addOnPreMain(e) {
    __ATMAIN__.unshift(e)
}

function addOnExit(e) {
    __ATEXIT__.unshift(e)
}

function addOnPostRun(e) {
    __ATPOSTRUN__.unshift(e)
}

function intArrayFromString(e, r, a) {
    var s = a > 0 ? a : lengthBytesUTF8(e) + 1, h = new Array(s), n = stringToUTF8Array(e, h, 0, h.length);
    return r && (h.length = n), h
}

function intArrayToString(e) {
    for (var r = [], a = 0; a < e.length; a++) {
        var s = e[a];
        s > 255 && (s &= 255), r.push(String.fromCharCode(s))
    }
    return r.join("")
}

function writeStringToMemory(e, r, a) {
    var s, h;
    Runtime.warnOnce("writeStringToMemory is deprecated and should not be called! Use stringToUTF8() instead!"), a && (h = r + lengthBytesUTF8(e), s = HEAP8[h]), stringToUTF8(e, r, 1 / 0), a && (HEAP8[h] = s)
}

function writeArrayToMemory(e, r) {
    HEAP8.set(e, r)
}

function writeAsciiToMemory(e, r, a) {
    for (var s = 0; s < e.length; ++s) HEAP8[0 | r++] = e.charCodeAt(s);
    a || (HEAP8[0 | r] = 0)
}

Module.addOnPreRun = addOnPreRun, Module.addOnInit = addOnInit, Module.addOnPreMain = addOnPreMain, Module.addOnExit = addOnExit, Module.addOnPostRun = addOnPostRun, Module.intArrayFromString = intArrayFromString, Module.intArrayToString = intArrayToString, Module.writeStringToMemory = writeStringToMemory, Module.writeArrayToMemory = writeArrayToMemory, Module.writeAsciiToMemory = writeAsciiToMemory, (!Math.imul || -5 !== Math.imul(4294967295, 5)) && (Math.imul = function e(r, a) {
    var h = 65535 & r, m = 65535 & a;
    return h * m + ((r >>> 16) * m + h * (a >>> 16) << 16) | 0
}), Math.imul = Math.imul, Math.clz32 || (Math.clz32 = function (e) {
    e >>>= 0;
    for (var r = 0; r < 32; r++) if (e & 1 << 31 - r) return r;
    return 32
}), Math.clz32 = Math.clz32, Math.trunc || (Math.trunc = function (e) {
    return e < 0 ? Math.ceil(e) : Math.floor(e)
}), Math.trunc = Math.trunc;
var Math_abs = Math.abs, Math_cos = Math.cos, Math_sin = Math.sin, Math_tan = Math.tan, Math_acos = Math.acos,
    Math_asin = Math.asin, Math_atan = Math.atan, Math_atan2 = Math.atan2, Math_exp = Math.exp, Math_log = Math.log,
    Math_sqrt = Math.sqrt, Math_ceil = Math.ceil, Math_floor = Math.floor, Math_pow = Math.pow, Math_imul = Math.imul,
    Math_fround = Math.fround, Math_round = Math.round, Math_min = Math.min, Math_clz32 = Math.clz32,
    Math_trunc = Math.trunc, runDependencies = 0, runDependencyWatcher = null, dependenciesFulfilled = null;

function addRunDependency(e) {
    runDependencies++, Module.monitorRunDependencies && Module.monitorRunDependencies(runDependencies)
}

function removeRunDependency(e) {
    if (runDependencies--, Module.monitorRunDependencies && Module.monitorRunDependencies(runDependencies), 0 == runDependencies && (null !== runDependencyWatcher && (clearInterval(runDependencyWatcher), runDependencyWatcher = null), dependenciesFulfilled)) {
        var r = dependenciesFulfilled;
        dependenciesFulfilled = null, r()
    }
}

Module.addRunDependency = addRunDependency, Module.removeRunDependency = removeRunDependency, Module.preloadedImages = {}, Module.preloadedAudios = {};
var memoryInitializer = null, ASM_CONSTS = [];
STATIC_BASE = Runtime.GLOBAL_BASE, STATICTOP = STATIC_BASE + 5216, __ATINIT__.push(), memoryInitializer = "assets/mem/sha256crypt.mem";
var tempDoublePtr = STATICTOP;

function ___lock() {
}

function ___unlock() {
}

STATICTOP += 16;
var SYSCALLS = {
    varargs: 0, get: function (e) {
        return SYSCALLS.varargs += 4, HEAP32[SYSCALLS.varargs - 4 >> 2]
    }, getStr: function () {
        return Pointer_stringify(SYSCALLS.get())
    }, get64: function () {
        var e = SYSCALLS.get(), r = SYSCALLS.get();
        return assert(e >= 0 ? 0 === r : -1 === r), e
    }, getZero: function () {
        assert(0 === SYSCALLS.get())
    }
};

function ___syscall6(e, r) {
    SYSCALLS.varargs = r;
    try {
        var a = SYSCALLS.getStreamFromFD();
        return FS.close(a), 0
    } catch (s) {
        return (typeof FS > "u" || !(s instanceof FS.ErrnoError)) && abort(s), -s.errno
    }
}

var cttz_i8 = allocate([8, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 6, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 7, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 6, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0], "i8", ALLOC_STATIC);

function ___setErrNo(e) {
    return Module.___errno_location && (HEAP32[Module.___errno_location() >> 2] = e), e
}

function _emscripten_memcpy_big(e, r, a) {
    return HEAPU8.set(HEAPU8.subarray(r, r + a), e), e
}

function ___syscall140(e, r) {
    SYSCALLS.varargs = r;
    try {
        var a = SYSCALLS.getStreamFromFD(), h = (SYSCALLS.get(), SYSCALLS.get()), n = SYSCALLS.get(),
            m = SYSCALLS.get(), T = h;
        return FS.llseek(a, T, m), HEAP32[n >> 2] = a.position, a.getdents && 0 === T && 0 === m && (a.getdents = null), 0
    } catch (R) {
        return (typeof FS > "u" || !(R instanceof FS.ErrnoError)) && abort(R), -R.errno
    }
}

function ___syscall146(e, r) {
    SYSCALLS.varargs = r;
    try {
        var a = SYSCALLS.get(), s = SYSCALLS.get(), h = SYSCALLS.get(), n = 0;
        ___syscall146.buffer || (___syscall146.buffers = [null, [], []], ___syscall146.printChar = function (U, W) {
            var S = ___syscall146.buffers[U];
            assert(S), 0 === W || 10 === W ? ((1 === U ? Module.print : Module.printErr)(UTF8ArrayToString(S, 0)), S.length = 0) : S.push(W)
        });
        for (var m = 0; m < h; m++) {
            for (var T = HEAP32[s + 8 * m >> 2], R = HEAP32[s + (8 * m + 4) >> 2], k = 0; k < R; k++) ___syscall146.printChar(a, HEAPU8[T + k]);
            n += R
        }
        return n
    } catch (U) {
        return (typeof FS > "u" || !(U instanceof FS.ErrnoError)) && abort(U), -U.errno
    }
}

function ___syscall54(e, r) {
    SYSCALLS.varargs = r;
    try {
        return 0
    } catch (a) {
        return (typeof FS > "u" || !(a instanceof FS.ErrnoError)) && abort(a), -a.errno
    }
}

function invoke_ii(e, r) {
    try {
        return Module.dynCall_ii(e, r)
    } catch (a) {
        if ("number" != typeof a && "longjmp" !== a) throw a;
        Module.setThrew(1, 0)
    }
}

function invoke_iiii(e, r, a, s) {
    try {
        return Module.dynCall_iiii(e, r, a, s)
    } catch (h) {
        if ("number" != typeof h && "longjmp" !== h) throw h;
        Module.setThrew(1, 0)
    }
}

__ATEXIT__.push(function () {
    var e = Module._fflush;
    e && e(0);
    var r = ___syscall146.printChar;
    if (r) {
        var a = ___syscall146.buffers;
        a[1].length && r(1, 10), a[2].length && r(2, 10)
    }
}), DYNAMICTOP_PTR = allocate(1, "i32", ALLOC_STATIC), STACK_BASE = STACKTOP = Runtime.alignMemory(STATICTOP), STACK_MAX = STACK_BASE + TOTAL_STACK, DYNAMIC_BASE = Runtime.alignMemory(STACK_MAX), HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE, staticSealed = !0, Module.asmGlobalArg = {
    Math,
    Int8Array,
    Int16Array,
    Int32Array,
    Uint8Array,
    Uint16Array,
    Uint32Array,
    Float32Array,
    Float64Array,
    NaN: NaN,
    Infinity: 1 / 0
}, Module.asmLibraryArg = {
    abort,
    assert,
    enlargeMemory,
    getTotalMemory,
    abortOnCannotGrowMemory,
    invoke_ii,
    invoke_iiii,
    ___lock,
    ___syscall6,
    ___setErrNo,
    ___syscall140,
    _emscripten_memcpy_big,
    ___syscall54,
    ___unlock,
    ___syscall146,
    DYNAMICTOP_PTR,
    tempDoublePtr,
    ABORT,
    STACKTOP,
    STACK_MAX,
    cttz_i8
};
var asm = function (e, r, a) {
        var s = new e.Int8Array(a), h = new e.Int16Array(a), n = new e.Int32Array(a), m = new e.Uint8Array(a),
            U = (new e.Uint16Array(a), new e.Uint32Array(a), new e.Float32Array(a), new e.Float64Array(a)),
            W = 0 | r.DYNAMICTOP_PTR, S = 0 | r.tempDoublePtr, M = 0 | r.STACKTOP, g = 0 | r.cttz_i8, x = 0, q0 = 0,
            X0 = e.Math.imul, Y0 = e.Math.clz32, Z0 = r.abort, R0 = r.enlargeMemory, q1 = r.getTotalMemory,
            D1 = r.abortOnCannotGrowMemory, g0 = r.___lock, p1 = r.___syscall6, e1 = r.___setErrNo, I = r.___syscall140,
            d = r._emscripten_memcpy_big, b = r.___syscall54, P = r.___unlock, V = r.___syscall146;

        function g1(o, l, p) {
            o |= 0, l |= 0;
            var T0, O = 0, _ = 0, w = 0, q = 0, j = 0, Y = 0, J = 0, o0 = 0, n0 = 0;
            (_ = 0 | n[(T0 = 40 + (p |= 0) | 0) >> 2]) && (j1(p + 44 + _ | 0, 0 | o, 0 | (w = (w = 128 - _ | 0) >>> 0 > l >>> 0 ? l : w)), n[T0 >> 2] = O = (0 | n[T0 >> 2]) + w | 0, O >>> 0 > 64 && (i1(J = p + 44 | 0, -64 & O, p), n[T0 >> 2] = o0 = 63 & n[T0 >> 2], j1(0 | J, (w + _ & -64) + (p + 44) | 0, 0 | o0)), o = o + w | 0, l = l - w | 0);
            do {
                if (l >>> 0 > 63) {
                    if (!(3 & o)) {
                        i1(o, n0 = -64 & l, p), o = o + n0 | 0, l &= 63, n0 = 11;
                        break
                    }
                    if (l >>> 0 > 64) {
                        for (j = p + 44 | 0, o0 = 64 + (Y = l + -65 & -64) | 0, J = l + -64 | 0, O = o; ;) {
                            w = O, q = (_ = j) + 64 | 0;
                            do {
                                s[0 | _] = 0 | s[0 | w], _ = _ + 1 | 0, w = w + 1 | 0
                            } while ((0 | _) < (0 | q));
                            if (i1(j, 64, p), (l = l + -64 | 0) >>> 0 <= 64) break;
                            O = O + 64 | 0
                        }
                        l = J - Y | 0, o = o + o0 | 0
                    } else l = 64
                } else n0 = 11
            } while (0);
            11 == (0 | n0) && !l || (j1(p + 44 + (O = 0 | n[T0 >> 2]) | 0, 0 | o, 0 | l), o = p + 44 | 0, O = (l = O + l | 0) - 64 | 0, l >>> 0 > 63 && (i1(o, 64, p), j1(0 | o, p + 108 | 0, 0 | O), l = O), n[T0 >> 2] = l)
        }

        function y1(o, l) {
            l |= 0;
            var q, p = 0, O = 0, _ = 0, w = 0;
            n[(O = 32 + (o |= 0) | 0) >> 2] = w = (0 | n[O >> 2]) + (p = 0 | n[o + 40 >> 2]) | 0, _ = o + 36 | 0, w >>> 0 < p >>> 0 && (n[_ >> 2] = 1 + (0 | n[_ >> 2])), j1(o + 44 + p | 0, 845, (w = p >>> 0 > 55 ? 120 : 56) - p | 0), p = 0 | n[O >> 2], s[0 | (O = (4 | w) + (o + 44) | 0)] = q = p << 11 & 16711680 | p << 27 | p >>> 5 & 65280 | p >>> 21 & 255, s[O + 1 | 0] = q >> 8, s[O + 2 | 0] = q >> 16, s[O + 3 | 0] = q >> 24, O = 0 | n[_ >> 2], s[0 | (_ = o + 44 + w | 0)] = O = O >>> 5 & 65280 | O << 11 & 16711680 | O >>> 21 & 255 | (p >>> 29 | O << 3) << 24, s[_ + 1 | 0] = O >> 8, s[_ + 2 | 0] = O >> 16, s[_ + 3 | 0] = O >> 24, i1(o + 44 | 0, w + 8 | 0, o), n[l >> 2] = 0 | T1(0 | n[o >> 2]), n[l + 4 >> 2] = 0 | T1(0 | n[o + 4 >> 2]), n[l + 8 >> 2] = 0 | T1(0 | n[o + 8 >> 2]), n[l + 12 >> 2] = 0 | T1(0 | n[o + 12 >> 2]), n[l + 16 >> 2] = 0 | T1(0 | n[o + 16 >> 2]), n[l + 20 >> 2] = 0 | T1(0 | n[o + 20 >> 2]), n[l + 24 >> 2] = 0 | T1(0 | n[o + 24 >> 2]), n[l + 28 >> 2] = 0 | T1(0 | n[o + 28 >> 2])
        }

        function i1(o, l, p) {
            o |= 0;
            var l0, u1, B1, M1, F0, o1, O1, r1, W1, he, S1, t1, U0, C1, l1, z1, O = 0, _ = 0, w = 0, q = 0, j = 0, Y = 0,
                J = 0, o0 = 0, n0 = 0, T0 = 0, S0 = 0, h0 = 0, B0 = 0, D0 = 0, W0 = 0, I0 = 0, u0 = 0, x1 = 0, se = 0,
                oe = 0, ce = 0, le = 0, $1 = 0, F1 = 0, c1 = 0, P1 = 0, U1 = 0;
            if (z1 = M, M = M + 256 | 0, c1 = z1, o0 = (l |= 0) >>> 2, J = 0 | n[(p |= 0) >> 2], Y = 0 | n[(C1 = p + 4 | 0) >> 2], n0 = 0 | n[(l1 = p + 8 | 0) >> 2], j = 0 | n[(W1 = p + 12 | 0) >> 2], q = 0 | n[(he = p + 16 | 0) >> 2], w = 0 | n[(S1 = p + 20 | 0) >> 2], _ = 0 | n[(t1 = p + 24 | 0) >> 2], O = 0 | n[(U0 = p + 28 | 0) >> 2], n[($1 = p + 32 | 0) >> 2] = F1 = (0 | n[$1 >> 2]) + l | 0, F1 >>> 0 < l >>> 0 && (n[(F1 = p + 36 | 0) >> 2] = 1 + (0 | n[F1 >> 2])), !o0) return se = Y, oe = n0, ce = j, le = q, $1 = w, F1 = _, c1 = O, n[p >> 2] = x1 = J, n[C1 >> 2] = se, n[l1 >> 2] = oe, n[W1 >> 2] = ce, n[he >> 2] = le, n[S1 >> 2] = $1, n[t1 >> 2] = F1, n[U0 >> 2] = c1, void (M = z1);
            for (l0 = c1 + 4 | 0, u1 = c1 + 8 | 0, B1 = c1 + 12 | 0, M1 = c1 + 16 | 0, F0 = c1 + 20 | 0, o1 = c1 + 24 | 0, O1 = c1 + 28 | 0, r1 = c1 + 32 | 0, x1 = c1 + 36 | 0, se = c1 + 40 | 0, oe = c1 + 44 | 0, ce = c1 + 48 | 0, le = c1 + 52 | 0, $1 = c1 + 56 | 0, F1 = c1 + 60 | 0, l = n0, u0 = o; ;) {
                o = 0 | T1(0 | n[u0 >> 2]), n[c1 >> 2] = o, n[l0 >> 2] = 0 | T1(0 | n[u0 + 4 >> 2]), n[u1 >> 2] = 0 | T1(0 | n[u0 + 8 >> 2]), n[B1 >> 2] = 0 | T1(0 | n[u0 + 12 >> 2]), n[M1 >> 2] = 0 | T1(0 | n[u0 + 16 >> 2]), n[F0 >> 2] = 0 | T1(0 | n[u0 + 20 >> 2]), n[o1 >> 2] = 0 | T1(0 | n[u0 + 24 >> 2]), n[O1 >> 2] = 0 | T1(0 | n[u0 + 28 >> 2]), n[r1 >> 2] = 0 | T1(0 | n[u0 + 32 >> 2]), n[x1 >> 2] = 0 | T1(0 | n[u0 + 36 >> 2]), n[se >> 2] = 0 | T1(0 | n[u0 + 40 >> 2]), n[oe >> 2] = 0 | T1(0 | n[u0 + 44 >> 2]), n[ce >> 2] = 0 | T1(0 | n[u0 + 48 >> 2]), n[le >> 2] = 0 | T1(0 | n[u0 + 52 >> 2]), n[$1 >> 2] = 0 | T1(0 | n[u0 + 56 >> 2]), n[F1 >> 2] = 0 | T1(0 | n[u0 + 60 >> 2]), n0 = 16;
                do {
                    n[c1 + (n0 << 2) >> 2] = (W0 = o) + (0 | n[c1 + (n0 + -7 << 2) >> 2]) + (((I0 = 0 | n[c1 + (n0 + -2 << 2) >> 2]) >>> 19 | I0 << 13) ^ I0 >>> 10 ^ (I0 >>> 17 | I0 << 15)) + (((o = 0 | n[c1 + (n0 + -15 << 2) >> 2]) >>> 18 | o << 14) ^ o >>> 3 ^ (o >>> 7 | o << 25)), n0 = n0 + 1 | 0
                } while (64 != (0 | n0));
                for (S0 = J, h0 = Y, B0 = l, n0 = j, D0 = q, W0 = w, I0 = _, o = O, T0 = 0; o = (P1 = (D0 & W0 ^ I0 & ~D0) + o + ((D0 >>> 6 | D0 << 26) ^ (D0 >>> 11 | D0 << 21) ^ (D0 >>> 25 | D0 << 7)) + (0 | n[8 + (T0 << 2) >> 2]) + (0 | n[c1 + (T0 << 2) >> 2]) | 0) + n0 | 0, n0 = ((S0 >>> 2 | S0 << 30) ^ (S0 >>> 13 | S0 << 19) ^ (S0 >>> 22 | S0 << 10)) + (S0 & (h0 ^ B0) ^ h0 & B0) + P1 | 0, 64 != (0 | (T0 = T0 + 1 | 0));) U1 = D0, P1 = S0, S0 = n0, D0 = o, o = I0, I0 = W0, W0 = U1, n0 = B0, B0 = h0, h0 = P1;
                if (J = n0 + J | 0, Y = S0 + Y | 0, l = h0 + l | 0, j = B0 + j | 0, q = o + q | 0, w = D0 + w | 0, _ = W0 + _ | 0, O = I0 + O | 0, !(o0 = o0 + -16 | 0)) break;
                u0 = u0 + 64 | 0
            }
            n[p >> 2] = J, n[C1 >> 2] = Y, n[l1 >> 2] = l, n[W1 >> 2] = j, n[he >> 2] = q, n[S1 >> 2] = w, n[t1 >> 2] = _, n[U0 >> 2] = O, M = z1
        }

        function R1(o) {
            o |= 0;
            var u1, l = 0, p = 0, O = 0, _ = 0, w = 0, q = 0, j = 0, Y = 0, J = 0, o0 = 0, n0 = 0, T0 = 0, S0 = 0, h0 = 0,
                B0 = 0, D0 = 0, W0 = 0, I0 = 0, u0 = 0, l0 = 0;
            u1 = M, M = M + 16 | 0, T0 = u1;
            do {
                if (o >>> 0 < 245) {
                    if (3 & (p = (n0 = 0 | n[903]) >>> (o = (J = o >>> 0 < 11 ? 16 : o + 11 & -8) >>> 3))) return (0 | (o = 3652 + ((l = (1 & p ^ 1) + o | 0) << 1 << 2) | 0)) == (0 | (w = 0 | n[(_ = 8 + (O = 0 | n[(p = o + 8 | 0) >> 2]) | 0) >> 2])) ? n[903] = n0 & ~(1 << l) : (n[w + 12 >> 2] = o, n[p >> 2] = w), n[O + 4 >> 2] = 3 | (l0 = l << 3), n[(l0 = O + l0 + 4 | 0) >> 2] = 1 | n[l0 >> 2], M = u1, 0 | _;
                    if (J >>> 0 > (o0 = 0 | n[905]) >>> 0) {
                        if (0 | p) return l = ((l = p << o & ((l = 2 << o) | 0 - l)) & 0 - l) - 1 | 0, (0 | (l = 3652 + ((O = ((p = (l >>>= q = l >>> 12 & 16) >>> 5 & 8) | q | (_ = (l >>>= p) >>> 2 & 4) | (o = (l >>>= _) >>> 1 & 2) | (O = (l >>>= o) >>> 1 & 1)) + (l >>> O) | 0) << 1 << 2) | 0)) == (0 | (p = 0 | n[(q = 8 + (_ = 0 | n[(o = l + 8 | 0) >> 2]) | 0) >> 2])) ? n[903] = o = n0 & ~(1 << O) : (n[p + 12 >> 2] = l, n[o >> 2] = p, o = n0), w = (O << 3) - J | 0, n[_ + 4 >> 2] = 3 | J, n[4 + (O = _ + J | 0) >> 2] = 1 | w, n[O + w >> 2] = w, 0 | o0 && (_ = 0 | n[908], p = 3652 + ((l = o0 >>> 3) << 1 << 2) | 0, o & (l = 1 << l) ? l = 0 | n[(o = p + 8 | 0) >> 2] : (n[903] = o | l, l = p, o = p + 8 | 0), n[o >> 2] = _, n[l + 12 >> 2] = _, n[_ + 8 >> 2] = l, n[_ + 12 >> 2] = p), n[905] = w, n[908] = O, M = u1, 0 | q;
                        if (j = 0 | n[904]) {
                            if (p = (j & 0 - j) - 1 | 0, p = (-8 & n[4 + (o = 0 | n[3916 + (((w = (p >>>= q = p >>> 12 & 16) >>> 5 & 8) | q | (Y = (p >>>= w) >>> 2 & 4) | (O = (p >>>= Y) >>> 1 & 2) | (o = (p >>>= O) >>> 1 & 1)) + (p >>> o) << 2) >> 2]) >> 2]) - J | 0, O = 0 | n[o + 16 + ((1 & !(0 | n[o + 16 >> 2])) << 2) >> 2]) {
                                do {
                                    p = (Y = (q = (-8 & n[O + 4 >> 2]) - J | 0) >>> 0 < p >>> 0) ? q : p, o = Y ? O : o, O = 0 | n[O + 16 + ((1 & !(0 | n[O + 16 >> 2])) << 2) >> 2]
                                } while (0 | O);
                                Y = o, w = p
                            } else Y = o, w = p;
                            if (Y >>> 0 < (q = Y + J | 0) >>> 0) {
                                _ = 0 | n[Y + 24 >> 2], l = 0 | n[Y + 12 >> 2];
                                do {
                                    if ((0 | l) == (0 | Y)) {
                                        if (!(l = 0 | n[(o = Y + 20 | 0) >> 2]) && !(l = 0 | n[(o = Y + 16 | 0) >> 2])) {
                                            p = 0;
                                            break
                                        }
                                        for (; ;) if (0 | (O = 0 | n[(p = l + 20 | 0) >> 2])) l = O, o = p; else {
                                            if (!(O = 0 | n[(p = l + 16 | 0) >> 2])) break;
                                            l = O, o = p
                                        }
                                        n[o >> 2] = 0, p = l
                                    } else n[12 + (p = 0 | n[Y + 8 >> 2]) >> 2] = l, n[l + 8 >> 2] = p, p = l
                                } while (0);
                                do {
                                    if (0 | _) {
                                        if ((0 | Y) == (0 | n[(o = 3916 + ((l = 0 | n[Y + 28 >> 2]) << 2) | 0) >> 2])) {
                                            if (n[o >> 2] = p, !p) {
                                                n[904] = j & ~(1 << l);
                                                break
                                            }
                                        } else if (n[_ + 16 + (((0 | n[_ + 16 >> 2]) != (0 | Y) & 1) << 2) >> 2] = p, !p) break;
                                        n[p + 24 >> 2] = _, 0 | (l = 0 | n[Y + 16 >> 2]) && (n[p + 16 >> 2] = l, n[l + 24 >> 2] = p), 0 | (l = 0 | n[Y + 20 >> 2]) && (n[p + 20 >> 2] = l, n[l + 24 >> 2] = p)
                                    }
                                } while (0);
                                return w >>> 0 < 16 ? (n[Y + 4 >> 2] = 3 | (l0 = w + J | 0), n[(l0 = Y + l0 + 4 | 0) >> 2] = 1 | n[l0 >> 2]) : (n[Y + 4 >> 2] = 3 | J, n[q + 4 >> 2] = 1 | w, n[q + w >> 2] = w, 0 | o0 && (O = 0 | n[908], p = 3652 + ((l = o0 >>> 3) << 1 << 2) | 0, n0 & (l = 1 << l) ? l = 0 | n[(o = p + 8 | 0) >> 2] : (n[903] = n0 | l, l = p, o = p + 8 | 0), n[o >> 2] = O, n[l + 12 >> 2] = O, n[O + 8 >> 2] = l, n[O + 12 >> 2] = p), n[905] = w, n[908] = q), M = u1, 0 | Y + 8
                            }
                            n0 = J
                        } else n0 = J
                    } else n0 = J
                } else if (o >>> 0 <= 4294967231) if (J = -8 & (o = o + 11 | 0), Y = 0 | n[904]) {
                    O = 0 - J | 0, j = (o >>>= 8) ? J >>> 0 > 16777215 ? 31 : J >>> (7 + (j = 14 - ((o0 = (520192 + (u0 = o << (n0 = (o + 1048320 | 0) >>> 16 & 8)) | 0) >>> 16 & 4) | n0 | (j = (245760 + (u0 <<= o0) | 0) >>> 16 & 2)) + (u0 << j >>> 15) | 0) | 0) & 1 | j << 1 : 0, p = 0 | n[3916 + (j << 2) >> 2];
                    e:do {
                        if (p) for (o = 0, q = J << (31 == (0 | j) ? 0 : 25 - (j >>> 1)), w = 0; ;) {
                            if ((_ = (-8 & n[p + 4 >> 2]) - J | 0) >>> 0 < O >>> 0) {
                                if (!_) {
                                    o = p, O = 0, _ = p, u0 = 61;
                                    break e
                                }
                                o = p, O = _
                            }
                            if (w = !(0 | (_ = 0 | n[p + 20 >> 2])) | (0 | _) == (0 | (p = 0 | n[p + 16 + (q >>> 31 << 2) >> 2])) ? w : _, _ = !(0 | p)) {
                                p = w, u0 = 57;
                                break
                            }
                            q <<= 1 & (1 ^ _)
                        } else p = 0, o = 0, u0 = 57
                    } while (0);
                    if (57 == (0 | u0)) {
                        if (!(0 | p) & !(0 | o)) {
                            if (!(o = Y & ((o = 2 << j) | 0 - o))) {
                                n0 = J;
                                break
                            }
                            n0 = (o & 0 - o) - 1 | 0, o = 0, p = 0 | n[3916 + (((w = (n0 >>>= q = n0 >>> 12 & 16) >>> 5 & 8) | q | (j = (n0 >>>= w) >>> 2 & 4) | (o0 = (n0 >>>= j) >>> 1 & 2) | (p = (n0 >>>= o0) >>> 1 & 1)) + (n0 >>> p) << 2) >> 2]
                        }
                        p ? (_ = p, u0 = 61) : (j = o, q = O)
                    }
                    if (61 == (0 | u0)) for (; ;) {
                        if (u0 = 0, p = (n0 = (p = (-8 & n[_ + 4 >> 2]) - J | 0) >>> 0 < O >>> 0) ? p : O, o = n0 ? _ : o, !(_ = 0 | n[_ + 16 + ((1 & !(0 | n[_ + 16 >> 2])) << 2) >> 2])) {
                            j = o, q = p;
                            break
                        }
                        O = p, u0 = 61
                    }
                    if (0 | j && q >>> 0 < ((0 | n[905]) - J | 0) >>> 0) {
                        if (j >>> 0 >= (w = j + J | 0) >>> 0) return M = u1, 0;
                        _ = 0 | n[j + 24 >> 2], l = 0 | n[j + 12 >> 2];
                        do {
                            if ((0 | l) == (0 | j)) {
                                if (!(l = 0 | n[(o = j + 20 | 0) >> 2]) && !(l = 0 | n[(o = j + 16 | 0) >> 2])) {
                                    l = 0;
                                    break
                                }
                                for (; ;) if (0 | (O = 0 | n[(p = l + 20 | 0) >> 2])) l = O, o = p; else {
                                    if (!(O = 0 | n[(p = l + 16 | 0) >> 2])) break;
                                    l = O, o = p
                                }
                                n[o >> 2] = 0
                            } else n[12 + (l0 = 0 | n[j + 8 >> 2]) >> 2] = l, n[l + 8 >> 2] = l0
                        } while (0);
                        do {
                            if (_) {
                                if ((0 | j) == (0 | n[(p = 3916 + ((o = 0 | n[j + 28 >> 2]) << 2) | 0) >> 2])) {
                                    if (n[p >> 2] = l, !l) {
                                        n[904] = O = Y & ~(1 << o);
                                        break
                                    }
                                } else if (n[_ + 16 + (((0 | n[_ + 16 >> 2]) != (0 | j) & 1) << 2) >> 2] = l, !l) {
                                    O = Y;
                                    break
                                }
                                n[l + 24 >> 2] = _, 0 | (o = 0 | n[j + 16 >> 2]) && (n[l + 16 >> 2] = o, n[o + 24 >> 2] = l), (o = 0 | n[j + 20 >> 2]) && (n[l + 20 >> 2] = o, n[o + 24 >> 2] = l), O = Y
                            } else O = Y
                        } while (0);
                        do {
                            if (q >>> 0 >= 16) {
                                if (n[j + 4 >> 2] = 3 | J, n[w + 4 >> 2] = 1 | q, n[w + q >> 2] = q, l = q >>> 3, q >>> 0 < 256) {
                                    p = 3652 + (l << 1 << 2) | 0, (o = 0 | n[903]) & (l = 1 << l) ? l = 0 | n[(o = p + 8 | 0) >> 2] : (n[903] = o | l, l = p, o = p + 8 | 0), n[o >> 2] = w, n[l + 12 >> 2] = w, n[w + 8 >> 2] = l, n[w + 12 >> 2] = p;
                                    break
                                }
                                if (p = 3916 + ((l = (l = q >>> 8) ? q >>> 0 > 16777215 ? 31 : q >>> (7 + (l = 14 - ((I0 = (520192 + (l0 = l << (u0 = (l + 1048320 | 0) >>> 16 & 8)) | 0) >>> 16 & 4) | u0 | (l = (245760 + (l0 <<= I0) | 0) >>> 16 & 2)) + (l0 << l >>> 15) | 0) | 0) & 1 | l << 1 : 0) << 2) | 0, n[w + 28 >> 2] = l, n[4 + (o = w + 16 | 0) >> 2] = 0, n[o >> 2] = 0, !(O & (o = 1 << l))) {
                                    n[904] = O | o, n[p >> 2] = w, n[w + 24 >> 2] = p, n[w + 12 >> 2] = w, n[w + 8 >> 2] = w;
                                    break
                                }
                                for (o = q << (31 == (0 | l) ? 0 : 25 - (l >>> 1)), p = 0 | n[p >> 2]; ;) {
                                    if ((-8 & n[p + 4 >> 2]) == (0 | q)) {
                                        u0 = 97;
                                        break
                                    }
                                    if (!(l = 0 | n[(O = p + 16 + (o >>> 31 << 2) | 0) >> 2])) {
                                        u0 = 96;
                                        break
                                    }
                                    o <<= 1, p = l
                                }
                                if (96 == (0 | u0)) {
                                    n[O >> 2] = w, n[w + 24 >> 2] = p, n[w + 12 >> 2] = w, n[w + 8 >> 2] = w;
                                    break
                                }
                                if (97 == (0 | u0)) {
                                    n[12 + (l0 = 0 | n[(u0 = p + 8 | 0) >> 2]) >> 2] = w, n[u0 >> 2] = w, n[w + 8 >> 2] = l0, n[w + 12 >> 2] = p, n[w + 24 >> 2] = 0;
                                    break
                                }
                            } else n[j + 4 >> 2] = 3 | (l0 = q + J | 0), n[(l0 = j + l0 + 4 | 0) >> 2] = 1 | n[l0 >> 2]
                        } while (0);
                        return M = u1, 0 | j + 8
                    }
                    n0 = J
                } else n0 = J; else n0 = -1
            } while (0);
            if ((p = 0 | n[905]) >>> 0 >= n0 >>> 0) return o = 0 | n[908], (l = p - n0 | 0) >>> 0 > 15 ? (n[908] = l0 = o + n0 | 0, n[905] = l, n[l0 + 4 >> 2] = 1 | l, n[l0 + l >> 2] = l, n[o + 4 >> 2] = 3 | n0) : (n[905] = 0, n[908] = 0, n[o + 4 >> 2] = 3 | p, n[(l0 = o + p + 4 | 0) >> 2] = 1 | n[l0 >> 2]), M = u1, 0 | o + 8;
            if ((q = 0 | n[906]) >>> 0 > n0 >>> 0) return n[906] = I0 = q - n0 | 0, n[909] = u0 = (l0 = 0 | n[909]) + n0 | 0, n[u0 + 4 >> 2] = 1 | I0, n[l0 + 4 >> 2] = 3 | n0, M = u1, 0 | l0 + 8;
            if (0 | n[1021] ? o = 0 | n[1023] : (n[1023] = 4096, n[1022] = 4096, n[1024] = -1, n[1025] = -1, n[1026] = 0, n[1014] = 0, n[T0 >> 2] = o = -16 & T0 ^ 1431655768, n[1021] = o, o = 4096), j = n0 + 48 | 0, (J = (w = o + (Y = n0 + 47 | 0) | 0) & (_ = 0 - o | 0)) >>> 0 <= n0 >>> 0 || 0 | (o = 0 | n[1013]) && (T0 = (o0 = 0 | n[1011]) + J | 0) >>> 0 <= o0 >>> 0 | T0 >>> 0 > o >>> 0) return M = u1, 0;
            e:do {
                if (4 & n[1014]) l = 0, u0 = 133; else {
                    p = 0 | n[909];
                    t:do {
                        if (p) {
                            for (O = 4060; !((o = 0 | n[O >> 2]) >>> 0 <= p >>> 0 && (B0 = O + 4 | 0, (o + (0 | n[B0 >> 2]) | 0) >>> 0 > p >>> 0));) {
                                if (!(o = 0 | n[O + 8 >> 2])) {
                                    u0 = 118;
                                    break t
                                }
                                O = o
                            }
                            if ((l = w - q & _) >>> 0 < 2147483647) if ((0 | (o = 0 | fe(0 | l))) == ((0 | n[O >> 2]) + (0 | n[B0 >> 2]) | 0)) {
                                if (-1 != (0 | o)) {
                                    q = l, w = o, u0 = 135;
                                    break e
                                }
                            } else O = o, u0 = 126; else l = 0
                        } else u0 = 118
                    } while (0);
                    do {
                        if (118 == (0 | u0)) if (-1 != (0 | (p = 0 | fe(0))) && (h0 = (l = ((h0 = (S0 = 0 | n[1022]) - 1 | 0) & (l = p) ? (h0 + l & 0 - S0) - l | 0 : 0) + J | 0) + (S0 = 0 | n[1011]) | 0, l >>> 0 > n0 >>> 0 & l >>> 0 < 2147483647)) {
                            if (0 | (B0 = 0 | n[1013]) && h0 >>> 0 <= S0 >>> 0 | h0 >>> 0 > B0 >>> 0) {
                                l = 0;
                                break
                            }
                            if ((0 | (o = 0 | fe(0 | l))) == (0 | p)) {
                                q = l, w = p, u0 = 135;
                                break e
                            }
                            O = o, u0 = 126
                        } else l = 0
                    } while (0);
                    do {
                        if (126 == (0 | u0)) {
                            if (p = 0 - l | 0, !(j >>> 0 > l >>> 0 & l >>> 0 < 2147483647 & -1 != (0 | O))) {
                                if (-1 == (0 | O)) {
                                    l = 0;
                                    break
                                }
                                q = l, w = O, u0 = 135;
                                break e
                            }
                            if ((o = Y - l + (o = 0 | n[1023]) & 0 - o) >>> 0 >= 2147483647) {
                                q = l, w = O, u0 = 135;
                                break e
                            }
                            if (-1 == (0 | fe(0 | o))) {
                                fe(0 | p), l = 0;
                                break
                            }
                            q = o + l | 0, w = O, u0 = 135;
                            break e
                        }
                    } while (0);
                    n[1014] = 4 | n[1014], u0 = 133
                }
            } while (0);
            if (133 == (0 | u0) && J >>> 0 < 2147483647 && !(-1 == (0 | (I0 = 0 | fe(0 | J))) | 1 ^ (W0 = (D0 = (B0 = 0 | fe(0)) - I0 | 0) >>> 0 > (n0 + 40 | 0) >>> 0) | I0 >>> 0 < B0 >>> 0 & -1 != (0 | I0) & -1 != (0 | B0) ^ 1) && (q = W0 ? D0 : l, w = I0, u0 = 135), 135 == (0 | u0)) {
                n[1011] = l = (0 | n[1011]) + q | 0, l >>> 0 > (0 | n[1012]) >>> 0 && (n[1012] = l), Y = 0 | n[909];
                do {
                    if (Y) {
                        for (l = 4060; ;) {
                            if ((0 | w) == ((o = 0 | n[l >> 2]) + (O = 0 | n[(p = l + 4 | 0) >> 2]) | 0)) {
                                u0 = 145;
                                break
                            }
                            if (!(_ = 0 | n[l + 8 >> 2])) break;
                            l = _
                        }
                        if (145 == (0 | u0) && !(8 & n[l + 12 >> 2]) && Y >>> 0 < w >>> 0 & Y >>> 0 >= o >>> 0) {
                            n[p >> 2] = O + q, u0 = Y + (l0 = 7 & (l0 = Y + 8 | 0) ? 0 - l0 & 7 : 0) | 0, l0 = q - l0 + (0 | n[906]) | 0, n[909] = u0, n[906] = l0, n[u0 + 4 >> 2] = 1 | l0, n[u0 + l0 + 4 >> 2] = 40, n[910] = n[1025];
                            break
                        }
                        for (w >>> 0 < (0 | n[907]) >>> 0 && (n[907] = w), p = w + q | 0, l = 4060; ;) {
                            if ((0 | n[l >> 2]) == (0 | p)) {
                                u0 = 153;
                                break
                            }
                            if (!(o = 0 | n[l + 8 >> 2])) break;
                            l = o
                        }
                        if (153 == (0 | u0) && !(8 & n[l + 12 >> 2])) {
                            n[l >> 2] = w, n[(o0 = l + 4 | 0) >> 2] = (0 | n[o0 >> 2]) + q, J = (o0 = w + (7 & (o0 = w + 8 | 0) ? 0 - o0 & 7 : 0) | 0) + n0 | 0, j = (l = p + (7 & (l = p + 8 | 0) ? 0 - l & 7 : 0) | 0) - o0 - n0 | 0, n[o0 + 4 >> 2] = 3 | n0;
                            do {
                                if ((0 | l) != (0 | Y)) {
                                    if ((0 | l) == (0 | n[908])) {
                                        n[905] = l0 = (0 | n[905]) + j | 0, n[908] = J, n[J + 4 >> 2] = 1 | l0, n[J + l0 >> 2] = l0;
                                        break
                                    }
                                    if (1 == (3 & (o = 0 | n[l + 4 >> 2]))) {
                                        q = -8 & o, O = o >>> 3;
                                        e:do {
                                            if (o >>> 0 < 256) {
                                                if ((0 | (p = 0 | n[l + 12 >> 2])) == (0 | (o = 0 | n[l + 8 >> 2]))) {
                                                    n[903] = n[903] & ~(1 << O);
                                                    break
                                                }
                                                n[o + 12 >> 2] = p, n[p + 8 >> 2] = o;
                                                break
                                            }
                                            w = 0 | n[l + 24 >> 2], o = 0 | n[l + 12 >> 2];
                                            do {
                                                if ((0 | o) == (0 | l)) {
                                                    if (!(o = 0 | n[(p = 4 + (O = l + 16 | 0) | 0) >> 2])) {
                                                        if (!(o = 0 | n[O >> 2])) {
                                                            o = 0;
                                                            break
                                                        }
                                                        p = O
                                                    }
                                                    for (; ;) if (0 | (_ = 0 | n[(O = o + 20 | 0) >> 2])) o = _, p = O; else {
                                                        if (!(_ = 0 | n[(O = o + 16 | 0) >> 2])) break;
                                                        o = _, p = O
                                                    }
                                                    n[p >> 2] = 0
                                                } else n[12 + (l0 = 0 | n[l + 8 >> 2]) >> 2] = o, n[o + 8 >> 2] = l0
                                            } while (0);
                                            if (!w) break;
                                            O = 3916 + ((p = 0 | n[l + 28 >> 2]) << 2) | 0;
                                            do {
                                                if ((0 | l) == (0 | n[O >> 2])) {
                                                    if (n[O >> 2] = o, 0 | o) break;
                                                    n[904] = n[904] & ~(1 << p);
                                                    break e
                                                }
                                                if (n[w + 16 + (((0 | n[w + 16 >> 2]) != (0 | l) & 1) << 2) >> 2] = o, !o) break e
                                            } while (0);
                                            if (n[o + 24 >> 2] = w, 0 | (O = 0 | n[(p = l + 16 | 0) >> 2]) && (n[o + 16 >> 2] = O, n[O + 24 >> 2] = o), !(p = 0 | n[p + 4 >> 2])) break;
                                            n[o + 20 >> 2] = p, n[p + 24 >> 2] = o
                                        } while (0);
                                        l = l + q | 0, _ = q + j | 0
                                    } else _ = j;
                                    if (n[(l = l + 4 | 0) >> 2] = -2 & n[l >> 2], n[J + 4 >> 2] = 1 | _, n[J + _ >> 2] = _, l = _ >>> 3, _ >>> 0 < 256) {
                                        p = 3652 + (l << 1 << 2) | 0, (o = 0 | n[903]) & (l = 1 << l) ? l = 0 | n[(o = p + 8 | 0) >> 2] : (n[903] = o | l, l = p, o = p + 8 | 0), n[o >> 2] = J, n[l + 12 >> 2] = J, n[J + 8 >> 2] = l, n[J + 12 >> 2] = p;
                                        break
                                    }
                                    l = _ >>> 8;
                                    do {
                                        if (l) {
                                            if (_ >>> 0 > 16777215) {
                                                l = 31;
                                                break
                                            }
                                            l = _ >>> (7 + (l = 14 - ((I0 = (520192 + (l0 = l << (u0 = (l + 1048320 | 0) >>> 16 & 8)) | 0) >>> 16 & 4) | u0 | (l = (245760 + (l0 <<= I0) | 0) >>> 16 & 2)) + (l0 << l >>> 15) | 0) | 0) & 1 | l << 1
                                        } else l = 0
                                    } while (0);
                                    if (O = 3916 + (l << 2) | 0, n[J + 28 >> 2] = l, n[4 + (o = J + 16 | 0) >> 2] = 0, n[o >> 2] = 0, !((o = 0 | n[904]) & (p = 1 << l))) {
                                        n[904] = o | p, n[O >> 2] = J, n[J + 24 >> 2] = O, n[J + 12 >> 2] = J, n[J + 8 >> 2] = J;
                                        break
                                    }
                                    for (o = _ << (31 == (0 | l) ? 0 : 25 - (l >>> 1)), p = 0 | n[O >> 2]; ;) {
                                        if ((-8 & n[p + 4 >> 2]) == (0 | _)) {
                                            u0 = 194;
                                            break
                                        }
                                        if (!(l = 0 | n[(O = p + 16 + (o >>> 31 << 2) | 0) >> 2])) {
                                            u0 = 193;
                                            break
                                        }
                                        o <<= 1, p = l
                                    }
                                    if (193 == (0 | u0)) {
                                        n[O >> 2] = J, n[J + 24 >> 2] = p, n[J + 12 >> 2] = J, n[J + 8 >> 2] = J;
                                        break
                                    }
                                    if (194 == (0 | u0)) {
                                        n[12 + (l0 = 0 | n[(u0 = p + 8 | 0) >> 2]) >> 2] = J, n[u0 >> 2] = J, n[J + 8 >> 2] = l0, n[J + 12 >> 2] = p, n[J + 24 >> 2] = 0;
                                        break
                                    }
                                } else n[906] = l0 = (0 | n[906]) + j | 0, n[909] = J, n[J + 4 >> 2] = 1 | l0
                            } while (0);
                            return M = u1, 0 | o0 + 8
                        }
                        for (l = 4060; !((o = 0 | n[l >> 2]) >>> 0 <= Y >>> 0 && (l0 = o + (0 | n[l + 4 >> 2]) | 0, l0 >>> 0 > Y >>> 0));) l = 0 | n[l + 8 >> 2];
                        l = (o = (o = (_ = l0 + -47 | 0) + (7 & (o = _ + 8 | 0) ? 0 - o & 7 : 0) | 0) >>> 0 < (_ = Y + 16 | 0) >>> 0 ? Y : o) + 8 | 0, u0 = w + (p = 7 & (p = w + 8 | 0) ? 0 - p & 7 : 0) | 0, p = q + -40 - p | 0, n[909] = u0, n[906] = p, n[u0 + 4 >> 2] = 1 | p, n[u0 + p + 4 >> 2] = 40, n[910] = n[1025], n[(p = o + 4 | 0) >> 2] = 27, n[l >> 2] = n[1015], n[l + 4 >> 2] = n[1016], n[l + 8 >> 2] = n[1017], n[l + 12 >> 2] = n[1018], n[1015] = w, n[1016] = q, n[1018] = 0, n[1017] = l, l = o + 24 | 0;
                        do {
                            u0 = l, n[(l = l + 4 | 0) >> 2] = 7
                        } while ((u0 + 8 | 0) >>> 0 < l0 >>> 0);
                        if ((0 | o) != (0 | Y)) {
                            if (w = o - Y | 0, n[p >> 2] = -2 & n[p >> 2], n[Y + 4 >> 2] = 1 | w, n[o >> 2] = w, l = w >>> 3, w >>> 0 < 256) {
                                p = 3652 + (l << 1 << 2) | 0, (o = 0 | n[903]) & (l = 1 << l) ? l = 0 | n[(o = p + 8 | 0) >> 2] : (n[903] = o | l, l = p, o = p + 8 | 0), n[o >> 2] = Y, n[l + 12 >> 2] = Y, n[Y + 8 >> 2] = l, n[Y + 12 >> 2] = p;
                                break
                            }
                            if (O = 3916 + ((p = (l = w >>> 8) ? w >>> 0 > 16777215 ? 31 : w >>> (7 + (p = 14 - ((I0 = (520192 + (l0 = l << (u0 = (l + 1048320 | 0) >>> 16 & 8)) | 0) >>> 16 & 4) | u0 | (p = (245760 + (l0 <<= I0) | 0) >>> 16 & 2)) + (l0 << p >>> 15) | 0) | 0) & 1 | p << 1 : 0) << 2) | 0, n[Y + 28 >> 2] = p, n[Y + 20 >> 2] = 0, n[_ >> 2] = 0, !((l = 0 | n[904]) & (o = 1 << p))) {
                                n[904] = l | o, n[O >> 2] = Y, n[Y + 24 >> 2] = O, n[Y + 12 >> 2] = Y, n[Y + 8 >> 2] = Y;
                                break
                            }
                            for (o = w << (31 == (0 | p) ? 0 : 25 - (p >>> 1)), p = 0 | n[O >> 2]; ;) {
                                if ((-8 & n[p + 4 >> 2]) == (0 | w)) {
                                    u0 = 216;
                                    break
                                }
                                if (!(l = 0 | n[(O = p + 16 + (o >>> 31 << 2) | 0) >> 2])) {
                                    u0 = 215;
                                    break
                                }
                                o <<= 1, p = l
                            }
                            if (215 == (0 | u0)) {
                                n[O >> 2] = Y, n[Y + 24 >> 2] = p, n[Y + 12 >> 2] = Y, n[Y + 8 >> 2] = Y;
                                break
                            }
                            if (216 == (0 | u0)) {
                                n[12 + (l0 = 0 | n[(u0 = p + 8 | 0) >> 2]) >> 2] = Y, n[u0 >> 2] = Y, n[Y + 8 >> 2] = l0, n[Y + 12 >> 2] = p, n[Y + 24 >> 2] = 0;
                                break
                            }
                        }
                    } else {
                        !(0 | (l0 = 0 | n[907])) | w >>> 0 < l0 >>> 0 && (n[907] = w), n[1015] = w, n[1016] = q, n[1018] = 0, n[912] = n[1021], n[911] = -1, l = 0;
                        do {
                            n[12 + (l0 = 3652 + (l << 1 << 2) | 0) >> 2] = l0, n[l0 + 8 >> 2] = l0, l = l + 1 | 0
                        } while (32 != (0 | l));
                        u0 = w + (l0 = 7 & (l0 = w + 8 | 0) ? 0 - l0 & 7 : 0) | 0, l0 = q + -40 - l0 | 0, n[909] = u0, n[906] = l0, n[u0 + 4 >> 2] = 1 | l0, n[u0 + l0 + 4 >> 2] = 40, n[910] = n[1025]
                    }
                } while (0);
                if ((l = 0 | n[906]) >>> 0 > n0 >>> 0) return n[906] = I0 = l - n0 | 0, n[909] = u0 = (l0 = 0 | n[909]) + n0 | 0, n[u0 + 4 >> 2] = 1 | I0, n[l0 + 4 >> 2] = 3 | n0, M = u1, 0 | l0 + 8
            }
            return n[82] = 12, M = u1, 0
        }

        function Y1(o) {
            var l = 0, p = 0, O = 0, _ = 0, w = 0, q = 0, j = 0, Y = 0;
            if (o |= 0) {
                _ = 0 | n[907], Y = (p = o + -8 | 0) + (l = -8 & (o = 0 | n[o + -4 >> 2])) | 0;
                do {
                    if (1 & o) j = p, q = p; else {
                        if (O = 0 | n[p >> 2], !(3 & o) || (w = O + l | 0, (q = p + (0 - O) | 0) >>> 0 < _ >>> 0)) return;
                        if ((0 | q) == (0 | n[908])) {
                            if (3 & ~(l = 0 | n[(o = Y + 4 | 0) >> 2])) {
                                j = q, l = w;
                                break
                            }
                            return n[905] = w, n[o >> 2] = -2 & l, n[q + 4 >> 2] = 1 | w, void (n[q + w >> 2] = w)
                        }
                        if (p = O >>> 3, O >>> 0 < 256) {
                            if ((0 | (l = 0 | n[q + 12 >> 2])) == (0 | (o = 0 | n[q + 8 >> 2]))) {
                                n[903] = n[903] & ~(1 << p), j = q, l = w;
                                break
                            }
                            n[o + 12 >> 2] = l, n[l + 8 >> 2] = o, j = q, l = w;
                            break
                        }
                        _ = 0 | n[q + 24 >> 2], o = 0 | n[q + 12 >> 2];
                        do {
                            if ((0 | o) == (0 | q)) {
                                if (!(o = 0 | n[(l = 4 + (p = q + 16 | 0) | 0) >> 2])) {
                                    if (!(o = 0 | n[p >> 2])) {
                                        o = 0;
                                        break
                                    }
                                    l = p
                                }
                                for (; ;) if (0 | (O = 0 | n[(p = o + 20 | 0) >> 2])) o = O, l = p; else {
                                    if (!(O = 0 | n[(p = o + 16 | 0) >> 2])) break;
                                    o = O, l = p
                                }
                                n[l >> 2] = 0
                            } else n[12 + (j = 0 | n[q + 8 >> 2]) >> 2] = o, n[o + 8 >> 2] = j
                        } while (0);
                        if (_) {
                            if ((0 | q) == (0 | n[(p = 3916 + ((l = 0 | n[q + 28 >> 2]) << 2) | 0) >> 2])) {
                                if (n[p >> 2] = o, !o) {
                                    n[904] = n[904] & ~(1 << l), j = q, l = w;
                                    break
                                }
                            } else if (n[_ + 16 + (((0 | n[_ + 16 >> 2]) != (0 | q) & 1) << 2) >> 2] = o, !o) {
                                j = q, l = w;
                                break
                            }
                            n[o + 24 >> 2] = _, 0 | (p = 0 | n[(l = q + 16 | 0) >> 2]) && (n[o + 16 >> 2] = p, n[p + 24 >> 2] = o), (l = 0 | n[l + 4 >> 2]) ? (n[o + 20 >> 2] = l, n[l + 24 >> 2] = o, j = q, l = w) : (j = q, l = w)
                        } else j = q, l = w
                    }
                } while (0);
                if (!(q >>> 0 >= Y >>> 0) && 1 & (O = 0 | n[(o = Y + 4 | 0) >> 2])) {
                    if (2 & O) n[o >> 2] = -2 & O, n[j + 4 >> 2] = 1 | l, n[q + l >> 2] = l, _ = l; else {
                        if (o = 0 | n[908], (0 | Y) == (0 | n[909])) {
                            if (n[906] = Y = (0 | n[906]) + l | 0, n[909] = j, n[j + 4 >> 2] = 1 | Y, (0 | j) != (0 | o)) return;
                            return n[908] = 0, void (n[905] = 0)
                        }
                        if ((0 | Y) == (0 | o)) return n[905] = Y = (0 | n[905]) + l | 0, n[908] = q, n[j + 4 >> 2] = 1 | Y, void (n[q + Y >> 2] = Y);
                        _ = (-8 & O) + l | 0, p = O >>> 3;
                        do {
                            if (O >>> 0 < 256) {
                                if ((0 | (o = 0 | n[Y + 12 >> 2])) == (0 | (l = 0 | n[Y + 8 >> 2]))) {
                                    n[903] = n[903] & ~(1 << p);
                                    break
                                }
                                n[l + 12 >> 2] = o, n[o + 8 >> 2] = l;
                                break
                            }
                            w = 0 | n[Y + 24 >> 2], o = 0 | n[Y + 12 >> 2];
                            do {
                                if ((0 | o) == (0 | Y)) {
                                    if (!(o = 0 | n[(l = 4 + (p = Y + 16 | 0) | 0) >> 2])) {
                                        if (!(o = 0 | n[p >> 2])) {
                                            p = 0;
                                            break
                                        }
                                        l = p
                                    }
                                    for (; ;) if (0 | (O = 0 | n[(p = o + 20 | 0) >> 2])) o = O, l = p; else {
                                        if (!(O = 0 | n[(p = o + 16 | 0) >> 2])) break;
                                        o = O, l = p
                                    }
                                    n[l >> 2] = 0, p = o
                                } else n[12 + (p = 0 | n[Y + 8 >> 2]) >> 2] = o, n[o + 8 >> 2] = p, p = o
                            } while (0);
                            if (0 | w) {
                                if ((0 | Y) == (0 | n[(l = 3916 + ((o = 0 | n[Y + 28 >> 2]) << 2) | 0) >> 2])) {
                                    if (n[l >> 2] = p, !p) {
                                        n[904] = n[904] & ~(1 << o);
                                        break
                                    }
                                } else if (n[w + 16 + (((0 | n[w + 16 >> 2]) != (0 | Y) & 1) << 2) >> 2] = p, !p) break;
                                n[p + 24 >> 2] = w, 0 | (l = 0 | n[(o = Y + 16 | 0) >> 2]) && (n[p + 16 >> 2] = l, n[l + 24 >> 2] = p), 0 | (o = 0 | n[o + 4 >> 2]) && (n[p + 20 >> 2] = o, n[o + 24 >> 2] = p)
                            }
                        } while (0);
                        if (n[j + 4 >> 2] = 1 | _, n[q + _ >> 2] = _, (0 | j) == (0 | n[908])) return void (n[905] = _)
                    }
                    if (o = _ >>> 3, _ >>> 0 < 256) return p = 3652 + (o << 1 << 2) | 0, (l = 0 | n[903]) & (o = 1 << o) ? o = 0 | n[(l = p + 8 | 0) >> 2] : (n[903] = l | o, o = p, l = p + 8 | 0), n[l >> 2] = j, n[o + 12 >> 2] = j, n[j + 8 >> 2] = o, void (n[j + 12 >> 2] = p);
                    O = 3916 + ((o = (o = _ >>> 8) ? _ >>> 0 > 16777215 ? 31 : _ >>> (7 + (o = 14 - ((w = (520192 + (Y = o << (q = (o + 1048320 | 0) >>> 16 & 8)) | 0) >>> 16 & 4) | q | (o = (245760 + (Y <<= w) | 0) >>> 16 & 2)) + (Y << o >>> 15) | 0) | 0) & 1 | o << 1 : 0) << 2) | 0, n[j + 28 >> 2] = o, n[j + 20 >> 2] = 0, n[j + 16 >> 2] = 0, l = 0 | n[904], p = 1 << o;
                    do {
                        if (l & p) {
                            for (l = _ << (31 == (0 | o) ? 0 : 25 - (o >>> 1)), p = 0 | n[O >> 2]; ;) {
                                if ((-8 & n[p + 4 >> 2]) == (0 | _)) {
                                    o = 73;
                                    break
                                }
                                if (!(o = 0 | n[(O = p + 16 + (l >>> 31 << 2) | 0) >> 2])) {
                                    o = 72;
                                    break
                                }
                                l <<= 1, p = o
                            }
                            if (72 == (0 | o)) {
                                n[O >> 2] = j, n[j + 24 >> 2] = p, n[j + 12 >> 2] = j, n[j + 8 >> 2] = j;
                                break
                            }
                            if (73 == (0 | o)) {
                                n[12 + (Y = 0 | n[(q = p + 8 | 0) >> 2]) >> 2] = j, n[q >> 2] = j, n[j + 8 >> 2] = Y, n[j + 12 >> 2] = p, n[j + 24 >> 2] = 0;
                                break
                            }
                        } else n[904] = l | p, n[O >> 2] = j, n[j + 24 >> 2] = O, n[j + 12 >> 2] = j, n[j + 8 >> 2] = j
                    } while (0);
                    if (n[911] = Y = (0 | n[911]) - 1 | 0, Y) return;
                    for (o = 4068; o = 0 | n[o >> 2];) o = o + 8 | 0;
                    n[911] = -1
                }
            }
        }

        function de(o, l) {
            l |= 0;
            var p = 0, O = 0;
            return (o |= 0) ? l >>> 0 > 4294967231 ? (n[82] = 12, 0 | (l = 0)) : (p = 0 | function Q0(o, l) {
                l |= 0;
                var j, p = 0, O = 0, _ = 0, w = 0, q = 0, Y = 0, J = 0, o0 = 0, n0 = 0;
                if (j = (o |= 0) + (p = -8 & (o0 = 0 | n[(n0 = o + 4 | 0) >> 2])) | 0, !(3 & o0)) return l >>> 0 < 256 ? 0 | (o = 0) : (p >>> 0 >= (l + 4 | 0) >>> 0 && (p - l | 0) >>> 0 <= n[1023] << 1 >>> 0 || (o = 0), 0 | o);
                if (p >>> 0 >= l >>> 0) return (p = p - l | 0) >>> 0 <= 15 || (J = o + l | 0, n[n0 >> 2] = 1 & o0 | l | 2, n[J + 4 >> 2] = 3 | p, n[(n0 = J + p + 4 | 0) >> 2] = 1 | n[n0 >> 2], ee(J, p)), 0 | o;
                if ((0 | j) == (0 | n[909])) return p = (J = (0 | n[906]) + p | 0) - l | 0, O = o + l | 0, J >>> 0 <= l >>> 0 ? 0 | (o = 0) : (n[n0 >> 2] = 1 & o0 | l | 2, n[O + 4 >> 2] = 1 | p, n[909] = O, n[906] = p, 0 | o);
                if ((0 | j) == (0 | n[908])) return (_ = (0 | n[905]) + p | 0) >>> 0 < l >>> 0 ? 0 | (o = 0) : (O = 1 & o0, (p = _ - l | 0) >>> 0 > 15 ? (J = (o0 = o + l | 0) + p | 0, n[n0 >> 2] = O | l | 2, n[o0 + 4 >> 2] = 1 | p, n[J >> 2] = p, n[(O = J + 4 | 0) >> 2] = -2 & n[O >> 2], O = o0) : (n[n0 >> 2] = O | _ | 2, n[(O = o + _ + 4 | 0) >> 2] = 1 | n[O >> 2], O = 0, p = 0), n[905] = p, n[908] = O, 0 | o);
                if (2 & (O = 0 | n[j + 4 >> 2]) || (Y = (-8 & O) + p | 0) >>> 0 < l >>> 0) return 0 | (o = 0);
                J = Y - l | 0, _ = O >>> 3;
                do {
                    if (O >>> 0 < 256) {
                        if ((0 | (p = 0 | n[j + 12 >> 2])) == (0 | (O = 0 | n[j + 8 >> 2]))) {
                            n[903] = n[903] & ~(1 << _);
                            break
                        }
                        n[O + 12 >> 2] = p, n[p + 8 >> 2] = O;
                        break
                    }
                    q = 0 | n[j + 24 >> 2], p = 0 | n[j + 12 >> 2];
                    do {
                        if ((0 | p) == (0 | j)) {
                            if (p = 0 | n[(O = 4 + (_ = j + 16 | 0) | 0) >> 2]) w = O; else {
                                if (!(p = 0 | n[_ >> 2])) {
                                    _ = 0;
                                    break
                                }
                                w = _
                            }
                            for (; ;) if (0 | (O = 0 | n[(_ = p + 20 | 0) >> 2])) p = O, w = _; else {
                                if (!(_ = 0 | n[(O = p + 16 | 0) >> 2])) break;
                                p = _, w = O
                            }
                            n[w >> 2] = 0, _ = p
                        } else n[12 + (_ = 0 | n[j + 8 >> 2]) >> 2] = p, n[p + 8 >> 2] = _, _ = p
                    } while (0);
                    if (0 | q) {
                        if ((0 | j) == (0 | n[(O = 3916 + ((p = 0 | n[j + 28 >> 2]) << 2) | 0) >> 2])) {
                            if (n[O >> 2] = _, !_) {
                                n[904] = n[904] & ~(1 << p);
                                break
                            }
                        } else if (n[q + 16 + (((0 | n[q + 16 >> 2]) != (0 | j) & 1) << 2) >> 2] = _, !_) break;
                        n[_ + 24 >> 2] = q, 0 | (O = 0 | n[(p = j + 16 | 0) >> 2]) && (n[_ + 16 >> 2] = O, n[O + 24 >> 2] = _), 0 | (p = 0 | n[p + 4 >> 2]) && (n[_ + 20 >> 2] = p, n[p + 24 >> 2] = _)
                    }
                } while (0);
                return p = 1 & o0, J >>> 0 < 16 ? (n[n0 >> 2] = Y | p | 2, n[(n0 = o + Y + 4 | 0) >> 2] = 1 | n[n0 >> 2], 0 | o) : (o0 = o + l | 0, n[n0 >> 2] = p | l | 2, n[o0 + 4 >> 2] = 3 | J, n[(n0 = o0 + J + 4 | 0) >> 2] = 1 | n[n0 >> 2], ee(o0, J), 0 | o)
            }(o + -8 | 0, l >>> 0 < 11 ? 16 : l + 11 & -8), 0 | p ? 0 | (l = p + 8 | 0) : (p = 0 | R1(l)) ? (j1(0 | p, 0 | o, 0 | ((O = (-8 & (O = 0 | n[o + -4 >> 2])) - (3 & O ? 4 : 8) | 0) >>> 0 < l >>> 0 ? O : l)), Y1(o), 0 | (l = p)) : 0 | (l = 0)) : 0 | (l = 0 | R1(l))
        }

        function ee(o, l) {
            var p = 0, O = 0, _ = 0, w = 0, q = 0, j = 0, Y = 0;
            Y = (o |= 0) + (l |= 0) | 0, p = 0 | n[o + 4 >> 2];
            do {
                if (1 & p) j = o, p = l; else {
                    if (!(3 & p)) return;
                    if (q = (O = 0 | n[o >> 2]) + l | 0, (0 | (w = o + (0 - O) | 0)) == (0 | n[908])) {
                        if (3 & ~(p = 0 | n[(o = Y + 4 | 0) >> 2])) {
                            j = w, p = q;
                            break
                        }
                        return n[905] = q, n[o >> 2] = -2 & p, n[w + 4 >> 2] = 1 | q, void (n[w + q >> 2] = q)
                    }
                    if (l = O >>> 3, O >>> 0 < 256) {
                        if ((0 | (p = 0 | n[w + 12 >> 2])) == (0 | (o = 0 | n[w + 8 >> 2]))) {
                            n[903] = n[903] & ~(1 << l), j = w, p = q;
                            break
                        }
                        n[o + 12 >> 2] = p, n[p + 8 >> 2] = o, j = w, p = q;
                        break
                    }
                    _ = 0 | n[w + 24 >> 2], o = 0 | n[w + 12 >> 2];
                    do {
                        if ((0 | o) == (0 | w)) {
                            if (!(o = 0 | n[(p = 4 + (l = w + 16 | 0) | 0) >> 2])) {
                                if (!(o = 0 | n[l >> 2])) {
                                    o = 0;
                                    break
                                }
                                p = l
                            }
                            for (; ;) if (0 | (O = 0 | n[(l = o + 20 | 0) >> 2])) o = O, p = l; else {
                                if (!(O = 0 | n[(l = o + 16 | 0) >> 2])) break;
                                o = O, p = l
                            }
                            n[p >> 2] = 0
                        } else n[12 + (j = 0 | n[w + 8 >> 2]) >> 2] = o, n[o + 8 >> 2] = j
                    } while (0);
                    if (_) {
                        if ((0 | w) == (0 | n[(l = 3916 + ((p = 0 | n[w + 28 >> 2]) << 2) | 0) >> 2])) {
                            if (n[l >> 2] = o, !o) {
                                n[904] = n[904] & ~(1 << p), j = w, p = q;
                                break
                            }
                        } else if (n[_ + 16 + (((0 | n[_ + 16 >> 2]) != (0 | w) & 1) << 2) >> 2] = o, !o) {
                            j = w, p = q;
                            break
                        }
                        n[o + 24 >> 2] = _, 0 | (l = 0 | n[(p = w + 16 | 0) >> 2]) && (n[o + 16 >> 2] = l, n[l + 24 >> 2] = o), (p = 0 | n[p + 4 >> 2]) ? (n[o + 20 >> 2] = p, n[p + 24 >> 2] = o, j = w, p = q) : (j = w, p = q)
                    } else j = w, p = q
                }
            } while (0);
            if (2 & (O = 0 | n[(o = Y + 4 | 0) >> 2])) n[o >> 2] = -2 & O, n[j + 4 >> 2] = 1 | p, n[j + p >> 2] = p; else {
                if (o = 0 | n[908], (0 | Y) == (0 | n[909])) {
                    if (n[906] = Y = (0 | n[906]) + p | 0, n[909] = j, n[j + 4 >> 2] = 1 | Y, (0 | j) != (0 | o)) return;
                    return n[908] = 0, void (n[905] = 0)
                }
                if ((0 | Y) == (0 | o)) return n[905] = Y = (0 | n[905]) + p | 0, n[908] = j, n[j + 4 >> 2] = 1 | Y, void (n[j + Y >> 2] = Y);
                w = (-8 & O) + p | 0, l = O >>> 3;
                do {
                    if (O >>> 0 < 256) {
                        if ((0 | (o = 0 | n[Y + 12 >> 2])) == (0 | (p = 0 | n[Y + 8 >> 2]))) {
                            n[903] = n[903] & ~(1 << l);
                            break
                        }
                        n[p + 12 >> 2] = o, n[o + 8 >> 2] = p;
                        break
                    }
                    _ = 0 | n[Y + 24 >> 2], o = 0 | n[Y + 12 >> 2];
                    do {
                        if ((0 | o) == (0 | Y)) {
                            if (!(o = 0 | n[(p = 4 + (l = Y + 16 | 0) | 0) >> 2])) {
                                if (!(o = 0 | n[l >> 2])) {
                                    l = 0;
                                    break
                                }
                                p = l
                            }
                            for (; ;) if (0 | (O = 0 | n[(l = o + 20 | 0) >> 2])) o = O, p = l; else {
                                if (!(O = 0 | n[(l = o + 16 | 0) >> 2])) break;
                                o = O, p = l
                            }
                            n[p >> 2] = 0, l = o
                        } else n[12 + (l = 0 | n[Y + 8 >> 2]) >> 2] = o, n[o + 8 >> 2] = l, l = o
                    } while (0);
                    if (0 | _) {
                        if ((0 | Y) == (0 | n[(p = 3916 + ((o = 0 | n[Y + 28 >> 2]) << 2) | 0) >> 2])) {
                            if (n[p >> 2] = l, !l) {
                                n[904] = n[904] & ~(1 << o);
                                break
                            }
                        } else if (n[_ + 16 + (((0 | n[_ + 16 >> 2]) != (0 | Y) & 1) << 2) >> 2] = l, !l) break;
                        n[l + 24 >> 2] = _, 0 | (p = 0 | n[(o = Y + 16 | 0) >> 2]) && (n[l + 16 >> 2] = p, n[p + 24 >> 2] = l), 0 | (o = 0 | n[o + 4 >> 2]) && (n[l + 20 >> 2] = o, n[o + 24 >> 2] = l)
                    }
                } while (0);
                if (n[j + 4 >> 2] = 1 | w, n[j + w >> 2] = w, (0 | j) == (0 | n[908])) return void (n[905] = w);
                p = w
            }
            if (o = p >>> 3, p >>> 0 < 256) return l = 3652 + (o << 1 << 2) | 0, (p = 0 | n[903]) & (o = 1 << o) ? o = 0 | n[(p = l + 8 | 0) >> 2] : (n[903] = p | o, o = l, p = l + 8 | 0), n[p >> 2] = j, n[o + 12 >> 2] = j, n[j + 8 >> 2] = o, void (n[j + 12 >> 2] = l);
            if (_ = 3916 + ((o = (o = p >>> 8) ? p >>> 0 > 16777215 ? 31 : p >>> (7 + (o = 14 - ((w = (520192 + (Y = o << (q = (o + 1048320 | 0) >>> 16 & 8)) | 0) >>> 16 & 4) | q | (o = (245760 + (Y <<= w) | 0) >>> 16 & 2)) + (Y << o >>> 15) | 0) | 0) & 1 | o << 1 : 0) << 2) | 0, n[j + 28 >> 2] = o, n[j + 20 >> 2] = 0, n[j + 16 >> 2] = 0, !((l = 0 | n[904]) & (O = 1 << o))) return n[904] = l | O, n[_ >> 2] = j, n[j + 24 >> 2] = _, n[j + 12 >> 2] = j, void (n[j + 8 >> 2] = j);
            for (l = p << (31 == (0 | o) ? 0 : 25 - (o >>> 1)), O = 0 | n[_ >> 2]; ;) {
                if ((-8 & n[O + 4 >> 2]) == (0 | p)) {
                    o = 69;
                    break
                }
                if (!(o = 0 | n[(_ = O + 16 + (l >>> 31 << 2) | 0) >> 2])) {
                    o = 68;
                    break
                }
                l <<= 1, O = o
            }
            return 68 == (0 | o) ? (n[_ >> 2] = j, n[j + 24 >> 2] = O, n[j + 12 >> 2] = j, void (n[j + 8 >> 2] = j)) : 69 == (0 | o) ? (n[12 + (Y = 0 | n[(q = O + 8 | 0) >> 2]) >> 2] = j, n[q >> 2] = j, n[j + 8 >> 2] = Y, n[j + 12 >> 2] = O, void (n[j + 24 >> 2] = 0)) : void 0
        }

        function ve(o, l, p) {
            l |= 0, p |= 0;
            var q, j, Y, J, n0, O = 0, _ = 0, w = 0, o0 = 0, T0 = 0, S0 = 0;
            n0 = M, M = M + 48 | 0, J = n0 + 16 | 0, w = n0, n[(_ = n0 + 32 | 0) >> 2] = O = 0 | n[(j = 28 + (o |= 0) | 0) >> 2], n[_ + 4 >> 2] = O = (0 | n[(Y = o + 20 | 0) >> 2]) - O | 0, n[_ + 8 >> 2] = l, n[_ + 12 >> 2] = p, O = O + p | 0, n[w >> 2] = n[(q = o + 60 | 0) >> 2], n[w + 4 >> 2] = _, n[w + 8 >> 2] = 2, w = 0 | Te(0 | V(146, 0 | w));
            e:do {
                if ((0 | O) != (0 | w)) {
                    for (l = 2; !((0 | w) < 0);) if (O = O - w | 0, l = ((T0 = w >>> 0 > (S0 = 0 | n[_ + 4 >> 2]) >>> 0) << 31 >> 31) + l | 0, n[(_ = T0 ? _ + 8 | 0 : _) >> 2] = (0 | n[_ >> 2]) + (S0 = w - (T0 ? S0 : 0) | 0), n[(T0 = _ + 4 | 0) >> 2] = (0 | n[T0 >> 2]) - S0, n[J >> 2] = n[q >> 2], n[J + 4 >> 2] = _, n[J + 8 >> 2] = l, (0 | O) == (0 | (w = 0 | Te(0 | V(146, 0 | J))))) {
                        o0 = 3;
                        break e
                    }
                    n[o + 16 >> 2] = 0, n[j >> 2] = 0, n[Y >> 2] = 0, n[o >> 2] = 32 | n[o >> 2], p = 2 == (0 | l) ? 0 : p - (0 | n[_ + 4 >> 2]) | 0
                } else o0 = 3
            } while (0);
            return 3 == (0 | o0) && (n[o + 16 >> 2] = (S0 = 0 | n[o + 44 >> 2]) + (0 | n[o + 48 >> 2]), n[j >> 2] = S0, n[Y >> 2] = S0), M = n0, 0 | p
        }

        function Te(o) {
            return (o |= 0) >>> 0 > 4294963200 && (n[82] = 0 - o, o = -1), 0 | o
        }

        function L1() {
            return 328
        }

        function Ne(o, l) {
            var p, O, _;
            n[104 + (o |= 0) >> 2] = l |= 0, n[o + 108 >> 2] = _ = (p = 0 | n[o + 8 >> 2]) - (O = 0 | n[o + 4 >> 2]) | 0, n[o + 100 >> 2] = !!(0 | l) & (0 | _) > (0 | l) ? O + l | 0 : p
        }

        function V1(o) {
            var l = 0, p = 0, O = 0, _ = 0, w = 0, q = 0, j = 0;
            return 0 | (q = 0 | n[(p = 104 + (o |= 0) | 0) >> 2]) && (0 | n[o + 108 >> 2]) >= (0 | q) ? j = 4 : (l = 0 | function I1(o) {
                var l, p;
                return p = M, M = M + 16 | 0, l = p, o = 0 | function ne(o) {
                    var l = 0, p = 0;
                    return s[0 | (l = (o |= 0) + 74 | 0)] = (p = 0 | s[0 | l]) + 255 | p, (0 | n[(l = o + 20 | 0) >> 2]) >>> 0 > (0 | n[(p = o + 28 | 0) >> 2]) >>> 0 && ue[7 & n[o + 36 >> 2]](o, 0, 0), n[o + 16 >> 2] = 0, n[p >> 2] = 0, n[l >> 2] = 0, 4 & (l = 0 | n[o >> 2]) ? (n[o >> 2] = 32 | l, l = -1) : (n[o + 8 >> 2] = p = (0 | n[o + 44 >> 2]) + (0 | n[o + 48 >> 2]) | 0, n[o + 4 >> 2] = p, l = l << 27 >> 31), 0 | l
                }(o |= 0) || 1 != (0 | ue[7 & n[o + 32 >> 2]](o, l, 1)) ? -1 : 0 | m[0 | l], M = p, 0 | o
            }(o), (0 | l) >= 0 ? (O = 0 | n[p >> 2], p = o + 8 | 0, O ? (q = w = 0 | n[p >> 2], (w - (p = 0 | n[o + 4 >> 2]) | 0) < (0 | (O = O - (0 | n[(_ = o + 108 | 0) >> 2]) | 0)) ? (w = q, O = q) : (w = p + (O + -1) | 0, O = q)) : (_ = o + 108 | 0, w = O = 0 | n[p >> 2], p = 0 | n[o + 4 >> 2]), n[o + 100 >> 2] = w, 0 | O && (n[_ >> 2] = O + 1 - p + (0 | n[_ >> 2])), (0 | m[0 | (p = p + -1 | 0)]) != (0 | l) && (s[0 | p] = l)) : j = 4), 4 == (0 | j) && (n[o + 100 >> 2] = 0, l = -1), 0 | l
        }

        function Ot(o) {
            return 1 & (32 == (0 | (o |= 0)) | (o + -9 | 0) >>> 0 < 5)
        }

        function w1(o, l) {
            var p = 0, O = 0;
            if (O = 0 | s[0 | (l |= 0)], (p = 0 | s[0 | (o |= 0)]) << 24 >> 24 && p << 24 >> 24 == O << 24 >> 24) {
                do {
                    p = 0 | s[0 | (o = o + 1 | 0)], O = 0 | s[0 | (l = l + 1 | 0)]
                } while (p << 24 >> 24 && p << 24 >> 24 == O << 24 >> 24);
                o = O
            } else o = O;
            return (255 & p) - (255 & o) | 0
        }

        function Q1(o, l, p) {
            o |= 0, l |= 0;
            var O = 0, _ = 0, w = 0, q = 0;
            if (p |= 0) {
                O = 255 & (q = 0 | s[0 | o]), _ = 255 & (w = 0 | s[0 | l]);
                e:do {
                    if (q << 24 >> 24) do {
                        if (!(q << 24 >> 24 == w << 24 >> 24 & !!(0 | (p = p + -1 | 0)) & !!(w << 24 >> 24))) break e;
                        O = 255 & (q = 0 | s[0 | (o = o + 1 | 0)]), _ = 255 & (w = 0 | s[0 | (l = l + 1 | 0)])
                    } while (q << 24 >> 24)
                } while (0);
                O = O - _ | 0
            } else O = 0;
            return 0 | O
        }

        function Ve(o, l, p, O, _) {
            o |= 0, p |= 0, O |= 0, _ |= 0;
            var I0, u0, l0, B1, M1, F0, o1, O1, r1, w = 0, q = 0, j = 0, Y = 0, J = 0, o0 = 0, n0 = 0, T0 = 0, S0 = 0,
                h0 = 0, B0 = 0, D0 = 0, W0 = 0, u1 = 0;
            r1 = M, M = M + 64 | 0, F0 = r1, u1 = r1 + 24 | 0, o1 = r1 + 8 | 0, O1 = r1 + 20 | 0, n[(M1 = r1 + 16 | 0) >> 2] = l |= 0, I0 = !!(0 | o), l0 = u0 = u1 + 40 | 0, u1 = u1 + 39 | 0, B1 = o1 + 4 | 0, q = 0, w = 0, o0 = 0;
            e:for (; ;) {
                do {
                    if ((0 | w) > -1) {
                        if ((0 | q) > (2147483647 - w | 0)) {
                            n[82] = 75, w = -1;
                            break
                        }
                        w = q + w | 0;
                        break
                    }
                } while (0);
                if (!((q = 0 | s[0 | l]) << 24 >> 24)) {
                    W0 = 87;
                    break
                }
                j = l;
                t:for (; ;) {
                    switch (q << 24 >> 24) {
                        case 37:
                            q = j, W0 = 9;
                            break t;
                        case 0:
                            q = j;
                            break t
                    }
                    n[M1 >> 2] = D0 = j + 1 | 0, q = 0 | s[0 | D0], j = D0
                }
                t:do {
                    if (9 == (0 | W0)) for (; ;) {
                        if (W0 = 0, 37 != (0 | s[j + 1 | 0])) break t;
                        if (q = q + 1 | 0, n[M1 >> 2] = j = j + 2 | 0, 37 != (0 | s[0 | j])) break;
                        W0 = 9
                    }
                } while (0);
                if (q = q - l | 0, I0 && $0(o, l, q), 0 | q) l = j; else {
                    (q = (0 | s[0 | (Y = j + 1 | 0)]) - 48 | 0) >>> 0 < 10 ? (B0 = (D0 = 36 == (0 | s[j + 2 | 0])) ? q : -1, o0 = D0 ? 1 : o0, Y = D0 ? j + 3 | 0 : Y) : B0 = -1, n[M1 >> 2] = Y, j = ((q = 0 | s[0 | Y]) << 24 >> 24) - 32 | 0;
                    t:do {
                        if (j >>> 0 < 32) for (J = 0, n0 = q; ;) {
                            if (!(75913 & (q = 1 << j))) {
                                q = n0;
                                break t
                            }
                            if (J |= q, n[M1 >> 2] = Y = Y + 1 | 0, (j = ((q = 0 | s[0 | Y]) << 24 >> 24) - 32 | 0) >>> 0 >= 32) break;
                            n0 = q
                        } else J = 0
                    } while (0);
                    if (q << 24 >> 24 == 42) {
                        if ((q = (0 | s[0 | (j = Y + 1 | 0)]) - 48 | 0) >>> 0 < 10 && 36 == (0 | s[Y + 2 | 0])) n[_ + (q << 2) >> 2] = 10, q = 0 | n[O + ((0 | s[0 | j]) - 48 << 3) >> 2], o0 = 1, Y = Y + 3 | 0; else {
                            if (0 | o0) {
                                w = -1;
                                break
                            }
                            I0 ? (q = 0 | n[(o0 = 3 + (0 | n[p >> 2]) & -4) >> 2], n[p >> 2] = o0 + 4, o0 = 0, Y = j) : (q = 0, o0 = 0, Y = j)
                        }
                        n[M1 >> 2] = Y, q = (D0 = (0 | q) < 0) ? 0 - q | 0 : q, J = D0 ? 8192 | J : J
                    } else {
                        if ((0 | (q = 0 | _e(M1))) < 0) {
                            w = -1;
                            break
                        }
                        Y = 0 | n[M1 >> 2]
                    }
                    do {
                        if (46 == (0 | s[0 | Y])) {
                            if (42 != (0 | s[Y + 1 | 0])) {
                                n[M1 >> 2] = Y + 1, j = 0 | _e(M1), Y = 0 | n[M1 >> 2];
                                break
                            }
                            if ((j = (0 | s[0 | (n0 = Y + 2 | 0)]) - 48 | 0) >>> 0 < 10 && 36 == (0 | s[Y + 3 | 0])) {
                                n[_ + (j << 2) >> 2] = 10, j = 0 | n[O + ((0 | s[0 | n0]) - 48 << 3) >> 2], n[M1 >> 2] = Y = Y + 4 | 0;
                                break
                            }
                            if (0 | o0) {
                                w = -1;
                                break e
                            }
                            I0 ? (j = 0 | n[(D0 = 3 + (0 | n[p >> 2]) & -4) >> 2], n[p >> 2] = D0 + 4) : j = 0, n[M1 >> 2] = n0, Y = n0
                        } else j = -1
                    } while (0);
                    for (h0 = 0; ;) {
                        if (((0 | s[0 | Y]) - 65 | 0) >>> 0 > 57) {
                            w = -1;
                            break e
                        }
                        if (n[M1 >> 2] = D0 = Y + 1 | 0, !(((T0 = 255 & (n0 = 0 | s[(0 | s[0 | Y]) - 65 + (1175 + (58 * h0 | 0)) | 0])) - 1 | 0) >>> 0 < 8)) break;
                        h0 = T0, Y = D0
                    }
                    if (!(n0 << 24 >> 24)) {
                        w = -1;
                        break
                    }
                    S0 = (0 | B0) > -1;
                    do {
                        if (n0 << 24 >> 24 == 19) {
                            if (S0) {
                                w = -1;
                                break e
                            }
                            W0 = 49
                        } else {
                            if (S0) {
                                n[_ + (B0 << 2) >> 2] = T0, B0 = 0 | n[4 + (S0 = O + (B0 << 3) | 0) >> 2], n[(W0 = F0) >> 2] = n[S0 >> 2], n[W0 + 4 >> 2] = B0, W0 = 49;
                                break
                            }
                            if (!I0) {
                                w = 0;
                                break e
                            }
                            it(F0, T0, p)
                        }
                    } while (0);
                    if (49 != (0 | W0) || (W0 = 0, I0)) {
                        Y = !!(0 | h0) & 3 == (15 & (Y = 0 | s[0 | Y])) ? -33 & Y : Y, S0 = -65537 & J, B0 = 8192 & J ? S0 : J;
                        t:do {
                            switch (0 | Y) {
                                case 110:
                                    switch ((255 & h0) << 24 >> 24) {
                                        case 0:
                                        case 1:
                                        case 6:
                                            n[n[F0 >> 2] >> 2] = w, q = 0, l = D0;
                                            continue e;
                                        case 2:
                                        case 7:
                                            n[(q = 0 | n[F0 >> 2]) >> 2] = w, n[q + 4 >> 2] = ((0 | w) < 0) << 31 >> 31, q = 0, l = D0;
                                            continue e;
                                        case 3:
                                            h[n[F0 >> 2] >> 1] = w, q = 0, l = D0;
                                            continue e;
                                        case 4:
                                            s[0 | n[F0 >> 2]] = w, q = 0, l = D0;
                                            continue e;
                                        default:
                                            q = 0, l = D0;
                                            continue e
                                    }
                                case 112:
                                    Y = 120, j = j >>> 0 > 8 ? j : 8, l = 8 | B0, W0 = 61;
                                    break;
                                case 88:
                                case 120:
                                    l = B0, W0 = 61;
                                    break;
                                case 111:
                                    J = 0, n0 = 1639, j = !(8 & B0) | (0 | j) > (0 | (S0 = l0 - (T0 = 0 | nt(l = 0 | n[(Y = F0) >> 2], Y = 0 | n[Y + 4 >> 2], u0)) | 0)) ? j : S0 + 1 | 0, S0 = B0, W0 = 67;
                                    break;
                                case 105:
                                case 100:
                                    if (l = 0 | n[(Y = F0) >> 2], (0 | (Y = 0 | n[Y + 4 >> 2])) < 0) {
                                        l = 0 | we(0, 0, 0 | l, 0 | Y), Y = q0, n[(J = F0) >> 2] = l, n[J + 4 >> 2] = Y, J = 1, n0 = 1639, W0 = 66;
                                        break t
                                    }
                                    J = 1 & !!(2049 & B0), n0 = 2048 & B0 ? 1640 : 1 & B0 ? 1641 : 1639, W0 = 66;
                                    break t;
                                case 117:
                                    J = 0, n0 = 1639, l = 0 | n[(Y = F0) >> 2], Y = 0 | n[Y + 4 >> 2], W0 = 66;
                                    break;
                                case 99:
                                    s[0 | u1] = n[F0 >> 2], l = u1, J = 0, n0 = 1639, T0 = u0, Y = 1, j = S0;
                                    break;
                                case 109:
                                    Y = 0 | St(0 | n[82]), W0 = 71;
                                    break;
                                case 115:
                                    Y = 0 | (Y = 0 | n[F0 >> 2]) ? Y : 1649, W0 = 71;
                                    break;
                                case 67:
                                    n[o1 >> 2] = n[F0 >> 2], n[B1 >> 2] = 0, n[F0 >> 2] = o1, T0 = -1, Y = o1, W0 = 75;
                                    break;
                                case 83:
                                    l = 0 | n[F0 >> 2], j ? (T0 = j, Y = l, W0 = 75) : (k1(o, 32, q, 0, B0), l = 0, W0 = 84);
                                    break;
                                case 65:
                                case 71:
                                case 70:
                                case 69:
                                case 97:
                                case 103:
                                case 102:
                                case 101:
                                    q = 0 | Et(o, +U[F0 >> 3], q, j, B0, Y), l = D0;
                                    continue e;
                                default:
                                    J = 0, n0 = 1639, T0 = u0, Y = j, j = B0
                            }
                        } while (0);
                        t:do {
                            if (61 == (0 | W0)) B0 = F0, h0 = 0 | n[B0 >> 2], B0 = 0 | n[B0 + 4 >> 2], T0 = 0 | rt(h0, B0, u0, 32 & Y), n0 = !(8 & l) | !(0 | h0) & !(0 | B0), J = n0 ? 0 : 2, n0 = n0 ? 1639 : 1639 + (Y >> 4) | 0, S0 = l, l = h0, Y = B0, W0 = 67; else if (66 == (0 | W0)) T0 = 0 | Oe(l, Y, u0), S0 = B0, W0 = 67; else if (71 == (0 | W0)) W0 = 0, B0 = 0 | Lt(Y, 0, j), h0 = !(0 | B0), l = Y, J = 0, n0 = 1639, T0 = h0 ? Y + j | 0 : B0, Y = h0 ? j : B0 - Y | 0, j = S0; else if (75 == (0 | W0)) {
                                for (W0 = 0, n0 = Y, l = 0, j = 0; (J = 0 | n[n0 >> 2]) && !((0 | (j = 0 | at(O1, J))) < 0 | j >>> 0 > (T0 - l | 0) >>> 0) && T0 >>> 0 > (l = j + l | 0) >>> 0;) n0 = n0 + 4 | 0;
                                if ((0 | j) < 0) {
                                    w = -1;
                                    break e
                                }
                                if (k1(o, 32, q, l, B0), l) for (J = 0; ;) {
                                    if (!(j = 0 | n[Y >> 2])) {
                                        W0 = 84;
                                        break t
                                    }
                                    if ((0 | (J = (j = 0 | at(O1, j)) + J | 0)) > (0 | l)) {
                                        W0 = 84;
                                        break t
                                    }
                                    if ($0(o, O1, j), J >>> 0 >= l >>> 0) {
                                        W0 = 84;
                                        break
                                    }
                                    Y = Y + 4 | 0
                                } else l = 0, W0 = 84
                            }
                        } while (0);
                        if (67 == (0 | W0)) W0 = 0, B0 = !!(0 | j) | (Y = !!(0 | l) | !!(0 | Y)), Y = l0 - T0 + (1 & (1 ^ Y)) | 0, l = B0 ? T0 : u0, T0 = u0, Y = B0 ? (0 | j) > (0 | Y) ? j : Y : j, j = (0 | j) > -1 ? -65537 & S0 : S0; else if (84 == (0 | W0)) {
                            W0 = 0, k1(o, 32, q, l, 8192 ^ B0), q = (0 | q) > (0 | l) ? q : l, l = D0;
                            continue
                        }
                        k1(o, 32, q = (0 | q) < (0 | (B0 = (S0 = (0 | Y) < (0 | (h0 = T0 - l | 0)) ? h0 : Y) + J | 0)) ? B0 : q, B0, j), $0(o, n0, J), k1(o, 48, q, B0, 65536 ^ j), k1(o, 48, S0, h0, 0), $0(o, l, h0), k1(o, 32, q, B0, 8192 ^ j), l = D0
                    } else q = 0, l = D0
                }
            }
            e:do {
                if (87 == (0 | W0) && !o) if (o0) {
                    for (w = 1; l = 0 | n[_ + (w << 2) >> 2];) if (it(O + (w << 3) | 0, l, p), (0 | (w = w + 1 | 0)) >= 10) {
                        w = 1;
                        break e
                    }
                    for (; ;) {
                        if (0 | n[_ + (w << 2) >> 2]) {
                            w = -1;
                            break e
                        }
                        if ((0 | (w = w + 1 | 0)) >= 10) {
                            w = 1;
                            break
                        }
                    }
                } else w = 0
            } while (0);
            return M = r1, 0 | w
        }

        function $0(o, l, p) {
            32 & n[(o |= 0) >> 2] || function De(o, l, p) {
                o |= 0, l |= 0;
                var O = 0, _ = 0, w = 0, q = 0, j = 0;
                (_ = 0 | n[(O = (p |= 0) + 16 | 0) >> 2]) ? w = 5 : 0 | function ht(o) {
                    var l = 0, p = 0;
                    return s[0 | (l = (o |= 0) + 74 | 0)] = (p = 0 | s[0 | l]) + 255 | p, 8 & (l = 0 | n[o >> 2]) ? (n[o >> 2] = 32 | l, o = -1) : (n[o + 8 >> 2] = 0, n[o + 4 >> 2] = 0, n[o + 28 >> 2] = p = 0 | n[o + 44 >> 2], n[o + 20 >> 2] = p, n[o + 16 >> 2] = p + (0 | n[o + 48 >> 2]), o = 0), 0 | o
                }(p) ? O = 0 : (_ = 0 | n[O >> 2], w = 5);
                e:do {
                    if (5 == (0 | w)) {
                        if (O = q = 0 | n[(j = p + 20 | 0) >> 2], (_ - q | 0) >>> 0 < l >>> 0) {
                            O = 0 | ue[7 & n[p + 36 >> 2]](p, o, l);
                            break
                        }
                        t:do {
                            if ((0 | s[p + 75 | 0]) > -1) {
                                for (q = l; ;) {
                                    if (!q) {
                                        w = 0, _ = o;
                                        break t
                                    }
                                    if (10 == (0 | s[o + (_ = q + -1 | 0) | 0])) break;
                                    q = _
                                }
                                if ((O = 0 | ue[7 & n[p + 36 >> 2]](p, o, q)) >>> 0 < q >>> 0) break e;
                                w = q, _ = o + q | 0, l = l - q | 0, O = 0 | n[j >> 2]
                            } else w = 0, _ = o
                        } while (0);
                        j1(0 | O, 0 | _, 0 | l), n[j >> 2] = (0 | n[j >> 2]) + l, O = w + l | 0
                    }
                } while (0)
            }(l |= 0, p |= 0, o)
        }

        function _e(o) {
            var l = 0, p = 0, O = 0;
            if ((O = (0 | s[0 | (p = 0 | n[(o |= 0) >> 2])]) - 48 | 0) >>> 0 < 10) {
                l = 0;
                do {
                    l = O + (10 * l | 0) | 0, n[o >> 2] = p = p + 1 | 0, O = (0 | s[0 | p]) - 48 | 0
                } while (O >>> 0 < 10)
            } else l = 0;
            return 0 | l
        }

        function it(o, l, p) {
            o |= 0, l |= 0, p |= 0;
            var O = 0, _ = 0, w = 0;
            e:do {
                if (l >>> 0 <= 20) switch (0 | l) {
                    case 9:
                        l = 0 | n[(O = 3 + (0 | n[p >> 2]) & -4) >> 2], n[p >> 2] = O + 4, n[o >> 2] = l;
                        break e;
                    case 10:
                        l = 0 | n[(O = 3 + (0 | n[p >> 2]) & -4) >> 2], n[p >> 2] = O + 4, n[(O = o) >> 2] = l, n[O + 4 >> 2] = ((0 | l) < 0) << 31 >> 31;
                        break e;
                    case 11:
                        l = 0 | n[(O = 3 + (0 | n[p >> 2]) & -4) >> 2], n[p >> 2] = O + 4, n[(O = o) >> 2] = l, n[O + 4 >> 2] = 0;
                        break e;
                    case 12:
                        _ = 0 | n[(l = O = 7 + (0 | n[p >> 2]) & -8) >> 2], l = 0 | n[l + 4 >> 2], n[p >> 2] = O + 8, n[(O = o) >> 2] = _, n[O + 4 >> 2] = l;
                        break e;
                    case 13:
                        O = 0 | n[(_ = 3 + (0 | n[p >> 2]) & -4) >> 2], n[p >> 2] = _ + 4, n[(_ = o) >> 2] = O = (65535 & O) << 16 >> 16, n[_ + 4 >> 2] = ((0 | O) < 0) << 31 >> 31;
                        break e;
                    case 14:
                        O = 0 | n[(_ = 3 + (0 | n[p >> 2]) & -4) >> 2], n[p >> 2] = _ + 4, n[(_ = o) >> 2] = 65535 & O, n[_ + 4 >> 2] = 0;
                        break e;
                    case 15:
                        O = 0 | n[(_ = 3 + (0 | n[p >> 2]) & -4) >> 2], n[p >> 2] = _ + 4, n[(_ = o) >> 2] = O = (255 & O) << 24 >> 24, n[_ + 4 >> 2] = ((0 | O) < 0) << 31 >> 31;
                        break e;
                    case 16:
                        O = 0 | n[(_ = 3 + (0 | n[p >> 2]) & -4) >> 2], n[p >> 2] = _ + 4, n[(_ = o) >> 2] = 255 & O, n[_ + 4 >> 2] = 0;
                        break e;
                    case 17:
                    case 18:
                        w = +U[(_ = 7 + (0 | n[p >> 2]) & -8) >> 3], n[p >> 2] = _ + 8, U[o >> 3] = w;
                        break e;
                    default:
                        break e
                }
            } while (0)
        }

        function rt(o, l, p, O) {
            if (p |= 0, O |= 0, !(!(0 | (o |= 0)) & !(0 | (l |= 0)))) do {
                s[0 | (p = p + -1 | 0)] = m[1691 + (15 & o) | 0] | O, o = 0 | Be(0 | o, 0 | l, 4), l = q0
            } while (!(!(0 | o) & !(0 | l)));
            return 0 | p
        }

        function nt(o, l, p) {
            if (p |= 0, !(!(0 | (o |= 0)) & !(0 | (l |= 0)))) do {
                s[0 | (p = p + -1 | 0)] = 7 & o | 48, o = 0 | Be(0 | o, 0 | l, 3), l = q0
            } while (!(!(0 | o) & !(0 | l)));
            return 0 | p
        }

        function Oe(o, l, p) {
            p |= 0;
            var O = 0;
            if ((l |= 0) >>> 0 > 0 | !(0 | l) & (o |= 0) >>> 0 > 4294967295) {
                for (; O = 0 | $e(0 | o, 0 | l, 10, 0), s[0 | (p = p + -1 | 0)] = 255 & O | 48, O = o, o = 0 | xe(0 | o, 0 | l, 10, 0), l >>> 0 > 9 | 9 == (0 | l) & O >>> 0 > 4294967295;) l = q0;
                l = o
            } else l = o;
            if (l) for (; s[0 | (p = p + -1 | 0)] = (l >>> 0) % 10 | 48, !(l >>> 0 < 10);) l = (l >>> 0) / 10 | 0;
            return 0 | p
        }

        function St(o) {
            return 0 | function qe(o, l) {
                o |= 0, l |= 0;
                var p = 0, O = 0;
                for (O = 0; ;) {
                    if ((0 | m[1709 + O | 0]) == (0 | o)) {
                        o = 2;
                        break
                    }
                    if (87 == (0 | (p = O + 1 | 0))) {
                        p = 1797, O = 87, o = 5;
                        break
                    }
                    O = p
                }
                if (2 == (0 | o) && (O ? (p = 1797, o = 5) : p = 1797), 5 == (0 | o)) for (; ;) {
                    do {
                        o = p, p = p + 1 | 0
                    } while (0 | s[0 | o]);
                    if (!(O = O + -1 | 0)) break;
                    o = 5
                }
                return 0 | function lt(o, l) {
                    return 0 | function qt(o, l) {
                        return o |= 0, l = (l |= 0) ? 0 | function Ct(o, l, p) {
                            l |= 0, p |= 0;
                            var T0, O = 0, _ = 0, w = 0, q = 0, j = 0, Y = 0, J = 0, o0 = 0, n0 = 0;
                            w = 0 | te(0 | n[(o |= 0) + 8 >> 2], T0 = 1794895138 + (0 | n[o >> 2]) | 0), O = 0 | te(0 | n[o + 12 >> 2], T0), _ = 0 | te(0 | n[o + 16 >> 2], T0);
                            e:do {
                                if (w >>> 0 < l >>> 2 >>> 0 && (n0 = l - (w << 2) | 0, O >>> 0 < n0 >>> 0 & _ >>> 0 < n0 >>> 0) && !(3 & (_ | O))) {
                                    for (n0 = O >>> 2, o0 = _ >>> 2, J = 0; ;) {
                                        if (O = 0 | te(0 | n[o + ((_ = (q = (Y = J + (j = w >>> 1) | 0) << 1) + n0 | 0) << 2) >> 2], T0), !((_ = 0 | te(0 | n[o + (_ + 1 << 2) >> 2], T0)) >>> 0 < l >>> 0 & O >>> 0 < (l - _ | 0) >>> 0)) {
                                            O = 0;
                                            break e
                                        }
                                        if (0 | s[o + (_ + O) | 0]) {
                                            O = 0;
                                            break e
                                        }
                                        if (!(O = 0 | w1(p, o + _ | 0))) break;
                                        if (O = (0 | O) < 0, 1 == (0 | w)) {
                                            O = 0;
                                            break e
                                        }
                                        J = O ? J : Y, w = O ? j : w - j | 0
                                    }
                                    _ = 0 | te(0 | n[o + ((O = q + o0 | 0) << 2) >> 2], T0), O = (O = 0 | te(0 | n[o + (O + 1 << 2) >> 2], T0)) >>> 0 < l >>> 0 & _ >>> 0 < (l - O | 0) >>> 0 ? 0 | s[o + (O + _) | 0] ? 0 : o + O | 0 : 0
                                } else O = 0
                            } while (0);
                            return 0 | O
                        }(0 | n[l >> 2], 0 | n[l + 4 >> 2], o) : 0, 0 | (0 | l ? l : o)
                    }(o |= 0, l |= 0)
                }(p, 0 | n[l + 20 >> 2])
            }(o |= 0, 0 | n[113])
        }

        function Lt(o, l, p) {
            o |= 0;
            var O = 0, _ = 0, w = 0, q = 0;
            w = 255 & (l |= 0), O = !!(0 | (p |= 0));
            e:do {
                if (O & !!(3 & o)) for (_ = 255 & l; ;) {
                    if ((0 | s[0 | o]) == _ << 24 >> 24) {
                        q = 6;
                        break e
                    }
                    if (!((O = !!(0 | (p = p + -1 | 0))) & !!(3 & (o = o + 1 | 0)))) {
                        q = 5;
                        break
                    }
                } else q = 5
            } while (0);
            5 == (0 | q) && (O ? q = 6 : p = 0);
            e:do {
                if (6 == (0 | q) && (_ = 255 & l, (0 | s[0 | o]) != _ << 24 >> 24)) {
                    O = 0 | X0(w, 16843009);
                    t:do {
                        if (p >>> 0 > 3) {
                            for (; !((-2139062144 & (w = n[o >> 2] ^ O) ^ -2139062144) & w + -16843009);) if (o = o + 4 | 0, (p = p + -4 | 0) >>> 0 <= 3) {
                                q = 11;
                                break t
                            }
                        } else q = 11
                    } while (0);
                    if (11 == (0 | q) && !p) {
                        p = 0;
                        break
                    }
                    for (; ;) {
                        if ((0 | s[0 | o]) == _ << 24 >> 24) break e;
                        if (o = o + 1 | 0, !(p = p + -1 | 0)) {
                            p = 0;
                            break
                        }
                    }
                }
            } while (0);
            return 0 | (0 | p ? o : 0)
        }

        function k1(o, l, p, O, _) {
            var w, q;
            if (o |= 0, l |= 0, q = M, M = M + 256 | 0, w = q, (0 | (p |= 0)) > (0 | (O |= 0)) & !(73728 & (_ |= 0))) {
                if (Z1(0 | w, 0 | l, 0 | ((_ = p - O | 0) >>> 0 < 256 ? _ : 256)), _ >>> 0 > 255) {
                    l = p - O | 0;
                    do {
                        $0(o, w, 256), _ = _ + -256 | 0
                    } while (_ >>> 0 > 255);
                    _ = 255 & l
                }
                $0(o, w, _)
            }
            M = q
        }

        function at(o, l) {
            return 0 | (o = (o |= 0) ? 0 | function Nt(o, l, p) {
                o |= 0, l |= 0;
                do {
                    if (o) {
                        if (l >>> 0 < 128) {
                            s[0 | o] = l, o = 1;
                            break
                        }
                        if (!(0 | n[n[113] >> 2])) {
                            if (57216 == (-128 & l)) {
                                s[0 | o] = l, o = 1;
                                break
                            }
                            n[82] = 84, o = -1;
                            break
                        }
                        if (l >>> 0 < 2048) {
                            s[0 | o] = l >>> 6 | 192, s[o + 1 | 0] = 63 & l | 128, o = 2;
                            break
                        }
                        if (l >>> 0 < 55296 | 57344 == (-8192 & l)) {
                            s[0 | o] = l >>> 12 | 224, s[o + 1 | 0] = l >>> 6 & 63 | 128, s[o + 2 | 0] = 63 & l | 128, o = 3;
                            break
                        }
                        if ((l + -65536 | 0) >>> 0 < 1048576) {
                            s[0 | o] = l >>> 18 | 240, s[o + 1 | 0] = l >>> 12 & 63 | 128, s[o + 2 | 0] = l >>> 6 & 63 | 128, s[o + 3 | 0] = 63 & l | 128, o = 4;
                            break
                        }
                        n[82] = 84, o = -1;
                        break
                    }
                    o = 1
                } while (0);
                return 0 | o
            }(o, l |= 0) : 0)
        }

        function Et(o, l, p, O, _, w) {
            o |= 0, l = +l, p |= 0, O |= 0, _ |= 0, w |= 0;
            var x1, q = 0, j = 0, Y = 0, J = 0, o0 = 0, n0 = 0, T0 = 0, S0 = 0, h0 = 0, B0 = 0, D0 = 0, W0 = 0, I0 = 0,
                u0 = 0, l0 = 0, u1 = 0, B1 = 0, M1 = 0, F0 = 0, o1 = 0, O1 = 0, r1 = 0;
            x1 = M, M = M + 560 | 0, Y = x1 + 8 | 0, O1 = r1 = x1 + 524 | 0, J = x1 + 512 | 0, n[(D0 = x1) >> 2] = 0, o1 = J + 12 | 0, je(l), (0 | q0) < 0 ? (l = -l, M1 = 1, B1 = 1656) : (M1 = 1 & !!(2049 & _), B1 = 2048 & _ ? 1659 : 1 & _ ? 1662 : 1657), je(l), F0 = 2146435072 & q0;
            do {
                if (F0 >>> 0 < 2146435072 | 2146435072 == (0 | F0) & !1) {
                    if ((q = 0 != (S0 = 2 * +st(l, D0))) && (n[D0 >> 2] = (0 | n[D0 >> 2]) - 1), 97 == (0 | (I0 = 32 | w))) {
                        T0 = 0 | (h0 = 32 & w) ? B1 + 9 | 0 : B1, n0 = 2 | M1, q = 12 - O | 0;
                        do {
                            if (!(O >>> 0 > 11 | !(0 | q))) {
                                l = 8;
                                do {
                                    q = q + -1 | 0, l *= 16
                                } while (0 | q);
                                if (45 == (0 | s[0 | T0])) {
                                    l = -(l + (-S0 - l));
                                    break
                                }
                                l = S0 + l - l;
                                break
                            }
                            l = S0
                        } while (0);
                        (0 | (q = 0 | Oe(q = (0 | (j = 0 | n[D0 >> 2])) < 0 ? 0 - j | 0 : j, ((0 | q) < 0) << 31 >> 31, o1))) == (0 | o1) && (s[0 | (q = J + 11 | 0)] = 48), s[q + -1 | 0] = 43 + (j >> 31 & 2), s[0 | (o0 = q + -2 | 0)] = w + 15, J = (0 | O) < 1, Y = !(8 & _), q = r1;
                        do {
                            j = q + 1 | 0, s[0 | q] = m[1691 + (F0 = ~~l) | 0] | h0, l = 16 * (l - +(0 | F0)), 1 != (j - O1 | 0) || Y & J & 0 == l ? q = j : (s[0 | j] = 46, q = q + 2 | 0)
                        } while (0 != l);
                        F0 = q - O1 | 0, k1(o, 32, p, q = (O1 = o1 - o0 | 0) + n0 + (o1 = !!(0 | O) & (F0 + -2 | 0) < (0 | O) ? O + 2 | 0 : F0) | 0, _), $0(o, T0, n0), k1(o, 48, p, q, 65536 ^ _), $0(o, r1, F0), k1(o, 48, o1 - F0 | 0, 0, 0), $0(o, o0, O1), k1(o, 32, p, q, 8192 ^ _);
                        break
                    }
                    j = (0 | O) < 0 ? 6 : O, q ? (n[D0 >> 2] = q = (0 | n[D0 >> 2]) - 28 | 0, l = 268435456 * S0) : (l = S0, q = 0 | n[D0 >> 2]), Y = F0 = (0 | q) < 0 ? Y : Y + 288 | 0;
                    do {
                        n[Y >> 2] = l0 = ~~l >>> 0, Y = Y + 4 | 0, l = 1e9 * (l - +(l0 >>> 0))
                    } while (0 != l);
                    if ((0 | q) > 0) for (J = F0, n0 = Y; ;) {
                        if (o0 = (0 | q) < 29 ? q : 29, (q = n0 + -4 | 0) >>> 0 >= J >>> 0) {
                            Y = 0;
                            do {
                                W0 = 0 | $e(0 | (u0 = 0 | Ae(0 | (u0 = 0 | Ke(0 | n[q >> 2], 0, 0 | o0)), 0 | q0, 0 | Y, 0)), 0 | (l0 = q0), 1e9, 0), n[q >> 2] = W0, Y = 0 | xe(0 | u0, 0 | l0, 1e9, 0), q = q + -4 | 0
                            } while (q >>> 0 >= J >>> 0);
                            Y && (n[(J = J + -4 | 0) >> 2] = Y)
                        }
                        for (Y = n0; !(Y >>> 0 <= J >>> 0 || 0 | n[(q = Y + -4 | 0) >> 2]);) Y = q;
                        if (n[D0 >> 2] = q = (0 | n[D0 >> 2]) - o0 | 0, !((0 | q) > 0)) break;
                        n0 = Y
                    } else J = F0;
                    if ((0 | q) < 0) {
                        O = 1 + ((j + 25 | 0) / 9 | 0) | 0, B0 = 102 == (0 | I0);
                        do {
                            if (h0 = (0 | (h0 = 0 - q | 0)) < 9 ? h0 : 9, J >>> 0 < Y >>> 0) {
                                o0 = (1 << h0) - 1 | 0, n0 = 1e9 >>> h0, T0 = 0, q = J;
                                do {
                                    n[q >> 2] = ((l0 = 0 | n[q >> 2]) >>> h0) + T0, T0 = 0 | X0(l0 & o0, n0), q = q + 4 | 0
                                } while (q >>> 0 < Y >>> 0);
                                q = 0 | n[J >> 2] ? J : J + 4 | 0, T0 ? (n[Y >> 2] = T0, J = q, q = Y + 4 | 0) : (J = q, q = Y)
                            } else J = 0 | n[J >> 2] ? J : J + 4 | 0, q = Y;
                            Y = q - (Y = B0 ? F0 : J) >> 2 > (0 | O) ? Y + (O << 2) | 0 : q, n[D0 >> 2] = q = (0 | n[D0 >> 2]) + h0 | 0
                        } while ((0 | q) < 0);
                        q = J, O = Y
                    } else q = J, O = Y;
                    if (l0 = F0, q >>> 0 < O >>> 0) {
                        if (Y = 9 * (l0 - q >> 2) | 0, (o0 = 0 | n[q >> 2]) >>> 0 >= 10) {
                            J = 10;
                            do {
                                J = 10 * J | 0, Y = Y + 1 | 0
                            } while (o0 >>> 0 >= J >>> 0)
                        }
                    } else Y = 0;
                    if ((0 | (J = j - (102 != (0 | I0) ? Y : 0) + (((W0 = !!(0 | j)) & (B0 = 103 == (0 | I0))) << 31 >> 31) | 0)) < ((9 * (O - l0 >> 2) | 0) - 9 | 0)) {
                        if (h0 = F0 + 4 + (((0 | (J = J + 9216 | 0)) / 9 | 0) - 1024 << 2) | 0, (0 | (J = 1 + ((0 | J) % 9 | 0) | 0)) < 9) {
                            o0 = 10;
                            do {
                                o0 = 10 * o0 | 0, J = J + 1 | 0
                            } while (9 != (0 | J))
                        } else o0 = 10;
                        if ((J = (h0 + 4 | 0) == (0 | O)) & !(0 | (T0 = ((n0 = 0 | n[h0 >> 2]) >>> 0) % (o0 >>> 0) | 0))) J = h0; else if (S0 = (n0 >>> 0) / (o0 >>> 0) & 1 ? 9007199254740994 : 9007199254740992, l = T0 >>> 0 < (u0 = (0 | o0) / 2 | 0) >>> 0 ? .5 : J & (0 | T0) == (0 | u0) ? 1 : 1.5, M1 && (l = (u0 = 45 == (0 | s[0 | B1])) ? -l : l, S0 = u0 ? -S0 : S0), n[h0 >> 2] = J = n0 - T0 | 0, S0 + l != S0) {
                            if (n[h0 >> 2] = u0 = J + o0 | 0, u0 >>> 0 > 999999999) for (Y = h0; J = Y + -4 | 0, n[Y >> 2] = 0, J >>> 0 < q >>> 0 && (n[(q = q + -4 | 0) >> 2] = 0), n[J >> 2] = u0 = 1 + (0 | n[J >> 2]) | 0, u0 >>> 0 > 999999999;) Y = J; else J = h0;
                            if (Y = 9 * (l0 - q >> 2) | 0, (n0 = 0 | n[q >> 2]) >>> 0 >= 10) {
                                o0 = 10;
                                do {
                                    o0 = 10 * o0 | 0, Y = Y + 1 | 0
                                } while (n0 >>> 0 >= o0 >>> 0)
                            }
                        } else J = h0;
                        J = O >>> 0 > (J = J + 4 | 0) >>> 0 ? J : O, u0 = q
                    } else J = O, u0 = q;
                    for (I0 = J; ;) {
                        if (I0 >>> 0 <= u0 >>> 0) {
                            D0 = 0;
                            break
                        }
                        if (0 | n[(q = I0 + -4 | 0) >> 2]) {
                            D0 = 1;
                            break
                        }
                        I0 = q
                    }
                    O = 0 - Y | 0;
                    do {
                        if (B0) {
                            if ((0 | (q = (1 & (1 ^ W0)) + j | 0)) > (0 | Y) & (0 | Y) > -5 ? (o0 = w + -1 | 0, j = q + -1 - Y | 0) : (o0 = w + -2 | 0, j = q + -1 | 0), !(q = 8 & _)) {
                                if (D0 && 0 | (u1 = 0 | n[I0 + -4 >> 2])) if ((u1 >>> 0) % 10 | 0) J = 0; else {
                                    J = 0, q = 10;
                                    do {
                                        q = 10 * q | 0, J = J + 1 | 0
                                    } while (!((u1 >>> 0) % (q >>> 0) | 0))
                                } else J = 9;
                                if (q = (9 * (I0 - l0 >> 2) | 0) - 9 | 0, 102 == (32 | o0)) {
                                    j = (0 | j) < (0 | (h0 = (0 | (h0 = q - J | 0)) > 0 ? h0 : 0)) ? j : h0, h0 = 0;
                                    break
                                }
                                j = (0 | j) < (0 | (h0 = (0 | (h0 = q + Y - J | 0)) > 0 ? h0 : 0)) ? j : h0, h0 = 0;
                                break
                            }
                            h0 = q
                        } else o0 = w, h0 = 8 & _
                    } while (0);
                    if (n0 = 1 & !!(0 | (B0 = j | h0)), T0 = 102 == (32 | o0)) W0 = 0, q = (0 | Y) > 0 ? Y : 0; else {
                        if (((J = o1) - (q = 0 | Oe(q = (0 | Y) < 0 ? O : Y, ((0 | q) < 0) << 31 >> 31, o1)) | 0) < 2) do {
                            s[0 | (q = q + -1 | 0)] = 48
                        } while ((J - q | 0) < 2);
                        s[q + -1 | 0] = 43 + (Y >> 31 & 2), s[0 | (q = q + -2 | 0)] = o0, W0 = q, q = J - q | 0
                    }
                    if (k1(o, 32, p, q = M1 + 1 + j + n0 + q | 0, _), $0(o, B1, M1), k1(o, 48, p, q, 65536 ^ _), T0) {
                        n0 = h0 = r1 + 9 | 0, T0 = r1 + 8 | 0, J = o0 = u0 >>> 0 > F0 >>> 0 ? F0 : u0;
                        do {
                            if (Y = 0 | Oe(0 | n[J >> 2], 0, h0), (0 | J) == (0 | o0)) (0 | Y) == (0 | h0) && (s[0 | T0] = 48, Y = T0); else if (Y >>> 0 > r1 >>> 0) {
                                Z1(0 | r1, 48, Y - O1 | 0);
                                do {
                                    Y = Y + -1 | 0
                                } while (Y >>> 0 > r1 >>> 0)
                            }
                            $0(o, Y, n0 - Y | 0), J = J + 4 | 0
                        } while (J >>> 0 <= F0 >>> 0);
                        if (0 | B0 && $0(o, 1707, 1), J >>> 0 < I0 >>> 0 & (0 | j) > 0) for (; ;) {
                            if ((Y = 0 | Oe(0 | n[J >> 2], 0, h0)) >>> 0 > r1 >>> 0) {
                                Z1(0 | r1, 48, Y - O1 | 0);
                                do {
                                    Y = Y + -1 | 0
                                } while (Y >>> 0 > r1 >>> 0)
                            }
                            if ($0(o, Y, (0 | j) < 9 ? j : 9), Y = j + -9 | 0, !((J = J + 4 | 0) >>> 0 < I0 >>> 0 & (0 | j) > 9)) {
                                j = Y;
                                break
                            }
                            j = Y
                        }
                        k1(o, 48, j + 9 | 0, 9, 0)
                    } else {
                        if (B0 = D0 ? I0 : u0 + 4 | 0, (0 | j) > -1) {
                            h0 = !(0 | h0), O = D0 = r1 + 9 | 0, n0 = 0 - O1 | 0, T0 = r1 + 8 | 0, o0 = u0;
                            do {
                                (0 | (Y = 0 | Oe(0 | n[o0 >> 2], 0, D0))) == (0 | D0) && (s[0 | T0] = 48, Y = T0);
                                do {
                                    if ((0 | o0) == (0 | u0)) {
                                        if (J = Y + 1 | 0, $0(o, Y, 1), h0 & (0 | j) < 1) {
                                            Y = J;
                                            break
                                        }
                                        $0(o, 1707, 1), Y = J
                                    } else {
                                        if (Y >>> 0 <= r1 >>> 0) break;
                                        Z1(0 | r1, 48, Y + n0 | 0);
                                        do {
                                            Y = Y + -1 | 0
                                        } while (Y >>> 0 > r1 >>> 0)
                                    }
                                } while (0);
                                $0(o, Y, (0 | j) > (0 | (O1 = O - Y | 0)) ? O1 : j), j = j - O1 | 0, o0 = o0 + 4 | 0
                            } while (o0 >>> 0 < B0 >>> 0 & (0 | j) > -1)
                        }
                        k1(o, 48, j + 18 | 0, 18, 0), $0(o, W0, o1 - W0 | 0)
                    }
                    k1(o, 32, p, q, 8192 ^ _)
                } else r1 = !!(32 & w), k1(o, 32, p, q = M1 + 3 | 0, -65537 & _), $0(o, B1, M1), $0(o, l != l | !1 ? r1 ? 1683 : 1687 : r1 ? 1675 : 1679, 3), k1(o, 32, p, q, 8192 ^ _)
            } while (0);
            return M = x1, 0 | ((0 | q) < (0 | p) ? p : q)
        }

        function je(o) {
            return U[S >> 3] = o = +o, q0 = 0 | n[S + 4 >> 2], 0 | n[S >> 2]
        }

        function st(o, l) {
            return ++ot(o = +o, l |= 0)
        }

        function ot(o, l) {
            l |= 0;
            var O, _, p = 0;
            switch (U[S >> 3] = o = +o, 2047 & (_ = 0 | Be(0 | (p = 0 | n[S >> 2]), 0 | (O = 0 | n[S + 4 >> 2]), 52))) {
                case 0:
                    0 != o ? (o = +ot(0x10000000000000000 * o, l), p = (0 | n[l >> 2]) - 64 | 0) : p = 0, n[l >> 2] = p;
                    break;
                case 2047:
                    break;
                default:
                    n[l >> 2] = (2047 & _) - 1022, n[S >> 2] = p, n[S + 4 >> 2] = -2146435073 & O | 1071644672, o = +U[S >> 3]
            }
            return +o
        }

        function te(o, l) {
            var p;
            return l |= 0, p = 0 | T1(0 | (o |= 0)), 0 | (0 | l ? p : o)
        }

        function ie(o) {
            var O, l = 0, p = 0;
            O = o |= 0;
            e:do {
                if (3 & O) for (l = O; ;) {
                    if (!(0 | s[0 | o])) {
                        o = l;
                        break e
                    }
                    if (!(3 & (l = o = o + 1 | 0))) {
                        p = 4;
                        break
                    }
                } else p = 4
            } while (0);
            if (4 == (0 | p)) {
                for (; !((-2139062144 & (l = 0 | n[o >> 2]) ^ -2139062144) & l + -16843009);) o = o + 4 | 0;
                if ((255 & l) << 24 >> 24) do {
                    o = o + 1 | 0
                } while (0 | s[0 | o])
            }
            return o - O | 0
        }

        function Ue(o) {
            var l, q, p = 0, O = 0, _ = 0, w = 0;
            return (0 | n[(l = 20 + (o |= 0) | 0) >> 2]) >>> 0 > (0 | n[(q = o + 28 | 0) >> 2]) >>> 0 && (ue[7 & n[o + 36 >> 2]](o, 0, 0), !(0 | n[l >> 2])) ? o = -1 : ((O = 0 | n[(p = o + 4 | 0) >> 2]) >>> 0 < (w = 0 | n[(_ = o + 8 | 0) >> 2]) >>> 0 && ue[7 & n[o + 40 >> 2]](o, O - w | 0, 1), n[o + 16 >> 2] = 0, n[q >> 2] = 0, n[l >> 2] = 0, n[_ >> 2] = 0, n[p >> 2] = 0, o = 0), 0 | o
        }

        function ft(o, l, p) {
            o |= 0, p |= 0;
            var O = 0, _ = 0, w = 0;
            _ = l |= 0;
            do {
                if (3 & (_ ^ o)) w = 11; else {
                    O = !!(0 | p);
                    e:do {
                        if (O & !!(3 & _)) for (; ;) {
                            if (s[0 | o] = _ = 0 | s[0 | l], !(_ << 24 >> 24)) break e;
                            if (o = o + 1 | 0, !((O = !!(0 | (p = p + -1 | 0))) & !!(3 & (l = l + 1 | 0)))) {
                                w = 5;
                                break
                            }
                        } else w = 5
                    } while (0);
                    if (5 == (0 | w) && !O) {
                        p = 0;
                        break
                    }
                    if (0 | s[0 | l]) {
                        e:do {
                            if (p >>> 0 > 3) for (O = l; ;) {
                                if ((-2139062144 & (l = 0 | n[O >> 2]) ^ -2139062144) & l + -16843009) {
                                    l = O;
                                    break e
                                }
                                if (n[o >> 2] = l, l = O + 4 | 0, o = o + 4 | 0, !((p = p + -4 | 0) >>> 0 > 3)) break;
                                O = l
                            }
                        } while (0);
                        w = 11
                    }
                }
            } while (0);
            e:do {
                if (11 == (0 | w)) if (p) for (; ;) {
                    if (s[0 | o] = w = 0 | s[0 | l], !(w << 24 >> 24)) break e;
                    if (o = o + 1 | 0, !(p = p + -1 | 0)) {
                        p = 0;
                        break
                    }
                    l = l + 1 | 0
                } else p = 0
            } while (0);
            return Z1(0 | o, 0, 0 | p), 0 | o
        }

        function we(o, l, p, O) {
            return q0 = O = (l |= 0) - (O |= 0) - ((p |= 0) >>> 0 > (o |= 0) >>> 0 | 0) >>> 0, o - p >>> 0 | 0
        }

        function Ae(o, l, p, O) {
            return q0 = (l |= 0) + (O |= 0) + ((p = (o |= 0) + (p |= 0) >>> 0) >>> 0 < o >>> 0 | 0) >>> 0, 0 | p
        }

        function Z1(o, l, p) {
            l |= 0;
            var w, O = 0, _ = 0, q = 0;
            if (w = (o |= 0) + (p |= 0) | 0, l &= 255, (0 | p) >= 67) {
                for (; 3 & o;) s[0 | o] = l, o = o + 1 | 0;
                for (_ = (O = -4 & w) - 64 | 0, q = l | l << 8 | l << 16 | l << 24; (0 | o) <= (0 | _);) n[o >> 2] = q, n[o + 4 >> 2] = q, n[o + 8 >> 2] = q, n[o + 12 >> 2] = q, n[o + 16 >> 2] = q, n[o + 20 >> 2] = q, n[o + 24 >> 2] = q, n[o + 28 >> 2] = q, n[o + 32 >> 2] = q, n[o + 36 >> 2] = q, n[o + 40 >> 2] = q, n[o + 44 >> 2] = q, n[o + 48 >> 2] = q, n[o + 52 >> 2] = q, n[o + 56 >> 2] = q, n[o + 60 >> 2] = q, o = o + 64 | 0;
                for (; (0 | o) < (0 | O);) n[o >> 2] = q, o = o + 4 | 0
            }
            for (; (0 | o) < (0 | w);) s[0 | o] = l, o = o + 1 | 0;
            return w - p | 0
        }

        function Be(o, l, p) {
            return l |= 0, (0 | (p |= 0)) < 32 ? (q0 = l >>> p, (o |= 0) >>> p | (l & (1 << p) - 1) << 32 - p) : (q0 = 0, l >>> p - 32 | 0)
        }

        function Ke(o, l, p) {
            return o |= 0, (0 | (p |= 0)) < 32 ? (q0 = (l |= 0) << p | (o & (1 << p) - 1 << 32 - p) >>> 32 - p, o << p) : (q0 = o << p - 32, 0)
        }

        function Je(o) {
            var l = 0;
            return (0 | (l = 0 | s[g + (255 & (o |= 0)) | 0])) < 8 ? 0 | l : (0 | (l = 0 | s[g + (o >> 8 & 255) | 0])) < 8 ? l + 8 | 0 : (0 | (l = 0 | s[g + (o >> 16 & 255) | 0])) < 8 ? l + 16 | 0 : 24 + (0 | s[g + (o >>> 24) | 0]) | 0
        }

        function Qe(o, l, p, O, _) {
            _ |= 0;
            var w = 0, q = 0, j = 0, Y = 0, J = 0, o0 = 0, n0 = 0, T0 = 0, S0 = 0, h0 = 0;
            if (o0 = o |= 0, q = p |= 0, j = T0 = O |= 0, !(J = Y = l |= 0)) return w = !!(0 | _), j ? w ? (n[_ >> 2] = 0 | o, n[_ + 4 >> 2] = 0, q0 = T0 = 0, 0 | (_ = 0)) : (q0 = T0 = 0, 0 | (_ = 0)) : (w && (n[_ >> 2] = (o0 >>> 0) % (q >>> 0), n[_ + 4 >> 2] = 0), q0 = T0 = 0, 0 | (_ = (o0 >>> 0) / (q >>> 0) >>> 0));
            w = !(0 | j);
            do {
                if (q) {
                    if (!w) {
                        if ((w = (0 | Y0(0 | j)) - (0 | Y0(0 | J)) | 0) >>> 0 <= 31) {
                            q = n0 = w + 1 | 0, o = o0 >>> (n0 >>> 0) & (l = w - 31 >> 31) | J << (j = 31 - w | 0), l &= J >>> (n0 >>> 0), w = 0, j = o0 << j;
                            break
                        }
                        return _ ? (n[_ >> 2] = 0 | o, n[_ + 4 >> 2] = 0 | Y, q0 = T0 = 0, 0 | (_ = 0)) : (q0 = T0 = 0, 0 | (_ = 0))
                    }
                    if ((w = q - 1 | 0) & q) {
                        q = j = 33 + (0 | Y0(0 | q)) - (0 | Y0(0 | J)) | 0, o = (n0 = 32 - j | 0) - 1 >> 31 & J >>> ((S0 = j - 32 | 0) >>> 0) | (J << n0 | o0 >>> (j >>> 0)) & (l = S0 >> 31), l &= J >>> (j >>> 0), w = o0 << (h0 = 64 - j | 0) & (Y = n0 >> 31), j = (J << h0 | o0 >>> (S0 >>> 0)) & Y | o0 << n0 & j - 33 >> 31;
                        break
                    }
                    return 0 | _ && (n[_ >> 2] = w & o0, n[_ + 4 >> 2] = 0), 1 == (0 | q) ? (q0 = S0 = 0 | Y, 0 | (h0 = 0 | o)) : (h0 = 0 | Je(0 | q), q0 = S0 = J >>> (h0 >>> 0) | 0, 0 | (h0 = J << 32 - h0 | o0 >>> (h0 >>> 0)))
                }
                if (w) return 0 | _ && (n[_ >> 2] = (J >>> 0) % (q >>> 0), n[_ + 4 >> 2] = 0), q0 = S0 = 0, 0 | (J >>> 0) / (q >>> 0) >>> 0;
                if (!o0) return 0 | _ && (n[_ >> 2] = 0, n[_ + 4 >> 2] = (J >>> 0) % (j >>> 0)), q0 = S0 = 0, 0 | (J >>> 0) / (j >>> 0) >>> 0;
                if (!((w = j - 1 | 0) & j)) return 0 | _ && (n[_ >> 2] = 0 | o, n[_ + 4 >> 2] = w & J), S0 = 0, h0 = J >>> ((0 | Je(0 | j)) >>> 0), q0 = S0, 0 | h0;
                if ((w = (0 | Y0(0 | j)) - (0 | Y0(0 | J)) | 0) >>> 0 <= 30) {
                    q = l = w + 1 | 0, o = J << (j = 31 - w | 0) | o0 >>> (l >>> 0), l = J >>> (l >>> 0), w = 0, j = o0 << j;
                    break
                }
                return _ ? (n[_ >> 2] = 0 | o, n[_ + 4 >> 2] = 0 | Y, q0 = S0 = 0, 0 | (h0 = 0)) : (q0 = S0 = 0, 0 | (h0 = 0))
            } while (0);
            if (q) {
                J = 0 | Ae(0 | (n0 = 0 | p), 0 | (o0 = 0 | T0), -1, -1), p = q0, Y = j, j = 0;
                do {
                    O = Y, Y = w >>> 31 | Y << 1, w = j | w << 1, we(0 | J, 0 | p, 0 | (O = o << 1 | O >>> 31), 0 | (T0 = o >>> 31 | l << 1)), j = 1 & (S0 = (h0 = q0) >> 31 | ((0 | h0) < 0 ? -1 : 0) << 1), o = 0 | we(0 | O, 0 | T0, S0 & n0, (((0 | h0) < 0 ? -1 : 0) >> 31 | ((0 | h0) < 0 ? -1 : 0) << 1) & o0), l = q0, q = q - 1 | 0
                } while (0 | q);
                J = Y, Y = 0
            } else J = j, Y = 0, j = 0;
            return q = 0, 0 | _ && (n[_ >> 2] = o, n[_ + 4 >> 2] = l), q0 = S0 = (0 | w) >>> 31 | (J | q) << 1 | Y, w << 1 & -2 | j
        }

        function xe(o, l, p, O) {
            return 0 | Qe(o |= 0, l |= 0, p |= 0, O |= 0, 0)
        }

        function ut(o, l) {
            var p, O, w, _ = 0;
            return o = ((p = 0 | X0(_ = 65535 & (l |= 0), w = 65535 & (o |= 0))) >>> 16) + (0 | X0(_, O = o >>> 16)) | 0, l = 0 | X0(_ = l >>> 16, w), q0 = (o >>> 16) + (0 | X0(_, O)) + (((65535 & o) + l | 0) >>> 16) | 0, o + l << 16 | 65535 & p
        }

        function Ze(o, l, p, O) {
            var _, w;
            return l |= 0, O |= 0, p = 0 | ut(_ = o |= 0, w = p |= 0), o = q0, q0 = (0 | X0(l, w)) + (0 | X0(O, _)) + o | 0, 0 | p
        }

        function fe(o) {
            var l, p;
            return (0 | (p = 15 + (o |= 0) & -16)) > 0 & (0 | (o = (l = 0 | n[W >> 2]) + p | 0)) < (0 | l) | (0 | o) < 0 ? (D1(), e1(12), -1) : (n[W >> 2] = o, (0 | o) > (0 | q1()) && !(0 | R0()) ? (n[W >> 2] = l, e1(12), -1) : 0 | l)
        }

        function $e(o, l, p, O) {
            var _, w;
            return w = M, M = M + 16 | 0, Qe(o |= 0, l |= 0, p |= 0, O |= 0, _ = 0 | w), M = w, q0 = 0 | n[_ + 4 >> 2], 0 | n[_ >> 2]
        }

        function j1(o, l, p) {
            o |= 0, l |= 0;
            var _, w, O = 0;
            if ((0 | (p |= 0)) >= 8192) return 0 | d(0 | o, 0 | l, 0 | p);
            if (w = 0 | o, _ = o + p | 0, (3 & o) == (3 & l)) {
                for (; 3 & o;) {
                    if (!p) return 0 | w;
                    s[0 | o] = 0 | s[0 | l], o = o + 1 | 0, l = l + 1 | 0, p = p - 1 | 0
                }
                for (O = (p = -4 & _) - 64 | 0; (0 | o) <= (0 | O);) n[o >> 2] = n[l >> 2], n[o + 4 >> 2] = n[l + 4 >> 2], n[o + 8 >> 2] = n[l + 8 >> 2], n[o + 12 >> 2] = n[l + 12 >> 2], n[o + 16 >> 2] = n[l + 16 >> 2], n[o + 20 >> 2] = n[l + 20 >> 2], n[o + 24 >> 2] = n[l + 24 >> 2], n[o + 28 >> 2] = n[l + 28 >> 2], n[o + 32 >> 2] = n[l + 32 >> 2], n[o + 36 >> 2] = n[l + 36 >> 2], n[o + 40 >> 2] = n[l + 40 >> 2], n[o + 44 >> 2] = n[l + 44 >> 2], n[o + 48 >> 2] = n[l + 48 >> 2], n[o + 52 >> 2] = n[l + 52 >> 2], n[o + 56 >> 2] = n[l + 56 >> 2], n[o + 60 >> 2] = n[l + 60 >> 2], o = o + 64 | 0, l = l + 64 | 0;
                for (; (0 | o) < (0 | p);) n[o >> 2] = n[l >> 2], o = o + 4 | 0, l = l + 4 | 0
            } else for (p = _ - 4 | 0; (0 | o) < (0 | p);) s[0 | o] = 0 | s[0 | l], s[o + 1 | 0] = 0 | s[l + 1 | 0], s[o + 2 | 0] = 0 | s[l + 2 | 0], s[o + 3 | 0] = 0 | s[l + 3 | 0], o = o + 4 | 0, l = l + 4 | 0;
            for (; (0 | o) < (0 | _);) s[0 | o] = 0 | s[0 | l], o = o + 1 | 0, l = l + 1 | 0;
            return 0 | w
        }

        function T1(o) {
            return (255 & (o |= 0)) << 24 | (o >> 8 & 255) << 16 | (o >> 16 & 255) << 8 | o >>> 24
        }

        function Se(o, l, p) {
            return Z0(1), 0
        }

        var et = [function Rt(o) {
            return Z0(0), 0
        }, function J1(o) {
            var l, p;
            return l = M, M = M + 16 | 0, n[(p = l) >> 2] = 0 | function vt(o) {
                return 0 | (o |= 0)
            }(0 | n[60 + (o |= 0) >> 2]), o = 0 | Te(0 | p1(6, 0 | p)), M = l, 0 | o
        }], ue = [Se, function Tt(o, l, p) {
            l |= 0, p |= 0;
            var _, O = 0;
            return _ = M, M = M + 32 | 0, O = _, n[36 + (o |= 0) >> 2] = 4, !(64 & n[o >> 2]) && (n[O >> 2] = n[o + 60 >> 2], n[O + 4 >> 2] = 21523, n[O + 8 >> 2] = _ + 16, 0 | b(54, 0 | O)) && (s[o + 75 | 0] = -1), O = 0 | ve(o, l, p), M = _, 0 | O
        }, function X1(o, l, p) {
            var O, _, w;
            return l |= 0, p |= 0, _ = M, M = M + 32 | 0, O = _ + 20 | 0, n[(w = _) >> 2] = n[60 + (o |= 0) >> 2], n[w + 4 >> 2] = 0, n[w + 8 >> 2] = l, n[w + 12 >> 2] = O, n[w + 16 >> 2] = p, (0 | Te(0 | I(140, 0 | w))) < 0 ? (n[O >> 2] = -1, o = -1) : o = 0 | n[O >> 2], M = _, 0 | o
        }, function Ce(o, l, p) {
            var O, _;
            return j1(0 | (_ = 0 | n[(O = 20 + (o |= 0) | 0) >> 2]), 0 | (l |= 0), 0 | (o = (o = (0 | n[o + 16 >> 2]) - _ | 0) >>> 0 > (p |= 0) >>> 0 ? p : o)), n[O >> 2] = (0 | n[O >> 2]) + o, 0 | p
        }, ve, Se, Se, Se];
        return {
            _llvm_bswap_i32: T1, stackSave: function i0() {
                return 0 | M
            }, _i64Subtract: we, _llvm_cttz_i32: Je, setThrew: function j0(o, l) {
                0, x || (x = o |= 0)
            }, _bitshift64Lshr: Be, _bitshift64Shl: Ke, _fflush: function pt(o) {
                o |= 0;
                var l = 0;
                do {
                    if (o) {
                        if ((0 | n[o + 76 >> 2]) <= -1) {
                            l = 0 | Ue(o);
                            break
                        }
                        !0, l = 0 | Ue(o)
                    } else {
                        if (l = 0 | n[158] ? 0 | pt(0 | n[158]) : 0, o = 0 | n[(g0(4172), 1045)]) do {
                            0, (0 | n[o + 20 >> 2]) >>> 0 > (0 | n[o + 28 >> 2]) >>> 0 && (l = Ue(o) | l), o = 0 | n[o + 56 >> 2]
                        } while (0 | o);
                        P(4172)
                    }
                } while (0);
                return 0 | l
            }, _memset: Z1, _sbrk: fe, _memcpy: j1, stackAlloc: function e0(o) {
                var l;
                return l = M, M = 15 + (M = M + (o |= 0) | 0) & -16, 0 | l
            }, ___muldi3: Ze, ___uremdi3: $e, getTempRet0: function f1() {
                return 0 | q0
            }, ___udivmoddi4: Qe, setTempRet0: function a1(o) {
                q0 = o |= 0
            }, _i64Add: Ae, dynCall_iiii: function xt(o, l, p, O) {
                return 0 | ue[7 & (o |= 0)](0 | (l |= 0), 0 | (p |= 0), 0 | (O |= 0))
            }, _emscripten_get_global_libc: function K1() {
                return 4108
            }, dynCall_ii: function Dt(o, l) {
                return 0 | et[1 & (o |= 0)](0 | (l |= 0))
            }, ___udivdi3: xe, ___errno_location: L1, ___muldsi3: ut, _sha256_crypt: function s1(o, l) {
                o |= 0;
                var _, p = 0, O = 0;
                _ = 66 + (0 | ie(l |= 0)) | 0, O = 0 | n[902], p = 0 | n[901];
                do {
                    if ((0 | O) < (0 | _)) {
                        if (p = 0 | de(p, _)) {
                            n[901] = p, n[902] = _, O = _;
                            break
                        }
                        return 0
                    }
                } while (0);
                return 0 | function N1(o, l, p, O) {
                    o |= 0, p |= 0, O |= 0;
                    var S0, h0, B0, D0, W0, I0, u0, l0, u1, B1, O1, r1, x1, se, oe, ce, le, $1, F1, U0, C1, l1, z1, U1,
                        _ = 0, w = 0, q = 0, j = 0, Y = 0, J = 0, o0 = 0, n0 = 0, T0 = 0, M1 = 0, F0 = 0, o1 = 0, c1 = 0,
                        W1 = 0, he = 0, S1 = 0, t1 = 0, P1 = 0;
                    if (U1 = M, M = M + 432 | 0, o1 = U1, U0 = U1 + 392 | 0, C1 = U1 + 360 | 0, l1 = U1 + 184 | 0, z1 = U1 + 12 | 0, _ = U1 + 8 | 0, t1 = !(0 | Q1(760, l |= 0, 3)), 0 | Q1(l = t1 ? l + 3 | 0 : l, 764, 7) ? (M1 = 0, F0 = 5e3) : (F0 = 0 | function re(o, l, p) {
                        return p = 0 | function G1(o, l, p, O, _) {
                            o |= 0, l |= 0, p |= 0, O |= 0, _ |= 0;
                            var w, q, j, Y;
                            return Y = M, M = M + 128 | 0, n[(q = Y) >> 2] = 0, n[(j = q + 4 | 0) >> 2] = o, n[q + 44 >> 2] = o, n[(w = q + 8 | 0) >> 2] = (0 | o) < 0 ? -1 : o + 2147483647 | 0, n[q + 76 >> 2] = -1, Ne(q, 0), p = 0 | function v1(o, l, p, O, _) {
                                o |= 0, l |= 0, p |= 0, O |= 0, _ |= 0;
                                var w = 0, q = 0, j = 0, Y = 0, J = 0, o0 = 0, n0 = 0, T0 = 0, S0 = 0, h0 = 0;
                                e:do {
                                    if (l >>> 0 > 36) n[82] = 22, _ = 0, O = 0; else {
                                        h0 = o + 4 | 0, S0 = o + 100 | 0;
                                        do {
                                            (w = 0 | n[h0 >> 2]) >>> 0 < (0 | n[S0 >> 2]) >>> 0 ? (n[h0 >> 2] = w + 1, w = 0 | m[0 | w]) : w = 0 | V1(o)
                                        } while (0 | Ot(w));
                                        t:do {
                                            switch (0 | w) {
                                                case 43:
                                                case 45:
                                                    if (w = (45 == (0 | w)) << 31 >> 31, (q = 0 | n[h0 >> 2]) >>> 0 < (0 | n[S0 >> 2]) >>> 0) {
                                                        n[h0 >> 2] = q + 1, T0 = w, w = 0 | m[0 | q];
                                                        break t
                                                    }
                                                    T0 = w, w = 0 | V1(o);
                                                    break t;
                                                default:
                                                    T0 = 0
                                            }
                                        } while (0);
                                        q = !(0 | l);
                                        do {
                                            if (16 == (16 | l) & 48 == (0 | w)) {
                                                if ((w = 0 | n[h0 >> 2]) >>> 0 < (0 | n[S0 >> 2]) >>> 0 ? (n[h0 >> 2] = w + 1, w = 0 | m[0 | w]) : w = 0 | V1(o), 120 != (32 | w)) {
                                                    if (q) {
                                                        l = 8, o0 = 46;
                                                        break
                                                    }
                                                    o0 = 32;
                                                    break
                                                }
                                                if ((w = 0 | n[h0 >> 2]) >>> 0 < (0 | n[S0 >> 2]) >>> 0 ? (n[h0 >> 2] = w + 1, w = 0 | m[0 | w]) : w = 0 | V1(o), (0 | m[910 + w | 0]) > 15) {
                                                    if ((O = !!(0 | n[S0 >> 2])) && (n[h0 >> 2] = (0 | n[h0 >> 2]) - 1), !p) {
                                                        Ne(o, 0), _ = 0, O = 0;
                                                        break e
                                                    }
                                                    if (!O) {
                                                        _ = 0, O = 0;
                                                        break e
                                                    }
                                                    n[h0 >> 2] = (0 | n[h0 >> 2]) - 1, _ = 0, O = 0;
                                                    break e
                                                }
                                                l = 16, o0 = 46
                                            } else {
                                                if (!((0 | m[910 + w | 0]) >>> 0 < (l = q ? 10 : l) >>> 0)) {
                                                    0 | n[S0 >> 2] && (n[h0 >> 2] = (0 | n[h0 >> 2]) - 1), Ne(o, 0), n[82] = 22, _ = 0, O = 0;
                                                    break e
                                                }
                                                o0 = 32
                                            }
                                        } while (0);
                                        t:do {
                                            if (32 == (0 | o0)) if (10 == (0 | l)) {
                                                if ((l = w + -48 | 0) >>> 0 < 10) {
                                                    w = 0, q = l;
                                                    do {
                                                        w = (10 * w | 0) + q | 0, (l = 0 | n[h0 >> 2]) >>> 0 < (0 | n[S0 >> 2]) >>> 0 ? (n[h0 >> 2] = l + 1, l = 0 | m[0 | l]) : l = 0 | V1(o), q = l + -48 | 0
                                                    } while (q >>> 0 < 10 & w >>> 0 < 429496729);
                                                    p = 0
                                                } else l = w, w = 0, p = 0;
                                                if ((j = l + -48 | 0) >>> 0 < 10) {
                                                    q = l;
                                                    do {
                                                        if (l = 0 | Ze(0 | w, 0 | p, 10, 0), (Y = q0) >>> 0 > (n0 = ~(J = ((0 | j) < 0) << 31 >> 31)) >>> 0 | (0 | Y) == (0 | n0) & l >>> 0 > ~j >>> 0) {
                                                            l = 10, o0 = 72;
                                                            break t
                                                        }
                                                        w = 0 | Ae(0 | l, 0 | Y, 0 | j, 0 | J), p = q0, (l = 0 | n[h0 >> 2]) >>> 0 < (0 | n[S0 >> 2]) >>> 0 ? (n[h0 >> 2] = l + 1, q = 0 | m[0 | l]) : q = 0 | V1(o), j = q + -48 | 0
                                                    } while (j >>> 0 < 10 & (p >>> 0 < 429496729 | 429496729 == (0 | p) & w >>> 0 < 2576980378));
                                                    j >>> 0 > 9 ? (q = T0, l = p) : (l = 10, o0 = 72)
                                                } else q = T0, l = p
                                            } else o0 = 46
                                        } while (0);
                                        t:do {
                                            if (46 == (0 | o0)) {
                                                if (!(l + -1 & l)) {
                                                    if (o0 = 0 | s[1166 + ((23 * l | 0) >>> 5 & 7) | 0], (q = 255 & (p = 0 | s[910 + w | 0])) >>> 0 < l >>> 0) {
                                                        w = 0, j = q;
                                                        do {
                                                            w = j | w << o0, (q = 0 | n[h0 >> 2]) >>> 0 < (0 | n[S0 >> 2]) >>> 0 ? (n[h0 >> 2] = q + 1, q = 0 | m[0 | q]) : q = 0 | V1(o), j = 255 & (p = 0 | s[910 + q | 0])
                                                        } while (w >>> 0 < 134217728 & j >>> 0 < l >>> 0);
                                                        j = 0
                                                    } else q = w, j = 0, w = 0;
                                                    if (Y = 0 | Be(-1, -1, 0 | o0), (255 & p) >>> 0 >= l >>> 0 | j >>> 0 > (J = q0) >>> 0 | (0 | j) == (0 | J) & w >>> 0 > Y >>> 0) {
                                                        p = j, o0 = 72;
                                                        break
                                                    }
                                                    for (q = j; ;) {
                                                        if (w = 0 | Ke(0 | w, 0 | q, 0 | o0), j = q0, w |= 255 & p, (q = 0 | n[h0 >> 2]) >>> 0 < (0 | n[S0 >> 2]) >>> 0 ? (n[h0 >> 2] = q + 1, q = 0 | m[0 | q]) : q = 0 | V1(o), (255 & (p = 0 | s[910 + q | 0])) >>> 0 >= l >>> 0 | j >>> 0 > J >>> 0 | (0 | j) == (0 | J) & w >>> 0 > Y >>> 0) {
                                                            p = j, o0 = 72;
                                                            break t
                                                        }
                                                        q = j
                                                    }
                                                }
                                                if ((q = 255 & (p = 0 | s[910 + w | 0])) >>> 0 < l >>> 0) {
                                                    w = 0, j = q;
                                                    do {
                                                        w = j + (0 | X0(w, l)) | 0, (q = 0 | n[h0 >> 2]) >>> 0 < (0 | n[S0 >> 2]) >>> 0 ? (n[h0 >> 2] = q + 1, q = 0 | m[0 | q]) : q = 0 | V1(o), j = 255 & (p = 0 | s[910 + q | 0])
                                                    } while (w >>> 0 < 119304647 & j >>> 0 < l >>> 0);
                                                    j = 0
                                                } else q = w, w = 0, j = 0;
                                                if ((255 & p) >>> 0 < l >>> 0) for (o0 = 0 | xe(-1, -1, 0 | l, 0), n0 = q0, J = j; ;) {
                                                    if (J >>> 0 > n0 >>> 0 | (0 | J) == (0 | n0) & w >>> 0 > o0 >>> 0) {
                                                        p = J, o0 = 72;
                                                        break t
                                                    }
                                                    if (j = 0 | Ze(0 | w, 0 | J, 0 | l, 0), (Y = q0) >>> 0 > 4294967295 | -1 == (0 | Y) & j >>> 0 > ~(p &= 255) >>> 0) {
                                                        p = J, o0 = 72;
                                                        break t
                                                    }
                                                    if (w = 0 | Ae(0 | p, 0, 0 | j, 0 | Y), j = q0, (q = 0 | n[h0 >> 2]) >>> 0 < (0 | n[S0 >> 2]) >>> 0 ? (n[h0 >> 2] = q + 1, q = 0 | m[0 | q]) : q = 0 | V1(o), (255 & (p = 0 | s[910 + q | 0])) >>> 0 >= l >>> 0) {
                                                        p = j, o0 = 72;
                                                        break
                                                    }
                                                    J = j
                                                } else p = j, o0 = 72
                                            }
                                        } while (0);
                                        if (72 == (0 | o0)) if ((0 | m[910 + q | 0]) >>> 0 < l >>> 0) {
                                            do {
                                                (w = 0 | n[h0 >> 2]) >>> 0 < (0 | n[S0 >> 2]) >>> 0 ? (n[h0 >> 2] = w + 1, w = 0 | m[0 | w]) : w = 0 | V1(o)
                                            } while ((0 | m[910 + w | 0]) >>> 0 < l >>> 0);
                                            n[82] = 34, q = !0 & !(1 & O) ? T0 : 0, l = _, w = O
                                        } else q = T0, l = p;
                                        if (0 | n[S0 >> 2] && (n[h0 >> 2] = (0 | n[h0 >> 2]) - 1), !(l >>> 0 < _ >>> 0 | (0 | l) == (0 | _) & w >>> 0 < O >>> 0)) {
                                            if (!(!1 | !!(1 & O) | !!(0 | q))) {
                                                n[82] = 34, O = 0 | Ae(0 | O, 0 | _, -1, -1), _ = q0;
                                                break
                                            }
                                            if (l >>> 0 > _ >>> 0 | (0 | l) == (0 | _) & w >>> 0 > O >>> 0) {
                                                n[82] = 34;
                                                break
                                            }
                                        }
                                        O = 0 | we(w ^ q, l ^ (O = ((0 | q) < 0) << 31 >> 31), 0 | q, 0 | O), _ = q0
                                    }
                                } while (0);
                                return q0 = _, 0 | O
                            }(q, p, 1, O, _), 0 | l && (n[l >> 2] = o + ((0 | n[j >> 2]) + (0 | n[q + 108 >> 2]) - (0 | n[w >> 2]))), M = Y, 0 | p
                        }(o |= 0, l |= 0, p |= 0, -1, 0), 0 | p
                    }(l + 7 | 0, _, 10), F0 = F0 >>> 0 < 999999999 ? F0 : 999999999, M1 = S1 = 36 == (0 | s[0 | (t1 = 0 | n[_ >> 2])]), F0 = S1 ? F0 >>> 0 > 1e3 ? F0 : 1e3 : 5e3, l = S1 ? t1 + 1 | 0 : l), B1 = 0 | function Wt(o, l) {
                        o |= 0;
                        var O, w, p = 0, _ = 0, q = 0;
                        w = M, M = M + 32 | 0, O = w, p = 0 | s[0 | (l |= 0)];
                        e:do {
                            if (p << 24 >> 24 && 0 | s[l + 1 | 0]) {
                                n[O >> 2] = 0, n[O + 4 >> 2] = 0, n[O + 8 >> 2] = 0, n[O + 12 >> 2] = 0, n[O + 16 >> 2] = 0, n[O + 20 >> 2] = 0, n[O + 24 >> 2] = 0, n[O + 28 >> 2] = 0;
                                do {
                                    n[(q = O + (((255 & p) >>> 5 & 255) << 2) | 0) >> 2] = n[q >> 2] | 1 << (31 & p), p = 0 | s[0 | (l = l + 1 | 0)]
                                } while (p << 24 >> 24);
                                if ((p = 0 | s[0 | o]) << 24 >> 24) {
                                    l = o;
                                    do {
                                        if (n[O + (((255 & p) >>> 5 & 255) << 2) >> 2] & 1 << (31 & p)) break e;
                                        p = 0 | s[0 | (l = l + 1 | 0)]
                                    } while (p << 24 >> 24)
                                } else l = o
                            } else _ = 3
                        } while (0);
                        return 3 == (0 | _) && (l = 0 | function wt(o, l) {
                            o |= 0;
                            var p = 0, O = 0, _ = 0;
                            O = 255 & (l |= 0);
                            e:do {
                                if (O) {
                                    if (3 & o) {
                                        p = 255 & l;
                                        do {
                                            if (!((_ = 0 | s[0 | o]) << 24 >> 24) || _ << 24 >> 24 == p << 24 >> 24) break e;
                                            o = o + 1 | 0
                                        } while (3 & o)
                                    }
                                    O = 0 | X0(O, 16843009), p = 0 | n[o >> 2];
                                    t:do {
                                        if (!((-2139062144 & p ^ -2139062144) & p + -16843009)) do {
                                            if ((-2139062144 & (_ = p ^ O) ^ -2139062144) & _ + -16843009) break t;
                                            p = 0 | n[(o = o + 4 | 0) >> 2]
                                        } while (!((-2139062144 & p ^ -2139062144) & p + -16843009))
                                    } while (0);
                                    for (p = 255 & l; (_ = 0 | s[0 | o]) << 24 >> 24 && _ << 24 >> 24 != p << 24 >> 24;) o = o + 1 | 0
                                } else o = o + (0 | ie(o)) | 0
                            } while (0);
                            return 0 | o
                        }(o, p << 24 >> 24)), M = w, l - o | 0
                    }(l, 772), S1 = B1 >>> 0 < 16 ? B1 : 16, t1 = 0 | ie(o), 3 & o ? (W1 = M, M = M + (15 + (1 * (t1 + 4 | 0) | 0) & -16) | 0, j1(0 | (W1 = W1 + 4 | 0), 0 | o, 0 | t1), o = W1) : W1 = 0, 3 & l ? (c1 = M, M = M + (15 + (1 * (S1 + 4 | 0) | 0) & -16) | 0, j1(0 | (c1 = c1 + 4 | 0), 0 | l, 0 | S1), he = c1, l = c1) : he = 0, n[l1 >> 2] = 1779033703, n[(O1 = l1 + 4 | 0) >> 2] = -1150833019, n[(r1 = l1 + 8 | 0) >> 2] = 1013904242, n[(x1 = l1 + 12 | 0) >> 2] = -1521486534, n[(se = l1 + 16 | 0) >> 2] = 1359893119, n[(oe = l1 + 20 | 0) >> 2] = -1694144372, n[(ce = l1 + 24 | 0) >> 2] = 528734635, n[(le = l1 + 28 | 0) >> 2] = 1541459225, n[($1 = l1 + 36 | 0) >> 2] = 0, n[(F1 = l1 + 32 | 0) >> 2] = 0, n[(c1 = l1 + 40 | 0) >> 2] = 0, g1(o, t1, l1), g1(l, S1, l1), n[z1 >> 2] = 1779033703, n[(T0 = z1 + 4 | 0) >> 2] = -1150833019, n[(S0 = z1 + 8 | 0) >> 2] = 1013904242, n[(h0 = z1 + 12 | 0) >> 2] = -1521486534, n[(B0 = z1 + 16 | 0) >> 2] = 1359893119, n[(D0 = z1 + 20 | 0) >> 2] = -1694144372, n[(W0 = z1 + 24 | 0) >> 2] = 528734635, n[(I0 = z1 + 28 | 0) >> 2] = 1541459225, n[(u0 = z1 + 36 | 0) >> 2] = 0, n[(l0 = z1 + 32 | 0) >> 2] = 0, n[(u1 = z1 + 40 | 0) >> 2] = 0, g1(o, t1, z1), g1(l, S1, z1), g1(o, t1, z1), y1(z1, U0), t1 >>> 0 > 32) {
                        w = t1 + -33 & -32, _ = t1;
                        do {
                            g1(U0, 32, l1), _ = _ + -32 | 0
                        } while (_ >>> 0 > 32);
                        _ = t1 + -32 - w | 0
                    } else _ = t1;
                    if (g1(U0, _, l1), !(w = !(0 | t1))) {
                        _ = t1;
                        do {
                            1 & _ ? g1(U0, 32, l1) : g1(o, t1, l1), _ >>>= 1
                        } while (0 | _)
                    }
                    if (y1(l1, U0), n[z1 >> 2] = 1779033703, n[T0 >> 2] = -1150833019, n[S0 >> 2] = 1013904242, n[h0 >> 2] = -1521486534, n[B0 >> 2] = 1359893119, n[D0 >> 2] = -1694144372, n[W0 >> 2] = 528734635, n[I0 >> 2] = 1541459225, n[u0 >> 2] = 0, n[l0 >> 2] = 0, n[u1 >> 2] = 0, w) y1(z1, C1), Y = M, M = M + (15 + (1 * t1 | 0) & -16) | 0, o = Y, _ = 0; else {
                        _ = 0;
                        do {
                            g1(o, t1, z1), _ = _ + 1 | 0
                        } while ((0 | _) != (0 | t1));
                        if (y1(z1, C1), Y = M, M = M + (15 + (1 * t1 | 0) & -16) | 0, t1 >>> 0 > 31) {
                            for (o = Y + (32 + (j = -32 & (q = t1 + -32 | 0))) | 0, _ = Y, w = t1; ;) {
                                o0 = C1, n0 = (J = _) + 32 | 0;
                                do {
                                    s[0 | J] = 0 | s[0 | o0], J = J + 1 | 0, o0 = o0 + 1 | 0
                                } while ((0 | J) < (0 | n0));
                                if ((w = w + -32 | 0) >>> 0 <= 31) break;
                                _ = _ + 32 | 0
                            }
                            _ = q - j | 0
                        } else o = Y, _ = t1
                    }
                    j1(0 | o, 0 | C1, 0 | _), n[z1 >> 2] = 1779033703, n[T0 >> 2] = -1150833019, n[S0 >> 2] = 1013904242, n[h0 >> 2] = -1521486534, n[B0 >> 2] = 1359893119, n[D0 >> 2] = -1694144372, n[W0 >> 2] = 528734635, n[I0 >> 2] = 1541459225, n[u0 >> 2] = 0, n[l0 >> 2] = 0, n[u1 >> 2] = 0, _ = 0;
                    do {
                        g1(l, S1, z1), _ = _ + 1 | 0
                    } while (_ >>> 0 < (16 + (0 | m[0 | U0]) | 0) >>> 0);
                    if (y1(z1, C1), T0 = M, M = M + (15 + (1 * S1 | 0) & -16) | 0, S1 >>> 0 > 31) {
                        for (w = -33 - ((w = ~B1) >>> 0 > 4294967279 ? w : -17) | 0, o = T0, _ = B1; ;) {
                            o0 = C1, n0 = (J = o) + 32 | 0;
                            do {
                                s[0 | J] = 0 | s[0 | o0], J = J + 1 | 0, o0 = o0 + 1 | 0
                            } while ((0 | J) < (0 | n0));
                            if ((_ = _ + -32 | 0) >>> 0 <= 31) break;
                            o = o + 32 | 0
                        }
                        _ = w + 32 | 0
                    } else _ = S1;
                    if (j1(0 | T0, 0 | C1, 0 | _), 0 | F0) {
                        _ = 0;
                        do {
                            n[l1 >> 2] = 1779033703, n[O1 >> 2] = -1150833019, n[r1 >> 2] = 1013904242, n[x1 >> 2] = -1521486534, n[se >> 2] = 1359893119, n[oe >> 2] = -1694144372, n[ce >> 2] = 528734635, n[le >> 2] = 1541459225, n[$1 >> 2] = 0, n[F1 >> 2] = 0, n[c1 >> 2] = 0, (o = !!(1 & _)) ? g1(Y, t1, l1) : g1(U0, 32, l1), (_ >>> 0) % 3 | 0 && g1(T0, S1, l1), (_ >>> 0) % 7 | 0 && g1(Y, t1, l1), o ? g1(U0, 32, l1) : g1(Y, t1, l1), y1(l1, U0), _ = _ + 1 | 0
                        } while ((0 | _) != (0 | F0))
                    }
                    _ = 0 | ft(p, 760, (0 | O) > 0 ? O : 0), o = O + -3 | 0, M1 && (n[o1 >> 2] = 764, n[o1 + 4 >> 2] = F0, o1 = 0 | function Bt(o, l, p, O) {
                        o |= 0, l |= 0, p |= 0;
                        var _, w;
                        return _ = M, M = M + 16 | 0, n[(w = _) >> 2] = O |= 0, O = 0 | function ae(o, l, p, O) {
                            o |= 0, l |= 0, p |= 0, O |= 0;
                            var j, o0, _ = 0, w = 0, q = 0, Y = 0, J = 0;
                            o0 = M, M = M + 128 | 0, _ = o0 + 124 | 0, q = 636, j = (w = J = o0) + 124 | 0;
                            do {
                                n[w >> 2] = n[q >> 2], w = w + 4 | 0, q = q + 4 | 0
                            } while ((0 | w) < (0 | j));
                            return (l + -1 | 0) >>> 0 > 2147483646 ? l ? (n[82] = 75, l = -1) : (o = _, l = 1, Y = 4) : Y = 4, 4 == (0 | Y) && (n[J + 48 >> 2] = Y = l >>> 0 > (Y = -2 - o | 0) >>> 0 ? Y : l, n[(_ = J + 20 | 0) >> 2] = o, n[J + 44 >> 2] = o, l = o + Y | 0, n[(o = J + 16 | 0) >> 2] = l, n[J + 28 >> 2] = l, l = 0 | function me(o, l, p) {
                                o |= 0, l |= 0, p |= 0;
                                var o0, n0, S0, h0, B0, O = 0, _ = 0, w = 0, q = 0, j = 0, Y = 0, J = 0;
                                B0 = M, M = M + 224 | 0, o0 = B0 + 120 | 0, S0 = B0, h0 = B0 + 136 | 0, _ = (O = n0 = B0 + 80 | 0) + 40 | 0;
                                do {
                                    n[O >> 2] = 0, O = O + 4 | 0
                                } while ((0 | O) < (0 | _));
                                return n[o0 >> 2] = n[p >> 2], (0 | Ve(0, l, o0, S0, n0)) < 0 ? p = -1 : (0, J = 32 & (p = 0 | n[o >> 2]), (0 | s[o + 74 | 0]) < 1 && (n[o >> 2] = -33 & p), 0 | n[(O = o + 48 | 0) >> 2] ? p = 0 | Ve(o, l, o0, S0, n0) : (w = 0 | n[(_ = o + 44 | 0) >> 2], n[_ >> 2] = h0, n[(q = o + 28 | 0) >> 2] = h0, n[(j = o + 20 | 0) >> 2] = h0, n[O >> 2] = 80, n[(Y = o + 16 | 0) >> 2] = h0 + 80, p = 0 | Ve(o, l, o0, S0, n0), w && (ue[7 & n[o + 36 >> 2]](o, 0, 0), p = 0 | n[j >> 2] ? p : -1, n[_ >> 2] = w, n[O >> 2] = 0, n[Y >> 2] = 0, n[q >> 2] = 0, n[j >> 2] = 0)), n[o >> 2] = (O = 0 | n[o >> 2]) | J, p = 32 & O ? -1 : p), M = B0, 0 | p
                            }(J, p, O), Y && (s[(J = 0 | n[_ >> 2]) + (((0 | J) == (0 | n[o >> 2])) << 31 >> 31) | 0] = 0)), M = o0, 0 | l
                        }(o, l, p, w), M = _, 0 | O
                    }(_, (0 | o) > 0 ? o : 0, 774, o1), o = o - o1 | 0, _ = _ + o1 | 0), w = 0 | ft(_, l, o1 = (o1 = (0 | o) > 0 ? o : 0) >>> 0 < S1 >>> 0 ? o1 : S1), l = o - o1 | 0;
                    do {
                        if ((0 | l) > 0 && (s[0 | w] = 36, 1 != (0 | l))) {
                            for (o = 4, q = m[U0 + 10 | 0] << 8 | m[0 | U0] << 16 | m[U0 + 20 | 0], _ = l + -1 | 0, l = w + 1 | 0; j = l, l = l + 1 | 0, s[0 | j] = 0 | s[781 + (63 & q) | 0], j = _ + -1 | 0, (0 | _) > 1 & (0 | o) > 1;) o = o + -1 | 0, q >>>= 6, _ = j;
                            if ((0 | _) > 1) {
                                for (o = 4, w = m[U0 + 1 | 0] << 8 | m[U0 + 21 | 0] << 16 | m[U0 + 11 | 0], _ = j; q = l, l = l + 1 | 0, s[0 | q] = 0 | s[781 + (63 & w) | 0], q = _ + -1 | 0, (0 | _) > 1 & (0 | o) > 1;) o = o + -1 | 0, w >>>= 6, _ = q;
                                if ((0 | _) > 1) {
                                    for (o = 4, w = m[U0 + 22 | 0] << 8 | m[U0 + 12 | 0] << 16 | m[U0 + 2 | 0], _ = q; q = l, l = l + 1 | 0, s[0 | q] = 0 | s[781 + (63 & w) | 0], q = _ + -1 | 0, (0 | _) > 1 & (0 | o) > 1;) o = o + -1 | 0, w >>>= 6, _ = q;
                                    if ((0 | _) > 1) {
                                        for (o = 4, w = m[U0 + 13 | 0] << 8 | m[U0 + 3 | 0] << 16 | m[U0 + 23 | 0], _ = q; j = l, l = l + 1 | 0, s[0 | j] = 0 | s[781 + (63 & w) | 0], j = _ + -1 | 0, (0 | _) > 1 & (0 | o) > 1;) o = o + -1 | 0, w >>>= 6, _ = j;
                                        if ((0 | _) > 1) {
                                            for (w = 4, q = m[U0 + 4 | 0] << 8 | m[U0 + 24 | 0] << 16 | m[U0 + 14 | 0], _ = j; o = l, l = l + 1 | 0, s[0 | o] = 0 | s[781 + (63 & q) | 0], o = _ + -1 | 0, (0 | _) > 1 & (0 | w) > 1;) w = w + -1 | 0, q >>>= 6, _ = o;
                                            if ((0 | _) > 1) {
                                                for (w = 4, q = m[U0 + 25 | 0] << 8 | m[U0 + 15 | 0] << 16 | m[U0 + 5 | 0]; _ = l, l = l + 1 | 0, s[0 | _] = 0 | s[781 + (63 & q) | 0], _ = o + -1 | 0, (0 | o) > 1 & (0 | w) > 1;) w = w + -1 | 0, q >>>= 6, o = _;
                                                if ((0 | o) > 1) {
                                                    for (o = 4, w = m[U0 + 16 | 0] << 8 | m[U0 + 6 | 0] << 16 | m[U0 + 26 | 0]; q = l, l = l + 1 | 0, s[0 | q] = 0 | s[781 + (63 & w) | 0], q = _ + -1 | 0, (0 | _) > 1 & (0 | o) > 1;) o = o + -1 | 0, w >>>= 6, _ = q;
                                                    if ((0 | _) > 1) {
                                                        for (o = 4, w = m[U0 + 7 | 0] << 8 | m[U0 + 27 | 0] << 16 | m[U0 + 17 | 0], _ = q; j = l, l = l + 1 | 0, s[0 | j] = 0 | s[781 + (63 & w) | 0], j = _ + -1 | 0, (0 | _) > 1 & (0 | o) > 1;) o = o + -1 | 0, w >>>= 6, _ = j;
                                                        if ((0 | _) > 1) {
                                                            for (w = 4, q = m[U0 + 28 | 0] << 8 | m[U0 + 18 | 0] << 16 | m[U0 + 8 | 0], _ = j; o = l, l = l + 1 | 0, s[0 | o] = 0 | s[781 + (63 & q) | 0], o = _ + -1 | 0, (0 | _) > 1 & (0 | w) > 1;) w = w + -1 | 0, q >>>= 6, _ = o;
                                                            if ((0 | _) <= 1) {
                                                                P1 = 78;
                                                                break
                                                            }
                                                            for (w = 4, q = m[U0 + 19 | 0] << 8 | m[U0 + 9 | 0] << 16 | m[U0 + 29 | 0]; _ = l, l = l + 1 | 0, s[0 | _] = 0 | s[781 + (63 & q) | 0], _ = o + -1 | 0, (0 | o) > 1 & (0 | w) > 1;) w = w + -1 | 0, q >>>= 6, o = _;
                                                            if ((0 | o) <= 1) {
                                                                P1 = 78;
                                                                break
                                                            }
                                                            for (o = m[U0 + 31 | 0] << 8 | m[U0 + 30 | 0], w = 3; o1 = l, l = l + 1 | 0, s[0 | o1] = 0 | s[781 + (63 & o) | 0], (0 | _) > 1 & (0 | w) > 1;) o >>>= 6, w = w + -1 | 0, _ = _ + -1 | 0;
                                                            if ((0 | _) < 2) {
                                                                P1 = 78;
                                                                break
                                                            }
                                                            s[0 | l] = 0, l = p
                                                        } else P1 = 78
                                                    } else P1 = 78
                                                } else P1 = 78
                                            } else P1 = 78
                                        } else P1 = 78
                                    } else P1 = 78
                                } else P1 = 78
                            } else P1 = 78
                        } else P1 = 78
                    } while (0);
                    return 78 == (0 | P1) && (n[82] = 34, l = 0), n[l1 >> 2] = 1779033703, n[O1 >> 2] = -1150833019, n[r1 >> 2] = 1013904242, n[x1 >> 2] = -1521486534, n[se >> 2] = 1359893119, n[oe >> 2] = -1694144372, n[ce >> 2] = 528734635, n[le >> 2] = 1541459225, n[$1 >> 2] = 0, n[F1 >> 2] = 0, n[c1 >> 2] = 0, y1(l1, U0), n[C1 >> 2] = 0, n[C1 + 4 >> 2] = 0, n[C1 + 8 >> 2] = 0, n[C1 + 12 >> 2] = 0, n[C1 + 16 >> 2] = 0, n[C1 + 20 >> 2] = 0, n[C1 + 24 >> 2] = 0, n[C1 + 28 >> 2] = 0, Z1(0 | Y, 0, 0 | t1), Z1(0 | T0, 0, 0 | S1), Z1(0 | l1, 0, 172), Z1(0 | z1, 0, 172), 0 | W1 && Z1(0 | W1, 0, 0 | t1), he ? (Z1(0 | he, 0, 0 | S1), M = U1, 0 | l) : (M = U1, 0 | l)
                }(o, l, p, O)
            }, _free: Y1, runPostSets: function Ye() {
            }, establishStackSpace: function P0(o, l) {
                M = o |= 0, 0
            }, stackRestore: function f0(o) {
                M = o |= 0
            }, _malloc: R1
        }
    }(Module.asmGlobalArg, Module.asmLibraryArg, buffer), _llvm_bswap_i32 = Module._llvm_bswap_i32 = asm._llvm_bswap_i32,
    stackSave = Module.stackSave = asm.stackSave, getTempRet0 = Module.getTempRet0 = asm.getTempRet0,
    _memset = Module._memset = asm._memset, setThrew = Module.setThrew = asm.setThrew,
    _bitshift64Lshr = Module._bitshift64Lshr = asm._bitshift64Lshr,
    _bitshift64Shl = Module._bitshift64Shl = asm._bitshift64Shl, _fflush = Module._fflush = asm._fflush,
    _llvm_cttz_i32 = Module._llvm_cttz_i32 = asm._llvm_cttz_i32, _sbrk = Module._sbrk = asm._sbrk,
    _memcpy = Module._memcpy = asm._memcpy, stackAlloc = Module.stackAlloc = asm.stackAlloc,
    ___muldi3 = Module.___muldi3 = asm.___muldi3, ___uremdi3 = Module.___uremdi3 = asm.___uremdi3,
    _i64Subtract = Module._i64Subtract = asm._i64Subtract, ___udivmoddi4 = Module.___udivmoddi4 = asm.___udivmoddi4,
    setTempRet0 = Module.setTempRet0 = asm.setTempRet0, _i64Add = Module._i64Add = asm._i64Add,
    _emscripten_get_global_libc = Module._emscripten_get_global_libc = asm._emscripten_get_global_libc,
    ___udivdi3 = Module.___udivdi3 = asm.___udivdi3,
    ___errno_location = Module.___errno_location = asm.___errno_location,
    ___muldsi3 = Module.___muldsi3 = asm.___muldsi3, _sha256_crypt = Module._sha256_crypt = asm._sha256_crypt,
    _free = Module._free = asm._free, runPostSets = Module.runPostSets = asm.runPostSets,
    establishStackSpace = Module.establishStackSpace = asm.establishStackSpace,
    stackRestore = Module.stackRestore = asm.stackRestore, _malloc = Module._malloc = asm._malloc,
    dynCall_ii = Module.dynCall_ii = asm.dynCall_ii, dynCall_iiii = Module.dynCall_iiii = asm.dynCall_iiii;
if (Runtime.stackAlloc = Module.stackAlloc, Runtime.stackSave = Module.stackSave, Runtime.stackRestore = Module.stackRestore, Runtime.establishStackSpace = Module.establishStackSpace, Runtime.setTempRet0 = Module.setTempRet0, Runtime.getTempRet0 = Module.getTempRet0, Module.asm = asm, memoryInitializer) if ("function" == typeof Module.locateFile ? memoryInitializer = Module.locateFile(memoryInitializer) : Module.memoryInitializerPrefixURL && (memoryInitializer = Module.memoryInitializerPrefixURL + memoryInitializer), ENVIRONMENT_IS_NODE || ENVIRONMENT_IS_SHELL) {
    var data = Module.readBinary(memoryInitializer);
    HEAPU8.set(data, Runtime.GLOBAL_BASE)
} else {
    let e = function () {
        Module.readAsync(memoryInitializer, applyMemoryInitializer, function () {
            throw "could not load memory initializer " + memoryInitializer
        })
    };
    addRunDependency("memory initializer");
    var applyMemoryInitializer = function (r) {
        r.byteLength && (r = new Uint8Array(r)), HEAPU8.set(r, Runtime.GLOBAL_BASE), Module.memoryInitializerRequest && delete Module.memoryInitializerRequest.response, removeRunDependency("memory initializer")
    };
    if (Module.memoryInitializerRequest) {
        let r = function () {
            var a = Module.memoryInitializerRequest;
            if (200 !== a.status && 0 !== a.status) return console.warn("a problem seems to have happened with Module.memoryInitializerRequest, status: " + a.status + ", retrying " + memoryInitializer), void e();
            applyMemoryInitializer(a.response)
        };
        Module.memoryInitializerRequest.response ? setTimeout(r, 0) : Module.memoryInitializerRequest.addEventListener("load", r)
    } else e()
}

function ExitStatus(e) {
    this.name = "ExitStatus", this.message = "Program terminated with exit(" + e + ")", this.status = e
}

ExitStatus.prototype = new Error, ExitStatus.prototype.constructor = ExitStatus;
var initialStackTop, preloadStartTime = null, calledMain = !1;

function run(e) {
    function r() {
        Module.calledRun || (Module.calledRun = !0, !ABORT && (ensureInitRuntime(), preMain(), Module.onRuntimeInitialized && Module.onRuntimeInitialized(), Module._main && shouldRunNow && Module.callMain(e), postRun()))
    }

    e = e || Module.arguments, null === preloadStartTime && (preloadStartTime = Date.now()), runDependencies > 0 || (preRun(), runDependencies > 0) || Module.calledRun || (Module.setStatus ? (Module.setStatus("Running..."), setTimeout(function () {
        setTimeout(function () {
            Module.setStatus("")
        }, 1), r()
    }, 1)) : r())
}

function exit(e, r) {
    r && Module.noExitRuntime || (Module.noExitRuntime || (ABORT = !0, EXITSTATUS = e, STACKTOP = initialStackTop, exitRuntime(), Module.onExit && Module.onExit(e)), ENVIRONMENT_IS_NODE && process.exit(e), Module.quit(e, new ExitStatus(e)))
}

dependenciesFulfilled = function e() {
    Module.calledRun || run(), Module.calledRun || (dependenciesFulfilled = e)
}, Module.callMain = Module.callMain = function e(r) {
    r = r || [], ensureInitRuntime();
    var a = r.length + 1;

    function s() {
        for (var R = 0; R < 3; R++) h.push(0)
    }

    var h = [allocate(intArrayFromString(Module.thisProgram), "i8", ALLOC_NORMAL)];
    s();
    for (var n = 0; n < a - 1; n += 1) h.push(allocate(intArrayFromString(r[n]), "i8", ALLOC_NORMAL)), s();
    h.push(0), h = allocate(h, "i32", ALLOC_NORMAL);
    try {
        exit(Module._main(a, h, 0), !0)
    } catch (R) {
        if (R instanceof ExitStatus) return;
        if ("SimulateInfiniteLoop" == R) return void (Module.noExitRuntime = !0);
        var T = R;
        R && "object" == typeof R && R.stack && (T = [R, R.stack]), Module.printErr("exception thrown: " + T), Module.quit(1, R)
    } finally {
        calledMain = !0
    }
}, Module.run = Module.run = run, Module.exit = Module.exit = exit;
var abortDecorators = [];

function abort(e) {
    Module.onAbort && Module.onAbort(e), void 0 !== e ? (Module.print(e), Module.printErr(e), e = JSON.stringify(e)) : e = "", ABORT = !0, EXITSTATUS = 1;
    var a = "abort(" + e + ") at " + stackTrace() + "\nIf this abort() is unexpected, build with -s ASSERTIONS=1 which can give more information.";
    throw abortDecorators && abortDecorators.forEach(function (s) {
        a = s(a, e)
    }), a
}

if (Module.abort = Module.abort = abort, Module.preInit) for ("function" == typeof Module.preInit && (Module.preInit = [Module.preInit]); Module.preInit.length > 0;) Module.preInit.pop()();
var shouldRunNow = !0;
Module.noInitialRun && (shouldRunNow = !1), run(), function (e, r) {
    "object" == typeof exports && typeof module < "u" ? module.exports = r() : "function" == typeof define && define.amd ? define(r) : e.moment = r()
}(this, function () {
    var e, v;

    function r() {
        return e.apply(null, arguments)
    }

    function s(c) {
        return c instanceof Array || "[object Array]" === Object.prototype.toString.call(c)
    }

    function h(c) {
        return null != c && "[object Object]" === Object.prototype.toString.call(c)
    }

    function n(c, f) {
        return Object.prototype.hasOwnProperty.call(c, f)
    }

    function m(c) {
        if (Object.getOwnPropertyNames) return 0 === Object.getOwnPropertyNames(c).length;
        var f;
        for (f in c) if (n(c, f)) return !1;
        return !0
    }

    function T(c) {
        return void 0 === c
    }

    function R(c) {
        return "number" == typeof c || "[object Number]" === Object.prototype.toString.call(c)
    }

    function k(c) {
        return c instanceof Date || "[object Date]" === Object.prototype.toString.call(c)
    }

    function U(c, f) {
        var X, N = [];
        for (X = 0; X < c.length; ++X) N.push(f(c[X], X));
        return N
    }

    function W(c, f) {
        for (var N in f) n(f, N) && (c[N] = f[N]);
        return n(f, "toString") && (c.toString = f.toString), n(f, "valueOf") && (c.valueOf = f.valueOf), c
    }

    function S(c, f, N, X) {
        return Kt(c, f, N, X, !0).utc()
    }

    function M(c) {
        return null == c._pf && (c._pf = {
            empty: !1,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: !1,
            invalidEra: null,
            invalidMonth: null,
            invalidFormat: !1,
            userInvalidated: !1,
            iso: !1,
            parsedDateParts: [],
            era: null,
            meridiem: null,
            rfc2822: !1,
            weekdayMismatch: !1
        }), c._pf
    }

    function g(c) {
        if (null == c._isValid) {
            var f = M(c), N = v.call(f.parsedDateParts, function (K) {
                    return null != K
                }),
                X = !isNaN(c._d.getTime()) && f.overflow < 0 && !f.empty && !f.invalidEra && !f.invalidMonth && !f.invalidWeekday && !f.weekdayMismatch && !f.nullInput && !f.invalidFormat && !f.userInvalidated && (!f.meridiem || f.meridiem && N);
            if (c._strict && (X = X && 0 === f.charsLeftOver && 0 === f.unusedTokens.length && void 0 === f.bigHour), null != Object.isFrozen && Object.isFrozen(c)) return X;
            c._isValid = X
        }
        return c._isValid
    }

    function x(c) {
        var f = S(NaN);
        return null != c ? W(M(f), c) : M(f).userInvalidated = !0, f
    }

    v = Array.prototype.some ? Array.prototype.some : function (c) {
        var X, f = Object(this), N = f.length >>> 0;
        for (X = 0; X < N; X++) if (X in f && c.call(this, f[X], X, f)) return !0;
        return !1
    };
    var Q = r.momentProperties = [], t0 = !1;

    function s0(c, f) {
        var N, X, K;
        if (T(f._isAMomentObject) || (c._isAMomentObject = f._isAMomentObject), T(f._i) || (c._i = f._i), T(f._f) || (c._f = f._f), T(f._l) || (c._l = f._l), T(f._strict) || (c._strict = f._strict), T(f._tzm) || (c._tzm = f._tzm), T(f._isUTC) || (c._isUTC = f._isUTC), T(f._offset) || (c._offset = f._offset), T(f._pf) || (c._pf = M(f)), T(f._locale) || (c._locale = f._locale), Q.length > 0) for (N = 0; N < Q.length; N++) T(K = f[X = Q[N]]) || (c[X] = K);
        return c
    }

    function M0(c) {
        s0(this, c), this._d = new Date(null != c._d ? c._d.getTime() : NaN), this.isValid() || (this._d = new Date(NaN)), !1 === t0 && (t0 = !0, r.updateOffset(this), t0 = !1)
    }

    function a0(c) {
        return c instanceof M0 || null != c && null != c._isAMomentObject
    }

    function d0(c) {
        !1 === r.suppressDeprecationWarnings && typeof console < "u" && console.warn && console.warn("Deprecation warning: " + c)
    }

    function A0(c, f) {
        var N = !0;
        return W(function () {
            if (null != r.deprecationHandler && r.deprecationHandler(null, c), N) {
                var K, r0, z0, X = [];
                for (r0 = 0; r0 < arguments.length; r0++) {
                    if (K = "", "object" == typeof arguments[r0]) {
                        for (z0 in K += "\n[" + r0 + "] ", arguments[0]) n(arguments[0], z0) && (K += z0 + ": " + arguments[0][z0] + ", ");
                        K = K.slice(0, -2)
                    } else K = arguments[r0];
                    X.push(K)
                }
                d0(c + "\nArguments: " + Array.prototype.slice.call(X).join("") + "\n" + (new Error).stack), N = !1
            }
            return f.apply(this, arguments)
        }, f)
    }

    var C0, E0 = {};

    function k0(c, f) {
        null != r.deprecationHandler && r.deprecationHandler(c, f), E0[c] || (d0(f), E0[c] = !0)
    }

    function b0(c) {
        return typeof Function < "u" && c instanceof Function || "[object Function]" === Object.prototype.toString.call(c)
    }

    function N0(c, f) {
        var X, N = W({}, c);
        for (X in f) n(f, X) && (h(c[X]) && h(f[X]) ? (N[X] = {}, W(N[X], c[X]), W(N[X], f[X])) : null != f[X] ? N[X] = f[X] : delete N[X]);
        for (X in c) n(c, X) && !n(f, X) && h(c[X]) && (N[X] = W({}, N[X]));
        return N
    }

    function v0(c) {
        null != c && this.set(c)
    }

    function c0(c, f, N) {
        var X = "" + Math.abs(c);
        return (c >= 0 ? N ? "+" : "" : "-") + Math.pow(10, Math.max(0, f - X.length)).toString().substr(1) + X
    }

    r.suppressDeprecationWarnings = !1, r.deprecationHandler = null, C0 = Object.keys ? Object.keys : function (c) {
        var f, N = [];
        for (f in c) n(c, f) && N.push(f);
        return N
    };
    var O0 = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
        Z = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, m0 = {}, L0 = {};

    function p0(c, f, N, X) {
        var K = X;
        "string" == typeof X && (K = function () {
            return this[X]()
        }), c && (L0[c] = K), f && (L0[f[0]] = function () {
            return c0(K.apply(this, arguments), f[1], f[2])
        }), N && (L0[N] = function () {
            return this.localeData().ordinal(K.apply(this, arguments), c)
        })
    }

    function _0(c) {
        return c.match(/\[[\s\S]/) ? c.replace(/^\[|\]$/g, "") : c.replace(/\\/g, "")
    }

    function K0(c, f) {
        return c.isValid() ? (f = X0(f, c.localeData()), m0[f] = m0[f] || function H0(c) {
            var N, X, f = c.match(O0);
            for (N = 0, X = f.length; N < X; N++) f[N] = L0[f[N]] ? L0[f[N]] : _0(f[N]);
            return function (K) {
                var z0, r0 = "";
                for (z0 = 0; z0 < X; z0++) r0 += b0(f[z0]) ? f[z0].call(K, c) : f[z0];
                return r0
            }
        }(f), m0[f](c)) : c.localeData().invalidDate()
    }

    function X0(c, f) {
        var N = 5;

        function X(K) {
            return f.longDateFormat(K) || K
        }

        for (Z.lastIndex = 0; N >= 0 && Z.test(c);) c = c.replace(Z, X), Z.lastIndex = 0, N -= 1;
        return c
    }

    var g0 = {};

    function p1(c, f) {
        var N = c.toLowerCase();
        g0[N] = g0[N + "s"] = g0[f] = c
    }

    function e1(c) {
        return "string" == typeof c ? g0[c] || g0[c.toLowerCase()] : void 0
    }

    function I(c) {
        var N, X, f = {};
        for (X in c) n(c, X) && (N = e1(X)) && (f[N] = c[X]);
        return f
    }

    var d = {};

    function b(c, f) {
        d[c] = f
    }

    function V(c) {
        return c % 4 == 0 && c % 100 != 0 || c % 400 == 0
    }

    function $(c) {
        return c < 0 ? Math.ceil(c) || 0 : Math.floor(c)
    }

    function e0(c) {
        var f = +c, N = 0;
        return 0 !== f && isFinite(f) && (N = $(f)), N
    }

    function i0(c, f) {
        return function (N) {
            return null != N ? (P0(this, c, N), r.updateOffset(this, f), this) : f0(this, c)
        }
    }

    function f0(c, f) {
        return c.isValid() ? c._d["get" + (c._isUTC ? "UTC" : "") + f]() : NaN
    }

    function P0(c, f, N) {
        c.isValid() && !isNaN(N) && ("FullYear" === f && V(c.year()) && 1 === c.month() && 29 === c.date() ? (N = e0(N), c._d["set" + (c._isUTC ? "UTC" : "") + f](N, c.month(), _e(N, c.month()))) : c._d["set" + (c._isUTC ? "UTC" : "") + f](N))
    }

    var We, f1 = /\d/, s1 = /\d\d/, N1 = /\d{3}/, g1 = /\d{4}/, y1 = /[+-]?\d{6}/, i1 = /\d\d?/, R1 = /\d\d\d\d?/,
        Y1 = /\d\d\d\d\d\d?/, de = /\d{1,3}/, Q0 = /\d{1,4}/, ee = /[+-]?\d{1,6}/, K1 = /\d+/, J1 = /[+-]?\d+/,
        ve = /Z|[+-]\d\d:?\d\d/gi, X1 = /Z|[+-]\d\d(?::?\d\d)?/gi,
        L1 = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i;

    function x0(c, f, N) {
        We[c] = b0(f) ? f : function (X, K) {
            return X && N ? N : f
        }
    }

    function vt(c, f) {
        return n(We, c) ? We[c](f._strict, f._locale) : new RegExp(function Tt(c) {
            return G1(c.replace("\\", "").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (f, N, X, K, r0) {
                return N || X || K || r0
            }))
        }(c))
    }

    function G1(c) {
        return c.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
    }

    We = {};
    var Ne = {};

    function v1(c, f) {
        var N, X = f;
        for ("string" == typeof c && (c = [c]), R(f) && (X = function (K, r0) {
            r0[f] = e0(K)
        }), N = 0; N < c.length; N++) Ne[c[N]] = X
    }

    function V1(c, f) {
        v1(c, function (N, X, K, r0) {
            K._w = K._w || {}, f(N, K._w, K, r0)
        })
    }

    function Ot(c, f, N) {
        null != f && n(Ne, c) && Ne[c](f, N._a, N, c)
    }

    var $0, I1 = 0, ne = 1, re = 2, w1 = 3, Q1 = 4, ae = 5, me = 6, Ve = 7, He = 8;

    function _e(c, f) {
        if (isNaN(c) || isNaN(f)) return NaN;
        var N = function Ge(c, f) {
            return (c % f + f) % f
        }(f, 12);
        return c += (f - N) / 12, 1 === N ? V(c) ? 29 : 28 : 31 - N % 7 % 2
    }

    $0 = Array.prototype.indexOf ? Array.prototype.indexOf : function (c) {
        var f;
        for (f = 0; f < this.length; ++f) if (this[f] === c) return f;
        return -1
    }, p0("M", ["MM", 2], "Mo", function () {
        return this.month() + 1
    }), p0("MMM", 0, 0, function (c) {
        return this.localeData().monthsShort(this, c)
    }), p0("MMMM", 0, 0, function (c) {
        return this.localeData().months(this, c)
    }), p1("month", "M"), b("month", 8), x0("M", i1), x0("MM", i1, s1), x0("MMM", function (c, f) {
        return f.monthsShortRegex(c)
    }), x0("MMMM", function (c, f) {
        return f.monthsRegex(c)
    }), v1(["M", "MM"], function (c, f) {
        f[ne] = e0(c) - 1
    }), v1(["MMM", "MMMM"], function (c, f, N, X) {
        var K = N._locale.monthsParse(c, X, N._strict);
        null != K ? f[ne] = K : M(N).invalidMonth = c
    });
    var it = "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        rt = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"), nt = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,
        Oe = L1, St = L1;

    function at(c, f, N) {
        var X, K, r0, z0 = c.toLocaleLowerCase();
        if (!this._monthsParse) for (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = [], X = 0; X < 12; ++X) r0 = S([2e3, X]), this._shortMonthsParse[X] = this.monthsShort(r0, "").toLocaleLowerCase(), this._longMonthsParse[X] = this.months(r0, "").toLocaleLowerCase();
        return N ? "MMM" === f ? -1 !== (K = $0.call(this._shortMonthsParse, z0)) ? K : null : -1 !== (K = $0.call(this._longMonthsParse, z0)) ? K : null : "MMM" === f ? -1 !== (K = $0.call(this._shortMonthsParse, z0)) || -1 !== (K = $0.call(this._longMonthsParse, z0)) ? K : null : -1 !== (K = $0.call(this._longMonthsParse, z0)) || -1 !== (K = $0.call(this._shortMonthsParse, z0)) ? K : null
    }

    function je(c, f) {
        var N;
        if (!c.isValid()) return c;
        if ("string" == typeof f) if (/^\d+$/.test(f)) f = e0(f); else if (!R(f = c.localeData().monthsParse(f))) return c;
        return N = Math.min(c.date(), _e(c.year(), f)), c._d["set" + (c._isUTC ? "UTC" : "") + "Month"](f, N), c
    }

    function st(c) {
        return null != c ? (je(this, c), r.updateOffset(this, !0), this) : f0(this, "Month")
    }

    function ct() {
        function c(z0, G0) {
            return G0.length - z0.length
        }

        var K, r0, f = [], N = [], X = [];
        for (K = 0; K < 12; K++) r0 = S([2e3, K]), f.push(this.monthsShort(r0, "")), N.push(this.months(r0, "")), X.push(this.months(r0, "")), X.push(this.monthsShort(r0, ""));
        for (f.sort(c), N.sort(c), X.sort(c), K = 0; K < 12; K++) f[K] = G1(f[K]), N[K] = G1(N[K]);
        for (K = 0; K < 24; K++) X[K] = G1(X[K]);
        this._monthsRegex = new RegExp("^(" + X.join("|") + ")", "i"), this._monthsShortRegex = this._monthsRegex, this._monthsStrictRegex = new RegExp("^(" + N.join("|") + ")", "i"), this._monthsShortStrictRegex = new RegExp("^(" + f.join("|") + ")", "i")
    }

    function qe(c) {
        return V(c) ? 366 : 365
    }

    p0("Y", 0, 0, function () {
        var c = this.year();
        return c <= 9999 ? c0(c, 4) : "+" + c
    }), p0(0, ["YY", 2], 0, function () {
        return this.year() % 100
    }), p0(0, ["YYYY", 4], 0, "year"), p0(0, ["YYYYY", 5], 0, "year"), p0(0, ["YYYYYY", 6, !0], 0, "year"), p1("year", "y"), b("year", 1), x0("Y", J1), x0("YY", i1, s1), x0("YYYY", Q0, g1), x0("YYYYY", ee, y1), x0("YYYYYY", ee, y1), v1(["YYYYY", "YYYYYY"], I1), v1("YYYY", function (c, f) {
        f[I1] = 2 === c.length ? r.parseTwoDigitYear(c) : e0(c)
    }), v1("YY", function (c, f) {
        f[I1] = r.parseTwoDigitYear(c)
    }), v1("Y", function (c, f) {
        f[I1] = parseInt(c, 10)
    }), r.parseTwoDigitYear = function (c) {
        return e0(c) + (e0(c) > 68 ? 1900 : 2e3)
    };
    var lt = i0("FullYear", !0);

    function Ct(c, f, N, X, K, r0, z0) {
        var G0;
        return c < 100 && c >= 0 ? (G0 = new Date(c + 400, f, N, X, K, r0, z0), isFinite(G0.getFullYear()) && G0.setFullYear(c)) : G0 = new Date(c, f, N, X, K, r0, z0), G0
    }

    function te(c) {
        var f, N;
        return c < 100 && c >= 0 ? ((N = Array.prototype.slice.call(arguments))[0] = c + 400, f = new Date(Date.UTC.apply(null, N)), isFinite(f.getUTCFullYear()) && f.setUTCFullYear(c)) : f = new Date(Date.UTC.apply(null, arguments)), f
    }

    function De(c, f, N) {
        var X = 7 + f - N;
        return -(7 + te(c, 0, X).getUTCDay() - f) % 7 + X - 1
    }

    function ht(c, f, N, X, K) {
        var h1, E1, G0 = 1 + 7 * (f - 1) + (7 + N - X) % 7 + De(c, X, K);
        return G0 <= 0 ? E1 = qe(h1 = c - 1) + G0 : G0 > qe(c) ? (h1 = c + 1, E1 = G0 - qe(c)) : (h1 = c, E1 = G0), {
            year: h1,
            dayOfYear: E1
        }
    }

    function Ce(c, f, N) {
        var r0, z0, X = De(c.year(), f, N), K = Math.floor((c.dayOfYear() - X - 1) / 7) + 1;
        return K < 1 ? r0 = K + ie(z0 = c.year() - 1, f, N) : K > ie(c.year(), f, N) ? (r0 = K - ie(c.year(), f, N), z0 = c.year() + 1) : (z0 = c.year(), r0 = K), {
            week: r0,
            year: z0
        }
    }

    function ie(c, f, N) {
        var X = De(c, f, N), K = De(c + 1, f, N);
        return (qe(c) - X + K) / 7
    }

    function Ye(c, f) {
        return c.slice(f, 7).concat(c.slice(0, f))
    }

    p0("w", ["ww", 2], "wo", "week"), p0("W", ["WW", 2], "Wo", "isoWeek"), p1("week", "w"), p1("isoWeek", "W"), b("week", 5), b("isoWeek", 5), x0("w", i1), x0("ww", i1, s1), x0("W", i1), x0("WW", i1, s1), V1(["w", "ww", "W", "WW"], function (c, f, N, X) {
        f[X.substr(0, 1)] = e0(c)
    }), p0("d", 0, "do", "day"), p0("dd", 0, 0, function (c) {
        return this.localeData().weekdaysMin(this, c)
    }), p0("ddd", 0, 0, function (c) {
        return this.localeData().weekdaysShort(this, c)
    }), p0("dddd", 0, 0, function (c) {
        return this.localeData().weekdays(this, c)
    }), p0("e", 0, 0, "weekday"), p0("E", 0, 0, "isoWeekday"), p1("day", "d"), p1("weekday", "e"), p1("isoWeekday", "E"), b("day", 11), b("weekday", 11), b("isoWeekday", 11), x0("d", i1), x0("e", i1), x0("E", i1), x0("dd", function (c, f) {
        return f.weekdaysMinRegex(c)
    }), x0("ddd", function (c, f) {
        return f.weekdaysShortRegex(c)
    }), x0("dddd", function (c, f) {
        return f.weekdaysRegex(c)
    }), V1(["dd", "ddd", "dddd"], function (c, f, N, X) {
        var K = N._locale.weekdaysParse(c, X, N._strict);
        null != K ? f.d = K : M(N).invalidWeekday = c
    }), V1(["d", "e", "E"], function (c, f, N, X) {
        f[X] = e0(c)
    });
    var we = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        Ae = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"), Z1 = "Su_Mo_Tu_We_Th_Fr_Sa".split("_"), Be = L1, Ke = L1,
        Je = L1;

    function Ze(c, f, N) {
        var X, K, r0, z0 = c.toLocaleLowerCase();
        if (!this._weekdaysParse) for (this._weekdaysParse = [], this._shortWeekdaysParse = [], this._minWeekdaysParse = [], X = 0; X < 7; ++X) r0 = S([2e3, 1]).day(X), this._minWeekdaysParse[X] = this.weekdaysMin(r0, "").toLocaleLowerCase(), this._shortWeekdaysParse[X] = this.weekdaysShort(r0, "").toLocaleLowerCase(), this._weekdaysParse[X] = this.weekdays(r0, "").toLocaleLowerCase();
        return N ? "dddd" === f ? -1 !== (K = $0.call(this._weekdaysParse, z0)) ? K : null : "ddd" === f ? -1 !== (K = $0.call(this._shortWeekdaysParse, z0)) ? K : null : -1 !== (K = $0.call(this._minWeekdaysParse, z0)) ? K : null : "dddd" === f ? -1 !== (K = $0.call(this._weekdaysParse, z0)) || -1 !== (K = $0.call(this._shortWeekdaysParse, z0)) || -1 !== (K = $0.call(this._minWeekdaysParse, z0)) ? K : null : "ddd" === f ? -1 !== (K = $0.call(this._shortWeekdaysParse, z0)) || -1 !== (K = $0.call(this._weekdaysParse, z0)) || -1 !== (K = $0.call(this._minWeekdaysParse, z0)) ? K : null : -1 !== (K = $0.call(this._minWeekdaysParse, z0)) || -1 !== (K = $0.call(this._weekdaysParse, z0)) || -1 !== (K = $0.call(this._shortWeekdaysParse, z0)) ? K : null
    }

    function Se() {
        function c(Me, ze) {
            return ze.length - Me.length
        }

        var r0, z0, G0, h1, E1, f = [], N = [], X = [], K = [];
        for (r0 = 0; r0 < 7; r0++) z0 = S([2e3, 1]).day(r0), G0 = G1(this.weekdaysMin(z0, "")), h1 = G1(this.weekdaysShort(z0, "")), E1 = G1(this.weekdays(z0, "")), f.push(G0), N.push(h1), X.push(E1), K.push(G0), K.push(h1), K.push(E1);
        f.sort(c), N.sort(c), X.sort(c), K.sort(c), this._weekdaysRegex = new RegExp("^(" + K.join("|") + ")", "i"), this._weekdaysShortRegex = this._weekdaysRegex, this._weekdaysMinRegex = this._weekdaysRegex, this._weekdaysStrictRegex = new RegExp("^(" + X.join("|") + ")", "i"), this._weekdaysShortStrictRegex = new RegExp("^(" + N.join("|") + ")", "i"), this._weekdaysMinStrictRegex = new RegExp("^(" + f.join("|") + ")", "i")
    }

    function et() {
        return this.hours() % 12 || 12
    }

    function o(c, f) {
        p0(c, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), f)
        })
    }

    function l(c, f) {
        return f._meridiemParse
    }

    p0("H", ["HH", 2], 0, "hour"), p0("h", ["hh", 2], 0, et), p0("k", ["kk", 2], 0, function ue() {
        return this.hours() || 24
    }), p0("hmm", 0, 0, function () {
        return "" + et.apply(this) + c0(this.minutes(), 2)
    }), p0("hmmss", 0, 0, function () {
        return "" + et.apply(this) + c0(this.minutes(), 2) + c0(this.seconds(), 2)
    }), p0("Hmm", 0, 0, function () {
        return "" + this.hours() + c0(this.minutes(), 2)
    }), p0("Hmmss", 0, 0, function () {
        return "" + this.hours() + c0(this.minutes(), 2) + c0(this.seconds(), 2)
    }), o("a", !0), o("A", !1), p1("hour", "h"), b("hour", 13), x0("a", l), x0("A", l), x0("H", i1), x0("h", i1), x0("k", i1), x0("HH", i1, s1), x0("hh", i1, s1), x0("kk", i1, s1), x0("hmm", R1), x0("hmmss", Y1), x0("Hmm", R1), x0("Hmmss", Y1), v1(["H", "HH"], w1), v1(["k", "kk"], function (c, f, N) {
        var X = e0(c);
        f[w1] = 24 === X ? 0 : X
    }), v1(["a", "A"], function (c, f, N) {
        N._isPm = N._locale.isPM(c), N._meridiem = c
    }), v1(["h", "hh"], function (c, f, N) {
        f[w1] = e0(c), M(N).bigHour = !0
    }), v1("hmm", function (c, f, N) {
        var X = c.length - 2;
        f[w1] = e0(c.substr(0, X)), f[Q1] = e0(c.substr(X)), M(N).bigHour = !0
    }), v1("hmmss", function (c, f, N) {
        var X = c.length - 4, K = c.length - 2;
        f[w1] = e0(c.substr(0, X)), f[Q1] = e0(c.substr(X, 2)), f[ae] = e0(c.substr(K)), M(N).bigHour = !0
    }), v1("Hmm", function (c, f, N) {
        var X = c.length - 2;
        f[w1] = e0(c.substr(0, X)), f[Q1] = e0(c.substr(X))
    }), v1("Hmmss", function (c, f, N) {
        var X = c.length - 4, K = c.length - 2;
        f[w1] = e0(c.substr(0, X)), f[Q1] = e0(c.substr(X, 2)), f[ae] = e0(c.substr(K))
    });
    var J, _ = i0("Hours", !0), q = {
        calendar: {
            sameDay: "[Today at] LT",
            nextDay: "[Tomorrow at] LT",
            nextWeek: "dddd [at] LT",
            lastDay: "[Yesterday at] LT",
            lastWeek: "[Last] dddd [at] LT",
            sameElse: "L"
        },
        longDateFormat: {
            LTS: "h:mm:ss A",
            LT: "h:mm A",
            L: "MM/DD/YYYY",
            LL: "MMMM D, YYYY",
            LLL: "MMMM D, YYYY h:mm A",
            LLLL: "dddd, MMMM D, YYYY h:mm A"
        },
        invalidDate: "Invalid date",
        ordinal: "%d",
        dayOfMonthOrdinalParse: /\d{1,2}/,
        relativeTime: {
            future: "in %s",
            past: "%s ago",
            s: "a few seconds",
            ss: "%d seconds",
            m: "a minute",
            mm: "%d minutes",
            h: "an hour",
            hh: "%d hours",
            d: "a day",
            dd: "%d days",
            w: "a week",
            ww: "%d weeks",
            M: "a month",
            MM: "%d months",
            y: "a year",
            yy: "%d years"
        },
        months: it,
        monthsShort: rt,
        week: {dow: 0, doy: 6},
        weekdays: we,
        weekdaysMin: Z1,
        weekdaysShort: Ae,
        meridiemParse: /[ap]\.?m?\.?/i
    }, j = {}, Y = {};

    function o0(c, f) {
        var N, X = Math.min(c.length, f.length);
        for (N = 0; N < X; N += 1) if (c[N] !== f[N]) return N;
        return X
    }

    function n0(c) {
        return c && c.toLowerCase().replace("_", "-")
    }

    function S0(c) {
        var f = null;
        if (void 0 === j[c] && typeof module < "u" && module && module.exports) try {
            f = J._abbr, require("./locale/" + c), h0(f)
        } catch {
            j[c] = null
        }
        return j[c]
    }

    function h0(c, f) {
        var N;
        return c && ((N = T(f) ? W0(c) : B0(c, f)) ? J = N : typeof console < "u" && console.warn && console.warn("Locale " + c + " not found. Did you forget to load it?")), J._abbr
    }

    function B0(c, f) {
        if (null !== f) {
            var N, X = q;
            if (f.abbr = c, null != j[c]) k0("defineLocaleOverride", "use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info."), X = j[c]._config; else if (null != f.parentLocale) if (null != j[f.parentLocale]) X = j[f.parentLocale]._config; else {
                if (null == (N = S0(f.parentLocale))) return Y[f.parentLocale] || (Y[f.parentLocale] = []), Y[f.parentLocale].push({
                    name: c,
                    config: f
                }), null;
                X = N._config
            }
            return j[c] = new v0(N0(X, f)), Y[c] && Y[c].forEach(function (K) {
                B0(K.name, K.config)
            }), h0(c), j[c]
        }
        return delete j[c], null
    }

    function W0(c) {
        var f;
        if (c && c._locale && c._locale._abbr && (c = c._locale._abbr), !c) return J;
        if (!s(c)) {
            if (f = S0(c)) return f;
            c = [c]
        }
        return function T0(c) {
            for (var N, X, K, r0, f = 0; f < c.length;) {
                for (N = (r0 = n0(c[f]).split("-")).length, X = (X = n0(c[f + 1])) ? X.split("-") : null; N > 0;) {
                    if (K = S0(r0.slice(0, N).join("-"))) return K;
                    if (X && X.length >= N && o0(r0, X) >= N - 1) break;
                    N--
                }
                f++
            }
            return J
        }(c)
    }

    function u0(c) {
        var f, N = c._a;
        return N && -2 === M(c).overflow && (f = N[ne] < 0 || N[ne] > 11 ? ne : N[re] < 1 || N[re] > _e(N[I1], N[ne]) ? re : N[w1] < 0 || N[w1] > 24 || 24 === N[w1] && (0 !== N[Q1] || 0 !== N[ae] || 0 !== N[me]) ? w1 : N[Q1] < 0 || N[Q1] > 59 ? Q1 : N[ae] < 0 || N[ae] > 59 ? ae : N[me] < 0 || N[me] > 999 ? me : -1, M(c)._overflowDayOfYear && (f < I1 || f > re) && (f = re), M(c)._overflowWeeks && -1 === f && (f = Ve), M(c)._overflowWeekday && -1 === f && (f = He), M(c).overflow = f), c
    }

    var l0 = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
        u1 = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
        B1 = /Z|[+-]\d\d(?::?\d\d)?/,
        M1 = [["YYYYYY-MM-DD", /[+-]\d{6}-\d\d-\d\d/], ["YYYY-MM-DD", /\d{4}-\d\d-\d\d/], ["GGGG-[W]WW-E", /\d{4}-W\d\d-\d/], ["GGGG-[W]WW", /\d{4}-W\d\d/, !1], ["YYYY-DDD", /\d{4}-\d{3}/], ["YYYY-MM", /\d{4}-\d\d/, !1], ["YYYYYYMMDD", /[+-]\d{10}/], ["YYYYMMDD", /\d{8}/], ["GGGG[W]WWE", /\d{4}W\d{3}/], ["GGGG[W]WW", /\d{4}W\d{2}/, !1], ["YYYYDDD", /\d{7}/], ["YYYYMM", /\d{6}/, !1], ["YYYY", /\d{4}/, !1]],
        F0 = [["HH:mm:ss.SSSS", /\d\d:\d\d:\d\d\.\d+/], ["HH:mm:ss,SSSS", /\d\d:\d\d:\d\d,\d+/], ["HH:mm:ss", /\d\d:\d\d:\d\d/], ["HH:mm", /\d\d:\d\d/], ["HHmmss.SSSS", /\d\d\d\d\d\d\.\d+/], ["HHmmss,SSSS", /\d\d\d\d\d\d,\d+/], ["HHmmss", /\d\d\d\d\d\d/], ["HHmm", /\d\d\d\d/], ["HH", /\d\d/]],
        o1 = /^\/?Date\((-?\d+)/i,
        O1 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,
        r1 = {UT: 0, GMT: 0, EDT: -240, EST: -300, CDT: -300, CST: -360, MDT: -360, MST: -420, PDT: -420, PST: -480};

    function x1(c) {
        var f, N, r0, z0, G0, h1, X = c._i, K = l0.exec(X) || u1.exec(X);
        if (K) {
            for (M(c).iso = !0, f = 0, N = M1.length; f < N; f++) if (M1[f][1].exec(K[1])) {
                z0 = M1[f][0], r0 = !1 !== M1[f][2];
                break
            }
            if (null == z0) return void (c._isValid = !1);
            if (K[3]) {
                for (f = 0, N = F0.length; f < N; f++) if (F0[f][1].exec(K[3])) {
                    G0 = (K[2] || " ") + F0[f][0];
                    break
                }
                if (null == G0) return void (c._isValid = !1)
            }
            if (!r0 && null != G0) return void (c._isValid = !1);
            if (K[4]) {
                if (!B1.exec(K[4])) return void (c._isValid = !1);
                h1 = "Z"
            }
            c._f = z0 + (G0 || "") + (h1 || ""), U0(c)
        } else c._isValid = !1
    }

    function oe(c) {
        var f = parseInt(c, 10);
        return f <= 49 ? 2e3 + f : f <= 999 ? 1900 + f : f
    }

    function F1(c) {
        var N, f = O1.exec(function ce(c) {
            return c.replace(/\([^)]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").replace(/^\s\s*/, "").replace(/\s\s*$/, "")
        }(c._i));
        if (f) {
            if (N = function se(c, f, N, X, K, r0) {
                var z0 = [oe(c), rt.indexOf(f), parseInt(N, 10), parseInt(X, 10), parseInt(K, 10)];
                return r0 && z0.push(parseInt(r0, 10)), z0
            }(f[4], f[3], f[2], f[5], f[6], f[7]), !function le(c, f, N) {
                return !c || Ae.indexOf(c) === new Date(f[0], f[1], f[2]).getDay() || (M(N).weekdayMismatch = !0, N._isValid = !1, !1)
            }(f[1], N, c)) return;
            c._a = N, c._tzm = function $1(c, f, N) {
                if (c) return r1[c];
                if (f) return 0;
                var X = parseInt(N, 10), K = X % 100;
                return (X - K) / 100 * 60 + K
            }(f[8], f[9], f[10]), c._d = te.apply(null, c._a), c._d.setUTCMinutes(c._d.getUTCMinutes() - c._tzm), M(c).rfc2822 = !0
        } else c._isValid = !1
    }

    function W1(c, f, N) {
        return c ?? f ?? N
    }

    function S1(c) {
        var f, N, K, r0, z0, X = [];
        if (!c._d) {
            for (K = function he(c) {
                var f = new Date(r.now());
                return c._useUTC ? [f.getUTCFullYear(), f.getUTCMonth(), f.getUTCDate()] : [f.getFullYear(), f.getMonth(), f.getDate()]
            }(c), c._w && null == c._a[re] && null == c._a[ne] && function t1(c) {
                var f, N, X, K, r0, z0, G0, h1, E1;
                null != (f = c._w).GG || null != f.W || null != f.E ? (r0 = 1, z0 = 4, N = W1(f.GG, c._a[I1], Ce(_1(), 1, 4).year), X = W1(f.W, 1), ((K = W1(f.E, 1)) < 1 || K > 7) && (h1 = !0)) : (r0 = c._locale._week.dow, z0 = c._locale._week.doy, E1 = Ce(_1(), r0, z0), N = W1(f.gg, c._a[I1], E1.year), X = W1(f.w, E1.week), null != f.d ? ((K = f.d) < 0 || K > 6) && (h1 = !0) : null != f.e ? (K = f.e + r0, (f.e < 0 || f.e > 6) && (h1 = !0)) : K = r0), X < 1 || X > ie(N, r0, z0) ? M(c)._overflowWeeks = !0 : null != h1 ? M(c)._overflowWeekday = !0 : (G0 = ht(N, X, K, r0, z0), c._a[I1] = G0.year, c._dayOfYear = G0.dayOfYear)
            }(c), null != c._dayOfYear && (z0 = W1(c._a[I1], K[I1]), (c._dayOfYear > qe(z0) || 0 === c._dayOfYear) && (M(c)._overflowDayOfYear = !0), N = te(z0, 0, c._dayOfYear), c._a[ne] = N.getUTCMonth(), c._a[re] = N.getUTCDate()), f = 0; f < 3 && null == c._a[f]; ++f) c._a[f] = X[f] = K[f];
            for (; f < 7; f++) c._a[f] = X[f] = null == c._a[f] ? 2 === f ? 1 : 0 : c._a[f];
            24 === c._a[w1] && 0 === c._a[Q1] && 0 === c._a[ae] && 0 === c._a[me] && (c._nextDay = !0, c._a[w1] = 0), c._d = (c._useUTC ? te : Ct).apply(null, X), r0 = c._useUTC ? c._d.getUTCDay() : c._d.getDay(), null != c._tzm && c._d.setUTCMinutes(c._d.getUTCMinutes() - c._tzm), c._nextDay && (c._a[w1] = 24), c._w && typeof c._w.d < "u" && c._w.d !== r0 && (M(c).weekdayMismatch = !0)
        }
    }

    function U0(c) {
        if (c._f !== r.ISO_8601) if (c._f !== r.RFC_2822) {
            c._a = [], M(c).empty = !0;
            var N, X, K, r0, z0, E1, f = "" + c._i, G0 = f.length, h1 = 0;
            for (K = X0(c._f, c._locale).match(O0) || [], N = 0; N < K.length; N++) (X = (f.match(vt(r0 = K[N], c)) || [])[0]) && ((z0 = f.substr(0, f.indexOf(X))).length > 0 && M(c).unusedInput.push(z0), f = f.slice(f.indexOf(X) + X.length), h1 += X.length), L0[r0] ? (X ? M(c).empty = !1 : M(c).unusedTokens.push(r0), Ot(r0, X, c)) : c._strict && !X && M(c).unusedTokens.push(r0);
            M(c).charsLeftOver = G0 - h1, f.length > 0 && M(c).unusedInput.push(f), c._a[w1] <= 12 && !0 === M(c).bigHour && c._a[w1] > 0 && (M(c).bigHour = void 0), M(c).parsedDateParts = c._a.slice(0), M(c).meridiem = c._meridiem, c._a[w1] = function C1(c, f, N) {
                var X;
                return null == N ? f : null != c.meridiemHour ? c.meridiemHour(f, N) : (null != c.isPM && ((X = c.isPM(N)) && f < 12 && (f += 12), !X && 12 === f && (f = 0)), f)
            }(c._locale, c._a[w1], c._meridiem), null !== (E1 = M(c).era) && (c._a[I1] = c._locale.erasConvertYear(E1, c._a[I1])), S1(c), u0(c)
        } else F1(c); else x1(c)
    }

    function U1(c) {
        var f = c._i, N = c._f;
        return c._locale = c._locale || W0(c._l), null === f || void 0 === N && "" === f ? x({nullInput: !0}) : ("string" == typeof f && (c._i = f = c._locale.preparse(f)), a0(f) ? new M0(u0(f)) : (k(f) ? c._d = f : s(N) ? function l1(c) {
            var f, N, X, K, r0, z0, G0 = !1;
            if (0 === c._f.length) return M(c).invalidFormat = !0, void (c._d = new Date(NaN));
            for (K = 0; K < c._f.length; K++) r0 = 0, z0 = !1, f = s0({}, c), null != c._useUTC && (f._useUTC = c._useUTC), f._f = c._f[K], U0(f), g(f) && (z0 = !0), r0 += M(f).charsLeftOver, r0 += 10 * M(f).unusedTokens.length, M(f).score = r0, G0 ? r0 < X && (X = r0, N = f) : (null == X || r0 < X || z0) && (X = r0, N = f, z0 && (G0 = !0));
            W(c, N || f)
        }(c) : N ? U0(c) : function Ai(c) {
            var f = c._i;
            T(f) ? c._d = new Date(r.now()) : k(f) ? c._d = new Date(f.valueOf()) : "string" == typeof f ? function c1(c) {
                var f = o1.exec(c._i);
                null === f ? (x1(c), !1 === c._isValid && (delete c._isValid, F1(c), !1 === c._isValid && (delete c._isValid, c._strict ? c._isValid = !1 : r.createFromInputFallback(c)))) : c._d = new Date(+f[1])
            }(c) : s(f) ? (c._a = U(f.slice(0), function (N) {
                return parseInt(N, 10)
            }), S1(c)) : h(f) ? function z1(c) {
                if (!c._d) {
                    var f = I(c._i);
                    c._a = U([f.year, f.month, void 0 === f.day ? f.date : f.day, f.hour, f.minute, f.second, f.millisecond], function (X) {
                        return X && parseInt(X, 10)
                    }), S1(c)
                }
            }(c) : R(f) ? c._d = new Date(f) : r.createFromInputFallback(c)
        }(c), g(c) || (c._d = null), c))
    }

    function Kt(c, f, N, X, K) {
        var r0 = {};
        return (!0 === f || !1 === f) && (X = f, f = void 0), (!0 === N || !1 === N) && (X = N, N = void 0), (h(c) && m(c) || s(c) && 0 === c.length) && (c = void 0), r0._isAMomentObject = !0, r0._useUTC = r0._isUTC = K, r0._l = N, r0._i = c, r0._f = f, r0._strict = X, function P1(c) {
            var f = new M0(u0(U1(c)));
            return f._nextDay && (f.add(1, "d"), f._nextDay = void 0), f
        }(r0)
    }

    function _1(c, f, N, X) {
        return Kt(c, f, N, X, !1)
    }

    r.createFromInputFallback = A0("value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged and will be removed in an upcoming major release. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.", function (c) {
        c._d = new Date(c._i + (c._useUTC ? " UTC" : ""))
    }), r.ISO_8601 = function () {
    }, r.RFC_2822 = function () {
    };
    var bi = A0("moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/", function () {
            var c = _1.apply(null, arguments);
            return this.isValid() && c.isValid() ? c < this ? this : c : x()
        }),
        gi = A0("moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/", function () {
            var c = _1.apply(null, arguments);
            return this.isValid() && c.isValid() ? c > this ? this : c : x()
        });

    function Jt(c, f) {
        var N, X;
        if (1 === f.length && s(f[0]) && (f = f[0]), !f.length) return _1();
        for (N = f[0], X = 1; X < f.length; ++X) (!f[X].isValid() || f[X][c](N)) && (N = f[X]);
        return N
    }

    var tt = ["year", "quarter", "month", "week", "day", "hour", "minute", "second", "millisecond"];

    function Mt(c) {
        var f = I(c), N = f.year || 0, X = f.quarter || 0, K = f.month || 0, r0 = f.week || f.isoWeek || 0,
            z0 = f.day || 0, G0 = f.hour || 0, h1 = f.minute || 0, E1 = f.second || 0, Me = f.millisecond || 0;
        this._isValid = function Ti(c) {
            var f, X, N = !1;
            for (f in c) if (n(c, f) && (-1 === $0.call(tt, f) || null != c[f] && isNaN(c[f]))) return !1;
            for (X = 0; X < tt.length; ++X) if (c[tt[X]]) {
                if (N) return !1;
                parseFloat(c[tt[X]]) !== e0(c[tt[X]]) && (N = !0)
            }
            return !0
        }(f), this._milliseconds = +Me + 1e3 * E1 + 6e4 * h1 + 1e3 * G0 * 60 * 60, this._days = +z0 + 7 * r0, this._months = +K + 3 * X + 12 * N, this._data = {}, this._locale = W0(), this._bubble()
    }

    function dt(c) {
        return c instanceof Mt
    }

    function Xt(c) {
        return c < 0 ? -1 * Math.round(-1 * c) : Math.round(c)
    }

    function Qt(c, f) {
        p0(c, 0, 0, function () {
            var N = this.utcOffset(), X = "+";
            return N < 0 && (N = -N, X = "-"), X + c0(~~(N / 60), 2) + f + c0(~~N % 60, 2)
        })
    }

    Qt("Z", ":"), Qt("ZZ", ""), x0("Z", X1), x0("ZZ", X1), v1(["Z", "ZZ"], function (c, f, N) {
        N._useUTC = !0, N._tzm = It(X1, c)
    });
    var Ei = /([\+\-]|\d\d)/gi;

    function It(c, f) {
        var K, r0, N = (f || "").match(c);
        return null === N ? null : 0 === (r0 = 60 * (K = ((N[N.length - 1] || []) + "").match(Ei) || ["-", 0, 0])[1] + e0(K[2])) ? 0 : "+" === K[0] ? r0 : -r0
    }

    function Ft(c, f) {
        var N, X;
        return f._isUTC ? (N = f.clone(), X = (a0(c) || k(c) ? c.valueOf() : _1(c).valueOf()) - N.valueOf(), N._d.setTime(N._d.valueOf() + X), r.updateOffset(N, !1), N) : _1(c).local()
    }

    function Vt(c) {
        return -Math.round(c._d.getTimezoneOffset())
    }

    function Zt() {
        return !!this.isValid() && this._isUTC && 0 === this._offset
    }

    r.updateOffset = function () {
    };
    var xi = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/,
        Ri = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

    function pe(c, f) {
        var K, r0, z0, N = c, X = null;
        return dt(c) ? N = {
            ms: c._milliseconds,
            d: c._days,
            M: c._months
        } : R(c) || !isNaN(+c) ? (N = {}, f ? N[f] = +c : N.milliseconds = +c) : (X = xi.exec(c)) ? (K = "-" === X[1] ? -1 : 1, N = {
            y: 0,
            d: e0(X[re]) * K,
            h: e0(X[w1]) * K,
            m: e0(X[Q1]) * K,
            s: e0(X[ae]) * K,
            ms: e0(Xt(1e3 * X[me])) * K
        }) : (X = Ri.exec(c)) ? N = {
            y: Pe(X[2], K = "-" === X[1] ? -1 : 1),
            M: Pe(X[3], K),
            w: Pe(X[4], K),
            d: Pe(X[5], K),
            h: Pe(X[6], K),
            m: Pe(X[7], K),
            s: Pe(X[8], K)
        } : null == N ? N = {} : "object" == typeof N && ("from" in N || "to" in N) && (z0 = function Xi(c, f) {
            var N;
            return c.isValid() && f.isValid() ? (f = Ft(f, c), c.isBefore(f) ? N = $t(c, f) : ((N = $t(f, c)).milliseconds = -N.milliseconds, N.months = -N.months), N) : {
                milliseconds: 0,
                months: 0
            }
        }(_1(N.from), _1(N.to)), (N = {}).ms = z0.milliseconds, N.M = z0.months), r0 = new Mt(N), dt(c) && n(c, "_locale") && (r0._locale = c._locale), dt(c) && n(c, "_isValid") && (r0._isValid = c._isValid), r0
    }

    function Pe(c, f) {
        var N = c && parseFloat(c.replace(",", "."));
        return (isNaN(N) ? 0 : N) * f
    }

    function $t(c, f) {
        var N = {};
        return N.months = f.month() - c.month() + 12 * (f.year() - c.year()), c.clone().add(N.months, "M").isAfter(f) && --N.months, N.milliseconds = +f - +c.clone().add(N.months, "M"), N
    }

    function ei(c, f) {
        return function (N, X) {
            var r0;
            return null !== X && !isNaN(+X) && (k0(f, "moment()." + f + "(period, number) is deprecated. Please use moment()." + f + "(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info."), r0 = N, N = X, X = r0), ti(this, pe(N, X), c), this
        }
    }

    function ti(c, f, N, X) {
        var K = f._milliseconds, r0 = Xt(f._days), z0 = Xt(f._months);
        c.isValid() && (X = X ?? !0, z0 && je(c, f0(c, "Month") + z0 * N), r0 && P0(c, "Date", f0(c, "Date") + r0 * N), K && c._d.setTime(c._d.valueOf() + K * N), X && r.updateOffset(c, r0 || z0))
    }

    pe.fn = Mt.prototype, pe.invalid = function Si() {
        return pe(NaN)
    };
    var Ii = ei(1, "add"), Fi = ei(-1, "subtract");

    function ii(c) {
        return "string" == typeof c || c instanceof String
    }

    function mt(c, f) {
        if (c.date() < f.date()) return -mt(f, c);
        var N = 12 * (f.year() - c.year()) + (f.month() - c.month()), X = c.clone().add(N, "months");
        return -(N + (f - X < 0 ? (f - X) / (X - c.clone().add(N - 1, "months")) : (f - X) / (c.clone().add(N + 1, "months") - X))) || 0
    }

    function ri(c) {
        var f;
        return void 0 === c ? this._locale._abbr : (null != (f = W0(c)) && (this._locale = f), this)
    }

    r.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ", r.defaultFormatUtc = "YYYY-MM-DDTHH:mm:ss[Z]";
    var ni = A0("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.", function (c) {
        return void 0 === c ? this.localeData() : this.locale(c)
    });

    function ai() {
        return this._locale
    }

    var Re = 6e4, bt = 60 * Re, si = 3506328 * bt;

    function Xe(c, f) {
        return (c % f + f) % f
    }

    function oi(c, f, N) {
        return c < 100 && c >= 0 ? new Date(c + 400, f, N) - si : new Date(c, f, N).valueOf()
    }

    function ci(c, f, N) {
        return c < 100 && c >= 0 ? Date.UTC(c + 400, f, N) - si : Date.UTC(c, f, N)
    }

    function Ht(c, f) {
        return f.erasAbbrRegex(c)
    }

    function Gt() {
        var K, r0, c = [], f = [], N = [], X = [], z0 = this.eras();
        for (K = 0, r0 = z0.length; K < r0; ++K) f.push(G1(z0[K].name)), c.push(G1(z0[K].abbr)), N.push(G1(z0[K].narrow)), X.push(G1(z0[K].name)), X.push(G1(z0[K].abbr)), X.push(G1(z0[K].narrow));
        this._erasRegex = new RegExp("^(" + X.join("|") + ")", "i"), this._erasNameRegex = new RegExp("^(" + f.join("|") + ")", "i"), this._erasAbbrRegex = new RegExp("^(" + c.join("|") + ")", "i"), this._erasNarrowRegex = new RegExp("^(" + N.join("|") + ")", "i")
    }

    function gt(c, f) {
        p0(0, [c, c.length], 0, f)
    }

    function li(c, f, N, X, K) {
        var r0;
        return null == c ? Ce(this, X, K).year : (f > (r0 = ie(c, X, K)) && (f = r0), Vr.call(this, c, f, N, X, K))
    }

    function Vr(c, f, N, X, K) {
        var r0 = ht(c, f, N, X, K), z0 = te(r0.year, 0, r0.dayOfYear);
        return this.year(z0.getUTCFullYear()), this.month(z0.getUTCMonth()), this.date(z0.getUTCDate()), this
    }

    p0("N", 0, 0, "eraAbbr"), p0("NN", 0, 0, "eraAbbr"), p0("NNN", 0, 0, "eraAbbr"), p0("NNNN", 0, 0, "eraName"), p0("NNNNN", 0, 0, "eraNarrow"), p0("y", ["y", 1], "yo", "eraYear"), p0("y", ["yy", 2], 0, "eraYear"), p0("y", ["yyy", 3], 0, "eraYear"), p0("y", ["yyyy", 4], 0, "eraYear"), x0("N", Ht), x0("NN", Ht), x0("NNN", Ht), x0("NNNN", function Pr(c, f) {
        return f.erasNameRegex(c)
    }), x0("NNNNN", function kr(c, f) {
        return f.erasNarrowRegex(c)
    }), v1(["N", "NN", "NNN", "NNNN", "NNNNN"], function (c, f, N, X) {
        var K = N._locale.erasParse(c, X, N._strict);
        K ? M(N).era = K : M(N).invalidEra = c
    }), x0("y", K1), x0("yy", K1), x0("yyy", K1), x0("yyyy", K1), x0("yo", function Wr(c, f) {
        return f._eraYearOrdinalRegex || K1
    }), v1(["y", "yy", "yyy", "yyyy"], I1), v1(["yo"], function (c, f, N, X) {
        var K;
        N._locale._eraYearOrdinalRegex && (K = c.match(N._locale._eraYearOrdinalRegex)), f[I1] = N._locale.eraYearOrdinalParse ? N._locale.eraYearOrdinalParse(c, K) : parseInt(c, 10)
    }), p0(0, ["gg", 2], 0, function () {
        return this.weekYear() % 100
    }), p0(0, ["GG", 2], 0, function () {
        return this.isoWeekYear() % 100
    }), gt("gggg", "weekYear"), gt("ggggg", "weekYear"), gt("GGGG", "isoWeekYear"), gt("GGGGG", "isoWeekYear"), p1("weekYear", "gg"), p1("isoWeekYear", "GG"), b("weekYear", 1), b("isoWeekYear", 1), x0("G", J1), x0("g", J1), x0("GG", i1, s1), x0("gg", i1, s1), x0("GGGG", Q0, g1), x0("gggg", Q0, g1), x0("GGGGG", ee, y1), x0("ggggg", ee, y1), V1(["gggg", "ggggg", "GGGG", "GGGGG"], function (c, f, N, X) {
        f[X.substr(0, 2)] = e0(c)
    }), V1(["gg", "GG"], function (c, f, N, X) {
        f[X] = r.parseTwoDigitYear(c)
    }), p0("Q", 0, "Qo", "quarter"), p1("quarter", "Q"), b("quarter", 7), x0("Q", f1), v1("Q", function (c, f) {
        f[ne] = 3 * (e0(c) - 1)
    }), p0("D", ["DD", 2], "Do", "date"), p1("date", "D"), b("date", 9), x0("D", i1), x0("DD", i1, s1), x0("Do", function (c, f) {
        return c ? f._dayOfMonthOrdinalParse || f._ordinalParse : f._dayOfMonthOrdinalParseLenient
    }), v1(["D", "DD"], re), v1("Do", function (c, f) {
        f[re] = e0(c.match(i1)[0])
    });
    var hi = i0("Date", !0);
    p0("DDD", ["DDDD", 3], "DDDo", "dayOfYear"), p1("dayOfYear", "DDD"), b("dayOfYear", 4), x0("DDD", de), x0("DDDD", N1), v1(["DDD", "DDDD"], function (c, f, N) {
        N._dayOfYear = e0(c)
    }), p0("m", ["mm", 2], 0, "minute"), p1("minute", "m"), b("minute", 14), x0("m", i1), x0("mm", i1, s1), v1(["m", "mm"], Q1);
    var jr = i0("Minutes", !1);
    p0("s", ["ss", 2], 0, "second"), p1("second", "s"), b("second", 15), x0("s", i1), x0("ss", i1, s1), v1(["s", "ss"], ae);
    var Le, pi, Ur = i0("Seconds", !1);
    for (p0("S", 0, 0, function () {
        return ~~(this.millisecond() / 100)
    }), p0(0, ["SS", 2], 0, function () {
        return ~~(this.millisecond() / 10)
    }), p0(0, ["SSS", 3], 0, "millisecond"), p0(0, ["SSSS", 4], 0, function () {
        return 10 * this.millisecond()
    }), p0(0, ["SSSSS", 5], 0, function () {
        return 100 * this.millisecond()
    }), p0(0, ["SSSSSS", 6], 0, function () {
        return 1e3 * this.millisecond()
    }), p0(0, ["SSSSSSS", 7], 0, function () {
        return 1e4 * this.millisecond()
    }), p0(0, ["SSSSSSSS", 8], 0, function () {
        return 1e5 * this.millisecond()
    }), p0(0, ["SSSSSSSSS", 9], 0, function () {
        return 1e6 * this.millisecond()
    }), p1("millisecond", "ms"), b("millisecond", 16), x0("S", de, f1), x0("SS", de, s1), x0("SSS", de, N1), Le = "SSSS"; Le.length <= 9; Le += "S") x0(Le, K1);

    function Yr(c, f) {
        f[me] = e0(1e3 * ("0." + c))
    }

    for (Le = "S"; Le.length <= 9; Le += "S") v1(Le, Yr);
    pi = i0("Milliseconds", !1), p0("z", 0, 0, "zoneAbbr"), p0("zz", 0, 0, "zoneName");
    var w0 = M0.prototype;

    function fi(c) {
        return c
    }

    w0.add = Ii, w0.calendar = function Yi(c, f) {
        1 === arguments.length && (function Vi(c) {
            return a0(c) || k(c) || ii(c) || R(c) || function Gi(c) {
                var f = s(c), N = !1;
                return f && (N = 0 === c.filter(function (X) {
                    return !R(X) && ii(c)
                }).length), f && N
            }(c) || function Hi(c) {
                var K, f = h(c) && !m(c), N = !1,
                    X = ["years", "year", "y", "months", "month", "M", "days", "day", "d", "dates", "date", "D", "hours", "hour", "h", "minutes", "minute", "m", "seconds", "second", "s", "milliseconds", "millisecond", "ms"];
                for (K = 0; K < X.length; K += 1) N = N || n(c, X[K]);
                return f && N
            }(c) || null == c
        }(arguments[0]) ? (c = arguments[0], f = void 0) : function ji(c) {
            var K, f = h(c) && !m(c), N = !1, X = ["sameDay", "nextDay", "lastDay", "nextWeek", "lastWeek", "sameElse"];
            for (K = 0; K < X.length; K += 1) N = N || n(c, X[K]);
            return f && N
        }(arguments[0]) && (f = arguments[0], c = void 0));
        var N = c || _1(), X = Ft(N, this).startOf("day"), K = r.calendarFormat(this, X) || "sameElse",
            r0 = f && (b0(f[K]) ? f[K].call(this, N) : f[K]);
        return this.format(r0 || this.localeData().calendar(K, this, _1(N)))
    }, w0.clone = function Ki() {
        return new M0(this)
    }, w0.diff = function ir(c, f, N) {
        var X, K, r0;
        if (!this.isValid()) return NaN;
        if (!(X = Ft(c, this)).isValid()) return NaN;
        switch (K = 6e4 * (X.utcOffset() - this.utcOffset()), f = e1(f)) {
            case"year":
                r0 = mt(this, X) / 12;
                break;
            case"month":
                r0 = mt(this, X);
                break;
            case"quarter":
                r0 = mt(this, X) / 3;
                break;
            case"second":
                r0 = (this - X) / 1e3;
                break;
            case"minute":
                r0 = (this - X) / 6e4;
                break;
            case"hour":
                r0 = (this - X) / 36e5;
                break;
            case"day":
                r0 = (this - X - K) / 864e5;
                break;
            case"week":
                r0 = (this - X - K) / 6048e5;
                break;
            default:
                r0 = this - X
        }
        return N ? r0 : $(r0)
    }, w0.endOf = function fr(c) {
        var f, N;
        if (void 0 === (c = e1(c)) || "millisecond" === c || !this.isValid()) return this;
        switch (N = this._isUTC ? ci : oi, c) {
            case"year":
                f = N(this.year() + 1, 0, 1) - 1;
                break;
            case"quarter":
                f = N(this.year(), this.month() - this.month() % 3 + 3, 1) - 1;
                break;
            case"month":
                f = N(this.year(), this.month() + 1, 1) - 1;
                break;
            case"week":
                f = N(this.year(), this.month(), this.date() - this.weekday() + 7) - 1;
                break;
            case"isoWeek":
                f = N(this.year(), this.month(), this.date() - (this.isoWeekday() - 1) + 7) - 1;
                break;
            case"day":
            case"date":
                f = N(this.year(), this.month(), this.date() + 1) - 1;
                break;
            case"hour":
                f = this._d.valueOf(), f += bt - Xe(f + (this._isUTC ? 0 : this.utcOffset() * Re), bt) - 1;
                break;
            case"minute":
                f = this._d.valueOf(), f += Re - Xe(f, Re) - 1;
                break;
            case"second":
                f = this._d.valueOf(), f += 1e3 - Xe(f, 1e3) - 1
        }
        return this._d.setTime(f), r.updateOffset(this, !0), this
    }, w0.format = function sr(c) {
        c || (c = this.isUtc() ? r.defaultFormatUtc : r.defaultFormat);
        var f = K0(this, c);
        return this.localeData().postformat(f)
    }, w0.from = function or(c, f) {
        return this.isValid() && (a0(c) && c.isValid() || _1(c).isValid()) ? pe({
            to: this,
            from: c
        }).locale(this.locale()).humanize(!f) : this.localeData().invalidDate()
    }, w0.fromNow = function cr(c) {
        return this.from(_1(), c)
    }, w0.to = function lr(c, f) {
        return this.isValid() && (a0(c) && c.isValid() || _1(c).isValid()) ? pe({
            from: this,
            to: c
        }).locale(this.locale()).humanize(!f) : this.localeData().invalidDate()
    }, w0.toNow = function hr(c) {
        return this.to(_1(), c)
    }, w0.get = function j0(c) {
        return b0(this[c = e1(c)]) ? this[c]() : this
    }, w0.invalidAt = function zr() {
        return M(this).overflow
    }, w0.isAfter = function Ji(c, f) {
        var N = a0(c) ? c : _1(c);
        return !(!this.isValid() || !N.isValid()) && ("millisecond" === (f = e1(f) || "millisecond") ? this.valueOf() > N.valueOf() : N.valueOf() < this.clone().startOf(f).valueOf())
    }, w0.isBefore = function Qi(c, f) {
        var N = a0(c) ? c : _1(c);
        return !(!this.isValid() || !N.isValid()) && ("millisecond" === (f = e1(f) || "millisecond") ? this.valueOf() < N.valueOf() : this.clone().endOf(f).valueOf() < N.valueOf())
    }, w0.isBetween = function Zi(c, f, N, X) {
        var K = a0(c) ? c : _1(c), r0 = a0(f) ? f : _1(f);
        return !!(this.isValid() && K.isValid() && r0.isValid()) && ("(" === (X = X || "()")[0] ? this.isAfter(K, N) : !this.isBefore(K, N)) && (")" === X[1] ? this.isBefore(r0, N) : !this.isAfter(r0, N))
    }, w0.isSame = function $i(c, f) {
        var X, N = a0(c) ? c : _1(c);
        return !(!this.isValid() || !N.isValid()) && ("millisecond" === (f = e1(f) || "millisecond") ? this.valueOf() === N.valueOf() : (X = N.valueOf(), this.clone().startOf(f).valueOf() <= X && X <= this.clone().endOf(f).valueOf()))
    }, w0.isSameOrAfter = function er(c, f) {
        return this.isSame(c, f) || this.isAfter(c, f)
    }, w0.isSameOrBefore = function tr(c, f) {
        return this.isSame(c, f) || this.isBefore(c, f)
    }, w0.isValid = function gr() {
        return g(this)
    }, w0.lang = ni, w0.locale = ri, w0.localeData = ai, w0.max = gi, w0.min = bi, w0.parsingFlags = function yr() {
        return W({}, M(this))
    }, w0.set = function a1(c, f) {
        if ("object" == typeof c) {
            var X, N = function P(c) {
                var N, f = [];
                for (N in c) n(c, N) && f.push({unit: N, priority: d[N]});
                return f.sort(function (X, K) {
                    return X.priority - K.priority
                }), f
            }(c = I(c));
            for (X = 0; X < N.length; X++) this[N[X].unit](c[N[X].unit])
        } else if (b0(this[c = e1(c)])) return this[c](f);
        return this
    }, w0.startOf = function pr(c) {
        var f, N;
        if (void 0 === (c = e1(c)) || "millisecond" === c || !this.isValid()) return this;
        switch (N = this._isUTC ? ci : oi, c) {
            case"year":
                f = N(this.year(), 0, 1);
                break;
            case"quarter":
                f = N(this.year(), this.month() - this.month() % 3, 1);
                break;
            case"month":
                f = N(this.year(), this.month(), 1);
                break;
            case"week":
                f = N(this.year(), this.month(), this.date() - this.weekday());
                break;
            case"isoWeek":
                f = N(this.year(), this.month(), this.date() - (this.isoWeekday() - 1));
                break;
            case"day":
            case"date":
                f = N(this.year(), this.month(), this.date());
                break;
            case"hour":
                f = this._d.valueOf(), f -= Xe(f + (this._isUTC ? 0 : this.utcOffset() * Re), bt);
                break;
            case"minute":
                f = this._d.valueOf(), f -= Xe(f, Re);
                break;
            case"second":
                f = this._d.valueOf(), f -= Xe(f, 1e3)
        }
        return this._d.setTime(f), r.updateOffset(this, !0), this
    }, w0.subtract = Fi, w0.toArray = function mr() {
        var c = this;
        return [c.year(), c.month(), c.date(), c.hour(), c.minute(), c.second(), c.millisecond()]
    }, w0.toObject = function Ar() {
        var c = this;
        return {
            years: c.year(),
            months: c.month(),
            date: c.date(),
            hours: c.hours(),
            minutes: c.minutes(),
            seconds: c.seconds(),
            milliseconds: c.milliseconds()
        }
    }, w0.toDate = function dr() {
        return new Date(this.valueOf())
    }, w0.toISOString = function nr(c) {
        if (!this.isValid()) return null;
        var f = !0 !== c, N = f ? this.clone().utc() : this;
        return N.year() < 0 || N.year() > 9999 ? K0(N, f ? "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYYYY-MM-DD[T]HH:mm:ss.SSSZ") : b0(Date.prototype.toISOString) ? f ? this.toDate().toISOString() : new Date(this.valueOf() + 60 * this.utcOffset() * 1e3).toISOString().replace("Z", K0(N, "Z")) : K0(N, f ? "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYY-MM-DD[T]HH:mm:ss.SSSZ")
    }, w0.inspect = function ar() {
        if (!this.isValid()) return "moment.invalid(/* " + this._i + " */)";
        var N, X, c = "moment", f = "";
        return this.isLocal() || (c = 0 === this.utcOffset() ? "moment.utc" : "moment.parseZone", f = "Z"), N = "[" + c + '("]', X = 0 <= this.year() && this.year() <= 9999 ? "YYYY" : "YYYYYY", this.format(N + X + "-MM-DD[T]HH:mm:ss.SSS" + f + '[")]')
    }, typeof Symbol < "u" && null != Symbol.for && (w0[Symbol.for("nodejs.util.inspect.custom")] = function () {
        return "Moment<" + this.format() + ">"
    }), w0.toJSON = function br() {
        return this.isValid() ? this.toISOString() : null
    }, w0.toString = function rr() {
        return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
    }, w0.unix = function Mr() {
        return Math.floor(this.valueOf() / 1e3)
    }, w0.valueOf = function ur() {
        return this._d.valueOf() - 6e4 * (this._offset || 0)
    }, w0.creationData = function vr() {
        return {input: this._i, format: this._f, locale: this._locale, isUTC: this._isUTC, strict: this._strict}
    }, w0.eraName = function Lr() {
        var c, f, N, X = this.localeData().eras();
        for (c = 0, f = X.length; c < f; ++c) if (N = this.startOf("day").valueOf(), X[c].since <= N && N <= X[c].until || X[c].until <= N && N <= X[c].since) return X[c].name;
        return ""
    }, w0.eraNarrow = function Er() {
        var c, f, N, X = this.localeData().eras();
        for (c = 0, f = X.length; c < f; ++c) if (N = this.startOf("day").valueOf(), X[c].since <= N && N <= X[c].until || X[c].until <= N && N <= X[c].since) return X[c].narrow;
        return ""
    }, w0.eraAbbr = function Nr() {
        var c, f, N, X = this.localeData().eras();
        for (c = 0, f = X.length; c < f; ++c) if (N = this.startOf("day").valueOf(), X[c].since <= N && N <= X[c].until || X[c].until <= N && N <= X[c].since) return X[c].abbr;
        return ""
    }, w0.eraYear = function qr() {
        var c, f, N, X, K = this.localeData().eras();
        for (c = 0, f = K.length; c < f; ++c) if (N = K[c].since <= K[c].until ? 1 : -1, X = this.startOf("day").valueOf(), K[c].since <= X && X <= K[c].until || K[c].until <= X && X <= K[c].since) return (this.year() - r(K[c].since).year()) * N + K[c].offset;
        return this.year()
    }, w0.year = lt, w0.isLeapYear = function qt() {
        return V(this.year())
    }, w0.weekYear = function Dr(c) {
        return li.call(this, c, this.week(), this.weekday(), this.localeData()._week.dow, this.localeData()._week.doy)
    }, w0.isoWeekYear = function xr(c) {
        return li.call(this, c, this.isoWeek(), this.isoWeekday(), 1, 4)
    }, w0.quarter = w0.quarters = function Hr(c) {
        return null == c ? Math.ceil((this.month() + 1) / 3) : this.month(3 * (c - 1) + this.month() % 3)
    }, w0.month = st, w0.daysInMonth = function ot() {
        return _e(this.year(), this.month())
    }, w0.week = w0.weeks = function pt(c) {
        var f = this.localeData().week(this);
        return null == c ? f : this.add(7 * (c - f), "d")
    }, w0.isoWeek = w0.isoWeeks = function Ue(c) {
        var f = Ce(this, 1, 4).week;
        return null == c ? f : this.add(7 * (c - f), "d")
    }, w0.weeksInYear = function Ir() {
        var c = this.localeData()._week;
        return ie(this.year(), c.dow, c.doy)
    }, w0.weeksInWeekYear = function Fr() {
        var c = this.localeData()._week;
        return ie(this.weekYear(), c.dow, c.doy)
    }, w0.isoWeeksInYear = function Rr() {
        return ie(this.year(), 1, 4)
    }, w0.isoWeeksInISOWeekYear = function Xr() {
        return ie(this.isoWeekYear(), 1, 4)
    }, w0.date = hi, w0.day = w0.days = function $e(c) {
        if (!this.isValid()) return null != c ? this : NaN;
        var f = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        return null != c ? (c = function ft(c, f) {
            return "string" != typeof c ? c : isNaN(c) ? "number" == typeof (c = f.weekdaysParse(c)) ? c : null : parseInt(c, 10)
        }(c, this.localeData()), this.add(c - f, "d")) : f
    }, w0.weekday = function j1(c) {
        if (!this.isValid()) return null != c ? this : NaN;
        var f = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return null == c ? f : this.add(c - f, "d")
    }, w0.isoWeekday = function T1(c) {
        if (!this.isValid()) return null != c ? this : NaN;
        if (null != c) {
            var f = function Wt(c, f) {
                return "string" == typeof c ? f.weekdaysParse(c) % 7 || 7 : isNaN(c) ? null : c
            }(c, this.localeData());
            return this.day(this.day() % 7 ? f : f - 7)
        }
        return this.day() || 7
    }, w0.dayOfYear = function Gr(c) {
        var f = Math.round((this.clone().startOf("day") - this.clone().startOf("year")) / 864e5) + 1;
        return null == c ? f : this.add(c - f, "d")
    }, w0.hour = w0.hours = _, w0.minute = w0.minutes = jr, w0.second = w0.seconds = Ur, w0.millisecond = w0.milliseconds = pi, w0.utcOffset = function Ni(c, f, N) {
        var K, X = this._offset || 0;
        if (!this.isValid()) return null != c ? this : NaN;
        if (null != c) {
            if ("string" == typeof c) {
                if (null === (c = It(X1, c))) return this
            } else Math.abs(c) < 16 && !N && (c *= 60);
            return !this._isUTC && f && (K = Vt(this)), this._offset = c, this._isUTC = !0, null != K && this.add(K, "m"), X !== c && (!f || this._changeInProgress ? ti(this, pe(c - X, "m"), 1, !1) : this._changeInProgress || (this._changeInProgress = !0, r.updateOffset(this, !0), this._changeInProgress = null)), this
        }
        return this._isUTC ? X : Vt(this)
    }, w0.utc = function qi(c) {
        return this.utcOffset(0, c)
    }, w0.local = function Ci(c) {
        return this._isUTC && (this.utcOffset(0, c), this._isUTC = !1, c && this.subtract(Vt(this), "m")), this
    }, w0.parseZone = function wi() {
        if (null != this._tzm) this.utcOffset(this._tzm, !1, !0); else if ("string" == typeof this._i) {
            var c = It(ve, this._i);
            null != c ? this.utcOffset(c) : this.utcOffset(0, !0)
        }
        return this
    }, w0.hasAlignedHourOffset = function Bi(c) {
        return !!this.isValid() && (c = c ? _1(c).utcOffset() : 0, (this.utcOffset() - c) % 60 == 0)
    }, w0.isDST = function Pi() {
        return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset()
    }, w0.isLocal = function Wi() {
        return !!this.isValid() && !this._isUTC
    }, w0.isUtcOffset = function Di() {
        return !!this.isValid() && this._isUTC
    }, w0.isUtc = Zt, w0.isUTC = Zt, w0.zoneAbbr = function Kr() {
        return this._isUTC ? "UTC" : ""
    }, w0.zoneName = function Jr() {
        return this._isUTC ? "Coordinated Universal Time" : ""
    }, w0.dates = A0("dates accessor is deprecated. Use date instead.", hi), w0.months = A0("months accessor is deprecated. Use month instead", st), w0.years = A0("years accessor is deprecated. Use year instead", lt), w0.zone = A0("moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/", function _i(c, f) {
        return null != c ? ("string" != typeof c && (c = -c), this.utcOffset(c, f), this) : -this.utcOffset()
    }), w0.isDSTShifted = A0("isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information", function ki() {
        if (!T(this._isDSTShifted)) return this._isDSTShifted;
        var f, c = {};
        return s0(c, this), (c = U1(c))._a ? (f = c._isUTC ? S(c._a) : _1(c._a), this._isDSTShifted = this.isValid() && function Li(c, f, N) {
            var z0, X = Math.min(c.length, f.length), K = Math.abs(c.length - f.length), r0 = 0;
            for (z0 = 0; z0 < X; z0++) (N && c[z0] !== f[z0] || !N && e0(c[z0]) !== e0(f[z0])) && r0++;
            return r0 + K
        }(c._a, f.toArray()) > 0) : this._isDSTShifted = !1, this._isDSTShifted
    });
    var A1 = v0.prototype;

    function yt(c, f, N, X) {
        var K = W0(), r0 = S().set(X, f);
        return K[N](r0, c)
    }

    function ui(c, f, N) {
        if (R(c) && (f = c, c = void 0), c = c || "", null != f) return yt(c, f, N, "month");
        var X, K = [];
        for (X = 0; X < 12; X++) K[X] = yt(c, X, N, "month");
        return K
    }

    function jt(c, f, N, X) {
        "boolean" == typeof c ? (R(f) && (N = f, f = void 0), f = f || "") : (N = f = c, c = !1, R(f) && (N = f, f = void 0), f = f || "");
        var z0, K = W0(), r0 = c ? K._week.dow : 0, G0 = [];
        if (null != N) return yt(f, (N + r0) % 7, X, "day");
        for (z0 = 0; z0 < 7; z0++) G0[z0] = yt(f, (z0 + r0) % 7, X, "day");
        return G0
    }

    A1.calendar = function y0(c, f, N) {
        var X = this._calendar[c] || this._calendar.sameElse;
        return b0(X) ? X.call(f, N) : X
    }, A1.longDateFormat = function b1(c) {
        var f = this._longDateFormat[c], N = this._longDateFormat[c.toUpperCase()];
        return f || !N ? f : (this._longDateFormat[c] = N.match(O0).map(function (X) {
            return "MMMM" === X || "MM" === X || "DD" === X || "dddd" === X ? X.slice(1) : X
        }).join(""), this._longDateFormat[c])
    }, A1.invalidDate = function Z0() {
        return this._invalidDate
    }, A1.ordinal = function q1(c) {
        return this._ordinal.replace("%d", c)
    }, A1.preparse = fi, A1.postformat = fi, A1.relativeTime = function H1(c, f, N, X) {
        var K = this._relativeTime[N];
        return b0(K) ? K(c, f, N, X) : K.replace(/%d/i, c)
    }, A1.pastFuture = function n1(c, f) {
        var N = this._relativeTime[c > 0 ? "future" : "past"];
        return b0(N) ? N(f) : N.replace(/%s/i, f)
    }, A1.set = function q0(c) {
        var f, N;
        for (N in c) n(c, N) && (b0(f = c[N]) ? this[N] = f : this["_" + N] = f);
        this._config = c, this._dayOfMonthOrdinalParseLenient = new RegExp((this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) + "|" + /\d{1,2}/.source)
    }, A1.eras = function Tr(c, f) {
        var N, X, K, r0 = this._eras || W0("en")._eras;
        for (N = 0, X = r0.length; N < X; ++N) switch ("string" == typeof r0[N].since && (K = r(r0[N].since).startOf("day"), r0[N].since = K.valueOf()), typeof r0[N].until) {
            case"undefined":
                r0[N].until = 1 / 0;
                break;
            case"string":
                K = r(r0[N].until).startOf("day").valueOf(), r0[N].until = K.valueOf()
        }
        return r0
    }, A1.erasParse = function Or(c, f, N) {
        var X, K, z0, G0, h1, r0 = this.eras();
        for (c = c.toUpperCase(), X = 0, K = r0.length; X < K; ++X) if (z0 = r0[X].name.toUpperCase(), G0 = r0[X].abbr.toUpperCase(), h1 = r0[X].narrow.toUpperCase(), N) switch (f) {
            case"N":
            case"NN":
            case"NNN":
                if (G0 === c) return r0[X];
                break;
            case"NNNN":
                if (z0 === c) return r0[X];
                break;
            case"NNNNN":
                if (h1 === c) return r0[X]
        } else if ([z0, G0, h1].indexOf(c) >= 0) return r0[X]
    }, A1.erasConvertYear = function Sr(c, f) {
        var N = c.since <= c.until ? 1 : -1;
        return void 0 === f ? r(c.since).year() : r(c.since).year() + (f - c.offset) * N
    }, A1.erasAbbrRegex = function wr(c) {
        return n(this, "_erasAbbrRegex") || Gt.call(this), c ? this._erasAbbrRegex : this._erasRegex
    }, A1.erasNameRegex = function Cr(c) {
        return n(this, "_erasNameRegex") || Gt.call(this), c ? this._erasNameRegex : this._erasRegex
    }, A1.erasNarrowRegex = function Br(c) {
        return n(this, "_erasNarrowRegex") || Gt.call(this), c ? this._erasNarrowRegex : this._erasRegex
    }, A1.months = function Lt(c, f) {
        return c ? s(this._months) ? this._months[c.month()] : this._months[(this._months.isFormat || nt).test(f) ? "format" : "standalone"][c.month()] : s(this._months) ? this._months : this._months.standalone
    }, A1.monthsShort = function k1(c, f) {
        return c ? s(this._monthsShort) ? this._monthsShort[c.month()] : this._monthsShort[nt.test(f) ? "format" : "standalone"][c.month()] : s(this._monthsShort) ? this._monthsShort : this._monthsShort.standalone
    }, A1.monthsParse = function Et(c, f, N) {
        var X, K, r0;
        if (this._monthsParseExact) return at.call(this, c, f, N);
        for (this._monthsParse || (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = []), X = 0; X < 12; X++) {
            if (K = S([2e3, X]), N && !this._longMonthsParse[X] && (this._longMonthsParse[X] = new RegExp("^" + this.months(K, "").replace(".", "") + "$", "i"), this._shortMonthsParse[X] = new RegExp("^" + this.monthsShort(K, "").replace(".", "") + "$", "i")), !N && !this._monthsParse[X] && (r0 = "^" + this.months(K, "") + "|^" + this.monthsShort(K, ""), this._monthsParse[X] = new RegExp(r0.replace(".", ""), "i")), N && "MMMM" === f && this._longMonthsParse[X].test(c)) return X;
            if (N && "MMM" === f && this._shortMonthsParse[X].test(c)) return X;
            if (!N && this._monthsParse[X].test(c)) return X
        }
    }, A1.monthsRegex = function _t(c) {
        return this._monthsParseExact ? (n(this, "_monthsRegex") || ct.call(this), c ? this._monthsStrictRegex : this._monthsRegex) : (n(this, "_monthsRegex") || (this._monthsRegex = St), this._monthsStrictRegex && c ? this._monthsStrictRegex : this._monthsRegex)
    }, A1.monthsShortRegex = function Nt(c) {
        return this._monthsParseExact ? (n(this, "_monthsRegex") || ct.call(this), c ? this._monthsShortStrictRegex : this._monthsShortRegex) : (n(this, "_monthsShortRegex") || (this._monthsShortRegex = Oe), this._monthsShortStrictRegex && c ? this._monthsShortStrictRegex : this._monthsShortRegex)
    }, A1.week = function wt(c) {
        return Ce(c, this._week.dow, this._week.doy).week
    }, A1.firstDayOfYear = function kt() {
        return this._week.doy
    }, A1.firstDayOfWeek = function Pt() {
        return this._week.dow
    }, A1.weekdays = function Qe(c, f) {
        var N = s(this._weekdays) ? this._weekdays : this._weekdays[c && !0 !== c && this._weekdays.isFormat.test(f) ? "format" : "standalone"];
        return !0 === c ? Ye(N, this._week.dow) : c ? N[c.day()] : N
    }, A1.weekdaysMin = function ut(c) {
        return !0 === c ? Ye(this._weekdaysMin, this._week.dow) : c ? this._weekdaysMin[c.day()] : this._weekdaysMin
    }, A1.weekdaysShort = function xe(c) {
        return !0 === c ? Ye(this._weekdaysShort, this._week.dow) : c ? this._weekdaysShort[c.day()] : this._weekdaysShort
    }, A1.weekdaysParse = function fe(c, f, N) {
        var X, K, r0;
        if (this._weekdaysParseExact) return Ze.call(this, c, f, N);
        for (this._weekdaysParse || (this._weekdaysParse = [], this._minWeekdaysParse = [], this._shortWeekdaysParse = [], this._fullWeekdaysParse = []), X = 0; X < 7; X++) {
            if (K = S([2e3, 1]).day(X), N && !this._fullWeekdaysParse[X] && (this._fullWeekdaysParse[X] = new RegExp("^" + this.weekdays(K, "").replace(".", "\\.?") + "$", "i"), this._shortWeekdaysParse[X] = new RegExp("^" + this.weekdaysShort(K, "").replace(".", "\\.?") + "$", "i"), this._minWeekdaysParse[X] = new RegExp("^" + this.weekdaysMin(K, "").replace(".", "\\.?") + "$", "i")), this._weekdaysParse[X] || (r0 = "^" + this.weekdays(K, "") + "|^" + this.weekdaysShort(K, "") + "|^" + this.weekdaysMin(K, ""), this._weekdaysParse[X] = new RegExp(r0.replace(".", ""), "i")), N && "dddd" === f && this._fullWeekdaysParse[X].test(c)) return X;
            if (N && "ddd" === f && this._shortWeekdaysParse[X].test(c)) return X;
            if (N && "dd" === f && this._minWeekdaysParse[X].test(c)) return X;
            if (!N && this._weekdaysParse[X].test(c)) return X
        }
    }, A1.weekdaysRegex = function Dt(c) {
        return this._weekdaysParseExact ? (n(this, "_weekdaysRegex") || Se.call(this), c ? this._weekdaysStrictRegex : this._weekdaysRegex) : (n(this, "_weekdaysRegex") || (this._weekdaysRegex = Be), this._weekdaysStrictRegex && c ? this._weekdaysStrictRegex : this._weekdaysRegex)
    }, A1.weekdaysShortRegex = function xt(c) {
        return this._weekdaysParseExact ? (n(this, "_weekdaysRegex") || Se.call(this), c ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex) : (n(this, "_weekdaysShortRegex") || (this._weekdaysShortRegex = Ke), this._weekdaysShortStrictRegex && c ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex)
    }, A1.weekdaysMinRegex = function Rt(c) {
        return this._weekdaysParseExact ? (n(this, "_weekdaysRegex") || Se.call(this), c ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex) : (n(this, "_weekdaysMinRegex") || (this._weekdaysMinRegex = Je), this._weekdaysMinStrictRegex && c ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex)
    }, A1.isPM = function p(c) {
        return "p" === (c + "").toLowerCase().charAt(0)
    }, A1.meridiem = function w(c, f, N) {
        return c > 11 ? N ? "pm" : "PM" : N ? "am" : "AM"
    }, h0("en", {
        eras: [{
            since: "0001-01-01",
            until: 1 / 0,
            offset: 1,
            name: "Anno Domini",
            narrow: "AD",
            abbr: "AD"
        }, {since: "0000-12-31", until: -1 / 0, offset: 1, name: "Before Christ", narrow: "BC", abbr: "BC"}],
        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function (c) {
            var f = c % 10;
            return c + (1 === e0(c % 100 / 10) ? "th" : 1 === f ? "st" : 2 === f ? "nd" : 3 === f ? "rd" : "th")
        }
    }), r.lang = A0("moment.lang is deprecated. Use moment.locale instead.", h0), r.langData = A0("moment.langData is deprecated. Use moment.localeData instead.", W0);
    var be = Math.abs;

    function Mi(c, f, N, X) {
        var K = pe(f, N);
        return c._milliseconds += X * K._milliseconds, c._days += X * K._days, c._months += X * K._months, c._bubble()
    }

    function di(c) {
        return c < 0 ? Math.floor(c) : Math.ceil(c)
    }

    function mi(c) {
        return 4800 * c / 146097
    }

    function Ut(c) {
        return 146097 * c / 4800
    }

    function ge(c) {
        return function () {
            return this.as(c)
        }
    }

    var fn = ge("ms"), un = ge("s"), Mn = ge("m"), dn = ge("h"), mn = ge("d"), An = ge("w"), bn = ge("M"), gn = ge("Q"),
        yn = ge("y");

    function ke(c) {
        return function () {
            return this.isValid() ? this._data[c] : NaN
        }
    }

    var Tn = ke("milliseconds"), On = ke("seconds"), Sn = ke("minutes"), Ln = ke("hours"), En = ke("days"),
        Nn = ke("months"), _n = ke("years"), ye = Math.round, Ie = {ss: 44, s: 45, m: 45, h: 22, d: 26, w: null, M: 11};

    function Cn(c, f, N, X, K) {
        return K.relativeTime(f || 1, !!N, c, X)
    }

    var Yt = Math.abs;

    function Fe(c) {
        return (c > 0) - (c < 0) || +c
    }

    function zt() {
        if (!this.isValid()) return this.localeData().invalidDate();
        var X, K, r0, z0, h1, E1, Me, ze, c = Yt(this._milliseconds) / 1e3, f = Yt(this._days), N = Yt(this._months),
            G0 = this.asSeconds();
        return G0 ? (X = $(c / 60), K = $(X / 60), c %= 60, X %= 60, r0 = $(N / 12), N %= 12, z0 = c ? c.toFixed(3).replace(/\.?0+$/, "") : "", h1 = G0 < 0 ? "-" : "", E1 = Fe(this._months) !== Fe(G0) ? "-" : "", Me = Fe(this._days) !== Fe(G0) ? "-" : "", ze = Fe(this._milliseconds) !== Fe(G0) ? "-" : "", h1 + "P" + (r0 ? E1 + r0 + "Y" : "") + (N ? E1 + N + "M" : "") + (f ? Me + f + "D" : "") + (K || X || c ? "T" : "") + (K ? ze + K + "H" : "") + (X ? ze + X + "M" : "") + (c ? ze + z0 + "S" : "")) : "P0D"
    }

    var d1 = Mt.prototype;
    return d1.isValid = function Oi() {
        return this._isValid
    }, d1.abs = function sn() {
        var c = this._data;
        return this._milliseconds = be(this._milliseconds), this._days = be(this._days), this._months = be(this._months), c.milliseconds = be(c.milliseconds), c.seconds = be(c.seconds), c.minutes = be(c.minutes), c.hours = be(c.hours), c.months = be(c.months), c.years = be(c.years), this
    }, d1.add = function on(c, f) {
        return Mi(this, c, f, 1)
    }, d1.subtract = function cn(c, f) {
        return Mi(this, c, f, -1)
    }, d1.as = function hn(c) {
        if (!this.isValid()) return NaN;
        var f, N, X = this._milliseconds;
        if ("month" === (c = e1(c)) || "quarter" === c || "year" === c) switch (f = this._days + X / 864e5, N = this._months + mi(f), c) {
            case"month":
                return N;
            case"quarter":
                return N / 3;
            case"year":
                return N / 12
        } else switch (f = this._days + Math.round(Ut(this._months)), c) {
            case"week":
                return f / 7 + X / 6048e5;
            case"day":
                return f + X / 864e5;
            case"hour":
                return 24 * f + X / 36e5;
            case"minute":
                return 1440 * f + X / 6e4;
            case"second":
                return 86400 * f + X / 1e3;
            case"millisecond":
                return Math.floor(864e5 * f) + X;
            default:
                throw new Error("Unknown unit " + c)
        }
    }, d1.asMilliseconds = fn, d1.asSeconds = un, d1.asMinutes = Mn, d1.asHours = dn, d1.asDays = mn, d1.asWeeks = An, d1.asMonths = bn, d1.asQuarters = gn, d1.asYears = yn, d1.valueOf = function pn() {
        return this.isValid() ? this._milliseconds + 864e5 * this._days + this._months % 12 * 2592e6 + 31536e6 * e0(this._months / 12) : NaN
    }, d1._bubble = function ln() {
        var K, r0, z0, G0, h1, c = this._milliseconds, f = this._days, N = this._months, X = this._data;
        return c >= 0 && f >= 0 && N >= 0 || c <= 0 && f <= 0 && N <= 0 || (c += 864e5 * di(Ut(N) + f), f = 0, N = 0), X.milliseconds = c % 1e3, K = $(c / 1e3), X.seconds = K % 60, r0 = $(K / 60), X.minutes = r0 % 60, z0 = $(r0 / 60), X.hours = z0 % 24, f += $(z0 / 24), N += h1 = $(mi(f)), f -= di(Ut(h1)), G0 = $(N / 12), N %= 12, X.days = f, X.months = N, X.years = G0, this
    }, d1.clone = function zn() {
        return pe(this)
    }, d1.get = function vn(c) {
        return c = e1(c), this.isValid() ? this[c + "s"]() : NaN
    }, d1.milliseconds = Tn, d1.seconds = On, d1.minutes = Sn, d1.hours = Ln, d1.days = En, d1.weeks = function qn() {
        return $(this.days() / 7)
    }, d1.months = Nn, d1.years = _n, d1.humanize = function kn(c, f) {
        if (!this.isValid()) return this.localeData().invalidDate();
        var K, r0, N = !1, X = Ie;
        return "object" == typeof c && (f = c, c = !1), "boolean" == typeof c && (N = c), "object" == typeof f && (X = Object.assign({}, Ie, f), null != f.s && null == f.ss && (X.ss = f.s - 1)), r0 = function wn(c, f, N, X) {
            var K = pe(c).abs(), r0 = ye(K.as("s")), z0 = ye(K.as("m")), G0 = ye(K.as("h")), h1 = ye(K.as("d")),
                E1 = ye(K.as("M")), Me = ye(K.as("w")), ze = ye(K.as("y")),
                Ee = r0 <= N.ss && ["s", r0] || r0 < N.s && ["ss", r0] || z0 <= 1 && ["m"] || z0 < N.m && ["mm", z0] || G0 <= 1 && ["h"] || G0 < N.h && ["hh", G0] || h1 <= 1 && ["d"] || h1 < N.d && ["dd", h1];
            return null != N.w && (Ee = Ee || Me <= 1 && ["w"] || Me < N.w && ["ww", Me]), (Ee = Ee || E1 <= 1 && ["M"] || E1 < N.M && ["MM", E1] || ze <= 1 && ["y"] || ["yy", ze])[2] = f, Ee[3] = +c > 0, Ee[4] = X, Cn.apply(null, Ee)
        }(this, !N, X, K = this.localeData()), N && (r0 = K.pastFuture(+this, r0)), K.postformat(r0)
    }, d1.toISOString = zt, d1.toString = zt, d1.toJSON = zt, d1.locale = ri, d1.localeData = ai, d1.toIsoString = A0("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)", zt), d1.lang = ni, p0("X", 0, 0, "unix"), p0("x", 0, 0, "valueOf"), x0("x", J1), x0("X", /[+-]?\d+(\.\d{1,3})?/), v1("X", function (c, f, N) {
        N._d = new Date(1e3 * parseFloat(c))
    }), v1("x", function (c, f, N) {
        N._d = new Date(e0(c))
    }), r.version = "2.26.0", function a(c) {
        e = c
    }(_1), r.fn = w0, r.min = function yi() {
        return Jt("isBefore", [].slice.call(arguments, 0))
    }, r.max = function zi() {
        return Jt("isAfter", [].slice.call(arguments, 0))
    }, r.now = function () {
        return Date.now ? Date.now() : +new Date
    }, r.utc = S, r.unix = function Qr(c) {
        return _1(1e3 * c)
    }, r.months = function en(c, f) {
        return ui(c, f, "months")
    }, r.isDate = k, r.locale = h0, r.invalid = x, r.duration = pe, r.isMoment = a0, r.weekdays = function rn(c, f, N) {
        return jt(c, f, N, "weekdays")
    }, r.parseZone = function Zr() {
        return _1.apply(null, arguments).parseZone()
    }, r.localeData = W0, r.isDuration = dt, r.monthsShort = function tn(c, f) {
        return ui(c, f, "monthsShort")
    }, r.weekdaysMin = function an(c, f, N) {
        return jt(c, f, N, "weekdaysMin")
    }, r.defineLocale = B0, r.updateLocale = function D0(c, f) {
        if (null != f) {
            var N, X, K = q;
            null != j[c] && null != j[c].parentLocale ? j[c].set(N0(j[c]._config, f)) : (null != (X = S0(c)) && (K = X._config), f = N0(K, f), null == X && (f.abbr = c), (N = new v0(f)).parentLocale = j[c], j[c] = N), h0(c)
        } else null != j[c] && (null != j[c].parentLocale ? (j[c] = j[c].parentLocale, c === h0() && h0(c)) : null != j[c] && delete j[c]);
        return j[c]
    }, r.locales = function I0() {
        return C0(j)
    }, r.weekdaysShort = function nn(c, f, N) {
        return jt(c, f, N, "weekdaysShort")
    }, r.normalizeUnits = e1, r.relativeTimeRounding = function Bn(c) {
        return void 0 === c ? ye : "function" == typeof c && (ye = c, !0)
    }, r.relativeTimeThreshold = function Pn(c, f) {
        return void 0 !== Ie[c] && (void 0 === f ? Ie[c] : (Ie[c] = f, "s" === c && (Ie.ss = f - 1), !0))
    }, r.calendarFormat = function Ui(c, f) {
        var N = c.diff(f, "days", !0);
        return N < -6 ? "sameElse" : N < -1 ? "lastWeek" : N < 0 ? "lastDay" : N < 1 ? "sameDay" : N < 2 ? "nextDay" : N < 7 ? "nextWeek" : "sameElse"
    }, r.prototype = w0, r.HTML5_FMT = {
        DATETIME_LOCAL: "YYYY-MM-DDTHH:mm",
        DATETIME_LOCAL_SECONDS: "YYYY-MM-DDTHH:mm:ss",
        DATETIME_LOCAL_MS: "YYYY-MM-DDTHH:mm:ss.SSS",
        DATE: "YYYY-MM-DD",
        TIME: "HH:mm",
        TIME_SECONDS: "HH:mm:ss",
        TIME_MS: "HH:mm:ss.SSS",
        WEEK: "GGGG-[W]WW",
        MONTH: "YYYY-MM"
    }, r
}), function (e, r) {
    "object" == typeof module && module.exports ? module.exports = r(require("moment")) : "function" == typeof define && define.amd ? define(["moment"], r) : r(e.moment)
}(this, function (e) {
    void 0 === e.version && e.default && (e = e.default);
    var r, a = {}, s = {}, h = {}, n = {}, m = {};
    e && "string" == typeof e.version || N0("Moment Timezone requires Moment.js. See https://momentjs.com/timezone/docs/#/use-it/browser/");
    var T = e.version.split("."), R = +T[0], k = +T[1];

    function U(Z) {
        return 96 < Z ? Z - 87 : 64 < Z ? Z - 29 : Z - 48
    }

    function W(Z) {
        var m0 = 0, L0 = Z.split("."), p0 = L0[0], _0 = L0[1] || "", H0 = 1, K0 = 0, X0 = 1;
        for (45 === Z.charCodeAt(0) && (X0 = -(m0 = 1)); m0 < p0.length; m0++) K0 = 60 * K0 + U(p0.charCodeAt(m0));
        for (m0 = 0; m0 < _0.length; m0++) H0 /= 60, K0 += U(_0.charCodeAt(m0)) * H0;
        return K0 * X0
    }

    function S(Z) {
        for (var m0 = 0; m0 < Z.length; m0++) Z[m0] = W(Z[m0])
    }

    function L(Z, m0) {
        var L0, p0 = [];
        for (L0 = 0; L0 < m0.length; L0++) p0[L0] = Z[m0[L0]];
        return p0
    }

    function M(Z) {
        var m0 = Z.split("|"), L0 = m0[2].split(" "), p0 = m0[3].split(""), _0 = m0[4].split(" ");
        return S(L0), S(p0), S(_0), function (H0, K0) {
            for (var X0 = 0; X0 < K0; X0++) H0[X0] = Math.round((H0[X0 - 1] || 0) + 6e4 * H0[X0]);
            H0[K0 - 1] = 1 / 0
        }(_0, p0.length), {
            name: m0[0],
            abbrs: L(m0[1].split(" "), p0),
            offsets: L(L0, p0),
            untils: _0,
            population: 0 | m0[5]
        }
    }

    function v(Z) {
        Z && this._set(M(Z))
    }

    function g(Z, m0) {
        this.name = Z, this.zones = m0
    }

    function x(Z) {
        var m0 = Z.toTimeString(), L0 = m0.match(/\([a-z ]+\)/i);
        "GMT" === (L0 = L0 && L0[0] ? (L0 = L0[0].match(/[A-Z]/g)) ? L0.join("") : void 0 : (L0 = m0.match(/[A-Z]{3,5}/g)) ? L0[0] : void 0) && (L0 = void 0), this.at = +Z, this.abbr = L0, this.offset = Z.getTimezoneOffset()
    }

    function Q(Z) {
        this.zone = Z, this.offsetScore = 0, this.abbrScore = 0
    }

    function t0(Z, m0) {
        for (var L0, p0; p0 = 6e4 * ((m0.at - Z.at) / 12e4 | 0);) (L0 = new x(new Date(Z.at + p0))).offset === Z.offset ? Z = L0 : m0 = L0;
        return Z
    }

    function s0(Z, m0) {
        return Z.offsetScore !== m0.offsetScore ? Z.offsetScore - m0.offsetScore : Z.abbrScore !== m0.abbrScore ? Z.abbrScore - m0.abbrScore : Z.zone.population !== m0.zone.population ? m0.zone.population - Z.zone.population : m0.zone.name.localeCompare(Z.zone.name)
    }

    function M0(Z, m0) {
        var L0, p0;
        for (S(m0), L0 = 0; L0 < m0.length; L0++) m[p0 = m0[L0]] = m[p0] || {}, m[p0][Z] = !0
    }

    function d0(Z) {
        return (Z || "").toLowerCase().replace(/\//g, "_")
    }

    function A0(Z) {
        var m0, L0, p0, _0;
        for ("string" == typeof Z && (Z = [Z]), m0 = 0; m0 < Z.length; m0++) _0 = d0(L0 = (p0 = Z[m0].split("|"))[0]), a[_0] = Z[m0], n[_0] = L0, M0(_0, p0[2].split(" "))
    }

    function E0(Z, m0) {
        Z = d0(Z);
        var L0, p0 = a[Z];
        return p0 instanceof v ? p0 : "string" == typeof p0 ? (p0 = new v(p0), a[Z] = p0) : s[Z] && m0 !== E0 && (L0 = E0(s[Z], E0)) ? ((p0 = a[Z] = new v)._set(L0), p0.name = n[Z], p0) : null
    }

    function k0(Z) {
        var m0, L0, p0, _0;
        for ("string" == typeof Z && (Z = [Z]), m0 = 0; m0 < Z.length; m0++) p0 = d0((L0 = Z[m0].split("|"))[0]), _0 = d0(L0[1]), s[p0] = _0, n[p0] = L0[0], s[_0] = p0, n[_0] = L0[1]
    }

    function b0(Z) {
        A0(Z.zones), k0(Z.links), function (m0) {
            var L0, p0, _0, H0;
            if (m0 && m0.length) for (L0 = 0; L0 < m0.length; L0++) p0 = (H0 = m0[L0].split("|"))[0].toUpperCase(), _0 = H0[1].split(" "), h[p0] = new g(p0, _0)
        }(Z.countries), v0.dataVersion = Z.version
    }

    function q0(Z) {
        return !(!Z._a || void 0 !== Z._tzm || "X" === Z._f || "x" === Z._f)
    }

    function N0(Z) {
        typeof console < "u" && "function" == typeof console.error && console.error(Z)
    }

    function v0(Z) {
        var m0 = Array.prototype.slice.call(arguments, 0, -1), L0 = arguments[arguments.length - 1], p0 = E0(L0),
            _0 = e.utc.apply(null, m0);
        return p0 && !e.isMoment(Z) && q0(_0) && _0.add(p0.parse(_0), "minutes"), _0.tz(L0), _0
    }

    (R < 2 || 2 == R && k < 6) && N0("Moment Timezone requires Moment.js >= 2.6.0. You are using Moment.js " + e.version + ". See momentjs.com"), v.prototype = {
        _set: function (Z) {
            this.name = Z.name, this.abbrs = Z.abbrs, this.untils = Z.untils, this.offsets = Z.offsets, this.population = Z.population
        }, _index: function (Z) {
            var m0, L0 = +Z, p0 = this.untils;
            for (m0 = 0; m0 < p0.length; m0++) if (L0 < p0[m0]) return m0
        }, countries: function () {
            var Z = this.name;
            return Object.keys(h).filter(function (m0) {
                return -1 !== h[m0].zones.indexOf(Z)
            })
        }, parse: function (Z) {
            var m0, L0, p0, _0, H0 = +Z, K0 = this.offsets, X0 = this.untils, V0 = X0.length - 1;
            for (_0 = 0; _0 < V0; _0++) if (p0 = K0[_0 && _0 - 1], (m0 = K0[_0]) < (L0 = K0[_0 + 1]) && v0.moveAmbiguousForward ? m0 = L0 : p0 < m0 && v0.moveInvalidForward && (m0 = p0), H0 < X0[_0] - 6e4 * m0) return K0[_0];
            return K0[V0]
        }, abbr: function (Z) {
            return this.abbrs[this._index(Z)]
        }, offset: function (Z) {
            return N0("zone.offset has been deprecated in favor of zone.utcOffset"), this.offsets[this._index(Z)]
        }, utcOffset: function (Z) {
            return this.offsets[this._index(Z)]
        }
    }, Q.prototype.scoreOffsetAt = function (Z) {
        this.offsetScore += Math.abs(this.zone.utcOffset(Z.at) - Z.offset), this.zone.abbr(Z.at).replace(/[^A-Z]/g, "") !== Z.abbr && this.abbrScore++
    }, v0.version = "0.5.31", v0.dataVersion = "", v0._zones = a, v0._links = s, v0._names = n, v0._countries = h, v0.add = A0, v0.link = k0, v0.load = b0, v0.zone = E0, v0.zoneExists = function Z(m0) {
        return Z.didShowError || (Z.didShowError = !0, N0("moment.tz.zoneExists('" + m0 + "') has been deprecated in favor of !moment.tz.zone('" + m0 + "')")), !!E0(m0)
    }, v0.guess = function (Z) {
        return r && !Z || (r = function a0() {
            try {
                var Z = Intl.DateTimeFormat().resolvedOptions().timeZone;
                if (Z && 3 < Z.length) {
                    var m0 = n[d0(Z)];
                    if (m0) return m0;
                    N0("Moment Timezone found " + Z + " from the Intl api, but did not have that data loaded.")
                }
            } catch {
            }
            var L0, p0, _0, H0 = function () {
                var b1, Y0, Z0, m1 = (new Date).getFullYear() - 2, R0 = new x(new Date(m1, 0, 1)), q1 = [R0];
                for (Z0 = 1; Z0 < 48; Z0++) (Y0 = new x(new Date(m1, Z0, 1))).offset !== R0.offset && (b1 = t0(R0, Y0), q1.push(b1), q1.push(new x(new Date(b1.at + 6e4)))), R0 = Y0;
                for (Z0 = 0; Z0 < 4; Z0++) q1.push(new x(new Date(m1 + Z0, 0, 1))), q1.push(new x(new Date(m1 + Z0, 6, 1)));
                return q1
            }(), K0 = H0.length, X0 = function (b1) {
                var Y0, Z0, m1, R0 = b1.length, q1 = {}, D1 = [];
                for (Y0 = 0; Y0 < R0; Y0++) for (Z0 in m1 = m[b1[Y0].offset] || {}) m1.hasOwnProperty(Z0) && (q1[Z0] = !0);
                for (Y0 in q1) q1.hasOwnProperty(Y0) && D1.push(n[Y0]);
                return D1
            }(H0), V0 = [];
            for (p0 = 0; p0 < X0.length; p0++) {
                for (L0 = new Q(E0(X0[p0]), K0), _0 = 0; _0 < K0; _0++) L0.scoreOffsetAt(H0[_0]);
                V0.push(L0)
            }
            return V0.sort(s0), 0 < V0.length ? V0[0].zone.name : void 0
        }()), r
    }, v0.names = function () {
        var Z, m0 = [];
        for (Z in n) n.hasOwnProperty(Z) && (a[Z] || a[s[Z]]) && n[Z] && m0.push(n[Z]);
        return m0.sort()
    }, v0.Zone = v, v0.unpack = M, v0.unpackBase60 = W, v0.needsOffset = q0, v0.moveInvalidForward = !0, v0.moveAmbiguousForward = !1, v0.countries = function () {
        return Object.keys(h)
    }, v0.zonesForCountry = function (Z, m0) {
        if (p0 = (p0 = Z).toUpperCase(), !(Z = h[p0] || null)) return null;
        var p0, L0 = Z.zones.sort();
        return m0 ? L0.map(function (p0) {
            return {name: p0, offset: E0(p0).utcOffset(new Date)}
        }) : L0
    };
    var C0, J0 = e.fn;

    function y0(Z) {
        return function () {
            return this._z ? this._z.abbr(this) : Z.call(this)
        }
    }

    function c0(Z) {
        return function () {
            return this._z = null, Z.apply(this, arguments)
        }
    }

    e.tz = v0, e.defaultZone = null, e.updateOffset = function (Z, m0) {
        var L0, p0 = e.defaultZone;
        if (void 0 === Z._z && (p0 && q0(Z) && !Z._isUTC && (Z._d = e.utc(Z._a)._d, Z.utc().add(p0.parse(Z), "minutes")), Z._z = p0), Z._z) if (L0 = Z._z.utcOffset(Z), Math.abs(L0) < 16 && (L0 /= 60), void 0 !== Z.utcOffset) {
            var _0 = Z._z;
            Z.utcOffset(-L0, m0), Z._z = _0
        } else Z.zone(L0, m0)
    }, J0.tz = function (Z, m0) {
        if (Z) {
            if ("string" != typeof Z) throw new Error("Time zone name must be a string, got " + Z + " [" + typeof Z + "]");
            return this._z = E0(Z), this._z ? e.updateOffset(this, m0) : N0("Moment Timezone has no data for " + Z + ". See http://momentjs.com/timezone/docs/#/data-loading/."), this
        }
        if (this._z) return this._z.name
    }, J0.zoneName = y0(J0.zoneName), J0.zoneAbbr = y0(J0.zoneAbbr), J0.utc = c0(J0.utc), J0.local = c0(J0.local), J0.utcOffset = (C0 = J0.utcOffset, function () {
        return 0 < arguments.length && (this._z = null), C0.apply(this, arguments)
    }), e.tz.setDefault = function (Z) {
        return (R < 2 || 2 == R && k < 9) && N0("Moment Timezone setDefault() requires Moment.js >= 2.9.0. You are using Moment.js " + e.version + "."), e.defaultZone = Z ? E0(Z) : null, e
    };
    var O0 = e.momentProperties;
    return "[object Array]" === Object.prototype.toString.call(O0) ? (O0.push("_z"), O0.push("_a")) : O0 && (O0._z = null), b0({
        version: "2020a",
        zones: ["Africa/Abidjan|LMT GMT|g.8 0|01|-2ldXH.Q|48e5", "Africa/Accra|LMT GMT +0020|.Q 0 -k|012121212121212121212121212121212121212121212121|-26BbX.8 6tzX.8 MnE 1BAk MnE 1BAk MnE 1BAk MnE 1C0k MnE 1BAk MnE 1BAk MnE 1BAk MnE 1C0k MnE 1BAk MnE 1BAk MnE 1BAk MnE 1C0k MnE 1BAk MnE 1BAk MnE 1BAk MnE 1C0k MnE 1BAk MnE 1BAk MnE 1BAk MnE 1C0k MnE 1BAk MnE 1BAk MnE|41e5", "Africa/Nairobi|LMT EAT +0230 +0245|-2r.g -30 -2u -2J|01231|-1F3Cr.g 3Dzr.g okMu MFXJ|47e5", "Africa/Algiers|PMT WET WEST CET CEST|-9.l 0 -10 -10 -20|0121212121212121343431312123431213|-2nco9.l cNb9.l HA0 19A0 1iM0 11c0 1oo0 Wo0 1rc0 QM0 1EM0 UM0 DA0 Imo0 rd0 De0 9Xz0 1fb0 1ap0 16K0 2yo0 mEp0 hwL0 jxA0 11A0 dDd0 17b0 11B0 1cN0 2Dy0 1cN0 1fB0 1cL0|26e5", "Africa/Lagos|LMT WAT|-d.A -10|01|-22y0d.A|17e6", "Africa/Bissau|LMT -01 GMT|12.k 10 0|012|-2ldX0 2xoo0|39e4", "Africa/Maputo|LMT CAT|-2a.k -20|01|-2GJea.k|26e5", "Africa/Cairo|EET EEST|-20 -30|0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-1bIO0 vb0 1ip0 11z0 1iN0 1nz0 12p0 1pz0 10N0 1pz0 16p0 1jz0 s3d0 Vz0 1oN0 11b0 1oO0 10N0 1pz0 10N0 1pb0 10N0 1pb0 10N0 1pb0 10N0 1pz0 10N0 1pb0 10N0 1pb0 11d0 1oL0 11d0 1pb0 11d0 1oL0 11d0 1oL0 11d0 1oL0 11d0 1pb0 11d0 1oL0 11d0 1oL0 11d0 1oL0 11d0 1pb0 11d0 1oL0 11d0 1oL0 11d0 1oL0 11d0 1pb0 11d0 1oL0 11d0 1WL0 rd0 1Rz0 wp0 1pb0 11d0 1oL0 11d0 1oL0 11d0 1oL0 11d0 1pb0 11d0 1qL0 Xd0 1oL0 11d0 1oL0 11d0 1pb0 11d0 1oL0 11d0 1oL0 11d0 1ny0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 WL0 1qN0 Rb0 1wp0 On0 1zd0 Lz0 1EN0 Fb0 c10 8n0 8Nd0 gL0 e10 mn0|15e6", "Africa/Casablanca|LMT +00 +01|u.k 0 -10|01212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212|-2gMnt.E 130Lt.E rb0 Dd0 dVb0 b6p0 TX0 EoB0 LL0 gnd0 rz0 43d0 AL0 1Nd0 XX0 1Cp0 pz0 dEp0 4mn0 SyN0 AL0 1Nd0 wn0 1FB0 Db0 1zd0 Lz0 1Nf0 wM0 co0 go0 1o00 s00 dA0 vc0 11A0 A00 e00 y00 11A0 uM0 e00 Dc0 11A0 s00 e00 IM0 WM0 mo0 gM0 LA0 WM0 jA0 e00 28M0 e00 2600 gM0 2600 e00 2600 gM0 2600 e00 28M0 e00 2600 gM0 2600 e00 28M0 e00 2600 gM0 2600 e00 2600 gM0 2600 e00 28M0 e00 2600 gM0 2600 e00 2600 gM0 2600 gM0 2600 e00 2600 gM0|32e5", "Africa/Ceuta|WET WEST CET CEST|0 -10 -10 -20|010101010101010101010232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232|-25KN0 11z0 drd0 18p0 3HX0 17d0 1fz0 1a10 1io0 1a00 1y7o0 LL0 gnd0 rz0 43d0 AL0 1Nd0 XX0 1Cp0 pz0 dEp0 4VB0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|85e3", "Africa/El_Aaiun|LMT -01 +00 +01|Q.M 10 0 -10|012323232323232323232323232323232323232323232323232323232323232323232323232323232323|-1rDz7.c 1GVA7.c 6L0 AL0 1Nd0 XX0 1Cp0 pz0 1cBB0 AL0 1Nd0 wn0 1FB0 Db0 1zd0 Lz0 1Nf0 wM0 co0 go0 1o00 s00 dA0 vc0 11A0 A00 e00 y00 11A0 uM0 e00 Dc0 11A0 s00 e00 IM0 WM0 mo0 gM0 LA0 WM0 jA0 e00 28M0 e00 2600 gM0 2600 e00 2600 gM0 2600 e00 28M0 e00 2600 gM0 2600 e00 28M0 e00 2600 gM0 2600 e00 2600 gM0 2600 e00 28M0 e00 2600 gM0 2600 e00 2600 gM0 2600 gM0 2600 e00 2600 gM0|20e4", "Africa/Johannesburg|SAST SAST SAST|-1u -20 -30|012121|-2GJdu 1Ajdu 1cL0 1cN0 1cL0|84e5", "Africa/Juba|LMT CAT CAST EAT|-26.s -20 -30 -30|01212121212121212121212121212121213|-1yW26.s 1zK06.s 16L0 1iN0 17b0 1jd0 17b0 1ip0 17z0 1i10 17X0 1hB0 18n0 1hd0 19b0 1gp0 19z0 1iN0 17b0 1ip0 17z0 1i10 18n0 1hd0 18L0 1gN0 19b0 1gp0 19z0 1iN0 17z0 1i10 17X0 yGd0|", "Africa/Khartoum|LMT CAT CAST EAT|-2a.8 -20 -30 -30|012121212121212121212121212121212131|-1yW2a.8 1zK0a.8 16L0 1iN0 17b0 1jd0 17b0 1ip0 17z0 1i10 17X0 1hB0 18n0 1hd0 19b0 1gp0 19z0 1iN0 17b0 1ip0 17z0 1i10 18n0 1hd0 18L0 1gN0 19b0 1gp0 19z0 1iN0 17z0 1i10 17X0 yGd0 HjL0|51e5", "Africa/Monrovia|MMT MMT GMT|H.8 I.u 0|012|-23Lzg.Q 28G01.m|11e5", "Africa/Ndjamena|LMT WAT WAST|-10.c -10 -20|0121|-2le10.c 2J3c0.c Wn0|13e5", "Africa/Sao_Tome|LMT GMT WAT|A.J 0 -10|0121|-2le00 4i6N0 2q00|", "Africa/Tripoli|LMT CET CEST EET|-Q.I -10 -20 -20|012121213121212121212121213123123|-21JcQ.I 1hnBQ.I vx0 4iP0 xx0 4eN0 Bb0 7ip0 U0n0 A10 1db0 1cN0 1db0 1dd0 1db0 1eN0 1bb0 1e10 1cL0 1c10 1db0 1dd0 1db0 1cN0 1db0 1q10 fAn0 1ep0 1db0 AKq0 TA0 1o00|11e5", "Africa/Tunis|PMT CET CEST|-9.l -10 -20|0121212121212121212121212121212121|-2nco9.l 18pa9.l 1qM0 DA0 3Tc0 11B0 1ze0 WM0 7z0 3d0 14L0 1cN0 1f90 1ar0 16J0 1gXB0 WM0 1rA0 11c0 nwo0 Ko0 1cM0 1cM0 1rA0 10M0 zuM0 10N0 1aN0 1qM0 WM0 1qM0 11A0 1o00|20e5", "Africa/Windhoek|+0130 SAST SAST CAT WAT|-1u -20 -30 -20 -10|01213434343434343434343434343434343434343434343434343|-2GJdu 1Ajdu 1cL0 1SqL0 9Io0 16P0 1nX0 11B0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0|32e4", "America/Adak|NST NWT NPT BST BDT AHST HST HDT|b0 a0 a0 b0 a0 a0 a0 90|012034343434343434343434343434343456767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676|-17SX0 8wW0 iB0 Qlb0 52O0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 cm0 10q0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|326", "America/Anchorage|AST AWT APT AHST AHDT YST AKST AKDT|a0 90 90 a0 90 90 90 80|012034343434343434343434343434343456767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676|-17T00 8wX0 iA0 Qlb0 52O0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 cm0 10q0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|30e4", "America/Port_of_Spain|LMT AST|46.4 40|01|-2kNvR.U|43e3", "America/Araguaina|LMT -03 -02|3c.M 30 20|0121212121212121212121212121212121212121212121212121|-2glwL.c HdKL.c 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 1EN0 FX0 1HB0 Lz0 dMN0 Lz0 1zd0 Rb0 1wN0 Wn0 1tB0 Rb0 1tB0 WL0 1tB0 Rb0 1zd0 On0 1HB0 FX0 ny10 Lz0|14e4", "America/Argentina/Buenos_Aires|CMT -04 -03 -02|4g.M 40 30 20|01212121212121212121212121212121212121212123232323232323232|-20UHH.c pKnH.c Mn0 1iN0 Tb0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 MN0 2jz0 MN0 4lX0 u10 5Lb0 1pB0 Fnz0 u10 uL0 1vd0 SL0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 zvd0 Bz0 1tB0 TX0 1wp0 Rb0 1wp0 Rb0 1wp0 TX0 A4p0 uL0 1qN0 WL0|", "America/Argentina/Catamarca|CMT -04 -03 -02|4g.M 40 30 20|01212121212121212121212121212121212121212123232323132321232|-20UHH.c pKnH.c Mn0 1iN0 Tb0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 MN0 2jz0 MN0 4lX0 u10 5Lb0 1pB0 Fnz0 u10 uL0 1vd0 SL0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 zvd0 Bz0 1tB0 TX0 1wp0 Rb0 1wq0 Ra0 1wp0 TX0 rlB0 7B0 8zb0 uL0|", "America/Argentina/Cordoba|CMT -04 -03 -02|4g.M 40 30 20|01212121212121212121212121212121212121212123232323132323232|-20UHH.c pKnH.c Mn0 1iN0 Tb0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 MN0 2jz0 MN0 4lX0 u10 5Lb0 1pB0 Fnz0 u10 uL0 1vd0 SL0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 zvd0 Bz0 1tB0 TX0 1wp0 Rb0 1wq0 Ra0 1wp0 TX0 A4p0 uL0 1qN0 WL0|", "America/Argentina/Jujuy|CMT -04 -03 -02|4g.M 40 30 20|012121212121212121212121212121212121212121232323121323232|-20UHH.c pKnH.c Mn0 1iN0 Tb0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 MN0 2jz0 MN0 4lX0 u10 5Lb0 1pB0 Fnz0 u10 uL0 1vd0 SL0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 zvd0 Bz0 1tB0 TX0 1ze0 TX0 1ld0 WK0 1wp0 TX0 A4p0 uL0|", "America/Argentina/La_Rioja|CMT -04 -03 -02|4g.M 40 30 20|012121212121212121212121212121212121212121232323231232321232|-20UHH.c pKnH.c Mn0 1iN0 Tb0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 MN0 2jz0 MN0 4lX0 u10 5Lb0 1pB0 Fnz0 u10 uL0 1vd0 SL0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 zvd0 Bz0 1tB0 TX0 1wp0 Qn0 qO0 16n0 Rb0 1wp0 TX0 rlB0 7B0 8zb0 uL0|", "America/Argentina/Mendoza|CMT -04 -03 -02|4g.M 40 30 20|01212121212121212121212121212121212121212123232312121321232|-20UHH.c pKnH.c Mn0 1iN0 Tb0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 MN0 2jz0 MN0 4lX0 u10 5Lb0 1pB0 Fnz0 u10 uL0 1vd0 SL0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 zvd0 Bz0 1tB0 TX0 1u20 SL0 1vd0 Tb0 1wp0 TW0 ri10 Op0 7TX0 uL0|", "America/Argentina/Rio_Gallegos|CMT -04 -03 -02|4g.M 40 30 20|01212121212121212121212121212121212121212123232323232321232|-20UHH.c pKnH.c Mn0 1iN0 Tb0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 MN0 2jz0 MN0 4lX0 u10 5Lb0 1pB0 Fnz0 u10 uL0 1vd0 SL0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 zvd0 Bz0 1tB0 TX0 1wp0 Rb0 1wp0 Rb0 1wp0 TX0 rlB0 7B0 8zb0 uL0|", "America/Argentina/Salta|CMT -04 -03 -02|4g.M 40 30 20|012121212121212121212121212121212121212121232323231323232|-20UHH.c pKnH.c Mn0 1iN0 Tb0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 MN0 2jz0 MN0 4lX0 u10 5Lb0 1pB0 Fnz0 u10 uL0 1vd0 SL0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 zvd0 Bz0 1tB0 TX0 1wp0 Rb0 1wq0 Ra0 1wp0 TX0 A4p0 uL0|", "America/Argentina/San_Juan|CMT -04 -03 -02|4g.M 40 30 20|012121212121212121212121212121212121212121232323231232321232|-20UHH.c pKnH.c Mn0 1iN0 Tb0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 MN0 2jz0 MN0 4lX0 u10 5Lb0 1pB0 Fnz0 u10 uL0 1vd0 SL0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 zvd0 Bz0 1tB0 TX0 1wp0 Qn0 qO0 16n0 Rb0 1wp0 TX0 rld0 m10 8lb0 uL0|", "America/Argentina/San_Luis|CMT -04 -03 -02|4g.M 40 30 20|012121212121212121212121212121212121212121232323121212321212|-20UHH.c pKnH.c Mn0 1iN0 Tb0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 MN0 2jz0 MN0 4lX0 u10 5Lb0 1pB0 Fnz0 u10 uL0 1vd0 SL0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 zvd0 Bz0 1tB0 XX0 1q20 SL0 AN0 vDb0 m10 8lb0 8L0 jd0 1qN0 WL0 1qN0|", "America/Argentina/Tucuman|CMT -04 -03 -02|4g.M 40 30 20|0121212121212121212121212121212121212121212323232313232123232|-20UHH.c pKnH.c Mn0 1iN0 Tb0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 MN0 2jz0 MN0 4lX0 u10 5Lb0 1pB0 Fnz0 u10 uL0 1vd0 SL0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 zvd0 Bz0 1tB0 TX0 1wp0 Rb0 1wq0 Ra0 1wp0 TX0 rlB0 4N0 8BX0 uL0 1qN0 WL0|", "America/Argentina/Ushuaia|CMT -04 -03 -02|4g.M 40 30 20|01212121212121212121212121212121212121212123232323232321232|-20UHH.c pKnH.c Mn0 1iN0 Tb0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 1C10 LX0 1C10 LX0 1C10 LX0 1C10 Mn0 MN0 2jz0 MN0 4lX0 u10 5Lb0 1pB0 Fnz0 u10 uL0 1vd0 SL0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 zvd0 Bz0 1tB0 TX0 1wp0 Rb0 1wp0 Rb0 1wp0 TX0 rkN0 8p0 8zb0 uL0|", "America/Curacao|LMT -0430 AST|4z.L 4u 40|012|-2kV7o.d 28KLS.d|15e4", "America/Asuncion|AMT -04 -03|3O.E 40 30|012121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212|-1x589.k 1DKM9.k 3CL0 3Dd0 10L0 1pB0 10n0 1pB0 10n0 1pB0 1cL0 1dd0 1db0 1dd0 1cL0 1dd0 1cL0 1dd0 1cL0 1dd0 1db0 1dd0 1cL0 1dd0 1cL0 1dd0 1cL0 1dd0 1db0 1dd0 1cL0 1lB0 14n0 1dd0 1cL0 1fd0 WL0 1rd0 1aL0 1dB0 Xz0 1qp0 Xb0 1qN0 10L0 1rB0 TX0 1tB0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1qN0 1cL0 WN0 1qL0 11B0 1nX0 1ip0 WL0 1qN0 WL0 1qN0 WL0 1tB0 TX0 1tB0 TX0 1tB0 19X0 1a10 1fz0 1a10 1fz0 1cN0 17b0 1ip0 17b0 1ip0 17b0 1ip0 19X0 1fB0 19X0 1fB0 19X0 1ip0 17b0 1ip0 17b0 1ip0 19X0 1fB0 19X0 1fB0 19X0 1fB0 19X0 1ip0 17b0 1ip0 17b0 1ip0 19X0 1fB0 19X0 1fB0 19X0 1ip0 17b0 1ip0 17b0 1ip0 19X0 1fB0 19X0 1fB0 19X0 1fB0 19X0 1ip0 17b0 1ip0 17b0 1ip0|28e5", "America/Atikokan|CST CDT CWT CPT EST|60 50 50 50 50|0101234|-25TQ0 1in0 Rnb0 3je0 8x30 iw0|28e2", "America/Bahia_Banderas|LMT MST CST PST MDT CDT|71 70 60 80 60 50|0121212131414141414141414141414141414152525252525252525252525252525252525252525252525252525252|-1UQF0 deL0 8lc0 17c0 10M0 1dd0 otX0 gmN0 P2N0 13Vd0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 1fB0 WL0 1fB0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nW0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0|84e3", "America/Bahia|LMT -03 -02|2y.4 30 20|01212121212121212121212121212121212121212121212121212121212121|-2glxp.U HdLp.U 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 1EN0 FX0 1HB0 Lz0 1EN0 Lz0 1C10 IL0 1HB0 Db0 1HB0 On0 1zd0 On0 1zd0 Lz0 1zd0 Rb0 1wN0 Wn0 1tB0 Rb0 1tB0 WL0 1tB0 Rb0 1zd0 On0 1HB0 FX0 l5B0 Rb0|27e5", "America/Barbados|LMT BMT AST ADT|3W.t 3W.t 40 30|01232323232|-1Q0I1.v jsM0 1ODC1.v IL0 1ip0 17b0 1ip0 17b0 1ld0 13b0|28e4", "America/Belem|LMT -03 -02|3d.U 30 20|012121212121212121212121212121|-2glwK.4 HdKK.4 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0|20e5", "America/Belize|LMT CST -0530 CDT|5Q.M 60 5u 50|01212121212121212121212121212121212121212121212121213131|-2kBu7.c fPA7.c Onu 1zcu Rbu 1wou Rbu 1wou Rbu 1zcu Onu 1zcu Onu 1zcu Rbu 1wou Rbu 1wou Rbu 1wou Rbu 1zcu Onu 1zcu Onu 1zcu Rbu 1wou Rbu 1wou Rbu 1zcu Onu 1zcu Onu 1zcu Onu 1zcu Rbu 1wou Rbu 1wou Rbu 1zcu Onu 1zcu Onu 1zcu Rbu 1wou Rbu 1f0Mu qn0 lxB0 mn0|57e3", "America/Blanc-Sablon|AST ADT AWT APT|40 30 30 30|010230|-25TS0 1in0 UGp0 8x50 iu0|11e2", "America/Boa_Vista|LMT -04 -03|42.E 40 30|0121212121212121212121212121212121|-2glvV.k HdKV.k 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 smp0 WL0 1tB0 2L0|62e2", "America/Bogota|BMT -05 -04|4U.g 50 40|0121|-2eb73.I 38yo3.I 2en0|90e5", "America/Boise|PST PDT MST MWT MPT MDT|80 70 70 60 60 60|0101023425252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252|-261q0 1nX0 11B0 1nX0 8C10 JCL0 8x20 ix0 QwN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 Dd0 1Kn0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|21e4", "America/Cambridge_Bay|-00 MST MWT MPT MDDT MDT CST CDT EST|0 70 60 60 50 60 60 50 50|0123141515151515151515151515151515151515151515678651515151515151515151515151515151515151515151515151515151515151515151515151|-21Jc0 RO90 8x20 ix0 LCL0 1fA0 zgO0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11A0 1nX0 2K0 WQ0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|15e2", "America/Campo_Grande|LMT -04 -03|3C.s 40 30|01212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2glwl.w HdLl.w 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 1EN0 FX0 1HB0 Lz0 1EN0 Lz0 1C10 IL0 1HB0 Db0 1HB0 On0 1zd0 On0 1zd0 Lz0 1zd0 Rb0 1wN0 Wn0 1tB0 Rb0 1tB0 WL0 1tB0 Rb0 1zd0 On0 1HB0 FX0 1C10 Lz0 1Ip0 HX0 1zd0 On0 1HB0 IL0 1wp0 On0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 Rb0 1zd0 Lz0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 On0 1zd0 On0 1HB0 FX0|77e4", "America/Cancun|LMT CST EST EDT CDT|5L.4 60 50 40 50|0123232341414141414141414141414141414141412|-1UQG0 2q2o0 yLB0 1lb0 14p0 1lb0 14p0 Lz0 xB0 14p0 1nX0 11B0 1nX0 1fB0 WL0 1fB0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 Dd0|63e4", "America/Caracas|CMT -0430 -04|4r.E 4u 40|01212|-2kV7w.k 28KM2.k 1IwOu kqo0|29e5", "America/Cayenne|LMT -04 -03|3t.k 40 30|012|-2mrwu.E 2gWou.E|58e3", "America/Panama|CMT EST|5j.A 50|01|-2uduE.o|15e5", "America/Chicago|CST CDT EST CWT CPT|60 50 50 50 50|01010101010101010101010101010101010102010101010103401010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-261s0 1nX0 11B0 1nX0 1wp0 TX0 WN0 1qL0 1cN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 11B0 1Hz0 14p0 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 RB0 8x30 iw0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|92e5", "America/Chihuahua|LMT MST CST CDT MDT|74.k 70 60 50 60|0121212323241414141414141414141414141414141414141414141414141414141414141414141414141414141|-1UQF0 deL0 8lc0 17c0 10M0 1dd0 2zQN0 1lb0 14p0 1lb0 14q0 1lb0 14p0 1nX0 11B0 1nX0 1fB0 WL0 1fB0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0|81e4", "America/Costa_Rica|SJMT CST CDT|5A.d 60 50|0121212121|-1Xd6n.L 2lu0n.L Db0 1Kp0 Db0 pRB0 15b0 1kp0 mL0|12e5", "America/Creston|MST PST|70 80|010|-29DR0 43B0|53e2", "America/Cuiaba|LMT -04 -03|3I.k 40 30|012121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2glwf.E HdLf.E 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 1EN0 FX0 1HB0 Lz0 1EN0 Lz0 1C10 IL0 1HB0 Db0 1HB0 On0 1zd0 On0 1zd0 Lz0 1zd0 Rb0 1wN0 Wn0 1tB0 Rb0 1tB0 WL0 1tB0 Rb0 1zd0 On0 1HB0 FX0 4a10 HX0 1zd0 On0 1HB0 IL0 1wp0 On0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 Rb0 1zd0 Lz0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 On0 1zd0 On0 1HB0 FX0|54e4", "America/Danmarkshavn|LMT -03 -02 GMT|1e.E 30 20 0|01212121212121212121212121212121213|-2a5WJ.k 2z5fJ.k 19U0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 DC0|8", "America/Dawson_Creek|PST PDT PWT PPT MST|80 70 70 70 70|0102301010101010101010101010101010101010101010101010101014|-25TO0 1in0 UGp0 8x10 iy0 3NB0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 ML0|12e3", "America/Dawson|YST YDT YWT YPT YDDT PST PDT MST|90 80 80 80 70 80 70 70|01010230405656565656565656565656565656565656565656565656565656565656565656565656565656565657|-25TN0 1in0 1o10 13V0 Ser0 8x00 iz0 LCL0 1fA0 jrA0 fNd0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0|13e2", "America/Denver|MST MDT MWT MPT|70 60 60 60|01010101023010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-261r0 1nX0 11B0 1nX0 11B0 1qL0 WN0 mn0 Ord0 8x20 ix0 LCN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|26e5", "America/Detroit|LMT CST EST EWT EPT EDT|5w.b 60 50 40 40 40|0123425252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252|-2Cgir.N peqr.N 156L0 8x40 iv0 6fd0 11z0 JxX1 SMX 1cN0 1cL0 aW10 1cL0 s10 1Vz0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|37e5", "America/Edmonton|LMT MST MDT MWT MPT|7x.Q 70 60 60 60|0121212121212134121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2yd4q.8 shdq.8 1in0 17d0 hz0 2dB0 1fz0 1a10 11z0 1qN0 WL0 1qN0 11z0 IGN0 8x20 ix0 3NB0 11z0 XQp0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|10e5", "America/Eirunepe|LMT -05 -04|4D.s 50 40|0121212121212121212121212121212121|-2glvk.w HdLk.w 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 dPB0 On0 yTd0 d5X0|31e3", "America/El_Salvador|LMT CST CDT|5U.M 60 50|012121|-1XiG3.c 2Fvc3.c WL0 1qN0 WL0|11e5", "America/Tijuana|LMT MST PST PDT PWT PPT|7M.4 70 80 70 70 70|012123245232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232|-1UQE0 4PX0 8mM0 8lc0 SN0 1cL0 pHB0 83r0 zI0 5O10 1Rz0 cOO0 11A0 1o00 11A0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 BUp0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 U10 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|20e5", "America/Fort_Nelson|PST PDT PWT PPT MST|80 70 70 70 70|01023010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010104|-25TO0 1in0 UGp0 8x10 iy0 3NB0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0|39e2", "America/Fort_Wayne|CST CDT CWT CPT EST EDT|60 50 50 50 50 40|010101023010101010101010101040454545454545454545454545454545454545454545454545454545454545454545454|-261s0 1nX0 11B0 1nX0 QI10 Db0 RB0 8x30 iw0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 5Tz0 1o10 qLb0 1cL0 1cN0 1cL0 1qhd0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|", "America/Fortaleza|LMT -03 -02|2y 30 20|0121212121212121212121212121212121212121|-2glxq HdLq 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 1EN0 FX0 1HB0 Lz0 nsp0 WL0 1tB0 5z0 2mN0 On0|34e5", "America/Glace_Bay|LMT AST ADT AWT APT|3X.M 40 30 30 30|012134121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2IsI0.c CwO0.c 1in0 UGp0 8x50 iu0 iq10 11z0 Jg10 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|19e3", "America/Godthab|LMT -03 -02|3q.U 30 20|0121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2a5Ux.4 2z5dx.4 19U0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|17e3", "America/Goose_Bay|NST NDT NST NDT NWT NPT AST ADT ADDT|3u.Q 2u.Q 3u 2u 2u 2u 40 30 20|010232323232323245232323232323232323232323232323232323232326767676767676767676767676767676767676767676768676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676|-25TSt.8 1in0 DXb0 2HbX.8 WL0 1qN0 WL0 1qN0 WL0 1tB0 TX0 1tB0 WL0 1qN0 WL0 1qN0 7UHu itu 1tB0 WL0 1qN0 WL0 1qN0 WL0 1qN0 WL0 1tB0 WL0 1ld0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 S10 g0u 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14n1 1lb0 14p0 1nW0 11C0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zcX Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|76e2", "America/Grand_Turk|KMT EST EDT AST|57.a 50 40 40|01212121212121212121212121212121212121212121212121212121212121212121212121232121212121212121212121212121212121212121|-2l1uQ.O 2HHBQ.O 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 5Ip0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|37e2", "America/Guatemala|LMT CST CDT|62.4 60 50|0121212121|-24KhV.U 2efXV.U An0 mtd0 Nz0 ifB0 17b0 zDB0 11z0|13e5", "America/Guayaquil|QMT -05 -04|5e 50 40|0121|-1yVSK 2uILK rz0|27e5", "America/Guyana|LMT -0345 -03 -04|3Q.E 3J 30 40|0123|-2dvU7.k 2r6LQ.k Bxbf|80e4", "America/Halifax|LMT AST ADT AWT APT|4e.o 40 30 30 30|0121212121212121212121212121212121212121212121212134121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2IsHJ.A xzzJ.A 1db0 3I30 1in0 3HX0 IL0 1E10 ML0 1yN0 Pb0 1Bd0 Mn0 1Bd0 Rz0 1w10 Xb0 1w10 LX0 1w10 Xb0 1w10 Lz0 1C10 Jz0 1E10 OL0 1yN0 Un0 1qp0 Xb0 1qp0 11X0 1w10 Lz0 1HB0 LX0 1C10 FX0 1w10 Xb0 1qp0 Xb0 1BB0 LX0 1td0 Xb0 1qp0 Xb0 Rf0 8x50 iu0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 3Qp0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 3Qp0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 6i10 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|39e4", "America/Havana|HMT CST CDT|5t.A 50 40|012121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-1Meuu.o 72zu.o ML0 sld0 An0 1Nd0 Db0 1Nd0 An0 6Ep0 An0 1Nd0 An0 JDd0 Mn0 1Ap0 On0 1fd0 11X0 1qN0 WL0 1wp0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 14n0 1ld0 14L0 1kN0 15b0 1kp0 1cL0 1cN0 1fz0 1a10 1fz0 1fB0 11z0 14p0 1nX0 11B0 1nX0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 14n0 1ld0 14n0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 1a10 1in0 1a10 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1cM0 1cM0 1fA0 17c0 1o00 11A0 1qM0 11A0 1o00 11A0 1o00 14o0 1lc0 14o0 1lc0 11A0 6i00 Rc0 1wo0 U00 1tA0 Rc0 1wo0 U00 1wo0 U00 1zc0 U00 1qM0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0|21e5", "America/Hermosillo|LMT MST CST PST MDT|7n.Q 70 60 80 60|0121212131414141|-1UQF0 deL0 8lc0 17c0 10M0 1dd0 otX0 gmN0 P2N0 13Vd0 1lb0 14p0 1lb0 14p0 1lb0|64e4", "America/Indiana/Knox|CST CDT CWT CPT EST|60 50 50 50 50|0101023010101010101010101010101010101040101010101010101010101010101010101010101010101010141010101010101010101010101010101010101010101010101010101010101010|-261s0 1nX0 11B0 1nX0 SgN0 8x30 iw0 3NB0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 1fz0 1cN0 1cL0 1cN0 11z0 1o10 11z0 1o10 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 3Cn0 8wp0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 z8o0 1o00 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|", "America/Indiana/Marengo|CST CDT CWT CPT EST EDT|60 50 50 50 50 40|0101023010101010101010104545454545414545454545454545454545454545454545454545454545454545454545454545454|-261s0 1nX0 11B0 1nX0 SgN0 8x30 iw0 dyN0 11z0 6fd0 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 jrz0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1VA0 LA0 1BX0 1e6p0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|", "America/Indiana/Petersburg|CST CDT CWT CPT EST EDT|60 50 50 50 50 40|01010230101010101010101010104010101010101010101010141014545454545454545454545454545454545454545454545454545454545454|-261s0 1nX0 11B0 1nX0 SgN0 8x30 iw0 njX0 WN0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 3Fb0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 19co0 1o00 Rd0 1zb0 Oo0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|", "America/Indiana/Tell_City|CST CDT CWT CPT EST EDT|60 50 50 50 50 40|01010230101010101010101010401054541010101010101010101010101010101010101010101010101010101010101010|-261s0 1nX0 11B0 1nX0 SgN0 8x30 iw0 njX0 WN0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 8wn0 1cN0 1cL0 1cN0 1cK0 1cN0 1cL0 1qhd0 1o00 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|", "America/Indiana/Vevay|CST CDT CWT CPT EST EDT|60 50 50 50 50 40|010102304545454545454545454545454545454545454545454545454545454545454545454545454|-261s0 1nX0 11B0 1nX0 SgN0 8x30 iw0 kPB0 Awn0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1lnd0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|", "America/Indiana/Vincennes|CST CDT CWT CPT EST EDT|60 50 50 50 50 40|01010230101010101010101010101010454541014545454545454545454545454545454545454545454545454545454545454|-261s0 1nX0 11B0 1nX0 SgN0 8x30 iw0 1o10 11z0 g0p0 11z0 1o10 11z0 1qL0 WN0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 1fz0 1cN0 WL0 1qN0 1cL0 1cN0 1cL0 1cN0 caL0 1cL0 1cN0 1cL0 1qhd0 1o00 Rd0 1zb0 Oo0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|", "America/Indiana/Winamac|CST CDT CWT CPT EST EDT|60 50 50 50 50 40|01010230101010101010101010101010101010454541054545454545454545454545454545454545454545454545454545454545454|-261s0 1nX0 11B0 1nX0 SgN0 8x30 iw0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 1fz0 1cN0 1cL0 1cN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 jrz0 1cL0 1cN0 1cL0 1qhd0 1o00 Rd0 1za0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|", "America/Inuvik|-00 PST PDDT MST MDT|0 80 60 70 60|0121343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343|-FnA0 tWU0 1fA0 wPe0 2pz0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|35e2", "America/Iqaluit|-00 EWT EPT EST EDDT EDT CST CDT|0 40 40 50 30 40 60 50|01234353535353535353535353535353535353535353567353535353535353535353535353535353535353535353535353535353535353535353535353|-16K00 7nX0 iv0 LCL0 1fA0 zgO0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11C0 1nX0 11A0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|67e2", "America/Jamaica|KMT EST EDT|57.a 50 40|0121212121212121212121|-2l1uQ.O 2uM1Q.O 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0|94e4", "America/Juneau|PST PWT PPT PDT YDT YST AKST AKDT|80 70 70 70 80 90 90 80|01203030303030303030303030403030356767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676|-17T20 8x10 iy0 Vo10 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cM0 1cM0 1cL0 1cN0 1fz0 1a10 1fz0 co0 10q0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|33e3", "America/Kentucky/Louisville|CST CDT CWT CPT EST EDT|60 50 50 50 50 40|0101010102301010101010101010101010101454545454545414545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454|-261s0 1nX0 11B0 1nX0 3Fd0 Nb0 LPd0 11z0 RB0 8x30 iw0 1nX1 e0X 9vd0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 xz0 gso0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1VA0 LA0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|", "America/Kentucky/Monticello|CST CDT CWT CPT EST EDT|60 50 50 50 50 40|0101023010101010101010101010101010101010101010101010101010101010101010101454545454545454545454545454545454545454545454545454545454545454545454545454|-261s0 1nX0 11B0 1nX0 SgN0 8x30 iw0 SWp0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11A0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|", "America/La_Paz|CMT BST -04|4w.A 3w.A 40|012|-1x37r.o 13b0|19e5", "America/Lima|LMT -05 -04|58.A 50 40|0121212121212121|-2tyGP.o 1bDzP.o zX0 1aN0 1cL0 1cN0 1cL0 1PrB0 zX0 1O10 zX0 6Gp0 zX0 98p0 zX0|11e6", "America/Los_Angeles|PST PDT PWT PPT|80 70 70 70|010102301010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-261q0 1nX0 11B0 1nX0 SgN0 8x10 iy0 5Wp1 1VaX 3dA0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1a00 1fA0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|15e6", "America/Maceio|LMT -03 -02|2m.Q 30 20|012121212121212121212121212121212121212121|-2glxB.8 HdLB.8 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 1EN0 FX0 1HB0 Lz0 dMN0 Lz0 8Q10 WL0 1tB0 5z0 2mN0 On0|93e4", "America/Managua|MMT CST EST CDT|5J.c 60 50 50|0121313121213131|-1quie.M 1yAMe.M 4mn0 9Up0 Dz0 1K10 Dz0 s3F0 1KH0 DB0 9In0 k8p0 19X0 1o30 11y0|22e5", "America/Manaus|LMT -04 -03|40.4 40 30|01212121212121212121212121212121|-2glvX.U HdKX.U 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 dPB0 On0|19e5", "America/Martinique|FFMT AST ADT|44.k 40 30|0121|-2mPTT.E 2LPbT.E 19X0|39e4", "America/Matamoros|LMT CST CDT|6E 60 50|0121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-1UQG0 2FjC0 1nX0 i6p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 1fB0 WL0 1fB0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 U10 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|45e4", "America/Mazatlan|LMT MST CST PST MDT|75.E 70 60 80 60|0121212131414141414141414141414141414141414141414141414141414141414141414141414141414141414141|-1UQF0 deL0 8lc0 17c0 10M0 1dd0 otX0 gmN0 P2N0 13Vd0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 1fB0 WL0 1fB0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0|44e4", "America/Menominee|CST CDT CWT CPT EST|60 50 50 50 50|01010230101041010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-261s0 1nX0 11B0 1nX0 SgN0 8x30 iw0 1o10 11z0 LCN0 1fz0 6410 9Jb0 1cM0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|85e2", "America/Merida|LMT CST EST CDT|5W.s 60 50 50|0121313131313131313131313131313131313131313131313131313131313131313131313131313131313131|-1UQG0 2q2o0 2hz0 wu30 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 1fB0 WL0 1fB0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0|11e5", "America/Metlakatla|PST PWT PPT PDT AKST AKDT|80 70 70 70 90 80|01203030303030303030303030303030304545450454545454545454545454545454545454545454|-17T20 8x10 iy0 Vo10 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1hU10 Rd0 1zb0 Op0 1zb0 Op0 1zb0 uM0 jB0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|14e2", "America/Mexico_City|LMT MST CST CDT CWT|6A.A 70 60 50 50|012121232324232323232323232323232323232323232323232323232323232323232323232323232323232323232323232|-1UQF0 deL0 8lc0 17c0 10M0 1dd0 gEn0 TX0 3xd0 Jb0 6zB0 SL0 e5d0 17b0 1Pff0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 1fB0 WL0 1fB0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0|20e6", "America/Miquelon|LMT AST -03 -02|3I.E 40 30 20|012323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232|-2mKkf.k 2LTAf.k gQ10 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|61e2", "America/Moncton|EST AST ADT AWT APT|50 40 30 30 30|012121212121212121212134121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2IsH0 CwN0 1in0 zAo0 An0 1Nd0 An0 1Nd0 An0 1Nd0 An0 1Nd0 An0 1Nd0 An0 1K10 Lz0 1zB0 NX0 1u10 Wn0 S20 8x50 iu0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 3Cp0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14n1 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 ReX 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|64e3", "America/Monterrey|LMT CST CDT|6F.g 60 50|0121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-1UQG0 2FjC0 1nX0 i6p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 1fB0 WL0 1fB0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0|41e5", "America/Montevideo|LMT MMT -04 -03 -0330 -0230 -02 -0130|3I.P 3I.P 40 30 3u 2u 20 1u|012343434343434343434343435353636353636375363636363636363636363636363636363636363636363|-2tRUf.9 sVc0 8jcf.9 1db0 1dcu 1cLu 1dcu 1cLu ircu 11zu 1o0u 11zu 1o0u 11zu 1o0u 11zu 1qMu WLu 1qMu WLu 1fAu 1cLu 1o0u 11zu NAu 3jXu zXu Dq0u 19Xu pcu jz0 cm10 19X0 6tB0 1fbu 3o0u jX0 4vB0 xz0 3Cp0 mmu 1a10 IMu Db0 4c10 uL0 1Nd0 An0 1SN0 uL0 mp0 28L0 iPB0 un0 1SN0 xz0 1zd0 Lz0 1zd0 Rb0 1zd0 On0 1wp0 Rb0 s8p0 1fB0 1ip0 11z0 1ld0 14n0 1o10 11z0 1o10 11z0 1o10 14n0 1ld0 14n0 1ld0 14n0 1o10 11z0 1o10 11z0 1o10 11z0|17e5", "America/Toronto|EST EDT EWT EPT|50 40 40 40|01010101010101010101010101010101010101010101012301010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-25TR0 1in0 11Wu 1nzu 1fD0 WJ0 1wr0 Nb0 1Ap0 On0 1zd0 On0 1wp0 TX0 1tB0 TX0 1tB0 TX0 1tB0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 4kM0 8x40 iv0 1o10 11z0 1nX0 11z0 1o10 11z0 1o10 1qL0 11D0 1nX0 11B0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|65e5", "America/Nassau|LMT EST EDT|59.u 50 40|012121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2kNuO.u 26XdO.u 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|24e4", "America/New_York|EST EDT EWT EPT|50 40 40 40|01010101010101010101010101010101010101010101010102301010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-261t0 1nX0 11B0 1nX0 11B0 1qL0 1a10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 RB0 8x40 iv0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|21e6", "America/Nipigon|EST EDT EWT EPT|50 40 40 40|010123010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-25TR0 1in0 Rnb0 3je0 8x40 iv0 19yN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|16e2", "America/Nome|NST NWT NPT BST BDT YST AKST AKDT|b0 a0 a0 b0 a0 90 90 80|012034343434343434343434343434343456767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676767676|-17SX0 8wW0 iB0 Qlb0 52O0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 cl0 10q0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|38e2", "America/Noronha|LMT -02 -01|29.E 20 10|0121212121212121212121212121212121212121|-2glxO.k HdKO.k 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 1EN0 FX0 1HB0 Lz0 nsp0 WL0 1tB0 2L0 2pB0 On0|30e2", "America/North_Dakota/Beulah|MST MDT MWT MPT CST CDT|70 60 60 60 60 50|010102301010101010101010101010101010101010101010101010101010101010101010101010101010101010101014545454545454545454545454545454545454545454545454545454|-261r0 1nX0 11B0 1nX0 SgN0 8x20 ix0 QwN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Oo0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|", "America/North_Dakota/Center|MST MDT MWT MPT CST CDT|70 60 60 60 60 50|010102301010101010101010101010101010101010101010101010101014545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454|-261r0 1nX0 11B0 1nX0 SgN0 8x20 ix0 QwN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14o0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|", "America/North_Dakota/New_Salem|MST MDT MWT MPT CST CDT|70 60 60 60 60 50|010102301010101010101010101010101010101010101010101010101010101010101010101010101454545454545454545454545454545454545454545454545454545454545454545454|-261r0 1nX0 11B0 1nX0 SgN0 8x20 ix0 QwN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14o0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|", "America/Ojinaga|LMT MST CST CDT MDT|6V.E 70 60 50 60|0121212323241414141414141414141414141414141414141414141414141414141414141414141414141414141|-1UQF0 deL0 8lc0 17c0 10M0 1dd0 2zQN0 1lb0 14p0 1lb0 14q0 1lb0 14p0 1nX0 11B0 1nX0 1fB0 WL0 1fB0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 U10 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|23e3", "America/Pangnirtung|-00 AST AWT APT ADDT ADT EDT EST CST CDT|0 40 30 30 20 30 40 50 60 50|012314151515151515151515151515151515167676767689767676767676767676767676767676767676767676767676767676767676767676767676767|-1XiM0 PnG0 8x50 iu0 LCL0 1fA0 zgO0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1o00 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11C0 1nX0 11A0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|14e2", "America/Paramaribo|LMT PMT PMT -0330 -03|3E.E 3E.Q 3E.A 3u 30|01234|-2nDUj.k Wqo0.c qanX.I 1yVXN.o|24e4", "America/Phoenix|MST MDT MWT|70 60 60|01010202010|-261r0 1nX0 11B0 1nX0 SgN0 4Al1 Ap0 1db0 SWqX 1cL0|42e5", "America/Port-au-Prince|PPMT EST EDT|4N 50 40|01212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-28RHb 2FnMb 19X0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14q0 1o00 11A0 1o00 11A0 1o00 14o0 1lc0 14o0 1lc0 14o0 1o00 11A0 1o00 11A0 1o00 14o0 1lc0 14o0 1lc0 i6n0 1nX0 11B0 1nX0 d430 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 3iN0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|23e5", "America/Rio_Branco|LMT -05 -04|4v.c 50 40|01212121212121212121212121212121|-2glvs.M HdLs.M 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 NBd0 d5X0|31e4", "America/Porto_Velho|LMT -04 -03|4f.A 40 30|012121212121212121212121212121|-2glvI.o HdKI.o 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0|37e4", "America/Puerto_Rico|AST AWT APT|40 30 30|0120|-17lU0 7XT0 iu0|24e5", "America/Punta_Arenas|SMT -05 -04 -03|4G.K 50 40 30|0102021212121212121232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323|-2q2jh.e fJAh.e 5knG.K 1Vzh.e jRAG.K 1pbh.e 11d0 1oL0 11d0 1oL0 11d0 1oL0 11d0 1pb0 11d0 nHX0 op0 blz0 ko0 Qeo0 WL0 1zd0 On0 1ip0 11z0 1o10 11z0 1qN0 WL0 1ld0 14n0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 WL0 1qN0 1cL0 1cN0 11z0 1o10 11z0 1qN0 WL0 1fB0 19X0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 17b0 1ip0 11z0 1ip0 1fz0 1fB0 11z0 1qN0 WL0 1qN0 WL0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 17b0 1ip0 11z0 1o10 19X0 1fB0 1nX0 G10 1EL0 Op0 1zb0 Rd0 1wn0 Rd0 46n0 Ap0|", "America/Rainy_River|CST CDT CWT CPT|60 50 50 50|010123010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-25TQ0 1in0 Rnb0 3je0 8x30 iw0 19yN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|842", "America/Rankin_Inlet|-00 CST CDDT CDT EST|0 60 40 50 50|012131313131313131313131313131313131313131313431313131313131313131313131313131313131313131313131313131313131313131313131|-vDc0 keu0 1fA0 zgO0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|26e2", "America/Recife|LMT -03 -02|2j.A 30 20|0121212121212121212121212121212121212121|-2glxE.o HdLE.o 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 1EN0 FX0 1HB0 Lz0 nsp0 WL0 1tB0 2L0 2pB0 On0|33e5", "America/Regina|LMT MST MDT MWT MPT CST|6W.A 70 60 60 60 60|012121212121212121212121341212121212121212121212121215|-2AD51.o uHe1.o 1in0 s2L0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 66N0 1cL0 1cN0 19X0 1fB0 1cL0 1fB0 1cL0 1cN0 1cL0 M30 8x20 ix0 1ip0 1cL0 1ip0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 3NB0 1cL0 1cN0|19e4", "America/Resolute|-00 CST CDDT CDT EST|0 60 40 50 50|012131313131313131313131313131313131313131313431313131313431313131313131313131313131313131313131313131313131313131313131|-SnA0 GWS0 1fA0 zgO0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|229", "America/Santarem|LMT -04 -03|3C.M 40 30|0121212121212121212121212121212|-2glwl.c HdLl.c 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 qe10 xb0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 NBd0|21e4", "America/Santiago|SMT -05 -04 -03|4G.K 50 40 30|010202121212121212321232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323|-2q2jh.e fJAh.e 5knG.K 1Vzh.e jRAG.K 1pbh.e 11d0 1oL0 11d0 1oL0 11d0 1oL0 11d0 1pb0 11d0 nHX0 op0 9Bz0 jb0 1oN0 ko0 Qeo0 WL0 1zd0 On0 1ip0 11z0 1o10 11z0 1qN0 WL0 1ld0 14n0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 WL0 1qN0 1cL0 1cN0 11z0 1o10 11z0 1qN0 WL0 1fB0 19X0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 17b0 1ip0 11z0 1ip0 1fz0 1fB0 11z0 1qN0 WL0 1qN0 WL0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 17b0 1ip0 11z0 1o10 19X0 1fB0 1nX0 G10 1EL0 Op0 1zb0 Rd0 1wn0 Rd0 46n0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1zb0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 11B0 1nX0 11B0|62e5", "America/Santo_Domingo|SDMT EST EDT -0430 AST|4E 50 40 4u 40|01213131313131414|-1ttjk 1lJMk Mn0 6sp0 Lbu 1Cou yLu 1RAu wLu 1QMu xzu 1Q0u xXu 1PAu 13jB0 e00|29e5", "America/Sao_Paulo|LMT -03 -02|36.s 30 20|01212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2glwR.w HdKR.w 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 pTd0 PX0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 1EN0 FX0 1HB0 Lz0 1EN0 Lz0 1C10 IL0 1HB0 Db0 1HB0 On0 1zd0 On0 1zd0 Lz0 1zd0 Rb0 1wN0 Wn0 1tB0 Rb0 1tB0 WL0 1tB0 Rb0 1zd0 On0 1HB0 FX0 1C10 Lz0 1Ip0 HX0 1zd0 On0 1HB0 IL0 1wp0 On0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 Rb0 1zd0 Lz0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 On0 1zd0 On0 1HB0 FX0|20e6", "America/Scoresbysund|LMT -02 -01 +00|1r.Q 20 10 0|0121323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232|-2a5Ww.8 2z5ew.8 1a00 1cK0 1cL0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|452", "America/Sitka|PST PWT PPT PDT YST AKST AKDT|80 70 70 70 90 90 80|01203030303030303030303030303030345656565656565656565656565656565656565656565656565656565656565656565656565656565656565656565656565656565656565|-17T20 8x10 iy0 Vo10 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 co0 10q0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|90e2", "America/St_Johns|NST NDT NST NDT NWT NPT NDDT|3u.Q 2u.Q 3u 2u 2u 2u 1u|01010101010101010101010101010101010102323232323232324523232323232323232323232323232323232323232323232323232323232323232323232323232323232326232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232|-28oit.8 14L0 1nB0 1in0 1gm0 Dz0 1JB0 1cL0 1cN0 1cL0 1fB0 19X0 1fB0 19X0 1fB0 19X0 1fB0 19X0 1fB0 1cL0 1cN0 1cL0 1fB0 19X0 1fB0 19X0 1fB0 19X0 1fB0 19X0 1fB0 1cL0 1fB0 19X0 1fB0 19X0 10O0 eKX.8 19X0 1iq0 WL0 1qN0 WL0 1qN0 WL0 1tB0 TX0 1tB0 WL0 1qN0 WL0 1qN0 7UHu itu 1tB0 WL0 1qN0 WL0 1qN0 WL0 1qN0 WL0 1tB0 WL0 1ld0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14n1 1lb0 14p0 1nW0 11C0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zcX Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|11e4", "America/Swift_Current|LMT MST MDT MWT MPT CST|7b.k 70 60 60 60 60|012134121212121212121215|-2AD4M.E uHdM.E 1in0 UGp0 8x20 ix0 1o10 17b0 1ip0 11z0 1o10 11z0 1o10 11z0 isN0 1cL0 3Cp0 1cL0 1cN0 11z0 1qN0 WL0 pMp0|16e3", "America/Tegucigalpa|LMT CST CDT|5M.Q 60 50|01212121|-1WGGb.8 2ETcb.8 WL0 1qN0 WL0 GRd0 AL0|11e5", "America/Thule|LMT AST ADT|4z.8 40 30|012121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2a5To.Q 31NBo.Q 1cL0 1cN0 1cL0 1fB0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|656", "America/Thunder_Bay|CST EST EWT EPT EDT|60 50 40 40 40|0123141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141|-2q5S0 1iaN0 8x40 iv0 XNB0 1cL0 1cN0 1fz0 1cN0 1cL0 3Cp0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|11e4", "America/Vancouver|PST PDT PWT PPT|80 70 70 70|0102301010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-25TO0 1in0 UGp0 8x10 iy0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|23e5", "America/Whitehorse|YST YDT YWT YPT YDDT PST PDT MST|90 80 80 80 70 80 70 70|01010230405656565656565656565656565656565656565656565656565656565656565656565656565656565657|-25TN0 1in0 1o10 13V0 Ser0 8x00 iz0 LCL0 1fA0 3NA0 vrd0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0|23e3", "America/Winnipeg|CST CDT CWT CPT|60 50 50 50|010101023010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2aIi0 WL0 3ND0 1in0 Jap0 Rb0 aCN0 8x30 iw0 1tB0 11z0 1ip0 11z0 1o10 11z0 1o10 11z0 1rd0 10L0 1op0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 1cL0 1cN0 11z0 6i10 WL0 6i10 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1a00 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1a00 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 14o0 1lc0 14o0 1o00 11A0 1o00 11A0 1o00 14o0 1lc0 14o0 1lc0 14o0 1o00 11A0 1o00 11A0 1o00 14o0 1lc0 14o0 1lc0 14o0 1lc0 14o0 1o00 11A0 1o00 11A0 1o00 14o0 1lc0 14o0 1lc0 14o0 1o00 11A0 1o00 11A0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|66e4", "America/Yakutat|YST YWT YPT YDT AKST AKDT|90 80 80 80 90 80|01203030303030303030303030303030304545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454|-17T10 8x00 iz0 Vo10 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 cn0 10q0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|642", "America/Yellowknife|-00 MST MWT MPT MDDT MDT|0 70 60 60 50 60|012314151515151515151515151515151515151515151515151515151515151515151515151515151515151515151515151515151515151515151515151|-1pdA0 hix0 8x20 ix0 LCL0 1fA0 zgO0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|19e3", "Antarctica/Casey|-00 +08 +11|0 -80 -b0|01212121|-2q00 1DjS0 T90 40P0 KL0 blz0 3m10|10", "Antarctica/Davis|-00 +07 +05|0 -70 -50|01012121|-vyo0 iXt0 alj0 1D7v0 VB0 3Wn0 KN0|70", "Antarctica/DumontDUrville|-00 +10|0 -a0|0101|-U0o0 cfq0 bFm0|80", "Antarctica/Macquarie|AEST AEDT -00 +11|-a0 -b0 0 -b0|0102010101010101010101010101010101010101010101010101010101010101010101010101010101010101013|-29E80 19X0 4SL0 1ayy0 Lvs0 1cM0 1o00 Rc0 1wo0 Rc0 1wo0 U00 1wo0 LA0 1C00 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 11A0 1qM0 WM0 1qM0 Oo0 1zc0 Oo0 1zc0 Oo0 1wo0 WM0 1tA0 WM0 1tA0 U00 1tA0 U00 1tA0 11A0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 11A0 1o00 1io0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1cM0 1a00 1io0 1cM0 1cM0 1cM0 1cM0 1cM0|1", "Antarctica/Mawson|-00 +06 +05|0 -60 -50|012|-CEo0 2fyk0|60", "Pacific/Auckland|NZMT NZST NZST NZDT|-bu -cu -c0 -d0|01020202020202020202020202023232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323|-1GCVu Lz0 1tB0 11zu 1o0u 11zu 1o0u 11zu 1o0u 14nu 1lcu 14nu 1lcu 1lbu 11Au 1nXu 11Au 1nXu 11Au 1nXu 11Au 1nXu 11Au 1qLu WMu 1qLu 11Au 1n1bu IM0 1C00 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1qM0 14o0 1lc0 14o0 1lc0 14o0 1lc0 17c0 1io0 17c0 1io0 17c0 1io0 17c0 1lc0 14o0 1lc0 14o0 1lc0 17c0 1io0 17c0 1io0 17c0 1lc0 14o0 1lc0 14o0 1lc0 17c0 1io0 17c0 1io0 17c0 1io0 17c0 1io0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1io0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00|14e5", "Antarctica/Palmer|-00 -03 -04 -02|0 30 40 20|0121212121213121212121212121212121212121212121212121212121212121212121212121212121|-cao0 nD0 1vd0 SL0 1vd0 17z0 1cN0 1fz0 1cN0 1cL0 1cN0 asn0 Db0 jsN0 14N0 11z0 1o10 11z0 1qN0 WL0 1qN0 WL0 1qN0 1cL0 1cN0 11z0 1o10 11z0 1qN0 WL0 1fB0 19X0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 17b0 1ip0 11z0 1ip0 1fz0 1fB0 11z0 1qN0 WL0 1qN0 WL0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 17b0 1ip0 11z0 1o10 19X0 1fB0 1nX0 G10 1EL0 Op0 1zb0 Rd0 1wn0 Rd0 46n0 Ap0|40", "Antarctica/Rothera|-00 -03|0 30|01|gOo0|130", "Antarctica/Syowa|-00 +03|0 -30|01|-vs00|20", "Antarctica/Troll|-00 +00 +02|0 0 -20|01212121212121212121212121212121212121212121212121212121212121212121|1puo0 hd0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|40", "Antarctica/Vostok|-00 +06|0 -60|01|-tjA0|25", "Europe/Oslo|CET CEST|-10 -20|010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2awM0 Qm0 W6o0 5pf0 WM0 1fA0 1cM0 1cM0 1cM0 1cM0 wJc0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1qM0 WM0 zpc0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|62e4", "Asia/Riyadh|LMT +03|-36.Q -30|01|-TvD6.Q|57e5", "Asia/Almaty|LMT +05 +06 +07|-57.M -50 -60 -70|012323232323232323232321232323232323232323232323232|-1Pc57.M eUo7.M 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0|15e5", "Asia/Amman|LMT EET EEST|-2n.I -20 -30|0121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-1yW2n.I 1HiMn.I KL0 1oN0 11b0 1oN0 11b0 1pd0 1dz0 1cp0 11b0 1op0 11b0 fO10 1db0 1e10 1cL0 1cN0 1cL0 1cN0 1fz0 1pd0 10n0 1ld0 14n0 1hB0 15b0 1ip0 19X0 1cN0 1cL0 1cN0 17b0 1ld0 14o0 1lc0 17c0 1io0 17c0 1io0 17c0 1So0 y00 1fc0 1dc0 1co0 1dc0 1cM0 1cM0 1cM0 1o00 11A0 1lc0 17c0 1cM0 1cM0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 4bX0 Dd0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0|25e5", "Asia/Anadyr|LMT +12 +13 +14 +11|-bN.U -c0 -d0 -e0 -b0|01232121212121212121214121212121212121212121212121212121212141|-1PcbN.U eUnN.U 23CL0 1db0 2q10 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 2sp0 WM0|13e3", "Asia/Aqtau|LMT +04 +05 +06|-3l.4 -40 -50 -60|012323232323232323232123232312121212121212121212|-1Pc3l.4 eUnl.4 24PX0 2pX0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cN0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0|15e4", "Asia/Aqtobe|LMT +04 +05 +06|-3M.E -40 -50 -60|0123232323232323232321232323232323232323232323232|-1Pc3M.E eUnM.E 23CL0 3Db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0|27e4", "Asia/Ashgabat|LMT +04 +05 +06|-3R.w -40 -50 -60|0123232323232323232323212|-1Pc3R.w eUnR.w 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0|41e4", "Asia/Atyrau|LMT +03 +05 +06 +04|-3r.I -30 -50 -60 -40|01232323232323232323242323232323232324242424242|-1Pc3r.I eUor.I 24PW0 2pX0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 2sp0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0|", "Asia/Baghdad|BMT +03 +04|-2V.A -30 -40|012121212121212121212121212121212121212121212121212121|-26BeV.A 2ACnV.A 11b0 1cp0 1dz0 1dd0 1db0 1cN0 1cp0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1de0 1dc0 1dc0 1dc0 1cM0 1dc0 1cM0 1dc0 1cM0 1dc0 1dc0 1dc0 1cM0 1dc0 1cM0 1dc0 1cM0 1dc0 1dc0 1dc0 1cM0 1dc0 1cM0 1dc0 1cM0 1dc0 1dc0 1dc0 1cM0 1dc0 1cM0 1dc0 1cM0 1dc0|66e5", "Asia/Qatar|LMT +04 +03|-3q.8 -40 -30|012|-21Jfq.8 27BXq.8|96e4", "Asia/Baku|LMT +03 +04 +05|-3j.o -30 -40 -50|01232323232323232323232123232323232323232323232323232323232323232|-1Pc3j.o 1jUoj.o WCL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 1cM0 9Je0 1o00 11z0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00|27e5", "Asia/Bangkok|BMT +07|-6G.4 -70|01|-218SG.4|15e6", "Asia/Barnaul|LMT +06 +07 +08|-5z -60 -70 -80|0123232323232323232323212323232321212121212121212121212121212121212|-21S5z pCnz 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 p90 LE0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0 3rd0|", "Asia/Beirut|EET EEST|-20 -30|010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-21aq0 1on0 1410 1db0 19B0 1in0 1ip0 WL0 1lQp0 11b0 1oN0 11b0 1oN0 11b0 1pd0 11b0 1oN0 11b0 q6N0 En0 1oN0 11b0 1oN0 11b0 1oN0 11b0 1pd0 11b0 1oN0 11b0 1op0 11b0 dA10 17b0 1iN0 17b0 1iN0 17b0 1iN0 17b0 1vB0 SL0 1mp0 13z0 1iN0 17b0 1iN0 17b0 1jd0 12n0 1a10 1cL0 1cN0 1cL0 1cN0 1cL0 1fB0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0|22e5", "Asia/Bishkek|LMT +05 +06 +07|-4W.o -50 -60 -70|012323232323232323232321212121212121212121212121212|-1Pc4W.o eUnW.o 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2e00 1tX0 17b0 1ip0 17b0 1ip0 17b0 1ip0 17b0 1ip0 19X0 1cPu 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0|87e4", "Asia/Brunei|LMT +0730 +08|-7D.E -7u -80|012|-1KITD.E gDc9.E|42e4", "Asia/Kolkata|MMT IST +0630|-5l.a -5u -6u|012121|-2zOtl.a 1r2LP.a 1un0 HB0 7zX0|15e6", "Asia/Chita|LMT +08 +09 +10|-7x.Q -80 -90 -a0|012323232323232323232321232323232323232323232323232323232323232312|-21Q7x.Q pAnx.Q 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0 3re0|33e4", "Asia/Choibalsan|LMT +07 +08 +10 +09|-7C -70 -80 -a0 -90|0123434343434343434343434343434343434343434343424242|-2APHC 2UkoC cKn0 1da0 1dd0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1fB0 1cL0 1cN0 1cL0 1cN0 1cL0 6hD0 11z0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 3Db0 h1f0 1cJ0 1cP0 1cJ0|38e3", "Asia/Shanghai|CST CDT|-80 -90|01010101010101010101010101010|-23uw0 18n0 OjB0 Rz0 11d0 1wL0 A10 8HX0 1G10 Tz0 1ip0 1jX0 1cN0 11b0 1oN0 aL0 1tU30 Rb0 1o10 11z0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0|23e6", "Asia/Colombo|MMT +0530 +06 +0630|-5j.w -5u -60 -6u|01231321|-2zOtj.w 1rFbN.w 1zzu 7Apu 23dz0 11zu n3cu|22e5", "Asia/Dhaka|HMT +0630 +0530 +06 +07|-5R.k -6u -5u -60 -70|0121343|-18LFR.k 1unn.k HB0 m6n0 2kxbu 1i00|16e6", "Asia/Damascus|LMT EET EEST|-2p.c -20 -30|01212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-21Jep.c Hep.c 17b0 1ip0 17b0 1ip0 17b0 1ip0 19X0 1xRB0 11X0 1oN0 10L0 1pB0 11b0 1oN0 10L0 1mp0 13X0 1oN0 11b0 1pd0 11b0 1oN0 11b0 1oN0 11b0 1oN0 11b0 1pd0 11b0 1oN0 11b0 1oN0 11b0 1oN0 11b0 1pd0 11b0 1oN0 Nb0 1AN0 Nb0 bcp0 19X0 1gp0 19X0 3ld0 1xX0 Vd0 1Bz0 Sp0 1vX0 10p0 1dz0 1cN0 1cL0 1db0 1db0 1g10 1an0 1ap0 1db0 1fd0 1db0 1cN0 1db0 1dd0 1db0 1cp0 1dz0 1c10 1dX0 1cN0 1db0 1dd0 1db0 1cN0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1db0 1cN0 1db0 1cN0 19z0 1fB0 1qL0 11B0 1on0 Wp0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0|26e5", "Asia/Dili|LMT +08 +09|-8m.k -80 -90|01212|-2le8m.k 1dnXm.k 1nfA0 Xld0|19e4", "Asia/Dubai|LMT +04|-3F.c -40|01|-21JfF.c|39e5", "Asia/Dushanbe|LMT +05 +06 +07|-4z.c -50 -60 -70|012323232323232323232321|-1Pc4z.c eUnz.c 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2hB0|76e4", "Asia/Famagusta|LMT EET EEST +03|-2f.M -20 -30 -30|0121212121212121212121212121212121212121212121212121212121212121212121212121212121212312121212121212121212121212121212121212121|-1Vc2f.M 2a3cf.M 1cL0 1qp0 Xz0 19B0 19X0 1fB0 1db0 1cp0 1cL0 1fB0 19X0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1fB0 1cL0 1cN0 1cL0 1cN0 1o30 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 15U0 2Ks0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|", "Asia/Gaza|EET EEST IST IDT|-20 -30 -20 -30|0101010101010101010101010101010123232323232323232323232323232320101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-1c2q0 5Rb0 10r0 1px0 10N0 1pz0 16p0 1jB0 16p0 1jx0 pBd0 Vz0 1oN0 11b0 1oO0 10N0 1pz0 10N0 1pb0 10N0 1pb0 10N0 1pb0 10N0 1pz0 10N0 1pb0 10N0 1pb0 11d0 1oL0 dW0 hfB0 Db0 1fB0 Rb0 bXd0 gM0 8Q00 IM0 1wM0 11z0 1C10 IL0 1s10 10n0 1o10 WL0 1zd0 On0 1ld0 11z0 1o10 14n0 1o10 14n0 1nd0 12n0 1nd0 Xz0 1q10 12n0 M10 C00 17c0 1io0 17c0 1io0 17c0 1o00 1cL0 1fB0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 17c0 1io0 18N0 1bz0 19z0 1gp0 1610 1iL0 11z0 1o10 14o0 1lA1 SKX 1xd1 MKX 1AN0 1a00 1fA0 1cL0 1cN0 1nX0 1210 1nz0 1220 1qL0 WN0 1qL0 WN0 1qL0 11c0 1oo0 11c0 1rc0 Wo0 1rc0 Wo0 1rc0 11c0 1oo0 11c0 1oo0 11c0 1oo0 11c0 1rc0 Wo0 1rc0 11c0 1oo0 11c0 1oo0 11c0 1oo0 11c0 1oo0 11c0 1rc0 Wo0 1rc0 11c0 1oo0 11c0 1oo0 11c0 1oo0 11c0 1rc0|18e5", "Asia/Hebron|EET EEST IST IDT|-20 -30 -20 -30|010101010101010101010101010101012323232323232323232323232323232010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-1c2q0 5Rb0 10r0 1px0 10N0 1pz0 16p0 1jB0 16p0 1jx0 pBd0 Vz0 1oN0 11b0 1oO0 10N0 1pz0 10N0 1pb0 10N0 1pb0 10N0 1pb0 10N0 1pz0 10N0 1pb0 10N0 1pb0 11d0 1oL0 dW0 hfB0 Db0 1fB0 Rb0 bXd0 gM0 8Q00 IM0 1wM0 11z0 1C10 IL0 1s10 10n0 1o10 WL0 1zd0 On0 1ld0 11z0 1o10 14n0 1o10 14n0 1nd0 12n0 1nd0 Xz0 1q10 12n0 M10 C00 17c0 1io0 17c0 1io0 17c0 1o00 1cL0 1fB0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 17c0 1io0 18N0 1bz0 19z0 1gp0 1610 1iL0 12L0 1mN0 14o0 1lc0 Tb0 1xd1 MKX bB0 cn0 1cN0 1a00 1fA0 1cL0 1cN0 1nX0 1210 1nz0 1220 1qL0 WN0 1qL0 WN0 1qL0 11c0 1oo0 11c0 1rc0 Wo0 1rc0 Wo0 1rc0 11c0 1oo0 11c0 1oo0 11c0 1oo0 11c0 1rc0 Wo0 1rc0 11c0 1oo0 11c0 1oo0 11c0 1oo0 11c0 1oo0 11c0 1rc0 Wo0 1rc0 11c0 1oo0 11c0 1oo0 11c0 1oo0 11c0 1rc0|25e4", "Asia/Ho_Chi_Minh|LMT PLMT +07 +08 +09|-76.E -76.u -70 -80 -90|0123423232|-2yC76.E bK00.a 1h7b6.u 5lz0 18o0 3Oq0 k5b0 aW00 BAM0|90e5", "Asia/Hong_Kong|LMT HKT HKST HKWT JST|-7A.G -80 -90 -8u -90|0123412121212121212121212121212121212121212121212121212121212121212121|-2CFH0 1taO0 Hc0 xUu 9tBu 11z0 1tDu Rc0 1wo0 11A0 1cM0 11A0 1o00 11A0 1o00 11A0 1o00 14o0 1o00 11A0 1nX0 U10 1tz0 U10 1wn0 Rd0 1wn0 U10 1tz0 U10 1tz0 U10 1tz0 U10 1wn0 Rd0 1wn0 Rd0 1wn0 U10 1tz0 U10 1tz0 17d0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 s10 1Vz0 1cN0 1cL0 1cN0 1cL0 6fd0 14n0|73e5", "Asia/Hovd|LMT +06 +07 +08|-66.A -60 -70 -80|012323232323232323232323232323232323232323232323232|-2APG6.A 2Uko6.A cKn0 1db0 1dd0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1fB0 1cL0 1cN0 1cL0 1cN0 1cL0 6hD0 11z0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 kEp0 1cJ0 1cP0 1cJ0|81e3", "Asia/Irkutsk|IMT +07 +08 +09|-6V.5 -70 -80 -90|01232323232323232323232123232323232323232323232323232323232323232|-21zGV.5 pjXV.5 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0|60e4", "Europe/Istanbul|IMT EET EEST +03 +04|-1U.U -20 -30 -30 -40|0121212121212121212121212121212121212121212121234312121212121212121212121212121212121212121212121212121212121212123|-2ogNU.U dzzU.U 11b0 8tB0 1on0 1410 1db0 19B0 1in0 3Rd0 Un0 1oN0 11b0 zSN0 CL0 mp0 1Vz0 1gN0 8yn0 1yp0 ML0 1kp0 17b0 1ip0 17b0 1fB0 19X0 1ip0 19X0 1ip0 17b0 qdB0 38L0 1jd0 Tz0 l6O0 11A0 WN0 1qL0 TB0 1tX0 U10 1tz0 11B0 1in0 17d0 z90 cne0 pb0 2Cp0 1800 14o0 1dc0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1a00 1fA0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WO0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 Xc0 1qo0 WM0 1qM0 11A0 1o00 1200 1nA0 11A0 1tA0 U00 15w0|13e6", "Asia/Jakarta|BMT +0720 +0730 +09 +08 WIB|-77.c -7k -7u -90 -80 -70|01232425|-1Q0Tk luM0 mPzO 8vWu 6kpu 4PXu xhcu|31e6", "Asia/Jayapura|LMT +09 +0930 WIT|-9m.M -90 -9u -90|0123|-1uu9m.M sMMm.M L4nu|26e4", "Asia/Jerusalem|JMT IST IDT IDDT|-2k.E -20 -30 -40|012121212121321212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-26Bek.E SyMk.E 5Rb0 10r0 1px0 10N0 1pz0 16p0 1jB0 16p0 1jx0 3LB0 Em0 or0 1cn0 1dB0 16n0 10O0 1ja0 1tC0 14o0 1cM0 1a00 11A0 1Na0 An0 1MP0 AJ0 1Kp0 LC0 1oo0 Wl0 EQN0 Db0 1fB0 Rb0 bXd0 gM0 8Q00 IM0 1wM0 11z0 1C10 IL0 1s10 10n0 1o10 WL0 1zd0 On0 1ld0 11z0 1o10 14n0 1o10 14n0 1nd0 12n0 1nd0 Xz0 1q10 12n0 1hB0 1dX0 1ep0 1aL0 1eN0 17X0 1nf0 11z0 1tB0 19W0 1e10 17b0 1ep0 1gL0 18N0 1fz0 1eN0 17b0 1gq0 1gn0 19d0 1dz0 1c10 17X0 1hB0 1gn0 19d0 1dz0 1c10 17X0 1kp0 1dz0 1c10 1aL0 1eN0 1oL0 10N0 1oL0 10N0 1oL0 10N0 1rz0 W10 1rz0 W10 1rz0 10N0 1oL0 10N0 1oL0 10N0 1rz0 W10 1rz0 W10 1rz0 10N0 1oL0 10N0 1oL0 10N0 1oL0 10N0 1rz0 W10 1rz0 W10 1rz0 10N0 1oL0 10N0 1oL0 10N0 1rz0 W10 1rz0 W10 1rz0 W10 1rz0 10N0 1oL0 10N0 1oL0|81e4", "Asia/Kabul|+04 +0430|-40 -4u|01|-10Qs0|46e5", "Asia/Kamchatka|LMT +11 +12 +13|-ay.A -b0 -c0 -d0|012323232323232323232321232323232323232323232323232323232323212|-1SLKy.A ivXy.A 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 2sp0 WM0|18e4", "Asia/Karachi|LMT +0530 +0630 +05 PKT PKST|-4s.c -5u -6u -50 -50 -60|012134545454|-2xoss.c 1qOKW.c 7zX0 eup0 LqMu 1fy00 1cL0 dK10 11b0 1610 1jX0|24e6", "Asia/Urumqi|LMT +06|-5O.k -60|01|-1GgtO.k|32e5", "Asia/Kathmandu|LMT +0530 +0545|-5F.g -5u -5J|012|-21JhF.g 2EGMb.g|12e5", "Asia/Khandyga|LMT +08 +09 +10 +11|-92.d -80 -90 -a0 -b0|0123232323232323232323212323232323232323232323232343434343434343432|-21Q92.d pAp2.d 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 qK0 yN0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 17V0 7zD0|66e2", "Asia/Krasnoyarsk|LMT +06 +07 +08|-6b.q -60 -70 -80|01232323232323232323232123232323232323232323232323232323232323232|-21Hib.q prAb.q 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0|10e5", "Asia/Kuala_Lumpur|SMT +07 +0720 +0730 +09 +08|-6T.p -70 -7k -7u -90 -80|0123435|-2Bg6T.p 17anT.p l5XE 17bO 8Fyu 1so1u|71e5", "Asia/Kuching|LMT +0730 +08 +0820 +09|-7l.k -7u -80 -8k -90|0123232323232323242|-1KITl.k gDbP.k 6ynu AnE 1O0k AnE 1NAk AnE 1NAk AnE 1NAk AnE 1O0k AnE 1NAk AnE pAk 8Fz0|13e4", "Asia/Macau|LMT CST +09 +10 CDT|-7y.a -80 -90 -a0 -90|012323214141414141414141414141414141414141414141414141414141414141414141|-2CFHy.a 1uqKy.a PX0 1kn0 15B0 11b0 4Qq0 1oM0 11c0 1ko0 1u00 11A0 1cM0 11c0 1o00 11A0 1o00 11A0 1oo0 1400 1o00 11A0 1o00 U00 1tA0 U00 1wo0 Rc0 1wru U10 1tz0 U10 1tz0 U10 1tz0 U10 1wn0 Rd0 1wn0 Rd0 1wn0 U10 1tz0 U10 1tz0 17d0 1cK0 1cO0 1cK0 1cO0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 s10 1Vz0 1cN0 1cL0 1cN0 1cL0 6fd0 14n0|57e4", "Asia/Magadan|LMT +10 +11 +12|-a3.c -a0 -b0 -c0|012323232323232323232321232323232323232323232323232323232323232312|-1Pca3.c eUo3.c 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0 3Cq0|95e3", "Asia/Makassar|LMT MMT +08 +09 WITA|-7V.A -7V.A -80 -90 -80|01234|-21JjV.A vfc0 myLV.A 8ML0|15e5", "Asia/Manila|PST PDT JST|-80 -90 -90|010201010|-1kJI0 AL0 cK10 65X0 mXB0 vX0 VK10 1db0|24e6", "Asia/Nicosia|LMT EET EEST|-2d.s -20 -30|01212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-1Vc2d.s 2a3cd.s 1cL0 1qp0 Xz0 19B0 19X0 1fB0 1db0 1cp0 1cL0 1fB0 19X0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1fB0 1cL0 1cN0 1cL0 1cN0 1o30 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|32e4", "Asia/Novokuznetsk|LMT +06 +07 +08|-5M.M -60 -70 -80|012323232323232323232321232323232323232323232323232323232323212|-1PctM.M eULM.M 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 2sp0 WM0|55e4", "Asia/Novosibirsk|LMT +06 +07 +08|-5v.E -60 -70 -80|0123232323232323232323212323212121212121212121212121212121212121212|-21Qnv.E pAFv.E 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 ml0 Os0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0 4eN0|15e5", "Asia/Omsk|LMT +05 +06 +07|-4R.u -50 -60 -70|01232323232323232323232123232323232323232323232323232323232323232|-224sR.u pMLR.u 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0|12e5", "Asia/Oral|LMT +03 +05 +06 +04|-3p.o -30 -50 -60 -40|01232323232323232424242424242424242424242424242|-1Pc3p.o eUop.o 23CK0 3Db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 2pB0 1cM0 1fA0 1cM0 1cM0 IM0 1EM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0|27e4", "Asia/Pontianak|LMT PMT +0730 +09 +08 WITA WIB|-7h.k -7h.k -7u -90 -80 -80 -70|012324256|-2ua7h.k XE00 munL.k 8Rau 6kpu 4PXu xhcu Wqnu|23e4", "Asia/Pyongyang|LMT KST JST KST|-8n -8u -90 -90|012313|-2um8n 97XR 1lTzu 2Onc0 6BA0|29e5", "Asia/Qostanay|LMT +04 +05 +06|-4e.s -40 -50 -60|012323232323232323232123232323232323232323232323|-1Pc4e.s eUoe.s 23CL0 3Db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0|", "Asia/Qyzylorda|LMT +04 +05 +06|-4l.Q -40 -50 -60|01232323232323232323232323232323232323232323232|-1Pc4l.Q eUol.Q 23CL0 3Db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 3ao0 1EM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 zQl0|73e4", "Asia/Rangoon|RMT +0630 +09|-6o.L -6u -90|0121|-21Jio.L SmnS.L 7j9u|48e5", "Asia/Sakhalin|LMT +09 +11 +12 +10|-9u.M -90 -b0 -c0 -a0|01232323232323232323232423232323232424242424242424242424242424242|-2AGVu.M 1BoMu.M 1qFa0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 2pB0 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0 3rd0|58e4", "Asia/Samarkand|LMT +04 +05 +06|-4r.R -40 -50 -60|01232323232323232323232|-1Pc4r.R eUor.R 23CL0 3Db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0|36e4", "Asia/Seoul|LMT KST JST KST KDT KDT|-8r.Q -8u -90 -90 -a0 -9u|012343434343151515151515134343|-2um8r.Q 97XV.Q 1m1zu 6CM0 Fz0 1kN0 14n0 1kN0 14L0 1zd0 On0 69B0 2I0u OL0 1FB0 Rb0 1qN0 TX0 1tB0 TX0 1tB0 TX0 1tB0 TX0 2ap0 12FBu 11A0 1o00 11A0|23e6", "Asia/Srednekolymsk|LMT +10 +11 +12|-ae.Q -a0 -b0 -c0|01232323232323232323232123232323232323232323232323232323232323232|-1Pcae.Q eUoe.Q 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0|35e2", "Asia/Taipei|CST JST CDT|-80 -90 -90|01020202020202020202020202020202020202020|-1iw80 joM0 1yo0 Tz0 1ip0 1jX0 1cN0 11b0 1oN0 11b0 1oN0 11b0 1oN0 11b0 10N0 1BX0 10p0 1pz0 10p0 1pz0 10p0 1db0 1dd0 1db0 1cN0 1db0 1cN0 1db0 1cN0 1db0 1BB0 ML0 1Bd0 ML0 uq10 1db0 1cN0 1db0 97B0 AL0|74e5", "Asia/Tashkent|LMT +05 +06 +07|-4B.b -50 -60 -70|012323232323232323232321|-1Pc4B.b eUnB.b 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0|23e5", "Asia/Tbilisi|TBMT +03 +04 +05|-2X.b -30 -40 -50|0123232323232323232323212121232323232323232323212|-1Pc2X.b 1jUnX.b WCL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 1cK0 1cL0 1cN0 1cL0 1cN0 2pz0 1cL0 1fB0 3Nz0 11B0 1nX0 11B0 1qL0 WN0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 An0 Os0 WM0|11e5", "Asia/Tehran|LMT TMT +0330 +04 +05 +0430|-3p.I -3p.I -3u -40 -50 -4u|01234325252525252525252525252525252525252525252525252525252525252525252525252525252525252525252525252|-2btDp.I 1d3c0 1huLT.I TXu 1pz0 sN0 vAu 1cL0 1dB0 1en0 pNB0 UL0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cN0 1dz0 64p0 1dz0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0 1cN0 1dz0 1cp0 1dz0 1cp0 1dz0 1cp0 1dz0|14e6", "Asia/Thimphu|LMT +0530 +06|-5W.A -5u -60|012|-Su5W.A 1BGMs.A|79e3", "Asia/Tokyo|JST JDT|-90 -a0|010101010|-QJJ0 Rc0 1lc0 14o0 1zc0 Oo0 1zc0 Oo0|38e6", "Asia/Tomsk|LMT +06 +07 +08|-5D.P -60 -70 -80|0123232323232323232323212323232323232323232323212121212121212121212|-21NhD.P pxzD.P 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 co0 1bB0 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0 3Qp0|10e5", "Asia/Ulaanbaatar|LMT +07 +08 +09|-77.w -70 -80 -90|012323232323232323232323232323232323232323232323232|-2APH7.w 2Uko7.w cKn0 1db0 1dd0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1fB0 1cL0 1cN0 1cL0 1cN0 1cL0 6hD0 11z0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 kEp0 1cJ0 1cP0 1cJ0|12e5", "Asia/Ust-Nera|LMT +08 +09 +12 +11 +10|-9w.S -80 -90 -c0 -b0 -a0|012343434343434343434345434343434343434343434343434343434343434345|-21Q9w.S pApw.S 23CL0 1d90 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 17V0 7zD0|65e2", "Asia/Vladivostok|LMT +09 +10 +11|-8L.v -90 -a0 -b0|01232323232323232323232123232323232323232323232323232323232323232|-1SJIL.v itXL.v 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0|60e4", "Asia/Yakutsk|LMT +08 +09 +10|-8C.W -80 -90 -a0|01232323232323232323232123232323232323232323232323232323232323232|-21Q8C.W pAoC.W 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0|28e4", "Asia/Yekaterinburg|LMT PMT +04 +05 +06|-42.x -3J.5 -40 -50 -60|012343434343434343434343234343434343434343434343434343434343434343|-2ag42.x 7mQh.s qBvJ.5 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0|14e5", "Asia/Yerevan|LMT +03 +04 +05|-2W -30 -40 -50|0123232323232323232323212121212323232323232323232323232323232|-1Pc2W 1jUnW WCL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 2pB0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 4RX0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0|13e5", "Atlantic/Azores|HMT -02 -01 +00 WET|1S.w 20 10 0 0|01212121212121212121212121212121212121212121232123212321232121212121212121212121212121212121212121232323232323232323232323232323234323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232|-2ldW0 aPX0 Sp0 LX0 1vc0 Tc0 1uM0 SM0 1vc0 Tc0 1vc0 SM0 1vc0 6600 1co0 3E00 17c0 1fA0 1a00 1io0 1a00 1io0 17c0 3I00 17c0 1cM0 1cM0 3Fc0 1cM0 1a00 1fA0 1io0 17c0 1cM0 1cM0 1a00 1fA0 1io0 1qM0 Dc0 1tA0 1cM0 1dc0 1400 gL0 IM0 s10 U00 dX0 Rc0 pd0 Rc0 gL0 Oo0 pd0 Rc0 gL0 Oo0 pd0 14o0 1cM0 1cP0 1cM0 1cM0 1cM0 1cM0 1cM0 3Co0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 qIl0 1cM0 1fA0 1cM0 1cM0 1cN0 1cL0 1cN0 1cM0 1cM0 1cM0 1cM0 1cN0 1cL0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cL0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|25e4", "Atlantic/Bermuda|LMT AST ADT|4j.i 40 30|0121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-1BnRE.G 1LTbE.G 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|65e3", "Atlantic/Canary|LMT -01 WET WEST|11.A 10 0 -10|01232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232|-1UtaW.o XPAW.o 1lAK0 1a10 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|54e4", "Atlantic/Cape_Verde|LMT -02 -01|1y.4 20 10|01212|-2ldW0 1eEo0 7zX0 1djf0|50e4", "Atlantic/Faroe|LMT WET WEST|r.4 0 -10|01212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2uSnw.U 2Wgow.U 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|49e3", "Atlantic/Madeira|FMT -01 +00 +01 WET WEST|17.A 10 0 -10 0 -10|01212121212121212121212121212121212121212121232123212321232121212121212121212121212121212121212121454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454|-2ldX0 aPX0 Sp0 LX0 1vc0 Tc0 1uM0 SM0 1vc0 Tc0 1vc0 SM0 1vc0 6600 1co0 3E00 17c0 1fA0 1a00 1io0 1a00 1io0 17c0 3I00 17c0 1cM0 1cM0 3Fc0 1cM0 1a00 1fA0 1io0 17c0 1cM0 1cM0 1a00 1fA0 1io0 1qM0 Dc0 1tA0 1cM0 1dc0 1400 gL0 IM0 s10 U00 dX0 Rc0 pd0 Rc0 gL0 Oo0 pd0 Rc0 gL0 Oo0 pd0 14o0 1cM0 1cP0 1cM0 1cM0 1cM0 1cM0 1cM0 3Co0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 qIl0 1cM0 1fA0 1cM0 1cM0 1cN0 1cL0 1cN0 1cM0 1cM0 1cM0 1cM0 1cN0 1cL0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|27e4", "Atlantic/Reykjavik|LMT -01 +00 GMT|1s 10 0 0|012121212121212121212121212121212121212121212121212121212121212121213|-2uWmw mfaw 1Bd0 ML0 1LB0 Cn0 1LB0 3fX0 C10 HrX0 1cO0 LB0 1EL0 LA0 1C00 Oo0 1wo0 Rc0 1wo0 Rc0 1wo0 Rc0 1zc0 Oo0 1zc0 14o0 1lc0 14o0 1lc0 14o0 1o00 11A0 1lc0 14o0 1o00 14o0 1lc0 14o0 1lc0 14o0 1lc0 14o0 1lc0 14o0 1o00 14o0 1lc0 14o0 1lc0 14o0 1lc0 14o0 1lc0 14o0 1lc0 14o0 1o00 14o0 1lc0 14o0 1lc0 14o0 1lc0 14o0 1lc0 14o0 1o00 14o0|12e4", "Atlantic/South_Georgia|-02|20|0||30", "Atlantic/Stanley|SMT -04 -03 -02|3P.o 40 30 20|012121212121212323212121212121212121212121212121212121212121212121212|-2kJw8.A 12bA8.A 19X0 1fB0 19X0 1ip0 19X0 1fB0 19X0 1fB0 19X0 1fB0 Cn0 1Cc10 WL0 1qL0 U10 1tz0 2mN0 WN0 1qL0 WN0 1qL0 WN0 1qL0 WN0 1tz0 U10 1tz0 WN0 1qL0 WN0 1qL0 WN0 1qL0 WN0 1qL0 WN0 1tz0 WN0 1qL0 WN0 1qL0 WN0 1qL0 WN0 1qL0 WN0 1qN0 U10 1wn0 Rd0 1wn0 U10 1tz0 U10 1tz0 U10 1tz0 U10 1tz0 U10 1wn0 U10 1tz0 U10 1tz0 U10|21e2", "Australia/Sydney|AEST AEDT|-a0 -b0|0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101|-293lX xcX 10jd0 yL0 1cN0 1cL0 1fB0 19X0 17c10 LA0 1C00 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 14o0 1o00 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 U00 1qM0 WM0 1tA0 WM0 1tA0 U00 1tA0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 11A0 1o00 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 11A0 1o00 WM0 1qM0 14o0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0|40e5", "Australia/Adelaide|ACST ACDT|-9u -au|0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101|-293lt xcX 10jd0 yL0 1cN0 1cL0 1fB0 19X0 17c10 LA0 1C00 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 U00 1qM0 WM0 1tA0 WM0 1tA0 U00 1tA0 U00 1tA0 Oo0 1zc0 WM0 1qM0 Rc0 1zc0 U00 1tA0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 11A0 1o00 WM0 1qM0 14o0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0|11e5", "Australia/Brisbane|AEST AEDT|-a0 -b0|01010101010101010|-293lX xcX 10jd0 yL0 1cN0 1cL0 1fB0 19X0 17c10 LA0 H1A0 Oo0 1zc0 Oo0 1zc0 Oo0|20e5", "Australia/Broken_Hill|ACST ACDT|-9u -au|0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101|-293lt xcX 10jd0 yL0 1cN0 1cL0 1fB0 19X0 17c10 LA0 1C00 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 14o0 1o00 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 U00 1qM0 WM0 1tA0 WM0 1tA0 U00 1tA0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 11A0 1o00 WM0 1qM0 14o0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0|18e3", "Australia/Currie|AEST AEDT|-a0 -b0|0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101|-29E80 19X0 10jd0 yL0 1cN0 1cL0 1fB0 19X0 17c10 LA0 1C00 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 11A0 1qM0 WM0 1qM0 Oo0 1zc0 Oo0 1zc0 Oo0 1wo0 WM0 1tA0 WM0 1tA0 U00 1tA0 U00 1tA0 11A0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 11A0 1o00 1io0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1cM0 1a00 1io0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0|746", "Australia/Darwin|ACST ACDT|-9u -au|010101010|-293lt xcX 10jd0 yL0 1cN0 1cL0 1fB0 19X0|12e4", "Australia/Eucla|+0845 +0945|-8J -9J|0101010101010101010|-293kI xcX 10jd0 yL0 1cN0 1cL0 1gSp0 Oo0 l5A0 Oo0 iJA0 G00 zU00 IM0 1qM0 11A0 1o00 11A0|368", "Australia/Hobart|AEST AEDT|-a0 -b0|010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101|-29E80 19X0 10jd0 yL0 1cN0 1cL0 1fB0 19X0 VfB0 1cM0 1o00 Rc0 1wo0 Rc0 1wo0 U00 1wo0 LA0 1C00 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 11A0 1qM0 WM0 1qM0 Oo0 1zc0 Oo0 1zc0 Oo0 1wo0 WM0 1tA0 WM0 1tA0 U00 1tA0 U00 1tA0 11A0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 11A0 1o00 1io0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1cM0 1a00 1io0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0|21e4", "Australia/Lord_Howe|AEST +1030 +1130 +11|-a0 -au -bu -b0|0121212121313131313131313131313131313131313131313131313131313131313131313131313131313131313131313131313131313131313|raC0 1zdu Rb0 1zd0 On0 1zd0 On0 1zd0 On0 1zd0 TXu 1qMu WLu 1tAu WLu 1tAu TXu 1tAu Onu 1zcu Onu 1zcu Onu 1zcu Rbu 1zcu Onu 1zcu Onu 1zcu 11zu 1o0u 11zu 1o0u 11zu 1o0u 11zu 1qMu WLu 11Au 1nXu 1qMu 11zu 1o0u 11zu 1o0u 11zu 1qMu WLu 1qMu 11zu 1o0u WLu 1qMu 14nu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1fAu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1fAu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1fzu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1fAu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1cMu 1cLu 1fAu 1cLu 1cMu 1cLu 1cMu|347", "Australia/Lindeman|AEST AEDT|-a0 -b0|010101010101010101010|-293lX xcX 10jd0 yL0 1cN0 1cL0 1fB0 19X0 17c10 LA0 H1A0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0|10", "Australia/Melbourne|AEST AEDT|-a0 -b0|0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101|-293lX xcX 10jd0 yL0 1cN0 1cL0 1fB0 19X0 17c10 LA0 1C00 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 U00 1qM0 WM0 1qM0 11A0 1tA0 U00 1tA0 U00 1tA0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 11A0 1o00 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 11A0 1o00 WM0 1qM0 14o0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0|39e5", "Australia/Perth|AWST AWDT|-80 -90|0101010101010101010|-293jX xcX 10jd0 yL0 1cN0 1cL0 1gSp0 Oo0 l5A0 Oo0 iJA0 G00 zU00 IM0 1qM0 11A0 1o00 11A0|18e5", "CET|CET CEST|-10 -20|01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2aFe0 11d0 1iO0 11A0 1o00 11A0 Qrc0 6i00 WM0 1fA0 1cM0 1cM0 1cM0 16M0 1gMM0 1a00 1fA0 1cM0 1cM0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|", "Pacific/Easter|EMT -07 -06 -05|7h.s 70 60 50|012121212121212121212121212123232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323|-1uSgG.w 1s4IG.w WL0 1zd0 On0 1ip0 11z0 1o10 11z0 1qN0 WL0 1ld0 14n0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 WL0 1qN0 11z0 1o10 2pA0 11z0 1o10 11z0 1qN0 WL0 1qN0 WL0 1qN0 1cL0 1cN0 11z0 1o10 11z0 1qN0 WL0 1fB0 19X0 1qN0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 17b0 1ip0 11z0 1ip0 1fz0 1fB0 11z0 1qN0 WL0 1qN0 WL0 1qN0 WL0 1qN0 11z0 1o10 11z0 1o10 11z0 1qN0 WL0 1qN0 17b0 1ip0 11z0 1o10 19X0 1fB0 1nX0 G10 1EL0 Op0 1zb0 Rd0 1wn0 Rd0 46n0 Ap0 1Nb0 Ap0 1Nb0 Ap0 1zb0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1nX0 11B0 1qL0 WN0 1qL0 11B0 1nX0 11B0|30e2", "CST6CDT|CST CDT CWT CPT|60 50 50 50|010102301010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-261s0 1nX0 11B0 1nX0 SgN0 8x30 iw0 QwN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|", "EET|EET EEST|-20 -30|010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|hDB0 1a00 1fA0 1cM0 1cM0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|", "Europe/Dublin|DMT IST GMT BST IST|p.l -y.D 0 -10 -10|01232323232324242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242424242|-2ax9y.D Rc0 1fzy.D 14M0 1fc0 1g00 1co0 1dc0 1co0 1oo0 1400 1dc0 19A0 1io0 1io0 WM0 1o00 14o0 1o00 17c0 1io0 17c0 1fA0 1a00 1lc0 17c0 1io0 17c0 1fA0 1a00 1io0 17c0 1io0 17c0 1fA0 1cM0 1io0 17c0 1fA0 1a00 1io0 17c0 1io0 17c0 1fA0 1a00 1io0 1qM0 Dc0 g600 14o0 1wo0 17c0 1io0 11A0 1o00 17c0 1fA0 1a00 1fA0 1cM0 1fA0 1a00 17c0 1fA0 1a00 1io0 17c0 1lc0 17c0 1fA0 1a00 1io0 17c0 1io0 17c0 1fA0 1a00 1a00 1qM0 WM0 1qM0 11A0 1o00 WM0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1tA0 IM0 90o0 U00 1tA0 U00 1tA0 U00 1tA0 U00 1tA0 WM0 1qM0 WM0 1qM0 WM0 1tA0 U00 1tA0 U00 1tA0 11z0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 14o0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|12e5", "EST|EST|50|0||", "EST5EDT|EST EDT EWT EPT|50 40 40 40|010102301010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-261t0 1nX0 11B0 1nX0 SgN0 8x40 iv0 QwN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|", "Etc/GMT-0|GMT|0|0||", "Etc/GMT-1|+01|-10|0||", "Pacific/Port_Moresby|+10|-a0|0||25e4", "Etc/GMT-11|+11|-b0|0||", "Pacific/Tarawa|+12|-c0|0||29e3", "Etc/GMT-13|+13|-d0|0||", "Etc/GMT-14|+14|-e0|0||", "Etc/GMT-2|+02|-20|0||", "Etc/GMT-3|+03|-30|0||", "Etc/GMT-4|+04|-40|0||", "Etc/GMT-5|+05|-50|0||", "Etc/GMT-6|+06|-60|0||", "Indian/Christmas|+07|-70|0||21e2", "Etc/GMT-8|+08|-80|0||", "Pacific/Palau|+09|-90|0||21e3", "Etc/GMT+1|-01|10|0||", "Etc/GMT+10|-10|a0|0||", "Etc/GMT+11|-11|b0|0||", "Etc/GMT+12|-12|c0|0||", "Etc/GMT+3|-03|30|0||", "Etc/GMT+4|-04|40|0||", "Etc/GMT+5|-05|50|0||", "Etc/GMT+6|-06|60|0||", "Etc/GMT+7|-07|70|0||", "Etc/GMT+8|-08|80|0||", "Etc/GMT+9|-09|90|0||", "Etc/UTC|UTC|0|0||", "Europe/Amsterdam|AMT NST +0120 +0020 CEST CET|-j.w -1j.w -1k -k -20 -10|010101010101010101010101010101010101010101012323234545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545|-2aFcj.w 11b0 1iP0 11A0 1io0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1co0 1io0 1yo0 Pc0 1a00 1fA0 1Bc0 Mo0 1tc0 Uo0 1tA0 U00 1uo0 W00 1s00 VA0 1so0 Vc0 1sM0 UM0 1wo0 Rc0 1u00 Wo0 1rA0 W00 1s00 VA0 1sM0 UM0 1w00 fV0 BCX.w 1tA0 U00 1u00 Wo0 1sm0 601k WM0 1fA0 1cM0 1cM0 1cM0 16M0 1gMM0 1a00 1fA0 1cM0 1cM0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|16e5", "Europe/Andorra|WET CET CEST|0 -10 -20|012121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-UBA0 1xIN0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|79e3", "Europe/Astrakhan|LMT +03 +04 +05|-3c.c -30 -40 -50|012323232323232323212121212121212121212121212121212121212121212|-1Pcrc.c eUMc.c 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 2pB0 1cM0 1fA0 1cM0 3Co0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0 3rd0|10e5", "Europe/Athens|AMT EET EEST CEST CET|-1y.Q -20 -30 -20 -10|012123434121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2a61x.Q CNbx.Q mn0 kU10 9b0 3Es0 Xa0 1fb0 1dd0 k3X0 Nz0 SCp0 1vc0 SO0 1cM0 1a00 1ao0 1fc0 1a10 1fG0 1cg0 1dX0 1bX0 1cQ0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|35e5", "Europe/London|GMT BST BDST|0 -10 -20|0101010101010101010101010101010101010101010101010121212121210101210101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2axa0 Rc0 1fA0 14M0 1fc0 1g00 1co0 1dc0 1co0 1oo0 1400 1dc0 19A0 1io0 1io0 WM0 1o00 14o0 1o00 17c0 1io0 17c0 1fA0 1a00 1lc0 17c0 1io0 17c0 1fA0 1a00 1io0 17c0 1io0 17c0 1fA0 1cM0 1io0 17c0 1fA0 1a00 1io0 17c0 1io0 17c0 1fA0 1a00 1io0 1qM0 Dc0 2Rz0 Dc0 1zc0 Oo0 1zc0 Rc0 1wo0 17c0 1iM0 FA0 xB0 1fA0 1a00 14o0 bb0 LA0 xB0 Rc0 1wo0 11A0 1o00 17c0 1fA0 1a00 1fA0 1cM0 1fA0 1a00 17c0 1fA0 1a00 1io0 17c0 1lc0 17c0 1fA0 1a00 1io0 17c0 1io0 17c0 1fA0 1a00 1a00 1qM0 WM0 1qM0 11A0 1o00 WM0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1tA0 IM0 90o0 U00 1tA0 U00 1tA0 U00 1tA0 U00 1tA0 WM0 1qM0 WM0 1qM0 WM0 1tA0 U00 1tA0 U00 1tA0 11z0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1o00 14o0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|10e6", "Europe/Belgrade|CET CEST|-10 -20|01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-19RC0 3IP0 WM0 1fA0 1cM0 1cM0 1rc0 Qo0 1vmo0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|12e5", "Europe/Berlin|CET CEST CEMT|-10 -20 -30|01010101010101210101210101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2aFe0 11d0 1iO0 11A0 1o00 11A0 Qrc0 6i00 WM0 1fA0 1cM0 1cM0 1cM0 kL0 Nc0 m10 WM0 1ao0 1cp0 dX0 jz0 Dd0 1io0 17c0 1fA0 1a00 1ehA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|41e5", "Europe/Prague|CET CEST GMT|-10 -20 0|01010101010101010201010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2aFe0 11d0 1iO0 11A0 1o00 11A0 Qrc0 6i00 WM0 1fA0 1cM0 1cM0 1cM0 1cM0 1qM0 11c0 mp0 xA0 mn0 17c0 1io0 17c0 1fc0 1ao0 1bNc0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|13e5", "Europe/Brussels|WET CET CEST WEST|0 -10 -20 -10|0121212103030303030303030303030303030303030303030303212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2ehc0 3zX0 11c0 1iO0 11A0 1o00 11A0 my0 Ic0 1qM0 Rc0 1EM0 UM0 1u00 10o0 1io0 1io0 17c0 1a00 1fA0 1cM0 1cM0 1io0 17c0 1fA0 1a00 1io0 1a30 1io0 17c0 1fA0 1a00 1io0 17c0 1cM0 1cM0 1a00 1io0 1cM0 1cM0 1a00 1fA0 1io0 17c0 1cM0 1cM0 1a00 1fA0 1io0 1qM0 Dc0 y00 5Wn0 WM0 1fA0 1cM0 16M0 1iM0 16M0 1C00 Uo0 1eeo0 1a00 1fA0 1cM0 1cM0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|21e5", "Europe/Bucharest|BMT EET EEST|-1I.o -20 -30|0121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-1xApI.o 20LI.o RA0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1Axc0 On0 1fA0 1a10 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cK0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cL0 1cN0 1cL0 1fB0 1nX0 11E0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|19e5", "Europe/Budapest|CET CEST|-10 -20|0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2aFe0 11d0 1iO0 11A0 1ip0 17b0 1op0 1tb0 Q2m0 3Ne0 WM0 1fA0 1cM0 1cM0 1oJ0 1dc0 1030 1fA0 1cM0 1cM0 1cM0 1cM0 1fA0 1a00 1iM0 1fA0 8Ha0 Rb0 1wN0 Rb0 1BB0 Lz0 1C20 LB0 SNX0 1a10 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|17e5", "Europe/Zurich|CET CEST|-10 -20|01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-19Lc0 11A0 1o00 11A0 1xG10 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|38e4", "Europe/Chisinau|CMT BMT EET EEST CEST CET MSK MSD|-1T -1I.o -20 -30 -20 -10 -30 -40|012323232323232323234545467676767676767676767323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232|-26jdT wGMa.A 20LI.o RA0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 27A0 2en0 39g0 WM0 1fA0 1cM0 V90 1t7z0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 gL0 WO0 1cM0 1cM0 1cK0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1fB0 1nX0 11D0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|67e4", "Europe/Copenhagen|CET CEST|-10 -20|0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2azC0 Tz0 VuO0 60q0 WM0 1fA0 1cM0 1cM0 1cM0 S00 1HA0 Nc0 1C00 Dc0 1Nc0 Ao0 1h5A0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|12e5", "Europe/Gibraltar|GMT BST BDST CET CEST|0 -10 -20 -10 -20|010101010101010101010101010101010101010101010101012121212121010121010101010101010101034343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343|-2axa0 Rc0 1fA0 14M0 1fc0 1g00 1co0 1dc0 1co0 1oo0 1400 1dc0 19A0 1io0 1io0 WM0 1o00 14o0 1o00 17c0 1io0 17c0 1fA0 1a00 1lc0 17c0 1io0 17c0 1fA0 1a00 1io0 17c0 1io0 17c0 1fA0 1cM0 1io0 17c0 1fA0 1a00 1io0 17c0 1io0 17c0 1fA0 1a00 1io0 1qM0 Dc0 2Rz0 Dc0 1zc0 Oo0 1zc0 Rc0 1wo0 17c0 1iM0 FA0 xB0 1fA0 1a00 14o0 bb0 LA0 xB0 Rc0 1wo0 11A0 1o00 17c0 1fA0 1a00 1fA0 1cM0 1fA0 1a00 17c0 1fA0 1a00 1io0 17c0 1lc0 17c0 1fA0 10Jz0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|30e3", "Europe/Helsinki|HMT EET EEST|-1D.N -20 -30|0121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-1WuND.N OULD.N 1dA0 1xGq0 1cM0 1cM0 1cM0 1cN0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|12e5", "Europe/Kaliningrad|CET CEST EET EEST MSK MSD +03|-10 -20 -20 -30 -30 -40 -30|01010101010101232454545454545454543232323232323232323232323232323232323232323262|-2aFe0 11d0 1iO0 11A0 1o00 11A0 Qrc0 6i00 WM0 1fA0 1cM0 1cM0 1cM0 390 7A0 1en0 12N0 1pbb0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cN0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0|44e4", "Europe/Kiev|KMT EET MSK CEST CET MSD EEST|-22.4 -20 -30 -20 -10 -40 -30|0123434252525252525252525256161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161|-1Pc22.4 eUo2.4 rnz0 2Hg0 WM0 1fA0 da0 1v4m0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 Db0 3220 1cK0 1cL0 1cN0 1cL0 1cN0 1cL0 1cQ0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|34e5", "Europe/Kirov|LMT +03 +04 +05|-3i.M -30 -40 -50|01232323232323232321212121212121212121212121212121212121212121|-22WM0 qH90 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 2pB0 1cM0 1fA0 1cM0 3Co0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0|48e4", "Europe/Lisbon|LMT WET WEST WEMT CET CEST|A.J 0 -10 -20 -10 -20|012121212121212121212121212121212121212121212321232123212321212121212121212121212121212121212121214121212121212121212121212121212124545454212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2le00 aPX0 Sp0 LX0 1vc0 Tc0 1uM0 SM0 1vc0 Tc0 1vc0 SM0 1vc0 6600 1co0 3E00 17c0 1fA0 1a00 1io0 1a00 1io0 17c0 3I00 17c0 1cM0 1cM0 3Fc0 1cM0 1a00 1fA0 1io0 17c0 1cM0 1cM0 1a00 1fA0 1io0 1qM0 Dc0 1tA0 1cM0 1dc0 1400 gL0 IM0 s10 U00 dX0 Rc0 pd0 Rc0 gL0 Oo0 pd0 Rc0 gL0 Oo0 pd0 14o0 1cM0 1cP0 1cM0 1cM0 1cM0 1cM0 1cM0 3Co0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 pvy0 1cM0 1cM0 1fA0 1cM0 1cM0 1cN0 1cL0 1cN0 1cM0 1cM0 1cM0 1cM0 1cN0 1cL0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|27e5", "Europe/Luxembourg|LMT CET CEST WET WEST WEST WET|-o.A -10 -20 0 -10 -20 -10|0121212134343434343434343434343434343434343434343434565651212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2DG0o.A t6mo.A TB0 1nX0 Up0 1o20 11A0 rW0 CM0 1qP0 R90 1EO0 UK0 1u20 10m0 1ip0 1in0 17e0 19W0 1fB0 1db0 1cp0 1in0 17d0 1fz0 1a10 1in0 1a10 1in0 17f0 1fA0 1a00 1io0 17c0 1cM0 1cM0 1a00 1io0 1cM0 1cM0 1a00 1fA0 1io0 17c0 1cM0 1cM0 1a00 1fA0 1io0 1qM0 Dc0 vA0 60L0 WM0 1fA0 1cM0 17c0 1io0 16M0 1C00 Uo0 1eeo0 1a00 1fA0 1cM0 1cM0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|54e4", "Europe/Madrid|WET WEST WEMT CET CEST|0 -10 -20 -10 -20|010101010101010101210343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343|-25Td0 19B0 1cL0 1dd0 b1z0 18p0 3HX0 17d0 1fz0 1a10 1io0 1a00 1in0 17d0 iIn0 Hd0 1cL0 bb0 1200 2s20 14n0 5aL0 Mp0 1vz0 17d0 1in0 17d0 1in0 17d0 1in0 17d0 6hX0 11B0 XHX0 1a10 1fz0 1a10 19X0 1cN0 1fz0 1a10 1fC0 1cM0 1cM0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|62e5", "Europe/Malta|CET CEST|-10 -20|0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2arB0 Lz0 1cN0 1db0 1410 1on0 Wp0 1qL0 17d0 1cL0 M3B0 5M20 WM0 1fA0 1co0 17c0 1iM0 16m0 1de0 1lc0 14m0 1lc0 WO0 1qM0 GTW0 On0 1C10 LA0 1C00 LA0 1EM0 LA0 1C00 LA0 1zc0 Oo0 1C00 Oo0 1co0 1cM0 1lA0 Xc0 1qq0 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1o10 11z0 1iN0 19z0 1fB0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|42e4", "Europe/Minsk|MMT EET MSK CEST CET MSD EEST +03|-1O -20 -30 -20 -10 -40 -30 -30|01234343252525252525252525261616161616161616161616161616161616161617|-1Pc1O eUnO qNX0 3gQ0 WM0 1fA0 1cM0 Al0 1tsn0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 3Fc0 1cN0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0|19e5", "Europe/Monaco|PMT WET WEST WEMT CET CEST|-9.l 0 -10 -20 -10 -20|01212121212121212121212121212121212121212121212121232323232345454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454|-2nco9.l cNb9.l HA0 19A0 1iM0 11c0 1oo0 Wo0 1rc0 QM0 1EM0 UM0 1u00 10o0 1io0 1wo0 Rc0 1a00 1fA0 1cM0 1cM0 1io0 17c0 1fA0 1a00 1io0 1a00 1io0 17c0 1fA0 1a00 1io0 17c0 1cM0 1cM0 1a00 1io0 1cM0 1cM0 1a00 1fA0 1io0 17c0 1cM0 1cM0 1a00 1fA0 1io0 1qM0 Df0 2RV0 11z0 11B0 1ze0 WM0 1fA0 1cM0 1fa0 1aq0 16M0 1ekn0 1cL0 1fC0 1a00 1fA0 1cM0 1cM0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|38e3", "Europe/Moscow|MMT MMT MST MDST MSD MSK +05 EET EEST MSK|-2u.h -2v.j -3v.j -4v.j -40 -30 -50 -20 -30 -40|012132345464575454545454545454545458754545454545454545454545454545454545454595|-2ag2u.h 2pyW.W 1bA0 11X0 GN0 1Hb0 c4v.j ik0 3DA0 dz0 15A0 c10 2q10 iM10 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cN0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0|16e6", "Europe/Paris|PMT WET WEST CEST CET WEMT|-9.l 0 -10 -20 -10 -20|0121212121212121212121212121212121212121212121212123434352543434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434343434|-2nco8.l cNb8.l HA0 19A0 1iM0 11c0 1oo0 Wo0 1rc0 QM0 1EM0 UM0 1u00 10o0 1io0 1wo0 Rc0 1a00 1fA0 1cM0 1cM0 1io0 17c0 1fA0 1a00 1io0 1a00 1io0 17c0 1fA0 1a00 1io0 17c0 1cM0 1cM0 1a00 1io0 1cM0 1cM0 1a00 1fA0 1io0 17c0 1cM0 1cM0 1a00 1fA0 1io0 1qM0 Df0 Ik0 5M30 WM0 1fA0 1cM0 Vx0 hB0 1aq0 16M0 1ekn0 1cL0 1fC0 1a00 1fA0 1cM0 1cM0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|11e6", "Europe/Riga|RMT LST EET MSK CEST CET MSD EEST|-1A.y -2A.y -20 -30 -20 -10 -40 -30|010102345454536363636363636363727272727272727272727272727272727272727272727272727272727272727272727272727272727272727272727272|-25TzA.y 11A0 1iM0 ko0 gWm0 yDXA.y 2bX0 3fE0 WM0 1fA0 1cM0 1cM0 4m0 1sLy0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cN0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cN0 1o00 11A0 1o00 11A0 1qM0 3oo0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|64e4", "Europe/Rome|CET CEST|-10 -20|0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2arB0 Lz0 1cN0 1db0 1410 1on0 Wp0 1qL0 17d0 1cL0 M3B0 5M20 WM0 1fA0 1cM0 16M0 1iM0 16m0 1de0 1lc0 14m0 1lc0 WO0 1qM0 GTW0 On0 1C10 LA0 1C00 LA0 1EM0 LA0 1C00 LA0 1zc0 Oo0 1C00 Oo0 1C00 LA0 1zc0 Oo0 1C00 LA0 1C00 LA0 1zc0 Oo0 1C00 Oo0 1zc0 Oo0 1fC0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|39e5", "Europe/Samara|LMT +03 +04 +05|-3k.k -30 -40 -50|0123232323232323232121232323232323232323232323232323232323212|-22WM0 qH90 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 2pB0 1cM0 1fA0 2y10 14m0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 2sp0 WM0|12e5", "Europe/Saratov|LMT +03 +04 +05|-34.i -30 -40 -50|012323232323232321212121212121212121212121212121212121212121212|-22WM0 qH90 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 2pB0 1cM0 1cM0 1cM0 1fA0 1cM0 3Co0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0 5810|", "Europe/Simferopol|SMT EET MSK CEST CET MSD EEST MSK|-2g -20 -30 -20 -10 -40 -30 -40|012343432525252525252525252161616525252616161616161616161616161616161616172|-1Pc2g eUog rEn0 2qs0 WM0 1fA0 1cM0 3V0 1u0L0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1Q00 4eL0 1cL0 1cN0 1cL0 1cN0 dX0 WL0 1cN0 1cL0 1fB0 1o30 11B0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11z0 1nW0|33e4", "Europe/Sofia|EET CET CEST EEST|-20 -10 -20 -30|01212103030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030|-168L0 WM0 1fA0 1cM0 1cM0 1cN0 1mKH0 1dd0 1fb0 1ap0 1fb0 1a20 1fy0 1a30 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cK0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1fB0 1nX0 11E0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|12e5", "Europe/Stockholm|CET CEST|-10 -20|01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2azC0 TB0 2yDe0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|15e5", "Europe/Tallinn|TMT CET CEST EET MSK MSD EEST|-1D -10 -20 -20 -30 -40 -30|012103421212454545454545454546363636363636363636363636363636363636363636363636363636363636363636363636363636363636363636363|-26oND teD 11A0 1Ta0 4rXl KSLD 2FX0 2Jg0 WM0 1fA0 1cM0 18J0 1sTX0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cN0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o10 11A0 1qM0 5QM0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|41e4", "Europe/Tirane|LMT CET CEST|-1j.k -10 -20|01212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2glBj.k 14pcj.k 5LC0 WM0 4M0 1fCK0 10n0 1op0 11z0 1pd0 11z0 1qN0 WL0 1qp0 Xb0 1qp0 Xb0 1qp0 11z0 1lB0 11z0 1qN0 11z0 1iN0 16n0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|42e4", "Europe/Ulyanovsk|LMT +03 +04 +05 +02|-3d.A -30 -40 -50 -20|01232323232323232321214121212121212121212121212121212121212121212|-22WM0 qH90 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 2pB0 1cM0 1fA0 2pB0 IM0 rX0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0 3rd0|13e5", "Europe/Uzhgorod|CET CEST MSK MSD EET EEST|-10 -20 -30 -40 -20 -30|010101023232323232323232320454545454545454545454545454545454545454545454545454545454545454545454545454545454545454545454|-1cqL0 6i00 WM0 1fA0 1cM0 1ml0 1Cp0 1r3W0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1Q00 1Nf0 2pw0 1cL0 1cN0 1cL0 1cN0 1cL0 1cQ0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|11e4", "Europe/Vienna|CET CEST|-10 -20|0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2aFe0 11d0 1iO0 11A0 1o00 11A0 3KM0 14o0 LA00 6i00 WM0 1fA0 1cM0 1cM0 1cM0 400 2qM0 1ao0 1co0 1cM0 1io0 17c0 1gHa0 19X0 1cP0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|18e5", "Europe/Vilnius|WMT KMT CET EET MSK CEST MSD EEST|-1o -1z.A -10 -20 -30 -20 -40 -30|012324525254646464646464646473737373737373737352537373737373737373737373737373737373737373737373737373737373737373737373|-293do 6ILM.o 1Ooz.A zz0 Mfd0 29W0 3is0 WM0 1fA0 1cM0 LV0 1tgL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cN0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11B0 1o00 11A0 1qM0 8io0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|54e4", "Europe/Volgograd|LMT +03 +04 +05|-2V.E -30 -40 -50|012323232323232321212121212121212121212121212121212121212121212|-21IqV.E psLV.E 23CL0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 2pB0 1cM0 1cM0 1cM0 1fA0 1cM0 3Co0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 8Hz0 9Jd0|10e5", "Europe/Warsaw|WMT CET CEST EET EEST|-1o -10 -20 -20 -30|012121234312121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2ctdo 1LXo 11d0 1iO0 11A0 1o00 11A0 1on0 11A0 6zy0 HWP0 5IM0 WM0 1fA0 1cM0 1dz0 1mL0 1en0 15B0 1aq0 1nA0 11A0 1io0 17c0 1fA0 1a00 iDX0 LA0 1cM0 1cM0 1C00 Oo0 1cM0 1cM0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1C00 LA0 uso0 1a00 1fA0 1cM0 1cM0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cN0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|17e5", "Europe/Zaporozhye|+0220 EET MSK CEST CET MSD EEST|-2k -20 -30 -20 -10 -40 -30|01234342525252525252525252526161616161616161616161616161616161616161616161616161616161616161616161616161616161616161616161|-1Pc2k eUok rdb0 2RE0 WM0 1fA0 8m0 1v9a0 1db0 1cN0 1db0 1cN0 1db0 1dd0 1cO0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cK0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cQ0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|77e4", "HST|HST|a0|0||", "Indian/Chagos|LMT +05 +06|-4N.E -50 -60|012|-2xosN.E 3AGLN.E|30e2", "Indian/Cocos|+0630|-6u|0||596", "Indian/Kerguelen|-00 +05|0 -50|01|-MG00|130", "Indian/Mahe|LMT +04|-3F.M -40|01|-2yO3F.M|79e3", "Indian/Maldives|MMT +05|-4S -50|01|-olgS|35e4", "Indian/Mauritius|LMT +04 +05|-3O -40 -50|012121|-2xorO 34unO 14L0 12kr0 11z0|15e4", "Indian/Reunion|LMT +04|-3F.Q -40|01|-2mDDF.Q|84e4", "Pacific/Kwajalein|+11 +10 +09 -12 +12|-b0 -a0 -90 c0 -c0|012034|-1kln0 akp0 6Up0 12ry0 Wan0|14e3", "MET|MET MEST|-10 -20|01010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-2aFe0 11d0 1iO0 11A0 1o00 11A0 Qrc0 6i00 WM0 1fA0 1cM0 1cM0 1cM0 16M0 1gMM0 1a00 1fA0 1cM0 1cM0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|", "MST|MST|70|0||", "MST7MDT|MST MDT MWT MPT|70 60 60 60|010102301010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-261r0 1nX0 11B0 1nX0 SgN0 8x20 ix0 QwN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|", "Pacific/Chatham|+1215 +1245 +1345|-cf -cJ -dJ|012121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121212|-WqAf 1adef IM0 1C00 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Oo0 1zc0 Rc0 1zc0 Oo0 1qM0 14o0 1lc0 14o0 1lc0 14o0 1lc0 17c0 1io0 17c0 1io0 17c0 1io0 17c0 1lc0 14o0 1lc0 14o0 1lc0 17c0 1io0 17c0 1io0 17c0 1lc0 14o0 1lc0 14o0 1lc0 17c0 1io0 17c0 1io0 17c0 1io0 17c0 1io0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1io0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00|600", "Pacific/Apia|LMT -1130 -11 -10 +14 +13|bq.U bu b0 a0 -e0 -d0|01232345454545454545454545454545454545454545454545454545454|-2nDMx.4 1yW03.4 2rRbu 1ff0 1a00 CI0 AQ0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1io0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1a00 1fA0 1cM0 1fA0 1a00 1fA0 1a00|37e3", "Pacific/Bougainville|+10 +09 +11|-a0 -90 -b0|0102|-16Wy0 7CN0 2MQp0|18e4", "Pacific/Chuuk|+10 +09|-a0 -90|01010|-2ewy0 axB0 RVX0 axd0|49e3", "Pacific/Efate|LMT +11 +12|-bd.g -b0 -c0|0121212121212121212121|-2l9nd.g 2Szcd.g 1cL0 1oN0 10L0 1fB0 19X0 1fB0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1fB0 Lz0 1Nd0 An0|66e3", "Pacific/Enderbury|-12 -11 +13|c0 b0 -d0|012|nIc0 B7X0|1", "Pacific/Fakaofo|-11 +13|b0 -d0|01|1Gfn0|483", "Pacific/Fiji|LMT +12 +13|-bT.I -c0 -d0|0121212121212121212121212121212121212121212121212121212121212121|-2bUzT.I 3m8NT.I LA0 1EM0 IM0 nJc0 LA0 1o00 Rc0 1wo0 Ao0 1Nc0 Ao0 1Q00 xz0 1SN0 uM0 1SM0 uM0 1VA0 s00 1VA0 s00 1VA0 s00 20o0 pc0 20o0 s00 20o0 pc0 20o0 pc0 20o0 pc0 20o0 pc0 20o0 s00 1VA0 s00 20o0 pc0 20o0 pc0 20o0 pc0 20o0 pc0 20o0 s00 20o0 pc0 20o0 pc0 20o0 pc0 20o0 pc0 20o0 s00 1VA0 s00|88e4", "Pacific/Galapagos|LMT -05 -06|5W.o 50 60|01212|-1yVS1.A 2dTz1.A gNd0 rz0|25e3", "Pacific/Gambier|LMT -09|8X.M 90|01|-2jof0.c|125", "Pacific/Guadalcanal|LMT +11|-aD.M -b0|01|-2joyD.M|11e4", "Pacific/Guam|GST +09 GDT ChST|-a0 -90 -b0 -a0|01020202020202020203|-18jK0 6pB0 AhB0 3QL0 g2p0 3p91 WOX rX0 1zd0 Rb0 1wp0 Rb0 5xd0 rX0 5sN0 zb1 1C0X On0 ULb0|17e4", "Pacific/Honolulu|HST HDT HWT HPT HST|au 9u 9u 9u a0|0102304|-1thLu 8x0 lef0 8wWu iAu 46p0|37e4", "Pacific/Kiritimati|-1040 -10 +14|aE a0 -e0|012|nIaE B7Xk|51e2", "Pacific/Kosrae|+11 +09 +10 +12|-b0 -90 -a0 -c0|01021030|-2ewz0 axC0 HBy0 akp0 axd0 WOK0 1bdz0|66e2", "Pacific/Majuro|+11 +09 +10 +12|-b0 -90 -a0 -c0|0102103|-2ewz0 axC0 HBy0 akp0 6RB0 12um0|28e3", "Pacific/Marquesas|LMT -0930|9i 9u|01|-2joeG|86e2", "Pacific/Pago_Pago|LMT SST|bm.M b0|01|-2nDMB.c|37e2", "Pacific/Nauru|LMT +1130 +09 +12|-b7.E -bu -90 -c0|01213|-1Xdn7.E QCnB.E 7mqu 1lnbu|10e3", "Pacific/Niue|-1120 -1130 -11|bk bu b0|012|-KfME 17y0a|12e2", "Pacific/Norfolk|+1112 +1130 +1230 +11 +12|-bc -bu -cu -b0 -c0|012134343434343434343434343434343434343434|-Kgbc W01G Oo0 1COo0 9Jcu 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0|25e4", "Pacific/Noumea|LMT +11 +12|-b5.M -b0 -c0|01212121|-2l9n5.M 2EqM5.M xX0 1PB0 yn0 HeP0 Ao0|98e3", "Pacific/Pitcairn|-0830 -08|8u 80|01|18Vku|56", "Pacific/Pohnpei|+11 +09 +10|-b0 -90 -a0|010210|-2ewz0 axC0 HBy0 akp0 axd0|34e3", "Pacific/Rarotonga|-1030 -0930 -10|au 9u a0|012121212121212121212121212|lyWu IL0 1zcu Onu 1zcu Onu 1zcu Rbu 1zcu Onu 1zcu Onu 1zcu Onu 1zcu Onu 1zcu Onu 1zcu Rbu 1zcu Onu 1zcu Onu 1zcu Onu|13e3", "Pacific/Tahiti|LMT -10|9W.g a0|01|-2joe1.I|18e4", "Pacific/Tongatapu|+1220 +13 +14|-ck -d0 -e0|0121212121|-1aB0k 2n5dk 15A0 1wo0 xz0 1Q10 xz0 zWN0 s00|75e3", "PST8PDT|PST PDT PWT PPT|80 70 70 70|010102301010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|-261q0 1nX0 11B0 1nX0 SgN0 8x10 iy0 QwN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1cN0 1cL0 1cN0 1cL0 s10 1Vz0 LB0 1BX0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 1cN0 1fz0 1a10 1fz0 1cN0 1cL0 1cN0 1cL0 1cN0 1cL0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 14p0 1lb0 14p0 1lb0 14p0 1nX0 11B0 1nX0 11B0 1nX0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0|", "WET|WET WEST|0 -10|010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010|hDB0 1a00 1fA0 1cM0 1cM0 1cM0 1fA0 1a00 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1cM0 1fA0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|"],
        links: ["Africa/Abidjan|Africa/Bamako", "Africa/Abidjan|Africa/Banjul", "Africa/Abidjan|Africa/Conakry", "Africa/Abidjan|Africa/Dakar", "Africa/Abidjan|Africa/Freetown", "Africa/Abidjan|Africa/Lome", "Africa/Abidjan|Africa/Nouakchott", "Africa/Abidjan|Africa/Ouagadougou", "Africa/Abidjan|Africa/Timbuktu", "Africa/Abidjan|Atlantic/St_Helena", "Africa/Cairo|Egypt", "Africa/Johannesburg|Africa/Maseru", "Africa/Johannesburg|Africa/Mbabane", "Africa/Lagos|Africa/Bangui", "Africa/Lagos|Africa/Brazzaville", "Africa/Lagos|Africa/Douala", "Africa/Lagos|Africa/Kinshasa", "Africa/Lagos|Africa/Libreville", "Africa/Lagos|Africa/Luanda", "Africa/Lagos|Africa/Malabo", "Africa/Lagos|Africa/Niamey", "Africa/Lagos|Africa/Porto-Novo", "Africa/Maputo|Africa/Blantyre", "Africa/Maputo|Africa/Bujumbura", "Africa/Maputo|Africa/Gaborone", "Africa/Maputo|Africa/Harare", "Africa/Maputo|Africa/Kigali", "Africa/Maputo|Africa/Lubumbashi", "Africa/Maputo|Africa/Lusaka", "Africa/Nairobi|Africa/Addis_Ababa", "Africa/Nairobi|Africa/Asmara", "Africa/Nairobi|Africa/Asmera", "Africa/Nairobi|Africa/Dar_es_Salaam", "Africa/Nairobi|Africa/Djibouti", "Africa/Nairobi|Africa/Kampala", "Africa/Nairobi|Africa/Mogadishu", "Africa/Nairobi|Indian/Antananarivo", "Africa/Nairobi|Indian/Comoro", "Africa/Nairobi|Indian/Mayotte", "Africa/Tripoli|Libya", "America/Adak|America/Atka", "America/Adak|US/Aleutian", "America/Anchorage|US/Alaska", "America/Argentina/Buenos_Aires|America/Buenos_Aires", "America/Argentina/Catamarca|America/Argentina/ComodRivadavia", "America/Argentina/Catamarca|America/Catamarca", "America/Argentina/Cordoba|America/Cordoba", "America/Argentina/Cordoba|America/Rosario", "America/Argentina/Jujuy|America/Jujuy", "America/Argentina/Mendoza|America/Mendoza", "America/Atikokan|America/Coral_Harbour", "America/Chicago|US/Central", "America/Curacao|America/Aruba", "America/Curacao|America/Kralendijk", "America/Curacao|America/Lower_Princes", "America/Denver|America/Shiprock", "America/Denver|Navajo", "America/Denver|US/Mountain", "America/Detroit|US/Michigan", "America/Edmonton|Canada/Mountain", "America/Fort_Wayne|America/Indiana/Indianapolis", "America/Fort_Wayne|America/Indianapolis", "America/Fort_Wayne|US/East-Indiana", "America/Godthab|America/Nuuk", "America/Halifax|Canada/Atlantic", "America/Havana|Cuba", "America/Indiana/Knox|America/Knox_IN", "America/Indiana/Knox|US/Indiana-Starke", "America/Jamaica|Jamaica", "America/Kentucky/Louisville|America/Louisville", "America/Los_Angeles|US/Pacific", "America/Los_Angeles|US/Pacific-New", "America/Manaus|Brazil/West", "America/Mazatlan|Mexico/BajaSur", "America/Mexico_City|Mexico/General", "America/New_York|US/Eastern", "America/Noronha|Brazil/DeNoronha", "America/Panama|America/Cayman", "America/Phoenix|US/Arizona", "America/Port_of_Spain|America/Anguilla", "America/Port_of_Spain|America/Antigua", "America/Port_of_Spain|America/Dominica", "America/Port_of_Spain|America/Grenada", "America/Port_of_Spain|America/Guadeloupe", "America/Port_of_Spain|America/Marigot", "America/Port_of_Spain|America/Montserrat", "America/Port_of_Spain|America/St_Barthelemy", "America/Port_of_Spain|America/St_Kitts", "America/Port_of_Spain|America/St_Lucia", "America/Port_of_Spain|America/St_Thomas", "America/Port_of_Spain|America/St_Vincent", "America/Port_of_Spain|America/Tortola", "America/Port_of_Spain|America/Virgin", "America/Regina|Canada/Saskatchewan", "America/Rio_Branco|America/Porto_Acre", "America/Rio_Branco|Brazil/Acre", "America/Santiago|Chile/Continental", "America/Sao_Paulo|Brazil/East", "America/St_Johns|Canada/Newfoundland", "America/Tijuana|America/Ensenada", "America/Tijuana|America/Santa_Isabel", "America/Tijuana|Mexico/BajaNorte", "America/Toronto|America/Montreal", "America/Toronto|Canada/Eastern", "America/Vancouver|Canada/Pacific", "America/Whitehorse|Canada/Yukon", "America/Winnipeg|Canada/Central", "Asia/Ashgabat|Asia/Ashkhabad", "Asia/Bangkok|Asia/Phnom_Penh", "Asia/Bangkok|Asia/Vientiane", "Asia/Dhaka|Asia/Dacca", "Asia/Dubai|Asia/Muscat", "Asia/Ho_Chi_Minh|Asia/Saigon", "Asia/Hong_Kong|Hongkong", "Asia/Jerusalem|Asia/Tel_Aviv", "Asia/Jerusalem|Israel", "Asia/Kathmandu|Asia/Katmandu", "Asia/Kolkata|Asia/Calcutta", "Asia/Kuala_Lumpur|Asia/Singapore", "Asia/Kuala_Lumpur|Singapore", "Asia/Macau|Asia/Macao", "Asia/Makassar|Asia/Ujung_Pandang", "Asia/Nicosia|Europe/Nicosia", "Asia/Qatar|Asia/Bahrain", "Asia/Rangoon|Asia/Yangon", "Asia/Riyadh|Asia/Aden", "Asia/Riyadh|Asia/Kuwait", "Asia/Seoul|ROK", "Asia/Shanghai|Asia/Chongqing", "Asia/Shanghai|Asia/Chungking", "Asia/Shanghai|Asia/Harbin", "Asia/Shanghai|PRC", "Asia/Taipei|ROC", "Asia/Tehran|Iran", "Asia/Thimphu|Asia/Thimbu", "Asia/Tokyo|Japan", "Asia/Ulaanbaatar|Asia/Ulan_Bator", "Asia/Urumqi|Asia/Kashgar", "Atlantic/Faroe|Atlantic/Faeroe", "Atlantic/Reykjavik|Iceland", "Atlantic/South_Georgia|Etc/GMT+2", "Australia/Adelaide|Australia/South", "Australia/Brisbane|Australia/Queensland", "Australia/Broken_Hill|Australia/Yancowinna", "Australia/Darwin|Australia/North", "Australia/Hobart|Australia/Tasmania", "Australia/Lord_Howe|Australia/LHI", "Australia/Melbourne|Australia/Victoria", "Australia/Perth|Australia/West", "Australia/Sydney|Australia/ACT", "Australia/Sydney|Australia/Canberra", "Australia/Sydney|Australia/NSW", "Etc/GMT-0|Etc/GMT", "Etc/GMT-0|Etc/GMT+0", "Etc/GMT-0|Etc/GMT0", "Etc/GMT-0|Etc/Greenwich", "Etc/GMT-0|GMT", "Etc/GMT-0|GMT+0", "Etc/GMT-0|GMT-0", "Etc/GMT-0|GMT0", "Etc/GMT-0|Greenwich", "Etc/UTC|Etc/UCT", "Etc/UTC|Etc/Universal", "Etc/UTC|Etc/Zulu", "Etc/UTC|UCT", "Etc/UTC|UTC", "Etc/UTC|Universal", "Etc/UTC|Zulu", "Europe/Belgrade|Europe/Ljubljana", "Europe/Belgrade|Europe/Podgorica", "Europe/Belgrade|Europe/Sarajevo", "Europe/Belgrade|Europe/Skopje", "Europe/Belgrade|Europe/Zagreb", "Europe/Chisinau|Europe/Tiraspol", "Europe/Dublin|Eire", "Europe/Helsinki|Europe/Mariehamn", "Europe/Istanbul|Asia/Istanbul", "Europe/Istanbul|Turkey", "Europe/Lisbon|Portugal", "Europe/London|Europe/Belfast", "Europe/London|Europe/Guernsey", "Europe/London|Europe/Isle_of_Man", "Europe/London|Europe/Jersey", "Europe/London|GB", "Europe/London|GB-Eire", "Europe/Moscow|W-SU", "Europe/Oslo|Arctic/Longyearbyen", "Europe/Oslo|Atlantic/Jan_Mayen", "Europe/Prague|Europe/Bratislava", "Europe/Rome|Europe/San_Marino", "Europe/Rome|Europe/Vatican", "Europe/Warsaw|Poland", "Europe/Zurich|Europe/Busingen", "Europe/Zurich|Europe/Vaduz", "Indian/Christmas|Etc/GMT-7", "Pacific/Auckland|Antarctica/McMurdo", "Pacific/Auckland|Antarctica/South_Pole", "Pacific/Auckland|NZ", "Pacific/Chatham|NZ-CHAT", "Pacific/Chuuk|Pacific/Truk", "Pacific/Chuuk|Pacific/Yap", "Pacific/Easter|Chile/EasterIsland", "Pacific/Guam|Pacific/Saipan", "Pacific/Honolulu|Pacific/Johnston", "Pacific/Honolulu|US/Hawaii", "Pacific/Kwajalein|Kwajalein", "Pacific/Pago_Pago|Pacific/Midway", "Pacific/Pago_Pago|Pacific/Samoa", "Pacific/Pago_Pago|US/Samoa", "Pacific/Palau|Etc/GMT-9", "Pacific/Pohnpei|Pacific/Ponape", "Pacific/Port_Moresby|Etc/GMT-10", "Pacific/Tarawa|Etc/GMT-12", "Pacific/Tarawa|Pacific/Funafuti", "Pacific/Tarawa|Pacific/Wake", "Pacific/Tarawa|Pacific/Wallis"],
        countries: ["AD|Europe/Andorra", "AE|Asia/Dubai", "AF|Asia/Kabul", "AG|America/Port_of_Spain America/Antigua", "AI|America/Port_of_Spain America/Anguilla", "AL|Europe/Tirane", "AM|Asia/Yerevan", "AO|Africa/Lagos Africa/Luanda", "AQ|Antarctica/Casey Antarctica/Davis Antarctica/DumontDUrville Antarctica/Mawson Antarctica/Palmer Antarctica/Rothera Antarctica/Syowa Antarctica/Troll Antarctica/Vostok Pacific/Auckland Antarctica/McMurdo", "AR|America/Argentina/Buenos_Aires America/Argentina/Cordoba America/Argentina/Salta America/Argentina/Jujuy America/Argentina/Tucuman America/Argentina/Catamarca America/Argentina/La_Rioja America/Argentina/San_Juan America/Argentina/Mendoza America/Argentina/San_Luis America/Argentina/Rio_Gallegos America/Argentina/Ushuaia", "AS|Pacific/Pago_Pago", "AT|Europe/Vienna", "AU|Australia/Lord_Howe Antarctica/Macquarie Australia/Hobart Australia/Currie Australia/Melbourne Australia/Sydney Australia/Broken_Hill Australia/Brisbane Australia/Lindeman Australia/Adelaide Australia/Darwin Australia/Perth Australia/Eucla", "AW|America/Curacao America/Aruba", "AX|Europe/Helsinki Europe/Mariehamn", "AZ|Asia/Baku", "BA|Europe/Belgrade Europe/Sarajevo", "BB|America/Barbados", "BD|Asia/Dhaka", "BE|Europe/Brussels", "BF|Africa/Abidjan Africa/Ouagadougou", "BG|Europe/Sofia", "BH|Asia/Qatar Asia/Bahrain", "BI|Africa/Maputo Africa/Bujumbura", "BJ|Africa/Lagos Africa/Porto-Novo", "BL|America/Port_of_Spain America/St_Barthelemy", "BM|Atlantic/Bermuda", "BN|Asia/Brunei", "BO|America/La_Paz", "BQ|America/Curacao America/Kralendijk", "BR|America/Noronha America/Belem America/Fortaleza America/Recife America/Araguaina America/Maceio America/Bahia America/Sao_Paulo America/Campo_Grande America/Cuiaba America/Santarem America/Porto_Velho America/Boa_Vista America/Manaus America/Eirunepe America/Rio_Branco", "BS|America/Nassau", "BT|Asia/Thimphu", "BW|Africa/Maputo Africa/Gaborone", "BY|Europe/Minsk", "BZ|America/Belize", "CA|America/St_Johns America/Halifax America/Glace_Bay America/Moncton America/Goose_Bay America/Blanc-Sablon America/Toronto America/Nipigon America/Thunder_Bay America/Iqaluit America/Pangnirtung America/Atikokan America/Winnipeg America/Rainy_River America/Resolute America/Rankin_Inlet America/Regina America/Swift_Current America/Edmonton America/Cambridge_Bay America/Yellowknife America/Inuvik America/Creston America/Dawson_Creek America/Fort_Nelson America/Vancouver America/Whitehorse America/Dawson", "CC|Indian/Cocos", "CD|Africa/Maputo Africa/Lagos Africa/Kinshasa Africa/Lubumbashi", "CF|Africa/Lagos Africa/Bangui", "CG|Africa/Lagos Africa/Brazzaville", "CH|Europe/Zurich", "CI|Africa/Abidjan", "CK|Pacific/Rarotonga", "CL|America/Santiago America/Punta_Arenas Pacific/Easter", "CM|Africa/Lagos Africa/Douala", "CN|Asia/Shanghai Asia/Urumqi", "CO|America/Bogota", "CR|America/Costa_Rica", "CU|America/Havana", "CV|Atlantic/Cape_Verde", "CW|America/Curacao", "CX|Indian/Christmas", "CY|Asia/Nicosia Asia/Famagusta", "CZ|Europe/Prague", "DE|Europe/Zurich Europe/Berlin Europe/Busingen", "DJ|Africa/Nairobi Africa/Djibouti", "DK|Europe/Copenhagen", "DM|America/Port_of_Spain America/Dominica", "DO|America/Santo_Domingo", "DZ|Africa/Algiers", "EC|America/Guayaquil Pacific/Galapagos", "EE|Europe/Tallinn", "EG|Africa/Cairo", "EH|Africa/El_Aaiun", "ER|Africa/Nairobi Africa/Asmara", "ES|Europe/Madrid Africa/Ceuta Atlantic/Canary", "ET|Africa/Nairobi Africa/Addis_Ababa", "FI|Europe/Helsinki", "FJ|Pacific/Fiji", "FK|Atlantic/Stanley", "FM|Pacific/Chuuk Pacific/Pohnpei Pacific/Kosrae", "FO|Atlantic/Faroe", "FR|Europe/Paris", "GA|Africa/Lagos Africa/Libreville", "GB|Europe/London", "GD|America/Port_of_Spain America/Grenada", "GE|Asia/Tbilisi", "GF|America/Cayenne", "GG|Europe/London Europe/Guernsey", "GH|Africa/Accra", "GI|Europe/Gibraltar", "GL|America/Godthab America/Danmarkshavn America/Scoresbysund America/Thule", "GM|Africa/Abidjan Africa/Banjul", "GN|Africa/Abidjan Africa/Conakry", "GP|America/Port_of_Spain America/Guadeloupe", "GQ|Africa/Lagos Africa/Malabo", "GR|Europe/Athens", "GS|Atlantic/South_Georgia", "GT|America/Guatemala", "GU|Pacific/Guam", "GW|Africa/Bissau", "GY|America/Guyana", "HK|Asia/Hong_Kong", "HN|America/Tegucigalpa", "HR|Europe/Belgrade Europe/Zagreb", "HT|America/Port-au-Prince", "HU|Europe/Budapest", "ID|Asia/Jakarta Asia/Pontianak Asia/Makassar Asia/Jayapura", "IE|Europe/Dublin", "IL|Asia/Jerusalem", "IM|Europe/London Europe/Isle_of_Man", "IN|Asia/Kolkata", "IO|Indian/Chagos", "IQ|Asia/Baghdad", "IR|Asia/Tehran", "IS|Atlantic/Reykjavik", "IT|Europe/Rome", "JE|Europe/London Europe/Jersey", "JM|America/Jamaica", "JO|Asia/Amman", "JP|Asia/Tokyo", "KE|Africa/Nairobi", "KG|Asia/Bishkek", "KH|Asia/Bangkok Asia/Phnom_Penh", "KI|Pacific/Tarawa Pacific/Enderbury Pacific/Kiritimati", "KM|Africa/Nairobi Indian/Comoro", "KN|America/Port_of_Spain America/St_Kitts", "KP|Asia/Pyongyang", "KR|Asia/Seoul", "KW|Asia/Riyadh Asia/Kuwait", "KY|America/Panama America/Cayman", "KZ|Asia/Almaty Asia/Qyzylorda Asia/Qostanay Asia/Aqtobe Asia/Aqtau Asia/Atyrau Asia/Oral", "LA|Asia/Bangkok Asia/Vientiane", "LB|Asia/Beirut", "LC|America/Port_of_Spain America/St_Lucia", "LI|Europe/Zurich Europe/Vaduz", "LK|Asia/Colombo", "LR|Africa/Monrovia", "LS|Africa/Johannesburg Africa/Maseru", "LT|Europe/Vilnius", "LU|Europe/Luxembourg", "LV|Europe/Riga", "LY|Africa/Tripoli", "MA|Africa/Casablanca", "MC|Europe/Monaco", "MD|Europe/Chisinau", "ME|Europe/Belgrade Europe/Podgorica", "MF|America/Port_of_Spain America/Marigot", "MG|Africa/Nairobi Indian/Antananarivo", "MH|Pacific/Majuro Pacific/Kwajalein", "MK|Europe/Belgrade Europe/Skopje", "ML|Africa/Abidjan Africa/Bamako", "MM|Asia/Yangon", "MN|Asia/Ulaanbaatar Asia/Hovd Asia/Choibalsan", "MO|Asia/Macau", "MP|Pacific/Guam Pacific/Saipan", "MQ|America/Martinique", "MR|Africa/Abidjan Africa/Nouakchott", "MS|America/Port_of_Spain America/Montserrat", "MT|Europe/Malta", "MU|Indian/Mauritius", "MV|Indian/Maldives", "MW|Africa/Maputo Africa/Blantyre", "MX|America/Mexico_City America/Cancun America/Merida America/Monterrey America/Matamoros America/Mazatlan America/Chihuahua America/Ojinaga America/Hermosillo America/Tijuana America/Bahia_Banderas", "MY|Asia/Kuala_Lumpur Asia/Kuching", "MZ|Africa/Maputo", "NA|Africa/Windhoek", "NC|Pacific/Noumea", "NE|Africa/Lagos Africa/Niamey", "NF|Pacific/Norfolk", "NG|Africa/Lagos", "NI|America/Managua", "NL|Europe/Amsterdam", "NO|Europe/Oslo", "NP|Asia/Kathmandu", "NR|Pacific/Nauru", "NU|Pacific/Niue", "NZ|Pacific/Auckland Pacific/Chatham", "OM|Asia/Dubai Asia/Muscat", "PA|America/Panama", "PE|America/Lima", "PF|Pacific/Tahiti Pacific/Marquesas Pacific/Gambier", "PG|Pacific/Port_Moresby Pacific/Bougainville", "PH|Asia/Manila", "PK|Asia/Karachi", "PL|Europe/Warsaw", "PM|America/Miquelon", "PN|Pacific/Pitcairn", "PR|America/Puerto_Rico", "PS|Asia/Gaza Asia/Hebron", "PT|Europe/Lisbon Atlantic/Madeira Atlantic/Azores", "PW|Pacific/Palau", "PY|America/Asuncion", "QA|Asia/Qatar", "RE|Indian/Reunion", "RO|Europe/Bucharest", "RS|Europe/Belgrade", "RU|Europe/Kaliningrad Europe/Moscow Europe/Simferopol Europe/Kirov Europe/Astrakhan Europe/Volgograd Europe/Saratov Europe/Ulyanovsk Europe/Samara Asia/Yekaterinburg Asia/Omsk Asia/Novosibirsk Asia/Barnaul Asia/Tomsk Asia/Novokuznetsk Asia/Krasnoyarsk Asia/Irkutsk Asia/Chita Asia/Yakutsk Asia/Khandyga Asia/Vladivostok Asia/Ust-Nera Asia/Magadan Asia/Sakhalin Asia/Srednekolymsk Asia/Kamchatka Asia/Anadyr", "RW|Africa/Maputo Africa/Kigali", "SA|Asia/Riyadh", "SB|Pacific/Guadalcanal", "SC|Indian/Mahe", "SD|Africa/Khartoum", "SE|Europe/Stockholm", "SG|Asia/Singapore", "SH|Africa/Abidjan Atlantic/St_Helena", "SI|Europe/Belgrade Europe/Ljubljana", "SJ|Europe/Oslo Arctic/Longyearbyen", "SK|Europe/Prague Europe/Bratislava", "SL|Africa/Abidjan Africa/Freetown", "SM|Europe/Rome Europe/San_Marino", "SN|Africa/Abidjan Africa/Dakar", "SO|Africa/Nairobi Africa/Mogadishu", "SR|America/Paramaribo", "SS|Africa/Juba", "ST|Africa/Sao_Tome", "SV|America/El_Salvador", "SX|America/Curacao America/Lower_Princes", "SY|Asia/Damascus", "SZ|Africa/Johannesburg Africa/Mbabane", "TC|America/Grand_Turk", "TD|Africa/Ndjamena", "TF|Indian/Reunion Indian/Kerguelen", "TG|Africa/Abidjan Africa/Lome", "TH|Asia/Bangkok", "TJ|Asia/Dushanbe", "TK|Pacific/Fakaofo", "TL|Asia/Dili", "TM|Asia/Ashgabat", "TN|Africa/Tunis", "TO|Pacific/Tongatapu", "TR|Europe/Istanbul", "TT|America/Port_of_Spain", "TV|Pacific/Funafuti", "TW|Asia/Taipei", "TZ|Africa/Nairobi Africa/Dar_es_Salaam", "UA|Europe/Simferopol Europe/Kiev Europe/Uzhgorod Europe/Zaporozhye", "UG|Africa/Nairobi Africa/Kampala", "UM|Pacific/Pago_Pago Pacific/Wake Pacific/Honolulu Pacific/Midway", "US|America/New_York America/Detroit America/Kentucky/Louisville America/Kentucky/Monticello America/Indiana/Indianapolis America/Indiana/Vincennes America/Indiana/Winamac America/Indiana/Marengo America/Indiana/Petersburg America/Indiana/Vevay America/Chicago America/Indiana/Tell_City America/Indiana/Knox America/Menominee America/North_Dakota/Center America/North_Dakota/New_Salem America/North_Dakota/Beulah America/Denver America/Boise America/Phoenix America/Los_Angeles America/Anchorage America/Juneau America/Sitka America/Metlakatla America/Yakutat America/Nome America/Adak Pacific/Honolulu", "UY|America/Montevideo", "UZ|Asia/Samarkand Asia/Tashkent", "VA|Europe/Rome Europe/Vatican", "VC|America/Port_of_Spain America/St_Vincent", "VE|America/Caracas", "VG|America/Port_of_Spain America/Tortola", "VI|America/Port_of_Spain America/St_Thomas", "VN|Asia/Bangkok Asia/Ho_Chi_Minh", "VU|Pacific/Efate", "WF|Pacific/Wallis", "WS|Pacific/Apia", "YE|Asia/Riyadh Asia/Aden", "YT|Africa/Nairobi Indian/Mayotte", "ZA|Africa/Johannesburg", "ZM|Africa/Maputo Africa/Lusaka", "ZW|Africa/Maputo Africa/Harare"]
    }), e
});