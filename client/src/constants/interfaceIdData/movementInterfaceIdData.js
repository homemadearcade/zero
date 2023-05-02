import { ENTITY_MODEL_BEHAVIOR_IGID } from "../interfaceIdGroups";
import {  CONTROLS_NO_BEHAVIOR_DOWN_IID, CONTROLS_NO_BEHAVIOR_BEHAVIOR_IID, MOVEMENT_DRAG_ANGULAR_IID, MOVEMENT_DRAG_X_IID, MOVEMENT_DRAG_Y_IID, MOVEMENT_GRAVITY_X_IID, MOVEMENT_GRAVITY_Y_IID, MOVEMENT_IGNORE_GRAVITY_IID, MOVEMENT_BEHAVIOR_IID, MOVEMENT_SPEED_ANGULAR_IID, MOVEMENT_SPEED_IID, MOVEMENT_VELOCITY_X_IID, MOVEMENT_VELOCITY_Y_IID } from "../interfaceIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [MOVEMENT_IGNORE_GRAVITY_IID]: {},
  [MOVEMENT_SPEED_IID]: {
    isDefaultUnlocked: true,
    interfaceGroupId: ENTITY_MODEL_BEHAVIOR_IGID
  },
  [MOVEMENT_BEHAVIOR_IID]: {},
  [MOVEMENT_GRAVITY_Y_IID]: {},
  [MOVEMENT_GRAVITY_X_IID]: {},
  [MOVEMENT_DRAG_Y_IID]: {},
  [MOVEMENT_DRAG_X_IID]: {},
  [MOVEMENT_VELOCITY_Y_IID]: {},
  [MOVEMENT_VELOCITY_X_IID]: {},
  [CONTROLS_NO_BEHAVIOR_BEHAVIOR_IID]: {},
  [CONTROLS_NO_BEHAVIOR_DOWN_IID]: {},
  [MOVEMENT_SPEED_ANGULAR_IID]: {},
  [MOVEMENT_DRAG_ANGULAR_IID]: {}
}