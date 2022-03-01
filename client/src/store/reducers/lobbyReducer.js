import {
  LEAVE_LOBBY_LOADING,
  LEAVE_LOBBY_SUCCESS,
  LEAVE_LOBBY_FAIL,
  JOIN_LOBBY_LOADING,
  JOIN_LOBBY_SUCCESS,
  JOIN_LOBBY_FAIL,
  GET_LOBBY_LOADING,
  GET_LOBBY_SUCCESS,
  GET_LOBBY_FAIL,
  EDIT_LOBBY_LOADING,
  EDIT_LOBBY_SUCCESS,
  EDIT_LOBBY_FAIL,
  DELETE_LOBBY_LOADING,
  DELETE_LOBBY_SUCCESS,
  DELETE_LOBBY_FAIL,
} from '../types';

const initialState = {
  lobby: {},
  isLoading: false,
  error: null,
};

export default function lobbyReducer(state = initialState, { type, payload }) {
  switch (type) {
    case GET_LOBBY_LOADING:
    case EDIT_LOBBY_LOADING:
    case DELETE_LOBBY_LOADING:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case JOIN_LOBBY_LOADING:
      return {
        ...state,
        isJoining: true,
      };
    case GET_LOBBY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        lobby: payload.lobby,
      };
    case JOIN_LOBBY_SUCCESS:
      return {
        ...state,
        isJoining: false,
      };
    case EDIT_LOBBY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        lobby: payload.lobby,
      };
    case DELETE_LOBBY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        lobby: {},
      };
    case JOIN_LOBBY_FAIL:
      return {
        ...state,
        isLoading: false,
        isJoining: false,
        lobby: {},
        joinError: payload.error,
      };
    case GET_LOBBY_FAIL:
    case EDIT_LOBBY_FAIL:
    case DELETE_LOBBY_FAIL:
    case LEAVE_LOBBY_FAIL:
        return {
          ...state,
          isLoading: false,
          isJoining: false,
          lobby: {},
          error: payload.error,
        };
    default:
      return state;
  }
}
