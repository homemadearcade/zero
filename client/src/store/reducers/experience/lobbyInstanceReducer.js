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
  // UPDATE_LOBBY_MEMBER_LOADING,
  // UPDATE_LOBBY_MEMBER_SUCCESS,
  UPDATE_LOBBY_MEMBER_FAIL,
  DELETE_LOBBY_LOADING,
  DELETE_LOBBY_SUCCESS,
  DELETE_LOBBY_FAIL,
  ASSIGN_LOBBY_ROLE_FAIL,
  ON_LOBBY_INSTANCE_UPDATE,
  GAME_INSTANCE_UNDO_LOADING,
  GAME_INSTANCE_UNDO_SUCCESS,
  GAME_INSTANCE_UNDO_FAIL,
  SEND_LOBBY_MESSAGE_FAIL,
  TOGGLE_LOBBY_DASHBOARD,
  ENTER_LOBBY_LINE_LOADING,
  ENTER_LOBBY_LINE_SUCCESS,
  LEAVE_LOBBY_LINE_LOADING,
  LEAVE_LOBBY_LINE_SUCCESS,
  LEAVE_LOBBY_LINE_FAIL,
  ENTER_LOBBY_LINE_FAIL,
  ADD_MEMBER_STORAGE_FAIL
} from '../../types';

const initialState = {
  lobbyInstance: {
    members: [],
    usersInLine: []
  },
  isLobbyDashboardOpen: false,
  isLoading: false,
  error: null,
  isJoined: false,
  isJoining: false,
  joinError: null,
  isUndoing: false,
  myRoleId: null
};

export default function lobbyInstanceReducer(state = initialState, { type, payload }) {
  switch (type) {
    case TOGGLE_LOBBY_DASHBOARD: 
      return {
        ...state,
        isLobbyDashboardOpen: payload.value
      }
    case GAME_INSTANCE_UNDO_LOADING: 
      return {
        ...state,
        isUndoing: true
      }
    case GAME_INSTANCE_UNDO_SUCCESS: 
    case GAME_INSTANCE_UNDO_FAIL: 
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
        lobbyInstance: {...payload.lobbyInstance, members: payload.lobbyInstance.members.slice()},
      };
    case ENTER_LOBBY_LINE_LOADING: 
      return {
        ...state,
        isLoading: true
      }
    case ENTER_LOBBY_LINE_SUCCESS: 
      return {
        ...state,
        isLoading: false,
        isWaitingInLine: true
      }
    case LEAVE_LOBBY_LINE_SUCCESS: 
      return {
        ...state,
        isWaitingInLine: false
      }
    case JOIN_LOBBY_SUCCESS:
      return {
        ...state,
        isWaitingInLine: false,
        isJoining: false,
        isJoined: true,
        lobbyInstance: {...payload.lobbyInstance, members: payload.lobbyInstance.members.slice()},
        myRoleId: payload.myRoleId
      };
    case LEAVE_LOBBY_SUCCESS:
    return {
      ...state,
      isJoining: false,
      isJoined: false,
      myRoleId: null,
      lobbyInstance: initialState.lobbyInstance,
    };
    case EDIT_LOBBY_SUCCESS:
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
    case UPDATE_LOBBY_MEMBER_FAIL:
    case SEND_LOBBY_MESSAGE_FAIL:
    case LEAVE_LOBBY_LINE_FAIL:
    case ENTER_LOBBY_LINE_FAIL:
    case ADD_MEMBER_STORAGE_FAIL:
      return {
        ...state,
        isWaitingInLine: false,
        isLoading: false,
        isJoining: false,
        lobbyInstance: initialState.lobbyInstance,
        error: payload.error,
      };
    case ON_LOBBY_INSTANCE_UPDATE:
      return {
        ...state,
        lobbyInstance: {...payload.lobbyInstance, members: payload.lobbyInstance.members.slice()}
      };
    default:
      return state;
  }
}
