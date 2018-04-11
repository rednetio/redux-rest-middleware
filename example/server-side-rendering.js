// # server-side-rendering
//
// You will need to provide a fetch function if you wish to support server-side
// rendering.

import { applyMiddleware, createStore } from 'redux';
import nodeFetch from 'node-fetch';
import restMiddleware from '..';

// const reducer = ...

const storeEnhancer = applyMiddleware(
  restMiddleware({
    fetch: nodeFetch,
    base: 'http://localhost:3000',
    authorization: getState => `Bearer ${getState().session.jwt}`,
  }),
);

/* eslint-disable-next-line no-undef */
const store = createStore(reducer, storeEnhancer);
