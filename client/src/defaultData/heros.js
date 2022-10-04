import { ADVENTURER_CONTROLS, EFFECT_COLLIDE, EFFECT_CUTSCENE, EFFECT_DIALOGUE, EFFECT_STICK_TO, ON_COLLIDE, ON_INTERACT, PLATFORMER_CONTROLS, SIDE_LEFT, SIDE_RIGHT, SIDE_UP, SPACESHIP_CONTROLS } from "../constants"
import { defaultPhaserPhysicsProperties, nodeSize } from "./general"

export const defaulHeroClass = {
  ...defaultPhaserPhysicsProperties,
  "speed": 100,
  "jumpSpeed": 0,
  "mass": 30,
  "tint": null,
  width: nodeSize * 5,
  height: nodeSize * 5,
  "textureId": null,
  "camera": {
    zoom: 3,
    lerpX: 0.09,
    lerpY: 0.09,
  },
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
  ...defaultPhaserPhysicsProperties,
  "dragX": 0.25,
  "dragY": 0.25,
  attributes: {
    "fixedRotation": true,
  },
  classId: 'spaceship',
  "textureId": "oryx-lofi-scifi-vehicles-8px-sprite12",
  "controls": {
    type: SPACESHIP_CONTROLS,
  },
  name: 'spaceship',
  type: 'hero'
}

export const platformerClass = {
  ...defaulHeroClass,
  ...defaultPhaserPhysicsProperties,
  "jumpSpeed": 300,
  "dragX": 0.1,
  "textureId": "oryx-lofi-scifi-creatures-8px-sprite141",
  classId: 'platformer',
  "controls": {
    type: PLATFORMER_CONTROLS,
    disableUpKeyMovement: true,
  },
  name: 'jumper',
  type: 'hero'
}

export const adventurerClass = {
  ...defaulHeroClass,
  ...defaultPhaserPhysicsProperties,
  "textureId": "oryx-lofi-fantasy-characters-creatures-8px-sprite2",
  "dragX": 0,
  "dragY": 0,
  classId: 'adventurer',
  name: 'classic',
  "controls": {
    type: ADVENTURER_CONTROLS,
    // stickyMovement: true
  },
  type: 'hero'
}