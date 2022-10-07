import {
  CLOSE_LIVE_EDITOR,
  SELECT_CLASS,
  CLEAR_CLASS,
  SELECT_BRUSH,
  CLEAR_BRUSH,
  UPDATE_BRUSH_SIZE,
  CLEAR_EDITOR,
  CHANGE_EDITOR_CAMERA_ZOOM,
  UPDATE_ACCORDIAN_LIST,
  OPEN_SPRITE_EDITOR,
  CLOSE_SPRITE_EDITOR,
  OPEN_SELECT_BACKGROUND_COLOR,
  CLOSE_SELECT_BACKGROUND_COLOR,
  OPEN_LIVE_EDITOR
} from '../types';

import { generateUniqueId } from '../../utils/browserUtils';

const initialState = {
  error: null,
  colorIdSelected: null,
  brushIdSelectedBrushList: null,
  classIdSelectedClassList: null,
  brushSize: 3,
  classIdSelectedLiveEditor: null,
  liveEditingCategory: null,
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
