import {
  // LEAVE_LOBBY_LOADING,
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
  START_LOBBY_COBROWSING_FAIL,
  START_LOBBY_COBROWSING_SUCCESS,
  END_LOBBY_COBROWSING_FAIL,
  END_LOBBY_COBROWSING_SUCCESS,
  SUBSCRIBE_LOBBY_COBROWSING_FAIL,
  SUBSCRIBE_LOBBY_COBROWSING_SUCCESS,
  SUBSCRIBE_LOBBY_COBROWSING_LOADING,
  UNSUBSCRIBE_LOBBY_COBROWSING_SUCCESS,
  UNSUBSCRIBE_LOBBY_COBROWSING_FAIL,
  ON_LOBBY_UPDATE,
  ON_LOBBY_USER_STATUS_UPDATE,
  ON_LOBBY_COBROWSING_UPDATE,
  ON_LOBBY_COBROWSING_STATUS_UPDATE,
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
  isSubscribingCobrowsing: false,
  cobrowsingError: null,
  cobrowsingUser: false,
  cobrowsingState: {
    step: '',
  },
  cobrowsingMouse: {
    xPercent: 0,
    yPercent: 0,
    lastPing: null,
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
    case SUBSCRIBE_LOBBY_COBROWSING_LOADING:
      return {
        ...state,
        isSubscribingCobrowsing: true,
      };
    case GET_LOBBY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        lobby: payload.lobby,
      };
    case START_LOBBY_COBROWSING_SUCCESS:
      return {
        ...state,
        cobrowsingUser: payload.cobrowsingUser,
      };
    case END_LOBBY_COBROWSING_SUCCESS:
      return {
        ...state,
        cobrowsingUser: null,
      };
    case SUBSCRIBE_LOBBY_COBROWSING_SUCCESS:
      return {
        ...state,
        isSubscribingCobrowsing: false,
        cobrowsingUser: payload.cobrowsingUser,
      };
    case UNSUBSCRIBE_LOBBY_COBROWSING_SUCCESS:
      return {
        ...state,
        isSubscribingCobrowsing: false,
        cobrowsingUser: null,
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
    case SUBSCRIBE_LOBBY_COBROWSING_FAIL:
    case UNSUBSCRIBE_LOBBY_COBROWSING_FAIL:
      return {
        ...state,
        isSubscribingCobrowsing: false,
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
        lobby: initialState.lobby,
        error: payload.error,
      };
    case START_LOBBY_COBROWSING_FAIL:
    case END_LOBBY_COBROWSING_FAIL:
      return {
        ...state,
        cobrowsingUser: null,
        cobrowsingError: payload.error,
      };
    case ON_LOBBY_UPDATE:
      return {
        ...state,
        lobby: {...payload.lobby, users: payload.lobby.users.slice()}
      };
    case ON_LOBBY_USER_STATUS_UPDATE:
      return {
        ...state,
        lobbyUserStatus: {...state.lobbyUserStatus, [payload.userId]: payload.status }
      };
    case ON_LOBBY_COBROWSING_UPDATE:
      return {
        ...state,
        cobrowsingState: {...payload.cobrowsingState }
      };
    case ON_LOBBY_COBROWSING_STATUS_UPDATE:
      return {
        ...state,
        cobrowsingMouse: {...state.cobrowsingMouse, [payload.userId]: payload.cobrowsingMouse }
      };
    default:
      return state;
  }
}
