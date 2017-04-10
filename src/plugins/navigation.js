const DPicker = require('../dpicker.js')

const html = require('bel')

const renderPreviousMonth = function renderPreviousMonth(events, data, toRender) {
  const previous = DPicker._dateAdapter.subMonths(data.model, 1)
  //@TODO not is same
  return html`<button onclick="${events.previousMonth}" class="dpicker-previous-month ${DPicker._dateAdapter.isBefore(previous, data.min) ? 'dpicker-invisible' : ''}"></button>`
}

const renderNextMonth = function renderNextMonth(events, data, toRender) {
  const next = DPicker._dateAdapter.addMonths(data.model, 1)
  //@TODO not is same
  return html`<button onclick="${events.nextMonth}" class="dpicker-next-month ${DPicker._dateAdapter.isAfter(next, data.max) ? 'dpicker-invisible' : ''}"></button>`
}

DPicker._renders.previousMonth = renderPreviousMonth
DPicker._renders.nextMonth = renderNextMonth

DPicker._events.previousMonth = function previousMonth(evt) {
  this.model = DPicker._dateAdapter.subMonths(this._data.model, 1)
  this.redraw()
  this.onChange({modelChanged: true, name: 'previousMonth', event: evt})
}

DPicker._events.nextMonth = function nextMonth(evt) {
  this.model = DPicker._dateAdapter.addMonths(this._data.model, 1)
  this.redraw()
  this.onChange({modelChanged: true, name: 'nextMonth', event: evt})
}
