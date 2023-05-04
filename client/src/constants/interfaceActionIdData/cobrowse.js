import { toggleActiveCobrowsing } from "../../store/actions/game/cobrowsingActions";
import { INTERFACE_ACTION_COBROWSE } from "../interfaceActionIdGroups";
import { COBROWSE_ACTIVE_TOGGLE_AID } from "../interfaceActionIds";
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [COBROWSE_ACTIVE_TOGGLE_AID]: {
    title: 'Cobrowsing active Toggle',
    icon: 'faExclamation',
    interfaceActionGroupId: INTERFACE_ACTION_COBROWSE,
    onClick: () => (dispatch) => {
      dispatch(toggleActiveCobrowsing())
    }
  }
}
