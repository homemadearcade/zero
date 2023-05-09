import { openCreateCanvasImageDialog, openEditEntityGraphics } from "../../store/actions/game/gameFormEditorActions";
import { EDIT_CURRENT_PLAYER_GRAPHICS_AID, EDIT_ENTITY_GRAPHICS_AID } from "../interfaceActionIds";
import { INTERFACE_ACTION_CURRENT_PLAYER, INTERFACE_ACTION_SPRITE } from "../interfaceActionIdGroups";
import { EDIT_ENTITY_GRAPHICS_PRIMARY_DIALOG_IID, 
  ZONE_ENTITY_IID } from "../interfaceIds";
import { DRAW_NEW_SPRITE_FOR_CURRENT_PLAYER_AID, DRAW_NEW_SPRITE_FOR_ENTITY_AID } from "../interfaceActionIds";
import store from "../../store";

 // eslint-disable-next-line import/no-anonymous-default-export
export default {
  [EDIT_ENTITY_GRAPHICS_AID]: {
    getTitle([entityModelId], gameModel) {
      return 'Edit Sprite for ' + gameModel.entityModels[entityModelId].name
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
    interfaceActionGroupId: INTERFACE_ACTION_SPRITE,
    arguments: ['entityModelId']
  },
  [EDIT_CURRENT_PLAYER_GRAPHICS_AID]: {
    title: 'Edit Current Player Graphics',
    subTitle: 'This will open a popup to edit the player graphics',
    interfaceActionGroupId: INTERFACE_ACTION_CURRENT_PLAYER,
    onClick: () => (dispatch, gameModel, getState) => {
      const currentPlayerEntityId = getState().playerInterface.playerEntityModelId
      const currentPlayerEntityModel = gameModel.entityModels[currentPlayerEntityId]
      dispatch(openEditEntityGraphics(EDIT_ENTITY_GRAPHICS_PRIMARY_DIALOG_IID, currentPlayerEntityModel))
    }
  },
  [DRAW_NEW_SPRITE_FOR_ENTITY_AID]: {
    title: 'Draw New Sprite',
    subIcon: 'faPaintbrush',
    getSubtitle: ([entityModelId], gameModel) => {
      return gameModel.entityModels[entityModelId].name
    },
    isRemoved: ([entityModelId], gameModel) => {
      return gameModel.entityModels[entityModelId].entityIID === ZONE_ENTITY_IID
    },
    onClick: ([entityModelId]) => (dispatch, gameModel) => {
      const entityModel = gameModel.entityModels[entityModelId]
      const graphics = entityModel.graphics
      dispatch(openCreateCanvasImageDialog(entityModelId, graphics.textureId, graphics.textureTint))
    },
    arguments: ['entityModelId'],
    interfaceActionGroupId: INTERFACE_ACTION_SPRITE
  },
  [DRAW_NEW_SPRITE_FOR_CURRENT_PLAYER_AID]: {
    title: 'Draw New Sprite For Current Player',
    subIcon: 'faPaintbrush',
    interfaceActionGroupId: INTERFACE_ACTION_CURRENT_PLAYER,
    onClick: () => (dispatch, gameModel, getState) => {
      const currentPlayerEntityId = getState().playerInterface.playerEntityModelId
      const currentPlayerEntityModel = gameModel.entityModels[currentPlayerEntityId]
      const graphics = currentPlayerEntityModel.graphics
      store.dispatch(openCreateCanvasImageDialog(currentPlayerEntityId, graphics.textureId, graphics.textureTint))
    },
    higherPriority: true
  }
}
