import store from "../store"

export function getRemoteStatePackage(state) {
  return {
    video: state.video,
    gameEditor: state.gameEditor,
    gameFormEditor: state.gameFormEditor,
    gameViewEditor: state.gameViewEditor,
    unlockableInterfaceIds: state.unlockableInterfaceIds,
    contextMenu: state.contextMenu,
    errors: state.errors,
    gameContext: state.gameContext,
    snackbar: state.snackbar
  }
}

export function mapCobrowsingState(state, props, options) {
  const isCobrowsing = state.cobrowsing.isActivelyCobrowsing
  const isSubscribed = state.cobrowsing.isSubscribedCobrowsing

  if((options?.forceActiveCobrowsing && isSubscribed) || isCobrowsing) {
    const remoteState = Object.keys(props).reduce((prev, propName) => {
      const remoteState = state.cobrowsing.remoteState
      if(propName === 'gameEditor') {
        prev[propName] = remoteState.gameEditor
      } else if(propName === 'gameFormEditor') {
        prev[propName] = remoteState.gameFormEditor
      } else if(propName === 'video') {
        prev[propName] = remoteState.video
      } else if(propName === 'gameViewEditor') {
        prev[propName] = remoteState.gameViewEditor
      } else if(propName === 'unlockableInterfaceIds') {
        prev[propName] = remoteState.unlockableInterfaceIds
      } else if(propName === 'errors') {
        prev[propName] = remoteState.errors
      } else if(propName === 'gameContext') {
        prev[propName] = remoteState.gameContext
      } else if(propName === 'snackbar') {
        prev[propName] = remoteState.snackbar
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
    unlockableInterfaceIds: isSubscribed ? state.cobrowsing.remoteState.unlockableInterfaceIds : state.unlockableInterfaceIds
  }
}

export function getCobrowsingState(options) {
  const state = store.getState()
  const isCobrowsing = state.cobrowsing.isActivelyCobrowsing
  const isSubscribed = state.cobrowsing.isSubscribedCobrowsing

  const remoteState = state.cobrowsing.remoteState

  if(isCobrowsing || (isSubscribed && options?.forceActiveCobrowsing)) {
    return {
      ...state,
      gameEditor: remoteState.gameEditor,
      gameViewEditor: remoteState.gameViewEditor,
      gameFormEditor: remoteState.gameFormEditor,
      video: remoteState.video,
      gameContext: remoteState.gameContext,
      unlockableInterfaceIds: remoteState.unlockableInterfaceIds,
      errors: remoteState.errors,
      snackbar: remoteState.snackbar
    }
  }

  return {
    ...state,
    unlockableInterfaceIds: isSubscribed ? remoteState.unlockableInterfaceIds : state.unlockableInterfaceIds
  }
}

export const forceCobrowsingUpdateDispatch = (fx) => (dispatch, getState) => {
  fx((dispatchData) => {
    dispatchData.forceCobrowsingUpdate = true
    dispatch(dispatchData)
  }, getState)
}