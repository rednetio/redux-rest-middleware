'use strict';

var setAuthorization = require('../lib/set-authorization');

describe('setAuthorization', function() {
  it('with a string', function() {
    var headers = [];

    setAuthorization(headers, 'foo');
    expect(headers).to.deep.include(['Authorization', 'foo']);
  });

  it('with an array', function() {
    var headers = [];

    setAuthorization(headers, [['A', 'a'], ['B', 'b']]);
    expect(headers).to.deep.include.members([['A', 'a'], ['B', 'b']]);
  });

  it('with an object', function() {
    var headers = [];

    setAuthorization(headers, { A: 'a', B: 'b' });
    expect(headers).to.deep.include.members([['A', 'a'], ['B', 'b']]);
  });
});
