import { BASIC_ENTITY_IID, NPC_ENTITY_IID, PLAYER_ENTITY_IID, POWERUP_ENTITY_IID, ZONE_ENTITY_IID } from "../../game/constants";

export const ZONE_ENTITY_CONTAINER_IID = "ZONE_ENTITY_IID/*";
export const ZONE_ENTITY_ADD_IID = "ZONE_ENTITY_IID/addZone";
export const ZONE_ENTITY_SELECT_IID = "ZONE_ENTITY_IID/select";
// export const ZONE_ENTITY_MORE_IID = "ZONE_ENTITY_IID/more";

export const BASIC_ENTITY_CONTAINER_IID = "BASIC_ENTITY_IID/*";
export const BASIC_ENTITY_ADD_IID = "BASIC_ENTITY_IID/addZone";
export const BASIC_ENTITY_SELECT_IID = "BASIC_ENTITY_IID/select";
// export const BASIC_ENTITY_MORE_IID = "BASIC_ENTITY_IID/more";

export const NPC_ENTITY_CONTAINER_IID = "NPC_ENTITY_IID/*";
export const NPC_ENTITY_ADD_IID = "NPC_ENTITY_IID/addZone";
export const NPC_ENTITY_SELECT_IID = "NPC_ENTITY_IID/select";
// export const NPC_ENTITY_MORE_IID = "NPC_ENTITY_IID/more";

export const PLAYER_ENTITY_CONTAINER_IID = "PLAYER_ENTITY_IID/*";
export const PLAYER_ENTITY_ADD_IID = "PLAYER_ENTITY_IID/addZone";
export const PLAYER_ENTITY_SELECT_IID = "PLAYER_ENTITY_IID/select";
// export const PLAYER_ENTITY_MORE_IID = "PLAYER_ENTITY_IID/more";


export const POWERUP_ENTITY_CONTAINER_IID = "POWERUP_ENTITY_IID/*";
export const POWERUP_ENTITY_ADD_IID = "POWERUP_ENTITY_IID/addZone";
export const POWERUP_ENTITY_SELECT_IID = "POWERUP_ENTITY_IID/select";
// export const POWERUP_ENTITY_MORE_IID = "POWERUP_ENTITY_IID/more";


export const CLASS_LAYER_IID = 'model/layer'
export const CLASS_VISIBILITY_IID = 'model/visibility'
export const CLASS_LOCK_IID = 'model/lock'
export const CLASS_UNLOCKABLE_IID = 'model/unlockable'
export const CHANGE_CLASS_TYPE_IID = "model/changeEntityType";
export const CLASS_RELATION_TAGS_IID = "model/relationTags";

export function getSelectEntityFromEntityType(entityInterfaceId) {
  if(entityInterfaceId === PLAYER_ENTITY_IID) return PLAYER_ENTITY_SELECT_IID
  if(entityInterfaceId === ZONE_ENTITY_IID) return ZONE_ENTITY_SELECT_IID
  if(entityInterfaceId === BASIC_ENTITY_IID) return BASIC_ENTITY_SELECT_IID
  if(entityInterfaceId === NPC_ENTITY_IID) return NPC_ENTITY_SELECT_IID
  if(entityInterfaceId === POWERUP_ENTITY_IID) return POWERUP_ENTITY_SELECT_IID
}