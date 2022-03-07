import {
  START_COBROWSING_FAIL,
  START_COBROWSING_SUCCESS,
  END_COBROWSING_FAIL,
  END_COBROWSING_SUCCESS,
  UPDATE_COBROWSING_FAIL,
  SUBSCRIBE_COBROWSING_FAIL,
  SUBSCRIBE_COBROWSING_SUCCESS,
  SUBSCRIBE_COBROWSING_LOADING,
  UNSUBSCRIBE_COBROWSING_SUCCESS,
  UNSUBSCRIBE_COBROWSING_FAIL,
  ON_COBROWSING_UPDATE,
} from '../types';

const initialState = {
  isSubscribingCobrowsing: false,
  cobrowsingError: null,
  cobrowsingUser: false,
  cobrowsingState: {
    lobby: {
      step: 'video_connection',
    },
    video: {
      isStarting: false,
      error: null,
    }
  },
};

export default function cobrowsingReducer(state = initialState, { type, payload }) {
  switch (type) {
    case SUBSCRIBE_COBROWSING_LOADING:
      return {
        ...state,
        isSubscribingCobrowsing: true,
      };
    case START_COBROWSING_SUCCESS:
      return {
        ...state,
        cobrowsingUser: payload.cobrowsingUser,
        cobrowsingState: payload.cobrowsingState
      };
    case END_COBROWSING_SUCCESS:
      return {
        ...state,
        cobrowsingUser: null,
      };
    case SUBSCRIBE_COBROWSING_SUCCESS:
      return {
        ...state,
        isSubscribingCobrowsing: false,
        cobrowsingUser: payload.cobrowsingUser,
        cobrowsingState: null,
      };
    case UNSUBSCRIBE_COBROWSING_SUCCESS:
      return {
        ...state,
        isSubscribingCobrowsing: false,
        cobrowsingUser: null,
      };
    case SUBSCRIBE_COBROWSING_FAIL:
    case UNSUBSCRIBE_COBROWSING_FAIL:
      return {
        ...state,
        isSubscribingCobrowsing: false,
        cobrowsingUser: null,
        cobrowsingError: payload.error,
      };
    case UPDATE_COBROWSING_FAIL:
    case START_COBROWSING_FAIL:
    case END_COBROWSING_FAIL:
      return {
        ...state,
        cobrowsingUser: null,
        cobrowsingError: payload.error,
      };
    case ON_COBROWSING_UPDATE:
      return {
        ...state,
        cobrowsingState: {...payload.cobrowsingState }
      };
    default:
      return state;
  }
}
