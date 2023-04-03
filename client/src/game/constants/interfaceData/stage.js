import { BOUNDARY_COLLIDE, BOUNDARY_WRAP, directionalPlayerEntityId, jumperPlayerEntityId, vehiclePlayerEntityId } from "../core"
import {  STAGE_DEFAULT_PLATFORMER_IID, STAGE_DEFAULT_SPACE_IID, STAGE_DEFAULT_UNDERWATER_IID } from "../../../constants/interfaceIds"
import { STAGE_DEFAULT_OVERHEAD_IID } from "../../../constants/interfaceIds"

export const stageDefaultTypeLabels= {
  [STAGE_DEFAULT_UNDERWATER_IID]: 'Underwater',
  [STAGE_DEFAULT_SPACE_IID]: 'Space',
  [STAGE_DEFAULT_OVERHEAD_IID]: 'Overhead',
  [STAGE_DEFAULT_PLATFORMER_IID]: 'Platformer'
}

export const stageDefaultTypeProperties = {
  [STAGE_DEFAULT_UNDERWATER_IID]: {
    defaultType: STAGE_DEFAULT_UNDERWATER_IID,
    playerEntityModelId: vehiclePlayerEntityId,
    gravityY: true
  },
  [STAGE_DEFAULT_SPACE_IID]: {
    defaultType: STAGE_DEFAULT_SPACE_IID,
    playerEntityModelId: vehiclePlayerEntityId,
    gravityY: false
  },
  [STAGE_DEFAULT_OVERHEAD_IID]: {
    defaultType: STAGE_DEFAULT_OVERHEAD_IID,
    playerEntityModelId: directionalPlayerEntityId,
    gravityY: false
  },
  [STAGE_DEFAULT_PLATFORMER_IID]: {
    defaultType: STAGE_DEFAULT_PLATFORMER_IID,
    playerEntityModelId: jumperPlayerEntityId,
    gravityY: true
  }
}

export const boundaryRelationsDisplayNames = {
  [BOUNDARY_COLLIDE]: 'Stops at boundary',
  // [BOUNDARY_DESTROY]: 'Is destroyed',
  [BOUNDARY_WRAP]:  'Flips to the other side'
}