import { EFFECT_CAMERA_SHAKE, EFFECT_COLLIDE, ON_COLLIDE, ON_INTERACT, WORLD_COLLIDE, WORLD_DESTROY, WORLD_WRAP } from "../constants";
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
  unspawned: false,
  worldBoundaryRelationship: WORLD_COLLIDE, // wrap, destroy
  relationships: [{
    classId: '557891dd-fa31-430e-86a9-75d42e8c5981',
    event: ON_COLLIDE,
    effect: {
      id: EFFECT_COLLIDE
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
    // movingPlatform: false,
  },
  attributes: {
    // Collision Response
    // ignoreGravity: false,
    ignoreWorldBounds: false,
    // fixedRotation: false,
    useMass: true,
    // static: false,

    // VFX
    glowing: false,
    // invisible: false,

    // Controls
    rotationFollowKeys: false,
    // ignoreUpKey: false,
  }
}