import {
  CODRAWING_STROKE_FAILED,
  SUBSCRIBE_CODRAWING_LOADING,
  SUBSCRIBE_CODRAWING_SUCCESS,
  SUBSCRIBE_CODRAWING_FAIL,
  UNSUBSCRIBE_CODRAWING_SUCCESS,
  UNSUBSCRIBE_CODRAWING_FAIL,
  CODRAWING_UNDO_LOADING,
  CODRAWING_UNDO_SUCCESS,
  CODRAWING_UNDO_FAIL,
} from '../types';

// import { BACKGROUND_LAYER_CANVAS_ID, PLAYGROUND_LAYER_CANVAS_ID, FOREGROUND_LAYER_CANVAS_ID } from '../../constants';

const initialState = {
  error: null,
  isSubscribingCodrawing: false,
  isUndoing: false
  // codrawingCanvasIds: {
  //   [BACKGROUND_LAYER_CANVAS_ID]: false,
  //   [PLAYGROUND_LAYER_CANVAS_ID]: false,
  //   [FOREGROUND_LAYER_CANVAS_ID]: false
  // }
};

export default function codrawingReducer(state = initialState, { type, payload }) {
  switch (type) {
    case CODRAWING_UNDO_LOADING: 
    return {
      ...state,
      isUndoing: true
    }
  case CODRAWING_UNDO_SUCCESS: 
  case CODRAWING_UNDO_FAIL: 
    return {
      ...state,
      isUndoing: false
    }
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
