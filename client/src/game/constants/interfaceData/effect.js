import store from "../../../store"
import { EFFECT_CAMERA_SHAKE, EFFECT_CHANGE_GAME, EFFECT_CUTSCENE, EFFECT_DESTROY, EFFECT_GAME_OVER, EFFECT_IGNORE_GRAVITY, EFFECT_INVISIBLE, EFFECT_OPEN_OVERLAY, EFFECT_SPAWN, EFFECT_STICK_TO, EFFECT_SWITCH_STAGE, EFFECT_TELEPORT, EFFECT_TRANSFORM, EFFECT_WIN_GAME, NO_RELATION_TAG_EFFECT, ON_TOUCH_ACTIVE, SINGLE_RELATION_TAG_EFFECT, SPAWN_ZONE_A_SELECT, SPAWN_ZONE_B_SELECT, SPAWN_ZONE_RANDOM_SELECT, TWO_RELATION_TAG_EFFECT } from "../core";

export const spawnZoneSelectorTypeToDisplayName = {
  [SPAWN_ZONE_A_SELECT]: 'Spawn in Tag A Instance',
  [SPAWN_ZONE_B_SELECT]: 'Spawn in Tag B Instance',
  [SPAWN_ZONE_RANDOM_SELECT]: 'Spawn in Random Instance of Zone',
}

export const effectBehaviorToDisplayNames = {
  // Movement
  [EFFECT_TELEPORT]: 'Teleport',
  [EFFECT_IGNORE_GRAVITY]: 'Remove gravity',
  [EFFECT_STICK_TO]: 'Hold',

  // Lifecycle
  [EFFECT_TRANSFORM]: 'Transform',
  [EFFECT_SPAWN]: 'Spawn',
  [EFFECT_DESTROY]: 'Destroy',

  // Narrative
  [EFFECT_CUTSCENE]: 'Play Dialog/Cutscene',
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
export const effectBehaviorInterfaces = {
  // Movement
  [EFFECT_TELEPORT]: {
    zoneEntityClassId: 'Teleport to which zone?',
    effectableType: TWO_RELATION_TAG_EFFECT,
  },
  [EFFECT_IGNORE_GRAVITY]: {
    effectableType: TWO_RELATION_TAG_EFFECT,
    isStandalone: true
  },
  [EFFECT_STICK_TO]: {
    effectableType: SINGLE_RELATION_TAG_EFFECT,
    isStandalone: true
  },

  // Lifecycle
  [EFFECT_TRANSFORM]: {
    entityClassId: 'Transform into which object?',
    effectableType: TWO_RELATION_TAG_EFFECT,
  },
  [EFFECT_SPAWN]: {
    zoneEntityClassId: 'Spawn in which Zone?',
    effectCooldown: true,
    spawnEntityClassId: 'Which Class will be spawned?',
    spawnZoneSelectorType: true,  
    effectableType: NO_RELATION_TAG_EFFECT,
    isCustomizeable: true,
  },
  [EFFECT_DESTROY]: {
    effectableType: TWO_RELATION_TAG_EFFECT,
    isStandalone: true
  },

  // Narrative
  [EFFECT_CUTSCENE]: {
    cutsceneId: 'Which cutscene?',
    effectableType: NO_RELATION_TAG_EFFECT
  },
  [EFFECT_GAME_OVER]: {
    text: 'Message',
    effectableType: NO_RELATION_TAG_EFFECT,
    isCustomizeable: true
  },
  [EFFECT_WIN_GAME]: {
    text: 'Message',
    effectableType: NO_RELATION_TAG_EFFECT,
    isCustomizeable: true
  },

  // Graphical
  [EFFECT_CAMERA_SHAKE]: {
    // number: 'How intense is the camera shake?',
    // effectCooldown: true,
    effectableType: NO_RELATION_TAG_EFFECT,
    isStandalone: true
  },
  [EFFECT_INVISIBLE]: {
    effectableType: TWO_RELATION_TAG_EFFECT,
    isStandalone: true
  },

  // Meta
  [EFFECT_SWITCH_STAGE]: {
    stageId: 'Which stage?',
    // zoneEntityClassId: 'Spawn in which Zone?',
    // entityClassId: 'Transform into which object? (Optional)',
    effectableType: NO_RELATION_TAG_EFFECT,
    isCustomizeable: true
  },
  [EFFECT_CHANGE_GAME]: {
    arcadeGameMongoId: 'Which game?',
    effectableType: NO_RELATION_TAG_EFFECT,
    isCustomizeable: true
  },
  [EFFECT_OPEN_OVERLAY]: {
    effectableType: NO_RELATION_TAG_EFFECT,
    isStandalone: true
  },
}

// EFFECT_CAMERA_SHAKE, EFFECT_WIN_GAME, EFFECT_GAME_OVER, EFFECT_DESTROY, EFFECT_DESTROY, EFFECT_TRANSFORM, EFFECT_SPAWN, EFFECT_CUTSCENE
export const persistentEffects  = {
  // Movement
  [EFFECT_TELEPORT]: false,
  [EFFECT_IGNORE_GRAVITY]: true,
  [EFFECT_STICK_TO]: true,

  // Lifecycle
  [EFFECT_TRANSFORM]: false,
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
  [EFFECT_IGNORE_GRAVITY]: false,
  [EFFECT_STICK_TO]: true,

  // Lifecycle
  [EFFECT_TRANSFORM]: false,
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

export function isUseableEffect(effectBehavior, eventType) {
  if(eventType !== ON_TOUCH_ACTIVE && persistentEffects[effectBehavior]) return false
  if(!persistentEffects[effectBehavior] && (eventType === ON_TOUCH_ACTIVE)) return false
  return true
}

export function getEffectShorthand(effect) {
  const effectBehavior = effect.effectBehavior 
  const displayName = effectBehaviorToDisplayNames[effectBehavior]
  const gameModel = store.getState().gameModel.gameModel
  const entityClasses = gameModel.entityClasses 
  const cutscenes = gameModel.cutscenes 
  const relationTags = gameModel.relationTags 

  if(effectBehavior === EFFECT_TELEPORT) {
    return displayName + ` to  ${entityClasses[effect.zoneEntityClassId].name}` 
  }

  if(effectBehavior === EFFECT_TRANSFORM) {
    return displayName + ` into  ${entityClasses[effect.entityClassId].name}`
  }

  if(effectBehavior === EFFECT_SPAWN) {
    return displayName + ` ${entityClasses[effect.spawnEntityClassId].name}  into  ${entityClasses[effect.zoneEntityClassId].name}`
  }

  if(effectBehavior === EFFECT_CUTSCENE) {
    return displayName + `  ${cutscenes[effect.cutsceneId].name}`
  }

  if(effectBehavior === EFFECT_DESTROY) {
    if(effect.remoteEffectedRelationTagIds?.length) {
      const relationTagNames = effect.remoteEffectedRelationTagIds.map((relationTagId) => relationTags[relationTagId].name)
      return displayName + ` all ${relationTagNames}`
    }
  }

  return displayName
}