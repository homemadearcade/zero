import { BACKGROUND_CANVAS_ID, HERO_INSTANCE_CANVAS_ID, OBJECT_INSTANCE_CANVAS_ID, FOREGROUND_CANVAS_ID, PLAYGROUND_CANVAS_ID } from '../../constants';
import {
  CLEAR_EDITOR_INSTANCE,
  TOGGLE_CANVAS_VISIBILITY,
  TOGGLE_GAME_INSTANCE_PAUSED,
  RESET_GAME_INSTANCE
} from '../types';

const initialState = {
  layerVisibility: {
    [BACKGROUND_CANVAS_ID]: true,
    [PLAYGROUND_CANVAS_ID]: true,
    [OBJECT_INSTANCE_CANVAS_ID]: true,
    [HERO_INSTANCE_CANVAS_ID]: true,
    [FOREGROUND_CANVAS_ID]: true
  },
  // gameResetDate: 0,
  // isGamePaused: false,
};

export const initialEditorInstanceState = initialState

export default function editorInstanceReducer(state = initialState, { type, payload }) {
  switch (type) {
    // case RESET_GAME_INSTANCE:
    //   return {
    //     ...state,
    //     gameResetDate: Date.now()
    //   }
    // case TOGGLE_GAME_INSTANCE_PAUSED:
    //   return {
    //     ...state,
    //     isGamePaused: !state.isGamePaused
    //   }
    case TOGGLE_CANVAS_VISIBILITY:
      return {
        ...state,
        layerVisibility: {
          ...state.layerVisibility,
          [payload.canvasId]: !state.layerVisibility[payload.canvasId]
        }
      }
    case CLEAR_EDITOR_INSTANCE:
      return initialState
    default:
      return state;
  }
}
