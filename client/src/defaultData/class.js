import { ADVENTURER_CONTROLS, EFFECT_COLLIDE, EFFECT_STICK_TO, HERO_CLASS, MOVEMENT_NONE, NPC_CLASS, OBJECT_CLASS, ON_COLLIDE, ON_INTERACT, SIDE_DOWN, SIDE_LEFT, SIDE_RIGHT, SIDE_UP, WORLD_COLLIDE, WORLD_DESTROY, WORLD_WRAP, ZONE_CLASS } from "../constants";
import { nodeSize } from "./general";

export const defaultMovement = {
  controls: null,
  pattern: MOVEMENT_NONE,
  velocityX: 0,
  velocityY: 0,
  speed: 100,
  jumpSpeed: 300,
  ignoreGravity: false,
  dragY: 1,
  dragX: 1,
  gravityY: 0,
  gravityX: 0
}

export const defaultCollisionResponse = {
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
}

export const defaultObjectClass = {
  unspawned: false,
  locked: false,
  worldBoundaryRelationship: WORLD_COLLIDE,
  relations: [],
  movement: {
    ...defaultMovement
  },
  collisionResponse: {
    ...defaultCollisionResponse
  },
  graphics: {
    width: nodeSize * 6,
    height: nodeSize * 6,
    tint: null,
    textureId: null,
    invisible: false,
    glowing: false,
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

export const classTypeToDisplayName = {
  [HERO_CLASS]: 'Player',
  [OBJECT_CLASS]: 'Object',
  [ZONE_CLASS]: 'Zone',
  [NPC_CLASS]: 'NPC'
}