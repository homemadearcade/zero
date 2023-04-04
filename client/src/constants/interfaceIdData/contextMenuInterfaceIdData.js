import { DUPLICATE_ENTITY_MODEL_IID, 
  SELECT_PLAYER_ENTITY_MODEL_IID, CONTEXT_MENU_CONTAINER_IID,
   OPEN_PLAYTEST_IID,
  } from "../interfaceIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [CONTEXT_MENU_CONTAINER_IID]: {
    ignoreTools: true
  },

  [DUPLICATE_ENTITY_MODEL_IID]: {},

  [SELECT_PLAYER_ENTITY_MODEL_IID]: {},

  [OPEN_PLAYTEST_IID]: {
    adminOnly: true 
  }
}