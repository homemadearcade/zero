import { BACKGROUND_LAYER_ID, HERO_INSTANCE_LAYER_ID, OBJECT_INSTANCE_LAYER_ID, OVERHEAD_LAYER_ID, PLAYGROUND_LAYER_ID } from '../../constants';
import {
  CLEAR_EDITOR_INSTANCE,
  TOGGLE_LAYER_VISIBILITY,
  TOGGLE_GAME_INSTANCE_PAUSED,
  RESET_GAME_INSTANCE
} from '../types';

const initialState = {
  editorInstanceState: {
    layerVisibility: {
      [BACKGROUND_LAYER_ID]: true,
      [PLAYGROUND_LAYER_ID]: true,
      [OBJECT_INSTANCE_LAYER_ID]: true,
      [HERO_INSTANCE_LAYER_ID]: true,
      [OVERHEAD_LAYER_ID]: true
    },
    resetGameIndex: 0,
    isGamePaused: false,
  }
};

export default function editorInstanceReducer(state = initialState, { type, payload }) {
  switch (type) {
    case RESET_GAME_INSTANCE:
      return {
        ...state,
        editorInstanceState: {
          ...state.editorInstanceState,
          resetGameIndex: !state.editorInstanceState.resetGameIndex + 1
        }
      }
    case TOGGLE_GAME_INSTANCE_PAUSED:
      return {
        ...state,
        editorInstanceState: {
          ...state.editorInstanceState,
          isGamePaused: !state.editorInstanceState.isGamePaused
        }
      }
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
