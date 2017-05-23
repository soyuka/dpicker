(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.dpicker_arrowNavigation = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
module.exports = function (DPicker) {
    function positionInParent(children) {
        return [].indexOf.call(children.parentNode.children, children);
    }
    function left(td, table) {
        var previous = td.previousElementSibling;
        if (previous && previous.querySelector('button')) {
            previous.querySelector('button').focus();
            return;
        }
        previous = td.parentNode.previousElementSibling;
        previous = previous ? previous.querySelector('td:last-child button') : null;
        if (previous) {
            return previous.focus();
        }
        var last = table.querySelector('tr:last-child').querySelectorAll('td.dpicker-active');
        last[last.length - 1].querySelector('button').focus();
    }
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
    function upOrDown(td, table, direction) {
        var position = positionInParent(td);
        var sibling = (direction === 'up' ? 'previous' : 'next') + 'ElementSibling';
        var previousOrNext = td.parentNode[sibling];
        previousOrNext = previousOrNext ? previousOrNext.children[position] : null;
        if (previousOrNext && previousOrNext.classList.contains('dpicker-active')) {
            previousOrNext.querySelector('button').focus();
            return;
        }
        var lastOrFirst = table.querySelector('tr:' + (direction === 'up' ? 'last-child' : 'first-child'));
        while (lastOrFirst) {
            if (lastOrFirst.children[position].classList.contains('dpicker-active')) {
                lastOrFirst.children[position].querySelector('button').focus();
                return;
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
    DPicker.events.dayKeyDown = DPicker.decorate(DPicker.events.dayKeyDown, function DayKeyDown(evt) {
        var key = evt.which || evt.keyCode;
        if (key > 40 || key < 37) {
            return;
        }
        evt.preventDefault();
        var td = evt.target.parentNode;
        var table = td.parentNode.parentNode;
        switch (key) {
        case 37: {
                return left(td, table);
            }
        case 39: {
                return right(td, table);
            }
        case 38: {
                return up(td, table);
            }
        case 40: {
                return down(td, table);
            }
        }
    });
    return DPicker;
};
},{}]},{},[1])(1)
});