/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 50);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isValue = __webpack_require__(5);

module.exports = function (value) {
	if (!isValue(value)) throw new TypeError("Cannot use null or undefined");
	return value;
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (fn) {
	if (typeof fn !== "function") throw new TypeError(fn + " is not a function");
	return fn;
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var symbol_observable_1 = __webpack_require__(104);
var NO = {};
exports.NO = NO;
function noop() { }
function cp(a) {
    var l = a.length;
    var b = Array(l);
    for (var i = 0; i < l; ++i)
        b[i] = a[i];
    return b;
}
function and(f1, f2) {
    return function andFn(t) {
        return f1(t) && f2(t);
    };
}
function _try(c, t, u) {
    try {
        return c.f(t);
    }
    catch (e) {
        u._e(e);
        return NO;
    }
}
var NO_IL = {
    _n: noop,
    _e: noop,
    _c: noop,
};
exports.NO_IL = NO_IL;
// mutates the input
function internalizeProducer(producer) {
    producer._start = function _start(il) {
        il.next = il._n;
        il.error = il._e;
        il.complete = il._c;
        this.start(il);
    };
    producer._stop = producer.stop;
}
var StreamSub = (function () {
    function StreamSub(_stream, _listener) {
        this._stream = _stream;
        this._listener = _listener;
    }
    StreamSub.prototype.unsubscribe = function () {
        this._stream.removeListener(this._listener);
    };
    return StreamSub;
}());
var Observer = (function () {
    function Observer(_listener) {
        this._listener = _listener;
    }
    Observer.prototype.next = function (value) {
        this._listener._n(value);
    };
    Observer.prototype.error = function (err) {
        this._listener._e(err);
    };
    Observer.prototype.complete = function () {
        this._listener._c();
    };
    return Observer;
}());
var FromObservable = (function () {
    function FromObservable(observable) {
        this.type = 'fromObservable';
        this.ins = observable;
        this.active = false;
    }
    FromObservable.prototype._start = function (out) {
        this.out = out;
        this.active = true;
        this._sub = this.ins.subscribe(new Observer(out));
        if (!this.active)
            this._sub.unsubscribe();
    };
    FromObservable.prototype._stop = function () {
        if (this._sub)
            this._sub.unsubscribe();
        this.active = false;
    };
    return FromObservable;
}());
var Merge = (function () {
    function Merge(insArr) {
        this.type = 'merge';
        this.insArr = insArr;
        this.out = NO;
        this.ac = 0;
    }
    Merge.prototype._start = function (out) {
        this.out = out;
        var s = this.insArr;
        var L = s.length;
        this.ac = L;
        for (var i = 0; i < L; i++)
            s[i]._add(this);
    };
    Merge.prototype._stop = function () {
        var s = this.insArr;
        var L = s.length;
        for (var i = 0; i < L; i++)
            s[i]._remove(this);
        this.out = NO;
    };
    Merge.prototype._n = function (t) {
        var u = this.out;
        if (u === NO)
            return;
        u._n(t);
    };
    Merge.prototype._e = function (err) {
        var u = this.out;
        if (u === NO)
            return;
        u._e(err);
    };
    Merge.prototype._c = function () {
        if (--this.ac <= 0) {
            var u = this.out;
            if (u === NO)
                return;
            u._c();
        }
    };
    return Merge;
}());
var CombineListener = (function () {
    function CombineListener(i, out, p) {
        this.i = i;
        this.out = out;
        this.p = p;
        p.ils.push(this);
    }
    CombineListener.prototype._n = function (t) {
        var p = this.p, out = this.out;
        if (out === NO)
            return;
        if (p.up(t, this.i)) {
            var a = p.vals;
            var l = a.length;
            var b = Array(l);
            for (var i = 0; i < l; ++i)
                b[i] = a[i];
            out._n(b);
        }
    };
    CombineListener.prototype._e = function (err) {
        var out = this.out;
        if (out === NO)
            return;
        out._e(err);
    };
    CombineListener.prototype._c = function () {
        var p = this.p;
        if (p.out === NO)
            return;
        if (--p.Nc === 0)
            p.out._c();
    };
    return CombineListener;
}());
var Combine = (function () {
    function Combine(insArr) {
        this.type = 'combine';
        this.insArr = insArr;
        this.out = NO;
        this.ils = [];
        this.Nc = this.Nn = 0;
        this.vals = [];
    }
    Combine.prototype.up = function (t, i) {
        var v = this.vals[i];
        var Nn = !this.Nn ? 0 : v === NO ? --this.Nn : this.Nn;
        this.vals[i] = t;
        return Nn === 0;
    };
    Combine.prototype._start = function (out) {
        this.out = out;
        var s = this.insArr;
        var n = this.Nc = this.Nn = s.length;
        var vals = this.vals = new Array(n);
        if (n === 0) {
            out._n([]);
            out._c();
        }
        else {
            for (var i = 0; i < n; i++) {
                vals[i] = NO;
                s[i]._add(new CombineListener(i, out, this));
            }
        }
    };
    Combine.prototype._stop = function () {
        var s = this.insArr;
        var n = s.length;
        var ils = this.ils;
        for (var i = 0; i < n; i++)
            s[i]._remove(ils[i]);
        this.out = NO;
        this.ils = [];
        this.vals = [];
    };
    return Combine;
}());
var FromArray = (function () {
    function FromArray(a) {
        this.type = 'fromArray';
        this.a = a;
    }
    FromArray.prototype._start = function (out) {
        var a = this.a;
        for (var i = 0, n = a.length; i < n; i++)
            out._n(a[i]);
        out._c();
    };
    FromArray.prototype._stop = function () {
    };
    return FromArray;
}());
var FromPromise = (function () {
    function FromPromise(p) {
        this.type = 'fromPromise';
        this.on = false;
        this.p = p;
    }
    FromPromise.prototype._start = function (out) {
        var prod = this;
        this.on = true;
        this.p.then(function (v) {
            if (prod.on) {
                out._n(v);
                out._c();
            }
        }, function (e) {
            out._e(e);
        }).then(noop, function (err) {
            setTimeout(function () { throw err; });
        });
    };
    FromPromise.prototype._stop = function () {
        this.on = false;
    };
    return FromPromise;
}());
var Periodic = (function () {
    function Periodic(period) {
        this.type = 'periodic';
        this.period = period;
        this.intervalID = -1;
        this.i = 0;
    }
    Periodic.prototype._start = function (out) {
        var self = this;
        function intervalHandler() { out._n(self.i++); }
        this.intervalID = setInterval(intervalHandler, this.period);
    };
    Periodic.prototype._stop = function () {
        if (this.intervalID !== -1)
            clearInterval(this.intervalID);
        this.intervalID = -1;
        this.i = 0;
    };
    return Periodic;
}());
var Debug = (function () {
    function Debug(ins, arg) {
        this.type = 'debug';
        this.ins = ins;
        this.out = NO;
        this.s = noop;
        this.l = '';
        if (typeof arg === 'string')
            this.l = arg;
        else if (typeof arg === 'function')
            this.s = arg;
    }
    Debug.prototype._start = function (out) {
        this.out = out;
        this.ins._add(this);
    };
    Debug.prototype._stop = function () {
        this.ins._remove(this);
        this.out = NO;
    };
    Debug.prototype._n = function (t) {
        var u = this.out;
        if (u === NO)
            return;
        var s = this.s, l = this.l;
        if (s !== noop) {
            try {
                s(t);
            }
            catch (e) {
                u._e(e);
            }
        }
        else if (l)
            console.log(l + ':', t);
        else
            console.log(t);
        u._n(t);
    };
    Debug.prototype._e = function (err) {
        var u = this.out;
        if (u === NO)
            return;
        u._e(err);
    };
    Debug.prototype._c = function () {
        var u = this.out;
        if (u === NO)
            return;
        u._c();
    };
    return Debug;
}());
var Drop = (function () {
    function Drop(max, ins) {
        this.type = 'drop';
        this.ins = ins;
        this.out = NO;
        this.max = max;
        this.dropped = 0;
    }
    Drop.prototype._start = function (out) {
        this.out = out;
        this.dropped = 0;
        this.ins._add(this);
    };
    Drop.prototype._stop = function () {
        this.ins._remove(this);
        this.out = NO;
    };
    Drop.prototype._n = function (t) {
        var u = this.out;
        if (u === NO)
            return;
        if (this.dropped++ >= this.max)
            u._n(t);
    };
    Drop.prototype._e = function (err) {
        var u = this.out;
        if (u === NO)
            return;
        u._e(err);
    };
    Drop.prototype._c = function () {
        var u = this.out;
        if (u === NO)
            return;
        u._c();
    };
    return Drop;
}());
var EndWhenListener = (function () {
    function EndWhenListener(out, op) {
        this.out = out;
        this.op = op;
    }
    EndWhenListener.prototype._n = function () {
        this.op.end();
    };
    EndWhenListener.prototype._e = function (err) {
        this.out._e(err);
    };
    EndWhenListener.prototype._c = function () {
        this.op.end();
    };
    return EndWhenListener;
}());
var EndWhen = (function () {
    function EndWhen(o, ins) {
        this.type = 'endWhen';
        this.ins = ins;
        this.out = NO;
        this.o = o;
        this.oil = NO_IL;
    }
    EndWhen.prototype._start = function (out) {
        this.out = out;
        this.o._add(this.oil = new EndWhenListener(out, this));
        this.ins._add(this);
    };
    EndWhen.prototype._stop = function () {
        this.ins._remove(this);
        this.o._remove(this.oil);
        this.out = NO;
        this.oil = NO_IL;
    };
    EndWhen.prototype.end = function () {
        var u = this.out;
        if (u === NO)
            return;
        u._c();
    };
    EndWhen.prototype._n = function (t) {
        var u = this.out;
        if (u === NO)
            return;
        u._n(t);
    };
    EndWhen.prototype._e = function (err) {
        var u = this.out;
        if (u === NO)
            return;
        u._e(err);
    };
    EndWhen.prototype._c = function () {
        this.end();
    };
    return EndWhen;
}());
var Filter = (function () {
    function Filter(passes, ins) {
        this.type = 'filter';
        this.ins = ins;
        this.out = NO;
        this.f = passes;
    }
    Filter.prototype._start = function (out) {
        this.out = out;
        this.ins._add(this);
    };
    Filter.prototype._stop = function () {
        this.ins._remove(this);
        this.out = NO;
    };
    Filter.prototype._n = function (t) {
        var u = this.out;
        if (u === NO)
            return;
        var r = _try(this, t, u);
        if (r === NO || !r)
            return;
        u._n(t);
    };
    Filter.prototype._e = function (err) {
        var u = this.out;
        if (u === NO)
            return;
        u._e(err);
    };
    Filter.prototype._c = function () {
        var u = this.out;
        if (u === NO)
            return;
        u._c();
    };
    return Filter;
}());
var FlattenListener = (function () {
    function FlattenListener(out, op) {
        this.out = out;
        this.op = op;
    }
    FlattenListener.prototype._n = function (t) {
        this.out._n(t);
    };
    FlattenListener.prototype._e = function (err) {
        this.out._e(err);
    };
    FlattenListener.prototype._c = function () {
        this.op.inner = NO;
        this.op.less();
    };
    return FlattenListener;
}());
var Flatten = (function () {
    function Flatten(ins) {
        this.type = 'flatten';
        this.ins = ins;
        this.out = NO;
        this.open = true;
        this.inner = NO;
        this.il = NO_IL;
    }
    Flatten.prototype._start = function (out) {
        this.out = out;
        this.open = true;
        this.inner = NO;
        this.il = NO_IL;
        this.ins._add(this);
    };
    Flatten.prototype._stop = function () {
        this.ins._remove(this);
        if (this.inner !== NO)
            this.inner._remove(this.il);
        this.out = NO;
        this.open = true;
        this.inner = NO;
        this.il = NO_IL;
    };
    Flatten.prototype.less = function () {
        var u = this.out;
        if (u === NO)
            return;
        if (!this.open && this.inner === NO)
            u._c();
    };
    Flatten.prototype._n = function (s) {
        var u = this.out;
        if (u === NO)
            return;
        var _a = this, inner = _a.inner, il = _a.il;
        if (inner !== NO && il !== NO_IL)
            inner._remove(il);
        (this.inner = s)._add(this.il = new FlattenListener(u, this));
    };
    Flatten.prototype._e = function (err) {
        var u = this.out;
        if (u === NO)
            return;
        u._e(err);
    };
    Flatten.prototype._c = function () {
        this.open = false;
        this.less();
    };
    return Flatten;
}());
var Fold = (function () {
    function Fold(f, seed, ins) {
        var _this = this;
        this.type = 'fold';
        this.ins = ins;
        this.out = NO;
        this.f = function (t) { return f(_this.acc, t); };
        this.acc = this.seed = seed;
    }
    Fold.prototype._start = function (out) {
        this.out = out;
        this.acc = this.seed;
        out._n(this.acc);
        this.ins._add(this);
    };
    Fold.prototype._stop = function () {
        this.ins._remove(this);
        this.out = NO;
        this.acc = this.seed;
    };
    Fold.prototype._n = function (t) {
        var u = this.out;
        if (u === NO)
            return;
        var r = _try(this, t, u);
        if (r === NO)
            return;
        u._n(this.acc = r);
    };
    Fold.prototype._e = function (err) {
        var u = this.out;
        if (u === NO)
            return;
        u._e(err);
    };
    Fold.prototype._c = function () {
        var u = this.out;
        if (u === NO)
            return;
        u._c();
    };
    return Fold;
}());
var Last = (function () {
    function Last(ins) {
        this.type = 'last';
        this.ins = ins;
        this.out = NO;
        this.has = false;
        this.val = NO;
    }
    Last.prototype._start = function (out) {
        this.out = out;
        this.has = false;
        this.ins._add(this);
    };
    Last.prototype._stop = function () {
        this.ins._remove(this);
        this.out = NO;
        this.val = NO;
    };
    Last.prototype._n = function (t) {
        this.has = true;
        this.val = t;
    };
    Last.prototype._e = function (err) {
        var u = this.out;
        if (u === NO)
            return;
        u._e(err);
    };
    Last.prototype._c = function () {
        var u = this.out;
        if (u === NO)
            return;
        if (this.has) {
            u._n(this.val);
            u._c();
        }
        else
            u._e(new Error('last() failed because input stream completed'));
    };
    return Last;
}());
var MapOp = (function () {
    function MapOp(project, ins) {
        this.type = 'map';
        this.ins = ins;
        this.out = NO;
        this.f = project;
    }
    MapOp.prototype._start = function (out) {
        this.out = out;
        this.ins._add(this);
    };
    MapOp.prototype._stop = function () {
        this.ins._remove(this);
        this.out = NO;
    };
    MapOp.prototype._n = function (t) {
        var u = this.out;
        if (u === NO)
            return;
        var r = _try(this, t, u);
        if (r === NO)
            return;
        u._n(r);
    };
    MapOp.prototype._e = function (err) {
        var u = this.out;
        if (u === NO)
            return;
        u._e(err);
    };
    MapOp.prototype._c = function () {
        var u = this.out;
        if (u === NO)
            return;
        u._c();
    };
    return MapOp;
}());
var Remember = (function () {
    function Remember(ins) {
        this.type = 'remember';
        this.ins = ins;
        this.out = NO;
    }
    Remember.prototype._start = function (out) {
        this.out = out;
        this.ins._add(out);
    };
    Remember.prototype._stop = function () {
        this.ins._remove(this.out);
        this.out = NO;
    };
    return Remember;
}());
var ReplaceError = (function () {
    function ReplaceError(replacer, ins) {
        this.type = 'replaceError';
        this.ins = ins;
        this.out = NO;
        this.f = replacer;
    }
    ReplaceError.prototype._start = function (out) {
        this.out = out;
        this.ins._add(this);
    };
    ReplaceError.prototype._stop = function () {
        this.ins._remove(this);
        this.out = NO;
    };
    ReplaceError.prototype._n = function (t) {
        var u = this.out;
        if (u === NO)
            return;
        u._n(t);
    };
    ReplaceError.prototype._e = function (err) {
        var u = this.out;
        if (u === NO)
            return;
        try {
            this.ins._remove(this);
            (this.ins = this.f(err))._add(this);
        }
        catch (e) {
            u._e(e);
        }
    };
    ReplaceError.prototype._c = function () {
        var u = this.out;
        if (u === NO)
            return;
        u._c();
    };
    return ReplaceError;
}());
var StartWith = (function () {
    function StartWith(ins, val) {
        this.type = 'startWith';
        this.ins = ins;
        this.out = NO;
        this.val = val;
    }
    StartWith.prototype._start = function (out) {
        this.out = out;
        this.out._n(this.val);
        this.ins._add(out);
    };
    StartWith.prototype._stop = function () {
        this.ins._remove(this.out);
        this.out = NO;
    };
    return StartWith;
}());
var Take = (function () {
    function Take(max, ins) {
        this.type = 'take';
        this.ins = ins;
        this.out = NO;
        this.max = max;
        this.taken = 0;
    }
    Take.prototype._start = function (out) {
        this.out = out;
        this.taken = 0;
        if (this.max <= 0)
            out._c();
        else
            this.ins._add(this);
    };
    Take.prototype._stop = function () {
        this.ins._remove(this);
        this.out = NO;
    };
    Take.prototype._n = function (t) {
        var u = this.out;
        if (u === NO)
            return;
        var m = ++this.taken;
        if (m < this.max)
            u._n(t);
        else if (m === this.max) {
            u._n(t);
            u._c();
        }
    };
    Take.prototype._e = function (err) {
        var u = this.out;
        if (u === NO)
            return;
        u._e(err);
    };
    Take.prototype._c = function () {
        var u = this.out;
        if (u === NO)
            return;
        u._c();
    };
    return Take;
}());
var Stream = (function () {
    function Stream(producer) {
        this._prod = producer || NO;
        this._ils = [];
        this._stopID = NO;
        this._dl = NO;
        this._d = false;
        this._target = NO;
        this._err = NO;
    }
    Stream.prototype._n = function (t) {
        var a = this._ils;
        var L = a.length;
        if (this._d)
            this._dl._n(t);
        if (L == 1)
            a[0]._n(t);
        else if (L == 0)
            return;
        else {
            var b = cp(a);
            for (var i = 0; i < L; i++)
                b[i]._n(t);
        }
    };
    Stream.prototype._e = function (err) {
        if (this._err !== NO)
            return;
        this._err = err;
        var a = this._ils;
        var L = a.length;
        this._x();
        if (this._d)
            this._dl._e(err);
        if (L == 1)
            a[0]._e(err);
        else if (L == 0)
            return;
        else {
            var b = cp(a);
            for (var i = 0; i < L; i++)
                b[i]._e(err);
        }
        if (!this._d && L == 0)
            throw this._err;
    };
    Stream.prototype._c = function () {
        var a = this._ils;
        var L = a.length;
        this._x();
        if (this._d)
            this._dl._c();
        if (L == 1)
            a[0]._c();
        else if (L == 0)
            return;
        else {
            var b = cp(a);
            for (var i = 0; i < L; i++)
                b[i]._c();
        }
    };
    Stream.prototype._x = function () {
        if (this._ils.length === 0)
            return;
        if (this._prod !== NO)
            this._prod._stop();
        this._err = NO;
        this._ils = [];
    };
    Stream.prototype._stopNow = function () {
        // WARNING: code that calls this method should
        // first check if this._prod is valid (not `NO`)
        this._prod._stop();
        this._err = NO;
        this._stopID = NO;
    };
    Stream.prototype._add = function (il) {
        var ta = this._target;
        if (ta !== NO)
            return ta._add(il);
        var a = this._ils;
        a.push(il);
        if (a.length > 1)
            return;
        if (this._stopID !== NO) {
            clearTimeout(this._stopID);
            this._stopID = NO;
        }
        else {
            var p = this._prod;
            if (p !== NO)
                p._start(this);
        }
    };
    Stream.prototype._remove = function (il) {
        var _this = this;
        var ta = this._target;
        if (ta !== NO)
            return ta._remove(il);
        var a = this._ils;
        var i = a.indexOf(il);
        if (i > -1) {
            a.splice(i, 1);
            if (this._prod !== NO && a.length <= 0) {
                this._err = NO;
                this._stopID = setTimeout(function () { return _this._stopNow(); });
            }
            else if (a.length === 1) {
                this._pruneCycles();
            }
        }
    };
    // If all paths stemming from `this` stream eventually end at `this`
    // stream, then we remove the single listener of `this` stream, to
    // force it to end its execution and dispose resources. This method
    // assumes as a precondition that this._ils has just one listener.
    Stream.prototype._pruneCycles = function () {
        if (this._hasNoSinks(this, []))
            this._remove(this._ils[0]);
    };
    // Checks whether *there is no* path starting from `x` that leads to an end
    // listener (sink) in the stream graph, following edges A->B where B is a
    // listener of A. This means these paths constitute a cycle somehow. Is given
    // a trace of all visited nodes so far.
    Stream.prototype._hasNoSinks = function (x, trace) {
        if (trace.indexOf(x) !== -1)
            return true;
        else if (x.out === this)
            return true;
        else if (x.out && x.out !== NO)
            return this._hasNoSinks(x.out, trace.concat(x));
        else if (x._ils) {
            for (var i = 0, N = x._ils.length; i < N; i++)
                if (!this._hasNoSinks(x._ils[i], trace.concat(x)))
                    return false;
            return true;
        }
        else
            return false;
    };
    Stream.prototype.ctor = function () {
        return this instanceof MemoryStream ? MemoryStream : Stream;
    };
    /**
     * Adds a Listener to the Stream.
     *
     * @param {Listener} listener
     */
    Stream.prototype.addListener = function (listener) {
        listener._n = listener.next || noop;
        listener._e = listener.error || noop;
        listener._c = listener.complete || noop;
        this._add(listener);
    };
    /**
     * Removes a Listener from the Stream, assuming the Listener was added to it.
     *
     * @param {Listener<T>} listener
     */
    Stream.prototype.removeListener = function (listener) {
        this._remove(listener);
    };
    /**
     * Adds a Listener to the Stream returning a Subscription to remove that
     * listener.
     *
     * @param {Listener} listener
     * @returns {Subscription}
     */
    Stream.prototype.subscribe = function (listener) {
        this.addListener(listener);
        return new StreamSub(this, listener);
    };
    /**
     * Add interop between most.js and RxJS 5
     *
     * @returns {Stream}
     */
    Stream.prototype[symbol_observable_1.default] = function () {
        return this;
    };
    /**
     * Creates a new Stream given a Producer.
     *
     * @factory true
     * @param {Producer} producer An optional Producer that dictates how to
     * start, generate events, and stop the Stream.
     * @return {Stream}
     */
    Stream.create = function (producer) {
        if (producer) {
            if (typeof producer.start !== 'function'
                || typeof producer.stop !== 'function')
                throw new Error('producer requires both start and stop functions');
            internalizeProducer(producer); // mutates the input
        }
        return new Stream(producer);
    };
    /**
     * Creates a new MemoryStream given a Producer.
     *
     * @factory true
     * @param {Producer} producer An optional Producer that dictates how to
     * start, generate events, and stop the Stream.
     * @return {MemoryStream}
     */
    Stream.createWithMemory = function (producer) {
        if (producer)
            internalizeProducer(producer); // mutates the input
        return new MemoryStream(producer);
    };
    /**
     * Creates a Stream that does nothing when started. It never emits any event.
     *
     * Marble diagram:
     *
     * ```text
     *          never
     * -----------------------
     * ```
     *
     * @factory true
     * @return {Stream}
     */
    Stream.never = function () {
        return new Stream({ _start: noop, _stop: noop });
    };
    /**
     * Creates a Stream that immediately emits the "complete" notification when
     * started, and that's it.
     *
     * Marble diagram:
     *
     * ```text
     * empty
     * -|
     * ```
     *
     * @factory true
     * @return {Stream}
     */
    Stream.empty = function () {
        return new Stream({
            _start: function (il) { il._c(); },
            _stop: noop,
        });
    };
    /**
     * Creates a Stream that immediately emits an "error" notification with the
     * value you passed as the `error` argument when the stream starts, and that's
     * it.
     *
     * Marble diagram:
     *
     * ```text
     * throw(X)
     * -X
     * ```
     *
     * @factory true
     * @param error The error event to emit on the created stream.
     * @return {Stream}
     */
    Stream.throw = function (error) {
        return new Stream({
            _start: function (il) { il._e(error); },
            _stop: noop,
        });
    };
    /**
     * Creates a stream from an Array, Promise, or an Observable.
     *
     * @factory true
     * @param {Array|PromiseLike|Observable} input The input to make a stream from.
     * @return {Stream}
     */
    Stream.from = function (input) {
        if (typeof input[symbol_observable_1.default] === 'function')
            return Stream.fromObservable(input);
        else if (typeof input.then === 'function')
            return Stream.fromPromise(input);
        else if (Array.isArray(input))
            return Stream.fromArray(input);
        throw new TypeError("Type of input to from() must be an Array, Promise, or Observable");
    };
    /**
     * Creates a Stream that immediately emits the arguments that you give to
     * *of*, then completes.
     *
     * Marble diagram:
     *
     * ```text
     * of(1,2,3)
     * 123|
     * ```
     *
     * @factory true
     * @param a The first value you want to emit as an event on the stream.
     * @param b The second value you want to emit as an event on the stream. One
     * or more of these values may be given as arguments.
     * @return {Stream}
     */
    Stream.of = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        return Stream.fromArray(items);
    };
    /**
     * Converts an array to a stream. The returned stream will emit synchronously
     * all the items in the array, and then complete.
     *
     * Marble diagram:
     *
     * ```text
     * fromArray([1,2,3])
     * 123|
     * ```
     *
     * @factory true
     * @param {Array} array The array to be converted as a stream.
     * @return {Stream}
     */
    Stream.fromArray = function (array) {
        return new Stream(new FromArray(array));
    };
    /**
     * Converts a promise to a stream. The returned stream will emit the resolved
     * value of the promise, and then complete. However, if the promise is
     * rejected, the stream will emit the corresponding error.
     *
     * Marble diagram:
     *
     * ```text
     * fromPromise( ----42 )
     * -----------------42|
     * ```
     *
     * @factory true
     * @param {PromiseLike} promise The promise to be converted as a stream.
     * @return {Stream}
     */
    Stream.fromPromise = function (promise) {
        return new Stream(new FromPromise(promise));
    };
    /**
     * Converts an Observable into a Stream.
     *
     * @factory true
     * @param {any} observable The observable to be converted as a stream.
     * @return {Stream}
     */
    Stream.fromObservable = function (obs) {
        if (obs.endWhen)
            return obs;
        return new Stream(new FromObservable(obs));
    };
    /**
     * Creates a stream that periodically emits incremental numbers, every
     * `period` milliseconds.
     *
     * Marble diagram:
     *
     * ```text
     *     periodic(1000)
     * ---0---1---2---3---4---...
     * ```
     *
     * @factory true
     * @param {number} period The interval in milliseconds to use as a rate of
     * emission.
     * @return {Stream}
     */
    Stream.periodic = function (period) {
        return new Stream(new Periodic(period));
    };
    Stream.prototype._map = function (project) {
        return new (this.ctor())(new MapOp(project, this));
    };
    /**
     * Transforms each event from the input Stream through a `project` function,
     * to get a Stream that emits those transformed events.
     *
     * Marble diagram:
     *
     * ```text
     * --1---3--5-----7------
     *    map(i => i * 10)
     * --10--30-50----70-----
     * ```
     *
     * @param {Function} project A function of type `(t: T) => U` that takes event
     * `t` of type `T` from the input Stream and produces an event of type `U`, to
     * be emitted on the output Stream.
     * @return {Stream}
     */
    Stream.prototype.map = function (project) {
        return this._map(project);
    };
    /**
     * It's like `map`, but transforms each input event to always the same
     * constant value on the output Stream.
     *
     * Marble diagram:
     *
     * ```text
     * --1---3--5-----7-----
     *       mapTo(10)
     * --10--10-10----10----
     * ```
     *
     * @param projectedValue A value to emit on the output Stream whenever the
     * input Stream emits any value.
     * @return {Stream}
     */
    Stream.prototype.mapTo = function (projectedValue) {
        var s = this.map(function () { return projectedValue; });
        var op = s._prod;
        op.type = 'mapTo';
        return s;
    };
    /**
     * Only allows events that pass the test given by the `passes` argument.
     *
     * Each event from the input stream is given to the `passes` function. If the
     * function returns `true`, the event is forwarded to the output stream,
     * otherwise it is ignored and not forwarded.
     *
     * Marble diagram:
     *
     * ```text
     * --1---2--3-----4-----5---6--7-8--
     *     filter(i => i % 2 === 0)
     * ------2--------4---------6----8--
     * ```
     *
     * @param {Function} passes A function of type `(t: T) +> boolean` that takes
     * an event from the input stream and checks if it passes, by returning a
     * boolean.
     * @return {Stream}
     */
    Stream.prototype.filter = function (passes) {
        var p = this._prod;
        if (p instanceof Filter)
            return new Stream(new Filter(and(p.f, passes), p.ins));
        return new Stream(new Filter(passes, this));
    };
    /**
     * Lets the first `amount` many events from the input stream pass to the
     * output stream, then makes the output stream complete.
     *
     * Marble diagram:
     *
     * ```text
     * --a---b--c----d---e--
     *    take(3)
     * --a---b--c|
     * ```
     *
     * @param {number} amount How many events to allow from the input stream
     * before completing the output stream.
     * @return {Stream}
     */
    Stream.prototype.take = function (amount) {
        return new (this.ctor())(new Take(amount, this));
    };
    /**
     * Ignores the first `amount` many events from the input stream, and then
     * after that starts forwarding events from the input stream to the output
     * stream.
     *
     * Marble diagram:
     *
     * ```text
     * --a---b--c----d---e--
     *       drop(3)
     * --------------d---e--
     * ```
     *
     * @param {number} amount How many events to ignore from the input stream
     * before forwarding all events from the input stream to the output stream.
     * @return {Stream}
     */
    Stream.prototype.drop = function (amount) {
        return new Stream(new Drop(amount, this));
    };
    /**
     * When the input stream completes, the output stream will emit the last event
     * emitted by the input stream, and then will also complete.
     *
     * Marble diagram:
     *
     * ```text
     * --a---b--c--d----|
     *       last()
     * -----------------d|
     * ```
     *
     * @return {Stream}
     */
    Stream.prototype.last = function () {
        return new Stream(new Last(this));
    };
    /**
     * Prepends the given `initial` value to the sequence of events emitted by the
     * input stream. The returned stream is a MemoryStream, which means it is
     * already `remember()`'d.
     *
     * Marble diagram:
     *
     * ```text
     * ---1---2-----3---
     *   startWith(0)
     * 0--1---2-----3---
     * ```
     *
     * @param initial The value or event to prepend.
     * @return {MemoryStream}
     */
    Stream.prototype.startWith = function (initial) {
        return new MemoryStream(new StartWith(this, initial));
    };
    /**
     * Uses another stream to determine when to complete the current stream.
     *
     * When the given `other` stream emits an event or completes, the output
     * stream will complete. Before that happens, the output stream will behaves
     * like the input stream.
     *
     * Marble diagram:
     *
     * ```text
     * ---1---2-----3--4----5----6---
     *   endWhen( --------a--b--| )
     * ---1---2-----3--4--|
     * ```
     *
     * @param other Some other stream that is used to know when should the output
     * stream of this operator complete.
     * @return {Stream}
     */
    Stream.prototype.endWhen = function (other) {
        return new (this.ctor())(new EndWhen(other, this));
    };
    /**
     * "Folds" the stream onto itself.
     *
     * Combines events from the past throughout
     * the entire execution of the input stream, allowing you to accumulate them
     * together. It's essentially like `Array.prototype.reduce`. The returned
     * stream is a MemoryStream, which means it is already `remember()`'d.
     *
     * The output stream starts by emitting the `seed` which you give as argument.
     * Then, when an event happens on the input stream, it is combined with that
     * seed value through the `accumulate` function, and the output value is
     * emitted on the output stream. `fold` remembers that output value as `acc`
     * ("accumulator"), and then when a new input event `t` happens, `acc` will be
     * combined with that to produce the new `acc` and so forth.
     *
     * Marble diagram:
     *
     * ```text
     * ------1-----1--2----1----1------
     *   fold((acc, x) => acc + x, 3)
     * 3-----4-----5--7----8----9------
     * ```
     *
     * @param {Function} accumulate A function of type `(acc: R, t: T) => R` that
     * takes the previous accumulated value `acc` and the incoming event from the
     * input stream and produces the new accumulated value.
     * @param seed The initial accumulated value, of type `R`.
     * @return {MemoryStream}
     */
    Stream.prototype.fold = function (accumulate, seed) {
        return new MemoryStream(new Fold(accumulate, seed, this));
    };
    /**
     * Replaces an error with another stream.
     *
     * When (and if) an error happens on the input stream, instead of forwarding
     * that error to the output stream, *replaceError* will call the `replace`
     * function which returns the stream that the output stream will replicate.
     * And, in case that new stream also emits an error, `replace` will be called
     * again to get another stream to start replicating.
     *
     * Marble diagram:
     *
     * ```text
     * --1---2-----3--4-----X
     *   replaceError( () => --10--| )
     * --1---2-----3--4--------10--|
     * ```
     *
     * @param {Function} replace A function of type `(err) => Stream` that takes
     * the error that occurred on the input stream or on the previous replacement
     * stream and returns a new stream. The output stream will behave like the
     * stream that this function returns.
     * @return {Stream}
     */
    Stream.prototype.replaceError = function (replace) {
        return new (this.ctor())(new ReplaceError(replace, this));
    };
    /**
     * Flattens a "stream of streams", handling only one nested stream at a time
     * (no concurrency).
     *
     * If the input stream is a stream that emits streams, then this operator will
     * return an output stream which is a flat stream: emits regular events. The
     * flattening happens without concurrency. It works like this: when the input
     * stream emits a nested stream, *flatten* will start imitating that nested
     * one. However, as soon as the next nested stream is emitted on the input
     * stream, *flatten* will forget the previous nested one it was imitating, and
     * will start imitating the new nested one.
     *
     * Marble diagram:
     *
     * ```text
     * --+--------+---------------
     *   \        \
     *    \       ----1----2---3--
     *    --a--b----c----d--------
     *           flatten
     * -----a--b------1----2---3--
     * ```
     *
     * @return {Stream}
     */
    Stream.prototype.flatten = function () {
        var p = this._prod;
        return new Stream(new Flatten(this));
    };
    /**
     * Passes the input stream to a custom operator, to produce an output stream.
     *
     * *compose* is a handy way of using an existing function in a chained style.
     * Instead of writing `outStream = f(inStream)` you can write
     * `outStream = inStream.compose(f)`.
     *
     * @param {function} operator A function that takes a stream as input and
     * returns a stream as well.
     * @return {Stream}
     */
    Stream.prototype.compose = function (operator) {
        return operator(this);
    };
    /**
     * Returns an output stream that behaves like the input stream, but also
     * remembers the most recent event that happens on the input stream, so that a
     * newly added listener will immediately receive that memorised event.
     *
     * @return {MemoryStream}
     */
    Stream.prototype.remember = function () {
        return new MemoryStream(new Remember(this));
    };
    /**
     * Returns an output stream that identically behaves like the input stream,
     * but also runs a `spy` function for each event, to help you debug your app.
     *
     * *debug* takes a `spy` function as argument, and runs that for each event
     * happening on the input stream. If you don't provide the `spy` argument,
     * then *debug* will just `console.log` each event. This helps you to
     * understand the flow of events through some operator chain.
     *
     * Please note that if the output stream has no listeners, then it will not
     * start, which means `spy` will never run because no actual event happens in
     * that case.
     *
     * Marble diagram:
     *
     * ```text
     * --1----2-----3-----4--
     *         debug
     * --1----2-----3-----4--
     * ```
     *
     * @param {function} labelOrSpy A string to use as the label when printing
     * debug information on the console, or a 'spy' function that takes an event
     * as argument, and does not need to return anything.
     * @return {Stream}
     */
    Stream.prototype.debug = function (labelOrSpy) {
        return new (this.ctor())(new Debug(this, labelOrSpy));
    };
    /**
     * *imitate* changes this current Stream to emit the same events that the
     * `other` given Stream does. This method returns nothing.
     *
     * This method exists to allow one thing: **circular dependency of streams**.
     * For instance, let's imagine that for some reason you need to create a
     * circular dependency where stream `first$` depends on stream `second$`
     * which in turn depends on `first$`:
     *
     * <!-- skip-example -->
     * ```js
     * import delay from 'xstream/extra/delay'
     *
     * var first$ = second$.map(x => x * 10).take(3);
     * var second$ = first$.map(x => x + 1).startWith(1).compose(delay(100));
     * ```
     *
     * However, that is invalid JavaScript, because `second$` is undefined
     * on the first line. This is how *imitate* can help solve it:
     *
     * ```js
     * import delay from 'xstream/extra/delay'
     *
     * var secondProxy$ = xs.create();
     * var first$ = secondProxy$.map(x => x * 10).take(3);
     * var second$ = first$.map(x => x + 1).startWith(1).compose(delay(100));
     * secondProxy$.imitate(second$);
     * ```
     *
     * We create `secondProxy$` before the others, so it can be used in the
     * declaration of `first$`. Then, after both `first$` and `second$` are
     * defined, we hook `secondProxy$` with `second$` with `imitate()` to tell
     * that they are "the same". `imitate` will not trigger the start of any
     * stream, it just binds `secondProxy$` and `second$` together.
     *
     * The following is an example where `imitate()` is important in Cycle.js
     * applications. A parent component contains some child components. A child
     * has an action stream which is given to the parent to define its state:
     *
     * <!-- skip-example -->
     * ```js
     * const childActionProxy$ = xs.create();
     * const parent = Parent({...sources, childAction$: childActionProxy$});
     * const childAction$ = parent.state$.map(s => s.child.action$).flatten();
     * childActionProxy$.imitate(childAction$);
     * ```
     *
     * Note, though, that **`imitate()` does not support MemoryStreams**. If we
     * would attempt to imitate a MemoryStream in a circular dependency, we would
     * either get a race condition (where the symptom would be "nothing happens")
     * or an infinite cyclic emission of values. It's useful to think about
     * MemoryStreams as cells in a spreadsheet. It doesn't make any sense to
     * define a spreadsheet cell `A1` with a formula that depends on `B1` and
     * cell `B1` defined with a formula that depends on `A1`.
     *
     * If you find yourself wanting to use `imitate()` with a
     * MemoryStream, you should rework your code around `imitate()` to use a
     * Stream instead. Look for the stream in the circular dependency that
     * represents an event stream, and that would be a candidate for creating a
     * proxy Stream which then imitates the target Stream.
     *
     * @param {Stream} target The other stream to imitate on the current one. Must
     * not be a MemoryStream.
     */
    Stream.prototype.imitate = function (target) {
        if (target instanceof MemoryStream)
            throw new Error('A MemoryStream was given to imitate(), but it only ' +
                'supports a Stream. Read more about this restriction here: ' +
                'https://github.com/staltz/xstream#faq');
        this._target = target;
        for (var ils = this._ils, N = ils.length, i = 0; i < N; i++)
            target._add(ils[i]);
        this._ils = [];
    };
    /**
     * Forces the Stream to emit the given value to its listeners.
     *
     * As the name indicates, if you use this, you are most likely doing something
     * The Wrong Way. Please try to understand the reactive way before using this
     * method. Use it only when you know what you are doing.
     *
     * @param value The "next" value you want to broadcast to all listeners of
     * this Stream.
     */
    Stream.prototype.shamefullySendNext = function (value) {
        this._n(value);
    };
    /**
     * Forces the Stream to emit the given error to its listeners.
     *
     * As the name indicates, if you use this, you are most likely doing something
     * The Wrong Way. Please try to understand the reactive way before using this
     * method. Use it only when you know what you are doing.
     *
     * @param {any} error The error you want to broadcast to all the listeners of
     * this Stream.
     */
    Stream.prototype.shamefullySendError = function (error) {
        this._e(error);
    };
    /**
     * Forces the Stream to emit the "completed" event to its listeners.
     *
     * As the name indicates, if you use this, you are most likely doing something
     * The Wrong Way. Please try to understand the reactive way before using this
     * method. Use it only when you know what you are doing.
     */
    Stream.prototype.shamefullySendComplete = function () {
        this._c();
    };
    /**
     * Adds a "debug" listener to the stream. There can only be one debug
     * listener, that's why this is 'setDebugListener'. To remove the debug
     * listener, just call setDebugListener(null).
     *
     * A debug listener is like any other listener. The only difference is that a
     * debug listener is "stealthy": its presence/absence does not trigger the
     * start/stop of the stream (or the producer inside the stream). This is
     * useful so you can inspect what is going on without changing the behavior
     * of the program. If you have an idle stream and you add a normal listener to
     * it, the stream will start executing. But if you set a debug listener on an
     * idle stream, it won't start executing (not until the first normal listener
     * is added).
     *
     * As the name indicates, we don't recommend using this method to build app
     * logic. In fact, in most cases the debug operator works just fine. Only use
     * this one if you know what you're doing.
     *
     * @param {Listener<T>} listener
     */
    Stream.prototype.setDebugListener = function (listener) {
        if (!listener) {
            this._d = false;
            this._dl = NO;
        }
        else {
            this._d = true;
            listener._n = listener.next || noop;
            listener._e = listener.error || noop;
            listener._c = listener.complete || noop;
            this._dl = listener;
        }
    };
    return Stream;
}());
/**
 * Blends multiple streams together, emitting events from all of them
 * concurrently.
 *
 * *merge* takes multiple streams as arguments, and creates a stream that
 * behaves like each of the argument streams, in parallel.
 *
 * Marble diagram:
 *
 * ```text
 * --1----2-----3--------4---
 * ----a-----b----c---d------
 *            merge
 * --1-a--2--b--3-c---d--4---
 * ```
 *
 * @factory true
 * @param {Stream} stream1 A stream to merge together with other streams.
 * @param {Stream} stream2 A stream to merge together with other streams. Two
 * or more streams may be given as arguments.
 * @return {Stream}
 */
Stream.merge = function merge() {
    var streams = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        streams[_i] = arguments[_i];
    }
    return new Stream(new Merge(streams));
};
/**
 * Combines multiple input streams together to return a stream whose events
 * are arrays that collect the latest events from each input stream.
 *
 * *combine* internally remembers the most recent event from each of the input
 * streams. When any of the input streams emits an event, that event together
 * with all the other saved events are combined into an array. That array will
 * be emitted on the output stream. It's essentially a way of joining together
 * the events from multiple streams.
 *
 * Marble diagram:
 *
 * ```text
 * --1----2-----3--------4---
 * ----a-----b-----c--d------
 *          combine
 * ----1a-2a-2b-3b-3c-3d-4d--
 * ```
 *
 * Note: to minimize garbage collection, *combine* uses the same array
 * instance for each emission.  If you need to compare emissions over time,
 * cache the values with `map` first:
 *
 * ```js
 * import pairwise from 'xstream/extra/pairwise'
 *
 * const stream1 = xs.of(1);
 * const stream2 = xs.of(2);
 *
 * xs.combine(stream1, stream2).map(
 *   combinedEmissions => ([ ...combinedEmissions ])
 * ).compose(pairwise)
 * ```
 *
 * @factory true
 * @param {Stream} stream1 A stream to combine together with other streams.
 * @param {Stream} stream2 A stream to combine together with other streams.
 * Multiple streams, not just two, may be given as arguments.
 * @return {Stream}
 */
