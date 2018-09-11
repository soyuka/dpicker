(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.dpicker = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var morph = require('./lib/morph');
var TEXT_NODE = 3;
module.exports = nanomorph;
function nanomorph(oldTree, newTree) {
    var tree = walk(newTree, oldTree);
    return tree;
}
function walk(newNode, oldNode) {
    if (!oldNode) {
        return newNode;
    } else if (!newNode) {
        return null;
    } else if (newNode.isSameNode && newNode.isSameNode(oldNode)) {
        return oldNode;
    } else if (newNode.tagName !== oldNode.tagName) {
        return newNode;
    } else {
        morph(newNode, oldNode);
        updateChildren(newNode, oldNode);
        return oldNode;
    }
}
function updateChildren(newNode, oldNode) {
    var oldChild, newChild, morphed, oldMatch;
    var offset = 0;
    for (var i = 0;; i++) {
        oldChild = oldNode.childNodes[i];
        newChild = newNode.childNodes[i - offset];
        if (!oldChild && !newChild) {
            break;
        } else if (!newChild) {
            oldNode.removeChild(oldChild);
            i--;
        } else if (!oldChild) {
            oldNode.appendChild(newChild);
            offset++;
        } else if (same(newChild, oldChild)) {
            morphed = walk(newChild, oldChild);
            if (morphed !== oldChild) {
                oldNode.replaceChild(morphed, oldChild);
                offset++;
            }
        } else {
            oldMatch = null;
            for (var j = i; j < oldNode.childNodes.length; j++) {
                if (same(oldNode.childNodes[j], newChild)) {
                    oldMatch = oldNode.childNodes[j];
                    break;
                }
            }
            if (oldMatch) {
                morphed = walk(newChild, oldMatch);
                if (morphed !== oldMatch)
                    offset++;
                oldNode.insertBefore(morphed, oldChild);
            } else if (!newChild.id && !oldChild.id) {
                morphed = walk(newChild, oldChild);
                if (morphed !== oldChild) {
                    oldNode.replaceChild(morphed, oldChild);
                    offset++;
                }
            } else {
                oldNode.insertBefore(newChild, oldChild);
                offset++;
            }
        }
    }
}
function same(a, b) {
    if (a.id)
        return a.id === b.id;
    if (a.isSameNode)
        return a.isSameNode(b);
    if (a.tagName !== b.tagName)
        return false;
    if (a.type === TEXT_NODE)
        return a.nodeValue === b.nodeValue;
    return false;
}
},{"./lib/morph":3}],2:[function(require,module,exports){
module.exports = [
  // attribute events (can be set with attributes)
  'onclick',
  'ondblclick',
  'onmousedown',
  'onmouseup',
  'onmouseover',
  'onmousemove',
  'onmouseout',
  'onmouseenter',
  'onmouseleave',
  'ontouchcancel',
  'ontouchend',
  'ontouchmove',
  'ontouchstart',
  'ondragstart',
  'ondrag',
  'ondragenter',
  'ondragleave',
  'ondragover',
  'ondrop',
  'ondragend',
  'onkeydown',
  'onkeypress',
  'onkeyup',
  'onunload',
  'onabort',
  'onerror',
  'onresize',
  'onscroll',
  'onselect',
  'onchange',
  'onsubmit',
  'onreset',
  'onfocus',
  'onblur',
  'oninput',
  // other common events
  'oncontextmenu',
  'onfocusin',
  'onfocusout'
]

},{}],3:[function(require,module,exports){
var events = require('./events')
var eventsLength = events.length

var ELEMENT_NODE = 1
var TEXT_NODE = 3
var COMMENT_NODE = 8

module.exports = morph

// diff elements and apply the resulting patch to the old node
// (obj, obj) -> null
function morph (newNode, oldNode) {
  var nodeType = newNode.nodeType
  var nodeName = newNode.nodeName

  if (nodeType === ELEMENT_NODE) {
    copyAttrs(newNode, oldNode)
  }

  if (nodeType === TEXT_NODE || nodeType === COMMENT_NODE) {
    if (oldNode.nodeValue !== newNode.nodeValue) {
      oldNode.nodeValue = newNode.nodeValue
    }
  }

  // Some DOM nodes are weird
  // https://github.com/patrick-steele-idem/morphdom/blob/master/src/specialElHandlers.js
  if (nodeName === 'INPUT') updateInput(newNode, oldNode)
  else if (nodeName === 'OPTION') updateOption(newNode, oldNode)
  else if (nodeName === 'TEXTAREA') updateTextarea(newNode, oldNode)

  copyEvents(newNode, oldNode)
}

function copyAttrs (newNode, oldNode) {
  var oldAttrs = oldNode.attributes
  var newAttrs = newNode.attributes
  var attrNamespaceURI = null
  var attrValue = null
  var fromValue = null
  var attrName = null
  var attr = null

  for (var i = newAttrs.length - 1; i >= 0; --i) {
    attr = newAttrs[i]
    attrName = attr.name
    attrNamespaceURI = attr.namespaceURI
    attrValue = attr.value
    if (attrNamespaceURI) {
      attrName = attr.localName || attrName
      fromValue = oldNode.getAttributeNS(attrNamespaceURI, attrName)
      if (fromValue !== attrValue) {
        oldNode.setAttributeNS(attrNamespaceURI, attrName, attrValue)
      }
    } else {
      if (!oldNode.hasAttribute(attrName)) {
        oldNode.setAttribute(attrName, attrValue)
      } else {
        fromValue = oldNode.getAttribute(attrName)
        if (fromValue !== attrValue) {
          // apparently values are always cast to strings, ah well
          if (attrValue === 'null' || attrValue === 'undefined') {
            oldNode.removeAttribute(attrName)
          } else {
            oldNode.setAttribute(attrName, attrValue)
          }
        }
      }
    }
  }

  // Remove any extra attributes found on the original DOM element that
  // weren't found on the target element.
  for (var j = oldAttrs.length - 1; j >= 0; --j) {
    attr = oldAttrs[j]
    if (attr.specified !== false) {
      attrName = attr.name
      attrNamespaceURI = attr.namespaceURI

      if (attrNamespaceURI) {
        attrName = attr.localName || attrName
        if (!newNode.hasAttributeNS(attrNamespaceURI, attrName)) {
          oldNode.removeAttributeNS(attrNamespaceURI, attrName)
        }
      } else {
        if (!newNode.hasAttributeNS(null, attrName)) {
          oldNode.removeAttribute(attrName)
        }
      }
    }
  }
}

function copyEvents (newNode, oldNode) {
  for (var i = 0; i < eventsLength; i++) {
    var ev = events[i]
    if (newNode[ev]) {           // if new element has a whitelisted attribute
      oldNode[ev] = newNode[ev]  // update existing element
    } else if (oldNode[ev]) {    // if existing element has it and new one doesnt
      oldNode[ev] = undefined    // remove it from existing element
    }
  }
}

function updateOption (newNode, oldNode) {
  updateAttribute(newNode, oldNode, 'selected')
}

// The "value" attribute is special for the <input> element since it sets the
// initial value. Changing the "value" attribute without changing the "value"
// property will have no effect since it is only used to the set the initial
// value. Similar for the "checked" attribute, and "disabled".
function updateInput (newNode, oldNode) {
  var newValue = newNode.value
  var oldValue = oldNode.value

  updateAttribute(newNode, oldNode, 'checked')
  updateAttribute(newNode, oldNode, 'disabled')

  if (newValue !== oldValue) {
    oldNode.setAttribute('value', newValue)
    oldNode.value = newValue
  }

  if (newValue === 'null') {
    oldNode.value = ''
    oldNode.removeAttribute('value')
  }

  if (!newNode.hasAttributeNS(null, 'value')) {
    oldNode.removeAttribute('value')
  } else if (oldNode.type === 'range') {
    // this is so elements like slider move their UI thingy
    oldNode.value = newValue
  }
}

function updateTextarea (newNode, oldNode) {
  var newValue = newNode.value
  if (newValue !== oldNode.value) {
    oldNode.value = newValue
  }

  if (oldNode.firstChild && oldNode.firstChild.nodeValue !== newValue) {
    // Needed for IE. Apparently IE sets the placeholder as the
    // node value and vise versa. This ignores an empty update.
    if (newValue === '' && oldNode.firstChild.nodeValue === oldNode.placeholder) {
      return
    }

    oldNode.firstChild.nodeValue = newValue
  }
}

function updateAttribute (newNode, oldNode, name) {
  if (newNode[name] !== oldNode[name]) {
    oldNode[name] = newNode[name]
    if (newNode[name]) {
      oldNode.setAttribute(name, '')
    } else {
      oldNode.removeAttribute(name)
    }
  }
}

},{"./events":2}],4:[function(require,module,exports){
module.exports = function yoyoifyAppendChild (el, childs) {
  for (var i = 0; i < childs.length; i++) {
    var node = childs[i]
    if (Array.isArray(node)) {
      yoyoifyAppendChild(el, node)
      continue
    }
    if (typeof node === 'number' ||
      typeof node === 'boolean' ||
      node instanceof Date ||
      node instanceof RegExp) {
      node = node.toString()
    }
    if (typeof node === 'string') {
      if (/^[\n\r\s]+$/.test(node)) continue
      if (el.lastChild && el.lastChild.nodeName === '#text') {
        el.lastChild.nodeValue += node
        continue
      }
      node = document.createTextNode(node)
    }
    if (node && node.nodeType) {
      el.appendChild(node)
    }
  }
}

},{}],5:[function(require,module,exports){
module.exports = function yoyoifySetAttribute (el, attr, value) {
  if (typeof attr === 'object') {
    for (var i in attr) {
      if (attr.hasOwnProperty(i)) {
        yoyoifySetAttribute(el, i, attr[i])
      }
    }
    return
  }
  if (!attr) return
  if (attr === 'className') attr = 'class'
  if (attr === 'htmlFor') attr = 'for'
  if (attr.slice(0, 2) === 'on') {
    el[attr] = value
  } else {
    // assume a boolean attribute if the value === true
    // no need to do typeof because "false" would've caused an early return
    if (value === true) value = attr
    el.setAttribute(attr, value)
  }
}

},{}],6:[function(require,module,exports){
'use strict';

var moment = void 0;
try {
  moment = require('moment');
} catch (e) {
  moment = window.moment;
}

var DAY_TOKEN = 'd';
var YEAR_TOKEN = 'y';
var MONTH_TOKEN = 'M';
var HOURS_TOKEN = 'h';

/**
 * @module MomentAdapter
 */

/**
 * Get an immutable moment date
 * @param  {String} date
 * @param  {Boolean} immutable
 * @private
 * @return {Moment}
 */
function _getMoment(date, immutable) {
  if (immutable === undefined) {
    immutable = true;
  }

  if (moment.isMoment(date)) {
    return immutable === true ? date.clone() : date;
  }

  if (date instanceof Date) {
    return moment(date);
  }

  return null;
}

/**
* Get months, an array of string
* @return {Array<String>} List of the available months
*/
function months() {
  return moment.months();
}

/**
 * Get week days
 * @return {Array<String>}
 */
function weekdays() {
  return moment.weekdaysShort();
}

/**
 * First day of week according to locale
 * @return {Number}
 */
function firstDayOfWeek() {
  return moment.localeData().firstDayOfWeek();
}

/**
 * @param {Date} date
 * @return {Boolean}
 */
function isValid(date) {
  date = _getMoment(date, false);
  return moment.isMoment(date) && date.isValid();
}

/**
 * @param {String} dateString
 * @param {String} format
 * @return {Date|Boolean} false if invalid or the parsed date, parsing is heaving let's do this only once
 */
function isValidWithFormat(dateString, format) {
  if (Array.isArray(format)) {
    var date = false;

    for (var i = 0; i < format.length; i++) {
      var _testDate = moment(dateString, format[i], true);
      if (this.isValid(_testDate) === true) {
        date = _testDate.toDate();
        break;
      }
    }

    return date;
  }

  var testDate = moment(dateString, format, true);
  if (this.isValid(testDate) === true) {
    return testDate.toDate();
  }

  return false;
}

/**
 * Get year
 * @param {Date} date
 * @return {Number}
 */
function getYear(date) {
  return _getMoment(date, false).year();
}

/**
 * Get Month
 * @param {Date} date
 * @return {Number}
 */
function getMonth(date) {
  return _getMoment(date, false).month();
}

/**
 * Get Date
 * @param {Date} date
 * @return {Number}
 */
function getDate(date) {
  return _getMoment(date, false).date();
}

/**
 * Get Hours
 * @param {Date} date
 * @return {Number}
 */
function getHours(date) {
  return _getMoment(date, false).hours();
}

/**
 * Get Minutes
 * @param {Date} date
 * @return {Number}
 */
function getMinutes(date) {
  return _getMoment(date, false).minutes();
}

/**
 * Get Seconds
 * @param {Date} date
 * @return {Number}
 */
function getSeconds(date) {
  return _getMoment(date, false).seconds();
}

/**
 * Get Milliseconds
 * @param {Date} date
 * @return {Number}
 */
function getMilliseconds(date) {
  return _getMoment(date, false).milliseconds();
}

/**
 * Set Date
 * @param {Date} date
 * @param {Number} day
 * @return {Date}
 */
function setDate(date, day) {
  return _getMoment(date).date(day).toDate();
}

/**
 * Set Minutes
 * @param {Date} date
 * @param {Number} minutes
 * @return {Date}
 */
function setMinutes(date, minutes) {
  return _getMoment(date).minutes(minutes).toDate();
}

/**
 * Set Hours
 * @param {Date} date
 * @param {Number} hours
 * @return {Date}
 */
function setHours(date, hours) {
  return _getMoment(date).hours(hours).toDate();
}

/**
 * Set Month
 * @param {Date} date
 * @param {Number} month
 * @return {Date}
 */
function setMonth(date, month) {
  return _getMoment(date).month(month).toDate();
}

/**
 * Set Year
 * @param {Date} date
 * @param {Number} year
 * @return {Date}
 */
function setYear(date, year) {
  return _getMoment(date).year(year).toDate();
}

/**
 * Add Days
 * @param {Date} date
 * @param {Number} num days to add
 * @return {Date}
 */
function addDays(date, num) {
  return _getMoment(date).add(num, DAY_TOKEN).toDate();
}

/**
 * Add Months
 * @param {Date} date
 * @param {Number} num months to add
 * @return {Date}
 */
function addMonths(date, num) {
  return _getMoment(date).add(num, MONTH_TOKEN).toDate();
}

/**
 * Add Years
 * @param {Date} date
 * @param {Number} num years to add
 * @return {Date}
 */
function addYears(date, year) {
  return _getMoment(date).add(year, YEAR_TOKEN).toDate();
}

/**
 * Add Hours
 * @param {Date} date
 * @param {Number} num hours to add
 * @return {Date}
 */
function addHours(date, hours) {
  return _getMoment(date).add(hours, HOURS_TOKEN).toDate();
}

/**
 * Subtract days
 * @param {Date} date
 * @param {Number} num days to subtract
 * @return {Date}
 */
function subDays(date, num) {
  return _getMoment(date).subtract(num, DAY_TOKEN).toDate();
}

/**
 * Subtract months
 * @param {Date} date
 * @param {Number} num months to subtract
 * @return {Date}
 */
function subMonths(date, num) {
  return _getMoment(date).subtract(num, MONTH_TOKEN).toDate();
}

/**
 * Format a Date and return a string
 * @param {Date} date
 * @param {String} format
 * @return {String}
 */
function format(date, format) {
  if (Array.isArray(format)) {
    format = format[0];
  }
  return _getMoment(date, false).format(format);
}

/**
 * Get the number of days in the current date month
 * @param {Date} date
 * @return {Number}
 */
function daysInMonth(date) {
  return _getMoment(date, false).daysInMonth();
}

/**
 * Get number of the day in the week (from 0 to 6) for the given month on the first day
 * @param {Date} date
 * @returns {Number}
 */
function firstWeekDay(date) {
  return +_getMoment(date).date(1).format('e');
}

/**
 * Reset a date seconds
 * @param {Date} date
 * @returns {Date}
 */
function resetSeconds(date) {
  return _getMoment(date).seconds(0).milliseconds(0).toDate();
}

/**
 * Reset a date minutes
 * @param {Date} date
 * @returns {Date}
 */
function resetMinutes(date) {
  return _getMoment(this.resetSeconds(date)).minutes(0).toDate();
}

/**
 * Reset a date hours
 * @param {Date} date
 * @returns {Date}
 */
function resetHours(date) {
  return _getMoment(this.resetMinutes(date)).hours(0).toDate();
}

/**
 * isBefore
 * @param {Date} date
 * @param {Date} comparison
 * @return {Boolean}
 */
function isBefore(date, comparison) {
  return _getMoment(date, false).isBefore(comparison);
}

/**
 * isAfter
 * @param {Date} date
 * @param {Date} comparison
 * @return {Boolean}
 */
function isAfter(date, comparison) {
  return _getMoment(date, false).isAfter(comparison);
}

/**
 * isSameOrAfter (comparison must be done on a DAY basis)
 * @param {Date} date
 * @param {Date} comparison
 * @return {Boolean}
 */
function isSameOrAfter(date, comparison) {
  return _getMoment(date, false).isSameOrAfter(comparison, DAY_TOKEN);
}

/**
 * isSameOrBefore (comparison must be done on a DAY basis)
 * @param {Date} date
 * @param {Date} comparison
 * @return {Boolean}
 */
function isSameOrBefore(date, comparison) {
  return _getMoment(date, false).isSameOrBefore(comparison, DAY_TOKEN);
}

/**
 * isSameDay
 * @param {Date} date
 * @param {Date} comparison
 * @return {Boolean}
 */
function isSameDay(date, comparison) {
  return _getMoment(date, false).isSame(comparison, DAY_TOKEN);
}

/**
 * isSameHours
 * @param {Date} date
 * @param {Date} comparison
 * @return {Boolean}
 */
function isSameHours(date, comparison) {
  return _getMoment(date, false).isSame(comparison, HOURS_TOKEN);
}

/**
 * isSameMonth
 * @param {Date} date
 * @param {Date} comparison
 * @return {Boolean}
 */
function isSameMonth(date, comparison) {
  return _getMoment(date, false).isSame(comparison, MONTH_TOKEN);
}

/**
 * An uppercased meridiem (AM or PM)
 * @param {Date} date
 * @return {String}
 */
function getMeridiem(date) {
  return _getMoment(date, false).format('A');
}

module.exports = {
  _getMoment: _getMoment,
  months: months,
  weekdays: weekdays,
  firstDayOfWeek: firstDayOfWeek,
  isValid: isValid,
  isValidWithFormat: isValidWithFormat,
  getYear: getYear,
  getHours: getHours,
  getMonth: getMonth,
  getDate: getDate,
  getMinutes: getMinutes,
  getSeconds: getSeconds,
  getMilliseconds: getMilliseconds,
  setDate: setDate,
  setMinutes: setMinutes,
  setHours: setHours,
  setMonth: setMonth,
  setYear: setYear,
  addDays: addDays,
  addMonths: addMonths,
  addYears: addYears,
  addHours: addHours,
  subDays: subDays,
  subMonths: subMonths,
  format: format,
  daysInMonth: daysInMonth,
  firstWeekDay: firstWeekDay,
  resetSeconds: resetSeconds,
  resetMinutes: resetMinutes,
  resetHours: resetHours,
  isBefore: isBefore,
  isAfter: isAfter,
  isSameOrAfter: isSameOrAfter,
  isSameOrBefore: isSameOrBefore,
  isSameDay: isSameDay,
  isSameHours: isSameHours,
  isSameMonth: isSameMonth,
  getMeridiem: getMeridiem
};

},{"moment":"moment"}],7:[function(require,module,exports){
'use strict';

var DPicker = require('./dpicker.moment.js');
require('./plugins/time.js')(DPicker);
require('./plugins/modifiers.js')(DPicker);
require('./plugins/arrow-navigation.js')(DPicker);
require('./plugins/navigation.js')(DPicker);
require('./plugins/monthAndYear.js')(DPicker);

module.exports = DPicker;

},{"./dpicker.moment.js":9,"./plugins/arrow-navigation.js":10,"./plugins/modifiers.js":11,"./plugins/monthAndYear.js":12,"./plugins/navigation.js":13,"./plugins/time.js":14}],8:[function(require,module,exports){
'use strict';

var _appendChild = require('yo-yoify/lib/appendChild'),
    _setAttribute = require('yo-yoify/lib/setAttribute');

var nanomorph = require('nanomorph');


/**
 * DPicker
 *
 * @param {Element} element DOM element where you want the date picker or an input
 * @param {Object} [options={}]
 * @param {Date} [options.model=new Date()] Your own model instance, defaults to `new Date()` (can be set by the `value` attribute on an input, transformed to moment according to the given format)
 * @param {Date} [options.min=1986-01-01] The minimum date (can be set by the `min` attribute on an input)
 * @param {Date} [options.max=today+1 year] The maximum date (can be set by the `max` attribute on an input)
 * @param {String|Array} [options.format='DD/MM/YYYY'] The input format, a moment format (can be set by the `format` attribute on an input). If the aformat is an array, it'll enable multiple input formats. The first one will be the output format.
 * @param {String} [options.months=adapter.months()] Months array, see also [adapter.months()](todo)
 * @param {String} [options.days=adapter.weekdaysShort()] Days array, see also [adapter.weekdays()](todo)
 * @param {Boolean} [options.display=false] Initial calendar display state (not that when false it won't render the calendar)
 * @param {Boolean} [options.hideOnOutsideClick=true] On click outside of the date picker, hide the calendar
 * @param {Boolean} [options.hideOnDayClick=true] Hides the date picker on day click
 * @param {Boolean} [options.hideOnDayEnter=true] Hides the date picker when Enter or Escape is hit
 * @param {Boolean} [options.showCalendarOnInputFocus=true] Shows the calendar on input focus
 * @param {Boolean} [options.showCalendarButton=false] Adds a calendar button
 * @param {Boolean} [options.siblingMonthDayClick=false] Enable sibling months day click
 * @param {Function} [options.onChange] A function to call whenever the data gets updated
 * @param {String} [options.inputId=uuid()] The input id, useful to add you own label (can only be set in the initiation phase) If element is an inputand it has an `id` attribute it'll be overriden by it
 * @param {String} [options.inputName='dpicker-input'] The input name. If element is an inputand it has a `name` attribute it'll be overriden by it
 * @param {Array} [options.order] The dom elements appending order.
 * @param {Boolean} [options.time=false] Enable time (must include the time module)
 * @param {Boolean} [options.meridiem=false] 12/24 hour format, default 24
 * @param {Boolean} [options.disabled=false] Disable the input box
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
function DPicker(element) {
  var _this = this;

  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!(this instanceof DPicker)) {
    return new DPicker(element, options);
  }

  var _getContainer = this._getContainer(element),
      container = _getContainer.container,
      attributes = _getContainer.attributes,
      reference = _getContainer.reference;

  this._container = uuid();
  this.data = {};

  var defaults = {
    months: DPicker.dateAdapter.months(),
    days: DPicker.dateAdapter.weekdays(),
    empty: false,
    valid: true,
    order: ['months', 'years', 'time', 'days'],
    hideOnDayClick: true,
    hideOnEnter: true,
    hideOnOutsideClick: true,
    showCalendarOnInputFocus: true,
    showCalendarButton: false,
    disabled: false,
    siblingMonthDayClick: false,
    firstDayOfWeek: DPicker.dateAdapter.firstDayOfWeek()
  };

  for (var i in defaults) {
    if (options[i] !== undefined) {
      this.data[i] = options[i];
      continue;
    }

    this.data[i] = defaults[i];
  }

  this.data.inputName = attributes.name ? attributes.name : options.inputName ? options.inputName : 'dpicker-input';
  this.data.inputId = attributes.id ? attributes.id : options.inputId ? options.inputId : uuid();

  this._setData('format', [attributes.format, 'DD/MM/YYYY']);

  this.events = {};
  for (var _i in DPicker.events) {
    this.events[_i] = DPicker.events[_i].bind(this);
  }

  var methods = DPicker.properties;

  methods.min = new Date(1986, 0, 1);
  methods.max = DPicker.dateAdapter.setMonth(DPicker.dateAdapter.addYears(new Date(), 1), 11);
  methods.format = this.data.format;

  for (var _i2 in methods) {
    this._createGetSet(_i2);
    if (typeof methods[_i2] === 'function') {
      this._setData(_i2, [options[_i2], methods[_i2](attributes)]);
    } else {
      this._setData(_i2, [options[_i2], attributes[_i2], methods[_i2]], methods[_i2] instanceof Date);
    }
  }

  if (options.empty === true) {
    this.data.empty = true;
  }

  this._setData('model', [attributes.value, options.model, new Date()], true);

  this.onChange = options.onChange;

  document.addEventListener('click', this.events.hide);
  document.addEventListener('touchend', function (e) {
    if (!_this.data.hideOnOutsideClick) {
      return;
    }

    if (isElementInContainer(e.target, _this._container)) {
      return;
    }

    _this.events.inputBlur(e);
  });

  this.initialize();

  this._mount(container);
  this.isValid(this.data.model);

  container.id = this._container;
  container.addEventListener('keydown', this.events.keyDown);

  var input = container.querySelector('input');
  input.addEventListener('blur', this.events.inputBlur);

  if (reference) {
    var refAttributes = reference.attributes;
    for (var _i3 = 0; _i3 < refAttributes.length; _i3++) {
      if (!input.hasAttribute(refAttributes[_i3].name)) {
        input.setAttribute(refAttributes[_i3].name, refAttributes[_i3].value);
      }
    }

    if (reference.classList && reference.classList.length) {
      [].slice.call(reference.classList).forEach(function (val) {
        if (!input.classList.contains(val)) {
          input.classList.add(val);
        }
      });
    }
  }

  return this;
}

/**
 * _setData is a helper to set this.data values
 * @param {String} key
 * @param {Array} values the first value that is not undefined will be set in this.data[key]
 * @param {Boolean} isDate whether this value should be a date instance
 * @private
 */
DPicker.prototype._setData = function (key, values) {
  var isDate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  for (var i = 0; i < values.length; i++) {
    if (values[i] === undefined || values[i] === '') {
      continue;
    }

    if (isDate === false) {
      this.data[key] = values[i];
      break;
    }

    if (DPicker.dateAdapter.isValid(values[i])) {
      this.data[key] = values[i];
      break;
    }

    this.data[key] = new Date();

    var temp = DPicker.dateAdapter.isValidWithFormat(values[i], this.data.format);

    if (temp !== false) {
      this.data[key] = temp;
      break;
    }
  }
};

/**
 * Creates getters and setters for a given key
 * When the setter is called we will redraw
 * @param {String} key
 * @private
 */
DPicker.prototype._createGetSet = function (key) {
  if (DPicker.prototype.hasOwnProperty(key)) {
    return;
  }

  Object.defineProperty(DPicker.prototype, key, {
    get: function get() {
      return this.data[key];
    },
    set: function set(newValue) {
      this.data[key] = newValue;
      this.isValid(this.data.model);
      this.redraw();
    }
  });
};

/**
 * Gives the dpicker container and it's attributes
 * If the container is an input, the parentNode is the container but the attributes are the input's ones
 * @param {Element} container
 * @private
 * @return {Object} { container, attributes }
 */
DPicker.prototype._getContainer = function (container) {
  if (!container) {
    throw new ReferenceError('Can not initialize DPicker without a container');
  }

  var attributes = {};[].slice.call(container.attributes).forEach(function (attribute) {
    attributes[attribute.name] = attribute.value;
  });

  // small jquery fix: new DPicker($('<input type="datetime" name="mydatetime" autocomplete="off" step="30">'))
  if (container.length !== undefined && container[0]) {
    container = container[0];
  }

  var reference = null;

  if (container.tagName === 'INPUT') {
    if (!container.parentNode) {
      throw new ReferenceError('Can not initialize DPicker on an input without parent node');
    }

    var parentNode = container.parentNode;
    reference = container;
    container.parentNode.removeChild(reference);
    container = parentNode;
    container.classList.add('dpicker');
  }

  return { container: container, attributes: attributes, reference: reference };
};

/**
 * Allows to render more child elements with modules
 * @private
 * @return Array<VNode>
 */
DPicker.prototype._getRenderChild = function () {
  if (!this.data.display) {
    return '';
  }

  var children = {
    years: this.renderYears(this.events, this.data),
    months: this.renderMonths(this.events, this.data)

    // add module render functions
  };for (var render in DPicker.renders) {
    children[render] = DPicker.renders[render].call(this, this.events, this.data);
  }

  children.days = this.renderDays(this.events, this.data);

  return this.data.order.filter(function (e) {
    return children[e];
  }).map(function (e) {
    return children[e];
  });
};

/**
 * Mount rendered element to the DOM
 * @private
 */
DPicker.prototype._mount = function (element) {
  this._tree = this.getTree();
  element.appendChild(this._tree);
};

/**
 * Return the whole nodes tree
 * @return {Element}
 */
DPicker.prototype.getTree = function () {
  return this.renderContainer(this.events, this.data, [this.renderInput(this.events, this.data), this.renderCalendar(this.events, this.data), this.render(this.events, this.data, this._getRenderChild())]);
};

/**
 * Checks whether the given model is a valid moment instance
 * This method does set the `.valid` flag by checking min/max allowed inputs
 * Note that it will return `true` if the model is valid even if it's not in the allowed range
 * @param {Date} date
 * @return {boolean}
 */
DPicker.prototype.isValid = function checkValidity(date) {
  if (DPicker.dateAdapter.isValid(date) === false) {
    this.data.valid = false;
    return false;
  }

  var isSame = void 0;
  var temp = void 0;

  if (this.data.time === false) {
    temp = DPicker.dateAdapter.resetHours(date);
    isSame = DPicker.dateAdapter.isSameDay(temp, this.data.min) || DPicker.dateAdapter.isSameDay(temp, this.data.max);
  } else {
    temp = DPicker.dateAdapter.resetSeconds(date);
    isSame = DPicker.dateAdapter.isSameHours(temp, this.data.min) || DPicker.dateAdapter.isSameHours(temp, this.data.max);
  }

  if (isSame === false && (DPicker.dateAdapter.isBefore(temp, this.data.min) || DPicker.dateAdapter.isAfter(temp, this.data.max))) {
    this.data.valid = false;
    return true;
  }

  this.data.valid = true;
  return true;
};

/**
 * Render input
 * @fires DPicker#inputChange
 * @fires DPicker#inputBlur
 * @fires DPicker#inputFocus
 * @return {Element} the rendered virtual dom hierarchy
 */
DPicker.prototype.renderInput = function (events, data, toRender) {
  var _;

  return _ = document.createElement('input'), _.setAttribute('id', '' + String(data.inputId) + ''), _.setAttribute('value', '' + String(data.empty === true ? '' : DPicker.dateAdapter.format(data.model, data.format)) + ''), _.setAttribute('type', 'text'), _.setAttribute('min', '' + String(data.min) + ''), _.setAttribute('max', '' + String(data.max) + ''), _.setAttribute('format', '' + String(data.format) + ''), _.onchange = events.inputChange, _.onfocus = events.inputFocus, _.setAttribute('name', '' + String(data.inputName) + ''), _.setAttribute('autocomplete', 'off'), _.setAttribute('aria-invalid', '' + String(data.valid) + ''), _.setAttribute('aria-haspopup', 'aria-haspopup'), data.disabled && _.setAttribute('disabled', 'disabled'), _.setAttribute('class', '' + String(data.valid === false ? 'dpicker-invalid' : '') + ''), _;
};

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
  var _dpicker;

  return _dpicker = document.createElement('div'), _dpicker.setAttribute('class', 'dpicker'), _appendChild(_dpicker, [toRender]), _dpicker;
};

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
  var _div;

  return _div = document.createElement('div'), _div.setAttribute('aria-hidden', '' + String(data.display === false) + ''), _div.setAttribute('class', 'dpicker-container ' + String(data.display === true ? 'dpicker-visible' : 'dpicker-invisible') + ' ' + String(data.time === true ? 'dpicker-has-time' : '') + ''), _appendChild(_div, [' ', toRender, ' ']), _div;
};

