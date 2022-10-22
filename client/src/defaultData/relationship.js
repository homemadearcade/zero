import { EFFECTED_CLASS_ID, EFFECTED_INSTANCE_A, EFFECT_CAMERA_SHAKE, EFFECT_COLLIDE, EFFECT_CUTSCENE, EFFECT_DESTROY, EFFECT_GAME_OVER, EFFECT_IGNORE_GRAVITY, EFFECT_INVISIBLE, EFFECT_RECLASS, EFFECT_SPAWN, EFFECT_STICK_TO, EFFECT_TELEPORT, EFFECT_WIN_GAME, ON_COLLIDE, ON_DESTROY_ALL, ON_DESTROY_ONE, ON_INTERACT, ON_SPAWN } from "../constants"

export const defaultRelationship = {
  event: {
    type: '',
    classIdA: null,
    classIdB: null,
  },
  effect: {
    effectedType: null,
    effectedClassId: null,
    type: '',
    classId: null,
    zoneClassId: null,
    cutsceneId: null,
    text: ''
  },
  relationId: null,
  sides: {},
}

export const effectedTypesDisplayNames = {
  // [EFFECTED_INSTANCE_A]: 'This',
  // [EFFECTED_INSTANCE_B]: 'That',
  // [EFFECTED_CLASS_ID]: 'All objects named'
  // [EFFECTED_INSTANCE_ID]: 'Instance with Id'
}


export const eventDisplayNames = {
  [ON_COLLIDE]: 'overlap',
  //  [ON_COLLIDE_START]: 'ON_COLLIDE_START',
  //  [ON_COLLIDE_END]: 'ON_COLLIDE_END',
  //  [ON_COLLIDE_ACTIVE]: 'ON_COLLIDE_ACTIVE',
  // [ON_SPAWN]: 'spawned',
  [ON_DESTROY_ONE]: 'destroyed',
  [ON_DESTROY_ALL]: 'destroyed',
  [ON_INTERACT]: 'interacted with',

  // [ON_CUTSCENE_END]: 'Cutscene Ends'
}

export const effectDisplayNames = {
  // Movement
  [EFFECT_TELEPORT]: 'Teleport',
  [EFFECT_COLLIDE]: 'Collide',
  [EFFECT_IGNORE_GRAVITY]: 'Remove gravity from',
  [EFFECT_STICK_TO]: 'Hold',

  // Lifecycle
  [EFFECT_RECLASS]: 'Transform',
  // [EFFECT_SPAWN]: 'Spawn',
  [EFFECT_DESTROY]: 'Destroy',

  // Narrative
  [EFFECT_CUTSCENE]: 'Cutscene',
  [EFFECT_GAME_OVER]: 'Game Over',
  [EFFECT_WIN_GAME]: 'Win Game',

  // Graphical
  [EFFECT_CAMERA_SHAKE]: 'Shake Camera',
  [EFFECT_INVISIBLE]: 'Hide',
}

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
//// EFFECT
export const effectEditInterface = {
  // Movement
  [EFFECT_TELEPORT]: {
    zoneClassId: 'Teleport to what zone?'
  },
  [EFFECT_COLLIDE]: {

  },
  [EFFECT_IGNORE_GRAVITY]: {

  },
  [EFFECT_STICK_TO]: {

  },

  // Lifecycle
  [EFFECT_RECLASS]: {
    classId: 'Transform into what object?'
  },
  [EFFECT_SPAWN]: {
    zoneClassId: 'What zone does it spawn?'
  },
  [EFFECT_DESTROY]: {},

  // Narrative
  [EFFECT_CUTSCENE]: {
    cutsceneId: 'Which cutscene?'
  },
  [EFFECT_GAME_OVER]: {
    text: 'Message'
  },
  [EFFECT_WIN_GAME]: {
    text: 'Message'
  },

  // Graphical
  [EFFECT_CAMERA_SHAKE]: {
    // number: 'How intense is the camera shake?'
  },
  [EFFECT_INVISIBLE]: {}
}


export const collideOnlyEffects  = {
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
  [EFFECT_INVISIBLE]: true
}

export const nonRemoteEffects  = {
  // Movement
  [EFFECT_TELEPORT]: false,
  [EFFECT_COLLIDE]: true,
  [EFFECT_IGNORE_GRAVITY]: false,
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
  [EFFECT_INVISIBLE]: false
}


// export const effectIgnoreEvent = {
//   // Movement
//   [EFFECT_TELEPORT]: {

