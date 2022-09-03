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
  UPDATE_LOBBY_USER_LOADING,
  UPDATE_LOBBY_USER_SUCCESS,
  UPDATE_LOBBY_USER_FAIL,
  DELETE_LOBBY_LOADING,
  DELETE_LOBBY_SUCCESS,
  DELETE_LOBBY_FAIL,
  ON_LOBBY_UPDATE,
  ON_LOBBY_USER_STATUS_UPDATE,
  ON_COBROWSING_STATUS_UPDATE,
  UPDATE_ONBOARDING_STEP,
  LOBBY_UNDO_LOADING,
  LOBBY_UNDO_SUCCESS,
  LOBBY_UNDO_FAIL,
  ON_LOBBY_UNDO
} from '../types';

import ping from 'web-pingjs';
import { getCurrentGameScene } from '../../utils/editorUtils';
import { BACKGROUND_CANVAS_ID, FOREGROUND_CANVAS_ID, PLAYGROUND_CANVAS_ID } from '../../constants';

setInterval(() => {
  window.isFullscreen = !window.screenTop && !window.screenY
}, 3000)

let pingInterval;

export const updateOnboardingStep = (step) => async (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: UPDATE_ONBOARDING_STEP,
    payload: { onboardingStep: step },
  });
};

export const lobbyUndo = (lobbyId) => async (dispatch, getState) => {
  dispatch({
    type: LOBBY_UNDO_LOADING,
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/lobbys/undo/' + lobbyId, {}, options);

    setTimeout(() => {
      dispatch({
        type: LOBBY_UNDO_SUCCESS,
      });
    }, 3000)
  } catch (err) {
    console.error(err)

    dispatch({
      type: LOBBY_UNDO_FAIL,
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
    console.error(err)

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
    console.error(err)

    dispatch({
      type: ADD_LOBBY_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const editLobby = (id, formData) => async (dispatch, getState) => {
  console.trace()
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
  } catch (err) {
    console.error(err)

    dispatch({
      type: EDIT_LOBBY_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const updateLobbyUser = ({userId, lobbyId, user}) => async (dispatch, getState) => {
  dispatch({
    type: UPDATE_LOBBY_USER_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.put(`/api/lobbys/user/${lobbyId}`, {userId, user}, options);

    dispatch({
      type: UPDATE_LOBBY_USER_SUCCESS,
      payload: { lobby: response.data.lobby },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: UPDATE_LOBBY_USER_FAIL,
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
    console.error(err)

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
    console.error(err)

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
    console.error(err)

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
        pingDelta, isFocused, isFullscreen: window.isFullscreen,
      }, userId, lobbyId })
    }, 3000);

    // event is triggered to all users in this lobby when lobby is updated
    window.socket.on(ON_LOBBY_UPDATE, ({lobby}) => {
      dispatch({
        type: ON_LOBBY_UPDATE,
        payload: { lobby },
      });
    });

    window.socket.on(ON_LOBBY_UNDO, () => {
      const state = getState()
      const isHost = userId === state.lobby.lobby.gameHostId

      if(!isHost) return
      
      const scene = getCurrentGameScene(state.game.gameInstance)
      const undoAction = window.undoStack.pop()
      if(undoAction === BACKGROUND_CANVAS_ID) {
        scene.backgroundLayer.undo()
      }
      if(undoAction === PLAYGROUND_CANVAS_ID) {
        scene.playgroundLayer.undo()
      }
      if(undoAction === FOREGROUND_CANVAS_ID) {
        scene.foregrounddLayer.undo()
      }
    })

    // event is triggered to all users in this lobby when lobby is updated
    window.socket.on(ON_LOBBY_USER_STATUS_UPDATE, (payload) => {
      dispatch({
        type: ON_LOBBY_USER_STATUS_UPDATE,
        payload: payload,
      });
    });

    // event that is triggered if cobrowsing has been registered
    window.socket.on(ON_COBROWSING_STATUS_UPDATE, (payload) => {
      dispatch({
        type: ON_COBROWSING_STATUS_UPDATE,
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
    window.socket.off(ON_COBROWSING_STATUS_UPDATE);
    window.socket.off(ON_LOBBY_UNDO)
    window.clearInterval(pingInterval);

    if(history) history.push('/');

    dispatch({
      type: LEAVE_LOBBY_SUCCESS,
      payload: { lobby: response.data.lobby },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: LEAVE_LOBBY_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};