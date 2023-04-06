import { PLACE_BASIC_ENTITY_AID, PLACE_ENTITY_AID, PLACE_NPC_ENTITY_AID, PLACE_PLAYER_ENTITY_AID, PLACE_ZONE_ENTITY_AID } from "../interfaceActionIds/place";
import { INTERFACE_ACTION_PLACE } from "../interfaceActions";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [PLACE_ENTITY_AID]: {
    arguments: ['entityModelId'],
    getName: (gameModel, [brushId]) => {
      return 'Place ' + gameModel.brushes[brushId].name
    },
    actionType: INTERFACE_ACTION_PLACE
  },
  [PLACE_PLAYER_ENTITY_AID]: {
    name: 'Place New Player',
    higherPriority: true,
    actionType: INTERFACE_ACTION_PLACE,
  },
  [PLACE_NPC_ENTITY_AID]: {
    name: 'Place New NPC',
    higherPriority: true,
    actionType: INTERFACE_ACTION_PLACE,
  },
  [PLACE_ZONE_ENTITY_AID]: {
    name: 'Place New Zone',
    higherPriority: true,
    actionType: INTERFACE_ACTION_PLACE,
  },
  [PLACE_BASIC_ENTITY_AID]: {
    name: 'Place New Object',
    higherPriority: true,
    actionType: INTERFACE_ACTION_PLACE,
  },
}