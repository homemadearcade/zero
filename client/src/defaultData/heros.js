import { defaultPhaserPhysicsProperties, nodeSize } from "./general"

export const defaulHeroClass = {
  "speed": 100,
  "jumpVelocity": 100,
  ...defaultPhaserPhysicsProperties,
  "mass": 30,
  "tint": null,
  width: nodeSize * 5,
  height: nodeSize * 5,
  "textureId": null,
  "controls": "zelda",
  type: 'hero'
}

export const spaceshipClass = {
  ...defaulHeroClass,
  "jumpVelocity": 0,
  ...defaultPhaserPhysicsProperties,
  "frictionAir": 0.1,
  "density": .01,
  "fixedRotation": true,
  "textureId": "ship2",
  "controls": "spaceship",
  type: 'hero'
}