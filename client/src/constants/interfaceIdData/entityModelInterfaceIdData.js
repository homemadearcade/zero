import { ENTITY_MODEL_IGID } from "../interfaceIdGroups";
import { BASIC_ENTITY_ADD_IID, BASIC_ENTITY_CONTAINER_IID, BASIC_ENTITY_SELECT_IID, CHANGE_ENTITY_INTERFACE_IID, ENTITY_LAYER_IID, ENTITY_DATA_SOURCE_IID, ENTITY_RELATION_TAGS_IID, ENTITY_INVISIBLE_IID, NPC_ENTITY_ADD_IID, NPC_ENTITY_CONTAINER_IID, NPC_ENTITY_SELECT_IID, PLAYER_ENTITY_ADD_IID, PLAYER_ENTITY_CONTAINER_IID, PLAYER_ENTITY_TRANSFORM_IID, POWERUP_ENTITY_ADD_IID, POWERUP_ENTITY_CONTAINER_IID, POWERUP_ENTITY_SELECT_IID, ZONE_ENTITY_ADD_IID, ZONE_ENTITY_CONTAINER_IID, ZONE_ENTITY_SELECT_IID, ENTITY_MODEL_REMOVE_IID, PLAYER_ENTITY_SELECT_IID } from "../interfaceIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [ZONE_ENTITY_CONTAINER_IID]: {
    name: 'Zones Container',
    // ignoreTools: true,
    interfaceGroupId: ENTITY_MODEL_IGID
  },
  [ZONE_ENTITY_ADD_IID]: {
    previewText: 'Add Zone',
    leftClickAction: 'Add a Zone',
    leftClickIcon: 'faPlus',
    name: 'Add Zone Button',
    interfaceGroupId: ENTITY_MODEL_IGID
  },
  [ZONE_ENTITY_SELECT_IID]: {
    isDefaultUnlocked: true,
    interfaceGroupId: ENTITY_MODEL_IGID
  },
  [BASIC_ENTITY_CONTAINER_IID]: {
    // ignoreTools: true,
    interfaceGroupId: ENTITY_MODEL_IGID
  },
  [BASIC_ENTITY_ADD_IID]: {
    previewText: 'Add Object',
    name: 'Add Object Button',
    leftClickAction: 'Add an Object',
    leftClickIcon: 'faPlus',
    interfaceGroupId: ENTITY_MODEL_IGID
  },
  [BASIC_ENTITY_SELECT_IID]: {
    isDefaultUnlocked: true,
    interfaceGroupId: ENTITY_MODEL_IGID

  },
  [NPC_ENTITY_CONTAINER_IID]: {
    name: 'NPCs Container',
    interfaceGroupId: ENTITY_MODEL_IGID
    // ignoreTools: true,
  },
  [NPC_ENTITY_SELECT_IID]: {
    isDefaultUnlocked: true,
    interfaceGroupId: ENTITY_MODEL_IGID
  },
  [NPC_ENTITY_ADD_IID]: {
    previewText: 'Add NPC',
    name: 'Add NPC Button',
    leftClickAction: 'Add an NPC',
    leftClickIcon: 'faPlus',
    interfaceGroupId: ENTITY_MODEL_IGID
  },
  [PLAYER_ENTITY_CONTAINER_IID]: {
    name: 'Players Container',
    interfaceGroupId: ENTITY_MODEL_IGID

    // ignoreTools: true
  },
  [PLAYER_ENTITY_SELECT_IID]: {
    isDefaultUnlocked: true,
    interfaceGroupId: ENTITY_MODEL_IGID
  },
  [PLAYER_ENTITY_TRANSFORM_IID]: {},
  [PLAYER_ENTITY_ADD_IID]: {
    previewText: 'Add Player',
    leftClickAction: 'Add a Player',
    leftClickIcon: 'faPlus',
    name: 'Add Player Button',
    interfaceGroupId: ENTITY_MODEL_IGID
  },
  // [POWERUP_ENTITY_CONTAINER_IID]: {
  //   name: 'Powerups Container',
  //   interfaceGroupId: ENTITY_MODEL_IGID
  //   // ignoreTools: true
  // },
  // [POWERUP_ENTITY_SELECT_IID]: {
  //   isDefaultUnlocked: true
  // },
  // [POWERUP_ENTITY_ADD_IID]: {
  //   previewText: 'Add Powerup',
  //   name: 'Add Powerup Button',
  //   interfaceGroupId: ENTITY_MODEL_IGID
  // },
  [ENTITY_MODEL_REMOVE_IID]: {},
  [CHANGE_ENTITY_INTERFACE_IID]: {
    appAdminOnly: true
  },
}