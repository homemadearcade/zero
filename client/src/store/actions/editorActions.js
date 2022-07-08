import { 
  OPEN_CONTEXT_MENU,
  CLOSE_CONTEXT_MENU,
  OPEN_LIVE_EDITOR,
  CLOSE_LIVE_EDITOR,
  SELECT_CLASS,
  CLEAR_CLASS,
  SELECT_BRUSH,
  CLEAR_BRUSH
} from '../types';

export const selectClass = (classId) => (dispatch, getState) => {
  dispatch({
    type: SELECT_CLASS,
    payload: {
      classSelectedIdClassList: classId, 
    }
  });
}

export const clearClass = (classId) => (dispatch, getState) => {
  dispatch({
    type: CLEAR_CLASS,
  });
}

export const selectBrush = (brushId) => (dispatch, getState) => {
  dispatch({
    type: SELECT_BRUSH,
    payload: {
      brushSelectedIdBrushList: brushId, 
    }
  });
}

export const clearBrush = (brushId) => (dispatch, getState) => {
  dispatch({
    type: CLEAR_BRUSH,
  });
}

export const openContextMenuFromGameObject = (gameObjects, event) => (dispatch, getState) => {
  dispatch({
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
    type: CLOSE_CONTEXT_MENU
  });
}

export const openLiveEditor = (classId, pointer) => (dispatch, getState) => {
  dispatch({
    type: OPEN_LIVE_EDITOR,
    payload: {
      classSelectedIdLiveEditor: classId, 
    }
  });
}

export const closeLiveEditor = () => (dispatch, getState) => {
  dispatch({
    type: CLOSE_LIVE_EDITOR
  });
}