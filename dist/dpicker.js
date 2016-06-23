
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
var projector = maquette.createProjector();

function noop() {}

var container = void 0;

var now = moment();

var _DPicker = {
  model: now.clone(),
  format: 'DD/MM/YYYY',
  display: false,
  futureYear: +now.format('YYYY') + 1,
  pastYear: 1986
};

/**
 * DPicker simple date picker
 * @param {Element} element DOM element where you want the date picker
 * @param {Object} options
 * @param {Moment} options.model Your own model instance, defaults to moment()
 * @param {Number} options.futureYear The latest year available (default to year + 1
 * @param {Number} options.pastYear The minimum year (default to 1986)
 * @param {string} options.format The input format, a moment format, default to DD/MM/YYYY
 */
function DPicker(element) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  for (var i in options) {
    if (i in _DPicker) {
      _DPicker[i] = options[i];
    }
  }

  // https://gist.github.com/jed/982883
  container = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (a) {
    return (a ^ Math.random() * 16 >> a / 4).toString(16);
  });

  document.addEventListener('click', hide);
  element.setAttribute('id', container);
  projector.append(element, this.render.bind(this));

  return this;
}

/**
 * Hides the date picker if user does not click inside the container
 * @param {Event} DOMEvent
 * @see DPicker
 */
function hide(evt) {
  var node = evt.target;
  var parent = node.parentNode;

  while (parent != document) {
    if (parent.getAttribute('id') == container) {
      return;
    }

    parent = parent.parentNode;
  }

  _DPicker.display = false;
  projector.scheduleRender();
}

/**
 * Hides the container if user clicks not in the container
 * @param {Object} DOMEvent
 * @see DPicker.render
 */
function inputChange(evt) {
  _DPicker.model = moment(evt.target.value, _DPicker.format);
}

/**
 * Show the container on input focus
 * @param {Object} DOMEvent
 * @see DPicker.render
 */
function inputFocus(evt) {
  _DPicker.display = true;
}

/**
 * On year change, update the model value
 * @param {Object} DOMEvent
 * @see DPicker.renderYear
 */
function yearChange(evt) {
  _DPicker.model.year(evt.target.options[evt.target.selectedIndex].value);
}

/**
 * On month change, update the model value
 * @param {Object} DOMEvent
 * @see DPicker.renderMonths
 */
function monthChange(evt) {
  _DPicker.model.month(evt.target.options[evt.target.selectedIndex].value);
}

/**
 * On day click, update the model value
 * @param {Object} DOMEvent
 * @see DPicker.renderDays
 */
function dayClick(evt) {
  _DPicker.model.date(evt.target.value);
}

/**
 * Render a DPicker
 * div.dpicker#uuid
 *   input[type=text]
 *   div.dpicker-[visible|invible]
 * @see DPicker.renderYears
 * @see DPicker.renderMonths
 * @see DPicker.renderDays
 */
DPicker.prototype.render = function () {
  return h('div.dpicker', [h('input', {
    value: _DPicker.model.format(_DPicker.format),
    type: 'text',
    onchange: inputChange,
    onfocus: inputFocus,
    name: 'dpicker-input' }), h('div', {
    classes: { 'dpicker-visible': _DPicker.display, 'dpicker-invisible': !_DPicker.display }
  }, [this.renderMonths(), this.renderYears(), this.renderDays()])]);
};

/**
 * Render Years
 * select[name='dpicker-year']
 */
DPicker.prototype.renderYears = function () {
  var modelYear = +_DPicker.model.format('YYYY');
  var futureYear = this.futureYear + 1;
  var options = [];

  while (--futureYear >= this.pastYear) {
    options.push(h('option', {
      value: futureYear,
      selected: futureYear === modelYear
    }, '' + futureYear));
  }

  return h('select', { onchange: yearChange, name: 'dpicker-year' }, [options]);
};

/**
 * Render Months
 * select[name='dpicker-month']
 */
DPicker.prototype.renderMonths = function () {
  var modelMonth = +_DPicker.model.format('MM');

  return h('select', {
    onchange: monthChange,
    name: 'dpicker-month'
  }, moment.monthsShort().map(function (e, i) {
    return h('option', {
      value: i, selected: i + 1 === modelMonth
    }, e);
  }));
};

/**
 * Render Days
 * select[name='dpicker-month']
 * table
 *  tr
 *    td
 *      button|span
 */
DPicker.prototype.renderDays = function () {
  var daysInMonth = _DPicker.model.daysInMonth();
  var daysInPreviousMonth = _DPicker.model.clone().subtract(1, 'months').daysInMonth();
  var firstDay = +_DPicker.model.clone().date(1).format('e') - 1;
  var currentDay = _DPicker.model.date();

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
        classes: { 'dpicker-active': dayActive, 'dpicker-inactive': !dayActive }
      }, [h(dayActive ? 'button' : 'span', {
        onclick: dayActive ? dayClick : noop,
        value: day,
        classes: { 'dpicker-active': currentDay == day }
      }, day)]);
    }));
  })]);
};

/**
 * DPicker.container getter
 */
Object.defineProperty(DPicker.prototype, 'container', {
  get: function get() {
    return container;
  }
});

var _loop = function _loop(i) {
  Object.defineProperty(DPicker.prototype, i, {
    get: function get() {
      return _DPicker[i];
    },
    set: function set(newValue) {
      _DPicker[i] = newValue;
      projector.scheduleRender();
    }
  });
};

for (var i in _DPicker) {
  _loop(i);
}
  return DPicker
}));