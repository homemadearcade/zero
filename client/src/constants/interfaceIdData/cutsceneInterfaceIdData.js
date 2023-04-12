import { CUTSCENE_IGID, DIALOGUE_IGID } from "../interfaceIdGroups";
import { DIALOGUE_ADD_IID, DIALOGUE_CONTAINER_IID, DIALOGUE_SELECT_IID, DIALOGUE_SHORTCUT_IID } from "../interfaceIds";
import { CUTSCENE_ADD_IID, CUTSCENE_CONTAINER_IID, CUTSCENE_SELECT_IID } from "../interfaceIds/cutsceneInterfaceIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [DIALOGUE_CONTAINER_IID]: {
    // ignoreTools: true
    name: 'Dialogue Container',
    interfaceGroupId: DIALOGUE_IGID
  },
  [DIALOGUE_ADD_IID]: {
    previewText: 'Add Dialogue',
    name: 'Add Dialogue Button',
    interfaceGroupId: DIALOGUE_IGID
  },
  [DIALOGUE_SELECT_IID]: {},
  [DIALOGUE_SHORTCUT_IID]: {
    adminOnly: true
  },
  [CUTSCENE_CONTAINER_IID]: {
    name: 'Cutscene Container',
    interfaceGroupId: CUTSCENE_IGID

    // ignoreTools: true
  },
  [CUTSCENE_ADD_IID]: {
    name: 'Add Cutscene Button',
    previewText: 'Add Cutscene',
    interfaceGroupId: CUTSCENE_IGID
  },
  [CUTSCENE_SELECT_IID]: {},
}