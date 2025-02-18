import { WEB_PAGE_IGID } from "../interfaceIdGroups";
import { ENTITY_MODEL_DUPLICATE_IID, 
  PLAYER_ENTITY_TRANSFORM_IID, CONTEXT_MENU_CONTAINER_IID,
  } from "../interfaceIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [CONTEXT_MENU_CONTAINER_IID]: {
    ignoreTools: true
  },
  [ENTITY_MODEL_DUPLICATE_IID]: {},
  [PLAYER_ENTITY_TRANSFORM_IID]: {},
}