Stream.combine = function combine() {
    var streams = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        streams[_i] = arguments[_i];
    }
    return new Stream(new Combine(streams));
};
exports.Stream = Stream;
var MemoryStream = (function (_super) {
    __extends(MemoryStream, _super);
    function MemoryStream(producer) {
        var _this = _super.call(this, producer) || this;
        _this._has = false;
        return _this;
    }
    MemoryStream.prototype._n = function (x) {
        this._v = x;
        this._has = true;
        _super.prototype._n.call(this, x);
    };
    MemoryStream.prototype._add = function (il) {
        var ta = this._target;
        if (ta !== NO)
            return ta._add(il);
        var a = this._ils;
        a.push(il);
        if (a.length > 1) {
            if (this._has)
                il._n(this._v);
            return;
        }
        if (this._stopID !== NO) {
            if (this._has)
                il._n(this._v);
            clearTimeout(this._stopID);
            this._stopID = NO;
        }
        else if (this._has)
            il._n(this._v);
        else {
            var p = this._prod;
            if (p !== NO)
                p._start(this);
        }
    };
    MemoryStream.prototype._stopNow = function () {
        this._has = false;
        _super.prototype._stopNow.call(this);
    };
    MemoryStream.prototype._x = function () {
        this._has = false;
        _super.prototype._x.call(this);
    };
    MemoryStream.prototype.map = function (project) {
        return this._map(project);
    };
    MemoryStream.prototype.mapTo = function (projectedValue) {
        return _super.prototype.mapTo.call(this, projectedValue);
    };
    MemoryStream.prototype.take = function (amount) {
        return _super.prototype.take.call(this, amount);
    };
    MemoryStream.prototype.endWhen = function (other) {
        return _super.prototype.endWhen.call(this, other);
    };
    MemoryStream.prototype.replaceError = function (replace) {
        return _super.prototype.replaceError.call(this, replace);
    };
    MemoryStream.prototype.remember = function () {
        return this;
    };
    MemoryStream.prototype.debug = function (labelOrSpy) {
        return _super.prototype.debug.call(this, labelOrSpy);
    };
    return MemoryStream;
}(Stream));
exports.MemoryStream = MemoryStream;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Stream;
//# sourceMappingURL=index.js.map

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(89)() ? Symbol : __webpack_require__(91);


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var assign        = __webpack_require__(15)
  , normalizeOpts = __webpack_require__(25)
  , isCallable    = __webpack_require__(70)
  , contains      = __webpack_require__(28)

  , d;

d = module.exports = function (dscr, value/*, options*/) {
	var c, e, w, options, desc;
	if ((arguments.length < 2) || (typeof dscr !== 'string')) {
		options = value;
		value = dscr;
		dscr = null;
	} else {
		options = arguments[2];
	}
	if (dscr == null) {
		c = w = true;
		e = false;
	} else {
		c = contains.call(dscr, 'c');
		e = contains.call(dscr, 'e');
		w = contains.call(dscr, 'w');
	}

	desc = { value: value, configurable: c, enumerable: e, writable: w };
	return !options ? desc : assign(normalizeOpts(options), desc);
};

