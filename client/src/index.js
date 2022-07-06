import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './App';
import './index.css';

import store from './store'

const container = document.getElementById('root');

// Create a root.
const root = ReactDOM.createRoot(container);

root.render(
  <Provider store={store}>
      <App/>
  </Provider>
);
