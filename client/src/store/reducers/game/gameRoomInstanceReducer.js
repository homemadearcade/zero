import {
  LEAVE_GAME_ROOM_SUCCESS,
  LEAVE_GAME_ROOM_FAIL,
  JOIN_GAME_ROOM_LOADING,
  JOIN_GAME_ROOM_SUCCESS,
  JOIN_GAME_ROOM_FAIL,
  GET_GAME_ROOM_LOADING,
  GET_GAME_ROOM_SUCCESS,
  GET_GAME_ROOM_FAIL,
  EDIT_GAME_ROOM_SUCCESS,
  EDIT_GAME_ROOM_FAIL,
  UPDATE_GAME_ROOM_USER_FAIL,
  DELETE_GAME_ROOM_LOADING,
  DELETE_GAME_ROOM_SUCCESS,
  DELETE_GAME_ROOM_FAIL,
  ON_GAME_ROOM_INSTANCE_UPDATE,
  SEND_GAME_ROOM_MESSAGE_FAIL,
  END_GAME_ROOM,
  GAME_INSTANCE_STATE_INITIALIZED,
  GAME_INSTANCE_STATE_RESET,
} from '../../types';

const initialState = {
  gameRoomInstance: {
    members: [],
    gameResetVersion: 1,
    gameInstanceIds: {},
  },
  isLoading: false,
  isGameStateInitialized: false,
  error: null,
  isJoining: false,
  joinError: null,
};

export default function gameRoomInstanceReducer(state = initialState, { type, payload }) {
  switch (type) {
    case GET_GAME_ROOM_LOADING:
    case DELETE_GAME_ROOM_LOADING:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case JOIN_GAME_ROOM_LOADING:
      return {
        ...state,
        isJoining: true,
      };
    case GET_GAME_ROOM_SUCCESS:
      return {
        ...state,
        isLoading: false,
        gameRoomInstance: payload.gameRoomInstance,
      };
    case JOIN_GAME_ROOM_SUCCESS:
      return {
        ...state,
        isJoining: false,
        gameRoomInstance: {...payload.gameRoomInstance, members: payload.gameRoomInstance.members?.slice()}
      };
    case LEAVE_GAME_ROOM_SUCCESS:
      return {
        ...state,
        isJoining: false,
        gameRoomInstance: initialState.gameRoomInstance,
      };
    case EDIT_GAME_ROOM_SUCCESS:
      return {
        ...state,
        isLoading: false,
        gameRoomInstance: {...state.gameRoomInstance, ...payload.gameRoomInstance, members: payload.gameRoomInstance.members?.slice()}
      };
    case DELETE_GAME_ROOM_SUCCESS:
      return {
        ...state,
        isLoading: false,
        gameRoomInstance: initialState.gameRoomInstance,
      };
    case GAME_INSTANCE_STATE_INITIALIZED:
      return { 
        ...state,
        isGameStateInitialized: true,
      }
    case GAME_INSTANCE_STATE_RESET:
      return { 
        ...state,
        isGameStateInitialized: false,
      }
    case JOIN_GAME_ROOM_FAIL:
      return {
        ...state,
        isLoading: false,
        isJoining: false,
        gameRoomInstance: initialState.gameRoomInstance,
        joinError: payload.error,
      };
    case GET_GAME_ROOM_FAIL:
    case EDIT_GAME_ROOM_FAIL:
    case DELETE_GAME_ROOM_FAIL:
    case LEAVE_GAME_ROOM_FAIL:
    case UPDATE_GAME_ROOM_USER_FAIL:
    case SEND_GAME_ROOM_MESSAGE_FAIL:
      return {
        ...state,
        isLoading: false,
        isJoining: false,
        gameRoomInstance: initialState.gameRoomInstance,
        error: payload.error,
      };
    case ON_GAME_ROOM_INSTANCE_UPDATE:
      return {
        ...state,
        gameRoomInstance: {...state.gameRoomInstance, ...payload.gameRoomInstance, members: payload.gameRoomInstance.members?.slice() }
      };
    case END_GAME_ROOM: 
      return {
        ...state,
        gameRoomInstance: initialState.gameRoomInstance,
      }
    default:
      return state;
  }
}
