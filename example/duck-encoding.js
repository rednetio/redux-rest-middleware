// # duck-encoding
//
// This example shows how redux-rest-middleware can be used to encode / decode
// custom payloads. Our state-of-the-art duck-encoding algorithm replaces every
// word with 'quack' when encoding, and every 'quack' with a duck emoji when
// decoding.

import { applyMiddleware, createStore } from 'redux';
import restMiddleware from '..';

// const reducer = ...

const storeEnhancer = applyMiddleware(
  restMiddleware({
    base: 'http://localhost:3000',
    authorization: getState => `Bearer ${getState().session.jwt}`,
    encode: payload => ({
      type: 'application/x-duck',
      data: payload.replace(/\w+/g, 'quack'),
    }),
    decode: (data, type) => {
      if ('application/x-duck' !== type) {
        throw new Error('QUACK ?!');
      }

      return data.replace(/\bquack\b/g, '🦆');
    },
  }),
);

/* eslint-disable-next-line no-undef */
const store = createStore(reducer, storeEnhancer);
