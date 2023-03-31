import { DATA_SOURCE_CORE_LIBRARY, FOREGROUND_LAYER_ID, POWERUP_CLASS } from "../core";
import { playerDepthModifier } from "../core";
import { BASIC_CLASS, DIRECTIONAL_CONTROLS, LAYER_ID_PREFIX, NPC_CLASS, PLAYER_CLASS, ZONE_CLASS } from "../core";
import { MOVEMENT_NONE } from "../entityModelPropertyDefaults";

export const defaultPowerupEntity = { 
  entityInterfaceId: BASIC_CLASS,
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
      playerTeleportToRelationTag: false,
    transformIntoEffect: false,
      playerTransformIntoRelationTag: false,
    automaticEntityTag: false,
    spawnOntoStageEffect: false,
    destroyAllEffect: true,
  }
}

export const defaultNpcEntity = { 
  entityInterfaceId: NPC_CLASS,
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

export const defaultZoneEntity = {
  entityInterfaceId: ZONE_CLASS, 
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
      playerTransformIntoRelationTag: false,
    destroyAllEffect: true,
    automaticEntityTag: true,
    spawnOntoStageEffect: false,
  }
}

export const defaultPlayerEntity = {
  entityInterfaceId: PLAYER_CLASS, 
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
      playerTeleportToRelationTag: false,
    transformIntoEffect: true,
      playerTransformIntoRelationTag: true,
    destroyAllEffect: true,
    automaticEntityTag: true,
    spawnOntoStageEffect: false,
  }
}

export const libraryEntityAugment = {
  editorInterface: {
    requiresUnlocking: true
  }
}

export const defaultBasicEntity = { 
  entityInterfaceId: BASIC_CLASS,
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
export const defaultEntityByCategory = {
  [BASIC_CLASS]: defaultBasicEntity,
  [PLAYER_CLASS]: defaultPlayerEntity,
  [NPC_CLASS]: defaultNpcEntity,
  [ZONE_CLASS]: defaultZoneEntity,
  [POWERUP_CLASS]: defaultPowerupEntity
}