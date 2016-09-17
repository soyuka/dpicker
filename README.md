# DPicker

<img src="https://cdn.rawgit.com/soyuka/dpicker/master/logo.svg" width="140px">

[![Build Status](https://travis-ci.org/soyuka/dpicker.svg?branch=master)](https://travis-ci.org/soyuka/dpicker)
[![Code Climate](https://codeclimate.com/github/soyuka/dpicker/badges/gpa.svg)](https://codeclimate.com/github/soyuka/dpicker)
[![Test Coverage](https://codeclimate.com/github/soyuka/dpicker/badges/coverage.svg)](https://codeclimate.com/github/soyuka/dpicker/coverage)

[Demo](https://soyuka.github.io/dpicker/demo/index.html)
[Styles](https://soyuka.github.io/dpicker/demo/styles.html)
[Documentation](https://soyuka.github.io/dpicker/DPicker.html)

A compliant minimal date picker.

## Installation

### npm

```
npm install dpicker --save
```

### bower

```
bower install dpicker --save
```

Package managers are only referencing `dpicker.js`! If you need time, you have to load the `dpicker.time.js` file!

## Usage

DPicker depends on moment and the hyperscript library of your choice. Those can be included with your favorite module loader or through a CDN, for example:

```html
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.13.0/moment.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/maquette/2.1.6/maquette.min.js"></script>
```

Note that [maquettejs](http://maquettejs.org/) is the default supported hyperscript library. To use you own library (ie mithril, hyperscript or ReactDOM etc.), please [follow these instructions](#custom-hyperscript-library).

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
;[].slice.call(document.querySelectorAll('input[type="date"],input[type="datetime"]')).forEach(e => new DPicker(e));
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

More options are available, for a complete list [check the documentation](https://soyuka.github.io/dpicker/DPicker.html#demo).

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

Available properties are listed in the [documentation](https://soyuka.github.io/dpicker/DPicker.html)

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

[You can find alternatives stylesheets here.](https://soyuka.github.io/dpicker/demo/styles.html)

## Modules

To keep DPicker small (2.8Kb gz), external modules are available:

For example [arrowNavigation](https://soyuka.github.io/dpicker/DPicker.modules.module_arrowNavigation.html) allows the use of arrows on days to switch from one to another.

The [modifiers](https://soyuka.github.io/dpicker/DPicker.modules.module_modifiers.html) module adds modifiers, for example type `-100` `Enter` and you'll get the date `today - 100 days`

Want time? Add the [time](https://soyuka.github.io/dpicker/DPicker.modules.module_time.html) module!

You can also create a custom module so that DPicker reflects your needs. For example, adding two buttons to navigate through months is as easy as (add this code to `dpicker.month-navigation.js`):

```javascript
const renderPreviousMonth = DPicker.injector(function renderPreviousMonth(events, data, toRender) {
  return DPicker.h('button', { onclick: events.previousMonth }, '<') //add some appropriate attributes
})

const renderNextMonth = DPicker.injector(function renderNextMonth(events, data, toRender) {
  return DPicker.h('button', { onclick: events.nextMonth }, '>')
})

const monthNavigation = DPicker.modules.monthNavigation = {
  render: {
    previousMonth: renderPreviousMonth,
    nextMonth: renderNextMonth
  },
  events: {
    previousMonth: function previousMonth() {
       this._data.model.add(-1, 'month')
    },
    nextMonth: function nextMonth(evt) {
       this._data.model.add(1, 'month')
    }
  }
}
```

Make sure this code is loaded with DPicker. Then initialize a new DPicker by specifying a render order:

```javascript
new DPicker(document.getElementById('trythis'), {order: ['time', 'previousMonth', 'months', 'nextMonth', 'days'], time: true})
```

Now your date picker has two new buttons to select next/prev month in a click.

To know more about modules check out the [documentation](https://soyuka.github.io/dpicker/DPicker.html).

## Virtual DOM

DPicker depends on [momentjs](http://momentjs.com/) (~15.3Kb gz) for date manipulation and a hyperscript library for virtual dom. The recommended one is [maquettejs](http://maquettejs.org/) (~3.4Kb gz).

### Custom hyperscript library

To use your own hyperscript library, you have to declare 3 options:

- `h` the hyperscript function
- `mount(DOMElement container, Function toRender)` a function that mounts the virtual DOM to the DOM
- `redraw()` a function that forces the virtual DOM to re-render

For example, with [mithriljs](https://mithril.js.org) the DPicker would be instantiated like this:

```javascript
let mithril = require('mithril')

let label = document.createElement('label')
document.body.appendChild(label)

let dpicker = DPicker(label, {
  h: mithril,
  mount: function(element, toRender) {
    mithril.render(element, toRender())
  },
  redraw: mithril.redraw
})
```

### Angular

A usage example with angular is available [here](https://github.com/soyuka/dpicker/blob/master/demo/index.html#L150)

## Why?

I was searching for a simple date picker, with only basic features and an ability to work with any framework, or event plain javascript (VanillaJS).
If you know one that does have less than 1000 SLOC, please let me know.

This date picker:

- is light and easy to use, especially easy to maintain (core has ~500 SLOC)
- is compliant and can be extended for your needs, and no default css so that it fits well with foundation/bootstrap or angular/react
- has HTML attributes compatibility with `input[type="date"]` (adds a `format` attribute) and `input[type="datetime"]` (adds a `meridiem` attribute on top of the `format` one if you need 12 hours time range). Define minutes step through the `step` attribute.
- works with momentjs so that locale changes are a breeze
- extensible through modules, use the core and implement yourself your specific needs easily

What I think is good, and isn't straightforward in other date pickers is that your input's `Date` instance is separated from the input real value:

```javascript
const dpicker = new DPicker(input)

console.log(dpicker.model) //the Moment.js instance
console.log(dpicker.input) //the input value, a formatted date
```

## License

MIT
