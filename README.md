# DPicker

Basic date picker

![screen](screen.png)

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

## Options

```
{Moment} options.model Your own model instance, defaults to moment()
{Number} options.futureYear The latest year available in the date picker
{Number} options.minYear The minimum year (default to 1986)
{string} options.format The input format, a moment format, default to DD/MM/YYYY
```

## License

MIT
