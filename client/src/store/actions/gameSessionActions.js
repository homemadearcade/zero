import axios from 'axios';
import { attachTokenToHeaders } from './authActions';

import {
  ADD_GAME_SESSION_LOADING,
  ADD_GAME_SESSION_SUCCESS,
  ADD_GAME_SESSION_FAIL,
  LEAVE_GAME_SESSION_LOADING,
  LEAVE_GAME_SESSION_SUCCESS,
  LEAVE_GAME_SESSION_FAIL,
  JOIN_GAME_SESSION_LOADING,
  JOIN_GAME_SESSION_SUCCESS,
  JOIN_GAME_SESSION_FAIL,
  GET_GAME_SESSION_LOADING,
  GET_GAME_SESSION_SUCCESS,
  GET_GAME_SESSION_FAIL,
  EDIT_GAME_SESSION_LOADING,
  EDIT_GAME_SESSION_SUCCESS,
  EDIT_GAME_SESSION_FAIL,
  UPDATE_GAME_SESSION_USER_LOADING,
  UPDATE_GAME_SESSION_USER_SUCCESS,
  UPDATE_GAME_SESSION_USER_FAIL,
  DELETE_GAME_SESSION_LOADING,
  DELETE_GAME_SESSION_SUCCESS,
  DELETE_GAME_SESSION_FAIL,
  ON_GAME_SESSION_UPDATE,
  ON_GAME_SESSION_USER_STATUS_UPDATE,
  SEND_GAME_SESSION_MESSAGE_LOADING,
  SEND_GAME_SESSION_MESSAGE_SUCCESS,
  SEND_GAME_SESSION_MESSAGE_FAIL
} from '../types';

import { PHASER_ERROR } from '../../lobby/constants';
import { clearErrorState } from './errorsActions';

export const sendGameSessionMessage = (messageData) => async (dispatch, getState) => {
  dispatch({
    type: SEND_GAME_SESSION_MESSAGE_LOADING,
  });
  
  const lobbyId = getState().lobby.lobby?.id

  if(!lobbyId) return

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/gameSession/' + lobbyId + '/message', messageData, options);

    dispatch({
      type: SEND_GAME_SESSION_MESSAGE_SUCCESS,
      payload: { lobby: response.data.lobby },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: SEND_GAME_SESSION_MESSAGE_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const clearGameSessionMessages = (lobbyId, messageData) => async (dispatch, getState) => {
  dispatch({
    type: SEND_GAME_SESSION_MESSAGE_LOADING,
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/gameSession/' + lobbyId + '/clearMessages', messageData, options);

    dispatch({
      type: SEND_GAME_SESSION_MESSAGE_SUCCESS,
      payload: { lobby: response.data.lobby },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: SEND_GAME_SESSION_MESSAGE_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};


export const addGameSession = (formData) => async (dispatch, getState) => {
  dispatch({
    type: ADD_GAME_SESSION_LOADING,
  });
  

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/gameSession', formData, options);

    dispatch({
      type: ADD_GAME_SESSION_SUCCESS,
      payload: { lobby: response.data.lobby },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: ADD_GAME_SESSION_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const editGameSession = (id, data) => async (dispatch, getState) => {
  dispatch({
    type: EDIT_GAME_SESSION_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);

    const response = await axios.put(`/api/gameSession/${id}`, data, options);

    dispatch({
      type: EDIT_GAME_SESSION_SUCCESS,
      payload: { lobby: response.data.lobby },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: EDIT_GAME_SESSION_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const updateGameSessionPlayer = ({userId, lobbyId, user}) => async (dispatch, getState) => {
  dispatch({
    type: UPDATE_GAME_SESSION_USER_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.put(`/api/gameSession/user/${lobbyId}`, {userId, user}, options);

    dispatch({
      type: UPDATE_GAME_SESSION_USER_SUCCESS,
      payload: { lobby: response.data.lobby },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: UPDATE_GAME_SESSION_USER_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};


export const getGameSessionById = (id, history) => async (dispatch, getState) => {
  dispatch({
    type: GET_GAME_SESSION_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get(`/api/gameSession/${id}`, options);

    dispatch({
      type: GET_GAME_SESSION_SUCCESS,
      payload: { lobby: response.data.lobby },
    });
  } catch (err) {
    console.error(err)
    dispatch({
      type: GET_GAME_SESSION_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};


export const deleteGameSession = (id) => async (dispatch, getState) => {
  dispatch({
    type: DELETE_GAME_SESSION_LOADING,
    payload: { id },
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.delete(`/api/gameSession/${id}`, options);

    dispatch({
      type: DELETE_GAME_SESSION_SUCCESS,
      payload: { lobby: response.data.lobby },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: DELETE_GAME_SESSION_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const joinGameSession = ({ lobbyId, userId }) => async (dispatch, getState) => {
  dispatch({
    type: JOIN_GAME_SESSION_LOADING,
    payload: { id: lobbyId },
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post(`/api/gameSession/join/${lobbyId}`, { userId }, options);

    // event is triggered to all users in this lobby when lobby is updated
    window.socket.on(ON_GAME_SESSION_UPDATE, ({gameSession}) => {
      if(gameSession.isPoweredOn === false && getState().errors.errorStates[PHASER_ERROR].on) {
        dispatch(clearErrorState(PHASER_ERROR))
      }
      dispatch({
        type: ON_GAME_SESSION_UPDATE,
        payload: { gameSession },
      });
    });

    // event is triggered to all users in this lobby when lobby is updated
    window.socket.on(ON_GAME_SESSION_USER_STATUS_UPDATE, (payload) => {
      dispatch({
        type: ON_GAME_SESSION_USER_STATUS_UPDATE,
        payload: payload,
      });
    });

    dispatch({
      type: JOIN_GAME_SESSION_SUCCESS,
      payload: { lobby: response.data.lobby },
    });
  } catch (err) {
    dispatch({
      type: JOIN_GAME_SESSION_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const leaveGameSession = ({ lobbyId, userId }) => async (dispatch, getState) => {
  dispatch({
    type: LEAVE_GAME_SESSION_LOADING,
    payload: { id: lobbyId },
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post(`/api/gameSession/leave/${lobbyId}`, { userId }, options);

    window.socket.off(ON_GAME_SESSION_UPDATE);
    window.socket.off(ON_GAME_SESSION_USER_STATUS_UPDATE);

    dispatch({
      type: LEAVE_GAME_SESSION_SUCCESS,
      payload: { lobby: response.data.lobby },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: LEAVE_GAME_SESSION_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};