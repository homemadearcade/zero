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
      objectSelectedId: gameObjects[0].id, 
      // objectSelected: gameObjects.length === 1 ? gameObjects[0] : null, 
      selectableObjectIds: gameObjects.length > 1 ? gameObjects.map(({id}) => id) : null, 
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

export const openLiveEditor = (gameObjectId, pointer) => (dispatch, getState) => {
  dispatch({
    type: OPEN_LIVE_EDITOR,
    payload: {
      objectSelectedId: gameObjectId, 
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