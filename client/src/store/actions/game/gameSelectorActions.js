import { EDIT_ENTITY_MODEL_TAB_CONTANER_IID, EDIT_GAME_TAB_CONTANER_IID, LIVE_EDIT_STAGE_TAB_CONTAINER_IID, LIVE_ENTITY_EDITOR_TAB_CONTANER_IID } from '../../../constants/interfaceIds';
import { getCobrowsingState } from '../../../utils/cobrowsingUtils';
import { getLayerIdFromColorId, getHexFromColorId, isBrushIdColor, isBrushIdEraser } from '../../../utils/editorUtils';
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
  CLOSE_JSON_VIEWER,
  OPEN_JSON_VIEWER,
  OPEN_ENTITY_BOX_DIALOG,
  CLOSE_ENTITY_BOX_DIALOG,
  OPEN_SELECT_AGGREGATE_COLOR,
  CLOSE_SELECT_AGGREGATE_COLOR,
  CHANGE_SELECTOR_COLUMN,
  TOGGLE_SELECTOR_ENTITY_INVISIBILITY,
  OPEN_STAGE_LIVE_EDITOR,
  CLOSE_STAGE_LIVE_EDITOR,
} from '../../types';

import { saveAllCurrentCanvases } from '../media/codrawingActions';
import { editGameModel } from './gameModelActions';
import { toggleLayerVisibility } from './gameViewEditorActions';

export const selectEntity = (entityModelId) => (dispatch, getState) => {
  saveAllCurrentCanvases()

  // dispatch(editGameModel({
  //   entityModels: {
  //     [entityModelId]: {
  //       lastSelectedDate: Date.now()
  //     }
  //   }
  // }))

  dispatch({
    updateCobrowsing: true,
    type: SELECT_ENTITY_MODEL,
    payload: {
      entityModelIdSelectedEntityList: entityModelId, 
    }
  });
}

export const updateBrushSize = (brushSize) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: UPDATE_BRUSH_SIZE,
    payload: {
      brushSize
    }
  });
}

export const changeSelectorList = (currentSelectorListInterfaceId) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CHANGE_SELECTOR_COLUMN,
    payload: {
      currentSelectorListInterfaceId
    }
  });
}

export const clearEntity = (entityModelId) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLEAR_SELECTED_ENTITY_MODEL,
  });
}

export const updateBrushLastUsedDate = (brushId) => (dispatch, getState) => {
  if(isBrushIdColor(brushId)) {
    dispatch(editGameModel({
      colors: {
        [getHexFromColorId(brushId)]: {
          [getLayerIdFromColorId(brushId)]: Date.now()
        }
      }
    }))
  } else if(isBrushIdEraser(brushId)) {
    // nothing, always in the same place
  } else {
    dispatch(editGameModel({
      brushes: {
        [brushId]: {
          lastSelectedDate: Date.now()
        }
      }
    }))
  }
}

export const selectBrush = (brushId, layerId) => (dispatch, getState) => {
  if(layerId && getCobrowsingState().gameViewEditor.layerInvisibility[layerId]) {
    dispatch(toggleLayerVisibility(layerId))
  }

  dispatch({
    updateCobrowsing: true,
    type: SELECT_BRUSH,
    payload: {
      brushIdSelectedBrushList: brushId, 
    }
  });
}

export const clearBrush = (brushId) => (dispatch, getState) => {
  saveAllCurrentCanvases()

  dispatch({
    updateCobrowsing: true,
    type: CLEAR_BRUSH,
  });
}

export const openEntityBehaviorLiveEditor = (tabIID, entityModelId) => (dispatch, getState) => {
  saveAllCurrentCanvases()

  dispatch(updateOpenInterfaceId(LIVE_ENTITY_EDITOR_TAB_CONTANER_IID, tabIID))

  dispatch({
    updateCobrowsing: true,
    type: OPEN_ENTITY_LIVE_EDITOR,
    payload: {
      tabIID,
      entityModelIdSelectedLiveEditor: entityModelId, 
    }
  });
}

export const openStageLiveEditor = (tabIID, stageId) => (dispatch, getState) => {
  saveAllCurrentCanvases()

  dispatch(updateOpenInterfaceId(LIVE_EDIT_STAGE_TAB_CONTAINER_IID, tabIID))

  dispatch({
    updateCobrowsing: true,
    type: OPEN_STAGE_LIVE_EDITOR,
    payload: {
      stageIdSelectedLiveEditor: stageId, 
    }
  });
}

export const openEntityBoxDialog = (interfaceActionId, entityModelClass) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_ENTITY_BOX_DIALOG,
    payload: {
      interfaceActionId,
      entityModelClass
    }
  });
}

export const closeEntityBoxDialog = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_ENTITY_BOX_DIALOG,
    payload: {}
  });
}

export const openGameEditDialog = (tabIID) => (dispatch, getState) => {

  dispatch(updateOpenInterfaceId(EDIT_GAME_TAB_CONTANER_IID, tabIID))

  dispatch({
    updateCobrowsing: true,
    type: OPEN_GAME_METADATA_DIALOG,
    payload: {}
  });
}

export const closeGameEditDialog = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_GAME_METADATA_DIALOG,
    payload: {}
  });
}

export const openSelectStageColorDialog= () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_SELECT_BACKGROUND_COLOR,
    payload: {}
  });
}

export const closeSelectStageColorDialog= () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_SELECT_BACKGROUND_COLOR,
    payload: {}
  });
}

export const openSelectAggregateColor= (componentName, layerId) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_SELECT_AGGREGATE_COLOR,
    payload: {
      componentName,
      layerId,
    }
  });
}

export const closeSelectAggregateColor= () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_SELECT_AGGREGATE_COLOR,
    payload: {}
  });
}

export const closeEntityBehaviorLiveEditor = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_ENTITY_LIVE_EDITOR
  });
}

export const closeStageLiveEditor = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_STAGE_LIVE_EDITOR
  });
}

export const updateOpenInterfaceId = (interfaceIdGroup, interfaceId) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: UPDATE_OPEN_INTERFACE_ID,
    noCobrowsingToolNeeded: true,
    payload: {
      interfaceIdGroup: interfaceIdGroup,
      interfaceId: interfaceId
    }
  });
}

export const updateVerticalLinearStepper = (id, value) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: UPDATE_VERTICAL_LINEAR_STEPPER,
    payload: {
      verticalLinearStepperId: id,
      verticalLinearStepperValue: value
    }
  });
}

export const clearEditor = () => (dispatch, getState) => {
  dispatch({
    // updateCobrowsing: true,
    // noCobrowsingToolNeeded: true,
    type: CLEAR_EDITOR
  });
}

export const openGameTexturesDialog = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_GAME_TEXTURES_DIALOG,
    payload: {}
  });
}

export const closeGameTexturesDialog = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_GAME_TEXTURES_DIALOG,
    payload: {}
  });
}

export const openJsonViewer = (viewingJson) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_JSON_VIEWER,
    payload: {
      viewingJson
    }
  });
}

export const closeJsonViewer = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_JSON_VIEWER,
    payload: {
    }
  });
}

export const toggleSelectorClassInvisibility = (interfaceId, dataSourceIID) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: TOGGLE_SELECTOR_ENTITY_INVISIBILITY,
    payload: {
      interfaceId,
      dataSourceIID
    }
  });
}
