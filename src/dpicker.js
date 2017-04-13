const nanomorph = require('nanomorph')
const html = require('bel')

/**
 * DPicker
 *
 * @param {Element} element DOM element where you want the date picker or an input
 * @param {Object} [options={}]
 * @param {Date} [options.model=new Date()] Your own model instance, defaults to `new Date()` (can be set by the `value` attribute on an input, transformed to moment according to the given format)
 * @param {Date} [options.min=1986-01-01] The minimum date (can be set by the `min` attribute on an input)
 * @param {Date} [options.max=today+1 year] The maximum date (can be set by the `max` attribute on an input)
 * @param {String} [options.format='DD/MM/YYYY'] The input format, a moment format (can be set by the `format` attribute on an input)
 * @param {String} [options.months=adapter.months()] Months array, see also [adapter.months()](todo)
 * @param {String} [options.days=adapter.weekdaysShort()] Days array, see also [adapter.weekdays()](todo)
 * @param {Boolean} [options.display=true]
 * @param {Boolean} [options.hideOnDayClick=true] Hides the date picker on day click
 * @param {Boolean} [options.hideOnDayEnter=true] Hides the date picker when Enter or Escape is hit
 * @param {Boolean} [options.siblingMonthDayClick=false] Enable sibling months day click
 * @param {Function} [options.onChange] A function to call whenever the data gets updated
 * @param {String} [options.inputId=uuid()] The input id, useful to add you own label (can only be set in the initiation phase) If element is an inputand it has an `id` attribute it'll be overriden by it
 * @param {String} [options.inputName='dpicker-input'] The input name. If element is an inputand it has a `name` attribute it'll be overriden by it
 * @param {Array} [options.order] The dom elements appending order.
 * @param {Boolean} [options.time=false] Enable time (must include the time module)
 * @param {Boolean} [options.meridiem=false] 12/24 hour format, default 24
 * @param {Number} [options.step=1] Minutes step
 * @param {Boolean} [options.concatHoursAndMinutes=false] Use only one select box for both hours and minutes
 * @param {Boolean} [options.empty=false] Use this so force DPicker with an empty input instead of setting it to the formatted current date
 *
 * @property {String} container Get container id
 * @property {String} inputId Get input id
 * @property {String} input Get current input value (formatted date)
 * @property {Function} onChange Set onChange method
 * @property {Boolean} valid Is the current input valid
 * @property {Boolean} empty Is the input empty
 * @property {Date} model Get/Set model, a Date instance
 * @property {String} format Get/Set format, a Date format string
 * @property {Boolean} display Get/Set display, hides or shows the date picker
 * @property {Date} min  Get/Set min date
 * @property {Date} max Get/Set max date

 * @fires DPicker#hide
 */
function DPicker (element, options = {}) {
  if (!(this instanceof DPicker)) {
    return new DPicker(element, options)
  }

  const {container, attributes} = this._getContainer(element)

  this._container = uuid()
  this.data = {}

  const defaults = {
    months: DPicker.dateAdapter.months(),
    days: DPicker.dateAdapter.weekdays(),
    empty: false,
    valid: true,
    order: ['months', 'years', 'time', 'days'],
    hideOnDayClick: true,
    hideOnEnter: true,
    hideOnOutsideClick: true,
    siblingMonthDayClick: false,
    firstDayOfWeek: DPicker.dateAdapter.firstDayOfWeek()
  }

  for (let i in defaults) {
    if (options[i] !== undefined) {
      this.data[i] = options[i]
      continue
    }

    this.data[i] = defaults[i]
  }

  this.data.inputName = attributes.name ? attributes.name : options.inputName ? options.inputName : 'dpicker-input'
  this.data.inputId = attributes.id ? attributes.id : options.inputId ? options.inputId : uuid()

  this._setData('format', [attributes.format, 'DD/MM/YYYY'])

  this.events = {}
  for (let i in DPicker.events) {
    this.events[i] = DPicker.events[i].bind(this)
  }

  const methods = DPicker.properties

  methods.min = new Date(1986, 0, 1)
  methods.max = DPicker.dateAdapter.setMonth(DPicker.dateAdapter.addYears(new Date(), 1), 11)
  methods.format = this.data.format

  for (let i in methods) {
    this._createGetSet(i)
    if (typeof methods[i] === 'function') {
      this._setData(i, [options[i], methods[i](attributes)])
    } else {
      this._setData(i, [options[i], attributes[i], methods[i]], methods[i] instanceof Date)
    }
  }

  if (options.empty === true) {
    this.data.empty = true
  }

  this._setData('model', [attributes.value, options.model, new Date()], true)

  this.onChange = options.onChange

  document.addEventListener('click', this.events.hide)

  document.addEventListener('touchend', (e) => {
    this.events.inputBlur(e)
  })

  this.initialize()

  this._mount(container)
  this.isValid(this.data.model)

  container.id = this._container
  container.addEventListener('keydown', this.events.keyDown)

  let input = container.querySelector('input')
  input.addEventListener('blur', this.events.inputBlur)

  return this
}

