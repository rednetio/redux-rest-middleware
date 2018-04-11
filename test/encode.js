'use strict';

var encode = require('../lib/encode');

describe('encode', function() {
  [
    ['JSON', 'json', 'application/json'],
    ['form-data', 'form', 'application/form-data'],
    [
      'a custom function',
      function() {
        return { type: 'foo' };
      },
      'foo'
    ]
  ].forEach(function(type) {
    it('return correct type for ' + type[0], function() {
      expect(encode(type[1])).to.include({ type: type[2] });
    });
  });

  it('serialize JSON', function() {
    expect(encode('json', { foo: '"bar"' })).to.include({
      data: '{"foo":"\\"bar\\""}'
    });
  });

  it('serialize form-data', function() {
    var Foo = function() {
      this.foo = '1+1';
    };

    Foo.prototype.bar = 'nothing';

    var payload = new Foo();

    expect(encode('form', payload)).to.include({ data: 'foo=1%2B1' });
  });

  it('use a custom function', function() {
    var fn = sinon.spy();

    encode(fn, 'foo');
    expect(fn).to.have.been.calledWith('foo');
  });
});
