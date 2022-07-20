import { BACKGROUND_LAYER_ID, OVERHEAD_LAYER_ID, PLAYGROUND_LAYER_ID } from '../../constants';
import {
  CLEAR_EDITOR_INSTANCE,
  TOGGLE_LAYER_VISIBILITY
} from '../types';

const initialState = {
  editorInstanceState: {
    layerVisibility: {
      [BACKGROUND_LAYER_ID]: true,
      [PLAYGROUND_LAYER_ID]: true,
      [OVERHEAD_LAYER_ID]: true
    }
  }
};

export default function editorInstanceReducer(state = initialState, { type, payload }) {
  switch (type) {
    case TOGGLE_LAYER_VISIBILITY:
      return {
        ...state,
        editorInstanceState: {
          ...state.editorInstanceState,
          layerVisibility: {
            ...state.editorInstanceState.layerVisibility,
            [payload.layerId]: !state.editorInstanceState.layerVisibility[payload.layerId]
          }
        }
      }
    case CLEAR_EDITOR_INSTANCE:
      return initialState
    default:
      return state;
  }
}
