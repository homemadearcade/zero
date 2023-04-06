import { mergeDeep } from "../../../utils/utils"
import _ from "lodash"
// import { defaultEntity } from "./entityModel"
import { defaultPlayerEntity } from "./category"
import { directionalPlayerEntityId, jumperPlayerEntityId, swimmerPlayerEntityId, vehiclePlayerEntityId } from "../core"
import { advancedDirectionalDefaults, directionalDefaults, groundJumpDefaults, jumpMovementDefaults, noJumpDefaults, swimmerDefaults, vehicleDefaults } from "../entityModelPropertyDefaults"
import { DATA_SOURCE_SYSTEM_IID } from "../../../constants/interfaceIds"

const defaultProps = mergeDeep(
  // _.cloneDeep(defaultEntity),
  _.cloneDeep(defaultPlayerEntity),
)

export const vehicleEntity = {
  ...defaultProps,
  dataSourceIID: DATA_SOURCE_SYSTEM_IID,
  entityModelId: vehiclePlayerEntityId,
  name: 'Vehicle',
  graphics: {
    textureTint: '#FFFFFF',
    // "textureId": "oryx-lofi-scifi-vehicles-8px-sprite12",
  },
  "movement": {
    ...vehicleDefaults.movement
  },
  'jump': {
    ...vehicleDefaults.jump
  }
}

export const swimmerEntity = {
  ...defaultProps,
  dataSourceIID: DATA_SOURCE_SYSTEM_IID,
  entityModelId: swimmerPlayerEntityId,
  name: 'Swimmer',
  graphics: {
    textureTint: '#FFFFFF',
    // "textureId": "oryx-lofi-scifi-vehicles-8px-sprite12",
  },
  "movement": {
    ...swimmerDefaults.movement,
  },
  'jump': {
    ...swimmerDefaults.jump,
  }
}

export const jumperEntity = {
  ...defaultProps,
  dataSourceIID: DATA_SOURCE_SYSTEM_IID,
  entityModelId: jumperPlayerEntityId,
  name: 'Jumper',
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
  dataSourceIID: DATA_SOURCE_SYSTEM_IID,
  entityModelId: directionalPlayerEntityId,
  name: 'Directional',
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