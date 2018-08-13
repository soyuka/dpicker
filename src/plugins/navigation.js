const html = require('nanohtml')

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
  DPicker.renders.previousMonth = function renderPreviousMonth (events, data) {
    const previous = DPicker.dateAdapter.subMonths(data.model, 1)
    return html`<button onclick="${events.previousMonth}" class="dpicker-previous-month ${!DPicker.dateAdapter.isSameMonth(previous, data.min) && DPicker.dateAdapter.isBefore(previous, data.min) ? 'dpicker-invisible' : ''}"></button>`
  }

  /**
  * Renders next month arrow
  * @param {DPicker.events} events
  * @param {DPicker.data} data
  * @param {Array} toRender
  * @fires DPicker#nextMonth
  *
  * @return {Element}
  */
  DPicker.renders.nextMonth = function renderNextMonth (events, data) {
    const next = DPicker.dateAdapter.addMonths(data.model, 1)
    return html`<button onclick="${events.nextMonth}" class="dpicker-next-month ${!DPicker.dateAdapter.isSameMonth(next, data.max) && DPicker.dateAdapter.isAfter(next, data.max) ? 'dpicker-invisible' : ''}"></button>`
  }

  /**
  * Previous month
  * @event Dpicker#previousMonth
  */
  DPicker.events.previousMonth = function previousMonth (evt) {
    this.model = DPicker.dateAdapter.subMonths(this.data.model, 1)
    this.redraw()
    this.onChange({modelChanged: true, name: 'previousMonth', event: evt})
  }

  /**
  * Next month
  * @event Dpicker#nextMonth
  */
  DPicker.events.nextMonth = function nextMonth (evt) {
    this.model = DPicker.dateAdapter.addMonths(this.data.model, 1)
    this.redraw()
    this.onChange({modelChanged: true, name: 'nextMonth', event: evt})
  }
}
