# DPicker

<img src="https://soyuka.github.io/dpicker/logo.svg" width="140px">

[![Build Status](https://img.shields.io/travis/soyuka/dpicker.svg)](https://travis-ci.org/soyuka/dpicker)
[![codecov](https://img.shields.io/codecov/c/github/soyuka/dpicker.svg)](https://codecov.io/gh/soyuka/dpicker)

A framework-agnostic minimal date picker.

## Quick start

```html
<label>
  <input type="datetime">
</label>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.13.0/moment.min.js"></script>
<script type="text/javascript" src="https://unpkg.com/dpicker@latest/dist/dpicker.all.min.js"></script>
<script>
  [].slice.call(document.querySelectorAll('input[type="date"],input[type="datetime"]')).forEach(function(e){new dpicker(e);});
</script>
```

## Read the docs

- [Full Documentation (web)](https://soyuka.github.io/dpicker/)
- [/docs](https://github.com/soyuka/dpicker/tree/master/docs)

## License

MIT
