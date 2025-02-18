import { interfaceIdData } from "../../../constants/interfaceIdData";
import { NO_RELATION_TAG_EFFECT_IID, SINGLE_RELATION_TAG_EFFECT_IID, TWO_RELATION_TAG_EFFECT_IID } from "../../../constants/interfaceIds";
import store from "../../../store"
import { EFFECT_CAMERA_SHAKE, EFFECT_ALLOW_CLIMB, EFFECT_CLOSE_TRANSITION, EFFECT_CUTSCENE, EFFECT_DESTROY,
    EFFECT_END_GAME, EFFECT_GRAVITY_PULL, EFFECT_GRAVITY_PUSH, EFFECT_IGNORE_GRAVITY, EFFECT_INTERFACE_ACTION, EFFECT_INTERFACE_UNLOCK, EFFECT_INVISIBLE, EFFECT_OPEN_TRANSITION, EFFECT_PAUSE_GAME, EFFECT_SPAWN, 
  EFFECT_STICK_TO, EFFECT_SWITCH_STAGE, EFFECT_TELEPORT, EFFECT_TRANSFORM, EFFECT_TRANSFORM_TEMPORARY_END, EFFECT_TRANSFORM_TEMPORARY_START, EFFECT_UNPAUSE_GAME, ON_DESTROY_ALL, ON_DESTROY_ONE, ON_INTERACT, ON_STEP_BEGINS, ON_TOUCH_ACTIVE,
 ON_TOUCH_START,
 SPAWN_ZONE_A_SELECT, SPAWN_ZONE_B_SELECT, 
   SPAWN_ZONE_RANDOM_SELECT } from "../core";

export const spawnZoneSelectorTypeToDisplayName = {
  [SPAWN_ZONE_A_SELECT]: 'Spawn in Tag A Instance',
  [SPAWN_ZONE_B_SELECT]: 'Spawn in Tag B Instance',
  [SPAWN_ZONE_RANDOM_SELECT]: 'Spawn in Random Instance of Zone',
}

/// rewrite the lines below by effectInterfaceData and integrate with touchActiveEffects



