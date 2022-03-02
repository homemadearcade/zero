import axios from 'axios';
import { attachTokenToHeaders } from './authActions';

import {
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
  ON_LOBBY_UPDATE,
} from '../types';


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

export const joinLobby = (id) => async (dispatch, getState) => {
  dispatch({
    type: JOIN_LOBBY_LOADING,
    payload: { id },
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get(`/api/lobbys/join/${id}`, options);

    window.socket.on(ON_LOBBY_UPDATE, ({lobby}) => {
      dispatch({
        type: ON_LOBBY_UPDATE,
        payload: { lobby },
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

export const leaveLobby = (id, history) => async (dispatch, getState) => {
  dispatch({
    type: LEAVE_LOBBY_LOADING,
    payload: { id },
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get(`/api/lobbys/leave/${id}`, options);

    window.socket.off(ON_LOBBY_UPDATE);

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