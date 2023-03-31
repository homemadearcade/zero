import { 
  OPEN_CONTEXT_MENU,
  CLOSE_CONTEXT_MENU,
} from '../../types';

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

export const openContextMenuFromEntityInstance = (entityInstances, event) => (dispatch, getState) => {
  // if(getInterfaceIdData(CONTEXT_MENU_CONTAINER_IID).isObscured) return 

  if(entityInstances[0].effectSpawned) return

  dispatch({
    // updateCobrowsing: true,
    // cobrowsingPublisherOnly: true,
    type: OPEN_CONTEXT_MENU,
    payload: {
      entityModelIdSelectedContextMenu: entityInstances[0].entityModelId, 
      entityInstanceIdSelectedContextMenu: entityInstances.length === 1 ? entityInstances[0].entityInstanceId : null, 
      selectableEntityInstances: entityInstances.length > 1 ? entityInstances.map(({entityInstanceId, entityModelId}) => { return {objectId: entityInstanceId, entityModelId}}) : null, 
      contextMenuX: event.pageX,
      contextMenuY: event.pageY
    }
  });
}

export const openContextMenuFromEntityId= (entityModelId, event) => (dispatch, getState) => {
  // if(getInterfaceIdData(CONTEXT_MENU_CONTAINER_IID).isObscured) return 

  dispatch({
    // updateCobrowsing: true,
    // cobrowsingPublisherOnly: true,
    type: OPEN_CONTEXT_MENU,
    payload: {
      entityModelIdSelectedContextMenu: entityModelId, 
      selectableEntityInstances: null,
      contextMenuX: event.pageX,
      contextMenuY: event.pageY
    }
  });
}

export const openContextMenuFromEntityInstanceId= (entityInstanceId, entityModelId, event) => (dispatch, getState) => {
  // if(getInterfaceIdData(CONTEXT_MENU_CONTAINER_IID).isObscured) return 

  dispatch({
    // updateCobrowsing: true,
    // cobrowsingPublisherOnly: true,
    type: OPEN_CONTEXT_MENU,
    payload: {
      entityInstanceIdSelectedContextMenu: entityInstanceId,
      entityModelIdSelectedContextMenu: entityModelId,
      selectableEntityInstances: null,
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