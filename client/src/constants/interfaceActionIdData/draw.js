import { DRAW_BRUSH_AID, DRAW_COLOR_AID, DRAW_NEW_BRUSH_AID, DRAW_NEW_COLOR_AID, DRAW_NEW_SPRITE_AID, DRAW_NEW_SPRITE_FOR_ENTITY_AID } from "../interfaceActionIds";
import { findColorNameByHex, getLayerIdFromColorId } from "../../utils";
import { INTERFACE_ACTION_DRAW } from "../interfaceActions";
import { openCreateBrushFlow, openCreateColorFlow } from "../../store/actions/game/gameFormEditorActions";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [DRAW_NEW_COLOR_AID]: {
    arguments: ['layerId'],
    getName: ([stageId, layerId], gameModel) => {
      return 'Draw new Color on ' + gameModel.stages[stageId].layers[layerId].name + ' Layer'
    },
    actionType: INTERFACE_ACTION_DRAW,
    onClick: (layerId) => (dispatch) => {
      // need to fix dialog for this, it will not show up right now
      dispatch(openCreateColorFlow('LayerColorSelect' + layerId))
    },
    higherPriority: true
  },
  [DRAW_NEW_BRUSH_AID]: {
    getName: ([stageId, layerId], gameModel) => {
      return 'Draw new Brush on ' + gameModel.stages[stageId].layers[layerId].name + ' Layer'
    },
    arguments: ['layerId'],
    actionType: INTERFACE_ACTION_DRAW,
    onClick: (layerId) => (dispatch) => {
      dispatch(openCreateBrushFlow(layerId))
    },
    higherPriority: true
  },
  [DRAW_BRUSH_AID]: {
    getName: ([brushId], gameModel) => {
      const layerId = gameModel.brushes[brushId]
      const layer = gameModel.stages[gameModel.currentStageId].layers[layerId]
      return 'Draw ' + gameModel.brushes[brushId].name + ' on ' + layer.name + ' Layer'
    },
    arguments: ['brushId'],
    icon: 'faPaintbrush',
    actionType: INTERFACE_ACTION_DRAW
  },
  [DRAW_COLOR_AID]: {
    getName: ([colorId, layerId], gameModel) => {
      // const layerId = getLayerIdFromColorId(colorId)
      
      // const layer = gameModel.stages[gameModel.currentStageId].layers[layerId]
      return 'Draw ' + findColorNameByHex(colorId) + ' on ' + layerId
    },
    arguments: ['colorId'],
    icon: 'faPaintbrush',
    actionType: INTERFACE_ACTION_DRAW
  },
  [DRAW_NEW_SPRITE_AID]: {
    name: 'Draw New Sprite',
    actionType: INTERFACE_ACTION_DRAW
  },
  [DRAW_NEW_SPRITE_FOR_ENTITY_AID]: {
    getName: ([entityModelId], gameModel) => {
      return 'Draw New Sprite for ' + gameModel.entityModels[entityModelId].name
    },
    arguments: ['entityModelId'],
    actionType: INTERFACE_ACTION_DRAW
  }
}