import { BOUNDARY_COLLIDE, BOUNDARY_WRAP, directionalPlayerEntityId, jumperPlayerEntityId, STAGE_DEFAULT_OVERHEAD, STAGE_DEFAULT_PLATFORMER, STAGE_DEFAULT_SPACE, STAGE_DEFAULT_UNDERWATER, vehiclePlayerEntityId } from "../core"

export const stageDefaultTypeLabels= {
  [STAGE_DEFAULT_UNDERWATER]: 'Underwater',
  [STAGE_DEFAULT_SPACE]: 'Space',
  [STAGE_DEFAULT_OVERHEAD]: 'Overhead',
  [STAGE_DEFAULT_PLATFORMER]: 'Platformer'
}

export const stageDefaultTypeProperties = {
  [STAGE_DEFAULT_UNDERWATER]: {
    defaultType: STAGE_DEFAULT_UNDERWATER,
    playerEntityModelId: vehiclePlayerEntityId,
    gravityY: true
  },
  [STAGE_DEFAULT_SPACE]: {
    defaultType: STAGE_DEFAULT_SPACE,
    playerEntityModelId: vehiclePlayerEntityId,
    gravityY: false
  },
  [STAGE_DEFAULT_OVERHEAD]: {
    defaultType: STAGE_DEFAULT_OVERHEAD,
    playerEntityModelId: directionalPlayerEntityId,
    gravityY: false
  },
  [STAGE_DEFAULT_PLATFORMER]: {
    defaultType: STAGE_DEFAULT_PLATFORMER,
    playerEntityModelId: jumperPlayerEntityId,
    gravityY: true
  }
}

export const boundaryRelationsDisplayNames = {
  [BOUNDARY_COLLIDE]: 'Stops at boundary',
  // [BOUNDARY_DESTROY]: 'Is destroyed',
  [BOUNDARY_WRAP]:  'Flips to the other side'
}