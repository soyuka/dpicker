'use strict'
const nanomorph = require('nanomorph')
const html = require('bel')

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

/**
 * DPicker a simple date picker
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
 * @param {boolean} [options.siblingMonthDayClick=false] Enable sibling months day click
 * @param {Function} [options.onChange] A function to call whenever the data gets updated
 * @param {string} [options.inputId=uuid|element.getAttribute('id')] The input id, useful to add you own label (can only be set in the initiation phase) If element is an inputand it has an `id` attribute it'll be overriden by it
 * @param {string} [options.inputName='dpicker-input'] The input name. If element is an inputand it has a `name` attribute it'll be overriden by it
 * @param {Array} [options.order=['months', 'years', 'time', 'days']] The dom elements appending order.
 * @param {boolean} [options.concatHoursAndMinutes=false] Use only one select box for both hours and minutes
 * @listens DPicker#hide
 */
function DPicker(element, options = {}) {

  if (!(this instanceof DPicker)) {
    return new DPicker(element, options)
  }

  if (options.moment === undefined) {
    options.moment = require('moment')
  }

  this.moment = options.moment

  const {container, attributes} = this._getContainer(element)

  this._container = uuid()
  this._data = {}

  const defaults = {
    months: this.moment.months(),
    days: this.moment.weekdaysShort(),
    empty: false,
    valid: true,
    order: ['months', 'years', 'time', 'days'],
    hideOnDayClick: true,
    hideOnEnter: true,
    hideOnOutsideClick: true,
    siblingMonthDayClick: false,
    firstDayOfWeek: this.moment.localeData().firstDayOfWeek()
  }

  for (let i in defaults) {
    if (options[i] !== undefined) {
      this._data[i] = options[i]
      continue
    }

    this._data[i] = defaults[i]
  }

  this._data.inputName = attributes.name ? attributes.name : options.inputName ? options.inputName : 'dpicker-input'
  this._data.inputId = attributes.id ? attributes.id : options.inputId ? options.inputId : uuid()

  this._setData('format', [attributes.format, 'DD/MM/YYYY'])

  const methods = {
    display: false,
    min: this.moment('1986-01-01'),
    max: this.moment().add(1, 'year').month(11),
    format: this._data.format
  }

  for (let i in methods) {
    if (options[i] !== undefined) {
      methods[i] = options[i]
    }
  }

  this._events = this._loadEvents()
  this._loadModules(attributes, options)
  this._createMethods(methods, attributes)

  if (attributes.value === undefined || attributes.value === '') {
    this._data.empty = true
  }

  this._setData('model', [attributes.value, options.model, this.moment()], true)

  this.onChange = options.onChange

  document.addEventListener('click', this._events.hide)

  document.addEventListener('touchend', (e) => {
    this._events.inputBlur(e)
  })

  this.initialize()

  this._mount(container)

  container.id = this._container
  container.addEventListener('keydown', this._events.keyDown)

  let input = container.querySelector('input')
  input.addEventListener('blur', this._events.inputBlur)

  return this
}

DPicker.prototype._setData = function(key, values, isMoment = false) {
    for (let i = 0; i < values.length; i++) {
      if (values[i] === undefined || values[i] === '') {
        continue
      }

      if (isMoment === false) {
        this._data[key] = values[i]
        break
      }

      if (values[i] instanceof this.moment && values[i].isValid()) {
        this._data[key] = values[i]
        break
      }

      this._data[key] = this.moment()

      const date = this.moment(values[i], this._data.format, true)

      if (date.isValid()) {
        this._data[key] = date
        break
      }
    }
}

DPicker.prototype._createGetSet = function(key) {
  if (DPicker.prototype.hasOwnProperty(key)) {
    return
  }

  Object.defineProperty(DPicker.prototype, key, {
    get: function() {
      return this._data[key]
    },
    set: function(newValue) {
      this._data[key] = newValue
      this.redraw()
    }
  })
}

DPicker.prototype._createMethods = function(defaults, attributes) {
  for (let i in defaults) {
    this._createGetSet(i)
    this._setData(i, [attributes[i], defaults[i]], defaults[i] instanceof this.moment)
  }
}

