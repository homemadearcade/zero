import { EFFECT_CAMERA_SHAKE, EFFECT_COLLIDE, EFFECT_CUTSCENE, EFFECT_DESTROY, EFFECT_GAME_OVER, EFFECT_IGNORE_GRAVITY, EFFECT_INVISIBLE, EFFECT_RECLASS, EFFECT_SPAWN, EFFECT_STICK_TO, EFFECT_TELEPORT, EFFECT_WIN_GAME, ON_COLLIDE, ON_COLLIDE_ACTIVE, ON_COLLIDE_END, ON_COLLIDE_START, ON_CUTSCENE_END, ON_DESTROY, ON_INTERACT, ON_SPAWN } from "../constants"

export const defaultRelationship = {
  classId: null,
  cutsceneId: null,
  event: '', 
  effect: {
    type: '',
    classId: null,
    cutsceneId: null,
  },
  relationId: null,
  sides: [],
}

export const effectDisplayNames = {
  // Movement
  [EFFECT_TELEPORT]: 'Teleport',
  [EFFECT_COLLIDE]: 'Collide',
  [EFFECT_IGNORE_GRAVITY]: 'Zero Gravity',
  [EFFECT_STICK_TO]: 'Stick To',

  // Lifecycle
  [EFFECT_RECLASS]: 'Transform',
  [EFFECT_SPAWN]: 'Spawn',
  [EFFECT_DESTROY]: 'Destroy',

  // Narrative
  [EFFECT_CUTSCENE]: 'Cutscene',
  [EFFECT_GAME_OVER]: 'Game Over',
  [EFFECT_WIN_GAME]: 'Win Game',

  // Graphical
  [EFFECT_CAMERA_SHAKE]: 'Shake Camera',
  [EFFECT_INVISIBLE]: 'Hide',
}

export const effectSuffix = {
  // Movement
  [EFFECT_TELEPORT]: 'Class',
  [EFFECT_COLLIDE]: 'Both',
  [EFFECT_IGNORE_GRAVITY]: 'Class',
  [EFFECT_STICK_TO]: 'Class',

  // Lifecycle
  [EFFECT_RECLASS]: 'Class',
  [EFFECT_SPAWN]: 'Class',
  [EFFECT_DESTROY]: 'Class',

  // Narrative
  [EFFECT_CUTSCENE]: null,
  [EFFECT_GAME_OVER]: null,
  [EFFECT_WIN_GAME]: null,

  // Graphical
  [EFFECT_CAMERA_SHAKE]: null,
  [EFFECT_INVISIBLE]: 'Class',
}

export const eventPrefix = {
  [ON_COLLIDE]: 'Both',
  //  [ON_COLLIDE_START]: 'ON_COLLIDE_START',
  //  [ON_COLLIDE_END]: 'ON_COLLIDE_END',
  //  [ON_COLLIDE_ACTIVE]: 'ON_COLLIDE_ACTIVE',
  [ON_SPAWN]: 'Agent',
  [ON_DESTROY]: 'Agent',
  [ON_INTERACT]: 'Agent',

  // [ON_CUTSCENE_END]: 'Cutscene Ends'
}

export const eventDisplayNames = {
  [ON_COLLIDE]: 'overlap',
  //  [ON_COLLIDE_START]: 'ON_COLLIDE_START',
  //  [ON_COLLIDE_END]: 'ON_COLLIDE_END',
  //  [ON_COLLIDE_ACTIVE]: 'ON_COLLIDE_ACTIVE',
  [ON_SPAWN]: 'spawned',
  [ON_DESTROY]: 'destroyed',
  [ON_INTERACT]: 'interacted with',

  // [ON_CUTSCENE_END]: 'Cutscene Ends'
}