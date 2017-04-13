# Changelog

## 5.0.2

- Fix sibling months day click gave incorrect date

## 5.0.1

- Globals are evil. By trying to make things easy to use, we declared a global `window.DPicker` variable. Since `5.0.1` it's not the case anymore and it will be declared as `window.dpicker`.
It's recommended that you use a bundle system though (webpack, rollup, browserify...).

- Plugins are exporting a `function`. Makes things easier to pre-build packages. This means that this won't work anymore:

```javascript
<script type="text/javascript" src="https://unpkg.com/dpicker@5.0.0/dist/dpicker.min.js"></script>
<script type="text/javascript" src="https://unpkg.com/dpicker@5.0.0/dist/dpicker.time.min.js"></script>
```

To get date + time, you should use:

```javascript
<script type="text/javascript" src="https://unpkg.com/dpicker@5.0.0/dist/dpicker.datetime.min.js"></script>
```

Or the package with every module:

```javascript
<script type="text/javascript" src="https://unpkg.com/dpicker@5.0.0/dist/dpicker.datetime.all.js"></script>
```

## 5.0.0

- Use browserify instead of gulp
- Use real dom, real dates ([nanomorph](https://github.com/yoshuawuyts/nanomorph) for diffing and [bel](https://github.com/shama/bel)
- Use [standard](https://github.com/feross/standard)
- Get rid of momentjs hard dependency (still required for now)
- Implement a Date Adapter for future libraries support
- Simplify plugins api

No more `_modules` stuff. Just simple objects creation:

```javascript
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

- Incremental builds

You can use `dpicker.datetime.js` directly. Coming soon builds with `date-fns`. Available builds:

```
dist/dpicker.all.min.js.gz:  7.698 kb
dist/dpicker.arrow-navigation.min.js.gz:  0.9410000000000001 kb
dist/dpicker.core.min.js.gz:  4.892 kb
dist/dpicker.datetime.min.js.gz:  6.947 kb
dist/dpicker.min.js.gz:  5.699 kb
dist/dpicker.modifiers.min.js.gz:  0.58 kb
dist/dpicker.navigation.min.js.gz:  0.6900000000000001 kb
dist/dpicker.time.min.js.gz:  2.08 kb
dist/polyfills.min.js.gz:  4.5200000000000005 kb
```

- Improve docs (A LOT) https://soyuka.github.io/dpicker thanks to [jsdoc2md](https://github.com/jsdoc2md/jsdoc-to-markdown) and [docsify](https://github.com/QingWei-Li/docsify/)
- Build a decent demo using cycle.js
- naming public stuff #33

`_events` => `events`
`_data` => `data`

- new getter for `empty`

## 4.2.0

`onChange` now has a second argument giving informations about the recent change, for example:

```javascript
dpicker.onChange = function(data, event) {
  console.log('Model changed? %s', event.modelChanged ? 'yes' : 'no')
  console.log('DPicker event: %s', event.name)
  console.log('DPicker original event: %s', event.event)
}
```

## 4.0.9

- Adds an option to enable sibling month days

## 4.0.8

- Adds an option `concatHoursAndMinutes` to merge hours and minutes in one `select`

## 4.0.0

- Drop hyperscript library, it's not needed anymore and it's not possible to add a custom one
- An invalid Date doesn't reset the value to the closest correct one, it leaves the choice to the user instead
- A class `.invalid` is added to the input
- `aria-*` attributes are now working

## 3.1.1

Add touch friendly behavior #20

## 3.1.0

Drop maquettejs hard dependency (see #1). You can now use your own hyperscript library, for example with mithriljs:

```
let dpicker = DPicker(label, {
  h: mithril,
  mount: function(element, toRender) {
    mithril.render(element, toRender())
  },
  redraw: mithril.redraw
})
```

## 3.0.0

`time-format` renamed to `meridiem`

## 2.0.0

`isEmpty` renamed `empty`

## 1.3.0

Drop `previousYear` and `futureYear`. Those are replaced by `min` and `max`:
- `input[type="date"]` polyfill (#2)
- allows to change the months selection on max/min dates
