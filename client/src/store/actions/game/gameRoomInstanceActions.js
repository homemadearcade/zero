import axios from 'axios';
import { attachTokenToHeaders } from '../user/authActions';

import {
  ADD_GAME_ROOM_LOADING,
  ADD_GAME_ROOM_SUCCESS,
  ADD_GAME_ROOM_FAIL,
  LEAVE_GAME_ROOM_LOADING,
  LEAVE_GAME_ROOM_SUCCESS,
  LEAVE_GAME_ROOM_FAIL,
  JOIN_GAME_ROOM_LOADING,
  JOIN_GAME_ROOM_SUCCESS,
  JOIN_GAME_ROOM_FAIL,
  GET_GAME_ROOM_LOADING,
  GET_GAME_ROOM_SUCCESS,
  GET_GAME_ROOM_FAIL,
  EDIT_GAME_ROOM_LOADING,
  EDIT_GAME_ROOM_SUCCESS,
  EDIT_GAME_ROOM_FAIL,
  UPDATE_GAME_ROOM_USER_LOADING,
  UPDATE_GAME_ROOM_USER_SUCCESS,
  UPDATE_GAME_ROOM_USER_FAIL,
  DELETE_GAME_ROOM_LOADING,
  DELETE_GAME_ROOM_SUCCESS,
  DELETE_GAME_ROOM_FAIL,
  ON_GAME_ROOM_INSTANCE_UPDATE,
  ON_GAME_ROOM_INSTANCE_USER_STATUS_UPDATE,
  SEND_GAME_ROOM_MESSAGE_LOADING,
  SEND_GAME_ROOM_MESSAGE_SUCCESS,
  SEND_GAME_ROOM_MESSAGE_FAIL,
  END_GAME_ROOM,
  GAME_INSTANCE_UNDO_LOADING,
  GAME_INSTANCE_UNDO_SUCCESS,
  GAME_INSTANCE_UNDO_FAIL,
  ON_GAME_ROOM_INSTANCE_UNDO
} from '../../types';

import { clearErrorState } from '../errorsActions';
import { PHASER_ERROR } from '../../../constants';
import store from '../..';
import { getCurrentGameScene } from '../../../utils';
import { editGameModel } from './gameModelActions';

export function onCanvasImageDialogUndo() {
  const state = store.getState()
  const isHost = state.auth.me.id === state.gameRoomInstance.gameRoomInstance.hostUserMongoId
  
  if(!window.imageCanvasUndoStack.length) return

  const undoAction = window.imageCanvasUndoStack.pop()

  if(!isHost && state.gameRoomInstance.gameRoomInstance.id) return

  getCurrentGameScene(state.webPage.imageCanvasGameInstance).backgroundCanvasLayer.undo()
}

export function onInstanceUndo() {
  const state = store.getState()
  const isHost = state.auth.me.id === state.gameRoomInstance.gameRoomInstance.hostUserMongoId
  
  if(!window.instanceUndoStack.length) return

  const undoAction = window.instanceUndoStack.pop()
  window.nextGameModelUpdateIsUndo = !!undoAction.data

  if(!isHost && state.lobbyInstance.id) return
  
  // const scene = getCurrentGameScene(state.webPage.gameInstance)
  // if(undoAction === BACKGROUND_LAYER_) {
  //   scene.backgroundCanvasLayer.undo()
  // } else if(undoAction === PLAYGROUND_LAYER_ID) {
  //   scene.playgroundCanvasLayer.undo()
  // } else if(undoAction === FOREGROUND_LAYER_ID) {
  //   scene.foregroundCanvasLayer.undo()
  // } else if(undoAction === CANVAS_IMAGE_LAYER_ID) {
  //   console.log('BASE CANVAS oddly got into undo there...')
  // } else { 
  //   if(undoAction.entityInstanceId) {
  //     store.dispatch(editGameModel({
  //       stages: {
  //         [undoAction.entityInstanceStageId]: {
  //           entityInstance: {
  //           [undoAction.entityInstanceId]: undoAction.data
  //           }
  //         }
  //       }
  //     }))
  //   } else {
  //     console.error('undo action', undoAction)
  //   }
  // }
}

