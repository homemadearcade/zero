import { GAME_EDITOR_EXPERT_ROLE } from "../constants";
import { interfaceIdData } from "../constants/interfaceIdData"
import store from "../store"
import { getCobrowsingState } from "./cobrowsingUtils"

export function getHighestPriorityInterfaceId(interfaceIdsOpen) {
  let highestPriority = -1;
  let highestPriorityId = null
  Object.keys(interfaceIdsOpen).forEach((interfaceId) => {
    if(!interfaceIdsOpen[interfaceId]) return false
    const nextPriority = interfaceIdData[interfaceId].contentPriority
    if(nextPriority > highestPriority) {
      highestPriority = nextPriority
      highestPriorityId = interfaceId
    }
  })

  return highestPriorityId
}

export function getInterfaceIdAliases(interfaceId) {
  const interfaceIds = interfaceId.split(' ')

  const idLayers = interfaceIds.map((id) => {
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
        const idSection = prefix + '/' + idLayer
        return idSection
      } else {
        return idLayer
      }
    })
  }, [])

  return idAliases
}

export function areIdAliasesUnlocked(idAliases, unlockedInterfaceIds) {
  return unlockedInterfaceIds['all'] || idAliases.some((aliases) => {
    const starAlias = aliases.find((alias) => {
      return alias.indexOf('*') >= 0
    })
    if(starAlias) {
      return Object.keys(unlockedInterfaceIds).some((id) => {
        if(!unlockedInterfaceIds[id]) return false
        return id.indexOf(starAlias.slice(0, -2)) === 0
      })
    }

    return aliases.some((alias) => {
      return unlockedInterfaceIds[alias]
    })
  })
}

export function getInterfaceIdData(interfaceId) {
  const state = getCobrowsingState()

  if(!state.unlockedInterfaceIds) console.error(interfaceId, 'no unlocked again')
  const unlockedInterfaceIds = state.unlockedInterfaceIds || {}
  const idAliases = getInterfaceIdAliases(interfaceId)
  const me = state.auth.me
  
  const data = interfaceIdData[interfaceId]
  let isDefaultUnlocked = false
  let adminOnly = false
  let ignoreTools = false
  if(data) {
    isDefaultUnlocked = data.isDefaultUnlocked
    adminOnly = data.adminOnly
    ignoreTools = data.ignoreTools
  }

  const isToolOpen = !!store.getState().cobrowsing.selectedTool

  const isUnlocked = isDefaultUnlocked || areIdAliasesUnlocked(idAliases, unlockedInterfaceIds)
  const isObscured = !isToolOpen && isObscuringInterfaces() && !isUnlocked

  const isSubscribedCobrowsing = state.cobrowsing.isSubscribedCobrowsing
  const isToolInteractable = isSubscribedCobrowsing && isToolOpen && !ignoreTools

  return {
    isUnlocked,
    idAliases,
    isObscured,
    isToolInteractable,
    adminOnly,
  }
}

export function isObscuringInterfaces(interfaceId) {
  const state = getCobrowsingState()
  const isSubscribedCobrowsing = state.cobrowsing.isSubscribedCobrowsing
  const isActivelyCobrowsing = state.cobrowsing.isActivelyCobrowsing
  const me = state.auth.me
  
  if(isSubscribedCobrowsing) {
    if(isActivelyCobrowsing) return true
    else return false
  }

  if(me?.roles[GAME_EDITOR_EXPERT_ROLE]) return false
  
  return true
}