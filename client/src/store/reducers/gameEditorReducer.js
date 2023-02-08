import {
  CLOSE_LIVE_EDITOR,
  SELECT_CLASS,
  CLEAR_CLASS,
  SELECT_BRUSH,
  CLEAR_BRUSH,
  UPDATE_BRUSH_SIZE,
  CLEAR_EDITOR,
  UPDATE_ACCORDIAN_LIST,
  OPEN_SPRITE_EDITOR,
  CLOSE_SPRITE_EDITOR,
  OPEN_SELECT_BACKGROUND_COLOR,
  CLOSE_SELECT_BACKGROUND_COLOR,
  OPEN_LIVE_EDITOR,
  OPEN_GAME_METADATA_MODAL,
  CLOSE_GAME_METADATA_MODAL,
  OPEN_MY_SPRITES_MODAL,
  CLOSE_MY_SPRITES_MODAL,
  OPEN_CLASS_NAME_MODAL,
  CLOSE_CLASS_NAME_MODAL,
  OPEN_SETUP_CHOICES_MODAL,
  CLOSE_SETUP_CHOICES_MODAL,
  UPDATE_VERTICAL_LINEAR_STEPPER,
  OPEN_JSON_VIEWER,
  CLOSE_JSON_VIEWER
} from '../types';

import { generateUniqueId } from '../../utils/webPageUtils';
import { SPRITE_EDITOR_ID_PREFIX } from '../../game/constants';

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
  isGameMetadataModalOpen: false,
  isSetupDefaultsModalOpen: false,
  classIdEditingName: null,
  accordianLists: {
    'BrushList': null,
    'ClassList': null
  },
  verticalLinearSteppers: {
    'EditingGameSetup': 0,
  },
  isSpriteEditorOpen: false
};

export const initialGameEditorState = initialState

export default function gameEditorReducer(state = initialState, { type, payload }) {
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
    case UPDATE_VERTICAL_LINEAR_STEPPER:
      return {
        ...state,
        verticalLinearSteppers: {
          ...state.verticalLinearSteppers,
          [payload.verticalLinearStepperId]: payload.verticalLinearStepperValue
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
        isSpriteEditorOpen: true,
        spriteEditorTextureId: payload.textureId,
        spriteEditorAwsId: payload.spriteEditorAwsId
      }
    case CLOSE_SPRITE_EDITOR: 
      return {
        ...state,
        isSpriteEditorOpen: false,
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
    case OPEN_MY_SPRITES_MODAL: 
      return {
        ...state,
        isMySpritesModalOpen: true
      }
    case CLOSE_MY_SPRITES_MODAL:
      return {
        ...state,
        isMySpritesModalOpen: false
      }
    case OPEN_GAME_METADATA_MODAL: 
      return {
        ...state,
        isGameMetadataModalOpen: true
      }
    case CLOSE_GAME_METADATA_MODAL:
      return {
        ...state,
        isGameMetadataModalOpen: false
      }
    case OPEN_CLASS_NAME_MODAL: 
      return {
        ...state,
        classIdEditingName: payload.classId
      }
    case CLOSE_CLASS_NAME_MODAL:
      return {
        ...state,
        classIdEditingName: null
      }
    case OPEN_SETUP_CHOICES_MODAL: 
      return {
        ...state,
        isSetupDefaultsModalOpen: true,
      }
    case CLOSE_SETUP_CHOICES_MODAL:
      return {
        ...state,
        isSetupDefaultsModalOpen: false
      }
    case OPEN_JSON_VIEWER: 
      return {
        ...state,
        viewingJson: payload.viewingJson
      }
    case CLOSE_JSON_VIEWER:
      return {
        ...state,
       viewingJson: null
      }
    case CLEAR_EDITOR:
      return initialState
    default:
      return state;
  }
}
