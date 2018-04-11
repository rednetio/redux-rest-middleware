'use strict';

var hasOwnProperty = Object.prototype.hasOwnProperty;

function json(payload) {
  return {
    type: 'application/json',
    data: JSON.stringify(payload)
  };
}

function form(payload) {
  var data = [];
  var key;

  for (key in payload) {
    if (hasOwnProperty.call(payload, key)) {
      data.push(
        [encodeURIComponent(key), encodeURIComponent(payload[key])].join('=')
      );
    }
  }

  return {
    type: 'application/form-data',
    data: data.join('&')
  };
}

function decode(fn, payload) {
  switch (fn) {
    case 'json':
      return json(payload);
    case 'form':
      return form(payload);
    default:
      return fn(payload);
  }
}

module.exports = decode;
