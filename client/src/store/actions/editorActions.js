import { 
  OPEN_SECTION_EDITOR,
  CLOSE_LIVE_EDITOR,
  SELECT_CLASS,
  CLEAR_CLASS,
  SELECT_BRUSH,
  CLEAR_BRUSH,
  UPDATE_BRUSH_SIZE,
  CLEAR_EDITOR,
  CHANGE_EDITOR_CAMERA_ZOOM,
  CLOSE_SECTION_EDITOR,
  UPDATE_ACCORDIAN_LIST,
  OPEN_SNAPSHOT_TAKER,
  CLOSE_SNAPSHOT_TAKER,
  OPEN_SPRITE_EDITOR,
  CLOSE_SPRITE_EDITOR,
  OPEN_SELECT_BACKGROUND_COLOR,
  CLOSE_SELECT_BACKGROUND_COLOR,
  OPEN_LIVE_EDITOR,
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

export const clearEditor = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLEAR_EDITOR
  });
}