/**
 * Helper to set the `selected` attribute on `<option>` tags
 * @link https://github.com/yoshuawuyts/nanomorph/pull/54
 * @param {Element} element
 * @param {boolean} test set selected when true
 * @private
 * @return {Element}
 */
DPicker.prototype.setSelected = function (element, test) {
  if (test === true) {
    element.setAttribute('selected', 'selected')
  }

  return element
}

/**
 * _setData is a helper to set this.data values
 * @param {String} key
 * @param {Array} values the first value that is not undefined will be set in this.data[key]
 * @param {Boolean} isDate whether this value should be a date instance
 * @private
 */
DPicker.prototype._setData = function (key, values, isDate = false) {
  for (let i = 0; i < values.length; i++) {
    if (values[i] === undefined || values[i] === '') {
      continue
    }

    if (isDate === false) {
      this.data[key] = values[i]
      break
    }

    if (DPicker.dateAdapter.isValid(values[i])) {
      this.data[key] = values[i]
      break
    }

    this.data[key] = new Date()

    const temp = DPicker.dateAdapter.isValidWithFormat(values[i], this.data.format)

    if (temp !== false) {
      this.data[key] = temp
      break
    }
  }
}

/**
 * Creates getters and setters for a given key
 * When the setter is called we will redraw
 * @param {String} key
 * @private
 */
DPicker.prototype._createGetSet = function (key) {
  if (DPicker.prototype.hasOwnProperty(key)) {
    return
  }

  Object.defineProperty(DPicker.prototype, key, {
    get: function () {
      return this.data[key]
    },
    set: function (newValue) {
      this.data[key] = newValue
      this.isValid(this.data.model)
      this.redraw()
    }
  })
}

/**
 * Gives the dpicker container and it's attributes
 * If the container is an input, the parentNode is the container but the attributes are the input's ones
 * @param {Element} container
 * @private
 * @return {Object} { container, attributes }
 */
DPicker.prototype._getContainer = function (container) {
  if (!container) {
    throw new ReferenceError('Can not initialize DPicker without a container')
  }

  const attributes = {}
  ;[].slice.call(container.attributes).forEach((attribute) => {
    attributes[attribute.name] = attribute.value
  })

  // small jquery fix: new DPicker($('<input type="datetime" name="mydatetime" autocomplete="off" step="30">'))
  if (container.length !== undefined && container[0]) {
    container = container[0]
  }

  if (container.tagName === 'INPUT') {
    if (!container.parentNode) {
      throw new ReferenceError('Can not initialize DPicker on an input without parent node')
    }

    let parentNode = container.parentNode
    container.parentNode.removeChild(container)
    container = parentNode
    container.classList.add('dpicker')
  }

  return { container, attributes }
}

/**
 * Allows to render more child elements with modules
 * @private
 * @return Array<VNode>
 */
DPicker.prototype._getRenderChild = function () {
  let children = {
    years: this.renderYears(this.events, this.data),
    months: this.renderMonths(this.events, this.data)
  }

  // add module render functions
  for (let render in DPicker.renders) {
    children[render] = DPicker.renders[render].call(this, this.events, this.data)
  }

  children.days = this.renderDays(this.events, this.data)

  return this.data.order.filter(e => children[e]).map(e => children[e])
}

/**
 * Mount rendered element to the DOM
 * @private
 */
DPicker.prototype._mount = function (element) {
  this._tree = this.getTree()
  element.appendChild(this._tree)
}

/**
 * Return the whole nodes tree
 * @return {Element}
 */
DPicker.prototype.getTree = function () {
  return this.renderContainer(this.events, this.data, [
    this.renderInput(this.events, this.data),
    this.render(this.events, this.data, this._getRenderChild())
  ])
}

