import { EDIT_CURRENT_STAGE_AID, EDIT_CURRENT_STAGE_BACKGROUND_COLOR_AID, EDIT_CURRENT_STAGE_BOUNDARIES_AID, EDIT_ENTITY_AID, EDIT_ENTITY_GRAPHICS_AID, EDIT_GAME_METADATA_AID } from "../interfaceActionIds/edit";
import { INTERFACE_ACTION_EDIT } from "../interfaceActions";
import { ZONE_ENTITY_IID } from "../interfaceIds";

 // eslint-disable-next-line import/no-anonymous-default-export
export default {
  [EDIT_ENTITY_AID]: {
    getTitle( [entityModelId], gameModel) {
      return 'Edit ' + gameModel.entityModels[entityModelId].name
    },
    getSubtitle: ([entityModelId], gameModel) => {
      return gameModel.entityModels[entityModelId].name
    },
    isRemoved: ([entityModelId], gameModel) => {
      return gameModel.entityModels[entityModelId].editorInterface.hiddenFromIDs[EDIT_ENTITY_AID]
    },
    arguments: ['entityModelId'],
    actionType: INTERFACE_ACTION_EDIT
  },
  [EDIT_CURRENT_STAGE_BACKGROUND_COLOR_AID]: {
    title: 'Edit Background Color',
    subTitle: 'This will open a popup to select the background color',
    actionType: INTERFACE_ACTION_EDIT
  },
  [EDIT_GAME_METADATA_AID]: {
    title: 'Edit Game Metadata',
    subTitle: 'This will open a popup to edit the game metadata',
    actionType: INTERFACE_ACTION_EDIT
  },
  [EDIT_ENTITY_GRAPHICS_AID]: {
    getTitle([entityModelId], gameModel) {
      return 'Edit Graphics for ' + gameModel.entityModels[entityModelId].name
    },
    getSubtitle: ([entityModelId], gameModel) => {
      return gameModel.entityModels[entityModelId].name
    },
    isRemoved: ([entityModelId], gameModel) => {
      return gameModel.entityModels[entityModelId].entityIID === ZONE_ENTITY_IID
    },
    actionType: INTERFACE_ACTION_EDIT,
    arguments: ['entityModelId']
  },
  [EDIT_CURRENT_STAGE_BOUNDARIES_AID]: {
    title: 'Edit Boundaries',
    subTitle: 'This will open a popup to edit the boundaries',
    actionType: INTERFACE_ACTION_EDIT
  },
  [EDIT_CURRENT_STAGE_AID]: {
    title: 'Edit Stage',
    subTitle: 'This will open a popup to edit the current stage',
    actionType: INTERFACE_ACTION_EDIT
  }
}
