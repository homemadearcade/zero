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
  CLEAR_EDITOR,
  CHANGE_EDITOR_CAMERA_ZOOM
} from '../types';


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
      classIdSelectedContextMenu: gameObjects[0].classId, 
      objectIdSelectedContextMenu: gameObjects[0].id,
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
      classIdSelectedContextMenu: classId, 
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