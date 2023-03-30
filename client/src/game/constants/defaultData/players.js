import { defaultClass, defaultPlayerClass, PLAYER_CLASS_TYPE_PREFIX } from "./entityClass"
import { directionalDefaults, advancedDirectionalDefaults } from "./controlledMovement"
import { groundJumpDefaults, jumpMovementDefaults, noJumpDefaults } from "./jumping"
import { vehicleDefaults } from "./controlledMovement"
import { mergeDeep } from "../../../utils/utils"
import _ from "lodash"
import { OBJECT_CLASS_ID_PREFIX } from "../constants"

export const vehiclePlayerClassId = OBJECT_CLASS_ID_PREFIX+PLAYER_CLASS_TYPE_PREFIX+'vehicle'
export const jumperPlayerClassId = OBJECT_CLASS_ID_PREFIX+PLAYER_CLASS_TYPE_PREFIX+'jumper'
export const directionalPlayerClassId = OBJECT_CLASS_ID_PREFIX+PLAYER_CLASS_TYPE_PREFIX+'directional'

const defaultProps = mergeDeep(
  _.cloneDeep(defaultClass),
  _.cloneDeep(defaultPlayerClass),
)

export const vehicleClass = {
  ...defaultProps,
  entityClassId: vehiclePlayerClassId,
  name: 'vehicle',
  graphics: {
    textureTint: '#FFFFFF',
    // "textureId": "oryx-lofi-scifi-vehicles-8px-sprite12",
  },
  editorInterface: {
    ...defaultProps.editorInterface,
    isSelectorObscured: true,
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
  entityClassId: jumperPlayerClassId,
  name: 'jumper',
  graphics: {
    textureTint: '#FFFFFF',

    // "textureId": "oryx-lofi-scifi-creatures-8px-sprite141",
  },
  editorInterface: {
    ...defaultProps.editorInterface,
    isSelectorObscured: true,
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
  entityClassId: directionalPlayerClassId,
  name: 'directional',
  graphics: {
    textureTint: '#FFFFFF',
    // "textureId": "oryx-lofi-fantasy-characters-creatures-8px-sprite2",
  },
  editorInterface: {
    ...defaultProps.editorInterface,
    isSelectorObscured: true,
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