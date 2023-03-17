import { effectDisplayNames, EFFECT_CAMERA_SHAKE, EFFECT_CHANGE_GAME, EFFECT_CUTSCENE, EFFECT_DESTROY, EFFECT_GAME_OVER, EFFECT_IGNORE_GRAVITY, EFFECT_INVISIBLE, EFFECT_OPEN_OVERLAY, EFFECT_RECLASS, EFFECT_SPAWN, EFFECT_STICK_TO, EFFECT_SWITCH_STAGE, EFFECT_TELEPORT, EFFECT_WIN_GAME, SPAWN_ZONE_RANDOM_SELECT } from "./effect"
import { eventDisplayNames, eventPrefix } from "./event"


export const initialEffectRelation = {
  effectTagA: true,
  effectTagB: false,
  spawnZoneSelectorType: SPAWN_ZONE_RANDOM_SELECT,
  effectCooldown: null,
  effectDelay: null,
  remoteEffectedTagIds: [],
}

export const defaultRelationship = {
  event: null,
  effects: {},
  relationId: '',
}

// export const effectIgnoreEvent = {
//   // Movement
//   [EFFECT_TELEPORT]: {

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
  [EFFECT_IGNORE_GRAVITY]: 'ClassA',
  [EFFECT_STICK_TO]: 'ClassA',

  // Lifecycle
  [EFFECT_RECLASS]: 'ClassA',
  [EFFECT_SPAWN]: null,//'spawnClassId',
  [EFFECT_DESTROY]: 'ClassA',

  // Narrative
  [EFFECT_CUTSCENE]: null,
  [EFFECT_GAME_OVER]: null,
  [EFFECT_WIN_GAME]: null,

  // Graphical
  [EFFECT_CAMERA_SHAKE]: null,
  [EFFECT_INVISIBLE]: 'ClassA',

  [EFFECT_SWITCH_STAGE]: null,
  [EFFECT_CHANGE_GAME]: null,
  [EFFECT_OPEN_OVERLAY]: null
}

function getEffectSuffix(effect, classA, classB) {
  if(effectSuffixes[effect] === 'Class A And Class B' && classB && classA) {
    return classA.name + ' and ' + classB.name + ' '
  } else if(effectSuffixes[effect] === 'ClassA' && classA) {
    return classA.name + ' '
  }
  
  // if(effectSuffixes[effect]) {
  //   if(effect.spawnClassId) {
  //     const classSpawn = store.getState().gameModel.gameModel.classes[effect.spawnClassId]
  //     return classSpawn.name
  //   }
  // }

  return ''
}

export function getEffectLabel(effect, classA, classB) {
  return effectDisplayNames[effect] + ' ' + getEffectSuffix(effect, classA, classB)
}

// export function getCompletedEffectLabel(effect, classA, classB) {
//   return effectDisplayNames[effect.type] + ' ' + getEffectSuffix(effect, classA, classB)
// }


/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
//// EVENT

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

function getEventPreviewPrefix(event, classA, classB) {  
  if(eventPrefix[event] === 'Class A And Class B' && classB && classA) {
    return ''
  } else if(eventPrefix[event] === 'ClassA' && classA) {
    return classA.name + ' is'
  } else if(eventPrefix[event] === 'ClassB' && classB) {
    return ''
  } else if(eventPrefix[event] === 'All ClassBs' && classB) {
    return 'are all '
  }
  return ''
}

export function getEventPreviewLabel(event, classA, classB) {
  return 'when ' + getEventPreviewPrefix(event, classA, classB) + ' ' + eventDisplayNames[event]
}

export function getEventLabel(event, classA, classB) {
  return 'when ' + getEventPrefix(event, classA, classB) + ' ' + eventDisplayNames[event]
}