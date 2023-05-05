import { toggleGridView } from "../../store/actions/game/gameViewEditorActions"
import { TOGGLE_GRID_VIEW_AID, TURN_OFF_GRID_VIEW_AID, TURN_ON_GRID_VIEW_AID } from "../interfaceActionIds"
import { INTERFACE_ACTION_GRID } from "../interfaceActionIdGroups"

// eslint-disable-next-line import/no-anonymous-default-export
export default  {
  [TURN_ON_GRID_VIEW_AID]: {
    title: 'Turn On Grid View',
    subTitle: 'This will turn on the grid view',
    interfaceActionGroupId: INTERFACE_ACTION_GRID,
    onClick: () => (dispatch, gameModel) => {
      dispatch(toggleGridView(true))
    }
  },
  [TURN_OFF_GRID_VIEW_AID]: {
    title: 'Turn Off Grid View',
    subTitle: 'This will turn off the grid view',
    interfaceActionGroupId: INTERFACE_ACTION_GRID,
    onClick: () => (dispatch, gameModel) => {
      dispatch(toggleGridView(false))
    }
  },
  [TOGGLE_GRID_VIEW_AID]: {
    title: 'Toggle Grid View',
    subTitle: 'This will toggle the grid view',
    isCommonlyUsed: true,
    isActive: (store) => {
      return store.gameViewEditor.isGridViewOn
    },
    interfaceActionGroupId: INTERFACE_ACTION_GRID,
    onClick: () => (dispatch, gameModel) => {
      dispatch(toggleGridView())
    }
  }
}