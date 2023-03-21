import axios from 'axios';
import { attachTokenToHeaders } from './authActions';
import _ from 'lodash';

import {
  START_COBROWSING_SUCCESS,
  START_COBROWSING_FAIL,
  END_COBROWSING_SUCCESS,
  END_COBROWSING_FAIL,
  UPDATE_COBROWSING_FAIL,
  SUBSCRIBE_COBROWSING_LOADING,
  SUBSCRIBE_COBROWSING_SUCCESS,
  SUBSCRIBE_COBROWSING_FAIL,
  UNSUBSCRIBE_COBROWSING_LOADING,
  UNSUBSCRIBE_COBROWSING_SUCCESS,
  UNSUBSCRIBE_COBROWSING_FAIL,
  ON_COBROWSING_SUBSCRIBED,
  ON_COBROWSING_UPDATE,
  ON_COBROWSING_STATUS_UPDATE,
  ON_COBROWSING_REMOTE_DISPATCH,
  TOGGLE_COBROWSING,
  TOGGLE_UNLOCKABLE_INTERFACE_LOCKS,
  LOCK_INTERFACE,
  UNLOCK_INTERFACE,
  SET_MOUSE_OVER_INTERFACE_ID,
  SELECT_COBROWSING_TOOL,
} from '../types';

import store from '..';
import { getRemoteStatePackage } from '../../utils/cobrowsingUtils';
import { getCurrentGameScene } from '../../utils/editorUtils';
import { updateArcadeGameCharacter } from './arcadeGameActions';
import { mergeDeep } from '../../utils/utils';
import { OPEN_TOOL } from '../../constants';

const sendCobrowsingStatus = _.debounce((e) =>  {
  const state = store.getState()
  const userId = state.auth.me.id
  const lobbyId = state.lobby.lobby.id 

  if(!e) {
    window.socket.emit(ON_COBROWSING_STATUS_UPDATE, {
      lobbyId,
      userId,
      cobrowsingMouse: {
        lastPing: Date.now()
      }
    })
    return
  }

  const viewWidth = (window.innerHeight + (window.innerHeight * .65) - 4);
  const viewPadding = (window.innerWidth - viewWidth)/2
  const xPercent = (e.clientX - viewPadding)/viewWidth

  const cobrowsingStatus = {
    lobbyId,
    userId,
    cobrowsingMouse: {
      xPercent,
      // xPercent: e.clientX/window.innerWidth,
      yPercent: e.clientY/window.innerHeight,
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      didClick: window.didClick,
      lastPing: Date.now(),
    },
  }

  // const leftColumn = document.getElementById('GameEditor__left-column')
  // const rightColumn = document.getElementById('GameEditor__right-column')

  // if(leftColumn && rightColumn) {
  //   cobrowsingStatus.cobrowsingScroll = {
  //     leftColumnScrollYPercent: leftColumn.scrollTop/leftColumn.scrollHeight,
  //     rightColumnScrollYPercent: rightColumn.scrollTop/rightColumn.scrollHeight
  //   }
  // }

  if(state.webPage.gameInstance && window.pointer) {
    
    const cameraZoom = state.gameViewEditor.cameraZoom

    const scene = getCurrentGameScene(state.webPage.gameInstance)
    if(!scene) return 
    const camera = scene.editorCamera
    if(!camera) return

    cobrowsingStatus.phaserView = {
      isGridViewOn: state.gameViewEditor.isGridViewOn,
      mouseWorldX: window.pointer.worldX,
      mouseWorldY: window.pointer.worldY,
      cameraX: camera.worldView.x,
      cameraY: camera.worldView.y,
      cameraZoom
    }
  }

  window.socket.emit(ON_COBROWSING_STATUS_UPDATE, cobrowsingStatus)
}, 7)

function onEditorKeyUp(event) {
  const state = store.getState()

  if(!state.cobrowsing.isSubscribedCobrowsing) return
  if(!event.key) return
  if(event.key.toLowerCase() === '\\'){
    store.dispatch({
      type: TOGGLE_COBROWSING,
      payload: {
        value: !store.getState().cobrowsing.isActivelyCobrowsing
      }
    })
  }
}

window.addEventListener('mouseup', (event) => {
  setTimeout(() => {
    window.didClick = false
  }, 300)
})

