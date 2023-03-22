import { OBJECT_CLASS_ID_PREFIX, PLAYER_CLASS_TYPE_PREFIX } from "../"
import { defaultClass, defaultPlayerClass } from "./entityClass"
import { directionalDefaults, advancedDirectionalDefaults } from "./controlledMovement"
import { groundJumpDefaults, jumpMovementDefaults, noJumpDefaults } from "./jumping"
import { vehicleDefaults } from "./controlledMovement"
import { mergeDeep } from "../../../utils/utils"
import _ from "lodash"

export const vehiclePlayerClassId = OBJECT_CLASS_ID_PREFIX+PLAYER_CLASS_TYPE_PREFIX+'vehicle'
export const jumperPlayerClassId = OBJECT_CLASS_ID_PREFIX+PLAYER_CLASS_TYPE_PREFIX+'jumper'
export const directionalPlayerClassId = OBJECT_CLASS_ID_PREFIX+PLAYER_CLASS_TYPE_PREFIX+'directional'

const defaultProps = mergeDeep(
  _.cloneDeep(defaultClass),
  _.cloneDeep(defaultPlayerClass),
)

export const vehicleClass = {
  ...defaultProps,
  interfaceLocked: true,
  entityClassId: vehiclePlayerClassId,
  name: 'vehicle',
  graphics: {
    textureTint: '#FFFFFF',
    // "textureId": "oryx-lofi-scifi-vehicles-8px-sprite12",
  },
  "movement": {
    ...vehicleDefaults.movement
  },
  'jump': {
    ...noJumpDefaults.jump
  }
}

export const jumperClass = {
  ...defaultProps,
  interfaceLocked: true,
  entityClassId: jumperPlayerClassId,
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

export const directionalClass = {
  ...defaultProps,
  interfaceLocked: true,
  entityClassId: directionalPlayerClassId,
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

// export const carClass = {
//   ...defaultProps,
//   entityClassId: 'car',
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

// export const floaterClass = {
//   ...defaultProps,
//   entityClassId: 'floater',
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