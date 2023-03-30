import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './localStorage.js'
import './events.js'
import './index.css';
import './game/constants'
import './constants'
import App from './App';
import store from './store'

const container = document.getElementById('root');

// Create a root.
const root = ReactDOM.createRoot(container);

root.render(
  <Provider store={store}>
      <App/>
  </Provider>
);
