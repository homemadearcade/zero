import { 
  OPEN_CREATE_CLASS_FLOW,
  CLOSE_CREATE_CLASS_FLOW,
  UPDATE_CREATE_CLASS,
  OPEN_CREATE_COLOR_FLOW,
  CLOSE_CREATE_COLOR_FLOW,
  UPDATE_CREATE_COLOR,
  CLOSE_CREATE_BRUSH_FLOW,
  OPEN_CREATE_BRUSH_FLOW,
  UPDATE_CREATE_BRUSH,
  CLEAR_EDITOR_FORMS,
  CHANGE_EDITOR_CAMERA_ZOOM,
  UPDATE_CREATE_CUTSCENE,
  CLOSE_CREATE_CUTSCENE,
  OPEN_CREATE_CUTSCENE,
  OPEN_RELATIONS_MENU,
  CLOSE_RELATIONS_MENU,
  OPEN_CREATE_RELATION,
  CLOSE_CREATE_RELATION,
  UPDATE_CREATE_RELATION,
  OPEN_CUTSCENES_MENU,
  CLOSE_CUTSCENES_MENU,
  OPEN_BOUNDARY_RELATION,
  CLOSE_BOUNDARY_RELATION,
  UPDATE_BOUNDARY_RELATION,
  OPEN_STAGES_MENU,
  CLOSE_STAGES_MENU,
  OPEN_CREATE_STAGE,
  CLOSE_CREATE_STAGE,
  UPDATE_CREATE_STAGE,
} from '../types';
import { saveAllCurrentCanvases } from './codrawingActions';

export const changeEditorCameraZoom = (zoom) => (dispatch, getState) => {
  dispatch({
    type: CHANGE_EDITOR_CAMERA_ZOOM,
    payload: {
      cameraZoom: zoom
    }
  });
}

export const clearGameFormEditor = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLEAR_EDITOR_FORMS,
    payload: {}
  });
}

export const openCreateClassFlow = (initialClass) => (dispatch, getState) => {
  saveAllCurrentCanvases()

  dispatch({
    updateCobrowsing: true,
    type: OPEN_CREATE_CLASS_FLOW,
    payload: { initialClass }
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

export const openCreateColorFlow = (componentName, canvasId) => (dispatch, getState) => {
  saveAllCurrentCanvases()

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
  saveAllCurrentCanvases()

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


export const openCutscenesMenu= () => (dispatch, getState) => {
  saveAllCurrentCanvases()

  dispatch({
    updateCobrowsing: true,
    type: OPEN_CUTSCENES_MENU,
    payload: {}
  });
}

export const closeCutscenesMenu= () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_CUTSCENES_MENU,
    payload: {}
  });
}

export const openStagesMenu= () => (dispatch, getState) => {
  saveAllCurrentCanvases()

  dispatch({
    updateCobrowsing: true,
    type: OPEN_STAGES_MENU,
    payload: {}
  });
}

export const closeStagesMenu= () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_STAGES_MENU,
    payload: {}
  });
}

export const openCreateStage = (initialStage) => (dispatch, getState) => {
  saveAllCurrentCanvases()

  dispatch({
    updateCobrowsing: true,
    type: OPEN_CREATE_STAGE,
    payload: { initialStage }
  });
}

export const closeCreateStage= () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_CREATE_STAGE,
    payload: {}
  });
}

export const updateCreateStage = (stage) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: UPDATE_CREATE_STAGE,
    payload: { stage }
  });
}

export const openCreateCutscene = (initialCutscene) => (dispatch, getState) => {
  saveAllCurrentCanvases()

  dispatch({
    updateCobrowsing: true,
    type: OPEN_CREATE_CUTSCENE,
    payload: { initialCutscene }
  });
}

export const closeCreateCutscene= () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_CREATE_CUTSCENE,
    payload: {}
  });
}

export const updateCreateCutscene = (cutscene) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: UPDATE_CREATE_CUTSCENE,
    payload: { cutscene }
  });
}

export const openRelationsMenu= (classId) => (dispatch, getState) => {
  saveAllCurrentCanvases()

  dispatch({
    updateCobrowsing: true,
    type: OPEN_RELATIONS_MENU,
    payload: {
      classId
    }
  });
}

export const closeRelationsMenu= () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_RELATIONS_MENU,
    payload: {}
  });
}

export const openCreateRelation = (initialRelation) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_CREATE_RELATION,
    payload: { initialRelation }
  });
}
export const closeCreateRelation= () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_CREATE_RELATION,
    payload: {}
  });
}
export const updateCreateRelation = (relation) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: UPDATE_CREATE_RELATION,
    payload: { relation }
  });
}



export const openBoundaryRelation = (initialObjectClass) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_BOUNDARY_RELATION,
    payload: { initialObjectClass }
  });
}

export const closeBoundaryRelation= () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_BOUNDARY_RELATION,
    payload: {}
  });
}

export const updateBoundaryRelation = (objectClass) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: UPDATE_BOUNDARY_RELATION,
    payload: { objectClass }
  });
}
