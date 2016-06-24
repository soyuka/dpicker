'use strict'
const jsdom = require('mocha-jsdom')
const expect = require('chai').expect
const DPicker = require('./dist/dpicker.js')
const requestFrame = require('request-frame')
const maquetteQuery = require('maquette-query')

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

    if (!opts) { opts = {} }

    container = document.createElement('div')
    container.setAttribute('id', 'dpicker')
    document.body.appendChild(container)
    dpicker = new DPicker(container, opts || {})

    projector = maquetteQuery.createTestProjector(
      dpicker.render(dpicker._events, dpicker._data, [
        dpicker.renderYears(dpicker._events, dpicker._data),
        dpicker.renderMonths(dpicker._events, dpicker._data),
        dpicker.renderDays(dpicker._events, dpicker._data),
      ])
    )
  }

  before(function() {
    createDatePicker()
  })

  it('should init a dpicker', function() {
    expect(document.getElementById(dpicker.container)).not.to.be.null
  })


  it('should change year', function() {
    let selectedIndex = 4
    let select = getElementByName('dpicker-year')
    let options = document.querySelector('select[name="dpicker-year"]').options

    select.simulate.change({
      options: options,
      selectedIndex: selectedIndex
    })

    expect(select.children[selectedIndex].properties.selected).to.be.true

    let input = getElementByName('dpicker-input')

    expect(''+dpicker.model.year()).to.equal(options[selectedIndex].value)
    expect(input.properties.value).to.equal(dpicker.model.format(dpicker.format))
  })

  it('should change month', function() {
    let selectedIndex = 4
    let select = getElementByName('dpicker-month')

    let options = document.querySelector('select[name="dpicker-month"]').options

    select.simulate.change({
      options: options,
      selectedIndex: selectedIndex
    })

    expect(select.children[selectedIndex].properties.selected).to.be.true

    let input = getElementByName('dpicker-input')

    expect(''+dpicker.model.month()).to.equal(options[selectedIndex].value)
    expect(input.properties.value).to.equal(dpicker.model.format(dpicker.format))
  })

  it('should change day', function() {
    let button = projector.query(function(vnode) {
      return vnode.vnodeSelector == 'button'
    })

    button.simulate.click({value: button.properties.value})
    expect(dpicker.model.date()).to.equal(button.properties.value)
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

  it('should change dpicker according to input change', function() {
    let input = getElementByName('dpicker-input')

    dpicker.format = 'DD/MM/YYYY'
    input.simulate.change({value: '24/06/1991'})

    expect(dpicker.model.format(dpicker.format)).to.equal('24/06/1991')
  })

  it('should display dpicker on input focus', function() {
    let input = getElementByName('dpicker-input')

    input.simulate.focus()
    expect(dpicker.display).to.be.true
  })

  it('should hide container on outside click', function() {
    document.body.click()
    expect(dpicker.display).to.be.false
  })

  it('should not hide container on inside click', function() {
    let input = getElementByName('dpicker-input')

    input.simulate.focus()
    expect(dpicker.display).to.be.true
    document.getElementById(dpicker.container).children[0].click()
    expect(dpicker.display).to.be.true
  })

  it('should intercept events', function(cb) {
    createDatePicker({onChange: function() {
      cb()
    }})

    let input = getElementByName('dpicker-input')

    input.simulate.focus()

  })
})
