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

// https://gist.github.com/jed/982883
function uuid() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,a=>(a^Math.random()*16>>a/4).toString(16))
}

/**
 * DPicker simple date picker
 * @param {Element} element DOM element where you want the date picker
 * @param {Object} options
 * @param {Moment} options.model Your own model instance, defaults to moment()
 * @param {Number} options.futureYear The latest year available (default to year + 1
 * @param {Number} options.pastYear The minimum year (default to 1986)
 * @param {string} options.format The input format, a moment format, default to DD/MM/YYYY
 * @param {string} options.months Months array, defaults to moment.months(), see also moment.monthsShort()
 * @param {string} options.inputId The input id, useful to add you own label (can only be set once)
 * @param {string} options.inputName The input name
 * @param {Function} options.onChange(data, array changedProperties) A function to call whenever the data gets updated
 */
function DPicker(element, options = {}) {
  this._container = uuid()

  const now = options.model || moment()

  this._data = {
    model: now.clone(),
    format: options.format || 'DD/MM/YYYY',
    display: options.display || false,
    futureYear: options.futureYear || +now.format('YYYY') + 1,
    pastYear: options.pastYear || 1986,
    months: options.months || moment.months(),
    inputId: options.inputId || uuid(),
    inputName: options.name || 'dpicker-input'
  }

  this._projector = maquette.createProjector()

  this._events = {
    /**
     * Hides the date picker if user does not click inside the container
     * @param {Event} DOMEvent
     * @see DPicker
     */
    hide: (evt) => {
      if (this._data.display == false) {
        return
      }

      let node = evt.target
      let parent = node.parentNode

      while (parent && parent != document) {
        if (parent.getAttribute('id') == this._container) {
          return
        }

        parent = parent.parentNode
      }

      this._data.display = false
      this._projector.scheduleRender()
      options.onChange && options.onChange(this._data, ['display'])
    },

    /**
     * Change model on input change
     * @param {Object} DOMEvent
     * @see DPicker.render
     */
    inputChange: (evt) => {
      if(!evt.target.value) {
        this._data.isEmpty = true
      } else {
        this._data.isEmpty = false
        this._data.model = moment(evt.target.value, this._data.format)
      }

      options.onChange && options.onChange(this._data, ['model'])
    },

    /**
     * Show the container on input focus
     * @param {Object} DOMEvent
     * @see DPicker.render
     */
    inputFocus: (evt) => {
      this._data.display = true
      options.onChange && options.onChange(this._data, ['display'])
    },

    /**
     * On year change, update the model value
     * @param {Object} DOMEvent
     * @see DPicker.renderYear
     */
    yearChange: (evt) => {
      this._data.isEmpty = false
      this._data.model.year(evt.target.options[evt.target.selectedIndex].value)
      options.onChange && options.onChange(this._data, ['model'])
    },

    /**
     * On month change, update the model value
     * @param {Object} DOMEvent
     * @see DPicker.renderMonths
     */
    monthChange: (evt) => {
      this._data.isEmpty = false
      this._data.model.month(evt.target.options[evt.target.selectedIndex].value)
      options.onChange && options.onChange(this._data, ['model'])
    },

    /**
     * On day click, update the model value
     * @param {Object} DOMEvent
     * @see DPicker.renderDays
     */
    dayClick: (evt) => {
      this._data.isEmpty = false
      this._data.model.date(evt.target.value)
      options.onChange && options.onChange(this._data, ['model'])
    }
  }

  document.addEventListener('click', this._events.hide)
  element.setAttribute('id', this._container)

  this._projector.append(element, this.render(this._events, this._data, [
    this.renderYears(this._events, this._data),
    this.renderMonths(this._events, this._data),
    this.renderDays(this._events, this._data),
  ]))

  return this
}


