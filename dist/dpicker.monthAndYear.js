(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.dpicker_monthAndYear = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = function yoyoifyAppendChild (el, childs) {
  for (var i = 0; i < childs.length; i++) {
    var node = childs[i]
    if (Array.isArray(node)) {
      yoyoifyAppendChild(el, node)
      continue
    }
    if (typeof node === 'number' ||
      typeof node === 'boolean' ||
      node instanceof Date ||
      node instanceof RegExp) {
      node = node.toString()
    }
    if (typeof node === 'string') {
      if (/^[\n\r\s]+$/.test(node)) continue
      if (el.lastChild && el.lastChild.nodeName === '#text') {
        el.lastChild.nodeValue += node
        continue
      }
      node = document.createTextNode(node)
    }
    if (node && node.nodeType) {
      el.appendChild(node)
    }
  }
}

},{}],2:[function(require,module,exports){
module.exports = function yoyoifySetAttribute (el, attr, value) {
  if (typeof attr === 'object') {
    for (var i in attr) {
      if (attr.hasOwnProperty(i)) {
        yoyoifySetAttribute(el, i, attr[i])
      }
    }
    return
  }
  if (!attr) return
  if (attr === 'className') attr = 'class'
  if (attr === 'htmlFor') attr = 'for'
  if (attr.slice(0, 2) === 'on') {
    el[attr] = value
  } else {
    // assume a boolean attribute if the value === true
    // no need to do typeof because "false" would've caused an early return
    if (value === true) value = attr
    el.setAttribute(attr, value)
  }
}

},{}],3:[function(require,module,exports){
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

},{"yo-yoify/lib/appendChild":1,"yo-yoify/lib/setAttribute":2}]},{},[3])(3)
});
