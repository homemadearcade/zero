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
//       contextMenuX: event.webPageX,
//       contextMenuY: event.webPageY
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
      contextMenuX: event.webPageX,
      contextMenuY: event.webPageY
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
      objectIdSelectedContextMenu: gameObjects.length === 1 ? gameObjects[0].id : null, 
      selectableObjectInstances: gameObjects.length > 1 ? gameObjects.map(({id, classId}) => { return {objectId: id, classId}}) : null, 
      contextMenuX: event.webPageX,
      contextMenuY: event.webPageY
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
      selectableObjectInstances: null,
      contextMenuX: event.webPageX,
      contextMenuY: event.webPageY
    }
  });
}

export const openContextMenuFromObjectInstanceId= (objectId, classId, event) => (dispatch, getState) => {
  if(getInterfaceIdData('contextMenu/*').isObscured) return 

  console.log(objectId, classId, {      contextMenuX: event.webPageX,
    contextMenuY: event.webPageY})
  dispatch({
    updateCobrowsing: true,
    cobrowsingPublisherOnly: true,
    type: OPEN_CONTEXT_MENU,
    payload: {
      objectIdSelectedContextMenu: objectId,
      classIdSelectedContextMenu: classId,
      selectableObjectInstances: null,
      contextMenuX: event.webPageX,
      contextMenuY: event.webPageY
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