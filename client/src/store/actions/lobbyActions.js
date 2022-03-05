import axios from 'axios';
import { attachTokenToHeaders } from './authActions';
import _ from 'lodash';

import {
  ASSIGN_LOBBY_ROLE_LOADING,
  ASSIGN_LOBBY_ROLE_SUCCESS,
  ASSIGN_LOBBY_ROLE_FAIL,
  ADD_LOBBY_LOADING,
  ADD_LOBBY_SUCCESS,
  ADD_LOBBY_FAIL,
  LEAVE_LOBBY_LOADING,
  LEAVE_LOBBY_SUCCESS,
  LEAVE_LOBBY_FAIL,
  JOIN_LOBBY_LOADING,
  JOIN_LOBBY_SUCCESS,
  JOIN_LOBBY_FAIL,
  GET_LOBBY_LOADING,
  GET_LOBBY_SUCCESS,
  GET_LOBBY_FAIL,
  EDIT_LOBBY_LOADING,
  EDIT_LOBBY_SUCCESS,
  EDIT_LOBBY_FAIL,
  DELETE_LOBBY_LOADING,
  DELETE_LOBBY_SUCCESS,
  DELETE_LOBBY_FAIL,
  START_LOBBY_COBROWSING_SUCCESS,
  START_LOBBY_COBROWSING_FAIL,
  END_LOBBY_COBROWSING_SUCCESS,
  END_LOBBY_COBROWSING_FAIL,
  SUBSCRIBE_LOBBY_COBROWSING_LOADING,
  SUBSCRIBE_LOBBY_COBROWSING_SUCCESS,
  SUBSCRIBE_LOBBY_COBROWSING_FAIL,
  UNSUBSCRIBE_LOBBY_COBROWSING_LOADING,
  UNSUBSCRIBE_LOBBY_COBROWSING_SUCCESS,
  UNSUBSCRIBE_LOBBY_COBROWSING_FAIL,
  ON_LOBBY_UPDATE,
  ON_LOBBY_USER_STATUS_UPDATE,
  ON_LOBBY_COBROWSING_SUBSCRIBED,
  ON_LOBBY_COBROWSING_UPDATE,
  ON_LOBBY_COBROWSING_STATUS_UPDATE,
} from '../types';

import ping from 'web-pingjs';

let pingInterval;
let mouseLobbyId;
let mouseUserId;

const sendMouseState = _.debounce((e) =>  {
  window.socket.emit(ON_LOBBY_COBROWSING_STATUS_UPDATE, {
    lobbyId: mouseLobbyId,
    userId: mouseUserId,
    cobrowsingMouse: {
      xPercent: e.clientX/window.innerWidth,
      pageY: e.pageY,
      lastPing: Date.now(),
    }
  })
}, 7)

