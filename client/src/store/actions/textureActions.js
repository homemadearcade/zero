import axios from 'axios';

import { attachTokenToHeaders } from './authActions';
import {
  GET_TEXTURES_LOADING,
  GET_TEXTURES_SUCCESS,
  GET_TEXTURES_FAIL,
  GET_TEXTURE_LOADING,
  GET_TEXTURE_SUCCESS,
  GET_TEXTURE_FAIL,
  ADD_TEXTURE_LOADING,
  ADD_TEXTURE_SUCCESS,
  ADD_TEXTURE_FAIL,
  DELETE_TEXTURE_LOADING,
  DELETE_TEXTURE_SUCCESS,
  DELETE_TEXTURE_FAIL,
  EDIT_TEXTURE_LOADING,
  EDIT_TEXTURE_SUCCESS,
  EDIT_TEXTURE_FAIL,
} from '../types';

export const getTextures = () => async (dispatch, getState) => {
  dispatch({
    type: GET_TEXTURES_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/textures', options);

    dispatch({
      type: GET_TEXTURES_SUCCESS,
      payload: { textures: response.data.textures },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_TEXTURES_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const getTextureByTextureId = (textureId) => async (dispatch, getState) => {
  dispatch({
    type: GET_TEXTURE_LOADING,
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/textures/' + encodeURIComponent(textureId), options);
    
    dispatch({
      type: GET_TEXTURE_SUCCESS,
      payload: { texture: response.texture },
    });

    return response.data.texture
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_TEXTURE_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const addTexture = (texture) => async (dispatch, getState) => {
  dispatch({
    type: ADD_TEXTURE_LOADING,
    payload: { me: { ...getState().auth.me } },
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/textures', texture, options);

    dispatch({
      type: ADD_TEXTURE_SUCCESS,
      payload: { texture: response.data.texture },
    });

    return response.data.texture
  } catch (err) {
    console.error(err)

    dispatch({
      type: ADD_TEXTURE_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const deleteTexture = (id) => async (dispatch, getState) => {
  dispatch({
    type: DELETE_TEXTURE_LOADING,
    payload: { id },
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.delete(`/api/textures/${encodeURIComponent(id)}`, options);

    dispatch({
      type: DELETE_TEXTURE_SUCCESS,
      payload: { texture: response.data.texture },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: DELETE_TEXTURE_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const editTexture = (id, texture) => async (dispatch, getState) => {
  dispatch({
    type: EDIT_TEXTURE_LOADING,
    payload: { id },
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.put(`/api/textures/${encodeURIComponent(id)}`,texture, options);

    dispatch({
      type: EDIT_TEXTURE_SUCCESS,
      payload: { texture: response.data.texture },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: EDIT_TEXTURE_FAIL,
      payload: { error: err?.response?.data.message || err.message, id },
    });
  }
};