import {
  START_VIDEO_CALL_LOADING,
  START_VIDEO_CALL_SUCCESS,
  START_VIDEO_CALL_FAIL,
  LEAVE_VIDEO_CALL_SUCCESS,
  LEAVE_VIDEO_CALL_FAIL,
  VIDEO_STATE_UPDATE,
  SET_AUDIO_TRACK_ID,
  SET_VIDEO_TRACK_ID
} from '../types';

const initialState = {
  isConnected: false,
  videoTrackId: null,
  audioTrackId: null,
  videoState: {
    isStarting: false,
    error: null,
  }
};

export default function videoReducer(state = initialState, { type, payload }) {
  switch (type) {
    case START_VIDEO_CALL_LOADING:
      return {
        ...state,
        videoState: {
          ...state.videoState,
          isStarting: true,
        },
      };
    case START_VIDEO_CALL_SUCCESS:
      return {
        ...state,
        videoState: {
          ...state.videoState,
          isStarting: false,
        },
        isConnected: true,
      };
    case LEAVE_VIDEO_CALL_SUCCESS:
      return {
        ...state,
        videoState: {
          ...state.videoState,
          isStarting: false,
        },
        isConnected: false,
      };
    case START_VIDEO_CALL_FAIL:
    case LEAVE_VIDEO_CALL_FAIL:
      return {
        ...state,
        videoState: {
          ...state.videoState,
          isStarting: false,
          error: payload.error
        },
        isConnected: false,
      };
    case SET_VIDEO_TRACK_ID:
      return {
        ...state,
        videoTrackId: payload.videoTrackId
      };
    case SET_AUDIO_TRACK_ID:
      return {
        ...state,
        audioTrackId: payload.audioTrackId
      };
    case VIDEO_STATE_UPDATE: 
      return {
        ...state,
        videoState: payload.videoState
      };
    default:
      return state;
  }
}
