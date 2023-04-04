import { CHANGE_SELECTOR_TABS_IID, HOVER_PREVIEW_IID, LAYER_VISIBILITY_IID, SELECTOR_MORE_IID, TOGGLE_ALL_PARAMS_IID } from "../interfaceIds/selectorInterfaceIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [LAYER_VISIBILITY_IID]: {
    previewText: 'Hide/Show on Map',
  },
  [TOGGLE_ALL_PARAMS_IID]: {
    adminOnly: true
  },
  [HOVER_PREVIEW_IID]: {
    name: 'Hover Preview'
  },
  [CHANGE_SELECTOR_TABS_IID]: {},
  [SELECTOR_MORE_IID]: {},
}