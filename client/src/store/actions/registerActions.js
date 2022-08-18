import axios from 'axios';

import {
  REGISTER_WITH_EMAIL_LOADING,
  REGISTER_WITH_EMAIL_SUCCESS,
  REGISTER_WITH_EMAIL_FAIL,
  LOGIN_WITH_EMAIL_SUCCESS
} from '../types';

import { clearRedirect, loadMe } from './authActions';

export const registerUserWithEmail = (formData, history) => async (dispatch, getState) => {
  dispatch({ type: REGISTER_WITH_EMAIL_LOADING });
  try {
    const response = await axios.post('/auth/register', formData);

    dispatch({
      type: REGISTER_WITH_EMAIL_SUCCESS,
    });

    dispatch({
      type: LOGIN_WITH_EMAIL_SUCCESS,
      payload: { token: response.data.token, me: response.data.me },
    });

    dispatch(loadMe());
    history.push(getState().auth.redirect || '/');
    dispatch(clearRedirect())
  } catch (err) {
    console.error(err)

    dispatch({
      type: REGISTER_WITH_EMAIL_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};
