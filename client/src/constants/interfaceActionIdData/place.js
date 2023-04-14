import _ from "lodash";
import { defaultBasicEntity, defaultEntity, defaultNpcEntity, defaultPlayerEntity, defaultZoneEntity } from "../../game/constants";
import { openEditEntityGraphics } from "../../store/actions/game/gameFormEditorActions";
import { selectEntity } from "../../store/actions/game/gameSelectorActions";
import { PLACE_BASIC_ENTITY_AID, PLACE_ENTITY_AID, PLACE_NPC_ENTITY_AID, PLACE_PLAYER_ENTITY_AID, PLACE_ZONE_ENTITY_AID } from "../interfaceActionIds/place";
import { INTERFACE_ACTION_PLACE } from "../interfaceActions";
import { EDIT_ENTITY_GRAPHICS_PRIMARY_DIALOG_IID, ENTITY_BOX_DIALOG_IID } from "../interfaceIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [PLACE_ENTITY_AID]: {
    arguments: ['entityModelId'],
    getTitle: ([entityModelId], gameModel) => {
      return 'Place ' + gameModel.entityModels[entityModelId].name
    },
    getSubtitle: ([entityModelId], gameModel) => {
      return gameModel.entityModels[entityModelId].name
    },
    isRemoved: ([entityModelId], gameModel) => {
      return gameModel.entityModels[entityModelId].editorInterface.hiddenFromIDs[PLACE_ENTITY_AID]
    },
    actionType: INTERFACE_ACTION_PLACE,
    onClick: ([entityModelId]) => (dispatch, gameModel) => {
      dispatch(selectEntity(entityModelId))
    }
  },
  [PLACE_PLAYER_ENTITY_AID]: {
    title: 'Place New Player',
    subTitle: 'This will open a window to create a new Player',
    higherPriority: true,
    actionType: INTERFACE_ACTION_PLACE,
    onClick: () => (dispatch, gameModel) => {
      dispatch(openEditEntityGraphics(EDIT_ENTITY_GRAPHICS_PRIMARY_DIALOG_IID, _.cloneDeep(defaultPlayerEntity)))
    }
  },
  [PLACE_NPC_ENTITY_AID]: {
    title: 'Place New NPC',
    subTitle: 'This will open a window to create a new NPC',
    higherPriority: true,
    actionType: INTERFACE_ACTION_PLACE,
    onClick: () => (dispatch, gameModel) => {
      dispatch(openEditEntityGraphics(EDIT_ENTITY_GRAPHICS_PRIMARY_DIALOG_IID, _.cloneDeep(defaultNpcEntity)))
    }
  },
  [PLACE_ZONE_ENTITY_AID]: {
    title: 'Place New Zone',
    subTitle: 'This will open a window to create a new Zone',
    higherPriority: true,
    actionType: INTERFACE_ACTION_PLACE,
    onClick: () => (dispatch, gameModel) => {
      dispatch(openEditEntityGraphics(EDIT_ENTITY_GRAPHICS_PRIMARY_DIALOG_IID, _.cloneDeep(defaultZoneEntity)))
    }
  },
  [PLACE_BASIC_ENTITY_AID]: {
    title: 'Place New Object',
    subTitle: 'This will open a window to create a new Object',
    higherPriority: true,
    actionType: INTERFACE_ACTION_PLACE,
    onClick: () => (dispatch, gameModel) => {
      dispatch(openEditEntityGraphics(EDIT_ENTITY_GRAPHICS_PRIMARY_DIALOG_IID, _.cloneDeep(defaultBasicEntity)))
    }
  },
}