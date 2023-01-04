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
  LOAD_COBROWSING_PREVIEW_SUCCESS,
  LOAD_COBROWSING_PREVIEW_FAIL,
  LOAD_COBROWSING_PREVIEW_LOADING,
} from '../types';

import store from '..';
import { getRemoteStatePackage } from '../../utils/cobrowsingUtils';
import { getCurrentGameScene } from '../../utils/editorUtils';
import { editUser } from './userActions';
import { initializeUnlockableInterfaceIds, loadCobrowsingUnlockableInterfaceIds } from './unlockableInterfaceActions';

const sendCobrowsingStatus = _.debounce((e) =>  {
  const viewWidth = (window.innerHeight + (window.innerHeight * .4) - 4);
  const viewPadding = (window.innerWidth - viewWidth)/2
  const xPercent = (e.clientX - viewPadding)/viewWidth

  const state = store.getState()
  const userId = state.auth.me.id
  const lobbyId = state.lobby.lobby.id 

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

  const leftColumn = document.getElementById('GameEditor__left-column')
  const rightColumn = document.getElementById('GameEditor__right-column')

  if(leftColumn && rightColumn) {
    cobrowsingStatus.cobrowsingScroll = {
      leftColumnScrollYPercent: leftColumn.scrollTop/leftColumn.scrollHeight,
      rightColumnScrollYPercent: rightColumn.scrollTop/rightColumn.scrollHeight
    }
  }

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
      type: TOGGLE_COBROWSING
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

export const loadCobrowsingPreview = (userId) => async (dispatch, getState) => {
  dispatch({
    type: LOAD_COBROWSING_PREVIEW_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/users/byId/' + userId, options);

    dispatch(initializeUnlockableInterfaceIds(response.data.user.unlockableInterfaceIds))

    dispatch({
      type: LOAD_COBROWSING_PREVIEW_SUCCESS,
    });
  } catch (err) {
    console.error(err)
    dispatch({
      type: LOAD_COBROWSING_PREVIEW_FAIL,
      payload: { error: err.response.data.message },
    });
  }
};

export const handleCobrowsingUpdates = store => next => action => {
  // console.log('dispatching', action)
  // let result = next(action)
  // console.log('next state', store.getState())
  // return result

  const state = store.getState()
  
  // is this action connected to cobrowsing?
  if(action.updateCobrowsing && state.lobby.lobby?.id) {

    // is the user subscribed to cobrowse session?
    if(state.cobrowsing.isSubscribedCobrowsing) {
      // is the cobrowsing currently active/should we send the action to the publishers computer?
      if((state.cobrowsing.isCurrentlyCobrowsing || action.forceCobrowsingUpdate) && !action.cobrowsingPublisherOnly) {
        // UPDATE PUBLISHER
        const options = attachTokenToHeaders(store.getState);
        axios.put('/api/cobrowsing/dispatch/' + state.cobrowsing.cobrowsingUser.id, { dispatchData: action }, options);
        return null
      }

      // NORMAL ACTION
      return next(action)
    }


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
    window.addEventListener('wheel', sendCobrowsingStatus);

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
        dispatch(editUser(user.id, {
          unlockableInterfaceIds: {
            [dispatchData.payload.interfaceId]: true
          }
        }))
      }
      if(dispatchData.type === LOCK_INTERFACE) {
        dispatch(editUser(user.id, {
          unlockableInterfaceIds: {
            [dispatchData.payload.interfaceId]: false
          }
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
  try {
    const userId = getState().cobrowsing.cobrowsingUser.id

    if(!userId) {
      return console.trace()
    }

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
    window.addEventListener('mousedown', onEditorClick) 

    // event that is triggered if cobrowsing has been registered
    window.socket.on(ON_COBROWSING_UPDATE, ({userId, remoteState}) => {
      dispatch({
        type: ON_COBROWSING_UPDATE,
        payload: { 
          remoteState: {
            ...getState().cobrowsing.remoteState,
            ...remoteState
          }
        },
      });
    });

    dispatch({
      type: SUBSCRIBE_COBROWSING_SUCCESS,
      payload: { cobrowsingUser: response.data.cobrowsingUser },
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

export const toggleActiveCobrowsing = () => (dispatch, getState) => {
  store.dispatch({
    type: TOGGLE_COBROWSING
  })
}

export const toggleUnlockableInterfaceLocks = () => (dispatch, getState) => {
  store.dispatch({
    type: TOGGLE_UNLOCKABLE_INTERFACE_LOCKS
  })
}