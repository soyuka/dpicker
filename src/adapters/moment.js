const moment = require('moment')

const DAY_TOKEN = 'd'
const YEAR_TOKEN = 'y'
const MONTH_TOKEN = 'M'
const HOURS_TOKEN = 'h'

/**
 * Get an immutable moment date
 * @internal
 * @param  {String} date
 * @param  {Boolean} immutable
 * @return {Moment}
 */
function _getMoment (date, immutable = true) {
  if (moment.isMoment(date)) {
    return immutable === true ? date.clone() : date
  }

  if (date instanceof Date) {
    return moment(date)
  }

  return null
}

/**
* Get months, an array of string
* @return {Array.<String>} List of the available months
*/
function months () {
  return moment.months()
}

function weekdays () {
  return moment.weekdaysShort()
}

function firstDayOfWeek () {
  return moment.localeData().firstDayOfWeek()
}

function isValid (date) {
  date = _getMoment(date, false)
  return date instanceof moment && date.isValid()
}

/**
 * @param {String} dateString
 * @param {String} format
 * @return {Date|Boolean} false if invalid or the parsed date, parsing is heaving let's do this only once
 */
function isValidWithFormat (dateString, format) {
  const testDate = moment(dateString, format, true)
  if (this.isValid(testDate) === true) {
    return testDate.toDate()
  }

  return false
}

/**
 * Get year
 * @param {Date} date
 * @return {Number}
 */
function getYear (date) {
  return _getMoment(date, false).year()
}

/**
 * Get Month
 * @param {Date} date
 * @return {Number}
 */
function getMonth (date) {
  return _getMoment(date, false).month()
}

/**
 * Get Date
 * @param {Date} date
 * @return {Number}
 */
function getDate (date) {
  return _getMoment(date, false).date()
}

/**
 * Get Hours
 * @param {Date} date
 * @return {Number}
 */
function getHours (date) {
  return _getMoment(date, false).hours()
}

/**
 * Get Minutes
 * @param {Date} date
 * @return {Number}
 */
function getMinutes (date) {
  return _getMoment(date, false).minutes()
}

/**
 * Set Date
 * @param {Date} date
 * @param {Number} day
 * @return {Date}
 */
function setDate (date, day) {
  return _getMoment(date).date(day).toDate()
}

function setMinutes (date, minutes) {
  return _getMoment(date).minutes(minutes).toDate()
}

function setHours (date, hours) {
  return _getMoment(date).hours(hours).toDate()
}

/**
 * Set Month
 * @param {Date} date
 * @param {Number} month
 * @return {Date}
 */
function setMonth (date, month) {
  return _getMoment(date).month(month).toDate()
}

/**
 * Set Year
 * @param {Date} date
 * @param {Number} year
 * @return {Date}
 */
function setYear (date, year) {
  return _getMoment(date).year(year).toDate()
}

/**
 * Add Days
 * @param {Date} date
 * @param {Number} num days to add
 * @return {Date}
 */
function addDays (date, num) {
  return _getMoment(date).add(num, DAY_TOKEN).toDate()
}

/**
 * Add Months
 * @param {Date} date
 * @param {Number} num months to add
 * @return {Date}
 */
function addMonths (date, num) {
  return _getMoment(date).add(num, MONTH_TOKEN).toDate()
}

/**
 * Add Years
 * @param {Date} date
 * @param {Number} num years to add
 * @return {Date}
 */
function addYears (date, year) {
  return _getMoment(date).add(year, YEAR_TOKEN).toDate()
}

/**
 * Add Hours
 * @param {Date} date
 * @param {Number} num hours to add
 * @return {Date}
 */
function addHours (date, hours) {
  return _getMoment(date).add(hours, HOURS_TOKEN).toDate()
}

/**
 * Subtract days
 * @param {Date} date
 * @param {Number} num days to subtract
 * @return {Date}
 */
function subDays (date, num) {
  return _getMoment(date).subtract(num, DAY_TOKEN).toDate()
}

/**
 * Subtract months
 * @param {Date} date
 * @param {Number} num months to subtract
 * @return {Date}
 */
function subMonths (date, num) {
  return _getMoment(date).subtract(num, MONTH_TOKEN).toDate()
}

