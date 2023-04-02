import { mergeDeep } from "../../../utils/utils"
import _ from "lodash"
// import { defaultEntity } from "./entityModel"
import { defaultPlayerEntity } from "./category"
import { DATA_SOURCE_CORE_LIBRARY, directionalPlayerEntityId, jumperPlayerEntityId, vehiclePlayerEntityId } from "../core"
import { advancedDirectionalDefaults, directionalDefaults, groundJumpDefaults, jumpMovementDefaults, noJumpDefaults, vehicleDefaults } from "../entityModelPropertyDefaults"

const defaultProps = mergeDeep(
  // _.cloneDeep(defaultEntity),
  _.cloneDeep(defaultPlayerEntity),
)

export const vehicleEntity = {
  ...defaultProps,
  dataSource: DATA_SOURCE_CORE_LIBRARY,
  entityModelId: vehiclePlayerEntityId,
  name: 'vehicle',
  graphics: {
    textureTint: '#FFFFFF',
    // "textureId": "oryx-lofi-scifi-vehicles-8px-sprite12",
  },
  editorInterface: {
    ...defaultProps.editorInterface,
  },
  "movement": {
    ...vehicleDefaults.movement
  },
  'jump': {
    ...noJumpDefaults.jump
  }
}

export const jumperEntity = {
  ...defaultProps,
  dataSource: DATA_SOURCE_CORE_LIBRARY,
  entityModelId: jumperPlayerEntityId,
  name: 'jumper',
  graphics: {
    textureTint: '#FFFFFF',

    // "textureId": "oryx-lofi-scifi-creatures-8px-sprite141",
  },
  movement: {
    ...advancedDirectionalDefaults.movement,
    ...jumpMovementDefaults.movement
  },
  'jump': {
    ...advancedDirectionalDefaults.jump,
    ...groundJumpDefaults.jump
  }
}

export const directionalEntity = {
  ...defaultProps,
  dataSource: DATA_SOURCE_CORE_LIBRARY,
  entityModelId: directionalPlayerEntityId,
  name: 'directional',
  graphics: {
    textureTint: '#FFFFFF',
    // "textureId": "oryx-lofi-fantasy-characters-creatures-8px-sprite2",
  },
  movement: {
    ...directionalDefaults.movement
  },
  'jump': {
    ...noJumpDefaults
  }
}

// export const carEntity = {
//   ...defaultProps,
//   entityModelId: 'car',
//   name: 'car',
//   graphics: {
//     "textureId": "kenney-roguelike-environment-16px-sprite1112",
//   },
//   "movement": {
//     ...carDefaults.movement
//   },
//   "jump": {
//     ...carDefaults.jump
//   },
// }

// export const floaterEntity = {
//   ...defaultProps,
//   entityModelId: 'floater',
//   name: 'floater',
//   graphics: {
//     "textureId": "oryx-lofi-fantasy-characters-creatures-8px-sprite206",
//   },
//   "movement": {
//     ...comboJumpDefaults.movement
//   },
//   "jump": {
//     ...comboJumpDefaults.jump
//   },
// }