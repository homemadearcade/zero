import { ADVENTURER_CONTROLS, EFFECT_COLLIDE, EFFECT_STICK_TO, ON_COLLIDE, ON_INTERACT, SIDE_DOWN, SIDE_LEFT, SIDE_RIGHT, SIDE_UP, WORLD_COLLIDE, WORLD_DESTROY, WORLD_WRAP } from "../constants";
import { nodeSize } from "./general";

export const defaultObjectClass = {
  unspawned: false,
  worldBoundaryRelationship: WORLD_COLLIDE,
  relations: [],
  graphics: {
    width: nodeSize * 6,
    height: nodeSize * 6,
    tint: null,
    textureId: null,
    invisible: false,
    glowing: false,
  },
  collisionResponse: {
    bounciness: 0,
    friction: 0.1,
    mass: 10,
    notPushable: false,
    immovable: false,
    ignoreWorldBoundaries: false,
    ignoreSides: {
      [SIDE_DOWN]: false,
      [SIDE_UP]: false,
      [SIDE_LEFT]: false,
      [SIDE_RIGHT]: false,
    }
  },
  movement: {
    controls: null,
    pattern: null,
    initialVelocityX: 0,
    initialVelocityY: 0,
    speed: 100,
    jumpSpeed: 300,
    ignoreGravity: false,
    dragY: 0.1,
    dragX: 0.1,
  },
  projectile: {
    classId: null,
    cooldown: 200,
    lifetime: 3000,
    ammo: 0,
    speed: 300,
  },
  camera: {
    zoom: 3,
    lerpX: 0.09,
    lerpY: 0.09,
  },
}