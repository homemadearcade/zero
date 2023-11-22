import { CAMERA_ZONE_INSTANCE_IVID, PLAYER_INSTANCE_DID } from "../../game/constants"
import { openBoundaryEditor, setResizingEntityInstance } from "../../store/actions/game/gameViewEditorActions"
import { EDIT_CURRENT_STAGE_BOUNDARIES_AID, RESIZE_CURRENT_PLAYER_AID, RESIZE_CURRENT_PLAYER_CAMERA_AID, RESIZE_INSTANCE_AID } from "../interfaceActionIds"
import { INTERFACE_ACTION_CURRENT_PLAYER, INTERFACE_ACTION_RESIZE, INTERFACE_ACTION_STAGE } from "../interfaceActionIdGroups"

// eslint-disable-next-line import/no-anonymous-default-export
export default  {
  // [RESIZE_INSTANCE_AID]: {
  //   arguments: ['entityInstanceId'],
  //   interfaceActionGroupId: RESIZE_INSTANCE_AID
  // },
  [RESIZE_CURRENT_PLAYER_AID]: {
    interfaceActionGroupId: INTERFACE_ACTION_CURRENT_PLAYER,
    title: 'Resize Current Player',
    subIcon: 'faUpRightAndDownLeftFromCenter',
    subTitle: 'This will immediately change the mouse action to resizing',
    onClick: () => (dispatch, gameModel) => {
      dispatch(setResizingEntityInstance(PLAYER_INSTANCE_DID))
    }
  },
  [EDIT_CURRENT_STAGE_BOUNDARIES_AID]: {
    title: 'Edit Stage Boundaries',
    subTitle: 'This will open a popup to edit the boundaries',
    subIcon: 'faUpRightAndDownLeftFromCenter',
    interfaceActionGroupId: INTERFACE_ACTION_STAGE,
    onClick: () => (dispatch) => {
      dispatch(openBoundaryEditor())
    },
    isActive: (state) => {
      return state.gameViewEditor.isBoundaryEditorOpen
    },
    isCommonlyUsed: true
  },
  [RESIZE_CURRENT_PLAYER_CAMERA_AID]: {
    interfaceActionGroupId: INTERFACE_ACTION_CURRENT_PLAYER,
    title: 'Resize Current Player Camera',
    subIcon: 'faUpRightAndDownLeftFromCenter',
    subTitle: 'This will immediately change the mouse action to resizing',
    onClick: () => (dispatch, gameModel) => {
      dispatch(setResizingEntityInstance(gameModel.importantValues[CAMERA_ZONE_INSTANCE_IVID].value))
    }
  },
}
