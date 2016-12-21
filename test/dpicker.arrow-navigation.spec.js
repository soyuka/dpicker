'use strict'
const moment = require('moment')
const expect = require('chai').expect
const DPicker = require('dpicker')

describe('dpicker.arrow-navigation', function() {
  before(() => {
    document.body.innerHTML = ''
    require('dpicker.arrow-navigation')
  })

  it('should enable arrows navigation on days', function() {
    let label = document.createElement('label')
    let dpicker = DPicker(label, {model: moment('24/06/1991', 'DD/MM/YYYY')})
    document.body.appendChild(label)

    let dateFocusIs = function(x) {
      expect(document.activeElement.innerText).to.equal(x)
    }

    let keyDown = function(keyCode) {
      var event = new window.Event('Event');
      event.initEvent('keydown', true, true)
      event.keyCode = keyCode
      document.activeElement.dispatchEvent(event);
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

})
