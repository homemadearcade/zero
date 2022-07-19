import { defaultGame } from "./game";
import { defaultPhaserPhysicsProperties } from "./general";

export const defaultObjectClass = {
  "speed": 1,
  "jumpVelocity": 1,
  width: defaultGame.world.nodeSize * 5,
  height: defaultGame.world.nodeSize * 5,
  ...defaultPhaserPhysicsProperties,
  "tint": null,
  "textureId": null,
  "controls": null
}