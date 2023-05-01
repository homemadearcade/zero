import { RELATION_TAG_IGID } from "../interfaceIdGroups";
import { RELATION_TAG_ADD_IID, RELATION_TAG_CONTAINER_IID, RELATION_TAG_SELECT_IID } from "../interfaceIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [RELATION_TAG_CONTAINER_IID]: {
    // ignoreTools: true
    name: 'Relationship Tag Container',
    interfaceGroupId: RELATION_TAG_IGID
  },
  [RELATION_TAG_ADD_IID]: {
    previewText: 'Add Relationship Tag',
    name: 'Add Relationship Tag Button',
    leftClickAction: 'Add Relationship Tag',
    leftClickIcon: 'faPlus',
    interfaceGroupId: RELATION_TAG_IGID
  },
  [RELATION_TAG_SELECT_IID]: {
    name: 'Relationship Tag Select',
    interfaceGroupId: RELATION_TAG_IGID
  },
}