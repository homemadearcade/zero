import { PLAYER_CLASS, JUMP_NONE, MOVEMENT_NONE, NPC_CLASS, BASIC_CLASS, PLAYGROUND_CANVAS_ID, BOUNDARY_COLLIDE, ZONE_CLASS, ZONE_INSTANCE_CANVAS_ID, DIRECTIONAL_CONTROLS, PROJECTILE_NONE } from "../";
import { nodeSize } from "./general";
import { defaultProjectile } from "./projectile";

export const defaultMovement = {
  controls: null,
  pattern: MOVEMENT_NONE,
  velocityX: 0,
  velocityY: 0,
  speed: 100,
  speedAngular: 100,
  ignoreGravity: true,
  dragY: 1,
  dragX: 1,
  dragAngular: 100,
  gravityY: 0,
  gravityX: 0,
  disableDownKey: false,
  // classId: null,
}

export const defaultJump = {
  style: JUMP_NONE,
  ground: 0,
  air: 0,
  cooldown: 100,
}

export const defaultCollisionResponse = {
  bounciness: 0,
  friction: 0.1,
  mass: 10,
  notPushable: true,
  immovable: false,
  ignoreBoundaries: false,
  ignoreSides: [],
}

export const defaultClass = {
  interfaceLocked: false,
  // lastSelectedDate: 0,
  lastEditedDate: 0,
  isRemoved: false,
  boundaryRelation: BOUNDARY_COLLIDE,
  classId: null,
  movement: {
    ...defaultMovement
  },
  collisionResponse: {
    ...defaultCollisionResponse
  },
  jump: {
    ...defaultJump
  },
  graphics: {
    textureId: null,
    width: nodeSize * 2,
    height: nodeSize * 2,
    tint: null,
    invisible: false,
    glowing: false,
    layerId: PLAYGROUND_CANVAS_ID,
  },
  projectile: {
    ...defaultProjectile
  },
  camera: {
    zoom: 3,
    lerpX: 0.09,
    lerpY: 0.09,
  },
  tags: {}
}

export const defaultNpcClass = { 
  type: NPC_CLASS,
  // movement: {
  //   pattern: MOVEMENT_TURN_ON_COLLIDE,
  //   velocityX: 50,
  // },
  // collisionResponse: {
  //   bounciness: 0.5,
  // }
}

export const defaultZoneClass = {
  type: ZONE_CLASS, 
  collisionResponse: {
    immovable: true,
  },
  graphics: {
    invisible: true,
    layerId: ZONE_INSTANCE_CANVAS_ID
  }
}

export const defaultPlayerClass = {
  type: PLAYER_CLASS, 
  movement: { 
    controls: DIRECTIONAL_CONTROLS
  },
  collisionResponse: {
    notPushable: false
  }
}

export const libraryClassAugment = {
  interfaceLocked: true
}

export const defaultBasicClass = { 
  type: BASIC_CLASS,
  movement: {
    pattern: MOVEMENT_NONE,
  },
  collisionResponse: {
    notPushable: true,
    mass: 100,
    bounciness: 0,
  }
}

export const classTypeToDisplayName = {
  [PLAYER_CLASS]: 'Player',
  [BASIC_CLASS]: 'Object',
  [ZONE_CLASS]: 'Zone',
  [NPC_CLASS]: 'NPC'
}