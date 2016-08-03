'use strict'
require('jsdom-global')()
const requestFrame = require('request-frame')
const Module = require('module')
const maquetteQuery = require('maquette-query')

global.screen = {}
global.requestAnimationFrame = requestFrame('request')

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

const DPicker = require('dpicker')

global.getElementByName = function getElementByName(name) {
  return DPickerProjector.query(function(vnode) {
    return vnode.properties && vnode.properties.name == name
  })
}

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
  let dpicker = new DPicker(container, opts || undefined)

  global.DPickerProjector = maquetteQuery.createTestProjector(
    dpicker.renderContainer(dpicker._events, dpicker._data, [
      dpicker.renderInput(dpicker._events, dpicker._data),
      dpicker.render(dpicker._events, dpicker._data, dpicker.getChildrenRender())
    ])
  )

  return dpicker
}
