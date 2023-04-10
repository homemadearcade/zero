export const GOOGLE_AUTH_LINK = 'https://homemadearcade.herokuapp.com/auth/google';

export const DEFAULT_THEME_COLOR = '#90CAF9';

export const ADMIN_ROLE = 'ADMIN'
export const TECH_ADMIN_ROLE = 'TECH_ADMIN'

export const USER_ROLE = 'USER'
export const PRO_USER_ROLE = 'PRO_USER'
export const TECH_USER_ROLE = 'TECH_USER'

export const CREATOR_ROLE = 'CREATOR'
export const PRO_CREATOR_ROLE = 'PRO_CREATOR'


export const ON_MY_VIDEO_QUALITY_STATUS_UPDATE = 'ON_MY_VIDEO_QUALITY_STATUS_UPDATE'

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

export const GAME_MODEL_DID = 'gm-';
export const LOBBY_INSTANCE_DID = 'li-';
export const EXPERIENCE_MODEL_DID = 'em-';
export const USER_DID = 'u-';
export const DALLE_SESSION_DID = 'dallE-';
export const TICKETED_EVENT_DID = 'te-';
export const TICKET_PURCHASE_DID = 'tp-';
export const INTERFACE_PRESET_DID = 'ip-';
export const GAME_ROOM_INSTANCE_DID = 'gri-';

const isLocalHost = window.location.host.indexOf('localhost') !== -1;
export const ARCHIVE_USER_MONGO_ID = isLocalHost ? '62143b5618ac51461e5ecf6b' : '61cf70be02f76000536708ee'
export const LIBRARY_USER_MONGO_ID = isLocalHost ? '62143b5618ac51461e5ecf6b' : '61cf70be02f76000536708ee'

export * from './interfaceActions'
export * from './interface'
export * from './interfaceIdGroups'

export * from './experience'
export * from './mediaCreator'

