import { 
  OPEN_CREATE_CLASS_FLOW,
  UPDATE_CREATE_CLASS_STEP,
  CLOSE_CREATE_CLASS_FLOW,
  UPDATE_CREATE_CLASS,
  OPEN_CREATE_COLOR_FLOW,
  CLOSE_CREATE_COLOR_FLOW,
  UPDATE_CREATE_COLOR,
  CLOSE_CREATE_BRUSH_FLOW,
  OPEN_CREATE_BRUSH_FLOW,
  UPDATE_CREATE_BRUSH,
  UPDATE_CREATE_BRUSH_STEP,
  CLEAR_EDITOR_FORMS,
} from '../types';

export const clearEditorForms = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLEAR_EDITOR_FORMS,
    payload: {}
  });
}

export const openCreateClassFlow = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_CREATE_CLASS_FLOW,
    payload: {}
  });
}

export const closeCreateClassFlow = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_CREATE_CLASS_FLOW,
    payload: {}
  });
}

export const updateCreateClass = (objectClass) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: UPDATE_CREATE_CLASS,
    payload: { class: objectClass }
  });
}

export const updateCreateClassStep = (step) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: UPDATE_CREATE_CLASS_STEP,
    payload: { step }
  });
}

export const openCreateColorFlow = (componentName, canvasId) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_CREATE_COLOR_FLOW,
    payload: {
      componentName,
      canvasId,
    }
  });
}

export const closeCreateColorFlow = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_CREATE_COLOR_FLOW,
    payload: {}
  });
}

export const updateCreateColor = (color) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: UPDATE_CREATE_COLOR,
    payload: { color }
  });
}

export const openCreateBrushFlow = (canvasId) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_CREATE_BRUSH_FLOW,
    payload: {
      canvasId
    }
  });
}

export const closeCreateBrushFlow = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_CREATE_BRUSH_FLOW,
    payload: {}
  });
}

export const updateCreateBrush = (brush) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: UPDATE_CREATE_BRUSH,
    payload: { brush }
  });
}

export const updateCreateBrushStep = (step) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: UPDATE_CREATE_BRUSH_STEP,
    payload: { step }
  });
}