function onEditorClick(event) {
  window.didClick = true
  sendCobrowsingStatus(event)
}

function onCobrowsingKeyUp(event) {
  let shouldUpdate = false
  if(event.key.toLowerCase() === 'w') {
    shouldUpdate = true
  } else if(event.key.toLowerCase() === 'a'){
    shouldUpdate = true
  } else if(event.key.toLowerCase() === 's'){
    shouldUpdate = true
  } else if(event.key.toLowerCase() === 'd'){
    shouldUpdate = true
  }

  if(shouldUpdate){
    setTimeout(() => {
      sendCobrowsingStatus(event)
    }, 500)
  }
}

export const handleCobrowsingUpdates = store => next => action => {
  // console.log('dispatching', action)
  // let result = next(action)
  // console.log('next state', store.getState())
  // return result

  const state = store.getState()

  // console.log(action)

  // is this action connected to cobrowsing?
  if(action.updateCobrowsing && state.lobby.lobby?.id) {

    // is the user subscribed to cobrowse session?
    if(state.cobrowsing.isSubscribedCobrowsing) {
      // is the cobrowsing currently active and you have a tool selected - we send the action to the publishers computer
      // some actions can bypass this (forceCobrowsingUpdate) and some actions ignore this (cobrowsingPublisherOnly)
      if(((state.cobrowsing.isActivelyCobrowsing && state.cobrowsing.selectedTool) || action.forceCobrowsingUpdate) && !action.cobrowsingPublisherOnly) {
        // UPDATE PUBLISHER
        const options = attachTokenToHeaders(store.getState);
        axios.put('/api/cobrowsing/dispatch/' + state.cobrowsing.cobrowsingUser.id, { dispatchData: action }, options);
        return null
      }

      // this means you are cobrowsing but you dont have a tool selected
      // without this, the local users state will be updated silently behind the cobrowsing view
      if(state.cobrowsing.isActivelyCobrowsing) {
        return 
      }

      // NORMAL ACTION
      return next(action)
    }


    //  else if(action.externalForceCobrowsingUpdateUserId && action.externalForceCobrowsingUpdateUserId !== state.auth.me.id) {
    //   // this happens when you arent currently cobrowsing or even subscribed to a cobrowsing
    //   // user. Its likely clicking a button outside of a cobrowsing context that is meant
    //   // to inflict a change on a users UI
     
    //   // publisher gets the message but does not trigger this part, it skips to next

    //   // AS OF NOW... THIS DOES NOT HAPPEN ANYWHERE

    //   // UPDATE PUBLISHER
    //   const options = attachTokenToHeaders(store.getState);
    //   axios.put('/api/cobrowsing/dispatch/' + action.externalForceCobrowsingUpdateUserId, { dispatchData: action }, options);
    //   return null
    // }


    const result = next(action)
    // UPDATE SUBSCRIBERS
    store.dispatch(
      updateCobrowsing(getRemoteStatePackage(store.getState()))
    )
    return result
  }
    
  // NORMAL ACTION
  return next(action)
}

