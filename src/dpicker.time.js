if (!DPicker) {
  throw new ReferenceError('DPicker is required for this extension to work')
}

const html = require('bel')

/**
 * @module DPicker.modules.time
 * @description
 * Adds the following options/attributes/getters/setters:
 *
 * - `{boolean} [options.time=false]` Wether to add time or not, defaults to `true` if input type is `datetime`
 * - `{boolean} [options.meridiem=false]` 12 vs 24 time format where 24 is the default, this can be set through the `meridiem` attribute
 * - `{Number} [options.step=1]` Minutes step
 **/

const MINUTES = new Array(60).fill(0).map((e, i) => i)
const HOURS24 = new Array(24).fill(0).map((e, i) => i)
const HOURS12 = new Array(12).fill(0).map((e, i) => i === 0 ? 12 : i)
HOURS12.push(HOURS12.shift())

/**
 * Get hours and minutes according to the given _data (meridiem, min/max consideration)
 * @param {Object} data
 * @return {hours, minutes}
 */
function getHoursMinutes (data) {
  let hours = data.meridiem ? HOURS12 : HOURS24
  let minutes = MINUTES.filter(e => e % data.step === 0)

  ;[data.min, data.max].map((e, i) => {
    if (data.model.isSame(e, 'day')) {
      let xHours = +data.meridiem ? e.format('h') : e.hours()
      hours = hours.filter(e => i === 0 ? e >= xHours : e <= xHours)

      if (data.model.isSame(e, 'hours')) {
        let xMinutes = e.minutes()
        minutes = minutes.filter(e => i === 0 ? e >= xMinutes : e <= xHours)
      }
    }
  })

  return {hours, minutes}
}

/**
 * Pad left for minutes \o/
 * @param {Number} v
 */
function padLeftZero (v) {
  return v < 10 ? '0' + v : '' + v
}

/**
 * Handles minutes steps to focus on the correct input and set the model minutes/hours
 */
