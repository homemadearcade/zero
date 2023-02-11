import {
  LEAVE_GAME_SESSION_SUCCESS,
  LEAVE_GAME_SESSION_FAIL,
  JOIN_GAME_SESSION_LOADING,
  JOIN_GAME_SESSION_SUCCESS,
  JOIN_GAME_SESSION_FAIL,
  GET_GAME_SESSION_LOADING,
  GET_GAME_SESSION_SUCCESS,
  GET_GAME_SESSION_FAIL,
  EDIT_GAME_SESSION_SUCCESS,
  EDIT_GAME_SESSION_FAIL,
  UPDATE_GAME_SESSION_USER_FAIL,
  DELETE_GAME_SESSION_LOADING,
  DELETE_GAME_SESSION_SUCCESS,
  DELETE_GAME_SESSION_FAIL,
  ON_GAME_SESSION_UPDATE,
  SEND_GAME_SESSION_MESSAGE_FAIL,
} from '../types';

const initialState = {
  gameSession: {
    players: []
  },
  isLoading: false,
  error: null,
  isJoining: false,
  joinError: null,
};

export default function gameSessionReducer(state = initialState, { type, payload }) {
  switch (type) {
    case GET_GAME_SESSION_LOADING:
    case DELETE_GAME_SESSION_LOADING:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case JOIN_GAME_SESSION_LOADING:
      return {
        ...state,
        isJoining: true,
      };
    case GET_GAME_SESSION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        gameSession: payload.gameSession,
      };
    case JOIN_GAME_SESSION_SUCCESS:
      return {
        ...state,
        isJoining: false,
        isInsideLobby: true,
        gameSession: {...payload.gameSession, users: payload.gameSession.players.slice()}
      };
    case LEAVE_GAME_SESSION_SUCCESS:
    return {
      ...state,
      isJoining: false,
      isInsideLobby: false,
      gameSession: initialState.gameSession,
    };
    case EDIT_GAME_SESSION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        gameSession: {...payload.gameSession, users: payload.gameSession.players.slice()}
      };
    case DELETE_GAME_SESSION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        gameSession: initialState.gameSession,
      };
    case JOIN_GAME_SESSION_FAIL:
      return {
        ...state,
        isLoading: false,
        isJoining: false,
        gameSession: initialState.gameSession,
        joinError: payload.error,
      };
    case GET_GAME_SESSION_FAIL:
    case EDIT_GAME_SESSION_FAIL:
    case DELETE_GAME_SESSION_FAIL:
    case LEAVE_GAME_SESSION_FAIL:
    case UPDATE_GAME_SESSION_USER_FAIL:
    case SEND_GAME_SESSION_MESSAGE_FAIL:
      return {
        ...state,
        isLoading: false,
        isJoining: false,
        gameSession: initialState.gameSession,
        error: payload.error,
      };
    case ON_GAME_SESSION_UPDATE:
      return {
        ...state,
        gameSession: {...state.gameSession, ...payload.gameSession, users: payload.gameSession.players?.slice()}
      };
    default:
      return state;
  }
}
