// # crud
//
// A simple CRUD (Create, Read, Update, Delete) example.
//
// See redux-actions.js for an equivalent using redux-actions.

import { applyMiddleware, createStore } from 'redux';
import restMiddleware from '..';

const initialState = {
  session: {},
  todos: [],
  todo: null,
};

const listTodos = () => ({
  type: 'LIST_TODOS',
  meta: {
    rest: '/todos',
  },
});

const createTodo = todo => ({
  type: 'CREATE_TODO',
  meta: {
    method: 'POST',
    rest: '/todos',
    body: todo,
  },
});

const readTodo = ({ id }) => ({
  type: 'READ_TODO',
  meta: {
    rest: `/todos/${id}`,
  },
});

const updateTodo = ({ id, ...todo }) => ({
  type: 'UPDATE_TODO',
  meta: {
    method: 'PUT',
    rest: `/todos/${id}`,
    body: todo,
  },
});

const deleteTodo = ({ id }) => ({
  type: 'DELETE_TODO',
  meta: {
    method: 'DELETE',
    rest: `/todos/${id}`,
  },
});

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case 'LIST_TODOS_REQUEST': // falls through
    case 'CREATE_TODO_REQUEST': // falls through
    case 'READ_TODO_REQUEST': // falls through
    case 'UPDATE_TODO_REQUEST': // falls through
    case 'DELETE_TODO_REQUEST':
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

    case 'CREATE_TODO_SUCCESS': // falls through
    case 'READ_TODO_SUCCESS': // falls through
    case 'UPDATE_TODO_SUCCESS':
      return {
        ...state,
        todo: payload,
      };

    case 'DELETE_TODO_SUCCESS':
      return {
        ...state,
        todo: null,
      };

    case 'LIST_TODOS_FAILURE': // falls through
    case 'CREATE_TODO_FAILURE': // falls through
    case 'READ_TODO_FAILURE': // falls through
    case 'UPDATE_TODO_FAILURE': // falls through
    case 'DELETE_TODO_FAILURE':
      return {
        ...state,
        error: payload,
      };

    case 'LIST_TODOS_FINALLY': // falls through
    case 'CREATE_TODO_FINALLY': // falls through
    case 'READ_TODO_FINALLY': // falls through
    case 'UPDATE_TODO_FINALLY': // falls through
    case 'DELETE_TODO_FINALLY':
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
    authorization: getState => `Bearer ${getState().session.jwt}`,
  }),
);

const store = createStore(reducer, storeEnhancer);
