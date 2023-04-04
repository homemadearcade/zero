export const OPEN_GAME_METADATA_AID = 'OPEN_GAME_METADATA_AID';
export const OPEN_SPRITE_EDITOR_AID = 'OPEN_SPRITE_EDITOR_AID';
export const OPEN_EDIT_ENTITY_GRAPHICS_AID = 'OPEN_EDIT_ENTITY_GRAPHICS_AID';
export const OPEN_STAGE_BOUNDARIES_EDITOR_AID = 'OPEN_STAGE_BOUNDARIES_EDITOR_AID';
export const OPEN_CURRENT_STAGE_EDITOR_AID = 'OPEN_CURRENT_STAGE_EDITOR_AID';
export const OPEN_GAME_SNAPSHOT_TAKER_AID = 'OPEN_GAME_SNAPSHOT_TAKER_AID';
export const OPEN_CREATE_ENTITY = 'OPEN_CREATE_ENTITY';

export const ACTION_OPEN = 'ACTION_OPEN'
export const ACTION_CLOSE = 'ACTION_CLOSE'
export const ACTION_SELECT = 'ACTION_SELECT'
export const ACTION_UNLOCK = 'ACTION_UNLOCK'

export const actionToDisplayNames = {
  [ACTION_OPEN]: 'Open',
  [ACTION_CLOSE]: 'Close',
  [ACTION_SELECT]: 'Select',
}

export const actionIdData = {
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