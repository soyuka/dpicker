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

function positionInParent(children) {
  return [].findIndex.call(children.parentNode.children, (c) => c == children)
}

/**
 * DPicker simple date picker
 * @param {Element} element DOM element where you want the date picker or an input
 * @param {Object} options
 * @param {Moment} options.model Your own model instance, defaults to moment()
 * @param {Number} options.futureYear The latest year available (default to year + 1
 * @param {Number} options.pastYear The minimum year (default to 1986)
 * @param {string} options.format The input format, a moment format, default to DD/MM/YYYY
 * @param {string} options.months Months array, defaults to moment.months(), see also moment.monthsShort()
 * @param {Function} options.onChange(data, array changedProperties) A function to call whenever the data gets updated
 * @param {string} options.inputId The input id, useful to add you own label (can only be set once)
 * @param {string} options.inputName The input name
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
      if (!evt.target.value) {
        this._data.isEmpty = true
      } else {
        let newModel = moment(evt.target.value, this._data.format)

        if (newModel.isValid()) {
          this._data.model = newModel
        }

        this._data.isEmpty = false
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
      evt.preventDefault()
      this._data.isEmpty = false
      this._data.model.date(evt.target.value)
      options.onChange && options.onChange(this._data, ['model'])
      this._data.display = false
    },

    dayKeyDown: (evt) => {
      if (evt.which > 40 || evt.which < 37) {
        return
      }

      let td = evt.target.parentNode
      let table = td.parentNode.parentNode

      switch (evt.which) {
        //left
        case 37: {
          //previous td
          let previous = td.previousElementSibling

          if (previous && previous.querySelector('button')) {
            return previous.querySelector('button').focus()
          }

          //previous row, last button
          previous = td.parentNode.previousElementSibling
          previous = previous ? previous.querySelector('td:last-child button') : null

          if (previous) {
            return previous.focus()
          }

          //last tr first td
          let last = table.querySelector('tr:last-child').querySelectorAll('td.dpicker-active')
          return last[last.length - 1].querySelector('button').focus()
          break;
        }
        //right
        case 39: {
          let next = td.nextElementSibling

          if (next && next.querySelector('button')) {
            return next.querySelector('button').focus()
          }

          next = td.parentNode.nextElementSibling
          next = next ? next.querySelector('td:first-child button') : null

          if (next) {
            return next.focus()
          }

          return table.querySelector('tr:first-child').nextElementSibling.querySelectorAll('td.dpicker-active')[0].querySelector('button').focus()
          break;
        }
        //up
        case 38: {
          let position = positionInParent(td)
          //previous line (tr), element (td) at the same position
          let previous = td.parentNode.previousElementSibling
          previous = previous ? previous.children[position] : null

          if (previous && previous.classList.contains('dpicker-active')) {
            return previous.querySelector('button').focus()
          }

          //last line
          let last = table.querySelector('tr:last-child')

          //find the last available position with a button beggining by the bottom
          while(last) {
            if (last.children[position].classList.contains('dpicker-active')) {
              return last.children[position].querySelector('button').focus()
            }

            last = last.previousElementSibling
          }

          break;
        }
        //down
        case 40: {
          let position = positionInParent(td)
          //next line (tr), element (td) at the same position
          let next = td.parentNode.nextElementSibling
          next = next ? next.children[position] : null

          if (next && next.classList.contains('dpicker-active')) {
              return next.querySelector('button').focus()
          }

          //first line
          let first = table.querySelector('tr:first-child')

          //find the first available position with a button beggining by the top
          while(first) {
            if (first.children[position].classList.contains('dpicker-active')) {
              return first.children[position].querySelector('button').focus()
            }

            first = first.nextElementSibling
          }

          break;
        }
      }
    }
  }

  document.addEventListener('click', this._events.hide)

  let render = this.render(this._events, this._data, [
    this.renderYears(this._events, this._data),
    this.renderMonths(this._events, this._data),
    this.renderDays(this._events, this._data),
  ])

  if (element.tagName == 'INPUT') {
    this._projector.merge(element, this.renderInput(this._events, this._data))
    element.parentNode.setAttribute('id', this._container)
    element.parentNode.classList.add('dpicker')
    this._projector.append(element.parentNode, render)
    return this
  }

  this._projector.append(element, this.renderContainer(this._events, this._data, [
    this.renderInput(this._events, this._data),
    render
  ]))

  element.setAttribute('id', this._container)

  return this
}

/**
 * Render input
 */
DPicker.prototype.renderInput = injector(function renderInput(events, data, toRender) {
  return h('input#'+data.inputId, {
    value: data.isEmpty ? '' : data.model.format(data.format),
    type: 'text',
    onchange: events.inputChange,
    onfocus: events.inputFocus,
    name: data.inputName
  })
})

/**
 * Dpicker container if no input is provided
 * if an input is given, it's parentNode will be the container
 * div.dpicker
 */
DPicker.prototype.renderContainer = injector(function renderInput(events, data, toRender) {
  return h('div.dpicker', toRender.map(e => e()))
})

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
            type: 'button',
            onkeydown: events.dayKeyDown,
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
