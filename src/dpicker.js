'use strict'
const h = maquette.h

function noop() {}

/**
 * This is usefull to keep data inside the instance, without the need to
 * changing event function (see rule #1 of maquette.js http://maquettejs.org/docs/rules.html).
 * Injector shortcut to avoid doing this on every function...
 */
function injector(fn) {
  return function(events, data, toRender) {
    return function() {
      return fn(events, data, toRender)
    }
  }
}

/**
 * uuid generator
 * https://gist.github.com/jed/982883
 */
function uuid() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,a=>(a^Math.random()*16>>a/4).toString(16))
}

/**
 * isElementInContainer tests if an element is inside a given id
 * @param {Element} parent a DOM node
 * @param {String} containerId the container id
 */
function isElementInContainer(parent, containerId) {
  while (parent && parent !== document) {
    if (parent.getAttribute('id') === containerId) {
      return true
    }

    parent = parent.parentNode
  }

  return false
}

const MINUTES = new Array(60).fill(0).map((e, i) => i)
const HOURS24 = new Array(24).fill(0).map((e, i) => i)
const HOURS12 = new Array(12).fill(0).map((e, i) => i === 0 ? 12 : i)

/**
 * *DPicker a simple date picker*
 *
 * Every property is available through the `DPicker` instance and can be changed through the object lifecycle.
 *
 * Here is how to change the format for example:
 *
 * ```javascript
 * let dpicker = new DPicker(document.body);
 * // ... do things
 * dpicker.format = 'YYYY' //change the format
 * ```
 *
 * If you change locale moment, changes will automatically be taken into consideration. For example, set `moment.locale('fr')` to use french months.
 *
 * <a href="/dpicker/demo/index.html">Full demo here</a>
 * Some alternate stylesheets are available <a href="/dpicker/demo/styles.html">here</a>
 *
 * <h2 id="demo">Demo</h2>
 *
 * <script type="text/javascript">
 *    var style = document.createElement('style')
 *    style.type = 'text/css'
 *    style.rel = 'stylesheet'
 *    style.innerHTML = "td.dpicker-inactive{color: grey;}button.dpicker-active {background: coral;}.dpicker-invisible{display: none;}.dpicker-visible{display: block;}"
 *    document.head.appendChild(style)
 *  </script>
 *  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.13.0/moment.min.js"></script>
 *  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/maquette/2.1.6/maquette.min.js"></script>
 *  <script type="text/javascript" src="/dpicker/dist/dpicker.js"></script>
 *  <script type="text/javascript" src="/dpicker/dist/dpicker.arrow-navigation.js"></script>
 *  <script type="text/javascript" src="/dpicker/dist/dpicker.modifiers.js"></script>
 *  <div id="my-datepicker"></div>
 *  <script>
 *  var dp = new DPicker(document.getElementById('my-datepicker'))
 *  </script>
 *
 * Demo code:
 * ```html
 *  <div id="my-datepicker"></div>
 *  <script>
 *  var dp = new DPicker(document.getElementById('my-datepicker'))
 *  </script>
 * ```
 *
 * <hr/>
 *
 * @class
 * @param {Element} element DOM element where you want the date picker or an input
 * @param {Object} [options={}]
 * @param {Moment} [options.model=moment()] Your own model instance, defaults to moment() (can be set by the `value` attribute on an input, transformed to moment according to the given format)
 * @param {Moment} [options.min=1986-01-01] The minimum date (can be set by the `min` attribute on an input)
 * @param {Moment} [options.max=today+1 year] The maximum date (can be set by the `max` attribute on an input)
 * @param {string} [options.format='DD/MM/YYYY'] The input format, a moment format (can be set by the `format` attribute on an input)
 * @param {string} [options.months=moment.months()] Months array, see also moment.monthsShort()
 * @param {string} [options.days=moment.weekdaysShort()] Days array, see also moment.weekdaysMin()
 * @param {boolean} [options.display=true]
 * @param {boolean} [options.hideOnDayClick=true] Hides the date picker on day click
 * @param {boolean} [options.hideOnDayEnter=true] Hides the date picker when Enter or Escape is hit
 * @param {Function} [options.onChange] A function to call whenever the data gets updated
 * @param {Function} [options.modifier] A function that can modify the data when a model change occurs
 * @param {boolean} [options.time=false] Wether to add time or not, true if input type is `datetime`
 * @param {boolean} [options.meridiem=false] 12 vs 24 time format where 24 is the default, this can be set through the `time-format` attribute (eg: 12 or 24)
 * @param {Number} [options.step=1] Minutes step
 * @param {string} [options.inputId=uuid|element.getAttribute('id')] The input id, useful to add you own label (can only be set in the initiation phase) If element is an inputand it has an `id` attribute it'll be overriden by it
 * @param {string} [options.inputName='dpicker-input'] The input name. If element is an inputand it has a `name` attribute it'll be overriden by it
 * @listens DPicker#hide
 */
