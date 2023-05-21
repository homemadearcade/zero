import {  CUTSCENE_EVENT_IID, PLAYER_AND_RELATION_TAG_EVENT_IID, PLAYER_RELATION_TAG_EVENT_IID, SINGLE_RELATION_TAG_EVENT_IID, TWO_RELATION_TAG_EVENT_IID  } from "../../../constants/interfaceIds"
import { ON_CUTSCENE_END, ON_DESTROY_ALL, ON_DESTROY_ONE, ON_INTERACT, ON_PLAYTHROUGH, ON_SPAWN, ON_TOUCH_ACTIVE, ON_TOUCH_START,
   } from "../core"

export const eventShortNames = {
  [ON_TOUCH_START]: 'Touch Start',
  // [ON_COLLIDE_END]: 'stop touching',
  [ON_TOUCH_ACTIVE]: 'Touching',
  [ON_PLAYTHROUGH]: 'Start',
  //  [ON_TOUCH_START]: 'ON_TOUCH_START',
  //  [ON_COLLIDE_END]: 'ON_COLLIDE_END',
  //  [ON_TOUCH_ACTIVE]: 'ON_TOUCH_ACTIVE',
  [ON_SPAWN]: 'Spawn',
  [ON_DESTROY_ONE]: 'Destroyed',
  [ON_DESTROY_ALL]: 'All Destroyed',
  [ON_INTERACT]: 'Interact',

  [ON_CUTSCENE_END]: 'Cutscene Ends'
}

export const eventTypeDescriptions = {
  [ON_TOUCH_START]: {
    general: 'When Tag A starts touching Tag B',
    this: 'When Player starts touching this',
  },
  // [ON_COLLIDE_END]: 'stop touching',
  [ON_TOUCH_ACTIVE]: {
    general: 'While Tag A is touching Tag B',
    this: 'While Player is touching this',
  },
  [ON_PLAYTHROUGH]: {
    general: 'When game playthrough begins',
  },
  //  [ON_TOUCH_START]: 'ON_TOUCH_START',
  //  [ON_COLLIDE_END]: 'ON_COLLIDE_END',
  //  [ON_TOUCH_ACTIVE]: 'ON_TOUCH_ACTIVE',
  [ON_SPAWN]: {
    general: 'When Tag A is spawned',
    this: 'When this is spawned',
  },
  [ON_DESTROY_ONE]: {
    general: 'When Tag A is destroyed',
    this: 'When this is destroyed',
  },
  [ON_DESTROY_ALL]: {
    general: 'When all instances of Tag A are destroyed',
    this: 'When all instances of this are destroyed',
  },
  [ON_INTERACT]: {
    general: 'When a player presses X near Interactable Tag',
    this: 'When a player presses X near this',
  },
  [ON_CUTSCENE_END]: {
    general: 'When a cutscene ends',
    this: 'When this cutscene ends',
  }
}

export const eventTypeInterfaces = {
  [ON_TOUCH_ACTIVE]: {
    relationTagSelectType: TWO_RELATION_TAG_EVENT_IID
  },
  [ON_TOUCH_START]: {
    relationTagSelectType: TWO_RELATION_TAG_EVENT_IID,
    effectDelay: true,
    onlyOnce: true,
    effectCooldown: true,
  },
  // [ON_COLLIDE_END]: {},
  //  [ON_TOUCH_START]: 'ON_TOUCH_START',
  //  [ON_COLLIDE_END]: 'ON_COLLIDE_END',
  //  [ON_TOUCH_ACTIVE]: 'ON_TOUCH_ACTIVE',
  [ON_PLAYTHROUGH]: {
    relationTagSelectType: PLAYER_RELATION_TAG_EVENT_IID,
    effectDelay: true
  },
  [ON_SPAWN]: {
    relationTagSelectType: SINGLE_RELATION_TAG_EVENT_IID,
    effectDelay: true,
    onlyOnce: true
  },
  [ON_DESTROY_ONE]: {
    relationTagSelectType: SINGLE_RELATION_TAG_EVENT_IID,
    effectDelay: true,
    onlyOnce: true
  },
  [ON_DESTROY_ALL]: {
    relationTagSelectType: SINGLE_RELATION_TAG_EVENT_IID,
    effectDelay: true,
  },
  [ON_INTERACT]: {
    relationTagSelectType: PLAYER_AND_RELATION_TAG_EVENT_IID,
    onlyOnce: true,
    effectCooldown: true
  },
  [ON_CUTSCENE_END]: {
    relationTagSelectType: CUTSCENE_EVENT_IID,
    effectDelay: true,
    effectCooldown: true,
    onlyOnce: true
  }
}