/**
 * Checks whether the given model is a valid moment instance
 * This method does set the `.valid` flag by checking min/max allowed inputs
 * Note that it will return `true` if the model is valid even if it's not in the allowed range
 * @param {Date} date
 * @return {boolean}
 */
DPicker.prototype.isValid = function checkValidity (date) {
  if (DPicker.dateAdapter.isValid(date) === false) {
    this.data.valid = false
    return false
  }

  let isSame
  let temp

  if (this.data.time === false) {
    temp = DPicker.dateAdapter.resetHours(date)
    isSame = DPicker.dateAdapter.isSameDay(temp, this.data.min) || DPicker.dateAdapter.isSameDay(temp, this.data.max)
  } else {
    temp = DPicker.dateAdapter.resetSeconds(date)
    isSame = DPicker.dateAdapter.isSameHours(temp, this.data.min) || DPicker.dateAdapter.isSameHours(temp, this.data.max)
  }

  if (isSame === false && (DPicker.dateAdapter.isBefore(temp, this.data.min) || DPicker.dateAdapter.isAfter(temp, this.data.max))) {
    this.data.valid = false
    return true
  }

  this.data.valid = true
  return true
}

/**
 * Render input
 * @fires DPicker#inputChange
 * @fires DPicker#inputBlur
 * @fires DPicker#inputFocus
 * @return {Element} the rendered virtual dom hierarchy
 */
DPicker.prototype.renderInput = function (events, data, toRender) {
  return html`<input
    id="${data.inputId}"
    value="${data.empty === true ? '' : DPicker.dateAdapter.format(data.model, data.format)}"
    type="text"
    min="${data.min}"
    max="${data.max}"
    format="${data.format}"
    onchange="${events.inputChange}"
    onfocus="${events.inputFocus}"
    name="${data.inputName}"
    autocomplete="off"
    aria-invalid="${data.valid}" aria-haspopup
    class="${data.valid === false ? 'dpicker-invalid' : ''}">`
}

/**
 * Dpicker container if no input is provided
 * if an input is given, it's parentNode will be the container
 *
 * ```
 * div.dpicker
 * ```
 *
 * @return {Element} the rendered virtual dom hierarchy
 */
DPicker.prototype.renderContainer = function (events, data, toRender) {
  return html`<div class="dpicker">${toRender}</div>`
}

/**
 * Render a DPicker
 *
 * ```
 * div.dpicker#[uuid]
 *   input[type=text]
 *   div.dpicker-container.dpicker-[visible|invisible]
 * ```
 *
 * @see {@link DPicker#renderYears}
 * @see {@link DPicker#renderMonths}
 * @see {@link DPicker#renderDays}
 * @return {Element} the rendered virtual dom hierarchy
 */
DPicker.prototype.render = function (events, data, toRender) {
  return html`<div
    aria-hidden="${data.display === false}"
    class="dpicker-container ${data.display === true ? 'dpicker-visible' : 'dpicker-invisible'} ${data.time === true ? 'dpicker-has-time' : ''}">
    ${toRender}
    </div>`
}

/**
 * Render Years
 * ```
 * select[name='dpicker-year']
 * ```
 * @fires DPicker#yearChange
 * @return {Element} the rendered virtual dom hierarchy
 */
DPicker.prototype.renderYears = function (events, data, toRender) {
  let modelYear = DPicker.dateAdapter.getYear(data.model)
  let futureYear = DPicker.dateAdapter.getYear(data.max) + 1
  let pastYear = DPicker.dateAdapter.getYear(data.min)
  let options = []

  while (--futureYear >= pastYear) {
    options.push(this.setSelected(html`<option value="${futureYear}">${futureYear}</option>`, futureYear === modelYear))
  }

  return html`<select onchange="${events.yearChange}" name="dpicker-year" aria-label="Year">${options}</select>`
}

/**
 * Render Months
 * ```
 * select[name='dpicker-month']
 * ```
 * @fires DPicker#monthChange
 * @return {Element} the rendered virtual dom hierarchy
 */