function minutesStep () {
  if (!this._data.time) {
    return
  }

  let {minutes} = getHoursMinutes(this._data)

  let modelMinutes = this._data.model.minutes()

  if (minutes.length === 0) {
    this._data.min.minutes(0)
    this._data.min.add(1, 'hours')
    minutes = getHoursMinutes(this._data).minutes
  }

  if (this._data.model.minutes() < minutes[0]) {
    this._data.model.minutes(minutes[0])
    modelMinutes = minutes[0]
  }

  if (modelMinutes > minutes[minutes.length - 1]) {
    this._data.model.minutes(0)
    this._data.model.add(1, 'hours')
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

  this._data.model.minutes(modelMinutes)
}

/**
 * Render Time
 * ```
 * select[name='dpicker-hour']
 * select[name='dpicker-minutes']
 * ```
 * @method
 * @listens DPicker#hoursChange
 * @listens DPicker#minutesChange
 * @return {H} the rendered virtual dom hierarchy
 */
const renderTime = function renderTime (events, data, toRender) {
  if (!data.time) { return html`<span style="display: none;" class="dpicker-time"` }

  let modelHours = data.model.hours()
  if (data.meridiem) {
    modelHours = modelHours > 12 ? modelHours - 12 : modelHours
    modelHours = modelHours === 0 ? 12 : modelHours
  }

  let {hours, minutes} = getHoursMinutes(data)
  let modelMinutes = data.model.minutes()
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
            if (value === modelStringValue) {
              return html`<option selected="selected" value="${value}">${text}</option>`
            } else {
              return html`<option value="${value}">${text}</option>`
            }
          })
        }
      </select>`
    )
  } else {
    selects.push(
      html`<select onchange="${events.hoursChange}" name="dpicker-hours" aria-label="Hours">${
        hours.map((e, i) => {
          return html`<option selected="${e === modelHours ? 'selected' : null}" value="${e}">${padLeftZero(e)}</option>`
        })
      }</select>`,
      html`<select onchange="${events.minutesChange}" name="dpicker-minutes" aria-label="Minutes">${
        minutes.map((e, i) => {
          return html`<option selected="${e === modelMinutes ? 'selected' : null}" value="${e}">${padLeftZero(e)}</option>`
        })
      }</select>`
    )
  }

  if (data.meridiem) {
    let modelMeridiem = data.model.format('A')
    selects.push(html`<select onchange="${events.meridiemChange}" name="dpicker-meridiem">
      ${['AM', 'PM'].map(e => {
        if (modelMeridiem === e) {
          return html`<option value="${e}" selected="selected">${e}</option>`
        } else {
          return html`<option value="${e}">${e}</option>`
        }
      })}
    </select>`)
  }

  return html`<span class="dpicker-time">${selects}</span>`
}

const events = {
  /**
    * On hours change
    * @Event DPicker#hoursChange
    * @param {Event} DOMEvent
    */
  hoursChange: function hoursChange (evt) {
    this._data.empty = false

    let val = parseInt(evt.target.options[evt.target.selectedIndex].value, 10)
    if (this._data.meridiem) {
      if (this._data.model.format('A') === 'PM') {
        val = val === 12 ? 12 : val + 12
      } else if (val === 12) {
        val = 0
      }
    }

    this._data.model.hours(val)
    this.redraw()
    this.onChange()
  },

  /**
    * On minutes change
    * @Event DPicker#minutesChange
    * @param {Event} DOMEvent
    */
  minutesChange: function minutesChange (evt) {
    this._data.empty = false
    this._data.model.minutes(evt.target.options[evt.target.selectedIndex].value)
    this.redraw()
    this.onChange()
  },

  minuteHoursChange: function minuteHoursChange (evt) {
    let val = evt.target.options[evt.target.selectedIndex].value.split(':')

    this._events.hoursChange({target: {options: [{value: val[0]}], selectedIndex: 0}})
    this._events.minutesChange({target: {options: [{value: val[1]}], selectedIndex: 0}})
  },

  /**
    * On meridiem change
    * @Event DPicker#meridiemChange
    * @param {Event} DOMEvent
    */
  meridiemChange: function meridiemChange (evt) {
    this._data.empty = false
    let val = evt.target.options[evt.target.selectedIndex].value
    let hours = this._data.model.hours()

    if (val === 'AM') {
      hours = hours === 12 ? 0 : hours - 12
    } else {
      hours = hours === 12 ? 12 : hours + 12
    }

    this._data.model.hours(hours)
    this.redraw()
    this.onChange()
  },

  /**
   * @inheritdoc
   */
  inputChange: function timeInputChange () {
    minutesStep.apply(this)
  }
}

DPicker.modules.time = {
  events: events,
  render: {
    time: renderTime
  },
  /*
   * @alias DPicker
   */
  properties: {
    /**
     * @var {Boolean} DPicker#time
     * @description Get/Set time wether to add time (only when time included)
     */
    time: {
      default: false,
      attribute: function (attributes) {
        return attributes.type === 'datetime' ? true : undefined
      }
    },
    /**
     * @var {Boolean} DPicker#meridiem
     * @description Get/Set meridiem (12 vs 24 hours format) (only when time included)
     */
    meridiem: { default: false, attribute: 'meridiem' },
    /**
     * @var {Number} DPicker#step
     * @description Get/Set minutes step (only when time included)
     */
    step: {
      default: 1,
      attribute: (attributes) => {
        return attributes.step ? parseInt(attributes.step, 10) : undefined
      }
    },

    concatHoursAndMinutes: { default: false }
  },
  calls: {
    /**
     * @inheritdoc
     */
    initialize: function timeParseInputAttributes (attributes) {
      minutesStep.apply(this)
    },

    /**
     * @inheritdoc
     */
    redraw: function timeRedraw () {
      minutesStep.apply(this)
    }
  }
}
