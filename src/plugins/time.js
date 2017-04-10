const html = require('bel')
const DPicker = require('../dpicker.js')

const MINUTES = new Array(60).fill(0).map((e, i) => i)
const HOURS24 = new Array(24).fill(0).map((e, i) => i)
const HOURS12 = new Array(12).fill(0).map((e, i) => i === 0 ? 12 : i)
HOURS12.push(HOURS12.shift())
const MERIDIEM_TOKENS = ['AM', 'PM']

/**
 * Get hours and minutes according to the given _data (meridiem, min/max consideration)
 * @param {Object} data
 * @private
 * @return {Object} `{hours, minutes}` both arrays of numbers
 */
function getHoursMinutes (data) {
  let hours = data.meridiem ? HOURS12 : HOURS24
  let minutes = MINUTES.filter(e => e % data.step === 0)

  ;[data.min, data.max].map((e, i) => {
    if (DPicker._dateAdapter.isSameDay(data.model, e)) {
      let xHours = DPicker._dateAdapter.getHours(e)

      if (data.meridiem === true) {
        if (xHours > 12) {
          xHours = xHours - 12
        } else if (xHours === 0) {
          xHours = 12
        }
      }

      hours = hours.filter(e => i === 0 ? e >= xHours : e <= xHours)

      if (DPicker._dateAdapter.isSameHours(data.model, e)) {
        let xMinutes = DPicker._dateAdapter.getMinutes(e)
        minutes = minutes.filter(e => i === 0 ? e >= xMinutes : e <= xHours)
      }
    }
  })

  return {hours, minutes}
}

/**
 * Pad left for minutes \o/
 * @param {Number} v
 * @private
 * @return {String}
 */
function padLeftZero (v) {
  return v < 10 ? '0' + v : '' + v
}

/**
 * Handles minutes steps to focus on the correct input and set the model minutes/hours
 * @private
 */
function minutesStep () {
  if (!this._data.time) {
    return
  }

  let {minutes} = getHoursMinutes(this._data)

  let modelMinutes = DPicker._dateAdapter.getMinutes(this._data.model)

  // should fix min hour if minutes exceed the last step available (see test)
  if (minutes.length === 0) {
    this._data.min = DPicker._dateAdapter.setMinutes(DPicker._dateAdapter.addHours(this._data.min, 1), 0)
    minutes = getHoursMinutes(this._data).minutes
  }

  if (DPicker._dateAdapter.getMinutes(this._data.model) < minutes[0]) {
    this._data.model = DPicker._dateAdapter.setMinutes(this._data.model, minutes[0])
    modelMinutes = minutes[0]
  }

  if (modelMinutes > minutes[minutes.length - 1]) {
    this._data.model = DPicker._dateAdapter.setMinutes(DPicker._dateAdapter.addHours(this._data.model, 1), 0)
    return
  }

  if (this._data.step <= 1) {
    return
  }

  minutes[minutes.length] = 60
  modelMinutes = minutes.reduce(function (prev, curr) {
    return (Math.abs(curr - modelMinutes) < Math.abs(prev - modelMinutes) ? curr : prev)
  })

  minutes.length--

  this._data.model = DPicker._dateAdapter.setMinutes(this._data.model, modelMinutes)
}

/**
 * Render Time
 * ```
 * select[name='dpicker-hour']
 * select[name='dpicker-minutes']
 * ```
 *
 * @fires DPicker#hoursChange
 * @fires DPicker#minutesChange
 * @fires DPicker#minuteHoursChange
 * @fires DPicker#meridiemChange
 * @return {Element} the rendered virtual dom hierarchy
 */
DPicker._renders.time = function renderTime (events, data) {
  if (!data.time) { return html`<span style="display: none;" class="dpicker-time"` }

  let modelHours = DPicker._dateAdapter.getHours(data.model)

  if (data.meridiem !== false) {
    modelHours = modelHours > 12 ? modelHours - 12 : modelHours
    modelHours = modelHours === 0 ? 12 : modelHours
  }

  let {hours, minutes} = getHoursMinutes(data)
  let modelMinutes = DPicker._dateAdapter.getMinutes(data.model)
  let selects = []
  let modelStringValue = `${modelHours}:${modelMinutes}`

  if (data.concatHoursAndMinutes) {
    selects.push(
      html`<select onchange="${events.minuteHoursChange}" name="dpicker-time" aria-label="time">
        ${
          [].concat.apply([], minutes.map(minute => {
            return hours.map(hour => `${hour}:${minute}`)
          }))
          .sort((a, b) => {
            a = a.split(':').map(parseFloat)
            b = b.split(':').map(parseFloat)

            if (a[0] < b[0]) {
              return -1
            }

            if (a[0] > b[0]) {
              return 1
            }

            if (a[1] < b[1]) {
              return -1
            }

            if (a[1] > b[1]) {
              return 1
            }

            return 0
          })
          .map((value) => {
            const text = value.split(':').map(padLeftZero).join(':')
            return this._setSelected(html`<option value="${value}">${text}</option>`, value === modelStringValue)
          })
        }
      </select>`
    )
  } else {
    selects.push(
      html`<select onchange="${events.hoursChange}" name="dpicker-hours" aria-label="Hours">${
        hours.map((e, i) => {
          return this._setSelected(html`<option value="${e}">${padLeftZero(e)}</option>`, e === modelHours)
        })
      }</select>`,
      html`<select onchange="${events.minutesChange}" name="dpicker-minutes" aria-label="Minutes">${
        minutes.map((e, i) => {
          return this._setSelected(html`<option value="${e}">${padLeftZero(e)}</option>`, e === modelMinutes)
        })
      }</select>`
    )
  }

  if (data.meridiem !== false) {
    let modelMeridiem = DPicker._dateAdapter.getMeridiem(data.model)
    selects.push(html`<select onchange="${events.meridiemChange}" name="dpicker-meridiem">
      ${MERIDIEM_TOKENS.map(e => {
        return this._setSelected(html`<option value="${e}">${e}</option>`, modelMeridiem === e)
      })}
    </select>`)
  }

  return html`<span class="dpicker-time">${selects}</span>`
}

