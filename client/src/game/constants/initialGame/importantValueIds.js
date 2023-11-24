import { generateUniqueId } from "../../../utils"
import { CUTSCENE_DID, ENTITY_INSTANCE_DID, ENTITY_MODEL_DID, PLAYER_ENTITY_TYPE_PREFIX, RELATION_TAG_DID, STAGE_DID, ZONE_ENTITY_TYPE_PREFIX } from "../core"

export const VEHICLE_PLAYER_ENTITY_IVID = ENTITY_MODEL_DID+PLAYER_ENTITY_TYPE_PREFIX+'vehicle'
export const JUMPER_PLAYER_ENTITY_IVID = ENTITY_MODEL_DID+PLAYER_ENTITY_TYPE_PREFIX+'jumper'
export const DIRECTIONAL_PLAYER_ENTITY_IVID = ENTITY_MODEL_DID+PLAYER_ENTITY_TYPE_PREFIX+'directional'
export const SWIMMER_PLAYER_ENTITY_IVID = ENTITY_MODEL_DID+PLAYER_ENTITY_TYPE_PREFIX+'swimmer'

export const INITIAL_STAGE_IVID =  STAGE_DID+'default'
export const PLAYER_SPAWN_ZONE_ENTITY_IVID = ENTITY_MODEL_DID+ZONE_ENTITY_TYPE_PREFIX+'playerspawnzone'
export const PLAYER_SPAWN_ZONE_INSTANCE_IVID = ENTITY_MODEL_DID+ENTITY_INSTANCE_DID+'playerspawnzone'
export const CAMERA_ZONE_ENTITY_IVID = ENTITY_MODEL_DID+ZONE_ENTITY_TYPE_PREFIX+'playercamerazone2'
export const CAMERA_ZONE_INSTANCE_IVID = ENTITY_MODEL_DID+ENTITY_INSTANCE_DID+'playercamerazone'
export const STAGE_ZONE_ENTITY_IVID = ENTITY_MODEL_DID+ZONE_ENTITY_TYPE_PREFIX+'stagezone'
export const STAGE_ZONE_INSTANCE_IVID = ENTITY_MODEL_DID+ENTITY_INSTANCE_DID+'stagezone'

export const PLAYTHROUGH_START_CUTSCENE_IVID = CUTSCENE_DID+'start'
export const END_GAME_CUTSCENE_IVID = CUTSCENE_DID+'end'

export const importantValueData = {
  [VEHICLE_PLAYER_ENTITY_IVID]: {
    importantValueId: VEHICLE_PLAYER_ENTITY_IVID,
    name: 'Vehicle Player'
  },
  [JUMPER_PLAYER_ENTITY_IVID]: { 
    importantValueId: JUMPER_PLAYER_ENTITY_IVID,
    name: 'Jumper Player'
  },
  [DIRECTIONAL_PLAYER_ENTITY_IVID]: {
    importantValueId: DIRECTIONAL_PLAYER_ENTITY_IVID,
    name: 'Directional Player'
  },
  [SWIMMER_PLAYER_ENTITY_IVID]: {
    importantValueId: SWIMMER_PLAYER_ENTITY_IVID,
    name: 'Swimmer Player'
  },
  [INITIAL_STAGE_IVID]: {
    importantValueId: INITIAL_STAGE_IVID,
    name: 'Initial Stage'
  },
  [PLAYER_SPAWN_ZONE_ENTITY_IVID]: {
    importantValueId: PLAYER_SPAWN_ZONE_ENTITY_IVID,
    name: 'Player Spawn Zone Entity'
  },
  [PLAYER_SPAWN_ZONE_INSTANCE_IVID]: {
    importantValueId: PLAYER_SPAWN_ZONE_INSTANCE_IVID,
    name: 'Player Spawn Zone Instance'
  },
  [CAMERA_ZONE_INSTANCE_IVID]: {
    importantValueId: CAMERA_ZONE_INSTANCE_IVID,
    name: 'Camera Zone Instance'
  },
  [STAGE_ZONE_INSTANCE_IVID]: {
    importantValueId: STAGE_ZONE_INSTANCE_IVID,
    name: 'Stage Zone Instance'
  },
  [CAMERA_ZONE_ENTITY_IVID]: { 
    importantValueId: CAMERA_ZONE_ENTITY_IVID,
    name: 'Camera Zone Entity'
  },
  [STAGE_ZONE_ENTITY_IVID]: {
    importantValueId: STAGE_ZONE_ENTITY_IVID,
    name: 'Stage Zone Entity'
  },
  [PLAYTHROUGH_START_CUTSCENE_IVID]: {
    importantValueId: PLAYTHROUGH_START_CUTSCENE_IVID,
    name: 'Start Cutscene'
  },
  [END_GAME_CUTSCENE_IVID]: {
    importantValueId: END_GAME_CUTSCENE_IVID,
    name: 'End Cutscene'
  }
}
export function getImportantValue(importantValueId) {
  const { name } = importantValueData[importantValueId]

  return {
    unique: true,
    type: 'id',
    name,
    importantValueId,
    value: importantValueId + '-' + generateUniqueId(),
    relatedId: null
  }
}