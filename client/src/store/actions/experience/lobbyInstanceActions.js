import axios from 'axios';
import { attachTokenToHeaders } from '../user/authActions';

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
  ON_LOBBY_INSTANCE_UPDATE,
  ON_LOBBY_INSTANCE_USER_STATUS_UPDATE,
  ON_COBROWSING_STATUS_UPDATE,
  LOBBY_UNDO_LOADING,
  LOBBY_UNDO_SUCCESS,
  LOBBY_UNDO_FAIL,
  ON_LOBBY_INSTANCE_UNDO,
  SEND_LOBBY_MESSAGE_LOADING,
  SEND_LOBBY_MESSAGE_SUCCESS,
  SEND_LOBBY_MESSAGE_FAIL,
  TOGGLE_LOBBY_DASHBOARD
} from '../../types';

import ping from 'web-pingjs';
import { getCurrentGameScene } from '../../../utils/editorUtils';
import { BACKGROUND_LAYER_ID, CANVAS_IMAGE_LAYER_ID, FOREGROUND_LAYER_ID, PLAYGROUND_LAYER_ID } from '../../../game/constants';
import { editGameModel } from '../game/gameModelActions';
import store from '../..';
import { setRecentlyFocused } from '../webPageActions';
import { defaultAudienceRoleId } from '../../../constants';

let pingInterval;

const recentlyFocusedDelta = 3000

export function onCanvasImageDialogUndo() {
  const state = store.getState()
  const isHost = state.auth.me.id === state.gameRoomInstance.gameRoomInstance.hostUserMongoId
  
  if(!window.imageCanvasUndoStack.length) return

  const undoAction = window.imageCanvasUndoStack.pop()

  if(!isHost && state.lobbyInstance.id) return

  getCurrentGameScene(state.webPage.imageCanvasGameInstance).backgroundCanvasLayer.undo()
}

