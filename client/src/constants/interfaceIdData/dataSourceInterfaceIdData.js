import { GAME_MODEL_IMPORT_IID, ENTITY_BOX_OPEN_IID, LIBRARY_REMOVE_IID, REMOVED_DATA_SHOW_IID } from "../interfaceIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [LIBRARY_REMOVE_IID]: {
    adminOnly: true,
    previewText: 'Remove from Library'
  },
  [GAME_MODEL_IMPORT_IID]: {
    adminOnly: true,
    previewText: 'Import Game Model'
  },
  [REMOVED_DATA_SHOW_IID]: {},
  [ENTITY_BOX_OPEN_IID]: {
    previewText: 'More'
  },
}