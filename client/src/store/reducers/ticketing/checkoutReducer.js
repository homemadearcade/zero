import { CLEAR_TICKET_CART, UPDATE_TICKET_CART } from '../../types';

const initialState = {
  ticketCart: {
    ticketedEventMongoId: null,
    dateId: null,
    tickets: {}
  }
};

export default function checkoutReducer(state = initialState, { type, payload }) {
  switch (type) {
    case UPDATE_TICKET_CART: 
      return {
        ...state,
        ticketCart: payload.ticketCart
      }
    case CLEAR_TICKET_CART: 
      return {
        ...state,
        ticketCart: initialState.ticketCart
      }
    default:
      return state;
  }
}
