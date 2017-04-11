import {div} from '@cycle/dom'
import xs from 'xstream'

export function CycleDPicker (sources) {
  const Dpicker$ = xs.create({
    start: (listener) => {
      let dpicker

      const d = div('.dp', {
        hook: {
          insert: (vnode) => {
            dpicker = new DPicker(vnode.elm, sources)
            vnode.data.value = dpicker.model

            dpicker.onChange = function(data, modelChanged) {
              if (modelChanged === false) {
                return
              }

              vnode.data.value = data.model
              listener.next(vnode)
            }

            listener.next(vnode)
          }
        }
      })

      listener.next(d)
    },
    stop: () => {},
    id: 0
  })

  return {
    DOM: Dpicker$
  }
}
