'use strict'
require('jsdom-global')()
const Module = require('module')

global.screen = {}

const realResolve = Module._resolveFilename
const map = {
  'dpicker': '../dist/dpicker.js',
  'dpicker.arrow-navigation': '../dist/dpicker.arrow-navigation.js',
  'dpicker.modifiers': '../dist/dpicker.modifiers.js',
  'dpicker.time': '../dist/dpicker.time.js',
}

Module._resolveFilename = function(request, parent) {

  if (request in map) {
    return realResolve(require.resolve(map[request]), parent)
  }

  return realResolve(request, parent)
}

global.DPicker = require('dpicker')
global.moment = require('moment')

let container

global.createDatePicker = function createDatePicker(opts) {
  if (container) {
    try {
      document.body.removeChild(container)
    } catch(e) {}
  }

  container = document.createElement('div')
  container.setAttribute('id', 'dpicker')
  document.body.appendChild(container)
  return new DPicker(container, opts || undefined)
}