function DPicker(element, options = {}) {

  if (!(this instanceof DPicker)) {
    return new DPicker(element, options)
  }

  this._container = uuid()

  const now = options.model || moment()

  this._data = {
    model: now.clone(),
    format: options.format || 'DD/MM/YYYY',
    display: options.display !== undefined ? options.display : false,
    hideOnDayClick: options.hideOnDayClick !== undefined ? options.hideOnDayClick : true,
    hideOnEnter: options.hideOnEnter !== undefined ? options.hideOnEnter : true,
    min: options.min instanceof moment ? options.min.clone() : moment('1986-01-01'),
    max: options.max instanceof moment ? options.max.clone() : moment().add(1, 'year').month(11),
    months: options.months || moment.months(),
    days: options.days || moment.weekdaysShort(),
    inputId: options.inputId || uuid(),
    inputName: options.name || 'dpicker-input',
    empty: options.model !== undefined && !options.model ? true : false,
    time: options.time !== undefined ? options.time : false,
    meridiem: options.meridiem !== undefined ? options.meridiem : false,
    step: options.step !== undefined ? parseInt(options.step, 10) : 1,
    valid: true
  }

  this.onChange = options.onChange
  this.modifier = options.modifier
  this._projector = maquette.createProjector()

  this._events = this._loadEvents()

  this._loadModules()

  document.addEventListener('click', this._events.hide)

  let render = this.render(this._events, this._data, [
    this.renderYears(this._events, this._data),
    this.renderMonths(this._events, this._data),
    this.renderTime(this._events, this._data),
    this.renderDays(this._events, this._data)
  ])

  let elementContainer
  let renderContainer

  if (element.tagName === 'INPUT') {
    if (!element.parentNode) {
      throw new ReferenceError('Can not init DPicker on an input without parent node')
    }

    this._data.inputId = element.getAttribute('id') || this._data.inputId
    this._data.inputName = element.getAttribute('name') || this._data.inputName

    this._parseInputAttributes(element)

    this._projector.merge(element, this.renderInput(this._events, this._data))

    elementContainer = element.parentNode
    elementContainer.classList.add('dpicker')
    renderContainer = render
  } else {
    renderContainer = this.renderContainer(this._events, this._data, [
      this.renderInput(this._events, this._data),
      render
    ])

    elementContainer = element
  }

  this._projector.append(elementContainer, renderContainer)

  elementContainer.setAttribute('id', this._container)
  elementContainer.addEventListener('keydown', this._events.keyDown)

  return this
}

/**
 * Parse input attributes and fill dpicker data container on initialization
 * Parsed attributes are:
 * - type (date or datetime)
 * - format (moment format)
 * - min (min date, a string matching the given format)
 * - max (max date, a string matching the given format)
 * - value (model initial value, a string matching the given format)
 * - step (model initial value, a string matching the given format)
 * @param {Element} element - an input
 */
DPicker.prototype._parseInputAttributes = function(element) {
  let type = element.getAttribute('type')
  if (type === 'date' || type === 'datetime') {
    element.setAttribute('type', 'text')
  }

  if (type === 'datetime') {
    this._data.time = true
  }

  //bind input attributes to data
  ;['format', 'min', 'max', 'value', 'time-format', 'step'].map((e, i) => {
    let attr = element.getAttribute(e)

    if (typeof attr !== 'string') {
      return
    }

    if (!attr) {
      if (e === 'value' && attr.trim() === '') {
        this._data.empty = true
      }

      return
    }

    if (~['format', 'step'].indexOf(e)) {
      this._data[e] = attr
      return
    }

    if (e === 'time-format') {
      this._data.meridiem = attr.match(12) ? true : false
      return
    }

    let m = moment(attr, this._data.format, true)

    if (this.isValid(m)) {
      if (e === 'value') { e = 'model' }
      this._data[e] = m
    }
  })

  this._minutesStep()
}

