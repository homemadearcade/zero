import { ZONE_ENTITY_IID } from '../../../constants/interfaceIds';
import {
  CLEAR_GAME_VIEW_EDITOR,
  TOGGLE_LAYER_VISIBILITY,
  TOGGLE_GRID_VIEW,
  OPEN_SECTION_EDITOR,
  CLOSE_SECTION_EDITOR,
  OPEN_SNAPSHOT_TAKER,
  CLOSE_SNAPSHOT_TAKER,
  CHANGE_EDITOR_CAMERA_ZOOM,
  SET_RESIZING_ENTITY_INSTANCE_ID,
  CLEAR_EDITOR,
} from '../../types';

// these are editor things that take place within the game view
const initialState = {
  layerInvisibility: {
    [ZONE_ENTITY_IID]: true,
  },
  cameraZoom: 3,
  isGridViewOn: false,
  isBoundaryEditorOpen: false,
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
      return {
        ...state,
        isSnapshotTakerOpen: true,
        snapshotTextureId: payload.snapshotTextureId
      };
    case CLOSE_SNAPSHOT_TAKER:
      return {
        ...state,
        isSnapshotTakerOpen: false,
        snapshotTextureId: null
      };
    case OPEN_SECTION_EDITOR:
      return {
        ...state,
        isBoundaryEditorOpen: true,
        isGridViewOn: true,
        cameraZoom: 1,
      };
    case CLOSE_SECTION_EDITOR:
      return {
        ...state,
        isBoundaryEditorOpen: false,
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
    case SET_RESIZING_ENTITY_INSTANCE_ID: 
      return {
        ...state,
        resizingEntityInstanceId: payload.entityInstanceId
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
    case CLEAR_EDITOR:
      return initialState
    default:
      return state;
  }
}
