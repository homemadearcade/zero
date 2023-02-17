import axios from 'axios';

import { attachTokenToHeaders } from './authActions';
import {
  GET_ACTIVITYS_LOADING,
  GET_ACTIVITYS_SUCCESS,
  GET_ACTIVITYS_FAIL,
  GET_EXPERIENCE_LOADING,
  GET_EXPERIENCE_SUCCESS,
  GET_EXPERIENCE_FAIL,
  ADD_EXPERIENCE_LOADING,
  ADD_EXPERIENCE_SUCCESS,
  ADD_EXPERIENCE_FAIL,
  DELETE_EXPERIENCE_LOADING,
  DELETE_EXPERIENCE_SUCCESS,
  DELETE_EXPERIENCE_FAIL,
  EDIT_EXPERIENCE_LOADING,
  EDIT_EXPERIENCE_SUCCESS,
  EDIT_EXPERIENCE_FAIL,
} from '../types';

export const getInterfacePresets = () => async (dispatch, getState) => {
  dispatch({
    type: GET_ACTIVITYS_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/experiences', options);

    dispatch({
      type: GET_ACTIVITYS_SUCCESS,
      payload: { experiences: response.data.experiences },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_ACTIVITYS_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const getInterfacePresetById = (experienceId) => async (dispatch, getState) => {
  dispatch({
    type: GET_EXPERIENCE_LOADING,
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/experiences/' + experienceId, options);

    dispatch({
      type: GET_EXPERIENCE_SUCCESS,
      payload: { experience: response.experience },
    });
    
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_EXPERIENCE_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const addInterfacePreset = (experience) => async (dispatch, getState) => {
  dispatch({
    type: ADD_EXPERIENCE_LOADING,
    payload: { me: { ...getState().auth.me } },
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/experiences', experience, options);

    dispatch({
      type: ADD_EXPERIENCE_SUCCESS,
      payload: { experience: response.data.experience },
    });

    return response
  } catch (err) {
    console.error(err)

    dispatch({
      type: ADD_EXPERIENCE_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const deleteInterfacePreset = (id) => async (dispatch, getState) => {
  dispatch({
    type: DELETE_EXPERIENCE_LOADING,
    payload: { id },
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.delete(`/api/experiences/${id}`, options);

    dispatch({
      type: DELETE_EXPERIENCE_SUCCESS,
      payload: { experience: response.data.experience },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: DELETE_EXPERIENCE_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const editInterfacePreset = (id, experience) => async (dispatch, getState) => {
  dispatch({
    type: EDIT_EXPERIENCE_LOADING,
    payload: { id },
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.put(`/api/experiences/${id}`,experience, options);

    dispatch({
      type: EDIT_EXPERIENCE_SUCCESS,
      payload: { experience: response.data.experience },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: EDIT_EXPERIENCE_FAIL,
      payload: { error: err?.response?.data.message || err.message, id },
    });
  }
};