'use strict'
function noop() {}

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
 * @param {string} [options.inputId=uuid|element.getAttribute('id')] The input id, useful to add you own label (can only be set in the initiation phase) If element is an inputand it has an `id` attribute it'll be overriden by it
 * @param {string} [options.inputName='dpicker-input'] The input name. If element is an inputand it has a `name` attribute it'll be overriden by it
 * @param {Array} [options.order=['months', 'years', 'time', 'days']] The dom elements appending order.
 * @listens DPicker#hide
 */
function DPicker(element, options = {}) {

  if (!(this instanceof DPicker)) {
    return new DPicker(element, options)
  }

  this._container = uuid()

  if (!DPicker.hasOwnProperty('properties')) {
    DPicker.prototype.properties = {
      format: { default: 'DD/MM/YYYY', attribute: 'format', getset: true },
      model: { default: moment(), moment: true, attribute: 'value' },
      display: { default: false, getset: true },
      hideOnDayClick: { default: true },
      hideOnEnter: { default: true },
      min: { default: moment('1986-01-01'), moment: true, attribute: 'min', getset: true },
      max: { default: moment().add(1, 'year').month(11), moment: true, attribute: 'max', getset: true },
      months: { default: moment.months(), getset: true },
      days: { default: moment.weekdaysShort(), getset: true },
      inputName: { default: 'dpicker-input', attribute: 'name' },
      inputId: { default: uuid(), attribute: 'id' },
      empty: { default: false },
      valid: { default: true },
      order: { default: ['months', 'years', 'time', 'days'] }
    }
  }

  this.onChange = options.onChange

  this._data = {}
  this._loadModules()
  this._initData(options)

  document.addEventListener('click', this._events.hide)

  if (typeof element === 'undefined') {
    throw new ReferenceError('Can not initialize DPicker without a container')
  }

  //small jquery fix: new DPicker($('<input type="datetime" name="mydatetime" autocomplete="off" step="30">'))
  if (element.length !== undefined && element[0]) {
      element = element[0]
  }

  if (element.tagName === 'INPUT') {
    if (!element.parentNode) {
      throw new ReferenceError('Can not initialize DPicker on an input without parent node')
    }

    this._parseInputAttributes([].slice.call(element.attributes))

    let parentNode = element.parentNode
    element.parentNode.removeChild(element)
    element = parentNode
    element.classList.add('dpicker')
  }

  this._initialize()

  this.mount(element, this.renderContainer(this._events, this._data, [
    this.renderInput(this._events, this._data),
    this.render(this._events, this._data, this.getRenderChild())
  ]))

  element.setAttribute('id', this._container)
  element.addEventListener('keydown', this._events.keyDown)

  let input = element.querySelector('input')

  input.addEventListener('blur', this._events.inputBlur)

  document.addEventListener('touchend', (e) => {
    this._events.inputBlur(e)
  })

  this.rootElement = element

  return this
}

DPicker.prototype.toggle = function() {
  let el = this.rootElement.querySelector('.dpicker-container')
  if (this.display === true) {
    el.classList.remove('dpicker-invisible')
    el.classList.add('dpicker-visible')
  } else {
    el.classList.add('dpicker-invisible')
    el.classList.remove('dpicker-visible')
  }
}

/**
 * Called after parseInputAttributes but before render
 * Use it with modules to change things on initialization
 */
DPicker.prototype._initialize = function() {
  this.isValid(this._data.model)
}

/**
 * Mount hyperscript elements into the DOM
 */
DPicker.prototype.mount = function(element, toRender) {
  element.appendChild(toRender)
}

DPicker.prototype.replace = function(selector, replacement) {
  let child = this.rootElement.querySelector(selector)
  child.parentNode.replaceChild(replacement, child)
}