DPicker.prototype._getContainer = function(container) {
  if (typeof container === 'undefined') {
    throw new ReferenceError('Can not initialize DPicker without a container')
  }

  const attributes = {}
  ;[].slice.call(container.attributes).forEach((attribute) => {
    attributes[attribute.name] = attribute.value
  })

  //small jquery fix: new DPicker($('<input type="datetime" name="mydatetime" autocomplete="off" step="30">'))
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
 * @return Array<VNode>
 */
DPicker.prototype._getRenderChild = function() {
  let children = {
    years: this.renderYears(this._events, this._data),
    months: this.renderMonths(this._events, this._data)
  }

  //add module render functions
  for (let render in this._modules.render) {
    children[render] = this._modules.render[render](this._events, this._data)
  }

  children.days = this.renderDays(this._events, this._data)

  return this._data.order.filter(e => children[e]).map(e => children[e])
}

/**
 * Mount rendered element to the DOM
 */
DPicker.prototype._mount = function(element) {
  this._tree = this.getTree()
  element.appendChild(this._tree)
}

DPicker.prototype._decorate = function decorate(which, origin, key) {
  const self = this
  return function() {
    const decorations = self._modules[which][key]

    for (let i = 0; i < decorations.length; i++) {
      if (decorations[i].apply(self, arguments) === false) {
        return false
      }
    }

    return origin.apply(self, arguments)
  }
}

/**
 * Load modules
 * @internal
 */
DPicker.prototype._loadModules = function loadModules(attributes, options) {
  this._modules = {calls: {}, events: {}, render: {}}
  const items = ['events', 'calls']
  const calls = ['initialize', 'redraw', 'modelSetter']

  for (let moduleName in DPicker.modules) {
    let module = DPicker.modules[moduleName]

    for (let i = 0; i < items.length; i++) {
      const which = items[i]

      for (let key in module[which]) {
        if (which === items[0] && this._events[key] === undefined) {
          this._events[key] = module[which][key].bind(this)
          continue
        }

        const fn = module[which][key]

        if (this._modules[which][key] === undefined) {
          this._modules[which][key] = [fn]
        } else {
          this._modules[which][key].push(fn)
        }
      }
    }

    if (module.render) {
      for (let i in module.render) {
        if (i in this._modules.render) {
          throw new ReferenceError('Can not override a render method')
        }

        this._modules.render[i] = module.render[i]
      }
    }

    if (module.properties) {
      for (let i in module.properties) {
        if (this._data[i]) {
          continue
        }

        let prop = module.properties[i]
        let attribute = typeof prop.attribute === 'function' ? prop.attribute(attributes) : attributes[prop.attribute]

        this._createGetSet(i)
        this._setData(i, [attribute, options[i], prop.default], prop.isMoment ? true : false)
      }
    }
  }

  for (let i = 0; i < items.length; i++) {
    const which = items[i]
    const keys = i === 0 ? Object.keys(this._events) : calls

    for (let j = 0; j < keys.length; j++) {
      const key = keys[j]

      if (this._modules[which][key] === undefined) {
        continue
      }

      if (i === 0) {
        const origin = this._events[key]
        this._events[key] = this._decorate(which, origin, key)
      } else {
        const origin = this[key]
        this[key] = this._decorate(which, origin, key)
      }
    }
  }
}

/**
 * Load _event object
 */
DPicker.prototype._loadEvents = function loadEvents() {
  return {
    /**
     * Hides the date picker if user does not click inside the container
     * @event DPicker#hide
     * @param {Event} DOMEvent
     */
    hide: (evt) => {
      if (this._data.hideOnOutsideClick === false || this.display === false) {
        return
      }

      let node = evt.target

      if (isElementInContainer(node.parentNode, this._container)) {
        return
      }

      this.display = false
      this.onChange(false)
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
        let newModel = this.moment(evt.target.value, this._data.format, true)

        if (this.isValid(newModel) === true) {
          this._data.model = newModel
        }

        this._data.empty = false
      }

      this.redraw()
      this.onChange({modelChanged: true, name: 'inputChange', event: evt})
    },

    /**
     * Hide on input blur
     * @event DPicker#inputBlur
     * @param {Event} DOMEvent
     */
    inputBlur: (evt) => {
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
     * @param {Event} DOMEvent
     */
    inputFocus: (evt) => {
      this.display = true
      if (evt.target && evt.target.select) {
        evt.target.select()
      }

      this.onChange({modelChanged: false, name: 'inputFocus', event: evt})
    },

    /**
     * On year change, update the model value
     * @event DPicker#yearChange
     * @param {Event} DOMEvent
     */
    yearChange: (evt) => {
      this._data.empty = false
      this._data.model.year(evt.target.options[evt.target.selectedIndex].value)

      this.isValid(this._data.model)

      this.redraw()
      this.onChange({modelChanged: true, name: 'yearChange', event: evt})
    },

    /**
     * On month change, update the model value
     * @event DPicker#monthChange
     * @param {Event} DOMEvent
     */
    monthChange: (evt) => {
      this._data.empty = false
      this._data.model.month(evt.target.options[evt.target.selectedIndex].value)

      this.isValid(this._data.model)

      this.redraw()
      this.onChange({modelChanged: true, name: 'monthChange', event: evt})
    },

    /**
     * On day click, update the model value
     * @Event DPicker#dayClick
     * @param {Event} DOMEvent
     */
    dayClick: (evt) => {
      evt.preventDefault()
      evt.stopPropagation()
      this._data.model.date(evt.target.value)
      this._data.empty = false

      if (this._data.hideOnDayClick) {
        this.display = false
      }

      //temp fix, model setter should call this
      //@todo fix without moment.clone()
      this.isValid(this._data.model)

      this.redraw()
      this.onChange({modelChanged: true, name: 'dayClick', event: evt})
    },

    previousMonthDayClick: (evt) => {
      if (!this._data.siblingMonthDayClick) {
        return
      }

      evt.preventDefault()
      evt.stopPropagation()
      this._data.model.date(evt.target.value)
      this._data.model.subtract(1, 'month')
      this._data.empty = false

      if (this._data.hideOnDayClick) {
        this.display = false
      }

      //temp fix, model setter should call this
      //@todo fix without moment.clone()
      this.isValid(this._data.model)

      this.redraw()
      this.onChange({modelChanged: true, name: 'previousMonthDayClick', event: evt})
    },

    nextMonthDayClick: (evt) => {
      if (!this._data.siblingMonthDayClick) {
        return
      }

      evt.preventDefault()
      evt.stopPropagation()
      this._data.model.date(evt.target.value)
      this._data.model.add(1, 'month')
      this._data.empty = false

      if (this._data.hideOnDayClick) {
        this.display = false
      }

      //temp fix, model setter should call this
      //@todo fix without moment.clone()
      this.isValid(this._data.model)

      this.redraw()
      this.onChange({modelChanged: true, name: 'nextMonthDayClick', event: evt})
    },

    /**
     * On day key down - not implemented
     * @Event DPicker#dayKeyDown
     * @param {Event} DOMEvent
     */
    dayKeyDown: () => {
    },

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

      if (key !== 13 && key !== 27) {
        return
      }

      document.getElementById(this.inputId).blur()
      this.display = false
      this.onChange({modelChanged: false, name: 'keyDown', event: evt})
    }
  }
}

