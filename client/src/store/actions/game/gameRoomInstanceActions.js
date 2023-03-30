import axios from 'axios';
import { attachTokenToHeaders } from '../auth/authActions';

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
  END_GAME_ROOM
} from '../../types';

import { clearErrorState } from '../errorsActions';
import { PHASER_ERROR } from '../../../constants';

export const changeGameState = (gameState, message) => (dispatch, getState) => {
  // saveAllCurrentCanvases()

  const gameRoomInstance = getState().gameRoomInstance.gameRoomInstance

  if(gameRoomInstance.isNetworked) {
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

    if(gameRoomInstance.isNetworked) {
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

    // event is triggered to all members in this gameRoomInstance when gameRoomInstance is updated
    window.socket.on(ON_GAME_ROOM_INSTANCE_USER_STATUS_UPDATE, (payload) => {
      dispatch({
        type: ON_GAME_ROOM_INSTANCE_USER_STATUS_UPDATE,
        payload: payload,
      });
    });

    const response = await axios.post(`/api/gameRoomInstance/join/${gameRoomInstanceMongoId}`, { userMongoId }, options);

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