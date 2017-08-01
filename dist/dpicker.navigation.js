(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.dpicker_navigation = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
module.exports = function (DPicker) {
    DPicker.renders.previousMonth = function renderPreviousMonth(events, data) {
        var _button;
        var previous = DPicker.dateAdapter.subMonths(data.model, 1);
        return _button = document.createElement('button'), _button.onclick = events.previousMonth, _button.setAttribute('class', 'dpicker-previous-month ' + String(!DPicker.dateAdapter.isSameMonth(previous, data.min) && DPicker.dateAdapter.isBefore(previous, data.min) ? 'dpicker-invisible' : '') + ''), _button;
    };
    DPicker.renders.nextMonth = function renderNextMonth(events, data) {
        var _dpickerNextMonth;
        var next = DPicker.dateAdapter.addMonths(data.model, 1);
        return _dpickerNextMonth = document.createElement('button'), _dpickerNextMonth.onclick = events.nextMonth, _dpickerNextMonth.setAttribute('class', 'dpicker-next-month ' + String(!DPicker.dateAdapter.isSameMonth(next, data.max) && DPicker.dateAdapter.isAfter(next, data.max) ? 'dpicker-invisible' : '') + ''), _dpickerNextMonth;
    };
    DPicker.events.previousMonth = function previousMonth(evt) {
        this.model = DPicker.dateAdapter.subMonths(this.data.model, 1);
        this.redraw();
        this.onChange({
            modelChanged: true,
            name: 'previousMonth',
            event: evt
        });
    };
    DPicker.events.nextMonth = function nextMonth(evt) {
        this.model = DPicker.dateAdapter.addMonths(this.data.model, 1);
        this.redraw();
        this.onChange({
            modelChanged: true,
            name: 'nextMonth',
            event: evt
        });
    };
};
},{}]},{},[1])(1)
});