/**
  * On hours change
  * @event DPicker#hoursChange
  */
DPicker._events.hoursChange = function hoursChange (evt) {
  this._data.empty = false

  let val = parseInt(evt.target.options[evt.target.selectedIndex].value, 10)

  if (this._data.meridiem !== false) {
    if (DPicker._dateAdapter.getMeridiem(this._data.model) === MERIDIEM_TOKENS[1] /** PM **/) {
      val = val === 12 ? 12 : val + 12
    } else if (val === 12) {
      val = 0
    }
  }

  this.model = DPicker._dateAdapter.setHours(this._data.model, val)
  if (evt.redraw === false) {
    this.redraw()
  }
  this.onChange({modelChanged: true, name: 'hoursChange', event: evt})
}

/**
  * On minutes change
  * @event DPicker#minutesChange
  */
DPicker._events.minutesChange = function minutesChange (evt) {
  this._data.empty = false
  this.model = DPicker._dateAdapter.setMinutes(this._data.model, evt.target.options[evt.target.selectedIndex].value)
  if (evt.redraw === false) {
    this.redraw()
  }
  this.onChange({modelChanged: true, name: 'minutesChange', event: evt})
}

/**
  * On minutes hours change when concatHoursAndMinutes is `true`
  * @event DPicker#minuteHoursChange
  */
DPicker._events.minuteHoursChange = function minuteHoursChange (evt) {
  let val = evt.target.options[evt.target.selectedIndex].value.split(':')

  // whoops, hacked myself
  this._events.hoursChange({target: {options: [{value: val[0]}], selectedIndex: 0}, redraw: false})
  this._events.minutesChange({target: {options: [{value: val[1]}], selectedIndex: 0}, redraw: false})
  this.redraw()
}

/**
  * On meridiem change
  * @event DPicker#meridiemChange
  */
DPicker._events.meridiemChange = function meridiemChange (evt) {
  this._data.empty = false
  let val = evt.target.options[evt.target.selectedIndex].value
  let hours = DPicker._dateAdapter.getHours(this._data.model)

  if (val === MERIDIEM_TOKENS[0] /** AM **/) {
    hours = hours === 12 ? 0 : hours - 12
  } else {
    hours = hours === 12 ? 12 : hours + 12
  }

  this.model = DPicker._dateAdapter.setHours(this._data.model, hours)
  this.redraw()
  this.onChange({modelChanged: true, name: 'meridiemChange', event: evt})
}

/**
 * @ignore
 */
DPicker._events.inputChange = DPicker.decorate(DPicker._events.inputChange, function timeInputChange () {
  minutesStep.apply(this)
})

/**
 * @ignore
 */
DPicker.prototype.initialize = DPicker.decorate(DPicker.prototype.initialize, function timeInitialize () {
  minutesStep.apply(this)
})

/**
 * @ignore
 */
DPicker.prototype.redraw = DPicker.decorate(DPicker.prototype.redraw, function timeRedraw () {
  minutesStep.apply(this)
})

/**
 * @property {Boolean} [time=false] If `type="datetime"` attribute is defined, evaluates to `true`
 */
DPicker._properties.time = function getTimeAttribute (attributes) {
  return attributes.type === 'datetime'
}

/**
 * @property {Boolean} [step=1] Takes the value of the attribute `step` or `1`
 */
DPicker._properties.step = function getStepAttribute (attributes) {
  return attributes.step ? parseInt(attributes.step, 10) : 1
}

/**
 * @property {Boolean} [meridiem=false]
 */
DPicker._properties.meridiem = false

/**
 * @property {Boolean} [concatHoursAndMinutes=false]
 */
DPicker._properties.concatHoursAndMinutes = false


/**
 * ## Time
 *
 * Adds the following options/attributes/getters/setters:
 *
 * - `{boolean} [options.time=false]` Wether to add time or not, defaults to `true` if input type is `datetime`
 * - `{boolean} [options.meridiem=false]` 12 vs 24 time format where 24 is the default, this can be set through the `meridiem` attribute
 * - `{Number} [options.step=1]` Minutes step
 *
 **/
module.exports = DPicker
