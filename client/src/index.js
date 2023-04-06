import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './localStorage.js'
import './events.js'
import './index.css';
// load action ids first
import './constants/interfaceActionIds'
// load interfacts ids second
import './constants/interfaceIds'
// then load game core constants and structures that rely on game core constants
import './game/constants'
// then load interface id DATA which may rely on game constants and structures
import './constants/interfaceActionIdData'
// then load interface id DATA which may rely on game constants and structures
import './constants/interfaceIdData'
// load the rest of the constants, the order they will be loaded in is unknown
import './constants'

// then the components can import in any data as they see fit
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
