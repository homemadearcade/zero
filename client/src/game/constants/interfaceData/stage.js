import { BOUNDARY_COLLIDE, BOUNDARY_WRAP } from "../core"
import {  STAGE_DEFAULT_PLATFORMER_IID, STAGE_DEFAULT_SPACE_IID, STAGE_DEFAULT_UNDERWATER_IID } from "../../../constants/interfaceIds"
import { STAGE_DEFAULT_OVERHEAD_IID } from "../../../constants/interfaceIds"
import { DIRECTIONAL_PLAYER_ENTITY_IVID, JUMPER_PLAYER_ENTITY_IVID, SWIMMER_PLAYER_ENTITY_IVID, VEHICLE_PLAYER_ENTITY_IVID } from "../initialGame/importantValueIds"

export const stageDefaultTypeLabels= {
  [STAGE_DEFAULT_UNDERWATER_IID]: 'Underwater',
  [STAGE_DEFAULT_SPACE_IID]: 'Space',
  [STAGE_DEFAULT_OVERHEAD_IID]: 'Overhead',
  [STAGE_DEFAULT_PLATFORMER_IID]: 'Platformer'
}

export const stageDefaultTypeProperties = {
  [STAGE_DEFAULT_UNDERWATER_IID]: {
    defaultType: STAGE_DEFAULT_UNDERWATER_IID,
    importantValueId: SWIMMER_PLAYER_ENTITY_IVID,
    gravityY: true
  },
  [STAGE_DEFAULT_SPACE_IID]: {
    defaultType: STAGE_DEFAULT_SPACE_IID,
    importantValueId: VEHICLE_PLAYER_ENTITY_IVID,
    gravityY: false
  },
  [STAGE_DEFAULT_OVERHEAD_IID]: {
    defaultType: STAGE_DEFAULT_OVERHEAD_IID,
    importantValueId: DIRECTIONAL_PLAYER_ENTITY_IVID,
    gravityY: false
  },
  [STAGE_DEFAULT_PLATFORMER_IID]: {
    defaultType: STAGE_DEFAULT_PLATFORMER_IID,
    importantValueId: JUMPER_PLAYER_ENTITY_IVID,
    gravityY: true
  }
}

export const boundaryRelationsDisplayNames = {
  [BOUNDARY_COLLIDE]: 'Stops at boundary',
  // [BOUNDARY_DESTROY]: 'Is destroyed',
  [BOUNDARY_WRAP]:  'Flips to the other side'
}