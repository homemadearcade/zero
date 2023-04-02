import { BASIC_ENTITY_ADD_IID, BASIC_ENTITY_CONTAINER_IID, BASIC_ENTITY_SELECT_IID, CHANGE_ENTITY_INTERFACE_IID, ENTITY_LAYER_IID, ENTITY_DATA_SOURCE_IID, ENTITY_RELATION_TAGS_IID, ENTITY_VISIBILITY_IID, NPC_ENTITY_ADD_IID, NPC_ENTITY_CONTAINER_IID, NPC_ENTITY_SELECT_IID, PLAYER_ENTITY_ADD_IID, PLAYER_ENTITY_CONTAINER_IID, PLAYER_ENTITY_SELECT_IID, POWERUP_ENTITY_ADD_IID, POWERUP_ENTITY_CONTAINER_IID, POWERUP_ENTITY_SELECT_IID, ZONE_ENTITY_ADD_IID, ZONE_ENTITY_CONTAINER_IID, ZONE_ENTITY_SELECT_IID } from "../interfaceIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [ZONE_ENTITY_CONTAINER_IID]: {
    ignoreTools: true
  },
  [ZONE_ENTITY_ADD_IID]: {
    previewText: 'Add Zone'
  },
  [ZONE_ENTITY_SELECT_IID]: {},
  [BASIC_ENTITY_CONTAINER_IID]: {
    ignoreTools: true
  },
  [BASIC_ENTITY_ADD_IID]: {
    previewText: 'Add Object'
  },
  [BASIC_ENTITY_SELECT_IID]: {},
  [NPC_ENTITY_CONTAINER_IID]: {
    ignoreTools: true
  },
  [NPC_ENTITY_SELECT_IID]: {},
  [NPC_ENTITY_ADD_IID]: {
    previewText: 'Add NPC'
  },
  [PLAYER_ENTITY_CONTAINER_IID]: {
    ignoreTools: true
  },
  [PLAYER_ENTITY_SELECT_IID]: {},
  [PLAYER_ENTITY_ADD_IID]: {
    previewText: 'Add Player'
  },
  [POWERUP_ENTITY_CONTAINER_IID]: {
    ignoreTools: true
  },
  [POWERUP_ENTITY_SELECT_IID]: {},
  [POWERUP_ENTITY_ADD_IID]: {
    previewText: 'Add Powerup'
  },
  [ENTITY_LAYER_IID]: {
    
  },
  [ENTITY_VISIBILITY_IID]: {
    adminOnly: true,
    previewText: 'Hide/Show'
  },
  [ENTITY_DATA_SOURCE_IID]: {
    adminOnly: true
  },
  [CHANGE_ENTITY_INTERFACE_IID]: {
    adminOnly: true
  },
  [ENTITY_RELATION_TAGS_IID]: {}
}