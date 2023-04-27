import { openCreateStageDialog, openEditEntityDialog, openEditEntityGraphics } from "../../store/actions/game/gameFormEditorActions";
import { openGameEditDialog, openEntityBehaviorLiveEditor, openSelectStageColorDialog, openStageLiveEditor } from "../../store/actions/game/gameSelectorActions";
import { openBoundaryEditor } from "../../store/actions/game/gameViewEditorActions";
import { EDIT_CURRENT_PLAYER_CAMERA_AID, EDIT_CURRENT_STAGE_AID, EDIT_CURRENT_STAGE_BACKGROUND_COLOR_AID, EDIT_CURRENT_STAGE_BOUNDARIES_AID, EDIT_ENTITY_AID, EDIT_ENTITY_GRAPHICS_AID, EDIT_GAME_METADATA_AID } from "../interfaceActionIds/edit";
import { INTERFACE_ACTION_EDIT } from "../interfaceActions";
import { CAMERA_EDITOR_IID, EDIT_ENTITY_GRAPHICS_PRIMARY_DIALOG_IID, EDIT_GAME_METADATA_TAB_IID, EDIT_STAGE_COLOR_TAB_IID, LIVE_ENTITY_EDITOR_CAMERA_TAB_IID, ZONE_ENTITY_IID } from "../interfaceIds";

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
    onClick: ([entityModelId]) => (dispatch, gameModel) => {
      const entityModel = gameModel.entityModels[entityModelId]
      dispatch(openEditEntityDialog(entityModel))
    },
    arguments: ['entityModelId'],
    actionType: INTERFACE_ACTION_EDIT
  },
  [EDIT_CURRENT_STAGE_BACKGROUND_COLOR_AID]: {
    title: 'Edit Background Color',
    subTitle: 'This will open a popup to select the background color',
    actionType: INTERFACE_ACTION_EDIT,
    onClick: () => (dispatch) => {
      dispatch(openStageLiveEditor(EDIT_STAGE_COLOR_TAB_IID))
    }
  },
  [EDIT_GAME_METADATA_AID]: {
    title: 'Edit Game Metadata',
    subTitle: 'This will open a popup to edit the game metadata',
    actionType: INTERFACE_ACTION_EDIT,
    onClick: () => (dispatch) => {
      dispatch(openGameEditDialog(EDIT_GAME_METADATA_TAB_IID))
    }
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
    onClick: ([entityModelId]) => (dispatch, gameModel) => {
      const entityModel = gameModel.entityModels[entityModelId]
      dispatch(openEditEntityGraphics(EDIT_ENTITY_GRAPHICS_PRIMARY_DIALOG_IID, entityModel))
    },
    actionType: INTERFACE_ACTION_EDIT,
    arguments: ['entityModelId']
  },
  [EDIT_CURRENT_STAGE_BOUNDARIES_AID]: {
    title: 'Edit Boundaries',
    subTitle: 'This will open a popup to edit the boundaries',
    actionType: INTERFACE_ACTION_EDIT,
    onClick: () => (dispatch) => {
      dispatch(openBoundaryEditor())
    }
  },
  [EDIT_CURRENT_STAGE_AID]: {
    title: 'Edit Stage',
    subTitle: 'This will open a popup to edit the current stage',
    actionType: INTERFACE_ACTION_EDIT,
    onClick: () => (dispatch, gameModel, getState) => {
      const currentStageId = getState().gameModel.currentStageId
      const currentStage = gameModel.stages[currentStageId]
      dispatch(openCreateStageDialog(currentStage))
    }
  },
  [EDIT_CURRENT_PLAYER_CAMERA_AID]: {
    title: 'Edit Current Player Camera',
    subTitle: 'This will open a popup to edit the player camera',
    actionType: INTERFACE_ACTION_EDIT,
    onClick: () => (dispatch, gameModel, getState) => {
      const currentPlayerEntityId = getState().playerInterface.playerEntityModelId
      dispatch(openEntityBehaviorLiveEditor(LIVE_ENTITY_EDITOR_CAMERA_TAB_IID, currentPlayerEntityId))
    }
  }
}
