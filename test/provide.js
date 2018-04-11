'use strict';

var provide = require('../lib/provide');

describe('provide', function() {
  it('return a curried function', function() {
    expect(provide()()()).to.be.a('function');
  });

  it('provide default options', function() {
    var middleware = sinon.spy();

    provide(middleware)()()();

    expect(middleware).to.have.been.calledWith(sinon.match.object);
  });

  it('handle custom options', function() {
    var middleware = sinon.spy();

    provide(middleware, { base: 'foo' })()()();
    expect(middleware).to.have.been.calledWith(sinon.match({ base: 'foo' }));
  });

  [
    ['authorization', { authorization: null }],
    ['base', { base: null }],
    ['fetch', { fetch: null }],
    ['encode', { encode: 'foo' }],
    ['decode', { decode: 'foo' }],
    ['suffixes', { suffixes: [] }]
  ].forEach(function(option) {
    it('throw on invalid ' + option[0] + ' option', function() {
      expect(function() {
        provide(null, option[1]);
      }).to.throw(option[0]);
    });
  });

  it('call middleware with option and curried arguments', function() {
    var middleware = sinon.spy();
    var store = 1;
    var next = 2;
    var action = 3;

    provide(middleware)(store)(next)(action);
    expect(middleware).to.have.been.calledWith(
      sinon.match.any,
      store,
      next,
      action
    );
  });
});
