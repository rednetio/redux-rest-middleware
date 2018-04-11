'use strict';

function json(data, type) {
  if ('application/json' !== type) {
    throw new Error('Unsupported Content-Type: ' + type);
  }

  return JSON.parse(data);
}

function form(data, type) {
  if ('application/form-data' !== type) {
    throw new Error('Unsupported Content-Type: ' + type);
  }

  var payload = {};
  var params = data.split('&');
  var len = params.length;
  var i, param;

  for (i = 0; i < len; i = i + 1) {
    param = params[i].split('=', 2);
    payload[decodeURIComponent(param[0])] = decodeURIComponent(param[1]);
  }

  return payload;
}

function decode(fn, data, type) {
  return data.then(function(text) {
    switch (fn) {
      case 'json':
        return json(text, type);
      case 'form':
        return form(text, type);
      default:
        return fn(text, type);
    }
  });
}

module.exports = decode;
