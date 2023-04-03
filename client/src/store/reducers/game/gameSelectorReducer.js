import { SELECTOR_ENTITY_BY_CLASS_IID } from '../../../constants/interfaceIds';
import { defaultSelectorClassDataSourceInvisibility } from '../../../game/constants/interfaceData';
import {
  CLOSE_LIVE_EDITOR,
  SELECT_CLASS,
  CLEAR_CLASS,
  SELECT_BRUSH,
  CLEAR_BRUSH,
  UPDATE_BRUSH_SIZE,
  CLEAR_EDITOR,
  UPDATE_OPEN_INTERFACE_ID,
  OPEN_SELECT_BACKGROUND_COLOR,
  CLOSE_SELECT_BACKGROUND_COLOR,
  OPEN_LIVE_EDITOR,
  OPEN_GAME_METADATA_MODAL,
  CLOSE_GAME_METADATA_MODAL,
  OPEN_GAME_TEXTURES_MODAL,
  CLOSE_GAME_TEXTURES_MODAL,
  UPDATE_VERTICAL_LINEAR_STEPPER,
  OPEN_JSON_VIEWER,
  CLOSE_JSON_VIEWER,
  OPEN_CLASS_BOX_MODAL,
  CLOSE_CLASS_BOX_MODAL,
  OPEN_SELECT_AGGREGATE_COLOR,
  CLOSE_SELECT_AGGREGATE_COLOR,
  CHANGE_SELECTOR_COLUMN,
  TOGGLE_SELECTOR_CLASS_INVISIBILITY,
} from '../../types';

const initialState = {
  error: null,
  selectorInterfaceListInvisibility: defaultSelectorClassDataSourceInvisibility,
  colorIdSelected: null,
  brushIdSelectedBrushList: null,
  entityModelIdSelectedEntityList: null,
  brushSize: 3,
  entityModelIdSelectedLiveEditor: null,
  liveEditingCategory: null,
  isSelectStageColorModalOpen: false,
  isGameMetadataModalOpen: false,
  openInterfaceIdGroups: {
  },
  verticalLinearSteppers: {
    'EditingGameSetup': 0,
  },

  isEntityBoxModalOpen: false,
  entityBoxModelType: null,
  isSelectAggregateColorOpen: null,
  currentSelectorListInterfaceId: SELECTOR_ENTITY_BY_CLASS_IID,
};

export const initialGameSelectorState = initialState

export default function gameSelectorReducer(state = initialState, { type, payload }) {
  switch (type) {
    case CHANGE_SELECTOR_COLUMN: 
      return {
        ...state,
        currentSelectorListInterfaceId: payload.currentSelectorListInterfaceId
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
        entityModelIdSelectedEntityList: payload.entityModelIdSelectedEntityList
      }
    case CLEAR_CLASS:
       return {
         ...state,
          entityModelIdSelectedEntityList: null
       }
    case SELECT_BRUSH: 
      return {
        ...state,
        entityModelIdSelectedEntityList: null,
        brushIdSelectedBrushList: payload.brushIdSelectedBrushList
      }
    case CLEAR_BRUSH:
      return {
        ...state,
        brushIdSelectedBrushList: null
      }
    case UPDATE_OPEN_INTERFACE_ID:
      return {
        ...state,
        openInterfaceIdGroups: {
          ...state.openInterfaceIdGroups,
          [payload.interfaceIdGroup]: payload.interfaceId
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
        entityModelIdSelectedLiveEditor: payload.entityModelIdSelectedLiveEditor,
      };
    case CLOSE_LIVE_EDITOR:
      return {
          ...state,
        entityModelIdSelectedLiveEditor: null,
        liveEditingCategory: null
      };
    case OPEN_SELECT_BACKGROUND_COLOR: 
      return {
        ...state,
        isSelectStageColorModalOpen: true
      }
    case TOGGLE_SELECTOR_CLASS_INVISIBILITY:
      let newSelectorClassInvisibility
      if(state.selectorInterfaceListInvisibility[payload.interfaceId]) {
        newSelectorClassInvisibility = {
          ...state.selectorInterfaceListInvisibility[payload.interfaceId],
          [payload.dataSource]: !state.selectorInterfaceListInvisibility[payload.interfaceId][payload.dataSource],
        }
      } else {
        newSelectorClassInvisibility = {
          [payload.dataSource]: true,
        }
      }
      return {
        ...state,
        selectorInterfaceListInvisibility: {
          ...state.selectorInterfaceListInvisibility,
          [payload.interfaceId]: newSelectorClassInvisibility
        }
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
    case OPEN_GAME_TEXTURES_MODAL: 
      return {
        ...state,
        isGameTexturesModalOpen: true
      }
    case CLOSE_GAME_TEXTURES_MODAL:
      return {
        ...state,
        isGameTexturesModalOpen: false
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
        isEntityBoxModalOpen: true,
        entityBoxModelType: payload.entityModelType
      }
    case CLOSE_CLASS_BOX_MODAL:
      return {
        ...state,
        isEntityBoxModalOpen: false,
        entityBoxModelType: null
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
