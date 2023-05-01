import { GAME_VIEW_IGID } from "../interfaceIdGroups";
import { GAME_OPEN_SNAPSHOT_IID, GAME_VIEW_IID, GRID_VIEW_TOGGLE_IID, GAME_VIEW_INSTANCE_VISIBILITY_IID } from "../interfaceIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [GAME_VIEW_INSTANCE_VISIBILITY_IID]: {
    previewText: 'Hide/Show on Map',
    name: 'Show/Hide Button',
    leftClickAction: 'Toggle',
    leftClickIcon: 'faEye',
    interfaceGroupId: GAME_VIEW_IGID
  },
  [GAME_VIEW_IID]: {
    name: 'Game View Cover',
    displayText: 'Game View',
    interfaceGroupId: GAME_VIEW_IGID
  },
  [GRID_VIEW_TOGGLE_IID]: {
    name: 'Grid View Toggle',
    previewText: 'Grid View',
    leftClickAction: 'Toggle',
    leftClickIcon: 'faTableCells',
    interfaceGroupId: GAME_VIEW_IGID
  },
  [GAME_OPEN_SNAPSHOT_IID]: {},
}
