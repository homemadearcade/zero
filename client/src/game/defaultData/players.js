import { OBJECT_CLASS_ID_PREFIX, PLAYER_CLASS, PLAYER_CLASS_TYPE_PREFIX } from "../constants"
import { defaultClass, defaultPlayerClass } from "./class"
import { directionalDefaults, advancedDirectionalDefaults } from "./controlledMovement"
import { groundJumpDefaults, jumpMovementDefaults, noJumpDefaults } from "./jumping"
import { vehicleDefaults } from "./controlledMovement"
import { mergeDeep } from "../../utils/utils"
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
  classId: vehiclePlayerClassId,
  name: 'vehicle',
  graphics: {
    tint: '#FFFFFF',
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
  classId: jumperPlayerClassId,
  name: 'jumper',
  graphics: {
    tint: '#FFFFFF',

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
  classId: directionalPlayerClassId,
  name: 'directional',
  graphics: {
    tint: '#FFFFFF',
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
//   classId: 'car',
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
//   classId: 'floater',
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