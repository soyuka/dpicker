# DPicker

[![Build Status](https://travis-ci.org/soyuka/dpicker.svg?branch=master)](https://travis-ci.org/soyuka/dpicker)
[![Code Climate](https://codeclimate.com/github/soyuka/dpicker/badges/gpa.svg)](https://codeclimate.com/github/soyuka/dpicker)
[![Test Coverage](https://codeclimate.com/github/soyuka/dpicker/badges/coverage.svg)](https://codeclimate.com/github/soyuka/dpicker/coverage)

[Demo and full documentation](https://soyuka.github.io/dpicker/DPicker.html#demo)

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
  <input type="text" dpicker id="my-dpicker" />
</label>
<script>
var dp = new DPicker(document.querySelectorAll('[dpicker]')[0])
</script>
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

## Modules

To keep DPicker small (2.1Kb gz), external modules are available:

For example [arrowNavigation](https://soyuka.github.io/dpicker/DPicker.modules.module_arrowNavigation.html) allows the use of arrows on days to switch from one to another.

The [modifiers](https://soyuka.github.io/dpicker/DPicker.modules.module_modifiers.html) module adds modifiers, for example type `-100` `Enter` and you'll get the date `today - 100 days`

To know more about modules check out the [documentation](https://soyuka.github.io/dpicker/DPicker.html).

DPicker depends on [maquettejs](http://maquettejs.org/) (~3.4Kb gz) for virtual dom and [momentjs](http://momentjs.com/) (~15.3Kb gz) for date manipulation.

## License

MIT
