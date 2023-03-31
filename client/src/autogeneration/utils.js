import { ENTITY_MODEL_ID_PREFIX, POWERUP_ENTITY_TYPE_PREFIX } from "../game/constants"

export function getPlayerPowerupEntityId (entityModelId) {
  return ENTITY_MODEL_ID_PREFIX+POWERUP_ENTITY_TYPE_PREFIX+entityModelId
}