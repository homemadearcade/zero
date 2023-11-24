import { CUTSCENE_DID, ENTITY_INSTANCE_DID, ENTITY_MODEL_DID, PLAYER_ENTITY_TYPE_PREFIX, RELATION_TAG_DID, STAGE_DID, ZONE_ENTITY_TYPE_PREFIX } from "../core"

export const VEHICLE_PLAYER_ENTITY_RID = ENTITY_MODEL_DID+PLAYER_ENTITY_TYPE_PREFIX+'vehicle'
export const JUMPER_PLAYER_ENTITY_RID = ENTITY_MODEL_DID+PLAYER_ENTITY_TYPE_PREFIX+'jumper'
export const DIRECTIONAL_PLAYER_ENTITY_RID = ENTITY_MODEL_DID+PLAYER_ENTITY_TYPE_PREFIX+'directional'
export const SWIMMER_PLAYER_ENTITY_RID = ENTITY_MODEL_DID+PLAYER_ENTITY_TYPE_PREFIX+'swimmer'

export const INITIAL_STAGE_RID =  STAGE_DID+'default'
export const PLAYER_SPAWN_ZONE_ENTITY_RID = ENTITY_MODEL_DID+ZONE_ENTITY_TYPE_PREFIX+'playerspawnzone'
export const PLAYER_SPAWN_ZONE_INSTANCE_RID = ENTITY_MODEL_DID+ENTITY_INSTANCE_DID+'playerspawnzone'
export const CAMERA_ZONE_ENTITY_RID = ENTITY_MODEL_DID+ZONE_ENTITY_TYPE_PREFIX+'playercamerazone2'
export const CAMERA_ZONE_INSTANCE_RID = ENTITY_MODEL_DID+ENTITY_INSTANCE_DID+'playercamerazone'
export const STAGE_ZONE_ENTITY_RID = ENTITY_MODEL_DID+ZONE_ENTITY_TYPE_PREFIX+'stagezone'
export const STAGE_ZONE_INSTANCE_RID = ENTITY_MODEL_DID+ENTITY_INSTANCE_DID+'stagezone'

export const PLAYTHROUGH_START_CUTSCENE_RID = CUTSCENE_DID+'start'
export const END_GAME_CUTSCENE_RID = CUTSCENE_DID+'end'

// export const importantValueData = {
//   [VEHICLE_PLAYER_ENTITY_RID]: {
//     importantValueId: VEHICLE_PLAYER_ENTITY_RID,
//     name: 'Vehicle Player'
//   },
//   [JUMPER_PLAYER_ENTITY_RID]: { 
//     importantValueId: JUMPER_PLAYER_ENTITY_RID,
//     name: 'Jumper Player'
//   },
//   [DIRECTIONAL_PLAYER_ENTITY_RID]: {
//     importantValueId: DIRECTIONAL_PLAYER_ENTITY_RID,
//     name: 'Directional Player'
//   },
//   [SWIMMER_PLAYER_ENTITY_RID]: {
//     importantValueId: SWIMMER_PLAYER_ENTITY_RID,
//     name: 'Swimmer Player'
//   },
//   [INITIAL_STAGE_RID]: {
//     importantValueId: INITIAL_STAGE_RID,
//     name: 'Initial Stage'
//   },
//   [PLAYER_SPAWN_ZONE_ENTITY_RID]: {
//     importantValueId: PLAYER_SPAWN_ZONE_ENTITY_RID,
//     name: 'Player Spawn Zone Entity'
//   },
//   [PLAYER_SPAWN_ZONE_INSTANCE_RID]: {
//     importantValueId: PLAYER_SPAWN_ZONE_INSTANCE_RID,
//     name: 'Player Spawn Zone Instance'
//   },
//   [CAMERA_ZONE_INSTANCE_RID]: {
//     importantValueId: CAMERA_ZONE_INSTANCE_RID,
//     name: 'Camera Zone Instance'
//   },
//   [STAGE_ZONE_INSTANCE_RID]: {
//     importantValueId: STAGE_ZONE_INSTANCE_RID,
//     name: 'Stage Zone Instance'
//   },
//   [CAMERA_ZONE_ENTITY_RID]: { 
//     importantValueId: CAMERA_ZONE_ENTITY_RID,
//     name: 'Camera Zone Entity'
//   },
//   [STAGE_ZONE_ENTITY_RID]: {
//     importantValueId: STAGE_ZONE_ENTITY_RID,
//     name: 'Stage Zone Entity'
//   },
//   [PLAYTHROUGH_START_CUTSCENE_RID]: {
//     importantValueId: PLAYTHROUGH_START_CUTSCENE_RID,
//     name: 'Start Cutscene'
//   },
//   [END_GAME_CUTSCENE_RID]: {
//     importantValueId: END_GAME_CUTSCENE_RID,
//     name: 'End Cutscene'
//   }
// }