DPicker.prototype.renderMonths = function (events, data, toRender) {
  let modelMonth = DPicker.dateAdapter.getMonth(data.model)
  let currentYear = DPicker.dateAdapter.getYear(data.model)
  let months = data.months
  let showMonths = data.months.map((e, i) => i)

  if (DPicker.dateAdapter.getYear(data.max) === currentYear) {
    let maxMonth = DPicker.dateAdapter.getMonth(data.max)
    showMonths = showMonths.filter(e => e <= maxMonth)
  }

  if (DPicker.dateAdapter.getYear(data.min) === currentYear) {
    let minMonth = DPicker.dateAdapter.getMonth(data.min)
    showMonths = showMonths.filter(e => e >= minMonth)
  }

  return html`<select onchange="${events.monthChange}" name="dpicker-month" aria-label="Month">
      ${showMonths.map((e, i) => this.setSelected(html`<option value="${e}">${months[e]}</option>`, e === modelMonth))}
    </select>`
}

/**
 * Render Days
 * ```
 * table
 *  tr
 *    td
 *      button|span
 * ```
 * @method
 * @fires DPicker#dayClick
 * @fires DPicker#dayKeyDown
 * @return {Element} the rendered virtual dom hierarchy
 */
DPicker.prototype.renderDays = function (events, data, toRender) {
  let daysInMonth = DPicker.dateAdapter.daysInMonth(data.model)
  let daysInPreviousMonth = DPicker.dateAdapter.daysInMonth(DPicker.dateAdapter.subMonths(data.model, 1))
  let firstLocaleDay = data.firstDayOfWeek
  let firstDay = DPicker.dateAdapter.firstWeekDay(data.model) - 1
  let currentDay = DPicker.dateAdapter.getDate(data.model)
  let currentMonth = DPicker.dateAdapter.getMonth(data.model)
  let currentYear = DPicker.dateAdapter.getYear(data.model)

  let days = new Array(7)

  data.days.map((e, i) => {
    days[i < firstLocaleDay ? 6 - i : i - firstLocaleDay] = e
  })

  let rows = new Array(Math.ceil(0.1 + (firstDay + daysInMonth) / 7)).fill(0)
  let day
  let dayActive
  let previousMonth = false
  let nextMonth = false
  let loopend = true
  let classActive = ''

  return html`<table>
    <tr>${days.map(e => html`<th>${e}</th>`)}</tr>
    ${rows.map((e, row) => {
      return html`<tr>${new Array(7).fill(0).map((e, col) => {
        dayActive = loopend
        classActive = ''

        if (col <= firstDay && row === 0) {
          day = daysInPreviousMonth - (firstDay - col)
          dayActive = false
          previousMonth = true
        } else if (col === firstDay + 1 && row === 0) {
          previousMonth = false
          day = 1
          dayActive = true
        } else {
          if (day === daysInMonth) {
            day = 0
            dayActive = false
            loopend = false
            nextMonth = true
          }

          day++
        }

        let dayMonth = previousMonth ? currentMonth : (nextMonth ? currentMonth + 2 : currentMonth + 1)
        let currentDayModel = new Date(currentYear, dayMonth - 1, day)

        if (dayActive === false && data.siblingMonthDayClick === true) {
          dayActive = true
        }

        if (data.min && dayActive) {
          dayActive = DPicker.dateAdapter.isSameOrAfter(currentDayModel, data.min)
        }

        if (data.max && dayActive) {
          dayActive = DPicker.dateAdapter.isSameOrBefore(currentDayModel, data.max)
        }

        if (dayActive === true && previousMonth === false && nextMonth === false && currentDay === day) {
          classActive = 'dpicker-active'
        }

        return html`<td class="${dayActive === true ? 'dpicker-active' : 'dpicker-inactive'}">
          ${
            dayActive === true
              ? html`<button value="${day}" aria-label="Day ${day}" aria-disabled="${dayActive}" onclick="${previousMonth === false && nextMonth === false ? events.dayClick : (previousMonth === true ? events.previousMonthDayClick : events.nextMonthDayClick)}" type="button" onkeydown="${events.dayKeyDown}" class="${classActive}">
                ${day}
              </button>`
            : html`<span class="${classActive}">${day}</span>`
          }
          </td>`
      })}</tr>`
    })}
  </table>`
}

/**
 * Called after parseInputAttributes but before render
 * Decorate it with modules to do things on initialization
 */
DPicker.prototype.initialize = function () {
  this.isValid(this.data.model)
}

/**
 * The model setter, feel free to decorate through modules
 * @param {Date} newValue
 */