/**
 * Render Years
 * ```
 * select[name='dpicker-year']
 * ```
 * @fires DPicker#yearChange
 * @return {Element} the rendered virtual dom hierarchy
 */
DPicker.prototype.renderYears = function (events, data, toRender) {
  var _select;

  var modelYear = DPicker.dateAdapter.getYear(data.model);
  var futureYear = DPicker.dateAdapter.getYear(data.max) + 1;
  var pastYear = DPicker.dateAdapter.getYear(data.min);
  var options = [];

  while (--futureYear >= pastYear) {
    var _option;

    options.push((_option = document.createElement('option'), _option.setAttribute('value', '' + String(futureYear) + ''), _setAttribute(_option, futureYear === modelYear ? 'selected' : '', futureYear === modelYear ? 'selected' : ''), _appendChild(_option, [futureYear]), _option));
  }

  return _select = document.createElement('select'), _select.onchange = events.yearChange, _select.setAttribute('name', 'dpicker-year'), _select.setAttribute('aria-label', 'Year'), _appendChild(_select, [options]), _select;
};

/**
 * Render Months
 * ```
 * select[name='dpicker-month']
 * ```
 * @fires DPicker#monthChange
 * @return {Element} the rendered virtual dom hierarchy
 */
DPicker.prototype.renderMonths = function (events, data, toRender) {
  var _select2;

  var modelMonth = DPicker.dateAdapter.getMonth(data.model);
  var currentYear = DPicker.dateAdapter.getYear(data.model);
  var months = data.months;
  var showMonths = data.months.map(function (e, i) {
    return i;
  });

  if (DPicker.dateAdapter.getYear(data.max) === currentYear) {
    var maxMonth = DPicker.dateAdapter.getMonth(data.max);
    showMonths = showMonths.filter(function (e) {
      return e <= maxMonth;
    });
  }

  if (DPicker.dateAdapter.getYear(data.min) === currentYear) {
    var minMonth = DPicker.dateAdapter.getMonth(data.min);
    showMonths = showMonths.filter(function (e) {
      return e >= minMonth;
    });
  }

  return _select2 = document.createElement('select'), _select2.onchange = events.monthChange, _select2.setAttribute('name', 'dpicker-month'), _select2.setAttribute('aria-label', 'Month'), _appendChild(_select2, [' ', showMonths.map(function (e, i) {
    var _option2;

    return _option2 = document.createElement('option'), _setAttribute(_option2, e === modelMonth ? 'selected' : '', e === modelMonth ? 'selected' : ''), _option2.setAttribute('value', '' + String(e) + ''), _appendChild(_option2, [months[e]]), _option2;
  }), ' ']), _select2;
};

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
  var _tr, _table;

  var daysInMonth = DPicker.dateAdapter.daysInMonth(data.model);
  var daysInPreviousMonth = DPicker.dateAdapter.daysInMonth(DPicker.dateAdapter.subMonths(data.model, 1));
  var firstLocaleDay = data.firstDayOfWeek;
  var firstDay = DPicker.dateAdapter.firstWeekDay(data.model) - 1;
  var currentDay = DPicker.dateAdapter.getDate(data.model);
  var currentMonth = DPicker.dateAdapter.getMonth(data.model);
  var currentYear = DPicker.dateAdapter.getYear(data.model);

  var days = new Array(7);

  data.days.map(function (e, i) {
    days[i < firstLocaleDay ? 6 - i : i - firstLocaleDay] = e;
  });

  var rows = new Array(Math.ceil(0.1 + (firstDay + daysInMonth) / 7)).fill(0);
  var day = void 0;
  var dayActive = void 0;
  var previousMonth = false;
  var nextMonth = false;
  var loopend = true;
  var classActive = '';

  return _table = document.createElement('table'), _appendChild(_table, [' ', (_tr = document.createElement('tr'), _appendChild(_tr, [days.map(function (e) {
    var _th;

    return _th = document.createElement('th'), _appendChild(_th, [e]), _th;
  })]), _tr), ' ', rows.map(function (e, row) {
    var _tr2;

    return _tr2 = document.createElement('tr'), _appendChild(_tr2, [new Array(7).fill(0).map(function (e, col) {
      var _2, _td, _3;

      dayActive = loopend;
      classActive = '';

      if (col <= firstDay && row === 0) {
        day = daysInPreviousMonth - (firstDay - col);
        dayActive = false;
        previousMonth = true;
      } else if (col === firstDay + 1 && row === 0) {
        previousMonth = false;
        day = 1;
        dayActive = true;
      } else {
        if (day === daysInMonth) {
          day = 0;
          dayActive = false;
          loopend = false;
          nextMonth = true;
        }

        day++;
      }

      var dayMonth = previousMonth ? currentMonth : nextMonth ? currentMonth + 2 : currentMonth + 1;
      var currentDayModel = new Date(currentYear, dayMonth - 1, day);

      if (dayActive === false && data.siblingMonthDayClick === true) {
        dayActive = true;
      }

      if (data.min && dayActive) {
        dayActive = DPicker.dateAdapter.isSameOrAfter(currentDayModel, data.min);
      }

      if (data.max && dayActive) {
        dayActive = DPicker.dateAdapter.isSameOrBefore(currentDayModel, data.max);
      }

      if (dayActive === true && previousMonth === false && nextMonth === false && currentDay === day) {
        classActive = 'dpicker-active';
      }

      var button = (_2 = document.createElement('button'), _2.setAttribute('value', '' + String(day) + ''), _2.setAttribute('aria-label', 'Day ' + String(day) + ''), _2.setAttribute('aria-disabled', '' + String(dayActive) + ''), _2.onclick = previousMonth === false && nextMonth === false ? events.dayClick : previousMonth === true ? events.previousMonthDayClick : events.nextMonthDayClick, _2.setAttribute('type', 'button'), _2.onkeydown = events.dayKeyDown, _2.setAttribute('class', '' + String(classActive) + ''), _appendChild(_2, [day]), _2);

      return _td = document.createElement('td'), _td.setAttribute('class', '' + String(dayActive === true ? 'dpicker-active' : 'dpicker-inactive') + ''), _appendChild(_td, [' ', dayActive === true ? button : (_3 = document.createElement('span'), _3.setAttribute('class', '' + String(classActive) + ''), _appendChild(_3, [day]), _3), ' ']), _td;
    })]), _tr2;
  }), ' ']), _table;
};

