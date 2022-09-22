import {
  OPEN_LIVE_PHYSICS_EDITOR,
  OPEN_LIVE_WORLD_EDITOR,
  CLOSE_LIVE_EDITOR,
  SELECT_CLASS,
  CLEAR_CLASS,
  SELECT_BRUSH,
  CLEAR_BRUSH,
  UPDATE_BRUSH_SIZE,
  CLEAR_EDITOR,
  OPEN_LIVE_CAMERA_EDITOR,
  CHANGE_EDITOR_CAMERA_ZOOM,
  OPEN_SECTION_EDITOR,
  CLOSE_SECTION_EDITOR,
  TOGGLE_GRID_VIEW,
  UPDATE_ACCORDIAN_LIST,
  OPEN_LIVE_PROJECTILE_EDITOR,
  OPEN_LIVE_MOVEMENT_EDITOR,
  OPEN_SNAPSHOT_TAKER,
  CLOSE_SNAPSHOT_TAKER
} from '../types';

const initialState = {
  error: null,
  colorIdSelected: null,
  brushIdSelectedBrushList: null,
  classIdSelectedClassList: null,
  brushSize: 3,
  cameraZoom: 3,
  classIdSelectedLiveEditor: null,
  isLiveEditorOpen: false,
  isSectionEditorOpen: false,
  isGridViewOn: false,
  liveEditingCategory: null,
  isSnapshotTakerOpen: false,
  snapshotFileId: null,
  accordianLists: {
    'BrushList': null,
  }
};

export const initialEditorFormsState = initialState

export default function editorReducer(state = initialState, { type, payload }) {
  switch (type) {
    case CHANGE_EDITOR_CAMERA_ZOOM: {
      return {
        ...state,
        cameraZoom: payload.cameraZoom
      }
    }
    case UPDATE_BRUSH_SIZE: {
      return {
        ...state,
        brushSize: payload.brushSize
      }
    }
    case SELECT_CLASS: 
      return {
        ...state,
        brushIdSelectedBrushList: null,
        classIdSelectedClassList: payload.classIdSelectedClassList
      }
    case CLEAR_CLASS:
       return {
         ...state,
          classIdSelectedClassList: null
       }
    case SELECT_BRUSH: 
      return {
        ...state,
        classIdSelectedClassList: null,
        brushIdSelectedBrushList: payload.brushIdSelectedBrushList
      }
    case CLEAR_BRUSH:
      return {
        ...state,
        brushIdSelectedBrushList: null
      }
    case OPEN_SECTION_EDITOR:
      return {
        ...state,
        isSectionEditorOpen: true,
        isGridViewOn: true,
        cameraZoom: 1,
      };
    case TOGGLE_GRID_VIEW: 
      return {
        ...state,
        isGridViewOn: !state.isGridViewOn,
      }
    case CLOSE_SECTION_EDITOR:
      return {
        ...state,
        isSectionEditorOpen: false,
      };
    case UPDATE_ACCORDIAN_LIST:
      return {
        ...state,
        accordianLists: {
          ...state.accordianLists,
          [payload.accordianListId]: payload.accordianListValue
        }
      };
    case OPEN_LIVE_MOVEMENT_EDITOR:
      return {
        ...state,
        isLiveEditorOpen: true,
        liveEditingCategory: 'movement',
        classIdSelectedLiveEditor: payload.classIdSelectedLiveEditor,
      };
    case OPEN_LIVE_PROJECTILE_EDITOR:
      return {
        ...state,
        isLiveEditorOpen: true,
        liveEditingCategory: 'projectile',
        classIdSelectedLiveEditor: payload.classIdSelectedLiveEditor,
      };
    case OPEN_LIVE_PHYSICS_EDITOR:
      return {
        ...state,
        isLiveEditorOpen: true,
        liveEditingCategory: 'physics',
        classIdSelectedLiveEditor: payload.classIdSelectedLiveEditor,
      };
    case OPEN_LIVE_CAMERA_EDITOR:
      return {
        ...state,
        isLiveEditorOpen: true,
        liveEditingCategory: 'camera',
        classIdSelectedLiveEditor: payload.classIdSelectedLiveEditor,
      };
    case OPEN_LIVE_WORLD_EDITOR:
      return {
        ...state,
        isLiveEditorOpen: true,
        liveEditingCategory: 'world',
      };
    case CLOSE_LIVE_EDITOR:
      return {
          ...state,
        classIdSelectedLiveEditor: null,
        isLiveEditorOpen: false,
        liveEditingCategory: null
      };
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
    case CLEAR_EDITOR:
      return initialState
    default:
      return state;
  }
}
