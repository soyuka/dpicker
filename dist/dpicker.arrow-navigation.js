(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.dpicker_arrowNavigation = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

module.exports = function (DPicker) {
  /**
  * Get element position in parent
  * @param {Element} children
  * @return {Number}
  * @private
  */
  function positionInParent(children) {
    return [].indexOf.call(children.parentNode.children, children);
  }

  /**
  * Move left
  * @param {Element} td
  * @param {Element} table
  * @private
  */
  function left(td, table) {
    // previous td
    var previous = td.previousElementSibling;

    if (previous && previous.querySelector('button')) {
      previous.querySelector('button').focus();
      return;
    }

    // previous row, last button
    previous = td.parentNode.previousElementSibling;
    previous = previous ? previous.querySelector('td:last-child button') : null;

    if (previous) {
      return previous.focus();
    }

    // last tr first td
    var last = table.querySelector('tr:last-child').querySelectorAll('td.dpicker-active');
    last[last.length - 1].querySelector('button').focus();
  }

  /**
  * Move right
  * @param {Element} td
  * @param {Element} table
  * @private
  */
  function right(td, table) {
    var next = td.nextElementSibling;

    if (next && next.querySelector('button')) {
      next.querySelector('button').focus();
      return;
    }

    next = td.parentNode.nextElementSibling;
    next = next ? next.querySelector('td:first-child button') : null;

    if (next) {
      return next.focus();
    }

    table.querySelector('tr:first-child').nextElementSibling.querySelectorAll('td.dpicker-active')[0].querySelector('button').focus();
  }

  /**
  * Go up or down
  * @param {Element} td
  * @param {Element} table
  * @param {String} direction up or down
  * @private
  */
  function upOrDown(td, table, direction) {
    var position = positionInParent(td);
    var sibling = (direction === 'up' ? 'previous' : 'next') + 'ElementSibling';
    // previous line (tr), element (td) at the same position
    var previousOrNext = td.parentNode[sibling];
    previousOrNext = previousOrNext ? previousOrNext.children[position] : null;

    if (previousOrNext && previousOrNext.classList.contains('dpicker-active')) {
      previousOrNext.querySelector('button').focus();
      return;
    }

    // last or first line
    var lastOrFirst = table.querySelector('tr:' + (direction === 'up' ? 'last-child' : 'first-child'));

    // find the last available position with a button beggining by the bottom
    while (lastOrFirst) {
      if (lastOrFirst.children[position].classList.contains('dpicker-active')) {
        lastOrFirst.children[position].querySelector('button').focus();
        return;
      }

      lastOrFirst = lastOrFirst[sibling];
    }
  }

  /**
  * Go up
  * @param {Element} td
  * @param {Element} table
  * @private
  */
  function up(td, table) {
    return upOrDown(td, table, 'up');
  }

  /**
  * Go down
  * @param {Element} td
  * @param {Element} table
  * @private
  */
  function down(td, table) {
    return upOrDown(td, table, 'down');
  }

  /**
  * Enables arrow navigation inside days
  * @event DPicker#dayKeyDown
  */
  DPicker.events.dayKeyDown = DPicker.decorate(DPicker.events.dayKeyDown, function DayKeyDown(evt) {
    var key = evt.which || evt.keyCode;
    if (key > 40 || key < 37) {
      return;
    }

    evt.preventDefault();

    var td = evt.target.parentNode;
    var table = td.parentNode.parentNode;

    switch (key) {
      // left
      case 37:
        {
          return left(td, table);
        }
      // right
      case 39:
        {
          return right(td, table);
        }
      // up
      case 38:
        {
          return up(td, table);
        }
      // down
      case 40:
        {
          return down(td, table);
        }
    }
  });

  return DPicker;
};

},{}]},{},[1])(1)
});
