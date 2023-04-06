import { openCreateBrushFlow } from "../../store/actions/game/gameFormEditorActions";
import { ADD_BASIC_ENTITY_AID, ADD_BRUSH_AID, ADD_COLOR_AID, ADD_NPC_ENTITY_AID, ADD_PLAYER_ENTITY_AID, ADD_ZONE_ENTITY_AID} from "../interfaceActionIds/add";
import { INTERFACE_ACTION_ADD } from "../interfaceActions";

 // eslint-disable-next-line import/no-anonymous-default-export
export default {
 [ADD_COLOR_AID]: {
    arguments: ['layerId'],
    name: 'Open Add Color',
    actionType: INTERFACE_ACTION_ADD,
  },
  [ADD_BRUSH_AID]: {
    arguments: ['layerId'],
    name: 'Open Add Brush',
    actionType: INTERFACE_ACTION_ADD,
     onClick: (layerId) => (gameModel, dispatch) => {
      dispatch(openCreateBrushFlow(layerId))
    }
  },
  [ADD_PLAYER_ENTITY_AID]: {
    name: 'Open Add Player',
    actionType: INTERFACE_ACTION_ADD,
  },
  [ADD_NPC_ENTITY_AID]: {
    name: 'Open Add NPC',
    actionType: INTERFACE_ACTION_ADD,
  },
  [ADD_ZONE_ENTITY_AID]: {
    name: 'Open Add Zone',
    actionType: INTERFACE_ACTION_ADD,
  },
  [ADD_BASIC_ENTITY_AID]: {
    name: 'Open Add Object',
    actionType: INTERFACE_ACTION_ADD,
  },
}