const DPicker = require('./src/all.js')
const html = require('bel')

function test(DPicker) {
  DPicker.renders.test = function() {
    return html`<div></div>`
  }
}

test(DPicker)

module.exports = DPicker
