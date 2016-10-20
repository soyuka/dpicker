
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
function injector(fn) {
  return function(events, data, toRender) {
    return function() {
      return fn(events, data, toRender);
    };
  };
}
DPicker.injector = injector;
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
  if (options.h && options.mount && options.redraw) {
    DPicker.h = options.h;
    this.mount = options.mount;
    this.redraw = options.redraw;
  } else if (typeof maquette !== 'undefined') {
    DPicker.h = maquette.h;
    this._projector = maquette.createProjector();
  } else {
    throw new ReferenceError('No hyperscript library registered!');
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
  return this;
}
DPicker.prototype._initialize = function() {
  this.isValid(this._data.model);
};
DPicker.prototype.mount = function(element, toRender) {
  this._projector.append(element, toRender);
};
DPicker.prototype.redraw = function() {
  this._projector.scheduleRender();
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
  return this._data.order.map(function(e) {
    return children[e];
  });
};
DPicker.prototype._initData = function(options) {
  var $__5 = this,
      $__6 = function(i) {
        var e = $__5.properties[i];
        if (e.getset && !(i in DPicker.prototype)) {
          Object.defineProperty(DPicker.prototype, i, {
            get: function() {
              return this._data[i];
            },
            set: function(newValue) {
              this._data[i] = newValue;
              this.redraw();
            }
          });
        }
        $__5._data[i] = e.default;
        if (options[i] === undefined) {
          return 0;
        }
        if (i === 'model' && !options[i]) {
          $__5._data.empty = true;
          return 1;
        }
        $__5._data[i] = options[i];
      },
      $__7;
  $__4: for (var i in this.properties) {
    $__7 = $__6(i);
    switch ($__7) {
      case 0:
        continue $__4;
      case 1:
        continue $__4;
    }
  }
};
DPicker.prototype._parseInputAttributes = function(attributes) {
  var $__9 = this,
      $__10 = function(i) {
        var e = $__9.properties[i];
        if (e.attribute === undefined) {
          return 0;
        }
        if (typeof e.attribute === 'function') {
          $__9._data[i] = e.attribute(attributes);
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
            $__9._data.empty = true;
            return 3;
          }
          return 4;
        }
        if (e.moment === true) {
          v = moment(attribute.value, $__9._data.format, true);
          if (v.isValid() === false) {
            return 5;
          }
        }
        $__9._data[i] = v;
      },
      $__11;
  $__8: for (var i in this.properties) {
    $__11 = $__10(i);
    switch ($__11) {
      case 0:
        continue $__8;
      case 1:
        continue $__8;
      case 2:
        continue $__8;
      case 3:
        continue $__8;
      case 4:
        continue $__8;
      case 5:
        continue $__8;
    }
  }
};
DPicker.prototype._loadModules = function loadModules() {
  var $__2 = this;
  this._events = this._loadEvents();
  this._modulesRender = {};
  for (var moduleName in DPicker.modules) {
    var module = DPicker.modules[moduleName];
    var $__13 = this,
        $__14 = function(event) {
          if (!$__13._events[event]) {
            $__13._events[event] = module.events[event].bind($__13);
            return 0;
          }
          if (!$__13._events[event + '-internal']) {
            $__13._events[event + '-internal'] = [$__13._events[event]];
            $__13._events[event] = function(evt) {
              $__2._events[event + '-internal'].map(function(e) {
                return e.bind($__2)(evt);
              });
            };
          }
          $__13._events[event + '-internal'].push(module.events[event]);
        },
        $__15 = void 0;
    $__12: for (var event in module.events) {
      $__15 = $__14(event);
      switch ($__15) {
        case 0:
          continue $__12;
      }
    }
    var $__17 = this,
        $__18 = function(call) {
          if (!DPicker.prototype.hasOwnProperty(call) || typeof module.calls[call] !== 'function') {
            return 0;
          }
          if (!$__17[call + '-internal']) {
            $__17[call + '-internal'] = [DPicker.prototype[call]];
            $__17[call] = function() {
              for (var args = [],
                  $__3 = 0; $__3 < arguments.length; $__3++)
                args[$__3] = arguments[$__3];
              $__2[call + '-internal'].map(function(e) {
                return e.apply($__2, args);
              });
            };
          }
          $__17[call + '-internal'].push(module.calls[call]);
        },
        $__19 = void 0;
    $__16: for (var call in module.calls) {
      $__19 = $__18(call);
      switch ($__19) {
        case 0:
          continue $__16;
      }
    }
    if (module.render) {
      for (var i in module.render) {
        this._modulesRender[i] = module.render;
      }
    }
    if (module.properties) {
      for (var i$__20 in module.properties) {
        if (!this.properties[i$__20]) {
          this.properties[i$__20] = module.properties[i$__20];
        }
      }
    }
  }
};
DPicker.prototype._loadEvents = function loadEvents() {
  var $__2 = this;
  return {
    hide: function(evt) {
      if ($__2._data.display === false) {
        return;
      }
      var node = evt.target;
      if (isElementInContainer(node.parentNode, $__2._container)) {
        return;
      }
      $__2._data.display = false;
      $__2.redraw();
    },
    inputChange: function(evt) {
      if (!evt.target.value) {
        $__2._data.empty = true;
      } else {
        var newModel = moment(evt.target.value, $__2._data.format, true);
        $__2._data.model = $__2.isValid(newModel);
        $__2._data.empty = false;
      }
      $__2.onChange();
    },
    inputBlur: function(evt) {
      if ($__2._data.display === false) {
        return;
      }
      var node = evt.relatedTarget || evt.target;
      if (isElementInContainer(node.parentNode, $__2._container)) {
        return;
      }
      $__2._data.display = false;
      $__2.redraw();
    },
    inputFocus: function(evt) {
      $__2._data.display = true;
      if (evt.target && evt.target.select) {
        evt.target.select();
      }
    },
    yearChange: function(evt) {
      $__2._data.empty = false;
      $__2._data.model.year(evt.target.options[evt.target.selectedIndex].value);
      $__2.onChange();
    },
    monthChange: function(evt) {
      $__2._data.empty = false;
      $__2._data.model.month(evt.target.options[evt.target.selectedIndex].value);
      $__2.onChange();
    },
    dayClick: function(evt) {
      evt.preventDefault();
      $__2._data.model.date(evt.target.value);
      $__2._data.empty = false;
      $__2.onChange();
      if ($__2._data.hideOnDayClick) {
        $__2._data.display = false;
      }
    },
    dayKeyDown: function() {},
    keyDown: function(evt) {
      if (!$__2._data.hideOnEnter) {
        return;
      }
      var key = evt.which || evt.keyCode;
      if (key !== 13 && key !== 27)
        return;
      document.getElementById($__2.inputId).blur();
      $__2._data.display = false;
    }
  };
};
DPicker.prototype.isValid = function isValid(model) {
  if (!(model instanceof moment)) {
    throw new TypeError('isValid(Moment model), model is not a moment instance');
  }
  if (!model.isValid()) {
    this._data.valid = false;
    return this._data.model;
  }
  if (model < this._data.min) {
    this._data.valid = false;
    return this._data.min.clone();
  }
  if (model > this._data.max) {
    this._data.valid = false;
    return this._data.max.clone();
  }
  this._data.valid = true;
  return model;
};
DPicker.prototype.renderInput = injector(function renderInput(events, data, toRender) {
  return DPicker.h(("input#" + data.inputId), {
    value: data.empty ? '' : data.model.format(data.format),
    type: 'text',
    min: data.min.format(data.format),
    max: data.max.format(data.format),
    format: data.format,
    onchange: events.inputChange,
    onfocus: events.inputFocus,
    name: data.inputName,
    'aria-invalid': data.valid,
    'aria-haspopup': true
  });
});
DPicker.prototype.renderContainer = injector(function renderInput(events, data, toRender) {
  return DPicker.h('div.dpicker', toRender.map(function(e) {
    return e();
  }));
});
DPicker.prototype.render = injector(function render(events, data, toRender) {
  return DPicker.h('div.dpicker-container', {classes: {
      'dpicker-visible': data.display,
      'aria-hidden': data.display,
      'dpicker-invisible': !data.display
    }}, toRender.map(function(e) {
    return e();
  }));
});
DPicker.prototype.renderYears = injector(function renderYears(events, data, toRender) {
  var modelYear = data.model.year();
  var futureYear = data.max.year() + 1;
  var pastYear = data.min.year();
  var options = [];
  while (--futureYear >= pastYear) {
    options.push(DPicker.h('option', {
      value: futureYear,
      selected: futureYear === modelYear,
      key: futureYear
    }, '' + futureYear));
  }
  return DPicker.h('select', {
    onchange: events.yearChange,
    name: 'dpicker-year',
    'aria-label': 'Year'
  }, options);
});
DPicker.prototype.renderMonths = injector(function renderMonths(events, data, toRender) {
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
  return DPicker.h('select', {
    onchange: events.monthChange,
    name: 'dpicker-month',
    'aria-label': 'Month'
  }, showMonths.map(function(e, i) {
    return DPicker.h('option', {
      value: e,
      selected: e === modelMonth,
      key: e
    }, months[e]);
  }));
});
DPicker.prototype.renderDays = injector(function renderDays(events, data, toRender) {
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
  return DPicker.h('table', [DPicker.h('tr', days.map(function(e) {
    return DPicker.h('th', e);
  })), rows.map(function(e, row) {
    return DPicker.h('tr', {key: row}, new Array(7).fill(0).map(function(e, col) {
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
      return DPicker.h('td', {classes: {
          'dpicker-active': dayActive,
          'dpicker-inactive': !dayActive
        }}, [DPicker.h(dayActive ? 'button' : 'span', {
        value: day,
        'aria-label': dayActive ? 'Day ' + day : false,
        'aria-disabled': dayActive ? false : true,
        onclick: dayActive ? events.dayClick : noop,
        type: dayActive ? 'button' : null,
        onkeydown: dayActive ? events.dayKeyDown || noop : noop,
        classes: {'dpicker-active': currentDay === day}
      }, day)]);
    }));
  })]);
});
DPicker.prototype._modelSetter = function(newValue) {
  this._data.empty = !newValue;
  if (newValue instanceof moment) {
    this._data.model = this.isValid(newValue);
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
DPicker.modules = {};

  return DPicker;
}));
