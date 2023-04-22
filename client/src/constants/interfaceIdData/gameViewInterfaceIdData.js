import { GAME_VIEW_IGID } from "../interfaceIdGroups";
import { GAME_OPEN_SNAPSHOT_IID, GRID_VIEW_TOGGLE_IID, GAME_VIEW_INSTANCE_VISIBILITY_IID } from "../interfaceIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [GAME_VIEW_INSTANCE_VISIBILITY_IID]: {
    previewText: 'Hide/Show on Map',
    name: 'Show/Hide Button',
    interfaceGroupId: GAME_VIEW_IGID
  },
  [GRID_VIEW_TOGGLE_IID]: {
    name: 'Grid View Toggle',
    previewText: 'Toggle Grids on Map',
    interfaceGroupId: GAME_VIEW_IGID
  },
  [GAME_OPEN_SNAPSHOT_IID]: {},
}
