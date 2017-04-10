const DPicker = require('../dpicker.moment.js')
const html = require('bel')

/**
 * Renders previous month arrow
 * @param {DPicker._events} events
 * @param {DPicker._data} data
 * @param {Array} toRender
 * @fires DPicker#previousMonth
 *
 * @return {Element}
 */
DPicker._renders.previousMonth = function renderPreviousMonth(events, data) {
  const previous = DPicker._dateAdapter.subMonths(data.model, 1)
  return html`<button onclick="${events.previousMonth}" class="dpicker-previous-month ${!DPicker._dateAdapter.isSameMonth(previous, data.min) && DPicker._dateAdapter.isBefore(previous, data.min) ? 'dpicker-invisible' : ''}"></button>`
}

/**
 * Renders next month arrow
 * @param {DPicker._events} events
 * @param {DPicker._data} data
 * @param {Array} toRender
 * @fires DPicker#nextMonth
 *
 * @return {Element}
 */
DPicker._renders.nextMonth = function renderNextMonth(events, data) {
  const next = DPicker._dateAdapter.addMonths(data.model, 1)
  return html`<button onclick="${events.nextMonth}" class="dpicker-next-month ${!DPicker._dateAdapter.isSameMonth(next, data.max) && DPicker._dateAdapter.isAfter(next, data.max) ? 'dpicker-invisible' : ''}"></button>`
}

/**
 * Previous month
 * @event Dpicker#previousMonth
 */
DPicker._events.previousMonth = function previousMonth(evt) {
  this.model = DPicker._dateAdapter.subMonths(this._data.model, 1)
  this.redraw()
  this.onChange({modelChanged: true, name: 'previousMonth', event: evt})
}

/**
 * Next month
 * @event Dpicker#nextMonth
 */
DPicker._events.nextMonth = function nextMonth(evt) {
  this.model = DPicker._dateAdapter.addMonths(this._data.model, 1)
  this.redraw()
  this.onChange({modelChanged: true, name: 'nextMonth', event: evt})
}
