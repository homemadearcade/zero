import { editGameModel } from "../../store/actions/game/gameModelActions";
import { IMPORT_DATA_SOURCE_AID } from "../interfaceActionIds";
import { INTERFACE_ACTION_IMPORT } from "../interfaceActionIdGroups";
import store from "../../store";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [IMPORT_DATA_SOURCE_AID]: {
    getTitle: ([entityModelId], gameModel) => {
      return 'Import ' + gameModel.entityModels[entityModelId].name
    },
    getSubtitle: ([entityModelId], gameModel) => {
      return gameModel.entityModels[entityModelId].name
    },
    isRemoved: ([entityModelId], gameModel) => {
      return gameModel.entityModels[entityModelId].importedStageIds[store.getState().gameRoomInstance.gameRoomInstance.currentStageId] || gameModel.entityModels[entityModelId].editorInterface.hiddenFromIDs[IMPORT_DATA_SOURCE_AID]
    },
    onClick: ([entityModelId]) => (dispatch, gameModel, getState) => {
      dispatch(editGameModel({
        entityModels: {
          [entityModelId]: {
            importedStageIds: {
              [getState().gameRoomInstance.gameRoomInstance.currentStageId]: true
            }
          }
        }
      }))
    },
    arguments: ['entityModelId'],
    interfaceActionGroupId: INTERFACE_ACTION_IMPORT
  },
}