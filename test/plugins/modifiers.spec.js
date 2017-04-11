'use strict'
const moment = require('moment')
const expect = require('chai').expect
const DPicker = require('../../dist/dpicker.js')

describe('dpicker.modifiers', function() {
  require('../../dist/dpicker.modifiers.js')(DPicker)

  before(() => {
    document.body.innerHTML = ''
  })

  it('should replace modifiers', function() {
    const now = moment()
    const dpicker = createDatePicker()

    let input = document.querySelector('input[name=dpicker-input]')

    input.value = '24/06/1991'
    input.onchange({target: input})
    expect(moment(dpicker.model).format('YYYYMMDD')).to.equal('19910624')

    input.value = '+'
    input.onchange({target: input})
    expect(moment(dpicker.model).format('YYYYMMDD')).to.equal(now.format('YYYYMMDD'))

    input.value = '+100'
    input.onchange({target: input})
    expect(moment(dpicker.model).format('YYYYMMDD')).to.equal(now.clone().add(100, 'days').format('YYYYMMDD'))

    input.value = '-'
    input.onchange({target: input})
    expect(moment(dpicker.model).format('YYYYMMDD')).to.equal(now.clone().subtract(1, 'days').format('YYYYMMDD'))

    input.value = '-10'
    input.onchange({target: input})
    expect(moment(dpicker.model).format('YYYYMMDD')).to.equal(now.clone().subtract(10, 'days').format('YYYYMMDD'))
  })

  it('should call onChange twice', function(cb) {
    let i = 0
    const dpicker = createDatePicker({onChange: function() {
      if (++i === 2) {
        cb()
      }
    }})

    let input = document.querySelector('input[name=dpicker-input]')
    input.value = '+'
    input.onchange({target: input})
  })
})
