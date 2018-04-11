# redux-rest-middleware

Redux Middleware for seamless REST communications.

![](https://img.shields.io/travis/rednetio/redux-rest-middleware.svg)
![](https://img.shields.io/coveralls/github/rednetio/redux-rest-middleware.svg)

![](https://img.shields.io/npm/l/@rednetio/redux-rest-middleware.svg)
![](https://img.shields.io/npm/v/@rednetio/redux-rest-middleware.svg)
![](https://img.shields.io/npm/dt/@rednetio/redux-rest-middleware.svg)

![](https://img.shields.io/github/issues-raw/rednetio/redux-rest-middleware.svg)
![](https://img.shields.io/github/issues-pr-raw/rednetio/redux-rest-middleware.svg)
![](https://img.shields.io/github/contributors/rednetio/redux-rest-middleware.svg)
![](https://img.shields.io/github/commit-activity/y/rednetio/redux-rest-middleware.svg)

## Installation

Install using either `npm` or `yarn`:

```sh
npm install @rednetio/redux-rest-middleware
```

```sh
yarn add @rednetio/redux-rest-middleware
```

## API

### Usage

#### Enhance your Redux store with the middleware

```js
import { applyMiddleware, createStore } from 'redux';
import restMiddleware from '@rednetio/redux-rest-middleware';

const storeEnhancer = applyMiddleware(
  restMiddleware({
    base: 'http://localhost:3000',
    authorization: getState => `Bearer ${getState().session.jwt}`,
  }),
);

const store = createStore(reducer, initialState, storeEnhancer);
```

#### Add meta properties to your action

See the [Meta properties](#meta-properties) section for more information.

```js
const listTodos = () => ({
  type: 'LIST_TODOS',
  meta: {
    rest: '/todos',
  },
});
```

#### Handle actions in your reducer

```js
const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case 'LIST_TODOS_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'LIST_TODOS_SUCCESS':
      return {
        ...state,
        todos: payload,
      };

    case 'LIST_TODOS_FAILURE':
      return {
        ...state,
        error: payload,
      };

    case 'LIST_TODOS_FINALLY':
      return {
        ...state,
        loading: false,
      };
  }
}
```

### Middleware options

The `restMiddleware` function takes an optional `options` object that may
contain any of the following keys:

#### authorization

You _must_ provide an `authorization` function if you wish to use the
`authenticated: true` (default) meta property. See the
[Authentication](#authentication) section for more information.

#### base

Useful if you only ever hit one server: the `base` will be concatened with your
meta `rest` property to form the full endpoint. Defaults to `''`.

#### fetch

If you need to support older browsers or server-side rendering you’ll want to
provide a `fetch` polyfill. Defaults to the global `fetch` which is available
in [modern browsers][modern].

[modern]: https://caniuse.com/#feat=fetch

#### encode

Either `'json'`, `'form'` or a custom encoding function that takes the `payload`
object and returns an object with stringified `data` and a `type` property for
the `Content-Type` header. Defaults to `'json'`, which for reference is
implemented like this:

```js
function encode(payload) {
  return {
    type: 'application/json',
    data: JSON.stringify(payload),
  };
}
```

#### decode

Either `'json'`, `'form'` or a custom decoding function that takes the `data`
string and a `type` (`Content-Type` header) and returns an object. Defaults to
`'json'`, which for reference is implemented like this:

```js
function decode(data, type) {
  if (type.indexOf('application/json') !== 0) {
    throw new Error('Unsupported Content-Type');
  }

  return JSON.parse(data);
}
```

#### suffixes

Provide an array if you want to have other action types. Defaults to
`['_REQUEST', '_SUCCESS', '_FAILURE', '_FINALLY']`.

### Meta properties

#### authenticated

Wether to set an `Authorization` request header or not. See the
[Authentication](#authentication) section for more information. Defaults to
`true`.

#### method

HTTP method. Defaults to `GET`.

#### rest

The REST endpoint you want to hit. **Required**.

#### body

Payload to send as the request body.

### Authentication

All requests are authenticated by default, which means the `authorization`
function will be called each time to provide an `Authorization` request header.

You set the `authorization` function in the middleware options. It takes a
`getState` function as an argument, which returns the current state. You can
return:

* a string, which will be the `Authorization` header’s value,
* a `{ header: value }` object to specify multiple or different headers (e.g.
  `{ 'X-Token': 'value' }`),
* alternatively, an array of `[header, value]` tuples to specify multiple or
  different headers (e.g. `[['X-Token', 'value']]`),
* `false` (the default) to disable authentication entirely. Note that this
  will throw an error whenever `authenticated: true` is passed in a meta.

## Usage with redux-actions

`redux-rest-middleware` interfaces nicely with [redux-actions][redux-actions].

See the [`redux-actions`](example/redux-actions.js) example for details.

[redux-actions]: https://www.npmjs.com/package/redux-actions
