import { COBROWSING_CONNECTION_LOST, CODRAWING_CONNECTION_LOST, GAME_CONNECTION_LOST, INTERNET_SPEED_TEST_FAIL, PHASER_ERROR, SOCKET_CONNECTION_LOST } from '../../lobby/constants';
import { generateUniqueId } from '../../utils/webPageUtils';
import {
  ME_FAIL,
  ADD_ARCADE_GAME_FAIL,
  GET_USER_FAIL,
  ADD_LOBBY_FAIL,
  EDIT_GAME_MODEL_FAIL,
  EDIT_USER_FAIL,
  GET_ARCADE_GAMES_FAIL,
  GET_LOBBY_FAIL,
  GET_USERS_FAIL,
  LOAD_GAME_MODEL_FAIL,
  EDIT_LOBBY_FAIL,
  GET_LOBBYS_FAIL,
  JOIN_LOBBY_FAIL,
  ADD_MESSAGE_FAIL,
  LEAVE_LOBBY_FAIL,
  DELETE_USER_FAIL,
  DELETE_LOBBY_FAIL,
  EDIT_MESSAGE_FAIL,
  GET_MESSAGES_FAIL,
  DELETE_MESSAGE_FAIL,
  END_COBROWSING_FAIL,
  RESEED_DATABASE_FAIL,
  UNSUBSCRIBE_COBROWSING_FAIL,
  LEAVE_VIDEO_CALL_FAIL,
  LOGIN_WITH_EMAIL_FAIL,
  LOGIN_WITH_OAUTH_FAIL,
  START_VIDEO_CALL_FAIL,
  ON_AUTHENTICATE_SOCKET_FAIL,
  UNSUBSCRIBE_CODRAWING_FAIL,
  SUBSCRIBE_COBROWSING_FAIL,
  GET_SPRITESHEET_DATA_FAIL,
  SUBSCRIBE_CODRAWING_FAIL,
  REGISTER_WITH_EMAIL_FAIL,
  AUTHENTICATE_SOCKET_FAIL,
  CODRAWING_STROKE_FAILED,
  UPDATE_LOBBY_USER_FAIL,
  UPDATE_COBROWSING_FAIL,
  START_COBROWSING_FAIL,
  ASSIGN_LOBBY_ROLE_FAIL,
  CLEAR_ERROR,
  ADD_INTERFACE_PRESET_FAIL,
  EDIT_INTERFACE_PRESET_FAIL,
  GET_INTERFACE_PRESET_FAIL,
  GET_INTERFACE_PRESETS_FAIL,
  ADD_TICKETED_EVENT_FAIL,
  EDIT_TICKETED_EVENT_FAIL,
  GET_TICKETED_EVENTS_FAIL,
  GET_TICKETED_EVENT_FAIL,
  CHANGE_ERROR_STATE,
  CLEAR_ERROR_STATE,
  GET_GAME_SESSION_FAIL,
  EDIT_GAME_SESSION_FAIL,
  DELETE_GAME_SESSION_FAIL,
  UPDATE_GAME_SESSION_USER_FAIL,
  SEND_GAME_SESSION_MESSAGE_FAIL,
  LEAVE_GAME_SESSION_FAIL,
  
} from '../types';

const initialState = {
  errors: [],
  errorStates: {
    [PHASER_ERROR]: {
      on: false,
    },
    [GAME_CONNECTION_LOST]: {
      on: false,
      message: ''
    },
    [COBROWSING_CONNECTION_LOST]: {
      on: false,
      userId: null
    },
    [CODRAWING_CONNECTION_LOST]: {
      canvasId: null,
      on: false,
    },
    [SOCKET_CONNECTION_LOST]: {
      on: false
    },
    [INTERNET_SPEED_TEST_FAIL]: {
      on: false
    }
  }
}

export const initialErrorState = initialState

export default function errorReducer(state = initialState, { type, payload }) {
  switch (type) {
    case GET_GAME_SESSION_FAIL:
    case EDIT_GAME_SESSION_FAIL:
    case DELETE_GAME_SESSION_FAIL:
    case LEAVE_GAME_SESSION_FAIL:
    case UPDATE_GAME_SESSION_USER_FAIL:
    case SEND_GAME_SESSION_MESSAGE_FAIL:
    case ADD_INTERFACE_PRESET_FAIL:
    case EDIT_INTERFACE_PRESET_FAIL:
    case GET_INTERFACE_PRESET_FAIL:
    case GET_INTERFACE_PRESETS_FAIL:
    case ADD_TICKETED_EVENT_FAIL:
    case EDIT_TICKETED_EVENT_FAIL:
    case GET_TICKETED_EVENTS_FAIL:
    case GET_TICKETED_EVENT_FAIL:
    case ME_FAIL:
    case ADD_ARCADE_GAME_FAIL:
    case GET_USER_FAIL:
    case ADD_LOBBY_FAIL:
    case EDIT_GAME_MODEL_FAIL:
    case EDIT_USER_FAIL:
    case GET_ARCADE_GAMES_FAIL:
    case GET_LOBBY_FAIL:
    case GET_USERS_FAIL:
    case LOAD_GAME_MODEL_FAIL:
    case EDIT_LOBBY_FAIL:
    case GET_LOBBYS_FAIL:
    case JOIN_LOBBY_FAIL:
    case ADD_MESSAGE_FAIL:
    case LEAVE_LOBBY_FAIL:
    case DELETE_USER_FAIL:
    case DELETE_LOBBY_FAIL:
    case EDIT_MESSAGE_FAIL:
    case GET_MESSAGES_FAIL:
    case DELETE_MESSAGE_FAIL:
    case END_COBROWSING_FAIL:
    case RESEED_DATABASE_FAIL:
    case UNSUBSCRIBE_COBROWSING_FAIL:
    case LEAVE_VIDEO_CALL_FAIL:
    case LOGIN_WITH_EMAIL_FAIL:
    case LOGIN_WITH_OAUTH_FAIL:
    case START_VIDEO_CALL_FAIL:
    case ON_AUTHENTICATE_SOCKET_FAIL:
    case UNSUBSCRIBE_CODRAWING_FAIL:
    case SUBSCRIBE_COBROWSING_FAIL:
    case GET_SPRITESHEET_DATA_FAIL:
    case SUBSCRIBE_CODRAWING_FAIL:
    case REGISTER_WITH_EMAIL_FAIL:
    case AUTHENTICATE_SOCKET_FAIL:
    case CODRAWING_STROKE_FAILED:
    case UPDATE_LOBBY_USER_FAIL:
    case UPDATE_COBROWSING_FAIL:
    case START_COBROWSING_FAIL:
    case ASSIGN_LOBBY_ROLE_FAIL:
      return {
        ...state,
        errors: 
        [...state.errors, {message: payload.error, type, id: generateUniqueId()}]
      }
    case CLEAR_ERROR:
      return {
        ...state,
        errors: state.errors.filter(({id}) => {
          if (id === payload.id) return false;
          return true
        })
      }
    case CHANGE_ERROR_STATE: 
      return {
        ...state,
        errorStates: {
          ...state.errorStates,
          [payload.errorState]: {
            ...payload.data,
            on: true
          }
        }
      }
    case CLEAR_ERROR_STATE: 
      return {
        ...state,
        errorStates: {
          ...state.errorStates,
          [payload.errorState]: initialState.errorStates[payload.errorState]
        }
      }
    default:
      return state;
  }
}
