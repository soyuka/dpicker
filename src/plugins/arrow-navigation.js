const DPicker = require('../dpicker.js')

/**
 * Get element position in parent
 * @param {Element} children
 * @return {Number}
 * @private
 */
function positionInParent (children) {
  return [].indexOf.call(children.parentNode.children, children)
}

/**
 * Move left
 * @param {Element} td
 * @param {Element} table
 * @private
 */
function left (td, table) {
  // previous td
  let previous = td.previousElementSibling

  if (previous && previous.querySelector('button')) {
    previous.querySelector('button').focus()
    return
  }

  // previous row, last button
  previous = td.parentNode.previousElementSibling
  previous = previous ? previous.querySelector('td:last-child button') : null

  if (previous) {
    return previous.focus()
  }

  // last tr first td
  let last = table.querySelector('tr:last-child').querySelectorAll('td.dpicker-active')
  last[last.length - 1].querySelector('button').focus()
}

/**
 * Move right
 * @param {Element} td
 * @param {Element} table
 * @private
 */
function right (td, table) {
  let next = td.nextElementSibling

  if (next && next.querySelector('button')) {
    next.querySelector('button').focus()
    return
  }

  next = td.parentNode.nextElementSibling
  next = next ? next.querySelector('td:first-child button') : null

  if (next) {
    return next.focus()
  }

  table.querySelector('tr:first-child').nextElementSibling.querySelectorAll('td.dpicker-active')[0].querySelector('button').focus()
}

/**
 * Go up or down
 * @param {Element} td
 * @param {Element} table
 * @param {String} direction up or down
 * @private
 */
function upOrDown (td, table, direction) {
  let position = positionInParent(td)
  let sibling = (direction === 'up' ? 'previous' : 'next') + 'ElementSibling'
  // previous line (tr), element (td) at the same position
  let previousOrNext = td.parentNode[sibling]
  previousOrNext = previousOrNext ? previousOrNext.children[position] : null

  if (previousOrNext && previousOrNext.classList.contains('dpicker-active')) {
    previousOrNext.querySelector('button').focus()
    return
  }

  // last or first line
  let lastOrFirst = table.querySelector('tr:' + (direction === 'up' ? 'last-child' : 'first-child'))

  // find the last available position with a button beggining by the bottom
  while (lastOrFirst) {
    if (lastOrFirst.children[position].classList.contains('dpicker-active')) {
      lastOrFirst.children[position].querySelector('button').focus()
      return
    }

    lastOrFirst = lastOrFirst[sibling]
  }
}

/**
 * Go up
 * @param {Element} td
 * @param {Element} table
 * @private
 */
function up (td, table) {
  return upOrDown(td, table, 'up')
}

/**
 * Go down
 * @param {Element} td
 * @param {Element} table
 * @private
 */
function down (td, table) {
  return upOrDown(td, table, 'down')
}

/**
 * Enables arrow navigation inside days
 * @event DPicker#dayKeyDown
 */
DPicker._events.dayKeyDown = DPicker.decorate(DPicker._events.dayKeyDown, function DayKeyDown (evt) {
  let key = evt.which || evt.keyCode
  if (key > 40 || key < 37) {
    return
  }

  evt.preventDefault()

  let td = evt.target.parentNode
  let table = td.parentNode.parentNode

  switch (key) {
    // left
    case 37: {
      return left(td, table)
    }
    // right
    case 39: {
      return right(td, table)
    }
    // up
    case 38: {
      return up(td, table)
    }
    // down
    case 40: {
      return down(td, table)
    }
  }
})
