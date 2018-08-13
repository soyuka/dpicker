(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.dpicker_navigation = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}]},{},[1])(1)
});
