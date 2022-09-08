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
  "frictionAir": 0.1,
  "density": .01,
  behaviors: {
    "fixedRotation": true,
  },
  "textureId": "ship2",
  "controls": "spaceship",
  type: 'hero'
}