DPicker.prototype.merge = function(selector, replacement) {
  let child = this.rootElement.querySelector(selector)

  for (let i = 0; i < replacement.attributes.length; i++) {
    let attr = replacement.attributes[i]

    if (child.getAttribute(attr.name) !== attr.value) {
      child.setAttribute(attr.name, attr.value)
    }
  }

  for (let i = 0; i < child.attributes.length; i++) {
    let attr = child.attributes[i]

    if (!replacement.hasAttribute(attr.name)) {
      child.removeAttribute(attr.name)
    }
  }

  if (replacement.value !== child.value) {
    child.value = replacement.value
  }
}

/**
 * Render method, forces the virtual dom to re-render
 */
DPicker.prototype.redraw = function(items) {
  if (!items) {
    items = ['input', 'container']
  }

  for (let i = 0; i < items.length; i++) {
    switch(items[i]) {
        case 'input':
          this.merge('input', this.renderInput(this._events, this._data))
        break;
        case 'days':
          this.replace('table', this.renderDays(this._events, this._data))
        break;
        case 'container':
          this.replace('.dpicker-container', this.render(this._events, this._data, this.getRenderChild()))
        break;
    }
  }
}

/**
 * Allows to render more child elements with modules
 * @return Array<VNode>
 */
DPicker.prototype.getRenderChild = function() {
  let children = {
    years: this.renderYears(this._events, this._data),
    months: this.renderMonths(this._events, this._data)
  }

  //add module render functions
  for (let module in this._modulesRender) {
    for (let renderMethod in this._modulesRender[module]) {
      children[renderMethod] = this._modulesRender[module][renderMethod](this._events, this._data)
    }
  }

  children.days = this.renderDays(this._events, this._data)

  return this._data.order.filter(e => children[e]).map(e => children[e])
}

/**
 * Initializes the _data property, creates appropriate getters and setters
 * Called after _loadModules
 * @internal
 * @param {Object} options - DPicker creation options
 */
DPicker.prototype._initData = function(options) {
  for (let i in this.properties) {
    let e = this.properties[i]

    if (e.getset && !(i in DPicker.prototype)) {
      Object.defineProperty(DPicker.prototype, i, {
        get: function() {
          return this._data[i]
        },
        set: function(newValue) {
          this._data[i] = newValue
          if (i === 'display') {
            this.toggle()
          } else {
            this.redraw()
          }
        }
      })
    }

    this._data[i] = e.default

    if (options[i] === undefined) {
      continue
    }

    if (i === 'model' && !options[i]) {
      this._data.empty = true
      continue
    }

    this._data[i] = options[i]
  }
}

/**
 * Parse input attributes and fill dpicker data container on initialization
 * @param {Element} element - an input
 */
DPicker.prototype._parseInputAttributes = function(attributes) {

  for (let i in this.properties) {
    let e = this.properties[i]

    if (e.attribute === undefined) {
      continue
    }

    if (typeof e.attribute === 'function') {
      this._data[i] = e.attribute(attributes)
      continue
    }

    let attribute = attributes.filter(a => a.name === e.attribute)[0]

    if (!attribute) {
      continue
    }

    let v = attribute.value

    if (!v) {
      if (i === 'model') {
        this._data.empty = true
        continue
      }

      continue
    }

    if (e.moment === true) {
      v = moment(attribute.value, this._data.format, true)

      if (v.isValid() === false) {
        continue
      }
    }

    this._data[i] = v
  }
}

/**
 * Load modules
 * @internal
 */
