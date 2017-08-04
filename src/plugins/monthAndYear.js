const html = require('bel')

module.exports = function(DPicker) {
/**
  * Renders concated months and Years
  * @param {DPicker.events} events
  * @param {DPicker.data} data
  * @param {Array} toRender
  * @fires DPicker#monthYearChange
  *
  * @return {Element}
  */
  DPicker.renders.monthsAndYears = function rendermonthsAndYears(events, data) {
    const minMonth = DPicker.dateAdapter.getMonth(data.min)
    const minYear = DPicker.dateAdapter.getYear(data.min)

    const modelMonth = DPicker.dateAdapter.getMonth(data.model)
    const modelYear = DPicker.dateAdapter.getYear(data.model)

    const maxMonth = DPicker.dateAdapter.getMonth(data.max)
    const maxYear = DPicker.dateAdapter.getYear(data.max)

    // start with min month in year of min
    let showMonths = data.months.map(function(e, i){return {month: i, year: minYear}}).filter(obj => obj.month >= minMonth)

    // fill months of all years
    let yearsToShow = maxYear - minYear;
    for (var index = 1; index <= yearsToShow; index++) {
      showMonths = showMonths.concat(data.months.map(function(e, i){return {month: i, year: minYear + index}}))
    }

    // remove unnecessary months of max year
    showMonths = showMonths.filter(function(obj){
      if (obj.year < maxYear) {
        return true
      }
      return obj.month <= maxMonth
    })

    return html`<select onchange="${events.monthYearChange}" name="dpicker-monthYear" aria-label="Month and Year">
        ${showMonths.map((obj) => html`<option ${obj.month === modelMonth && obj.year === modelYear ? 'selected' : ''} value="${obj.month}-${obj.year}">${data.months[obj.month] + ' ' + obj.year}</option>`)}
      </select>`
  }

  /**
  * MonthYear
  * @event Dpicker#monthYearChange
  */
  DPicker.events.monthYearChange = function monthYearChange(evt) {
    let selectedMonthYear = evt.target.value.split('-')
    this.model = DPicker.dateAdapter.setMonth(this.data.model, selectedMonthYear[0])
    this.model = DPicker.dateAdapter.setYear(this.data.model, selectedMonthYear[1])
    this.redraw()
    this.onChange({modelChanged: true, name: 'monthYearChange', event: evt})
  }
}
