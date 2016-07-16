
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define('DPicker.modules.arrowNavigation', ['DPicker', 'moment'], factory);
    } else if (typeof module === 'object' && module.exports) {
			  //node
        module.exports = factory(require('dpicker'), require('moment'));
    } else {
        // Browser globals (root is window)
        root.DPicker.modules.arrowNavigation = factory(root.DPicker, root.moment);
    }
}(this, function (DPicker, moment) {
"use strict";
function positionInParent(children) {
  return [].findIndex.call(children.parentNode.children, function(c) {
    return c === children;
  });
}
function left(td, table) {
  var previous = td.previousElementSibling;
  if (previous && previous.querySelector('button')) {
    return previous.querySelector('button').focus();
  }
  previous = td.parentNode.previousElementSibling;
  previous = previous ? previous.querySelector('td:last-child button') : null;
  if (previous) {
    return previous.focus();
  }
  var last = table.querySelector('tr:last-child').querySelectorAll('td.dpicker-active');
  return last[last.length - 1].querySelector('button').focus();
}
function right(td, table) {
  var next = td.nextElementSibling;
  if (next && next.querySelector('button')) {
    return next.querySelector('button').focus();
  }
  next = td.parentNode.nextElementSibling;
  next = next ? next.querySelector('td:first-child button') : null;
  if (next) {
    return next.focus();
  }
  return table.querySelector('tr:first-child').nextElementSibling.querySelectorAll('td.dpicker-active')[0].querySelector('button').focus();
}
function upOrDown(td, table, direction) {
  var position = positionInParent(td);
  var sibling = (direction === 'up' ? 'previous' : 'next') + 'ElementSibling';
  var previousOrNext = td.parentNode[sibling];
  previousOrNext = previousOrNext ? previousOrNext.children[position] : null;
  if (previousOrNext && previousOrNext.classList.contains('dpicker-active')) {
    return previousOrNext.querySelector('button').focus();
  }
  var lastOrFirst = table.querySelector('tr:' + (direction === 'up' ? 'last-child' : 'first-child'));
  while (lastOrFirst) {
    if (lastOrFirst.children[position].classList.contains('dpicker-active')) {
      return lastOrFirst.children[position].querySelector('button').focus();
    }
    lastOrFirst = lastOrFirst[sibling];
  }
}
function up(td, table) {
  return upOrDown(td, table, 'up');
}
function down(td, table) {
  return upOrDown(td, table, 'down');
}
function DayKeyDown(evt) {
  var key = evt.which || evt.keyCode;
  if (key > 40 || key < 37) {
    return;
  }
  evt.preventDefault();
  var td = evt.target.parentNode;
  var table = td.parentNode.parentNode;
  switch (key) {
    case 37:
      {
        return left(td, table);
      }
    case 39:
      {
        return right(td, table);
      }
    case 38:
      {
        return up(td, table);
      }
    case 40:
      {
        return down(td, table);
      }
  }
}
if (!DPicker) {
  throw new ReferenceError('DPicker is required for this extension to work');
}
var arrowNavigation = DPicker.modules.arrowNavigation = {dayKeyDown: DayKeyDown};

  return arrowNavigation;
}));
