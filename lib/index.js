'use strict';

var provide = require('./provide');
var middleware = require('./middleware');

function restMiddleware(options) {
  return provide(middleware, options);
}

module.exports = restMiddleware;
