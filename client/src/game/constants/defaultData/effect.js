/////////////////////////////////////
/////////////////////////////////////
// EFFECTS
export const EFFECT_TELEPORT = 'EFFECT_TELEPORT'
export const EFFECT_FOLLOW_START = 'EFFECT_FOLLOW_START'
export const EFFECT_FOLLOW_END = 'EFFECT_FOLLOW_END'

export const EFFECT_COLLIDE = 'EFFECT_COLLIDE'
export const EFFECT_IGNORE_GRAVITY = 'EFFECT_IGNORE_GRAVITY'
export const EFFECT_STICK_TO = 'EFFECT_STICK_TO'

export const EFFECT_RECLASS = 'EFFECT_RECLASS'
export const EFFECT_SPAWN = 'EFFECT_SPAWN'
export const EFFECT_DESTROY = 'EFFECT_DESTROY'

export const EFFECT_CUTSCENE = 'EFFECT_CUTSCENE'
export const EFFECT_SWITCH_STAGE = 'EFFECT_SWITCH_STAGE'

export const EFFECT_CAMERA_SHAKE = 'EFFECT_CAMERA_SHAKE'
export const EFFECT_INVISIBLE = 'EFFECT_INVISIBLE'

export const EFFECT_GAME_OVER = 'EFFECT_GAME_OVER'
export const EFFECT_WIN_GAME = 'EFFECT_WIN_GAME'

export const EFFECT_OPEN_OVERLAY = 'EFFECT_OPEN_OVERLAY'
export const EFFECT_CHANGE_GAME = 'EFFECT_CHANGE_GAME'

export const NO_TAG_EFFECT = 'NO_TAG_EFFECT'
export const SINGLE_TAG_EFFECT = 'SINGLE_TAG_EFFECT'
export const TWO_TAG_EFFECT = 'TWO_TAG_EFFECT'

// WHAT HAPPENS
export const defaultEffect = {
  type: '',
  effectId: null,

  effectTagA: false,
  effectTagB: false,
  remoteEffectedTagId: null,

  spawnZoneSelectorType: false,

  stageId: null,
  spawnClassId: null,
  classId: null,
  gameId: null,
  zoneClassId: null,
  cutsceneId: null,
  text: '',
}

export const SPAWN_ZONE_A_SELECT = 'SPAWN_ZONE_A_SELECT';
export const SPAWN_ZONE_B_SELECT = 'SPAWN_ZONE_B_SELECT';
export const SPAWN_ZONE_RANDOM_SELECT = 'SPAWN_ZONE_RANDOM_SELECT';

export const spawnZoneSelectorTypeToDisplayName = {
  [SPAWN_ZONE_A_SELECT]: 'Spawn in Tag A Zone',
  [SPAWN_ZONE_B_SELECT]: 'Spawn in Tag B Zone',
  [SPAWN_ZONE_RANDOM_SELECT]: 'Spawn in Random Zone',
}

