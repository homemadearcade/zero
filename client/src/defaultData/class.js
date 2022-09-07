import { defaultPhaserPhysicsProperties, nodeSize } from "./general";

export const defaultObjectClass = {
  "speed": 1,
  "jumpVelocity": 1,
  width: nodeSize * 6,
  height: nodeSize * 6,
  ...defaultPhaserPhysicsProperties,
  "tint": null,
  "textureId": null,
  "controls": null,
  "behaviors": {
    // Movement
    sideToSide: false,
    upAndDown: false,
    wanderer: false,
    spaceInvader: false,

    // Collision
    ignoreWorldBoundaries: false,
    ignoreGravity: false,
    fixedRotation: false,
    useMass: false,
    static: false,

    // VFX
    glowing: false,
    invisible: false,

    // Controls
    rotationFollowKeys: false,
    disableUpKeyMovement: false
  }
}