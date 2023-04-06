import { DRAW_BRUSH_AID, DRAW_COLOR_AID, DRAW_NEW_BRUSH_AID, DRAW_NEW_COLOR_AID, DRAW_NEW_SPRITE_AID } from "../interfaceActionIds";
import { findColorNameByHex } from "../../utils";
import { INTERFACE_ACTION_DRAW } from "../interfaceActions";
import { openCreateBrushFlow, openCreateColorFlow } from "../../store/actions/game/gameFormEditorActions";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [DRAW_NEW_COLOR_AID]: {
    arguments: ['layerId'],
    name: 'Draw new Color',
    actionType: INTERFACE_ACTION_DRAW,
    onClick: (layerId) => (gameModel, dispatch) => {
      dispatch(openCreateColorFlow(layerId))
    },
    higherPriority: true
  },
  [DRAW_NEW_BRUSH_AID]: {
    arguments: ['layerId'],
    name: 'Draw new Brush',
    actionType: INTERFACE_ACTION_DRAW,
    onClick: (layerId) => (gameModel, dispatch) => {
      dispatch(openCreateBrushFlow(layerId))
    },
    higherPriority: true
  },
  [DRAW_BRUSH_AID]: {
    getName: (gameModel, [brushId]) => {
      return 'Draw ' + gameModel.brushes[brushId].name
    },
    arguments: ['brushId'],
    icon: 'faPaintbrush',
    actionType: INTERFACE_ACTION_DRAW
  },
  [DRAW_COLOR_AID]: {
    getName: (gameModel, [colorId]) => {
      return 'Draw ' + findColorNameByHex(colorId)
    },
    arguments: ['colorId'],
    icon: 'faPaintbrush',
    actionType: INTERFACE_ACTION_DRAW
  },
  [DRAW_NEW_SPRITE_AID]: {
    name: 'Draw New Sprite',
    actionType: INTERFACE_ACTION_DRAW
  }
}