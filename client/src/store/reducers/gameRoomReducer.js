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
  ON_GAME_ROOM_UPDATE,
  SEND_GAME_ROOM_MESSAGE_FAIL,
  END_GAME_ROOM,
} from '../types';

const initialState = {
  gameRoom: {
    members: []
  },
  isLoading: false,
  error: null,
  isJoining: false,
  joinError: null,
};

export default function gameRoomReducer(state = initialState, { type, payload }) {
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
        gameRoom: payload.gameRoom,
      };
    case JOIN_GAME_ROOM_SUCCESS:
      return {
        ...state,
        isJoining: false,
        gameRoom: {...payload.gameRoom, members: payload.gameRoom.invitedUsers.slice()}
      };
    case LEAVE_GAME_ROOM_SUCCESS:
    return {
      ...state,
      isJoining: false,
      gameRoom: initialState.gameRoom,
    };
    case EDIT_GAME_ROOM_SUCCESS:
      return {
        ...state,
        isLoading: false,
        gameRoom: {...state.gameRoom, ...payload.gameRoom, members: payload.gameRoom.invitedUsers?.slice()}
      };
    case DELETE_GAME_ROOM_SUCCESS:
      return {
        ...state,
        isLoading: false,
        gameRoom: initialState.gameRoom,
      };
    case JOIN_GAME_ROOM_FAIL:
      return {
        ...state,
        isLoading: false,
        isJoining: false,
        gameRoom: initialState.gameRoom,
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
        gameRoom: initialState.gameRoom,
        error: payload.error,
      };
    case ON_GAME_ROOM_UPDATE:
      return {
        ...state,
        gameRoom: {...state.gameRoom, ...payload.gameRoom, members: payload.gameRoom.invitedUsers?.slice()}
      };
    case END_GAME_ROOM: 
      return {
        ...state,
        gameRoom: initialState.gameRoom,
      }
    default:
      return state;
  }
}
