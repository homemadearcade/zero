import {
  // LEAVE_LOBBY_LOADING,
  // LEAVE_LOBBY_SUCCESS,
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
  REGISTER_LOBBY_COBROWSING_FAIL,
  REGISTER_LOBBY_COBROWSING_SUCCESS,
  REGISTER_LOBBY_COBROWSING_LOADING,
  UNREGISTER_LOBBY_COBROWSING_SUCCESS,
  UNREGISTER_LOBBY_COBROWSING_FAIL,
  ON_LOBBY_UPDATE,
  ON_LOBBY_COBROWSING_UPDATE,
  ON_LOBBY_COBROWSING_MOUSE_UPDATE,
} from '../types';

const initialState = {
  lobby: {
    users: []
  },
  isLoading: false,
  error: null,
  isJoining: false,
  joinError: null,
  isRegisteringCobrowsing: false,
  cobrowsingError: null,
  cobrowsingUser: false,
  cobrowsingState: {
    step: '',
  },
  cobrowsingMouse: {
    x: 0,
    y: 0,
  }
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
    case REGISTER_LOBBY_COBROWSING_LOADING:
      return {
        ...state,
        isRegisteringCobrowsing: true,
      };
    case GET_LOBBY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        lobby: payload.lobby,
      };
    case REGISTER_LOBBY_COBROWSING_SUCCESS:
      return {
        ...state,
        isRegisteringCobrowsing: false,
        cobrowsingUser: payload.cobrowsingUser,
      };
    case UNREGISTER_LOBBY_COBROWSING_SUCCESS:
      return {
        ...state,
        isRegisteringCobrowsing: false,
        cobrowsingUser: null,
      };
    case JOIN_LOBBY_SUCCESS:
      return {
        ...state,
        isJoining: false,
        lobby: {...payload.lobby, users: payload.lobby.users.slice()}
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
        lobby: {
          users: []
        },
      };
    case JOIN_LOBBY_FAIL:
      return {
        ...state,
        isLoading: false,
        isJoining: false,
        lobby: {
          users: []
        },
        joinError: payload.error,
      };
    case REGISTER_LOBBY_COBROWSING_FAIL:
    case UNREGISTER_LOBBY_COBROWSING_FAIL:
      return {
        ...state,
        isRegisteringCobrowsing: false,
        cobrowsingUser: null,
        cobrowsingError: payload.error,
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
          lobby: {
            users: []
          },
          error: payload.error,
        };
     case ON_LOBBY_UPDATE:
      return {
        ...state,
        lobby: {...payload.lobby, users: payload.lobby.users.slice()}
      };
    case ON_LOBBY_COBROWSING_UPDATE:
      return {
        ...state,
        cobrowsingState: {...payload.cobrowsingState }
      };
    case ON_LOBBY_COBROWSING_MOUSE_UPDATE:
      return {
        ...state,
        cobrowsingMouse: {...payload.cobrowsingMouse }
      };
    default:
      return state;
  }
}