/**
* Outputs a calendar button
* @param {DPicker.events} events
* @param {DPicker.data} data
* @param {Array} toRender
* @fires DPicker#toggleCalendar
*
* @return {Element}
*/
DPicker.prototype.renderCalendar = function renderCalendar(events, data) {
  var _dpickerButtonCalendar;

  if (!data.showCalendarButton) return '';
  return _dpickerButtonCalendar = document.createElement('button'), _dpickerButtonCalendar.setAttribute('tabindex', '-1'), _dpickerButtonCalendar.onclick = events.toggleCalendar, _dpickerButtonCalendar.setAttribute('name', 'dpicker-button-calendar'), _dpickerButtonCalendar.setAttribute('class', 'dpicker-button-calendar'), _dpickerButtonCalendar;
};

/**
 * Called after parseInputAttributes but before render
 * Decorate it with modules to do things on initialization
 */
DPicker.prototype.initialize = function () {
  this.isValid(this.data.model);
};

/**
 * The model setter, feel free to decorate through modules
 * @param {Date} newValue
 */
DPicker.prototype.modelSetter = function (newValue) {
  this.data.empty = !newValue;

  if (this.isValid(newValue) === true) {
    this.data.model = newValue;
  }

  this.redraw();
};

/**
 * Redraws the date picker
 * Decorate it with modules to do things before redraw
 */
