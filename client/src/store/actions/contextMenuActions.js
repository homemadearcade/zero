import { getInterfaceIdData } from '../../utils/unlockableInterfaceUtils';
import { 
  OPEN_CONTEXT_MENU,
  CLOSE_CONTEXT_MENU,
} from '../types';

// export const openUnlockableContextMenu = (event, unlockableIds) => (dispatch, getState) => {
//   dispatch({
//     updateCobrowsing: true,
//     type: OPEN_CONTEXT_MENU,
//     payload: {
//       unlockableIds,
//       contextMenuX: event.pageX,
//       contextMenuY: event.pageY
//     }
//   });
// }

export const openWorldContextMenu = (event) => (dispatch, getState) => {
  if(getInterfaceIdData('contextMenu/*').isObscured) return 

  dispatch({
    updateCobrowsing: true,
    cobrowsingPublisherOnly: true,
    type: OPEN_CONTEXT_MENU,
    payload: {
      contextMenuX: event.pageX,
      contextMenuY: event.pageY
    }
  });
}

export const openContextMenuFromGameObject = (gameObjects, event) => (dispatch, getState) => {
  if(getInterfaceIdData('contextMenu/*').isObscured) return 

  dispatch({
    updateCobrowsing: true,
    cobrowsingPublisherOnly: true,
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
  if(getInterfaceIdData('contextMenu/*').isObscured) return 

  dispatch({
    updateCobrowsing: true,
    cobrowsingPublisherOnly: true,
    type: OPEN_CONTEXT_MENU,
    payload: {
      classIdSelectedContextMenu: classId, 
      contextMenuX: event.pageX,
      contextMenuY: event.pageY
    }
  });
}

export const closeContextMenu = () => (dispatch, getState) => {
  if(getInterfaceIdData('contextMenu/*').isObscured) return 

  dispatch({
    updateCobrowsing: true,
    cobrowsingPublisherOnly: true,
    type: CLOSE_CONTEXT_MENU
  });
}