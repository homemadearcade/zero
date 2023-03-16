/////////////////////////////////////
/////////////////////////////////////
// EVENTS
export const ON_COLLIDE_START = 'ON_COLLIDE_START'
export const ON_COLLIDE_END = 'ON_COLLIDE_END'
export const ON_COLLIDE_ACTIVE = 'ON_COLLIDE_ACTIVE'
export const ON_SPAWN = 'ON_SPAWN'
export const ON_PLAYTHROUGH = 'ON_PLAYTHROUGH'
export const ON_DESTROY_ONE = 'ON_DESTROY_ONE'
export const ON_DESTROY_ALL = 'ON_DESTROY_ALL'
export const ON_INTERACT = 'ON_INTERACT'
export const ON_CUTSCENE_END = 'ON_CUTSCENE_END'

export const NO_TAG_EVENT = 'NO_TAG_EVENT'
export const SINGLE_TAG_EVENT = 'SINGLE_TAG_EVENT'
export const TWO_TAG_EVENT = 'TWO_TAG_EVENT'

// WHEN, WHO, WHERE
export const defaultEvent = {
  type: '',
  tagIdA: null,
  tagIdB: null,

  sidesA: [],
  sidesB: [],
  eventId: null,

  effects: {},
  onlyOnce: false,
  delayInterval: null,
  delayEffect: null,
}

export const eventShortNames = {
  [ON_COLLIDE_START]: 'Touch Start',
  // [ON_COLLIDE_END]: 'stop touching',
  [ON_COLLIDE_ACTIVE]: 'Touching',
  [ON_PLAYTHROUGH]: 'Start',
  //  [ON_COLLIDE_START]: 'ON_COLLIDE_START',
  //  [ON_COLLIDE_END]: 'ON_COLLIDE_END',
  //  [ON_COLLIDE_ACTIVE]: 'ON_COLLIDE_ACTIVE',
  [ON_SPAWN]: 'Spawn',
  [ON_DESTROY_ONE]: 'Destroyed',
  [ON_DESTROY_ALL]: 'All Destroyed',
  [ON_INTERACT]: 'Interact',

  // [ON_CUTSCENE_END]: 'Cutscene Ends'
}

export const eventDisplayNames = {
  [ON_COLLIDE_START]: 'When two tagged objects start touching',
  // [ON_COLLIDE_END]: 'stop touching',
  [ON_COLLIDE_ACTIVE]: 'While two tagged objects are touching',
  [ON_PLAYTHROUGH]: 'When game playthrough begins',
  //  [ON_COLLIDE_START]: 'ON_COLLIDE_START',
  //  [ON_COLLIDE_END]: 'ON_COLLIDE_END',
  //  [ON_COLLIDE_ACTIVE]: 'ON_COLLIDE_ACTIVE',
  [ON_SPAWN]: 'When the tagged object is spawned',
  [ON_DESTROY_ONE]: 'When the tagged object is destroyed',
  [ON_DESTROY_ALL]: 'When all of the tagged objects are destroyed',
  [ON_INTERACT]: 'When a player interacts with a tagged object',

  // [ON_CUTSCENE_END]: 'Cutscene Ends'
}

export const eventEditInterface = {
  [ON_COLLIDE_ACTIVE]: {
    tagSelectType: TWO_TAG_EVENT
  },
  [ON_COLLIDE_START]: {
    tagSelectType: TWO_TAG_EVENT,
    delayEffect: true,
    onlyOnce: true,
    delayInterval: true,
  },
  // [ON_COLLIDE_END]: {},
  //  [ON_COLLIDE_START]: 'ON_COLLIDE_START',
  //  [ON_COLLIDE_END]: 'ON_COLLIDE_END',
  //  [ON_COLLIDE_ACTIVE]: 'ON_COLLIDE_ACTIVE',
  [ON_PLAYTHROUGH]: {
    tagSelectType: NO_TAG_EVENT,
    delayEffect: true
  },
  [ON_SPAWN]: {
    tagSelectType: SINGLE_TAG_EVENT,
    delayEffect: true,
    onlyOnce: true
  },
  [ON_DESTROY_ONE]: {
    tagSelectType: SINGLE_TAG_EVENT,
    delayEffect: true,
    onlyOnce: true
  },
  [ON_DESTROY_ALL]: {
    tagSelectType: SINGLE_TAG_EVENT,
    delayEffect: true,
  },
  [ON_INTERACT]: {
    tagSelectType: SINGLE_TAG_EVENT,
    onlyOnce: true,
    delayInterval: true
  },
}



export const singleClassEvents = {
  [ON_COLLIDE_ACTIVE]: false,
  [ON_COLLIDE_START]: false,
  // [ON_COLLIDE_END]: false,
  //  [ON_COLLIDE_START]: 'ON_COLLIDE_START',
  //  [ON_COLLIDE_END]: 'ON_COLLIDE_END',
  //  [ON_COLLIDE_ACTIVE]: 'ON_COLLIDE_ACTIVE',
  [ON_PLAYTHROUGH]: true,
  [ON_SPAWN]: true,
  [ON_DESTROY_ONE]: true,
  [ON_DESTROY_ALL]: true,
  [ON_INTERACT]: false,
}

export const eventPrefix = {
  [ON_COLLIDE_ACTIVE]: 'Class A And Class B',
  [ON_COLLIDE_START]: 'Class A And Class B',
  // [ON_COLLIDE_END]: 'Class A And Class B',
  //  [ON_COLLIDE_START]: 'ON_COLLIDE_START',
  //  [ON_COLLIDE_END]: 'ON_COLLIDE_END',
  //  [ON_COLLIDE_ACTIVE]: 'ON_COLLIDE_ACTIVE',
  [ON_PLAYTHROUGH]: null,
  [ON_SPAWN]: 'ClassB',
  [ON_DESTROY_ONE]: 'ClassB',
  [ON_DESTROY_ALL]: 'All ClassBs',
  [ON_INTERACT]: 'ClassB',

  // [ON_CUTSCENE_END]: 'Cutscene Ends'
}
