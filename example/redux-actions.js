// # redux-actions
//
// A simple CRUD (Create, Read, Update, Delete) example using redux-actions.
//
// See crud.js for an equivalent without redux-actions.

import { applyMiddleware, createStore } from 'redux';
import { combineActions, createAction, handleActions } from 'redux-actions';
import restMiddleware from '..';

const initialState = {
  session: {},
  todos: [],
  todo: null,
};

const listTodos = createAction('LIST_TODOS', null, () => ({
  rest: '/todos',
}));

const createTodo = createAction('CREATE_TODO', null, todo => ({
  method: 'POST',
  rest: '/todos',
  body: todo,
}));

const readTodo = createAction('READ_TODO', null, ({ id }) => ({
  rest: `/todos/${id}`,
}));

const updateTodo = createAction('UPDATE_TODO', null, ({ id, ...todo }) => ({
  method: 'PUT',
  rest: `/todos/${id}`,
  body: todo,
}));

const deleteTodo = createAction('DELETE_TODO', null, ({ id }) => ({
  method: 'DELETE',
  rest: `/todos/${id}`,
}));

// redux-actions action creators have a .toString() method that returns the
// action type.
const requestTypes = [
  `${listTodos}_REQUEST`,
  `${createTodo}_REQUEST`,
  `${readTodo}_REQUEST`,
  `${updateTodo}_REQUEST`,
  `${deleteTodo}_REQUEST`,
];

const successWithTodoTypes = [
  `${createTodo}_SUCCESS`,
  `${readTodo}_SUCCESS`,
  `${updateTodo}_SUCCESS`,
];

const failureTypes = [
  `${listTodos}_FAILURE`,
  `${createTodo}_FAILURE`,
  `${readTodo}_FAILURE`,
  `${updateTodo}_FAILURE`,
  `${deleteTodo}_FAILURE`,
];

const finallyTypes = [
  `${listTodos}_FINALLY`,
  `${createTodo}_FINALLY`,
  `${readTodo}_FINALLY`,
  `${updateTodo}_FINALLY`,
  `${deleteTodo}_FINALLY`,
];

const reducer = handleActions(
  {
    // Combine every _REQUEST
    [combineActions(...requestTypes)]: state => ({
      ...state,
      loading: true,
      error: null,
    }),

    [`${listTodos}_SUCCESS`]: (state, { payload }) => ({
      ...state,
      todos: payload,
    }),

    // Combine every _SUCCESS that come with a 'todo' payload
    [combineActions(...successWithTodoTypes)]: (state, { payload }) => ({
      ...state,
      todo: payload,
    }),

    [`${deleteTodo}_SUCCESS`]: (state, { payload }) => ({
      ...state,
      todo: null,
    }),

    // Combine every _FAILURE
    [combineActions(...failureTypes)]: (state, { payload }) => ({
      ...state,
      error: payload,
    }),

    // Combine every _FINALLY
    [combineActions(...finallyTypes)]: state => ({
      ...state,
      loading: false,
    }),
  },
  initialState,
);

const storeEnhancer = applyMiddleware(
  restMiddleware({
    base: 'http://localhost:3000',
    authorization: getState => `Bearer ${getState().session.jwt}`,
  }),
);

const store = createStore(reducer, storeEnhancer);
