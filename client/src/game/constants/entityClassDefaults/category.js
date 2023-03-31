import { FOREGROUND_LAYER_ID, POWERUP_CLASS } from "../core";
import { playerDepthModifier } from "../core";
import { BASIC_CLASS, DIRECTIONAL_CONTROLS, LAYER_ID_PREFIX, NPC_CLASS, PLAYER_CLASS, ZONE_CLASS } from "../core";
import { MOVEMENT_NONE } from "../entityClassPropertyDefaults";

export const defaultPowerupClass = { 
  classInterfaceCategory: BASIC_CLASS,
  graphics: {
    glowing: true
  },
  movement: {
    movementBehavior: MOVEMENT_NONE,
  },
  collisionResponse: {
    notPushable: true,
    mass: 100,
    bounciness: 0,
  },
  autogeneration: {
    teleportToEffect: false,
    transformIntoEffect: false,
    automaticClassTag: false,
    spawnAnywhereEffect: false,
  }
}

export const defaultNpcClass = { 
  classInterfaceCategory: NPC_CLASS,
  // autogeneration: {

  // }
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
  autogeneration: {
    teleportToEffect: true,
    playerTeleportToRelationTag: true,
    transformIntoEffect: false,
    spawnAnywhereEffect: false,
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
  },
  autogeneration: {
    teleportToEffect: false,
    playerTransformIntoRelationTag: true,
    spawnAnywhereEffect: false,
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

//mapping from class type to default class  
export const defaultClassByCategory = {
  [BASIC_CLASS]: defaultBasicClass,
  [PLAYER_CLASS]: defaultPlayerClass,
  [NPC_CLASS]: defaultNpcClass,
  [ZONE_CLASS]: defaultZoneClass,
  [POWERUP_CLASS]: defaultPowerupClass
}