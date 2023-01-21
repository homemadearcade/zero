import { BACKGROUND_CANVAS_ID, PLAYER_INSTANCE_CANVAS_ID, OBJECT_INSTANCE_CANVAS_ID, FOREGROUND_CANVAS_ID, PLAYGROUND_CANVAS_ID, ZONE_INSTANCE_CANVAS_ID, NPC_INSTANCE_CANVAS_ID } from '../../game/constants';
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

const initialState = {
  layerVisibility: {
    [BACKGROUND_CANVAS_ID]: true,
    [ZONE_INSTANCE_CANVAS_ID]: true,
    [OBJECT_INSTANCE_CANVAS_ID]: true,
    [PLAYGROUND_CANVAS_ID]: true,
    [NPC_INSTANCE_CANVAS_ID]: true,
    [PLAYER_INSTANCE_CANVAS_ID]: true,
    [FOREGROUND_CANVAS_ID]: true
  },
  cameraZoom: 3,
  isGridViewOn: false,
  isSectionEditorOpen: false,
  isSnapshotTakerOpen: false,
  snapshotFileId: null,
  cameraShakeIntensity: null,
  cameraShakeEndTime: 0
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
      return {
        ...state,
        isSnapshotTakerOpen: true,
        snapshotFileId: payload.snapshotFileId
      };
    case CLOSE_SNAPSHOT_TAKER:
      return {
        ...state,
        isSnapshotTakerOpen: false,
        snapshotFileId: null
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
          [payload.canvasId]: !state.layerVisibility[payload.canvasId]
        }
      }
    case CLEAR_GAME_VIEW_EDITOR:
      return initialState
    default:
      return state;
  }
}
