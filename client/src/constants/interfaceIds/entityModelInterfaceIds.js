import { BASIC_CLASS, NPC_CLASS, PLAYER_CLASS, POWERUP_CLASS, ZONE_CLASS } from "../../game/constants";

export const ZONE_CLASS_CONTAINER_IID = "ZONE_CLASS/*";
export const ZONE_CLASS_ADD_IID = "ZONE_CLASS/addZone";
export const ZONE_CLASS_SELECT_IID = "ZONE_CLASS/select";
// export const ZONE_CLASS_MORE_IID = "ZONE_CLASS/more";

export const BASIC_CLASS_CONTAINER_IID = "BASIC_CLASS/*";
export const BASIC_CLASS_ADD_IID = "BASIC_CLASS/addZone";
export const BASIC_CLASS_SELECT_IID = "BASIC_CLASS/select";
// export const BASIC_CLASS_MORE_IID = "BASIC_CLASS/more";

export const NPC_CLASS_CONTAINER_IID = "NPC_CLASS/*";
export const NPC_CLASS_ADD_IID = "NPC_CLASS/addZone";
export const NPC_CLASS_SELECT_IID = "NPC_CLASS/select";
// export const NPC_CLASS_MORE_IID = "NPC_CLASS/more";

export const PLAYER_CLASS_CONTAINER_IID = "PLAYER_CLASS/*";
export const PLAYER_CLASS_ADD_IID = "PLAYER_CLASS/addZone";
export const PLAYER_CLASS_SELECT_IID = "PLAYER_CLASS/select";
// export const PLAYER_CLASS_MORE_IID = "PLAYER_CLASS/more";


export const POWERUP_CLASS_CONTAINER_IID = "POWERUP_CLASS/*";
export const POWERUP_CLASS_ADD_IID = "POWERUP_CLASS/addZone";
export const POWERUP_CLASS_SELECT_IID = "POWERUP_CLASS/select";
// export const POWERUP_CLASS_MORE_IID = "POWERUP_CLASS/more";


export const CLASS_LAYER_IID = 'model/layer'
export const CLASS_VISIBILITY_IID = 'model/visibility'
export const CLASS_LOCK_IID = 'model/lock'
export const CLASS_UNLOCKABLE_IID = 'model/unlockable'
export const CHANGE_CLASS_TYPE_IID = "model/changeEntityType";
export const CLASS_RELATION_TAGS_IID = "model/relationTags";

export function getSelectEntityFromEntityType(entityInterfaceId) {
  if(entityInterfaceId === PLAYER_CLASS) return PLAYER_CLASS_SELECT_IID
  if(entityInterfaceId === ZONE_CLASS) return ZONE_CLASS_SELECT_IID
  if(entityInterfaceId === BASIC_CLASS) return BASIC_CLASS_SELECT_IID
  if(entityInterfaceId === NPC_CLASS) return NPC_CLASS_SELECT_IID
  if(entityInterfaceId === POWERUP_CLASS) return POWERUP_CLASS_SELECT_IID
}