DPicker.prototype._loadModules = function loadModules() {
  for(let module in DPicker.modules) {
    if (!DPicker.modules.hasOwnProperty(module)) {
      continue
    }

    for(let event in DPicker.modules[module]) {
      if (!DPicker.modules[module].hasOwnProperty(event)) {
        continue
      }

      let internal = event+'-internal'
      this._events[internal] = this._events[event]
      this._events[event] = (evt) => {
        if (this._events[internal]) {
          this._events[internal](evt)
        }

        DPicker.modules[module][event].bind(this)(evt)
      }
    }
  }
}

DPicker.prototype._loadEvents = function loadEvents() {
  return {
    /**
     * Hides the date picker if user does not click inside the container
     * @event DPicker#hide
     * @param {Event} DOMEvent
     */
    hide: (evt) => {
      if (this._data.display === false) {
        return
      }

      let node = evt.target

      if (isElementInContainer(node.parentNode, this._container)) {
        return
      }

      this._data.display = false
      this._projector.scheduleRender()
    },

    /**
     * Change model on input change
     * @event DPicker#inputChange
     * @param {Event} DOMEvent
     */
    inputChange: (evt) => {
      if (!evt.target.value) {
        this._data.empty = true
      } else {
        let newModel = moment(evt.target.value, this._data.format, true)

        if (this.isValid(newModel)) {
          this._data.model = newModel
        }

        this._data.empty = false
      }

      this._minutesStep()
      this.onChange()
    },

    /**
     * Hide on input blur
     * @event DPicker#inputBlur
     * @param {Event} DOMEvent
     */
    inputBlur: (evt) => {
      if (this._data.display === false) {
        return
      }

      let node = evt.relatedTarget || evt.target

      if (isElementInContainer(node.parentNode, this._container)) {
        return
      }

      this._data.display = false
    },

    /**
     * Show the container on input focus
     * @event DPicker#inputFocus
     * @param {Event} DOMEvent
     */
    inputFocus: (evt) => {
      this._data.display = true
      if (evt.target && evt.target.select) {
        evt.target.select()
      }
    },

    /**
     * On year change, update the model value
     * @event DPicker#yearChange
     * @param {Event} DOMEvent
     */
    yearChange: (evt) => {
      this._data.empty = false
      this._data.model.year(evt.target.options[evt.target.selectedIndex].value)
      this.onChange()
    },

    /**
     * On month change, update the model value
     * @event DPicker#monthChange
     * @param {Event} DOMEvent
     */
    monthChange: (evt) => {
      this._data.empty = false
      this._data.model.month(evt.target.options[evt.target.selectedIndex].value)
      this.onChange()
    },

    /**
     * On day click, update the model value
     * @Event DPicker#dayClick
     * @param {Event} DOMEvent
     */
    dayClick: (evt) => {
      evt.preventDefault()
      this._data.model.date(evt.target.value)
      this._data.empty = false
      this.onChange()

      if (this._data.hideOnDayClick) {
        this._data.display = false
      }
    },

    /**
     * On day key down - not implemented
     * @Event DPicker#dayKeyDown
     * @param {Event} DOMEvent
     */
    dayKeyDown: () => {},

    /**
     * On key down inside the dpicker container,
     * intercept enter and escape keys to hide the container
     * @Event DPicker#keyDown
     * @param {Event} DOMEvent
     */
    keyDown: (evt) => {
      if (!this._data.hideOnEnter) {
        return
      }

      let key = evt.which || evt.keyCode
      if (key !== 13 && key !== 27)
        return

      document.getElementById(this.inputId).blur()
      this._data.display = false
    },

    /**
     * On hours change
     * @Event DPicker#hoursChange
     * @param {Event} DOMEvent
     */
    hoursChange: (evt) => {
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
    minutesChange: (evt) => {
      this._data.empty = false
      this._data.model.minutes(evt.target.options[evt.target.selectedIndex].value)
      this.onChange()
    },

    /**
     * On meridiem change
     * @Event DPicker#meridiemChange
     * @param {Event} DOMEvent
     */
    meridiemChange: (evt) => {
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
    }
  }
}

DPicker.prototype.isValid = function isValid(model) {
  if (!(model instanceof moment)) {
    return false
  }

  if (!model.isValid()) {
    return false
  }

  if (model < this._data.min) {
    this._data.valid = false
    this._data.model = this._data.min.clone()
    return false
  }

  if (model > this._data.max) {
    this._data.valid = false
    this._data.model = this._data.max.clone()
    return false
  }

  this._data.valid = true

  return true
}

/**
 * Render input
 * @method
 * @listens DPicker#inputChange
 * @listens DPicker#inputBlur
 * @listens DPicker#inputFocus
 * @return {H} the rendered virtual dom hierarchy
 */
DPicker.prototype.renderInput = injector(function renderInput(events, data, toRender) {
  return h('input#'+data.inputId, {
    value: data.empty ? '' : data.model.format(data.format),
    type: 'text',
    min: data.min.format(data.format),
    max: data.max.format(data.format),
    format: data.format,
    onchange: events.inputChange,
    onblur: events.inputBlur,
    onfocus: events.inputFocus,
    name: data.inputName
  })
})

/**
 * Dpicker container if no input is provided
 * if an input is given, it's parentNode will be the container
 *
 * ```
 * div.dpicker
 * ```
 * @method
 * @return {H} the rendered virtual dom hierarchy
 */
DPicker.prototype.renderContainer = injector(function renderInput(events, data, toRender) {
  return h('div.dpicker', toRender.map(e => e()))
})

/**
 * Render a DPicker
 *
 * ```
 * div.dpicker#[uuid]
 *   input[type=text]
 *   div.dpicker-container.dpicker-[visible|invible]
 * ```
 * @method
 * @see DPicker#renderYears
 * @see DPicker#renderMonths
 * @see DPicker#renderDays
 * @return {H} the rendered virtual dom hierarchy
 */
DPicker.prototype.render = injector(function render(events, data, toRender) {
  return h('div.dpicker-container', {
    classes: {
      'dpicker-visible': data.display,
      'dpicker-invisible': !data.display
    }
  },
  toRender.map(e => e()))
})

/**
 * Render Years
 * ```
 * select[name='dpicker-year']
 * ```
 * @method
 * @listens DPicker#yearChange
 * @return {H} the rendered virtual dom hierarchy
 */
DPicker.prototype.renderYears = injector(function renderYears(events, data, toRender) {
  let modelYear = data.model.year()
  let futureYear = data.max.year() + 1
  let pastYear = data.min.year()
  let options = []

  while (--futureYear >= pastYear) {
    options.push(h('option', {
      value: futureYear,
      selected: futureYear === modelYear,
      key: futureYear
    }, ''+futureYear))
  }

  return h('select', {
    onchange: events.yearChange,
    name: 'dpicker-year'
  }, options)
})

/**
 * Render Months
 * ```
 * select[name='dpicker-month']
 * ```
 * @method
 * @listens DPicker#monthChange
 * @return {H} the rendered virtual dom hierarchy
 */
DPicker.prototype.renderMonths = injector(function renderMonths(events, data, toRender) {
  let modelMonth = data.model.month()
  let currentYear = data.model.year()
  let months = data.months
  let showMonths = data.months.map((e, i) => i)

  if (data.max.year() === currentYear) {
    let maxMonth = data.max.month()
    showMonths = showMonths.filter(e => e <= maxMonth)
  }

  if (data.min.year() === currentYear) {
    let minMonth = data.min.month()
    showMonths = showMonths.filter(e => e >= minMonth)
  }

  return h('select', {
      onchange: events.monthChange,
      name: 'dpicker-month'
    },
    showMonths
    .map((e, i) => h('option', {
      value: e,
      selected: e === modelMonth,
      key: e
    }, months[e]))
  )
})

/**
 * Render Time
 * ```
 * select[name='dpicker-hour']
 * select[name='dpicker-minutes']
 * ```
 * @method
 * @listens DPicker#hourChange
 * @listens DPicker#minutesChange
 * @return {H} the rendered virtual dom hierarchy
 */
DPicker.prototype.renderTime = injector(function renderTime(events, data, toRender) {
  if (!data.time) { return }

  let modelHours = data.model.hours()
  if (data.meridiem) {
    modelHours = modelHours > 12 ? modelHours - 12 : modelHours
  }

  let modelMinutes = data.model.minutes()

  let hours = data.meridiem ? HOURS12 : HOURS24
  let minutes = MINUTES.filter(e => e % data.step === 0)

  if(data.model.isSame(data.min, 'day')) {
    let minMinutes = data.min.minutes()
    minutes = minutes.filter(e => e >= minMinutes)
    let minHours = + data.meridiem ? data.min.format('h') : data.min.hours()
    hours = hours.filter(e => e >= minHours)
  }

  if(data.model.isSame(data.max, 'day')) {
    let maxMinutes = data.max.minutes()
    minutes = minutes.filter(e => e <= maxMinutes)
    let maxHours = + data.meridiem ? data.max.format('h') : data.max.hours()
    hours = hours.filter(e => e <= maxHours)
  }

  let selects = [
    h('select', {
      onchange: events.hoursChange,
      name: 'dpicker-hours'
    }, hours
      .map((e, i) => h('option', {
        value: e,
        selected: e === modelHours,
        key: e
      }, e < 10 ? '0'+e : e))
    ),
    h('select', {
      onchange: events.minutesChange,
      name: 'dpicker-minutes'
    },
      minutes
      .map(e => h('option', {
        value: e,
        selected: e === modelMinutes,
        key: e
      }, e < 10 ? '0'+e : ''+e))
    )
  ]

  if (data.meridiem) {
    let modelMeridiem = data.model.format('A')
    selects.push(h('select', {
      onchange: events.meridiemChange,
      name: 'dpicker-meridiem'
    }, ['AM', 'PM'].map(e => h('option', {value: e, selected: modelMeridiem === e}, e))
    ))
  }

  return h('span.dpicker-time', selects)
})

/**
 * Render Days
 * ```
 * table
 *  tr
 *    td
 *      button|span
 * ```
 * @method
 * @listens DPicker#dayClick
 * @listens DPicker#dayKeyDown
 * @return {H} the rendered virtual dom hierarchy
 */
DPicker.prototype.renderDays = injector(function renderDays(events, data, toRender) {
  let daysInMonth = data.model.daysInMonth()
  let daysInPreviousMonth = data.model.clone().subtract(1, 'months').daysInMonth()
  let firstDay = +(data.model.clone().date(1).format('e')) - 1
  let currentDay = data.model.date()

  let minDay
  let maxDay

  if(data.model.isSame(data.min, 'month')) {
    minDay = data.min.date()
  }

  if(data.model.isSame(data.max, 'month')) {
    maxDay = data.max.date()
  }

  let rows = new Array(Math.ceil(.1+(firstDay + daysInMonth) / 7)).fill(0)
  let day
  let dayActive
  let loopend = true

  return h('table', [
    //headers
    h('tr', data.days.map(e => h('th', e))),
    //rows
    rows.map((e, row) => {
      //weeks filed with days
      return h('tr', {key: row}, new Array(7).fill(0).map((e, col) => {
        dayActive = loopend

        if (col <= firstDay && row === 0) {
          day = daysInPreviousMonth - (firstDay - col)
          dayActive = false
        } else if (col === firstDay + 1 && row === 0) {
          day = 1
          dayActive = true
        } else {
          if (day === daysInMonth) {
            day = 0
            dayActive = false
            loopend = false
          }

          day++
        }

        if (dayActive === true) {
          dayActive = typeof minDay !== 'undefined' ? day >= minDay : dayActive
          dayActive = typeof maxDay !== 'undefined' ? day <= maxDay : dayActive
        }

        return h('td', {
          classes: {
            'dpicker-active': dayActive,
            'dpicker-inactive': !dayActive
          }
        }, [
          h(dayActive ? 'button' : 'span', {
            value: day,
            onclick: dayActive ? events.dayClick : noop,
            type: dayActive ? 'button' : null,
            onkeydown: dayActive ? events.dayKeyDown || noop : noop,
            classes: {'dpicker-active': currentDay === day}
          }, day)
        ])
      }))
    })
  ])
})


DPicker.prototype._minutesStep = function() {
  if (this._data.step <= 1) {
    return
  }

  let minutes = MINUTES.filter(e => e % this._data.step === 0)
  let modelMinutes = this._data.model.minutes()

  minutes[minutes.length] = 60
  modelMinutes = minutes.reduce(function (prev, curr) {
    return (Math.abs(curr - modelMinutes) < Math.abs(prev - modelMinutes) ? curr : prev)
  });
  minutes.length--

  this._data.model.minutes(modelMinutes)
}

Object.defineProperties(DPicker.prototype, {
  /**
   * @var {String} DPicker#container
   * @description Get container id
   */
  'container': {
    get: function() {
      return this._container
    }
  },
  /**
   * @var {String} DPicker#inputId
   * @description Get input id
   */
  'inputId': {
    get: function() {
      return this._data.inputId
    }
  },
  /**
   * @var {String} DPicker#input
   * @description Get current input value (not the model)
   */
  'input': {
    get: function() {
      if (this._data.empty) {
        return ''
      }

      return this._data.model.format(this._data.format)
    }
  },
  /**
   * @var {Function} DPicker#onChange
   * @description Set onChange method
   */
  'onChange': {
    set: function(onChange) {
      this._onChange = () => {
        if (this.modifier) {
          this.modifier()
        }

        return !onChange ? false : onChange(this._data)
      }
    },
    get: function() {
      return this._onChange
    }
  },
  /**
   * @var {Function} DPicker#modifier
   * @description Set modifier method
   */
  'modifier': {
    set: function(modifier) {
      if (!modifier) {
        this._modifier = null
        return
      }

      this._modifier = () => {
        modifier.bind(this)()
      }
    },
    get: function() {
      return this._modifier
    }
  },

  'valid': {
    get: function() {
      return this._data.valid
    }
  }
})

/**
 * @var {Moment} DPicker#model
 * @description Get/Set model, a Moment instance
 */
/**
 * @var {String} DPicker#format
 * @description Get/Set format, a Moment format string
 */
/**
 * @var {Boolean} DPicker#display
 * @description Get/Set display, hides or shows the date picker
 */
/**
 * @var {Moment} DPicker#min
 * @description Get/Set min date
 */
/**
 * @var {Moment} DPicker#max
 * @description Get/Set max date
 */
/**
 * @var {Array.<string>} DPicker#months
 * @description Get/Set months an array of strings representing months, defaults to moment.months()
 */
/**
 * @var {Array.<string>} DPicker#days
 * @description Get/Set days an array of strings representing days, defaults to moment.weekdaysShort()
 */
/**
 * @var {String} DPicker#inputName
 * @description Get/Set input name
 */
/**
 * @var {Boolean} DPicker#meridiem
 * @description Get/Set meridiem (12 vs 24 hours format)
 */
/**
 * @var {Boolean} DPicker#time
 * @description Get/Set time wether to add time
 */
/**
 * @var {Number} DPicker#step
 * @description Get/Set minutes step
 */
;['model', 'format', 'display', 'months', 'days', 'inputName', 'min', 'max', 'time', 'meridiem', 'step'].forEach(e => {
 Object.defineProperty(DPicker.prototype, e, {
    get: function() {
      return this._data[e]
    },
    set: function(newValue) {
      if (e === 'model') {
        this._data.empty = !newValue

        if (this.isValid(newValue)) {
          this._data.model = newValue
          this._minutesStep()
        }
      } else {
        this._data[e] = newValue
      }

      this._projector.scheduleRender()
    }
  })
})

/**
 * Add calls on events through modules.
 * You can hook on every supported events, DPicker event will be called before yours. For example:
 *
 * ```
 *  const myInputChange = DPicker.modules.myInputChange = {
 *    inputChange: function(evt) {
 *      //do something
 *      this.model = moment().add(1, 'days')
 *    }
 *  }
 * ```
 *
 * Here, on every inputChange call, the function will add 1 day to the previous input
 * @property {Object} modules
 */
DPicker.modules = {}
