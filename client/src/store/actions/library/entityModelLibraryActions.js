import axios from 'axios';

import { attachTokenToHeaders } from '../user/authActions';
import {
  GET_ENTITY_MODEL_LIBRARY_LOADING,
  GET_ENTITY_MODEL_LIBRARY_SUCCESS,
  GET_ENTITY_MODEL_LIBRARY_FAIL,
  GET_ENTITY_MODEL_LOADING,
  GET_ENTITY_MODEL_SUCCESS,
  GET_ENTITY_MODEL_FAIL,
  ADD_ENTITY_MODEL_LOADING,
  ADD_ENTITY_MODEL_SUCCESS,
  ADD_ENTITY_MODEL_FAIL,
  DELETE_ENTITY_MODEL_LOADING,
  DELETE_ENTITY_MODEL_SUCCESS,
  DELETE_ENTITY_MODEL_FAIL,
  EDIT_ENTITY_MODEL_LOADING,
  EDIT_ENTITY_MODEL_SUCCESS,
  EDIT_ENTITY_MODEL_FAIL,
  CLEAR_ENTITY_MODEL,
} from '../../types';
import { getDataSourceFromUserMongoId } from '../../../utils';
import { getLibrary } from './libraryActions';
import { DATA_SOURCE_IMPORTED_GAME_MODEL } from '../../../constants/interfaceIds';

export const getEntityModelLibrary = () => async (dispatch, getState) => {
  dispatch({
    type: GET_ENTITY_MODEL_LIBRARY_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/entityModel', options);

    dispatch({
      type: GET_ENTITY_MODEL_LIBRARY_SUCCESS,
      payload: { entityModelLibrary: response.data.entityModelLibrary },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_ENTITY_MODEL_LIBRARY_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const getEntityModelByIdFromLibrary = (entityModelId) => async (dispatch, getState) => {
  dispatch({
    type: GET_ENTITY_MODEL_LOADING,
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/entityModel/entityModelId/' + entityModelId, options);

    dispatch({
      type: GET_ENTITY_MODEL_SUCCESS,
      payload: { entityModel: response.data.entityModel },
    });
    
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_ENTITY_MODEL_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const getEntityModelByMongoIdFromLibrary = (entityModelMongoId) => async (dispatch, getState) => {
  dispatch({
    type: GET_ENTITY_MODEL_LOADING,
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/entityModel/' + entityModelMongoId, options);

    dispatch({
      type: GET_ENTITY_MODEL_SUCCESS,
      payload: { entityModel: response.data.entityModel },
    });
    
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_ENTITY_MODEL_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const addEntityModelToLibrary = (entityModel) => async (dispatch, getState) => {
  dispatch({
    type: ADD_ENTITY_MODEL_LOADING,
    payload: { me: { ...getState().auth.me } },
  });

  try {
    const userMongoId = getState().auth.me.id
    entityModel.userMongoId = userMongoId
    entityModel.dataSourceId = DATA_SOURCE_IMPORTED_GAME_MODEL
    
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/entityModel', entityModel, options);

    dispatch({
      type: ADD_ENTITY_MODEL_SUCCESS,
      payload: { entityModel: response.data.entityModel },
    });

    return response
  } catch (err) {
    console.error(err)

    dispatch({
      type: ADD_ENTITY_MODEL_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const deleteEntityModelFromLibrary = (id) => async (dispatch, getState) => {
  dispatch({
    type: DELETE_ENTITY_MODEL_LOADING,
    payload: { id },
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.delete(`/api/entityModel/${id}`, options);

    dispatch({
      type: DELETE_ENTITY_MODEL_SUCCESS,
      payload: { entityModel: response.data.entityModel },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: DELETE_ENTITY_MODEL_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const editEntityModelInLibrary = (id, entityModelData) => async (dispatch, getState) => {
  dispatch({
    type: EDIT_ENTITY_MODEL_LOADING,
    payload: { id },
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.put(`/api/entityModel/${id}`, entityModelData, options);

    dispatch({
      type: EDIT_ENTITY_MODEL_SUCCESS,
      payload: { entityModel: response.data.entityModel },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: EDIT_ENTITY_MODEL_FAIL,
      payload: { error: err?.response?.data.message || err.message, id },
    });
  }
};

export const clearEntityModel = () =>  (dispatch, getState) => {
  dispatch({
    type: CLEAR_ENTITY_MODEL,
  });
}