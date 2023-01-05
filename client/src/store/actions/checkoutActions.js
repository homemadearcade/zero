import {
  UPDATE_TICKET_CART,
  CLEAR_TICKET_CART,
} from '../types';

export const updateCartTicketCount= ({ticketId, ticketedEventId, dateId, quantity}) => (dispatch, getState) => {
  dispatch({
    type: UPDATE_TICKET_CART,
    payload: {
      ticketCart: {
        ticketedEventId,
        dateId,
        ticketId,
        quantity
      }
    }
  })
};

export const clearCartTicket = () => (dispatch, getState) => {
  dispatch({
    type: CLEAR_TICKET_CART,
  })
};