'use strict';

var invariant = require('./invariant');
var merge = require('./merge');

var defaultOptions = {
  authorization: /* istanbul ignore next */ function() {
    return false;
  },
  base: '',
  fetch: fetch,
  encode: 'json',
  decode: 'json',
  suffixes: ['_REQUEST', '_SUCCESS', '_FAILURE', '_FINALLY']
};

var check =
  'production' === process.env.NODE_ENV
    ? /* istanbul ignore next */ Function.prototype
    : function(options) {
        invariant(
          'function' === typeof options.authorization,
          'options.authorization must be a function, was given %O.',
          options.authorization
        );

        invariant(
          'string' === typeof options.base,
          'options.base must be a string, was given %O.',
          options.base
        );

        invariant(
          'function' === typeof options.fetch,
          'options.fetch must be a function, was given %O.',
          options.fetch
        );

        invariant(
          'function' === typeof options.encode ||
            'json' === options.encode ||
            'form' === options.encode,
          "options.encode must be a function, 'json' or 'form', was given %O.",
          options.encode
        );

        invariant(
          'function' === typeof options.decode ||
            'json' === options.decode ||
            'form' === options.decode,
          "options.decode must be a function, 'json' or 'form', was given %O.",
          options.decode
        );

        invariant(
          options.suffixes instanceof Array &&
            4 === options.suffixes.length &&
            'string' === typeof options.suffixes[0] &&
            'string' === typeof options.suffixes[1] &&
            'string' === typeof options.suffixes[2] &&
            'string' === typeof options.suffixes[3],
          'options.suffixes must be an array of 4 strings, was given %O.',
          options.suffixes
        );
      };

function provide(middleware, options) {
  var opts = merge(defaultOptions, options);

  /* istanbul ignore else */
  if ('production' !== process.env.NODE_ENV) {
    check(opts);
  }

  return function(store) {
    return function(next) {
      return function(action) {
        return middleware(opts, store, next, action);
      };
    };
  };
}

module.exports = provide;
