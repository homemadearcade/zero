import { RELATION_TAG_IGID } from "../interfaceIdGroups";
import { RELATION_TAG_ADD_IID, RELATION_TAG_CONTAINER_IID, RELATION_TAG_SELECT_IID } from "../interfaceIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [RELATION_TAG_CONTAINER_IID]: {
    ignoreTools: true
  },
  [RELATION_TAG_ADD_IID]: {
    previewText: 'Add Relation Tag',
    name: 'Add Relation Tag Button',
    interfaceGroupId: RELATION_TAG_IGID
  },
  [RELATION_TAG_SELECT_IID]: {},
}