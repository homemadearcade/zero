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
  CLOSE_SNAPSHOT_TAKER,
  OPEN_SPRITE_EDITOR,
  CLOSE_SPRITE_EDITOR,
  OPEN_SELECT_BACKGROUND_COLOR,
  CLOSE_SELECT_BACKGROUND_COLOR,
  OPEN_LIVE_EDITOR
} from '../types';

import { v4 as uuidv4 } from 'uuid';
import { generateUniqueId } from '../../utils/browserUtils';

const initialState = {
  error: null,
  colorIdSelected: null,
  brushIdSelectedBrushList: null,
  classIdSelectedClassList: null,
  brushSize: 3,
  cameraZoom: 3,
  classIdSelectedLiveEditor: null,
  isSectionEditorOpen: false,
  isGridViewOn: false,
  liveEditingCategory: null,
  isSnapshotTakerOpen: false,
  snapshotFileId: null,
  spriteEditorTextureId: null,
  isSelectBackgroundColorOpen: false,
  accordianLists: {
    'BrushList': null,
    'ClassList': null
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
    case OPEN_LIVE_EDITOR:
      return {
        ...state,
        liveEditingCategory: payload.type,
        classIdSelectedLiveEditor: payload.classIdSelectedLiveEditor,
      };
    case CLOSE_LIVE_EDITOR:
      return {
          ...state,
        classIdSelectedLiveEditor: null,
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
    case OPEN_SPRITE_EDITOR:
      return {
        ...state,
        spriteEditorTextureId: payload.textureId,
        spriteEditorAwsId: generateUniqueId()
      }
    case CLOSE_SPRITE_EDITOR: 
      return {
        ...state,
        spriteEditorTextureId: null,
      }
    case OPEN_SELECT_BACKGROUND_COLOR: 
      return {
        ...state,
        isSelectBackgroundColorOpen: true
      }
    case CLOSE_SELECT_BACKGROUND_COLOR:
      return {
        ...state,
        isSelectBackgroundColorOpen: false
      }
    case CLEAR_EDITOR:
      return initialState
    default:
      return state;
  }
}
