import { inIframe, isLocalHost } from '../../../utils/webPageUtils';
import {
  START_VIDEO_CALL_LOADING,
  START_VIDEO_CALL_SUCCESS,
  START_VIDEO_CALL_FAIL,
  LEAVE_VIDEO_CALL_SUCCESS,
  LEAVE_VIDEO_CALL_FAIL,
  SET_AUDIO_TRACK_ID,
  SET_VIDEO_TRACK_ID,
  BYPASS_VIDEO_CALL,
  SET_CUT_VIDEO,
  SET_CUT_AUDIO,
  SET_VIDEO_TRACK_INTERFACE_ID_OPEN,
  SET_VIDEO_TRACK_INTERFACE_ID_CLOSED,
  SET_CURRENT_VIDEO_TRACK_INTERFACE_ID
} from '../../types';

function defaultBypass() {
  return inIframe() || isLocalHost()// || 
}

const initialState = {
  videoTrackId: null,
  audioTrackId: null,
  isInsideVideoCall: false,
  isConnectingToVideoCall: inIframe(),
  cutVideo: false,
  cutAudio: false,
  error: null,
  bypass: defaultBypass(),
  videoTrackInterfaceIdsOpen: {},
  currentVideoTrackInterfaceId: {}
};

export const initialVideoState = initialState

let agoraPreferences

export default function videoReducer(state = initialState, { type, payload }) {
  switch (type) {
    case BYPASS_VIDEO_CALL:
      return {
        ...state,
        isConnectingToVideoCall: false,
        bypass: true
      };
    case START_VIDEO_CALL_LOADING:
      return {
        ...state,
        isConnectingToVideoCall: true,
      };
    case START_VIDEO_CALL_SUCCESS:
      return {
        ...state,
        isConnectingToVideoCall: false,
        isInsideVideoCall: true,
      };
    case SET_CUT_VIDEO:
      return {
        ...state,
        cutVideo: payload.value
      };
    case SET_CUT_AUDIO:
      return {
        ...state,
        cutAudio: payload.value
      };
    case LEAVE_VIDEO_CALL_SUCCESS:
      return {
        ...state,
        isConnectingToVideoCall: false,
        isInsideVideoCall: false,
        bypass: defaultBypass()
      };
    case START_VIDEO_CALL_FAIL:
    case LEAVE_VIDEO_CALL_FAIL:
      return {
        ...state,
        isConnectingToVideoCall: false,
        error: payload.error,
        isInsideVideoCall: false,
        bypass: true
      };
    case SET_VIDEO_TRACK_ID:
      agoraPreferences = window.LocalStorageSession.getItem("agoraPreferences");
      agoraPreferences.videoTrackId = payload.videoTrackId
      window.LocalStorageSession.setItem("agoraPreferences", agoraPreferences);
      return {
        ...state,
        videoTrackId: payload.videoTrackId
      };
    case SET_AUDIO_TRACK_ID:
      agoraPreferences = window.LocalStorageSession.getItem("agoraPreferences");
      agoraPreferences.audioTrackId = payload.audioTrackId
      window.LocalStorageSession.setItem("agoraPreferences", agoraPreferences);
      return {
        ...state,
        audioTrackId: payload.audioTrackId
      };
    case SET_VIDEO_TRACK_INTERFACE_ID_OPEN: 
      return {
        ...state,
        videoTrackInterfaceIdsOpen: {
          ...state.videoTrackInterfaceIdsOpen,
          [payload.userId]: {
            ...state.videoTrackInterfaceIdsOpen[payload.userId],
            [payload.interfaceId]: true
          }
        }
      }
    case SET_VIDEO_TRACK_INTERFACE_ID_CLOSED: 
      return {
        ...state,
        videoTrackInterfaceIdsOpen: {
          ...state.videoTrackInterfaceIdsOpen,
          [payload.userId]: {
            ...state.videoTrackInterfaceIdsOpen[payload.userId],
            [payload.interfaceId]: false
          }
        }
      }
    case SET_CURRENT_VIDEO_TRACK_INTERFACE_ID: {
      return {
        ...state,
        currentVideoTrackInterfaceId: {
          ...state.currentVideoTrackInterfaceId,
          [payload.userId]: payload.interfaceId
        }
      }
    }
    default:
      return state;
  }
}
