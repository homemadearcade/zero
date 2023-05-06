import { interfaceIdData } from "../../../constants/interfaceIdData";
import { NO_RELATION_TAG_EFFECT_IID, SINGLE_RELATION_TAG_EFFECT_IID, TWO_RELATION_TAG_EFFECT_IID } from "../../../constants/interfaceIds";
import store from "../../../store"
import { EFFECT_CAMERA_SHAKE, EFFECT_CLOSE_TRANSITION, EFFECT_CUTSCENE, EFFECT_DESTROY,
    EFFECT_END_GAME, EFFECT_IGNORE_GRAVITY, EFFECT_INTERFACE_ACTION, EFFECT_INTERFACE_UNLOCK, EFFECT_INVISIBLE, EFFECT_OPEN_TRANSITION, EFFECT_PAUSE_GAME, EFFECT_SPAWN, 
  EFFECT_STICK_TO, EFFECT_SWITCH_STAGE, EFFECT_TELEPORT, EFFECT_TRANSFORM, EFFECT_TRANSFORM_TEMPORARY_END, EFFECT_TRANSFORM_TEMPORARY_START, EFFECT_UNPAUSE_GAME, ON_DESTROY_ALL, ON_DESTROY_ONE, ON_INTERACT, ON_STEP_BEGINS, ON_TOUCH_ACTIVE,
 ON_TOUCH_START,
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
    icon: 'faHandsHolding'
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
  [EFFECT_TRANSFORM_TEMPORARY_START]: {
    displayName: 'Transform Temporarily',
    icon: 'faRightLeft'
  },
  [EFFECT_TRANSFORM_TEMPORARY_END]: {
    displayName: 'End Temporary Transform',
    icon: 'faRightLeft'
  },

  // Game State
  [EFFECT_END_GAME]: {
    displayName: 'End Game',
    icon: 'faAward',
    customSelectorCategory: 'Game',
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
    icon: 'faPause',
    customSelectorCategory: 'Game',
  },
  [EFFECT_UNPAUSE_GAME]: {
    displayName: 'Unpause Game',
    icon: 'faPlay',
    customSelectorCategory: 'Game',
  },


  // INTERFACE
  [EFFECT_INTERFACE_ACTION]: {
    displayName: 'Interface Action',
  },
  [EFFECT_CUTSCENE]: {
    displayName: 'Play Dialog/Cutscene',
    icon: 'faScroll'
  },
  [EFFECT_INTERFACE_UNLOCK]: {
    displayName: 'Unlock Interface',
    icon: 'faLockOpen'
  },
  [EFFECT_OPEN_TRANSITION]: {
    displayName: 'Go to stars',
    icon: 'faStar',
    customSelectorCategory: 'Transition',
  },
  [EFFECT_CLOSE_TRANSITION]: {
    displayName: 'Return from stars',
    icon: 'faStar',
    customSelectorCategory: 'Transition',
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
    targetableType: TWO_RELATION_TAG_EFFECT_IID,
  },
  [EFFECT_IGNORE_GRAVITY]: {
    targetableType: TWO_RELATION_TAG_EFFECT_IID,
    autogenerateEffect: true,
    autogenerateRelationForEvents: [ON_TOUCH_ACTIVE]
  },
  [EFFECT_STICK_TO]: {
    targetableType: SINGLE_RELATION_TAG_EFFECT_IID,
    autogenerateEffect: true,
    autogenerateRelationForEvents: [ON_TOUCH_ACTIVE]
  },

  // Lifecycle
  [EFFECT_TRANSFORM]: {
    entityModelId: 'Transform into which object?',
    targetableType: TWO_RELATION_TAG_EFFECT_IID,
  },
  [EFFECT_TRANSFORM_TEMPORARY_START]: {
    entityModelId: 'Transform into which object?',
    targetableType: TWO_RELATION_TAG_EFFECT_IID,
    // autogenerateEffect: true,
    // autogenerateRelationForEvents: [ON_TOUCH_START, ON_INTERACT]
  },
  [EFFECT_TRANSFORM_TEMPORARY_END]: {
    targetableType: TWO_RELATION_TAG_EFFECT_IID,
    autogenerateEffect: true,
    autogenerateRelationForEvents: [ON_TOUCH_START, ON_INTERACT]
  },
  [EFFECT_SPAWN]: {
    zoneEntityModelId: 'Spawn in which Zone?',
    effectCooldown: true,
    spawnEntityModelId: 'Which Entity will be spawned?',
    spawnZoneSelectorType: true,  
    targetableType: NO_RELATION_TAG_EFFECT_IID,
    isCustomizeable: true,
  },
  [EFFECT_DESTROY]: {
    targetableType: TWO_RELATION_TAG_EFFECT_IID,
    autogenerateEffect: true,
    autogenerateRelationForEvents: [ON_TOUCH_START, ON_INTERACT]
  },

  // Game State
  [EFFECT_END_GAME]: {
    text: 'Message',
    targetableType: NO_RELATION_TAG_EFFECT_IID,
    isCustomizeable: true,
    autogenerateEffect: true,
    autogenerateRelationForEvents: [ON_TOUCH_START, ON_INTERACT, ON_DESTROY_ALL, ON_DESTROY_ONE]
  },

  // Graphical
  [EFFECT_CAMERA_SHAKE]: {
    // number: 'How intense is the camera shake?',
    // effectCooldown: true,
    targetableType: NO_RELATION_TAG_EFFECT_IID,
    autogenerateEffect: true
  },
  [EFFECT_INVISIBLE]: {
    targetableType: TWO_RELATION_TAG_EFFECT_IID,
    autogenerateEffect: true
  },

  // Meta
  [EFFECT_SWITCH_STAGE]: {
    stageId: 'Which stage?',
    // zoneEntityModelId: 'Spawn in which Zone?',
    // entityModelId: 'Transform into which object? (Optional)',
    targetableType: NO_RELATION_TAG_EFFECT_IID,
    isCustomizeable: false
  },
  [EFFECT_PAUSE_GAME]: {
    targetableType: NO_RELATION_TAG_EFFECT_IID,
    autogenerateEffect: true,
  },
  [EFFECT_UNPAUSE_GAME]: {
    targetableType: NO_RELATION_TAG_EFFECT_IID,
    autogenerateEffect: true,
  },

  // INTERFACE
  [EFFECT_INTERFACE_ACTION]: {
    // interfaceActionId: 'Which interface action?',
    targetableType: NO_RELATION_TAG_EFFECT_IID,
    // isCustomizeable: true
  },
  [EFFECT_CUTSCENE]: {
    cutsceneId: 'Which cutscene?',
    targetableType: NO_RELATION_TAG_EFFECT_IID
  },
  [EFFECT_INTERFACE_UNLOCK]: {
    interfaceId: 'Which interface?',
    targetableType: NO_RELATION_TAG_EFFECT_IID
  },
  [EFFECT_OPEN_TRANSITION]: {
    targetableType: NO_RELATION_TAG_EFFECT_IID,
    autogenerateEffect: true,
    autogenerateRelationForEvents: [ON_TOUCH_START, ON_INTERACT],
  },
  [EFFECT_CLOSE_TRANSITION]: {
    targetableType: NO_RELATION_TAG_EFFECT_IID,
    autogenerateEffect: true,
    autogenerateRelationForEvents: [ON_TOUCH_START, ON_INTERACT],
  },
}