/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
//// EFFECT
export const effectInterfaceData = {
  // Movement
  [EFFECT_TELEPORT]: {
    zoneEntityModelId: 'Teleport to which zone?',
    targetableType: TWO_RELATION_TAG_EFFECT_IID,
    
  
    displayName: 'Teleport',
    // icon: 'faPersonToPortal',
    icon: 'faBullseye',
  },
  [EFFECT_IGNORE_GRAVITY]: {
    targetableType: TWO_RELATION_TAG_EFFECT_IID,
    autogenerateEffect: true,
    autogenerateRelationForEvents: [ON_TOUCH_ACTIVE],

    touchActive: true,
    nonStep: true,

    displayName: 'Remove Gravity',
    icon: 'faUpLong'
  },
  [EFFECT_STICK_TO]: {
    targetableType: SINGLE_RELATION_TAG_EFFECT_IID,
    autogenerateEffect: true,
    autogenerateRelationForEvents: [ON_TOUCH_ACTIVE],

    touchActive: true,
    nonStep: true,
    nonRemote: true,


    displayName: 'Hold',
    icon: 'faHandsHolding'
  },
  [EFFECT_GRAVITY_PULL]: {
    targetableType: SINGLE_RELATION_TAG_EFFECT_IID,
    autogenerateEffect: true,
    autogenerateRelationForEvents: [ON_TOUCH_ACTIVE],

    touchActive: true,
    nonStep: true,
    nonRemote: true,

    displayName: 'Gravity Pull',
    icon: 'faUpLong'
  },
  [EFFECT_GRAVITY_PUSH]: {
    targetableType: SINGLE_RELATION_TAG_EFFECT_IID,
    autogenerateEffect: true,
    autogenerateRelationForEvents: [ON_TOUCH_ACTIVE],

    touchActive: true,
    nonStep: true,
    nonRemote: true,

    displayName: 'Gravity Push',
    icon: 'faUpLong'
  },
  [EFFECT_ALLOW_CLIMB]: {
    targetableType: SINGLE_RELATION_TAG_EFFECT_IID,
    autogenerateEffect: true,
    autogenerateRelationForEvents: [ON_TOUCH_ACTIVE],

    touchActive: true,
    nonStep: true,
    nonRemote: true,

    displayName: 'Allow Climb',
    icon: 'faWaterLadder'
  },

  // Lifecycle
  [EFFECT_TRANSFORM]: {
    entityModelId: 'Transform into which object?',
    targetableType: TWO_RELATION_TAG_EFFECT_IID,
    isCustomizeable: true,

    displayName: 'Transform',
    icon: 'faRightLeft'
  },
  [EFFECT_TRANSFORM_TEMPORARY_START]: {
    entityModelId: 'Transform into which object?',
    targetableType: TWO_RELATION_TAG_EFFECT_IID,
    isCustomizeable: true,
    // autogenerateEffect: true,
    // autogenerateRelationForEvents: [ON_TOUCH_START, ON_INTERACT]

    displayName: 'Transform Temporarily',
    icon: 'faRightLeft'
  },
  [EFFECT_TRANSFORM_TEMPORARY_END]: {
    targetableType: TWO_RELATION_TAG_EFFECT_IID,
    autogenerateEffect: true,
    autogenerateRelationForEvents: [ON_TOUCH_START, ON_INTERACT],

    displayName: 'End Temporary Transform',
    icon: 'faRightLeft'
  },
  [EFFECT_SPAWN]: {
    zoneEntityModelId: 'Spawn in which Zone?',
    effectCooldown: true,
    spawnEntityModelId: 'Which Entity will be spawned?',
    spawnZoneSelectorType: true,  
    targetableType: NO_RELATION_TAG_EFFECT_IID,
    isCustomizeable: true,

    nonRemote: true,

    displayName: 'Spawn',
    icon: 'faPlus'
  },
  [EFFECT_DESTROY]: {
    targetableType: TWO_RELATION_TAG_EFFECT_IID,
    autogenerateEffect: true,
    autogenerateRelationForEvents: [ON_TOUCH_START, ON_INTERACT],

    displayName: 'Destroy',
    icon: 'faSkullCrossbones'
  },

  // Game State
  [EFFECT_END_GAME]: {
    text: 'Message',
    targetableType: NO_RELATION_TAG_EFFECT_IID,
    isCustomizeable: true,
    autogenerateEffect: true,
    autogenerateRelationForEvents: [ON_TOUCH_START, ON_INTERACT, ON_DESTROY_ALL, ON_DESTROY_ONE],

    nonRemote: true,

    displayName: 'End Game',
    icon: 'faAward',
    customSelectorCategory: 'Game',
  },

  // Graphical
  [EFFECT_CAMERA_SHAKE]: {
    // number: 'How intense is the camera shake?',
    // effectCooldown: true,
    targetableType: NO_RELATION_TAG_EFFECT_IID,
    autogenerateEffect: true,
    runOnClient: true,

    nonRemote: true,

    displayName: 'Shake Camera',
    icon: 'faBurst'
  },
  [EFFECT_INVISIBLE]: {
    targetableType: TWO_RELATION_TAG_EFFECT_IID,
    autogenerateEffect: true,
    runOnClient: true,

    touchActive: true,
    nonStep: true,

    displayName: 'Hide',
   icon: 'faEyeSlash'
  },

  // Meta
  [EFFECT_SWITCH_STAGE]: {
    stageId: 'Which stage?',
    // zoneEntityModelId: 'Spawn in which Zone?',
    // entityModelId: 'Transform into which object? (Optional)',
    targetableType: NO_RELATION_TAG_EFFECT_IID,
    isCustomizeable: false,
    runOnClient: true,

    nonRemote: true,

    displayName: 'Switch Stage',
    icon: 'faShuffle'
  },
  [EFFECT_PAUSE_GAME]: {
    targetableType: NO_RELATION_TAG_EFFECT_IID,
    autogenerateEffect: true,

    nonRemote: true,

    displayName: 'Pause Game',
    icon: 'faPause',
    customSelectorCategory: 'Game',
  },
  [EFFECT_UNPAUSE_GAME]: {
    targetableType: NO_RELATION_TAG_EFFECT_IID,
    autogenerateEffect: true,

    nonRemote: true,

    displayName: 'Unpause Game',
    icon: 'faPlay',
    customSelectorCategory: 'Game',
  },

  // INTERFACE
  [EFFECT_INTERFACE_ACTION]: {
    // interfaceActionId: 'Which interface action?',
    targetableType: NO_RELATION_TAG_EFFECT_IID,
    // isCustomizeable: true,
    runOnClient: true,

    nonRemote: true,

    displayName: 'Interface Action',
  },
  [EFFECT_CUTSCENE]: {
    cutsceneId: 'Which cutscene?',
    targetableType: NO_RELATION_TAG_EFFECT_IID,
    runOnClient: true,

    nonRemote: true,

    displayName: 'Play Dialog/Cutscene',
    icon: 'faScroll'
  },
  [EFFECT_INTERFACE_UNLOCK]: {
    interfaceId: 'Which interface?',
    targetableType: NO_RELATION_TAG_EFFECT_IID,
    runOnClient: true,

    nonRemote: true,

    displayName: 'Unlock Interface',
    icon: 'faLockOpen'
  },
  [EFFECT_OPEN_TRANSITION]: {
    targetableType: NO_RELATION_TAG_EFFECT_IID,
    autogenerateEffect: true,
    autogenerateRelationForEvents: [ON_TOUCH_START, ON_INTERACT],
    runOnClient: true,

    nonRemote: true,

    displayName: 'Go to stars',
    icon: 'faStar',
    customSelectorCategory: 'Transition',
  },
  [EFFECT_CLOSE_TRANSITION]: {
    targetableType: NO_RELATION_TAG_EFFECT_IID,
    autogenerateEffect: true,
    autogenerateRelationForEvents: [ON_TOUCH_START, ON_INTERACT],
    runOnClient: true,

    nonRemote: true,

    displayName: 'Return from stars',
    icon: 'faStar',
    customSelectorCategory: 'Transition',
  },
}

