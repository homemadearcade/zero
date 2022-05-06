import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import App from './App';
import './index.css';
import rootReducer from './store/reducers';

const initialState = {};

const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(thunk),
    (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()) ||
      compose,
  ),
);

const container = document.getElementById('root');

// Create a root.
const root = ReactDOM.createRoot(container);

root.render(
  <Provider store={store}>
      <App/>
  </Provider>
);
