import axios from 'axios';

import { attachTokenToHeaders } from './authActions';
import {
  GET_INTERFACE_PRESETS_LOADING,
  GET_INTERFACE_PRESETS_SUCCESS,
  GET_INTERFACE_PRESETS_FAIL,
  GET_INTERFACE_PRESET_LOADING,
  GET_INTERFACE_PRESET_SUCCESS,
  GET_INTERFACE_PRESET_FAIL,
  ADD_INTERFACE_PRESET_LOADING,
  ADD_INTERFACE_PRESET_SUCCESS,
  ADD_INTERFACE_PRESET_FAIL,
  DELETE_INTERFACE_PRESET_LOADING,
  DELETE_INTERFACE_PRESET_SUCCESS,
  DELETE_INTERFACE_PRESET_FAIL,
  EDIT_INTERFACE_PRESET_LOADING,
  EDIT_INTERFACE_PRESET_SUCCESS,
  EDIT_INTERFACE_PRESET_FAIL,
} from '../types';

export const getInterfacePresets = () => async (dispatch, getState) => {
  dispatch({
    type: GET_INTERFACE_PRESETS_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/interfacePresets', options);

    dispatch({
      type: GET_INTERFACE_PRESETS_SUCCESS,
      payload: { interfacePresets: response.data.interfacePresets },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_INTERFACE_PRESETS_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const getInterfacePresetById = (interfacePresetId) => async (dispatch, getState) => {
  dispatch({
    type: GET_INTERFACE_PRESET_LOADING,
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/interfacePresets/' + interfacePresetId, options);

    dispatch({
      type: GET_INTERFACE_PRESET_SUCCESS,
      payload: { interfacePreset: response.interfacePreset },
    });
    
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_INTERFACE_PRESET_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const addInterfacePreset = (interfacePreset) => async (dispatch, getState) => {
  dispatch({
    type: ADD_INTERFACE_PRESET_LOADING,
    payload: { me: { ...getState().auth.me } },
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/interfacePresets', interfacePreset, options);

    console.log(response.data)
    dispatch({
      type: ADD_INTERFACE_PRESET_SUCCESS,
      payload: { interfacePreset: response.data.interfacePreset },
    });

    return response
  } catch (err) {
    console.error(err)

    dispatch({
      type: ADD_INTERFACE_PRESET_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const deleteInterfacePreset = (id) => async (dispatch, getState) => {
  dispatch({
    type: DELETE_INTERFACE_PRESET_LOADING,
    payload: { id },
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.delete(`/api/interfacePresets/${id}`, options);

    dispatch({
      type: DELETE_INTERFACE_PRESET_SUCCESS,
      payload: { interfacePreset: response.data.interfacePreset },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: DELETE_INTERFACE_PRESET_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const editInterfacePreset = (id, interfacePreset) => async (dispatch, getState) => {
  dispatch({
    type: EDIT_INTERFACE_PRESET_LOADING,
    payload: { id },
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.put(`/api/interfacePresets/${id}`,interfacePreset, options);

    dispatch({
      type: EDIT_INTERFACE_PRESET_SUCCESS,
      payload: { interfacePreset: response.data.interfacePreset },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: EDIT_INTERFACE_PRESET_FAIL,
      payload: { error: err?.response?.data.message || err.message, id },
    });
  }
};