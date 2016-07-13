
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define('DPicker', ['moment', 'maquette'], factory);
    } else if (typeof module === 'object' && module.exports) {
			  //node
        module.exports = factory(require('moment'), require('maquette'));
    } else {
        // Browser globals (root is window)
        root.DPicker = factory(root.moment, root.maquette);
    }
}(this, function (moment, maquette) {
  'use strict';

var h = maquette.h;

function noop() {}

/**
 * This is usefull to keep data inside the instance, without the need to
 * changing event function (see rule #1 of maquette.js http://maquettejs.org/docs/rules.html).
 * Injector shortcut to avoid doing this on every function...
 */
function injector(fn) {
  return function (events, data, toRender) {
    return function () {
      return fn(events, data, toRender);
    };
  };
}

// https://gist.github.com/jed/982883
function uuid() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (a) {
    return (a ^ Math.random() * 16 >> a / 4).toString(16);
  });
}

function positionInParent(children) {
  return [].findIndex.call(children.parentNode.children, function (c) {
    return c == children;
  });
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
function DPicker(element) {
  var _this = this;

  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];


  if (!(this instanceof DPicker)) {
    return new DPicker(element, options);
  }

  this._container = uuid();

  var now = options.model || moment();

  this._data = {
    model: now.clone(),
    format: options.format || 'DD/MM/YYYY',
    display: options.display || false,
    futureYear: options.futureYear || +now.format('YYYY') + 1,
    pastYear: options.pastYear || 1986,
    months: options.months || moment.months(),
    inputId: options.inputId || uuid(),
    inputName: options.name || 'dpicker-input',
    isEmpty: options.model !== undefined && !options.model ? true : false,
    onChange: options.onChange
  };

  this._projector = maquette.createProjector();

  this._events = {
    /**
     * Hides the date picker if user does not click inside the container
     * @param {Event} DOMEvent
     * @see DPicker
     */
    hide: function hide(evt) {
      if (_this._data.display == false) {
        return;
      }

      var node = evt.target;
      var parent = node.parentNode;

      while (parent && parent != document) {
        if (parent.getAttribute('id') == _this._container) {
          return;
        }

        parent = parent.parentNode;
      }

      _this._data.display = false;
      _this._projector.scheduleRender();
      _this._data.onChange && _this._data.onChange(_this._data, ['display']);
    },

    /**
     * Change model on input change
     * @param {Object} DOMEvent
     * @see DPicker.render
     */
    inputChange: function inputChange(evt) {
      if (!evt.target.value) {
        _this._data.isEmpty = true;
      } else {
        var newModel = moment(evt.target.value, _this._data.format);

        if (newModel.isValid()) {
          _this._data.model = newModel;
        }

        _this._data.isEmpty = false;
      }

      _this._data.onChange && _this._data.onChange(_this._data, ['model']);
    },

    /**
     * Show the container on input focus
     * @param {Object} DOMEvent
     * @see DPicker.render
     */
    inputFocus: function inputFocus(evt) {
      _this._data.display = true;
      _this._data.onChange && _this._data.onChange(_this._data, ['display']);
    },

    /**
     * On year change, update the model value
     * @param {Object} DOMEvent
     * @see DPicker.renderYear
     */
    yearChange: function yearChange(evt) {
      _this._data.isEmpty = false;
      _this._data.model.year(evt.target.options[evt.target.selectedIndex].value);
      _this._data.onChange && _this._data.onChange(_this._data, ['model']);
    },

    /**
     * On month change, update the model value
     * @param {Object} DOMEvent
     * @see DPicker.renderMonths
     */
    monthChange: function monthChange(evt) {
      _this._data.isEmpty = false;
      _this._data.model.month(evt.target.options[evt.target.selectedIndex].value);
      _this._data.onChange && _this._data.onChange(_this._data, ['model']);
    },

    /**
     * On day click, update the model value
     * @param {Object} DOMEvent
     * @see DPicker.renderDays
     */
    dayClick: function dayClick(evt) {
      evt.preventDefault();
      _this._data.model.date(evt.target.value);
      _this._data.isEmpty = false;
      _this._data.onChange && _this._data.onChange(_this._data, ['model']);
    },

    dayKeyDown: function dayKeyDown(evt) {
      var key = evt.which || evt.keyCode;
      if (key > 40 || key < 37) {
        return;
      }

      var td = evt.target.parentNode;
      var table = td.parentNode.parentNode;

      switch (key) {
        //left
        case 37:
          {
            //previous td
            var previous = td.previousElementSibling;

            if (previous && previous.querySelector('button')) {
              return previous.querySelector('button').focus();
            }

            //previous row, last button
            previous = td.parentNode.previousElementSibling;
            previous = previous ? previous.querySelector('td:last-child button') : null;

            if (previous) {
              return previous.focus();
            }

            //last tr first td
            var last = table.querySelector('tr:last-child').querySelectorAll('td.dpicker-active');
            return last[last.length - 1].querySelector('button').focus();
          }
        //right
        case 39:
          {
            var next = td.nextElementSibling;

            if (next && next.querySelector('button')) {
              return next.querySelector('button').focus();
            }

            next = td.parentNode.nextElementSibling;
            next = next ? next.querySelector('td:first-child button') : null;

            if (next) {
              return next.focus();
            }

            return table.querySelector('tr:first-child').nextElementSibling.querySelectorAll('td.dpicker-active')[0].querySelector('button').focus();
          }
        //up
        case 38:
          {
            var position = positionInParent(td);
            //previous line (tr), element (td) at the same position
            var _previous = td.parentNode.previousElementSibling;
            _previous = _previous ? _previous.children[position] : null;

            if (_previous && _previous.classList.contains('dpicker-active')) {
              return _previous.querySelector('button').focus();
            }

            //last line
            var _last = table.querySelector('tr:last-child');

            //find the last available position with a button beggining by the bottom
            while (_last) {
              if (_last.children[position].classList.contains('dpicker-active')) {
                return _last.children[position].querySelector('button').focus();
              }

              _last = _last.previousElementSibling;
            }
          }
        //down
        case 40:
          {
            var _position = positionInParent(td);
            //next line (tr), element (td) at the same position
            var _next = td.parentNode.nextElementSibling;
            _next = _next ? _next.children[_position] : null;

            if (_next && _next.classList.contains('dpicker-active')) {
              return _next.querySelector('button').focus();
            }

            //first line
            var first = table.querySelector('tr:first-child');

            //find the first available position with a button beggining by the top
            while (first) {
              if (first.children[_position].classList.contains('dpicker-active')) {
                return first.children[_position].querySelector('button').focus();
              }

              first = first.nextElementSibling;
            }
          }
      }
    }
  };

  document.addEventListener('click', this._events.hide);

  var render = this.render(this._events, this._data, [this.renderYears(this._events, this._data), this.renderMonths(this._events, this._data), this.renderDays(this._events, this._data)]);

  if (element.tagName == 'INPUT') {
    if (!element.parentNode) {
      throw new ReferenceError('Can not init DPicker on an input without parent node');
    }

    this._projector.merge(element, this.renderInput(this._events, this._data));
    element.parentNode.setAttribute('id', this._container);
    element.parentNode.classList.add('dpicker');
    this._projector.append(element.parentNode, render);
    return this;
  }

  this._projector.append(element, this.renderContainer(this._events, this._data, [this.renderInput(this._events, this._data), render]));

  element.setAttribute('id', this._container);

  return this;
}

