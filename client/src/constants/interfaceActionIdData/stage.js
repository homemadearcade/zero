import { openStageLiveEditor } from "../../store/actions/game/gameSelectorActions"
import { INTERFACE_ACTION_STAGE } from "../interfaceActionIdGroups"
import { EDIT_CURRENT_STAGE_AID, EDIT_CURRENT_STAGE_BACKGROUND_COLOR_AID, EDIT_CURRENT_STAGE_PERSPECTIVE_AID } from "../interfaceActionIds"
import { LIVE_EDIT_STAGE_COLOR_TAB_IID, LIVE_EDIT_STAGE_PERSPECTIVE_TAB_IID } from "../interfaceIds"

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [EDIT_CURRENT_STAGE_BACKGROUND_COLOR_AID]: {
    title: 'Edit Stage Background Color',
    subTitle: 'This will open a popup to select the stage background color',
    interfaceActionGroupId: INTERFACE_ACTION_STAGE,
    onClick: () => (dispatch) => {
      dispatch(openStageLiveEditor(LIVE_EDIT_STAGE_COLOR_TAB_IID))
    }
  },
  [EDIT_CURRENT_STAGE_PERSPECTIVE_AID]: {
    title: 'Edit Stage Perspective',
    subTitle: 'This will open a popup to select the stage perspective',
    interfaceActionGroupId: INTERFACE_ACTION_STAGE,
    onClick: () => (dispatch) => {
      dispatch(openStageLiveEditor(LIVE_EDIT_STAGE_PERSPECTIVE_TAB_IID))
    }
  },
  [EDIT_CURRENT_STAGE_AID]: {
    title: 'Edit Stage',
    subTitle: 'This will open a popup to edit the current stage',
    interfaceActionGroupId: INTERFACE_ACTION_STAGE,
    onClick: () => (dispatch, gameModel, getState) => {
      dispatch(openStageLiveEditor())
    }
  },
}