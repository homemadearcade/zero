export const GOOGLE_AUTH_LINK = 'https://homemadearcade.herokuapp.com/auth/google';

export const DEFAULT_THEME_COLOR = '#90CAF9';

export const ADMIN_ROLE = 'ADMIN'
export const ON_MY_VIDEO_QUALITY_STATUS_UPDATE = 'ON_MY_VIDEO_QUALITY_STATUS_UPDATE'
export const ARCADE_EXPERIENCE_ID = 'homemadeArcade'

export const GAME_EDITOR_ACTIVITY = 'GAME_EDITOR_ACTIVITY'
export const WAITING_ACTIVITY = 'WAITING_ACTIVITY'
export const MONOLOGUE_ACTIVITY = 'MONOLOGUE_ACTIVITY'
export const CONVERSATION_ACTIVITY = 'CONVERSATION_ACTIVITY'
export const CHATROOM_ACTIVITY = 'CHATROOM_ACTIVITY'
export const CREDITS_ACTIVITY = 'CREDITS_ACTIVITY'
export const SERVICE_ACTIVITY = 'SERVICE_ACTIVITY'

export const activityKeyToDisplayName = {
  [CHATROOM_ACTIVITY]: 'Chat Room',
  [WAITING_ACTIVITY]: 'Waiting to start',
  [MONOLOGUE_ACTIVITY]: 'Monologue',
  [GAME_EDITOR_ACTIVITY]: 'Game',
  [CREDITS_ACTIVITY]: 'Credits',
}

export const PHASER_ERROR = 'PHASER_ERROR'
export const GAME_ROOM_CONNECTION_LOST = 'GAME_ROOM_CONNECTION_LOST'
export const COBROWSING_CONNECTION_LOST = 'COBROWSING_CONNECTION_LOST'
export const CODRAWING_CONNECTION_LOST = 'CODRAWING_CONNECTION_LOST'

export const SOCKET_CONNECTION_LOST = 'SOCKET_CONNECTION_LOST'
export const INTERNET_SPEED_TEST_FAIL = 'INTERNET_SPEED_TEST_FAIL'

export const LOBBY_USER_PRESENT_DELTA = 15000

export const noCobrowsingUpdateDelta = 15000

// COBROWSING TOOLS
export const UNLOCK_TOOL = 'UNLOCK_TOOL'
export const OPEN_TOOL = 'OPEN_TOOL'

export const IMAGE_TYPE_SNAPSHOT = 'IMAGE_TYPE_SNAPSHOT'
export const IMAGE_TYPE_LAYER = 'IMAGE_TYPE_LAYER'
export const IMAGE_TYPE_CANVAS = 'IMAGE_TYPE_CANVAS'
export const IMAGE_TYPE_SPRITE = 'IMAGE_TYPE_SPRITE'

export * from './experience'