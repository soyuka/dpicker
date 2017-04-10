import {div, input, h2, label, pre, code, makeDOMDriver} from '@cycle/dom'
import xs from 'xstream'

export function CycleDPicker (sources) {
  let init = false
  let dpicker

  function deferCreate(element, listener) {
      if (init === false) {
        sources.time = true
        dpicker = new DPicker(element.elm, sources)
      }

      dpicker.onChange = function(data, modelChanged) {
        if (modelChanged === false) {
          return
        }

        element.data = { value: data.model }

        listener.next(element)
      }

      init = true
  }

  const d = input('.dp')

  const Dpicker$ = xs.create({
    start: (listener) => {
      if (init === false) {
        setTimeout(() => deferCreate(d, listener), 100)
      }

      listener.next(d)
    },
    stop: () => {

    },
    id: 0
  })

  return {
    DOM: Dpicker$
  }
}
