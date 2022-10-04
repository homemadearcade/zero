import store from "../store"

export function getRemoteStatePackage(state) {
  return {
    video: state.video,
    editor: state.editor,
    editorForms: state.editorForms,
    editorInstance: state.editorInstance,
    unlockableInterfaceIds: state.unlockableInterfaceIds,
    narrative: state.narrative,
    contextMenu: state.contextMenu,
    errors: state.errors,
    homemadeArcade: state.homemadeArcade
  }
}

export function mapCobrowsingState(state, props) {
  const isCobrowsing = state.cobrowsing.isCurrentlyCobrowsing
  const isSubscribed = state.cobrowsing.isSubscribedCobrowsing

  if(!isCobrowsing) {
    return {
      ...props,
      unlockableInterfaceIds: isSubscribed ? state.cobrowsing.remoteState.unlockableInterfaceIds : state.unlockableInterfaceIds
    }
  }

  const remoteState = Object.keys(props).reduce((prev, propName) => {
    const remoteState = state.cobrowsing.remoteState
    if(propName === 'editor') {
      prev[propName] = remoteState.editor
    } else if(propName === 'editorForms') {
      prev[propName] = remoteState.editorForms
    } else if(propName === 'video') {
      prev[propName] = remoteState.video
    } else if(propName === 'editorInstance') {
      prev[propName] = remoteState.editorInstance
    } else if(propName === 'unlockableInterfaceIds') {
      prev[propName] = remoteState.unlockableInterfaceIds
    } else if(propName === 'errors') {
      prev[propName] = remoteState.errors
    } else if(propName === 'narrative') {
      prev[propName] = remoteState.narrative
    } else if(propName === 'homemadeArcade') {
      prev[propName] = remoteState.homemadeArcade
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

export function getCobrowsingState() {
  const state = store.getState()
  const isCobrowsing = state.cobrowsing.isCurrentlyCobrowsing
  const isSubscribed = state.cobrowsing.isSubscribedCobrowsing

  const remoteState = state.cobrowsing.remoteState

  if(!isCobrowsing) return {
    ...state,
    unlockableInterfaceIds: isSubscribed ? remoteState.unlockableInterfaceIds : state.unlockableInterfaceIds
  }

  return {
    ...state,
    editor: remoteState.editor,
    editorInstance: remoteState.editorInstance,
    editorForms: remoteState.editorForms,
    video: remoteState.video,
    narrative: remoteState.narrative,
    homemadeArcade: remoteState.homemadeArcade,
    unlockableInterfaceIds: remoteState.unlockableInterfaceIds,
    errors: remoteState.errors
  }
}