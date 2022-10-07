import { BACKGROUND_CANVAS_ID, HERO_INSTANCE_CANVAS_ID, OBJECT_INSTANCE_CANVAS_ID, FOREGROUND_CANVAS_ID, PLAYGROUND_CANVAS_ID, ZONE_INSTANCE_CANVAS_ID } from '../../constants';
import {
  CLEAR_EDITOR_INSTANCE,
  TOGGLE_CANVAS_VISIBILITY,
  TOGGLE_GRID_VIEW,
  OPEN_SECTION_EDITOR,
  CLOSE_SECTION_EDITOR,
  OPEN_SNAPSHOT_TAKER,
  CLOSE_SNAPSHOT_TAKER,
  CHANGE_EDITOR_CAMERA_ZOOM
} from '../types';

const initialState = {
  layerVisibility: {
    [BACKGROUND_CANVAS_ID]: true,
    [PLAYGROUND_CANVAS_ID]: true,
    [OBJECT_INSTANCE_CANVAS_ID]: true,
    [HERO_INSTANCE_CANVAS_ID]: true,
    [ZONE_INSTANCE_CANVAS_ID]: true,
    [FOREGROUND_CANVAS_ID]: true
  },
  cameraZoom: 3,
  isGridViewOn: false,
  isSectionEditorOpen: false,
  isSnapshotTakerOpen: false,
  snapshotFileId: null
};

export const initialEditorInstanceState = initialState

export default function editorInstanceReducer(state = initialState, { type, payload }) {
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
    case CLEAR_EDITOR_INSTANCE:
      return initialState
    default:
      return state;
  }
}
