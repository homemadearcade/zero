import _ from 'lodash';
import { 
  OPEN_CREATE_CLASS_FLOW,
  CLOSE_CREATE_CLASS_FLOW,
  UPDATE_CREATE_CLASS,
  OPEN_CREATE_COLOR_FLOW,
  CLOSE_CREATE_COLOR_FLOW,
  TOGGLE_EYE_DROPPER,
  CLOSE_CREATE_BRUSH_FLOW,
  OPEN_CREATE_BRUSH_FLOW,
  UPDATE_CREATE_BRUSH,
  CLEAR_EDITOR_FORMS,
  CHANGE_EDITOR_CAMERA_ZOOM,
  UPDATE_CREATE_CUTSCENE,
  CLOSE_CREATE_CUTSCENE,
  OPEN_CREATE_CUTSCENE,
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
  OPEN_CLASS_EDIT_MODAL,
  CLOSE_CLASS_EDIT_MODAL,
  OPEN_CREATE_RELATION_TAG,
  CLOSE_CREATE_RELATION_TAG,
  UPDATE_CREATE_RELATION_TAG,
  OPEN_CREATE_EFFECT,
  CLOSE_CREATE_EFFECT,
  UPDATE_CREATE_EFFECT,
  OPEN_CREATE_EVENT,
  CLOSE_CREATE_EVENT,
  UPDATE_CREATE_EVENT,
  UPDATE_EDITING_EFFECT,
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

export const openEditClassGraphics = (entityClass) => (dispatch, getState) => {
  saveAllCurrentCanvases()

  dispatch({
    updateCobrowsing: true,
    type: OPEN_CREATE_CLASS_FLOW,
    payload: { entityClass: _.cloneDeep(entityClass) }
  });
}

export const closeEditClassGraphics = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_CREATE_CLASS_FLOW,
    payload: {}
  });
}

export const updateCreateClass = (entityClass) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: UPDATE_CREATE_CLASS,
    payload: { entityClass }
  });
}

export const openCreateColorFlow = (componentName, layerId) => (dispatch, getState) => {
  saveAllCurrentCanvases()

  dispatch({
    updateCobrowsing: true,
    type: OPEN_CREATE_COLOR_FLOW,
    payload: {
      componentName,
      layerId,
    }
  });
}

export const openEditClassModal = (entityClass) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_CLASS_EDIT_MODAL,
    payload: { entityClass: _.cloneDeep(entityClass) }
  });
}

export const closeEditClassModal = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_CLASS_EDIT_MODAL,
    payload: {}
  });
}


export const closeCreateColorFlow = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_CREATE_COLOR_FLOW,
    payload: {}
  });
}

export const toggleEyeDropper = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: TOGGLE_EYE_DROPPER,
    payload: {}
  });
}

export const openCreateBrushFlow = (layerId) => (dispatch, getState) => {
  saveAllCurrentCanvases()

  dispatch({
    updateCobrowsing: true,
    type: OPEN_CREATE_BRUSH_FLOW,
    payload: {
      layerId
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

export const openCreateStageModal = (initialStage) => (dispatch, getState) => {
  saveAllCurrentCanvases()

  dispatch({
    updateCobrowsing: true,
    type: OPEN_CREATE_STAGE,
    payload: { initialStage }
  });
}

export const closeCreateStageModal= () => (dispatch, getState) => {
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

export const openCreateRelation = (initialRelation) => (dispatch, getState) => {
  const gameModel = getState().gameModel.gameModel

  let event = null 
  if(initialRelation?.eventId) {
    event = gameModel.events[initialRelation.eventId]
  }

  dispatch({
    updateCobrowsing: true,
    type: OPEN_CREATE_RELATION,
    payload: { 
      initialRelation,
      event,
    }
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

export const updateBoundaryRelation = (entityClass) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: UPDATE_BOUNDARY_RELATION,
    payload: { entityClass }
  });
}

export const openCreateRelationTag = (initialRelationTag) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_CREATE_RELATION_TAG,
    payload: { initialRelationTag }
  });
}
export const closeCreateRelationTag= () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_CREATE_RELATION_TAG,
    payload: {}
  });
}
export const updateCreateRelationTag = (relationTag) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: UPDATE_CREATE_RELATION_TAG,
    payload: { relationTag }
  });
}





export const openCreateEffect = (initialEffect) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_CREATE_EFFECT,
    payload: { initialEffect }
  });
}
export const closeCreateEffect= () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_CREATE_EFFECT,
    payload: {}
  });
}
export const updateCreateEffect = (effect) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: UPDATE_CREATE_EFFECT,
    payload: { 
      effect
    }
  });
}

export const openCreateEvent = (initialEvent) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_CREATE_EVENT,
    payload: { initialEvent }
  });
}

export const closeCreateEvent= () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_CREATE_EVENT,
    payload: {}
  });
}

export const updateCreateEvent = (event) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: UPDATE_CREATE_EVENT,
    payload: { event }
  });
}