export const effectDisplayNames = {
  // Movement
  [EFFECT_TELEPORT]: 'Teleport',
  // [EFFECT_COLLIDE]: 'Collide',
  [EFFECT_IGNORE_GRAVITY]: 'Remove gravity from',
  [EFFECT_STICK_TO]: 'Hold',

  // Lifecycle
  [EFFECT_RECLASS]: 'Transform',
  [EFFECT_SPAWN]: 'Spawn',
  [EFFECT_DESTROY]: 'Destroy',

  // Narrative
  [EFFECT_CUTSCENE]: 'Dialog/Cutscene',
  [EFFECT_GAME_OVER]: 'Game Over',
  [EFFECT_WIN_GAME]: 'Win Game',

  // Graphical
  [EFFECT_CAMERA_SHAKE]: 'Shake Camera',
  [EFFECT_INVISIBLE]: 'Hide',

  // Meta
  [EFFECT_OPEN_OVERLAY]: 'Send to Stars',
  [EFFECT_CHANGE_GAME]: 'Change Game',
  [EFFECT_SWITCH_STAGE]: 'Switch Stage',
}

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
//// EFFECT
export const effectEditInterface = {
  // Movement
  [EFFECT_TELEPORT]: {
    zoneClassId: 'Teleport to which zone?',
    effectableType: TWO_TAG_EFFECT
  },
  [EFFECT_COLLIDE]: {

  },
  [EFFECT_IGNORE_GRAVITY]: {
    effectableType: TWO_TAG_EFFECT
  },
  [EFFECT_STICK_TO]: {
    effectableType: SINGLE_TAG_EFFECT
  },

  // Lifecycle
  [EFFECT_RECLASS]: {
    classId: 'Transform into which object?',
    effectableType: TWO_TAG_EFFECT
  },
  [EFFECT_SPAWN]: {
    zoneClassId: 'Spawn in which Zone?',
    delayInterval: true,
    spawnClassId: 'Which Class will be spawned?',
    spawnZoneSelectorType: true,  
    effectableType: NO_TAG_EFFECT
  },
  [EFFECT_DESTROY]: {
    effectableType: TWO_TAG_EFFECT
  },

  // Narrative
  [EFFECT_CUTSCENE]: {
    cutsceneId: 'Which cutscene?',
    effectableType: NO_TAG_EFFECT
  },
  [EFFECT_GAME_OVER]: {
    text: 'Message',
    effectableType: NO_TAG_EFFECT
  },
  [EFFECT_WIN_GAME]: {
    text: 'Message',
    effectableType: NO_TAG_EFFECT
  },

  // Graphical
  [EFFECT_CAMERA_SHAKE]: {
    // number: 'How intense is the camera shake?',
    // delayInterval: true
    effectableType: NO_TAG_EFFECT
  },
  [EFFECT_INVISIBLE]: {
    effectableType: TWO_TAG_EFFECT
  },

  // Meta
  [EFFECT_SWITCH_STAGE]: {
    stageId: 'Which stage?',
    // zoneClassId: 'Spawn in which Zone?',
    // classId: 'Transform into which object? (Optional)',
    effectableType: NO_TAG_EFFECT
  },
  [EFFECT_CHANGE_GAME]: {
    gameId: 'Which game?',
    effectableType: NO_TAG_EFFECT
  },
  [EFFECT_OPEN_OVERLAY]: {
    effectableType: NO_TAG_EFFECT
  },
}

// EFFECT_CAMERA_SHAKE, EFFECT_WIN_GAME, EFFECT_GAME_OVER, EFFECT_DESTROY, EFFECT_DESTROY, EFFECT_RECLASS, EFFECT_SPAWN, EFFECT_CUTSCENE
export const persistentEffects  = {
  // Movement
  [EFFECT_TELEPORT]: false,
  [EFFECT_COLLIDE]: true,
  [EFFECT_IGNORE_GRAVITY]: true,
  [EFFECT_STICK_TO]: true,

  // Lifecycle
  [EFFECT_RECLASS]: false,
  [EFFECT_SPAWN]: false,
  [EFFECT_DESTROY]: false,

  // Narrative
  [EFFECT_CUTSCENE]: false,
  [EFFECT_GAME_OVER]: false,
  [EFFECT_WIN_GAME]: false,

  // Graphical
  [EFFECT_CAMERA_SHAKE]: false,
  [EFFECT_INVISIBLE]: true,

  // Meta
  [EFFECT_SWITCH_STAGE]: false,
  [EFFECT_CHANGE_GAME]: false,
  [EFFECT_OPEN_OVERLAY]: false
}

export const nonRemoteEffects  = {
  // Movement
  [EFFECT_TELEPORT]: false,
  [EFFECT_COLLIDE]: true,
  [EFFECT_IGNORE_GRAVITY]: false,
  [EFFECT_STICK_TO]: true,

  // Lifecycle
  [EFFECT_RECLASS]: false,
  [EFFECT_SPAWN]: true,
  [EFFECT_DESTROY]: false,

  // Narrative
  [EFFECT_CUTSCENE]: true,
  [EFFECT_GAME_OVER]: true,
  [EFFECT_WIN_GAME]: true,

  // Graphical
  [EFFECT_CAMERA_SHAKE]: true,
  [EFFECT_INVISIBLE]: false,

  [EFFECT_SWITCH_STAGE]: true,
  [EFFECT_CHANGE_GAME]: true,
  [EFFECT_OPEN_OVERLAY]: true

}