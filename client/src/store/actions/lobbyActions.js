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
  // GET_LOBBY_LOADING,
  // GET_LOBBY_SUCCESS,
  // GET_LOBBY_FAIL,
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
  LOBBY_UNDO_LOADING,
  LOBBY_UNDO_SUCCESS,
  LOBBY_UNDO_FAIL,
  ON_LOBBY_UNDO,
  SEND_LOBBY_MESSAGE_LOADING,
  SEND_LOBBY_MESSAGE_SUCCESS,
  SEND_LOBBY_MESSAGE_FAIL,
  TOGGLE_LOBBY_DASHBOARD
} from '../types';

import ping from 'web-pingjs';
import { getCurrentGameScene } from '../../utils/editorUtils';
import { BACKGROUND_LAYER_CANVAS_ID, IMAGE_CANVAS_MODAL_CANVAS_ID, FOREGROUND_LAYER_CANVAS_ID, PLAYGROUND_LAYER_CANVAS_ID } from '../../game/constants';
import { editGameModel } from './gameModelActions';
import store from '..';
import { setRecentlyFocused } from './webPageActions';

let pingInterval;

const recentlyFocusedDelta = 3000

export function onCanvasImageModalUndo() {
  const state = store.getState()
  const isHost = state.auth.me.id === state.gameRoom.gameRoom.hostUserId
  
  if(!window.imageCanvasUndoStack.length) return

  const undoAction = window.imageCanvasUndoStack.pop()

  if(!isHost && state.lobby.id) return

  getCurrentGameScene(state.webPage.imageCanvasGameInstance).backgroundCanvasLayer.undo()
}

export function onInstanceUndo() {
  const state = store.getState()
  const isHost = state.auth.me.id === state.gameRoom.gameRoom.hostUserId
  
  if(!window.instanceUndoStack.length) return

  const undoAction = window.instanceUndoStack.pop()
  window.nextGameModelUpdateIsUndo = !!undoAction.data

  if(!isHost && state.lobby.id) return
  
  const scene = getCurrentGameScene(state.webPage.gameInstance)
  if(undoAction === BACKGROUND_LAYER_CANVAS_ID) {
    scene.backgroundCanvasLayer.undo()
  } else if(undoAction === PLAYGROUND_LAYER_CANVAS_ID) {
    scene.playgroundCanvasLayer.undo()
  } else if(undoAction === FOREGROUND_LAYER_CANVAS_ID) {
    scene.foregroundCanvasLayer.undo()
  } else if(undoAction === IMAGE_CANVAS_MODAL_CANVAS_ID) {
    console.log('BASE CANVAS oddly got into undo there...')
  } else { 
    if(undoAction.entityInstanceId) {
      store.dispatch(editGameModel({
        stages: {
          [undoAction.entityInstanceStageId]: {
            entityInstance: {
            [undoAction.entityInstanceId]: undoAction.data
            }
          }
        }
      }))
    } else {
      console.error('undo action', undoAction)
    }
  }
}

export const lobbyUndo = () => async (dispatch, getState) => {
  dispatch({
    type: LOBBY_UNDO_LOADING,
  });
  
  const state = store.getState()
  const lobbyId = state.lobby.lobby.id
  
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

export const sendLobbyMessage = (messageData) => async (dispatch, getState) => {
  dispatch({
    type: SEND_LOBBY_MESSAGE_LOADING,
  });
  
  const lobbyId = getState().lobby.lobby?.id

  if(!lobbyId) return

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/lobbys/' + lobbyId + '/message', messageData, options);

    dispatch({
      type: SEND_LOBBY_MESSAGE_SUCCESS,
      payload: { lobby: response.data.lobby },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: SEND_LOBBY_MESSAGE_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const clearLobbyMessages = (lobbyId, messageData) => async (dispatch, getState) => {
  dispatch({
    type: SEND_LOBBY_MESSAGE_LOADING,
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/lobbys/' + lobbyId + '/clearMessages', messageData, options);

    dispatch({
      type: SEND_LOBBY_MESSAGE_SUCCESS,
      payload: { lobby: response.data.lobby },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: SEND_LOBBY_MESSAGE_FAIL,
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

export const toggleLobbyDashboard = (value) => (dispatch, getState) => {
  dispatch({
    type: TOGGLE_LOBBY_DASHBOARD,
    payload: {
      value
    }
  })
};

export const editLobby = (id, data) => async (dispatch, getState) => {
  dispatch({
    type: EDIT_LOBBY_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);

    const response = await axios.put(`/api/lobbys/${id}`, data, options);

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

// export const getLobbyById = (id, history) => async (dispatch, getState) => {
//   dispatch({
//     type: GET_LOBBY_LOADING,
//   });
//   try {
//     const options = attachTokenToHeaders(getState);
//     const response = await axios.get(`/api/lobbys/${id}`, options);

//     dispatch({
//       type: GET_LOBBY_SUCCESS,
//       payload: { lobby: response.data.lobby },
//     });
//   } catch (err) {
//     console.error(err)

//     if (err?.response.status === 404) {
//       history.push('/notfound');
//     }
//     dispatch({
//       type: GET_LOBBY_FAIL,
//       payload: { error: err?.response?.data.message || err.message },
//     });
//   }
// };

// export const getLobbyByEmail = (email) => async (dispatch, getState) => {
//   dispatch({
//     type: GET_LOBBY_LOADING,
//   });
//   try {
//     const options = attachTokenToHeaders(getState);
//     const response = await axios.get(`/api/lobbys/byEmail/${email}`, options);

//     dispatch({
//       type: GET_LOBBY_SUCCESS,
//       payload: { lobby: response.data.lobby },
//     });
//   } catch (err) {
//     console.error(err)

//     dispatch({
//       type: GET_LOBBY_FAIL,
//       payload: { error: err?.response?.data.message || err.message },
//     });
//   }
// };

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

    window.lastIsFocused = true
    pingInterval = window.setInterval(async () => {
      const pingDelta = await ping(window.location.origin)

      window.isFocused= !document.hidden
      if(!window.lastIsFocused && !window.isFocused) {
        dispatch(setRecentlyFocused(true))
      }
      if(window.lastIsFocused === false && window.isFocused) {
        setTimeout(() => {
          dispatch(setRecentlyFocused(false))
        }, recentlyFocusedDelta)
      }
      window.lastIsFocused = window.isFocused

      window.socket.emit(ON_LOBBY_USER_STATUS_UPDATE, { status: {
        lastSeen: Date.now(),
        pingDelta, isFocused: !document.hidden, isFullscreen: document.fullscreenElement,
      }, userId, lobbyId })
    }, 3000);

    // event is triggered to all members in this lobby when lobby is updated
    window.socket.on(ON_LOBBY_UPDATE, ({lobby}) => {
      if(lobby.id === lobbyId) {
        dispatch({
          type: ON_LOBBY_UPDATE,
          payload: { lobby },
        });
      }
    });

    window.socket.on(ON_LOBBY_UNDO, onInstanceUndo)

    // event is triggered to all members in this lobby when lobby is updated
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