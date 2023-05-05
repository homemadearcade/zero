import {  GAME_SELECTOR_IGID } from "../interfaceIdGroups";
import { CHANGE_SELECTOR_TABS_IID, GAME_OPEN_EDIT_IID, GAME_VIEW_INSTANCE_VISIBILITY_IID, HOVER_PREVIEW_IID, SELECTOR_MORE_IID, TOGGLE_ALL_PARAMS_IID } from "../interfaceIds/selectorInterfaceIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [TOGGLE_ALL_PARAMS_IID]: {
    appAdminOnly: true
  },
  [GAME_VIEW_INSTANCE_VISIBILITY_IID]: {
    previewText: 'Hide/Show on Map',
    name: 'Show/Hide Button',
    leftClickAction: 'Toggle',
    leftClickIcon: 'faEye',
    interfaceGroupId: GAME_SELECTOR_IGID
  },
  [GAME_OPEN_EDIT_IID]: {
    name: 'Edit Game Button',
    interfaceGroupId: GAME_SELECTOR_IGID
  },
  [HOVER_PREVIEW_IID]: {
    name: 'Hover Preview Area',
    interfaceGroupId: GAME_SELECTOR_IGID
  },
  [SELECTOR_MORE_IID]: {},
}