export const startLobbyCobrowsing = ({lobbyId}) => async (dispatch, getState) => {
  try {
    const user = getState().auth.me

    // event that is triggered if another user has subscribed to your cobrowsingu, sends the initial state out
    window.socket.on(ON_LOBBY_COBROWSING_SUBSCRIBED, () => {
      window.socket.emit(ON_LOBBY_COBROWSING_UPDATE, {cobrowsingState: getState().lobby.cobrowsingState})
    });

    window.socket.emit(ON_LOBBY_COBROWSING_UPDATE, {cobrowsingState: getState().lobby.cobrowsingState})

    mouseLobbyId = lobbyId;
    mouseUserId = user.id;
  
    // this event will send admins your mouse state to let them know you can be browsed
    window.addEventListener('mousemove', sendMouseState)

    dispatch({
      type: START_LOBBY_COBROWSING_SUCCESS,
      payload: { cobrowsingUser: user }
    });
  } catch (err) {
    dispatch({
      type: START_LOBBY_COBROWSING_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const endLobbyCobrowsing = () => async (dispatch, getState) => {
  try {
    window.socket.off(ON_LOBBY_COBROWSING_SUBSCRIBED);
    window.removeEventListener('mousemove', sendMouseState);
    dispatch({
      type: END_LOBBY_COBROWSING_SUCCESS,
      payload: {}
    });
  } catch (err) {
    dispatch({
      type: END_LOBBY_COBROWSING_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const subscribeLobbyCobrowsing = ({lobbyId, userId}) => async (dispatch, getState) => {
  dispatch({
    type: SUBSCRIBE_LOBBY_COBROWSING_LOADING,
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/lobbys/cobrowse/' + lobbyId, { userId }, options);

    // event that is triggered if cobrowsing has been registered
    window.socket.on(ON_LOBBY_COBROWSING_UPDATE, ({cobrowsingState}) => {
      dispatch({
        type: ON_LOBBY_COBROWSING_UPDATE,
        payload: { cobrowsingState },
      });
    });

    dispatch({
      type: SUBSCRIBE_LOBBY_COBROWSING_SUCCESS,
      payload: { cobrowsingUser: response.data.cobrowsingUser },
    });
  } catch (err) {
    dispatch({
      type: SUBSCRIBE_LOBBY_COBROWSING_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const unsubscribeLobbyCobrowsing = ({lobbyId, userId}) => async (dispatch, getState) => {
  dispatch({
    type: UNSUBSCRIBE_LOBBY_COBROWSING_LOADING,
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    await axios.post('/api/lobbys/uncobrowse/' + lobbyId, {userId}, options);

    window.socket.off(ON_LOBBY_COBROWSING_UPDATE);

    dispatch({
      type: UNSUBSCRIBE_LOBBY_COBROWSING_SUCCESS,
      payload: { },
    });
  } catch (err) {
    dispatch({
      type: UNSUBSCRIBE_LOBBY_COBROWSING_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const assignLobbyRole = (lobbyId, formData) => async (dispatch, getState) => {
  dispatch({
    type: ASSIGN_LOBBY_ROLE_LOADING,
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/lobbys/assign/' + lobbyId, formData, options);

    dispatch({
      type: ASSIGN_LOBBY_ROLE_SUCCESS,
      payload: { lobby: response.data.lobby },
    });
  } catch (err) {
    dispatch({
      type: ASSIGN_LOBBY_ROLE_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};


export const addLobby = (formData) => async (dispatch, getState) => {
  dispatch({
    type: ADD_LOBBY_LOADING,
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/lobbys', formData, options);

    dispatch({
      type: ADD_LOBBY_SUCCESS,
      payload: { lobby: response.data.lobby },
    });
  } catch (err) {
    dispatch({
      type: ADD_LOBBY_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};


export const editLobby = (id, formData, history) => async (dispatch, getState) => {
  dispatch({
    type: EDIT_LOBBY_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.put(`/api/lobbys/${id}`, formData, options);

    dispatch({
      type: EDIT_LOBBY_SUCCESS,
      payload: { lobby: response.data.lobby },
    });

    history.push(`/${response.data.lobby.id}`);
  } catch (err) {
    dispatch({
      type: EDIT_LOBBY_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const getLobbyById = (id, history) => async (dispatch, getState) => {
  dispatch({
    type: GET_LOBBY_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get(`/api/lobbys/${id}`, options);

    dispatch({
      type: GET_LOBBY_SUCCESS,
      payload: { lobby: response.data.lobby },
    });
  } catch (err) {
    if (err?.response.status === 404) {
      history.push('/notfound');
    }
    dispatch({
      type: GET_LOBBY_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const getLobbyByEmail = (email) => async (dispatch, getState) => {
  dispatch({
    type: GET_LOBBY_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get(`/api/lobbys/byEmail/${email}`, options);

    dispatch({
      type: GET_LOBBY_SUCCESS,
      payload: { lobby: response.data.lobby },
    });
  } catch (err) {
    dispatch({
      type: GET_LOBBY_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const deleteLobby = (id) => async (dispatch, getState) => {
  dispatch({
    type: DELETE_LOBBY_LOADING,
    payload: { id },
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.delete(`/api/lobbys/${id}`, options);

    dispatch({
      type: DELETE_LOBBY_SUCCESS,
      payload: { lobby: response.data.lobby },
    });
  } catch (err) {
    dispatch({
      type: DELETE_LOBBY_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const joinLobby = ({ lobbyId, userId }) => async (dispatch, getState) => {
  dispatch({
    type: JOIN_LOBBY_LOADING,
    payload: { id: lobbyId },
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post(`/api/lobbys/join/${lobbyId}`, { userId }, options);

    let isFocused = true
    window.onfocus = () => {
      isFocused = true
    }
    window.onblur = () => {
      isFocused = false
    }
    
    pingInterval = window.setInterval(async () => {
      const pingDelta = await ping(window.location.origin)
      window.socket.emit(ON_LOBBY_USER_STATUS_UPDATE, { status: {
        pingDelta, isFocused, 
      }, userId, lobbyId })
    }, 3000);

    // event is triggered to all users in this lobby when lobby is updated
    window.socket.on(ON_LOBBY_UPDATE, ({lobby}) => {
      dispatch({
        type: ON_LOBBY_UPDATE,
        payload: { lobby },
      });
    });

    // event is triggered to all users in this lobby when lobby is updated
    window.socket.on(ON_LOBBY_USER_STATUS_UPDATE, (payload) => {
      dispatch({
        type: ON_LOBBY_USER_STATUS_UPDATE,
        payload: payload,
      });
    });

    // event that is triggered if cobrowsing has been registered
    window.socket.on(ON_LOBBY_COBROWSING_STATUS_UPDATE, (payload) => {
      dispatch({
        type: ON_LOBBY_COBROWSING_STATUS_UPDATE,
        payload: payload,
      });
    });

    dispatch({
      type: JOIN_LOBBY_SUCCESS,
      payload: { lobby: response.data.lobby },
    });
  } catch (err) {
    dispatch({
      type: JOIN_LOBBY_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const leaveLobby = ({ lobbyId, userId }, history) => async (dispatch, getState) => {
  dispatch({
    type: LEAVE_LOBBY_LOADING,
    payload: { id: lobbyId },
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post(`/api/lobbys/leave/${lobbyId}`, { userId }, options);

    window.socket.off(ON_LOBBY_UPDATE);
    window.socket.off(ON_LOBBY_USER_STATUS_UPDATE);
    window.socket.off(ON_LOBBY_COBROWSING_STATUS_UPDATE);
    window.clearInterval(pingInterval);

    if(history) history.push('/');

    dispatch({
      type: LEAVE_LOBBY_SUCCESS,
      payload: { lobby: response.data.lobby },
    });
  } catch (err) {
    dispatch({
      type: LEAVE_LOBBY_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};