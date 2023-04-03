import { ADD_ENTITY_MODEL_TO_LIBRARY_IID, REMOVE_ENTITY_MODEL_FROM_LIBRARY_IID } from "../interfaceIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [REMOVE_ENTITY_MODEL_FROM_LIBRARY_IID]: {
    adminOnly: true,
    previewText: 'Remove from Library'
  },
  [ADD_ENTITY_MODEL_TO_LIBRARY_IID]: {
    adminOnly: true,
    previewText: 'Add to Library'
  }
}