(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
'use strict';
var _appendChild = require('yo-yoify/lib/appendChild');
if (!DPicker) {
    throw new ReferenceError('DPicker is required for this extension to work');
}
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
function getHoursMinutes(data) {
    var hours = data.meridiem ? HOURS12 : HOURS24;
    var minutes = MINUTES.filter(function (e) {
        return e % data.step === 0;
    });
    [
        data.min,
        data.max
    ].map(function (e, i) {
        if (data.model.isSame(e, 'day')) {
            var xHours = +data.meridiem ? e.format('h') : e.hours();
            hours = hours.filter(function (e) {
                return i === 0 ? e >= xHours : e <= xHours;
            });
            if (data.model.isSame(e, 'hours')) {
                var xMinutes = e.minutes();
                minutes = minutes.filter(function (e) {
                    return i === 0 ? e >= xMinutes : e <= xHours;
                });
            }
        }
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
    if (!this._data.time) {
        return;
    }
    var _getHoursMinutes = getHoursMinutes(this._data), hours = _getHoursMinutes.hours, minutes = _getHoursMinutes.minutes;
    var modelMinutes = this._data.model.minutes();
    if (minutes.length === 0) {
        this._data.min.minutes(0);
        this._data.min.add(1, 'hours');
        var _getHoursMinutes2 = getHoursMinutes(this._data), _hours = _getHoursMinutes2.hours, _minutes = _getHoursMinutes2.minutes;
    }
    if (this._data.model.minutes() < minutes[0]) {
        this._data.model.minutes(minutes[0]);
        modelMinutes = minutes[0];
    }
    if (modelMinutes > minutes[minutes.length - 1]) {
        this._data.model.minutes(0);
        this._data.model.add(1, 'hours');
        return;
    }
    if (this._data.step <= 1) {
        return;
    }
    minutes[minutes.length] = 60;
    modelMinutes = minutes.reduce(function (prev, curr) {
        return Math.abs(curr - modelMinutes) < Math.abs(prev - modelMinutes) ? curr : prev;
    });
    minutes.length--;
    this._data.model.minutes(modelMinutes);
}
var renderTime = function renderTime(events, data, toRender) {
    var _dpickerTime2;
    if (!data.time) {
        var _dpickerTime;
        return _dpickerTime = document.createElement('span'), _dpickerTime.setAttribute('style', 'display: none;'), _dpickerTime.setAttribute('class', 'dpicker-time'), _dpickerTime;
    }
    var modelHours = data.model.hours();
    if (data.meridiem) {
        modelHours = modelHours > 12 ? modelHours - 12 : modelHours;
        modelHours = modelHours === 0 ? 12 : modelHours;
    }
    var _getHoursMinutes3 = getHoursMinutes(data), hours = _getHoursMinutes3.hours, minutes = _getHoursMinutes3.minutes;
    var modelMinutes = data.model.minutes();
    var selects = [];
    var modelStringValue = modelHours + ':' + modelMinutes;
    if (data.concatHoursAndMinutes) {
        var _select;
        selects.push((_select = document.createElement('select'), _select.onchange = events.minuteHoursChange, _select.setAttribute('name', 'dpicker-time'), _select.setAttribute('aria-label', 'time'), _appendChild(_select, [
            '\n        ',
            [].concat.apply([], minutes.map(function (minute) {
                return hours.map(function (hour) {
                    return hour + ':' + minute;
                });
            })).sort(function (a, b) {
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
                var text = value.split(':').map(padLeftZero).join(':');
                if (value === modelStringValue) {
                    var _option;
                    return _option = document.createElement('option'), _option.setAttribute('selected', 'selected'), _option.setAttribute('value', '' + String(value) + ''), _appendChild(_option, [text]), _option;
                } else {
                    var _option2;
                    return _option2 = document.createElement('option'), _option2.setAttribute('value', '' + String(value) + ''), _appendChild(_option2, [text]), _option2;
                }
            }),
            '\n      '
        ]), _select));
    } else {
        var _select2, _select3;
        selects.push((_select2 = document.createElement('select'), _select2.onchange = events.hoursChange, _select2.setAttribute('name', 'dpicker-hours'), _select2.setAttribute('aria-label', 'Hours'), _appendChild(_select2, [hours.map(function (e, i) {
                var _option3;
                return _option3 = document.createElement('option'), _option3.setAttribute('selected', '' + String(e === modelHours ? 'selected' : null) + ''), _option3.setAttribute('value', '' + String(e) + ''), _appendChild(_option3, [padLeftZero(e)]), _option3;
            })]), _select2), (_select3 = document.createElement('select'), _select3.onchange = events.minutesChange, _select3.setAttribute('name', 'dpicker-minutes'), _select3.setAttribute('aria-label', 'Minutes'), _appendChild(_select3, [minutes.map(function (e, i) {
                var _option4;
                return _option4 = document.createElement('option'), _option4.setAttribute('selected', '' + String(e === modelMinutes ? 'selected' : null) + ''), _option4.setAttribute('value', '' + String(e) + ''), _appendChild(_option4, [padLeftZero(e)]), _option4;
            })]), _select3));
    }
    if (data.meridiem) {
        var _select4;
        var modelMeridiem = data.model.format('A');
        selects.push((_select4 = document.createElement('select'), _select4.onchange = events.meridiemChange, _select4.setAttribute('name', 'dpicker-meridiem'), _appendChild(_select4, [
            '\n      ',
            [
                'AM',
                'PM'
            ].map(function (e) {
                if (modelMeridiem === e) {
                    var _option5;
                    return _option5 = document.createElement('option'), _option5.setAttribute('value', '' + String(e) + ''), _option5.setAttribute('selected', 'selected'), _appendChild(_option5, [e]), _option5;
                } else {
                    var _option6;
                    return _option6 = document.createElement('option'), _option6.setAttribute('value', '' + String(e) + ''), _appendChild(_option6, [e]), _option6;
                }
            }),
            '\n    '
        ]), _select4));
    }
    return _dpickerTime2 = document.createElement('span'), _dpickerTime2.setAttribute('class', 'dpicker-time'), _appendChild(_dpickerTime2, [selects]), _dpickerTime2;
};
var events = {
    hoursChange: function hoursChange(evt) {
        this._data.empty = false;
        var val = parseInt(evt.target.options[evt.target.selectedIndex].value, 10);
        if (this._data.meridiem) {
            if (this._data.model.format('A') === 'PM') {
                val = val === 12 ? 12 : val + 12;
            } else if (val === 12) {
                val = 0;
            }
        }
        this._data.model.hours(val);
        this.redraw();
        this.onChange();
    },
    minutesChange: function minutesChange(evt) {
        this._data.empty = false;
        this._data.model.minutes(evt.target.options[evt.target.selectedIndex].value);
        this.redraw();
        this.onChange();
    },
    minuteHoursChange: function minuteHoursChange(evt) {
        var val = evt.target.options[evt.target.selectedIndex].value.split(':');
        this._events.hoursChange({
            target: {
                options: [{ value: val[0] }],
                selectedIndex: 0
            }
        });
        this._events.minutesChange({
            target: {
                options: [{ value: val[1] }],
                selectedIndex: 0
            }
        });
    },
    meridiemChange: function meridiemChange(evt) {
        this._data.empty = false;
        var val = evt.target.options[evt.target.selectedIndex].value;
        var hours = this._data.model.hours();
        if (val === 'AM') {
            hours = hours === 12 ? 0 : hours - 12;
        } else {
            hours = hours === 12 ? 12 : hours + 12;
        }
        this._data.model.hours(hours);
        this.redraw();
        this.onChange();
    },
    inputChange: function inputChange() {
        minutesStep.apply(this);
    }
};
DPicker.modules.time = {
    events: events,
    render: { time: renderTime },
    properties: {
        time: {
            default: false,
            attribute: function attribute(attributes) {
                return attributes.type === 'datetime' ? true : undefined;
            }
        },
        meridiem: {
            default: false,
            attribute: 'meridiem'
        },
        step: {
            default: 1,
            attribute: function attribute(attributes) {
                return attributes.step ? parseInt(attributes.step, 10) : undefined;
            }
        },
        concatHoursAndMinutes: { default: false }
    },
    calls: {
        initialize: function timeParseInputAttributes(attributes) {
            minutesStep.apply(this);
        },
        redraw: function timeRedraw() {
            minutesStep.apply(this);
        },
        modelSetter: function timeModelSetter(newValue) {
            minutesStep.apply(this);
        }
    }
};
},{"yo-yoify/lib/appendChild":1}]},{},[2]);
