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

export const defaultEvent = {
  type: '',
  classIdA: null,
  classIdB: null,
  onlyOnce: false,
  delayInterval: null,
  // relationId: null,
  sidesA: [],
  sidesB: [],
  eventId: null
}

export const eventDisplayNames = {
  [ON_COLLIDE_START]: 'start touching',
  // [ON_COLLIDE_END]: 'stop touching',
  [ON_COLLIDE_ACTIVE]: 'sustain touch',
  [ON_PLAYTHROUGH]: 'playthrough begins',
  //  [ON_COLLIDE_START]: 'ON_COLLIDE_START',
  //  [ON_COLLIDE_END]: 'ON_COLLIDE_END',
  //  [ON_COLLIDE_ACTIVE]: 'ON_COLLIDE_ACTIVE',
  [ON_SPAWN]: 'spawned',
  [ON_DESTROY_ONE]: 'destroyed',
  [ON_DESTROY_ALL]: 'destroyed',
  [ON_INTERACT]: 'interacted',

  // [ON_CUTSCENE_END]: 'Cutscene Ends'
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
