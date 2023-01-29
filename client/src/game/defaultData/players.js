import { PLAYER_CLASS } from "../constants"
import { defaultClass } from "./class"
import { directionalDefaults, vehicleDefaults, advancedDirectionalDefaults } from "./movement"
import { groundJumpDefaults, jumpMovementDefaults, noJumpDefaults } from "./jumping"

export const defaultPlayerClass = {
  ...defaultClass,
  type: PLAYER_CLASS,
}

export const vehicleClass = {
  ...defaultPlayerClass,
  interfaceLocked: true,
  classId: 'oc/pl/vehicle',
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
  ...defaultPlayerClass,
  interfaceLocked: true,
  classId: 'oc/pl/jumper',
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
  ...defaultPlayerClass,
  interfaceLocked: true,
  classId: 'oc/pl/directional',
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
//   ...defaultPlayerClass,
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
//   ...defaultPlayerClass,
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