d.gs = function (dscr, get, set/*, options*/) {
	var c, e, options, desc;
	if (typeof dscr !== 'string') {
		options = set;
		set = get;
		get = dscr;
		dscr = null;
	} else {
		options = arguments[3];
	}
	if (get == null) {
		get = undefined;
	} else if (!isCallable(get)) {
		options = get;
		get = set = undefined;
	} else if (set == null) {
		set = undefined;
	} else if (!isCallable(set)) {
		options = set;
		set = undefined;
	}
	if (dscr == null) {
		c = true;
		e = false;
	} else {
		c = contains.call(dscr, 'c');
		e = contains.call(dscr, 'e');
	}

	desc = { get: get, set: set, configurable: c, enumerable: e };
	return !options ? desc : assign(normalizeOpts(options), desc);
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _undefined = __webpack_require__(23)(); // Support ES3 engines

module.exports = function (val) {
 return (val !== _undefined) && (val !== null);
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var vnode_1 = __webpack_require__(12);
var is = __webpack_require__(33);
function addNS(data, children, sel) {
    data.ns = 'http://www.w3.org/2000/svg';
    if (sel !== 'foreignObject' && children !== undefined) {
        for (var i = 0; i < children.length; ++i) {
            var childData = children[i].data;
            if (childData !== undefined) {
                addNS(childData, children[i].children, children[i].sel);
            }
        }
    }
}
function h(sel, b, c) {
    var data = {}, children, text, i;
    if (c !== undefined) {
        data = b;
        if (is.array(c)) {
            children = c;
        }
        else if (is.primitive(c)) {
            text = c;
        }
        else if (c && c.sel) {
            children = [c];
        }
    }
    else if (b !== undefined) {
        if (is.array(b)) {
            children = b;
        }
        else if (is.primitive(b)) {
            text = b;
        }
        else if (b && b.sel) {
            children = [b];
        }
        else {
            data = b;
        }
    }
    if (is.array(children)) {
        for (i = 0; i < children.length; ++i) {
            if (is.primitive(children[i]))
                children[i] = vnode_1.vnode(undefined, undefined, undefined, children[i]);
        }
    }
    if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' &&
        (sel.length === 3 || sel[3] === '.' || sel[3] === '#')) {
        addNS(data, children, sel);
    }
    return vnode_1.vnode(sel, data, children, text, undefined);
}
exports.h = h;
;
exports.default = h;
//# sourceMappingURL=h.js.map

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function isElement(obj) {
    var ELEM_TYPE = 1;
    var FRAG_TYPE = 11;
    return typeof HTMLElement === 'object'
        ? obj instanceof HTMLElement || obj instanceof DocumentFragment
        : obj &&
            typeof obj === 'object' &&
            obj !== null &&
            (obj.nodeType === ELEM_TYPE || obj.nodeType === FRAG_TYPE) &&
            typeof obj.nodeName === 'string';
}
function isClassOrId(str) {
    return str.length > 1 && (str[0] === '.' || str[0] === '#');
}
exports.isClassOrId = isClassOrId;
exports.SCOPE_PREFIX = '$$CYCLEDOM$$-';
function getElement(selectors) {
    var domElement = typeof selectors === 'string'
        ? document.querySelector(selectors)
        : selectors;
    if (typeof selectors === 'string' && domElement === null) {
        throw new Error("Cannot render into unknown element `" + selectors + "`");
    }
    else if (!isElement(domElement)) {
        throw new Error('Given container is not a DOM element neither a ' + 'selector string.');
    }
    return domElement;
}
exports.getElement = getElement;
/**
 * The full scope of a namespace is the "absolute path" of scopes from
 * parent to child. This is extracted from the namespace, filter only for
 * scopes in the namespace.
 */
function getFullScope(namespace) {
    return namespace
        .filter(function (c) { return c.indexOf(exports.SCOPE_PREFIX) > -1; })
        .map(function (c) { return c.replace(exports.SCOPE_PREFIX, ''); })
        .join('-');
}
exports.getFullScope = getFullScope;
function getSelectors(namespace) {
    return namespace.filter(function (c) { return c.indexOf(exports.SCOPE_PREFIX) === -1; }).join(' ');
}
exports.getSelectors = getSelectors;
//# sourceMappingURL=utils.js.map

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
Object.defineProperty(exports, "__esModule", { value: true });
function getGlobal() {
    var globalObj;
    if (typeof window !== 'undefined') {
        globalObj = window;
    }
    else if (typeof global !== 'undefined') {
        globalObj = global;
    }
    else {
        globalObj = this;
    }
    globalObj.Cyclejs = globalObj.Cyclejs || {};
    globalObj = globalObj.Cyclejs;
    globalObj.adaptStream = globalObj.adaptStream || (function (x) { return x; });
    return globalObj;
}
function setAdapt(f) {
    getGlobal().adaptStream = f;
}
exports.setAdapt = setAdapt;
function adapt(stream) {
    return getGlobal().adaptStream(stream);
}
exports.adapt = adapt;
//# sourceMappingURL=adapt.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(17)))

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var objToString = Object.prototype.toString
  , id = objToString.call(
	(function () {
		return arguments;
	})()
);

module.exports = function (value) {
	return objToString.call(value) === id;
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(26)()
	? Object.setPrototypeOf
	: __webpack_require__(27);


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var objToString = Object.prototype.toString, id = objToString.call("");

module.exports = function (value) {
	return (
		typeof value === "string" ||
		(value &&
			typeof value === "object" &&
			(value instanceof String || objToString.call(value) === id)) ||
		false
	);
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function vnode(sel, data, children, text, elm) {
    var key = data === undefined ? undefined : data.key;
    return { sel: sel, data: data, children: children,
        text: text, elm: elm, key: key };
}
exports.vnode = vnode;
exports.default = vnode;
//# sourceMappingURL=vnode.js.map

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var thunk_1 = __webpack_require__(47);
exports.thunk = thunk_1.thunk;
var MainDOMSource_1 = __webpack_require__(18);
exports.MainDOMSource = MainDOMSource_1.MainDOMSource;
/**
 * A factory for the DOM driver function.
 *
 * Takes a `container` to define the target on the existing DOM which this
 * driver will operate on, and an `options` object as the second argument. The
 * input to this driver is a stream of virtual DOM objects, or in other words,
 * Snabbdom "VNode" objects. The output of this driver is a "DOMSource": a
 * collection of Observables queried with the methods `select()` and `events()`.
 *
 * `DOMSource.select(selector)` returns a new DOMSource with scope restricted to
 * the element(s) that matches the CSS `selector` given.
 *
 * `DOMSource.events(eventType, options)` returns a stream of events of
 * `eventType` happening on the elements that match the current DOMSource. The
 * event object contains the `ownerTarget` property that behaves exactly like
 * `currentTarget`. The reason for this is that some browsers doesn't allow
 * `currentTarget` property to be mutated, hence a new property is created. The
 * returned stream is an *xstream* Stream if you use `@cycle/xstream-run` to run
 * your app with this driver, or it is an RxJS Observable if you use
 * `@cycle/rxjs-run`, and so forth. The `options` parameter can have the
 * property `useCapture`, which is by default `false`, except it is `true` for
 * event types that do not bubble. Read more here
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
 * about the `useCapture` and its purpose.
 * The other option is `preventDefault` that is set to false by default.
 * If set to true, the driver will automatically call `preventDefault()` on every event.
 *
 * `DOMSource.elements()` returns a stream of the DOM element(s) matched by the
 * selectors in the DOMSource. Also, `DOMSource.select(':root').elements()`
 * returns a stream of DOM element corresponding to the root (or container) of
 * the app on the DOM.
 *
 * @param {(String|HTMLElement)} container the DOM selector for the element
 * (or the element itself) to contain the rendering of the VTrees.
 * @param {DOMDriverOptions} options an object with two optional properties:
 *
 *   - `modules: array` overrides `@cycle/dom`'s default Snabbdom modules as
 *     as defined in [`src/modules.ts`](./src/modules.ts).
 *   - `transposition: boolean` enables/disables transposition of inner streams
 *     in the virtual DOM tree.
 * @return {Function} the DOM driver function. The function expects a stream of
 * VNode as input, and outputs the DOMSource object.
 * @function makeDOMDriver
 */
var makeDOMDriver_1 = __webpack_require__(44);
exports.makeDOMDriver = makeDOMDriver_1.makeDOMDriver;
/**
 * A factory function to create mocked DOMSource objects, for testing purposes.
 *
 * Takes a `mockConfig` object as argument, and returns
 * a DOMSource that can be given to any Cycle.js app that expects a DOMSource in
 * the sources, for testing.
 *
 * The `mockConfig` parameter is an object specifying selectors, eventTypes and
 * their streams. Example:
 *
 * ```js
 * const domSource = mockDOMSource({
 *   '.foo': {
 *     'click': xs.of({target: {}}),
 *     'mouseover': xs.of({target: {}}),
 *   },
 *   '.bar': {
 *     'scroll': xs.of({target: {}}),
 *     elements: xs.of({tagName: 'div'}),
 *   }
 * });
 *
 * // Usage
 * const click$ = domSource.select('.foo').events('click');
 * const element$ = domSource.select('.bar').elements();
 * ```
 *
 * The mocked DOM Source supports isolation. It has the functions `isolateSink`
 * and `isolateSource` attached to it, and performs simple isolation using
 * classNames. *isolateSink* with scope `foo` will append the class `___foo` to
 * the stream of virtual DOM nodes, and *isolateSource* with scope `foo` will
 * perform a conventional `mockedDOMSource.select('.__foo')` call.
 *
 * @param {Object} mockConfig an object where keys are selector strings
 * and values are objects. Those nested objects have `eventType` strings as keys
 * and values are streams you created.
 * @return {Object} fake DOM source object, with an API containing `select()`
 * and `events()` and `elements()` which can be used just like the DOM Driver's
 * DOMSource.
 *
 * @function mockDOMSource
 */
var mockDOMSource_1 = __webpack_require__(45);
exports.mockDOMSource = mockDOMSource_1.mockDOMSource;
exports.MockedDOMSource = mockDOMSource_1.MockedDOMSource;
/**
 * The hyperscript function `h()` is a function to create virtual DOM objects,
 * also known as VNodes. Call
 *
 * ```js
 * h('div.myClass', {style: {color: 'red'}}, [])
 * ```
 *
 * to create a VNode that represents a `DIV` element with className `myClass`,
 * styled with red color, and no children because the `[]` array was passed. The
 * API is `h(tagOrSelector, optionalData, optionalChildrenOrText)`.
 *
 * However, usually you should use "hyperscript helpers", which are shortcut
 * functions based on hyperscript. There is one hyperscript helper function for
 * each DOM tagName, such as `h1()`, `h2()`, `div()`, `span()`, `label()`,
 * `input()`. For instance, the previous example could have been written
 * as:
 *
 * ```js
 * div('.myClass', {style: {color: 'red'}}, [])
 * ```
 *
 * There are also SVG helper functions, which apply the appropriate SVG
 * namespace to the resulting elements. `svg()` function creates the top-most
 * SVG element, and `svg.g`, `svg.polygon`, `svg.circle`, `svg.path` are for
 * SVG-specific child elements. Example:
 *
 * ```js
 * svg({width: 150, height: 150}, [
 *   svg.polygon({
 *     attrs: {
 *       class: 'triangle',
 *       points: '20 0 20 150 150 20'
 *     }
 *   })
 * ])
 * ```
 *
 * @function h
 */
var h_1 = __webpack_require__(6);
exports.h = h_1.h;
var hyperscript_helpers_1 = __webpack_require__(42);
exports.svg = hyperscript_helpers_1.default.svg;
exports.a = hyperscript_helpers_1.default.a;
exports.abbr = hyperscript_helpers_1.default.abbr;
exports.address = hyperscript_helpers_1.default.address;
exports.area = hyperscript_helpers_1.default.area;
exports.article = hyperscript_helpers_1.default.article;
exports.aside = hyperscript_helpers_1.default.aside;
exports.audio = hyperscript_helpers_1.default.audio;
exports.b = hyperscript_helpers_1.default.b;
exports.base = hyperscript_helpers_1.default.base;
exports.bdi = hyperscript_helpers_1.default.bdi;
exports.bdo = hyperscript_helpers_1.default.bdo;
exports.blockquote = hyperscript_helpers_1.default.blockquote;
exports.body = hyperscript_helpers_1.default.body;
exports.br = hyperscript_helpers_1.default.br;
exports.button = hyperscript_helpers_1.default.button;
exports.canvas = hyperscript_helpers_1.default.canvas;
exports.caption = hyperscript_helpers_1.default.caption;
exports.cite = hyperscript_helpers_1.default.cite;
exports.code = hyperscript_helpers_1.default.code;
exports.col = hyperscript_helpers_1.default.col;
exports.colgroup = hyperscript_helpers_1.default.colgroup;
exports.dd = hyperscript_helpers_1.default.dd;
exports.del = hyperscript_helpers_1.default.del;
exports.dfn = hyperscript_helpers_1.default.dfn;
exports.dir = hyperscript_helpers_1.default.dir;
exports.div = hyperscript_helpers_1.default.div;
exports.dl = hyperscript_helpers_1.default.dl;
exports.dt = hyperscript_helpers_1.default.dt;
exports.em = hyperscript_helpers_1.default.em;
exports.embed = hyperscript_helpers_1.default.embed;
exports.fieldset = hyperscript_helpers_1.default.fieldset;
exports.figcaption = hyperscript_helpers_1.default.figcaption;
exports.figure = hyperscript_helpers_1.default.figure;
exports.footer = hyperscript_helpers_1.default.footer;
exports.form = hyperscript_helpers_1.default.form;
exports.h1 = hyperscript_helpers_1.default.h1;
exports.h2 = hyperscript_helpers_1.default.h2;
exports.h3 = hyperscript_helpers_1.default.h3;
exports.h4 = hyperscript_helpers_1.default.h4;
exports.h5 = hyperscript_helpers_1.default.h5;
exports.h6 = hyperscript_helpers_1.default.h6;
exports.head = hyperscript_helpers_1.default.head;
exports.header = hyperscript_helpers_1.default.header;
exports.hgroup = hyperscript_helpers_1.default.hgroup;
exports.hr = hyperscript_helpers_1.default.hr;
exports.html = hyperscript_helpers_1.default.html;
exports.i = hyperscript_helpers_1.default.i;
exports.iframe = hyperscript_helpers_1.default.iframe;
exports.img = hyperscript_helpers_1.default.img;
exports.input = hyperscript_helpers_1.default.input;
exports.ins = hyperscript_helpers_1.default.ins;
exports.kbd = hyperscript_helpers_1.default.kbd;
exports.keygen = hyperscript_helpers_1.default.keygen;
exports.label = hyperscript_helpers_1.default.label;
exports.legend = hyperscript_helpers_1.default.legend;
exports.li = hyperscript_helpers_1.default.li;
exports.link = hyperscript_helpers_1.default.link;
exports.main = hyperscript_helpers_1.default.main;
exports.map = hyperscript_helpers_1.default.map;
exports.mark = hyperscript_helpers_1.default.mark;
exports.menu = hyperscript_helpers_1.default.menu;
exports.meta = hyperscript_helpers_1.default.meta;
exports.nav = hyperscript_helpers_1.default.nav;
exports.noscript = hyperscript_helpers_1.default.noscript;
exports.object = hyperscript_helpers_1.default.object;
exports.ol = hyperscript_helpers_1.default.ol;
exports.optgroup = hyperscript_helpers_1.default.optgroup;
exports.option = hyperscript_helpers_1.default.option;
exports.p = hyperscript_helpers_1.default.p;
exports.param = hyperscript_helpers_1.default.param;
exports.pre = hyperscript_helpers_1.default.pre;
exports.progress = hyperscript_helpers_1.default.progress;
exports.q = hyperscript_helpers_1.default.q;
exports.rp = hyperscript_helpers_1.default.rp;
exports.rt = hyperscript_helpers_1.default.rt;
exports.ruby = hyperscript_helpers_1.default.ruby;
exports.s = hyperscript_helpers_1.default.s;
exports.samp = hyperscript_helpers_1.default.samp;
exports.script = hyperscript_helpers_1.default.script;
exports.section = hyperscript_helpers_1.default.section;
exports.select = hyperscript_helpers_1.default.select;
exports.small = hyperscript_helpers_1.default.small;
exports.source = hyperscript_helpers_1.default.source;
exports.span = hyperscript_helpers_1.default.span;
exports.strong = hyperscript_helpers_1.default.strong;
exports.style = hyperscript_helpers_1.default.style;
exports.sub = hyperscript_helpers_1.default.sub;
exports.sup = hyperscript_helpers_1.default.sup;
exports.table = hyperscript_helpers_1.default.table;
exports.tbody = hyperscript_helpers_1.default.tbody;
exports.td = hyperscript_helpers_1.default.td;
exports.textarea = hyperscript_helpers_1.default.textarea;
exports.tfoot = hyperscript_helpers_1.default.tfoot;
exports.th = hyperscript_helpers_1.default.th;
exports.thead = hyperscript_helpers_1.default.thead;
exports.title = hyperscript_helpers_1.default.title;
exports.tr = hyperscript_helpers_1.default.tr;
exports.u = hyperscript_helpers_1.default.u;
exports.ul = hyperscript_helpers_1.default.ul;
exports.video = hyperscript_helpers_1.default.video;
//# sourceMappingURL=index.js.map

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var xstream_1 = __webpack_require__(2);
function fromEvent(element, eventName, useCapture, preventDefault) {
    if (useCapture === void 0) { useCapture = false; }
    if (preventDefault === void 0) { preventDefault = false; }
    return xstream_1.Stream.create({
        element: element,
        next: null,
        start: function start(listener) {
            if (preventDefault) {
                this.next = function next(event) {
                    event.preventDefault();
                    listener.next(event);
                };
            }
            else {
                this.next = function next(event) {
                    listener.next(event);
                };
            }
            this.element.addEventListener(eventName, this.next, useCapture);
        },
        stop: function stop() {
            this.element.removeEventListener(eventName, this.next, useCapture);
        },
    });
}
exports.fromEvent = fromEvent;
//# sourceMappingURL=fromEvent.js.map

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(65)()
	? Object.assign
	: __webpack_require__(66);


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var clear    = __webpack_require__(22)
  , assign   = __webpack_require__(15)
  , callable = __webpack_require__(1)
  , value    = __webpack_require__(0)
  , d        = __webpack_require__(4)
  , autoBind = __webpack_require__(51)
  , Symbol   = __webpack_require__(3);

var defineProperty = Object.defineProperty, defineProperties = Object.defineProperties, Iterator;

module.exports = Iterator = function (list, context) {
	if (!(this instanceof Iterator)) throw new TypeError("Constructor requires 'new'");
	defineProperties(this, {
		__list__: d("w", value(list)),
		__context__: d("w", context),
		__nextIndex__: d("w", 0)
	});
	if (!context) return;
	callable(context.on);
	context.on("_add", this._onAdd);
	context.on("_delete", this._onDelete);
	context.on("_clear", this._onClear);
};

// Internal %IteratorPrototype% doesn't expose its constructor
delete Iterator.prototype.constructor;

defineProperties(
	Iterator.prototype,
	assign(
		{
			_next: d(function () {
				var i;
				if (!this.__list__) return undefined;
				if (this.__redo__) {
					i = this.__redo__.shift();
					if (i !== undefined) return i;
				}
				if (this.__nextIndex__ < this.__list__.length) return this.__nextIndex__++;
				this._unBind();
				return undefined;
			}),
			next: d(function () {
				return this._createResult(this._next());
			}),
			_createResult: d(function (i) {
				if (i === undefined) return { done: true, value: undefined };
				return { done: false, value: this._resolve(i) };
			}),
			_resolve: d(function (i) {
				return this.__list__[i];
			}),
			_unBind: d(function () {
				this.__list__ = null;
				delete this.__redo__;
				if (!this.__context__) return;
				this.__context__.off("_add", this._onAdd);
				this.__context__.off("_delete", this._onDelete);
				this.__context__.off("_clear", this._onClear);
				this.__context__ = null;
			}),
			toString: d(function () {
				return "[object " + (this[Symbol.toStringTag] || "Object") + "]";
			})
		},
		autoBind({
			_onAdd: d(function (index) {
				if (index >= this.__nextIndex__) return;
				++this.__nextIndex__;
				if (!this.__redo__) {
					defineProperty(this, "__redo__", d("c", [index]));
					return;
				}
				this.__redo__.forEach(function (redo, i) {
					if (redo >= index) this.__redo__[i] = ++redo;
				}, this);
				this.__redo__.push(index);
			}),
			_onDelete: d(function (index) {
				var i;
				if (index >= this.__nextIndex__) return;
				--this.__nextIndex__;
				if (!this.__redo__) return;
				i = this.__redo__.indexOf(index);
				if (i !== -1) this.__redo__.splice(i, 1);
				this.__redo__.forEach(function (redo, j) {
					if (redo > index) this.__redo__[j] = --redo;
				}, this);
			}),
			_onClear: d(function () {
				if (this.__redo__) clear.call(this.__redo__);
				this.__nextIndex__ = 0;
			})
		})
	)
);

defineProperty(
	Iterator.prototype,
	Symbol.iterator,
	d(function () {
		return this;
	})
);


/***/ }),
/* 17 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var adapt_1 = __webpack_require__(8);
var DocumentDOMSource_1 = __webpack_require__(37);
var BodyDOMSource_1 = __webpack_require__(36);
var ElementFinder_1 = __webpack_require__(38);
var fromEvent_1 = __webpack_require__(14);
var isolate_1 = __webpack_require__(43);
var EventDelegator_1 = __webpack_require__(39);
var utils_1 = __webpack_require__(7);
var eventTypesThatDontBubble = [
    "blur",
    "canplay",
    "canplaythrough",
    "change",
    "durationchange",
    "emptied",
    "ended",
    "focus",
    "load",
    "loadeddata",
    "loadedmetadata",
    "mouseenter",
    "mouseleave",
    "pause",
    "play",
    "playing",
    "ratechange",
    "reset",
    "scroll",
    "seeked",
    "seeking",
    "stalled",
    "submit",
    "suspend",
    "timeupdate",
    "unload",
    "volumechange",
    "waiting",
];
function determineUseCapture(eventType, options) {
    var result = false;
    if (typeof options.useCapture === 'boolean') {
        result = options.useCapture;
    }
    if (eventTypesThatDontBubble.indexOf(eventType) !== -1) {
        result = true;
    }
    return result;
}
function filterBasedOnIsolation(domSource, fullScope) {
    return function filterBasedOnIsolationOperator(rootElement$) {
        var initialState = {
            wasIsolated: false,
            shouldPass: false,
            element: null,
        };
        return rootElement$
            .fold(function checkIfShouldPass(state, element) {
            var isIsolated = !!domSource._isolateModule.getElement(fullScope);
            state.shouldPass = isIsolated && !state.wasIsolated;
            state.wasIsolated = isIsolated;
            state.element = element;
            return state;
        }, initialState)
            .drop(1)
            .filter(function (s) { return s.shouldPass; })
            .map(function (s) { return s.element; });
    };
}
var MainDOMSource = (function () {
    function MainDOMSource(_rootElement$, _sanitation$, _namespace, _isolateModule, _delegators, _name) {
        if (_namespace === void 0) { _namespace = []; }
        var _this = this;
        this._rootElement$ = _rootElement$;
        this._sanitation$ = _sanitation$;
        this._namespace = _namespace;
        this._isolateModule = _isolateModule;
        this._delegators = _delegators;
        this._name = _name;
        this.isolateSource = isolate_1.isolateSource;
        this.isolateSink = function (sink, scope) {
            if (scope === ':root') {
                return sink;
            }
            else if (utils_1.isClassOrId(scope)) {
                return isolate_1.siblingIsolateSink(sink, scope);
            }
            else {
                var prevFullScope = utils_1.getFullScope(_this._namespace);
                var nextFullScope = [prevFullScope, scope].filter(function (x) { return !!x; }).join('-');
                return isolate_1.totalIsolateSink(sink, nextFullScope);
            }
        };
    }
    MainDOMSource.prototype.elements = function () {
        var output$;
        if (this._namespace.length === 0) {
            output$ = this._rootElement$;
        }
        else {
            var elementFinder_1 = new ElementFinder_1.ElementFinder(this._namespace, this._isolateModule);
            output$ = this._rootElement$.map(function (el) { return elementFinder_1.call(el); });
        }
        var out = adapt_1.adapt(output$.remember());
        out._isCycleSource = this._name;
        return out;
    };
    Object.defineProperty(MainDOMSource.prototype, "namespace", {
        get: function () {
            return this._namespace;
        },
        enumerable: true,
        configurable: true
    });
    MainDOMSource.prototype.select = function (selector) {
        if (typeof selector !== 'string') {
            throw new Error("DOM driver's select() expects the argument to be a " +
                "string as a CSS selector");
        }
        if (selector === 'document') {
            return new DocumentDOMSource_1.DocumentDOMSource(this._name);
        }
        if (selector === 'body') {
            return new BodyDOMSource_1.BodyDOMSource(this._name);
        }
        var trimmedSelector = selector.trim();
        var childNamespace = trimmedSelector === ":root"
            ? this._namespace
            : this._namespace.concat(trimmedSelector);
        return new MainDOMSource(this._rootElement$, this._sanitation$, childNamespace, this._isolateModule, this._delegators, this._name);
    };
    MainDOMSource.prototype.events = function (eventType, options) {
        if (options === void 0) { options = {}; }
        if (typeof eventType !== "string") {
            throw new Error("DOM driver's events() expects argument to be a " +
                "string representing the event type to listen for.");
        }
        var useCapture = determineUseCapture(eventType, options);
        var namespace = this._namespace;
        var fullScope = utils_1.getFullScope(namespace);
        var keyParts = [eventType, useCapture];
        if (fullScope) {
            keyParts.push(fullScope);
        }
        var key = keyParts.join('~');
        var domSource = this;
        var rootElement$;
        if (fullScope) {
            rootElement$ = this._rootElement$.compose(filterBasedOnIsolation(domSource, fullScope));
        }
        else {
            rootElement$ = this._rootElement$.take(2);
        }
        var event$ = rootElement$
            .map(function setupEventDelegatorOnTopElement(rootElement) {
            // Event listener just for the root element
            if (!namespace || namespace.length === 0) {
                return fromEvent_1.fromEvent(rootElement, eventType, useCapture, options.preventDefault);
            }
            // Event listener on the origin element as an EventDelegator
            var delegators = domSource._delegators;
            var origin = domSource._isolateModule.getElement(fullScope) || rootElement;
            var delegator;
            if (delegators.has(key)) {
                delegator = delegators.get(key);
                delegator.updateOrigin(origin);
            }
            else {
                delegator = new EventDelegator_1.EventDelegator(origin, eventType, useCapture, domSource._isolateModule, options.preventDefault);
                delegators.set(key, delegator);
            }
            if (fullScope) {
                domSource._isolateModule.addEventDelegator(fullScope, delegator);
            }
            var subject = delegator.createDestination(namespace);
            return subject;
        })
            .flatten();
        var out = adapt_1.adapt(event$);
        out._isCycleSource = domSource._name;
        return out;
    };
    MainDOMSource.prototype.dispose = function () {
        this._sanitation$.shamefullySendNext(null);
        this._isolateModule.reset();
    };
    return MainDOMSource;
}());
exports.MainDOMSource = MainDOMSource;
//# sourceMappingURL=MainDOMSource.js.map

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ScopeChecker = (function () {
    function ScopeChecker(fullScope, isolateModule) {
        this.fullScope = fullScope;
        this.isolateModule = isolateModule;
    }
    /**
     * Checks whether the given element is *directly* in the scope of this
     * scope checker. Being contained *indirectly* through other scopes
     * is not valid. This is crucial for implementing parent-child isolation,
     * so that the parent selectors don't search inside a child scope.
     */
    ScopeChecker.prototype.isDirectlyInScope = function (leaf) {
        for (var el = leaf; el; el = el.parentElement) {
            var fullScope = this.isolateModule.getFullScope(el);
            if (fullScope && fullScope !== this.fullScope) {
                return false;
            }
            if (fullScope) {
                return true;
            }
        }
        return true;
    };
    return ScopeChecker;
}());
exports.ScopeChecker = ScopeChecker;
//# sourceMappingURL=ScopeChecker.js.map

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function createMatchesSelector() {
    var vendor;
    try {
        var proto = Element.prototype;
        vendor =
            proto.matches ||
                proto.matchesSelector ||
                proto.webkitMatchesSelector ||
                proto.mozMatchesSelector ||
                proto.msMatchesSelector ||
                proto.oMatchesSelector;
    }
    catch (err) {
        vendor = null;
    }
    return function match(elem, selector) {
        if (selector.length === 0) {
            return true;
        }
        if (vendor) {
            return vendor.call(elem, selector);
        }
        var nodes = elem.parentNode.querySelectorAll(selector);
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i] === elem) {
                return true;
            }
        }
        return false;
    };
}
exports.matchesSelector = createMatchesSelector();
//# sourceMappingURL=matchesSelector.js.map

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var require;var require;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (f) {
  if (( false ? "undefined" : _typeof(exports)) === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (f),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {
    var g;if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }g.dpicker = f();
  }
})(function () {
  var define, module, exports;return function () {
    function r(e, n, t) {
      function o(i, f) {
        if (!n[i]) {
          if (!e[i]) {
            var c = "function" == typeof require && require;if (!f && c) return require(i, !0);if (u) return u(i, !0);var a = new Error("Cannot find module '" + i + "'");throw a.code = "MODULE_NOT_FOUND", a;
          }var p = n[i] = { exports: {} };e[i][0].call(p.exports, function (r) {
            var n = e[i][1][r];return o(n || r);
          }, p, p.exports, r, e, n, t);
        }return n[i].exports;
      }for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) {
        o(t[i]);
      }return o;
    }return r;
  }()({ 1: [function (require, module, exports) {
      var morph = require('./lib/morph');
      var TEXT_NODE = 3;
      module.exports = nanomorph;
      function nanomorph(oldTree, newTree) {
        var tree = walk(newTree, oldTree);
        return tree;
      }
      function walk(newNode, oldNode) {
        if (!oldNode) {
          return newNode;
        } else if (!newNode) {
          return null;
        } else if (newNode.isSameNode && newNode.isSameNode(oldNode)) {
          return oldNode;
        } else if (newNode.tagName !== oldNode.tagName) {
          return newNode;
        } else {
          morph(newNode, oldNode);
          updateChildren(newNode, oldNode);
          return oldNode;
        }
      }
      function updateChildren(newNode, oldNode) {
        var oldChild, newChild, morphed, oldMatch;
        var offset = 0;
        for (var i = 0;; i++) {
          oldChild = oldNode.childNodes[i];
          newChild = newNode.childNodes[i - offset];
          if (!oldChild && !newChild) {
            break;
          } else if (!newChild) {
            oldNode.removeChild(oldChild);
            i--;
          } else if (!oldChild) {
            oldNode.appendChild(newChild);
            offset++;
          } else if (same(newChild, oldChild)) {
            morphed = walk(newChild, oldChild);
            if (morphed !== oldChild) {
              oldNode.replaceChild(morphed, oldChild);
              offset++;
            }
          } else {
            oldMatch = null;
            for (var j = i; j < oldNode.childNodes.length; j++) {
              if (same(oldNode.childNodes[j], newChild)) {
                oldMatch = oldNode.childNodes[j];
                break;
              }
            }
            if (oldMatch) {
              morphed = walk(newChild, oldMatch);
              if (morphed !== oldMatch) offset++;
              oldNode.insertBefore(morphed, oldChild);
            } else if (!newChild.id && !oldChild.id) {
              morphed = walk(newChild, oldChild);
              if (morphed !== oldChild) {
                oldNode.replaceChild(morphed, oldChild);
                offset++;
              }
            } else {
              oldNode.insertBefore(newChild, oldChild);
              offset++;
            }
          }
        }
      }
      function same(a, b) {
        if (a.id) return a.id === b.id;
        if (a.isSameNode) return a.isSameNode(b);
        if (a.tagName !== b.tagName) return false;
        if (a.type === TEXT_NODE) return a.nodeValue === b.nodeValue;
        return false;
      }
    }, { "./lib/morph": 3 }], 2: [function (require, module, exports) {
      module.exports = [
      // attribute events (can be set with attributes)
      'onclick', 'ondblclick', 'onmousedown', 'onmouseup', 'onmouseover', 'onmousemove', 'onmouseout', 'onmouseenter', 'onmouseleave', 'ontouchcancel', 'ontouchend', 'ontouchmove', 'ontouchstart', 'ondragstart', 'ondrag', 'ondragenter', 'ondragleave', 'ondragover', 'ondrop', 'ondragend', 'onkeydown', 'onkeypress', 'onkeyup', 'onunload', 'onabort', 'onerror', 'onresize', 'onscroll', 'onselect', 'onchange', 'onsubmit', 'onreset', 'onfocus', 'onblur', 'oninput',
      // other common events
      'oncontextmenu', 'onfocusin', 'onfocusout'];
    }, {}], 3: [function (require, module, exports) {
      var events = require('./events');
      var eventsLength = events.length;

      var ELEMENT_NODE = 1;
      var TEXT_NODE = 3;
      var COMMENT_NODE = 8;

      module.exports = morph;

      // diff elements and apply the resulting patch to the old node
      // (obj, obj) -> null
      function morph(newNode, oldNode) {
        var nodeType = newNode.nodeType;
        var nodeName = newNode.nodeName;

        if (nodeType === ELEMENT_NODE) {
          copyAttrs(newNode, oldNode);
        }

        if (nodeType === TEXT_NODE || nodeType === COMMENT_NODE) {
          if (oldNode.nodeValue !== newNode.nodeValue) {
            oldNode.nodeValue = newNode.nodeValue;
          }
        }

        // Some DOM nodes are weird
        // https://github.com/patrick-steele-idem/morphdom/blob/master/src/specialElHandlers.js
        if (nodeName === 'INPUT') updateInput(newNode, oldNode);else if (nodeName === 'OPTION') updateOption(newNode, oldNode);else if (nodeName === 'TEXTAREA') updateTextarea(newNode, oldNode);

        copyEvents(newNode, oldNode);
      }

      function copyAttrs(newNode, oldNode) {
        var oldAttrs = oldNode.attributes;
        var newAttrs = newNode.attributes;
        var attrNamespaceURI = null;
        var attrValue = null;
        var fromValue = null;
        var attrName = null;
        var attr = null;

        for (var i = newAttrs.length - 1; i >= 0; --i) {
          attr = newAttrs[i];
          attrName = attr.name;
          attrNamespaceURI = attr.namespaceURI;
          attrValue = attr.value;
          if (attrNamespaceURI) {
            attrName = attr.localName || attrName;
            fromValue = oldNode.getAttributeNS(attrNamespaceURI, attrName);
            if (fromValue !== attrValue) {
              oldNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
            }
          } else {
            if (!oldNode.hasAttribute(attrName)) {
              oldNode.setAttribute(attrName, attrValue);
            } else {
              fromValue = oldNode.getAttribute(attrName);
              if (fromValue !== attrValue) {
                // apparently values are always cast to strings, ah well
                if (attrValue === 'null' || attrValue === 'undefined') {
                  oldNode.removeAttribute(attrName);
                } else {
                  oldNode.setAttribute(attrName, attrValue);
                }
              }
            }
          }
        }

        // Remove any extra attributes found on the original DOM element that
        // weren't found on the target element.
        for (var j = oldAttrs.length - 1; j >= 0; --j) {
          attr = oldAttrs[j];
          if (attr.specified !== false) {
            attrName = attr.name;
            attrNamespaceURI = attr.namespaceURI;

            if (attrNamespaceURI) {
              attrName = attr.localName || attrName;
              if (!newNode.hasAttributeNS(attrNamespaceURI, attrName)) {
                oldNode.removeAttributeNS(attrNamespaceURI, attrName);
              }
            } else {
              if (!newNode.hasAttributeNS(null, attrName)) {
                oldNode.removeAttribute(attrName);
              }
            }
          }
        }
      }

      function copyEvents(newNode, oldNode) {
        for (var i = 0; i < eventsLength; i++) {
          var ev = events[i];
          if (newNode[ev]) {
            // if new element has a whitelisted attribute
            oldNode[ev] = newNode[ev]; // update existing element
          } else if (oldNode[ev]) {
            // if existing element has it and new one doesnt
            oldNode[ev] = undefined; // remove it from existing element
          }
        }
      }

      function updateOption(newNode, oldNode) {
        updateAttribute(newNode, oldNode, 'selected');
      }

      // The "value" attribute is special for the <input> element since it sets the
      // initial value. Changing the "value" attribute without changing the "value"
      // property will have no effect since it is only used to the set the initial
      // value. Similar for the "checked" attribute, and "disabled".
      function updateInput(newNode, oldNode) {
        var newValue = newNode.value;
        var oldValue = oldNode.value;

        updateAttribute(newNode, oldNode, 'checked');
        updateAttribute(newNode, oldNode, 'disabled');

        if (newValue !== oldValue) {
          oldNode.setAttribute('value', newValue);
          oldNode.value = newValue;
        }

        if (newValue === 'null') {
          oldNode.value = '';
          oldNode.removeAttribute('value');
        }

        if (!newNode.hasAttributeNS(null, 'value')) {
          oldNode.removeAttribute('value');
        } else if (oldNode.type === 'range') {
          // this is so elements like slider move their UI thingy
          oldNode.value = newValue;
        }
      }

      function updateTextarea(newNode, oldNode) {
        var newValue = newNode.value;
        if (newValue !== oldNode.value) {
          oldNode.value = newValue;
        }

        if (oldNode.firstChild && oldNode.firstChild.nodeValue !== newValue) {
          // Needed for IE. Apparently IE sets the placeholder as the
          // node value and vise versa. This ignores an empty update.
          if (newValue === '' && oldNode.firstChild.nodeValue === oldNode.placeholder) {
            return;
          }

          oldNode.firstChild.nodeValue = newValue;
        }
      }

      function updateAttribute(newNode, oldNode, name) {
        if (newNode[name] !== oldNode[name]) {
          oldNode[name] = newNode[name];
          if (newNode[name]) {
            oldNode.setAttribute(name, '');
          } else {
            oldNode.removeAttribute(name);
          }
        }
      }
    }, { "./events": 2 }], 4: [function (require, module, exports) {
      module.exports = function yoyoifyAppendChild(el, childs) {
        for (var i = 0; i < childs.length; i++) {
          var node = childs[i];
          if (Array.isArray(node)) {
            yoyoifyAppendChild(el, node);
            continue;
          }
          if (typeof node === 'number' || typeof node === 'boolean' || node instanceof Date || node instanceof RegExp) {
            node = node.toString();
          }
          if (typeof node === 'string') {
            if (/^[\n\r\s]+$/.test(node)) continue;
            if (el.lastChild && el.lastChild.nodeName === '#text') {
              el.lastChild.nodeValue += node;
              continue;
            }
            node = document.createTextNode(node);
          }
          if (node && node.nodeType) {
            el.appendChild(node);
          }
        }
      };
    }, {}], 5: [function (require, module, exports) {
      module.exports = function yoyoifySetAttribute(el, attr, value) {
        if ((typeof attr === "undefined" ? "undefined" : _typeof(attr)) === 'object') {
          for (var i in attr) {
            if (attr.hasOwnProperty(i)) {
              yoyoifySetAttribute(el, i, attr[i]);
            }
          }
          return;
        }
        if (!attr) return;
        if (attr === 'className') attr = 'class';
        if (attr === 'htmlFor') attr = 'for';
        if (attr.slice(0, 2) === 'on') {
          el[attr] = value;
        } else {
          // assume a boolean attribute if the value === true
          // no need to do typeof because "false" would've caused an early return
          if (value === true) value = attr;
          el.setAttribute(attr, value);
        }
      };
    }, {}], 6: [function (require, module, exports) {
      'use strict';

      var moment = void 0;
      try {
        moment = require('moment');
      } catch (e) {
        moment = window.moment;
      }

      var DAY_TOKEN = 'd';
      var YEAR_TOKEN = 'y';
      var MONTH_TOKEN = 'M';
      var HOURS_TOKEN = 'h';

      /**
       * @module MomentAdapter
       */

      /**
       * Get an immutable moment date
       * @param  {String} date
       * @param  {Boolean} immutable
       * @private
       * @return {Moment}
       */
      function _getMoment(date, immutable) {
        if (immutable === undefined) {
          immutable = true;
        }

        if (moment.isMoment(date)) {
          return immutable === true ? date.clone() : date;
        }

        if (date instanceof Date) {
          return moment(date);
        }

        return null;
      }

      /**
      * Get months, an array of string
      * @return {Array<String>} List of the available months
      */
      function months() {
        return moment.months();
      }

      /**
       * Get week days
       * @return {Array<String>}
       */
      function weekdays() {
        return moment.weekdaysShort();
      }

      /**
       * First day of week according to locale
       * @return {Number}
       */
      function firstDayOfWeek() {
        return moment.localeData().firstDayOfWeek();
      }

      /**
       * @param {Date} date
       * @return {Boolean}
       */
      function isValid(date) {
        date = _getMoment(date, false);
        return moment.isMoment(date) && date.isValid();
      }

      /**
       * @param {String} dateString
       * @param {String} format
       * @return {Date|Boolean} false if invalid or the parsed date, parsing is heaving let's do this only once
       */
      function isValidWithFormat(dateString, format) {
        if (Array.isArray(format)) {
          var date = false;

          for (var i = 0; i < format.length; i++) {
            var _testDate = moment(dateString, format[i], true);
            if (this.isValid(_testDate) === true) {
              date = _testDate.toDate();
              break;
            }
          }

          return date;
        }

        var testDate = moment(dateString, format, true);
        if (this.isValid(testDate) === true) {
          return testDate.toDate();
        }

        return false;
      }

      /**
       * Get year
       * @param {Date} date
       * @return {Number}
       */
      function getYear(date) {
        return _getMoment(date, false).year();
      }

      /**
       * Get Month
       * @param {Date} date
       * @return {Number}
       */
      function getMonth(date) {
        return _getMoment(date, false).month();
      }

      /**
       * Get Date
       * @param {Date} date
       * @return {Number}
       */
      function getDate(date) {
        return _getMoment(date, false).date();
      }

      /**
       * Get Hours
       * @param {Date} date
       * @return {Number}
       */
      function getHours(date) {
        return _getMoment(date, false).hours();
      }

      /**
       * Get Minutes
       * @param {Date} date
       * @return {Number}
       */
      function getMinutes(date) {
        return _getMoment(date, false).minutes();
      }

      /**
       * Get Seconds
       * @param {Date} date
       * @return {Number}
       */
      function getSeconds(date) {
        return _getMoment(date, false).seconds();
      }

      /**
       * Get Milliseconds
       * @param {Date} date
       * @return {Number}
       */
      function getMilliseconds(date) {
        return _getMoment(date, false).milliseconds();
      }

      /**
       * Set Date
       * @param {Date} date
       * @param {Number} day
       * @return {Date}
       */
      function setDate(date, day) {
        return _getMoment(date).date(day).toDate();
      }

      /**
       * Set Minutes
       * @param {Date} date
       * @param {Number} minutes
       * @return {Date}
       */
      function setMinutes(date, minutes) {
        return _getMoment(date).minutes(minutes).toDate();
      }

      /**
       * Set Hours
       * @param {Date} date
       * @param {Number} hours
       * @return {Date}
       */
      function setHours(date, hours) {
        return _getMoment(date).hours(hours).toDate();
      }

      /**
       * Set Month
       * @param {Date} date
       * @param {Number} month
       * @return {Date}
       */
      function setMonth(date, month) {
        return _getMoment(date).month(month).toDate();
      }

      /**
       * Set Year
       * @param {Date} date
       * @param {Number} year
       * @return {Date}
       */
      function setYear(date, year) {
        return _getMoment(date).year(year).toDate();
      }

      /**
       * Add Days
       * @param {Date} date
       * @param {Number} num days to add
       * @return {Date}
       */
      function addDays(date, num) {
        return _getMoment(date).add(num, DAY_TOKEN).toDate();
      }

      /**
       * Add Months
       * @param {Date} date
       * @param {Number} num months to add
       * @return {Date}
       */
      function addMonths(date, num) {
        return _getMoment(date).add(num, MONTH_TOKEN).toDate();
      }

      /**
       * Add Years
       * @param {Date} date
       * @param {Number} num years to add
       * @return {Date}
       */
      function addYears(date, year) {
        return _getMoment(date).add(year, YEAR_TOKEN).toDate();
      }

      /**
       * Add Hours
       * @param {Date} date
       * @param {Number} num hours to add
       * @return {Date}
       */
      function addHours(date, hours) {
        return _getMoment(date).add(hours, HOURS_TOKEN).toDate();
      }

      /**
       * Subtract days
       * @param {Date} date
       * @param {Number} num days to subtract
       * @return {Date}
       */
      function subDays(date, num) {
        return _getMoment(date).subtract(num, DAY_TOKEN).toDate();
      }

      /**
       * Subtract months
       * @param {Date} date
       * @param {Number} num months to subtract
       * @return {Date}
       */
      function subMonths(date, num) {
        return _getMoment(date).subtract(num, MONTH_TOKEN).toDate();
      }

      /**
       * Format a Date and return a string
       * @param {Date} date
       * @param {String} format
       * @return {String}
       */
      function format(date, format) {
        if (Array.isArray(format)) {
          format = format[0];
        }
        return _getMoment(date, false).format(format);
      }

      /**
       * Get the number of days in the current date month
       * @param {Date} date
       * @return {Number}
       */
      function daysInMonth(date) {
        return _getMoment(date, false).daysInMonth();
      }

      /**
       * Get number of the day in the week (from 0 to 6) for the given month on the first day
       * @param {Date} date
       * @returns {Number}
       */
      function firstWeekDay(date) {
        return +_getMoment(date).date(1).format('e');
      }

      /**
       * Reset a date seconds
       * @param {Date} date
       * @returns {Date}
       */
      function resetSeconds(date) {
        return _getMoment(date).seconds(0).milliseconds(0).toDate();
      }

      /**
       * Reset a date minutes
       * @param {Date} date
       * @returns {Date}
       */
      function resetMinutes(date) {
        return _getMoment(this.resetSeconds(date)).minutes(0).toDate();
      }

      /**
       * Reset a date hours
       * @param {Date} date
       * @returns {Date}
       */
      function resetHours(date) {
        return _getMoment(this.resetMinutes(date)).hours(0).toDate();
      }

      /**
       * isBefore
       * @param {Date} date
       * @param {Date} comparison
       * @return {Boolean}
       */
      function isBefore(date, comparison) {
        return _getMoment(date, false).isBefore(comparison);
      }

      /**
       * isAfter
       * @param {Date} date
       * @param {Date} comparison
       * @return {Boolean}
       */
      function isAfter(date, comparison) {
        return _getMoment(date, false).isAfter(comparison);
      }

      /**
       * isSameOrAfter (comparison must be done on a DAY basis)
       * @param {Date} date
       * @param {Date} comparison
       * @return {Boolean}
       */
      function isSameOrAfter(date, comparison) {
        return _getMoment(date, false).isSameOrAfter(comparison, DAY_TOKEN);
      }

      /**
       * isSameOrBefore (comparison must be done on a DAY basis)
       * @param {Date} date
       * @param {Date} comparison
       * @return {Boolean}
       */
      function isSameOrBefore(date, comparison) {
        return _getMoment(date, false).isSameOrBefore(comparison, DAY_TOKEN);
      }

      /**
       * isSameDay
       * @param {Date} date
       * @param {Date} comparison
       * @return {Boolean}
       */
      function isSameDay(date, comparison) {
        return _getMoment(date, false).isSame(comparison, DAY_TOKEN);
      }

      /**
       * isSameHours
       * @param {Date} date
       * @param {Date} comparison
       * @return {Boolean}
       */
      function isSameHours(date, comparison) {
        return _getMoment(date, false).isSame(comparison, HOURS_TOKEN);
      }

      /**
       * isSameMonth
       * @param {Date} date
       * @param {Date} comparison
       * @return {Boolean}
       */
      function isSameMonth(date, comparison) {
        return _getMoment(date, false).isSame(comparison, MONTH_TOKEN);
      }

      /**
       * An uppercased meridiem (AM or PM)
       * @param {Date} date
       * @return {String}
       */
      function getMeridiem(date) {
        return _getMoment(date, false).format('A');
      }

      module.exports = {
        _getMoment: _getMoment,
        months: months,
        weekdays: weekdays,
        firstDayOfWeek: firstDayOfWeek,
        isValid: isValid,
        isValidWithFormat: isValidWithFormat,
        getYear: getYear,
        getHours: getHours,
        getMonth: getMonth,
        getDate: getDate,
        getMinutes: getMinutes,
        getSeconds: getSeconds,
        getMilliseconds: getMilliseconds,
        setDate: setDate,
        setMinutes: setMinutes,
        setHours: setHours,
        setMonth: setMonth,
        setYear: setYear,
        addDays: addDays,
        addMonths: addMonths,
        addYears: addYears,
        addHours: addHours,
        subDays: subDays,
        subMonths: subMonths,
        format: format,
        daysInMonth: daysInMonth,
        firstWeekDay: firstWeekDay,
        resetSeconds: resetSeconds,
        resetMinutes: resetMinutes,
        resetHours: resetHours,
        isBefore: isBefore,
        isAfter: isAfter,
        isSameOrAfter: isSameOrAfter,
        isSameOrBefore: isSameOrBefore,
        isSameDay: isSameDay,
        isSameHours: isSameHours,
        isSameMonth: isSameMonth,
        getMeridiem: getMeridiem
      };
    }, { "moment": "moment" }], 7: [function (require, module, exports) {
      'use strict';

      var DPicker = require('./dpicker.moment.js');
      require('./plugins/time.js')(DPicker);
      require('./plugins/modifiers.js')(DPicker);
      require('./plugins/arrow-navigation.js')(DPicker);
      require('./plugins/navigation.js')(DPicker);
      require('./plugins/monthAndYear.js')(DPicker);

      module.exports = DPicker;
    }, { "./dpicker.moment.js": 9, "./plugins/arrow-navigation.js": 10, "./plugins/modifiers.js": 11, "./plugins/monthAndYear.js": 12, "./plugins/navigation.js": 13, "./plugins/time.js": 14 }], 8: [function (require, module, exports) {
      'use strict';

      var _appendChild = require('yo-yoify/lib/appendChild'),
          _setAttribute = require('yo-yoify/lib/setAttribute');

      var nanomorph = require('nanomorph');

      /**
       * DPicker
       *
       * @param {Element} element DOM element where you want the date picker or an input
       * @param {Object} [options={}]
       * @param {Date} [options.model=new Date()] Your own model instance, defaults to `new Date()` (can be set by the `value` attribute on an input, transformed to moment according to the given format)
       * @param {Date} [options.min=1986-01-01] The minimum date (can be set by the `min` attribute on an input)
       * @param {Date} [options.max=today+1 year] The maximum date (can be set by the `max` attribute on an input)
       * @param {String|Array} [options.format='DD/MM/YYYY'] The input format, a moment format (can be set by the `format` attribute on an input). If the aformat is an array, it'll enable multiple input formats. The first one will be the output format.
       * @param {String} [options.months=adapter.months()] Months array, see also [adapter.months()](todo)
       * @param {String} [options.days=adapter.weekdaysShort()] Days array, see also [adapter.weekdays()](todo)
       * @param {Boolean} [options.display=false] Initial calendar display state (not that when false it won't render the calendar)
       * @param {Boolean} [options.hideOnOutsideClick=true] On click outside of the date picker, hide the calendar
       * @param {Boolean} [options.hideOnDayClick=true] Hides the date picker on day click
       * @param {Boolean} [options.hideOnDayEnter=true] Hides the date picker when Enter or Escape is hit
       * @param {Boolean} [options.showCalendarOnInputFocus=true] Shows the calendar on input focus
       * @param {Boolean} [options.showCalendarButton=false] Adds a calendar button
       * @param {Boolean} [options.siblingMonthDayClick=false] Enable sibling months day click
       * @param {Function} [options.onChange] A function to call whenever the data gets updated
       * @param {String} [options.inputId=uuid()] The input id, useful to add you own label (can only be set in the initiation phase) If element is an inputand it has an `id` attribute it'll be overriden by it
       * @param {String} [options.inputName='dpicker-input'] The input name. If element is an inputand it has a `name` attribute it'll be overriden by it
       * @param {Array} [options.order] The dom elements appending order.
       * @param {Boolean} [options.time=false] Enable time (must include the time module)
       * @param {Boolean} [options.meridiem=false] 12/24 hour format, default 24
       * @param {Boolean} [options.disabled=false] Disable the input box
       * @param {Number} [options.step=1] Minutes step
       * @param {Boolean} [options.concatHoursAndMinutes=false] Use only one select box for both hours and minutes
       * @param {Boolean} [options.empty=false] Use this so force DPicker with an empty input instead of setting it to the formatted current date
       *
       * @property {String} container Get container id
       * @property {String} inputId Get input id
       * @property {String} input Get current input value (formatted date)
       * @property {Function} onChange Set onChange method
       * @property {Boolean} valid Is the current input valid
       * @property {Boolean} empty Is the input empty
       * @property {Date} model Get/Set model, a Date instance
       * @property {String} format Get/Set format, a Date format string
       * @property {Boolean} display Get/Set display, hides or shows the date picker
       * @property {Date} min  Get/Set min date
       * @property {Date} max Get/Set max date
      
       * @fires DPicker#hide
       */
      function DPicker(element) {
        var _this = this;

        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        if (!(this instanceof DPicker)) {
          return new DPicker(element, options);
        }

        var _getContainer = this._getContainer(element),
            container = _getContainer.container,
            attributes = _getContainer.attributes,
            reference = _getContainer.reference;

        this._container = uuid();
        this.data = {};

        var defaults = {
          months: DPicker.dateAdapter.months(),
          days: DPicker.dateAdapter.weekdays(),
          empty: false,
          valid: true,
          order: ['months', 'years', 'time', 'days'],
          hideOnDayClick: true,
          hideOnEnter: true,
          hideOnOutsideClick: true,
          showCalendarOnInputFocus: true,
          showCalendarButton: false,
          disabled: false,
          siblingMonthDayClick: false,
          firstDayOfWeek: DPicker.dateAdapter.firstDayOfWeek()
        };

        for (var i in defaults) {
          if (options[i] !== undefined) {
            this.data[i] = options[i];
            continue;
          }

          this.data[i] = defaults[i];
        }

        this.data.inputName = attributes.name ? attributes.name : options.inputName ? options.inputName : 'dpicker-input';
        this.data.inputId = attributes.id ? attributes.id : options.inputId ? options.inputId : uuid();

        this._setData('format', [attributes.format, 'DD/MM/YYYY']);

        this.events = {};
        for (var _i in DPicker.events) {
          this.events[_i] = DPicker.events[_i].bind(this);
        }

        var methods = DPicker.properties;

        methods.min = new Date(1986, 0, 1);
        methods.max = DPicker.dateAdapter.setMonth(DPicker.dateAdapter.addYears(new Date(), 1), 11);
        methods.format = this.data.format;

        for (var _i2 in methods) {
          this._createGetSet(_i2);
          if (typeof methods[_i2] === 'function') {
            this._setData(_i2, [options[_i2], methods[_i2](attributes)]);
          } else {
            this._setData(_i2, [options[_i2], attributes[_i2], methods[_i2]], methods[_i2] instanceof Date);
          }
        }

        if (options.empty === true) {
          this.data.empty = true;
        }

        this._setData('model', [attributes.value, options.model, new Date()], true);

        this.onChange = options.onChange;

        document.addEventListener('click', this.events.hide);
        document.addEventListener('touchend', function (e) {
          if (!_this.data.hideOnOutsideClick) {
            return;
          }

          if (isElementInContainer(e.target, _this._container)) {
            return;
          }

          _this.events.inputBlur(e);
        });

        this.initialize();

        this._mount(container);
        this.isValid(this.data.model);

        container.id = this._container;
        container.addEventListener('keydown', this.events.keyDown);

        var input = container.querySelector('input');
        input.addEventListener('blur', this.events.inputBlur);

        if (reference) {
          var refAttributes = reference.attributes;
          for (var _i3 = 0; _i3 < refAttributes.length; _i3++) {
            if (!input.hasAttribute(refAttributes[_i3].name)) {
              input.setAttribute(refAttributes[_i3].name, refAttributes[_i3].value);
            }
          }

          if (reference.classList && reference.classList.length) {
            [].slice.call(reference.classList).forEach(function (val) {
              if (!input.classList.contains(val)) {
                input.classList.add(val);
              }
            });
          }
        }

        return this;
      }

      /**
       * _setData is a helper to set this.data values
       * @param {String} key
       * @param {Array} values the first value that is not undefined will be set in this.data[key]
       * @param {Boolean} isDate whether this value should be a date instance
       * @private
       */
      DPicker.prototype._setData = function (key, values) {
        var isDate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        for (var i = 0; i < values.length; i++) {
          if (values[i] === undefined || values[i] === '') {
            continue;
          }

          if (isDate === false) {
            this.data[key] = values[i];
            break;
          }

          if (DPicker.dateAdapter.isValid(values[i])) {
            this.data[key] = values[i];
            break;
          }

          this.data[key] = new Date();

          var temp = DPicker.dateAdapter.isValidWithFormat(values[i], this.data.format);

          if (temp !== false) {
            this.data[key] = temp;
            break;
          }
        }
      };

      /**
       * Creates getters and setters for a given key
       * When the setter is called we will redraw
       * @param {String} key
       * @private
       */
      DPicker.prototype._createGetSet = function (key) {
        if (DPicker.prototype.hasOwnProperty(key)) {
          return;
        }

        Object.defineProperty(DPicker.prototype, key, {
          get: function get() {
            return this.data[key];
          },
          set: function set(newValue) {
            this.data[key] = newValue;
            this.isValid(this.data.model);
            this.redraw();
          }
        });
      };

      /**
       * Gives the dpicker container and it's attributes
       * If the container is an input, the parentNode is the container but the attributes are the input's ones
       * @param {Element} container
       * @private
       * @return {Object} { container, attributes }
       */
      DPicker.prototype._getContainer = function (container) {
        if (!container) {
          throw new ReferenceError('Can not initialize DPicker without a container');
        }

        var attributes = {};[].slice.call(container.attributes).forEach(function (attribute) {
          attributes[attribute.name] = attribute.value;
        });

        // small jquery fix: new DPicker($('<input type="datetime" name="mydatetime" autocomplete="off" step="30">'))
        if (container.length !== undefined && container[0]) {
          container = container[0];
        }

        var reference = null;

        if (container.tagName === 'INPUT') {
          if (!container.parentNode) {
            throw new ReferenceError('Can not initialize DPicker on an input without parent node');
          }

          var parentNode = container.parentNode;
          reference = container;
          container.parentNode.removeChild(reference);
          container = parentNode;
          container.classList.add('dpicker');
        }

        return { container: container, attributes: attributes, reference: reference };
      };

      /**
       * Allows to render more child elements with modules
       * @private
       * @return Array<VNode>
       */
      DPicker.prototype._getRenderChild = function () {
        if (!this.data.display) {
          return '';
        }

        var children = {
          years: this.renderYears(this.events, this.data),
          months: this.renderMonths(this.events, this.data)

          // add module render functions
        };for (var render in DPicker.renders) {
          children[render] = DPicker.renders[render].call(this, this.events, this.data);
        }

        children.days = this.renderDays(this.events, this.data);

        return this.data.order.filter(function (e) {
          return children[e];
        }).map(function (e) {
          return children[e];
        });
      };

      /**
       * Mount rendered element to the DOM
       * @private
       */
      DPicker.prototype._mount = function (element) {
        this._tree = this.getTree();
        element.appendChild(this._tree);
      };

      /**
       * Return the whole nodes tree
       * @return {Element}
       */
      DPicker.prototype.getTree = function () {
        return this.renderContainer(this.events, this.data, [this.renderInput(this.events, this.data), this.renderCalendar(this.events, this.data), this.render(this.events, this.data, this._getRenderChild())]);
      };

      /**
       * Checks whether the given model is a valid moment instance
       * This method does set the `.valid` flag by checking min/max allowed inputs
       * Note that it will return `true` if the model is valid even if it's not in the allowed range
       * @param {Date} date
       * @return {boolean}
       */
      DPicker.prototype.isValid = function checkValidity(date) {
        if (DPicker.dateAdapter.isValid(date) === false) {
          this.data.valid = false;
          return false;
        }

        var isSame = void 0;
        var temp = void 0;

        if (this.data.time === false) {
          temp = DPicker.dateAdapter.resetHours(date);
          isSame = DPicker.dateAdapter.isSameDay(temp, this.data.min) || DPicker.dateAdapter.isSameDay(temp, this.data.max);
        } else {
          temp = DPicker.dateAdapter.resetSeconds(date);
          isSame = DPicker.dateAdapter.isSameHours(temp, this.data.min) || DPicker.dateAdapter.isSameHours(temp, this.data.max);
        }

        if (isSame === false && (DPicker.dateAdapter.isBefore(temp, this.data.min) || DPicker.dateAdapter.isAfter(temp, this.data.max))) {
          this.data.valid = false;
          return true;
        }

        this.data.valid = true;
        return true;
      };

      /**
       * Render input
       * @fires DPicker#inputChange
       * @fires DPicker#inputBlur
       * @fires DPicker#inputFocus
       * @return {Element} the rendered virtual dom hierarchy
       */
      DPicker.prototype.renderInput = function (events, data, toRender) {
        var _;

        return _ = document.createElement('input'), _.setAttribute('id', '' + String(data.inputId) + ''), _.setAttribute('value', '' + String(data.empty === true ? '' : DPicker.dateAdapter.format(data.model, data.format)) + ''), _.setAttribute('type', 'text'), _.setAttribute('min', '' + String(data.min) + ''), _.setAttribute('max', '' + String(data.max) + ''), _.setAttribute('format', '' + String(data.format) + ''), _.onchange = events.inputChange, _.onfocus = events.inputFocus, _.setAttribute('name', '' + String(data.inputName) + ''), _.setAttribute('autocomplete', 'off'), _.setAttribute('aria-invalid', '' + String(data.valid) + ''), _.setAttribute('aria-haspopup', 'aria-haspopup'), data.disabled && _.setAttribute('disabled', 'disabled'), _.setAttribute('class', '' + String(data.valid === false ? 'dpicker-invalid' : '') + ''), _;
      };

      /**
       * Dpicker container if no input is provided
       * if an input is given, it's parentNode will be the container
       *
       * ```
       * div.dpicker
       * ```
       *
       * @return {Element} the rendered virtual dom hierarchy
       */
      DPicker.prototype.renderContainer = function (events, data, toRender) {
        var _dpicker;

        return _dpicker = document.createElement('div'), _dpicker.setAttribute('class', 'dpicker'), _appendChild(_dpicker, [toRender]), _dpicker;
      };

      /**
       * Render a DPicker
       *
       * ```
       * div.dpicker#[uuid]
       *   input[type=text]
       *   div.dpicker-container.dpicker-[visible|invisible]
       * ```
       *
       * @see {@link DPicker#renderYears}
       * @see {@link DPicker#renderMonths}
       * @see {@link DPicker#renderDays}
       * @return {Element} the rendered virtual dom hierarchy
       */
      DPicker.prototype.render = function (events, data, toRender) {
        var _div;

        return _div = document.createElement('div'), _div.setAttribute('aria-hidden', '' + String(data.display === false) + ''), _div.setAttribute('class', 'dpicker-container ' + String(data.display === true ? 'dpicker-visible' : 'dpicker-invisible') + ' ' + String(data.time === true ? 'dpicker-has-time' : '') + ''), _appendChild(_div, [' ', toRender, ' ']), _div;
      };

      /**
       * Render Years
       * ```
       * select[name='dpicker-year']
       * ```
       * @fires DPicker#yearChange
       * @return {Element} the rendered virtual dom hierarchy
       */
      DPicker.prototype.renderYears = function (events, data, toRender) {
        var _select;

        var modelYear = DPicker.dateAdapter.getYear(data.model);
        var futureYear = DPicker.dateAdapter.getYear(data.max) + 1;
        var pastYear = DPicker.dateAdapter.getYear(data.min);
        var options = [];

        while (--futureYear >= pastYear) {
          var _option;

          options.push((_option = document.createElement('option'), _option.setAttribute('value', '' + String(futureYear) + ''), _setAttribute(_option, futureYear === modelYear ? 'selected' : '', futureYear === modelYear ? 'selected' : ''), _appendChild(_option, [futureYear]), _option));
        }

        return _select = document.createElement('select'), _select.onchange = events.yearChange, _select.setAttribute('name', 'dpicker-year'), _select.setAttribute('aria-label', 'Year'), _appendChild(_select, [options]), _select;
      };

      /**
       * Render Months
       * ```
       * select[name='dpicker-month']
       * ```
       * @fires DPicker#monthChange
       * @return {Element} the rendered virtual dom hierarchy
       */
      DPicker.prototype.renderMonths = function (events, data, toRender) {
        var _select2;

        var modelMonth = DPicker.dateAdapter.getMonth(data.model);
        var currentYear = DPicker.dateAdapter.getYear(data.model);
        var months = data.months;
        var showMonths = data.months.map(function (e, i) {
          return i;
        });

        if (DPicker.dateAdapter.getYear(data.max) === currentYear) {
          var maxMonth = DPicker.dateAdapter.getMonth(data.max);
          showMonths = showMonths.filter(function (e) {
            return e <= maxMonth;
          });
        }

        if (DPicker.dateAdapter.getYear(data.min) === currentYear) {
          var minMonth = DPicker.dateAdapter.getMonth(data.min);
          showMonths = showMonths.filter(function (e) {
            return e >= minMonth;
          });
        }

        return _select2 = document.createElement('select'), _select2.onchange = events.monthChange, _select2.setAttribute('name', 'dpicker-month'), _select2.setAttribute('aria-label', 'Month'), _appendChild(_select2, [' ', showMonths.map(function (e, i) {
          var _option2;

          return _option2 = document.createElement('option'), _setAttribute(_option2, e === modelMonth ? 'selected' : '', e === modelMonth ? 'selected' : ''), _option2.setAttribute('value', '' + String(e) + ''), _appendChild(_option2, [months[e]]), _option2;
        }), ' ']), _select2;
      };

      /**
       * Render Days
       * ```
       * table
       *  tr
       *    td
       *      button|span
       * ```
       * @method
       * @fires DPicker#dayClick
       * @fires DPicker#dayKeyDown
       * @return {Element} the rendered virtual dom hierarchy
       */
      DPicker.prototype.renderDays = function (events, data, toRender) {
        var _tr, _table;

        var daysInMonth = DPicker.dateAdapter.daysInMonth(data.model);
        var daysInPreviousMonth = DPicker.dateAdapter.daysInMonth(DPicker.dateAdapter.subMonths(data.model, 1));
        var firstLocaleDay = data.firstDayOfWeek;
        var firstDay = DPicker.dateAdapter.firstWeekDay(data.model) - 1;
        var currentDay = DPicker.dateAdapter.getDate(data.model);
        var currentMonth = DPicker.dateAdapter.getMonth(data.model);
        var currentYear = DPicker.dateAdapter.getYear(data.model);

        var days = new Array(7);

        data.days.map(function (e, i) {
          days[i < firstLocaleDay ? 6 - i : i - firstLocaleDay] = e;
        });

        var rows = new Array(Math.ceil(0.1 + (firstDay + daysInMonth) / 7)).fill(0);
        var day = void 0;
        var dayActive = void 0;
        var previousMonth = false;
        var nextMonth = false;
        var loopend = true;
        var classActive = '';

        return _table = document.createElement('table'), _appendChild(_table, [' ', (_tr = document.createElement('tr'), _appendChild(_tr, [days.map(function (e) {
          var _th;

          return _th = document.createElement('th'), _appendChild(_th, [e]), _th;
        })]), _tr), ' ', rows.map(function (e, row) {
          var _tr2;

          return _tr2 = document.createElement('tr'), _appendChild(_tr2, [new Array(7).fill(0).map(function (e, col) {
            var _2, _td, _3;

            dayActive = loopend;
            classActive = '';

            if (col <= firstDay && row === 0) {
              day = daysInPreviousMonth - (firstDay - col);
              dayActive = false;
              previousMonth = true;
            } else if (col === firstDay + 1 && row === 0) {
              previousMonth = false;
              day = 1;
              dayActive = true;
            } else {
              if (day === daysInMonth) {
                day = 0;
                dayActive = false;
                loopend = false;
                nextMonth = true;
              }

              day++;
            }

            var dayMonth = previousMonth ? currentMonth : nextMonth ? currentMonth + 2 : currentMonth + 1;
            var currentDayModel = new Date(currentYear, dayMonth - 1, day);

            if (dayActive === false && data.siblingMonthDayClick === true) {
              dayActive = true;
            }

            if (data.min && dayActive) {
              dayActive = DPicker.dateAdapter.isSameOrAfter(currentDayModel, data.min);
            }

            if (data.max && dayActive) {
              dayActive = DPicker.dateAdapter.isSameOrBefore(currentDayModel, data.max);
            }

            if (dayActive === true && previousMonth === false && nextMonth === false && currentDay === day) {
              classActive = 'dpicker-active';
            }

            var button = (_2 = document.createElement('button'), _2.setAttribute('value', '' + String(day) + ''), _2.setAttribute('aria-label', 'Day ' + String(day) + ''), _2.setAttribute('aria-disabled', '' + String(dayActive) + ''), _2.onclick = previousMonth === false && nextMonth === false ? events.dayClick : previousMonth === true ? events.previousMonthDayClick : events.nextMonthDayClick, _2.setAttribute('type', 'button'), _2.onkeydown = events.dayKeyDown, _2.setAttribute('class', '' + String(classActive) + ''), _appendChild(_2, [day]), _2);

            return _td = document.createElement('td'), _td.setAttribute('class', '' + String(dayActive === true ? 'dpicker-active' : 'dpicker-inactive') + ''), _appendChild(_td, [' ', dayActive === true ? button : (_3 = document.createElement('span'), _3.setAttribute('class', '' + String(classActive) + ''), _appendChild(_3, [day]), _3), ' ']), _td;
          })]), _tr2;
        }), ' ']), _table;
      };

      /**
      * Outputs a calendar button
      * @param {DPicker.events} events
      * @param {DPicker.data} data
      * @param {Array} toRender
      * @fires DPicker#toggleCalendar
      *
      * @return {Element}
      */
      DPicker.prototype.renderCalendar = function renderCalendar(events, data) {
        var _dpickerButtonCalendar;

        if (!data.showCalendarButton) return '';
        return _dpickerButtonCalendar = document.createElement('button'), _dpickerButtonCalendar.setAttribute('tabindex', '-1'), _dpickerButtonCalendar.onclick = events.toggleCalendar, _dpickerButtonCalendar.setAttribute('name', 'dpicker-button-calendar'), _dpickerButtonCalendar.setAttribute('class', 'dpicker-button-calendar'), _dpickerButtonCalendar;
      };

      /**
       * Called after parseInputAttributes but before render
       * Decorate it with modules to do things on initialization
       */
      DPicker.prototype.initialize = function () {
        this.isValid(this.data.model);
      };

      /**
       * The model setter, feel free to decorate through modules
       * @param {Date} newValue
       */
      DPicker.prototype.modelSetter = function (newValue) {
        this.data.empty = !newValue;

        if (this.isValid(newValue) === true) {
          this.data.model = newValue;
        }

        this.redraw();
      };

      /**
       * Redraws the date picker
       * Decorate it with modules to do things before redraw
       */
      DPicker.prototype.redraw = function () {
        var _this2 = this;

        window.requestAnimationFrame(function () {
          _this2._tree = nanomorph(_this2._tree, _this2.getTree());
        });
      };

      Object.defineProperties(DPicker.prototype, {
        'container': {
          get: function get() {
            return this._container;
          }
        },
        'inputId': {
          get: function get() {
            return this.data.inputId;
          }
        },
        'input': {
          get: function get() {
            if (this.data.empty) {
              return '';
            }

            return DPicker.dateAdapter.format(this.data.model, this.data.format);
          }
        },
        /**
         * @method onChange
         * @param {Object} data
         * @param {Object} DPickerEvent
         * @param {Boolean} DPickerEvent.modelChanged whether the model has changed
         * @param {String} DPickerEvent.name the DPicker internal event name
         * @param {Event} DPickerEvent.event the original DOM event
         * @description
         * Example:
         *
         * ```javascript
         * var dpicker = new DPicker(container)
         *
         * dpicker.onChange = function(data, DPickerEvent) {
         *   // has the model changed?
         *   console.log(DPickerEvent.modelChanged)
         *   // the name of the internal event
         *   console.log(DPickerEvent.name)
         *   // the origin DOM event
         *   console.dir(DPickerEvent.event)
         * }
         * ```
         *
         */
        'onChange': {
          set: function set(onChange) {
            var _this3 = this;

            this._onChange = function (dpickerEvent) {
              return !onChange ? false : onChange(_this3.data, dpickerEvent);
            };
          },
          get: function get() {
            return this._onChange;
          }
        },

        'valid': {
          get: function get() {
            return this.data.valid;
          }
        },

        'empty': {
          get: function get() {
            return this.data.empty;
          }
        },

        'model': {
          set: function set(newValue) {
            this.modelSetter(newValue);
          },
          get: function get() {
            return this.data.model;
          }
        }
      });

      /**
       * Creates a decorator, use it to decorate public methods.
       *
       * For example:
       * ```javascript
       * DPicker.events.inputChange = DPicker.decorate(DPicker.events.inputChange, function DoSomethingOnInputChange (evt) {
       *   // do something
       * })
       *
       * ```
       *
       * The decoration will be stopped if the method returns `false`! It's like an internal `preventDefault` to avoid altering the original event.
       *
       * @param {String} which    one of events, calls
       * @param {Function} origin the origin function that will be decorated
       */
      DPicker.decorate = function (origin, decoration) {
        return function decorator() {
          if (decoration.apply(this, arguments) === false) {
            return false;
          }

          return origin.apply(this, arguments);
        };
      };

      DPicker.events = {
        /**
          * Hides the date picker if user does not click inside the container
          * @event DPicker#hide
          */
        hide: function hide(evt) {
          if (this.data.hideOnOutsideClick === false || this.display === false) {
            return;
          }

          var node = evt.target;

          if (isElementInContainer(node.parentNode, this._container)) {
            return;
          }

          this.display = false;
          this.onChange({ modelChanged: false, name: 'hide', event: evt });
        },

        /**
          * Change model on input change
          * @event DPicker#inputChange
          */
        inputChange: function inputChange(evt) {
          if (!evt.target.value) {
            this.data.empty = true;
          } else {
            var newModel = DPicker.dateAdapter.isValidWithFormat(evt.target.value, this.data.format);

            if (newModel !== false) {
              if (this.isValid(newModel) === true) {
                this.data.model = newModel;
              }
            }

            this.data.empty = false;
          }

          this.redraw();
          this.onChange({ modelChanged: true, name: 'inputChange', event: evt });
        },

        /**
          * Hide on input blur
          * @event DPicker#inputBlur
          */
        inputBlur: function inputBlur(evt) {
          if (this.display === false) {
            return;
          }

          var node = evt.relatedTarget || evt.target;

          if (isElementInContainer(node.parentNode, this._container)) {
            return;
          }

          this.display = false;
          this.onChange({ modelChanged: false, name: 'inputBlur', event: evt });
        },

        /**
          * Show the container on input focus
          * @event DPicker#inputFocus
          */
        inputFocus: function inputFocus(evt) {
          if (this.data.showCalendarOnInputFocus === false) {
            return;
          }

          this.display = true;
          if (evt.target && evt.target.select) {
            evt.target.select();
          }

          this.onChange({ modelChanged: false, name: 'inputFocus', event: evt });
        },

        /**
          * On year change, update the model value
          * @event DPicker#yearChange
          */
        yearChange: function yearChange(evt) {
          this.data.empty = false;
          this.model = DPicker.dateAdapter.setYear(this.data.model, evt.target.options[evt.target.selectedIndex].value);

          if (DPicker.dateAdapter.isAfter(this.model, this.data.max)) {
            this.model = DPicker.dateAdapter.setMonth(this.data.model, DPicker.dateAdapter.getMonth(this.data.max));
          } else if (DPicker.dateAdapter.isBefore(this.model, this.data.min)) {
            this.model = DPicker.dateAdapter.setMonth(this.data.model, DPicker.dateAdapter.getMonth(this.data.min));
          }

          this.redraw();
          this.onChange({ modelChanged: true, name: 'yearChange', event: evt });
        },

        /**
          * On month change, update the model value
          * @event DPicker#monthChange
          */
        monthChange: function monthChange(evt) {
          this.data.empty = false;
          this.model = DPicker.dateAdapter.setMonth(this.data.model, evt.target.options[evt.target.selectedIndex].value);

          this.redraw();
          this.onChange({ modelChanged: true, name: 'monthChange', event: evt });
        },

        /**
          * On day click, update the model value
          * @event DPicker#dayClick
          */
        dayClick: function dayClick(evt) {
          evt.preventDefault();
          evt.stopPropagation();
          this.model = DPicker.dateAdapter.setDate(this.data.model, evt.target.value);
          this.data.empty = false;

          if (this.data.hideOnDayClick) {
            this.display = false;
          }

          this.redraw();
          this.onChange({ modelChanged: true, name: 'dayClick', event: evt });
        },

        /**
          * On previous month day click (only if `siblingMonthDayClick` is enabled)
          * @event DPicker#previousMonthDayClick
          */
        previousMonthDayClick: function previousMonthDayClick(evt) {
          if (!this.data.siblingMonthDayClick) {
            return;
          }

          evt.preventDefault();
          evt.stopPropagation();

          this.model = DPicker.dateAdapter.setDate(DPicker.dateAdapter.subMonths(this.data.model, 1), evt.target.value);

          this.data.empty = false;

          if (this.data.hideOnDayClick) {
            this.display = false;
          }

          this.redraw();
          this.onChange({ modelChanged: true, name: 'previousMonthDayClick', event: evt });
        },

        /**
          * On next month day click (only if `siblingMonthDayClick` is enabled)
          * @event DPicker#nextMonthDayClick
          */
        nextMonthDayClick: function nextMonthDayClick(evt) {
          if (!this.data.siblingMonthDayClick) {
            return;
          }

          evt.preventDefault();
          evt.stopPropagation();

          this.model = DPicker.dateAdapter.setDate(DPicker.dateAdapter.addMonths(this.data.model, 1), evt.target.value);

          this.data.empty = false;

          if (this.data.hideOnDayClick) {
            this.display = false;
          }

          this.redraw();
          this.onChange({ modelChanged: true, name: 'nextMonthDayClick', event: evt });
        },

        /**
          * On day key down - not implemented
          * @event DPicker#dayKeyDown
          */
        dayKeyDown: function dayKeyDown() {},

        /**
         * On key down inside the dpicker container,
         * intercept enter and escape keys to hide the container
         * @event DPicker#keyDown
         */
        keyDown: function keyDown(evt) {
          if (!this.data.hideOnEnter) {
            return;
          }

          var key = evt.which || evt.keyCode;

          if (key !== 13 && key !== 27) {
            return;
          }

          document.getElementById(this.inputId).blur();
          this.display = false;
          this.onChange({ modelChanged: false, name: 'keyDown', event: evt });
        },

        /**
        * Show calendar
        * @event Dpicker#showCalendar
        */
        toggleCalendar: function showCalendar(evt) {
          this.display = !this.display;
          this.onChange({ modelChanged: false, name: 'toggleCalendar', event: evt });
        }

        /**
         * @property {Object} renders Renders dictionnary
         */
      };DPicker.renders = {};

      /**
       * @property {Object} properties Properties dictionnary (getters and setters will be set)
       */
      DPicker.properties = { display: false, disabled: false

        /**
         * @property {DateAdapter} dateAdapter The date adapter
         * @see {@link /_api?id=module_momentadapter|MomentDateAdapter}
         */
      };DPicker.dateAdapter = undefined;

      /**
       * uuid generator
       * https://gist.github.com/jed/982883
       * @private
       */
      function uuid() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (a) {
          return (a ^ Math.random() * 16 >> a / 4).toString(16);
        });
      }

      /**
       * isElementInContainer tests if an element is inside a given id
       * @param {Element} parent a DOM node
       * @param {String} containerId the container id
       * @private
       * @return {Boolean}
       */
      function isElementInContainer(parent, containerId) {
        while (parent && parent !== document) {
          if (parent.getAttribute('id') === containerId) {
            return true;
          }

          parent = parent.parentNode;
        }

        return false;
      }

      module.exports = DPicker;
    }, { "nanomorph": 1, "yo-yoify/lib/appendChild": 4, "yo-yoify/lib/setAttribute": 5 }], 9: [function (require, module, exports) {
      'use strict';

      var MomentDateAdapter = require('./adapters/moment.js');
      var DPicker = require('./dpicker');

      DPicker.dateAdapter = MomentDateAdapter;

      module.exports = DPicker;
    }, { "./adapters/moment.js": 6, "./dpicker": 8 }], 10: [function (require, module, exports) {
      'use strict';

      module.exports = function (DPicker) {
        /**
        * Get element position in parent
        * @param {Element} children
        * @return {Number}
        * @private
        */
        function positionInParent(children) {
          return [].indexOf.call(children.parentNode.children, children);
        }

        /**
        * Move left
        * @param {Element} td
        * @param {Element} table
        * @private
        */
        function left(td, table) {
          // previous td
          var previous = td.previousElementSibling;

          if (previous && previous.querySelector('button')) {
            previous.querySelector('button').focus();
            return;
          }

          // previous row, last button
          previous = td.parentNode.previousElementSibling;
          previous = previous ? previous.querySelector('td:last-child button') : null;

          if (previous) {
            return previous.focus();
          }

          // last tr first td
          var last = table.querySelector('tr:last-child').querySelectorAll('td.dpicker-active');
          last[last.length - 1].querySelector('button').focus();
        }

        /**
        * Move right
        * @param {Element} td
        * @param {Element} table
        * @private
        */
        function right(td, table) {
          var next = td.nextElementSibling;

          if (next && next.querySelector('button')) {
            next.querySelector('button').focus();
            return;
          }

          next = td.parentNode.nextElementSibling;
          next = next ? next.querySelector('td:first-child button') : null;

          if (next) {
            return next.focus();
          }

          table.querySelector('tr:first-child').nextElementSibling.querySelectorAll('td.dpicker-active')[0].querySelector('button').focus();
        }

        /**
        * Go up or down
        * @param {Element} td
        * @param {Element} table
        * @param {String} direction up or down
        * @private
        */
        function upOrDown(td, table, direction) {
          var position = positionInParent(td);
          var sibling = (direction === 'up' ? 'previous' : 'next') + 'ElementSibling';
          // previous line (tr), element (td) at the same position
          var previousOrNext = td.parentNode[sibling];
          previousOrNext = previousOrNext ? previousOrNext.children[position] : null;

          if (previousOrNext && previousOrNext.classList.contains('dpicker-active')) {
            previousOrNext.querySelector('button').focus();
            return;
          }

          // last or first line
          var lastOrFirst = table.querySelector('tr:' + (direction === 'up' ? 'last-child' : 'first-child'));

          // find the last available position with a button beggining by the bottom
          while (lastOrFirst) {
            if (lastOrFirst.children[position].classList.contains('dpicker-active')) {
              lastOrFirst.children[position].querySelector('button').focus();
              return;
            }

            lastOrFirst = lastOrFirst[sibling];
          }
        }

        /**
        * Go up
        * @param {Element} td
        * @param {Element} table
        * @private
        */
        function up(td, table) {
          return upOrDown(td, table, 'up');
        }

        /**
        * Go down
        * @param {Element} td
        * @param {Element} table
        * @private
        */
        function down(td, table) {
          return upOrDown(td, table, 'down');
        }

        /**
        * Enables arrow navigation inside days
        * @event DPicker#dayKeyDown
        */
        DPicker.events.dayKeyDown = DPicker.decorate(DPicker.events.dayKeyDown, function DayKeyDown(evt) {
          var key = evt.which || evt.keyCode;
          if (key > 40 || key < 37) {
            return;
          }

          evt.preventDefault();

          var td = evt.target.parentNode;
          var table = td.parentNode.parentNode;

          switch (key) {
            // left
            case 37:
              {
                return left(td, table);
              }
            // right
            case 39:
              {
                return right(td, table);
              }
            // up
            case 38:
              {
                return up(td, table);
              }
            // down
            case 40:
              {
                return down(td, table);
              }
          }
        });

        return DPicker;
      };
    }, {}], 11: [function (require, module, exports) {
      'use strict';

      module.exports = function (DPicker) {
        /**
        * Enables modifiers on `+[num]` and `-[num]` where:
        * - `+` gives the current date
        * - `+10` gives the current date + 10 days
        * - `-` gives the previous date
        * - `-10` gives the previous date - 10 days
        * @param {Event} DOMEvent
        * @listens DPicker#inputChange
        */
        DPicker.events.inputChange = DPicker.decorate(DPicker.events.inputChange, function ModifierInputChange(evt) {
          var first = evt.target.value.charAt(0);
          var x = evt.target.value.slice(1) || 0;

          if (first !== '-' && first !== '+') {
            return;
          }

          if (first === '-') {
            if (!x) {
              x = 1;
            }
            x = -x;
          }

          if (x < 0) {
            this.model = DPicker.dateAdapter.subDays(new Date(), -x);
          } else {
            this.model = DPicker.dateAdapter.addDays(new Date(), x);
          }

          this.onChange({ modelChanged: true, name: 'inputChange', event: evt });
        });
      };
    }, {}], 12: [function (require, module, exports) {
      'use strict';

      var _appendChild = require('yo-yoify/lib/appendChild'),
          _setAttribute = require('yo-yoify/lib/setAttribute');

      module.exports = function (DPicker) {
        /**
          * Renders concated months and Years
          * @param {DPicker.events} events
          * @param {DPicker.data} data
          * @param {Array} toRender
          * @fires DPicker#monthYearChange
          *
          * @return {Element}
          */
        DPicker.renders.monthsAndYears = function rendermonthsAndYears(events, data) {
          var _select;

          var minMonth = DPicker.dateAdapter.getMonth(data.min);
          var minYear = DPicker.dateAdapter.getYear(data.min);

          var modelMonth = DPicker.dateAdapter.getMonth(data.model);
          var modelYear = DPicker.dateAdapter.getYear(data.model);

          var maxMonth = DPicker.dateAdapter.getMonth(data.max);
          var maxYear = DPicker.dateAdapter.getYear(data.max);

          // start with min month in year of min
          var showMonths = data.months.map(function (e, i) {
            return { month: i, year: minYear };
          }).filter(function (obj) {
            return obj.month >= minMonth;
          });

          // fill months of all years
          var yearsToShow = maxYear - minYear;
          for (var index = 1; index <= yearsToShow; index++) {
            showMonths = showMonths.concat(data.months.map(function (e, i) {
              return { month: i, year: minYear + index };
            }));
          }

          // remove unnecessary months of max year
          showMonths = showMonths.filter(function (obj) {
            if (obj.year < maxYear) {
              return true;
            }
            return obj.month <= maxMonth;
          });

          return _select = document.createElement('select'), _select.onchange = events.monthYearChange, _select.setAttribute('name', 'dpicker-monthYear'), _select.setAttribute('aria-label', 'Month and Year'), _appendChild(_select, [' ', showMonths.map(function (obj) {
            var _option;

            return _option = document.createElement('option'), _setAttribute(_option, obj.month === modelMonth && obj.year === modelYear ? 'selected' : '', obj.month === modelMonth && obj.year === modelYear ? 'selected' : ''), _option.setAttribute('value', '' + String(obj.month) + '-' + String(obj.year) + ''), _appendChild(_option, [data.months[obj.month] + ' ' + obj.year]), _option;
          }), ' ']), _select;
        };

        /**
        * MonthYear
        * @event Dpicker#monthYearChange
        */
        DPicker.events.monthYearChange = function monthYearChange(evt) {
          var selectedMonthYear = evt.target.value.split('-');
          this.model = DPicker.dateAdapter.setMonth(this.data.model, selectedMonthYear[0]);
          this.model = DPicker.dateAdapter.setYear(this.data.model, selectedMonthYear[1]);
          this.redraw();
          this.onChange({ modelChanged: true, name: 'monthYearChange', event: evt });
        };
      };
    }, { "yo-yoify/lib/appendChild": 4, "yo-yoify/lib/setAttribute": 5 }], 13: [function (require, module, exports) {
      'use strict';

      module.exports = function (DPicker) {
        /**
        * Renders previous month arrow
        * @param {DPicker.events} events
        * @param {DPicker.data} data
        * @param {Array} toRender
        * @fires DPicker#previousMonth
        *
        * @return {Element}
        */
        DPicker.renders.previousMonth = function renderPreviousMonth(events, data) {
          var _button;

          var previous = DPicker.dateAdapter.subMonths(data.model, 1);
          return _button = document.createElement('button'), _button.onclick = events.previousMonth, _button.setAttribute('class', 'dpicker-previous-month ' + String(!DPicker.dateAdapter.isSameMonth(previous, data.min) && DPicker.dateAdapter.isBefore(previous, data.min) ? 'dpicker-invisible' : '') + ''), _button;
        };

        /**
        * Renders next month arrow
        * @param {DPicker.events} events
        * @param {DPicker.data} data
        * @param {Array} toRender
        * @fires DPicker#nextMonth
        *
        * @return {Element}
        */
        DPicker.renders.nextMonth = function renderNextMonth(events, data) {
          var _dpickerNextMonth;

          var next = DPicker.dateAdapter.addMonths(data.model, 1);
          return _dpickerNextMonth = document.createElement('button'), _dpickerNextMonth.onclick = events.nextMonth, _dpickerNextMonth.setAttribute('class', 'dpicker-next-month ' + String(!DPicker.dateAdapter.isSameMonth(next, data.max) && DPicker.dateAdapter.isAfter(next, data.max) ? 'dpicker-invisible' : '') + ''), _dpickerNextMonth;
        };

        /**
        * Previous month
        * @event Dpicker#previousMonth
        */
        DPicker.events.previousMonth = function previousMonth(evt) {
          this.model = DPicker.dateAdapter.subMonths(this.data.model, 1);
          this.redraw();
          this.onChange({ modelChanged: true, name: 'previousMonth', event: evt });
        };

        /**
        * Next month
        * @event Dpicker#nextMonth
        */
        DPicker.events.nextMonth = function nextMonth(evt) {
          this.model = DPicker.dateAdapter.addMonths(this.data.model, 1);
          this.redraw();
          this.onChange({ modelChanged: true, name: 'nextMonth', event: evt });
        };
      };
    }, {}], 14: [function (require, module, exports) {
      'use strict';

      var _appendChild = require('yo-yoify/lib/appendChild'),
          _setAttribute = require('yo-yoify/lib/setAttribute');

      module.exports = function (DPicker) {
        var MINUTES = new Array(60).fill(0).map(function (e, i) {
          return i;
        });
        var HOURS24 = new Array(24).fill(0).map(function (e, i) {
          return i;
        });
        var HOURS12 = new Array(12).fill(0).map(function (e, i) {
          return i === 0 ? 12 : i;
        });
        HOURS12.push(HOURS12.shift());
        var MERIDIEM_TOKENS = ['AM', 'PM'];

        /**
        * Get hours and minutes according to the given `data` (meridiem, min/max consideration)
        * @param {Object} data
        * @private
        * @return {Object} `{hours, minutes}` both arrays of numbers
        */
        function getHoursMinutes(data) {
          var hours = data.meridiem ? HOURS12 : HOURS24;
          var step = parseInt(data.step);
          var minutes = MINUTES.filter(function (e) {
            return e % step === 0;
          });[data.min, data.max].map(function (e, i) {
            if (!DPicker.dateAdapter.isSameDay(data.model, e)) {
              return;
            }

            var xHours = DPicker.dateAdapter.getHours(e);
            var xMinutes = DPicker.dateAdapter.getMinutes(e);
            if (i === 0 && xMinutes + step > 60) {
              DPicker.dateAdapter.setMinutes(DPicker.dateAdapter.setHours(e, i === 0 ? ++xHours : --xHours), 0);
              xMinutes = 0;
            }

            if (data.meridiem === true) {
              if (xHours > 12) {
                xHours = xHours - 12;
              } else if (xHours === 0) {
                xHours = 12;
              }
            }

            hours = hours.filter(function (e) {
              return i === 0 ? e >= xHours : e <= xHours;
            });
          });

          return { hours: hours, minutes: minutes };
        }

        /**
        * Pad left for minutes \o/
        * @param {Number} v
        * @private
        * @return {String}
        */
        function padLeftZero(v) {
          return v < 10 ? '0' + v : '' + v;
        }

        /**
        * Handles minutes steps to focus on the correct input and set the model minutes/hours
        * @private
        */
        function minutesStep() {
          if (!this.data.time || parseInt(this.data.step, 10) <= 1) {
            return;
          }

          var _getHoursMinutes = getHoursMinutes(this.data),
              minutes = _getHoursMinutes.minutes;

          var modelMinutes = DPicker.dateAdapter.getMinutes(this.data.model);

          if (modelMinutes < minutes[0]) {
            this.data.model = DPicker.dateAdapter.setMinutes(this.data.model, minutes[0]);
            modelMinutes = minutes[0];
          }

          if (modelMinutes > minutes[minutes.length - 1]) {
            this.data.model = DPicker.dateAdapter.setMinutes(DPicker.dateAdapter.addHours(this.data.model, 1), 0);
            return;
          }

          minutes[minutes.length] = 60;
          modelMinutes = minutes.reduce(function (prev, curr) {
            return Math.abs(curr - modelMinutes) < Math.abs(prev - modelMinutes) ? curr : prev;
          });

          minutes.length--;

          this.data.model = DPicker.dateAdapter.setMinutes(this.data.model, modelMinutes);
        }

        /**
        * Render Time
        * ```
        * select[name='dpicker-hour']
        * select[name='dpicker-minutes']
        * ```
        *
        * @fires DPicker#hoursChange
        * @fires DPicker#minutesChange
        * @fires DPicker#minuteHoursChange
        * @fires DPicker#meridiemChange
        * @return {Element} the rendered virtual dom hierarchy
        */
        DPicker.renders.time = function renderTime(events, data) {
          var _dpickerTime2;

          if (!data.time) {
            var _dpickerTime;

            return _dpickerTime = document.createElement('span'), _dpickerTime.setAttribute('style', 'display: none;'), _dpickerTime.setAttribute('class', 'dpicker-time'), _dpickerTime;
          }

          var modelHours = DPicker.dateAdapter.getHours(data.model);

          if (data.meridiem !== false) {
            modelHours = modelHours > 12 ? modelHours - 12 : modelHours;
            modelHours = modelHours === 0 ? 12 : modelHours;
          }

          var _getHoursMinutes2 = getHoursMinutes(data),
              hours = _getHoursMinutes2.hours,
              minutes = _getHoursMinutes2.minutes;

          var modelMinutes = DPicker.dateAdapter.getMinutes(data.model);
          var selects = [];
          var modelStringValue = modelHours + ':' + modelMinutes;

          var minHours = DPicker.dateAdapter.getHours(data.min);
          var minMinutes = DPicker.dateAdapter.getMinutes(data.min);
          var maxHours = DPicker.dateAdapter.getHours(data.max);
          var maxMinutes = DPicker.dateAdapter.getMinutes(data.max);

          if (data.concatHoursAndMinutes) {
            var _select;

            var options = [].concat.apply([], minutes.map(function (minute) {
              return hours.map(function (hour) {
                return hour + ':' + minute;
              });
            })).filter(function (e) {
              var hm = e.split(':').map(parseFloat);

              if (DPicker.dateAdapter.isSameDay(data.model, data.min) && hm[0] === minHours && hm[1] < minMinutes) {
                return false;
              }

              if (DPicker.dateAdapter.isSameDay(data.model, data.max) && hm[0] === maxHours && hm[1] > maxMinutes) {
                return false;
              }

              return true;
            }).sort(function (a, b) {
              a = a.split(':').map(parseFloat);
              b = b.split(':').map(parseFloat);

              if (a[0] < b[0]) return -1;
              if (a[0] > b[0]) return 1;
              if (a[1] < b[1]) return -1;
              if (a[1] > b[1]) return 1;
              return 0;
            }).map(function (value) {
              var _option;

              var text = value.split(':').map(padLeftZero).join(':');
              return _option = document.createElement('option'), _setAttribute(_option, value === modelStringValue ? 'selected' : '', value === modelStringValue ? 'selected' : ''), _option.setAttribute('value', '' + String(value) + ''), _appendChild(_option, [text]), _option;
            });

            selects.push((_select = document.createElement('select'), _select.onchange = events.minuteHoursChange, _select.setAttribute('name', 'dpicker-time'), _select.setAttribute('aria-label', 'time'), _appendChild(_select, [options]), _select));
          } else {
            var _select2, _select3;

            selects.push((_select2 = document.createElement('select'), _select2.onchange = events.hoursChange, _select2.setAttribute('name', 'dpicker-hours'), _select2.setAttribute('aria-label', 'Hours'), _appendChild(_select2, [hours.map(function (e, i) {
              var _option2;

              return _option2 = document.createElement('option'), _setAttribute(_option2, e === modelHours ? 'selected' : '', e === modelHours ? 'selected' : ''), _option2.setAttribute('value', '' + String(e) + ''), _appendChild(_option2, [padLeftZero(e)]), _option2;
            })]), _select2), (_select3 = document.createElement('select'), _select3.onchange = events.minutesChange, _select3.setAttribute('name', 'dpicker-minutes'), _select3.setAttribute('aria-label', 'Minutes'), _appendChild(_select3, [minutes.filter(function (e) {
              if (DPicker.dateAdapter.isSameDay(data.model, data.min) && modelHours === minHours && e < minMinutes) {
                return false;
              }

              if (DPicker.dateAdapter.isSameDay(data.model, data.max) && modelHours === maxHours && e > maxMinutes) {
                return false;
              }

              return true;
            }).map(function (e, i) {
              var _option3;

              return _option3 = document.createElement('option'), _setAttribute(_option3, e === modelMinutes ? 'selected' : '', e === modelMinutes ? 'selected' : ''), _option3.setAttribute('value', '' + String(e) + ''), _appendChild(_option3, [padLeftZero(e)]), _option3;
            })]), _select3));
          }

          if (data.meridiem !== false) {
            var _select4;

            var modelMeridiem = DPicker.dateAdapter.getMeridiem(data.model);
            selects.push((_select4 = document.createElement('select'), _select4.onchange = events.meridiemChange, _select4.setAttribute('name', 'dpicker-meridiem'), _appendChild(_select4, [' ', MERIDIEM_TOKENS.map(function (e) {
              var _option4;

              return _option4 = document.createElement('option'), _setAttribute(_option4, modelMeridiem === e ? 'selected' : '', modelMeridiem === e ? 'selected' : ''), _option4.setAttribute('value', '' + String(e) + ''), _appendChild(_option4, [e]), _option4;
            }), ' ']), _select4));
          }

          return _dpickerTime2 = document.createElement('span'), _dpickerTime2.setAttribute('class', 'dpicker-time'), _appendChild(_dpickerTime2, [selects]), _dpickerTime2;
        };

        /**
          * On hours change
          * @event DPicker#hoursChange
          */
        DPicker.events.hoursChange = function hoursChange(evt) {
          this.data.empty = false;

          var val = parseInt(evt.target.options[evt.target.selectedIndex].value, 10);

          if (this.data.meridiem !== false) {
            if (DPicker.dateAdapter.getMeridiem(this.data.model) === MERIDIEM_TOKENS[1] /** PM **/) {
                val = val === 12 ? 12 : val + 12;
              } else if (val === 12) {
              val = 0;
            }
          }

          this.model = DPicker.dateAdapter.setHours(this.data.model, val);
          if (evt.redraw === false) {
            this.redraw();
          }
          this.onChange({ modelChanged: true, name: 'hoursChange', event: evt });
        };

        /**
          * On minutes change
          * @event DPicker#minutesChange
          */
        DPicker.events.minutesChange = function minutesChange(evt) {
          this.data.empty = false;
          this.model = DPicker.dateAdapter.setMinutes(this.data.model, evt.target.options[evt.target.selectedIndex].value);
          if (evt.redraw === false) {
            this.redraw();
          }
          this.onChange({ modelChanged: true, name: 'minutesChange', event: evt });
        };

        /**
          * On minutes hours change when concatHoursAndMinutes is `true`
          * @event DPicker#minuteHoursChange
          */
        DPicker.events.minuteHoursChange = function minuteHoursChange(evt) {
          var val = evt.target.options[evt.target.selectedIndex].value.split(':');

          // whoops, hacked myself
          this.events.hoursChange({ target: { options: [{ value: val[0] }], selectedIndex: 0 }, redraw: false });
          this.events.minutesChange({ target: { options: [{ value: val[1] }], selectedIndex: 0 }, redraw: false });
          this.redraw();
        };

        /**
          * On meridiem change
          * @event DPicker#meridiemChange
          */
        DPicker.events.meridiemChange = function meridiemChange(evt) {
          this.data.empty = false;
          var val = evt.target.options[evt.target.selectedIndex].value;
          var hours = DPicker.dateAdapter.getHours(this.data.model);

          if (val === MERIDIEM_TOKENS[0] /** AM **/) {
              hours = hours === 12 ? 0 : hours - 12;
            } else {
            hours = hours === 12 ? 12 : hours + 12;
          }

          this.model = DPicker.dateAdapter.setHours(this.data.model, hours);
          this.redraw();
          this.onChange({ modelChanged: true, name: 'meridiemChange', event: evt });
        };

        /**
        * @ignore
        */
        DPicker.events.inputChange = DPicker.decorate(DPicker.events.inputChange, function timeInputChange() {
          minutesStep.apply(this);
        });

        /**
        * @ignore
        */
        DPicker.prototype.initialize = DPicker.decorate(DPicker.prototype.initialize, function timeInitialize() {
          minutesStep.apply(this);
        });

        /**
        * @ignore
        */
        DPicker.prototype.redraw = DPicker.decorate(DPicker.prototype.redraw, function timeRedraw() {
          minutesStep.apply(this);
        });

        /**
        * @property {Boolean} [time=false] If `type="datetime"` attribute is defined, evaluates to `true`
        */
        DPicker.properties.time = function getTimeAttribute(attributes) {
          return attributes.type === 'datetime';
        };

        /**
        * @property {Boolean} [step=1] Takes the value of the attribute `step` or `1`
        */
        DPicker.properties.step = function getStepAttribute(attributes) {
          return attributes.step ? parseInt(attributes.step, 10) : 1;
        };

        /**
        * @property {Boolean} [meridiem=false]
        */
        DPicker.properties.meridiem = false;

        /**
        * @property {Boolean} [concatHoursAndMinutes=false]
        */
        DPicker.properties.concatHoursAndMinutes = false;

        /**
        * ## Time
        *
        * Adds the following options/attributes/getters/setters:
        *
        * - `{boolean} [options.time=false]` Wether to add time or not, defaults to `true` if input type is `datetime`
        * - `{boolean} [options.meridiem=false]` 12 vs 24 time format where 24 is the default, this can be set through the `meridiem` attribute
        * - `{Number} [options.step=1]` Minutes step
        *
        **/

        return DPicker;
      };
    }, { "yo-yoify/lib/appendChild": 4, "yo-yoify/lib/setAttribute": 5 }] }, {}, [7])(7);
});

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Inspired by Google Closure:
// http://closure-library.googlecode.com/svn/docs/
// closure_goog_array_array.js.html#goog.array.clear



