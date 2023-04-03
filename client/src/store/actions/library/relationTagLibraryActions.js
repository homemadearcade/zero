import axios from 'axios';

import { attachTokenToHeaders } from '../user/authActions';
import {
  GET_RELATION_TAG_LIBRARY_LOADING,
  GET_RELATION_TAG_LIBRARY_SUCCESS,
  GET_RELATION_TAG_LIBRARY_FAIL,
  GET_RELATION_TAG_LOADING,
  GET_RELATION_TAG_SUCCESS,
  GET_RELATION_TAG_FAIL,
  ADD_RELATION_TAG_LOADING,
  ADD_RELATION_TAG_SUCCESS,
  ADD_RELATION_TAG_FAIL,
  DELETE_RELATION_TAG_LOADING,
  DELETE_RELATION_TAG_SUCCESS,
  DELETE_RELATION_TAG_FAIL,
  EDIT_RELATION_TAG_LOADING,
  EDIT_RELATION_TAG_SUCCESS,
  EDIT_RELATION_TAG_FAIL,
  CLEAR_RELATION_TAG,
} from '../../types';
import { DATA_SOURCE_IMPORTED_GAME_MODEL } from '../../../game/constants';

export const getRelationTagLibrary = () => async (dispatch, getState) => {
  dispatch({
    type: GET_RELATION_TAG_LIBRARY_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/relationTag', options);

    dispatch({
      type: GET_RELATION_TAG_LIBRARY_SUCCESS,
      payload: { relationTagLibrary: response.data.relationTagLibrary },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_RELATION_TAG_LIBRARY_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const getRelationTagByIdFromLibrary = (relationTagId) => async (dispatch, getState) => {
  dispatch({
    type: GET_RELATION_TAG_LOADING,
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/relationTag/relationTagId/' + relationTagId, options);

    dispatch({
      type: GET_RELATION_TAG_SUCCESS,
      payload: { relationTag: response.data.relationTag },
    });
    
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_RELATION_TAG_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const getRelationTagByMongoIdFromLibrary = (relationTagMongoId) => async (dispatch, getState) => {
  dispatch({
    type: GET_RELATION_TAG_LOADING,
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/relationTag/' + relationTagMongoId, options);

    dispatch({
      type: GET_RELATION_TAG_SUCCESS,
      payload: { relationTag: response.data.relationTag },
    });
    
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_RELATION_TAG_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const addRelationTagToLibrary = (relationTag) => async (dispatch, getState) => {
  dispatch({
    type: ADD_RELATION_TAG_LOADING,
    payload: { me: { ...getState().auth.me } },
  });

  try {
    const userMongoId = getState().auth.me.id
    relationTag.userMongoId = userMongoId
    relationTag.dataSourceId = DATA_SOURCE_IMPORTED_GAME_MODEL
    
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/relationTag', relationTag, options);

    dispatch({
      type: ADD_RELATION_TAG_SUCCESS,
      payload: { relationTag: response.data.relationTag },
    });

    return response
  } catch (err) {
    console.error(err)

    dispatch({
      type: ADD_RELATION_TAG_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const deleteRelationTagFromLibrary = (id) => async (dispatch, getState) => {
  dispatch({
    type: DELETE_RELATION_TAG_LOADING,
    payload: { id },
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.delete(`/api/relationTag/${id}`, options);

    dispatch({
      type: DELETE_RELATION_TAG_SUCCESS,
      payload: { relationTag: response.data.relationTag },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: DELETE_RELATION_TAG_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const editRelationTagInLibrary = (id, relationTagData) => async (dispatch, getState) => {
  dispatch({
    type: EDIT_RELATION_TAG_LOADING,
    payload: { id },
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.put(`/api/relationTag/${id}`, relationTagData, options);

    dispatch({
      type: EDIT_RELATION_TAG_SUCCESS,
      payload: { relationTag: response.data.relationTag },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: EDIT_RELATION_TAG_FAIL,
      payload: { error: err?.response?.data.message || err.message, id },
    });
  }
};

export const clearRelationTag = () =>  (dispatch, getState) => {
  dispatch({
    type: CLEAR_RELATION_TAG,
  });
}