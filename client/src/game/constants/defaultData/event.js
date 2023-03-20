/////////////////////////////////////
/////////////////////////////////////

import store from "../../../store"
import Typography from "../../../ui/Typography/Typography"
import Sprite from "../../sprites/Texture/Texture"

// EVENTS
export const ON_TOUCH_START = 'ON_TOUCH_START'
export const ON_COLLIDE_END = 'ON_COLLIDE_END'
export const ON_TOUCH_ACTIVE = 'ON_TOUCH_ACTIVE'
export const ON_SPAWN = 'ON_SPAWN'
export const ON_PLAYTHROUGH = 'ON_PLAYTHROUGH'
export const ON_DESTROY_ONE = 'ON_DESTROY_ONE'
export const ON_DESTROY_ALL = 'ON_DESTROY_ALL'
export const ON_INTERACT = 'ON_INTERACT'
export const ON_CUTSCENE_END = 'ON_CUTSCENE_END'

export const NO_TAG_EVENT = 'NO_TAG_EVENT'
export const SINGLE_TAG_EVENT = 'SINGLE_TAG_EVENT'
export const TWO_TAG_EVENT = 'TWO_TAG_EVENT'
export const PLAYER_AND_TAG_EVENT = 'PLAYER_AND_TAG_EVENT'
export const PLAYER_TAG_EVENT = 'PLAYER_TAG_EVENT'

// WHEN, WHO, WHERE
export const defaultEvent = {
  eventType: '',
  tagIdA: null,
  tagIdB: null,

  sidesA: [],
  sidesB: [],
  eventId: null,

  onlyOnce: false,
}

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
    tagSelectType: TWO_TAG_EVENT
  },
  [ON_TOUCH_START]: {
    tagSelectType: TWO_TAG_EVENT,
    effectDelay: true,
    onlyOnce: true,
    effectCooldown: true,
  },
  // [ON_COLLIDE_END]: {},
  //  [ON_TOUCH_START]: 'ON_TOUCH_START',
  //  [ON_COLLIDE_END]: 'ON_COLLIDE_END',
  //  [ON_TOUCH_ACTIVE]: 'ON_TOUCH_ACTIVE',
  [ON_PLAYTHROUGH]: {
    tagSelectType: PLAYER_TAG_EVENT,
    effectDelay: true
  },
  [ON_SPAWN]: {
    tagSelectType: SINGLE_TAG_EVENT,
    effectDelay: true,
    onlyOnce: true
  },
  [ON_DESTROY_ONE]: {
    tagSelectType: SINGLE_TAG_EVENT,
    effectDelay: true,
    onlyOnce: true
  },
  [ON_DESTROY_ALL]: {
    tagSelectType: SINGLE_TAG_EVENT,
    effectDelay: true,
  },
  [ON_INTERACT]: {
    tagSelectType: PLAYER_AND_TAG_EVENT,
    onlyOnce: true,
    effectCooldown: true
  },
}



export const singleClassEvents = {
  [ON_TOUCH_ACTIVE]: false,
  [ON_TOUCH_START]: false,
  // [ON_COLLIDE_END]: false,
  //  [ON_TOUCH_START]: 'ON_TOUCH_START',
  //  [ON_COLLIDE_END]: 'ON_COLLIDE_END',
  //  [ON_TOUCH_ACTIVE]: 'ON_TOUCH_ACTIVE',
  [ON_PLAYTHROUGH]: true,
  [ON_SPAWN]: true,
  [ON_DESTROY_ONE]: true,
  [ON_DESTROY_ALL]: true,
  [ON_INTERACT]: false,
}

export const eventPrefix = {
  [ON_TOUCH_ACTIVE]: 'Class A And Class B',
  [ON_TOUCH_START]: 'Class A And Class B',
  // [ON_COLLIDE_END]: 'Class A And Class B',
  //  [ON_TOUCH_START]: 'ON_TOUCH_START',
  //  [ON_COLLIDE_END]: 'ON_COLLIDE_END',
  //  [ON_TOUCH_ACTIVE]: 'ON_TOUCH_ACTIVE',
  [ON_PLAYTHROUGH]: null,
  [ON_SPAWN]: 'ClassB',
  [ON_DESTROY_ONE]: 'ClassB',
  [ON_DESTROY_ALL]: 'All ClassBs',
  [ON_INTERACT]: 'ClassB',

  // [ON_CUTSCENE_END]: 'Cutscene Ends'
}