/**
 * Parses a string and return a Date
 * @param {String} dateString
 * @param {String} format
 * @return {Date}
 */
function parse (dateString, format) {
  return moment(dateString, format).toDate()
}

/**
 * Format a Date and return a string
 * @param {Date} date
 * @param {String} format
 * @return {String}
 */
function format (date, format) {
  return _getMoment(date, false).format(format)
}

/**
 * Get the number of days in the current date month
 * @param {Date} date
 * @return {Number}
 */
function daysInMonth (date) {
  return _getMoment(date, false).daysInMonth()
}

/**
 * Get number of the day in the week (from 0 to 6) for the given month on the first day
 * @param {Date} date
 * @returns {Number}
 */
function firstWeekDay (date) {
  return +_getMoment(date).date(1).format('e')
}

/**
 * Reset a date seconds
 * @param {Date} date
 * @returns {Date}
 */
function resetSeconds (date) {
  return _getMoment(date).seconds(0).milliseconds(0).toDate()
}

/**
 * Reset a date minutes
 * @param {Date} date
 * @returns {Date}
 */
function resetMinutes (date) {
  return _getMoment(this.resetSeconds(date)).minutes(0).toDate()
}

/**
 * Reset a date hours
 * @param {Date} date
 * @returns {Date}
 */
function resetHours (date) {
  return _getMoment(this.resetMinutes(date)).hours(0).toDate()
}

/**
 * isBefore
 * @param {Date} date
 * @param {Date} comparison
 * @return {Boolean}
 */
function isBefore (date, comparison) {
  return _getMoment(date, false).isBefore(comparison)
}

/**
 * isAfter
 * @param {Date} date
 * @param {Date} comparison
 * @return {Boolean}
 */
function isAfter (date, comparison) {
  return _getMoment(date, false).isAfter(comparison)
}

/**
 * isSameOrAfter (comparison must be done on a DAY basis)
 * @param {Date} date
 * @param {Date} comparison
 * @return {Boolean}
 */
function isSameOrAfter (date, comparison) {
  return _getMoment(date, false).isSameOrAfter(comparison, DAY_TOKEN)
}

/**
 * isSameOrBefore (comparison must be done on a DAY basis)
 * @param {Date} date
 * @param {Date} comparison
 * @return {Boolean}
 */
function isSameOrBefore (date, comparison) {
  return _getMoment(date, false).isSameOrBefore(comparison, DAY_TOKEN)
}

/**
 * isSameDay
 * @param {Date} date
 * @param {Date} comparison
 * @return {Boolean}
 */
function isSameDay (date, comparison) {
  return _getMoment(date, false).isSame(comparison, DAY_TOKEN)
}

/**
 * isSameHours
 * @param {Date} date
 * @param {Date} comparison
 * @return {Boolean}
 */
function isSameHours (date, comparison) {
  return _getMoment(date, false).isSame(comparison, HOURS_TOKEN)
}

/**
 * An uppercased meridiem (AM or PM)
 * @param {Date} date
 * @return {String}
 */
function getMeridiem (date) {
  return _getMoment(date, false).format('A')
}

module.exports = {
  _getMoment: _getMoment,
  months: months,
  weekdays: weekdays,
  firstDayOfWeek: firstDayOfWeek,
  isValid: isValid,
  isValidWithFormat: isValidWithFormat,
  getYear: getYear,
  getHours: getHours,
  getMonth: getMonth,
  getDate: getDate,
  getMinutes: getMinutes,
  setDate: setDate,
  setMinutes: setMinutes,
  setHours: setHours,
  setMonth: setMonth,
  setYear: setYear,
  addDays: addDays,
  addMonths: addMonths,
  addYears: addYears,
  addHours: addHours,
  subDays: subDays,
  subMonths: subMonths,
  parse: parse,
  format: format,
  daysInMonth: daysInMonth,
  firstWeekDay: firstWeekDay,
  resetSeconds: resetSeconds,
  resetMinutes: resetMinutes,
  resetHours: resetHours,
  isBefore: isBefore,
  isAfter: isAfter,
  isSameOrAfter: isSameOrAfter,
  isSameOrBefore: isSameOrBefore,
  isSameDay: isSameDay,
  isSameHours: isSameHours,
  getMeridiem: getMeridiem,
}
