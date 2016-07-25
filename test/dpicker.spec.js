'use strict'
const moment = require('moment')
const expect = require('chai').expect

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

  it('should change year', function(cb) {
    const dpicker = createDatePicker({
      onChange: (data) => {
        expect(select.children[selectedIndex].properties.selected).to.be.true

        let input = getElementByName('dpicker-input')
        expect(''+dpicker.model.year()).to.equal(options[selectedIndex].value)
        expect(input.properties.value).to.equal(dpicker.input)
        cb()
      }
    })

    let selectedIndex = 4
    let select = getElementByName('dpicker-year')
    let options = document.querySelector('select[name="dpicker-year"]').options

    select.simulate.change({
      options: options,
      selectedIndex: selectedIndex
    })

  })

  it('should change month', function(cb) {
    const dpicker = createDatePicker({
      onChange: (data) => {
        expect(select.children[selectedIndex].properties.selected).to.be.true

        let input = getElementByName('dpicker-input')
        expect(''+dpicker.model.month()).to.equal(options[selectedIndex].value)
        expect(input.properties.value).to.equal(dpicker.input)
        cb()
      }
    })

    let selectedIndex = 4
    let select = getElementByName('dpicker-month')

    let options = document.querySelector('select[name="dpicker-month"]').options

    select.simulate.change({
      options: options,
      selectedIndex: selectedIndex
    })
  })

  it('should change day', function(cb) {
    const dpicker = createDatePicker({
      onChange: (data) => {
        expect(dpicker.model.date()).to.equal(button.properties.value)
        expect(dpicker.display).to.equal(false)
        cb()
      }
    })

    let button = DPickerProjector.query(function(vnode) {
      return vnode.vnodeSelector == 'button'
    })

    button.simulate.click({value: button.properties.value})
  })

  it('should have customized date range', function() {
    const dpicker = createDatePicker({max: moment('2026-01-12'), min: moment('1900-01-01')})

    let options = document.querySelector('select[name="dpicker-year"]').options
    expect(+options[0].value).to.equal(2026)
    expect(options.length).to.equal(2027 - 1900)
    expect(+options[options.length - 1].value).to.equal(1900)
  })

  it('should change number of displayed months on min date', function() {
    const dpicker = createDatePicker({min: moment('1900-06-01'), model: moment('1900-05-01'), format: 'YYYY-MM-DD'})

    let options = document.querySelector('select[name="dpicker-month"]').options
    expect(options.length).to.equal(7)
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

    let input = getElementByName('dpicker-input')
    dpicker.format = 'MM/DD/YYYY'

    expect(input.properties.value).to.equal(dpicker.input)
  })

  it('should change dpicker according to input change', function(cb) {
    const dpicker = createDatePicker({
      onChange: (data) => {
        expect(dpicker.input).to.equal('24/06/1991')
        cb()
      }
    })

    let input = getElementByName('dpicker-input')

    dpicker.format = 'DD/MM/YYYY'
    input.simulate.change({value: '24/06/1991'})
  })

  it('should not fail on invalid input change', function() {
    const dpicker = createDatePicker()
    let input = getElementByName('dpicker-input')

    dpicker.format = 'DD/MM/YYYY'
    input.simulate.change({value: '24/06/1991'})
    input.simulate.change({value: 'test'})
    expect(dpicker.input).to.equal('24/06/1991')
  })

  it('should display dpicker on input focus', function() {
    const dpicker = createDatePicker()
    let input = getElementByName('dpicker-input')
    input.simulate.focus()
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
    let input = getElementByName('dpicker-input')

    input.simulate.focus()
    expect(dpicker.display).to.be.true
    document.getElementById(dpicker.container).children[0].click()
    expect(dpicker.display).to.be.true
  })

  it('should be empty', function() {
    const dpicker = createDatePicker()
    let input = getElementByName('dpicker-input')

    input.simulate.change({value: '24/06/1991'})
    expect(dpicker._data.isEmpty).to.be.false
    input.simulate.change({value: ''})
    expect(dpicker._data.isEmpty).to.be.true
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
      expect(e.message).to.equal('Can not init DPicker on an input without parent node')
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
    expect(dpicker._data.isEmpty).to.be.false
    dpicker.model = ''
    expect(dpicker._data.isEmpty).to.be.true
  })

  it('should add a modifier', function() {
    const now = moment()
    const dpicker = createDatePicker({
      model: moment('24/06/1991', 'DD/MM/YYYY'),
      modifier: function() {
        if (this.input == '+') {
          this.model = now
        }
      }
    })

    let input = getElementByName('dpicker-input')

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

  it('should change hours (24h format)', function(cb) {
    const dpicker = createDatePicker({
      onChange: (data) => {
        expect(select.children[selectedIndex].properties.selected).to.be.true

        let input = getElementByName('dpicker-input')
        expect(''+dpicker.model.hours()).to.equal(options[selectedIndex].value)
        expect(input.properties.value).to.equal(dpicker.input)
        cb()
      },
      time: true
    })

    let selectedIndex = 4
    let select = getElementByName('dpicker-hours')
    let options = document.querySelector('select[name="dpicker-hours"]').options

    select.simulate.change({
      options: options,
      selectedIndex: selectedIndex
    })

  })

  it('should change minutes (24h format)', function(cb) {
    const dpicker = createDatePicker({
      onChange: (data) => {
        expect(select.children[selectedIndex].properties.selected).to.be.true

        let input = getElementByName('dpicker-input')
        expect(''+dpicker.model.minutes()).to.equal(options[selectedIndex].value)
        expect(input.properties.value).to.equal(dpicker.input)
        cb()
      },
      time: true
    })

    let selectedIndex = 4
    let select = getElementByName('dpicker-minutes')
    let options = document.querySelector('select[name="dpicker-minutes"]').options

    select.simulate.change({
      options: options,
      selectedIndex: selectedIndex
    })
  })

  it('should change hours AM (12h format)', function(cb) {
    const dpicker = createDatePicker({
      time: true,
      meridiem: true
    })

    let meridiem = getElementByName('dpicker-meridiem')
    let moptions = document.querySelector('select[name="dpicker-meridiem"]').options

    meridiem.simulate.change({
      options: moptions,
      selectedIndex: 0 //AM
    })

    let select = getElementByName('dpicker-hours')
    let options = document.querySelector('select[name="dpicker-hours"]').options

    dpicker.onChange = (data) => {
      expect(dpicker.model.hours()).to.equal(0)
    }

    select.simulate.change({
      options: options,
      selectedIndex: 0 //12
    })

    dpicker.onChange = (data) => {
      expect(dpicker.model.hours()).to.equal(12)
    }

    meridiem.simulate.change({
      options: moptions,
      selectedIndex: 1 //PM
    })

    dpicker.onChange = (data) => {
      expect(dpicker.model.hours()).to.equal(23)
    }

    select.simulate.change({
      options: options,
      selectedIndex: 11 //11
    })

    dpicker.onChange = (data) => {
      expect(dpicker.model.hours()).to.equal(12)
    }

    select.simulate.change({
      options: options,
      selectedIndex: 0 //12
    })

    dpicker.onChange = (data) => {
      expect(dpicker.model.hours()).to.equal(0)
    }

    meridiem.simulate.change({
      options: moptions,
      selectedIndex: 0 //AM
    })

    dpicker.onChange = (data) => {
      expect(dpicker.model.hours()).to.equal(12)
      cb()
    }

    meridiem.simulate.change({
      options: moptions,
      selectedIndex: 1 //PM
    })
  })

  it('should bind to an input[type="datetime"]', function() {
    let input = document.createElement('input')
    let label = document.createElement('label')
    input.setAttribute('type', 'datetime')
    input.setAttribute('id', 't')

    label.appendChild(input)
    label.setAttribute('for', 't')
    document.body.appendChild(label)

    const dpicker = DPicker(input)

    expect(dpicker.time).to.equal(true)
    expect(input.getAttribute('type')).to.equal('text')

    let options = document.querySelector('select[name="dpicker-hours"]').options
    expect(options).to.have.length.of(24)
  })

  it('should bind to an input[type="datetime"] with meridiem', function() {
    let input = document.createElement('input')
    let label = document.createElement('label')
    input.setAttribute('type', 'datetime')
    input.setAttribute('time-format', '12h')
    input.setAttribute('id', 't')

    label.appendChild(input)
    label.setAttribute('for', 't')
    document.body.appendChild(label)

    const dpicker = DPicker(input)

    expect(dpicker.time).to.equal(true)
    expect(input.getAttribute('type')).to.equal('text')

    let options = document.querySelector('select[name="dpicker-hours"]').options
    expect(options).to.have.length.of(12)
  })

  it('should have minutes step of 5', function() {
    const dpicker = createDatePicker({
      time: true,
      step: 5
    })

    let options = document.querySelector('select[name="dpicker-minutes"]').options

    expect(options).to.have.length.of(12)
  })
})
