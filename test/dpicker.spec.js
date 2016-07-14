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
        expect(input.properties.value).to.equal(dpicker.model.format(dpicker.format))
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
        expect(input.properties.value).to.equal(dpicker.model.format(dpicker.format))
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
    const dpicker = createDatePicker({futureYear: 2026, pastYear: 1900})

    let options = document.querySelector('select[name="dpicker-year"]').options
    expect(+options[0].value).to.equal(2026)
    expect(options.length).to.equal(2027 - 1900)
    expect(+options[options.length - 1].value).to.equal(1900)
  })

  it('should have customized format', function() {
    const dpicker = createDatePicker()

    let input = getElementByName('dpicker-input')
    dpicker.format = 'MM/DD/YYYY'

    expect(input.properties.value).to.equal(dpicker.model.format(dpicker.format))
  })

  it('should change dpicker according to input change', function(cb) {
    const dpicker = createDatePicker({
      onChange: (data) => {
        expect(dpicker.model.format(dpicker.format)).to.equal('24/06/1991')
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
    expect(dpicker.model.format(dpicker.format)).to.equal('24/06/1991')
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
})
