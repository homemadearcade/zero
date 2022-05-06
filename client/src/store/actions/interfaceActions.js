import { 
  OPEN_CONTEXT_MENU,
  CLOSE_CONTEXT_MENU
} from '../types';

export const openContextMenu = (gameObjects, pointer) => (dispatch, getState) => {
  dispatch({
    type: OPEN_CONTEXT_MENU,
    payload: {
      contextMenuObjectSelected: gameObjects[0], 
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