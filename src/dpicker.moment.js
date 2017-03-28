const MomentDateAdapter = require('./adapters/moment.js')
const DPicker = require('./dpicker')

DPicker.dateAdapter = MomentDateAdapter

module.exports = DPicker
