import { 
  OPEN_LIVE_PHYSICS_EDITOR,
  OPEN_LIVE_WORLD_EDITOR,
  OPEN_LIVE_CAMERA_EDITOR,
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
  TOGGLE_GRID_VIEW,
  UPDATE_ACCORDIAN_LIST,
  OPEN_LIVE_PROJECTILE_EDITOR,
  OPEN_LIVE_MOVEMENT_EDITOR
} from '../types';

export const toggleGridView = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: TOGGLE_GRID_VIEW,
    payload: {}
  });
}

export const selectClass = (classId) => (dispatch, getState) => {
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

export const changeEditorCameraZoom = (zoom) => (dispatch, getState) => {
  dispatch({
    type: CHANGE_EDITOR_CAMERA_ZOOM,
    payload: {
      cameraZoom: zoom
    }
  });
}

export const openLivePhysicsEditor = (classId) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_LIVE_PHYSICS_EDITOR,
    payload: {
      classIdSelectedLiveEditor: classId, 
    }
  });
}

export const openLiveProjectileEditor = (classId) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_LIVE_PROJECTILE_EDITOR,
    payload: {
      classIdSelectedLiveEditor: classId, 
    }
  });
}

export const openLiveMovementEditor = (classId) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_LIVE_MOVEMENT_EDITOR,
    payload: {
      classIdSelectedLiveEditor: classId, 
    }
  });
}

export const openLiveCameraEditor = (classId) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_LIVE_CAMERA_EDITOR,
    payload: {
      classIdSelectedLiveEditor: classId, 
    }
  });
}

export const openLiveWorldEditor = (classId) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_LIVE_WORLD_EDITOR,
    payload: {}
  });
}

export const openSectionEditor= () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_SECTION_EDITOR,
    payload: {}
  });
}

export const closeSectionEditor= () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_SECTION_EDITOR,
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