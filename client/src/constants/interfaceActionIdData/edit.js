import { EDIT_CURRENT_STAGE_AID, EDIT_CURRENT_STAGE_BACKGROUND_COLOR_AID, EDIT_CURRENT_STAGE_BOUNDARIES_AID, EDIT_ENTITY_AID, EDIT_ENTITY_GRAPHICS_AID, EDIT_ENTITY_SPRITE_AID, EDIT_GAME_METADATA_AID } from "../interfaceActionIds/edit";

 
 // eslint-disable-next-line import/no-anonymous-default-export
export default {
  [EDIT_ENTITY_AID]: {
    name: 'Edit Class',
    arguments: ['entityModelId']
  },
  [EDIT_CURRENT_STAGE_BACKGROUND_COLOR_AID]: {
    name: 'Edit Background Color',
  },
  [EDIT_GAME_METADATA_AID]: {
    name: 'Edit Game Metadata',
  },
  [EDIT_ENTITY_SPRITE_AID]: {
    name: 'Edit Sprite',
    arguments: ['entityModelId']
  },
  [EDIT_ENTITY_GRAPHICS_AID]: {
    name: 'Edit Graphics',
    arguments: ['entityModelId']
  },
  [EDIT_CURRENT_STAGE_BOUNDARIES_AID]: {
    name: 'Edit Stage Boundaries',
  },
  [EDIT_CURRENT_STAGE_AID]: {
    name: 'Edit Current Stage',
  }
}
