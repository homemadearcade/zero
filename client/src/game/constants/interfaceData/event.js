import { ON_DESTROY_ALL, ON_DESTROY_ONE, ON_INTERACT, ON_PLAYTHROUGH, ON_SPAWN, ON_TOUCH_ACTIVE, ON_TOUCH_START, PLAYER_AND_RELATION_TAG_EVENT, PLAYER_RELATION_TAG_EVENT, SINGLE_RELATION_TAG_EVENT, TWO_RELATION_TAG_EVENT } from "../core"

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

  // [ON_CUTSCENE_END]: 'Cutscene Ends'
}

export const eventTypeToDisplayNames = {
  [ON_TOUCH_START]: 'When Tag A starts touching Tag B',
  // [ON_COLLIDE_END]: 'stop touching',
  [ON_TOUCH_ACTIVE]: 'While Tag A is touching Tag B',
  [ON_PLAYTHROUGH]: 'When game playthrough begins',
  //  [ON_TOUCH_START]: 'ON_TOUCH_START',
  //  [ON_COLLIDE_END]: 'ON_COLLIDE_END',
  //  [ON_TOUCH_ACTIVE]: 'ON_TOUCH_ACTIVE',
  [ON_SPAWN]: 'When Tag A is spawned',
  [ON_DESTROY_ONE]: 'When Tag A is destroyed',
  [ON_DESTROY_ALL]: 'When all instances of Tag A are destroyed',
  [ON_INTERACT]: 'When a player presses X near Interactable Tag',

  // [ON_CUTSCENE_END]: 'Cutscene Ends'
}

export const eventTypeInterfaces = {
  [ON_TOUCH_ACTIVE]: {
    relationTagSelectType: TWO_RELATION_TAG_EVENT
  },
  [ON_TOUCH_START]: {
    relationTagSelectType: TWO_RELATION_TAG_EVENT,
    effectDelay: true,
    onlyOnce: true,
    effectCooldown: true,
  },
  // [ON_COLLIDE_END]: {},
  //  [ON_TOUCH_START]: 'ON_TOUCH_START',
  //  [ON_COLLIDE_END]: 'ON_COLLIDE_END',
  //  [ON_TOUCH_ACTIVE]: 'ON_TOUCH_ACTIVE',
  [ON_PLAYTHROUGH]: {
    relationTagSelectType: PLAYER_RELATION_TAG_EVENT,
    effectDelay: true
  },
  [ON_SPAWN]: {
    relationTagSelectType: SINGLE_RELATION_TAG_EVENT,
    effectDelay: true,
    onlyOnce: true
  },
  [ON_DESTROY_ONE]: {
    relationTagSelectType: SINGLE_RELATION_TAG_EVENT,
    effectDelay: true,
    onlyOnce: true
  },
  [ON_DESTROY_ALL]: {
    relationTagSelectType: SINGLE_RELATION_TAG_EVENT,
    effectDelay: true,
  },
  [ON_INTERACT]: {
    relationTagSelectType: PLAYER_AND_RELATION_TAG_EVENT,
    onlyOnce: true,
    effectCooldown: true
  },
}