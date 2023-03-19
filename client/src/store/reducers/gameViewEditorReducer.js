import { BACKGROUND_LAYER_CANVAS_ID, PLAYER_INSTANCE_CANVAS_ID, BASIC_CLASS, FOREGROUND_LAYER_CANVAS_ID, PLAYGROUND_LAYER_CANVAS_ID, ZONE_INSTANCE_CANVAS_ID, NPC_CLASS, STAGE_BACKGROUND_LAYER_CANVAS_ID } from '../../game/constants';
import {
  CLEAR_GAME_VIEW_EDITOR,
  TOGGLE_CANVAS_VISIBILITY,
  TOGGLE_GRID_VIEW,
  OPEN_SECTION_EDITOR,
  CLOSE_SECTION_EDITOR,
  OPEN_SNAPSHOT_TAKER,
  CLOSE_SNAPSHOT_TAKER,
  CHANGE_EDITOR_CAMERA_ZOOM,
} from '../types';

// these are editor things that take place within the game view
const initialState = {
  layerVisibility: {
    [STAGE_BACKGROUND_LAYER_CANVAS_ID]: true,
    [BACKGROUND_LAYER_CANVAS_ID]: true,
    [ZONE_INSTANCE_CANVAS_ID]: false,
    [BASIC_CLASS]: true,
    [PLAYGROUND_LAYER_CANVAS_ID]: true,
    [NPC_CLASS]: true,
    [PLAYER_INSTANCE_CANVAS_ID]: true,
    [FOREGROUND_LAYER_CANVAS_ID]: true
  },
  cameraZoom: 3,
  isGridViewOn: false,
  isSectionEditorOpen: false,
  isSnapshotTakerOpen: false,
  snapshotTextureId: null,
  // this could be on the playerInterface reducer
  cameraShakeIntensity: null,
  cameraShakeEndTime: 0,
};

export const initialGameViewEditorState = initialState

export default function gameViewEditorReducer(state = initialState, { type, payload }) {
  switch (type) {
    case CHANGE_EDITOR_CAMERA_ZOOM: {
      return {
        ...state,
        cameraZoom: payload.cameraZoom
      }
    }
    case OPEN_SNAPSHOT_TAKER:
      document.body.style.cursor = 'cell'

      return {
        ...state,
        isSnapshotTakerOpen: true,
        snapshotTextureId: payload.snapshotTextureId
      };
    case CLOSE_SNAPSHOT_TAKER:
      document.body.style.cursor = null 
      return {
        ...state,
        isSnapshotTakerOpen: false,
        snapshotTextureId: null
      };
    case OPEN_SECTION_EDITOR:
      return {
        ...state,
        isSectionEditorOpen: true,
        isGridViewOn: true,
        cameraZoom: 1,
      };
    case CLOSE_SECTION_EDITOR:
      return {
        ...state,
        isSectionEditorOpen: false,
      };
    case TOGGLE_GRID_VIEW: 
      if(payload.value !== undefined) {
        return {
          ...state,
          isGridViewOn: payload.value
        }
      }
      return {
        ...state,
        isGridViewOn: !state.isGridViewOn,
      }
    case TOGGLE_CANVAS_VISIBILITY:
      return {
        ...state,
        layerVisibility: {
          ...state.layerVisibility,
          [payload.layerCanvasId]: !state.layerVisibility[payload.layerCanvasId]
        }
      }
    case CLEAR_GAME_VIEW_EDITOR:
      return initialState
    default:
      return state;
  }
}
