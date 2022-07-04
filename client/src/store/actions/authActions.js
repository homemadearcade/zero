import axios from 'axios';

import { getMessages } from './messageActions';
import {
  LOGIN_WITH_OAUTH_LOADING,
  LOGIN_WITH_OAUTH_SUCCESS,
  LOGIN_WITH_OAUTH_FAIL,
  LOGOUT_SUCCESS,
  LOGIN_WITH_EMAIL_LOADING,
  LOGIN_WITH_EMAIL_SUCCESS,
  LOGIN_WITH_EMAIL_FAIL,
  AUTHENTICATE_SOCKET_LOADING,
  AUTHENTICATE_SOCKET_SUCCESS,
  AUTHENTICATE_SOCKET_FAIL,
  ME_LOADING,
  ME_SUCCESS,
  ME_FAIL,
  RESEED_DATABASE_LOADING,
  RESEED_DATABASE_SUCCESS,
  RESEED_DATABASE_FAIL,
} from '../types';

export const authenticateSocket = (values) => async (dispatch, getState) => {
  dispatch({ type: AUTHENTICATE_SOCKET_LOADING });
  return new Promise((resolve, reject) => {
    const token = getState().auth.token;

    window.socket.emit('authenticate', { token })

    window.socket.on("disconnect", () => {
      console.log('disconnected'); // undefined
    });

    window.socket.on('authenticate_success', () => {
      window.socket.on("connect", () => {
        console.log('connecting again');
        window.socket.emit('authenticate', { token })
      });

      dispatch({
        type: AUTHENTICATE_SOCKET_SUCCESS,
        payload: {},
      });
      resolve()
    })
    window.socket.on('authenticate_error', (err) => {
      dispatch({
        type: AUTHENTICATE_SOCKET_FAIL,
        payload: { error: err},
      });
      reject()
    })
  })
}

export const loadMe = () => async (dispatch, getState) => {
  dispatch({ type: ME_LOADING });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/users/me', options);

    dispatch(authenticateSocket())

    dispatch({
      type: ME_SUCCESS,
      payload: { me: response.data.me },
    });
  } catch (err) {
    console.error(err)
    dispatch({
      type: ME_FAIL,
      payload: { error: err.response.data.message },
    });
  }
};

export const loginUserWithEmail = (formData, history) => async (dispatch, getState) => {
  dispatch({ type: LOGIN_WITH_EMAIL_LOADING });
  try {
    const response = await axios.post('/auth/login', formData);

    dispatch({
      type: LOGIN_WITH_EMAIL_SUCCESS,
      payload: { token: response.data.token, me: response.data.me },
    });

    dispatch(loadMe());
    // history.push('/');
  } catch (err) {   
    console.error(err) 
    dispatch({
      type: LOGIN_WITH_EMAIL_FAIL,
      payload: { error: err.response.data.message },
    });
  }
};

export const logInUserWithOauth = (token) => async (dispatch, getState) => {
  dispatch({ type: LOGIN_WITH_OAUTH_LOADING });

  try {
    const headers = {
      'Content-Type': 'application/json',
      'x-auth-token': token,
    };

    const response = await axios.get('/api/users/me', { headers });

    dispatch({
      type: LOGIN_WITH_OAUTH_SUCCESS,
      payload: { me: response.data.me, token },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: LOGIN_WITH_OAUTH_FAIL,
      payload: { error: err.response.data.message },
    });
  }
};

// Log user out
export const logOutUser = (history) => async (dispatch) => {
  try {
    deleteAllCookies();
    //just to log user logut on the server
    await axios.get('/auth/logout');

    dispatch({
      type: LOGOUT_SUCCESS,
    });
    if (history) history.push('/');
  } catch (err) {
    console.error(err)

  }
};

export const reseedDatabase = () => async (dispatch, getState) => {
  dispatch({
    type: RESEED_DATABASE_LOADING,
  });
  try {
    await axios.get('/api/users/reseed');

    dispatch({
      type: RESEED_DATABASE_SUCCESS,
    });
    dispatch(logOutUser());
    dispatch(getMessages());
  } catch (err) {
    console.error(err)

    dispatch({
      type: RESEED_DATABASE_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

function deleteAllCookies() {
  var cookies = document.cookie.split(';');

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf('=');
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}

export const attachTokenToHeaders = (getState) => {
  const token = getState().auth.token;

  const config = {
    headers: {
      'Content-type': 'application/json',
    },
  };

  if (token) {
    config.headers['x-auth-token'] = token;
  }

  return config;
};
