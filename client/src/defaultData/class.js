import { defaultPhaserPhysicsProperties, nodeSize } from "./general";

export const defaultObjectClass = {
  "speed": 1,
  "jumpVelocity": 1,
  width: nodeSize * 5,
  height: nodeSize * 5,
  ...defaultPhaserPhysicsProperties,
  "tint": null,
  "textureId": null,
  "controls": null
}