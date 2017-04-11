module.exports = function(DPicker) {
  /**
  * Enables modifiers on `+[num]` and `-[num]` where:
  * - `+` gives the current date
  * - `+10` gives the current date + 10 days
  * - `-` gives the previous date
  * - `-10` gives the previous date - 10 days
  * @param {Event} DOMEvent
  * @listens DPicker#inputChange
  */
  DPicker.events.inputChange = DPicker.decorate(DPicker.events.inputChange, function ModifierInputChange (evt) {
    let first = evt.target.value.charAt(0)
    let x = evt.target.value.slice(1) || 0

    if (first !== '-' && first !== '+') {
      return
    }

    if (first === '-') {
      if (!x) { x = 1 }
      x = -x
    }

    if (x < 0) {
      this.model = DPicker.dateAdapter.subDays(new Date(), -x)
    } else {
      this.model = DPicker.dateAdapter.addDays(new Date(), x)
    }

    this.onChange({modelChanged: true, name: 'inputChange', event: evt})
  })
}
