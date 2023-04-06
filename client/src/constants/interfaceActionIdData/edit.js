import { EDIT_CURRENT_STAGE_AID, EDIT_CURRENT_STAGE_BACKGROUND_COLOR_AID, EDIT_CURRENT_STAGE_BOUNDARIES_AID, EDIT_ENTITY_AID, EDIT_ENTITY_GRAPHICS_AID, EDIT_GAME_METADATA_AID } from "../interfaceActionIds/edit";
import { INTERFACE_ACTION_EDIT } from "../interfaceActions";

 
 // eslint-disable-next-line import/no-anonymous-default-export
export default {
  [EDIT_ENTITY_AID]: {
    getName(gameModel, [entityModelId]) {
      return 'Edit ' + gameModel.entityModels[entityModelId].name
    },
    arguments: ['entityModelId'],
    actionType: INTERFACE_ACTION_EDIT
  },
  [EDIT_CURRENT_STAGE_BACKGROUND_COLOR_AID]: {
    name: 'Edit Background Color',
    actionType: INTERFACE_ACTION_EDIT

  },
  [EDIT_GAME_METADATA_AID]: {
    name: 'Edit Game Metadata',
    actionType: INTERFACE_ACTION_EDIT
  },
  [EDIT_ENTITY_GRAPHICS_AID]: {
    getName(gameModel, [entityModelId]) {
      return 'Edit Graphics for ' + gameModel.entityModels[entityModelId].name
    },
    actionType: INTERFACE_ACTION_EDIT,
    arguments: ['entityModelId']
  },
  [EDIT_CURRENT_STAGE_BOUNDARIES_AID]: {
    name: 'Edit Boundaries',
    actionType: INTERFACE_ACTION_EDIT
  },
  [EDIT_CURRENT_STAGE_AID]: {
    name: 'Edit Current Stage',
    actionType: INTERFACE_ACTION_EDIT
  }
}
