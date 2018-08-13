/* global it, describe, afterEach, createDatePicker */
/* eslint-disable no-unused-expressions */
'use strict'
const moment = require('moment')
const chai = require('chai')
const spies = require('chai-spies')
chai.use(spies)
const expect = chai.expect

function keyDown (keyCode, element) {
  var event = new window.Event('Event')
  event.initEvent('keydown', true, true)
  event.keyCode = keyCode
  element.dispatchEvent(event)
}

function noop () {}

require('./adapters/moment.spec.js')

describe('dpicker', function () {
  const DPicker = require('../dist/dpicker.js')

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should init a dpicker', function () {
    const dpicker = createDatePicker()
    expect(document.getElementById(dpicker.container)).not.to.be.null
  })

  it('should init a dpicker with different order', function () {
    const dpicker = createDatePicker({order: ['years', 'months', 'days']})
    expect(document.getElementById(dpicker.container)).not.to.be.null
    let selects = document.querySelectorAll('select')

    expect(selects[0].getAttribute('name')).to.equal('dpicker-year')
    expect(selects[1].getAttribute('name')).to.equal('dpicker-month')
  })

  it('should init a dpicker with different order + not defined item', function () {
    const dpicker = createDatePicker({order: ['years', 'months', 'foobar', 'days']})
    expect(document.getElementById(dpicker.container)).not.to.be.null
    let selects = document.querySelectorAll('select')

    expect(selects[0].getAttribute('name')).to.equal('dpicker-year')
    expect(selects[1].getAttribute('name')).to.equal('dpicker-month')
  })

  it('should change year', function (cb) {
    const dpicker = createDatePicker({
      onChange: (data) => {
        expect(select.children[selectedIndex].selected).to.be.true
        let input = document.querySelector('input[name=dpicker-input]')
        expect('' + moment(dpicker.model).year()).to.equal(select.options[selectedIndex].value)
        expect(input.value).to.equal(dpicker.input)
        cb()
        dpicker.onChange = noop
      }
    })

    let selectedIndex = 4
    let select = document.querySelector('select[name=dpicker-year]')
    select.selectedIndex = selectedIndex
    select.onchange({target: select})
  })

  it('should change month', function (cb) {
    const dpicker = createDatePicker({
      onChange: (data) => {
        expect(select.children[selectedIndex].selected).to.be.true
        let input = document.querySelector('input[name=dpicker-input]')
        expect('' + moment(dpicker.model).month()).to.equal(select.options[selectedIndex].value)
        expect(input.value).to.equal(dpicker.input)
        cb()
        dpicker.onChange = noop
      }
    })

    let selectedIndex = 4
    let select = document.querySelector('select[name=dpicker-month]')
    select.selectedIndex = selectedIndex
    select.onchange({target: select})
  })

  it('should change day', function (cb) {
    const fn = chai.spy()

    const dpicker = createDatePicker({
      onChange: (data) => {
        expect(fn).to.have.been.called()
        expect('' + moment(dpicker.model).date()).to.equal(button.value)
        expect(dpicker.display).to.equal(false)
        cb()
      }
    })

    let button = document.querySelectorAll('button')[0]
    button.onclick({target: button, preventDefault: fn, stopPropagation: fn})
  })

  it('should have customized date range', function () {
    createDatePicker({max: moment('2026-01-12'), min: moment('1900-01-01')})
    let options = document.querySelector('select[name="dpicker-year"]').options
    expect(+options[0].value).to.equal(2026)
    expect(options.length).to.equal(2027 - 1900)
    expect(+options[options.length - 1].value).to.equal(1900)
  })

  it('should change number of displayed months on min date', function () {
    createDatePicker({min: moment('1900-06-01'), model: moment('1900-06-01'), format: 'YYYY-MM-DD'})
    let options = document.querySelector('select[name="dpicker-month"]').options
    expect(options.length).to.equal(7)
  })

  it('should change days active on min date', function () {
    createDatePicker({min: moment('1991-06-24'), model: moment('1991-06-24'), format: 'YYYY-MM-DD'})
    let days = document.querySelectorAll('button')
    expect(days).to.have.lengthOf(7)
  })

  it('should change days active on max date', function () {
    createDatePicker({max: moment('1991-06-24'), model: moment('1991-06-24'), format: 'YYYY-MM-DD'})
    let days = document.querySelectorAll('button')
    expect(days).to.have.lengthOf(24)
  })

  it('should bind to an input[type="date"]', function () {
    let input = document.createElement('input')
    let label = document.createElement('label')
    input.setAttribute('type', 'date')
    input.setAttribute('id', 't')
    input.setAttribute('format', 'YYYY-MM-DD')
    input.setAttribute('min', '1991-06-24')
    input.setAttribute('max', '1992-11-21')
    input.setAttribute('value', '1992-10-10')

    label.appendChild(input)
    label.setAttribute('for', 't')
    document.body.appendChild(label)

    const dpicker = DPicker(input, {display: true})

    expect(dpicker.inputId).to.equal('t')
    expect(dpicker.format).to.equal('YYYY-MM-DD')
    expect(moment(dpicker.min).format('YYYY-MM-DD')).to.equal('1991-06-24')
    expect(moment(dpicker.max).format('YYYY-MM-DD')).to.equal('1992-11-21')
    expect(moment(dpicker.model).format('YYYY-MM-DD')).to.equal('1992-10-10')

    input = document.getElementById('t')
    expect(input.getAttribute('type')).to.equal('text')

    let options = document.querySelector('select[name="dpicker-year"]').options
    expect(+options[0].value).to.equal(1992)
    expect(options.length).to.equal(2)
    expect(+options[options.length - 1].value).to.equal(1991)

    options = document.querySelector('select[name="dpicker-month"]').options
    expect(+options[0].value).to.equal(0)
    expect(+options[options.length - 1].value).to.equal(10)
  })

  it('should bind to an input[type="date"] with an empty value', function () {
    this.skip('This behavior has changed in v5')
    let input = document.createElement('input')
    let label = document.createElement('label')
    input.setAttribute('type', 'date')
    input.setAttribute('id', 't')
    input.setAttribute('value', '')

    label.appendChild(input)
    label.setAttribute('for', 't')
    document.body.appendChild(label)

    const dpicker = DPicker(input)

    expect(dpicker.input).to.equal('')
    expect(input.value).to.equal('')
  })

  it('should bind to an input[type="date"] with an empty value', function () {
    // it.skip('This behavior has been removed in v5')
    let input = document.createElement('input')
    let label = document.createElement('label')
    input.setAttribute('type', 'date')
    input.setAttribute('id', 't')
    input.setAttribute('value', '')

    label.appendChild(input)
    label.setAttribute('for', 't')
    document.body.appendChild(label)

    const dpicker = DPicker(input)

    expect(dpicker.input).not.to.equal('')
    expect(input.value).to.equal('')
  })

  it('should have customized format', function () {
    const dpicker = createDatePicker()

    let input = document.querySelector('input[name=dpicker-input]')
    dpicker.format = 'MM/DD/YYYY'

    expect(input.value).to.equal(dpicker.input)
  })

  it('should change dpicker according to input change', function (cb) {
    const dpicker = createDatePicker({
      onChange: (data, ev) => {
        expect(dpicker.input).to.equal('24/06/1991')
        cb()
      },
      display: false
    })

    let input = document.querySelector('input[name=dpicker-input]')

    dpicker.format = 'DD/MM/YYYY'
    input.value = '24/06/1991'
    input.onchange({target: input})
  })

  it('should give empty input after input changed to empty string', function (cb) {
    const dpicker = createDatePicker({
      onChange: (data) => {
        expect(dpicker.input).to.equal('')
        cb()
      },
      display: false
    })

    let input = document.querySelector('input[name=dpicker-input]')

    dpicker.format = 'DD/MM/YYYY'
    input.value = ''
    input.onchange({target: input})
  })

  it('should not fail on invalid input change', function () {
    const dpicker = createDatePicker()
    let input = document.querySelector('input[name=dpicker-input]')

    dpicker.format = 'DD/MM/YYYY'
    input.value = '24/06/1991'
    input.onchange({target: input})
    input.value = 'test'
    input.onchange({target: input})
    expect(dpicker.input).to.equal('24/06/1991')
  })

  it('should display dpicker on input focus', function () {
    const dpicker = createDatePicker({display: false})
    let input = document.querySelector('input[name=dpicker-input]')
    input.focus()
    expect(dpicker.display).to.be.true
  })

  it('should hide container on outside click', function () {
    const dpicker = createDatePicker({display: true})
    document.body.click()
    expect(dpicker.display).to.be.false
  })

  it('should not hide container on inside click', function () {
    const dpicker = createDatePicker({display: false})
    let input = document.querySelector('input[name=dpicker-input]')

    input.focus()
    expect(dpicker.display).to.be.true
    document.getElementById(dpicker.container).children[0].click()
    expect(dpicker.display).to.be.true
  })

  it('should be empty', function () {
    const dpicker = createDatePicker()
    let input = document.querySelector('input[name=dpicker-input]')
    input.value = '24/06/1991'
    input.onchange({target: input})
    expect(dpicker.empty).to.be.false
    input.value = ''
    input.onchange({target: input})
    expect(dpicker.empty).to.be.true
  })

  it('should init dpicker on a container', function () {
    let label = document.createElement('label')
    DPicker(label, {model: ''})
    document.body.appendChild(label)
  })

  it('should not init dpicker on an input without container', function () {
    let input = document.createElement('input')

    try {
      DPicker(input, {model: ''})
    } catch (e) {
      expect(e).to.be.an.instanceof(ReferenceError)
      expect(e.message).to.equal('Can not initialize DPicker on an input without parent node')
    }
  })

  it('should init dpicker on an input', function () {
    let input = document.createElement('input')
    let label = document.createElement('label')
    label.appendChild(input)
    label.setAttribute('for', 't')

    const dpicker = DPicker(input, {model: '', inputId: 't'})
    expect(dpicker.inputId).to.equal('t')

    dpicker.model = moment('24/06/1991', 'DD/MM/YYYY')
    expect(dpicker.empty).to.be.false
    input = label.querySelector('input')
    input.value = ''
    input.onchange({target: input})
    expect(dpicker.empty).to.be.true
  })

  it('should add a modifier', function () {
    this.skip('feature removed')
    const now = moment()
    const dpicker = createDatePicker({
      model: moment('24/06/1991', 'DD/MM/YYYY'),
      modifier: function () {
        if (this.input === '+') {
          this.model = now
        }
      }
    })

    let input = document.querySelector('input[name=dpicker-input]')

    input.simulate.change({value: '+'})

    expect(dpicker.model.format('YYYYMMDD')).to.equal(now.format('YYYYMMDD'))
  })

  it('should hide dpicker and blur input on enter keypress', function () {
    let label = document.createElement('label')
    let dpicker = DPicker(label, {model: moment('24/06/1991', 'DD/MM/YYYY')})
    document.body.appendChild(label)

    let input = label.querySelector('input[type="text"]')

    input.focus()
    expect(dpicker.display).to.be.true

    // enter
    keyDown(13, input)

    expect(dpicker.display).to.be.false
    expect(document.activeElement).not.to.equal(input)
  })

  it('should hide dpicker and blur input on escape keypress', function () {
    let label = document.createElement('label')
    let dpicker = DPicker(label, {model: moment('24/06/1991', 'DD/MM/YYYY')})
    document.body.appendChild(label)

    let input = label.querySelector('input[type="text"]')

    input.focus()
    expect(dpicker.display).to.be.true

    // escape
    keyDown(27, input)
    expect(dpicker.display).to.be.false
    expect(document.activeElement).not.to.equal(input)
  })

  it('should not hide on day click', function () {
    let label = document.createElement('label')
    let dpicker = DPicker(label, {hideOnDayClick: false, display: true})
    document.body.appendChild(label)

    let button = label.querySelectorAll('button')[0]

    expect(dpicker.display).to.be.true
    button.click()
    expect(dpicker.display).to.be.true
  })

  it('should not hide on enter or escape key', function () {
    let label = document.createElement('label')
    let dpicker = DPicker(label, {hideOnEnter: false, display: true})
    document.body.appendChild(label)

    let button = label.querySelectorAll('button')[0]
    button.focus()

    expect(dpicker.display).to.be.true
    keyDown(13, button)
    expect(dpicker.display).to.be.true
    keyDown(27, button)
    expect(dpicker.display).to.be.true
  })

  it('should not hide on blur if already hidden', function () {
    let label = document.createElement('label')
    let dpicker = DPicker(label)
    document.body.appendChild(label)

    let input = label.querySelector('input[type="text"]')

    input.focus()
    expect(dpicker.display).to.be.true
    dpicker.display = false
    input.blur()
  })

  it('should not hide on blur if focus is in container', function () {
    let label = document.createElement('label')
    let dpicker = DPicker(label)
    document.body.appendChild(label)

    let input = label.querySelector('input[type="text"]')

    input.focus()
    expect(dpicker.display).to.be.true
    label.querySelectorAll('button')[0].focus()
    expect(dpicker.display).to.be.true
  })

  it('should be valid when dayClick is correct after invalid', function () {
    let label = document.createElement('label')
    let dpicker = DPicker(label, {
      max: moment('24/06/1991', 'DD/MM/YYYY'),
      model: moment('26/06/1991', 'DD/MM/YYYY'),
      format: 'DD/MM/YYYY',
      display: true
    })

    document.body.appendChild(label)
    expect(dpicker.valid).to.be.false

    let buttons = document.querySelectorAll('button')
    let button = buttons[buttons.length - 1]
    button.onclick({target: button, preventDefault: chai.spy(), stopPropagation: chai.spy()})
    expect(dpicker.valid).to.be.true
  })

  it('should enable click on previous month days', function () {
    let label = document.createElement('label')
    let dpicker = DPicker(label, {
      model: moment('26/06/1991', 'DD/MM/YYYY'),
      format: 'DD/MM/YYYY',
      siblingMonthDayClick: true,
      display: true,
      hideOnDayClick: false
    })

    document.body.appendChild(label)

    let buttons = document.querySelectorAll('button')

    let button = buttons[0]
    button.onclick({target: button, preventDefault: chai.spy(), stopPropagation: chai.spy()})
    expect(dpicker.valid).to.be.true
    expect(moment(dpicker.model).month()).to.equal(4)
    expect(moment(dpicker.model).date()).to.equal(26)

    button.onclick({target: button, preventDefault: chai.spy(), stopPropagation: chai.spy()})
    expect(dpicker.valid).to.be.true
    expect(moment(dpicker.model).month()).to.equal(3)
    expect(moment(dpicker.model).date()).to.equal(28)

    button.onclick({target: button, preventDefault: chai.spy(), stopPropagation: chai.spy()})
    expect(dpicker.valid).to.be.true
    expect(moment(dpicker.model).month()).to.equal(2)
    expect(moment(dpicker.model).date()).to.equal(31)
  })

  it('should enable click on next month days', function () {
    let label = document.createElement('label')
    let dpicker = DPicker(label, {
      model: moment('26/06/1991', 'DD/MM/YYYY'),
      format: 'DD/MM/YYYY',
      siblingMonthDayClick: true,
      display: true,
      hideOnDayClick: false
    })

    document.body.appendChild(label)

    let buttons = document.querySelectorAll('button')
    let button = buttons[buttons.length - 1]
    button.onclick({target: button, preventDefault: chai.spy(), stopPropagation: chai.spy()})
    expect(dpicker.valid).to.be.true
    expect(moment(dpicker.model).month()).to.equal(6)
  })

  it('should not enable click on next month days if > max', function () {
    let label = document.createElement('label')
    DPicker(label, {
      model: moment('26/06/1991', 'DD/MM/YYYY'),
      max: moment('30/06/1991', 'DD/MM/YYYY'),
      format: 'DD/MM/YYYY',
      siblingMonthDayClick: true,
      display: true,
      hideOnDayClick: false
    })

    document.body.appendChild(label)

    let buttons = document.querySelectorAll('button')
    let button = buttons[buttons.length - 1]
    expect(button.textContent.trim()).to.equal('30')
  })

  it('should not enable click on previous month days if < min', function () {
    let label = document.createElement('label')
    DPicker(label, {
      model: moment('26/06/1991', 'DD/MM/YYYY'),
      min: moment('10/06/1991', 'DD/MM/YYYY'),
      format: 'DD/MM/YYYY',
      siblingMonthDayClick: true,
      display: true,
      hideOnDayClick: false
    })

    document.body.appendChild(label)

    let buttons = document.querySelectorAll('button')
    let button = buttons[0]
    expect(button.textContent.trim()).to.equal('10')
  })

  it('should not set model if date is invalid', function () {
    const dpicker = createDatePicker()
    dpicker.model = 'foo'
    expect(dpicker.model).not.to.equal('foo')
  })

  // Cause of this bug is that only year was changed, added a change on month if not in the min/max interval
  it('should handle max interval of 1 year +', function (cb) {
    let label = document.createElement('label')
    const dpicker = DPicker(label, {
      model: moment('01/08/2017', 'DD/MM/YYYY'),
      min: moment('01/08/2017', 'DD/MM/YYYY'),
      max: moment('01/02/2018', 'DD/MM/YYYY'),
      format: 'DD/MM/YYYY',
      onChange: (data) => {
        expect(document.querySelectorAll('td.dpicker-active').length).to.be.above(0)
        cb()
        dpicker.onChange = noop
      },
      display: true
    })

    document.body.appendChild(label)

    let select = document.querySelector('select[name=dpicker-year]')
    let index = [].slice.call(select.options).findIndex((e) => e.innerHTML === '2018')

    select.selectedIndex = index
    select.onchange({target: select})
  })

  it('should handle min interval of 1 year +', function (cb) {
    let label = document.createElement('label')
    const dpicker = DPicker(label, {
      model: moment('01/08/2018', 'DD/MM/YYYY'),
      min: moment('01/09/2017', 'DD/MM/YYYY'),
      max: moment('01/08/2018', 'DD/MM/YYYY'),
      format: 'DD/MM/YYYY',
      onChange: (data) => {
        expect(document.querySelectorAll('td.dpicker-active').length).to.be.above(0)
        cb()
        dpicker.onChange = noop
      },
      display: true
    })

    document.body.appendChild(label)

    let select = document.querySelector('select[name=dpicker-year]')
    let index = [].slice.call(select.options).findIndex((e) => e.innerHTML === '2017')

    select.selectedIndex = index
    select.onchange({target: select})
  })

  it('should keep data attributes / classes from original input', function () {
    const label = document.createElement('label')
    const input = document.createElement('input')
    input.setAttribute('data-foo', 'bar')
    input.classList.add('my-class')
    label.appendChild(input)
    document.body.appendChild(label)
    const dpicker = new DPicker(input)

    const newInput = document.getElementById(dpicker.container).querySelector('input')

    expect(newInput.getAttribute('data-foo')).to.equal('bar')
    expect(newInput.classList.contains('my-class')).to.be.true
  })

  it('should enable/disable input on disabled option toggle', function () {
    const dpicker = createDatePicker({disabled: true})
    let input = document.querySelector('input[name=dpicker-input]')
    dpicker.disabled = true
    expect(input.getAttribute('disabled')).to.equal('disabled')
    dpicker.disabled = false
    expect(input.getAttribute('disabled')).to.be.null
  })

  it('should not open the calendar on click', function () {
    const dpicker = createDatePicker({
      showCalendarOnInputFocus: false,
      display: false
    })

    let input = document.querySelector('input[name=dpicker-input]')
    input.focus()
    expect(dpicker.display).to.be.false
  })

  it('should add a button to open the calendar', function (cb) {
    const dpicker = createDatePicker({
      showCalendarButton: true,
      showCalendarOnInputFocus: false,
      display: false,
      onChange: (data) => {
        expect(data.display).to.be.true
        cb()
        dpicker.onChange = noop
      }
    })

    let button = document.querySelector('button[name=dpicker-button-calendar]')
    button.click()
  })

  it('should allow multiple formats', function (cb) {
    const dpicker = createDatePicker({
      onChange: (data, ev) => {
        expect(dpicker.input).to.equal('24/06/1991')
        cb()
      },
      format: ['DD/MM/YYYY', 'D/M/YY']
    })

    let input = document.querySelector('input[name=dpicker-input]')
    input.value = '24/6/91'
    input.onchange({target: input})
  })
})

require('./plugins/arrow-navigation.spec.js')
require('./plugins/modifiers.spec.js')
require('./plugins/time.spec.js')
