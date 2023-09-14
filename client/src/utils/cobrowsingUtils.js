import store from "../store"

export function getRemoteStatePackage(state) {
  return {
    // video: state.video,
    gameSelector: state.gameSelector,
    gameFormEditor: state.gameFormEditor,
    gameViewEditor: state.gameViewEditor,
    unlockedInterfaceIds: state.unlockedInterfaceIds,
    keyToolbar: state.keyToolbar,
    // contextMenu: state.contextMenu,
    errors: state.errors,
    playerInterface: state.playerInterface,
    snackbar: state.snackbar
  }
}

export function mapCobrowsingState(state, props, options) {
  const isActivelyCobrowsing = state.cobrowsing.isActivelyCobrowsing
  const isSubscribed = state.cobrowsing.isSubscribedCobrowsing

  if((options?.forceActiveCobrowsing && isSubscribed) || isActivelyCobrowsing) {
    const remoteState = Object.keys(props).reduce((prev, propName) => {
      const remoteState = state.cobrowsing.remoteState
      if(propName === 'gameSelector') {
        prev[propName] = remoteState.gameSelector
      } else if(propName === 'gameFormEditor') {
        prev[propName] = remoteState.gameFormEditor
      // } else if(propName === 'video') {
        // prev[propName] = remoteState.video
      } else if(propName === 'gameViewEditor') {
        prev[propName] = remoteState.gameViewEditor
      } else if(propName === 'unlockedInterfaceIds') {
        prev[propName] = remoteState.unlockedInterfaceIds
      } else if(propName === 'errors') {
        prev[propName] = remoteState.errors
      } else if(propName === 'playerInterface') {
        prev[propName] = remoteState.playerInterface
      } else if(propName === 'snackbar') {
        prev[propName] = remoteState.snackbar
      } else if(propName === 'keyToolbar') {
        prev[propName] = remoteState.keyToolbar
      }
            
      // else if(propName === 'contextMenu') {
      //   prev[propName] = remoteState.contextMenu
      // }

      return prev 
    }, {})

    const transformedState = {
      ...props,
      ...remoteState
    }

    return transformedState
  }

  return {
    ...props,
    // unlockedInterfaceIds: isSubscribed ? state.cobrowsing.remoteState.unlockedInterfaceIds : state.unlockedInterfaceIds
  }
}

export function getCobrowsingState(options) {
  const state = store.getState()
  const isActivelyCobrowsing = state.cobrowsing.isActivelyCobrowsing
  const isSubscribed = state.cobrowsing.isSubscribedCobrowsing

  const remoteState = state.cobrowsing.remoteState

  if(isActivelyCobrowsing || (isSubscribed && options?.forceActiveCobrowsing)) {
    return {
      ...state,
      gameSelector: remoteState.gameSelector,
      gameViewEditor: remoteState.gameViewEditor,
      gameFormEditor: remoteState.gameFormEditor,
      // video: remoteState.video,
      playerInterface: remoteState.playerInterface,
      unlockedInterfaceIds: remoteState.unlockedInterfaceIds,
      errors: remoteState.errors,
      snackbar: remoteState.snackbar,
    }
  }

  return {
    ...state,
    unlockedInterfaceIds: isSubscribed ? remoteState.unlockedInterfaceIds : state.unlockedInterfaceIds
  }
}

export const forceCobrowsingUpdateDispatch = async (fx) => {
  return await fx(async (dispatchData) => {
    dispatchData.forceCobrowsingUpdate = true
    dispatchData.updateCobrowsing = true
    return await store.dispatch(dispatchData)
  }, store.getState)
}