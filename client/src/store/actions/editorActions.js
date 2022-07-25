import { 
  OPEN_CONTEXT_MENU,
  CLOSE_CONTEXT_MENU,
  OPEN_LIVE_PHYSICS_EDITOR,
  OPEN_LIVE_WORLD_EDITOR,
  OPEN_LIVE_CAMERA_EDITOR,
  CLOSE_LIVE_EDITOR,
  SELECT_CLASS,
  CLEAR_CLASS,
  SELECT_BRUSH,
  CLEAR_BRUSH,
  UPDATE_BRUSH_SIZE,
  CLEAR_EDITOR
} from '../types';

export const selectClass = (classId) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: SELECT_CLASS,
    payload: {
      classSelectedIdClassList: classId, 
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
      brushSelectedIdBrushList: brushId, 
    }
  });
}

export const clearBrush = (brushId) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLEAR_BRUSH,
  });
}

export const openWorldContextMenu = (event) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_CONTEXT_MENU,
    payload: {
      contextMenuX: event.pageX,
      contextMenuY: event.pageY
    }
  });
}

export const openContextMenuFromGameObject = (gameObjects, event) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_CONTEXT_MENU,
    payload: {
      classSelectedIdContextMenu: gameObjects[0].classId, 
      objectSelectedIdContextMenu: gameObjects[0].id,
      // objectSelectedId: gameObjects.length === 1 ? gameObjects[0].id : null, 
      selectableObjectIds: gameObjects.length > 1 ? gameObjects.map(({id}) => id) : null, 
      contextMenuX: event.pageX,
      contextMenuY: event.pageY
    }
  });
}

export const openContextMenuFromClassId= (classId, event) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_CONTEXT_MENU,
    payload: {
      classSelectedIdContextMenu: classId, 
      contextMenuX: event.pageX,
      contextMenuY: event.pageY
    }
  });
}

export const closeContextMenu = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_CONTEXT_MENU
  });
}

export const openLivePhysicsEditor = (classId) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_LIVE_PHYSICS_EDITOR,
    payload: {
      classSelectedIdLiveEditor: classId, 
    }
  });
}

export const openLiveCameraEditor = (classId) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_LIVE_CAMERA_EDITOR,
    payload: {
      classSelectedIdLiveEditor: classId, 
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

export const closeLiveEditor = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_LIVE_EDITOR
  });
}

export const clearEditor = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLEAR_EDITOR
  });
}