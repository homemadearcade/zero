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
  ADD_USER_SPEED_TEST_LOADING,
  ADD_USER_SPEED_TEST_SUCCESS,
  ADD_USER_SPEED_TEST_FAIL,
} from '../../types';

import { logOutUser, loadMe } from './authActions';
import { testInternetSpeed } from '../../../utils/networkUtils';
import { getDeviceData } from '../../../utils/webPageUtils';

export const addUserSpeedTest = () => async (dispatch, getState) => {
  dispatch({
    type: ADD_USER_SPEED_TEST_LOADING,
  });

  try {
    const [downloadSpeed, uploadSpeed] = await testInternetSpeed()

    const { osName, browserName, userAgent } = getDeviceData()

    const speedTest = {
      uploadSpeed,
      downloadSpeed,
      date: Date.now(),
      url: window.location.pathname,
      osName,
      browserName,
      userAgent,
    }

    const me = getState().auth.me
    const options = attachTokenToHeaders(getState);
    const response = await axios.put(`/api/users/${me.id}/speedTest`, speedTest, options);

    dispatch({
      type: ADD_USER_SPEED_TEST_SUCCESS,
      payload: {
        speedTest
      }
    })

    return speedTest
  } catch(e) {
    console.error(e)
    dispatch({
      type: ADD_USER_SPEED_TEST_FAIL
    })
  }


}

export const editUser = (id, data) => async (dispatch, getState) => {
  dispatch({
    type: EDIT_USER_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.put(`/api/users/${id}`, data, options);

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

export const openInterfaceTree = (userMongoId) => (dispatch, getState) => {
  dispatch({
    type: OPEN_INTERFACE_TREE,
    payload: {
      userMongoId
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

export const getUserById = (userId) => async (dispatch, getState) => {
  dispatch({
    type: GET_USER_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get(`/api/users/userId/${userId}`, options);

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


export const getUserByMongoId = (userMongoId) => async (dispatch, getState) => {
  dispatch({
    type: GET_USER_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get(`/api/users/byId/${userMongoId}`, options);

    dispatch({
      type: GET_USER_SUCCESS,
      payload: { user: response.data.user },
    });

    return response
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
