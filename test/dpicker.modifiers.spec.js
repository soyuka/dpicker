'use strict'
const moment = require('moment')
const expect = require('chai').expect

describe('dpicker.modifiers', function() {
  before(() => {
    document.body.innerHTML = ''
    require('dpicker.modifiers')
  })

  it('should replace modifiers', function() {
    const now = moment()
    const dpicker = createDatePicker()

    let input = getElementByName('dpicker-input')

    input.simulate.change({value: '24/06/1991'})
    expect(dpicker.model.format('YYYYMMDD')).to.equal('19910624')

    input.simulate.change({value: '+'})
    expect(dpicker.model.format('YYYYMMDD')).to.equal(now.format('YYYYMMDD'))

    input.simulate.change({value: '+100'})
    expect(dpicker.model.format('YYYYMMDD')).to.equal(now.clone().add(100, 'days').format('YYYYMMDD'))

    input.simulate.change({value: '-'})
    expect(dpicker.model.format('YYYYMMDD')).to.equal(now.clone().subtract(1, 'days').format('YYYYMMDD'))

    input.simulate.change({value: '-10'})
    expect(dpicker.model.format('YYYYMMDD')).to.equal(now.clone().subtract(10, 'days').format('YYYYMMDD'))
  })

  it('should call onChange twice', function(cb) {
    let i = 0
    const dpicker = createDatePicker({onChange: function() {
      if (++i === 2) {
        cb()
      }
    }})

    let input = getElementByName('dpicker-input')
    input.simulate.change({value: '+'})
  })
})