/**
 * Render a DPicker
 * div.dpicker#uuid
 *   input[type=text]
 *   div.dpicker-container.dpicker-[visible|invible]
 * @see DPicker.renderYears
 * @see DPicker.renderMonths
 * @see DPicker.renderDays
 */
DPicker.prototype.render = injector(function render(events, data, toRender) {
  return h('div.dpicker', [
    h('input#'+data.inputId, {
      value: data.isEmpty ? '' : data.model.format(data.format),
      type: 'text',
      onchange: events.inputChange,
      onfocus: events.inputFocus,
      name: data.inputName
    }),
    h('div.dpicker-container', {
      classes: {
        'dpicker-visible': data.display,
        'dpicker-invisible': !data.display
      }
    },
    toRender.map(e => e()))
  ])
})

/**
 * Render Years
 * select[name='dpicker-year']
 */
DPicker.prototype.renderYears = injector(function renderYears(events, data, toRender) {
  let modelYear = +data.model.format('YYYY')
  let futureYear = data.futureYear + 1
  let options = []

  while (--futureYear >= data.pastYear) {
    options.push(h('option', {
      value: futureYear,
      selected: futureYear === modelYear
    }, ''+futureYear))
  }

  return h('select', {
    onchange: events.yearChange,
    name: 'dpicker-year'
  }, options)
})

/**
 * Render Months
 * select[name='dpicker-month']
 */
DPicker.prototype.renderMonths = injector(function renderMonths(events, data, toRender) {
  let modelMonth = +data.model.format('MM')

  return h('select', {
      onchange: events.monthChange,
      name: 'dpicker-month'
    },
    data.months
    .map((e, i) => h('option', {
      value: i, selected: i+1 === modelMonth
    }, e))
  )
})

/**
 * Render Days
 * select[name='dpicker-month']
 * table
 *  tr
 *    td
 *      button|span
 */
DPicker.prototype.renderDays = injector(function renderDays(events, data, toRender) {
  let daysInMonth = data.model.daysInMonth()
  let daysInPreviousMonth = data.model.clone().subtract(1, 'months').daysInMonth()
  let firstDay = +(data.model.clone().date(1).format('e')) - 1
  let currentDay = data.model.date()

  let rows = new Array(Math.ceil(.1+(firstDay + daysInMonth) / 7)).fill(0)
  let day
  let dayActive

  return h('table', [
    //headers
    h('tr', moment.weekdaysShort().map(e => h('th', e))),
    //rows
    rows.map((e, row) => {
      //weeks filed with days
      return h('tr', {key: row}, new Array(7).fill(0).map((e, col) => {

        if (col <= firstDay && row == 0) {
          day = daysInPreviousMonth - (firstDay - col)
          dayActive = false
        } else if (col == firstDay + 1 && row == 0) {
          day = 1
          dayActive = true
        } else {
          if (day == daysInMonth) {
            day = 0
            dayActive = false
          }

          day++
        }

        return h('td', {
          classes: {
            'dpicker-active': dayActive,
            'dpicker-inactive': !dayActive
          }
        }, [
          h(dayActive ? 'button' : 'span', {
            onclick: dayActive ? events.dayClick : noop,
            value: day,
            classes: {'dpicker-active': currentDay == day}
          }, day)
        ])
      }))
    })
  ])
})

/**
 * DPicker.container getter
 */
Object.defineProperty(DPicker.prototype, 'container', {
  get: function() {
    return this._container
  }
})

Object.defineProperty(DPicker.prototype, 'inputId', {
  get: function() {
    return this._data.inputId
  }
})

;['model', 'format', 'display', 'futureYear', 'pastYear', 'months'].forEach(e => {
 Object.defineProperty(DPicker.prototype, e, {
    get: function() {
      return this._data[e]
    },
    set: function(newValue) {
      if (e === 'model' && !newValue) {
        this._data.isEmpty = true
      } else {
        this._data[e] = newValue
      }

      this._projector.scheduleRender()
    }
  })
})
