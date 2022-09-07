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
    // Position
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

    // Visibility
    unspawned: false,
    invisible: false,
    seeThroughOnHeroCollide: false,

    // Controls
    rotationFollowKeys: false,
    disableUpKeyMovement: false
  }
}