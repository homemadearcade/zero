import { PLACE_BASIC_ENTITY_AID, PLACE_ENTITY_AID, PLACE_NPC_ENTITY_AID, PLACE_PLAYER_ENTITY_AID, PLACE_ZONE_ENTITY_AID } from "../interfaceActionIds/place";
import { INTERFACE_ACTION_PLACE } from "../interfaceActions";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [PLACE_ENTITY_AID]: {
    arguments: ['entityModelId'],
    getTitle: ([entityModelId], gameModel) => {
      return 'Place ' + gameModel.entityModels[entityModelId].name
    },
    getSubtitle: ([entityModelId], gameModel) => {
      return gameModel.entityModels[entityModelId].name
    },
    isRemoved: ([entityModelId], gameModel) => {
      return gameModel.entityModels[entityModelId].editorInterface.hiddenFromIDs[PLACE_ENTITY_AID]
    },
    actionType: INTERFACE_ACTION_PLACE
  },
  [PLACE_PLAYER_ENTITY_AID]: {
    title: 'Place New Player',
    subTitle: 'This will open a window to create a new Player',
    higherPriority: true,
    actionType: INTERFACE_ACTION_PLACE,
  },
  [PLACE_NPC_ENTITY_AID]: {
    title: 'Place New NPC',
    subTitle: 'This will open a window to create a new NPC',
    higherPriority: true,
    actionType: INTERFACE_ACTION_PLACE,
  },
  [PLACE_ZONE_ENTITY_AID]: {
    title: 'Place New Zone',
    subTitle: 'This will open a window to create a new Zone',
    higherPriority: true,
    actionType: INTERFACE_ACTION_PLACE,
  },
  [PLACE_BASIC_ENTITY_AID]: {
    title: 'Place New Object',
    subTitle: 'This will open a window to create a new Object',
    higherPriority: true,
    actionType: INTERFACE_ACTION_PLACE,
  },
}