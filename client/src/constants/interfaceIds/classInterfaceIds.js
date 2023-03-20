import { BASIC_CLASS, NPC_CLASS, PLAYER_CLASS, ZONE_CLASS } from "../../game/constants";

export const ZONE_CLASS_CONTAINER_IID = "ZONE_CLASS/*";
export const ZONE_CLASS_ADD_IID = "ZONE_CLASS/addZone";
export const ZONE_CLASS_SELECT_IID = "ZONE_CLASS/select";

export const BASIC_CLASS_CONTAINER_IID = "BASIC_CLASS/*";
export const BASIC_CLASS_ADD_IID = "BASIC_CLASS/addZone";
export const BASIC_CLASS_SELECT_IID = "BASIC_CLASS/select";

export const NPC_CLASS_CONTAINER_IID = "NPC_CLASS/*";
export const NPC_CLASS_ADD_IID = "NPC_CLASS/addZone";
export const NPC_CLASS_SELECT_IID = "NPC_CLASS/select";

export const PLAYER_CLASS_CONTAINER_IID = "PLAYER_CLASS/*";
export const PLAYER_CLASS_ADD_IID = "PLAYER_CLASS/addZone";
export const PLAYER_CLASS_SELECT_IID = "PLAYER_CLASS/select";

export const CLASS_LAYER_IID = 'class/layer'
export const CLASS_VISIBILITY_IID = 'class/visibility'
export const CLASS_LOCK_IID = 'class/lock'
export const CLASS_UNLOCKABLE_IID = 'class/unlockable'
export const CHANGE_CLASS_TYPE_IID = "class/changeClassType";
export const CLASS_TAGS_IID = "class/tags";

export function getSelectClassFromClassType(classInterfaceCategory) {
  if(classInterfaceCategory === PLAYER_CLASS) return PLAYER_CLASS_SELECT_IID
  if(classInterfaceCategory === ZONE_CLASS) return ZONE_CLASS_SELECT_IID
  if(classInterfaceCategory === BASIC_CLASS) return BASIC_CLASS_SELECT_IID
  if(classInterfaceCategory === NPC_CLASS) return NPC_CLASS_SELECT_IID
}