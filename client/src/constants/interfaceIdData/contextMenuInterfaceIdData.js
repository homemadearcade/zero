import { WEB_PAGE_IGID } from "../interfaceIdGroups";
import { ENTITY_MODEL_DUPLICATE_IID, 
  PLAYER_ENTITY_TRANSFORM_IID, CONTEXT_MENU_CONTAINER_IID,
   PLAYTEST_OPEN_IID,
  } from "../interfaceIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [CONTEXT_MENU_CONTAINER_IID]: {
    ignoreTools: true
  },
  [ENTITY_MODEL_DUPLICATE_IID]: {},
  [PLAYER_ENTITY_TRANSFORM_IID]: {},
  [PLAYTEST_OPEN_IID]: {
    appAdminOnly: true ,
    notCobrowseCompatible: true,
    interfaceGroupId: WEB_PAGE_IGID,
    name: 'Playtest Button',
    previewText: 'Open Playtest Window'
  }
}