var value = __webpack_require__(0);

module.exports = function () {
	value(this).length = 0;
	return this;
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// eslint-disable-next-line no-empty-function
module.exports = function () {};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toInteger = __webpack_require__(63)

  , max = Math.max;

module.exports = function (value) {
 return max(0, toInteger(value));
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isValue = __webpack_require__(5);

var forEach = Array.prototype.forEach, create = Object.create;

var process = function (src, obj) {
	var key;
	for (key in src) obj[key] = src[key];
};

// eslint-disable-next-line no-unused-vars
module.exports = function (opts1 /*, …options*/) {
	var result = create(null);
	forEach.call(arguments, function (options) {
		if (!isValue(options)) return;
		process(Object(options), result);
	});
	return result;
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var create = Object.create, getPrototypeOf = Object.getPrototypeOf, plainObject = {};

module.exports = function (/* CustomCreate*/) {
	var setPrototypeOf = Object.setPrototypeOf, customCreate = arguments[0] || create;
	if (typeof setPrototypeOf !== "function") return false;
	return getPrototypeOf(setPrototypeOf(customCreate(null), plainObject)) === plainObject;
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* eslint no-proto: "off" */

// Big thanks to @WebReflection for sorting this out
// https://gist.github.com/WebReflection/5593554



var isObject        = __webpack_require__(71)
  , value           = __webpack_require__(0)
  , objIsPrototypeOf = Object.prototype.isPrototypeOf
  , defineProperty  = Object.defineProperty
  , nullDesc        = {
	configurable: true,
	enumerable: false,
	writable: true,
	value: undefined
}
  , validate;

validate = function (obj, prototype) {
	value(obj);
	if (prototype === null || isObject(prototype)) return obj;
	throw new TypeError("Prototype must be null or an object");
};

module.exports = (function (status) {
	var fn, set;
	if (!status) return null;
	if (status.level === 2) {
		if (status.set) {
			set = status.set;
			fn = function (obj, prototype) {
				set.call(validate(obj, prototype), prototype);
				return obj;
			};
		} else {
			fn = function (obj, prototype) {
				validate(obj, prototype).__proto__ = prototype;
				return obj;
			};
		}
	} else {
		fn = function self(obj, prototype) {
			var isNullBase;
			validate(obj, prototype);
			isNullBase = objIsPrototypeOf.call(self.nullPolyfill, obj);
			if (isNullBase) delete self.nullPolyfill.__proto__;
			if (prototype === null) prototype = self.nullPolyfill;
			obj.__proto__ = prototype;
			if (isNullBase) defineProperty(self.nullPolyfill, "__proto__", nullDesc);
			return obj;
		};
	}
	return Object.defineProperty(fn, "level", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: status.level
	});
}(
	(function () {
		var tmpObj1 = Object.create(null)
		  , tmpObj2 = {}
		  , set
		  , desc = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__");

		if (desc) {
			try {
				set = desc.set; // Opera crashes at this point
				set.call(tmpObj1, tmpObj2);
			} catch (ignore) {}
			if (Object.getPrototypeOf(tmpObj1) === tmpObj2) return { set: set, level: 2 };
		}

		tmpObj1.__proto__ = tmpObj2;
		if (Object.getPrototypeOf(tmpObj1) === tmpObj2) return { level: 2 };

		tmpObj1 = {};
		tmpObj1.__proto__ = tmpObj2;
		if (Object.getPrototypeOf(tmpObj1) === tmpObj2) return { level: 1 };

		return false;
	})()
));

__webpack_require__(68);


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(77)()
	? String.prototype.contains
	: __webpack_require__(78);


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isIterable = __webpack_require__(82);

module.exports = function (value) {
	if (!isIterable(value)) throw new TypeError(value + " is not iterable");
	return value;
};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(84)() ? Map : __webpack_require__(88);


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function selectorParser(node) {
    if (!node.sel) {
        return {
            tagName: '',
            id: '',
            className: '',
        };
    }
    var sel = node.sel;
    var hashIdx = sel.indexOf('#');
    var dotIdx = sel.indexOf('.', hashIdx);
    var hash = hashIdx > 0 ? hashIdx : sel.length;
    var dot = dotIdx > 0 ? dotIdx : sel.length;
    var tagName = hashIdx !== -1 || dotIdx !== -1 ?
        sel.slice(0, Math.min(hash, dot)) :
        sel;
    var id = hash < dot ? sel.slice(hash + 1, dot) : void 0;
    var className = dotIdx > 0 ? sel.slice(dot + 1).replace(/\./g, ' ') : void 0;
    return {
        tagName: tagName,
        id: id,
        className: className,
    };
}
exports.selectorParser = selectorParser;
//# sourceMappingURL=selectorParser.js.map

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function createElement(tagName) {
    return document.createElement(tagName);
}
function createElementNS(namespaceURI, qualifiedName) {
    return document.createElementNS(namespaceURI, qualifiedName);
}
function createTextNode(text) {
    return document.createTextNode(text);
}
function createComment(text) {
    return document.createComment(text);
}
function insertBefore(parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
}
function removeChild(node, child) {
    node.removeChild(child);
}
function appendChild(node, child) {
    node.appendChild(child);
}
function parentNode(node) {
    return node.parentNode;
}
function nextSibling(node) {
    return node.nextSibling;
}
function tagName(elm) {
    return elm.tagName;
}
function setTextContent(node, text) {
    node.textContent = text;
}
function getTextContent(node) {
    return node.textContent;
}
function isElement(node) {
    return node.nodeType === 1;
}
function isText(node) {
    return node.nodeType === 3;
}
function isComment(node) {
    return node.nodeType === 8;
}
exports.htmlDomApi = {
    createElement: createElement,
    createElementNS: createElementNS,
    createTextNode: createTextNode,
    createComment: createComment,
    insertBefore: insertBefore,
    removeChild: removeChild,
    appendChild: appendChild,
    parentNode: parentNode,
    nextSibling: nextSibling,
    tagName: tagName,
    setTextContent: setTextContent,
    getTextContent: getTextContent,
    isElement: isElement,
    isText: isText,
    isComment: isComment,
};
exports.default = exports.htmlDomApi;
//# sourceMappingURL=htmldomapi.js.map

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.array = Array.isArray;
function primitive(s) {
    return typeof s === 'string' || typeof s === 'number';
}
exports.primitive = primitive;
//# sourceMappingURL=is.js.map

/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["setup"] = setup;
/* harmony export (immutable) */ __webpack_exports__["run"] = run;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_xstream__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_xstream___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_xstream__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__adapt__ = __webpack_require__(48);


function logToConsoleError(err) {
    var target = err.stack || err;
    if (console && console.error) {
        console.error(target);
    }
    else if (console && console.log) {
        console.log(target);
    }
}
function makeSinkProxies(drivers) {
    var sinkProxies = {};
    for (var name_1 in drivers) {
        if (drivers.hasOwnProperty(name_1)) {
            sinkProxies[name_1] = __WEBPACK_IMPORTED_MODULE_0_xstream___default.a.createWithMemory();
        }
    }
    return sinkProxies;
}
function callDrivers(drivers, sinkProxies) {
    var sources = {};
    for (var name_2 in drivers) {
        if (drivers.hasOwnProperty(name_2)) {
            sources[name_2] = drivers[name_2](sinkProxies[name_2], name_2);
            if (sources[name_2] && typeof sources[name_2] === 'object') {
                sources[name_2]._isCycleSource = name_2;
            }
        }
    }
    return sources;
}
// NOTE: this will mutate `sources`.
function adaptSources(sources) {
    for (var name_3 in sources) {
        if (sources.hasOwnProperty(name_3) &&
            sources[name_3] &&
            typeof sources[name_3]['shamefullySendNext'] === 'function') {
            sources[name_3] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__adapt__["a" /* adapt */])(sources[name_3]);
        }
    }
    return sources;
}
function replicateMany(sinks, sinkProxies) {
    var sinkNames = Object.keys(sinks).filter(function (name) { return !!sinkProxies[name]; });
    var buffers = {};
    var replicators = {};
    sinkNames.forEach(function (name) {
        buffers[name] = { _n: [], _e: [] };
        replicators[name] = {
            next: function (x) { return buffers[name]._n.push(x); },
            error: function (err) { return buffers[name]._e.push(err); },
            complete: function () { },
        };
    });
    var subscriptions = sinkNames.map(function (name) {
        return __WEBPACK_IMPORTED_MODULE_0_xstream___default.a.fromObservable(sinks[name]).subscribe(replicators[name]);
    });
    sinkNames.forEach(function (name) {
        var listener = sinkProxies[name];
        var next = function (x) {
            listener._n(x);
        };
        var error = function (err) {
            logToConsoleError(err);
            listener._e(err);
        };
        buffers[name]._n.forEach(next);
        buffers[name]._e.forEach(error);
        replicators[name].next = next;
        replicators[name].error = error;
        // because sink.subscribe(replicator) had mutated replicator to add
        // _n, _e, _c, we must also update these:
        replicators[name]._n = next;
        replicators[name]._e = error;
    });
    buffers = null; // free up for GC
    return function disposeReplication() {
        subscriptions.forEach(function (s) { return s.unsubscribe(); });
        sinkNames.forEach(function (name) { return sinkProxies[name]._c(); });
    };
}
function disposeSources(sources) {
    for (var k in sources) {
        if (sources.hasOwnProperty(k) &&
            sources[k] &&
            sources[k].dispose) {
            sources[k].dispose();
        }
    }
}
function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
}
/**
 * A function that prepares the Cycle application to be executed. Takes a `main`
 * function and prepares to circularly connects it to the given collection of
 * driver functions. As an output, `setup()` returns an object with three
 * properties: `sources`, `sinks` and `run`. Only when `run()` is called will
 * the application actually execute. Refer to the documentation of `run()` for
 * more details.
 *
 * **Example:**
 * ```js
 * import {setup} from '@cycle/run';
 * const {sources, sinks, run} = setup(main, drivers);
 * // ...
 * const dispose = run(); // Executes the application
 * // ...
 * dispose();
 * ```
 *
 * @param {Function} main a function that takes `sources` as input and outputs
 * `sinks`.
 * @param {Object} drivers an object where keys are driver names and values
 * are driver functions.
 * @return {Object} an object with three properties: `sources`, `sinks` and
 * `run`. `sources` is the collection of driver sources, `sinks` is the
 * collection of driver sinks, these can be used for debugging or testing. `run`
 * is the function that once called will execute the application.
 * @function setup
 */
function setup(main, drivers) {
    if (typeof main !== "function") {
        throw new Error("First argument given to Cycle must be the 'main' " + "function.");
    }
    if (typeof drivers !== "object" || drivers === null) {
        throw new Error("Second argument given to Cycle must be an object " +
            "with driver functions as properties.");
    }
    if (isObjectEmpty(drivers)) {
        throw new Error("Second argument given to Cycle must be an object " +
            "with at least one driver function declared as a property.");
    }
    var sinkProxies = makeSinkProxies(drivers);
    var sources = callDrivers(drivers, sinkProxies);
    var adaptedSources = adaptSources(sources);
    var sinks = main(adaptedSources);
    if (typeof window !== 'undefined') {
        window.Cyclejs = window.Cyclejs || {};
        window.Cyclejs.sinks = sinks;
    }
    function _run() {
        var disposeReplication = replicateMany(sinks, sinkProxies);
        return function dispose() {
            disposeSources(sources);
            disposeReplication();
        };
    }
    return { sinks: sinks, sources: sources, run: _run };
}
/**
 * Takes a `main` function and circularly connects it to the given collection
 * of driver functions.
 *
 * **Example:**
 * ```js
 * import run from '@cycle/run';
 * const dispose = run(main, drivers);
 * // ...
 * dispose();
 * ```
 *
 * The `main` function expects a collection of "source" streams (returned from
 * drivers) as input, and should return a collection of "sink" streams (to be
 * given to drivers). A "collection of streams" is a JavaScript object where
 * keys match the driver names registered by the `drivers` object, and values
 * are the streams. Refer to the documentation of each driver to see more
 * details on what types of sources it outputs and sinks it receives.
 *
 * @param {Function} main a function that takes `sources` as input and outputs
 * `sinks`.
 * @param {Object} drivers an object where keys are driver names and values
 * are driver functions.
 * @return {Function} a dispose function, used to terminate the execution of the
 * Cycle.js program, cleaning up resources used.
 * @function run
 */
function run(main, drivers) {
    var program = setup(main, drivers);
    if (typeof window !== 'undefined' &&
        window['CyclejsDevTool_startGraphSerializer']) {
        window['CyclejsDevTool_startGraphSerializer'](program.sinks);
    }
    return program.run();
}
/* harmony default export */ __webpack_exports__["default"] = (run);
//# sourceMappingURL=index.js.map

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.App = App;

var _dom = __webpack_require__(13);

var _xstream = __webpack_require__(2);

var _xstream2 = _interopRequireDefault(_xstream);

var _dpickerAll = __webpack_require__(21);

var _dpickerAll2 = _interopRequireDefault(_dpickerAll);

var _dpicker = __webpack_require__(49);

__webpack_require__(94);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var inputText = document.getElementById('input');
var container = document.getElementById('dpicker');

var DEFAULT_FORMAT = 'LL LTS';
var DEFAULT_ORDER = ['previousMonth', 'months', 'years', 'nextMonth', 'days', 'time'];
var dpicker = new _dpickerAll2.default(container, { hideOnOutsideClick: false, hideOnDayClick: false, hideOnEnter: false, siblingMonthDayClick: false, order: DEFAULT_ORDER });

function App(sources) {
  var valid = dpicker.valid;
  var empty = dpicker.empty;

  var min = (0, _dpicker.CycleDPicker)('.cycle-dpicker-min', {
    DOM: sources.DOM,
    props: _xstream2.default.of({ name: 'min', model: dpicker.min, format: DEFAULT_FORMAT, order: DEFAULT_ORDER })
  });

  var minVDom$ = min.DOM;
  var minState$ = min.state.map(function (e) {
    return e.model;
  });

  var max = (0, _dpicker.CycleDPicker)('.cycle-dpicker-max', {
    DOM: sources.DOM,
    props: _xstream2.default.of({ name: 'max', model: dpicker.max, max: _dpickerAll2.default.dateAdapter.addYears(dpicker.max, 1), format: DEFAULT_FORMAT, order: DEFAULT_ORDER })
  });

  var maxVDom$ = max.DOM;
  var maxState$ = max.state.map(function (e) {
    return e.model;
  });

  var validDpicker$ = _xstream2.default.create({
    start: function start(listener) {
      dpicker.onChange = function (d, event) {
        if (valid !== d.valid || empty !== d.empty) {
          listener.next(d);
          valid = d;
          empty = d;
        } else if (event.modelChanged) {
          listener.next(d);
        }
      };
    },
    stop: function stop() {},
    id: 0
  });

  var form = [{
    key: 'display',
    default: true,
    label: 'Show'
  }, {
    key: 'time',
    default: true,
    label: 'Time'
  }, {
    key: 'concatHoursAndMinutes',
    default: true,
    label: 'Concat hours and minutes'
  }, {
    key: 'siblingMonthDayClick',
    default: false,
    label: 'Sibling months day'
  }, {
    key: 'step',
    default: 15,
    min: 1,
    max: 60,
    label: function label(value) {
      return 'Step (' + value + ')';
    }
  }, {
    key: 'meridiem',
    default: true,
    label: 'Meridiem'
  }, {
    key: 'format',
    default: DEFAULT_FORMAT,
    label: 'Format'
  }, {
    key: 'valid',
    default: true,
    label: 'Valid',
    readonly: true
  }];

  var formLength = form.length;

  var form$ = form.map(function (e) {
    e.value = e.default;

    return sources.DOM.select('input[name="' + e.key + '"]').events('change').map(function (event) {
      switch (_typeof(e.default)) {
        case 'boolean':
          e.value = event.target.checked;
          break;
        default:
          e.value = event.target.value;
          break;
      }

      return e;
    }).startWith(e);
  });

  form$.push(validDpicker$.startWith(dpicker.data), minVDom$, minState$, maxVDom$, maxState$);

  var vdom$ = _xstream2.default.combine.apply(null, form$).map(function (configArray) {
    for (var i = 0; i < formLength; i++) {
      var param = configArray[i];

      if (param.readonly) {
        continue;
      }

      if (param.key === 'siblingMonthDayClick' && dpicker.data.siblingMonthDayClick !== param.value) {
        dpicker.data[param.key] = param.value;
        dpicker.redraw();
        continue;
      }

      if (dpicker[param.key] !== param.value) {
        dpicker[param.key] = param.value;
      }
    }

    var minVDom = configArray[formLength + 1];
    var minValue = configArray[formLength + 2];

    var maxVDom = configArray[formLength + 3];
    var maxValue = configArray[formLength + 4];

    if (minValue && dpicker.min !== minValue) {
      dpicker.min = minValue;
    }

    if (maxValue && dpicker.max !== maxValue) {
      dpicker.max = maxValue;
    }

    return { config: dpicker.data, minVDom: minVDom, maxVDom: maxVDom };
  }).map(function (_ref) {
    var config = _ref.config,
        minVDom = _ref.minVDom,
        maxVDom = _ref.maxVDom;

    inputText.textContent = dpicker.input;

    var childNodes = [];
    var booleanNodes = [];
    var otherNodes = [];

    for (var i = 0; i < formLength; i++) {
      var formItem = form[i];
      var value = config[formItem.key];
      var labelValue = typeof formItem.label === 'function' ? formItem.label(value) : formItem.label;
      var readonly = formItem.readonly === undefined ? false : formItem.readonly;

      var attrs = void 0;

      switch (_typeof(formItem.default)) {
        case 'boolean':
          booleanNodes.push((0, _dom.label)('.checkbox-inline', [(0, _dom.input)({ attrs: { name: formItem.key, checked: value, type: 'checkbox', readonly: readonly, disabled: readonly, id: formItem.key } }), labelValue]));
          continue;
        case 'number':
          attrs = { name: formItem.key, value: value, type: 'range', min: formItem.min, max: formItem.max, id: formItem.key };
          break;
        case 'string':
          attrs = { name: formItem.key, value: value, type: 'text', id: formItem.key };
          break;
      }

      otherNodes.push((0, _dom.div)('.col-md-6', [(0, _dom.label)({ attrs: { for: formItem.key } }, labelValue), (0, _dom.input)('.form-control', { attrs: attrs })]));
    }

    var data = {};

    Object.keys(dpicker.data).filter(function (e) {
      return !~['months', 'days', 'order', 'inputName', 'inputId'].indexOf(e);
    }).forEach(function (e) {
      data[e] = dpicker.data[e];
    });

    childNodes.push((0, _dom.div)('.row.form-group', (0, _dom.div)('.col-md-12', booleanNodes)), (0, _dom.div)('.row.form-group', otherNodes), (0, _dom.div)('.row.form-group', [(0, _dom.div)('.col-md-6', [(0, _dom.label)({ attrs: { for: 'min' } }, 'Minimum'), minVDom]), (0, _dom.div)('.col-md-6', [(0, _dom.label)({ attrs: { for: 'max' } }, 'Maximum'), maxVDom])]), (0, _dom.div)('.row.form-group', [(0, _dom.div)('.col-md-12', [(0, _dom.p)('.alert.alert-warning', ['Type ', (0, _dom.kbd)('+'), ' to jump to today\'s date. ', (0, _dom.kbd)('+100'), ' will return today + 100 days. ', (0, _dom.kbd)('-100'), ' does the opposite'])])]), (0, _dom.h2)('Configuration: '), (0, _dom.div)('.row', (0, _dom.div)('.col-md-12', [(0, _dom.pre)((0, _dom.code)(JSON.stringify(data, null, 2)))])));

    return (0, _dom.div)('.row', (0, _dom.div)('.col-md-12', childNodes));
  });

  return {
    DOM: vdom$
  };
}

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var xstream_1 = __webpack_require__(2);
var adapt_1 = __webpack_require__(8);
var fromEvent_1 = __webpack_require__(14);
var BodyDOMSource = (function () {
    function BodyDOMSource(_name) {
        this._name = _name;
    }
    BodyDOMSource.prototype.select = function (selector) {
        // This functionality is still undefined/undecided.
        return this;
    };
    BodyDOMSource.prototype.elements = function () {
        var out = adapt_1.adapt(xstream_1.default.of(document.body));
        out._isCycleSource = this._name;
        return out;
    };
    BodyDOMSource.prototype.events = function (eventType, options) {
        if (options === void 0) { options = {}; }
        var stream;
        stream = fromEvent_1.fromEvent(document.body, eventType, options.useCapture, options.preventDefault);
        var out = adapt_1.adapt(stream);
        out._isCycleSource = this._name;
        return out;
    };
    return BodyDOMSource;
}());
exports.BodyDOMSource = BodyDOMSource;
//# sourceMappingURL=BodyDOMSource.js.map

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var xstream_1 = __webpack_require__(2);
var adapt_1 = __webpack_require__(8);
var fromEvent_1 = __webpack_require__(14);
var DocumentDOMSource = (function () {
    function DocumentDOMSource(_name) {
        this._name = _name;
    }
    DocumentDOMSource.prototype.select = function (selector) {
        // This functionality is still undefined/undecided.
        return this;
    };
    DocumentDOMSource.prototype.elements = function () {
        var out = adapt_1.adapt(xstream_1.default.of(document));
        out._isCycleSource = this._name;
        return out;
    };
    DocumentDOMSource.prototype.events = function (eventType, options) {
        if (options === void 0) { options = {}; }
        var stream;
        stream = fromEvent_1.fromEvent(document, eventType, options.useCapture, options.preventDefault);
        var out = adapt_1.adapt(stream);
        out._isCycleSource = this._name;
        return out;
    };
    return DocumentDOMSource;
}());
exports.DocumentDOMSource = DocumentDOMSource;
//# sourceMappingURL=DocumentDOMSource.js.map

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ScopeChecker_1 = __webpack_require__(19);
var utils_1 = __webpack_require__(7);
var matchesSelector_1 = __webpack_require__(20);
function toElArray(input) {
    return Array.prototype.slice.call(input);
}
var ElementFinder = (function () {
    function ElementFinder(namespace, isolateModule) {
        this.namespace = namespace;
        this.isolateModule = isolateModule;
    }
    ElementFinder.prototype.call = function (rootElement) {
        var namespace = this.namespace;
        var selector = utils_1.getSelectors(namespace);
        if (!selector) {
            return rootElement;
        }
        var fullScope = utils_1.getFullScope(namespace);
        var scopeChecker = new ScopeChecker_1.ScopeChecker(fullScope, this.isolateModule);
        var topNode = fullScope
            ? this.isolateModule.getElement(fullScope) || rootElement
            : rootElement;
        var topNodeMatchesSelector = !!fullScope && !!selector && matchesSelector_1.matchesSelector(topNode, selector);
        return toElArray(topNode.querySelectorAll(selector))
            .filter(scopeChecker.isDirectlyInScope, scopeChecker)
            .concat(topNodeMatchesSelector ? [topNode] : []);
    };
    return ElementFinder;
}());
exports.ElementFinder = ElementFinder;
//# sourceMappingURL=ElementFinder.js.map

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var xstream_1 = __webpack_require__(2);
var ScopeChecker_1 = __webpack_require__(19);
var utils_1 = __webpack_require__(7);
var matchesSelector_1 = __webpack_require__(20);
/**
 * Finds (with binary search) index of the destination that id equal to searchId
 * among the destinations in the given array.
 */
function indexOf(arr, searchId) {
    var minIndex = 0;
    var maxIndex = arr.length - 1;
    var currentIndex;
    var current;
    while (minIndex <= maxIndex) {
        currentIndex = ((minIndex + maxIndex) / 2) | 0; // tslint:disable-line:no-bitwise
        current = arr[currentIndex];
        var currentId = current.id;
        if (currentId < searchId) {
            minIndex = currentIndex + 1;
        }
        else if (currentId > searchId) {
            maxIndex = currentIndex - 1;
        }
        else {
            return currentIndex;
        }
    }
    return -1;
}
function stopPropagation() {
    this.oldStopPropagation();
    this.propagationHasBeenStopped = true;
}
/**
 * Manages "Event delegation", by connecting an origin with multiple
 * destinations.
 *
 * Attaches a DOM event listener to the DOM element called the "origin",
 * and delegates events to "destinations", which are subjects as outputs
 * for the DOMSource. Simulates bubbling or capturing, with regards to
 * isolation boundaries too.
 */
var EventDelegator = (function () {
    function EventDelegator(origin, eventType, useCapture, isolateModule, preventDefault) {
        if (preventDefault === void 0) { preventDefault = false; }
        var _this = this;
        this.origin = origin;
        this.eventType = eventType;
        this.useCapture = useCapture;
        this.isolateModule = isolateModule;
        this.preventDefault = preventDefault;
        this.destinations = [];
        this._lastId = 0;
        if (preventDefault) {
            if (useCapture) {
                this.listener = function (ev) {
                    ev.preventDefault();
                    _this.capture(ev);
                };
            }
            else {
                this.listener = function (ev) {
                    ev.preventDefault();
                    _this.bubble(ev);
                };
            }
        }
        else {
            if (useCapture) {
                this.listener = function (ev) { return _this.capture(ev); };
            }
            else {
                this.listener = function (ev) { return _this.bubble(ev); };
            }
        }
        origin.addEventListener(eventType, this.listener, useCapture);
    }
    EventDelegator.prototype.updateOrigin = function (newOrigin) {
        this.origin.removeEventListener(this.eventType, this.listener, this.useCapture);
        newOrigin.addEventListener(this.eventType, this.listener, this.useCapture);
        this.origin = newOrigin;
    };
    /**
     * Creates a *new* destination given the namespace and returns the subject
     * representing the destination of events. Is not referentially transparent,
     * will always return a different output for the same input.
     */
    EventDelegator.prototype.createDestination = function (namespace) {
        var _this = this;
        var id = this._lastId++;
        var selector = utils_1.getSelectors(namespace);
        var scopeChecker = new ScopeChecker_1.ScopeChecker(utils_1.getFullScope(namespace), this.isolateModule);
        var subject = xstream_1.default.create({
            start: function () { },
            stop: function () {
                if ('requestIdleCallback' in window) {
                    requestIdleCallback(function () {
                        _this.removeDestination(id);
                    });
                }
                else {
                    _this.removeDestination(id);
                }
            },
        });
        var destination = { id: id, selector: selector, scopeChecker: scopeChecker, subject: subject };
        this.destinations.push(destination);
        return subject;
    };
    /**
     * Removes the destination that has the given id.
     */
    EventDelegator.prototype.removeDestination = function (id) {
        var i = indexOf(this.destinations, id);
        i >= 0 && this.destinations.splice(i, 1); // tslint:disable-line:no-unused-expression
    };
    EventDelegator.prototype.capture = function (ev) {
        var n = this.destinations.length;
        for (var i = 0; i < n; i++) {
            var dest = this.destinations[i];
            if (matchesSelector_1.matchesSelector(ev.target, dest.selector)) {
                dest.subject._n(ev);
            }
        }
    };
    EventDelegator.prototype.bubble = function (rawEvent) {
        var origin = this.origin;
        if (!origin.contains(rawEvent.currentTarget)) {
            return;
        }
        var roof = origin.parentElement;
        var ev = this.patchEvent(rawEvent);
        for (var el = ev.target; el && el !== roof; el = el.parentElement) {
            if (!origin.contains(el)) {
                ev.stopPropagation();
            }
            if (ev.propagationHasBeenStopped) {
                return;
            }
            this.matchEventAgainstDestinations(el, ev);
        }
    };
    EventDelegator.prototype.patchEvent = function (event) {
        var pEvent = event;
        pEvent.propagationHasBeenStopped = false;
        pEvent.oldStopPropagation = pEvent.stopPropagation;
        pEvent.stopPropagation = stopPropagation;
        return pEvent;
    };
    EventDelegator.prototype.matchEventAgainstDestinations = function (el, ev) {
        var n = this.destinations.length;
        for (var i = 0; i < n; i++) {
            var dest = this.destinations[i];
            if (!dest.scopeChecker.isDirectlyInScope(el)) {
                continue;
            }
            if (matchesSelector_1.matchesSelector(el, dest.selector)) {
                this.mutateEventCurrentTarget(ev, el);
                dest.subject._n(ev);
            }
        }
    };
    EventDelegator.prototype.mutateEventCurrentTarget = function (event, currentTargetElement) {
        try {
            Object.defineProperty(event, "currentTarget", {
                value: currentTargetElement,
                configurable: true,
            });
        }
        catch (err) {
            console.log("please use event.ownerTarget");
        }
        event.ownerTarget = currentTargetElement;
    };
    return EventDelegator;
}());
exports.EventDelegator = EventDelegator;
//# sourceMappingURL=EventDelegator.js.map

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MapPolyfill = __webpack_require__(30);
var IsolateModule = (function () {
    function IsolateModule() {
        this.elementsByFullScope = new MapPolyfill();
        this.delegatorsByFullScope = new MapPolyfill();
        this.fullScopesBeingUpdated = [];
    }
    IsolateModule.prototype.cleanupVNode = function (_a) {
        var data = _a.data, elm = _a.elm;
        var fullScope = (data || {}).isolate || '';
        var isCurrentElm = this.elementsByFullScope.get(fullScope) === elm;
        var isScopeBeingUpdated = this.fullScopesBeingUpdated.indexOf(fullScope) >= 0;
        if (fullScope && isCurrentElm && !isScopeBeingUpdated) {
            this.elementsByFullScope.delete(fullScope);
            this.delegatorsByFullScope.delete(fullScope);
        }
    };
    IsolateModule.prototype.getElement = function (fullScope) {
        return this.elementsByFullScope.get(fullScope);
    };
    IsolateModule.prototype.getFullScope = function (elm) {
        var iterator = this.elementsByFullScope.entries();
        for (var result = iterator.next(); !!result.value; result = iterator.next()) {
            var _a = result.value, fullScope = _a[0], element = _a[1];
            if (elm === element) {
                return fullScope;
            }
        }
        return '';
    };
    IsolateModule.prototype.addEventDelegator = function (fullScope, eventDelegator) {
        var delegators = this.delegatorsByFullScope.get(fullScope);
        if (!delegators) {
            delegators = [];
            this.delegatorsByFullScope.set(fullScope, delegators);
        }
        delegators[delegators.length] = eventDelegator;
    };
    IsolateModule.prototype.reset = function () {
        this.elementsByFullScope.clear();
        this.delegatorsByFullScope.clear();
        this.fullScopesBeingUpdated = [];
    };
    IsolateModule.prototype.createModule = function () {
        var self = this;
        return {
            create: function (oldVNode, vNode) {
                var _a = oldVNode.data, oldData = _a === void 0 ? {} : _a;
                var elm = vNode.elm, _b = vNode.data, data = _b === void 0 ? {} : _b;
                var oldFullScope = oldData.isolate || '';
                var fullScope = data.isolate || '';
                // Update data structures with the newly-created element
                if (fullScope) {
                    self.fullScopesBeingUpdated.push(fullScope);
                    if (oldFullScope) {
                        self.elementsByFullScope.delete(oldFullScope);
                    }
                    self.elementsByFullScope.set(fullScope, elm);
                    // Update delegators for this scope
                    var delegators = self.delegatorsByFullScope.get(fullScope);
                    if (delegators) {
                        var len = delegators.length;
                        for (var i = 0; i < len; ++i) {
                            delegators[i].updateOrigin(elm);
                        }
                    }
                }
                if (oldFullScope && !fullScope) {
                    self.elementsByFullScope.delete(fullScope);
                }
            },
            update: function (oldVNode, vNode) {
                var _a = oldVNode.data, oldData = _a === void 0 ? {} : _a;
                var elm = vNode.elm, _b = vNode.data, data = _b === void 0 ? {} : _b;
                var oldFullScope = oldData.isolate || '';
                var fullScope = data.isolate || '';
                // Same element, but different scope, so update the data structures
                if (fullScope && fullScope !== oldFullScope) {
                    if (oldFullScope) {
                        self.elementsByFullScope.delete(oldFullScope);
                    }
                    self.elementsByFullScope.set(fullScope, elm);
                    var delegators = self.delegatorsByFullScope.get(oldFullScope);
                    if (delegators) {
                        self.delegatorsByFullScope.delete(oldFullScope);
                        self.delegatorsByFullScope.set(fullScope, delegators);
                    }
                }
                // Same element, but lost the scope, so update the data structures
                if (oldFullScope && !fullScope) {
                    self.elementsByFullScope.delete(oldFullScope);
                    self.delegatorsByFullScope.delete(oldFullScope);
                }
            },
            destroy: function (vNode) {
                self.cleanupVNode(vNode);
            },
            remove: function (vNode, cb) {
                self.cleanupVNode(vNode);
                cb();
            },
            post: function () {
                self.fullScopesBeingUpdated = [];
            },
        };
    };
    return IsolateModule;
}());
exports.IsolateModule = IsolateModule;
//# sourceMappingURL=IsolateModule.js.map

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var h_1 = __webpack_require__(6);
var classNameFromVNode_1 = __webpack_require__(95);
var selectorParser_1 = __webpack_require__(31);
var VNodeWrapper = (function () {
    function VNodeWrapper(rootElement) {
        this.rootElement = rootElement;
    }
    VNodeWrapper.prototype.call = function (vnode) {
        if (vnode === null) {
            return this.wrap([]);
        }
        var _a = selectorParser_1.selectorParser(vnode), selTagName = _a.tagName, selId = _a.id;
        var vNodeClassName = classNameFromVNode_1.classNameFromVNode(vnode);
        var vNodeData = vnode.data || {};
        var vNodeDataProps = vNodeData.props || {};
        var _b = vNodeDataProps.id, vNodeId = _b === void 0 ? selId : _b;
        var isVNodeAndRootElementIdentical = typeof vNodeId === 'string' &&
            vNodeId.toUpperCase() === this.rootElement.id.toUpperCase() &&
            selTagName.toUpperCase() === this.rootElement.tagName.toUpperCase() &&
            vNodeClassName.toUpperCase() === this.rootElement.className.toUpperCase();
        if (isVNodeAndRootElementIdentical) {
            return vnode;
        }
        return this.wrap([vnode]);
    };
    VNodeWrapper.prototype.wrap = function (children) {
        var _a = this.rootElement, tagName = _a.tagName, id = _a.id, className = _a.className;
        var selId = id ? "#" + id : '';
        var selClass = className ? "." + className.split(" ").join(".") : '';
        return h_1.h("" + tagName.toLowerCase() + selId + selClass, {}, children);
    };
    return VNodeWrapper;
}());
exports.VNodeWrapper = VNodeWrapper;
//# sourceMappingURL=VNodeWrapper.js.map

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:max-file-line-count
var h_1 = __webpack_require__(6);
function isValidString(param) {
    return typeof param === 'string' && param.length > 0;
}
function isSelector(param) {
    return isValidString(param) && (param[0] === '.' || param[0] === '#');
}
function createTagFunction(tagName) {
    return function hyperscript(a, b, c) {
        var hasA = typeof a !== 'undefined';
        var hasB = typeof b !== 'undefined';
        var hasC = typeof c !== 'undefined';
        if (isSelector(a)) {
            if (hasB && hasC) {
                return h_1.h(tagName + a, b, c);
            }
            else if (hasB) {
                return h_1.h(tagName + a, b);
            }
            else {
                return h_1.h(tagName + a, {});
            }
        }
        else if (hasC) {
            return h_1.h(tagName + a, b, c);
        }
        else if (hasB) {
            return h_1.h(tagName, a, b);
        }
        else if (hasA) {
            return h_1.h(tagName, a);
        }
        else {
            return h_1.h(tagName, {});
        }
    };
}
var SVG_TAG_NAMES = [
    'a',
    'altGlyph',
    'altGlyphDef',
    'altGlyphItem',
    'animate',
    'animateColor',
    'animateMotion',
    'animateTransform',
    'circle',
    'clipPath',
    'colorProfile',
    'cursor',
    'defs',
    'desc',
    'ellipse',
    'feBlend',
    'feColorMatrix',
    'feComponentTransfer',
    'feComposite',
    'feConvolveMatrix',
    'feDiffuseLighting',
    'feDisplacementMap',
    'feDistantLight',
    'feFlood',
    'feFuncA',
    'feFuncB',
    'feFuncG',
    'feFuncR',
    'feGaussianBlur',
    'feImage',
    'feMerge',
    'feMergeNode',
    'feMorphology',
    'feOffset',
    'fePointLight',
    'feSpecularLighting',
    'feSpotlight',
    'feTile',
    'feTurbulence',
    'filter',
    'font',
    'fontFace',
    'fontFaceFormat',
    'fontFaceName',
    'fontFaceSrc',
    'fontFaceUri',
    'foreignObject',
    'g',
    'glyph',
    'glyphRef',
    'hkern',
    'image',
    'line',
    'linearGradient',
    'marker',
    'mask',
    'metadata',
    'missingGlyph',
    'mpath',
    'path',
    'pattern',
    'polygon',
    'polyline',
    'radialGradient',
    'rect',
    'script',
    'set',
    'stop',
    'style',
    'switch',
    'symbol',
    'text',
    'textPath',
    'title',
    'tref',
    'tspan',
    'use',
    'view',
    'vkern',
];
var svg = createTagFunction('svg');
SVG_TAG_NAMES.forEach(function (tag) {
    svg[tag] = createTagFunction(tag);
});
var TAG_NAMES = [
    'a',
    'abbr',
    'address',
    'area',
    'article',
    'aside',
    'audio',
    'b',
    'base',
    'bdi',
    'bdo',
    'blockquote',
    'body',
    'br',
    'button',
    'canvas',
    'caption',
    'cite',
    'code',
    'col',
    'colgroup',
    'dd',
    'del',
    'dfn',
    'dir',
    'div',
    'dl',
    'dt',
    'em',
    'embed',
    'fieldset',
    'figcaption',
    'figure',
    'footer',
    'form',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'head',
    'header',
    'hgroup',
    'hr',
    'html',
    'i',
    'iframe',
    'img',
    'input',
    'ins',
    'kbd',
    'keygen',
    'label',
    'legend',
    'li',
    'link',
    'main',
    'map',
    'mark',
    'menu',
    'meta',
    'nav',
    'noscript',
    'object',
    'ol',
    'optgroup',
    'option',
    'p',
    'param',
    'pre',
    'progress',
    'q',
    'rp',
    'rt',
    'ruby',
    's',
    'samp',
    'script',
    'section',
    'select',
    'small',
    'source',
    'span',
    'strong',
    'style',
    'sub',
    'sup',
    'table',
    'tbody',
    'td',
    'textarea',
    'tfoot',
    'th',
    'thead',
    'time',
    'title',
    'tr',
    'u',
    'ul',
    'video',
];
var exported = {
    SVG_TAG_NAMES: SVG_TAG_NAMES,
    TAG_NAMES: TAG_NAMES,
    svg: svg,
    isSelector: isSelector,
    createTagFunction: createTagFunction,
};
TAG_NAMES.forEach(function (n) {
    exported[n] = createTagFunction(n);
});
exports.default = exported;
//# sourceMappingURL=hyperscript-helpers.js.map

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var vnode_1 = __webpack_require__(12);
var utils_1 = __webpack_require__(7);
function totalIsolateSource(source, scope) {
    return source.select(utils_1.SCOPE_PREFIX + scope);
}
function siblingIsolateSource(source, scope) {
    return source.select(scope);
}
function isolateSource(source, scope) {
    if (scope === ':root') {
        return source;
    }
    else if (utils_1.isClassOrId(scope)) {
        return siblingIsolateSource(source, scope);
    }
    else {
        return totalIsolateSource(source, scope);
    }
}
exports.isolateSource = isolateSource;
function siblingIsolateSink(sink, scope) {
    return sink.map(function (node) {
        return node
            ? vnode_1.vnode(node.sel + scope, node.data, node.children, node.text, node.elm)
            : node;
    });
}
exports.siblingIsolateSink = siblingIsolateSink;
function totalIsolateSink(sink, fullScope) {
    return sink.map(function (node) {
        if (!node) {
            return node;
        }
        // Ignore if already had up-to-date full scope in vnode.data.isolate
        if (node.data && node.data.isolate) {
            var isolateData = node.data.isolate;
            var prevFullScopeNum = isolateData.replace(/(cycle|\-)/g, '');
            var fullScopeNum = fullScope.replace(/(cycle|\-)/g, '');
            if (isNaN(parseInt(prevFullScopeNum)) ||
                isNaN(parseInt(fullScopeNum)) ||
                prevFullScopeNum > fullScopeNum) {
                // > is lexicographic string comparison
                return node;
            }
        }
        // Insert up-to-date full scope in vnode.data.isolate, and also a key if needed
        node.data = node.data || {};
        node.data.isolate = fullScope;
        if (typeof node.key === 'undefined') {
            node.key = utils_1.SCOPE_PREFIX + fullScope;
        }
        return node;
    });
}
exports.totalIsolateSink = totalIsolateSink;
//# sourceMappingURL=isolate.js.map

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var snabbdom_1 = __webpack_require__(101);
var xstream_1 = __webpack_require__(2);
var MainDOMSource_1 = __webpack_require__(18);
var tovnode_1 = __webpack_require__(103);
var VNodeWrapper_1 = __webpack_require__(41);
var utils_1 = __webpack_require__(7);
var modules_1 = __webpack_require__(46);
var IsolateModule_1 = __webpack_require__(40);
var MapPolyfill = __webpack_require__(30);
function makeDOMDriverInputGuard(modules) {
    if (!Array.isArray(modules)) {
        throw new Error("Optional modules option must be " + "an array for snabbdom modules");
    }
}
function domDriverInputGuard(view$) {
    if (!view$ ||
        typeof view$.addListener !== "function" ||
        typeof view$.fold !== "function") {
        throw new Error("The DOM driver function expects as input a Stream of " +
            "virtual DOM elements");
    }
}
function dropCompletion(input) {
    return xstream_1.default.merge(input, xstream_1.default.never());
}
function unwrapElementFromVNode(vnode) {
    return vnode.elm;
}
function reportSnabbdomError(err) {
    (console.error || console.log)(err);
}
function makeDOMDriver(container, options) {
    if (!options) {
        options = {};
    }
    var modules = options.modules || modules_1.default;
    var isolateModule = new IsolateModule_1.IsolateModule();
    var patch = snabbdom_1.init([isolateModule.createModule()].concat(modules));
    var rootElement = utils_1.getElement(container) || document.body;
    var vnodeWrapper = new VNodeWrapper_1.VNodeWrapper(rootElement);
    var delegators = new MapPolyfill();
    makeDOMDriverInputGuard(modules);
    function DOMDriver(vnode$, name) {
        if (name === void 0) { name = 'DOM'; }
        domDriverInputGuard(vnode$);
        var sanitation$ = xstream_1.default.create();
        var rootElement$ = xstream_1.default
            .merge(vnode$.endWhen(sanitation$), sanitation$)
            .map(function (vnode) { return vnodeWrapper.call(vnode); })
            .fold(patch, tovnode_1.toVNode(rootElement))
            .drop(1)
            .map(unwrapElementFromVNode)
            .compose(dropCompletion) // don't complete this stream
            .startWith(rootElement);
        // Start the snabbdom patching, over time
        var listener = { error: reportSnabbdomError };
        if (document.readyState === 'loading') {
            document.addEventListener('readystatechange', function () {
                if (document.readyState === 'interactive') {
                    rootElement$.addListener(listener);
                }
            });
        }
        else {
            rootElement$.addListener(listener);
        }
        return new MainDOMSource_1.MainDOMSource(rootElement$, sanitation$, [], isolateModule, delegators, name);
    }
    return DOMDriver;
}
exports.makeDOMDriver = makeDOMDriver;
//# sourceMappingURL=makeDOMDriver.js.map

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var xstream_1 = __webpack_require__(2);
var adapt_1 = __webpack_require__(8);
var SCOPE_PREFIX = '___';
var MockedDOMSource = (function () {
    function MockedDOMSource(_mockConfig) {
        this._mockConfig = _mockConfig;
        if (_mockConfig['elements']) {
            this._elements = _mockConfig['elements'];
        }
        else {
            this._elements = adapt_1.adapt(xstream_1.default.empty());
        }
    }
    MockedDOMSource.prototype.elements = function () {
        var out = this
            ._elements;
        out._isCycleSource = 'MockedDOM';
        return out;
    };
    MockedDOMSource.prototype.events = function (eventType, options) {
        var streamForEventType = this._mockConfig[eventType];
        var out = adapt_1.adapt(streamForEventType || xstream_1.default.empty());
        out._isCycleSource = 'MockedDOM';
        return out;
    };
    MockedDOMSource.prototype.select = function (selector) {
        var mockConfigForSelector = this._mockConfig[selector] || {};
        return new MockedDOMSource(mockConfigForSelector);
    };
    MockedDOMSource.prototype.isolateSource = function (source, scope) {
        return source.select('.' + SCOPE_PREFIX + scope);
    };
    MockedDOMSource.prototype.isolateSink = function (sink, scope) {
        return sink.map(function (vnode) {
            if (vnode.sel && vnode.sel.indexOf(SCOPE_PREFIX + scope) !== -1) {
                return vnode;
            }
            else {
                vnode.sel += "." + SCOPE_PREFIX + scope;
                return vnode;
            }
        });
    };
    return MockedDOMSource;
}());
exports.MockedDOMSource = MockedDOMSource;
function mockDOMSource(mockConfig) {
    return new MockedDOMSource(mockConfig);
}
exports.mockDOMSource = mockDOMSource;
//# sourceMappingURL=mockDOMSource.js.map

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var class_1 = __webpack_require__(97);
exports.ClassModule = class_1.default;
var props_1 = __webpack_require__(99);
exports.PropsModule = props_1.default;
var attributes_1 = __webpack_require__(96);
exports.AttrsModule = attributes_1.default;
var style_1 = __webpack_require__(100);
exports.StyleModule = style_1.default;
var dataset_1 = __webpack_require__(98);
exports.DatasetModule = dataset_1.default;
var modules = [
    style_1.default,
    class_1.default,
    props_1.default,
    attributes_1.default,
    dataset_1.default,
];
exports.default = modules;
//# sourceMappingURL=modules.js.map

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var h_1 = __webpack_require__(6);
function copyToThunk(vnode, thunk) {
    thunk.elm = vnode.elm;
    vnode.data.fn = thunk.data.fn;
    vnode.data.args = thunk.data.args;
    vnode.data.isolate = thunk.data.isolate;
    thunk.data = vnode.data;
    thunk.children = vnode.children;
    thunk.text = vnode.text;
    thunk.elm = vnode.elm;
}
function init(thunk) {
    var cur = thunk.data;
    var vnode = cur.fn.apply(undefined, cur.args);
    copyToThunk(vnode, thunk);
}
function prepatch(oldVnode, thunk) {
    var old = oldVnode.data, cur = thunk.data;
    var i;
    var oldArgs = old.args, args = cur.args;
    if (old.fn !== cur.fn || oldArgs.length !== args.length) {
        copyToThunk(cur.fn.apply(undefined, args), thunk);
    }
    for (i = 0; i < args.length; ++i) {
        if (oldArgs[i] !== args[i]) {
            copyToThunk(cur.fn.apply(undefined, args), thunk);
            return;
        }
    }
    copyToThunk(oldVnode, thunk);
}
exports.thunk = function thunk(sel, key, fn, args) {
    if (args === undefined) {
        args = fn;
        fn = key;
        key = undefined;
    }
    return h_1.h(sel, {
        key: key,
        hook: { init: init, prepatch: prepatch },
        fn: fn,
        args: args,
    });
};
exports.default = exports.thunk;
//# sourceMappingURL=thunk.js.map

/***/ }),
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* unused harmony export setAdapt */
/* harmony export (immutable) */ __webpack_exports__["a"] = adapt;
function getGlobal() {
    var globalObj;
    if (typeof window !== 'undefined') {
        globalObj = window;
    }
    else if (typeof global !== 'undefined') {
        globalObj = global;
    }
    else {
        globalObj = this;
    }
    globalObj.Cyclejs = globalObj.Cyclejs || {};
    globalObj = globalObj.Cyclejs;
    globalObj.adaptStream = globalObj.adaptStream || (function (x) { return x; });
    return globalObj;
}
function setAdapt(f) {
    getGlobal().adaptStream = f;
}
function adapt(stream) {
    return getGlobal().adaptStream(stream);
}
//# sourceMappingURL=adapt.js.map
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(17)))

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CycleDPicker = CycleDPicker;

