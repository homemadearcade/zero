import { EFFECT_COLLIDE, EFFECT_STICK_TO, ON_COLLIDE, ON_INTERACT, SIDE_DOWN, SIDE_LEFT, SIDE_RIGHT, SIDE_UP, WORLD_COLLIDE, WORLD_DESTROY, WORLD_WRAP } from "../constants";
import { defaultPhaserPhysicsProperties, nodeSize } from "./general";

export const defaultObjectClass = {
  "speed": 1,
  "jumpSpeed": 1,
  width: nodeSize * 6,
  height: nodeSize * 6,
  ...defaultPhaserPhysicsProperties,
  "tint": null,
  "textureId": null,
  "controls": null,
  unspawned: false,
  worldBoundaryRelationship: WORLD_COLLIDE, // wrap, destroy
  relations: [],
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
    velocity: 1,
  },
  movement: {
    pattern: null,
    velocity: [0, 0],
  },
  attributes: {}
}