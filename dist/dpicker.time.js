
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define('DPicker.modules.time', ['DPicker', 'moment'], factory);
    } else if (typeof module === 'object' && module.exports) {
			  //node
        module.exports = factory(require('dpicker'), require('moment'));
    } else {
        // Browser globals (root is window)
        root.DPicker.modules.time = factory(root.DPicker, root.moment);
    }
}(this, function (DPicker, moment) {
"use strict";
if (!DPicker) {
  throw new ReferenceError('DPicker is required for this extension to work');
}
var MINUTES = new Array(60).fill(0).map(function(e, i) {
  return i;
});
var HOURS24 = new Array(24).fill(0).map(function(e, i) {
  return i;
});
var HOURS12 = new Array(12).fill(0).map(function(e, i) {
  return i === 0 ? 12 : i;
});
HOURS12.push(HOURS12.shift());
function getHoursMinutes(data) {
  var hours = data.meridiem ? HOURS12 : HOURS24;
  var minutes = MINUTES.filter(function(e) {
    return e % data.step === 0;
  });
  ;
  [data.min, data.max].map(function(e, i) {
    if (data.model.isSame(e, 'day')) {
      var xHours = +data.meridiem ? e.format('h') : e.hours();
      hours = hours.filter(function(e) {
        return i === 0 ? e >= xHours : e <= xHours;
      });
      if (data.model.isSame(e, 'hours')) {
        var xMinutes = e.minutes();
        minutes = minutes.filter(function(e) {
          return i === 0 ? e >= xMinutes : e <= xHours;
        });
      }
    }
  });
  return {
    hours: hours,
    minutes: minutes
  };
}
function padLeftZero(v) {
  return v < 10 ? '0' + v : '' + v;
}
var renderTime = function renderTime(events, data, toRender) {
  if (!data.time) {
    return DPicker.h('span', {
      style: 'display: none;',
      class: 'dpicker-time'
    });
  }
  var modelHours = data.model.hours();
  if (data.meridiem) {
    modelHours = modelHours > 12 ? modelHours - 12 : modelHours;
    modelHours = modelHours === 0 ? 12 : modelHours;
  }
  var $__1 = getHoursMinutes(data),
      hours = $__1.hours,
      minutes = $__1.minutes;
  var modelMinutes = data.model.minutes();
  var selects = [];
  if (data.concatHoursAndMinutes) {
    selects.push(DPicker.h('select', {
      onchange: events.minuteHoursChange,
      name: 'dpicker-time',
      'aria-label': 'Time'
    }, [].concat.apply([], minutes.map(function(minute) {
      return hours.map(function(hour) {
        return (hour + ":" + minute);
      });
    })).sort().map(function(value) {
      return DPicker.h('option', {
        value: value,
        selected: value === (modelHours + ":" + modelMinutes),
        key: value
      }, value.split(':').map(padLeftZero).join(':'));
    })));
  } else {
    selects.push(DPicker.h('select', {
      onchange: events.hoursChange,
      name: 'dpicker-hours',
      'aria-label': 'Hours'
    }, hours.map(function(e, i) {
      return DPicker.h('option', {
        value: e,
        selected: e === modelHours,
        key: e
      }, padLeftZero(e));
    })), DPicker.h('select', {
      onchange: events.minutesChange,
      name: 'dpicker-minutes',
      'aria-label': 'Minutes'
    }, minutes.map(function(e) {
      return DPicker.h('option', {
        value: e,
        selected: e === modelMinutes,
        key: e
      }, padLeftZero(e));
    })));
  }
  if (data.meridiem) {
    var modelMeridiem = data.model.format('A');
    selects.push(DPicker.h('select', {
      onchange: events.meridiemChange,
      name: 'dpicker-meridiem'
    }, ['AM', 'PM'].map(function(e) {
      return DPicker.h('option', {
        value: e,
        selected: modelMeridiem === e
      }, e);
    })));
  }
  return DPicker.h('span', {class: 'dpicker-time'}, selects);
};
var events = {
  hoursChange: function hoursChange(evt) {
    this._data.empty = false;
    var val = parseInt(evt.target.options[evt.target.selectedIndex].value, 10);
    if (this._data.meridiem) {
      if (this._data.model.format('A') === 'PM') {
        val = val === 12 ? 12 : val + 12;
      } else if (val === 12) {
        val = 0;
      }
    }
    this._data.model.hours(val);
    this._minutesStep();
    this.redraw(['input', 'container']);
    this.onChange();
  },
  minutesChange: function minutesChange(evt) {
    this._data.empty = false;
    this._data.model.minutes(evt.target.options[evt.target.selectedIndex].value);
    this.redraw(['input', 'container']);
    this.onChange();
  },
  minuteHoursChange: function minuteHoursChange(evt) {
    var val = evt.target.options[evt.target.selectedIndex].value.split(':');
    this._events.hoursChange({target: {
        options: [{value: val[0]}],
        selectedIndex: 0
      }});
    this._events.minutesChange({target: {
        options: [{value: val[1]}],
        selectedIndex: 0
      }});
  },
  meridiemChange: function meridiemChange(evt) {
    this._data.empty = false;
    var val = evt.target.options[evt.target.selectedIndex].value;
    var hours = this._data.model.hours();
    if (val === 'AM') {
      hours = hours === 12 ? 0 : hours - 12;
    } else {
      hours = hours === 12 ? 12 : hours + 12;
    }
    this._data.model.hours(hours);
    this.redraw(['input', 'container']);
    this.onChange();
  },
  inputChange: function() {
    this._minutesStep();
  }
};
var time = DPicker.modules.time = {
  events: events,
  render: {time: renderTime},
  properties: {
    time: {
      default: false,
      attribute: function(attributes) {
        var type = attributes.filter(function(e) {
          return e.name === 'type';
        })[0];
        return !type ? false : type.value === 'datetime' ? true : false;
      },
      getset: true
    },
    meridiem: {
      default: false,
      attribute: 'meridiem',
      getset: true
    },
    step: {
      default: 1,
      attribute: function(attributes) {
        var step = attributes.filter(function(e) {
          return e.name === 'step';
        })[0];
        return !step ? 1 : parseInt(step.value, 10);
      },
      getset: true
    }
  },
  calls: {
    _initialize: function timeParseInputAttributes(attributes) {
      this._minutesStep();
    },
    _modelSetter: function timeModelSetter(newValue) {
      this._minutesStep();
    }
  }
};
DPicker.prototype._minutesStep = function() {
  if (!this._data.time) {
    return;
  }
  var $__1 = getHoursMinutes(this._data),
      hours = $__1.hours,
      minutes = $__1.minutes;
  var modelMinutes = this._data.model.minutes();
  if (minutes.length === 0) {
    this._data.min.minutes(0);
    this._data.min.add(1, 'hours');
    var $__2 = getHoursMinutes(this._data),
        hours$__3 = $__2.hours,
        minutes$__4 = $__2.minutes;
  }
  if (this._data.model.minutes() < minutes[0]) {
    this._data.model.minutes(minutes[0]);
    modelMinutes = minutes[0];
  }
  if (modelMinutes > minutes[minutes.length - 1]) {
    this._data.model.minutes(0);
    this._data.model.add(1, 'hours');
    return;
  }
  if (this._data.step <= 1) {
    return;
  }
  minutes[minutes.length] = 60;
  modelMinutes = minutes.reduce(function(prev, curr) {
    return (Math.abs(curr - modelMinutes) < Math.abs(prev - modelMinutes) ? curr : prev);
  });
  minutes.length--;
  this._data.model.minutes(modelMinutes);
};

  return time;
}));
