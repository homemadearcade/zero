import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { updateCobrowsing } from './actions/cobrowsingActions';

import rootReducer from './reducers';

const initialState = {};


const cobrowsingUpdate = store => next => action => {
  // console.log('dispatching', action)
  // let result = next(action)
  // console.log('next state', store.getState())
  // return result

  let result = next(action)

  const state = store.getState()

  if(action.updateCobrowsing && state.lobby.lobby?.id) {
    store.dispatch(
      updateCobrowsing({
        editor: state.editor.editorState,
        video: state.video.videoState,
        lobby: state.lobby.lobbyState,
        editorForms: state.editorForms.editorFormsState
      })
    )
  }

  return result
}

const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(thunk, cobrowsingUpdate),
    (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()) ||
      compose,
  ),
);

export default store