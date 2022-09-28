import { EFFECT_COLLIDE, EFFECT_CUTSCENE, EFFECT_DIALOGUE, EFFECT_STICK_TO, ON_COLLIDE, ON_INTERACT, SIDE_LEFT, SIDE_RIGHT, SIDE_UP } from "../constants"
import { defaultPhaserPhysicsProperties, nodeSize } from "./general"

export const defaulHeroClass = {
  ...defaultPhaserPhysicsProperties,
  "speed": 100,
  "jumpVelocity": 100,
  "mass": 30,
  "tint": null,
  width: nodeSize * 5,
  height: nodeSize * 5,
  "textureId": null,
  "controls": "zelda",
  "camera": {
    zoom: 3,
    lerpX: 0.09,
    lerpY: 0.09,
  },
  type: 'hero'
}

export const spaceshipClass = {
  ...defaulHeroClass,
  ...defaultPhaserPhysicsProperties,
  "jumpVelocity": 0,
  "drag": 0.1,
  "density": .01,
  attributes: {
    "fixedRotation": true,
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
  "textureId": "ship2",
  "controls": "spaceship",
  type: 'hero'
}