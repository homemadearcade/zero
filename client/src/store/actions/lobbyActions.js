import axios from 'axios';

import { attachTokenToHeaders } from './authActions';
import {
  GET_LOBBY_LOADING,
  GET_LOBBY_SUCCESS,
  GET_LOBBY_FAIL,
  EDIT_LOBBY_LOADING,
  EDIT_LOBBY_SUCCESS,
  EDIT_LOBBY_FAIL,
  DELETE_LOBBY_LOADING,
  DELETE_LOBBY_SUCCESS,
  DELETE_LOBBY_FAIL,
} from '../types';

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

// export const getUserByEmail = (email) => async (dispatch, getState) => {
//   dispatch({
//     type: GET_LOBBY_LOADING,
//   });
//   try {
//     const options = attachTokenToHeaders(getState);
//     const response = await axios.get(`/api/lobbys/email/${email}`, options);

//     dispatch({
//       type: GET_LOBBY_SUCCESS,
//       payload: { lobby: response.data.lobby },
//     });
//   } catch (err) {
//     dispatch({
//       type: GET_LOBBY_FAIL,
//       payload: { error: err?.response?.data.message || err.message },
//     });
//   }
// };

export const deleteLobby = (id, history) => async (dispatch, getState) => {
  dispatch({
    type: DELETE_LOBBY_LOADING,
    payload: { id },
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.delete(`/api/lobbys/${id}`, options);

    // //logout only if he deleted himself
    // if (getState().auth.me.id === response.data.lobby.id) {
    //   dispatch(logOutUser(id, history));
    // }
    history.push('/lobbys');
    dispatch({
      type: DELETE_LOBBY_SUCCESS,
      payload: { message: response.data.lobby },
    });
  } catch (err) {
    dispatch({
      type: DELETE_LOBBY_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};
