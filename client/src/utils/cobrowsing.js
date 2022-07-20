export function getRemoteCobrowsingState(state, props) {
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