DPicker.prototype.getTree = function() {
  return this.renderContainer(this._events, this._data, [
    this.renderInput(this._events, this._data),
    this.render(this._events, this._data, this._getRenderChild())
  ])
}

/**
 * Checks whether the given model is a valid moment instance
 * This method does set the `.valid` flag by checking min/max allowed inputs
 * Note that it will return `true` if the model is valid even if it's not in the allowed range
 * @param {Moment} model
 * @return {boolean}
 */
DPicker.prototype.isValid = function isValid(model) {
  if (!(model instanceof this.moment) || !model.isValid()) {
    this._data.valid = false
    return false
  }

  let unit = this.time ? 'minute' : 'day'
  if (model.isBefore(this._data.min, unit) || model.isAfter(this._data.max, unit)) {
    this._data.valid = false
    return true
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
DPicker.prototype.renderInput = function renderInput(events, data, toRender) {
  return html`<input
    id="${data.inputId}"
    value="${data.empty === true ? '' : data.model.format(data.format)}"
    type="text"
    min="${data.min.format(data.format)}"
    max="${data.max.format(data.format)}"
    format="${data.format}"
    onchange="${events.inputChange}"
    onfocus="${events.inputFocus}"
    name="${data.inputName}"
    aria-invalid="${data.valid === false}" aria-haspopup
    class="${data.valid === false ? 'dpicker-invalid' : ''}">`
}

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
DPicker.prototype.renderContainer = function renderContainer(events, data, toRender) {
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
 * @method
 * @see DPicker#renderYears
 * @see DPicker#renderMonths
 * @see DPicker#renderDays
 * @return {H} the rendered virtual dom hierarchy
 */
DPicker.prototype.render = function render(events, data, toRender) {
  return html`<div
    aria-hidden="${data.display === false}"
    class="dpicker-container ${data.display === true ? 'dpicker-visible' : 'dpicker-invisible'}">
    ${toRender}
    </div>`
}

/**
 * Render Years
 * ```
 * select[name='dpicker-year']
 * ```
 * @method
 * @listens DPicker#yearChange
 * @return {H} the rendered virtual dom hierarchy
 */
DPicker.prototype.renderYears = function renderYears(events, data, toRender) {
  let modelYear = data.model.year()
  let futureYear = data.max.year() + 1
  let pastYear = data.min.year()
  let options = []

  while (--futureYear >= pastYear) {
    if (futureYear === modelYear) {
      options.push(html`<option value="${futureYear}" selected="selected">${futureYear}</option>`)
    } else {
      options.push(html`<option value="${futureYear}">${futureYear}</option>`)
    }
  }

  return html`<select onchange="${events.yearChange}" name="dpicker-year" aria-label="Year">${options}</select>`
}

/**
 * Render Months
 * ```
 * select[name='dpicker-month']
 * ```
 * @method
 * @listens DPicker#monthChange
 * @return {H} the rendered virtual dom hierarchy
 */
DPicker.prototype.renderMonths = function renderMonths(events, data, toRender) {
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

  return html`<select onchange="${events.monthChange}" name="dpicker-month" aria-label="Month">
      ${showMonths.map((e, i) => e === modelMonth ? html`<option value="${e}" selected="selected">${months[e]}</option>` : html`<option value="${e}">${months[e]}</option>`)}
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
 * @listens DPicker#dayClick
 * @listens DPicker#dayKeyDown
 * @return {H} the rendered virtual dom hierarchy
 */
DPicker.prototype.renderDays = function renderDays(events, data, toRender) {
  let daysInMonth = data.model.daysInMonth()
  let daysInPreviousMonth = data.model.clone().subtract(1, 'months').daysInMonth()
  let firstLocaleDay = data.firstDayOfWeek
  let firstDay = +(data.model.clone().date(1).format('e')) - 1
  let currentDay = data.model.date()
  let currentMonth = data.model.month()
  let currentYear = data.model.year()

  let minDay
  let maxDay
  let minMonth
  let maxMonth

  let days = new Array(7)

  data.days.map((e, i) => {
    days[i < firstLocaleDay ? 6 - i : i - firstLocaleDay] = e
  })

  if(data.model.isSame(data.min, 'month')) {
    minDay = data.min.date()
    minMonth = data.min.month()
  }

  if(data.model.isSame(data.max, 'month')) {
    maxDay = data.max.date()
    maxMonth = data.max.month()
  }

  let rows = new Array(Math.ceil(.1+(firstDay + daysInMonth) / 7)).fill(0)
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
        let currentDayModel = this.moment(day + '-' + dayMonth + '-' + currentYear, 'DD-MM-YYYY')

        if (dayActive === false && data.siblingMonthDayClick === true) {
          dayActive = true
        }

        if (data.min && dayActive) {
          dayActive = currentDayModel.isSameOrAfter(data.min, 'day')
        }

        if (data.max && dayActive) {
          dayActive = currentDayModel.isSameOrBefore(data.max, 'day')
        }

        if (dayActive === true && previousMonth === false && nextMonth === false && currentDay === day) {
          classActive = 'dpicker-active'
        }

        return html`<td class="${dayActive === true ? 'dpicker-active' : 'dpicker-inactive'}">
          ${
            dayActive === true ?
              html`<button value="${day}" aria-label="Day ${day}" aria-disabled="${dayActive}" onclick="${previousMonth === false && nextMonth === false ? events.dayClick : (previousMonth === true ? events.previousMonthDayClick : events.nextMonthDayClick)}" type="button" onkeydown="${events.dayKeyDown}" class="${classActive}">
                ${day}
              </button>`
            :
              html`<span class="${classActive}">${day}</span>`
          }
          </td>`
      })}</tr>`
    })}
  </table>`
}

/**
 * Called after parseInputAttributes but before render
 * Use it with modules to change things on initialization
 */
DPicker.prototype.initialize = function() {
  this.isValid(this._data.model)
}

/**
 * The model setter, feel free to override through modules
 * @param {Moment} newValue
 */
DPicker.prototype.modelSetter = function(newValue) {
  this._data.empty = !newValue

  if (this.isValid(newValue) === true) {
    this._data.model = newValue
  }

  this.redraw()
}

DPicker.prototype.redraw = function() {
  const newTree = this.getTree()
  this._tree = nanomorph(this._tree, newTree)
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
      this._onChange = (dpickerEvent) => {
        return !onChange ? false : onChange(this._data, dpickerEvent)
      }
    },
    get: function() {
      return this._onChange
    }
  },

  /**
   * @var {Boolean} DPicker#valid
   * @description Is the current input valid
   */
  'valid': {
    get: function() {
      return this._data.valid
    }
  },

  /**
   * @var {Moment} DPicker#model
   * @description Get/Set model, a Moment instance
   */
  'model': {
    set: function(newValue) {
      this.modelSetter(newValue)
    },
    get: function() {
      return this._data.model
    }
  }
})

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

/*
 * @property {Object} modules
 */
DPicker.modules = {}
module.exports = DPicker
