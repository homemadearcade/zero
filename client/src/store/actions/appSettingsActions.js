import axios from 'axios';

import {
  GET_APP_SETTINGS_LOADING,
  GET_APP_SETTINGS_SUCCESS,
  GET_APP_SETTINGS_FAIL,
  EDIT_APP_SETTINGS_LOADING,
  EDIT_APP_SETTINGS_SUCCESS,
  EDIT_APP_SETTINGS_FAIL,
} from '../types';
import { attachTokenToHeaders } from './user/authActions';

export const getAppSettings = () => async (dispatch, getState) => {
  dispatch({
    type: GET_APP_SETTINGS_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/appSettings/', options);

    dispatch({
      type: GET_APP_SETTINGS_SUCCESS,
      payload: { appSettings: response.data.appSettings },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_APP_SETTINGS_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const editAppSettings = (appSettings) => async (dispatch, getState) => {
  dispatch({
    type: EDIT_APP_SETTINGS_LOADING,
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.put(`/api/appSettings/`,appSettings, options);

    dispatch({
      type: EDIT_APP_SETTINGS_SUCCESS,
      payload: { appSettings: response.data.appSettings },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: EDIT_APP_SETTINGS_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};