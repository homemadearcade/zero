import { IMAGE_TYPE_SPRITE } from '../../constants';
import { IMAGE_CANVAS_ID_PREFIX } from '../../game/constants';
import { getImageUrlFromTextureId } from '../../utils';
import { getCobrowsingState } from '../../utils/cobrowsingUtils';
import { getLayerIdFromColorId, getHexFromColorId, isBrushIdColor, isBrushIdEraser } from '../../utils/editorUtils';
import { generateUniqueId } from '../../utils/webPageUtils';
import { 
  CLOSE_LIVE_EDITOR,
  SELECT_CLASS,
  CLEAR_CLASS,
  SELECT_BRUSH,
  CLEAR_BRUSH,
  UPDATE_BRUSH_SIZE,
  CLEAR_EDITOR,
  UPDATE_OPEN_LIST,
  OPEN_IMAGE_CANVAS_MODAL,
  CLOSE_IMAGE_CANVAS_MODAL,
  OPEN_SELECT_BACKGROUND_COLOR,
  CLOSE_SELECT_BACKGROUND_COLOR,
  OPEN_LIVE_EDITOR,
  OPEN_GAME_METADATA_MODAL,
  CLOSE_GAME_METADATA_MODAL,
  OPEN_SETUP_CHOICES_MODAL,
  CLOSE_SETUP_CHOICES_MODAL,
  OPEN_MY_IMAGES_MODAL,
  CLOSE_MY_IMAGES_MODAL,
  UPDATE_VERTICAL_LINEAR_STEPPER,
  CLOSE_JSON_VIEWER,
  OPEN_JSON_VIEWER,
  OPEN_CLASS_BOX_MODAL,
  CLOSE_CLASS_BOX_MODAL,
  OPEN_SELECT_AGGREGATE_COLOR,
  CLOSE_SELECT_AGGREGATE_COLOR,
  CHANGE_SELECTOR_COLUMN,
  OPEN_IMAGE_CANVAS_MODAL_LOADING,
} from '../types';
import { addCanvasImage } from './canvasImageActions';

import { saveAllCurrentCanvases } from './codrawingActions';
import { editGameModel } from './gameModelActions';
import { toggleLayerVisibility } from './gameViewEditorActions';

export const selectClass = (entityClassId) => (dispatch, getState) => {
  saveAllCurrentCanvases()

  // dispatch(editGameModel({
  //   entityClasses: {
  //     [entityClassId]: {
  //       lastSelectedDate: Date.now()
  //     }
  //   }
  // }))

  dispatch({
    updateCobrowsing: true,
    type: SELECT_CLASS,
    payload: {
      entityClassIdSelectedClassList: entityClassId, 
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

export const changeSelectorList = (currentSelectorList) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CHANGE_SELECTOR_COLUMN,
    payload: {
      currentSelectorList
    }
  });
}

export const clearClass = (entityClassId) => (dispatch, getState) => {
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

export const openLiveEditor = (type, entityClassId) => (dispatch, getState) => {
  saveAllCurrentCanvases()

  dispatch({
    updateCobrowsing: true,
    type: OPEN_LIVE_EDITOR,
    payload: {
      type,
      entityClassIdSelectedLiveEditor: entityClassId, 
    }
  });
}

export const openCanvasImageModal= (textureId) => async (dispatch, getState) => {
  const state = getState()
  const newTextureId = IMAGE_CANVAS_ID_PREFIX + generateUniqueId()
  
  dispatch({
    updateCobrowsing: true,
    type: OPEN_IMAGE_CANVAS_MODAL_LOADING,
    payload: {
      textureId: textureId,
      imageCanvasNewTextureId: newTextureId
    }
  });

  await dispatch(addCanvasImage({
    textureId: newTextureId, 
    visualTags: [],
    imageUrl: getImageUrlFromTextureId(textureId),
    imageType: IMAGE_TYPE_SPRITE,
    userId: state.auth.me?.id,
    arcadeGame: state.gameModel.gameModel.id
  }))

  dispatch({
    updateCobrowsing: true,
    type: OPEN_IMAGE_CANVAS_MODAL,
    payload: {
      textureId: textureId,
      imageCanvasNewTextureId: newTextureId
    }
  });
}

export const closeCanvasImageModal= () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_IMAGE_CANVAS_MODAL,
    payload: {}
  });
}

export const openClassBoxModal = (classType) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_CLASS_BOX_MODAL,
    payload: {
      classType
    }
  });
}

export const closeClassBoxModal = () => (dispatch, getState) => {
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

export const openMyImagesModal = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_MY_IMAGES_MODAL,
    payload: {}
  });
}

export const closeMyImagesModal = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_MY_IMAGES_MODAL,
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
