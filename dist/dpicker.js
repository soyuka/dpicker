
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
      order: {default: ['months', 'years', 'time', 'days']}
    };
  }
  this.onChange = options.onChange;
  this._data = {};
  this._loadModules();
  this._initData(options);
  document.addEventListener('click', this._events.hide);
  if (element.tagName === 'INPUT') {
    if (!element.parentNode) {
      throw new ReferenceError('Can not init DPicker on an input without parent node');
    }
    this._parseInputAttributes([].slice.call(element.attributes));
    var parentNode = element.parentNode;
    element.parentNode.removeChild(element);
    element = parentNode;
    element.classList.add('dpicker');
  }
  this._initialize();
  this.mount(element, this.renderContainer(this._events, this._data, [this.renderInput(this._events, this._data), this.render(this._events, this._data, this.getRenderChild())]));
  element.setAttribute('id', this._container);
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
    var attr = replacement.attributes[i];
    if (child.getAttribute(attr.name) !== attr.value) {
      child.setAttribute(attr.name, attr.value);
    }
  }
  for (var i$__4 = 0; i$__4 < child.attributes.length; i$__4++) {
    var attr$__5 = child.attributes[i$__4];
    if (!replacement.hasAttribute(attr$__5.name)) {
      child.removeAttribute(attr$__5.name);
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
  var $__7 = this,
      $__8 = function(i) {
        var e = $__7.properties[i];
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
        $__7._data[i] = e.default;
        if (options[i] === undefined) {
          return 0;
        }
        if (i === 'model' && !options[i]) {
          $__7._data.empty = true;
          return 1;
        }
        $__7._data[i] = options[i];
      },
      $__9;
  $__6: for (var i in this.properties) {
    $__9 = $__8(i);
    switch ($__9) {
      case 0:
        continue $__6;
      case 1:
        continue $__6;
    }
  }
};
DPicker.prototype._parseInputAttributes = function(attributes) {
  var $__11 = this,
      $__12 = function(i) {
        var e = $__11.properties[i];
        if (e.attribute === undefined) {
          return 0;
        }
        if (typeof e.attribute === 'function') {
          $__11._data[i] = e.attribute(attributes);
          return 1;
        }
        var attribute = attributes.find(function(a) {
          return a.name === e.attribute;
        });
        if (!attribute) {
          return 2;
        }
        var v = attribute.value;
        if (!v) {
          if (i === 'model') {
            $__11._data.empty = true;
            return 3;
          }
          return 4;
        }
        if (e.moment === true) {
          v = moment(attribute.value, $__11._data.format, true);
          if (v.isValid() === false) {
            return 5;
          }
        }
        $__11._data[i] = v;
      },
      $__13;
  $__10: for (var i in this.properties) {
    $__13 = $__12(i);
    switch ($__13) {
      case 0:
        continue $__10;
      case 1:
        continue $__10;
      case 2:
        continue $__10;
      case 3:
        continue $__10;
      case 4:
        continue $__10;
      case 5:
        continue $__10;
    }
  }
};
DPicker.prototype._loadModules = function loadModules() {
  var $__2 = this;
  this._events = this._loadEvents();
  this._modulesRender = {};
  for (var moduleName in DPicker.modules) {
    var module = DPicker.modules[moduleName];
    var $__15 = this,
        $__16 = function(event) {
          if (!$__15._events[event]) {
            $__15._events[event] = module.events[event].bind($__15);
            return 0;
          }
          if (!$__15._events[event + '-internal']) {
            $__15._events[event + '-internal'] = [$__15._events[event]];
            $__15._events[event] = function(evt) {
              $__2._events[event + '-internal'].map(function(e) {
                return e.bind($__2)(evt);
              });
            };
          }
          $__15._events[event + '-internal'].unshift(module.events[event]);
        },
        $__17 = void 0;
    $__14: for (var event in module.events) {
      $__17 = $__16(event);
      switch ($__17) {
        case 0:
          continue $__14;
      }
    }
    var $__19 = this,
        $__20 = function(call) {
          if (!DPicker.prototype.hasOwnProperty(call) || typeof module.calls[call] !== 'function') {
            return 0;
          }
          if (!$__19[call + '-internal']) {
            $__19[call + '-internal'] = [DPicker.prototype[call]];
            $__19[call] = function() {
              for (var args = [],
                  $__3 = 0; $__3 < arguments.length; $__3++)
                args[$__3] = arguments[$__3];
              $__2[call + '-internal'].map(function(e) {
                return e.apply($__2, args);
              });
            };
          }
          $__19[call + '-internal'].push(module.calls[call]);
        },
        $__21 = void 0;
    $__18: for (var call in module.calls) {
      $__21 = $__20(call);
      switch ($__21) {
        case 0:
          continue $__18;
      }
    }
    if (module.render) {
      for (var i in module.render) {
        this._modulesRender[i] = module.render;
      }
    }
    if (module.properties) {
      for (var i$__22 in module.properties) {
        if (!this.properties[i$__22]) {
          this.properties[i$__22] = module.properties[i$__22];
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
      $__2.onChange();
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
    },
    inputFocus: function(evt) {
      $__2.display = true;
      if (evt.target && evt.target.select) {
        evt.target.select();
      }
    },
    yearChange: function(evt) {
      $__2._data.empty = false;
      $__2._data.model.year(evt.target.options[evt.target.selectedIndex].value);
      $__2.redraw(['input', 'days']);
      $__2.onChange();
    },
    monthChange: function(evt) {
      $__2._data.empty = false;
      $__2._data.model.month(evt.target.options[evt.target.selectedIndex].value);
      $__2.redraw(['input', 'days']);
      $__2.onChange();
    },
    dayClick: function(evt) {
      evt.preventDefault();
      $__2._data.model.date(evt.target.value);
      $__2._data.empty = false;
      if ($__2._data.hideOnDayClick) {
        $__2.display = false;
      }
      $__2.redraw(['input']);
      $__2.onChange();
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
  var minDay;
  var maxDay;
  var days = new Array(7);
  data.days.map(function(e, i) {
    days[i < firstLocaleDay ? 7 - i : i - firstLocaleDay] = e;
  });
  if (data.model.isSame(data.min, 'month')) {
    minDay = data.min.date();
  }
  if (data.model.isSame(data.max, 'month')) {
    maxDay = data.max.date();
  }
  var rows = new Array(Math.ceil(.1 + (firstDay + daysInMonth) / 7)).fill(0);
  var day;
  var dayActive;
  var loopend = true;
  return this.h('table', [this.h('tr', days.map(function(e) {
    return $__2.h('th', e);
  })), rows.map(function(e, row) {
    return $__2.h('tr', {key: row}, new Array(7).fill(0).map(function(e, col) {
      dayActive = loopend;
      if (col <= firstDay && row === 0) {
        day = daysInPreviousMonth - (firstDay - col);
        dayActive = false;
      } else if (col === firstDay + 1 && row === 0) {
        day = 1;
        dayActive = true;
      } else {
        if (day === daysInMonth) {
          day = 0;
          dayActive = false;
          loopend = false;
        }
        day++;
      }
      if (dayActive === true) {
        dayActive = typeof minDay !== 'undefined' ? day >= minDay : dayActive;
        dayActive = typeof maxDay !== 'undefined' ? day <= maxDay : dayActive;
      }
      return $__2.h("td", {class: dayActive ? 'dpicker-active' : 'dpicker-inactive'}, [$__2.h(("" + (dayActive ? 'button' : 'span')), {
        value: day,
        'aria-label': dayActive ? 'Day ' + day : false,
        'aria-disabled': dayActive ? false : true,
        onclick: dayActive ? events.dayClick : noop,
        type: dayActive ? 'button' : null,
        onkeydown: dayActive ? events.dayKeyDown || noop : noop,
        class: currentDay === day ? 'dpicker-active' : ''
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
      this._onChange = function() {
        return !onChange ? false : onChange($__2._data);
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
      if (props[i] === true) {
        el.setAttribute(i, i);
      } else {
        el.setAttribute(i, props[i]);
      }
    }
  }
  for (var i$__23 = 0; i$__23 < children.length; i$__23++) {
    if (typeof children[i$__23] === 'string' || typeof children[i$__23] === 'number') {
      el.innerText = children[i$__23];
      break;
    }
    if (Array.isArray(children[i$__23])) {
      children[i$__23].map(function(node) {
        return frag.appendChild(node);
      });
    } else {
      frag.appendChild(children[i$__23]);
    }
  }
  el.appendChild(frag);
  return el;
};
DPicker.modules = {};

  return DPicker;
}));