var _dom = __webpack_require__(13);

var _xstream = __webpack_require__(2);

var _xstream2 = _interopRequireDefault(_xstream);

var _dpickerAll = __webpack_require__(21);

var _dpickerAll2 = _interopRequireDefault(_dpickerAll);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function CycleDPicker(selector, sources) {

  var value$ = sources.DOM.select(selector).events('dpicker:change').map(function (ev) {
    return ev.detail;
  });

  var state$ = sources.props.map(function (props) {
    return value$.startWith(props);
  }).flatten().remember();

  var vdom$ = state$.map(function (state) {
    return (0, _dom.div)(selector, {
      hook: {
        insert: function insert(vnode) {
          var dpicker = new _dpickerAll2.default(vnode.elm, state);
          dpicker.onChange = function (data, modelChanged) {
            if (modelChanged === false) {
              return;
            }

            var evt = new CustomEvent('dpicker:change', { bubbles: true, detail: dpicker.data });
            vnode.elm.dispatchEvent(evt);
          };
        }
      }
    });
  });

  return {
    DOM: vdom$,
    state: state$
  };
}

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _run = __webpack_require__(34);

var _dom = __webpack_require__(13);

var _app = __webpack_require__(35);

var main = _app.App;

var drivers = {
  DOM: (0, _dom.makeDOMDriver)('#demo')
};

