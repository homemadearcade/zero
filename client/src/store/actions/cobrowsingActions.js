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

let mouseLobbyId;
let mouseUserId;
const sendMouseState = _.debounce((e) =>  {
  window.socket.emit(ON_COBROWSING_STATUS_UPDATE, {
    lobbyId: mouseLobbyId,
    userId: mouseUserId,
    cobrowsingMouse: {
      xPercent: e.clientX/window.innerWidth,
      pageY: e.pageY,
      lastPing: Date.now(),
    }
  })
}, 7)

export const startCobrowsing = () => async (dispatch, getState) => {
  try {
    const user = getState().auth.me

    // event that is triggered if another user has subscribed to your cobrowsingu, sends the initial state out
    window.socket.on(ON_COBROWSING_SUBSCRIBED, () => {
      dispatch(updateCobrowsing(getState().cobrowsing.cobrowsingState))
    });

    mouseUserId = user.id;
    mouseLobbyId = getState().lobby.lobby.id

    // this event will send admins your mouse state to let them know you can be browsed
    window.addEventListener('mousemove', sendMouseState)

    dispatch({
      type: START_COBROWSING_SUCCESS,
      payload: { cobrowsingUser: user }
    });

    dispatch(updateCobrowsing(getState().cobrowsing.cobrowsingState))

  } catch (err) {
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
    dispatch({
      type: END_COBROWSING_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const updateCobrowsing = (cobrowsingState) => async (dispatch, getState) => {
  try {
    const userId = getState().cobrowsing.cobrowsingUser.id
    
    const options = attachTokenToHeaders(getState);
    await axios.put('/api/cobrowsing/' + userId, { cobrowsingState }, options);

    dispatch({
      type: ON_COBROWSING_UPDATE,
      payload: { cobrowsingState },
    });
  } catch (err) {
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
    window.socket.on(ON_COBROWSING_UPDATE, ({userId, cobrowsingState}) => {
      console.log('cobrowsing update for ', userId)
      dispatch({
        type: ON_COBROWSING_UPDATE,
        payload: { cobrowsingState },
      });
    });

    dispatch({
      type: SUBSCRIBE_COBROWSING_SUCCESS,
      payload: { cobrowsingUser: response.data.cobrowsingUser },
    });
  } catch (err) {
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
    dispatch({
      type: UNSUBSCRIBE_COBROWSING_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};