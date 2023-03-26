import { SELECTOR_MAP_LIST } from '../../game/constants';
import {
  CLOSE_LIVE_EDITOR,
  SELECT_CLASS,
  CLEAR_CLASS,
  SELECT_BRUSH,
  CLEAR_BRUSH,
  UPDATE_BRUSH_SIZE,
  CLEAR_EDITOR,
  UPDATE_OPEN_LIST,
  OPEN_SELECT_BACKGROUND_COLOR,
  CLOSE_SELECT_BACKGROUND_COLOR,
  OPEN_LIVE_EDITOR,
  OPEN_GAME_METADATA_MODAL,
  CLOSE_GAME_METADATA_MODAL,
  OPEN_MY_IMAGES_MODAL,
  CLOSE_MY_IMAGES_MODAL,
  UPDATE_VERTICAL_LINEAR_STEPPER,
  OPEN_JSON_VIEWER,
  CLOSE_JSON_VIEWER,
  OPEN_CLASS_BOX_MODAL,
  CLOSE_CLASS_BOX_MODAL,
  OPEN_SELECT_AGGREGATE_COLOR,
  CLOSE_SELECT_AGGREGATE_COLOR,
  CHANGE_SELECTOR_COLUMN,
  
} from '../types';

const initialState = {
  error: null,
  colorIdSelected: null,
  brushIdSelectedBrushList: null,
  entityClassIdSelectedClassList: null,
  brushSize: 3,
  entityClassIdSelectedLiveEditor: null,
  liveEditingCategory: null,
  isSelectStageColorModalOpen: false,
  isGameMetadataModalOpen: false,
  openLists: {
  },
  verticalLinearSteppers: {
    'EditingGameSetup': 0,
  },

  isClassBoxModalOpen: false,
  classBoxClassType: null,
  isSelectAggregateColorOpen: null,
  currentSelectorList: SELECTOR_MAP_LIST,
};

export const initialGameSelectorState = initialState

export default function gameSelectorReducer(state = initialState, { type, payload }) {
  switch (type) {
    case CHANGE_SELECTOR_COLUMN: 
      return {
        ...state,
        currentSelectorList: payload.currentSelectorList
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
        entityClassIdSelectedClassList: payload.entityClassIdSelectedClassList
      }
    case CLEAR_CLASS:
       return {
         ...state,
          entityClassIdSelectedClassList: null
       }
    case SELECT_BRUSH: 
      return {
        ...state,
        entityClassIdSelectedClassList: null,
        brushIdSelectedBrushList: payload.brushIdSelectedBrushList
      }
    case CLEAR_BRUSH:
      return {
        ...state,
        brushIdSelectedBrushList: null
      }
    case UPDATE_OPEN_LIST:
      return {
        ...state,
        openLists: {
          ...state.openLists,
          [payload.openListId]: payload.openListValue
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
        entityClassIdSelectedLiveEditor: payload.entityClassIdSelectedLiveEditor,
      };
    case CLOSE_LIVE_EDITOR:
      return {
          ...state,
        entityClassIdSelectedLiveEditor: null,
        liveEditingCategory: null
      };
    case OPEN_SELECT_BACKGROUND_COLOR: 
      return {
        ...state,
        isSelectStageColorModalOpen: true
      }
    case CLOSE_SELECT_BACKGROUND_COLOR:
      return {
        ...state,
        isSelectStageColorModalOpen: false
      }
    case OPEN_SELECT_AGGREGATE_COLOR: 
      return {
        ...state,
        isSelectAggregateColorOpen: payload.componentName,
      }
    case CLOSE_SELECT_AGGREGATE_COLOR:
      return {
        ...state,
        isSelectAggregateColorOpen: false
      }
    case OPEN_MY_IMAGES_MODAL: 
      return {
        ...state,
        isMyImagesModalOpen: true
      }
    case CLOSE_MY_IMAGES_MODAL:
      return {
        ...state,
        isMyImagesModalOpen: false
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
    case OPEN_CLASS_BOX_MODAL: 
      return {
        ...state,
        isClassBoxModalOpen: true,
        classBoxClassType: payload.classType
      }
    case CLOSE_CLASS_BOX_MODAL:
      return {
        ...state,
        isClassBoxModalOpen: false,
        classBoxClassType: null
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
