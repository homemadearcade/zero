import { ADVENTURER_CONTROLS, EFFECT_COLLIDE, EFFECT_CUTSCENE, EFFECT_DIALOGUE, EFFECT_STICK_TO, ON_COLLIDE, ON_INTERACT, PLATFORMER_CONTROLS, SIDE_LEFT, SIDE_RIGHT, SIDE_UP, SPACESHIP_CONTROLS } from "../constants"
import { defaultObjectClass } from "./class"

export const defaulHeroClass = {
  ...defaultObjectClass,
  relations: [
    {
      classId: 'e8e7e851-b182-4bb5-9a77-5badabda7c1d',
      event: ON_INTERACT,
      effect: {
        id: EFFECT_CUTSCENE,
        cutsceneId: 'cutscene1'
      },
      sides: []
    },
    {
      classId: '557891dd-fa31-430e-86a9-75d42e8c5981',
      event: ON_COLLIDE,
      effect: {
        id: EFFECT_COLLIDE
      },
      sides: [SIDE_UP]
    }
  ],
  type: 'hero'
}

export const spaceshipClass = {
  ...defaulHeroClass,
  classId: 'spaceship',
  name: 'spaceship',
  graphics: {
    "textureId": "oryx-lofi-scifi-vehicles-8px-sprite12",
  },
  "movement": {
    pattern: SPACESHIP_CONTROLS,
    "dragX": 0.25,
    "dragY": 0.25,
  },
}

export const platformerClass = {
  ...defaulHeroClass,
  classId: 'platformer',
  name: 'jumper',
  graphics: {
    "textureId": "oryx-lofi-scifi-creatures-8px-sprite141",
  },
  movement: {
    type: PLATFORMER_CONTROLS,
    "dragX": 0.1,
    disableUpKeyMovement: true,
  },
}

export const adventurerClass = {
  ...defaulHeroClass,
  classId: 'adventurer',
  name: 'classic',
  graphics: {
    "textureId": "oryx-lofi-fantasy-characters-creatures-8px-sprite2",
  },
  movement: {
    controls: ADVENTURER_CONTROLS,
    "dragX": 0,
    "dragY": 0,
  },
}