import { EFFECT_CAMERA_SHAKE, ON_INTERACT } from "../constants";
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
  relationships: [{
    classId: 'c56931de-a0ce-4cba-9248-632855cabd96',
    event: ON_INTERACT,
    effect: {
      id: EFFECT_CAMERA_SHAKE
    }
  }],
  projectile: {
    classId: null,
    fireRate: 1000,
    lifetime: 3000,
    ammo: 0,
    velociry: 1,
  },
  movement: {
    pattern: null,
    spaceInvader: false,
    // movingPlatform: false,
  },
  unspawned: false,
  "attributes": {
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