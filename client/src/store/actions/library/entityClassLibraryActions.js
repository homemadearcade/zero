import axios from 'axios';

import { attachTokenToHeaders } from '../auth/authActions';
import {
  GET_ENTITY_CLASS_LIBRARY_LOADING,
  GET_ENTITY_CLASS_LIBRARY_SUCCESS,
  GET_ENTITY_CLASS_LIBRARY_FAIL,
  GET_ENTITY_CLASS_LOADING,
  GET_ENTITY_CLASS_SUCCESS,
  GET_ENTITY_CLASS_FAIL,
  ADD_ENTITY_CLASS_LOADING,
  ADD_ENTITY_CLASS_SUCCESS,
  ADD_ENTITY_CLASS_FAIL,
  DELETE_ENTITY_CLASS_LOADING,
  DELETE_ENTITY_CLASS_SUCCESS,
  DELETE_ENTITY_CLASS_FAIL,
  EDIT_ENTITY_CLASS_LOADING,
  EDIT_ENTITY_CLASS_SUCCESS,
  EDIT_ENTITY_CLASS_FAIL,
  CLEAR_ENTITY_CLASS,
} from '../../types';

export const getEntityClassLibrary = () => async (dispatch, getState) => {
  dispatch({
    type: GET_ENTITY_CLASS_LIBRARY_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/entityClass', options);

    dispatch({
      type: GET_ENTITY_CLASS_LIBRARY_SUCCESS,
      payload: { entityClassLibrary: response.data.entityClassLibrary },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_ENTITY_CLASS_LIBRARY_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const getEntityClassByIdFromLibrary = (entityClassId) => async (dispatch, getState) => {
  dispatch({
    type: GET_ENTITY_CLASS_LOADING,
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/entityClass/' + entityClassId, options);

    dispatch({
      type: GET_ENTITY_CLASS_SUCCESS,
      payload: { entityClass: response.data.entityClass },
    });
    
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_ENTITY_CLASS_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const addEntityClassToLibrary = (entityClass) => async (dispatch, getState) => {
  dispatch({
    type: ADD_ENTITY_CLASS_LOADING,
    payload: { me: { ...getState().auth.me } },
  });

  try {
    entityClass.userId = getState().auth.me.id
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/entityClass', entityClass, options);

    dispatch({
      type: ADD_ENTITY_CLASS_SUCCESS,
      payload: { entityClass: response.data.entityClass },
    });

    return response
  } catch (err) {
    console.error(err)

    dispatch({
      type: ADD_ENTITY_CLASS_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const deleteEntityClassFromLibrary = (id) => async (dispatch, getState) => {
  dispatch({
    type: DELETE_ENTITY_CLASS_LOADING,
    payload: { id },
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.delete(`/api/entityClass/${id}`, options);

    dispatch({
      type: DELETE_ENTITY_CLASS_SUCCESS,
      payload: { entityClass: response.data.entityClass },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: DELETE_ENTITY_CLASS_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const editEntityClassInLibrary = (id, entityClassData) => async (dispatch, getState) => {
  dispatch({
    type: EDIT_ENTITY_CLASS_LOADING,
    payload: { id },
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.put(`/api/entityClass/${id}`, entityClassData, options);

    dispatch({
      type: EDIT_ENTITY_CLASS_SUCCESS,
      payload: { entityClass: response.data.entityClass },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: EDIT_ENTITY_CLASS_FAIL,
      payload: { error: err?.response?.data.message || err.message, id },
    });
  }
};

export const clearEntityClass = () =>  (dispatch, getState) => {
  dispatch({
    type: CLEAR_ENTITY_CLASS,
  });

}