(0, _run.run)(main, drivers);

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var copy             = __webpack_require__(67)
  , normalizeOptions = __webpack_require__(25)
  , ensureCallable   = __webpack_require__(1)
  , map              = __webpack_require__(75)
  , callable         = __webpack_require__(1)
  , validValue       = __webpack_require__(0)

  , bind = Function.prototype.bind, defineProperty = Object.defineProperty
  , hasOwnProperty = Object.prototype.hasOwnProperty
  , define;

define = function (name, desc, options) {
	var value = validValue(desc) && callable(desc.value), dgs;
	dgs = copy(desc);
	delete dgs.writable;
	delete dgs.value;
	dgs.get = function () {
		if (!options.overwriteDefinition && hasOwnProperty.call(this, name)) return value;
		desc.value = bind.call(value, options.resolveContext ? options.resolveContext(this) : this);
		defineProperty(this, name, desc);
		return this[name];
	};
	return dgs;
};

module.exports = function (props/*, options*/) {
	var options = normalizeOptions(arguments[1]);
	if (options.resolveContext != null) ensureCallable(options.resolveContext);
	return map(props, function (desc, name) { return define(name, desc, options); });
};


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var numberIsNaN       = __webpack_require__(60)
  , toPosInt          = __webpack_require__(24)
  , value             = __webpack_require__(0)
  , indexOf           = Array.prototype.indexOf
  , objHasOwnProperty = Object.prototype.hasOwnProperty
  , abs               = Math.abs
  , floor             = Math.floor;

