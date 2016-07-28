'use strict'

if (!DPicker) {
  throw new ReferenceError('DPicker is required for this extension to work')
}

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
const renderTime = DPicker.injector(function renderTime(events, data, toRender) {
  if (!data.time) { return }

  let modelHours = data.model.hours()
  if (data.meridiem) {
    modelHours = modelHours > 12 ? modelHours - 12 : modelHours
    modelHours = modelHours === 0 ? 12 : modelHours
  }

  let modelMinutes = data.model.minutes()

  let hours = data.meridiem ? HOURS12 : HOURS24
  let minutes = MINUTES.filter(e => e % data.step === 0)

  ;[data.min, data.max].map((e, i) => {
    if(data.model.isSame(e, 'day')) {
      let xHours = + data.meridiem ? e.format('h') : e.hours()
      hours = hours.filter(e => i === 0 ? e >= xHours : e <= xHours)

      if (data.model.isSame(e, 'hours')) {
        let xMinutes = e.minutes()
        minutes = minutes.filter(e => i === 0 ? e >= xMinutes : e <= xHours)
      }
    }
  })

  let selects = [
    DPicker.h('select', {
      onchange: events.hoursChange,
      name: 'dpicker-hours',
      'aria-label': 'Hours'
    }, hours
      .map((e, i) => DPicker.h('option', {
        value: e,
        selected: e === modelHours,
        key: e
      }, e < 10 ? '0'+e : e))
    ),
    DPicker.h('select', {
      onchange: events.minutesChange,
      name: 'dpicker-minutes',
      'aria-label': 'Minutes'
    },
      minutes
      .map(e => DPicker.h('option', {
        value: e,
        selected: e === modelMinutes,
        key: e
      }, e < 10 ? '0'+e : ''+e))
    )
  ]

  if (data.meridiem) {
    let modelMeridiem = data.model.format('A')
    selects.push(DPicker.h('select', {
      onchange: events.meridiemChange,
      name: 'dpicker-meridiem'
    }, ['AM', 'PM'].map(e => DPicker.h('option', {value: e, selected: modelMeridiem === e}, e))
    ))
  }

  return DPicker.h('span.dpicker-time', selects)
})

const events = {
  /**
    * On hours change
    * @Event DPicker#hoursChange
    * @param {Event} DOMEvent
    */
  hoursChange: function hoursChange(evt) {
    this._data.empty = false

    let val = parseInt(evt.target.options[evt.target.selectedIndex].value, 10)
    if (this._data.meridiem && this._data.model.format('A') === 'PM') {
      val = val === 12 ? 12 : val + 12
    } else if(val === 12) {
      val = 0
    }

    this._data.model.hours(val)
    this.onChange()
  },

  /**
    * On minutes change
    * @Event DPicker#minutesChange
    * @param {Event} DOMEvent
    */
  minutesChange: function minutesChange(evt) {
    this._data.empty = false
    this._data.model.minutes(evt.target.options[evt.target.selectedIndex].value)
    this.onChange()
  },

  /**
    * On meridiem change
    * @Event DPicker#meridiemChange
    * @param {Event} DOMEvent
    */
  meridiemChange: function meridiemChange(evt) {
    this._data.empty = false
    let val = evt.target.options[evt.target.selectedIndex].value
    let hours = this._data.model.hours()

    if (val === 'AM') {
      hours = hours === 12 ? 0 : hours - 12
    } else {
      hours = hours === 12 ? 12 : hours + 12
    }

    this._data.model.hours(hours)
    this.onChange()
  },

  /**
   * @inheritdoc
   */
  inputChange: function() {
    this._minutesStep()
  }
}

const time = DPicker.modules.time = {
  events: events,
  render: [
    renderTime
  ],
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
      attribute: (attributes) => {
        let type = attributes.find(e => e.name === 'type')
        return !type ? false : type.value === 'datetime' ? true : false
      },
      getset: true
    },
    /**
     * @var {Boolean} DPicker#meridiem
     * @description Get/Set meridiem (12 vs 24 hours format) (only when time included)
     */
    meridiem: { default: false, attribute: 'meridiem', getset: true },
    /**
     * @var {Number} DPicker#step
     * @description Get/Set minutes step (only when time included)
     */
    step: {
      default: 1,
      attribute: (attributes) => {
        let step = attributes.find(e => e.name === 'step')
        return !step ? 1 : parseInt(step.value, 10)
      },
      getset: true
    }
  },
  calls: {
    /**
     * @inheritdoc
     */
    _initialize: function timeParseInputAttributes(attributes) {
      this._minutesStep()
    },
    /**
     * @inheritdoc
     */
    _modelSetter: function timeModelSetter(newValue) {
      this._minutesStep()
      this._projector.scheduleRender()
    }
  }
}

/**
 * Handles minutes steps to focus on the correct input and set the model minutes/hours
 * @alias DPicker.prototype._minutesStep
 */
DPicker.prototype._minutesStep = function() {
  if (!this._data.time || this._data.step <= 1) {
    return
  }

  let minutes = MINUTES.filter(e => e % this._data.step === 0)
  let modelMinutes = this._data.model.minutes()

  if (modelMinutes > minutes[minutes.length - 1]) {
    this._data.model.minutes(0)
    this._data.model.add(1, 'hours')
    return
  }

  minutes[minutes.length] = 60
  modelMinutes = minutes.reduce(function (prev, curr) {
    return (Math.abs(curr - modelMinutes) < Math.abs(prev - modelMinutes) ? curr : prev)
  })
  minutes.length--

  this._data.model.minutes(modelMinutes)
}
