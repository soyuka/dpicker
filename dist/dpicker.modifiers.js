
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define('DPicker.modules.modifiers', ['DPicker', 'moment'], factory);
    } else if (typeof module === 'object' && module.exports) {
			  //node
        module.exports = factory(require('dpicker'), require('moment'));
    } else {
        // Browser globals (root is window)
        root.DPicker.modules.modifiers = factory(root.DPicker, root.moment);
    }
}(this, function (DPicker, moment) {
"use strict";
if (!DPicker) {
  throw new ReferenceError('DPicker is required for this extension to work');
}
function InputChange(evt) {
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
  this.model = moment().add(x, 'days');
}
var modifiers = DPicker.modules.modifiers = {inputChange: InputChange};

  return modifiers;
}));
