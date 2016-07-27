'use strict'

if (!DPicker) {
  throw new ReferenceError('DPicker is required for this extension to work')
}

/**
 * @module DPicker.modules.modifiers
 */

/**
 * Enables modifiers on `+[num]` and `-[num]` where:
 * - `+` gives the current date
 * - `+10` gives the current date + 10 days
 * - `-` gives the previous date
 * - `-10` gives the previous date - 10 days
 * @param {Event} DOMEvent
 * @listens DPicker#inputChange
 */
function ModifierInputChange(evt) {

  let first = evt.target.value.charAt(0)
  let x = evt.target.value.slice(1) || 0

  if (first !== '-' && first !== '+') {
    return
  }

  if (first === '-') {
    if (!x) { x = 1 }
    x = -x
  }

  this._data.model = moment().add(x, 'days')

  this.onChange()
}

const modifiers = DPicker.modules.modifiers = {
  events: {
    inputChange: ModifierInputChange
  }
}