// EFFECT_CAMERA_SHAKE,  EFFECT_END_GAME, EFFECT_DESTROY, EFFECT_DESTROY, EFFECT_TRANSFORM, EFFECT_SPAWN, EFFECT_CUTSCENE
export const touchActiveEffects  = {
  // Movement
  [EFFECT_TELEPORT]: false,
  [EFFECT_IGNORE_GRAVITY]: true,
  [EFFECT_STICK_TO]: true,
  

  // Lifecycle
  [EFFECT_TRANSFORM]: false,
  [EFFECT_SPAWN]: false,
  [EFFECT_DESTROY]: false,
  [EFFECT_TRANSFORM_TEMPORARY_START]: false,
  [EFFECT_TRANSFORM_TEMPORARY_END]: false,

  // Game State
  [EFFECT_END_GAME]: false,

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
  [EFFECT_OPEN_TRANSITION]: false,
  [EFFECT_CLOSE_TRANSITION]: false,
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
  [EFFECT_TRANSFORM_TEMPORARY_START]: false,
  [EFFECT_TRANSFORM_TEMPORARY_END]: false,

  // Game State
  [EFFECT_END_GAME]: true,

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
  [EFFECT_OPEN_TRANSITION]: true,
  [EFFECT_CLOSE_TRANSITION]: true,
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
  [EFFECT_TRANSFORM_TEMPORARY_START]: false,
  [EFFECT_TRANSFORM_TEMPORARY_END]: false,

  // Game State
  [EFFECT_END_GAME]: false,

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
  [EFFECT_OPEN_TRANSITION]: false,
  [EFFECT_CLOSE_TRANSITION]: false,
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

  if(effectBehavior === EFFECT_TRANSFORM_TEMPORARY_START) {
    return displayName + ` into  ${entityModels[effect.entityModelId].name} temporarily`
  }

  if(effectBehavior === EFFECT_TRANSFORM_TEMPORARY_END) {
    return displayName + ` for ${entityModels[effect.entityModelId].name}`
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

  if(effectBehavior === EFFECT_INTERFACE_UNLOCK) {
    return 'Unlock ' + interfaceIdData[effect.interfaceId].name
  }

  if(effectBehavior === EFFECT_SWITCH_STAGE) {
    return displayName + ` to  ${gameModel.stages[effect.stageId].name}`
  }

  return displayName
}
