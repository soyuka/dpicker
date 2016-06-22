
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
var model = void 0;
var format = void 0;
var display = void 0;

/**
 * Hides the container if user clicks not in the container
 * @param {Event} DOMEvent
 * @see DPicker
 */
function hideContainer(evt) {
  var node = event.target;
  var parent = node.parentNode;

  while (parent != document) {
    if (parent.getAttribute('id') == container) {
      return;
    }

    parent = parent.parentNode;
  }

  display = false;
  projector.scheduleRender();
}

/**
 * Hides the container if user clicks not in the container
 * @param {Object} DOMEvent
 * @see DPicker.render
 */
function inputChange(evt) {
  model = moment(evt.target.value, format);
}

/**
 * Show the container on input focus
 * @param {Object} DOMEvent
 * @see DPicker.render
 */
function inputFocus(evt) {
  display = true;
}

/**
 * On year change, update the model value
 * @param {Object} DOMEvent
 * @see DPicker.renderYear
 */
function yearChange(evt) {
  model.year(evt.target.options[evt.target.selectedIndex].value);
}

/**
 * On month change, update the model value
 * @param {Object} DOMEvent
 * @see DPicker.renderMonths
 */
function monthChange(evt) {
  model.month(evt.target.options[evt.target.selectedIndex].value);
}

/**
 * On day click, update the model value
 * @param {Object} DOMEvent
 * @see DPicker.renderDays
 */
function dayClick(evt) {
  model.date(evt.target.value);
}

/**
 * DPicker simple date picker
 * @param {Element} element DOM element where you want the date picker
 * @param {Object} options
 * @param {Moment} options.model Your own model instance, defaults to moment()
 * @param {Number} options.futureYear The latest year available in the date picker
 * @param {Number} options.minYear The minimum year (default to 1986)
 * @param {string} options.format The input format, a moment format, default to DD/MM/YYYY
 */
function DPicker(element) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  model = options.model || moment();
  this.futureYear = options.futureYear || +moment().format('YYYY') + 2;
  this.minYear = options.minYear || 1986;
  format = this.format = options.format || 'DD/MM/YYYY';
  display = false;
  // https://gist.github.com/jed/982883
  this.container = container = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (a) {
    return (a ^ Math.random() * 16 >> a / 4).toString(16);
  });

  document.addEventListener('click', hideContainer);
  projector.append(element, this.render.bind(this));

  return this;
}

DPicker.prototype.render = function () {
  return h('div.dpicker#' + container, [h('input', { value: model.format(this.format), type: 'text', onchange: inputChange, onfocus: inputFocus, name: 'dpicker-input' }), h('div', { classes: { 'dpicker-visible': display, 'dpicker-invisible': !display } }, [this.renderYears(), this.renderMonths(), this.renderDays()])]);
};

DPicker.prototype.renderYears = function () {
  var modelYear = +model.format('YYYY');
  var futureYear = this.futureYear;
  var options = [];

  while (futureYear-- > this.minYear) {
    options.push(h('option', { value: futureYear, selected: futureYear === modelYear }, '' + futureYear));
  }

  return h('select', { onchange: yearChange, name: 'dpicker-year' }, [options]);
};

DPicker.prototype.renderMonths = function () {
  var modelMonth = +model.format('MM');

  return h('select', { onchange: monthChange, name: 'dpicker-month' }, moment.monthsShort().map(function (e, i) {
    return h('option', { value: i, selected: i + 1 === modelMonth }, e);
  }));
};

DPicker.prototype.renderDays = function () {
  var daysInMonth = model.daysInMonth();
  var daysInPreviousMonth = model.clone().month(-1).daysInMonth();
  var firstDay = +model.clone().date(1).format('e') - 1;
  var currentDay = model.date();

  var rows = new Array(Math.ceil((firstDay + daysInMonth) / 7)).fill(0);
  var day = void 0;
  var dayActive = void 0;

  return h('table', [
  //headers
  h('tr', moment.weekdaysShort().map(function (e) {
    return h('th', e);
  })),
  //rows
  rows.map(function (e, row) {
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

      return h('td', { classes: { 'dpicker-active': dayActive, 'dpicker-inactive': !dayActive } }, [h(dayActive ? 'button' : 'span', { onclick: dayActive ? dayClick : noop, value: day, classes: { 'dpicker-active': currentDay == day } }, day)]);
    }));
  })]);
};

DPicker.prototype.getModel = function () {
  return model;
};
  return DPicker
}));