import { ENTITY_MODEL_BEHAVIOR_IGID } from "../interfaceIdGroups";
import { CAMERA_LERP_X_IID, CAMERA_LERP_Y_IID, CAMERA_ZOOM_IID } from "../interfaceIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [CAMERA_ZOOM_IID]: {
    isDefaultUnlocked: true,
    interfaceGroupId: ENTITY_MODEL_BEHAVIOR_IGID
  },
  [CAMERA_LERP_X_IID]: {},
  [CAMERA_LERP_Y_IID]: {},
}