import { defaultPhaserPhysicsProperties } from "./general";

export const defaultObjectClass = {
  "speed": 1,
  "jumpVelocity": 1,
  ...defaultPhaserPhysicsProperties,
  "tint": null,
  "textureId": null,
  "controls": null
}