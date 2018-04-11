'use strict';

function setAuthorization(headers, authorization) {
  if ('string' === typeof authorization) {
    headers.push(['Authorization', authorization]);
    return;
  }

  if (authorization instanceof Array) {
    headers.push.apply(headers, authorization);
    return;
  }

  var key;

  for (key in authorization) {
    headers.push([key, authorization[key]]);
  }
}

module.exports = setAuthorization;