export const gameRoomInstanceUndo = () => async (dispatch, getState) => {
  dispatch({
    type: GAME_INSTANCE_UNDO_LOADING,
  });
  
  const state = store.getState()
  const gameRoomInstanceMongoId = state.gameRoomInstance.gameRoomInstance.id
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/gameInstance/undo/' + gameRoomInstanceMongoId, {}, options);

    setTimeout(() => {
      dispatch({
        type: GAME_INSTANCE_UNDO_SUCCESS,
      });
    }, 3000)
  } catch (err) {
    console.error(err)

    dispatch({
      type: GAME_INSTANCE_UNDO_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const changeGameState = (gameState, message) => (dispatch, getState) => {
  // saveAllCurrentCanvases()

  const gameRoomInstance = getState().gameRoomInstance.gameRoomInstance

  if(gameRoomInstance.isOnlineMultiplayer) {
    dispatch(editGameRoom(gameRoomInstance.id, {
      gameState,
      gameStateMessage: message
    }))
  } else {
    dispatch({
      type: ON_GAME_ROOM_INSTANCE_UPDATE,
      payload: {
        gameRoomInstance: {
          gameState,
          gameStateMessage: message
        }
      }
    })
  }
};

export const sendGameRoomMessage = (messageData) => async (dispatch, getState) => {
  dispatch({
    type: SEND_GAME_ROOM_MESSAGE_LOADING,
  });
  
  const gameRoomInstanceMongoId = getState().gameRoomInstance.gameRoomInstance?.id

  if(!gameRoomInstanceMongoId) return

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/gameRoomInstance/' + gameRoomInstanceMongoId + '/message', messageData, options);

    dispatch({
      type: SEND_GAME_ROOM_MESSAGE_SUCCESS,
      payload: { gameRoomInstance: response.data.gameRoomInstance },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: SEND_GAME_ROOM_MESSAGE_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const clearGameRoomMessages = (gameRoomInstanceMongoId, messageData) => async (dispatch, getState) => {
  dispatch({
    type: SEND_GAME_ROOM_MESSAGE_LOADING,
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/gameRoomInstance/' + gameRoomInstanceMongoId + '/clearMessages', messageData, options);

    dispatch({
      type: SEND_GAME_ROOM_MESSAGE_SUCCESS,
      payload: { gameRoomInstance: response.data.gameRoomInstance },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: SEND_GAME_ROOM_MESSAGE_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};


export const addGameRoom = (formData) => async (dispatch, getState) => {
  dispatch({
    type: ADD_GAME_ROOM_LOADING,
  });
  

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/gameRoomInstance', formData, options);

    dispatch({
      type: ADD_GAME_ROOM_SUCCESS,
      payload: { gameRoomInstance: response.data.gameRoomInstance },
    });


    return response
  } catch (err) {
    console.error(err)

    dispatch({
      type: ADD_GAME_ROOM_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const editGameRoom = (id, data) => async (dispatch, getState) => {
  dispatch({
    type: EDIT_GAME_ROOM_LOADING,
  });
  try {

    const gameRoomInstance = getState().gameRoomInstance.gameRoomInstance

    if(gameRoomInstance.isOnlineMultiplayer) {
      const options = attachTokenToHeaders(getState);
      const response = await axios.put(`/api/gameRoomInstance/${id}`, data, options);
    } else {
      // dispatch({
      //   type: EDIT_GAME_ROOM_SUCCESS,
      //   payload: { gameRoomInstance: data },
      // });
      dispatch({
        type: ON_GAME_ROOM_INSTANCE_UPDATE,
        payload: {
          gameRoomInstance: {...gameRoomInstance, ...data}
        }
      })
    }


  } catch (err) {
    console.error(err)

    dispatch({
      type: EDIT_GAME_ROOM_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const updateGameRoomPlayer = ({userMongoId, gameRoomInstanceMongoId, user}) => async (dispatch, getState) => {
  if(!gameRoomInstanceMongoId) return 

  dispatch({
    type: UPDATE_GAME_ROOM_USER_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.put(`/api/gameRoomInstance/user/${gameRoomInstanceMongoId}`, {userMongoId, user}, options);

    dispatch({
      type: UPDATE_GAME_ROOM_USER_SUCCESS,
      payload: { gameRoomInstance: response.data.gameRoomInstance },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: UPDATE_GAME_ROOM_USER_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};


export const getGameRoomById = (id, history) => async (dispatch, getState) => {
  dispatch({
    type: GET_GAME_ROOM_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get(`/api/gameRoomInstance/${id}`, options);

    dispatch({
      type: GET_GAME_ROOM_SUCCESS,
      payload: { gameRoomInstance: response.data.gameRoomInstance },
    });
  } catch (err) {
    console.error(err)
    dispatch({
      type: GET_GAME_ROOM_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};


export const deleteGameRoom = (id) => async (dispatch, getState) => {
  dispatch({
    type: DELETE_GAME_ROOM_LOADING,
    payload: { id },
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.delete(`/api/gameRoomInstance/${id}`, options);

    dispatch({
      type: DELETE_GAME_ROOM_SUCCESS,
      payload: { gameRoomInstance: response.data.gameRoomInstance },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: DELETE_GAME_ROOM_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const joinGameRoom = ({ gameRoomInstanceMongoId, userMongoId }) => async (dispatch, getState) => {
  dispatch({
    type: JOIN_GAME_ROOM_LOADING,
    payload: { id: gameRoomInstanceMongoId },
  });

  try {
    const options = attachTokenToHeaders(getState);

        // event is triggered to all members in this gameRoomInstance when gameRoomInstance is updated
    window.socket.on(ON_GAME_ROOM_INSTANCE_UPDATE, ({gameRoomInstance}) => {
      if(gameRoomInstance.isPoweredOn === false && getState().errors.errorStates[PHASER_ERROR].on) {
        dispatch(clearErrorState(PHASER_ERROR))
      }

      dispatch({
        type: ON_GAME_ROOM_INSTANCE_UPDATE,
        payload: { gameRoomInstance },
      });
    });

    window.socket.on(ON_GAME_ROOM_INSTANCE_UNDO, onInstanceUndo)

    // event is triggered to all members in this gameRoomInstance when gameRoomInstance is updated
    window.socket.on(ON_GAME_ROOM_INSTANCE_USER_STATUS_UPDATE, (payload) => {
      dispatch({
        type: ON_GAME_ROOM_INSTANCE_USER_STATUS_UPDATE,
        payload: payload,
      });
    });

    const response = await axios.post(`/api/gameRoomInstance/join/${gameRoomInstanceMongoId}`, { userMongoId }, options);

    console.log('this game instance loaded', response.data.gameRoomInstance)

    dispatch({
      type: JOIN_GAME_ROOM_SUCCESS,
      payload: { gameRoomInstance: response.data.gameRoomInstance },
    });
  } catch (err) {
    dispatch({
      type: JOIN_GAME_ROOM_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const leaveGameRoom = ({ gameRoomInstanceMongoId, userMongoId }) => async (dispatch, getState) => {
  dispatch({
    type: LEAVE_GAME_ROOM_LOADING,
    payload: { id: gameRoomInstanceMongoId },
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post(`/api/gameRoomInstance/leave/${gameRoomInstanceMongoId}`, { userMongoId }, options);

    window.socket.off(ON_GAME_ROOM_INSTANCE_UPDATE);
    window.socket.off(ON_GAME_ROOM_INSTANCE_USER_STATUS_UPDATE);
    window.socket.off(ON_GAME_ROOM_INSTANCE_UNDO)

    dispatch({
      type: LEAVE_GAME_ROOM_SUCCESS,
      payload: { gameRoomInstance: response.data.gameRoomInstance },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: LEAVE_GAME_ROOM_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const endGameRoom = () => async (dispatch, getState) => {
  dispatch({
    type: END_GAME_ROOM,
  });
};