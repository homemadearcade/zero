import { ENTITY_INSTANCE_IGID } from "../interfaceIdGroups";
import { ENTITY_INSTANCE_DELETE_IID, ENTITY_INSTANCE_JSON_IID, ENTITY_INSTANCE_MOVE_IID, ENTITY_INSTANCE_RESIZE_ENTITY_IID, ENTITY_INSTANCE_SELECT_ENTITY_IID } from "../interfaceIds";

  // eslint-disable-next-line import/no-anonymous-default-export
export default {
  [ENTITY_INSTANCE_MOVE_IID]: {
    interfaceGroup: ENTITY_INSTANCE_IGID
  },
  [ENTITY_INSTANCE_RESIZE_ENTITY_IID]: {
    interfaceGroup: ENTITY_INSTANCE_IGID,
  },
  [ENTITY_INSTANCE_SELECT_ENTITY_IID]: {
    interfaceGroup: ENTITY_INSTANCE_IGID,
  },
  [ENTITY_INSTANCE_DELETE_IID]: {
    interfaceGroup: ENTITY_INSTANCE_IGID,
  },
  [ENTITY_INSTANCE_JSON_IID]: {
    interfaceGroup: ENTITY_INSTANCE_IGID,
    adminOnly: true
  },
}