export const publishCobrowsing = () => (dispatch, getState) => {
  try {
    const state = getState()

    const user = state.auth.me

    // this event will send admins your mouse state to let them know you can be browsed
    window.addEventListener('mousemove', sendCobrowsingStatus)
    window.addEventListener('keyup', onCobrowsingKeyUp)
    window.addEventListener('mousedown', onEditorClick) 
    window.addEventListener('wheel', sendCobrowsingStatus);
    window.cobrowsingStatusInterval = setInterval(sendCobrowsingStatus, 6000)

    dispatch({
      type: START_COBROWSING_SUCCESS,
      payload: { 
        cobrowsingUser: user
      }
    });

    // event that is triggered if cobrowsing has been registered
    window.socket.on(ON_COBROWSING_REMOTE_DISPATCH, ({dispatchData}) => {
      dispatch(dispatchData);

      if(dispatchData.type === UNLOCK_INTERFACE) {
        dispatch(updateArcadeGameCharacter({
          userId: user.id,
          unlockableInterfaceIds: {
            [dispatchData.payload.interfaceId]: true
          },
          merge: true
        }))
      }
      if(dispatchData.type === LOCK_INTERFACE) {
        dispatch(updateArcadeGameCharacter({
          userId: user.id,
          unlockableInterfaceIds: {
            [dispatchData.payload.interfaceId]: false
          },
          merge: true
        }))
      }
    });

    // event that is triggered if another user has subscribed to your cobrowsingu, sends the initial state out
    window.socket.on(ON_COBROWSING_SUBSCRIBED, () => {
      dispatch(updateCobrowsing(getRemoteStatePackage(getState())))
    });
    
    dispatch(updateCobrowsing(getRemoteStatePackage(getState())))
  } catch (err) {
    console.error(err)

    dispatch({
      type: START_COBROWSING_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const unpublishCobrowsing = () => (dispatch, getState) => {
  try {
    window.removeEventListener('mousemove', sendCobrowsingStatus);
    window.removeEventListener('keyup', onCobrowsingKeyUp)
    window.removeEventListener('wheel', sendCobrowsingStatus);
    window.removeEventListener('mousedown', onEditorClick) 
    clearInterval(window.cobrowsingStatusInterval)

    window.socket.off(ON_COBROWSING_SUBSCRIBED);
    window.socket.off(ON_COBROWSING_REMOTE_DISPATCH)

    dispatch({
      type: END_COBROWSING_SUCCESS,
      payload: {}
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: END_COBROWSING_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const updateCobrowsing = (remoteState) => async (dispatch, getState) => {
  const userId = getState().cobrowsing.cobrowsingUser.id

  if(!userId) {
    return console.log('no user id in update cobrowsing')
  }

  try {
    // dispatch({
    //   type: ON_COBROWSING_UPDATE,
    //   payload: { remoteState },
    // });
    
    const options = attachTokenToHeaders(getState);
    await axios.put('/api/cobrowsing/' + userId, { remoteState }, options);
  } catch (err) {
    console.error(err)

    dispatch({
      type: UPDATE_COBROWSING_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const subscribeCobrowsing = ({userId}) => async (dispatch, getState) => {
  dispatch({
    type: SUBSCRIBE_COBROWSING_LOADING,
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/cobrowsing/' + userId, {}, options);

    window.addEventListener('keyup', onEditorKeyUp)

    // event that is triggered if cobrowsing has been registered
    window.socket.on(ON_COBROWSING_UPDATE, ({userId, remoteState}) => {
      dispatch({
        type: ON_COBROWSING_UPDATE,
        payload: { 
          remoteStateUserId: userId,
          remoteState
        },
      });
    });

    dispatch({
      type: SUBSCRIBE_COBROWSING_SUCCESS,
      payload: { 
        cobrowsingUser: response.data.cobrowsingUser, 
      },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: SUBSCRIBE_COBROWSING_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const unsubscribeCobrowsing = ({userId}) => async (dispatch, getState) => {
  dispatch({
    type: UNSUBSCRIBE_COBROWSING_LOADING,
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    await axios.post('/api/cobrowsing/stop/' + userId, {}, options);

    window.removeEventListener('keyup', onEditorKeyUp)
    window.removeEventListener('mousedown', onEditorClick) 

    window.socket.off(ON_COBROWSING_UPDATE);

    dispatch({
      type: UNSUBSCRIBE_COBROWSING_SUCCESS,
      payload: { },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: UNSUBSCRIBE_COBROWSING_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const toggleActiveCobrowsing = (value) => (dispatch, getState) => {
  store.dispatch({
    type: TOGGLE_COBROWSING,
    payload: {
      value: value? value : !getState().cobrowsing.isActivelyCobrowsing
    }
  })
}

export const toggleUnlockableInterfaceLocks = (value) => (dispatch, getState) => {
  store.dispatch({
    type: TOGGLE_UNLOCKABLE_INTERFACE_LOCKS,
    payload: {
      value: value === undefined ? !getState().cobrowsing.showUnlockableInterfaceLocks : value
    }
  })
}

export const setMouseOverInterfaceId = (interfaceId) => (dispatch, getState) => {
  store.dispatch({
    type: SET_MOUSE_OVER_INTERFACE_ID,
    payload: {
      interfaceId,
    }
  })
}

export const selectCobrowsingTool = (toolId) => (dispatch, getState) => {
  store.dispatch({
    type: SELECT_COBROWSING_TOOL,
    payload: {
      toolId
    }
  })
}