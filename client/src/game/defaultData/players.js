import { PLAYER_CLASS } from "../constants"
import { defaultClass } from "./class"
import { directionalDefaults, vehicleDefaults, advancedDirectionalDefaults } from "./movement"
import { noJumpDefaults } from "./jumping"

export const defaultPlayerClass = {
  ...defaultClass,
  type: PLAYER_CLASS,
}

export const vehicleClass = {
  ...defaultPlayerClass,
  classId: 'vehicle',
  name: 'vehicle',
  graphics: {
    "textureId": "oryx-lofi-scifi-vehicles-8px-sprite12",
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
  classId: 'jumper',
  name: 'jumper',
  graphics: {
    "textureId": "oryx-lofi-scifi-creatures-8px-sprite141",
  },
  movement: {
    ...advancedDirectionalDefaults.movement
  },
  'jump': {
    ...advancedDirectionalDefaults.jump
  }
}

export const directionalClass = {
  ...defaultPlayerClass,
  classId: 'directional',
  name: 'directional',
  graphics: {
    "textureId": "oryx-lofi-fantasy-characters-creatures-8px-sprite2",
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