DPicker.prototype._loadModules = function loadModules() {
  this._events = this._loadEvents()
  this._modulesRender = {}

  for (let moduleName in DPicker.modules) {
    let module = DPicker.modules[moduleName]

    for (let event in module.events) {
      if (!this._events[event]) {
        this._events[event] = module.events[event].bind(this)
        continue
      }

      if (!this._events[event+'-internal']) {
        this._events[event+'-internal'] = [this._events[event]]
        this._events[event] = (evt) => {
          this._events[event+'-internal'].map(e => e.bind(this)(evt))
        }
      }

      this._events[event+'-internal'].unshift(module.events[event])
    }

    for (let call in module.calls) {
      if (!DPicker.prototype.hasOwnProperty(call) || typeof module.calls[call] !== 'function') {
        continue
      }

      if (!this[call+'-internal']) {
        this[call+'-internal'] = [DPicker.prototype[call]]
        this[call] = (...args) => {
          this[call+'-internal'].map(e => e.apply(this, args))
        }
      }

      this[call+'-internal'].push(module.calls[call])
    }

    if (module.render) {
      for (let i in module.render) {
        this._modulesRender[i] = module.render
      }
    }

    if (module.properties) {
      for (let i in module.properties) {
        if (!this.properties[i]) {
          this.properties[i] = module.properties[i]
        }
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
      if (this.display === false) {
        return
      }

      let node = evt.target

      if (isElementInContainer(node.parentNode, this._container)) {
        return
      }

      this.display = false
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

        if (this.isValid(newModel) === true) {
          this._data.model = newModel
        }

        this._data.empty = false
      }

      this.redraw(['input', 'container'])
      this.onChange()
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

      this.redraw(['input', 'days'])
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

      this.isValid(this._data.model)

      this.redraw(['input', 'days'])
      this.onChange()
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

      this.redraw(['input', 'days'])
      this.onChange()
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

      if (key !== 13 && key !== 27) {
        return
      }

      document.getElementById(this.inputId).blur()
      this.display = false
    }
  }
}

/**
 * Checks whether the given model is a valid moment instance
 * This method does set the `.valid` flag by checking min/max allowed inputs
 * Note that it will return `true` if the model is valid even if it's not in the allowed range
 * @param {Moment} model
 * @return {boolean}
 */
DPicker.prototype.isValid = function isValid(model) {
  if (!(model instanceof moment) || !model.isValid()) {
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
  return this.h('input', {
    id: data.inputId,
    value: data.empty ? '' : data.model.format(data.format),
    type: 'text',
    min: data.min.format(data.format),
    max: data.max.format(data.format),
    format: data.format,
    onchange: events.inputChange,
    onfocus: events.inputFocus,
    name: data.inputName,
    'aria-invalid': !data.valid,
    'aria-haspopup': true,
    class: !data.valid ? 'dpicker-invalid' : ''
  })
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
  return this.h('div', {class: 'dpicker'}, toRender)
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
  return this.h('div', {
    'aria-hidden': !data.display,
    class: `dpicker-container ${data.display ? 'dpicker-visible' : 'dpicker-invisible'}`
  },
  toRender)
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
    options.push(this.h('option', {
      value: futureYear,
      selected: futureYear === modelYear,
      key: futureYear
    }, ''+futureYear))
  }

  return this.h('select', {
    onchange: events.yearChange,
    name: 'dpicker-year',
    'aria-label': 'Year'
  }, options)
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

  return this.h('select', {
      onchange: events.monthChange,
      name: 'dpicker-month',
      'aria-label': 'Month'
    },
    showMonths
    .map((e, i) => this.h('option', {
      value: e,
      selected: e === modelMonth,
      key: e
    }, months[e]))
  )
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
  let firstLocaleDay = moment.localeData().firstDayOfWeek()
  let firstDay = +(data.model.clone().date(1).format('e')) - 1
  let currentDay = data.model.date()

  let minDay
  let maxDay

  let days = new Array(7)

  data.days.map((e, i) => {
    days[i < firstLocaleDay ? 6 - i : i - firstLocaleDay] = e
  })

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

  return this.h('table', [
    //headers
    this.h('tr', days.map(e => this.h('th', e))),
    //rows
    rows.map((e, row) => {
      //weeks filed with days
      return this.h('tr', {key: row}, new Array(7).fill(0).map((e, col) => {
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

        return this.h(`td`, {
          class: dayActive ? 'dpicker-active' : 'dpicker-inactive'
        }, [
          this.h(`${dayActive ? 'button' : 'span'}`, {
            value: day,
            'aria-label': dayActive ? 'Day ' + day : false,
            'aria-disabled': dayActive ? false : true,
            onclick: dayActive ? events.dayClick : noop,
            type: dayActive ? 'button' : null,
            onkeydown: dayActive ? events.dayKeyDown || noop : noop,
            class: currentDay === day ? 'dpicker-active' : ''
          }, day)
        ])
      }))
    })
  ])
}

