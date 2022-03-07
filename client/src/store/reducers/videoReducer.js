import {
  START_VIDEO_CALL_LOADING,
  START_VIDEO_CALL_SUCCESS,
  START_VIDEO_CALL_FAIL,
  VIDEO_STATE_UPDATE
} from '../types';

const initialState = {
  isConnected: false,
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
    case START_VIDEO_CALL_FAIL:
      return {
        ...state,
        videoState: {
          ...state.videoState,
          isStarting: false,
        },
        isConnected: false,
        error: payload.error
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
