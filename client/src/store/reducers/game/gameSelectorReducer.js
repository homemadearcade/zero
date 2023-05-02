import { SELECTOR_ENTITY_BY_INTERFACE_ID_IID } from '../../../constants/interfaceIds';
import { defaultSelectorClassDataSourceInvisibility } from '../../../game/constants/interfaceData';
import {
  CLOSE_ENTITY_LIVE_EDITOR,
  SELECT_ENTITY_MODEL,
  CLEAR_SELECTED_ENTITY_MODEL,
  SELECT_BRUSH,
  CLEAR_BRUSH,
  UPDATE_BRUSH_SIZE,
  CLEAR_EDITOR,
  UPDATE_OPEN_INTERFACE_ID,
  OPEN_SELECT_BACKGROUND_COLOR,
  CLOSE_SELECT_BACKGROUND_COLOR,
  OPEN_ENTITY_LIVE_EDITOR,
  OPEN_GAME_METADATA_DIALOG,
  CLOSE_GAME_METADATA_DIALOG,
  OPEN_GAME_TEXTURES_DIALOG,
  CLOSE_GAME_TEXTURES_DIALOG,
  UPDATE_VERTICAL_LINEAR_STEPPER,
  OPEN_JSON_VIEWER,
  CLOSE_JSON_VIEWER,
  OPEN_ENTITY_BOX_DIALOG,
  CLOSE_ENTITY_BOX_DIALOG,
  OPEN_SELECT_AGGREGATE_COLOR,
  CLOSE_SELECT_AGGREGATE_COLOR,
  CHANGE_SELECTOR_COLUMN,
  TOGGLE_SELECTOR_ENTITY_INVISIBILITY,
  OPEN_STAGE_LIVE_EDITOR,
  CLOSE_STAGE_LIVE_EDITOR,
} from '../../types';

const initialState = {
  error: null,
  selectorInterfaceListInvisibility: defaultSelectorClassDataSourceInvisibility,
  colorIdSelected: null,
  brushIdSelectedBrushList: null,
  entityModelIdSelectedEntityList: null,
  brushSize: 3,
  entityModelIdSelectedLiveEditor: null,
  isEntityBehaviorLiveEditorOpen: null,
  isSelectStageColorDialogOpen: false,
  isGameEditDialogOpen: false,
  openInterfaceIdGroups: {
  },
  verticalLinearSteppers: {
    'EditingGameSetup': 0,
  },

  isEntityBoxDialogOpen: false,
  entityBoxDialogType: null,
  isSelectAggregateColorOpen: null,
  currentSelectorListInterfaceId: SELECTOR_ENTITY_BY_INTERFACE_ID_IID,
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
    case SELECT_ENTITY_MODEL: 
      return {
        ...state,
        brushIdSelectedBrushList: null,
        entityModelIdSelectedEntityList: payload.entityModelIdSelectedEntityList
      }
    case CLEAR_SELECTED_ENTITY_MODEL:
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
    case OPEN_ENTITY_LIVE_EDITOR:
      return {
        ...state,
        isEntityBehaviorLiveEditorOpen: true,
        entityModelIdSelectedLiveEditor: payload.entityModelIdSelectedLiveEditor,
      };
    case CLOSE_ENTITY_LIVE_EDITOR:
      return {
          ...state,
        entityModelIdSelectedLiveEditor: null,
        isEntityBehaviorLiveEditorOpen: false
      };
    case OPEN_STAGE_LIVE_EDITOR:
      return {
        ...state,
        isStageLiveEditorOpen: true,
        stageIdSelectedLiveEditor: payload.stageIdSelectedLiveEditor,
      };
    case CLOSE_STAGE_LIVE_EDITOR:
      return {
          ...state,
        stageIdSelectedLiveEditor: null,
        isStageLiveEditorOpen: false
      };
    case OPEN_SELECT_BACKGROUND_COLOR: 
      return {
        ...state,
        isSelectStageColorDialogOpen: true
      }
    case TOGGLE_SELECTOR_ENTITY_INVISIBILITY:
      let newSelectorClassInvisibility
      if(state.selectorInterfaceListInvisibility[payload.interfaceId]) {
        newSelectorClassInvisibility = {
          ...state.selectorInterfaceListInvisibility[payload.interfaceId],
          [payload.dataSourceIID]: !state.selectorInterfaceListInvisibility[payload.interfaceId][payload.dataSourceIID],
        }
      } else {
        newSelectorClassInvisibility = {
          [payload.dataSourceIID]: true,
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
        isSelectStageColorDialogOpen: false
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
    case OPEN_GAME_TEXTURES_DIALOG: 
      return {
        ...state,
        isGameTexturesDialogOpen: true
      }
    case CLOSE_GAME_TEXTURES_DIALOG:
      return {
        ...state,
        isGameTexturesDialogOpen: false
      }
    case OPEN_GAME_METADATA_DIALOG: 
      return {
        ...state,
        isGameEditDialogOpen: true
      }
    case CLOSE_GAME_METADATA_DIALOG:
      return {
        ...state,
        isGameEditDialogOpen: false
      }
    case OPEN_ENTITY_BOX_DIALOG: 
      return {
        ...state,
        isEntityBoxDialogOpen: true,
        entityBoxDialogActionId: payload.interfaceActionId,
        entityBoxDialogType: payload.entityModelClass
      }
    case CLOSE_ENTITY_BOX_DIALOG:
      return {
        ...state,
        isEntityBoxDialogOpen: false,
        entityBoxDialogType: null
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
