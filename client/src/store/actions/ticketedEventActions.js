import axios from 'axios';

import { attachTokenToHeaders } from './authActions';
import {
  GET_TICKETED_EVENTS_LOADING,
  GET_TICKETED_EVENTS_SUCCESS,
  GET_TICKETED_EVENTS_FAIL,
  GET_TICKETED_EVENT_LOADING,
  GET_TICKETED_EVENT_SUCCESS,
  GET_TICKETED_EVENT_FAIL,
  ADD_TICKETED_EVENT_LOADING,
  ADD_TICKETED_EVENT_SUCCESS,
  ADD_TICKETED_EVENT_FAIL,
  DELETE_TICKETED_EVENT_LOADING,
  DELETE_TICKETED_EVENT_SUCCESS,
  DELETE_TICKETED_EVENT_FAIL,
  EDIT_TICKETED_EVENT_LOADING,
  EDIT_TICKETED_EVENT_SUCCESS,
  EDIT_TICKETED_EVENT_FAIL,
} from '../types';

export const getTicketedEvents = () => async (dispatch, getState) => {
  dispatch({
    type: GET_TICKETED_EVENTS_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/ticketedEvents', options);

    dispatch({
      type: GET_TICKETED_EVENTS_SUCCESS,
      payload: { ticketedEvents: response.data.ticketedEvents },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_TICKETED_EVENTS_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const getTicketedEventById = (ticketedEventId) => async (dispatch, getState) => {
  dispatch({
    type: GET_TICKETED_EVENT_LOADING,
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/ticketedEvents/' + ticketedEventId, options);

    dispatch({
      type: GET_TICKETED_EVENT_SUCCESS,
      payload: { ticketedEvent: response.data.ticketedEvent },
    });
    
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_TICKETED_EVENT_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const addTicketedEvent = (ticketedEvent) => async (dispatch, getState) => {
  dispatch({
    type: ADD_TICKETED_EVENT_LOADING,
    payload: { me: { ...getState().auth.me } },
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/ticketedEvents', ticketedEvent, options);

    dispatch({
      type: ADD_TICKETED_EVENT_SUCCESS,
      payload: { ticketedEvent: response.data.ticketedEvent },
    });

    return response
  } catch (err) {
    console.error(err)

    dispatch({
      type: ADD_TICKETED_EVENT_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const deleteTicketedEvent = (id) => async (dispatch, getState) => {
  dispatch({
    type: DELETE_TICKETED_EVENT_LOADING,
    payload: { id },
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.delete(`/api/ticketedEvents/${id}`, options);

    dispatch({
      type: DELETE_TICKETED_EVENT_SUCCESS,
      payload: { ticketedEvent: response.data.ticketedEvent },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: DELETE_TICKETED_EVENT_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const editTicketedEvent = (id, ticketedEvent) => async (dispatch, getState) => {
  dispatch({
    type: EDIT_TICKETED_EVENT_LOADING,
    payload: { id },
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.put(`/api/ticketedEvents/${id}`,ticketedEvent, options);

    dispatch({
      type: EDIT_TICKETED_EVENT_SUCCESS,
      payload: { ticketedEvent: response.data.ticketedEvent },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: EDIT_TICKETED_EVENT_FAIL,
      payload: { error: err?.response?.data.message || err.message, id },
    });
  }
};