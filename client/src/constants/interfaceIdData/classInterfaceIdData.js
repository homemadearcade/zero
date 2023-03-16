import { BASIC_CLASS_ADD_IID, BASIC_CLASS_CONTAINER_IID, BASIC_CLASS_SELECT_IID, CHANGE_CLASS_TYPE_IID, CLASS_LAYER_IID, CLASS_LOCK_IID, CLASS_TAGS_IID, CLASS_UNLOCKABLE_IID, CLASS_VISIBILITY_IID, NPC_CLASS_ADD_IID, NPC_CLASS_CONTAINER_IID, NPC_CLASS_SELECT_IID, PLAYER_CLASS_ADD_IID, PLAYER_CLASS_CONTAINER_IID, PLAYER_CLASS_SELECT_IID, ZONE_CLASS_ADD_IID, ZONE_CLASS_CONTAINER_IID, ZONE_CLASS_SELECT_IID } from "../interfaceIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [ZONE_CLASS_CONTAINER_IID]: {
    ignoreTools: true
  },
  [ZONE_CLASS_ADD_IID]: {
    previewText: 'Add Zone'
  },
  [ZONE_CLASS_SELECT_IID]: {},
  [BASIC_CLASS_CONTAINER_IID]: {
    ignoreTools: true
  },
  [BASIC_CLASS_ADD_IID]: {
    previewText: 'Add Object'
  },
  [BASIC_CLASS_SELECT_IID]: {},
  [NPC_CLASS_CONTAINER_IID]: {
    ignoreTools: true
  },
  [NPC_CLASS_SELECT_IID]: {},
  [NPC_CLASS_ADD_IID]: {
    previewText: 'Add NPC'
  },
  [PLAYER_CLASS_CONTAINER_IID]: {
    ignoreTools: true
  },
  [PLAYER_CLASS_SELECT_IID]: {},
  [PLAYER_CLASS_ADD_IID]: {
    previewText: 'Add Player'
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
  [CLASS_TAGS_IID]: {}
}