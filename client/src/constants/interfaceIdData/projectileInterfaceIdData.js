import { ENTITY_MODEL_BEHAVIOR_IGID } from "../interfaceIdGroups";
import { PROJECTILE_COOLDOWN_IID, PROJECTILE_LIFETIME_IID, PROJECTILE_SPEED_IID } from "../interfaceIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [PROJECTILE_COOLDOWN_IID]: {},
  [PROJECTILE_LIFETIME_IID]: {},
  [PROJECTILE_SPEED_IID]: {
    isDefaultUnlocked: true,
    interfaceGroupId: ENTITY_MODEL_BEHAVIOR_IGID
  },
}