/**
 * Render input
 */
DPicker.prototype.renderInput = injector(function renderInput(events, data, toRender) {
  return h('input#' + data.inputId, {
    value: data.isEmpty ? '' : data.model.format(data.format),
    type: 'text',
    onchange: events.inputChange,
    onfocus: events.inputFocus,
    name: data.inputName
  });
});

/**
 * Dpicker container if no input is provided
 * if an input is given, it's parentNode will be the container
 * div.dpicker
 */
DPicker.prototype.renderContainer = injector(function renderInput(events, data, toRender) {
  return h('div.dpicker', toRender.map(function (e) {
    return e();
  }));
});

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
  }, toRender.map(function (e) {
    return e();
  }));
});

/**
 * Render Years
 * select[name='dpicker-year']
 */
DPicker.prototype.renderYears = injector(function renderYears(events, data, toRender) {
  var modelYear = +data.model.format('YYYY');
  var futureYear = data.futureYear + 1;
  var options = [];

  while (--futureYear >= data.pastYear) {
    options.push(h('option', {
      value: futureYear,
      selected: futureYear === modelYear
    }, '' + futureYear));
  }

  return h('select', {
    onchange: events.yearChange,
    name: 'dpicker-year'
  }, options);
});

/**
 * Render Months
 * select[name='dpicker-month']
 */
