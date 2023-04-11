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
  ON_AUTHENTICATE_SOCKET_SUCCESS,
  ON_AUTHENTICATE_SOCKET_FAIL,
  ON_SOCKET_DISCONNECT,
  ON_SOCKET_CONNECT,
  SET_REDIRECT,
  CLEAR_REDIRECT,
  SOCKET_DISCONNECTED,
} from '../../types';

export const authenticateSocket = (values) => async (dispatch, getState) => {
  dispatch({ type: AUTHENTICATE_SOCKET_LOADING });

  return new Promise((resolve, reject) => {
    const token = getState().auth.token;

    window.socket.connect()

    window.socket.on(ON_SOCKET_CONNECT, () => {
      console.log('authenticating socket');
      window.socket.emit('authenticate', { token })
    })

    window.socket.on(ON_SOCKET_DISCONNECT, () => {
      console.log('disconnected socket'); 
    })

    window.socket.on(ON_AUTHENTICATE_SOCKET_SUCCESS, () => {
      console.log('socket auth successful')
      dispatch({
        type: AUTHENTICATE_SOCKET_SUCCESS,
        payload: {},
      });
      resolve()
    })

    window.socket.on(ON_AUTHENTICATE_SOCKET_FAIL, (err) => {
      console.log('failed to auth socket')
      dispatch({
        type: AUTHENTICATE_SOCKET_FAIL,
        payload: { error: err},
      })
      reject()
    })

    window.socket.on("disconnect", (reason) => {
      dispatch({
        type: SOCKET_DISCONNECTED,
      })

      console.log('socket disconnected, disconnect reason', reason)
      if (reason === "io server disconnect") {
        // the disconnection was initiated by the server, you need to reconnect manually
        window.socket.connect();
      }

      // else the socket will automatically try to reconnect
    });

    window.socket.io.on("reconnect_attempt", () => {
      console.log('attempting to reconnect')
      // ...
    });

    window.socket.io.on("reconnect", () => {
      console.log('reconnected')
      // ...
    });

    window.socket.on("connect_error", () => {
      console.log('connect error')
      // setTimeout(() => {
      //   socket.connect();
      // }, 1000);
    });
  })
}

export const loadMe = () => async (dispatch, getState) => {
  dispatch({ type: ME_LOADING });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/users/me', options);

    dispatch(authenticateSocket())

    const me = response.data.me
    // if(!me.preferences) me.preferences = {}
    // if(!me.preferences.unlockableInterfaceIds) me.preferences.unlockableInterfaceIds = {}

    dispatch({
      type: ME_SUCCESS,
      payload: { me },
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
    history.push(window.LocalStorageSession.getItem("auth").redirect || '/');
    dispatch(clearRedirect())
  } catch (err) {   
    console.error(err) 
    dispatch({
      type: LOGIN_WITH_EMAIL_FAIL,
      payload: { error: err.response.data.message },
    });
  }
};

export const logInUserWithOauth = (token, history) => async (dispatch, getState) => {
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

    dispatch(authenticateSocket())
    history.push(window.LocalStorageSession.getItem("auth").redirect || '/');
    dispatch(clearRedirect())
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


export const setRedirect = (redirect) => (dispatch, getState) => {
  dispatch({
    type: SET_REDIRECT,
    payload: { redirect },
  });
}

export const clearRedirect = () => (dispatch, getState) => {
  dispatch({
    type: CLEAR_REDIRECT,
  });
}