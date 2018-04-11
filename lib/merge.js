'use strict';

var hasOwnProperty = Object.prototype.hasOwnProperty;

function merge(a, b) {
  var obj = {};
  var key;

  for (key in a) {
    if (hasOwnProperty.call(a, key)) {
      obj[key] = a[key];
    }
  }

  for (key in b) {
    if (hasOwnProperty.call(b, key)) {
      obj[key] = b[key];
    }
  }

  return obj;
}

module.exports = merge;
