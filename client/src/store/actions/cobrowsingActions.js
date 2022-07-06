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
  LOBBY_STATE_UPDATE,
  VIDEO_STATE_UPDATE
} from '../types';

let mouseLobbyId;
let mouseUserId;
const sendMouseState = _.debounce((e) =>  {
  const viewWidth = (window.innerHeight + (window.innerHeight * .4) - 4);
  const viewPadding = (window.innerWidth - viewWidth)/2
  const xPercent = (e.clientX - viewPadding)/viewWidth

  window.socket.emit(ON_COBROWSING_STATUS_UPDATE, {
    lobbyId: mouseLobbyId,
    userId: mouseUserId,
    cobrowsingMouse: {
      xPercent,
      // xPercent: e.clientX/window.innerWidth,
      yPercent: e.clientY/window.innerHeight,
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      lastPing: Date.now(),
    }
  })
}, 7)

export const startCobrowsing = () => async (dispatch, getState) => {
  try {
    const user = getState().auth.me

    // event that is triggered if another user has subscribed to your cobrowsingu, sends the initial state out
    window.socket.on(ON_COBROWSING_SUBSCRIBED, () => {
      dispatch(updateCobrowsing(getState().cobrowsing.remoteState))
    });

    mouseUserId = user.id;
    mouseLobbyId = getState().lobby.lobby.id

    // this event will send admins your mouse state to let them know you can be browsed
    window.addEventListener('mousemove', sendMouseState)

    dispatch({
      type: START_COBROWSING_SUCCESS,
      payload: { 
        cobrowsingUser: user, 
        remoteState: {
          video: getState().video.videoState,
          lobby: getState().lobby.lobbyState,
          editor: getState().editor.editorState
        }}
    });

    dispatch(updateCobrowsing(getState().cobrowsing.remoteState))
  } catch (err) {
    console.error(err)

    dispatch({
      type: START_COBROWSING_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const endCobrowsing = () => async (dispatch, getState) => {
  try {
    window.socket.off(ON_COBROWSING_SUBSCRIBED);
    window.removeEventListener('mousemove', sendMouseState);
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

export const updateVideoCobrowsing = (cobrowsingVideoState) => async (dispatch, getState) => {
  const remoteState = getState().cobrowsing.remoteState
  remoteState.video = cobrowsingVideoState
  dispatch({
    type: VIDEO_STATE_UPDATE,
    payload: { videoState: cobrowsingVideoState },
  });
  dispatch(updateCobrowsing(remoteState))
};

export const updateLobbyCobrowsing = (cobrowsingLobbyState) => async (dispatch, getState) => {
  const remoteState = getState().cobrowsing.remoteState
  remoteState.lobby = cobrowsingLobbyState
  dispatch({
    type: LOBBY_STATE_UPDATE,
    payload: { lobbyState: cobrowsingLobbyState },
  });
  dispatch(updateCobrowsing(remoteState))
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