import {  CUTSCENE_EVENT_IID, PLAYER_AND_RELATION_TAG_EVENT_IID, PLAYER_RELATION_TAG_EVENT_IID, SINGLE_RELATION_TAG_EVENT_IID, STAGE_EVENT_IID, TWO_RELATION_TAG_EVENT_IID  } from "../../../constants/interfaceIds"
import { ON_CUTSCENE_END, ON_DESTROY_ALL, ON_DESTROY_ONE, ON_INTERACT, ON_PLAYTHROUGH, ON_SPAWN, ON_STAGE_LOADED, ON_TOUCH_ACTIVE, ON_TOUCH_START,
   } from "../core"

export const eventInterfaceData = {
  [ON_TOUCH_ACTIVE]: {
    relationTagSelectType: TWO_RELATION_TAG_EVENT_IID,

    name: 'While Touching',
    description: {
      general: 'When Tag A starts touching Tag B',
      this: 'When Player starts touching this',
    }
  },
  [ON_TOUCH_START]: {
    
    relationTagSelectType: TWO_RELATION_TAG_EVENT_IID,
    effectDelay: true,
    onlyOnce: true,
    effectCooldown: true,

    name: 'Touch Start',
    description: {
      general: 'While Tag A is touching Tag B',
      this: 'While Player is touching this',
    }

  },
  // [ON_COLLIDE_END]: {},
  //  [ON_TOUCH_START]: 'ON_TOUCH_START',
  //  [ON_COLLIDE_END]: 'ON_COLLIDE_END',
  //  [ON_TOUCH_ACTIVE]: 'ON_TOUCH_ACTIVE',
  [ON_PLAYTHROUGH]: {
    relationTagSelectType: PLAYER_RELATION_TAG_EVENT_IID,
    effectDelay: true,

    name: 'Start Game',
    description: {
      general: 'When game playthrough begins',
    }
  },
  [ON_SPAWN]: {
    relationTagSelectType: SINGLE_RELATION_TAG_EVENT_IID,
    effectDelay: true,
    onlyOnce: true,
    
    name: 'Spawn',
    description: {
      general: 'When Tag A is spawned',
      this: 'When this is spawned',
    }
  },
  [ON_DESTROY_ONE]: {
    relationTagSelectType: SINGLE_RELATION_TAG_EVENT_IID,
    effectDelay: true,
    onlyOnce: true,

    name: 'Destroyed',
    description : {
      general: 'When Tag A is destroyed',
      this: 'When this is destroyed',
    }
  },
  [ON_DESTROY_ALL]: {
    relationTagSelectType: SINGLE_RELATION_TAG_EVENT_IID,
    effectDelay: true,

    name: 'All Destroyed',
    description: {
      general: 'When all instances of Tag A are destroyed',
      this: 'When all instances of this are destroyed',
    }
  },
  [ON_INTERACT]: {
    relationTagSelectType: PLAYER_AND_RELATION_TAG_EVENT_IID,
    onlyOnce: true,
    effectCooldown: true,

    name: 'Interact',
    description: {
      general: 'When a player presses X near Interactable Tag',
      this: 'When a player presses X near this',
    }
  },
  [ON_CUTSCENE_END]: {
    relationTagSelectType: CUTSCENE_EVENT_IID,
    effectDelay: true,
    effectCooldown: true,
    onlyOnce: true,

    name: 'Cutscene Ends',
    description: {
      general: 'When a cutscene ends',
      this: 'When this cutscene ends',
    }
  },
  [ON_STAGE_LOADED]: {
    relationTagSelectType: STAGE_EVENT_IID,
    effectDelay: true,
    onlyOnce: true,

    name: 'Stage Loaded',
    description: {
      general: 'When a stage is loaded',
    }
  },
}