'use strict'
const moment = require('moment')
const expect = require('chai').expect

describe('dpicker.time', function() {
  const DPicker = require('dpicker')
  require('dpicker.time')

  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('should change hours (24h format)', function(cb) {
    const dpicker = createDatePicker({
      onChange: (data) => {
        expect(select.options[selectedIndex].selected).to.be.true

        let input = document.querySelector('input[name=dpicker-input]')
        expect(''+dpicker.model.hours()).to.equal(select.options[selectedIndex].value)
        expect(input.value).to.equal(dpicker.input)
        cb()
      },
      time: true
    })

    let selectedIndex = 4
    let select = document.querySelector('select[name="dpicker-hours"]')
    select.selectedIndex = 4

    select.onchange({target: select})
  })

  it('should change minutes (24h format)', function(cb) {
    const dpicker = createDatePicker({
      onChange: (data) => {
        expect(select.options[selectedIndex].selected).to.be.true

        let input = document.querySelector('input[name=dpicker-input]')
        expect(''+dpicker.model.minutes()).to.equal(select.options[selectedIndex].value)
        expect(input.value).to.equal(dpicker.input)
        cb()
      },
      time: true
    })

    let selectedIndex = 4
    let select = document.querySelector('select[name="dpicker-minutes"]')
    select.selectedIndex = selectedIndex

    select.onchange({target: select})
  })

  it('should change hours AM (12h format)', function(cb) {
    let format = 'DD/MM/YYYY hh:mm A'
    const dpicker = createDatePicker({
      time: true,
      meridiem: true,
      format: format,
      model: moment('24/06/1991 03:40 PM', format)
    })

    let meridiem = document.querySelector('select[name="dpicker-meridiem"]')

    expect(dpicker.model.hours()).to.equal(15)

    dpicker.onChange = (data) => {
      expect(data.model.hours()).to.equal(3)
    }

    meridiem.selectedIndex = 0 //AM
    meridiem.onchange({target: meridiem})

    let select = document.querySelector('select[name="dpicker-hours"]')

    dpicker.onChange = (data) => {
      expect(data.model.hours()).to.equal(0)
    }

    select.selectedIndex = 11 //12
    select.onchange({
      target: select
    })

    dpicker.onChange = (data) => {
      expect(data.model.hours()).to.equal(12)
    }

    meridiem.selectedIndex = 1 //PM
    meridiem.onchange({target: meridiem})

    dpicker.onChange = (data) => {
      expect(data.model.hours()).to.equal(23)
    }

    select.selectedIndex = 10 //11
    select.onchange({target: select})

    dpicker.onChange = (data) => {
      expect(data.model.hours()).to.equal(12)
    }

    select.selectedIndex = 11 //12
    select.onchange({target: select})

    dpicker.onChange = (data) => {
      expect(data.model.hours()).to.equal(0)
    }

    meridiem.selectedIndex = 0 //AM
    meridiem.onchange({target: meridiem})

    dpicker.onChange = (data) => {
      expect(data.model.hours()).to.equal(12)
      cb()
    }

    meridiem.selectedIndex = 1 //PM
    meridiem.onchange({target: meridiem})
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

    input = document.getElementById('t')
    expect(input.getAttribute('type')).to.equal('text')

    let options = document.querySelector('select[name="dpicker-hours"]').options
    expect(options).to.have.length.of(24)
  })

  it('should bind to an input[type="datetime"] with meridiem', function() {
    let input = document.createElement('input')
    let label = document.createElement('label')
    input.setAttribute('type', 'datetime')
    input.setAttribute('meridiem', 'meridiem')
    input.setAttribute('id', 't')

    label.appendChild(input)
    label.setAttribute('for', 't')
    document.body.appendChild(label)

    const dpicker = DPicker(input)
    expect(dpicker.time).to.equal(true)

    input = document.getElementById('t')
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

  it('should not allow lower hour/min than minDate ones (24)', function() {
    let format = 'YYYY/MM/DD HH:mm';
    const dpicker = createDatePicker({
      time: true,
      format: format,
      model: moment('1991/06/24 15:10', format),
      min: moment('1991/06/24 15:10', format),
    })

    let minutes = document.querySelector('select[name="dpicker-minutes"]').options

    expect(minutes).to.have.length.of(50)

    let hours = document.querySelector('select[name="dpicker-hours"]').options

    expect(hours).to.have.length.of(9)
  })

  it('should not allow lower hour/min than minDate ones (12)', function() {
    let format = 'YYYY/MM/DD hh:mm A';
    const dpicker = createDatePicker({
      time: true,
      meridiem: true,
      format: format,
      model: moment('1991/06/24 10:10 AM', format),
      min: moment('1991/06/24 10:10 AM', format),
    })

    let minutes = document.querySelector('select[name="dpicker-minutes"]').options

    expect(minutes).to.have.length.of(50)

    let hours = document.querySelector('select[name="dpicker-hours"]').options

    expect(hours).to.have.length.of(3)
  })

  it('should keep available hours - min (#11)', function() {
    let format = 'YYYY/MM/DD HH:mm';
    const dpicker = createDatePicker({
      time: true,
      format: format,
      model: moment('1991/06/24 10:10', format),
      min: moment('1991/06/24 10:10', format),
    })

    let hours = document.querySelector('select[name="dpicker-hours"]').options
    expect(hours).to.have.length.of(14)

    dpicker.model = moment('1991/06/24 09:10', format)
    expect(dpicker.valid).to.be.false
    dpicker.model = moment('1991/06/24 11:10', format)
    expect(dpicker.valid).to.be.true

    hours = document.querySelector('select[name="dpicker-hours"]').options
    expect(hours).to.have.length.of(14)
  })

  it('should keep available hours/minutes - max', function() {
    let format = 'YYYY/MM/DD HH:mm';
    const dpicker = createDatePicker({
      time: true,
      format: format,
      model: moment('1991/06/24 10:10', format),
      max: moment('1991/06/24 10:10', format),
    })

    let hours = document.querySelector('select[name="dpicker-hours"]').options
    expect(hours).to.have.length.of(11)
    let minutes = document.querySelector('select[name="dpicker-minutes"]').options
    expect(minutes).to.have.length.of(11)

    dpicker.model = moment('1991/06/24 11:10', format)
    expect(dpicker.valid).to.be.false
    dpicker.model = moment('1991/06/24 09:10', format)

    hours = document.querySelector('select[name="dpicker-hours"]').options
    expect(hours).to.have.length.of(11)
    expect(dpicker.valid).to.be.true
  })

  it('should find first value if minutes step (#8)', function() {
    let format = 'YYYY/MM/DD HH:mm';
    const dpicker = createDatePicker({
      time: true,
      format: format,
      step: 15,
      model: moment('1991/06/24 10:33', format),
    })

    ;[
      {time: '11:44', expect: 45},
      {time: '11:07', expect: 0},
      {time: '11:08', expect: 15},
      {time: '11:00', expect: 0},
      {time: '11:58', expect: 0},
      {time: '11:17', expect: 15},
      {time: '11:30', expect: 30},
      {time: '11:34', expect: 30},
    ].map((e) => {
      dpicker.model = moment('1991/06/24 '+e.time, format)
      expect(dpicker.model.minutes()).to.equal(e.expect);
    })
  })

  it('should find correct hours value if minutes upper last step #11', function() {
    const format = 'DD/MM/YYYY HH:mm'
    let input = document.createElement('input')
    let label = document.createElement('label')
    input.setAttribute('type', 'datetime')
    input.setAttribute('min', '24/06/1991 15:53')
    input.setAttribute('value', '24/06/1991 15:46')
    input.setAttribute('format', format)
    input.setAttribute('step', 15)
    input.setAttribute('id', 't')

    label.appendChild(input)
    label.setAttribute('for', 't')
    document.body.appendChild(label)

    const dpicker = DPicker(input)
    expect(dpicker.time).to.equal(true)
    expect(dpicker.step).to.equal(15)

    expect(dpicker.model.format(format)).to.equal('24/06/1991 16:00')

    let options = document.querySelector('select[name="dpicker-minutes"]').options
    expect(options).to.have.length.of(4)
  })

  it('should have correct time AM/PM midnight', function(cb) {
    const format = 'YYYY/MM/DD hh:mm A';
    let input = document.createElement('input')
    let label = document.createElement('label')
    input.setAttribute('type', 'datetime')
    input.setAttribute('min', '24/06/1991 15:53')
    input.setAttribute('value', '24/06/1991 15:46')
    input.setAttribute('format', format)
    input.setAttribute('step', 15)
    input.setAttribute('id', 't')

    label.appendChild(input)
    label.setAttribute('for', 't')
    document.body.appendChild(label)

    const dpicker = DPicker(input, {
      time: true,
      meridiem: true,
      format: format,
      model: moment('1991/06/24 12:00 PM', format),
    })

    let moptions = document.querySelector('select[name="dpicker-meridiem"]').options

    expect(dpicker.model.hours()).to.equal(12)
    dpicker.model = dpicker.model.hours(0)


    setTimeout(function() {
      let t = document.querySelector('select[name="dpicker-hours"]')
      expect(t.options[t.selectedIndex].innerText).to.equal('12')
      t = document.querySelector('select[name="dpicker-meridiem"]')
      expect(t.options[t.selectedIndex].innerText).to.equal('AM')
      cb()
    })

  })

  it('should fix min hour if minutes exceed the last step available', function() {
    let format = 'DD/MM/YYYY HH:mm'
    let dpicker = createDatePicker({
      format: format,
      min: moment('24/06/1991 15:53', format),
      model: moment('24/06/1991 15:54', format),
      step: 15,
      time: true
    })

    expect(dpicker.min.format(format)).to.equal('24/06/1991 16:00')
    expect(dpicker.model.format(format)).to.equal('24/06/1991 16:00')

  })

  it('should fix min hour if minutes is less then the first step available', function(cb) {
    let format = 'DD/MM/YYYY HH:mm'
    let dpicker = createDatePicker({
      format: format,
      min: moment('24/06/1991 15:10', format),
      model: moment('24/06/1991 15:10', format),
      time: true
    })

    let hours = document.querySelector('select[name="dpicker-hours"]')

    dpicker.onChange = function() {
      let minutes = document.querySelector('select[name=dpicker-minutes]')
      expect(minutes.children).to.have.length.of(60)

      dpicker.onChange = function() {
        expect(dpicker.model.minutes()).to.equal(7)

        dpicker.onChange = function() {
          expect(dpicker.model.minutes()).to.equal(10)
          cb()
        }

        hours.selectedIndex = --hours.selectedIndex
        hours.onchange({
          target: hours
        })
      }

      minutes.selectedIndex = 7
      minutes.onchange({
        target: minutes
      })
    }

    hours.selectedIndex++

    hours.onchange({
      target: hours
    })
  })

  it('should concat hours and minutes', function() {
    let label = document.createElement('label')
    let dpicker = DPicker(label, {
      time: true,
      concatHoursAndMinutes: true
    })

    document.body.appendChild(label)

    let selects = document.querySelectorAll('select')

    expect(selects).to.have.length.of(3)

    let time = selects[2]

    expect(time.name).to.equal('dpicker-time')
    expect(time.options[0].value.split(':')).to.have.length.of(2)
  })

})
