'use strict'
const jsdom = require('mocha-jsdom')
const expect = require('chai').expect
const DPicker = require('./dist/dpicker.js')
const requestFrame = require('request-frame')
const maquetteQuery = require('maquette-query')
const moment = require('moment')

describe('dpicker', function() {
  jsdom()

  global.screen = {}
  global.requestAnimationFrame = requestFrame('request')

  let container
  let dpicker
  let projector

  function getElementByName(name) {
    return projector.query(function(vnode) {
      return vnode.properties && vnode.properties.name == name
    })
  }

  function createDatePicker(opts) {
    if (container) {
      document.body.removeChild(container)
    }

    container = document.createElement('div')
    container.setAttribute('id', 'dpicker')
    document.body.appendChild(container)
    dpicker = new DPicker(container, opts || undefined)

    projector = maquetteQuery.createTestProjector(
      dpicker.renderContainer(dpicker._events, dpicker._data, [
        dpicker.renderInput(dpicker._events, dpicker._data),
        dpicker.renderYears(dpicker._events, dpicker._data),
        dpicker.renderMonths(dpicker._events, dpicker._data),
        dpicker.renderDays(dpicker._events, dpicker._data),
      ])
    )
  }

  it('should init a dpicker', function() {
    createDatePicker()
    expect(document.getElementById(dpicker.container)).not.to.be.null
  })


  it('should change year', function(cb) {
    createDatePicker({
      onChange: (data, properties) => {
        expect(properties).to.contain('model')
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
    createDatePicker({
      onChange: (data, properties) => {
        expect(properties).to.contain('model')
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
    createDatePicker({
      onChange: (data, properties) => {
        expect(properties).to.contain('model')
        expect(dpicker.model.date()).to.equal(button.properties.value)
        expect(dpicker.display).to.equal(false)
        cb()
      }
    })

    let button = projector.query(function(vnode) {
      return vnode.vnodeSelector == 'button'
    })

    button.simulate.click({value: button.properties.value})
  })

  it('should have customized date range', function() {
    createDatePicker({futureYear: 2026, pastYear: 1900})

    let options = document.querySelector('select[name="dpicker-year"]').options
    expect(+options[0].value).to.equal(2026)
    expect(options.length).to.equal(2027 - 1900)
    expect(+options[options.length - 1].value).to.equal(1900)
  })

  it('should have customized format', function() {
    let input = getElementByName('dpicker-input')
    dpicker.format = 'MM/DD/YYYY'

    expect(input.properties.value).to.equal(dpicker.model.format(dpicker.format))
  })

  it('should change dpicker according to input change', function(cb) {
    createDatePicker({
      onChange: (data, properties) => {
        expect(properties).to.contain('model')
        expect(dpicker.model.format(dpicker.format)).to.equal('24/06/1991')
        cb()
      }
    })

    let input = getElementByName('dpicker-input')

    dpicker.format = 'DD/MM/YYYY'
    input.simulate.change({value: '24/06/1991'})
  })

  it('should not fail on invalid input change', function() {
    createDatePicker()
    let input = getElementByName('dpicker-input')

    dpicker.format = 'DD/MM/YYYY'
    input.simulate.change({value: '24/06/1991'})
    input.simulate.change({value: 'test'})
    expect(dpicker.model.format(dpicker.format)).to.equal('24/06/1991')
  })

  it('should display dpicker on input focus', function(cb) {
    createDatePicker({
      onChange: (data, properties) => {
        expect(properties).to.contain('display')
        expect(dpicker.display).to.be.true
        cb()
      }
    })

    let input = getElementByName('dpicker-input')
    input.simulate.focus()
  })

  it('should hide container on outside click', function(cb) {
    dpicker.display = true
    dpicker.onChange = function(data, properties) {
      expect(properties).to.contain('display')
      expect(dpicker.display).to.be.false
      cb()
    }

    document.body.click()
  })

  it('should not hide container on inside click', function() {
    createDatePicker()
    let input = getElementByName('dpicker-input')

    input.simulate.focus()
    expect(dpicker.display).to.be.true
    document.getElementById(dpicker.container).children[0].click()
    expect(dpicker.display).to.be.true
  })

  it('should be empty', function() {
    let input = getElementByName('dpicker-input')

    input.simulate.change({value: '24/06/1991'})
    expect(dpicker._data.isEmpty).to.be.false
    input.simulate.change({value: ''})
    expect(dpicker._data.isEmpty).to.be.true
  })

  it('should enable arrows navigation on days', function() {
    createDatePicker({model: moment('24/06/1991', 'DD/MM/YYYY')})

    let button = projector.queryAll('button').getResult(0)

    let dateFocusIs = function(x) {
      expect(document.activeElement.innerHTML).to.equal(''+x)
    }

    let keyDown = function(keycode) {
      button.simulate.keyDown(keycode, document.activeElement)
    }

    let buttons = document.querySelectorAll('button')

    buttons[0].focus()
    dateFocusIs(1)

    //left
    keyDown(37)
    dateFocusIs(30)
    keyDown(37)
    dateFocusIs(29)
    keyDown(37)
    dateFocusIs(28)
    //right
    keyDown(39)
    dateFocusIs(29)
    keyDown(39)
    dateFocusIs(30)
    keyDown(39)
    dateFocusIs(1)
    //up
    keyDown(38)
    dateFocusIs(29)
    keyDown(38)
    dateFocusIs(22)
    //down
    keyDown(40)
    dateFocusIs(29)
    keyDown(40)
    dateFocusIs(1)

    buttons[buttons.length - 1].focus()
    keyDown(40)
    dateFocusIs(2)

    //useless coverage \o/
    keyDown(41)
    dateFocusIs(2)
  })

  it('should init dpicker on a container', function() {
    let label = document.createElement('label')
    let dpicker = DPicker(label, {model: ''})

    document.body.appendChild(label)
  })

  it('should not init dpicker on an input without container', function() {
    let input = document.createElement('input')

    try {
      let dpicker = DPicker(input, {model: ''})
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

    let dpicker = DPicker(input, {model: '', inputId: 't'})
    expect(dpicker.inputId).to.equal('t')

    dpicker.model = moment('24/06/1991', 'DD/MM/YYYY')
    expect(dpicker._data.isEmpty).to.be.false
    dpicker.model = ''
    expect(dpicker._data.isEmpty).to.be.true
  })
})