/**
 * The model setter, feel free to override through modules
 * @param {Moment} newValue
 */
DPicker.prototype._modelSetter = function(newValue) {
  this._data.empty = !newValue

  if (this.isValid(newValue) === true) {
    this._data.model = newValue
  }

  this.redraw()
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
        return !onChange ? false : onChange(this._data)
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
      this._modelSetter(newValue)
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

DPicker.h = DPicker.prototype.h = function h(element, props, children) {
  let el = document.createElement(element)
  let frag = document.createDocumentFragment()

  if (props.toString() !== '[object Object]') {
    children = props
    props = {}
  }

  if (typeof children === 'undefined') {
    children = []
  } else if (!Array.isArray(children)) {
    children = [children]
  }

  for (let i in props) {
    if (!props[i]) { continue; }

    if (i.substr(0, 2) === 'on') {
      el[i] = props[i]
    } else {
      if (props[i] === true) {
        el.setAttribute(i, i)
      } else {
        el.setAttribute(i, props[i])
      }
    }
  }

  for (let i = 0; i < children.length; i++) {
    if (typeof children[i] === 'string' || typeof children[i] === 'number') {
      el.innerText = children[i]
      break;
    }

    if (Array.isArray(children[i])) {
      children[i].map((node) => frag.appendChild(node))
    } else {
      frag.appendChild(children[i])
    }
  }

  el.appendChild(frag)

  return el
}


/**
 * A module looks like this:
 *
 * ```
 * const myModule = DPicker.modules.myModule = {
 *   events: {
 *     inputChange: function() //you can override any events available or add yours
 *   },
 *   render: {
 *     renderSomething: function renderSomething(events, data) { } //add dom elements through hyperscript DPicker.h
 *   },
 *   calls: {
 *    _initialize: function() { //do something on initialization } //here you can add a call at any DPicker method
 *   }
 * }
 * ```
 *
 * Here is an example that adds two buttons to navigate between months. We can add this code to `dpicker.month-navigation.js`:
 *
 * ```
 * const renderPreviousMonth = function renderPreviousMonth(events, data, toRender) {
 *   return DPicker.h('button', { onclick: events.previousMonth }, '<') //add some appropriate attributes
 * }
 *
 * const renderNextMonth = function renderNextMonth(events, data, toRender) {
 *   return DPicker.h('button', { onclick: events.nextMonth }, '>')
 * }
 *
 * const monthNavigation = DPicker.modules.monthNavigation = {
 *   render: {
 *     previousMonth: renderPreviousMonth,
 *     nextMonth: renderNextMonth
 *   },
 *   events: {
 *     previousMonth: function previousMonth() {
 *        this._data.model.add(-1, 'month')
 *     },
 *     nextMonth: function nextMonth(evt) {
 *        this._data.model.add(1, 'month')
 *     }
 *   }
 * }
 *
 * ```
 *
 * Make sure this code is loaded with DPicker. Then initialize a new DPicker by specifying a render order:
 *
 * ```
 * new DPicker(document.getElementById('trythis'), {order: ['time', 'previousMonth', 'months', 'nextMonth', 'days'], time: true})
 * ```
 *
 * Now your date picker has two new buttons to select next/prev month in a click.
 *
 * For more, check out existing modules!
 *
 * @property {Object} modules
 */
DPicker.modules = {}
