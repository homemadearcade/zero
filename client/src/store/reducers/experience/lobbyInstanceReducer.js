import {
  LEAVE_LOBBY_SUCCESS,
  LEAVE_LOBBY_FAIL,
  JOIN_LOBBY_LOADING,
  JOIN_LOBBY_SUCCESS,
  JOIN_LOBBY_FAIL,
  GET_LOBBY_LOADING,
  GET_LOBBY_SUCCESS,
  GET_LOBBY_FAIL,
  EDIT_LOBBY_SUCCESS,
  EDIT_LOBBY_FAIL,
  // UPDATE_LOBBY_USER_LOADING,
  // UPDATE_LOBBY_USER_SUCCESS,
  UPDATE_LOBBY_USER_FAIL,
  DELETE_LOBBY_LOADING,
  DELETE_LOBBY_SUCCESS,
  DELETE_LOBBY_FAIL,
  ASSIGN_LOBBY_ROLE_FAIL,
  ON_LOBBY_INSTANCE_UPDATE,
  LOBBY_UNDO_LOADING,
  LOBBY_UNDO_SUCCESS,
  LOBBY_UNDO_FAIL,
  SEND_LOBBY_MESSAGE_FAIL,
  TOGGLE_LOBBY_DASHBOARD
} from '../../types';

const initialState = {
  lobbyInstance: {
    members: []
  },
  isLobbyDashboardOpen: false,
  isLoading: false,
  error: null,
  isJoining: false,
  joinError: null,
  isUndoing: false,
};

export default function lobbyInstanceReducer(state = initialState, { type, payload }) {
  switch (type) {
    case TOGGLE_LOBBY_DASHBOARD: 
      return {
        ...state,
        isLobbyDashboardOpen: payload.value
      }
    case LOBBY_UNDO_LOADING: 
      return {
        ...state,
        isUndoing: true
      }
    case LOBBY_UNDO_SUCCESS: 
    case LOBBY_UNDO_FAIL: 
      return {
        ...state,
        isUndoing: false
      }
    case GET_LOBBY_LOADING:
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
        lobbyInstance: payload.lobbyInstance,
      };
    case JOIN_LOBBY_SUCCESS:
              console.log(payload)

      return {
        ...state,
        isJoining: false,
        isInsideLobby: true,
        lobbyInstance: {...payload.lobbyInstance, members: payload.lobbyInstance.members.slice()}
      };
    case LEAVE_LOBBY_SUCCESS:
    return {
      ...state,
      isJoining: false,
      isInsideLobby: false,
      lobbyInstance: initialState.lobbyInstance,
    };
    case EDIT_LOBBY_SUCCESS:
              console.log(payload)

      return {
        ...state,
        isLoading: false,
        lobbyInstance: {...payload.lobbyInstance, members: payload.lobbyInstance.members.slice()}
      };
    case DELETE_LOBBY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        lobbyInstance: initialState.lobbyInstance,
      };
    case JOIN_LOBBY_FAIL:
      return {
        ...state,
        isLoading: false,
        isJoining: false,
        lobbyInstance: initialState.lobbyInstance,
        joinError: payload.error,
      };
    case GET_LOBBY_FAIL:
    case EDIT_LOBBY_FAIL:
    case DELETE_LOBBY_FAIL:
    case LEAVE_LOBBY_FAIL:
    case ASSIGN_LOBBY_ROLE_FAIL:
    case UPDATE_LOBBY_USER_FAIL:
    case SEND_LOBBY_MESSAGE_FAIL:
      return {
        ...state,
        isLoading: false,
        isJoining: false,
        lobbyInstance: initialState.lobbyInstance,
        error: payload.error,
      };
    case ON_LOBBY_INSTANCE_UPDATE:
              console.log(payload)

      return {
        ...state,
        lobbyInstance: {...payload.lobbyInstance, members: payload.lobbyInstance.members.slice()}
      };
    default:
      return state;
  }
}