DPicker.prototype.redraw = function () {
  var _this2 = this;

  window.requestAnimationFrame(function () {
    _this2._tree = nanomorph(_this2._tree, _this2.getTree());
  });
};

Object.defineProperties(DPicker.prototype, {
  'container': {
    get: function get() {
      return this._container;
    }
  },
  'inputId': {
    get: function get() {
      return this.data.inputId;
    }
  },
  'input': {
    get: function get() {
      if (this.data.empty) {
        return '';
      }

      return DPicker.dateAdapter.format(this.data.model, this.data.format);
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
    set: function set(onChange) {
      var _this3 = this;

      this._onChange = function (dpickerEvent) {
        return !onChange ? false : onChange(_this3.data, dpickerEvent);
      };
    },
    get: function get() {
      return this._onChange;
    }
  },

  'valid': {
    get: function get() {
      return this.data.valid;
    }
  },

  'empty': {
    get: function get() {
      return this.data.empty;
    }
  },

  'model': {
    set: function set(newValue) {
      this.modelSetter(newValue);
    },
    get: function get() {
      return this.data.model;
    }
  }
});

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
  return function decorator() {
    if (decoration.apply(this, arguments) === false) {
      return false;
    }

    return origin.apply(this, arguments);
  };
};

DPicker.events = {
  /**
    * Hides the date picker if user does not click inside the container
    * @event DPicker#hide
    */
  hide: function hide(evt) {
    if (this.data.hideOnOutsideClick === false || this.display === false) {
      return;
    }

    var node = evt.target;

    if (isElementInContainer(node.parentNode, this._container)) {
      return;
    }

    this.display = false;
    this.onChange({ modelChanged: false, name: 'hide', event: evt });
  },

  /**
    * Change model on input change
    * @event DPicker#inputChange
    */
  inputChange: function inputChange(evt) {
    if (!evt.target.value) {
      this.data.empty = true;
    } else {
      var newModel = DPicker.dateAdapter.isValidWithFormat(evt.target.value, this.data.format);

      if (newModel !== false) {
        if (this.isValid(newModel) === true) {
          this.data.model = newModel;
        }
      }

      this.data.empty = false;
    }

    this.redraw();
    this.onChange({ modelChanged: true, name: 'inputChange', event: evt });
  },

  /**
    * Hide on input blur
    * @event DPicker#inputBlur
    */
  inputBlur: function inputBlur(evt) {
    if (this.display === false) {
      return;
    }

    var node = evt.relatedTarget || evt.target;

    if (isElementInContainer(node.parentNode, this._container)) {
      return;
    }

    this.display = false;
    this.onChange({ modelChanged: false, name: 'inputBlur', event: evt });
  },

  /**
    * Show the container on input focus
    * @event DPicker#inputFocus
    */
  inputFocus: function inputFocus(evt) {
    if (this.data.showCalendarOnInputFocus === false) {
      return;
    }

    this.display = true;
    if (evt.target && evt.target.select) {
      evt.target.select();
    }

    this.onChange({ modelChanged: false, name: 'inputFocus', event: evt });
  },

  /**
    * On year change, update the model value
    * @event DPicker#yearChange
    */
  yearChange: function yearChange(evt) {
    this.data.empty = false;
    this.model = DPicker.dateAdapter.setYear(this.data.model, evt.target.options[evt.target.selectedIndex].value);

    if (DPicker.dateAdapter.isAfter(this.model, this.data.max)) {
      this.model = DPicker.dateAdapter.setMonth(this.data.model, DPicker.dateAdapter.getMonth(this.data.max));
    } else if (DPicker.dateAdapter.isBefore(this.model, this.data.min)) {
      this.model = DPicker.dateAdapter.setMonth(this.data.model, DPicker.dateAdapter.getMonth(this.data.min));
    }

    this.redraw();
    this.onChange({ modelChanged: true, name: 'yearChange', event: evt });
  },

  /**
    * On month change, update the model value
    * @event DPicker#monthChange
    */
  monthChange: function monthChange(evt) {
    this.data.empty = false;
    this.model = DPicker.dateAdapter.setMonth(this.data.model, evt.target.options[evt.target.selectedIndex].value);

    this.redraw();
    this.onChange({ modelChanged: true, name: 'monthChange', event: evt });
  },

  /**
    * On day click, update the model value
    * @event DPicker#dayClick
    */
  dayClick: function dayClick(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.model = DPicker.dateAdapter.setDate(this.data.model, evt.target.value);
    this.data.empty = false;

    if (this.data.hideOnDayClick) {
      this.display = false;
    }

    this.redraw();
    this.onChange({ modelChanged: true, name: 'dayClick', event: evt });
  },

  /**
    * On previous month day click (only if `siblingMonthDayClick` is enabled)
    * @event DPicker#previousMonthDayClick
    */
  previousMonthDayClick: function previousMonthDayClick(evt) {
    if (!this.data.siblingMonthDayClick) {
      return;
    }

    evt.preventDefault();
    evt.stopPropagation();

    this.model = DPicker.dateAdapter.setDate(DPicker.dateAdapter.subMonths(this.data.model, 1), evt.target.value);

    this.data.empty = false;

    if (this.data.hideOnDayClick) {
      this.display = false;
    }

    this.redraw();
    this.onChange({ modelChanged: true, name: 'previousMonthDayClick', event: evt });
  },

  /**
    * On next month day click (only if `siblingMonthDayClick` is enabled)
    * @event DPicker#nextMonthDayClick
    */
  nextMonthDayClick: function nextMonthDayClick(evt) {
    if (!this.data.siblingMonthDayClick) {
      return;
    }

    evt.preventDefault();
    evt.stopPropagation();

    this.model = DPicker.dateAdapter.setDate(DPicker.dateAdapter.addMonths(this.data.model, 1), evt.target.value);

    this.data.empty = false;

    if (this.data.hideOnDayClick) {
      this.display = false;
    }

    this.redraw();
    this.onChange({ modelChanged: true, name: 'nextMonthDayClick', event: evt });
  },

  /**
    * On day key down - not implemented
    * @event DPicker#dayKeyDown
    */
  dayKeyDown: function dayKeyDown() {},

  /**
   * On key down inside the dpicker container,
   * intercept enter and escape keys to hide the container
   * @event DPicker#keyDown
   */
  keyDown: function keyDown(evt) {
    if (!this.data.hideOnEnter) {
      return;
    }

    var key = evt.which || evt.keyCode;

    if (key !== 13 && key !== 27) {
      return;
    }

    document.getElementById(this.inputId).blur();
    this.display = false;
    this.onChange({ modelChanged: false, name: 'keyDown', event: evt });
  },

  /**
  * Show calendar
  * @event Dpicker#showCalendar
  */
  toggleCalendar: function showCalendar(evt) {
    this.display = !this.display;
    this.onChange({ modelChanged: false, name: 'toggleCalendar', event: evt });
  }

  /**
   * @property {Object} renders Renders dictionnary
   */
};DPicker.renders = {};

