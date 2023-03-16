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

export const openContextMenuFromObjectInstance = (objectInstances, event) => (dispatch, getState) => {
  // if(getInterfaceIdData(CONTEXT_MENU_CONTAINER_IID).isObscured) return 

  if(objectInstances[0].effectSpawned) return

  dispatch({
    // updateCobrowsing: true,
    // cobrowsingPublisherOnly: true,
    type: OPEN_CONTEXT_MENU,
    payload: {
      classIdSelectedContextMenu: objectInstances[0].classId, 
      instanceIdSelectedContextMenu: objectInstances.length === 1 ? objectInstances[0].instanceId : null, 
      selectableObjectInstances: objectInstances.length > 1 ? objectInstances.map(({instanceId, classId}) => { return {objectId: instanceId, classId}}) : null, 
      contextMenuX: event.pageX,
      contextMenuY: event.pageY
    }
  });
}

export const openContextMenuFromClassId= (classId, event) => (dispatch, getState) => {
  // if(getInterfaceIdData(CONTEXT_MENU_CONTAINER_IID).isObscured) return 

  dispatch({
    // updateCobrowsing: true,
    // cobrowsingPublisherOnly: true,
    type: OPEN_CONTEXT_MENU,
    payload: {
      classIdSelectedContextMenu: classId, 
      selectableObjectInstances: null,
      contextMenuX: event.pageX,
      contextMenuY: event.pageY
    }
  });
}

export const openContextMenuFromObjectInstanceId= (instanceId, classId, event) => (dispatch, getState) => {
  // if(getInterfaceIdData(CONTEXT_MENU_CONTAINER_IID).isObscured) return 

  dispatch({
    // updateCobrowsing: true,
    // cobrowsingPublisherOnly: true,
    type: OPEN_CONTEXT_MENU,
    payload: {
      instanceIdSelectedContextMenu: instanceId,
      classIdSelectedContextMenu: classId,
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