import { ZONE_CLASS } from '../../../game/constants';
import {
  CLEAR_GAME_VIEW_EDITOR,
  TOGGLE_LAYER_VISIBILITY,
  TOGGLE_GRID_VIEW,
  OPEN_SECTION_EDITOR,
  CLOSE_SECTION_EDITOR,
  OPEN_SNAPSHOT_TAKER,
  CLOSE_SNAPSHOT_TAKER,
  CHANGE_EDITOR_CAMERA_ZOOM,
} from '../../types';

// these are editor things that take place within the game view
const initialState = {
  layerInvisibility: {
    [ZONE_CLASS]: true,
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
    case TOGGLE_LAYER_VISIBILITY:
      return {
        ...state,
        layerInvisibility: {
          ...state.layerInvisibility,
          [payload.layerId]: !state.layerInvisibility[payload.layerId]
        }
      }
    case CLEAR_GAME_VIEW_EDITOR:
      return initialState
    default:
      return state;
  }
}
