function positionInParent (children) {
  return [].indexOf.call(children.parentNode.children, children)
}

/**
 * @module DPicker.modules.arrowNavigation
 */

function left (td, table) {
  // previous td
  let previous = td.previousElementSibling

  if (previous && previous.querySelector('button')) {
    return previous.querySelector('button').focus()
  }

  // previous row, last button
  previous = td.parentNode.previousElementSibling
  previous = previous ? previous.querySelector('td:last-child button') : null

  if (previous) {
    return previous.focus()
  }

  // last tr first td
  let last = table.querySelector('tr:last-child').querySelectorAll('td.dpicker-active')
  return last[last.length - 1].querySelector('button').focus()
}

function right (td, table) {
  let next = td.nextElementSibling

  if (next && next.querySelector('button')) {
    return next.querySelector('button').focus()
  }

  next = td.parentNode.nextElementSibling
  next = next ? next.querySelector('td:first-child button') : null

  if (next) {
    return next.focus()
  }

  return table.querySelector('tr:first-child').nextElementSibling.querySelectorAll('td.dpicker-active')[0].querySelector('button').focus()
}

function upOrDown (td, table, direction) {
  let position = positionInParent(td)
  let sibling = (direction === 'up' ? 'previous' : 'next') + 'ElementSibling'
  // previous line (tr), element (td) at the same position
  let previousOrNext = td.parentNode[sibling]
  previousOrNext = previousOrNext ? previousOrNext.children[position] : null

  if (previousOrNext && previousOrNext.classList.contains('dpicker-active')) {
    return previousOrNext.querySelector('button').focus()
  }

  // last or first line
  let lastOrFirst = table.querySelector('tr:' + (direction === 'up' ? 'last-child' : 'first-child'))

  // find the last available position with a button beggining by the bottom
  while (lastOrFirst) {
    if (lastOrFirst.children[position].classList.contains('dpicker-active')) {
      return lastOrFirst.children[position].querySelector('button').focus()
    }

    lastOrFirst = lastOrFirst[sibling]
  }
}

function up (td, table) {
  return upOrDown(td, table, 'up')
}

function down (td, table) {
  return upOrDown(td, table, 'down')
}

/**
 * Enables arrow navigation inside days
 * @param {Event} DOMEvent
 * @listens DPicker#dayKeyDown
 */
function DayKeyDown (evt) {
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
}

if (!DPicker) {
  throw new ReferenceError('DPicker is required for this extension to work')
}

DPicker.modules.arrowNavigation = {
  events: {
    dayKeyDown: DayKeyDown
  }
}
