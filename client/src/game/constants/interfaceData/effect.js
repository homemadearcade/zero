import { NO_RELATION_TAG_EFFECT_IID, SINGLE_RELATION_TAG_EFFECT_IID, TWO_RELATION_TAG_EFFECT_IID } from "../../../constants/interfaceIds";
import store from "../../../store"
import { EFFECT_CAMERA_SHAKE, EFFECT_CHANGE_GAME, EFFECT_CUTSCENE, EFFECT_DESTROY, EFFECT_GAME_OVER, EFFECT_IGNORE_GRAVITY, EFFECT_INVISIBLE, EFFECT_PAUSE_GAME, EFFECT_SPAWN, 
  EFFECT_STICK_TO, EFFECT_SWITCH_STAGE, EFFECT_TELEPORT, EFFECT_TRANSFORM, EFFECT_UNPAUSE_GAME, EFFECT_WIN_GAME, ON_STEP_BEGINS, ON_TOUCH_ACTIVE,
 SPAWN_ZONE_A_SELECT, SPAWN_ZONE_B_SELECT, 
   SPAWN_ZONE_RANDOM_SELECT } from "../core";

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
  [EFFECT_CHANGE_GAME]: 'Change Game',
  [EFFECT_SWITCH_STAGE]: 'Switch Stage',
  [EFFECT_PAUSE_GAME]: 'Pause Game',
  [EFFECT_UNPAUSE_GAME]: 'Unpause Game',
}

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
//// EFFECT
export const effectBehaviorInterfaces = {
  // Movement
  [EFFECT_TELEPORT]: {
    zoneEntityModelId: 'Teleport to which zone?',
    effectableType: TWO_RELATION_TAG_EFFECT_IID,
  },
  [EFFECT_IGNORE_GRAVITY]: {
    effectableType: TWO_RELATION_TAG_EFFECT_IID,
    isStandalone: true
  },
  [EFFECT_STICK_TO]: {
    effectableType: SINGLE_RELATION_TAG_EFFECT_IID,
    isStandalone: true
  },

  // Lifecycle
  [EFFECT_TRANSFORM]: {
    entityModelId: 'Transform into which object?',
    effectableType: TWO_RELATION_TAG_EFFECT_IID,
  },
  [EFFECT_SPAWN]: {
    zoneEntityModelId: 'Spawn in which Zone?',
    effectCooldown: true,
    spawnEntityModelId: 'Which Entity will be spawned?',
    spawnZoneSelectorType: true,  
    effectableType: NO_RELATION_TAG_EFFECT_IID,
    isCustomizeable: true,
  },
  [EFFECT_DESTROY]: {
    effectableType: TWO_RELATION_TAG_EFFECT_IID,
    isStandalone: true
  },

  // Narrative
  [EFFECT_CUTSCENE]: {
    cutsceneId: 'Which cutscene?',
    effectableType: NO_RELATION_TAG_EFFECT_IID
  },
  [EFFECT_GAME_OVER]: {
    text: 'Message',
    effectableType: NO_RELATION_TAG_EFFECT_IID,
    isCustomizeable: true,
    isStandalone: true
  },
  [EFFECT_WIN_GAME]: {
    text: 'Message',
    effectableType: NO_RELATION_TAG_EFFECT_IID,
    isCustomizeable: true,
    isStandalone: true
  },

  // Graphical
  [EFFECT_CAMERA_SHAKE]: {
    // number: 'How intense is the camera shake?',
    // effectCooldown: true,
    effectableType: NO_RELATION_TAG_EFFECT_IID,
    isStandalone: true
  },
  [EFFECT_INVISIBLE]: {
    effectableType: TWO_RELATION_TAG_EFFECT_IID,
    isStandalone: true
  },

  // Meta
  [EFFECT_SWITCH_STAGE]: {
    stageId: 'Which stage?',
    // zoneEntityModelId: 'Spawn in which Zone?',
    // entityModelId: 'Transform into which object? (Optional)',
    effectableType: NO_RELATION_TAG_EFFECT_IID,
    isCustomizeable: true
  },
  [EFFECT_CHANGE_GAME]: {
    arcadeGameMongoId: 'Which game?',
    effectableType: NO_RELATION_TAG_EFFECT_IID,
    isCustomizeable: true
  },
  [EFFECT_PAUSE_GAME]: {
    effectableType: NO_RELATION_TAG_EFFECT_IID,
    isStandalone: true
  },
  [EFFECT_UNPAUSE_GAME]: {
    effectableType: NO_RELATION_TAG_EFFECT_IID,
    isStandalone: true
  },
}

// EFFECT_CAMERA_SHAKE, EFFECT_WIN_GAME, EFFECT_GAME_OVER, EFFECT_DESTROY, EFFECT_DESTROY, EFFECT_TRANSFORM, EFFECT_SPAWN, EFFECT_CUTSCENE
export const touchActiveEffects  = {
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
  [EFFECT_PAUSE_GAME]: false,
  [EFFECT_UNPAUSE_GAME]: false,
}

export const noRemoteEffectedTagEffects = {
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

  // Meta
  [EFFECT_SWITCH_STAGE]: true,
  [EFFECT_CHANGE_GAME]: true,
  [EFFECT_PAUSE_GAME]: true,
  [EFFECT_UNPAUSE_GAME]: true,
}

export const nonStepEffectBehaviors = {
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
  [EFFECT_PAUSE_GAME]: false,
  [EFFECT_UNPAUSE_GAME]: false,
}

export function isUseableEffect(effect, effectBehavior, eventType) {
  if(eventType === ON_STEP_BEGINS) {
    if((!effect.remoteEffectedRelationTagIds && !noRemoteEffectedTagEffects[effectBehavior]) || nonStepEffectBehaviors[effectBehavior]) {
      return false
    }
  } else {
    if(eventType !== ON_TOUCH_ACTIVE) {
      if(touchActiveEffects[effectBehavior]) return false
    }
    if(eventType === ON_TOUCH_ACTIVE) {
      if(!touchActiveEffects[effectBehavior]) return false
    }
  }
  return true
}

export function getEffectShorthand(effect) {
  const effectBehavior = effect.effectBehavior 
  const displayName = effectBehaviorToDisplayNames[effectBehavior]
  const gameModel = store.getState().gameModel.gameModel
  const entityModels = gameModel.entityModels 
  const cutscenes = gameModel.cutscenes 
  const relationTags = gameModel.relationTags 

  if(effectBehavior === EFFECT_TELEPORT) {
    return displayName + ` to  ${entityModels[effect.zoneEntityModelId].name}` 
  }

  if(effectBehavior === EFFECT_TRANSFORM) {
    return displayName + ` into  ${entityModels[effect.entityModelId].name}`
  }

  if(effectBehavior === EFFECT_SPAWN) {
    return displayName + ` ${entityModels[effect.spawnEntityModelId].name}  onto  ${entityModels[effect.zoneEntityModelId].name}`
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

  if(effectBehavior === EFFECT_SWITCH_STAGE) {
    return displayName + ` to  ${gameModel.stages[effect.stageId].name}`
  }

  return displayName
}
