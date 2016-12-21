# Changelog

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
