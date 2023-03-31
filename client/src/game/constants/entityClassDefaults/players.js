import { mergeDeep } from "../../../utils/utils"
import _ from "lodash"
import { defaultClass } from "./entityClass"
import { defaultPlayerClass } from "./category"
import { directionalPlayerClassId, jumperPlayerClassId, vehiclePlayerClassId } from "../core"
import { advancedDirectionalDefaults, directionalDefaults, groundJumpDefaults, jumpMovementDefaults, noJumpDefaults, vehicleDefaults } from "../entityClassPropertyDefaults"

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