import { DIALOGUE_ADD_IID, DIALOGUE_CONTAINER_IID, DIALOGUE_SELECT_IID, DIALOGUE_SHORTCUT_IID } from "../interfaceIds";
import { CUTSCENE_ADD_IID, CUTSCENE_CONTAINER_IID, CUTSCENE_SELECT_IID } from "../interfaceIds/cutsceneInterfaceIds";

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
  },
  // [DIALOGUE_MORE_IID]: {

  // },
  [CUTSCENE_CONTAINER_IID]: {
    ignoreTools: true
  },
  [CUTSCENE_ADD_IID]: {
    previewText: 'Add Cutscene'
  },
  [CUTSCENE_SELECT_IID]: {},
  // [CUTSCENE_MORE_IID]: {},
}