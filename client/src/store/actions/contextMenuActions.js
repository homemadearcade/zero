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

export const openStageContextMenu = (event) => (dispatch, getState) => {
  // if(getInterfaceIdData(CONTEXT_MENU_CONTAINER_IID).isObscured) return 

  dispatch({
    // updateCobrowsing: true,
    // cobrowsingPublisherOnly: true,
    type: OPEN_CONTEXT_MENU,
    payload: {
      contextMenuX: event.pageX,
      contextMenuY: event.pageY
    }
  });
}

export const openContextMenuFromObjectInstance = (entityInstances, event) => (dispatch, getState) => {
  // if(getInterfaceIdData(CONTEXT_MENU_CONTAINER_IID).isObscured) return 

  if(entityInstances[0].effectSpawned) return

  dispatch({
    // updateCobrowsing: true,
    // cobrowsingPublisherOnly: true,
    type: OPEN_CONTEXT_MENU,
    payload: {
      entityClassIdSelectedContextMenu: entityInstances[0].entityClassId, 
      entityInstanceIdSelectedContextMenu: entityInstances.length === 1 ? entityInstances[0].entityInstanceId : null, 
      selectableObjectInstances: entityInstances.length > 1 ? entityInstances.map(({entityInstanceId, entityClassId}) => { return {objectId: entityInstanceId, entityClassId}}) : null, 
      contextMenuX: event.pageX,
      contextMenuY: event.pageY
    }
  });
}

export const openContextMenuFromClassId= (entityClassId, event) => (dispatch, getState) => {
  // if(getInterfaceIdData(CONTEXT_MENU_CONTAINER_IID).isObscured) return 

  dispatch({
    // updateCobrowsing: true,
    // cobrowsingPublisherOnly: true,
    type: OPEN_CONTEXT_MENU,
    payload: {
      entityClassIdSelectedContextMenu: entityClassId, 
      selectableObjectInstances: null,
      contextMenuX: event.pageX,
      contextMenuY: event.pageY
    }
  });
}

export const openContextMenuFromObjectInstanceId= (entityInstanceId, entityClassId, event) => (dispatch, getState) => {
  // if(getInterfaceIdData(CONTEXT_MENU_CONTAINER_IID).isObscured) return 

  dispatch({
    // updateCobrowsing: true,
    // cobrowsingPublisherOnly: true,
    type: OPEN_CONTEXT_MENU,
    payload: {
      entityInstanceIdSelectedContextMenu: entityInstanceId,
      entityClassIdSelectedContextMenu: entityClassId,
      selectableObjectInstances: null,
      contextMenuX: event.pageX,
      contextMenuY: event.pageY
    }
  });
}

export const closeContextMenu = () => (dispatch, getState) => {
  // if(getInterfaceIdData(CONTEXT_MENU_CONTAINER_IID).isObscured) return 

  dispatch({
    // updateCobrowsing: true,
    // cobrowsingPublisherOnly: true,
    type: CLOSE_CONTEXT_MENU
  });
}