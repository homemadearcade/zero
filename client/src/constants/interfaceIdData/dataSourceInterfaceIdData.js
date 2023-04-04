import { IMPORT_GAME_MODEL_IID, OPEN_ENTITY_BOX_IID, REMOVE_ENTITY_MODEL_FROM_LIBRARY_IID, SHOW_REMOVED_DATA_IID } from "../interfaceIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [REMOVE_ENTITY_MODEL_FROM_LIBRARY_IID]: {
    adminOnly: true,
    previewText: 'Remove from Library'
  },
  [IMPORT_GAME_MODEL_IID]: {
    adminOnly: true,
    previewText: 'Import Game Model'
  },
  [SHOW_REMOVED_DATA_IID]: {},
  [OPEN_ENTITY_BOX_IID]: {},

}