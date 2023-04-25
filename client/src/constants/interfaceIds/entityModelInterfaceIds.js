export const ZONE_ENTITY_CONTAINER_IID = "ZONE_ENTITY_IID/*";
export const ZONE_ENTITY_ADD_IID = "ZONE_ENTITY_IID/addZone";
export const ZONE_ENTITY_SELECT_IID = "ZONE_ENTITY_IID/select";
// export const ZONE_ENTITY_MORE_IID = "ZONE_ENTITY_IID/more";

export const BASIC_ENTITY_CONTAINER_IID = "BASIC_ENTITY_IID/*";
export const BASIC_ENTITY_ADD_IID = "BASIC_ENTITY_IID/addBasic";
export const BASIC_ENTITY_SELECT_IID = "BASIC_ENTITY_IID/select";
// export const BASIC_ENTITY_MORE_IID = "BASIC_ENTITY_IID/more";

export const NPC_ENTITY_CONTAINER_IID = "NPC_ENTITY_IID/*";
export const NPC_ENTITY_ADD_IID = "NPC_ENTITY_IID/addNPC";
export const NPC_ENTITY_SELECT_IID = "NPC_ENTITY_IID/select";
// export const NPC_ENTITY_MORE_IID = "NPC_ENTITY_IID/more";

export const PLAYER_ENTITY_CONTAINER_IID = "PLAYER_ENTITY_IID/*";
export const PLAYER_ENTITY_ADD_IID = "PLAYER_ENTITY_IID/addPlayer";
export const PLAYER_ENTITY_SELECT_IID = "PLAYER_ENTITY_IID/select";
// export const PLAYER_ENTITY_MORE_IID = "PLAYER_ENTITY_IID/more";

export const POWERUP_ENTITY_CONTAINER_IID = "POWERUP_ENTITY_IID/*";
export const POWERUP_ENTITY_ADD_IID = "POWERUP_ENTITY_IID/addPowerup";
export const POWERUP_ENTITY_SELECT_IID = "POWERUP_ENTITY_IID/select";
// export const POWERUP_ENTITY_MORE_IID = "POWERUP_ENTITY_IID/more";
export const CHANGE_ENTITY_INTERFACE_IID = "entity/changeEntityInterface";
export const ENTITY_MODEL_REMOVE_IID= 'contextMenu/entity/remove'
export const ENTITY_MODEL_IMPORT_IID= 'contextMenu/entity/import'

export function getSelectEntityFromEntityType(entityIID) {
  if(entityIID === PLAYER_ENTITY_IID) return PLAYER_ENTITY_SELECT_IID
  if(entityIID === ZONE_ENTITY_IID) return ZONE_ENTITY_SELECT_IID
  if(entityIID === BASIC_ENTITY_IID) return BASIC_ENTITY_SELECT_IID
  if(entityIID === NPC_ENTITY_IID) return NPC_ENTITY_SELECT_IID
  if(entityIID === POWERUP_ENTITY_IID) return POWERUP_ENTITY_SELECT_IID
}

/////////////////////////////////////
/////////////////////////////////////
// ENTITY_MODELES
// NO DATA
export const PLAYER_ENTITY_IID = 'PLAYER_ENTITY_IID'
export const BASIC_ENTITY_IID = 'BASIC_ENTITY_IID'
export const NPC_ENTITY_IID = 'NPC_ENTITY_IID'
export const ZONE_ENTITY_IID = 'ZONE_ENTITY_IID'
export const POWERUP_ENTITY_IID = 'POWERUP_ENTITY_IID'
