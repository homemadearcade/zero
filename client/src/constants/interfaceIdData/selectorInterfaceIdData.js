import {  GAME_SELECTOR_IGID } from "../interfaceIdGroups";
import { CHANGE_SELECTOR_TABS_IID, HOVER_PREVIEW_IID, SELECTOR_MORE_IID, TOGGLE_ALL_PARAMS_IID } from "../interfaceIds/selectorInterfaceIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [TOGGLE_ALL_PARAMS_IID]: {
    adminOnly: true
  },
  [HOVER_PREVIEW_IID]: {
    name: 'Hover Preview Area',
  
    interfaceGroupId: GAME_SELECTOR_IGID
  },
  [CHANGE_SELECTOR_TABS_IID]: {},
  [SELECTOR_MORE_IID]: {},
}