import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { handleCobrowsingUpdates } from './actions/game/cobrowsingActions';
import rootReducer from './reducers';

const initialState = {};

const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(thunk, handleCobrowsingUpdates),
    (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()) ||
      compose,
  ),
);

export default store