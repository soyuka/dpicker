[![Build Status](https://travis-ci.org/soyuka/dpicker.svg?branch=master)](https://travis-ci.org/soyuka/dpicker)
[![codecov](https://codecov.io/gh/soyuka/dpicker/branch/master/graph/badge.svg)](https://codecov.io/gh/soyuka/dpicker)

A framework-agnostic minimal date picker.

## Installation

### npm

```
npm install dpicker --save
```

### bower

```
bower install dpicker --save
```

!> Package managers are only referencing `dpicker.core.js`! This is useful to build your own package! See below for pre-built packages.

To keep `dpicker` small, every new feature is added through a module. You can either use those separatly, or use one of the pre-built package.

We've built-in the following for an easy installation (suffix with `.min.js` for the minified version):

- `dpicker.all` contains every module (~7.7kb)
- `dpicker.datetime` contains only core and time (~6.9kb)
- `dpicker` contains core with momentjs adapter (~5.6kb)
- `dpicker.core` contains only core (~4.89kb)

Modules alone (needs the core to be included first):

- `dpicker.arrow-navigation` enable keyboard arrows to navigate between days (~0.1kb)
- `dpicker.modifiers` enable modifiers, for example `+` to get current day, `+100` to get the date in 100 days. (~0.5kb)
- `dpicker.time` enable time (~2kb)

For example with the [unpkg cdn](https://unpkg.com):

```html
<script type="text/javascript" src="https://unpkg.com/dpicker@DPICKER_VERSION/dist/dpicker.datetime.min.js"></script>
```

Is the same as:

```html
<script type="text/javascript" src="https://unpkg.com/dpicker@DPICKER_VERSION/dist/dpicker.min.js"></script>
<script type="text/javascript" src="https://unpkg.com/dpicker@DPICKER_VERSION/dist/dpicker.time.min.js"></script>
```

For old browser support, you will need the `polyfill` file:

```html
<script type="text/javascript" src="https://unpkg.com/dpicker@DPICKER_VERSION/dist/polyfills.min.js"></script>
```

?> Those polyfills are [array.prototype.fill](https://www.npmjs.com/package/array.prototype.fill) and [dom4](https://www.npmjs.com/package/dom4)

The default library to handle dates is `momentjs`, just add it to your script:

```html
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.13.0/moment.min.js"></script>
```

?> I'm working on getting `date-fns` as alternative, please let me know if you wish to see other date adapters. Want to build your own take a look at the [Date adapter section](#date-adapter)

## Usage

To create a date picker, just init the DPicker module within a container:

```html
<div id="my-datepicker"></div>
<script>
var dp = new DPicker(document.getElementById('my-datepicker'))
</script>
```

If you have an input already, you can init the datepicker with it, the date picker container will be the input parent node:

```html
<label for="my-dpicker">
  Pick a date:
  <input type="date" id="my-dpicker" />
</label>
<script>
var dp = new DPicker(document.querySelector('input[type="date"]'))
</script>
```

## Examples

### Html initalization

Let's initialize every `date` and `datetime` inputs with DPicker by using this ugly one-liner:

```javascript
[].slice.call(document.querySelectorAll('input[type="date"],input[type="datetime"]')).forEach(function(e){new DPicker(e);});
```

HTML can now take multiple formats, the simplest would be:

```html
<label for="dp-ex">Choose a date
  <input id="dp-ex" type="date" />
</label>
```

With a custom format and value:

```html
<label for="dp-ex">Choose a date
  <input id="dp-ex" type="date" value="10/10/1999" format="DD/MM/YYYY" />
</label>
```

Or with every available options:

```html
<label for="dp-ex">Choose a date
  <input id="dp-ex" type="date" min="24/06/1991" max="20/08/2000" value="10/10/1999" format="DD/MM/YYYY" />
</label>
```

Note that every specified attribute have to be strings, and if it's a date it should be in the given format.

Now with time (24h format):

```html
<label for="dp-ex">Choose date and time
  <input id="dp-ex" type="datetime" format="DD/MM/YYYY HH:mm" />
</label>
```

Or with AM/PM time format (specify the time format, ie: 12, 12h)

```html
<label for="dp-ex">Choose date and time
  <input id="dp-ex" type="datetime" format="DD/MM/YYYY hh:mm A" meridiem="true" />
</label>
```

### Javascript

Let's do the oposite by declaring a simple html container:

```html
<div id="dpicker"></div>
```

Basic initalization:

```javascript
var container = document.getElementById('dpicker')
var dp = new DPicker(container)
```

Setup almost every option:

```javascript
var container = document.getElementById('dpicker')
var dp = new DPicker(container, {
  model: moment(), //today
  min: moment('1986-01-01'),
  max: moment().add(1, 'year').month(11), //today + 1 year
  format: 'DD/MM/YYYY hh:mm A',
  time: true, //add time
  meridiem: true, //12h format
  months: moment.monthsShort(),
  days: moment.weekdaysMin()
})
```

More options are available, for a complete list [check the api documentation](_api#dpickerelement-options).

Change values during the date picker life cycle:

```javascript
var container = document.getElementById('dpicker')
var dp = new DPicker(container)
// do things

dp.format = 'DD/MM/YYYY'
dp.min = moment('01/01/1991')
dp.max = moment('01/01/2020')
dp.time = true
```

Available properties are listed in the [api documentation](_api#dpickerelement-options), where [some properties](_api#dpickerproperties) belong to modules.

Let's get further with Javascript with the [`onChange` method](_api#onchangedata-dpickerevent). This is a hook to listen to any change that comes from DPicker. It helps integrating the date picker in any framework.

```javascript
var container = document.getElementById('dpicker')
var dp = new DPicker(container)

dp.onChange = function(data, DPickerEvent) {
  // has the model changed?
  console.log(DPickerEvent.modelChanged)
  // the name of the internal event
  console.log(DPickerEvent.name)
  // the origin DOM event
  console.dir(DPickerEvent.event)
}

```

## CSS

No css is included by default, here's the minimal style:

```css
td.dpicker-inactive {
  color: grey;
}

button.dpicker-active {
  background: coral;
}

.dpicker-invisible {
  display: none;
}
.dpicker-visible {
  display: block;
}
```

[You can find alternatives stylesheets here.](_stylesheets)

## Modules

### Concept

As stated above, DPicker has a *built-in module system*. Actually, as DPicker is built with two core concepts, it's nothing more than:

1. render methods
2. event listeners

A render method is a context-less function, which must return one DOM element.
It always has two parameters:

- `events` an Object with every event listener available in DPicker
- `data` an Object with the DPicker data

Example:

```javascript
DPicker.renders.myRenderFn = function (data, events) {
  var el = document.createElement('div')
  el.onclick = events.doSomeStuff

  return el
}
```

An event listener is a function that will be executed in DPicker context. This means that `this.data` will be the `data` object of our date picker.

Example:

```javascript
DPicker.events.doSomeStuff = function (evt) {
  evt.preventDefault()
  this.data.foo = 'foobar'
  this.redraw() // Call the public redraw method, those are documented in the API docs
}
```

### Example

Let's build a module that will add two arrows to navigate between previous and next months.

 To make this easy, we will use the [`bel`](https://github.com/shama/bel) module. This module can then be [`yo-yoified`](https://github.com/shama/yo-yoify) or [`babel-yo-yoified`](https://github.com/goto-bus-stop/babel-plugin-yo-yoify) to transform our html text to real DOM elements.

First, let's add two rendering methods for our buttons:

```javascript
const html = require('bel')

DPicker.renders.previousMonth = function renderPreviousMonth(events, data) {
  return html`<button onclick="${events.previousMonth}" class="dpicker-previous-month"></button>`
}

DPicker.renders.nextMonth = function renderNextMonth(events, data) {
  return html`<button onclick="${events.nextMonth}" class="dpicker-next-month"></button>`
}
```

Now let's add two events to make this work. Note that to play with dates you should use the [`DateAdapter`](_api#momentadapter):

```javascript
DPicker.events.previousMonth = function previousMonth(evt) {
  // go one month back
  this.model = DPicker.dateAdapter.subMonths(this.data.model, 1)
  // redraw the DPicker
  this.redraw()
  // This is not mandatory but is good if you want your changes to reach DPicker.onChange
  this.onChange({modelChanged: true, name: 'previousMonth', event: evt})
}

DPicker.events.nextMonth = function nextMonth(evt) {
  this.model = DPicker.dateAdapter.addMonths(this.data.model, 1)
  this.redraw()
  this.onChange({modelChanged: true, name: 'nextMonth', event: evt})
}
```

We're done. To enable your render functions, you have to specify their keys in the `order` option:

```javascript
new DPicker(element, {order: ['previousMonth', 'months', 'years', 'nextMonth', 'days', 'time']})
```

This module is actually available [here](https://github.com/soyuka/dpicker/blob/development/src/plugins/navigation.js).

If you don't want to use `bel`, just use native DOM elements. For example, this adds a confirm button:

```javascript
//add 'closeButton' to the `order` array
DPicker.renders.closeButton = function renderCloseButton(events, data) {
  const button = document.createElement('button')
  button.innerText = 'Confirm'
  button.type = 'button'
  button.classList.add('dpicker-close-button')
  button.addEventListener('click', events.hidePicker)
  return button
}

DPicker.events.hidePicker = function hidePicker() {
  this.display = false
}
```

### Go further

Sometimes, you just want to do more work when one of the [available events or methods](_api) from DPicker are called. For this to work we can `decorate` public methods or events.

For example, let's add a call when `dpicker#initialize` is called:

```javascript
DPicker.prototype.initialize = DPicker.decorate(DPicker.prototype.initialize, function myPluginInit () {
  //do some stuff
})
```

Or with an event:

```javascript
DPicker.events.dayKeyDown = DPicker.decorate(DPicker.events.dayKeyDown, function DayKeyDown (evt) {
  // a keydown event was called on a day
})
```

!> Note that if a decoration returns `false`, it'll stop the call chain.

Last but not least, you can add options to your plugin. DPicker will automatically try to instantiate the given properties via:

1. attributes (the DOM attributes of the given `input`)
2. options (the options given to `DPicker` constructor)
3. a default value

Properties should be added like this:

```javascript
DPicker.properties.myOption = false
```

This sets up `this.data.myOption`, and has a default `false` value.

If you want to customize the behavior on the `attributes` parsing, you can use a `function`:

```javascript
DPicker.properties.step = function getStepAttribute (attributes) {
  return attributes.step ? parseInt(attributes.step, 10) : 1
}
```

## Framework agnostic

!> Those are only base examples, please adapt them to your needs!

### Angular 1

?> Simple Angular 1 example that leverages ngModelCtrl. Some more bits are needed for validation.

```javascript
angular.module('DPicker', [])

angular.module('DPicker')
.directive('dpDpicker', function() {
	return {
		restrict: 'A',
		scope: {
			ngModel: '='
		},
		require: 'ngModel',
		link: function(scope, element, attrs, ngModelCtrl) {
			scope.dpicker = new DPicker(element[0])
			scope.dpicker.onChange = function(data, DPickerEvent) {
        if (DPickerEvent.modelChanged === true) {
          ngModelCtrl.$setViewValue(scope.dpicker.model)
        }
			}

			if (scope.ngModel && scope.ngModel instanceof Date) {
				scope.dpicker.model = scope.ngModel
			}

			ngModelCtrl.$setViewValue(scope.dpicker.empty ? null : scope.dpicker.model)

			attrs.$observe('ngModel', function(value) {
				if (value instanceof Date) {
					scope.dpicker.model = value
				}
			})
		}
	}
})
```

### Angular 2

?> This Angular 2 example assumes that the ngModel is a Date. This example also attach an angular 2 validator.

```javascript
import { forwardRef, ElementRef, Directive, Input, OnInit } from '@angular/core'
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS, AbstractControl } from '@angular/forms'

import * as DPicker from 'dpicker'

@Directive({
  selector: '[prefixDpicker]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PrefixDpickerDirective),
    multi: true
  },
  {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => PrefixDpickerDirective),
    multi: true
  }
  ],
})
export class PrefixDpickerDirective implements ControlValueAccessor, OnInit {
  dpicker: any
  @Input() max: Date
  @Input() min: Date

  private onChangeCallback: (_: any) => void = () => {}
  private onTouchedCallback: () => void = () => {}

  constructor(public elementRef: ElementRef) {}

  ngOnInit() {
    try {
      this.dpicker = new DPicker(this.elementRef.nativeElement, {min: this.min, max: this.max})
    } catch (e) {
      console.error(e.message)
    }

    this.dpicker.onChange = (data, DPickerEvent) => {
      if (DPickerEvent.modelChanged === true) {
        this.onChangeCallback(this.dpicker.model)
      }

      this.onTouchedCallback()
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn
  }

  writeValue(value: any) {
    this.dpicker.model = value
  }

  validate(c: AbstractControl): { [key: string]: any } {
    this.dpicker.isValid(c.value)

    if (this.dpicker.valid === true) {
      return null
    }

    return {validDate: false}
  }
}
```

Html:

```html
<form #f='ngForm'>
  valid: {{f.valid}} {{foo}}
   <div>
     <input type='text' prefixDpicker max='12/12/2016' [(ngModel)]='foo' name='bar' />
   </div>
</form>
```

### Cycle.js

To bundle `DPicker` in the cyclejs DOM, we are setting a [`snabbdom` hook](https://github.com/snabbdom/snabbdom#hooks) on `insert`. This allows us to use the real `Element`, once appended to the DOM.

```javascript
import {div} from '@cycle/dom'
import xs from 'xstream'

export function CycleDPicker (sources) {
  const Dpicker$ = xs.create({
    start: (listener) => {
      let dpicker

      const d = div('.dp', {
        hook: {
          insert: (vnode) => {
            console.log('vnode', vnode)
            dpicker = new DPicker(vnode.elm, sources)
            vnode.data.value = dpicker.model

            dpicker.onChange = function(data, modelChanged) {
              if (modelChanged === false) {
                return
              }

              vnode.data.value = data.model
              listener.next(vnode)
            }

            listener.next(vnode)
          }
        }
      })

      listener.next(d)
    },
    stop: () => {},
    id: 0
  })

  return {
    DOM: Dpicker$
  }
}
```

?> **TODO** add more examples

## Date Adapter

Because framework agnostic also means that we don't want to force you to use one or another Date library, DPicker uses a `DateAdapter`. It's a simple bridge module that exposes needed functions. If you want to implement your own date adapter, implement the [DateAdapter as documented in the API](_api#momentadapter). Dates MUST be immutable!

Referencing the `dateAdapter` of your choice is done through the static property:

```javascript
DPicker.dateAdapter = MyDateAdapter
```

For this to work nicely, I'd recommend to use `dpicker.core.js` and to build with `browserify`. The end file will look like this:

```javascript
const DPicker = require('dpicker')
const MyDateAdapter = require('./my.date.adapter')

DPicker.dateAdapter = MyDateAdapter

// Require some extensions here
require('node_modules/dpicker/dist/dpicker.time.js')
```

Use our 100% coverage test case instead of building your own tests!

## Why?

I was searching for a simple date picker, with only basic features and an ability to work with any framework, or event plain javascript (VanillaJS).
If you know one that does have less than 1000 SLOC, please let me know.

This date picker:

- is light and easy to use, especially easy to maintain (core has ~500 SLOC), uses `Date` and `DOM` objects.
- is compliant and can be extended to suit your needs
- no default css so that it fits well with foundation/bootstrap
- is framework agnostic
- has HTML attributes compatibility with `input[type="date"]` (adds a `format` attribute) and `input[type="datetime"]` (adds a `meridiem` attribute on top of the `format` one if you need 12 hours time range). Define minutes step through the `step` attribute.
- has in mind to work with any Date module (momentjs, date-fns)
- extensible through modules, use the core and implement your specific needs easily

What I think is good, and isn't straightforward in other date pickers is that your input's `Date` instance is separated from the input real value:

```javascript
const dpicker = new DPicker(input)

console.log(dpicker.model) //the Date instance
console.log(dpicker.input) //the input value, a formatted date
```

## Credits

DPicker refactor (from `4` to `5`) motivation:

- [date-fns](https://github.com/date-fns/date-fns) - because I think this is a good alternative to momentjs, especially since it's immutable
- [nanomorph](https://github.com/yoshuawuyts/nanomorph), in fact [@yoshuawuyts](https://github.com/yoshuawuyts) writings in general
- [bel](https://github.com/shama/bel), why did I discover this in 2017?
- [babel-plugin-yo-yoify](https://github.com/goto-bus-stop/babel-plugin-yo-yoify) for the reactivity and because this works great
- [@florianpircher](https://github.com/florianpircher), [@stereonom](https://github.com/stereonom), [@thcolin](https://github.com/thcolin) for the motivation, the really good bug reports, and the design ideas/talks

DPicker docs:

- [jsdoc2md](https://github.com/jsdoc2md/jsdoc-to-markdown)
- [docsify](https://github.com/QingWei-Li/docsify/)

## License

```
The MIT License (MIT)

Copyright (c) 2016 Antoine Bluchet

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
