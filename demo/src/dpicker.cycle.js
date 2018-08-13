import {div} from '@cycle/dom'
import xs from 'xstream'
import DPicker from '../../../dist/dpicker.all.js'

export function CycleDPicker (selector, sources) {

  const value$ = sources.DOM.select(selector)
    .events('dpicker:change')
    .map((ev) => {
      return ev.detail
    })

  const state$ = sources.props
    .map((props) => {
      return value$
      .startWith(props)
    })
    .flatten()
    .remember()

  const vdom$ = state$.map((state) => {
    return div(selector, {
      hook: {
        insert: (vnode) => {
          const dpicker = new DPicker(vnode.elm, state)
          dpicker.onChange = function(data, modelChanged) {
            if (modelChanged === false) {
              return
            }

            const evt = new CustomEvent('dpicker:change', {bubbles: true, detail: dpicker.data})
            vnode.elm.dispatchEvent(evt)
          }
        }
      }
    })
  })

  return {
    DOM: vdom$,
    state: state$
  }
}
