import {
  CODRAWING_STROKE_FAILED,
  SUBSCRIBE_CODRAWING_LOADING,
  SUBSCRIBE_CODRAWING_SUCCESS,
  SUBSCRIBE_CODRAWING_FAIL,
  UNSUBSCRIBE_CODRAWING_SUCCESS,
  UNSUBSCRIBE_CODRAWING_FAIL,
} from '../types';

// import { BACKGROUND_CANVAS_ID, PLAYGROUND_CANVAS_ID, FOREGROUND_CANVAS_ID } from '../../constants';

const initialState = {
  error: null,
  isSubscribingCobrowsing: false,
  // codrawingCanvasIds: {
  //   [BACKGROUND_CANVAS_ID]: false,
  //   [PLAYGROUND_CANVAS_ID]: false,
  //   [FOREGROUND_CANVAS_ID]: false
  // }
};

export default function codrawingReducer(state = initialState, { type, payload }) {
  switch (type) {
    case SUBSCRIBE_CODRAWING_LOADING:
      return {
        ...state,
        isSubscribingCodrawing: true,
      };
    case SUBSCRIBE_CODRAWING_SUCCESS:
      return {
        ...state,
        isSubscribingCodrawing: false,
        // codrawingCanvasIds: {...state.codrawingCanvasIds, [payload.cobrowsingCanvasId] : true },
      };
    case UNSUBSCRIBE_CODRAWING_SUCCESS:
      return {
        ...state,
        // codrawingCanvasIds: {...state.codrawingCanvasIds, [payload.cobrowsingCanvasId] : false },
      };
    case CODRAWING_STROKE_FAILED:
    case SUBSCRIBE_CODRAWING_FAIL:
    case UNSUBSCRIBE_CODRAWING_FAIL:
      return {
        ...state,
        error: payload.error,
      };
    default:
      return state;
  }
}
