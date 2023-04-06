export const LOBBY_DID = 'lobby-'

export const LOBBY_VISIBILITY_PUBLIC = 'LOBBY_VISIBILITY_PUBLIC'
export const LOBBY_VISIBILITY_INVITE_ONLY = 'LOBBY_VISIBILITY_INVITE_ONLY'
export const LOBBY_VISIBILITY_UNLISTED = 'LOBBY_VISIBILITY_UNLISTED'

export const defaultLobby = {
  name: null,
  visibility: LOBBY_VISIBILITY_INVITE_ONLY,
  activitys: {},
  initialActivityId: null,
  instructionsByRoleId: {},
  isRemoved: false
}