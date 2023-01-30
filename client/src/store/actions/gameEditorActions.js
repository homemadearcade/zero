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
  OPEN_CLASS_NAME_MODAL,
  CLOSE_CLASS_NAME_MODAL,
  OPEN_SETUP_CHOICES_MODAL,
  CLOSE_SETUP_CHOICES_MODAL,
  OPEN_MY_SPRITES_MODAL,
  CLOSE_MY_SPRITES_MODAL,
  UPDATE_VERTICAL_LINEAR_STEPPER,
  CLOSE_JSON_VIEWER,
  OPEN_JSON_VIEWER,
} from '../types';

import { saveAllCurrentCanvases } from './codrawingActions';

export const selectClass = (classId) => (dispatch, getState) => {
  saveAllCurrentCanvases()

  dispatch({
    updateCobrowsing: true,
    type: SELECT_CLASS,
    payload: {
      classIdSelectedClassList: classId, 
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

export const clearClass = (classId) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLEAR_CLASS,
  });
}

export const selectBrush = (brushId) => (dispatch, getState) => {
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

export const openLiveEditor = (type, classId) => (dispatch, getState) => {
  saveAllCurrentCanvases()

  dispatch({
    updateCobrowsing: true,
    type: OPEN_LIVE_EDITOR,
    payload: {
      type,
      classIdSelectedLiveEditor: classId, 
    }
  });
}

export const openSpriteEditor= (textureId) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_SPRITE_EDITOR,
    payload: {
      textureId: textureId
    }
  });
}

export const closeSpriteEditor= () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_SPRITE_EDITOR,
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

export const openClassNameModal = (classId) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_CLASS_NAME_MODAL,
    payload: {
      classId
    }
  });
}

export const closeClassNameModal = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_CLASS_NAME_MODAL,
    payload: {}
  });
}

export const openSetupDefaultsModal = () => (dispatch, getState) => {
  // externalForceCobrowsingUpdateUserId
  
  dispatch({
    updateCobrowsing: true,
    type: OPEN_SETUP_CHOICES_MODAL,
    // externalForceCobrowsingUpdateUserId: externalForceCobrowsingUpdateUserId ? externalForceCobrowsingUpdateUserId : null,
    payload: {}
  });
}

export const closeSetupDefaultsModal = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_SETUP_CHOICES_MODAL,
    payload: {}
  });
}

export const openSelectBackgroundColor= () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_SELECT_BACKGROUND_COLOR,
    payload: {}
  });
}

export const closeSelectBackgroundColor= () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_SELECT_BACKGROUND_COLOR,
    payload: {}
  });
}

export const closeLiveEditor = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_LIVE_EDITOR
  });
}

export const updateAccordianList = (id, value) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: UPDATE_ACCORDIAN_LIST,
    payload: {
      accordianListId: id,
      accordianListValue: value
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

export const openMySpritesModal = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_MY_SPRITES_MODAL,
    payload: {}
  });
}

export const closeMySpritesModal = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_MY_SPRITES_MODAL,
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
