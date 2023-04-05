import { ACTION_OPEN } from "../action";
import { OPEN_CREATE_ENTITY, OPEN_CURRENT_STAGE_EDITOR_AID, OPEN_EDIT_ENTITY, OPEN_EDIT_ENTITY_GRAPHICS_AID, OPEN_GAME_METADATA_AID, OPEN_GAME_SNAPSHOT_TAKER_AID, OPEN_STAGE_BOUNDARIES_EDITOR_AID } from "../actionIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [OPEN_GAME_METADATA_AID]: {
    name: 'Open Game Metadata Editor',
    actionType: ACTION_OPEN,
  },
  // [OPEN_SPRITE_EDITOR_AID]: {
  //   name: 'Open Sprite Editor',
  // },
  [OPEN_EDIT_ENTITY_GRAPHICS_AID]: {
    name: 'Open Edit Class Graphics ( Current Player Class )',
    actionType: ACTION_OPEN,
  },
  [OPEN_CREATE_ENTITY]: {
    name: 'Open Create Class',
    actionType: ACTION_OPEN,
  },
  [OPEN_EDIT_ENTITY]: {
    arguments: ['entityModelId'],
    name: 'Open Edit Class',
    actionType: ACTION_OPEN,
  },
  [OPEN_EDIT_ENTITY_GRAPHICS_AID]: {
    name: 'Open Edit Class Graphics ( Current Player Class )',
    actionType: ACTION_OPEN,
  },
  [OPEN_STAGE_BOUNDARIES_EDITOR_AID]: {
    name: 'Open Stage Boundaries Editor ( Current Stage )',
    actionType: ACTION_OPEN,
  },
  [OPEN_CURRENT_STAGE_EDITOR_AID]: {
    name: 'Open Stage Editor (Current Stage)',
    actionType: ACTION_OPEN,
  },
  [OPEN_GAME_SNAPSHOT_TAKER_AID]: {
    name: 'Open Game Snapshot Taker',
    actionType: ACTION_OPEN,
  },
}
