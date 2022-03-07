import {
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
  ASSIGN_LOBBY_ROLE_FAIL,
  ON_LOBBY_UPDATE,
} from '../types';

const initialState = {
  lobby: {
    users: []
  },
  lobbyUserStatus: {},
  isLoading: false,
  error: null,
  isJoining: false,
  joinError: null,
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
        lobby: {...payload.lobby, users: payload.lobby.users.slice()}
      };
    case LEAVE_LOBBY_SUCCESS:
    return {
      ...state,
      isJoining: false,
      cobrowsingUser: initialState.cobrowsingUser,
      lobby: initialState.lobby
    };
    case EDIT_LOBBY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        lobby: {...payload.lobby, users: payload.lobby.users.slice()}
      };
    case DELETE_LOBBY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        lobby: initialState.lobby,
      };
    case JOIN_LOBBY_FAIL:
      return {
        ...state,
        isLoading: false,
        isJoining: false,
        lobby: initialState.lobby,
        joinError: payload.error,
      };
    case GET_LOBBY_FAIL:
    case EDIT_LOBBY_FAIL:
    case DELETE_LOBBY_FAIL:
    case LEAVE_LOBBY_FAIL:
    case ASSIGN_LOBBY_ROLE_FAIL:
      return {
        ...state,
        isLoading: false,
        isJoining: false,
        lobby: initialState.lobby,
        error: payload.error,
      };
    case ON_LOBBY_UPDATE:
      return {
        ...state,
        lobby: {...payload.lobby, users: payload.lobby.users.slice()}
      };
    default:
      return state;
  }
}
