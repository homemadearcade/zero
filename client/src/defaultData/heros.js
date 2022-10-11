import { ADVENTURER_CONTROLS, CAR_CONTROLS, EFFECT_COLLIDE, EFFECT_CUTSCENE, EFFECT_DIALOGUE, EFFECT_STICK_TO, FLOATER_CONTROLS, HERO_CLASS, ON_COLLIDE, ON_INTERACT, PLATFORMER_CONTROLS, SIDE_LEFT, SIDE_RIGHT, SIDE_UP, SPACESHIP_CONTROLS } from "../constants"
import { defaultObjectClass } from "./class"
import { adventurerDefaults, carDefaults, floaterDefaults, platformerDefaults, spaceshipDefaults } from "./movement"

export const defaultHeroClass = {
  ...defaultObjectClass,
  relations: {
    r1 : {
      classId: "e6982bea-898f-4562-ae89-b2c07f3bb353",
      event: ON_INTERACT,
      effect: {
        type: EFFECT_CUTSCENE,
        cutsceneId: 'cutscene1'
      },
      sides: []
    },
    r2: {
      classId: "e6982bea-898f-4562-ae89-b2c07f3bb353",
      event: ON_COLLIDE,
      effect: {
        type: EFFECT_CUTSCENE,
      },
      sides: [SIDE_UP]
    }
  },
  type: HERO_CLASS,
}

export const spaceshipClass = {
  ...defaultHeroClass,
  classId: 'spaceship',
  name: 'spaceship',
  graphics: {
    "textureId": "oryx-lofi-scifi-vehicles-8px-sprite12",
  },
  "movement": {
    ...spaceshipDefaults.movement
  },
}

export const platformerClass = {
  ...defaultHeroClass,
  classId: 'platformer',
  name: 'platformer',
  graphics: {
    "textureId": "oryx-lofi-scifi-creatures-8px-sprite141",
  },
  movement: {
    ...platformerDefaults.movement
  },
}

export const adventurerClass = {
  ...defaultHeroClass,
  classId: 'adventurer',
  name: 'adventurer',
  graphics: {
    "textureId": "oryx-lofi-fantasy-characters-creatures-8px-sprite2",
  },
  movement: {
    ...adventurerDefaults.movement
  },
}

export const carClass = {
  ...defaultHeroClass,
  classId: 'car',
  name: 'car',
  graphics: {
    "textureId": "kenney-roguelike-environment-16px-sprite1112",
  },
  "movement": {
    ...carDefaults.movement
  },
}

export const floaterClass = {
  ...defaultHeroClass,
  classId: 'floater',
  name: 'floater',
  graphics: {
    "textureId": "oryx-lofi-fantasy-characters-creatures-8px-sprite206",
  },
  "movement": {
    ...floaterDefaults.movement
  },
}