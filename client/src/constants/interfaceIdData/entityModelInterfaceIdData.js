import { BASIC_ENTITY_ADD_IID, BASIC_ENTITY_CONTAINER_IID, BASIC_ENTITY_SELECT_IID, CHANGE_CLASS_TYPE_IID, CLASS_LAYER_IID, CLASS_LOCK_IID, CLASS_RELATION_TAGS_IID, CLASS_UNLOCKABLE_IID, CLASS_VISIBILITY_IID, NPC_ENTITY_ADD_IID, NPC_ENTITY_CONTAINER_IID, NPC_ENTITY_SELECT_IID, PLAYER_ENTITY_ADD_IID, PLAYER_ENTITY_CONTAINER_IID, PLAYER_ENTITY_SELECT_IID, POWERUP_ENTITY_ADD_IID, POWERUP_ENTITY_CONTAINER_IID, POWERUP_ENTITY_SELECT_IID, ZONE_ENTITY_ADD_IID, ZONE_ENTITY_CONTAINER_IID, ZONE_ENTITY_SELECT_IID } from "../interfaceIds";

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
  [CLASS_LAYER_IID]: {
    
  },
  [CLASS_VISIBILITY_IID]: {
    adminOnly: true,
    previewText: 'Hide/Show'
  },
  [CLASS_LOCK_IID]: {
    adminOnly: true
  },
  [CLASS_UNLOCKABLE_IID]: {

  },
  [CHANGE_CLASS_TYPE_IID]: {
    adminOnly: true
  },
  [CLASS_RELATION_TAGS_IID]: {}
}