(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
if (!DPicker) {
    throw new ReferenceError('DPicker is required for this extension to work');
}
function ModifierInputChange(evt) {
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
    this._data.model = moment().add(x, 'days');
    this.onChange();
}
var modifiers = DPicker.modules.modifiers = { events: { inputChange: ModifierInputChange } };
},{}]},{},[1]);
