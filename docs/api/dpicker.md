

<!-- Start src/dpicker.js -->

## uuid()

uuid generator
https://gist.github.com/jed/982883

## isElementInContainer(parent, containerId)

isElementInContainer tests if an element is inside a given id

### Params:

* **Element** *parent* a DOM node
* **String** *containerId* the container id

## DPicker

DPicker a simple date picker

### Params:

* **Element** *element* DOM element where you want the date picker or an input
* **Object** *[options={}]* 
* **Moment** *[options.model=moment()]* Your own model instance, defaults to moment() (can be set by the `value` attribute on an input, transformed to moment according to the given format)
* **Moment** *[options.min=1986-01-01]* The minimum date (can be set by the `min` attribute on an input)
* **Moment** *[options.max=today+1* year] The maximum date (can be set by the `max` attribute on an input)
* **string** *[options.format='DD/MM/YYYY']* The input format, a moment format (can be set by the `format` attribute on an input)
* **string** *[options.months=moment.months()]* Months array, see also moment.monthsShort()
* **string** *[options.days=moment.weekdaysShort()]* Days array, see also moment.weekdaysMin()
* **boolean** *[options.display=true]* 
* **boolean** *[options.hideOnDayClick=true]* Hides the date picker on day click
* **boolean** *[options.hideOnDayEnter=true]* Hides the date picker when Enter or Escape is hit
* **boolean** *[options.siblingMonthDayClick=false]* Enable sibling months day click
* **Function** *[options.onChange]* A function to call whenever the data gets updated
* **string** *[options.inputId=uuid|element.getAttribute('id')]* The input id, useful to add you own label (can only be set in the initiation phase) If element is an inputand it has an `id` attribute it'll be overriden by it
* **string** *[options.inputName='dpicker-input']* The input name. If element is an inputand it has a `name` attribute it'll be overriden by it
* **Array** *[options.order=['months',* 'years', 'time', 'days']] The dom elements appending order.
* **boolean** *[options.concatHoursAndMinutes=false]* Use only one select box for both hours and minutes

## _setSelected(element, test)

Helper to set the `selected` attribute on `<option>` tags

### Params:

* **Element** *element* 
* **boolean** *test* set selected when true

## _setData(key, values, isMoment)

_setData is a helper to set this._data values

### Params:

* **String** *key* 
* **Array** *values* the first value that is not undefined will be set in this._data[key]
* **Boolean** *isMoment* whether this value should be a moment instance

## _createGetSet(key)

Creates getters and setters for a given key
When the setter is called we will redraw

### Params:

* **String** *key* 

## _getContainer(container)

Gives the dpicker container and it's attributes
If the container is an input, the parentNode is the container but the attributes are the input's ones

### Params:

* **Element** *container* 

## _getRenderChild()

Allows to render more child elements with modules

### Return:

* Array<VNode>

## _mount()

Mount rendered element to the DOM

## isValid(date)

Checks whether the given model is a valid moment instance
This method does set the `.valid` flag by checking min/max allowed inputs
Note that it will return `true` if the model is valid even if it's not in the allowed range

### Params:

* **Moment** *date* 

### Return:

* **boolean** 

## renderInput()

Render input

### Return:

* **H** the rendered virtual dom hierarchy

## renderContainer()

Dpicker container if no input is provided
if an input is given, it's parentNode will be the container

```
div.dpicker
```

### Return:

* **H** the rendered virtual dom hierarchy

## render()

Render a DPicker

```
div.dpicker#[uuid]
  input[type=text]
  div.dpicker-container.dpicker-[visible|invisible]
```

See: DPicker#renderDays

### Return:

* **H** the rendered virtual dom hierarchy

## renderYears()

Render Years
```
select[name='dpicker-year']
```

### Return:

* **H** the rendered virtual dom hierarchy

## renderMonths()

Render Months
```
select[name='dpicker-month']
```

### Return:

* **H** the rendered virtual dom hierarchy

## renderDays()

Render Days
```
table
 tr
   td
     button|span
```

### Return:

* **H** the rendered virtual dom hierarchy

## initialize()

Called after parseInputAttributes but before render
Use it with modules to change things on initialization

## modelSetter(newValue)

The model setter, feel free to override through modules

### Params:

* **Moment** *newValue* 

Get container id

Get input id

Get current input value (not the model)

Set onChange method

Is the current input valid

Get/Set model, a Moment instance

## decorate(which, origin, key)

Creates a decorator

### Params:

* **String** *which* one of events, calls
* **Function** *origin* the origin function that will be decorated
* **String** *key* the key of the "which" we need to decorate

## hide(DOMEvent)

Hides the date picker if user does not click inside the container

### Params:

* **Event** *DOMEvent* 

## inputChange(DOMEvent)

Change model on input change

### Params:

* **Event** *DOMEvent* 

## inputBlur(DOMEvent)

Hide on input blur

### Params:

* **Event** *DOMEvent* 

## inputFocus(DOMEvent)

Show the container on input focus

### Params:

* **Event** *DOMEvent* 

## yearChange(DOMEvent)

On year change, update the model value

### Params:

* **Event** *DOMEvent* 

## monthChange(DOMEvent)

On month change, update the model value

### Params:

* **Event** *DOMEvent* 

## dayClick(DOMEvent)

On day click, update the model value

### Params:

* **Event** *DOMEvent* 

## dayKeyDown(DOMEvent)

On day key down - not implemented

### Params:

* **Event** *DOMEvent* 

## keyDown(DOMEvent)

On key down inside the dpicker container,
intercept enter and escape keys to hide the container

### Params:

* **Event** *DOMEvent* 

Get/Set format, a Moment format string

Get/Set display, hides or shows the date picker

Get/Set min date

Get/Set max date

Get/Set months an array of strings representing months, defaults to moment.months()

## exports

Get/Set days an array of strings representing days, defaults to moment.weekdaysShort()

<!-- End src/dpicker.js -->

