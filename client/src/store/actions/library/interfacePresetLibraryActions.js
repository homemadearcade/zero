import axios from 'axios';

import { attachTokenToHeaders } from '../user/authActions';
import {
  GET_INTERFACE_PRESET_LIBRARY_LOADING,
  GET_INTERFACE_PRESET_LIBRARY_SUCCESS,
  GET_INTERFACE_PRESET_LIBRARY_FAIL,
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
} from '../../types';
import { getDataSourceFromUserMongoId } from '../../../utils';

export const getInterfacePresetLibrary = () => async (dispatch, getState) => {
  dispatch({
    type: GET_INTERFACE_PRESET_LIBRARY_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/interfacePreset', options);

    dispatch({
      type: GET_INTERFACE_PRESET_LIBRARY_SUCCESS,
      payload: { interfacePresetLibrary: response.data.interfacePresetLibrary },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_INTERFACE_PRESET_LIBRARY_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const getInterfacePresetByMongoIdFromLibrary = (interfacePresetMongoId) => async (dispatch, getState) => {
  dispatch({
    type: GET_INTERFACE_PRESET_LOADING,
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/interfacePreset/' + interfacePresetMongoId, options);

    dispatch({
      type: GET_INTERFACE_PRESET_SUCCESS,
      payload: { interfacePreset: response.data.interfacePreset },
    });
    
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_INTERFACE_PRESET_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const getInterfacePresetByIdFromLibrary = (interfacePresetId) => async (dispatch, getState) => {
  dispatch({
    type: GET_INTERFACE_PRESET_LOADING,
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/interfacePreset/interfacePresetId/' + interfacePresetId, options);

    dispatch({
      type: GET_INTERFACE_PRESET_SUCCESS,
      payload: { interfacePreset: response.data.interfacePreset },
    });
    
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_INTERFACE_PRESET_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};


export const addInterfacePresetToLibrary = (interfacePreset) => async (dispatch, getState) => {
  dispatch({
    type: ADD_INTERFACE_PRESET_LOADING,
    payload: { me: { ...getState().auth.me } },
  });

  
  try {
    const userMongoId = getState().auth.me.id
    interfacePreset.userMongoId = userMongoId
    interfacePreset.dataSource = getDataSourceFromUserMongoId(userMongoId)
    
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/interfacePreset', interfacePreset, options);

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

export const deleteInterfacePresetFromLibrary = (id) => async (dispatch, getState) => {
  dispatch({
    type: DELETE_INTERFACE_PRESET_LOADING,
    payload: { id },
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.delete(`/api/interfacePreset/${id}`, options);

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

export const editInterfacePresetInLibrary = (id, interfacePreset) => async (dispatch, getState) => {
  dispatch({
    type: EDIT_INTERFACE_PRESET_LOADING,
    payload: { id },
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.put(`/api/interfacePreset/${id}`,interfacePreset, options);

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