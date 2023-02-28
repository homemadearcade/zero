import axios from 'axios';
import { attachTokenToHeaders } from './authActions';

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
  ON_GAME_ROOM_UPDATE,
  ON_GAME_ROOM_USER_STATUS_UPDATE,
  SEND_GAME_ROOM_MESSAGE_LOADING,
  SEND_GAME_ROOM_MESSAGE_SUCCESS,
  SEND_GAME_ROOM_MESSAGE_FAIL,
  END_GAME_ROOM
} from '../types';

import { clearErrorState } from './errorsActions';
import { PHASER_ERROR } from '../../constants';

export const changeGameState = (gameState, message) => (dispatch, getState) => {
  // saveAllCurrentCanvases()

  const gameRoom = getState().gameRoom.gameRoom

  if(gameRoom.isNetworked) {
    dispatch(editGameRoom(gameRoom.id, {
      gameState,
      gameStateMessage: message
    }))
  } else {
    dispatch({
      updateCobrowsing: true,
      forceCobrowsingUpdate: true,
      type: ON_GAME_ROOM_UPDATE,
      payload: {
        gameRoom: {
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
  
  const gameRoomId = getState().gameRoom.gameRoom?.id

  if(!gameRoomId) return

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/gameRoom/' + gameRoomId + '/message', messageData, options);

    dispatch({
      type: SEND_GAME_ROOM_MESSAGE_SUCCESS,
      payload: { gameRoom: response.data.gameRoom },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: SEND_GAME_ROOM_MESSAGE_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const clearGameRoomMessages = (gameRoomId, messageData) => async (dispatch, getState) => {
  dispatch({
    type: SEND_GAME_ROOM_MESSAGE_LOADING,
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/gameRoom/' + gameRoomId + '/clearMessages', messageData, options);

    dispatch({
      type: SEND_GAME_ROOM_MESSAGE_SUCCESS,
      payload: { gameRoom: response.data.gameRoom },
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
    const response = await axios.post('/api/gameRoom', formData, options);

    dispatch({
      type: ADD_GAME_ROOM_SUCCESS,
      payload: { gameRoom: response.data.gameRoom },
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
    if(!!id) {
      const options = attachTokenToHeaders(getState);
      const response = await axios.put(`/api/gameRoom/${id}`, data, options);
    } else {
      dispatch({
        type: EDIT_GAME_ROOM_SUCCESS,
        payload: { gameRoom: data },
      });
    }

  } catch (err) {
    console.error(err)

    dispatch({
      type: EDIT_GAME_ROOM_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const updateGameRoomPlayer = ({userId, gameRoomId, user}) => async (dispatch, getState) => {
  if(!gameRoomId) return 
  
  dispatch({
    type: UPDATE_GAME_ROOM_USER_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.put(`/api/gameRoom/user/${gameRoomId}`, {userId, user}, options);

    dispatch({
      type: UPDATE_GAME_ROOM_USER_SUCCESS,
      payload: { gameRoom: response.data.gameRoom },
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
    const response = await axios.get(`/api/gameRoom/${id}`, options);

    dispatch({
      type: GET_GAME_ROOM_SUCCESS,
      payload: { gameRoom: response.data.gameRoom },
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
    const response = await axios.delete(`/api/gameRoom/${id}`, options);

    dispatch({
      type: DELETE_GAME_ROOM_SUCCESS,
      payload: { gameRoom: response.data.gameRoom },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: DELETE_GAME_ROOM_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const joinGameRoom = ({ gameRoomId, userId }) => async (dispatch, getState) => {
  dispatch({
    type: JOIN_GAME_ROOM_LOADING,
    payload: { id: gameRoomId },
  });

  try {
    const options = attachTokenToHeaders(getState);

        // event is triggered to all members in this gameRoom when gameRoom is updated
    window.socket.on(ON_GAME_ROOM_UPDATE, ({gameRoom}) => {
      if(gameRoom.isPoweredOn === false && getState().errors.errorStates[PHASER_ERROR].on) {
        dispatch(clearErrorState(PHASER_ERROR))
      }

      dispatch({
        type: ON_GAME_ROOM_UPDATE,
        payload: { gameRoom },
      });
    });

    // event is triggered to all members in this gameRoom when gameRoom is updated
    window.socket.on(ON_GAME_ROOM_USER_STATUS_UPDATE, (payload) => {
      dispatch({
        type: ON_GAME_ROOM_USER_STATUS_UPDATE,
        payload: payload,
      });
    });

    const response = await axios.post(`/api/gameRoom/join/${gameRoomId}`, { userId }, options);

    dispatch({
      type: JOIN_GAME_ROOM_SUCCESS,
      payload: { gameRoom: response.data.gameRoom },
    });
  } catch (err) {
    dispatch({
      type: JOIN_GAME_ROOM_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const leaveGameRoom = ({ gameRoomId, userId }) => async (dispatch, getState) => {
  dispatch({
    type: LEAVE_GAME_ROOM_LOADING,
    payload: { id: gameRoomId },
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post(`/api/gameRoom/leave/${gameRoomId}`, { userId }, options);

    window.socket.off(ON_GAME_ROOM_UPDATE);
    window.socket.off(ON_GAME_ROOM_USER_STATUS_UPDATE);

    dispatch({
      type: LEAVE_GAME_ROOM_SUCCESS,
      payload: { gameRoom: response.data.gameRoom },
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