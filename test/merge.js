'use strict';

var merge = require('../lib/merge');

describe('merge', function() {
  it('plain objects', function() {
    expect(merge({ a: 1 }, { b: 2 })).to.deep.equal({ a: 1, b: 2 });
  });

  it('bypass prototype properties', function() {
    var Foo = function(key, value) {
      this[key] = value;
    };

    Foo.prototype.foo = 'bar';

    var a = new Foo('a', 1);
    var b = new Foo('b', 2);
    var c = merge(a, b);

    expect(c).to.deep.equal({ a: 1, b: 2 });
    expect(c).to.not.have.property('foo');
  });
});
