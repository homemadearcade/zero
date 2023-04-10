import React from "react";
import { DRAW_BRUSH_AID, DRAW_COLOR_AID, DRAW_NEW_BRUSH_AID, DRAW_NEW_SPRITE_FOR_CURRENT_PLAYER_AID, DRAW_NEW_COLOR_AID, DRAW_NEW_SPRITE_AID, DRAW_NEW_SPRITE_FOR_ENTITY_AID } from "../interfaceActionIds";
import { findColorNameByHex, getLayerIdFromColorId } from "../../utils";
import { INTERFACE_ACTION_DRAW } from "../interfaceActions";
import { openCreateBrushFlow, openCreateCanvasImageDialog, openCreateColorFlow } from "../../store/actions/game/gameFormEditorActions";
import { ZONE_ENTITY_IID } from "../interfaceIds";
import Texture from "../../game/textures/Texture/Texture";
import { selectBrush } from "../../store/actions/game/gameSelectorActions";
import { COLOR_BRUSH_ID } from "../../game/constants";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [DRAW_NEW_COLOR_AID]: {
    arguments: ['layerId'],
    title: 'Draw New Color',
    getSubtitle: ([layerId], gameModel) => {
      return gameModel.layers[layerId].name + ' Layer'
    },
    actionType: INTERFACE_ACTION_DRAW,
    onClick: ([layerId]) => (dispatch) => {
      // need to fix dialog for this, it will not show up right now
      dispatch(openCreateColorFlow('LayerColorSelect' + layerId, layerId))
    },
    higherPriority: true
  },
  [DRAW_NEW_BRUSH_AID]: {
    title: 'Draw New Brush',
    getSubtitle: ([layerId], gameModel) => {
      return gameModel.layers[layerId].name + ' Layer'
    },
    arguments: ['layerId'],
    actionType: INTERFACE_ACTION_DRAW,
    onClick: ([layerId]) => (dispatch) => {
      dispatch(openCreateBrushFlow(layerId))
    },
    higherPriority: true
  },
  [DRAW_BRUSH_AID]: {
    getTitle: ([brushId], gameModel) => {
      const brush = gameModel.brushes[brushId]
      return 'Draw Brush'
      // return <>
      //  {'Draw Brush '}
      //  <Texture tint={brush.textureTint} textureId={brush.textureId} />
      // </>
      // + gameModel.brushes[brushId].name
    },
    getSubtitle: ([brushId], gameModel) => {
      const layerId = gameModel.brushes[brushId].layerId
      const layer = gameModel.layers[layerId]
      return layer.name + ' Layer'
    },
    onClick: ([brushId]) => (dispatch, gameModel) => {
      const layerId = gameModel.brushes[brushId].layerId
      dispatch(selectBrush(brushId, layerId))
    },
    arguments: ['brushId'],
    icon: 'faPaintbrush',
    actionType: INTERFACE_ACTION_DRAW
  },
  [DRAW_COLOR_AID]: {
    getTitle: ([colorId, layerId], gameModel) => {
      return 'Draw ' + findColorNameByHex(colorId)
      // return <div style={{display: 'flex', gap: '.2em'}}>
      //  {'Draw '}{
      //  findColorNameByHex(colorId)}
      //  <Texture textureTint={colorId} />
      // </div>
    },
    onClick: ([colorId, layerId]) => (dispatch) => {
      dispatch(selectBrush(COLOR_BRUSH_ID + '/' + layerId + '/' + colorId, layerId))
    },
    getSubtitle: ([colorId, layerId], gameModel) => {
      const layer = gameModel.layers[layerId]
      return layer.name + ' Layer'
    },
    arguments: ['colorId'],
    icon: 'faPaintbrush',
    actionType: INTERFACE_ACTION_DRAW
  },
  // [DRAW_NEW_SPRITE_AID]: {
  //   title: 'Draw New Sprite',
  //   actionType: INTERFACE_ACTION_DRAW
  // },
  [DRAW_NEW_SPRITE_FOR_ENTITY_AID]: {
    title: 'Draw New Sprite',
    getSubtitle: ([entityModelId], gameModel) => {
      return gameModel.entityModels[entityModelId].name
    },
    isRemoved: ([entityModelId], gameModel) => {
      return gameModel.entityModels[entityModelId].entityIID === ZONE_ENTITY_IID
    },
    onClick: ([entityModelId]) => (dispatch, gameModel) => {
      const entityModel = gameModel.entityModels[entityModelId]
      dispatch(openCreateCanvasImageDialog(entityModel.graphics.textureId), 'InterfaceAction')
    },
    arguments: ['entityModelId'],
    actionType: INTERFACE_ACTION_DRAW
  },
  [DRAW_NEW_SPRITE_FOR_CURRENT_PLAYER_AID]: {
    title: 'Draw New Sprite For Current Player',
    actionType: INTERFACE_ACTION_DRAW,
    onClick: () => (dispatch, gameModel, getState) => {
      const currentPlayerEntityId = getState().playerInterface.playerEntityModelId
      const currentPlayerEntityModel = gameModel.entityModels[currentPlayerEntityId]
      dispatch(openCreateCanvasImageDialog(currentPlayerEntityModel.graphics.textureId, 'InterfaceAction'))
    },
    higherPriority: true
  }
}