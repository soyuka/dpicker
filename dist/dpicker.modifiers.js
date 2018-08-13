(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.dpicker_modifiers = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}]},{},[1])(1)
});
