# DPicker

<img src="https://cdn.rawgit.com/soyuka/dpicker/master/logo.svg" width="140px">

[![Build Status](https://travis-ci.org/soyuka/dpicker.svg?branch=master)](https://travis-ci.org/soyuka/dpicker)
[![codecov](https://codecov.io/gh/soyuka/dpicker/branch/master/graph/badge.svg)](https://codecov.io/gh/soyuka/dpicker)

A framework-agnostic minimal date picker.

## Quick start

```
<label for="dpicker">
  <input id="dpicker" type="datetime">
</label>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.13.0/moment.min.js"></script>
<script type="text/javascript" src="https://unpkg.com/dpicker@5.0.0-5/dist/dpicker.all.min.js"></script>
<script>
[].slice.call(document.querySelectorAll('input[type="date"],input[type="datetime"]')).forEach(function(e){new DPicker(e);});
</script>
```

## Read the docs

[Full documentation](https://soyuka.github.io/dpicker/)

## License

MIT
