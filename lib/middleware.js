'use strict';

var merge = require('./merge');
var invariant = require('./invariant');
var encode = require('./encode');
var decode = require('./decode');
var setAuthorization = require('./set-authorization');

var defaultMeta = {
  authenticated: true,
  method: 'GET'
};

function middleware(options, store, next, action) {
  if (!(action.meta && 'rest' in action.meta)) {
    return next(action);
  }

  var type = action.type;
  var meta = merge(defaultMeta, action.meta);
  var url = options.base + meta.rest;
  var headers = [];
  var body = meta.body ? encode(options.encode, meta.body) : null;

  var params = {
    method: meta.method.toUpperCase(),
    headers: headers
  };

  var authorization = meta.authenticated
    ? options.authorization(store.getState)
    : null;

  var otherMeta = merge({}, meta);

  delete otherMeta.authenticated;
  delete otherMeta.method;
  delete otherMeta.rest;
  delete otherMeta.body;

  invariant(
    false !== authorization,
    'authenticated request but no authorization function provided. See %s',
    'https://github.com/rednetio/redux-rest-middleware#authentication'
  );

  if (authorization) {
    setAuthorization(params.headers, authorization);
  }

  if (body) {
    params.headers.push(['Content-Type', body.type]);
    params.body = body.data;
  }

  return Promise.resolve()
    .then(function() {
      store.dispatch({
        type: type + options.suffixes[0],
        meta: otherMeta
      });
    })
    .then(function() {
      return (0, options.fetch)(url, params);
    })
    .then(function(res) {
      var type = res.headers.get('Content-Type').split(';', 1)[0];

      return Promise.resolve(
        204 === res.status || 'HEAD' === params.method
          ? null
          : decode(options.decode, res.text(), type)
      ).then(function(payload) {
        return res.ok ? payload : Promise.reject(payload);
      });
    })
    .then(function(payload) {
      store.dispatch({
        type: type + options.suffixes[1],
        payload: payload,
        meta: otherMeta
      });
    })
    .catch(function(payload) {
      store.dispatch({
        type: type + options.suffixes[2],
        error: true,
        payload: payload,
        meta: otherMeta
      });
    })
    .then(function() {
      store.dispatch({
        type: type + options.suffixes[3],
        meta: otherMeta
      });
    });
}

module.exports = middleware;
