const MomentDateAdapter = require('./adapters/moment.js')
const DPicker = require('./dpicker')

DPicker._dateAdapter = MomentDateAdapter

module.exports = DPicker
