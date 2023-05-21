import { CUTSCENE_IGID, TEXT_SCENE_IGID } from "../interfaceIdGroups";
import { TEXT_SCENE_ADD_IID, TEXT_SCENE_CONTAINER_IID, TEXT_SCENE_SELECT_IID, TEXT_SCENE_SHORTCUT_IID } from "../interfaceIds";
import { CUTSCENE_ADD_IID, CUTSCENE_CONTAINER_IID, CUTSCENE_SELECT_IID } from "../interfaceIds/cutsceneInterfaceIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [TEXT_SCENE_CONTAINER_IID]: {
    // ignoreTools: true
    name: 'Text Scene Container',
    interfaceGroupId: TEXT_SCENE_IGID
  },
  [TEXT_SCENE_ADD_IID]: {
    // previewText: 'Add Script',
    name: 'Add Text Scene Button',
    interfaceGroupId: TEXT_SCENE_IGID
  },
  [TEXT_SCENE_SELECT_IID]: {},
  [TEXT_SCENE_SHORTCUT_IID]: {
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