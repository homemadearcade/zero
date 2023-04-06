import { ENTITY_MODEL_DID, POWERUP_ENTITY_TYPE_PREFIX } from "../game/constants"

export function getPlayerPowerupEntityId (entityModelId) {
  return ENTITY_MODEL_DID+POWERUP_ENTITY_TYPE_PREFIX+entityModelId
}