import store from "../store"

export function getRemoteStatePackage(state) {
  return {
    video: state.video.videoState,
    lobby: state.lobby.lobbyState,
    editor: state.editor.editorState,
    editorForms: state.editorForms.editorFormsState,
    editorInstance: state.editorInstance.editorInstanceState
  }
}

export function getLocalCobrowsingState(state) {
  return {
    videoState: state.video.videoState,
    lobbyState: state.lobby.lobbyState,
    editorState: state.editor.editorState,
    editorFormsState: state.editorForms.editorFormsState,
    editorInstanceState: state.editorInstance.editorInstanceState
  }
}

export function mapCobrowsingState(state, props) {
  const isCobrowsing = state.cobrowsing.isSubscribedCobrowsing
  if(!isCobrowsing) return props

  const remoteState = Object.keys(props).reduce((prev, propName) => {
    const remoteState = state.cobrowsing.remoteState
    if(propName === 'editorState') {
      prev[propName] = remoteState.editor
    } else if(propName === 'editorFormsState') {
      prev[propName] = remoteState.editorForms
    } else if(propName === 'videoState') {
      prev[propName] = remoteState.video
    } else if(propName === 'lobbyState') {
      prev[propName] = remoteState.lobby
    } else if(propName === 'editorInstanceState') {
      prev[propName] = remoteState.editorInstance
    }

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

  if(!isCobrowsing) return {
    ...state,
    ...getLocalCobrowsingState(state)
  }

  const remoteState = state.cobrowsing.remoteState

  return {
    ...state,
    editorState: remoteState.editor,
    editorInstanceState: remoteState.editorInstance,
    editorFormsState: remoteState.editorForms,
    lobbyState: remoteState.lobby,
    videoState: remoteState.video,
  }
}