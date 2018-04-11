'use strict';

var middleware = require('../lib/middleware');
var noop = Function.prototype;
var suffixes = ['_REQUEST', '_SUCCESS', '_FAILURE', '_FINALLY'];

function getFetch(options) {
  var fail = options && 'fail' in options ? options.fail : false;
  var status = options && 'status' in options ? options.status : 200;
  var ok = options && 'ok' in options ? options.ok : true;
  var text = options && 'text' in options ? options.text : '{"foo":1}';
  var contentType =
    options && 'contentType' in options
      ? options.contentType
      : 'application/json';

  return function() {
    return fail
      ? Promise.reject(fail)
      : Promise.resolve({
          status: status,
          ok: ok,
          text: function() {
            return Promise.resolve(text);
          },
          headers: {
            get: function() {
              return contentType;
            }
          }
        });
  };
}

describe('middleware', function() {
  it('call next immediately if there is no meta', function() {
    var next = sinon.spy();

    middleware(null, null, next, { type: 'foo' });
    expect(next).to.have.been.calledWith({ type: 'foo' });
  });

  it('call next immediately if there is no rest meta', function() {
    var next = sinon.spy();

    middleware(null, null, next, { type: 'foo', meta: { bar: 1 } });
    expect(next).to.have.been.calledWith({ type: 'foo', meta: { bar: 1 } });
  });

  it('throw if authenticated and no authorization function', function() {
    var options = {
      authorization: function() {
        return false;
      }
    };
    var action = { type: 'foo', meta: { rest: '' } };

    expect(function() {
      middleware(options, {}, null, action);
    }).to.throw('no authorization function provided');
  });

  it('call option.authorization if authenticated is true', function() {
    var authorization = sinon.spy();

    var options = {
      authorization: authorization,
      fetch: getFetch(),
      suffixes: suffixes
    };

    var store = { getState: 'foo', dispatch: noop };
    var action = { type: 'foo', meta: { rest: '' } };

    middleware(options, store, null, action);
    expect(authorization).to.have.been.calledWith('foo');
  });

  it('concatenate option.base and meta.rest to get endpoint', function() {
    var fetch = sinon.stub().callsFake(getFetch());

    var options = {
      base: 'foo',
      fetch: fetch,
      suffixes: suffixes
    };

    var store = { dispatch: noop };
    var action = { type: 'foo', meta: { rest: 'bar', authenticated: false } };

    return middleware(options, store, null, action).then(function() {
      expect(fetch).to.have.been.calledWith('foobar');
    });
  });

  it('set authorization if authenticated is true', function() {
    var authorization = function() {
      return 'token';
    };
    var fetch = sinon.stub().callsFake(getFetch());

    var options = {
      base: '',
      authorization: authorization,
      fetch: fetch,
      suffixes: suffixes
    };

    var store = { dispatch: noop };
    var action = { type: 'foo', meta: { rest: '' } };

    return middleware(options, store, null, action).then(function() {
      expect(fetch).to.have.been.calledWith(
        '',
        sinon.match({
          headers: [['Authorization', 'token']]
        })
      );
    });
  });

  it('add request body and content-type if body is provided', function() {
    var fetch = sinon.stub().callsFake(getFetch());

    var encode = function() {
      return { type: 'application/x-custom-type', data: 'body' };
    };

    var options = {
      base: '',
      encode: encode,
      fetch: fetch,
      suffixes: suffixes
    };

    var store = { dispatch: noop };

    var action = {
      type: 'foo',
      meta: { authenticated: false, rest: '', body: { foo: 1 } }
    };

    return middleware(options, store, null, action).then(function() {
      expect(fetch).to.have.been.calledWith(
        '',
        sinon.match({
          headers: [['Content-Type', 'application/x-custom-type']],
          body: 'body'
        })
      );
    });
  });

  ['_SUCCESS', '_FAILURE'].forEach(function(suffix) {
    it('call dispatch 3 times (' + suffix + ')', function() {
      var dispatch = sinon.spy();

      var options = {
        base: '',
        decode: 'json',
        fetch: getFetch({ fail: '_FAILURE' === suffix }),
        suffixes: suffixes
      };

      var store = { dispatch: dispatch };
      var action = { type: 'foo', meta: { authenticated: false, rest: '' } };

      return middleware(options, store, null, action).then(function() {
        expect(dispatch).to.have.been.calledThrice;
        expect(dispatch).to.have.been.calledWithMatch({ type: 'foo_REQUEST' });
        expect(dispatch).to.have.been.calledWithMatch({ type: 'foo' + suffix });
        expect(dispatch).to.have.been.calledWithMatch({ type: 'foo_FINALLY' });
      });
    });
  });

  it('pass other meta', function() {
    var dispatch = sinon.spy();
    var options = { base: '', fetch: getFetch(), suffixes: suffixes };
    var store = { dispatch: dispatch };
    var action = {
      type: 'foo',
      meta: { authenticated: false, rest: '', foo: 1 }
    };

    return middleware(options, store, null, action).then(function() {
      expect(dispatch).to.always.have.been.calledWithMatch({
        meta: { foo: 1 }
      });

      expect(dispatch).not.to.have.been.calledWithMatch({
        meta: { authenticated: sinon.match.defined }
      });

      expect(dispatch).not.to.have.been.calledWithMatch({
        meta: { rest: sinon.match.defined }
      });
    });
  });

  it('set action.error: true on error', function() {
    var dispatch = sinon.spy();

    var options = {
      base: '',
      fetch: getFetch({ fail: true }),
      suffixes: suffixes
    };

    var store = { dispatch: dispatch };
    var action = { type: 'foo', meta: { authenticated: false, rest: '' } };

    return middleware(options, store, null, action).then(function() {
      expect(dispatch).to.have.been.calledWithMatch({
        type: 'foo_FAILURE',
        error: true
      });
    });
  });

  it('do not call decode on status 204', function() {
    var decode = sinon.spy();

    var options = {
      base: '',
      fetch: getFetch({ status: 204 }),
      decode: decode,
      suffixes: suffixes
    };

    var store = { dispatch: noop };
    var action = { type: 'foo', meta: { authenticated: false, rest: '' } };

    return middleware(options, store, null, action).then(function() {
      expect(decode).to.not.have.been.called;
    });
  });

  it('do not call decode on HEAD requests', function() {
    var decode = sinon.spy();

    var options = {
      base: '',
      fetch: getFetch(),
      decode: decode,
      suffixes: suffixes
    };

    var store = { dispatch: noop };
    var action = {
      type: 'foo',
      meta: { authenticated: false, method: 'HEAD', rest: '' }
    };

    return middleware(options, store, null, action).then(function() {
      expect(decode).to.not.have.been.called;
    });
  });

  it('dispatch _FAILURE on client / server error', function() {
    var dispatch = sinon.spy();

    var options = {
      base: '',
      decode: 'json',
      fetch: getFetch({ ok: false }),
      suffixes: suffixes
    };

    var store = { dispatch: dispatch };
    var action = { type: 'foo', meta: { authenticated: false, rest: '' } };

    return middleware(options, store, null, action).then(function() {
      expect(dispatch).to.have.been.calledWithMatch({
        type: 'foo_FAILURE',
        error: true
      });
    });
  });
});
