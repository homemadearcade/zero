import axios from 'axios';
import { attachTokenToHeaders } from './authActions';
import _ from 'lodash';

import {
  START_COBROWSING_SUCCESS,
  START_COBROWSING_FAIL,
  END_COBROWSING_SUCCESS,
  END_COBROWSING_FAIL,
  UPDATE_COBROWSING_FAIL,
  SUBSCRIBE_COBROWSING_LOADING,
  SUBSCRIBE_COBROWSING_SUCCESS,
  SUBSCRIBE_COBROWSING_FAIL,
  UNSUBSCRIBE_COBROWSING_LOADING,
  UNSUBSCRIBE_COBROWSING_SUCCESS,
  UNSUBSCRIBE_COBROWSING_FAIL,
  ON_COBROWSING_SUBSCRIBED,
  ON_COBROWSING_UPDATE,
  ON_COBROWSING_STATUS_UPDATE,
} from '../types';

import store from '..';
import { getRemoteStatePackage } from '../../utils/cobrowsing';
import { getCurrentGameScene } from '../../utils/editor';

const sendCobrowsingStatus = _.debounce((e) =>  {
  const viewWidth = (window.innerHeight + (window.innerHeight * .4) - 4);
  const viewPadding = (window.innerWidth - viewWidth)/2
  const xPercent = (e.clientX - viewPadding)/viewWidth

  const state = store.getState()
  const userId = state.auth.me.id
  const lobbyId = state.lobby.lobby.id 

  const cobrowsingStatus = {
    lobbyId,
    userId,
    cobrowsingMouse: {
      xPercent,
      // xPercent: e.clientX/window.innerWidth,
      yPercent: e.clientY/window.innerHeight,
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      lastPing: Date.now(),
    },
  }

  const leftColumn = document.getElementById('GameEditor__left-column')
  const rightColumn = document.getElementById('GameEditor__right-column')

  if(leftColumn && rightColumn) {
    cobrowsingStatus.cobrowsingScroll = {
      leftColumnScrollYPercent: leftColumn.scrollTop/leftColumn.scrollHeight,
      rightColumnScrollYPercent: rightColumn.scrollTop/rightColumn.scrollHeight
    }
  }

  if(state.game.gameInstance && window.pointer) {
    const cameraZoom = state.editor.cameraZoom
    const camera = getCurrentGameScene(state.game.gameInstance).editorCamera
    cobrowsingStatus.phaserView = {
      mouseWorldX: window.pointer.worldX,
      mouseWorldY: window.pointer.worldY,
      cameraX: camera.worldView.x,
      cameraY: camera.worldView.y,
      cameraZoom
    }
  }

  window.socket.emit(ON_COBROWSING_STATUS_UPDATE, cobrowsingStatus)
}, 7)

function onEditorKeyUp(event) {
  let shouldUpdate = false
  if(event.key.toLowerCase() === 'w') {
    shouldUpdate = true
  } else if(event.key.toLowerCase() === 'a'){
    shouldUpdate = true
  } else if(event.key.toLowerCase() === 's'){
    shouldUpdate = true
  } else if(event.key.toLowerCase() === 'd'){
    shouldUpdate = true
  }
  if(shouldUpdate){
    setTimeout(() => {
      sendCobrowsingStatus(event)
    }, 500)
  }
}

export const handleCobrowsingUpdates = store => next => action => {
  // console.log('dispatching', action)
  // let result = next(action)
  // console.log('next state', store.getState())
  // return result

  let result = next(action)

  const state = store.getState()

  if(action.updateCobrowsing && state.lobby.lobby?.id) {

    if(state.cobrowsing.isSubscribedCobrowsing) {
      return null
    }

    store.dispatch(
      updateCobrowsing(getRemoteStatePackage(state))
    )
  }

  return result
}


export const publishCobrowsing = () => (dispatch, getState) => {
  try {
    const state = getState()

    const user = state.auth.me

    // this event will send admins your mouse state to let them know you can be browsed
    window.addEventListener('mousemove', sendCobrowsingStatus)
    window.addEventListener('keyup', onEditorKeyUp)

    dispatch({
      type: START_COBROWSING_SUCCESS,
      payload: { 
        cobrowsingUser: user
      }
    });

    // event that is triggered if another user has subscribed to your cobrowsingu, sends the initial state out
    window.socket.on(ON_COBROWSING_SUBSCRIBED, () => {
      dispatch(updateCobrowsing(getRemoteStatePackage(getState())))
    });
    
    dispatch(updateCobrowsing(getRemoteStatePackage(getState())))
  } catch (err) {
    console.error(err)

    dispatch({
      type: START_COBROWSING_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const unpublishCobrowsing = () => (dispatch, getState) => {
  try {
    window.socket.off(ON_COBROWSING_SUBSCRIBED);
    window.removeEventListener('mousemove', sendCobrowsingStatus);
    window.removeEventListener('keyup', onEditorKeyUp)

    dispatch({
      type: END_COBROWSING_SUCCESS,
      payload: {}
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: END_COBROWSING_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const updateCobrowsing = (remoteState) => async (dispatch, getState) => {
  try {
    const userId = getState().cobrowsing.cobrowsingUser.id

    dispatch({
      type: ON_COBROWSING_UPDATE,
      payload: { remoteState },
    });
    
    const options = attachTokenToHeaders(getState);
    await axios.put('/api/cobrowsing/' + userId, { remoteState }, options);
  } catch (err) {
    console.error(err)

    dispatch({
      type: UPDATE_COBROWSING_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const subscribeCobrowsing = ({userId}) => async (dispatch, getState) => {
  dispatch({
    type: SUBSCRIBE_COBROWSING_LOADING,
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/cobrowsing/' + userId, {}, options);

    // event that is triggered if cobrowsing has been registered
    window.socket.on(ON_COBROWSING_UPDATE, ({userId, remoteState}) => {
      dispatch({
        type: ON_COBROWSING_UPDATE,
        payload: { 
          remoteState: {
            ...getState().cobrowsing.remoteState,
            ...remoteState
          }
        },
      });
    });

    dispatch({
      type: SUBSCRIBE_COBROWSING_SUCCESS,
      payload: { cobrowsingUser: response.data.cobrowsingUser },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: SUBSCRIBE_COBROWSING_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const unsubscribeCobrowsing = ({userId}) => async (dispatch, getState) => {
  dispatch({
    type: UNSUBSCRIBE_COBROWSING_LOADING,
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    await axios.post('/api/cobrowsing/stop/' + userId, {}, options);

    window.socket.off(ON_COBROWSING_UPDATE);

    dispatch({
      type: UNSUBSCRIBE_COBROWSING_SUCCESS,
      payload: { },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: UNSUBSCRIBE_COBROWSING_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};