module.exports = function (searchElement /*, fromIndex*/) {
	var i, length, fromIndex, val;
	if (!numberIsNaN(searchElement)) return indexOf.apply(this, arguments);

	length = toPosInt(value(this).length);
	fromIndex = arguments[1];
	if (isNaN(fromIndex)) fromIndex = 0;
	else if (fromIndex >= 0) fromIndex = floor(fromIndex);
	else fromIndex = toPosInt(this.length) - floor(abs(fromIndex));

	for (i = fromIndex; i < length; ++i) {
		if (objHasOwnProperty.call(this, i)) {
			val = this[i];
			if (numberIsNaN(val)) return i; // Jslint: ignore
		}
	}
	return -1;
};


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(54)()
	? Array.from
	: __webpack_require__(55);


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
	var from = Array.from, arr, result;
	if (typeof from !== "function") return false;
	arr = ["raz", "dwa"];
	result = from(arr);
	return Boolean(result && (result !== arr) && (result[1] === "dwa"));
};


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var iteratorSymbol = __webpack_require__(3).iterator
  , isArguments    = __webpack_require__(9)
  , isFunction     = __webpack_require__(56)
  , toPosInt       = __webpack_require__(24)
  , callable       = __webpack_require__(1)
  , validValue     = __webpack_require__(0)
  , isValue        = __webpack_require__(5)
  , isString       = __webpack_require__(11)
  , isArray        = Array.isArray
  , call           = Function.prototype.call
  , desc           = { configurable: true, enumerable: true, writable: true, value: null }
  , defineProperty = Object.defineProperty;

// eslint-disable-next-line complexity
module.exports = function (arrayLike /*, mapFn, thisArg*/) {
	var mapFn = arguments[1]
	  , thisArg = arguments[2]
	  , Context
	  , i
	  , j
	  , arr
	  , length
	  , code
	  , iterator
	  , result
	  , getIterator
	  , value;

	arrayLike = Object(validValue(arrayLike));

	if (isValue(mapFn)) callable(mapFn);
	if (!this || this === Array || !isFunction(this)) {
		// Result: Plain array
		if (!mapFn) {
			if (isArguments(arrayLike)) {
				// Source: Arguments
				length = arrayLike.length;
				if (length !== 1) return Array.apply(null, arrayLike);
				arr = new Array(1);
				arr[0] = arrayLike[0];
				return arr;
			}
			if (isArray(arrayLike)) {
				// Source: Array
				arr = new Array(length = arrayLike.length);
				for (i = 0; i < length; ++i) arr[i] = arrayLike[i];
				return arr;
			}
		}
		arr = [];
	} else {
		// Result: Non plain array
		Context = this;
	}

	if (!isArray(arrayLike)) {
		if ((getIterator = arrayLike[iteratorSymbol]) !== undefined) {
			// Source: Iterator
			iterator = callable(getIterator).call(arrayLike);
			if (Context) arr = new Context();
			result = iterator.next();
			i = 0;
			while (!result.done) {
				value = mapFn ? call.call(mapFn, thisArg, result.value, i) : result.value;
				if (Context) {
					desc.value = value;
					defineProperty(arr, i, desc);
				} else {
					arr[i] = value;
				}
				result = iterator.next();
				++i;
			}
			length = i;
		} else if (isString(arrayLike)) {
			// Source: String
			length = arrayLike.length;
			if (Context) arr = new Context();
			for (i = 0, j = 0; i < length; ++i) {
				value = arrayLike[i];
				if (i + 1 < length) {
					code = value.charCodeAt(0);
					// eslint-disable-next-line max-depth
					if (code >= 0xd800 && code <= 0xdbff) value += arrayLike[++i];
				}
				value = mapFn ? call.call(mapFn, thisArg, value, j) : value;
				if (Context) {
					desc.value = value;
					defineProperty(arr, j, desc);
				} else {
					arr[j] = value;
				}
				++j;
			}
			length = j;
		}
	}
	if (length === undefined) {
		// Source: array or array-like
		length = toPosInt(arrayLike.length);
		if (Context) arr = new Context(length);
		for (i = 0; i < length; ++i) {
			value = mapFn ? call.call(mapFn, thisArg, arrayLike[i], i) : arrayLike[i];
			if (Context) {
				desc.value = value;
				defineProperty(arr, i, desc);
			} else {
				arr[i] = value;
			}
		}
	}
	if (Context) {
		desc.value = null;
		arr.length = length;
	}
	return arr;
};


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var objToString = Object.prototype.toString, id = objToString.call(__webpack_require__(23));

module.exports = function (value) {
	return typeof value === "function" && objToString.call(value) === id;
};


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(58)()
	? Math.sign
	: __webpack_require__(59);


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
	var sign = Math.sign;
	if (typeof sign !== "function") return false;
	return (sign(10) === 1) && (sign(-20) === -1);
};


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (value) {
	value = Number(value);
	if (isNaN(value) || (value === 0)) return value;
	return value > 0 ? 1 : -1;
};


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(61)()
	? Number.isNaN
	: __webpack_require__(62);


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
	var numberIsNaN = Number.isNaN;
	if (typeof numberIsNaN !== "function") return false;
	return !numberIsNaN({}) && numberIsNaN(NaN) && !numberIsNaN(34);
};


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (value) {
	// eslint-disable-next-line no-self-compare
	return value !== value;
};


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var sign = __webpack_require__(57)

  , abs = Math.abs, floor = Math.floor;

module.exports = function (value) {
	if (isNaN(value)) return 0;
	value = Number(value);
	if ((value === 0) || !isFinite(value)) return value;
	return sign(value) * floor(abs(value));
};


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Internal method, used by iteration functions.
// Calls a function for each key-value pair found in object
// Optionally takes compareFn to iterate object in specific order



var callable                = __webpack_require__(1)
  , value                   = __webpack_require__(0)
  , bind                    = Function.prototype.bind
  , call                    = Function.prototype.call
  , keys                    = Object.keys
  , objPropertyIsEnumerable = Object.prototype.propertyIsEnumerable;

module.exports = function (method, defVal) {
	return function (obj, cb /*, thisArg, compareFn*/) {
		var list, thisArg = arguments[2], compareFn = arguments[3];
		obj = Object(value(obj));
		callable(cb);

		list = keys(obj);
		if (compareFn) {
			list.sort(typeof compareFn === "function" ? bind.call(compareFn, obj) : undefined);
		}
		if (typeof method !== "function") method = list[method];
		return call.call(method, list, function (key, index) {
			if (!objPropertyIsEnumerable.call(obj, key)) return defVal;
			return call.call(cb, thisArg, obj[key], key, obj, index);
		});
	};
};


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
	var assign = Object.assign, obj;
	if (typeof assign !== "function") return false;
	obj = { foo: "raz" };
	assign(obj, { bar: "dwa" }, { trzy: "trzy" });
	return (obj.foo + obj.bar + obj.trzy) === "razdwatrzy";
};


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var keys  = __webpack_require__(72)
  , value = __webpack_require__(0)
  , max   = Math.max;

module.exports = function (dest, src /*, …srcn*/) {
	var error, i, length = max(arguments.length, 2), assign;
	dest = Object(value(dest));
	assign = function (key) {
		try {
			dest[key] = src[key];
		} catch (e) {
			if (!error) error = e;
		}
	};
	for (i = 1; i < length; ++i) {
		src = arguments[i];
		keys(src).forEach(assign);
	}
	if (error !== undefined) throw error;
	return dest;
};


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var aFrom  = __webpack_require__(53)
  , assign = __webpack_require__(15)
  , value  = __webpack_require__(0);

module.exports = function (obj/*, propertyNames, options*/) {
	var copy = Object(value(obj)), propertyNames = arguments[1], options = Object(arguments[2]);
	if (copy !== obj && !propertyNames) return copy;
	var result = {};
	if (propertyNames) {
		aFrom(propertyNames, function (propertyName) {
			if (options.ensure || propertyName in obj) result[propertyName] = obj[propertyName];
		});
	} else {
		assign(result, obj);
	}
	return result;
};


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Workaround for http://code.google.com/p/v8/issues/detail?id=2804



var create = Object.create, shim;

if (!__webpack_require__(26)()) {
	shim = __webpack_require__(27);
}

module.exports = (function () {
	var nullObject, polyProps, desc;
	if (!shim) return create;
	if (shim.level !== 1) return create;

	nullObject = {};
	polyProps = {};
	desc = {
		configurable: false,
		enumerable: false,
		writable: true,
		value: undefined
	};
	Object.getOwnPropertyNames(Object.prototype).forEach(function (name) {
		if (name === "__proto__") {
			polyProps[name] = {
				configurable: true,
				enumerable: false,
				writable: true,
				value: undefined
			};
			return;
		}
		polyProps[name] = desc;
	});
	Object.defineProperties(nullObject, polyProps);

	Object.defineProperty(shim, "nullPolyfill", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: nullObject
	});

	return function (prototype, props) {
		return create(prototype === null ? nullObject : prototype, props);
	};
}());


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(64)("forEach");


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Deprecated



module.exports = function (obj) {
 return typeof obj === "function";
};


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isValue = __webpack_require__(5);

var map = { function: true, object: true };

module.exports = function (value) {
	return (isValue(value) && map[typeof value]) || false;
};


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(73)() ? Object.keys : __webpack_require__(74);


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
	try {
		Object.keys("primitive");
		return true;
	} catch (e) {
		return false;
	}
};


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isValue = __webpack_require__(5);

var keys = Object.keys;

module.exports = function (object) { return keys(isValue(object) ? Object(object) : object); };


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var callable = __webpack_require__(1)
  , forEach  = __webpack_require__(69)
  , call     = Function.prototype.call;

module.exports = function (obj, cb /*, thisArg*/) {
	var result = {}, thisArg = arguments[2];
	callable(cb);
	forEach(obj, function (value, key, targetObj, index) {
		result[key] = call.call(cb, thisArg, value, key, targetObj, index);
	});
	return result;
};


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var forEach = Array.prototype.forEach, create = Object.create;

// eslint-disable-next-line no-unused-vars
module.exports = function (arg /*, …args*/) {
	var set = create(null);
	forEach.call(arguments, function (name) {
		set[name] = true;
	});
	return set;
};


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var str = "razdwatrzy";

module.exports = function () {
	if (typeof str.contains !== "function") return false;
	return (str.contains("dwa") === true) && (str.contains("foo") === false);
};


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var indexOf = String.prototype.indexOf;

module.exports = function (searchString/*, position*/) {
	return indexOf.call(this, searchString, arguments[1]) > -1;
};


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var setPrototypeOf = __webpack_require__(10)
  , contains       = __webpack_require__(28)
  , d              = __webpack_require__(4)
  , Symbol         = __webpack_require__(3)
  , Iterator       = __webpack_require__(16);

var defineProperty = Object.defineProperty, ArrayIterator;

ArrayIterator = module.exports = function (arr, kind) {
	if (!(this instanceof ArrayIterator)) throw new TypeError("Constructor requires 'new'");
	Iterator.call(this, arr);
	if (!kind) kind = "value";
	else if (contains.call(kind, "key+value")) kind = "key+value";
	else if (contains.call(kind, "key")) kind = "key";
	else kind = "value";
	defineProperty(this, "__kind__", d("", kind));
};
if (setPrototypeOf) setPrototypeOf(ArrayIterator, Iterator);

// Internal %ArrayIteratorPrototype% doesn't expose its constructor
delete ArrayIterator.prototype.constructor;

ArrayIterator.prototype = Object.create(Iterator.prototype, {
	_resolve: d(function (i) {
		if (this.__kind__ === "value") return this.__list__[i];
		if (this.__kind__ === "key+value") return [i, this.__list__[i]];
		return i;
	})
});
defineProperty(ArrayIterator.prototype, Symbol.toStringTag, d("c", "Array Iterator"));


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isArguments = __webpack_require__(9)
  , callable    = __webpack_require__(1)
  , isString    = __webpack_require__(11)
  , get         = __webpack_require__(81);

var isArray = Array.isArray, call = Function.prototype.call, some = Array.prototype.some;

module.exports = function (iterable, cb /*, thisArg*/) {
	var mode, thisArg = arguments[2], result, doBreak, broken, i, length, char, code;
	if (isArray(iterable) || isArguments(iterable)) mode = "array";
	else if (isString(iterable)) mode = "string";
	else iterable = get(iterable);

	callable(cb);
	doBreak = function () {
		broken = true;
	};
	if (mode === "array") {
		some.call(iterable, function (value) {
			call.call(cb, thisArg, value, doBreak);
			return broken;
		});
		return;
	}
	if (mode === "string") {
		length = iterable.length;
		for (i = 0; i < length; ++i) {
			char = iterable[i];
			if (i + 1 < length) {
				code = char.charCodeAt(0);
				if (code >= 0xd800 && code <= 0xdbff) char += iterable[++i];
			}
			call.call(cb, thisArg, char, doBreak);
			if (broken) break;
		}
		return;
	}
	result = iterable.next();

	while (!result.done) {
		call.call(cb, thisArg, result.value, doBreak);
		if (broken) return;
		result = iterable.next();
	}
};


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isArguments    = __webpack_require__(9)
  , isString       = __webpack_require__(11)
  , ArrayIterator  = __webpack_require__(79)
  , StringIterator = __webpack_require__(83)
  , iterable       = __webpack_require__(29)
  , iteratorSymbol = __webpack_require__(3).iterator;

module.exports = function (obj) {
	if (typeof iterable(obj)[iteratorSymbol] === "function") return obj[iteratorSymbol]();
	if (isArguments(obj)) return new ArrayIterator(obj);
	if (isString(obj)) return new StringIterator(obj);
	return new ArrayIterator(obj);
};


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isArguments = __webpack_require__(9)
  , isValue     = __webpack_require__(5)
  , isString    = __webpack_require__(11);

var iteratorSymbol = __webpack_require__(3).iterator
  , isArray        = Array.isArray;

module.exports = function (value) {
	if (!isValue(value)) return false;
	if (isArray(value)) return true;
	if (isString(value)) return true;
	if (isArguments(value)) return true;
	return typeof value[iteratorSymbol] === "function";
};


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Thanks @mathiasbynens
// http://mathiasbynens.be/notes/javascript-unicode#iterating-over-symbols



var setPrototypeOf = __webpack_require__(10)
  , d              = __webpack_require__(4)
  , Symbol         = __webpack_require__(3)
  , Iterator       = __webpack_require__(16);

var defineProperty = Object.defineProperty, StringIterator;

StringIterator = module.exports = function (str) {
	if (!(this instanceof StringIterator)) throw new TypeError("Constructor requires 'new'");
	str = String(str);
	Iterator.call(this, str);
	defineProperty(this, "__length__", d("", str.length));
};
if (setPrototypeOf) setPrototypeOf(StringIterator, Iterator);

// Internal %ArrayIteratorPrototype% doesn't expose its constructor
delete StringIterator.prototype.constructor;

StringIterator.prototype = Object.create(Iterator.prototype, {
	_next: d(function () {
		if (!this.__list__) return undefined;
		if (this.__nextIndex__ < this.__length__) return this.__nextIndex__++;
		this._unBind();
		return undefined;
	}),
	_resolve: d(function (i) {
		var char = this.__list__[i], code;
		if (this.__nextIndex__ === this.__length__) return char;
		code = char.charCodeAt(0);
		if (code >= 0xd800 && code <= 0xdbff) return char + this.__list__[this.__nextIndex__++];
		return char;
	})
});
defineProperty(StringIterator.prototype, Symbol.toStringTag, d("c", "String Iterator"));


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
	var map, iterator, result;
	if (typeof Map !== 'function') return false;
	try {
		// WebKit doesn't support arguments and crashes
		map = new Map([['raz', 'one'], ['dwa', 'two'], ['trzy', 'three']]);
	} catch (e) {
		return false;
	}
	if (String(map) !== '[object Map]') return false;
	if (map.size !== 3) return false;
	if (typeof map.clear !== 'function') return false;
	if (typeof map.delete !== 'function') return false;
	if (typeof map.entries !== 'function') return false;
	if (typeof map.forEach !== 'function') return false;
	if (typeof map.get !== 'function') return false;
	if (typeof map.has !== 'function') return false;
	if (typeof map.keys !== 'function') return false;
	if (typeof map.set !== 'function') return false;
	if (typeof map.values !== 'function') return false;

	iterator = map.entries();
	result = iterator.next();
	if (result.done !== false) return false;
	if (!result.value) return false;
	if (result.value[0] !== 'raz') return false;
	if (result.value[1] !== 'one') return false;

	return true;
};


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Exports true if environment provides native `Map` implementation,
// whatever that is.



module.exports = (function () {
	if (typeof Map === 'undefined') return false;
	return (Object.prototype.toString.call(new Map()) === '[object Map]');
}());


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(76)('key',
	'value', 'key+value');


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var setPrototypeOf    = __webpack_require__(10)
  , d                 = __webpack_require__(4)
  , Iterator          = __webpack_require__(16)
  , toStringTagSymbol = __webpack_require__(3).toStringTag
  , kinds             = __webpack_require__(86)

  , defineProperties = Object.defineProperties
  , unBind = Iterator.prototype._unBind
  , MapIterator;

MapIterator = module.exports = function (map, kind) {
	if (!(this instanceof MapIterator)) return new MapIterator(map, kind);
	Iterator.call(this, map.__mapKeysData__, map);
	if (!kind || !kinds[kind]) kind = 'key+value';
	defineProperties(this, {
		__kind__: d('', kind),
		__values__: d('w', map.__mapValuesData__)
	});
};
if (setPrototypeOf) setPrototypeOf(MapIterator, Iterator);

MapIterator.prototype = Object.create(Iterator.prototype, {
	constructor: d(MapIterator),
	_resolve: d(function (i) {
		if (this.__kind__ === 'value') return this.__values__[i];
		if (this.__kind__ === 'key') return this.__list__[i];
		return [this.__list__[i], this.__values__[i]];
	}),
	_unBind: d(function () {
		this.__values__ = null;
		unBind.call(this);
	}),
	toString: d(function () { return '[object Map Iterator]'; })
});
Object.defineProperty(MapIterator.prototype, toStringTagSymbol,
	d('c', 'Map Iterator'));


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var clear          = __webpack_require__(22)
  , eIndexOf       = __webpack_require__(52)
  , setPrototypeOf = __webpack_require__(10)
  , callable       = __webpack_require__(1)
  , validValue     = __webpack_require__(0)
  , d              = __webpack_require__(4)
  , ee             = __webpack_require__(93)
  , Symbol         = __webpack_require__(3)
  , iterator       = __webpack_require__(29)
  , forOf          = __webpack_require__(80)
  , Iterator       = __webpack_require__(87)
  , isNative       = __webpack_require__(85)

  , call = Function.prototype.call
  , defineProperties = Object.defineProperties, getPrototypeOf = Object.getPrototypeOf
  , MapPoly;

module.exports = MapPoly = function (/*iterable*/) {
	var iterable = arguments[0], keys, values, self;
	if (!(this instanceof MapPoly)) throw new TypeError('Constructor requires \'new\'');
	if (isNative && setPrototypeOf && (Map !== MapPoly)) {
		self = setPrototypeOf(new Map(), getPrototypeOf(this));
	} else {
		self = this;
	}
	if (iterable != null) iterator(iterable);
	defineProperties(self, {
		__mapKeysData__: d('c', keys = []),
		__mapValuesData__: d('c', values = [])
	});
	if (!iterable) return self;
	forOf(iterable, function (value) {
		var key = validValue(value)[0];
		value = value[1];
		if (eIndexOf.call(keys, key) !== -1) return;
		keys.push(key);
		values.push(value);
	}, self);
	return self;
};

if (isNative) {
	if (setPrototypeOf) setPrototypeOf(MapPoly, Map);
	MapPoly.prototype = Object.create(Map.prototype, {
		constructor: d(MapPoly)
	});
}

ee(defineProperties(MapPoly.prototype, {
	clear: d(function () {
		if (!this.__mapKeysData__.length) return;
		clear.call(this.__mapKeysData__);
		clear.call(this.__mapValuesData__);
		this.emit('_clear');
	}),
	delete: d(function (key) {
		var index = eIndexOf.call(this.__mapKeysData__, key);
		if (index === -1) return false;
		this.__mapKeysData__.splice(index, 1);
		this.__mapValuesData__.splice(index, 1);
		this.emit('_delete', index, key);
		return true;
	}),
	entries: d(function () { return new Iterator(this, 'key+value'); }),
	forEach: d(function (cb/*, thisArg*/) {
		var thisArg = arguments[1], iterator, result;
		callable(cb);
		iterator = this.entries();
		result = iterator._next();
		while (result !== undefined) {
			call.call(cb, thisArg, this.__mapValuesData__[result],
				this.__mapKeysData__[result], this);
			result = iterator._next();
		}
	}),
	get: d(function (key) {
		var index = eIndexOf.call(this.__mapKeysData__, key);
		if (index === -1) return;
		return this.__mapValuesData__[index];
	}),
	has: d(function (key) {
		return (eIndexOf.call(this.__mapKeysData__, key) !== -1);
	}),
	keys: d(function () { return new Iterator(this, 'key'); }),
	set: d(function (key, value) {
		var index = eIndexOf.call(this.__mapKeysData__, key), emit;
		if (index === -1) {
			index = this.__mapKeysData__.push(key) - 1;
			emit = true;
		}
		this.__mapValuesData__[index] = value;
		if (emit) this.emit('_add', index, key);
		return this;
	}),
	size: d.gs(function () { return this.__mapKeysData__.length; }),
	values: d(function () { return new Iterator(this, 'value'); }),
	toString: d(function () { return '[object Map]'; })
}));
Object.defineProperty(MapPoly.prototype, Symbol.iterator, d(function () {
	return this.entries();
}));
Object.defineProperty(MapPoly.prototype, Symbol.toStringTag, d('c', 'Map'));


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var validTypes = { object: true, symbol: true };

