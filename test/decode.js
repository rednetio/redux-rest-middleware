'use strict';

var decode = require('../lib/decode');

describe('decode', function() {
  [['JSON', 'json', 'foo'], ['form-data', 'form', 'bar']].forEach(function(
    type
  ) {
    it('reject if invalid content-type for ' + type[0], function() {
      var promise = decode(type[1], Promise.resolve(), type[2]);

      return expect(promise).to.be.rejectedWith('Unsupported Content-Type');
    });
  });

  it('parse JSON', function() {
    var json = '{"foo":1,"bar":"\\"baz\\""}';
    var type = 'application/json';
    var promise = decode('json', Promise.resolve(json), type);

    return expect(promise).to.eventually.deep.equal({ foo: 1, bar: '"baz"' });
  });

  it('parse form-data', function() {
    var form = 'foo=1&bar=1%2B1';
    var type = 'application/form-data';
    var promise = decode('form', Promise.resolve(form), type);

    return expect(promise).to.eventually.deep.equal({ foo: '1', bar: '1+1' });
  });

  it('use a custom function', function() {
    var fn = sinon.spy();

    return decode(fn, Promise.resolve('foo'), 'bar').then(function() {
      expect(fn).to.have.been.calledWith('foo', 'bar');
    });
  });
});
