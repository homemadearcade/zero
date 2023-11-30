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
  UPDATE_LOBBY_MEMBER_LOADING,
  UPDATE_LOBBY_MEMBER_SUCCESS,
  UPDATE_LOBBY_MEMBER_FAIL,
  DELETE_LOBBY_LOADING,
  DELETE_LOBBY_SUCCESS,
  DELETE_LOBBY_FAIL,
  ON_LOBBY_INSTANCE_UPDATE,
  ON_LOBBY_INSTANCE_MEMBER_STATUS_UPDATE,
  ON_COBROWSING_STATUS_UPDATE,
  SEND_LOBBY_MESSAGE_LOADING,
  SEND_LOBBY_MESSAGE_SUCCESS,
  SEND_LOBBY_MESSAGE_FAIL,
  TOGGLE_LOBBY_DASHBOARD,
  ENTER_LOBBY_LINE_SUCCESS,
  ENTER_LOBBY_LINE_FAIL,
  ENTER_LOBBY_LINE_LOADING,
  LEAVE_LOBBY_LINE_LOADING,
  LEAVE_LOBBY_LINE_SUCCESS,
  LEAVE_LOBBY_LINE_FAIL,
  ADD_MEMBER_STORAGE_LOADING,
  ADD_MEMBER_STORAGE_SUCCESS,
  ADD_MEMBER_STORAGE_FAIL
} from '../../types';

import ping from 'web-pingjs';

import { setRecentlyFocused } from '../webPageActions';
import { defaultAudienceRoleId } from '../../../constants';
import { getUserRoleIdFromLobbyInstance } from '../../../utils';
import { getExperienceModelByMongoId } from './experienceModelActions';

let pingInterval;

const recentlyFocusedDelta = 3000

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
    type: UPDATE_LOBBY_MEMBER_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.put(`/api/lobbyInstance/member/${lobbyInstanceMongoId}`, {userMongoId, member}, options);

    dispatch({
      type: UPDATE_LOBBY_MEMBER_SUCCESS,
      payload: { lobbyInstance: response.data.lobbyInstance },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: UPDATE_LOBBY_MEMBER_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};


export const addLobbyMemberStorage = ({userMongoId, lobbyInstanceMongoId, memberStorage}) => async (dispatch, getState) => {
  dispatch({
    type: ADD_MEMBER_STORAGE_LOADING,
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.put(`/api/lobbyInstance/member_storage/${lobbyInstanceMongoId}`, {userMongoId, memberStorage}, options);

    dispatch({
      type: ADD_MEMBER_STORAGE_SUCCESS,
      payload: { lobbyInstance: response.data.lobbyInstance },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: ADD_MEMBER_STORAGE_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const enterLobbyInstanceLine = (lobbyInstanceMongoId, userMongoId) => async (dispatch, getState) => {
  dispatch({
    type: ENTER_LOBBY_LINE_LOADING,
    payload: {},
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post(`/api/lobbyInstance/enter_line/${lobbyInstanceMongoId}`, { userMongoId }, options);

    dispatch({
      type: ENTER_LOBBY_LINE_SUCCESS,
      payload: { lobbyInstance: response.data.lobbyInstance },
    });
  } catch (err) {
    dispatch({
      type: ENTER_LOBBY_LINE_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const leaveLobbyInstanceLine = (lobbyInstanceMongoId, userMongoId) => async (dispatch, getState) => {
  dispatch({
    type: LEAVE_LOBBY_LINE_LOADING
    ,
    payload: {},
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post(`/api/lobbyInstance/leave_line/${lobbyInstanceMongoId}`, { userMongoId }, options);

    dispatch({
      type: LEAVE_LOBBY_LINE_SUCCESS,
      payload: { lobbyInstance: response.data.lobbyInstance },
    });
  } catch (err) {
    dispatch({
      type: LEAVE_LOBBY_LINE_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const getLobbyByMongoId = (id, history) => async (dispatch, getState) => {
  dispatch({
    type: GET_LOBBY_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get(`/api/lobbyInstance/${id}`, options);

    dispatch({
      type: GET_LOBBY_SUCCESS,
      payload: { lobbyInstance: response.data.lobbyInstance },
    });

    return response.data.lobbyInstance
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_LOBBY_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

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

// export const getLobbyInstanceByIdFromLibrary = (lobbyInstanceId) => async (dispatch, getState) => {
//   dispatch({
//     type: GET_LOBBY_LOADING,
//   });

//   try {
//     const options = attachTokenToHeaders(getState);
//     const response = await axios.get('/api/lobbyInstance/lobbyInstanceId/' + lobbyInstanceId, options);

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


export const joinLobbyById = ({ lobbyInstanceId, userMongoId }) => async (dispatch, getState) => {

}

export const joinLobbyByMongoId = ({ lobbyInstanceMongoId}) => async (dispatch, getState) => {
  dispatch({
    type: JOIN_LOBBY_LOADING,
    payload: {},
  });

  const me = getState().auth.me

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post(`/api/lobbyInstance/join/${lobbyInstanceMongoId}`, { userMongoId: me.id }, options);

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

      window.socket.emit(ON_LOBBY_INSTANCE_MEMBER_STATUS_UPDATE, { status: {
        lastSeen: Date.now(),
        pingDelta, isFocused: !document.hidden, isFullscreen: document.fullscreenElement,
      }, userMongoId: me.id, lobbyInstanceMongoId })
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


    // event is triggered to all members in this lobbyInstance when lobbyInstance is updated
    window.socket.on(ON_LOBBY_INSTANCE_MEMBER_STATUS_UPDATE, (payload) => {
      dispatch({
        type: ON_LOBBY_INSTANCE_MEMBER_STATUS_UPDATE,
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
    let myRoleId = getUserRoleIdFromLobbyInstance(lobbyInstance, auth.me.id)
    if(!myRoleId) myRoleId = defaultAudienceRoleId

    await dispatch(getExperienceModelByMongoId(lobbyInstance.experienceModelMongoId))

    console.log('joined lobbyInstance', lobbyInstance)

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
    window.socket.off(ON_LOBBY_INSTANCE_MEMBER_STATUS_UPDATE);
    window.socket.off(ON_COBROWSING_STATUS_UPDATE);
    window.clearInterval(pingInterval);

    // if(history) history.push('/');

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