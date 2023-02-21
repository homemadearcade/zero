import { DIALOGUE_ADD_IID, DIALOGUE_CONTAINER_IID, DIALOGUE_SELECT_IID, DIALOGUE_SHORTCUT_IID } from "../interfaceIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [DIALOGUE_CONTAINER_IID]: {
    ignoreTools: true
  },
  [DIALOGUE_ADD_IID]: {
    previewText: 'Add Dialogue'
  },
  [DIALOGUE_SELECT_IID]: {},
  [DIALOGUE_SHORTCUT_IID]: {
    adminOnly: true
  }
}