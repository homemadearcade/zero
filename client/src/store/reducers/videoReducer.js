import {
  START_VIDEO_CALL_LOADING,
  START_VIDEO_CALL_SUCCESS,
  START_VIDEO_CALL_FAIL,
  LEAVE_VIDEO_CALL_SUCCESS,
  LEAVE_VIDEO_CALL_FAIL,
  SET_AUDIO_TRACK_ID,
  SET_VIDEO_TRACK_ID,
  BYPASS_VIDEO_CALL
} from '../types';

const initialState = {
  videoTrackId: null,
  audioTrackId: null,
  videoState: {
    isInsideVideoCall: false,
    isConnectingToVideoCall: false,
    error: null,
    bypass: false
  }
};

export default function videoReducer(state = initialState, { type, payload }) {
  switch (type) {
    case BYPASS_VIDEO_CALL:
      return {
        ...state,
        videoState: {
          ...state.videoState,
          isConnectingToVideoCall: false,
          bypass: true
        },
      };
    case START_VIDEO_CALL_LOADING:
      return {
        ...state,
        videoState: {
          ...state.videoState,
          isConnectingToVideoCall: true,
        },
      };
    case START_VIDEO_CALL_SUCCESS:
      return {
        ...state,
        videoState: {
          ...state.videoState,
          isConnectingToVideoCall: false,
          isInsideVideoCall: true,
        },
      };
    case LEAVE_VIDEO_CALL_SUCCESS:
      return {
        ...state,
        videoState: {
          ...state.videoState,
          isConnectingToVideoCall: false,
          isInsideVideoCall: false,
        },
      };
    case START_VIDEO_CALL_FAIL:
    case LEAVE_VIDEO_CALL_FAIL:
      return {
        ...state,
        videoState: {
          ...state.videoState,
          isConnectingToVideoCall: false,
          error: payload.error,
          isInsideVideoCall: false,
        },
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
    default:
      return state;
  }
}
