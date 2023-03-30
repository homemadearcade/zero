import axios from 'axios';

import { attachTokenToHeaders } from '../user/authActions';
import {
  // GET_TICKET_PURCHASES_LOADING,
  // GET_TICKET_PURCHASES_SUCCESS,
  // GET_TICKET_PURCHASES_FAIL,
  GET_TICKET_PURCHASES_BY_EVENT_LOADING,
  GET_TICKET_PURCHASES_BY_EVENT_SUCCESS,
  GET_TICKET_PURCHASES_BY_EVENT_FAIL,
  // EDIT_TICKET_PURCHASE_LOADING,
  // EDIT_TICKET_PURCHASE_SUCCESS,
  // EDIT_TICKET_PURCHASE_FAIL,
} from '../../types';

// export const getTicketedPurchases = () => async (dispatch, getState) => {
//   dispatch({
//     type: GET_TICKET_PURCHASES_LOADING,
//   });
//   try {
//     const options = attachTokenToHeaders(getState);
//     const response = await axios.get('/api/ticketPurchases', options);

//     dispatch({
//       type: GET_TICKET_PURCHASES_SUCCESS,
//       payload: { ticketPurchase: response.data.ticketPurchase },
//     });
//   } catch (err) {
//     console.error(err)

//     dispatch({
//       type: GET_TICKET_PURCHASES_FAIL,
//       payload: { error: err?.response?.data.message || err.message },
//     });
//   }
// };

export const getTicketedPurchaseByEventId = (ticketedEventMongoId) => async (dispatch, getState) => {
  dispatch({
    type: GET_TICKET_PURCHASES_BY_EVENT_LOADING,
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/ticketPurchases/byEvent/' + ticketedEventMongoId, options);

    dispatch({
      type: GET_TICKET_PURCHASES_BY_EVENT_SUCCESS,
      payload: { ticketPurchases: response.data.ticketPurchases },
    });
    
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_TICKET_PURCHASES_BY_EVENT_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const getTicketedPurchaseById = (ticketPurchaseId) => async (dispatch, getState) => {
  dispatch({
    type: GET_TICKET_PURCHASES_BY_EVENT_LOADING,
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/ticketPurchases/ticketPurchaseId/' + ticketPurchaseId, options);

    dispatch({
      type: GET_TICKET_PURCHASES_BY_EVENT_SUCCESS,
      payload: { ticketPurchases: response.data.ticketPurchases },
    });
    
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_TICKET_PURCHASES_BY_EVENT_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

// export const getTicketedPurchaseByMongoId = (ticketPurchaseMongoId) => async (dispatch, getState) => {
//   dispatch({
//     type: GET_TICKET_PURCHASE_LOADING,
//   });

//   try {
//     const options = attachTokenToHeaders(getState);
//     const response = await axios.get('/api/ticketPurchases/' + ticketPurchaseMongoId, options);

//     dispatch({
//       type: GET_TICKET_PURCHASE_SUCCESS,
//       payload: { ticketedEvent: response.ticketedEvent },
//     });
    
//   } catch (err) {
//     console.error(err)

//     dispatch({
//       type: GET_TICKET_PURCHASE_FAIL,
//       payload: { error: err?.response?.data.message || err.message },
//     });
//   }
// };

// export const addTicketedPurchase = (ticketedEvent) => async (dispatch, getState) => {
//   dispatch({
//     type: ADD_TICKET_PURCHASE_LOADING,
//     payload: { me: { ...getState().auth.me } },
//   });

//   try {
//     const options = attachTokenToHeaders(getState);
//     const response = await axios.post('/api/ticketPurchases', ticketedEvent, options);

//     dispatch({
//       type: ADD_TICKET_PURCHASE_SUCCESS,
//       payload: { ticketedEvent: response.data.ticketedEvent },
//     });

//     return response
//   } catch (err) {
//     console.error(err)

//     dispatch({
//       type: ADD_TICKET_PURCHASE_FAIL,
//       payload: { error: err?.response?.data.message || err.message },
//     });
//   }
// };

// export const deleteTicketedPurchase = (id) => async (dispatch, getState) => {
//   dispatch({
//     type: DELETE_TICKET_PURCHASE_LOADING,
//     payload: { id },
//   });
//   try {
//     const options = attachTokenToHeaders(getState);
//     const response = await axios.delete(`/api/ticketPurchases/${id}`, options);

//     dispatch({
//       type: DELETE_TICKET_PURCHASE_SUCCESS,
//       payload: { ticketedEvent: response.data.ticketedEvent },
//     });
//   } catch (err) {
//     console.error(err)

//     dispatch({
//       type: DELETE_TICKET_PURCHASE_FAIL,
//       payload: { error: err?.response?.data.message || err.message },
//     });
//   }
// };

// export const editTicketedPurchase = (id, ticketedEvent) => async (dispatch, getState) => {
//   dispatch({
//     type: EDIT_TICKET_PURCHASE_LOADING,
//     payload: { id },
//   });
//   try {
//     const options = attachTokenToHeaders(getState);
//     const response = await axios.put(`/api/ticketPurchases/${id}`,ticketedEvent, options);

//     dispatch({
//       type: EDIT_TICKET_PURCHASE_SUCCESS,
//       payload: { ticketedEvent: response.data.ticketedEvent },
//     });
//   } catch (err) {
//     console.error(err)

//     dispatch({
//       type: EDIT_TICKET_PURCHASE_FAIL,
//       payload: { error: err?.response?.data.message || err.message, id },
//     });
//   }
// };