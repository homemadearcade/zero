import React from "react";
import { DRAW_BRUSH_AID, DRAW_COLOR_AID, DRAW_NEW_BRUSH_AID,
    DRAW_NEW_COLOR_AID, 
   DRAW_NEW_SPRITE_AID
   } from "../interfaceActionIds";
import { findColorNameByHex, getLayerIdFromColorId } from "../../utils";
import { INTERFACE_ACTION_DRAW } from "../interfaceActionIdGroups";
import { openCreateBrushFlow, openCreateCanvasImageDialog, openCreateColorFlow } from "../../store/actions/game/gameFormEditorActions";
import { LAYER_CREATE_COLOR_DIALOG_IID, ZONE_ENTITY_IID } from "../interfaceIds";
import Texture from "../../game/textures/Texture/Texture";
import { selectBrush } from "../../store/actions/game/gameSelectorActions";
import { COLOR_BRUSH_ID } from "../../game/constants";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [DRAW_NEW_COLOR_AID]: {
    arguments: ['layerId'],
    title: 'Draw New Color',
    subIcon: 'faPlus',
    getSubtitle: ([layerId], gameModel) => {
      return gameModel.layers[layerId].name + ' Layer'
    },
    interfaceActionGroupId: INTERFACE_ACTION_DRAW,
    onClick: ([layerId]) => (dispatch) => {
      dispatch(openCreateColorFlow(LAYER_CREATE_COLOR_DIALOG_IID, layerId))
    },
    higherPriority: true
  },
  [DRAW_NEW_BRUSH_AID]: {
    title: 'Draw New Brush',
    subIcon: 'faPlus',
    getSubtitle: ([layerId], gameModel) => {
      return gameModel.layers[layerId].name + ' Layer'
    },
    arguments: ['layerId'],
    interfaceActionGroupId: INTERFACE_ACTION_DRAW,
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
    // isActive: (store) => {
    //   return store.gameSelector.brushIdSelectedBrushList 
    // },
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
    interfaceActionGroupId: INTERFACE_ACTION_DRAW
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
    interfaceActionGroupId: INTERFACE_ACTION_DRAW
  },
}