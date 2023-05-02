import { initialCameraZoneInstanceId, PLAYER_INSTANCE_DID } from "../../game/constants"
import { setResizingEntityInstance } from "../../store/actions/game/gameViewEditorActions"
import { RESIZE_CURRENT_PLAYER_AID, RESIZE_CURRENT_PLAYER_CAMERA_AID, RESIZE_INSTANCE_AID } from "../interfaceActionIds"
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
  [RESIZE_CURRENT_PLAYER_CAMERA_AID]: {
    interfaceActionGroupId: INTERFACE_ACTION_RESIZE,
    title: 'Resize Current Player Camera',
    subTitle: 'This will immediately change the mouse action to resizing',
    onClick: () => (dispatch, gameModel) => {
      dispatch(setResizingEntityInstance(initialCameraZoneInstanceId))
    }
  },
}
