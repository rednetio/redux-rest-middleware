'use strict';

var restMiddleware = require('../lib/index.js');

describe('restMiddleware', function() {
  it('return a function', function() {
    expect(restMiddleware()).to.be.a('function');
  });
});
