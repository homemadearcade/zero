import { defaultPhaserPhysicsProperties } from "./general";

export const defaultObjectClass = {
  "speed": 100,
  "jumpVelocity": 100,
  ...defaultPhaserPhysicsProperties,
  "tint": null,
  "spriteId": "ship",
  "controls": null
}