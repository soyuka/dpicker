(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.DPicker = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var morph = require('./lib/morph');
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
    if (!newNode.childNodes || !oldNode.childNodes)
        return;
    var newLength = newNode.childNodes.length;
    var oldLength = oldNode.childNodes.length;
    var length = Math.max(oldLength, newLength);
    var iNew = 0;
    var iOld = 0;
    for (var i = 0; i < length; i++, iNew++, iOld++) {
        var newChildNode = newNode.childNodes[iNew];
        var oldChildNode = oldNode.childNodes[iOld];
        var retChildNode = walk(newChildNode, oldChildNode);
        if (!retChildNode) {
            if (oldChildNode) {
                oldNode.removeChild(oldChildNode);
                iOld--;
            }
        } else if (!oldChildNode) {
            if (retChildNode) {
                oldNode.appendChild(retChildNode);
                iNew--;
            }
        } else if (retChildNode !== oldChildNode) {
            oldNode.replaceChild(retChildNode, oldChildNode);
            iNew--;
        }
    }
}
},{"./lib/morph":3}],2:[function(require,module,exports){
module.exports = [
    'onclick',
    'ondblclick',
    'onmousedown',
    'onmouseup',
    'onmouseover',
    'onmousemove',
    'onmouseout',
    'ondragstart',
    'ondrag',
    'ondragenter',
    'ondragleave',
    'ondragover',
    'ondrop',
    'ondragend',
    'onkeydown',
    'onkeypress',
    'onkeyup',
    'onunload',
    'onabort',
    'onerror',
    'onresize',
    'onscroll',
    'onselect',
    'onchange',
    'onsubmit',
    'onreset',
    'onfocus',
    'onblur',
    'oninput',
    'oncontextmenu',
    'onfocusin',
    'onfocusout'
];
},{}],3:[function(require,module,exports){
var events = require('./events');
var eventsLength = events.length;
var ELEMENT_NODE = 1;
var TEXT_NODE = 3;
var COMMENT_NODE = 8;
module.exports = morph;
function morph(newNode, oldNode) {
    var nodeType = newNode.nodeType;
    var nodeName = newNode.nodeName;
    if (nodeType === ELEMENT_NODE) {
        copyAttrs(newNode, oldNode);
    }
    if (nodeType === TEXT_NODE || nodeType === COMMENT_NODE) {
        oldNode.nodeValue = newNode.nodeValue;
    }
    if (nodeName === 'INPUT')
        updateInput(newNode, oldNode);
    else if (nodeName === 'OPTION')
        updateOption(newNode, oldNode);
    else if (nodeName === 'TEXTAREA')
        updateTextarea(newNode, oldNode);
    else if (nodeName === 'SELECT')
        updateSelect(newNode, oldNode);
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
            fromValue = oldNode.getAttribute(attrName);
            if (fromValue !== attrValue) {
                if (attrValue === 'null' || attrValue === 'undefined') {
                    oldNode.removeAttribute(attrName);
                } else {
                    oldNode.setAttribute(attrName, attrValue);
                }
            }
        }
    }
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
            oldNode[ev] = newNode[ev];
        } else if (oldNode[ev]) {
            oldNode[ev] = undefined;
        }
    }
}
function updateOption(newNode, oldNode) {
    updateAttribute(newNode, oldNode, 'selected');
}
function updateInput(newNode, oldNode) {
    var newValue = newNode.value;
    var oldValue = oldNode.value;
    updateAttribute(newNode, oldNode, 'checked');
    updateAttribute(newNode, oldNode, 'disabled');
    if (!newNode.hasAttributeNS(null, 'value') || newValue === 'null') {
        oldNode.value = '';
        oldNode.removeAttribute('value');
    } else if (newValue !== oldValue) {
        oldNode.setAttribute('value', newValue);
        oldNode.value = newValue;
    } else {
        oldNode.value = newValue;
    }
}
function updateTextarea(newNode, oldNode) {
    var newValue = newNode.value;
    if (newValue !== oldNode.value) {
        oldNode.value = newValue;
    }
    if (oldNode.firstChild) {
        if (newValue === '' && oldNode.firstChild.nodeValue === oldNode.placeholder) {
            return;
        }
        oldNode.firstChild.nodeValue = newValue;
    }
}
function updateSelect(newNode, oldNode) {
    if (!oldNode.hasAttributeNS(null, 'multiple')) {
        var curChild = newNode.firstChild;
        var i = 0;
        while (curChild) {
            var nodeName = curChild.nodeName;
            if (nodeName && nodeName.toUpperCase() === 'OPTION') {
                if (curChild.hasAttributeNS(null, 'selected') && curChild.getAttributeNS(null, 'selected') !== 'null')
                    break;
                i++;
            }
            curChild = curChild.nextSibling;
        }
        newNode.selectedIndex = oldNode.selectedIndex = i;
    }
}
function updateAttribute(newNode, oldNode, name) {
    if (newNode[name] !== oldNode[name]) {
        oldNode[name] = newNode[name];
        if (newNode[name]) {
            oldNode.setAttribute(name, '');
        } else {
            oldNode.removeAttribute(name, '');
        }
    }
}
},{"./events":2}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
'use strict';
var _appendChild = require('yo-yoify/lib/appendChild');
var nanomorph = require('nanomorph');
function uuid() {
    return ([10000000] + -1000 + -4000 + -8000 + -100000000000).replace(/[018]/g, function (a) {
        return (a ^ Math.random() * 16 >> a / 4).toString(16);
    });
}
function isElementInContainer(parent, containerId) {
    while (parent && parent !== document) {
        if (parent.getAttribute('id') === containerId) {
            return true;
        }
        parent = parent.parentNode;
    }
    return false;
}
function DPicker(element) {
    var _this = this;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (!(this instanceof DPicker)) {
        return new DPicker(element, options);
    }
    var _getContainer = this._getContainer(element), container = _getContainer.container, attributes = _getContainer.attributes;
    this._container = uuid();
    this._data = {};
    var defaults = {
        months: moment.months(),
        days: moment.weekdaysShort(),
        empty: false,
        valid: true,
        order: [
            'months',
            'years',
            'time',
            'days'
        ],
        hideOnDayClick: true,
        hideOnEnter: true,
        hideOnOutsideClick: true,
        siblingMonthDayClick: false,
        firstDayOfWeek: moment.localeData().firstDayOfWeek()
    };
    for (var i in defaults) {
        if (options[i] !== undefined) {
            this._data[i] = options[i];
            continue;
        }
        this._data[i] = defaults[i];
    }
    this._data.inputName = attributes.name ? attributes.name : options.inputName ? options.inputName : 'dpicker-input';
    this._data.inputId = attributes.id ? attributes.id : options.inputId ? options.inputId : uuid();
    this._setData('format', [
        attributes.format,
        'DD/MM/YYYY'
    ]);
    var methods = {
        display: false,
        min: moment('1986-01-01'),
        max: moment().add(1, 'year').month(11),
        format: this._data.format
    };
    for (var _i in methods) {
        if (options[_i] !== undefined) {
            methods[_i] = options[_i];
        }
    }
    this._events = this._loadEvents();
    this._loadModules(attributes, options);
    this._createMethods(methods, attributes);
    if (attributes.value === undefined || attributes.value === '') {
        this._data.empty = true;
    }
    this._setData('model', [
        attributes.value,
        options.model,
        moment()
    ], true);
    this.onChange = options.onChange;
    document.addEventListener('click', this._events.hide);
    document.addEventListener('touchend', function (e) {
        _this._events.inputBlur(e);
    });
    this.initialize();
    this._mount(container);
    container.id = this._container;
    container.addEventListener('keydown', this._events.keyDown);
    var input = container.querySelector('input');
    input.addEventListener('blur', this._events.inputBlur);
    return this;
}
DPicker.prototype._setData = function (key, values) {
    var isMoment = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    for (var i = 0; i < values.length; i++) {
        if (values[i] === undefined || values[i] === '') {
            continue;
        }
        if (isMoment === false) {
            this._data[key] = values[i];
            break;
        }
        if (values[i] instanceof moment && values[i].isValid()) {
            this._data[key] = values[i];
            break;
        }
        this._data[key] = moment();
        var date = moment(values[i], this._data.format, true);
        if (date.isValid()) {
            this._data[key] = date;
            break;
        }
    }
};
DPicker.prototype._createGetSet = function (key) {
    if (DPicker.prototype.hasOwnProperty(key)) {
        return;
    }
    Object.defineProperty(DPicker.prototype, key, {
        get: function get() {
            return this._data[key];
        },
        set: function set(newValue) {
            this._data[key] = newValue;
            this.redraw();
        }
    });
};
DPicker.prototype._createMethods = function (defaults, attributes) {
    for (var i in defaults) {
        this._createGetSet(i);
        this._setData(i, [
            attributes[i],
            defaults[i]
        ], defaults[i] instanceof moment);
    }
};
DPicker.prototype._getContainer = function (container) {
    if (typeof container === 'undefined') {
        throw new ReferenceError('Can not initialize DPicker without a container');
    }
    var attributes = {};
    [].slice.call(container.attributes).forEach(function (attribute) {
        attributes[attribute.name] = attribute.value;
    });
    if (container.length !== undefined && container[0]) {
        container = container[0];
    }
    if (container.tagName === 'INPUT') {
        if (!container.parentNode) {
            throw new ReferenceError('Can not initialize DPicker on an input without parent node');
        }
        var parentNode = container.parentNode;
        container.parentNode.removeChild(container);
        container = parentNode;
        container.classList.add('dpicker');
    }
    return {
        container: container,
        attributes: attributes
    };
};
DPicker.prototype._getRenderChild = function () {
    var children = {
        years: this.renderYears(this._events, this._data),
        months: this.renderMonths(this._events, this._data)
    };
    for (var render in this._modules.render) {
        children[render] = this._modules.render[render](this._events, this._data);
    }
    children.days = this.renderDays(this._events, this._data);
    return this._data.order.filter(function (e) {
        return children[e];
    }).map(function (e) {
        return children[e];
    });
};
DPicker.prototype._mount = function (element) {
    this._tree = this.getTree();
    element.appendChild(this._tree);
};
DPicker.prototype._decorate = function decorate(which, origin, key) {
    var self = this;
    return function () {
        var decorations = self._modules[which][key];
        for (var i = 0; i < decorations.length; i++) {
            if (decorations[i].apply(self, arguments) === false) {
                return false;
            }
        }
        return origin.apply(self, arguments);
    };
};
DPicker.prototype._loadModules = function loadModules(attributes, options) {
    this._modules = {
        calls: {},
        events: {},
        render: {}
    };
    var items = [
        'events',
        'calls'
    ];
    var calls = [
        'initialize',
        'redraw',
        'modelSetter'
    ];
    for (var moduleName in DPicker.modules) {
        var _module = DPicker.modules[moduleName];
        for (var i = 0; i < items.length; i++) {
            var which = items[i];
            for (var key in _module[which]) {
                if (which === items[0] && this._events[key] === undefined) {
                    this._events[key] = _module[which][key].bind(this);
                    continue;
                }
                var fn = _module[which][key];
                if (this._modules[which][key] === undefined) {
                    this._modules[which][key] = [fn];
                } else {
                    this._modules[which][key].push(fn);
                }
            }
        }
        if (_module.render) {
            for (var _i2 in _module.render) {
                if (_i2 in this._modules.render) {
                    throw new ReferenceError('Can not override a render method');
                }
                this._modules.render[_i2] = _module.render[_i2];
            }
        }
        if (_module.properties) {
            for (var _i3 in _module.properties) {
                if (this._data[_i3]) {
                    continue;
                }
                var prop = _module.properties[_i3];
                var attribute = typeof prop.attribute === 'function' ? prop.attribute(attributes) : attributes[prop.attribute];
                this._createGetSet(_i3);
                this._setData(_i3, [
                    attribute,
                    options[_i3],
                    prop.default
                ], prop.isMoment ? true : false);
            }
        }
    }
    for (var _i4 = 0; _i4 < items.length; _i4++) {
        var _which = items[_i4];
        var keys = _i4 === 0 ? Object.keys(this._events) : calls;
        for (var j = 0; j < keys.length; j++) {
            var _key = keys[j];
            if (this._modules[_which][_key] === undefined) {
                continue;
            }
            if (_i4 === 0) {
                var origin = this._events[_key];
                this._events[_key] = this._decorate(_which, origin, _key);
            } else {
                var _origin = this[_key];
                this[_key] = this._decorate(_which, _origin, _key);
            }
        }
    }
};
DPicker.prototype._loadEvents = function loadEvents() {
    var _this2 = this;
    return {
        hide: function hide(evt) {
            if (_this2._data.hideOnOutsideClick === false || _this2.display === false) {
                return;
            }
            var node = evt.target;
            if (isElementInContainer(node.parentNode, _this2._container)) {
                return;
            }
            _this2.display = false;
            _this2.onChange(false);
        },
        inputChange: function inputChange(evt) {
            if (!evt.target.value) {
                _this2._data.empty = true;
            } else {
                var newModel = moment(evt.target.value, _this2._data.format, true);
                if (_this2.isValid(newModel) === true) {
                    _this2._data.model = newModel;
                }
                _this2._data.empty = false;
            }
            _this2.redraw();
            _this2.onChange({
                modelChanged: true,
                name: 'inputChange',
                event: evt
            });
        },
        inputBlur: function inputBlur(evt) {
            if (_this2.display === false) {
                return;
            }
            var node = evt.relatedTarget || evt.target;
            if (isElementInContainer(node.parentNode, _this2._container)) {
                return;
            }
            _this2.display = false;
            _this2.onChange({
                modelChanged: false,
                name: 'inputBlur',
                event: evt
            });
        },
        inputFocus: function inputFocus(evt) {
            _this2.display = true;
            if (evt.target && evt.target.select) {
                evt.target.select();
            }
            _this2.onChange({
                modelChanged: false,
                name: 'inputFocus',
                event: evt
            });
        },
        yearChange: function yearChange(evt) {
            _this2._data.empty = false;
            _this2._data.model.year(evt.target.options[evt.target.selectedIndex].value);
            _this2.isValid(_this2._data.model);
            _this2.redraw();
            _this2.onChange({
                modelChanged: true,
                name: 'yearChange',
                event: evt
            });
        },
        monthChange: function monthChange(evt) {
            _this2._data.empty = false;
            _this2._data.model.month(evt.target.options[evt.target.selectedIndex].value);
            _this2.isValid(_this2._data.model);
            _this2.redraw();
            _this2.onChange({
                modelChanged: true,
                name: 'monthChange',
                event: evt
            });
        },
        dayClick: function dayClick(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            _this2._data.model.date(evt.target.value);
            _this2._data.empty = false;
            if (_this2._data.hideOnDayClick) {
                _this2.display = false;
            }
            _this2.isValid(_this2._data.model);
            _this2.redraw();
            _this2.onChange({
                modelChanged: true,
                name: 'dayClick',
                event: evt
            });
        },
        previousMonthDayClick: function previousMonthDayClick(evt) {
            if (!_this2._data.siblingMonthDayClick) {
                return;
            }
            evt.preventDefault();
            evt.stopPropagation();
            _this2._data.model.date(evt.target.value);
            _this2._data.model.subtract(1, 'month');
            _this2._data.empty = false;
            if (_this2._data.hideOnDayClick) {
                _this2.display = false;
            }
            _this2.isValid(_this2._data.model);
            _this2.redraw();
            _this2.onChange({
                modelChanged: true,
                name: 'previousMonthDayClick',
                event: evt
            });
        },
        nextMonthDayClick: function nextMonthDayClick(evt) {
            if (!_this2._data.siblingMonthDayClick) {
                return;
            }
            evt.preventDefault();
            evt.stopPropagation();
            _this2._data.model.date(evt.target.value);
            _this2._data.model.add(1, 'month');
            _this2._data.empty = false;
            if (_this2._data.hideOnDayClick) {
                _this2.display = false;
            }
            _this2.isValid(_this2._data.model);
            _this2.redraw();
            _this2.onChange({
                modelChanged: true,
                name: 'nextMonthDayClick',
                event: evt
            });
        },
        dayKeyDown: function dayKeyDown() {
        },
        keyDown: function keyDown(evt) {
            if (!_this2._data.hideOnEnter) {
                return;
            }
            var key = evt.which || evt.keyCode;
            if (key !== 13 && key !== 27) {
                return;
            }
            document.getElementById(_this2.inputId).blur();
            _this2.display = false;
            _this2.onChange({
                modelChanged: false,
                name: 'keyDown',
                event: evt
            });
        }
    };
};
DPicker.prototype.getTree = function () {
    return this.renderContainer(this._events, this._data, [
        this.renderInput(this._events, this._data),
        this.render(this._events, this._data, this._getRenderChild())
    ]);
};
DPicker.prototype.isValid = function isValid(model) {
    if (!(model instanceof moment) || !model.isValid()) {
        this._data.valid = false;
        return false;
    }
    var unit = this.time ? 'minute' : 'day';
    if (model.isBefore(this._data.min, unit) || model.isAfter(this._data.max, unit)) {
        this._data.valid = false;
        return true;
    }
    this._data.valid = true;
    return true;
};
DPicker.prototype.renderInput = function renderInput(events, data, toRender) {
    var _;
    return _ = document.createElement('input'), _.setAttribute('id', '' + String(data.inputId) + ''), _.setAttribute('value', '' + String(data.empty === true ? '' : data.model.format(data.format)) + ''), _.setAttribute('type', 'text'), _.setAttribute('min', '' + String(data.min.format(data.format)) + ''), _.setAttribute('max', '' + String(data.max.format(data.format)) + ''), _.setAttribute('format', '' + String(data.format) + ''), _.onchange = events.inputChange, _.onfocus = events.inputFocus, _.setAttribute('name', '' + String(data.inputName) + ''), _.setAttribute('aria-invalid', '' + String(data.valid === false) + ''), _.setAttribute('aria-haspopup', 'aria-haspopup'), _.setAttribute('class', '' + String(data.valid === false ? 'dpicker-invalid' : '') + ''), _;
};
DPicker.prototype.renderContainer = function renderContainer(events, data, toRender) {
    var _dpicker;
    return _dpicker = document.createElement('div'), _dpicker.setAttribute('class', 'dpicker'), _appendChild(_dpicker, [toRender]), _dpicker;
};
DPicker.prototype.render = function render(events, data, toRender) {
    var _div;
    return _div = document.createElement('div'), _div.setAttribute('aria-hidden', '' + String(data.display === false) + ''), _div.setAttribute('class', 'dpicker-container ' + String(data.display === true ? 'dpicker-visible' : 'dpicker-invisible') + ''), _appendChild(_div, [
        '\n    ',
        toRender,
        '\n    '
    ]), _div;
};
DPicker.prototype.renderYears = function renderYears(events, data, toRender) {
    var _select;
    var modelYear = data.model.year();
    var futureYear = data.max.year() + 1;
    var pastYear = data.min.year();
    var options = [];
    while (--futureYear >= pastYear) {
        if (futureYear === modelYear) {
            var _option;
            options.push((_option = document.createElement('option'), _option.setAttribute('value', '' + String(futureYear) + ''), _option.setAttribute('selected', 'selected'), _appendChild(_option, [futureYear]), _option));
        } else {
            var _option2;
            options.push((_option2 = document.createElement('option'), _option2.setAttribute('value', '' + String(futureYear) + ''), _appendChild(_option2, [futureYear]), _option2));
        }
    }
    return _select = document.createElement('select'), _select.onchange = events.yearChange, _select.setAttribute('name', 'dpicker-year'), _select.setAttribute('aria-label', 'Year'), _appendChild(_select, [options]), _select;
};
DPicker.prototype.renderMonths = function renderMonths(events, data, toRender) {
    var _select2;
    var modelMonth = data.model.month();
    var currentYear = data.model.year();
    var months = data.months;
    var showMonths = data.months.map(function (e, i) {
        return i;
    });
    if (data.max.year() === currentYear) {
        var maxMonth = data.max.month();
        showMonths = showMonths.filter(function (e) {
            return e <= maxMonth;
        });
    }
    if (data.min.year() === currentYear) {
        var minMonth = data.min.month();
        showMonths = showMonths.filter(function (e) {
            return e >= minMonth;
        });
    }
    return _select2 = document.createElement('select'), _select2.onchange = events.monthChange, _select2.setAttribute('name', 'dpicker-month'), _select2.setAttribute('aria-label', 'Month'), _appendChild(_select2, [
        '\n      ',
        showMonths.map(function (e, i) {
            var _option3, _option4;
            return e === modelMonth ? (_option3 = document.createElement('option'), _option3.setAttribute('value', '' + String(e) + ''), _option3.setAttribute('selected', 'selected'), _appendChild(_option3, [months[e]]), _option3) : (_option4 = document.createElement('option'), _option4.setAttribute('value', '' + String(e) + ''), _appendChild(_option4, [months[e]]), _option4);
        }),
        '\n    '
    ]), _select2;
};
DPicker.prototype.renderDays = function renderDays(events, data, toRender) {
    var _tr, _table;
    var daysInMonth = data.model.daysInMonth();
    var daysInPreviousMonth = data.model.clone().subtract(1, 'months').daysInMonth();
    var firstLocaleDay = data.firstDayOfWeek;
    var firstDay = +data.model.clone().date(1).format('e') - 1;
    var currentDay = data.model.date();
    var currentMonth = data.model.month();
    var currentYear = data.model.year();
    var minDay = void 0;
    var maxDay = void 0;
    var minMonth = void 0;
    var maxMonth = void 0;
    var days = new Array(7);
    data.days.map(function (e, i) {
        days[i < firstLocaleDay ? 6 - i : i - firstLocaleDay] = e;
    });
    if (data.model.isSame(data.min, 'month')) {
        minDay = data.min.date();
        minMonth = data.min.month();
    }
    if (data.model.isSame(data.max, 'month')) {
        maxDay = data.max.date();
        maxMonth = data.max.month();
    }
    var rows = new Array(Math.ceil(0.1 + (firstDay + daysInMonth) / 7)).fill(0);
    var day = void 0;
    var dayActive = void 0;
    var previousMonth = false;
    var nextMonth = false;
    var loopend = true;
    var classActive = '';
    return _table = document.createElement('table'), _appendChild(_table, [
        '\n    ',
        (_tr = document.createElement('tr'), _appendChild(_tr, [days.map(function (e) {
                var _th;
                return _th = document.createElement('th'), _appendChild(_th, [e]), _th;
            })]), _tr),
        '\n    ',
        rows.map(function (e, row) {
            var _tr2;
            return _tr2 = document.createElement('tr'), _appendChild(_tr2, [new Array(7).fill(0).map(function (e, col) {
                    var _2, _button, _3;
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
                    var currentDayModel = moment(day + '-' + dayMonth + '-' + currentYear, 'DD-MM-YYYY');
                    if (dayActive === false && data.siblingMonthDayClick === true) {
                        dayActive = true;
                    }
                    if (data.min && dayActive) {
                        dayActive = currentDayModel.isSameOrAfter(data.min, 'day');
                    }
                    if (data.max && dayActive) {
                        dayActive = currentDayModel.isSameOrBefore(data.max, 'day');
                    }
                    if (dayActive === true && previousMonth === false && nextMonth === false && currentDay === day) {
                        classActive = 'dpicker-active';
                    }
                    return _2 = document.createElement('td'), _2.setAttribute('class', '' + String(dayActive === true ? 'dpicker-active' : 'dpicker-inactive') + ''), _appendChild(_2, [
                        '\n          ',
                        dayActive === true ? (_button = document.createElement('button'), _button.setAttribute('value', '' + String(day) + ''), _button.setAttribute('aria-label', 'Day ' + String(day) + ''), _button.setAttribute('aria-disabled', '' + String(dayActive) + ''), _button.onclick = previousMonth === false && nextMonth === false ? events.dayClick : previousMonth === true ? events.previousMonthDayClick : events.nextMonthDayClick, _button.setAttribute('type', 'button'), _button.onkeydown = events.dayKeyDown, _button.setAttribute('class', '' + String(classActive) + ''), _appendChild(_button, [
                            '\n                ',
                            day,
                            '\n              '
                        ]), _button) : (_3 = document.createElement('span'), _3.setAttribute('class', '' + String(classActive) + ''), _appendChild(_3, [day]), _3),
                        '\n          '
                    ]), _2;
                })]), _tr2;
        }),
        '\n  '
    ]), _table;
};
DPicker.prototype.initialize = function () {
    this.isValid(this._data.model);
};
DPicker.prototype.modelSetter = function (newValue) {
    this._data.empty = !newValue;
    if (this.isValid(newValue) === true) {
        this._data.model = newValue;
    }
    this.redraw();
};
DPicker.prototype.redraw = function () {
    var newTree = this.getTree();
    this._tree = nanomorph(this._tree, newTree);
};
Object.defineProperties(DPicker.prototype, {
    'container': {
        get: function get() {
            return this._container;
        }
    },
    'inputId': {
        get: function get() {
            return this._data.inputId;
        }
    },
    'input': {
        get: function get() {
            if (this._data.empty) {
                return '';
            }
            return this._data.model.format(this._data.format);
        }
    },
    'onChange': {
        set: function set(onChange) {
            var _this3 = this;
            this._onChange = function (dpickerEvent) {
                return !onChange ? false : onChange(_this3._data, dpickerEvent);
            };
        },
        get: function get() {
            return this._onChange;
        }
    },
    'valid': {
        get: function get() {
            return this._data.valid;
        }
    },
    'model': {
        set: function set(newValue) {
            this.modelSetter(newValue);
        },
        get: function get() {
            return this._data.model;
        }
    }
});
DPicker.modules = {};
module.exports = DPicker;
},{"nanomorph":1,"yo-yoify/lib/appendChild":4}]},{},[5])(5)
});