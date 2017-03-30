
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define('DPicker', ['moment'], factory);
    } else if (typeof module === 'object' && module.exports) {
			  //node
        module.exports = factory(require('moment'));
    } else {
        // Browser globals (root is window)
        root.DPicker = factory(root.moment);
    }
}(this, function (moment) {
"use strict";
function noop() {}
function uuid() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function(a) {
    return (a ^ Math.random() * 16 >> a / 4).toString(16);
  });
}
function isElementInContainer(parent, containerId) {
  while (parent && parent !== document) {
    if (parent.getAttribute('id') === containerId) {
      return true;
    }
    parent = parent.parentNode;
  }
  return false;
}
function useSetAttribute(key) {
  return /^aria/.test(key);
}
function setAttribute(el, key, value) {
  if (useSetAttribute(key)) {
    el.setAttribute(key, value);
  } else {
    el[key] = value;
  }
}
function getAttribute(el, key, value) {
  if (useSetAttribute()) {
    return el.getAttribute(key);
  } else {
    return el[key];
  }
}
function removeAttribute(el, key) {
  if (useSetAttribute()) {
    return el.removeAttribute(key);
  } else {
    el[key] = undefined;
    return true;
  }
}
function DPicker(element) {
  var options = arguments[1] !== (void 0) ? arguments[1] : {};
  var $__2 = this;
  if (!(this instanceof DPicker)) {
    return new DPicker(element, options);
  }
  this._container = uuid();
  if (!DPicker.hasOwnProperty('properties')) {
    DPicker.prototype.properties = {
      format: {
        default: 'DD/MM/YYYY',
        attribute: 'format',
        getset: true
      },
      model: {
        default: moment(),
        moment: true,
        attribute: 'value'
      },
      display: {
        default: false,
        getset: true
      },
      hideOnDayClick: {default: true},
      hideOnEnter: {default: true},
      min: {
        default: moment('1986-01-01'),
        moment: true,
        attribute: 'min',
        getset: true
      },
      max: {
        default: moment().add(1, 'year').month(11),
        moment: true,
        attribute: 'max',
        getset: true
      },
      months: {
        default: moment.months(),
        getset: true
      },
      days: {
        default: moment.weekdaysShort(),
        getset: true
      },
      inputName: {
        default: 'dpicker-input',
        attribute: 'name'
      },
      inputId: {
        default: uuid(),
        attribute: 'id'
      },
      empty: {default: false},
      valid: {default: true},
      order: {default: ['months', 'years', 'time', 'days']},
      concatHoursAndMinutes: {default: false},
      siblingMonthDayClick: {default: false}
    };
  }
  this.onChange = options.onChange;
  this._data = {};
  this._loadModules();
  this._initData(options);
  document.addEventListener('click', this._events.hide);
  if (typeof element === 'undefined') {
    throw new ReferenceError('Can not initialize DPicker without a container');
  }
  if (element.length !== undefined && element[0]) {
    element = element[0];
  }
  if (element.tagName === 'INPUT') {
    if (!element.parentNode) {
      throw new ReferenceError('Can not initialize DPicker on an input without parent node');
    }
    this._parseInputAttributes([].slice.call(element.attributes));
    var parentNode = element.parentNode;
    element.parentNode.removeChild(element);
    element = parentNode;
    element.classList.add('dpicker');
  }
  this._initialize();
  this.mount(element, this.renderContainer(this._events, this._data, [this.renderInput(this._events, this._data), this.render(this._events, this._data, this.getRenderChild())]));
  element.id = this._container;
  element.addEventListener('keydown', this._events.keyDown);
  var input = element.querySelector('input');
  input.addEventListener('blur', this._events.inputBlur);
  document.addEventListener('touchend', function(e) {
    $__2._events.inputBlur(e);
  });
  this.rootElement = element;
  return this;
}
DPicker.prototype.toggle = function() {
  var el = this.rootElement.querySelector('.dpicker-container');
  if (this.display === true) {
    el.classList.remove('dpicker-invisible');
    el.classList.add('dpicker-visible');
  } else {
    el.classList.add('dpicker-invisible');
    el.classList.remove('dpicker-visible');
  }
};
DPicker.prototype._initialize = function() {
  this.isValid(this._data.model);
};
DPicker.prototype.mount = function(element, toRender) {
  element.appendChild(toRender);
};
DPicker.prototype.replace = function(selector, replacement) {
  var child = this.rootElement.querySelector(selector);
  child.parentNode.replaceChild(replacement, child);
};
DPicker.prototype.merge = function(selector, replacement) {
  var child = this.rootElement.querySelector(selector);
  for (var i = 0; i < replacement.attributes.length; i++) {
    var $__4 = replacement.attributes[i],
        name = $__4.name,
        value = $__4.value;
    if (getAttribute(child, name) !== value) {
      setAttribute(child, name, value);
    }
  }
  for (var i$__6 = 0; i$__6 < child.attributes.length; i$__6++) {
    var $__5 = child.attributes[i$__6],
        name$__7 = $__5.name,
        value$__8 = $__5.value;
    if (getAttribute(replacement, name$__7) === undefined) {
      removeAttribute(child, name$__7);
    }
  }
  if (replacement.value !== child.value) {
    child.value = replacement.value;
  }
};
DPicker.prototype.redraw = function(items) {
  if (!items) {
    items = ['input', 'container'];
  }
  for (var i = 0; i < items.length; i++) {
    switch (items[i]) {
      case 'input':
        this.merge('input', this.renderInput(this._events, this._data));
        break;
      case 'days':
        this.replace('table', this.renderDays(this._events, this._data));
        break;
      case 'container':
        this.replace('.dpicker-container', this.render(this._events, this._data, this.getRenderChild()));
        break;
    }
  }
};
DPicker.prototype.getRenderChild = function() {
  var children = {
    years: this.renderYears(this._events, this._data),
    months: this.renderMonths(this._events, this._data)
  };
  for (var module in this._modulesRender) {
    for (var renderMethod in this._modulesRender[module]) {
      children[renderMethod] = this._modulesRender[module][renderMethod](this._events, this._data);
    }
  }
  children.days = this.renderDays(this._events, this._data);
  return this._data.order.filter(function(e) {
    return children[e];
  }).map(function(e) {
    return children[e];
  });
};
DPicker.prototype._initData = function(options) {
  var $__10 = this,
      $__11 = function(i) {
        var e = $__10.properties[i];
        if (e.getset && !(i in DPicker.prototype)) {
          Object.defineProperty(DPicker.prototype, i, {
            get: function() {
              return this._data[i];
            },
            set: function(newValue) {
              this._data[i] = newValue;
              if (i === 'display') {
                this.toggle();
              } else {
                this.redraw();
              }
            }
          });
        }
        $__10._data[i] = e.default;
        if (options[i] === undefined) {
          return 0;
        }
        if (i === 'model' && !options[i]) {
          $__10._data.empty = true;
          return 1;
        }
        $__10._data[i] = options[i];
      },
      $__12;
  $__9: for (var i in this.properties) {
    $__12 = $__11(i);
    switch ($__12) {
      case 0:
        continue $__9;
      case 1:
        continue $__9;
    }
  }
};
DPicker.prototype._parseInputAttributes = function(attributes) {
  var $__14 = this,
      $__15 = function(i) {
        var e = $__14.properties[i];
        if (e.attribute === undefined) {
          return 0;
        }
        if (typeof e.attribute === 'function') {
          $__14._data[i] = e.attribute(attributes);
          return 1;
        }
        var attribute = attributes.filter(function(a) {
          return a.name === e.attribute;
        })[0];
        if (!attribute) {
          return 2;
        }
        var v = attribute.value;
        if (!v) {
          if (i === 'model') {
            $__14._data.empty = true;
            return 3;
          }
          return 4;
        }
        if (e.moment === true) {
          v = moment(attribute.value, $__14._data.format, true);
          if (v.isValid() === false) {
            return 5;
          }
        }
        $__14._data[i] = v;
      },
      $__16;
  $__13: for (var i in this.properties) {
    $__16 = $__15(i);
    switch ($__16) {
      case 0:
        continue $__13;
      case 1:
        continue $__13;
      case 2:
        continue $__13;
      case 3:
        continue $__13;
      case 4:
        continue $__13;
      case 5:
        continue $__13;
    }
  }
};
DPicker.prototype._loadModules = function loadModules() {
  var $__2 = this;
  this._events = this._loadEvents();
  this._modulesRender = {};
  for (var moduleName in DPicker.modules) {
    var module = DPicker.modules[moduleName];
    var $__18 = this,
        $__19 = function(event) {
          if (!$__18._events[event]) {
            $__18._events[event] = module.events[event].bind($__18);
            return 0;
          }
          if (!$__18._events[event + '-internal']) {
            $__18._events[event + '-internal'] = [$__18._events[event]];
            $__18._events[event] = function(evt) {
              $__2._events[event + '-internal'].map(function(e) {
                return e.bind($__2)(evt);
              });
            };
          }
          $__18._events[event + '-internal'].unshift(module.events[event]);
        },
        $__20 = void 0;
    $__17: for (var event in module.events) {
      $__20 = $__19(event);
      switch ($__20) {
        case 0:
          continue $__17;
      }
    }
    var $__22 = this,
        $__23 = function(call) {
          if (!DPicker.prototype.hasOwnProperty(call) || typeof module.calls[call] !== 'function') {
            return 0;
          }
          if (!$__22[call + '-internal']) {
            $__22[call + '-internal'] = [DPicker.prototype[call]];
            $__22[call] = function() {
              for (var args = [],
                  $__3 = 0; $__3 < arguments.length; $__3++)
                args[$__3] = arguments[$__3];
              $__2[call + '-internal'].map(function(e) {
                return e.apply($__2, args);
              });
            };
          }
          $__22[call + '-internal'].push(module.calls[call]);
        },
        $__24 = void 0;
    $__21: for (var call in module.calls) {
      $__24 = $__23(call);
      switch ($__24) {
        case 0:
          continue $__21;
      }
    }
    if (module.render) {
      for (var i in module.render) {
        this._modulesRender[i] = module.render;
      }
    }
    if (module.properties) {
      for (var i$__25 in module.properties) {
        if (!this.properties[i$__25]) {
          this.properties[i$__25] = module.properties[i$__25];
        }
      }
    }
  }
};
DPicker.prototype._loadEvents = function loadEvents() {
  var $__2 = this;
  return {
    hide: function(evt) {
      if ($__2.display === false) {
        return;
      }
      var node = evt.target;
      if (isElementInContainer(node.parentNode, $__2._container)) {
        return;
      }
      $__2.display = false;
    },
    inputChange: function(evt) {
      if (!evt.target.value) {
        $__2._data.empty = true;
      } else {
        var newModel = moment(evt.target.value, $__2._data.format, true);
        if ($__2.isValid(newModel) === true) {
          $__2._data.model = newModel;
        }
        $__2._data.empty = false;
      }
      $__2.redraw(['input', 'container']);
      $__2.onChange({
        modelChanged: true,
        name: 'inputChange',
        event: evt
      });
    },
    inputBlur: function(evt) {
      if ($__2.display === false) {
        return;
      }
      var node = evt.relatedTarget || evt.target;
      if (isElementInContainer(node.parentNode, $__2._container)) {
        return;
      }
      $__2.display = false;
      $__2.onChange({
        modelChanged: false,
        name: 'inputBlur',
        event: evt
      });
    },
    inputFocus: function(evt) {
      $__2.display = true;
      if (evt.target && evt.target.select) {
        evt.target.select();
      }
      $__2.onChange({
        modelChanged: false,
        name: 'inputFocus',
        event: evt
      });
    },
    yearChange: function(evt) {
      $__2._data.empty = false;
      $__2._data.model.year(evt.target.options[evt.target.selectedIndex].value);
      $__2.isValid($__2._data.model);
      $__2.redraw(['input', 'days']);
      $__2.onChange({
        modelChanged: true,
        name: 'yearChange',
        event: evt
      });
    },
    monthChange: function(evt) {
      $__2._data.empty = false;
      $__2._data.model.month(evt.target.options[evt.target.selectedIndex].value);
      $__2.isValid($__2._data.model);
      $__2.redraw(['input', 'days']);
      $__2.onChange({
        modelChanged: true,
        name: 'monthChange',
        event: evt
      });
    },
    dayClick: function(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      $__2._data.model.date(evt.target.value);
      $__2._data.empty = false;
      if ($__2._data.hideOnDayClick) {
        $__2.display = false;
      }
      $__2.isValid($__2._data.model);
      $__2.redraw(['input', 'days']);
      $__2.onChange({
        modelChanged: true,
        name: 'dayClick',
        event: evt
      });
    },
    previousMonthDayClick: function(evt) {
      if (!$__2._data.siblingMonthDayClick) {
        return;
      }
      evt.preventDefault();
      evt.stopPropagation();
      $__2._data.model.date(evt.target.value);
      $__2._data.model.subtract(1, 'month');
      $__2._data.empty = false;
      if ($__2._data.hideOnDayClick) {
        $__2.display = false;
      }
      $__2.isValid($__2._data.model);
      $__2.redraw(['input', 'container']);
      $__2.onChange({
        modelChanged: true,
        name: 'previousMonthDayClick',
        event: evt
      });
    },
    nextMonthDayClick: function(evt) {
      if (!$__2._data.siblingMonthDayClick) {
        return;
      }
      evt.preventDefault();
      evt.stopPropagation();
      $__2._data.model.date(evt.target.value);
      $__2._data.model.add(1, 'month');
      $__2._data.empty = false;
      if ($__2._data.hideOnDayClick) {
        $__2.display = false;
      }
      $__2.isValid($__2._data.model);
      $__2.redraw(['input', 'container']);
      $__2.onChange({
        modelChanged: true,
        name: 'nextMonthDayClick',
        event: evt
      });
    },
    dayKeyDown: function() {},
    keyDown: function(evt) {
      if (!$__2._data.hideOnEnter) {
        return;
      }
      var key = evt.which || evt.keyCode;
      if (key !== 13 && key !== 27) {
        return;
      }
      document.getElementById($__2.inputId).blur();
      $__2.display = false;
      $__2.onChange({
        modelChanged: false,
        name: 'keyDown',
        event: evt
      });
    }
  };
};
DPicker.prototype.isValid = function isValid(model) {
  if (!(model instanceof moment) || !model.isValid()) {
    this._data.valid = false;
    return false;
  }
  var unit = this.time ? 'minute' : 'day';
  if (model.isBefore(this._data.min, unit) || model.isAfter(this._data.max, unit)) {
    this._data.valid = false;
    return true;
  }
  this._data.valid = true;
  return true;
};
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
  });
};
DPicker.prototype.renderContainer = function renderContainer(events, data, toRender) {
  return this.h('div', {class: 'dpicker'}, toRender);
};
DPicker.prototype.render = function render(events, data, toRender) {
  return this.h('div', {
    'aria-hidden': !data.display,
    class: ("dpicker-container " + (data.display ? 'dpicker-visible' : 'dpicker-invisible'))
  }, toRender);
};
DPicker.prototype.renderYears = function renderYears(events, data, toRender) {
  var modelYear = data.model.year();
  var futureYear = data.max.year() + 1;
  var pastYear = data.min.year();
  var options = [];
  while (--futureYear >= pastYear) {
    options.push(this.h('option', {
      value: futureYear,
      selected: futureYear === modelYear,
      key: futureYear
    }, '' + futureYear));
  }
  return this.h('select', {
    onchange: events.yearChange,
    name: 'dpicker-year',
    'aria-label': 'Year'
  }, options);
};
DPicker.prototype.renderMonths = function renderMonths(events, data, toRender) {
  var $__2 = this;
  var modelMonth = data.model.month();
  var currentYear = data.model.year();
  var months = data.months;
  var showMonths = data.months.map(function(e, i) {
    return i;
  });
  if (data.max.year() === currentYear) {
    var maxMonth = data.max.month();
    showMonths = showMonths.filter(function(e) {
      return e <= maxMonth;
    });
  }
  if (data.min.year() === currentYear) {
    var minMonth = data.min.month();
    showMonths = showMonths.filter(function(e) {
      return e >= minMonth;
    });
  }
  return this.h('select', {
    onchange: events.monthChange,
    name: 'dpicker-month',
    'aria-label': 'Month'
  }, showMonths.map(function(e, i) {
    return $__2.h('option', {
      value: e,
      selected: e === modelMonth,
      key: e
    }, months[e]);
  }));
};
DPicker.prototype.renderDays = function renderDays(events, data, toRender) {
  var $__2 = this;
  var daysInMonth = data.model.daysInMonth();
  var daysInPreviousMonth = data.model.clone().subtract(1, 'months').daysInMonth();
  var firstLocaleDay = moment.localeData().firstDayOfWeek();
  var firstDay = +(data.model.clone().date(1).format('e')) - 1;
  var currentDay = data.model.date();
  var currentMonth = data.model.month();
  var currentYear = data.model.year();
  var minDay;
  var maxDay;
  var minMonth;
  var maxMonth;
  var days = new Array(7);
  data.days.map(function(e, i) {
    days[i < firstLocaleDay ? 6 - i : i - firstLocaleDay] = e;
  });
  if (data.model.isSame(data.min, 'month')) {
    minDay = data.min.date();
    minMonth = data.min.month();
  }
  if (data.model.isSame(data.max, 'month')) {
    maxDay = data.max.date();
    maxMonth = data.max.month();
  }
  var rows = new Array(Math.ceil(.1 + (firstDay + daysInMonth) / 7)).fill(0);
  var day;
  var dayActive;
  var previousMonth = false;
  var nextMonth = false;
  var loopend = true;
  var classActive = '';
  return this.h('table', [this.h('tr', days.map(function(e) {
    return $__2.h('th', e);
  })), rows.map(function(e, row) {
    return $__2.h('tr', {key: row}, new Array(7).fill(0).map(function(e, col) {
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
      var dayMonth = previousMonth ? currentMonth : (nextMonth ? currentMonth + 2 : currentMonth + 1);
      var currentDayModel = moment(day + '-' + dayMonth + '-' + currentYear, 'DD-MM-YYYY');
      if (dayActive === false && data.siblingMonthDayClick === true) {
        dayActive = true;
      }
      if (data.min && dayActive) {
        dayActive = currentDayModel.isSameOrAfter(data.min, 'day');
      }
      if (data.max && dayActive) {
        dayActive = currentDayModel.isSameOrBefore(data.max, 'day');
      }
      if (dayActive === true && previousMonth === false && nextMonth === false && currentDay === day) {
        classActive = 'dpicker-active';
      }
      return $__2.h("td", {class: dayActive ? 'dpicker-active' : 'dpicker-inactive'}, [$__2.h(("" + (dayActive ? 'button' : 'span')), {
        value: day,
        'aria-label': dayActive ? 'Day ' + day : false,
        'aria-disabled': dayActive ? false : true,
        onclick: !dayActive ? noop : (!previousMonth && !nextMonth ? events.dayClick : (previousMonth ? events.previousMonthDayClick : events.nextMonthDayClick)),
        type: dayActive ? 'button' : null,
        onkeydown: dayActive ? events.dayKeyDown || noop : noop,
        class: classActive
      }, day)]);
    }));
  })]);
};
DPicker.prototype._modelSetter = function(newValue) {
  this._data.empty = !newValue;
  if (this.isValid(newValue) === true) {
    this._data.model = newValue;
  }
  this.redraw();
};
Object.defineProperties(DPicker.prototype, {
  'container': {get: function() {
      return this._container;
    }},
  'inputId': {get: function() {
      return this._data.inputId;
    }},
  'input': {get: function() {
      if (this._data.empty) {
        return '';
      }
      return this._data.model.format(this._data.format);
    }},
  'onChange': {
    set: function(onChange) {
      var $__2 = this;
      this._onChange = function(dpickerEvent) {
        return !onChange ? false : onChange($__2._data, dpickerEvent);
      };
    },
    get: function() {
      return this._onChange;
    }
  },
  'valid': {get: function() {
      return this._data.valid;
    }},
  'model': {
    set: function(newValue) {
      this._modelSetter(newValue);
    },
    get: function() {
      return this._data.model;
    }
  }
});
DPicker.h = DPicker.prototype.h = function h(element, props, children) {
  var el = document.createElement(element);
  var frag = document.createDocumentFragment();
  if (props.toString() !== '[object Object]') {
    children = props;
    props = {};
  }
  if (typeof children === 'undefined') {
    children = [];
  } else if (!Array.isArray(children)) {
    children = [children];
  }
  for (var i in props) {
    if (!props[i]) {
      continue;
    }
    if (i.substr(0, 2) === 'on') {
      el[i] = props[i];
    } else {
      if (i === 'class') {
        el.className = props[i];
      } else if (props[i] === true) {
        el[i] = i;
      } else {
        setAttribute(el, i, props[i]);
      }
    }
  }
  for (var i$__26 = 0; i$__26 < children.length; i$__26++) {
    if (typeof children[i$__26] === 'string' || typeof children[i$__26] === 'number') {
      el.innerText = children[i$__26];
      break;
    }
    if (Array.isArray(children[i$__26])) {
      children[i$__26].map(function(node) {
        return frag.appendChild(node);
      });
    } else {
      frag.appendChild(children[i$__26]);
    }
  }
  el.appendChild(frag);
  return el;
};
DPicker.modules = {};

  return DPicker;
}));
