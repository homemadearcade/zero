import { ADVENTURER_CONTROLS, EFFECT_COLLIDE, EFFECT_STICK_TO, ON_COLLIDE, ON_INTERACT, SIDE_DOWN, SIDE_LEFT, SIDE_RIGHT, SIDE_UP, WORLD_COLLIDE, WORLD_DESTROY, WORLD_WRAP } from "../constants";
import { defaultPhaserPhysicsProperties, nodeSize } from "./general";

export const defaultObjectClass = {
  "speed": 1,
  "jumpSpeed": 1,
  width: nodeSize * 6,
  height: nodeSize * 6,
  ...defaultPhaserPhysicsProperties,
  "tint": null,
  "textureId": null,
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
  movement: {
    pattern: null,
    velocity: [0, 0],
  },
  attributes: {},

  projectile: {
    classId: null,
    cooldown: 200,
    lifetime: 3000,
    ammo: 0,
    speed: 300,
  },
  "camera": {
    zoom: 3,
    lerpX: 0.09,
    lerpY: 0.09,
  },
  "controls": {
    type: ADVENTURER_CONTROLS,
  },
}