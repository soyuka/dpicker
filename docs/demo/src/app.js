import {div, input, h2, label, pre, code, p, kbd} from '@cycle/dom'
import xs from 'xstream'
import DPicker from '../../../dist/dpicker.all.js'
import {CycleDPicker} from './dpicker.cycle'
import './style.scss'

const inputText = document.getElementById('input')
const container = document.getElementById('dpicker')

const DEFAULT_FORMAT = 'LL LTS'
const DEFAULT_ORDER = ['previousMonth', 'months', 'years', 'nextMonth', 'days', 'time']
const dpicker = new DPicker(container, {hideOnOutsideClick: false, hideOnDayClick: false, hideOnEnter: false, siblingMonthDayClick: false, order: DEFAULT_ORDER})

export function App (sources) {
  let valid = dpicker.valid
  let empty = dpicker.empty

  const min = CycleDPicker('.cycle-dpicker-min', {
    DOM: sources.DOM,
    props: xs.of({name: 'min', model: dpicker.min, format: DEFAULT_FORMAT, order: DEFAULT_ORDER})
  })

  const minVDom$ = min.DOM
  const minState$ = min.state.map((e) => e.model)

  const max = CycleDPicker('.cycle-dpicker-max', {
    DOM: sources.DOM,
    props: xs.of({name: 'max', model: dpicker.max, max: DPicker.dateAdapter.addYears(dpicker.max, 1), format: DEFAULT_FORMAT, order: DEFAULT_ORDER})
  })

  const maxVDom$ = max.DOM
  const maxState$ = max.state.map((e) => e.model)

  const validDpicker$ = xs.create({
    start: (listener) => {
      dpicker.onChange = function(d, event) {
        if (valid !== d.valid || empty !== d.empty) {
          listener.next(d)
          valid = d
          empty = d
        } else if (event.modelChanged) {
          listener.next(d)
        }
      }
    },
    stop: () => {},
    id: 0
  })

  const form = [
    {
      key: 'display',
      default: true,
      label: 'Show'
    },
    {
      key: 'time',
      default: true,
      label: 'Time'
    },
    {
      key: 'concatHoursAndMinutes',
      default: true,
      label: 'Concat hours and minutes'
    },
    {
      key: 'siblingMonthDayClick',
      default: false,
      label: 'Sibling months day'
    },
    {
      key: 'step',
      default: 15,
      min: 1,
      max: 60,
      label: (value) =>`Step (${value})`
    },
    {
      key: 'meridiem',
      default: true,
      label: 'Meridiem'
    },
    {
      key: 'format',
      default: DEFAULT_FORMAT,
      label: 'Format'
    },
    {
      key: 'valid',
      default: true,
      label: 'Valid',
      readonly: true
    }
  ]

  const formLength = form.length

  const form$ = form.map((e) => {
    e.value = e.default

    return sources.DOM.select(`input[name="${e.key}"]`)
    .events('change')
    .map(event => {
      switch(typeof e.default) {
        case 'boolean':
          e.value = event.target.checked
          break;
        default:
          e.value = event.target.value
          break;
      }

      return e
    })
    .startWith(e)
  })

  form$.push(validDpicker$.startWith(dpicker.data), minVDom$, minState$, maxVDom$, maxState$)

  const vdom$ = xs.combine.apply(null, form$)
  .map((configArray) => {

    for (let i = 0; i < formLength; i++) {
      const param = configArray[i]

      if (param.readonly) {
        continue
      }

      if (param.key === 'siblingMonthDayClick' && dpicker.data.siblingMonthDayClick !== param.value) {
        dpicker.data[param.key] = param.value
        dpicker.redraw()
        continue
      }

      if (dpicker[param.key] !== param.value) {
        dpicker[param.key] = param.value
      }
    }

    const minVDom = configArray[formLength + 1]
    const minValue = configArray[formLength + 2]

    const maxVDom = configArray[formLength + 3]
    const maxValue = configArray[formLength + 4]

    if (minValue && dpicker.min !== minValue) {
      dpicker.min = minValue
    }

    if (maxValue && dpicker.max !== maxValue) {
      dpicker.max = maxValue
    }

    return {config: dpicker.data, minVDom: minVDom, maxVDom: maxVDom}
  })
  .map(({config, minVDom, maxVDom}) => {

    inputText.textContent = dpicker.input

    const childNodes = []
    const booleanNodes = []
    const otherNodes = []

    for (let i = 0; i < formLength; i++) {
      const formItem = form[i]
      const value = config[formItem.key]
      const labelValue = typeof formItem.label === 'function' ? formItem.label(value) : formItem.label
      const readonly = formItem.readonly === undefined ? false : formItem.readonly

      let attrs

      switch(typeof formItem.default) {
        case 'boolean':
          booleanNodes.push(label('.checkbox-inline', [input({attrs: {name: formItem.key, checked: value, type: 'checkbox', readonly: readonly, disabled: readonly, id: formItem.key}}), labelValue]))
          continue
        case 'number':
          attrs = {name: formItem.key, value: value, type: 'range', min: formItem.min, max: formItem.max, id: formItem.key}
          break
        case 'string':
          attrs = {name: formItem.key, value: value, type: 'text', id: formItem.key}
          break
      }

      otherNodes.push(
        div('.col-md-6', [
          label({attrs: {for: formItem.key}}, labelValue), input('.form-control', {attrs: attrs})
        ])
      )
    }

    const data = {}

    Object.keys(dpicker.data).filter((e) => !~['months', 'days', 'order', 'inputName', 'inputId'].indexOf(e)).forEach((e) => {
      data[e] = dpicker.data[e]
    })

    childNodes.push(
      div('.row.form-group', div('.col-md-12', booleanNodes)),
      div('.row.form-group', otherNodes),
      div('.row.form-group', [
        div('.col-md-6', [
          label({attrs: {for: 'min'}}, 'Minimum'),
          minVDom
        ]),
        div('.col-md-6', [
          label({attrs: {for: 'max'}}, 'Maximum'),
          maxVDom
        ]),
      ]),
      div('.row.form-group', [
        div('.col-md-12', [
          p('.alert.alert-warning', [
            'Type ',
            kbd('+'),
            ' to jump to today\'s date. ',
            kbd('+100'),
            ' will return today + 100 days. ',
            kbd('-100'),
            ' does the opposite'
          ])
        ])
      ]),
      h2('Configuration: '),
      div('.row', div('.col-md-12', [
        pre(code(JSON.stringify(data, null, 2))),
      ]))
    )

    return div('.row', div('.col-md-12', childNodes))
  })

  return {
    DOM: vdom$
  };
}
