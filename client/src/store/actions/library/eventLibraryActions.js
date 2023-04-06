import axios from 'axios';

import { attachTokenToHeaders } from '../user/authActions';
import {
  GET_EVENT_LIBRARY_LOADING,
  GET_EVENT_LIBRARY_SUCCESS,
  GET_EVENT_LIBRARY_FAIL,
  GET_EVENT_LOADING,
  GET_EVENT_SUCCESS,
  GET_EVENT_FAIL,
  ADD_EVENT_LOADING,
  ADD_EVENT_SUCCESS,
  ADD_EVENT_FAIL,
  DELETE_EVENT_LOADING,
  DELETE_EVENT_SUCCESS,
  DELETE_EVENT_FAIL,
  EDIT_EVENT_LOADING,
  EDIT_EVENT_SUCCESS,
  EDIT_EVENT_FAIL,
  CLEAR_EVENT,
} from '../../types';
import { DATA_SOURCE_IMPORTED_GAME_MODE_IID } from '../../../game/constants';

export const getEventLibrary = () => async (dispatch, getState) => {
  dispatch({
    type: GET_EVENT_LIBRARY_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/event', options);

    dispatch({
      type: GET_EVENT_LIBRARY_SUCCESS,
      payload: { eventLibrary: response.data.eventLibrary },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_EVENT_LIBRARY_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const getEventByIdFromLibrary = (eventId) => async (dispatch, getState) => {
  dispatch({
    type: GET_EVENT_LOADING,
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/event/eventId/' + eventId, options);

    dispatch({
      type: GET_EVENT_SUCCESS,
      payload: { event: response.data.event },
    });
    
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_EVENT_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const getEventByMongoIdFromLibrary = (eventMongoId) => async (dispatch, getState) => {
  dispatch({
    type: GET_EVENT_LOADING,
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/event/' + eventMongoId, options);

    dispatch({
      type: GET_EVENT_SUCCESS,
      payload: { event: response.data.event },
    });
    
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_EVENT_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const addEventToLibrary = (event) => async (dispatch, getState) => {
  dispatch({
    type: ADD_EVENT_LOADING,
    payload: { me: { ...getState().auth.me } },
  });

  try {
    const userMongoId = getState().auth.me.id
    event.userMongoId = userMongoId
    event.dataSourceIID = DATA_SOURCE_IMPORTED_GAME_MODE_IID
    
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/event', event, options);

    dispatch({
      type: ADD_EVENT_SUCCESS,
      payload: { event: response.data.event },
    });

    return response
  } catch (err) {
    console.error(err)

    dispatch({
      type: ADD_EVENT_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const deleteEventFromLibrary = (id) => async (dispatch, getState) => {
  dispatch({
    type: DELETE_EVENT_LOADING,
    payload: { id },
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.delete(`/api/event/${id}`, options);

    dispatch({
      type: DELETE_EVENT_SUCCESS,
      payload: { event: response.data.event },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: DELETE_EVENT_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const editEventInLibrary = (id, eventData) => async (dispatch, getState) => {
  dispatch({
    type: EDIT_EVENT_LOADING,
    payload: { id },
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.put(`/api/event/${id}`, eventData, options);

    dispatch({
      type: EDIT_EVENT_SUCCESS,
      payload: { event: response.data.event },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: EDIT_EVENT_FAIL,
      payload: { error: err?.response?.data.message || err.message, id },
    });
  }
};

export const clearEvent = () =>  (dispatch, getState) => {
  dispatch({
    type: CLEAR_EVENT,
  });
}