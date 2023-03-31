import { ENTITY_MODEL_ID_PREFIX, POWERUP_CLASS_TYPE_PREFIX } from "../game/constants"

export function getPlayerPowerupEntityId (entityModelId) {
  return ENTITY_MODEL_ID_PREFIX+POWERUP_CLASS_TYPE_PREFIX+entityModelId
}