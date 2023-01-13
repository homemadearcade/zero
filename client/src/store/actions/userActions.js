import axios from 'axios';

import { attachTokenToHeaders } from './authActions';
import {
  GET_USER_LOADING,
  GET_USER_SUCCESS,
  GET_USER_FAIL,
  EDIT_USER_LOADING,
  EDIT_USER_SUCCESS,
  EDIT_USER_FAIL,
  DELETE_USER_LOADING,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,
  OPEN_INTERFACE_TREE,
  CLOSE_INTERFACE_TREE,
} from '../types';

import { logOutUser, loadMe } from './authActions';

export const editUser = (id, data) => async (dispatch, getState) => {
  dispatch({
    type: EDIT_USER_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.put(`/api/users/${id}`, data, options);

    console.log(response)

    dispatch({
      type: EDIT_USER_SUCCESS,
      payload: { user: response.data.user },
    });
    // edited him self, reload me
    if (getState().auth.me?.id === response.data.user.id) dispatch(loadMe());

    return response
  } catch (err) {
    console.error(err)

    dispatch({
      type: EDIT_USER_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const openInterfaceTree = (userId) => (dispatch, getState) => {
  dispatch({
    type: OPEN_INTERFACE_TREE,
    payload: {
      userId
    }
  });
}

export const closeInterfaceTree = () => (dispatch, getState) => {
  dispatch({
    type: CLOSE_INTERFACE_TREE,
    payload: {}
  });
}

export const getUserByUsername = (username, history) => async (dispatch, getState) => {
  dispatch({
    type: GET_USER_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get(`/api/users/${username}`, options);

    dispatch({
      type: GET_USER_SUCCESS,
      payload: { user: response.data.user },
    });
  } catch (err) {
    console.error(err)

    if (err?.response.status === 404) {
      history.push('/notfound');
    }
    dispatch({
      type: GET_USER_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const getUserById = (id) => async (dispatch, getState) => {
  dispatch({
    type: GET_USER_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get(`/api/users/byId/${id}`, options);

    dispatch({
      type: GET_USER_SUCCESS,
      payload: { user: response.data.user },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_USER_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};


export const getUserByEmail = (email) => async (dispatch, getState) => {
  dispatch({
    type: GET_USER_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get(`/api/users/byEmail/${email}`, options);

    dispatch({
      type: GET_USER_SUCCESS,
      payload: { user: response.data.user },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_USER_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const deleteUser = (id, history) => async (dispatch, getState) => {
  dispatch({
    type: DELETE_USER_LOADING,
    payload: { id },
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.delete(`/api/users/${id}`, options);

    //logout only if he deleted himself
    if (getState().auth.me.id === response.data.user.id) {
      dispatch(logOutUser(id, history));
    }
    history.push('/users');
    dispatch({
      type: DELETE_USER_SUCCESS,
      payload: { message: response.data.user },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: DELETE_USER_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};
