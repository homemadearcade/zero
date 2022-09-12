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
  relationships: [],
  projectile: {
    classId: null,
    fireRate: 1000,
    lifetime: 3000,
    ammo: 0,
    velociry: 1,
  },
  "attributes": {
    // Movement
    sideToSide: false,
    upAndDown: false,
    wanderer: false,
    spaceInvader: false,

    // Collision
    // ignoreGravity: false,
    // fixedRotation: false,
    // useMass: false,
    // static: false,

    // VFX
    glowing: false,
    // invisible: false,

    // Controls
    rotationFollowKeys: false,
    // ignoreUpKey: false,
  }
}