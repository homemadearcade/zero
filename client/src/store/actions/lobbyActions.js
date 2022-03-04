import axios from 'axios';
import { attachTokenToHeaders } from './authActions';

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
  REGISTER_LOBBY_COBROWSING_LOADING,
  REGISTER_LOBBY_COBROWSING_SUCCESS,
  REGISTER_LOBBY_COBROWSING_FAIL,
  UNREGISTER_LOBBY_COBROWSING_LOADING,
  UNREGISTER_LOBBY_COBROWSING_SUCCESS,
  UNREGISTER_LOBBY_COBROWSING_FAIL,
  ON_LOBBY_UPDATE,
  ON_LOBBY_COBROWSING_REGISTERED,
  ON_LOBBY_COBROWSING_UPDATE,
  ON_LOBBY_COBROWSING_MOUSE_UPDATE
} from '../types';

function sendMouseState(e) {
  window.socket.emit(ON_LOBBY_COBROWSING_MOUSE_UPDATE, {
    x: e.clientX,
    y: e.clientY,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight
  })
}

export const registerLobbyCobrowsing = (lobbyId, {userId}) => async (dispatch, getState) => {
  dispatch({
    type: REGISTER_LOBBY_COBROWSING_LOADING,
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/lobbys/cobrowse/' + lobbyId, {userId}, options);

    dispatch({
      type: REGISTER_LOBBY_COBROWSING_SUCCESS,
      payload: { lobby: response.data.lobby },
    });
  } catch (err) {
    dispatch({
      type: REGISTER_LOBBY_COBROWSING_FAIL,
      payload: { error: err?.response?.data.lobby || err.lobby },
    });
  }
};

export const unregisterLobbyCobrowsing = (lobbyId, {userId}) => async (dispatch, getState) => {
  dispatch({
    type: UNREGISTER_LOBBY_COBROWSING_LOADING,
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.delete('/api/lobbys/cobrowse/' + lobbyId, {userId}, options);

    dispatch({
      type: UNREGISTER_LOBBY_COBROWSING_SUCCESS,
      payload: { lobby: response.data.lobby },
    });
  } catch (err) {
    dispatch({
      type: UNREGISTER_LOBBY_COBROWSING_FAIL,
      payload: { error: err?.response?.data.lobby || err.lobby },
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
      payload: { error: err?.response?.data.lobby || err.lobby },
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
      payload: { error: err?.response?.data.lobby || err.lobby },
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

export const joinLobby = (id, { userId }) => async (dispatch, getState) => {
  dispatch({
    type: JOIN_LOBBY_LOADING,
    payload: { id },
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post(`/api/lobbys/join/${id}`, { userId }, options);

    // event is triggered to all users in this lobby when lobby is updated
    window.socket.on(ON_LOBBY_UPDATE, ({lobby}) => {
      dispatch({
        type: ON_LOBBY_UPDATE,
        payload: { lobby },
      });
    });

    // event that is triggered if cobrowsing has been registered
    window.socket.on(ON_LOBBY_COBROWSING_UPDATE, ({cobrowsingState}) => {
      dispatch({
        type: ON_LOBBY_COBROWSING_UPDATE,
        payload: { cobrowsingState },
      });
    });

    // event that is triggered if cobrowsing has been registered
    window.socket.on(ON_LOBBY_COBROWSING_MOUSE_UPDATE, ({cobrowsingMouse}) => {
      dispatch({
        type: ON_LOBBY_COBROWSING_MOUSE_UPDATE,
        payload: { cobrowsingMouse },
      });
    });

    // event that is triggered if another user has registered cobrowsing targeted at you, sends the initial state out
    window.socket.on(ON_LOBBY_COBROWSING_REGISTERED, ({cobrowsingState}) => {
      window.socket.emit(ON_LOBBY_COBROWSING_UPDATE, { userId, cobrowsingState})
    });

    // if someone has registered cobrowsing on you then this event will send them your mouse state
    window.addEventListener('mousemove', sendMouseState)

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

export const leaveLobby = (id, { userId }, history) => async (dispatch, getState) => {
  dispatch({
    type: LEAVE_LOBBY_LOADING,
    payload: { id },
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post(`/api/lobbys/leave/${id}`, { userId }, options);

    window.socket.off(ON_LOBBY_UPDATE);
    window.socket.off(ON_LOBBY_COBROWSING_UPDATE);
    window.socket.off(ON_LOBBY_COBROWSING_REGISTERED);
    window.socket.off(ON_LOBBY_COBROWSING_MOUSE_UPDATE)
    window.removeEventListener('mousemove', sendMouseState)

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