DPicker.prototype.modelSetter = function (newValue) {
  this.data.empty = !newValue

  if (this.isValid(newValue) === true) {
    this.data.model = newValue
  }

  this.redraw()
}

/**
 * Redraws the date picker
 * Decorate it with modules to do things before redraw
 */
DPicker.prototype.redraw = function () {
  const newTree = this.getTree()
  this._tree = nanomorph(this._tree, newTree)
}

Object.defineProperties(DPicker.prototype, {
  'container': {
    get: function () {
      return this._container
    }
  },
  'inputId': {
    get: function () {
      return this.data.inputId
    }
  },
  'input': {
    get: function () {
      if (this.data.empty) {
        return ''
      }

      return DPicker.dateAdapter.format(this.data.model, this.data.format)
    }
  },
  /**
   * @method onChange
   * @param {Object} data
   * @param {Object} DPickerEvent
   * @param {Boolean} DPickerEvent.modelChanged whether the model has changed
   * @param {String} DPickerEvent.name the DPicker internal event name
   * @param {Event} DPickerEvent.event the original DOM event
   * @description
   * Example:
   *
   * ```javascript
   * var dpicker = new DPicker(container)
   *
   * dpicker.onChange = function(data, DPickerEvent) {
   *   // has the model changed?
   *   console.log(DPickerEvent.modelChanged)
   *   // the name of the internal event
   *   console.log(DPickerEvent.name)
   *   // the origin DOM event
   *   console.dir(DPickerEvent.event)
   * }
   * ```
   *
   */
  'onChange': {
    set: function (onChange) {
      this._onChange = (dpickerEvent) => {
        return !onChange ? false : onChange(this.data, dpickerEvent)
      }
    },
    get: function () {
      return this._onChange
    }
  },

  'valid': {
    get: function () {
      return this.data.valid
    }
  },

  'empty': {
    get: function () {
      return this.data.empty
    }
  },

  'model': {
    set: function (newValue) {
      this.modelSetter(newValue)
    },
    get: function () {
      return this.data.model
    }
  }
})

/**
 * Creates a decorator, use it to decorate public methods.
 *
 * For example:
 * ```javascript
 * DPicker.events.inputChange = DPicker.decorate(DPicker.events.inputChange, function DoSomethingOnInputChange (evt) {
 *   // do something
 * })
 *
 * ```
 *
 * The decoration will be stopped if the method returns `false`! It's like an internal `preventDefault` to avoid altering the original event.
 *
 * @param {String} which    one of events, calls
 * @param {Function} origin the origin function that will be decorated
 */
DPicker.decorate = function (origin, decoration) {
  return function decorator () {
    if (decoration.apply(this, arguments) === false) {
      return false
    }

    return origin.apply(this, arguments)
  }
}

