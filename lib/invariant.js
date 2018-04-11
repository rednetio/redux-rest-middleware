'use strict';

var util = require('util');

var format = util.format;
var slice = Array.prototype.slice;

function invariant(assertion) {
  if (!assertion) {
    throw new Error(
      [
        'redux-rest-middleware:',
        format.apply(null, slice.call(arguments, 1))
      ].join(' ')
    );
  }
}

module.exports = invariant;
