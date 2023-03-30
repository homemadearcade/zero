export const GOOGLE_AUTH_LINK = 'https://homemadearcade.herokuapp.com/auth/google';

export const DEFAULT_THEME_COLOR = '#90CAF9';

export const ADMIN_ROLE = 'ADMIN'
export const ON_MY_VIDEO_QUALITY_STATUS_UPDATE = 'ON_MY_VIDEO_QUALITY_STATUS_UPDATE'
export const ARCADE_EXPERIENCE_MODEL_ID = 'homemadeArcade'

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

export const GAME_MODEL_ID_PREFIX = 'gm-';
export const LOBBY_INSTANCE_ID_PREFIX = 'li-';
export const EXPERIENCE_MODEL_ID_PREFIX = 'em-';
export const USER_ID_PREFIX = 'u-';
export const DALLE_SESSION_ID_PREFIX = 'dallE-';
export const TICKETED_EVENT_ID_PREFIX = 'te-';
export const TICKET_PURCHASE_ID_PREFIX = 'tp-';
export const INTERFACE_PRESET_ID_PREFIX = 'ip-';
export const GAME_ROOM_INSTANCE_ID_PREFIX = 'gri-';

const isLocalHost = window.location.host.indexOf('localhost') !== -1;
export const ARCHIVE_USER_MONGO_ID = isLocalHost ? '62143b5618ac51461e5ecf6b' : '61cf70be02f76000536708ee'
export const CORE_LIBRARY_USER_MONGO_ID = isLocalHost ? '62143b5618ac51461e5ecf6b' : '61cf70be02f76000536708ee'

export * from './experience'
export * from './library'