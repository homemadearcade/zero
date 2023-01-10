import { ADMIN_ROLE } from "../game/constants"
import store from "../store"
import { getCobrowsingState } from "./cobrowsingUtils"

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
  return unlockableInterfaceIds['all'] || idAliases.some((aliases) => {
    const starAlias = aliases.find((alias) => {
      return alias.indexOf('*') >= 0
    })
    if(starAlias) {
      return Object.keys(unlockableInterfaceIds).some((id) => {
        if(!unlockableInterfaceIds[id]) return false
        return id.indexOf(starAlias.slice(0, -2)) === 0
      })
    }

    return aliases.some((alias) => {
      return unlockableInterfaceIds[alias]
    })
  })
}

export function getInterfaceIdData(interfaceId) {
  const state = getCobrowsingState()
  const unlockableInterfaceIds = state.unlockableInterfaceIds
  const idAliases = getInterfaceIdAliases(interfaceId)
  const me = state.auth.me

  // if(!state.lobby.lobby.id) {
  //   let isUnlocked = true
  //   let isObscured = false

  //   if(me?.role !== ADMIN_ROLE) {
  //     if(idAliases.some((aliases) => {
  //       return aliases.indexOf('adminOnly') === 0
  //     })) {
  //       isUnlocked = false
  //       isObscured = true
  //     }
  //   }

  //   return {
  //     isUnlocked,
  //     idAliases,
  //     isObscured,
  //     isLockToggleable: false
  //   }
  // }

  const isUnlocked = areIdAliasesUnlocked(idAliases, unlockableInterfaceIds)
  const isObscured = isInterfaceIdObscured(interfaceId) && !isUnlocked

  const isSubscribedCobrowsing = state.cobrowsing.isSubscribedCobrowsing
  const isLockToggleable = me?.role === ADMIN_ROLE && isSubscribedCobrowsing

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
  const isCurrentlyCobrowsing = state.cobrowsing.isCurrentlyCobrowsing
  const me = state.auth.me
  
  if(isSubscribedCobrowsing) {
    if(isCurrentlyCobrowsing) return true
    else return false
  }

  if(me?.role === ADMIN_ROLE) return false
  
  return true
}