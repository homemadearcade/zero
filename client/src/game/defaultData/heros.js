import { HERO_CLASS } from "../constants"
import { defaultObjectClass } from "./class"
import { directionalDefaults, carDefaults, vehicleDefaults } from "./movement"
import { jumperDefaults, floaterDefaults, noJumpDefaults } from "./jumping"

export const defaultHeroClass = {
  ...defaultObjectClass,
  type: HERO_CLASS,
}

export const vehicleClass = {
  ...defaultHeroClass,
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
  ...defaultHeroClass,
  classId: 'jumper',
  name: 'jumper',
  graphics: {
    "textureId": "oryx-lofi-scifi-creatures-8px-sprite141",
  },
  movement: {
    ...floaterDefaults.movement
  },
  'jump': {
    ...jumperDefaults.jump
  }
}

export const directionalClass = {
  ...defaultHeroClass,
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
//   ...defaultHeroClass,
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
//   ...defaultHeroClass,
//   classId: 'floater',
//   name: 'floater',
//   graphics: {
//     "textureId": "oryx-lofi-fantasy-characters-creatures-8px-sprite206",
//   },
//   "movement": {
//     ...floaterDefaults.movement
//   },
//   "jump": {
//     ...floaterDefaults.jump
//   },
// }