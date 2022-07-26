import store from "../store"

export function getRemoteStatePackage(state) {
  return {
    video: state.video,
    editor: state.editor,
    editorForms: state.editorForms,
    editorInstance: state.editorInstance,
    contextMenu: state.contextMenu
  }
}

export function mapCobrowsingState(state, props) {
  const isCobrowsing = state.cobrowsing.isSubscribedCobrowsing
  if(!isCobrowsing) return props

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
  const isCobrowsing = state.cobrowsing.isSubscribedCobrowsing

  if(!isCobrowsing) return state

  const remoteState = state.cobrowsing.remoteState

  return {
    ...state,
    editor: remoteState.editor,
    editorInstance: remoteState.editorInstance,
    editorForms: remoteState.editorForms,
    video: remoteState.video,
  }
}