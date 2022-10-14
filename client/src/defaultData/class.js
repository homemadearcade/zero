import { HERO_CLASS, MOVEMENT_NONE, NPC_CLASS, OBJECT_CLASS, SIDE_DOWN, SIDE_LEFT, SIDE_RIGHT, SIDE_UP, WORLD_COLLIDE, ZONE_CLASS } from "../constants";
import { nodeSize } from "./general";

export const defaultMovement = {
  controls: null,
  pattern: MOVEMENT_NONE,
  velocityX: 0,
  velocityY: 0,
  speed: 100,
  jumpSpeed: 50,
  floatSpeed: 20,
  ignoreGravity: false,
  dragY: 1,
  dragX: 1,
  gravityY: 0,
  gravityX: 0,
  disableDownKey: false,
  allowDoubleJump: false,
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
  interfaceLocked: false,
  worldBoundaryRelation: WORLD_COLLIDE,
  classId: null,
  movement: {
    ...defaultMovement
  },
  collisionResponse: {
    ...defaultCollisionResponse
  },
  graphics: {
    textureId: null,
    width: nodeSize * 6,
    height: nodeSize * 6,
    tint: null,
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