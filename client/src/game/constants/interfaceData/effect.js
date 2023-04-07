import { NO_RELATION_TAG_EFFECT_IID, SINGLE_RELATION_TAG_EFFECT_IID, TWO_RELATION_TAG_EFFECT_IID } from "../../../constants/interfaceIds";
import store from "../../../store"
import { EFFECT_CAMERA_SHAKE, EFFECT_CUTSCENE, EFFECT_DESTROY,
    EFFECT_GAME_OVER, EFFECT_IGNORE_GRAVITY, EFFECT_INTERFACE_ACTION, EFFECT_INTERFACE_UNLOCK, EFFECT_INVISIBLE, EFFECT_PAUSE_GAME, EFFECT_SPAWN, 
  EFFECT_STICK_TO, EFFECT_SWITCH_STAGE, EFFECT_TELEPORT, EFFECT_TRANSFORM, EFFECT_UNPAUSE_GAME, EFFECT_WIN_GAME, ON_STEP_BEGINS, ON_TOUCH_ACTIVE,
 SPAWN_ZONE_A_SELECT, SPAWN_ZONE_B_SELECT, 
   SPAWN_ZONE_RANDOM_SELECT } from "../core";

export const spawnZoneSelectorTypeToDisplayName = {
  [SPAWN_ZONE_A_SELECT]: 'Spawn in Tag A Instance',
  [SPAWN_ZONE_B_SELECT]: 'Spawn in Tag B Instance',
  [SPAWN_ZONE_RANDOM_SELECT]: 'Spawn in Random Instance of Zone',
}

export const effectInterfaceDatas = {
  // Movement
  [EFFECT_TELEPORT]: {
    displayName: 'Teleport',
    // icon: 'faPersonToPortal',
    icon: 'faBullseye',
  },
  [EFFECT_IGNORE_GRAVITY]: {
    displayName: 'Remove gravity',
    icon: 'faUpLong'
  },
  [EFFECT_STICK_TO]: {
    displayName: 'Hold',
    icon: 'faLink'
  },

  // Lifecycle
  [EFFECT_TRANSFORM]: {
    displayName: 'Transform',
    icon: 'faRightLeft'
  },
  [EFFECT_SPAWN]: {
    displayName: 'Spawn',
    icon: 'faPlus'
  },
  [EFFECT_DESTROY]: {
    displayName: 'Destroy',
    icon: 'faSkullCrossbones'
  },

  // Game State
  [EFFECT_GAME_OVER]: {
    displayName: 'Game Over',
    icon: 'faAward'
  },
  [EFFECT_WIN_GAME]: {
    displayName: 'Win Game',
    icon: 'faAward'
  },

  // Graphical
  [EFFECT_CAMERA_SHAKE]: {
    displayName: 'Shake Camera',
    icon: 'faBurst'
  },
  [EFFECT_INVISIBLE]: {
   displayName: 'Hide',
   icon: 'faEyeSlash'
  },

  // Meta
  [EFFECT_SWITCH_STAGE]: {
    displayName: 'Switch Stage',
    icon: 'faShuffle'
  },
  [EFFECT_PAUSE_GAME]: {
    displayName: 'Pause Game',
    icon: 'faPause'
  },
  [EFFECT_UNPAUSE_GAME]: {
    displayName: 'Unpause Game',
    icon: 'faPlay'
  },


  // INTERFACE
  [EFFECT_INTERFACE_ACTION]: {
    displayName: 'Interface Action',
  },
  [EFFECT_CUTSCENE]: {
    displayName: 'Play Dialog/Cutscene',
    icon: 'faScript'
  },
  [EFFECT_INTERFACE_UNLOCK]: {
    // displayName: 'Unlock Interface',
    icon: 'faLockOpen'
  },
}

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
//// EFFECT
export const effectEditInterfaces = {
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

  // Game State
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
    isCustomizeable: false
  },
  [EFFECT_PAUSE_GAME]: {
    effectableType: NO_RELATION_TAG_EFFECT_IID,
    isStandalone: true
  },
  [EFFECT_UNPAUSE_GAME]: {
    effectableType: NO_RELATION_TAG_EFFECT_IID,
    isStandalone: true
  },

  // INTERFACE
  [EFFECT_INTERFACE_ACTION]: {
    // interfaceActionId: 'Which interface action?',
    effectableType: NO_RELATION_TAG_EFFECT_IID,
    // isCustomizeable: true
  },
  [EFFECT_CUTSCENE]: {
    cutsceneId: 'Which cutscene?',
    effectableType: NO_RELATION_TAG_EFFECT_IID
  },
  [EFFECT_INTERFACE_UNLOCK]: {
    interfaceId: 'Which interface?',
    effectableType: NO_RELATION_TAG_EFFECT_IID
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

  // Game State
  [EFFECT_GAME_OVER]: false,
  [EFFECT_WIN_GAME]: false,

  // Graphical
  [EFFECT_CAMERA_SHAKE]: false,
  [EFFECT_INVISIBLE]: true,

  // Meta
  [EFFECT_SWITCH_STAGE]: false,
  [EFFECT_PAUSE_GAME]: false,
  [EFFECT_UNPAUSE_GAME]: false,

  // Interface
  [EFFECT_CUTSCENE]: false,
  [EFFECT_INTERFACE_ACTION]: false,
  [EFFECT_INTERFACE_UNLOCK]: false,
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

  // Game State
  [EFFECT_GAME_OVER]: true,
  [EFFECT_WIN_GAME]: true,

  // Graphical
  [EFFECT_CAMERA_SHAKE]: true,
  [EFFECT_INVISIBLE]: false,

  // Meta
  [EFFECT_SWITCH_STAGE]: true,
  [EFFECT_PAUSE_GAME]: true,
  [EFFECT_UNPAUSE_GAME]: true,

  // Interface
  [EFFECT_CUTSCENE]: true,
  [EFFECT_INTERFACE_ACTION]: true,
  [EFFECT_INTERFACE_UNLOCK]: true,
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

  // Game State
  [EFFECT_GAME_OVER]: false,
  [EFFECT_WIN_GAME]: false,

  // Graphical
  [EFFECT_CAMERA_SHAKE]: false,
  [EFFECT_INVISIBLE]: true,

  // Meta
  [EFFECT_SWITCH_STAGE]: false,
  [EFFECT_PAUSE_GAME]: false,
  [EFFECT_UNPAUSE_GAME]: false,

  // Interface
  [EFFECT_CUTSCENE]: false,
  [EFFECT_INTERFACE_ACTION]: false,
  [EFFECT_INTERFACE_UNLOCK]: false,
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
  const displayName = effectInterfaceDatas[effectBehavior].displayName
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
