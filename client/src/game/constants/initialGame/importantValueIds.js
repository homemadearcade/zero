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

export const importantValueData = [
  {
    importantValueId: VEHICLE_PLAYER_ENTITY_IVID,
    name: 'Vehicle Player'
  },
  { 
    importantValueId: JUMPER_PLAYER_ENTITY_IVID,
    name: 'Jumper Player'
  },
  {
    importantValueId: DIRECTIONAL_PLAYER_ENTITY_IVID,
    name: 'Directional Player'
  },
  {
    importantValueId: SWIMMER_PLAYER_ENTITY_IVID,
    name: 'Swimmer Player'
  },
  {
    importantValueId: INITIAL_STAGE_IVID,
    name: 'Initial Stage'
  },
  {
    importantValueId: PLAYER_SPAWN_ZONE_ENTITY_IVID,
    name: 'Player Spawn Zone Entity'
  },
  {
    importantValueId: PLAYER_SPAWN_ZONE_INSTANCE_IVID,
    name: 'Player Spawn Zone Instance'
  },
  {
    importantValueId: CAMERA_ZONE_INSTANCE_IVID,
    name: 'Camera Zone Instance'
  },
  {
    importantValueId: STAGE_ZONE_INSTANCE_IVID,
    name: 'Stage Zone Instance'
  },
  { 
    importantValueId: CAMERA_ZONE_ENTITY_IVID,
    name: 'Camera Zone Entity'
  },
  {
    importantValueId: STAGE_ZONE_ENTITY_IVID,
    name: 'Stage Zone Entity'
  },
  {
    importantValueId: PLAYTHROUGH_START_CUTSCENE_IVID,
    name: 'Start Cutscene'
  },
  {
    importantValueId: END_GAME_CUTSCENE_IVID,
    name: 'End Cutscene'
  }
]