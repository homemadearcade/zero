import { openEditEntityDialog } from "../../store/actions/game/gameFormEditorActions";
import { openGameEditDialog, openEntityBehaviorLiveEditor } from "../../store/actions/game/gameSelectorActions";
import { 
  EDIT_CURRENT_PLAYER_CAMERA_AID, 
  EDIT_ENTITY_AID, 
  EDIT_GAME_METADATA_AID } from "../interfaceActionIds";
import { 
  INTERFACE_ACTION_CURRENT_PLAYER, 
  INTERFACE_ACTION_EDIT,
  INTERFACE_ACTION_GAME } from "../interfaceActionIdGroups";
import { 
  EDIT_GAME_METADATA_TAB_IID, 
  LIVE_ENTITY_EDITOR_CAMERA_TAB_IID, 
} from "../interfaceIds";

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
      return gameModel.entityModels[entityModelId].editorInterface.notSelectableInInterface
    },
    onClick: ([entityModelId]) => (dispatch, gameModel) => {
      const entityModel = gameModel.entityModels[entityModelId]
      dispatch(openEditEntityDialog(entityModel))
    },
    arguments: ['entityModelId'],
    interfaceActionGroupId: INTERFACE_ACTION_EDIT
  },
  [EDIT_GAME_METADATA_AID]: {
    title: 'Edit Game Metadata',
    subTitle: 'This will open a popup to edit the game metadata',
    interfaceActionGroupId: INTERFACE_ACTION_GAME,
    onClick: () => (dispatch) => {
      dispatch(openGameEditDialog(EDIT_GAME_METADATA_TAB_IID))
    }
  },
  [EDIT_CURRENT_PLAYER_CAMERA_AID]: {
    title: 'Edit Current Player Camera',
    subTitle: 'This will open a popup to edit the player camera',
    interfaceActionGroupId: INTERFACE_ACTION_CURRENT_PLAYER,
    onClick: () => (dispatch, gameModel, getState) => {
      const currentPlayerEntityId = getState().playerInterface.playerEntityModelId
      dispatch(openEntityBehaviorLiveEditor(LIVE_ENTITY_EDITOR_CAMERA_TAB_IID, currentPlayerEntityId))
    }
  },
}