export function onInstanceUndo() {
  const state = store.getState()
  const isHost = state.auth.me.id === state.gameRoomInstance.gameRoomInstance.hostUserMongoId
  
  if(!window.instanceUndoStack.length) return

  const undoAction = window.instanceUndoStack.pop()
  window.nextGameModelUpdateIsUndo = !!undoAction.data

  if(!isHost && state.lobbyInstance.id) return
  
  const scene = getCurrentGameScene(state.webPage.gameInstance)
  if(undoAction === BACKGROUND_LAYER_ID) {
    scene.backgroundCanvasLayer.undo()
  } else if(undoAction === PLAYGROUND_LAYER_ID) {
    scene.playgroundCanvasLayer.undo()
  } else if(undoAction === FOREGROUND_LAYER_ID) {
    scene.foregroundCanvasLayer.undo()
  } else if(undoAction === CANVAS_IMAGE_LAYER_ID) {
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

export const lobbyInstanceUndo = () => async (dispatch, getState) => {
  dispatch({
    type: LOBBY_UNDO_LOADING,
  });
  
  const state = store.getState()
  const lobbyInstanceMongoId = state.lobbyInstance.lobbyInstance.id
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/lobbyInstance/undo/' + lobbyInstanceMongoId, {}, options);

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

export const assignLobbyRole = (lobbyInstanceMongoId, formData) => async (dispatch, getState) => {
  dispatch({
    type: ASSIGN_LOBBY_ROLE_LOADING,
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/lobbyInstance/assign/' + lobbyInstanceMongoId, formData, options);

    dispatch({
      type: ASSIGN_LOBBY_ROLE_SUCCESS,
      payload: { lobbyInstance: response.data.lobbyInstance },
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
  
  const lobbyInstanceMongoId = getState().lobbyInstance.lobbyInstance?.id

  if(!lobbyInstanceMongoId) return

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/lobbyInstance/' + lobbyInstanceMongoId + '/message', messageData, options);

    dispatch({
      type: SEND_LOBBY_MESSAGE_SUCCESS,
      payload: { lobbyInstance: response.data.lobbyInstance },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: SEND_LOBBY_MESSAGE_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const clearLobbyMessages = (lobbyInstanceMongoId, messageData) => async (dispatch, getState) => {
  dispatch({
    type: SEND_LOBBY_MESSAGE_LOADING,
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/lobbyInstance/' + lobbyInstanceMongoId + '/clearMessages', messageData, options);

    dispatch({
      type: SEND_LOBBY_MESSAGE_SUCCESS,
      payload: { lobbyInstance: response.data.lobbyInstance },
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
    const response = await axios.post('/api/lobbyInstance', formData, options);

    dispatch({
      type: ADD_LOBBY_SUCCESS,
      payload: { lobbyInstance: response.data.lobbyInstance },
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

    const response = await axios.put(`/api/lobbyInstance/${id}`, data, options);

    dispatch({
      type: EDIT_LOBBY_SUCCESS,
      payload: { lobbyInstance: response.data.lobbyInstance },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: EDIT_LOBBY_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const updateLobbyMember = ({userMongoId, lobbyInstanceMongoId, member}) => async (dispatch, getState) => {
  dispatch({
    type: UPDATE_LOBBY_USER_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.put(`/api/lobbyInstance/user/${lobbyInstanceMongoId}`, {userMongoId, member}, options);

    dispatch({
      type: UPDATE_LOBBY_USER_SUCCESS,
      payload: { lobbyInstance: response.data.lobbyInstance },
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
//     const response = await axios.get(`/api/lobbyInstance/${id}`, options);

//     dispatch({
//       type: GET_LOBBY_SUCCESS,
//       payload: { lobbyInstance: response.data.lobbyInstance },
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
//     const response = await axios.get(`/api/lobbyInstance/byEmail/${email}`, options);

//     dispatch({
//       type: GET_LOBBY_SUCCESS,
//       payload: { lobbyInstance: response.data.lobbyInstance },
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
    const response = await axios.delete(`/api/lobbyInstance/${id}`, options);

    dispatch({
      type: DELETE_LOBBY_SUCCESS,
      payload: { lobbyInstance: response.data.lobbyInstance },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: DELETE_LOBBY_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const getLobbyInstanceByIdFromLibrary = (lobbyInstanceId) => async (dispatch, getState) => {
  dispatch({
    type: GET_LOBBY_LOADING,
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/lobbyInstance/lobbyInstanceId/' + lobbyInstanceId, options);

    dispatch({
      type: GET_LOBBY_SUCCESS,
      payload: { lobbyInstance: response.data.lobbyInstance },
    });
    
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_LOBBY_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};


export const joinLobbyById = ({ lobbyInstanceId, userMongoId }) => async (dispatch, getState) => {

}

export const joinLobbyByMongoId = ({ lobbyInstanceMongoId, userMongoId }) => async (dispatch, getState) => {
  dispatch({
    type: JOIN_LOBBY_LOADING,
    payload: {},
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post(`/api/lobbyInstance/join/${lobbyInstanceMongoId}`, { userMongoId }, options);

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

      window.socket.emit(ON_LOBBY_INSTANCE_USER_STATUS_UPDATE, { status: {
        lastSeen: Date.now(),
        pingDelta, isFocused: !document.hidden, isFullscreen: document.fullscreenElement,
      }, userMongoId, lobbyInstanceMongoId })
    }, 3000);

    // event is triggered to all members in this lobbyInstance when lobbyInstance is updated
    window.socket.on(ON_LOBBY_INSTANCE_UPDATE, ({lobbyInstance}) => {
      if(lobbyInstance.id === lobbyInstanceMongoId) {
        dispatch({
          type: ON_LOBBY_INSTANCE_UPDATE,
          payload: { lobbyInstance },
        });
      }
    });

    window.socket.on(ON_LOBBY_INSTANCE_UNDO, onInstanceUndo)

    // event is triggered to all members in this lobbyInstance when lobbyInstance is updated
    window.socket.on(ON_LOBBY_INSTANCE_USER_STATUS_UPDATE, (payload) => {
      dispatch({
        type: ON_LOBBY_INSTANCE_USER_STATUS_UPDATE,
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

    const lobbyInstance = response.data.lobbyInstance
    const auth = getState().auth
    let myRoleId = defaultAudienceRoleId
    Object.keys(lobbyInstance.roleIdToUserMongoIds).forEach(roleId => {
      if(lobbyInstance.roleIdToUserMongoIds[roleId].indexOf(auth.me.id) >= 0) {
        myRoleId = roleId
      }
    })

    dispatch({
      type: JOIN_LOBBY_SUCCESS,
      payload: { lobbyInstance: response.data.lobbyInstance, myRoleId },
    });
  } catch (err) {
    dispatch({
      type: JOIN_LOBBY_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

function leaveLobby() {

}

export const leaveLobbyById = ({ lobbyInstanceId, userMongoId }, history) => async (dispatch, getState) => {
  dispatch({
    type: LEAVE_LOBBY_LOADING,
    payload: { },
  });

  try {


    // dispatch({
    //   type: LEAVE_LOBBY_SUCCESS,
    //   payload: { lobbyInstance: response.data.lobbyInstance },
    // });
  } catch (err) {
    console.error(err)

    dispatch({
      type: LEAVE_LOBBY_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const leaveLobbyByMongoId = ({ lobbyInstanceMongoId, userMongoId }, history) => async (dispatch, getState) => {
  dispatch({
    type: LEAVE_LOBBY_LOADING,
    payload: { },
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post(`/api/lobbyInstance/leave/${lobbyInstanceMongoId}`, { userMongoId }, options);

    window.socket.off(ON_LOBBY_INSTANCE_UPDATE);
    window.socket.off(ON_LOBBY_INSTANCE_USER_STATUS_UPDATE);
    window.socket.off(ON_COBROWSING_STATUS_UPDATE);
    window.socket.off(ON_LOBBY_INSTANCE_UNDO)
    window.clearInterval(pingInterval);

    if(history) history.push('/');

    dispatch({
      type: LEAVE_LOBBY_SUCCESS,
      payload: { lobbyInstance: response.data.lobbyInstance },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: LEAVE_LOBBY_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};