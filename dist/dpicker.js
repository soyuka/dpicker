
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
"use strict";
var h = maquette.h;
function noop() {}
function injector(fn) {
  return function(events, data, toRender) {
    return function() {
      return fn(events, data, toRender);
    };
  };
}
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
  var $__1 = this;
  if (!(this instanceof DPicker)) {
    return new DPicker(element, options);
  }
  this._container = uuid();
  var now = options.model || moment();
  this._data = {
    model: now.clone(),
    format: options.format || 'DD/MM/YYYY',
    display: options.display !== undefined ? options.display : false,
    hideOnDayClick: options.hideOnDayClick !== undefined ? options.hideOnDayClick : true,
    hideOnEnter: options.hideOnEnter !== undefined ? options.hideOnEnter : true,
    min: options.min || moment('1986-01-01'),
    max: options.max || moment().add(1, 'year').month(11),
    months: options.months || moment.months(),
    days: options.days || moment.weekdaysShort(),
    inputId: options.inputId || uuid(),
    inputName: options.name || 'dpicker-input',
    isEmpty: options.model !== undefined && !options.model ? true : false
  };
  this.onChange = options.onChange;
  this.modifier = options.modifier;
  this._projector = maquette.createProjector();
  this._events = this._loadEvents();
  if (DPicker.modules) {
    this._loadModules();
  }
  document.addEventListener('click', this._events.hide);
  var render = this.render(this._events, this._data, [this.renderYears(this._events, this._data), this.renderMonths(this._events, this._data), this.renderDays(this._events, this._data)]);
  var elementContainer;
  var renderContainer;
  if (element.tagName === 'INPUT') {
    if (!element.parentNode) {
      throw new ReferenceError('Can not init DPicker on an input without parent node');
    }
    this._data.inputId = element.getAttribute('id') || this._data.inputId;
    this._data.inputName = element.getAttribute('name') || this._data.inputName;
    if (element.getAttribute('type') == 'date') {
      element.setAttribute('type', 'text');
    }
    ;
    [['format', 'format'], ['min', 'min'], ['max', 'max'], ['value', 'model']].map(function(e, i) {
      var dataKey = e[1];
      e = e[0];
      var attr = element.getAttribute(e);
      if (!attr) {
        return;
      }
      if (dataKey !== 'format') {
        $__1._data[dataKey] = moment(attr, $__1._data.format);
      } else {
        $__1._data[dataKey] = attr;
      }
    });
    this._projector.merge(element, this.renderInput(this._events, this._data));
    elementContainer = element.parentNode;
    elementContainer.classList.add('dpicker');
    renderContainer = render;
  } else {
    renderContainer = this.renderContainer(this._events, this._data, [this.renderInput(this._events, this._data), render]);
    elementContainer = element;
  }
  this._projector.append(elementContainer, renderContainer);
  elementContainer.setAttribute('id', this._container);
  elementContainer.addEventListener('keydown', this._events.keyDown);
  return this;
}
DPicker.prototype._loadModules = function loadModules() {
  var $__1 = this;
  var $__3 = this,
      $__4 = function(module) {
        if (!DPicker.modules.hasOwnProperty(module)) {
          return 0;
        }
        var $__7 = function(event) {
          if (!DPicker.modules[module].hasOwnProperty(event)) {
            return 0;
          }
          var internal = event + '-internal';
          $__3._events[internal] = $__3._events[event];
          $__3._events[event] = function(evt) {
            if ($__1._events[internal]) {
              $__1._events[internal](evt);
            }
            DPicker.modules[module][event].bind($__1)(evt);
          };
        },
            $__8;
        $__6: for (var event in DPicker.modules[module]) {
          $__8 = $__7(event);
          switch ($__8) {
            case 0:
              continue $__6;
          }
        }
      },
      $__5;
  $__2: for (var module in DPicker.modules) {
    $__5 = $__4(module);
    switch ($__5) {
      case 0:
        continue $__2;
    }
  }
};
DPicker.prototype._loadEvents = function loadEvents() {
  var $__1 = this;
  return {
    hide: function(evt) {
      if ($__1._data.display === false) {
        return;
      }
      var node = evt.target;
      if (isElementInContainer(node.parentNode, $__1._container)) {
        return;
      }
      $__1._data.display = false;
      $__1._projector.scheduleRender();
    },
    inputChange: function(evt) {
      $__1._data.input = evt.target.value;
      if (!evt.target.value) {
        $__1._data.isEmpty = true;
      } else {
        var newModel = moment(evt.target.value, $__1._data.format);
        if (newModel.isValid()) {
          $__1._data.model = newModel;
        }
        $__1._data.isEmpty = false;
      }
      $__1.onChange();
    },
    inputBlur: function(evt) {
      if ($__1._data.display === false) {
        return;
      }
      var node = evt.relatedTarget || evt.target;
      if (isElementInContainer(node.parentNode, $__1._container)) {
        return;
      }
      $__1._data.display = false;
    },
    inputFocus: function(evt) {
      $__1._data.display = true;
      if (evt.target && evt.target.select) {
        evt.target.select();
      }
    },
    yearChange: function(evt) {
      $__1._data.isEmpty = false;
      $__1._data.model.year(evt.target.options[evt.target.selectedIndex].value);
      $__1.onChange();
    },
    monthChange: function(evt) {
      $__1._data.isEmpty = false;
      $__1._data.model.month(evt.target.options[evt.target.selectedIndex].value);
      $__1.onChange();
    },
    dayClick: function(evt) {
      evt.preventDefault();
      $__1._data.model.date(evt.target.value);
      $__1._data.isEmpty = false;
      $__1.onChange();
      if ($__1._data.hideOnDayClick) {
        $__1._data.display = false;
      }
    },
    dayKeyDown: function() {},
    keyDown: function(evt) {
      if (!$__1._data.hideOnEnter) {
        return;
      }
      var key = evt.which || evt.keyCode;
      if (key !== 13 && key !== 27)
        return;
      document.getElementById($__1.inputId).blur();
      $__1._data.display = false;
    }
  };
};
DPicker.prototype.renderInput = injector(function renderInput(events, data, toRender) {
  return h('input#' + data.inputId, {
    value: data.isEmpty ? '' : data.model.format(data.format),
    type: 'text',
    min: data.min.format(data.format),
    max: data.max.format(data.format),
    format: data.format,
    onchange: events.inputChange,
    onblur: events.inputBlur,
    onfocus: events.inputFocus,
    name: data.inputName
  });
});
DPicker.prototype.renderContainer = injector(function renderInput(events, data, toRender) {
  return h('div.dpicker', toRender.map(function(e) {
    return e();
  }));
});
DPicker.prototype.render = injector(function render(events, data, toRender) {
  return h('div.dpicker-container', {classes: {
      'dpicker-visible': data.display,
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
    options.push(h('option', {
      value: futureYear,
      selected: futureYear === modelYear,
      key: futureYear
    }, '' + futureYear));
  }
  return h('select', {
    onchange: events.yearChange,
    name: 'dpicker-year'
  }, options);
});
DPicker.prototype.renderMonths = injector(function renderMonths(events, data, toRender) {
  var modelMonth = data.model.month();
  var currentYear = data.model.year();
  var months = data.months;
  if (data.max.year() == currentYear) {
    var maxMonth = data.max.month();
    months = months.filter(function(e, i) {
      return i <= maxMonth;
    });
  } else if (data.min.year() == currentYear) {
    var minMonth = data.min.month();
    months = months.filter(function(e, i) {
      return i >= minMonth;
    });
  }
  return h('select', {
    onchange: events.monthChange,
    name: 'dpicker-month'
  }, months.map(function(e, i) {
    return h('option', {
      value: i,
      selected: i === modelMonth,
      key: i
    }, e);
  }));
});
DPicker.prototype.renderDays = injector(function renderDays(events, data, toRender) {
  var daysInMonth = data.model.daysInMonth();
  var daysInPreviousMonth = data.model.clone().subtract(1, 'months').daysInMonth();
  var firstDay = +(data.model.clone().date(1).format('e')) - 1;
  var currentDay = data.model.date();
  var rows = new Array(Math.ceil(.1 + (firstDay + daysInMonth) / 7)).fill(0);
  var day;
  var dayActive;
  return h('table', [h('tr', data.days.map(function(e) {
    return h('th', e);
  })), rows.map(function(e, row) {
    return h('tr', {key: row}, new Array(7).fill(0).map(function(e, col) {
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
        }
        day++;
      }
      return h('td', {classes: {
          'dpicker-active': dayActive,
          'dpicker-inactive': !dayActive
        }}, [h(dayActive ? 'button' : 'span', {
        value: day,
        onclick: dayActive ? events.dayClick : noop,
        type: dayActive ? 'button' : null,
        onkeydown: dayActive ? events.dayKeyDown || noop : noop,
        classes: {'dpicker-active': currentDay === day}
      }, day)]);
    }));
  })]);
});
Object.defineProperties(DPicker.prototype, {
  'container': {get: function() {
      return this._container;
    }},
  'inputId': {get: function() {
      return this._data.inputId;
    }},
  'input': {get: function() {
      return this._data.input;
    }},
  'onChange': {
    set: function(onChange) {
      var $__1 = this;
      this._onChange = function() {
        if ($__1.modifier) {
          $__1.modifier();
        }
        return !onChange ? false : onChange($__1._data);
      };
    },
    get: function() {
      return this._onChange;
    }
  },
  'modifier': {
    set: function(modifier) {
      var $__1 = this;
      if (!modifier) {
        this._modifier = null;
        return;
      }
      this._modifier = function() {
        modifier.bind($__1)();
      };
    },
    get: function() {
      return this._modifier;
    }
  }
});
;
['model', 'format', 'display', 'months', 'days', 'inputName', 'min', 'max'].forEach(function(e) {
  Object.defineProperty(DPicker.prototype, e, {
    get: function() {
      return this._data[e];
    },
    set: function(newValue) {
      if (e === 'model') {
        this._data.isEmpty = !newValue;
        this._data[e] = newValue ? newValue : this._data[e];
      } else {
        this._data[e] = newValue;
      }
      this._projector.scheduleRender();
    }
  });
});
DPicker.modules = {};

  return DPicker;
}));
