import { 
  OPEN_CONTEXT_MENU,
  CLOSE_CONTEXT_MENU,
  OPEN_LIVE_EDITOR,
  CLOSE_LIVE_EDITOR
} from '../types';

export const openContextMenu = (gameObjects, pointer) => (dispatch, getState) => {
  dispatch({
    type: OPEN_CONTEXT_MENU,
    payload: {
      objectSelected: gameObjects[0], 
      // objectSelected: gameObjects.length === 1 ? gameObjects[0] : null, 
      contextMenuSelectableObjects: gameObjects.length > 1 ? gameObjects : null, 
      contextMenuX: pointer.event.pageX,
      contextMenuY: pointer.event.pageY
    }
  });

  document.body.addEventListener('click', () => {
    dispatch(closeContextMenu())
  })
}

export const closeContextMenu = () => (dispatch, getState) => {
  dispatch({
    type: CLOSE_CONTEXT_MENU
  });
}

export const openLiveEditor = (gameObject, pointer) => (dispatch, getState) => {
  dispatch({
    type: OPEN_LIVE_EDITOR,
    payload: {
      objectSelected: gameObject, 
    }
  });

  document.body.addEventListener('click', () => {
    dispatch(closeContextMenu())
  })
}

export const closeLiveEditor = () => (dispatch, getState) => {
  dispatch({
    type: CLOSE_LIVE_EDITOR
  });
}