import {
  UPDATE_TICKET_CART,
  CLEAR_TICKET_CART,
} from '../../types';

export const updateCartTicketCount= ({ticketedEventMongoId, dateId, tickets}) => (dispatch, getState) => {
  dispatch({
    type: UPDATE_TICKET_CART,
    payload: {
      ticketCart: {
        ticketedEventMongoId,
        dateId,
        tickets
      }
    }
  })
};

export const clearCartTicket = () => (dispatch, getState) => {
  dispatch({
    type: CLEAR_TICKET_CART,
  })
};