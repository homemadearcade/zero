import { CUTSCENE_IGID, SCRIPT_IGID } from "../interfaceIdGroups";
import { SCRIPT_ADD_IID, SCRIPT_CONTAINER_IID, SCRIPT_SELECT_IID, SCRIPT_SHORTCUT_IID } from "../interfaceIds";
import { CUTSCENE_ADD_IID, CUTSCENE_CONTAINER_IID, CUTSCENE_SELECT_IID } from "../interfaceIds/cutsceneInterfaceIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [SCRIPT_CONTAINER_IID]: {
    // ignoreTools: true
    name: 'Script Container',
    interfaceGroupId: SCRIPT_IGID
  },
  [SCRIPT_ADD_IID]: {
    // previewText: 'Add Script',
    name: 'Add Script Button',
    interfaceGroupId: SCRIPT_IGID
  },
  [SCRIPT_SELECT_IID]: {},
  [SCRIPT_SHORTCUT_IID]: {
    appAdminOnly: true
  },
  [CUTSCENE_CONTAINER_IID]: {
    name: 'Cutscene Container',
    interfaceGroupId: CUTSCENE_IGID

    // ignoreTools: true
  },
  [CUTSCENE_ADD_IID]: {
    name: 'Add Cutscene Button',
    // previewText: 'Add Cutscene',
    interfaceGroupId: CUTSCENE_IGID
  },
  [CUTSCENE_SELECT_IID]: {},
}