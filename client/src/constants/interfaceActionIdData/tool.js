import { selectCobrowsingTool } from "../../store/actions/game/cobrowsingActions"
import { INTERFACE_ACTION_COBROWSE, INTERFACE_ACTION_TOOL } from "../interfaceActionIdGroups"
import { COBROWSE_CLICK_TOOL_AID, COBROWSE_UNLOCK_TOOL_AID, COBROWSE_WIGGLE_TOOL_AID } from "../interfaceActionIds"

  
// eslint-disable-next-line import/no-anonymous-default-export
export default  {
  [COBROWSE_CLICK_TOOL_AID]: {
    title: 'Cobrowsing Click Tool',
    icon: 'faBullseye',
    activeCobrowsingRequired: true,
    interfaceActionGroupId: INTERFACE_ACTION_TOOL,
    onClick: () => (dispatch) => {
      dispatch(selectCobrowsingTool(COBROWSE_CLICK_TOOL_AID))
    },
    isActive: (state) => {
      return state.cobrowsing.selectedTool === COBROWSE_CLICK_TOOL_AID
    } 
  },
  [COBROWSE_UNLOCK_TOOL_AID]: {
    title: 'Cobrowsing Unlock Tool',
    icon: 'faLockOpen',
    activeCobrowsingRequired: true,
    interfaceActionGroupId: INTERFACE_ACTION_TOOL,
    onClick: () => (dispatch) => {
      dispatch(selectCobrowsingTool(COBROWSE_UNLOCK_TOOL_AID))
    },
    isActive: (state) => {
      return state.cobrowsing.selectedTool === COBROWSE_UNLOCK_TOOL_AID
    }
  },
  [COBROWSE_WIGGLE_TOOL_AID]: {
    title: 'Cobrowsing Wiggle Tool',
    icon: 'faExclamation',
    activeCobrowsingRequired: true,
    interfaceActionGroupId: INTERFACE_ACTION_TOOL,
    onClick: () => (dispatch) => {
      dispatch(selectCobrowsingTool(COBROWSE_WIGGLE_TOOL_AID))
    },
    isActive: (state) => {
      return state.cobrowsing.selectedTool === COBROWSE_WIGGLE_TOOL_AID
    }
  },
}