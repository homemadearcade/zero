import {
  GET_TICKETED_EVENTS_LOADING,
  GET_TICKETED_EVENTS_SUCCESS,
  GET_TICKETED_EVENTS_FAIL,
  GET_TICKETED_EVENT_LOADING,
  GET_TICKETED_EVENT_SUCCESS,
  GET_TICKETED_EVENT_FAIL,
  DELETE_TICKETED_EVENT_LOADING,
  DELETE_TICKETED_EVENT_SUCCESS,
  DELETE_TICKETED_EVENT_FAIL,
  ADD_TICKETED_EVENT_LOADING,
  ADD_TICKETED_EVENT_SUCCESS,
  ADD_TICKETED_EVENT_FAIL,
  EDIT_TICKETED_EVENT_FAIL,
  EDIT_TICKETED_EVENT_SUCCESS,
  GET_TICKET_PURCHASES_BY_EVENT_SUCCESS,
} from '../types';

const initialState = {
  ticketedEvents: [],
  ticketedEvent: null,
  ticketPurchases: null,
  isLoading: false,
  error: null,
};

export default function ticketedEventReducer(state = initialState, { type, payload }) {
  switch (type) {
    case GET_TICKETED_EVENT_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case GET_TICKETED_EVENTS_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case ADD_TICKETED_EVENT_LOADING:
      return {
        ...state,
        ticketEvents: [
          {
            id: 0,
            isLoading: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            user: { ...payload.me },
          },
          ...state.ticketEvents,
        ],
      };
    case GET_TICKETED_EVENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        ticketedEvent: payload.ticketedEvent,
      };
    case GET_TICKETED_EVENTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        ticketedEvent: payload.ticketedEvents[0],
      };
    case GET_TICKET_PURCHASES_BY_EVENT_SUCCESS:
      return {
        ...state,
        ticketPurchases: payload.ticketPurchases,
      };
    case ADD_TICKETED_EVENT_SUCCESS:
      return {
        ...state,
        ticketEvents: state.ticketEvents.map((m) => {
          if (m.id === 0) return payload.ticketedEvent;
          return m;
        }),
      };
    case EDIT_TICKETED_EVENT_SUCCESS:
      return {
        ...state,
        ticketedEvent: payload.ticketedEvent,
      };
    case EDIT_TICKETED_EVENT_FAIL:
      return {
        ...state,
        error: payload.error,
      };
    case GET_TICKETED_EVENT_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
      };
    case GET_TICKETED_EVENTS_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
      };
    case ADD_TICKETED_EVENT_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
        ticketedEvents: state.ticketedEvent.filter((m) => m.id !== 0),
      };
    default:
      return state;
  }
}
