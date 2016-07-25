# DPicker

[![Build Status](https://travis-ci.org/soyuka/dpicker.svg?branch=master)](https://travis-ci.org/soyuka/dpicker)
[![Code Climate](https://codeclimate.com/github/soyuka/dpicker/badges/gpa.svg)](https://codeclimate.com/github/soyuka/dpicker)
[![Test Coverage](https://codeclimate.com/github/soyuka/dpicker/badges/coverage.svg)](https://codeclimate.com/github/soyuka/dpicker/coverage)

[Demo](https://soyuka.github.io/dpicker/demo/index.html)
[Styles](https://soyuka.github.io/dpicker/demo/styles.html)
[Documentation](https://soyuka.github.io/dpicker/DPicker.html)

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

## Usage

DPicker depends on moment and maquette. Those can be included with your favorite module loader or through a CDN, for example:

```html
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.13.0/moment.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/maquette/2.1.6/maquette.min.js"></script>
```

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
  <input id="dp-ex" type="datetime" format="DD/MM/YYYY hh:mm A" time-format="12"/>
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

To keep DPicker small (3.1Kb gz), external modules are available:

For example [arrowNavigation](https://soyuka.github.io/dpicker/DPicker.modules.module_arrowNavigation.html) allows the use of arrows on days to switch from one to another.

The [modifiers](https://soyuka.github.io/dpicker/DPicker.modules.module_modifiers.html) module adds modifiers, for example type `-100` `Enter` and you'll get the date `today - 100 days`

To know more about modules check out the [documentation](https://soyuka.github.io/dpicker/DPicker.html).

DPicker depends on [maquettejs](http://maquettejs.org/) (~3.4Kb gz) for virtual dom and [momentjs](http://momentjs.com/) (~15.3Kb gz) for date manipulation.

A usage example with angular is available [here](https://github.com/soyuka/dpicker/blob/master/demo/index.html#L56)

## Why?

I was searching for a simple date picker, with only basic features and an ability to work with any framework, or event plain javascript (VanillaJS).
If you know one that does have less than 1000 SLOC, please let me know.

This date picker:

- is light and easy to use, especially easy to maintain (~600 sloc) and to extend or add functionalities (see `onChange` and `modifier` methods).
- is framework agnostic, and no default css so that it fits well with foundation/bootstrap and angular/react
- has HTML attributes compatibility with `input[type="date"]` (adds a `format` attribute) and `input[type="datetime"]` (adds a `time-format` attribute on top of the `format` one if you need 12 hours time range)
- works with momentjs so that locale changes are a breeze

What I think is good, and isn't straightforward in other date pickers is that your input's `Date` instance is separated from the input real value:

```javascript
const dpicker = new DPicker(input)

console.log(dpicker.model) //the Moment.js instance
console.log(dpicker.input) //the input value, a formatted date
```

## License

MIT
