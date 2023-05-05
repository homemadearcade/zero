import { selectCobrowsingTool, toggleActiveCobrowsing } from "../../store/actions/game/cobrowsingActions";
import { INTERFACE_ACTION_COBROWSE } from "../interfaceActionIdGroups";
import { COBROWSE_ACTIVE_TOGGLE_AID, COBROWSE_CLICK_TOOL_AID, COBROWSE_UNLOCK_TOOL_AID } from "../interfaceActionIds";
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [COBROWSE_ACTIVE_TOGGLE_AID]: {
    title: 'Cobrowsing active Toggle',
    subscribedCobrowsingRequired: true,
    interfaceActionGroupId: INTERFACE_ACTION_COBROWSE,
    onClick: () => (dispatch) => {
      dispatch(toggleActiveCobrowsing())
    },
    isActive: (state) => {
      return state.cobrowsing.isActivelyCobrowsing
    }
  },
  [COBROWSE_CLICK_TOOL_AID]: {
    title: 'Cobrowsing Click Tool',
    icon: 'faBullseye',
    activeCobrowsingRequired: true,
    interfaceActionGroupId: INTERFACE_ACTION_COBROWSE,
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
    interfaceActionGroupId: INTERFACE_ACTION_COBROWSE,
    onClick: () => (dispatch) => {
      dispatch(selectCobrowsingTool(COBROWSE_UNLOCK_TOOL_AID))
    },
    isActive: (state) => {
      return state.cobrowsing.selectedTool === COBROWSE_UNLOCK_TOOL_AID
    }
  },
}
