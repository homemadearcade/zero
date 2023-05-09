import axios from 'axios';

import { attachTokenToHeaders } from '../user/authActions';
import {
  GET_EFFECT_LIBRARY_LOADING,
  GET_EFFECT_LIBRARY_SUCCESS,
  GET_EFFECT_LIBRARY_FAIL,
  GET_EFFECT_LOADING,
  GET_EFFECT_SUCCESS,
  GET_EFFECT_FAIL,
  ADD_EFFECT_LOADING,
  ADD_EFFECT_SUCCESS,
  ADD_EFFECT_FAIL,
  DELETE_EFFECT_LOADING,
  DELETE_EFFECT_SUCCESS,
  DELETE_EFFECT_FAIL,
  EDIT_EFFECT_LOADING,
  EDIT_EFFECT_SUCCESS,
  EDIT_EFFECT_FAIL,
  CLEAR_EFFECT,
} from '../../types';
import { DATA_SOURCE_IMPORTED_GAME_MODEL_IID } from '../../../game/constants';

export const getEffectLibrary = () => async (dispatch, getState) => {
  dispatch({
    type: GET_EFFECT_LIBRARY_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/effect', options);

    dispatch({
      type: GET_EFFECT_LIBRARY_SUCCESS,
      payload: { effectLibrary: response.data.effectLibrary },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_EFFECT_LIBRARY_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const getEffectByIdFromLibrary = (effectId) => async (dispatch, getState) => {
  dispatch({
    type: GET_EFFECT_LOADING,
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/effect/effectId/' + effectId, options);

    dispatch({
      type: GET_EFFECT_SUCCESS,
      payload: { effect: response.data.effect },
    });
    
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_EFFECT_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const getEffectByMongoIdFromLibrary = (effectMongoId) => async (dispatch, getState) => {
  dispatch({
    type: GET_EFFECT_LOADING,
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/effect/' + effectMongoId, options);

    dispatch({
      type: GET_EFFECT_SUCCESS,
      payload: { effect: response.data.effect },
    });
    
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_EFFECT_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const addEffectToLibrary = (effect) => async (dispatch, getState) => {
  dispatch({
    type: ADD_EFFECT_LOADING,
    payload: { me: { ...getState().auth.me } },
  });

  try {
    const userMongoId = getState().auth.me.id
    effect.userMongoId = userMongoId
    effect.dataSourceIID = DATA_SOURCE_IMPORTED_GAME_MODEL_IID
    
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/effect', effect, options);

    dispatch({
      type: ADD_EFFECT_SUCCESS,
      payload: { effect: response.data.effect },
    });

    return response
  } catch (err) {
    console.error(err)

    dispatch({
      type: ADD_EFFECT_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const deleteEffectFromLibrary = (id) => async (dispatch, getState) => {
  dispatch({
    type: DELETE_EFFECT_LOADING,
    payload: { id },
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.delete(`/api/effect/${id}`, options);

    dispatch({
      type: DELETE_EFFECT_SUCCESS,
      payload: { effect: response.data.effect },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: DELETE_EFFECT_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const editEffectInLibrary = (id, effectData) => async (dispatch, getState) => {
  dispatch({
    type: EDIT_EFFECT_LOADING,
    payload: { id },
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.put(`/api/effect/${id}`, effectData, options);

    dispatch({
      type: EDIT_EFFECT_SUCCESS,
      payload: { effect: response.data.effect },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: EDIT_EFFECT_FAIL,
      payload: { error: err?.response?.data.message || err.message, id },
    });
  }
};

export const clearEffect = () =>  (dispatch, getState) => {
  dispatch({
    type: CLEAR_EFFECT,
  });
}