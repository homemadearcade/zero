import { IMPORT_DATA_SOURCE_AID } from "../interfaceActionIds";
import { INTERFACE_ACTION_IMPORT } from "../interfaceActions";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [IMPORT_DATA_SOURCE_AID]: {
    getName: ([entityModelId], gameModel) => {
      return 'Import ' + gameModel.entityModels[entityModelId].name
    },
    arguments: ['entityModelId'],
    actionType: INTERFACE_ACTION_IMPORT
  },
}