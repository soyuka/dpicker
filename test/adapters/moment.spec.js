'use strict'
const MomentDateAdapter = require('../../src/adapters/moment.js')
const moment = require('moment')
const expect = require('chai').expect

function doTest (Adapter) {
  let adapter = Adapter

  it('should get months', () => {
    expect(adapter.months()).to.be.an('array')
    expect(adapter.months()).to.have.lengthOf(12)
  })

  it('should get weekdays', () => {
    expect(adapter.weekdays()).to.be.an('array')
    expect(adapter.weekdays()).to.have.lengthOf(7)
  })

  it('should get firstDayOfWeek', () => {
    expect(adapter.firstDayOfWeek()).to.be.a('number')
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

  it('should test getHours ', () => {
    const date = new Date(1991, 5, 24, 12)

    expect(adapter.getHours(date)).to.equal(12)
  })

  it('should test getMinutes ', () => {
    const date = new Date(1991, 5, 24, 12, 50)

    expect(adapter.getMinutes(date)).to.equal(50)
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

  it('should test setHours ', () => {
    const date = new Date(1991, 5, 24)

    expect(adapter.getHours(adapter.setHours(date, 12))).to.equal(12)
  })

  it('should test setMinutes ', () => {
    const date = new Date(1991, 5, 24)

    expect(adapter.getMinutes(adapter.setMinutes(date, 50))).to.equal(50)
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

  it('should add hours', () => {
    const date = new Date(1991, 5, 24, 10)

    expect(adapter.getHours(adapter.addHours(date, 2))).to.equal(12)
    expect(adapter.getHours(adapter.addHours(date, 1))).to.equal(11)
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

    expect(adapter.getSeconds(date)).to.equal(0)
    expect(adapter.getMilliseconds(date)).to.equal(0)
  })

  it('should reset hours from date', () => {
    const date = adapter.resetHours(new Date())

    expect(adapter.getSeconds(date)).to.equal(0)
    expect(adapter.getMilliseconds(date)).to.equal(0)
    expect(adapter.getMinutes(date)).to.equal(0)
    expect(adapter.getHours(date)).to.equal(0)
  })

  it('should get Meridiem', () => {
    const date = new Date(1991, 5, 24, 11, 20)

    expect(adapter.getMeridiem(date)).to.equal('AM')

    const date2 = new Date(1991, 5, 24, 15, 20)

    expect(adapter.getMeridiem(date2)).to.equal('PM')
  })

  it('should reset minutes from date', () => {
    const date = adapter.resetMinutes(new Date())

    expect(date.getSeconds()).to.equal(0)
    expect(date.getMilliseconds()).to.equal(0)
    expect(date.getMinutes()).to.equal(0)
  })

  it('should test isBefore', () => {
    expect(adapter.isBefore(new Date(1991, 5, 24), new Date(1991, 6, 24))).to.be.true
  })

  it('should test isAfter', () => {
    expect(adapter.isAfter(new Date(1991, 6, 24), new Date(1991, 5, 24))).to.be.true
  })

  it('should test isSameOrBefore', () => {
    expect(adapter.isSameOrBefore(new Date(1991, 5, 24), new Date(1991, 5, 24))).to.be.true
    expect(adapter.isSameOrBefore(new Date(1991, 4, 24), new Date(1991, 5, 24))).to.be.true
  })

  it('should test isSameOrAfter', () => {
    expect(adapter.isSameOrAfter(new Date(1991, 5, 24), new Date(1991, 5, 24))).to.be.true
    expect(adapter.isSameOrAfter(new Date(1991, 6, 24), new Date(1991, 5, 24))).to.be.true
  })

  it('should test isSameDay', () => {
    expect(adapter.isSameDay(new Date(1991, 5, 24, 22, 1), new Date(1991, 5, 24, 12, 1))).to.be.true
    expect(adapter.isSameDay(new Date(1991, 3, 24, 22, 1), new Date(1991, 5, 24, 12, 1))).to.be.false
    expect(adapter.isSameDay(new Date(1991, 5, 22, 22, 1), new Date(1991, 5, 24, 12, 1))).to.be.false
  })

  it('should test isSameHours', () => {
    expect(adapter.isSameHours(new Date(1991, 5, 24, 22, 1), new Date(1991, 5, 24, 22, 1))).to.be.true
    expect(adapter.isSameHours(new Date(1991, 3, 24, 22, 1), new Date(1991, 5, 24, 22, 1))).to.be.false
    expect(adapter.isSameHours(new Date(1991, 5, 22, 22, 1), new Date(1991, 5, 24, 22, 1))).to.be.false
  })

  it('should test isSameMonth', () => {
    expect(adapter.isSameMonth(new Date(1991, 5, 21, 22, 1), new Date(1991, 5, 24, 22, 1))).to.be.true
    expect(adapter.isSameMonth(new Date(1991, 3, 24, 22, 1), new Date(1991, 5, 24, 22, 1))).to.be.false
    expect(adapter.isSameMonth(new Date(1990, 5, 22, 22, 1), new Date(1991, 5, 24, 22, 1))).to.be.false
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
