'use strict'
const moment = require('moment')
const expect = require('chai').expect
const DPicker = require('../../dist/dpicker.js')

describe('dpicker.time', function() {
  require('../../dist/dpicker.time.js')(DPicker)

  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('should change hours (24h format)', function(cb) {
    const dpicker = createDatePicker({
      onChange: (data) => {
        expect(select.options[selectedIndex].selected).to.be.true

        let input = document.querySelector('input[name=dpicker-input]')
        expect(''+moment(dpicker.model).hours()).to.equal(select.options[selectedIndex].value)
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
        expect(''+moment(dpicker.model).minutes()).to.equal(select.options[selectedIndex].value)
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

    expect(moment(dpicker.model).hours()).to.equal(15)

    dpicker.onChange = (data) => {
      expect(moment(data.model).hours()).to.equal(3)
    }

    meridiem.selectedIndex = 0 //AM
    meridiem.onchange({target: meridiem})

    let select = document.querySelector('select[name="dpicker-hours"]')

    dpicker.onChange = (data) => {
      expect(moment(data.model).hours()).to.equal(0)
    }

    select.selectedIndex = 11 //12
    select.onchange({
      target: select
    })

    dpicker.onChange = (data) => {
      expect(moment(data.model).hours()).to.equal(12)
    }

    meridiem.selectedIndex = 1 //PM
    meridiem.onchange({target: meridiem})

    dpicker.onChange = (data) => {
      expect(moment(data.model).hours()).to.equal(23)
    }

    select.selectedIndex = 10 //11
    select.onchange({target: select})

    dpicker.onChange = (data) => {
      expect(moment(data.model).hours()).to.equal(12)
    }

    select.selectedIndex = 11 //12
    select.onchange({target: select})

    dpicker.onChange = (data) => {
      expect(moment(data.model).hours()).to.equal(0)
    }

    meridiem.selectedIndex = 0 //AM
    meridiem.onchange({target: meridiem})

    dpicker.onChange = (data) => {
      expect(moment(data.model).hours()).to.equal(12)
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

    const dpicker = DPicker(input, {display: true})
    expect(dpicker.time).to.equal(true)

    input = document.getElementById('t')
    expect(input.getAttribute('type')).to.equal('text')

    let options = document.querySelector('select[name="dpicker-hours"]').options
    expect(options).to.have.lengthOf(24)
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

    const dpicker = DPicker(input, {display: true})
    expect(dpicker.time).to.equal(true)

    input = document.getElementById('t')
    expect(input.getAttribute('type')).to.equal('text')

    let options = document.querySelector('select[name="dpicker-hours"]').options
    expect(options).to.have.lengthOf(12)
  })

  it('should have minutes step of 5', function() {
    const dpicker = createDatePicker({
      time: true,
      step: 5
    })

    let options = document.querySelector('select[name="dpicker-minutes"]').options

    expect(options).to.have.lengthOf(12)
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

    expect(minutes).to.have.lengthOf(50)

    let hours = document.querySelector('select[name="dpicker-hours"]').options

    expect(hours).to.have.lengthOf(9)
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

    expect(minutes).to.have.lengthOf(50)

    let hours = document.querySelector('select[name="dpicker-hours"]').options

    expect(hours).to.have.lengthOf(3)
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
    expect(hours).to.have.lengthOf(14)

    dpicker.model = moment('1991/06/24 09:10', format)
    expect(dpicker.valid).to.be.false
    dpicker.model = moment('1991/06/24 11:10', format)
    expect(dpicker.valid).to.be.true

    hours = document.querySelector('select[name="dpicker-hours"]').options
    expect(hours).to.have.lengthOf(14)
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
    expect(hours).to.have.lengthOf(11)
    let minutes = document.querySelector('select[name="dpicker-minutes"]').options
    expect(minutes).to.have.lengthOf(11)

    dpicker.model = moment('1991/06/24 11:10', format)
    expect(dpicker.valid).to.be.false
    dpicker.model = moment('1991/06/24 09:10', format)

    hours = document.querySelector('select[name="dpicker-hours"]').options
    expect(hours).to.have.lengthOf(11)
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
      expect(moment(dpicker.model).minutes()).to.equal(e.expect);
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
    input.setAttribute('step', '15')
    input.setAttribute('id', 't')

    label.appendChild(input)
    label.setAttribute('for', 't')
    document.body.appendChild(label)

    const dpicker = DPicker(input, {display: true})
    expect(dpicker.time).to.equal(true)
    expect(dpicker.step).to.equal(15)

    expect(moment(dpicker.model).format(format)).to.equal('24/06/1991 16:00')

    let options = [].slice.call(document.querySelector('select[name="dpicker-hours"]').options).map((e) => parseInt(e.textContent))
    expect(options).to.have.lengthOf(8)
    expect(options).to.deep.equal([16, 17, 18, 19, 20, 21, 22, 23])

    options = [].slice.call(document.querySelector('select[name="dpicker-minutes"]').options).map((e) => parseInt(e.textContent))
    expect(options).to.deep.equal([0, 15, 30, 45])
  })

  it('should have correct minutes value with step of 30', function(cb) {
    const format = 'DD/MM/YYYY HH:mm'
    let input = document.createElement('input')
    let label = document.createElement('label')
    input.setAttribute('type', 'datetime')
    input.setAttribute('min', '24/06/1991 09:29')
    input.setAttribute('value', '24/06/1991 09:30')
    input.setAttribute('format', format)
    input.setAttribute('step', '30')

    label.appendChild(input)
    document.body.appendChild(label)

    const dpicker = DPicker(input, {display: true})

    dpicker.onChange = function() {
      let options = [].slice.call(document.querySelector('select[name="dpicker-minutes"]').options).map((e) => parseInt(e.textContent))
      expect(options).to.deep.equal([0, 30])
      cb()
    }

    expect(dpicker.time).to.equal(true)
    expect(dpicker.step).to.equal(30)

    let options = [].slice.call(document.querySelector('select[name="dpicker-minutes"]').options).map((e) => parseInt(e.textContent))
    expect(options).to.deep.equal([30])

    let select = document.querySelector('select[name="dpicker-hours"]')
    select.selectedIndex = select.selectedIndex + 1

    select.onchange({target: select})

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
      display: true
    })

    let moptions = document.querySelector('select[name="dpicker-meridiem"]').options

    expect(moment(dpicker.model).hours()).to.equal(12)
    dpicker.model = moment(dpicker.model).hours(0)


    setTimeout(function() {
      let t = document.querySelector('select[name="dpicker-hours"]')
      expect(t.options[t.selectedIndex].textContent.trim()).to.equal('12')
      t = document.querySelector('select[name="dpicker-meridiem"]')
      expect(t.options[t.selectedIndex].textContent.trim()).to.equal('AM')
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

    expect(moment(dpicker.min).format(format)).to.equal('24/06/1991 15:53')
    expect(moment(dpicker.model).format(format)).to.equal('24/06/1991 16:00')

  })

  it.skip('should fix min hour if minutes is less then the first step available', function(cb) {
    let format = 'DD/MM/YYYY HH:mm'
    let dpicker = createDatePicker({
      format: format,
      min: moment('24/06/1991 15:10', format),
      model: moment('24/06/1991 15:10', format),
      time: true
    })

    let hours = document.querySelector('select[name="dpicker-hours"]')

    dpicker.onChange = function(data, event) {
      let minutes = document.querySelector('select[name=dpicker-minutes]')
      expect(minutes.children).to.have.lengthOf(60)

      dpicker.onChange = function() {
        expect(moment(dpicker.model).minutes()).to.equal(7)

        dpicker.onChange = function() {
          expect(moment(dpicker.model).minutes()).to.equal(10)
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

    hours.selectedIndex = 1

    hours.onchange({
      target: hours
    })
  })

  it('should concat hours and minutes', function() {
    let label = document.createElement('label')
    let dpicker = DPicker(label, {
      time: true,
      concatHoursAndMinutes: true,
      display: true
    })

    document.body.appendChild(label)

    let selects = document.querySelectorAll('select')

    expect(selects).to.have.lengthOf(3)

    let time = selects[2]

    expect(time.name).to.equal('dpicker-time')
    expect(time.options[0].value.split(':')).to.have.lengthOf(2)
  })

  it('should have correct time step when 59:59', function() {
    let format = 'DD/MM/YYYY hh:mm:ss'
    const dpicker = createDatePicker({
      time: true,
      meridiem: false,
      format: format,
      concatHoursAndMinutes: true,
      step: 15,
      model: moment('24/06/1991 13:00:00', format),
      min: moment('24/06/1991 14:59:59', format),
    })

    let options = document.querySelectorAll('select[name="dpicker-time"] option')
    expect([].slice.call(options)).to.have.lengthOf(36)
  })

  it('should have correct values when concatHoursAndMinutes and step', function() {
    let format = 'DD/MM/YYYY hh:mm:ss'
    const dpicker = createDatePicker({
      time: true,
      meridiem: false,
      format: format,
      concatHoursAndMinutes: true,
      step: 30,
      model: moment('24/06/1991 10:30:00', format),
      min: moment('24/06/1991 09:29:59', format),
      max: moment('24/06/1991 12:32:00', format),
    })

    let options = [].slice.call(document.querySelectorAll('select[name="dpicker-time"] option')).map((e) => e.textContent)
    expect(options).to.deep.equal(['09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30'])
  })

  it('should have correct values when concatHoursAndMinutes and step (same hour)', function() {
    let format = 'DD/MM/YYYY hh:mm:ss'
    const dpicker = createDatePicker({
      time: true,
      meridiem: false,
      format: format,
      concatHoursAndMinutes: true,
      step: 30,
      model: moment('24/06/1991 09:30:00', format),
      min: moment('24/06/1991 09:29:59', format),
      max: moment('24/06/1991 11:30:00', format),
    })

    let options = [].slice.call(document.querySelectorAll('select[name="dpicker-time"] option')).map((e) => e.textContent)
    expect(options).to.deep.equal(['09:30', '10:00', '10:30', '11:00', '11:30'])
  })

  it('should have correct values when concatHoursAndMinutes and step (change min)', function() {
    let format = 'DD/MM/YYYY hh:mm:ss'
    const dpicker = createDatePicker({
      time: true,
      meridiem: false,
      format: format,
      concatHoursAndMinutes: true,
      step: 30,
      model: moment('15/05/2017 11:00:00', format),
      min: moment('15/05/2017 11:00:00', format),
      max: moment('11/07/2017 11:30:00', format),
    })

    let options = [].slice.call(document.querySelectorAll('select[name="dpicker-time"] option')).map((e) => e.textContent)
    expect(options[0]).to.equal('11:00')
    expect(options[1]).to.equal('11:30')
    expect(options[options.length - 1]).to.equal('23:30')

    dpicker.min = moment('15/05/2017 11:30:00', format).toDate()
    dpicker.redraw()

    options = [].slice.call(document.querySelectorAll('select[name="dpicker-time"] option')).map((e) => e.textContent)
    expect(options[0]).to.equal('11:30')

    dpicker.model = moment('16/05/2017 11:30:00', format).toDate()

    options = [].slice.call(document.querySelectorAll('select[name="dpicker-time"] option')).map((e) => e.textContent)

    expect(!!~options.indexOf('11:00')).to.be.true
  })
})
