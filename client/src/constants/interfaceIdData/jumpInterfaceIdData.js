import { ENTITY_MODEL_BEHAVIOR_IGID } from "../interfaceIdGroups";
import { JUMP_AIR_IID, JUMP_COOLDOWN_IID, JUMP_GROUND_IID, JUMP_BEHAVIOR_IID } from "../interfaceIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [JUMP_GROUND_IID]: {
    isDefaultUnlocked: true,
    interfaceGroupId: ENTITY_MODEL_BEHAVIOR_IGID
  },
  [JUMP_AIR_IID]: {
    isDefaultUnlocked: true,
    interfaceGroupId: ENTITY_MODEL_BEHAVIOR_IGID
  },
  [JUMP_COOLDOWN_IID]: {},
  [JUMP_BEHAVIOR_IID]: {}
}