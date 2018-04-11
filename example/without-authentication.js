// # without-authentication
//
// You may want to have routes that do not require an Authorization request
// header, for example if you consume an open API or if you need a login
// endpoint.
//
// This examples does not define a 'authorization' option and sets the
// 'authenticated' meta to false for the listTodo action.

import { applyMiddleware, createStore } from 'redux';
import restMiddleware from '..';

const initialState = {
  todos: [],
};

const listTodos = () => ({
  type: 'LIST_TODOS',
  meta: {
    authenticated: false,
    rest: '/todos',
  },
});

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

    default:
      return state;
  }
};

const storeEnhancer = applyMiddleware(
  restMiddleware({
    base: 'http://localhost:3000',
  }),
);

const store = createStore(reducer, storeEnhancer);
