import axios from 'axios';

import { attachTokenToHeaders } from '../user/authActions';
import {
  GET_RELATION_LIBRARY_LOADING,
  GET_RELATION_LIBRARY_SUCCESS,
  GET_RELATION_LIBRARY_FAIL,
  GET_RELATION_LOADING,
  GET_RELATION_SUCCESS,
  GET_RELATION_FAIL,
  ADD_RELATION_LOADING,
  ADD_RELATION_SUCCESS,
  ADD_RELATION_FAIL,
  DELETE_RELATION_LOADING,
  DELETE_RELATION_SUCCESS,
  DELETE_RELATION_FAIL,
  EDIT_RELATION_LOADING,
  EDIT_RELATION_SUCCESS,
  EDIT_RELATION_FAIL,
  CLEAR_RELATION,
} from '../../types';
import { DATA_SOURCE_IMPORTED_GAME_MODEL } from '../../../game/constants';

export const getRelationLibrary = () => async (dispatch, getState) => {
  dispatch({
    type: GET_RELATION_LIBRARY_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/relation', options);

    dispatch({
      type: GET_RELATION_LIBRARY_SUCCESS,
      payload: { relationLibrary: response.data.relationLibrary },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_RELATION_LIBRARY_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const getRelationByIdFromLibrary = (relationId) => async (dispatch, getState) => {
  dispatch({
    type: GET_RELATION_LOADING,
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/relation/relationId/' + relationId, options);

    dispatch({
      type: GET_RELATION_SUCCESS,
      payload: { relation: response.data.relation },
    });
    
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_RELATION_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const getRelationByMongoIdFromLibrary = (relationMongoId) => async (dispatch, getState) => {
  dispatch({
    type: GET_RELATION_LOADING,
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/relation/' + relationMongoId, options);

    dispatch({
      type: GET_RELATION_SUCCESS,
      payload: { relation: response.data.relation },
    });
    
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_RELATION_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const addRelationToLibrary = (relation) => async (dispatch, getState) => {
  dispatch({
    type: ADD_RELATION_LOADING,
    payload: { me: { ...getState().auth.me } },
  });

  try {
    const userMongoId = getState().auth.me.id
    relation.userMongoId = userMongoId
    relation.dataSourceId = DATA_SOURCE_IMPORTED_GAME_MODEL
    
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/relation', relation, options);

    dispatch({
      type: ADD_RELATION_SUCCESS,
      payload: { relation: response.data.relation },
    });

    return response
  } catch (err) {
    console.error(err)

    dispatch({
      type: ADD_RELATION_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const deleteRelationFromLibrary = (id) => async (dispatch, getState) => {
  dispatch({
    type: DELETE_RELATION_LOADING,
    payload: { id },
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.delete(`/api/relation/${id}`, options);

    dispatch({
      type: DELETE_RELATION_SUCCESS,
      payload: { relation: response.data.relation },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: DELETE_RELATION_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const editRelationInLibrary = (id, relationData) => async (dispatch, getState) => {
  dispatch({
    type: EDIT_RELATION_LOADING,
    payload: { id },
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.put(`/api/relation/${id}`, relationData, options);

    dispatch({
      type: EDIT_RELATION_SUCCESS,
      payload: { relation: response.data.relation },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: EDIT_RELATION_FAIL,
      payload: { error: err?.response?.data.message || err.message, id },
    });
  }
};

export const clearRelation = () =>  (dispatch, getState) => {
  dispatch({
    type: CLEAR_RELATION,
  });
}