//   },
//   [EFFECT_COLLIDE]: {
//     [ON_SPAWN]: true,
//     [ON_DESTROY_ONE]: true,
//     [ON_INTERACT]: true
//   },
//   [EFFECT_IGNORE_GRAVITY]: {
//     [ON_SPAWN]: true,
//     [ON_DESTROY_ONE]: true,
//     [ON_INTERACT]: true
//   },
//   [EFFECT_STICK_TO]: {
//     [ON_SPAWN]: true,
//     [ON_DESTROY_ONE]: true,
//     [ON_INTERACT]: true
//   },

//   // Lifecycle
//   [EFFECT_RECLASS]: {},
//   [EFFECT_SPAWN]: {},
//   [EFFECT_DESTROY]: {},

//   // Narrative
//   [EFFECT_CUTSCENE]: {},
//   [EFFECT_GAME_OVER]: {
//     // [ON_SPAWN]: true,
//   },
//   [EFFECT_WIN_GAME]: {
//     // [ON_SPAWN]: true,
//   },

//   // Graphical
//   [EFFECT_CAMERA_SHAKE]: {
//   },
//   [EFFECT_INVISIBLE]: {
//     [ON_SPAWN]: true,
//     [ON_DESTROY_ONE]: true,
//     [ON_INTERACT]: true
//   }
// }

export const effectSuffixes = {
  // Movement
  [EFFECT_TELEPORT]: 'ClassA',
  [EFFECT_COLLIDE]: 'Class A And Class B',
  [EFFECT_IGNORE_GRAVITY]: 'ClassA',
  [EFFECT_STICK_TO]: 'ClassA',

  // Lifecycle
  [EFFECT_RECLASS]: 'ClassA',
  [EFFECT_SPAWN]: 'ClassA',
  [EFFECT_DESTROY]: 'ClassA',

  // Narrative
  [EFFECT_CUTSCENE]: null,
  [EFFECT_GAME_OVER]: null,
  [EFFECT_WIN_GAME]: null,

  // Graphical
  [EFFECT_CAMERA_SHAKE]: null,
  [EFFECT_INVISIBLE]: 'ClassA',
}

function getEffectSuffix(effect, classA, classB) {
  if(effectSuffixes[effect] === 'Class A And Class B' && classB && classA) {
    return classA.name + ' and ' + classB.name + ' '
  } else if(effectSuffixes[effect] === 'ClassA' && classA) {
    return classA.name + ' '
  }

  return ''
}

export function getEffectLabel(effect, classA, classB) {
  return effectDisplayNames[effect] + ' ' + getEffectSuffix(effect, classA, classB)
}

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
//// EVENT
export const singleClassEvents = {
  [ON_COLLIDE]: false,
  //  [ON_COLLIDE_START]: 'ON_COLLIDE_START',
  //  [ON_COLLIDE_END]: 'ON_COLLIDE_END',
  //  [ON_COLLIDE_ACTIVE]: 'ON_COLLIDE_ACTIVE',
  [ON_SPAWN]: true,
  [ON_DESTROY_ONE]: true,
  [ON_DESTROY_ALL]: true,
  [ON_INTERACT]: false,
}

export const eventPrefix = {
  [ON_COLLIDE]: 'Class A And Class B',
  //  [ON_COLLIDE_START]: 'ON_COLLIDE_START',
  //  [ON_COLLIDE_END]: 'ON_COLLIDE_END',
  //  [ON_COLLIDE_ACTIVE]: 'ON_COLLIDE_ACTIVE',
  [ON_SPAWN]: 'ClassB',
  [ON_DESTROY_ONE]: 'ClassB',
  [ON_DESTROY_ALL]: 'All ClassBs',
  [ON_INTERACT]: 'ClassB',

  // [ON_CUTSCENE_END]: 'Cutscene Ends'
}

function getEventPrefix(event, classA, classB) {  
  if(eventPrefix[event] === 'Class A And Class B' && classB && classA) {
    return classA.name + ' and ' + classB.name
  } else if(eventPrefix[event] === 'ClassA' && classA) {
    return classA.name + ' is'
  } else if(eventPrefix[event] === 'ClassB' && classB) {
    return classB.name + ' is'
  } else if(eventPrefix[event] === 'All ClassBs' && classB) {
    return classB.name + ' are all '
  }
  return ''
}

export function getEventLabel(event, classA, classB) {
  return 'when ' + getEventPrefix(event, classA, classB) + ' ' + eventDisplayNames[event]
}