module.exports = function () {
	var symbol;
	if (typeof Symbol !== 'function') return false;
	symbol = Symbol('test symbol');
	try { String(symbol); } catch (e) { return false; }

	// Return 'true' also for polyfills
	if (!validTypes[typeof Symbol.iterator]) return false;
	if (!validTypes[typeof Symbol.toPrimitive]) return false;
	if (!validTypes[typeof Symbol.toStringTag]) return false;

	return true;
};


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (x) {
	if (!x) return false;
	if (typeof x === 'symbol') return true;
	if (!x.constructor) return false;
	if (x.constructor.name !== 'Symbol') return false;
	return (x[x.constructor.toStringTag] === 'Symbol');
};


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// ES2015 Symbol polyfill for environments that do not (or partially) support it



var d              = __webpack_require__(4)
  , validateSymbol = __webpack_require__(92)

  , create = Object.create, defineProperties = Object.defineProperties
  , defineProperty = Object.defineProperty, objPrototype = Object.prototype
  , NativeSymbol, SymbolPolyfill, HiddenSymbol, globalSymbols = create(null)
  , isNativeSafe;

if (typeof Symbol === 'function') {
	NativeSymbol = Symbol;
	try {
		String(NativeSymbol());
		isNativeSafe = true;
	} catch (ignore) {}
}

var generateName = (function () {
	var created = create(null);
	return function (desc) {
		var postfix = 0, name, ie11BugWorkaround;
		while (created[desc + (postfix || '')]) ++postfix;
		desc += (postfix || '');
		created[desc] = true;
		name = '@@' + desc;
		defineProperty(objPrototype, name, d.gs(null, function (value) {
			// For IE11 issue see:
			// https://connect.microsoft.com/IE/feedbackdetail/view/1928508/
			//    ie11-broken-getters-on-dom-objects
			// https://github.com/medikoo/es6-symbol/issues/12
			if (ie11BugWorkaround) return;
			ie11BugWorkaround = true;
			defineProperty(this, name, d(value));
			ie11BugWorkaround = false;
		}));
		return name;
	};
}());

// Internal constructor (not one exposed) for creating Symbol instances.
// This one is used to ensure that `someSymbol instanceof Symbol` always return false
HiddenSymbol = function Symbol(description) {
	if (this instanceof HiddenSymbol) throw new TypeError('Symbol is not a constructor');
	return SymbolPolyfill(description);
};

// Exposed `Symbol` constructor
// (returns instances of HiddenSymbol)
module.exports = SymbolPolyfill = function Symbol(description) {
	var symbol;
	if (this instanceof Symbol) throw new TypeError('Symbol is not a constructor');
	if (isNativeSafe) return NativeSymbol(description);
	symbol = create(HiddenSymbol.prototype);
	description = (description === undefined ? '' : String(description));
	return defineProperties(symbol, {
		__description__: d('', description),
		__name__: d('', generateName(description))
	});
};
defineProperties(SymbolPolyfill, {
	for: d(function (key) {
		if (globalSymbols[key]) return globalSymbols[key];
		return (globalSymbols[key] = SymbolPolyfill(String(key)));
	}),
	keyFor: d(function (s) {
		var key;
		validateSymbol(s);
		for (key in globalSymbols) if (globalSymbols[key] === s) return key;
	}),

	// To ensure proper interoperability with other native functions (e.g. Array.from)
	// fallback to eventual native implementation of given symbol
	hasInstance: d('', (NativeSymbol && NativeSymbol.hasInstance) || SymbolPolyfill('hasInstance')),
	isConcatSpreadable: d('', (NativeSymbol && NativeSymbol.isConcatSpreadable) ||
		SymbolPolyfill('isConcatSpreadable')),
	iterator: d('', (NativeSymbol && NativeSymbol.iterator) || SymbolPolyfill('iterator')),
	match: d('', (NativeSymbol && NativeSymbol.match) || SymbolPolyfill('match')),
	replace: d('', (NativeSymbol && NativeSymbol.replace) || SymbolPolyfill('replace')),
	search: d('', (NativeSymbol && NativeSymbol.search) || SymbolPolyfill('search')),
	species: d('', (NativeSymbol && NativeSymbol.species) || SymbolPolyfill('species')),
	split: d('', (NativeSymbol && NativeSymbol.split) || SymbolPolyfill('split')),
	toPrimitive: d('', (NativeSymbol && NativeSymbol.toPrimitive) || SymbolPolyfill('toPrimitive')),
	toStringTag: d('', (NativeSymbol && NativeSymbol.toStringTag) || SymbolPolyfill('toStringTag')),
	unscopables: d('', (NativeSymbol && NativeSymbol.unscopables) || SymbolPolyfill('unscopables'))
});

// Internal tweaks for real symbol producer
defineProperties(HiddenSymbol.prototype, {
	constructor: d(SymbolPolyfill),
	toString: d('', function () { return this.__name__; })
});

// Proper implementation of methods exposed on Symbol.prototype
// They won't be accessible on produced symbol instances as they derive from HiddenSymbol.prototype
defineProperties(SymbolPolyfill.prototype, {
	toString: d(function () { return 'Symbol (' + validateSymbol(this).__description__ + ')'; }),
	valueOf: d(function () { return validateSymbol(this); })
});
defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toPrimitive, d('', function () {
	var symbol = validateSymbol(this);
	if (typeof symbol === 'symbol') return symbol;
	return symbol.toString();
}));
defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toStringTag, d('c', 'Symbol'));

// Proper implementaton of toPrimitive and toStringTag for returned symbol instances
defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toStringTag,
	d('c', SymbolPolyfill.prototype[SymbolPolyfill.toStringTag]));

// Note: It's important to define `toPrimitive` as last one, as some implementations
// implement `toPrimitive` natively without implementing `toStringTag` (or other specified symbols)
// And that may invoke error in definition flow:
// See: https://github.com/medikoo/es6-symbol/issues/13#issuecomment-164146149
defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toPrimitive,
	d('c', SymbolPolyfill.prototype[SymbolPolyfill.toPrimitive]));


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isSymbol = __webpack_require__(90);

module.exports = function (value) {
	if (!isSymbol(value)) throw new TypeError(value + " is not a symbol");
	return value;
};


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var d        = __webpack_require__(4)
  , callable = __webpack_require__(1)

  , apply = Function.prototype.apply, call = Function.prototype.call
  , create = Object.create, defineProperty = Object.defineProperty
  , defineProperties = Object.defineProperties
  , hasOwnProperty = Object.prototype.hasOwnProperty
  , descriptor = { configurable: true, enumerable: false, writable: true }

  , on, once, off, emit, methods, descriptors, base;

on = function (type, listener) {
	var data;

	callable(listener);

	if (!hasOwnProperty.call(this, '__ee__')) {
		data = descriptor.value = create(null);
		defineProperty(this, '__ee__', descriptor);
		descriptor.value = null;
	} else {
		data = this.__ee__;
	}
	if (!data[type]) data[type] = listener;
	else if (typeof data[type] === 'object') data[type].push(listener);
	else data[type] = [data[type], listener];

	return this;
};

once = function (type, listener) {
	var once, self;

	callable(listener);
	self = this;
	on.call(this, type, once = function () {
		off.call(self, type, once);
		apply.call(listener, this, arguments);
	});

	once.__eeOnceListener__ = listener;
	return this;
};

off = function (type, listener) {
	var data, listeners, candidate, i;

	callable(listener);

	if (!hasOwnProperty.call(this, '__ee__')) return this;
	data = this.__ee__;
	if (!data[type]) return this;
	listeners = data[type];

	if (typeof listeners === 'object') {
		for (i = 0; (candidate = listeners[i]); ++i) {
			if ((candidate === listener) ||
					(candidate.__eeOnceListener__ === listener)) {
				if (listeners.length === 2) data[type] = listeners[i ? 0 : 1];
				else listeners.splice(i, 1);
			}
		}
	} else {
		if ((listeners === listener) ||
				(listeners.__eeOnceListener__ === listener)) {
			delete data[type];
		}
	}

	return this;
};

emit = function (type) {
	var i, l, listener, listeners, args;

	if (!hasOwnProperty.call(this, '__ee__')) return;
	listeners = this.__ee__[type];
	if (!listeners) return;

	if (typeof listeners === 'object') {
		l = arguments.length;
		args = new Array(l - 1);
		for (i = 1; i < l; ++i) args[i - 1] = arguments[i];

		listeners = listeners.slice();
		for (i = 0; (listener = listeners[i]); ++i) {
			apply.call(listener, this, args);
		}
	} else {
		switch (arguments.length) {
		case 1:
			call.call(listeners, this);
			break;
		case 2:
			call.call(listeners, this, arguments[1]);
			break;
		case 3:
			call.call(listeners, this, arguments[1], arguments[2]);
			break;
		default:
			l = arguments.length;
			args = new Array(l - 1);
			for (i = 1; i < l; ++i) {
				args[i - 1] = arguments[i];
			}
			apply.call(listeners, this, args);
		}
	}
};

methods = {
	on: on,
	once: once,
	off: off,
	emit: emit
};

descriptors = {
	on: d(on),
	once: d(once),
	off: d(off),
	emit: d(emit)
};

base = defineProperties({}, descriptors);

module.exports = exports = function (o) {
	return (o == null) ? create(base) : defineProperties(Object(o), descriptors);
};
exports.methods = methods;


/***/ }),
/* 94 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var selectorParser_1 = __webpack_require__(31);
function classNameFromVNode(vNode) {
    var _a = selectorParser_1.selectorParser(vNode).className, cn = _a === void 0 ? '' : _a;
    if (!vNode.data) {
        return cn;
    }
    var _b = vNode.data, dataClass = _b.class, props = _b.props;
    if (dataClass) {
        var c = Object.keys(dataClass)
            .filter(function (cl) { return dataClass[cl]; });
        cn += " " + c.join(" ");
    }
    if (props && props.className) {
        cn += " " + props.className;
    }
    return cn && cn.trim();
}
exports.classNameFromVNode = classNameFromVNode;
//# sourceMappingURL=classNameFromVNode.js.map

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var booleanAttrs = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "compact", "controls", "declare",
    "default", "defaultchecked", "defaultmuted", "defaultselected", "defer", "disabled", "draggable",
    "enabled", "formnovalidate", "hidden", "indeterminate", "inert", "ismap", "itemscope", "loop", "multiple",
    "muted", "nohref", "noresize", "noshade", "novalidate", "nowrap", "open", "pauseonexit", "readonly",
    "required", "reversed", "scoped", "seamless", "selected", "sortable", "spellcheck", "translate",
    "truespeed", "typemustmatch", "visible"];
var xlinkNS = 'http://www.w3.org/1999/xlink';
var xmlNS = 'http://www.w3.org/XML/1998/namespace';
var colonChar = 58;
var xChar = 120;
var booleanAttrsDict = Object.create(null);
for (var i = 0, len = booleanAttrs.length; i < len; i++) {
    booleanAttrsDict[booleanAttrs[i]] = true;
}
function updateAttrs(oldVnode, vnode) {
    var key, elm = vnode.elm, oldAttrs = oldVnode.data.attrs, attrs = vnode.data.attrs;
    if (!oldAttrs && !attrs)
        return;
    if (oldAttrs === attrs)
        return;
    oldAttrs = oldAttrs || {};
    attrs = attrs || {};
    // update modified attributes, add new attributes
    for (key in attrs) {
        var cur = attrs[key];
        var old = oldAttrs[key];
        if (old !== cur) {
            if (booleanAttrsDict[key]) {
                if (cur) {
                    elm.setAttribute(key, "");
                }
                else {
                    elm.removeAttribute(key);
                }
            }
            else {
                if (key.charCodeAt(0) !== xChar) {
                    elm.setAttribute(key, cur);
                }
                else if (key.charCodeAt(3) === colonChar) {
                    // Assume xml namespace
                    elm.setAttributeNS(xmlNS, key, cur);
                }
                else if (key.charCodeAt(5) === colonChar) {
                    // Assume xlink namespace
                    elm.setAttributeNS(xlinkNS, key, cur);
                }
                else {
                    elm.setAttribute(key, cur);
                }
            }
        }
    }
    // remove removed attributes
    // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
    // the other option is to remove all attributes with value == undefined
    for (key in oldAttrs) {
        if (!(key in attrs)) {
            elm.removeAttribute(key);
        }
    }
}
exports.attributesModule = { create: updateAttrs, update: updateAttrs };
exports.default = exports.attributesModule;
//# sourceMappingURL=attributes.js.map

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function updateClass(oldVnode, vnode) {
    var cur, name, elm = vnode.elm, oldClass = oldVnode.data.class, klass = vnode.data.class;
    if (!oldClass && !klass)
        return;
    if (oldClass === klass)
        return;
    oldClass = oldClass || {};
    klass = klass || {};
    for (name in oldClass) {
        if (!klass[name]) {
            elm.classList.remove(name);
        }
    }
    for (name in klass) {
        cur = klass[name];
        if (cur !== oldClass[name]) {
            elm.classList[cur ? 'add' : 'remove'](name);
        }
    }
}
exports.classModule = { create: updateClass, update: updateClass };
exports.default = exports.classModule;
//# sourceMappingURL=class.js.map

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CAPS_REGEX = /[A-Z]/g;
function updateDataset(oldVnode, vnode) {
    var elm = vnode.elm, oldDataset = oldVnode.data.dataset, dataset = vnode.data.dataset, key;
    if (!oldDataset && !dataset)
        return;
    if (oldDataset === dataset)
        return;
    oldDataset = oldDataset || {};
    dataset = dataset || {};
    var d = elm.dataset;
    for (key in oldDataset) {
        if (!dataset[key]) {
            if (d) {
                delete d[key];
            }
            else {
                elm.removeAttribute('data-' + key.replace(CAPS_REGEX, '-$&').toLowerCase());
            }
        }
    }
    for (key in dataset) {
        if (oldDataset[key] !== dataset[key]) {
            if (d) {
                d[key] = dataset[key];
            }
            else {
                elm.setAttribute('data-' + key.replace(CAPS_REGEX, '-$&').toLowerCase(), dataset[key]);
            }
        }
    }
}
exports.datasetModule = { create: updateDataset, update: updateDataset };
exports.default = exports.datasetModule;
//# sourceMappingURL=dataset.js.map

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function updateProps(oldVnode, vnode) {
    var key, cur, old, elm = vnode.elm, oldProps = oldVnode.data.props, props = vnode.data.props;
    if (!oldProps && !props)
        return;
    if (oldProps === props)
        return;
    oldProps = oldProps || {};
    props = props || {};
    for (key in oldProps) {
        if (!props[key]) {
            delete elm[key];
        }
    }
    for (key in props) {
        cur = props[key];
        old = oldProps[key];
        if (old !== cur && (key !== 'value' || elm[key] !== cur)) {
            elm[key] = cur;
        }
    }
}
exports.propsModule = { create: updateProps, update: updateProps };
exports.default = exports.propsModule;
//# sourceMappingURL=props.js.map

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var raf = (typeof window !== 'undefined' && window.requestAnimationFrame) || setTimeout;
var nextFrame = function (fn) { raf(function () { raf(fn); }); };
function setNextFrame(obj, prop, val) {
    nextFrame(function () { obj[prop] = val; });
}
function updateStyle(oldVnode, vnode) {
    var cur, name, elm = vnode.elm, oldStyle = oldVnode.data.style, style = vnode.data.style;
    if (!oldStyle && !style)
        return;
    if (oldStyle === style)
        return;
    oldStyle = oldStyle || {};
    style = style || {};
    var oldHasDel = 'delayed' in oldStyle;
    for (name in oldStyle) {
        if (!style[name]) {
            if (name[0] === '-' && name[1] === '-') {
                elm.style.removeProperty(name);
            }
            else {
                elm.style[name] = '';
            }
        }
    }
    for (name in style) {
        cur = style[name];
        if (name === 'delayed' && style.delayed) {
            for (var name2 in style.delayed) {
                cur = style.delayed[name2];
                if (!oldHasDel || cur !== oldStyle.delayed[name2]) {
                    setNextFrame(elm.style, name2, cur);
                }
            }
        }
        else if (name !== 'remove' && cur !== oldStyle[name]) {
            if (name[0] === '-' && name[1] === '-') {
                elm.style.setProperty(name, cur);
            }
            else {
                elm.style[name] = cur;
            }
        }
    }
}
function applyDestroyStyle(vnode) {
    var style, name, elm = vnode.elm, s = vnode.data.style;
    if (!s || !(style = s.destroy))
        return;
    for (name in style) {
        elm.style[name] = style[name];
    }
}
function applyRemoveStyle(vnode, rm) {
    var s = vnode.data.style;
    if (!s || !s.remove) {
        rm();
        return;
    }
    var name, elm = vnode.elm, i = 0, compStyle, style = s.remove, amount = 0, applied = [];
    for (name in style) {
        applied.push(name);
        elm.style[name] = style[name];
    }
    compStyle = getComputedStyle(elm);
    var props = compStyle['transition-property'].split(', ');
    for (; i < props.length; ++i) {
        if (applied.indexOf(props[i]) !== -1)
            amount++;
    }
    elm.addEventListener('transitionend', function (ev) {
        if (ev.target === elm)
            --amount;
        if (amount === 0)
            rm();
    });
}
exports.styleModule = {
    create: updateStyle,
    update: updateStyle,
    destroy: applyDestroyStyle,
    remove: applyRemoveStyle
};
exports.default = exports.styleModule;
//# sourceMappingURL=style.js.map

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var vnode_1 = __webpack_require__(12);
var is = __webpack_require__(33);
var htmldomapi_1 = __webpack_require__(32);
function isUndef(s) { return s === undefined; }
function isDef(s) { return s !== undefined; }
var emptyNode = vnode_1.default('', {}, [], undefined, undefined);
function sameVnode(vnode1, vnode2) {
    return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
}
function isVnode(vnode) {
    return vnode.sel !== undefined;
}
function createKeyToOldIdx(children, beginIdx, endIdx) {
    var i, map = {}, key, ch;
    for (i = beginIdx; i <= endIdx; ++i) {
        ch = children[i];
        if (ch != null) {
            key = ch.key;
            if (key !== undefined)
                map[key] = i;
        }
    }
    return map;
}
var hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];
var h_1 = __webpack_require__(6);
exports.h = h_1.h;
var thunk_1 = __webpack_require__(102);
exports.thunk = thunk_1.thunk;
function init(modules, domApi) {
    var i, j, cbs = {};
    var api = domApi !== undefined ? domApi : htmldomapi_1.default;
    for (i = 0; i < hooks.length; ++i) {
        cbs[hooks[i]] = [];
        for (j = 0; j < modules.length; ++j) {
            var hook = modules[j][hooks[i]];
            if (hook !== undefined) {
                cbs[hooks[i]].push(hook);
            }
        }
    }
    function emptyNodeAt(elm) {
        var id = elm.id ? '#' + elm.id : '';
        var c = elm.className ? '.' + elm.className.split(' ').join('.') : '';
        return vnode_1.default(api.tagName(elm).toLowerCase() + id + c, {}, [], undefined, elm);
    }
    function createRmCb(childElm, listeners) {
        return function rmCb() {
            if (--listeners === 0) {
                var parent_1 = api.parentNode(childElm);
                api.removeChild(parent_1, childElm);
            }
        };
    }
    function createElm(vnode, insertedVnodeQueue) {
        var i, data = vnode.data;
        if (data !== undefined) {
            if (isDef(i = data.hook) && isDef(i = i.init)) {
                i(vnode);
                data = vnode.data;
            }
        }
        var children = vnode.children, sel = vnode.sel;
        if (sel === '!') {
            if (isUndef(vnode.text)) {
                vnode.text = '';
            }
            vnode.elm = api.createComment(vnode.text);
        }
        else if (sel !== undefined) {
            // Parse selector
            var hashIdx = sel.indexOf('#');
            var dotIdx = sel.indexOf('.', hashIdx);
            var hash = hashIdx > 0 ? hashIdx : sel.length;
            var dot = dotIdx > 0 ? dotIdx : sel.length;
            var tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
            var elm = vnode.elm = isDef(data) && isDef(i = data.ns) ? api.createElementNS(i, tag)
                : api.createElement(tag);
            if (hash < dot)
                elm.setAttribute('id', sel.slice(hash + 1, dot));
            if (dotIdx > 0)
                elm.setAttribute('class', sel.slice(dot + 1).replace(/\./g, ' '));
            for (i = 0; i < cbs.create.length; ++i)
                cbs.create[i](emptyNode, vnode);
            if (is.array(children)) {
                for (i = 0; i < children.length; ++i) {
                    var ch = children[i];
                    if (ch != null) {
                        api.appendChild(elm, createElm(ch, insertedVnodeQueue));
                    }
                }
            }
            else if (is.primitive(vnode.text)) {
                api.appendChild(elm, api.createTextNode(vnode.text));
            }
            i = vnode.data.hook; // Reuse variable
            if (isDef(i)) {
                if (i.create)
                    i.create(emptyNode, vnode);
                if (i.insert)
                    insertedVnodeQueue.push(vnode);
            }
        }
        else {
            vnode.elm = api.createTextNode(vnode.text);
        }
        return vnode.elm;
    }
    function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
        for (; startIdx <= endIdx; ++startIdx) {
            var ch = vnodes[startIdx];
            if (ch != null) {
                api.insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before);
            }
        }
    }
    function invokeDestroyHook(vnode) {
        var i, j, data = vnode.data;
        if (data !== undefined) {
            if (isDef(i = data.hook) && isDef(i = i.destroy))
                i(vnode);
            for (i = 0; i < cbs.destroy.length; ++i)
                cbs.destroy[i](vnode);
            if (vnode.children !== undefined) {
                for (j = 0; j < vnode.children.length; ++j) {
                    i = vnode.children[j];
                    if (i != null && typeof i !== "string") {
                        invokeDestroyHook(i);
                    }
                }
            }
        }
    }
    function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
        for (; startIdx <= endIdx; ++startIdx) {
            var i_1 = void 0, listeners = void 0, rm = void 0, ch = vnodes[startIdx];
            if (ch != null) {
                if (isDef(ch.sel)) {
                    invokeDestroyHook(ch);
                    listeners = cbs.remove.length + 1;
                    rm = createRmCb(ch.elm, listeners);
                    for (i_1 = 0; i_1 < cbs.remove.length; ++i_1)
                        cbs.remove[i_1](ch, rm);
                    if (isDef(i_1 = ch.data) && isDef(i_1 = i_1.hook) && isDef(i_1 = i_1.remove)) {
                        i_1(ch, rm);
                    }
                    else {
                        rm();
                    }
                }
                else {
                    api.removeChild(parentElm, ch.elm);
                }
            }
        }
    }
    function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
        var oldStartIdx = 0, newStartIdx = 0;
        var oldEndIdx = oldCh.length - 1;
        var oldStartVnode = oldCh[0];
        var oldEndVnode = oldCh[oldEndIdx];
        var newEndIdx = newCh.length - 1;
        var newStartVnode = newCh[0];
        var newEndVnode = newCh[newEndIdx];
        var oldKeyToIdx;
        var idxInOld;
        var elmToMove;
        var before;
        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
            if (oldStartVnode == null) {
                oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
            }
            else if (oldEndVnode == null) {
                oldEndVnode = oldCh[--oldEndIdx];
            }
            else if (newStartVnode == null) {
                newStartVnode = newCh[++newStartIdx];
            }
            else if (newEndVnode == null) {
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldStartVnode, newStartVnode)) {
                patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
                oldStartVnode = oldCh[++oldStartIdx];
                newStartVnode = newCh[++newStartIdx];
            }
            else if (sameVnode(oldEndVnode, newEndVnode)) {
                patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
                oldEndVnode = oldCh[--oldEndIdx];
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldStartVnode, newEndVnode)) {
                patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
                api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
                oldStartVnode = oldCh[++oldStartIdx];
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldEndVnode, newStartVnode)) {
                patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
                api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
                oldEndVnode = oldCh[--oldEndIdx];
                newStartVnode = newCh[++newStartIdx];
            }
            else {
                if (oldKeyToIdx === undefined) {
                    oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                }
                idxInOld = oldKeyToIdx[newStartVnode.key];
                if (isUndef(idxInOld)) {
                    api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                    newStartVnode = newCh[++newStartIdx];
                }
                else {
                    elmToMove = oldCh[idxInOld];
                    if (elmToMove.sel !== newStartVnode.sel) {
                        api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                    }
                    else {
                        patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
                        oldCh[idxInOld] = undefined;
                        api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
                    }
                    newStartVnode = newCh[++newStartIdx];
                }
            }
        }
        if (oldStartIdx > oldEndIdx) {
            before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
            addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
        }
        else if (newStartIdx > newEndIdx) {
            removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
        }
    }
    function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
        var i, hook;
        if (isDef(i = vnode.data) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {
            i(oldVnode, vnode);
        }
        var elm = vnode.elm = oldVnode.elm;
        var oldCh = oldVnode.children;
        var ch = vnode.children;
        if (oldVnode === vnode)
            return;
        if (vnode.data !== undefined) {
            for (i = 0; i < cbs.update.length; ++i)
                cbs.update[i](oldVnode, vnode);
            i = vnode.data.hook;
            if (isDef(i) && isDef(i = i.update))
                i(oldVnode, vnode);
        }
        if (isUndef(vnode.text)) {
            if (isDef(oldCh) && isDef(ch)) {
                if (oldCh !== ch)
                    updateChildren(elm, oldCh, ch, insertedVnodeQueue);
            }
            else if (isDef(ch)) {
                if (isDef(oldVnode.text))
                    api.setTextContent(elm, '');
                addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
            }
            else if (isDef(oldCh)) {
                removeVnodes(elm, oldCh, 0, oldCh.length - 1);
            }
            else if (isDef(oldVnode.text)) {
                api.setTextContent(elm, '');
            }
        }
        else if (oldVnode.text !== vnode.text) {
            api.setTextContent(elm, vnode.text);
        }
        if (isDef(hook) && isDef(i = hook.postpatch)) {
            i(oldVnode, vnode);
        }
    }
    return function patch(oldVnode, vnode) {
        var i, elm, parent;
        var insertedVnodeQueue = [];
        for (i = 0; i < cbs.pre.length; ++i)
            cbs.pre[i]();
        if (!isVnode(oldVnode)) {
            oldVnode = emptyNodeAt(oldVnode);
        }
        if (sameVnode(oldVnode, vnode)) {
            patchVnode(oldVnode, vnode, insertedVnodeQueue);
        }
        else {
            elm = oldVnode.elm;
            parent = api.parentNode(elm);
            createElm(vnode, insertedVnodeQueue);
            if (parent !== null) {
                api.insertBefore(parent, vnode.elm, api.nextSibling(elm));
                removeVnodes(parent, [oldVnode], 0, 0);
            }
        }
        for (i = 0; i < insertedVnodeQueue.length; ++i) {
            insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
        }
        for (i = 0; i < cbs.post.length; ++i)
            cbs.post[i]();
        return vnode;
    };
}
exports.init = init;
//# sourceMappingURL=snabbdom.js.map

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var h_1 = __webpack_require__(6);
function copyToThunk(vnode, thunk) {
    thunk.elm = vnode.elm;
    vnode.data.fn = thunk.data.fn;
    vnode.data.args = thunk.data.args;
    thunk.data = vnode.data;
    thunk.children = vnode.children;
    thunk.text = vnode.text;
    thunk.elm = vnode.elm;
}
function init(thunk) {
    var cur = thunk.data;
    var vnode = cur.fn.apply(undefined, cur.args);
    copyToThunk(vnode, thunk);
}
function prepatch(oldVnode, thunk) {
    var i, old = oldVnode.data, cur = thunk.data;
    var oldArgs = old.args, args = cur.args;
    if (old.fn !== cur.fn || oldArgs.length !== args.length) {
        copyToThunk(cur.fn.apply(undefined, args), thunk);
        return;
    }
    for (i = 0; i < args.length; ++i) {
        if (oldArgs[i] !== args[i]) {
            copyToThunk(cur.fn.apply(undefined, args), thunk);
            return;
        }
    }
    copyToThunk(oldVnode, thunk);
}
exports.thunk = function thunk(sel, key, fn, args) {
    if (args === undefined) {
        args = fn;
        fn = key;
        key = undefined;
    }
    return h_1.h(sel, {
        key: key,
        hook: { init: init, prepatch: prepatch },
        fn: fn,
        args: args
    });
};
exports.default = exports.thunk;
//# sourceMappingURL=thunk.js.map

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var vnode_1 = __webpack_require__(12);
var htmldomapi_1 = __webpack_require__(32);
function toVNode(node, domApi) {
    var api = domApi !== undefined ? domApi : htmldomapi_1.default;
    var text;
    if (api.isElement(node)) {
        var id = node.id ? '#' + node.id : '';
        var cn = node.getAttribute('class');
        var c = cn ? '.' + cn.split(' ').join('.') : '';
        var sel = api.tagName(node).toLowerCase() + id + c;
        var attrs = {};
        var children = [];
        var name_1;
        var i = void 0, n = void 0;
        var elmAttrs = node.attributes;
        var elmChildren = node.childNodes;
        for (i = 0, n = elmAttrs.length; i < n; i++) {
            name_1 = elmAttrs[i].nodeName;
            if (name_1 !== 'id' && name_1 !== 'class') {
                attrs[name_1] = elmAttrs[i].nodeValue;
            }
        }
        for (i = 0, n = elmChildren.length; i < n; i++) {
            children.push(toVNode(elmChildren[i]));
        }
        return vnode_1.default(sel, { attrs: attrs }, children, undefined, node);
    }
    else if (api.isText(node)) {
        text = api.getTextContent(node);
        return vnode_1.default(undefined, undefined, undefined, text, node);
    }
    else if (api.isComment(node)) {
        text = api.getTextContent(node);
        return vnode_1.default('!', {}, [], text, node);
    }
    else {
        return vnode_1.default('', {}, [], undefined, undefined);
    }
}
exports.toVNode = toVNode;
exports.default = toVNode;
//# sourceMappingURL=tovnode.js.map

/***/ }),
/* 104 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(global, module) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ponyfill_js__ = __webpack_require__(105);
/* global window */


var root;

if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (true) {
  root = module;
} else {
  root = Function('return this')();
}

var result = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__ponyfill_js__["a" /* default */])(root);
/* harmony default export */ __webpack_exports__["default"] = (result);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(17), __webpack_require__(106)(module)))

/***/ }),
/* 105 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = symbolObservablePonyfill;
function symbolObservablePonyfill(root) {
	var result;
	var Symbol = root.Symbol;

	if (typeof Symbol === 'function') {
		if (Symbol.observable) {
			result = Symbol.observable;
		} else {
			result = Symbol('observable');
			Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
};


/***/ }),
/* 106 */
/***/ (function(module, exports) {

module.exports = function(originalModule) {
	if(!originalModule.webpackPolyfill) {
		var module = Object.create(originalModule);
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		Object.defineProperty(module, "exports", {
			enumerable: true,
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map