<a name="DPicker"></a>

## DPicker(element, [options])
DPicker

**Kind**: global function  
**Emits**: [<code>hide</code>](#DPicker+event_hide)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| element | <code>Element</code> |  | DOM element where you want the date picker or an input |
| [options] | <code>Object</code> | <code>{}</code> |  |
| [options.model] | <code>Date</code> | <code>new Date()</code> | Your own model instance, defaults to `new Date()` (can be set by the `value` attribute on an input, transformed to moment according to the given format) |
| [options.min] | <code>Date</code> | <code>1986-01-01</code> | The minimum date (can be set by the `min` attribute on an input) |
| [options.max] | <code>Date</code> | <code>today+1 year</code> | The maximum date (can be set by the `max` attribute on an input) |
| [options.format] | <code>String</code> \| <code>Array</code> | <code>&#x27;DD/MM/YYYY&#x27;</code> | The input format, a moment format (can be set by the `format` attribute on an input). If the aformat is an array, it'll enable multiple input formats. The first one will be the output format. |
| [options.months] | <code>String</code> | <code>adapter.months()</code> | Months array, see also [adapter.months()](todo) |
| [options.days] | <code>String</code> | <code>adapter.weekdaysShort()</code> | Days array, see also [adapter.weekdays()](todo) |
| [options.display] | <code>Boolean</code> | <code>false</code> | Initial calendar display state (not that when false it won't render the calendar) |
| [options.hideOnOutsideClick] | <code>Boolean</code> | <code>true</code> | On click outside of the date picker, hide the calendar |
| [options.hideOnDayClick] | <code>Boolean</code> | <code>true</code> | Hides the date picker on day click |
| [options.hideOnDayEnter] | <code>Boolean</code> | <code>true</code> | Hides the date picker when Enter or Escape is hit |
| [options.showCalendarOnInputFocus] | <code>Boolean</code> | <code>true</code> | Shows the calendar on input focus |
| [options.showCalendarButton] | <code>Boolean</code> | <code>false</code> | Adds a calendar button |
| [options.siblingMonthDayClick] | <code>Boolean</code> | <code>false</code> | Enable sibling months day click |
| [options.onChange] | <code>function</code> |  | A function to call whenever the data gets updated |
| [options.inputId] | <code>String</code> | <code>uuid()</code> | The input id, useful to add you own label (can only be set in the initiation phase) If element is an inputand it has an `id` attribute it'll be overriden by it |
| [options.inputName] | <code>String</code> | <code>&#x27;dpicker-input&#x27;</code> | The input name. If element is an inputand it has a `name` attribute it'll be overriden by it |
| [options.order] | <code>Array</code> |  | The dom elements appending order. |
| [options.time] | <code>Boolean</code> | <code>false</code> | Enable time (must include the time module) |
| [options.meridiem] | <code>Boolean</code> | <code>false</code> | 12/24 hour format, default 24 |
| [options.disabled] | <code>Boolean</code> | <code>false</code> | Disable the input box |
| [options.step] | <code>Number</code> | <code>1</code> | Minutes step |
| [options.concatHoursAndMinutes] | <code>Boolean</code> | <code>false</code> | Use only one select box for both hours and minutes |
| [options.empty] | <code>Boolean</code> | <code>false</code> | Use this so force DPicker with an empty input instead of setting it to the formatted current date |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| container | <code>String</code> | Get container id |
| inputId | <code>String</code> | Get input id |
| input | <code>String</code> | Get current input value (formatted date) |
| onChange | <code>function</code> | Set onChange method |
| valid | <code>Boolean</code> | Is the current input valid |
| empty | <code>Boolean</code> | Is the input empty |
| model | <code>Date</code> | Get/Set model, a Date instance |
| format | <code>String</code> | Get/Set format, a Date format string |
| display | <code>Boolean</code> | Get/Set display, hides or shows the date picker |
| min | <code>Date</code> | Get/Set min date |
| max | <code>Date</code> | Get/Set max date |


* [DPicker(element, [options])](#DPicker)
    * _instance_
        * [.getTree()](#DPicker+getTree) ⇒ <code>Element</code>
        * [.isValid(date)](#DPicker+isValid) ⇒ <code>boolean</code>
        * [.renderInput()](#DPicker+renderInput) ⇒ <code>Element</code>
        * [.renderContainer()](#DPicker+renderContainer) ⇒ <code>Element</code>
        * [.render()](#DPicker+render) ⇒ <code>Element</code>
        * [.renderYears()](#DPicker+renderYears) ⇒ <code>Element</code>
        * [.renderMonths()](#DPicker+renderMonths) ⇒ <code>Element</code>
        * [.renderDays()](#DPicker+renderDays) ⇒ <code>Element</code>
        * [.renderCalendar(events, data, toRender)](#DPicker+renderCalendar) ⇒ <code>Element</code>
        * [.initialize()](#DPicker+initialize)
        * [.modelSetter(newValue)](#DPicker+modelSetter)
        * [.redraw()](#DPicker+redraw)
        * ["hide"](#DPicker+event_hide)
        * ["inputChange"](#DPicker+event_inputChange)
        * ["inputBlur"](#DPicker+event_inputBlur)
        * ["inputFocus"](#DPicker+event_inputFocus)
        * ["yearChange"](#DPicker+event_yearChange)
        * ["monthChange"](#DPicker+event_monthChange)
        * ["dayClick"](#DPicker+event_dayClick)
        * ["previousMonthDayClick"](#DPicker+event_previousMonthDayClick)
        * ["nextMonthDayClick"](#DPicker+event_nextMonthDayClick)
        * ["dayKeyDown"](#DPicker+event_dayKeyDown)
        * ["keyDown"](#DPicker+event_keyDown)
        * ["dayKeyDown"](#DPicker+event_dayKeyDown)
        * ["hoursChange"](#DPicker+event_hoursChange)
        * ["minutesChange"](#DPicker+event_minutesChange)
        * ["minuteHoursChange"](#DPicker+event_minuteHoursChange)
        * ["meridiemChange"](#DPicker+event_meridiemChange)
    * _static_
        * [.renders](#DPicker.renders)
            * [.monthsAndYears(events, data, toRender)](#DPicker.renders.monthsAndYears) ⇒ <code>Element</code>
            * [.previousMonth(events, data, toRender)](#DPicker.renders.previousMonth) ⇒ <code>Element</code>
            * [.nextMonth(events, data, toRender)](#DPicker.renders.nextMonth) ⇒ <code>Element</code>
            * [.time()](#DPicker.renders.time) ⇒ <code>Element</code>
        * [.properties](#DPicker.properties)
            * [.meridiem](#DPicker.properties.meridiem)
            * [.concatHoursAndMinutes](#DPicker.properties.concatHoursAndMinutes)
            * [.time()](#DPicker.properties.time)
            * [.step()](#DPicker.properties.step)
        * [.dateAdapter](#DPicker.dateAdapter)
        * [.decorate(which, origin)](#DPicker.decorate)

<a name="DPicker+getTree"></a>

### dPicker.getTree() ⇒ <code>Element</code>
Return the whole nodes tree

**Kind**: instance method of [<code>DPicker</code>](#DPicker)  
<a name="DPicker+isValid"></a>

### dPicker.isValid(date) ⇒ <code>boolean</code>
Checks whether the given model is a valid moment instance
This method does set the `.valid` flag by checking min/max allowed inputs
Note that it will return `true` if the model is valid even if it's not in the allowed range

**Kind**: instance method of [<code>DPicker</code>](#DPicker)  

| Param | Type |
| --- | --- |
| date | <code>Date</code> | 

<a name="DPicker+renderInput"></a>

### dPicker.renderInput() ⇒ <code>Element</code>
Render input

**Kind**: instance method of [<code>DPicker</code>](#DPicker)  
**Returns**: <code>Element</code> - the rendered virtual dom hierarchy  
**Emits**: [<code>inputChange</code>](#DPicker+event_inputChange), [<code>inputBlur</code>](#DPicker+event_inputBlur), [<code>inputFocus</code>](#DPicker+event_inputFocus)  
<a name="DPicker+renderContainer"></a>

### dPicker.renderContainer() ⇒ <code>Element</code>
Dpicker container if no input is provided
if an input is given, it's parentNode will be the container

```
div.dpicker
```

**Kind**: instance method of [<code>DPicker</code>](#DPicker)  
**Returns**: <code>Element</code> - the rendered virtual dom hierarchy  
<a name="DPicker+render"></a>

### dPicker.render() ⇒ <code>Element</code>
Render a DPicker

```
div.dpicker#[uuid]
  input[type=text]
  div.dpicker-container.dpicker-[visible|invisible]
```

**Kind**: instance method of [<code>DPicker</code>](#DPicker)  
**Returns**: <code>Element</code> - the rendered virtual dom hierarchy  
**See**

- [renderYears](#DPicker+renderYears)
- [renderMonths](#DPicker+renderMonths)
- [renderDays](#DPicker+renderDays)

<a name="DPicker+renderYears"></a>

### dPicker.renderYears() ⇒ <code>Element</code>
Render Years
```
select[name='dpicker-year']
```

**Kind**: instance method of [<code>DPicker</code>](#DPicker)  
**Returns**: <code>Element</code> - the rendered virtual dom hierarchy  
**Emits**: [<code>yearChange</code>](#DPicker+event_yearChange)  
<a name="DPicker+renderMonths"></a>

### dPicker.renderMonths() ⇒ <code>Element</code>
Render Months
```
select[name='dpicker-month']
```

**Kind**: instance method of [<code>DPicker</code>](#DPicker)  
**Returns**: <code>Element</code> - the rendered virtual dom hierarchy  
**Emits**: [<code>monthChange</code>](#DPicker+event_monthChange)  
<a name="DPicker+renderDays"></a>

### dPicker.renderDays() ⇒ <code>Element</code>
Render Days
```
table
 tr
   td
     button|span
```

**Kind**: instance method of [<code>DPicker</code>](#DPicker)  
**Returns**: <code>Element</code> - the rendered virtual dom hierarchy  
**Emits**: [<code>dayClick</code>](#DPicker+event_dayClick), [<code>dayKeyDown</code>](#DPicker+event_dayKeyDown)  
<a name="DPicker+renderCalendar"></a>

### dPicker.renderCalendar(events, data, toRender) ⇒ <code>Element</code>
Outputs a calendar button

**Kind**: instance method of [<code>DPicker</code>](#DPicker)  
**Emits**: <code>DPicker#event:toggleCalendar</code>  

| Param | Type |
| --- | --- |
| events | <code>DPicker.events</code> | 
| data | <code>DPicker.data</code> | 
| toRender | <code>Array</code> | 

<a name="DPicker+initialize"></a>

### dPicker.initialize()
Called after parseInputAttributes but before render
Decorate it with modules to do things on initialization

**Kind**: instance method of [<code>DPicker</code>](#DPicker)  
<a name="DPicker+modelSetter"></a>

### dPicker.modelSetter(newValue)
The model setter, feel free to decorate through modules

**Kind**: instance method of [<code>DPicker</code>](#DPicker)  

| Param | Type |
| --- | --- |
| newValue | <code>Date</code> | 

<a name="DPicker+redraw"></a>

### dPicker.redraw()
Redraws the date picker
Decorate it with modules to do things before redraw

**Kind**: instance method of [<code>DPicker</code>](#DPicker)  
<a name="DPicker+event_hide"></a>

### "hide"
Hides the date picker if user does not click inside the container

**Kind**: event emitted by [<code>DPicker</code>](#DPicker)  
<a name="DPicker+event_inputChange"></a>

### "inputChange"
Change model on input change

**Kind**: event emitted by [<code>DPicker</code>](#DPicker)  
<a name="DPicker+event_inputBlur"></a>

### "inputBlur"
Hide on input blur

**Kind**: event emitted by [<code>DPicker</code>](#DPicker)  
<a name="DPicker+event_inputFocus"></a>

### "inputFocus"
Show the container on input focus

**Kind**: event emitted by [<code>DPicker</code>](#DPicker)  
<a name="DPicker+event_yearChange"></a>

### "yearChange"
On year change, update the model value

**Kind**: event emitted by [<code>DPicker</code>](#DPicker)  
<a name="DPicker+event_monthChange"></a>

### "monthChange"
On month change, update the model value

**Kind**: event emitted by [<code>DPicker</code>](#DPicker)  
<a name="DPicker+event_dayClick"></a>

### "dayClick"
On day click, update the model value

**Kind**: event emitted by [<code>DPicker</code>](#DPicker)  
<a name="DPicker+event_previousMonthDayClick"></a>

### "previousMonthDayClick"
On previous month day click (only if `siblingMonthDayClick` is enabled)

**Kind**: event emitted by [<code>DPicker</code>](#DPicker)  
<a name="DPicker+event_nextMonthDayClick"></a>

### "nextMonthDayClick"
On next month day click (only if `siblingMonthDayClick` is enabled)

**Kind**: event emitted by [<code>DPicker</code>](#DPicker)  
<a name="DPicker+event_dayKeyDown"></a>

### "dayKeyDown"
On day key down - not implemented

**Kind**: event emitted by [<code>DPicker</code>](#DPicker)  
<a name="DPicker+event_keyDown"></a>

### "keyDown"
On key down inside the dpicker container,
intercept enter and escape keys to hide the container

**Kind**: event emitted by [<code>DPicker</code>](#DPicker)  
<a name="DPicker+event_dayKeyDown"></a>

### "dayKeyDown"
Enables arrow navigation inside days

**Kind**: event emitted by [<code>DPicker</code>](#DPicker)  
<a name="DPicker+event_hoursChange"></a>

### "hoursChange"
On hours change

**Kind**: event emitted by [<code>DPicker</code>](#DPicker)  
<a name="DPicker+event_minutesChange"></a>

### "minutesChange"
On minutes change

**Kind**: event emitted by [<code>DPicker</code>](#DPicker)  
<a name="DPicker+event_minuteHoursChange"></a>

### "minuteHoursChange"
On minutes hours change when concatHoursAndMinutes is `true`

**Kind**: event emitted by [<code>DPicker</code>](#DPicker)  
<a name="DPicker+event_meridiemChange"></a>

### "meridiemChange"
On meridiem change

**Kind**: event emitted by [<code>DPicker</code>](#DPicker)  
<a name="DPicker.renders"></a>

### DPicker.renders
**Kind**: static property of [<code>DPicker</code>](#DPicker)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| renders | <code>Object</code> | Renders dictionnary |


* [.renders](#DPicker.renders)
    * [.monthsAndYears(events, data, toRender)](#DPicker.renders.monthsAndYears) ⇒ <code>Element</code>
    * [.previousMonth(events, data, toRender)](#DPicker.renders.previousMonth) ⇒ <code>Element</code>
    * [.nextMonth(events, data, toRender)](#DPicker.renders.nextMonth) ⇒ <code>Element</code>
    * [.time()](#DPicker.renders.time) ⇒ <code>Element</code>

<a name="DPicker.renders.monthsAndYears"></a>

#### renders.monthsAndYears(events, data, toRender) ⇒ <code>Element</code>
Renders concated months and Years

**Kind**: static method of [<code>renders</code>](#DPicker.renders)  
**Emits**: <code>DPicker#event:monthYearChange</code>  

| Param | Type |
| --- | --- |
| events | <code>DPicker.events</code> | 
| data | <code>DPicker.data</code> | 
| toRender | <code>Array</code> | 

<a name="DPicker.renders.previousMonth"></a>

#### renders.previousMonth(events, data, toRender) ⇒ <code>Element</code>
Renders previous month arrow

**Kind**: static method of [<code>renders</code>](#DPicker.renders)  
**Emits**: <code>DPicker#event:previousMonth</code>  

| Param | Type |
| --- | --- |
| events | <code>DPicker.events</code> | 
| data | <code>DPicker.data</code> | 
| toRender | <code>Array</code> | 

<a name="DPicker.renders.nextMonth"></a>

#### renders.nextMonth(events, data, toRender) ⇒ <code>Element</code>
Renders next month arrow

**Kind**: static method of [<code>renders</code>](#DPicker.renders)  
**Emits**: <code>DPicker#event:nextMonth</code>  

| Param | Type |
| --- | --- |
| events | <code>DPicker.events</code> | 
| data | <code>DPicker.data</code> | 
| toRender | <code>Array</code> | 

<a name="DPicker.renders.time"></a>

#### renders.time() ⇒ <code>Element</code>
Render Time
```
select[name='dpicker-hour']
select[name='dpicker-minutes']
```

**Kind**: static method of [<code>renders</code>](#DPicker.renders)  
**Returns**: <code>Element</code> - the rendered virtual dom hierarchy  
**Emits**: [<code>hoursChange</code>](#DPicker+event_hoursChange), [<code>minutesChange</code>](#DPicker+event_minutesChange), [<code>minuteHoursChange</code>](#DPicker+event_minuteHoursChange), [<code>meridiemChange</code>](#DPicker+event_meridiemChange)  
<a name="DPicker.properties"></a>

### DPicker.properties
**Kind**: static property of [<code>DPicker</code>](#DPicker)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| properties | <code>Object</code> | Properties dictionnary (getters and setters will be set) |


* [.properties](#DPicker.properties)
    * [.meridiem](#DPicker.properties.meridiem)
    * [.concatHoursAndMinutes](#DPicker.properties.concatHoursAndMinutes)
    * [.time()](#DPicker.properties.time)
    * [.step()](#DPicker.properties.step)

<a name="DPicker.properties.meridiem"></a>

#### properties.meridiem
**Kind**: static property of [<code>properties</code>](#DPicker.properties)  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| [meridiem] | <code>Boolean</code> | <code>false</code> | 

<a name="DPicker.properties.concatHoursAndMinutes"></a>

#### properties.concatHoursAndMinutes
**Kind**: static property of [<code>properties</code>](#DPicker.properties)  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| [concatHoursAndMinutes] | <code>Boolean</code> | <code>false</code> | 

<a name="DPicker.properties.time"></a>

#### properties.time()
**Kind**: static method of [<code>properties</code>](#DPicker.properties)  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [time] | <code>Boolean</code> | <code>false</code> | If `type="datetime"` attribute is defined, evaluates to `true` |

<a name="DPicker.properties.step"></a>

#### properties.step()
**Kind**: static method of [<code>properties</code>](#DPicker.properties)  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [step] | <code>Boolean</code> | <code>1</code> | Takes the value of the attribute `step` or `1` |

<a name="DPicker.dateAdapter"></a>

### DPicker.dateAdapter
**Kind**: static property of [<code>DPicker</code>](#DPicker)  
**See**: [MomentDateAdapter](/_api?id=module_momentadapter)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| dateAdapter | <code>DateAdapter</code> | The date adapter |

<a name="DPicker.decorate"></a>

### DPicker.decorate(which, origin)
Creates a decorator, use it to decorate public methods.

For example:
```javascript
DPicker.events.inputChange = DPicker.decorate(DPicker.events.inputChange, function DoSomethingOnInputChange (evt) {
  // do something
})

```

The decoration will be stopped if the method returns `false`! It's like an internal `preventDefault` to avoid altering the original event.

**Kind**: static method of [<code>DPicker</code>](#DPicker)  

| Param | Type | Description |
| --- | --- | --- |
| which | <code>String</code> | one of events, calls |
| origin | <code>function</code> | the origin function that will be decorated |

<a name="onChange"></a>

## onChange(data, DPickerEvent)
Example:

```javascript
var dpicker = new DPicker(container)

dpicker.onChange = function(data, DPickerEvent) {
  // has the model changed?
  console.log(DPickerEvent.modelChanged)
  // the name of the internal event
  console.log(DPickerEvent.name)
  // the origin DOM event
  console.dir(DPickerEvent.event)
}
```

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> |  |
| DPickerEvent | <code>Object</code> |  |
| DPickerEvent.modelChanged | <code>Boolean</code> | whether the model has changed |
| DPickerEvent.name | <code>String</code> | the DPicker internal event name |
| DPickerEvent.event | <code>Event</code> | the original DOM event |

<a name="module_MomentAdapter"></a>

## MomentAdapter

* [MomentAdapter](#module_MomentAdapter)
    * [~months()](#module_MomentAdapter..months) ⇒ <code>Array.&lt;String&gt;</code>
    * [~weekdays()](#module_MomentAdapter..weekdays) ⇒ <code>Array.&lt;String&gt;</code>
    * [~firstDayOfWeek()](#module_MomentAdapter..firstDayOfWeek) ⇒ <code>Number</code>
    * [~isValid(date)](#module_MomentAdapter..isValid) ⇒ <code>Boolean</code>
    * [~isValidWithFormat(dateString, format)](#module_MomentAdapter..isValidWithFormat) ⇒ <code>Date</code> \| <code>Boolean</code>
    * [~getYear(date)](#module_MomentAdapter..getYear) ⇒ <code>Number</code>
    * [~getMonth(date)](#module_MomentAdapter..getMonth) ⇒ <code>Number</code>
    * [~getDate(date)](#module_MomentAdapter..getDate) ⇒ <code>Number</code>
    * [~getHours(date)](#module_MomentAdapter..getHours) ⇒ <code>Number</code>
    * [~getMinutes(date)](#module_MomentAdapter..getMinutes) ⇒ <code>Number</code>
    * [~getSeconds(date)](#module_MomentAdapter..getSeconds) ⇒ <code>Number</code>
    * [~getMilliseconds(date)](#module_MomentAdapter..getMilliseconds) ⇒ <code>Number</code>
    * [~setDate(date, day)](#module_MomentAdapter..setDate) ⇒ <code>Date</code>
    * [~setMinutes(date, minutes)](#module_MomentAdapter..setMinutes) ⇒ <code>Date</code>
    * [~setHours(date, hours)](#module_MomentAdapter..setHours) ⇒ <code>Date</code>
    * [~setMonth(date, month)](#module_MomentAdapter..setMonth) ⇒ <code>Date</code>
    * [~setYear(date, year)](#module_MomentAdapter..setYear) ⇒ <code>Date</code>
    * [~addDays(date, num)](#module_MomentAdapter..addDays) ⇒ <code>Date</code>
    * [~addMonths(date, num)](#module_MomentAdapter..addMonths) ⇒ <code>Date</code>
    * [~addYears(date, num)](#module_MomentAdapter..addYears) ⇒ <code>Date</code>
    * [~addHours(date, num)](#module_MomentAdapter..addHours) ⇒ <code>Date</code>
    * [~subDays(date, num)](#module_MomentAdapter..subDays) ⇒ <code>Date</code>
    * [~subMonths(date, num)](#module_MomentAdapter..subMonths) ⇒ <code>Date</code>
    * [~format(date, format)](#module_MomentAdapter..format) ⇒ <code>String</code>
    * [~daysInMonth(date)](#module_MomentAdapter..daysInMonth) ⇒ <code>Number</code>
    * [~firstWeekDay(date)](#module_MomentAdapter..firstWeekDay) ⇒ <code>Number</code>
    * [~resetSeconds(date)](#module_MomentAdapter..resetSeconds) ⇒ <code>Date</code>
    * [~resetMinutes(date)](#module_MomentAdapter..resetMinutes) ⇒ <code>Date</code>
    * [~resetHours(date)](#module_MomentAdapter..resetHours) ⇒ <code>Date</code>
    * [~isBefore(date, comparison)](#module_MomentAdapter..isBefore) ⇒ <code>Boolean</code>
    * [~isAfter(date, comparison)](#module_MomentAdapter..isAfter) ⇒ <code>Boolean</code>
    * [~isSameOrAfter(date, comparison)](#module_MomentAdapter..isSameOrAfter) ⇒ <code>Boolean</code>
    * [~isSameOrBefore(date, comparison)](#module_MomentAdapter..isSameOrBefore) ⇒ <code>Boolean</code>
    * [~isSameDay(date, comparison)](#module_MomentAdapter..isSameDay) ⇒ <code>Boolean</code>
    * [~isSameHours(date, comparison)](#module_MomentAdapter..isSameHours) ⇒ <code>Boolean</code>
    * [~isSameMonth(date, comparison)](#module_MomentAdapter..isSameMonth) ⇒ <code>Boolean</code>
    * [~getMeridiem(date)](#module_MomentAdapter..getMeridiem) ⇒ <code>String</code>

<a name="module_MomentAdapter..months"></a>

### MomentAdapter~months() ⇒ <code>Array.&lt;String&gt;</code>
Get months, an array of string

**Kind**: inner method of [<code>MomentAdapter</code>](#module_MomentAdapter)  
**Returns**: <code>Array.&lt;String&gt;</code> - List of the available months  
<a name="module_MomentAdapter..weekdays"></a>

### MomentAdapter~weekdays() ⇒ <code>Array.&lt;String&gt;</code>
Get week days

**Kind**: inner method of [<code>MomentAdapter</code>](#module_MomentAdapter)  
<a name="module_MomentAdapter..firstDayOfWeek"></a>

### MomentAdapter~firstDayOfWeek() ⇒ <code>Number</code>
First day of week according to locale

**Kind**: inner method of [<code>MomentAdapter</code>](#module_MomentAdapter)  
<a name="module_MomentAdapter..isValid"></a>

### MomentAdapter~isValid(date) ⇒ <code>Boolean</code>
**Kind**: inner method of [<code>MomentAdapter</code>](#module_MomentAdapter)  

| Param | Type |
| --- | --- |
| date | <code>Date</code> | 

<a name="module_MomentAdapter..isValidWithFormat"></a>

### MomentAdapter~isValidWithFormat(dateString, format) ⇒ <code>Date</code> \| <code>Boolean</code>
**Kind**: inner method of [<code>MomentAdapter</code>](#module_MomentAdapter)  
**Returns**: <code>Date</code> \| <code>Boolean</code> - false if invalid or the parsed date, parsing is heaving let's do this only once  

| Param | Type |
| --- | --- |
| dateString | <code>String</code> | 
| format | <code>String</code> | 

<a name="module_MomentAdapter..getYear"></a>

### MomentAdapter~getYear(date) ⇒ <code>Number</code>
Get year

**Kind**: inner method of [<code>MomentAdapter</code>](#module_MomentAdapter)  

| Param | Type |
| --- | --- |
| date | <code>Date</code> | 

<a name="module_MomentAdapter..getMonth"></a>

### MomentAdapter~getMonth(date) ⇒ <code>Number</code>
Get Month

**Kind**: inner method of [<code>MomentAdapter</code>](#module_MomentAdapter)  

| Param | Type |
| --- | --- |
| date | <code>Date</code> | 

<a name="module_MomentAdapter..getDate"></a>

### MomentAdapter~getDate(date) ⇒ <code>Number</code>
Get Date

**Kind**: inner method of [<code>MomentAdapter</code>](#module_MomentAdapter)  

| Param | Type |
| --- | --- |
| date | <code>Date</code> | 

<a name="module_MomentAdapter..getHours"></a>

### MomentAdapter~getHours(date) ⇒ <code>Number</code>
Get Hours

**Kind**: inner method of [<code>MomentAdapter</code>](#module_MomentAdapter)  

| Param | Type |
| --- | --- |
| date | <code>Date</code> | 

<a name="module_MomentAdapter..getMinutes"></a>

### MomentAdapter~getMinutes(date) ⇒ <code>Number</code>
Get Minutes

**Kind**: inner method of [<code>MomentAdapter</code>](#module_MomentAdapter)  

| Param | Type |
| --- | --- |
| date | <code>Date</code> | 

<a name="module_MomentAdapter..getSeconds"></a>

### MomentAdapter~getSeconds(date) ⇒ <code>Number</code>
Get Seconds

**Kind**: inner method of [<code>MomentAdapter</code>](#module_MomentAdapter)  

| Param | Type |
| --- | --- |
| date | <code>Date</code> | 

<a name="module_MomentAdapter..getMilliseconds"></a>

### MomentAdapter~getMilliseconds(date) ⇒ <code>Number</code>
Get Milliseconds

**Kind**: inner method of [<code>MomentAdapter</code>](#module_MomentAdapter)  

| Param | Type |
| --- | --- |
| date | <code>Date</code> | 

<a name="module_MomentAdapter..setDate"></a>

### MomentAdapter~setDate(date, day) ⇒ <code>Date</code>
Set Date

**Kind**: inner method of [<code>MomentAdapter</code>](#module_MomentAdapter)  

| Param | Type |
| --- | --- |
| date | <code>Date</code> | 
| day | <code>Number</code> | 

<a name="module_MomentAdapter..setMinutes"></a>

### MomentAdapter~setMinutes(date, minutes) ⇒ <code>Date</code>
Set Minutes

**Kind**: inner method of [<code>MomentAdapter</code>](#module_MomentAdapter)  

| Param | Type |
| --- | --- |
| date | <code>Date</code> | 
| minutes | <code>Number</code> | 

<a name="module_MomentAdapter..setHours"></a>

### MomentAdapter~setHours(date, hours) ⇒ <code>Date</code>
Set Hours

**Kind**: inner method of [<code>MomentAdapter</code>](#module_MomentAdapter)  

| Param | Type |
| --- | --- |
| date | <code>Date</code> | 
| hours | <code>Number</code> | 

<a name="module_MomentAdapter..setMonth"></a>

### MomentAdapter~setMonth(date, month) ⇒ <code>Date</code>
Set Month

**Kind**: inner method of [<code>MomentAdapter</code>](#module_MomentAdapter)  

| Param | Type |
| --- | --- |
| date | <code>Date</code> | 
| month | <code>Number</code> | 

<a name="module_MomentAdapter..setYear"></a>

### MomentAdapter~setYear(date, year) ⇒ <code>Date</code>
Set Year

**Kind**: inner method of [<code>MomentAdapter</code>](#module_MomentAdapter)  

| Param | Type |
| --- | --- |
| date | <code>Date</code> | 
| year | <code>Number</code> | 

<a name="module_MomentAdapter..addDays"></a>

### MomentAdapter~addDays(date, num) ⇒ <code>Date</code>
Add Days

**Kind**: inner method of [<code>MomentAdapter</code>](#module_MomentAdapter)  

| Param | Type | Description |
| --- | --- | --- |
| date | <code>Date</code> |  |
| num | <code>Number</code> | days to add |

<a name="module_MomentAdapter..addMonths"></a>

### MomentAdapter~addMonths(date, num) ⇒ <code>Date</code>
Add Months

**Kind**: inner method of [<code>MomentAdapter</code>](#module_MomentAdapter)  

| Param | Type | Description |
| --- | --- | --- |
| date | <code>Date</code> |  |
| num | <code>Number</code> | months to add |

<a name="module_MomentAdapter..addYears"></a>

### MomentAdapter~addYears(date, num) ⇒ <code>Date</code>
Add Years

**Kind**: inner method of [<code>MomentAdapter</code>](#module_MomentAdapter)  

| Param | Type | Description |
| --- | --- | --- |
| date | <code>Date</code> |  |
| num | <code>Number</code> | years to add |

<a name="module_MomentAdapter..addHours"></a>

### MomentAdapter~addHours(date, num) ⇒ <code>Date</code>
Add Hours

**Kind**: inner method of [<code>MomentAdapter</code>](#module_MomentAdapter)  

| Param | Type | Description |
| --- | --- | --- |
| date | <code>Date</code> |  |
| num | <code>Number</code> | hours to add |

<a name="module_MomentAdapter..subDays"></a>

### MomentAdapter~subDays(date, num) ⇒ <code>Date</code>
Subtract days

**Kind**: inner method of [<code>MomentAdapter</code>](#module_MomentAdapter)  

| Param | Type | Description |
| --- | --- | --- |
| date | <code>Date</code> |  |
| num | <code>Number</code> | days to subtract |

<a name="module_MomentAdapter..subMonths"></a>

### MomentAdapter~subMonths(date, num) ⇒ <code>Date</code>
Subtract months

**Kind**: inner method of [<code>MomentAdapter</code>](#module_MomentAdapter)  

| Param | Type | Description |
| --- | --- | --- |
| date | <code>Date</code> |  |
| num | <code>Number</code> | months to subtract |

<a name="module_MomentAdapter..format"></a>

### MomentAdapter~format(date, format) ⇒ <code>String</code>
Format a Date and return a string

**Kind**: inner method of [<code>MomentAdapter</code>](#module_MomentAdapter)  

| Param | Type |
| --- | --- |
| date | <code>Date</code> | 
| format | <code>String</code> | 

<a name="module_MomentAdapter..daysInMonth"></a>

### MomentAdapter~daysInMonth(date) ⇒ <code>Number</code>
Get the number of days in the current date month

**Kind**: inner method of [<code>MomentAdapter</code>](#module_MomentAdapter)  

| Param | Type |
| --- | --- |
| date | <code>Date</code> | 

<a name="module_MomentAdapter..firstWeekDay"></a>

### MomentAdapter~firstWeekDay(date) ⇒ <code>Number</code>
Get number of the day in the week (from 0 to 6) for the given month on the first day

**Kind**: inner method of [<code>MomentAdapter</code>](#module_MomentAdapter)  

| Param | Type |
| --- | --- |
| date | <code>Date</code> | 

<a name="module_MomentAdapter..resetSeconds"></a>

### MomentAdapter~resetSeconds(date) ⇒ <code>Date</code>
Reset a date seconds

**Kind**: inner method of [<code>MomentAdapter</code>](#module_MomentAdapter)  

| Param | Type |
| --- | --- |
| date | <code>Date</code> | 

<a name="module_MomentAdapter..resetMinutes"></a>

### MomentAdapter~resetMinutes(date) ⇒ <code>Date</code>
Reset a date minutes

**Kind**: inner method of [<code>MomentAdapter</code>](#module_MomentAdapter)  

| Param | Type |
| --- | --- |
| date | <code>Date</code> | 

<a name="module_MomentAdapter..resetHours"></a>

### MomentAdapter~resetHours(date) ⇒ <code>Date</code>
Reset a date hours

**Kind**: inner method of [<code>MomentAdapter</code>](#module_MomentAdapter)  

| Param | Type |
| --- | --- |
| date | <code>Date</code> | 

<a name="module_MomentAdapter..isBefore"></a>

### MomentAdapter~isBefore(date, comparison) ⇒ <code>Boolean</code>
isBefore

**Kind**: inner method of [<code>MomentAdapter</code>](#module_MomentAdapter)  

| Param | Type |
| --- | --- |
| date | <code>Date</code> | 
| comparison | <code>Date</code> | 

<a name="module_MomentAdapter..isAfter"></a>

### MomentAdapter~isAfter(date, comparison) ⇒ <code>Boolean</code>
isAfter

**Kind**: inner method of [<code>MomentAdapter</code>](#module_MomentAdapter)  

| Param | Type |
| --- | --- |
| date | <code>Date</code> | 
| comparison | <code>Date</code> | 

<a name="module_MomentAdapter..isSameOrAfter"></a>

### MomentAdapter~isSameOrAfter(date, comparison) ⇒ <code>Boolean</code>
isSameOrAfter (comparison must be done on a DAY basis)

**Kind**: inner method of [<code>MomentAdapter</code>](#module_MomentAdapter)  

| Param | Type |
| --- | --- |
| date | <code>Date</code> | 
| comparison | <code>Date</code> | 

<a name="module_MomentAdapter..isSameOrBefore"></a>

### MomentAdapter~isSameOrBefore(date, comparison) ⇒ <code>Boolean</code>
isSameOrBefore (comparison must be done on a DAY basis)

**Kind**: inner method of [<code>MomentAdapter</code>](#module_MomentAdapter)  

| Param | Type |
| --- | --- |
| date | <code>Date</code> | 
| comparison | <code>Date</code> | 

<a name="module_MomentAdapter..isSameDay"></a>

### MomentAdapter~isSameDay(date, comparison) ⇒ <code>Boolean</code>
isSameDay

**Kind**: inner method of [<code>MomentAdapter</code>](#module_MomentAdapter)  

| Param | Type |
| --- | --- |
| date | <code>Date</code> | 
| comparison | <code>Date</code> | 

<a name="module_MomentAdapter..isSameHours"></a>

### MomentAdapter~isSameHours(date, comparison) ⇒ <code>Boolean</code>
isSameHours

**Kind**: inner method of [<code>MomentAdapter</code>](#module_MomentAdapter)  

| Param | Type |
| --- | --- |
| date | <code>Date</code> | 
| comparison | <code>Date</code> | 

<a name="module_MomentAdapter..isSameMonth"></a>

### MomentAdapter~isSameMonth(date, comparison) ⇒ <code>Boolean</code>
isSameMonth

**Kind**: inner method of [<code>MomentAdapter</code>](#module_MomentAdapter)  

| Param | Type |
| --- | --- |
| date | <code>Date</code> | 
| comparison | <code>Date</code> | 

<a name="module_MomentAdapter..getMeridiem"></a>

### MomentAdapter~getMeridiem(date) ⇒ <code>String</code>
An uppercased meridiem (AM or PM)

**Kind**: inner method of [<code>MomentAdapter</code>](#module_MomentAdapter)  

| Param | Type |
| --- | --- |
| date | <code>Date</code> | 

