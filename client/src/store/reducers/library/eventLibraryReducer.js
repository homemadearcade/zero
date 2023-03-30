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
  EDIT_EVENT_FAIL,
  EDIT_EVENT_SUCCESS,
  EDIT_EVENT_LOADING,
  CLEAR_EVENT,
} from '../../types';

const initialState = {
  eventLibrary: [],
  event: null,
  isLoading: false,
  isSaving: false,
  error: null,
};

export default function eventLibraryReducer(state = initialState, { type, payload }) {
  switch (type) {
    case GET_EVENT_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case GET_EVENT_LIBRARY_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case ADD_EVENT_LOADING:
      return {
        ...state,
        eventLibrary: [
          {
            id: 0,
            isLoading: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            metadata: {},
            owner: { ...payload.me },
          },
          ...state.eventLibrary,
        ],
      };
    case GET_EVENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        event: payload.event,
      };
    case CLEAR_EVENT: 
      return {
        ...state,
        event: null,
      };
    case GET_EVENT_LIBRARY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        eventLibrary: payload.eventLibrary,
      };
    case ADD_EVENT_SUCCESS:
      return {
        ...state,
        eventLibrary: state.eventLibrary.map((m) => {
          if (m.id === 0) return payload.event;
          return m;
        }),
      };
    case EDIT_EVENT_LOADING: 
      return {
        ...state,
        isSaving: true,
      };
    case EDIT_EVENT_SUCCESS:
      return {
        ...state,
        isSaving: false,
        event: payload.event,
      };
    case EDIT_EVENT_FAIL:
      return {
        ...state,
        isSaving: false,
        error: payload.error,
      };
    case GET_EVENT_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
      };
    case GET_EVENT_LIBRARY_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
      };
    case ADD_EVENT_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
        eventLibrary: state.eventLibrary.filter((m) => m.id !== 0),
      };
    default:
      return state;
  }
}
