const DPicker = require('./dpicker.moment.js')
require('./plugins/time.js')(DPicker)
require('./plugins/modifiers.js')(DPicker)
require('./plugins/arrow-navigation.js')(DPicker)
require('./plugins/navigation.js')(DPicker)
require('./plugins/monthAndYear.js')(DPicker)

module.exports = DPicker
