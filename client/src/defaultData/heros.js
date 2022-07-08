import { defaultPhaserPhysicsProperties } from "./general"

export const defaulHeroClass = {
  "speed": 100,
  "jumpVelocity": 100,
  ...defaultPhaserPhysicsProperties,
  "mass": 30,
  "tint": null,
  "spriteId": null,
  "controls": "zelda"
}

export const spaceshipClass = {
  "speed": 100,
  "jumpVelocity": 0,
  ...defaultPhaserPhysicsProperties,
  "frictionAir": 0.1,
  "density": .01,
  "tint": null,
  "fixedRotation": true,
  "spriteId": "ship2",
  "controls": "spaceship"
}