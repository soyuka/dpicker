'use strict'
const moment = require('moment')
const chai = require('chai')
const spies = require('chai-spies')
chai.use(spies)
const expect = chai.expect

function keyDown(keyCode, element) {
  var event = new window.Event('Event');
  event.initEvent('keydown', true, true)
  event.keyCode = keyCode
  element.dispatchEvent(event);
}

describe('dpicker', function() {
  const DPicker = require('dpicker')

  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('should init a dpicker', function() {
    const dpicker = createDatePicker()
    expect(document.getElementById(dpicker.container)).not.to.be.null
  })

  it('should init a dpicker with different order', function() {
    const dpicker = createDatePicker({order: ['years', 'months', 'days']})
    expect(document.getElementById(dpicker.container)).not.to.be.null
    let selects = document.querySelectorAll('select')

    expect(selects[0].getAttribute('name')).to.equal('dpicker-year')
    expect(selects[1].getAttribute('name')).to.equal('dpicker-month')
  })

  it('should init a dpicker with different order + not defined item', function() {
    const dpicker = createDatePicker({order: ['years', 'months', 'foobar', 'days']})
    expect(document.getElementById(dpicker.container)).not.to.be.null
    let selects = document.querySelectorAll('select')

    expect(selects[0].getAttribute('name')).to.equal('dpicker-year')
    expect(selects[1].getAttribute('name')).to.equal('dpicker-month')
  })

  it('should change year', function(cb) {
    const dpicker = createDatePicker({
      onChange: (data) => {
        expect(select.children[selectedIndex].selected).to.be.true

        let input = document.querySelector('input[name=dpicker-input]')
        expect(''+dpicker.model.year()).to.equal(select.options[selectedIndex].value)
        expect(input.value).to.equal(dpicker.input)
        cb()
      }
    })

    let selectedIndex = 4
    let select = document.querySelector('select[name=dpicker-year]')
    select.selectedIndex = selectedIndex
    select.onchange({target: select})
  })

  it('should change month', function(cb) {
    const dpicker = createDatePicker({
      onChange: (data) => {
        expect(select.children[selectedIndex].selected).to.be.true

        let input = document.querySelector('input[name=dpicker-input]')
        expect(''+dpicker.model.month()).to.equal(select.options[selectedIndex].value)
        expect(input.value).to.equal(dpicker.input)
        cb()
      }
    })

    let selectedIndex = 4
    let select = document.querySelector('select[name=dpicker-month]')
    select.selectedIndex = selectedIndex
    select.onchange({target: select})
  })

  it('should change day', function(cb) {
    const fn = chai.spy()

    const dpicker = createDatePicker({
      onChange: (data) => {
        expect(fn).to.have.been.called()
        expect(''+dpicker.model.date()).to.equal(button.value)
        expect(dpicker.display).to.equal(false)
        cb()
      }
    })

    let button = document.querySelectorAll('button')[0]
    button.onclick({target: button, preventDefault: fn})
  })

  it('should have customized date range', function() {
    const dpicker = createDatePicker({max: moment('2026-01-12'), min: moment('1900-01-01')})

    let options = document.querySelector('select[name="dpicker-year"]').options
    expect(+options[0].value).to.equal(2026)
    expect(options.length).to.equal(2027 - 1900)
    expect(+options[options.length - 1].value).to.equal(1900)
  })

  it('should change number of displayed months on min date', function() {
    const dpicker = createDatePicker({min: moment('1900-06-01'), model: moment('1900-06-01'), format: 'YYYY-MM-DD'})

    let options = document.querySelector('select[name="dpicker-month"]').options
    expect(options.length).to.equal(7)
  })

  it('should change days active on min date', function() {
    const dpicker = createDatePicker({min: moment('1991-06-24'), model: moment('1991-06-24'), format: 'YYYY-MM-DD'})

    let days = document.querySelectorAll('button')
    expect(days).to.have.length.of(7)
  })

  it('should change days active on max date', function() {
    const dpicker = createDatePicker({max: moment('1991-06-24'), model: moment('1991-06-24'), format: 'YYYY-MM-DD'})

    let days = document.querySelectorAll('button')
    expect(days).to.have.length.of(24)
  })

  it('should bind to an input[type="date"]', function() {
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

    const dpicker = DPicker(input)

    expect(dpicker.inputId).to.equal('t')
    expect(dpicker.format).to.equal('YYYY-MM-DD')
    expect(dpicker.min.format('YYYY-MM-DD')).to.equal('1991-06-24')
    expect(dpicker.max.format('YYYY-MM-DD')).to.equal('1992-11-21')
    expect(dpicker.model.format('YYYY-MM-DD')).to.equal('1992-10-10')

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

  it('should bind to an input[type="date"] with an empty value', function() {
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

  it('should have customized format', function() {
    const dpicker = createDatePicker()

    let input = document.querySelector('input[name=dpicker-input]')
    dpicker.format = 'MM/DD/YYYY'

    expect(input.value).to.equal(dpicker.input)
  })

  it('should change dpicker according to input change', function(cb) {
    const dpicker = createDatePicker({
      onChange: (data) => {
        expect(dpicker.input).to.equal('24/06/1991')
        cb()
      }
    })

    let input = document.querySelector('input[name=dpicker-input]')

    dpicker.format = 'DD/MM/YYYY'
    input.value = '24/06/1991'
    input.onchange({target: input})
  })

  it('should not fail on invalid input change', function() {
    const dpicker = createDatePicker()
    let input = document.querySelector('input[name=dpicker-input]')

    dpicker.format = 'DD/MM/YYYY'
    input.value = '24/06/1991'
    input.onchange({target: input})
    input.value = 'test'
    input.onchange({target: input})
    expect(dpicker.input).to.equal('24/06/1991')
  })

  it('should display dpicker on input focus', function() {
    const dpicker = createDatePicker()
    let input = document.querySelector('input[name=dpicker-input]')
    input.focus()
    expect(dpicker.display).to.be.true
  })

  it('should hide container on outside click', function() {
    const dpicker = createDatePicker()
    dpicker.display = true
    document.body.click()
    expect(dpicker.display).to.be.false
  })

  it('should not hide container on inside click', function() {
    const dpicker = createDatePicker()
    let input = document.querySelector('input[name=dpicker-input]')

    input.focus()
    expect(dpicker.display).to.be.true
    document.getElementById(dpicker.container).children[0].click()
    expect(dpicker.display).to.be.true
  })

  it('should be empty', function() {
    const dpicker = createDatePicker()
    let input = document.querySelector('input[name=dpicker-input]')
    input.value = '24/06/1991'
    input.onchange({target: input})
    expect(dpicker._data.empty).to.be.false
    input.value = ''
    input.onchange({target: input})
    expect(dpicker._data.empty).to.be.true
  })

  it('should init dpicker on a container', function() {
    let label = document.createElement('label')
    const dpicker = DPicker(label, {model: ''})

    document.body.appendChild(label)
  })

  it('should not init dpicker on an input without container', function() {
    let input = document.createElement('input')

    try {
      const dpicker = DPicker(input, {model: ''})
    } catch(e) {
      expect(e).to.be.an.instanceof(ReferenceError)
      expect(e.message).to.equal('Can not initialize DPicker on an input without parent node')
    }
  })

  it('should init dpicker on an input', function() {
    let input = document.createElement('input')
    let label = document.createElement('label')
    label.appendChild(input)
    label.setAttribute('for', 't')

    const dpicker = DPicker(input, {model: '', inputId: 't'})
    expect(dpicker.inputId).to.equal('t')

    dpicker.model = moment('24/06/1991', 'DD/MM/YYYY')
    expect(dpicker._data.empty).to.be.false
    dpicker.model = ''
    expect(dpicker._data.empty).to.be.true
  })

  it('should add a modifier', function() {
    this.skip('feature removed')
    const now = moment()
    const dpicker = createDatePicker({
      model: moment('24/06/1991', 'DD/MM/YYYY'),
      modifier: function() {
        if (this.input == '+') {
          this.model = now
        }
      }
    })

    let input = document.querySelector('input[name=dpicker-input]')

    input.simulate.change({value: '+'})

    expect(dpicker.model.format('YYYYMMDD')).to.equal(now.format('YYYYMMDD'))
  })

  it('should hide dpicker and blur input on enter keypress', function() {
    let label = document.createElement('label')
    let dpicker = DPicker(label, {model: moment('24/06/1991', 'DD/MM/YYYY')})
    document.body.appendChild(label)

    let input = label.querySelector('input[type="text"]')

    input.focus()
    expect(dpicker.display).to.be.true

    //enter
    keyDown(13, input)

    expect(dpicker.display).to.be.false
    expect(document.activeElement).not.to.equal(input)
  })

  it('should hide dpicker and blur input on escape keypress', function() {
    let label = document.createElement('label')
    let dpicker = DPicker(label, {model: moment('24/06/1991', 'DD/MM/YYYY')})
    document.body.appendChild(label)

    let input = label.querySelector('input[type="text"]')

    input.focus()
    expect(dpicker.display).to.be.true

    //escape
    keyDown(27, input)
    expect(dpicker.display).to.be.false
    expect(document.activeElement).not.to.equal(input)
  })

  it('should not hide on day click', function() {
    let label = document.createElement('label')
    let dpicker = DPicker(label, {hideOnDayClick: false, display: true})
    document.body.appendChild(label)

    let button = label.querySelectorAll('button')[0]

    expect(dpicker.display).to.be.true
    button.click()
    expect(dpicker.display).to.be.true
  })

  it('should not hide on enter or escape key', function() {
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

  it('should not hide on blur if already hidden', function() {
    let label = document.createElement('label')
    let dpicker = DPicker(label)
    document.body.appendChild(label)

    let input = label.querySelector('input[type="text"]')

    input.focus()
    expect(dpicker.display).to.be.true
    dpicker.display = false
    input.blur()
  })

  it('should not hide on blur if focus is in container', function() {
    let label = document.createElement('label')
    let dpicker = DPicker(label)
    document.body.appendChild(label)

    let input = label.querySelector('input[type="text"]')

    input.focus()
    expect(dpicker.display).to.be.true
    label.querySelectorAll('button')[0].focus()
    expect(dpicker.display).to.be.true
  })

  it('should be valid when dayClick is correct after invalid', function() {
    let label = document.createElement('label')
    let dpicker = DPicker(label, {
      max: moment('24/06/1991', 'DD/MM/YYYY'),
      model: moment('26/06/1991', 'DD/MM/YYYY'),
      format: 'DD/MM/YYYY'
    })

    document.body.appendChild(label)

    let input = label.querySelector('input[type="text"]')

    expect(dpicker.valid).to.be.false
    
    let buttons = document.querySelectorAll('button')
    let button = buttons[buttons.length - 1]
    button.onclick({target: button, preventDefault: chai.spy()})
    expect(dpicker.valid).to.be.true

  })
})
