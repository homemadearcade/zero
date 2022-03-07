import {
  START_VIDEO_CALL_LOADING,
  START_VIDEO_CALL_SUCCESS,
  START_VIDEO_CALL_FAIL,
} from '../types';

const initialState = {
  isStarting: false,
  isConnected: false,
  lobbyId: false,
  error: null
};

export default function videoReducer(state = initialState, { type, payload }) {
  switch (type) {
    case START_VIDEO_CALL_LOADING:
      return {
        ...state,
        isStarting: true,
      };
    case START_VIDEO_CALL_SUCCESS:
      return {
        ...state,
        isStarting: false,
        isConnected: true,
        lobbyId: payload.lobbyId
      };
    case START_VIDEO_CALL_FAIL:
      return {
        ...state,
        isStarting: false,
        isConnected: false,
        error: payload.error
      };
    default:
      return state;
  }
}
