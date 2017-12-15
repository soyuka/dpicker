(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.dpicker_time = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
            if (/^[\n\r\s]+$/.test(node))
                continue;
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
},{}],2:[function(require,module,exports){
module.exports = function yoyoifySetAttribute(el, attr, value) {
    if (typeof attr === 'object') {
        for (var i in attr) {
            if (attr.hasOwnProperty(i)) {
                yoyoifySetAttribute(el, i, attr[i]);
            }
        }
        return;
    }
    if (!attr)
        return;
    if (attr === 'className')
        attr = 'class';
    if (attr === 'htmlFor')
        attr = 'for';
    if (attr.slice(0, 2) === 'on') {
        el[attr] = value;
    } else {
        if (value === true)
            value = attr;
        el.setAttribute(attr, value);
    }
};
},{}],3:[function(require,module,exports){
'use strict';
var _appendChild = require('yo-yoify/lib/appendChild'), _setAttribute = require('yo-yoify/lib/setAttribute');
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
    var MERIDIEM_TOKENS = [
        'AM',
        'PM'
    ];
    function getHoursMinutes(data) {
        var hours = data.meridiem ? HOURS12 : HOURS24;
        var step = parseInt(data.step);
        var minutes = MINUTES.filter(function (e) {
            return e % step === 0;
        });
        var modelHours = DPicker.dateAdapter.getHours(data.model);
        [
            data.min,
            data.max
        ].map(function (e, i) {
            if (!DPicker.dateAdapter.isSameDay(data.model, e)) {
                return;
            }
            var xHours = DPicker.dateAdapter.getHours(e);
            var xMinutes = DPicker.dateAdapter.getMinutes(e);
            var x = e;
            if (i === 0 && xMinutes + step > 60) {
                x = DPicker.dateAdapter.setMinutes(DPicker.dateAdapter.setHours(x, i === 0 ? ++xHours : --xHours), 0);
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
        return {
            hours: hours,
            minutes: minutes
        };
    }
    function padLeftZero(v) {
        return v < 10 ? '0' + v : '' + v;
    }
    function minutesStep() {
        if (!this.data.time || parseInt(this.data.step, 10) <= 1) {
            return;
        }
        var _getHoursMinutes = getHoursMinutes(this.data), minutes = _getHoursMinutes.minutes;
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
        var _getHoursMinutes2 = getHoursMinutes(data), hours = _getHoursMinutes2.hours, minutes = _getHoursMinutes2.minutes;
        var modelMinutes = DPicker.dateAdapter.getMinutes(data.model);
        var selects = [];
        var modelStringValue = modelHours + ':' + modelMinutes;
        var minHours = DPicker.dateAdapter.getHours(data.min);
        var minMinutes = DPicker.dateAdapter.getMinutes(data.min);
        var maxHours = DPicker.dateAdapter.getHours(data.max);
        var maxMinutes = DPicker.dateAdapter.getMinutes(data.max);
        if (data.concatHoursAndMinutes) {
            var _select;
            selects.push((_select = document.createElement('select'), _select.onchange = events.minuteHoursChange, _select.setAttribute('name', 'dpicker-time'), _select.setAttribute('aria-label', 'time'), _appendChild(_select, [
                ' ',
                [].concat.apply([], minutes.map(function (minute) {
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
                    if (a[0] < b[0]) {
                        return -1;
                    }
                    if (a[0] > b[0]) {
                        return 1;
                    }
                    if (a[1] < b[1]) {
                        return -1;
                    }
                    if (a[1] > b[1]) {
                        return 1;
                    }
                    return 0;
                }).map(function (value) {
                    var _option;
                    var text = value.split(':').map(padLeftZero).join(':');
                    return _option = document.createElement('option'), _setAttribute(_option, value === modelStringValue ? 'selected' : '', value === modelStringValue ? 'selected' : ''), _option.setAttribute('value', '' + String(value) + ''), _appendChild(_option, [text]), _option;
                }),
                ' '
            ]), _select));
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
            selects.push((_select4 = document.createElement('select'), _select4.onchange = events.meridiemChange, _select4.setAttribute('name', 'dpicker-meridiem'), _appendChild(_select4, [
                ' ',
                MERIDIEM_TOKENS.map(function (e) {
                    var _option4;
                    return _option4 = document.createElement('option'), _setAttribute(_option4, modelMeridiem === e ? 'selected' : '', modelMeridiem === e ? 'selected' : ''), _option4.setAttribute('value', '' + String(e) + ''), _appendChild(_option4, [e]), _option4;
                }),
                ' '
            ]), _select4));
        }
        return _dpickerTime2 = document.createElement('span'), _dpickerTime2.setAttribute('class', 'dpicker-time'), _appendChild(_dpickerTime2, [selects]), _dpickerTime2;
    };
    DPicker.events.hoursChange = function hoursChange(evt) {
        this.data.empty = false;
        var val = parseInt(evt.target.options[evt.target.selectedIndex].value, 10);
        if (this.data.meridiem !== false) {
            if (DPicker.dateAdapter.getMeridiem(this.data.model) === MERIDIEM_TOKENS[1]) {
                val = val === 12 ? 12 : val + 12;
            } else if (val === 12) {
                val = 0;
            }
        }
        this.model = DPicker.dateAdapter.setHours(this.data.model, val);
        if (evt.redraw === false) {
            this.redraw();
        }
        this.onChange({
            modelChanged: true,
            name: 'hoursChange',
            event: evt
        });
    };
    DPicker.events.minutesChange = function minutesChange(evt) {
        this.data.empty = false;
        this.model = DPicker.dateAdapter.setMinutes(this.data.model, evt.target.options[evt.target.selectedIndex].value);
        if (evt.redraw === false) {
            this.redraw();
        }
        this.onChange({
            modelChanged: true,
            name: 'minutesChange',
            event: evt
        });
    };
    DPicker.events.minuteHoursChange = function minuteHoursChange(evt) {
        var val = evt.target.options[evt.target.selectedIndex].value.split(':');
        this.events.hoursChange({
            target: {
                options: [{ value: val[0] }],
                selectedIndex: 0
            },
            redraw: false
        });
        this.events.minutesChange({
            target: {
                options: [{ value: val[1] }],
                selectedIndex: 0
            },
            redraw: false
        });
        this.redraw();
    };
    DPicker.events.meridiemChange = function meridiemChange(evt) {
        this.data.empty = false;
        var val = evt.target.options[evt.target.selectedIndex].value;
        var hours = DPicker.dateAdapter.getHours(this.data.model);
        if (val === MERIDIEM_TOKENS[0]) {
            hours = hours === 12 ? 0 : hours - 12;
        } else {
            hours = hours === 12 ? 12 : hours + 12;
        }
        this.model = DPicker.dateAdapter.setHours(this.data.model, hours);
        this.redraw();
        this.onChange({
            modelChanged: true,
            name: 'meridiemChange',
            event: evt
        });
    };
    DPicker.events.inputChange = DPicker.decorate(DPicker.events.inputChange, function timeInputChange() {
        minutesStep.apply(this);
    });
    DPicker.prototype.initialize = DPicker.decorate(DPicker.prototype.initialize, function timeInitialize() {
        minutesStep.apply(this);
    });
    DPicker.prototype.redraw = DPicker.decorate(DPicker.prototype.redraw, function timeRedraw() {
        minutesStep.apply(this);
    });
    DPicker.properties.time = function getTimeAttribute(attributes) {
        return attributes.type === 'datetime';
    };
    DPicker.properties.step = function getStepAttribute(attributes) {
        return attributes.step ? parseInt(attributes.step, 10) : 1;
    };
    DPicker.properties.meridiem = false;
    DPicker.properties.concatHoursAndMinutes = false;
    return DPicker;
};
},{"yo-yoify/lib/appendChild":1,"yo-yoify/lib/setAttribute":2}]},{},[3])(3)
});