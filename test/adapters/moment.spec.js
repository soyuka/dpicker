const MomentDateAdapter = require('../../src/adapters/moment.js')
const moment = require('moment')
const expect = require('chai').expect

function doTest (Adapter) {
  let adapter = Adapter

  it('should get months', () => {
    expect(adapter.months()).to.be.an.array
    expect(adapter.months()).to.have.length.of(12)
  })

  it('should get weekdays', () => {
    expect(adapter.weekdays()).to.be.an.array
    expect(adapter.weekdays()).to.have.length.of(7)
  })

  it('should get firstDayOfWeek', () => {
    expect(adapter.firstDayOfWeek()).to.be.a.number
  })

  it('should check isValid', () => {
    const valid = new Date()
    expect(adapter.isValid(valid)).to.be.true
    const invalid = 'Invalid Date'
    expect(adapter.isValid(invalid)).to.be.false
  })

  it('should check isValid', () => {
    const valid = new Date()
    expect(adapter.isValid(valid)).to.be.true
    const invalid = 'Invalid Date'
    expect(adapter.isValid(invalid)).to.be.false
  })

  it('should check isValidWithFormat', () => {
    const t = adapter.isValidWithFormat('24/06/1991', 'DD/MM/YYYY')
    expect(t).not.to.be.false
    expect(t).to.be.an.instanceof(Date)
    expect(adapter.isValidWithFormat('Invalid', 'DD/MM/YYYY')).to.be.false
    expect(adapter.isValidWithFormat('60/65/10', 'DD/MM/YYYY')).to.be.false
  })

  it('should test getDate ', () => {
    const date = new Date(1991, 5, 24)

    expect(adapter.getDate(date)).to.equal(24)
  })

  it('should test getMonth ', () => {
    const date = new Date(1991, 5, 24)

    expect(adapter.getMonth(date)).to.equal(5)
  })

  it('should test getYear ', () => {
    const date = new Date(1991, 5, 24)

    expect(adapter.getYear(date)).to.equal(1991)
  })

  it('should test setDate ', () => {
    const date = new Date(1991, 5, 24)

    expect(adapter.getDate(adapter.setDate(date, 25))).to.equal(25)
  })

  it('should test setMonth ', () => {
    const date = new Date(1991, 5, 24)

    expect(adapter.getMonth(adapter.setMonth(date, 6))).to.equal(6)
  })

  it('should test setYear ', () => {
    const date = new Date(1991, 5, 24)

    expect(adapter.getYear(adapter.setYear(date, 1992))).to.equal(1992)
  })

  it('should add days', () => {
    const date = new Date(1991, 5, 24)

    expect(adapter.getDate(adapter.addDays(date, 1))).to.equal(25)

    const newDate = adapter.addDays(date, 8)

    expect(adapter.getDate(newDate)).to.equal(2)
    expect(adapter.getMonth(newDate)).to.equal(6)
  })

  it('should add months', () => {
    const date = new Date(1991, 5, 24)

    expect(adapter.getMonth(adapter.addMonths(date, 1))).to.equal(6)
    expect(adapter.getMonth(adapter.addMonths(date, 2))).to.equal(7)
  })

  it('should add years', () => {
    const date = new Date(1991, 5, 24)

    expect(adapter.getYear(adapter.addYears(date, 1))).to.equal(1992)
    expect(adapter.getYear(adapter.addYears(date, 2))).to.equal(1993)
  })

  it('should sub days', () => {
    const date = new Date(1991, 5, 24)

    expect(adapter.getDate(adapter.subDays(date, 2))).to.equal(22)

    const newDate = adapter.subDays(date, 30)

    expect(adapter.getDate(newDate)).to.equal(25)
    expect(adapter.getMonth(newDate)).to.equal(4)
  })

  it('should sub months', () => {
    const date = new Date(1991, 5, 24)

    expect(adapter.getMonth(adapter.subMonths(date, 1))).to.equal(4)

    const newDate = adapter.subMonths(date, 6)
    expect(adapter.getMonth(newDate)).to.equal(11)
    expect(adapter.getYear(newDate)).to.equal(1990)
  })

  it('should parse', () => {
    const date = adapter.parse('24/06/1991', 'DD/MM/YYYY')

    expect(adapter.getDate(date)).to.equal(24)
    expect(adapter.getMonth(date)).to.equal(5)
    expect(adapter.getYear(date)).to.equal(1991)
  })

  it('should format', () => {
    const date = new Date(1991, 5, 24)

    expect(adapter.format(date, 'DD/MM/YYYY')).to.equal('24/06/1991')
  })

  it('should get days in month', () => {
    const date = new Date(1991, 5, 24)

    expect(adapter.daysInMonth(date)).to.equal(30)

    const bi = new Date(1989, 1, 10)

    expect(adapter.daysInMonth(bi)).to.equal(28)
  })

  it('should get the day of the week of the first day in the month', () => {
    const date = new Date(1991, 5, 24)

    expect(adapter.firstWeekDay(date)).to.equal(6)
  })

  it('should reset seconds from date', () => {
    const date = adapter.resetSeconds(new Date())

    expect(date.getSeconds()).to.equal(0)
    expect(date.getMilliseconds()).to.equal(0)
  })

  it('should reset hours from date', () => {
    const date = adapter.resetHours(new Date())

    expect(date.getSeconds()).to.equal(0)
    expect(date.getMilliseconds()).to.equal(0)
    expect(date.getMinutes()).to.equal(0)
    expect(date.getHours()).to.equal(0)
  })

  it('should reset minutes from date', () => {
    const date = adapter.resetMinutes(new Date())

    expect(date.getSeconds()).to.equal(0)
    expect(date.getMilliseconds()).to.equal(0)
    expect(date.getMinutes()).to.equal(0)
  })
}

describe('MomentDateAdapter.specific', function () {
  let adapter = MomentDateAdapter

  it('should get an immutable moment instance', () => {
    expect(adapter._getMoment(new Date())).to.be.an.instanceof(moment)
    const t = moment()
    expect(t).to.equal(t)
    expect(adapter._getMoment(t)).to.be.an.instanceof(moment)
    expect(adapter._getMoment(t)).not.to.be.equal(t)
  })

  doTest(MomentDateAdapter)
})