DPicker.prototype.renderMonths = injector(function renderMonths(events, data, toRender) {
  var modelMonth = +data.model.format('MM');

  return h('select', {
    onchange: events.monthChange,
    name: 'dpicker-month'
  }, data.months.map(function (e, i) {
    return h('option', {
      value: i, selected: i + 1 === modelMonth
    }, e);
  }));
});

/**
 * Render Days
 * select[name='dpicker-month']
 * table
 *  tr
 *    td
 *      button|span
 */
DPicker.prototype.renderDays = injector(function renderDays(events, data, toRender) {
  var daysInMonth = data.model.daysInMonth();
  var daysInPreviousMonth = data.model.clone().subtract(1, 'months').daysInMonth();
  var firstDay = +data.model.clone().date(1).format('e') - 1;
  var currentDay = data.model.date();

  var rows = new Array(Math.ceil(.1 + (firstDay + daysInMonth) / 7)).fill(0);
  var day = void 0;
  var dayActive = void 0;

  return h('table', [
  //headers
  h('tr', moment.weekdaysShort().map(function (e) {
    return h('th', e);
  })),
  //rows
  rows.map(function (e, row) {
    //weeks filed with days
    return h('tr', { key: row }, new Array(7).fill(0).map(function (e, col) {

      if (col <= firstDay && row == 0) {
        day = daysInPreviousMonth - (firstDay - col);
        dayActive = false;
      } else if (col == firstDay + 1 && row == 0) {
        day = 1;
        dayActive = true;
      } else {
        if (day == daysInMonth) {
          day = 0;
          dayActive = false;
        }

        day++;
      }

      return h('td', {
        classes: {
          'dpicker-active': dayActive,
          'dpicker-inactive': !dayActive
        }
      }, [h(dayActive ? 'button' : 'span', {
        onclick: dayActive ? events.dayClick : noop,
        value: day,
        type: 'button',
        onkeydown: events.dayKeyDown,
        classes: { 'dpicker-active': currentDay == day }
      }, day)]);
    }));
  })]);
});

/**
 * DPicker.container getter
 */
Object.defineProperty(DPicker.prototype, 'container', {
  get: function get() {
    return this._container;
  }
});

/**
 * DPicker.inputId getter
 */
Object.defineProperty(DPicker.prototype, 'inputId', {
  get: function get() {
    return this._data.inputId;
  }
});['model', 'format', 'display', 'futureYear', 'pastYear', 'months', 'onChange'].forEach(function (e) {
  Object.defineProperty(DPicker.prototype, e, {
    get: function get() {
      return this._data[e];
    },
    set: function set(newValue) {
      if (e === 'model') {
        this._data.isEmpty = !!!newValue;
        this._data[e] = newValue ? newValue : this._data[e];
      } else {
        this._data[e] = newValue;
      }

      if (e != 'onChange') {
        this._projector.scheduleRender();
      }
    }
  });
});
  return DPicker
}));