/**
 * @property {Object} properties Properties dictionnary (getters and setters will be set)
 */
DPicker.properties = { display: false, disabled: false

  /**
   * @property {DateAdapter} dateAdapter The date adapter
   * @see {@link /_api?id=module_momentadapter|MomentDateAdapter}
   */
};DPicker.dateAdapter = undefined;

/**
 * uuid generator
 * https://gist.github.com/jed/982883
 * @private
 */
function uuid() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (a) {
    return (a ^ Math.random() * 16 >> a / 4).toString(16);
  });
}

/**
 * isElementInContainer tests if an element is inside a given id
 * @param {Element} parent a DOM node
 * @param {String} containerId the container id
 * @private
 * @return {Boolean}
 */
function isElementInContainer(parent, containerId) {
  while (parent && parent !== document) {
    if (parent.getAttribute('id') === containerId) {
      return true;
    }

    parent = parent.parentNode;
  }

  return false;
}

module.exports = DPicker;

},{"nanomorph":1,"yo-yoify/lib/appendChild":4,"yo-yoify/lib/setAttribute":5}],9:[function(require,module,exports){
'use strict';

var MomentDateAdapter = require('./adapters/moment.js');
var DPicker = require('./dpicker');

DPicker.dateAdapter = MomentDateAdapter;

module.exports = DPicker;

},{"./adapters/moment.js":6,"./dpicker":8}],10:[function(require,module,exports){
'use strict';

module.exports = function (DPicker) {
  /**
  * Get element position in parent
  * @param {Element} children
  * @return {Number}
  * @private
  */
  function positionInParent(children) {
    return [].indexOf.call(children.parentNode.children, children);
  }

  /**
  * Move left
  * @param {Element} td
  * @param {Element} table
  * @private
  */
  function left(td, table) {
    // previous td
    var previous = td.previousElementSibling;

    if (previous && previous.querySelector('button')) {
      previous.querySelector('button').focus();
      return;
    }

    // previous row, last button
    previous = td.parentNode.previousElementSibling;
    previous = previous ? previous.querySelector('td:last-child button') : null;

    if (previous) {
      return previous.focus();
    }

    // last tr first td
    var last = table.querySelector('tr:last-child').querySelectorAll('td.dpicker-active');
    last[last.length - 1].querySelector('button').focus();
  }

  /**
  * Move right
  * @param {Element} td
  * @param {Element} table
  * @private
  */
  function right(td, table) {
    var next = td.nextElementSibling;

    if (next && next.querySelector('button')) {
      next.querySelector('button').focus();
      return;
    }

    next = td.parentNode.nextElementSibling;
    next = next ? next.querySelector('td:first-child button') : null;

    if (next) {
      return next.focus();
    }

    table.querySelector('tr:first-child').nextElementSibling.querySelectorAll('td.dpicker-active')[0].querySelector('button').focus();
  }

  /**
  * Go up or down
  * @param {Element} td
  * @param {Element} table
  * @param {String} direction up or down
  * @private
  */
  function upOrDown(td, table, direction) {
    var position = positionInParent(td);
    var sibling = (direction === 'up' ? 'previous' : 'next') + 'ElementSibling';
    // previous line (tr), element (td) at the same position
    var previousOrNext = td.parentNode[sibling];
    previousOrNext = previousOrNext ? previousOrNext.children[position] : null;

    if (previousOrNext && previousOrNext.classList.contains('dpicker-active')) {
      previousOrNext.querySelector('button').focus();
      return;
    }

    // last or first line
    var lastOrFirst = table.querySelector('tr:' + (direction === 'up' ? 'last-child' : 'first-child'));

    // find the last available position with a button beggining by the bottom
    while (lastOrFirst) {
      if (lastOrFirst.children[position].classList.contains('dpicker-active')) {
        lastOrFirst.children[position].querySelector('button').focus();
        return;
      }

      lastOrFirst = lastOrFirst[sibling];
    }
  }

  /**
  * Go up
  * @param {Element} td
  * @param {Element} table
  * @private
  */
  function up(td, table) {
    return upOrDown(td, table, 'up');
  }

  /**
  * Go down
  * @param {Element} td
  * @param {Element} table
  * @private
  */
  function down(td, table) {
    return upOrDown(td, table, 'down');
  }

  /**
  * Enables arrow navigation inside days
  * @event DPicker#dayKeyDown
  */
  DPicker.events.dayKeyDown = DPicker.decorate(DPicker.events.dayKeyDown, function DayKeyDown(evt) {
    var key = evt.which || evt.keyCode;
    if (key > 40 || key < 37) {
      return;
    }

    evt.preventDefault();

    var td = evt.target.parentNode;
    var table = td.parentNode.parentNode;

    switch (key) {
      // left
      case 37:
        {
          return left(td, table);
        }
      // right
      case 39:
        {
          return right(td, table);
        }
      // up
      case 38:
        {
          return up(td, table);
        }
      // down
      case 40:
        {
          return down(td, table);
        }
    }
  });

  return DPicker;
};

},{}],11:[function(require,module,exports){
'use strict';

module.exports = function (DPicker) {
  /**
  * Enables modifiers on `+[num]` and `-[num]` where:
  * - `+` gives the current date
  * - `+10` gives the current date + 10 days
  * - `-` gives the previous date
  * - `-10` gives the previous date - 10 days
  * @param {Event} DOMEvent
  * @listens DPicker#inputChange
  */
  DPicker.events.inputChange = DPicker.decorate(DPicker.events.inputChange, function ModifierInputChange(evt) {
    var first = evt.target.value.charAt(0);
    var x = evt.target.value.slice(1) || 0;

    if (first !== '-' && first !== '+') {
      return;
    }

    if (first === '-') {
      if (!x) {
        x = 1;
      }
      x = -x;
    }

    if (x < 0) {
      this.model = DPicker.dateAdapter.subDays(new Date(), -x);
    } else {
      this.model = DPicker.dateAdapter.addDays(new Date(), x);
    }

    this.onChange({ modelChanged: true, name: 'inputChange', event: evt });
  });
};

},{}],12:[function(require,module,exports){
'use strict';

var _appendChild = require('yo-yoify/lib/appendChild'),
    _setAttribute = require('yo-yoify/lib/setAttribute');

module.exports = function (DPicker) {
  /**
    * Renders concated months and Years
    * @param {DPicker.events} events
    * @param {DPicker.data} data
    * @param {Array} toRender
    * @fires DPicker#monthYearChange
    *
    * @return {Element}
    */
  DPicker.renders.monthsAndYears = function rendermonthsAndYears(events, data) {
    var _select;

    var minMonth = DPicker.dateAdapter.getMonth(data.min);
    var minYear = DPicker.dateAdapter.getYear(data.min);

    var modelMonth = DPicker.dateAdapter.getMonth(data.model);
    var modelYear = DPicker.dateAdapter.getYear(data.model);

    var maxMonth = DPicker.dateAdapter.getMonth(data.max);
    var maxYear = DPicker.dateAdapter.getYear(data.max);

    // start with min month in year of min
    var showMonths = data.months.map(function (e, i) {
      return { month: i, year: minYear };
    }).filter(function (obj) {
      return obj.month >= minMonth;
    });

    // fill months of all years
    var yearsToShow = maxYear - minYear;
    for (var index = 1; index <= yearsToShow; index++) {
      showMonths = showMonths.concat(data.months.map(function (e, i) {
        return { month: i, year: minYear + index };
      }));
    }

    // remove unnecessary months of max year
    showMonths = showMonths.filter(function (obj) {
      if (obj.year < maxYear) {
        return true;
      }
      return obj.month <= maxMonth;
    });

    return _select = document.createElement('select'), _select.onchange = events.monthYearChange, _select.setAttribute('name', 'dpicker-monthYear'), _select.setAttribute('aria-label', 'Month and Year'), _appendChild(_select, [' ', showMonths.map(function (obj) {
      var _option;

      return _option = document.createElement('option'), _setAttribute(_option, obj.month === modelMonth && obj.year === modelYear ? 'selected' : '', obj.month === modelMonth && obj.year === modelYear ? 'selected' : ''), _option.setAttribute('value', '' + String(obj.month) + '-' + String(obj.year) + ''), _appendChild(_option, [data.months[obj.month] + ' ' + obj.year]), _option;
    }), ' ']), _select;
  };

  /**
  * MonthYear
  * @event Dpicker#monthYearChange
  */
  DPicker.events.monthYearChange = function monthYearChange(evt) {
    var selectedMonthYear = evt.target.value.split('-');
    this.model = DPicker.dateAdapter.setMonth(this.data.model, selectedMonthYear[0]);
    this.model = DPicker.dateAdapter.setYear(this.data.model, selectedMonthYear[1]);
    this.redraw();
    this.onChange({ modelChanged: true, name: 'monthYearChange', event: evt });
  };
};

},{"yo-yoify/lib/appendChild":4,"yo-yoify/lib/setAttribute":5}],13:[function(require,module,exports){
'use strict';

module.exports = function (DPicker) {
  /**
  * Renders previous month arrow
  * @param {DPicker.events} events
  * @param {DPicker.data} data
  * @param {Array} toRender
  * @fires DPicker#previousMonth
  *
  * @return {Element}
  */
  DPicker.renders.previousMonth = function renderPreviousMonth(events, data) {
    var _button;

    var previous = DPicker.dateAdapter.subMonths(data.model, 1);
    return _button = document.createElement('button'), _button.onclick = events.previousMonth, _button.setAttribute('class', 'dpicker-previous-month ' + String(!DPicker.dateAdapter.isSameMonth(previous, data.min) && DPicker.dateAdapter.isBefore(previous, data.min) ? 'dpicker-invisible' : '') + ''), _button;
  };

  /**
  * Renders next month arrow
  * @param {DPicker.events} events
  * @param {DPicker.data} data
  * @param {Array} toRender
  * @fires DPicker#nextMonth
  *
  * @return {Element}
  */
  DPicker.renders.nextMonth = function renderNextMonth(events, data) {
    var _dpickerNextMonth;

    var next = DPicker.dateAdapter.addMonths(data.model, 1);
    return _dpickerNextMonth = document.createElement('button'), _dpickerNextMonth.onclick = events.nextMonth, _dpickerNextMonth.setAttribute('class', 'dpicker-next-month ' + String(!DPicker.dateAdapter.isSameMonth(next, data.max) && DPicker.dateAdapter.isAfter(next, data.max) ? 'dpicker-invisible' : '') + ''), _dpickerNextMonth;
  };

  /**
  * Previous month
  * @event Dpicker#previousMonth
  */
  DPicker.events.previousMonth = function previousMonth(evt) {
    this.model = DPicker.dateAdapter.subMonths(this.data.model, 1);
    this.redraw();
    this.onChange({ modelChanged: true, name: 'previousMonth', event: evt });
  };

  /**
  * Next month
  * @event Dpicker#nextMonth
  */
  DPicker.events.nextMonth = function nextMonth(evt) {
    this.model = DPicker.dateAdapter.addMonths(this.data.model, 1);
    this.redraw();
    this.onChange({ modelChanged: true, name: 'nextMonth', event: evt });
  };
};

},{}],14:[function(require,module,exports){
'use strict';

var _appendChild = require('yo-yoify/lib/appendChild'),
    _setAttribute = require('yo-yoify/lib/setAttribute');

module.exports = function (DPicker) {
  var MINUTES = new Array(60).fill(0).map(function (e, i) {
    return i;
  });
  var HOURS24 = new Array(24).fill(0).map(function (e, i) {
    return i;
  });
  var HOURS12 = new Array(12).fill(0).map(function (e, i) {
    return i === 0 ? 12 : i;
  });
  HOURS12.push(HOURS12.shift());
  var MERIDIEM_TOKENS = ['AM', 'PM'];

  /**
  * Get hours and minutes according to the given `data` (meridiem, min/max consideration)
  * @param {Object} data
  * @private
  * @return {Object} `{hours, minutes}` both arrays of numbers
  */
  function getHoursMinutes(data) {
    var hours = data.meridiem ? HOURS12 : HOURS24;
    var step = parseInt(data.step);
    var minutes = MINUTES.filter(function (e) {
      return e % step === 0;
    });[data.min, data.max].map(function (e, i) {
      if (!DPicker.dateAdapter.isSameDay(data.model, e)) {
        return;
      }

      var xHours = DPicker.dateAdapter.getHours(e);
      var xMinutes = DPicker.dateAdapter.getMinutes(e);
      if (i === 0 && xMinutes + step > 60) {
        DPicker.dateAdapter.setMinutes(DPicker.dateAdapter.setHours(e, i === 0 ? ++xHours : --xHours), 0);
        xMinutes = 0;
      }

      if (data.meridiem === true) {
        if (xHours > 12) {
          xHours = xHours - 12;
        } else if (xHours === 0) {
          xHours = 12;
        }
      }

      hours = hours.filter(function (e) {
        return i === 0 ? e >= xHours : e <= xHours;
      });
    });

    return { hours: hours, minutes: minutes };
  }

  /**
  * Pad left for minutes \o/
  * @param {Number} v
  * @private
  * @return {String}
  */
  function padLeftZero(v) {
    return v < 10 ? '0' + v : '' + v;
  }

  /**
  * Handles minutes steps to focus on the correct input and set the model minutes/hours
  * @private
  */
  function minutesStep() {
    if (!this.data.time || parseInt(this.data.step, 10) <= 1) {
      return;
    }

    var _getHoursMinutes = getHoursMinutes(this.data),
        minutes = _getHoursMinutes.minutes;

    var modelMinutes = DPicker.dateAdapter.getMinutes(this.data.model);

    if (modelMinutes < minutes[0]) {
      this.data.model = DPicker.dateAdapter.setMinutes(this.data.model, minutes[0]);
      modelMinutes = minutes[0];
    }

    if (modelMinutes > minutes[minutes.length - 1]) {
      this.data.model = DPicker.dateAdapter.setMinutes(DPicker.dateAdapter.addHours(this.data.model, 1), 0);
      return;
    }

    minutes[minutes.length] = 60;
    modelMinutes = minutes.reduce(function (prev, curr) {
      return Math.abs(curr - modelMinutes) < Math.abs(prev - modelMinutes) ? curr : prev;
    });

    minutes.length--;

    this.data.model = DPicker.dateAdapter.setMinutes(this.data.model, modelMinutes);
  }

  /**
  * Render Time
  * ```
  * select[name='dpicker-hour']
  * select[name='dpicker-minutes']
  * ```
  *
  * @fires DPicker#hoursChange
  * @fires DPicker#minutesChange
  * @fires DPicker#minuteHoursChange
  * @fires DPicker#meridiemChange
  * @return {Element} the rendered virtual dom hierarchy
  */
  DPicker.renders.time = function renderTime(events, data) {
    var _dpickerTime2;

    if (!data.time) {
      var _dpickerTime;

      return _dpickerTime = document.createElement('span'), _dpickerTime.setAttribute('style', 'display: none;'), _dpickerTime.setAttribute('class', 'dpicker-time'), _dpickerTime;
    }

    var modelHours = DPicker.dateAdapter.getHours(data.model);

    if (data.meridiem !== false) {
      modelHours = modelHours > 12 ? modelHours - 12 : modelHours;
      modelHours = modelHours === 0 ? 12 : modelHours;
    }

    var _getHoursMinutes2 = getHoursMinutes(data),
        hours = _getHoursMinutes2.hours,
        minutes = _getHoursMinutes2.minutes;

    var modelMinutes = DPicker.dateAdapter.getMinutes(data.model);
    var selects = [];
    var modelStringValue = modelHours + ':' + modelMinutes;

    var minHours = DPicker.dateAdapter.getHours(data.min);
    var minMinutes = DPicker.dateAdapter.getMinutes(data.min);
    var maxHours = DPicker.dateAdapter.getHours(data.max);
    var maxMinutes = DPicker.dateAdapter.getMinutes(data.max);

    if (data.concatHoursAndMinutes) {
      var _select;

      var options = [].concat.apply([], minutes.map(function (minute) {
        return hours.map(function (hour) {
          return hour + ':' + minute;
        });
      })).filter(function (e) {
        var hm = e.split(':').map(parseFloat);

        if (DPicker.dateAdapter.isSameDay(data.model, data.min) && hm[0] === minHours && hm[1] < minMinutes) {
          return false;
        }

        if (DPicker.dateAdapter.isSameDay(data.model, data.max) && hm[0] === maxHours && hm[1] > maxMinutes) {
          return false;
        }

        return true;
      }).sort(function (a, b) {
        a = a.split(':').map(parseFloat);
        b = b.split(':').map(parseFloat);

        if (a[0] < b[0]) return -1;
        if (a[0] > b[0]) return 1;
        if (a[1] < b[1]) return -1;
        if (a[1] > b[1]) return 1;
        return 0;
      }).map(function (value) {
        var _option;

        var text = value.split(':').map(padLeftZero).join(':');
        return _option = document.createElement('option'), _setAttribute(_option, value === modelStringValue ? 'selected' : '', value === modelStringValue ? 'selected' : ''), _option.setAttribute('value', '' + String(value) + ''), _appendChild(_option, [text]), _option;
      });

      selects.push((_select = document.createElement('select'), _select.onchange = events.minuteHoursChange, _select.setAttribute('name', 'dpicker-time'), _select.setAttribute('aria-label', 'time'), _appendChild(_select, [options]), _select));
    } else {
      var _select2, _select3;

      selects.push((_select2 = document.createElement('select'), _select2.onchange = events.hoursChange, _select2.setAttribute('name', 'dpicker-hours'), _select2.setAttribute('aria-label', 'Hours'), _appendChild(_select2, [hours.map(function (e, i) {
        var _option2;

        return _option2 = document.createElement('option'), _setAttribute(_option2, e === modelHours ? 'selected' : '', e === modelHours ? 'selected' : ''), _option2.setAttribute('value', '' + String(e) + ''), _appendChild(_option2, [padLeftZero(e)]), _option2;
      })]), _select2), (_select3 = document.createElement('select'), _select3.onchange = events.minutesChange, _select3.setAttribute('name', 'dpicker-minutes'), _select3.setAttribute('aria-label', 'Minutes'), _appendChild(_select3, [minutes.filter(function (e) {
        if (DPicker.dateAdapter.isSameDay(data.model, data.min) && modelHours === minHours && e < minMinutes) {
          return false;
        }

        if (DPicker.dateAdapter.isSameDay(data.model, data.max) && modelHours === maxHours && e > maxMinutes) {
          return false;
        }

        return true;
      }).map(function (e, i) {
        var _option3;

        return _option3 = document.createElement('option'), _setAttribute(_option3, e === modelMinutes ? 'selected' : '', e === modelMinutes ? 'selected' : ''), _option3.setAttribute('value', '' + String(e) + ''), _appendChild(_option3, [padLeftZero(e)]), _option3;
      })]), _select3));
    }

    if (data.meridiem !== false) {
      var _select4;

      var modelMeridiem = DPicker.dateAdapter.getMeridiem(data.model);
      selects.push((_select4 = document.createElement('select'), _select4.onchange = events.meridiemChange, _select4.setAttribute('name', 'dpicker-meridiem'), _appendChild(_select4, [' ', MERIDIEM_TOKENS.map(function (e) {
        var _option4;

        return _option4 = document.createElement('option'), _setAttribute(_option4, modelMeridiem === e ? 'selected' : '', modelMeridiem === e ? 'selected' : ''), _option4.setAttribute('value', '' + String(e) + ''), _appendChild(_option4, [e]), _option4;
      }), ' ']), _select4));
    }

    return _dpickerTime2 = document.createElement('span'), _dpickerTime2.setAttribute('class', 'dpicker-time'), _appendChild(_dpickerTime2, [selects]), _dpickerTime2;
  };

  /**
    * On hours change
    * @event DPicker#hoursChange
    */
  DPicker.events.hoursChange = function hoursChange(evt) {
    this.data.empty = false;

    var val = parseInt(evt.target.options[evt.target.selectedIndex].value, 10);

    if (this.data.meridiem !== false) {
      if (DPicker.dateAdapter.getMeridiem(this.data.model) === MERIDIEM_TOKENS[1] /** PM **/) {
          val = val === 12 ? 12 : val + 12;
        } else if (val === 12) {
        val = 0;
      }
    }

    this.model = DPicker.dateAdapter.setHours(this.data.model, val);
    if (evt.redraw === false) {
      this.redraw();
    }
    this.onChange({ modelChanged: true, name: 'hoursChange', event: evt });
  };

  /**
    * On minutes change
    * @event DPicker#minutesChange
    */
  DPicker.events.minutesChange = function minutesChange(evt) {
    this.data.empty = false;
    this.model = DPicker.dateAdapter.setMinutes(this.data.model, evt.target.options[evt.target.selectedIndex].value);
    if (evt.redraw === false) {
      this.redraw();
    }
    this.onChange({ modelChanged: true, name: 'minutesChange', event: evt });
  };

  /**
    * On minutes hours change when concatHoursAndMinutes is `true`
    * @event DPicker#minuteHoursChange
    */
  DPicker.events.minuteHoursChange = function minuteHoursChange(evt) {
    var val = evt.target.options[evt.target.selectedIndex].value.split(':');

    // whoops, hacked myself
    this.events.hoursChange({ target: { options: [{ value: val[0] }], selectedIndex: 0 }, redraw: false });
    this.events.minutesChange({ target: { options: [{ value: val[1] }], selectedIndex: 0 }, redraw: false });
    this.redraw();
  };

  /**
    * On meridiem change
    * @event DPicker#meridiemChange
    */
  DPicker.events.meridiemChange = function meridiemChange(evt) {
    this.data.empty = false;
    var val = evt.target.options[evt.target.selectedIndex].value;
    var hours = DPicker.dateAdapter.getHours(this.data.model);

    if (val === MERIDIEM_TOKENS[0] /** AM **/) {
        hours = hours === 12 ? 0 : hours - 12;
      } else {
      hours = hours === 12 ? 12 : hours + 12;
    }

    this.model = DPicker.dateAdapter.setHours(this.data.model, hours);
    this.redraw();
    this.onChange({ modelChanged: true, name: 'meridiemChange', event: evt });
  };

  /**
  * @ignore
  */
  DPicker.events.inputChange = DPicker.decorate(DPicker.events.inputChange, function timeInputChange() {
    minutesStep.apply(this);
  });

  /**
  * @ignore
  */
  DPicker.prototype.initialize = DPicker.decorate(DPicker.prototype.initialize, function timeInitialize() {
    minutesStep.apply(this);
  });

  /**
  * @ignore
  */
  DPicker.prototype.redraw = DPicker.decorate(DPicker.prototype.redraw, function timeRedraw() {
    minutesStep.apply(this);
  });

  /**
  * @property {Boolean} [time=false] If `type="datetime"` attribute is defined, evaluates to `true`
  */
  DPicker.properties.time = function getTimeAttribute(attributes) {
    return attributes.type === 'datetime';
  };

  /**
  * @property {Boolean} [step=1] Takes the value of the attribute `step` or `1`
  */
  DPicker.properties.step = function getStepAttribute(attributes) {
    return attributes.step ? parseInt(attributes.step, 10) : 1;
  };

  /**
  * @property {Boolean} [meridiem=false]
  */
  DPicker.properties.meridiem = false;

  /**
  * @property {Boolean} [concatHoursAndMinutes=false]
  */
  DPicker.properties.concatHoursAndMinutes = false;

  /**
  * ## Time
  *
  * Adds the following options/attributes/getters/setters:
  *
  * - `{boolean} [options.time=false]` Wether to add time or not, defaults to `true` if input type is `datetime`
  * - `{boolean} [options.meridiem=false]` 12 vs 24 time format where 24 is the default, this can be set through the `meridiem` attribute
  * - `{Number} [options.step=1]` Minutes step
  *
  **/

  return DPicker;
};

},{"yo-yoify/lib/appendChild":4,"yo-yoify/lib/setAttribute":5}]},{},[7])(7)
});
