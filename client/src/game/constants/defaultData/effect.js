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

export const defaultEffect = {
  type: '',
  effectedType: null,
  remoteEffectedClassId: null,
  spawnClassId: null,
  classId: null,
  zoneClassId: null,
  cutsceneId: null,
  text: '',
  stageId: null,
  pickRandomZone: false,
  delayEffect: null,
  effectId: null,
}

export const effectDisplayNames = {
  // Movement
  [EFFECT_TELEPORT]: 'Teleport',
  [EFFECT_COLLIDE]: 'Collide',
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
    onlyOnce: true,
    delayEffect: true
  },
  [EFFECT_COLLIDE]: {

  },
  [EFFECT_IGNORE_GRAVITY]: {

  },
  [EFFECT_STICK_TO]: {

  },

  // Lifecycle
  [EFFECT_RECLASS]: {
    classId: 'Transform into which object?',
    onlyOnce: true,
    delayEffect: true
  },
  [EFFECT_SPAWN]: {
    zoneClassId: 'Spawn in which Zone?',
    onlyOnce: true,
    delayInterval: true,
    pickRandomZone: true,
    // delayEffect: true
    
  },
  [EFFECT_DESTROY]: {
    delayEffect: true
  },

  // Narrative
  [EFFECT_CUTSCENE]: {
    cutsceneId: 'Which cutscene?',
    onlyOnce: true,
    delayEffect: true
  },
  [EFFECT_GAME_OVER]: {
    text: 'Message',
    delayEffect: true
  },
  [EFFECT_WIN_GAME]: {
    text: 'Message',
    delayEffect: true
  },

  // Graphical
  [EFFECT_CAMERA_SHAKE]: {
    // number: 'How intense is the camera shake?',
    onlyOnce: true,
    // delayInterval: true
  },
  [EFFECT_INVISIBLE]: {},



  // Meta
  [EFFECT_SWITCH_STAGE]: {
    stageId: 'Which stage?',
    delayEffect: true
  },
  [EFFECT_CHANGE_GAME]: {
    gameId: 'Which game?',
    delayEffect: true
  },
  [EFFECT_OPEN_OVERLAY]: {
    delayEffect: true
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