DPicker.events = {
  /**
    * Hides the date picker if user does not click inside the container
    * @event DPicker#hide
    */
  hide: function hide (evt) {
    if (this.data.hideOnOutsideClick === false || this.display === false) {
      return
    }

    let node = evt.target

    if (isElementInContainer(node.parentNode, this._container)) {
      return
    }

    this.display = false
    this.onChange({modelChanged: false, name: 'hide', event: evt})
  },

  /**
    * Change model on input change
    * @event DPicker#inputChange
    */
  inputChange: function inputChange (evt) {
    if (!evt.target.value) {
      this.data.empty = true
    } else {
      let newModel = DPicker.dateAdapter.isValidWithFormat(evt.target.value, this.data.format)

      if (newModel !== false) {
        if (this.isValid(newModel) === true) {
          this.data.model = newModel
        }
      }

      this.data.empty = false
    }

    this.redraw()
    this.onChange({modelChanged: true, name: 'inputChange', event: evt})
  },

  /**
    * Hide on input blur
    * @event DPicker#inputBlur
    */
  inputBlur: function inputBlur (evt) {
    if (this.display === false) {
      return
    }

    let node = evt.relatedTarget || evt.target

    if (isElementInContainer(node.parentNode, this._container)) {
      return
    }

    this.display = false
    this.onChange({modelChanged: false, name: 'inputBlur', event: evt})
  },

  /**
    * Show the container on input focus
    * @event DPicker#inputFocus
    */
  inputFocus: function inputFocus (evt) {
    this.display = true
    if (evt.target && evt.target.select) {
      evt.target.select()
    }

    this.onChange({modelChanged: false, name: 'inputFocus', event: evt})
  },

  /**
    * On year change, update the model value
    * @event DPicker#yearChange
    */
  yearChange: function yearChange (evt) {
    this.data.empty = false
    this.model = DPicker.dateAdapter.setYear(this.data.model, evt.target.options[evt.target.selectedIndex].value)

    this.redraw()
    this.onChange({modelChanged: true, name: 'yearChange', event: evt})
  },

  /**
    * On month change, update the model value
    * @event DPicker#monthChange
    */
  monthChange: function monthChange (evt) {
    this.data.empty = false
    this.model = DPicker.dateAdapter.setMonth(this.data.model, evt.target.options[evt.target.selectedIndex].value)

    this.redraw()
    this.onChange({modelChanged: true, name: 'monthChange', event: evt})
  },

  /**
    * On day click, update the model value
    * @event DPicker#dayClick
    */
  dayClick: function dayClick (evt) {
    evt.preventDefault()
    evt.stopPropagation()
    this.model = DPicker.dateAdapter.setDate(this.data.model, evt.target.value)
    this.data.empty = false

    if (this.data.hideOnDayClick) {
      this.display = false
    }

    this.redraw()
    this.onChange({modelChanged: true, name: 'dayClick', event: evt})
  },

  /**
    * On previous month day click (only if `siblingMonthDayClick` is enabled)
    * @event DPicker#previousMonthDayClick
    */
  previousMonthDayClick: function previousMonthDayClick (evt) {
    if (!this.data.siblingMonthDayClick) {
      return
    }

    evt.preventDefault()
    evt.stopPropagation()

    this.model = DPicker.dateAdapter.subMonths(DPicker.dateAdapter.setDate(this.data.model, evt.target.value), 1)

    this.data.empty = false

    if (this.data.hideOnDayClick) {
      this.display = false
    }

    this.redraw()
    this.onChange({modelChanged: true, name: 'previousMonthDayClick', event: evt})
  },

  /**
    * On next month day click (only if `siblingMonthDayClick` is enabled)
    * @event DPicker#nextMonthDayClick
    */
  nextMonthDayClick: function nextMonthDayClick (evt) {
    if (!this.data.siblingMonthDayClick) {
      return
    }

    evt.preventDefault()
    evt.stopPropagation()

    this.model = DPicker.dateAdapter.addMonths(DPicker.dateAdapter.setDate(this.data.model, evt.target.value), 1)

    this.data.empty = false

    if (this.data.hideOnDayClick) {
      this.display = false
    }

    this.redraw()
    this.onChange({modelChanged: true, name: 'nextMonthDayClick', event: evt})
  },

  /**
    * On day key down - not implemented
    * @event DPicker#dayKeyDown
    */
  dayKeyDown: function dayKeyDown () {
  },

  /**
   * On key down inside the dpicker container,
   * intercept enter and escape keys to hide the container
   * @event DPicker#keyDown
   */
  keyDown: function keyDown (evt) {
    if (!this.data.hideOnEnter) {
      return
    }

    let key = evt.which || evt.keyCode

    if (key !== 13 && key !== 27) {
      return
    }

    document.getElementById(this.inputId).blur()
    this.display = false
    this.onChange({modelChanged: false, name: 'keyDown', event: evt})
  }
}

/**
 * @property {Object} renders Renders dictionnary
 */
DPicker.renders = {}

/**
 * @property {Object} properties Properties dictionnary (getters and setters will be set)
 */
DPicker.properties = {display: false}

/**
 * @property {DateAdapter} dateAdapter The date adapter
 * @see {@link /_api?id=module_momentadapter|MomentDateAdapter}
 */
DPicker.dateAdapter = undefined

/**
 * uuid generator
 * https://gist.github.com/jed/982883
 * @private
 */
function uuid () {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, a => (a ^ Math.random() * 16 >> a / 4).toString(16))
}

/**
 * isElementInContainer tests if an element is inside a given id
 * @param {Element} parent a DOM node
 * @param {String} containerId the container id
 * @private
 * @return {Boolean}
 */
function isElementInContainer (parent, containerId) {
  while (parent && parent !== document) {
    if (parent.getAttribute('id') === containerId) {
      return true
    }

    parent = parent.parentNode
  }

  return false
}

module.exports = DPicker
