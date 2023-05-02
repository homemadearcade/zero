import { initialCameraZoneInstanceId, PLAYER_INSTANCE_DID } from "../../game/constants"
import { openBoundaryEditor, setResizingEntityInstance } from "../../store/actions/game/gameViewEditorActions"
import { EDIT_CURRENT_STAGE_BOUNDARIES_AID, RESIZE_CURRENT_PLAYER_AID, RESIZE_CURRENT_PLAYER_CAMERA_AID, RESIZE_INSTANCE_AID } from "../interfaceActionIds"
import { INTERFACE_ACTION_RESIZE } from "../interfaceActionIdGroups"

// eslint-disable-next-line import/no-anonymous-default-export
export default  {
  // [RESIZE_INSTANCE_AID]: {
  //   arguments: ['entityInstanceId'],
  //   interfaceActionGroupId: RESIZE_INSTANCE_AID
  // },
  [RESIZE_CURRENT_PLAYER_AID]: {
    interfaceActionGroupId: INTERFACE_ACTION_RESIZE,
    title: 'Resize Current Player',
    subTitle: 'This will immediately change the mouse action to resizing',
    onClick: () => (dispatch, gameModel) => {
      dispatch(setResizingEntityInstance(PLAYER_INSTANCE_DID))
    }
  },
  [EDIT_CURRENT_STAGE_BOUNDARIES_AID]: {
    title: 'Edit Boundaries',
    subTitle: 'This will open a popup to edit the boundaries',
    interfaceActionGroupId: INTERFACE_ACTION_RESIZE,
    onClick: () => (dispatch) => {
      dispatch(openBoundaryEditor())
    },
    isActive: (state) => {
      return state.gameViewEditor.isBoundaryEditorOpen
    }
  },
  [RESIZE_CURRENT_PLAYER_CAMERA_AID]: {
    interfaceActionGroupId: INTERFACE_ACTION_RESIZE,
    title: 'Resize Current Player Camera',
    subTitle: 'This will immediately change the mouse action to resizing',
    onClick: () => (dispatch, gameModel) => {
      dispatch(setResizingEntityInstance(initialCameraZoneInstanceId))
    }
  },
}
