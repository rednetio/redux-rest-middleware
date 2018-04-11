'use strict';

var invariant = require('../lib/invariant');

describe('invariant', function() {
  it('do not throw if assertion is truthy', function() {
    expect(function() {
      invariant(1);
    }).to.not.throw();
  });

  it('throw if assertion is falsy', function() {
    expect(function() {
      invariant(0);
    }).to.throw();
  });

  it('throw with a message', function() {
    expect(function() {
      invariant(0, 'message');
    }).to.throw('message');
  });

  it('throw with a formatted message', function() {
    expect(function() {
      invariant(0, '%O', 'foo');
    }).to.throw('foo');
  });
});
