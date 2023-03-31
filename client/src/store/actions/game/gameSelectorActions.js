import { IMAGE_TYPE_SPRITE } from '../../../constants';
import { CANVAS_IMAGE_ID_PREFIX } from '../../../game/constants';
import { getImageUrlFromTextureId } from '../../../utils';
import { getCobrowsingState } from '../../../utils/cobrowsingUtils';
import { getLayerIdFromColorId, getHexFromColorId, isBrushIdColor, isBrushIdEraser } from '../../../utils/editorUtils';
import { generateUniqueId } from '../../../utils/webPageUtils';
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
  OPEN_GAME_TEXTURES_MODAL,
  CLOSE_GAME_TEXTURES_MODAL,
  UPDATE_VERTICAL_LINEAR_STEPPER,
  CLOSE_JSON_VIEWER,
  OPEN_JSON_VIEWER,
  OPEN_CLASS_BOX_MODAL,
  CLOSE_CLASS_BOX_MODAL,
  OPEN_SELECT_AGGREGATE_COLOR,
  CLOSE_SELECT_AGGREGATE_COLOR,
  CHANGE_SELECTOR_COLUMN,
  TOGGLE_SELECTOR_CLASS_INVISIBILITY,
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
    type: SELECT_CLASS,
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
    type: CLEAR_CLASS,
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

export const openLiveEditor = (type, entityModelId) => (dispatch, getState) => {
  saveAllCurrentCanvases()

  dispatch({
    updateCobrowsing: true,
    type: OPEN_LIVE_EDITOR,
    payload: {
      type,
      entityModelIdSelectedLiveEditor: entityModelId, 
    }
  });
}

export const openEntityBoxModal = (entityModelType) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_CLASS_BOX_MODAL,
    payload: {
      entityModelType
    }
  });
}

export const closeEntityBoxModal = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_CLASS_BOX_MODAL,
    payload: {}
  });
}

export const openGameMetadataModal = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_GAME_METADATA_MODAL,
    payload: {}
  });
}

export const closeGameMetadataModal = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_GAME_METADATA_MODAL,
    payload: {}
  });
}

export const openSelectStageColorModal= () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_SELECT_BACKGROUND_COLOR,
    payload: {}
  });
}

export const closeSelectStageColorModal= () => (dispatch, getState) => {
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

export const closeLiveEditor = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_LIVE_EDITOR
  });
}

export const updateOpenList = (id, value) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: UPDATE_OPEN_LIST,
    payload: {
      openListId: id,
      openListValue: value
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
    updateCobrowsing: true,
    type: CLEAR_EDITOR
  });
}

export const openGameTexturesModal = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_GAME_TEXTURES_MODAL,
    payload: {}
  });
}

export const closeGameTexturesModal = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_GAME_TEXTURES_MODAL,
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

export const toggleSelectorClassInvisibility = (selectorClass, dataSource) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: TOGGLE_SELECTOR_CLASS_INVISIBILITY,
    payload: {
      selectorClass,
      dataSource
    }
  });
}
