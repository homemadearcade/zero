import store from "../store"

export function getRemoteStatePackage(state) {
  return {
    video: state.video,
    editor: state.editor,
    editorForms: state.editorForms,
    editorInstance: state.editorInstance,
    unlockableInterfaceIds: state.unlockableInterfaceIds,
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
    } else if(propName === 'unlockableInterfaceIds') {
      prev[propName] = remoteState.unlockableInterfaceIds
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
    unlockableInterfaceIds: remoteState.unlockableInterfaceIds
  }
}

export function getInterfaceIdAliases(interfaceId) {
  const ids = interfaceId.split(' ')

  const idLayers = ids.map((id) => {
    return id.split('/')
  })

  const idAliases = idLayers.map((layers) => {
    return layers.map((idLayer, index) => {
      let prefix = ''
      for(let i = 0; i < index; i++) {
        if(prefix.length) {
          prefix = prefix + '/' + layers[i]
        } else {
          prefix = prefix + layers[i]
        }
      }

      if(prefix.length) {
        const idSection = prefix +'/'+ idLayer
        return idSection
      } else {
        return idLayer
      }
    })
  }, [])

  return idAliases
}

export function areIdAliasesUnlocked(idAliases, unlockableInterfaceIds) {
  return unlockableInterfaceIds['all'] || idAliases.every((aliases) => {
    return aliases.some((alias) => {
      return unlockableInterfaceIds[alias]
    })
  })
} 

export function getInterfaceIdData(interfaceId) {
  const state = getCobrowsingState()
  const unlockableInterfaceIds = state.unlockableInterfaceIds
  const idAliases = getInterfaceIdAliases(interfaceId)

  if(!state.lobby.lobby.id) {
    return {
      isUnlocked: true,
      idAliases,
      isObscured: false,
      isLockToggleable: false
    }
  }

  const isUnlocked = areIdAliasesUnlocked(idAliases, unlockableInterfaceIds)
  const isObscured = isInterfaceIdObscured(interfaceId)

  const isSubscribedCobrowsing = state.cobrowsing.isSubscribedCobrowsing
  const me = state.auth.me
  const isLockToggleable = me?.role === 'ADMIN' && isSubscribedCobrowsing

  return {
    isUnlocked,
    idAliases,
    isObscured,
    isLockToggleable
  }
}

export function isInterfaceIdObscured(interfaceId) {
  const state = getCobrowsingState()
  const isSubscribedCobrowsing = state.cobrowsing.isSubscribedCobrowsing
  const me = state.auth.me

  if(me?.role === 'ADMIN') {
    return false
  }

  if(isSubscribedCobrowsing) {
    return false
  }

  return true
}