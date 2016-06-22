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

    container = document.createElement('div')
    container.setAttribute('id', 'dpicker')
    document.body.appendChild(container)
    dpicker = new DPicker(container, opts || {})
    projector = maquetteQuery.createTestProjector(dpicker.render.bind(dpicker))
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
    dpicker.format = 'MM/DD/YYYY'

    let input = getElementByName('dpicker-input')

    expect(input.properties.value).to.equal(dpicker.model.format(dpicker.format))
  })
})
