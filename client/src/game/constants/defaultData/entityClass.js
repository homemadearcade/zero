import { JUMP_NONE, MOVEMENT_NONE, BOUNDARY_COLLIDE,  DIRECTIONAL_CONTROLS, DATA_SOURCE_GAME_MODEL } from "../";
import { nodeSize } from "./general";
import { defaultProjectile } from "./projectile";
import { LAYER_ID_PREFIX ,  playerDepthModifier} from "../";
import { FOREGROUND_LAYER_ID, PLAYGROUND_LAYER_ID} from './layers'

export const PROJECTILE_INSTANCE_ID_PREFIX = 'oi-pr-'
export const SPAWNED_INSTANCE_ID_PREFIX = 'oi-s-'
export const PLAYER_INSTANCE_ID_PREFIX = 'oi-pl-'
export const OBJECT_INSTANCE_ID_PREFIX = 'oi-'

export const PLAYER_CLASS_TYPE_PREFIX = 'pl-'
export const BASIC_CLASS_TYPE_PREFIX = 'o-'
export const NPC_CLASS_TYPE_PREFIX = 'n-'
export const ZONE_CLASS_TYPE_PREFIX = 'z-'

/////////////////////////////////////
/////////////////////////////////////
// CLASSES
export const PLAYER_CLASS = 'PLAYER_CLASS'
export const BASIC_CLASS = 'BASIC_CLASS'
export const NPC_CLASS = 'NPC_CLASS'
export const ZONE_CLASS = 'ZONE_CLASS'
export const POWERUP_CLASS = 'POWERUP_CLASS'


export const classTypeToPrefix = {
  [ZONE_CLASS]: ZONE_CLASS_TYPE_PREFIX,
  [PLAYER_CLASS]: PLAYER_CLASS_TYPE_PREFIX,
  [BASIC_CLASS]: BASIC_CLASS_TYPE_PREFIX,
  [NPC_CLASS]: NPC_CLASS_TYPE_PREFIX
}

export const defaultMovement = {
  movementControlsBehavior: null,
  movementBehavior: MOVEMENT_NONE,
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
  // entityClassId: null,
}

export const defaultJump = {
  jumpControlsBehavior: JUMP_NONE,
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
  ignoreStageBoundaries: false,
  ignoreSides: [],
}

export const defaultClass = {
  dataSource: DATA_SOURCE_GAME_MODEL,
  // lastSelectedDate: 0,
  lastEditedDate: 0,
  isRemoved: false,
  boundaryRelation: BOUNDARY_COLLIDE,
  entityClassId: null,
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
    textureTint: null,
    invisible: false,
    glowing: false,
    layerId: LAYER_ID_PREFIX+PLAYGROUND_LAYER_ID,
    depthOverride: 0,
    depthModifier: 0,
  },
  editorInterface: {
    isSelectorObscured: false,
    fixedAspectRatio: false,
    notVisibleInSelector: false,
    notSelectableInStage: false,
    noTeleportEffect: false,
    noPlayerTeleportRelation: false,
    noPlayerTransformRelation: false,
    noDestroyAllEffect: false,
    noTransformEffect: false,
    noSpawnAnywhereEffect: false
  },
  projectile: {
    ...defaultProjectile
  },
  camera: {
    zoom: 3,
    lerpX: 0.09,
    lerpY: 0.09,
  },
  relationTags: {},
  visualTags: []
}

export const defaultNpcClass = { 
  classInterfaceCategory: NPC_CLASS,
  // movement: {
  //   movementBehavior: MOVEMENT_TURN_ON_COLLIDE,
  //   velocityX: 50,
  // },
  // collisionResponse: {
  //   bounciness: 0.5,
  // }
}

export const defaultZoneClass = {
  classInterfaceCategory: ZONE_CLASS, 
  collisionResponse: {
    immovable: true,
  },
  graphics: {
    invisible: true,
    layerId: LAYER_ID_PREFIX+FOREGROUND_LAYER_ID
  },
  editorInterface: {
    noTransformEffect: true,
  }
}

export const defaultPlayerClass = {
  classInterfaceCategory: PLAYER_CLASS, 
  graphics: {
    depthModifier: playerDepthModifier
  },
  movement: { 
    movementControlsBehavior: DIRECTIONAL_CONTROLS
  },
  collisionResponse: {
    notPushable: false
  }
}

export const libraryClassAugment = {
  editorInterface: {
    isSelectorObscured: true
  }
}

export const defaultBasicClass = { 
  classInterfaceCategory: BASIC_CLASS,
  movement: {
    movementBehavior: MOVEMENT_NONE,
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
  [NPC_CLASS]: 'NPC',
  [POWERUP_CLASS]: 'Powerup',
}