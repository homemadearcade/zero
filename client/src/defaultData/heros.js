import { defaultPhaserPhysicsProperties } from "./general"
import { defaultGame } from "./game"
export const defaulHeroClass = {
  "speed": 100,
  "jumpVelocity": 100,
  ...defaultPhaserPhysicsProperties,
  "mass": 30,
  "tint": null,
  width: defaultGame.world.nodeSize * 5,
  height: defaultGame.world.nodeSize * 5,
  "textureId": null,
  "controls": "zelda",
  
}

export const spaceshipClass = {
  ...defaulHeroClass,
  "jumpVelocity": 0,
  ...defaultPhaserPhysicsProperties,
  "frictionAir": 0.1,
  "density": .01,
  "fixedRotation": true,
  "textureId": "ship2",
  "controls": "spaceship"
}