export function isUseableEffect(effect, effectBehavior, eventType) {
  const effectTypeInterfaceData = effectInterfaceData[effectBehavior]

  if(eventType === ON_STEP_BEGINS) {
    if((!effect.remoteEffectedRelationTagIds?.length && !effectTypeInterfaceData.nonRemote) || effectTypeInterfaceData.nonStep) {
      return false
    }
  } else {
    if(eventType !== ON_TOUCH_ACTIVE) {
      if(effectTypeInterfaceData.touchActive) return false
    }
    if(eventType === ON_TOUCH_ACTIVE) {
      if(!effectTypeInterfaceData.touchActive) return false
    }
  }
  return true
}

export function getEffectShorthand(effect) {
  const effectBehavior = effect.effectBehavior 
  const displayName = effectInterfaceData[effectBehavior].displayName
  const gameModel = store.getState().gameModel.gameModel
  const entityModels = gameModel.entityModels 
  const cutscenes = gameModel.cutscenes 
  const relationTags = gameModel.relationTags 

  if(effectBehavior === EFFECT_TELEPORT) {
    return displayName + ` to  ${entityModels[effect.zoneEntityModelId].name}` 
  }

  // if(effectBehavior === EFFECT_GRAVITY_PULL) {
  //   return displayName + ` to  ${entityModels[effect.zoneEntityModelId].name}`
  // }

  if(effectBehavior === EFFECT_TRANSFORM) {
    return displayName + ` into  ${entityModels[effect.entityModelId].name}`
  }

  if(effectBehavior === EFFECT_TRANSFORM_TEMPORARY_START) {
    return displayName + ` into  ${entityModels[effect.entityModelId].name} temporarily`
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
