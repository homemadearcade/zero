import { EFFECT_COLLIDE, EFFECT_STICK_TO, ON_COLLIDE, ON_INTERACT, SIDE_DOWN, SIDE_LEFT, SIDE_RIGHT, SIDE_UP, WORLD_COLLIDE, WORLD_DESTROY, WORLD_WRAP } from "../constants";
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
  relations: [
    {
      classId: '557891dd-fa31-430e-86a9-75d42e8c5981',
      event: ON_COLLIDE,
      effect: {
        id: EFFECT_STICK_TO
      },
      sides: [SIDE_LEFT]
    },
    {
      classId: '557891dd-fa31-430e-86a9-75d42e8c5981',
      event: ON_COLLIDE,
      effect: {
        id: EFFECT_COLLIDE
      },
      sides: [SIDE_UP]
    }
  ],
  collisionResponse: {
    ignoreSides: {
      [SIDE_DOWN]: false,
      [SIDE_UP]: false,
      [SIDE_LEFT]: false,
      [SIDE_RIGHT]: false,
    }
  },
  projectile: {
    classId: null,
    fireRate: 1000,
    lifetime: 3000,
    ammo: 0,
    velociry: 1,
  },
  movement: {
    pattern: null,
    velocity: [0, 30],
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